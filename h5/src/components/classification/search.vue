<template>
  <article class="container">
    <section class="search-box">
      <div class="icon">
        <div class="clear-icon" v-show="clearInputIcon" @click="clear">
          <img src="../../assets/delete@2x.png">
        </div>
        <input ref="search-input" id="search-input" v-model="inputVal" @keydown="newInputing" @keyup.enter="doSearch" placeholder="请输入商品名称">
      </div>
      <span class="btn" v-if="inputVal" @click="doSearch">搜索</span>
      <span class="btn" v-else @click="$router.go(-1)">取消</span>
    </section>
    <!-- 历史记录 -->
    <section class="search-history" v-show="showSearchHistory">
      <div class="title">历史记录</div>
      <span class="clear-his" @click="clearHistory"></span>
      <div class="box">
        <span class="item" v-for="(item,index) in searchHistoryList" :key="index" @click="pageNum = 1;doSearch(inputVal = item)">{{item}}</span>
      </div>
    </section>
    <!-- 结果筛选 -->
    <!-- <div class="sort" v-show="!noContent">
      <sort @doSort="sort" :sortDirection="sortDirection"></sort>
    </div> -->
    <scroller ref="searchAlive" class="search-result" v-show="!noContent" @on-scroll-bottom="loadMore" :nomore="isMore == 0" :from="$route.name">
      <goods-list-s :goodsList="searchResult"></goods-list-s>
    </scroller>
    <!-- 搜索无果 -->
    <section class="no-content" v-show="initVis && noContent">
      <img class="pic" src="../../assets/empty/no-search.png">
      <p class="txt">搜索无结果</p>
    </section>
  </article>
