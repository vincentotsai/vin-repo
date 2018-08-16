<template>
  <div class="topics" :style="{'padding-bottom': $route.name === 'discovery' ? '48px' : '0px'}">
    <div class="topic" v-for="(item,index) in topicList" :key="index">
      <div class="header">
        <div class="pic"><img :src="item.topicPublishUser.userAvatar" alt=""></div>
        <div class="info">
          <p class="name">{{item.topicPublishUser.userNickname}}</p>
          <p class="time">{{item.publishTime | dateFormat('yyyy-MM-dd hh:mm')}}</p>
        </div>
      </div>

      <div class="content" @click="toTopicDetail(item)">
        <div class="title">
          <p>{{item.topicTitle}}</p>
        </div>
        <div class="pic">
          <x-img container=".v-scroller" :src="item.topicCover + imageSize()" :default-src="defaultLazyImg()" :offset="150"></x-img>
        </div>
      </div>
      <div class="footer">
        <div class="category" v-if="$route.name !== 'topic_list'" @click="toTopicList(item)">#{{item.topicCategoryDesc}}#</div>
        <div class="dianzan">
          <div class="test1" v-if="item.liked">
            <img class="icon" src="../../assets/discovery/icon_dianzan_pre@2x.png"> {{item.likeCount | countFormat}}
          </div>
          <div class="test2" v-else @click="doDianzan(item,index,0)">
            <img class="icon" v-if="!item.liked" src="../../assets/discovery/icon_dianzan@2x.png">
            <img class="icon" v-else src="../../assets/discovery/icon_dianzan_pre@2x.png"> {{item.likeCount | countFormat}}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'topic-list',
  props: {
    topicList: Array
  },
  methods: {
    toTopicList(item) {
      this.$router.push({
        name: 'topic_list',
        query: {
          topicCategoryId: item.topicCategoryId
        }
      })
    },
    doDianzan(item, index, type) {
      if (!this.isAuthorized()) {
        this.$router.push({
          path: '/entry',
          query: { redirect: this.$route.fullPath }
        })
        return false
      }

      let params = {
        clickType: 2, //日志类型 0公共 1店铺访客 2话题 3未定义
        opType: type, //操作类型 0点赞 1转发
        topicId: item.topicId
      }
      this.$http.get('reportform/u_log.do', { params }).then(res => {
        if (type === 0) {
          this.topicList[index].likeCount += 1
          this.topicList[index].liked = true
        } else {
          this.topicList[index].shareCount += 1
        }
      })
    },
    toTopicDetail(item) {
      this.$router.push({
        name: 'topicDetail',
        query: {
          topicId: item.topicId,
          liked: item.liked
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.topics {
  overflow-x: hidden;
  overflow-y: auto;
  .topic {
    background: white;
    margin-bottom: 5px;
    padding: 20px 12px 23px;
    .header {
      margin-bottom: 14px;
      /* 清浮动*/
      overflow: hidden;
      zoom: 1; /*兼容 IE*/
      .pic {
        float: left;
        width: 40px;
        height: 40px;
        img {
          border-radius: 50%;
          width: 100%;
          height: 100%;
        }
      }
      .info {
        float: left;
        margin-left: 12px;
        max-width: 295px;
        .name {
          font-size: 14px;
          color: #1b1b1b;
          line-height: 16px;
          margin-bottom: 9px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
        }
        .time {
          color: #ccc;
          font-size: 12px;
          line-height: 12px;
        }
      }
    }
    .content {
      margin-bottom: 21px;
      .title {
        margin-bottom: 15px;
        font-size: 14px;
        color: #86898b;
        line-height: 24px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      .pic {
        width: 100%;
        height: 198px;
        img {
          height: 100%;
          width: 100%;
        }
      }
    }
    .footer {
      overflow: hidden;
      .category {
        float: left;
        font-size: 12px;
        color: #fc6655;
        letter-spacing: 0;
        line-height: 27px;
      }
      .zhuanfa {
        float: right;
        font-size: 12px;
        color: #a0a4a6;
        letter-spacing: 0;
        line-height: 27px;
        margin-right: 26px;
        .icon {
          position: relative;
          top: 2px;
          width: 16px;
          height: 14px;
        }
      }
      .dianzan {
        float: right;
        font-size: 12px;
        color: #a0a4a6;
        letter-spacing: 0;
        line-height: 27px;
        .icon {
          position: relative;
          top: 2px;
          width: 16px;
          height: 14px;
        }
      }
    }
  }
}
</style>
