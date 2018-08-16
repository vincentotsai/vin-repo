<template>
  <div class="addr-content">
    <div id="addr-box" class="view">
      <div class="order-header-none" @click="edit()">
        <div class="order-header-none-more"></div>
      </div>
      <img class="empty" v-show="empty" src="../../assets/empty/noaddress.png">
      <div v-show="empty" class="empty-tips">还没有收货地址，点击上方按钮添加吧～</div>
      <div class="addr" v-for="(item,index) in address" title="" :key="index" @click="selectAddress(item)">
        <div>
          <span class="name">收货人：{{ item.trueName }}</span>
          <span class="tel">{{item.mobile}}</span>
        </div>
        <div class="area card" v-if='item.idcard'>身份证：{{item.idcard}}</div>
        <div class="area detail">地址：{{(item.provinceName||"") + (item.cityName||"") + (item.areaName||"") + (item.addressDetail||"")}}</div>
        <div class="set-default">
          <div class="set-default-icon" @click.stop="check(item)">
            <span class="radio " v-bind:class="{ checked: item.isDefault==1}">
              <input type="radio" name="default_addr" :value="item.addressId">
            </span>
            <label v-bind:for="item.addr_id">默认地址</label>
          </div>
          <div @click.stop="edit(item)" class="set">修改</div>
          <div class="set" @click.stop="remove(item)">删除</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        address: [],
        empty: false
      }
    },
    created() {
      this.getAddress()
    },
    methods: {
      //我的收获地址
      getAddress() {
        this.$http.get('uc/get_address_list.do').then(data => {
          this.address = data.body.retList
          if (this.address.length == 0) {
            this.empty = true
          }
        })
      },
      check(item) {
        for (var i = 0; i < this.address.length; i++) {
          this.address[i].isDefault = 0
        }
        item.isDefault = 1
        this.$http
          .post('uc/set_default_address.do', {
            addressId: item.addressId
          })
          .then(data => {})
      },
      edit(item) {
        this.$router.push({
          name: 'addressedit',
          params: item
        })
      },
      remove(item) {
        this.$http
          .post('/uc/delete_address.do', {
            addressId: item.addressId
          })
          .then(data => {
            this.$vux.toast.text('删除成功')
            this.getAddress()
          })
      },
      selectAddress(item) {
        if (this.$route.query.from) {
          var queryObj = this.$route.query
          queryObj.addressId = item.addressId
          this.$router.push({
            name: 'order_sure',
            query: queryObj
          })
        }
      }
    }
  }

</script>

<style lang="less">
  @import '../../styles/index.less';
  #view-content>.addr-content {
    width: 100%;
    height: 100%;
  }

  #addr-box .addr {
    margin-bottom: 5px;
    padding: 24px 12px 18px;
    overflow: hidden;
    font-size: 14px;
    background: #fff;
  }

  #addr-box {
    position: relative;
    overflow: auto;
    top: 0;
    z-index: 99;
    width: 100%;
    height: 100%;
  }

  .mint-cell:last-child {
    background-size: 100% 0px;
  }

  .order-header-none {
    height: 70px;
    padding-top: 22px;
    background: #fff;
    .pxrem(font-size, 14);
  }

  .order-header-none-more {
    .pxrem(width, 336);
    .pxrem(height, 44);
    margin: auto;
    background: url(../../assets/h5_icon_shouhuodizhi.png) no-repeat left top;
    background-size: cover;
  }

  #addr-box .set {
    display: inline-block;
    width: 74px;
    height: 28px;
    line-height: 28px;
    border: 1px solid #272728;
    text-align: center;
    font-size: 12px;
    color: #272728;
    float: right;
    border-radius: 14px;
    margin-left: 12px;
  }

  #addr-box input {
    vertical-align: middle;
    opacity: 0;
  }

  #addr-box .radio {
    width: 16px;
    height: 16px;
    .px2rem(line-height, 32);
    .pxrem(margin-right, 10);
    text-align: center;
    overflow: hidden;
    text-indent: -9999px;
    background: url('../../assets/h5_icon_no_selected.png') no-repeat;
    background-size: 100% auto;
    display: inline-block;
    vertical-align: middle;
  }

  label {
    display: inline-block;
    vertical-align: middle;
  }

  #addr-box .checked {
    background: url('../../assets/h5_icon_shouhuo_select.png') no-repeat;
    background-size: 100% auto;
  }

  #addr-box .name {
    display: inline-block;
    color: #272728;
    font-size: 14px;
  }

  #addr-box .tel {
    display: inline-block;
    margin-right: 5px;
    color: #272728;
    font-size: 14px;
    float: right;
  }

  #addr-box .area {
    .pxrem(margin-right,
    12);
    .px2rem(max-height,
    86);
    .px2rem(width,
    700);
    .pxrem(margin-top,
    8);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #272728;
    font-size: 14px;
  }

  #addr-box .area.card {
    border: 0;
  }

  .area.detail {
    .px2rem(max-height,
    20);
    .pxrem(padding-bottom,
    25);
    position: relative;
  }

  .area.detail:after {
    content: ' ';
    display: block;
    position: absolute;
    box-sizing: border-box;
    left: 0px;
    bottom: 0px;
    width: 200%;
    transform-origin: 0 0;
    border-bottom: 1px solid #f2f2f2;
    transform: scale(0.5);
  }

  #addr-box .set-default {
    .px2rem(padding-top,
    35);
    .pxrem(height,
    22);
    color: #272728;
    font-size: 14px;
    .pxrem(line-height,
    22);
    .set-default-icon {
      float: left;
    }
  }

  #addr-box .mint-cell-swipe-button {
    .px2rem(width,
    139);
    height: 100%;
    background: #ff3b30;
    color: #fff;
    font-size: 17px;
    padding: 0;
    text-align: center;
    -wk-box-align: center;
    -webkit-box-pack: center;
    -webkit-box-align: center;
    display: -webkit-box;
  }

  #addr-box .mint-cell-value {
    display: block;
    width: 100%;
  }

  /*#add-icon{
        font-size: 20px;
        .px2rem(margin-right, 17);
    }*/

  .empty {
    width: 216px;
    height: 144px;
    margin-top: 89px;
  }

  .empty-tips {
    margin: auto;
    text-align: center;
    font-size: 14px;
    .pxrem(margin-top,
    22);
    color: #cecece;
  }

</style>
<style>
  #addr-box .mint-cell-wrapper {
    padding: 0;
  }

</style>
