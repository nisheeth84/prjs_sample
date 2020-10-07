import _ from 'lodash';

const indexRef = (field, fieldInfos) => {
  return fieldInfos.findIndex(e => e.fieldId === field.fieldId);
};

export const fillLookupData = (val, fieldInfos, inputRefs, actionToast) => {
  const valueLookup = _.isArray(val) ? val : _.toArray(val);
  let isToast = false;
  valueLookup.forEach(e => {
    const idx = fieldInfos.findIndex(o => o.fieldId === e.fieldInfo.fieldId);
    if (idx >= 0) {
      const idxRef = indexRef(fieldInfos[idx], fieldInfos);
      if (
        inputRefs[idxRef] &&
        inputRefs[idxRef].current &&
        inputRefs[idxRef].current.setValueEdit
      ) {
        inputRefs[idxRef].current.setValueEdit(e.value);
        isToast = true;
      }
    }
  });
  if (isToast) {
    actionToast();
  }
};
