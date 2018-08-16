<template>
  <ul class="nav-bar vux-1px-t">
    <li>
      <router-link to="/shop" active-class="active" replace>
        <i class="icon icon-shop"></i>
        <label class="text">精选</label>
      </router-link>
    </li>
    <li>
      <router-link to="/my" active-class="active" replace>
        <i class="icon icon-my"></i>
        <label class="text">我的</label>
      </router-link>
    </li>
  </ul>
</template>
<script>
  export default {
    name: 'nav-bar'
  }

</script>
<style lang="less">
  .nav-bar.vux-1px-t {
    position: fixed;
    bottom: 0;

    width: 100%;
    overflow: hidden;

    background: #fff;
    &:before {
      border-color: #E9E9E9;
    }
    >li {
      position: relative;
      float: left;
      width: 50%;
      height: 49px;
      text-align: center;
      a {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

        width: 50%;
      }
    }
    .text {
      display: block;
      font-family: PingFangSC-Regular;
      font-size: 10px;
      line-height: 1.2;
      margin-top: 2px;
      color: #80848A;
    }
    .active >.text {
      color: #FE5252;
    }
    .icon {
      display: block;
      margin: 0 auto;
    }
  }

</style>
