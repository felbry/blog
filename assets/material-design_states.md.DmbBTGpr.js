import{_ as t,c as a,a4 as r,o as s}from"./chunks/framework.07rp2gkU.js";const m=JSON.parse('{"title":"状态","description":"","frontmatter":{},"headers":[],"relativePath":"material-design/states.md","filePath":"material-design/states.md","lastUpdated":1722237454000}'),i={name:"material-design/states.md"};function o(n,e,p,l,c,d){return s(),a("div",null,e[0]||(e[0]=[r('<h1 id="状态" tabindex="-1">状态 <a class="header-anchor" href="#状态" aria-label="Permalink to &quot;状态&quot;">​</a></h1><h2 id="状态层" tabindex="-1">状态层 <a class="header-anchor" href="#状态层" aria-label="Permalink to &quot;状态层&quot;">​</a></h2><p>在背景和文字之间，还存在一个状态层</p><p><img src="https://lh3.googleusercontent.com/qxvTFAHPEnP5p1L9Hr2F6_p-doSHs6LZBsn95my3Ls_k5bfJEg2YI3ygL2ALT38eAnWv5dQDHlnFYsq6TsbEaBqc5Xz1YNN6m5l_i1HgsYWQ=s0" alt=""></p><p>这个层的颜色按 content 颜色来。比如一个组件背景色是 primary container，文字颜色是 on primary container，就采用 on primary container 作为状态层颜色，其透明度按下图所示：</p><p><img src="https://lh3.googleusercontent.com/EUs1U6XOcLtSeua57AwLOI9hfoUOXSPvqin7KqRdW6DZ5QWskOXWNYRinFNNxMHRecgqH-im2YKjIBmcps36beA4A6xYwEdlacJelogPMTJOfA=s0" alt=""></p><p>hover（8%）、focus（10%）、press（10%），drag（16%）</p><h3 id="具体实现" tabindex="-1">具体实现 <a class="header-anchor" href="#具体实现" aria-label="Permalink to &quot;具体实现&quot;">​</a></h3><p>观察<a href="https://material-web.dev/components/text-field/#input-type" target="_blank" rel="noreferrer">@material/web 的 text-field 组件</a></p><p><img src="https://felbry.github.io/picx-images-hosting/image.7p3i8axh37.webp" alt="image"></p><p>可以看出，它的实现是分别定义了背景、状态层、组件容器三个元素。</p><p>感觉有些麻烦，个人实现先以动态改变<code>background-color</code>为准。</p><h2 id="disabled" tabindex="-1">disabled <a class="header-anchor" href="#disabled" aria-label="Permalink to &quot;disabled&quot;">​</a></h2><p>disabled 和状态层还有所区别，在<a href="https://m3.material.io/foundations/interaction/states/applying-states" target="_blank" rel="noreferrer">Material Design v3 文档</a>中，说是将启用状态的不透明度设置成<strong>38%</strong>。</p><p>通过观察 button 和 text-fields 两个组件的文档：</p><p><img src="https://felbry.github.io/picx-images-hosting/image.3nritx6p4k.webp" alt="image"></p><p><img src="https://felbry.github.io/picx-images-hosting/image.54xnvocin8.webp" alt="image"></p><p>可以看到：文字和 icon 确实是正常状态的<strong>38%</strong>，但是背景稍有不同，一个是<strong>12%</strong>，一个是<strong>4%</strong>。因此得出结论：文字按<strong>38%</strong>，背景因组件而异。</p>',18)]))}const h=t(i,[["render",o]]);export{m as __pageData,h as default};
