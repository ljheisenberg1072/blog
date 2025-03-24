---
outline: deep
---

系统使用的是Ubuntu24.04，默认是root用户

查看所有用户
```bash
cat /etc/passwd

# 用户名:密码:用户ID:组ID:用户信息:家目录:登录Shell
root:x:0:0:root:/root:/bin/bash

#只显示用户名列表
cut -d: -f1 /etc/passwd
#解释：-d:表示字段分隔符：，-f1提取第1个字段

root
ubuntu
www-data
....
```
切到ubuntu用户，默认为Apache和Nginx创建了www-data用户
```bash
su ubuntu
cd /home/ubuntu
```
更新系统和镜像
```bash
sudo apt update
sudo apt upgrade
```

## 1. 安装PHP
```bash
# 默认安装的PHP8.3，同时安装php-cli/php-fpm
sudo apt install php php-cli php-fpm
# 查看php服务位置
which php
which php8.3
# 查看php配置文件位置
php --ini
```
安装PHP扩展
```bash
# 查看所有已安装的扩展
php -m
# 安装redis和opcache扩展
sudo apt install php8.3-redis php8.3-opcache
```
注意：php-fpm8.3是常见的可执行命令，which会显示路径，php8.3-fpm是PHP8.3的systemd服务单元名称，全称是php8.3-fpm.service，用户通过systemctl启动、停止和管理该PHP-FPM服务
安装多版本PHP
```bash
# 安装PHP源
sudo add-apt-repository ppa:ondrej/php
```
安装PHP7.3（可以是其他任意版本）
```bash
sudo apt install php7.3 php7.3-cli php7.3-fpm php7.3-mbstring php7.3-xml php7.3-mysql php7.3-curl
```
切换PHP版本
```bash
sudo update-alternatives --config php
```
启动PHP
```bash
# 查看php状态
sudo systemctl status php8.3-fpm
# 启动/重启/停止php
sudo systemctl start/restart/stop php8.3-fpm
# 开机自启动
sudo systemctl enable php8.3-fpm
```

## 2. 安装Composer
```bash
curl -sS https://getcomposer.org/installer | php
```
将Composer移动到全局可执行目录，方便全局使用
```bash
sudo mv composer.phar /usr/local/bin/composer
```
设置composer国内源镜像
```bash
# 查看当前镜像
composer config -g -l
# 全局更换compooser镜像
composer config -g repo.packagist composer https://mirrors.aliyun.com/composer/
# 取消配置
composer config -g --unset repos.packagist
# 当前项目更换composer镜像
composer config repo.packagist composer https://mirrors.aliyun.com/composer/
```
| 目录              | 用途                | 可执行权限    |
|:----------------|:------------------|:---------|
| /usr/bin        | 存放系统中大部分用户级可执行程序  | 所有用户可执行  |
| /usr/sbin       | 存放系统管理员使用的管理工具    | 主要由管理员执行 |
| /usr/local/bin  | 存放本地手动安装的用户级可执行程序 | 所有用户可执行  |
| /usr/local/sbin | 存放本地手动安装的系统管理工具   | 主要由管理员执行 |

## 3. 安装Nginx
使用apt命令安装Nginx：
```bash
sudo apt install nginx
```
启动Nginx
```bash
# 查看nginx状态
sudo systemctl status nginx
# 启动/重启/停止nginx
sudo systemctl start/restart/stop nginx
# 开机自启动
sudo systemctl enable nginx

# 测试 Nginx 配置是否正确
sudo nginx -t
# 测试通过，优先使用 reload 生效，仅重新加载配置，不影响现有连接，比restart更平滑
sudo systemctl reload nginx
```
Laravel10.x项目的Nginx配置
```bash
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

	location ~ /logs/ {
		deny all;
	}
}
server {
	listen 80;
	server_name xxx.com;

	return 301 https://$host$request_uri;
}
```

