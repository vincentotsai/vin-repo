<template>
  <div>
    <img id="backtop" v-show="true" v-on:click="backTop" src="../assets/h5_home_tanchu_fanhui.png" width="100%" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      speed: 0.5,
      show: false
    }
  },
  methods: {
    showBack(e) {
      if (e.target.scrollTop > window.screen.height) {
        this.show = true
      } else {
        this.show = false
      }
    },
    backTop() {
      let vm = this
      let element = document.getElementsByClassName('home-content')[0]
      let top = element.scrollTop
      let timer = setInterval(function() {
        top -= Math.abs(top * vm.speed)
        if (top <= 1) {
          top = 0
          clearInterval(timer)
        }
        element.scrollTop = top
      }, 20)
    }
  }
}
</script>

<style scoped lang="less">
@import '../styles/index.less';
#backtop {
  .pxrem(width,38);
  .pxrem(height,38);
  position: fixed;
  z-index: 999;
  .pxrem(bottom, 61);
  .pxrem(right, 8);
}
</style>
