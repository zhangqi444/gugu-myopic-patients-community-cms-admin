<template>
  <el-form ref="form" :model="data" :rules="rules" label-width="150px" class="form">
      <slot></slot>
      <el-form-item>
        <div>
          <el-button type="primary" @click="onSubmit">完成</el-button>
          <el-button @click="onCancel">取消</el-button>
          <el-button @click="onReset">重置</el-button>
        </div>
      </el-form-item>
    </el-form>
</template>

<script>

const FORM_NAME = 'form';

export default {
  name: 'FormTemplate',
  props: {
    rules: { type: Object, default() { return {}; } },
    data: { type: Object, default() { return {}; } },
    defaultData: { type: Object, default() { return {}; } },
  },
  methods: {
    onSubmit() {
      this.$emit('onSubmit');
      const vm = this;
      this.$refs[FORM_NAME].validate(async (valid) => {
        if (valid) {
          vm.$emit('onSubmitting', (result) => {
            if (result && result.code === 0 && result.data) {
              vm.$message({ message: '保存成功！', type: 'success' });
              vm.$refs[FORM_NAME].resetFields();
              return true;
            }
            vm.$message({ message: '保存失败！', type: 'error' });
            return false;
          });
        } else {
          vm.$message({ message: '输入的信息未通过验证，请补充!', type: 'error' });
          return false;
        }
      });
      this.$emit('onSubmited');
    },
    onCancel() {
      this.$router.back();
      this.$emit('onCancel');
    },
    onReset() {
      this.$refs[FORM_NAME].resetFields();
      this.$emit('onReset');
    },
  },
};
</script>

<style scoped>
.form {
  margin-top: 30px;
}
</style>
