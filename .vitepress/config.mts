import { defineConfig } from 'vitepress'
import mdContainer from 'markdown-it-container'
import createDemoContainer from './plugins/demo.js'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Felbry's Blog",
  description: '个人博客',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '技术', link: '/summary' },
      { text: '资源整理', link: '/resource' },
    ],

    outline: {
      level: [2, 3],
      label: '目录',
    },

    sidebar: {
      // "/team-management": [{ text: "Git", link: "/team-management/git" }],
      '/': [
        { text: '简介', link: '/summary' },
        { text: '使用@vue/repl 定制 Playground', link: '/vue-repl-playground' },
        { text: 'Taro', link: '/taro' },
        {
          text: 'Unix',
          items: [
            { text: '环境安装', link: '/unix/env-install' },
            { text: 'SSH', link: '/unix/ssh' },
            { text: 'Nginx', link: '/unix/nginx' },
            { text: 'rsync', link: '/unix/rsync' },
          ],
        },
        {
          text: '编辑器',
          items: [{ text: 'Zed', link: '/editor/zed' }],
        },
        {
          text: '团队管理',
          items: [{ text: 'Git使用规范', link: '/team-management/git' }],
        },
        {
          text: 'SVG',
          items: [
            { text: 'SVG基础', link: '/svg/base' },
            { text: '认识Stroke和Dash', link: '/svg/learn-stroke-and-dash' },
          ],
        },
        {
          text: 'Material Design v3',
          items: [
            {
              text: '动态生成颜色',
              link: '/material-design/dynamic-color-gen',
            },
            { text: '颜色角色', link: '/material-design/color-roles' },
            { text: '海拔', link: '/material-design/elevation' },
            { text: '状态', link: '/material-design/states' },
            { text: '运动/动画', link: '/material-design/motion' },
          ],
        },
        {
          text: 'Strapi v5',
          items: [
            { text: '快速开始', link: '/strapi/quick-start' },
            { text: '自定义接口', link: '/strapi/custom-api' },
            { text: '抛错', link: '/strapi/throw-error' },
            { text: 'strapi.xxx', link: '/strapi/strapi-api' },
            { text: '表相关', link: '/strapi/table' },
          ],
        },
        { text: 'CSP', link: '/csp' },
        { text: 'Master Go', link: '/mastergo/all' },
      ],
    },
    lastUpdated: true,
    editLink: {
      pattern: 'https://github.com/felbry/blog/edit/main/:path',
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/felbry' }],
  },
  markdown: {
    config: (md) => md.use(mdContainer, 'demo', createDemoContainer(md)),
  },
  vite: {
    server: {
      host: '127.0.0.1',
    },
  },
})
