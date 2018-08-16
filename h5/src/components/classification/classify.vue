<template>
  <div class="classify">
    <!-- 搜索 -->
    <section class="search" @click="routeLink('search')">
      <div class="bg"></div>
      <div class="title">
        <span>请输入商品名称</span>
      </div>
    </section>

    <section class="classify-content">
      <!-- 一级分类目录 -->
      <nav class="left-part">
        <div class="item" v-for="(item1, index1) in classifyList" :key="index1" :class="{'selected-font': item1.selected}" @click="switchLevel1(item1)">
          <span :class="{'selected-label': item1.selected}"></span>{{item1.scName}}
        </div>
      </nav>

      <nav ref="level2scroll" class="right-part" @scroll.stop="scrollHandler">
        <!-- mageStatus显示图片开关 1-显示 0-不显示 -->
        <div class="level2-header" v-if="currentLevel1Classify.mageStatus == 1">
          <img class="banner" v-if="currentLevel1Classify.scImage" :src="currentLevel1Classify.scImage+ imageSize(246,84)" @click="goFuture(currentLevel1Classify)" @error="setErrorImg($event,246,84)">
        </div>
        <!-- 二级/三级 分类目录 -->
        <div class="level2-content" :style="{'margin-top': !currentLevel1Classify.scImage ? '0' : ''}">
          <div class="level2-container" v-for="(item2, index2) in currentLevel1Classify.subScList" :key="index2">
            <div class="level2-classify">
              <span class="line"></span>
              <span class="txt">{{ item2.scName }}</span>
              <span class="line2"></span>
            </div>
            <div class="level3" v-for="(item3, index3) in item2.subScList" :key="index3" @click="goFuture(item3)">
              <img class="pic" :src="item3.scImage+'?imageslim'" @error="setErrorImg($event,72,72)">
              <span class="txt">{{item3.scName}}</span>
            </div>
          </div>
        </div>
      </nav>
    </section>

    <shortcut :opt="shortcutOpt"></shortcut>
  </div>
