<template>
  <div class="order-content">
    <div class="order-lis-box">
      <!-- 收获地址 -->
      <div v-if="$route.query.isVirtual != 1">
        <div v-if="address && address.addressId" class="order-header" @click="goto_address()">
          <div class="font-weight">
            <div class="order-header-info">
              <span class="name">姓名：{{address.trueName}}</span>
              <span class="phone">{{address.mobile}}</span>
              <!-- <p class="order-header-id-card" v-if="address.identity_card">身份证：{{address.identity_card}}</p> -->
            </div>
            <div class="order-header-address">
              <span class="address-detail">收货地址：{{address.provinceName}}{{address.cityName}}{{address.areaName}}{{address.addressDetail}}</span>
            </div>
          </div>
          <img class="order-header-more" src="../../assets/user_icon_go@2x.png" width="100%" />
        </div>
        <!-- 添加地址 -->
        <div v-else class="order-header-none" @click="goto_addressedit()">
          <div class="order-header-none-more"></div>
        </div>
      </div>
      <!-- 商品信息 -->
      <ul class="goods-list" v-for="(item,index) in orderData.orderGoodsList" :key="index">
        <li>
          <img :src="item.skuImage" @error="setErrorImg($event,100,100)" alt="">
          <div>
            <p class="name font-weight">
              <img v-if="item.purchaseType==1" class="order-lis-tag" src="../../assets/cart/image_bq_bs@2x.png" width="100%" />
              <img v-if="item.purchaseType==2" class="order-lis-tag" src="../../assets/cart/image_bq_zy@2x.png" width="100%" />
              <img v-if='item.goodsPromoObj&&item.goodsPromoObj.promoType==3' class="order-lis-tag" src="../../assets/cart/image_bq_ms@2x.png" width="100%" /> {{item.goodsName}}
            </p>
            <p class="sku">
              <span>{{item.skuName}}</span>
              <span>x{{item.skuCount}}</span>
            </p>
            <p class="price font-weight">￥{{item.goodsPrice}}</p>
          </div>
        </li>
      </ul>
      <div class="msg">
        <span class="font-weight">留言:</span>
        <textarea rows="1" maxlength="50" placeholder="请留下您想说的话" v-model="msg"></textarea>
      </div>
      <ul class="order-count-box">
        <li class="info">
          <span class="font-weight">商品金额</span>
          <span class="font-weight gray right">¥{{orderData.goodsPrice}}</span>
        </li>
        <li class="info" v-if="$route.query.isVirtual != 1" @click="goto_vouchers()">
          <span class="font-weight">优惠券</span>
          <p class="right">
            <span class="gray" v-if="!ticketId">无可用优惠券</span>
            <span class="gray" v-if="ticketId">已抵扣{{discountPrice}}元</span>
            <img class="order-header-more order-coin-more" src="../../assets/user_icon_go@2x.png" />
          </p>
        </li>
        <li v-if="!isola" class="info" @click="goto_coupons()">
          <span class="font-weight">购物币</span>
          <p class="right">
            <span class="gray" v-if="!couponsId">无可用购物币</span>
            <span class="gray" v-if="couponsId">已抵扣{{discountPriceCoupons}}元</span>
            <img class="order-header-more order-coin-more" src="../../assets/user_icon_go@2x.png" />
          </p>
        </li>
        <li class="info" v-if="$route.query.isVirtual != 1">
          <span class="font-weight">运费</span>
          <span class="font-weight gray right">{{orderData.transportPrice}}</span>
        </li>
        <li class="info">
          <span class="font-weight">总计</span>
          <span class="font-weight all right">￥{{totalPrice}}</span>
        </li>
      </ul>
    </div>
    <div class="order-footer vux-1px-t">
      <div class="order-footer-left font-weight">
        <span>共{{orderData.orderGoodsList.length}}件</span>
      </div>
      <div class="order-footer-middle">
        <span class="font-weight">总计：</span>
        <span class="order-footer-price font-weight">¥ {{totalPrice}}</span>
      </div>
      <div class="order-footer-right" @click="orderSubmit()">去支付</div>
    </div>
    <!-- 直邮包税身份证验证 -->
    <div class="dialog" v-if="show_modal">
      <div class="bg-ground"></div>
      <div class="content">
        <img class="close" @click="show_modal = false" src="../../assets/user_icon_box_down.png" alt="">
        <p class="desc">您所购买的商品中包含直邮或保税商品因涉及入境清关，根据海关规定，需您填写正确收货人身份证信息</p>
        <input class="input" type="text" v-model="idcard" placeholder="请填写身份证">
        <div class="btn" @click="saveIDcard()">保存</div>
      </div>
    </div>
    <!-- 过期商品展示 -->
    <div v-transfer-dom>
      <popup v-model="haveInvalidGoods" position="bottom" max-height="100%" class="pop-dialog">
        <p class="desc">以下商品暂时缺货哦，请重新提交订单</p>
        <ul class="invalidList">
          <li class="invalidGood" v-for="(item,index) in InvalidList" :key="index">
            <img :src="item.skuImage" alt="">
            <p class="goodtitle">{{item.goodsName}}</p>
            <div class="right">
              <p class="price">￥{{item.goodsPrice}}</p>
              <p class="num">x{{item.skuCount}}</p>
            </div>
          </li>
        </ul>
        <div class="btnbottom">
          <button @click="haveInvalidGoods= false">确定</button>
        </div>
      </popup>
    </div>
  </div>
