
import Clipboard from "clipboard";
import { ElMessage } from "element-plus";
import * as XLSX from 'xlsx/xlsx.mjs';

/**
 * 
 * @param obj string
 * @param text string
 */
const copy = (obj: string, text: string) => {
    let clipboard: Clipboard = new Clipboard(obj, {
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
 * @returns 
 */
const getOneLevel = function (oldData: Array<any>, objectKeys: Array<any>): Array<object> {
    let arr: object[] = [];
    oldData.forEach(item => {
        let obj: any = {};
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
 * @returns 
 */
const jsonToTree = function <T extends subment, U extends keyof T>(list: Array<T>, key: U): any {
    let idList: { U: number } | any = {};
    let treeList: T[] = [];

    for (let i = 0; i < list.length; i++) {
        idList[list[i][key]] = list[i];
    }

    for (let j = 0; j < list.length; j++) {
        let currentVal = <T & { menuName: string, meta: { title: string, hidden: boolean, icon: string } }>list[j];
        currentVal.path = currentVal.routePath;
        currentVal.title = currentVal.menuName;
        let hidden = currentVal.hidden ? false : true;
        currentVal.meta = {
            title: currentVal.menuName,
            hidden: hidden,
            icon: currentVal.icon,
        }
        let currentParent = idList[currentVal['parentId'] == 0 ? -1 : currentVal['parentId']];
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
const downLoading = function (data: Array<any>, filenames: string = "data", suffix: string = 'csv') {
    let bold: Blob;;
    if (suffix == 'csv') {
        let dataType = Object.keys(data[0]) + "\n";
        for (let item of data) {
            let row: string = "";
            for (let element in item) {
                row += item[element] ? item[element] + "," : "" + ",";
            }
            dataType += row + "\r\n";
        }
        bold = new Blob([dataType], {
            type: "application/csv"
        });
    } else {
        let ws = XLSX.utils.json_to_sheet(data);
        // 创建一个新的额工作部
        let workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, ws, "第一页");
        bold = XLSX.writeFile(workbook, "sheet.xlsx")

    }
    let a: HTMLAnchorElement = document.createElement("a");
    let url: string = window.URL.createObjectURL(bold);
    a.href = url;
    a.download = `${filenames}.${suffix}`;
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

/**
 * @desc 防抖函数
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
 * @desc 节流函数
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
    let reg: RegExp = /^https/;
    if (reg.test(path)) {
        return true
    }
    return false
}

export {
    copy,
    getOneLevel,
    jsonToTree,
    downLoading,
    stabilization,
    throttle,
    isOutLink
}