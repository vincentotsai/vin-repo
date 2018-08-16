# ola

> * ola 开发分支

## steps

### install

```shell
git clone repo
cd repo
npm i
```

### 运行本地环境

```shell
 npm run dev dev  //代理到dev环境
 npm run dev test //代理到test环境
 npm run dev ola  //代理到ola正式环境
```

### 编译正式环境

```shell
npm run build dev  //开发环境
npm run build test //测试环境
npm run build pro  //正式环境
npm run build ola  //ola正式环境 、灰度
```
