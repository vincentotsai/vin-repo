module.exports = {
  $router: 'user',
  "/common/userinfo/get": {
    "avatar_address": "@image()",
    "nick_name": "@cname()",
    "course_num|0-10000": 0,
    "subscribe|0-1": 0
  },
  "/common/myCourseList/get": {
    "course_info_list|0-20": [{
      "course_id|+1": 0,
      "course_title": "@cword(10, 30)",
      "lecturer_name": "@cword(3, 10)",
      "lecturer_title": "@cword(3, 10)",
      "course_type|0-1": 0,
      "course_url": "@image('720x300')",
      "sale_num": "@integer(0, 1000)",
      "course_price": "@float(0, 10000, 0, 2)",
      "distributer_income": "@float(0, 10000, 0, 2)",
      "share_url": "@url()",
      "lecturer_avatar_address": "@image()",
      "position|0-10": 0,
      "course_duration": "@integer(0, 10000)",
      "is_column|0-1": 0,
      "is_series|0-1": 0,
      "is_bought|0-1": 0,
      "charge_type|0-1": 0,
      "is_join_course|0-1": 0,
      "count|0-1000": 0
    }]
  },
  "/common/myCostList": {
    "cost_info_list|0-20": [{
      "payment|0-1000": 0,
      "create_time": "@datetime('T')",
      "consumer_behavior": "@cword(0, 50)",
      "payment_type": 0,
      "shop_name": "@cword(0, 20)",
      "position|+1": 0
    }]
  },
  "/common/feedback": {},
  "/common/lecturer/:id/info": {
    "lecturer_info": {
      "lecturer_id|+1": 0,
      "avatar_address": "@image()",
      "lecturer_title": "@cword(3, 30)",
      "lecturer_name": "@cword(3, 30)",
      "sale_num_total|0-10000": 0,
      "lecturer_remark": "@cword(10, 300)",
      "series_num|0-20": 0,
      "course_num|0-50": 0
    }
  },
  "/common/payment/weixin/bill": {
    "appId|+1": 0,     //公众号名称，由商户传入
    "timeStamp": "@datetime('T')",         //时间戳，自1970年以来的秒数
    "nonceStr": "@word(15, 20)", //随机串
    "package": "prepay_id=123",
    "signType": 0,         //微信签名方式：
    "paySign": "@word(15, 20)" //微信签名
  }
}
