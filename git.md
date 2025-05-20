# Git

[管理多个 Git 身份](https://garrit.xyz/posts/2023-10-13-organizing-multiple-git-identities)

## 标签

- `git tag` 列出所有标签
- `git tag -l "op\*"` 列出命名以 op 开头的所有标签，此时必须加 `-l` 参数

### 创建

创建标签分为 轻量标签 和 附注标签，轻量标签有点像“一次 commit 的别名”；附注标签包含更多有效信息。

#### 附注标签（-a）

`git tag -a v1.4 -m "my version 1.4"`
其中 `-m` 存储一条额外信息，不指定会调出编辑器让输入

#### 轻量标签

`git tag v1.5`

### 查看

`git show v1.4`

### 推送

推送分支并不会推送 tag，要推送到远程服务器，需要显式推送

- 推送单个：`git push origin <tagname>`
- 推送本地有，远程服务器没有的：`git push origin --tags`

## 批量删除除了某个分支(dev)的其他分支

`git branch | grep -vE '^develop$' | xargs git branch -D`(该条命令还未最终验证，等下次)

`git branch | grep -vE '^(develop|develop@2|develop@3)$' | xargs git branch -D` (该条命令还未最终验证，等下次)

- `-v` 是反向查找（除了）
- `-E` 使用扩展正则表达式

`git branch | grep -vE '^(develop|develop@appImg\.cfb\.0520|develop@visitor-new\.zmj\.0429@test)$' | xargs git branch -D` 验证失败，在`develop@appImg.cfb.0520`上执行，将其它分支全部删除了

## gitignore 忽略已经提交过的文件

`git rm -r --cached xxx`

这个 xxx 既可以是文件，也可以是文件夹（文件夹末尾最好带/），也可以是 glob 模式

## 回到之前某个版本号

`git reset --hard hashId`

## 合并几个 commit

这三条命令还不是很明确，squash 没看懂。

1. `git rebase -i hashId`
2. `squash`

撤销合并操作：`git rebase --abort`

## 添加更新远程仓库

- `git remote add second_origin root@server_ip_address:/usr/school` 添加
- `git remote set-url second_origin root@server_ip_address:/usr/school` 更新

## git pull 默认策略

```bash
hint: Pulling without specifying how to reconcile divergent branches is
hint: discouraged. You can squelch this message by running one of the following
hint: commands sometime before your next pull:
hint:
hint:   git config pull.rebase false  # merge (the default strategy)
hint:   git config pull.rebase true   # rebase
hint:   git config pull.ff only       # fast-forward only
hint:
hint: You can replace "git config" with "git config --global" to set a default
hint: preference for all repositories. You can also pass --rebase, --no-rebase,
hint: or --ff-only on the command line to override the configured default per
hint: invocation.
```

小白快速配置：`git config pull.ff false --global`。[参考文章](https://blog.csdn.net/wq6ylg08/article/details/114106272)

## 改密码要重置本地密码

`sudo git config --system --unset credential.helper`（一般需要管理员权限）

然后拉取或推送代码，重新登录即可

## .gitignore

```bash
# 忽略所有 dist 文件夹
dist/

# 除了 a 目录下的 dist 文件夹
!a/dist/
```
