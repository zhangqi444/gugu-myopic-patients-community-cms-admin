import Vue from 'vue';
import Router from 'vue-router';

/* Layout */
import Layout from '@/layout';

Vue.use(Router);

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true,
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true,
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '控制台', icon: 'dashboard' },
    }],
  },

  {
    path: '/function',
    component: Layout,
    redirect: '/function',
    name: 'Function',
    meta: { title: '功能', icon: 'function' },
    children: [
      {
        path: 'all-list',
        name: 'AllFunctions',
        component: () => import('@/views/function/index'),
        meta: { title: '全部', icon: 'all' },
      },
      {
        path: 'edit',
        name: 'functionEdit',
        component: () => import('@/views/function/edit'),
        meta: { title: '创建', icon: 'edit' },
      },
    ],
  },

  {
    path: '/organization',
    component: Layout,
    redirect: '/organization',
    name: 'Organization',
    meta: { title: '机构', icon: 'organization' },
    children: [
      {
        path: 'all-list',
        name: 'AllOrganizations',
        component: () => import('@/views/organization/index'),
        meta: { title: '全部', icon: 'all' },
      },
      {
        path: 'edit',
        name: 'organizationEdit',
        component: () => import('@/views/organization/edit'),
        meta: { title: '创建', icon: 'edit' },
      },
    ],
  },

  {
    path: '/doctor',
    component: Layout,
    redirect: '/doctor',
    name: 'Doctor',
    meta: { title: '医生', icon: 'doctor' },
    children: [
      {
        path: 'all-list',
        name: 'AllDoctors',
        component: () => import('@/views/doctor/index'),
        meta: { title: '全部', icon: 'all' },
      },
      {
        path: 'edit',
        name: 'doctorEdit',
        component: () => import('@/views/doctor/edit'),
        meta: { title: '创建', icon: 'edit' },
      },
    ],
  },

  {
    path: '/expert',
    component: Layout,
    redirect: '/expert',
    name: 'Expert',
    meta: { title: '专家', icon: 'expert' },
    children: [
      {
        path: 'all-list',
        name: 'AllExperts',
        component: () => import('@/views/expert/index'),
        meta: { title: '全部', icon: 'all' },
      },
      {
        path: 'edit',
        name: 'expertEdit',
        component: () => import('@/views/expert/edit'),
        meta: { title: '创建', icon: 'edit' },
      },
    ],
  },

  {
    path: '/officialUser',
    component: Layout,
    redirect: '/officialUser',
    name: 'OfficialUser',
    meta: { title: '官方账号', icon: 'officialUser' },
    children: [
      {
        path: 'all-list',
        name: 'AllOfficialUser',
        component: () => import('@/views/officialUser/index'),
        meta: { title: '全部', icon: 'all' },
      },
      {
        path: 'edit',
        name: 'officialUserEdit',
        component: () => import('@/views/officialUser/edit'),
        meta: { title: '创建', icon: 'edit' },
      },
    ],
  },

  {
    path: '/article',
    component: Layout,
    redirect: '/article',
    name: 'Article',
    meta: { title: '文章', icon: 'article' },
    children: [
      {
        path: 'all-list',
        name: 'AllArticles',
        component: () => import('@/views/article/index'),
        meta: { title: '全部', icon: 'all' },
      },
      {
        path: 'edit',
        name: 'articleEdit',
        component: () => import('@/views/article/edit'),
        meta: { title: '创建', icon: 'edit' },
      },
    ],
  },
  {
    path: '/tag',
    component: Layout,
    redirect: '/tag',
    name: 'Tag',
    meta: { title: '标签', icon: 'tag' },
    children: [
      {
        path: 'all-list',
        name: 'AllTags',
        component: () => import('@/views/tag/index'),
        meta: { title: '全部', icon: 'all' },
      },
      {
        path: 'edit',
        name: 'tagEdit',
        component: () => import('@/views/tag/edit'),
        meta: { title: '创建', icon: 'edit' },
      },
    ],
  },

  {
    path: '/image',
    component: Layout,
    redirect: '/image',
    name: 'Image',
    meta: { title: '图片', icon: 'image' },
    children: [
      {
        path: 'all-list',
        name: 'AllImages',
        component: () => import('@/views/image/index'),
        meta: { title: '全部', icon: 'all' },
      },
      {
        path: 'add',
        name: 'imageAdd',
        component: () => import('@/views/image/add'),
        meta: { title: '创建', icon: 'add' },
      },
    ],
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true },
];

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes,
});

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
