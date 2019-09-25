<template>
    <div class="rtcrevisit-list">
        <el-card class="box-card">
            <span>我的视频问诊</span>
            <el-divider></el-divider>
            <el-tabs v-model="activeName"
                     @tab-click="">
                <el-tab-pane label="未完成"
                             name="not_close">
                    <el-table :data="not_close.revisit_sessions">
                        <el-table-column prop="doctor_name"
                                         label="医生姓名"
                                         width="">
                        </el-table-column>
                        <el-table-column prop="faculty_title"
                                         label="医生科室"
                                         width="">
                        </el-table-column>
                        <el-table-column prop="revisit_session_time"
                                         label="问诊时间"
                                         width="">
                        </el-table-column>
                        <el-table-column label="问诊状态"
                                         width="">
                            <template slot-scope="scope">
                                <el-badge is-dot
                                          class="item"
                                          :type="scope.row.type"></el-badge>
                                {{scope.row.revisit_session_status_desc}}
                            </template>

                        </el-table-column>
                        <el-table-column label="操作"
                                         width="">
                            <template class="handle"
                                      slot-scope="scope">
                                <el-button @click="cancelSession(scope.row)"
                                           type="text"
                                           size="mini"
                                           v-if="scope.row.revisit_session_status == 0">取消排队
                                </el-button>
                                <el-button @click="goRevisitDetail(scope.row)"
                                           type="text"
                                           size="mini"
                                           v-else>进入视频诊室 >
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>

                <el-tab-pane label="已结束"
                             name="closed">
                    <el-table :data="closed.revisit_sessions">
                        <el-table-column prop="doctor_name"
                                         label="医生姓名"
                                         width="">
                        </el-table-column>
                        <el-table-column prop="faculty_title"
                                         label="医生科室"
                                         width="">
                        </el-table-column>
                        <el-table-column prop="revisit_session_time"
                                         label="问诊时间"
                                         width="">
                        </el-table-column>
                        <el-table-column label="问诊状态"
                                         width="">
                            <template slot-scope="scope">
                                <el-badge is-dot
                                          class="item"
                                          :type="scope.row.type"></el-badge>
                                {{scope.row.revisit_session_status_desc}}
                            </template>
                        </el-table-column>
                        <el-table-column label="操作"
                                         width="">
                            <template class="handle"
                                      slot-scope="scope">
                                <el-button @click="goRevisitDetail(scope.row)"
                                           type="text"
                                           size="mini"
                                           v-if="scope.row.revisit_session_status_desc == '已完成'">查看>
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination :hide-on-single-page="true"
                                   v-if="activeName == 'closed'"
                                   background
                                   :current-page="data.pagenum"
                                   :page-size="data.pagesize"
                                   layout="prev, pager, next"
                                   :total="data.total">
                    </el-pagination>
                </el-tab-pane>
            </el-tabs>
        </el-card>
    </div>
</template>

<script>
export default {
    data () {
        return {
            closed: {},
            not_close: {},
            data: {},
            // 默认显示第一条
            activeName: 'not_close',
        }
    },
    created () {
        let self = this;
        self.fetchData();
    },
    methods: {
        goRevisitDetail (session) {
            let self = this;
            if (session.revisit_session_status === '2') {
                self.$api.revisitsession.beginsession({revisit_session_id: session.revisit_session_id})
                    .then(function () {
                        self.$router.push({path: '/revisit/session/' + session.revisit_session_id});
                    })
            }else {
                self.$router.push({path: '/revisit/session/' + session.revisit_session_id});
            }
        },
        fetchData () {
            let self = this;
            self.$api.revisitsession.listforrtcrevisit(self.page).then(({ data }) => {
                let closed = data.closed,
                    not_close = data.not_close;

                Object.keys(closed.revisit_sessions).forEach((key) => {
                    let revisit_session = closed.revisit_sessions[key];
                    closed.revisit_sessions[key].type = self.getDotType(revisit_session.revisit_session_status);
                });

                Object.keys(not_close.revisit_sessions).forEach((key) => {
                    let revisit_session = not_close.revisit_sessions[key];
                    not_close.revisit_sessions[key].type = self.getDotType(revisit_session.revisit_session_status);
                });

                closed.pagenum = parseInt(closed.pagenum);
                closed.pagesize = parseInt(closed.pagesize);
                closed.total = parseInt(closed.total);

                self.data = data;
                self.closed = closed;
                self.not_close = not_close;
            })
        },
        getDotType (value) {
            let type = '';
            switch (value) {
                case '0':
                    type = 'primary';
                    break;

                case '1':
                case '2':
                case '3':
                    type = 'success';
                    break;

                case '4':
                    type = 'info';
                    break;

                case '5':
                case '6':
                    type = 'danger';
                    break;

                case '7':
                    type = 'warning';
                    break;

                default:
                    break;
            }

            return type;
        },
        cancelSession (session) {
            let self = this;
            self.$api.revisitsession.cancelsession({
                revisit_session_id: session.revisit_session_id
            }).then(data => {
                self.$message({
                    showClose: true,
                    message: '取消排队成功',
                    type: 'warning'
                });

                self.fetchData();
            });
        },
    }
}
</script>

<style lang='less' scoped>
@color: #478de2;
.el-table__header-wrapper tr {
  background-color: #999999 !important;
}

.handle .el-button {
  padding: 0;
}
</style>
