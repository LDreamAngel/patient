<template>
    <div class="im">
        <div class="im-hd border-b">
            <div class="im-hd-l">
                <img class="head-img"
                     :src="revisit_session.img_url">
            </div>
            <div class="im-hd-r">
                <p class="title">{{revisit_session.title}}</p>
                <p class="desc">{{revisit_session.desc}}</p>
            </div>
        </div>
        <div class="im-bd">
            <div class="pipe-list">
                <div v-for="msg in msgList"
                     class="cell"
                     :class="[msg.send_by === 'Self' ? 'right' : msg.send_by === 'System' ? 'system' : 'left']">
                    <template v-if="msg.send_by === 'System'">
                        <div class="system-bar">{{msg.content}}</div>
                    </template>
                    <template v-else>
                        <div class="time-bar">{{msg.ctime}}</div>
                        <div class="head">
                            <img class="head-img"
                                 :src="msg.headimg">
                        </div>
                        <div class="bubble"
                             @click="myCaseHistory(msg.objid,msg.type)">
                            <div v-if="msg.type === 'Picture'"
                                 class="image">
                                <viewer :images="imgList">
                                    <img v-for="val in imgList"
                                         :src="val.img"
                                         :key="val.id"
                                         v-show='val.img==msg.img && val.id==msg.id'
                                         style="width: 100%; height: 100%">
                                </viewer>
                            </div>
                            <!-- <div v-if="msg.type === 'Prescription'"
                                 class="image">
                                <el-image style="width: 100%; height: 100%"
                                          :src="msg.content"
                                          :preview-src-list="imgList">
                                </el-image>
                            </div> -->
                            <div v-else-if="msg.type === 'Prescription'"
                                 class="case-history">{{msg.content}}</div>
                            <div v-else-if="msg.type === 'Text'"
                                 class="content">{{msg.content}}</div>
                            <div class="case-history"
                                 v-else-if="msg.type === 'Paper'">{{msg.content}}</div>

                        </div>

                    </template>

                </div>
            </div>
        </div>
        <div class="im-ft border-t"
             v-if="revisit_session.status === '1' && isSend">
            <div class="tools-bar">
                <el-upload class="item"
                           name="imgfile"
                           :action="uploadUrl"
                           :show-file-list="false"
                           :on-success="handlePictureSuccess"
                           :on-error="handlePictureError"
                           :before-upload="beforePictureUpload"
                           :auto-upload='true'>
                    <el-button class="picture-btn"
                               type="text"
                               icon="el-icon-picture-outline">图片</el-button>
                </el-upload>
                <slot name="tools"></slot>
            </div>
            <div class="input-box">
                <el-input type="textarea"
                          :autosize="{ minRows: 3, maxRows: 3}"
                          resize="none"
                          placeholder="请输入内容"
                          v-model="content">
                </el-input>
            </div>
            <div class="send-bar">
                <span class="tip">按Enter键发送，Ctrl+Enter换行</span>
                <el-button class="send_btn"
                           type="primary"
                           @click="handleSendBtnClick">发 送</el-button>
            </div>
        </div>
        <caseHistory :caseHistoryPaper=caseHistoryPaper
                     :isCaseHistoryPaper=isCaseHistoryPaper
                     @closePaper='closePaper'></caseHistory>

    </div>
</template>

<script>
import request from '@/api/request'
import caseHistory from '@/pages/user/case-history'
// 

