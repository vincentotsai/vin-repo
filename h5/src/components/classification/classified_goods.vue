<template>
  <article class="classified-goods" :style="{'padding-top': selectedLevel2Name != '分类商品' && $route.query.from === 'classify' ? '51px' : ''}">
    <vux-scroller class="vux-1px-b" lock-y v-if="level3list.length && selectedLevel2Name != '分类商品' && $route.query.from === 'classify'" style="background: white;position: fixed;top:0;z-index:100;width:100%;">
      <section class="channels " ref="channels" :style="dynamicScrollWidth()">
        <div class="channel" v-for="(item, index) in level3list" :key="index" :class="{ 'selected' : item.scName == currentLevel3Classify.scName }" @click="switchLevel3Classify(item)">
          <span class="title">{{item.scName}}</span>
          <p :class="{'selected-label': item.scName == currentLevel3Classify.scName}"></p>
        </div>
      </section>
    </vux-scroller>

    <!-- <div class="sort">
        <sort @doSort="sort" :sortDirection="sortDirection"></sort>
      </div> -->

    <scroller ref="classifiedGoods" @on-scroll-bottom="loadMore" :nomore="isMore == 0" :from="$route.name + '_' + $route.query.id">
      <goods-list-s :goodsList="goodsList"></goods-list-s>
      <section class="empty" v-if="emptyVis">
        <img class="pic" src="../../assets/empty/nogoods.png">
        <p class="txt">宝贝还没上架哦~</p>
      </section>
    </scroller>

    <shortcut :opt="shortcutOpt"></shortcut>
  </article>
