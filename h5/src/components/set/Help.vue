<template>
  <div class="container" @scroll.stop="scrollHandler" ref="container">
      <div class="self-service">
        <div class="service-title">自助服务</div>
        <ul class="navigation">
            <li v-for="(item,index) in serviceList" :key="index" class="order-util" @click="toJump({ name: item.pathName })">
                <img class="order-icon" :src="item.img" />
                <span>{{item.text}}</span>
            </li>
        </ul>
      </div>
      <div class="help-center" ref="helpCenter">
        <div class="top">
            <div class="title">帮助中心</div>
            <div class="search" @click="toJump({ name: 'question_search'})">
                <img class="search-icon" src="../../assets/h5_icon_search_small.png" />
                搜一搜
            </div>
        </div>
      </div>
      <vux-scroller lock-y class="help-scroller" ref="helpScroller" :class="{'stickyTab': !isAndroid}" v-if="questionTypeGroup.length > 0">
        <div class="question-types" ref="quesGroups" :style="dynamicChannelWidth()">
        <div class="question-type-box" v-for="(item, index) in questionTypeGroup" :key="index" @click="switchQueType(index)">
            <div class="question-type" :ref="'quesGroup'+ index"  :class="{ 'selected bold' : index === currentIndex }">
                <p>{{item.groupName}}</p>
                <p :class="{'selected-label': index === currentIndex }"></p>
          </div>
        </div>
        </div>
      </vux-scroller>
      <div class="help-scroller-place" v-if="placeIsShow"></div>
      <scroller ref="searchAlive" class="question-list" v-show="questionList.length > 0" @on-scroll-bottom="loadMore" :nomore="isMore == 0"  height="614px" :from="$route.name">
        <div v-for="(item,index) in questionList" :key="index" class="cell-wrapper" @click="toQueDetail(item)" >
            <div class="cell">
                <span>{{item.questionTitle}}</span>
                <img src="../../assets/icon_gengduo@2x.png" class="arrow-right" alt="">
            </div>
        </div>
      </scroller>
      <div class="empty-question" v-show="questionList.length <= 0">
        <img class="pic" src="../../assets/empty/no-msg.png">
        <div class="txt">没有问题可以查看</div>
      </div>
  </div>
</template>

