import Vue from 'vue'
import App from './App'
import routes from './router'
import VueRouter from 'vue-router'
import {wechatLogin} from './wx/wx-login'
import VueClipboard from 'vue-clipboard2'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
import { is_weixin, getUrlKey } from './util/public-fun'

import './util'
import {
  LoadingPlugin,
  XImg,
  ConfirmPlugin
} from 'vux'

import scroller from '@/components/common/scroller.vue' //加载更多
import soldoutMask from '@/components/common/soldout_mask'
import shortcut from '@/components/common/shortcut'

Vue.use(VueRouter)
Vue.use(LoadingPlugin)
Vue.use(ConfirmPlugin)
Vue.use(VueClipboard)
Vue.use(VueAwesomeSwiper)

Vue.component('scroller', scroller)
Vue.component('soldout-mask', soldoutMask)
Vue.component('shortcut', shortcut)
Vue.component('XImg', XImg)

Vue.config.productionTip = false

const router = new VueRouter({
  routes,
  base: __dirname,
  mode: 'hash'
})

router.beforeEach((to, from, next) => {
  //推荐人user_id userId share_uid 为了兼容旧版本的app  后面会统一用share_uid
  if (to.query.user_id || to.query.userId || to.query.share_uid) {
    window.setCookie('parentId', to.query.share_uid || to.query.user_id || to.query.userId)
  }
  document.title = to.meta.title

  Vue.$vux.loading.show({
    text: '加载中...'
  })
  console.log(window.getCookie('token'))
  if (!window.getCookie('token')) {
    //是否需要登录
    if (to.meta.requireAuth) {
      if(is_weixin() && sessionStorage.isBind){
        sessionStorage.removeItem('openId');
        wechatLogin();
      }else{
        next({
          path: '/entry',
          query: {
            redirect: to.path
          }
        })
      }
    } else {
      next()
    }
  } else {
    next()
  }
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
