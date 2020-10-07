import { propOr } from 'ramda';

export const getDepartments = propOr([], 'departments');
