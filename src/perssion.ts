import router from "./router/index";
import NProgress from "nprogress"
import "nprogress/nprogress.css";
import { userstore } from "./store/expmle";
import {userInfo} from "./store/user";
import Cookies from "js-cookie";


const whileName: Array<string> = ['/login', '/404'];
/**
 * 获取状态对象
*/
router.beforeEach((to: any, from: any, next: any) => {
    const store = userstore();
    const user=userInfo();
    NProgress.start();
    const token = Cookies.get("token");
    if (token) {
        if (to.path == '/login') {
            next({ path: '/' })
        } else {
            // 这里需要根据token 获取用户请求
            if (store.menuList.length == 0) {
                let users = Cookies.get("userinfo");
                let info=users != undefined && JSON.parse(users);
                user.setUserInfo({name:info.userName,phone:info.phone,work:info.work});
                let id = users != undefined && JSON.parse(users).id;
                store.getMenuList(id).then((res) => {
                    store.routers.forEach(item => {
                        router.addRoute(item);
                    })
                    next({ path:to.path, replace: true })
                });

            } else {
                next();
            }
        }
    } else {
        const isWhite = whileName.includes(to.fullPath);
        if (isWhite) {
            next();
        } else {
            console.log("执行到这了")
            // let queryparams=to.query;
            console.log(to.query, 555)
            next({
                path: '/login',
                // query: {
                //     redirect: to.path,
                //     // ...queryparams
                // }
            })
        }
    }
})

router.afterEach((to, form, next) => {
    NProgress.done();
})