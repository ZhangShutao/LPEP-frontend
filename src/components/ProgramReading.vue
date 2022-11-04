<template>
  <!--程序阅读题（选择题）-->
  <div class="container">
    <!--表单绑定做题结果-->
    <el-form ref="form" :model="form" label-width="80px" label-position="top">
      <div v-for="(question, index) in questionList" :key="index">

        <!--题干（选择题）-->
        <el-form-item :label="index + 1 + '. ' + question.content" v-if="question.type == 1">
          <!--选项-->
          <el-radio-group v-model="question.choice">
            <el-radio label="A" border>{{JSON.parse(question.option).A}}</el-radio>
            <el-radio label="B" border>{{JSON.parse(question.option).B}}</el-radio>
            <el-radio label="C" border>{{JSON.parse(question.option).C}}</el-radio>
            <el-radio label="D" border>{{JSON.parse(question.option).D}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <!--题干（问答题）-->
        <el-form-item :label="index + 1 + '. ' + question.content" v-else-if="question.type == 2">
          <!--选项-->
          <el-input type="textarea" v-model="form.desc"></el-input>
        </el-form-item>
      </div>
      <!--提交所有结果-->
      <el-form-item class="button-box">
        <el-button type="primary" @click="onSubmit">提交</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import data from '../mock/mock'

export default {
  name: 'ProgramReading',
  data () {
    return {
      // 用户ID
      userId: '',
      form: {},
      // 程序阅读题目列表
      questionList: []
    }
  },
  created () {
    this.getQuestionList()
  },
  methods: {
    // 获取问题列表
    getQuestionList () {
      console.log(data.questionList)
      this.questionList = data.questionList
    },
    // 提交做题结果
    onSubmit () {
      this.questionList.forEach((question, index) => {
        console.log(index + ' ' + question.choice)
      })
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
