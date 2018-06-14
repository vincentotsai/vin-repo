
let log = console.log.bind(console)
let vm = new Vue({
  data: {a:1},
  methods: {
    adda: function() {
      this.a ++
      
    }
  }
})
vm.adda()
setTimeout(function() {
  vm.adda()
  log(vm.a)
}, 2000);
log('vm.a->>',vm.a)


// vue源码解析
const Sub = Vue.extend({
  name: 'a',
  components: {
    'p': 'hi'
  }

})
console.log(Sub.super === Vue) // true

const s = new Sub()
console.log(s.constructor === Sub) // true
console.log(s.constructor.options)