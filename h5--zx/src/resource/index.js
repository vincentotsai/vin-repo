import Vue from 'vue'
import VueResource from 'vue-resource'
Vue.use(VueResource)

Vue.http.options.root = process.env.API_HOST
// Vue.http.options.root = 'http://192.168.1.197:8089'
// Vue.http.options.root = 'http://test.qnlive.1758app.com'
Vue.http.headers.common['version'] = process.env.VERSION

window.$http = Vue.http

const toError = function(name) {
  //数据请求失败弹出提示，并关闭loading
  Vue.$vux.loading.hide()
  $router.push({
    name
  })
}
const showToast = function(text, type) {
  //数据请求失败弹出提示，并关闭loading
  Vue.$vux.loading.hide()
  Vue.$vux.toast.show({
    type,
    text
  })
}

const httpLockArr = {} //请求锁，避免同一条请求重复发送
//设置Http请求拦截器
Vue.http.interceptors.push(function (request, next) {
  let lastRequest = httpLockArr[request.url]
  if (lastRequest) {
    return false
  }
  httpLockArr[request.url] = request

  let token = localStorage.getItem('ZX_H5_ACT')
  if (token) {
    request.headers.set('access_token', token)
  }

  next(function (response) {
    httpLockArr[request.url] = null
    if (response.ok) {
      let data = response.data
      if (data.code == 0) {
        response.data = data.res_data
      } else {
        showToast(data.msg, 'cancel')
        response.ok = false
      }
      return response
    } else {
      toError(response.status)
    }
  })
})
