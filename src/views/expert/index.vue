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
      :edit-page="'expertEdit'"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
    >

      <template v-slot:list="{}" />

    </list>
  </div>
</template>

<script>
import List from '@/components/List';
import { stripText } from '../../utils/convert';
import experts from '../../graphql/experts.gql';

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
        specialty: stripText(item.specialty),
        qualification: stripText(item.qualification),
        otherTitles: stripText(item.otherTitles && item.otherTitles.join(', ')),
        departments: stripText(item.departments && item.departments.map((v) => v.name).join(', ')),
      };
    },
    async fetchData() {
      this.listLoading = true;
      const skip = this.size * (this.currentPage - 1);
      const limit = this.size;
      const response = await this.$apollo.query({
        query: experts,
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
        this.list = response.data.experts;
        if (this.list.length === this.size) {
          this.count = this.size * this.currentPage + 1;
        } else {
          this.count = skip + this.list.length;
        }
        this.listBody = [
          {
            label: '标签', prop: 'tags', width: '200', type: 'TAG',
          }, { label: '所属机构', prop: 'organization.name', width: '150' },
          { label: '职称', prop: 'title', width: '100' }, { label: '其他职称', prop: 'otherTitles', width: '200' }, { label: '科室', prop: 'departments', width: '100' },
          { label: '头像', prop: 'avatar', type: 'IMAGE' }, { label: '省', prop: 'province' }, { label: '市', prop: 'city' },
          { label: '邮箱', prop: 'email' }, { label: '电话', prop: 'phone' }, { label: '介绍', prop: 'introduction', width: '200' },
          { label: '专长', prop: 'specialty', width: '200' }, { label: '资质', prop: 'qualification', width: '200' },
        ];
        this.list = this.list.map((v) => this.parse(v));
        this.listHeader = [
          { label: 'ID', prop: '_id' }, { label: '姓名', prop: 'name' },
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
