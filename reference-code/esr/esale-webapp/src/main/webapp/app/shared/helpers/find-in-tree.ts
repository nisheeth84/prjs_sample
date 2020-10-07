import { curry } from 'ramda';

const findInTree = curry((isRight, getChildren, items) => {
  for (const item of items) {
    if (isRight(item)) {
      return item;
    } else {
      const foundItem = findInTree(isRight, getChildren, getChildren(item));
      if (foundItem) return foundItem;
    }
  }
});

export default findInTree;
