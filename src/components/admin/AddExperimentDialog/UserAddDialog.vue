<template>
  <!--新建实验9-新增用户-->
  <el-dialog title="添加用户" :visible.sync="visible" width="30%" append-to-body :show-close="false">
    <el-form :model="userAddForm" label-width="80px" >
      <el-form-item label="学号/工号">
        <el-input v-model="userAddForm.studentId"></el-input>
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="userAddForm.name"></el-input>
      </el-form-item>
      <el-form-item label="用户类型">
        <el-radio v-model="userAddForm.type" label="admin">管理员</el-radio>
        <el-radio v-model="userAddForm.type" label="user">普通用户</el-radio>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="addParticipate(); closeDialog()">添 加</el-button>
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
        studentId: '',
        name: '',
        group: '',
        type: ''
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
    addParticipate () {
      // TODO后端请求（添加用户）
      this.$emit('finish-add-participate')
    }
  }
}
</script>

<style scoped>

</style>
