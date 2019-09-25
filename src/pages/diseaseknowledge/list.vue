<template>
    <div class="diseaseknowledge-list">
        <el-card class="box-card" shadow="never">
            <div class="lesson" v-for="lesson,index in lessons" :key="index" @click="goLessonDetail(lesson.id)">
                <el-container>
                    <el-aside width="160px">
                        <el-image :key="" :src="lesson.picture" style="width: 160px;height: 160px"></el-image>

                    </el-aside>
                    <el-main>
                        <h4 class="title">{{lesson.title}}</h4>
                        <p class="brief">{{lesson.brief}}</p>
                        <p class="createtime">{{lesson.createtime}}</p>
                    </el-main>
                </el-container>
            </div>
            <el-pagination
                    :hide-on-single-page="true"
                    background
                    @current-change="handleCurrentChange"
                    :current-page="page.pagenum"
                    :page-size="page.pagesize"
                    layout="prev, pager, next"
                    :total="page.total">
            </el-pagination>
        </el-card>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                lessons: {},
                page: {}
            }
        },
        created() {
            this.fetchData();
        },
        methods: {
            fetchData() {
                let self = this;
                self.$api.lesson.list(self.page).then(({data}) => {
                    self.lessons = data.lessons;
                    self.page = {
                        pagenum: parseInt(data.pagenum),
                        pagesize: parseInt(data.pagesize),
                        total: parseInt(data.total),
                    };
                })
            },
            handleCurrentChange(currentPage) {
                this.page.pagenum = currentPage;
                this.fetchData();
            },
            goLessonDetail(lessonid) {
                this.$router.push({
                    path: '/diseaseknowledge/detail', query: {
                        lessonid: lessonid
                    }
                })
            }
        }
    }
</script>
<style lang='less' scoped>
    @color: #478de2;
    @bgColor: #478de2;
    .diseaseknowledge-list {

        .lesson {
            height: 160px;
            margin-bottom: 20px;
            cursor: pointer;

            .title,
            .createtime,
            .brief {
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-box-orient: vertical;
            }

            .title,
            .createtime {
                margin-top: 5px;
                -webkit-line-clamp: 2;
            }

            .brief {
                -webkit-line-clamp: 3;
            }

            .createtime {
                position: absolute;
                bottom: 0;
            }

            .el-main {
                overflow: hidden;
                padding: 0 20px;
                color: #333333;
                font-size: 14px;
                position: relative
            }

            .el-header {
                margin: 10px 0
            }
        }

        .el-card__body {
            padding: 24px;
        }

        /*.el-footer {*/
        /*    position: absolute;*/
        /*    height: 20px;*/
        /*    bottom: 10px;*/
        /*    color: #999999;*/
        /*    font-size: 14px*/
        /*}*/
    }

</style>
