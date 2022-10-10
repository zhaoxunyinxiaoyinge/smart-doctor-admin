type list = {
  [index: string]: Array<Function>
};

type methods = {
  emit: (name: string) => void;
  on: (name: string,callback:Function) => void;
};

class Bus implements methods {
  list: list;
  constructor() {
    this.list = {};
  }
  
  emit(name: string, ...arg: Array<any>) {
    let eventNames = this.list[name]||[];
    eventNames.forEach((element) => {
      element.apply(this, arg);
    });
  }

  on(name: string, callback: Function) {
    let fn: Array<Function> = this.list[name] || [];
    fn.push(callback);
    this.list[name] = fn;
  }
}

export default new Bus();
