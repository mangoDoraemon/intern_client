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
            <el-submenu index="1"  v-if="this.$store.getters.roleName==='teacher' || this.$store.getters.roleName==='user'">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span slot="title">常规菜单</span>
              </template>
              <el-menu-item-group v-if="this.$store.getters.roleName==='teacher'">
                <span slot="title">指导记录</span>
                <el-menu-item index="/guidInfo">指导记录管理</el-menu-item>
              </el-menu-item-group>

                <el-menu-item-group  v-if="this.$store.getters.roleName==='teacher' || this.$store.getters.roleName==='user'">
                    <span slot="title" >实习报告</span>
                    <el-menu-item index="/internshipReport" v-if="this.$store.getters.roleName==='teacher' || this.$store.getters.roleName==='user'">实习报告管理</el-menu-item>
                    <el-menu-item index="/addReport" v-if="this.$store.getters.roleName==='user'" >实习报告填写</el-menu-item>
                </el-menu-item-group>
              <el-submenu index="实习信息" v-if="this.$store.getters.roleName==='teacher' || this.$store.getters.roleName==='user'">
                <span slot="title" >实习信息</span>
                <el-menu-item index="/internShipInfo" v-if="this.$store.getters.roleName==='teacher' || this.$store.getters.roleName==='user'">实习信息管理</el-menu-item>
                <el-menu-item index="/addInternShip" v-if="this.$store.getters.roleName==='user'">实习信息增加</el-menu-item>
              </el-submenu>

            </el-submenu>
            <el-menu-item index="/adminUser" v-if="this.$store.getters.roleName==='admin'">
              <i class="el-icon-user"></i>
              <span slot="title">用户管理</span>
            </el-menu-item>

            <el-menu-item index="/studentInfo" v-if="this.$store.getters.roleName==='admin' || this.$store.getters.roleName==='teacher'">
              <i class="el-icon-coordinate"></i>
              <span slot="title">学生管理</span>
            </el-menu-item>

            <el-menu-item index="/teacherInfo" v-if="this.$store.getters.roleName==='admin'">
              <i class="el-icon-place"></i>
              <span slot="title">教师管理</span>
            </el-menu-item>

            <el-menu-item index="/companyInfo" v-if="this.$store.getters.roleName==='admin'">
              <i class="el-icon-info"></i>
              <span slot="title">企业管理</span>
            </el-menu-item>

            <el-menu-item index="/notice" v-if="this.$store.getters.roleName!=='user'">
              <i class="el-icon-s-comment" ></i>
              <span slot="title">公告管理</span>
            </el-menu-item>
<!--            <el-menu-item index="/sysDict">-->
<!--              <i class="el-icon-s-comment"></i>-->
<!--              <span slot="title">字典管理</span>-->
<!--            </el-menu-item>-->

            <el-menu-item index="/studentContact">
              <i class="el-icon-phone"></i>
              <span slot="title">学生通讯录</span>
            </el-menu-item>

            <el-menu-item index="/teacherContact">
              <i class="el-icon-phone-outline"></i>
              <span slot="title">老师通讯录</span>
            </el-menu-item>
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

            <el-menu-item index="/dealInfo"><el-badge :is-dot="(this.$store.getters.yesOrNo === 'YES') ? true : false">处理中心</el-badge></el-menu-item>


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
              <div class="block"><el-avatar :size="50" :src="require('D:/images/'+this.$store.getters.avatar+'.jpg')"></el-avatar></div>
              <el-dropdown-menu slot="dropdown">
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
  import {getInfo} from "../api/user";
  import {getToken} from "../utils/auth";
  export default {
    name: 'Container',
    data() {
      return {
        username: '',
        isCollapse: false,
        show:false,
        activeIndex: '1',
          task:true,
        list:[],
          item:''
      }
    },
      created(){
          getInfo(getToken()).then(res => {
              let model  = res.data.userInfos
              const { avatar } = model
              let _that=this
              _that.item=avatar.substring(10,23)
          })
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
          if(keyPath[i]==='/adminUser'){
            keyPath[i]='用户管理'
          }
          if(keyPath[i]==='/sysDict'){
            keyPath[i]='字典管理'
          }
          if(keyPath[i]==='/companyInfo'){
            keyPath[i]='企业管理'
          }
          if(keyPath[i]==='/internShipInfo'){
            keyPath[i]='实习信息管理'
          }
          if(keyPath[i] === '/addInternShip'){
            keyPath[i]='实习信息添加'
          }
          if(keyPath[i] === '1'){
            keyPath[i]='常规菜单'
          }
          if(keyPath[i] === '/internshipReport'){
            keyPath[i]='实习报告管理'
          }
          if(keyPath[i] === '/addReport'){
            keyPath[i]='实习报告填写'
          }
          if(keyPath[i] === '/studentContact'){
            keyPath[i]='学生通讯录'
          }
          if(keyPath[i] === '/teacherContact'){
            keyPath[i]='教师通讯录'
          }
          if(keyPath[i] === '/dealInfo'){
            keyPath[i]='处理中心'
          }
          if(keyPath[i] === '/guidInfo'){
            keyPath[i]='指导记录管理'
          }

        }
        this.list=keyPath
      },
    },

  }
</script>

<style scoped>
  >>>.el-badge__content.is-fixed{
    margin-top: 13px;
  }
  .item {
    margin-right: 40px;
  }
</style>