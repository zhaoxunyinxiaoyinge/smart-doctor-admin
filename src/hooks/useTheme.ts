import { number } from "echarts/core";
import { IconInstance, ScrollbarInstance } from "element-plus";

/**
 * 
 * @param val 颜色变量值
 * @return void
 */
export function setTheme(val: string): void {
    let docu: HTMLElement = document.documentElement as HTMLElement;
    docu.style.setProperty("--el-color-primary", val);
}

/**
 * @descrition 操作指定的dom元素的左移和右移动
 * @param prev -IconInstance 实例
 * @param next - IconInstance 实例
 * @param srcollBar -scrollbar 实例类型
 */
export const seetMoveRouteTag = function (prev: IconInstance, next: IconInstance, srcollBar: ScrollbarInstance) {
    nextTick(() => {
        let number=0;
        prev && prev.$el.addEventListener('click', () => {
            number=number-50>0?number-50:0;
            srcollBar.setScrollLeft(number);
            srcollBar.update();
        });

        next && next.$el.addEventListener("click", () => {
            number=number+50>0?number+50:0;
            srcollBar.setScrollLeft(number);
            srcollBar.update();
        })
    })
}