<template>
    <div class="header">
        <div class="fc-logo">
            <img src="/static/image/logo_hd.png"
                 alt=""
                 width="105px"
                 height="32px">
        </div>

        <div style="padding: 0 20%;">
            <el-menu class="el-menu-vertical-demo"
                     :unique-opened="true"
                     :default-active="$route.path"
                     mode="horizontal"
                     @select="selectMenu">
                <el-menu-item index="/index">
                    首页
                </el-menu-item>
                <el-menu-item index="/user/revisitList">
                    我的图文问诊
                </el-menu-item>
                <el-menu-item index="/user/rtcRevisitList">
                    我的视频问诊
                </el-menu-item>
                <el-menu-item index="/user/prescriptionList">
                    我的处方
                </el-menu-item>
                <el-menu-item index="/user/revisitPaper">
                    我的病历
                </el-menu-item>
                <!-- <el-menu-item index="/diseaseknowledge/list">
                    疾病知识
                </el-menu-item> -->
                <el-menu-item index="/user/info">
                    个人资料
                </el-menu-item>
            </el-menu>
        </div>

        <div class="button"
             v-if="isLogin">
            <el-badge :value="noticeCnt"
                      :hidden="noticeCnt === 0"
                      class="item">
                <el-button class="news"
                           icon="el-icon-bell"
                           type="text"
                           @click="goSession()"></el-button>
            </el-badge>
            <el-button slot="reference"
                       class="user"
                       icon="el-icon-user"
                       type="text"
                       @click='selectMenu("/user/info")'>{{user.name}}
            </el-button>
            <el-divider direction="vertical"></el-divider>
            <el-button class="logout"
                       type="text"
                       @click.prevent="logout">退出登录
            </el-button>
        </div>
        <div class="button"
             v-else>
<!--            <el-button class="user"-->
<!--                       icon="el-icon-user"-->
<!--                       type="text"></el-button>-->
            <el-button class="logout"
                       type="text"
                       @click="goLogin">登录
            </el-button>
            <el-divider direction="vertical"></el-divider>
            <el-button type="text"
                       @click="goRegister">注册
            </el-button>
        </div>
    </div>
</template>

<script>

    export default {
        inject: ['reload'],
        data() {
            return {
                navselected: '',
                path: '',
            }
        },
        created() {
            this.init()
        },
        // 判断路由
        mounted() {
            this.path = this.$route.path;
        },
        computed: {
            user() {
                return this.$store.state.currentUser;
            },
            noticeCnt() {
                return this.$store.state.notice.cnt
            },
            isLogin() {
                return this.$store.state.isLogin
            }
        },
        watch: {
            $route(to, from) {
                this.path = to.path
            }
        },
        methods: {
            init() {
                this.$eventHub.$on('notice', ({total_cnt, sessionid}) => {
                    this.$store.commit('updateNoticeCnt', {total_cnt, sessionid});
                });
            },
            goLogin() {
                // 跳转回登录页面
                this.$router.push({name: 'login'});
            },
            selectMenu(index) {
                this.$router.push({path: index});

            },
            goRegister() {
                // 跳转回登录页面
                this.$router.push({
                    name: 'login', params: {
                        action: 'register'
                    }
                });
            },
            logout() {
                let self = this;
                self.$confirm('是否确定退出?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(({data}) => {
                    // 清除 window.localStorage
                    self.$store.dispatch('setUser', null);
                    window.localStorage.removeItem('token');
                    self.$message({
                        type: 'success',
                        message: '退出成功!'
                    });

                    this.reload();
                })
            },
            goSession() {
                let sessionid = this.$store.state.notice.sessionid;
                if (sessionid > 0) {
                    this.$router.push('/revisit/session/' + this.$store.state.notice.sessionid);
                }
            }
        }
    }
</script>

<style scoped>
</style>
<style lang='less'>
    @color: #478de2;
    @bgColor: #478de2;
    .header {
        position: relative;
        height: 64px;
        line-height: 64px;

        .fc-logo,
        .el-menu,
        .button {
            position: relative;
            max-height: 64px;
        }

        .fc-logo {
            position: absolute;
            left: 0;
            width: 120px;
            height: 64px;
            line-height: 64px;
            color: #adadad;
            font-size: 12px;

            img {
                display: inline-block;
                margin-top: 16px;
            }
        }

        .el-menu {
            overflow: hidden;
            white-space: nowrap;

            & > .el-menu-item {
                display: inline-block;
                float: none;
                height: 64px;
                line-height: 64px;
                color: #383838;
            }

            &.el-menu--horizontal {
                border-bottom: 0;

                & > .el-menu-item,
                & > .el-menu-item.is-active {
                    border-bottom: 0;
                }

                & > .el-menu-item.is-active {
                    color: @color;
                }

                & > .el-menu-item:hover {
                    color: @color;
                }
            }
        }

        .button {
            position: absolute;
            right: 0;
            top: 0;
            background-color: #fff;

            .el-badge__content {
                &.is-fixed {
                    top: 25px;
                    right: 22px;
                }
            }

            .el-badge {
                .news {
                    margin-right: 16px;
                }
            }

            .el-button--text {
                color: #383838;

                &:hover {
                    color: @color;
                }
            }
        }
    }
</style>
