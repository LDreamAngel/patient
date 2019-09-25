<template>
    <div class="revisit-list">
        <el-card class="box-card">
            <span>我的图文问诊</span>
            <el-divider></el-divider>
            <el-table
                    :data="list">
                <el-table-column
                        prop="revisit_session_id"
                        label="问诊ID"
                        width="" v-if="false">
                </el-table-column>
                <el-table-column
                        prop="doctor_name"
                        label="医生姓名"
                        width="">
                </el-table-column>
                <el-table-column
                        prop="faculty_title"
                        label="科室"
                        width="">
                </el-table-column>
                <el-table-column
                        prop="revisit_session_time"
                        label="咨询时间"
                        width="">
                </el-table-column>
                <el-table-column
                        label="咨询状态"
                        width="">
                    <template slot-scope="scope">
                        <el-badge is-dot class="item" :type="scope.row.type"></el-badge>
                        {{scope.row.revisit_session_status_desc}}
                    </template>

                </el-table-column>
                <el-table-column
                        label="操作"
                        width="100">
                    <template slot-scope="scope">
                        <el-button @click="goRevisitDetail(scope.row)" type="text" size="small" v-if="scope.row.revisit_session_status == 1">立即处理 >
                        </el-button>
                        <el-button @click="goRevisitDetail(scope.row)" type="text" size="small" v-else>查看
                        </el-button>
                        <i></i>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                    background
                    :hide-on-single-page="true"
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
                list: [],
                // 默认显示第一条
                page: {
                    pagenum: 1,
                    pagesize: 10,
                    total: 0,
                }
            }
        },
        created() {
            this.fetchData();
        },
        methods: {
            goRevisitDetail(row) {
                let self = this;
                self.$router.push({
                    path: '/revisit/session/' + row.revisit_session_id,
                });
            },
            fetchData() {
                let self = this;
                self.$api.revisitsession.listforrevisit(self.page)
                    .then(({data}) => {
                        let revisit_sessions = data.revisit_sessions;

                        Object.keys(revisit_sessions).forEach((key) => {
                            let revisit_session = revisit_sessions[key];
                            revisit_sessions[key].type = self.getDotType(revisit_session.revisit_session_status);
                        });

                        self.page.pagesize = parseInt(data.pagesize);
                        self.page.pagenum = parseInt(data.pagenum);
                        self.page.total = parseInt(data.total);
                        self.list = revisit_sessions;
                    })
                    .catch(({errmsg}) => {
                        console.log(errmsg)
                    })
            },
            getDotType(value) {
                let type = '';
                switch (value) {
                    case '0':
                        type = 'primary';
                        break;

                    case '1':
                        type = 'success';
                        break;

                    case '2':
                        type = 'info';
                        break;

                    case '3':
                        type = 'danger';
                        break;

                    case '4':
                        type = 'warning';
                        break;

                    default:
                        break;
                }

                return type;
            },
            handleCurrentChange(CurrentPage) {
                console.log(CurrentPage)
                let self = this;
                self.page.pagenum = CurrentPage;
                self.fetchData();
            }
        },
    }
</script>

<style lang='less' scoped>
    @color: #478de2;
</style>
