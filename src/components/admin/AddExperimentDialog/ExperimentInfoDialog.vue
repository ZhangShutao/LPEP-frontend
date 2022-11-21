<template>
  <!--新建实验1-基本信息-->
  <el-dialog title="基本信息" :visible.sync="visible" width="35%" :show-close="false" :before-close='beforeClose'>
    <el-form :model="form" label-width="80px" >
      <el-form-item label="实验名">
        <el-input v-model="form.experName"></el-input>
      </el-form-item>
      <el-form-item label="开始时间">
        <el-date-picker
          v-model="form.startDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期">
        </el-date-picker>
        <el-time-picker
          v-model="form.startTime"
          :picker-options="{selectableRange: '00:00:00 - 23:59:59'}"
          value-format="HH:mm:ss"
          placeholder="任意时间点">
        </el-time-picker>
      </el-form-item>
      <el-form-item label="工作目录">
        <el-input v-model="form.workspace"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button type="primary" @click="handleNextDialog(1)">下一步</el-button>
      <el-button @click="handleNextDialog(0)">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'ExperimentInfoDialog',
  props: {
    form: {
      experName: {
        type: String
      },
      startDate: {
        type: String
      },
      startTime: {
        type: String
      },
      workspace: {
        type: String
      }
    },
    visible: {
      type: Boolean
    }
  },
  methods: {
    beforeClose () {
      this.$emit('update:visible', false)
    },
    handleNextDialog (type) {
      this.$emit('next-dialog', type)
    }
  }
}
</script>

<style scoped>

</style>
