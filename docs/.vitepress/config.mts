import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: "zh_CN",
  title: "LjHeisenberg's Blog",
  description: "PHPer's Blog Website",
  srcDir: './src',
  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/favicon.ico' }]
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
          { text: 'Linux服务器从零部署', link: '/linux-server-deployment-from-scratch' },
          { text: 'Supervisor安装使用', link: '/supervisor-installation-and-usage' },
          { text: 'Elasticsearch安装使用', link: '/elasticsearch-usage' },
          { text: "Let's Encrypt添加SSL证书", link: "/let's-encrypt" },
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
