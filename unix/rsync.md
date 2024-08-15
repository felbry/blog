# rsync

复制目录下的所有文件 到 /path 目录下，当 /path 不存在时能自动创建（`./` 不包含目录名！）

`rsync ./ root@1.1.1.1:/path -avz --delete --exclude 'node_modules'`

复制指定目录下的所有文件（不包含目录？和`./dist/`有没有区别？）

`rsync ./dist/* root@1.1.1.1:/path -avz --delete`

## 参数解析

[参考连接](https://wangchujiang.com/linux-command/c/rsync.html)

```bash
rsync [OPTION] LOCAL_PATH [USER@]host:REMOTE_PATH

-a，--archive # 归档，递归传递，等同于-rlptgoD
-v，--verbose # 输出详细信息
-z，--compress # 传输时压缩
--delete # 删除服务端中本地没有的数据
--exclude # 文件或文件夹名
# 要排除多个，可以多使用几次传参，比如--exclude 'a' --exclude 'b'
# 也可以用大括号语法，比如--exclude={'a', 'b'} (a和b之间有个空格没成功，下次试试没空格)
```
