function Foo() {
  this.a = 1
  this.b = 'tot'
  const vm = this
  console.log(this)
  console.log(this.a)
}
Foo()
Foo.a = 
console.log(a)
const bar = new Foo()
// bar.a = 2
console.log(bar.a)