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
        hidden: Boolean;
        icon?: string
      };
      component: DefineComponent;
      redirect: string;
    };

    let store = userstore();

    let currentRoute = ref(Cookies.get('current') || '/welcome');

    let routes = reactive<Array<List>>([
      {
        path: "/",
        meta: {
          title: "首页",
          hidden: false,
          icon: "home-lg"
        },

        redirect: "/welcome",
        children: [
          {
            path: "/welcome",
            redirect: "",
            meta: {
              title: "数据可视化面板",
              icon: "caidan",
              hidden: false,
            },

          },
          {
            path: "/other",
            redirect: "",
            meta: {
              title: "404页面",
              icon: "caidan",
              hidden: false,
            },
          },
          {
            path: '/tabel',
            redirect: '',
            meta: {
              title: 'tabel多列表格',
              icon: 'caidan',
              hidden: false
            },

          },

          {
            path: '/customelement',
            redirect: '',
            meta: {
              title: '富文本编辑器',
              icon: 'caidan',
              hidden: false
            },
          },
          {
            path: 'icons',
            redirect: '',
            meta: {
              title: 'svg图标',
              icon: 'caidan',
              hidden: false,
            },

          },
          {

            path: '/vgtabel',
            redirect: '',
            meta: {
              title: '无限表格',
              icon: 'caidan',
              hidden: false,
            },

          }
        ],
      },

      {
        path: '/repeat',
        redirect: '/repeat/index',
        meta: {
          title: '骨架屏',
          hidden: false
        },

        children: [
          {
            path: 'index',
            redirect: '',
            meta: {
              title: '骨架屏',
              hidden: false,
              icon: "books"
            },

          }
        ]
      },
      {
        path: "/modelInput",
        redirect: "/modelInput/index",
        meta: {
          title: "",
          hidden: false
        },
        children: [
          {
            path: 'index',
            redirect: '',
            meta: {
              title: "model组件",
              hidden: false,
              icon: 'books'
            }
          }
        ]

      },

      {
        path: "/stylems",
        meta: {
          title: '系统设置',
          hidden: false
        },

        redirect: "/stylems/index",
        children: [
          {
            path: 'index',
            meta: {
              title: "个人中心",
              hidden: false,
              icon: "syssetting"
            }
          }
        ]
      }

    ]);

    const getMenu = (list: Array<List>) => {
      return list.map((item: any) => {
        return <Sitem basePath={item.path} item={item} ></Sitem>;
      });
    };

    const handleOpen = () => { };

    const handleClose = () => { };

    const rendDom = () => {
      return (
        <el-menu
          default-active={currentRoute}
          collapse={store.getCollapseValue}
          style={{ width: store.getCollapseValue ? 'auto' : '200px' }}
          open={handleOpen}
          close={handleClose}
          collapse-transition={true}
          router={true}
        >
          {getMenu(routes as any)}
        </el-menu>
      );
    };

    return rendDom;
  },
});
