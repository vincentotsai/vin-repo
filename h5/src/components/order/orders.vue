<template>
  <div class="view orders-view">
    <ul id="order-menu" class="vux-1px-b">
      <li v-for="(item,index) in tabList"
          :key="index"
          :class="[{ active: selectIndex == index }]"
          class="orders_tab"
          @touchend="switchTab(index)">{{item}}
        <div class="icon" v-if="selectIndex == index"></div>
      </li>
    </ul>
    <div class="orders-view-child">
      <!-- 无数据 -->
      <div class="empty_order" v-if="tempOrderList && tempOrderList.length == 0">
        <img class="empty" src="../../assets/empty/noorders.png">
        <div class="empty-tips">暂无相关订单</div>
      </div>
      <!-- 订单列表 -->
      <div class="tabs-content" v-else>
        <scroller ref="ordersRef" @on-scroll-bottom="loadMore" :nomore="allLoaded" :from="$route.name">
          <ul class="orderbox">
            <li class="item" v-for="(item, index) in tempOrderList" :key="index">
              <div class="create-time">
                <span class="multi_pkg" v-if="item.multiDeliverBill == 1">
                  <img src="../../assets/order/3ximage_bq_dbg.png" alt="">
                </span>
                <span class="time">{{item.addTime | dateFormat('yyyy-MM-dd hh:mm')}}</span>
                <span class="status status_color" v-if="item.userOrderStatus != 50">{{statusType[item.userOrderStatus]}}</span>
                <span v-else class="status">
                  <i class="icon yiwnacheng"></i>
                </span>
              </div>
              <div class="item-info">
                <a class="single-pic" v-for="(son,i) in item.orderGoodsList" @click="toOrderDetail(item)"
                  v-show="son.show" :key="i">
                  <img class="pic" :src="son.skuImage+imageSize(200,200)" container=".v-scroller">
                  <div class="info">
                    <p class="name">{{ son.goodsName }}</p>
                    <div class="sku">
                      <span class="skuname">{{ son.skuName }}</span>
                      <span class="skucount">x{{son.skuCount}}</span>
                    </div>
                    <p class="skuprice" v-if="son.sellType == 2">赠品</p>
                    <p v-else class="skuprice">¥{{son.goodsPrice}}</p>
                  </div>
                </a>
                <div v-if="item.orderGoodsList.length > 3">
                  <div class="toggle" v-show="item.toggleType === 'open'" @click="toggleMore('open', index)">点击查看全部
                    <img src="../../assets/order/3xicon_zk.png">
                  </div>
                  <div class="toggle" v-show="item.toggleType === 'close'" @click="toggleMore('close', index)">收起
                    <img src="../../assets/order/3xicon_sq.png">
                  </div>
                </div>
              </div>

              <div class="tips">
                <div class="money">
                  <span class="all">合计：</span>
                  <span class="timenum">¥{{item.payPrice}}</span>
                  <span class="all" v-if="item.transportPrice != 0"> (运费:¥{{item.transportPrice}})</span>
                </div>
                <span class="tips-desc">共{{item.orderSkuCount}}件商品</span>
              </div>
              <div class="btn-wrap">
                <span class="pay-time" v-if="item.userOrderStatus==0">请在
                  <span class="timenum">
                    <span v-if="item.timerData[1]">{{item.timerData[1] | numDouble}}小时</span>{{item.timerData[2] | numDouble}}分
                    <span v-if="!item.timerData[1]">{{item.timerData[3] | numDouble}}秒</span>
                  </span>内完成支付</span>

                <span class="btn"
                      v-if="item.userOrderStatus == 0 && item.isVirtual != 1"
                      @click="cancelOrder(item.orderNo,item.userOrderStatus)">取消订单</span>
                <span class="btn go-pay"
                      v-if="item.userOrderStatus == 0"
                      @click="payNow(item.orderNo,item.payPrice)">立即付款</span>
                <span class="btn"
                      v-if="item.userOrderStatus == 10 && item.isVirtual != 1"
                      @click="cancelOrder(item.orderNo,item.userOrderStatus)">申请退款</span>
                <span class="btn"
                      v-if="item.userOrderStatus == 60 || item.userOrderStatus == 70 "
                      @click="delOrder(item.orderNo)">删除订单</span>
                <span class="btn"
                      v-if="item.userOrderStatus == 50 && item.isVirtual != 1"
                      @click="reqAfterSale(item)">申请售后</span>
                <span class="btn"
                      v-if="item.userOrderStatus == 30 || item.userOrderStatus == 40"
                      @click="confirmReceived(item.orderNo)">确认收货</span>
                <span class="btn"
                      v-if="item.userOrderStatus != 0 && item.userOrderStatus != 60 && item.userOrderStatus != 70"
                      @click="checkLogistics(item)">查看物流</span>
                <span class="btn"
                      v-if="item.userOrderStatus==60 && item.payStatus==20"
                      @click="returnProgress(item.orderNo)">查看进度</span>
                <!-- userOrderStatus: 0-待付款 10-待发货 20-已出库 25-已部分发货 30-待收货（已发货） 40-已签收 50-已完成 60-已取消 70-已关闭 -->
                <!-- payStatus: 0-未付款 10-已发起付款 20-已付款 -->
              </div>
            </li>
          </ul>
        </scroller>
      </div>
    </div>
  </div>
