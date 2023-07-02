<script setup lang="ts" >
import DefineForm from "./../../../components/forms/index.vue";

const props = withDefaults(defineProps<{ dialogVisible: boolean, title: string, editConfig: { label: string, name: string | number, type: string }[], editData: { [key: string]: any } }>(), {
  dialogVisible: false,
  title: "新增",
  editConfig: () => ([]),
  editData: () => ({})
});

const emits = defineEmits<{
  (e: "close", dialogVisible: boolean): void
  (e: "confirm", dialogVisible: boolean): void
}>()

const form = ref<typeof DefineForm | null>(null);

const handleClose = () => {
  let name = getImageName();
  (form.value as typeof DefineForm).formData[name] = '';
  (form.value as typeof DefineForm).resetFiled();
  emits("close", false);
}

const handleConfirm = () => {
  emits("confirm", (form.value as typeof DefineForm).formData);
  let name = getImageName();
  (form.value as typeof DefineForm).formData[name] = '';
  (form.value as typeof DefineForm).resetFiled();
}

const resetFiledFile = (val) => {
  if (!val) { return }
  (form.value as typeof DefineForm).fileList.splice(0, 1);
  let index: number = val.lastIndexOf(".");
  let prevIndex: number = val.lastIndexOf("/");
  (form.value as typeof DefineForm).fileList.push({
    name: val.slice(prevIndex + 1, index),
    url: val,
  });
}

const getImageName = () => {
  let name: string | number = "";
  for (let item of props.editConfig) {
    if (item.type == 'upload') {
      name = item.name;
      break;
    }
  }
  return name;
}

watchEffect(() => {
  if (props.dialogVisible && props.title === '编辑') {
    let arr = Object.keys(props.editData);
    if (form.value) {
      arr.forEach(element => {
        (form.value as typeof DefineForm).formData[element] = props.editData[element];
      });
      let name = getImageName();
      resetFiledFile(props.editData[name]);
    }
  }
})

</script>

<template>
  <div>
    <el-dialog :model-value="props.dialogVisible" :title="title" width="50%" :before-close="handleClose">
      <DefineForm ref="form" v-if="props.dialogVisible" :form-field="props.editConfig" />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">Cancel</el-button>
          <el-button type="primary"
                     @click="handleConfirm">
            Confirm
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>