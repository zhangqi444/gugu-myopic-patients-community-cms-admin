<img src="https://user-images.githubusercontent.com/5424267/119736375-75dd1f00-be32-11eb-8012-ebece6238f7c.png" alt="Gugu logo" width="100" height="100" align="right" />


# 咕咕
> 儿童青少年近视防控患者社区——基于[vue-admin-template](http://panjiachen.github.io/vue-admin-template)的CMS管理系统
>
> 相关项目 - [微信小程序](https://github.com/zhangqi444/gugu-myopic-patients-community-wechat-miniprogram) | [服务器](https://github.com/zhangqi444/gugu-myopic-patients-community-backend)
> 
> ‼️ **请尽量将本仓库作为示例代码参考，而不是将其用于生产环境**

<p align="left">
  <img src="https://img.shields.io/badge/node-%3E%3D8.9.0-brightgreen"/>
  <img src="https://img.shields.io/badge/npm-%3E%3D3.0.0-brightgreen"/>
  <img src="https://img.shields.io/badge/vue-%3E%3D2.6.10-brightgreen"/>
  <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="Gugu is released under the MIT license." />
  <img src="https://img.shields.io/badge/maintained%3F-no-red.svg" alt="Gugu is not under maintained anymore." />
  <img src="https://img.shields.io/badge/ask%20me-anything-1abc9c.svg" alt="Ask Me Anything." />
</p>

<a href="https://github.com/zhangqi444/gugu-myopic-patients-community-cms-admin/blob/master/README-zh-CN.md" target="_blank">文档</a>
|
<a href="https://github.com/zhangqi444/gugu-myopic-patients-community-cms-admin/" target="_blank">Doc</a>

## 背景
儿童青少年是祖国的未来和民族的希望。近年来，由于中小学生课内外负担加重，手机、电脑等带电子屏幕产品（以下简称电子产品）的普及，用眼过度、用眼不卫生、缺乏体育锻炼和户外活动等因素，中国儿童青少年近视率居高不下、不断攀升，近视低龄化、重度化日益严重，已成为一个关系国家和民族未来的大问题。

“儿童青少年近视防控”指在政府、学校、医疗卫生机构、家庭、学生等各方面共同努力下，针对儿童青少年，完善眼健康定期筛查制度、建立视力健康档案，培养健康用眼行为、建设视觉友好环境，并对已经近视者采取科学诊疗与矫治。

更多信息请参考[这里](https://github.com/zhangqi444/gugu-myopic-patients-community-wechat-miniprogram)。

## 技术栈

- [Vue](https://github.com/eggjs/egg) 
- [graphql](https://apollographql.com/)
- [ElementUI](https://element.eleme.io/)
- [fusejs](https://fusejs.io/)
- [eltiptap](https://github.com/Leecason/element-tiptap)
- [vue-image-crop-upload](https://github.com/dai-siki/vue-image-crop-upload)
- [dropzone](https://github.com/dropzone/dropzone)

## installation

更多配置与启动方案请参考[vue-admin-template](http://panjiachen.github.io/vue-admin-template)项目中的指引。

### 环境变量
```shell
export ALIYUN_BUCKET='YOUR_ALIYUN_BUCKET' &&
export ALIYUN_ACCESS_KEY_SECRET='YOUR_ALIYUN_ACCESS_KEY_SECRET' &&
export ALIYUN_ACCESS_KEY_ID='YOUR_ALIYUN_ACCESS_KEY_ID' && 
export ALIYUN_REGION='YOUR_ALIYUN_REGION'
```

### 本地测试
管理后台默认与本地后端服务器通信，因此需要先在本地启动咕咕后端服务器。
```shell
# This will automatically open http://localhost:9528

npm install 
npm run dev
```

### 部署

```bash
# build for test environment
npm run build:stage

# build for production environment
npm run build:prod
```

## 讨论

如您有任何问题，欢迎在项目中提交issue，我会在第一时间给与回复。

## 贡献者

[@zhangqi444](https://github.com/zhangqi444), [@happyerqi](https://github.com/happyerqi)

## 📄 协议

该项目基于MIT License开源。
