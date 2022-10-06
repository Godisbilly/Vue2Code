import { initMixin } from './init.js'


function Vue (options) {
  console.log('Vue options', options)
  this._init(options)
  console.log('this', this)
}

initMixin(Vue)

export default Vue