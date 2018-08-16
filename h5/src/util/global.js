import Vue from 'vue'
import { updateLog } from './update-log'
Vue.prototype.userData = {}
Vue.prototype.provincesList = []
Vue.prototype.isola = process.env.BASE_URL != 'http://web.7mall.cn/'

function isStorageSupported() {
  let testKey = 'test',
    storage = window.localStorage
  try {
    storage.setItem(testKey, 'testValue')
    storage.removeItem(testKey)
    window.isStorageSupportedFlag = true
    return true
  } catch (error) {
    window.isStorageSupportedFlag = false
    return false
  }
}

// 兼容浏览器无痕模式
function safeGetAddressList() {
  let httpData = {
    params: { dataVersion: 0 }
  }
  Vue.http.get('uc/get_pca_address_list.do', httpData).then(data => {
    resetAddress(
      {
        cityList: data.body.provincesList
      },
      -1
    )
  })
}

//获取省市区列表
function getAddressList() {
  let _address = localStorage.pcaAddress || '{}'
  if (_address) {
    _address = JSON.parse(_address)
  }
  let httpData = {
    params: { dataVersion: _address.dataVersion || 0 }
  }
  // console.log('_address',_address);
  // console.log('httpData',httpData);
  Vue.http.get('uc/get_pca_address_list.do', httpData).then(data => {
    let list = {}
    if (
      httpData.params.dataVersion == data.body.dataVersion &&
      _address.provincesList
    ) {
      list = _address.provincesList
    } else {
      localStorage.pcaAddress = JSON.stringify(data.body)
      list = data.body.provincesList
    }
    resetAddress(
      {
        cityList: list
      },
      -1
    )
  })
}
//获取国际区号
Vue.prototype.getAreaList = function() {
  $.getJSON('https://img.suibianbuy.cn/arealist.json', result => {
    var list = result.AreaList
    var AreaList = []
    var obj = {
      index: '',
      list: []
    }
    for (let i = 0; i < list.length; i++) {
      var key = list[i].split('-')[0]
      var value = list[i].split('-')[1].split(',')[0]
      var codeObj = {
        desc: value.split('+')[0],
        code: '+' + value.split('+')[1]
      }
      if (obj.index != '' && obj.index != key) {
        AreaList.push(Object.assign({}, obj))
        obj.list = []
      }
      obj.index = key
      obj.list.push(codeObj)
      if (i == list.length - 1) {
        AreaList.push(Object.assign({}, obj))
      }
    }
    window.appVue.$root.$emit('AREA-LOADED', AreaList)
  })
}
function resetAddress(data, num) {
  if (num > 2) {
    return
  }
  num++
  for (let i = 0; i < data.cityList.length; i++) {
    let item = data.cityList[i]
    let address = {
      name: item.name,
      value: item.num,
      key: num
    }
    if (num == 0) {
      address.parent = 0
    } else {
      address.parent = data.num
    }
    Vue.prototype.provincesList.push(address)
    if (item.cityList) {
      resetAddress(item, num)
    } else if (item.areasList) {
      if (item.areasList.length == 0) {
        item.areasList = [
          {
            name: '',
            num: '-1'
          }
        ]
      }
      item.cityList = item.areasList
      resetAddress(item, num)
    }
  }
}

/**
 * 获取用户信息
 */
Vue.prototype.getUserData = function(cb) {
  if (!window.getCookie('token')) {
    updateLog({
      appClient: 'wap',
      clickType: '1', //1 店铺访客、2 搜索操作.....
      ownerId: window.getCookie('parentId') //	店主用户ID
    })
    return
  }
  Vue.http.get('uc/getting_user_information.do').then(res => {
    if (!res.body.photoPath) {
      res.body.photoPath =
        'http://img7mall.blessi.cn/user_icon_avator_result.png'
    }
    Vue.prototype.userData = res.body
    //推荐人id丢失使用自己id
    if (
      !window.getCookie('parentId') ||
      window.getCookie('parentId') == 'undefined'
    ) {
      window.setCookie('parentId', Vue.prototype.userData.userId)
    }
    if (cb) {
      cb(Vue.prototype.userData)
    }
    updateLog({
      appClient: 'wap',
      clickType: '1', //1 店铺访客、2 搜索操作.....
      ownerId: window.getCookie('parentId'), //	店主用户ID
      img: Vue.prototype.userData.photoPath || '', //用户头像地址
      userId: Vue.prototype.userData.userId, //用户id
      userName: Vue.prototype.userData.nickName
    })
  })
}
// Vue.prototype.getLoginCouponent = function(){
//   /**@augments
//    * 用户处于登录状态时，查询登录送券活动
//    * 如果用户没有走登录流程应该怎么处理？
//    */
//   Vue.http.get("order/login_gift.do").then(res => {
//   });
// }

//android不支持复制，判断设备是否是Android，用于隐藏复制按钮
function getDeviceType() {
  var u = navigator.userAgent.toLowerCase()
  if (u.indexOf('android') > -1 || u.indexOf('linux') > -1) {
    Vue.prototype.isAndroid = true
  } else {
    // Vue.prototype.isIphone = true
    Vue.prototype.isAndroid = false
  }
}

/**
 * 系统时间
 */
let dt = 0

function getSysTime() {
  Vue.http.get('common/get_server_timestamp.do').then(res => {
    Vue.prototype.sysTime = res.body.serverTimestamp
  })
}
setInterval(() => {
  Vue.prototype.sysTime += 1000
  if (dt++ >= 300) {
    getSysTime()
    dt = 0
  }
}, 1000)

getDeviceType()

if (window.isStorageSupportedFlag) {
  getAddressList()
} else {
  safeGetAddressList()
}

getSysTime()
Vue.prototype.getUserData()
Vue.prototype.getLotteryTime()
