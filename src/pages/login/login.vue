<template>
    <div class="login">
        <el-card>
            <div class="banner">
                <img src="/static/image/banner_login.png"
                     alt=""
                     width="912px"
                     height="80px">
            </div>
            <div class="register-success"
                 v-show='loginsuccess'>
                <img src="/static/image/login01.png"
                     alt="">
                <div>
                    <p class="congratulation"><img src="/static/image/icon/success1.png"
                             alt="">恭喜您注册成功</p>
                    <p>欢迎您使用海南方寸互联网医院</p>
                </div>
            </div>
            <el-tabs v-model="action"
                     v-show='!loginsuccess'>
                <el-tab-pane label="患者登录"
                             name="login"
                             class='login-page'>
                    <el-form :model="LoginForm"
                             ref="LoginForm"
                             :rules="rule"
                             class="regform"
                             label-width="0"
                             size="medium ">
                        <h3 class="login-text"></h3>
                        <el-form-item prop="mobile">
                            <el-input type="mobile"
                                      v-model.number="LoginForm.mobile"
                                      autocomplete="on"
                                      placeholder="请输入手机号码">
                            </el-input>
                        </el-form-item>
                        <el-form-item prop="check_code"
                                      class="code-item">
                            <el-input class="auth_input"
                                      type="text"
                                      v-model="LoginForm.check_code"
                                      placeholder="输入验证码">
                            </el-input>
                            <el-button v-show="sendLoginAuthCode"
                                       type="primary"
                                       plain
                                       class="auth_text auth_text_blue"
                                       @click="getLoginAuthCode">
                                获取验证码
                            </el-button>
                            <el-button v-show="!sendLoginAuthCode"
                                       class="auth_text"
                                       :disabled="true">
                                <span class="auth_text_blue">{{auth_time}} </span> 秒之后重新发送
                            </el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary"
                                       class="submitBtn"
                                       @click="handleLoginSubmit"
                                       :loading="logining">
                                登录
                            </el-button>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>

                <el-tab-pane label="患者注册"
                             name="register"
                             class='register-page'>
                    <el-form :model="RegisterForm"
                             ref="RegisterForm"
                             :rules="rule"
                             class="regform"
                             label-width="100px"
                             size="medium">
                        <h3 class="login-text"></h3>
                        <el-form-item prop="mobile"
                                      label="手机号">
                            <el-input type="tel"
                                      v-model.number="RegisterForm.mobile"
                                      placeholder="请输入手机号码">
                            </el-input>
                        </el-form-item>
                        <el-form-item prop="check_code"
                                      class="code-item"
                                      label="验证码">
                            <el-input class="auth_input check_code"
                                      type="text"
                                      v-model="RegisterForm.check_code"
                                      placeholder="输入验证码">
                            </el-input>
                            <el-button v-show="sendRegisterAuthCode"
                                       type="primary"
                                       plain
                                       class="auth_text auth_text_blue"
                                       @click="getRegisterAuthCode">获取验证码
                            </el-button>
                            <el-button v-show="!sendRegisterAuthCode"
                                       class="auth_text"
                                       :disabled="true">
                                <span class="auth_text_blue">{{auth_time}} </span> 秒之后重新发送
                            </el-button>
                        </el-form-item>
                        <el-form-item prop="patient_name"
                                      label="患者姓名"
                                      placeholder="输入患者姓名">
                            <el-input v-model="RegisterForm.patient_name"></el-input>
                        </el-form-item>
                        <el-form-item prop="idcard"
                                      label="身份证号码"
                                      placeholder="输入身份证号码">
                            <el-input v-model="RegisterForm.idcard"></el-input>
                        </el-form-item>
                        <el-form-item label="性别">
                            <el-radio v-model="RegisterForm.sex"
                                      label="1">男
                            </el-radio>
                            <el-radio v-model="RegisterForm.sex"
                                      label="2">女
                            </el-radio>
                        </el-form-item>
                        <el-form-item prop="birthday"
                                      label="出生日期">
                            <el-date-picker v-model="RegisterForm.birthday"
                                            type="date"
                                            placeholder="选择日期"
                                            format="yyyy 年 MM 月 dd 日"
                                            value-format="yyyy-MM-dd"
                                            :picker-options="pickerOptions">
                            </el-date-picker>
                        </el-form-item>
                        <div class="agreement">
                            <el-checkbox v-model="RegisterForm.is_agree"
                                         true-label="1">
                                我已阅读并同意
                            </el-checkbox>
                            <el-link type="primary"
                                     @click="openAgreement">《服务协议》</el-link>
                            <el-link type="primary"
                                     @click="openPrivacy">《隐私协议》</el-link>
                        </div>
                        <el-button type="primary"
                                   class="submitBtn"
                                   @click="handleRegisterSubmit"
                                   :loading="logining">
                            立即注册
                        </el-button>
                    </el-form>
                </el-tab-pane>
            </el-tabs>
        </el-card>
    </div>
