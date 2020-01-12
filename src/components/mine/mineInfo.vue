
<template>
  <div class="mineInfoClass">
    <div class="rightClass">
      <el-progress type="circle" :percentage="25" style="width: 150px;height: 200px"></el-progress>
      <div class="spanClass">
       <el-tag type="info" effect="plain">资料完善程度</el-tag>
      </div>
    </div>

  <div class="fromClass">
  <el-form ref="form" :model="mineForm" label-width="100px">
  <el-col  >
  <el-form-item label="账户ID" >
    <el-input v-model="mineForm.name"></el-input>
  </el-form-item>
  </el-col>
  <el-col >
  <el-form-item label="姓名">
    <el-input v-model="mineForm.name"></el-input>
  </el-form-item>
  </el-col>
  <el-col >
  <el-form-item label="权限">
    <el-input v-model="mineForm.name"></el-input>
  </el-form-item>
  </el-col>
  <el-col >
  <el-form-item label="邮箱地址">
    <el-input v-model="mineForm.name"></el-input>
  </el-form-item>
  </el-col>
  <el-col >
  <el-form-item label="个人介绍">
    <el-input type="textarea" v-model="mineForm.name"></el-input>
  </el-form-item>
  </el-col>
  <el-col >
  <el-form-item>
    <el-button type="primary" @click="onSubmit">保存</el-button>
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
        <img v-if="!imageUrl" :src="require('E:/images/'+item+'.jpg')" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
        <span style="">点击修改头像</span>
      </div>
    </div>

  </div>
</template>
<script>
  import {getToken} from "../../utils/auth";
  export default {
    data() {
      return {
          mineForm:{
            name:'',
            test:''
          },
        imageUrl: '',
        item:'1578650870581',
        test:'',
        headers:{
          Authorization: getToken()
        }
      }
    },
    created(){
     this.initData()
    },
    methods:{
      initData(){
        console.log("-----------------"+this.$store.getters.name)
        this.mineForm.name=this.$store.getters.name
        this.mineForm.test=this.$store.getters.avatar
        console.log("-----------------"+this.mineForm.test)
      },
      onSubmit(){

      },
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
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