</template>

<script>
import { TransferDom, Popup } from 'vux'
import wxUtil from '@/wx/wx-util'
import { is_weixin } from '@/util/public-fun'

export default {
  name: 'order_sure',
  data() {
    return {
      //chenhy
      skuData: {}, //商品详情带过啦的数据
      cartIds: '', //购物车带过啦的数据
      address: '',
      orderData: {
        orderGoodsList: []
      },
      ticketInfo: '',
      couponsInfo: '',
      haveSpecialPurchase: false, //是否含有直邮和保税
      show_modal: false, //是否弹填写身份证弹窗
      idcard: '', //身份证号码
      msg: '',
      haveInvalidGoods: false, //是否含有失效商品
      InvalidList: [] //失效商品列表
    }
  },
  directives: {
    TransferDom
  },
  components: {
    Popup
  },
  created() {
    wxUtil.config()
    if (this.$route.query.from == 'detail') {
      this.skuData = {
        goodsId: this.$route.query.goodsId,
        goodsPromoId: this.$route.query.goodsPromoId,
        skuCode: this.$route.query.skuCode,
        skuCount: this.$route.query.skuCount,
        skuId: this.$route.query.skuId
      }
      this.orderConfirm() //确认直购订单 从商详下单
    } else {
      this.cartIds = this.$route.query.cartIds
      this.cartOrderConfirm() //确认购物车订单 从购物车下单
    }
    this.msg = this.$route.query.msg
    this.getAddress()
  },
  computed: {
    discountPrice() {
      if (this.$route.query.discountPrice >= 0) {
        return this.$route.query.discountPrice
      } else if (this.ticketInfo.discountPrice) {
        return this.ticketInfo.discountPrice
      } else {
        return 0
      }
    },
    totalSkuPrice() {
      let price = (this.orderData.goodsPrice - this.discountPrice).toFixed(2)
      this.$http
        .post('order/get_a_best_coupon.do', {
          totalSkuPrice: price
        })
        .then(res => {
          this.couponsInfo = res.body || {}
        })
      return this.orderData.goodsPrice - this.discountPrice
    },
    discountPriceCoupons() {
      if (this.$route.query.discountPriceCoupons >= 0) {
        return this.$route.query.discountPriceCoupons
      } else if (this.couponsInfo.discountPrice) {
        return this.couponsInfo.discountPrice
      } else {
        return 0
      }
    },
    totalPrice() {
      if (this.orderData.payPrice == undefined) {
        return ''
      }
      // 虚拟商品
      if(this.$route.query.isVirtual == 1) {
        return this.orderData.goodsPrice
      }
      let price = (
        this.orderData.payPrice -
        this.discountPrice -
        this.discountPriceCoupons
      ).toFixed(2)
      if (price < 0) {
        price = 0.01
      }
      return price
    },
    ticketId() {
      if (this.$route.query.ticketId) {
        if (this.$route.query.ticketId == 'noticket') {
          return null
        }
        return this.$route.query.ticketId
      } else if (this.ticketInfo.userTicketId) {
        return this.ticketInfo.userTicketId
      } else {
        return null
      }
    },
    couponsId() {
      if (this.$route.query.couponsId) {
        if (this.$route.query.couponsId == 'nocoupons') {
          return null
        }
        return this.$route.query.couponsId
      } else if (this.couponsInfo.userCouponId) {
        return this.couponsInfo.userCouponId
      } else {
        return null
      }
    }
  },

  methods: {
    getAddress() {
      this.$http.get('uc/get_address_list.do').then(data => {
        var addressList = data.body.retList
        if (addressList) {
          if (this.$route.query.addressId) {
            for (var i = 0; i < addressList.length; i++) {
              if (this.$route.query.addressId == addressList[i].addressId) {
                this.address = addressList[i]
                return
              }
            }
          } else {
            this.address = addressList[0]
          }
        }
      })
    },
    orderConfirm() {
      let httpData = {
        params: this.skuData
      }
      this.$http.get('order/order_direct_confirm.do', httpData).then(res => {
        this.orderData = res.data.orderObj
        this.getMatchVouchers()
        this.checkPurchase()
      })
    },
    cartOrderConfirm() {
      let httpData = {
        params: {
          cartIds: this.cartIds
        }
      }
      this.$http.get('order/order_confirm.do', httpData).then(
        res => {
          this.orderData = res.data.orderObj
          this.getMatchVouchers()
          this.checkPurchase()
        },
        err => {
          this.$router.go(-1)
        }
      )
    },
    //检查是否有直邮或保税商品 和  获取失效列表
    checkPurchase() {
      for (var i = 0; i < this.orderData.orderGoodsList.length; i++) {
        if (this.orderData.orderGoodsList[i].isSalable == 0) {
          this.InvalidList.push(this.orderData.orderGoodsList[i])
        }
        if (this.orderData.orderGoodsList[i].purchaseType != 0) {
          this.haveSpecialPurchase = true
        }
      }
    },
    //确认订单界面，获取最佳匹配的优惠券
    getMatchVouchers() {
      let skuPriceList = []
      for (var i = 0; i < this.orderData.orderGoodsList.length; i++) {
        let skuTotalPrice = ''
        if (
          this.orderData.orderGoodsList[i].skuCount &&
          this.orderData.orderGoodsList[i].goodsPrice
        ) {
          skuTotalPrice =
            this.orderData.orderGoodsList[i].skuCount *
            this.orderData.orderGoodsList[i].goodsPrice
        }
        let orderGoodsObj = {
          brandId: this.orderData.orderGoodsList[i].brandId
            ? this.orderData.orderGoodsList[i].brandId.toString()
            : null,
          gcId: this.orderData.orderGoodsList[i].gcId
            ? this.orderData.orderGoodsList[i].gcId.toString()
            : null,
          goodsId: this.orderData.orderGoodsList[i].goodsId
            ? this.orderData.orderGoodsList[i].goodsId.toString()
            : null,
          skuId: this.orderData.orderGoodsList[i].skuId
            ? this.orderData.orderGoodsList[i].skuId.toString()
            : null,
          skuTotalPrice: skuTotalPrice.toString()
        }
        skuPriceList.push(orderGoodsObj)
      }
      let httpData = {
        skuPriceList: skuPriceList
      }
      this.$http.post('order/get_a_best_ticket.do', httpData).then(res => {
        this.ticketInfo = res.body.ticketInfo || {}
        let price = (this.orderData.goodsPrice - this.discountPrice).toFixed(2)
        if (!this.isola) {
          this.$http
            .post('order/get_a_best_coupon.do', {
              totalSkuPrice: price
            })
            .then(res => {
              this.couponsInfo = res.body || {}
            })
        }
      })
    },
    //提交订单
    orderSubmit() {
      if (this.$route.query.isVirtual != 1) {
        if (!this.address || !this.address.addressId) {
          this.showToast('请填写收货地址')
          return
        }
      }
      if (this.InvalidList.length > 0) {
        this.haveInvalidGoods = true
        return
      }
      if (this.totalPrice == '') {
        this.showToast('商品信息异常')
        return
      }
      if (!this.address.idcard && this.haveSpecialPurchase) {
        this.show_modal = true
        this.getAddress()
        return
      }
      if (this.$route.query.from == 'detail') {
        this.orderDirectDubmit()
      } else {
        this.orderCartDirectDubmit()
      }
    },
    //提交直购订单
    orderDirectDubmit() {
      let httpData = {
        addressId: this.address.addressId, //收货地址ID
        goodsId: this.skuData.goodsId, //商品ID
        recomentUserId: window.getCookie('parentId'), //分销用户ID
        skuCode: this.skuData.skuCode, //商品规格Code
        skuCount: this.skuData.skuCount, //商品SKU数量
        skuId: this.skuData.skuId //商品SKUID
      }
      //商品促销ID 是否必传：否
      if (this.skuData.goodsPromoId) {
        httpData.goodsPromoId = this.skuData.goodsPromoId
      }
      //优惠卷ID
      if (this.ticketId) {
        httpData.userTicketId = this.ticketId
      }
      //购物币ID
      if (this.couponsId) {
        httpData.userCouponId = this.couponsId
      }
      //用户留言 是否必传：否
      if (this.msg && this.msg != '') {
        httpData.userMsg = this.msg
      }
      this.$http.post('order/order_direct_submit.do', httpData).then(res => {
        if (is_weixin()) {
          this.wxPay(res.data.orderNo, res.data.payPrice)
        } else {
          this.aliPay(res.data.orderNo, res.data.payPrice)
        }
      })
    },
    //提交购物车订单
    orderCartDirectDubmit() {
      let _arr = this.cartIds.split(',')
      for (let i = 0; i < _arr.length; i++) {
        _arr[i] = parseInt(_arr[i])
      }
      let httpData = {
        addressId: this.address.addressId, //收货地址ID
        cartIdList: _arr, //商品ID
        recomentUserId: window.getCookie('parentId'), //分销用户ID
        userCouponId: this.couponsId //购物币ID
      }
      //优惠卷ID 是否必传：否
      if (this.ticketId) {
        httpData.userTicketId = this.ticketId
      }
      //用户留言 是否必传：否
      if (this.msg != '') {
        httpData.userMsg = this.msg
      }

      this.$http.post('order/order_submit.do', httpData).then(res => {
        if (is_weixin()) {
          this.wxPay(res.data.orderNo, res.data.payPrice)
        } else {
          this.aliPay(res.data.orderNo, res.data.payPrice)
        }
      })
    },
    //修改地址
    goto_addressedit() {
      this.$router.push({
        name: 'addressedit'
      })
    },
    //去收获地址页面
    goto_address() {
      var queryObj = this.$route.query
      queryObj.msg = this.msg
      this.$router.push({
        name: 'address',
        query: queryObj
      })
    },
    //跳转购物币
    goto_coupons() {
      let queryobj = this.$route.query
      queryobj.selectCouponsID = this.couponsId
      queryobj.totalSkuPrice = this.totalSkuPrice
      queryobj.msg = this.msg
      this.$router.push({
        name: 'Use_coupons',
        params: queryobj,
        query: queryobj
      })
    },
    //跳转优惠券
    goto_vouchers() {
      let queryobj = this.$route.query
      queryobj.selectTicketID = this.ticketId
      queryobj.transportPrice = this.orderData.transportPrice
      queryobj.msg = this.msg
      this.$router.push({
        name: 'use_vouchers',
        params: queryobj,
        query: queryobj
      })
    },

    //保存身份证号
    saveIDcard() {
      if (this.idcard == '') {
        this.showToast('请输入身份证号')
        return
      }

      this.$http
        .post('/uc/set_address_idcard.do', {
          addressId: this.address.addressId,
          idCard: this.idcard
        })
        .then(res => {
          this.showToast('保存成功')
          this.show_modal = false
          this.getAddress()
        })
    },

    //关闭弹窗
    close_popup() {
      this.popup_show = false
      //初始化
      this.popup_tips = 1
    },
    // 路由跳转
    route_link(base, params, other) {
      // 其他外部链接
      if (other) window.location = base
      else {
        // 内部路由
        this.$router.push({
          name: base,
          params: params,
          query: params
        })
      }
    }
  }
}
</script>
<style lang="less" scoped>
@import '../../styles/index.less';
.font-weight {
  font-weight: bold;
}

