<template>
  <div class="view">
    <div class="vouchers-box">
      <div class="vouchers-tab vux-1px-b">
        <div v-bind:class="[{ active: status0 }]" v-on:touchend="statusmethod('1')">可使用优惠券</div>
        <div v-bind:class="[{ active: status1 }]" v-on:touchend="statusmethod('0')">不可使用优惠券</div>
      </div>
      <div class="content-box">
        <div class="content-container" style="min-height: 14.52rem;" v-if="!empty">
          <div class="vouchers-content" id="can-use" v-if="!empty">
            <div class="vouchers-list" v-bind:class="{ 'vouchers-unused': status0,'vouchers-used': status1}" v-for="(item,index) in vouchers_list" :key="index" :data-change="data_change" @click="checkCoupon(index,item)">
              <div class="list-bottom">
                <div v-if="item.ticketTypeId==1" class="vouchers-detail">
                  <span class="fuhao" :class="{ 'used-fuhao': status1}">¥</span>
                  <span class="money" :class="{ 'used-money': status1}">{{item.faceValue}}</span>
                  <span class="text" :class="{ 'used-text': status1}">{{item.ticketName}}</span>
                </div>
                <div v-if="item.ticketTypeId==2" class="vouchers-detail">
                  <span class="discount" :class="{ 'used': status1}">{{item.discountValue}}</span>
                  <span class="zhe" :class="{ 'used': status1}">折</span>
                </div>
                <div v-if="item.ticketTypeId==3" class="vouchers-detail discount-detail">
                  <img src="../../assets/vouchers/user_icon_dingdan_mianyouquan_logo_2.png" v-if="status1" alt="">
                  <img src="../../assets/vouchers/user_icon_dingdan_mianyouquan_logo_1.png" v-else alt="">
                  <span class="text" :class="{ 'used-text': status1}">{{item.ticketName}}</span>
                </div>
                <div class="select-box" v-if="status0" :class="{ selected: item.check }"></div>
                <div class="user_money" v-if="item.ticketTypeId!=3" :class="{ 'used-condition': status1}">满{{item.useCondition}}可用</div>
                <div class="time">有效期：{{item.timeRangeStart | dateFormat('yyyy.MM.dd')}}-{{item.timeRangeEnd| dateFormat('yyyy.MM.dd')}}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="empty-box" v-if="empty">
          <img src="../../assets/empty/nocoupons.png">
          <div>说好的优惠券呢？</div>
        </div>
      </div>
      <div class="bottoms">
        <div class="sure" @click='sure()' v-if="!empty">确定</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      status0: true,
      status1: false,
      vouchers_list: [],
      data_change: true,
      vouchers_value: '',
      empty: true,
      cartIds: '', //购物车带过来的数据
      orderData: {
        orderGoodsList: []
      },
      discountPrice: 0, //选中优惠券抵扣值
      ticketId: '',
      transportPrice: ''
    }
  },
  created() {
    this.weixin_init()
    this.cartIds = this.$route.query.cartIds
    this.transportPrice = this.$route.query.transportPrice
    this.$vux.loading.show({
      text: '加载中...'
    })
    this.getOrder()
  },
  methods: {
    //订单
    getOrder() {
      if (this.$route.query.from == 'detail') {
        this.orderConfirm() //确认直购订单
      } else {
        this.orderCartConfirm() //确认购物车订单
      }
    },
    //确认直购订单
    orderConfirm() {
      let httpData = {
        params: {
          goodsId: this.$route.query.goodsId,
          goodsPromoId: this.$route.query.goodsPromoIds,
          skuCode: this.$route.query.skuCode,
          skuCount: this.$route.query.skuCount,
          skuId: this.$route.query.skuId
        }
      }
      this.$http.get('order/order_direct_confirm.do', httpData).then(res => {
        this.orderData = res.data.orderObj
        this.coupons_list('1')
      })
    },
    //确认购物车订单
    orderCartConfirm() {
      let httpData = {
        params: {
          cartIds: this.cartIds
        }
      }
      this.$http.get('order/order_confirm.do', httpData).then(res => {
        this.orderData = res.data.orderObj
        this.coupons_list('1')
      })
    },
    //优惠券列表
    coupons_list: function(type) {
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
        skuPriceList: skuPriceList,
        type: type
      }
      this.$http
        .post('order/tickets_from_order_confirm.do', httpData)
        .then(res => {
          let tickets = res.body.tickets
          this.$vux.loading.hide()
          if (tickets && tickets.length > 0) {
            this.empty = false
            let flag = true
            tickets.forEach((ele, index) => {
              ele.check = false
              if (
                ele.userTicketId == this.$route.query.selectTicketID &&
                flag
              ) {
                ele.check = true
                if (ele.ticketTypeId == 3) {
                  if (ele.discountPrice == -1) {
                    this.discountPrice = this.transportPrice
                  } else {
                    if (ele.discountPrice >= ele.transportPrice) {
                      this.discountPrice = this.transportPrice
                    } else {
                      this.discountPrice = ele.discountPrice
                    }
                  }
                } else {
                  this.discountPrice = ele.discountPrice
                }
                this.ticketId = ele.userTicketId
                flag = false
              }
            })
            this.vouchers_list = tickets
          } else {
            this.empty = true
          }
        })
    },
    sure: function() {
      let queryobj = this.$route.query
      queryobj.discountPrice = this.discountPrice
      queryobj.ticketId = this.ticketId
      this.$router.replace({
        name: 'order_sure',
        query: queryobj
      })
    },
    //tab切换选择不同类型的购物币 新追加type字段,0未使用,1已使用,-1已过期
    statusmethod: function(type) {
      switch (type) {
        case '1':
          this.status0 = true
          this.status1 = false
          this.vouchers_list = []
          this.coupons_list('1')
          break
        case '0':
          this.status0 = false
          this.status1 = true
          this.vouchers_list = []
          this.coupons_list('0')
          break
      }
    },
    //优惠券选择效果
    checkCoupon: function(index) {
      if (this.status1) return
      if (this.vouchers_list[index].check) {
        for (var i = 0; i < this.vouchers_list.length; i++) {
          this.vouchers_list[i].check = false
        }
        this.ticketId = 'noticket'
        this.discountPrice = 0
      } else {
        for (var i = 0; i < this.vouchers_list.length; i++) {
          if (i == index) {
            this.vouchers_list[i].check = true
          } else {
            this.vouchers_list[i].check = false
          }
        }
        if (this.vouchers_list[index].ticketTypeId == 3) {
          if (this.vouchers_list[index].discountPrice == -1) {
            this.discountPrice = this.transportPrice
          } else {
            if (
              this.vouchers_list[index].discountPrice >= this.transportPrice
            ) {
              this.discountPrice = this.transportPrice
            } else {
              this.discountPrice = this.vouchers_list[index].discountPrice
            }
          }
        } else {
          this.discountPrice = this.vouchers_list[index].discountPrice
        }
        this.ticketId = this.vouchers_list[index].userTicketId
      }
    }
  }
}
</script>

