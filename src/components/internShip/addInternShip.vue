<template>
    <div>
        <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
            <div>
                <el-divider content-position="center">实习生信息</el-divider>
            </div>
            <el-row :gutter="24" >
                <el-col :span="10" :offset="1">
                    <el-form-item label="实习生名字" prop="studentName">
                        <el-input v-model="formData.studentName" placeholder="请输入实习生名字" clearable :style="{width: '100%'}">
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="10" :offset="1">
                    <el-form-item label="实习生电话" prop="studentPhone">
                        <el-input v-model="formData.studentPhone" placeholder="请输入实习生电话" clearable :style="{width: '100%'}">
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="10" :offset="1">
                    <el-form-item label="实习生邮箱" prop="studentEmail">
                        <el-input v-model="formData.studentEmail" placeholder="请输入实习生邮箱" clearable :style="{width: '100%'}">
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="10" :offset="1">
                    <el-form-item label="实习生班级" prop="studentClass">
                        <el-input v-model="formData.studentClass" placeholder="请输入实习生班级" clearable :style="{width: '100%'}">
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <div>
                <el-divider content-position="center">实习生单位信息</el-divider>
            </div>
            <el-row :gutter="15">
                <el-col :span="10" :offset="1">
                    <el-form-item label="实习单位" prop="companyName">
                        <el-input v-model="formData.companyName" placeholder="请输入实习单位" clearable :style="{width: '100%'}">
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="10" :offset="1">
                    <el-form-item label="实习日期" prop="dateRangeSelection">
                        <el-date-picker type="daterange" v-model="formData.dateRangeSelection" format="yyyy-MM-dd"
                                        value-format="yyyy-MM-dd" :style="{width: '100%'}" start-placeholder="开始日期"
                                        end-placeholder="结束日期" range-separator="至" clearable @input="timeChange"></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="10" :offset="1">
                    <el-form-item label="实习开户行" prop="bankName">
                        <el-input v-model="formData.bankName" placeholder="请输入实习开户行" clearable :style="{width: '100%'}">
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="10" :offset="1">
                    <el-form-item label="实习地址" prop="internshipAddress">
                        <el-input v-model="formData.internshipAddress" placeholder="请输入实习地址" clearable :style="{width: '100%'}">
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="10" :offset="1">
                    <el-form-item label="实习地邮编" prop="postalCode">
                        <el-input v-model="formData.postalCode" placeholder="请输入实习地邮编" clearable :style="{width: '100%'}">
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="10" :offset="1">
                    <el-form-item label="银行账号" prop="bankAccount">
                        <el-input v-model="formData.bankAccount" placeholder="请输入银行账号" clearable :style="{width: '100%'}">
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="10" :offset="1">
                    <el-form-item label="实习工资" prop="internshipWage">
                        <el-input v-model="formData.internshipWage" placeholder="请输入实习工资" clearable :style="{width: '100%'}">
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="20" :offset="1">
                    <el-form-item label="备注" prop="remark">
                        <el-input v-model="formData.remark" type="textarea" placeholder="请输入备注"
                                  :autosize="{minRows: 4, maxRows: 4}" :style="{width: '100%'}"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item size="large" style="align-content: center">
                <el-button type="primary" @click="submitForm">提交</el-button>
                <el-button @click="resetForm">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
    import {getStudentInfoByNumber} from "../../api/student";
    import {addDataInfo} from "../../api/internShip";

    export default {
        components: {},
        props: [],
        data() {
            return {
                formData: {
                    studentNumber: '',
                    studentName: '',
                    studentPhone: '',
                    studentEmail: '',
                    studentClass: '',
                    companyName: '',
                    bankName: '',
                    internshipAddress: '',
                    postalCode: '',
                    bankAccount: '',
                    internshipWage: '',
                    remark: '',
                    internshipEndTime: '',
                    internshipStartTime:''
                },
                rules: {
                    studentName: [{
                        required: true,
                        message: '请输入实习生名字',
                        trigger: 'blur'
                    }],
                    studentPhone: [{
                        required: true,
                        message: '请输入实习生电话',
                        trigger: 'blur'
                    }],
                    studentEmail: [{
                        required: true,
                        message: '请输入实习生邮箱',
                        trigger: 'blur'
                    }],
                    studentClass: [{
                        required: true,
                        message: '请输入实习生班级',
                        trigger: 'blur'
                    }],
                    companyName: [{
                        required: true,
                        message: '请输入实习单位',
                        trigger: 'blur'
                    }],
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
                },
            }
        },
        computed: {

        },
        watch: {

        },
        created() {
            this.formData.studentNumber=this.$store.getters.studentNumber
            this.initData();
        },
        mounted() {

        },
        methods: {
            initData(){
                if(this.formData.studentNumber){
                    getStudentInfoByNumber(this.formData.studentNumber).then(response => {
                        let data=response.data.studentInfoByNumber;
                        this.formData.studentName = data.studentName
                        this.formData.studentClass = data.studentClass
                        this.formData.studentPhone = data.studentPhone
                        this.formData.studentEmail= data.studentEmail

                    });
                }

            },
            submitForm() {
                this.$refs['elForm'].validate(valid => {
                    if (!valid){
                        return
                    } else {
                        let data = this.formData.dateRangeSelection;
                        this.formData.internshipStartTime=data[0];
                        this.formData.internshipEndTime=data[1];
                        addDataInfo(this.formData).then( response=>{
                            if (response.data.code === "200") {
                                this.$message({
                                    message: response.data.msg,
                                    type: response.data.level
                                });
                                this.$router.push('/internShipInfo');
                            }else{
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
                    }
                })
            },
            resetForm() {
                this.$refs['elForm'].resetFields()
            },
            timeChange(e) {
                if(e){
                    this.$nextTick(() => {
                        this.formData.dateRangeSelection = null;
                        this.$set(this.formData, "dateRangeSelection", [e[0], e[1]]);
                    });
                }

            },
        }
    }

</script>
<style>
</style>
