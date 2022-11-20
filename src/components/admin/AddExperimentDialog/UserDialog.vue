<template>
  <!--新建实验7-参试人员管理-->
  <el-dialog title="参试人员管理" :visible.sync="visible" width="50%" >
    <div class="function-box">
      <el-button type="info" @click="addUserToExperimentVisible = true">添加用户到实验</el-button>
      <el-button type="info" @click="userAddVisible = true">新增用户</el-button>
    </div>
    <el-table
      class="table-box"
      :data="participateTableData"
      stripe
      border>
      <el-table-column label="序号" prop="id"></el-table-column>
      <el-table-column label="学号/工号" prop="studentId"></el-table-column>
      <el-table-column label="姓名" prop="name"></el-table-column>
      <el-table-column label="组别" prop="group"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="handleDeleteUser(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div slot="footer">
      <el-button type="primary" @click="handleNextDialog(-1)">上一步</el-button>
      <el-button type="primary" @click="handleNextDialog(1)">完成</el-button>
      <el-button @click="addExperimentDialog1Visiabsle = false">取 消</el-button>
    </div>
    <user-participate-dialog :visible.sync="addUserToExperimentVisible"
                             :form="form"
                             @close-dialog="addUserToExperimentVisible = false"></user-participate-dialog>
    <user-add-dialog :visible.sync="userAddVisible"
                     @finish-add-participate="getAllParticipates"
                     @close-dialog="userAddVisible = false"></user-add-dialog>
  </el-dialog>
</template>

<script>
import UserAddDialog from './UserAddDialog'
import UserParticipateDialog from './UserParticipateDialog'
export default {
  name: 'UserDialog',
  components: {
    UserAddDialog,
    UserParticipateDialog
  },
  data () {
    return {
      addUserToExperimentVisible: false,
      userAddVisible: false,
      participateTableData: [
        {
          id: 1,
          studentId: '11xxxx',
          name: '张三',
          group: 'ASP'
        }
      ]
    }
  },
  props: {
    visible: {
      type: Boolean
    },
    form: {}
  },
  created () {
    this.getAllParticipates()
  },
  methods: {
    handleNextDialog (type) {
      this.$emit('next-dialog', type)
    },
    // 获取所有参试人员
    getAllParticipates () {
      // TODO(后端请求 participateTableData)
    },
    handleDeleteUser (userInfo) {
      this.$confirm('确定要删除该用户吗？', '提示', {
        type: 'warning'
      }).then(() => {
        // TODO （后端请求）
        this.$message.success('用户已删除')
      })
        .catch(() => {})
    }
  }
}
</script>

<style scoped>
.table-box {
  margin-top: 10px;
}
.function-box {
  text-align: right;
}
</style>
