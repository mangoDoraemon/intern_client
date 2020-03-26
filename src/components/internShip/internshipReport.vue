<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
            <el-form-item label="报告题目" prop="postCode">
                <el-input
                        v-model="queryParams.reportName"
                        placeholder="请输入报告题目"
                        clearable
                        size="small"
                        @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item label="报告日期" prop="postName" label-width="70px">
                <el-date-picker v-model="queryParams.reportDate" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                                 placeholder="请选择日期选择" clearable></el-date-picker>
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
            <el-col :span="1.5">
                <el-button
                        type="danger"
                        icon="el-icon-delete"
                        size="mini"
                        :disabled="multiple"
                        @click="handleDelete"
                >删除</el-button>
            </el-col>

            <el-col :span="1.5">
                <el-button
                        type="warning"
                        icon="el-icon-download"
                        size="mini"
                        @click="handleExport"
                >导出</el-button>
            </el-col>
        </el-row>

        <el-table v-loading="loading" :data="reportList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center" :selectable="selectable" />
            <el-table-column label="报告题目" align="center" prop="reportName" />
            <el-table-column label="报告内容" align="center" prop="reportContent" />
            <el-table-column label="实习单位" align="center" prop="companyName" />
            <el-table-column label="报告人" align="center" prop="studentName" />
            <el-table-column label="报告日期" align="center" prop="reportDate" />
            <el-table-column label="状态" align="center" prop="stateName" />
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button
                            v-if="roleName==='user' && scope.row.reportState !='1111'"
                            size="mini"
                            type="text"
                            icon="el-icon-edit"
                            @click="handleUpdate(scope.row)"
                    >修改</el-button>
                    <el-button
                            v-if="roleName==='user' && scope.row.reportState !='1111'"
                            size="mini"
                            type="text"
                            icon="el-icon-delete"
                            @click="handleDelete(scope.row)"
                    >删除</el-button>
                    <el-button
                            v-if="roleName==='teacher' && scope.row.reportState !='1111'"
                            size="mini"
                            type="text"
                            icon="el-icon-edit"
                            @click="handlePass(scope.row)"
                    >审批</el-button>
                    <el-button
                            v-if="roleName==='teacher' && scope.row.reportState ==='0000'"
                            size="mini"
                            type="text"
                            icon="el-icon-edit"
                            @click="beforeHandleStop(scope.row)"
                    >驳回</el-button>

                    <el-tag type="success" v-if=" scope.row.reportState ==='1111'">审核通过</el-tag>
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

        <el-dialog title="填写驳回原因" :visible.sync="dismissOpen" width="600px">
            <el-form ref="dismissForm" :model="form" :rules="rules1" label-width="80px">
                <el-form-item label="驳回原因" prop="dismissReason" >
                    <el-input v-model="form.dismissReason" type="textarea" placeholder="请输入驳回原因"
                              :autosize="{minRows: 4, maxRows: 4}" :style="{width: '100%'}"></el-input>
                </el-form-item>
            </el-form>


            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="handleStop">提交</el-button>
                <el-button @click="cancelHandleStop">取 消</el-button>
            </div>
        </el-dialog>
        <!-- 修改信息对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="1000px">
            <el-form ref="form" :model="formData" :rules="rules" label-width="150px">
                <el-form-item label="选择对应实习信息" prop="internshipId">
                    <el-select v-model="formData.internshipId" placeholder="请选择" clearable :style="{width: '50%',height:'30%'}" >
                        <el-option v-for="(item, index) in options" :key="index" :label="item.companyName"
                                   :value="item.id" :disabled="item.disabled"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="报告日期" prop="reportDate">
                    <el-date-picker v-model="formData.reportDate" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                                    :style="{width: '50%'}" placeholder="请选择日期选择" clearable></el-date-picker>
                </el-form-item>
                <el-form-item label="报告标题" prop="reportName">
                    <el-input v-model="formData.reportName" placeholder="请输入报告标题" clearable :style="{width: '50%'}">
                    </el-input>
                </el-form-item>
                <el-form-item  label="报告内容" prop="reportContent">
                    <mavon-editor
                            v-model="formData.reportContent"
                            :toolbars="toolbars"
                            class="blogcontent"
                            ref="md"
                    />
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

    import {
        exportReport,
        getReportInfoById,
        listReportInfo,
        removeReportInfo,
        updateInfoById,
        updateReportInfo
    } from "../../api/report";
    import {getDataInfoByIdAndNumber} from "../../api/internShip";

    export default {
        name: "internShipReport",
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
                // 岗位信息表格数据
                reportList: [],
                options:[],
                // 弹出层标题
                title: "",
                // 是否显示弹出层
                open: false,
                // 查询参数
                queryParams: {
                    page: 1,
                    pageSize: 10,
                    studentNumber: '',
                    teacherNumber: '',
                    reportName: '',
                    reportDate: '',
                },
                // 表单参数
                formData: {},
                roleName:'',
                id:'',
                toolbars: {
                    bold: true, // 粗体
                    italic: true, // 斜体
                    header: true, // 标题
                    underline: true, // 下划线
                    mark: true, // 标记
                    superscript: true, // 上角标
                    quote: true, // 引用
                    ol: true, // 有序列表
                    link: true, // 链接
                    imagelink: true, // 图片链接
                    help: true, // 帮助
                    code: true, // code
                    subfield: true, // 是否需要分栏
                    fullscreen: true, // 全屏编辑
                    readmodel: true, // 沉浸式阅读
                    undo: true, // 上一步
                    trash: true, // 清空
                    save: true, // 保存（触发events中的save事件）
                    htmlcode: true, // 展示html源码
                    navigation: true // 导航目录
                },
                dismissOpen:false,
                form:{
                    dismissReason:'',
                },

                // 表单校验
                rules1:{
                    dismissReason: [{
                        required: true,
                        message: '请填写驳回原因',
                        trigger: 'blur'
                    }],
                },
                rules: {
                    reportDate: [{
                        required: true,
                        message: '请选择报告日期',
                        trigger: 'change'
                    }],
                    internshipId: [{
                        required: true,
                        message: '请选择对应的实习信息',
                        trigger: 'change'
                    }],
                    reportName: [{
                        required: true,
                        message: '请输入报告标题',
                        trigger: 'blur'
                    }],
                }
            };
        },
        created() {
            this.queryParams.teacherNumber=this.$store.getters.teacherNumber
            this.queryParams.studentNumber=this.$store.getters.studentNumber
            this.roleName=this.$store.getters.roleName
            if( this.$store.getters.studentNumber){
                getDataInfoByIdAndNumber(this.$store.getters.studentNumber).then(response => {
                    this.options = response.data.listInternShip;
                });
            }
            this.getList();
        },
        methods: {
            /** 查询岗位信息列表 */
            getList() {
                this.loading = true;
                listReportInfo(this.queryParams).then(response => {
                    this.reportList = response.data.list;
                    this.total = response.data.total;
                    this.loading = false;
                });
            },
            cancelHandleStop(){
                this.dismissOpen=false;
                this.id='';
            },
            handlePass(row){
                const changeType='PASS'
                this.$confirm('是否确认审核通过该实习报告?', "警告", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(()=>{
                    updateInfoById(row.id,changeType,this.dismissReason).then(response =>{
                        if (response.data.code === '200') {
                            this.$message({
                                message: response.data.msg,
                                type: response.data.level
                            });
                            this.getList();
                        }
                    })
                })

            },
            beforeHandleStop(row){
             this.id=row.id;
             this.dismissOpen=true;
            },
            handleStop(){
                this.$refs["dismissForm"].validate(valid => {
                    if (valid) {

                        const changeType='STOP'
                        this.$confirm('是否确认驳回该实习报告?', "警告", {
                            confirmButtonText: "确定",
                            cancelButtonText: "取消",
                            type: "warning"
                        }).then(()=>{
                            updateInfoById(this.id,changeType,this.form.dismissReason).then(response =>{
                                if (response.data.code === '200') {
                                    this.$message({
                                        message: response.data.msg,
                                        type: response.data.level
                                    });
                                    this.dismissOpen=false;
                                    this.getList();
                                }
                            })
                        })
                    }
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
                this.queryParams.page = 1;
                this.getList();
            },
            /** 重置按钮操作 */
            resetQuery() {
                this.queryParams.reportName=''
                this.queryParams.reportDate=''
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
                this.open = true;
                this.title = "添加岗位信息";
            },
            /** 修改按钮操作 */
            handleUpdate(row) {
                this.reset();
                const id = row.id || this.ids
                getReportInfoById(id).then(response => {
                    this.formData = response.data.reportInfo;
                    this.open = true;
                    this.title = "修改实习报告信息";
                });
            },
            /** 提交按钮 */
            submitForm: function() {
                this.$refs["form"].validate(valid => {
                    if (valid) {
                            updateReportInfo(this.formData).then(response => {
                                if (response.data.code === '200') {
                                    this.$message({
                                        message: response.data.msg,
                                        type: response.data.level
                                    });
                                    this.open = false;
                                    this.getList();
                                }
                            });

                    }
                });
            },
            handleSizeChange(val){
                this.queryParams.pageSize = val;
                this.getList()
            },
            /** 删除按钮操作 */
            handleDelete(row) {
                const id = row.id || this.ids;
                this.$confirm('是否确认删除选中的数据项?', "警告", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(function() {
                    return removeReportInfo(id);
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
            selectable(row){
               if(row.reportState ==='1111'){
                   return false
               }else {
                   return true
               }
            },

            /** 导出按钮操作 */
            handleExport() {
                const queryParams = this.queryParams;
                this.$confirm('是否确认导出所有字典类型数据项?', "警告", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(function() {
                    return exportReport(queryParams);
                }).then(response => {

                    this.download(response.data.msg);
                }).catch(function() {});
            }

        }
    };
</script>