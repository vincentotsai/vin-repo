<template>
  <div class="v-scroller" ref="scroller" :style="'height:' + height" @scroll.stop="scrollHandler">
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: 'scroller',
  props: {
    num: [Number, String],
    height: {
      type: String,
      default: '100%'
    },
    fetch: {
      type: Function,
      default: () => {}
    },
    listName: {
      type: String,
      default: ''
    },
    positionName: {
      type: String,
      default: 'position'
    },
    list: {
      type: Array,
      default: null
    },
    size: {
      type: Number,
      default: 10
    },
    offsetBottom: {
      type: Number,
      default: 20
    }
  },
  data() {
    return {
      noMore: false
    }
  },
  mounted() {
    console.log('this.positionName->>>', typeof this.positionName)
  },
  methods: {
    onScrollBottom() {
      if (!this.noMore) {
        let position = this.list[this.list.length - 1][this.positionName]
        this.fetch(position).then(res => {
          let list = res.data[this.listName]
          if (list.length < this.size) {
            this.noMore = true
          }
          this.$emit('on-fetch-data', res)
        })
      }
    },
    scrollHandler(e) {
      if (
        this.list &&
        e.target.scrollTop + e.target.clientHeight + this.offsetBottom >=
          e.target.scrollHeight
      ) {
        this.onScrollBottom()
        // this.$emit('on-scroll-bottom')
      }
    }
  }
}
</script>
<style lang="less" scoped>
.v-scroller {
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}
</style>

