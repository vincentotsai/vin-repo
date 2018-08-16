<template>
  <div class="home-page">
    <section v-if="homeEmpty">
      <empty desc="首页没任何数据~"></empty>
    </section>
    <section class="section" v-else>
      <!-- 频道 -->
      <vux-scroller class="home-scroller vux-1px-b" lock-y>
        <div class="channels" ref="channels" :style="dynamicChannelWidth()">
          <div class="channel" v-for="(item, index) in channelList" :key="index + '001'" :class="{ 'selected bold' : item.channelName === currentChannel.channelName }" @click="switchChannel(item)">
            <p>{{item.channelName}}</p>
            <p :class="{'selected-label': item.channelName === currentChannel.channelName }"></p>
          </div>
        </div>
      </vux-scroller>
      <main class="main-content" id="vux_view_box_body" ref="homeScrollBox" @scroll.stop="scrollHandler" v-if="!isOla && currentChannel.channelId !== 'recommend'">
        <!-- 测试用户从活动领取优惠券或优惠券包 -->
        <!-- <button @click="promotionTicket()" class="ticket-btn">领取优惠券</button> -->
        <!-- banner -->
        <slide class="slide" ref="slide" v-if="slideList && slideList.length > 0" v-for="(item, i) in slideList" :key="i + '002'" :advert="item" :channelId="currentChannel.channelId"></slide>
        <!-- <slide class="slide" v-if="slideList && slideList.advertList && slideList.advertList.length > 0" :advert="slideList" :channelId="currentChannel.channelId"></slide> -->
        <!-- 导航广告 -->
        <navigation class="nav" ref="nav" v-for="(item,k) in navData" :key="k + '003'" v-if="item && item.advertList && (item.advertList.length === 5 || item.advertList.length === 10)" :advert="item"></navigation>
        <!-- 限时秒杀 -->
        <!-- <limited class="limited" v-if="channelList[0].channelId === currentChannel.channelId"></limited> -->
        <!-- 标题广告位 -->
        <!-- <title_ad v-for="item in advertPositionList" :key="item.advertPositionId" v-if="item.advertPositionTypeId == 3 && item.advertList && item.advertList.length > 0" :advert="item"></title_ad> -->
        <!-- 栏目（们）(20180303增v-if判断第一个频道不显示宫格之类的广告位) -->
        <!-- <adverts class="adverts" v-for="item in advertPositionList" :key="item.advertPositionId" :advert="item" v-if="channelList[0].channelId !== currentChannel.channelId"></adverts> -->
        <adverts class="adverts" v-for="(item, key) in advertPositionList" :key="key + '004'" :advert="item"></adverts>
        <!-- 20180403增首个频道需全部显示且限时抢购放最后 -->
        <!-- 限时抢购 -->
        <!-- <flash-sale v-if="channelList[0].channelId === currentChannel.channelId" :flashSaleScrollPos="flashSaleScrollPos"></flash-sale> -->
        <!-- @20180606限时抢购按下发字段显示 -->
        <flash-sale v-if="currentChannel.showSeckill == 1" :flashSaleScrollPos="flashSaleScrollPos" :from="'home'"></flash-sale>

        <!-- 热门推荐 -->
        <!-- <recommond :goodsList="channelList"></recommond> -->
        <!-- 无内容 -->
        <empty v-if="noContent && (channelList[0].channelId !== currentChannel.channelId || !hasXsms)" desc="宝贝没上架~"></empty>
        <div class="bottom-fill"></div>
      </main>

      <!-- ola商品 -->
      <scroller class="ola-goods" ref="homeOlaScrollBox" v-if="isOla && olaGoodsList.length > 0" @on-scroll-bottom="loadMore" :nomore="olaIsMore == 0" :from="$route.name + '_ola'">
        <goods-list-s :goodsList="olaGoodsList"></goods-list-s>
      </scroller>
      <!-- ola空 -->
      <empty v-if="isOla && olaGoodsList.length === 0" desc="宝贝没上架~"></empty>

      <!-- 店主精选-拼接 -->
      <scroller class="rec-box" ref="recommendShop" v-if="currentChannel.channelId === 'recommend'" @on-scroll-bottom="recommendLoadMore" :nomore="recommendIsMore == 0" :from="$route.name + '_recommend'">
        <!-- 店铺信息 -->
        <header class="shop" v-if="shopInfo">
          <img class="bg" v-if="shopInfo.bgUrl" :src="shopInfo.bgUrl+imageSize(375,147)" @error="setErrorImg($event,375,147)">
          <img class="bg" v-else src="../../assets/top_moren_bj@2x.png">
          <img class="avatar" v-if="shopInfo.avatarUrl" :src="shopInfo.avatarUrl" @error="setErrorImgTouxiang($event,45,45)">
          <img class="avatar" v-else src="../../assets/h5_icon_avtor_moren.png">
          <p class="shop-name bold" v-text="shopInfo.shopName"></p>
          <p class="desc" v-text="shopInfo.shopDesc || '精选全球好货，乐享轻松购物'"></p>
        </header>
        <!-- 品牌轮播 -->
        <brand-swiper v-if="brandData && brandData.list && brandData.list.length > 0" :brandList="brandData.list"></brand-swiper>
        <!-- 精选单品 -->
        <section class="single" v-if="recommendGoodsList && recommendGoodsList.length > 0">
          <div class="headline bold">店主推荐</div>
          <ul>
            <li v-for="(item, index) in recommendGoodsList" :key="index + '005'" @click="routeLink('detail',{goods_id:item.goodsId})">
              <div class="pic-box">
                <soldout-mask w="146px" h="146px" v-if="item.isSalable == 0"></soldout-mask>
                <!-- <img class="goods-img" :src="item.coverImage" @error="setErrorImg($event,146,146)"> -->
                <x-img class="goods-img" container=".v-scroller" :src="item.coverImage + imageSize()" :default-src="defaultLazyImg()" :offset="150"></x-img>
              </div>
              <p class="goods-name bold">{{item.goodsName}}</p>
              <div class="tag">
                <!-- 保税、直邮、秒杀 -->
                <span class="type-tag">
                  <img class="baoshui" v-if="item.purchaseType == 1" src="../../assets/cart/image_bq_bs@2x.png">
                  <img class="zhiyou" v-if="item.purchaseType == 2" src="../../assets/cart/image_bq_zy@2x.png">
                  <img class="miaosha" v-if="item.sellType == 3" src="../../assets/cart/image_bq_ms@2x.png">
                </span>
                <!-- 显示（一次最多显示一个）：新品>热销>推荐 -->
                <img class="new" src="../../assets/goods-list/h5_icon_label_small_xinpin.png" v-if="item.isNew == '1'">
                <img class="hot" src="../../assets/goods-list/h5_icon_label_small_remai.png" v-if="item.isNew == '0' && item.isHot == '1'">
                <img class="rec" src="../../assets/goods-list/h5_icon_label_tuijie.png" v-if="item.isNew == '0' && item.isHot == '0' && item.isRecommend == '1'">
              </div>
              <!-- 有秒杀活动 -->
              <div class="price" v-if="item.seckillPrice">
                <span class="activity bold" v-if="item.seckillPrice">¥{{ item.seckillPrice }}</span>
                <span class="origin">¥{{ item.goodsPrice }}</span>
              </div>
              <div class="price" v-else>
                <span class="activity bold">¥{{ item.goodsPrice }}</span>
              </div>
            </li>
          </ul>
        </section>

        <empty v-if="noGoods" :h="'200px'" :pt="'0'" :bgcolor="'#fafafa'" :mt="'50px'" :desc="'店铺没有商品哦~'"></empty>
        <empty v-if="noShop" :h="'200px'" :pt="'0'" :bgcolor="'#fafafa'" :mt="'100px'" :desc="'店铺不存在~'"></empty>
      </scroller>
      <!-- end of 店主精选 -->

      <!-- 快捷方式 -->
      <shortcut :opt="shortcutOpt"></shortcut>
    </section>
    <!-- 邓丽 下单支付直发卡券包弹窗 -->
    <div class="coupons-window" v-if="ticketsIsShow">
      <div class="title1">送您{{ticketsInfo.length}}张优惠券</div>
      <div class="title2">赶快去下单吧！</div>
      <img src="../../assets/vouchers/user_icon_box_lingqu_close.png" class="del-btn" @click="close()" />
      <div class="coupons-box">
        <ul>
          <li v-for="(item,index) in ticketsInfo" :key="index + '006'" class="single-coupon">
            <div class="left">
              <div class="faceValue" v-if="item.ticketTypeId == 1">
                ￥{{item.faceValue}}
              </div>
              <div class="discountValue" v-if="item.ticketTypeId == 2">
                {{item.discountValue}}
                <span class="discount-text">折</span>
              </div>
              <div class="mianyou" v-if="item.ticketTypeId == 3">
                <img src="../../assets/vouchers/user_icon_box_lingqu_mianyou.png" />
              </div>
              <p class="useCondition" v-if="item.ticketTypeId == 1 || item.ticketTypeId == 2">满{{item.useCondition}}可用</p>
            </div>
            <div class="right">
              <p class="ticketName">{{item.ticketName}}</p>
              <p class="useEndTime">有效期至&nbsp;{{item.timeRangeEnd | dateFormat("yyyy-MM-dd")}}</p>
            </div>
          </li>
        </ul>
      </div>
      <div class="coupons-btn" @click="route_link('vouchers')">查看我的优惠券</div>
    </div>
  </div>
