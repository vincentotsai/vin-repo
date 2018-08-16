<template>
    <div class="container">
      <!-- vue实现输入内容时，会在下拉菜单中显示查询的结果 -->
      <div class="search-top">
        <div class="search-box">
          <img class="search-icon" src="../../assets/h5_icon_search_small.png" />
          <div class="clear-icon" v-show="inputVal" @click="clear">
            <img src="../../assets/delete@2x.png">
          </div>
          <input class="search-input" ref="input" v-model.trim="inputVal" @keyup="inputKeyWord" @keyup.enter="inputKeyWord" placeholder="搜一搜">
        </div>
        <div class="search-btn" v-if="inputVal" @click="inputKeyWord">搜索</div>
        <div class="search-btn" v-else @click="$router.go(-1)">取消</div>
      </div>
      <scroller ref="searchAlive" class="search-list" v-show="searchList.length > 0" @on-scroll-bottom="loadMore" :nomore="isMore == 0" :from="$route.name">
        <div class="search-list-item" v-for="(item,index) in searchList" :key="index" @click="toQueDetail(item)">
          {{item.questionTitle}}
        </div>
      </scroller>
      <!-- 搜索无果 -->
      <section class="no-content" v-show="noContent">
        <img class="pic" src="../../assets/empty/no-search.png">
        <p class="txt">搜索无结果</p>
      </section>
    </div>
</template>

<script>
export default {
  data() {
      return {
        inputVal: '',
        searchList: [],
        pageNum: 1,
        pageSize: 13,
        loadingFlag: false,
        isMore: 0, //是否还有下一页
        noContent: false, //搜索无果
      }
  },
  created: function() {
    this.setTitle('搜索问题')
  },
  mounted() {
    this.$refs['input'].focus()
  },
  // computed: {
  //   //是否显示 清空搜索框 按钮
  //   clearInputIcon() {
  //     return this.inputVal.length;
  //   }
  // },
  methods: {
    toQueDetail(item) {
        //问题列表点击统计
        var params = {
            clickType: 0,
            questionId: item.questionId,
        }
        this.$http.get('reportform/log.do', { params: params }).then(res => {})
        location.href = item.questionContent;
    },
    doSearch(pageNum) {
      if(this.inputVal) {
        //请求相关列表
        var params = {
          keyWords: this.inputVal,
          pageNum: pageNum,
          pageSize: this.pageSize,
        }
        this.loadingFlag = true;
        this.$http.get('uc/get_question_list_by_condition.do', { params: params }).then(res => {
          this.loadingFlag = false;
          let data = res.data
          this.isMore = data.isMore
          this.noContent = data.list.length === 0;
          this.searchList = this.searchList.concat(data.list);
          if (this.pageNum == 1) {
            this.$nextTick(() => {
              this.$refs.searchAlive.$el.scrollTop = 0
            })
          }
          this.pageNum += 1;
        })
      } else {
        this.searchList = []; 
        this.noContent = false;
      }
    },
    loadMore() {
      if(!this.loadingFlag) {
        this.doSearch(this.pageNum)
      }
    },
    inputKeyWord(e) {
      // console.log(this.inputVal)
      this.pageNum = 1;
      this.searchList = [];
      this.doSearch(1)
    },
    clear() {
      this.inputVal = '';
      this.$refs['input'].focus();
      this.pageNum = 1;
      this.searchList = [];
    }
  }
}
</script>
<style lang="less" scoped>
@import '../../styles/index.less';
.container {
  height: 100%;
  .search-top {
    background: #fff;
    padding: 8px 12px;
    overflow: hidden;
    position: absolute;
    top: 0;
  }
  .search-box {
    width: 310px;
    height: 30px;
    position: relative;
    float: left;
  }
  .clear-icon {
    height: 30px;
    width: 30px;
    position: absolute;
    right: 0;
    z-index: 100;
    img {
      position: absolute;
      top: 9px;
      left: 9px;
      width: 12px;
      height: 12px;
    }
  }
  .search-icon {
    position: absolute;
    top: 9px;
    left: 14px;
    width: 12px;
    height: 12px;
  }
  .search-input {
    width: 310px;
    height: 30px;
    background: #FAFAFA;
    border-radius: 100px;
    padding: 0 30px 0 31px;
    font-size: 13px;
    color: #1B1B1B;
  }
  .search-btn {
    float: left;
    margin-left: 12px;
    font-family: PingFangSC-Semibold;
    font-size: 14px;
    color: #FC6655;
    line-height: 30px;
  }
  input::-webkit-input-placeholder { 
    color: #CCCCCC;
  } 
  input:-moz-placeholder { 
    color: #CCCCCC;
  } 
  input::-moz-placeholder { 
    color: #CCCCCC;
  } 
  input:-ms-input-placeholder { 
    color: #CCCCCC;
  }
  .search-list {
    padding-top: 46px;
    background-color: #fff;
    .search-list-item {
      height: 50px;
      line-height: 50px;
      font-size: 14px;
      color: #1B1B1B;
      border-bottom: 1px solid hsla(0,0%,92%,.5);
      margin: 0 12px;
    }
  } 
  .no-content {
    padding: 100px 0;
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
