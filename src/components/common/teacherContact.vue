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
        <el-table v-loading="loading" :data="teacherInfoList" stripe @selection-change="handleSelectionChange">
            <el-table-column label="工号" align="center" prop="teacherNumber" />
            <el-table-column label="教师名字" align="center" prop="teacherName" />
            <el-table-column label="手机号" align="center" prop="teacherPhone" />
            <el-table-column label="教师岗位" align="center" prop="teacherPosition" />
            <el-table-column label="所属院系" align="center" prop="teacherDepartments"/>
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

    </div>
</template>

<script>
    import { listTeacher } from "@/api/teacher";

    export default {
        name: "TeacherContact",
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

            /** 搜索按钮操作 */
            handleQuery() {
                this.getList();
            },
            /** 重置按钮操作 */
            resetQuery() {
                this.fuzzy=''
                this.handleQuery();
            },
            handleSizeChange(val){
                this.pageSize = val;
                this.getList()
            },

        }
    };
</script>