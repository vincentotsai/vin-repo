<template>
  <div>
    <div>
      <div class="item1">
        <img :src="advert.advertList[0].advertImage + imageSize()" @error="setErrorImg($event,173,140)" @click="toAdvertDetail(advert.advertList[0])">
      </div>
      <div class="item2">
        <img :src="advert.advertList[1].advertImage + imageSize()" @error="setErrorImg($event,173,140)" @click="toAdvertDetail(advert.advertList[1])">
      </div>
    </div>
    <div class="item3">
      <img :src="advert.advertList[2].advertImage + imageSize()" @error="setErrorImg($event,173,285)" @click="toAdvertDetail(advert.advertList[2])">
    </div>
    <div class="pull-right">
      <div class="item4">
        <img :src="advert.advertList[3].advertImage + imageSize()" @error="setErrorImg($event,173,140)" @click="toAdvertDetail(advert.advertList[3])">
      </div>
      <div class="item5">
        <img :src="advert.advertList[4].advertImage + imageSize()" @error="setErrorImg($event,173,140)" @click="toAdvertDetail(advert.advertList[4])">
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'grid5',
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
.item1 {
  float: left;
  height: 140px;
  width: 173px;
  margin-bottom: 5px;
  img {
    height: 100%;
    width: 100%;
  }
}
.item2 {
  float: right;
  height: 140px;
  width: 173px;
  margin-left: 5px;
  margin-bottom: 5px;
  img {
    height: 100%;
    width: 100%;
  }
}
.item3 {
  float: left;
  height: 285px;
  width: 173px;
  img {
    height: 100%;
    width: 100%;
  }
}
.pull-right {
  width: 173px;
  margin-left: 5px;
  float: right;
  .item4 {
    display: block;
    height: 140px;
    width: 173px;
    margin-bottom: 5px;
    img {
      height: 100%;
      width: 100%;
    }
  }
  .item5 {
    display: block;
    height: 140px;
    width: 173px;
    img {
      height: 100%;
      width: 100%;
    }
  }
}
</style>
