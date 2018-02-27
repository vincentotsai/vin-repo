
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