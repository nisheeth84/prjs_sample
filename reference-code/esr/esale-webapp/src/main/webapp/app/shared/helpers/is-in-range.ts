import { curry, lt, gt, both } from 'ramda';

export const isInRange = curry((min: number, max: number): boolean => both(lt(min), gt(max)));
