// demo3
function foo() {
  var a = 10;

  // 注释掉fn1后foo就不再是闭包了。
  // function fn1() {
  //   return a;
  // }
  

  function fn2() {
    return 10;
  }

  fn2();
}

foo();