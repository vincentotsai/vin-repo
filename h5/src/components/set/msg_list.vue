<template>
  <div class="message-wrap">
    <section class="empty-msg" v-if="empty">
      <img class="pic" src="../../assets/empty/no-msg.png">
      <div class="txt">没有消息可以查看</div>
    </section>
    <!-- 消息列表已没有分页，最多下发20条 -->
    <scroller v-else ref="messageList" @on-scroll-bottom="loadMore" :from="$route.name + '_' + $route.query.id">
      <div v-for="(item, index) in msgList" :key="index">
        <div class="top-time">
          <span>{{item.sendTime | dateFormat('yyyy-MM-dd')}}</span>
        </div>
        <div class="list-box">
          <!-- 活动消息 -->
          <div v-if='item.msgModule == 1' @click="toDetail(item)">
            <div class="title" v-if="item.msgTitle">{{item.msgTitle}}</div>
            <div class="time" v-if="item.sendTime">{{item.sendTime | dateFormat('yyyy-MM-dd hh:mm')}}</div>
            <div class="pic" v-if="item.msgImage">
              <img class="pic" :src="item.msgImage+imageSize(327,143)" @error="setErrorImg($event,327,143)">
            </div>
            <div class="content" v-if="item.msgAbstract">{{item.msgAbstract}}</div>
          </div>
          <!-- 订单消息 -->
          <div v-if='item.msgModule == 3' @click="toDetail(item)">
            <div class="title" v-if="item.msgTitle">{{item.msgTitle}}</div>
            <div class="time" v-if="item.sendTime">{{item.sendTime | dateFormat('yyyy-MM-dd hh:mm')}}</div>
            <div v-if="item.msgAbstract">
              <div class="content" v-for="(line, idx) in item.msgAbstract.notifyLines" :key="idx">{{line}}</div>
            </div>
            <div class="pic-small">
              <img class="pic" v-if="item.msgAbstract && item.msgAbstract.notifyGoodsImage" :src="item.msgAbstract.notifyGoodsImage" @error="setErrorImg($event,55,55)">
              <div class="title" v-if="item.msgAbstract && item.msgAbstract.notifyGoodsName">{{item.msgAbstract.notifyGoodsName}}</div>
            </div>
            <div class="detail-go" @click="toDetail(item)">
              <span>查看详情</span>
              <div class="icon"></div>
            </div>
          </div>
        </div>
      </div>
    </scroller>
  </div>
