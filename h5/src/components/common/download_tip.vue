<template>
  <div class="download_tip" v-if="showTips">
   <img @click="showTips=false" class="close-icon" src="../../assets/h5_icon_tishi_close.png" alt="">
   <img class="logo-pic" src="../../assets/h5_icon_tishi_logo.png" alt="">
   <div @click="routeLink" class="go-down-btn">前往下载</div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      showTips: true
    }
  },
  methods: {
    routeLink() {
    }
  }
}
</script>
<style lang="less" scoped>
.download_tip {
  width: 100%;
  height: 46px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  background: #232325;
  overflow: hidden;
  .close-icon {
    display: block;
    float: left;
    width: 12px;
    height: 12px;
    margin: 17px 16px 0 10px;
  }
  .logo-pic {
    display: block;
    float: left;
    width: 158px;
    height: 32px;
    margin-top: 7px;
  }
  .go-down-btn {
    width: 105px;
    height: 100%;
    background: #fc6655;
    line-height: 46px;
    font-size: 14px;
    color: #ffffff;
    text-align: center;
    float: right;
  }
}
</style>

