<template>
  <div class="v-scroller" ref="scroller" :style="'height:' + height" @scroll.stop="scrollHandler">
    <slot></slot>
  </div>
</template>
<script>
  export default {
    name: 'scroller',
    props: {
      height: {
        type: String,
        default: '100%'
      },
      offsetBottom: {
        type: Number,
        default: 20
      },
      nomore:{
        type:Boolean,
        default: false
      },
      from: String //用于记录滚动位置
    },
    methods: {
      scrollHandler(e) {
        if (this.from) {
          sessionStorage.setItem(`${this.from}_H`, e.target.scrollTop)
        }

        if(!this.nomore && e.target.scrollTop + e.target.clientHeight + this.offsetBottom >= e.target.scrollHeight) {
          this.$emit('on-scroll-bottom')
          console.log("加载")
        }
      }
    }
  }

</script>
<style lang="less" scoped>
.v-scroller {
  overflow:auto;
  -webkit-overflow-scrolling: touch;
}
</style>

