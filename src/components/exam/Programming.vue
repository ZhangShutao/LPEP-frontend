<template>
  <div class="container">
    <container-header title="实验名" sub-title="阶段名"></container-header>
    <!--程序编写页面-->
    <el-row >
      <!--题干区域-->
      <el-col :span="10">
        <el-card class="question-box">
          <div slot="header" class="clearfix">
            <span>编程题标题</span>
            <span>
              剩余时间: <time-count :long-time="remainingTime"
                          message-title="计时结束"
                          message-text="计时结束"
                          @count-end = handleCountEnd></time-count>
            </span>
            <!--<el-button type="primary">提交记录</el-button>-->
          </div>

          <!--问题描述-->
          <div class="question-subtitle">问题描述</div>
          <div class="question-content">
            {{question.questionDescription}}
          </div>

          <!--命名规范-->
          <div class="question-subtitle">命名规范</div>
          <div class="question-content">
            <ul>
              <li v-for="(item, index) in question.namingConventions" :key="index">{{item}}</li>
            </ul>
          </div>

          <!--测试样例-->
          <div class="question-subtitle">测试样例</div>
          <div  v-for="(item, index) in question.testSamples" :key="index">
            示例{{index+1}}:
            <div class="sample-box">
              输入: {item.inputs}}
              <br/>
              输出: {{item.outputs}}
            </div>
          </div>
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
import TimeCount from '../common/TimeCount'

export default {
  name: 'Programming',
  components: {
    ContainerHeader,
    TimeCount
  },
  data () {
    return {
      question: {
        questionDescription: '如果一个对象是企鹅，那它是一只鸟。',
        namingConventions: [
          'penguin：一元谓词，penguin(X)表示对象X是企鹅；',
          'bird：一元谓词，bird(X)表示对象X是鸟；',
          '输出谓词为一元谓词bird。'
        ],
        testSamples: [
          {
            inputs: 'penguin(tweety)',
            outputs: '{bird(tweety)}'
          },
          {
            inputs: 'cat(tom)',
            outputs: ''
          },
          {
            inputs: 'cat(tom)',
            outputs: ''
          }
        ]
      },
      remainingTime: 1000,
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
  methods: {
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
