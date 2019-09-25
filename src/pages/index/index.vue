<template>
    <div class="index">
        <img src="/static/image/banner.png"
             alt=""
             class="banner">
        <el-card class="box-card recommend"
                 shadow="never">
            <span class="title">科室选择</span>
            <el-tabs type="card">
                <el-tab-pane :label="faculty.title"
                             v-for="(faculty,index) in facultys"
                             :key="index">
                    <div>
                        <el-row :gutter="30">

                            <el-col class="doctor"
                                    :span="6"
                                    v-for="(doctor,index) in doctorData[faculty.id]"
                                    :key="index"
                                    ref="doctorList">
                                <img src="/static/image/icon/certified 5@2x.png"
                                     alt=""
                                     v-if='doctor.certified==="1"'
                                     class="certified" />
                                <el-card class="box-card"
                                         shadow="never"
                                         :body-style="{'background-color': '#FFF','padding':0,'height': '300px'}">

                                    <div class="info">
                                        <el-avatar :size="80"
                                                   :src="doctor.headimg"></el-avatar>

                                        <p class="title">
                                            <span>{{doctor.name}} {{doctor.title}}</span>
                                        </p>
                                        <p class="hospital">{{doctor.hospital}}</p>
                                        <p class="faculty">{{doctor.faculty}}</p>
                                        <p class="be_good_at">
                                            <span v-if="doctor.be_good_at">
                                                擅长： {{doctor.be_good_at.substring(0,26)}}
                                            </span>
                                            <el-popover transition="fade-in-linear"
                                                        placement="top-start"
                                                        width="300"
                                                        trigger="hover"
                                                        :content="doctor.be_good_at">
                                                <el-link slot="reference"
                                                         type="primary"
                                                         v-if="doctor.be_good_at && doctor.be_good_at.length > 26"
                                                         :underline="false">
                                                    <span class="more">...更多</span>
                                                </el-link>
                                            </el-popover>

                                        </p>
                                    </div>

                                    <el-button-group>
                                        <el-button class="revisit-btn"
                                                   @click="showRevisitForm('revisit', doctor.id)"
                                                   type="text"
                                                   :round="false"
                                                   icon="el-icon-picture-outline"
                                                   :disabled="doctor.can_revisit != 1">图文问诊
                                        </el-button>
                                        <el-button class="rtcrevisit-btn"
                                                   @click="showRevisitForm('rtcrevisit', doctor.id)"
                                                   type="text"
                                                   :round="false"
                                                   icon="el-icon-video-camera"
                                                   :disabled="doctor.can_rtcrevisit != 1">视频问诊
                                        </el-button>
                                    </el-button-group>
                                </el-card>
                            </el-col>
                        </el-row>
                    </div>
                    <el-row :gutter="20"
                            v-if='doctorData[faculty.id].length>=8 '>
                        <el-col :span="24"
                                :offset="11">
                            <el-button size="mini"
                                       plain
                                       @click="loadMoreDoctor(faculty.id)"
                                       v-if='loadMoreDoctorShow'>加载更多
                            </el-button>
                            <el-button size="mini"
                                       plain
                                       @click="packUpDoctor()"
                                       v-if='!loadMoreDoctorShow'>点击收起
                            </el-button>
                        </el-col>
                    </el-row>

                </el-tab-pane>
            </el-tabs>
        </el-card>

        <el-card class="box-card"
                 shadow="never">
            <div slot="header"
                 class="clearfix">
                <span>推荐文章</span>
            </div>
            <div class="lesson"
                 v-for="(lesson,index) in lessons"
                 :key="index"
                 :data-id="lesson.id"
                 @click="goLessonDetail(lesson.id)">
                <el-container>
                    <el-aside class="aside"
                              width="160px">
                        <el-image class="picture"
                                  :src="lesson.picture"></el-image>
                    </el-aside>
                    <el-main class="lesson-info">
                        <h4 class="title">{{lesson.title}}</h4>
                        <p class="brief">{{lesson.brief}}</p>
                        <p class="time">{{lesson.ctime}}</p>
                    </el-main>
                </el-container>
            </div>

            <el-button size="mini"
                       plain
                       @click="diseaseknowledgeList()"
                       class="diseaseknowledge-list">加载更多...
            </el-button>

        </el-card>

        <!--     问诊前信息收集表单   -->
        <RevisitForm ref="revisit_form"
                     :doctorid="doctorid"
                     :revisit_type="revisit_type"></RevisitForm>
    </div>
</template>

<script>
import RevisitForm from '@/components/RevisitForm';

