import { expectType } from 'tsd';
import { DeepReadonly, Flatten, Path, Simplify } from '..';

type Obj = { a: { b: number[] }; c: string };

// DeepReadonly
type DR = DeepReadonly<Obj>;
expectType<readonly number[]>([] as any as DR['a']['b']);

// Flatten
type F = Flatten<number[]>;
expectType<number>(0 as F);

// Path
type P = Path<Obj>;
expectType<'a' | 'c'>(null as any as P);

// Simplify
type Complex = { a: number } & { b: string };
type S = Simplify<Complex>;
expectType<number>(null as any as S['a']);
