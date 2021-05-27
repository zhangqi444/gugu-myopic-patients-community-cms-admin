<template>
  <div class="app-container">
    <edit-form :id="id" v-bind:item.sync="item" :rules="rules" :mode="mode" :from-id="fromId" @created="created" @add="add" @update="update" @reset="reset">
      <template v-slot:item="{ item }">

        <el-form-item label="名称">
          <el-input class="name" v-model="item.name" width=200 @blur="checkName"/>
        </el-form-item>

        <society-form-section
          v-bind:avatar.sync="item.avatar"
          v-bind:gender.sync="item.gender"
          v-bind:birthYear.sync="item.birthYear"
          v-bind:city.sync="item.city"
          v-bind:province.sync="item.province"
          v-bind:phone.sync="item.phone"
          v-bind:email.sync="item.email"
        />

        <tag-form-section v-bind:selectedTags.sync="item.tags" />

        <el-form-item label="部门" >
          <div class="flex column" >
            <div class="flex row" v-for="(department, index) in item.departments" :key="index">
              <el-input class="department-input" placeholder="输入名称" v-model="department.name">
                <template slot="prepend">{{`部门${index+1}`}}</template>
              </el-input>
              <el-input class="department-input" placeholder="输入位置" v-model="department.location">
              </el-input>
              <el-input class="department-input" v-for="(subDepartment, subIndex) in department.subDepartments" :key="subIndex" 
                placeholder="输入名称" v-model="subDepartment.name">
                <template slot="prepend">{{`子部门${subIndex+1}`}}</template>
              </el-input>
              <div>
                <el-button class="department-button" @click="addSubDepartment(index)" size="small" plain>+添加子部门</el-button>
                <el-button class="department-button" @click="removeSubDepartment(index)" size="small" type='danger'>删除</el-button>
              </div>
            </div>
            <div>
              <el-button class="department-button" @click="addDepartment()" size="small" >+添加部门</el-button>
              <el-button class="department-button" @click="removeDepartment()" size="small" type='danger'>删除</el-button>
            </div>
          </div>
        </el-form-item>

        <div class="flex row">
          
        <organization-form-section v-bind:organization.sync="item.organization" />
          <el-form-item label="职称" prop="title">
            <el-input v-model="item.title" class="title" />
          </el-form-item>
          <el-form-item label="其他职称">
            <dynamic-tag-editor :tags="item.otherTitles" @closeTag="closeTag" @confirmTag="confirmTag" />
          </el-form-item>
        </div>
        <div class="flex row">
          <el-form-item v-if="id" label="旧标签(请勿添加)">
            <dynamic-tag-editor :tags="item.specialtyTags" @closeTag="closeTag" />
          </el-form-item>
        </div>

        <el-form-item label="简介" prop="introduction">
          <div class="editor-container"><RichTextEditor v-model="item.introduction" height="300px" /></div>
        </el-form-item>
        <el-form-item label="资质" prop="qualification">
          <div class="editor-container"><RichTextEditor v-model="item.qualification" height="300px" /></div>
        </el-form-item>
        <el-form-item label="专长" prop="specialty">
          <div class="editor-container"><RichTextEditor v-model="item.specialty" height="300px" /></div>
        </el-form-item>
      </template>
    </edit-form>
  </div>
</template>

<script>
import DynamicTagEditor from '@/components/DynamicTagEditor';
import RichTextEditor from '@/components/RichTextEditor';
import SocietyFormSection from '@/components/SocietyFormSection';
import TagFormSection from '@/components/TagFormSection';
import OrganizationFormSection from '@/components/OrganizationFormSection';
import EditForm from '@/components/EditForm';
import Fuse from 'fuse.js';
import doctors from '../../graphql/doctorsShort.gql';
import doctor from '../../graphql/doctor.gql';
import addDoctor from '../../graphql/addDoctor.gql';
import updateDoctor from '../../graphql/updateDoctor.gql';

