import path from 'path'
import fs from 'fs'
import { camelize } from '@vue/shared'
export default function appendImportsToMarkdown(options = {}) {
  const { examplesRoot } = options
  const relativeExamples = './' // 文档相对examples文件夹的位置，可通过frontmatter自定义
  return {
    name: 'append-imports-to-markdown',
    enforce: 'pre',
    transform(content, filename) {
      if (!filename.endsWith('.md')) return
      const pageId = path.basename(filename, '.md') // 当前文档名称
      const pageDemoRoot = path.resolve(examplesRoot, pageId)
      if (!fs.existsSync(pageDemoRoot)) return // 如果examples下没有当前文档的同名目录，返回
      const customRelativeExamples = '' // TODO: 后续从content的frontmatter中解析出来
      const files = fs.readdirSync(pageDemoRoot)
      const imports = []
      for (const item of files) {
        if (!/\.vue$/.test(item)) continue
        const file = item.replace(/\.vue$/, '')
        const name = camelize(`Exp-${pageId}-${file}`)
        imports.push(
          `import ${name} from '${
            customRelativeExamples || relativeExamples
          }examples/${pageId}/${item}'`
        )
      }
      return (content += `\n<script setup>\n
        ${imports.join('\n')}
      </script>\n
      `)
    },
  }
}
