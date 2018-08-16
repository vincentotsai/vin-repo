<template>
  <div id="foot-tab" class="vux-1px-t" @touchmove.prevent="prevent()">
    <router-link :to="'/home'" class="home list-box">
      <div class="icon"></div>
    </router-link>
    <router-link :to="'/classify'" class="find list-box">
      <div class="icon"></div>
    </router-link>
    <router-link :to="'/discovery'" class="discovery list-box">
      <div class="icon"></div>
    </router-link>
    <router-link :to="'/cart'" class="cart list-box">
      <div class="within10" :class="{'within100':cartCount > 9 && cartCount < 100}" v-if="cartCount > 0 && cartCount < 100">{{cartCount}}</div>
      <div class="over99" v-else-if="cartCount > 99">99+</div>
      <div class="icon"></div>
    </router-link>
    <router-link :to="'/set'" class="set list-box">
      <div class="icon"></div>
    </router-link>
  </div>
</template>
<script>
import bus from "@/util/bus";
export default {
  name: "foot-bar",
  data() {
    return {
      cartCount: 0
    };
  },
  mounted() {
    let vm = this; //必须
    bus.$on("cart-count-change", function(data) {
      // log('inner this === outer this ? ',this === vm) //false
      vm.cartCount = data;
    });

    if (window.getCookie('token')) {
      this.globalUpdateCartCount();
      if (window.getCookie('cartCount') && window.getCookie('cartCount') != "undefined") {
        this.cartCount = window.getCookie('cartCount')
      }
    }
  },
  methods: {
    toDiscovery() {
      this.$vux.toast.text('待开放~')
    },
    prevent(e) {
      return false;
    }
  }
};
</script>
<style lang="less" scoped>
@import "../../styles/index.less";
#foot-tab {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 48px;
  z-index: 999;
  overflow: hidden;
  background: #ffffff;
  box-sizing: border-box;
  box-shadow: 0 0.5px #a0a4a6, 0 0.5px #a0a4a6 inset;
  .list-box {
    width: 20%;
    height: 100%;
    float: left;
    z-index: 1000;
  }
}
// 底部菜单图标
.icon {
  height: 38px;
  width: 40px;
  margin: 4px auto;
}
.home .icon {
  background: url("../../assets/foot-tab/user_Toolbar_icon_home@2x.png") no-repeat center / 100%;
}
.home.router-link-active .icon {
  background: url("../../assets/foot-tab/user_Toolbar_icon_home_hover@2x.png") no-repeat center / 100%;
}
.find .icon {
  background: url("../../assets/foot-tab/user_Toolbar_icon_fenlei@2x.png") no-repeat center / 100%;
}
.find.router-link-active .icon {
  background: url("../../assets/foot-tab/user_Toolbar_icon_fenlei_hover@2x.png") no-repeat center / 100%;
}
.discovery .icon {
  background: url("../../assets/foot-tab/user_Toolbar_icon_view@2x.png") no-repeat center / 100%;
}
.discovery.router-link-active .icon {
  background: url("../../assets/foot-tab/user_Toolbar_icon_view_pre@2x.png") no-repeat center / 100%;
}
.cart .icon {
  background: url("../../assets/foot-tab/user_Toolbar_icon_gouwuche@2x.png") no-repeat center / 100%;
}
.cart.router-link-active .icon {
  background: url("../../assets/foot-tab/user_Toolbar_icon_gouwuche_hover@2x.png") no-repeat center / 100%;
}
.set .icon {
  background: url("../../assets/foot-tab/user_Toolbar_icon_me@2x.png") no-repeat center / 100%;
}
.set.router-link-active .icon {
  background:url("../../assets/foot-tab/user_Toolbar_icon_me_hover@2x.png") no-repeat center / 100%;
}
.within10 {
  width: 16px;
  height: 16px;
  background: linear-gradient(139deg, #ff8996 0%, #fc6655 97%);
  position: absolute;
  right: 85px;
  color: #fff;
  top: 3px;
  font-size: 12px;
  line-height: 16px;
  text-align: center;
  border-radius: 50%;
  z-index: 999;
}
.within100,
.over99 {
  height: 16px;
  width: 26px;
  background: linear-gradient(139deg, #ff8996 0%, #fc6655 97%);
  position: absolute;
  right: 80px;
  color: #fff;
  top: 3px;
  font-size: 12px;
  line-height: 16px;
  text-align: center;
  border-radius: 100px;
  z-index: 999;
}
</style>
