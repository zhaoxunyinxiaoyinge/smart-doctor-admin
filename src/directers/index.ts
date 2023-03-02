import type { Directive, App } from "vue";
import { directer } from "./modules/longPress";
import { persssion } from "./modules/perssion";

const directers = {
    install: (app: App) => {
        app.directive("longPress", directer);
        app.directive("hasperssion", persssion)
    }
}

export {
    directers
}