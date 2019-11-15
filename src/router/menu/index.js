/**
 * @Description: 路由
 * @Author: LeeMiu
 * @date: 2019/11/15
 */

/* 公共模块 */
const Login = () => import('@/components/login.vue'); // 登陆
const Main = () => import('@/components/main.vue'); // 中间页
const Home = () => import('@/components/home.vue'); // 主页



const RouterMap = [
  {
    path: '/',
    component: Login,
  },
  {
    path: '/login',
    component: Login,
  },
  {
    path: '/main',
    component: Main,
  },
  {
    path: '/home',
    component: Main,
    label: '首页',
    children: [{
      path: '',
      component: Home,
    }],
  },
];

export default RouterMap;
