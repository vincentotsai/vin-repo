<template>
  <div class="activity_list" v-if="!noTabList">
    <!-- 顶部tabs -->
    <div class="wrap" ref="flashSaleTab" :class="{'stickyTab': !isAndroid}">
      <div class="placeholder"></div>
      <vux-scroller class="header" lock-y>
        <div class="headerList" ref="headerList">
          <div v-for="(item,index) in actTabList" :key="index">
            <div class="list-container">
              <div :class="{'active':son.isActive,'yure':son.actStatus == 1}" class="tab" v-for="(son, i) in item.group_acts" :key="i" @click="changeTab(son)">
                <p class="time">{{son.timeTitle}}</p>
                <p class="text" v-if="item.date_title == '昨日'">已开抢</p>
                <p class="text" v-else-if="item.date_title == '明日'">即将开抢</p>
                <p class="text" v-else>{{toText(son.actStatus)}}</p>
                <div :class="son.isActive ? 'highlight' : ''"></div>
              </div>
            </div>
          </div>
        </div>
      </vux-scroller>
    </div>
    <!-- 吸顶防抖 -->
    <div class="replaceFlashSaleTab" v-if="replaceFlashSaleTabDom"></div>

    <div class="list" v-if="!noPromotionGoods">
      <!-- 结束 -->
      <div class="empty-box" v-if="empty">
        <img src="../../assets/empty/nogoods.png">
        <div v-if="selectedAct.actStatus == 4">抢购已经结束了</div>
        <div v-if="selectedAct.actStatus != 4">还没宝贝上架哦~</div>
      </div>

      <scroller v-else class="list-box" @on-scroll-bottom="loadMore" :nomore="isMore==0">
        <!-- 超级秒杀 -->
        <div class="super" v-if="superSaleList && superSaleList.length > 0">
          <div class="headline">
            <i class="icon"></i>
            <span class="txt">超值推荐 先到先得</span>
          </div>
          <ul class="single-goods">
            <!-- goodsStatus 1-下架(不显示)，2-上架 -->
            <li class="goods-item" v-for="(item,index) in superSaleList" :key="index" @click="superToDetail(item)">
              <!-- 售馨 -->
              <soldout-mask w="100%" h="198px" imgWidth="15%" v-if="item && item.isSalable == 0"></soldout-mask>
              <img class="soon_soldout" src="../../assets/home/soon_soldout@3x.png" v-if="item.isStorageAlarm == 1">
              <x-img class="goods-img-tot" container="#vux_view_box_body" :src="item.coverImage + imageSize()" :default-src="defaultLazyImg()" :offset="150"></x-img>
              <div class="title">
                <!-- 保税、直邮、秒杀 -->
                <img class="baoshui" v-if="item.purchaseType == 1" src="../../assets/cart/image_bq_bs@2x.png">
                <img class="zhiyou" v-if="item.purchaseType == 2" src="../../assets/cart/image_bq_zy@2x.png">
                <img class="miaosha" v-if="item.sellType == 3" src="../../assets/cart/image_bq_ms@2x.png">
                <span class="bold">{{item.goodsName}}</span>
              </div>
              <p class="goods-subname " v-if="item.goodsTitle">{{item.goodsTitle}}</p>
              <p class="goods-price bold">
                <span class="activity-price" v-if="item.seckillPrice">
                  <span class="fuhao">￥</span>
                  {{item.seckillPrice}}
                  <span class="origin">¥{{ item.goodsPrice }}</span>
                </span>
                <span class="activity-price" v-else>
                  <span class="fuhao">￥</span>
                  {{item.goodsPrice}}
                </span>
              </p>
            </li>
          </ul>
        </div>
        <!-- 限时限量 一般秒杀 -->
        <div v-if="activityList && activityList.length > 0">
          <div class="text-content">
            <div class="left">
              <div class="icon"></div>
              <div class="text">限时限量 火热抢购</div>
            </div>
          </div>
          <div class="goods-list">
            <flash-sale-list :goodsList="activityList"></flash-sale-list>
          </div>
        </div>
        <div class="to_more" v-if="from === 'home' && isMore == 1" @click="toMore">
          查看更多 >>
        </div>
      </scroller>
    </div>
    <div class="noPromotionGoods" v-else>
      <img src="../../assets/empty/nogoods.png">
      <p>暂无商品~</p>
    </div>
  </div>
</template>
<script>
import flashSaleList from '@/components/common/flash_sale_list'
import bus from '@/util/bus'
import { Scroller } from 'vux'

