import{_ as e,c as t,a4 as r,o}from"./chunks/framework.07rp2gkU.js";const h=JSON.parse('{"title":"动态生成颜色","description":"","frontmatter":{},"headers":[],"relativePath":"material-design/dynamic-color-gen.md","filePath":"material-design/dynamic-color-gen.md","lastUpdated":1721961914000}'),i={name:"material-design/dynamic-color-gen.md"};function s(l,a,n,p,c,m){return o(),t("div",null,a[0]||(a[0]=[r('<h1 id="动态生成颜色" tabindex="-1">动态生成颜色 <a class="header-anchor" href="#动态生成颜色" aria-label="Permalink to &quot;动态生成颜色&quot;">​</a></h1><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>文中关于色彩的 hue、chroma、tone 属于色彩专业知识，一般不需要关注，更多信息可以参照<a href="https://m3.material.io/styles/color/system/how-the-system-works#e1e92a3b-8702-46b6-8132-58321aa600bd" target="_blank" rel="noreferrer">Defining colors with hue, chroma, and tone (HCT)</a></p></div><h2 id="material-主题构建" tabindex="-1">Material 主题构建 <a class="header-anchor" href="#material-主题构建" aria-label="Permalink to &quot;Material 主题构建&quot;">​</a></h2><p><a href="https://material-foundation.github.io/material-theme-builder/" target="_blank" rel="noreferrer">https://material-foundation.github.io/material-theme-builder/</a> 可以在线体验定制主题效果</p><h2 id="生成步骤" tabindex="-1">生成步骤 <a class="header-anchor" href="#生成步骤" aria-label="Permalink to &quot;生成步骤&quot;">​</a></h2><h3 id="一、1-生-5" tabindex="-1">一、1 生 5 <a class="header-anchor" href="#一、1-生-5" aria-label="Permalink to &quot;一、1 生 5&quot;">​</a></h3><p>选定一个主题色，根据这个颜色的 hue 和 chroma，可以生成五种互补的关键颜色</p><p><img src="https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgm3sandbox%2Fimages%2Fln9w1sps-from-source-color-to-key-colors.png?alt=media&amp;token=44238439-ec0c-4d45-b7a2-6f2aea5f3dee" alt=""></p><p>其中 primary、secondary、tertiary 分别对应主、次、第三</p><p>neutual 是中性的、neutral variant 中性变体</p><h3 id="二、创建调色板" tabindex="-1">二、创建调色板 <a class="header-anchor" href="#二、创建调色板" aria-label="Permalink to &quot;二、创建调色板&quot;">​</a></h3><p>然后操纵这五种颜色的 tone 和 chroma 创建其对应的调色板</p><p><img src="https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgm3sandbox%2Fimages%2Fln9w374d-tonal-palettes.png?alt=media&amp;token=5c257795-85d9-4b1e-af1e-6951893fad98" alt=""></p><h3 id="三、分配给-color-roles" tabindex="-1">三、分配给 color roles <a class="header-anchor" href="#三、分配给-color-roles" aria-label="Permalink to &quot;三、分配给 color roles&quot;">​</a></h3><p>举个例子：对于 primary 调色板，可以将 primary40 分配给 primary，将 primary100 分配给 on primary。</p><p><img src="https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgm3sandbox%2Fimages%2Flna5kf0e-color-assignement.png?alt=media&amp;token=09a959ec-9c56-4264-8081-a85675710c2c" alt=""></p><p>按照这样的分配思路，实现了所有场景的颜色分配</p><p><img src="https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgm3sandbox%2Fimages%2Flna5l4y4-tonal-palettes-color-roles.png?alt=media&amp;token=c288d062-bb2a-4b33-8573-c6b56d72bdd7" alt=""></p><h2 id="支持三种对比度" tabindex="-1">支持三种对比度 <a class="header-anchor" href="#支持三种对比度" aria-label="Permalink to &quot;支持三种对比度&quot;">​</a></h2><p>在生成颜色时，有 standard、medium（3:1）、high 三种对比度可选，由于每种人群对不同颜色对比度的感知不同，可以根据场景设置合适的对比度。</p><p><img src="https://felbry.github.io/picx-images-hosting/image.361glknzji.webp" alt="image"></p><p>举例来说：一种颜色的 50 和 99 的色值就能创建出 3:1 的对比度</p><p><img src="https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgm3sandbox%2Fimages%2Flna5uajq-user-controlled-contrast_02.png?alt=media&amp;token=b6f05de2-6499-4960-a104-8ddd13dce787" alt=""></p><p>而 30 和 99 就能创建出更高的 7:1 的对比度</p><p><img src="https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgm3sandbox%2Fimages%2Flna5v5x9-user-controlled-contrast_03.png?alt=media&amp;token=f7654b21-b660-4c79-b82e-d77ee1372af4" alt=""></p><h2 id="生成工具" tabindex="-1">生成工具 <a class="header-anchor" href="#生成工具" aria-label="Permalink to &quot;生成工具&quot;">​</a></h2><p>Material Design 也提供了配套生成颜色的 npm 库：<a href="https://www.npmjs.com/package/@material/material-color-utilities" target="_blank" rel="noreferrer">@material/material-color-utilities</a>。</p><p>但是！截止到 2024/7/19，这个库的文档并没有给出如何使用的教程。文档给出的生成方式，会缺少 surface 相关的一些变量。</p><p>最新的使用参考，谁能想到藏在仓库的 issue 中：<a href="https://github.com/material-foundation/material-color-utilities/issues/101" target="_blank" rel="noreferrer">https://github.com/material-foundation/material-color-utilities/issues/101</a></p><h2 id="参考文章" tabindex="-1">参考文章 <a class="header-anchor" href="#参考文章" aria-label="Permalink to &quot;参考文章&quot;">​</a></h2><p><a href="https://firstlayout.net/generate-a-material-design-3-color-scheme-with-material-color-utilities/" target="_blank" rel="noreferrer">使用 Material Color Utilities 为 Material Design 3 创建配色方案</a></p>',31)]))}const g=e(i,[["render",s]]);export{h as __pageData,g as default};
