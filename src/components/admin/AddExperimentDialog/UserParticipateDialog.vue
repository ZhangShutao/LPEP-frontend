<template>
  <!--新建实验8-添加用户到实验-->
  <el-dialog title="实验阶段管理" :visible.sync="visible" width="30%" append-to-body :show-close="false">
    <el-form :model="addUserToExperimentForm" label-width="80px" >
      <el-form-item label="学号/工号">
        <el-input v-model="addUserToExperimentForm.studentId" @blur="queryAddedUserName"></el-input>
      </el-form-item>
      <!--需要根据输入的学号查询姓名-->
      <el-form-item label="姓名">
        <el-input v-model="addUserToExperimentForm.name" disabled></el-input>
      </el-form-item>
      <el-form-item label="组别">
        <el-select v-model="addUserToExperimentForm.group">
          <el-option v-for="(item, index) in form.groups" :key="index" :label="item.groupName" :value="item.groupName"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button type="primary" @click="handleAddUserToExperiment(); closeDialog()">添 加</el-button>
      <el-button @click="closeDialog()">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'UserParticipateDialog',
  data () {
    return {
      addUserToExperimentForm: {
        studentId: '',
        name: '',
        group: ''
      }
    }
  },
  props: {
    visible: {
      type: Boolean
    },
    form: {
      groups: []
    }
  },
  methods: {
    closeDialog () {
      this.$emit('close-dialog')
    },
    // 根据新增学号查询用户姓名并回填表单
    queryAddedUserName () {
      // this.addUserToExperimentForm.studentId
      // TODO (后端请求 根据学号查询姓名)
      const name = '张三'
      this.addUserToExperimentForm.name = name
    },
    // 添加参试人员
    handleAddUserToExperiment () {
      // TODO后端请求（用户添加到组）
    }
  }
}
</script>

<style scoped>

</style>
