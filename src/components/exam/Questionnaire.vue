<template>
  <!--程序阅读题（选择题）-->
  <div class="container">
    <container-header :title="experName" :sub-title="'阶段' + phaseName"></container-header>
    <!--表单绑定做题结果-->
    <el-form :model="questionnaireForm" label-width="80px" label-position="top" ref="questionnaireFormRef">
      <div v-for="(question, index) in questionList" :key="index">
        <!--选择题-->
        <el-form-item :label="index + 1 + '. ' + question.content" v-if="question.type === 1">
          <!--选项-->
          <el-radio-group v-model="question.reply">
            <div v-for="(option, index) in question.options" :key="index">
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
        <el-button type="primary" @click="handleSubmit">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import ContainerHeader from '../common/ContainerHeader'
export default {
  name: 'Questionnaire',
  components: {
    ContainerHeader
  },
  data () {
    return {
      userInfo: {},
      questionnaireForm: {},
      // 程序阅读题目列表
      questionList: [],
      experName: '',
      phaseName: 0
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
      this.phaseName = this.userInfo.phaseNumber
    },
    // 获取问题列表
    async getQuestionList () {
      const { data: res } = await this.$http.post('exper/getnonprogquestion', {
        userId: this.userInfo.id,
        experId: this.userInfo.experId,
        phaseNumber: this.userInfo.phaseNumber
      })
      this.questionList = res.data
    },
    // 提交答案
    async handleSubmit () {
      // 生成答案
      const answers = []
      this.questionList.forEach((question) => {
        answers.push({
          questionId: question.questionId,
          reply: question.reply
        })
      })
      const { data: res } = await this.$http.post('exper/nonprogsubmit', {
        userId: this.userInfo.id,
        answers: answers
      })
      if (res.status !== 205) {
        return this.$message.error('提交答案出错')
      }
      this.$confirm('提交成功,是否开始下一阶段?', '提示', {
        type: 'success '
      }).then(() => {
        // TODO （后端请求）

      })
    },
    async gotoNextPhase () {
      // 更新阶段
      this.userInfo.phaseNumber = this.userInfo.phaseNumber + 1
      this.userInfo.questionNumber = 1
      sessionStorage.setItem('userInfo', JSON.stringify(this.userInfo))
      // 获取下一阶段实验类型
      const { data: res } = await this.$http.post('exper/getnextphasestatus', {
        userId: this.userInfo.id,
        experId: this.userInfo.experId,
        phaseNumber: this.userInfo.phase
      })
      if (res.data.isEnd === 1) {
        return this.$router.push('/exam/exam-end')
      }
      if (res.data.isProg === 0) {
        this.getQuestionList()
      } else {
        this.$router.push('/exam/programming')
      }
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
