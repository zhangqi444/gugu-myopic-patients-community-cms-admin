<template>
  <div class="app-container">
    <list
      :list="list"
      :list-loading="listLoading"
      :page-sizes="pageSizes"
      :count="count"
      :list-body="listBody"
      :list-header="listHeader"
      :current-page="currentPage"
      :edit-page="'tagEdit'"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
    />
  </div>
</template>

<script>
import List from '@/components/List';
import tags from '../../graphql/tags.gql';

export default {
  components: {
    List,
  },
  data() {
    return {
      list: [],
      listLoading: true,
      currentPage: 1,
      count: -1,
      pageSizes: [50, 100, 200],
      listBody: [],
      listHeader: [],
      size: 50,
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      this.listLoading = true;
      const skip = this.size * (this.currentPage - 1);
      const limit = this.size;
      const response = await this.$apollo.query({
        query: tags,
        variables: {
          option: {
            skip,
            limit,
          },
        },
      });
      if (response.data) {
        this.list = response.data.tags;
        if (this.list.length === this.size) {
          this.count = this.size * this.currentPage + 1;
        } else {
          this.count = skip + this.list.length;
        }
      }
      this.listLoading = false;
      this.listHeader = [
        { label: 'ID', prop: '_id' }, { label: '名字', prop: 'name' },
      ];
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
