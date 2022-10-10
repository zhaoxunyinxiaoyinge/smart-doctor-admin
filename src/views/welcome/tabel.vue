<script lang="ts" setup>
import { showImage as vShowImage } from "@/utils/index";
import { ElTable, ElMessageBox, ElMessage, ElNotification, ElInput } from "element-plus";

import DefineForm from "@/components/forms/index.vue";

import Pagegtion from "@/components/pagetions/index.vue";
import TabelColumn from "./components/TableColumn.vue"

import module from "@/views/welcome/tabel.module.css";
import content from "@/assets/scss/layout.module.scss";

import { MockData } from "@/utils/request";

interface list {
    label: string;
    prop?: string;
    width?: number;
    template?: string
}

interface dataList {
    user_name?: string | undefined,
    age?: number | undefined,
    grade?: string | undefined
}


interface formField {
    type: string,
    label: string,
    name: string,
    width: number,
    options?: Array<{ label: string, value: string | number }>,
}

let list = reactive<Array<dataList>>([]);
let show = ref(false)
const dialogFormVisible = ref<boolean>(false);
let form = reactive<Partial<dataList>>({})
let tableField = reactive<Array<{ field: String,label:string, value: Boolean }>>([{
    field: 'sex',
    label:'性别',
    value: false
},{
    field: "grade",
    label:'学历',
    value: false
},
{
    
    field: "user_name",
    label:'姓名',
    value: false
}

]);


onMounted(() => {
    getData();
})

const defineFormField = reactive<Array<formField>>([
    {
        type: 'input',
        label: "用户名",
        name: "username",
        width: 120
    },
    {
        type: 'input',
        label: "密码",
        name: "password",
        width: 120
    },
    {
        type: 'input',
        label: "年龄",
        name: "age",
        width: 120
    },
    {
        type: 'input',
        label: "性别",
        name: "sex",
        width: 120
    },
    {
        type: 'input',
        label: "学历",
        name: "grade",
        width: 120
    },
    {
        type: 'select',
        label: "菜单搜索",
        name: "menu",
        width: 120
    }, {
        type: 'dateRange',
        label: "开始时间",
        name: 'time',
        width: 120
    }
])

const listQuery = reactive<{ currentPage: number, pageSize: number, total: number }>({
    currentPage: 1,
    pageSize: 20,
    total: 0
})

const multeSelection = ref<InstanceType<typeof ElTable>>();

const tabelConfig = reactive([{
    label: "姓名",
    prop: 'user_name',
},
{
    label: '年龄',
    prop: 'age'
},
{
    label: '学历',
    prop: 'grade'
},
{
    label: '操作',
    width: 250,
    template: 'template'
}]);

const getData = async () => {
    const { datas, loading, pageSize, total } = await (MockData("/api/table/list"));
    list.push(...datas);
    listQuery.pageSize = pageSize;
    listQuery.total = total;
}

const handleSelectionChange = (val: list) => {
    console.log(multeSelection.value
    )
}


const handleEdit = (val: dataList) => {
    /**
     * 这里有误差
     */
    // let { name, age, grade } = toRefs<dataList>(val);
    form.age = val.age;
    form.grade = val.grade;
    form.user_name = val.user_name;

    dialogFormVisible.value = true;
}

const handleDelete = () => {
    ElMessageBox.confirm(
        'proxy will permanently delete the file. Continue?',
        '警告',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(res => {
        ElMessage({
            type: 'success',
            message: 'Delete completed',
        })
    }).catch(err => {
        console.log(err);
    })
}

const handleCofirm = () => {
    dialogFormVisible.value = false;
    form = {};
    ElNotification({
        title: 'Success',
        message: 'This is a success message',
        type: 'success',
    })
}


const handleAdd = () => {
    dialogFormVisible.value = true;
    form.age = undefined;
    form.grade = "";
    form.name = "";
}


const handleCommit = (val: object) => {
    console.log("点击进行搜索")
}

const handleRefsh = () => {
    console.log("搜索框已经重置了，等待刷新");
}


const handlePage = (page: number) => {
    list = [];
    console.log(page, "page")
    listQuery.currentPage = page;
    getData();
}

const handleSize = (size: number) => {
    list = [];
    listQuery.pageSize = size;
    getData();
}

const handleShow = () => {
    if (show.value) {
        show.value = false;
    } else {
        show.value =true;
    }

}
/**
 * 指令 
 */

const vMyDirective = {
    mounted(el: { style: { color: string; }; }) {
        el.style.color = 'green';
    }
}

</script>

<template>
    <div>
        <el-scrollbar :height="content.routeContentHeight">
            <define-form :form-field="defineFormField" :inline="true" @search="handleCommit" @refsh="handleRefsh">
            </define-form>
            <div class="padding-left-10 padding-right-10 padding-top-10 padding-bottom-10">
                <div :class="module.add">
                    <el-button type="primary" @click="handleAdd">
                        <el-icon>
                            <Plus />
                        </el-icon>新增
                    </el-button>

                    <el-button type="primary" @click="handleShow">展开更多列</el-button>
                </div>
                <div class="table">
                    <TabelColumn :columnField="tableField" :show="show"></TabelColumn>
                    <el-table stripe ref="multeSelection" :data="list" width="100%"
                        @selection-change="handleSelectionChange">
                        <el-table-column type="selection" width="55" />
                        <el-table-column type="index" width="55" label="#" />
                        <template v-for="item in tabelConfig">
                            <el-table-column v-if="!item.template" :width="item.width" :label="item.label"
                                :prop="item.prop">
                                <template #default="scope">
                                    <span v-show-image v-if="item.prop == 'age'">
                                        {{ item.prop && scope.row[item.prop] }}
                                    </span>
                                    <span v-else>
                                        {{ item.prop && scope.row[item.prop] }}
                                    </span>
                                </template>
                            </el-table-column>
                            <el-table-column v-else :label="item.label">
                                <template #default="scope">
                                    <el-button type="primary" @click="() => handleEdit(scope.row)"> 编辑</el-button>
                                    <el-button type="danger" @click="handleDelete"> 删除</el-button>
                                </template>
                            </el-table-column>
                        </template>
                    </el-table>
                </div>
                <el-dialog custom-class="headers" v-model="dialogFormVisible" title="Shipping address">
                    <el-form :model="form">
                        <el-form-item label="Promotion name" :label-width="130">
                            <el-input v-model="form.user_name" autocomplete="off" />
                        </el-form-item>
                        <el-form-item label="Promotion name" :label-width="130">
                            <el-input v-model="form.age" autocomplete="off" />
                        </el-form-item>
                        <el-form-item label="Zones" :label-width="130">
                            <el-select v-model="form.grade" placeholder="Please select a zone">
                                <el-option label="教授" value="教授" />
                                <el-option label="老师" value="老师" />
                                <el-option label="高中" value="高中" />
                            </el-select>
                        </el-form-item>
                    </el-form>
                    <template #footer>
                        <span class="dialog-footer">
                            <el-button @click="dialogFormVisible = false">Cancel</el-button>
                            <el-button type="primary" @click="handleCofirm">Confirm</el-button>
                        </span>
                    </template>
                </el-dialog>

                <Pagegtion :current-page="listQuery.currentPage" :page-size="listQuery.pageSize"
                    :total="listQuery.total" @page="handlePage" @size="handleSize"></Pagegtion>
            </div>
        </el-scrollbar>
    </div>
</template>

<style scoped>
.table {
   position: relative; 
}

</style>
