<template>
  <div class="brand-goods-list">
    <scroller ref="brandGoodsList" @on-scroll-bottom="loadMore" :nomore="isMore == 0" :from="$route.name + '_' + $route.query.brandId">
      <!-- 品牌信息 -->
      <header class="shop" v-if="brandInfo">
        <img class="bg" v-if="brandInfo.brandImage+imageSize(375,147)" :src="brandInfo.brandImage" @error="setErrorImg($event,375,147)">
        <img class="bg" v-else src="../../assets/top_moren_bj@2x.png">
        <img class="owner" v-if="brandInfo.brandLogo" :src="brandInfo.brandLogo" @error="setErrorImgTouxiang($event,45,45)">
        <img class="owner" v-else src="../../assets/h5_icon_avtor_moren.png">
        <p class="name" v-text="brandInfo.brandName"></p>
        <p class="desc" v-html="brandInfo.remark"></p>
      </header>
      <section v-if="goodsList.length > 0">
        <!-- 排序 -->
        <!-- <sort ref="sort" :class="sortBarFixed === true ? 'sort-fixed' : '' " @doSort="sort" :sortDirection="sortDirection"></sort> -->
        <!-- <div class="replace-sort" v-if="replaceSort"></div> -->
        <!-- 品牌下的商品列表 -->
        <div class="goods-list">
          <goods-list-s :goodsList="goodsList"></goods-list-s>
        </div>
      </section>
      <section class="empty" v-if="emptyVis">
        <img class="pic" src="../../assets/empty/nogoods.png">
        <p class="txt">宝贝还没上架哦~</p>
      </section>
    </scroller>
  </div>
</template>
<script>
// import sort from '@/components/common/goods_list_sort'
import goodsListS from '@/components/common/goods_list_s'
export default {
  name: 'brand-goods-list',
  data() {
    return {
      pageNum: 1,
      pageSize: 20,
      sortDirection: 1,
      sortType: 1,
      brandId: this.$route.query.brandId, //品牌ID
      brandInfo: this.$route.params.brandInfo || { brandName: '品牌' }, //品牌信息,为了设置title初始从父级页面带过来
      goodsList: [],
      isMore: 0,
      sortBarFixed: false,
      replaceSort: false, //吸顶防抖动占位符
      emptyVis: false,
      loadingFlag: false
    }
  },
  components: {
    // sort,
    goodsListS
  },
  activated() {
    if (!this.$refs.brandGoodsList) {
      return false
    }
    let item = `${this.$route.name}_${this.$route.query.brandId}_H`
    this.$refs.brandGoodsList.$el.scrollTop = sessionStorage.getItem(item)
  },
  created() {
    this.setTitle(this.brandInfo.brandName)
    this.$vux.loading.show({
      text: '加载中...'
    })
    this.getBrandInfo()
    this.getGoodsList()
  },
  methods: {
    getBrandInfo() {
      let param = {
        params: {
          brandId: Number(this.brandId)
        }
      }
      this.$http.get('goods/get_brand_by_id.do', param).then(res => {
        let data = res.data
        this.brandInfo = data.brand
      })
    },
    getGoodsList() {
      let param = {
        params: {
          brandIds: String(this.brandId),
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          sortType: this.sortType,
          sortDirection: this.sortDirection
        }
      }
      this.loadingFlag = true
      this.$http.get('goods/get_brand_goods.do', param).then(res => {
        let data = res.data
        this.$vux.loading.hide()
        this.isMore = data.isMore
        if (this.pageNum && this.pageNum > 1) {
          this.goodsList = this.goodsList.concat(data.list)
        } else {
          this.goodsList = data.list
        }
        if (this.goodsList.length === 0) {
          this.emptyVis = true
        }
        this.pageNum += 1
        this.loadingFlag = false
      })
    },
    handleScroll() {
      let scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop

      let offsetTop = this.$refs.sort.$el.offsetTop
      if (scrollTop > offsetTop) {
        this.sortBarFixed = true
        this.replaceSort = true
      } else {
        this.sortBarFixed = false
        this.replaceSort = false
      }
    },
    loadMore() {
      if (this.loadingFlag) return false
      this.getGoodsList()
    },
    sort(sortType, sortDirection) {
      this.pageNum = 1
      this.sortType = sortType
      if (sortDirection) {
        this.sortDirection = sortDirection
      }
      this.getGoodsList()
    }
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll)
  }
}
</script>
<style scoped lang="less">
.brand-goods-list {
  background: #fafafa;
  .shop {
    background: #fff;
    .bg {
      width: 375px;
      height: 147px;
      display: block;
    }
    .owner {
      width: 55px;
      height: 55px;
      border-radius: 50%;
      position: relative;
      top: -27.5px;
      left: 165px;
    }
    .name {
      font-family: PingFangSC-Semibold;
      font-size: 16px;
      color: #1b1b1b;
      line-height: 18px;
      text-align: center;
      margin-top: -20px;
    }
    .desc {
      font-family: PingFangSC-Regular;
      font-size: 12px;
      color: #959595;
      line-height: 16px;
      text-align: left;
      margin-top: 6px;
      margin-bottom: 5px;
      padding: 0 12px 15px;
    }
  }
  .goods-list {
    overflow: auto;
    background-color: #f5f8fb;
  }
  .empty {
    text-align: center;
    padding: 50px 0;
    .pic {
      height: 144px;
      width: 216px;
    }
    .txt {
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #86898b;
      line-height: 14px;
    }
  }
  .sort-fixed {
    position: fixed;
    top: 0;
    z-index: 999;
    width: 100%;
  }
  .replace-sort {
    height: 48px;
    background: #fff;
  }
}
</style>