## 4. 安装MySQL
安装 MySQL Server
```bash
sudo apt install mysql-server
```
启动 MySQL 服务
```bash
# 查看mysql状态
sudo systemctl status mysql
# 启动/重启/停止mysql
sudo systemctl start/restart/stop mysql
# 开机自启动
sudo systemctl enable mysql
```
配置 MySQL
```bash
sudo mysql_secure_installation
# VALIDATE PASSWORD COMPONENT.....（使用密码强度校验组件） 输入： n
# New Password:（设置新密码,并重复一遍)
# Remove anonymous users (删除匿名用户) n
# Disallow root login remotely(拒绝远程root账号登录） n
# Remove test database and access to it(移除test数据库） n
# Reload privilege tables now (现在就重新载入权限表） y
```
执行此命令后，脚本会提示你进行一系列安全配置：
- 设置 root 用户的密码。
- 是否删除匿名用户。
- 是否禁止 root 用户的远程登录。
- 是否删除测试数据库。
- 是否重新加载权限表。

MySQL 8.0 默认使用 auth_socket 插件，这意味着 root 只能通过 sudo mysql 登录，而不是 mysql -u root -p。
1. 直接用 sudo 登录：
```bash
sudo mysql
```
如果能成功进入 MySQL 命令行，说明 root 账户没有密码，而是使用 auth_socket 插件认证。

2. 检查 root 用户的认证方式：
```sql
SELECT user, host, plugin FROM mysql.user WHERE user='root';
```
如果显示：
```sql
+------+-----------+-----------------------+
| user | host      | plugin                |
+------+-----------+-----------------------+
| root | localhost | auth_socket           |
+------+-----------+-----------------------+
```
说明 root 用户使用 auth_socket，而不是密码认证。

3. 修改 root 认证方式（可选） 如果你希望 root 能用密码登录，而不是 auth_socket，可以执行：（不建议，建议单独创建一个新的用户）
```sql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'NewPassword';
FLUSH PRIVILEGES;
EXIT;
```
登录 MySQL
```bash
sudo mysql -u root -p
```
检查 MySQL 版本
```bash
# 在mysql中
mysql> SELECT VERSION()
# 在bash或者shell中
mysql --version
```
防火墙设置
```bash
# 防火墙状态
sudo ufw status
# 允许3306端口
sudo ufw allow 3306
```
配置 MySQL 远程访问
```bash
# 打开配置文件
sudo vim /etc/mysql/mysql.conf.d/mysqld.cnf
# 找到bind-address把127.0.0.1改成0.0.0.0
bind-address = 0.0.0.0
# 重启mysql
sudo systemctl restart mysql
```
在MySQL中为远程访问的用户授权，root使用auth_socket模式，新用户使用mysql_native_password模式
```sql
CREATE USER 'your_user'@'%' IDENTIFIED WITH mysql_native_password BY 'your_password';
GRANT ALL PRIVILEGES ON *.* TO 'your_user'@'%';
FLUSH PRIVILEGES;
```

## 5. 安装Redis
安装Redis服务器
```bash
sudo apt install redis-server
```
启动Redis服务器
```bash
# 查看redis状态
sudo systemctl status redis-server
# 启动/重启/停止redis
sudo systemctl start/restart/stop redis-server
# 开机自启动
sudo systemctl enable redis-server
```
配置Redis
```bash
sudo vim /etc/redis/redis.conf
# 绑定地址，允许来自远程的机器连接，默认是127.0.0.1 -::1
bind 0.0.0.0
# 启用密码保护
requirepass your_redis_password
```
查看 Redis 版本：
```bash
# 通过命令行查看
redis-server --version
redis-cli --version
```
卸载重装
```bash
# 1. 停止 Redis 服务
sudo systemctl stop redis-server

# 2. 卸载 Redis
# 2.1 使用apt卸载, --purge表示删除redis的同时删除redis.conf配置文件
sudo apt remove --purge redis-server -y
# 2.2：检查并移除 Redis 相关的包
sudo dpkg --list | grep redis
# 如果有其他 Redis 相关的包，例如 redis-tools，可以一并卸载：
sudo apt remove --purge redis-tools -y

# 3. 删除 Redis 残留文件
sudo rm -rf /etc/redis /var/lib/redis /var/log/redis /run/redis

# 4. 更新软件源
sudo apt update

# 5. 重新安装 Redis
sudo apt install redis-server -y
```

