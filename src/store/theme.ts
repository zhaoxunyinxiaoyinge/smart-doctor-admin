import { defineStore } from "pinia";
import { Component } from "vue";
import names from "./store.name";

const theme=defineStore(names.THEME,{
    state:()=>{
        return {
            layout:ref<Component>(),
            layoutName:ref<"vertical"|"classic"|"transverse"|"columns">('vertical'),
            themeColor:ref<string>("#409eff"),
            gray:ref<string>(''),
            isBrearum:ref<boolean>(true),
            tabbar:ref<boolean>(true),
            isFooter:ref<boolean>(true)
        }
    },

    actions:{
        setLayoutName(val:"vertical"|"classic"|"transverse"|"columns"){
            this.layoutName=val;
        }
    }
   
})

export {
    theme
}