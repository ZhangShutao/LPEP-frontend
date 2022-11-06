<template>
  <div class="container">
    <container-header title="实验列表"></container-header>
    <div class="function-box">
      <el-button
        type="info"
        @click="addExperiment"
      >新增实验</el-button>
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
      <!--表头属性(状态栏)-->
      <el-table-column label="状态" prop="status"
                       :filters="[{ text: '未开始', value: '未开始' }, { text: '进行中', value: '进行中' }, { text: '已结束', value: '已结束' }]"
                       :filter-method="filterStatus">
      </el-table-column>
      <!--表头属性(操作栏)-->
      <el-table-column label="操作" >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="handleStart(scope.$index, scope.row)"
            :disabled="scope.row.status !== '未开始'">开始
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleCancel(scope.$index, scope.row)"
            :disabled="scope.row.status !== '进行中'">取消
          </el-button>
          <el-button
            size="mini"
            type="success"
            @click="handleAnalysis(scope.$index, scope.row)"
            disabled="scope.row.status !== '已结束'">分析
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
  name: 'ExperimentTable',
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
          prop: 'expName',
          label: '实验名',
          width: 200
        },
        {
          prop: 'startTime',
          label: '开始时间',
          width: 200
        }
      ],
      tableData: [
        {
          id: '1',
          expName: 'ASP测试',
          startTime: '2023-01-01 14:00',
          status: '进行中',
          operation: '开始实验'
        },
        {
          id: '2',
          expName: 'LPMLN测试',
          startTime: '2023-01-01 14:00',
          status: '进行中',
          operation: '开始实验'
        },
        {
          id: '3',
          expName: 'LPMLN测试',
          startTime: '2023-01-01 14:00',
          status: '未开始',
          operation: '开始实验'
        },
        {
          id: '2',
          expName: 'LPMLN测试',
          startTime: '2023-01-01 14:00',
          status: '已结束',
          operation: '开始实验'
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
    handleStart (index, row) {
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
    handleCancel (index, row) {
      // 二次确认
      this.$confirm('确定要取消吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.$message.success('实验已取消')
        // TODO 取消流程
      })
        .catch(() => {})
    },
    // 触发分析实验按钮
    handleAnalysis (index, row) {
      // 二次确认
      this.$confirm('确定要分析吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.$message.success('分析成功')
        // TODO 分析流程
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
