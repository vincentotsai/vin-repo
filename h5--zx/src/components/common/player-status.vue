<template>
  <div class="player-status" v-show="isShow" @click="backToPlay">
    <img src="../../assets/ic_playing.gif">
    <span>播放</span>
  </div>
</template>
<script>
export default {
  name: 'player-status',
  data() {
    return {
      isShow: false,
      id: null
    }
  },
  methods: {
    backToPlay() {
      this.$router.push({
        name: 'play',
        params: {
          id: this.id
        }
      })
    }
  },
  created() {
    this.$root.$on('show-playing', id => {
      this.isShow = true
      this.id = id
      window.audio.onended = () => {
        this.isShow = false
      }
      window.video.onended = () => {
        this.isShow = false
      }
    })
    this.$root.$on('hide-playing', id => {
      this.isShow = false
    })
  },
  watch: {
    $route(r) {
      if (r.name == 'play' || r.name == 'seriesPlay') {
        this.isShow = false
      }
    }
  }
}
</script>
<style lang="less" scoped>
.player-status {
  position: absolute;
  top: 30px;
  left: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  padding: 5px;

  opacity: 0.7;
  background: #171717;
  border-radius: 0 20px 20px 0;
  > img {
    margin-right: 5px;
    display: block;
    width: 11px;
    height: 9px;
  }
  > span {
    display: block;
    font-size: 12px;
    color: #ffffff;
    line-height: 13px;
  }
}
</style>
