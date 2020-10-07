import { __, compose, curry, prepend, map, flatten, unless, isNil } from 'ramda';

export const flattenWithCondition = curry((getChildren, items) =>
  compose(
    flatten,
    map(item =>
      compose(
        prepend(item),
        compose(
          unless(isNil, flattenWithCondition(getChildren)),
          getChildren
        )
      )(item)
    )
  )(items)
);
