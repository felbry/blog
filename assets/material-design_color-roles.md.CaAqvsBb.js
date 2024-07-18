import{_ as a,c as e,o as r,a1 as i}from"./chunks/framework.Cq9cuCmX.js";const f=JSON.parse('{"title":"颜色角色","description":"","frontmatter":{},"headers":[],"relativePath":"material-design/color-roles.md","filePath":"material-design/color-roles.md","lastUpdated":1721291708000}'),t={name:"material-design/color-roles.md"},o=i('<h1 id="颜色角色" tabindex="-1">颜色角色 <a class="header-anchor" href="#颜色角色" aria-label="Permalink to &quot;颜色角色&quot;">​</a></h1><p><a href="https://m3.material.io/styles/color/roles" target="_blank" rel="noreferrer">color roles</a></p><p><img src="https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgm3sandbox%2Fimages%2Fln4letb9-all-color-roles-diagram.png?alt=media&amp;token=020eaf3d-36bb-477a-8c6c-b588ace2b073" alt=""></p><h2 id="基础概念-名词解释" tabindex="-1">基础概念（名词解释） <a class="header-anchor" href="#基础概念-名词解释" aria-label="Permalink to &quot;基础概念（名词解释）&quot;">​</a></h2><ul><li>Surface：用于屏幕背景和比较大的、低强调区域</li><li>Primary、Secondary、Tertiary：用于强调或弱化前景元素的强调色</li><li>Container：用作类似按钮这种前景元素的填充色</li><li>On：其配对父颜色之上的 文本 或 图标颜色</li><li>Variant - 较低强调色</li></ul><h2 id="primary" tabindex="-1">Primary <a class="header-anchor" href="#primary" aria-label="Permalink to &quot;Primary&quot;">​</a></h2><p><img src="https://felbry.github.io/picx-images-hosting/image.8s36zj8azb.webp" alt="image"></p><p>1 是 on primary，2 是 primary</p><p><img src="https://felbry.github.io/picx-images-hosting/image.64dqp6fi7w.webp" alt="image"></p><p>3 是 on primary container，4 是 primary container</p><h2 id="secondary" tabindex="-1">Secondary <a class="header-anchor" href="#secondary" aria-label="Permalink to &quot;Secondary&quot;">​</a></h2><p><img src="https://felbry.github.io/picx-images-hosting/image.1aovt1v01p.webp" alt="image"></p><p>1 是 on secondary container，2 是 secondary container</p><h2 id="tertiary" tabindex="-1">Tertiary <a class="header-anchor" href="#tertiary" aria-label="Permalink to &quot;Tertiary&quot;">​</a></h2><p><img src="https://felbry.github.io/picx-images-hosting/image.3goaetmv36.webp" alt="image"></p><p>1 是 on tertiary container，2 是 tertiary container</p><h2 id="surface" tabindex="-1">Surface <a class="header-anchor" href="#surface" aria-label="Permalink to &quot;Surface&quot;">​</a></h2><p>surface 即表面(背景色)，当元素过多时，就会出现表面(背景色)“叠加”的场景，此时有两种方案区分层级：</p><p>第一种是相对值，分为 surface dim，surface，surface bright。这里的 dim 和 bright 都是相对 surface 的，不论是 light 还是 dark 主题，bright 始终要亮于 surface。</p><p><img src="https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgm3sandbox%2Fimages%2Fln4oqecc-%5B1P%5D%20color-surface-mapping-surface-bright.png?alt=media&amp;token=b8f2bd75-88ac-4dc3-a0a7-34ff0b65396f" alt=""></p><p>上图是 light 主题：1 是 surface bright，2 是 surface container</p><p><img src="https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgm3sandbox%2Fimages%2Fln4oqywa-%5B1P%5D%20color-surface-mapping-surface-bright%20(1).png?alt=media&amp;token=61f63c06-ab39-49dd-94f7-bf1d9b5805c3" alt=""></p><p>上图是 dark 主题：1 是 surface bright，2 是 surface container</p><p>可以看出，1 的亮度始终是高于 2 的。</p><p>第二种是绝对值，分为 surface，和 surface container lowest、surface container low、surface container、surface container high、surface container highest</p><p>surface 通常用于大背景场景，而 surface container 就是其前景元素的填充色，比如下边这张图：</p><p><img src="https://felbry.github.io/picx-images-hosting/image.39l2jedddc.webp" alt="image"></p><p>1 是 surface（用作页面级别的背景），2 是 surface container（导航栏是个前景元素，作为这个前景元素的填充色）</p><p>在 Material Design 的规范中，默认中性色组件（如导航栏，菜单或弹窗）都会使用 surface container（low/high/highest）角色。如下图：</p><p><img src="https://felbry.github.io/picx-images-hosting/image.9kg2ha4fgr.webp" alt="image"></p><h2 id="outline" tabindex="-1">Outline <a class="header-anchor" href="#outline" aria-label="Permalink to &quot;Outline&quot;">​</a></h2><p>outline：文本输入框 border、tag。多用于小范围，单一内容的强调</p><p>outline variant：分隔线、包含多个元素的大组件 border（比如 card）、或是类似商品块这种逐个排列的（就没必要再用太重的强调线包裹）。</p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>该章节针对每种颜色做了简单的概述，提炼出以下几点</p><ul><li>容器背景有 surface -&gt; [color] container -&gt; [color] 可以用，从底至顶的强调顺序基本也是如此。但是 surface 本身有一套自己的层级逻辑，详见 surface 一节。</li></ul>',36),s=[o];function c(n,l,p,g,h,m){return r(),e("div",null,s)}const u=a(t,[["render",c]]);export{f as __pageData,u as default};
