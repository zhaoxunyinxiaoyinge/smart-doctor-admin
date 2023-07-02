import { describe, it,  } from "vitest";
import {copy} from "@/utils/common"
describe("table业务组件的测试", () => {
    it("复制粘贴", async () => {
      copy("div","这是复制粘贴的复制文本")
    })
})