<!-- 底部菜单组件css样式 -->
<style lang="less">
@import '../../styles/index.less';
#view {
  background: #fff;
  bottom: 0;
}

.vouchers-box {
  width: 100%;
  height: 100%;
  background: #fafafa;
  display: flex;
  flex-direction: column;
}

.acts {
  position: relative;
} //底部无更过商品样式
.no-more-goods {
  width: 100%;
  .pxrem(height,
    60);
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f8f9;
  > img {
    .pxrem(width,
      47);
    .pxrem(height,
      48);
  }
  .text {
    .pxrem(font-size,
      14);
    color: #cecece;
  }
}
.acts:before {
  display: block;
  content: '';
  .pxrem(width, 26);
  .pxrem(height, 26);
  background: url('../../assets/vouchers/h5_icon_select.png') no-repeat;
  background-size: contain;
  position: absolute;
  top: 0;
  right: 0;
}
.vouchers-tab {
  width: 100%;
  .pxrem(height,
    53);
  display: flex;
  justify-content: space-around;
  align-items: center;
  background: #fff;
  > div {
    font-size: 15px;
    color: #86898b;
  }
  .active {
    color: #1b1b1b;
  }
}
.content-box {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-y: auto;
  .content-container {
    flex: 1;
    background: #fafafa;
  }
  .empty-box {
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;
    background: #fff;
    /*justify-content:center;*/
    > img {
      margin-top: 170px;
      display: block;
      width: 216px;
      height: 144px;
    }
    > div {
      text-align: center;
      font-size: 14px;
      color: #86898b;
      line-height: 14px;
      margin-top: 60px;
    }
  }
}
.vouchers-content {
  width: 100%;
  .vouchers-list {
    width: 351px;
    height: 130px;
    margin: 10px auto 0;
    .list-bottom {
      width: 100%;
      height: 100%;
      padding-left: 12px;
      padding-top: 12px;
      box-sizing: border-box;
      position: relative;
      .select-box {
        width: 16px;
        height: 16px;
        position: absolute;
        right: 100px;
        top: 50%;
        margin-top: -8px;
        background: url('../../assets/useVouchers/btn_sle_black@2x.png')
          no-repeat;
        background-size: 15px 15px;
      }
      .selected {
        background: url('../../assets/useVouchers/btn_sle_black_pre@2x.png')
          no-repeat;
        background-size: 15px 15px;
      }
      .vouchers-logo {
        display: block;
        width: 52px;
        height: 11px;
      }
      .vouchers-detail {
        margin-top: 10px;
        width: 220px;
        > img {
          width: 54px;
          height: 28px;
        }
      }
      .vouchers-detail.discount-detail {
        margin-top: 20px;
      }
      .discount {
        font-family: 'DINCondensed';
        font-weight: 600;
        font-size: 44px;
        color: #fc6655;
        line-height: 50px;
        zoom: 0.5;
      }
      .zhe {
        font-size: 13px;
        color: #fc6655;
        line-height: 20px;
        margin-left: -10px;
        font-weight: 600;
      }
      .discount.used {
        color: #cbcbcb;
      }
      .zhe.used {
        color: #cbcbcb;
      }
      .money {
        font-size: 44px;
        color: #fc6655;
        font-weight: bold;
        margin-left: -4px;
        zoom: 0.5;
      }
      .fuhao {
        font-size: 24px;
        color: #fc6655;
        font-weight: bold;
        zoom: 0.5;
      }
      .text {
        font-size: 15px;
        color: #1b1b1b;
        font-weight: bold;
        display: inline-block;
        height: 18px;
        width: 130px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .user_money {
        font-size: 12px;
        color: #1b1b1b;
        margin-bottom: 8px;
        font-weight: bold;
      }
      .time {
        font-size: 12px;
        color: #cbcbcb;
      }
      .used-fuhao,
      .used-money,
      .used-text,
      .used-condition {
        color: #cbcbcb;
      }
      .used-condition {
        font-weight: 100;
      }
    }
  }
  .vouchers-unused {
    background: url('../../assets/useVouchers/user_icon_dingdan_youhuiqan_1.png')
      no-repeat left center;
    background-size: cover;
  }
  .vouchers-used {
    background: url('../../assets/useVouchers/user_icon_dingdan_youhuiqan_2.png')
      no-repeat left center;
    background-size: cover;
  }
  .vouchers-list:last-child {
    .pxrem(margin-bottom,
      10);
  }
}
.down {
  background: url('../../assets/vouchers/h5_icon_down.png') no-repeat left
    center;
  background-size: cover;
}
.up {
  background: url('../../assets/vouchers/h5_icon_up.png') no-repeat left center;
  background-size: cover;
}
.change_high {
  height: auto !important;
}
//可使用
#can-use {
  width: 100%;
  .list-top-right {
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #ff6532;
    line-height: 18px;
  }
}
//已过期,已使用
#used {
  .list-bottom-left {
    color: #cecece;
  }
  .list-bottom {
    .text {
      color: #cecece;
    }
    .time {
      color: #cecece;
    }
  }
}
.vouchers-box .mint-cell-swipe-button {
  padding: 0;
  text-align: center;
  -wk-box-align: center;
  -webkit-box-pack: center;
  -webkit-box-align: center;
  display: -webkit-box;
  font-size: 14px;
  color: #ffffff;
  background: #f13736;
  .px2rem(height,
    184);
}
.vouchers-box .coupon {
  .px2rem(width,
    720);
  .px2rem(height,
    183);
  margin: 0 auto;
  .px2rem(margin-top,
    20);
  background: #ffffff;
  box-shadow: 0px 1px 1px 0px rgba(39, 40, 42, 0.11);
  border-radius: 6px;
  position: relative;
}
.vouchers-box .price {
  .px2rem(width,
    153);
  .px2rem(height,
    183);
  background: rgba(245, 248, 251, 0.2);
  float: left;
  display: -webkit-box;
  -webkit-box-pack: center;
  -webkit-box-align: center;
  border-right: 1px dashed #c1c1c1;
  position: relative;
}
.vouchers-box .price:before,
.vouchers-box .price:after,
.vouchers-box .detail:before,
.vouchers-box .detail:after {
  display: block;
  content: '';
  .px2rem(width,
    18);
  .px2rem(height,
    18);
  border-radius: 50%;
  background: #f5f8fb;
  position: absolute;
  z-index: 9;
}
.vouchers-box .price:before,
.vouchers-box .detail:before {
  .px2rem(top,
    -9);
  .px2rem(right,
    -9);
}
.vouchers-box .price:after,
.vouchers-box .detail:after {
  .px2rem(bottom,
    -9);
  .px2rem(right,
    -9);
}
.vouchers-box .detail {
  .px2rem(width,
    466);
  .px2rem(height,
    183);
  .px2rem(padding-left,
    15);
  background: #fff;
  float: left;
  border-right: 1px dashed #c1c1c1;
  position: relative;
}

