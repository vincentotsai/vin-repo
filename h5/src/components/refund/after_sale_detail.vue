<template>
  <div class="re-detail">
    <div class="order">
      <p class="title bold">{{orderDetail.afterSaleStatusZh}}</p>
      <div class="newest_info" v-if="orderDetail.timeNode">
        <div class="time">
          {{orderDetail.timeNode.addTime | dateFormat('yyyy-MM-dd HH:mm:ss')}}
        </div>
        <div class="desc">
           <p class="txt" v-for="(t,i) in orderDetail.timeNode.operateDesc" :key="i">
            <span>{{t.title}}</span>
            <span v-if="t.content">{{': ' + t.content}}</span>
          </p>
        </div>
        <div class="btn" v-if="orderDetail.timeNode.logType == 1" @click="toLogistics(orderDetail.timeNode)">
          填写回寄物流信息
        </div>
      </div>
    </div>

    <div class="progress" @click="toProgress">
      售后协商进度
      <span class="arrow">></span>
    </div>

    <div class="goods">
      <div class="info" v-for="(item,index) in orderDetail.goodsList" :key="index">
        <div class="pic">
          <img :src="item.skuImage" @error="setErrorImg($event,100,100)">
        </div>
        <div class="title bold">{{item.goodsName}}</div>
        <div class="guige">
          <span>{{item.skuName}}</span>
          <span class="pull-right">x{{item.count}}</span>
        </div>
        <span class="price bold">￥{{item.goodsPayPrice}}</span>
        <span class="btn" @click="showCurrentPopup(index)">退货原因</span>
      </div>
    </div>

    <div class="detail">
      <div class="item">
        <span>售后单号：</span>
        <span class="pull-right">
          <span>{{orderId}}</span>
          <span class="cp" v-clipboard:copy="orderId" v-clipboard:success="onCopyOk" v-clipboard:error="onCopyError">复制</span>
        </span>
      </div>
      <div class="item">
        <span>退款金额：</span>
        <span class="pull-right">￥{{orderDetail.totalRefundMoney}}</span>
      </div>
      <div class="item">
        <span>申请时间：</span>
        <span class="pull-right">{{orderDetail.applyTime | dateFormat('yyyy-MM-dd HH:mm:ss')}}</span>
      </div>
      <div class="item">
        <span>售后类型：</span>
        <span class="pull-right">{{type[Number(orderDetail.type)]}}</span>
      </div>
      <div class="item" v-if="orderDetail.userNickName">
        <span>买家昵称：</span>
        <span class="pull-right">{{orderDetail.userNickName}}</span>
      </div>
    </div>

    <div v-transfer-dom>
      <popup class="pop-dialog" v-model="isShowPopup" height="42%" position="bottom" max-height="50%">
        <img class="close" src="../../assets/user_icon_box_down.png" @click="isShowPopup = false">
        <div class="popup-item">
          <p class="title">退货原因</p>
          <p class="txt">{{currentReason.submitReason}}</p>
          <p class="title">问题说明</p>
          <p class="txt">{{currentReason.submitDesc}}</p>
          <p class="title">图片</p>
          <div class="pics">
            <img v-for="(item,i) in currentReason.submitImgs" :key="i" :src="item">
          </div>
        </div>
      </popup>
    </div>

  </div>
