// h() _c()
export function createElementVNode (vm, tag, data = {}, ...children) {
  let key = data.key
  if (key) delete data.key

  return vnode(vm, tag, key, data, children)
}

// _v()
export function createTextNode (vm, text) {
  return vnode(vm, undefined, undefined, undefined, undefined, text)
}

// key diff算法
// ast做的是语法层面的转化，它描述的是语法本身
// 虚拟DOM是对真实DOM的描述，它描述的是真实DOM的结构，可以增加一些自定义属性
function vnode (vm, tag, key, data, children, text) {
  return {
    vm,
    tag,
    key,
    data,
    children,
    text
  }
}