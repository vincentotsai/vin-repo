// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import router from './router'
import './resource'
import App from './App'

import { AlertPlugin, ToastPlugin, LoadingPlugin, WechatPlugin } from 'vux'
import FastClick from 'fastclick'

import './components/filters'
import './util'
import './wechat'

import scroller from './components/common/Scroller.vue'
import player from './components/common/player.vue'

Vue.use(WechatPlugin)
Vue.use(AlertPlugin)
Vue.use(ToastPlugin)
Vue.use(LoadingPlugin)
// console.log('Vue.wechat->>',Vue.wechat)

FastClick.attach(document.body)

Vue.config.productionTip = false

Vue.component('scroller', scroller)
Vue.component('player', player)

new Vue({
  router,
  render: h => h(App),
  renderError (h, err) {
    return h('pre', { style: { color: 'red' }}, err.stack)
  }
}).$mount('#app-box')


