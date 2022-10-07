import { parseHTML } from './parse'


// Vue3采用的不是正则表达式
// 对模板进行编译处理
export function compileToFunction (template) {
  // 对模板进行编译
  // 将template转换成ast语法树
  // 生成render方法（render方法执行后的返回结果就是虚拟DOM）
  let ast = parseHTML(template)
  console.log('ast', ast)
}