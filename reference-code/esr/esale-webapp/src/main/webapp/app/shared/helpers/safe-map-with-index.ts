import { addIndex, map, unless, isNil, curry } from 'ramda';

export const safeMapWithIndex = curry((func: Function, vals: any[]) =>
  unless(isNil, addIndex(map)(func))(vals)
);
