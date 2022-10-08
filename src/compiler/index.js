import { parseHTML } from './parse'
function genProps (attrs) {
  let str = ''
  attrs.forEach(attr => {
    if (attr.name === 'style') {
      const obj = {}
      attr.value.split(';').forEach(item => {
        let [key, value] = item.split(':')
        obj[key] = value
      })
      attr.value = obj
    }
    str += `${attr.name}:${JSON.stringify(attr.value)},`
  })
  return `{${str.slice(0, -1)}}`
}

const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g
function genChild (node) {
  if (node.type === 1) {
    return codegen(node)
  } else {
    if (!defaultTagRE.test(node.text)) {
      return `_v(${JSON.stringify(node.text)})`
    }
    let tokens = []
    let match
    defaultTagRE.lastIndex = 0
    let lastIndex = 0
    while (match = defaultTagRE.exec(node.text)) {
      let index = match.index // 匹配的位置
      if (index > lastIndex) {
        tokens.push(JSON.stringify(node.text.slice(lastIndex, index)))
      }
      tokens.push(`_s(${match[1].trim()})`)
      lastIndex = index + match[0].length
    }
    if (lastIndex < node.text.length) {
      tokens.push(JSON.stringify(node.text.slice(lastIndex)))
    }
    return `_v(${tokens.join('+')})`
  }
}

function genChildren (children) {
  if (children) {
    return children.map(child => genChild(child)).join(',')
  } else {
    return children
  }
}

function codegen (ast) {
  let code = `_c(
    '${ast.tag}',${ast.attrs.length > 0 ? genProps(ast.attrs) : null}${ast.children.length > 0 ? `,${genChildren(ast.children)}` : null})`
  return code
}

// Vue3采用的不是正则表达式
// 对模板进行编译处理
export function compileToFunction (template) {
  // 对模板进行编译
  // 将template转换成ast语法树
  // 生成render方法（render方法执行后的返回结果就是虚拟DOM）
  let ast = parseHTML(template)
  let code = codegen(ast)
  // 所有模版的实现原理都是with + new Function
  code = `with(this){return ${code}}`
  return new Function(code) // 根据代码生成render函数
}