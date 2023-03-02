<script lang="tsx" setup>
import {
  ElButton,
  Column
} from 'element-plus'

import { resolveDynamicComponent, unref } from "vue"
import type { FunctionalComponent } from 'vue'
import ElCheckbox from 'element-plus/lib/components/checkbox';
import Pagetions from "@/components/pagetions/index.vue";

const Checkbox = resolveDynamicComponent('ElCheckbox') as typeof ElCheckbox;

type checkboxType = {
  value: boolean,
  intermediate?: boolean
  onChange: (value: any) => any
}


const checkboxRender: FunctionalComponent<checkboxType> = ({
  value,
  intermediate = false,
  onChange,
}) => {
  return (<><Checkbox onChange={onChange} modelValue={value} indeterminate={intermediate} ></Checkbox></>);
}


const generateColumns = (length = 10, prefix = 'column-', props?: any) =>
  Array.from({ length }).map((_, columnIndex) => ({
    ...props,
    key: `${prefix}${columnIndex}`,
    dataKey: `${prefix}${columnIndex}`,
    title: columnIndex == 10 ? '操作' : `Column ${columnIndex}`,
    width: 150,
  }));
const widths = (document.querySelector('.aside')?.getBoundingClientRect().width) as number;
const documentWidth = document.documentElement.clientWidth;
let realWidth = documentWidth - widths - 40;
const contentWidth = ref<number>(realWidth);

const generateData = (
  columns: ReturnType<typeof generateColumns>,
  length = 200,
  prefix = 'row-'
) =>
  Array.from({ length }).map((_, rowIndex) => {
    return columns.reduce(
      (rowData, column, columnIndex) => {
        if (columnIndex == 10) {
          column.cellRenderer = () => {
            return <>
              <ElButton size="small">Edit</ElButton>
              <ElButton size="small" type="danger">
                Delete
              </ElButton>
            </>
          }
        } else {
          rowData[column.dataKey] = `Row ${rowIndex} - Col ${columnIndex}`
        }
        return rowData
      },
      {
        id: `${prefix}${rowIndex}`,
        parentId: null,
      }
    )
  });

const columns: Column<any>[] = generateColumns(10);

columns.unshift({
  key: 'selection',
  width: 50,
  cellRenderer: ({ rowData }): any => {
    const onChange = (value: any): any => (rowData.checked = value)
    return <checkboxRender value={rowData.checked} onChange={onChange} />
  },
  headerCellRenderer: () => {
    const _data = unref(data);
    const onChange = (value: boolean) =>
    (data.value = _data.map((row) => {
      row.checked = value
      return row
    }))
    const allSelected = _data.every((row) => row.checked)
    const containsChecked = _data.some((row) => row.checked)

    return (
      <checkboxRender
        value={allSelected}
        intermediate={containsChecked && !allSelected}
        onChange={onChange}
      />
    )
  },


})


const data = ref(generateData(columns, 1000));
const handleSizeChange = () => { }
const handleCurrentChange = () => { }
</script>

<template>
  <div class="margin-bottom-20 margin-top-20 margin-left-20 margin-right-20 flex-1">
    <el-table-v2 :columns="columns" :data="data" height="100%" fixed />
  </div>
  <Pagetions @page="handleCurrentChange" @size="handleSizeChange" :total="10000"></Pagetions>
</template>