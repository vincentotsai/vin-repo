**查阅资料得知，自npm 5.0版本发布以来，npm i的规则发生了三次变化。**

1、npm 5.0.x 版本，不管package.json怎么变，npm i 时都会根据lock文件下载

2、5.1.0版本后 npm install 会无视lock文件 去下载最新的npm 

3、5.4.2版本后  如果改了package.json，且package.json和lock文件不同，那么执行`npm i`时npm会根据package中的版本号以及语义含义去下载最新的包，并更新至lock。如果两者是同一状态，那么执行`npm i `都会根据lock下载，不会理会package实际包的版本是否有新。

