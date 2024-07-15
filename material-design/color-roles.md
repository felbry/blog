# 颜色角色

[color roles](https://m3.material.io/styles/color/roles)

## 基础概念

- Surface：用于屏幕背景和比较大的、低强调区域
- Primary、Secondary、Tertiary：用于强调或弱化前景元素的强调色
- Container：用作类似按钮这种前景元素的填充色
- On：其配对父颜色之上的 文本 或 图标颜色
- Variant - 较低强调色

## Primary

![image](https://felbry.github.io/picx-images-hosting/image.8s36zj8azb.webp)

1 是 on primary，2 是 primary

![image](https://felbry.github.io/picx-images-hosting/image.64dqp6fi7w.webp)

3 是 on primary container，4 是 primary container

## Secondary

![image](https://felbry.github.io/picx-images-hosting/image.1aovt1v01p.webp)

1 是 on secondary container，2 是 secondary container

## Tertiary

![image](https://felbry.github.io/picx-images-hosting/image.3goaetmv36.webp)

1 是 on tertiary container，2 是 tertiary container

## Surface

surface 有两个维度，

一个是自身维度，分为 surface dim，surface，surface bright

![](https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgm3sandbox%2Fimages%2Fln4oqecc-%5B1P%5D%20color-surface-mapping-surface-bright.png?alt=media&token=b8f2bd75-88ac-4dc3-a0a7-34ff0b65396f)

![](<https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgm3sandbox%2Fimages%2Fln4oqywa-%5B1P%5D%20color-surface-mapping-surface-bright%20(1).png?alt=media&token=61f63c06-ab39-49dd-94f7-bf1d9b5805c3>)
一个是两种维度，分为 surface，和 surface container（container 又分为五种：lowest、low、自身、high、highest）

## 总结

该章节针对每种颜色做了简单的概述，提炼出以下几点

- 容器背景有 surface -> [color] container -> [color] 可以用，从底至顶的顺序基本也是如此。但是 surface 本身有一套自己的层级逻辑，详见 surface 一节。
