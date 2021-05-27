<template>
  <div>
    <el-tag
      v-for="tag in tags"
      :key="tag.name"
      closable
      :disable-transitions="false"
      @close="closeTag(tag, tags)"
    >
      {{ tag.label ? tag.label : tag.name }}
    </el-tag>
    <el-autocomplete
      v-if="inputVisible"
      ref="tagInput"
      v-model="inputValue"
      class="input-new-tag"
      :fetch-suggestions="filterTags"
      value-key="name"
      placeholder="请输入"
      :trigger-on-focus="false"
      size="small"
      @select="handleSelect"
    />
    <el-button
      v-else
      class="button-new-tag"
      size="small"
      @click="showTagInput"
    >
      + 添加
    </el-button>
  </div>
</template>

<script>

export default {
  name: 'DynamicTagObjectEditor',
  props: {
    tags: {
      type: Array,
      default() {
        return [];
      },
    },
    allTags: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      inputVisible: false,
      inputValue: '',
    };
  },
  methods: {
    closeTag(tag, tags) {
      this.$emit('closeTag', tag, tags);
    },
    showTagInput(type) {
      this.inputVisible = true;
      this.$nextTick((_) => {
        this.$refs.tagInput.$refs.input.focus();
      });
    },
    async filterTags(queryString, callback) {
      const results = this.allTags && this.allTags.filter((tag) => (queryString.length > 0) && (tag.name.length > 0) && tag.name.toLowerCase().includes(queryString.toLowerCase()));
      // call callback function to return suggestions
      callback(results);
    },
    handleSelect(item) {
      this.inputVisible = false;
      this.$emit('confirmTag', item);
      this.inputValue = '';
    },
  },
};
</script>

<style scoped>
.line{
  text-align: center;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 200px;
  margin-left: 10px;
  vertical-align: bottom;
}

</style>
