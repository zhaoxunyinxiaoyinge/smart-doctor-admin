import { defineComponent, ref, reactive, DefineComponent } from "vue";
import Sitem from "./sItem";
import { userstore } from "@/store/expmle"
import Cookies from "js-cookie";

export default defineComponent({
  props:{
    menuList:Array,
    default(){
      return []
    }
  },
  setup(props) {
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
        return <Sitem basePath={item.basePath} item={item} ></Sitem>;
      });
    };

    const handleOpen = () => { console.log(345)};

    const handleClose = () => {console.log(345) };

    const rendDom = () => {
      return (
        <el-menu
          default-active={currentRoute}
          mode='vertical'
          style={{ width: '180px' }}
          open={handleOpen}
          close={handleClose}
          collapse-transition={true}
          unique-opened={true}
          router={true}
        >
          {getMenu(props.menuList as any)}
        </el-menu>
      );
    };

    return rendDom;
  },
});



