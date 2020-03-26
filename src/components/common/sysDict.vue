
<!--<template>-->
<!--    <el-row :gutter="100">-->
<!--        <el-col :span="6" :offset="1">-->
<!--    <el-input-->
<!--            placeholder="输入关键字进行过滤"-->
<!--            v-model="filterText">-->
<!--    </el-input>-->

<!--    <el-tree-->
<!--            ref="tree"-->
<!--            class="expand-tree"-->
<!--            node-key="id"-->
<!--            highlight-current-->
<!--            :data="treeData"-->
<!--            :props="defaultProps"-->
<!--            default-expand-all-->
<!--            :expand-on-click-node="false"-->
<!--            :filter-node-method="filterNode"-->
<!--            @node-click="handleNodeClick"-->
<!--            ref="tree">-->
<!--    </el-tree>-->
<!--        </el-col>-->

<!--        <el-col :span="6" :offset="6">-->
<!--            <div>-->
<!--                <el-button></el-button>-->
<!--            </div>-->
<!--        </el-col>-->
<!--    </el-row>-->
<!--</template>-->


<!--<script>-->
<!--    export default {-->
<!--        watch: {-->
<!--            filterText(val) {-->
<!--                this.$refs.tree.filter(val);-->
<!--            }-->
<!--        },-->

<!--        methods: {-->
<!--            filterNode(value, data) {-->
<!--                if (!value) return true;-->
<!--                return data.label.indexOf(value) !== -1;-->
<!--            },-->
<!--            handleNodeClick(){-->

<!--            }-->
<!--        },-->

<!--        data() {-->
<!--            return {-->
<!--                filterText: '',-->
<!--                treeData:[],-->
<!--                defaultProps: {-->
<!--                    children: 'children',-->
<!--                    label: 'label'-->
<!--                }-->
<!--            };-->
<!--        }-->
<!--    };-->
<!--</script>-->