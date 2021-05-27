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
      :edit-page="'officialUserEdit'"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
    >

      <template v-slot:list="{}" />

    </list>
  </div>
</template>

<script>
import List from '@/components/List';
import officialUsers from '../../graphql/officialUsers.gql';
import { stripText } from '../../utils/convert';

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
    parse(item) {
      return item && {
        ...item,
        introduction: stripText(item.introduction),
      };
    },
    async fetchData() {
      this.listLoading = true;
      const skip = this.size * (this.currentPage - 1);
      const limit = this.size;
      const response = await this.$apollo.query({
        query: officialUsers,
        variables: {
          option: {
            skip,
            limit,
            sort: {
              _id: 'desc',
            },
          },
        },
      });
      if (response.data) {
        this.list = response.data.officialUsers;
        if (this.list.length === this.size) {
          this.count = this.size * this.currentPage + 1;
        } else {
          this.count = skip + this.list.length;
        }
        this.listBody = [
          {
            label: '标签', prop: 'tags', width: '200', type: 'TAG',
          }, { label: '所属机构', prop: 'organization.name', width: '100' },
          { label: '头像', prop: 'avatar', type: 'IMAGE' }, { label: '省', prop: 'province' }, { label: '市', prop: 'city' },
          { label: '邮箱', prop: 'email' }, { label: '电话', prop: 'phone' }, { label: '介绍', prop: 'introduction', width: '200' },
        ];
        this.list = this.list.map((v) => this.parse(v));
        this.listHeader = [
          { label: 'ID', prop: '_id' }, { label: '标题', prop: 'name' },
        ];
      }
      this.listLoading = false;
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