</template>
<script>
import { Scroller } from 'vux'
import adverts from './adverts'
import navigation from './navigation'
import limited from './limited'
import slide from './slide'
import recommond from '@/components/common/recommond'
import empty from '@/components/common/empty'
import bus from '@/util/bus'
import goodsListS from '@/components/common/goods_list_s'
import flashSale from '@/components/home/activity_list'
import titleAd from './title_ad'

import brandSwiper from './brand_swiper'
export default {
  components: {
    vuxScroller: Scroller,
    adverts,
    navigation,
    limited,
    slide,
    recommond,
    empty,
    goodsListS,
    flashSale,
    titleAd,
    brandSwiper
  },
  data() {
    return {
      channelList: [{ channelId: 1, channelName: '' }], //频道列表
      currentChannel: { channelName: '推荐' }, //当前频道
      slideList: [], //幻灯片轮播图
      navData: [], //导航广告列表
      advertPositionList: [], //广告位列表
      noContent: false, //频道下无内容
      shortcutOpt: {},
      hasXsms: false, //是否有限时秒杀,限时秒杀只显示在第一个频道下
      homeEmpty: false, //首页没任何数据
      ticketsInfo: [],
      ticketsIsShow: false, //默认是false
      dataVersion: 0,
      recommendChannelList: [
        { channelId: 'recommend', channelName: '店主精选' }
      ], //店主精选频道
      olaFixedChannelList: [
        { channelId: 122, channelName: '美妆个护' },
        { channelId: 125, channelName: '居家生活' },
        { channelId: 124, channelName: '食品生鲜' },
        { channelId: 123, channelName: '母婴儿童' },
        { channelId: 127, channelName: '营养保健' },
        { channelId: 126, channelName: '箱包配饰' }
      ], //ola固定频道
      isOla: false,
      olaGoodsList: [],
      olaGoodsEmpty: false,
      olaIsMore: 0, //olaGoodsList 是否还有更多：0没 1有
      olaPageNum: 1,
      loadingFlag: false,
      flashSaleScrollPos: 0,
      totalChannelWidth: 0, //频道总宽
      // for店主精选
      userId: Number(window.getCookie('parentId')),
      shopInfo: {}, //店铺简介
      recommendGoodsList: [], //店铺单品
      recommendPageNum: 1,
      recommendPageSize: 10,
      recommendIsMore: null, //是否还有更多单品 0是1否
      brandData: {}, //品牌
      noShop: null, //店铺不存在
      noGoods: false //店铺存在但没单品
      // end of 店主精选
    }
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

    if (this.$refs.homeScrollBox) {
      this.$refs.homeScrollBox.scrollTop = sessionStorage.homeScrollH
    } else if (this.$refs.homeOlaScrollBox) {
      let item = `${this.$route.name}_ola_H`
      this.$refs.homeOlaScrollBox.$el.scrollTop = sessionStorage.getItem(item)
    } else if (this.$refs.recommendShop) {
      let item = `${this.$route.name}_recommend_H`
      this.$refs.recommendShop.$el.scrollTop = sessionStorage.getItem(item)
    }
  },
  created() {
    this.$root.$on('toAdvertDetail', this.toAdvertDetail)
    this.getChannels()
    this.shortcutOpt.search = {
      show: true
    }

    if (this.$route.query.loginTickets == 'tickets') {
      //登录送优惠券
      this.$http.get('order/login_gift.do').then(
        res => {
          this.ticketsInfo = res.data.tickets
          if (this.ticketsInfo) {
            this.ticketsIsShow = true
          }
        },
        err => {}
      )
    }
  },
  mounted() {
    let vm = this
    bus.$on('hasXsms', function(data) {
      vm.hasXsms = data
    })
  },
  methods: {
    //邓丽 关闭卡券包弹窗
    close() {
      this.ticketsIsShow = false
    },
    route_link(base, params, other) {
      // 其他外部链接
      if (other) window.location = base
      else {
        // 内部路由
        this.$router.push({
          name: base,
          params: params,
          query: params
        })
      }
    },
    //测试用户从活动领取优惠券或优惠券包
    promotionTicket() {
      let param = { promotionId: '3' }
      this.$http.post('order/get_tickets.do', param).then(res => {})
    },
    //获取频道列表
    getChannels() {
      let param = {
        params: { dataVersion: this.dataVersion }
      }
      this.$http.get('market/channel_list.do', param).then(res => {
        this.$vux.loading.hide()
        let data = res.data
        this.channelList = data.channelList.concat(
          this.recommendChannelList,
          this.olaFixedChannelList
        )

        if (!data.channelList || data.channelList.length === 0) {
          this.homeEmpty = true
          this.$vux.toast.text('首页暂无数据！')
          return false
        }
        // 设置选中的channel
        // 判断cookie中保存的channelID是否在this.channellist里
        // 兼容APP分享店铺
        if (this.$route.query.shop_id) {
          this.currentChannel = {
            channelId: 'recommend',
            channelName: '店主精选'
          }
        } else {
          if (window.getCookie('currentChannel')) {
            let cookieChannel = JSON.parse(window.getCookie('currentChannel'))
            let match = false
            for (let i = 0; i < this.channelList.length; i++) {
              const channel = this.channelList[i]
              if (channel.channelId == cookieChannel.channelId) {
                match = true
              }
            }
            if (match) {
              this.currentChannel = cookieChannel
            } else {
              this.currentChannel = this.channelList[0]
            }
          } else {
            this.currentChannel = this.channelList[0]
          }
        }

        if (this.currentChannel.channelId === 'recommend') {
          //加载 店主精选 内容
          this.getShopInfo()
        } else {
          this.getAdvertPos(this.currentChannel.channelId)
        }
      })
    },
    // 判断当前的频道ID是否在六个固定频道ID中
    inOlaFixedList(id) {
      let i = this.olaFixedChannelList.length
      while (i--) {
        if (this.olaFixedChannelList[i].channelId === id) {
          return true
        }
      }
      return false
    },
    loadMore() {
      if (this.loadingFlag) return false
      this.getAdvertPos(this.currentChannel.channelId)
    },
    scrollHandler(e) {
      if (this.currentChannel.showSeckill == 1) {
        this.flashSaleScrollPos = e.target.scrollTop
      }
      // if (this.currentChannel.channelId == this.channelList[0].channelId) {
      //   this.flashSaleScrollPos = e.target.scrollTop
      // }
      sessionStorage.setItem(`homeScrollH`, e.target.scrollTop)
    },
    //获取广告位列表
    getAdvertPos(channelId) {
      if (this.inOlaFixedList(channelId)) {
        // 走ola
        let param = {
          params: {
            gcIds: channelId,
            pageNum: this.olaPageNum
          }
        }
        this.loadingFlag = true
        this.$http.get('goods/get_category_goods.do', param).then(res => {
          let data = res.data
          this.olaIsMore = data.isMore
          this.olaGoodsList = this.olaGoodsList.concat(data.list)
          this.olaPageNum += 1
          this.loadingFlag = false
          this.isOla = true

          if (this.olaGoodsList.length === 0) {
            this.olaGoodsEmpty = true
            this.$vux.loading.hide()
            return false
          }
          this.$vux.loading.hide()
        })
      } else {
        this.isOla = false
        let param = {
          params: {
            channelId: channelId,
            dataVersion: this.dataVersion
          }
        }
        this.$http.get('market/advert_position_list.do', param).then(res => {
          let data = res.data
          this.advertPositionList = data.advertPositionList

          if (this.advertPositionList.length === 0) {
            this.noContent = true
            this.$vux.loading.hide()
          } else {
            this.noContent = false
            for (let i = 0; i < this.advertPositionList.length; i++) {
              if (this.advertPositionList[i].advertPositionTypeId == 4) {
                this.slideList.push(this.advertPositionList[i])
              }
              if (this.advertPositionList[i].advertPositionTypeId == 5) {
                this.navData.push(this.advertPositionList[i])
              }
            }
            this.$vux.loading.hide()
          }
        })
      }
      this.$nextTick(() => {
        this.tabCenter()
      })
    },
    // 初始化数据
    initData() {
      this.slideList = []
      this.navData = []
      this.advertPositionList = null
      this.olaGoodsList = []
      this.isOla = false
      this.olaPageNum = 1
      this.olaIsMore = 0
      this.recommendPageNum = 1
      this.recommendGoodsList = []
    },
    //切换频道
    switchChannel(item) {
      if(item == this.currentChannel) return false
      this.$vux.loading.show({
        text: '加载中...'
      })
      this.currentChannel = item
      window.setCookie('currentChannel', JSON.stringify(this.currentChannel))
      this.initData()
      if (item.channelId === 'recommend') {
        //加载 店主精选 内容
        this.getShopInfo()
      } else {
        this.getAdvertPos(item.channelId)
      }
    },
    getShopInfo() {
      let param = {
        params: {
          userId: this.userId
        }
      }
      this.$http.get('uc/get_shop_info_by_user_id.do', param).then(res => {
        let data = res.data
        this.shopInfo = data
        // 店铺不存在
        this.noShop = Object.keys(this.shopInfo).length === 0
        if (this.noShop) {
          this.$vux.loading.hide()
          return false
        }
        this.$vux.loading.hide()
        this.$nextTick(() => {
          this.tabCenter()
        })
        this.getShopGoods()
        this.getShopBrand()
      })
    },
    // 店主精选
    getShopGoods() {
      let param = {
        params: {
          pageNum: this.recommendPageNum,
          pageSize: this.recommendPageSize,
          userId: this.userId
        }
      }
      this.loadingFlag = true
      this.$http.get('uc/get_shop_goods.do', param).then(res => {
        let data = res.data
        if (!data.list || data.list.length === 0) {
          this.noGoods = true
          return false
        }
        this.recommendIsMore = data.isMore
        this.recommendGoodsList = this.recommendGoodsList.concat(data.list)
        this.recommendPageNum += 1
        this.loadingFlag = false
      })
    },
    // 获取品牌
    getShopBrand() {
      let param = {
        params: {
          userId: this.userId
        }
      }
      this.$http.get('uc/get_shop_brand.do', param).then(res => {
        let data = res.data
        this.brandData = data
      })
    },
    recommendLoadMore() {
      if (this.loadingFlag) return false
      this.getShopGoods()
    },
    routeLink(link, param) {
      this.$router.push({
        name: link,
        query: param
      })
    },
    // end of 店主精选
    tabCenter() {
      let activedDom = document.getElementsByClassName('selected')[0]
      if (activedDom) {
        let activeOffsetLeft = activedDom.offsetLeft
        let scrollLeft =
          activeOffsetLeft - window.innerWidth / 2 + activedDom.clientWidth / 2
        // 靠最左和最右的不位移
        if (scrollLeft <= 0) {
          scrollLeft = 0
        } else if (scrollLeft > this.totalChannelWidth - window.innerWidth) {
          scrollLeft = this.totalChannelWidth - window.innerWidth
        }
        let transformStyle = {
          transitionDuration: '600ms',
          transitionTimingFunction: 'cubic-bezier(0.1, 0.57, 0.1, 1)',
          transform: `translate(-${scrollLeft}px)`
        }
        Object.assign(this.$refs.channels.style, transformStyle)
      }
    },
    // 动态调整channel水平滚动宽度
    dynamicChannelWidth() {
      let length = 0
      this.channelList.forEach(function(ele) {
        length += ele.channelName.length
      })
      // this.tabCenter()
      this.totalChannelWidth = this.channelList.length * 20 + length * 15
      return {
        // this.channelList.length * 20中20是左右padding各10，length*15中15是字号
        // width: (this.channelList.length * 20 + length * 15) + 'px'
        // + 0.4(改成0.5兼容6sp)是个px2rem适配临时调整值
        width: (this.channelList.length * 20 + length * 15) / 37.5 + 0.5 + 'rem'
      }
    },
    // linkType跳转类型：0-非链接 1-商品链接 2-分类链接 3-品牌链接 4-外部链接 5-秒杀列表
    toAdvertDetail(item, advertPositionTypeId) {
      //火爆单品特殊处理
      if (advertPositionTypeId == 2) {
        this.$router.push({ name: 'detail', query: { goods_id: item.goodsId } })
        return false
      }
      let type = null
      if (item && item.linkObj && item.linkObj.linkType) {
        type = item.linkObj.linkType
      } else {
        this.showToast('链接数据为空！')
        return false
      }
      switch (Number(type)) {
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
            // 不止一个ID则拿与linkObj同级的advertId去请求另一个接口
            this.$router.push({
              name: 'advert_goods_list',
              query: { advertId: item.advertId }
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
    }
  },
  deactivated() {
    sessionStorage.setItem(
      'currentChannel',
      JSON.stringify(this.currentChannel)
    )
  }
}
</script>
<style lang="less" scoped>
.home-page {
  overflow: hidden;
  width: 100%;
  padding-bottom: 49px;
  .section {
    height: 100%;
    .home-scroller {
      background: #fff;
      .channels {
        top: 0;
        position: relative;
        font-size: 15px;
        display: flex;
        z-index: 100;
        line-height: 49px;
        .channel {
          text-align: center;
          padding: 0 10px;
          color: #86898b;
        }
        .selected {
          font-family: PingFangSC-Semibold;
          color: #fc6655;
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
    .main-content {
      position: absolute;
      height: 100%;
      width: 100%;
      overflow-y: auto;
      overflow-x: hidden;
      .slide {
        background: #fff;
      }
      .nav {
        background: #fff;
      }
      .limited {
        background: #fff;
      }
      .adverts {
        background: #fff;
      }
    }
    .ola-goods {
      height: 100%;
      padding-bottom: 48px;
      box-sizing: border-box;
      overflow-y: auto;
    }
  }
  .bottom-fill {
    width: 100%;
    height: 108px;
    background: #fafafa;
  }
  .coupons-window {
    width: 345px;
    height: 456px;
    background: url('../../assets/vouchers/user_icon_box_lingqu_1.png');
    background-size: 100% 100%;
    position: absolute;
    top: 95px;
    left: 50%;
    z-index: 1;
    margin-left: -172px;
    .title1 {
      width: 100%;
      margin-top: 28px;
      font-size: 20px;
      color: #ffffff;
      line-height: 28px;
      text-align: center;
    }
    .title2 {
      width: 100%;
      font-size: 14px;
      color: #ffffff;
      text-align: center;
      margin-bottom: 48px;
    }
    .del-btn {
      width: 12px;
      height: 12px;
      position: absolute;
      top: 15px;
      right: 15px;
    }
    .coupons-box {
      width: 100%;
      ul {
        height: 218px;
        overflow-y: scroll;
        .single-coupon {
          width: 290px;
          height: 104px;
          background: url('../../assets/vouchers/user_icon_box_lingqu_quan.png');
          background-size: 100% 100%;
          color: #ff6532;
          margin: 0 auto 10px;
          padding: 28px 0 0 24px;
          box-sizing: border-box;
          .left {
            float: left;
            width: 66px;
            text-align: left;
            .faceValue {
              font-size: 38px;
              color: #fc6655;
              transform: scaleX(0.5);
              width: 132px;
              margin-left: -33px;
            }
            .useCondition {
              font-size: 9px;
              color: #86898b;
            }
            .mianyou img {
              width: 46px;
              height: 24px;
            }
            .discountValue {
              font-size: 38px;
              color: #fc6655;
              transform: scaleX(0.5);
              width: 132px;
              margin-left: -33px;
            }
            .discount-text {
              font-size: 10px;
              color: #fc6655;
              line-height: 20px;
            }
          }
          .right {
            float: left;
            margin-left: 9px;
            width: 190px;
            .ticketName {
              font-size: 16px;
              color: #1b1b1b;
              line-height: 18px;
              margin-bottom: 9px;
              margin-top: 7px;
            }
            .useEndTime {
              font-size: 10px;
              color: #86898b;
              line-height: 10px;
            }
          }
        }
      }
    }
    .coupons-btn {
      width: 265px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      background: linear-gradient(-217deg, #cccccc 0%, #fc6655 100%);
      box-shadow: 0 4px 13px 0 rgba(255, 151, 69, 0.44);
      border-radius: 51px;
      font-size: 14px;
      color: #ffffff;
      margin: 40px auto 0;
    }
  }
}

.rec-box {
  width: 100%;
  overflow: auto;
  padding-bottom: 48px;
  .shop {
    background: #fff;
    .bg {
      width: 375px;
      height: 147px;
      display: block;
    }
    .avatar {
      width: 45px;
      height: 45px;
      border-radius: 50%;
      position: relative;
      top: -22.5px;
      left: 165px;
    }
    .shop-name {
      font-family: PingFangSC-Semibold;
      font-size: 16px;
      color: #1b1b1b;
      line-height: 18px;
      text-align: center;
      margin-top: -20px;
    }
    .desc {
      font-family: PingFangSC-Regular;
      font-size: 12px;
      color: #959595;
      line-height: 16px;
      text-align: center;
      padding-top: 6px;
      padding-bottom: 26px;
    }
  }
  .single {
    background-color: #fff;
    .headline {
      height: 64px;
      font-family: PingFangSC-Semibold;
      font-size: 18px;
      color: #1b1b1b;
      line-height: 64px;
      padding: 0 12px;
      background: #fff;
    }
    ul {
      overflow: hidden;
      padding: 0 6px 50px 6px;
      li {
        float: left;
        overflow: hidden;
        margin: 12px 6px;
        width: 166px;
        .pic-box {
          height: 166px;
          width: 166px;
          margin-bottom: 17px;
          padding: 16px 10px 4px;
          .goods-img {
            width: 146px;
            height: 146px;
          }
        }
        .goods-name {
          width: 100%;
          height: 28px;
          line-height: 28px;
          font-size: 14px;
          color: #1b1b1b;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
        }
        .tag {
          line-height: 13px;
          height: 20px;
          position: relative;
          margin-bottom: 6px;
          background: white;
          z-index: 100;
          .type-tag {
            .baoshui,
            .zhiyou,
            .miaosha {
              position: relative;
              height: 18px;
              width: 36px;
              display: inline-block;
            }
          }
          .new {
            height: 13px;
            width: 27px;
          }
          .hot {
            height: 13px;
            width: 27px;
          }
          .rec {
            height: 13px;
            width: 27px;
          }
        }
        .price {
          font-size: 14px;
          height: 20px;
          vertical-align: bottom;
          margin-top: 4px;
          margin-bottom: 4px;
          .activity {
            font-family: PingFangSC-Semibold;
            font-size: 18px;
            color: #fc6655;
            letter-spacing: 0;
            margin-right: 5px;
            line-height: 14px;
          }
          .origin {
            font-family: PingFangSC-Regular;
            font-size: 13px;
            color: #86898b;
            line-height: 12px;
            text-decoration: line-through;
          }
        }
        .goods-price {
          width: 100%;
          font-size: 16px;
          color: #fc6655;
        }
      }
      li:nth-of-type(even) {
        margin-right: 0;
      }
    }
  }
}
</style>
