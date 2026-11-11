<script lang="ts" setup>
import { showImage as vShowImage } from "@/utils/index";
import { ElTable, ElMessageBox, ElMessage, ElNotification, ElInput, UploadUserFile } from "element-plus"
import { ref, reactive, computed, onMounted, nextTick } from "vue";

// legacy 模式下 script 里不能直接用 $t，统一走 i18n.global.t（模板里仍可用 $t）
import { i18n } from "@/lang/index";

// 包一层箭头函数，避免解构丢失 this，同时保证 computed 内的响应式追踪
const t = (key: string, ...args: any[]) => (i18n as any).global.t(key, ...args);

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
const dialogFormVisible = ref<boolean>(false);
let form = reactive<Partial<dataList>>({})
// 弹窗模式：add=新增 edit=编辑（不再存中文文案，文案由 i18n 渲染）
let mode = ref<"add" | "edit">("add");
let fileList = reactive<UploadUserFile[]>([]);
let defineProps = reactive({ label: "roleName", children: "children" });
let treeData = reactive<any>([]);

onMounted(() => {
    getData({});
    getRoleLists();
})

// label 存 i18n key，渲染时再翻译，切换语言时 computed 会跟着重算
const defineFormField = reactive<Array<formField>>([
    {
        type: 'input',
        label: "user.userName",
        name: "userName",
        width: 120
    },
    {
        type: 'input',
        label: "user.idNum",
        name: "idNum",
        width: 120
    },
    {
        type: 'input',
        label: "user.phone",
        name: "phone",
        width: 120
    }
])

// 传给 DefineForm 的字段：把 key 翻译成当前语言的文案
const formFieldI18n = computed(() =>
    defineFormField.map((f) => ({ ...f, label: t(f.label) }))
)

const listQuery = reactive<{ page: number, pageSize: number, total: number }>({
    page: 1,
    pageSize: 20,
    total: 0
})

const tree = ref<typeof Tree | null>(null);

const multeSelection = ref<InstanceType<typeof ElTable>>();
const formId = ref<typeof DefineForm | null>(null);

// label 存 i18n key，模板里用 $t(item.label) 渲染
const tabelConfig = reactive([{
    label: "user.userName",
    prop: 'userName',
},
{
    label: 'user.work',
    prop: 'work'
},
{
    label: 'user.phone',
    prop: 'phone'
},
{
    label: 'user.idNum',
    prop: 'idNum'
},
{
    label: 'user.createTime',
    prop: 'createTime'
},
{
    label: 'user.updateTime',
    prop: 'updateTime'
},
{
    label: 'user.action',
    width: 250,
    template: 'template'
},
]);

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
    fileList.splice(0,1);
    mode.value = "edit";
    form.id = val.id;
    form.userName = val.userName;
    form.phone = val.phone;
    form.passWord = val.passWord;
    form.avatar = val.avatar;
    if (form.avatar != null) {
        fileList.push({
            name: "img", url: val.avatar
        })
    }

    form.idNum = val.idNum;
    form.work = val.work;
    dialogFormVisible.value = true;
    // 弹窗打开、Tree 渲染完成后才能回显勾选（否则 tree ref 还是 null）
    const roleUserId = val.id;
    if (roleUserId) {
        nextTick(() => getRoleUsers(roleUserId));
    }
}

const handleDelete = (id: number) => {
    ElMessageBox.confirm(
        t('user.deleteConfirm'),
        t('user.warning'),
        {
            confirmButtonText: t('user.confirm'),
            cancelButtonText: t('user.cancel'),
            type: 'warning',
        }
    ).then(() => { return deleteUser(id) }).then(() => {
        let data = formId.value?.formData;
        getData(data)
        ElMessage({
            type: 'success',
            message: t('user.deleteSuccess'),
        })
    }).catch(err => {
        console.log(err);
    })
}

const handleAdd = () => {
    if (form.id) {
        delete form.id;
    }
    mode.value = "add";
    form.userName = undefined;
    form.phone = "";
    form.idNum = undefined;
    form.passWord = "";
    form.avatar = '';
    form.work = "";
    fileList.splice(0,1);
    fileList.length=0;
    if (tree.value) {
        tree.value?.clearChecked();
    }
    dialogFormVisible.value = true;
}

