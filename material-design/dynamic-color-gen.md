# 动态生成颜色

::: tip
文中关于色彩的 hue、chroma、tone 属于色彩专业知识，一般不需要关注，更多信息可以参照[Defining colors with hue, chroma, and tone (HCT)](https://m3.material.io/styles/color/system/how-the-system-works#e1e92a3b-8702-46b6-8132-58321aa600bd)
:::

## Material 主题构建

https://material-foundation.github.io/material-theme-builder/ 可以在线体验定制主题效果

## 生成步骤

### 一、1 生 5

选定一个主题色，根据这个颜色的 hue 和 chroma，可以生成五种互补的关键颜色

![](https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgm3sandbox%2Fimages%2Fln9w1sps-from-source-color-to-key-colors.png?alt=media&token=44238439-ec0c-4d45-b7a2-6f2aea5f3dee)

其中 primary、secondary、tertiary 分别对应主、次、第三

neutual 是中性的、neutral variant 中性变体

### 二、创建调色板

然后操纵这五种颜色的 tone 和 chroma 创建其对应的调色板

![](https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgm3sandbox%2Fimages%2Fln9w374d-tonal-palettes.png?alt=media&token=5c257795-85d9-4b1e-af1e-6951893fad98)

### 三、分配给 color roles

举个例子：对于 primary 调色板，可以将 primary40 分配给 primary，将 primary100 分配给 on primary。

![](https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgm3sandbox%2Fimages%2Flna5kf0e-color-assignement.png?alt=media&token=09a959ec-9c56-4264-8081-a85675710c2c)

按照这样的分配思路，实现了所有场景的颜色分配

![](https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgm3sandbox%2Fimages%2Flna5l4y4-tonal-palettes-color-roles.png?alt=media&token=c288d062-bb2a-4b33-8573-c6b56d72bdd7)

## 支持三种对比度

在生成颜色时，有 standard、medium（3:1）、high 三种对比度可选，由于每种人群对不同颜色对比度的感知不同，可以根据场景设置合适的对比度。

![](https://img.wangj.top/image.361glknzji.webp)

举例来说：一种颜色的 50 和 99 的色值就能创建出 3:1 的对比度

![](https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgm3sandbox%2Fimages%2Flna5uajq-user-controlled-contrast_02.png?alt=media&token=b6f05de2-6499-4960-a104-8ddd13dce787)

而 30 和 99 就能创建出更高的 7:1 的对比度

![](https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgm3sandbox%2Fimages%2Flna5v5x9-user-controlled-contrast_03.png?alt=media&token=f7654b21-b660-4c79-b82e-d77ee1372af4)

## 生成工具

Material Design 也提供了配套生成颜色的 npm 库：[@material/material-color-utilities](https://www.npmjs.com/package/@material/material-color-utilities)。

但是！截止到 2024/7/19，这个库的文档并没有给出如何使用的教程。文档给出的生成方式，会缺少 surface 相关的一些变量。

最新的使用参考，谁能想到藏在仓库的 issue 中：https://github.com/material-foundation/material-color-utilities/issues/101

## 参考文章

[使用 Material Color Utilities 为 Material Design 3 创建配色方案](https://firstlayout.net/generate-a-material-design-3-color-scheme-with-material-color-utilities/)
