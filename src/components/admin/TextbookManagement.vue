<template>
  <div class="container">
    <container-header title="自学培训教材管理"></container-header>
    <!--新增教材按钮-->
    <div class="function-box">
      <el-button
        type="info"
        @click="textbookFormDialogTitle = '新增教材'; textbookFormVisible = true"
      >新增教材
      </el-button>
    </div>
    <!--教材列表-->
    <el-table
      class="table-box"
      :data="tableData"
      size="small">
      <!--教材链接栏-->
      <el-table-column label="教材" prop="textbook">
        <template slot-scope="scope">
          <el-link type="primary" :href="scope.row.textbook">xxx教材(点击下载)</el-link>
        </template>
      </el-table-column>
      <!--上传时间栏-->
      <el-table-column label="上传时间" prop="uploadTime">
      </el-table-column>
      <!--实验栏-->
      <el-table-column label="所属实验" prop="experiment">
      </el-table-column>
      <!--实验栏-->
      <el-table-column label="所属组别" prop="group">
      </el-table-column>
      <!--操作栏-->
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="textbookFormDialogTitle = '更新教材'; textbookFormVisible = true; handleUpdate(scope.$index, scope.row)">更新
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--教材信息添加,修改对话框-->
    <el-dialog :title="textbookFormDialogTitle" :visible.sync="textbookFormVisible" width="30%">
      <el-form :model="textbookForm" label-width="80px" >
        <el-form-item label="文件名">
          <el-input v-model="textbookForm.name"></el-input>
        </el-form-item>
        <el-form-item label="所属实验">
          <el-select v-model="textbookForm.region" placeholder="请选择所属实验">
            <el-option v-for="(item, index) in experimentItems" :key="index"
                       :label="item.elabel" :value="item.evalue"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属组别">
          <el-select v-model="textbookForm.region" placeholder="请选择所属组别">
            <el-option v-for="(item, index) in groupItems" :key="index"
                       :label="item.glabel" :value="item.gvalue"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="textbookFormVisible = false">上传文件</el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="textbookFormVisible = false">确 定</el-button>
        <el-button @click="textbookFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ContainerHeader from '../common/ContainerHeader'

export default {
  name: 'TextbookDownload',
  components: {
    ContainerHeader
  },
  data () {
    return {
      textbookFormVisible: false,
      textbookForm: {},
      textbookFormDialogTitle: '',
      // 所有实验
      experimentItems: [
        {
          elabel: 'ASP实验',
          evalue: 'asp_experiment'
        },
        {
          elabel: 'LPMLN测试',
          evalue: 'lpmln_experiment'
        }
      ],
      // 所有组别
      groupItems: [
        {
          glabel: 'ASP组别',
          gvalue: 'asp_group'
        },
        {
          glabel: 'LPMLN组别',
          gvalue: 'lpmln_group'
        }
      ],
      tableData: [
        {
          textbook: '教材下载链接',
          uploadTime: '2023-01-01 14:00',
          experiment: 'ASP实验',
          group: 'ASP'
        },
        {
          textbook: '教材下载链接',
          uploadTime: '2023-01-01 14:00',
          experiment: 'LPMLN测试',
          group: 'LPMLN'
        }
      ]
    }
  },
  methods: {
    // 触发新增教材按钮
    addTextbook () {
      // TODO
    },
    // 触发更新教材按钮
    handleUpdate (index, row) {
      // TODO 教材信息更新
    },
    // 触发删除教材按钮
    handleDelete (index, row) {
      // 二次确认
      this.$confirm('确定要分析吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.$message.success('分析成功')
        // TODO 分析流程
      })
        .catch(() => {
        })
    }
  }
}
</script>

<style scoped>
.function-box {
  margin-bottom: 10px;
  text-align: right;
}

.table-box {
  /*width: 80%;*/
}

</style>
