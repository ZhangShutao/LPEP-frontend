<template>
  <!--教材信息添加,修改对话框-->
  <el-dialog :title="textbookFormDialogTitle" :visible.sync="visible" :show-close="false"
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
      <el-form-item labal="教材上传">
        <el-upload
          ref="upload"
          :action="uploadParam.url"
          :file-list="fileList"
          :data="textbookForm"
          :auto-upload="false"
          :before-upload='handleBeforeUpload'
          :on-success="handleSuccess"
          accept=".pdf">
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitUpload">添 加</el-button>
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
      textbookForm: {},
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
        ]
      },
      experimentInfo: [],
      groupInfo: [],
      uploadParam: {
        limit: 3,
        url: baseUrl + 'admin/createtrainingmaterial',
        typeLimit: 'pdf'
      },
      fileList: []
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
    handleBeforeUpload (file) {
      const testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
      if (this.uploadParam.typeLimit.indexOf(testmsg) === -1) {
        this.$alert('上传文件类型只能是' + this.uploadParam.typeLimit + '格式')
        return false
      }
    },
    submitUpload () {
      this.$refs.textbookFormRef.validate((valid) => {
        if (!valid) {
          return false
        }
        this.$refs.upload.submit()
      })
    },
    handleSuccess (response) {
      console.log('success')
      console.log(response)
    },
    handleCloseDialog () {
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
