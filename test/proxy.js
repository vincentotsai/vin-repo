const obj = {
  name: 'tik'
}

const handler1 = {
  get: function(target, key) {
    if (key === 'name') {
      return 'tok'
    }
  }
}

let p = new Proxy(obj, handler1)
console.log(p.name)

class Shape {
  constructor(width, height) {
    this._width = width
    this._height = height
  }
  get area() {
    return this._width * this._height
  }
}
const handler = {
  get: function(target, key) {
    if (key[0] === '_') {
      throw new Error('Attempt to access private property')
    }
    return target[key]
  },
  set: function(target, key, value) {
    if (key[0] === '_') {
      throw new Error('Attempt to access private property')
    }
    target[key] = value
  }
}
const square = new Proxy(new Shape(10, 10), handler)
console.log(square.area) // 100
console.log(square instanceof Shape) // true
square._width = 200 // Error: Attempt to access private property
