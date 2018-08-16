<template>
  <div>
    <ul class="title">
      <li v-for="(item,index) in advert.advertList" :key="index" @click="toAdvertDetail(item)">
        <img :src="item.advertImage + imageSize()" @error="setErrorImg($event,351,173)">
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: 'title_ad',
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
.title {
  width: 100%;
  background: white;
  li {
    box-sizing: border-box;
    width: 100%;
    height: 106px;
    text-align: center;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
