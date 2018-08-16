<template>
  <div>
    <swiper ref="mySwiper" :options="swiperOpts" :not-next-tick="notNextTick">
      <swiper-slide v-for="(item, index) in advert" :key="index">
        <img :src="item.foundBannerImg + imageSize()" @error="setErrorImg($event,351,198)" @click="toAdvertDetail(item)">
      </swiper-slide>
    </swiper>
  </div>
</template>
<script>
export default {
  name: 'discovery-banner',
  props: {
    advert: Array,
    channelId: Number
  },
  data() {
    return {
      swiperOpts: {
        slidesPerView: 'auto',
        initialSlide: window.getCookie('curHomeSlideIdxs')
          ? JSON.parse(window.getCookie('curHomeSlideIdxs'))[this.channelId]
          : 0,
        centeredSlides: true,
        paginationClickable: true,
        autoplayDisableOnInteraction: false, // 用户滑动swiper之后，是否禁止autoplay。默认为true即停止。
        spaceBetween: 5,
        // loop: true,
        speed: 500,
        autoplay: 4000
      },
      notNextTick: true //notNextTick是一个组件自有属性，如果notNextTick设置为true，组件则不会通过NextTick来实例化swiper，也就意味着你可以在第一时间获取到swiper对象.
    }
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.swiper
    }
  },
  beforeDestroy() {
    let curHomeSlideIdxs =
      JSON.parse(window.getCookie('curHomeSlideIdxs')) || {}
    curHomeSlideIdxs[this.channelId] = this.swiper.activeIndex
    if (this.swiper) {
      window.setCookie('curHomeSlideIdxs', JSON.stringify(curHomeSlideIdxs))
    }
  },
  methods: {
    toAdvertDetail(item) {
      console.log('item: ', item)
      if (item.foundBannerType == 1) {
        // 话题
        this.$router.push({
          name:'topicDetail',
          query: {
            topicId: item.topicId
          }
        })
      } else if (item.foundBannerType == 2) {
        // 外部链接
        if (item.linkAddress) {
          location.href = item.linkAddress
        }
      }
    }
  }
}
</script>
<style lang="less" scoped>
.swiper-slide {
  width: 93.6%;
  height: 198px;
  margin-top: 6px;
  margin-bottom: 22px;
  box-shadow: 0 10px 12px 0 rgba(148, 33, 73, 0.17);
}
img {
  width: 100%;
  height: 100%;
}
</style>
