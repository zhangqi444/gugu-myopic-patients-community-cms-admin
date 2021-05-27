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
          v-bind:location.sync="item.location"
          v-bind:phone.sync="item.phone"
          v-bind:email.sync="item.email"
          v-bind:website.sync="item.website"
        />

        <el-form-item label="类型/所有制/资质" prop="tpc">
          <el-cascader
            ref="tpcCascader"
            class="tpc-cascader"
            :v-model="tpc"
            :options="tpcOptions"
            placeholder="类型/所有制/资质"
            :props="{ expandTrigger: 'hover' }"
            @change="onTpcChange"
          />
        </el-form-item>

        <div class="tag-editors-container">
          <el-form-item label="其他资质">
            <dynamic-tag-editor :tags="item.otherClassification" @closeTag="closeTag" @confirmTag="confirmTag" />
          </el-form-item>
          <el-form-item label="别称">
            <dynamic-tag-editor :tags="item.alias" @closeTag="closeTag" @confirmTag="confirmTag" />
          </el-form-item>
          <el-form-item label="排名">
            <dynamic-tag-editor
              :tags="item.rank"
              @closeTag="closeTag"
              @confirmTag="confirmTag"
            />
          </el-form-item>
        </div>

        <el-form-item label="交通方式">
          <el-collapse>
            <el-collapse-item title="点击打开交通方式编辑器">
              <div class="editor-container">
                <RichTextEditor v-model="item.route" height="300px" />
              </div>
            </el-collapse-item>
          </el-collapse>
        </el-form-item>

        <el-form-item label="挂号信息">
          <el-collapse>
            <el-collapse-item title="点击打开挂号信息编辑器">
              <div class="editor-container">
                <RichTextEditor v-model="item.registration" height="300px" />
              </div>
            </el-collapse-item>
          </el-collapse>
        </el-form-item>

        <el-form-item prop="introduction" label="简介">
          <div class="editor-container"><RichTextEditor v-model="item.introduction" height="300px" /></div>
        </el-form-item>
      </template>
    </edit-form>
  </div>
</template>

<script>
import DynamicTagEditor from '@/components/DynamicTagEditor';
import RichTextEditor from '@/components/RichTextEditor';

import SocietyFormSection from '@/components/SocietyFormSection';
import EditForm from '@/components/EditForm';
import Fuse from 'fuse.js';
import updateOrganization from '../../graphql/updateOrganization.gql';
import addOrganization from '../../graphql/addOrganization.gql';
import organization from '../../graphql/organization.gql';
import organizations from '../../graphql/organizationsShort.gql';

const CLASSIFICATIONS = [
  { value: 'Y', label: '诊所' },
  { value: '3A', label: '三级甲等' }, { value: '3B', label: '三级乙等' }, { value: '3C', label: '三级丙等' },
  { value: '2A', label: '二级甲等' }, { value: '2B', label: '二级乙等' }, { value: '2C', label: '二级丙等' },
  { value: '1A', label: '一级甲等' }, { value: '1B', label: '一级乙等' }, { value: '1C', label: '一级丙等' },
  { value: '3X', label: '三级' }, { value: '2X', label: '二级' }, { value: '1X', label: '一级' },
];
export default {
  components: {
    RichTextEditor,
    SocietyFormSection,
    EditForm,
    DynamicTagEditor,
  },
  apollo: {
    organizations: {
      query: organizations,
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

    const tpcValidator = (rule, value, callback) => {
      this.tpc && this.tpc.length > 0 ? callback() : callback(new Error('类型/所有制/资质不能为空'));
    };

    return {
      tpcOptions: [
        {
          value: 'HOSPITAL',
          label: '医院',
          children: [
            { value: 'PUBLIC', label: '公立', children: CLASSIFICATIONS },
            { value: 'PRIVATE', label: '私立', children: CLASSIFICATIONS },
          ],
        },
        {
          value: 'COMPANY',
          label: '公司',
          children: [
            { value: 'PUBLIC', label: '公立' },
            { value: 'PRIVATE', label: '私立' },
          ],
        },
        { value: 'OTHER', label: '其他' },
      ],
      rules: {
        name: [{ required: true, message: '名称不能为空' }],
        avatar: [{ required: true, message: '头像不能为空', trigger: 'cropSuccess' }],
        tpc: [{
          required: true, type: 'array', validator: tpcValidator, message: '类型/所有制/资质不能为空', trigger: 'change',
        }],
        introduction: [{ required: true, message: '简介不能为空' }],
      },
      tpc: [],
      id,
      mode,
      fromId,
      item: this.getDefaultItem(),
    };
  },
  methods: {
    getDefaultItem() {
      return {
        name: '',
        type: '',
        property: '',
        classification: '',
        alias: [],
        province: '',
        city: '',
        location: '',
        phone: '',
        introduction: '',
        registration: '',
        website: '',
        route: '',
        rank: [],
        avatar: '',
        isDeleted: false,
        isBlocked: false,
        updatedAt: Date.now(),
        createdAt: Date.now(),
      };
    },
    async created(id, callback) {
      const response = await this.$apollo.query({
        query: organization,
        variables: {
          id,
        },
      });
      const { type, property, classification } = response.data && response.data.organization;
      if (type && property && classification) {
        this.$refs.tpcCascader.checkedValue = [type, property, classification];
        this.tpc = [type, property, classification];
      }
      callback(response.data && response.data.organization);
    },
    async update(successCallback, failureCallback) {
      const data = { ...this.item };
      const id = data._id;
      delete data._id;
      const result = await this.$apollo.mutate(
        {
          mutation: updateOrganization,
          variables: {
            id,
            organizationInput: data,
          },
        },
      );
      result && result.data && result.data.updateOrganization ? successCallback() : failureCallback();
    },
    async add(successCallback, failureCallback) {
      const data = { ...this.item };
      delete data._id;
      const result = await this.$apollo.mutate(
        {
          mutation: addOrganization,
          variables: {
            organizationInput: data,
          },
        },
      );
      if (result && result.data && result.data.addOrganization) {
        this.item = result && result.data && result.data.addOrganization;
        this.mode = 'EDIT';
        successCallback();
      } else {
        failureCallback();
      }
    },
    closeTag(tag, tags) {
      tag && tags.splice(tags.indexOf(tag), 1);
    },
    confirmTag(tag, tags) {
      tag && tags.push(tag);
    },
    onTpcChange(v) {
      this.item.type = v[0];
      this.item.property = v[1];
      this.item.classification = v[2];
      this.tpc = v;
    },
    reset() {
      this.item = this.defaultItem();
    },
    checkName(event) {
      if (this.organizations && this.item.name) {
        const fuse = new Fuse(this.organizations, {
          keys: ['name'],
        });
        const existing = fuse.search(this.item.name);
        if (existing && existing.length > 0) {
          this.$message({
            message: `检测到"${existing.map((e) => e.item.name).slice(0, 3).join('、')}"等相似机构已存在，请确认录入信息未重复！`,
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
.name {
  width: 300px;
}
.province-city-location, .contact, .name-avatar, .tag-editors-container {
  display: flex;
  flex-direction: row;
}
.editor-container {
  margin-bottom: 30px;
  line-height: 0px;
}
.te-preview {
  width: unset
}
.tpc-cascader {
  width: 200px
}
</style>
