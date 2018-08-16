import Vue from 'vue'
import Router from 'vue-router'
import ErrorPage from '@/components/pages/error'

Vue.use(Router)

const router = new Router({
  routes: [{
      path: '/',
      redirect: '/shop'
    },
    {
      path: '/shop',
      name: 'shop',
      component: require('@/components/pages/shop'),
      meta: {
        title: '精选'
      }
    },
    {
      path: '/my',
      name: 'my',
      component: function (resolve) {
        require(['@/components/pages/my'], resolve)
      },
      meta: {
        title: '我的'
      }
    },
    {
      path: '/help',
      name: 'help',
      component: function (resolve) {
        require(['@/components/pages/help'], resolve)
      },
      meta: {
        title: '帮助反馈'
      }
    },
    {
      path: '/join',
      name: 'join',
      component: function (resolve) {
        require(['@/components/pages/join'], resolve)
      },
      meta: {
        title: '推荐加盟'
      }
    },
    {
      path: '/lecturer/:id',
      name: 'lecturer',
      component: function (resolve) {
        require(['@/components/pages/lecturer'], resolve)
      },
      meta: {
        title: '讲师主页'
      }
    },

    {
      path: '/my/course',
      name: 'myCourse',
      component: function (resolve) {
        require(['@/components/pages/my-course'], resolve)
      },
      meta: {
        title: '我的课程'
      }
    },
    {
      path: '/pay/history',
      component: function (resolve) {
        require(['@/components/pages/pay-history'], resolve)
      },
      meta: {
        title: '消费记录'
      }
    },

    {
      path: '/course/:id',
      name: 'course',
      component: function (resolve) {
        require(['@/components/pages/course'], resolve)
      },
      meta: {
        title: '课程详情'
      }
    },

    {
      path: '/series/:id',
      name: 'series',
      component: function (resolve) {
        require(['@/components/pages/series'], resolve)
      },
      meta: {
        title: '系列详情'
      }
    },

    {
      path: '/course/:id/play',
      name: 'play',
      component: function (resolve) {
        require(['@/components/pages/play'], resolve)
      },
      meta: {
        title: '课程点播'
      }
    },

    {
      path: '/series/:id/play',
      name: 'seriesPlay',
      component: function (resolve) {
        require(['@/components/pages/series-play'], resolve)
      },
      meta: {
        title: '系列课点播'
      }
    },

    {
      path: '/404',
      name: '404',
      component: ErrorPage,
      meta: {
        title: '服务器出错',
        type: '404'
      }
    },

    {
      path: '/500',
      name: '500',
      component: ErrorPage,
      meta: {
        title: '未连接',
        type: '500'
      }
    }
  ]
})

/**
 * 数据加载方式使用导航完成前加载，数据返回后完成导航并渲染页面，所以需要在导航过程中显示loading
 * 切记：导航失败（即next(false)）不会触发afterEach，所以不会关闭loading
 * 目前只有数据加载失败才会调用next(false)，因此已经在数据加载失败时加上了关闭loading操作，若其他情况需要使用next(false)，请手动关闭loading
 */
router.beforeEach((to, from, next) => {
  Vue.$vux.loading.show({
    text: '加载中...'
  })
  next()
})
router.afterEach(route => {
  document.title = route.meta.title
  Vue.$vux.loading.hide()
})

window.$router = router

export default router
