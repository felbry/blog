# 海拔

![](https://lh3.googleusercontent.com/qVW8urfZa3jvqJwERVwpU5e2f5ymWgMZjY3BTLOGR_n2OBwl8n94v0wpsSWgTKNUfGFUZGEoUFzOTNrquB-rJvxit41s5gr7Py0Gq2L33fs38g=s0)

不是每个层级都需要阴影，而是仅在需要采用

## 改变海拔

组件可以根据用户的交互或系统事件改变海拔（本例中通过添加阴影来实现）

![](https://img.wangj.top/zindex2.esehswvo7.gif)

## 形成海拔

![](https://lh3.googleusercontent.com/zRsfQByi4DAtv8IIeKdhr2kIsiYzFTGHUenDsGqz6wz8WYxaiOFEV17pI6YbbA4RYxAlIR8T8SOn0Enm4N9sg1AeBld8_ezOYVseYegHG8ijRw=s0)

1 是不同颜色，2 是阴影，3 是蒙层（文章里叫 scrim）

## 阴影

阴影的大小、柔和度或扩散程度能表示两个平面之间的距离程度。

![](https://img.wangj.top/image.7ax2207ttj.webp)

左图更小、更清晰的阴影表示和背景非常接近；右图更大、更柔和的阴影表示距离很远。

### 何时使用阴影？

当背景有图案或视觉上很复杂时，简单的分隔线无法提供界限，此时就能用阴影。

![](https://lh3.googleusercontent.com/P24wNEodwt-0_nWadPmEJF7OhaLbSj5uEedeU5Duj1IrbRYhs8SFexZ80Ipl_2jE81xyWQY164yYAHa24Z5Q0GOyLrOO7qpqTfr6v6mjVpSF=s0)

## 蒙层

蒙层的颜色使用`scrim color role`，不透明度为 32%。

![](https://lh3.googleusercontent.com/yRuvEj9pwX6IVcpMFmFKcfUoNAJTYgvhZClKnqXOgW-ALD3bFgtWThUsOY-H7GqEy538_ejZRfXw0NWgpzQKBKg1IqNUXxwzTtiLR_UX23CLKg=s0)
