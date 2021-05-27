<template>
  <div class="container">
    <el-form-item label="所属机构">
      <el-autocomplete
        v-model="organization.name"
        class="inline-input"
        :fetch-suggestions="filterOrganizations"
        value-key="name"
        placeholder="请输入"
        :trigger-on-focus="false"
        @select="handleSelect"
      />
    </el-form-item>
  </div>
</template>

<script>
import organizations from '../../graphql/organizationsShort.gql';

export default {
  name: 'OrganizationFormSection',
  props: {
    organization: { type: Object },
  },
  apollo: {
    organizations: {
      query: organizations,
      variables: {
        option: {
          skip: 0,
        },
        condition: {
          isDeleted: false,
          isBlocked: false,
        },
      },
    },
  },
  methods: {
    filterOrganizations(queryString, callback) {
      const results = this.organizations && this.organizations.filter((organization) => (queryString.length > 0) && organization.name.toLowerCase().includes(queryString.toLowerCase()));
      // call callback function to return suggestions
      callback(results);
    },
    handleSelect(item) {
      this.$emit('update:organization', { ...this.organization, _id: item._id });
    },
  },
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: row;
}
</style>
