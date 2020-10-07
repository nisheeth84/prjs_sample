import { cloneDeep, clone } from 'lodash';

export const changeOrder = <T = any>(sourceIndex: number, targetIndex: number, arr: T[]) => {
  const cloneArr = cloneDeep(arr);
  const cloneItem = clone(arr[sourceIndex]);
  if (sourceIndex === targetIndex) {
    return cloneArr;
  }

  // change order by index
  cloneArr.splice(sourceIndex, 1);
  cloneArr.splice(targetIndex, 0, cloneItem);

  return cloneArr;
};
