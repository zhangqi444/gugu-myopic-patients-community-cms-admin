<template>
  <div class="flex column">
    <div class="flex column">
      <div class="flex row">
        <el-form-item v-if="name !== undefined" label="名称/标题">
          <el-input class="name" :value="name" v-on:input="$emit('update:name', $event);" />
        </el-form-item>
        <el-form-item v-if="gender !== undefined" label="性别" prop="gender">
          <el-switch
            :value="!!gender"
            active-text="男"
            inactive-text="女"
            v-on:input="$emit('update:gender', $event ? 1 : 0);"
            />
        </el-form-item>
        <el-form-item v-if="birthYear !== undefined" label="出生年份">
          <el-date-picker
            :value="birthYear"
            type="date"
            placeholder="选择日期"
            v-on:input="$emit('update:birthYear', $event ? $event.getTime() : null);"
            />
        </el-form-item>
      </div>
      <el-form-item v-if="avatar !== undefined" class="flex center" label="头像">
        <div class="flex row center avatar">
          <el-switch
            v-model="isAvatarUploadMode"
            class="switch"
            active-text="上传"
            inactive-text="输入"
            />
          <oss-image-crop-uploader
            v-if="isAvatarUploadMode && crop"
            :img-data-url="avatar"
            @uploadSuccess="handleImageUploadSuccess"
            @uploadFail="handleImageUploadFail"
            />
          <oss-multiple-image-uploader
            v-if="isAvatarUploadMode && !crop"
            :isMultipleMode="false"
            :fileList="[{name: 'placeholder.png', url: avatar}]"
            @success="handleImageUploadSuccess"
            @error="handleImageUploadFail"
            />
          <el-input v-if="!isAvatarUploadMode" :value="avatar" placeholder="请输入图片链接" v-on:input="$emit('update:avatar', $event);" />
        </div>
      </el-form-item>
    </div>
    <div class="flex row">
      <el-form-item v-if="province !== undefined" label="省">
        <el-input class="province" :value="province" placeholder="省" v-on:input="$emit('update:province', $event);" />
      </el-form-item>
      <el-form-item v-if="city !== undefined" label="市">
        <el-input class="city" :value="city" placeholder="市" v-on:input="$emit('update:city', $event);" />
      </el-form-item>
      <el-form-item v-if="location !== undefined" label="地址">
        <el-input class="location" :value="location" placeholder="地址" v-on:input="$emit('update:location', $event);" />
      </el-form-item>
    </div>
    <div class="flex row">
      <el-form-item v-if="phone !== undefined" label="电话">
        <el-input :value="phone" placeholder="电话" v-on:input="$emit('update:phone', $event);" />
      </el-form-item>
      <el-form-item v-if="email !== undefined" label="邮箱">
        <el-input :value="email" placeholder="邮箱" v-on:input="$emit('update:email', $event);" />
      </el-form-item>
      <el-form-item v-if="website !== undefined" label="网址">
        <el-input :value="website" placeholder="网址" v-on:input="$emit('update:website', $event);" />
      </el-form-item>
    </div>
  </div>
</template>

<script>
import OSSImageCropUploader from '@/components/OSSImageCropUploader';
import OSSMultipleImageUploader from '@/components/OSSMultipleImageUploader';

export default {
  name: 'SocietyFormSection',
  components: {
    'oss-image-crop-uploader': OSSImageCropUploader,
    'oss-multiple-image-uploader': OSSMultipleImageUploader,
  },
  props: {
    name: { type: String, default: undefined },
    gender: { type: Number, default: undefined },
    birthYear: { type: Number, default: undefined },
    avatar: { type: String, default: undefined },
    province: { type: String, default: undefined },
    city: { type: String, default: undefined },
    phone: { type: String, default: undefined },
    email: { type: String, default: undefined },
    website: { type: String, default: undefined },
    location: { type: String, default: undefined },
    crop: { type: Boolean, default: true },
  },
  data() {
    return { isAvatarUploadMode: true };
  },
  methods: {
    handleImageUploadSuccess(result) {
      this.$message({ message: '图片上传成功！', type: 'info' });
      this.$emit('update:avatar', result.url);
    },
    handleImageUploadFail(e) {
      this.$message({ message: '图片上传失败！', type: 'error' });
    },
  },
};
</script>

<style scoped>
.flex {
  display: flex;
}
.row {
  flex-direction: row;
}
.column {
  flex-direction: column;
}
.center {
  align-items: center;
}
.switch {
  margin-right: 10px;
  width: 200px;
}
.avatar {
  margin-left: 0;
}
.name {
  width: 300px;
}
</style>
