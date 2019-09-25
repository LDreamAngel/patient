<template>
    <div class="revisit-room">
        <template>
            <el-card class="user-info">
                <span>我的诉求</span>
                <el-divider></el-divider>
                <div>
                    <h5 class="title">疾病确诊医院</h5>
                    <p>{{patientinfo.hospital_name}}</p>
                    <h5 class="title">疾病病历</h5>
                    <viewer :images="[]">
                        <img :src="patientinfo.medical_image"
                             style="width: 100px; height: 100px;cursor: pointer;">
                    </viewer>
                    <!-- <el-image style="width: 100px; height: 100px"
                              :src="patientinfo.medical_image" :preview-src-list="bigimage">
                              </el-image> -->
                    <h5 class="title">本次咨询的疾病名称和症状</h5>
                    <p>{{patientinfo.disease_name_symptom}}</p>
                    <h5 class="title">病情主诉</h5>
                    <p>{{patientinfo.chief_complaint}}</p>
                    <h5 class="title">本次咨询想获得医生什么帮助</h5>
                    <p>{{patientinfo.want_help}}</p>
                </div>
            </el-card>
        </template>
        <template v-if="revisit_session != null">
            <IM :revisit_session="revisit_session"
                class="im">
                <!-- <template slot="tools"  v-if="revisit_session.status === '1'">
                    <el-button class="prescription-btn" type="text" icon="el-icon-video-camera">结束问诊</el-button>
                </template> -->
            </IM>
        </template>

        <template v-if="revisit_session !== null && revisit_session.status === '1' && rtc_video.roomid !== ''">
            <rtc_video :rtc_video="rtc_video"></rtc_video>
        </template>
    </div>
</template>

<script>
import IM from '@/components/IM';
import rtc_video from '@/components/rtc_video';


export default {
    data () {
        return {
            revisit_session_id: 0,
            revisit_session: null,
            rtc_video: {},
            patientinfo: {}
        }
    },
    components: {
        IM,
        rtc_video
    },
    created () {
        let self = this;
        self.$api.revisitsession.getapply({ revisit_session_id: self.$route.params['id'] }).then(res => {
            self.patientinfo = res.data;
        })
        self.init();
    },
    methods: {
        init () {
            let self = this;

            self.revisit_session_id = self.$route.params['id'];

            let data = {
                revisit_session_id: self.revisit_session_id
            };

            self.$api.im.chat(data)
                .then(({ data }) => {
                    self.revisit_session = data.revisit_session;
                    self.rtc_video = data.rtc_video;
                })
        }
    }
}
</script>

<style scoped lang='less'>
.revisit-room {
  height: calc(100vh - 64px - 24px - 48px);
  padding: 24px;
  box-sizing: border-box;
  display: flex;
  .user-info {
    width: 40%;
    height: 85%;
    margin-right: 20px;
    overflow: auto;
  }

  .im {
    width: 60%;
  }
  p {
    width: 100%;
    word-break: break-all;
    word-wrap: break-word;
  }
}
</style>
