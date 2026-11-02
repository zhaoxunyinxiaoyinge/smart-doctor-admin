export type DeepReadonly<T> = T extends Function
  ? T
  : T extends Array<infer U>
  ? ReadonlyArray<DeepReadonly<U>>
  : T extends object
  ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
  : T;

export type Flatten<T> = T extends Array<infer U> ? U : T;

export type Path<T, Prev extends string = ''> = T extends object
  ? {
      [K in keyof T & string]: Prev extends '' ? K : `${Prev}.${K}`
    }[keyof T & string]
  : '';

export type Simplify<T> = { [K in keyof T]: T[K] } & {};

export default {} as {
  DeepReadonly: DeepReadonly<any>;
  Flatten: Flatten<any>;
  Path: Path<any>;
  Simplify: Simplify<any>;
};
