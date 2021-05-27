<template>
  <form-template v-bind:data.sync="data" :rules="rules" :default-data="defaultData" @onSubmitting="onSubmitting">
    <div class="title">
      <el-form-item label="标题" prop="title">
        <el-input v-model="data.title" class="title" />
      </el-form-item>
      <el-form-item label="封面" prop="cover">
        <oss-image-crop-uploader
          :img-data-url="data.cover"
          @uploadSuccess="handleImageUploadSuccess"
          @uploadFail="handleImageUploadFail"
        />
      </el-form-item>
    </div>
    <div class="row-container">
      <el-form-item label="状态">
        <el-select v-model="data.status" placeholder="请选择">
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
    </div>
    <el-form-item prop="content" label="正文">
      <div class="editor-container"><RichTextEditor v-model="data.content" height="300px" /></div>
    </el-form-item>
  </form-template>
</template>

<script>
import RichTextEditor from '@/components/RichTextEditor';
import OSSImageCropUploader from '@/components/OSSImageCropUploader';
import FormTemplate from '../formTemplate';

export default {
  components: {
    RichTextEditor,
    FormTemplate,
    'oss-image-crop-uploader': OSSImageCropUploader,
  },
  data() {
    const { params } = this.$route;
    return {
      rules: {
        title: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
        content: [{ required: true, message: '正文不能为空' }],
      },
      statusOptions: [
        { value: 'DELETED', label: '删除' },
        { value: 'LOCKED', label: '锁定' },
        { value: 'ACTIVE', label: '激活' },
      ],
      data: params._id ? params : {
        title: '', cover: '', status: 'ACTIVE', content: '', authUrls: '',
      },
      defaultData: {
        title: '', cover: '', status: 'ACTIVE', content: '', authUrls: '',
      },
    };
  },
  created() { // hack to set the default option to select
    // this.data = { ...this.data }
  },
  methods: {
    handleImageUploadSuccess(result) {
      this.$message({ message: '图片上传成功！', type: 'info' });
      this.data.cover = result;
    },
    handleImageUploadFail(e) {
      this.$message({ message: '图片上传失败！', type: 'error' });
    },
    async onSubmitting(callback) {
      try {
        const { params } = this.$route;
        const result = null;
        if (params && params._id) {
          // result = await update({ _id: params._id }, this.data)
        } else {
          // result = await create(this.data)
        }
        callback(result);
      } catch (e) {
        console.error(e);
        callback();
      }
    },
  },
};
</script>

<style scoped>
.title {
  width: 500px;
}
.row-container {
  display: flex;
  flex-direction: row;
}
.editor-container {
  margin-bottom: 30px;
  line-height: 0px;
}
.count {
  width: 100px;
}
</style>
