<template>
  <div class="logistics-page">
    <div class="logistics">
      <div class="item">
        <span class="required">*</span>
        <p class="title bold">快递公司</p>
        <input type="text" placeholder="请填写物流公司" v-model.trim="logisWay">
      </div>
      <div class="item">
        <span class="required">*</span>
        <p class="title bold">快递单号</p>
        <input type="text" maxlength="30" placeholder="请填写物流单号" v-model.trim="logisNo">
      </div>
      <div class="item">
        <span class="required">*</span>
        <p class="title bold">寄件人</p>
        <input type="text" placeholder="请输入寄件人姓名" v-model.trim="logisSender">
      </div>
      <div class="item">
        <span class="required">*</span>
        <p class="title bold">寄件电话</p>
        <input type="tel" placeholder="请输入寄件人电话" v-model.trim="logisTel">
      </div>
      <div class="item">
        <p class="title bold mypadding">备注信息</p>
        <textarea name="" id="" rows="4" placeholder="选填" maxlength="150" v-model.trim="remark"></textarea>
      </div>
    </div>
    <div class="bottom-box">
      <button class="submit-btn" @click="submit_info">提交</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'refund_logistics',
  data() {
    return {
      logisWay: '',
      logisNo: '',
      logisSender: '',
      logisTel: '',
      remark: ''
    }
  },
  methods: {
    submit_info() {
      if (this.logisWay == '') {
        this.showToast('请填写物流方式')
        return
      }
      if (this.logisNo == '') {
        this.showToast('请填写物流单号')
        return
      }
      if (this.logisSender == '') {
        this.showToast('请输入寄件人姓名')
        return
      }
      if (!this.logisTel) {
        this.showToast('请输入寄件人电话')
        return
      }
      let httpData = {
        afterSalesNo: this.$route.query.orderNo,
        logId: this.$route.query.logId + '',
        logisNo: this.logisNo,
        logisWay: this.logisWay,
        remark: this.remark,
        sender: this.logisSender,
        tel: this.logisTel
      }
      this.$http.post('order/modify_refundInfo.do', httpData).then(res => {
        this.$router.go(-1)
      })
    }
  }
}
</script>

<style scoped lang="less">
.logistics-page {
  font-size: 14px;
  width: 100%;
  background: #fafafa;
  .logistics {
    background: #fff;
    .item {
      padding: 19px 12px;
      overflow: hidden;
      .title {
        float: left;
        margin-right: 10px;
      }
      .required {
        color: red;
        padding-right: 4px;
        position: relative;
        top: -4px;
        float: left;
      }
      textarea {
        width: 270px;
      }
      .mypadding {
        margin:0 10px;
      }
      .content {
        float: right;
        img {
          width: 6.5px;
          margin-left: 6px;
          vertical-align: middle;
        }
      }
    }
  }
  .bottom-box {
    background: #fff;
    padding: 10px 0;
    width: 100%;
    position: fixed;
    bottom: 0;
    z-index: 100;
    text-align: center;
    .submit-btn {
      width: 265px;
      height: 38px;
      border-radius: 38px;
      color: #fff;
      background: linear-gradient(217deg, #ff8996 0%, #fc6655 100%);
      box-shadow: 0 2px 10px 0 rgba(255, 76, 138, 0.2);
    }
  }
}
</style>
