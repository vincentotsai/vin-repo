function getEl(el) {
  return document.querySelector(el)
}

function creatDiv() {
  var div = document.createElement('div')
  div.className = 'upload_item'
  return div
}

function creatImg(src) {
  var img = document.createElement('img')
  img.src = src
  return img
}

function hideEl(el) {
  getEl('#uploads').style.display = 'none'
}

function local_reader(_this, imgs, max, max_array) {
  var reader = new FileReader()
  var result = imgs
  var file = _this.files[0]
  reader.readAsDataURL(file)
  var count = 0
  reader.onprogress = function() {
    count++
  }

  reader.onload = function(e) {
    var img = creatImg(this.result)
    var div = creatDiv()
    div.appendChild(img)
    if (max_array.length + 1 === max) {
      result.appendChild(div)
      max_array.push(div)
      hideEl()
    } else {
      result.appendChild(div)
      max_array.push(div)
    }
  }
}

function res_net(imgs) {
  var result = imgs
  if (send_img()) {
    var img = creatImg()
    var div = creatDiv()
    div.appendChild(img)
    result.appendChild(div)
  } else {
    console.log('progress...')
  }
}

function send_img() {
  setTimeout(function() {
    return '1.jpg'
  }, 1000)
}

function Upload(option) {
  var opt = option || {}
  var el = getEl(opt.input)
  var imgs = getEl(opt.imgs)
  var max = parseInt(opt.maxnum)
  var isreader = opt.isreader
  var max_array = []

  el.addEventListener('change', function(event) {
    var that = this
    if (isreader) {
      local_reader(that, imgs, max, max_array)
    } else {
      res_net(imgs)
    }
  })
}