const handleCommit = () => {
    // 后端字段名是 roleIds，勾选的叶子 + 半选父节点一起提交
    const roleIds = (tree.value?.getCheckedNodeKeys() ?? []).map(Number);
    const isAdd = mode.value === 'add';
    const req = isAdd ? postUser({ ...form, roleIds }) : putUser({ ...form, roleIds });
    req.then((res: any) => {
        if (res.code == 1) {
            ElNotification({
                title: t('user.success'),
                message: isAdd ? t('user.addSuccess') : t('user.editSuccess'),
                type: 'success',
            })
            let data = formId.value?.formData;
            getData(data);
        }
    }).finally(() => {
        dialogFormVisible.value = false;
    })
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

const handleSuccess = (val: success) => {
    fileList.splice(0,1);
    if (val.code == 1) {
        form.avatar = val.data;
    }
    fileList.push({name:"img",url:val.data})
}

</script>

<template>
  <define-form
    ref="formId"
    :form-field="formFieldI18n"
    :inline="true"
    @search="handleSearch"
    @refsh="handleRefsh"
  />
  
  <PageHeader
    :url="'/api/user/import'"
    :name="'user'"
    :add="true"
    :export="true"
    @add="handleAdd"
  />
  <div class="flex-1">
    <el-table
      ref="multeSelection"
      stripe
      :data="list"
      width="100%"
      height="100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
      />
      <el-table-column
        type="index"
        width="55"
        label="#"
      />
      <template v-for="item in tabelConfig">
        <el-table-column
          v-if="!item.template"
          :key="item.label"
          :width="item.width"
          :label="$t(item.label)"
          :prop="item.prop"
        >
          <template #default="scope">
            <span
              v-if="item.prop == 'avatar'"
              v-show-image
            >
              <el-image :src="scope.row.avatar" />
            </span>
            <span v-else>
              {{ item.prop && scope.row[item.prop] }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          v-else
          :key="item.prop"
          :label="$t(item.label)"
        >
          <template #default="scope">
            <el-button
              type="primary"
              @click="handleEdit(scope.row)"
            >
              {{ $t("user.edit") }}
            </el-button>
            <el-button
              type="danger"
              @click="handleDelete(scope.row.id)"
            >
              {{ $t("user.del") }}
            </el-button>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <el-dialog
    v-if="dialogFormVisible"
      v-model="dialogFormVisible"
      custom-class="headers"
      :title="mode === 'add' ? $t('user.add') : $t('user.edit')"
    >
      <el-form :model="form">
        <el-form-item
          :label="$t('user.userName')"
          :label-width="130"
        >
          <el-input
            v-model="form.userName"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item
          v-if="mode === 'add'"
          :label="$t('user.password')"
          :label-width="130"
        >
          <el-input
            v-model="form.passWord"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item
          :label="$t('user.avatar')"
          :label-width="130"
        >
          <Upload
            :limit="1"
            :file-list="fileList"
            :plus="false"
            :show-file-list="true"
            :headers="uploadCofig"
            @success="handleSuccess"
          />
        </el-form-item>

        <el-form-item
          :label="$t('user.phone')"
          :label-width="130"
        >
          <el-input v-model="form.phone" />
        </el-form-item>

        <el-form-item
          :label="$t('user.work')"
          :label-width="130"
        >
          <el-input v-model="form.work" />
        </el-form-item>

        <el-form-item
          :label="$t('user.idNum')"
          :label-width="130"
        >
          <el-input v-model="form.idNum" />
        </el-form-item>

        <el-form-item
          :label="$t('user.role')"
          :label-width="130"
        >
          <Tree
            ref="tree"
            :default-props="defineProps"
            :data="treeData"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">{{ $t("user.cancel") }}</el-button>
          <el-button
            type="primary"
            @click="handleCommit"
          >{{ $t("user.submit") }}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
  <Pagegtion
    :current-page="listQuery.page"
    :page-size="listQuery.pageSize"
    :total="listQuery.total"
    @page="handlePage"
    @size="handleSize"
  />
</template>
