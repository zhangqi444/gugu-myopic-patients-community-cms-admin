<template>
  <div class="app-container">
    <edit-form :id="id" v-bind:item.sync="item" :rules="rules" :mode="mode" :from-id="fromId" @created="created" @add="add" @update="update" @reset="reset">
      <template v-slot:item="{ item }">
        <el-form-item label="名称">
          <el-input class="name" v-model="item.name" width=200 @blur="checkName"/>
        </el-form-item>
        <!-- <society-form-section
          v-bind:name.sync="item.name"
        /> -->

      </template>
    </edit-form>
  </div>
</template>

<script>
import EditForm from '@/components/EditForm';
import Fuse from 'fuse.js';
import updateTag from '../../graphql/updateTag.gql';
import addTag from '../../graphql/addTag.gql';
import tag from '../../graphql/tag.gql';
import tags from '../../graphql/tags.gql';

export default {
  components: {
    EditForm,
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
  data() {
    const params = this.$route.query || this.$route.params;
    const { id, mode, fromId } = params;

    return {
      rules: {
        name: [{ required: true, message: '名称不能为空' }],
      },
      id,
      mode,
      fromId,
      item: this.defaultItem(),
    };
  },
  methods: {

    defaultItem() {
      return {
        name: '', isDeleted: false, isBlocked: false, updatedAt: Date.now(), createdAt: Date.now(),
      };
    },
    async created(id, callback) {
      const response = await this.$apollo.query({
        query: tag,
        variables: {
          id,
        },
      });
      callback(response.data && response.data.tag);
    },
    async update(successCallback, failureCallback) {
      const data = { ...this.item };
      const id = data._id;
      delete data._id;
      const result = await this.$apollo.mutate(
        {
          mutation: updateTag,
          variables: {
            id,
            tagInput: data,
          },
        },
      );
      result && result.data && result.data.updateTag ? successCallback() : failureCallback();
    },
    async add(successCallback, failureCallback) {
      const data = { ...this.item };
      delete data._id;
      const result = await this.$apollo.mutate(
        {
          mutation: addTag,
          variables: {
            tagInput: data,
          },
        },
      );
      if (result && result.data && result.data.addTag) {
        this.item = result && result.data && result.data.addTag;
        this.mode = 'EDIT';
        successCallback();
      } else {
        failureCallback();
      }
    },
    reset() {
      this.item = this.defaultItem();
    },
    checkName(event) {
      if (this.tags && this.item.name) {
        const fuse = new Fuse(this.tags, {
          keys: ['name'],
        });
        const existing = fuse.search(this.item.name);
        if (existing.length > 0) {
          this.$message({
            message: `检测到"${existing.map((e) => e.item.name).slice(0, 3).join('、')}"等相似标签已存在，请确认录入信息未重复！`,
            type: 'warning',
            showClose: true,
            duration: 0,
          });
        }
      } else {
        setTimeout(() => {
          this.checkName(event);
        }, 1000);
      }
    },
  },
};
</script>

<style scoped>
</style>
