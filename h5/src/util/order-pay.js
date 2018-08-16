import Vue from 'vue'
import wxpay from '@/wx/wxpay'

/**
 * 订单id
 * 价格
 */
Vue.prototype.aliPay = function(order_id, price) {
  let httpData = {
    orderNo: order_id,
    payPrice: price,
    payType: 2,
    source: 1
  }
  Vue.http.post('order/wap_pay.do', httpData).then(res => {
    document.body.innerHTML = res.data
    document.forms[0].submit()
  })
}

Vue.prototype.wxPay = function(order_id, price) {
  let httpData = {
    orderNo: order_id,
    payPrice: price,
    source: 1,
    openId: sessionStorage.openId
  }
  Vue.http.post('order/wx_h5_pay.do', httpData).then(res => {
    wxpay.weixinPay(res.data, function(data) {
      window.appVue.$router.push({
        name: 'success',
        query: {
          total_amount: price,
          out_trade_no: order_id
        }
      })
    })
  })
}
