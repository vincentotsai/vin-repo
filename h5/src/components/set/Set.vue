<template>
  <div :class="{'set-content':sheetVisible}">
    <div class="shdowBox" v-if="sheetVisible || shdowVisible">
      <div id="sheet-shdow" @click="hideShdowBox()"></div>
      <div v-show="sheetVisible">
        <div id="action-sheet" class="fadeIn">
          <div id="ok-sheet">
            <div class="sheet" id="see" v-on:click="seeavatar()">查看大图</div>
            <form enctype="multipart/form-data" id="changPhoto" class="fileupload-button">
              修改头像
              <input type="file" name="file" class='inputStyle' @change="changeImg" />
            </form>
          </div>
          <div class="sheet" id="cancel" v-on:click="sheetVisible = false">取消</div>
        </div>
      </div>
    </div>
    <div v-if="visible" id="set">
      <img :src="userData.photoPath" @error="setErrorImgTouxiang($event,100,100)" id="avatar-hide" v-if="bigavatar" v-on:click="sheetVisible=false,bigavatar=false,shdowVisible=false" />
      <div id="info">
        <img :src="userData.photoPath+'?imageView2/1/w/100/h/100'" @error="setErrorImgTouxiang($event,60,60)" id="avatar" v-on:click="sheetVisible=true" size="large" />
        <div id="edit-box">
          <router-link :to="{ name: 'change_name'}">
            <p id="nick-wrap">{{userData.nickName||'nickName'}}</p>
          </router-link>
        </div>
      </div>

      <div class="myorder cell-wrapper" @click="toJump({ name: 'orders', query: { type: 0}})">
        <div class="cell myordercell">
          <span class="title-txt">我的订单</span>
          <span class="right-txt">查看全部</span>
          <img src="../../assets/icon_gengduo@2x.png" class="arrow-right" alt="">
        </div>
      </div>
      <div id="order-pre">
        <router-link class="order-util first" :to="{ name: 'orders', query: { type: 1}}">
          <div :class="pay_num>99?'orders_num':'order_num'" v-if="pay_num">{{pay_num>99?'99+':pay_num}}</div>
          <img class="order-icon" src="../../assets/icon_dfk.png" />
          <span>待付款</span>
          <div class="within10" :class="{'within100':willPayOrderCount > 9 && willPayOrderCount < 100}" v-if="willPayOrderCount > 0 && willPayOrderCount < 100">{{willPayOrderCount}}</div>
          <div class="over99" v-else-if="willPayOrderCount > 99">99+</div>
        </router-link>
        <router-link class="order-util" :to="{ name: 'orders', query: { type: 2 }}">
          <div :class="send_num>99?'orders_num':'order_num'" v-if="send_num">{{send_num>99?'99+':send_num}}</div>
          <img class="order-icon" src="../../assets/icon_dfh.png" />
          <span>待发货</span>
          <div class="within10" :class="{'within100':willDeliverOrderCount > 9 && willDeliverOrderCount < 100}" v-if="willDeliverOrderCount > 0 && willDeliverOrderCount < 100">{{willDeliverOrderCount}}</div>
          <div class="over99" v-else-if="willDeliverOrderCount > 99">99+</div>
        </router-link>
        <router-link class="order-util" :to="{ name: 'orders', query: { type: 3}}">
          <div :class="receive_num>99?'orders_num':'order_num'" v-if="receive_num">{{receive_num>99?'99+':receive_num}}</div>
          <img class="order-icon" src="../../assets/icon_dsh.png" />
          <span>已发货</span>
          <div class="within10" :class="{'within100':willReceivedOrderCount > 9 && willReceivedOrderCount < 100}" v-if="willReceivedOrderCount > 0 && willReceivedOrderCount < 100">{{willReceivedOrderCount}}</div>
          <div class="over99" v-else-if="willReceivedOrderCount > 99">99+</div>
        </router-link>
        <router-link class="order-util last" :to="{ name: 'after'}">
          <img class="order-icon" src="../../assets/icon_tksh.png" />
          <span>售后退款</span>
          <div class="within10" :class="{'within100':refundOrderCount > 9 && refundOrderCount < 100}" v-if="refundOrderCount > 0 && refundOrderCount < 100">{{refundOrderCount}}</div>
          <div class="over99" v-else-if="refundOrderCount > 99">99+</div>
        </router-link>
      </div>

      <div title="消息中心" class="msg-center cell-wrapper" @click="toJump({ name: 'message'})">
        <div class="cell">
          <img slot="icon" src="../../assets/h5_icon_me_xiaoxi.png" width="20" height="20">
          <span>消息中心</span>
          <div class="message-num" v-if="no_read_count">{{no_read_count}}</div>
          <img src="../../assets/icon_gengduo@2x.png" class="arrow-right" alt="">
        </div>
      </div>
      <div title="优惠券" class="yhq-center bottom-line cell-wrapper" @click="toJump({ name: 'vouchers'})">
        <div class="cell">
          <img slot="icon" src="../../assets/h5_icon_me_youhuiquan.png" width="20" height="20">
          <span>优惠券</span>
          <span class="right-txt">{{ticket_count}}</span>
          <img src="../../assets/icon_gengduo@2x.png" class="arrow-right" alt="">
        </div>
      </div>
      <div title="购物币" class="bottom-line cell-wrapper" v-if="!isola" @click="toJump({ name: 'coupons'})">
        <div class="cell">
          <img slot="icon" src="../../assets/h5_icon_me_gouwubi.png" width="20" height="20">
          <span>购物币</span>
          <img src="../../assets/icon_gengduo@2x.png" class="arrow-right" alt="">
          <!-- <span >{{countCoupons}} 个</span> -->
        </div>
      </div>
      <div title="我的收货地址" class="bottom-line cell-wrapper" @click="toJump({ name: 'address'})">
        <div class="cell">
          <img slot="icon" src="../../assets/h5_icon_me_shouhuodizhi.png" width="20" height="20">
          <span>我的收货地址</span>
          <img src="../../assets/icon_gengduo@2x.png" class="arrow-right" alt="">
          <!-- <span >管理收货地址</span> -->
        </div>
      </div>
      <div title="账户资料" class="bottom-line cell-wrapper" @click="toJump({ name: 'logout'})">
        <div class="cell">
          <img slot="icon" src="../../assets/h5_icon_me_shezhi.png" width="22" height="23">
          <span>账户资料</span>
          <img src="../../assets/icon_gengduo@2x.png" class="arrow-right" alt="">
        </div>
      </div>
      <div title="客服与帮助" class="bottom-line cell-wrapper" @click="toJump({ name: 'help'})">
        <div class="cell">
          <img slot="icon" src="../../assets/icon_kfybz@2x.png" width="19" height="19">
          <span>客服与帮助</span>
          <img src="../../assets/icon_gengduo@2x.png" class="arrow-right" alt="">
        </div>
      </div>
    </div>
    <router-view id="view"></router-view>
  </div>
