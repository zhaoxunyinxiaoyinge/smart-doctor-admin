
import {
  defineComponent,
  reactive,
  DefineComponent,
  PropType,
} from "vue";
import SvgIcon from '@/components/icons/svg-icon.vue';
import { resolvePath } from "@/utils/resolvePath";

interface List {
  path: string,
  children: Array<List>;
  meta: {
    title: string;
    hidden: boolean;
    icon?: string
  };
  component: DefineComponent;
  redirect: string;
}

const SitemBar = defineComponent({
  name: "Sitem",
  components: {
    SvgIcon
  },

  props: {
    item: {
      type: Object as PropType<List>,
      required: true,
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    let onlyOneChild = reactive<any>([])

    const hasOnyChild = (children: Array<List> = [], parent: any) => {
      children = children ? children : [];
      const onlyChild = children.filter((item) => {
        if (item.meta.hidden) {
          return false;
        } else {
          onlyOneChild = item;
          return true;
        }
      });

      if (onlyChild.length == 1) {
        return true;
      }

      if (onlyChild.length == 0) {
        onlyOneChild = { ...parent, path: "", noShowingChildren: true };
        return true;
      }
      return false;
    };

    const resovlePath = (val: string) => {
      return resolvePath(props.basePath, val)
    }

    const slot = {
      title: () => {
        return <div>
          <span >{props.item.meta.title}</span>
        </div>
      }
    }

    const getSubMenu = () => {
      if (hasOnyChild(props.item.children, props.item) && (!onlyOneChild.children || onlyOneChild.noShowingChildren)) {
        return <el-menu-item  index={resovlePath(onlyOneChild.path)}>
                    <span>{onlyOneChild.meta.title}</span>
               </el-menu-item>
      }
       else {
        return <el-sub-menu v-slots={slot} index={resovlePath(props.item.path)}>
          {/* {
              props.item.children && props.item.children.map(sitem => {
              return <SitemBar basePath={resovlePath(sitem.path)} item={sitem}></SitemBar>
            })
          } */}
        </el-sub-menu>
      }

    }

    const rendDom = () => {
      return (
        <>
          {
            getSubMenu()
          }
        </>
      );
    };

    return rendDom;
  },
});

export default SitemBar;
