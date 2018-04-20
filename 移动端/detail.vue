<template>
<div>
  <div @scroll.stop="scrollHandler" class="detail-container" ref="detailRef" id="vux_view_box_body">
    <div class="goods-sild">
      <swiper dots-position="center" :show-desc-mask="false" height="325px" :auto="true">
        <swiper-item v-for="(item, index) in goods.goodsImage" :key="index">
          <img :src="item+ imageSize(375,327,2)" @error="setErrorImg($event,375,327)">
        </swiper-item>
      </swiper>
    </div>
    <!-- 商品信息 -->
    <div class="goods-info">
      <div class="clearfix">
        <goodsPrice class="price" fontClass="size36" v-if="selectshowSku" :price="(selectshowSku.seckillPrice?selectshowSku.seckillPrice:selectshowSku.skuPrice)+''" :oldPrice="(selectshowSku.seckillPrice?selectshowSku.skuPrice:0)+''">
        </goodsPrice>
        <div class="activity" v-if="selectshowSku&&selectshowSku.activeStatus">
          <div class="right" v-if="selectshowSku.activeStatus==2">
            <div v-if="!selectshowSku.counter_end">
              <p class="conttile">抢购进行中</p>
              <p class="contTime">
                 <span class="ti" v-if="countDownTime[0]!=0">{{countDownTime[0] | numDouble}}天</span>
                <span class="symbol" v-if="countDownTime[0]!=0">天</span>
                <span class="ti" >{{countDownTime[1] | numDouble}}</span>
                <span>：</span>
                <span class="ti">{{countDownTime[2] | numDouble}}</span>
                <span>：</span>
                <span class="ti">{{countDownTime[3] | numDouble}}</span>
              </p>
            </div>
            <p v-if="selectshowSku.counter_end" class="contclose">已结束</p>
          </div>
          <div class="right_now" v-if="selectshowSku.activeStatus==1">
            <p>{{qiangou_text}}</p>
          </div>
        </div>
      </div>
      <p class="goodsTitle bold">
        <img class="goods-lable" v-if="selectshowSku && selectshowSku.seckillPrice" src="../assets/image_bq_ms@2x.png" alt="">
        <!-- 直邮 -->
        <img class="goods-lable" v-if="goods.purchaseType==2" src="../assets/image_bq_zy@2x.png" alt="">
        <!-- 保税 -->
        <img class="goods-lable" v-if="goods.purchaseType==1" src="../assets/image_bq_bs@2x.png" alt="">{{goods.goodsName}}
      </p>
      <!-- <p class="storeName" v-if="selectshowSku && selectshowSku.storeName">发货地：{{selectshowSku.storeName}}</p> -->
    </div>
    <!-- 服务标签 -->
    <div class="ser-laber" @click="serviceDialog= true" v-if="goods.goodsService && goods.goodsService.length >0">
      <div class="left">
        <p v-for="(s,i) in goods.goodsService" :key="i">
          <img src="../assets/detail/user_icon_tag_red.png" class="ser-icon" alt="">{{s.markName}}
        </p>
      </div>
      <img src="../assets/icon_gengduo@2x.png" class="arrow-right" alt="">
    </div>
    <!-- 商品规格 -->
    <div v-if="goods.goodsStatus==2&&goods.isOne==0" class="specs" @click="setDialog(true)">
      <p>查看商品规格</p>
      <img src="../assets/icon_gengduo@2x.png" class="arrow-right" alt="">
      <span v-if="selectSkuGoods">已选：
            <span v-for="p in selectSkuGoods.specList" :key="p.attrValueId">{{attrMap[p.attrValueId]}}</span></span>
    </div>
    <!-- 商品介绍购买须知 -->
    <div class="tab-box">
      <tab :line-width="2" active-color="#fc6655">
        <tab-item class="vux-center" selected @on-item-click="changeTab">商品介绍</tab-item>
        <tab-item class="vux-center" :disabled="goods.goodsBuyNote&&goods.goodsBuyNote.length==0" @on-item-click="changeTab">购买须知</tab-item>
      </tab>
      <div>
        <p v-for="(item, index) in tabData.data" :key="index">
          <!-- <img class="tab-img" :src="item+'?imageView2/1/'"> -->
          <x-img :src="item+'?imageslim'" :default-src="defaultLazyImg()" class="tab-img" :offset="-10" container="#vux_view_box_body"></x-img>
        </p>
      </div>
    </div>
    <recommend :goodsList="recommendList"></recommend>

    <!-- 选择规格弹层 -->
    <div v-transfer-dom>
      <popup v-model="idDialog" position="bottom" max-height="100%" @on-hide="onHideIdDialog" class="pop-dialog">
        <!-- 用来站位的，如果去掉 absolute不会撑高弹框 -->
        <div class="top-div"></div>
        <div class="dialog-content">
          <img class="close-icon" src="../assets/version3/user_icon_box_down@2x.png" alt="" @click="idDialog=false">
          <div class="goods">
            <div class="img-box">
              <img :src="selectSkuGoods.skuImage+'?imageView2/1/w/200/h/200'" alt="" @error="setErrorImg($event,108,108)" v-if="selectSkuGoods && selectSkuGoods.skuImage">
            </div>
            <div class="info" v-if="selectSkuGoods">
              <goodsPrice fontClass="size24" :price="(selectSkuGoods.stock.activePrice?selectSkuGoods.stock.activePrice:selectSkuGoods.skuPrice)+''" :oldPrice="(selectSkuGoods.stock.activeId?selectSkuGoods.skuPrice:0)+''">
              </goodsPrice>
              <p class="default-spec">已选：
                <span v-for="p in selectSkuGoods.specList" :key="p.attrValueId">{{attrMap[p.attrValueId]}} </span>
              </p>
              <p class="limited" v-if="selectSkuGoods&&selectSkuGoods.orderMaxNum">限购{{selectSkuGoods.orderMaxNum}}件</p>
            </div>
          </div>
          <div class="specifications">
            <p v-for="(item,k) in specList" :key="k">
              <span class="attr-name">{{item.attrName}}:</span>
              <button v-for="attr in item.list" :key="attr.attrValueId" :v-if="changeKey" :class="{'spec-select':selectSpec[k]==attr.attrValueId,'gray-spec':attr.salableInventory==0}" @click="specSelect(k,attr)">{{attr.attrValueName}}</button>
            </p>
          </div>
          <div class="goods-num">
            <p>数量 :</p>
            <div v-if="selectSkuGoods">
              <p class="limited" v-if="selectSkuGoods&&selectSkuGoods.stock.salableInventory">库存{{selectSkuGoods.stock.salableInventory}}件</p>
              <p class="cart_lis_reduce_highlight icon" @click="addCount(-1)" :class="{'reduce-icon': goodNum <= 1}"></p>
              <input class="input-icon num" v-model="goodNum" v-on:blur="num_blur(selectSkuGoods)" type="tel">
              <p class="cart_lis_add_highlight icon" @click="addCount(1)" :class="{'add-icon': this.goodNum >= this.selectSkuGoods.stock.salableInventory}"></p>
            </div>
          </div>
          <div v-if="selectSkuGoods" class="btns">
            <router-link :to="'/home'" class="home">
              <div class="icon"></div>
            </router-link>
            <router-link :to="'/set'" class="set">
              <div class="icon"></div>
            </router-link>
            <div class="cartbtns cart" @click="toOtherPage('cart')">
              <div class="within10" :class="{'within100':cartCount > 9 && cartCount < 100}" v-if="cartCount > 0 && cartCount < 100">{{cartCount}}</div>
              <div class="over99" v-else-if="cartCount > 99">99+</div>
              <!-- <img src="../assets/home/user_Toolbar_icon_gouwuche.png"> -->
              <div class="icon"></div>
              <!-- <span>购物车</span> -->
            </div>
            <div class="purchase-btn" v-if="selectSkuGoods.stock.salableInventory > 0">
              <button @click="addCart()" class="add-cart">加入购物车</button>
              <button @click="newBuy()" class="buy">立即购买</button>
            </div>
            <!-- TODO -->
            <div class="no-inventory" v-if="selectSkuGoods.stock.salableInventory <= 0 && selectshowSku.activeStatus==1" @click="$vux.toast.text('活动未开始')">
              活动未开始
            </div>
            <div class="no-inventory" v-if="selectSkuGoods.stock.salableInventory <= 0 && selectshowSku.activeStatus!=1" @click="$vux.toast.text('没有库存')">
              没有库存
            </div>
          </div>
        </div>
      </popup>
    </div>
    <!-- 服务标签弹窗 -->
    <div v-transfer-dom>
      <popup v-model="serviceDialog" position="bottom" max-height="100%" class="service-dialog">
        <img class="close-icon" src="../assets/version3/user_icon_box_down@2x.png" alt="" @click="serviceDialog=false">
        <p class="title">服务说明</p>
        <div class="item" v-for="(s,i) in goods.goodsService" :key="i">
          <p class="stitle"><img src="../assets/detail/user_icon_tag_red.png" class="ser-icon" alt="">{{s.markName}}</p>
          <p class="desc">{{s.remark}}</p>
        </div>
        <div class="btnbottom">
          <button @click="serviceDialog= false">确定</button>
        </div>
      </popup>
    </div>

  </div>
  <!-- 包邮提示弹窗 -->
  <div class="dialog" v-if="show_modal">
    <div class="bg-ground" ></div>
    <div class="content">
      <img class="pic" src="../assets/user_icon_box_chaetishi_null.png" />
      <p class="title">还差<span class="price">{{need_price}}元</span></p>
      <p class="desc">即可享受99元包邮服务</p>
      <div class="footer">
        <div @click="modal_hide()">再选选</div>
        <div class="sure" @click="sureGo()">去结算</div>
      </div>
    </div>
  </div>
  <div class="bottom-nav">
    <router-link :to="'/home'" class="home">
      <div class="icon"></div>
    </router-link>
    <router-link :to="'/set'" class="set">
      <div class="icon"></div>
    </router-link>
    <div class="left">
      <div @click="toOtherPage('cart')" class="cart">
        <div class="within10" :class="{'within100':cartCount > 9 && cartCount < 100}" v-if="cartCount > 0 && cartCount < 100">{{cartCount}}</div>
        <div class="over99" v-else-if="cartCount > 99">99+</div>
        <div class="icon"></div>
      </div>
    </div>
    <div v-if="goods.goodsStatus==2&&goods.isOne==0" class="right">
      <button class="add-cart" @click="setDialog(true)">加入购物车</button>
      <button class="new-buy" @click="setDialog(true)">立即购买</button>
    </div>
    <div v-if="goods.goodsStatus==1&&goods.isOne==0" class="right">
      <button>该商品已下架</button>
    </div>
    <div v-if="goods.isOne==1" class="right">
      <button>赠品不可单独购买</button>
    </div>
  </div>
    <div v-transfer-dom>
    <alert v-model="invalidshow" title="商品已失效" @on-hide="goLatPage()"></alert>
  </div>
