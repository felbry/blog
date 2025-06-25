import { defineConfig } from 'vitepress'
import path from 'path'
import mdContainer from 'markdown-it-container'
import createDemoContainer from './plugins/markdown/demo.js'
import appendDemoImportsToMd from './plugins/vite/append-imports-to-markdown.js'
import { footnote } from '@mdit/plugin-footnote'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Felbry's Blog",
  description: '个人博客',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '技术笔记', link: '/summary' },
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
        { text: 'Git', link: '/git' },
        {
          text: '微信小程序',
          items: [
            { text: '原生 VS Taro', link: '/miniprogram/native-vs-taro' },
            { text: '微信小程序开发手册', link: '/miniprogram/dev-handbook' },
            { text: '开发遇到的问题', link: '/miniprogram/dev-problem' },
            { text: 'Worklet 动画', link: '/miniprogram/worklet' },
            { text: 'Taro', link: '/miniprogram/taro' },
          ],
        },
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
          text: '1panel',
          items: [
            { text: '使用 1panel 申请/续签 HTTPS 证书', link: '/1panel/https' },
            { text: '使用 1panel 创建 HTTPS 服务', link: '/1panel/reverse-proxy' },
          ],
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
            { text: 'Docker 配置私有仓库', link: '/docker/private-registry' },
            { text: 'Docker 快速参考', link: '/docker/ref' },
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
          text: 'Apifox',
          items: [{ text: 'Apifox 批量模拟数据', link: '/apifox/batch-mock-data' }],
        },
        {
          text: 'Strapi v5',
          items: [
            { text: 'Docker 一个工程', link: '/strapi/docker-start' },
            { text: '快速设置', link: '/strapi/pre-setting' },
            { text: '创建/自定义接口', link: '/strapi/custom-api' },
            { text: '抛错', link: '/strapi/throw-error' },
            { text: 'strapi.xxx', link: '/strapi/strapi-api' },
            { text: 'REST/Document 操作', link: '/strapi/rest-document' },
          ],
        },
        {
          text: 'uni-app',
          items: [
            { text: 'uni-app 使用 webview 自定义返回逻辑', link: '/uni-app/webview-back' },
            { text: 'uni-app 安卓下的 bitmap save 失败问题', link: '/uni-app/android-bitmap-save' },
          ],
        },
        {
          text: '参考 Element Plus Demo 和 Vue SFC Playground 自定义预览组件',
          link: '/vue-repl-playground',
        },
        { text: 'UnoCSS', link: '/unocss' },
        { text: 'Node.js 常用 API', link: '/nodejs-api' },
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
    config: (md) => md.use(mdContainer, 'demo', createDemoContainer(md)).use(footnote),
  },
  vite: {
    server: {
      host: '127.0.0.1',
      port: 5174,
    },
    plugins: [appendDemoImportsToMd({ examplesRoot: path.resolve('examples') })],
  },
})
