
import Clipboard from "clipboard";
import {ElMessage} from "element-plus"

const copy=(obj:string,text:string)=>{
    let clipboard:Clipboard=new Clipboard(obj,{
        text:function(trigger:any){
            return text;
        }
    });

    clipboard.on("success",function(e){
        ElMessage.success("复制成功")
        e.clearSelection()
    })

    clipboard.on('faild',function(e){
        console.log('复制失败'+e);
    })
}

export {
    copy
}