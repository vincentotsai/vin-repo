<template>
  <div class="customer-page">
    <div class="top">
      <div class="empty-tips" v-if="empty">
        <img src="../../assets/empty/refundlist.png">
        <div>
          <p class="desc">暂无申请记录</p>
        </div>
      </div>
      <scroller ref="after_sale_list" v-else @on-scroll-bottom="loadMore" :offsetBottom="70" :nomore="!isMore" :from="$route.name">
        <ul class="list">
          <li v-for="(item,index) in order_list" :key="index">
            <div class="top">
              <span class="no">售后单号：{{item.afterSaleNo}}</span>
              <span class="status">{{item.afterSaleStatusZh}}</span>
            </div>
            <div class="center" @click="reSchedule(item)">
              <div v-if="item.briefGoodsList.length==1">
                <x-img :default-src='defaultLazyImg()' :src="item.briefGoodsList[0].skuImage+imageSize(162,162)" container=".v-scroller"></x-img>
                <p v-if="item.briefGoodsList.length==1">{{item.briefGoodsList[0].goodsName}}</p>
              </div>
              <div v-else>
                <x-img :default-src='defaultLazyImg()' v-for="(img,i) in item.briefGoodsList" :key="i" :src="img.skuImage+imageSize(162,162)" container=".v-scroller"></x-img>
              </div>
            </div>
            <div class="bottomb">
              <p>{{item.applyTime | dateFormat('yyyy-MM-dd HH:mm:ss')}}</p>
              <p class="price">共{{item.goodsCount}}件商品
                <span class="title">合计：</span>
                <span class="text">{{item.totaolRefundMoney}}</span>
              </p>
            </div>
            <div class="button-area">
              <button v-if="item.showCancel && item.afterSaleCancelAvailable == '1'" @click="cancelRefund(item)">取消申请</button>
              <button @click="toOrderDetail(item)">订单详情</button>
            </div>
          </li>
        </ul>
      </scroller>
    </div>
    <div class="btns vux-1px-t">
      <button @click="reGoods()">申请售后</button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      order_list: [],
      isMore: true,
      pageNum: 1,
      pageSize: 10,
      empty: false,
      loadingFlag: false
    }
  },
  activated() {
    this.getOrderList()
    if (this.$refs.after_sale_list) {
      this.$refs.after_sale_list.$el.scrollTop = sessionStorage.getItem(
        'after_H'
      )
    }
  },
  methods: {
    getOrderList() {
      this.loadingFlag = true
      let params = {
        type: 1,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      this.$http.get('order/after_sale_history.do', { params }).then(res => {
        let data = res.data
        if (!Object.keys(data).length || !data.list.length) {
          this.empty = true
          return false
        }
        if (this.pageNum && this.pageNum > 1) {
          this.order_list = this.order_list.concat(data.list)
        } else {
          this.order_list = data.list
        }
        this.isMore = data.list.length === this.pageSize
        for (let i = 0; i < this.order_list.length; i++) {
          this.setRefundStatus(this.order_list[i])
        }
        this.loadingFlag = false
      })
    },
    loadMore() {
      if (!this.loadingFlag) {
        this.pageNum += 1
        this.getOrderList()
      }
    },
    setRefundStatus(item) {
      let customData = {}
      // afterSaleStatus售后状态: 0-待申请审核 5-拒绝用户售后申请 10-待客户回寄
      // 20-待确认收货 25-已同意，待商家收货（需要回寄但不需要填写物流单号）
      // 30-已收到货，待退款审核 33-客服点击再次审核，待退款审核
      // 35-不要回寄，也不要确认收货，待退款审核 40-没有收到客户回寄商品（定时器触发）
      // 45-拒绝退款 50-客服同意退款，待财务审核 55-财务审核失败 60-财务审核成功 70-用户撤回
      switch (item.afterSaleStatus) {
        case 0:
        case 10:
        case 20:
        case 25:
        case 30:
        case 33:
        case 35:
        case 50:
        case 55:
          customData.showCancel = true
          break
        case 5:
        case 45:
        case 60:
        case 70:
          customData.showCancel = false
          break
      }
      item.showCancel = customData.showCancel
    },
    cancelRefund(item) {
      let _this = this
      this.$vux.confirm.show({
        content: '是否取消申请?',
        hideOnBlur: true,
        onConfirm() {
          _this.$http
            .post('order/after_sale_cancel.do', {
              afterSalesNo: item.afterSaleNo
            })
            .then(res => {
              _this.pageNum = 1
              _this.order_list = []
              _this.getOrderList()
            })
        }
      })
    },
    //订单详情
    toOrderDetail(item) {
      this.$router.push({
        name: 'order_detail',
        query: {
          id: item.orderNo
        }
      })
    },
    //售后进度
    reSchedule(item) {
      this.$router.push({
        name: 'rePro',
        query: {
          afterSalesNo: item.afterSaleNo
        }
      })
    },
    //申请退货 这里是到所有可以售后的订单列表页面
    reGoods(item) {
      this.$router.push({
        name: 'relist'
      })
    }
  }
}
</script>

