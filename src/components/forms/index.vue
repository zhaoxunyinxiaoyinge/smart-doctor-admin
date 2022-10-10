<template>
  <div class="padding-20 form-list" >
    <el-form :inline="true"  :model="formData">
      <template class="form-item" :key="index" v-for="(item,index) in props.formField">
        <el-form-item v-if="item.type=='input'" >
          <span slot="label" :style="{width:item.width+'px',textAlign:'center'}">{{item.label}}</span>
          <el-input type="text" v-model="formData[item.name]" class="input" clearable></el-input>
        </el-form-item>
        <el-form-item v-else-if="item.type=='select'">
          <span slot="label" :style="{width:item.width+'px',textAlign:'center'}">{{item.label}}</span>
          <el-select class="input" v-model="formData[item.name]" clearable>
            <el-option v-for="sItem in item.options" :label="item.label"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-else-if="item.type=='checkbox'">
          <span slot="label" :style="{width:item.width+'px',textAlign:'center'}">{{item.label}}</span>
          <el-checkbox-group v-model="formData[item.name]">
            <el-checkbox v-for="sItem in item.options" :label="item.label" />
          </el-checkbox-group>
        </el-form-item>
        <el-form-item v-else-if="item.type=='radio'">
          <span slot="label" :style="{width:item.width+'px',textAlign:'center'}">{{item.label}}</span>
          <el-radio-group>
            <el-radio :label="item.label" v-for="sItem in item.options">{{sItem.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-else-if="item.type=='dateRange'" v-model="formData[item.name]" >
          <span slot="label" :style="{width:item.width+'px',textAlign:'center'}">{{item.label}}</span>
          <el-date-picker type="datetimerange" class="input" clearable />
        </el-form-item>
      </template>
      <el-form-item>
        <el-button type="primary" @click="handleSearch" :icon="Search">搜索</el-button>
        <el-button type="default" :icon="Refresh" @click="handleRefrsh">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script lang="ts" setup>
import {Search,Refresh} from "@element-plus/icons-vue"

interface prop {
  inline: boolean,
  formField: Array<{ type: string, name: string,placeholder?:string, width?:number, label: String, options?: Array<{ label: string | number, value: number | string }> }>
}

const props = withDefaults(defineProps<prop>(), {
  inline: false,
  formField: () => []
})

const emits=defineEmits<{
  (e: 'search', formData: object): void,
  (e:'refsh'):void
}>();

const formData=reactive<{[key:string]:any}>({
})

const handleSearch=()=>{
    emits('search',formData);
}

const handleRefrsh=()=>{
    props.formField.forEach(item=>{
      formData[item.name]="";
    })
    emits('refsh');
}

</script>
<style scoped lang="scss">

      .form-list {
        text-align: left;
        padding: 20px;
        background-color: #fff;
        margin-bottom: 20px;
      }


      .input {
        width: 300px;
      .el-date-editor {
          width: inherit;
        }
      }
</style>
