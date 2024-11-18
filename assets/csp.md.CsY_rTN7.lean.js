import{_ as t,c as o,a4 as a,o as p}from"./chunks/framework.07rp2gkU.js";const m=JSON.parse('{"title":"内容安全策略（CSP）","description":"","frontmatter":{},"headers":[],"relativePath":"csp.md","filePath":"csp.md","lastUpdated":1722237454000}'),r={name:"csp.md"};function s(c,e,n,d,l,i){return p(),o("div",null,e[0]||(e[0]=[a('<h1 id="内容安全策略-csp" tabindex="-1">内容安全策略（CSP） <a class="header-anchor" href="#内容安全策略-csp" aria-label="Permalink to &quot;内容安全策略（CSP）&quot;">​</a></h1><p>MDN 针对 CSP 的配置写的比较详细：<a href="https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CSP#%E5%85%BC%E5%AE%B9%E6%80%A7%E5%A4%87%E6%B3%A8" target="_blank" rel="noreferrer">https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CSP#兼容性备注</a></p><p>目前遇到的一个场景：</p><p>http 的网站，通过 iframe 嵌套了 https 的网站，导致 https 网站请求接口失败，<code>failed to load response data:connection is closed, can not dispatch pending call to network.getresponseBody</code>。</p><p>解决方案就是在当前 http 网站添加 meta 头：<code>&lt;meta http-equiv=&quot;Content-Security-Policy&quot; content=&quot;frame-src &#39;self&#39; https://example.com;&quot;&gt;</code></p><p>这个方案也是听别人说，有待实际场景验证。</p>',6)]))}const f=t(r,[["render",s]]);export{m as __pageData,f as default};
