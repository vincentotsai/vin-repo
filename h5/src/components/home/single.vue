<template>
  <div class="content">
    <div class="goods" v-for="(item,index) in advert.advertList" :key="index" v-if="item.goodsObj.goodsStatus == '2'" @click="toDetail(item)">
      <div class="pic">
        <soldout-mask w="120px" h="120px" v-if="item.goodsObj.isSalable == 0"></soldout-mask>
        <x-img container=".v-scroller" :src="item.goodsObj.mainImage + imageSize()" :default-src="defaultLazyImg()" :offset="150"></x-img>
      </div>
      <div class="pull-right">
        <div class="title">
          <!-- 保税、直邮、秒杀 -->
          <span class="type-tag">
            <img class="baoshui" v-if="item.goodsObj.purchaseType == 1" src="../../assets/cart/image_bq_bs@2x.png">
            <img class="zhiyou" v-if="item.goodsObj.purchaseType == 2" src="../../assets/cart/image_bq_zy@2x.png">
            <img class="miaosha" v-if="item.goodsObj.sellType == 3" src="../../assets/cart/image_bq_ms@2x.png">
          </span>
          {{item.goodsObj.goodsName}}
        </div>
        <div class="sub-title" v-if="item.goodsObj.goodsTitle">{{item.goodsObj.goodsTitle}}</div>
        <div class="sub-title" v-else></div>
        <!-- 有秒杀活动 -->
        <div class="price" v-if="item.goodsObj.seckillPrice">
          <span class="activity" v-if="item.goodsObj.seckillPrice">¥{{ item.goodsObj.seckillPrice }}</span>
          <span class="origin">¥{{ item.goodsObj.goodsPrice }}</span>
        </div>
        <div class="price" v-else>
          <span class="activity">¥{{ item.goodsObj.goodsPrice }}</span>
        </div>
        <!-- 显示（一次最多显示一个）：新品>热销>推荐 -->
        <div class="tag">
          <img class="new" src="../../assets/goods-list/h5_icon_label_small_xinpin.png" v-if="item.goodsObj.isNew == '1'">
          <img class="hot" src="../../assets/goods-list/h5_icon_label_small_remai.png" v-if="item.goodsObj.isNew == '0' && item.goodsObj.isHot == '1'">
          <img class="rec" src="../../assets/goods-list/h5_icon_label_tuijie.png" v-if="item.goodsObj.isNew == '0' && item.goodsObj.isHot == '0' && item.goodsObj.isRecommend == '1'">
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'home-single-goods',
  props: {
    advert: Object
  },
  methods: {
    toDetail(item) {
      this.$root.$emit('toAdvertDetail', item, this.advert.advertPositionTypeId)
    }
  }
}
</script>
<style lang="less" scoped>
.content {
  background-color: #fafafa;
  .goods {
    width: 100%;
    height: 160px;
    overflow: hidden;
    background: #fff;
    margin-bottom: 1px;
    .pic {
      width: 120px;
      height: 120px;
      margin: 20px 12px;
      float: left;
      position: relative;
      > img {
        width: 100%;
        height: 100%;
      }
    }
    .pull-right {
      float: right;
      .title {
        max-width: 219px;
        margin-top: 24px;
        margin-bottom: 7px;
        font-family: PingFangSC-Semibold;
        font-size: 14px;
        color: #1b1b1b;
        line-height: 22px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        .type-tag {
          .baoshui,
          .zhiyou,
          .miaosha {
            position: relative;
            top: 4px;
            height: 18px;
            width: 36px;
            display: inline-block;
          }
        }
      }
      .sub-title {
        height: 26px;
        max-width: 219px;
        font-size: 12px;
        z-index: 1000;
        background: #fff;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      .price {
        width: 230px;
        font-size: 14px;
        height: 20px;
        vertical-align: bottom;
        margin-top: 4px;
        margin-bottom: 4px;
        .activity {
          font-family: PingFangSC-Semibold;
          font-size: 18px;
          color: #fc6655;
          letter-spacing: 0;
          margin-right: 5px;
          line-height: 14px;
        }
        .origin {
          font-family: PingFangSC-Regular;
          font-size: 13px;
          color: #86898b;
          line-height: 12px;
          text-decoration: line-through;
        }
      }
      .tag {
        line-height: 20px;
        position: relative;
        height: 20px;
        bottom: 10px;
        .new {
          height: 13px;
          width: 27px;
        }
        .hot {
          height: 13px;
          width: 27px;
        }
        .rec {
          height: 13px;
          width: 27px;
        }
      }
      .buy-btn {
        background: linear-gradient(-196deg, #ff8996 0%, #fc6655 100%);
        box-shadow: 0 4px 10px 0 rgba(255, 151, 69, 0.25);
        border-radius: 14px;
        width: 80px;
        max-width: 100px;
        text-align: center;
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #ffffff;
        letter-spacing: 0;
        line-height: 22px;
        position: relative;
        right: -138px;
        bottom: 2px;
        float: left;
      }
    }
  }
}
</style>
