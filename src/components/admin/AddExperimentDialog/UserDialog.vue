<template>
  <!--新建实验7-参试人员管理-->
  <el-dialog title="参试人员管理" :visible.sync="visible" width="50%"
             :show-close="false"
             :before-close="beforeClose">
    <div class="function-box">
      <el-button type="info" @click="handleAddUserToExperiment">添加用户到实验</el-button>
      <el-button type="info" @click="userAddVisible = true">新增用户</el-button>
    </div>
    <el-table
      class="table-box"
      :data="participantsTableData"
      stripe
      border>
      // 空数据状态的插槽
      <template slot="empty">
        该实验暂没有用户加入
      </template>
      <el-table-column type="index" width="70"></el-table-column>
      <el-table-column label="学号" prop="username"></el-table-column>
      <el-table-column label="姓名" prop="realname"></el-table-column>
      <el-table-column label="当前实验所属组别" prop="groupName"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="handleDeleteUser(scope.row.userId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        background
        layout="prev, pager, next"
        :current-page="userQueryInfo.pageIndex"
        :page-size="userQueryInfo.pageSize"
        :total="userQueryPageTotal"
        @current-change="handlePageChange">
      </el-pagination>
    </div>
    <div slot="footer">
      <el-button type="primary" @click="handleNextDialog(-1)">上一步</el-button>
      <el-button type="primary" @click="handleNextDialog(1)">完成</el-button>
      <el-button @click="handleNextDialog(0)">取 消</el-button>
    </div>
    <user-participate-dialog :visible.sync="addUserToExperimentVisible"
                             :experId="experId"
                             :groupList="groupList"
                             @close-dialog="handleCloseAddUserToExperimentDialog"></user-participate-dialog>
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
      userQueryPageTotal: 0,
      userQueryInfo: {
        pageIndex: 1,
        pageSize: 10
      },
      participantsTableData: [],
      addUserToExperimentVisible: false,
      userAddVisible: false,
      experId: '',
      groupList: []
    }
  },
  props: {
    visible: {
      type: Boolean
    },
    form: {}
  },
  watch: {
    visible: {
      handler () {
        this.getAllParticipates()
      }
    }
  },
  methods: {
    beforeClose () {
      this.$emit('update:visible', false)
    },
    handleNextDialog (type) {
      this.$emit('next-dialog', type)
    },
    handlePageChange (newPage) {
      this.userQueryInfo.pageIndex = newPage
      this.getAllParticipates()
    },
    // 获取所有参试人员
    async getAllParticipates () {
      const { data: res } = await this.$http.post('user/getallusergroup', {
        experId: this.form.experId,
        pageIndex: this.userQueryInfo.pageIndex,
        pageSize: this.userQueryInfo.pageSize
      })
      this.userQueryPageTotal = res.data.recordCount
      this.participantsTableData = res.data.userWithGroupInfoList
    },
    // 用户删除
    handleDeleteUser (userId) {
      this.$confirm('确定要从实验中删除该用户吗？', '提示', {
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.post('user/deletefromexper', {
          experId: this.form.experId,
          userId: userId
        })
        if (res.status === 204) {
          this.$message.success('用户已删除')
        } else {
          this.$message.error(res.msg)
        }
      }).finally(() => {
        this.getAllParticipates()
      })
    },
    // 触发添加用户到实验按钮
    handleAddUserToExperiment () {
      this.addUserToExperimentVisible = true
      this.experId = this.form.experId
      this.groupList = this.form.groupInfoList
    },
    handleCloseAddUserToExperimentDialog () {
      this.addUserToExperimentVisible = false
      this.getAllParticipates()
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
