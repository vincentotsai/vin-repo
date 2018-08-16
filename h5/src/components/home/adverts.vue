<template>
  <div>
    <!-- ad标题图片 -->
    <div class="grid-title" v-if="advert.useTitle == 1"><img v-if="advert.titleImage" :src="advert.titleImage + imageSize()"></div>

    <!-- advertPositionTypeId 广告位类型ID: 1-宫格 2-商品 3-标题 4-幻灯片 5-导航 -->
    <!-- 火爆单品 -->
    <single class="single" v-if="advert.advertPositionTypeId == 2 && advert.advertList && advert.advertList.length > 0" :advert="advert"></single>
    <!-- 标题广告位 -->
    <title-ad v-if="advert.advertPositionTypeId == 3 && advert.advertList && advert.advertList.length > 0" :advert="advert"></title-ad>

    <!-- advertPositionStructId	广告位结构ID: 广告位类型为宫格时才有效，1-三宫格 2-四宫格 3-五宫格 4-六宫格 -->
    <!-- 三宫格 -->
    <grid3 class="grid3" v-if="advert.advertPositionTypeId == 1 && advert.advertPositionStructId == 1 && advert.advertList && advert.advertList.length === 3" :advert="advert"></grid3>
    <!-- 四宫格 -->
    <grid4 class="grid4" v-if="advert.advertPositionTypeId == 1 && advert.advertPositionStructId == 2 && advert.advertList && advert.advertList.length === 4" :advert="advert"></grid4>
    <!-- 五宫格 -->
    <grid5 class="grid5" v-if="advert.advertPositionTypeId == 1 && advert.advertPositionStructId == 3 && advert.advertList && advert.advertList.length === 5" :advert="advert"></grid5>
    <!-- 六宫格 -->
    <grid6 class="grid6" v-if="advert.advertPositionTypeId == 1 && advert.advertPositionStructId == 4 && advert.advertList && advert.advertList.length === 6" :advert="advert"></grid6>
  </div>
</template>
<script>
import single from './single'
import titleAd from './title_ad'
import grid3 from './grid3'
import grid4 from './grid4'
import grid5 from './grid5'
import grid6 from './grid6'
export default {
  components: {
    single,
    titleAd,
    grid3,
    grid4,
    grid5,
    grid6
  },
  props: {
    advert: Object
  }
}
</script>
<style lang="less" scoped>
.single {
  // padding: 0 12px;
}
.grid-title {
  margin-bottom: 5px;
  width: 100%;
  img {
    width: 100%;
    display:block;
  }
}
.grid3,
.grid4,
.grid5,
.grid6 {
  padding: 0 12px;
  padding-bottom: 5px;
  width: 100%;
  overflow: hidden;
}
</style>

