## 起因

需求：
> * 一套简易轻量的静态页、活动页开发框架，能用 jQuery less等轻量技术

## 经过

**vue-cli** 搭的框架：
> * 默认 bundler 是 webpack，不够灵活
> * 要维护配置文件如 webpack.config.js
> * 想实现 HMR（热更新）,代码压缩等常见功能还需编写一堆 loaders & plugins
> * 打包速度还有进步的空间... （局限于nodejs 单进程）（当然可用 Happypack [实现多进程](https://jeffjade.com/2017/08/12/125-webpack-package-optimization-for-speed/)）
> * 最后，也最重要，打包后文件过大 200+k（big file）

适用场景：
> * [Parcel](https://github.com/parcel-bundler/parcel) - 中小型项目
> * Webpack - 大型以及企业级规模的项目
> * Rollup - 开发 NPM 包时

选择：
[parcel 尝鲜](https://medium.freecodecamp.org/all-you-need-to-know-about-parcel-dbe151b70082)

## 结果

git地址：