</template>
<script>
import { Scroller } from 'vux'
import sort from '@/components/common/goods_list_sort'
import goodsListS from '@/components/common/goods_list_s'
export default {
  name: 'classified_goods',
  data() {
    return {
      pageNum: 1,
      pageSize: 10,
      sortDirection: 1,
      sortType: 1,
      level3list: !this.$route.params.level3list
        ? []
        : this.$route.params.level3list ||
          JSON.parse(sessionStorage.getItem('level3list')),
      gcIds: this.$route.query.id, //三级分类ID
      currentLevel3Classify: {
        scName: !this.$route.params.selectedLevel3Name
          ? ''
          : this.$route.params.selectedLevel3Name ||
            JSON.parse(sessionStorage.currentLevel3Classify).scName
      }, //当前的三级分类
      selectedLevel2Name: !this.$route.params.selectedLevel2Name
        ? '分类'
        : this.$route.params.selectedLevel2Name ||
          sessionStorage.getItem('selectedLevel2Name'),
      goodsList: [], // 三级分类数据
      isMore: 0, //goodsList是否还有更多：0没 1有
      shortcutOpt: {},
      emptyVis: false,
      loadingFlag: false,
      totalTabsWidth: 0 //总分类tabs宽
    }
  },
  components: {
    vuxScroller: Scroller,
    sort,
    goodsListS
  },
  activated() {
    if (this.$refs.classifiedGoods) {
      let item = `${this.$route.name}_${this.$route.query.id}_H`
      this.$refs.classifiedGoods.$el.scrollTop = sessionStorage.getItem(item)
    }
  },
  created() {
    this.setTitle(this.selectedLevel2Name)
    sessionStorage.setItem('level3list', JSON.stringify(this.level3list))
    sessionStorage.setItem(
      'currentLevel3Classify',
      JSON.stringify(this.currentLevel3Classify)
    )
    this.$vux.loading.show({
      text: '加载中...'
    })

    this.getGoodsList()

    this.shortcutOpt = {
      search: {
        show: true
      },
      cart: {
        show: true
      }
    }
  },
  methods: {
    //获取 商品列表
    getGoodsList() {
      let params = {
        gcIds: this.gcIds,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        sortDirection: this.sortDirection,
        sortType: this.sortType
      }
      this.loadingFlag = true
      this.$http.get('goods/get_category_goods.do', { params }).then(res => {
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

        this.$nextTick(() => {
          this.tabCenter()
        })
      })
    },
    tabCenter() {
      let activedDom = document.getElementsByClassName('selected')[0]
      if (activedDom) {
        let activeOffsetLeft = activedDom.offsetLeft
        let scrollLeft =
          activeOffsetLeft - window.innerWidth / 2 + activedDom.clientWidth / 2
        // 靠最左和最右的不位移
        if (scrollLeft <= 0) {
          scrollLeft = 0
        } else if (scrollLeft > this.totalTabsWidth - window.innerWidth) {
          scrollLeft = this.totalTabsWidth - window.innerWidth
        }
        let transformStyle = {
          transitionDuration: '600ms',
          transitionTimingFunction: 'cubic-bezier(0.1, 0.57, 0.1, 1)',
          transform: `translate(-${scrollLeft}px)`
        }
        Object.assign(this.$refs.channels.style, transformStyle)
      }
    },
    loadMore() {
      if (this.loadingFlag) return false
      this.getGoodsList()
    },
    initData() {
      this.pageNum = 1
      this.goodsList = []
      this.emptyVis = false
    },
    beforeDestroy() {
      sessionStorage.setItem('selectedLevel2Name', this.selectedLevel2Name)
    },
    switchLevel3Classify(item) {
      // 方案一：不push新页面
      // this.resetProp(this.level3list, 'selected', true)
      // this.initData()
      // this.currentLevel3Classify = item
      // sessionStorage.setItem('currentLevel3Classify', JSON.stringify(item))
      // this.gcIds = item.linkObj.linkObjectIdList.join(',')
      // this.getGoodsList()

      // 方案二：重新建立此页面，会留在历史记录中(原因：发现要传的ID在后台配得存在一样的情况)
      this.$router.push({
        name: 'classified_goods',
        query: {
          id: item.linkObj.linkObjectIdList.join(','),
          scname: item.scName,
          from: 'classify'
        },
        params: {
          level3list: this.level3list,
          selectedLevel3Name: item.scName,
          selectedLevel2Name: this.selectedLevel2Name
        }
      })
    },
    sort(sortType, sortDirection) {
      this.pageNum = 1
      this.sortType = sortType
      if (sortDirection) {
        this.sortDirection = sortDirection
      }
      this.getGoodsList()
    },
    // 动态调整三级分类水平滚动宽度
    dynamicScrollWidth() {
      if (!this.level3list.length) {
        return false
      }
      let length = 0
      this.level3list.forEach(function(ele) {
        length += ele.scName.length
      })

      this.totalTabsWidth = this.level3list.length * 20 + length * 15
      return {
        // this.level3list.length * 20中20是左右padding各10，length*15中15是字号
        // width: this.level3list.length * 20 + length * 15 + 'px'
        // + 0.4是个px2rem适配临时调整值
        width: (this.level3list.length * 20 + length * 15) / 37.5 + 0.4 + 'rem'
      }
    }
  }
}
</script>
<style scoped lang="less">
.classified-goods {
  background: #fafafa;
  .channels {
    top: 0;
    position: relative;
    font-size: 15px;
    display: flex;
    background: white;
    z-index: 100;
    height: 51px;
    text-align: center;
    .channel {
      font-family: PingFangSC-Regular;
      text-align: center;
      padding: 0 10px;
      color: #86898b;
      height: 51px;
      .title {
        line-height: 50px;
      }
    }
    .selected {
      font-family: PingFangSC-Semibold;
      color: #fc6655;
      font-weight: bold;
    }
    .selected-label {
      margin: 0 auto;
      width: 8px;
      height: 2px;
      position: relative;
      bottom: 14px;
      background: linear-gradient(-217deg, #ff8996 0%, #ff6a9d 100%);
      border-radius: 15px;
    }
  }
  .sort {
    position: absolute;
    top: 0;
    z-index: 100;
    width: 100%;
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
}
</style>
