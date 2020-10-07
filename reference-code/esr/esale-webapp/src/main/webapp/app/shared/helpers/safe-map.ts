import { curry, map, unless, isNil } from 'ramda';

export const safeMap = curry((func: Function, vals: any[]) => unless(isNil, map(func))(vals));
