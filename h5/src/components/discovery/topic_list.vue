<template>
  <div>
    <scroller v-if="!empty" ref="classifyList" @on-scroll-bottom="loadMore" :nomore="isMore == 0" :from="$route.name+'_'+$route.query.topicCategoryId">
      <topic-list :topicList="topicList"></topic-list>
    </scroller>
    <div class="empty" v-else>
      <img src="../../assets/empty/refundlist.png" alt="">
      <p>暂无话题列表~</p>
    </div>
  </div>
</template>
<script>
import topicList from '@/components/discovery/compo_topic_list'
export default {
  name: 'classify-topic-list',
  components: {
    topicList
  },
  data() {
    return {
      pageNum: 1,
      pageSize: 15,
      topicCategoryId: this.$route.query.topicCategoryId,
      topicList: [],
      likedTopicList: [],
      isMore: null,
      loadingFlag: false,
      empty: false
    }
  },
  activated() {
    if (window.getCookie('token')) {
      this.getLikedTopicList()
    } else {
      this.getList('0')
    }
    if (this.$refs.classifyList) {
      let item = `${this.$route.name}_${this.$route.query.topicCategoryId}_H`
      this.$refs.classifyList.$el.scrollTop = sessionStorage.getItem(item)
    }
  },
  methods: {
    getList(userType) {
      let params = {
        dataVersion: this.dataVersion,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        topicCategoryId: this.topicCategoryId,
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

        if (this.topicList.length === 0) {
          this.empty = true
        }
        this.loadingFlag = false
        this.matchLiked()
      })
    },
    loadMore() {
      if (this.loadingFlag) return false
      this.pageNum += 1
      if (window.getCookie('token')) {
        this.getLikedTopicList()
      } else {
        this.getList('0')
      }
    },
    getLikedTopicList() {
      let params = {
        userId: String(window.getCookie('parentId'))
      }
      this.$http.get('reportform/u_like_topic.do', { params }).then(res => {
        this.likedTopicList = res.data.topicList
        this.getList()
      })
    },
    matchLiked() {
      for (let i = 0; i < this.topicList.length; i++) {
        const topic = this.topicList[i]
        if (this.likedTopicList.indexOf(String(topic.topicId)) > -1) {
          this.topicList[i].liked = true
        }
      }
    }
  }
}
</script>
<style lang="less" scoped>
.empty {
  background: white;
  margin: 0;
  padding: 0 auto;
  text-align: center;
  img {
    width: 50%;
  }
  p {
    font-size: 14px;
    color: #a0a4a6;
    padding-bottom: 20px;
  }
}
</style>
