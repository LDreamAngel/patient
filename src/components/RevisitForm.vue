<template>
    <div class="revisit-form">
        <el-dialog title="问诊前信息收集"
                   center
                   :visible.sync="dialogVisible"
                   :close-on-click-modal="false"
                   :fullscreen="false">
            <el-form class="form"
                     label-position="top"
                     label-width="80px"
                     size="mini"
                     :rules="rule"
                     :model="form"
                     ref="form">

                <el-form-item prop="hospital_name"
                              label="疾病确诊医院：">
                    <el-input v-model="form.hospital_name"
                              placeholder="请填写医院名称"></el-input>
                </el-form-item>

                <el-form-item prop="imageUrl"
                              label="上传疾病病历：">
                    <el-upload name="imgfile"
                               class="paper-uploader"
                               :action="uploadUrl"
                               :show-file-list="false"
                               :on-success="handlePictureSuccess">
                        <img v-if="form.imageUrl" :src="form.imageUrl" class="image">
                        <i v-else class="el-icon-plus paper-uploader-icon"></i>
                    </el-upload>
                </el-form-item>

                <el-form-item prop="disease_name_symptom"
                              label="本次咨询的疾病名称和症状：">
                    <el-input type="textarea"
                              v-model="form.disease_name_symptom"
                              placeholder="请描述疾病名称与症状 (例如糖尿病、白癜风或头疼等) …"
                              :rows="3"
                              maxlength="50"
                              show-word-limit></el-input>
                </el-form-item>

                <el-form-item prop="chief_complaint"
                              label="病情主诉：">
                    <el-input type="textarea"
                              v-model="form.chief_complaint"
                              placeholder="请描述发病诱因、症状、病情加重或缓解情况、家族史等…"
                              :rows="3"
                              minlength="20"
                              maxlength="2000"
                              show-word-limit></el-input>
                </el-form-item>

                <el-form-item prop="want_help"
                              label="本次咨询想获得医生什么帮助：">
                    <el-input type="textarea"
                              v-model="form.want_help"
                              placeholder="可向医生询问是否可以去门诊就诊，如何控制病情，是否需要手术等…"
                              :rows="3"
                              maxlength="50"
                              show-word-limit></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button size="medium"
                               type="primary"
                               @click="onSubmit">提交，进入问诊
                    </el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
    import request from '@/api/request'

    export default {
        data() {
            return {
                uploadUrl: '',
                dialogVisible: false,
                rule: {
                    hospital_name: [
                        {
                            required: true,
                            message: '请填写疾病确诊医院',
                            trigger: 'blur'
                        },
                        {
                            max: 50,
                            message: '字数0-50字',
                            trigger: 'blur'
                        }
                    ],
                    disease_name_symptom: [
                        {
                            required: true,
                            message: '请填写本次咨询的疾病名称和症状',
                            trigger: 'blur'
                        },
                        {
                            max: 50,
                            message: '字数0-50字',
                            trigger: 'blur'
                        }
                    ],
                    chief_complaint: [
                        {
                            required: true,
                            message: '请填写病情主诉',
                            trigger: 'blur'
                        },
                        {
                            min: 20,
                            max: 2000,
                            message: '字数20-2000字',
                            trigger: 'blur'
                        }
                    ],
                    want_help: [
                        {
                            required: true,
                            message: '请填写本次咨询想获得医生什么帮助',
                            trigger: 'blur'
                        },
                        {
                            max: 50,
                            message: '字数0-50字',
                            trigger: 'blur'
                        }
                    ],
                    imageUrl: [
                        {
                            required: true,
                            message: '请上传病历',
                            trigger: 'blur'
                        }
                    ],
                },
                form: {
                    doctorid: 0,
                    revisit_type: '',
                    hospital_name: '',
                    medical_image: '',
                    disease_name_symptom: '',
                    chief_complaint: '',
                    want_help: '',
                    imageUrl: ''
                },
            }
        },
        props: ['doctorid', 'revisit_type'],
        created() {
            let self = this;

            self.uploadUrl = request.baseURL + '/picture/uploadjson';
        },
        methods: {
            show() {
                this.dialogVisible = true;
            },
            handlePictureSuccess(response) {
                let self = this,
                    picture = response.data.picture;

                self.form.imageUrl = picture.thumb_url;
                self.form.medical_image = picture.pictureid;
            },
            onSubmit() {
                let self = this;
                self.$refs.form.validate(valid => {
                    if (valid) {
                        self.form.doctorid = self.doctorid;
                        let revisit_type = self.form.revisit_type = self.revisit_type;
                        self.$api.revisitsession.applypost(self.form)
                            .then(({data}) => {
                                let path = '';
                                if (revisit_type === 'revisit') {
                                    path = '/revisit/session/' + data.revisit_session_id;
                                } else {
                                    this.$alert(data.system_remind, '视频问诊', {
                                        confirmButtonText: '确定',
                                    });
                                    path = '/user/rtcRevisitList';
                                }

                                self.$router.push({
                                    path: path
                                })

                            }).finally(function () {
                            self.isShowDialog = false;
                        })
                    }
                });

            },
        }
    }
</script>

<style lang="less">
    .revisit-form {
        .paper-uploader {
            & > .el-upload {
                border: 1px dashed #d9d9d9 !important;
                border-radius: 6px;
                cursor: pointer;
                position: relative;
                overflow: hidden;
            }

            & > .el-upload:hover {
                border-color: #409eff;
            }

            .paper-uploader-icon {
                font-size: 28px;
                color: #8c939d;
                width: 104px;
                height: 104px;
                line-height: 104px;
                text-align: center;
            }

            .image {
                width: 178px;
                height: 178px;
                display: block;
            }
        }
    }

</style>
