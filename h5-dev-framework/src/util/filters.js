import Vue from 'vue'
//日期格式化
Vue.filter('dateFormat', function(num, str) {
  return new Date(num).formatDate(str)
})
// 点赞转发
Vue.filter('countFormat', function(value) {
  let num = parseInt(value)
  if (num < 10000) {
    return num
  } else if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  }
})
//double num
Vue.filter('numDouble', function(value) {
  let num = parseInt(value)
  return num < 10 ? '0' + value : value
})

Vue.filter('priceFormat', function(value, str) {
  if (value) {
    let arr = value.split('.')
    if (str == '整数') {
      return arr[0]
    } else {
      return '.' + arr[1]
    }
  }
})
