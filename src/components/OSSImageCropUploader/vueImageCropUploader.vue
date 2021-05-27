<template>
  <div id="image-crop-uploader">
    <el-avatar class="img" :src="imgDataUrl" />
    <div class="controller">
      <div class="crop">
        <div class="crop-text">可选裁剪参数：</div>
        <el-input class="crop-input" placeholder="宽度默认240px" @input="changeWidth" v-model="width" />
        <div>&nbsp;&nbsp;X&nbsp;&nbsp;</div>
        <el-input class="crop-input" placeholder="高度默认240px" v-model="height" @input="changeHeight" />
      </div>
      <el-button class="btn" :disabled="width <= 0 || height <= 0" type="primary" round @click="toggleShow">{{ '上传图片' }}</el-button>
    </div>

    <vue-image-crop-upload
      v-model="show"
      :width="width"
      :height="height"
      @src-file-set="srcFileSet"
      @crop-success="cropSuccess"
      />

  </div>
</template>>

<script>

import 'babel-polyfill';
import VueImageCropUpload from 'vue-image-crop-upload';

export default {
  name: 'VueImageCropUploader',
  components: {
    'vue-image-crop-upload': VueImageCropUpload,
  },
  props: {
    imgDataUrl: {
      type: String,
      default() {
        return '';
      },
    },
  },
  data() {
    return {
      show: false,
      imgFormat: '',
      width: 240,
      height: 240,
    };
  },
  methods: {
    toggleShow() {
      if (!this.width || !this.height) {
        this.$message({ message: '请输入图片裁剪参数!', type: 'danger', duration: 3000 });
        return;
      }
      this.show = !this.show;
    },
    srcFileSet(fileName, fileType, fileSize) {
      this.$emit('srcFileSet', fileName, fileType, fileSize);
    },
    async cropSuccess(imgDataUrl, field, ki) {
      this.$emit('cropSuccess', imgDataUrl, field);
    },
    changeWidth(value) {
      this.width = value === '' ? 0 : Number(value);
    },
    changeHeight(value) {
      this.height = value === '' ? 0 : Number(value);
    },
  },
};

</script>

<style scoped>
.img {
  width: 128px;
  height: 128px;
  display: flex;
}
#image-crop-uploader {
  display: flex;
  align-items: center;
}
.btn {
  margin-left: 15px;
}
.controller {
  display: flex;
  flex-direction: column;
}
.crop {
  display: flex;
  flex-direction: row;
  padding: 20px;
}
.crop-text {
  padding-right: 10px;
}
.crop-input {
  width: 128px;
}
</style>
