# Zed

## 常用配置

[自动换行](https://zed.dev/docs/configuring-zed#soft-wrap)
```json
{ "soft_wrap": "editor_width" }
```
[TabSize](https://zed.dev/docs/configuring-zed#tab-size)
```json
{ "tab_size": 2 }
```
[失焦自动保存](https://zed.dev/docs/configuring-zed#autosave)
```json
{ "autosave": "on_focus_change" }
```

## 项目级别的配置

每个项目的配置可能有差异：

- 不同项目的缩进不一致
- 有的项目用ESLint格式化，有的项目用prettier

通过在项目根目录创建`.zed/settings.json`进行配置（也可以`Command + Shift + P`，选择`zed: open local settings`快捷创建）

## LSP（Language Server Protocol）

一种语言文件 可对应 多个LSP。

语言服务器可提供的特性：

- 代码补全
- 错误检查和诊断
- 代码导航（转到定义、查找引用）(F12: Go to Definition / Cmd + F12: Go to Type Definition / Shift + F12: Find All References)
- code actions（重命名、提取方法、`source.fixAll`）
- 悬停信息
- 工作区符号搜索
- [Inlay Hints](https://zed.dev/docs/configuring-languages#inlay-hints)
- ...

当打开一个文件时，Zed会自动下载和更新相对应的LSP。

### 手动配置某个语言文件关联的LSP

```json
"languages": {
  "PHP": {
    "language_servers": ["intelephense", "!phpactor", "..."]
  }
}
```

- `intelephense`为首要语言服务器
- `phpactor`被禁用（`!`表示禁用）
- `...`表示保留其它默认LSP的设置

### 手动禁用某个语言文件关联的全部LSP

```json
"languages": {
  "Markdown": {
    "enable_language_server": false
  }
}
```

### 自定义某个LSP的配置

::: tip
以下lsp的配置中，出现了`init_options`、`settings`、`initialization_options`等字段，具体取决于每个lsp自身的配置方式。

比如配置emmet，在[zed文档 - Emmet](https://zed.dev/docs/languages/emmet)中，查看对应的lsp文档，能清楚看到`init_options`和其配置项的说明。
:::

```json
"lsp": {
  "emmet": {
    "init_options": {
      "includeLanguages": {
        // vue-html应该是指template部分，vue覆盖的更全，就是整个vue文件，如果两个都配上没遇到啥问题，就多多益善吧。
        "vue-html": "html",
        "vue": "html"
      }
    }
  },
  "eslint": {
    "settings": {
      "codeActionOnSave": {
        "rules": ["import/order"]
      }
    }
  },
  "typescript-language-server": {
    "initialization_options": {
      // 点分隔配置是不支持的
      // "preferences.strictNullChecks": true,
      // 只能通过对象嵌套的方式
      "preferences": {
        "strictNullChecks": true
      }
    }
  },
  "rust-analyzer": {
    "initialization_options": {
      "checkOnSave": {
        "command": "clippy"
      }
    }
  },
}
```

## 配置语言

在LSP一节中，我们已经看到了如何配置某个语言。比如要配置`PHP`，可以这样：

```json
"languages": {
  "PHP": {
    ...
  }
}
```

完整的配置项如下：

- `tab_size` 每个缩进级别的空格数
- `formatter`
- `formatter_on_save`
- `code_actions_on_format`
- `language_servers`
- `enable_language_server`
- `hard_tabs` 使用制表符缩进而不是空格
- `perferred_line_length` 建议的最大行长度
- `soft_wrap` 如何换行长行代码

### formatter详解

方式1：指定某个LSP

```json
{
  "formatter": "language_server"
}
```

方式2：`external` **(只用Prettier推荐这种方式)**

```json
// prettier之所以要加--stdin-filepath，可能不指定文件就会格式这个工程的文件？
// {buffer_path}应该属于zed的变量？表明当前文件路径？不像是系统变量，因为在一个目录运行buffer_path肯定不能确定是哪一个文件。
{
  "formatter": {
    "external": {
      "command": "prettier",
      "arguments": ["--stdin-filepath", "{buffer_path}"]
    }
  }
}
```

```json
// 由于sed命令是直接从标准输入获取内容，而zed默认是将当前缓冲区的文本作为标准输入传，因此不用像prettier那样加--stdin-filepath？
// 以下等同于：sed -e 's/ *$//'
{
  "formatter": {
    "external": {
      "command": "sed",
      "arguments": ["-e", "s/ *$//"]
    }
  }
}
```

通过`command`指定命令，`argument`指定参数或值。可以执行命令行中能运行的任意命令，命令的标准输出（stdout）将会直接写入当前文件中。

方式3：LSP提供的code action **(只用ESLint推荐这种方式)**

```json
{
  "formatter": {
    "code_actions": {
      // Use ESLint's --fix:
      "source.fixAll.eslint": true,
      // Organize imports on save:
      "source.organizeImports": true
    }
  }
}
```

方式四：数组形式结合多个

```json
{
  "formatter": [
    {"language_server": {"name": "rust-analyzer"}},
    {"external": {
      "command": "sed",
      "arguments": ["-e", "s/ *$//"]
    }
  ]
}
```

## 登录问题

版本：[0.149.5+](https://zed.dev/releases/stable/0.149.5)

因为登录才能使用免费的Zed AI，因此要解决这个问题

需要走代理，

1. 确保规则模式将`zed.dev`追加，或是全局模式
2. 打开TUN模式（有些软件没有这个模式）
3. 修改zed配置文件，将`proxy`字段改为`http://127.0.0.1:7897`

```json
{
  "proxy": "http://127.0.0.1:7897",  // [!code ++]
}
```
