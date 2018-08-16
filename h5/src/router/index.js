// 首屏
const home = r => require.ensure([], () => r(require('@/components/home/home')), 'group-home')
const advert_goods_list = r => require.ensure([], () => r(require('@/components/home/advert_goods_list')), 'group-home')
const login = r => require.ensure([], () => r(require('@/components/set/login')), 'group-home')
const brand_goods_list = r => require.ensure([], () => r(require('@/components/home/brand_goods_list')), 'group-home')
const activity_list = r => require.ensure([], () => r(require('@/components/home/activity_list')), 'group-home')

// 分类
const classify = r => require.ensure([], () => r(require('@/components/classification/classify')), 'group-classify')
const classified_goods = r => require.ensure([], () => r(require('@/components/classification/classified_goods')), 'group-classify')
const classified_goods_list = r => require.ensure([], () => r(require('@/components/classification/classified_goods_list')), 'group-classify')
const search = r => require.ensure([], () => r(require('@/components/classification/search')), 'group-classify')

// 发现
const discovery = r => require.ensure([], () => r(require('@/components/discovery/discovery')), 'group-discovery')
const topic_list = r => require.ensure([], () => r(require('@/components/discovery/topic_list')), 'group-discovery')
const topic_detail = r => require.ensure([], () => r(require('@/components/discovery/topic_detail')), 'group-discovery')

// 购买
const Cart = r => require.ensure([], () => r(require('@/components/cart/cart')), 'group-cart')
const goods_detail = r => require.ensure([], () => r(require('@/components/cart/goods_detail')), 'group-cart')
const order_confirm = r => require.ensure([], () => r(require('@/components/cart/order_confirm')), 'group-cart')
const pay_success = r => require.ensure([], () => r(require('@/components/cart/pay_success')), 'group-cart')

// 订单
const orders = r => require.ensure([], () => r(require('@/components/order/orders')), 'group-order')
const order_detail = r => require.ensure([], () => r(require('@/components/order/order_detail')), 'group-order')
const logistics_list = r => require.ensure([], () => r(require('@/components/order/logistics_list')), 'group-order')
const logistics_detail = r => require.ensure([], () => r(require('@/components/order/logistics_detail')), 'group-order')

// 售后
const after_sale_list = r => require.ensure([], () => r(require('@/components/refund/after_sale_list')), 'group-aftersale')
const can_return_list = r => require.ensure([], () => r(require('@/components/refund/can_return_list')), 'group-aftersale')
const pick_return_goods = r => require.ensure([], () => r(require('@/components/refund/pick_return_goods')), 'group-aftersale')
const fill_return_forms = r => require.ensure([], () => r(require('@/components/refund/fill_return_forms')), 'group-aftersale')
const reSubmited = r => require.ensure([], () => r(require('@/components/refund/after_sale_submited')), 'group-aftersale')
const after_sale_progress = r => require.ensure([], () => r(require('@/components/refund/after_sale_progress')), 'group-aftersale')
const after_sale_detail = r => require.ensure([], () => r(require('@/components/refund/after_sale_detail')), 'group-aftersale')
const refund_progress = r => require.ensure([], () => r(require('@/components/refund/refund_progress')), 'group-aftersale')
const Refund_logistics = r => require.ensure([], () => r(require('@/components/refund/logistics')), 'group-aftersale')

// my
const ChangeName = r => require.ensure([], () => r(require('@/components/set/change_name')), 'group-my')
const set = r => require.ensure([], () => r(require('@/components/set/set')), 'group-my')
const coupons = r => require.ensure([], () => r(require('@/components/set/coupons')), 'group-my')
const Use_coupons = r => require.ensure([], () => r(require('@/components/set/use_coupons')), 'group-my')
const coupons_award = r => require.ensure([], () => r(require('@/components/set/coupons_award')), 'group-my')
const coupons_success = r => require.ensure([], () => r(require('@/components/set/coupons_success')), 'group-my')
const vouchers = r => require.ensure([], () => r(require('@/components/set/vouchers')), 'group-my')
const use_vouchers = r => require.ensure([], () => r(require('@/components/set/use_vouchers')), 'group-my')
const logout = r => require.ensure([], () => r(require('@/components/set/logout')), 'group-my')
const Verify = r => require.ensure([], () => r(require('@/components/set/verify')), 'group-my') //设置密码

