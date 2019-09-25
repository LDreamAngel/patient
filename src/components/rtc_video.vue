<template>
    <div class="rtc_video" v-suspension>
        <div class="other_rtc">
            <p class="reminder">视频接入中......</p>
        </div>
        <div class="my_rtc" id="my_rtc"></div>
    </div>
</template>

<script>
    import '@/lib/directives.js'

    export default {
        data() {
            return {
                rtc: null
            }
        },

        props: {
            rtc_video: Object
        },

        created() {
            let self = this;

            self.initRTC();

            self.eventMonitoring();
        },

        methods: {
            initRTC() {
                let self = this;

                self.rtc = window.fc_rtc;
                if (!self.rtc) {
                    self.rtc = new Rtc({
                        userid: self.rtc_video.userid, // 用户ID
                        sessionid: self.rtc_video.sessionid // sessionid
                    });

                    window.fc_rtc = self.rtc;
                } else {
                    ATLAS.connect = 0;

                    // CCSDK向window注入了rtc
                    self.rtc = fc_rtc;
                    self.rtc.join();
                }
            },

            eventMonitoring() {
                let self = this,
                    rtc = self.rtc;

                console.log('调用eventMonitoring');

                rtc.on('login_success', function (data) {
                    // 账号登录成功
                    console.log(data, 'login_success');
                    self.startLive();
                });

                rtc.on('login_failed', function (err) {
                    // 账号登录失败
                    console.error('登录失败', err);
                });

                rtc.on('conference_join', function (streams) {
                    // 加入房间成功
                    console.log('conference_join', streams);
                });

                rtc.on('conference_join_failed', function (err) {
                    // 加入房间失败
                    console.log('加入房间失败', err);
                });

                rtc.on('stream_removed', function (id) {
                    // 房间内有流退出或中断，移除相应dom
                    console.log('stream_removed', id);
                    //将本地放该流的dom移除掉
                });

                rtc.on('allow_sub', function (stream) {
                    // 订阅流
                    if (stream.isMixed()) {
                        console.log('是混合流,不定阅');
                    } else {
                        // 订阅流
                        rtc.trySubscribeStream({
                            tryStream: stream,
                            success: function (stream) {
                                // 订阅流成功
                                var streamId = stream.id(); // 获取流id
                                console.log('订阅流成功', streamId);

                                //将视频插入到其他流盒子中
                                document.getElementsByClassName('other_rtc')[0].setAttribute('id', streamId);
                                stream.show(streamId);
                            },
                            fail: function (err) {
                                console.log(err);
                            }
                        });
                    }
                });

                rtc.on('server_disconnected', function (stream) {
                    // 订阅流
                    console.log('订阅流');

                });

                rtc.on('unSub', function (stream) {
                    rtc.unSubscribeStream({
                        unSubStream: stream,
                        success: function (id) {
                            console.log('取消订阅成功', id);
                        },
                        fail: function (err) {
                            console.log('取消订阅失败', err);
                        }
                    })
                });
            },

            startLive() {
                let self = this,
                    rtc = self.rtc;

                console.log('调用 startLive');
                // 查询直播状态
                rtc.getLiveStat({
                    success: function () {
                        // 创建本地流推流
                        self.createStreamPublish();
                    },
                    fail: function () {
                        // 开启直播
                        rtc.startLive({
                            success: function () {
                                // 创建本地流推流
                                self.createStreamPublish();
                            }
                        });
                    }
                });
            },

            // 创建并推送本地流
            createStreamPublish() {
                let self = this,
                    rtc = self.rtc;

                rtc.createLocalStream({
                    streamName: 'main',
                    createData: {
                        resolution: '720P'
                    },
                    success: function (stream) {
                        // 将本地流显示在id 为 'my_rtc' 的盒子里
                        stream.show('my_rtc');
                        console.log('创建本地流');

                        // 推送本地流
                        rtc.publish({
                            streamName: 'main',
                            success: function (stream) {
                                console.log('本地流推送成功');
                            }
                        });

                    },
                    fail: function (err) {
                        console.log(err);
                    }
                });
            },

            closeVideo() {
                let self = this;

                self.rtc.closeVideo({
                    streamName: 'main',
                    success: function () {

                    },
                    fail: function (str) {
                        console.log(str);
                    }
                });
            },

            unPublish() {
                let self = this;

                self.rtc.unPublish({
                    streamName: 'main',

                    success: function (id) {
                        console.log('取消本地流推送成功', id);
                    },
                    fail: function (str) {
                        console.log(str);
                    }
                });
            },

            stopLive() {
                let self = this;

                self.rtc.stopLive({
                    success: function () {
                        console.log('关闭直播成功');
                    },
                    fail: function (str) {
                        console.log(str);
                    }
                });
            },

            stopRevisitSession() {
                let self = this;

                self.unPublish();
                self.closeVideo();
                self.stopLive();
            }
        },

        beforeDestroy() {
            let self = this,
                rtc = self.rtc;

            self.closeVideo();

            rtc.closeRemoteStreams();

            rtc.leave();
        }
    }
</script>

<style scoped>
    * {
        padding: 0;
        margin: 0;
        box-sizing: border-box;
    }

    body, html {
        width: 100%;
        height: 100%;
        padding: 10px;
    }

    .rtc_video {
        position: absolute;
        z-index: 2000;
        top: 60px;
        left: 60px;
    }

    .other_rtc {
        /*width: 800px;*/
        /*height: 600px;*/
        width: 450px;
        height: 450px;
        border: 1px solid #478DE2;
        background-color: #000;
    }

    .other_rtc .reminder {
        color: #fff;
        width: 180px;
        font-size: 25px;
        font-weight: 900;
        margin: 50%;
        transform: translateX(-50%) translateY(-50%);
    }


    #my_rtc {
        /*width: 200px;*/
        /*height: 170px;*/
        width: 150px;
        height: 150px;
        /* border:1px solid red; */
        position: absolute;
        bottom: 0;
        right: 0;
    }
</style>
