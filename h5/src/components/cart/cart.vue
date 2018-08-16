<template>
  <!--有商品-->
  <div class="cart-page">
    <div v-if="visible" style="height: 100%;">
      <div class="cart-content" v-if="cartList.length > 0">
        <div class="cart-top-finish" :class="{ 'cart-top-editor': !editor_bool}">
          <div class="editor-top-left" v-if='editor_bool&&(need_price >0 )'>再选{{need_price}}元商品，可享受包邮服务</div>
          <div class="editor-top-left" v-if='editor_bool&&(need_price <= 0 )'>当前购买金额已包邮</div>
          <div class="editor-top-left goods-num" v-if='!editor_bool'>总共有{{goods_num}}件商品</div>
          <div class="editor-top-right">
            <div class="cart-editor editor" @click='editor' v-if='!editor_bool'>完成</div>
            <span class="cart-editor" @click='editor' v-if='editor_bool'>编辑</span>
            <!-- <div class="message-center">
                      <img src="../../assets/commom/user_icon_tab_news.png" class="message-icon"/>
                      <img src="../../assets/commom/user_icon_tabr_ed.png" class="red-point"/>
                    </div> -->
          </div>
        </div>
        <div class="cart-lis-box" id="cart-lis-box" v-if="cartList.length > 0">
          <!-- <load-more :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded"> -->
          <div class="cart-lis-content" v-if='cartList'>
            <div v-for="(item,index) in cartList" :key="index" class="cartList_crat_top">
              <div class="cart-lis" :class="[ item.statusObj.code!=0 ? 'cart-lis-fail' : '' ]">
                <!-- 失效商品 -->
                <div v-if='item.statusObj.top' class="cart_title">
                  <!-- <img src="../../assets/cart/h5_icon_xiaoshi.png" /> -->{{item.statusObj.msg}}
                </div>
                <!-- 秒杀价：¥99.00  5月24日 10:00开抢 -->
                <div class="cart_preheat" v-if='item.goodsPromoObj&&item.goodsPromoObj.promoStatus==1&&item.goodsPromoObj.promoType==3'>
                  <img src="../../assets/cart/icon_clock@2x.png" class="xsms-icon" />
                  <span>
                    秒杀价:&nbsp; ￥{{item.goodsPromoObj.promoPrice}}&nbsp; {{getLocalTimeYM(item.goodsPromoObj.promoBeginTime)}}&nbsp; {{getLocalTimeHM(item.goodsPromoObj.promoBeginTime)}}
                    开抢
                  </span>
                </div>
                <div class="cart-lis-desc">
                  <span class="cart-lis-select" v-if="!(item.statusObj.code!=0 && editor_bool)" :class="{ active: item.check && item.statusObj.code==0, 'invalid-active': item.check && item.statusObj.code!=0 && !editor_bool}"
                    @touchend="select(index)"></span>
                  <div class="cart-lis-image" :class="{'invalid-cart-lis-image': item.statusObj.code!=0 && editor_bool}" @click="goto_detail(item)">
                    <div class="mask" v-if='item.statusObj.code == 1'>已下架</div>
                    <div class="mask" v-if='item.statusObj.code == 2'>已抢光</div>
                    <div class="mask" v-if='item.statusObj.code == 3'>已失效</div>
                    <img class="soon_soldout" src="../../assets/home/soon_soldout@3x.png" v-if="item.isStorageAlarm == 1">
                    <div class="mask limit" v-if='item.orderMaxNum'>限购{{item.orderMaxNum}}件</div>
                    <div class="mask limit" v-if='item.orderMinNum > 1 && !item.orderMaxNum'>最少购买{{item.orderMinNum}}件</div>
                    <x-img class="cart-lis-pic" :default-src='defaultLazyImg()' :src="item.skuImage + imageSize(200,200)" container=".cart-lis-box"></x-img>
                  </div>
                  <div class="cart-lis-info" @click="goto_detail(item)">
                    <div class="cart-lis-name">
                      <img v-if="item.purchaseType==1" class="order-lis-tag" src="../../assets/cart/image_bq_bs@2x.png" width="100%" />
                      <img v-if="item.purchaseType==2" class="order-lis-tag" src="../../assets/cart/image_bq_zy@2x.png" width="100%" />
                      <img v-if='item.goodsPromoObj&&item.goodsPromoObj.promoType==3' class="order-lis-tag" src="../../assets/cart/image_bq_ms@2x.png"
                        width="100%" />
                      <span>{{item.goodsName}}</span>
                    </div>
                    <div class="cart-lis-bottom">
                      <div class="cart-lis-size" v-if="item.statusObj.code == 0">
                        <span>{{item.skuName}}</span>
                      </div>
                      <div class="cart-lis-price-box" v-if="item.statusObj.code==0&&item.goodsPromoObj&&item.goodsPromoObj.promoType==3&&item.goodsPromoObj.promoStatus==2">
                        <span class="cart-lis-price">¥{{item.goodsPromoObj.promoPrice}}</span>
                        <span class="cart-lis-goods_price-box">¥{{item.skuPrice}}</span>
                      </div>
                      <div class="cart-lis-price-box" v-else-if="item.statusObj.code==0">
                        <span class="cart-lis-price">¥{{item.skuPrice}}</span>
                      </div>
                      <span class="cart-lis-num-box editor-num-box" v-if='!editor_bool&&item.statusObj.code==0'>
                        <span class="cart-lis-add" @touchend="add(item.cartId,index)" :class="{ cart_lis_add_highlight: item.add_high }"></span>
                        <input class="cart-lis-num" v-model.number="item.skuCount" type="tel" v-on:blur="num_blur(item.cartId,index,item.skuCount)">
                        <span class="cart-lis-reduce" @touchend="reduce(item.cartId,index)" :class="{ cart_lis_reduce_highlight: item.reduce_high }"></span>
                      </span>
                      <div class="invalid-tishi" v-if="item.statusObj.code == 1">抱歉，该商品目前已下架</div>
                      <div class="invalid-tishi" v-if="item.statusObj.code == 2">抱歉，该商品目前已售罄</div>
                      <div class="invalid-tishi" v-if="item.statusObj.code == 3">抱歉，该商品活动已失效</div>
                      <span class="cart-lis-num-box finish-num-box" v-if='!(!editor_bool&&item.statusObj.code==0)'>
                        <span>x{{item.skuCount}}</span>
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        <div class="cart-footer" v-if="cartList.length > 0">
          <div class="cart-footer-select-box" @touchend="select_all()">
            <span class="cart-select-all" :class="{ 'editor-select-all-active': !editor_bool && selectAll,'finish-select-all-active': editor_bool && selectAll }"></span>
            <span class="cart-select-all-text">全选</span>
          </div>
          <!--<div class="cart-footer-line" v-if='editor_bool'></div>-->
          <div class="cart-footer-count" v-if='editor_bool'>
            <div class="cart-footer-count-top">
              <span class="cart-footer-count-title">合计:￥</span>
              <span class="cart-footer-price">{{price}}</span>
            </div>
            <div class="cart-footer-count-bottom">
              <span class="cart-footer-count-total">总额:￥{{total_price}}</span>
              <span class="cart-footer-count-favourable">优惠:￥{{favourable_price}}</span>
            </div>
          </div>
          <div class="cart-footer-buy" @click="goto_buy()" v-if='editor_bool'>去结算({{goods_num}})</div>
          <div class="cart-footer-buy delete-select" @click="remove()" v-if='!editor_bool'>删除已选({{goods_num}})</div>
        </div>
      </div>

      <!--无商品-->
      <div class="cart-content-none" v-if="cartList.length <= 0">
        <div class="cart-content-none-box">
          <img class="cart-content-none-pic" src="../../assets/empty/nogoods.png" width="100%" />
          <p class="cart-content-none-text">你的商品空空如也，快去选购商品吧~</p>
          <div class="go-shopping" @click="goShopping">去逛逛</div>
        </div>
      </div>

      <div class="zhezhao" :class="{none : zhezhao_show}"></div>

      <!-- 包邮提示弹窗 -->
      <div class="dialog" v-if="show_modal">
        <div class="bg-ground"></div>
        <div class="content">
          <img class="pic" src="../../assets/user_icon_box_chaetishi_null.png" />
          <p class="title">还差
            <span class="price">{{need_price}}元</span>
          </p>
          <p class="desc">即可享受99元包邮服务</p>
          <div class="footer">
            <div @click="modal_hide()">再选选</div>
            <div class="sure" @click="sure_go()">去结算</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import bus from '@/util/bus'

  export default {
    name: 'cart',
    data: function () {
      return {
        data: [], //购物车列表
        selectAll: false, //全选
        goods_num: 0, //结算或删除已选商品数量
        check_num: 0, //选中商品数
        cart_ids: [], //提交订单的cart_id
        zhezhao_show: false, //是否显示遮罩层
        show_modal: false, //是否满足包邮
        area_id: '4524161', //区域id
        //cart_count: "",       //购物车商品总数
        editor_bool: true, //控制编辑、完成显示
        flag: false, //点击去结算的时候，页面跳转慢，处理多次点击问题
        wei_url: '',
        pageNum: 1,
        cartList: [], //购物车列表
        invalidIndex: -1
      }
    },
    created() {
      this.getCartList()
    },
    computed: {
      visible() {
        return ['/cart'].indexOf(this.$route.path) > -1
      },
      //计算折扣价 非编辑状态结算时不计入失效商品
      price() {
        var price = 0
        for (var i = 0; i < this.cartList.length; i++) {
          if (
            this.cartList[i].check == true &&
            this.editor_bool &&
            this.cartList[i].statusObj.code == 0
          ) {
            if (
              this.cartList[i].goodsPromoObj &&
              this.cartList[i].goodsPromoObj.promoStatus == 2
            ) {
              price +=
                this.cartList[i].goodsPromoObj.promoPrice *
                this.cartList[i].skuCount
            } else {
              price += this.cartList[i].skuPrice * this.cartList[i].skuCount
            }
            // console.log('price', price)
          }
        }
        return parseFloat(price).toFixed(2)
      },
      //计算总价格 非编辑状态结算时不计入失效商品
      total_price() {
        var total_price = 0
        for (var i = 0; i < this.cartList.length; i++) {
          if (
            this.cartList[i].check == true &&
            this.editor_bool &&
            this.cartList[i].statusObj.code == 0
          ) {
            total_price += this.cartList[i].skuPrice * this.cartList[i].skuCount
          }
        }
        return parseFloat(total_price).toFixed(2)
      },
      //计算优惠价格
      favourable_price: function () {
        var favourable_price = 0
        favourable_price = this.total_price - this.price
        return parseFloat(favourable_price).toFixed(2)
      },
      need_price: function () {
        var difference = parseFloat(99.0 - this.price).toFixed(2)
        if (difference >= 0) {
          return difference
        } else {
          return 0
        }
      }
    },
    methods: {
      //控制编辑、完成显示
      editor() {
        this.editor_bool = !this.editor_bool
        //初始化
        this.goods_num = 0
        this.check_num = 0
        this.all_num = 0
        this.selectAll = false
        for (var i = 0; i < this.cartList.length; i++) {
          this.cartList[i].check = false
        }
      },
      //获取购物车列表
      getCartList() {
        this.zhezhao_show = false
        let param = {
          params: {
            pageNum: this.pageNum,
            pageSize: 10
          }
        }
        this.$http.get('order/cart_list.do', param).then(res => {
          this.zhezhao_show = true
          var cart_list = res.body.cartList
          cart_list.forEach((ele, index) => {
            ele.skuImage = ele.skuImage
            let current = this.check_status(ele, index)
            ele.check = false
            if (current.statusObj.code == 0) {
              this.cartList.unshift(ele)
            } else {
              this.cartList.push(ele)
            }
            this.btnAvailable(ele)
          })
        })
      },
      //商品是否失效
      check_status(item, index) {
        let statusObj = {}
        if (
          item.goodsStatus == 1 ||
          item.skuStatus == 0 ||
          item.isSalable == 0 ||
          (item.goodsPromoObj && item.goodsPromoObj.promoStatus == 0)
        ) {
          if (this.invalidIndex == -1) {
            statusObj.top = true
            this.invalidIndex = 1
          }
          if (item.isSalable == 0) {
            // 库存不足
            statusObj.code = 2
            statusObj.msg = '失效商品'
          } else if (item.goodsPromoObj && item.goodsPromoObj.promoStatus == 0) {
            // 活动失效
            statusObj.code = 3
            statusObj.msg = '失效商品'
          } else {
            statusObj.code = 1
            statusObj.msg = '失效商品'
          }
        } else {
          statusObj.code = 0
          statusObj.msg = ''
        }
        item.statusObj = statusObj
        // console.log('cart-item', item)
        return item
      },
      //跳转商品详情
      goto_detail(item) {
        if (this.editor_bool) {
          this.$router.push({
            name: 'detail',
            query: {
              goods_id: item.goodsId
            }
          })
        }
      },
      //数量
      changeNum(goods, num) {
        //最小限购数量
        if (goods.orderMinNum > 0 && num < goods.orderMinNum) {
          return goods.orderMinNum
        }
        if (goods.orderMaxNum > 0 && num > goods.orderMaxNum) {
          return goods.orderMaxNum
        }
        return num
      },
      //增加、减少按钮是否可用
      btnAvailable(goods) {
        if (goods.isSalable == 0) {
          goods.add_high = false
        } else {
          goods.add_high = true
        }
        if (goods.orderMaxNum != 0 && goods.skuCount >= goods.orderMaxNum) {
          goods.add_high = false
        } else {
          goods.add_high = true
        }
        if (
          goods.skuCount <= 1 ||
          (goods.orderMinNum != 0 && goods.skuCount <= goods.orderMinNum)
        ) {
          goods.reduce_high = false
        } else {
          goods.reduce_high = true
        }
      },
      //加
      add(cart_id, $index) {
        let addGoods = this.cartList[$index]
        if (!this.cartList[$index].add_high) return
        addGoods.skuCount++

          this.btnAvailable(addGoods)
        let param = {
          cartId: cart_id,
          skuCount: addGoods.skuCount
        }
        this.$vux.loading.show({
          text: 'Loading'
        })
        this.$http.post('order/cart_edit.do', param).then(res => {
          this.globalUpdateCartCount()
          this.$vux.loading.hide()
        })
      },
      //减
      reduce(cart_id, $index) {
        if (!this.cartList[$index].reduce_high) return
        let reduceGoods = this.cartList[$index]
        reduceGoods.skuCount--
          // if (reduceGoods.orderMinNum > 0 && reduceGoods.skuCount < reduceGoods.orderMinNum) {
          //      reduceGoods.skuCount = reduceGoods.orderMinNum
          //     return
          // }
          this.btnAvailable(reduceGoods)
        let param = {
          cartId: cart_id,
          skuCount: reduceGoods.skuCount
        }
        this.$vux.loading.show({
          text: 'Loading'
        })
        this.$http.post('order/cart_edit.do', param).then(res => {
          this.globalUpdateCartCount()
          this.$vux.loading.hide()
        })
      },
      //输入框失去焦点
      num_blur(cart_id, $index, num) {
        var blurGoods = this.cartList[$index]
        num = parseInt(num)
        blurGoods.skuCount = this.changeNum(blurGoods, num)
        this.btnAvailable(blurGoods)
        this.$http
          .post('order/cart_edit.do', {
            cartId: cart_id,
            skuCount: blurGoods.skuCount
          })
          .then(res => {
            this.$vux.loading.hide()
          })
      },
      //删除
      // @todo删除没全选时有bug
      remove() {
        if (this.goods_num == 0) {
          this.showToast('至少选择一件商品哦')
          return false
        }
        const _this = this
        _this.$vux.confirm.show({
          content: '确定删除订单?',
          hideOnBlur: true,
          onConfirm() {
            for (var i = 0; i < _this.cartList.length; i++) {
              if (_this.cartList[i].check == true) {
                _this.cart_ids.push(_this.cartList[i].cartId)
              }
            }
            _this.$http
              .post('order/cart_del.do', {
                cartIdList: _this.cart_ids
              })
              .then(res => {
                _this.$vux.loading.hide()
                _this.cart_ids = []
                _this.cartList = []
                _this.invalidIndex = -1
                _this.getCartList()

                _this.globalUpdateCartCount()
                bus.$emit('cart-count-change')
                //初始化
                _this.goods_num = 0
                _this.check_num = 0
                _this.all_num = 0
                for (var i = 0; i < _this.cartList.length; i++) {
                  _this.cartList[i].check = false
                }
              })
          }
        })
      },
      goShopping() {
        this.$router.push({
          name: 'home'
        })
      },
      //选择商品
      select(index) {
        if (this.editor_bool && this.cartList[index].orderMaxNum) {
          if (this.cartList[index].orderMaxNum < this.cartList[index].skuCount) {
            this.showToast('数量超出范围')
            return
          }
        }
        //选择，取消选择
        this.cartList[index].check = !this.cartList[index].check
        //计算选择的商品数量，非编辑状态结算时不计入失效商品
        if (!(this.editor_bool && this.cartList[index].statusObj.code != 0)) {
          if (this.cartList[index].check) {
            this.goods_num++
          } else {
            this.goods_num--
          }
        }
        //判断选中商品数是否满足全选
        this.check_num = 0
        //完成状态失效商品数量
        let invalid_num = 0
        for (var i = 0; i < this.cartList.length; i++) {
          if (this.editor_bool && this.cartList[i].statusObj.code != 0) {
            invalid_num++
          }
          if (this.cartList[i].check == true) {
            this.check_num++
          }
        }
        if (
          this.check_num == this.cartList.length - invalid_num &&
          this.check_num != 0 &&
          this.cartList.length - invalid_num != 0
        ) {
          this.selectAll = true
        } else {
          this.selectAll = false
        }
      },

      //全选
      select_all: function () {
        this.goods_num = 0
        this.selectAll = !this.selectAll
        //设置选中状态
        for (var i = 0; i < this.cartList.length; i++) {
          if (this.selectAll) {
            this.cartList[i].check = true
            this.goods_num++
              //非编辑状态结算时不计入失效商品
              if (this.editor_bool && this.cartList[i].statusObj.code != 0) {
                this.goods_num--
                  this.cartList[i].check = false
              }
          } else {
            this.cartList[i].check = false
            this.goods_num = 0
          }
        }
      },

      //关闭弹窗
      modal_hide: function () {
        this.show_modal = false
      },

      //去结算按钮
      goto_buy: function () {
        if (this.goods_num == 0) {
          this.showToast('至少选择一件商品哦')
          return false
        }
        //是否满足99元包邮
        if (this.price < 99) {
          this.show_modal = true
        } else {
          this.sure_go()
        }
      },
      //结算
      sure_go: function () {
        let cartIds = []
        for (var i = 0; i < this.cartList.length; i++) {
          let goods = this.cartList[i]
          //-1代表已到达最大购买数量
          if (goods.orderMaxNum == -1) {
            this.showToast('已到达最大购买数量')
            return
          }
          if (this.cartList[i].check) {
            cartIds.push(goods.cartId)
          }
        }

        this.$router.push({
          name: 'order_sure',
          query: {
            cartIds: cartIds.join(','),
            from: 'cart'
          }
        })
      }
    },
    filters: {
      maxlize: function (value) {
        if (value == 0) return ''
        return value
      }
    }
  }

