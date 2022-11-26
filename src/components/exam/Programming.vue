<template>
  <div class="container">
    <container-header :title="experName" :sub-title="'阶段' +phaseName"></container-header>
      <!--程序编写页面-->
      <el-container>
        <el-aside width="700px">
          <el-card>
            <!--倒计时-->
            <div slot="header">
              <el-statistic :value="deadline"  time-indices  @finish="hilarity" format="HH:mm:ss"
                            title="剩余时间：" class="time-box">
              </el-statistic>
            </div>
            <!--题干区域-->
            <mavon-editor v-model="question.content"
                          :subfield="false"
                          defaultOpen="preview"
                          :toolbarsFlag="false"
                          :editable="false">
            </mavon-editor>
          </el-card>
        </el-aside>
        <el-main class="right-box">
          <!--编程区域-->
          <div>
            <el-input type="textarea" v-model="question.source"
                      :rows="16" :disabled="editorDisabled"
                      placeholder="请在此编程">
            </el-input>
          </div>
          <!--测试用例,执行结果-->
          <div class="result-box">
            <el-tabs v-model="activeName" type="card">
              <!--执行结果区域-->
              <el-tab-pane label="提交结果" name="first">
                <div
                  style="height: 100%"
                  v-loading="loading"
                  element-loading-spinner="el-icon-loading"
                  element-loading-text="测试中……">
                  <el-card class="box-card" v-if="executeResult">
                    <!--执行结果-->
                    <div slot="header" class="clearfix">
                      <span>{{ executeResult.errorMsg }}</span>
                    </div>
                    <!--执行结果详情-->
                    <div>
                      {{executeResultInfo}}
                      <div v-if="executeStatus === 2 || executeStatus === 3 ">
                        最后执行的输入:
                        <div class="sample-box">
                          错误用例编号:{{executeResult.numberOfWrong}} 测试数据: {{executeResult.wrongCaseInput}}<br/>
                          标准输出: {{executeResult.standardOutput}}<br/>
                          实际输出: {{executeResult.userOutput}}
                        </div>
                      </div>
                    </div>
                  </el-card>
                </div>
              </el-tab-pane>
              <!--提交记录区域-->
              <el-tab-pane label="提交记录" name="second">

              </el-tab-pane>
            </el-tabs>
          </div>
          <!--功能按钮-->
          <div class="function-box">
            <el-button
              type="primary"
              :disabled="submitDisabled"
              @click="handleSubmit"
            >提交
            </el-button>
            <el-button
              type="danger"
              @click="handleAbandon"
            >放弃本题
            </el-button>
          </div>
        </el-main>

    </el-container>
  </div>

</template>

<script>
import ContainerHeader from '../common/ContainerHeader'

export default {
  name: 'Programming',
  components: {
    ContainerHeader
  },
  data () {
    return {
      deadline: Date.now() + 1000 * 10,
      userInfo: {},
      experName: '',
      phaseName: 0,
      question: {
        questionId: '',
        content: '',
        number: 0,
        remark: '',
        timeLimit: 0,
        runtimeLimit: 0,
        isLast: -1,
        // 程序代码
        source: ''
      },
      executeResult: {
        status: '',
        errorMsg: '',
        numberOfWrong: 0,
        wrongCaseInput: '',
        standardOutput: '',
        userOutput: ''
      },
      editorDisabled: false,
      submitDisabled: false,
      activeName: 'first',
      loading: false
    }
  },
  created () {
    this.getExperimentInfo()
    this.getQuestion()
  },
  methods: {
    // 获取实验信息
    getExperimentInfo () {
      this.userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
      this.experName = this.userInfo.experName
      this.phaseName = this.userInfo.phaseNumber
      this.questionNumber = this.userInfo.questionNumber
    },

    // 获取问题列表
    async getQuestion () {
      // 判断最后一题
      if (this.question.isLast === 1) {
        return this.gotoNextPhase()
      }
      this.userInfo.questionNumber = this.userInfo.questionNumber + 1
      sessionStorage.setItem('userInfo', JSON.stringify(this.userInfo))
      const { data: res } = await this.$http.post('exper/getprogquestion', {
        userId: this.userInfo.id,
        experId: this.userInfo.experId,
        phaseNumber: this.userInfo.phaseNumber,
        questionNumber: this.userInfo.questionNumber
      })
      if (res.status !== 200) {
        return this.$message.error('获取问题错误')
      }
      this.question = res.data
      this.question.source = ''
    },

    async gotoNextPhase () {
      // 更新下一个阶段
      this.userInfo.phaseNumber = this.userInfo.phaseNumber + 1
      this.userInfo.questionNumber = 1
      sessionStorage.setItem('userInfo', JSON.stringify(this.userInfo))
      // 获取下一阶段实验类型
      const { data: res } = await this.$http.post('exper/getnextphasestatus', {
        userId: this.userInfo.userId,
        experId: this.userInfo.experId,
        phaseNumber: this.userInfo.phase
      })
      if (res.status === 206) {
        return this.$router.push('/exam/empty-phase')
      }
      if (res.data.isEnd === 1) {
        return this.$router.push('/exam/exam-end')
      }
      if (res.data.isProg === 0) {
        this.$router.push('/exam/questionnaire')
      } else {
        this.getQuestion()
      }
    },

    async handleSubmit () {
      // 清空提交结果;反馈测试中;禁用提交按钮
      this.executeResult = ''
      this.loading = true
      this.submitDisabled = true
      const { data: res } = await this.$http.post('/submit/prog_submit', {
        userId: this.userInfo.id,
        questionId: this.question.questionId,
        source: this.question.source
      })

      this.executeResult = res.data
      this.executeStatus = 2
      this.executeResult = '测试不通过'
      this.loading = false
      this.submitDisabled = false

      if (res.status !== 205) {
        return this.$message.error('提交答案出错')
      }
      this.gotoNextPhase()
    },

    // 放弃题目
    handleAbandon () {

    },

    // 计时结束
    hilarity () {
      this.editorDisabled = true
      this.$alert('计时结束,进入下一阶段').then(
        this.gotoNextPhase()
      )
    }

  }
}
</script>

<style lang="less" scoped>
.question-box {
  //height: calc(90vh - 115px);
  height: 100%;
  //overflow: auto;
}

.sample-box {
  background-color: #f2f2f4;
  margin: 10px;
}

.right-box {
  padding: 0 15px;
}

.result-box {
  border: #63a35c 1px solid;
  margin-top: 10px;
  .el-tab-pane {
    height: 25vh;
    padding: 10px;
  }
}

.function-box {
  margin-top: 10px;
  text-align: right;
}

</style>
