
<template>
  <div>
<el-input v-model="input" placeholder="请输入内容"></el-input>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        input: ''
      }
    },
    created(){
     this.initData()
    },
    methods:{
      initData(){
        console.log("-----------------"+this.$store.getters.name)
        this.input=this.$store.getters.name
      }
    }
  }
</script>