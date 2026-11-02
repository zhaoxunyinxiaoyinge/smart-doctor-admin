import { z } from 'zod';

export const UserSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  email: z.string().email(),
  age: z.number().int().min(0).optional(),
});

export type User = z.infer<typeof UserSchema>;

export function validateUser(input: unknown) {
  return UserSchema.safeParse(input);
}

export function parseUser(input: unknown): User {
  return UserSchema.parse(input);
}


export const nameSchema=z.object({
  username:z.string(),
  id:z.number().int()
})


//对类型执行强制转换
export const b=z.coerce.number();
 

export const s=z.literal('hello',{error:()=>'Expected the string to be "hello"'});

//创建一个注册表
const myRegistry = z.registry<{title: string}>();
const mySchema = z.string();
myRegistry.add(mySchema, { title: 'My String Schema' });
// myRegistry.add(mySchema)
myRegistry.has(mySchema); // true

console.log(myRegistry.get(mySchema)); // { title: 'My String Schema' }
myRegistry.clear();
console.log(myRegistry.has(mySchema)); // false
console.log(myRegistry.get(mySchema)); // undefined
console.log(myRegistry); // 0


//模式的形式注册一个元数据

const _mySchema2 = z.string().register(myRegistry, { title: 'My String Schema' });