export default {
    data () {
        return {
            facultys: [],
            doctorData: [],
            lessons: [],
            activeName: '',
            doctorid: 0,
            revisit_type: '',
            hospital_name: '',
            medical_image: '',
            disease_name_symptom: '',
            chief_complaint: '',
            want_help: '',
            imageUrl: '',
            loadMoreDoctorShow: true,
        }
    },
    components: { RevisitForm },
    created () {
        this.fetchData();

    },
    methods: {
        packUpDoctor () {
            this.loadMoreDoctorShow = true;
            this.$refs.doctorList.forEach((val, i) => {
                if (i > 8) {
                    val.$el.style.display = 'none'
                }
            })
        },
        showRevisitForm (type, doctorid) {
            let self = this;
            self.$api.revisitsession.canrevisit({
                revisit_type: type,
                doctorid: doctorid
            }).then(() => {
                self.doctorid = doctorid;
                self.revisit_type = type;
                self.$refs.revisit_form.show();
            }).catch(err => {
                if (err.errno === '50006') {
                    this.$router.push({
                        path: '/revisit/session/' + err.data.revisit_session_id
                    })
                }
            })
        },
        loadMoreDoctor (facultyid) {
            let self = this;
            self.$api.index.getalldoctors({
                facultyid: facultyid
            }).then(({ data }) => {
                self.doctorData[facultyid] = data;
            })
            self.loadMoreDoctorShow = false;
            this.$refs.doctorList.forEach((val, i) => {
                val.$el.style.display = 'block'
            })
        },
        fetchData () {
            let self = this;
            self.$api.index.index().then(({ data }) => {
                self.facultys = data.faculty;
                self.doctorData = data.doctorData;
                self.lessons = data.lessons;
                console.log('医生' + data.doctorData)
            })
        },
        getDotType (value) {
            let type = '';
            switch (value) {
                case '0':
                    type = 'primary';
                    break;

                case '1':
                    type = 'success';
                    break;

                case '2':
                    type = 'info';
                    break;

                case '3':
                    type = 'danger';
                    break;

                case '4':
                    type = 'warning';
                    break;

                default:
                    break;
            }

            return type;
        },
        goLessonDetail (lessonid) {
            this.$router.push({
                path: '/diseaseknowledge/detail', query: {
                    lessonid: lessonid
                }
            })
        },
        diseaseknowledgeList () {
            this.$router.push({ name: 'diseaseknowledge-list' })
        }
    }
}
</script>

<style lang='less' scoped>
@color: #478de2;
@bgColor: #478de2;

.diseaseknowledge-list {
  margin-left: 500px;
}
.el-main {
  .index {
    width: 1128px;
    margin: 0 auto;

    & > .box-card {
      margin-top: 24px;

      .certified {
        width: 14px;
        height: 14px;
        position: relative;
        top: 102px;
        left: 143px;
      }
    }

    .recommend .title {
      display: block;
      padding-bottom: 20px;
    }

    .el-card__body {
      padding: 24px;
    }

    .beforerevisitquestionform {
      width: 500px;
      padding-left: 50px;
    }

    .banner {
      width: 1128px;
      height: 288px;
    }

    .doctor {
      margin-bottom: 30px;

      .info {
        text-align: center;
        padding: 15px;
        // border: 1px solid red;

        .hospital {
          margin: 5px 0;
          color: #999999;
          font-size: 12px;
        }

        .title {
          padding-bottom: 0px;
          margin: 5px 0;
          color: #333333;
          font-size: 14px;
          font-weight: bold;
        }

        .faculty {
          margin: 5px 0;
          color: #999999;
          font-size: 12px;
        }

        .be_good_at {
          margin: 0px;
          padding: 10px 10px 10px;
          text-align: justify;
          color: #999999;

          span {
            font-size: 12px;
          }
        }
      }

      .be_good_at .more {
        font-size: 12px;
      }

      .el-button-group {
        width: 100%;
        height: 50px;
        background-color: #f6f9fd;
        color: #478de2;
        padding-top: 10px;
        border-top: #e8e8e8 1px solid;

        .revisit-btn,
        .rtcrevisit-btn {
          border-radius: 0;
          width: 50%;
          height: 30px;
          padding: 0;
        }

        .revisit-btn {
          border-right: #e8e8e8 1px solid;
        }
      }
    }

    .lesson {
      margin-bottom: 20px;
      height: 150px;
      cursor: pointer;
      
      .picture {
        width: 160px;
        height: 150px;
      }

      .lesson-info {
        position: relative;

        .title,
        .time,
        .brief {
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
        }

        .title,
        .createtime {
          margin: 5px 0;
          -webkit-line-clamp: 2;
        }

        .brief {
          color: #666666;
          font-size: 14px;
          -webkit-line-clamp: 3;
        }

        .time {
          position: absolute;
          height: 20px;
          bottom: 0;
          color: #999999;
          font-size: 14px;
        }
      }
    }
  }

  .form-before-consultatio {
    background-color: #fff;
  }

  .el-main {
    overflow: hidden;
  }
}
</style>


