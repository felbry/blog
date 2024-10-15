# [Node.js 常用 API](https://nodejs.cn/api/)

## API

### 全局变量

- `__dirname` 当前文件静态位置的上级文件夹绝对路径
- `__filename` 当前文件静态位置的绝对路径

### [process](https://nodejs.cn/api/process.html)

无需引入

- `.cwd()` （哪个文件）运行该文件时的上级文件夹绝对路径

### [path](https://nodejs.cn/api/path.html)

`import path from 'path'`

- `.resolve(p1, p2, ...)` （文档是`.resolve([...paths])`，不知道什么意思？可以试试数组） 将路径或路径片段序列解析为绝对路径

  给定路径从右到左处理，**直到构建出**绝对路径（因此想要拼接若干 path，除第一个外，其它开头都不要带`/`）；如果处理完所有给定 path 后，还没有生成绝对路径，则使用当前工作目录

  生成路径被规范化，并**删除尾部斜杠**（除了解析为根目录）

  如果没有传入 path，则返回当前工作目录。此时`path.resolve()`等于`process.cwd()`

  ```js
  path.resolve('/foo', '/bar', 'baz') // 输出 /bar/baz
  path.resolve('/foo/bar', './baz') // 输出 /foo/bar/baz

  path.resolve('/foo/bar', '/tmp/file/') // 输出 /tmp/file

  path.resolve('wwwroot', 'static_files/png/', '../gif/image.gif') // 假设当前目录是 /mnt/c，输出 /mnt/c/wwwroot/static_files/gif/image.gif
  ```

- `.basename(path [, ext])` 返回 path 的文件名

  ```js
  path.basename('/foo/bar/baz/asdf/quux.html') // 输出 quux.html
  path.basename('/foo/bar/baz/asdf/quux.html', '.html') // 输出 quux
  ```

- `.dirname(path)` 返回 path 的文件名目录绝对路径

  ```js
  path.dirname('/foo/bar/baz/asdf/quux') // 输出 /foo/bar/baz/asdf
  path.dirname('/foo/bar/baz/asdf/quux/') // 输出 /foo/bar/baz/asdf/quux
  ```
