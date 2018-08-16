<template>
  <div class="view">
    <div class="quit-box">
      <div class="top">
        <div class='invite' v-if="shopId">
          <span class="cell-title">分享码</span>
          <span class="invite-code">{{shopId}}</span>
        </div>
        <div class='telphone'>
          <span class="cell-title">手机号</span>
          <span class="cell-tel">{{tel}}</span>
        </div>
        <router-link class='pwd' :to="{ name: 'verify'}">
          <span class="cell-title">手机登录密码</span>
          <span class="cell-value">
            <span v-show="isSetPwd">未设置密码</span>
          </span>
        </router-link>
      </div>
      <div class="bottom_btn" v-if="!isWx">
        <div class="quit_btn" @click="logout">退出登录</div>
      </div>
    </div>
  </div>
</template>
<script>
import { is_weixin } from '@/util/public-fun'
export default {
  name: 'logout',
  data() {
    return {
      tel: '',
      isSetPwd: false,
      shopId: '',
      isWx: true,
    }
  },
  created() {
    this.getSetInfo();
    this.isWx = is_weixin()
  },
  methods: {
    logout() {
      this.$http.get('uc/logout.do').then(res => {
        window.delCookie('token')
        this.$router.replace({ name: 'entry' })
      })
    },
    //获取用户手机号 haspwd：1（用户已经设置了密码）0（用户没有设置密码）
    getSetInfo() {
      this.$http.get('uc/getting_user_information.do').then(res => {
        let data = res.body
        this.tel = data.mobile
        this.shopId = data.shopId
      })
    }
  }
}
</script>
<style lang="less">
@import '../../styles/index.less';
//修改密码背景图
.top {
  width: 100%;
  .pxrem(margin-bottom, 80);
  padding: 0 12px;
  box-sizing: border-box;
  background: #fff;
}
.telphone,
.pwd,
.invite {
  display: block;
  width: 100%;
  height: 56px;
  line-height: 56px;
  background: #ffffff;
  position: relative;
}
.cell-title {
  font-family: PingFangSC-Semibold;
  font-size: 14px;
  color: #1b1b1b;
  font-weight: bold;
  float: left;
}
.invite-code,
.cell-value,
.cell-tel {
  float: right;
  font-size: 12px;
  color: #86898b;
}
.cell-value:after {
  content: '';
  display: inline-block;
  .pxrem(height, 18);
  .pxrem(width, 18);
  background: url('../../assets/h5_icon_go_small.png') no-repeat left top;
  background-size: cover;
  .pxrem(margin-left, 2);
  position: relative;
  .pxrem(top, 4);
}
.quit_btn {
  .pxrem(width, 333);
  .pxrem(height, 46);
  .pxrem(line-height, 46);
  background: #ff6532;
  .pxrem(border-radius,51);
  .pxrem(font-size,16);
  color: #ffffff;
  text-align: center;
  margin: auto;
}
</style>

<!-- 7mall退出css样式 -->
<style lang="less">
@import '../../styles/index.less';
.top {
  .pxrem(margin-bottom, 114);
  img {
    .pxrem(width, 72);
    .pxrem(height, 72);
    .pxrem(margin-top, 86);
    .pxrem(margin-bottom, 10);
    .pxrem(margin-left, 149);
  }
  p {
    font-size: 14px;
    color: #272728;
    text-align: center;
  }
}

.quit_btn {
  .pxrem(width, 333);
  .pxrem(height, 46);
  .pxrem(line-height, 46);
  background: #ff6532;
  border-radius: 51px;
  font-size: 16px;
  color: #ffffff;
  text-align: center;
  margin: auto;
}
</style>
