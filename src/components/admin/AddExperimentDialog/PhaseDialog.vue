<template>
  <!--新建实验3-实验阶段管理-->
  <el-dialog title="实验阶段管理" :visible.sync="visible" width="35%">
    <el-form :model="form" label-width="80px" >
      <div v-for="(item, index) in form.phases" :key="index">
        <div style="font-weight: bold">阶段{{index+1}}<br/></div>
        <el-form-item label="阶段名">
          <el-input v-model="item.phaseName"></el-input>
        </el-form-item>
        <el-form-item label="阶段类型">
          <el-select v-model="item.phaseType">
            <el-option v-for="(phase, index) in allPhaseTypes" :key="index" :label="phase" :value="phase"></el-option>
          </el-select>
        </el-form-item>
      </div>
    </el-form>
    <!--添加选项按钮-->
    <div class="function-box">
      <el-button type="primary" @click="addPhase" size="small" plain>添加阶段</el-button>
    </div>
    <div slot="footer">
      <el-button type="primary" @click="handleNextDialog(-1)">上一步</el-button>
      <!--下一步需要生成问题管理列表-->
      <el-button type="primary" @click="handleNextDialog(1)">下一步</el-button>
      <el-button @click="handleNextDialog(0)">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'PhaseDialog',
  data () {
    return {
      allPhaseTypes: []
    }
  },
  props: {
    form: {
      phases: []
    },
    visible: {
      type: Boolean
    }
  },
  created () {
    this.getAllPhaseTypes()
  },
  methods: {
    handleNextDialog (type) {
      this.$emit('next-dialog', type)
    },
    getAllPhaseTypes () {
      // TODO(后端请求)
      this.allPhaseTypes = ['问卷', '编程']
    },
    addPhase () {
      this.$emit('add-phase')
    }
  }
}
</script>

<style scoped>

</style>
