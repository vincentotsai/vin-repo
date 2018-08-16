<template>
  <!-- 所有可申请售后的订单列表 -->
  <section class="return-goods-list">
    <ul class="order-list">
      <li class="order-item" v-for="(order, index) in orderList" :key="index" @click="toAfterSale(order)">
        <div class="order-no">订单编号：{{ order.orderNo }}</div>
        <ul class="goods-list">
          <li class="goods-item" v-for="(goods, index) in order.orderGoodsList" :key="index">
            <x-img class="pic" :default-src='defaultLazyImg()' :src="goods.skuImage+imageSize(140,140)" container=".return-goods-list"></x-img>
            <div class="goods-details">
              <div class="title bold">{{ goods.goodsName }}</div>
              <div class="goods-info">
                <span>{{goods.skuName}}</span>
                <span>x{{ goods.skuCount }}</span>
              </div>
            </div>
          </li>
        </ul>
        <div class="order-time">
          <span>{{ order.addTime | dateFormat('yyyy-MM-dd HH:mm:ss') }}</span>
          <button class="vux-1px">申请售后</button>
        </div>
      </li>
    </ul>
    <div class="empty-tips" v-if="orderList.length == 0 && !isMore">
      <img src="../../assets/empty/getrefund.png">
      <div class="tips">暂无可以申请退货的订单</div>
    </div>
  </section>

</template>
<script>
export default {
  data() {
    return {
      orderList: [],
      isMore: true
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    getOrderList() {
      this.$http
        .get('order/enable_after_sale_list.do', {
          params: { pageNum: '1', pageSize: '15' }
        })
        .then(res => {
          let data = res.data
          this.orderList = data.orderList
          this.isMore = data.isMore == 1
        })
    },
    toAfterSale(order) {
      this.$router.push({ name: 'rs', query: { id: order.orderNo } })
    }
  }
}
</script>
<style lang="less" scoped>
.return-goods-list {
  height: 100%;
  width: 100%;
  background: #fff;
  overflow-y: auto;
  .info-text {
    font-size: 12px;
    color: #86898b;
    line-height: 12px;
  }
  .order-list {
    // padding-bottom: 50px;
  }
  .order-list .order-item {
    padding: 12px 12px 0 12px;
    background: #fff;
    margin-bottom: 5px;
    .order-no {
      padding: 20px 0;
      .info-text;
    }
    .goods-list .goods-item {
      padding-bottom: 30px;
      display: flex;
      > img {
        width: 70px;
        height: 70px;
        object-fit: cover;
      }
      .goods-details {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding-left: 12px;
        .title {
          font-size: 14px;
          color: #1b1b1b;
          line-height: 18px;
        }
        .goods-info {
          display: flex;
          justify-content: space-between;
          > span {
            font-size: 11px;
            color: #86898b;
            line-height: 11px;
          }
        }
      }
    }
    .order-time {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 20px;
      > span {
        .info-text;
      }
      > button {
        padding: 7px 12px;
        background: #fff;
        font-size: 12px;
        color: #1b1b1b;
        line-height: 12px;
        &:before {
          border-color: #1b1b1b;
          border-radius: 30px;
        }
      }
    }
  }
  .empty-tips {
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    > img {
      display: block;
      height: 170px;
      width: 216px;
      margin-bottom: 14px;
    }
    .tips {
      font-size: 14px;
      color: #86898b;
    }
  }
}
</style>


