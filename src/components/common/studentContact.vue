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


        <el-table v-loading="loading" :data="studentList" stripe @selection-change="handleSelectionChange">
            <el-table-column label="学生学号" align="center" prop="studentNumber" />
            <el-table-column label="学生姓名" align="center" prop="studentName" />
            <el-table-column label="所在班级" align="center" prop="studentClass" />
            <el-table-column label="入学年份" align="center" prop="studentYear" />
            <el-table-column label="手机号" align="center" prop="studentPhone" />
            <el-table-column label="邮箱" align="center" prop="studentEmail" />

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



    </div>
</template>

<script>
    import {
        listStudent,
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

            };
        },
        created() {
            this.getList();
        },
        methods: {



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




        }
    };
</script>
<style scoped>
    .buttonForm{
        margin-top: 15px;
    }
</style>