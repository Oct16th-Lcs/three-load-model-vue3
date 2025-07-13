``` js
pnpm install amfe-flexible --save
pnpm install postcss autoprefixer postcss-pxtorem --save-dev

// 在main.js，引入
import 'amfe-flexible';
console.log('当前 rem:', document.documentElement.style.fontSize);

//创建 postcss.config.js

// postcss.config.js
module.exports = {
  plugins: {
    autoprefixer: {},
    'postcss-pxtorem': {
      rootValue: 75, // 对应设计稿 750px / 10 = 75px
      propList: ['*'], // 所有属性都转换 px 为 rem
      exclude: /node_modules/i, // 忽略 node_modules
      selectorBlackList: [], // 不转换的类名
      ignoreIdentifier: false,
      minPixelValue: 2, // 最小转换像素值
      mediaQuery: false, // 是否转换媒体查询中的 px
      replace: true,
      unitPrecision: 5, // 保留的小数位数
      viewportUnit: 'vw', // 可选 vw/vh
    },
  },
};

// 在index.html，设置<meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no">
