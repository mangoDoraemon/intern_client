<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
            <el-form-item label="公告搜索" prop="noticeTitle">
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

        <el-table v-loading="loading" :data="noticeList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center" />

            <el-table-column label="公告标题" align="center" prop="noticeTitle" />
            <el-table-column label="公告类型" align="center" prop="noticeTypeName" />
            <el-table-column label="公告内容" align="center" prop="noticeContent" show-overflow-tooltip/>
            <el-table-column label="公告状态" align="center" prop="statusName" />
            <el-table-column label="发布人" align="center" prop="manageUser" />
            <el-table-column label="创建时间" align="center" prop="manageDate" >
                <template slot-scope="scope">
                    {{scope.row.manageDate | formatDate('yyyy-MM-dd')}}
                </template>
            </el-table-column>
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

        <!-- 添加或修改通知公告对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="900px">
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="公告标题" prop="noticeTitle">
                    <el-input v-model="form.noticeTitle" placeholder="请输入公告标题" />
                </el-form-item>
                <el-form-item label="公告类型">
                    <el-select v-model="form.noticeType" placeholder="请选择公告类型">
                        <el-option
                                v-for="item in noticeTypeOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item  label="公告内容" prop="noticeContent">
<!--                    <quill-editor :editorOption="editorOption"></quill-editor>-->
                    <mavon-editor
                            v-model="form.noticeContent"
                            :toolbars="toolbars"
                            class="blogcontent"
                            ref="md"
                            @change="changeHtml"
                    />
                </el-form-item>
                <el-form-item label="公告状态">
                    <el-radio-group v-model="form.status">
                        <el-radio label="1">正常</el-radio>
                        <el-radio label="2">关闭</el-radio>
                    </el-radio-group>
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
    import { listNotice, getNotice, delNotice, addNotice, updateNotice} from "../../api/notice";
    export default {
        name: "Notice",
        data() {

            return {
                //存储html格式数据
                html:'',
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
                // 通知公告表格数据
                noticeList: [],
                currentPage: 1,
                fuzzy: '',
                pageSize: 10,
                // 弹出层标题
                title: "",
                // 是否显示弹出层
                open: false,
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
                queryParams: {
                    pageNum: 1,
                    pageSize: 10,
                    noticeTitle: undefined,
                    noticeType: undefined,
                    noticeContent: undefined,
                    status: undefined,
                },
                // 表单参数
                form: {
                    id:'',
                    noticeTitle:'',
                    noticeType:'',
                    noticeContent:'',
                    status:'',
                    companyNumber:'',
                    teacherNumber:'',
                    roleName:'',
                    name:''
                },
                // 表单校验
                rules: {
                    noticeTitle: [
                        { required: true, message: "公告标题不能为空", trigger: "blur" }
                    ],
                    noticeType: [
                        { required: true, message: "公告类型（1通知 2公告）不能为空", trigger: "blur" }
                    ],
                },
                //存储字典值
                noticeTypeOptions:[{
                    value: '0001',
                    label: '通知'
                }, {
                    value: '0002',
                    label: '公告'
                }],
                isAdd:false,
            };
        },
        created() {
            this.initData();
            this.getList();

        },
        methods: {
            //初始化数据
            initData(){
                if(this.$store.getters.teacherNumber){
                    this.form.teacherNumber=this.$store.getters.teacherNumber
                }
                if(this.$store.getters.companyNumber){
                    this.form.companyNumber=this.$store.getters.companyNumber
                }
                if(this.$store.getters.roleName){
                    this.form.roleName=this.$store.getters.roleName
                }
                if(this.$store.getters.name){
                    this.form.name=this.$store.getters.name
                }

                listNotice({}).then(response => {
                    this.noticeList = response.data.list;
                    this.total = response.data.total;
                    this.loading = false;
                });
            },
            /** 查询通知公告列表 */
            getList() {
                this.loading = true;
                let data = {
                    'fuzzy': this.fuzzy,
                    'page': this.currentPage,
                    'pageSize': this.pageSize,
                    'teacherNumber':this.form.teacherNumber,
                    'companyNumber':this.form.companyNumber,
                    'roleName':this.form.roleName
                }
                listNotice(data).then(response => {
                    this.noticeList = response.data.list;
                    this.total = response.data.total;
                    this.loading = false;
                });
            },
            handleSizeChange(val){
                this.pageSize = val;
                this.getList()
            },
            changeHtml(value, render){
              this.html =render;
            },
            // 取消按钮
            cancel() {
                this.open = false;
                this.reset();
            },
            // 表单重置
            reset() {
                this.form = {
                    noticeId: undefined,
                    noticeTitle: undefined,
                    noticeType: undefined,
                    noticeContent: undefined,
                    status: "0",
                    createBy: undefined,
                    createTime: undefined,
                    updateBy: undefined,
                    updateTime: undefined,
                    remark: undefined
                };
                this.resetForm("form");
            },
            /** 搜索按钮操作 */
            handleQuery() {
                this.getList();
            },
            /** 重置按钮操作 */
            resetQuery() {
                this.fuzzy='',
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
                //this.reset();
                this.open = true;
                this.isAdd = true;
                this.title = "添加通知公告";
            },
            /** 修改按钮操作 */
            handleUpdate(row) {
                //this.reset();
                this.isAdd = false;
                const noticeId = row.id || this.ids
                getNotice(noticeId).then(response => {
                    this.form = response.data.noticeInfo;
                    this.open = true;
                    this.title = "修改通知公告";
                });
            },
            /** 提交按钮 */
            submitForm: function() {
                this.$refs["form"].validate(valid => {
                    if (valid) {
                    if (this.isAdd) {

                        addNotice(this.form).then(response => {
                            if (response.data.code === '200') {
                                this.$message({
                                    message: response.data.msg,
                                    type: response.data.level
                                });
                                this.open = false;
                                this.getList();
                            } else {
                                this.msgError(response.msg);
                            }
                        });
                        } else {
                        updateNotice(this.form).then(response => {
                            if (response.data.code === '200') {
                                this.$message({
                                    message: response.data.msg,
                                    type: response.data.level
                                });
                                this.open = false;
                                this.getList();
                            } else {
                                this.msgError(response.msg);
                            }
                        });
                        }
                    }
                });
            },
            /** 删除按钮操作 */
            handleDelete(row) {
                const noticeIds = row.id || this.ids;
                this.$confirm('是否确认删除通知公告编号为"' + noticeIds + '"的数据项?', "警告", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(function() {
                    return delNotice(noticeIds);
                }).then((res) => {
                    this.getList();
                    this.$message({
                        message: res.data.msg,
                        type: res.data.level
                    });
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
    span {
        margin-right: 5px;
        cursor: pointer;
    }
</style>