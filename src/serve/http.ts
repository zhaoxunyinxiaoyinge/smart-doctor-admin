
import { serve } from "./index";
interface Params {
  url: string;
  method: string;
  params: object;
}

export const getList = function (obj: Params) {
  return serve({
    url: obj.url,
    method: "get",
    params: obj.params,
  });
};
