<template>
  <div id="app">
    <transition name="router-fade" mode="out-in">
      <keep-alive :max="20">
        <router-view v-if="$route.meta.keepAlive" :key="$route.fullPath" class="view-content"></router-view>
      </keep-alive>
    </transition>
    <transition name="router-fade" mode="out-in">
      <router-view v-if="!$route.meta.keepAlive" :key="$route.fullPath" class="view-content"></router-view>
    </transition>
    <foot-tab v-if="foottabVisible"></foot-tab>
  </div>
</template>
<script>
import FootTab from '@/components/common/foot_tab'
export default {
  name: 'app',
  components: {
    FootTab
  },
  computed: {
    foottabVisible() {
      return (
        ['/home', '/classify', '/discovery', '/cart', '/set'].indexOf(
          this.$route.path
        ) > -1
      )
    }
  }
}
</script>

<style lang="less">
@import '~vux/src/styles/1px.less';
@import './styles/index.less';
#app {
  width: 100%;
}
.view-content {
  width: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  box-sizing: border-box;
  background: #fafafa;
}
.router-fade-enter-active,
.router-fade-leave-active {
  transition: opacity 0.3s;
}
.router-fade-enter,
.router-fade-leave-active {
  opacity: 0;
}
.bold {
  font-weight: bold;
}
</style>
