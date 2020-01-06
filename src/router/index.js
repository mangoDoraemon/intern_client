import Vue from 'vue'
import Router from 'vue-router'
const routerPush = Router.prototype.push
//解决当请求相同路由出错的问题改变push请求
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error=> error)
}
import Index from '@/components/index/index'
import {getToken,removeToken} from "@/utils/auth";
Vue.use(Router)

let router =  new Router({
  routes: [
    {
      path:'/',
      name :'login',
      component: () => import('@/views/Login'),
    },
    {
      path:'/login',
      name :'login',
      component: () => import('@/views/Login'),
    },
    {
      path:'/home',
      name: '员工管理',
      component: () => import('@/views/home'),
      children: [{
        path: '/index',
        component: Index,
        name: '首页',
        hidden: true
      },]
    },
  ],
})

router.beforeEach(async(to,from,next)=>{

    const hasToken = getToken()
  if(to.path.startsWith('/login')){
    removeToken();
    next();
  }else{
    if(!hasToken){
      //未登录  跳回主页面
      next({path:'/login'});
    }else{
      next();
    }
  }

});


export default router
