export default {
  plugins: {
    autoprefixer: {},
    'postcss-pxtorem': {
      // rootValue: 75,
      rootValue: 192, // 根元素字体大小 16/1.25
      propList: ['*'],
      exclude: /node_modules/i,
      selectorBlackList: [],
      minPixelValue: 2,
      mediaQuery: false,
      // unitPrecision: 5,
      unitPrecision: 2, // 转换成rem后保留的小数点位数
    }
  }
}
