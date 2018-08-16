<!-- 快捷导航 -->
<template>
  <div class="shortcut">
    <router-link class="search" v-if="opt.home && opt.home.show" :to="{name: 'home'}">
      <img src="../../assets/home/2xh5_icon_shouye_home.png">
    </router-link>
    <router-link class="search" v-if="opt.search && opt.search.show" :to="{name: 'search'}">
      <img src="../../assets/home/h5_icon_shouye_sousuo.png">
    </router-link>
    <router-link class="msg" v-if="opt.msg && opt.msg.show" :to="{ name: 'message'}">
      <img class="icon" src="../../assets/home/h5_icon_shouye_xinxi.png">
      <img class="dot" src="../../assets/home/h5_icon_shouye_xinxi_red.png" v-if="opt.msg.unreadMsg">
    </router-link>
    <router-link class="cart" v-if="opt.cart && opt.cart.show" :to="{ name: 'cart'}">
      <img class="icon" src="../../assets/h5_icon_gouwuche.png">
    </router-link>
  </div>
</template>
<script>
export default {
  name: 'shortcut',
  props: {
    opt: {
      type: Object,
      default: {
        search: {
          show: false
        },
        msg: {
          show: false
        },
        cart: {
          show: false
        }
      }
    }
  }
}
</script>
<style lang="less" scoped>
.shortcut {
  position: fixed;
  right: 1px;
  bottom: 53px;
  z-index: 999;
  .search {
    display: block;
    img {
      width: 42px;
      height: 42px;
    }
  }
  .msg {
    display: block;
    .icon {
      width: 42px;
      height: 42px;
    }
    .dot {
      position: relative;
      top: -28px;
      width: 6px;
      left: -26px;
      height: 6px;
    }
  }
  .cart {
    display: block;
    width: 42px;
    height: 42px;
    .icon {
      width: 100%;
      border-radius: 15px;
    }
  }
}
</style>
