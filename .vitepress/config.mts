import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Felbry's Blog",
  description: "个人博客",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [{ text: "主页", link: "/" }],

    sidebar: [
      {
        text: "Strapi",
        items: [{ text: "快速开始", link: "/strapi/quick-start" }],
      },
    ],

    socialLinks: [{ icon: "github", link: "https://github.com/felbry" }],
  },
});
