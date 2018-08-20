import Vue from 'vue'
import VueResource from 'vue-resource'
import { ToastPlugin } from 'vux'
import crypto from 'crypto'
import {wechatLogin} from '../wx/wx-login'
import { is_weixin, getUrlKey } from '../util/public-fun'
Vue.use(VueResource)
Vue.use(ToastPlugin)

Vue.prototype.base_url = process.env.BASE_URL

Vue.prototype.showToast = function(text) {
  Vue.$vux.toast.text(text, 'center')
}

//生成device id
if (!window.getCookie('device')) {
  var md5 = crypto.createHash('md5')
  md5.update(new Date().getTime() + '-' + Math.floor(Math.random() * 10000))
  window.setCookie('device', md5.digest('hex'))
}

//请求锁，避免同一条请求重复发送
const httpLockArr = {} 
//设置Http请求拦截器
Vue.http.interceptors.push(function(request, next) {
  let lastRequest = httpLockArr[request.url]
  request.url = Vue.prototype.base_url + request.url
  if (lastRequest) {
    return false
  }
  httpLockArr[request.url] = request
  request.headers.set('Content-Type', 'application/json;charset=utf-8')
  request.headers.set('Api-Version', '1')

  next(function(response) {
    httpLockArr[request.url] = null
    if (response.ok) {
      let data = response.data
      if (data.code == 0) {
        response.data = data.data
      } else if (data.code == 304) {
       
      } else if (data.code == '00000004') {
        
        response.ok = false;
        if(is_weixin() && sessionStorage.isBind){
          sessionStorage.removeItem('openId');
          wechatLogin();
        }else{
          window.appVue.$router.push({
            path: '/entry',
            query: {redirect: window.appVue.$route.fullPath}
          })
        }
        
      } else if (data.code == '1001') {
        console.log('log.do->code=1001')
      } else if (data.code == '504') {
        
        response.ok = false
      }else if (data.code == 'US_040002') {
        response.data = data.data
        response.ok = true
      } else {
        Vue.prototype.showToast(data.msg)
        Vue.$vux.loading.hide()
        response.ok = false
      }
      return response
    } else {
    }
  })
})
