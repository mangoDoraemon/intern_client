<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
            <el-form-item label="实习企业" prop="companyName">
                <el-input
                        v-model="queryParams.companyName"
                        placeholder="请输入实习企业"
                        clearable
                        size="small"
                        @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item label="邮编" prop="postalCode">
                <el-input
                        v-model="queryParams.postalCode"
                        placeholder="请输入实习地邮编"
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
                        type="success"
                        icon="el-icon-edit"
                        size="mini"
                        :disabled="single"
                        @click="handleUpdate"
                >修改</el-button>
            </el-col>
        </el-row>

        <el-table v-loading="loading" :data="dataList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="姓名" align="center" prop="studentName" />
            <el-table-column label="学号" align="center" prop="studentNumber" />
            <el-table-column label="实习企业" align="center" prop="companyName" />
            <el-table-column label="实习地邮编" align="center" prop="postalCode" />
            <el-table-column label="实习地址" align="center" prop="internshipAddress" />
            <el-table-column label="实习工资" align="center" prop="internshipWage" />
            <el-table-column label="实习开始时间" align="center" prop="internshipStartTime" />
            <el-table-column label="实习结束时间" align="center" prop="internshipEndTime" />
            <el-table-column label="实习信息状态" align="center" prop="stateName" />
            <el-table-column label="备注" align="center" prop="remark" />
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button
                        v-if="roleName==='user' && scope.row.state !=='1111'"
                        size="mini"
                        type="text"
                        icon="el-icon-edit"
                        @click="handleUpdate(scope.row)"
                >修改</el-button>
                    <el-button
                            size="mini"
                            type="text"
                            icon="el-icon-edit"
                            v-if="roleName==='teacher' && scope.row.state ==='0000'"
                            @click="handlePass(scope.row)"
                    >审批</el-button>

                    <el-button
                            size="mini"
                            type="text"
                            icon="el-icon-edit"
                            v-if="roleName==='teacher' && scope.row.state ==='0000'"
                            @click="handleBack(scope.row)"
                    >驳回</el-button>

                    <el-button
                            size="mini"
                            type="text"
                            icon="el-icon-edit"
                            v-if="roleName==='user' && scope.row.state ==='1111'"
                            @click="handleStop(scope.row)"
                    >停用</el-button>

                    <el-tag type="success" v-if=" scope.row.state ==='1111'">实习信息审核通过</el-tag>
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

        <!-- 修改信息对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="700px">
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="实习单位" prop="companyName">
                    <el-input v-model="form.companyName" placeholder="请输入岗位编码" />
                </el-form-item>
                <el-form-item label="实习日期" prop="dateRangeSelection">
                    <el-date-picker type="daterange" v-model="form.dateRangeSelection"
                                    value-format="yyyy-MM-dd" :style="{width: '100%'}" start-placeholder="开始日期"
                                    end-placeholder="结束日期" range-separator="至" clearable @input="timeChange">

                    </el-date-picker>
                </el-form-item>
                <el-form-item label="实习开户行" prop="bankName">
                    <el-input v-model="form.bankName" placeholder="请输入实习开户行" clearable :style="{width: '100%'}">
                    </el-input>
                </el-form-item>
                <el-form-item label="实习地址" prop="internshipAddress">
                    <el-input v-model="form.internshipAddress" placeholder="请输入实习地址" clearable :style="{width: '100%'}">
                    </el-input>
                </el-form-item>

                <el-form-item label="实习地邮编" prop="postalCode">
                    <el-input v-model="form.postalCode" placeholder="请输入实习地邮编" clearable :style="{width: '100%'}">
                    </el-input>
                </el-form-item>

                <el-form-item label="银行账号" prop="bankAccount">
                    <el-input v-model="form.bankAccount" placeholder="请输入银行账号" clearable :style="{width: '100%'}">
                    </el-input>
                </el-form-item>

                <el-form-item label="实习工资" prop="internshipWage">
                    <el-input v-model="form.internshipWage" placeholder="请输入实习工资" clearable :style="{width: '100%'}">
                    </el-input>
                </el-form-item>

                <el-form-item label="备注" prop="remark">
                    <el-input v-model="form.remark" type="textarea" placeholder="请输入备注"
                              :autosize="{minRows: 4, maxRows: 4}" :style="{width: '100%'}"></el-input>
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

    import {getDataInfoById, listDataInfo, updateDataInfo, updateDataInfoById} from "../../api/internShip";

    export default {
        name: "InternShipInfo",
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
                // 表格数据
                dataList: [],
                // 弹出层标题
                title: "",
                // 是否显示弹出层
                open: false,
                // 查询参数
                queryParams: {
                    page: 1,
                    pageSize: 10,
                    postalCode: '',
                    companyName: '',
                    teacherNumber: '',
                    studentNumber: ' ',
                },
                // 表单参数
                form: {},
                roleName:'',
                // 表单校验
                rules: {
                    dateRangeSelection: [{
                        required: true,
                        message: '实习日期不能为空',
                        trigger: 'change'
                    }],
                    bankName: [{
                        required: true,
                        message: '请输入实习开户行',
                        trigger: 'blur'
                    }],
                    internshipAddress: [{
                        required: true,
                        message: '请输入实习地址',
                        trigger: 'blur'
                    }],
                    postalCode: [{
                        required: true,
                        message: '请输入实习地邮编',
                        trigger: 'blur'
                    }],
                    bankAccount: [{
                        required: true,
                        message: '请输入银行账号',
                        trigger: 'blur'
                    }],
                    internshipWage: [{
                        required: true,
                        message: '请输入实习工资',
                        trigger: 'blur'
                    }],
                    remark: [{
                        required: true,
                        message: '请输入备注',
                        trigger: 'blur'
                    }],
                }
            };
        },
        created() {
            this.queryParams.teacherNumber=this.$store.getters.teacherNumber
            this.queryParams.studentNumber=this.$store.getters.studentNumber
            this.roleName=this.$store.getters.roleName
            debugger
            this.getList();
        },
        methods: {
            /** 查询岗位信息列表 */
            getList() {
                this.loading = true;
                listDataInfo(this.queryParams).then(response => {
                    this.dataList = response.data.list;
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
                this.queryParams.pageNum = 1;
                this.getList();
            },
            /** 重置按钮操作 */
            resetQuery() {
                this.queryParams.companyName=''
                this.queryParams.postalCode=''
                this.handleQuery();
            },
            // 多选框选中数据
            handleSelectionChange(selection) {
                this.ids = selection.map(item => item.id)
                this.single = selection.length!=1
                this.multiple = !selection.length
            },
            /** 修改按钮操作 */
            handleUpdate(row) {
                this.reset();
                const id = row.id || this.ids
                getDataInfoById(id).then(response => {
                    this.form = response.data.internshipInfo;
                    this.$set(this.form, "dateRangeSelection", [this.form.internshipStartTime,
                        this.form.internshipEndTime]);
                });

                this.open = true;
                this.title = "修改实习信息";
            },
            /** 提交按钮 */
            submitForm: function() {
                this.$refs["form"].validate(valid => {
                    if (valid) {
                        let data = this.form.dateRangeSelection;
                        this.form.internshipStartTime=data[0];
                        this.form.internshipEndTime=data[1];
                        updateDataInfo(this.form).then(response => {
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

                    }else {
                        return
                    }
                });
            },
            handlePass(row){
                const id = row.id || this.ids;
                const updateType='PASS'
                this.$confirm('确认要通过审核此实习信息吗', "警告", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(function() {
                    return updateDataInfoById(id,updateType);
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
            handleBack(row){
                const id = row.id || this.ids;
                const updateType='BACK'
                this.$confirm('确认要驳回实习信息吗', "警告", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(function() {
                    return updateDataInfoById(id,updateType);
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
            handleStop(row){
                const id = row.id || this.ids;
                const updateType='STOP'
                this.$confirm('确认要停用此实习信息吗', "警告", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(function() {
                    return updateDataInfoById(id,updateType);
                }).then((res) => {
                    this.$message({
                        message: res.data.msg,
                        type: res.data.level
                    });
                    if(res.data.code==='200'){
                        this.getList();
                    }
                }).catch(function() {});            },
            handleSizeChange(val){
                this.queryParams.pageSize = val;
                this.getList()
            },
            timeChange(e) {
                if(e){
                    this.$nextTick(() => {
                        this.form.dateRangeSelection = null;
                        this.$set(this.form, "dateRangeSelection", [e[0], e[1]]);
                    });
                }

            },

        }
    };
</script>