import { newArrayProto } from './array.js'
class Observer {
  constructor(data) {
    // 给数组增加一个标识，如果数据上有__ob__属性，则说明这个属性被观测过
    // data.__ob__ = this
    Object.defineProperty(data, '__ob__', {
      enumerable: false,
      configurable: true,
      writable: true,
      value: this
    })
    // Object.defineProperty只能劫持已经存在的数据，后增的、删除的属性都不能被检测到，因此Vue2中新增了一些API，如$set、$delete
    // 遍历对象
    if (Array.isArray(data)) {
      // 重写数组中的方法
      data.__proto__ = newArrayProto
      // 对数组中的对象数据进行劫持
      this.observeArray(data)
      //需要保留数组原有的特性，并且重写部分方法
    } else {
      this.walk(data)
    }
  }

  walk (data) {
    // 遍历对象，对属性依次劫持
    // 将数据属性转换为访问器属性
    Object.keys(data).forEach(key => {
      defineReactive(data, key, data[key])
    })
  }

  observeArray (data) {
    // 数组中的对象可以被检测到，不是对象属性的在进入到observe函数中就已经被return了
    data.forEach(v => observe(v))
  }
}

function defineReactive (target, key, value) {
  // 如果属性值是一个对象，那么需要递归劫持
  if (typeof value === 'object') {
    observe(value)
  }

  // 重新定义属性，将数据属性转换为访问器属性
  Object.defineProperty(target, key, {
    get () {
      return value
    },
    set (newValue) {
      if (newValue === value) return
      value = newValue
    }
  })
}



export function observe (data) {
  // 只对有效对象进行劫持
  if (typeof data !== 'object' || data === null) return

  // 如果一个对象被劫持过，那就不需要再被劫持了
  // 判断一个对象是否被劫持过，可以增添一个实例，用实例来判断是否被劫持过
  // 如果data上有__ob__属性，则说明这个对象已经被劫持过了
  if (data.__ob__ instanceof Observer) return data.__ob__

  return new Observer(data)
}