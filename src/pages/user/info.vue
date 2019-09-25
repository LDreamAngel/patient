<template>
    <div class="user-info">
        <el-card class="box-card">
            <span>个人资料</span>
            <el-divider></el-divider>
            <el-form :model="ModifyForm"
                     ref="ModifyForm"
                     :rules="rules"
                     class="modifyform"
                     size="medium "
                     label-position="left"
                     label-width="100px"
                     :hide-required-asterisk="true">
                <el-form-item label="修改头像">
                    <p style="color: #999999;font-size: 12px;margin-top: 0;">从电脑中选择一项你喜欢的照片上传，仅支持JPEG、PNG图片文件，且大小不超过2M</p>
                    <el-upload name="imgfile"
                               class="avatar-uploader"
                               action="http://www.fangcunhulian.com/picture/uploadjson"
                               :show-file-list="false"
                               :on-success="handleAvatarSuccess"
                               :before-upload="beforeAvatarUpload">
                        <img v-if="ModifyForm.headimg"
                             :src="ModifyForm.headimg"
                             class="avatar">
                        <i v-else
                           class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item prop="name"
                              label="患者姓名">
                    <el-input v-model="ModifyForm.name"></el-input>
                </el-form-item>
                <el-form-item prop="idcard"
                              label="身份证号码">
                    <el-input v-model="ModifyForm.idcard"></el-input>
                </el-form-item>
                <el-form-item prop="mobile"
                              label="电话号码">
                    <el-input v-model="ModifyForm.mobile"
                              disabled=""></el-input>
                </el-form-item>
                <el-form-item label="性别">
                    <el-radio v-model="ModifyForm.sex"
                              label=1>男</el-radio>
                    <el-radio v-model="ModifyForm.sex"
                              label=2>女</el-radio>
                </el-form-item>
                <el-form-item prop="birthday"
                              label="出生日期">
                    <el-date-picker v-model="ModifyForm.birthday"
                                    type="date"
                                    placeholder="选择日期"
                                    format="yyyy 年 MM 月 dd 日"
                                    value-format="yyyy-MM-dd"
                                    :picker-options="pickerOptions">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary"
                               @click="onSubmit">更新信息</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>
export default {
    data () {
        return {
            patient: {},
            // 默认显示第一条
            ModifyForm: {},
            page: {
                pagesize: 10,
                pagenum: 1,
                total: 0
            },
            rules: {
                name: [{
                    required: true,
                    message: '患者名不能为空',
                    trigger: 'blur'

                }],
                mobile: [
                    {
                        required: true,
                        trigger: 'blur'
                    }
                ],
                idcard: [{
                    required: true,
                    message: '请输入身份证号',
                    trigger: 'blur'
                }],
                birthday: [{
                    required: true,
                    message: '请输入出生日期',
                    trigger: 'blur'
                }]
            },
            //小于当前日期不可用
            pickerOptions: {
                disabledDate (time) {
                    return time.getTime() > Date.now() - 8.64e7;
                }
            }
        }
    },

    created () {
        let self = this;
        self.fetchData();
    },

    methods: {
        handleAvatarSuccess (response) {
            let self = this,
                picture = response.data.picture;

            self.ModifyForm.headimg = picture.thumb_url;
            self.ModifyForm.headimg_pictureid = picture.pictureid;
        },
        fetchData () {
            let self = this;

            self.$api.patient.info().then(({ data }) => {
                self.ModifyForm = data;
                self.ModifyForm.headimg_pictureid = 100004631;
            })
        },
        onSubmit () {
            let self = this;
            self.$refs.ModifyForm.validate(valid => {
                if (valid == true) {
                    self.$api.patient.modifypost(self.ModifyForm)
                        .then(({ data }) => {
                            self.$message.success('资料成功修改！');
                            self.$store.dispatch('setUser', data.patient);
                        })
                } else {
                    console.log('submit err')
                }
            })
        },
        beforeAvatarUpload (file) {
            const isJPG = file.type === 'image/jpeg';
            const isPNG = file.type === 'image/png';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG && !isPNG) {
                this.$message.error('只能上传JPG、PNG格式头像图片!');
            }

            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
            }

            return (isJPG || isPNG) && isLt2M;
        }
    }
}
</script>

<style lang='less'>
@color: #478de2;

.user-info {
  .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .el-upload:hover {
    border-color: #409eff;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 104px;
    height: 104px;
    line-height: 104px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }

  .modifyform {
    width: 500px;
  }
}
</style>
