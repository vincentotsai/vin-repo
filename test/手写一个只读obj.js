let obj = {}

let myObj = {
  data: 1
}

obj.set = function() {
  console.log('obj只读...')
  return ;
}

Object.defineProperty(myObj, 'data', obj)
