<template>
  <div id="app">
    <router-view v-if="isRouterAlive"/>
  </div>
</template>

<script>


export default {
  name: 'app',
  components: {},
  provide() {    //父组件中通过provide来提供变量，在子组件中通过inject来注入变量。
    return {
      reload: this.reload
    }
  },
  data() {
    return {
      isRouterAlive: true                    //控制视图是否显示的变量
    }
  },
  created() {

    //在页面刷新时将vuex里的信息保存到localStorage里
    window.addEventListener("beforeunload", () => {
      localStorage.setItem("messageStore", JSON.stringify(this.$store.state))
    })

    //在页面加载时读取localStorage里的状态信息
    localStorage.getItem("messageStore") && this.$store.replaceState(Object.assign(this.$store.state, JSON.parse(localStorage.getItem("messageStore"))));

  },
  methods: {
    reload() {
      this.isRouterAlive = false;            //先关闭，
      this.$nextTick(function () {
        this.isRouterAlive = true;         //再打开
      })
    },
  }
}
</script>

<style>

</style>
