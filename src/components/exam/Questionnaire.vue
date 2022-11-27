<template>
  <!--程序阅读题（选择题）-->
  <div class="container">
    <container-header :title="experName" :sub-title="'阶段' + phaseName"></container-header>
    <!--表单绑定做题结果-->
    <el-form label-width="80px" label-position="top"
             :model="question" :ref="'questionnaireFormRef' + questionIndex" :rules="questionnaireFormRules"
             v-for="(question, questionIndex) in questionList" :key="questionIndex">
      <!--选择题-->
      <el-form-item :label="questionIndex + 1 + '. ' + question.content" v-if="question.type === 1"
                    prop="reply">
        <el-radio-group v-model="question.reply">
          <div v-for="(option, index) in question.options" :key="index">
            <el-radio :label="String.fromCharCode('A'.charCodeAt(0)+ index)" border >
              {{ option }}</el-radio>
          </div>
        </el-radio-group>
      </el-form-item>
      <!--问答题-->
      <el-form-item :label="questionIndex + 1 + '. ' + question.content" v-else-if="question.type === 2"
                    prop="reply">
        <el-input type="textarea" v-model="question.reply" placeholder="请在此作答"></el-input>
      </el-form-item>
    </el-form>
    <!--提交所有结果-->
    <div class="button-box">
      <el-button type="primary" @click="handleSubmit" :loading="loading">提交</el-button>
    </div>
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
      phaseName: 0,
      questionnaireFormRules: {
        reply: [
          { required: true, message: '请填写答案', trigger: 'change' }
        ]
      },
      loading: false
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

    validateAllForm (index, count, fun) {
      if (index === count) {
        fun()
        return
      }
      this.$refs['questionnaireFormRef' + index][0].validate((valid) => {
        if (valid) {
          this.validateAllForm(index + 1, count, fun)
        } else {
          this.$message.warning('存在题目未作答，请仔细查看')
          return false
        }
      })
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
      this.validateAllForm(0, this.questionList.length, async () => {
        this.loading = true
        const { data: res } = await this.$http.post('exper/nonprogsubmit', {
          userId: this.userInfo.id,
          experId: this.userInfo.experId,
          phaseNumber: this.userInfo.phaseNumber,
          answers: answers
        })
        this.loading = false
        if (res.status !== 205) {
          return this.$message.error('提交答案出错')
        }
        this.gotoNextPhase()
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
        phaseNumber: this.userInfo.phaseNumber
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