## 6. 安装Elasticsearch
版本：安装 Elasticsearch 8.14.0
1. 下载并解压
```bash
wget https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-8.14.0-linux-x86_64.tar.gz
tar -xzf elasticsearch-8.14.0-linux-x86_64.tar.gz
mv elasticsearch-8.14.0 /usr/local/elasticsearch
rm elasticsearch-8.14.0-linux-x86_64.tar.gz
cd /usr/local/elasticsearch
```
2. 配置 Elasticsearch
编辑 config/elasticsearch.yml
```bash
vim config/elasticsearch.yml
```
修改以下内容：
```yaml
# 集群名称（可选）
cluster.name: my-cluster

# 节点名称（可选）
node.name: node-1

# 绑定 IP（如果要远程访问，改为 0.0.0.0）
network.host: 0.0.0.0

# 端口（默认 9200）
http.port: 9200

# 禁用安全认证（测试环境可用，生产环境建议开启）
xpack.security.enabled: false

# 允许跨域（前端访问时需要）
http.cors.enabled: true
http.cors.allow-origin: "*"
```
3. 安装 elasticsearch-analysis-ik 插件
IK 分词插件 是 Elasticsearch 中文分词的常用插件。插件的版本和elasticsearch版本需要一致
```bash
cd /usr/local/elasticsearch
bin/elasticsearch-plugin install https://get.infini.cloud/elasticsearch/analysis-ik/8.14.0
```
4. 重启 Elasticsearch
```bash
pkill -f elasticsearch  # 先杀掉进程
/usr/local/elasticsearch/bin/elasticsearch -d
```
5. 查看插件是否安装成功
```bash
curl -X GET "localhost:9200/_cat/plugins?v"
```
如果输出包含 analysis-ik，说明安装成功

## 7. 安装Swoole扩展
安装 PHP 和 PEAR
首先，确保你已经安装了 PHP 和 php-pear 包。如果还没有安装，可以通过以下命令来安装：
```bash
sudo apt install php-pear php-dev
```
- php-pear 包是安装 pecl 所必需的。
- php-dev 包包含了构建 PHP 扩展所需的头文件。
安装依赖工具
pecl 工具通常需要一些额外的构建工具来编译 PHP 扩展。你可以使用以下命令安装这些依赖项：
```bash
sudo apt install build-essential autoconf bison re2c libssl-dev libpcre3-dev libbrotli-dev
```
验证 pecl 安装
完成安装后，你可以通过运行以下命令来验证 pecl 是否安装成功：
```bash
pecl version
```
使用 pecl 安装扩展
一旦 pecl 安装完成，你就可以使用它来安装 PHP 扩展。例如，安装 swoole 扩展：
```bash
sudo pecl install swoole
```
创建软链接
```bash
# 创建swoole.ini
sudo touch /etc/php/8.3/mods-available/swoole.ini
# 编辑swoole.ini
sudo vim /etc/php/8.3/mods-available/swoole.ini
# 写入内容
extension=swoole.so
# 创建软链接 ln -s 文件 链接
sudo ln -s /etc/php/8.3/mods-available/swoole.ini /etc/php/8.3/cli/conf.d/20-swoole.ini
```
为 PHP 7.3 重新安装 Swoole 扩展
```bash
sudo apt install php-pear php7.3-dev
# 下载指定分支源代码到/usr/local/
sudo git clone -b v4.8.13 https://github.com/swoole/swoole-src.git
# 进入源码文件夹
cd /usr/local/swoole-src
sudo phpize7.3
# 记住加上--enable-openssl
sudo ./configure --with-php-config=/usr/bin/php-config7.3 --enable-openssl
sudo make
sudo make install
# 如果第一次编译没有带上 --enable-openssl参数，先卸载
sudo pecl uninstall swoole # 这里不用
# 删除swoole.so文件
sudo rm /usr/lib/php/20180731/swoole.so
# 清理旧的编译文件
sudo make clean
# 然后就可以重复上面的编译了
```
确保 Swoole 扩展开启 openssl 扩展
```bash
[root@xxx vhost]# php --ri swoole
swoole
Swoole => enabled
Author => Swoole Team <team@swoole.com>
Version => 4.5.9
...
openssl => OpenSSL 1.0.2k-fips  26 Jan 2017 (请确保此处开启)
```

## 8. Git Clone拉取代码
如果我们用 root 身份去执行 git clone 命令，克隆下来的目录和文件会归属于 root 账户，而 PHP 和 Nginx 的运行账户都是 www-data，这就会导致 Nginx / PHP 无法读写项目目录，从而导致我们的站点无法正常运行。

