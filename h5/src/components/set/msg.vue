<template>
  <div class="message-box">
    <router-link class="util" v-for="(item,index) in msgCategory" :key="index" :to="{ name: 'msg_list', query: { id: item.newMsgObj.msgModule } }">
      <div class="tubiao">
        <img :src="item.icon" class="icon">
        <div class="message-num" v-if='item.unReadMsgNum' :style="{width: item.unReadMsgNum > 9 ? '28px' : ''}">{{item.unReadMsgNum > 99 ? '99+' : item.unReadMsgNum}}</div>
      </div>
      <span>
        <p class="title-wrap">
          <span class="title">{{item.categoryName}}</span>
          <span class="time" v-if='item.newMsgObj.sendTime'>{{item.newMsgObj.sendTime | dateFormat('yyyy-MM-dd hh:mm')}}</span>
        </p>
        <span class="message">{{item.newMsgObj.msgTitle}}</span>
      </span>
    </router-link>
    <!-- 联系客服 -->
    <a class="util" href="https://kefu.easemob.com/webim/im.html?configId=09358c3e-c46f-40d4-87da-5d065a02efd2">
      <div class="tubiao">
        <img :src="serviceItem.icon" class="icon">
        <div class="message-num" v-if='serviceItem.unReadMsgNum'>{{serviceItem.unReadMsgNum}}</div>
      </div>
      <span>
        <p class="title-wrap">
          <span class="title">{{serviceItem.categoryName}}</span>
          <span class="time" v-if='serviceItem.newMsgObj.sendTime'>{{serviceItem.newMsgObj.sendTime | dateFormat('yyyy-MM-dd hh:mm')}}</span>
        </p>
        <span class="message">{{serviceItem.newMsgObj.msgTitle}}</span>
      </span>
    </a>
  </div>
</template>

<script>
export default {
  name: 'msg',
  data() {
    return {
      msgCategory: [
        {
          icon: require('../../assets/message/user_icon_news_huodong_2@3x.png'),
          unReadMsgNum: 0,
          categoryName: '活动消息',
          newMsgObj: {}
        },
        {
          icon: require('../../assets/message/user_icon_news_dingdan_3@3x.png'),
          unReadMsgNum: 0,
          categoryName: '订单消息',
          newMsgObj: {}
        }
      ],
      serviceItem: {
        icon: require('../../assets/message/user_icon_news_kefu_5@3x.png'),
        unReadMsgNum: 0,
        categoryName: '在线客服',
        newMsgObj: { msgTitle: '联系客服' }
      }
    }
  },
  activated() {
    this.unreadCount()
    this.getMsgDesc()
  },
  methods: {
    unreadCount() {
      let params = {
        equipmentType: 0,
        activeLastTime: '',
        orderLastTime: '',
        trainLastTime: '',
        vdianLastTime: ''
      }
      this.$http.get('market/msg/count.do', { params }).then(res => {
        let data = res.data
        this.msgCategory[0].unReadMsgNum = data.activeUnReadCount
        this.msgCategory[1].unReadMsgNum = data.orderUnReadCount
      })
    },
    getMsgDesc() {
      let params = { equipmentType: 0 }
      this.$http.get('market/msg/msg_describe.do', { params }).then(res => {
        let data = res.data
        if (data.active || data.order) {
          let activeVal =
            Object.keys(data.active).length === 0
              ? {
                  msgTitle: '暂无新活动消息',
                  msgModule: '1'
                }
              : data.active
          this.$set(this.msgCategory[0], 'newMsgObj', activeVal)

          let orderVal =
            Object.keys(data.order).length === 0
              ? {
                  msgTitle: '暂无新订单消息',
                  msgModule: '3'
                }
              : data.order
          this.$set(this.msgCategory[1], 'newMsgObj', orderVal)
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
@import '../../styles/index.less';

.util {
  border-bottom: 1px solid #f2f2f2;
  overflow: hidden;
  .px2rem(height, 160);
  .px2rem(margin-left, 32);
  display: inline-block;
}
.tubiao {
  .px2rem(width, 90);
  .px2rem(height, 90);
  display: block;
  float: left;
  .px2rem(margin-top, 30);
  .px2rem(margin-right, 34);
  position: relative;
  .icon {
    .px2rem(width, 90);
    .px2rem(height, 90);
    display: block;
    position: absolute;
    left: 0;
    top: 0;
  }
  .message-num {
    width: 16px;
    height: 16px;
    background: #ff6532;
    position: absolute;
    top: -5px;
    right: -10px;
    border-radius: 50%;
    color: #fff;
    font-size: 12px;
    line-height: 16px;
    text-align: center;
    z-index: 1;
  }
}
.title-wrap {
  display: inline-block;
  .px2rem(width, 590);
  .px2rem(height, 40);
  .px2rem(line-height, 40);
  .title {
    float: left;
    font-family: PingFangSC-Semibold;
    font-size: 15px;
    color: #1b1b1b;
    line-height: 18px;
  }
  .time {
    float: right;
    .px2rem(margin-right, 30);
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #cbcbcb;
    line-height: 14px;
  }
}
.message {
  float: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #86898b;
  line-height: 16px;
  max-width: 290px;
}
.message-box {
  background: #fff;
  font-size: 37.5px;
}
.message-top {
  width: 100%;
  height: 42px;
  line-height: 42px;
  font-size: 18px;
  color: #1b1b1b;
  font-weight: bold;
  text-align: center;
  position: relative;
}
.back {
  width: 7px;
  height: 14px;
  position: absolute;
  top: 14px;
  left: 16px;
}
//二维码
.qrcode {
  .pxrem(margin-top, 74);
  text-align: center;
  > img {
    .pxrem(width, 67);
    .pxrem(height, 67);
    margin: 0 auto;
  }
  > p {
    .pxrem(margin-top, 18);
    .pxrem(font-size, 12);
    .pxrem(line-height, 16);
    color: #838388;
  }
}
.util:last-child {
  border-bottom: 0;
}
</style>
