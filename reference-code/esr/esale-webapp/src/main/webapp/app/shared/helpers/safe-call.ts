import { __, apply, unless, isNil } from 'ramda';

export const safeCall = (func: Function) => (...args): any => unless(isNil, apply(__, args))(func);
