<template>
  <div class="app-container">
    <list
      :editTarget="editTarget"
      :count="count"
      :listLoading="listLoading"
      :list="list"
      :columns="columns"
      @fetchData="fetchData"
    />
  </div>
</template>

<script>
import List from '@/components/List';
import { ARTICLE_TAGS } from '@/constants/tag';

const MAX_COLUMN_LENGTH = 20;
const TAGS_FILTERS = ARTICLE_TAGS.map((item) => ({ text: item, value: item }));
const STATUS_FILTTERS = [{ text: '激活', value: 'ACTIVE' }, { text: '删除', value: 'DELETED' }, { text: '锁定', value: 'LOCKED' }];

const formatter = function (row, column, key) {
  const value = JSON.stringify(row[key]);
  return value && value.length > MAX_COLUMN_LENGTH ? `${value.substring(0, MAX_COLUMN_LENGTH)}...` : value;
};

export default {
  components: {
    List,
  },
  data() {
    return {
      editTarget: 'functionEdit',
      count: 0,
      listLoading: true,
      list: [],
      columns: [
        { prop: '_id', label: '_id', fixed: 'left' },
        { prop: 'title', label: '标题', width: 150 },
        { prop: 'status', label: '状态', filters: STATUS_FILTTERS },
        { prop: 'cover', label: '封面', isImage: true },
        { prop: 'tags', label: '标签', filters: TAGS_FILTERS },
        { prop: 'createdAt', label: '创建于' },
        { prop: 'updatedAt', label: '更新于' },
        {
          prop: 'content', label: '正文', width: 200, formatter: (row, column) => formatter(row, column, 'content'),
        },
        { prop: 'visitCount', label: '阅读数' },
        { prop: 'authUrls', label: '授权链接', formatter: (row, column) => formatter(row, column, 'authUrls') },
      ],
    };
  },
  methods: {
    async fetchData(skip, limit) {
      try {
        const vm = this;
        const response = '';// await getList(skip, limit)
        if (!response
            || !response.data
            || !response.data.list
            || response.data.list.length !== response.data.count) {
          return;
        }

        this.count = response.data.count;
        this.list = response.data.list;
        this.listLoading = false;
      } catch (e) {
        console.error(e);
      }
    },
  },
};
</script>
