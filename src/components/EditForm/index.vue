<template>
  <div class="app-container">
    <el-form ref="form" :model="item" :rules="rules" label-width="140px">

      <slot name="item" :item="item" />

      <basic-form-section
        v-bind:isDeleted.sync="item.isDeleted"
        v-bind:updatedAt.sync="item.updatedAt"
        v-bind:createdAt.sync="item.createdAt"
        v-bind:isBlocked.sync="item.isBlocked"
      />

      <el-form-item fixed>
        <el-button type="primary" @click="submit">{{ mode === 'EDIT' ? '修改' : '创建' }}</el-button>
        <el-button @click="$router.back">取消</el-button>
        <el-button @click="resetForm">重置</el-button>
        <el-button v-if="mode === 'EDIT'" type="success" @click="copy">复制</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import BasicFormSection from '@/components/BasicFormSection';

const FORM_NAME = 'form';

export default {
  name: 'EditForm',
  components: {
    BasicFormSection,
  },
  props: {
    mode: { type: String, default: '' },
    rules: { type: Object, default: {} },
    item: { type: Object, default: {} },
    id: { type: String, default: '' },
    fromId: { type: String, default: '' },
  },
  created() {
    if (this.mode === 'EDIT' || this.mode === 'COPY') {
      const loading = this.getLoading();
      this.$emit('created', this.mode === 'EDIT' ? this.id : this.fromId, (result) => {
        const newData = {...result};
        delete newData.thumbCount;
        delete newData.shareCount;
        delete newData.visitCount;
        delete newData.commentCount;
        delete newData.collectCount;
        this.$emit('update:item', newData);
        loading.close();
      });
    }
  },
  methods: {
    submit() {
      const vm = this;
      const data = { ...vm.item };

      this.$refs[FORM_NAME].validate(async (valid) => {
        if (valid) {
          vm.clearTypename(data);
          const loading = vm.getLoading();
          vm.$emit(
            vm.mode === 'EDIT' ? 'update' : 'add',
            () => vm.submitCallback(loading, '保存成功！', 'success'),
            () => vm.submitCallback(loading, '保存失败！', 'error'),
          );
          return true;
        }
        vm.$message({
          message: '输入的信息未通过验证，请补充!', type: 'error', showClose: true, duration: 0,
        });
        return false;
      });
    },
    copy() {
      const routeData = this.$router.resolve({ name: this.editPage, query: { fromId: this.item._id, mode: 'COPY' } });
      window.open(routeData.href, '_blank');
    },
    submitCallback(loading, message, type) {
      loading.close();
      this.$message({
        message, type, showClose: true, duration: 0,
      });
    },
    getLoading() {
      return this.$loading({
        lock: true,
        text: '加载中',
        background: 'rgba(0, 0, 0, 0.7)',
      });
    },
    clearTypename(data) {
      delete data.__typename;
      data.organization && delete data.organization.__typename;
      data.tags && data.tags.forEach((tag) => { delete tag.__typename; });
      this.$emit('update:item', data);
    },
    resetForm() {
      this.$refs[FORM_NAME].resetFields();
      this.$emit('reset');
      this.$refs[FORM_NAME].resetFields();
    },
  },
};
</script>

<style scoped>
.editor-container {
  margin-bottom: 30px;
  line-height: 0px;
}
</style>
