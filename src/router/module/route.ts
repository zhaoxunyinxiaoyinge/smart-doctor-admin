
const containRoute: Array<any> = [
    {
        path: "/login",
        name: 'login',
        meta: {
            title: "用户登录",
            hidden: false,
        },
        component: () => import("@/login/index.vue"),
    },

    { path: '/:pathMatch(.*)*', component: () => import('@/views/notFound/notFound.vue') },

];


export default containRoute;
