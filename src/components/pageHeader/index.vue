<script lang="ts" setup>
import { withDefaults } from "vue";
import { useHeader } from "@/hooks/userHeader";
const loading = ref<boolean>(false)

const emits = defineEmits<{
  (e: 'add'): void
}>();

const props = withDefaults(defineProps<{ url: string, name: string, add: boolean, print: boolean, export: boolean }>(), {
  url: "",
  name: "",
  add: true,
  print: false,
  export: false
})

const handleAdd = () => {
  emits("add");
}

const printObj = reactive({
  id: "invoicMain",
  preview: true,
  previewTitle: 'print Title',
  popTitle: 'good print',
  extraCss: "https://cdn.bootcdn.net/ajax/libs/animate.css/4.1.1/animate.compat.css, https://cdn.bootcdn.net/ajax/libs/hover.css/2.3.1/css/hover-min.css",
  asyncUrl(reslove) {
    setTimeout(() => {
      reslove('/tick')
    }, 2000)
  },
})

const [handleImport] = useHeader({ name: props.name, url: props.url });


</script>
<template>
  <div class="page-header flex padding-left-10 justifly-betwwen">
    <el-button v-if="props.add" type="primary" @click="handleAdd">
      <el-icon>
        <Plus />
      </el-icon>新增
    </el-button>
    <div class="margin-right-20">
      <el-button v-if="props.print" v-print="printObj" type="primary">
        <el-icon>
          <Printer />
        </el-icon>打印
      </el-button>
      <el-button v-if="props.export" type="success"  :loading="loading" @click="handleImport">
        <el-icon>
          <Files />
        </el-icon>导出
      </el-button>
    </div>
  </div>
</template>