import { curry } from 'ramda';

import { getDepartmentId } from './get-department-id';
import { findDepartmenIndexById } from './find-departmen-index-by-id';

export const findDepartmentIndex = curry((department, departments) =>
  findDepartmenIndexById(getDepartmentId(department), departments)
);