export default {
  name: 'flash-sale',
  data() {
    return {
      tabList: [], //抢购活动tabs
      noTabList: false,
      selectedAct: {}, //当前选中的活动
      actTabList: [], //处理后的活动tabs数据 按昨日今日明日分组
      activityList: [], //活动列表数据
      noPromotionGoods: false, //tab下没商品
      empty: false, //空白页
      initTabOffsettop: 0, // 距离顶部初始值
      replaceFlashSaleTabDom: false, // 吸顶防抖
      firstVisit: true,
      superSaleList: [], // 超值推荐商品
      pageNum: 1,
      pageSize: 15,
      isMore: 0,
      loadingFlag: false //加载中
    }
  },
  components: {
    vuxScroller: Scroller,
    flashSaleList
  },
  props: {
    flashSaleScrollPos: Number,
    from: String //’home' 首页展示的限时抢购分页用点击查看更多实现
  },
  watch: {
    flashSaleScrollPos(val, oldVal) {
      if (val >= this.initTabOffsettop) {
        // 如果是Android机器则用js实现吸顶
        if (this.isAndroid) {
          this.$refs.flashSaleTab.style.position = 'fixed'
          this.$refs.flashSaleTab.style.top = '51px'
          this.$refs.flashSaleTab.style.zIndex = '999'
          this.replaceFlashSaleTabDom = true
        } else {
          // 非安卓用css sticky
        }
      } else {
        this.$refs.flashSaleTab.style.position = ''
        this.replaceFlashSaleTabDom = false
      }
    }
  },
  created() {
    this.getTabList()
  },
  methods: {
    getTabList() {
      let _this = this
      this.$http.get('order/goods_promotion_tab.do').then(res => {
        this.tabList = res.data.timeTab

        if (!this.tabList || this.tabList.length === 0) {
          this.noTabList = true
          return false
        }

        let _list = []
        for (let i = 0; i < this.tabList.length; i++) {
          this.tabList[i].isActive = false
          if (
            this.sysTime >= this.tabList[i].activeBeginTime &&
            this.sysTime <= this.tabList[i].activeEndTime
          ) {
            //有新的抢购开始,但是此抢购还未结束的则变为"已开抢"
            if (i >= 1) {
              this.tabList[i - 1].actStatus = 2 //已开抢
              this.tabList[i - 1].isActive = false
            }
            this.tabList[i].actStatus = 3 //抢购中
            this.tabList[i].isActive = true
            this.selectedAct = this.tabList[i]
          }

          //时间戳转日期 格式: 11:11
          this.tabList[i].timeTitle = this.getLocalTimeHM(
            this.tabList[i].activeBeginTime
          )

          if (this.tabList[i].activeBeginTime > this.sysTime) {
            this.tabList[i].actStatus = 1 //即将开抢
          }
          // 按‘昨日’‘今日’‘明日’分组
          this.isToday(this.tabList[i])

          // @新需求 昨日只显示一个tab 明日只显示一个tab
          for (let i = 0; i < this.actTabList.length; i++) {
            if (this.actTabList[i].date_title === '昨日') {
              // 昨日tabs合在一起
              this.actTabList[i].group_acts = [
                {
                  actStatus: 2,
                  activeId: '-1',
                  isActive: false,
                  timeTitle: '昨日'
                }
              ]
            } else if (this.actTabList[i].date_title === '明日') {
              // 明日tabs合在一起
              this.actTabList[i].group_acts = [
                {
                  actStatus: 2,
                  activeId: '0',
                  isActive: false,
                  timeTitle: '明日'
                }
              ]
            }
          }
        }

        if (Object.keys(this.selectedAct).length === 0) {
          this.selectedAct = this.tabList[0]
          this.tabList[0].isActive = true
        }

        this.$nextTick(() => {
          this.scrollWidth()
          setTimeout(() => {
            _this.initTabOffsettop = _this.$refs.flashSaleTab.offsetTop
          }, 1000)
        })

        this.getActivityDetailList()
      })
    },
    getActivityDetailList() {
      this.loadingFlag = true
      let params = {
        // @todo 昨日 明日 、分页
        activeId: this.selectedAct.activeId,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      this.$http.get('order/get_promotion_list.do', { params }).then(res => {
        let data = res.data
        this.loadingFlag = false
        this.$vux.loading.hide()
        if (data.promotionGoods && data.promotionGoods.length > 0) {
          // 通知首页有限时抢购
          bus.$emit('hasXsms', true)
          this.noPromotionGoods = false

          // 用于无感更新数据
          if (this.pageNum == 1) {
            if (this.superSaleList.length > 0 || this.activityList.length > 0) {
              this.superSaleList = []
              this.activityList = []
            }
          }

          // 按 超级秒杀、一般秒杀 分类
          for (let i = 0; i < data.promotionGoods.length; i++) {
            if (data.promotionGoods[i].isSuperSeckill == 1) {
              // 超级秒杀
              this.superSaleList.push(data.promotionGoods[i])
            } else {
              // 一般秒杀
              this.activityList.push(data.promotionGoods[i])
            }
          }
        } else {
          this.noPromotionGoods = true
          this.$nextTick(() => {
            this.tabCenter()
          })
          return false
        }

        if (data.promotionGoods && data.promotionGoods.length < this.pageSize) {
          this.isMore = 0
        } else {
          this.isMore = 1
        }

        if (this.activityList) {
          for (var i = 0; i < this.activityList.length; i++) {
            this.activityList[i].goodsStatus = 2
          }
        } else {
          this.empty = true
        }

        this.$nextTick(() => {
          this.tabCenter()
        })
        this.pageNum++
      })
    },
    toMore() {
      this.$router.push({ name: 'activity_list' })
    },
    //判断是昨天、今天、明天
    isToday(topTab) {
      let theDate = topTab.activeBeginTime
      let sysDate = new Date(this.sysTime) //当前系统时间
      let actBeginDate = new Date(topTab.activeBeginTime)

      let today = new Date(
        sysDate.getFullYear(),
        sysDate.getMonth(),
        sysDate.getDate()
      ).getTime() //今天凌晨 eg: today = 1520265600000 -> 2018-03-06 00:00:00
      let yesterday = new Date(today - 24 * 3600 * 1000).getTime() //昨天凌晨
      let tomorrow = new Date(today + 24 * 3600 * 1000).getTime() //明天凌晨
      let afterTomorrow = new Date(today + 48 * 3600 * 1000).getTime() //后天凌晨

      if (theDate >= yesterday && theDate < today) {
        this.pushData('昨日', topTab)
      } else if (theDate < tomorrow && today <= theDate) {
        this.pushData('今日', topTab)
      } else if (theDate < afterTomorrow && tomorrow <= theDate) {
        this.pushData('明日', topTab)
      } else {
        let date_title =
          actBeginDate.getMonth() + 1 + '月' + actBeginDate.getDate() + '日'
        this.pushData(date_title, topTab)
      }
    },
    pushData(date_title, topTab) {
      let single = this.findAct(date_title)

      if (Object.keys(single).length === 0) {
        single.date_title = date_title

        single.group_acts = new Array(topTab)
        this.actTabList.push(single)
      } else {
        single.date_title = date_title
        single.group_acts.push(topTab)
      }
    },
    //判断昨天、今天、明天的活动是否已有数据
    findAct(date_title) {
      for (var i = 0; i < this.actTabList.length; i++) {
        if (this.actTabList[i].date_title == date_title) {
          return this.actTabList[i]
        }
      }
      return {}
    },
    superToDetail(item) {
      this.$router.push({
        name: 'detail',
        query: { goods_id: item.goodsId }
      })
    },
    //根据ac_status_now的值显示对应的文案， 1 预热中 2已开抢 3 抢购中（特殊的已开抢）
    toText(data) {
      if (data == 1) {
        return '即将开抢'
      } else if (data == 2) {
        return '已开抢'
      } else if (data == 3) {
        return '抢购中'
      } else {
        return '已结束'
      }
    },
    loadMore() {
      if (!this.loadingFlag) {
        this.getActivityDetailList()
      }
    },
    tabCenter() {
      let activedDom = document.getElementsByClassName('active')[0]
      if (activedDom) {
        let activeOffsetLeft = activedDom.offsetLeft

        let scrollLeft =
          activeOffsetLeft - window.innerWidth / 2 + activedDom.clientWidth / 2
        // 靠最左和最右的不位移
        if (scrollLeft <= 0) {
          scrollLeft = 0
        } else if (scrollLeft > this.tabList.length * 80 - window.innerWidth) {
          scrollLeft = this.tabList.length * 80 - window.innerWidth
        }
        let transformStyle = {
          transitionDuration: '600ms',
          transitionTimingFunction: 'cubic-bezier(0.1, 0.57, 0.1, 1)',
          transform: `translate(-${scrollLeft}px)`
        }
        Object.assign(this.$refs.headerList.style, transformStyle)
      }
    },
    //动态算tabsの宽
    scrollWidth() {
      if (this.$refs.headerList) {
        let tabsNum = null
        for (let i = 0; i < this.actTabList.length; i++) {
          const element = this.actTabList[i]
          tabsNum += element.group_acts.length
        }
        this.$refs.headerList.style.width = tabsNum * 80 / 37.5 + 'rem'
      }
      this.tabCenter()
    },
    changeTab(son) {
      this.empty = false
      // this.superSaleList = []
      // this.activityList = []
      this.selectedAct = son
      this.pageNum = 1
      //默认展示抢购中的tab
      for (var i = 0; i < this.actTabList.length; i++) {
        for (var j = 0; j < this.actTabList[i].group_acts.length; j++) {
          this.actTabList[i].group_acts[j].isActive = false
          if (this.actTabList[i].group_acts[j].activeId == son.activeId) {
            this.actTabList[i].group_acts[j].isActive = true
          }
        }
      }
      this.$vux.loading.show({
        text: '加载中...'
      })
      this.getActivityDetailList()
    }
  }
}
</script>
<style scoped lang="less">
.activity_list {
  width: 100%;
  background: #fafafa;

  .flashSaleTabFixed {
    position: fixed;
    top: 50px;
    z-index: 999;
    // width: 100%;
  }

  .replaceFlashSaleTab {
    height: 61px;
    background: #fff;
  }

  .stickyTab {
    position: sticky;
    position: -webkit-sticky;
    top: -1px;
    left: 0;
    z-index: 999;
  }
  .wrap {
    .placeholder {
      position: absolute;
      height: 56px;
      background: #fff;
      width: 375px;
      // z-index: -2;
    }

    .header {
      background: transparent;
      width: 375px;
      overflow-y: hidden;
      .headerList {
        height: 100%;
        overflow: hidden;
        .list-container {
          height: 100%;
          float: left;
          overflow: hidden;
          .tab {
            position: relative;
            float: left;
            overflow: hidden;
            padding: 12px 10px;
            text-align: center;
            height: 61px;
            width: 80px;
            color: #86898b;
            .time {
              font-size: 16px;
              font-weight: bold;
              z-index: 2;
            }
            .text {
              font-size: 12px;
              margin: 5px 0;
              z-index: 2;
            }
          }
          .active {
            position: relative;
            color: #fff;
          }
          .highlight {
            position: absolute;
            z-index: -1;
            top: 0;
            left: 0;
            display: block;
            width: 100%;
            height: 56px;
            background-color: #fc6655;
          }
          .highlight::before {
            position: absolute;
            left: 0;
            right: 0;
            bottom: -0.13333rem;
            content: ' ';
            width: 0;
            height: 0;
            margin: auto;
            border-style: solid;
            border-width: 0.14667rem 0.12rem 0;
            border-color: #fc6655 transparent transparent;
            z-index: 100;
          }
        }
      }
    }
  }
  .list {
    height: 89%;
    width: 100%;
    // margin-top: 5px;
    .list-box {
      .super {
        padding: 0 12px;
        background: white;
        .headline {
          height: 49px;
          line-height: 49px;
          .icon {
            display: inline-block;
            width: 9px;
            height: 13px;
            background: url('../../assets/activityList/icon_ms@2x.png')
              center/100% no-repeat;
          }
          .txt {
            font-size: 13px;
            color: #1b1b1b;
            letter-spacing: 1.44px;
            line-height: 13px;
            font-weight: bold;
          }
        }
        .single-goods {
          font-size: 14px;
          .goods-item {
            padding: 0 0 12px;
            width: 351px;
            position: relative;
            .soon_soldout {
              position: absolute;
              top: 175px;
              left: 10px;
              height: 15px;
              width: 68px;
            }
            .goods-img-tot {
              height: 198px;
              width: 100%;
              margin-bottom: 7px;
            }
            .title {
              margin-bottom: 5px;
              font-family: PingFangSC-Semibold;
              font-size: 14px;
              line-height: 20px;
              color: #1b1b1b;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              .baoshui,
              .zhiyou,
              .miaosha {
                position: relative;
                top: 4px;
                height: 18px;
                width: 36px;
                display: inline-block;
              }
            }
            .goods-subname {
              font-size: 12px;
              background: #fff;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              margin-bottom: 7px;
            }
            .goods-price {
              .activity-price {
                font-size: 18px;
                color: #fc6655;
                .fuhao {
                  margin-right: -3px;
                  font-size: 18px;
                }
              }
              .origin {
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
      }

      .text-content {
        display: flex;
        justify-content: space-between;
        background: #fff;
        height: 49px;
        padding: 25px 12px 0;
        .left {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          .icon {
            margin-right: 5px;
            height: 13px;
            width: 9px;
            background: url('../../assets/activityList/icon_ms@2x.png')
              no-repeat center/100%;
          }
          .text {
            font-size: 13px;
            color: #1b1b1b;
            font-weight: bold;
            letter-spacing: 1.44px;
            line-height: 13px;
          }
        }
      }
      .to_more {
        text-align: center;
        color: #ccc;
        font-size: 13px;
        background: white;
        padding: 5px 0;
      }
    }
    .empty-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      > img {
        margin-top: 150px;
        display: block;
        width: 169px;
        height: 123px;
      }
      > div {
        text-align: center;
        font-size: 14px;
        color: #cecece;
        margin-top: 14px;
      }
    }
  }

  .noPromotionGoods {
    text-align: center;
    margin: 12px auto;
    padding-bottom: 100px;
    img {
      margin: 0 auto;
      display: block;
      width: 169px;
      height: 123px;
    }
    p {
      font-size: 14px;
      color: #cecece;
    }
  }
}
</style>
