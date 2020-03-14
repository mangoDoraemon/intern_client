<template>
  <div class="app">
    <el-container>
      <el-aside class="app-side app-side-left"
                :class="isCollapse ? 'app-side-collapsed' : 'app-side-expanded'">
        <div v-show="!isCollapse" class="app-side-logo">
          <img src="@/assets/title-log3.png"
               :width="isCollapse ? '200' : '200'"
               height="60" />
        </div>

        <div>
          <!-- 我是样例菜单 -->
          <el-menu default-active="1-4-1"
                   class="el-menu-vertical-demo"
                   router
                   @open="handleOpen"
                   @select="handleSelect"
                   :collapse="isCollapse">

            <el-menu-item index="/index">
              <i class="el-icon-document"></i>
              <span slot="title">首页</span>
            </el-menu-item>
            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span slot="title">常规菜单</span>
              </template>
              <el-menu-item-group>
                <span slot="title">指导记录</span>
                <el-menu-item index="/mineInfo">指导记录增加</el-menu-item>
                <el-menu-item index="1-2">指导记录管理</el-menu-item>
              </el-menu-item-group>
              <el-menu-item-group title="周计划管理">
                <el-menu-item index="1-3">周记批改</el-menu-item>
                <el-menu-item index="1-9">周次计划</el-menu-item>
              </el-menu-item-group>
              <el-submenu index="1-4">
                <span slot="title">毕业设计信息</span>
                <el-menu-item index="1-4-1">毕业设计任务书管理</el-menu-item>
              </el-submenu>
            </el-submenu>
            <el-menu-item index="/studentInfo">
              <i class="el-icon-menu"></i>
              <span slot="title">学生管理</span>
            </el-menu-item>

            <el-menu-item index="/teacherInfo">
              <i class="el-icon-menu"></i>
              <span slot="title">教师管理</span>
            </el-menu-item>

            <el-menu-item index="/studentInfo">
              <i class="el-icon-menu"></i>
              <span slot="title">企业管理</span>
            </el-menu-item>

            <el-menu-item index="/notice">
              <i class="el-icon-menu"></i>
              <span slot="title">公告管理</span>
            </el-menu-item>
            <el-menu-item index="/userManagement">
              <i class="el-icon-menu"></i>
              <span slot="title">学生通讯录</span>
            </el-menu-item>

            <el-menu-item index="/userManagement">
              <i class="el-icon-menu"></i>
              <span slot="title">老师通讯录</span>
            </el-menu-item>




<!--            <el-menu-item index="4">-->
<!--              <i class="el-icon-setting"></i>-->
<!--              <span slot="title">导航四</span>-->
<!--            </el-menu-item>-->
          </el-menu>
        </div>

      </el-aside>

      <el-container>
        <el-header class="app-header">
          <div style="width: 60px; cursor: pointer;"
               @click.prevent="toggleSideBar">
            <i v-show="!isCollapse" class="el-icon-d-arrow-left"></i>
            <i v-show="isCollapse" class="el-icon-d-arrow-right"></i>
          </div>
          <!-- 我是样例菜单 -->
          <el-menu default-active="1"
                   class="el-menu-demo tab-page"
                   mode="horizontal"
                   router
                   @select="handleSelect"
                   active-text-color="#409EFF">
            <el-menu-item index="1">处理中心</el-menu-item>
            <el-submenu index="个人中心">
              <template slot="title">个人中心</template>
              <el-menu-item index="/mineInfo">我的信息</el-menu-item>
              <el-menu-item index="/modifyPassword">修改密码</el-menu-item>

            </el-submenu>
            <el-menu-item index="/showNoticeInfo">公告信息</el-menu-item>
          </el-menu>

          <div class="app-header-userinfo">
            <el-dropdown trigger="hover"
                         :hide-on-click="false">
              <div class="block"><el-avatar :size="50" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar></div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>我的消息</el-dropdown-item>
                <el-dropdown-item>设置</el-dropdown-item>
                <el-dropdown-item divided
                                  @click.native="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>


        </el-header>

        <el-main class="app-body">
            <div style="margin-left: 20px;margin-bottom: 5px;margin-top: 10px">
              <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item v-for="item in list" :key="item">{{ item }}</el-breadcrumb-item>
              </el-breadcrumb>
              <el-divider content-position="left"></el-divider>
            </div>


          <template>
          <router-view/>
          </template>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
  import '@/styles/index.scss'
  export default {
    name: 'Container',
    data() {
      return {
        username: '',
        isCollapse: false,
        show:false,
        activeIndex: '1',
        list:[],
      }
    },
    methods: {
      toggleSideBar() {
        this.isCollapse = !this.isCollapse
      },
      logout: function () {
        this.$confirm('确认退出?', '提示', {})
                .then(() => {
                  sessionStorage.removeItem('user');
                  this.$store.dispatch('user/resetToken');
                  this.$router.push('/login');
                })
                .catch(() => { });
      },
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        this.activeIndex=key;
        this.list=keyPath

      },
      handleSelect(key, keyPath) {
        this.activeIndex=key;
        for (let i=0;i<keyPath.length;i++){
          if(keyPath[i]==='/mineInfo'){
            keyPath[i]='我的信息';
          }
          if(keyPath[i]==='/showNoticeInfo'){
            keyPath[i]='公告信息';
          }
          if(keyPath[i]==='/modifyPassword'){
            keyPath[i]='修改密码';
          }
          if(keyPath[i]==='/teacherInfo'){
            keyPath[i]='教师管理';
          }
          if(keyPath[i]==='/studentInfo'){
            keyPath[i]='学生管理';
          }
          if(keyPath[i]==='/notice'){
            keyPath[i]='公告管理';
          }
          if(keyPath[i]==='/index'){
            keyPath[i]=''
          }


        }
        this.list=keyPath
        console.log(key)
        console.log(keyPath)
      },
    },

  }
</script>

<style>
</style>