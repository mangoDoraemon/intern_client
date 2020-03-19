<template>
    <div>
        <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
            <el-row gutter="10">
                <el-col :span="9":offset="3">
                    <el-form-item label="下拉选择" prop="field108">
                        <el-select v-model="formData.field108" placeholder="请选择下拉选择" clearable :style="{width: '50%',height:'30%'}">
                            <el-option v-for="(item, index) in field108Options" :key="index" :label="item.label"
                                       :value="item.value" :disabled="item.disabled"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="9">
                    <el-form-item label="日期选择" prop="field109">
                        <el-date-picker v-model="formData.field109" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                                        :style="{width: '50%'}" placeholder="请选择日期选择" clearable></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="10":offset="3">
                    <el-form-item label="单行文本" prop="field107">
                        <el-input v-model="formData.field107" placeholder="请输入单行文本" clearable :style="{width: '50%'}">
                        </el-input>
                    </el-form-item>
                </el-col>

            </el-row>
            <div style="width: 1000px;margin-left: 200px;margin-top: 20px">
                <el-form-item  label="报告内容" prop="noticeContent">
                    <mavon-editor
                            v-model="formData.field107"
                            :toolbars="toolbars"
                            class="blogcontent"
                            ref="md"
                            @change="changeHtml"
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
    export default {
        components: {},
        props: [],
        data() {
            return {
                formData: {
                    field109: null,
                    field108: undefined,
                    field107: undefined,
                },                toolbars: {
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
                    field109: [{
                        required: true,
                        message: '请选择日期选择',
                        trigger: 'change'
                    }],
                    field108: [{
                        required: true,
                        message: '请选择下拉选择',
                        trigger: 'change'
                    }],
                    field107: [{
                        required: true,
                        message: '请输入单行文本',
                        trigger: 'blur'
                    }],
                },
                field108Options: [{
                    "label": "选项一",
                    "value": 1
                }, {
                    "label": "选项二",
                    "value": 2
                }],
            }
        },
        computed: {

        },
        watch: {

        },
        created() {

        },
        mounted() {

        },
        methods: {
            submitForm() {
                this.$refs['elForm'].validate(valid => {
                    if (!valid) return
                    // TODO 提交表单
                })
            },
            resetForm() {
                this.$refs['elForm'].resetFields()
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