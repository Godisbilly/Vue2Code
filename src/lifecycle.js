import { createElementVNode, createTextNode } from "./vdom.index.js"


export function initLifeCycle (Vue) {

  // 渲染虚拟DOM
  Vue.prototype._render = function () {
    console.log('render')
  }

  Vue.prototype._c = function () {
    return createElementVNode(this, ...arguments)
  }

  Vue.prototype._v = function () {
    return createTextNode(this, ...arguments)
  }

  Vue.prototype._s = function (value) {
    return JSON.stringify(value)
  }

  // 变成真实DOM
  Vue.prototype._update = function () {
    console.log('update')
    // 生成虚拟节点
    // 让with中的this指向vm
    return vm.$options.render.call(this) // 通过ast语法转义后生成的render方法
  }

}



export function mountComponent (vm, el) {
  // 1.调用render方法，产生虚拟节点 虚拟DOM
  // 执行vm.$options.render()方法，生成虚拟节点
  // vm._update() 将虚拟节点生成真实节点
  vm._update(vm._render())
  // 2.根据虚拟DOM产生真实DOM
  // 3.插入到el元素中
}

// Vue核心流程：
// 1.创造了响应式数据
// 2.模板转换成ast语法树
// 3.将ast语法树转换成render函数
// 4.后续每次数据更新可以只执行render函数，无须再次执行ast转化的过程
// render函数会去产生虚拟节点（使用响应式数据），根据生成的虚拟节点创造真实的DOM