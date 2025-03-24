---
outline: deep
---

## 1. 安装 Supervisor
如果你尚未安装 Supervisor，可以使用以下命令安装：
```bash
# Ubuntu/Debian
sudo apt update && sudo apt install supervisor -y

# CentOS
sudo yum install epel-release -y
sudo yum install supervisor -y

# Mac（Homebrew）
brew install supervisor
```
安装完成后，查看 Supervisor 版本：
```bash
supervisord --version
```

## 2. 配置 Laravel 队列的 Supervisor 任务
Supervisor 的配置文件存放在 `/etc/supervisor/conf.d/`（Ubuntu）或 `/etc/supervisord.d/`（CentOS）。
创建 Supervisor 配置文件
```bash
sudo vim /etc/supervisor/conf.d/laravel-worker.conf
```
在 Supervisor 配置文件 (*.conf) 里，%(...)s 和 %(...)d 是 Supervisor 提供的 变量占位符，它们会在运行时被替换成实际的值。

| 占位符                       | 含义                             |
|:--------------------------|:-------------------------------|
| %(program_name)s          | 代表 [program:x] 里的 x，即程序的名称     |
| %(process_num)02d         | 代表进程编号（两位数，不足补 0）              |
添加以下内容：
```bash
[program:laravel-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /path/to/your/project/artisan queue:work redis --tries=3 --timeout=60
autostart=true
autorestart=true
user=www-data
numprocs=2
redirect_stderr=true
stdout_logfile=/var/log/laravel-worker.log
```
配置参数解析：

| 选项                   | 说明                                                 |
|:---------------------|:---------------------------------------------------|
| command              | 	执行的队列任务命令                                         |
| autostart=true       | 	Supervisor 启动时自动运行                                |
| autorestart=true     | 	如果进程崩溃或退出，自动重启                                    |
| user=www-data        | 	运行队列任务的用户（适用于 Nginx，Apache 可能是 www-data 或 apache） |
| numprocs=2           | 	启动 2 个队列进程（可以根据需求调整）                              |
| redirect_stderr=true | 	重定向错误日志到 stdout_logfile                           |
| stdout_logfile       | 	指定日志文件路径                                          |

## 3. 重新加载 Supervisor 并启动队列
```bash
# 重新加载 Supervisor 配置
sudo supervisorctl reread
sudo supervisorctl update
# 启动 Laravel 队列
sudo supervisorctl start laravel-worker:*
```
检查进程是否启动：
```bash
sudo supervisorctl status
```
如果成功，会看到类似：
```bash
laravel-worker:laravel-worker_00   RUNNING   pid 12345, uptime 0:10:05
laravel-worker:laravel-worker_01   RUNNING   pid 12346, uptime 0:10:05
```

## 4. 开机自启动
确保 Supervisor 开机时自动启动：
```bash
# Ubuntu/Debian/CentOS
sudo systemctl enable supervisor
sudo systemctl start supervisor
```

## 5. 监控和管理 Supervisor
查看日志
```bash
tail -f /var/log/laravel-worker.log
```
手动管理进程
```bash
# 查看 Supervisor 任务状态
sudo supervisorctl status
# 重新启动队列
sudo supervisorctl restart laravel-worker:*
# 停止队列
sudo supervisorctl stop laravel-worker:*
```
## 6. 解决常见问题
1）队列任务未执行
- 确保 Redis 正常运行：
```bash
redis-cli ping
```
- 返回 PONG 表示正常。
- 确保 Laravel 队列的 .env 配置正确：
```bash
QUEUE_CONNECTION=redis
```
- 然后清缓存：
php artisan config:clear
php artisan cache:clear

2）Supervisor 进程未启动
如果 supervisorctl status 显示 BACKOFF 或 STOPPED：
```bash
sudo systemctl restart supervisor
```
然后重新加载配置：
```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl restart laravel-worker:*
```

## 7. Laravel Horizon（可选）
如果你的项目使用 Redis 队列，建议用 Horizon 代替 Supervisor，因为它提供更强的队列管理功能。
Horizon 运行方式：
```bash
php artisan horizon
```
用 Supervisor 运行 Horizon：
```bash
[program:laravel-horizon]
process_name=%(program_name)s
command=php /path/to/your/project/artisan horizon
autostart=true
autorestart=true
user=www-data
redirect_stderr=true
stdout_logfile=/var/log/horizon.log
```
然后：
```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start laravel-horizon
```

## 8. 注意点
| 命令           | 影响范围                         | 适用场景                             |
|:-------------|:-----------------------------|:---------------------------------|
| reread       | 	仅检测新的/修改的 .conf，不影响运行中的进程   | 	只是想让 Supervisor 识别新配置，但不重启任务    |
| update       | 	仅对 新增/删除 的进程生效，已运行的进程不会变    | 	需要新增任务但不影响现有任务                  |
| reload       | 	停止所有进程，然后重新启动它们             | 	确保所有任务都按最新配置运行                  |
| restart all  | 	重启所有进程，但不刷新 .conf 配置        | 	仅重启任务，不影响 Supervisor 本身         |

**什么时候用 reload，什么时候用 reread + update？**

✅用 reread + update 的情况
- 新增/删除了进程（新增了 .conf，或者删除了 .conf）。
- 不希望影响正在运行的进程，只想让新的配置生效。
- 业务不能中断，比如有多个 queue:work 进程在处理任务，不想所有 worker 都被重启。
```bash
sudo supervisorctl reread
sudo supervisorctl update
```
**好处**：不会中断正在运行的进程，新任务正常启动，旧任务继续运行。

✅用 reload 的情况
- 你修改了现有的进程配置，比如：
  - 改了 command
  - 改了 numprocs
  - 改了 user
  - 改了 stdout_logfile
- 必须让所有进程使用新的配置，而不只是新增的任务。
```bash
sudo supervisorctl reload
```
影响：所有进程都会重启（可能会短暂中断服务）。

**为什么推荐先 reread + update，再 restart？**

有时候，你可能只是增加新任务，而不想影响正在运行的 worker。
但如果你改了 command，就需要手动重启进程，否则旧的 worker 还是用老的 command。

所以推荐：
```bash
sudo supervisorctl reread && sudo supervisorctl update && sudo supervisorctl restart laravel-worker:*
```
1. reread 检查新的 .conf。
2. update 让 Supervisor 加载新任务。
3. restart 仅重启特定任务，而不是所有任务。
4. 结论
- 如果你不想影响已有任务，只让 Supervisor 识别新任务，用：
```bash
sudo supervisorctl reread && sudo supervisorctl update
```
- 如果你改了 command 或 numprocs，一定要重启进程，用：
```bash
sudo supervisorctl reread && sudo supervisorctl update && sudo supervisorctl restart laravel-worker:*
```
- 如果你想让所有进程都用最新的配置，不在乎短暂中断，直接：
```bash
sudo supervisorctl reload
```
🚀 最佳实践：
```bash
sudo supervisorctl reread && sudo supervisorctl update && sudo supervisorctl restart laravel-worker:*
```
这样既能加载新配置，又不会影响不相关的进程，避免不必要的重启。