export default {
  components: {
    RichTextEditor,
    SocietyFormSection,
    TagFormSection,
    OrganizationFormSection,
    EditForm,
    DynamicTagEditor,
  },

  apollo: {
    doctors: {
      query: doctors,
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
      id,
      fromId,
      mode,
      item: this.getDefaultItem(),
    };
  },
  methods: {
    getDefaultItem() {
      return {
        name: '',
        gender: 0,
        birthYear: null,
        avatar: '',
        province: '',
        city: '',
        phone: '',
        tags: [],
        updatedAt: Date.now(),
        createdAt: Date.now(),
        email: '',
        introduction: '',
        title: '',
        otherTitles: [],
        organization: { name: '' },
        departments: [],
        specialty: '',
        qualification: '',
      };
    },
    async created(id, callback) {
      const response = await this.$apollo.query({
        query: doctor,
        variables: {
          id,
        },
      });
      callback(response.data && response.data.doctor);
    },
    async update(successCallback, failureCallback) {
      const data = { ...this.item };
      const id = this.item._id;
      delete data._id;
      this.processDepartments(data);
      const result = await this.$apollo.mutate(
        {
          mutation: updateDoctor,
          variables: {
            id,
            doctorInput: data,
          },
        },
      );
      result && result.data && result.data.updateDoctor ? successCallback() : failureCallback();
    },
    async add(successCallback, failureCallback) {
      const data = { ...this.item };
      delete data._id;
      this.processDepartments(data);
      const result = await this.$apollo.mutate(
        {
          mutation: addDoctor,
          variables: {
            doctorInput: data,
          },
        },
      );
      if (result && result.data && result.data.addDoctor) {
        this.item = result && result.data && result.data.addDoctor;
        this.mode = 'EDIT';
        successCallback();
      } else {
        failureCallback();
      }
    },
    processDepartments(data) {
      data.departments && data.departments.forEach((d) => {
        d.subDepartments && d.subDepartments.forEach(sd => { delete sd.__typename; });
        delete d.__typename; 
      });
    },
    reset() {
      this.item = this.getDefaultItem();
    },
    closeTag(tag, tags) {
      tag && tags.splice(tags.indexOf(tag), 1);
    },
    confirmTag(tag, tags) {
      tag && tags.push(tag);
    },
    checkName(event) {
      if (this.doctors && this.item.name) {
        const fuse = new Fuse(this.doctors, {
          keys: ['name'],
        });
        const existing = fuse.search(this.item.name);
        if (existing && existing.length > 0) {
          this.$message({
            message: `检测到"${existing.map((e) => e.item.name + (e.item.organization ? `(${e.item.organization.name})` : '')).slice(0, 3).join('、')}"等相似医生已存在，请确认录入信息未重复！`,
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
    addDepartment() {
      const departments = this.item.departments || [];
      this.item.departments = [ ...departments, { name: '', location: '' } ];
    },
    removeDepartment() {
      this.item.departments = this.item.departments.slice(0, this.item.departments.length - 1);
    },
    addSubDepartment(index) {
      let department = this.item.departments[index];
      const subDepartments = department.subDepartments || [];
      subDepartments.push({ name: '' });
      this.item.departments[index] = { ...department, subDepartments };
      this.item.departments = [ ...this.item.departments ];
    },
    removeSubDepartment(index) {
      let department = this.item.departments[index];
      const subDepartments = department.subDepartments;
      this.item.departments[index] = { ...department, subDepartments: subDepartments.slice(0, subDepartments.length - 1) };
      this.item.departments = [ ...this.item.departments ];
    },
  },
};
</script>

<style scoped>
.name {
  width: 300px;
}
.flex {
  display: flex;
}
.row {
  flex-direction: row;
}
.column {
  flex-direction: column;
}
.editor-container {
  margin-bottom: 30px;
  line-height: 0px;
}
.te-preview {
  width: unset;
}
.tpc-cascader {
  width: 200px;
}
.department-input {
  width: 250px;
}
.department-button {
  width: 100px;
}
</style>
