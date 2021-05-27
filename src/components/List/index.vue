<template>
  <div>
    <div class="filter">
      <el-button @click="clearFilter">清除所有过滤器</el-button>
      <el-input v-model="search" placeholder="输入关键字搜索" />
    </div>
    <el-table
      ref="table"
      v-loading="listLoading"
      :data="list.filter(item => searchFilter(item))"
      :default-sort="{ prop: '_id', order: 'descending' }"
      element-loading-text="加载中"
      max-height="700"
      border
      fit
      highlight-current-row
    >
      <!-- 表头部分 -->
      <el-table-column
        v-for="column in listHeader"
        :key="column.label"
        align="center"
        :prop="column.prop"
        :label="column.label"
        width="120"
        fixed
        sortable
      />

      <template v-for="column in listBody">
        <el-table-column v-if="column.type === 'TAG'" :key="column.label" align="center" :prop="column.prop" :label="column.label" :width="column.width? column.width : 100" sortable>
          <template slot-scope="scope">
            <el-tag
              v-for="tag in Array.isArray(scope.row[column.prop]) ? scope.row[column.prop] : [scope.row[column.prop]]"
              v-bind:key="tag._id"
            >
              {{ tag.name }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column v-else-if="column.type === 'IMAGE'" :key="column.label" align="center" :prop="column.prop" :label="column.label" :width="column.width? column.width : 100">
          <template slot-scope="scope">
            <el-image class="img" :src="scope.row[column.prop]" fit />
          </template>
        </el-table-column>
        <el-table-column v-else :key="column.label" align="center" :prop="column.prop" :label="column.label" :width="column.width? column.width : 100" sortable />
      </template>

      <slot name="list" :list="list" />

      <!-- 基本信息部分 -->
      <el-table-column
        v-for="column in [
          { label: '创建于', prop: 'createdAt'}, { label: '更新于', prop: 'updatedAt'},
        ]"
        :key="column.label"
        align="center"
        :prop="column.prop"
        :label="column.label"
        :width="column.width? column.width : 140"
        sortable
      >
        <template v-if="scope.row[column.prop] !== undefined" slot-scope="scope">
          <div>{{ new Date(scope.row[column.prop]).toDateString() }}</div>
        </template>
      </el-table-column>
      <el-table-column
        v-for="column in [
          { label: '已删除', prop: 'isDeleted'}, { label: '已被锁', prop: 'isBlocked'}, { label: '已认证', prop: 'isVerified'},
        ]"
        :key="column.label"
        align="center"
        :prop="column.prop"
        :label="column.label"
        :width="column.width? column.width : 100"
        sortable
      >
        <template v-if="scope.row[column.prop] !== undefined" slot-scope="scope">
          <el-tag :type="scope.row[column.prop] ? 'danger': 'success' ">{{ scope.row[column.prop] ? '是' : '否' }}</el-tag>
        </template>
      </el-table-column>

      <!-- 列表更新组建 -->
      <el-table-column fixed="right" label="操作" width="140">
        <template slot-scope="scope">
          <list-editor :id="scope.row._id" :edit-page="editPage" />
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :page-sizes="pageSizes"
      layout="sizes, prev, pager, next, jumper"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
  </div>
</template>

<script>
import Fuse from 'fuse.js';
import ListEditor from '@/components/ListEditor';
import { getAuthor } from '@/utils/convert';

export default {
  name: 'List',
  components: {
    ListEditor,
  },
  props: {
    list: { type: Array, default() { return []; } },
    listLoading: { type: Boolean, default() { return true; } },
    pageSizes: { type: Array, default() { return []; } },
    editPage: { type: String, default: '' },
    listBody: { type: Array, default() { return []; } },
    listHeader: { type: Array, default() { return []; } },
  },
  data() {
    return {
      search: '',
    };
  },
  computed: {
    searchIndex: function() {
      const vm = this;
      if (vm.list && vm.list.length > 0) {
        const keys = [];
        const firstItem = vm.list[0];
        firstItem.name && keys.push(firstItem.name);
        firstItem.doctor && keys.push(firstItem.doctor.name);
        firstItem.expert && keys.push(firstItem.expert.name);
        firstItem.officialUser && keys.push(firstItem.officialUser.name);
        firstItem.organization && keys.push(firstItem.organization.name);
        firstItem.title && keys.push(firstItem.title);
        const fuse = new Fuse(vm.list, {
          keys
        });
        return fuse;
      }
    }
  },
  methods: {
    searchFilter(item) {
      let { search } = this;
      search = search && search.toLowerCase();
      const author = getAuthor(item);
      return !search
        || (item.title && item.title.toLowerCase().includes(search))
        || (item.name && item.name.toLowerCase().includes(search))
        || (author 
          && (author.name && author.name.toLowerCase().includes(search)
            || author.organization && author.organization.name && author.organization.name.toLowerCase().includes(search)))
        || (item.tags && item.tags.map((tag) => tag.name).toString().includes(search))
        || (item.organization && item.organization.name && item.organization.name.toLowerCase().includes(search));
    },
    filter(value, row, key) {
      return row[key] === value;
    },
    clearFilter() {
      this.$refs.table.clearFilter();
    },
    handleSizeChange(value) {
      this.$emit('handleSizeChange', value);
    },
    handleCurrentChange(value) {
      this.$emit('handleCurrentChange', value);
    },
  },
};
</script>

<style scoped>
.filter {
  display: flex;
  flex-direction: row;
}
.filter-container {
  margin-bottom: 15px;
  position: absolute;
  right: 0px;
}
.img {
  width: 48px;
  height: 48px;
}
</style>
