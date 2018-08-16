<template>
  <div class="entry-page">
    <div class="entry_header">
      <div class="entry_way">
        <div class="code_way" @click='choose_way("code")'>
          <p>验证码登录</p>
          <img v-if="way_bool" src="../../assets/h5_icon_login_sanjiao.png" alt="">
        </div>
        <div class="password_way" @click='choose_way("password")'>
          <p>密码登录</p>
          <img v-if="!way_bool" src="../../assets/h5_icon_login_sanjiao.png" alt="">
        </div>
      </div>
    </div>
    <!-- 验证码登录 -->
    <div class="code_identifying" v-if='way_bool'>
      <div class="entry_info">
        <div class="phone">
          <span @click="popupVisible=true" class="bold">{{areaCodeStr}}</span>
          <input placeholder="请输入手机号" type="tel" maxlength="11" v-model.number.trim="telephone" />
        </div>
        <div class="photo_cord">
          <input type="tel" placeholder="请输入图片验证码" v-model.trim="verifyCode" />
          <img :src="piccode" @click="getPic" />
        </div>
        <div class="password">
          <input placeholder="请输入验证码" type="tel" v-model.trim="identifying_code" />
          <span v-bind:class="{ disabled: codeTime!=0 }" @click='getMessage()'>{{codeTime==0?'获取验证码':codeTime+'后获取'}}</span>
        </div>
      </div>
    </div>
    <!-- 密码登录 -->
    <div class="password_entry" v-if='!way_bool'>
      <div class="entry_info">
        <div class="phone">
          <span @click="popupVisible=true" class="bold">{{areaCodeStr}}</span><input placeholder="请输入手机号" type="tel" maxlength="11" v-model.number.trim="telephone" /></div>
        <div class="password"><input placeholder="请输入登录密码" type="password" v-model.trim="password" maxlength="15" @keyup.enter="entry" /></div>
      </div>
    </div>

    <div class="entry_button" @click="entry()">登 录</div>
    <p class="entry_prompt" v-if='way_bool'>未注册手机验证后自动登录</p>
    <div v-if="popupVisible" @click="popupVisible=false" class="wrap">
      <div class="inner-wrap">
        <indexlist :data="areaList" v-if="areaList.length" @choose="chooseAreaCode"></indexlist>
      </div>
    </div>
  </div>
</template>

