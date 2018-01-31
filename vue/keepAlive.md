```javaScript
routes: [{
        path: '/',
        name: 'index',
        component: index,
        meta: {
            keepAlive: false, //此组件不需要被缓存
        }
    },
    {
        path: '/page1',
        name: 'page1',
        component: page1,
        meta: {
            keepAlive: true, //此组件需要被缓存
            
        }
    },
    {
        path: '/page2',
        name: 'page2',
        component: page2,
        meta: {
            keepAlive: true, // 此组件需要被缓存
           
        }
    },
    {
        path: '/page3',
        name: 'page3',
        component: page3,
        meta: {
            keepAlive: false, // 此组件不需要被缓存
        }
    }
]
```


钩子函数的执行顺序

不使用keep-alive
beforeRouteEnter --> created --> mounted --> destroyed

使用keep-alive
首次进入：beforeRouteEnter --> created --> mounted --> activated --> deactivated
再次进入缓存的页面，只会触发beforeRouteEnter -->activated --> deactivated ，created和mounted不会再执行。我们可以利用不同的钩子函数，做不同的事。