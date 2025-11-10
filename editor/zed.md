# Zed

## 认识 Zed 的配置策略

当你打开一个文件时，Zed 会**自动**根据[Language Support in Zed](https://zed.dev/docs/languages#language-support-in-zed)去下载该语言的 **LSP** 和 Tree-sitter

- LSP（语言服务器协议）：提供了语义功能，一种语言可具备多个 LSP，可提供的特性：

  - 代码补全
  - 错误检查和诊断
  - 代码导航（转到定义、查找引用）(F12: Go to Definition / Cmd + F12: Go to Type Definition / Shift + F12: Find All References)
  - code actions（重命名、提取方法、`source.fixAll`）
  - 悬停信息
  - 工作区符号搜索
  - [Inlay Hints](https://zed.dev/docs/configuring-languages#inlay-hints) 内嵌提示
  - ...

- Tree-sitter：提供语法高亮和大纲面板这类基础结构功能

::: tip 如何识别特殊后缀文件？
通过[file_types](https://zed.dev/docs/configuring-zed#file-types)手动配置

```json
{
  "file_types": {
    "Shell Script": [".env.*"],
    "HTML": ["wxml"]
  }
}
```

:::

因此，你需要知道“**一个语言有哪些配置**”和“**某个 LSP 有哪些配置**”

### 配置语言

在全局的`languages`中配置某个语言

```json
"languages": {
  "PHP": {
    ...
  }
}
```

[完整的配置项](https://zed.dev/docs/configuring-languages#language-specific-settings)如下：

- `tab_size` 每个缩进级别的空格数
- `formatter` （既可以在全局配置、也可以在`languages`的某个语言配置）

  ::: details

  方式 1：固定值`language_server`，代表使用当前 LSP 提供的 format 能力

  ```json
  {
    "formatter": "language_server"
  }
  ```

  方式 2：`external` **(只用 Prettier 推荐这种方式)**

  官方推荐 prettier 的配置方式（如果全局没有安装prettier，可以像下边一样使用`npx`）：

  > [!CAUTION] 注意
  > prettier的配置经实践会报错，说是找不到文件，怀疑跟访问权限有关系
  >
  > 实际上，如果想使用prettier，只需要按方式1的`"formatter": "prettier"`即可，因为zed具备这个language_server

  ```json
  // --stdin-filepath为“标准输入文件路径”；{buffer_path}即当前正在编辑的文件路径
  {
    "formatter": {
      "external": {
        "command": "npx prettier",
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

  ~~方式 3：LSP 提供的 code action~~ 文档中的该方式是有问题，正确应该是使用`code_actions_on_format`

  ```json
  {
    "formatter": [
      // Use ESLint's --fix:
      { "code_action": "source.fixAll.eslint" },
      // Organize imports on save:
      { "code_action": "source.organizeImports" }
    ]
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

  :::

- `format_on_save`
- `enable_language_server`

  手动禁用 Markdown 语言文件关联的全部 LSP

  ```json
  "languages": {
    "Markdown": {
      "enable_language_server": false
    }
  }
  ```

- `hard_tabs` 使用制表符缩进而不是空格
- `perferred_line_length` 建议的最大行长度
- `soft_wrap` 如何换行长行代码
- `show_completions_on_input` 是否在输入时显示补全
- `show_completion_documentation`
- [`show_edit_predictions`](https://zed.dev/docs/ai/edit-prediction?highlight=show_edit_predic#disabling-automatic-edit-prediction) 编辑预测

之前有，但最新文档没提的（推测还能用）

- ~~`code_actions_on_format`~~ 这个配置在2025/11/10（0.211.6）还能用，而且文档中的`code_action`配置方式反倒是有问题的，垃圾文档
- ~~`language_servers`~~

  手动配置 PHP 语言文件关联的 LSP

  ```json
  "languages": {
    "PHP": {
      "language_servers": ["intelephense", "!phpactor", "..."]
    }
  }
  ```

  - `intelephense`为首要语言服务器
  - `phpactor`被禁用（`!`表示禁用）
  - `...`表示保留其它默认 LSP 的设置

### [配置 LSP](https://zed.dev/docs/configuring-zed#lsp)

::: tip
以下 lsp 的配置中，出现了`init_options`、`settings`、`initialization_options`等字段，具体取决于每个 lsp 自身的配置方式。

比如配置 emmet，在[zed 文档 - Emmet](https://zed.dev/docs/languages/emmet)中，查看对应的 lsp 文档，能清楚看到`init_options`和其配置项的说明。

在 Zed 的文档中，仅提到了`settings`和`initialization_options`，尚不清楚它内部能否自动将`initialization_options`转化为对于 LSP 所需要的`init`字段
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

## 配置实操

### 通用配置

```json
{
  // 自动换行 https://zed.dev/docs/configuring-zed#soft-wrap
  "soft_wrap": "editor_width",
  // tabSize https://zed.dev/docs/configuring-zed#tab-size
  "tab_size": 2,
  // 失焦自动保存 https://zed.dev/docs/configuring-zed#autosave
  "autosave": "on_focus_change"
}
```

### 项目级别的配置

每个项目的配置可能有差异：

- 不同项目的缩进不一致
- 有的项目用 ESLint 格式化，有的项目用 prettier

通过在项目根目录创建`.zed/settings.json`进行配置（也可以`Command + Shift + P`，选择`zed: open local settings`快捷创建）

## 登录问题

版本：[0.149.5+](https://zed.dev/releases/stable/0.149.5)

因为登录才能使用免费的 Zed AI，因此要解决这个问题

需要走代理，

1. 确保规则模式将`zed.dev`追加，或是全局模式
2. 打开 TUN 模式（有些软件没有这个模式）
3. 修改 zed 配置文件，将`proxy`字段改为`http://127.0.0.1:7897`

```json
{
  "proxy": "http://127.0.0.1:7897" // [!code ++]
}
```
