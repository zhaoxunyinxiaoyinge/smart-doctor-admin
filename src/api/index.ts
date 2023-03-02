import { serve as request } from "@/serve/index";

export const logout = (): Promise<{ code: number, data: object, message: string }&any> => {
    return request({
        url: "/api/user/logout",
        method: "GET"
    })
}