<template>
  <div>
    <div class="detail" v-if="!noDetail" ref="topicDetailRef" @scroll="handleScroll">
      <div class="topicTitle" v-if="topicDetail.topicTitle">{{topicDetail.topicTitle}}</div>
      <div class="topicSubtitle" v-if="topicDetail.topicSubtitle">{{topicDetail.topicSubtitle}}</div>
      <div class="topicitems" v-if="topicItems.length" v-for="(item, index) in topicItems" :key="index">
        <!-- 1单列商品 -->
        <div class="single" v-if="item.itemType == 1" @click="toGoodsDetail(item.singleGoods)">
          <div class="pic">
            <x-img container=".detail" :src="item.singleGoods.coverImage + imageSize()" :default-src="defaultLazyImg()" :offset="150"></x-img>
          </div>
          <div class="title">{{item.singleGoods.goodsName}}</div>
          <div class="price">
            <span class="sec-price" v-if="item.singleGoods.seckillPrice">￥{{item.singleGoods.seckillPrice}}</span>
            <span :class="item.singleGoods.seckillPrice ? 'origin-price':'sec-price'">￥{{item.singleGoods.goodsPrice}}</span>
          </div>
        </div>
        <!-- 2双列商品 -->
        <div class="double" v-if="item.itemType == 2">
          <div class="left" @click="toGoodsDetail(item.leftGoods)">
            <div class="pic">
              <x-img container=".detail" :src="item.leftGoods.coverImage + imageSize()" :default-src="defaultLazyImg()" :offset="150"></x-img>
            </div>
            <div class="title">{{item.leftGoods.goodsName}}</div>
            <div class="price">
              <span class="sec-price" v-if="item.leftGoods.seckillPrice">￥{{item.leftGoods.seckillPrice}}</span>
              <span :class="item.leftGoods.seckillPrice ? 'origin-price':'sec-price'">￥{{item.leftGoods.goodsPrice}}</span>
            </div>
          </div>
          <div class="right" @click="toGoodsDetail(item.rightGoods)">
            <div class="pic">
              <x-img container=".detail" :src="item.rightGoods.coverImage + imageSize()" :default-src="defaultLazyImg()" :offset="150"></x-img>
            </div>
            <div class="title">{{item.rightGoods.goodsName}}</div>
            <div class="price">
              <span class="sec-price" v-if="item.rightGoods.seckillPrice">￥{{item.rightGoods.seckillPrice}}</span>
              <span :class="item.rightGoods.seckillPrice ? 'origin-price':'sec-price'">￥{{item.rightGoods.goodsPrice}}</span>
            </div>
          </div>
        </div>
        <!-- 3单列纯图片 -->
        <div class="singleimg-warp">
          <div class="singleimg" v-if="item.itemType == 3">
            <x-img container=".detail" :style="{width: item.singleWidth}" :src="item.singleImage + imageSize()" :default-src="defaultLazyImg()" :offset="150"></x-img>
          </div>
        </div>
        <!-- 4纯文本 -->
        <div class="puretxt" v-if="item.itemType == 4">
          <pre class="wordwrap" :style="item.style">{{JSON.parse(item.singleText).content}}</pre>
        </div>
      </div>

      <div class="goods_toggle" v-if="goodsList.length" v-show="isShowGoodsToggle" @click="doOpen"><img src="../../assets/discovery/icon_shouqi@2x2.png" alt="">
        <p class="goodsCount">({{goodsList.length > 99 ? '99+' : goodsList.length}})</p>
      </div>
      <div class="goods_closer1" :style="isShowGoodsList ? 'right:310px' : ''" @click="isShowGoodsList = false"><img src="../../assets/discovery/icon_zhankai@2x.png" alt=""></div>

      <!-- 商品 -->
      <div v-transfer-dom>
        <popup v-model="isShowGoodsList" position="right" :hide-on-blur="true" @on-hide="onHide" :popup-style="{background: '#fff'}">
          <div style="width:310px;padding:0 12px;">
            <div class="goods" v-for="(item, index) in goodsList" :key="index">
              <div class="pic"><img :src="item.goodsPicture + imageSize()" alt="" @click="toGoodsDetail(item)"></div>
              <div class="right">
                <div class="goods_title" @click="toGoodsDetail(item)">{{item.goodsName}}</div>
                <div class="goods_price">
                  <span class="price" v-if="item.seckillPrice">￥{{item.seckillPrice}}</span>
                  <span :class="item.seckillPrice ? 'originprice' : 'price'">￥{{item.goodsPrice}}</span>
                  <img @click="addCart(item)" src="../../assets/discovery/icon_gwc@2x.png">
                </div>
              </div>
            </div>
          </div>
        </popup>
      </div>
      <!-- 举报 -->
      <div v-transfer-dom>
        <popup v-model="showReportList" position="bottom" :hide-on-blur="true" @on-hide="onHide2" :popup-style="{background: '#fff'}">
          <div class="reports" @touchmove.prevent>
            <div class="btns">
              <div class="cancel" @click="showReportList = false">
                取消
              </div>
              <div class="confirm" @click="confirm">
                提交
              </div>
            </div>
            <div class="report" v-for="(item, index) in reportList" :style="{'color': currentReportIndex ===index ? '#FC6655':''}" :key="index" @click="currentReportIndex = index">
              {{item}}
            </div>
          </div>
        </popup>
      </div>

      <div class="footer vux-1px-t" v-if="Object.keys(topicDetail).length !== 0">
        <div class="report" @click="showReportList = true">
          <img class="icon" src="../../assets/discovery/icon_jubao@2x.png"> 举报
        </div>
        <div class="dianzan" v-if="liked">
          <img class="icon" src="../../assets/discovery/icon_dianzan_pre@2x.png"> {{topicDetail.likeCount | countFormat}}
        </div>
        <div class="dianzan" v-else @click="doDianzan(0)">
          <img class="icon" v-if="!topicDetail.dianzanClicked" src="../../assets/discovery/icon_dianzan@2x.png">
          <img class="icon" v-else src="../../assets/discovery/icon_dianzan_pre@2x.png"> {{topicDetail.likeCount | countFormat}}
        </div>
      </div>
    </div>
    <div class="empty" v-else>
      <img src="../../assets/empty/refundlist.png" alt="">
      <p>暂无话题详情~</p>
    </div>
    <!-- 快捷方式 -->
    <shortcut :opt="shortcutOpt"></shortcut>
  </div>
