<template>
  <!--新建实验5-问题录入(选择题+问答题)-->
  <el-dialog title="问题录入" :visible.sync="visible" width="80%" v-if="visible" append-to-body
             :show-close="false"
             :before-close="beforeClose">
    <!--每个问题对应一个表单-->
    <el-form label-width="80px"  :rules="questionnaireRules" ref="questionnaireRef"
             :model="question"
             v-for="(question, index) in questionList" :key="index">
      <div class="question-title">
        问题{{index+1}}
        <el-button type="danger" @click="handleDeleteQuestion(index)" size="small">删除问题</el-button>
      </div>
      <el-form-item label="问题类型" prop="type">
        <el-radio v-model="question.type" :label="1">选择题</el-radio>
        <el-radio v-model="question.type" :label="2">问答题</el-radio>
      </el-form-item>
      <!--问题描述,采用markdown编辑器-->
      <el-form-item label="问题描述" prop="content">
        <mavon-editor v-model="question.content" style="min-height: 300px"/>
      </el-form-item>
      <!--选择题选项-->
      <div v-if="question.type === 1">
        <el-form-item prop="answer">
          <el-radio-group v-model="question.answer" >
            <div v-for="(item, index) in question.options" :key="index" class="option-box">
              <el-radio :label="String.fromCharCode('A'.charCodeAt(0)+ index)">
                <el-form-item :label="'选项' + String.fromCharCode('A'.charCodeAt(0)+ index)"
                              :prop="'options.' + index"
                              :rules="questionnaireRules.option">
                  <el-input v-model="question.options[index]"></el-input>
                </el-form-item>
                <el-button type="danger" @click="deleteOption(question, index)" size="small" plain>删除选项</el-button>
              </el-radio>
            </div>
          </el-radio-group>
        </el-form-item>
        <!--添加选项按钮-->
        <el-button type="primary" @click="addOption(question)" size="small" plain>添加选项</el-button>
      </div>
      <el-divider></el-divider>
    </el-form>
    <div class="function-box">
      <el-button type="primary" @click="addQuestion" size="small">添加问题</el-button>
    </div>
    <div slot="footer">
      <el-button type="primary"
                 @click="finishAddQuestions">确 定</el-button>
      <el-button @click="closeDialog">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'QuestionnaireDialog',
  data () {
    return {
      // questionList: [],
      // visible: true,
      questionnaireRules: {
        content: [
          { required: true, message: '请输入问题题干', trigger: 'blur' }
        ],
        option: [
          { required: true, message: '请填写选项内容', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请至少选择一种问题类型', trigger: 'change' }
        ],
        answer: [
          { required: true, message: '请至少选择一个答案', trigger: 'change' }
        ]
      }
    }
  },
  props: {
    questionList: [],
    visible: {
      type: Boolean
    }
  },
  methods: {
    beforeClose () {
      this.$emit('update:visible', false)
    },
    closeDialog () {
      this.$emit('close-dialog')
    },
    validateForm (fun) {
      // 表单校验
      if (this.questionList.length === 0) {
        fun()
      } else {
        this.$refs.questionnaireRef[0].validate((valid) => {
          if (valid) {
            fun()
          } else {
            return false
          }
        })
      }
    },
    handleDeleteQuestion (index) {
      this.questionList.splice(index, 1)
    },
    addQuestion () {
      this.validateForm(() => {
        this.questionList.push(
          {
            number: this.questionList.length + 1,
            type: '',
            content: '',
            options: [],
            answer: ''
          }
        )
      })
    },
    addOption (question) {
      question.options.push('')
    },
    deleteOption (question, optionIndex) {
      question.options.splice(optionIndex, 1)
    },
    finishAddQuestions () {
      this.validateForm(() => { this.$emit('finish-add-questions') })
    }
  }
}
</script>

<style lang="less" scoped>
.question-title {
  font-weight: bold;
  padding: 10px;
  .el-button {
    margin-left: 20px;
  }
}
.option-box {
  margin-bottom: 18px;
  .el-form-item {
    display: inline-block;
  }
  .el-button {
    margin-left: 10px;
  }
}
</style>