</div>
</template>
<script>
import bus from "@/util/bus";
import goodsPrice from "./common/goods-price";
import {
  Swiper,
  SwiperItem,
  Tab,
  TabItem,
  TransferDom,
  Popup,
  Alert,
  ToastPlugin
} from "vux";
import recommend from "@/components/common/recommond";
export default {
  name: "detail",
  directives: {
    TransferDom
  },
  components: {
    Swiper,
    SwiperItem,
    Tab,
    Alert,
    TabItem,
    Popup,
    recommend,
    goodsPrice
  },
  data() {
    return {
      goods: {}, //商品详情
      recommendList: [], //推荐商品
      rcommendAlready:false,//是否加载了推荐商品
      tabData: {
        index: 0,
        data: []
      },
      navList: [
        {
          title: "购物车",
          img: require("../assets/home/user_Toolbar_icon_gouwuche.png"),
          link: "cart"
        }
      ],

      idDialog: false,
      goodNum: 1, //选择的商品数量
      specList: [], //规格列表 用来显示
      serSkuList: [], //服务返回的数据
      selectSpec: [], //用户选择的规格
      attrMap: {}, //所有规格 map  如 3225：黑色
      selectSkuGoods: null, //用户选择sku对应的商品
      changeKey: 0, //用来做页面刷新，selectSpec改变后页面刷新，这个是垃圾代码，需要后续修改
      skuMap: {}, //把服务器数据组装成map
      keys: [], //根据sku生成的key
      countNumTimer: "",
      countDownTime: [0, 0, 0, 0], //倒计时
      qiangou_text: "",
      selectshowSku: null, //选择的详情下发的规格
      selectSkucode: this.$route.query.sku_code, //选择的skucode
      cartCount: 0,
      show_modal: false, //是否满足包邮
      serviceDialog: false, //服务标签弹窗
      invalidshow: false
    };
  },
  created: function() {
    this.setTitle("商品详情");
    this.getGoodsDetail(this.$route.query.goods_id, this.selectSkucode);

    if (window.getCookie("token")) {
      this.globalUpdateCartCount();
      this.cartCount = window.getCookie("cartCount");
    }
  },
  // beforeRouteEnter(to, from, next) {
  //   console.log('detail beforeRouteEnter from->>',from)
  //   console.log('detail beforeRouteEnter to->>',to)
  //   next()
  // },
  // beforeRouteLeave(to, from, next) {
  //   console.log('detail beforeRouteLeave to->>',to)
  //   console.log('detail beforeRouteLeave from->>',from)
  //   // to.meta.keepAlive = true
  //   next()
  // },
  computed: {
    cost() {
      let price = this.selectSkuGoods.stock.activePrice
        ? this.selectSkuGoods.stock.activePrice
        : this.selectSkuGoods.skuPrice;
      return parseFloat(price * this.goodNum).toFixed(2);
    },
    need_price() {
      return parseFloat(99.0 - this.cost).toFixed(2);
    }
  },
  mounted() {
    let vm = this;
    bus.$on("cart-count-change", function(data) {
      vm.cartCount = data;
    });
  },
  destroyed() {
    clearInterval(this.countNumTimer);
  },
  methods: {
    scrollHandler(e){
      //滑动一定到距离加载商品推荐
      if(!this.rcommendAlready && e.target.scrollTop > 100){
        this.getRcommendGoods(this.$route.query.goods_id);
      }
    },
    onHideIdDialog() {
      this.unSetFix()
    },
    setDialog(v) {
      this.$refs.detailRef.style.position = 'fixed'
      this.$refs.detailRef.style['overflow-y'] = 'hidden'
      this.idDialog = v;
    },
    unSetFix() {
      this.$refs.detailRef.style['overflow-y'] = 'scroll'
      this.$refs.detailRef.style.position = ''
    },
    toOtherPage(link) {
      this.$router.push(link);
    },
    num_blur() {
      this.cheackNum();
    },
    addCount(num) {
      this.goodNum += num;
      this.cheackNum();
    },
    cheackNum() {
      if (this.goodNum < 1) {
        this.goodNum = 1;
      }
      if (this.goodNum > this.selectSkuGoods.stock.salableInventory) {
        if (
          this.selectSkuGoods.stock.salableInventory >
            this.selectSkuGoods.orderMaxNum &&
          this.selectSkuGoods.orderMaxNum != 0
        ) {
          this.goodNum = this.selectSkuGoods.orderMaxNum;
        } else {
          this.goodNum = this.selectSkuGoods.stock.salableInventory;
        }
      } else {
        if (
          this.goodNum > this.selectSkuGoods.orderMaxNum &&
          this.selectSkuGoods.orderMaxNum != 0
        ) {
          this.goodNum = this.selectSkuGoods.orderMaxNum;
        }
      }
    },
    getGoodsDetail(id, skucode) {
      this.$http
        .get("goods/goods_detail.do", { params: { goodsId: id } })
        .then(res => {
          this.goods = res.data.goods;
          if (this.tabData.index == 0) {
            this.tabData.data = this.goods.goodsBrief;
          } else {
            this.tabData.data = this.goods.goodsBuyNote;
          }
          //url没有skucode就用接口返回的skucode
          if (!skucode) {
            skucode = this.goods.skuCode;
          }
          if (this.goods.skuList.length == 0) {
            this.invalidshow = true;
          }
          for (let i = 0; i < this.goods.skuList.length; i++) {
            if (this.goods.skuList[i].skuCode == skucode) {
              this.selectshowSku = this.goods.skuList[i];
              this.setActInfo(this.selectshowSku);
            }
          }
          this.getspecList(id, skucode);
        });
    },
    //推荐商品
    getRcommendGoods(id) {
      this.rcommendAlready = true;
      this.$http
        .get("goods/goods_recommend.do", {
          params: { dataVersion: 0, goodsId: id }
        })
        .then(res => {
          this.recommendList = res.data.recommendGoodsList;
        });
    },
    //商品规格
    getspecList(id, skucode) {
      this.$http
        .get("goods/get_goods_spec_list.do", { params: { goodsId: id } })
        .then(res => {
          this.serSkuList = res.data.skuList;
          for (var i = 0; i < this.serSkuList.length; i++) {
            if (this.serSkuList[i].skuCode == skucode) {
              for (var j = 0; j < this.serSkuList[i].specList.length; j++) {
                //添加默认选择的规格
                this.selectSpec.push(
                  this.serSkuList[i].specList[j].attrValueId
                );
              }
            }
          }
          let goodsSpecList = res.data.goodsSpecList;
          goodsSpecList.sort((a, b) => {
            return a.attrId > b.attrId ? 1 : -1;
          });
          this.getSpecData(goodsSpecList);
          this.setSkuData(res.data);
        });
    },
    //处理规格选项 用于显示选项按钮
    getSpecData(specMap) {
      this.specList = [];
      let tempArr = [];
      for (let k = 0; k < specMap.length; k++) {
        tempArr.push([]);
        let specObj = { attrName: specMap[k].attrName, list: [] };
        for (let i in specMap[k].attrValueList) {
          this.attrMap[specMap[k].attrValueList[i].attrValueId] =
            specMap[k].attrValueList[i].attrValueName;
          specObj.list.push(specMap[k].attrValueList[i]);
          tempArr[k].push(specMap[k].attrValueList[i].attrValueId);
        }
        this.specList.push(specObj);
      }
    },
    specSelect(index, attr) {
      if (attr.salableInventory == 0) return;
      let id = attr.attrValueId;
      this.selectSpec[index] = id;
      this.changeKey++;
      this.selectSkuGoods = this.getInventory();
      this.disibleSkuBtn();
    },
    //设置其他规格是否可选
    disibleSkuBtn() {
      for (let i = 0; i < this.specList.length; i++) {
        for (let k = 0; k < this.specList[i].list.length; k++) {
          let item = this.specList[i].list[k];
          let _arr = JSON.parse(JSON.stringify(this.selectSpec));
          _arr[i] = item.attrValueId;
          let newItem = this.getNum(_arr.join(";"));
          if (newItem != 0) {
            item.salableInventory = newItem.stock.salableInventory;
          } else {
            item.salableInventory = 0;
          }
        }
      }
    },
    //获取库存
    getInventory() {
      let item = this.getNum(this.selectSpec.join(";"));
      if (item == 0) {
        item = {
          skuImage: this.selectshowSku.skuImage,
          skuName: "",
          skuPrice: this.selectshowSku.skuPrice,
          stock: {
            salableInventory: 0,
            activePrice: this.selectshowSku.seckillPrice
          }
        };
      } else {
        //相应改变selectshowSku，用于展示对应的活动信息和发货地
        for (let i = 0; i < this.goods.skuList.length; i++) {
          if (this.goods.skuList[i].skuCode == item.skuCode) {
            this.selectshowSku = this.goods.skuList[i];
            this.setActInfo(this.selectshowSku);
          }
        }
      }
      return item;
    },
    //加入购物车
    addCart() {
      let thisSku = this.getInventory();
      if (!thisSku || thisSku.stock.salableInventory < this.goodNum) {
        this.$vux.toast.text("没有库存");
        return;
      }
      let httpData = {
        goodsId: this.goods.goodsId,
        skuCode: thisSku.skuCode,
        skuCount: this.goodNum,
        skuId: thisSku.stock.skuId
      };
      this.$http.post("order/cart_add.do", httpData).then(res => {
        this.$vux.toast.text("加入成功");
        this.globalUpdateCartCount();
      });
    },
    //立即购买
    newBuy() {
      let thisSku = this.getInventory();
      if (!thisSku || thisSku.stock.salableInventory < this.goodNum) {
        this.$vux.toast.text("没有库存");
        return;
      }
      if (this.cost < 99) {
        this.show_modal = true;
        this.idDialog = false;
        return;
      }
      this.sureGo();
    },
    sureGo() {
      let thisSku = this.getInventory();
      let _query = {
        goodsId: this.goods.goodsId + "",
        skuCode: thisSku.skuCode + "",
        skuCount: this.goodNum + "",
        skuId: thisSku.stock.skuId + "",
        from: "detail"
      };
      //促销id没有不传
      if (thisSku.stock.activeId) {
        _query.goodsPromoId = thisSku.stock.activeId;
      }
      this.$router.push({name: "order_sure",query: _query});
    },
    //商品介绍购买须知tab 切换
    changeTab(n) {
      this.tabData.index = n;
      if (this.tabData.index == 0) {
        this.tabData.data = this.goods.goodsBrief;
      } else {
        this.tabData.data = this.goods.goodsBuyNote;
      }
    },
    //设置商品的活动信息
    setActInfo(goods) {
      if (goods.activeStatus) {
        if (goods.activeStatus == 2) {
          let remainTime = (goods.activeEndTime - this.sysTime) / 1000;
          this.countDownTime = new Date(remainTime).formatStamp();
          this.countNum(remainTime);
        } else if (goods.activeStatus == 1) {
          this.qiangou_text =
            this.getLocalTimeYMDS(goods.activeBeginTime) + " 开抢";
          let remainTime = (goods.activeBeginTime - this.sysTime) / 1000;
          this.countNum(remainTime);
        }
      }
    },
    //倒计时
    countNum(time) {
      if (this.countNumTimer) {
        //如果有计时器，先清除计时器
        clearInterval(this.countNumTimer);
      }
      if (this.selectshowSku.activeStatus) {
        this.countNumTimer = setInterval(() => {
          time--;
          if (this.selectshowSku.activeStatus == 2) {
            this.countDownTime = new Date(time).formatStamp();
            if (time <= 0) {
              clearInterval(this.countNumTimer);
              this.selectshowSku.sellType = 0;
              this.selectshowSku.counter_end = true; //倒计时结束
            }
          } else if (this.selectshowSku.activeStatus == 1) {
            if (time <= 0) {
              this.selectshowSku.activeStatus = 2;
              this.setActInfo();
            }
          }
        }, 1000);
      }
    },
    //关闭包邮提示弹窗
    modal_hide() {
      this.show_modal = false;
    },
    //****sku库存处理*****/
    setSkuData(skuData) {
      let skuList = skuData.skuList;
      for (let i = 0; i < skuList.length; i++) {
        let key = "";
        for (let k = 0; k < skuList[i].specList.length; k++) {
          key += skuList[i].specList[k].attrValueId + "";
          if (k != skuList[i].specList.length - 1) {
            key += ";";
          }
        }
        this.skuMap[key] = skuList[i];
      }
      let specList = skuData.goodsSpecList;
      //可选项key值
      for (let m = 0; m < specList.length; m++) {
        let _arr = [];
        for (let n = 0; n < specList[m].attrValueList.length; n++) {
          _arr.push(specList[m].attrValueList[n].attrValueId);
        }
        this.keys.push(_arr);
      }
      this.disibleSkuBtn();
      this.selectSkuGoods = this.getInventory();
    },
    //获取 key的库存量
    getNum(key) {
      let result = 0,
        i,
        j,
        m,
        items,
        n = [];
      let data = this.skuMap;
      let myData = {};
      //可选项key值
      let keys = this.keys;
      //检查是否已计算过
      if (typeof myData[key] != "undefined") {
        return myData[key];
      }
      items = key.split(";");
      //已选择数据是最小路径，直接从已端数据获取
      if (items.length === keys.length) {
        if (data[key] && data[key].stock.salableInventory > 0) {
          return data[key];
        }
      }
      //拼接子串
      for (i = 0; i < keys.length; i++) {
        for (j = 0; j < keys[i].length && items.length > 0; j++) {
          if (keys[i][j] == items[0]) {
            break;
          }
        }
        if (j < keys[i].length && items.length > 0) {
          //找到该项，跳过
          n.push(items.shift());
        } else {
          //分解求值
          for (m = 0; m < keys[i].length; m++) {
            result += this.getNum(n.concat(keys[i][m], items).join(";"));
          }
          break;
        }
      }
      //缓存
      myData[key] = result;
      return result;
    },
    goLatPage() {
      history.back();
    }
  },
  watch: {
    $route() {
      location.reload();
    }
  }
};
</script>
<style scoped lang="less">
.bold {
  font-weight: bold;
}
.home {
  padding: 8px;
  float: left;
  .icon {
    height: 38px;
    width: 40px;
    margin: 4px auto;
    background: url("../assets/foot-tab/user_Toolbar_icon_home@2x.png") no-repeat center / 100%;
  }
}
.set {
  float: left;
  padding: 8px;
  .icon {
    height: 38px;
    width: 40px;
    margin: 4px auto;
    background: url("../assets/foot-tab/user_Toolbar_icon_me@2x.png") no-repeat center / 100%;
  }
}
.cart {
  float: left;
  .icon {
    height: 38px;
    width: 40px;
    margin: 4px auto;
    background: url("../assets/foot-tab/user_Toolbar_icon_gouwuche@2x.png") no-repeat center / 100%;
  }
}
.detail-container {
  font-size: 16px;
  color: #66676a;
  background: #eeeeee;
  overflow-y: auto;
  padding-bottom: 50px;
  height: 100%;
  box-sizing: border-box;
}

