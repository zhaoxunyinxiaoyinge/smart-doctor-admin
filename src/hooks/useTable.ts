import { ElMessage, ElMessageBox, ElTable } from "element-plus";
import {reactive,ref} from "vue";

const useTable=()=>{
  const list=reactive<Array<any>>([]);
  const dialogFormVisible = ref<boolean>(false);
  const  title = ref<string>("新增");
  const multeSelection = ref<InstanceType<typeof ElTable>>();
  const tableConfig=reactive<{[propName:string]:string}[]>([]);
  const EditForm=reactive<{[propName:string]:string}>({});
  const EditFormInstance=ref(null);
  
  //表格查询条件
  const listQuery = reactive<{ page: number, pageSize: number, total: number }>({
    page: 1,
    pageSize: 20,
    total: 0
  })

 //初始化表格配置数据
  const  initTableConfig=(data:Array<{[propName:string]:string}>)=>{
      tableConfig.push(...data)
  }

  //table拉取列表数据
  const getData = async (query: object,getUser:(params:{page:number,pageSize:number,[propName:string]:any})=>Promise<any>) => {
    list.length = 0;
    const argument={ page: listQuery.page, pageSize: listQuery.pageSize, ...query };
    const data = await getUser(argument);
    list.push(...data.data.records);
    listQuery.pageSize = data.data.size;
    listQuery.page = data.data.pages;
    listQuery.total = data.data.total;
}

//选择框选择数据
  const handleSelectionChange = () => {
     console.log(multeSelection.value
  )
 }


 //删除数据
 const handleDelete = (id: number,deleteUser:(id:number)=>Promise<any>,getData,data) => {
  ElMessageBox.confirm(
      '此操作将会删除该条数据?',
      '警告',
      {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
      }
  ).then(() => { return deleteUser(id) }).then(() => {
      getData(data)
      ElMessage({  
          type: 'success',
          message: 'Delete completed',
      })
  }).catch(err => {
      console.log(err);
  })
}





  return {
      initTableConfig,
      getData,
      handleSelectionChange,
      handleDelete,
      tableConfig,

      listQuery,
      multeSelection,
      dialogFormVisible,
      title,
      list,
      EditForm,
      EditFormInstance
  }
}


export  {
  useTable
}