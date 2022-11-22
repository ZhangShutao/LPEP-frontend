<template>
  <!--新建实验1-基本信息-->
  <el-dialog title="基本信息" :visible.sync="visible" width="35%" :show-close="false" :before-close="beforeClose">
    <el-form :model="form" label-width="80px" :rules="formRules" ref="formRef">
      <el-form-item label="实验名" prop="experName">
        <el-input v-model="form.experName"></el-input>
      </el-form-item>
      <el-form-item label="开始时间" prop="startTime">
        <el-date-picker
          v-model="form.startTime"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择日期时间" >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="工作目录" prop="workspace">
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
  data () {
    return {
      formRules: {
        experName: [
          { required: true, message: '请输入实验名', trigger: 'blur' }
        ],
        startTime: [
          { required: true, message: '请选择时间', trigger: 'change' }
        ],
        workspace: [
          { required: true, message: '请输入共组目录', trigger: 'blur' }
        ]
      }
    }
  },
  props: {
    form: {
      experName: {
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
      if (type === 1) {
        this.$refs.formRef.validate((value) => {
          if (!value) {
            return false
          }
          console.log('校验成功')
          this.$emit('next-dialog', type)
        })
      } else {
        this.$emit('next-dialog', type)
      }
    }
  }
}
</script>

<style scoped>

</style>
