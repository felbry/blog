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
        text: "Strapi v5",
        items: [
          { text: "快速开始", link: "/strapi/quick-start" },
          { text: "自定义接口", link: "/strapi/custom-api" },
          { text: "抛错", link: "/strapi/throw-error" },
          { text: "strapi.xxx", link: "/strapi/strapi-api" },
          { text: "表相关", link: "/strapi/table" },
        ],
      },
    ],
    lastUpdated: true,
    editLink: {
      pattern: "https://github.com/felbry/blog/edit/main/:path",
    },
    socialLinks: [{ icon: "github", link: "https://github.com/felbry" }],
  },
});