</script>
<style lang="less">
  @import '../../styles/index.less';
  .dialog {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    z-index: 9999;
    .bg-ground {
      position: absolute;
      top: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.4);
    }
    .content {
      width: 310px;
      height: 296px;
      border-radius: 8px;
      background: #fff;
      position: relative;
      top: 50%;
      left: 50%;
      margin-left: -155px;
      margin-top: -148px;
      .pic {
        margin-top: 47px;
        margin-left: 69px;
        width: 146px;
        height: 100px;
      }
      .title {
        margin-top: 10px;
        font-size: 18px;
        font-weight: 600;
        color: #1b1b1b;
        text-align: center;
        span {
          color: #fc6655;
        }
      }
      .desc {
        text-align: center;
        font-size: 14px;
        color: #86898b;
        margin-top: 7px;
      }
      .footer {
        overflow: hidden;
        margin-top: 25px;
        >div {
          width: 134px;
          height: 38px;
          border: 1px solid #1b1b1b;
          line-height: 38px;
          text-align: center;
          font-size: 16px;
          color: #1b1b1b;
          border-radius: 100px;
          float: left;
          margin-left: 15px;
        }
        .sure {
          background: linear-gradient(-135deg, #ff8996 0%, #fc6655 100%);
          box-shadow: 0 2px 10px 0 rgba(255, 76, 138, 0.2);
          border: 0;
          color: #fff;
          margin-left: 12px;
        }
      }
    }
  }

  .cart-lis-box .mint-cell-title {
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 0;
  }

  .cart-lis-box .mint-cell-wrapper {
    background: none;
    padding: 0;
  }

  .cart-lis-box .mint-cell-swipe-button {
    display: flex;
    align-items: center;
    justify-content: center;
    .px2rem(width, 130);
    height: 100%;
    background: #ec3142;
    color: #fff;
    font-size: 16px;
    padding: 0;
  }

  .mint-msgbox {
    width: 70%;
  }

  .mint-msgbox-message {
    color: #000;
    line-height: initial;
  }

  .mint-msgbox-content {
    padding: 20px;
    min-height: inherit;
  }

  /*less*/

  .absolute() {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }

  .clear-float() {
    content: '';
    display: block;
    clear: both;
  }

  .border-radius(@radius) {
    border-radius: @radius;
  }

  .vertical-align() {
    &:before {
      content: '';
      display: inline-block;
      height: 90%;
      vertical-align: middle;
    }
  }

  /*包邮弹框*/

  .modal() {
    .absolute;
    z-index: 9999;
    text-align: center;
    .vertical-align;
    >.modal-content {
      position: relative;
      z-index: 1;
      display: inline-block;
      .pxrem(width, 295);
      .pxrem(height, 296);
      color: white;
      background-color: rgba(0, 0, 0, 0.7);
      .border-radius(4px);
      vertical-align: middle;
      animation: 0.2s ease-out backwards;
    }
    .modal-header,
    .modal-footer {
      padding: 0;
    }
    .modal-header {
      .px2rem(margin, 40, 0);
      >img {
        .pxrem(width, 131);
        .pxrem(height, 111);
      }
    }
    .modal-footer {
      box-sizing: border-box;
      .px2rem(height, 90);
      .px2rem(margin-top, 54);
      &:after {
        .clear-float;
      }
      div {
        float: left;
        box-sizing: border-box;
        .pxrem(width, 82);
        .pxrem(height, 34);
        .pxrem(line-height, 34);
        .border-radius(24px);
        font-size: 14px;
      }
      div:first-child {
        color: #272728;
        border: 1px solid #272728;
        .pxrem(margin-left, 43);
      }
      div:last-child {
        color: #ff6532;
        border: 1px solid #ff6532;
        .pxrem(margin-left, 45);
      }
    }
    .modal-body {
      box-sizing: border-box;
      font-size: 16px;
      color: #272728;
      >span {
        display: block;
        text-align: center;
      }

      .modal-price {
        color: #ff6532;
      }
      .modal-money {
        font-size: 14px;
        color: #838388;
        .px2rem(margin-top, 16);
      }
    }
    >.modal-shade {
      .absolute;
    }
    &.has-shade {
      >.modal-content {
        color: black;
        background-color: white;
      }
      >.modal-shade {
        background-color: rgba(0, 0, 0, 0.7);
      }
    }
    &.fade-scale-in>.modal-content {
      animation-name: fade-scale-in;
    }
  }

  .fade-scale-in() {
    @keyframes fade-scale-in {
      0% {
        opacity: 0;
        transform: scale(0);
      }
      100% {
        opacity: 1;
        transform: scale(1);
      }
    }
  }

  .modal {
    .modal;
  }

  .fade-scale-in;

</style>
<style scoped lang="less">
  @import '../../styles/index.less';
  @import '../../styles/cart.less';

</style>
