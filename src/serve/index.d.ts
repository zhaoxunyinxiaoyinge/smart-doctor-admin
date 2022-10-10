import { AxiosDefaults,HeadersDefaults} from "axios";

declare module Headers {
 export interface requestConfig extends AxiosDefaults {
    "X-Requested-With"?: string;
  }
 
}
