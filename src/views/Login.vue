<template>
    <div class="login_back">
        <br/><br/><br/><br/>
        <el-form ref='AccountFrom' :model='account' :rules="rules" class="login-container" label-position="left"
                 label-width="0px">

            <h3 class="login_title">实习生登记系统</h3>

            <el-form-item prop="account">
                <el-input type="text" v-model="account.username" auto-complete="off" placeholder="账号"></el-input>
            </el-form-item>

            <el-form-item prop="password">
                <el-input type="password" v-model="account.password" auto-complete="off" placeholder="密码"></el-input>
            </el-form-item>



            <el-checkbox class="login_remember" v-model="checked" checked style="float: left">记住密码</el-checkbox>

            <el-form-item style="width: 100%">
                <el-button type="primary" @click='handleLogin' style="width: 100%">登录</el-button>
            </el-form-item>
            <el-form-item style="width: 100%">
                <el-button type="text" @click='registered'  >注册新账号</el-button>
                <!--      <el-button type="text" @click='registered11'  >修改密码</el-button>-->
            </el-form-item>
        </el-form>

        <!--弹出窗-->
        <el-dialog  title="注册账号" :visible.sync="dialogVisible" top="5vh" @close="cancelRegistered" >
            <el-scrollbar>
                <el-form ref="empRegisteredForm" :model="empRegisteredForm" :rules="rules"
                         label-width="100px" label-position="right"
                         style="width: 70%; margin-bottom: 20px"
                >
                    <!--          账号-->
                    <el-row>
                        <el-col>
                            <el-form-item label="账号：" prop="empAccount">
                                <el-input v-model="empRegisteredForm.empAccount" placeholder="请输入"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <!--          密码-->
                    <el-row>
                        <el-col >
                            <el-form-item label="密码：" prop="empPwd">
                                <el-input  placeholder="请输入密码" v-model="empRegisteredForm.empPwd"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                            <el-col>
                                <el-form-item label="注册类型：" prop="radio">
                                <el-radio-group v-model="radio">
                                    <el-radio :label="3">学生</el-radio>
                                    <el-radio :label="6">老师</el-radio>
                                    <el-radio :label="9">企业</el-radio>
                                </el-radio-group>
                                </el-form-item>
                            </el-col>

                    </el-row>

                    <el-row v-if="radio === 3">
                        <el-col >
                            <el-form-item label="学号：" prop="empPwd">
                                <el-input  placeholder="请输入密码" v-model="empRegisteredForm.empPwd"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row v-if="radio === 6">
                        <el-col >
                            <el-form-item label="工号：" prop="empPwd">
                                <el-input  placeholder="请输入密码" v-model="empRegisteredForm.empPwd"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row v-if="radio === 9">
                        <el-col >
                            <el-form-item label="企业信用号" prop="empPwd">
                                <el-input  placeholder="请输入密码" v-model="empRegisteredForm.empPwd"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-form-item label="验证码：" prop="seccode">
                        <el-input
                                class="log-input"
                                v-model="empRegisteredForm.seccode"
                                placeholder="验证码"
                                prefix-icon="icon-login_auth"
                                style="width: 200px;float: left">
                        </el-input>
                        <el-tag type="success" style="height: 40px;float: left"><el-button view="cancel" type="text" @click="createCode">&nbsp;&nbsp;{{ checkCode}}</el-button></el-tag>
                    </el-form-item>
                </el-form>
            </el-scrollbar>
            <div slot="footer">
                <el-button view="save" type="primary" @click="afterRegistered('empRegisteredForm')">保存</el-button>
                <el-button view="cancel" @click="cancelRegistered">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    //引入api.js  好调用里面的接口
    import {createUser} from '../api/user';

    export default {
        name: 'login',
        data() {
            let checkCode = (rule, value, callback) => {

                if(this.empRegisteredForm.seccode!= this.checkCode){
                    return callback(new Error('验证码错误!验证码区分大小写'))
                } else {
                    callback()
                }
            };
            return {
                radio:'',

                checkCode:'',
                dialogVisible: false,
                logining: false,
                checked: true,
                empRegisteredForm: {
                    empAccount:'',
                    empPwd:'',
                },
                account: {
                    username: '',
                    password: ''
                },
                //正则验证
                rules: {
                    empAccount: [{
                        required: true,
                        message: '请输入账号',
                        trigger: 'blur'
                    }],
                    empPwd: [{
                        required: true,
                        message: '请输入密码',
                        trigger: 'blur'
                    }],
                    seccode: [
                        { required: true, message: "请输验证码", trigger: "blur" },
                        {required: true, validator: checkCode, trigger: 'blur'}
                    ]
                },

            }
        },
        created(){
            this.getCookie();
        },
        methods: {


            createCode() {
                let code = "";
                let codeLength = 4; //验证码的长度
                let random = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9); //随机数
                for(let i = 0; i < codeLength; i++) { //循环操作
                    let index = Math.floor(Math.random() * 10); //取得随机数的索引（0~10）
                    code += random[index]; //根据索引取得随机数加到code上
                }
                this.checkCode = code; //把code值赋给验证码
            },
            afterRegistered(){
                this.$refs.empRegisteredForm.validate((valid) => {
                    if (valid) {
                        //验证通过 可以提交
                        this.logining = true;
                        //将提交的数据进行封装
                        var registeredParams = {
                            socialId: this.empRegisteredForm.empAccount,
                            password: this.empRegisteredForm.empPwd,
                        };
                        //调用函数  传递参数 获取结果
                        createUser(registeredParams).then(data => {
                            this.logining = false;
                            if (data.code == '200') {
                                //注册成功
                                this.$message({
                                    message: data.msg,
                                    type: data.level
                                });
                                this.dialogVisible= false;
                            } else {
                                this.$message({
                                    message: data.msg,
                                    type: data.level
                                });
                            }
                        })
                    } else {
                        console.log('error submit');
                        return false;
                    }
                });
            },
            // 注册按钮点击事件
            registered(){
                this.empAccount="";
                this.empPwd="";
                this.createCode();
                this.dialogVisible= true;
            },
            // 注册完成关闭事件
            cancelRegistered(){
                this.dialogVisible= false;
                this.empRegisteredForm={}
            },

            //设置cookie
            setCookie(c_name, c_pwd, exdays) {
                var exdate = new Date(); //获取时间
                exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays); //保存的天数
                //字符串拼接cookie
                window.document.cookie = "userName" + "=" + c_name + ";path=/;expires=" + exdate.toGMTString();
                window.document.cookie = "userPwd" + "=" + c_pwd + ";path=/;expires=" + exdate.toGMTString();
            },
            //读取cookie
            getCookie: function() {
                if (document.cookie.length > 0) {
                    var arr = document.cookie.split('; '); //这里显示的格式需要切割一下自己可输出看下
                    for (var i = 0; i < arr.length; i++) {
                        var arr2 = arr[i].split('='); //再次切割
                        //判断查找相对应的值
                        if (arr2[0] == 'userName') {
                            this.account.username = arr2[1]; //保存到保存数据的地方
                        } else if (arr2[0] == 'userPwd') {
                            this.account.password = arr2[1];
                        }
                    }
                }
            },
            //清除cookie
            clearCookie:            function() {
                this.setCookie("", "", -1); //修改2值都为空，天数为负1天就好了
            },
            //登录
            handleLogin() {

                this.$refs.AccountFrom.validate((valid) => {
                    if (valid) {
                        //验证通过 可以提交
                        this.logining = true;
                        //将提交的数据进行封装
                        var userInfo = {socialId: this.account.username, password: this.account.password};

                        this.$store.dispatch('user/login',userInfo).then(res=>{
                            console.log(res)
                            if(res.data.code=='200'){

                                this.$router.push({path: '/index'});
                                this.$store.dispatch('user/getInfo').then(data=>{
                                    console.log(data)
                                })

                            }
                        })
                        //调用函数  传递参数 获取结果
                        // requestLogin(loginParams).then(data => {
                        //     this.logining = false;
                        //     if (data.code == '200') {
                        //
                        //         const self = this;
                        //         //判断复选框是否被勾选 勾选则调用配置cookie方法
                        //         if (self.checked == true) {
                        //             console.log("checked == true");
                        //             //传入账号名，密码，和保存天数3个参数
                        //             self.setCookie(self.account.username, self.account.password, 7);
                        //         }else {
                        //             console.log("清空Cookie");
                        //             //清空Cookie
                        //             self.clearCookie();
                        //         }
                        //
                        //         //登录成功
                        //         sessionStorage.setItem('access-token', data.token);
                        //         console.log("---------------"+data.token)
                        //         this.$message({
                        //             message: data.msg,
                        //             type: data.level
                        //         });
                        //         //用vue路由跳转到后台主界面
                        //         this.$router.push({path: '/index'});
                        //
                        //     } else {
                        //         this.$message({
                        //             message: data.msg,
                        //             type: data.level
                        //         });
                        //     }
                        // })
                    } else {
                        console.log('error submit');
                        return false;
                    }
                });
            },

        }
    }
</script>
<style scoped>
    .login-container {
        margin: 0px 0px 0px 1000px;
        width: 350px;
        padding: 35px 35px 15px 35px;
        border: 1px solid #eaeaea;
        box-shadow: 0 0 25px #cac6c6;
    }

    .login_title {
        margin: 0px auto 40px auto;
        text-align: center;
        color: #505458;
    }

    .login_remember {
        margin: 0px 0px 35px 0px;
        text-align: left;
    }

    .login_back{
        width: 100%;
        height: 650px;
        margin-top: 80px;
        background-image: -webkit-linear-gradient(bottom left, rgba(0, 0, 255, 0.5), rgba(255, 0, 0, 0.75)), -webkit-linear-gradient(rgba(0, 0, 255, 0.25) 100%, transparent), url("../assets/c1.jpeg");
        background-size: cover;
    }
</style>