.vouchers-box .status {
  .px2rem(width,
    20);
  .px2rem(height,
    100);
  .px2rem(padding-top,
    42);
  .px2rem(padding-bottom,
    41);
  .px2rem(padding-left,
    20);
  .px2rem(padding-right,
    19);
  background: #fff;
  font-size: 12px;
  color: #66676a;
  display: -webkit-box;
  -webkit-box-pack: center;
  -webkit-box-align: center;
  line-height: 150%;
  text-align: center;
  border-bottom-right-radius: 6px;
  border-bottom-right-radius: 6px;
}
.vouchers-box .acts .status:before {
  display: block;
  content: '';
  .px2rem(width,
    54);
  .px2rem(height,
    47);
  background: url('../../assets/h5_youhuiquan_xuanzhong_icon.png') no-repeat;
  background-size: contain;
  position: absolute;
  top: 0;
  .px2rem(right,
    -10);
}
.vouchers-box .price-icon {
  color: #f85b27;
  .px2rem(width,
    22);
  .px2rem(height,
    49);
  .px2rem(line-height,
    49);
  font-size: 17px;
  position: absolute;
  .px2rem(left,
    20);
  .px2rem(bottom,
    55);
}
.vouchers-box .price-value {
  .px2rem(width,
    82);
  .px2rem(height,
    95);
  .px2rem(line-height,
    95);
  color: #f85b27;
  font-size: 34px;
  position: absolute;
  .px2rem(right,
    22);
  .px2rem(bottom,
    44);
}
.vouchers-box .isexpired .price-icon,
.vouchers-box .isexpired .price-value,
.vouchers-box .isexpired .coin,
.vouchers-box .isexpired .tips,
.vouchers-box .isexpired .expired,
.vouchers-box .isexpired .expired-time {
  color: #c7cbcd;
}
.vouchers-box .price-detail {
  font-size: 34px;
  color: #c7cbcd;
}
.vouchers-box .coin-wrap {
  overflow: hidden;
  clear: both;
  .px2rem(margin-top,
    23);
  .px2rem(margin-bottom,
    17);
}
.vouchers-box .coin {
  font-size: 16px;
  color: #343c45;
  float: left;
}
.vouchers-box .tips {
  font-size: 14px;
  color: #f85b27;
  float: right;
  .px2rem(margin-right,
    37);
}
.vouchers-box .expired {
  font-size: 12px;
  color: #919292;
  .px2rem(height,
    33);
  .px2rem(line-height,
    33);
}
.vouchers-box .expired-time {
  font-size: 12px;
  color: #66676a;
  .px2rem(height,
    37);
  .px2rem(line-height,
    37);
}
.vouchers-box .go-now {
  border-radius: 30px;
  font-size: 16px;
  .pxrem(width,
    241);
  .pxrem(height,
    46);
  .pxrem(line-height,
    46);
  text-align: center;
  position: absolute;
  .pxrem(bottom,
    38);
  .pxrem(left,
    34);
}
.vouchers-box .img-tips {
  .pxrem(width,
    45);
  .pxrem(height,
    45);
  border-radius: 100%;
  margin: 0 auto;
  display: block;
}

.vouchers-box .result-tips {
  width: 100%;
  text-align: center;
  .pxrem(margin-top,
    8);
  font-size: 16px;
  color: #35353a;
  span {
    color: #272728;
  }
}
.vouchers-box .result-desc {
  margin: auto;
  .pxrem(margin-top,
    117);
  .pxrem(width,
    182);
  text-align: center;
  .coupons_money {
    font-size: 60px;
    span {
      font-size: 30px;
    }
  }
  .coupons_font {
    font-size: 14px;
    color: #272728;
    .pxrem(margin-top,
      18);
  }
}
.vouchers-box .mint-cell-wrapper {
  padding: 0;
}
.vouchers-box .mint-cell-title {
  -webkit-box-flex: 0;
  flex: 0;
}
.mint-loadmore {
  overflow-y: scroll;
}
.bottoms {
  background: #fff;
  width: 100%;
  .pxrem(height,
    49);
  .sure {
    background: #ff6532;
    border-radius: 51px;
    .pxrem(height,
      34);
    .pxrem(line-height,
      34);
    .pxrem(width,
      140);
    font-size: 13px;
    color: #ffffff;
    text-align: center;
    margin: auto;
    .pxrem(margin-top,
      8);
  }
}
</style>
