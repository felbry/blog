# Apifox 批量模拟数据

在 Apifox 中，批量发起请求的**第一步**是“先创建一个接口”，如图所示：

![image](https://felbry.github.io/picx-images-hosting/image.64e4e768ib.webp)

从图中可知：

- 接口定义了**body 的参数值**`id`从**环境变量**`myId`中取（双大括号包裹就是变量的写法）
- 采用“示例”的模式，能快速将已有的 JSON 数据复制进来（如果采用“数据结构”的模式，要一个一个配字段，很麻烦）

**第二步**就是“批量发起该接口”，如图所示：

![image](https://felbry.github.io/picx-images-hosting/image.9kgg6aatfk.webp)

在运行之前，我们还需要一项额外设置，点击上图**第 2 步**添加的接口，进入编辑页面，如图所示：

![image](https://felbry.github.io/picx-images-hosting/image.sz7ti5bu0.webp)

在“自动生成”下拉框中，有很多选项。这些选项决定了你请求发起时“模拟数据是怎么生成的”。其中前几项适合“数据结构”的配置模式，由于最开始图省事采用了“示例”的模式，因此这里也要选择“使用请求示例”，最后全部保存。

此时，你可以批量运行 10 次看看效果（先不使用测试数据）

![image](https://felbry.github.io/picx-images-hosting/image.2rvejuhle0.webp)

::: v-pre
你会看到，在没有测试数据的情况下，实际请求发起的 Body 参数值就是固定的{{myId}}，因为此时环境里还没有`myId`这个变量
:::
