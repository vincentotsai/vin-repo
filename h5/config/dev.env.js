var merge = require('webpack-merge')
var prodEnv = require('./prod.env')
var env = {
  NODE_ENV: '"development"',
  BASE_URL: '""',
}
if(prodEnv.args[0] && prodEnv.args[0] == 'dev') {
  env.UC_URL = '"http://app.7mall.com/"';
  env.GOODS_URL = '"http://app.7mall.com/"';
  env.ADVERT_URL = '"http://app.7mall.com/"';
  env.ORDER_URL = '"http://app.7mall.com/"';
  env.COMMON_URL = '"http://app.7mall.com/"';
  env.REPORT_URL = '"http://app.7mall.com/"';
}
if(prodEnv.args[0] && prodEnv.args[0] == 'test') {
  env.UC_URL = '"http://app.7mall.com/"';
  env.GOODS_URL = '"http://app.7mall.com/"';
  env.ADVERT_URL = '"http://app.7mall.com/"';
  env.ORDER_URL = '"http://app.7mall.com/"';
  env.COMMON_URL = '"http://app.7mall.com/"';
  env.REPORT_URL = '"http://app.7mall.com/"';
}
if(prodEnv.args[0] && prodEnv.args[0] == 'pro') {
  env.UC_URL = '"http://app.7mall.cn/"';
  env.GOODS_URL = '"http://app.7mall.cn/"';
  env.ADVERT_URL = '"http://app.7mall.cn/"';
  env.ORDER_URL = '"http://app.7mall.cn/"';
  env.COMMON_URL = '"http://app.7mall.cn/"';
  env.REPORT_URL = '"http://app.7mall.cn/"';
}
if(prodEnv.args[0] && prodEnv.args[0] == 'ola') {
  env.UC_URL = '"https://app.suibianbuy.cn/"';
  env.GOODS_URL = '"https://app.suibianbuy.cn/"';
  env.ADVERT_URL = '"https://app.suibianbuy.cn/"';
  env.ORDER_URL = '"https://app.suibianbuy.cn/"';
  env.COMMON_URL = '"https://app.suibianbuy.cn/"';
  env.REPORT_URL = '"https://app.suibianbuy.cn/"';
}
module.exports = merge(prodEnv, env)
