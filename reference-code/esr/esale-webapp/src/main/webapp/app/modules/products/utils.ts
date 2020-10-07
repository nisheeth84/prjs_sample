import { Storage } from 'react-jhipster';
import _ from 'lodash';
import { FIELD_TYPE } from './constants';
import StringUtils from 'app/shared/util/string-utils';

export const getJsonBName = fieldName => {
  const langCode = Storage.session.get('locale', 'ja_jp');
  const langDefault = ['en_us', 'zh_cn'];
  if (fieldName) {
    try {
      const objectName = JSON.parse(fieldName);
      return (
        objectName[langCode] ||
        objectName[langDefault[0]] ||
        objectName[langDefault[1]] ||
        fieldName
      );
    } catch (e) {
      return fieldName;
    }
  }
  return '';
};

export const isJsonString = strJson => {
  try {
    JSON.parse(strJson);
  } catch (e) {
    return false;
  }
  return true;
};

export const parseJson = (val, key) => {
  try {
    return JSON.parse(val)[key];
  } catch (e) {
    return val;
  }
};

// export const parseJsonStr = val => {
//   if (_.isString(val)) {
//     return JSON.parse(val);
//   } else {
//     return val;
//   }
// };

export const addDefaultLabel = label => {
  const labelDefault: any = {};
  labelDefault['ja_jp'] = label;
  labelDefault['en_us'] = label;
  labelDefault['zh_cn'] = label;
  return labelDefault;
};

const joinString = '|/x-';

export const convertHTMLEncString = (str: string): string => {
  return str && _.isString(str) ? str.split('').join(joinString) : '';
};

export const revertHTMLString = (str: string): string => {
  return str && _.isString(str) ? str.split(joinString).join('') : '';
};

export const handleFieldPreview = fieldPreview => {
  const resultFieldPreview = [];
  if (fieldPreview && fieldPreview.listField) {
    fieldPreview.listField.forEach(field => {
      if (!field.fieldItems) field.fieldItems = [];
      if (field.fieldLabel) resultFieldPreview.push(field);
    });
  }
  return { listField: resultFieldPreview, deleteFields: null };
};

export const handleDataAvailable = (product, fieldName) => {
  if (!product) return product;
  const productData = _.cloneDeep(product);
  if (productData[fieldName]) {
    productData[fieldName] = productData[fieldName].filter(el => {
      return el.availableFlag !== 0;
    });
    productData[fieldName] = productData[fieldName].sort((a, b) => {
      return a.fieldOrder - b.fieldOrder;
    });
  }

  return productData;
};

export const snakeProductField = product => {
  const productConvert = {};

  if (!product) {
    return productConvert;
  }
  for (const key in product) {
    if (_.isObject(product[key])) {
      productConvert[StringUtils.camelCaseToSnakeCase(key)] = product[key].value;
    } else {
      productConvert[StringUtils.camelCaseToSnakeCase(key)] = product[key];
    }
  }
  return productConvert;
};

export const getExtendfieldValue = (extendFieldList, fieldName) => {
  if (!extendFieldList) {
    return undefined;
  }
  let retField = null;
  extendFieldList.map(field => {
    if (
      field.key === fieldName &&
      field.fieldType === FIELD_TYPE.ADDRESS &&
      field.value === 'null'
    ) {
      const address = {};
      address['zip_code'] = '';
      address['building_name'] = '';
      address['address_name'] = '';
      address['address'] = '';
      retField = {
        fieldType: FIELD_TYPE.ADDRESS,
        key: field.key,
        value: JSON.stringify(address)
      };
    } else if (field.key === fieldName) {
      retField = field;
    }
  });
  if (retField) {
    return retField.value;
  }
  return undefined;
};

export const getCurrencyUnit = (fieldName, fieldsInfo: any[]) => {
  const name = StringUtils.camelCaseToSnakeCase(fieldName);
  if (_.isArray(fieldsInfo)) {
    const field = fieldsInfo.find(item => item.fieldName === name);
    return field && field.currencyUnit ? field.currencyUnit : '';
  }
  return '';
};
