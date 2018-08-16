<template>
  <div>
    <div class="container" v-if="xsms">
      <div class="time" @click="route_link">
        <div class="pull-left">
          <img class="top-img" src="../../assets/home/xsms.png">
          <span class="small-title bold">限时秒杀</span>
        </div>
        <div class="pull-right">
          <span class="til" v-if="!timerData[0] && !yure">{{timeH}}点场</span>
          <span class="time-left" v-if="!yure">还剩</span>
          <span class="yure-text" v-if="yure">{{countDownText}}</span>
          <span class="timer-box" v-if="timerData[0] && !yure">{{timerData[0] | numDouble}}</span>
          <span class="fuhao" v-if="timerData[0] && !yure">天</span>
          <span class="timer-box">{{timerData[1] | numDouble}}</span>
          <span class="fuhao">:</span>
          <span class="timer-box">{{timerData[2] | numDouble}}</span>
          <span class="fuhao" v-if="!yure">:</span>
          <span class="timer-box" v-if="!yure">{{timerData[3] | numDouble}}</span>
          <span v-if="yure" class="yure-text">开抢</span>
        </div>
      </div>
      <swiper :options="swiperOpts">
        <swiper-slide v-for="(item,index) in goodsList" :key="index">
          <div @click="goto_detail(item)">
            <div class="pic-box">
              <img class="goods-photo" :src="item.coverImage" @error="setErrorImg($event,93,93)">
            </div>
            <div class="goods-price">
              <p class="activity-price bold">￥{{item.seckillPrice}}</p>
              <p class="origin-price">￥{{item.goodsPrice}}</p>
            </div>
          </div>
        </swiper-slide>
      </swiper>
    </div>
  </div>
</template>
<script>
import bus from "@/util/bus"
export default {
  name: 'timed-sale',
  data() {
    return {
      swiperOpts: {
        initialSlide: 0,
        slidesPerView: 'auto',
        spaceBetween: 7
      },
      xsms: null,
      goodsList: null,
      timeH: 0, //几点场
      timerData: [], //天、时、分、秒
      yure: false,
      countDownText: '' //明天、x月x日
    }
  },
  created() {
    this.getXsms()
  },
  destroyed() {
    clearInterval(this.countNumTimer)
  },
  methods: {
    //跳转商品详情
    goto_detail: function(item) {
      this.$router.push({
        name: 'detail',
        query: {
          goods_id: item.goodsId,
          sku_code: item.skuCode
        }
      })
    },
    //判断是昨天、今天、明天
    isToday(activeBeginTime) {
      var date = new Date(this.sysTime)
      var today = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      ).getTime() //今天凌晨
      var yestoday = new Date(today - 24 * 3600 * 1000).getTime() //昨天凌晨
      var tomorrow = new Date(today + 24 * 3600 * 1000).getTime() //明天凌晨
      var afterTomorrow = new Date(today + 48 * 3600 * 1000).getTime() //后天凌晨
      if (activeBeginTime < tomorrow && this.sysTime <= activeBeginTime) {
        this.countDownText = '' //今天预热
      } else if (
        activeBeginTime < afterTomorrow &&
        tomorrow <= activeBeginTime
      ) {
        this.countDownText = '明天' //明天预热
      } else if (activeBeginTime >= afterTomorrow) {
        //后天以及往后预热的活动
        this.countDownText =
          new Date(activeBeginTime).getMonth() +
          1 +
          '月' +
          new Date(activeBeginTime).getDate() +
          '日'
      }
    },
    //获取限时秒杀
    getXsms() {
      let param = {
        params: { dataVersion: this.dataVersion }
      }
      this.$http.get('order/showing_goods_promotion.do', param).then(res => {
        this.xsms = res.data.goodsPromotion
        if (this.xsms) {
          this.goodsList = this.xsms.goodsList

          // 通知首页有限时秒杀
          bus.$emit('hasXsms', true)

          //抢购倒计时
          let time = 0
          if (
            this.xsms.activeBeginTime <= this.sysTime &&
            this.sysTime <= this.xsms.activeEndTime
          ) {
            time = parseInt((this.xsms.activeEndTime - this.sysTime) / 1000)
            this.countNum(time)
          } else if (this.sysTime < this.xsms.activeBeginTime) {
            this.timerData[1] = new Date(this.xsms.activeBeginTime).getHours()
            this.timerData[2] = new Date(this.xsms.activeBeginTime).getMinutes()
            this.yure = true
            this.isToday(this.xsms.activeBeginTime)
          }
          this.timeH = new Date(this.xsms.activeBeginTime).getHours()
        }
      })
    },
    countNum(time) {
      if (this.countNumTimer) {
        clearInterval(this.countNumTimer)
      }
      this.countDown(time)
      this.countNumTimer = setInterval(() => {
        time = time - 1
        this.countDown(time)
        if (time <= 0) {
          clearInterval(this.countNumTimer)
          this.goodsList = []
          this.getXsms()
        }
      }, 1000)
    },
    //时间格式转换
    countDown(num) {
      this.timerData = new Date(num).formatStamp()
    },
    //路由跳转
    route_link: function(base, params) {
      this.$router.push({
        path: 'activity_list'
      })
    }
  }
}
</script>
<style lang="less" scoped>
.container {
  width: 375px;
  margin-bottom: 5px;
  .time {
    width: 100%;
    height: 40px;
    line-height: 25px;
    padding: 0 12px 0;
    box-sizing: border-box;
    color: #1b1b1b;
    .pull-left {
      float: left;
      .top-img {
        width: 18px;
        height: 18px;
        margin-bottom: -4px;
      }
      .small-title {
        font-size: 16px;
        left: -6px;
      }
    }
    .pull-right {
      float: right;
      .til {
        font-size: 16px;
      }
      .time-left {
        font-size: 13px;
        color: #cccccc;
        line-height: 16px;
      }
      .timer-box {
        display: inline-block;
        width: 31px;
        height: 25px;
        text-align: center;
        background: #1b1b1b;
        font-size: 18px;
        color: #ffffff;
      }
      .fuhao {
        font-size: 18px;
        margin: 0 -6px 0 -6px;
      }
      .yure-text {
        font-size: 14px;
      }
    }
  }
  .swiper-container {
    padding: 0 12px;
    height: 180px;
    .swiper-slide {
      width: 128px;
      .pic-box {
        width: 128px;
        height: 128px;
        box-sizing: border-box;
        padding: 17px;
        .goods-photo {
          width: 93px;
          height: 93px;
        }
      }
      .goods-price {
        width: 100%;
        text-align: center;
        line-height: 20px;
        .activity-price {
          font-size: 18px;
          color: #fc6655;
          margin-bottom: 2px;
        }
        .origin-price {
          font-size: 14px;
          color: #86898b;
          text-decoration: line-through;
        }
      }
    }
  }
}
</style>


