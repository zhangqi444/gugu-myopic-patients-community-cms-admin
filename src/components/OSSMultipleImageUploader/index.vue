<template>
  <div>
    <el-upload
      action=""
      :auto-upload="true"
      :http-request="upload"
      list-type="picture-card"
      :file-list="fileList"
      :on-preview="preview"
      :on-remove="remove"
      :disabled="!this.isMultipleMode && this.uploadedFiles.length > 0"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>>

<script>

import OSS from '../../utils/oss';

export default {
  name: 'OSSMultipleImageUploader',
  props: {
    fileList: {
      type: Array,
      default() {
        return [];
      },
    },
    isMultipleMode: { type: Boolean, default: true },
  },
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      uploadedFiles: [],
    };
  },
  methods: {
    preview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    async upload(param) {
      try {
        const result = await OSS.put(Buffer.from(await param.file.arrayBuffer()), param.file.name);
        if (!result || !result.url) {
          this.$emit('error');
          return;
        }
        this.uploadedFiles.push(result);
        this.$emit('success', result);
        return result;
      } catch (e) {
        this.$emit('error', e);
      }
    },
    remove(file, fileList) {
      this.$emit('remove', file, fileList);
    },
  },
};

</script>

<style scoped>
.img {
  width: 128px;
  height: 100%;
  display: flex;
}
#image-crop-uploader {
  display: flex;
  align-items: center;
}
.btn {
  height: 48px;
  margin-left: 15px;
}
</style>
