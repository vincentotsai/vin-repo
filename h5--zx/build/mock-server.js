var express = require('express');
var devIp = require('dev-ip'); //用来获取本机ip地址
var klaw = require('klaw');
var path = require('path');
var _ = require('lodash');
var Mock = require('mockjs');
var config = require('../config/index.js');

const port = config.dev.mockPort;

var methodFlag = ['$get', '$post', '$put', '$delete']; //常用的四种请求方法

var mockDir = path.join(process.cwd(), 'mock');

var host = devIp();

var routers = {
  '/': {}
};

var error;
var mockFiles = [];
klaw(mockDir)
  .on('data', function (item) {
    //如果是js文件
    if (/^.*\.js$/.test(item.path)) {
      mockFiles.push(item.path);
    }
  })
  .on('end', function () {
    mockFiles.forEach(function (route) {
      try {
        var routeObj = require(route); //获取mock文件夹里面的内容（对象）
        if (routeObj.$router) {
          //   delete routeObj.$route; //??why
          routers[routeObj.$router] = routeObj;
        } else {
          routers['/'] = Object.assign({}, routers['/'], routeObj);
        }
      } catch (e) {
        error = e;
        console.log(e);
      }
    });
    // Object.keys(routers).forEach((key) => {
    //   console.log('keys->>>', key)
    // })
    // console.log('routers->>>',routers)
    server(routers);
  });

function resData(res, data) {
  res.json(Object.assign({
    code: 0,
    msg: 'ok',
    res_data: ''
  }, {
    res_data: Mock.mock(data)
  }))
}

function server(routers) {
  const app = express();

  Object.keys(routers).forEach(function (key) {
    var routerConfig = routers[key];
    var router = new express.Router();
    Object.keys(routerConfig).forEach(function (routeKey) {
      if (routeKey === '$route') return;
      var routeHandle = routerConfig[routeKey];
      //如果内容是一个函数
      if (_.isFunction(routeHandle)) {
        router.use(routeKey, routeHandle);
      } //如果内容是一个对象
      else if (_.isObject(routeHandle)) {
        //如果$get/$post/$put/$delete中任一一个存在或者有值
        if (methodFlag.some(function (item) {
            return routeHandle[item];
          })) {
          methodFlag.forEach(function (item) {
            if (routeHandle[item]) {
              if (_.isFunction(routeHandle[item])) {
                router[item.toLowerCase().replace('$', '')](routeKey, routeHandle[item]);
              } //如果$get或者其他的值是对象
              else if (_.isObject(routeHandle[item])) {
                router[item.toLowerCase().replace('$', '')](routeKey, function (req, res, next) {
                  resData(res, routeHandle);
                  next();
                })
              }
            }
          });
        } else { //如果是个普通对象
          router.use(routeKey, function (req, res, next) {
            resData(res, routeHandle);
            next();
          })
        }
      } //如果是字符串
      else if (_.isString(routeHandle)) {
        router.use(routeKey, function (req, res, next) {
          resData(res, routeHandle);
          next();
        })
      }
    });
    // 将路由挂载至应用
    app.use('/' + key, router);
  });
  //错误处理
  if (error) {
    app.use(function (req, res, next) {
      return next(error);
    })
  }
  //设置跨域
  // app.all('**', function(req, res, next) {
  //     res.header("Access-Control-Allow-Origin", "*")
  //     res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS')
  //     res.header("Access-Control-Allow-Headers", "X-Requested-With")
  //     res.header('Access-Control-Allow-Headers', 'Content-Type')
  //     next()
  // })
  app.listen(port, function () {
    console.log('mock Api前缀：' + '无');
    console.log('listening at http://' + host + ':' + port);
  })

}
