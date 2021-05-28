<img src="https://user-images.githubusercontent.com/5424267/119736375-75dd1f00-be32-11eb-8012-ebece6238f7c.png" alt="Gugu logo" width="100" height="100" align="right" />


# 咕咕
> The [vue-admin-template](http://panjiachen.github.io/vue-admin-template)based CMS admin system for children myopia control community application.
>
> related projects - [WeChat Mini Program](https://github.com/zhangqi444/gugu-myopic-patients-community-wechat-miniprogram) | [backend](https://github.com/zhangqi444/gugu-myopic-patients-community-backend)
> 
> ‼️ **This project is better to be used as sample code for learning purpose, instead of an application in production.**

<p align="left">
  <img src="https://img.shields.io/badge/node-%3E%3D8.9.0-brightgreen"/>
  <img src="https://img.shields.io/badge/npm-%3E%3D3.0.0-brightgreen"/>
  <img src="https://img.shields.io/badge/vue-%3E%3D2.6.10-brightgreen"/>
  <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="Gugu is released under the MIT license." />
  <img src="https://img.shields.io/badge/maintained%3F-no-red.svg" alt="Gugu is not under maintained anymore." />
  <img src="https://img.shields.io/badge/ask%20me-anything-1abc9c.svg" alt="Ask Me Anything." />
</p>

<a href="https://github.com/zhangqi444/gugu-myopic-patients-community-cms-admin/" target="_blank">Doc</a>
|
<a href="https://github.com/zhangqi444/gugu-myopic-patients-community-cms-admin/blob/master/README-zh-CN.md" target="_blank">中文文档</a>


## Background

### What's myopic control in children？

Myopia (or nearsightedness) is very common. One out of two people (50%) have it. With myopia, the eye is longer than normal from front to back, or the cornea (the clear window at the front of the eye) is too steeply curved. This makes things that are far away from you look blurry. Myopia is corrected with glasses, contact lenses or surgery in some cases. Having myopia can increase your chances of having some eye problems later, like cataract, glaucoma and retinal detachment.

Studies show myopia is becoming more common among children. While there is no proven direct link, research suggests that children who spend more time indoors doing near-focused activities (such as computer work, video games, and reading) have higher rates of myopia than those who spend more time outdoors.

Doctors are looking at ways to slow the progression of myopia in children. While myopia cannot be reversed, the goal of treatment is to keep it from getting worse. This can protect a child’s eye health in the future, despite still needing to wear glasses or contact lenses.[1]

[1]. Myopia Control in Children. (2020). Retrieved 28 May 2021, from https://www.aao.org/eye-health/treatments/myopia-control-in-children

Please refer to [this](https://github.com/zhangqi444/gugu-myopic-patients-community-wechat-miniprogram) for more information.

## Tech stack

- [Vue](https://github.com/eggjs/egg) 
- [graphql](https://apollographql.com/)
- [ElementUI](https://element.eleme.io/)
- [fusejs](https://fusejs.io/)
- [eltiptap](https://github.com/Leecason/element-tiptap)
- [vue-image-crop-upload](https://github.com/dai-siki/vue-image-crop-upload)
- [dropzone](https://github.com/dropzone/dropzone)

## Get start

Please refer to [vue-admin-template](http://panjiachen.github.io/vue-admin-template) for the further guidance。

### Environment varibles
```shell
export ALIYUN_BUCKET='YOUR_ALIYUN_BUCKET' &&
export ALIYUN_ACCESS_KEY_SECRET='YOUR_ALIYUN_ACCESS_KEY_SECRET' &&
export ALIYUN_ACCESS_KEY_ID='YOUR_ALIYUN_ACCESS_KEY_ID' && 
export ALIYUN_REGION='YOUR_ALIYUN_REGION'
```

### Local development
```shell
# The admin portal connects to backend server through localhost by default.
# The backend server needs to be enabled at localhost first.
# This will automatically open http://localhost:9528.
npm install 
npm run dev
```

### Deployment

```bash
# build for test environment
npm run build:stage

# build for production environment
npm run build:prod
```

## Discussions

Please open an issue for any questions，and I will respond as soon as possible。

## Contributors

[@zhangqi444](https://github.com/zhangqi444), [@happyerqi](https://github.com/happyerqi)

## 📄 License

This project is MIT licensed.
