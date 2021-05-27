<template>
  <div class="app-container">
    <edit-form :id="id" v-bind:item.sync="item" :rules="rules" :mode="mode" :from-id="fromId" @created="created" @add="add" @update="update" @reset="reset">
      <template v-slot:item="{ item }">

        <el-form-item label="名称">
          <el-input class="name" v-model="item.name" width=200 @blur="checkName"/>
        </el-form-item>

        <society-form-section
          v-bind:avatar.sync="item.avatar"
          v-bind:city.sync="item.city"
          v-bind:province.sync="item.province"
          v-bind:phone.sync="item.phone"
          v-bind:email.sync="item.email"
        />

        <tag-form-section v-bind:selectedTags.sync="item.tags" />

        <organization-form-section v-bind:organization.sync="item.organization" />

        <el-form-item prop="introduction" label="简介">
          <div class="editor-container"><RichTextEditor v-model="item.introduction" height="300px" /></div>
        </el-form-item>
      </template>
    </edit-form>
  </div>
</template>

<script>
import SocietyFormSection from '@/components/SocietyFormSection';
import TagFormSection from '@/components/TagFormSection';
import OrganizationFormSection from '@/components/OrganizationFormSection';
import EditForm from '@/components/EditForm';
import RichTextEditor from '@/components/RichTextEditor';
import Fuse from 'fuse.js';
import updateOfficialUser from '../../graphql/updateOfficialUser.gql';
import officialUsers from '../../graphql/officialUsersShort.gql';
import addOfficialUser from '../../graphql/addOfficialUser.gql';
import officialUser from '../../graphql/officialUser.gql';

export default {
  components: {
    RichTextEditor,
    SocietyFormSection,
    TagFormSection,
    OrganizationFormSection,
    EditForm,
  },
  apollo: {
    officialUsers: {
      query: officialUsers,
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
        'organization.name': [{ required: true, trigger: 'blur', message: '名称不能为空' }],
        avatar: [{ required: true, message: '头像不能为空', trigger: 'cropSuccess' }],
        introduction: [{ required: true, message: '简介不能为空' }],
      },
      mode,
      id,
      fromId,
      item: this.getDefaultItem(),
    };
  },
  methods: {
    getDefaultItem() {
      const now = Date.now();
      return {
        name: '',
        avatar: '',
        province: '',
        city: '',
        phone: '',
        tags: [],
        email: '',
        introduction: '',
        organization: { name: '' },
        updatedAt: now,
        createdAt: now,
      };
    },
    async created(id, callback) {
      const response = await this.$apollo.query({
        query: officialUser,
        variables: {
          id,
        },
      });
      callback(response.data && response.data.officialUser);
    },
    async update(successCallback, failureCallback) {
      const data = { ...this.item };
      const id = this.item._id;
      delete data._id;
      const result = await this.$apollo.mutate(
        {
          mutation: updateOfficialUser,
          variables: {
            id,
            officialUserInput: data,
          },
        },
      );
      result && result.data && result.data.updateOfficialUser ? successCallback() : failureCallback();
    },
    async add(successCallback, failureCallback) {
      const data = { ...this.item };
      delete data._id;
      const result = await this.$apollo.mutate(
        {
          mutation: addOfficialUser,
          variables: {
            officialUserInput: data,
          },
        },
      );
      if (result && result.data && result.data.addOfficialUser) {
        this.item = result && result.data && result.data.addOfficialUser;
        this.mode = 'EDIT';
        successCallback();
      } else {
        failureCallback();
      }
    },
    reset() {
      this.item = this.getDefaultItem();
    },
    checkName(event) {
      if (this.officialUsers && this.item.name) {
        const fuse = new Fuse(this.officialUsers, {
          keys: ['name'],
        });
        const existing = fuse.search(this.item.name);
        console.log(existing);

        if (existing) {
          this.$message({
            message: `检测到"${existing.map((e) => e.item.name + (e.item.organization ? `(${e.item.organization.name})` : '')).slice(0, 3).join('、')}"等相似官方账号已存在，请确认录入信息未重复！`,
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
.editor-container {
  margin-bottom: 30px;
  line-height: 0px;
}
</style>
