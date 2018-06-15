
const obj = {
  name: 'tik'
}

const handler = {
  get: function(target, prop) {
    if (prop === 'name') {
      return 'tok'
    }
  }
}

let p = new Proxy(obj, handler)
console.log(p.name)
