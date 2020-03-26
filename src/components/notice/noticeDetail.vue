<template>
    <div class="detail">
        <h1 class="detail-title">{{notice.noticeTitle}}</h1>
        <div class="detail-content">
            <p v-html="content"></p>
        </div>
        <div class="detail-admin">
            <p>发布于 {{notice.manageDate | formatDate('yyyy-MM-dd')}}</p>
            <p>浏览{{notice.noticeReading}}次</p>
        </div>
    </div>
</template>

<script>
    import marked from 'marked';
    export default {
        data() {
            return {
                notice: [],
                content:''

            };
        },
        name: "noticeDetail",

        methods: {

        },
        mounted() {

            this.notice = this.$route.query.notice;
            this.notice.noticeContent= this.notice.noticeContent.replace(/#/g, '# ');
            let htmlData = marked(this.notice.noticeContent);
            this.content = htmlData
        }
    };
</script>
<style scoped>
    .detail{
        margin-left: 300px;
        width: 900px;
    }
    .detail-title {
        margin-bottom: 30px;
    }
    .detail-content {;
      width: 800px;
       text-align: left;
    }
    .detail-admin {
        font-size: 14px;
        color: #999;
        margin: 20px 0;
    }
    .detail .detail-admin p {
        display: inline-block;
        margin-right: 15px;
    }
    ul {
        list-style: none;
    }
</style>