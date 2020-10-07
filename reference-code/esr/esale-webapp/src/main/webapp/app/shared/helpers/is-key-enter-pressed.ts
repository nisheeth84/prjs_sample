import { propEq, either } from 'ramda';

export const isKeyEnterPressed: (event: any) => boolean = either(
  propEq('keyCode', 13),
  propEq('charCode', 13)
);