// address
const Address = r => require.ensure([], () => r(require('@/components/set/address')), 'group-address')
const address_edit = r => require.ensure([], () => r(require('@/components/set/address_edit')), 'group-address')

// help
const help = r => require.ensure([], () => r(require('@/components/set/help')), 'group-help')
const feedback = r => require.ensure([], () => r(require('@/components/set/feedback')), 'group-help')
const question_search = r => require.ensure([], () => r(require('@/components/set/question_search')), 'group-help')

// msg
const msg = r => require.ensure([], () => r(require('@/components/set/msg')), 'group-msg')
const msg_list = r => require.ensure([], () => r(require('@/components/set/msg_list')), 'group-msg')

export default [{
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    component: home,
    name: 'home',
    meta: {
      keepAlive: true, //保活
      title: '首页'
    }
  },
  {
    path: '/entry',
    component: login,
    name: 'entry',
    meta: {
      title: '登录'
    }
  },
  {
    path: '/recommend',
    redirect: '/home'
  },
  {
    path: '/coupons_award',
    component: coupons_award,
    name: 'coupons_award',
    meta: {
      requireAuth: true, //需要登录权限
      title: '领取购物币'
    }
  },
  {
    path: '/classify',
    component: classify,
    name: 'classify',
    meta: {
      keepAlive: true,
      title: '商品分类'
    }
  },
  {
    path: '/discovery',
    component: discovery,
    name: 'discovery',
    meta: {
      keepAlive: true,
      title: '发现'
    }
  },
  {
    path: '/topic_list',
    component: topic_list,
    name: 'topic_list',
    meta: {
      keepAlive: true,
      title: '话题列表'
    }
  },
  {
    path: '/topicdetail',
    component: topic_detail,
    name: 'topicDetail',
    meta: {
      keepAlive: true,
      title: '话题详情'
    }
  },
  {
    path: '/logistics',
    component: Refund_logistics,
    name: 'logistics',
    meta: {
      requireAuth: true,
      title: '填写退货物流信息'
    }
  },
  {
    path: '/advert_goods_list',
    component: advert_goods_list,
    name: 'advert_goods_list',
    meta: {
      keepAlive: true,
      title: '商品列表'
    },
  },
  {
    path: '/classified_goods',
    component: classified_goods,
    name: 'classified_goods',
    meta: {
      keepAlive: true,
      title: '商品'
    },
  },
  {
    path: '/classified_goods_list',
    component: classified_goods_list,
    name: 'classified_goods_list',
    meta: {
      keepAlive: true,
      title: '分类商品列表'
    },
  },
  {
    path: '/brand_goods_list',
    component: brand_goods_list,
    name: 'brand_goods_list',
    meta: {
      keepAlive: true,
      title: '品牌商品列表'
    }
  },
  {
    path: '/activity_list',
    component: activity_list,
    name: 'activity_list',
    meta: {
      keepAlive: true,
      title: '特卖商品'
    }
  },
  {
    path: '/detail',
    component: goods_detail,
    name: 'detail',
    meta: {
      title: '商品详情'
    }
  },
  {
    path: '/search',
    component: search,
    name: 'search',
    meta: {
      keepAlive: true,
      title: '搜索'
    }
  },
  {
    path: '/change_name',
    component: ChangeName,
    name: 'change_name',
    meta: {
      requireAuth: true,
      title: '修改昵称'
    }
  },
  {
    path: '/cart',
    component: Cart,
    name: 'cart',
    meta: {
      requireAuth: true,
      title: '购物车'
    }
  },
  {
    path: '/cart/order_detail',
    component: order_detail,
    name: 'order_detail',
    meta: {
      requireAuth: true,
      keepAlive: true,
      title: '订单详情'
    }
  },
  {
    path: '/cart/order_sure',
    component: order_confirm,
    name: 'order_sure',
    meta: {
      requireAuth: true,
      title: '确认订单'
    }
  },
  {
    path: '/success',
    component: pay_success,
    name: 'success',
    meta: {
      requireAuth: true,
      title: '支付成功'
    }
  },
  {
    path: '/message',
    component: msg,
    name: 'message',
    meta: {
      requireAuth: true,
      keepAlive: true,
      title: '消息中心'
    }
  },
  {
    path: '/msg_list',
    component: msg_list,
    name: 'msg_list',
    meta: {
      requireAuth: true,
      keepAlive: true,
      title: ''
    }
  },
  {
    path: '/set',
    component: set,
    name: 'set',
    meta: {
      requireAuth: true,
      title: '我的'
    },
    children: [{
        path: 'help',
        component: help,
        name: 'help',
        meta: {
          requireAuth: true,
          title: '客服与帮助'
        }
      },
      {
        path: 'feedback',
        component: feedback,
        name: 'feedback',
        meta: {
          requireAuth: true,
          title: '反馈与建议'
        }
      },
      {
        path: 'question_search',
        component: question_search,
        name: 'question_search',
        meta: {
          requireAuth: true,
          title: '搜索问题'
        }
      },
      {
        path: 'orders',
        component: orders,
        name: 'orders',
        meta: {
          requireAuth: true,
          keepAlive: true,
          title: '我的订单'
        }
      },
      {
        path: 'after',
        component: after_sale_list,
        name: 'after',
        meta: {
          requireAuth: true,
          keepAlive: true,
          title: '售后单'
        }
      },
      {
        path: 'relist',
        component: can_return_list,
        name: 'relist',
        meta: {
          requireAuth: true,
          title: '申请退货'
        }
      },
      {
        path: 'reGoods',
        component: fill_return_forms,
        name: 'reGoods',
        meta: {
          requireAuth: true,
          title: '填写售后单'
        }
      },
      {
        path: 'reSubmited',
        component: reSubmited,
        meta: {
          requireAuth: true,
          title: '售后申请成功'
        }
      },
      {
        path: 'rs',
        component: pick_return_goods,
        name: 'rs',
        meta: {
          requireAuth: true,
          title: '选择申请售后商品'
        }
      },
      {
        path: 'payPro',
        component: refund_progress,
        name: 'payPro',
        meta: {
          requireAuth: true,
          title: '退款进度'
        }
      },
      {
        path: 'rePro',
        component: after_sale_progress,
        name: 'rePro',
        meta: {
          requireAuth: true,
          keepAlive: true,
          title: '售后进度'
        }
      },
      {
        path: 'reDetail',
        component: after_sale_detail,
        name: 'reDetail',
        meta: {
          requireAuth: true,
          title: '售后详情'
        }
      },
      {
        path: 'coupons',
        component: coupons,
        name: 'coupons',
        meta: {
          requireAuth: true,
          title: '购物币'
        }
      },
      {
        path: 'use_coupons',
        component: Use_coupons,
        name: 'Use_coupons',
        meta: {
          requireAuth: true,
          title: '使用购物币'
        }
      },
      {
        path: 'coupons_success',
        component: coupons_success,
        name: 'coupons_success',
        meta: {
          requireAuth: true,
          title: '领取成功'
        }
      },
      {
        path: 'vouchers',
        component: vouchers,
        name: 'vouchers',
        meta: {
          requireAuth: true,
          title: '优惠券'
        }
      },
      {
        path: 'use_vouchers',
        component: use_vouchers,
        name: 'use_vouchers',
        meta: {
          requireAuth: true,
          title: '使用优惠券'
        }
      },
      {
        path: 'logout',
        component: logout,
        name: 'logout',
        meta: {
          title: '退出登录'
        }
      },
      {
        path: 'address',
        component: Address,
        name: 'address',
        meta: {
          requireAuth: true,
          title: '管理收货地址'
        }
      },
      {
        path: 'addressedit',
        component: address_edit,
        name: 'addressedit',
        meta: {
          requireAuth: true,
          title: '收货地址编辑'
        }
      },
      {
        path: 'verify',
        component: Verify,
        name: 'verify',
        meta: {
          requireAuth: true,
          title: '验证身份'
        }
      }
    ]
  },
  {
    path: '/logistics_list',
    component: logistics_list,
    name: 'logistics_list',
    meta: {
      requireAuth: true,
      title: '查看物流'
    }
  },
  {
    path: '/logistics_detail',
    component: logistics_detail,
    name: 'logistics_detail',
    meta: {
      requireAuth: true,
      title: '物流详情'
    }
  }
]
