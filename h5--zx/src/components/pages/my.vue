<template>
  <section class="my-stage">
    <div class="user-info">
      <img :src="user.avatar_address">
      <span>{{user.nick_name}}</span>
    </div>
    <ul class="menu">
      <router-link class="vux-1px-b" tag="li" to="/my/course">
        <span>我的课程</span>
        <span class="course-num">{{user.course_num || ''}}</span>
      </router-link>
      <router-link class="vux-1px-b" tag="li" to="/pay/history">
        <span>消费记录</span>
      </router-link>
      <router-link tag="li" to="/help">
        <span>帮助与反馈</span>
      </router-link>
    </ul>
    <nav-bar></nav-bar>
  </section>
</template>
<script>
  import navBar from '../common/nav-bar'
  const fetchData = () => {
    return $http.get(`sharing-server-user-common/user/common/userinfo/get`)
  }
  export default {
    name: 'my',
    components: {
      navBar
    },
    data() {
      return {
        user: ""
      }
    },
    methods: {
      onFetchData(res) {
        this.user = res.data
      }
    },
    beforeRouteEnter(to, from, next) {
      fetchData().then(res => {
        next(vm => {
          vm.onFetchData(res)
        })
      })
    }
  }

</script>
<style lang="less" scoped>
  .my-stage {
    .user-info {
      padding: 42px;
      background: #fff;
      >img {
        margin: 0 auto;
        display: block;
        height: 58px;
        width: 58px;
        border-radius: 50%;
      }
      >span {
        margin: 6px auto 0 auto;
        display: block;
        font-size: 15px;
        color: #393D42;
        letter-spacing: -0.53px;
        text-align: center;
      }
    }
    .menu {
      margin-top: 10px;
      background: #fff;
      >li {
        position: relative;
        font-size: 15px;
        color: #393D42;
        padding: 16px 12px;
        &:before {
          content: '';
          position: absolute;
          top: 20px;
          right: 12px;
          display: inline-block;
          width: 7px;
          height: 12px;
          background: url('../../assets/icons/ic_arrow_right_big.png') no-repeat center;
          background-size: cover;
        }
        .course-num {
          position: absolute;
          right: 40px;
          top: 0;
          display: block;
          height: 50px;
          line-height: 50px;
          font-size: 14px;
          color: #80848A;
        }
      }
    }
  }

</style>
