import router from "./router/index";
import Cookies from "js-cookie";
import NProgress from "nprogress"
import "nprogress/nprogress.css";
import { userstore } from "./store/expmle";

const whileName: Array<string> = ['/login', '/404'];
/**
 * 获取状态对象
 */
router.beforeEach((to: any, from: any, next: any) => {
    const store = userstore();
    NProgress.start();
    let token = Cookies.get("token");
    if (token) {
        if (to.path == '/login') {
            next({path:'/'})
        } else {
            // 这里需要根据token 获取用户请求
            next();
        }
    } else {
        
        let isWhite = whileName.includes(to.fullPath);
        if (isWhite) {
            next();
        } else {
            console.log("执行到这了")
            let queryparams=to.query;
            console.log(to.query,555)
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