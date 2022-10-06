import babel from 'rollup-plugin-babel'

// rollup默认可以导出一个对象，作为打包的配置文件
export default {
  input: './src/index.js', // 入口文件
  output: {
    file: 'dist/umd/vue.js', // 出口文件
    name: 'Vue', // global.Vue
    format: 'umd', // 打包的格式 esm es6 commonjs amd iife umd
    sourcemap: true // es6 -> es5 开启源码调试 可以找到源代码的报错位置
  },
  plugins: [
    babel({
      exclude: 'node_modules/**' // 不编译node_modules下的文件
    })
  ]
}