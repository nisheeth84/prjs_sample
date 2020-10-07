import * as R from 'ramda';
import {
  FieldInfoType,
  arrFieldTypeToComponent,
  Categories,
  FieldType99,
  fieldType99
} from './constants';
import { jsonParse, getFieldLabel } from 'app/shared/util/string-utils';

export const findFieldInfo = (
  value,
  fieldInfos,
  prop: keyof FieldInfoType = 'fieldName'
): FieldInfoType =>
  R.tryCatch(
    R.compose(
      R.pick(['fieldId', 'fieldName', 'fieldLabel', 'fieldType', 'fieldOrder', 'fieldItems']),
      R.find(R.propEq(prop, value))
    ),
    () => null
  )(fieldInfos);

/**
 * @Params A string
 * @Flow: parse string A to json -> pick value of field address in json, if has error then return empty string
 */
export const getAddress = R.compose(
  R.prop('address'),
  jsonParse
);

export const findComponent = fieldType =>
  R.compose(
    R.prop('Component'),
    R.find(
      R.where({
        fieldTypes: R.includes(fieldType)
      })
    )
  )(arrFieldTypeToComponent);

export const isBool = R.is(Boolean);
export const isString = R.is(String);
export const isArray = R.is(Array);
export const isObject = R.is(Object);
export const isObjectExceptArray = val => R.and(R.not(isArray(val)), isObject(val));
export const isEqual = R.equals;

// {}, [], '' is null
export const isDataNull = (val: any): boolean => {
  if (R.isNil(val)) {
    return true;
  }
  if (isArray) {
    return val.length === 0;
  }

  if (isObjectExceptArray) {
    return isEqual(val, {});
  }

  if (isString) {
    const parseData = jsonParse(val, val);
    if (!isString(parseData)) {
      return isDataNull(parseData);
    }
    return val.length === 0;
  }

  return false;
};

export const isNumber = R.is(Number);
export const isArrayNumber = R.tryCatch(
  R.and(R.is(Array), arr => arr.every(isNumber)),
  (err, value) => false
);

export const getValuesFromFieldInfo = (itemIds, fieldInfo: FieldInfoType) => {
  const getValue = itemId =>
    R.compose(
      item => getFieldLabel(item, 'itemLabel'),
      R.find(R.whereEq({ itemId })),
      R.prop('fieldItems')
    )(fieldInfo);

  if (!fieldInfo.fieldItems || fieldInfo.fieldItems.length === 0) {
    return itemIds;
  }

  if (isNumber(itemIds) || itemIds === String(Number(itemIds))) {
    return getValue(Number(itemIds));
  }

  if (isArrayNumber(itemIds)) {
    return R.map(getValue, itemIds);
  }

  return itemIds;
};

export const getLinkData = ({ newValue, oldValue }) => {
  const newValueParsed = jsonParse(newValue);
  const oldValueParsed = jsonParse(oldValue);

  // avoid error camel case
  const keyUrlText = 'url_text';
  const keyUrlTarget = 'url_target';

  return {
    [keyUrlText]: {
      new: R.prop(keyUrlText, newValueParsed),
      old: R.prop(keyUrlText, oldValueParsed)
    },
    [keyUrlTarget]: {
      new: R.prop(keyUrlTarget, newValueParsed),
      old: R.prop(keyUrlTarget, oldValueParsed)
    }
  };
};

const getFileData = ({ newValue, oldValue }) => {
  // avoid error camel case
  const keyFileName = 'file_name';
  const fileFilterDeleted = newValue.filter(_item => _item.status !== 1);

  const getFileDataByFieldName = R.tryCatch(
    newOrOldValueNeedConvert =>
      R.pluck(keyFileName, jsonParse(newOrOldValueNeedConvert, newOrOldValueNeedConvert)),
    R.always('')
  );

  return {
    [keyFileName]: {
      new: getFileDataByFieldName(fileFilterDeleted),
      old: getFileDataByFieldName(oldValue)
    }
  };
};

const getValueFromSourceData = (valueDataChange, fieldInfo: FieldInfoType, sourceData) => {
  if (fieldInfo.fieldName === 'is_display') {
    return { new: valueDataChange.newValue, old: valueDataChange.oldValue };
  }

  if (
    !valueDataChange.oldValue &&
    !valueDataChange.newValue &&
    !R.is(Boolean, valueDataChange.newValue)
  ) {
    throw new Error('data null');
  }
  const findFieldInfo99 = R.find(R.whereEq({ fieldName: fieldInfo.fieldName }));

  const findSingleValue = (keyOfId, oldOrNew) =>
    R.find(R.whereEq({ [keyOfId]: Number(valueDataChange[oldOrNew]) }));

  const fieldType99Corespond: FieldType99 = findFieldInfo99(fieldType99);
  if (!fieldType99Corespond) {
    throw new Error('fieldType99Corespond not found');
  }

  if (!fieldType99Corespond.sourceProp) {
    throw new Error('fieldType99Corespond has not sourceProp');
  }

  const listSourceData: any[] = sourceData[fieldType99Corespond.sourceProp];

  const oldData = findSingleValue(fieldType99Corespond.keyOfId, 'oldValue')(listSourceData);
  const newData = findSingleValue(fieldType99Corespond.keyOfId, 'newValue')(listSourceData);

  const oldTextData = getFieldLabel(oldData, fieldType99Corespond.keyOfValue);
  const newTextData = getFieldLabel(newData, fieldType99Corespond.keyOfValue);

  return {
    old: oldTextData,
    new: newTextData
  };
};

export const convertDataMessageConfirm = (
  fieldValue,
  fieldInfo: FieldInfoType,
  sourceData = {}
): any => {
  const { fieldType } = fieldInfo;

  try {
    switch (fieldType) {
      case Categories.file: {
        const fileData = getFileData(fieldValue);
        return fileData;
      }
      case Categories.link: {
        const linkData = getLinkData(fieldValue);
        return linkData;
      }
      case Categories.address: {
        const newAddress = getAddress(fieldValue.newValue);
        const oldAddress = getAddress(fieldValue.oldValue);
        return { new: newAddress, old: oldAddress };
      }
      // case Categories.organization: {
      //   const valueOrganization = getDataFromOrganizationArray(fieldValue);
      //   return valueOrganization;
      // }
      case Categories.special: {
        const valueFromSourceData = getValueFromSourceData(fieldValue, fieldInfo, sourceData);
        return valueFromSourceData;
      }
      default: {
        // if value is id then get data in fieldInfo.fieldItems, else return origin value
        const newValue = getValuesFromFieldInfo(fieldValue.newValue, fieldInfo);
        const oldValue = getValuesFromFieldInfo(fieldValue.oldValue, fieldInfo);
        return { new: newValue, old: oldValue };
      }
    }

    //
  } catch (error) {
    return { new: fieldValue.newValue || null, old: fieldValue.oldValue || null };
  }
};

export const convertTextArea = (text: string) => {
  try {
    const newText = String(text).replace(/\n/g, '<br />');
    return newText;
  } catch (error) {
    return '';
  }
};
