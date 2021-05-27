<template>
  <div class="app-container">
    <image-gallery
      class="gallery"
      :images="images"
      :count="count"
      @fetchData="fetchData"
    />
  </div>
</template>

<script>
import ImageGallery from '@/components/ImageGallery';
import OSS from '../../utils/oss';

const IMAGE_RESIZE_SUFFIX = '?x-oss-process=image/resize,w_300';

export default {
  components: {
    'image-gallery': ImageGallery,
  },
  data() {
    return {
      images: [],
      count: 0,
      allImages: [],
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    async fetchData(skip, limit) {
      try {
        if (!this.allImages || !this.allImages.length) {
          const result = await OSS.list(1000);
          this.allImages = result && result.objects && result.objects.reverse().map((i) => i && i.url + IMAGE_RESIZE_SUFFIX);
          this.count = this.allImages.length;
        }
        this.images = this.allImages.slice(skip, skip + limit);
      } catch (e) {
        console.error(e);
      }
    },
  },
};
</script>
