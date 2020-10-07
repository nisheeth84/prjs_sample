import { Storage } from 'react-jhipster';
import { DEFAULT_LANG_STATE, LANGUAGES } from './constant';
import _ from 'lodash';
import StringUtils from 'app/shared/util/string-utils';

// common methods
export const checkLang = (langs, positionsItem) => {
  if (positionsItem === null) {
    return JSON.stringify(langs) === JSON.stringify(DEFAULT_LANG_STATE);
  }
  const responseName = JSON.parse(positionsItem.positionName);
  const languages = Object.values(LANGUAGES);
  // sonar does not allow 'for of'
  for (let i = 0; i < languages.length; i++) {
    const v = languages[i];
    if (langs[v] !== responseName[v]) {
      return false;
    }
  }
  return true;
};

export const getObjName = fieldName => {
  const langCode = ['jaJp', 'enUS', 'zhCn'];
  if (fieldName) {
    try {
      return (
        fieldName[langCode[0]] || fieldName[langCode[1]] || fieldName[langCode[2]] || fieldName
      );
    } catch (e) {
      return fieldName;
    }
  }
  return '';
};
// helper methods
export function deepEqual(x: {}, y: {}) {
  if (x === y) return true;
  if (!(x instanceof Object) || !(y instanceof Object)) return false;
  if (x.constructor !== y.constructor) return false;
  const hasProp = (p1, p2) => Object.prototype.hasOwnProperty.call(p1, p2);
  for (const p in x) {
    if (!hasProp(x, p)) continue;
    if (!hasProp(y, p)) return false;
    if (x[p] === y[p]) continue;
    if (typeof x[p] !== 'object') return false;
    if (!deepEqual(x[p], y[p])) return false;
  }
  return true;
}

const getJsonData = fieldName => {
  const lang = Storage.session.get('locale', 'ja_jp');
  if (fieldName) {
    try {
      const objectName = JSON.parse(fieldName);
      const patternLangs = ['ja_jp', 'en_us', 'zh_cn'];
      return (
        objectName[lang] ||
        objectName[patternLangs[0]] ||
        objectName[patternLangs[1]] ||
        objectName[patternLangs[2]] ||
        fieldName
      );
    } catch (e) {
      return fieldName;
    }
  }
};

export const getJsonBName = fieldName => {
  return getJsonData(fieldName);
};

export const getJsonStringName = fieldName => {
  const data = getJsonData(fieldName);
  if (data) return data;
  else return '';
};

export const parseJsonB = fieldNameParse => {
  return getJsonData(fieldNameParse);
};

const isJsonString = strJson => {
  try {
    JSON.parse(strJson);
  } catch (e) {
    return false;
  }
  return true;
};

export const getJsonSetCategory = fieldNameCategory => {
  return getJsonData(fieldNameCategory);
};

export const parseJson = (val, key) => {
  try {
    return JSON.parse(val)[key];
  } catch (e) {
    return val;
  }
};

const joinString = '|/x-';

export const convertHTMLEncString = (str: string): string => {
  return str && _.isString(str) ? str.split('').join(joinString) : '';
};
