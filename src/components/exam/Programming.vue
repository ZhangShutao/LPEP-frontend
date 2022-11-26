<template>
  <div class="container">
    <container-header :title="experName" :sub-title="'阶段' +phaseName"></container-header>
      <!--程序编写页面-->
      <el-row>
      <!--题干区域-->
      <el-col :span="10">
        <el-card class="question-box">
          <div slot="header" class="clearfix">
            编程题标题
             <el-statistic :value="deadline"  time-indices  @finish="hilarity" format="HH:mm:ss"
                           title="剩余时间：" class="time-box">
            </el-statistic>
          </div>
          <mavon-editor v-model="content"
                        :subfield="false"
                        defaultOpen="preview"
                        :toolbarsFlag="false"
                        :editable="false"
                        :scrollStyle="true">

          </mavon-editor>
        </el-card>
      </el-col>
      <!--编程区域-->
      <el-col :span="14" class="editor-box">
        <el-input type="textarea" v-model="programmingResult"
               :rows="25" :disabled="editorDisabled"
               placeholder="请在此编程">
        </el-input>
        <!--测试用例,执行结果-->
        <div class="result-box">
          <el-tabs v-model="activeName" type="card">
            <!--执行结果区域-->
            <el-tab-pane label="提交结果" name="first">
              <div
                style="height: 100%"
                v-loading="loading"
                element-loading-text="测试中……"
                element-loading-spinner="el-icon-loading"
                >
                <el-card class="box-card" v-if="executeResult">
                  <!--执行结果-->
                  <div slot="header" class="clearfix">
                    <span>{{ executeResult }}</span>
                  </div>
                  <!--执行结果详情-->
                  <div>
                    {{executeResultInfo}}
                    <div v-if="executeStatus === 2 || executeStatus === 3 ">
                      最后执行的输入:
                      <div class="sample-box">
                        测试数据: {{firstWrongInput}}<br/>
                        标准输出: {{firstWrongStandardOutput}}<br/>
                        实际输出: {{firstWrongPracticalOutput}}
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
            @click="handleSubmit()"
          >提交
          </el-button>
          <el-button
            type="danger"
            @click="handleAbandon()"
          >结束本题
          </el-button>
        </div>
      </el-col>
    </el-row>
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
        isLast: 0

      },
      editorDisabled: false,
      programmingResult: '',
      nextQuestion: '',
      submitDisabled: false,
      activeName: 'first',
      loading: false,
      // 执行状态(0表示通过,1表示语法错误,2表示WA,3表示TLE)
      executeStatus: 0,
      executeResult: '',
      // 执行结果详情
      executeResultInfo: '',
      firstWrongInput: '123',
      firstWrongStandardOutput: '123',
      firstWrongPracticalOutput: '123'
    }
  },
  created () {
    this.getExperimentInfo()
    this.getNextQuestion()
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
    async getNextQuestion () {
      const { data: res } = await this.$http.post('exper/getprogquestion', {
        userId: this.userInfo.id,
        experId: this.userInfo.experId,
        phaseNumber: this.userInfo.phaseNumber,
        questionNumber: this.userInfo.questionNumber
      })
      this.question = res.data
    },
    handleSubmit () {
      // 清空提交结果;反馈测试中;禁用提交按钮
      this.executeResult = ''
      this.loading = true
      this.submitDisabled = true
      // 模拟延迟效果
      setTimeout(() => {
        this.executeStatus = 2
        this.executeResult = '测试不通过'
        this.loading = false
        this.submitDisabled = false
      }, 2000)
      // TODO
    },
    async gotoNextPhase () {
      // 更新下一个阶段
      this.userInfo.phaseNumber = this.userInfo.phaseNumber + 1
      this.userInfo.questionNumber = this.userInfo.questionNumber + 1
      sessionStorage.setItem('userInfo', JSON.stringify(this.userInfo))
      // 获取下一阶段实验类型
      const { data: res } = await this.$http.post('exper/getnextphasestatus', {
        userId: this.userInfo.userId,
        experId: this.userInfo.experId,
        phaseNumber: this.userInfo.phase
      })
      if (res.data.isEnd === 1) {
        return this.$router.push('/exam/exam-end')
      }
      if (res.data.isProg === 0) {
        this.$router.push('/exam/questionnaire')
      } else {
        this.$router.push('/exam/programming')
      }
    },
    // 计时结束无法对编程区域修改
    handleCountEnd () {
      this.editorDisabled = true
    }
  }
}
</script>

<style lang="less" scoped>
.question-box {
  height: calc(90vh - 115px);
  overflow: auto;

  .clearfix {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .time-box {
    width: 30%;
  }
}

.editor-box {
  /*height: 100%;*/
  /*background-color: #969896;*/
  padding-left: 10px;
}

/deep/ .el-textarea__inner{
  height: calc(50vh - 115px);
}

.question-subtitle {
  color: red;
  font-weight: bold;
}

.question-content {
  margin: 10px;
}

.sample-box {
  background-color: #f2f2f4;
  margin: 10px;
}

.function-box {
  margin-top: 10px;
  text-align: right;
}

.result-box {
  margin-top: 10px;
  border: #63a35c 1px solid;
  .el-tab-pane {
    height: 25vh;
    padding: 10px;
  }
}
</style>
