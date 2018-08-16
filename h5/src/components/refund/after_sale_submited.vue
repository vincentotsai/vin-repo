<template>
  <div class="submited">
    <div class="pic">
      <img src="../../assets/cart/image_zfcg@2x.png" alt="">
    </div>
    <div class="title">售后申请提交成功</div>
    <div class="desc">
      请等待工作人员审核，审核成功后，若需要回寄货品请 在审核通过后按系统要求地址回寄商品
    </div>
    <div class="btns">
      <button @click="routeLink('order_detail')">查看订单</button>
      <button @click="routeLink('reDetail')">查看售后单</button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'aftersale_submited',
  methods: {
    routeLink(name) {
      this.$router.push({
        name,
        query: {
          orderId: this.$route.query.afterSaleId, //给售后
          id: this.$route.query.orderId //给订单
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.submited {
  background: white;
  padding: 64px 12px;
  height: 100%;
  .pic {
    width: 100%;
    text-align: center;

    img {
      width: 161px;
      height: 90px;
    }
  }
  .title {
    text-align: center;
    font-size: 16px;
    margin: 13px 0 27px;
    color: #272728;
    text-align: center;
    line-height: 16px;
  }
  .desc {
    font-size: 12px;
    color: #86898b;
    text-align: center;
    line-height: 22px;
    margin-bottom: 47px;
  }
  .btns {
    text-align: center;
    button {
      border-radius: 51px;
      border: 1px solid #1b1b1b;
      font-size: 14px;
      color: #1b1b1b;
      letter-spacing: 0;
      text-align: center;
      background: white;
      height: 34px;
      line-height: 34px;
      padding: 0 12px;
    }
    button:nth-child(1) {
      margin-right: 30px;
    }
  }
}
</style>

