<template>
  <!--添加用户对话框-->
  <el-dialog title="添加用户" :visible.sync="visible" width="30%" append-to-body :show-close="false">
    <el-form :model="userAddForm" label-width="90px" ref="userAddFormRef" :rules="userAddRules">
      <el-form-item label="学号/工号" prop="username">
        <el-input v-model="userAddForm.username"></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="realname">
        <el-input v-model="userAddForm.realname"></el-input>
      </el-form-item>
      <el-form-item label="用户类型" prop="isAdmin">
        <el-radio v-model="userAddForm.isAdmin" :label="1">管理员</el-radio>
        <el-radio v-model="userAddForm.isAdmin" :label="0">普通用户</el-radio>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="addParticipate()">添 加</el-button>
      <el-button @click="closeDialog()">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'UserAddDialog',
  data () {
    return {
      userAddForm: {
        username: '',
        realname: '',
        isAdmin: ''
      },
      userAddRules: {
        username: [
          { required: true, message: '请输入学号/工号', trigger: 'blur' }
        ],
        realname: [
          { required: true, message: '请填写姓名', trigger: 'blur' }
        ],
        isAdmin: [
          { required: true, message: '请至少选择一种用户类型', trigger: 'change' }
        ]
      }
    }
  },
  props: {
    visible: {
      type: Boolean
    }
  },
  methods: {
    closeDialog () {
      this.$emit('close-dialog')
    },
    // 添加参试人员
    async addParticipate () {
      this.$refs.userAddFormRef.validate(async valid => {
        if (!valid) {
          return false
        }
        const { data: res } = await this.$http.post('admin/createuser', this.userAddForm)
        this.$refs.userAddFormRef.resetFields()
        if (res.status !== 201) {
          return this.$message.error('用户创建失败')
        }
        this.$message.success('用户创建成功')
        this.$emit('finish-add-participate')
        this.closeDialog()
      })
    }
  }
}
</script>

<style scoped>

</style>