export default {
    // inject: ['reload'],
    data: () => {
        return {
            uploadUrl: '',
            content: '',
            lastMsgId: 0,
            msgList: [],
            imgList: [],
            caseHistoryPaper: {},
            isCaseHistoryPaper: false,
            isSend: true
        }
    },
    props: {
        revisit_session: Object,
    },
    components: { caseHistory },
    watch: {
        msgList: function (to, from) {
            this.imgList = [];
            to.forEach(val => {
                if (val.type == 'Picture') {
                    let re = this.imgList.find(item => item.id != val.id && item.img != val.img);
                    this.imgList.push({ img: val.img, id: val.id });
                }
            })
        }
    },
    methods: {
        init () {
            let self = this;

            self.uploadUrl = request.baseURL + '/picture/uploadjson';

            // 只监听与自己有关的session广播
            this.$eventHub.$on('session_' + self.revisit_session.id, self.handleSessionEvent);

            self.fetchMsg()
                .then(() => {
                    self.scrollBottom();
                });

            self.contentListener();
        },
        scrollBottom () {
            //设置滚动条到最底部
            this.$nextTick(() => {
                setTimeout(() => {
                    let ele = document.getElementsByClassName('im-bd')[0];
                    ele.scrollTop = ele.scrollHeight;
                }, 10)
            });
        },
        handleSessionEvent () {
            let self = this;

            self.fetchMsg()
                .then(() => {
                    self.scrollBottom();
                });
        },
        beforePictureUpload (file) {
            console.log('上传图片之前');
        },
        handlePictureSuccess (response, file) {
            console.log('图片上传成功');

            let self = this;

            if (response.errno === '0') {
                let data = response.data;
                self.sendPictureMsg(data.pictureid);
            }
        },
        handlePictureError (err, file) {
            console.log('文件上传失败');
        },
        handleSendBtnClick () {
            let self = this;
            // console.log('触发发送按钮点击事件');
            self.sendTxtMsg();
        },
        sendTxtMsg () {
            let self = this;
            if (self.content.trim().length === 0) {
                return;
            }

            self.sendMsgPost({
                revisit_session_id: self.revisit_session.id,
                revisit_msg_type: 'Text',
                content: self.content + "",
            });
            self.$nextTick(() => setTimeout(() =>  self.content = "", 0 ));
        },
        sendPictureMsg (pictureid) {
            let self = this;

            self.sendMsgPost({
                revisit_session_id: self.revisit_session.id,
                revisit_msg_type: 'Picture',
                pictureid: pictureid,
            }).then(() => {

                })
                .catch(() => {

                });
                
        },
        sendMsgPost (params) {
            let self = this;
            return new Promise((resolve, reject) => {
                self.$api.im.sendmsg(params)
                    .then(() => {
                        // console.log('发送成功');
                        resolve();

                        self.fetchMsg()
                            .then(() => self.scrollBottom());
                    })
                    .catch((err) => {
                        reject(err);
                    })
            });
        },
        fetchMsg () {
            let self = this;

            return new Promise((resolve, reject) => {
                self.$api.im.msglist({
                    last_revisit_msg_id: self.lastMsgId,
                    revisit_session_id: self.revisit_session.id
                })
                    .then(({ data }) => {

                        let msgs = data.msgs;
                        self.msgList = self.msgList.concat(msgs);
                        // console.log('ss', self.msgList,msgs)
                        if (msgs.length > 0) {
                            self.lastMsgId = msgs.pop().id
                        }
                        resolve();

                        let imgs = [];
                        msgs.forEach((msg) => {
                            if (msg.type === 'Picture') {
                                imgs.push(msg.img);
                            }
                        })
                        self.msgList.forEach(msg => {
                            if (msg.send_by == 'System' && msg.content == '本次图文问诊已结束') {
                                this.isSend = false;
                            }
                        })

                    })
                    .catch((err) => {
                        console.log('消息数据拉取失败');
                        reject(err);
                    });
            });
        },

        // 监听输入框
        contentListener () {
            let self = this;
            window.removeEventListener('keydown', self.onKeyDown);
            window.addEventListener('keydown', self.onKeyDown);
        },

        onKeyDown (e) {
            let self = this;
            if (e.target.type === 'textarea') {
                // (ctrl | command) + enter
                if ((e.ctrlKey || e.metaKey) && (e.key === 'Enter' || e.keyCode === 13)) {
                    self.content += '\r\n';
                } else if (e.key === 'Enter' || e.keyCode === 13) {
                    self.sendTxtMsg();
                }
            }
        },
        myCaseHistory (revisitpaperId, type) {
            let self = this;
            switch (type) {
                case 'Paper':
                    self.isCaseHistoryPaper = true;
                    self.$api.revisitpaper.one(revisitpaperId).then((res) => {
                        self.caseHistoryPaper = res.data.revisitpaper
                    })
            }
        },
        closePaper () {
            this.isCaseHistoryPaper = false
        }

    },
    created () {
        let self = this;
        self.init();
    },
    beforeDestroy () {
        this.$eventHub.$off('session_' + this.revisit_session.id);
        window.removeEventListener('keydown', self.onKeyDown);
    }
}
</script>

