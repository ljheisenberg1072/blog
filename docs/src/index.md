---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "echo 'Hello PHP!'"
  text: "世界上最好的语言！"
  tagline: Laravel/ThinkPHP/Webman/Hyperf
  actions:
    - theme: brand
      text: 简历
      link: /my-resume
    - theme: alt
      text: BBS
      link: //bbs.ljheisenberg.cn
    - theme: alt
      text: Shop
      link: //shop.ljheisenberg.cn

features:
  - icon: 
        src: /linux.svg
    title: Linux服务器从零部署
    details: 系统镜像Ubuntu24.04，安装Laravel项目相关软件和扩展，安装PHP/Composer/Nginx/MySQL/Redis/Elasticsearch/Swoole等。
    link: /linux-server-deployment-from-scratch
  - icon:
      src: /mysql.svg
    title: MySQL
    details: MySQL 是一个开源的关系型数据库管理系统（RDBMS），使用结构化查询语言（SQL）进行数据管理。它具有 高性能、可靠性强、易扩展 的特点，被广泛应用于 Web 开发、企业应用和大数据处理。
    link: /mysql-usage
  - icon:
      src: /redis.svg
    title: Redis
    details: Redis 是一个开源的、基于内存的数据结构存储系统，它可以用作数据库、缓存、消息代理等。Redis 支持丰富的数据结构，如字符串、哈希、列表、集合、有序集合等，且操作速度非常快，因此被广泛应用于高性能、高并发的应用场景。
    link: /redis-usage
  - icon:
      src: /elasticsearch.svg
    title: Elasticsearch
    details: 是一个分布式搜索和分析引擎，基于 Apache Lucene 构建，擅长全文搜索、结构化数据分析和日志处理。它支持高效索引、分布式存储和近实时查询，常用于 日志分析、搜索引擎、推荐系统等场景。
    link: /elasticsearch-usage
  - icon:
      src: /websocket.svg
    title: WebSocket
    details: 是一种 全双工（双向通信）协议，它允许客户端（如浏览器）和服务器之间保持长连接，并实现 实时数据交互。
    link: /websocket
  - icon:
      src: /supervisor.svg
    title: Supervisor
    details: 是一个进程管理工具，主要用于管理和守护后台进程，确保它们在崩溃或异常退出时能够自动重启。常用于 Laravel 队列消费者、常驻脚本、爬虫、WebSocket 服务器等。
    link: /supervisor-installation-and-usage
  - icon:
      src: /encrypt.svg
    title: Let's Encrypt
    details: 是一个免费的、自动化的、开源的证书颁发机构（CA），提供 SSL/TLS 证书 用于加密网站的通信。它的目标是使 HTTPS 成为 Web 的默认配置，以提高网络的安全性。
    link: /let's-encrypt
  - icon:
      src: /wechat.svg
    title: 微信登录
    details: 第三方登录，利用用户在第三方平台上已有的账号来快速完成自己应用的登录或者注册的功能，常用的协议为 OAuth 2.0，基本上每个 APP，都会集成微信，微博等第三方登录，方便用户快速的登录并开始使用。
    link: /wechat-login
---
<style>
.details {
    word-break: break-all;
}
</style>