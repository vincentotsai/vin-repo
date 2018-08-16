<template>
  <div class="goods-price" :class="fontClass">
    <span class="price1" :style="{color: isSeckill ? 'white' : ''}">￥</span>
    <span class="price2" :style="{color: isSeckill ? 'white' : ''}">{{priceArr[0]}}</span>
    <span class="price1" :style="{color: isSeckill ? 'white' : ''}">.{{priceArr[1]}}</span>
    <span v-if="oldPrice!=0" class="price4" :style="{color: isSeckill ? 'white' : ''}">￥{{oldPrice}}</span>

  </div>
</template>
<script>
export default {
  props: {
    isSeckill: Boolean,
    price: String,
    oldPrice: String,
    fontClass:String
  },
  data() {
    return {
      priceArr: []
    };
  },
  created() {
    this.priceArr = this.returnFloat(this.price);
    // console.log(this.priceArr)
  },
  watch: {
    price: function(val, oldVal) {
      // console.log('>>>>>>>>>>>',val)
      this.priceArr = this.returnFloat(val);
    }
  },
  methods: {
    returnFloat(value) {
      var value = Math.round(parseFloat(value) * 100) / 100;
      var xsd = value.toString().split(".");
      // console.log(xsd)
      if (xsd.length == 1) {
        value = value.toString() + ".00";
        return value.toString().split(".");
      }
      if (xsd.length > 1) {
        if (xsd[1].length < 2) {
          value = value.toString() + "0";
        }
        return value.toString().split(".");
      }
    }
  }
};
</script>
<style lang="less" scoped>
.goods-price {
  overflow: hidden;
  width: 100%;
  .price1 {
    color: #fc6655;
  }
  .price2 {
    color: #fc6655;
  }
  .price4 {
    color: #86898b;
    text-decoration: line-through;
  }
}
.size24{
  .price1 {
    font-size: 14px;
  }
  .price2 {
    font-size: 20px;
  }
  .price4 {
    font-size: 11px;
    margin-left: 8px;
  }
}
.size36{
  .price1 {
    font-size: 20px;
  }
  .price2 {
    font-size: 36px;
  }
  .price4 {
    font-size: 13px;
    margin-left: 8px;
  }
}
</style>


