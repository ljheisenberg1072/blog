import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: "zh_CN",
  title: "LjHeisenberg's Blog",
  description: "PHPer's Blog Website",
  srcDir: './src',
  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/favicon.ico' }],
    ['script', {}, `
      var _hmt = _hmt || [];
      (function() {
        var hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?0ad869c70eb5cdab6b9e707037472ce6";
        var s = document.getElementsByTagName("script")[0]; 
        s.parentNode.insertBefore(hm, s);
      })();`,
    ]
  ],
  themeConfig: {
    logo: './logo.jpg',
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '简历', link: '/my-resume' },
      { text: 'BBS', link: '//bbs.ljheisenberg.cn' },
      { text: 'Shop', link: '//shop.ljheisenberg.cn' },
    ],

    sidebar: [
      {
        text: '文档',
        items: [
          { text: 'Linux 服务器从零部署', link: '/linux-server-deployment-from-scratch' },
          { text: "MySQL 安装使用", link: "/mysql-usage" },
          { text: "Redis 安装使用", link: "/redis-usage" },
          { text: 'Elasticsearch 安装使用', link: '/elasticsearch-usage' },
          { text: 'WebSocket 使用', link: '/websocket' },
          { text: 'Supervisor 安装使用', link: '/supervisor-installation-and-usage' },
          { text: "Let's Encrypt 添加 SSL 证书", link: "/let's-encrypt" },
          { text: "微信登录", link: "/wechat-login" },
          { text: "浏览器/PC端/H5判断", link: "/browser-pc-h5" },
          { text: "物联网IoT", link: "/iot-demo" },
        ],
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/ljheisenberg1072/blog' }
    ],
    footer: {
      copyright: 'Copyright © 2025 <a href="mailto:ljheisenberg@163.com">LjHeisenberg</a> All rights reserved.',
      message: '<a href="//beian.miit.gov.cn" target="_blank">鄂ICP备2025097329号-1</a>'
    },
    search: {
      provider: 'local'
    }
  }
})
