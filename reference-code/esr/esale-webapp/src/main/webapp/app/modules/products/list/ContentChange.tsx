import React from 'react';
import {
  findComponent,
  convertDataMessageConfirm,
  findFieldInfo,
  isDataNull,
  isEqual
} from '../components/MessageConfirm/util';
import { jsonParse } from 'app/shared/util/string-utils';

const ContentChange = ({ fieldInfos, ...props }) => {
  const Component = findComponent(props.fieldType);
  const fieldInfo = findFieldInfo(props.fieldName, fieldInfos);
  // const newValue = getValuesFromFieldInfo(jsonParse(props.newValue,props.newValue), fieldInfo);
  // const oldValue = getValuesFromFieldInfo(jsonParse(props.oldValue,props.oldValue), fieldInfo);
  if (isDataNull(props.newValue) && isDataNull(props.oldValue)) {
    return <></>;
  }

  if (isEqual(props.newValue, props.oldValue)) {
    return <></>;
  }
  const valueChanged = convertDataMessageConfirm(
    {
      newValue: jsonParse(props.newValue, props.newValue),
      oldValue: jsonParse(props.oldValue, props.oldValue)
    },
    fieldInfo
  );

  if(!Component){
    return <></>
  }

  return (
    <Component {...props} {...valueChanged} fieldInfo={fieldInfo} isModalConfirm />
  );
};

export default ContentChange;
