<template>
  <div class="app-container">
    <edit-form :id="id" v-bind:item.sync="item" :rules="rules" :mode="mode" :from-id="fromId" @created="created" @add="add" @update="update" @reset="reset">
      <template v-slot:item="{ item }">

        <el-form-item label="标题">
          <el-input class="title" v-model="item.title" width=200 @blur="checkName"/>
        </el-form-item>

        <society-form-section
          v-bind:avatar.sync="item.cover"
          :crop="false"
        />

        <div class="flex row">
          <el-form-item class="flex-one" label="文章源">
            <el-input v-model="item.src" class="src" />
          </el-form-item>
          <el-form-item class="flex-one" label="文章源类型">
            <el-input v-model="item.srcType" class="srcType" />
          </el-form-item>
          <el-form-item class="flex-one" label="视频">
            <el-input v-model="item.video.url" class="video" />
          </el-form-item>
        </div>

        <div class="flex row">
          <el-form-item class="flex-one" prop="authorType" label="作者类型">
            <el-select v-model="item.authorType" @change="$emit('update:item.authorType', $event)">
              <el-option
                v-for="type in authorTypes"
                :key="type.name"
                :label="type.label"
                :value="type.name"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-if="item.authorType === authorTypeOfficialUserName" prop="officialUser.name" class="flex-one" label="作者">
            <el-autocomplete
              v-model="item.officialUser.name"
              class="inline-input"
              :fetch-suggestions="filterOfficialUsers"
              value-key="name"
              placeholder="请输入"
              :trigger-on-focus="false"
              @select="handleSelect"
            />
          </el-form-item>
          <el-form-item v-if="item.authorType === authorTypeExpertName" class="flex-one" prop="expert.name" label="作者">
            <el-autocomplete
              v-model="item.expert.name"
              class="inline-input"
              :fetch-suggestions="filterExperts"
              value-key="name"
              placeholder="请输入"
              :trigger-on-focus="false"
              @select="handleExpertSelect"
            />
          </el-form-item>
          <el-form-item v-if="item.authorType === authorTypeDoctorName" class="flex-one" prop="doctor.name" label="作者">
            <el-autocomplete
              v-model="item.doctor.name"
              class="inline-input"
              :fetch-suggestions="filterDoctors"
              value-key="name"
              placeholder="请输入"
              :trigger-on-focus="false"
              @select="handleDoctorSelect"
            />
          </el-form-item>
          <el-form-item class="flex-one" prop="mediaType" label="媒体类型">
            <el-select v-model="item.mediaType" @change="$emit('update:item.mediaType', $event)">
              <el-option
                v-for="type in mediaTypes"
                :key="type.name"
                :label="type.label"
                :value="type.name"
              />
            </el-select>
          </el-form-item>
        </div>
        <div class="flex row">
          <el-form-item label="联合作者">
            <dynamic-tag-object-editor
              :tags="item.coAuthors === undefined ? [] : item.coAuthors.map(coAuthor=> {
                  switch(coAuthor.authorType) {
                    case authorTypeOfficialUserName:
                      return coAuthor.officialUser;
                    case authorTypeDoctorName:
                      return {...coAuthor.doctor, label: coAuthor.doctor.name + '-' + coAuthor.doctor.organization.name};
                    case authorTypeExpertName:
                      return {...coAuthor.expert, label: coAuthor.expert.name + '-' + coAuthor.expert.organization.name};
                  }
                })"
              :all-tags="allCoAuthorTags"
              @closeTag="closeCoAuthor"
              @confirmTag="confirmCoAuthor"
            />
          </el-form-item>
        </div>
        <tag-form-section v-bind:selectedTags.sync="item.tags" />

        <el-form-item prop="content" label="内容">
          <div class="editor-container"><RichTextEditor v-model="item.content" height="300px" /></div>
        </el-form-item>
      </template>
    </edit-form>
  </div>
</template>

<script>
import RichTextEditor from '@/components/RichTextEditor';
import TagFormSection from '@/components/TagFormSection';
import SocietyFormSection from '@/components/SocietyFormSection';
import EditForm from '@/components/EditForm';
import url from 'url';
import DynamicTagObjectEditor from '@/components/DynamicTagObjectEditor';
import Fuse from 'fuse.js';
import updateArticle from '../../graphql/updateArticle.gql';
import addArticle from '../../graphql/addArticle.gql';
import article from '../../graphql/article.gql';
import officialUsers from '../../graphql/officialUsersShort.gql';
import doctors from '../../graphql/doctorsShort.gql';
import experts from '../../graphql/expertsShort.gql';
import articles from '../../graphql/articlesShort.gql';
import { getTencentVideoVid } from '../../utils/tencent';
import { MEDIA_TYPE, AUTHOR_TYPE } from '../../constants/type';

