<template>
  <div class="container">
    <container-header :title="experName" :sub-title="'阶段' +phaseName"></container-header>
      <!--程序编写页面-->
      <el-container>
        <!--{{Date.now()}}-->
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
          <el-input type="textarea" v-model="source"
                    :rows="16"
                    placeholder="请在此编程">
          </el-input>
          <!--测试用例,执行结果-->
          <div class="result-box">
            <el-tabs v-model="activeName" type="card" @tab-click="handleTabChange">
              <!--执行结果区域-->
              <el-tab-pane label="提交结果" name="result">
                <div
                  style="height: 100%"
                  v-loading="loading"
                  element-loading-spinner="el-icon-loading"
                  element-loading-text="测试中……">
                    <!--执行结果-->
                    <div class="submit-result-box" v-if="executeResult.status">
                      {{ executeResult.status }}<br/>
                      {{ executeResult.errorMsg }}
                      123
                    </div>
                    <div>
                      <div class="sample-box"
                           v-if="executeResult.status === 'wrong answer' ||
                           executeResult.status === 'time limit exceeded'">
                      最后执行的输入:<br/>
                        用例编号: {{executeResult.numberOfWrong}}<br/>
                        测试数据: {{executeResult.wrongCaseInput}}<br/>
                        标准输出: {{executeResult.standardOutput}}<br/>
                        实际输出: {{executeResult.userOutput}}
                      </div>
                    </div>
                </div>
              </el-tab-pane>
              <!--提交记录区域-->
              <el-tab-pane label="提交记录" name="record">
                <el-table
                  :data="submitData"
                  size="small">
                  <el-table-column type="index"></el-table-column>
                  <el-table-column label="提交时间" prop="submitTime"></el-table-column>
                  <el-table-column label="提交状态" prop="status"></el-table-column>
                </el-table>
                <div class="pagination">
                  <el-pagination
                    background
                    layout="prev, pager, next"
                    :current-page="query.pageIndex"
                    :page-size="query.pageSize"
                    :total="pageTotal"
                    @current-change="handlePageChange">
                  </el-pagination>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
          <!--功能按钮-->
          <div class="function-box">
            <el-button
              type="primary"
              @click="handleSubmit"
              :loading="loading"
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
import NProgress from 'nprogress'

export default {
  name: 'Programming',
  components: {
    ContainerHeader
  },
  data () {
    return {
      deadline: Date.now() + 1000 * 60 * 60,
      userInfo: {},
      experName: '',
      phaseName: 0,
      startTime: 0,
      source: '',
      // 程序代码
      question: {
        questionId: '',
        content: '',
        number: 0,
        remark: '',
        timeLimit: 0,
        runtimeLimit: 0,
        isLast: -1
      },
      executeResult: {
        status: '',
        errorMsg: '',
        numberOfWrong: 0,
        wrongCaseInput: '',
        standardOutput: '',
        userOutput: ''
      },
      activeName: 'result',
      pageTotal: 0,
      query: {
        pageIndex: 1,
        pageSize: 5
      },
      submitData: [],
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
      this.startTime = this.userInfo.startTime
    },

    // 获取问题列表
    async getQuestion () {
      this.getExperimentInfo()
      // 判断最后一题
      if (this.question.isLast === 1) {
        return this.gotoNextPhase()
      }
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
      this.deadline = this.startTime + 1000 * 60 * this.question.timeLimit
      this.source = ''
    },

    async gotoNextPhase () {
      // 更新下一个阶段
      this.userInfo.phaseNumber = this.userInfo.phaseNumber + 1
      this.userInfo.questionNumber = 1
      sessionStorage.setItem('userInfo', JSON.stringify(this.userInfo))
      // 获取下一阶段实验类型
      const { data: res } = await this.$http.post('exper/getnextphasestatus', {
        userId: this.userInfo.id,
        experId: this.userInfo.experId,
        phaseNumber: this.userInfo.phaseNumber
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

    // 提交答案
    async handleSubmit () {
      // 清空提交结果;反馈测试中;禁用提交按钮
      this.$set(this.executeResult, status, '')
      // this.executeResult.status = ''
      this.loading = true
      try {
        const { data: res } = await this.$http.post('/submit/prog_submit', {
          userId: this.userInfo.id,
          questionId: this.question.questionId,
          source: this.source
        })
        this.executeResult = res.data
        this.activeName = 'result'

        if (res.status === 205) {
          this.$alert('本题答案已通过,即将开始下一题', '测试通过', {
            confirmButtonText: '确认',
            callback: () => {
              // 获取下一题(下一阶段)
              this.userInfo.questionNumber = this.userInfo.questionNumber + 1
              this.userInfo.startTime = Date.now()
              sessionStorage.setItem('userInfo', JSON.stringify(this.userInfo))
              this.getQuestion()
            }
          })
        }
      } catch (error) {
        this.$message.error('提交答案出错')
      } finally {
        NProgress.done()
        this.loading = false
      }
    },

    // 放弃题目
    async handleAbandon () {
      this.$confirm('确定要放弃该题吗？', '提示', {
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.post('/submit/submit_abort', {
          userId: this.userInfo.id,
          questionId: this.question.questionId
        })
        if (res.status !== 205) {
          return this.$message.error('放弃失败')
        }
        this.$alert('本题已放弃,即将开始下一题', '提示', {
          confirmButtonText: '确认',
          callback: () => {
            // 获取下一题(下一阶段)
            this.userInfo.questionNumber = this.userInfo.questionNumber + 1
            this.userInfo.startTime = Date.now()
            sessionStorage.setItem('userInfo', JSON.stringify(this.userInfo))
            this.getQuestion()
          }
        })
      })
    },

    // 计时结束
    hilarity () {
      this.$alert('本题用时已结束,即将开始下一题', '提示', {
        confirmButtonText: '确认',
        callback: () => {
          // 获取下一题(下一阶段)
          this.userInfo.questionNumber = this.userInfo.questionNumber + 1
          sessionStorage.setItem('userInfo', JSON.stringify(this.userInfo))
          this.getQuestion()
        }
      })
    },

    handleTabChange (tab) {
      if (tab.label === '提交记录') {
        // 更新提交记录
        this.getSubmitRecord()
      }
    },

    // 提交记录
    async getSubmitRecord () {
      const { data: res } = await this.$http.get('/submit/list_prog_submit', {
        params: {
          userId: this.userInfo.id,
          questionId: this.question.questionId,
          pageIndex: this.query.pageIndex,
          pageSize: this.query.pageSize
        }
      })
      if (res.status !== 200) {
        return this.$message.error('获取提交记录失败')
      }
      this.submitData = res.data.programSubmitInfoList
      this.pageTotal = res.data.recordCount
    },

    handlePageChange (newPage) {
      this.query.pageIndex = newPage
      this.getSubmitRecord()
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
  .el-input {
    border: #63a35c 1px solid;
  }
}

.result-box {
  border: #63a35c 1px solid;
  margin-top: 10px;
  .el-tab-pane {
    height: 290px;
    padding: 10px;
    .submit-result-box {
      height: 100px;
      overflow-y: auto;
      //border: #63a35c 1px solid;
    }
    .sample-box {
      background-color: #f2f2f4;
      margin: 10px;
    }
  }
}

.function-box {
  margin-top: 10px;
  text-align: right;
}

.pagination {
  margin: 20px 0;
  text-align: right;
}

</style>
