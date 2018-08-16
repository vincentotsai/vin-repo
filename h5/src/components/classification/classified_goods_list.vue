<template>
  <!-- 供三级分类类型为商品且数量不止一个时使用 -->
  <div class="classified-goods">
    <scroller ref="classifiedGoodsList" v-if="goodsList.length > 0" @on-scroll-bottom="loadMore" :nomore="isMore == 0" :from="$route.name + '_' + $route.query.scId">
      <goods-list :goodsList="goodsList"></goods-list>
    </scroller>
  </div>
</template>
<script>
import goodsList from '@/components/common/goods_list'
export default {
  name: 'classified_goods_list',
  data() {
    return {
      scId: this.$route.query.scId,
      pageNum: 1,
      pageSize: 10,
      isMore: 0,
      goodsList: [],
      loadingFlag: false
    }
  },
  components: {
    goodsList
  },
  activated() {
    if (this.$refs.classifiedGoodsList) {
      let item = `${this.$route.name}_${this.$route.query.scId}_H`
      this.$refs.classifiedGoodsList.$el.scrollTop = sessionStorage.getItem(item)
    }
  },
  created() {
    this.$vux.loading.show({
      text: '加载中...'
    })
    this.fetchData()
  },
  methods: {
    fetchData() {
      let params = {
        scId: this.scId,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      this.loadingFlag = true
      this.$http.get('market/show_category_item_list.do', {params}).then(res => {
        let data = res.data
        this.$vux.loading.hide()
        this.isMore = data.isMore
        if (this.pageNum && this.pageNum > 1) {
          this.goodsList = this.goodsList.concat(data.showCategoryItemList)
        } else {
          this.goodsList = data.showCategoryItemList
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
.classified-goods {
  overflow-y: auto;
}
</style>
