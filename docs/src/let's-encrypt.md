---
outline: deep
---

免费部署SSL证书并自动续期
## 安装Certbot
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install certbot

#CentOSsudo
yum install certbot

# 安装腾讯云DNS插件，需要先安装pip环境
sudo apt install python3-venv
python3 -m venv certbot-venv
# 开启certbot-venv环境
source certbot-venv/bin/activate
# 执行pip包安装工作
pip install certbot-dns-tencentcloud
# 退出certbot-venv环境
deactivate
```

## 生成泛域名证书
- 获取腾讯云API密钥
  - 登录腾讯云控制台，进入 访问管理 > API密钥管理。
  - 创建子账号或使用主账号，生成 SecretId 和 SecretKey。
  - 授予该账号 DNS解析（DNSPod）全读写权限。
- 配置插件凭据文件
在/var/secrets 下创建文件 tencentcloud.ini：
```bash
dns_tencentcloud_secret_id = "你的SecretId"
dns_tencentcloud_secret_key = "你的SecretKey"
```
- 启动Certbot手动模式
```bash
sudo certbot certonly --manual --preferred-challenges dns -d "*.example.com" -d example.com --email your-email@example.com --agree-tos --manual-public-ip-logging-ok
```
- 添加DNS TXT记录
Certbot会提示类似信息：
```bash
Please deploy a DNS TXT record under: _acme-challenge.example.com
with the following value: XXXXXXXXXXXXXXXXXXXXXXXX
```
- 登录腾讯云控制台 > DNS解析，为域名添加TXT记录：
  - 主机记录：_acme-challenge
  - 记录类型：TXT
  - 记录值：XXXXXXXXXXXXXXXXXXXXXXXX
- 等待DNS生效（可用 dig -t txt _acme-challenge.example.com 验证）。
完成申请
返回服务器按回车继续，证书生成路径在/var/letsencrypt/live/example.com文件夹下面。Nginx配置文件如下：
```bash
# bbs.conf
server {
    listen 443 ssl;
    ssl_certificate /etc/letsencrypt/live/xxx.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/xxx.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    server_name xxx.com;
    root /var/www/html/xxx/public;
    index index.php index.html index.htm;

    access_log /var/log/nginx/laravel_access.log;
    error_log /var/log/nginx/laravel_error.log;

    location / {
            try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
            include fastcgi_params;
            fastcgi_pass unix:/run/php/php8.1-fpm.sock;
            fastcgi_index index.php;
            fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
    }

    location ~ /\. {
            deny all;
    }

    location ~ /(storage|logs)/ {
            deny all;
    }
}
server {
    listen 80;
    server_name xxx.com;

    return 301 https://$host$request_uri;
}
```

## 自动续期证书
- 续期测试
```bash
sudo certbot renew --dry-run
```
- 添加定时任务
```bash
sudo crontab -e -u www-data
#添加以下行（每天检查续期）
0 0 */7 * * certbot renew --quiet && systemctl reload nginx
```

## 验证证书
- 访问 [SSL Labs测试](https://www.ssllabs.com/ssltest/) 检查评分。
- 浏览器访问 https://xxx.com，确认锁标志有效。