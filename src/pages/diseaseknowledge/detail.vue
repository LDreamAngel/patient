<template>
    <div class="diseaseknowledge-detail">
        <el-container>
            <el-main class="currentlesson">
                <el-card class="box-card">
                    <h3 class="title">{{lesson.title}}</h3>
                    <p class="time">{{lesson.ctime}}</p>
                    <p v-html="lesson.content"></p>
                </el-card>
            </el-main>
            <el-aside class="recommendlesson"
                      width="360px">
                <el-card class="box-card">
                    <div slot="header"
                         class="clearfix">
                        <span>推荐文章</span>
                    </div>
                    <div class="lesson"
                         v-for="(lesson,index) in recommend_lessons"
                         :key="index"
                         @click="goLessonDetail(lesson.id)">
                        <el-container class="lesson-item">
                            <el-aside width="auto">
                                <el-image class="recommendlessonpicture"
                                          :src="lesson.picture"></el-image>
                            </el-aside>
                            <el-main>
                                <h5 class="title">{{lesson.title}}</h5>
                                <p class="createtime">{{lesson.createtime}}</p>
                            </el-main>
                        </el-container>
                    </div>
                </el-card>
            </el-aside>
        </el-container>
    </div>
</template>

<script>
export default {
    data () {
        return {
            lessonid: 0,
            lesson: {},
            recommend_lessons: {},
        }
    },
    created () {
        let self = this;
        let routeparams = self.$route.query;
        self.lessonid = routeparams.lessonid
        if (typeof self.lessonid !== 'undefined' && self.lessonid !== 0) {
            self.fetchData();
        }
    },
    methods: {
        fetchData () {
            let self = this;
            self.$api.lesson.one({
                lessonid: self.lessonid
            }).then(({ data }) => {
                self.lesson = data.oneLesson;
                self.recommend_lessons = data.recommend_lessons;
            })
        },
        goLessonDetail (lessonid) {
            let self = this;
            self.lessonid = lessonid;
            self.fetchData();
        }
    }
}
</script>

<style lang='less' scoped>
.diseaseknowledge-detail {
    cursor:pointer;
  .lesson-item {
    margin: 5px 0;
    &:hover {
      background: #f9f9f9;
    }
  }
  .currentlesson {
    padding-right: 20px;
    .time {
      color: #999999;
      font-size: 14px;
    }
  }


  .recommendlesson {
    padding-left: 20px;

    .title {
      font-weight: lighter;
      color: #333333;
      margin-top: 0;
      vertical-align: middle;
    }

    .recommendlessonpicture {
      width: 80px;
      height: 80px;
      vertical-align: middle;
    }
  }
}
</style>
