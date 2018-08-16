<template>
	<div class="box">
		<div class="verify_header">
      <img v-if="way_bool" src="../../assets/set/user_icon_setting_jindu_1_red.png" class="buzou1-img">
      <img v-else src="../../assets/set/user_icon_setting_jindu_1_gray.png" class="buzou1-img">
      <span :class="{ veri: way_bool }" class="verify-mobile">验证身份</span>
      <img src="../../assets/set/user_icon_setting_jindu_arrow.png" class="arrow">
      <img v-if="way_bool" src="../../assets/set/user_icon_setting_jindu_2_gray.png" class="buzou2-img">
      <img v-else src="../../assets/set/user_icon_setting_jindu_2_red.png" class="buzou2-img">
      <span :class="{ pass: !way_bool }" class="set-password">设置新密码</span>
		</div>
    <div class='verify_info'>
      <div class="verify-code" v-if="way_bool">
        <div class="tips">请输入此店铺的手机<span class="tel">{{phoneNumber}}</span>收到的验证码</div>
        <div class="verify-box">
          <input placeholder="请输入验证码" v-model.trim="smsCode" type="tel"  @keyup="change(smsCode)" />
          <span v-bind:class="{ invalid: !canGet }" @click='getMessage()'>{{codeTip}}</span>
        </div>
      </div>
      <div class="newpassword" v-if="!way_bool">
        <div class="tips">设置登录密码，可使用【手机号+密码】</div>
        <div class='newpwd'>
          <input placeholder="输入新密码" v-model.trim="password" @keyup="change(password)" type="password"/>
        </div>
        <div class='again'>
          <input placeholder="再次输入新密码" v-model.trim="passwords" @keyup="change(password)" type="password"/>
        </div>
        <div class='tishi'>密码6~16位数字、字母组合，字母区分大小写</div>
      </div>
      <div v-if="way_bool" :class="{'nextActive':nextBtn}" class='verify' @click="verify()">确定</div>
      <div v-if="!way_bool" :class="{'nextActive':nextBtn}" class='verify' @click="certain()">确定</div>
    </div>
	</div>
</template>

<script>
export default {
  data() {
    return {
      telephone: '',
      smsCode: '',
      canGet: true,
      codeTip: '获取验证码',
      flag: false,
      way_bool: true,
      verifyCode: '',
      piccode: '',
      Token: '',
      phoneNumber: '',
      password: '',
      passwords: '',
      nextBtn: false //是否可以点击
    }
  },
  created() {
    this.getSetInfo()
  },
  methods: {
    change(v) {
      if (v.length > 0) {
        this.nextBtn = true
      }
    },
    //手机号验证时获取用户手机号
    getSetInfo() {
      this.$http.get('/uc/getting_user_information.do').then(res => {
        let data = res.body
        this.phoneNumber = data.mobile
      })
    },
    //获取验证码
    getMessage() {
      this.$http
        .post('/uc/modify_send_mobileOrEmail.do', {
          areaCode: '86',
          mobileOrEmail: this.phoneNumber,
          type: '1'
        })
        .then(res => {
          this.showToast('短信已发送')
          this.countDown()
        })
    },
    countDown() {
      let vm = this
      vm.canGet = false
      setTimeout(() => {
        vm.show = false
      }, 100000)
      let leftTime = 120
      vm.leftCount = setInterval(function() {
        leftTime--
        vm.codeTip = '已发送(' + leftTime + 's)'
        if (leftTime <= 0) {
          clearInterval(vm.leftCount)
          vm.codeTip = '获取验证码'
          vm.canGet = true
        }
      }, 1000)
    },
    verify() {
      this.$http
        .post('/uc/modify_verify_mobileOrEmail.do', {
          areaCode: '86',
          message: this.smsCode,
          mobileOrEmail: this.phoneNumber,
          type: '1'
        })
        .then(res => {
          let data = res.body
          this.Token = data.nextToken
          this.way_bool = false
        })
    },
    //设置或保存新密码
    certain() {
      // var vm_self=this;
      if (this.password == '') {
        this.showToast('请输入原密码')
        return false
      } else if (this.password.toString().length < 6) {
        this.showToast('密码不少于6位')
        return false
      } else if (!/^[A-Za-z0-9]+$/.test(this.password)) {
        this.showToast('密码格式有误，请重新填写')
        return false
      } else if (this.password != this.passwords) {
        this.showToast('两次密码输入不一致')
        return false
      }
      this.$http
        .post('/uc/modify_mobile_password.do', {
          nextToken: this.Token,
          password: this.password.toString(),
          passwords: this.passwords.toString()
        })
        .then(res => {
          localStorage.removeItem('token')
          this.$router.replace({ name: 'entry' })
        })
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
    }
  }
}
</script>

