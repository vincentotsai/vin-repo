# route方案
## define keepAlive
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


## 钩子函数的执行顺序

不使用keep-alive
beforeRouteEnter --> created --> mounted --> destroyed

使用keep-alive
首次进入：beforeRouteEnter --> created --> mounted --> activated --> deactivated
再次进入缓存的页面，只会触发beforeRouteEnter -->activated --> deactivated ，created和mounted不会再执行。我们可以利用不同的钩子函数，做不同的事。


## 在router/index.js的meta中添加isBack变量，默认false
```javaScript
{
          path: '/page1',
          name: 'page1',
          component: page1,
          meta: {
              keepAlive: true, //此组件需要被缓存
              isBack:false, //用于判断上一个页面是哪个
          }
      },
      {
          path: '/page2',
          name: 'page2',
          component: page2,
          meta: {
              keepAlive: true, // 此组件需要被缓存
              isBack:false, //用于判断上一个页面是哪个
          }
      },
```

# keepalive 动态设置include方案


# 终结方案
1. 在路由处将需要keepalive的组件都打上meta.keepAlive=true.
2. 在app.vue处设置如下：
```html
<keep-alive :max="5">
    <router-view v-if="$route.meta.keepAlive" :key="key" class="view-content"></router-view>
</keep-alive>
<router-view v-if="!$route.meta.keepAlive" :key="key" class="view-content"></router-view>
```
```javaScript
computed: {
    key() {
      return this.$route.fullPath
    }
}
```
3. ok.