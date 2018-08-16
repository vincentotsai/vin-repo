<template>
  <div class="view">
    <div class="coupons-box">
      <div class="coupons-tab">
        <div v-bind:class="[{ active: status0 }]" v-on:touchend="statusmethod('0')">未使用
          <div class="icon" v-if="status0"></div>
        </div>
        <div v-bind:class="[{ active: status1 }]" v-on:touchend="statusmethod('1')">已使用
          <div class="icon" v-if="status1"></div>
        </div>
        <div v-bind:class="[{ active: status2 }]" v-on:touchend="statusmethod('2')">已过期
          <div class="icon" v-if="status2"></div>
        </div>

      </div>
      <div class="content-box">
        <div class="empty-box" v-if="empty">
          <img src="../../assets/empty/nocoupons.png">
          <div>说好的购物币呢？</div>
        </div>
        <scroller v-else @on-scroll-bottom="load_more" :nomore="cant_load_more">
          <div class="content-container">
            <div class="coupons-content" id="can-use">
              <div class="coupons-list" v-for="(item,index) in coupons_list" :key="index" :data-change="data_change">
                <div class="list-bottom">
                  <div class="item-top">
                    <div class="clearfix">
                      <img src="../../assets/vouchers/user_icon_youhuiquan_logo.png" v-if="status0" class="coupons-logo" />
                      <img src="../../assets/vouchers/user_icon_youhuiquan_logo_2.png" v-if="status1 || status2" class="coupons-logo" />
                      <span v-if="status0" class="statustest red">未使用</span>
                      <span v-if="status1" class="statustest">已使用</span>
                      <span v-if="status2" class="statustest">已过期</span>
                    </div>
                    <div class="coupons-detail">
                      <span class="fuhao" :class="{ 'used-fuhao': status2}">¥</span>
                      <span class="money" :class="{ 'used-money': status2}">{{item.faceValue}}</span>
                      <span class="text" :class="{ 'used-text': status2}">{{item.couponName}}</span>
                    </div>
                  </div>
                  <div class="item-bottom">
                    <div class="time">有效期：{{item.timeRangeStart | dateFormat('yyyy年MM月dd日')}}-{{item.timeRangeEnd| dateFormat('yyyy年MM月dd日')}}</div>
                    <!-- <div class="desc" v-if="status1 && item.useTime" >* 购物币已于 {{item.useTime | dateFormat('yyyy-MM-dd HH:mm:ss')}} 使用</div> -->
                  </div>
                </div>
              </div>
            </div>
          </div>
        </scroller>
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
      status2: false,
      coupons_list: [],
      data_change: true,
      page_id: 0,
      empty: true,
      cant_load_more: false,
      pageNum: 1,
      isMore: 1,
      pageSize: 15,
      httpflag: true
    }
  },
  created() {
    this.weixin_init()
    this.getcoupons_list('0')
  },
  methods: {
    change_height(item) {
      if (item.check) {
        item.check = false
      } else {
        item.check = true
      }
      this.data_change = !this.data_change
    },
    getcoupons_list(type, pageNum) {
      this.httpflag = false
      this.$http
        .get('order/coupons_list.do', {
          params: {
            pageNum: pageNum || 1,
            pageSize: this.pageSize,
            type: type
          }
        })
        .then(res => {
          let data = res.body
          this.httpflag = true
          if (data.coupons.length) {
            this.empty = false
            this.coupons_list.push(...data.coupons)
            this.isMore = data.isMore
            this.pageNum++
            if (data.isMore) {
              this.cant_load_more = false
            } else {
              this.cant_load_more = true
            }
          } else if (data.coupons.length == 0) {
            this.coupons_list = []
            this.empty = true
          }
        })
    },
    //tab切换选择不同类型的购物币 新追加type字段,0未使用,1已使用,2已过期
    statusmethod(type) {
      this.pageNum = 1
      this.coupons_list = []
      switch (type) {
        case '0':
          this.status0 = true
          this.status1 = false
          this.status2 = false
          this.getcoupons_list('0')
          break
        case '1':
          this.status0 = false
          this.status1 = true
          this.status2 = false
          this.getcoupons_list('1')
          break
        case '2':
          this.status0 = false
          this.status1 = false
          this.status2 = true
          this.getcoupons_list('2')
          break
      }
    },
    // 上拉加载更多
    load_more() {
      if (this.httpflag) {
        if (this.status0) {
          this.getcoupons_list('0', this.pageNum)
        } else if (this.status1) {
          this.getcoupons_list('1', this.pageNum)
        } else if (this.status2) {
          this.getcoupons_list('2', this.pageNum)
        }
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

.coupons-box {
  width: 100%;
  height: 100%;
  background: #f5f8f9;
  /*overflow: hidden;*/
}

.act {
  position: relative;
}

.act:before {
  display: block;
  content: '';
  .px2rem(width, 54);
  .px2rem(height, 47);
  background: url('../../assets/h5_youhuiquan_xuanzhong_icon.png') no-repeat;
  background-size: contain;
  position: absolute;
  top: 0;
  .pxrem(right,
    12);
}
.coupons-tab {
  width: 100%;
  height: 8%;
  background: #fff;
  border: 1px solid #f2f2f2;
  > div {
    width: 33.3%;
    float: left;
    text-align: center;
    font-size: 15px;
    height: 100%;
    line-height: 53px;
    color: #86898b;
    position: relative;
    .icon {
      width: 14px;
      height: 4px;
      position: absolute;
      bottom: 0;
      left: 50%;
      margin-left: -7px;
      background: linear-gradient(-217deg, #ff8996 0%, #ff6a9d 100%);
      border-radius: 15px;
    }
  }
  .active {
    color: #1b1b1b;
    font-weight: 600;
  }
}
.no-coupon {
  .pxrem(width,339);
  .pxrem(height,45);
  .pxrem(line-height,45);
  .pxrem(margin,10,12,10,12);
  .pxrem(padding-left,12);
  font-size: 14px;
  color: #272728;
  background: #ffffff;
}
.content-box {
  height: 92%;
  width: 100%;
  .content-container {
    background: #f5f8f9;
  }
  .empty-box {
    background: #fff;
    height: 100%;
    overflow: hidden;
    /*justify-content:center;*/
    > img {
      margin-top: 170px;
      display: block;
      width: 216px;
      height: 144px;
      margin: 100px auto;
    }
    > div {
      text-align: center;
      font-size: 14px;
      color: #cecece;
      margin-top: 61px;
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
        padding: 12px 12px 0 12px;
        height: 115px;
        background: url('../../assets/coupons/user_icon_gouwubi_bg_shang_3.png')
          no-repeat left center;
        background-size: cover;
        box-sizing: border-box;
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
      .coupons-logo {
        display: block;
        width: 52px;
        height: 11px;
        float: left;
      }
      .statustest {
        float: right;
        font-size: 12px;
        color: #cbcbcb;
      }
      .statustest.red {
        color: #fc6655;
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
        margin-bottom: 15px;
        font-weight: bold;
      }
      .time {
        font-size: 12px;
        color: #cbcbcb;
        margin-bottom: 8px;
      }
      .user_plice {
        float: left;
        width: 200px;
        font-size: 10px;
        color: #cbcbcb;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
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
}
.change_high {
  height: auto !important;
  text-overflow: initial !important;
  overflow: auto !important;
  white-space: normal !important;
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
#overdue,
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
.coupons_view {
  position: relative;
}
.coupons-box .mint-cell-swipe-button {
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
.coupons-box .act .status:before {
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
//底部无更多优惠券样式
.no-more-goods {
  width: 100%;
  height: 60px;
  vertical-align: middle;
  background: #f5f8f9;
  text-align: center;
  > img {
    width: 47px;
    height: 48px;
    vertical-align: middle;
  }
  .text {
    font-size: 14px;
    color: #cecece;
    vertical-align: middle;
  }
}
</style>
