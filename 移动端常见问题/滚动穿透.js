// 滚动穿透终极解决方案（用时需调整）
var ModalHelper = (function(bodyCls) {
  var scrollTop // 在闭包中定义一个用来保存滚动位置的变量
  return {
    afterOpen: function() {
      //弹出之后记录保存滚动位置，并且给body添加.modal-open
      scrollTop = document.scrollingElement.scrollTop
      document.body.classList.add(bodyCls)
      document.body.style.top = -scrollTop + 'px'
    },
    beforeClose: function() {
      //关闭时将.modal-open移除并还原之前保存滚动位置
      document.body.classList.remove(bodyCls)
      document.scrollingElement.scrollTop = scrollTop
    }
  }
})('modal-open')
