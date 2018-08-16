var { version } = require('../package.json')
var args = process.argv.splice(2)
var isTest = !!args[0]
var apiHost = 'http://api.qnsharing.com/'    //部署正式服务器
if(isTest) {
  apiHost = 'http://sharing.tsingning.com/'      //部署测试服务器
}

module.exports = {
  NODE_ENV: '"production"',
  API_HOST: '"' + apiHost + '"',
  VERSION: '"' + version + '"'
}