<style scoped lang="less">
.customer-page {
  position: absolute;
  height: 100%;
  width: 100%;
  overflow-y: auto;
  background: #fafafa;
  .top {
    height: 92%;
    overflow: hidden;
  }
  .info-text {
    font-size: 12px;
    color: #86898b;
    line-height: 12px;
  }
  ul > li {
    padding: 0 12px;
    margin-bottom: 5px;
    background: #fff;
    .top {
      padding: 32px 0 22px 0;
      > span {
        .info-text;
      }
      .status {
        float: right;
      }
    }
    .center {
      padding-bottom: 33px;
      > div {
        // display: flex;
        width: 100%;
        img {
          margin-right: 5px;
          width: 81px;
          height: 81px;
        }
        p {
          font-size: 14px;
          color: #1b1b1b;
          line-height: 18px;
          font-weight: bold;
          flex: 1;
        }
      }
    }
    .bottomb {
      .info-text;
      overflow: hidden;
      > p {
        float: left;
      }
      .price {
        float: right;
        font-weight: bold;
        .title {
          margin-left: 10px;
        }
        .text {
          font-size: 16px;
          color: #fc6655;
          line-height: 16px;
        }
      }
    }
    .button-area {
      width: 100%;
      padding: 20px 0;
      text-align: right;
      > button {
        margin-left: 12px;
        width: 74px;
        height: 28px;
        background: #fff;
        line-height: 28px;
        text-align: center;
        font-size: 12px;
        color: #1b1b1b;
        border: none;
        outline: none;
        border-radius: 28px;
        border: 1px solid #1b1b1b;
      }
    }
  }
  .empty-tips {
    height: 100%;
    background: #fff;
    overflow: hidden;
    text-align: center;
    > img {
      display: block;
      height: 170px;
      width: 216px;
      margin: 110px auto 0;
    }
    .desc {
      font-size: 14px;
      color: #86898b;
      line-height: 16px;
      font-weight: 600;
      margin-top: 20px;
    }
    .tips {
      font-size: 14px;
      color: #86898b;
    }
  }
  .btns {
    position: fixed;
    bottom: 0;
    font-size: 16px;
    text-align: center;
    height: 64px;
    line-height: 64px;
    // padding:auto 0;
    width: 100%;
    background: #fff;
    z-index: 100;
    button {
      background-image: linear-gradient(90deg, #ff8996 0%, #fc6655 100%);
      box-shadow: 0 4px 13px 0 rgba(252, 102, 85, 0.31);
      border-radius: 51px;
      width: 102px;
      height: 34px;
      text-align: center;
      font-size: 14px;
      color: white;
    }
  }
}
</style>
