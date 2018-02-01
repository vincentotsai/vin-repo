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