<script>
import indexlist from '@/components/common/index_list'
import bus from '@/util/bus'
export default {
  name: 'entry',
  data() {
    return {
      telephone: '',
      identifying_code: '',
      password: '',
      codeTime: 0,
      way_bool: true,
      piccode: '',
      picCodeKey: '',
      verifyCode: '',
      popupVisible: false,
      areaCodeStr: '中国',
      areaCode: '86',
      areaList: []
    }
  },
  components: {
    indexlist
  },
  created() {
    this.getAreaList()
    this.setTitle('登录')
    this.getPic()
    this.$root.$on('AREA-LOADED', data => {
      this.areaList = data
    })
  },
  methods: {
    chooseAreaCode(item) {
      this.areaCodeStr = item.desc
      this.areaCode = item.code.split('+')[1]
      this.popupVisible = false
    },
    choose_way(name) {
      this.way_bool = name == 'code'
    },
    //请求图形验证码
    getPic() {
      this.picCodeKey = parseInt(new Date().getTime() + Math.random() * 10000) + ''
      this.piccode = this.base_url + 'uc/picture_verification_code.do?key=' + this.picCodeKey
    },
    //获取验证码
    getMessage() {
      if (this.codeTime != 0) {
        return
      }
      if (this.telephone == '') {
        this.showToast('请填写手机号码')
        return false
      }
      this.$http
        .post('uc/send_receive.do', {
          areaCode: this.areaCode,
          key: this.picCodeKey,
          type: '1',
          mobileOrEmail: String(this.telephone),
          verify_code: String(this.verifyCode)
        })
        .then(data => {
          this.showToast('短信已发送')
          this.countDown()
        })
    },
    countDown() {
      this.codeTime = 120
      this.leftCount = setInterval(() => {
        this.codeTime--
        if (this.codeTime <= 0) {
          clearInterval(this.leftCount)
        }
      }, 1000)
    },
    //判断登录方式
    entry() {
      if (this.way_bool) {
        this.codeLogin()
      } else {
        this.psLogin()
      }
    },
    //验证码登录
    codeLogin() {
      if (this.identifying_code == '') {
        this.showToast('请填写验证码')
        return
      }
      let httpData = {
        message: this.identifying_code + '',
        mobile: this.telephone + '',
        areaCode: this.areaCode
      }
      if(sessionStorage.openId){
        httpData.openId = sessionStorage.openId
      }
      this.$vux.loading.show({
        text: '登录中...'
      })
      this.$http
        .post('uc/message_verification_login.do', httpData)
        .then(data => {
          this.loginSuccess(data)
        })
    },
    //密码登录
    psLogin() {
      if (this.telephone == '') {
        this.showToast('请填写手机号码')
        return false
      }
      if (this.password == '') {
        this.showToast('请填写密码')
        return false
      }
      let httpData = {
        areaCode: this.areaCode,
        mobile: this.telephone + '',
        password: this.password + '',
      }
      if(sessionStorage.openId){
        httpData.openId = sessionStorage.openId
      }
      this.$vux.loading.show({
        text: '登录中...'
      })
      this.$http.post('uc/password_login.do', httpData).then(data => {
        this.loginSuccess(data)
      })
    },
    loginSuccess(data) {
      window.setCookie('token', data.data.token)
      window.setCookie('userId', data.data.userId)
      window.setCookie('shopId', data.data.shopId)
      window.setCookie('userLevel', data.data.userLevel)
      this.$vux.loading.hide()
      this.$router.replace({
        path: this.$route.query.redirect  || '/home'
      })
      this.getLotteryTime()
      this.getUserData(() => {
        //登录送优惠券
        this.$http.get('order/login_gift.do').then(res => {
          if (location.href.indexOf('entry') != -1) {
            this.route_link('home')
          } else {
            window.location.reload()
          }
        })
      })
    },
    route_link(base, param) {
      let params = param || {}
      this.$router.push({
        name: base,
        params: params,
        query: params
      })
    }
  }
}
</script>
<style lang="less">
@import '../../styles/index.less';
input[type='tel'] {
  width: 130px;
}
.wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  .inner-wrap {
    width: 100%;
    height: 80%;
    position: fixed;
    bottom: 0;
    left: 0;
  }
}
.entry-page {
  height: 100%;
  background: #fff;
}
.mint-indexsection-index {
  font-size: 20px;
}
.mint-cell-text {
  font-size: 18px;
}
.bar-wrap {
  position: relative;
}
.code2 {
  position: absolute;
  right: 48px;
  top: 15px;
  font-size: 16px;
}
.entry_header {
  width: 100%;
  height: 202px;
  background-image: url('../../assets/h5_bg_login_1.png');
  background-size: 100%;
  position: relative;
  .entry_way {
    width: 100%;
    position: absolute;
    bottom: 0;
    overflow: hidden;
    font-size: 14px;
    color: #fff;
    > div {
      position: relative;
      width: 50%;
      height: 30px;
      overflow: hidden;
      > p {
        width: 100%;
        text-align: center;
      }
      > img {
        width: 16px;
        height: 7px;
        position: absolute;
        bottom: -1px;
        margin-left: -8px;
        left: 50%;
      }
    }
    .code_way {
      float: left;
    }
    .password_way {
      float: right;
    }
  }
}
.code_identifying .entry_info,
.password_entry .entry_info {
  padding: 8px 54px 62px 54px;
  background: #fff;
  > div {
    border-bottom: solid 1px rgba(236, 236, 236, 0.5);
    padding: 24px 0 8px 0;
    overflow: hidden;
  }
  input {
    line-height: 20px;
  }
  span {
    line-height: 20px;
  }
  .phone {
    position: relative;
    overflow: hidden;
    span {
      float: left;
      font-size: 14px;
      color: #838388;
      padding-right: 10px;
      border-right: 1px solid #f2f2f2;
    }
    input {
      float: left;
      font-size: 14px;
      color: #272728;
      padding-left: 10px;
    }
  }
  .photo_cord {
    span {
      float: left;
      font-size: 14px;
      color: #838388;
      width: 50px;
    }
    input {
      float: right;
      width: 198px;
      font-size: 14px;
      color: #272728;
    }
    input {
      width: 191px;
      float: left;
    }
    img {
      width: 65px;
      height: 25px;
      float: right;
    }
  }
  .password {
    > span {
      text-align: right;
    }
    input {
      font-size: 14px;
      color: #272728;
      width: 100%;
      float: left;
    }
  }
}
.code_identifying .password {
  span {
    line-height: 20px;
    padding: 0 10px;
    color: #ff6532;
    text-align: center;
    float: right;
    font-size: 12px;
    color: #86898b;
  }
  input {
    .pxrem(width,161) !important;
  }
}
.entry_prompt {
  color: #86898b;
  font-size: 12px;
  text-align: center;
  margin-top: 17px;
}
.entry_button {
  width: 265px;
  height: 40px;
  background: linear-gradient(196deg, #ff8996 0%, #fc6655 100%);
  box-shadow: 0 4px 13px 0 rgba(255, 151, 69, 0.44);
  border-radius: 51px;
  font-size: 16px;
  color: #ffffff;
  text-align: center;
  line-height: 40px;
  margin: 0 auto 18px;
}
.forget-pass {
  font-size: 12px;
  color: #86898b;
  line-height: 20px;
  float: right;
  margin-right: 56px;
}
.disabled {
  background: #c7cbcd;
  border: 1px solid #c7cbcd !important;
}
</style>

