import { MockMethod } from "vite-plugin-mock";
const config: Array<MockMethod> = [{
    url: '/api/table/list',
    method: 'post',
    statusCode: 0,
    response: function (this: any, _opt: any) {
        return {
            code: 1,
            data: {
                'list|20': [
                    {
                        'id|+1': 1,
                        "user_name": "@cname",
                        "age": "@natural(20,60)",
                        "grade|1": ["高中", "大专", "本科", "教授"],
                        "sex|1": ['男', '女'],
                    }
                ],
                total: 100,
                pageSize: 20
            }
        }
    }
}
]


export {
    config
}
