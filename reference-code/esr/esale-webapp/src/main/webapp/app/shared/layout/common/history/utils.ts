import { translate } from 'react-jhipster';
import { FIELD, LANGUAGE_LABEL, fieldType99 } from './constants';
import { getFieldLabel } from 'app/shared/util/string-utils';
import * as R from 'ramda';

export const convertTextArea = (text: string) => {
  try {
    const newText = text.replace(/\n/g, '<br />');
    return newText;
  } catch (error) {
    return '';
  }
};

export const renderEmptyData = data => {
  return data ? convertTextArea(data) : translate('products.detail.label.content.create');
};

export const getFieldLabeByLanguage = (key, fieldInfos = []) => {
  let fieldLabel = '';

  fieldInfos.forEach(item => {
    if (item.fieldName === key) {
      fieldLabel = getFieldLabel(item, 'fieldLabel');
    }
  });
  return fieldLabel;
};

const isArray = R.is(Array);
const isObj = R.is(Object);

const isEmptyData = value => {
  if (isArray(value)) {
    return value.length === 0;
  }

  if (isObj(value)) {
    const len = Object.keys(value).length;
    return len === 0;
  }

  return R.isNil(value) || value === '';
};

export const isEqualsOrBothEmpty = (oldValue, newValue) => {
  const isEquals = R.equals(oldValue, newValue);
  const isBothEmpty = isEmptyData(oldValue) && isEmptyData(newValue);

  return isEquals || isBothEmpty;
};

export const getTextIsDisplay = R.ifElse(
  value => value === true || value === 'true',
  () => translate('history.is_display.true'),
  () => translate('history.is_display.false')
);

export const findFieldInfo = (value, fieldInfos, prop = 'fieldName') =>
  R.tryCatch(
    R.compose(
      R.pick(['fieldId', 'fieldName', 'fieldLabel', 'fieldType', 'fieldOrder', 'fieldItems']),
      R.find(R.propEq(prop, value))
    ),
    () => null
  )(fieldInfos);

export const getValueFromSourceData = (valueDataChange: any, fieldInfo: any, sourceData: any) => {
  try {
    if (fieldInfo.fieldType !== 99) {
      throw new Error('Not fieldType 99 ');
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

    const fieldType99Corespond = findFieldInfo99(fieldType99);
    if (!fieldType99Corespond) {
      throw new Error('fieldType99Corespond not found');
    }

    if (!fieldType99Corespond.sourceProp) {
      if (fieldInfo.fieldName === 'is_display') {
        return {
          oldContent: getTextIsDisplay(valueDataChange.oldValue),
          newContent: getTextIsDisplay(valueDataChange.newValue)
        };
      }
      throw new Error('fieldType99Corespond has not sourceProp');
    }

    const listSourceData: any[] = sourceData[fieldType99Corespond.sourceProp];

    const oldData = findSingleValue(fieldType99Corespond.keyOfId, 'oldValue')(listSourceData);
    const newData = findSingleValue(fieldType99Corespond.keyOfId, 'newValue')(listSourceData);

    const oldText = getFieldLabel(oldData, fieldType99Corespond.keyOfValue);
    const newText = getFieldLabel(newData, fieldType99Corespond.keyOfValue);

    return {
      newContent: newText,
      oldContent: oldText
    };
  } catch (error) {
    return {
      oldContent: valueDataChange.oldValue,
      newContent: valueDataChange.newValue
    };
  }
};
