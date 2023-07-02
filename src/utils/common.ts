
import Clipboard from "clipboard";
import { ElMessage } from "element-plus";
import * as XLSX from 'xlsx/xlsx.mjs';

/**
 * 
 * @param obj string
 * @param text string
 * @description 复制和粘贴功能
 */
const copy = (obj: string, text: string) => {
    const clipboard: Clipboard = new Clipboard(obj, {
        text: function (): string {
            return text;
        }
    });

    clipboard.on("success", function (e) {
        ElMessage.success("复制成功")
        e.clearSelection()
    })

    clipboard.on('faild', function (e) {
        console.log('复制失败' + e);
    })
}

/**
 * 
 * @param  oldData 多级数组对象
 * @param objectKeys 指定地唯一关键值
 * @description 将多层级数据转换为一层级
 */
const getOneLevel = function (oldData: Array<any>, objectKeys: Array<any>): Array<object> {
    const arr: object[] = [];
    oldData.forEach(item => {
        const obj: any = {};
        objectKeys.forEach(sItem => {
            obj[sItem] = item[sItem];
        })
        if (item.children) {
            arr.push(obj);
            arr.push(...getOneLevel(item.children, objectKeys));
        } else {
            arr.push(obj);
        }
    })
    return arr;
}

interface subment {
    id: number,
    title: string,
    hidden: boolean,
    icon: string,
    noCanle: number,
    parentId: string | number,
    path: string,
    routePath: string
}

/**
 * 
 * @param list 一级数组
 * @param key  指定多级的键值
 * @description 将一层级数据转换为多层级数据
 */
const jsonToTree = function <T extends subment, U extends keyof T>(list: Array<T>, key: U): any {
    const idList: { U: number } | any = {};
    const treeList: T[] = [];

    for (let i = 0; i < list.length; i++) {
        idList[list[i][key]] = list[i];
    }

    for (let j = 0; j < list.length; j++) {
        const currentVal = <T & { menuName: string, meta: { title: string, hidden: boolean, icon: string } }>list[j];
        currentVal.path = currentVal.routePath;
        currentVal.title = currentVal.menuName;
        const hidden = currentVal.hidden ? false : true;
        currentVal.meta = {
            title: currentVal.menuName,
            hidden: hidden,
            icon: currentVal.icon,
        }
        const currentParent = idList[currentVal['parentId'] == 0 ? -1 : currentVal['parentId']];
        if (currentParent) {
            if ("children" in currentParent) {
                currentParent['children'].push(currentVal)
            } else {
                currentParent['children'] = [];
                currentParent['children'].push(currentVal);
            }
        } else {
            treeList.push(currentVal);
        }
    }
    return treeList;
}

/**
 * 
 * @param data  指定的数据源
 * @param filenames excel或者csv的名称
 * @param suffix  生成的表格类型
 */
const downLoading = function (data: Array<any>, filenames = "data", suffix = 'csv') {
    let bold: Blob;
    if (suffix == 'csv') {
        let dataType = Object.keys(data[0]) + "\n";
        for (const item of data) {
            let row = "";
            for (const element in item) {
                row += item[element] ? item[element] + "," : "" + ",";
            }
            dataType += row + "\r\n";
        }
        bold = new Blob([dataType], {
            type: "application/csv"
        });
    } else {
        const ws = XLSX.utils.json_to_sheet(data);
        // 创建一个新的额工作部
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, ws, "第一页");
        bold = XLSX.writeFile(workbook, "sheet.xlsx")

    }
    const a: HTMLAnchorElement = document.createElement("a");
    const url: string = window.URL.createObjectURL(bold);
    a.href = url;
    a.download = `${filenames}.${suffix}`;
    document.body.append(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

/**
 * @descrition 防抖函数
 * @params fn Function]
 * @params time number
 * @return void
 */
const stabilization = (callback: (...rest: any[]) => void, time: number) => {
    let timer: ReturnType<typeof setTimeout>;
    return function (...rest) {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            callback.apply(null, [...rest]);
        }, time)
    }
}

/**
 * @descrition 节流函数
 * @param fn Function
 * @param time  number
 * @returns  void
 */
type throFun = (...rest: Array<any>) => void
const throttle = (fn: throFun, time: number) => {
    let timer: ReturnType<(typeof setTimeout)>;
    return function (...rest) {
        if (!timer) {
            timer = setTimeout(() => {
                fn.apply(null, [...rest]);
                clearTimeout(timer);
            }, time)
        }
    }
}

/**
 * 
 * @param path string
 * 
 * @returns  string|component
 */
const isOutLink = (path: string): boolean => {
    const reg = /^https/;
    if (reg.test(path)) {
        return true
    }
    return false
}

/**
 * 
 * @param data --表格二进制数据,
 * @param name -- 生成文件名称
 * @description 下载生成指定格式的文件
 */
const javaDown = (data: any, name: string) => {
    const bold = new Blob([data], { type: 'application/vnd.ms-excel' });
    const a: HTMLAnchorElement = document.createElement("a");
    const url: string = window.URL.createObjectURL(bold);
    a.href = url;
    a.download = name + ".xlsx";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

/**
 * @param canvas ---当前画布
 * @param context ----画布的上下文
 * @param num ---生成随随机码的个数
 * @param random --- 生成验证码的字符
 * @description 登录页面前端自动生成随机验证码
 */
const createValiteCode=(canvas:HTMLCanvasElement,context:CanvasRenderingContext2D,num:number,randoms:Array<number|string>)=>{
    context.clearRect(0, 0, canvas.width, canvas.height)
    const txtArrr=getMathRandom(num,randoms);     
    context.fillStyle="blue";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.font = "25px Microsoft YaHei";
    context.fillStyle='#fff'
     txtArrr.forEach((item:(number|string),index:number)=>{
        context.fillText(item.toString() ,Math.floor(Math.random()*10+20)*index+10,30);
     })
     const imgData=canvas.toDataURL();

    return imgData
}

/** 
 * @param num 随机数的梳理
 * @param random  随机字符列表
 * @result arr  生成的随机字符数组
 * @description 生成三个随机数
 *
 */

const getMathRandom=(num:number,randoms:Array<number|string>):Array<number|string>=>{
    const arr:Array<number|string>=[];
    for(let i=0;i<num;i++){
        arr[i]=randoms[Math.floor(Math.random()*randoms.length)]
    }
    return arr;
}


export {
    copy,
    getOneLevel,
    jsonToTree,
    downLoading,
    stabilization,
    throttle,
    isOutLink,
    javaDown,
    getMathRandom,
    createValiteCode
}