.goods-lable {
  width: 33px;
  height: 18px;
  position: relative;
  top: 3px;
}
.goods-info {
  background: #fff;
  padding: 0 12px 0;
  .price {
    float: left;
    margin-top: 20px;
    color: #fc6655;
    width: 200px;
    .fuhao {
      font-size: 18px;
    }
    .roundprice {
      font-size: 36px;
      line-height: 36px;
    }
    .decimalprice {
      font-size: 20px;
    }
  }
  .primePrice {
    float: left;
    margin-top: 40px;
    margin-left: 9px;
    opacity: 0.8;
    font-size: 13px;
    color: #86898b;
    text-decoration: line-through;
  }
  .activity {
    float: right;
    .right {
      .conttile {
        font-size: 11px;
        color: #1b1b1b;
        padding: 10px 0;
        text-align: right;
        font-weight: 600;
      }
      .contTime {
        span {
          display: block;
          float: left;
          font-size: 12px;
          line-height: 19px;
          color: #1b1b1b;
        }
        .ti {
          width: 26px;
          height: 21px;
          background: #000;
          color: #fff;
          text-align: center;
          line-height: 21px;
          font-size: 13px;
        }
        .symbol {
          padding: 0 3px;
          line-height: 19px;
        }
      }
      .contclose {
        font-size: 13px;
        color: #cccccc;
        margin-top: 39px;
      }
    }
    .right_now {
      font-size: 13px;
      color: #cccccc;
      margin-top: 39px;
    }
  }
  .goodsTitle {
    margin-top: 10px;
    font-size: 15px;
    color: #1b1b1b;
    line-height: 26px;
    padding-bottom: 25px;
  }
  .storeName {
    font-size: 12px;
    color: #86898b;
    line-height: 12px;
    padding-bottom: 30px;
  }
}
.ser-laber {
  background: #fff;
  font-size: 12px;
  padding: 15px;
  margin-bottom: 5px;
  border-top: 1px solid #f4f3f3;
  position: relative;
  overflow: hidden;
  .left {
    p {
      margin-right: 30px;
      line-height: 24px;
      float: left;
    }
    img {
      width: 12px;
      height: 12px;
      margin-right: 8px;
    }
  }
  > img {
    width: 8px;
    height: 12px;
    position: absolute;
    right: 15px;
    top: 50%;
    margin-top: -6px;
  }
}
.goods-sild {
  img {
    width: 100%;
    height: 327px;
  }
}
.specs {
  padding: 15px;
  font-size: 15px;
  background: #fff;
  margin-bottom: 5px;
  border-top: 1px solid #f4f3f3;
  line-height: 18px;
  overflow: hidden;
  p {
    float: left;
  }
  img {
    display: block;
    float: right;
    margin-top: 3px;
    width: 8px;
    height: 12px;
    margin-left: 11px;
  }
  > span {
    float: right;
    font-size: 12px;
    color: #86898b;
    line-height: 12px;
    margin-top: 3px;
  }
}
.tab-box {
  img {
    width: 100%;
    display: block;
  }
}
.bottom-nav {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 58px;
  font-size: 13px;
  background: white;
  border-top: solid 1px #eeeeee;
  overflow: hidden;
  .left {
    font-size: 12px;
    float: left;
    padding: 8px;
    .within10 {
      width: 20px;
      height: 20px;
      background: center/100%
        url("../assets/cart/user_icon_number_red_1@3x.png");
      position: absolute;
      left: 142px;
      bottom: 34px;
      color: #fff;
      font-size: 12px;
      line-height: 20px;
      border: 1px solid #fff;
      border-radius: 50%;
      text-align: center;
      z-index: 999;
    }
    .within100,
    .over99 {
      height: 18px;
      width: 30px;
      background: center/100%
        url("../assets/cart/user_icon_number_red_2@3x.png");
      position: absolute;
      left: 142px;
      bottom: 34px;
      color: #fff;
      font-size: 12px;
      line-height: 18px;
      border: 1px solid #fff;
      border-radius: 40%;
      text-align: center;
      z-index: 999;
    }
    > div {
      img {
        display: block;
        width: 22px;
        margin:0 auto 3px;
      }
    }
  }
  .right {
    float: right;
    padding: 12px;
  }
  button {
    width: 80px;
    height: 38px;
    border-radius: 18px;
    border: none;
    background: #ccc;
    color: white;
  }
  .add-cart {
    margin-right: 17px;
    background: linear-gradient(140deg, #92dbff 4%, #499ffd 95%);
  }
  .new-buy {
    background: linear-gradient(217deg, #ff8996 0%, #fc6655 100%);
  }
}
.pop-dialog {
  font-size: 14px;
  background-color: rgba(0, 0, 0, 0);
  width: 100%;
  overflow: hidden;
  .top-div {
    height: 25px;
  }
  .dialog-content {
    position: relative;
    background: #fff;
    .close-icon {
      width: 12px;
      height: 12px;
      position: absolute;
      top: 10px;
      right: 10px;
    }
    .goods {
      .img-box {
        width: 105px;
        height: 105px;
        position: absolute;
        top: -23px;
        left: 14px;
        border: 3px solid #ffffff;
        > img {
          width: 100%;
          height: 100%;
        }
      }
      .info {
        padding: 22px 25px 0 143px;
        width: 100%;
        .default-spec {
          font-size: 12px;
          color: #1b1b1b;
          font-weight: bold;
          margin-top: 8px;
        }
        .limited {
          font-size: 10px;
          color: #86898b;
          margin-top: 8px;
        }
      }
    }
  }
  .specifications {
    padding: 20px 15px;
    margin-top: 24px;
    .attr-name {
      display: block;
      font-size: 13px;
      color: #86898b;
    }
    button {
      padding: 8px 16px;
      margin: 8px;
      min-width: 68px;
      background: #fff;
      border: 1px solid #f4f3f3;
      border-radius: 20px;
      outline: none;
      font-size: 12px;
      color: #1b1b1b;
      font-weight: bold;
    }
    .spec-select {
      border: 1px solid #fc6655;
      border-radius: 20px;
    }
    .gray-spec {
      color: #cbcbcb;
    }
  }
  .goods-num {
    padding: 15px 15px;
    .limited {
      font-size: 12px;
      color: #cccccc;
      margin-right: 15px;
    }
    > p {
      font-size: 13px;
      color: #86898b;
      height: 22px;
      line-height: 22px;
      display: inline-block;
      float: left;
    }
    > div {
      float: right;
      display: flex;
      align-items: center;
      > p {
        height: 22px;
        line-height: 22px;
        text-align: center;
      }
      .icon {
        width: 21px;
        height: 22px;
        border: 1px solid #c7cbcd;
      }
      .num {
        width: 34px;
        height: 22px;
        line-height: 22px;
        background-color: #fff;
        text-align: center;
        float: right;
        font-size: 12px;
        color: #1b1b1b;
        border-top: 1px solid #c7cbcd;
        border-bottom: 1px solid #c7cbcd;
      }
      .cart_lis_reduce_highlight {
        background: url("../assets/cart/h5_icon_less_hight.png") no-repeat;
        background-position: center;
        background-size: 10px;
      }
      .cart_lis_add_highlight {
        background: url("../assets/cart/h5_icon_add_hight.png") no-repeat;
        background-position: center;
        background-size: 10px;
      }
      .reduce-icon {
        background: url("../assets/cart/h5_icon_less.png") no-repeat;
        background-position: center;
        background-size: 10px;
      }
      .add-icon {
        background: url("../assets/cart/h5_icon_add.png") no-repeat;
        background-position: center;
        background-size: 10px;
      }
    }
  }
  .btns {
    display: flex;
    justify-content: space-between;
    // padding: 10px 15px;
    margin-top: 20px;
    .cartbtns {
      font-size: 11px;
      color: #393d42;
      width: 50px;
      text-align: center;
      padding: 8px;
      margin-right: 25px;
      .within10 {
        width: 20px;
        height: 20px;
        background: center/100%
          url("../assets/cart/user_icon_number_red_1@3x.png");
        position: absolute;
        left: 145px;
        bottom: 34px;
        color: #fff;
        font-size: 12px;
        line-height: 20px;
        border: 1px solid #fff;
        border-radius: 50%;
        text-align: center;
        z-index: 999;
      }
      .within100,
      .over99 {
        height: 18px;
        width: 30px;
        background: center/100%
          url("../assets/cart/user_icon_number_red_2@3x.png");
        position: absolute;
        left: 145px;
        bottom: 34px;
        color: #fff;
        font-size: 12px;
        line-height: 18px;
        border: 1px solid #fff;
        border-radius: 40%;
        text-align: center;
        z-index: 999;
      }
      img {
        width: 22px;
        display: block;
        margin: 0 auto;
      }
    }
    .purchase-btn {
      margin: auto 0;
      button {
        width: 80px;
        height: 38px;
        border: none;
        border-radius: 100px;
        color: #fff;
        background: #ccc;
      }
      .add-cart {
        background: linear-gradient(140deg, #92dbff 4%, #499ffd 95%);
      }
      .buy {
        margin-left: 10px;
        margin-right: 12px;
        background: linear-gradient(135deg, #ff8996 0%, #fc6655 100%);
      }
    }
    .no-inventory {
      background: #cbcbcb;
      box-shadow: 0 2px 10px 0 rgba(79, 79, 79, 0.2);
      border-radius: 100px;
      height: 38px;
      width: 180px;
      text-align: center;
      line-height: 38px;
      color: white;
      margin: 12px;
    }
  }
}
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
      > div {
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
.service-dialog {
  background: #fff;
  .close-icon {
    position: absolute;
    width: 12px;
    height: 12px;
    padding: 12px;
    top: 0;
    right: 0;
  }
  .title {
    font-size: 16px;
    color: #1b1b1b;
    line-height: 16px;
    text-align: center;
    margin-top: 26px;
    font-weight: 600;
  }
  .item {
    padding: 0 12px;
    margin-top: 40px;
  }
  .stitle {
    font-size: 15px;
    color: #1b1b1b;
    line-height: 13px;
    font-weight: 600;
    img {
      width: 14px;
      height: 14px;
      margin-right: 8px;
    }
  }
  .desc {
    font-size: 12px;
    color: #86898b;
    line-height: 13px;
    margin-top: 11px;
    padding: 0 22px;
  }
  .btnbottom {
    height: 58px;
    text-align: center;
    vertical-align: middle;
    margin-top: 14px;
    button {
      width: 134px;
      height: 38px;
      background: linear-gradient(-217deg, #ff8996 0%, #fc6655 100%);
      box-shadow: 0 2px 10px 0 rgba(255, 76, 138, 0.2);
      border-radius: 100px;
      text-align: center;
      line-height: 38px;
      font-size: 14px;
      color: #ffffff;
    }
  }
}
</style>
