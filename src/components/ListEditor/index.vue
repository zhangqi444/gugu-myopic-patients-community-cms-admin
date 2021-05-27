<template>
  <div class="flex row">
    <el-button
      size="mini"
      type="success"
      @click="copyRow"
    >
      复制
    </el-button>
    <el-button
      size="mini"
      type="primary"
      @click="editRow"
    >
      编辑
    </el-button>
  </div>
</template>

<script>
import '@/assets/css/main.css';

export default {
  name: 'ListEditor',
  props: {
    id: { type: String, default: '' },
    editPage: { type: String, default: '' },
  },
  methods: {
    editRow() {
      const routeData = this.$router.resolve({ name: this.editPage, query: { id: this.id, mode: 'EDIT' } });
      window.open(routeData.href, '_blank');
    },
    copyRow() {
      const routeData = this.$router.resolve({ name: this.editPage, query: { fromId: this.id, mode: 'COPY' } });
      window.open(routeData.href, '_blank');
    },
  },
};
</script>

<style scoped>
</style>
