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

                <el-col :span="12" v-if="this.roleName==='teacher'">
                    <el-button type="primary" icon="el-icon-edit" round @click="teacherAddStudent">添加学生</el-button>
                </el-col>

            </el-row>
        </div>
        <div class="buttonForm">
            <el-row :gutter="10" class="mb8">
                <el-col :span="1.5">
                    <el-button
                            type="primary"
                            icon="el-icon-plus"
                            size="mini"
                            v-if="roleName==='admin'"
                            @click="handleAdd"
                    >新增</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button
                            type="success"
                            icon="el-icon-edit"
                            size="mini"
                            :disabled="single"
                            v-if="roleName==='admin'"
                            @click="handleUpdate"
                    >修改</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button
                            type="danger"
                            icon="el-icon-delete"
                            size="mini"
                            :disabled="multiple"
                            v-if="roleName==='admin'"
                            @click="handleDelete"
                    >删除</el-button>
                </el-col>
            </el-row>
        </div>


        <el-table v-loading="loading" :data="studentList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="学生学号" align="center" prop="studentNumber" />
            <el-table-column label="学生姓名" align="center" prop="studentName" />
            <el-table-column label="所在班级" align="center" prop="studentClass" />
            <el-table-column label="入学年份" align="center" prop="studentYear" />
            <el-table-column label="手机号" align="center" prop="studentPhone" />
            <el-table-column label="邮箱" align="center" prop="studentEmail" />
            <el-table-column label="状态" align="center" prop="stateName" />
            <el-table-column label="创建时间" align="center" prop="">
                <template slot-scope="scope">
                    {{scope.row.managerTime | formatDate('yyyy-MM-dd')}}
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button
                            size="mini"
                            type="text"
                            icon="el-icon-edit"
                            v-if="roleName==='admin'"
                            @click="handleUpdate(scope.row)"
                    >修改</el-button>
                    <el-button
                            size="mini"
                            type="text"
                            v-if="roleName==='admin'"
                            icon="el-icon-delete"
                            @click="handleDelete(scope.row)"
                    >删除</el-button>

                    <el-button
                            size="mini"
                            type="text"
                            icon="el-icon-delete"
                            v-if="roleName==='teacher'"
                            @click="handleRemove(scope.row)"
                    >移除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div style="margin-top: 15px;align: center">
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="getList"
                    :current-page.sync="currentPage"
                    :page-sizes="[10, 20, 50, 100]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total" class="pagination">
            </el-pagination>
        </div>


        <!-- 添加或修改信息对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="500px">
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="学生学号" prop="studentNumber">
                    <el-input v-model="form.studentNumber" :disabled="disabled" placeholder="请输入学生学号" />
                </el-form-item>
                <el-form-item label="学生姓名" prop="studentName">
                    <el-input v-model="form.studentName" placeholder="请输入学生姓名" />
                </el-form-item>
                <el-form-item label="学生手机号" prop="studentPhone">
                    <el-input v-model="form.studentPhone" placeholder="请输手机号" />
                </el-form-item>
                <el-form-item label="学生邮箱" prop="studentEmail">
                    <el-input v-model="form.studentEmail" placeholder="请输入邮箱" />
                </el-form-item>
                <el-form-item label="所在班级" prop="studentClass">
                    <el-input v-model="form.studentClass" placeholder="请输入所在班级" />
                </el-form-item>
                <el-form-item label="入学年份" prop="studentYear">
                    <el-input v-model="form.studentYear" placeholder="请输入入学年份" />
                </el-form-item>


            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>

        <el-dialog title="添加学生" :visible.sync="teacherOpen" width="1500px">
            <div class="query-form">
                <el-row :gutter="20">
                    <el-col :span="3">
                        <el-input
                                placeholder="学号"
                                v-model="queryForm.studentNumber"
                        />
                    </el-col>
                    <el-col :span="3">
                        <el-input
                                placeholder="姓名"
                                v-model="queryForm.studentName"
                        />
                    </el-col>
                    <el-col :span="3">
                        <el-input
                                placeholder="所在班级"
                                v-model="queryForm.studentClass"
                        />
                    </el-col>


                    <el-col :span="3">
                        <el-button @click="query" icon="el-icon-search" circle></el-button>
                    </el-col>
                </el-row>
            </div>


            <el-table
                    :data="tableData"
                    v-loading="listLoading"
                    stripe
                    style="width: 100%">
                <el-table-column label="学生学号" align="center" prop="studentNumber" />
                <el-table-column label="学生姓名" align="center" prop="studentName" />
                <el-table-column label="所在班级" align="center" prop="studentClass" />
                <el-table-column label="入学年份" align="center" prop="studentYear" />
                <el-table-column label="创建时间" align="center" prop="">
                    <template slot-scope="scope">
                        {{scope.row.managerTime | formatDate('yyyy-MM-dd')}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                    <template slot-scope="scope">
                        <el-button
                                type="text"
                                icon="el-icon-plus"
                                @click="handleAddTeacher(scope.row)"
                        >添加</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-pagination
                    @size-change="handleTeacherSizeChange"
                    @current-change="query"
                    :current-page.sync="queryForm.page"
                    :page-size="queryForm.pageSize"
                    layout="prev, pager, next, jumper"
                    :total="queryForm.total"
                    style="margin-top: 20px"
            >
            </el-pagination>
        </el-dialog>
    </div>
</template>

<script>
    import {
        listStudent,
        addStudent,
        delStudentInfo,
        getStudentInfo,
        updateStudentInfo,
        listStudentInfoAll,
        updateStudentState, removeStudentState
    } from "../../api/student";

    export default {
        name: "StudentInfo",
        data() {
            return {
                queryForm:{
                    studentName:'',
                    studentClass:'',
                    studentNumber:'',
                    page: 1,
                    pageSize:5,
                    total:0
                },
                listLoading:false,
                tableData:[],
                teacherOpen:false,
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
                // 表格数据
                studentList: [],
                // 弹出层标题
                title: "",
                // 是否显示弹出层
                open: false,
                // 查询参数
                currentPage: 1,
                fuzzy: '',
                pageSize: 10,
                isAdd:false,
                roleName:'',
                teacherNumber:'',
                disabled:false,
                // 表单参数
                form: {
                    studentNumber:'',
                    studentName:'',
                    studentClass:'',
                    studentYear:'',
                    teacherNumber:'',
                    studentEmail:'',
                    studentPhone:'',
                    roleName:''
                },
                // 表单校验
                rules: {
                    studentNumber: [
                        { required: true, message: "学号不能为空", trigger: "blur" }
                    ],
                    studentName: [
                        { required: true, message: "姓名不能为空", trigger: "blur" }
                    ],
                    studentClass: [
                        { required: true, message: "所在班级不能为空", trigger: "blur" }
                    ],
                    studentYear: [
                        { required: true, message: "入学年份不能为空", trigger: "blur" }
                    ],
                    studentPhone: [
                        { required: true, message: "手机号不能为空", trigger: "blur" }
                    ],
                    studentEmail: [
                        { required: true, message: "邮箱不能为空", trigger: "blur" }
                    ],
                }
            };
        },
        created() {
            this.roleName=this.$store.getters.roleName
            this.teacherNumber=this.$store.getters.teacherNumber
            this.getList();
        },
        methods: {
            teacherAddStudent(){
                this.fetchData();
                this.teacherOpen=true;
            },
            fetchData(){
                this.listLoading = true
                listStudentInfoAll({}).then(res => {
                    this.tableData = res.data.list;
                    this.queryForm.total = res.data.total;
                    this.listLoading = false
                })
            },
            query(){
                this.listLoading = true
                listStudentInfoAll(this.queryForm).then(res => {
                    this.tableData = res.data.list;
                    this.queryForm.total = res.data.total;
                    this.listLoading = false
                })
            },
            handleTeacherSizeChange(val){
                this.queryForm.pageSize = val;
                this.query()
            },
            handleAddTeacher(row){
                const id = row.id
                const teacherNumber=this.teacherNumber
                updateStudentState(id,teacherNumber).then(response => {
                    if (response.data.code === "200") {
                        this.$message({
                            message: response.data.msg,
                            type: response.data.level
                        });
                        this.fetchData();
                        this.getList();
                    }
                });
            },
            handleRemove(row){
                const id = row.id
                removeStudentState(id).then(response =>{
                    if (response.data.code === "200") {
                        this.$message({
                            message: response.data.msg,
                            type: response.data.level
                        });
                        this.getList();
                    }
                })
            },
            /** 查询信息列表 */
            getList() {
                this.loading = true;
                let data = {
                    'fuzzy': this.fuzzy,
                    'page': this.currentPage,
                    'pageSize': this.pageSize,
                    'roleName':this.roleName,
                    'teacherNumber':this.teacherNumber
                }
                listStudent(data).then(response => {
                    this.studentList = response.data.list;
                    this.total = response.data.total;
                    this.loading = false;
                });
            },
            handleSizeChange(val){
                this.pageSize = val;
                this.getList()
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
                this.queryParams.pageNum = 1;
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
                this.disabled=false;
                this.open = true;
                this.isAdd=true;
                this.title = "添加学生信息";
            },
            /** 修改按钮操作 */
            handleUpdate(row) {
                this.reset();
                this.disabled=true;
                const id = row.id || this.ids
                getStudentInfo(id).then(response => {
                    this.form = response.data.studentInfo;
                    this.open = true;
                    this.title = "修改学生信息";
                });
            },
            /** 提交按钮 */
            submitForm: function() {
                this.$refs["form"].validate(valid => {
                    if (valid) {
                        if (this.isAdd) {
                            this.form.roleName=this.roleName
                            addStudent(this.form).then(response => {
                                if (response.data.code === "200") {
                                    this.$message({
                                        message: response.data.msg,
                                        type: response.data.level
                                    });
                                    this.open = false;
                                    this.getList();
                                } else if (response.data.code === "3000"){
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
                            this.form.roleName=this.roleName
                            updateStudentInfo(this.form).then(response => {
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
                    return delStudentInfo(ids);
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
        }
    };
</script>
<style scoped>
    .buttonForm{
        margin-top: 15px;
    }
</style>