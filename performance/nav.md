Navigation Timing API能够帮助网站开发者检测真实用户数据（RUM），例如带宽、延迟或主页的整体页面加载时间。用法如下：

> let timing = performance.timing

我们需要获取到的页面性能参数包括：
> DNS查询耗时、
> TCP链接耗时、
> request请求耗时、
> 解析dom树耗时、白屏时间、
> domready时间、onload时间等，
而这些参数是通过 let timing = performance.timing 各个属性的差值组成的，计算方法如下：

DNS查询耗时 ：domainLookupEnd - domainLookupStart
TCP链接耗时 ：connectEnd - connectStart
request请求耗时 ：responseEnd - responseStart
解析dom树耗时 ： domComplete - domInteractive
白屏时间 ：responseStart - navigationStart
domready时间 ：domContentLoadedEventEnd - navigationStart
onload时间 ：loadEventEnd - navigationStart

Navigation Timing的目的是用于分析页面整体性能指标。如果要获取个别资源（例如JS、图片）的性能指标，就需要使用Resource Timing API。用法如下：

> var resourcesObj = performance.getEntries()

我们可以根据数组的长度获取到页面中静态资源的数量，然后通过数组的每一项分析单个静态资源的请求状态。

performance中还有一些性能API尚未成为W3C标准（如第一张图中的工作进度），有的处于编辑草案阶段，有的处于工作草案阶段，当这些API逐渐成为推荐标准以后，一定会对我们进行前端性能监控带来很大的便利，我们也可以通过这些API很方便地直接从页面中获取到我们希望得到的性能信息。