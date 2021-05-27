<template>
  <oss-multiple-image-uploader />
</template>

<script>

import OSSMultipleImageUploader from '@/components/OSSMultipleImageUploader';

export default {
  components: {
    'oss-multiple-image-uploader': OSSMultipleImageUploader,
  },
  data() {
    return {
    };
  },
  methods: {
    async upload(file) {
      console.log(file);
    },
  },
};
</script>
