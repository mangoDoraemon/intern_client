<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
            <el-form-item label="信息查询" prop="postCode">
                <el-input
                        v-model="fuzzy"
                        placeholder="请输入搜索内容"
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

        <el-table v-loading="loading" :data="teacherInfoList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="工号" align="center" prop="teacherNumber" />
            <el-table-column label="教师名字" align="center" prop="teacherName" />
            <el-table-column label="手机号" align="center" prop="teacherPhone" />
            <el-table-column label="教师岗位" align="center" prop="teacherPosition" />
            <el-table-column label="所属院系" align="center" prop="teacherDepartments" />
            <el-table-column label="教师状态" align="center" prop="stateName" />
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
                :current-page.sync="currentPage"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total" class="pagination">
        </el-pagination>

        <!-- 添加或修改教师信息对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="800px">
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="教师工号" prop="teacherNumber">
                    <el-input v-model="form.teacherNumber" placeholder="请输入教师工号" />
                </el-form-item>
                <el-form-item label="教师姓名" prop="teacherName">
                    <el-input v-model="form.teacherName" placeholder="请输入教师姓名" />
                </el-form-item>
                <el-form-item label="手机号" prop="teacherPhone">
                    <el-input v-model="form.teacherPhone" placeholder="请输入手机号" />
                </el-form-item>
                <el-form-item label="教师岗位" prop="teacherPosition">
                    <el-input v-model="form.teacherPosition" placeholder="请输入教师岗位" />
                </el-form-item>
                <el-form-item label="所属院系" prop="teacherDepartments">
                    <el-input v-model="form.teacherDepartments" placeholder="请输入所属院系" />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { listTeacher, addTeacher, updateTeacher } from "@/api/teacher";
    import {delTeacherInfo, getTeacherInfo} from "../../api/teacher";

    export default {
        name: "TeacherInfo",
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
                // 岗位信息表格数据
                teacherInfoList: [],
                // 弹出层标题
                title: "",
                // 是否显示弹出层
                open: false,
                // 查询参数
                currentPage: 1,
                fuzzy: '',
                pageSize: 10,
                total: 0,
                isAdd:false,
                queryParams:{

                },
                // 表单参数
                form: {},
                // 表单校验
                rules: {
                    teacherNumber: [
                        { required: true, message: "工号不能为空", trigger: "blur" }
                    ],
                    teacherName: [
                        { required: true, message: "姓名不能为空", trigger: "blur" }
                    ],
                    teacherPhone: [
                        { required: true, message: "联系方式不能为空", trigger: "blur" }
                    ],
                    teacherPosition: [
                        { required: true, message: "岗位不能为空", trigger: "blur" }
                    ],
                    teacherDepartments:[
                        { required: true, message: "所属院系不能为空", trigger: "blur" }
                    ],
                }
            };
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
                listTeacher(data).then(response => {
                    this.teacherInfoList = response.data.list;
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
                this.fuzzy=''
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
                this.title = "添加教师信息";
            },
            /** 修改按钮操作 */
            handleUpdate(row) {
                this.reset();
                const id = row.id || this.ids
                getTeacherInfo(id).then(response => {
                    this.form = response.data.teacherInfo;
                    this.open = true;
                    this.title = "修改教师信息";
                });
            },
            /** 提交按钮 */
            submitForm: function() {
                this.$refs["form"].validate(valid => {
                    if (valid) {
                        if (this.isAdd) {
                            addTeacher(this.form).then(response => {
                                if (response.data.code === "200") {
                                    this.$message({
                                        message: response.data.msg,
                                        type: response.data.level
                                    });
                                    this.open = false;
                                    this.getList();
                                } else {
                                    this.$message({
                                        message: "新增失败，请稍后重试",
                                        type:'error'
                                    });
                                }
                            });
                        } else {
                            updateTeacher(this.form).then(response => {
                                if (response.data.code === '200') {
                                    this.$message({
                                        message: "修改成功",
                                        type:'success'
                                    });
                                    this.open = false;
                                    this.getList();
                                } else {
                                    this.$message({
                                        message: "修改失败，请稍后重试",
                                        type:'error'
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
                    return delTeacherInfo(ids);
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

        }
    };
</script>