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
  console.log('child', node)
  if (node.type === 1) {
    return codegen(node)
  } else {
    if (!defaultTagRE.test(node.text)) {
      return `_v(${JSON.stringify(node.text)})`
    }
    return node.text
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
  console.log('ast', ast)
  const code = codegen(ast)
  console.log('code', code)
}