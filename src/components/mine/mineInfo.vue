
<template>
  <div class="mineInfoClass">
    <div class="rightClass">
      <el-progress type="circle" :percentage="25" style="width: 150px;height: 200px"></el-progress>
      <div class="spanClass">
       <el-tag type="info" effect="plain">资料完善程度</el-tag>
      </div>
    </div>

  <div class="fromClass">
  <el-form ref="updateInfoForm" :model="mineForm" label-width="100px" :rules="rules">
  <el-col  >
  <el-form-item label="账户ID" >
    <el-input v-model="mineForm.socialId" :disabled="true"></el-input>
  </el-form-item>
  </el-col>
  <el-col >
  <el-form-item label="账户名称" prop="name">
    <el-input v-model="mineForm.name" ></el-input>
  </el-form-item>
  </el-col>
  <el-col >
  <el-form-item label="权限" >
    <el-input v-model="mineForm.roleIdName" :disabled="true"></el-input>
  </el-form-item>
  </el-col>
  <el-col >
  <el-form-item label="邮箱地址" prop="email">
    <el-input v-model="mineForm.email"></el-input>
  </el-form-item>
  </el-col>
  <el-col >
  <el-form-item label="个人介绍" prop="introduction">
    <el-input type="textarea" v-model="mineForm.introduction"></el-input>
  </el-form-item>
  </el-col>
  <el-col >
  <el-form-item>
    <el-button type="primary" @click="onSubmit('updateInfoForm')">保存</el-button>
    <el-button>取消</el-button>
  </el-form-item>
  </el-col>
</el-form>
  </div>

    <div class="avatarClass">
      <div class="imageClass">


      <el-upload
              class="avatar-uploader"
              action="/api/intern/auth/saveImage"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :headers="headers"
              :before-upload="beforeAvatarUpload">
        <img :src="require('D:/images/'+item+'.jpg')" class="avatar">
      </el-upload>
        <span style="">点击修改头像</span>
      </div>
    </div>

  </div>
</template>
<script>
  import {getToken} from "../../utils/auth";
  import {getInfo,updateMineInfo} from '@/api/user';
  export default {
    inject:['reload'],
    data() {

      var validateEmail = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请正确填写邮箱'));
        } else {
          if (value !== '') {
            var reg=/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
            if(!reg.test(value)){
              callback(new Error('请输入有效的邮箱'));
            }
          }
          callback();
        }
      };
      return {
          mineForm:{
            name:'',
            email:'',
            introduction:'',
            rolId:0,
            socialId:'',
            id:''
          },
        imageUrl: '',
        item:'1578636594070',
        test:'',
        headers:{
          Authorization: getToken()
        },
        userInfos:{

        },
        rules:{
            email:[
              {required:true, validator:validateEmail, trigger: 'blur'}
            ],
          introduction:[
            {required:true,message:'请填写个人说明'}
          ]
        }
      }
    },
    created(){
     this.initData()
    },
    methods:{
      initData(){

        this.mineForm.name=this.$store.getters.name
        this.mineForm.email=this.$store.getters.email
        this.mineForm.introduction=this.$store.getters.introduction
        this.mineForm.socialId=this.$store.getters.socialId
        this.mineForm.roleId=this.$store.getters.roleId
        this.mineForm.id=this.$store.getters.id
        let data=this.$store.getters.roleId
        if(data ==1){
          this.mineForm.roleIdName='指导教师'
        }
        if(data ==1){
          this.mineForm.roleIdName='学生'
        }
        if(data == 2){
          this.mineForm.roleIdName='管理员'
        }
        if(data == 3){
          this.mineForm.roleIdName='老师'
        }
        if(data == 4){
          this.mineForm.roleIdName='公司'
        }
        getInfo(getToken()).then(res => {
          let model  = res.data.userInfos
          const { avatar } = model
          let _that=this
          _that.item=avatar.substring(10,23)
        })


      },

      onSubmit(formName){

        this.$refs[formName].validate((valid) =>{
          if(valid){
            updateMineInfo(this.mineForm).then(res=>{
              if (res.data.code == '200') {
                //修改信息成功
                this.$message({
                  message: res.data.msg,
                  type: res.data.level
                });
              }else{
                this.$message({
                  message: res.data.msg,
                  type: res.data.level
                });
              }
            })
          }
        })


        getInfo(getToken()).then(res => {
          let model  = res.data.userInfos
          const { name, avatar, introduction, email,socialId,roleId,id } = model
          let _that=this
          this.mineForm.name=name
          this.mineForm.email=email
          this.mineForm.introduction=introduction
          this.mineForm.socialId=socialId
          this.mineForm.roleId=_that.roleId
          this.mineForm.id=id
          let data=roleId
          if(data ==1){
            this.mineForm.roleIdName='学生'
          }
          if(data == 2){
            this.mineForm.roleIdName='管理员'
          }
          if(data == 3){
            this.mineForm.roleIdName='老师'
          }
          if(data == 4){
            this.mineForm.roleIdName='公司'
          }
          _that.item=avatar.substring(10,23)
        })
      },
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
        getInfo(getToken()).then(res => {
          let model  = res.data.userInfos
          const { avatar } = model
          let _that=this
          _that.item=avatar.substring(10,23)
        })
        this.$store.dispatch('user/getInfo');



      },
      beforeAvatarUpload(file) {

        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return   isLt2M;
      }
    }
  }
</script>
<style scoped>
  .mineInfoClass{
    width: 1392px;
    height: 800px;
  }
  .fromClass{
    width: 500px;
    height: 800px;
    float: left;
    margin-top: 50px;
    margin-left: 50px;

  }
  .rightClass{
    margin-left: 220px;
    width: 200px;
    height: 800px;
    float: left;
    margin-top: 50px;
  }
  .spanClass{
    width: 200px;
    height: 200px;
    margin-left: 15px;
  }
  .avatarClass{
    width: 400px;
    height: 800px;
    float: right;
    margin-right: -200px;
    margin-top: 30px;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;

  }
  .avatar {
    width: 178px;
    height: 178px;
    float: left;
    display: block;

  }
  imageClass{
    width: 184px;
    height: 184px;
    float: right;
    margin-right: -200px;
  }
</style>