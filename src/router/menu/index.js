/**
 * @Description: 路由
 * @Author: LeeMiu
 * @date: 2019/11/15
 */

/* 公共模块 */
const Main = () => import('@/components/main.vue'); // 主页
const Login = () => import('@/components/login.vue'); // 登陆
const Home = () => import('@/components/home.vue'); // home页



const RouterMap = [
  {
    path: '/',
    component: Main,
  },
  {
    path: '/main',
    component: Main,
  },
  {
    path: '/home',
    component: Main,
    label: '首页',
    redirect: '/home/page',
    children: [{
      path: 'page',
      component: Home,
    }],
  },
  {
    path: '/login',
    component: Main,
    label: '产品',
    redirect: '/login/page',
    children: [{
      path: 'page',
      component: Login,
    }],
  },
];

export default RouterMap;
