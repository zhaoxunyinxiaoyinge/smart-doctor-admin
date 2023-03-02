import { defineComponent, ref, reactive, DefineComponent } from "vue";
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
        icon?: string,
        role?: string[]
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

    const handleOpen = () => { console.log(345) };

    const handleClose = () => { console.log(345) };

    const rendDom = () => {
      return (
        <el-menu
          default-active={currentRoute}
          collapse={store.getCollapseValue}
          style={{ width: store.getCollapseValue ? 'auto' : '200px' }}
          open={handleOpen}
          close={handleClose}
          unique-opened={true}
          collapse-transition={true}
          router={true}
        >
          {getMenu(store.menuList as any)}
        </el-menu>
      );
    };

    return rendDom;
  },
});
