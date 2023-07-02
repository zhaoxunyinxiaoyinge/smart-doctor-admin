import { userstore } from "@/store/expmle";
import { Directive, DirectiveBinding } from "vue";
import Cookies from "js-cookie";

const persssion: Directive = {
    mounted(el: Element, binding: DirectiveBinding) {
        const { value } = binding;
        console.log(value)
        if (value && Array.isArray(value)) {
            const store = userstore();
            const perssonList = store.perssions;
            const userinfo = Cookies.get("userinfo") as string;
            const name = JSON.parse(userinfo).userName;
            const flag =name=='admin'|| value.some(item => perssonList.includes(item));
            if (!flag) {
                el.parentNode?.removeChild(el);
            }
        } else {
            throw new Error("请设置正常的的权限标志");
        }
    }
}

export {
    persssion
}