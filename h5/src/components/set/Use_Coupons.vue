<template>
  <div class="view">
    <div class="coupons-box">
      <div class="content-box">
        <div class="content-container" style="min-height: 14.52rem;" v-if="!empty">
          <div class="coupons-content" id="can-use" v-if="!empty">
            <div class="coupons-list" v-for="(item,index) in coupons_list" :key="index" @click="checkCoupon(index,item)" :data-change="data_change">
              <div class="list-bottom">
                <div class="item-top">
                  <div class="select-box" :class="{ selected: item.check }"></div>
                  <img src="../../assets/vouchers/user_icon_youhuiquan_logo.png" class="coupons-logo" />
                  <div class="coupons-detail">
                    <span class="fuhao">¥</span>
                    <span class="money">{{item.faceValue}}</span>
                    <span class="text">{{item.couponName}}</span>
                  </div>
                </div>
                <div class="item-bottom">
                  <div class="time">有效期：{{item.timeRangeStart | dateFormat('yyyy年MM月dd日')}}-{{item.timeRangeEnd| dateFormat('yyyy年MM月dd日')}}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="empty-box" v-if="empty">
          <img src="../../assets/empty/nocoupons.png">
          <div>说好的购物币呢？</div>
        </div>
      </div>
      <div class="bottoms" v-if="!empty">
        <div class="sure" @click='sure()'>确定</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      coupons_list: [],
      data_change: true,
      coupons_value: '',
      empty: true,
      discountPriceCoupons: 0, //选中购物币抵扣值
      couponsId: '',
      msg: '', //传来的用户留言
      totalSkuPrice: ''
    }
  },
  created() {
    this.setTitle('使用优惠券')
    this.weixin_init()
    this.totalSkuPrice = this.$route.query.totalSkuPrice + ''

    this.getcoupons_list()
  },

  methods: {
    //购物币列表
    getcoupons_list(type) {
      this.$vux.loading.show({
        text: '加载中...'
      })
      this.$http
        .post('order/coupons_from_order_confirm.do', {
          totalSkuPrice: this.totalSkuPrice
        })
        .then(res => {
          let coupons = res.body.coupons
          this.$vux.loading.hide()
          if (coupons && coupons.length > 0) {
            this.empty = false
            let flag = true
            coupons.forEach((ele, index) => {
              ele.check = false
              if (
                ele.userCouponId == this.$route.query.selectCouponsID &&
                flag
              ) {
                ele.check = true
                this.discountPriceCoupons = ele.discountPrice
                this.couponsId = ele.userCouponId
                flag = false
              }
            })
            this.coupons_list = coupons
          } else {
            this.empty = true
          }
        })
    },
    sure() {
      let queryobj = this.$route.query
      queryobj.discountPriceCoupons = this.discountPriceCoupons
      queryobj.couponsId = this.couponsId
      this.$router.replace({
        name: 'order_sure',
        query: queryobj
      })
    },
    //优惠券选择效果
    checkCoupon(index) {
      if (this.coupons_list[index].check) {
        for (var i = 0; i < this.coupons_list.length; i++) {
          this.coupons_list[i].check = false
        }
        this.couponsId = 'nocoupons'
        this.discountPriceCoupons = 0
      } else {
        for (var i = 0; i < this.coupons_list.length; i++) {
          if (i == index) {
            this.coupons_list[i].check = true
          } else {
            this.coupons_list[i].check = false
          }
        }
        this.discountPriceCoupons = this.coupons_list[index].discountPrice
        this.couponsId = this.coupons_list[index].userCouponId
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../styles/index.less';
#view {
  background: #fff;
  bottom: 0;
}

.coupons-box {
  width: 100%;
  height: 100%;
  background: #f5f8f9;
  display: flex;
  flex-direction: column;
}

.acts {
  position: relative;
}

//底部无更过商品样式
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
.coupons-tab {
  width: 100%;
  .pxrem(height,53);
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
    background: #f5f8f9;
    overflow-y: auto;
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
.coupons-content {
  width: 100%;
  .coupons-list {
    .pxrem(width,351);
    margin: 10px auto 0;
    .list-bottom {
      width: 100%;
      height: 100%;
      .item-top {
        padding: 12px 0 0 12px;
        height: 115px;
        background: url('../../assets/coupons/user_icon_gouwubi_bg_shang_3.png')
          no-repeat left center;
        background-size: cover;
        box-sizing: border-box;
        position: relative;
      }
      .item-bottom {
        padding: 16px;
        height: 45px;
        box-sizing: border-box;
        background: url('../../assets/coupons/user_icon_gouwubi_bg_xia_1.png')
          no-repeat left center;
        background-size: cover;
      }
      .item-bottom.used {
        padding: 14px 16px 20px 16px;
        height: 91px;
        background: url('../../assets/coupons/user_icon_gouwubi_bg_xia_3.png')
          no-repeat left center;
        background-size: cover;
      }
      .select-box {
        width: 16px;
        height: 16px;
        position: absolute;
        right: 12px;
        top: 50%;
        margin-top: -8px;
        background: url('../../assets/useVouchers/btn_sle_black@2x.png')
          no-repeat;
        background-size: cover;
      }
      .selected {
        background: url('../../assets/useVouchers/btn_sle_black_pre@2x.png')
          no-repeat;
        background-size: cover;
      }
      .coupons-logo {
        display: block;
        width: 52px;
        height: 11px;
      }
      .coupons-detail {
        margin-top: 10px;
      }
      .money {
        font-size: 44px;
        color: #fc6655;
        font-weight: bold;
        margin-left: -7px;
      }
      .fuhao {
        font-size: 24px;
        color: #fc6655;
        font-weight: bold;
      }
      .text {
        font-size: 15px;
        color: #1b1b1b;
        font-weight: bold;
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
  .coupons-unused {
    background: url('../../assets/useVouchers/user_icon_dingdan_youhuiqan_1.png')
      no-repeat left center;
    background-size: cover;
  }
  .coupons-used {
    background: url('../../assets/useVouchers/user_icon_dingdan_youhuiqan_2.png')
      no-repeat left center;
    background-size: cover;
  }
  .coupons-list:last-child {
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
.coupons-box .coupon {
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
.coupons-box .price {
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
.coupons-box .price:before,
.coupons-box .price:after,
.coupons-box .detail:before,
.coupons-box .detail:after {
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
.coupons-box .price:before,
.coupons-box .detail:before {
  .px2rem(top,
    -9);
  .px2rem(right,
    -9);
}
.coupons-box .price:after,
.coupons-box .detail:after {
  .px2rem(bottom,
    -9);
  .px2rem(right,
    -9);
}
.coupons-box .detail {
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
.coupons-box .status {
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
.coupons-box .acts .status:before {
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
.coupons-box .price-icon {
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
.coupons-box .price-value {
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
.coupons-box .isexpired .price-icon,
.coupons-box .isexpired .price-value,
.coupons-box .isexpired .coin,
.coupons-box .isexpired .tips,
.coupons-box .isexpired .expired,
.coupons-box .isexpired .expired-time {
  color: #c7cbcd;
}
.coupons-box .price-detail {
  font-size: 34px;
  color: #c7cbcd;
}
.coupons-box .coin-wrap {
  overflow: hidden;
  clear: both;
  .px2rem(margin-top,
    23);
  .px2rem(margin-bottom,
    17);
}
.coupons-box .coin {
  font-size: 16px;
  color: #343c45;
  float: left;
}
.coupons-box .tips {
  font-size: 14px;
  color: #f85b27;
  float: right;
  .px2rem(margin-right,
    37);
}
.coupons-box .expired {
  font-size: 12px;
  color: #919292;
  .px2rem(height,
    33);
  .px2rem(line-height,
    33);
}
.coupons-box .expired-time {
  font-size: 12px;
  color: #66676a;
  .px2rem(height,
    37);
  .px2rem(line-height,
    37);
}

.coupons-box .go-now {
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
.coupons-box .img-tips {
  .pxrem(width,
    45);
  .pxrem(height,
    45);
  border-radius: 100%;
  margin: 0 auto;
  display: block;
}

.coupons-box .result-tips {
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
.coupons-box .result-desc {
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
.coupons-box .mint-cell-wrapper {
  padding: 0;
}
.coupons-box .mint-cell-title {
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