<style lang="less" scoped>
.im {
  height: 100%;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  .head {
    display: flex;
    align-items: center;
    height: 45px;
  }
  & > .im-hd {
    height: 80px;
    display: flex;

    .im-hd-l {
      padding: 16px 26px;

      .head-img {
        width: 48px;
        height: 48px;
        vertical-align: middle;
        border-radius: 24px;
      }
    }

    .im-hd-r {
      display: flex;
      flex-direction: column;
      justify-content: center;

      & > p {
        margin: 0;
      }

      .title {
        font-size: 18px;
        color: #333;
        margin-bottom: 4px;
      }

      .desc {
        font-size: 14px;
        color: #666666;
      }
    }
  }

  & > .im-bd {
    background-color: #f8f8f8;
    flex: 1;
    overflow: scroll;

    .pipe-list {
      padding: 1px 8px;

      .cell {
        display: flex;
        flex-direction: row-reverse;
        flex-wrap: wrap;
        margin: 24px 0;

        .time-bar {
          width: 100%;
          text-align: center;
          font-size: 12px;
          color: #999;
          margin-bottom: 16px;
        }

        .head-img {
          width: 32px;
          height: 32px;
          border-radius: 16px;
          text-align: center;
          margin: 0 16px;
          background-size: 45px;
          border: 1px solid #e5e5e5;
        }

        .bubble {
          width: fit-content;
          max-width: 57.4%;
          border-radius: 6px;
          word-break: break-all;
          position: relative;
          text-align: justify;

          .content {
            padding: 10px;
            font-size: 14px;
            white-space: pre-wrap;
            word-wrap: break-word;
            word-break: normal;
            line-height: 23px;
          }
          .case-history {
            color: #478de2;
            background: #fff;
            padding: 13px;
            font-size: 14px;
            white-space: pre-wrap;
            word-wrap: break-word;
            word-break: normal;
            cursor: pointer;
            // border:1px solid red;
          }

          .image {
            cursor: pointer;
            // border:1px solid green;
            max-width: 100%;
            padding: 8px 8px 3px;
          }
        }
        &.left {
          flex-direction: row;

          .bubble {
            color: #333;
            background-color: #fff;

            &:before {
              content: ' ';
              display: inline-block;
              height: 20px;
              width: 20px;
              background-color: #fff;

              position: absolute;
              z-index: 2;
              top: 15px;
              left: 0;

              border-width: 0 0 1px 1px;
              border-color: rgba(0, 0, 0, 0.2);
              border-style: solid;

              -webkit-transform: scale(0.5)
                matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
              -ms-transform: scale(0.5) matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
              transform: scale(0.5) matrix(0.71, 0.71, -0.71, 0.71, 0, 0);

              -webkit-transform-origin: 0 0;
              -ms-transform-origin: 0 0;
              transform-origin: 0 0;

              -webkit-box-sizing: border-box;
              box-sizing: border-box;

              border-bottom-left-radius: 2px;
            }
          }
        }

        &.right {
          .bubble {
            color: #fff;
            background-color: #478de2;

            &:before {
              content: ' ';
              display: inline-block;
              height: 20px;
              width: 20px;
              background-color: #478de2;

              position: absolute;
              z-index: 2;
              top: 15px;
              right: -20px;

              border-width: 1px 1px 0 0;
              border-color: rgba(0, 0, 0, 0.2);
              border-style: solid;

              -webkit-transform: scale(0.5)
                matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
              -ms-transform: scale(0.5) matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
              transform: scale(0.5) matrix(0.71, 0.71, -0.71, 0.71, 0, 0);

              -webkit-transform-origin: 0 0;
              -ms-transform-origin: 0 0;
              transform-origin: 0 0;

              -webkit-box-sizing: border-box;
              box-sizing: border-box;

              border-bottom-left-radius: 2px;
            }
          }
        }

        &.system {
          flex-direction: row;
          justify-content: center;

          .system-bar {
            width: 100%;
            text-align: center;
            font-size: 12px;
            color: #999;
            margin-bottom: 16px;
          }
        }
      }
    }
  }

  & > .im-ft {
    height: 160px;

    .tools-bar {
      height: 40px;
      padding: 0 24px;
      display: flex;

      button {
        /*font-size: 14px;*/
        color: #666;
        margin-right: 32px;
      }
    }

    .send-bar {
      height: 68px;
      padding: 0 24px 14px;
      box-sizing: border-box;
      text-align: right;

      .tip {
        font-size: 14px;
        color: #cacaca;
        margin-right: 16px;
      }

      /*.send_btn {*/
      /*    background-color: #478DE2;*/
      /*    border-color: #478DE2;*/
      /*}*/
    }
  }
}
</style>

<style>
.im .input-box textarea {
  border: none;
  padding: 5px 24px;
}
</style>
