<template>
<div class="total">
    <div class="one">
        <el-alert
                v-if="this.$store.getters.yesOrNo === 'NO'"
                title="您没有待办的处理事项哦~~~"
                type="success"
                description="您的工作做得很棒，请继续加油"
                show-icon>
        </el-alert>

        <el-alert
                v-if="this.$store.getters.yesOrNo === 'YES'"
                title="您有待办的处理事项，请及时处理！！！"
                type="warning"
                description="不要偷懒哦~~~"
                show-icon>
        </el-alert>
    </div>



<div class="two">
    <el-divider>待处理事项</el-divider>
        <el-table
                :data="tableData"
                border
                style="width: 100%">
            <el-table-column
                    prop="dealDate"
                    label="待办事项日期"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="dealName"
                    label="待办事项名称"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="reportName"
                    label="待处理人">
            </el-table-column>
            <el-table-column
                    prop="dealRemark"
                    label="事项说明">
            </el-table-column>
        </el-table>
</div>



</div>

</template>

<script>
    import {fetchDealInfo} from "../../api/common";

    export default {
        data() {
            return {
                tableData: []
            }
        },
        created() {
           this.getList()
        },
        methods:{
            getList(){
                fetchDealInfo().then(response =>{
                    this.tableData=response.data;
                })
            }
        }
    }
</script>

<style scoped>
.total{
    width: 1200px;
    margin-left: 200px;
}
.one{

}
.two{
   margin-top:50px;
}
</style>