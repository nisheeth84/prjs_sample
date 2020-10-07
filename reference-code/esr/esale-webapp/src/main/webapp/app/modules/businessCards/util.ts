import { Storage } from 'react-jhipster';
import StringUtils from 'app/shared/util/string-utils';
import _ from 'lodash';
import { APP_DATE_FORMAT, USER_FORMAT_DATE_KEY } from 'app/config/constants';
import moment from 'moment';

export const getJsonStringName = fieldName => {
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
      const mtpFieldName = fieldName.replace(/{|}/g, '').split(',');
      let objectName = {};
      mtpFieldName.forEach(item => {
        const arrCheck = item.trim().split(':');
        const key = arrCheck[0].trim().slice(1, arrCheck[0].length - 1);
        const value = arrCheck[1].trim().slice(1, arrCheck[1].length - 2);
        objectName = { ...objectName, [key]: value };
      });
      return (
        objectName[langCode] ||
        objectName[langDefault[0]] ||
        objectName[langDefault[1]] ||
        fieldName
      );
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

export const snakeBusinessCardField = businessCard => {
  const businessCardConvert = {};
  if (!businessCard) {
    return businessCardConvert;
  }
  for (const key in businessCard) {
    if (_.isObject(businessCard[key])) {
      businessCardConvert[StringUtils.camelCaseToSnakeCase(key)] = businessCard[key].value;
    } else {
      businessCardConvert[StringUtils.camelCaseToSnakeCase(key)] = businessCard[key];
    }
  }
  return businessCardConvert;
};

export const convertDateToUserFormat = date => {
  const userFormat = Storage.session.get(USER_FORMAT_DATE_KEY, APP_DATE_FORMAT);
  return date
    ? moment
        .utc(date)
        .local(true)
        .format(userFormat)
    : '';
};


export const isNullAllPropertyObject = (objData) => {
  if (!_.isObject(objData)) {
    return false;
  }
  for (const key in objData) {
    if (objData[key] !== null && objData[key] !== "" && objData[key] !== undefined) {
      return false;
    }
  }
  return true;
}
