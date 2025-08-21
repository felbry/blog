# 颜色角色

[color roles](https://m3.material.io/styles/color/roles)

![](https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgm3sandbox%2Fimages%2Fln4letb9-all-color-roles-diagram.png?alt=media&token=020eaf3d-36bb-477a-8c6c-b588ace2b073)

## 基础概念（名词解释）

- Surface：用于屏幕背景和比较大的、低强调区域
- Primary、Secondary、Tertiary：用于强调或弱化前景元素的强调色
- Container：用作类似按钮这种前景元素的填充色
- On：其配对父颜色之上的 文本 或 图标颜色
- Variant - 较低强调色

## Primary

![](https://img.wangj.top/image.8s36zj8azb.webp)

1 是 on primary，2 是 primary

![](https://img.wangj.top/image.64dqp6fi7w.webp)

3 是 on primary container，4 是 primary container

## Secondary

![](https://img.wangj.top/image.1aovt1v01p.webp)

1 是 on secondary container，2 是 secondary container

## Tertiary

![](https://img.wangj.top/image.3goaetmv36.webp)

1 是 on tertiary container，2 是 tertiary container

## Surface

surface 即表面(背景色)，当元素过多时，就会出现表面(背景色)“叠加”的场景，此时有两种方案区分层级：

第一种是相对值，分为 surface dim，surface，surface bright。这里的 dim 和 bright 都是相对 surface 的，不论是 light 还是 dark 主题，bright 始终要亮于 surface。

![](https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgm3sandbox%2Fimages%2Fln4oqecc-%5B1P%5D%20color-surface-mapping-surface-bright.png?alt=media&token=b8f2bd75-88ac-4dc3-a0a7-34ff0b65396f)

上图是 light 主题：1 是 surface bright，2 是 surface container

![](<https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgm3sandbox%2Fimages%2Fln4oqywa-%5B1P%5D%20color-surface-mapping-surface-bright%20(1).png?alt=media&token=61f63c06-ab39-49dd-94f7-bf1d9b5805c3>)

上图是 dark 主题：1 是 surface bright，2 是 surface container

可以看出，1 的亮度始终是高于 2 的。

第二种是绝对值，分为 surface，和 surface container lowest、surface container low、surface container、surface container high、surface container highest

surface 通常用于大背景场景，而 surface container 就是其前景元素的填充色，比如下边这张图：

![](https://img.wangj.top/image.39l2jedddc.webp)

1 是 surface（用作页面级别的背景），2 是 surface container（导航栏是个前景元素，作为这个前景元素的填充色）

在 Material Design 的规范中，默认中性色组件（如导航栏，菜单或弹窗）都会使用 surface container（low/high/highest）角色。如下图：

![](https://img.wangj.top/image.9kg2ha4fgr.webp)

## Outline

outline：文本输入框 border、tag。多用于小范围，单一内容的强调

outline variant：分隔线、包含多个元素的大组件 border（比如 card）、或是类似商品块这种逐个排列的（就没必要再用太重的强调线包裹）。

## 总结

该章节针对每种颜色做了简单的概述，提炼出以下几点

- 容器背景有 surface -> [color] container -> [color] 可以用，从底至顶的强调顺序基本也是如此。但是 surface 本身有一套自己的层级逻辑，详见 surface 一节。
