import { compose, curry, not } from 'ramda';

import { isInRange } from './is-in-range';

export const isOutRange = curry((min: number, max: number) => boolean =>
  compose(
    not,
    isInRange(min, max)
  )
);
