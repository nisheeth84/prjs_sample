import { compose } from 'ramda';
import { getTargetValue } from './get-target-value';

export const setStateByTargetValue = setFunc =>
  compose(
    setFunc,
    getTargetValue
  );