.order-content {
  width: 100%;
  height: 100%;
  font-size: 14px;
  color: #1b1b1b;
  background: #fff;
  padding-bottom: 50px;
  position: relative;
}

.order-lis-box {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  background: #fbfbfb;
  -webkit-overflow-scrolling: touch;
}

.order-header-more {
  width: 6px;
  height: 12px;
}

.order-header {
  padding: 30px 12px;
  background: #fff;
  font-size: 14px;
  color: #272728;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .order-header-address {
    color: #272728;
    padding-right: 20px;
    .address-detail {
      display: inline-block;
      word-break: break-all;
    }
  }
  .order-header-info {
    font-size: 14px;
    color: #272728;
    margin-bottom: 12px;
    .name {
      margin-right: 36px;
    }
  }
} //内有地址添加地址
.order-header-none {
  background: #fff;
  margin-top: 5px;
  padding: 20px 0;
  .order-header-none-more {
    width: 335px;
    height: 44px;
    margin: auto;
    background: url(../../assets/h5_icon_shouhuodizhi.png) no-repeat left top;
    background-size: cover;
  }
}

.goods-list {
  margin-top: 5px;
  background: #fff;
  li {
    display: flex;
    padding: 30px 12px;
    img {
      width: 100px;
      height: 100px;
    }
    > div {
      padding-left: 12px;
      flex: 1;
      .order-lis-tag {
        .px2rem(width, 72);
        .px2rem(height, 36);
        display: inline-block;
        vertical-align: text-bottom;
      }
      .name {
        font-size: 14px;
        color: #1b1b1b;
        line-height: 24px;
        margin-top: -4px;
      }
      .sku {
        font-size: 11px;
        color: #86898b;
        margin-top: 5px;
        display: flex;
        justify-content: space-between;
      }
      .price {
        font-size: 16px;
        color: #fc6655;
        margin-top: 24px;
      }
    }
  }
}

