<template>
    <div class="footer">
        <div class="fc-logo">
            <img src="/static/image/logo_ft.png"
                 alt=""
                 width="154px"
                 height="48px">
        </div>
        <!--TODO 修改底部链接 -->
        <!-- <p>
            <el-link href="/index" :underline="false">首页</el-link>
            <el-divider direction="vertical"></el-divider>
            <el-link href="/user/revisitList" :underline="false">我的图文问诊</el-link>
            <el-divider direction="vertical"></el-divider>
            <el-link href="/user/rtcRevisitList" :underline="false">我的视频复诊</el-link>
            <el-divider direction="vertical"></el-divider>
            <el-link href="/user/prescriptionList" :underline="false">我的处方</el-link>
            <el-divider direction="vertical"></el-divider>
            <el-link href="/user/revisitPaper" :underline="false">我的病历</el-link>
            <el-divider direction="vertical"></el-divider>
            <el-link href="/diseaseknowledge/list" :underline="false">疾病知识</el-link>
            <el-divider direction="vertical"></el-divider>
            <el-link href="/user/info" :underline="false">个人资料</el-link>
        </p> -->

        <p class="copyRight">
            Copyright &copy; 2019 海南方寸互联网医院
        </p>

    </div>
</template>

<script>
export default {
    methods: {}
}
</script>

<style lang="less" scoped>
.el-link {
  color: #fff;
}

.footer {
  font-size: 14px;
  text-align: center;

  .fc-logo {
    width: 160px;
    height: 48px;
    margin: 0 auto 24px;
  }

  p {
    color: #fff;

    &.copyRight {
      margin-top: 16px;
      color: #adadad;
      font-size: 12px;
    }
  }
}
</style>
<style>
</style>