</template>
<script>
import { TransferDom, Popup } from 'vux'
export default {
  data() {
    return {
      orderId: this.$route.query.orderId,
      orderDetail: {},
      isShowPopup: false,
      currentReason: {},
      type:['退货','换货','维修']
    }
  },
  directives: {
    TransferDom
  },
  components: {
    Popup
  },
  created() {
    this.getDetail()
  },
  methods: {
    getDetail() {
      let param = {
        params: { afterSalesNo: this.orderId }
      }
      this.$http.get('order/after_sale_detail.do', param).then(res => {
        this.orderDetail = res.data
        if(this.orderDetail.timeNode && this.orderDetail.timeNode.operateDesc) {
          this.orderDetail.timeNode.operateDesc = JSON.parse(this.orderDetail.timeNode.operateDesc)
        }
      })
    },
    showCurrentPopup(idx) {
      this.isShowPopup = true
      let param = {
        params: {
          afterSalesNo: this.orderId,
          skuId: this.orderDetail.goodsList[idx].skuId
        }
      }
      this.$http.get('order/after_sale_reason.do', param).then(res => {
        let data = res.data
        this.currentReason = data.reason
      })
    },
    //填写物流信息
    toLogistics(item) {
      this.$router.push({
        name: 'logistics', //填写物流信息
        query: { orderNo: this.orderId, logId: item.logId }
      })
    },
    toProgress() {
      this.$router.push({
        name: 'rePro', //退款进度
        query: { afterSalesNo: this.orderId }
      })
    },
    onCopyOk(e) {
      this.showToast('售后单号已复制到您的粘贴板中')
    },
    onCopyError(e) {
      this.showToast('复制失败')
    }
  }
}
</script>
<style lang="less" scoped>
.re-detail {
  font-size: 14px;
  .order {
    width: 100%;
    overflow: hidden;
    background: #fff;
    padding: 22px 13px;
    box-sizing: border-box;
    margin-bottom: 5px;
    .newest_info {
      width: 100%;
      background: white;
      .time {
        margin-top: 10px;
        margin-bottom: 16px;
        font-size: 12px;
        color: #cccccc;
        letter-spacing: 0;
        text-align: left;
        line-height: 12px;
      }
      .desc {
        font-size: 14px;
        color: #86898b;
        letter-spacing: 0;
        text-align: left;
        line-height: 14px;
        .txt {
          line-height: 200%;
        }
      }
      .btn {
        border: 1px solid #1b1b1b;
        border-radius: 3px;
        font-size: 12px;
        color: #1B1B1B;
        letter-spacing: 0;
        line-height: 12px;
        padding: 8px 12px;
        display: inline-block;
        margin-top: 10px;
      }
    }
    .title {
      font-family: PingFangSC-Semibold;
      font-size: 18px;
      color: #1b1b1b;
      letter-spacing: 0;
      line-height: 18px;
      margin-bottom: 5px;
    }
    .number {
      font-family: PingFangSC-Semibold;
      font-size: 14px;
      color: #86898b;
      letter-spacing: 0;
      line-height: 18px;
    }
  }
  .progress {
    width: 100%;
    height: 56px;
    line-height: 56px;
    padding: 0 12px;
    background: white;
    font-size: 14px;
    color: #1b1b1b;
    font-weight: bold;
    margin-bottom: 5px;
    .arrow {
      float: right;
      color: #a0a4a6;
      font-weight: normal;
    }
  }
  .goods {
    background: #fff;
    margin-bottom: 5px;
    .info {
      width: 100%;
      height: 160px;
      overflow: hidden;
      background: #fff;
      margin-bottom: 1px;
      .pic {
        width: 100px;
        height: 100px;
        margin: 30px 12px;
        float: left;
        > img {
          width: 100%;
          height: 100%;
        }
      }
      .title {
        margin-top: 24px;
        margin-bottom: 10px;
        padding-right: 12px;
        font-family: PingFangSC-Semibold;
        font-size: 14px;
        color: #1b1b1b;
        line-height: 22px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      .guige {
        padding-right: 12px;
        font-size: 12px;
        font-family: PingFangSC-Regular;
        font-size: 11px;
        color: #86898b;
        line-height: 11px;
        margin-bottom: 20px;
        .pull-right {
          float: right;
        }
      }
      .price {
        font-family: PingFangSC-Semibold;
        font-size: 16px;
        color: #fc6655;
        letter-spacing: 0;
        line-height: 16px;
      }
      .btn {
        display: inline-block;
        border: 1px solid #1b1b1b;
        border-radius: 14px;
        text-align: center;
        position: absolute;
        right: 12px;
        font-size: 12px;
        color: #1b1b1b;
        background: #fff;
        padding: 7px 12px;
      }
    }
  }
  .detail {
    background: #fff;
    padding: 33px 12px;
    .item {
      font-family: PingFangSC-Medium;
      font-size: 12px;
      color: #86898b;
      letter-spacing: 0;
      line-height: 12px;
      margin-bottom: 14px;
      .pull-right {
        float: right;
      }
      .cp {
        display: inline-block;
        width: 36px;
        height: 16px;
        border: 1px solid #1b1b1b;
        border-radius: 2px;
        text-align: center;
        line-height: 16px;
        color: #1b1b1b;
      }
    }
  }
  .cancel-btn {
    display: inline-block;
    width: 20%;
    height: 20px;
    border: 1px solid #1b1b1b;
    border-radius: 14px;
    text-align: center;
    line-height: 20px;
    position: absolute;
    right: 40%;
    margin-top: 20px;
    margin-bottom: 53px;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #1b1b1b;
    letter-spacing: 0;
    background: #fff;
  }
}
.pop-dialog {
  z-index: 1000;
  background: white;
  padding: 0 12px;
  .close {
    display: block;
    position: relative;
    left: 96%;
    margin-top: 5px;
    width: 16px;
  }
  .popup-item {
    .title {
      font-family: PingFangSC-Semibold;
      font-size: 13px;
      color: #1b1b1b;
      line-height: 18px;
      margin-bottom: 3px;
    }
    .txt {
      font-family: PingFangSC-Regular;
      font-size: 12px;
      color: #86898b;
      line-height: 18px;
      margin-bottom: 17px;
    }
    .pics {
      margin-top: 12px;
      img {
        width: 60px;
        height: 60px;
        margin-right: 6px;
      }
    }
  }
}
</style>

