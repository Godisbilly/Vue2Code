// 重写数组中的部分方法

// 获取数组的原型
let oldArrayProto = Array.prototype

// newArrayProto.__proto__ = oldArrayProto
export let newArrayProto = Object.create(oldArrayProto)

// 变异方法（能修改原数组的方法）
let methods = ['push', 'pop', 'shift', 'unshift', 'reverse', 'sort', 'splice']

methods.forEach(method => {
  newArrayProto[method] = function (...args) {
    // 重写了数组方法，但是调用的时候还是调用的原来的方法
    // 函数劫持
    // 这个this指的是调用数组方法的那个数组
    const result = oldArrayProto[method].call(this, ...args)
    // 需要对新增的数据进行劫持
    let inserted
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
      default:
        break
    }
    if (inserted) {
      let ob = this.__ob__
      ob.observeArray(inserted)
    }
    console.log('inserted', inserted)
    // 这个result是数组的长度
    return result
  }
})

