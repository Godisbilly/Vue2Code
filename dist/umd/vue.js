(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }

  // 重写数组中的部分方法
  // 获取数组的原型
  var oldArrayProto = Array.prototype; // newArrayProto.__proto__ = oldArrayProto

  var newArrayProto = Object.create(oldArrayProto); // 变异方法（能修改原数组的方法）

  var methods = ['push', 'pop', 'shift', 'unshift', 'reverse', 'sort', 'splice'];
  methods.forEach(function (method) {
    newArrayProto[method] = function () {
      var _oldArrayProto$method;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      // 重写了数组方法，但是调用的时候还是调用的原来的方法
      // 函数劫持
      // 这个this指的是调用数组方法的那个数组
      var result = (_oldArrayProto$method = oldArrayProto[method]).call.apply(_oldArrayProto$method, [this].concat(args)); // 需要对新增的数据进行劫持


      var inserted;

      switch (method) {
        case 'push':
        case 'unshift':
          inserted = args;
          break;

        case 'splice':
          inserted = args.slice(2);
          break;
      }

      if (inserted) {
        var ob = this.__ob__;
        ob.observeArray(inserted);
      } // 这个result是数组的长度


      return result;
    };
  });

  var Observer = /*#__PURE__*/function () {
    function Observer(data) {
      _classCallCheck(this, Observer);

      // 给数组增加一个标识，如果数据上有__ob__属性，则说明这个属性被观测过
      // data.__ob__ = this
      Object.defineProperty(data, '__ob__', {
        enumerable: false,
        configurable: true,
        writable: true,
        value: this
      }); // Object.defineProperty只能劫持已经存在的数据，后增的、删除的属性都不能被检测到，因此Vue2中新增了一些API，如$set、$delete
      // 遍历对象

      if (Array.isArray(data)) {
        // 重写数组中的方法
        data.__proto__ = newArrayProto; // 对数组中的对象数据进行劫持

        this.observeArray(data); //需要保留数组原有的特性，并且重写部分方法
      } else {
        this.walk(data);
      }
    }

    _createClass(Observer, [{
      key: "walk",
      value: function walk(data) {
        // 遍历对象，对属性依次劫持
        // 将数据属性转换为访问器属性
        Object.keys(data).forEach(function (key) {
          defineReactive(data, key, data[key]);
        });
      }
    }, {
      key: "observeArray",
      value: function observeArray(data) {
        // 数组中的对象可以被检测到，不是对象属性的在进入到observe函数中就已经被return了
        data.forEach(function (v) {
          return observe(v);
        });
      }
    }]);

    return Observer;
  }();

  function defineReactive(target, key, value) {
    // 如果属性值是一个对象，那么需要递归劫持
    if (_typeof(value) === 'object') {
      observe(value);
    } // 重新定义属性，将数据属性转换为访问器属性


    Object.defineProperty(target, key, {
      get: function get() {
        return value;
      },
      set: function set(newValue) {
        if (newValue === value) return;
        value = newValue;
      }
    });
  }

  function observe(data) {
    // 只对有效对象进行劫持
    if (_typeof(data) !== 'object' || data === null) return; // 如果一个对象被劫持过，那就不需要再被劫持了
    // 判断一个对象是否被劫持过，可以增添一个实例，用实例来判断是否被劫持过
    // 如果data上有__ob__属性，则说明这个对象已经被劫持过了

    if (data.__ob__ instanceof Observer) return data.__ob__;
    return new Observer(data);
  }

  function initState(vm) {
    var opts = vm.$options;

    if (opts.data) {
      initData(vm);
    }
  }

  function proxy(vm, target, key) {
    Object.defineProperty(vm, key, {
      get: function get() {
        return vm[target][key];
      },
      set: function set(newValue) {
        if (newValue === vm[target][key]) return;
        vm[target][key] = newValue;
      }
    });
  }

  function initData(vm) {
    var data = vm.$options.data; // data可能是函数，也可能是对象

    data = typeof data === 'function' ? data.call(vm) : data; // 对数据进行劫持，vue2里采用了Object.defineProperty

    observe(data); // 劫持之后，将data挂载到vm上

    vm._data = data; // 将vm._data用vm来代理

    for (var key in data) {
      proxy(vm, '_data', key);
    }
  }

  function compileToFunction(template) {
    // 对模板进行编译
    // 将template转换成ast语法树
    // 生成render方法（render方法执行后的返回结果就是虚拟DOM）
    console.log('compileToFunction', template);
  }

  function initMixin(Vue) {
    // 初始化操作
    Vue.prototype._init = function (options) {
      // 先将options挂载到vue实例上
      // 接下来就是处理options
      var vm = this;
      vm.$options = options; // 初始化状态

      initState(vm);

      if (options.el) {
        // 实现数据的挂载
        vm.$mount(options.el);
      }
    };

    Vue.prototype.$mount = function (el) {
      var vm = this;
      var opts = vm.$options;

      if (!opts.render) {
        // 先进行查找，有没有render函数，如果没有renderh函数，再看一下是否写了template，如果写了template，就用template，没有则用el获取template
        var template;

        if (opts.template) {
          template = opts.template;
        } else {
          if (opts.el) {
            var div = document.querySelector(el);
            template = div.outerHTML;
          }
        }

        if (template) {
          opts.render = compileToFunction(template); // jsx最终会被编译成h('xxx')
        }
      }

      if (typeof opts.render === 'function') opts.render(); // script标签引用的vue.global.js  这个编译过程是在浏览器中运行的
      // runtime是不包含模板编译的，整个编译是打包的时候通过loader来转译.vue文件的，用runtime的时候不能用template
    };
  }

  function Vue(options) {
    this._init(options);
  }

  initMixin(Vue);

  return Vue;

}));
//# sourceMappingURL=vue.js.map
