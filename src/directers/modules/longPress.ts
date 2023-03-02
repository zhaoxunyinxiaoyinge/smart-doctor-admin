import type { Directive, DirectiveBinding } from "vue";

const directer: Directive = {
    mounted(el: Element, binding: DirectiveBinding, vnode, prevVnode) {
        let timer: string | number | NodeJS.Timeout | null | undefined = null;

        if (typeof binding.value == 'function') {
            throw new Error("必须是函数");
        }
        const start = (e: any) => {
            if (e.button) {
                if (e.type == 'click' && e.button != 0) {
                    return
                }
            }

            if (timer == null) {
                timer = setTimeout(() => {
                    binding.value();
                }, 1000);
            }

        }

        const end = () => {
            if (timer != null) {
                clearTimeout(timer)
            }
        }

        el.addEventListener("start", start);
        el.addEventListener("touchend", end);
        el.addEventListener("touchcancel", end);
        el.addEventListener("mouseout", start)
    }
}

export {
    directer
}