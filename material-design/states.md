# 状态

在背景和文字之间，还存在一个状态层（可能通过 background-color 实现？参照下其它 material 组件库）

![](https://lh3.googleusercontent.com/qxvTFAHPEnP5p1L9Hr2F6_p-doSHs6LZBsn95my3Ls_k5bfJEg2YI3ygL2ALT38eAnWv5dQDHlnFYsq6TsbEaBqc5Xz1YNN6m5l_i1HgsYWQ=s0)

这个层的颜色按 content 颜色来。比如一个组件背景色是 primary container，文字颜色是 on primary container，就采用 on primary container 作为状态层颜色，其透明度按下图所示：

![](https://lh3.googleusercontent.com/EUs1U6XOcLtSeua57AwLOI9hfoUOXSPvqin7KqRdW6DZ5QWskOXWNYRinFNNxMHRecgqH-im2YKjIBmcps36beA4A6xYwEdlacJelogPMTJOfA=s0)

除了 hover（8%）、focus（10%）、press（10%），drag（16%），

还有一个 disabled，这个状态将启用状态的不透明度设置成**38%**。