<script>
import { Scroller } from 'vux'
export default {
  components: {
    vuxScroller: Scroller,
  },
  data() {
    return {
       serviceList: [
           {
               img: require("../../assets/icon_thysh@2x.png"),
               text: '退换/售后',
               pathName: 'after'
           },
           {
               img: require("../../assets/icon_zxkf@2x.png"),
               text: '在线客服',
               pathName: 'onlineService'
           },
           {
               img: require("../../assets/icon_fkyjy@2x.png"),
               text: '反馈与建议',
               pathName: 'feedback'
           },
           {
               img: require("../../assets/icon_yhzn@2x.png"),
               text: '用户指南',
               pathName: 'user_guide'
           }
       ],
       questionTypeGroup: [],
       currentIndex: 0,
       questionList: [],
       pageNum: 1,
       pageSize: 13,
       helpScroller: '',
       helpScrollerTop: 0,
       loadingFlag: false,
       isMore: 0, //是否还有下一页
       placeIsShow: false,
       totalLen: 0
    }
  },
  created: function() {
    this.setTitle('客服与帮助')
    this.getQuestionTypeGroup()
  },
  mounted() {
      var helpCenterHei = this.$refs.helpCenter.offsetHeight;
      var helpCenterTop = this.$refs.helpCenter.offsetTop;
      this.helpScrollerTop = helpCenterHei + helpCenterTop;
  },
  methods: {
    scrollHandler(e) {
        // console.log("e.target.scrollTop",e.target.scrollTop)
        if(e.target.scrollTop >= this.helpScrollerTop) {
            if(this.isAndroid) {
                this.helpScroller.$el.style.position = 'fixed';
                this.helpScroller.$el.style.top = '0';
                this.helpScroller.$el.style.zIndex = '999';
                this.placeIsShow = true;
            } else {
            // 非安卓用css sticky
            }
            this.$refs.searchAlive.$el.style.overflow = 'auto';
        }else {
            this.helpScroller.$el.style.position = '';
            this.placeIsShow = false;
            this.$refs.searchAlive.$el.style.overflow = 'hidden';
        }
    },
    toQueDetail(item) {
        //问题列表点击统计
        var params = {
            clickType: 0,
            questionId: item.questionId,
        }
        this.$http.get('reportform/log.do', { params: params }).then(res => {})
        location.href = item.questionContent;
    },
    getQuestionTypeGroup() {
        this.$http.get('uc/get_question_groups.do').then(res => {
            // console.log("questionTypeGroup",res.data)
            this.questionTypeGroup = res.data.list;
            this.getQuestionList(this.questionTypeGroup[0].groupId)
            this.$nextTick(() => {
                this.helpScroller = this.$refs.helpScroller;
                console.log("helpScroller",this.helpScroller)
            })
        })
    },
    getQuestionList(groupId) {
        var params = {
            groupId: groupId,
            pageNum: this.pageNum,
            pageSize: this.pageSize
        }
        this.loadingFlag = true;
        this.$http.get('uc/get_question_list.do', { params: params }).then(res => {
            console.log("question_list",res.data.list)
            this.loadingFlag = false;
            let data = res.data
            this.isMore = data.isMore
            if(this.pageNum == 1) {
                this.questionList = [];
            }
            this.questionList = this.questionList.concat(data.list);
            this.pageNum += 1;
            this.$nextTick(() => {
                this.tabCenter()
            })
        })
    },
    tabCenter() {
        let quesGroupNode = this.$refs['quesGroup'+ this.currentIndex][0]
        let quesGroupLeft = quesGroupNode.offsetLeft;
        let translateLeft = quesGroupLeft - window.innerWidth / 2 + quesGroupNode.clientWidth / 2;
        if (translateLeft < 0) {
          translateLeft = 0
        } else if (translateLeft > this.totalLen - window.innerWidth) {
          translateLeft = this.totalLen - window.innerWidth
        }
        let transformStyle = {
          transitionDuration: '600ms',
          transitionTimingFunction: 'cubic-bezier(0.1, 0.57, 0.1, 1)',
          transform: `translateX(-${translateLeft}px)`
        }
        Object.assign(this.$refs.quesGroups.style, transformStyle)
    },
    loadMore() {
      if(!this.loadingFlag) {
        this.getQuestionList(this.questionTypeGroup[this.currentIndex].groupId)
      }
    },
    switchQueType(index) {
        this.currentIndex = index;
        this.pageNum = 1;
        this.getQuestionList(this.questionTypeGroup[this.currentIndex].groupId)
    },
    toJump(obj){
      if( obj.name == 'onlineService') {
          location.href = "https://kefu.easemob.com/webim/im.html?configId=09358c3e-c46f-40d4-87da-5d065a02efd2"
      } else if(obj.name == 'user_guide') {
          location.href= "http://web.suibianbuy.cn/htms/help.html"
      } else {
          this.$router.push(obj);
      }
    },
    routeLink(name, query, param) {
      this.$router.push({
        name: name,
        params: param,
        query: query
      })
    },
    // 动态调整channel水平滚动宽度
    dynamicChannelWidth() {
      let length = 0
      this.questionTypeGroup.forEach(function(ele) {
        length += ele.groupName.length
      })
      let tempLen = this.questionTypeGroup.length * 24 + length * 14;
      console.log('tempLen',tempLen)
      this.totalLen = tempLen > 375 ? tempLen : 375;
      let mobileTotalLen = this.totalLen / 37.5 + 'rem'
      // this.tabCenter()
      return {
        // this.channelList.length * 20中20是左右padding各10，length*15中15是字号
        // width: (this.channelList.length * 20 + length * 15) + 'px'
        // + 0.4是个px2rem适配临时调整值
        width: mobileTotalLen
      }
    },
  }
}
</script>
<style scoped lang="less">
@import '../../styles/index.less';
.container {
    height: 100%;
    overflow: auto;
    position: relative;
    .self-service {
        padding:30px 12px;
        background-color: #fff;
    }
    .service-title {
        font-family: PingFangSC-Semibold;
        font-size: 16px;
        color: #1B1B1B;
        font-weight: bold;
    }
    .navigation {
        overflow: hidden;
        padding-left: 5px;
    }
    .order-util {
        float: left;
        margin-right: 39px;
        padding-top: 24px;
        // width: 65px;
        font-family: PingFangSC-Medium;
        font-size: 12px;
        color: #86898B;
        letter-spacing: 0;
        line-height: 12px;
        text-align: center;
        position: relative;
    }
    .order-util:nth-of-type(4n) {
        margin-right: 0;
    }
    .order-icon {
        width: 42px;
        height: 42px;
        clear: both;
        display: block;
        margin: 0 auto;
        margin-bottom: 5px;
    } 
    .help-center {
        margin-top: 5px;
        padding: 22px 12px 3px;
        background: #fff;
    }
    .top {
        width: 100%;
        overflow: hidden;
    }
    .title {
        float: left;
        font-family: PingFangSC-Semibold;
        font-size: 16px;
        color: #1B1B1B;
        line-height: 32px;
        font-weight: bold;
    }
    .search {
        float: right;
        width: 127px;
        height: 32px;
        line-height: 32px;
        border: 1px solid #ECEDEE;
        border-radius: 66px;
        text-align: center;
        font-family: PingFangSC-Regular;
        font-size: 13px;
        color: #CCCCCC;
        img {
            width: 14px;
            height: 14px;
            position: relative;
            top: 2px;
            margin-right: 3px;
        }
    }
    .help-scroller {
      width: 100%;
      height: 53px;
      background: #fff;
      border-bottom: 1px solid #F4F6F6;
      .question-types {
        // position: relative;
        // z-index: 100;
        // display: flex;
        height: 100%;
        overflow: hidden;
        line-height: 51px;
        .question-type-box {
            float: left;
        }
        .question-type {
          text-align: center;
          padding: 0 12px;
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: #1B1B1B;
        }
        .selected {
          color: #FC6655;
        }
        .selected-label {
          margin: 0 auto;
          width: 8px;
          height: 2px;
          position: relative;
          top: -12px;
          background: linear-gradient(-217deg, #ff8996 0%, #ff6a9d 100%);
          border-radius: 15px;
        }
      }
    }
    .help-scroller-place {
        width: 100%;
        height: 53px;
        background: #fff;
    }
    .stickyTab {
        position: sticky;
        position: -webkit-sticky;
        top: -1px;
        left: 0;
        z-index: 999;
    }
    .question-list {
        overflow: hidden;
        .cell-wrapper{
            background: #ffF;
            .cell{
                margin: 0 12px;
                min-height: 56px;
                line-height: 56px;
                border-bottom: 1px solid hsla(0,0%,92%,.5);
                position: relative;
                vertical-align: middle;
                font-family: PingFangSC-Medium;
                font-size: 14px;
                color: #86898B;
                .arrow-right{
                    width: 6px;
                    height: 12px;
                    position: absolute;
                    top: 50%;
                    margin-top: -6px;
                    right: 0;
                }
            }
        }
    }
    .empty-question {
        text-align: center;
        .pic {
            margin-top: 42px;
            width: 216px;
        }
        .txt {
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #86898b;
            line-height: 14px;
            margin-top: 42px;
            text-align: center;
        }
    }
}
</style>
