import { observe } from './observe/index.js'

export function initState (vm) {
  const opts = vm.$options
  if (opts.data) {
    initData(vm)
  }
}

function proxy (vm, target, key) {
  Object.defineProperty(vm, key, {
    get () {
      return vm[target][key]
    },
    set (newValue) {
      if (newValue === vm[target][key]) return
      vm[target][key] = newValue
    }
  })
}

function initData (vm) {
  let data = vm.$options.data
  // data可能是函数，也可能是对象
  data = typeof data === 'function' ? data.call(vm) : data
  // 对数据进行劫持，vue2里采用了Object.defineProperty
  observe(data)
  // 劫持之后，将data挂载到vm上
  vm._data = data
  // 将vm._data用vm来代理
  for (let key in data) {
    proxy(vm, '_data', key)
  }
}