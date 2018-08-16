import Vue from 'vue'

function qiniuToken(cb) {
  Vue.http.get('common/get_qiniu_token.do').then(data => {
    cb(data.body)
  })
}
/**
 * @param {*} f  文件数组
 * @param {*} token  token
 * @param {*} key  用来设置上传文件名称，不传会用图片md5
 * @param {*} cb 回调
 */
function imgUpdate(f, token, key, cb) {
  let _arr = []
  for (let i = 0; i < f.length; i++) {
    update(f[i], token, key, function(res) {
      _arr.push(res)
      if (_arr.length == f.length) {
        cb(_arr)
      }
    })
  }
}

function update(f, token, key, cb) {
  console.log(f)
  var Qiniu_UploadUrl = 'https://upload-z2.qiniup.com'
  var xhr = new XMLHttpRequest()
  xhr.open('POST', Qiniu_UploadUrl, true)
  var formData, startDate
  formData = new FormData()
  if (key !== null && key !== undefined && key !== '') {
    formData.append('key', key)
  }
  formData.append('token', token)
  formData.append('file', f)
  var taking
  xhr.onreadystatechange = function(response) {
    console.log(xhr)
    if (xhr.readyState == 4 && xhr.status == 200 && xhr.responseText != '') {
      var blkRet = JSON.parse(xhr.responseText)
      if (cb) {
        cb(blkRet)
      }
    }
  }
  xhr.send(formData)
}

export { qiniuToken, imgUpdate }
