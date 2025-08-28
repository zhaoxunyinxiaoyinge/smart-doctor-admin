<template>
  <div class="padding-20 form-list flex margin-bottom-10">
    <el-form
      ref="form"
      :inline="props.inline"
      :rules="props.formRule"
      :model="formData"
      class="flex-1 form-item"
    >
      <template
        v-for="(item, index) in props.formField"
        :key="index"
      >
        <div
          v-show="show || index <= 1 || !props.inline"
          style="display: inline-block;"
        >
          <el-form-item
            v-if="item.type == 'input'"
            :prop="item.name"
          >
            <span :style="{ width: item.width + 'px', textAlign: 'center' }">
              <slot name="label">{{ item.label }}</slot>
            </span>
            <el-input
              v-model="formData[item.name]"
              type="text"
              class="input"
              clearable
            />
          </el-form-item>
          <el-form-item
            v-if="item.type == 'input-number'"
            :prop="item.name"
          >
            <span :style="{ width: item.width + 'px', textAlign: 'center' }">
              <slot name="label">{{ item.label }}</slot>
            </span>
            <el-input
              v-model="formData[item.name]"
              type="number"
              class="input"
              clearable
            />
          </el-form-item>

          <el-form-item
            v-else-if="item.type == 'select'"
            :prop="item.name"
          >
            <span :style="{ width: item.width + 'px', textAlign: 'center' }">
              <slot name="label">{{ item.label }}</slot>
            </span>
            <el-select
              v-model="formData[item.name]"
              class="input"
              clearable
              :placeholder="item.placeholder"
            >
              <el-option
                v-for="(sItem, sIndex) in item.options"
                :key="sIndex"
                :label="sItem.label"
                :value="sItem?.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item
            v-else-if="item.type == 'checkbox'"
            :prop="item.name"
          >
            <span :style="{ width: item.width + 'px', textAlign: 'center' }">
              <slot name="label">{{ item.label }}</slot>
            </span>
            <el-checkbox-group v-model="formData[item.name]">
              <el-checkbox
                v-for="(sItem, sIndex) in item.options"
                :key="sIndex"
                :label="sItem.label"
              />
            </el-checkbox-group>
          </el-form-item>

          <el-form-item
            v-else-if="item.type == 'radio'"
            :prop="item.name"
          >
            <span :style="{ width: item.width + 'px', textAlign: 'center' }">
              <slot name="label">{{ item.label }}</slot>
            </span>
            <el-radio-group>
              <el-radio
                v-for="(sItem, sIndex) in item.options"
                :key="sIndex"
                :label="sItem.label"
              >
                {{ sItem.label
                }}
              </el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item
            v-else-if="item.type == 'dateRange'"
            :prop="item.name"
          >
            <span :style="{ width: item.width + 'px', textAlign: 'center' }">
              <slot name="label">{{ item.label }}</slot>
            </span>
            <el-date-picker
              v-model="formData[item.name]"
              type="datetimerange"
              class="input"
              clearable
            />
          </el-form-item>

          <el-form-item
            v-else-if="item.type == 'upload'"
            :prop="item.name"
          >
            <span :style="{ width: item.width + 'px', textAlign: 'center', display: 'inline-block' }">
              <slot name="label">
                {{
                  item.label }}</slot>
            </span>
            <Upload
              ref="upload"
              :file-list="fileList"
              :plus="false"
              :show-file-list="true"
              :headers="uploadCofig"
              @success="(val) => handleSuccess(val, item.name)"
            />
          </el-form-item>
          <el-form-item v-else-if="item.type == 'editor'">
            <Quller
              :descrtion="formData.descrtion"
              @change="handleText"
            />
          </el-form-item>
        </div>
      </template>
      <el-form-item>
        <slot name="tree" />
      </el-form-item>
    </el-form>
    <div
      v-if="props.inline"
      class="opeartion-btn"
    >
      <el-button
        type="primary"
        :icon="Search"
        @click="handleSearch"
      >
        搜索
      </el-button>
      <el-button
        type="default"
        :icon="Refresh"
        @click="handleRefrsh"
      >
        重置
      </el-button>
      <div
        v-if="!show"
        class="more"
        @click="toggle"
      >
        <el-icon class="icon">
          <ArrowDown />
        </el-icon>展开
      </div>
      <div
        v-if="show"
        class="more"
        @click="toggle"
      >
        <el-icon class="icon">
          <ArrowUp />
        </el-icon>收回
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { Search, Refresh } from "@element-plus/icons-vue";
import Upload from "@/components/upload/index.vue";
import { UploadFile, FormInstance } from "element-plus";
import type { success } from "@/components/upload/index";
import { withDefaults, ref,onMounted} from "vue";
import Cookies from "js-cookie";
import Quller from "@/components/vueEditer/index.vue";

