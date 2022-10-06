import { initState } from "./state.js"
import { compileToFunction } from "./compiler/index.js"

export function initMixin (Vue) {
  // 初始化操作
  Vue.prototype._init = function (options) {
    // 先将options挂载到vue实例上
    // 接下来就是处理options
    const vm = this
    vm.$options = options

    // 初始化状态
    initState(vm)


    if (options.el) {
      // 实现数据的挂载
      vm.$mount(options.el)
    }
  }

  Vue.prototype.$mount = function (el) {
    const vm = this
    const opts = vm.$options
    if (!opts.render) {
      // 先进行查找，有没有render函数，如果没有renderh函数，再看一下是否写了template，如果写了template，就用template，没有则用el获取template
      let template
      if (opts.template) {
        template = opts.template
      } else {
        if (opts.el) {
          const div = document.querySelector(el)
          template = div.outerHTML
        }
      }
      if (template) {
        opts.render = compileToFunction(template)
        // jsx最终会被编译成h('xxx')
      }
    }
    if (typeof opts.render === 'function') opts.render()

    // script标签引用的vue.global.js  这个编译过程是在浏览器中运行的
    // runtime是不包含模板编译的，整个编译是打包的时候通过loader来转译.vue文件的，用runtime的时候不能用template
  }
}