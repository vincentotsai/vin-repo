import Vue from 'vue'

const isDev = process.env.NODE_ENV == 'development'

const weixinPay = (data, callback) => {
  function onBridgeReady() {
    WeixinJSBridge.invoke(
      'getBrandWCPayRequest',
      data,
      function (res) {
        if (res.err_msg == "get_brand_wcpay_request:ok") { // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
          let prepay_id = data.package.split('=')[1]
          let checkInterval = setInterval(function() {
            Vue.http.get('sharing-server-user-common/user/common/payment/weixin/orderquery', {
              prepay_id: prepay_id,
              profit_type: 0
            }).then(function(response) {
              let code = response.data.code
              if(code == 0) {
                callback()
                clearTimeout(checkInterval)
                Vue.$vux.loading.hide()
              } else if(code != 120017) {
                clearTimeout(checkInterval)
                Vue.$vux.loading.hide()
              }
            })
          }, 2000)
        } else {
          Vue.$vux.loading.hide()
        }
      }
    );
  }
  if(isDev) {
    //开发调试代码
    setTimeout(() => {
      callback()
      Vue.$vux.loading.hide()
    }, 2000)
  } else {
    if (typeof WeixinJSBridge == "undefined") {
      if (document.addEventListener) {
        document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
      } else if (document.attachEvent) {
        document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
        document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
      }
    } else {
      onBridgeReady();
    }
  }
}

Vue.prototype.$wx = {
  pay(id, cb) {
    Vue.$vux.loading.show({
      text: '支付中'
    })
    let shopId = sessionStorage.getItem('ZX_H5_SHOP_ID')
    Vue.http.get('sharing-server-user-common/user/common/payment/weixin/bill', {
      params: {
        profit_type: '0',
        course_id: id,
        shop_id: shopId,
        platform: '0'
      }
    }).then(res => {
      let data = res.data
      let payData = {
        "appId": data.appId,     //公众号名称，由商户传入
        "timeStamp": '' + data.timeStamp,         //时间戳，自1970年以来的秒数
        "nonceStr": data.nonceStr, //随机串
        "package": data.package,
        "signType": data.signType,         //微信签名方式：
        "paySign": data.paySign //微信签名
      }
      weixinPay(payData, cb)
    })
  }
}
