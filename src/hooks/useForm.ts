import { UploadFile } from "element-plus";
import type { success } from "@/components/upload/index";

interface prop {
  inline: boolean,
  formField: Array<{ type: string, name: string, placeholder?: string, width?: number, label: string, options?: Array<{ label: string | number, value: number | string }> }>
}

const useForm=()=>{
  const formData = reactive<{ [key: string]: any }>({});
  const show = ref<boolean>(false);  
  const fileList = reactive<UploadFile | any>([]);

  const props = withDefaults(defineProps<prop>(), {
    inline: false,
    formField: () => []
  })

  const emits = defineEmits<{
    (e: 'search', formData: object): void,
    (e: 'refsh'): void
  }>();

  const handleSuccess = (val: success) => {
    fileList.length = 0;
    const index: number = val.data.lastIndexOf(".");
    fileList.push({
      name: val.data.slice(index + 1,),
      url: val.data
    });
  }

  const handleSearch = () => {
    emits('search', formData);
  }

  const handleRefrsh = () => {
    props.formField.forEach(item => {
      formData[item.name] = "";
    })
    emits('refsh');
  }

  const toggle = () => {
    show.value = !show.value
  }
  
  defineExpose({
    formData
  })
  
  return {
    formData,
    handleSuccess,
    handleSearch,
    handleRefrsh,
    toggle,

    props,
    show
  }
}

export {
  useForm
}