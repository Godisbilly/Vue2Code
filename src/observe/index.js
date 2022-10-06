class Observer {
  constructor(data) {
    // Object.defineProperty只能劫持已经存在的数据，后增的、删除的属性都不能被检测到，因此Vue2中新增了一些API，如$set、$delete
    // 遍历对象
    this.walk(data)
  }

  walk (data) {
    // 遍历对象，对属性依次劫持
    // 将数据属性转换为访问器属性
    Object.keys(data).forEach(key => {
      defineReactive(data, key, data[key])
    })
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
  return new Observer(data)
}