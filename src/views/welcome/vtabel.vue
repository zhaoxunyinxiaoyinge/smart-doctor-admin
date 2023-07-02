<script lang="tsx" setup>
import { CheckboxValueType, ElButton, ElCheckbox, TableV2FixedDir, TableV2Instance } from 'element-plus'
import { CENTERED_ALIGNMENT } from 'element-plus/es/components/virtual-list/src/defaults';
import { FunctionalComponent } from 'vue';

const onChange = () => { }

type SelectionCellProps = {
  value: boolean
  intermediate?: boolean
  onChange: (value: CheckboxValueType) => void
}

const SelectionCell: FunctionalComponent<SelectionCellProps> = ({
  value,
  intermediate = false,
  onChange,
}) => {
  return (
    <ElCheckbox
      onChange={onChange}
      modelValue={value}
      indeterminate={intermediate}
    />
  )
}

const generateColumns = (length = 10, prefix = 'column-', props?: any) =>
  Array.from({ length }).map((_, columnIndex) => ({
    ...props,
    key: `${prefix}${columnIndex}`,
    dataKey: columnIndex === 9 ? null : `${prefix}${columnIndex}`,
    title: columnIndex === 9 ? '操作' : `Column ${columnIndex}`,
    align:CENTERED_ALIGNMENT,
    width: 150,
    cellRenderer: columnIndex === 9 ? () => <><ElButton size="small" type='primary'>编辑</ElButton>
      <ElButton size="small" type="danger">
        删除
      </ElButton></> : ""
  }))

const generateData = (
  columns: ReturnType<typeof generateColumns>,
  length = 200,
  prefix = 'row-'
) =>
  Array.from({ length }).map((_, rowIndex) => {
    return columns.reduce(
      (rowData, column, columnIndex) => {
        rowData[column.dataKey] = `Row ${rowIndex} - Col ${columnIndex}`
        return rowData
      },
      {
        id: `${prefix}${rowIndex}`,
        parentId: null,
      }
    )
  })

const columns = generateColumns(10)
columns[9].fixed = TableV2FixedDir.RIGHT;

columns.unshift({
  key: 'selection',
  width: 50,
  cellRenderer: ({ rowData }) => {
    const onChange = (value: CheckboxValueType) => (rowData.checked = value)
    return <SelectionCell value={rowData.checked} onChange={onChange} />
  },

  headerCellRenderer: () => {
    const _data = unref(data)
    const onChange = (value: CheckboxValueType) =>
    (data.value = _data.map((row) => {
      row.checked = value
      return row
    }))
    const allSelected = _data.every((row) => row.checked)
    const containsChecked = _data.some((row) => row.checked)

    return (
      <SelectionCell
        value={allSelected}
        intermediate={containsChecked && !allSelected}
        onChange={onChange}
      />
    )
  },
})

let data: any = generateData(columns, 200)

const tableRef = ref<TableV2Instance>()
const scrollDelta = ref(200)
const scrollRows = ref(10)

function scrollByPixels() {
  tableRef.value?.scrollToTop(scrollDelta.value)
}

function scrollByRows() {
  tableRef.value?.scrollToRow(scrollRows.value)
}


</script>

<template>
  <div class="margin-bottom-20 margin-top-20 margin-left-20 margin-right-20 flex-1">
    <div style="height:100%">
      <el-auto-resizer>
        <template #default="{ height, width }">
          <el-table-v2 :columns="columns" :data="data" :width="width" :height="height" fixed />
        </template>
      </el-auto-resizer>
    </div>
  </div>
</template>