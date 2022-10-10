

import {
  createRouter,
  createWebHistory,
  RouteRecordRaw,
} from "vue-router";

const containRoute: Array<any> = [
  {
    path: "/",
    meta: {
      title: "主页",
      hidden: false,
    },
    component: () => import("@/layout/index.vue"),
    redirect: "/welcome",
    children: [
      {
        path: "/welcome",
        redirect: "",
        meta: {
          title: "首页",
          icon: "house-damage",
          hidden: false,
        },
        component:defineAsyncComponent(() => import("@/views/welcome/index.vue"))
      },
      {
        path: '/tabel',
        redirect: '',
        meta: {
          title: 'tabel的使用',
          icon: 'books',
          hidden: false
        },
        component:defineAsyncComponent(() => import("@/views/welcome/tabel.vue"))
      }, {
        name: 'editor',
        path: 'customelement',
        redirect: '',
        meta: {
          title: '富文本编辑器',
          icon: 'file-import',
          hidden: false,
        },
        component: () => import('@/views/welcome/customelement.vue')
      }, {

        path: '/icons',
        redirect: '',
        meta: {
          title: 'svg图标',
          icon: 'icon',
          hidden: false,
        },
        component: () => import('@/views/welcome/icon.vue')
      },
      {

        path: '/vgtabel',
        redirect: '',
        meta: {
          title: '无限表格',
          icon: 'bolt',
          hidden: false,
        },
        component: () => import('@/views/welcome/vtabel.vue')
      }
    ],
  },
  {
    path: "/modelInput",
    redirect: "/modelInput/index",
    meta: {
      title: "model组件使用",
      hidden: false
    },
    component: () => import("@/layout/index.vue"),
    children: [
      {
        path: 'index',
        redirect: '',
        meta: {
          title: "model组件",
          hidden: false,
          icon: 'books'
        },
        component: () => import("@/views/model/index.vue"),
      }
    ]

  },

  {
    path: "/stylems",
    meta: {
      title: '系统',
      hidden: false,
    },
    component: () => import("@/layout/index.vue"),
    redirect: "/stylems/index",
    children: [
      {
        path: 'index',
        redirect: '',
        meta: {
          title: "系统设置",
          hidden: false,
          icon: "align-center"
        },
        component: () => import("@/views/stylems/index.vue"),
      }
    ]
  },
  {
    path: '/repeat',
    redirect: '/repeat/index',
    meta: {
      title: '重复路由',
      hidden: false
    },
    component: () => import("@/layout/index.vue"),
    children: [
      {
        path: 'index',
        redirect: '',
        meta: {
          title: '重复路由参数',
          hidden: false,
          icon: "repeat"
        },
        component: () => import("../views/repeat/index.vue")
      }
    ]

  }
  ,
  {
    path: "/login",
    name: 'login',
    meta: {
      title: "用户登录",
      hidden: false,
    },
    component: () => import("../login/index.vue"),
  },

  { path: '/:pathMatch(.*)*', component: () => import('@/views/notFound/notFound.vue') },
];

const router = createRouter({
  history: createWebHistory(),
  routes: containRoute,
  scrollBehavior: function (to, from, savedPosition) {
    return { top: 0 };
  },
});
export default router;
