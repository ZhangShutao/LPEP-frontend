<template>
  <div class="container">
    <container-header title="参试人员列表"></container-header>
    <div class="function-box">
      <el-button
        type="info"
        @click="addExperiment"
      >添加参试人员</el-button>
    </div>
    <!--实验列表-->
    <el-table
      class="table-box"
      :data="tableData"
      stripe
      border>
      <!--表头属性(不含状态栏,操作栏)-->
      <el-table-column v-for="(item, index) in tableItems" :key="index"
                       :prop="item.prop"
                       :label="item.label"
                       :width="item.width"
      >
      </el-table-column>
      <!--表头属性(操作栏)-->
      <el-table-column label="操作" >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="handleDelete(scope.$index, scope.row)">删除
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleModify(scope.$index, scope.row)">修改
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页按钮-->
    <div class="pagination">
      <el-pagination
        background
        layout="prev, pager, next"
        :current-page="query.pageIndex"
        :page-size="query.pageSize"
        :total="pageTotal"
        @current-change="handlePageChange">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import ContainerHeader from '../common/ContainerHeader'
export default {
  name: 'ParticipantsTable',
  components: {
    ContainerHeader
  },
  data () {
    return {

      tableItems: [
        {
          prop: 'id',
          label: '序号',
          width: 70
        },
        {
          prop: 'name',
          label: '姓名',
          width: 100
        },
        {
          prop: 'studentId',
          label: '学号',
          width: 100
        },
        {
          prop: 'participatedExperiment',
          label: '参与实验',
          width: 200
        },
        {
          prop: 'participatedgroup',
          label: '所属组别',
          width: 150
        },
        {
          prop: 'createdTime',
          label: '添加时间',
          width: 200
        }
      ],
      tableData: [
        {
          id: '1',
          name: '张三',
          studentId: 'xxx',
          participatedExperiment: 'ASP测试',
          participatedgroup: 'ASP',
          createdTime: '2023-01-01 14:00'
        },
        {
          id: '2',
          name: '李四',
          studentId: 'xxx',
          participatedExperiment: 'ASP测试',
          participatedgroup: 'ASP',
          createdTime: '2023-01-01 14:00'
        },
        {
          id: '1',
          name: '张三',
          studentId: 'xxx',
          participatedExperiment: 'LPMLN测试',
          participatedgroup: 'LPMLN',
          createdTime: '2023-01-01 14:00'
        },
        {
          id: '1',
          name: '张三',
          studentId: 'xxx',
          participatedExperiment: 'LPMLN测试',
          participatedgroup: 'LPMLN',
          createdTime: '2023-01-01 14:00'
        }
      ],
      pageTotal: 100,
      query: {
        pageIndex: 1,
        pageSize: 10
      }
    }
  },
  methods: {
    // 新增实验
    addExperiment () {

    },
    filterStatus (value, row) {
      return row.status === value
    },
    // 触发开始实验按钮
    handleDelete (index, row) {
      // 二次确认
      this.$confirm('确定要开始吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.$message.success('实验已开启')
        // TODO 开始流程
      })
        .catch(() => {})
    },
    // 触发取消实验按钮
    handleModify (index, row) {
      // 二次确认
      this.$confirm('确定要取消吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.$message.success('实验已取消')
        // TODO 取消流程
      })
        .catch(() => {})
    }
  }
}
</script>

<style scoped>
.function-box {
  margin-bottom: 10px;
  text-align: right;
}
</style>
