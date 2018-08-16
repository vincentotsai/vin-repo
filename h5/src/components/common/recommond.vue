<template>
  <!-- 热门推荐 -->
  <div class="recommend" v-if="goodsList && goodsList.length > 0">
    <p class="title-text">商品推荐</p>
    <ul>
      <li v-for="(item,index) in goodsList" :key="index" @click="toDetial(item)">
        <img class="goods-img" :src="item.coverImage+'?imageView2/1/w/300/h/300'" @error="setErrorImg($event)">
        <p class="goods-name">{{item.goodsName}}</p>
        <div class="labels">
          <img class="goods-lable" v-if="item.isHot" src="../../assets/user_icon_label_small_remai.png">
          <img class="goods-lable" v-if="item.isNew" src="../../assets/user_icon_label_small_xinpin.png">
          <!-- <img class="goods-lable cjms" v-if="item.sellType==3" src="../../assets/user_icon_label_small_chaojims.png"> -->
        </div>
        <div class="goods-price">{{item.goodsPrice}}</div>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: 'rec-goods',
  props: {
    goodsList: Array
  },
  methods: {
    toDetial(item) {
      this.$router.push({
        name: 'detail',
        query: {
          goods_id: item.goodsId
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.recommend {
  position: relative;
  background: white;
  .title-img {
    width: 100%;
  }
  .title-text {
    width: 100%;
    height: 64px;
    padding: 30px 0 0 12px;
    font-size: 18px;
    color: #1b1b1b;
    font-weight: bold;
    box-sizing: border-box;
    margin-bottom: 24px;
  }
  ul {
    padding: 0 12px;
    overflow: hidden;
    li {
      float: left;
      width: 166px;
      margin-right: 18px;
      box-sizing: border-box;
      overflow: hidden;
      padding-bottom: 31px;
      .goods-img {
        width: 166px;
        height: 166px;
        margin-bottom: 6px;
      }
      .goods-name {
        width: 100%;
        font-size: 14px;
        color: #1b1b1b;
        line-height: 16px;
        margin-bottom: 6px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
      }
      .labels {
        width: 100%;
        // height: 13px;
        overflow: hidden;
      }
      .goods-lable {
        display: block;
        float: left;
        width: 27px;
        height: 13px;
        margin-right: 2px;
      }
      .cjms {
        width: 43px;
      }
      .goods-price {
        width: 100%;
        font-size: 16px;
        color: #fc6655;
        line-height: 14px;
        margin-top: 6px;
      }
    }
    li:nth-of-type(even) {
      margin-right: 0;
    }
  }
}
</style>