export default {
  components: {
    RichTextEditor,
    'tag-form-section': TagFormSection,
    'society-form-section': SocietyFormSection,
    'edit-form': EditForm,
    'dynamic-tag-object-editor': DynamicTagObjectEditor,
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
    experts: {
      query: experts,
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
    articles: {
      query: articles,
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
        title: [{ required: true, message: '名称不能为空' }],
        'officialUser.name': [{ required: true, trigger: 'blur', message: '名称不能为空' }],
        'doctor.name': [{ required: true, trigger: 'blur', message: '名称不能为空' }],
        'expert.name': [{ required: true, trigger: 'blur', message: '名称不能为空' }],
        authorType: [{ required: true, trigger: 'blur', message: '名称不能为空' }],
        mediaType: [{ required: true, trigger: 'blur', message: '媒体类型不能为空' }],
      },
      id,
      mode,
      fromId,
      item: this.getDefaultItem(),
      mediaTypes: Object.values(MEDIA_TYPE),
      authorTypes: Object.values(AUTHOR_TYPE),
      authorTypeDoctorName: AUTHOR_TYPE.DOCTOR.name,
      authorTypeOfficialUserName: AUTHOR_TYPE.OFFICIAL_USER.name,
      authorTypeExpertName: AUTHOR_TYPE.EXPERT.name,
    };
  },
  computed: {
    allCoAuthorTags() {
      const officialUsers = this.officialUsers ? this.officialUsers : [];
      const doctors = this.doctors ? this.doctors : [];
      const experts = this.experts ? this.experts : [];
      const result = [...officialUsers, ...doctors, ...experts];
      return result.map((a) => {
        const organizationName = a.organization && a.organization._id ? `-${a.organization.name}` : '';
        return { ...a, label: a.name + organizationName };
      });
    },
  },
  methods: {
    getDefaultItem() {
      return {
        title: '',
        content: '',
        video: {},
        cover: '',
        src: '',
        srcType: '',
        mediaType: '',
        officialUser: { name: '', organization: { name: '' } },
        authorType: '',
        isDeleted: false,
        isBlocked: false,
        doctor: { name: '', organization: { name: '' } },
        expert: { name: '', organization: { name: '' } },
        tags: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
        coAuthors: [],
      };
    },
    async created(id, callback) {
      const response = await this.$apollo.query({
        query: article,
        variables: {
          id,
        },
      });
      const result = response.data && response.data.article;
      if (!result.doctor) result.doctor = { name: '', organization: { name: '' } };
      if (!result.expert) result.expert = { name: '', organization: { name: '' } };
      if (!result.officialUser) result.officialUser = { name: '', organization: { name: '' } };
      callback(result);
    },
    async update(successCallback, failureCallback) {
      const data = { ...this.item };
      const id = data._id;
      delete data._id;
      this.processVideo(data);
      this.processAuthor(data);
      this.processCoAuthors(data.coAuthors);
      const result = await this.$apollo.mutate(
        {
          mutation: updateArticle,
          variables: {
            id,
            articleInput: data,
          },
        },
      );
      result && result.data && result.data.updateArticle ? successCallback() : failureCallback();
    },
    async add(successCallback, failureCallback) {
      if (!this.isValid()) {
        console.log('not valid');
        failureCallback();
        return;
      }

      const data = { ...this.item };
      delete data._id;
      this.processVideo(data);
      this.processAuthor(data);
      this.processCoAuthors(data.coAuthors);
      const result = await this.$apollo.mutate(
        {
          mutation: addArticle,
          variables: {
            articleInput: data,
          },
        },
      );
      if (result && result.data && result.data.addArticle) {
        this.item = result && result.data && result.data.addArticle;
        this.mode = 'EDIT';
        successCallback();
      } else {
        failureCallback();
      }
    },
    reset() {
      this.item = this.getDefaultItem();
    },
    processVideo(data) {
      data.video = data.video && data.video.url && {
        ...data.video,
        vid: getTencentVideoVid(data.video.url),
        source: url.parse(data.video.url).hostname,
      };
      if(data.video) {
        delete data.video.__typename;
      } else {
        data.video = {};
      }
    },
    processAuthor(data) {
      data.officialUser = data.officialUser && data.authorType === AUTHOR_TYPE.OFFICIAL_USER.name ? data.officialUser._id : null;
      data.doctor = data.doctor && data.authorType === AUTHOR_TYPE.DOCTOR.name ? data.doctor._id : null;
      data.expert = data.expert && data.authorType === AUTHOR_TYPE.EXPERT.name ? data.expert._id : null;

      data.tags.forEach((tag) => { delete tag.__typename; });
    },
    processCoAuthors(coAuthors) {
      coAuthors.forEach((coAuthor) => {
        if (coAuthor.officialUser) {
          coAuthor.officialUser = coAuthor.officialUser._id;
        }
        if (coAuthor.doctor) {
          coAuthor.doctor = coAuthor.doctor._id;
        }
        if (coAuthor.expert) {
          coAuthor.expert = coAuthor.expert._id;
        }
        delete coAuthor.__typename;
      });
    },
    isValid() {
      return this.item
      && this.item.title
      && this.item.mediaType
      && this.item.authorType
      && (this.item.authorType === AUTHOR_TYPE.OFFICIAL_USER.name ? this.item.officialUser : true)
      && (this.item.authorType === AUTHOR_TYPE.EXPERT.name ? this.item.expert : true)
      && (this.item.authorType === AUTHOR_TYPE.DOCTOR.name ? this.item.doctor : true)
      && this.item.tags;
    },
    async filterOfficialUsers(queryString, callback) {
      const results = this.officialUsers && this.officialUsers.filter((officialUser) => (queryString.length > 0) && (officialUser.name.length > 0) && officialUser.name.toLowerCase().includes(queryString.toLowerCase()));
      // call callback function to return suggestions
      callback(results);
    },
    async filterDoctors(queryString, callback) {
      const results = this.doctors && this.doctors.filter((doctor) => (queryString.length > 0) && (doctor.name.length > 0) && doctor.name.toLowerCase().includes(queryString.toLowerCase()));
      // call callback function to return suggestions
      callback(results);
    },
    async filterExperts(queryString, callback) {
      const results = this.experts && this.experts.filter((expert) => (queryString.length > 0) && (expert.name.length > 0) && expert.name.toLowerCase().includes(queryString.toLowerCase()));
      // call callback function to return suggestions
      callback(results);
    },
    handleSelect(item) {
      this.item.officialUser._id = item._id;
    },
    handleDoctorSelect(item) {
      this.item.doctor._id = item._id;
    },
    handleExpertSelect(item) {
      this.item.expert._id = item._id;
    },
    closeCoAuthor(coAuthor, coAuthors) {
      coAuthor && this.item.coAuthors.splice(coAuthors.indexOf(coAuthor), 1);
    },
    confirmCoAuthor(coAuthor) {
      if (this.item.coAuthors === null) {
        this.item.coAuthors = [];
      }
      if (coAuthor.__typename === AUTHOR_TYPE.DOCTOR.name) {
        coAuthor && this.item.coAuthors.push({ authorType: coAuthor.__typename, doctor: coAuthor });
      } else if(coAuthor.__typename === AUTHOR_TYPE.OFFICIAL_USER.name) {
        coAuthor && this.item.coAuthors.push({ authorType: coAuthor.__typename, officialUser: coAuthor });
      } else if(coAuthor.__typename === AUTHOR_TYPE.EXPERT.name) {
        coAuthor && this.item.coAuthors.push({ authorType: coAuthor.__typename, expert: coAuthor });
      }
    },
    checkName(event) {
      if (this.articles && this.item.title) {
        console.log(this.articles[0]);
        const fuse = new Fuse(this.articles, {
          keys: ['title'],
        });
        const existing = fuse.search(this.item.title);
        if (existing && existing.length > 0) {
          this.$message({
            message: `检测到"${existing.map((e) => `《${e.item.title}》`).slice(0, 3).join('、')}"等相似文章已存在，请确认录入信息未重复！`,
            type: 'warning',
            showClose: true,
            duration: 10000,
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
.artitle-props, .author, .title-status, .status, .flex, .row {
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
.el-dropdown-link {
  cursor: pointer;
  color: #409EFF;
}
.el-icon-arrow-down {
  font-size: 12px;
}
.flex-one {
  flex: 1
}
</style>
