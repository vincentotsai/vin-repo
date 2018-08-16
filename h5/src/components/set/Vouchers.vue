<template>
  <div class="view">
    <div class="vouchers-box">
      <div class="vouchers-tab vux-1px-b">
        <div :class="[{ active: status0 }]" @touchend="statusmethod('0')">未使用
          <div class="icon" v-if="status0"></div>
        </div>
        <div :class="[{ active: status1 }]" @touchend="statusmethod('1')">已使用
          <div class="icon" v-if="status1"></div>
        </div>
        <div :class="[{ active: status2 }]" @touchend="statusmethod('2')">已过期
          <div class="icon" v-if="status2"></div>
        </div>
      </div>
      <div class="content-box">
        <div class="empty-box" v-if="empty">
          <img src="../../assets/empty/nocoupons.png">
          <div>说好的优惠券呢？</div>
        </div>
        <scroller v-else @on-scroll-bottom="load_more" :nomore="cant_load_more">
          <div class="content-container" style="min-height: 14.52rem;" v-if="!empty">
            <div class="vouchers-content" id="can-use" v-if="!empty">
              <div class="vouchers-list" v-bind:class="{ 'vouchers-unused': status0 && !item.check,'vouchers-unused-high': status0 && item.check,
                          'vouchers-used': (status1 || status2) && !item.check,'vouchers-used-high': (status1 || status2) && item.check}" v-for="(item,index) in vouchers_list" :key="index" :data-change="data_change">
                <div class="list-bottom">
                  <!-- <img src="../../assets/vouchers/user_icon_youhuiquan_logo.png" v-if="status0" class="vouchers-logo"/>
                                  <img src="../../assets/vouchers/user_icon_youhuiquan_logo_2.png" v-if="status1 || status2" class="vouchers-logo"/> -->
                  <div v-if="item.ticketTypeId==1" class="vouchers-detail">
                    <span class="fuhao" :class="{ 'used-fuhao': status2}">¥</span>
                    <span class="money" :class="{ 'used-money': status2}">{{item.faceValue}}</span>
                    <span class="text" :class="{ 'used-text': status2}">{{item.ticketName}}</span>
                  </div>
                  <div v-if="item.ticketTypeId==2" class="vouchers-detail">
                    <span class="discount" :class="{ 'used': status2}">{{item.discountValue*10}}</span>
                    <span class="zhe" :class="{ 'used': status2}">折</span>
                  </div>
                  <div v-if="item.ticketTypeId==3" class="vouchers-detail discount-detail">
                    <img src="../../assets/vouchers/user_icon_dingdan_mianyouquan_logo_2.png" v-if="status2" alt="">
                    <img src="../../assets/vouchers/user_icon_dingdan_mianyouquan_logo_1.png" v-else alt="">
                    <span class="text" :class="{ 'used-text': status2}">{{item.ticketName}}</span>
                  </div>
                  <div class="user_money" v-if="item.ticketTypeId!=3" :class="{ 'used-condition': status2}">满{{item.useCondition}}可用</div>
                  <div class="time">有效期：{{item.timeRangeStart | dateFormat('yyyy.MM.dd')}}-{{item.timeRangeEnd| dateFormat('yyyy.MM.dd')}}</div>
                  <div class="use-range">
                    <div class="user_plice" :class="{'change_high':item.check}">使用范围：{{item.useDesc}}</div>
                    <div @click='change_height(item)' :class="item.check?'down':'up'"></div>
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
      vouchers_list: [],
      data_change: true,
      empty: true,
      cant_load_more: false,
      pageNum: 1,
      isMore: 1,
      pageSize: 15,
      httpflag: true
    }
  },
  created: function() {
    this.setTitle('优惠券')
    this.weixin_init()
    this.coupons_list('0')
  },
  methods: {
    change_height: function(item) {
      if (item.check) {
        item.check = false
      } else {
        item.check = true
      }
      this.data_change = !this.data_change
    },
    coupons_list: function(type, pageNum) {
      this.httpflag = false
      this.$http
        .get('order/tickets_list.do', {
          params: {
            pageNum: pageNum || 1,
            pageSize: this.pageSize,
            type: type
          }
        })
        .then(res => {
          console.log('res>>>>>>', res)
          let data = res.body
          this.httpflag = true
          if (data.tickets.length) {
            this.empty = false
            this.vouchers_list.push(...data.tickets)
            this.isMore = data.isMore
            this.pageNum++
            if (data.isMore) {
              this.cant_load_more = false
            } else {
              this.cant_load_more = true
            }
          } else if (data.tickets.length == 0) {
            this.vouchers_list = []
            this.empty = true
          }
        })
    },
    //tab切换选择不同类型的购物币 新追加type字段,0未使用,1已使用,2已过期
    statusmethod: function(type) {
      this.pageNum = 1
      this.vouchers_list = []
      switch (type) {
        case '0':
          this.status0 = true
          this.status1 = false
          this.status2 = false
          this.coupons_list('0')
          break
        case '1':
          this.status0 = false
          this.status1 = true
          this.status2 = false
          this.coupons_list('1')
          break
        case '2':
          this.status0 = false
          this.status1 = false
          this.status2 = true
          this.coupons_list('2')
          break
      }
    },
    // 上拉加载更多
    load_more() {
      if (this.httpflag) {
        if (this.status0) {
          this.coupons_list('0', this.pageNum)
        } else if (this.status1) {
          this.coupons_list('1', this.pageNum)
        } else if (this.status2) {
          this.coupons_list('2', this.pageNum)
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

.vouchers-box {
  width: 100%;
  height: 100%;
  background: #f5f8f9;
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
.vouchers-tab {
  width: 100%;
  height: 8%;
  background: #fff;
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
      height: 2px;
      position: absolute;
      bottom: 5px;
      left: 50%;
      margin-left: -7px;
      background: linear-gradient(-217deg, #fc6655 0%, #ff8996 100%);
      border-radius: 15px;
    }
  }
  .active {
    color: #ff8996;
  }
}
.no-coupon {
  .pxrem(width,
    339);
  .pxrem(height,
    45);
  .pxrem(line-height,
    45);
  .pxrem(margin,
    10,
    12,
    10,
    12);
  .pxrem(padding-left,
    12);
  font-size: 14px;
  color: #272728;
  background: #ffffff;
}
.content-box {
  height: 92%;
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  .content-container {
    flex: 1;
    background: #f5f8f9;
  }
  .empty-box {
    background: #fff;
    height: 100%;
    overflow: hidden; /*justify-content:center;*/
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
      color: #86898b;
      line-height: 14px;
    }
  }
}
.vouchers-content {
  width: 100%;
  .vouchers-list {
    margin: 10px 12px 0;
    height: 135px;
    .list-bottom {
      width: 100%;
      height: 100%;
      padding: 12px 60px 0 15px;
      box-sizing: border-box;
      .vouchers-logo {
        display: block;
        width: 52px;
        height: 11px;
      }
      .vouchers-detail {
        > img {
          width: 54px;
          height: 28px;
        }
      }
      .vouchers-detail.discount-detail {
        margin-top: 10px;
        margin-bottom: 10px;
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
        // margin-left: -10px;
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
        line-height: 50px;
        margin-left: -4px;
        font-weight: 600;
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
        width: 180px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
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
  .vouchers-unused {
    background: url('../../assets/vouchers/h5_icon_youhuiquan_bg_red_1.png')
      no-repeat left center;
    background-size: cover;
  }
  .vouchers-unused-high {
    height: 158px;
    background: url('../../assets/vouchers/h5_icon_youhuiquan_bg_red_2.png')
      no-repeat left center;
    background-size: cover;
  }
  .vouchers-used {
    background: url('../../assets/vouchers/h5_icon_youhuiquan_bg_gary_1.png')
      no-repeat left center;
    background-size: cover;
  }
  .vouchers-used-high {
    height: 158px;
    background: url('../../assets/vouchers/h5_icon_youhuiquan_bg_gary_2.png')
      no-repeat left center;
    background-size: cover;
  }
  .vouchers-list:last-child {
    .pxrem(margin-bottom,
      10);
  }
}
.down {
  float: left;
  position: relative;
  top: 4px;
  width: 9px;
  height: 6px;
  background: url('../../assets/vouchers/user_icon_youhuiquan_arrow_shang.png')
    no-repeat left center;
  background-size: cover;
}

.up {
  float: left;
  position: relative;
  top: 4px;
  width: 9px;
  height: 6px;
  background: url('../../assets/vouchers/user_icon_youhuiquan_arrow_xia.png')
    no-repeat left center;
  background-size: cover;
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
.vouchers-box .act .status:before {
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
