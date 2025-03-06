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
      { text: 'BBS', link: '//bbs.ljheisenberg.cn' },
    ],

    // sidebar: [
    //   {
    //     text: 'Examples',
    //     items: [
    //       { text: 'Markdown Examples', link: '/markdown-examples' },
    //       { text: 'Runtime API Examples', link: '/api-examples' }
    //     ]
    //   }
    // ],

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
