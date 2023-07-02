import { defineComponent, DefineComponent } from "vue";
import Sitem from "./sItem";
import { userstore } from "@/store/expmle"

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
    const getMenu = (list: Array<List>) => {
      return list.map((item: any) => {
        if (item.meta.hidden) {
            return <Sitem basePath={item.path} item={item} ></Sitem>;
          }
        return ""
      });
    };

    const handleOpen = () => { console.log(345) };

    const handleClose = () => { console.log(345) };

    const rendDom = () => {
      return (
        <el-menu
          default-active={store.currentRoute}
          mode='vertical'
          collapse={store.getCollapseValue}
          style={{ width: store.getCollapseValue ? '70px' : '245px' }}
          open={handleOpen}
          close={handleClose}
          collapse-transition={true}
          unique-opened={true}
          router={true}
        >
          {getMenu(store.menuList as any)}
        </el-menu>
      );
    };

    return rendDom;
  },
});
