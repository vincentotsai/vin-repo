<template>
  <div class="edit-page">
    <div class="add-info">
      <div>
        <p class="left">收货人姓名</p><input class="right" type="text" placeholder="请输入姓名" v-model.trim="address.trueName" @keyup="change()"></div>
      <div class="phone">
        <p class="left">手机号码</p><input class="right" type="tel" placeholder="请输入手机号" v-model.trim="address.mobile" maxlength="11" @keyup="change()"></div>
      <div class="idcard">
        <p class="left">身份证号</p><input class="right" type="text" placeholder="(选填，购买直邮、保税商品必填)" v-model.trim="address.idcard" @keyup="change()"></div>
      <div @click="openAddress()">
        <p class="left">省市区</p>
        <p class="right" :class="{'noselect':addressName=='请选择所在省市区'}">{{addressName}}</p>
      </div>
      <div class="xtextarea">
        <p class="left">详细地址</p>
        <textarea class="right" :maxlength="50" placeholder="请输入详细地址" v-model.trim="address.addressDetail" :rows="2" @keyup="change()"></textarea>
      </div>
    </div>
    <button @click="saveAddress()">保存</button>
    <div v-transfer-dom>
      <popup class="popup" v-model="showAddress" position="bottom">
        <div class="check-btn">
          <p @click="check(false)">取消</p>
          <p @click="check(true)">确定</p>
        </div>
        <picker height="150" class="picker" :data='provincesList' :fixed-columns="3" :columns="3" v-model='newKeys' :show-name="true" @on-change='change' ref="picker"></picker>
      </popup>
    </div>
  </div>
</template>
<script>
import { TransferDom, Picker, Popup } from 'vux'
export default {
  components: {
    Picker,
    Popup
  },
  directives: {
    TransferDom
  },
  data() {
    return {
      address: this.$route.params,
      showAddress: false,
      addressKeys: [],
      newKeys: [],
      addressName: '请选择所在省市区',
      select: false
    }
  },
  created() {
    this.addressKeys = []
    if (this.address) {
      if (this.address.provNum) {
        this.addressKeys.push(this.address.provNum)
      }
      if (this.address.cityNum) {
        this.addressKeys.push(this.address.cityNum)
      }
      if (this.address.areaNum) {
        this.addressKeys.push(this.address.areaNum)
      }
      this.addressName =
        (this.address.provinceName || '') +
          '' +
          (this.address.cityName || '') +
          '' +
          (this.address.areaName || '') || '请选择所在省市区'
    }
  },
  methods: {
    change(v) {},
    check(v) {
      this.showAddress = false
      if (v) {
        this.addressName = this.$refs.picker.getNameValues()
        this.addressKeys = this.newKeys
      }
    },
    openAddress() {
      this.showAddress = true
    },
    saveAddress() {
      if (!this.phoneFormat(this.address.mobile)) {
        this.showToast('手机号码格式错误')
        return
      }
      if (
        !this.address.addressDetail ||
        this.address.addressDetail.length < 2
      ) {
        this.showToast('请填写详细地址')
        return
      }
      let httpData = {
        addressDetail: this.address.addressDetail,
        provNum: this.addressKeys[0],
        cityNum: this.addressKeys[1],
        areaNum: this.addressKeys[2],
        mobile: this.address.mobile,
        trueName: this.address.trueName,
        idCard: this.address.idcard
      }
      if (!this.addressKeys[2] || this.addressKeys[2] == 0) {
        delete httpData.areaNum
      }
      if (this.$route.params.addressId) {
        httpData.addressId = this.$route.params.addressId
        this.edit(httpData)
      } else {
        this.save(httpData)
      }
    },
    save(httpData) {
      this.$http.post('uc/address_save.do', httpData).then(data => {
        this.showToast('地址保存成功')
        history.back()
      })
    },
    edit(httpData) {
      this.$http.post('uc/edit_address.do', httpData).then(data => {
        this.showToast('地址修改成功')
        history.back()
      })
    }
  }
}
</script>
<style lang="less">
input::-webkit-input-placeholder {
  color: #cbcbcb;
}
textarea::-webkit-input-placeholder {
  color: #cbcbcb;
}
.check-btn {
  display: flex;
  justify-content: space-between;
  > p {
    width: 100px;
    text-align: center;
    font-size: 16px;
    line-height: 35px;
  }
}
.edit-page {
  color: #272728;
  .add-info {
    font-size: 14px;
    padding: 0 15px;
    background: white;
    > div {
      display: flex;
      height: 56px;
      line-height: 56px;
      .left {
        width: 95px;
        color: #838388;
      }
      .right {
        flex: 1;
        word-break: break-all;
        border: none;
      }
      .right.noselect {
        color: #cbcbcb;
      }
    }
    .xtextarea {
      height: 100px;
    }
    textarea {
      margin-top: 20px;
      padding: 0;
      resize: none;
      color: #272728;
      font-size: 14px;
      font-family: '';
    }
  }
  button {
    display: block;
    width: 265px;
    height: 44px;
    background: linear-gradient(-217deg, #fc6655 0%, #ff8996 100%);
    box-shadow: 0 4px 13px 0 rgba(255, 151, 69, 0.44);
    border-radius: 51px;
    text-align: center;
    color: #fff;
    font-size: 15px;
    margin: 70px auto;
  }
}
</style>
