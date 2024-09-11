# Git使用规范

## 前置条件

- 这里设定每个项目的主(生产)分支都是develop

## 克隆一个新仓库

`git clone 项目地址 本地文件夹名(可选)`

![image](https://felbry.github.io/picx-images-hosting/image.8vmuy45y0p.webp)

## 基于远程develop分支 创建 本地develop分支

::: tip
对于分支，首先要搞清楚**远程**和**本地**的区别。

本地是本地的（只有`push`操作才能将本地的内容推送保存到远程）

远程是远程的（只有`fetch`，`pull`操作才能将远程的内容拉取到本地）

因此，最佳实践就是：本地分支A对应`push`和`pull`远程分支A，这样就能建立**一对一的映射效果**；而不要把本地分支A`push`到远程分支B上去。
:::

首先运行`git branch`，看下刚clone下来的项目有没有**本地分支**

![image](https://felbry.github.io/picx-images-hosting/image.1lbrn33nn5.webp)

可以看到，默认有一个`main`的本地分支。可以理解为在clone动作时，就基于远程的`main`分支创建了对应的本地`main`分支。（有的项目可能是`master`，这取决于创建git仓库时所用的git版本，对于这个默认初始分支名称，低版本是`master`，高版本是`main`）

运行`git branch -a`，可以看到**本地分支**和**远程分支**。（远程分支都是 remotes/origin 开头的）

![image](https://felbry.github.io/picx-images-hosting/image.39l4ka9mge.webp)

::: info 基于远程分支创建本地分支分两步
第一切换到远程分支，第二从中检出。
:::

> 1. 切换到远程分支

`git checkout remotes/origin/develop`

![image](https://felbry.github.io/picx-images-hosting/image.92q2tl5n90.webp)

> 2. 从中检出

`git checkout -b develop`

![image](https://felbry.github.io/picx-images-hosting/image.2krv09wk1c.webp)

此时再运行`git branch`，可以看到已有远程develop分支对应的本地develop分支了，且当前正处于该分支上。

![image](https://felbry.github.io/picx-images-hosting/image.6ik8gy8zzz.webp)

## [重点/必读] 分支命名规范

::: tip 规范1：分支分隔符
分支名要表明是从哪个分支检出，`@`的作用就是分隔父和子。
:::

**PS：早期规范是用`-`分隔父和子，但是存在两个问题：**
1. 分隔效果不太明显
2. 当子分支名存在多个单词时仅能用小驼峰命名格式，不得不引入大写字母，如果用`@`的话，子分支名的多个单词就可以用`-`分割了

::: warning 为什么不用`/`分隔
会报`fatal: cannot lock ref 'refs/heads/develop/<desc>.<name>.<date>': 'refs/heads/develop' exists; cannot create 'refs/heads/develop/<desc>.<name>.<date>'`。也就是说可以创建`feat/xxx`，`hotfix/xxx`这样的分支，但不能创建`feat/xxx/kkk`这样的分支，会造成refs冲突。
:::

比如生产分支是`develop`，基于生产开发就是`develop@feat-a`，`develop@feat-b`。如果`feat-b`后面又需要加人开发，那这个新人应该起一个`develop@feat-b@my-desc`的新分支。

**分支的层级最大应该控制在4级以内，大多数需求2～3级就够。过深的层级应该考虑下是否有必要。**

::: tip 规范2：分支说明信息
业务分支还需要加上 创建人员姓名缩写 以及 创建时间(MMDD格式) 的信息。这些信息统一用`.`来修饰

而特殊/长期分支无需这些信息
:::

比如小明要开发一个修改姓名的功能，他的分支应该叫：`develop@modify-name.xm.0909`。这是一个日常开发业务的分支，所以应该包含创建者名缩写和时间。

而一些特殊的场景，比如用于长期部署测试环境，分支名叫`develop@test`，就无需包含这些信息。

## 创建自己的分支

上面已经提到过，从当前分支检出一条新分支的命令是：`git checkout -b 新分支名`。

假设当前位于本地develop分支上，我的名字叫小明，要开发一个个人中心页面，就可以执行`git checkout -b develop@personal-page.xm.0909`

## [重点/必读] 分支合并规范

当你在做合并时，考虑下有没有**严格遵守**这几条规范：

1. 仅且只有你一人在操作的分支，可以随意的`push`或`pull`

比如上面例子：`develop@personal-page.xm.0909`。这个分支已经声明是小明在9月9日创建的要开发个人中心的分支，仅且只有小明一人会操作它，小明就可以自由的对该分支`push`或`pull`，不会影响他人

2. 2人+的合作分支，不允许在本地`push`，`merge`，仅能`pull`

拿`develop`生产分支举例，任何人的代码最终都要合进来，这就算是一个2人+的合作分支。

🚫 不能在本地`develop`上，执行`git push origin develop`操作

🚫 不能在本地`develop`上，执行`git merge 其它分支`操作

✅ 可以在本地`develop`上，执行`git pull origin develop`拉取远程最新的代码（由于你没有在本地对该合作分支进行过任何更新，因此这个`pull`动作永远不会出现冲突）

::: info 向合作分支合并的标准流程
以`develop@personal-page.xm.0909`向`develop`合并为例：

1. 先在本地`develop@personal-page.xm.0909`上，执行`git push origin develop@personal-page.xm.0909`
2. 在Gitlab项目主页，发起“New Merge Request”，Source branch选`develop@personal-page.xm.0909`，Target branch选`develop`，接着下一步
3. 此时分有冲突和没有冲突两种情况：没有冲突可以直接完成合并，有冲突按如下方式解决：

当有冲突时，关闭当前Merge Request。本地分支切换到`develop`，执行`git pull origin develop`；然后本地分支切换到`develop@personal-page.xm.0909`，执行`git merge develop`。此时就能看到有冲突的文件。修改所有有冲突的文件，依次执行`git add .`、`git commit -m 解决冲突`。最后继续按上述步骤1、2、3来执行即可。
:::

::: tip 总结
在实际应用中，`develop@personal-page.xm.0909`类比你的个人开发分支，`develop`类比2人+的合作分支，举一反三即可。
:::

### 特殊场景的合并（单向合并）

按照我们的分支管理规范，每个人拥有自己的分支，各自开发各自的，互不干扰。

但也有这样的特殊场景：在一个时间范围内，小红开发功能A，小明开发功能B，此时都需要部署测试环境。如果部署小红的分支，就会覆盖掉小明的，反之一样。

我们需要一个新临时分支来包含小红、小明、...的功能以便测试。由于目的很明确，我们可以统一叫`develop@test`分支。它的名字表示是从`develop`检出的为了测试的分支。

::: danger 为什么单独讲这种合并呢？
由于`develop@test`的特殊性，在合并时仅且只能执行单向合并。你的分支可以随意合并到`develop@test`（合坏了大不了再删掉重建它），但万不可将`develop@test`合并到你的分支。

我们举一个具体的场景：

小红开发功能A，小明开发功能B，它俩都会合并到`develop@test`以便测试。

临近上线，产品要求功能B不上线了，如果小红和小明都按照标准管理分支，此时只需要把小红的功能A分支合并进生产分支即可。

但是如果没有按照要求，小红在测试过程中，自己的分支还不小心合并了`develop@test`，那她自己的功能A分支也会包含小明的功能B代码，就没办法解耦了。
:::

向`develop@test`合并的步骤按照标准流程的1～3步走即可。只是在解决冲突时略有不同。

以`develop@feat-a.xh.0909`向`develop@test`合并发生冲突为例：

切换到本地分支`develop@test`，执行`git pull origin develop@test`，执行`git merge develop@feat-a.xh.0909`，此时就能看到有冲突的文件。修改所有有冲突的文件，依次执行`git add .`、`git commit -m 解决冲突`、`git push origin develop@test`。
