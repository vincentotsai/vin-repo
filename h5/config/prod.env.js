
var args = process.argv.splice(2)
var env={
  NODE_ENV: '"production"',
  httpUrl:'"http://web.7mall.cn/"',
  args: args
}
if(args[0] && args[0] == 'test') {
  env.BASE_URL='"http://web.7mall.com/"'
}
if(args[0] && args[0] == 'dev') {
  // env.BASE_URL='"http://180m473y65.imwork.net:15408/"' //公众号调试链接
  env.BASE_URL='"http://web.7mall.com/"'

}
if(args[0] && args[0] == 'pro') {
  env.BASE_URL='"http://web.7mall.cn/"'
}
if(args[0] && args[0] == 'ola') {
  env.BASE_URL='"https://web.suibianbuy.cn/"'
}
module.exports = env
