<template>
  <div class="brand_swiper">
    <swiper ref="mySwiper" :options="swiperOpts" :not-next-tick="notNextTick">
      <swiper-slide v-for="(item, index) in brandList" :key="index">
        <img :src="item.brandImage+imageSize(240,136)" @error="setErrorImg($event,240,136)" @click="routeLink('brand_goods_list', {brandId: item.brandId}, {brandInfo: item})">
      </swiper-slide>
    </swiper>
  </div>
</template>
<script>
export default {
  name: 'brand-list',
  data() {
    return {
      swiperOpts: {
        initialSlide: window.getCookie('curBrandSlideIdx') || 0,
        slidesPerView: 'auto',
        centeredSlides: true,
        effect: 'coverflow',
        spaceBetween: 6
      },
      notNextTick: true
    }
  },
  props: {
    brandList: Array
  },
  // 不能用destroyed
  beforeDestroy() {
    if (this.$refs.mySwiper && this.$refs.mySwiper.swiper) {
      window.setCookie(
        'curBrandSlideIdx',
        this.$refs.mySwiper.swiper.activeIndex
      )
    }
  },
  methods: {
    routeLink(link, qry, param) {
      this.$router.push({
        name: link,
        query: qry,
        params: param
      })
    }
  }
}
</script>
<style lang="less" scoped>
.brand_swiper {
  background: #fff;
  .swiper-slide {
    width: 240px;
    height: 136px;
    margin-bottom: 32px;
    box-shadow: 0 8px 16px 0 rgba(148, 33, 73, 0.17);
    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
