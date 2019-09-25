<template>
    <div class="revisit-paper">
        <el-card class="box-card">
            <span class="my-case-history">我的病历</span>
            <el-divider></el-divider>
            <div class="block">
                <el-carousel trigger = "click" height = "910px" ref = "pcard" :autoplay = false :loop = false arrow = "never">
                    <el-carousel-item class="paper" v-for="(item,index) in papers" :key="index">
                        <el-card class="box-card1">
                            <div slot="header" class="clearfix head">
                                <el-button class="prev-btn" @click="handlePrevClick" type="text" v-if='1 < index + 1 '>上一张</el-button>
                                <el-button class="prev-btn" @click="handlePrevClick" type="text" disabled  v-if='index + 1==1'>上一张</el-button>
                                <span class="title">病历填写时间：{{item.ctime}} ({{index + 1}}/{{papers.length}})</span>
                                <el-button class="next-btn" @click="handleNextClick" type="text" v-if='index + 1<papers.length'>下一张</el-button>
                                <el-button class="next-btn"  type="text" disabled  v-if='index + 1==papers.length'>下一张</el-button>
                            </div>
                            <div class="content">
                                <div class="brief">
                                    <el-row>
                                        <el-col :span="5">
                                            <div class="grid-content bg-purple">
                                                <span>姓名：{{item.patient_name}}</span>
                                                
                                            </div>
                                        </el-col>
                                        <el-col :span="4">
                                            <div class="grid-content bg-purple-light">
                                                <span>性别：{{item.patient_sex | sex}}</span>
                                            </div>
                                        </el-col>
                                        <el-col :span="4">
                                            <div class="grid-content bg-purple">
                                                <span>年龄：{{item.patient_age}}</span>
                                            </div>
                                        </el-col>
                                        <el-col :span="4">
                                            <div class="grid-content bg-purple-light">
                                                <span>科室：{{item.faculty_name}}</span>
                                            </div>
                                        </el-col>
                                        <el-col :span="7">
                                            <div class="grid-content bg-purple-light">
                                                <span>诊断时间：{{(item.ctime).split(' ')[0]}}</span>
                                            </div>
                                        </el-col>
                                    </el-row>
                                    <el-row>
                                        <el-col :span="5">
                                            <div class="grid-content bg-purple">
                                                <span>诊断：{{item.diagnosis}}</span>
                                            </div>
                                        </el-col>
                                    </el-row>
                                </div>
                                <div class="detail">
                                    <div>
                                        <p>主诉：</p>
                                        <p>{{item.chief_complaint}}</p>
                                    </div>

                                    <div>
                                        <p>现病史：</p>
                                        <p>{{item.present_illness}}</p>
                                    </div>
                                    <div>
                                        <p>既往史：</p>
                                        <p>{{item.past_medical_history}}</p>
                                    </div>

                                    <div>
                                        <p>查体：</p>
                                        <p>{{item.physical_examination}}</p>
                                    </div>
                                    <div>
                                        <p>初步诊断：</p>
                                        <p>{{item.tentative_diagnosis}}</p>
                                    </div>

                                    <div>
                                        <p>治疗措施：</p>
                                        <p>{{item.therapeutic_measures}}</p>
                                    </div>

                                </div>
                            </div>
                        </el-card>
                    </el-carousel-item>
                </el-carousel>
            </div>
        </el-card>
    </div>
</template>

<script>

    export default {
        data() {
            return {
                papers: [],
            }
        },
        created() {
            let self = this;
            self.fetchData();
        },
        methods: {
            fetchData: function () {
                let self = this;
                self.$api.revisitpaper.list().then(({data}) => {
                    self.papers = data;
                });
            },
            handlePrevClick() {
                this.$refs.pcard.prev();
            },
            handleNextClick() {
                this.$refs.pcard.next();
            }
        },
    }
</script>

<style lang='less' scoped>
    @color: #478de2;
    .paper {
        .box-card1{
            overflow: auto;
            height: 100%;
            &::-webkit-scrollbar {
                display: none;
            }    
        }
        .head {
            text-align: center;
            .el-button.prev-btn {
                float: left;
                padding: 3px 0
            }

            .el-button.next-btn {
                float: right;
                padding: 3px 0
            }
        }

        .content {
            .brief {
                border-bottom: 0.5px dotted #E8E8E8;
                padding: 10px 0;
                .el-row{
                    margin-bottom: 20px;
                    font-size: 14px;
                }
            }

            .detail {
                padding-top: 30px;

                div {
                    margin-bottom: 20px;
                    font-size: 14px;
                    
                    p{
                        padding: 0;
                        margin: 0;
                    }
                    p:nth-of-type(1){
                        font-weight: 600;
                        margin-bottom: 10px;
                    }
                }
            }
        }       
    }
    .my-case-history{
        font-size: 20px;
        color:#333333;
    }
    
</style>
<style>
     

</style>