</template>

<script>
import wxUtil from '@/wx/wx-util'
import { is_weixin } from '@/util/public-fun'
export default {
  name: 'orders',
  data() {
    return {
      tabList: ['全部', '待付款', '待发货', '待收货'],
      statusType: {
        0: '待付款',
        10: '待发货',
        20: '已出库',
        25: '已部分发货',
        30: '已发货',
        40: '已签收',
        50: '已完成',
        60: '已取消',
        70: '已关闭'
      },
      selectIndex: this.$route.query.type || 0,
      tempOrderList: null,
      timer: '', //计时器对象
      allLoaded: false,
      pageNum: 1,
      pageSize: 8,
      loadingFlag: false
    }
  },
  activated() {
    wxUtil.config()
    this.getOrderList()
    if (this.$refs.ordersRef) {
      this.$refs.ordersRef.$el.scrollTop = sessionStorage.getItem('orders_H')
    }
  },
  deactivated() {
    clearInterval(this.timer)
  },
  methods: {
    getOrderList() {
      this.loadingFlag = true
      let params = {
        orderBelong: 1,
        orderStatus: this.selectIndex,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      this.$http.get('order/order_list_v2.do', { params }).then(res => {
        let data = res.data
        this.$vux.loading.hide()
        this.loadingFlag = false
        this.allLoaded = data.isMore == '0'
        this.handleOrderList(data.orderList)
        this.countTime()
      })
    },
    handleOrderList(list) {
      let hisArr = sessionStorage.hisToggle
        ? JSON.parse(sessionStorage.hisToggle)
        : new Array(list.length).fill('close')
      for (var i = 0; i < list.length; i++) {
        if (list[i].orderGoodsList.length > 3) {
          list[i].toggleType = hisArr[i] === 'close' ? 'open' : 'close'
        }
        if (hisArr[i] === 'close') {
          // 最多只显示三项
          list[i].orderGoodsList.map((item, idx) => {
            if (idx < 3) {
              item.show = true
            } else {
              item.show = false
            }
          })
        } else {
          // 全部显示
          list[i].orderGoodsList.map((item, idx) => {
            item.show = true
          })
        }
        var time = parseInt((list[i].payExpirationTime - this.sysTime) / 1000)
        list[i].timerData = new Date(time).formatStamp()
        if (list[i].userOrderStatus == 0) {
          if (time <= 0) {
            list[i].userOrderStatus = 60 //已关闭
          } else {
            list[i].lastTime = time
          }
        }
      }

      if (this.pageNum && this.pageNum > 1) {
        this.tempOrderList = this.tempOrderList.concat(list)
      } else {
        this.tempOrderList = list
      }
    },
    countTime() {
      clearInterval(this.timer)
      this.timer = setInterval(() => {
        if (!this.tempOrderList) {
          return false
        }
        for (var i = 0; i < this.tempOrderList.length; i++) {
          if (this.tempOrderList[i].lastTime) {
            this.tempOrderList[i].timerData = new Date(
              this.tempOrderList[i].lastTime
            ).formatStamp()
          }
        }
      }, 1000)
    },
    toggleMore(type, index) {
      if (type === 'open') {
        this.tempOrderList[index].toggleType = 'close'
        this.tempOrderList[index].orderGoodsList.forEach(element => {
          element.show = true
        })
      } else {
        // close
        this.tempOrderList[index].toggleType = 'open'
        this.tempOrderList[index].orderGoodsList.forEach((element, i) => {
          if (i < 3) {
            element.show = true
          } else {
            element.show = false
          }
        })
      }
      this.setHis('hisToggle', index, type)
    },
    setHis(type, index, value) {
      let arr = sessionStorage[type]
        ? JSON.parse(sessionStorage[type])
        : new Array(this.tempOrderList.length).fill('close')
      arr[index] = value
      sessionStorage.setItem(type, JSON.stringify(arr))
    },
    toOrderDetail(item) {
      this.$router.push({
        name: 'order_detail',
        query: {
          id: item.orderNo,
          isMultiPkg: String(item.multiDeliverBill)
        }
      })
    },
    payNow(order_id, price) {
      if (is_weixin()) {
        this.wxPay(order_id, price)
      } else {
        this.aliPay(order_id, price)
      }
    },
    confirmReceived(order_id) {
      const _this = this
      _this.$vux.confirm.show({
        content: '确定收货?',
        hideOnBlur: true,
        onConfirm() {
          _this.$http
            .post('order/order_signed_confirm.do', {
              orderNo: order_id
            })
            .then(res => {
              _this.$router.push({
                name: 'success',
                query: {
                  isReceived: true,
                  out_trade_no: order_id
                }
              })
            })
        }
      })
    },
    cancelOrder(order_id, status) {
      let url = 'order/order_cancel.do'
      if (status != 0) {
        url = 'order/order_refund_apply.do'
      }
      const _this = this
      let content = '确定申请退款?'
      if(status ==0){
        content = '确定取消订单?'
      }
      _this.$vux.confirm.show({
        content: content,
        hideOnBlur: true,
        onConfirm() {
          _this.$http
            .post(url, {
              orderNo: order_id
            })
            .then(res => {
              _this.tempOrderList = null
              _this.pageNum = 1
              _this.getOrderList()
            })
        }
      })
    },
    delOrder(order_id) {
      const _this = this
      _this.$vux.confirm.show({
        content: '确定删除订单?',
        hideOnBlur: true,
        onConfirm() {
          _this.$http
            .post('order/order_del.do', {
              orderNo: order_id
            })
            .then(res => {
              for (let i = 0; i < _this.tempOrderList.length; i++) {
                if (_this.tempOrderList[i].orderNo == order_id) {
                  _this.tempOrderList.splice(i, 1)
                  return
                }
              }
            })
        }
      })
    },
    reqAfterSale(item) {
      this.$router.push({ name: 'rs', query: { id: item.orderNo } })
    },
    loadMore() {
      if (!this.loadingFlag) {
        this.pageNum += 1
        this.getOrderList()
      }
    },
    switchTab(index) {
      if (index == this.selectIndex) return false
      this.$vux.loading.show({
        text: '加载中...'
      })
      this.$router.replace({
        name: 'orders',
        query: {
          type: index
        }
      })
    },

    checkLogistics(item) {
      var queryObj = {}
      queryObj.id = item.orderNo
      if (item.userOrderStatus >= 30) {
        queryObj.deliverNo = item.logisObj.deliverNo
      }
      if (item.logisCount > 1) {
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
    returnProgress(orderNo) {
      this.$router.push({
        name: 'payPro',
        query: {
          orderNo: orderNo
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
@import '../../styles/index.less';
.orders-view {
  position: static;
  height: 100%;
}

.orders-view-child {
  height: 92%;
  background: #fafafa;
}

.tabs-content {
  height: 100%;
}

#order-menu {
  text-align: center;
  height: 53px;
  background: #fff;
  width: 100%;
  .orders_tab {
    height: 100%;
    float: left;
    width: 25%;
    line-height: 52px;
    overflow: hidden;
    font-size: 15px;
    color: #838388;
    position: relative;
    .icon {
      width: 8px;
      height: 2px;
      position: absolute;
      bottom: 5px;
      left: 50%;
      margin-left: -5px;
      background: linear-gradient(-217deg, #ff8996 0%, #ff6655 100%);
      border-radius: 15px;
    }
  }
  .orders_tab.active {
    color: #fc6655;
  }
}

.item {
  position: relative;
  background: #fff;
  margin-bottom: 5px;
  padding-right: 12px;
  padding-left: 12px;
  overflow: hidden;
  list-style: none;
}

.item-info {
  box-sizing: border-box;
  width: 100%; //单个订单
  .toggle {
    text-align: center;
    font-size: 12px;
    color: #a0a4a6;
    letter-spacing: 0;
    line-height: 12px;
    img {
      width: 12px;
    }
  }
  .single-pic {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    display: flex;
    margin-bottom: 10px;
    .info {
      width: 100%;
      padding: 0 0 0 12px;
      position: relative;
      .name {
        font-size: 14px;
        line-height: 22px;
        font-weight: bold;
        color: #1b1b1b;
        display: -webkit-box;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        word-break: break-all;
      }
      .sku {
        font-family: PingFangSC-Semibold;
        font-size: 11px;
        color: #86898b;
        margin-top: 10px;
        .skucount {
          float: right;
        }
      }
      .skuprice {
        font-size: 16px;
        color: #fc6655;
        margin-top: 18px;
      }
    }
  } //多个订单
  .pic {
    width: 100px;
    height: 100px;
    float: left;
  }
}

.btn {
  display: inline-block;
  // float: right;
  border: 1px solid #1b1b1b;
  height: 28px;
  width: 64px;
  line-height: 28px;
  margin-left: 15px;
  margin-top: 10px;
  margin-bottom: 20px;
  text-align: center;
  color: #1b1b1b;
  font-size: 12px;
  border-radius: 14px;
}

.go-pay {
  background: linear-gradient(196deg, #ff8996 0%, #fc6655 100%);
  box-shadow: 0 4px 13px 0 rgba(255, 151, 69, 0.44);
  border-radius: 14px;
  font-size: 12px;
  line-height: 28px;
  width: 74px;
  height: 28px;
  border: none;
  color: #ffffff;
}

.tips {
  font-size: 14px;
  color: #272728;
  text-align: left;
  width: 100%;
  height: 34px;
  line-height: 34px;
  margin-top: 10px;
  display: block;
  clear: both;
  overflow: hidden;
  > span {
    display: inline-block;
  }
  .tips-desc {
    float: right;
    .px2rem(padding-right, 30);
    font-size: 12px;
    line-height: 38px;
    color: #86898b;
  }
  .money {
    float: right;
    font-size: 12px;
    line-height: 34px;
    color: #86898b;
    .timenum {
      font-size: 16px;
      color: #fc6655;
    }
    .all {
      font-size: 12px;
      color: #86898b;
    }
  }
  .yunfei {
    float: right;
    .pxrem(margin-right,
      12);
  }
}
.create-time {
  position: relative;
  display: block;
  width: 100%;
  height: 70px;
  line-height: 70px;
  float: left;
  font-size: 12px;
  color: #838388;
  .multi_pkg {
    img {
      width: 38px;
      position: relative;
      top: 4px;
    }
  }
  .time {
    font-size: 12px;
    color: #838388;
  }
  .status {
    float: right;
    font-size: 12px;
    color: #838388;
    letter-spacing: 0;
  }
  .status_color {
    color: #86898b;
  }
}
.empty_order {
  height: 100%;
  background: #fff;
  overflow: hidden;
  .empty {
    display: block;
    margin: 0 auto;
    margin-top: 110px;
    width: 216px;
    height: 144px;
  }
  .empty-tips {
    margin: 39px;
    text-align: center;
    font-size: 14px;
    color: #cecece;
  }
}
.wuliu {
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
  width: 100%;
  .pxrem(padding, 0, 12, 0, 12);
  .pxrem(height, 60);
  .icon {
    float: left;
    .pxrem(width, 21);
    .pxrem(height, 21);
    .pxrem(margin-top, 21);
    background: url('../../assets/commom/h5_icon_yunliu.png') no-repeat 0 0;
    background-size: 100% 100%;
  }
  .right {
    float: left;
    .pxrem(width,
      300);
    .pxrem(margin-left,
      14);
    > p:first-child {
      .pxrem(margin-top,
        21);
      font-size: 12px;
      color: #ff6532;
      line-height: 16px;
    }
    > p:last-child {
      .pxrem(margin-top,
        4);
      font-size: 10px;
      color: #838388;
      line-height: 12px;
    }
  }
}
.wuliu:after {
  position: absolute;
  left: 0;
  bottom: 0;
  content: '';
  width: 100%;
  height: 0;
  border: 1px dashed #f2f2f2;
}
.btn-wrap {
  display: block;
  width: 100%;
  overflow: hidden;
  position: relative;
  line-height: 30px;
  text-align: right;
}
.pay-time {
  margin-left: 9px;
  font-size: 12px;
  color: #86898b;
  letter-spacing: 0;
  line-height: 18px;
  .timenum {
    color: #ffa044;
  }
}
//已完成更改为icon
.yiwnacheng {
  display: inline-block;
  .pxrem(width,
    62);
  .pxrem(height,
    49);
  background: url('../../assets/set/user_icon_dingdan_yiwancheng.png') no-repeat;
  background-size: 100% 100%;
}
</style>
