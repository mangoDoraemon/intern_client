<template>
    <div class="container" v-loading="loading">
    <div style="margin-top: 20px;width: 800px;margin-left: 300px">
        <el-input placeholder="请输入搜索内容" v-model="fuzzy" class="input-with-select">>
            <el-button slot="append" icon="el-icon-search" @click="fetchDataInfoAll"></el-button>
        </el-input>
    </div>
    <div class="blog-list" style="width: 1000px;margin-left: 300px;margin-top: 10px">
        <ul class="list-article">
            <li class="article"  v-for="notice in noticeList" :key="notice.key">
                <div class="article-header">
                    <h2 class="article-title">
                        <!-- <router-link to="{path:'/contents',query:{id:article.id}}" class="title-link">{{article.title}}</router-link> -->
                        <span class="title-link" @click="toDetail(notice)">{{notice.noticeTitle}}</span>
                    </h2>
                    <span class="article-body" >{{notice.noticeContent | cutString(180)}}</span>
                </div>
                <div class="article-footer">
              <span class="el-icon-date">
                <span class="content" style="color: #24292e">发布时间：{{notice.manageDate | formatDate('yyyy-MM-dd')}}</span>
              </span>
                    <span class="el-icon-s-custom">
                <span class="content">发布者：{{notice.manageUser}}</span>
              </span>
                    <span class="el-icon-view" style="color: #1989FA">
                <span class="content" style="color: #24292e">{{notice.noticeReading}}-阅读量</span>
              </span>
                </div>
            </li>
        </ul>
    </div>
        <div style="margin-left: 340px">
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="fetchDataInfoAll"
                    :current-page.sync="currentPage"
                    :page-sizes="[10, 20, 50, 100]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total" class="pagination">
            </el-pagination>
        </div>

    </div>
</template>

<script>
    import {fetchInfoAll} from "../../api/notice";

    export default {
        name: "showNoticeInfo",
        data(){
            return{
                noticeList:[],
                currentPage: 1,
                fuzzy: '',
                pageSize: 10,
                total: 0,
                loading: true,
            }
        },
        created() {
            fetchInfoAll({}).then(res => {
                this.noticeList = res.data.list;
                this.total = res.data.total;
                this.loading = false
            });
        },
        methods:{
            fetchDataInfoAll() {
                this.loading = true;
                let data = {
                    'fuzzy': this.fuzzy,
                    'page': this.currentPage,
                    'pageSize': this.pageSize
                };

                fetchInfoAll(data).then(res => {
                    this.noticeList = res.data.list;
                    this.total = res.data.total;
                    this.loading = false
                })
            },
            handleSizeChange(val){
                this.pageSize = val;
                this.fetchDataInfoAll()
            },
            toDetail(notice){
                this.$router.push({ path: "/noticeDetail", query: { notice } });
            }
        }
    }
</script>

<style scoped>
    /* @import '~@/assets/icons/iconfont.css'; */
    .icons {
        font-size: 14px;
        color: #909399;
        margin-right: 10px;
    }
    .content {
        margin-left: 3px;
    }
    .blog-body {
        max-width: 770px;
        margin: 100px auto 0;
        position: relative;
        padding-left: 15px;
        padding-right: 15px;
    }
    .blog-list ul {
        list-style: none;
    }
    .title-link {
        vertical-align: middle;
        cursor: pointer;
    }
    .title-link:hover {
        color: #409eff;
    }
    .artic a {
        color: #24292e;
    }

    .article {
        margin: 0 0 15px;

        background-color: #fff;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        border-radius: 0;
    }
    .article-header {
        padding: 10px 20px 0;
        /* border-bottom: 1px solid #f2f6fc; */
    }
    .article-footer {
        padding: 8px 20px;
        border-top: 1px solid #f3f3f3;
        line-height: 27px;
        overflow: hidden;
        font-size: 12px;
    }
    .blog-list .article .article-title {
        font-size: 20px;
        font-weight: 400;
    }
    .blog-list .article .article-body {
        margin: 10px 0;
        color: #666;
        word-break: break-all;
        /* overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical; */
    }
</style>