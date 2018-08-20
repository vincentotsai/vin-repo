/**
 * 微信登录模块
 */
import { is_weixin, getUrlKey } from '../util/public-fun'
import Vue from 'vue'

export function wechatLogin(cb) {
  if (!is_weixin() || sessionStorage.openId) {
    cb && cb()
    return
  }
  let code = getUrlKey('code')
  if (code) {
    wxToken(code)
    return
  } else {
    let redirect = encodeURIComponent(location.href)
    let appId = 'wxcd53b4051875c402'
    let href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${redirect}&response_type=code&scope=snsapi_base&state=123#wechat_redirect`
    location.href = href
  }

  function wxToken(code) {
    openIdLogin(code,function(){
      location.href = location.origin + location.pathname +  '#/' + location.href.split('#/')[1]
    })
  }
}
export function openIdLogin(code,cb) {
  let httpData = {
    code: code
  }
  Vue.http.post('uc/wx_h5_login.do', httpData).then(res => {
    sessionStorage.openId = res.data.openId;
    if(res.data.token){
      sessionStorage.isBind = true;
      window.setCookie('token', res.data.token)
      window.setCookie('userId', res.data.userId)
      window.setCookie('shopId', res.data.shopId)
      window.setCookie('userLevel', res.data.userLevel)
    }else{
      window.delCookie('token');
      sessionStorage.removeItem('isBind');
    }
    cb && cb()
  })
}