<template>
  <div>
    <div id="wrap">
      <div class="paysuccess">
        <div class="content">
          <img src="../../assets/cart/image_zfcg@2x.png" alt="">

          <div v-if="isReceived">
            <p class="title">确认收货成功</p>
            <p class="desc">您的订单号：
              <span>{{order_num}}</span>交易成功
              <br>感谢您在Ola Buy购物，欢迎下次光临</p>
          </div>

          <div v-else>
            <p>订单号:{{order_num}}</p>
            <p>
              <span>支付金额:</span>
              <span class="total-amount">{{pay_num}}</span>
            </p>
          </div>
        </div>
        <div class="btn">
          <div class="check butto" @click="route_link('order_detail',{'id':order_num})">查看订单</div>
          <div class="shopping butto" @click="route_link('home')">继续购物</div>
        </div>
        <p class="tips">注意事项：Ola Buy不会以系统维护，订单异常等为理由，要求您点击链接或者进行其他方式进行退款操作，或者以各种理由索取您的任何隐私信息（包括账号密码，银行卡密码，身份证信息等等）</p>
      </div>
      <!-- 邓丽 下单支付直发卡券包弹窗 -->
      <div class="coupons-window" v-if="ticketsIsShow">
        <div class="title1">送您{{ticketsInfo.length}}张优惠券</div>
        <div class="title2">赶快去下单吧！</div>
        <img src="../../assets/vouchers/user_icon_box_lingqu_close.png" class="del-btn" @click="close()" />
        <div class="coupons-box">
          <ul>
            <li v-for="(item,index) in ticketsInfo" :key="index" class="single-coupon">
              <div class="left">
                <div class="faceValue" v-if="item.ticketTypeId == 1">
                  ￥{{item.faceValue}}
                </div>
                <div class="discountValue" v-if="item.ticketTypeId == 2">
                  {{item.discountValue}}
                  <span class="discount-text">折</span>
                </div>
                <div class="mianyou" v-if="item.ticketTypeId == 3">
                  <img src="../../assets/vouchers/user_icon_box_lingqu_mianyou.png" />
                </div>
                <p class="useCondition" v-if="item.ticketTypeId == 1 || item.ticketTypeId == 2">满{{item.useCondition}}可用</p>
              </div>
              <div class="right">
                <p class="ticketName">{{item.ticketName}}</p>
                <p class="useEndTime">有效期至&nbsp;{{item.timeRangeEnd | dateFormat("yyyy-MM-dd")}}</p>
              </div>
            </li>
          </ul>
        </div>
        <div class="coupons-btn" @click="route_link('vouchers')">查看我的优惠券</div>
      </div>
      <recommend :goodsList="recGoodsList"></recommend>
    </div>
  </div>
</template>

