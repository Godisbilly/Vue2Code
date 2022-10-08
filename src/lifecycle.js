export function LifeCycle (Vue) {

  // 渲染虚拟DOM
  Vue.prototype._render = function () {
    console.log('render')
  }

  // 变成真实DOM
  Vue.prototype._update = function () {
    console.log('update')
    const vm = this
    vm.$options.render() // 通过ast语法转义后生成的render方法
  }

}



export function mountComponent (vm, el) {
  // 调用render方法，产生虚拟节点 虚拟DOM
  vm._render() // vm.$options.render() 虚拟节点
  //根据虚拟DOM产生真实DOM
  // 插入到el元素中
}

// Vue核心流程：
// 1.创造了响应式数据
// 2.模板转换成ast语法树
// 3.将ast语法树转换成render函数
// 4.后续每次数据更新可以只执行render函数，无须再次执行ast转化的过程
// render函数会去产生虚拟节点（使用响应式数据），根据生成的虚拟节点创造真实的DOM