</template>
<script>
import { TransferDom, Popup } from 'vux'
export default {
  name: 'topic_detail',
  directives: {
    TransferDom
  },
  components: {
    Popup
  },
  data() {
    return {
      topicId: this.$route.query.topicId,
      liked: this.$route.query.liked, //点过赞？
      topicItems: [], //详情楼层
      topicDetail: {},
      isShowGoodsList: false,
      isShowGoodsToggle: true,
      noDetail: false,
      shortcutOpt: {},
      goodsList: [],
      reportList: [
        '低俗色情',
        '疑似抄袭',
        '违法犯罪',
        '与实物不符',
        '内容质量差',
        '标题夸张',
        '其他'
      ],
      currentReportIndex: null,
      showReportList: false //举报项
    }
  },
  created() {
    this.getDetail()
    this.reportScan()
    this.shortcutOpt.home = {
      show: true
    }
  },
  activated() {
    if (this.$refs.topicDetailRef) {
      let item = `${this.$route.name}_${this.$route.query.topicId}_H`
      this.$refs.topicDetailRef.scrollTop = sessionStorage.getItem(item)
    }
  },
  methods: {
    getDetail() {
      let params = {
        topicId: this.topicId
      }
      this.$http.get('market/topic_detail.do', { params }).then(res => {
        this.topicDetail = res.data
        if (!Object.keys(this.topicDetail).length) {
          this.noDetail = true
          return false
        }
        this.topicItems = res.data.topicItems
        this.setSingleImgSize()
        this.getGoodsList(this.topicItems)
      })
    },
    handleScroll(e) {
      sessionStorage.setItem(
        `${this.$route.name}_${this.$route.query.topicId}_H`,
        e.target.scrollTop
      )
    },
    setFix() {
      this.$refs.topicDetailRef.style.position = 'fixed'
      this.$refs.topicDetailRef.style['overflow-y'] = 'hidden'
    },
    unsetFix() {
      this.$refs.topicDetailRef.style.position = ''
      this.$refs.topicDetailRef.style['overflow-y'] = 'scroll'
    },
    doOpen() {
      this.isShowGoodsList = true
      this.isShowGoodsToggle = false
      this.setFix()
    },
    setSingleImgSize() {
      for (let i = 0; i < this.topicItems.length; i++) {
        const item = this.topicItems[i]
        // 单列纯图片
        if (item.itemType == 3) {
          item.singleWidth = this.getSingleImgSize(item.singleImage).w
          if (item.singleWidth) {
            item.singleWidth =
              Number(item.singleWidth) >= 600
                ? '100%'
                : Number(item.singleWidth) / 2 + 'px'
          }
        } else if (item.itemType == 4) {
          item.style = this.calcPuretextStyle(item.singleText)
        }
      }
    },
    getSingleImgSize(url) {
      var search = url.substring(url.lastIndexOf('?') + 1)
      if (!search) {
        return {}
      }
      return JSON.parse(
        '{"' +
          decodeURIComponent(search)
            .replace(/"/g, '\\"')
            .replace(/&/g, '","')
            .replace(/=/g, '":"') +
          '"}'
      )
    },
    calcPuretextStyle(txt) {
      let style = JSON.parse(txt)
      return (style = {
        'font-weight': style.isBold ? 'bold' : '',
        'font-style': style.isItalic ? 'italic' : '',
        'text-decoration': style.isUnderline ? 'underline' : '',
        'text-align': style.align,
        color: style.color,
        'font-size': style.size + 'px',
        'font-family': style.font
      })
    },
    getGoodsList(data) {
      if (data) {
        for (let i = 0; i < data.length; i++) {
          const element = data[i]
          if (element.itemType == 1) {
            this.goodsList.push(element.singleGoods)
          } else if (element.itemType == 2) {
            this.goodsList.push(element.leftGoods, element.rightGoods)
          } else {
          }
        }
      }
    },
    // 报告话题浏览记录
    reportScan() {
      let params = {
        clickType: 2, //日志类型 0公共 1店铺访客 2话题 3未定义
        opType: 3, //操作类型 3浏览
        topicId: this.topicId
      }
      this.$http.get('reportform/log.do', { params }).then(res => {})
    },
    addCart(item) {
      if (!this.isAuthorized()) {
        this.$router.push({
          path: '/entry',
          query: { redirect: this.$route.fullPath }
        })
        return false
      }
      let params = {
        goodsId: item.goodsId,
        skuCode: item.skuCode,
        skuCount: 1,
        skuId: item.skuId
      }
      this.$http.post('order/cart_add.do', params).then(res => {
        this.$vux.toast.text('加入成功')
      })
    },
    confirm() {
      if (this.currentReportIndex === null) {
        this.$vux.toast.text('未选择举报项~')
        return false
      }
      this.showReportList = false
      this.currentReportIndex = null
      this.$vux.toast.text('提交成功！')
    },
    doDianzan(type) {
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
        topicId: this.topicId
      }
      this.$http.get('reportform/u_log.do', { params }).then(res => {
        if (type === 0) {
          if (this.topicDetail.dianzanClicked) {
            return false
          }
          this.topicDetail.likeCount += 1
          this.topicDetail.dianzanClicked = true
        } else {
          this.topicDetail.shareCount += 1
        }
      })
    },
    toGoodsDetail(item) {
      this.$router.push({
        name: 'detail',
        query: {
          goods_id: item.goodsId
        }
      })
    },
    onHide(e) {
      this.isShowGoodsToggle = true
      this.unsetFix()
    },
    onHide2(e) {}
  }
}
</script>
<style lang="less" scoped>
.modal-open {
  position: fixed;
  width: 100%;
}
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
.v-transfer-dom {
  .goods_closer {
    display: block;
    position: relative;
    left: -40px;
    top: 40%;
    z-index: 11111;
    height: 78px;
    width: 40px;
    img {
      z-index: 11111;
      width: 100%;
    }
  }
  .goods {
    width: 100%;
    height: 112px;
    padding: 16px 0;
    box-shadow: 0 1px #ecedee;
    position: relative;
    .pic {
      width: 80px;
      height: 80px;
      float: left;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .right {
      float: left;
      margin-left: 12px;
      height: 80px;
      max-width: 194px;
      width: 194px;
      .goods_title {
        font-size: 14px;
        color: #1b1b1b;
        line-height: 18px;
        overflow: hidden;
        margin-bottom: 16px;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      .goods_price {
        font-size: 16px;
        letter-spacing: 0;
        line-height: 16px;
        position: absolute;
        max-width: 194px;
        width: 194px;
        bottom: 18px;
        .price {
          font-size: 16px;
          color: #fc6655;
          letter-spacing: 0;
          line-height: 16px;
        }
        .originprice {
          font-size: 12px;
          text-decoration: line-through;
          color: #a0a4a6;
          line-height: 12px;
          margin-left: 5px;
        }
        img {
          float: right;
          height: 16px;
        }
      }
    }
  }
  .reports {
    box-shadow: 0 0.5px #a0a4a6, 0 0.5px #a0a4a6 inset;
    .report {
      height: 40px;
      line-height: 40px;
      width: 100%;
      text-align: center;
      font-size: 14px;
      color: #86898b;
    }
    .btns {
      height: 50px;
      line-height: 50px;
      width: 100%;
      padding: 0 12px;
      .cancel {
        float: left;
        width: 50%;
      }
      .confirm {
        float: right;
        width: 50%;
        text-align: right;
      }
    }
  }
}
.detail {
  padding: 21px 12px 51px;
  background: white;
  height: 100%;
  overflow-y: scroll;
  .goods_toggle {
    position: fixed;
    right: 0;
    top: 40%;
    img {
      height: 78px;
      width: 40px;
    }
    .goodsCount {
      position: relative;
      top: -32px;
      right: -3px;
      text-align: center;
      font-size: 12px;
      line-height: 12px;
      color: #ffffff;
    }
  }
  .goods_closer1 {
    position: fixed;
    z-index: 9999;
    right: -40px;
    top: 40%;
    opacity: 1;
    transition: right 400ms;
    img {
      height: 78px;
      width: 40px;
    }
  }
  .topicTitle {
    font-size: 18px;
    color: #1b1b1b;
    line-height: 18px;
    margin-bottom: 20px;
  }
  .topicSubtitle {
    font-size: 14px;
    color: #86898b;
    line-height: 14px;
    margin-bottom: 20px;
  }
  .topiccover {
    height: 148px;
    width: 351px;
    margin-bottom: 14px;
    img {
      height: 100%;
      width: 100%;
    }
  }
  .topicitems {
    .single {
      .pic {
        width: 351px;
        margin-bottom: 14px;
        img {
          width: 100%;
        }
      }
      .title {
        font-size: 14px;
        color: #1b1b1b;
        line-height: 20px;
        overflow: hidden;
        margin-bottom: 16px;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      .price {
        margin-bottom: 15px;
        .sec-price {
          font-family: PingFangSC-Medium;
          font-size: 18px;
          color: #fc6655;
          letter-spacing: 0;
          line-height: 14px;
          margin-bottom: 15px;
        }
        .origin-price {
          margin-left: 5px;
          text-decoration: line-through;
          font-size: 13px;
          letter-spacing: 0;
          font-family: PingFangSC-Regular;
          font-size: 13px;
          color: #86898b;
          line-height: 12px;
        }
      }
    }
    .double {
      width: 100%;
      overflow: hidden;
      margin-bottom: 15px;
      .left {
        float: left;
        width: 170px;
        margin-right: 11px;
        .pic {
          height: 170px;
          width: 170px;
          img {
            height: 100%;
            width: 100%;
          }
        }
        .title {
          font-family: PingFangSC-Regular;
          font-size: 12px;
          color: #1b1b1b;
          line-height: 20px;
          overflow: hidden;
          margin-bottom: 16px;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        .price {
          margin-bottom: 15px;
          .sec-price {
            font-family: PingFangSC-Medium;
            font-size: 18px;
            color: #fc6655;
            letter-spacing: 0;
            line-height: 14px;
            margin-bottom: 15px;
          }
          .origin-price {
            margin-left: 5px;
            text-decoration: line-through;
            font-size: 13px;
            letter-spacing: 0;
            font-family: PingFangSC-Regular;
            font-size: 13px;
            color: #86898b;
            line-height: 12px;
          }
        }
      }
      .right {
        width: 170px;
        float: left;
        .pic {
          height: 170px;
          width: 170px;
          img {
            height: 100%;
            width: 100%;
          }
        }
        .title {
          font-family: PingFangSC-Regular;
          font-size: 12px;
          color: #1b1b1b;
          line-height: 20px;
          margin-bottom: 16px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        .price {
          margin-bottom: 15px;
          .sec-price {
            font-family: PingFangSC-Medium;
            font-size: 18px;
            color: #fc6655;
            letter-spacing: 0;
            line-height: 14px;
            margin-bottom: 15px;
          }
          .origin-price {
            margin-left: 5px;
            text-decoration: line-through;
            font-size: 13px;
            letter-spacing: 0;
            font-family: PingFangSC-Regular;
            font-size: 13px;
            color: #86898b;
            line-height: 12px;
          }
        }
      }
    }
    .singleimg-warp {
      width: 100%;
      text-align: center;
      .singleimg {
        max-width: 100%;
        margin-bottom: 14px;
        img {
          max-width: 100%;
        }
      }
    }
    .puretxt {
      font-family: PingFangSC-Regular;
      font-size: 12px;
      color: #000;
      line-height: 22px;
      margin-bottom: 10px;
      .wordwrap {
        white-space: pre-wrap;
        white-space: -moz-pre-wrap;
        white-space: -pre-wrap;
        white-space: -o-pre-wrap;
        word-wrap: break-word;
      }
    }
  }
  .footer {
    position: fixed;
    bottom: 0;
    left: 0;
    height: 49px;
    line-height: 49px;
    width: 100%;
    background: white;
    padding: 12px;
    box-shadow: 0 0.5px #a0a4a6, 0 0.5px #a0a4a6 inset;
    .report {
      float: left;
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
</style>
