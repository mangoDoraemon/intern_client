<template>

    <div class="app-container">

        <div class="query-form">
            <el-row :gutter="20">
                <el-col :span="9">
                    <el-input
                            placeholder="请输入查询条件"
                            v-model="fuzzy"
                    />
                </el-col>

                <el-col :span="3">
                    <el-button @click="getList" icon="el-icon-search" circle></el-button>
                </el-col>

            </el-row>
        </div>


    <el-table
            :data="tableData"
            v-loading="loading"
            style="width: 100%">

        <el-table-column
                label="姓名"
                width="180">
            <template slot-scope="scope">
                <el-popover trigger="hover" placement="top">
                    <p>姓名: {{ scope.row.name }}</p>
                    <div slot="reference" class="name-wrapper">
                        <el-tag size="medium">{{ scope.row.name }}</el-tag>
                    </div>
                </el-popover>
            </template>
        </el-table-column>
        <el-table-column label="账号ID" prop="socialId">

        </el-table-column>
        <el-table-column label="密码" >
            <template slot-scope="scope">
                <el-popover trigger="hover" placement="top">
                    <p>密码: {{ scope.row.passwordChange}}</p>
                    <div slot="reference" class="name-wrapper">
                        <el-tag size="medium">{{ scope.row.password }}</el-tag>
                    </div>
                </el-popover>
            </template>
        </el-table-column>

        <el-table-column label="权限" prop="roleIdName">

        </el-table-column>
        <el-table-column label="邮箱" prop="email">

        </el-table-column>
        <el-table-column
                label="创建日期"
                width="180">
            <template slot-scope="scope">
                <i class="el-icon-time"></i>
                <span style="margin-left: 10px">{{ scope.row.createTime | formatDate('yyyy-MM-dd') }}</span>
            </template>
        </el-table-column>

        <el-table-column label="操作">
            <template slot-scope="scope">
                <el-button
                        size="mini"
                        @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                <el-button
                        size="mini"
                        type="danger"
                        @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
        <el-pagination
                @size-change="handleSizeChange"
                @current-change="getList"
                :current-page.sync="currentPage"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total" class="pagination">
        </el-pagination>

        <el-dialog :title="title" :visible.sync="open">
            <el-form ref="form" :model="form" :rules="rules" label-width="80px" style="align-content: center">
                <el-form-item label="姓名" >
                    <el-input v-model="form.name" :disabled="disabled"  />
                </el-form-item>
                <el-form-item label="账号" >
                    <el-input v-model="form.socialId"  :disabled="disabled"  />
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="form.password" placeholder="请输入密码" />
                </el-form-item>

                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="form.email" placeholder="请输入邮箱信息" />
                </el-form-item>
                <el-form-item label="个人介绍" prop="introduction">
                    <el-input v-model="form.introduction" placeholder="请输入个人介绍" />
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">保存</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {listAuthUser, getUserInfo, delUserInfo} from "../../api/admin";
    import {updateMineInfo} from "../../api/user";

    export default {
        data() {
            return {
                // 遮罩层
                loading: true,
                tableData: [],
                currentPage: 1,
                fuzzy: '',
                pageSize: 10,
                total: 0,
                isAdd:false,
                form:{},
                disabled:true,
                open:false,
                title:'',
                // 表单校验
                rules: {
                    password: [
                        { required: true, message: "密码不能为空", trigger: "blur" }
                    ],
                    email: [
                        { required: true, message: "邮箱不能为空", trigger: "blur" }
                    ],
                    introduction: [
                        { required: true, message: "个人简介不能为空", trigger: "blur" }
                    ],
                }
            }
        },
        created() {
            this.getList();
        },
        methods: {
            getList() {
                this.loading = true;
                let data = {
                    'fuzzy': this.fuzzy,
                    'page': this.currentPage,
                    'pageSize': this.pageSize,
                }
                listAuthUser(data).then(response => {
                    this.tableData = response.data.list;
                    this.total = response.data.total;
                    this.loading = false;
                });
            },
            submitForm:function(){
                this.$refs["form"].validate(valid => {
                    if(valid){
                        updateMineInfo(this.form).then(res=>{
                            if (res.data.code == '200') {
                                //修改信息成功
                                this.$message({
                                    message: res.data.msg,
                                    type: res.data.level
                                });
                                this.open=false;
                                this.getList();
                            }else{
                                this.$message({
                                    message: res.data.msg,
                                    type: res.data.level
                                });
                            }
                        })
                    }
                })
            },
            handleEdit(index, row) {
                this.title='维护用户信息'
                const id = row.socialId;
                getUserInfo(id).then(response => {
                    this.form = response.data.userInfos;

                })
                this.open=true

            },
            handleDelete(index, row) {
                const id = row.socialId;
                this.$confirm('是否确认删除选中的数据项?', "警告", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(function() {
                    return delUserInfo(id);
                }).then((res) => {
                    this.$message({
                        message: res.data.msg,
                        type: res.data.level
                    });
                    if(res.data.code==='200'){
                        this.getList();
                    }


                }).catch(function() {});
            },
            handleSizeChange(val){
                this.pageSize = val;
                this.getList()
            },
            cancel() {
                this.open = false;
                this.form="";
                this.title="";
            },
        }
    }
</script>
<style scoped>
    .query-form {
        padding-bottom: 15px;
        padding-left: 15px;
    }
</style>