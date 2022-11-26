<template>
  <!--新建实验8-添加用户到实验-->
  <el-dialog title="添加用户到实验" :visible.sync="visible" width="40%" append-to-body
             :show-close="false"
             :before-close="beforeClose">
    <el-form :model="addUserToExperimentForm" label-width="90px"
             :rules="formRules" ref="formRef">
      <el-form-item label="学号/工号" prop="username">
        <el-input v-model="addUserToExperimentForm.username" @blur="queryAddedUserName"></el-input>
      </el-form-item>
      <!--需要根据输入的学号查询姓名-->
      <el-form-item label="姓名" prop="realname">
        <el-input v-model="addUserToExperimentForm.realname" disabled></el-input>
      </el-form-item>
      <el-form-item label="组别" prop="groupId">
        <el-select v-model="addUserToExperimentForm.groupId">
          <el-option v-for="(item, index) in groupList" :key="index" :label="item.groupName" :value="item.groupId">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button type="primary" @click="handleAddUserToExperiment">添 加</el-button>
      <el-button @click="closeDialog">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'UserParticipateDialog',
  data () {
    return {
      addUserToExperimentForm: {
        userId: '',
        username: '',
        realname: '',
        groupId: ''
      },
      formRules: {
        username: [
          { required: true, message: '请输入学号/工号', trigger: 'blur' }
        ],
        realname: [
          { required: true, message: '无法查询到用户，请核对学号', trigger: 'blur' }
        ],
        groupId: [
          { required: true, message: '请选择组别', trigger: 'change' }
        ]
      },
      groupList: []
    }
  },
  props: {
    visible: {
      type: Boolean
    },
    experId: {
      type: String
    }
  },
  watch: {
    experId: {
      handler (newValue) {
        this.getGroupList(newValue)
      }
    }
  },
  methods: {
    beforeClose () {
      this.$emit('update:visible', false)
    },
    closeDialog () {
      this.$refs.formRef.resetFields()
      this.$emit('close-dialog')
    },
    // 根据新增学号查询用户姓名
    async queryAddedUserName () {
      const { data: res } = await this.$http.get('user/getrealname', {
        params: { username: this.addUserToExperimentForm.username }
      })
      if (res.status !== 200) {
        // return this.$message.error('不存在该用户，请核对学号')
        return false
      }
      this.addUserToExperimentForm.userId = res.data.userId
      this.addUserToExperimentForm.realname = res.data.realname
    },
    // 根据实验查询组别接口
    async getGroupList (experId) {
      const { data: res } = await this.$http.get('exper/querygroups', {
        params: { experId: experId }
      })
      if (res.status !== 200) {
        return this.$message.error('获取组别信息错误')
      }
      this.groupList = res.data
    },
    // 添加参试人员
    async handleAddUserToExperiment () {
      this.$refs.formRef.validate(async (valid) => {
        if (!valid) {
          return false
        }
        const { data: res } = await this.$http.post('admin/addtestertoexper', {
          userId: this.addUserToExperimentForm.userId,
          experId: this.experId,
          groupId: this.addUserToExperimentForm.groupId
        })
        if (res.status !== 200) {
          return this.$message.error('添加失败')
        }
        this.$message.success('添加成功')
        this.closeDialog()
      })
    }
  }
}
</script>

<style scoped>

</style>