</template>
<script>
import { qiniuToken, imgUpdate } from '../../util/imgUpdate'
export default {
  data() {
    return {
      files: [],
      sheetVisible: false,
      shdowVisible: false, //遮罩层
      actions: [],
      bigavatar: false,
      countCoupons: 0, //购物币数量
      ticket_count: 0, //优惠券数量
      no_read_count: 0, //未读消息数
      willDeliverOrderCount: 0, //待发货数量
      willPayOrderCount: 0, //待付款数量
      willReceivedOrderCount: 0, //待收货数量
      refundOrderCount: 0, //申请售后数量
      wei_url: '',
      pay_num: 0,
      send_num: 0,
      receive_num: 0
    }
  },
  created() {
    this.getUserInfo()
    this.getStatistics()
  },
  mounted() {
    this.actions = [
      { name: '查看大图', method: this.takePhoto },
      { name: '从相册中选择', method: this.openAlbum }
    ]
  },
  computed: {
    visible() {
      return ['/set'].indexOf(this.$route.path) > -1
    }
  },
  methods: {
    //修改头像
    changeImg($event) {
      var self = this
      var file = $event.target.files[0]
      var reader = new FileReader() //实例化一个FileReader
      reader.readAsDataURL(file) //读取选中的图片，并转换成dataURL格式
      //监听文件读取结束后事件
      reader.onloadend = function(e) {
        qiniuToken(function(res) {
          self.hideShdowBox()
          upData(res)
        })
      }
      function upData(res) {
        // if(f.size/1024>40){
        //   Vue.prototype.showToast('文件大小不能超过256K，请重新上传！',2000);
        //   return false;
        // }
        if (
          file.type != 'image/jpeg' &&
          file.type != 'image/jpg' &&
          file.type != 'image/png' &&
          file.type != 'image/gif' &&
          file.type != 'image/bmp'
        ) {
          self.showToast('上传文件不是图片，请重新上传！', 2000)
          return false
        }

        let url = res.accessPrefixUrl
        self.$vux.loading.show({
          text: 'Loading'
        })
        imgUpdate([file], res.uploadToken, '', res => {
          // let newUrl = url + '/' + res[0].key
          // self.userData.photoPath = newUrl
          // self.$http
          //   .post('uc/modifying_user_information.do', { photoPath: newUrl })
          //   .then(res => {
          //     self.$vux.loading.hide()
          //     self.$forceUpdate()
          //   })
          let newUrl = url + '/' + res[0].key
          self.userData.photoPath = newUrl
          self.$http
            .post('uc/modifying_user_information.do', { photoPath: newUrl })
            .then(res => {
              self.$vux.loading.hide()
              self.$forceUpdate()
            })
        })
      }
    },
    getUserInfo() {
      let self = this
      if (!this.userData || !this.userData.userId) {
        this.getUserData(data => {
          if (window.getCookie('token')) {
            self.$forceUpdate()
          } else {
          }
        })
      }
    },
    seeavatar() {
      this.bigavatar = true
      this.sheetVisible = false
      this.shdowVisible = true
    },
    //各个统计数量
    getStatistics() {
      this.$http.get('uc/get_my_stat.do').then(res => {
        let data = res.body
        this.ticket_count = data.ticketCount
        this.countCoupons = data.couponCount
        this.willDeliverOrderCount = data.willDeliverOrderCount
        this.willPayOrderCount = data.willPayOrderCount
        this.willReceivedOrderCount = data.willReceivedOrderCount
        this.refundOrderCount = data.refundOrderCount
      })
    },
    toJump(obj) {
      this.$router.push(obj)
    },
    hideShdowBox() {
      this.sheetVisible = false
    }
  }
}
</script>
<!-- 底部菜单组件css -->
<style scoped lang="less">
@import '../../styles/index.less';
.cell-wrapper {
  background: #fff;
  .cell {
    margin: 0 10px;
    min-height: 48px;
    line-height: 48px;
    border-bottom: 1px solid hsla(0, 0%, 92%, 0.5);
    position: relative;
    vertical-align: middle;
    .title-txt {
      color: #1b1b1b;
      font-size: 18px;
      font-weight: 900;
    }
    .right-txt {
      float: right;
      margin-right: 14px;
      color: #838388;
      font-size: 13px;
      position: relative;
      top: 2px;
    }
    > img {
      vertical-align: middle;
    }
    .arrow-right {
      width: 6px;
      height: 12px;
      position: absolute;
      top: 50%;
      margin-top: -6px;
      right: 0;
    }
  }
  .myordercell {
    border-bottom: 0;
  }
}

