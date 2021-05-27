<template>
  <div class="container">
    <el-form-item label="基本信息">
      <el-checkbox :value="isDeleted" @change="$emit('update:isDeleted', !isDeleted);">删除</el-checkbox>
      <el-checkbox :value="isBlocked" @change="$emit('update:isBlocked', !isBlocked);">上锁</el-checkbox>
      <span>更新于</span>
      <el-date-picker
        :value="updatedAt"
        type="date"
        v-on:input="$emit('update:updatedAt', $event ? $event.getTime() : null)"
        placeholder="选择日期"
      />
      <span>创建于</span>
      <el-date-picker
        :value="createdAt"
        placeholder="选择日期"
        v-on:input="$emit('update:createdAt', $event ? $event.getTime() : null)"
        type="date"
      />
    </el-form-item>
  </div>
</template>

<script>

export default {
  name: 'BasicFormSection',
  props: {
    isDeleted: { type: Boolean },
    isBlocked: { type: Boolean },
    updatedAt: { type: Number },
    createdAt: { type: Number },
  },
  methods: {
  },
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: row;
}
</style>