//添加表单验证，格式，默认为字段：【规则】

interface prop {
  inline: boolean,
  initData?:object,
  formField: Array<{ type: string, name: string, placeholder?: string, width?: number, label: string, options?: Array<{ label: string | number, value: number | string }> }>,
  formRule?: typeof formData,
}

const fileList = reactive<UploadFile | any>([]);

const show = ref<boolean>(false);
const form = ref<FormInstance | null>(null);

const upload = ref<typeof Upload | null>(null);

// 初始化字段值
onMounted(() => {
  nextTick(()=>{
    console.log(props,"props")
  })
  if (props.formField.length > 0) {
    props.formField.forEach(item => {
      formData[item.name] = props.initData[item.name]!=null?props.initData[item.name]:null;
      if(item.type=='upload'&&formData[item.name]!=null){
        fileList.push({name:"",url:formData[item.name]});
      }
    })
  }
})

const props = withDefaults(defineProps<prop>(), {
  inline: false,
  formField: () => ([]),
  initData:()=>({}),
  formRule: () => ({}),
})

const emits = defineEmits<{
  (e: 'search', formData: object): void,
  (e: 'refsh'): void
}>();


const formData = reactive<{ [key: string]: any }>({
})

const handleSuccess = (val: success, name: string) => {
  fileList.forEach(() => { fileList.splice(0, 1) });
  let index: number = val.data.lastIndexOf(".");
  let prevIndex: number = val.data.lastIndexOf("/");
  fileList.push({
    name: val.data.slice(prevIndex + 1, index),
    url: val.data,
  });
  console.log(name,"name")
  formData[name] = val.data;
}

const handleSearch = () => {
  emits('search', formData);
}

const handleRefrsh = () => {
  resetFiled();
  emits('refsh');
}


const resetFiled = () => {
  fileList.length = 0;
  props.formField.forEach(item => {
    formData[item.name] = "";
  })
  if (formData['id']) {
    delete formData['id'];
  }
}

const toggle = () => {
  show.value = !show.value
}

const handleText = (val) => {
  props.formField.forEach(item => {
    if (item.type == 'editor') {
      formData[item.name] = val;
      console.log(val, "val")
      console.log(formData);
    }
  })
}

const uploadCofig = reactive({
  authorization: Cookies.get("token")
})

// 添加验证方法，对外提供，提交验证逻辑

const commitFormValite=(formEl:typeof form |undefined)=>{
      if(!formEl) return ;
      formEl.value?.validate((valid)=>{
        if(valid){
          console.log("效果正确");
        }else{
          console.log("无效国")
        }
      })
} 

//清除表单验证
const clearValite=(formEl:typeof form |undefined)=>{
  if(!formEl) return ;
    formEl.value?.clearValidate();
}

// 重置表单
const resetFileds=(formEl:typeof form|undefined)=>{
  if(!formEl) return ;
  formEl.value?.resetFields();
}

defineExpose({
  formData,
  resetFiled,
  fileList,
  commitFormValite,
  clearValite,
  resetFileds
})

</script>
<style lang="scss" scoped>
.dark {
  .form-list {
    background-color: inherit;
  }
}

.form-list {
  text-align: left;
  padding: 20px;
  background-color: #fff;
  flex-wrap: wrap;
}

.opeartion-btn {
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
  width: 200px;

  .more {
    margin-top: 15px;
    margin-right: 20px;
    display: inline-flex;
    justify-content: flex-start;
    align-items: flex-start;
    font-size: 14px;
    cursor: pointer;

    .icon {
      font-size: 14px;
      margin-right: 5px;
      width: 14px;
    }
  }
}


.input {
  width: 300px;

  .el-date-editor {
    width: inherit;
  }
}
</style>
