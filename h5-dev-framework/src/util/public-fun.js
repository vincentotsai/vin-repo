/**
 * 检测是否在微信打开
 */
function is_weixin() {
  return /MicroMessenger/i.test(navigator.userAgent)
}

function getUrlKey(name) {
  return (
    decodeURIComponent(
      (new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(
        location.href
      ) || [, ''])[1].replace(/\+/g, '%20')
    ) || ''
  )
}

function funcUrlDel(name) {
  var loca = window.location
  var baseUrl = loca.origin + loca.pathname + '?'
  var query = loca.search.substr(1)
  if (query.indexOf(name) > -1) {
    var obj = {}
    var arr = query.split('&')
    for (var i = 0; i < arr.length; i++) {
      arr[i] = arr[i].split('=')
      obj[arr[i][0]] = arr[i][1]
    }
    delete obj[name]
    var url =
      baseUrl +
      JSON.stringify(obj)
        .replace(/[\"\{\}]/g, '')
        .replace(/\:/g, '=')
        .replace(/\,/g, '&')
    return url
  }
}


function filterEmoji(id) {
  var ranges = [
    '\ud83c[\udf00-\udfff]',
    '\ud83d[\udc00-\ude4f]',
    '\ud83d[\ude80-\udeff]'
  ]
  var obj = document.getElementById('' + id)
  obj.addEventListener('input', function() {
    var str = obj[0].value
    obj[0].value = str.replace(new RegExp(ranges.join('|'), 'g'), '')
  })
}

function toJSON(str) {
  if (typeof str == 'string') {
    let result = [
      {
        type: 0,
        content: str
      }
    ]
    try {
      let temp = JSON.parse(str)
      if (temp && typeof temp === 'object' && temp.length > 0) {
        return temp
      } else {
        return result
      }
    } catch (e) {
      return result
    }
  }
}

function orderShow(str) {
  var showStr = ''
  if (str) {
    var num = str * 1
    if (num < 1000) {
      showStr = showStr + num
    } else if (num < 10000) {
      showStr = showStr + (num / 1000).toFixed(1) + 'K'
    } else if (num < 100000) {
      showStr = showStr + (num / 10000).toFixed(1) + 'W'
    } else {
      showStr = showStr + 10 + 'W+'
    }
    return showStr
  }
  return showStr
}

export { is_weixin, getUrlKey, getSharAPPData, toJSON, funcUrlDel, orderShow }