</template>
<script>
export default {
  name: 'msg_list',
  data() {
    return {
      msgModule: this.$route.query.id, //消息类型id: '1'活动消息 ‘3’订单消息
      msgList: [],
      pageNum: 1,
      upLastMsgTime: '', //最后一条消息的时间戳 用于上啦加载更多
      empty: false, //消息为空
      loadingFlag: false
    }
  },
  activated() {
    if (this.msgModule && this.msgModule == 1) {
      this.setTitle('活动消息')
    } else if (this.msgModule && this.msgModule == 3) {
      this.setTitle('订单消息')
    } else {
      this.setTitle('消息')
    }
    this.$vux.loading.show({
      text: '加载中...'
    })
    this.getMsgList()

    if (this.$refs.messageList) {
      let item = `${this.$route.name}_${this.$route.query.id}_H`
      this.$refs.messageList.$el.scrollTop = sessionStorage.getItem(item)
    }
  },
  methods: {
    getMsgList() {
      let param = {
        params: {
          equipmentType: '0',
          msgModule: this.msgModule,
          upLastMsgTime: this.upLastMsgTime,
          pageNum: String(this.pageNum)
        }
      }
      this.loadingFlag = true
      this.$http.get('market/msg/list.do', param).then(res => {
        let data = res.data
        this.$vux.loading.hide()
        if (Object.keys(data).length === 0) {
          this.empty = true
          return false
        }
        if (this.msgModule == 1) {
          this.msgList = data.itemList
        } else if (this.msgModule == 3) {
          this.msgList = data.itemList
          for (let i = 0; i < this.msgList.length; i++) {
            this.msgList[i].msgAbstract = JSON.parse(
              this.msgList[i].msgAbstract
            )
          }
        }
        this.loadingFlag = false
      })
    },
    loadMore() {
      // this.upLastMsgTime = this.msgList[this.msgList.length - 1].sendTime
      if (this.loadingFlag) return false
      // this.getMsgList()
    },
    toDetail(item) {
      // linkType: 0-非链接 1-商品链接 2-分类链接 3-品牌链接 4-外部链接 5-原生链接 6-订单详情链接 7-订单退款链接 8-售后链接
      switch (Number(item.linkObj.linkType)) {
        case 0:
          this.showToast('非链接')
          break
        case 1:
          if (!item.linkObj.linkObjectIdList) {
            this.showToast('链接数据为空！')
            return false
          }
          if (item.linkObj.linkObjectIdList.length === 1) {
            this.$router.push({
              name: 'detail',
              query: { goods_id: item.linkObj.linkObjectIdList[0] }
            })
          } else if (item.linkObj.linkObjectIdList.length > 1) {
            // 不止一个ID则拿与linkObj同级的msgNo去请求另一个接口
            this.$router.push({
              name: 'advert_goods_list',
              query: { advertId: item.msgNo }
            })
          } else {
            return false
          }
          break
        case 2:
          this.$router.push({
            name: 'classified_goods',
            query: { id: item.linkObj.linkObjectIdList.join(',') }
          })
          break
        case 3:
          this.$router.push({
            name: 'brand_goods_list',
            query: {
              brandId: item.linkObj.linkObjectIdList[0]
            }
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
        case 6:
          this.$router.push({
            name: 'order_detail',
            query: {
              id: item.linkObj.linkObjectIdList[0]
            }
          })
          break
        case 7:
          this.$router.push({
            name: 'payPro',
            query: {
              orderNo: item.linkObj.linkObjectIdList[0]
            }
          })
          break
        case 8:
          this.$router.push({
            name: 'rePro',
            query: {
              afterSalesNo: item.linkObj.linkObjectIdList[0]
            }
          })
          break
      }
    }
  }
}
</script>
<style scoped lang="less">
@import '../../styles/index.less';
.message-wrap {
  background: #fafafa;
  font-size: 16px;
  overflow-y: scroll;
  position: absolute;
  bottom: 0;
  top: 0;
  left: 0;
  right: 0;
}

.title {
  font-size: 16px;
  color: #343c45;
  display: block;

  .px2rem(line-height, 32);
  .px2rem(margin-top, 26);
  .px2rem(margin-bottom, 26);
}

.empty-msg {
  text-align: center;
  .pic {
    margin-top: 159px;
    width: 216px;
    // height: 170px;
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

.top-time {
  text-align: center;
  margin: 12px 0 11px;
  font-family: PingFangSC-Regular;
  font-size: 13px;
  color: #86898b;
  letter-spacing: 0;
}

.list-box {
  box-sizing: border-box;
  display: block;
  .pxrem(width, 351);
  margin: 0 auto;
  .pxrem(padding, 0, 12, 0, 12);
  background: #fff;
  overflow: hidden;
  border: 0 solid #ececec;
  border-radius: 4px;
  .title {
    margin-top: 24px;
    font-family: PingFangSC-Semibold;
    font-size: 16px;
    color: #1b1b1b;
    line-height: 20px;
  }
  .time {
    margin-top: 2px;
    margin-bottom: 15px;
    text-align: left;
    font-family: PingFangSC-Regular;
    font-size: 11px;
    color: #86898b;
  }
  .pic {
    .pxrem(width, 327);
    .pxrem(height, 143);
    .pxrem(margin-bottom, 10);
  }
  .pic-small {
    .pxrem(width, 327);
    .pxrem(height, 55);
    margin-top: 15px;
    margin-bottom: 20px;
    .pic {
      float: left;
      .pxrem(width, 55);
      .pxrem(height, 55);
    }
    .title {
      float: left;
      margin: 0;
      .pxrem(margin-left, 14);
      .pxrem(width, 251);
      .pxrem(font-size, 12);
      .pxrem(line-height, 18);
      color: #272728;
    }
  }
  .content {
    margin-bottom: 2px;
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #86898b;
    letter-spacing: 0;
    line-height: 18px;
  }
  .detail-go {
    border-top: 1px solid #f2f2f2;
    position: relative;
    display: block;
    .pxrem(width, 327);
    .pxrem(height, 46);
    text-align: left;
    .px2rem(line-height, 81);
    font-size: 16px;
    > span {
      font-family: PingFangSC-Semibold;
      font-size: 13px;
      color: #86898b;
      letter-spacing: 0;
      line-height: 17px;
    }
    .icon {
      position: absolute;
      .pxrem(right, 0);
      top: 14px;
      display: inline-block;
      .pxrem(width, 18);
      .pxrem(height, 18);
      background: url('../../assets/commom/h5_icon_go_big.png') no-repeat 0 0;
      background-size: 100% 100%;
    }
  }
}
</style>
