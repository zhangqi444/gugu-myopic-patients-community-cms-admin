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
      :edit-page="'organizationEdit'"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
    >

      <template v-slot:list="{}" />

    </list>
  </div>
</template>

<script>
import List from '@/components/List';
import organizations from '../../graphql/organizations.gql';
import { stripText, convertType } from '../../utils/convert';

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
    convertClassification(classification) {
      if (!classification) return;
      let level; let
        grade;
      switch (classification.charAt(0)) {
        case '3': level = '三级'; break;
        case '2': level = '二级'; break;
        case '1': level = '一级'; break;
        default: level = ''; break;
      }
      switch (classification.charAt(1)) {
        case 'A': grade = '甲等'; break;
        case 'B': grade = '乙等'; break;
        case 'C': grade = '丙等'; break;
        case 'X': grade = ''; break;
        default: grade = ''; break;
      }
      return level + grade;
    },
    parse(item) {
      return item && {
        ...item,
        classification: this.convertClassification(item.classification),
        introduction: stripText(item.introduction),
        type: convertType(item.type),
        route: stripText(item.route),
        alias: stripText(item.alias && item.alias.join(', ')),
        otherClassification: stripText(item.otherClassification && item.otherClassification.join(', ')),
        property: item.property === 'PUBLIC' ? '公立' : '私立',
        rank: stripText(item.rank && item.rank.join(', ')),
      };
    },
    async fetchData() {
      this.listLoading = true;
      const skip = this.size * (this.currentPage - 1);
      const limit = this.size;
      const response = await this.$apollo.query({
        query: organizations,
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
        this.list = response.data.organizations;
        if (this.list.length === this.size) {
          this.count = this.size * this.currentPage + 1;
        } else {
          this.count = skip + this.list.length;
        }
        this.listBody = [
          {
            label: '类型', prop: 'type', width: '100', filters: [{ text: '公司', value: '公司' }, { text: '医院', value: '医院' }], filterMethod: (value, row) => filter(value, row, 'type'),
          },
          {
            label: '所有制', prop: 'property', width: '100', filters: [{ text: '私立', value: '私立' }, { text: '公立', value: '公立' }], filterMethod: (value, row) => filter(value, row, 'property'),
          },
          {
            label: '资质',
            prop: 'classification',
            width: '100',
            filters: [
              { text: '三级', value: '三级' }, { text: '二级', value: '二级' }, { text: '一级', value: '一级' },
              { text: '三级甲等', value: '三级甲等' }, { text: '二级甲等', value: '二级甲等' }, { text: '一级甲等', value: '一级甲等' },
              { text: '三级乙等', value: '三级乙等' }, { text: '二级乙等', value: '二级乙等' }, { text: '一级乙等', value: '一级乙等' },
              { text: '三级丙等', value: '三级丙等' }, { text: '二级丙等', value: '二级丙等' }, { text: '一级丙等', value: '一级丙等' },
            ],
            filterMethod: (value, row) => filter(value, row, 'classification'),
          },
          { label: '头像', prop: 'avatar', type: 'IMAGE' },
          { label: '省', prop: 'province' }, { label: '市', prop: 'city' }, { label: '地址', prop: 'location' },
          { label: '网址', prop: 'website' }, { label: '电话', prop: 'phone' }, { label: '别称', prop: 'otherClassification' },
          { label: '交通方式', prop: 'route' }, { label: '排名', prop: 'rank' }, { label: '介绍', prop: 'introduction', width: '100' },
        ];
        this.list = this.list.map((v) => this.parse(v));
        this.listHeader = [
          { label: 'ID', prop: '_id' }, { label: '名称', prop: 'name' },
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
