import { defineConfig } from 'vitepress'
import path from 'path'
import mdContainer from 'markdown-it-container'
import createDemoContainer from './plugins/markdown/demo.js'
import appendDemoImportsToMd from './plugins/vite/append-imports-to-markdown.js'

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
        {
          text: '构建工具',
          items: [{ text: 'Vite 和 Rollup 插件开发', link: '/build-tools/vite-and-rollup-plugin' }],
        },
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
          text: 'Docker',
          items: [
            { text: 'Docker 入门', link: '/docker/base' },
            { text: 'Docker 草稿', link: '/docker/temp' },
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
            { text: 'Docker 一个工程', link: '/strapi/docker-start' },
            { text: '自定义接口', link: '/strapi/custom-api' },
            { text: '抛错', link: '/strapi/throw-error' },
            { text: 'strapi.xxx', link: '/strapi/strapi-api' },
            { text: '表相关', link: '/strapi/table' },
          ],
        },
        {
          text: '参考 Element Plus Demo 和 Vue SFC Playground 自定义预览组件',
          link: '/vue-repl-playground',
        },
        { text: 'Node.js 常用 API', link: '/nodejs-api' },
        { text: 'CSP', link: '/csp' },
        { text: 'Master Go', link: '/mastergo/all' },
        { text: 'Taro', link: '/taro' },
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
    plugins: [appendDemoImportsToMd({ examplesRoot: path.resolve('examples') })],
  },
})
