import router from './router';
import store from './store';
import { Message } from 'element-ui';
import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css'; // progress bar style
import getPageTitle from '@/utils/get-page-title';

NProgress.configure({ showSpinner: false }); // NProgress Configuration

const whiteList = ['/login']; // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start();

  // set page title
  document.title = getPageTitle(to.meta.title);

  // determine whether the user has logged in
  let { userInfo } = store.getters;
  let hasToken = false;
  if (userInfo && userInfo.nickname && userInfo.avatar) {
    hasToken = true;
  } else {
    // check if it is able to get userinfo by token
    try {
      userInfo = await store.dispatch('user/getInfo');
      hasToken = true;
    } catch (e) {
      console.log(`Try to fetch user info by token: ${e}`);
      hasToken = false;
    }
  }
  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' });
      NProgress.done();
    } else {
      userInfo = store.getters.userInfo;
      if (userInfo && userInfo.nickname && userInfo.avatar) {
        next();
      } else {
        try {
          // get user info
          await store.dispatch('user/getInfo');
          next();
        } catch (error) {
          console.log(error);

          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken');
          Message.error(error || 'Has Error');
          next(`/login?redirect=${to.path}`);
          NProgress.done();
        }
      }
    }
  } else {
    /* has no token */

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next();
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`);
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  // finish progress bar
  NProgress.done();
});
