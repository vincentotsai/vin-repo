<template>
  <div>
    <div class="tips">
      <p class="desc" @click="service()">
        您购买的商品由于发货批次不同，故分为多个配送单，具体规则说明请联系客服。
      </p>
      <img src="../../assets/user_icon_wuliu_go@2x.png" class="arrow">
    </div>
    <ul class="list">
      <li v-for="(item,index) in deliverList" :key="index" @click="toDetail(item.deliverNo)">
        <div class="logis-info">
            <span class="deliver-info">{{item.logisCompanyName}}：{{item.logisNo}}</span>
            <span class="deliver-status">{{item.deliverStatus}}</span>
        </div>
        <div class="goods" v-for="(goods,index1) in item.goodsList" :key="index1">
          <img :src="goods.coverImage+imageSize(70,70,2)" @error="setErrorImg($event,70,70)">
          <div class="fr">
            <p class="goods-name ellipse">{{goods.goodsName}}</p>
            <p class="status">{{item.deliverStatus?item.deliverStatus :"暂时没有物流信息"}}</p>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      deliverList: []
    }
  },
  created() {
    this.getLogistics()
  },
  methods: {
    getLogistics() {
      let params = { orderNo: this.$route.query.id }
      this.$http.get('order/get_deliver_bill_list.do', { params }).then(res => {
        this.deliverList = res.data.list
      })
    },
    toDetail(deliverNo) {
      this.$router.push({
        name: 'logistics_detail',
        query: { id: this.$route.query.id, deliverNo: deliverNo }
      })
    },
    service() {
      window.location.href =
        'https://kefu.easemob.com/webim/im.html?configId=09358c3e-c46f-40d4-87da-5d065a02efd2'
    }
  }
}
</script>

<style scoped lang="less">
@import '../../styles/index.less';
.tips {
  background: #fff7f0;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  .desc {
    font-size: 14px;
    color: #cccccc;
    letter-spacing: 0;
    line-height: 24px;
  }
  .arrow {
    width: 5px;
    height: 10px;
  }
}
.list {
  background: #f5f8fb;
  li {
    margin-bottom: 5px;
    background: #fff;
    padding: 32px 12px 24px;
    .logis-info {
      font-size: 12px;
      color: #86898b;
      letter-spacing: 0;
      line-height: 12px;
      overflow: hidden;
      .deliver-info {
        float: left;
      }
      .deliver-status {
        float: right;
      }
    }
    .goods {
      margin-top: 20px;
      overflow: hidden;
      img {
        width: 70px;
        height: 70px;
        float: left;
      }
      .fr {
        float: left;
        margin-left: 12px;
        .goods-name {
          font-size: 14px;
          line-height: 20px;
          color: #1b1b1b;
          width: 260px;
          font-weight: 600;
        }
        .status {
          font-size: 11px;
          color: #86898b;
          line-height: 11px;
          margin-top: 13px;
        }
      }
    }
  }
}
</style>
