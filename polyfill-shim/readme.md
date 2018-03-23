polyfill 是 shim 的一种。shim 是将不同 api 封装成一种，比如 jQuery 的 $.ajax 封装了 XMLHttpRequest 和 IE 用 ActiveXObject 方式创建 xhr 对象；polyfill 特指 shim 成的 api 是遵循标准的，其典型做法是在IE浏览器中增加 window.XMLHttpRequest ，内部实现使用 ActiveXObject。在实际中为了方便做对比，会特指 shim 的 api 不是遵循标准的，而是自己设计的。


shim 是硬垫片，polyfill 是软垫片。
硬垫片可能被感觉到，软垫片基本感觉不到。