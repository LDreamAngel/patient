<template>
    <div class="userbar">
        <el-card class="user-info" v-if="user">
            <div class="demo-basic--circle">
                <div class="block">
                    <el-avatar :size="78" :src="user.headimg"></el-avatar>
                </div>
                <p class="username">{{user.name}}</p>
                <p class="telephone">{{user.mobile}}</p>
            </div>
        </el-card>
        <el-menu :router="true" :unique-opened="true" :default-active="$route.path" mode="vertical"
                 class="el-menu-vertical-demo">
            <el-menu-item index="/user/revisitList">
                我的图文问诊
            </el-menu-item>
            <el-menu-item index="/user/rtcRevisitList">
                视频问诊
            </el-menu-item>
            <el-menu-item index="/user/prescriptionList">
                我的处方
            </el-menu-item>
            <el-menu-item index="/user/revisitPaper">
                我的病历
            </el-menu-item>
            <el-menu-item index="/user/info">
                个人资料
            </el-menu-item>
        </el-menu>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                circleUrl: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
            }
        },
        // 判断路由
        mounted() {
            this.path = this.$route.path;
        },
        computed:{
            user:function () {
                return this.$store.state.currentUser;
            }
        },
        watch: {
            $route(to, from) {
                this.path = to.path
            }
        },
    }
</script>

<style lang="less" scoped>
    .userbar {
        background-color: #fff;

        .user-info {
            box-sizing: border-box;
            width: 264px;
            height: 200px;
            margin-bottom: 8px;

            .username, .telephone {
                font-size: 14px;
            }

            .username {
                color: #333;
            }

            .telephone {
                color: #999;
            }
        }
        .el-menu {
            border-right: none;
        }
        .el-card {
            border: none;
        }
    }
</style>
<style lang="less">
    .userbar {
        .el-card__body {
            text-align: center;

            .el-avatar {
                margin-bottom: 20px;
            }

            .username {
                margin-bottom: 4px;
            }

            .el-aside {
                overflow: hidden;
            }
        }
    }
</style>
