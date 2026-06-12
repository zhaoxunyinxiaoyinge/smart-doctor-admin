import { Axios } from "axios";

declare module "axios" {
    type create=(config:any)=>AxiosInstance
        export  interface AxiosInstance{
        defaults: {
            timeout: number;
            responseType: string;
            headers: {
                post: {
                    'Content-Type': string;
                };
            };
            baseURL: string;
        }
        headers: {
            post: {
                'Content-Type': string;
            };
        };
        baseURL: string;
    }

  export   interface AxiosResponse  {
  code:number
}
}

