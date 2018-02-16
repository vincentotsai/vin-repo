import Vue from 'vue'
import App from './App'

window.audio = new Audio()
window.audio.preload = 'metadata'
Vue.mixin({
  created: function() {
    var myOpt = this.$options.myOpt
    if (myOpt) {
      console.log('myOpt->',myOpt)
    }
  }
})

new Vue({
  el: '#app',
  myOpt: 'totsai..',
  render: h => h(App)
})
