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
                // userinfo 存在本地 cookie，可能残留或被改坏，解析失败时按未登录处理，避免守卫直接抛错卡死
                let info: any = null;
                try {
                    const users = Cookies.get("userinfo");
                    info = users ? JSON.parse(users) : null;
                } catch (e) {
                    console.warn("userinfo cookie 解析失败，按未登录处理", e);
                    info = null;
                }
                if (!info || !info.id) {
                    Cookies.set("token", "");
                    next({ path: '/login', replace: true });
                    return;
                }
                user.setUserInfo({name:info.userName,phone:info.phone,work:info.work,avatar:info.avatar,id:info.id});

                store.getMenuList(info.id).then(() => {

                    store.routers.forEach(item => {
                        router.addRoute(item);
                    })

                    console.log(router.getRoutes(),6666)

                    next({ path:to.path, replace: true })
                }).catch((err: any) => {
                    // 兜底：菜单接口失败或超时（axios timeout 5s）时不处理的话，
                    // next() 永远不会被调用，首页 loading 动画就会一直转下去。
                    // 这里清掉失效 token 并跳到登录页，保证守卫一定放行。
                    console.error("获取菜单失败，跳转登录页：", err);
                    Cookies.set("token", "");
                    next({ path: '/login', replace: true });
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

router.afterEach(() => {
    NProgress.done();
})