import { compose, findIndex, curry, equals } from 'ramda';

import { getDepartmentId } from './get-department-id';

export const findDepartmenIndexById = curry((departmentId, departments) =>
  findIndex(
    compose(
      equals(departmentId),
      getDepartmentId
    ),
    departments
  )
);
