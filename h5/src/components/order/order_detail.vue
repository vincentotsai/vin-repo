<template>
  <div class="order_detail">
    <div class="scroll_block" ref="scroll_block">
      <div class="multy_tip" v-if="isMultiPkg == 1">
        <img src="../../assets/order/3xicon_tip.png" alt=""> 您购买的商品由于发货批次不同，故分为多个配送单
      </div>
      <div class="order_status">
        <div class="left">
          <img src="../../assets/version3/icon_bq_m01_S@2x.png" alt="">
        </div>
        <div class="center" :style="{'margin-top': statusMargin ? '5px' : ''}">
          <span class="status_up">{{statusType[orderDeatil.userOrderStatus]}}</span>
          <p class="down" v-if="orderDeatil.userOrderStatus == '0' && dropDownDate.arr.length > 0">剩余：
            <span class="timerNum">{{dropDownDate.arr[1] | numDouble}}</span>
            <span>:</span>
            <span class="timerNum">{{dropDownDate.arr[2] | numDouble}}</span>
            <span>:</span>
            <span class="timerNum">{{dropDownDate.arr[3] | numDouble}}</span>
          </p>
          <p class="down" v-if="isMultiPkg == 1">已拆成{{pkgsNum}}件包裹发货</p>
        </div>
      </div>
      <div class="take" v-if="orderAddressObj && orderDeatil.isVirtual != 1">
        <img src="../../assets/version3/icon_shxx@2x.png">
        <div class="takeinfo">
          <p class="takepeople">收货人:
            <span>{{orderAddressObj.trueName}}</span>
            <span class="telInfo">{{orderAddressObj.mobile}}</span>
          </p>
          <p class="takeaddress">
            <span>{{orderAddressObj.provName}}{{orderAddressObj.cityName}}{{orderAddressObj.areaName}}{{orderAddressObj.addressDetail}}</span>
          </p>
        </div>
      </div>

      <div class="packages">
        <div class="package" v-for="(pkg,index) in deliverList" :key="index">
          <div class="newest_info" v-if="pkg.logisObj" @click="toDelivery(pkg)">
            <div class="left">
              <img src="../../assets/order/ms_order_detail_icon_wlxx@3x.png" alt="">
            </div>
            <div class="center">
              <div class="info">{{pkg.logisObj.logisInfo}}</div>
              <div class="time">{{pkg.logisObj.dealTime | dateFormat('yyyy-MM-dd hh:mm')}} {{pkg.logisObj.deliverStatus}}</div>
            </div>
            <div class="right">></div>
          </div>
          <div v-else-if="orderDeatil.isVirtual == 1"></div>
          <div class="newest_info" v-else>
            <div class="left">
              <img src="../../assets/order/ms_order_detail_icon_wlxx@3x.png" alt="">
            </div>
            <div class="center">
              <div class="info">未发货</div>
            </div>
          </div>
          <!-- meaningless but necessary div-->
          <div :style="{'height': isMultiPkg != 1 && pkg.logisObj ? '32px': ''}"></div>
          <div class="goods" :style="{'margin-top': orderDeatil.isVirtual == 1 ? '15px' : ''}" v-for="(item,idx) in pkg.orderGoodsList" v-show="item.show" @click="goDetial(item)" :key="idx">
            <img :src="item.skuImage" @error="setErrorImg($event,100,100)">
            <div class="info">
              <p class="name">{{item.goodsName }}</p>
              <div class="sku">
                <span class="skuname">{{item.skuName}}</span>
                <span class="skucount">x{{item.skuCount}}</span>
              </div>
              <div class="skuprice">
                <span v-if="item.sellType == 2">赠品</span>
                <span v-else>¥{{item.goodsPromoPrice ? item.goodsPromoPrice : item.goodsPrice}}</span>
              </div>
            </div>
          </div>

          <div v-if="pkg.orderGoodsList.length > 3">
            <div class="toggle" v-show="pkg.toggleType === 'open'" @click="toggleMore('open', index)">点击查看全部
              <img src="../../assets/order/3xicon_zk.png">
            </div>
            <div class="toggle" v-show="pkg.toggleType === 'close'" @click="toggleMore('close', index)">收起
              <img src="../../assets/order/3xicon_sq.png">
            </div>
          </div>
        </div>

      </div>
      <div class="connectservice">
        <p class="tip">如对订单有任何问题，欢迎在9:00~18:00时间内</p>
        <p class="btn" @click="service">联系在线客服</p>
      </div>
      <div class="bottombar">
        <div class="message" v-if="orderDeatil.userMsg">
          <p class="messagetip">留言</p>
          <p class="messageinfo">{{orderDeatil.userMsg?orderDeatil.userMsg:"留言"}}</p>
        </div>
        <p class="orderinfo">订单金额:
          <span class="righttext">¥{{orderDeatil.goodsPrice}}</span>
        </p>
        <p class="orderinfo" v-if="orderDeatil.couponPromoDiscountsPrice">购物币:
          <span class="righttext">-¥{{orderDeatil.couponPromoDiscountsPrice}}</span>
        </p>
        <p class="orderinfo" v-if="orderDeatil.ticketPromoDiscountsPrice">优惠券:
          <span class="righttext">-¥{{orderDeatil.ticketPromoDiscountsPrice}}</span>
        </p>
        <p class="orderinfo" v-show="orderDeatil.isVirtual != 1">运费:
          <span class="righttext">¥{{orderDeatil.transportPrice}}</span>
        </p>
        <p class="pay-price">实付金额：
          <span class="price">￥{{orderDeatil.payPrice}}</span>
        </p>
      </div>
      <div class="bottombar">
        <p class="orderinfo">订单编号：
          <span class="righttext copy" v-if="!isAndroid" v-clipboard:copy="orderDeatil.orderNo" v-clipboard:success="onCopyOk" v-clipboard:error="onCopyError">复制</span>
          <span class="righttext">{{orderDeatil.orderNo}}</span>
        </p>
        <p class="orderinfo">下单时间:
          <span class="righttext">{{orderDeatil.addTime | dateFormat('yyyy-MM-dd hh:mm')}}</span>
        </p>
        <p class="orderinfo" v-if="orderDeatil.payTime">付款时间：
          <span class="righttext">{{orderDeatil.payTime | dateFormat('yyyy-MM-dd hh:mm')}}</span>
        </p>
        <p class="orderinfo">买家昵称：
          <span class="righttext">{{orderDeatil.userNickname}}</span>
        </p>
        <p class="orderinfo" v-if="orderDeatil.payPlatform">付款方式：
          <span class="righttext">{{orderDeatil.payPlatform | payPlatform}}</span>
        </p>
      </div>
    </div>

    <div class="bottom_btns vux-1px-t">
      <button v-if="(orderStatus == 20 || orderStatus == 25 || orderStatus == 30 || orderStatus == 40 || orderStatus == 50) && orderDeatil.isVirtual != 1" @click="afterSale()">申请售后</button>
      <button v-if="orderStatus == 60 || orderStatus == 70" @click="delGoods()">删除订单</button>
      <button v-if="orderStatus == 0" @click="redirect()">立即付款</button>
      <button class="blue" v-if="orderStatus == 10 && orderDeatil.isVirtual != 1" @click="cancelGoods(order_id, status)">申请退款</button>
      <button class="blue" v-if="orderStatus == 0 && orderDeatil.isVirtual != 1" @click="cancelGoods(orderDeatil.orderNo,orderStatus)">取消订单</button>
      <button v-if="orderStatus == 30 || orderStatus == 40" @click="orderSignedConfirm()">确认收货</button>
    </div>

    <!-- 0:'待付款',10:'待发货',20:'已出库',25-已部分发货,30:'已发货\待收货',40:'已收货',50:'已完成',60:'已取消',70:'已关闭', -->
    <!-- payStatus 0-未付款 10-已付款 20-已退款 -->
  </div>