<style scoped lang="less">
@import '../../styles/index.less';
.box {
  height: 100%;
  background: #fff;
}
.verify_header {
  width: 100%;
  .pxrem(height,43);
  .pxrem(padding,13,65,13,65);
  box-sizing: border-box;
  font-size: 12px;
  color: #cbcbcb;
  background: #fff;
}
.verify-mobile,
.set-password {
  display: inline-block;
  position: relative;
  .pxrem(top,-2);
}
.verify-mobile {
  .pxrem(margin,0,40,0,7);
}
.buzou2-img {
  .pxrem(margin,0,7,0,25);
}
.arrow {
  .pxrem(width,6);
  .pxrem(height,9);
  margin-bottom: 2px;
}
.veri,
.pass {
  color: #fc6655;
}
.buzou1-img,
.buzou2-img {
  .pxrem(width,15);
  .pxrem(height,15);
}
.verify_header .set_password {
  float: left;
}

.verify-code {
  // .pxrem(padding,38,35,0,35);
  .pxrem(padding,35,0,0,0);
}
.tips {
  font-size: 13px;
  color: #86898b;
  text-align: center;
}
.tel {
  color: #fc6655;
}
.verify-box {
  margin: 0 auto;
  .pxrem(width,190);
  .pxrem(line-height,20);
  .pxrem(padding,41,75,8,0);
  border-bottom: 1px solid #ececec;
  .pxrem(font-size,14);
  color: #cbcbcb;
  position: relative;
  input::-webkit-input-placeholder {
    color: #cbcbcb;
    text-align: left;
    background: #fff;
  }
}
.verify-box span {
  position: absolute;
  right: 0;
  top: 41px;
  width: 75px;
  text-align: center;
  font-size: 12px;
  color: #86898b;
  line-height: 20px;
}

.newpassword {
  width: 100%;
  .pxrem(padding,30,40,0,40);
  box-sizing: border-box;
  .pxrem(font-size,14);
  input::-webkit-input-placeholder {
    color: #cecece;
    text-align: left;
  }
}
.newpwd {
  .pxrem(margin-top,16);
  width: 100%;
  .pxrem(height,59);
  .pxrem(padding,31,0,8,0);
  box-sizing: border-box;
  position: relative;
}
.again {
  width: 100%;
  .pxrem(height,59);
  .pxrem(padding,31,0,8,0);
  box-sizing: border-box;
  position: relative;
}
.tishi {
  .pxrem(font-size,12);
  text-align: left;
  color: #cecece;
  .pxrem(margin-top,13);
  .pxrem(height,20);
  .pxrem(line-height,20);
}
.newpwd:after,
.again:after {
  content: ' ';
  display: block;
  box-sizing: border-box;
  position: absolute;
  left: 0px;
  bottom: 0px;
  width: 100%;
  .pxrem(height,1);
  background: #f2f2f2;
  transform-origin: 0 0;
  transform: scaleY(0.5);
}
.verify {
  width: 265px;
  height: 40px;
  line-height: 40px;
  background: #cecece;
  box-shadow: 0 7px 8px 0 rgba(120, 120, 120, 0.15);
  border-radius: 56px;
  text-align: center;
  margin: auto;
  margin-top: 84px;
  font-size: 16px;
  color: #fff;
  background: linear-gradient(-196deg, #fc6655 0%, #ff8996 100%);
}
.nextActive {
  background: linear-gradient(-196deg, #fc6655 0%, #ff8996 100%);
  box-shadow: 0 4px 13px 0 rgba(255, 151, 69, 0.44);
  border-radius: 51px;
}
</style>
