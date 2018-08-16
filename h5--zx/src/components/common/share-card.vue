<template>
  <x-dialog v-model="isShowShareCard" class="share-card" :hide-on-blur="true">
    <div style="height: 100%" @click="isShowShareCard = false">
      <div class="arrow">
        <img src="../../assets/pic_arrow_share.png">
      </div>
      <div class="guide-text">
        <span>分享链接：点击右上角</span>
        <span>“发送给朋友”或“分享到朋友圈”</span>
      </div>
      <img :src="shareUrl">
      <div class="bottom-text">分享图片：长按图片保存到手机</div>
    </div>
  </x-dialog>
</template>
<script>
  import {
    XDialog
  } from 'vux'

  export default {
    name: 'share-card',
    components: {
      XDialog
    },
    data() {
      return {
        isShowShareCard: false,
        shareUrl: ''
      }
    },
    created() {
      this.$root.$on('show-share-card', (url) => {
        this.shareUrl = `data:image/png;base64,${url}`
        this.isShowShareCard = true
      })
    },
    watch: {
      $route() {
        this.isShowShareCard = false
      }
    }
  }
</script>
<style lang="less">
  .share-card .weui-dialog {
    background-color: rgba(0, 0, 0, 0);
    height: 100%;
    width: 80%;
    .arrow {
      position: relative;
      overflow: hidden;
      >img {
        float: right;
        width: 80px;
        height: 68px;
      }
    }
    .guide-text {
      position: relative;
      top: -15px;
      font-size: 14px;
      color: #fff;
      line-height: 22px;
      text-align: left;
      >span {
        display: inline-block;
        width: 100%;
      }
    }
    .bottom-text {
      font-family: PingFangSC-Regular;
      text-align: center;
      font-size: 0.28rem;
      color: #FFFFFF;
      letter-spacing: 0;
      margin-top: 0.2rem;
    }
    img {
      display: block;
      height: 70%;
      width: 100%;
    }
  }
</style>
