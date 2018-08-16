<template>
  <div class="discovery-warp">
    <scroller @on-scroll-bottom="loadMore" :nomore="isMore == 0" :from="$route.name" ref="discovery">
      <!-- topic banner -->
      <slide class="slide" ref="slide" v-if="topicBannerList.length" :advert="topicBannerList"></slide>
      <!-- topic 分类 -->
      <section class="classifies" v-if="classifyList.length">
        <div class="classify" v-for="(item, index) in classifyList" :key="index" @click="routeLink(item)">
          <img :src="item.topicCategoryImg" alt="">
        </div>
      </section>
      <!-- 发现首页推荐话题 -->
      <topic-list v-if="topicList.length" :topicList="topicList"></topic-list>
    </scroller>
  </div>
</template>
<script>
import slide from '@/components/discovery/compo_slide'
import topicList from '@/components/discovery/compo_topic_list'
import bus from '@/util/bus'

export default {
  name: 'discovery',
  components: {
    slide,
    topicList
  },
  data() {
    return {
      topicBannerList: [],
      classifyList: [], //话题分类列表
      pageNum: 1,
      pageSize: 15,
      topicList: [],
      likedTopicList: [],
      isMore: 1, //0无1有
      loadingFlag: false
    }
  },
  activated() {
    this.getBanner()
    this.getTopicClassfy()
    if (window.getCookie('token')) {
      this.getLikedTopicList()
    } else {
      this.getTopicList('0')
    }
    if (this.$refs.discovery) {
      this.$refs.discovery.$el.scrollTop = sessionStorage.getItem('discovery_H')
    }
  },
  methods: {
    getBanner() {
      let params = {
        dataVersion: this.dataVersion
      }
      this.$http.get('market/topic_banner_list.do', { params }).then(res => {
        this.topicBannerList = res.data.topicBannerList
      })
    },
    getTopicClassfy() {
      let params = {
        dataVersion: this.dataVersion
      }
      this.$http.get('market/topic_category_list.do', { params }).then(res => {
        this.classifyList = res.data.topicCategoryList
      })
    },
    getTopicList(userType) {
      let params = {
        dataVersion: this.dataVersion,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        userType: userType || (this.userData.shopId ? '2' : '1') //0未登录 1普通 2 vip
      }
      this.loadingFlag = true
      this.$http.get('market/topic_list.do', { params }).then(res => {
        if (res.data.topicList.length < this.pageSize) {
          this.isMore = 0
        }
        if (this.pageNum > 1) {
          this.topicList = this.topicList.concat(res.data.topicList)
        } else {
          this.topicList = res.data.topicList
        }
        this.loadingFlag = false
        this.matchLiked()
      })
    },
    getLikedTopicList() {
      let params = {
        userId: String(window.getCookie('parentId'))
      }
      this.$http.get('reportform/u_like_topic.do', { params }).then(res => {
        this.likedTopicList = res.data.topicList
        this.getTopicList()
      })
    },
    loadMore() {
      if (this.loadingFlag) return false
      this.pageNum += 1
      if (window.getCookie('token')) {
        this.getLikedTopicList()
      } else {
        this.getTopicList('0')
      }
    },
    matchLiked() {
      for (let i = 0; i < this.topicList.length; i++) {
        const topic = this.topicList[i]
        if (this.likedTopicList.indexOf(String(topic.topicId)) > -1) {
          this.topicList[i].liked = true
        }
      }
    },
    routeLink(item) {
      this.$router.push({
        name: 'topic_list',
        query: {
          topicCategoryId: item.topicCategoryId
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.slide {
  background: white;
}
.classifies {
  background: white;
  width: 100%;
  overflow: hidden;
  margin-bottom: 4px;
  .classify {
    width: 33.3%;
    height: 100%;
    float: left;
    img {
      margin-bottom: 10px;
      width: 100%;
    }
    p {
      text-align: center;
      font-family: PingFangSC-Regular;
      font-size: 11px;
      color: #1b1b1b;
      letter-spacing: 0;
      line-height: 11px;
    }
  }
}
</style>
