/*
 * @Author: LeeMiu
 * @Date: 2019-11-15
 * @Last Modified by:
 * @Last Modified time:
 */
import Vue from 'vue';
import { LoadingBar } from 'iview';
import Router from 'vue-router';
import RouterMap from './menu/index';

Vue.use(Router);

const VueRouter = new Router({
  // base: process.env.BASE_URL,
  routes: RouterMap,
});

//  全局路由守卫
VueRouter.beforeEach((to, from, next) => {
  LoadingBar.start();
  next();
});

//
VueRouter.afterEach(() => {
  LoadingBar.finish();
});

// Loading chunk {n} failed (懒加载) 错误处理
VueRouter.onError((error) => {
  const pattern = /Loading chunk (\d)+ failed/g;
  const isChunkLoadFailed = error.message.match(pattern);
  const targetPath = VueRouter.history.pending.fullPath;
  if (isChunkLoadFailed) {
    VueRouter.replace(targetPath);
  }
});

export default VueRouter;