.set-content {
  z-index: 1000;
}
.msg-center {
  margin-top: 5px;
}
.yhq-center {
  margin-top: 4px;
}
#set {
  position: absolute;
  overflow-y: scroll;
  .pxrem(bottom, 49);
  top: 0;
  width: 100%;
  left: 0;
  background: #fafafa;
}
.icon {
  .px2rem(width, 40);
  .px2rem(height, 40);
  display: inline-block;
}
#avatar {
  margin: 0 auto;
  display: block;
  .pxrem(width, 60);
  .pxrem(height, 60);
  .pxrem(margin-top, 35);
  border-radius: 50%;
  z-index: 9;
  position: relative;
}

#info {
  width: 100%;
  height: 160px;
  color: #fff;
  overflow: hidden;
  text-align: center;
  font-size: 16px;
  position: relative;
  background: url(../../assets/h5_icon_bg_me.png) no-repeat left top;
  background-size: cover;
}

.order-icon {
  width: 42px;
  height: 42px;
  clear: both;
  display: block;
  margin: 0 auto;
  margin-bottom: 5px;
}

#order-pre {
  padding: 21px 0 34px 0;
  background: #fff;
}

#nick-wrap {
  .pxrem(line-height, 16);
  .pxrem(font-size, 16);
  color: #ffffff;
  text-align: center;
}

