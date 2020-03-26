<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
            <el-form-item label="记录标题" prop="gTitle">
                <el-input
                        v-model="queryParams.gTitle"
                        placeholder="请输入记录标题"
                        clearable
                        size="small"
                        @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item label="指导记录日期" prop="postName" label-width="90px">
                <el-date-picker v-model="queryParams.gDate" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
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

        <el-table v-loading="loading" :data="guidList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="指导记录标题" align="center" prop="gTitle" />
            <el-table-column label="指导记录内容" align="center" prop="gContent" />
            <el-table-column label="填写日期" align="center" prop="gDate" />
            <el-table-column label="指导相关学生" align="center" prop="gStudentName" />
            <el-table-column label="指导教师" align="center" prop="gTeacherName" />
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

        <!-- 添加或修改信息对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="900px">
            <el-form ref="form" :model="form" :rules="rules" label-width="110px">
                <el-form-item label="指导记录标题" prop="gTitle">
                    <el-input v-model="form.gTitle" placeholder="请输入指导记录标题" />
                </el-form-item>
                <el-form-item label="填写日期" prop="gDate">
                    <el-date-picker v-model="form.gDate" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                                     placeholder="请选择日期选择" clearable></el-date-picker>
                </el-form-item>
                <el-form-item label="指导学生："  prop="studentIdCheck">
                    <el-select v-model="form.studentIdList" multiple filterable placeholder="请选择" :popper-append-to-body="false">
                        <el-option
                                v-for="item in studentInfoOptions"
                                :key="item.studentNumber"
                                :label="'('+item.studentNumber+')'+item.studentName"
                                :value="item.studentNumber"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item  label="指导记录内容" prop="gContent">
                    <mavon-editor
                            v-model="form.gContent"
                            :toolbars="toolbars"
                            class="blogcontent"
                            ref="md"
                    />
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="form.remark" type="textarea" placeholder="请输入备注"
                              :autosize="{minRows: 4, maxRows: 4}"></el-input>
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

    import {fetchDataInfo, createData, getDataInfoById, updateDataInfo, removeDataInfo} from "../../api/guid";
    import {fetchStudentByTeacherNumber} from "../../api/common";

    export default {
        name: "GuidInfo",
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
                guidList: [],
                // 弹出层标题
                title: "",
                // 是否显示弹出层
                open: false,
                studentInfoOptions:[],
                // 查询参数
                queryParams: {
                    page: 1,
                    pageSize: 10,
                    gTitle:'',
                    gDate:''
                },
                // 表单参数
                form: {},
                isAdd:true,
                //工具栏
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
                // 表单校验
                rules: {
                    gTitle: [
                        { required: true, message: "指导记录标题不能为空", trigger: "blur" }
                    ],
                    gDate: [
                        { required: true, message: "填写日期不能为空", trigger: "blur" }
                    ],
                    gContent: [
                        { required: true, message: "指导记录内容不能为空", trigger: "blur" }
                    ],
                    studentIdCheck:[
                        {validator:this.studentIdIsNull, trigger: 'blur'},
                    ],
                }
            };
        },
        created() {
            this.getList();
            this.initData();
        },
        methods: {
            /** 表单验证 */
            studentIdIsNull(rules, value, callback){
                if (this.form.studentIdList.length === 0) {
                    callback(new Error("请选择指导学生信息"))
                } else {
                    callback()
                }
            },
            /** 初始化数据 */
            initData(){
                fetchStudentByTeacherNumber().then(res => {
                    this.studentInfoOptions=res.data;
                })
            },
            /** 查询列表 */
            getList() {
                this.loading = true;
                fetchDataInfo(this.queryParams).then(response => {
                    this.guidList = response.data.list;
                    this.total = response.data.total;
                    this.loading = false;
                });
            },
            // 取消按钮
            cancel() {
                this.open = false;
                this.reset();
            },
            //分页查询
            handleSizeChange(val){
                this.queryParams.pageSize = val;
                this.getList()
            },
            // 表单重置
            reset() {
                this.form = {
                };
            },
            /** 搜索按钮操作 */
            handleQuery() {
                this.queryParams.page = 1;
                this.queryParams.gDate='';
                this.queryParams.gTitle='';
                this.getList();
            },
            /** 重置按钮操作 */
            resetQuery() {
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
                this.isAdd = true;
                this.title = "添加实现指导记录";
            },
            /** 修改按钮操作 */
            handleUpdate(row) {
                this.reset();
                this.isAdd=false;
                const id = row.id || this.ids
                getDataInfoById(id).then(response => {
                    this.form = response.data.guidInfo;
                    this.open = true;
                    this.title = "修改指导记录信息";
                });
            },
            /** 提交按钮 */
            submitForm: function() {
                this.$refs["form"].validate(valid => {
                    if (valid) {
                        if (this.isAdd) {
                            if(this.form.studentIdList){
                              this.form.studentId=this.form.studentIdList.join(",")
                            }
                            createData(this.form).then(response => {
                                if (response.data.code === '200') {
                                    this.$message({
                                        message: response.data.msg,
                                        type: response.data.level
                                    });
                                    this.open = false;
                                    this.getList();
                                } else {
                                    this.$message({
                                        message: response.data.msg,
                                        type: response.data.level
                                    });
                                }
                            });
                        } else {
                            if(this.form.studentIdList){
                                this.form.studentId=this.form.studentIdList.join(",")
                            }
                            updateDataInfo(this.form).then(response => {
                                if (response.data.code === '200') {
                                    this.$message({
                                        message: response.data.msg,
                                        type: response.data.level
                                    });
                                    this.open = false;
                                    this.getList();
                                } else {
                                    this.$message({
                                        message: response.data.msg,
                                        type: response.data.level
                                    });
                                }
                            });
                        }
                    }
                });
            },
            /** 删除按钮操作 */
            handleDelete(row) {
                const id = row.id || this.ids;
                this.$confirm('是否确认删除选中的数据项?', "警告", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(function() {
                    return removeDataInfo(id);
                }).then((response) => {
                    if (response.data.code === '200') {
                        this.$message({
                            message: response.data.msg,
                            type: response.data.level
                        });
                        this.getList();
                    }else {
                        this.$message({
                            message: response.data.msg,
                            type: response.data.level
                        });
                    }
                }).catch(function() {});
            },
        }
    };
</script>
<style scoped>
    .blogcontent {
        height: 400px;
        margin-top: 20px;
        margin-bottom: 20px;
    }
</style>