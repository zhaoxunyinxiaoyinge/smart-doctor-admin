<script lang="ts" setup>
import { showImage as vShowImage } from "@/utils/index";
import { ElTable, ElMessageBox, ElMessage, ElNotification, ElInput, UploadUserFile } from "element-plus"
import { ref, reactive, onMounted } from "vue";

import DefineForm from "@/components/forms/index.vue";
import Upload from "@/components/upload/index.vue";
import PageHeader from "@/components/pageHeader/index.vue";
import type { success } from "@/components/upload/index";

import Pagegtion from "@/components/pagetions/index.vue";
import Tree from "@/components/tree/index.vue";

import { getUser, getRoleUser, postUser, putUser, deleteUser } from "@/views/welcome/api/index";
import { getRoleList } from "@/views/role/api/index";


import Cookies from "js-cookie";

interface dataList {
    id?: number,
    userName?: string | undefined,
    phone?: string | undefined,
    idNum?: number | undefined,
    passWord?: string | undefined,
    createTime?: Date | null,
    avatar: string,
    work: string
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
let title = ref("新增");
let fileList = reactive<UploadUserFile[]>([]);
let defineProps = reactive({ label: "roleName", children: "children" });
let treeData = reactive<any>([]);

onMounted(() => {
    getData({});
    getRoleLists();
})

const defineFormField = reactive<Array<formField>>([
    {
        type: 'input',
        label: "用户名",
        name: "userName",
        width: 120
    },
    {
        type: 'input',
        label: "身份证号",
        name: "idNum",
        width: 120
    },
    {
        type: 'input',
        label: "手机号",
        name: "phone",
        width: 120
    }
])

const listQuery = reactive<{ page: number, pageSize: number, total: number }>({
    page: 1,
    pageSize: 20,
    total: 0
})

const tree = ref<typeof Tree | null>(null);

const multeSelection = ref<InstanceType<typeof ElTable>>();
const formId = ref<typeof DefineForm | null>(null);

const tabelConfig = reactive([{
    label: "用户名",
    prop: 'userName',
},
{
    label: '职业',
    prop: 'work'
},
{
    label: '手机号码',
    prop: 'phone'
},
{
    label: '身份证号码',
    prop: 'idNum'
},
{
    label: '创建时间',
    prop: 'createTime'
},
{
    label: '更新时间',
    prop: 'updateTime'
},
{
    label: '操作',
    width: 250,
    template: 'template'
}]);

const uploadCofig = reactive({
    authorization: Cookies.get("token")
})

const getData = async (query: object) => {
    list.length = 0;
    let data = await getUser({ page: listQuery.page, pageSize: listQuery.pageSize, ...query });
    list.push(...data.data.records);
    listQuery.pageSize = data.data.size;
    listQuery.page = data.data.pages;
    listQuery.total = data.data.total;
}

const getRoleLists = () => {
    getRoleList({ page: 1, pageSize: 9999 }).then((res: any) => {
        if (res.code == 1) {
            treeData.push(...res.data.records);
        }
    })
}

const getRoleUsers = (user_id: number) => {
    getRoleUser({ user_id }).then((res: any) => {
        if (res.code == 1) {
            let ids = res.data.map((item: any) => item.roleId);
            if (tree.value) {
                tree.value?.setChecked(ids);
            }
        }
    })
}

const handleSelectionChange = () => {
    console.log(multeSelection.value
    )
}


const handleSearch = () => {
    listQuery.page = 1;
    let data = formId.value?.formData;
    getData(data)
}

const handleEdit = (val: dataList) => {
    fileList.length = 0;
    title.value = "编辑";
    if (val.id) {
        getRoleUsers(val.id);
    }
    form.id = val.id;
    form.userName = val.userName;
    form.phone = val.phone;
    form.passWord = val.passWord;
    form.avatar = val.avatar;
    if (form.avatar != null) {
        fileList.push({ name: "img", url: val.avatar });
    }

    form.idNum = val.idNum;
    form.work = val.work;
    dialogFormVisible.value = true;
}

const handleDelete = (id: number) => {
    ElMessageBox.confirm(
        '此操作将会删除该条数据?',
        '警告',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(() => { return deleteUser(id) }).then(() => {
        let data = formId.value?.formData;
        getData(data)
        ElMessage({
            type: 'success',
            message: 'Delete completed',
        })
    }).catch(err => {
        console.log(err);
    })
}



const handleAdd = () => {
    if (form.id) {
        delete form.id;
    }
    title.value = "新增";
    form.userName = undefined;
    form.phone = "";
    form.idNum = undefined;
    form.passWord = "";
    form.avatar = '';
    form.work = "";
    fileList.splice(0, 1)
    if (tree.value) {
        tree.value?.clearChecked();
    }
    dialogFormVisible.value = true;
}


const handleCommit = (val: any) => {
    let ids = tree.value?.getCheckedNodeKeys();
    if (title.value == '新增') {
        postUser({ ...form, ids }).then((res: any) => {
            if (res.code == 1) {
                ElNotification({
                    title: 'Success',
                    message: 'This is a success message',
                    type: 'success',
                })
                let data = formId.value?.formData;
                getData(data);
            }
        }).finally(() => {
            dialogFormVisible.value = false;
        })
    } else {
        putUser({ ...form, ids }).then((res: any) => {
            if (res.code == 1) {
                ElNotification({
                    title: 'Success',
                    message: 'This is a success message',
                    type: 'success',
                })
                let data = formId.value?.formData;
                getData(data);
            }
        }).finally(() => {
            dialogFormVisible.value = false;
        })
    }


}

const handleRefsh = () => {
    listQuery.page = 1;
    let data = formId.value?.formData;
    getData(data);
}


const handlePage = (page: number) => {
    listQuery.page = page;
    let data = formId.value?.formData;
    getData(data);
}

const handleSize = (size: number) => {
    listQuery.pageSize = size;
    let data = formId.value?.formData;
    getData(data);
}

const handleShow = () => {
    if (show.value) {
        show.value = false;
    } else {
        show.value = true;
    }

}

const handleSuccess = (val: success) => {
    if (val.code == 1) {
        form.avatar = val.data;
    }
}

</script>

<template>
    <Fragment>
        <define-form ref="formId" :form-field="defineFormField" :inline="true" @search="handleSearch" @refsh="handleRefsh">
        </define-form>
        <PageHeader @add="handleAdd"></PageHeader>
        <div class="margin-top-20 margin-left-20 margin-right-20 margin-bottom-20 flex-1">
            <el-table stripe ref="multeSelection" :data="list" width="100%" height="100%"
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" />
                <el-table-column type="index" width="55" label="#" />
                <template v-for="item in tabelConfig">
                    <el-table-column :key="item.label" v-if="!item.template" :width="item.width" :label="item.label"
                        :prop="item.prop">
                        <template #default="scope">
                            <span v-show-image v-if="item.prop == 'avatar'">
                                <el-image :src="scope.row.avatar"></el-image>
                            </span>
                            <span v-else>
                                {{ item.prop && scope.row[item.prop] }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column :key="item.prop" v-else :label="item.label">
                        <template #default="scope">
                            <el-button type="primary" @click="handleEdit(scope.row)"> 编辑</el-button>
                            <el-button type="danger" @click="handleDelete(scope.row.id)"> 删除</el-button>
                        </template>
                    </el-table-column>
                </template>
            </el-table>
            <el-dialog custom-class="headers" v-model="dialogFormVisible" :title="title">
                <el-form :model="form">
                    <el-form-item label="用户名" :label-width="130">
                        <el-input v-model="form.userName" autocomplete="off" />
                    </el-form-item>
                    <el-form-item label="用户密码" :label-width="130" v-if="title == '新增'">
                        <el-input v-model="form.passWord" autocomplete="off" />
                    </el-form-item>
                    <el-form-item label="用户头像" :label-width="130">
                        <Upload :limit="1" :file-list="fileList" :plus="false" @success="handleSuccess" :showFileList="true"
                            :headers="uploadCofig"></Upload>
                    </el-form-item>

                    <el-form-item label="电话号码" :label-width="130">
                        <el-input v-model="form.phone"></el-input>
                    </el-form-item>

                    <el-form-item label="职业" :label-width="130">
                        <el-input v-model="form.work"></el-input>
                    </el-form-item>

                    <el-form-item label="身份证号码" :label-width="130">
                        <el-input v-model="form.idNum"></el-input>
                    </el-form-item>

                    <el-form-item label="角色" :label-width="130">
                        <Tree ref="tree" :default-props="defineProps" :data="treeData"></Tree>
                    </el-form-item>
                </el-form>
                <template #footer>
                    <span class="dialog-footer">
                        <el-button @click="dialogFormVisible = false">取消</el-button>
                        <el-button type="primary" @click="handleCommit">提交</el-button>
                    </span>
                </template>
            </el-dialog>
        </div>
        <Pagegtion :current-page="listQuery.page" :page-size="listQuery.pageSize" :total="listQuery.total"
            @page="handlePage" @size="handleSize"></Pagegtion>
    </Fragment>
</template>
