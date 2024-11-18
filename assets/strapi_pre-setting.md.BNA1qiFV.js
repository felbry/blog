import{_ as a,c as t,a4 as o,o as i}from"./chunks/framework.07rp2gkU.js";const m=JSON.parse('{"title":"快速设置","description":"","frontmatter":{},"headers":[],"relativePath":"strapi/pre-setting.md","filePath":"strapi/pre-setting.md","lastUpdated":1731461832000}'),s={name:"strapi/pre-setting.md"};function r(n,e,c,p,d,l){return i(),t("div",null,e[0]||(e[0]=[o('<h1 id="快速设置" tabindex="-1">快速设置 <a class="header-anchor" href="#快速设置" aria-label="Permalink to &quot;快速设置&quot;">​</a></h1><h2 id="简体中文展示" tabindex="-1">简体中文展示 <a class="header-anchor" href="#简体中文展示" aria-label="Permalink to &quot;简体中文展示&quot;">​</a></h2><p><a href="https://docs.strapi.io/dev-docs/admin-panel-customization/options" target="_blank" rel="noreferrer">Admin panel customization options</a></p><p>将<code>/src/admin/app.examples.js</code>改为<code>/src/admin/app.js</code>，在<code>/src/admin/app.js</code>中<code>config.locales</code>打开<code>&quot;zh-Hans&quot;</code></p><p>刷新页面，就能在<code>http://localhost:1337/admin/me</code>中更改界面语言了</p><h2 id="媒体库设置" tabindex="-1">媒体库设置 <a class="header-anchor" href="#媒体库设置" aria-label="Permalink to &quot;媒体库设置&quot;">​</a></h2><p><code>http://localhost:1337/admin/settings/media-library</code></p><p>默认响应式图片是开启的，一般关闭避免生成一堆图片增加存储压力</p><h2 id="插件-swagger-api-文档" tabindex="-1">插件 - Swagger API 文档 <a class="header-anchor" href="#插件-swagger-api-文档" aria-label="Permalink to &quot;插件 - Swagger API 文档&quot;">​</a></h2><p>只需要<code>npm install @strapi/plugin-documentation</code>安装到 dependencies（而不是 devDependencies），strapi 就能自动检测依赖，就可以访问<code>http://localhost:1337/documentation</code>查看文档了</p><p><a href="https://docs.strapi.io/dev-docs/plugins/using-plugins#automatic-plugins-discovery" target="_blank" rel="noreferrer">Automatic plugins discovery</a></p><div class="warning custom-block"><p class="custom-block-title">WARNING</p><p>2024/11/11：无法自动生成自定义接口的 Swagger 文档（即 <code>api/&lt;api-name&gt;/routes.js</code>这类没有默认路由且没有 content-type 的）</p></div>',12)]))}const u=a(s,[["render",r]]);export{m as __pageData,u as default};
