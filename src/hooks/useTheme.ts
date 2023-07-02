
import { IconInstance, ScrollbarInstance } from "element-plus";

/**
 * 
 * @param val 颜色变量值
 * @return void
 */
export function setTheme(val: string): void {
    const docu: HTMLElement = document.documentElement as HTMLElement;
    for(let i=0;i<10;i++){
    if(i===0){
        docu.style.setProperty("--el-color-primary", val);
    }else{
        docu.style.setProperty(`--el-color-primary-light-${i}`, `color-mix(in srgb, ${val}, white ${i*10}%)`);
        docu.style.setProperty(`--el-color-primary-dark-${i}`, `color-mix(in srgb, ${val}, black ${20}%)`);  
     }
    }
}

/**
 * @descrition 操作指定的dom元素的左移和右移动
 * @param prev -IconInstance 实例
 * @param next - IconInstance 实例
 * @param srcollBar -scrollbar 实例类型
 */
export const seetMoveRouteTag = function (prev: IconInstance, next: IconInstance, srcollBar: ScrollbarInstance) {
    nextTick(() => {
        let number = 0;
        prev && prev.$el.addEventListener('click', () => {
            number = number - 50 > 0 ? number - 50 : 0;
            srcollBar.setScrollLeft(number);
            srcollBar.update();
        });

        next && next.$el.addEventListener("click", () => {
            number = number + 50 > 0 ? number + 50 : 0;
            srcollBar.setScrollLeft(number);
            srcollBar.update();
        })
    })
}

