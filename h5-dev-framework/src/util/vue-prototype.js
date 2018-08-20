import Vue from 'vue'
import bus from './bus'


/**
 * 是否有新消息
 * return Promise
 */
Vue.prototype.newMsgTip = function() {
  return new Promise((resolve,reject) => {
    let param = {
      params: {
        equipmentType: 0,
        activeLastTime: '',
        orderLastTime: '',
        trainLastTime: '',
        vdianLastTime: ''
      }
    }
    Vue.http.get('market/msg/count.do', param).then(res => {
      let data = res.data
      // H5只有活动消息和订单消息
      if (data.activeUnReadCount > 0 || data.orderUnReadCount > 0) {
        resolve(true)
      } else {
        resolve(false)
      }
    })
  })
}
// 购物车里商品数量
Vue.prototype.globalUpdateCartCount = function() {
  Vue.http.get('order/cart_count.do').then(res => {
    let cartCount = res.data.cartCount
    window.setCookie('cartCount', cartCount)
    bus.$emit('cart-count-change', cartCount)
  })
}

// 重置属性 eg:用于选择列表下某一项
Vue.prototype.resetProp = function(arr, prop, value) {
  for (let i = 0; i < arr.length; i++) {
    arr[i][prop] = value
  }
}
//验证密码格式
Vue.prototype.pwFormat = function(pw) {
  if (!/^[A-Za-z0-9]+$/.test(pw) || pw.toString().length < 6) {
    return false
  }
  return true
}
//验证手机号格式
Vue.prototype.phoneFormat = function(telephone) {
  if (!/^1[34578]\d{9}$/.test(telephone)) {
    return false
  }
  return true
}
//设置标题
Vue.prototype.setTitle = function(title) {
  document.title = title
  let iframe = document.createElement('iframe')
  iframe.style.cssText = 'height:1px;width:1px;overflow:hidden;display:none'
  iframe.onload = function() {
    setTimeout(function() {
      iframe.parentNode.removeChild(iframe)
    }, 0)
  }
  document.body.appendChild(iframe)
}

//时间戳转日期 格式：2017-11-11 11:11:11
Vue.prototype.getLocalTime = function(timestamp) {
  let date = new Date(timestamp)
  let Y = date.getFullYear() + '-'
  let M =
    (date.getMonth() + 1 < 10
      ? '0' + (date.getMonth() + 1)
      : date.getMonth() + 1) + '-'
  let D = date.getDate() + ' '
  let h =
    date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':'
  let m =
    date.getMinutes() < 10
      ? '0' + date.getMinutes() + ':'
      : date.getMinutes() + ':'
  let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
  return Y + M + D + h + m + s
}
//时间戳转日期 格式：2017年11月11日
Vue.prototype.getLocalTimeYMD = function(timestamp) {
  let date = new Date(timestamp)
  let Y = date.getFullYear()
  let M =
    date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
  let D = date.getDate()
  return Y + '年' + M + '月' + D + '日'
}
//时间戳转日期 格式：11月11日
Vue.prototype.getLocalTimeYM = function(timestamp) {
  let date = new Date(timestamp)
  let M =
    date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
  let D = date.getDate()
  return M + '月' + D + '日'
}
//时间戳转日期 格式：11月11日11:11
Vue.prototype.getLocalTimeYMDS = function(timestamp) {
  let date = new Date(timestamp)
  let M = date.getMonth() + 1
  let D = date.getDate()
  let h =
    date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':'
  let m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
  return M + '月' + D + '日' + h + m
}
//时间戳转日期 格式: 11:11
Vue.prototype.getLocalTimeHM = function(timestamp) {
  let date = new Date(timestamp)
  let M = date.getMonth() + 1
  let D = date.getDate()
  let h =
    date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':'
  let m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
  return h + m
}

//屏蔽微信分享
Vue.prototype.weixin_init = function() {}
Vue.prototype.signature_init = function() {
  wx.config({
    debug: false,
    appId: this.appId,
    timestamp: this.timestamp,
    nonceStr: this.nonceStr,
    signature: this.signature,
    jsApiList: [
      'chooseImage',
      'previewImage',
      'uploadImage',
      'downloadImage',
      'hideOptionMenu',
      'hideMenuItems'
    ]
  })
  wx.ready(function() {
    wx.hideOptionMenu()
  })
  wx.error(function(res) {
    // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
  })
}
//微信分享
Vue.prototype.weixin_show = function() {}
Vue.prototype.signature_show = function() {
  wx.config({
    debug: false,
    appId: this.appId,
    timestamp: this.timestamp,
    nonceStr: this.nonceStr,
    signature: this.signature,
    jsApiList: [
      'chooseImage',
      'previewImage',
      'uploadImage',
      'downloadImage',
      'hideOptionMenu',
      'hideMenuItems'
    ]
  })
  wx.ready(function() {
    wx.showOptionMenu()
  })
  wx.error(function(res) {})
}

window.getCookie = function(name) {
  if(name=='token' && sessionStorage.token){
    return sessionStorage.token
  }
  var arr,
    reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
  if ((arr = document.cookie.match(reg))) return unescape(arr[2])
  else return null
}
window.delCookie = function(name) {
  if(name=='token'){
    sessionStorage.removeItem('token');
  }
  var date = new Date();
  date.setTime(date.getTime() - 10000);
  document.cookie = name + "=a; expires=" + date.toGMTString();
}
window.setCookie = function(name, value) {
  if(name=='token'){
    sessionStorage.token = value;
  }
  var Days = 7
  var exp = new Date()
  exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000)
  document.cookie =
    name + '=' + escape(value) + ';expires=' + exp.toGMTString() + ';path=/'
}

/**
 * 获取用户用户登录后下发抽奖次数
 */
Vue.prototype.getLotteryTime = function() {
  if (!window.getCookie('token')) {
    return false
  }
  Vue.http.get('uc/get_config_info.do').then(res => {
  })
}
