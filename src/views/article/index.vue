<template>
  <div class="app-container">
    <keep-alive>
      <list
        key="articleList"
        :list="list"
        :list-loading="listLoading"
        :page-sizes="pageSizes"
        :count="count"
        :list-body="listBody"
        :list-header="listHeader"
        :current-page="currentPage"
        :edit-page="'articleEdit'"
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"
      >

        <template v-slot:list="{}">
          <el-table-column align="center" label="作者类型" sortable>
            <template slot-scope="scope">
              <el-tag :type="scope.row.authorType === '医生' ? 'warning': 'info' ">{{ scope.row.authorType }}</el-tag>
            </template>
          </el-table-column>
        </template>

      </list>
    </keep-alive>
  </div>
</template>

<script>
import List from '@/components/List';
import articles from '../../graphql/articles.gql';
import { convertAuthorType, stripText, parseCoAuthors, getAuthor } from '../../utils/convert';
import { AUTHOR_TYPE, MEDIA_TYPE } from '../../constants/type';

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
        content: stripText(item.content),
        authorType: convertAuthorType(item.authorType),
        mediaType: MEDIA_TYPE[item.mediaType] ? MEDIA_TYPE[item.mediaType].label : '',
        author: getAuthor(item),
        coAuthors: parseCoAuthors(item.coAuthors),
      };
    },
    async fetchData() {
      this.listLoading = true;
      const skip = this.size * (this.currentPage - 1);
      const limit = this.size;
      const response = await this.$apollo.query({
        query: articles,
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
        this.list = response.data.articles;
        if (this.list.length === this.size) {
          this.count = this.size * this.currentPage + 1;
        } else {
          this.count = skip + this.list.length;
        }
        this.listBody = [
          {
            label: '标签', prop: 'tags', width: '200', type: 'TAG',
          }, { label: '作者', prop: 'author.name', width: '100' }, { label: '媒体类型', prop: 'mediaType' },
          { label: '视频', prop: 'video.url', width: '200' }, { label: '封面', prop: 'cover', type: 'IMAGE' },
          { label: '文章源', prop: 'src', width: '200' }, { label: '文章源类型', prop: 'srcType', width: '100' },
          { label: '内容', prop: 'content', width: '200' }, { label: '联合作者', prop: 'coAuthors' }, { label: '点赞总数', prop: 'thumbCount' }, { label: '分享总数', prop: 'shareCount' },
          { label: '浏览总数', prop: 'visitCount' }, { label: '回复总数', prop: 'commentCount' }, { label: '收藏总数', prop: 'collectCount' },
        ];
        this.list = this.list.map((v) => this.parse(v));
        this.listHeader = [
          { label: 'ID', prop: '_id' }, { label: '标题', prop: 'title' },
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
