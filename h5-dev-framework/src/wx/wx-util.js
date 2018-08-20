import Vue from 'vue'
import { is_weixin } from '../util/public-fun'
export default {
  config() {
    console.log('> 初始化微信sdk')
    if(!is_weixin()){
      return;
    }
    let httpData = {
      params: {
        url: location.href.split('#')[0]
      }
    }
    return false
    Vue.http.get("order/get_wx_configuration.do", httpData).then(res => {
      let configData = res.data
      console.log('> 初始化微信sdk完成！')
      wx.config({
        // debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: configData.appId, // 必填，公众号的唯一标识
        timestamp: configData.timestamp, // 必填，生成签名的时间戳
        nonceStr: configData.nonceStr, // 必填，生成签名的随机串
        signature: configData.signature, // 必填，签名，见附录1
        jsApiList: [
          'chooseImage',
          'onMenuShareTimeline',
          'onMenuShareAppMessage',
          'uploadImage',
          'downloadImage',
          'startRecord',
          'hideMenuItems',
          'showMenuItems',
          'stopRecord',
          'onVoiceRecordEnd',
          'playVoice',
          'pauseVoice',
          'stopVoice',
          'onVoicePlayEnd',
          'downloadVoice',
          'getNetworkType',
          'openLocation',
          'getLocation',
          'getBrandWCPayRequest',
          'chooseWXPay',
          'checkJsApi'
        ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
      })
      wx.error(function () {
        console.log('error')
      })
      wx.ready(function () {
        console.log('ready')
      });
    })
  }
}
