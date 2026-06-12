<script lang="ts" setup>
import { Tree } from "@/components/tree/index";
import { TreeNode } from "element-plus/lib/components/table/src/table/defaults";
import { ElTree } from "element-plus";
import { TreeKey } from "element-plus/es/components/tree/src/tree.type";
import type {DefualtProps,fun} from "./index"

const treeRef = ref<InstanceType<typeof ElTree>>();

const getCheckedNodeKeys = (): TreeKey[] => {
    let arr: TreeKey[] = [];
    if (treeRef.value != null) {
        let arrs = treeRef.value.getCheckedKeys();
        let sendconds = treeRef.value.getHalfCheckedKeys();
        arr = [...arrs, ...sendconds]
        return arr;
    }
    return arr;
}

const clearChecked = () => {
    if (treeRef.value != null) {
        return treeRef.value.setCheckedNodes([]);
    }
}

const setChecked = (arr: number[]) => {
    if (treeRef.value != null) {
        arr.forEach(item => {
            treeRef.value?.setChecked(item, true, false);
        })

    }
}

const handleNodeClick = (val: TreeNode) => {
    console.log(val)
}



const property = withDefaults(defineProps<{
    props?:DefualtProps,
    defaultProps: any,
    data: Tree[] | Array<any>,
    lazy?: boolean,
    load?: fun,
    nodeKey?: string,
    renderContent?: fun,
    customClassName?: string,
    filterNodeMethod?: fun,
    accordion?: boolean,
    emptyText?: string,
    checkOnClickNode?: boolean,
    showCheckbox?: boolean,
    defaultCheckedKeys?: TreeKey[] | undefined
}>(

), {
    data: <any>[],
    lazy: false,
    load: () => ({}),
    nodeKey: "id",
    renderContent: () => ({}),
    customClassName: "",
    filterNodeMethod: () => ({}),
    accordion: false,
    emptyText: "暂无数据",
    checkOnClickNode: false,
    showCheckbox: true,
    defaultCheckedKeys: undefined,
    defaultProps: { label: "label", child: "children" }
})

defineExpose({
    getCheckedNodeKeys,
    clearChecked,
    setChecked
})

</script>

<template>
  <div class="tree">
    <el-tree
      ref="treeRef"
      :data="property.data"
      :default-checked-keys="defaultCheckedKeys"
      :node-key="nodeKey"
      :show-checkbox="showCheckbox"
      :props="property.defaultProps"
      :empty-text="emptyText"
      @node-click="handleNodeClick"
    />
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-tree__empty-block) {
    min-height: auto;
    width: 150px;
}
</style>