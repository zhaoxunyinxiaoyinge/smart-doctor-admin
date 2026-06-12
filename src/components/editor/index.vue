<template>
  <div
    id="editor—wrapper"
    class="wrap"
  >
    <Toolbar
      style="border-bottom: 1px solid #ccc"
      :editor="editorRef"
      :default-config="toolbarConfig"
      :mode="'default'"
    />
    <Editor
      v-model="valueHtml"
      style="height: 500px; overflow-y: hidden;"
      :default-config="editorConfig"
      :mode="mode"
      @onCreated="handleCreated"
      @onDestroyed="handleDestroyed"
      @onChange="handleChange"
      @onBlur="hangleBur"
      @customPaste="customPaste"
    />
  </div>
</template>

<script lang="ts" setup>
import '@wangeditor/editor/dist/css/style.css'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import { SlateElement, IToolbarConfig, IEditorConfig, IDomEditor } from '@wangeditor/editor';
import { customCheckLinkFns } from "./index"
import Cookies from 'js-cookie';

const editorRef = shallowRef();

type ImageElement = SlateElement & {
  src: string
  alt: string
  url: string
  href: string
}

type RestFun = () => ({});


const emits = defineEmits<{
  (e: "currentVal", val: string): void
}>();


const props = withDefaults(defineProps<{
  rest: RestFun
}>(), {
  rest: () => ({})
})

const toolbarConfig: Partial<IToolbarConfig> = reactive({
  toolbarKeys: [
    'headerSelect',
    "|",
    'bold', 'italic',
    'fontSize',
    {
      key: 'group-more-style', // 必填，要以 group 开头
      title: '更多样式', // 必填
      iconSvg: '<svg>....</svg>', // 可选
      menuKeys: ["through", "code", "clearStyle"] // 下级菜单 key ，必填
    },
    "uploadImage",
    "color",
    "fontFamily",
    "lineHeight",
    "emotion",
    "insertLink",
    "insertImage",
    "editImage",
    "codeSelectLang"
  ],
});


// 获取当前编辑器的默认配置
const editorConfig: Partial<IEditorConfig> = reactive({
  "MENU_CONF": {
    uploadImage: {
      title: '图片上传',
      server: '/api/common/upload',
      fieldName: 'file',
      headers: {
        Authorization: Cookies.get("token")
      },
      metaWithUrl: false,
      onSuccess() {
        console.log("图片上传成功")
      },
      onFailed(file: File, res: any) {
        console.log("上传文件失败")
      },
    },
    fontSize: {
      fontSizeList: [
        '12px',
        "14px",
        '16px',
        "18px",
        "20px"

      ]
    },
    fontFamily: {
      fontFamilyList: [
        '黑体',
        '楷体',
        { name: '仿宋', value: '仿宋' },
        'Arial',
        'Tahoma',
        'Verdana'
      ]
    },
    lineHeight: {
      lineHeightList: ['1', '1.5', '2', '2.5']
    },
    emotin: {
      emotions: '😀 😃 😄 😁 😆 😅 😂 🤣 😊 😇 🙂 🙃 😉'.split(' ')
    },
    insertLink: {
      checkLink: customCheckLinkFns,
    },
    insertImage: {
      onInsertedImage(imageNode: ImageElement | null) {
        if (imageNode == null) { return }
        const { src, alt, url, href } = imageNode
        console.log('inserted image', src, alt, url, href);
      }
    },
    editImage(imageNode: ImageElement | null) {
      console.log("这里时图片编辑时候触发");
    },
    codeSelectLang: {
      codeLangs: [
        { text: 'CSS', value: 'css' },
        { text: 'HTML', value: 'html' },
        { text: 'XML', value: 'xml' },
        // 其他
      ]
    }
  }
});

editorConfig.placeholder = '请输入内容...';
editorConfig.autoFocus = false;
editorConfig.maxLength = 1000;
editorConfig.onMaxLength = function (editor: IDomEditor) {
  console.log("这里触发了富文本编辑器的内容最大字符容量")
}


editorConfig.hoverbarKeys = {
  'link': {
    // 重写 link 元素的 hoverbar
    menuKeys: ['editLink', 'unLink', 'viewLink'],
  },
  'image': {
    // 清空 image 元素的 hoverbar
    menuKeys: [],
  }
}

const mode = ref("default")

const valueHtml = ref<string>("");

// 创建编辑器
const handleCreated = (val: SlateElement) => {
  editorRef.value = val;
}

const handleChange = (editor: IDomEditor) => {
  let htmls = editor.getHtml();
  emits('currentVal', htmls);

}

const hangleBur = (editor: IDomEditor) => {
  let htmls = editor.getHtml();
  emits('currentVal', htmls);
}

const customPaste = (editor: IDomEditor, event: ClipboardEvent, callback: any) => {
  console.log("复制文本和图片到这里")
}

//销毁编辑器
const handleDestroyed = (editor: IDomEditor) => {
  console.log('destroyed');
  editor.destroy()
}

</script>

<style scoped lang="scss">
.wrap {
  text-align: left;
}

#editor—wrapper {
  border: 1px solid #ccc;
  z-index: 100;
  /* 按需定义 */
}

#toolbar-container {
  border-bottom: 1px solid #ccc;
}

#editor-container {
  height: 500px;
}
</style>