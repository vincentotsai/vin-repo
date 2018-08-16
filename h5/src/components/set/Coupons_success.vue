<template>
  <div class="view">
    <div class="coupons_view">
      <div id="coupons-wrap">
        <img src="../../assets/h5_icon_jiantou.png" class="img-tips">
        <div class="result-tips">恭喜您领取成功</div>
        <div class="result-desc">
          <p class="coupons_money">
            <span>￥</span>20.00</p>
          <p class="coupons_font">购物币领取成功，可在我的购物币页面查看</p>
        </div>
        <div class="go-now" @touchend="gonow()">查看我的购物币</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  created() {
    this.setTitle('领取成功')
  },
  methods: {
    gonow() {
      this.$router.replace({ name: 'coupons' })
    }
  }
}
</script>

<!-- 底部菜单组件css样式 -->
<style scoped lang="less">
@import '../../styles/index.less';
@import '../../styles/coupons.less';
.view {
  background: #f5f8fb;
  bottom: 0;
}
.coupons_view {
  background: #1b1a1f;
  bottom: 0;
  width: 100%;
  height: 100%;
}
#coupons-wrap .go-now {
  .px2rem(margin-top, 169);
}
#coupons-wrap .img-tips {
  .pxrem(width, 59);
  .pxrem(height, 37);
  border-radius: 0;
  margin: 0 auto;
  display: block;
}
.go-now {
  border: 1px solid #272728;
  border-radius: 30px;
  color: #272728;
}
.coupons_money {
  color: #ff6532;
}
</style>
