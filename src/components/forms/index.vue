<template>
  <div class="padding-20 form-list flex">
    <el-form :inline="props.inline" :model="formData" class="flex-1 form-item">
      <template :key="index" v-for="(item, index) in props.formField">
        <el-form-item v-if="item.type == 'input'">
          <span :style="{ width: item.width + 'px', textAlign: 'center' }">
            <slot name="label">{{ item.label }}</slot>
          </span>
          <el-input type="text" v-model="formData[item.name]" class="input" clearable></el-input>
        </el-form-item>

        <el-form-item v-else-if="item.type == 'select'">
          <span :style="{ width: item.width + 'px', textAlign: 'center' }">
            <slot name="label">{{ item.label }}</slot>
          </span>
          <el-select class="input" v-model="formData[item.name]" clearable :placeholder="item.placeholder">
            <el-option :key="sIndex" v-for="(sItem, sIndex) in item.options" :label="sItem.label"
              :value="sItem?.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-else-if="item.type == 'checkbox'">
          <span :style="{ width: item.width + 'px', textAlign: 'center' }">
            <slot name="label">{{ item.label }}</slot>
          </span>
          <el-checkbox-group v-model="formData[item.name]">
            <el-checkbox :key="sIndex" v-for="(sItem, sIndex) in item.options" :label="sItem.label" />
          </el-checkbox-group>
        </el-form-item>

        <el-form-item v-else-if="item.type == 'radio'">
          <span :style="{ width: item.width + 'px', textAlign: 'center' }">
            <slot name="label">{{ item.label }}</slot>
          </span>
          <el-radio-group>
            <el-radio :label="sItem.label" :key="sIndex" v-for="(sItem, sIndex) in item.options">{{ sItem.label
            }}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item v-else-if="item.type == 'dateRange'">
          <span :style="{ width: item.width + 'px', textAlign: 'center' }">
            <slot name="label">{{ item.label }}</slot>
          </span>
          <el-date-picker type="datetimerange" class="input" clearable v-model="formData[item.name]" />
        </el-form-item>

        <el-form-item v-else-if="item.type == 'upload'">
          <span :style="{ width: item.width + 'px', textAlign: 'center', display: 'inline-block' }">
            <slot name="label">
              {{
                item.label }}</slot>
          </span>
          <Upload :file-list="formData[item.name]" @success="handleSuccess"></Upload>
        </el-form-item>
      </template>

      <el-form-item>
        <slot name="tree"></slot>
      </el-form-item>
    </el-form>
    <div v-if="props.inline" class="opeartion-btn">
      <el-button type="primary" @click="handleSearch" :icon="Search">搜索</el-button>
      <el-button type="default" :icon="Refresh" @click="handleRefrsh">重置</el-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { Search, Refresh } from "@element-plus/icons-vue";
import Upload from "@/components/upload/index.vue";
import { UploadFile } from "element-plus";
import type { success } from "@/components/upload/index";
import { defineEmits, withDefaults, defineExpose } from "vue";

interface prop {
  inline: boolean,
  formField: Array<{ type: string, name: string, placeholder?: string, width?: number, label: String, options?: Array<{ label: string | number, value: number | string }> }>
}

const fileList = reactive<UploadFile | any>([])

const props = withDefaults(defineProps<prop>(), {
  inline: false,
  formField: () => []
})

const emits = defineEmits<{
  (e: 'search', formData: object): void,
  (e: 'refsh'): void
}>();

const formData = reactive<{ [key: string]: any }>({
})

const handleSuccess = (val: success) => {
  fileList.length = 0;
  let index: number = val.data.lastIndexOf(".");
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

defineExpose({
  formData
})

</script>
<style lang="scss" scoped>
.form-list {
  text-align: left;
  padding: 20px;
  background-color: #fff;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.opeartion-btn {
  display: flex;
  justify-content: flex-end;
  width: 200px;
}


.input {
  width: 300px;

  .el-date-editor {
    width: inherit;
  }
}
</style>
