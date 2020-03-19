<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
            <el-form-item label="企业ID" prop="companyNumber">
                <el-input
                        v-model="queryParams.companyNumber"
                        placeholder="请输入企业信用号"
                        clearable
                        size="small"
                        @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item label="企业名称" prop="companyName">
                <el-input
                        v-model="queryParams.companyName"
                        placeholder="请输入企业名称"
                        clearable
                        size="small"
                        @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item label="企业电话" prop="companyPhone">
                <el-input
                        v-model="queryParams.companyPhone"
                        placeholder="请输入企业电话"
                        clearable
                        size="small"
                        @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button
                        type="primary"
                        icon="el-icon-plus"
                        size="mini"
                        @click="handleAdd"
                >新增</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button
                        type="success"
                        icon="el-icon-edit"
                        size="mini"
                        :disabled="single"
                        @click="handleUpdate"
                >修改</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button
                        type="danger"
                        icon="el-icon-delete"
                        size="mini"
                        :disabled="multiple"
                        @click="handleDelete"
                >删除</el-button>
            </el-col>
        </el-row>

        <el-table v-loading="loading" :data="companyList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="企业信用号" align="center" prop="companyNumber" />
            <el-table-column label="企业名称" align="center" prop="companyName" />
            <el-table-column label="企业地址" align="center" prop="companyAddress" />
            <el-table-column label="企业电话" align="center" prop="companyPhone" />
            <el-table-column label="企业邮箱" align="center" prop="companyEmail" />
            <el-table-column label="企业类型" align="center" prop="companyType" />
            <el-table-column label="企业开户行" align="center" prop="companyBank" />
            <el-table-column label="企业银行账号" align="center" prop="companyAccount" />
            <el-table-column label="备注" align="center" prop="remark" />

            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button
                            size="mini"
                            type="text"
                            icon="el-icon-edit"
                            @click="handleUpdate(scope.row)"
                    >修改</el-button>
                    <el-button
                            size="mini"
                            type="text"
                            icon="el-icon-delete"
                            @click="handleDelete(scope.row)"
                    >删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination
                @size-change="handleSizeChange"
                @current-change="getList"
                :current-page.sync="queryParams.page"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="queryParams.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total" class="pagination">
        </el-pagination>

        <!-- 添加或修改岗位信息对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="1000px">
            <el-form ref="form" :model="form" :rules="rules" label-width="120px">
                <el-row :gutter="20">
                    <el-col :span="8" :offset="2">
                <el-form-item label="企业信用号" prop="companyNumber">
                    <el-input v-model="form.companyNumber" placeholder="请输入企业信用号" />
                </el-form-item>
                    </el-col>

                    <el-col :span="8" :offset="2">
                <el-form-item label="企业名称" prop="companyName">
                    <el-input v-model="form.companyName" placeholder="请输入企业名称" />
                </el-form-item>
                    </el-col>

                    <el-col :span="8" :offset="2">
                <el-form-item label="企业地址" prop="companyAddress">
                    <el-input v-model="form.companyAddress" placeholder="请输入企业地址" />
                </el-form-item>
                    </el-col>

                    <el-col :span="8" :offset="2">
                <el-form-item label="企业邮箱" prop="companyEmail">
                    <el-input v-model="form.companyEmail" placeholder="请输入企业邮箱" />
                </el-form-item>
                    </el-col>

                    <el-col :span="8" :offset="2">
                <el-form-item label="企业电话" prop="companyPhone">
                    <el-input v-model="form.companyPhone" placeholder="请输入企业电话" />
                </el-form-item>
                    </el-col>

                    <el-col :span="8" :offset="2">
                <el-form-item label="企业开户行" prop="companyBank">
                    <el-input v-model="form.companyBank" placeholder="请输入企业开户行" />
                </el-form-item>
                    </el-col>

                    <el-col :span="8" :offset="2">
                <el-form-item label="企业银行账户" prop="companyAccount">
                    <el-input v-model="form.companyAccount" placeholder="请输入企业银行账户" />
                </el-form-item>
                    </el-col>

                    <el-col :span="8" :offset="2">
                <el-form-item label="企业类型" prop="companyType">
                    <el-input v-model="form.companyType" placeholder="请输入企业类型" />
                </el-form-item>
                    </el-col>

                    <el-col :span="8" :offset="2">
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="form.remark" placeholder="请输入备注信息" />
                </el-form-item>
                    </el-col>

                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>

    import {addCompany, delCompanyInfo, getCompany, listCompany, updateCompany} from "../../api/company";

    export default {
        name: "CompanyInfo",
        data() {
            return {
                // 遮罩层
                loading: true,
                // 选中数组
                ids: [],
                // 非单个禁用
                single: true,
                // 非多个禁用
                multiple: true,
                // 总条数
                total: 0,
                isAdd:false,
                companyList: [],
                // 弹出层标题
                title: "",
                // 是否显示弹出层
                open: false,
                // 查询参数
                queryParams: {
                    page: 1,
                    pageSize: 10,
                    companyNumber:'',
                    companyName:'',
                    companyPhone:''
                },
                // 表单参数
                form: {},
                // 表单校验
                rules: {
                    companyNumber: [
                        { required: true, message: "企业信用号不能为空", trigger: "blur" }
                    ],
                    companyName: [
                        { required: true, message: "企业名称不能为空", trigger: "blur" }
                    ],
                    companyAddress: [
                        { required: true, message: "企业地址不能为空", trigger: "blur" }
                    ],
                    companyEmail: [
                        { required: true, message: "企业邮箱不能为空", trigger: "blur" }
                    ],
                    companyPhone: [
                        { required: true, message: "企业电话不能为空", trigger: "blur" }
                    ],
                    companyBank: [
                        { required: true, message: "企业开户行不能为空", trigger: "blur" }
                    ],
                    companyAccount: [
                        { required: true, message: "企业银行账户不能为空", trigger: "blur" }
                    ],
                    companyType: [
                        { required: true, message: "企业类型不能为空", trigger: "blur" }
                    ],
                    remark: [
                        { required: true, message: "备注信息不能为空", trigger: "blur" }
                    ],
                }
            };
        },
        created() {
            this.getList();
        },
        methods: {
            /** 查询信息列表 */
            getList() {
                this.loading = true;
                listCompany(this.queryParams).then(response => {
                    this.companyList = response.data.list;
                    this.total = response.data.total;
                    this.loading = false;
                });
            },
            // 取消按钮
            cancel() {
                this.open = false;
                this.reset();
            },
            // 表单重置
            reset() {
                this.form = {

                };
            },
            /** 搜索按钮操作 */
            handleQuery() {
                this.getList();
            },
            /** 重置按钮操作 */
            resetQuery() {
                this.queryParams.companyName=''
                this.queryParams.companyNumber=''
                this.queryParams.companyPhone=''
                this.handleQuery();
            },
            // 多选框选中数据
            handleSelectionChange(selection) {
                this.ids = selection.map(item => item.id)
                this.single = selection.length!=1
                this.multiple = !selection.length
            },
            /** 新增按钮操作 */
            handleAdd() {
                this.reset();
                this.isAdd=true
                this.open = true;
                this.title = "添加企业信息";
            },
            /** 修改按钮操作 */
            handleUpdate(row) {
                this.reset();
                this.isAdd=false;
                const id = row.id || this.ids
                getCompany(id).then(response => {
                    this.form = response.data.companyInfo;

                });
                this.open = true;
                this.title = "修改企业信息";
            },
            /** 提交按钮 */
            submitForm: function() {
                this.$refs["form"].validate(valid => {
                    if (valid) {
                        if (this.isAdd) {
                            addCompany(this.form).then(response => {
                                if (response.data.code === "200") {
                                    this.$message({
                                        message: response.data.msg,
                                        type: response.data.level
                                    });
                                    this.open = false;
                                    this.getList();
                                } else if(response.data.code === "3000"){
                                    this.$message({
                                        message: response.data.msg,
                                        type:response.data.level
                                    });
                                }else {
                                    this.$message({
                                        message: response.data.message,
                                        type:"error"
                                    });
                                }
                            }).catch((res) => {
                                this.$message({
                                    message: res.data.message,
                                    type:"error"
                                });
                            });
                        } else {
                            updateCompany(this.form).then(response => {
                                if (response.data.code === "200") {
                                    this.$message({
                                        message: response.data.msg,
                                        type:response.data.level
                                    });
                                    this.open = false;
                                    this.getList();
                                } else {
                                    this.$message({
                                        message: response.data.msg,
                                        type:response.data.level
                                    });
                                }
                            });
                        }
                    }
                });
            },
            /** 删除按钮操作 */
            handleDelete(row) {
                const ids = row.id || this.ids;
                this.$confirm('是否确认删除选中的数据项?', "警告", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(function() {
                    return delCompanyInfo(ids);
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
                this.queryParams.pageSize = val;
                this.getList()
            },
        }
    };
</script>