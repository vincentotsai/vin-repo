import Vue from 'vue'
import App from './App'
import routes from './router'
import VueRouter from 'vue-router'
import {wechatLogin} from './wx/wx-login'

import './util'
import {
  LoadingPlugin,
  XImg,
  ConfirmPlugin
} from 'vux'


Vue.use(VueRouter)
Vue.use(LoadingPlugin)
Vue.use(ConfirmPlugin)

Vue.config.productionTip = false

const router = new VueRouter({
  routes,
  base: __dirname,
  mode: 'hash'
})

router.beforeEach((to, from, next) => {
  
  document.title = to.meta.title

  Vue.$vux.loading.show({
    text: '加载中...'
  })
  next()
})

router.afterEach((to, from, next) => {
  Vue.$vux.loading.hide()
})

wechatLogin(() => {
  window.appVue = new Vue({
    el: '#app',
    render: h => h(App),
    router
  })
})
