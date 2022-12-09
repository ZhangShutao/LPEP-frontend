<template>
  <!--教材信息添加,修改对话框-->
  <el-dialog :title="textbookFormDialogTitle" :visible.sync="visible"
             :show-close="false"
             :before-close='beforeClose' width="30%">
    <el-form :model="textbookForm" label-width="80px" ref="textbookFormRef" :rules="textbookFormRules">
      <el-form-item label="文件名" prop="name">
        <el-input v-model="textbookForm.name"></el-input>
      </el-form-item>
      <el-form-item label="所属实验" prop="experId">
        <el-select v-model="textbookForm.experId" placeholder="请选择所属实验">
          <el-option v-for="(experiment, index) in experimentInfo" :key="index"
                     :label="experiment.experName" :value="experiment.experId"
                     @click.native="getGroups(index)"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属组别" prop="groupId">
        <el-select v-model="textbookForm.groupId" placeholder="请选择所属组别">
          <el-option v-for="(group, index) in groupInfo" :key="index"
                     :label="group.groupName" :value="group.groupId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="教材上传" prop="fileList">
        <el-upload
          ref="upload"
          action="#"
          :file-list="textbookForm.fileList"
          :auto-upload="false"
          :on-change="handleChange"
          :before-upload='handleBeforeUpload'
          accept=".pdf">
          <el-button size="small" type="primary">添加文件</el-button>
        </el-upload>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitUpload" :loading="loading">上 传</el-button>
      <el-button @click="handleCloseDialog">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { baseUrl } from '../../../vue.config'

export default {
  name: 'TextbookAddDialog',
  data () {
    return {
      // 新增教材参数
      textbookForm: {
        name: '',
        experId: '',
        groupId: '',
        fileList: []
      },
      textbookFormDialogTitle: '',
      textbookFormRules: {
        name: [
          { required: true, message: '请输入文件名', trigger: 'blur' }
        ],
        experId: [
          { required: true, message: '请至少选择一种实验', trigger: 'change' }
        ],
        groupId: [
          { required: true, message: '请至少选择一种组别', trigger: 'change' }
        ],
        fileList: [
          { type: 'array', required: true, message: '请添加一个文件', trigger: 'change' }
        ]
      },
      experimentInfo: [],
      groupInfo: [],
      uploadParam: {
        limit: 3,
        url: baseUrl + 'admin/createtrainingmaterial',
        typeLimit: 'pdf'
      },
      loading: false
    }
  },
  props: {
    visible: {
      type: Boolean
    }
  },
  created () {
    this.getExperiments()
  },
  methods: {
    async getExperiments () {
      const { data: res } = await this.$http.get('train/getexpergroup')
      if (res.status !== 200) {
        return this.$message.error('获取实验列表失败')
      }
      this.experimentInfo = res.data
    },

    getGroups (expIndex) {
      this.groupInfo = this.experimentInfo[expIndex].groupInfoList
    },

    // 通过onchanne触发方法获得文件列表
    handleChange (file, fileList) {
      this.textbookForm.fileList = fileList
      this.$refs.textbookFormRef.validateField('fileList')
    },

    handleBeforeUpload (file) {
      const testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
      if (this.uploadParam.typeLimit.indexOf(testmsg) === -1) {
        this.$alert('上传文件类型只能是' + this.uploadParam.typeLimit + '格式')
        return false
      }
    },

    submitUpload () {
      this.$refs.textbookFormRef.validate(async (valid) => {
        if (!valid) {
          return false
        }
        try {
          this.loading = true
          const param = new FormData()
          param.append('name', this.textbookForm.name)
          param.append('experId', this.textbookForm.experId)
          param.append('groupId', this.textbookForm.groupId)
          param.append('file', this.textbookForm.fileList[0].raw)

          const { data: res } = await this.$http.post('admin/createtrainingmaterial', param)
          if (res.status !== 203) {
            return this.$message.error('教材创建失败,' + res.msg)
          }
          this.$message.success('教材创建成功')
          this.handleCloseDialog()
        } catch (error) {
          this.$message.error('教材添加出错，请联系后台管理员')
        } finally {
          this.loading = false
        }
      })
    },

    handleCloseDialog () {
      this.$refs.textbookFormRef.resetFields()
      this.fileList = []
      this.$emit('get-textbook-list')
      this.$emit('close-dialog')
    },

    beforeClose () {
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style scoped>

</style>