</template>
<script>
export default {
  name: 'classify',
  data() {
    return {
      classifyList: [], //包含一级、二级、三级分类数据
      currentLevel1Classify: {},
      shortcutOpt: {},
      level3list: [],
      selectedLevel2Name: '分类商品'
    }
  },
  created() {
    this.getClassifyData()
  },
  activated() {
    // 登录后查看是否有新消息
    if (window.getCookie('token')) {
      this.newMsgTip().then(res => {
        this.$set(this.shortcutOpt, 'msg', {
          show: true,
          unreadMsg: res
        })
      })
    }

    if (this.$refs.level2scroll) {
      this.$refs.level2scroll.scrollTop = sessionStorage.level2scrollH
    }
  },
  methods: {
    //获取展示分类列表(包括一级二级三级分类)
    getClassifyData() {
      let params = {
        dataVersion: this.dataVersion
      }
      this.$http.get('market/show_category_list.do', { params }).then(res => {
        let data = res.data
        this.classifyList = data.showCategoryList
        // 设置选中的一级分类
        this.setSelectedClassify()
      })
    },
    setSelectedClassify() {
      let sessionLevel1ClassifyId =
        sessionStorage.currentLevel1ClassifyId &&
        sessionStorage.currentLevel1ClassifyId != 'undefined'
          ? JSON.parse(sessionStorage.currentLevel1ClassifyId)
          : undefined

      if (sessionLevel1ClassifyId) {
        for (let i = 0; i < this.classifyList.length; i++) {
          const element = this.classifyList[i]
          if (element.scId === sessionLevel1ClassifyId) {
            element.selected = true
            this.currentLevel1Classify = element
            break
          } else {
            this.classifyList[0].selected = true
            this.currentLevel1Classify = this.classifyList[0]
            break
          }
        }
      } else if (this.classifyList && this.classifyList.length > 0) {
        this.classifyList[0].selected = true
        this.currentLevel1Classify = this.classifyList[0]
      }
    },
    routeLink(link, qry, param) {
      this.$router.push({
        name: link,
        params: param,
        query: qry
      })
    },
    scrollHandler(e) {
      sessionStorage.setItem(`level2scrollH`, e.target.scrollTop)
    },
    goFuture(item) {
      let type = null
      if (item && item.linkObj && item.linkObj.linkType) {
        type = item.linkObj.linkType
      } else {
        this.showToast('链接数据为空')
        return false
      }
      // Type跳转类型：0-非链接 1-商品链接 2-分类链接 3-品牌链接 4-外部链接 5-秒杀列表
      switch (type) {
        case 0:
          this.showToast('非链接')
          break
        case 1:
          if (!item.linkObj.linkObjectIdList) {
            this.showToast('链接数据为空')
            return false
          }
          if (item.linkObj.linkObjectIdList.length === 1) {
            this.$router.push({
              name: 'detail',
              query: { goods_id: item.linkObj.linkObjectIdList[0] }
            })
          } else if (item.linkObj.linkObjectIdList.length > 1) {
            // 不止一个ID则拿与linkObj同级的scId(展示分类ID	)去请求另一个接口
            this.$router.push({
              name: 'classified_goods_list',
              query: { scId: item.scId }
            })
          } else {
            return false
          }
          break
        case 2:
          this.setLevel3List(item)
          this.$router.push({
            name: 'classified_goods',
            query: {
              id: item.linkObj.linkObjectIdList.join(','),
              name: item.scName,
              from: 'classify'
            },
            params: {
              level3list: this.level3list,
              selectedLevel3Name: item.scName,
              selectedLevel2Name: this.selectedLevel2Name
            }
          })
          break
        case 3:
          this.$router.push({
            name: 'brand_goods_list',
            query: { brandId: item.linkObj.linkObjectIdList.join(',') }
          })
          break
        case 4:
          location.href = item.linkObj.linkAddress
          break
        case 5:
          // this.showToast('原生链接')
          this.$router.push({
            name: 'activity_list'
          })
          break
      }
    },
    setLevel3List(item) {
      if (item.scLevel == 1) {
        this.level3list = []
      } else if (item.scLevel == 3) {
        // 取二级分类列表
        for (let i = 0; i < this.classifyList.length; i++) {
          const level2list = this.classifyList[i].subScList
          for (let j = 0; j < level2list.length; j++) {
            const level3list = level2list[j].subScList
            if (item.parentId === level2list[j].scId) {
              this.level3list = level3list
              this.selectedLevel2Name = level2list[j].scName
              break
            }
          }
        }
      }
    },
    // 切换一级分类
    switchLevel1(item) {
      this.resetSelected()
      item.selected = true
      this.currentLevel1Classify = item
      this.$refs.level2scroll.scrollTop = 0
    },
    resetSelected() {
      for (let i = 0; i < this.classifyList.length; i++) {
        this.classifyList[i].selected = false
      }
    }
  },
  beforeDestroy() {
    sessionStorage.setItem(
      'currentLevel1ClassifyId',
      JSON.stringify(this.currentLevel1Classify.scId)
    )
  },
  deactivated() {
    sessionStorage.setItem(
      'currentLevel1ClassifyId',
      JSON.stringify(this.currentLevel1Classify.scId)
    )
  }
}
</script>
<style scoped lang="less">
.absolute {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
.classify {
  background: #fff;
  .search {
    position: relative;
    left: 0;
    top: 0;
    width: 100%;
    height: 46px;
    background-color: white;
    .bg {
      .absolute;
      width: 351px;
      height: 31px;
      margin: auto;
      background: #fafafa;
      border-radius: 100px;
      overflow: hidden;
    }
    .title {
      .absolute;
      width: 351px;
      height: 58px;
      margin: auto;
      line-height: 58px;
      padding-left: 23px;
      box-sizing: border-box;
    }
    .title > span {
      display: block;
      height: 58px;
      text-align: center;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #cbcbcb;
    }
    .title > span:before {
      display: inline-block;
      position: relative;
      content: '';
      width: 13px;
      height: 13px;
      top: 3px;
      right: 3px;
      background: url('../../assets/h5_icon_search_small.png') no-repeat;
      background-size: 12px;
    }
  }
  .classify-content {
    .absolute;
    top: 67px;
    box-sizing: border-box;
    .left-part {
      .absolute;
      padding-bottom: 48px;
      box-sizing: border-box;
      width: 104px;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      .item {
        position: relative;
        width: 86px;
        height: 28px;
        line-height: 28px;
        margin: auto;
        margin-bottom: 22px;
        text-align: center;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #86898b;
        letter-spacing: 0;
      }
      .selected-font {
        font-family: PingFangSC-Semibold;
        font-size: 14px;
        color: #1b1b1b;
        letter-spacing: 0;
      }
      .selected-label {
        width: 4px;
        height: 14px;
        float: left;
        margin-top: 6px;
        margin-left: -9px;
        background: linear-gradient(-217deg, #ff8996 0%, #ff6a9d 100%);
        border-radius: 15px;
      }
    }
    .right-part {
      .absolute;
      left: 104px;
      overflow-y: scroll;
      .level2-header {
        width: 246px;
        margin-left: 14px;
        .banner {
          width: 246px;
          height: 84px;
        }
      }
      .level2-content {
        padding-bottom: 49px;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        // display: flex;
        // align-items: flex-start;
        // flex-wrap: wrap;
        .level2-container {
          width: 100%;
          overflow: hidden;
        }
        .level2-classify {
          font-size: 14px;
          text-align: center;
          margin-top: 14px;
          margin-bottom: 20px;
          .line {
            border-top: 1px solid #1b1b1b;
            width: 14px;
            height: 3px;
            display: inline-block;
          }
          .txt {
            font-family: PingFangSC-Semibold;
            font-size: 14px;
            color: #1b1b1b;
            letter-spacing: 0;
          }
          .line2 {
            border-top: 1px solid #1b1b1b;
            width: 14px;
            height: 3px;
            display: inline-block;
          }
        }
        .level3 {
          float: left;
          text-align: center;
          width: 90px;
          margin-bottom: 26px;
          background-color: white;
          overflow: hidden;
          .pic {
            width: 60px;
            height: 60px;
            margin: 6px;
          }
          .txt {
            display: block;
            margin-top: 14px;
            line-height: 17px;
            font-family: PingFangSC-Semibold;
            font-size: 12px;
            color: #1b1b1b;
            letter-spacing: 0;
          }
        }
      }
    }
  }
}
</style>