</template>
<script>
import serviceAgreement from '@/assets/js/service-agreement';
import privacyagreement from '@/assets/js/privacy-agreement'
export default {
    name: 'login',
    data () {
        let telCheck = (rule, value, callback) => {
            if (value === '') {
                return callback(new Error('请输入手机号'))
            } else if (!Number.isInteger(value)) {
                return callback(new Error('手机号必须是数字'))
            } else if (value.toString().length !== 11) {
                return callback(new Error('手机号必须是11位数字'))
            } else {
                callback()
            }
        }

        return {
            list: '',
            login: "登录界面",
            telCode: '',
            loginsuccess: false,
            LoginForm: {
                check_code: '',
                mobile: '',
            },
            RegisterForm: {
                check_code: '',
                mobile: '',
                patient_name: '',
                idcard: '',
                sex: '1',
                birthday: '',
                is_agree: 0
            },
            action: 'login',
            logining: false,
            sendLoginAuthCode: true, //登录显示‘获取按钮'还是‘倒计时'
            sendRegisterAuthCode: true, //注册显示‘获取按钮'还是‘倒计时'
            auth_time: 0, /*倒计时 计数器*/
            inputLoginCode: "",//登录绑定输入验证码框框
            inputRegisterCode: "",//注册绑定输入验证码框框
            rule: {
                patient_name: [{
                    required: true,
                    message: '请输入患者名'
                }],
                check_code: [
                    {
                        required: true,
                        message: '请输入验证码',
                        trigger: 'blur'
                    }
                ],
                mobile: [
                    {
                        required: true,
                        validator: telCheck,
                        trigger: 'blur'
                    }
                ],
                idcard: [{
                    required: true,
                    message: '请输入身份证号码',
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
        };
    },
    created () {
        let self = this,
            routeparams = self.$route.params;

        routeparams.action && (self.action = routeparams.action);

        if (self.$store.state.isLogin) {
            self.redirect();
        }
    },
    methods: {
        //  登录验证码
        getLoginAuthCode: function () {
            let self = this;
            self.$refs.LoginForm.validateField('mobile', errorMessage => {
                if (!errorMessage) {
                    self.$api.smscode.sendcheckcode({
                        mobile: self.LoginForm.mobile,
                        scene: 'login_patient'
                    }).then(() => {
                        self.sendLoginAuthCode = false;
                        //设置倒计时秒
                        self.auth_time = 60;
                        let auth_timetimer = setInterval(() => {
                            self.auth_time--;
                            if (self.auth_time <= 0) {
                                self.sendLoginAuthCode = true;
                                clearInterval(auth_timetimer);
                            }
                        }, 1000);
                    });
                }
            })
        },
        //  注册验证码
        getRegisterAuthCode: function () {
            let self = this;
            // prop 换成你想监听的prop字段
            self.$refs.RegisterForm.validateField('mobile', errorMessage => {
                if (!errorMessage) {
                    self.$api.smscode.sendcheckcode({
                        mobile: self.RegisterForm.mobile,
                        scene: 'register_patient'
                    }).then(() => {
                        self.sendRegisterAuthCode = false;
                        //设置倒计时秒
                        self.auth_time = 60;
                        let auth_timetimer = setInterval(() => {
                            self.auth_time--;
                            if (self.auth_time <= 0) {
                                self.sendRegisterAuthCode = true;
                                clearInterval(auth_timetimer);
                            }
                        }, 1000);
                    });
                }
            })

        },
        handleLoginSubmit () {
            let self = this;
            console.log('登录')
            self.$refs.LoginForm.validate(valid => {
                if (valid) {
                    self.$api.login.login(self.LoginForm)
                        .then(({ data }) => {
                            self.afterLoginSuccess(data);
                        })
                }
            })
        },
        handleRegisterSubmit () {
            let self = this;
            self.$refs.RegisterForm.validate(valid => {
                if (valid) {
                    self.$api.register.register(self.RegisterForm)
                        .then(({ data }) => {
                            self.loginsuccess = true;
                            setTimeout(() => {
                                self.afterLoginSuccess(data);
                            }, 2000);
                        })
                }
            })
        },
        afterLoginSuccess (data) {
            let self = this;
            localStorage.setItem('token', data.token);
            self.$store.dispatch('setUser', data.patient);

            self.redirect();
        },
        redirect () {
            let self = this;

            let redirect = self.$route.query.redirect;
            if (redirect) {
                self.$router.replace({ path: redirect });
            } else {
                self.$router.replace({ path: 'index' });
            }
        },
        openAgreement () {
            this.$alert(serviceAgreement, '海南方寸互联网医院服务协议', {
                dangerouslyUseHTMLString: true,
                customClass: 'service-agreement'
            })
        },
        openPrivacy () {
            this.$alert(privacyagreement, '海南方寸互联网医院隐私协议', {
                dangerouslyUseHTMLString: true,
                customClass: 'service-agreement'
            })
            //  let agreementbox=document.getElementsByClassName('el-message-box__content')[0];
            //             this.$nextTick(() => {
            //                agreementbox.style.border='1px solid red'
            //                 console.log(agreementbox.scrollTop,agreementbox.scrollHeight)
            //                 // agreementbox.scrollTop=0;
            //                 agreementbox.scrollIntoView(true)
            //             }) 
        }
    }
};
</script>
<style lang='less' scoped>
@bgColor: #f8f8f8;
@color: #478de2;
.login {
  height: 100%;
  background-color: @bgColor;
  display: flex;
  align-items: center;
  justify-content: center;
  .el-card {
    width: 912px;
    background-color: #fff;

    .el-tabs {
      width: 400px;
      margin: 0 auto;
    }
  }

  .agreement {
    width: 830px;
    margin: 30px 0;
    display: flex;
  }

  .register-success {
    padding: 73px 128px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    & > img {
      width: 256px;
      height: 256px;
    }
    .congratulation {
      position: relative;
      font-weight: 600;
      font-size: 24px;
      //   background:rgba(255,255,255,1);
      & > img {
        width: 32px;
        height: 32px;
        position: absolute;
        top: 0;
        left: -50px;
      }
    }
    .congratulation + p {
      font-size: 16px;
      color: #666666;
    }
  }
}
</style>
<style lang='less'>
.login {
  .el-card {
    .el-card__body {
      padding: 0;
      font-size: 0;

      .el-tabs {
        padding: 32px 0 42px;
      }

      .el-tabs__nav-scroll {
        display: flex;
        justify-content: center;
      }

      .el-tabs__nav-wrap::after {
        height: 0;
      }

      .code-item {
        .el-form-item__content {
          display: flex;

          .auth_input.el-input {
            margin-right: 8px;
          }
        }
      }
      .submitBtn {
        width: 100%;
      }
    }
  }
}

.service-agreement {
  width: 60%;
  max-width: 600px;
  height: 85%;
  padding: 30px 30px;
  display: flex;
  flex-direction: column;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .el-message-box__content {
    width: 100%;
    flex: 1;
    overflow: scroll;
    &::-webkit-scrollbar {
      display: none;
    }
  }
  .el-message-box__title {
    font-size: 25px;
    font-weight: 600;
    margin-bottom: 10px;
  }
}
</style>
