---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "echo 'Hello PHP!'"
  text: "世界上最好的语言！"
  tagline: Laravel/ThinkPHP/Webman/Hyperf
  actions:
    - theme: brand
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
      src: /supervisor.svg
    title: Supervisor
    details: 是一个进程管理工具，主要用于管理和守护后台进程，确保它们在崩溃或异常退出时能够自动重启。常用于 Laravel 队列消费者、常驻脚本、爬虫、WebSocket 服务器等。
    link: /supervisor-installation-and-usage
  - icon:
        src: /elasticsearch.svg
    title: Elasticsearch
    details: 是一个分布式搜索和分析引擎，基于 Apache Lucene 构建，擅长全文搜索、结构化数据分析和日志处理。它支持高效索引、分布式存储和近实时查询，常用于 日志分析、搜索引擎、推荐系统等场景。
    link: /elasticsearch-usage
  - icon:
      src: /encrypt.svg
    title: Let's Encrypt
    details: 是一个免费的、自动化的、开源的证书颁发机构（CA），提供 SSL/TLS 证书 用于加密网站的通信。它的目标是使 HTTPS 成为 Web 的默认配置，以提高网络的安全性。
    link: /let's-encrypt
---
<style>
.details {
    word-break: break-all;
}
</style>