<template>
  <div class="sort-opts">
    <span :class="{selected: currentSort === 1}" @click="sort(1)">综合</span>
    <span :class="{selected: currentSort === 2}" @click="sort(2)">上架量</span>
    <span :class="{selected: currentSort === 3}" v-if="sortDirection == 1" @click="sort(3,2)">价格<span class="icon1"></span></span>
    <span :class="{selected: currentSort === 3}" v-else @click="sort(3,1)">价格<span class="icon2"></span></span>
    <span :class="{selected: currentSort === 4}" @click="sort(4)">利润</span>
  </div>
</template>
<script>
export default {
  name: 'sort',
  props: {
    sortDirection: Number
  },
  data() {
    return {
      currentSort: 1 //默认‘综合’
    }
  },
  methods: {
    /**
     * @sortType 排序:1综合(默认) 2上架量 3价格 4利润降序
     * @sortDirection 升序降序:1降序(默认) 2升序
     */
    sort(sortType, sortDirection) {
      this.currentSort = sortType
      this.$emit('doSort', sortType, sortDirection)
    }
  }
}
</script>
<style lang="less" scoped>
.sort-opts {
  height: 48px;
  line-height: 48px;
  background: #fff;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #86898b;
  padding: 0 20px;
  display: flex;
  flex-direction: row;
  direction: ltr;
  justify-content: space-between;
  .icon1 {
    display: inline-block;
    width: 20px;
    height: 20px;
    background: center/60% url('../../assets/goods-list/user_icon_shuaxuan@3xx.png') no-repeat;
    position: relative;
    top: 5px;
  }
  .icon2 {
    display: inline-block;
    width: 20px;
    height: 20px;
    background: center/60% url('../../assets/goods-list/user_icon_shuaxuan@3x.png') no-repeat;
    position: relative;
    top: 5px;
  }
  .selected {
    font-family: PingFangSC-Semibold;
    color: #272729;
  }
}
</style>
