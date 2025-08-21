# 状态

## 状态层

在背景和文字之间，还存在一个状态层

![](https://lh3.googleusercontent.com/qxvTFAHPEnP5p1L9Hr2F6_p-doSHs6LZBsn95my3Ls_k5bfJEg2YI3ygL2ALT38eAnWv5dQDHlnFYsq6TsbEaBqc5Xz1YNN6m5l_i1HgsYWQ=s0)

这个层的颜色按 content 颜色来。比如一个组件背景色是 primary container，文字颜色是 on primary container，就采用 on primary container 作为状态层颜色，其透明度按下图所示：

![](https://lh3.googleusercontent.com/EUs1U6XOcLtSeua57AwLOI9hfoUOXSPvqin7KqRdW6DZ5QWskOXWNYRinFNNxMHRecgqH-im2YKjIBmcps36beA4A6xYwEdlacJelogPMTJOfA=s0)

hover（8%）、focus（10%）、press（10%），drag（16%）

### 具体实现

观察[@material/web 的 text-field 组件](https://material-web.dev/components/text-field/#input-type)

![](https://img.wangj.top/image.7p3i8axh37.webp)

可以看出，它的实现是分别定义了背景、状态层、组件容器三个元素。

感觉有些麻烦，个人实现先以动态改变`background-color`为准。

## disabled

disabled 和状态层还有所区别，在[Material Design v3 文档](https://m3.material.io/foundations/interaction/states/applying-states)中，说是将启用状态的不透明度设置成**38%**。

通过观察 button 和 text-fields 两个组件的文档：

![](https://img.wangj.top/image.3nritx6p4k.webp)

![](https://img.wangj.top/image.54xnvocin8.webp)

可以看到：文字和 icon 确实是正常状态的**38%**，但是背景稍有不同，一个是**12%**，一个是**4%**。因此得出结论：文字按**38%**，背景因组件而异。
