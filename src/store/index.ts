import { defineStore } from "pinia";
import names from "./store.name";
import { getList } from "./../serve/http";
import type { RootObject } from "./place";

export const mainStore = defineStore(names.TEST, {
  // state 类似组件的data选项，函数形式返回对象,原状态设置时一个对象
  state: () => {
    return {
      msg: <string>"hello world!",
      counter: <number>156,
      list: <RootObject>{},
    };
  },
  // getters可以相互调用
  getters: {
    getCounter(): string {
      this.getMsg;
      return this.counter + "" + this.getMsg;
    },

    getMsg(): string {
      return this.msg;
    },
  },

  // 同步和异步操作在里面
  // actions也可以相互调用
  actions: {
    setCouner(val: number): any {
      this.counter = val;
      this.setMsg();
    },

    setMsg() {
      this.msg = "你好世界";
    },

    async getXinGuan() {
      let res = await getList({
        url: "/lookDoctor/g2/getOnsInfo?name=disease_h5",
        method: "get",
        params: {},
      });
      this.list=JSON.parse(res.data.data);
      console.log(this.list)
    },
  },
});