.msg {
  background: #fff;
  padding: 20px 12px;
  display: flex;
  align-items: center;
  textarea {
    font-size: 14px;
    color: #86898b;
    margin-left: 15px;
    width: 280px;
  }
}

.order-count-box {
  background: #fff;
  margin-top: 5px;
  font-size: 14px;
  .info {
    padding: 20px 12px;
    .gray {
      font-size: 14px;
      color: #86898b;
      margin-right: 8px;
    }
    .all {
      color: #fc6655;
    }
    > .right {
      float: right;
    }
  }
}

.order-footer {
  width: 100%;
  height: 50px;
  position: fixed;
  bottom: 0;
  background: #ffffff;
  color: #343c45;
  overflow: hidden;
  .order-footer-middle {
    height: 50px;
    line-height: 50px;
    font-size: 14px;
    margin-left: 15px;
    float: left;
    color: #272728;
    .order-footer-price {
      font-size: 16px;
      color: #fc6655;
    }
  }
  .order-footer-right {
    float: right;
    margin-right: 15px;
    margin-top: 8px;
    width: 102px;
    height: 34px;
    line-height: 34px;
    background: linear-gradient(196deg, #ff8996 0%, #fc6655 100%);
    border-radius: 51px;
    text-align: center;
    font-size: 13px;
    color: #fff;
  }
  .order-footer-left {
    margin-top: 7px;
    padding: 0 15px;
    float: left;
    height: 36px;
    line-height: 36px;
    font-size: 14px;
    color: #1b1b1b;
    border-right: 1px solid #f2f2f2;
  }
}

.dialog {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  z-index: 1000;
  .bg-ground {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
  }
  .content {
    width: 310px;
    height: 312px;
    background: #fff;
    position: relative;
    top: 50%;
    left: 50%;
    margin-left: -155px;
    margin-top: -156px;
    .close {
      width: 12px;
      height: 12px;
      padding: 12px 12px;
      position: absolute;
      right: 0;
      top: 0;
      z-index: 1002;
      box-sizing: content-box;
    }
    .desc {
      padding: 43px 22px 23px;
      font-size: 13px;
      color: #86898b;
      line-height: 19px;
    }
    .input {
      width: 271px;
      height: 42px;
      background: #fafafa;
      border: 1px solid #edefef;
      border-radius: 100px;
      font-size: 12px; // color: #CBCBCB;
      line-height: 14px;
      padding-left: 20px;
      box-sizing: border-box;
      margin-left: 20px;
    }
    .btn {
      margin: 29px auto;
      width: 134px;
      height: 38px;
      font-size: 16px;
      color: #ffffff;
      letter-spacing: 0;
      text-align: center;
      line-height: 38px;
      background: linear-gradient(-135deg, #ff8996 0%, #fc6655 100%);
      box-shadow: 0 2px 10px 0 rgba(255, 76, 138, 0.2);
      border-radius: 100px;
    }
  }
}

.pop-dialog {
  background: #fff;
  .desc {
    font-size: 14px;
    color: #86898b;
    line-height: 18px;
    text-align: center;
    margin-top: 30px;
  }
  .invalidList {
    padding: 0 12px;
    .invalidGood {
      overflow: hidden;
      margin-top: 31px;
      img {
        width: 65px;
        height: 65px;
        float: left;
      }
      .goodtitle {
        width: 169px;
        font-size: 14px;
        color: #1b1b1b;
        line-height: 18px;
        margin-left: 12px;
        font-weight: 600;
        float: left;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      .right {
        float: right;
        .price {
          font-size: 16px;
          color: #fc6655;
          letter-spacing: 0;
          line-height: 12px;
          margin-top: 5px;
          font-weight: 600;
        }
        .num {
          float: right;
          font-size: 12px;
          color: #86898b;
          letter-spacing: 0;
          line-height: 12px;
          margin-top: 5px;
        }
      }
    }
  }
  .btnbottom {
    margin: 26px 12px 10px;
    float: right;
    button {
      width: 134px;
      height: 38px;
      text-align: center;
      line-height: 38px;
      background: linear-gradient(-135deg, #ff8996 0%, #fc6655 100%);
      box-shadow: 0 2px 10px 0 rgba(255, 76, 138, 0.2);
      border-radius: 100px;
      font-size: 16px;
      color: #ffffff;
      letter-spacing: 0;
    }
  }
}
</style>
