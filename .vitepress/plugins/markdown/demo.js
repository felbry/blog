import path from 'path'
import fs from 'fs'
export default function createDemoContainer(md) {
  return {
    validate(params) {
      return !!params.trim().match(/^demo\s*(.*)$/)
    },

    render(tokens, idx) {
      // 这里只能获取到 token 字符串信息，已知examples路径，后续拼接的字符串都需要提供
      const m = tokens[idx].info.trim().match(/^demo\s*\[(.*?)\].*$/)
      if (tokens[idx].nesting === 1 /* means the tag is opening */) {
        const otherProps = m && m.length > 1 ? m[1] : ''
        const sourceFileToken = tokens[idx + 2]
        let source = ''
        const sourceFile = sourceFileToken.children?.[0].content ?? ''
        if (sourceFileToken.type === 'inline') {
          source = fs.readFileSync(path.resolve('examples', `${sourceFile}.vue`), 'utf-8')
        }
        if (!source) throw new Error(`Incorrect source file: ${sourceFile}`)
        return `<Demo source="${encodeURIComponent(
          md.render(`\`\`\` vue\n${source}\`\`\``)
        )}" path="${sourceFile}" raw-source="${encodeURIComponent(source)}"${
          otherProps ? ` ${otherProps}` : ''
        }>
      <template #source><exp-${sourceFile.replaceAll('/', '-')}/></template>`
      } else {
        return '</Demo>\n'
      }
    },
  }
}
