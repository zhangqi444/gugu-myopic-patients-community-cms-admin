<template>
  <div class="container">
    <div class="gallery-container">
      <gallery :images="images" :index="index" @close="index = null"></gallery>
      <div
        class="image"
        v-for="(image, imageIndex) in images"
        :key="imageIndex"
        @click="index = imageIndex"
        :style="{ backgroundImage: 'url(' + image + ')', width: '300px', height: '200px' }"
      ></div>
    </div>
    <el-pagination
      :page-sizes="pageSizes"
      layout="total, sizes, prev, pager, next, jumper"
      :total="count"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
  </div>
</template>

<script>

import VueGallery from 'vue-gallery';

export default {
  name: 'ImageGallery',
  components: {
    gallery: VueGallery,
  },
  props: {
    images: { type: Array, default() { return []; } },
    count: { type: Number, default: 0 },
  },
  data() {
    return {
      currentPage: 1,
      pageSizes: [10, 15, 20],
      size: 10,
      index: null,
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      const skip = this.size * (this.currentPage - 1);
      const limit = this.size;
      this.$emit('fetchData', skip, limit);
    },
    handleSizeChange(value) {
      this.size = value;
      this.fetchData();
    },
    handleCurrentChange(value) {
      this.currentPage = value;
      this.fetchData();
    },
  },
};

</script>

<style scoped>
  .image {
    float: left;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
    border: 1px solid #ebebeb;
    margin: 5px;
  }
  .container {
    display: flex;
    flex-direction: column;
  }
  .gallery-container {
    height: 800px;
  }
</style>
