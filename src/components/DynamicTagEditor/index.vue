<template>
  <div>
    <el-tag
      v-for="tag in tags"
      :key="tag"
      closable
      :disable-transitions="false"
      @close="closeTag(tag, tags)"
    >
      {{ tag }}
    </el-tag>
    <el-input
      v-if="inputVisible"
      ref="tagInput"
      v-model="inputValue"
      class="input-new-tag"
      size="small"
      @keyup.enter.native="confirmTag"
      @blur="confirmTag"
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
  name: 'DynamicTagEditor',
  props: {
    tags: {
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
    confirmTag() {
      this.inputVisible = false;
      this.$emit('confirmTag', this.inputValue, this.tags);
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
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}

</style>