因此我们应该以 www-data 身份去执行命令，这样创建的目录和文件就归属于 www-data，之后所有可能生成文件的命令我们都应该以 www-data 身份去执行。

为了更方便地以 www-data 身份执行命令，vim编辑 `~/.bashrc` 文件，写入`alias sudowww='sudo -H -u www-data sh -c'`然后`source ~/.bashrc`，后续使用时只需要`sudowww`然后在原命令两端加上单引号即可。
```bash
# 末尾可自定义目录名称，否则保持一致
$ sudowww 'git clone https://github.com/ljheisenberg1072/bbs.git'
$ cd shop/
# 下载 Composer 依赖
sudowww 'composer install'
# 下载 Nodejs 依赖
sudowww 'SASS_BINARY_SITE=http://registry.npmmirror.com/node-sass npm install'
# 复制配置文件
$ sudowww 'cp .env.example .env'
# php 命令也要用 sudowww
$ sudowww 'php artisan key:generate'
# 执行数据库迁移
$ sudowww 'php artisan migrate'
```

## 9. 部署完成后用户组权限问题
以 Ubuntu 用户（例如 ubuntu） 登录并创建的 Laravel 项目文件，仍然建议将文件权限修改为 www-data:www-data，因为 Nginx 和 PHP-FPM 运行时通常是使用 www-data 用户。
为什么要改为 www-data？
1. Nginx 访问权限
- Nginx 以 www-data 运行，如果文件的所有者是 ubuntu:ubuntu，Nginx 可能会 无权限读取 Laravel 项目，导致 403 Forbidden 或 500 Internal Server Error。
2. PHP-FPM 写入权限
- Laravel 需要 写入 storage 和 bootstrap/cache 目录（如日志、缓存、会话文件）。
- PHP-FPM 也是以 www-data 运行，如果文件是 ubuntu:ubuntu，PHP 可能无法正确写入，导致错误。

保持 ubuntu 作为文件所有者，赋予 www-data 组写权限
这个方法可以让 ubuntu 仍然控制 Laravel 项目，同时 www-data（Nginx 和 PHP-FPM 用户）可以正确访问和写入必要的目录。
步骤
1️⃣ 把 ubuntu 用户添加到 www-data 组（让 ubuntu 也能管理 Nginx 相关的文件）：
```bash
# sudo usermod -aG 目标用户组 用户
sudo usermod -aG www-data ubuntu
# usermod 👉 修改用户信息
# 将用户追加（-a）到某个附加组（-G）
```
2️⃣ 修改 Laravel 目录的组为 www-data：
```bash
# sudo chown 用户:用户组 文件或目录
sudo chown -R ubuntu:www-data /var/www/laravel
# chown 👉 更改文件的所有者（用户）和所属组
# 用户:用户组 👉 新的所有者（用户）和用户组
```
3️⃣ 确保 www-data 组有写权限：
```bash
sudo chmod -R 775 /var/www/laravel/storage /var/www/laravel/bootstrap/cache
```
4️⃣ （可选）确保 www-data 组可以管理整个项目
```bash
sudo chmod -R g+rw /var/www/laravel
```
🔹 优点
- 你仍然可以用 ubuntu 账户管理文件。
- www-data 组可以正确访问和写入 Laravel 运行时需要的目录。
- 避免 www-data 作为文件所有者的问题。

注意：
按照第3步操作之后会提示：.gitignore文件权限发生改变
```bash
(use "git restore <file>..." to discard changes in working directory)         
modified:   bootstrap/cache/.gitignore         
modified:   storage/administrator_settings/site.json         
modified:   storage/app/.gitignore         
modified:   storage/app/public/.gitignore         
modified:   storage/debugbar/.gitignore         
modified:   storage/framework/.gitignore         
modified:   storage/framework/cache/.gitignore         
modified:   storage/framework/cache/data/.gitignore         
modified:   storage/framework/sessions/.gitignore         
modified:   storage/framework/testing/.gitignore         
modified:   storage/framework/views/.gitignore         
modified:   storage/logs/.gitignore
```
通过git diff查看之后：
```bash
git diff bootstrap/cache/.gitignore
old mode 100644
new mode 100755
```
权限发生变化，linux会认为文件发生改变
配置 Git 让它忽略文件权限的变化：
```bash
git config core.filemode false
```
