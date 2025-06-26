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

接下来就**使用测试数据**批量生成`myId`这个变量

## 从 CSV 中批量导入

首先选中**测试数据**，并点击**新建**

![image](https://felbry.github.io/picx-images-hosting/image.sz7uewbew.webp)

![image](https://felbry.github.io/picx-images-hosting/image.5c18xe2tnw.webp)

CSV 的数据如下图，它只有一列，列头名称为`ID`：

![image](https://felbry.github.io/picx-images-hosting/image.2vf0igyuuf.webp)

导入 Apifox 的效果如下：

![image](https://felbry.github.io/picx-images-hosting/image.4jodfnqakj.webp)

可以看到，除了`ID`列，最前面还自动生成了一列“数据集名称”，这个“数据集名称”可以理解为一条数据的唯一标识。

比如第一行，就是名叫“数据集-1”的这条数据包含了一个变量`ID`，值为`00616c24-866c-46d5-b7bc-ac5...`。（你可以继续添加列 2（变量 2），列 3（变量 3），这样一条数据就可以有多个变量了）

::: tip 注意
列头标题其实就是**变量名称**

在接口中，我们定义的是取`myId`这个变量值。因此，要将导入的列头`ID`改为`myId`
:::

数据准备好后，就可以**运行**了，如下图所示，关联已创建的测试数据，循环次数根据测试数据的条数自动计算：

![image](https://felbry.github.io/picx-images-hosting/image.8dx4ymn6j7.webp)

![image](https://felbry.github.io/picx-images-hosting/image.8ojyrs30kp.webp)

在运行二次确认弹窗中，也可以**只勾选部分数据**，这里“数据集名称”的作用就体现出来了，它可以让你快速找到你想要使用的数据。

我们只勾选前 5 条，点击运行，结果如下：

![image](https://felbry.github.io/picx-images-hosting/image.b965umme8.webp)

可以看到，变量`myId`已经被替换为对应的测试数据

::: danger 注意一处错误
上图中，Body 的`id`值前后缺少了引号，不是正确的字符串格式

因此，接口定义中的<span v-pre>"id": {{myId}}</span>要写成<span v-pre>"id": "{{myId}}"</span>才行
:::
