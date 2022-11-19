<template>
  <!--新建实验6-问题录入（编程题）-->
  <el-dialog title="问题录入" :visible.sync="visible" width="80%" v-if="visible" append-to-body :show-close="false">
    <!--每个问题对应一个表单-->
    <el-form label-width="80px" :rules="ProgrammingRules" :ref="'questionnaireRef' + index"
             :model="question"
             v-for="(question, index) in questionList" :key="index">
      <div>问题{{index+1}}
        <el-button type="danger" @click="handleDeleteQuestion(index)" size="small">删除问题</el-button>
      </div>
      <!--问题描述,采用markdown编辑器-->
      <el-form-item label="问题描述" prop="content">
        <mavon-editor v-model="question.content" style="min-height: 300px"/>
      </el-form-item>
      <!--用时上限-->
      <el-form-item label="用时上限" prop="timeLimit">
        <el-input v-model="question.timeLimit" style="width: 200px"></el-input>分钟
      </el-form-item>
      测试数据
      <div v-for="(item, index) in question.testSamples" :key="index" class="input-output-upload">
        数据{{index+1}}
        <el-form-item label="输入" prop="inputs">
          <el-upload
            action="https://jsonplaceholder.typicode.com/posts/"
            multiple
            :limit="3"
            :on-change="handleUpload"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            :on-exceed="handleExceed"
            :file-list="question.testSamples.inputs">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="输出" prop="outputs">
          <el-upload
            action="https://jsonplaceholder.typicode.com/posts/"
            multiple
            :limit="3"
            :on-change="handleUpload"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            :on-exceed="handleExceed"
            :file-list="question.testSamples.outputs">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="运行时间上限" label-width="120px" prop="runningTimeLimit">
          <el-input v-model="question.testSamples.runningTimeLimit" style="width: 200px" placeholder="默认为5"></el-input>秒
        </el-form-item>
      </div>
      <!--添加用例按钮-->
      <div class="function-box">
        <el-button type="primary" @click="addTestSample(index)" size="small" plain>添加数据</el-button>
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
  name: 'ProgrammingDialog',
  data () {
    return {
      ProgrammingRules: {
        content: [
          { required: true, message: '请输入问题题干', trigger: 'blur' }
        ],
        timeLimit: [
          { required: true, message: '请输入用时上限', trigger: 'blur' }
        ]
        // inputs: [
        //   { required: true, message: '请上传输入文件', trigger: 'change' }
        // ],
        // outputs: [
        //   { required: true, message: '请上传输出文件', trigger: 'change' }
        // ]
        // runningTimeLimit: [
        //   { required: true, message: '请输入运行时间上限', trigger: 'blur' }
        // ]
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
    addTestSample (questionIndex) {
      this.$emit('add-sample', questionIndex)
    },
    finishAddQuestions () {
      this.validateForm(() => { this.$emit('finish-add-questions') })
    },

    // 文件上传
    handleUpload () {
      // this.$refs.
    },
    // 移除上传文件
    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    // 预览上传文件
    handlePreview (file) {
      console.log(file)
    },
    // 上传文件超过限定数量
    handleExceed (files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove (file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    }
  }
}
</script>

<style scoped>
.input-output-upload {
  padding: 10px;
  display: flex;
  line-height: 40px;
  /*justify-content: space-between;*/
}
</style>
