import { defineComponent, ref, DefineComponent } from "vue";
import Sitem from "./sItem";
import { userstore } from "@/store/expmle"
import Cookies from "js-cookie";

export default defineComponent({
  setup() {
    type List = {
      path: string,
      children?: Array<List>;
      meta: {
        title: string;
        hidden: boolean;
        icon?: string
      };
      component?: DefineComponent;
      redirect?: string;
    };

    const store = userstore();

    const currentRoute = ref(Cookies.get('current') || '/welcome');

    const getMenu = (list: Array<List>) => {
      return list.map((item: any) => {
        return <Sitem basePath={item.path} item={item} ></Sitem>;
      });
    };

    const rendDom = () => {
      return (
        <el-menu
          default-active={currentRoute}
          ellipsis
          mode='horizontal'
          router={true}
        >
          {getMenu(store.menuList as any)}
        </el-menu>
      );
    };
    return rendDom;
  },
});
