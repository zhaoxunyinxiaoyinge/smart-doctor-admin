<script setup lang="ts">
import Quill from 'quill';
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import { reactive, ref, onMounted } from "vue"
import * as Emoji from "quill-emoji";
import "quill-emoji/dist/quill-emoji.css";
import ImageUploader from "quill-image-uploader";
import { upload } from "@/api/index"

Quill.register("modules/imageUploader", ImageUploader);
Quill.register("modules/emoji", Emoji);

const props = withDefaults(defineProps<{ descrtion: string }>(), {
  descrtion: ""
})


const emits = defineEmits<{
  (e: "change", data: string)
}>();


let editer = ref<typeof Quill>(null);
let form = reactive<{ content: string, options: any }>({
  content: "",
  options: {
    theme: 'snow',
    boundary: document.querySelector('#editer'),
    options: {
      modules: {
        imageUploader: {
          upload: (file: string | Blob) => {
            const formData = new FormData();
            formData.append('file', file);
            return upload(formData).then(res => {
              return res.data
            })
          },
        },
        toolbar: [['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        [{ 'header': 1 }, { 'header': 2 }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'script': 'sub' }, { 'script': 'super' }],
        [{ 'indent': '-1' }, { 'indent': '+1' }],
        [{ 'direction': 'rtl' }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'font': [] }],
        [{ 'align': [] }],
        ['clean'],
        ['link', 'image', 'video'], ['emoji']],
        "emoji-toolbar": true,
        "emoji-textarea": false,
        "emoji-shortname": true,
      },
      placeholder: 'Insert text here ...',
      readOnly: false,
      scrollingContainer: '#editer'
    }
  }
})

const handleChange = (event: any) => {
  if (editer.value) {
    let content = editer.value.getContents();
    emits("change", content)
  }
}


const setEditor=(val)=>{
  editer.value.setContents(val)
}

defineExpose({
  qullEditor: editer,
  setEditor
})


</script>

<template>
  <div id="editer" class="editer">
    <quill-editor ref="editer" :content="props.descrtion"  class="quill" :modules="form.options.modules" content-type="html"
      :options="form.options.options" @text-change="handleChange" />
  </div>

</template>

<style scoped>
#editer {
  background: #fff;
  min-height: 450px;
}

:deep(.ql-container) {
  height: 450px !important;
}
</style>