<script>
  import recommend from '@/components/common/recommond'
  export default {
    name: 'paysuccess-received',
    data() {
      return {
        order_num: this.$route.query.out_trade_no || '', //订单号
        pay_num: this.$route.query.total_amount || '', //支付金额
        recGoodsList: [], //推荐商品列表
        ticketsInfo: [],
        ticketsIsShow: false,
        isReceived: !!this.$route.query.isReceived //否：支付成功页 是：确认收货页
      }
    },
    components: {
      recommend
    },
    created() {
      //在支付成功界面弹窗-支付送券
      if (!this.isReceived) {
        this.paySuccessDialog()
      }
      this.getRecommend()
    },
    methods: {
      getRecommend() {
        let params = {
          orderNo: this.order_num
        }
        this.$http.get('goods/goods_recommend_for_order.do', {
          params
        }).then(res => {
          this.recGoodsList = res.data.recommendGoodsList
        })
      },
      //邓丽 关闭卡券包弹窗
      close() {
        this.ticketsIsShow = false
      },
      //在支付成功界面弹窗-支付送券
      paySuccessDialog() {
        this.$http
          .post('order/show_pay_for_tickets_pop.do', {
            orderNo: this.order_num
          })
          .then(res => {
            console.log('tickets_pop', res)
            this.ticketsInfo = res.data.tickets
            if (this.ticketsInfo) {
              this.ticketsIsShow = true
            }
          })
      },
      // 跳到退款进度页面
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

<style scoped lang="less">
  @import '../../styles/index.less';
  ul {
    list-style: none;
  }

  #wrap {
    background: #f2f2f2;
    overflow: hidden;
    .coupons-window {
      width: 345px;
      height: 456px;
      background: url('../../assets/vouchers/user_icon_box_lingqu_1.png');
      background-size: 100% 100%;
      position: absolute;
      top: 95px;
      left: 50%;
      margin-left: -172px;
      .title1 {
        width: 100%;
        margin-top: 28px;
        font-size: 20px;
        color: #ffffff;
        line-height: 28px;
        text-align: center;
      }
      .title2 {
        width: 100%;
        font-size: 14px;
        color: #ffffff;
        text-align: center;
        margin-bottom: 48px;
      }
      .del-btn {
        width: 12px;
        height: 12px;
        position: absolute;
        top: 15px;
        right: 15px;
      }
      .coupons-box {
        width: 100%;
        ul {
          height: 218px;
          overflow-y: scroll;
          .single-coupon {
            .pxrem(width,
            290);
            .pxrem(height,
            104);
            background: url('../../assets/vouchers/user_icon_box_lingqu_quan.png');
            background-size: 100% 100%;
            color: #ff6532;
            margin: 0 auto 10px;
            padding: 28px 0 0 24px;
            box-sizing: border-box;
            .left {
              float: left;
              width: 66px;
              text-align: left;
              .faceValue {
                font-size: 38px;
                color: #fc6655;
                transform: scaleX(0.5);
                width: 132px;
                margin-left: -33px;
              }
              .useCondition {
                font-size: 9px;
                color: #86898b;
              }
              .mianyou img {
                width: 46px;
                height: 24px;
              }
              .discountValue {
                font-size: 38px;
                color: #fc6655;
                transform: scaleX(0.5);
                width: 132px;
                margin-left: -33px;
              }
              .discount-text {
                font-size: 10px;
                color: #fc6655;
                line-height: 20px;
              }
            }
            .right {
              float: left;
              margin-left: 10px;
              width: 190px;
              .ticketName {
                font-size: 16px;
                color: #1b1b1b;
                line-height: 18px;
                margin-bottom: 9px;
                margin-top: 7px;
              }
              .useEndTime {
                font-size: 10px;
                color: #86898b;
                line-height: 10px;
              }
            }
          }
        }
      }
      .coupons-btn {
        width: 265px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        background: linear-gradient(-217deg, #ff8996 0%, #fc6655 100%);
        box-shadow: 0 4px 13px 0 rgba(255, 151, 69, 0.44);
        border-radius: 51px;
        font-size: 14px;
        color: #ffffff;
        margin: 40px auto 0;
      }
    }
  }

  .paysuccess {
    background: #fff;
    overflow: hidden;
    .content {
      .total-amount {
        color: #fc6655;
      }
      >img {
        display: block;
        width: 161px;
        height: 90px;
        margin: 30px auto 10px;
      }
      p {
        font-size: 14px;
        color: #1b1b1b;
        line-height: 14px;
        font-weight: 600;
        text-align: center;
        overflow: hidden;
        margin-bottom: 11px;
        .goods-price {
          width: auto;
          float: left;
        }
      }
      .title {
        font-size: 14px;
        color: #272728;
        line-height: 14px;
      }
      .desc {
        font-size: 12px;
        color: #86898b;
        line-height: 18px;
        font-weight: 100;
        span {
          float: none;
          margin: 0;
        }
      }
    }
    .btn {
      background: #fff;
      overflow: hidden;
      margin-top: 29px;
      .butto {
        width: 102px;
        height: 34px;
        text-align: center;
        line-height: 34px;
        font-size: 14px;
        color: #1b1b1b;
        border: 1px solid #1b1b1b;
        border-radius: 51px;
        float: left;
      }
      .check {
        margin-left: 70px;
      }
      .shopping {
        margin-left: 30px;
        border: none;
        color: #fff;
        background: linear-gradient(-196deg, #ff8996 0%, #fc6655 100%);
        box-shadow: 0 4px 13px 0 rgba(255, 151, 69, 0.44);
      }
    }
    .tips {
      font-size: 12px;
      color: #86898b;
      letter-spacing: 0;
      line-height: 22px;
      background: #fff;
      padding: 30px 12px;
    }
  }

</style>
