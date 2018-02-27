var fn;
var m = 20

function foo() {
  var a = 2;

  function baz(a) {
    console.log(a);
  }
  fn = baz;
}

function bar() {
  fn(m);
}

foo();
bar();