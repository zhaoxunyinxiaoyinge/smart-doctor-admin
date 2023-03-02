import { requestConfig } from "headers";
import { name, list, test, height } from "@/typeings/module";
console.log(name);
console.log(test.age);

class Abumn {
    public setups(): void {
        console.log("测试");
    }
}

class Spn extends Abumn {
    public override setups(): void {
        console.log("测试");
    }
}
