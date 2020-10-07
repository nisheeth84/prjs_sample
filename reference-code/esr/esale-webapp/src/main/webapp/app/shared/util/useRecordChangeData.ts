import { useState, useEffect } from 'react';
import update from 'immutability-helper';
import * as R from 'ramda';

const useRecordChangeData = dep => {
  const updateData = (fieldId, value?) => (prevState = {}) => {
    return update(prevState, {
      [fieldId]: {
        $set: value
      }
    });
  };

  const [initState, setInitState] = useState({});
  const [changeState, setChangeState] = useState({});
  const [isEdit, setIsEdit] = useState<boolean>(false);

  useEffect(() => {
    if (dep) {
      setIsEdit(true);
    }
  }, [dep]);

  // useEffect(() => {
  //   console.log({ initState, changeState });
  // }, [initState, changeState]);

  const setDataChange = (
    // or file name if this is special case
    fieldId,
    value,
    isInit?
  ) => {
    if (isEdit && !isInit) {
      setChangeState(updateData(fieldId, value));
    } else {
      setInitState(updateData(fieldId, value));
    }
  };

  const omitStatusFromArr = R.tryCatch(R.omit('status'), (err, val) => val);

  const getDataChange = (newDataNeedConvert = changeState, oldDataNeedConvert = initState) => {
    const dataChange = {};

    Object.entries(newDataNeedConvert).forEach(([fieldId, newValue]: [string, any]) => {
      const oldValue = oldDataNeedConvert[fieldId];

      if (
        !R.equals(newValue, omitStatusFromArr(oldValue))
        //  && !R.isNil(newValue)
      ) {
        dataChange[fieldId] = {
          newValue,
          oldValue
        };
      }
    });

    return dataChange;
  };

  const resetDataChange = (fieldId?, value?) => {
    setChangeState({ [fieldId]: value });
  };

  return { getDataChange, setDataChange, resetDataChange };
};

export default useRecordChangeData;
