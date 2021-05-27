<template>
  <vue-image-crop-uploader
    :img-data-url="imgDataUrl"
    @cropSuccess="cropSuccess"
    @srcFileSet="srcFileSet"
  />
</template>>

<script>

import 'babel-polyfill';
import VueImageCropUploader from './vueImageCropUploader';
import OSS from '../../utils/oss';

export default {
  name: 'OSSImageCropUploader',
  components: {
    'vue-image-crop-uploader': VueImageCropUploader,
  },
  props: {
    imgDataUrl: { type: String, default: '' },
  },
  data() {
    return {
      avatarFileName: null,
    };
  },
  methods: {
    async cropSuccess(imgDataUrl, field) {
      try {
        const result = await OSS.putDataUrl(imgDataUrl, this.avatarFileName);
        if (!result || !result.url) {
          this.$emit('uploadFail');
          return;
        }
        this.$emit('uploadSuccess', result);
        return result;
      } catch (e) {
        console.log(e);
        this.$emit('uploadFail', e);
      }
    },
    srcFileSet(fileName, fileType, fileSize) {
      this.avatarFileName = fileName;
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
