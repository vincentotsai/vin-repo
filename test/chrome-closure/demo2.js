function a() {
  let v1 = 1
  return function b() {
    console.log(v1)
    let v2 = 2
    return function c() {
      console.log(v2)
    }
  }
}

let f1 = a()
let f2 = f1()
f2()