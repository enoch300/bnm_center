// eslint-disable-next-line
import { UserLayout, BasicLayout, BlankLayout } from '@/layouts'

const RouteView = {
  name: 'RouteView',
  render: (h) => h('router-view'),
}

export const asyncRouterMap = [
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: 'menu.home' },
    redirect: '/dashboard',
    children: [
      // 仪表大盘
      {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('@/views/dashboard'),
        meta: { title: 'menu.dashboard-new', icon: 'dashboard' },
      },
      // 资产管理
      {
        path: '/assets',
        component: RouteView,
        redirect: '/assets/host',
        meta: { title: 'menu.assets', icon: 'credit-card' },
        children: [
          {
            // 主机管理
            path: '/assets/host',
            name: 'host',
            component: () => import('@/views/assets/Host'),
            meta: { title: 'menu.assets.host' },
          },
          {
            path: '/assets/database',
            component: RouteView,
            redirect: '/assets/database/Mysql',
            meta: { title: 'menu.assets.database' },
            children: [
              {
                // mysql管理
                path: '/assets/database/Mysql',
                name: 'Mysql',
                component: () => import('@/views/assets/database/Mysql'),
                meta: { title: 'menu.assets.database.mysql' },
              },
              // redis管理
              {
                path: '/assets/database/Redis',
                name: 'Redis',
                component: () => import('@/views/assets/database/Redis'),
                meta: { title: 'menu.assets.database.redis' },
              },
            ],
          },
        ],
      },
      // 带宽计费
      {
        path: '/billing',
        name: 'billing',
        component: () => import('@/views/billing'),
        meta: { title: 'menu.billing', icon: 'global' },
      },
      // 设备管理
      {
        path: '/device',
        name: 'device',
        component: () => import('@/views/device'),
        meta: { title: 'menu.device', icon: '' },
      },
      // 批量执行
      {
        path: '/batch',
        name: 'batch',
        component: () => import('@/views/batch'),
        meta: { title: 'menu.batch', icon: 'code' },
      },
      // 监控中心
      {
        path: '/monitoring',
        name: 'monitoring',
        component: () => import('@/views/device'),
        meta: { title: 'menu.monitoring', icon: 'fund' },
      },
      // 系统管理
      {
        path: '/system',
        name: 'system',
        component: RouteView,
        redirect: '/system/user',
        meta: { title: 'menu.system', icon: 'setting' },
        children: [
          {
            path: '/system/user',
            name: 'userManage',
            component: () => import('@/views/system/UserManage'),
            meta: { title: 'menu.system.user' },
          },
          {
            path: '/system/role',
            name: 'roleManage',
            component: () => import('@/views/system/RoleManage'),
            meta: { title: 'menu.system.role' },
          },
          {
            path: '/system/router',
            name: 'routerManage',
            component: () => import('@/views/system/RouterManage'),
            meta: { title: 'menu.system.router' },
          },
          {
            path: '/system/log',
            name: 'logManage',
            component: () => import('@/views/system/LogManage'),
            meta: { title: 'menu.system.log' },
          },
        ],
      },
    ],
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true,
  },
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login'),
      },
      {
        path: 'register',
        name: 'register',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Register'),
      },
      {
        path: 'register-result',
        name: 'registerResult',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/RegisterResult'),
      },
      {
        path: 'recover',
        name: 'recover',
        component: undefined,
      },
    ],
  },
  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404'),
  },
]
