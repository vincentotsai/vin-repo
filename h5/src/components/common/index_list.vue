<template>
  <div class="index-list">
    <ul class="index-list-wrap" ref="indexWrap" @scroll="onListWrapScroll">
      <li v-for="(group,index) in data" :key="index" class="index-group" ref="indexGroup">
        <h3 class="index-group-title">{{group.index}}</h3>
        <ul>
          <li @click="clickItem(item)" v-for="(item,index) in group.list" :key="index" class="index-group-item">
            <span class="name">{{item.desc}}</span>
            <span class="code">{{item.code}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="index-nav">
      <ul>
        <li v-for="(item,index) in indexList" :key="index" @touchstart.prevent="_onTouchStartIndex(index)" :data-index="index" class="nav-item" :class="{'active':currentIndex===index}">{{item}}</li>
      </ul>
    </div>
    <transition name="fade">
      <div class="index-indicator" v-show="moving">{{currentIndicator}}</div>
    </transition>
  </div>
</template>
 <script type="text/javascript">
const INDICATOR_INDURATION = 1000
const TITLE_HEIGHT = 30
export default {
  name: 'index-list',
  props: {
    data: {
      type: Array,
      default: []
    },
  },
  data() {
    return {
      currentIndex: 0,
      moving: false,
      currentIndicator: ''
    }
  },
  watch: {
    currentIndex(newVal) {
      clearTimeout(this.timer)
      this.currentIndicator = this.indexList[this.currentIndex]
      this.moving = true
      this.timer = setTimeout(() => {
        this.moving = false
      }, INDICATOR_INDURATION)
    }
  },
  computed: {
    indexList() {
      return this.data.map((group) => {
        return group.index
      })
    }
  },
  created() {
    this.listHeight = []
    this.timer = null
    this.scrollTimer = null
  },
  mounted() {
    setTimeout(() => {
      this._calculateHeight()
    }, 20)
  },
  methods: {
    _calculateHeight() {
      this.listHeight = []
      const list = this.$refs.indexGroup
      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < list.length; i++) {
        let item = list[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
    },
    _onTouchStartIndex(index) {
      this.currentIndex = index
      this.$refs.indexWrap.scrollTop = this.listHeight[index]
    },
    clickItem(item) {
      this.$emit('choose', item)
    },
    onListWrapScroll(e) {
      clearTimeout(this.scrollTimer)
      this.scrollTimer = setTimeout(() => {
        let scrollTop = this.$refs.indexWrap.scrollTop
        const listHeight = this.listHeight
        for (let i = 0; i < listHeight.length - 1; i++) {
          if (scrollTop <= (listHeight[i + 1] - TITLE_HEIGHT) && scrollTop >= listHeight[i]) {
            this.currentIndex = i
            return
          }
        }
      }, 20)
    }
  },
  destroyed() {
    clearTimeout(this.timer)
    clearTimeout(this.scrollTimer)
  }
}
</script>

<style lang="less" scoped>
  .index-list{
    position:relative;
    width:100%;
    height:100%;
    background:#FFF;
    .index-list-wrap{
      height:100%;
      overflow:auto;
    }
    .index-group{
      padding-bottom:30px;
    }
    .index-group-title{
       height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: 12px;
      background: #FFF;
    }
    .index-group-item{
      display:flex;
      align-items:center;
      padding:20px 0 0 30px;
      list-style:none;
      justify-content: space-between;
      .avatar{
        width:50px;
        height:50px;
        border-radius:50%;
      }
      .name{
        font-size: 14px;
      }
      .code{
        float: right;
        margin-right: 34px;
      }
    }
    .index-nav{
      position:absolute;
      right:0;
      top:50%;
      z-index:100;
      width:20px;
      padding:20px 0;
      text-align:center;
      border-radius:10;
      background: #fafaff;
      transform:translateY(-50%);
      .nav-item{
        padding:3px;
        font-size:12px;
        list-style:none;
      }
    }
    .index-indicator{
      position:absolute;
      width:50px;
      height:50px;
      top:50%;
      left:50%;
      transform:translate(-50%,-50%);
      text-align:center;
      line-height:50px;
      background:rgba(0,0,0,0.2);
      font-size:22px;
      border-radius:5px;
      pointer-events:none;
    }
  }
  .fade-leave-active{
    transition: opacity .5s;
   }
  .fade-enter, .fade-leave-to{
    opacity: 0;
  }
</style>