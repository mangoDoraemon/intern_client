<template>
    <div>
        <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="150px">
            <el-row gutter="10">
                <el-col :span="9" :offset="3">
                    <el-form-item label="选择对应实习信息" prop="internshipId">
                        <el-select v-model="formData.internshipId" placeholder="请选择" clearable :style="{width: '50%',height:'30%'}" >
                            <el-option v-for="(item, index) in options" :key="index" :label="item.companyName"
                                       :value="item.id" :disabled="item.disabled"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="9">
                    <el-form-item label="报告日期" prop="reportDate">
                        <el-date-picker v-model="formData.reportDate" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                                        :style="{width: '50%'}" placeholder="请选择日期选择" clearable></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="10" :offset="3">
                    <el-form-item label="报告标题" prop="reportName">
                        <el-input v-model="formData.reportName" placeholder="请输入报告标题" clearable :style="{width: '50%'}">
                        </el-input>
                    </el-form-item>
                </el-col>

            </el-row>
            <div style="width: 1000px;margin-left: 200px;margin-top: 20px">
                <el-form-item  label="报告内容" prop="reportContent">
                    <mavon-editor
                            v-model="formData.reportContent"
                            :toolbars="toolbars"
                            class="blogcontent"
                            ref="md"
                    />
                </el-form-item>
            </div>


            <div style="margin-left: 500px">
            <el-form-item size="large" >
                <el-button type="primary" @click="submitForm">提交</el-button>
                <el-button @click="resetForm" style="margin-left: 150px">重置</el-button>
            </el-form-item>
            </div>
        </el-form>
    </div>
</template>
<script>
    import {getDataInfoByIdAndNumber} from "../../api/internShip";
    import {createReport} from "../../api/report";

    export default {
        components: {},
        props: [],
        data() {
            return {
                studentNumber:'',
                options:[],
                formData: {
                    internshipId: '',
                    reportName: '',
                    reportDate:'',
                    reportContent:'',
                    studentNumber: '',
                },
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
                },
            }
        },
        computed: {

        },
        watch: {

        },
        created() {
         this.initData();
        },
        mounted() {

        },
        methods: {
            initData(){
                this.studentNumber=this.$store.getters.studentNumber
                this.formData.studentNumber=this.$store.getters.studentNumber
                if( this.studentNumber){
                    getDataInfoByIdAndNumber(this.studentNumber).then(response => {
                        this.options = response.data.listInternShip;
                    });
                }
            },
            submitForm() {
                this.$refs['elForm'].validate(valid => {
                    if (!valid) {
                        return
                    }else {
                        createReport(this.formData).then(response => {
                            if (response.data.code === '200') {
                                this.$message({
                                    message: response.data.msg,
                                    type: response.data.level
                                });
                                this.$store.dispatch('user/getInfo');
                                this.$router.push('/internshipReport');
                            }else {
                                this.$message({
                                    message: response.data.msg,
                                    type: response.data.level
                                });
                            }
                        })
                    }
                })
            },
            resetForm() {
                this.formData= {
                        internshipId: '',
                        reportName: '',
                        reportDate:'',
                        reportContent:''
                }
            },
        }
    }

</script>

<style scoped>
    .blogcontent {
        height: 420px;
        margin-top: 20px;
        margin-bottom: 20px;
    }
    span {
        margin-right: 5px;
        cursor: pointer;
    }
</style>