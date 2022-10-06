import { initState } from "./state.js"


export function initMixin (Vue) {
  // 初始化操作
  Vue.prototype._init = function (options) {
    console.log('init options', options)
    // 先将options挂载到vue实例上
    // 接下来就是处理options
    const vm = this
    vm.$options = options

    // 初始化状态
    initState(vm)
  }
}