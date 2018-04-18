<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
  <style>
    .main {
      width: 530px;
    }

    .left,
    .right {
      width: 40%;
      height: 12ex;
      background-color: lightgray;
    }

    .left {
      -webkit-shape-outside: polygon(0 0, 100% 100%, 0 100%);
      shape-outside: polygon(0 0, 100% 100%, 0 100%);
      float: left;
      -webkit-clip-path: polygon(0 0, 100% 100%, 0 100%);
      clip-path: polygon(0 0, 100% 100%, 0 100%);
    }

    .right {
      -webkit-shape-outside: polygon(100% 0, 100% 100%, 0 100%);
      shape-outside: polygon(100% 0, 100% 100%, 0 100%);
      float: right;
      -webkit-clip-path: polygon(100% 0, 100% 100%, 0 100%);
      clip-path: polygon(100% 0, 100% 100%, 0 100%);
    }

    p {
      text-align: center;
    }
  </style>
</head>

<body>
  <div class="main">
    <div class="left"></div>
    <div class="right"></div>
    <p>
      Sometimes a web page's text content appears to be funneling your attention towards a spot on the page to drive you to follow
      a particular link. Sometimes you don't notice.
    </p>
  </div>
</body>

</html>
