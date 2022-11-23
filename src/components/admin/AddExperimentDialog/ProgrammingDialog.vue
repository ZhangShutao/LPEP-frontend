<template>
  <!--新建实验6-问题录入（编程题）-->
  <el-dialog title="问题录入" :visible.sync="visible" width="80%" v-if="visible" append-to-body :show-close="false">
    <!--每个问题对应一个表单-->
    <el-form label-width="80px"
             :rules="ProgrammingRules" ref="programmingRef"
             :model="question"
             v-for="(question, index) in questionList" :key="index">
      <div class="question-title">
        问题{{index+1}}
        <el-button type="danger" @click="handleDeleteQuestion(index)" size="small">删除问题</el-button>
      </div>
      <el-form-item label="问题描述" prop="content">
        <mavon-editor v-model="question.content" style="min-height: 300px"/>
      </el-form-item>
      <el-form-item label="用时上限" label-width="120px" prop="timeLimit">
        <el-input v-model="question.timeLimit" style="width: 200px"></el-input>分钟
      </el-form-item>
      <el-form-item label="运行时间上限" label-width="120px" prop="runningTimeLimit">
        <el-input v-model="question.runningTimeLimit" style="width: 200px" placeholder="默认为5"></el-input>秒
      </el-form-item>
      <el-form-item label="求解器" label-width="120px" prop="runner">
        <el-select v-model="question.runnerId" style="width: 200px">
          <el-option v-for="(solver, index) in allSolverTypes" :key="index" :label="solver.runnerName" :value="solver.runnerId"></el-option>
        </el-select>
      </el-form-item>
      测试数据
      <div v-for="(item, index) in question.testSamples" :key="index" class="input-output-upload">
        数据{{index+1}}
        <el-form-item label="输入" :prop="'testSamples.' + index + '.input'" :rules="ProgrammingRules.input" >
          <el-upload
            :action="uploadParam.url"
            :data="uploadParam.data"
            :before-upload="(file) => {
              return handleBeforeUpload(file, 'input'); }"
            :on-success="(response, file, fileList ,type) => {
              return handleSuccess(response, file, item, 'input');}">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="输出" :prop="'testSamples.' + index + '.output'" :rules="ProgrammingRules.output" >
          <el-upload
            :action="uploadParam.url"
            :data="uploadParam.data"
            :before-upload="(file) => {
              return handleBeforeUpload(file, 'output'); }"
            :on-success=" (response, file, fileList) => {
              return handleSuccess(response, file, item, 'output'); }">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-button type="danger" @click="deleteTestSample(question, index)" size="small" plain class="delete-button">删除本条数据</el-button>
      </div>
      <!--添加用例按钮-->
      <div class="function-box">
        <el-button type="primary" @click="addTestSample(question)" size="small" plain>添加数据</el-button>
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
import { baseUrl } from '../../../vue.config'

export default {
  name: 'ProgrammingDialog',
  data () {
    return {
      allSolverTypes: [],
      ProgrammingRules: {
        content: [
          { required: true, message: '请输入问题题干', trigger: 'blur' }
        ],
        timeLimit: [
          { required: true, message: '请输入用时上限', trigger: 'blur' }
        ],
        runner: [
          { required: true, message: '请输入选择一个求解器', trigger: 'change' }
        ],
        runningTimeLimit: [
          { required: true, message: '请输入运行时间上限', trigger: 'blur' }
        ],
        input: [
          { required: true, message: '请上传输入文件', trigger: 'change' }
        ],
        output: [
          { required: true, message: '请上传输出文件', trigger: 'change' }
        ]

      },
      uploadParam: {
        limit: 3,
        url: baseUrl + 'exper/uploadtestfile',
        typeLimit: 'pdf',
        data: {
          isInput: 0,
          caseId: 0,
          experId: this.experimentId,
          groupId: this.groupId
        }
      }
    }
  },
  props: {
    experimentId: {
      type: String
    },
    groupId: {
      type: String
    },
    questionList: [],
    visible: {
      type: Boolean
    }
  },
  watch: {
    experimentId: {
      handler () {
        this.uploadParam.data.experId = this.experimentId
      }
    },
    groupId: {
      handler () {
        this.uploadParam.data.groupId = this.groupId
      }
    }
  },
  created () {
    this.getAllSolverTypes()
  },
  methods: {
    // 获取所有求解器
    async getAllSolverTypes () {
      const { data: res } = await this.$http.get('exper/listallrunner')
      this.allSolverTypes = res.data
    },
    closeDialog () {
      this.$emit('close-dialog')
    },
    validateForm (fun) {
      // 表单校验
      if (this.questionList.length === 0) {
        fun()
      } else {
        this.$refs.programmingRef[0].validate((valid) => {
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
            content: '',
            timeLimit: '',
            runner: '',
            runningTimeLimit: '',
            testSamples: []
          }
        )
      })
    },
    // 添加测试数据
    addTestSample (question) {
      this.validateForm(async () => {
        // 先获取caseId
        const { data: res } = await this.$http.get('exper/getcaseid', {
          params: { number: question.testSamples.length + 1 }
        })
        if (res.status !== 200) {
          return this.$message.success('获取caseId失败')
        }
        this.uploadParam.data.caseId = res.data
        question.testSamples.push({
          input: {},
          output: {},
          caseId: res.data
        })
      })
    },
    deleteTestSample (question, index) {
      this.$confirm('确定要删除该条数据吗？', '提示', {
        type: 'warning'
      }).then(() => {
        question.testSamples.splice(index, 1)
      })
    },
    finishAddQuestions () {
      this.validateForm(() => { this.$emit('finish-add-questions') })
    },

    // 文件上传
    handleUpload () {
      // this.$refs.
    },
    // 预览上传文件
    handlePreview (file) {
      console.log(file)
    },
    handleBeforeUpload (file, type) {
      if (type === 'input') {
        this.uploadParam.data.isInput = 1
      } else {
        this.uploadParam.data.isInput = 0
      }
      const testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
      if (this.uploadParam.typeLimit.indexOf(testmsg) === -1) {
        this.$alert('上传文件类型只能是' + this.uploadParam.typeLimit + '格式')
        return false
      }
    },
    handleSuccess (response, file, item, type) {
      if (type === 'input') {
        item.input = file
      } else {
        item.output = file
      }
      console.log(item)
      if (response.status !== 203) {
        return this.$message.error('上传文件出错')
      }
      this.$message.success('上传文件成功')
      this.validateForm()
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
.input-output-upload {
  padding: 10px;
  .el-form-item {
    display: inline-block;
    width: 180px;
  }
  .delete-button {
    height: 32px;
    margin-left: 20px;
    margin-top: 4px;
  }
}
</style>
