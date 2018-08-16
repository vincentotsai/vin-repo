<template>
  <div class="player-media" :class="{ 'show': showVideo }">
    <video ref="video" webkit-playsinline playsinline controls preload="auto" autoplay></video>
  </div>
</template>
<script>
  export default {
    name: 'player-media',
    data() {
      return {
        showVideo: false
      }
    },
    created() {
      window.audio = new Audio()
      document.addEventListener("WeixinJSBridgeReady", () => {
        window.video = this.$refs.video
        window.audio.load()
        window.video.load()
      }, false)
      this.$root.$on('video-show-or-hide', (v) => {
        this.showVideo = v
      })
    },
    mounted() {
      window.video = this.$refs.video
    }
  }

</script>
<style lang="less" scoped>
  .player-media {
    position: fixed;
    top: -211px;
    left: 0;
    width: 100%;
    height: 211px;
    &.show {
      top: 0;
      z-index: 100;
      >video {
        width: 100%;
        height: 100%;
      }
    }
    >video {
      width: 1px;
      height: 1px;
      background: #000;
    }
  }

</style>
