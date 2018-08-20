import Vue from 'vue'
var defaultRectPic = 'https://img.baidu.cn/user_bg_pro_result_2.png';
var defaultAvatar = 'https://img.baidu.cn/h5_icon_avtor_moren.png'
//设置商品默认图
Vue.prototype.setErrorImg = function (e, w, h) {
  e.srcElement.src = defaultRectPic + this.imageSize(w, h)
}

// 设置默认头像
Vue.prototype.setErrorImgTouxiang = function (e, w, h) {
  e.srcElement.src = defaultAvatar + this.imageSize(w, h)
}

/**
 * 懒加载默认图片
 * @param {*} type
 */
Vue.prototype.defaultLazyImg = function (e, w, h) {
  if (w && h) {
    return (
      'https://img.baidu.cn/user_bg_pro_result_2.png' +
      this.imageSize(w, h)
    )
  } else {
    return 'https://img.baidu.cn/user_bg_pro_result_2.png' + this.imageSize()
  }
}

//七牛图片裁剪
Vue.prototype.imageSize = function (w, h, d = 1) {
  if (w && h) {
    return '?imageView2/1/w/' + w * d + '/h/' + h * d
  } else {
    return '?imageslim'
  }
}
