<template>
    <div id="app">
        <template v-if="isRouterAlive">
            <el-container v-if="showContainer">           
                <el-header>
                    <Header/>
                </el-header>
                <el-container>
                    <el-aside v-if="showAside" width="264px">
                        <UserBar/>
                    </el-aside>
                    <el-main>
                        <router-view></router-view>
                    </el-main>
                </el-container>
                <el-footer v-if="showFooter" height="185px">
                    <Footer/>
                </el-footer>
            </el-container>
            <router-view v-else></router-view>
        </template>
        
    </div>
</template>

<script>
    import Header from '@/pages/common/header'
    import Footer from '@/pages/common/footer'
    import UserBar from '@/pages/common/userbar'
    import im from '@/lib/im'

    export default {
        name: 'App',
        provide() {
            return {
                reload: this.reload
            }
        },
        data() {
            return {
                isRouterAlive: true
            }
        },
        components: {
            Header,
            Footer,
            UserBar
        },
        methods: {
            reload() {
                if (this.$route.meta.requireAuth && !this.isLogin) {
                    this.$router.push({
                        path: "/login",
                        query: {redirect: this.$route.fullPath}//从哪个页面跳转;
                    });
                } else {
                    this.isRouterAlive = false;
                    // 当前路由页面需要登录访问，且当前未登录
                    this.$nextTick(() => {
                        this.isRouterAlive = true
                    });
                }
            },
            updateIM() {
                if (this.isLogin) {
                    im.init();
                } else {
                    im.destroy();
                }
            }
        },
        computed: {
            // 默认true
            showContainer() {
                let showContainer = this.$route.meta.showContainer;

                return showContainer === undefined ? true : showContainer;
            },
            // 默认false
            showAside() {
                let showAside = this.$route.meta.showAside;

                return showAside === undefined ? false : showAside;
            },
            showFooter() {
                let showFooter = this.$route.meta.showFooter;

                return showFooter === undefined ? true : showFooter;
            },
            isLogin() {
                return this.$store.state.isLogin;
            }
        },
        watch: {
            'isLogin': 'updateIM',
            $route(to, from) {
                // console.log(to.name==='')
                this.sessionId = to.params.id
                if (this.$store.state.isLogin) {
                    this.$store.dispatch('updateRevisitSessionId', this.sessionId);
                    // im.init();
                }
            }
        },
        mounted() {
            this.updateIM();
        }
    }
</script>
<style lang="less">
    * {
        box-sizing: border-box;
    }

    html {
        height: 100%;
    }

    body {
        margin: 0;
        height: 100%;

        #app {
            width: 100%;
            height: 100%;

            & > .el-container.is-vertical {
                min-height: 100%;
                background-color: #f8f8f8;

                & > .el-header {
                    height: 64px !important;
                    padding: 0 80px;
                    background-color: #fff;
                }

                & > .el-container {
                    width: 1128px;
                    margin: 0 auto;
                    padding: 24px 0 48px;

                    .el-aside {
                        margin-right: 24px;
                    }

                    .el-main {
                        padding: 0;
                    }
                }

                & > .el-footer {
                    padding: 48px 0;
                    background-color: #333;
                }
            }

        }
    }
</style>
