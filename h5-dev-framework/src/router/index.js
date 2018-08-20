const home = r => require.ensure([], () => r(require('@/components/home/home')), 'group-home')

const routes = [
    {
      path: '/',
      redirect: '/my'
    },
    {
      path: '/my',
      name: '我的',
      component: home
    }
  ]


export default routes

