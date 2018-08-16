<template>
  <section class="help-stage">
    <label for="opinion">您的意见
      <span>(300字)</span>
    </label>
    <group gutter="10px" class="group">
      <x-textarea class="opinion-text" name="opinion" v-model.trim="opinion" placeholder="请留下您宝贵的意见" :show-counter="false" :max="300"></x-textarea>
    </group>
    <label for="opinion">手机号码
      <span>(非必填)</span>
    </label>
    <group gutter="10px" class="group">
      <x-input class="phone-num" type="tel" v-model.trim="phoneNum" placeholder="请留下您的手机联系号码哟"></x-input>
    </group>
    <x-button class="btn-submit" @click.native="submit">提交</x-button>
  </section>
</template>
<script>
import { Group, XTextarea, XInput, XButton } from 'vux'
export default {
  name: 'help',
  components: {
    Group,
    XTextarea,
    XInput,
    XButton
  },
  data() {
    return {
      opinion: '',
      phoneNum: ''
    }
  },
  methods: {
    submit() {
      let content = this.opinion
      if (!content) {
        this.$vux.toast.show({
          text: '意见内容不能为空！',
          type: 'cancel'
        })
        return
      }
      let params = {
        content
      }
      if (this.phoneNum) {
        params.phoneNum = this.phoneNum
      }
      this.$http
        .post('sharing-server-user-common/user/common/feedback', params)
        .then(res => {
          this.$vux.toast.show({
            text: '发送成功'
          })
          this.$router.back()
        })
    }
  },
  beforeRouteLeave(to, from, next) {
    next(confirm('save?'))
  }
}
</script>
<style lang="less">
.help-stage {
  padding: 14px 12px;
  > label {
    font-size: 15px;
    height: 22px;
    line-height: 22px;
    color: #393d42;
    > span {
      display: inline-block;
      font-size: 12px;
      color: #cecece;
    }
  }
  .group {
    margin-bottom: 14px;
    .opinion-text {
      font-size: 14px;
      color: #393d42;
      textarea {
        height: 179px;
      }
    }
    .phone-num {
      font-size: 14px;
      color: #393d42;
    }
  }
  > .btn-submit {
    margin-top: 36px;
    height: 44px;
    width: 310px;
    border-radius: 100px;
    background: #fe5252;
    font-size: 16px;
    color: #ffffff;
    line-height: 16px;
    &:after {
      border-radius: 200px;
    }
    &:not(.weui-btn_disabled):active {
      background: #d94548;
      color: #ffffff;
    }
  }
}
</style>
