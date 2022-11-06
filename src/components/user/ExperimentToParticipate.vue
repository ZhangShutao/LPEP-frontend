<template>
  <div class="container">
    <container-header title="待参与实验"></container-header>
    <!--实验列表-->
    <el-table
      class="table-box"
      :data="tableData"
      stripe
      border
      size="small">
      <!--表头属性(不含操作栏)-->
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
            type="danger"
            @click="ParticipateExperiment(scope.$index, scope.row)">开始(参加)实验
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
  name: 'ExperimentToBeParticipatedIn',
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
        },
        {
          prop: 'Status',
          label: '状态',
          width: 200
        }
      ],
      tableData: [
        {
          id: '1',
          expName: 'ASP测试',
          startTime: '2023-01-01 14:00',
          Status: '正在进行',
          Operation: '开始实验'
        },
        {
          id: '2',
          expName: 'LPMLN测试',
          startTime: '2023-01-01 14:00',
          Status: '正在进行',
          Operation: '开始实验'
        }
      ],
      pageTotal: 100,
      query: {
        pageIndex: 1,
        pageSize: 10
      }
    }
  }
}
</script>

<style scoped>

.table-box {
  width: 100%
}
</style>
