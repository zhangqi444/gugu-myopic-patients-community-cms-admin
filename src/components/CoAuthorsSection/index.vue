<template>
  <div class="container">
    <el-form-item label="标签">
      <dynamic-tag-object-editor :tags="selectedTags" :all-tags="tags" @closeTag="closeTag" @confirmTag="confirmTag" />
    </el-form-item>
  </div>
</template>

<script>
import DynamicTagObjectEditor from '@/components/DynamicTagObjectEditor';
import tags from '../../graphql/tags.gql';

export default {
  name: 'TagFormSection',
  components: {
    'dynamic-tag-object-editor': DynamicTagObjectEditor,
  },
  props: {
    selectedTags: { type: Array, default: [] },
  },
  apollo: {
    tags: {
      query: tags,
      variables: {
        option: {
          skip: 0,
        },
        condition: {
          isDeleted: false,
          isBlocked: false,
        },
      },
    },
  },
  methods: {
    closeTag(tag) {
      tag && this.$emit('update:tags', this.selectedTags.splice(this.selectedTags.indexOf(tag), 1));
    },
    confirmTag(tag) {
      tag && !this.selectedTags.find((e) => e._id === tag._id) && this.$emit('update:tags', this.selectedTags.push({ _id: tag._id, name: tag.name }));
    },
  },
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: row;
}
</style>
