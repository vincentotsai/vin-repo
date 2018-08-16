<template>
    <div>
        <div id="wrap">
            <img id="pic" src="../../assets/h5_icon_null_tuikuichaoshi.png">
            <div id="tips">抱歉～支付失败</div>
            <div id="btn-wrap">
                <router-link class="btn" :to="{ name: 'home', query: { type: 0,subtype:0}}">返回首页</router-link>
            	<div class="btn btn_pay" v-on:touchstart="back">重新支付</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      price: '',
      order_num: '',
      order_id: '',
      goods_id: ''
    }
  },
  methods: {
    //点击返回到首页
    back: function() {
      let from_url = document.referrer
      window.location.href = from_url + '&is_payfail=1'
    }
  },
  created: function() {
    this.setTitle('支付失败')
    this.price = this.$route.query.price
    this.order_num = this.$route.query.order_num
    this.order_id = this.$route.query.order_id
  }
}
</script>


<style scoped lang="less">
@import '../../styles/index.less';
#wrap {
  height: 100%;
  background: #f5f8fb;
  .px2rem(padding-top, 20);
  overflow: hidden;
}
#tips {
  font-size: 14px;
  color: #cecece;
  text-align: center;
  .px2rem(margin-top, 24);
}
#pic {
  .pxrem(height, 123);
  .pxrem(width, 169);
  margin: 0 auto;
  .pxrem(margin-top, 149);
  display: block;
}
.btn {
  background: #f5fbff;
  display: inline-block;
  .pxrem(height, 37);
  .pxrem(width, 120);
  .pxrem(line-height, 37);
  text-align: center;
  margin: 15% auto 0 auto;
  border: 1px solid #272728;
  border-radius: 100px;
  font-size: 14px;
  color: #272728;
  .pxrem(margin-top, 47);
}
.btn_pay {
  background: #ff6532;
  border: 1px solid #ff6532;
  color: #fff;
  .pxrem(margin-left, 25);
}
#btn-wrap {
  width: 100%;
  text-align: center;
}
</style>