</template>
<script>
import sort from '@/components/common/goods_list_sort'
import goodsListS from '@/components/common/goods_list_s'
export default {
  name: 'search',
  data() {
    return {
      pageNum: 1,
      pageSize: 10,
      sortDirection: 1,
      sortType: 1,
      inputVal: '', //搜索框的输入值
      clearInputIcon: false, //是否显示 清空搜索框 按钮
      showSearchHistory: true, //显示搜索历史
      searchHistoryList: [], //取搜索历史
      helpHistoryList: [],
      searchResult: [], //搜索返回的结果
      isMore: 0, //是否还有下一页
      initVis: false, //第一次进入页面不show搜索无果
      loadingFlag: false,
      noContent: true, //搜索无果
      fromType: ''
    }
  },
  components: {
    sort,
    goodsListS
  },
  activated() {
    if (!this.$refs.searchAlive) {
      return false
    }
    let item = `${this.$route.name}_H`
    this.$refs.searchAlive.$el.scrollTop = sessionStorage.getItem(item)
  },
  created() {
    this.fromType = this.$route.query.from;
    console.log("fromType",this.fromType)
    if(this.fromType == "help") {
      let _helpHistoryArr = JSON.parse(localStorage.getItem('helpHistory'))
      if( _helpHistoryArr && _helpHistoryArr.length > 0) {
        this.searchHistoryList = _helpHistoryArr;
      }
    }else {
      let _searchHistoryArr = JSON.parse(localStorage.getItem('sHistory'))
      if( _searchHistoryArr && _searchHistoryArr.length > 0) {
        this.searchHistoryList = _searchHistoryArr;
      }
    }
  },
  mounted() {
    this.$refs['search-input'].focus()
  },
  methods: {
    doSearch() {
      if (!this.inputVal.trim()) {
        this.showToast('请输入关键词~')
        return false
      } else {
        this.saveSearchHistory()
        let param = {
          params: {
            keyword: this.inputVal,
            pageNum: this.pageNum,
            pageSize: this.pageSize,
            sortDirection: this.sortDirection,
            sortType: this.sortType
          }
        }
        let url = ''
        if(this.fromType == "help") {
          url = 'goods/search_goods.do'
        }else {
          url = 'goods/search_goods.do'
        }
        this.loadingFlag = true;
        this.$http.get(url, param).then(res => {
          let data = res.data
          this.isMore = data.isMore
          this.initVis = true
          this.noContent = data.list.length === 0
          this.showSearchHistory = this.noContent ? true : false
          this.searchResult = this.searchResult.concat(data.list)
          this.loadingFlag = false
          if (this.pageNum == 1) {
            this.$nextTick(() => {
              this.$refs.searchAlive.$el.scrollTop = 0
            })
          }
          this.pageNum += 1
        })
      }
    },
    saveSearchHistory() {
      if (this.searchHistoryList.indexOf(this.inputVal) <= -1) {
        this.searchHistoryList.unshift(this.inputVal)
        if(this.fromType == "help") {
          localStorage.setItem('helpHistory', JSON.stringify(this.searchHistoryList))
        }else {
          localStorage.setItem('sHistory', JSON.stringify(this.searchHistoryList))
        }
      }
    },
    newInputing() {
      this.pageNum = 1
      this.showSearchHistory = true
      this.noContent = true
      this.initVis = false
    },
    initParam() {
      this.pageNum = 1
      this.pageSize = 10
      this.sortDirection = 1
      this.sortType = 1
      this.inputVal = ''
    },
    clear() {
      this.initParam()
      this.$refs['search-input'].focus()
      this.searchResult = []
      this.noContent = true
      this.initVis = false
      this.isMore = 1
      this.showSearchHistory = true
      sessionStorage.setItem('search_H', 0)
    },
    clearHistory() {
      this.searchHistoryList = []
      if(this.fromType == "help") {
        localStorage.removeItem('helpHistory')
      }else {
        localStorage.removeItem('sHistory')
      }
    },
    // sort(sortType, sortDirection) {
    //   this.pageNum = 1
    //   this.sortType = sortType
    //   if (sortDirection) {
    //     this.sortDirection = sortDirection
    //   }
    //   this.doSearch()
    // },
    loadMore() {
      if (this.loadingFlag) return false
      this.doSearch()
    },
    routeLink(base, param) {
      this.$router.push({
        name: base,
        query: param
      })
    }
  },
  watch: {
    inputVal() {
      if (this.inputVal) {
        this.clearInputIcon = true
      } else {
        this.clearInputIcon = false
      }
    }
  }
}
</script>
<style lang="less" scoped>
.container {
  font-size: 14px;
  background: #fff;
  box-sizing: border-box;
  .search-box {
    box-sizing: border-box;
    position: absolute;
    top: 0;
    height: 60px;
    line-height: 60px;
    padding: 0 12px;
    display: block;
    background: #fff;
    z-index: 1;
    width: 100%;
    .icon {
      display: inline-block;
      vertical-align: top;
      position: absolute;
      top: 0;

      .clear-icon {
        height: 30px;
        width: 30px;
        margin-top: 18px;
        position: absolute;
        right: 10px;
        z-index: 100;
        img {
          position: absolute;
          top: 8px;
          left: 8px;
          width: 12px;
          height: 12px;
          display: inline-block;
        }
      }
      #search-input {
        width: 307px;
        border-radius: 40px;
        padding: 7px 25px 7px 14px;
        color: #66676a;
        background: #fafafa;
      }
    }
    .btn {
      font-size: 14px;
      color: #fc6655;
      margin-top: 2px;
      padding-left: 10px;
      position: absolute;
      top: 0;
      right: 12px;
    }
  }
  .search-history {
    margin-top: 82px;
    .title {
      margin-top: 18px;
      margin-bottom: 24px;
      padding-left: 12px;
      font-family: PingFangSC-Semibold;
      font-size: 18px;
      color: #1b1b1b;
      line-height: 18px;
    }
    .clear-his {
      float: right;
      margin-right: 17px;
      margin-top: -37px;
      width: 12px;
      height: 13px;
      color: red;
      background: url('../../assets/goods-list/user_icon_sousuo_delete@3x.png')
        center/100%;
    }
    .box {
      padding: 0 12px;
      max-height: 165px;
      overflow-y: auto;
      .item {
        padding: 5px 12px;
        margin: 5px;
        background: #f8f8f8;
        border-radius: 100px;
        display: inline-block;
        text-align: center;
        font-family: PingFangSC-Semibold;
        font-size: 12px;
        color: #86898b;
        line-height: 11px;
      }
    }
  }
  .sort {
    position: absolute;
    z-index: 100;
    top: 80px;
    left: 0;
    width: 100%;
  }
  .search-result {
    height: 100%;
    overflow-y: auto;
    padding-top: 82px;
  }
  .no-content {
    margin: 100px 0;
    text-align: center;
    .pic {
      width: 169px;
      height: 123px;
    }
    .txt {
      margin-top: 26px;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #86898b;
      line-height: 14px;
    }
  }
}
</style>
