<template>
  <div class="view">
    <div class="coupons_view">
      <div id="coupons-wrap">
        <img :src="info.photoPath" @error="setErrorImgTouxiang($event,45,45)" class="img-tips">
        <div class="result-tips">
          <span class="name">{{info.mobile}}</span>
          <span class="title">送你</span>
        </div>
        <div class="result-desc">
          <p class="coupons_money">
            <span>￥</span>20</p>
          <p class="coupons_font" v-if="coupon_status == 1">请在{{time| dateFormat('MM-dd HH:mm')}}前领取，超过时间未领将退还给分享人</p>
          <p class="coupons_font" v-if="coupon_status == 2">很抱歉，此购物币已经被领取</p>
          <p class="coupons_font" v-if="coupon_status == 3">很抱歉，已超过24小时未领取，购物币已退还回分享人</p>
        </div>
        <div class="go-now" v-if="coupon_status == 1" @touchend="gonow()">立即领取</div>
        <div class="go-now" v-if="coupon_status!=1">已失效</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      coupon_amount: 0,
      coupon_time: '',
      coupon_id: '', //购物币id
      coupon_status: '', //优惠券状态
      info: '',
      time: ''
    }
  },
  created() {
    this.setTitle('购物币赠送')
    this.weixin_init()
    this.couponPresentId = this.$route.query.value
    this.getCoupons() //获取物币信息
  },
  methods: {
    //购物币信息
    getCoupons() {
      this.$http
        .get('order/coupon_present_query.do', {
          params: {
            couponPresentId: this.couponPresentId
          }
        })
        .then(res => {
          let data = res.data
          this.info = JSON.parse(data.userInfo)
          this.coupon_status = data.presentedStatus
          this.time = data.forPresentTime - 24 * 60 * 60 * 1000
        })
    },
    decode(input) {
      function _utf8_decode(utftext) {
        var string = ''
        var i = 0
        var c = 0,
          c1 = 0,
          c2 = 0,
          c3 = 0
        while (i < utftext.length) {
          c = utftext.charCodeAt(i)
          if (c < 128) {
            string += String.fromCharCode(c)
            i++
          } else if (c > 191 && c < 224) {
            c2 = utftext.charCodeAt(i + 1)
            string += String.fromCharCode(((c & 31) << 6) | (c2 & 63))
            i += 2
          } else {
            c2 = utftext.charCodeAt(i + 1)
            c3 = utftext.charCodeAt(i + 2)
            string += String.fromCharCode(
              ((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63)
            )
            i += 3
          }
        }
        return string
      }

      var _keyStr =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
      var output = ''
      var chr1, chr2, chr3
      var enc1, enc2, enc3, enc4
      var i = 0
      input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '')
      while (i < input.length) {
        enc1 = _keyStr.indexOf(input.charAt(i++))
        enc2 = _keyStr.indexOf(input.charAt(i++))
        enc3 = _keyStr.indexOf(input.charAt(i++))
        enc4 = _keyStr.indexOf(input.charAt(i++))
        chr1 = (enc1 << 2) | (enc2 >> 4)
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2)
        chr3 = ((enc3 & 3) << 6) | enc4
        output = output + String.fromCharCode(chr1)
        if (enc3 != 64) {
          output = output + String.fromCharCode(chr2)
        }
        if (enc4 != 64) {
          output = output + String.fromCharCode(chr3)
        }
      }
      output = _utf8_decode(output)
      return output
    },
    //领取购物币
    gonow() {
      this.$http
        .get('order/coupon_present_receive.do', {
          params: {
            couponPresentId: this.couponPresentId
          }
        })
        .then(res => {
          this.$router.replace({ name: 'coupons_success' })
        })
    }
  }
}
</script>

<!-- 底部菜单组件css样式 -->
<style scoped lang="less">
@import '../../styles/index.less';
@import '../../styles/coupons.less';
.view {
  background: #f5f8fb;
  bottom: 0;
}
.coupons_view {
  background: #1b1a1f;
  bottom: 0;
  width: 100%;
  height: 100%;
}
#coupons-wrap .go-now {
  .px2rem(margin-top, 169);
}
#coupons-wrap .img-tips {
  margin: 0 auto;
  display: block;
}
#coupons-wrap .result-tips {
  font-size: 20px;
  color: #272728;
  .pxrem(margin-top, 16);
  position: relative;
  /*.title {
		position: absolute;
	}*/
  display: flex;
  align-items: center;
  justify-content: center;
}

.result-tips > .name {
  display: inline-block;
  .pxrem(max-width, 200);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.go-now {
  border: 1px solid #272728;
  border-radius: 30px;
  color: #272728;
}
.coupons_money {
  color: #ff6532;
}
</style>
