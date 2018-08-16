
<template>
  <div class="sold-out" :style="{width:w,height:h}">
    <!-- <div class="txt"></div> -->
    <!-- <div class="txt">-已抢光-</div> -->
    <img src="../../assets/empty/icon_yiqiangguang@2x.png" :style="{width: imgWidth ? imgWidth : ''}" alt="">
  </div>
</template>
<script>
export default {
  name: 'soldout-mask',
  props: {
    w: String, //宽
    h: String, //高
    imgWidth: String, //内部img宽
  }
}
</script>
<style lang="less" scoped>
.sold-out {
  position: absolute;
  opacity: 0.6;
  background: #000000;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: PingFangSC-Semibold;
  font-size: 16px;
  color: #fff;
  letter-spacing: 0;
  line-height: 14px;
  .txt {
    width: 100%;
    height: 100%;
    border: 1px solid #fff;
    padding: 4px 12px;
    font-family: PingFangSC-Semibold;
    font-size: 10px;
    color: #ffffff;
    letter-spacing: 0;
    line-height: 14px;
    background: url('../../assets/empty/icon_yiqiangguang@2x.png') no-repeat
      center/100%;
  }
  img {
    width: 33%;
  }
}
</style>



