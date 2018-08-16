<template>
  <div>
    <ul class="navigation">
      <li v-for="(item,index) in advert.advertList" :key="index" @click="toAdvertDetail(item)">
        <img :src="item.advertImage" @error="setErrorImg($event,75,75)">
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: 'nav-ads',
  props: {
    advert: Object
  },
  methods: {
    toAdvertDetail(item) {
      this.$root.$emit('toAdvertDetail', item)
    }
  }
}
</script>
<style lang="less" scoped>
.navigation {
  font-size: 14px;
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  li {
    box-sizing: border-box;
    width: 75px;
    text-align: center;
    padding: 5px 0px 10px;
    img {
      width: 100%;
      // height: 100%;
    }
    .nav-ads-name {
      font-family: PingFangSC-Regular;
      font-size: 11px;
      color: #1b1b1b;
      letter-spacing: 0;
      line-height: 14px;
      margin-top: 11px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
    }
  }
}
</style>
