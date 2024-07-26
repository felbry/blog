import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Felbry's Blog",
  description: "个人博客",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [{ text: "主页", link: "/" }],

    outline: {
      level: [2, 3],
      label: "目录",
    },

    sidebar: [
      {
        text: "Material Design v3",
        items: [
          { text: "动态生成颜色", link: "/material-design/dynamic-color-gen" },
          { text: "颜色角色", link: "/material-design/color-roles" },
          { text: "海拔", link: "/material-design/elevation" },
          { text: "状态", link: "/material-design/states" },
          { text: "运动/动画", link: "/material-design/motion" },
        ],
      },
      {
        text: "Strapi v5",
        items: [
          { text: "快速开始", link: "/strapi/quick-start" },
          { text: "自定义接口", link: "/strapi/custom-api" },
          { text: "抛错", link: "/strapi/throw-error" },
          { text: "strapi.xxx", link: "/strapi/strapi-api" },
          { text: "表相关", link: "/strapi/table" },
        ],
      },
      { text: "CSP", link: "/csp" },
    ],
    lastUpdated: true,
    editLink: {
      pattern: "https://github.com/felbry/blog/edit/main/:path",
    },
    socialLinks: [{ icon: "github", link: "https://github.com/felbry" }],
  },
});
