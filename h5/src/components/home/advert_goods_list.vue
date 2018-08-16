<template>
  <div class="ad-goods-list">
    <scroller ref="advertGoodsList" v-if="goodsList.length > 0" @on-scroll-bottom="loadMore" :nomore="isMore == 0" :from="$route.name + '_' + $route.query.advertId">
      <goods-list :goodsList="goodsList"></goods-list>
    </scroller>

    <div class="empty" v-if="emptyVis">
      <img class="pic" src="../../assets/empty/nogoods.png">
      <p class="txt">宝贝们还没上架哦~</p>
    </div>
  </div>
</template>
<script>
import goodsList from '@/components/common/goods_list'
export default {
  name: 'advert_goods_list',
  data() {
    return {
      advertId: this.$route.query.advertId,
      pageNum: 1,
      pageSize: 10,
      isMore: 0,
      goodsList: [],
      emptyVis: false,
      loadingFlag: false
    }
  },
  components: {
    goodsList
  },
  activated() {
    if (!this.$refs.advertGoodsList) {
      return false
    }
    let item = `${this.$route.name}_${this.$route.query.advertId}_H`
    this.$refs.advertGoodsList.$el.scrollTop = sessionStorage.getItem(item)
  },
  created() {
    this.$vux.loading.show({
      text: '加载中...'
    })
    this.fetchData()
  },
  methods: {
    // API->"获取广告项列表"
    fetchData(pageNum) {
      let param = {
        params: {
          advertId: this.$route.query.advertId,
          pageNum: pageNum || this.pageNum,
          pageSize: this.pageSize
        }
      }
      this.loadingFlag = true
      this.$http.get('market/advert_item_list.do', param).then(res => {
        let data = res.data
        this.$vux.loading.hide()
        this.isMore = data.isMore
        if (this.pageNum && this.pageNum > 1) {
          this.goodsList = this.goodsList.concat(data.advertItemList)
        } else {
          this.goodsList = data.advertItemList
        }
        if (this.goodsList.length === 0) {
          this.emptyVis = true
        }
        this.pageNum += 1
        this.loadingFlag = false
      })
    },
    loadMore() {
      if (this.loadingFlag) return false
      this.fetchData()
    }
  }
}
</script>
<style lang="less" scoped>
.ad-goods-list {
  overflow-y: hidden;
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
</style>
