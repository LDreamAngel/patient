<template>
    <div class="case-history">
        <el-dialog title="我的病例"
                   :visible.sync="isCaseHistoryPaper"
                   :show-close='false'>

            <div class="brief">
                <span @click='closePaper'
                      class="close">×</span>
                <el-row>
                    <el-col :span="5">
                        <div class="grid-content bg-purple">
                            <span>姓名：{{caseHistoryPaper.patient_name}}</span>
                        </div>
                    </el-col>
                    <el-col :span="5">
                        <div class="grid-content bg-purple-light">
                            <span>性别：{{caseHistoryPaper.patient_sex | sex}}</span>
                        </div>
                    </el-col>
                    <el-col :span="5">
                        <div class="grid-content bg-purple">
                            <span>年龄：{{caseHistoryPaper.patient_age}}</span>
                        </div>
                    </el-col>
                    <el-col :span="5">
                        <div class="grid-content bg-purple-light">
                            <span>科室：{{caseHistoryPaper.faculty_name}}</span>
                        </div>
                    </el-col>
                    <el-col :span="4">
                        <div class="grid-content bg-purple-light">
                            <span>诊断时间：{{caseHistoryPaper.ctime}}</span>
                        </div>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="5">
                        <div class="grid-content bg-purple">
                            <span>诊断：{{caseHistoryPaper.diagnosis}}</span>
                        </div>
                    </el-col>
                </el-row>
            </div>
            <div>
                <div>
                    <h6>主诉：</h6>
                    <p>{{caseHistoryPaper.chief_complaint}}</p>
                </div>

                <div>
                    <h6>现病史：</h6>
                    <p>{{caseHistoryPaper.present_illness}}</p>
                </div>
                <div>
                    <h6>既往史：</h6>
                    <p>{{caseHistoryPaper.past_medical_history}}</p>
                </div>

                <div>
                    <h6>查体：</h6>
                    <p>{{caseHistoryPaper.physical_examination}}</p>
                </div>
                <div>
                    <h6>初步诊断：</h6>
                    <p>{{caseHistoryPaper.tentative_diagnosis}}</p>
                </div>

                <div>
                    <h6>治疗措施：</h6>
                    <p>{{caseHistoryPaper.diagnosis}}</p>
                </div>

            </div>

        </el-dialog>
    </div>

</template>

<script>
export default {
    data () {
        return {

        }
    },
    methods: {
        closePaper () {
            // console.log('ss')
            this.$emit('closePaper')
        }
    },
    props: { caseHistoryPaper: Object, isCaseHistoryPaper: Boolean }
}
</script>

<style lang='less' scoped>
.brief {
  padding-bottom: 20px;
  border-bottom: 0.5px dotted black;
  position: relative;
  .close {
    position: absolute;
    top: -70px;
    right: 0px;
    font-size: 18px;
    &:hover {
      cursor: default;
    }
  }
}
</style>

