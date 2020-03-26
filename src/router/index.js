import Vue from 'vue'
import Router from 'vue-router'
const routerPush = Router.prototype.push
//解决当请求相同路由出错的问题改变push请求
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error=> error)
}
import Index from '@/components/index/index'
import MineInfo from "@/components/mine/mineInfo";
import UserManagement from "@/views/admin/components/userManagement"
import ModifyPassword from "@/components/mine/modifyPassword"
//import MessageInfo from "@/components/mine/messageInfo"
import Notice from "@/components/notice/notice"
import StudentInfo from "@/components/student/studentInfo"
import ShowNoticeInfo from "@/components/notice/showNoticeInfo"
import TeacherInfo from "@/components/teacher/teacherInfo"
import AdminUser from "@/components/admin/adminUser"
import SysDict from "@/components/common/sysDict"
import CompanyInfo from "@/components/company/companyInfo"
import AddInternShip from "@/components/internShip/addInternShip"
import InternShipInfo from "@/components/internShip/internShipInfo"
import InternshipReport from "@/components/internShip/internshipReport"
import AddReport from "@/components/internShip/addReport"
import NoticeDetail from "@/components/notice/noticeDetail"
import DealInfo from "@/components/common/dealInfo"
import TeacherContact from "@/components/common/teacherContact"
import StudentContact from "@/components/common/studentContact"
import GuidInfo from "@/components/common/guidInfo"
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
      name: 'home',
      component: () => import('@/views/home'),
      children: [{
        path: '/index',
        component: Index,
        name: '首页',
        hidden: true
      },]
    },
    {
      path:'/home',
      name: '个人中心',
      component: () => import('@/views/home'),
      children: [{
        path: '/mineInfo',
        component: MineInfo,
        name: '我的信息',
        hidden: true
      },
        {
          path: '/modifyPassword',
          component: ModifyPassword,
          name: '修改密码',
          hidden: true
        }
      ]
    },
    {
      path:'/home',
      name: '用户管理',
      component: () => import('@/views/home'),
      children: [{
        path: '/userManagement',
        component: UserManagement,
        name: '用户管理',
        hidden: true
      },]
    },
    {
      path:'/home',
      name: '处理中心',
      component: () => import('@/views/home'),
      children: [{
        path: '/dealInfo',
        component: DealInfo,
        name: '处理中心',
        hidden: true
      },]
    },
    {
      path:'/home',
      name: '指导记录管理',
      component: () => import('@/views/home'),
      children: [{
        path: '/guidInfo',
        component: GuidInfo,
        name: '指导记录管理',
        hidden: true
      },]
    },
    {
      path:'/home',
      name: '学生通讯录',
      component: () => import('@/views/home'),
      children: [{
        path: '/studentContact',
        component: StudentContact,
        name: '用户管理',
        hidden: true
      },]
    },
    {
      path:'/home',
      name: '教师通讯录',
      component: () => import('@/views/home'),
      children: [{
        path: '/teacherContact',
        component: TeacherContact,
        name: '用户管理',
        hidden: true
      },]
    },
    {
      path:'/home',
      name: '公告信息',
      component: () => import('@/views/home'),
      children: [{
        path: '/showNoticeInfo',
        component: ShowNoticeInfo,
        name: '公告信息',
        hidden: true
      },]
    },
    {
      path:'/home',
      name: '实习信息管理',
      component: () => import('@/views/home'),
      children: [{
        path: '/internShipInfo',
        component: InternShipInfo,
        name: '实习信息管理',
        hidden: true
      },]
    },


    {
      path:'/home',
      name: '实习信息添加',
      component: () => import('@/views/home'),
      children: [{
        path: '/addInternShip',
        component: AddInternShip,
        name: '实习信息管理',
        hidden: true
      },]
    },

      {
          path:'/home',
          name: '实习报告管理',
          component: () => import('@/views/home'),
          children: [{
              path: '/internshipReport',
              component: InternshipReport,
              name: '实习报告管理',
              hidden: true
          },]
      },
      {
          path:'/home',
          name: '实习报告填写',
          component: () => import('@/views/home'),
          children: [{
              path: '/addReport',
              component: AddReport,
              name: '实习报告填写',
              hidden: true
          },]
      },
    {
      path:'/home',
      name: '字典管理',
      component: () => import('@/views/home'),
      children: [{
        path: '/sysDict',
        component: SysDict,
        name: '字典管理',
        hidden: true
      },]
    },
    {
      path:'/home',
      name: '公告管理',
      component: () => import('@/views/home'),
      children: [{
        path: '/notice',
        component: Notice,
        name: '公告管理',
        hidden: true
      },]
    },
    {
      path:'/home',
      name: '公告详情',
      component: () => import('@/views/home'),
      children: [{
        path: '/noticeDetail',
        component: NoticeDetail,
        name: '公告详情',
        hidden: true
      },]
    },
    {
      path:'/home',
      name: '学生管理',
      component: () => import('@/views/home'),
      children: [{
        path: '/studentInfo',
        component: StudentInfo,
        name: '学生管理',
        hidden: true
      },]
    },
    {
      path:'/home',
      name: '用户管理',
      component: () => import('@/views/home'),
      children: [{
        path: '/adminUser',
        component: AdminUser,
        name: '用户管理',
        hidden: true
      },]
    },
    {
      path:'/home',
      name: '教师管理',
      component: () => import('@/views/home'),
      children: [{
        path: '/teacherInfo',
        component: TeacherInfo,
        name: '教师管理',
        hidden: true
      },]
    },

    {
      path:'/home',
      name: '企业管理',
      component: () => import('@/views/home'),
      children: [{
        path: '/companyInfo',
        component: CompanyInfo,
        name: '企业管理',
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
