<template>
  <!--程序阅读题（选择题）-->
  <div class="container">
    <container-header :title="experName" :sub-title="'阶段' + phaseName"></container-header>
    <!--表单绑定做题结果-->
    <el-form :model="form" label-width="80px" label-position="top">
      <div v-for="(question, index) in questionList" :key="index">
        <!--选择题-->
        <el-form-item :label="index + 1 + '. ' + question.content" v-if="question.type === 1">
          <!--选项-->
          <el-radio-group v-model="question.reply">
            <div v-for="(option, index) in JSON.parse(question.options)" :key="index">
              <el-radio :label="String.fromCharCode('A'.charCodeAt(0)+ index)" border >
                {{ option }}</el-radio>
            </div>
          </el-radio-group>
        </el-form-item>
        <!--问答题-->
        <el-form-item :label="index + 1 + '. ' + question.content" v-else-if="question.type === 2">
          <!--答题区域-->
          <el-input type="textarea" v-model="question.reply" placeholder="请在此作答"></el-input>
        </el-form-item>
      </div>
      <!--提交所有结果-->
      <el-form-item class="button-box">
        <el-button type="primary" @click="onSubmit">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import ContainerHeader from '../common/ContainerHeader'
export default {
  name: 'Questionaire',
  components: {
    ContainerHeader
  },
  data () {
    return {
      userInfo: {},
      form: {},
      // 程序阅读题目列表
      questionList: [],
      experName: '',
      phaseName: ''
    }
  },
  created () {
    this.getExperimentInfo()
    this.getQuestionList()
  },
  methods: {
    // 获取实验信息
    getExperimentInfo () {
      this.userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
      this.experName = this.userInfo.experName
      this.phaseName = this.userInfo.phase
    },
    // 获取问题列表
    async getQuestionList () {
      const { data: res } = await this.$http.post('exper/getnonprogquestion', {
        userId: this.userInfo.id,
        experId: this.userInfo.experId,
        phaseNumber: this.userInfo.phase
      })
      this.questionList = res.data
      console.log(this.questionList)
    },
    // 提交做题结果
    onSubmit () {
      // this.questionList.forEach((question, index) => {
      //   console.log(index + ' ' + question.choice)
      // })
      this.$router.push('/exam/programming')
    },
    // 到下个阶段
    gotoNextPhase () {

    }
  }
}
</script>

<style lang="less" scoped>
.el-radio {
  margin-top: 5px;
  margin-left: 10px;
  display: block;
  width: 100%;
}

.button-box {
  display:flex;
  justify-content:center;
}
</style>