.order-util {
  font-size: 11px;
  color: #272729;
  .px2rem(width, 130);
  display: inline-block;
  .px2rem(margin-right, 20);
  .px2rem(margin-left, 15);
  text-align: center;
  position: relative;
}

.first.order-util {
  margin-left: 22px;
}

.last.order-util {
  margin-right: 0;
}
#edit-box {
  .pxrem(margin-top, 12);
  z-index: 9;
  position: relative;
  text-align: center;
}
.shdowBox {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  z-index: 999;
}
#sheet-shdow {
  width: 100%;
  position: absolute;
  background: rgba(0, 0, 0, 0.5);
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}
#action-sheet {
  width: 90%;
  position: absolute;
  .px2rem(bottom, 18);
  left: 50%;
  right: 0;
  text-align: center;
  .px2rem(font-size, 40);
  color: #0076ff;
  margin-left: -45%;
}
#ok-sheet {
  .px2rem(margin-bottom, 16);
}
.sheet {
  .px2rem(height, 114);
  .px2rem(line-height, 114);
  background: #fff;
}
#see {
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  border-bottom: 1px solid #efefef;
}

.fileupload-button {
  display: block;
  width: 100%;
  .px2rem(height, 114);
  .px2rem(line-height, 114);
  text-align: center;
  .px2rem(font-size, 40);
  color: #0076ff;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  background-color: #fff;
  border-color: #fff;
  position: relative;
  input {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    -ms-filter: 'alpha(opacity=0)';
    cursor: pointer;
    width: 100%;
    height: 100%;
  }
}
#cancel {
  border-radius: 8px;
}

#avatar-hide {
  margin-top: 5%;
  width: 100%;
  height: 375px;
  border-radius: 50%;
  z-index: 1000;
  position: fixed;
}
#unread-tips {
  .px2rem(height,
    20);
  .px2rem(width,
    20);
  display: block;
  background: #f00;
  z-index: 999;
  position: absolute;
  .px2rem(right,
    32);
  .px2rem(top,
    22);
  border-radius: 50%;
}
.order_num {
  width: 17px;
  height: 17px;
  background: #ff6532;
  position: absolute;
  right: 12px;
  border-radius: 50%;
  color: #fff;
  top: -10px;
  font-size: 12px;
  line-height: 17px;
  text-align: center;
  z-index: 999;
}
.orders_num {
  width: 25px;
  height: 16px;
  background: #ff6532;
  position: absolute;
  right: 8px;
  border-radius: 10px;
  color: #fff;
  top: -10px;
  font-size: 12px;
  line-height: 18px;
  text-align: center;
  z-index: 999;
}
.within10 {
  width: 16px;
  height: 16px;
  background: linear-gradient(139deg, #ff8996 0%, #fc6655 97%);
  position: absolute;
  right: 12px;
  color: #fff;
  top: 0;
  font-size: 12px;
  line-height: 16px;
  text-align: center;
  border-radius: 50%;
  z-index: 9;
}
.within100,
.over99 {
  height: 16px;
  width: 26px;
  background: linear-gradient(139deg, #ff8996 0%, #fc6655 97%);
  position: absolute;
  right: 9px;
  color: #fff;
  top: 0;
  font-size: 12px;
  line-height: 16px;
  text-align: center;
  border-radius: 40%;
  z-index: 9;
}
</style>
