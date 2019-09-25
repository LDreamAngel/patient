<template>
    <div class="prescription-list">
        <el-card class="box-card">
            <span>我的处方</span>
            <el-divider></el-divider>
            <el-table
                    :data="list">
                <el-table-column
                        prop="doctor_name"
                        label="医生姓名"
                        width="">
                </el-table-column>
                <el-table-column
                        prop="faculty_name"
                        label="医生科室"
                        width="">
                </el-table-column>
                <el-table-column
                        prop="diagnose"
                        label="确诊疾病"
                        width="">
                </el-table-column>
                <el-table-column
                        prop="ctime"
                        label="开处方时间"
                        width="">
                </el-table-column>
                <el-table-column
                        label="操作"
                        width="">
                    <template slot-scope="scope">
                        <el-button @click="handleClick(scope.row)" type="text" size="small">查看处方单 >
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
            let self = this;
            self.fetchData();
        },
        methods: {
            fetchData: function () {
                let self = this;
                self.$api.prescription.list(self.page).then(({data}) => {
                    self.pagesize = parseInt(data.pagesize);
                    self.total = parseInt(data.total);
                    self.pagenum = parseInt(data.pagenum);
                    self.list = data.prescriptions;
                });
            },
            //TODO 处方详情
            handleClick(row) {
                this.$router.push({name: 'prescription-detail', params: {id: row.id}});
            },
            handleCurrentChange(currentPage) {
                let self = this;
                self.page.pagenum = currentPage;
                self.fetchData();
            }
        },
    }
</script>

<style lang='less' scoped>
    @color: #478de2;
</style>