</template>

<script>
import { is_weixin } from '@/util/public-fun'
import wxUtil from '@/wx/wx-util'
export default {
  name: 'order_detail',
  data() {
    return {
      statusType: {
        0: '待付款',
        10: '待发货',
        20: '已出库',
        25: '已部分发货',
        30: '待收货',
        40: '已收货',
        50: '已完成',
        60: '已取消',
        70: '已关闭'
      },
      isMultiPkg: this.$route.query.isMultiPkg, //多包裹 0否1是
      //chenhy
      orderDeatil: {}, //订单详情
      orderAddressObj: {}, //收获地址
      deliverList: [], //包裹们
      orderStatus: -1, //订单状态
      dropDownDate: {
        timerName: null,
        arr: []
      }, //待付款倒计时
      canrefund: false,
      closeFlag: false //查看更多
    }
  },
  activated() {
    wxUtil.config()
    this.getOrderDetail()
    if (this.$refs.scroll_block) {
      this.$refs.scroll_block.scrollTop = sessionStorage.orderDeatil_H
      let vm = this
      vm.$refs.scroll_block.addEventListener(
        'scroll',
        function() {
          sessionStorage.orderDeatil_H = vm.$refs.scroll_block.scrollTop
        },
        false
      )
    }
  },
  deactivated() {
    this.$refs.scroll_block.removeEventListener('scroll', function() {}, false)
    clearInterval(this.dropDownDate.timerName)
  },
  computed: {
    statusMargin() {
      return (
        this.orderDeatil.userOrderStatus == 50 ||
        this.orderDeatil.userOrderStatus == 60 ||
        this.orderDeatil.userOrderStatus == 70 ||
        this.orderDeatil.userOrderStatus == 10 ||
        this.orderDeatil.userOrderStatus == 30
      )
    },
    pkgsNum() {
      let num = 0
      for (let i = 0; i < this.deliverList.length; i++) {
        const del = this.deliverList[i]
        if (del.logisObj && Object.keys(del.logisObj).length) {
          num += 1
        }
      }
      return num
    }
  },
  methods: {
    getOrderDetail() {
      let params = {
        orderNo: this.$route.query.id
      }
      this.$http
        .get('order/order_details_v2.do', {
          params
        })
        .then(res => {
          this.$vux.loading.hide()
          let data = res.data.orderObj
          this.orderDeatil = data
          this.orderAddressObj = data.orderAddressObj
          this.deliverList = data.deliverList
          // 处理包裹列表里的商品数超过三条则收起
          this.toggleDelivery(this.deliverList)

          this.orderStatus = data.userOrderStatus
          this.getDropDown()
          this.getRefundStatus()
        })
    },
    toggleMore(type, index) {
      if (type === 'open') {
        this.deliverList[index].toggleType = 'close'
        this.deliverList[index].orderGoodsList.forEach(element => {
          element.show = true
          // 必须！！
          this.$forceUpdate()
        })
      } else {
        // close
        this.deliverList[index].toggleType = 'open'
        this.deliverList[index].orderGoodsList.forEach((element, i) => {
          if (i < 3) {
            element.show = true
          } else {
            element.show = false
          }
          this.$forceUpdate()
        })
      }
      this.setHis('his' + this.$route.query.id, index, type)
    },
    setHis(type, index, value) {
      let arr = sessionStorage['his' + type]
        ? JSON.parse(sessionStorage['his' + type])
        : new Array(this.deliverList.length).fill('close')
      arr[index] = value
      sessionStorage.setItem(type, JSON.stringify(arr))
    },
    goDetial(item) {
      this.$router.push({
        name: 'detail',
        query: {
          goods_id: item.goodsId
        }
      })
    },
    toDelivery(pkg) {
      this.$router.push({
        name: 'logistics_detail',
        query: {
          id: this.orderDeatil.orderNo,
          deliverNo: pkg.logisObj.deliverNo
        }
      })
    },
    toggleDelivery(list) {
      let hisArr = sessionStorage['his' + this.$route.query.id]
        ? JSON.parse(sessionStorage['his' + this.$route.query.id])
        : new Array(list.length).fill('close')
      for (let i = 0; i < list.length; i++) {
        const element = list[i]
        if (element.orderGoodsList.length > 3) {
          element.toggleType = hisArr[i] === 'close' ? 'open' : 'close'
        }

        if (hisArr[i] === 'close') {
          // 最多只显示三项
          element.orderGoodsList.map((item, idx) => {
            if (idx < 3) {
              item.show = true
            } else {
              item.show = false
            }
          })
        } else {
          // 全部显示
          element.orderGoodsList.map((item, idx) => {
            item.show = true
          })
        }
      }
    },
    //待付款倒计时
    getDropDown() {
      if (this.orderDeatil.userOrderStatus != 0) return false
      if (this.orderDeatil.payExpirationTime < this.sysTime) {
        this.orderDeatil.userOrderStatus = 60
        return false
      }
      this.dropDownDate.timerName = setInterval(() => {
        //倒计时结束，关闭计时器
        if (this.orderDeatil.payExpirationTime - this.sysTime <= 0) {
          this.orderDeatil.userOrderStatus = 60
          clearInterval(this.dropDownDate.timerName)
        }
        this.$set(
          this.dropDownDate,
          'arr',
          new Date(
            (this.orderDeatil.payExpirationTime - this.sysTime) / 1000
          ).formatStamp()
        )
      }, 1000)
    },
    //立即支付
    redirect() {
      if (is_weixin()) {
        this.wxPay(this.orderDeatil.orderNo, this.orderDeatil.payPrice)
      } else {
        this.aliPay(this.orderDeatil.orderNo, this.orderDeatil.payPrice)
      }
    },
    service() {
      window.location.href =
        'https://kefu.easemob.com/webim/im.html?configId=09358c3e-c46f-40d4-87da-5d065a02efd2'
    },
    //确认收货
    orderSignedConfirm() {
      const _this = this
      _this.$vux.confirm.show({
        content: '确定收货?',
        hideOnBlur: true,
        onConfirm() {
          _this.$http
            .post('order/order_signed_confirm.do', {
              orderNo: _this.$route.query.id
            })
            .then(res => {
              _this.$router.push({
                name: 'success',
                query: {
                  isReceived: true,
                  out_trade_no: _this.orderDeatil.orderNo
                }
              })
            })
        }
      })
    },
    //删除订单
    delGoods() {
      const _this = this
      _this.$vux.confirm.show({
        content: '确定删除订单?',
        hideOnBlur: true,
        onConfirm() {
          _this.$http
            .post('order/order_del.do', {
              orderNo: _this.$route.query.id
            })
            .then(res => {
              history.back()
            })
        }
      })
    },
    //取消订单
    cancelGoods(order_id, status) {
      const _this = this
      let content = '确定申请退款?'
      if (status == 0) {
        content = '确定取消订单?'
      }
      _this.$vux.confirm.show({
        content: content,
        hideOnBlur: true,
        onConfirm() {
          if (status == 0) {
            _this.$http
              .post('order/order_cancel.do', {
                orderNo: _this.$route.query.id
              })
              .then(res => {
                history.back()
              })
          } else {
            _this.$http
              .post('order/order_refund_apply.do', {
                orderNo: _this.$route.query.id
              })
              .then(res => {
                history.back()
              })
          }
        }
      })
    },
    //退款
    orderRefundApply() {
      const _this = this
      _this.$vux.confirm.show({
        content: '确定退款?',
        hideOnBlur: true,
        onConfirm() {
          _this.$http
            .post('order/order_refund_apply.do', {
              orderNo: _this.$route.query.id
            })
            .then(res => {
              history.back()
            })
        }
      })
    },
    //查看物流
    logistics() {
      var queryObj = {}
      queryObj.id = this.orderDeatil.orderNo
      if (this.orderDeatil.logisObj) {
        queryObj.deliverNo = this.orderDeatil.logisObj.deliverNo
      }
      if (this.orderDeatil.logisCount > 1) {
        this.$router.push({
          name: 'logistics_list',
          query: queryObj
        })
      } else {
        this.$router.push({
          name: 'logistics_detail',
          query: queryObj
        })
      }
    },
    // 查看退款进度
    returnProgress() {
      this.$router.push({
        name: 'payPro',
        query: {
          orderNo: this.$route.query.id
        }
      })
    },
    // 申请售后
    afterSale() {
      this.$router.push({
        name: 'rs',
        query: {
          id: this.$route.query.id
        }
      })
    },
    onCopyOk(e) {
      this.showToast('订单号已复制到您的粘贴板中')
    },
    onCopyError(e) {
      this.showToast('复制失败')
    },
    //是否能申请售后
    getRefundStatus() {
      for (let i = 0; i < this.deliverList.length; i++) {
        if (
          this.deliverList[i].skuCount != this.deliverList[i].goodsAfterSale
        ) {
          this.canrefund = true
          return
        }
      }
    }
  },
  filters: {
    payPlatform: function(value) {
      if (value == 0) {
        return '微信支付'
      } else if (value == 1) {
        return '支付宝'
      } else if (value == 2) {
        return 'DBUY'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.order_detail {
  font-size: 16px;
  background: #fafafa;
  .scroll_block {
    width: 100%;
    height: 92%;
    overflow: auto;
    .multy_tip {
      height: 40px;
      width: 100%;
      line-height: 40px;
      background: #ffe9e7;
      color: #fc6655;
      font-size: 12px;
      padding-left: 12px;
      img {
        width: 12px;
        margin-right: 5px;
        position: relative;
        top: 2px;
      }
    }
    .order_status {
      background-image: url('../../assets/order/3ximage_wl_bg.png');
      background-size: cover;
      padding: 0 12px;
      height: 80px;
      .left {
        float: left;
        img {
          width: 35px;
          margin-right: 7px;
          position: relative;
          top: 20px;
        }
      }
      .center {
        display: inline-block;
        padding: 18px 0;
        overflow: hidden;
        .status_up {
          font-size: 18px;
          color: white;
          font-weight: bold;
        }
        .down {
          margin-top: 5px;
          font-size: 12px;
          color: #ffffff;
          letter-spacing: 0;
          line-height: 12px;
        }
        .timerNum {
          background-color: rgba(255, 255, 255, 0.18);
          border-radius: 1px;
          padding: 2px 6px;
        }
      }
    }
    .take {
      display: flex;
      position: relative;
      background: #ffffff;
      padding: 15px 12px;
      margin-bottom: 5px;
      > img {
        width: 48px;
        height: 43px;
      }
      .takeinfo {
        flex: 1;
        margin-left: 9px;
        .takepeople {
          font-size: 14px;
          color: #1b1b1b;
          font-weight: bold;
        }
        .takeaddress {
          font-size: 14px;
          color: #86898b;
          margin-top: 10px;
        }
        .telInfo {
          margin-left: 20px;
        }
      }
    }
    .packages {
      .package {
        padding: 0 12px;
        background: #ffffff;
        margin-bottom: 5px;
        .newest_info {
          font-size: 16px;
          color: #1b1b1b;
          letter-spacing: 0;
          text-align: left;
          height: 98px;
          line-height: 98px;
          .left {
            float: left;
            img {
              width: 50px;
              margin-right: 7px;
              position: relative;
              top: 20px;
            }
          }
          .center {
            width: 80%;
            display: inline-block;
            position: relative;
            top: 10px;
            .info {
              font-size: 14px;
              color: #1b1b1b;
              letter-spacing: 0;
              text-align: left;
              line-height: 16px;
              margin-bottom: 10px;
              display: -webkit-box;
              overflow: hidden;
              text-overflow: ellipsis;
              -webkit-line-clamp: 1;
              -webkit-box-orient: vertical;
              word-break: break-all;
              font-weight: bold;
            }
            .time {
              font-size: 14px;
              color: #86898b;
              letter-spacing: 0;
              line-height: 14px;
            }
          }
          .right {
            float: right;
          }
        }
        .goods {
          display: flex;
          padding-bottom: 30px;
          > img {
            width: 100px;
            height: 100px;
          }
          .info {
            flex: 1;
            padding: 0 0 0 12px;
            position: relative;
            .name {
              font-size: 14px;
              line-height: 24px;
              margin-top: -4px;
              color: #1b1b1b;
              display: -webkit-box;
              overflow: hidden;
              text-overflow: ellipsis;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              word-break: break-all;
              font-weight: bold;
            }
            .sku {
              font-size: 11px;
              color: #86898b;
              margin-top: 10px;
              .skucount {
                float: right;
              }
            }
            .skuprice {
              position: absolute;
              font-size: 16px;
              color: #ff6655;
              font-weight: bold;
              bottom: 0px;
              width: 100%;
              .skustatus {
                float: right;
                margin-right: 12px;
                font-size: 12px;
                color: #86898b;
                font-weight: 100;
              }
            }
          }
        }
      }
      .toggle {
        text-align: center;
        font-size: 12px;
        color: #a0a4a6;
        letter-spacing: 0;
        line-height: 12px;
        padding-bottom: 33px;
        img {
          width: 12px;
        }
      }
    }
    .connectservice {
      padding: 30px 0;
      background: white;
      margin-top: 5px;
      .tip {
        font-size: 12px;
        text-align: center;
        color: #86898b;
      }
      .btn {
        background: linear-gradient(-196deg, #ff6655 0%, #ff8996 100%);
        box-shadow: 0 4px 13px 0 rgba(255, 151, 69, 0.44);
        border-radius: 51px;
        text-align: center;
        margin: 20px auto 0 auto;
        height: 40px;
        width: 265px;
        line-height: 40px;
        font-size: 14px;
        color: #ffffff;
      }
    }
    .bottombar {
      background: #ffffff;
      padding: 20px 12px;
      margin-top: 5px;
      .message {
        font-size: 14px;
        .messagetip {
          color: #1b1b1b;
          font-weight: bold;
        }
        .messageinfo {
          background: #fafafa;
          color: #86898b;
          line-height: 22px;
          padding: 14px 14px;
          margin: 14px 0 30px 0;
        }
      }
      .orderinfo {
        line-height: 25px;
        font-size: 12px;
        color: #86898b;
        .righttext {
          float: right;
        }
        .copy {
          display: block;
          width: 36px;
          height: 16px;
          border: 1px solid #1b1b1b;
          border-radius: 2px;
          text-align: center;
          line-height: 16px;
          margin-left: 8px;
          margin-top: 2px;
          color: #1b1b1b;
        }
      }
      .pay-price {
        font-size: 16px;
        margin-top: 10px;
        color: #1b1b1b;
        text-align: right;
        font-weight: bolder;
        .price {
          font-size: 16px;
          color: #ff6655;
          letter-spacing: 0;
          line-height: 16px;
        }
      }
    }
  }
  .bottom_btns {
    background: #fff;
    height: 8%;
    border: 1px solid #fafafa;
    text-align: right;
    padding: 10px 12px 10px 0;
    > button {
      background: linear-gradient(-135deg, #ff8996 0%, #ff6655 100%);
      box-shadow: 0 2px 10px 0 rgba(255, 76, 138, 0.2);
      margin-left: 12px;
      font-size: 12px;
      color: #ffffff;
      letter-spacing: 0;
      border-radius: 100px;
      line-height: 28px;
      width: 74px;
      height: 28px;
      text-align: center;
    }
    .blue {
      background: linear-gradient(-140deg, #92dbff 4%, #499ffd 95%);
      box-shadow: 0 2px 10px 0 rgba(0, 110, 255, 0.2);
    }
  }
}
</style>
