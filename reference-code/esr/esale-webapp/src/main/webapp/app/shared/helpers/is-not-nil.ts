import { compose, not, isNil } from 'ramda';

export const isNotNil: (obj: any) => boolean = compose(
  not,
  isNil
);
