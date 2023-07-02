
import {
  defineComponent,
  reactive,
  DefineComponent,
  PropType,
} from "vue";
import { userstore } from "@/store/expmle";
import SvgIcon from '@/components/icons/svg-icon.vue';
import path from "path";
import { isOutLink } from "@/utils/common"

interface List {
  path: string,
  children?: Array<List>;
  meta: {
    title: string;
    hidden: boolean;
    icon?: string
  };
  component: DefineComponent;
  redirect: string;
}

const SitemBar = defineComponent({
  components: {
    SvgIcon
  },
  name: "sitem",

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
    const linkProps = (to: any) => {
      if (isOutLink(to.path)) {
        return {
          href: to.path,
          target: "_self",
          rel: "friend"
        }
      }
      return {
        to: to.path
      }
    }
    const store = userstore();

    const hasOnyChild = (children: Array<List> = [], parent: any) => {
      children = children ? children : [];
      // 获取当前菜单下的路由是否需要显示
      const onlyChild = children.filter((item) => {
        if (item.meta.hidden) {
          return false;
        } else {
          onlyOneChild = item;
          return true;
        }
      });

      // 当显示的路由子菜单只有一个时的情况
      if (onlyChild.length == 1) {
        onlyOneChild.path = path.resolve(props.basePath, onlyOneChild.path)
        return true;
      }

      // 当前显示的路由子菜单不存在的时候
      if (onlyChild.length == 0) {
        onlyOneChild = { ...parent, noShowingChildren: true };
        return true;
      }

      // 当前菜单下有多个路由子菜单
      return false;
    };

    const resovlePath = (val: string) => {
      return path.resolve(props.basePath, val)
    }

    const slot = {
      title: () => {
        return <div style={{ display: 'flex', alignItems: 'center' }}>
          <svg-icon names={props.item.meta?.icon} class='icons'></svg-icon>
          <span style={{ marginLeft: store.isCollapse ? '0px' : 'auto', width: store.isCollapse ? '0px' : 'auto', display: store.isCollapse ? 'none' : 'inline-block', }}>{props.item.meta.title}</span>
        </div>
      }
    }

    const menuSolt = {
      title: () => {
        return <div>{isOutLink(onlyOneChild.path) ? <a{...linkProps(onlyOneChild)}  > <span>{onlyOneChild.meta.title}</span></a> : <span style="color:#bdbdc0">{onlyOneChild.meta.title}</span>}</div>
      }
    }

    const getSubMenu = () => {
      // 当前菜单路由下只有一个子菜单或者没有子菜单
      if (hasOnyChild(props.item.children, props.item) && (!onlyOneChild.children || onlyOneChild.noShowingChildren)) {
        return <el-menu-item v-slots={menuSolt} index={resovlePath(onlyOneChild.path)}>
          <svg-icon names={onlyOneChild.meta?.icon} class='icons other'></svg-icon>
        </el-menu-item>
      } else {
        return <el-sub-menu v-slots={slot} index={resovlePath(props.item.path)}>
          {
            props.item.children && props.item.children.map(sitem => {
              if (!sitem.meta.hidden) {
                return <SitemBar basePath={resovlePath(sitem.path)} item={sitem}></SitemBar>
              }
              return null;

            })
          }
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
