<template>
  <!--新建实验5-问题录入(选择题+问答题)-->
  <el-dialog title="问题录入" :visible.sync="visible" width="80%" v-if="visible" append-to-body :show-close="false">
    <!--每个问题对应一个表单-->
    <el-form label-width="80px"  :rules="questionnaireRules" :ref="'questionnaireRef' + index"
             :model="question"
             v-for="(question, index) in questionList" :key="index">
      <div>问题{{index+1}}
        <el-button type="danger" @click="handleDeleteQuestion(index)" size="small">删除问题</el-button>
      </div>
      <el-form-item label="问题类型" prop="type">
        <el-radio v-model="question.type" label="选择题">选择题</el-radio>
        <el-radio v-model="question.type" label="问答题">问答题</el-radio>
      </el-form-item>
      <!--问题描述,采用markdown编辑器-->
      <el-form-item label="问题描述" prop="content">
        <mavon-editor v-model="question.content" style="min-height: 300px"/>
      </el-form-item>
      <!--选择题选项-->
      <div v-if="question.type === '选择题'">
        <el-form-item :label="'选项' + String.fromCharCode('A'.charCodeAt(0)+ index)"
                      :prop="'options.' + index"
                      :rules="questionnaireRules.option"
                      v-for="(item, index) in question.options" :key="index">
          <el-input v-model="question.options[index]" style="width: 400px"></el-input>
        </el-form-item>
        <!--添加选项按钮-->
        <el-button type="primary" @click="addOption(index)" size="small" plain>添加选项</el-button>
      </div>
      <el-divider></el-divider>
    </el-form>
    <div class="function-box">
      <el-button type="primary" @click="addQuestion" size="small">添加问题</el-button>
    </div>
    <div slot="footer">
      <el-button type="primary"
                 @click="finishAddQuestions(); closeDialog()">确 定</el-button>
      <el-button @click="closeDialog">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'QuestionnaireDialog',
  data () {
    return {
      questionnaireRules: {
        content: [
          { required: true, message: '请输入问题题干', trigger: 'blur' }
        ],
        option: [
          { required: true, message: '请填写选项内容', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请至少选择一种问题类型', trigger: 'change' }
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
    closeDialog () {
      this.$emit('close-dialog')
    },
    handleDeleteQuestion (index) {
      this.$emit('delete-question', index)
    },
    validateForm (fun) {
      // 表单校验
      if (this.questionList.length === 0) {
        fun()
      } else {
        const formName = 'questionnaireRef' + (this.questionList.length - 1)
        // console.log(formName)
        this.$refs[formName][0].validate((valid) => {
          if (valid) {
            console.log('校验成功')
            fun()
          } else {
            console.log('校验失败')
            return false
          }
        })
      }
    },
    addQuestion () {
      this.validateForm(() => { this.$emit('add-question') })
    },
    addOption (questionIndex) {
      this.$emit('add-option', questionIndex)
    },
    finishAddQuestions () {
      this.validateForm(() => { this.$emit('finish-add-questions') })
    }
  }
}
</script>

<style scoped>

</style>
