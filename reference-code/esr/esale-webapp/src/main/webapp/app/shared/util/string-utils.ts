import { translate, Storage, TranslatorContext } from 'react-jhipster';
import jwtDecode from 'jwt-decode';
import { AUTH_TOKEN_KEY, USER_FORMAT_DATE_KEY, APP_DATE_FORMAT } from 'app/config/constants';
import { AvatarColor } from '../layout/common/suggestion/constants';
import _ from 'lodash';
import React from 'react';
import { DEFINE_FIELD_TYPE } from '../layout/dynamic-form/constants';
import { utcToTz, DATE_TIME_FORMAT, timeUtcToTz, formatDate } from './date-utils';
import { languageCode } from 'app/config/language-code';

const FORMAT_DATE = Storage.session.get(USER_FORMAT_DATE_KEY, APP_DATE_FORMAT);

const snakeCaseToCamelCase = input => {
  return _.camelCase(input);
  // return (input ? input.toString() : '')
  //   .split('_')
  //   .reduce((res, word, i) => (i === 0 ? word.toLowerCase() : `${res}${word.charAt(0).toUpperCase()}${word.substr(1).toLowerCase()}`), '');
};

const camelCaseToSnakeCase = input => {
  return _.snakeCase(input);
  // return input.replace(/([A-Z])/g, '_$1').toLowerCase();
};

const equalPropertyName = (fieldName1: string, fieldName2) => {
  return _.isEqual(_.camelCase(fieldName1), _.camelCase(fieldName2));
};

const equalProperties = (obj1: any, obj2: any, prop) => {
  if ((!obj1 && !obj2) || (obj1 && !obj2) || (!obj1 && obj2)) {
    return false;
  }
  let prop1 = null;
  let prop2 = null;
  if (Object.prototype.hasOwnProperty.call(obj1, snakeCaseToCamelCase(prop))) {
    prop1 = obj1[snakeCaseToCamelCase(prop)];
  } else if (Object.prototype.hasOwnProperty.call(obj1, camelCaseToSnakeCase(prop))) {
    prop1 = obj1[camelCaseToSnakeCase(prop)];
  } else {
    prop1 = obj1[prop];
  }
  if (Object.prototype.hasOwnProperty.call(obj2, snakeCaseToCamelCase(prop))) {
    prop2 = obj2[snakeCaseToCamelCase(prop)];
  } else if (Object.prototype.hasOwnProperty.call(obj2, camelCaseToSnakeCase(prop))) {
    prop2 = obj2[camelCaseToSnakeCase(prop)];
  } else {
    prop2 = obj2[prop];
  }
  if ((prop1 === null || prop1 === undefined) && (prop2 === null || prop2 === undefined)) {
    return false;
  }
  return prop1.toString() === prop2.toString();
};

const getValuePropStr = (obj, prop) => {
  if (!obj || !prop) {
    return null;
  }
  let val = null;
  if (Object.prototype.hasOwnProperty.call(obj, snakeCaseToCamelCase(prop))) {
    val = obj[snakeCaseToCamelCase(prop)];
  } else if (Object.prototype.hasOwnProperty.call(obj, camelCaseToSnakeCase(prop))) {
    val = obj[camelCaseToSnakeCase(prop)];
  } else {
    val = obj[prop];
  }
  return val;
};

const format = (val: string, ...args) => {
  return val.replace(/((?:[^{}]|(?:\{\{)|(?:\}\}))+)|(?:\{([0-9]+)\})/g, (m, str, index) => {
    if (str) {
      return str.replace(/(?:{{)|(?:}})/g, m[0]);
    } else {
      if (index >= args.length) {
        return ''; // throw new Error('argument index is out of range in format');
      }
      return args[index];
    }
  });
};

const translateFmt = (key: string, ...args) => {
  const fmt = translate(key);
  return format(fmt, args);
};

const numberFormat = value => new Intl.NumberFormat().format(value);

const translateMsg = msg => {
  const codeRegex = /([_\-0-9a-z]*[.]){1,}[_\-0-9a-zA-Z]{1,}$/g;
  if (codeRegex.test(msg)) {
    return translate(msg);
  } else {
    return msg;
  }
};

const deepFindDirty = (obj, path, placeholder) => {
  const paths = path.split('.');
  let current = obj;
  if (placeholder) {
    // dirty fix for placeholders, the json files needs to be corrected
    paths[paths.length - 2] = paths[paths.length - 2] + '.' + paths[paths.length - 1];
    paths.pop();
  }
  for (let i = 0; i < paths.length; ++i) {
    if (current[paths[i]] === undefined) {
      return undefined;
    }
    current = current[paths[i]];
  }
  return current;
};

const isFlattenable = value => {
  const type = typeof value;
  return type === 'string' || type === 'number';
};

const flatten = array => {
  if (array.every(isFlattenable)) {
    return array.join('');
  }
  return array;
};
const toTemplate = string => {
  const expressionRe = /{{\s?\w+\s?}}/g;
  const match = string.match(expressionRe) || [];
  return [string.split(expressionRe)].concat(match);
};
const normalizeValue = (value, key) => {
  if (value == null || ['boolean', 'string', 'number'].includes(typeof value)) {
    return value;
  }
  if (value.$$typeof === Symbol.for('react.element')) {
    return React.cloneElement(value, { key });
  }
};

const renderTranslate = (string, values) => {
  if (!values || !string) return string;
  const _a = toTemplate(string),
    parts = _a[0],
    expressions = _a.slice(1);
  return flatten(
    parts.reduce(function(acc, item, index, array) {
      if (index === array.length - 1) {
        return acc.concat([item]);
      }
      const match = expressions[index] && expressions[index].match(/{{\s?(\w+)\s?}}/);
      const value = match != null ? values[match[1]] : null;
      return acc.concat([item, normalizeValue(value, index)]);
    }, [])
  );
};

const translateSpecial = (key, interpolate) => {
  const translationData = TranslatorContext.context.translations;
  const currentLocale = TranslatorContext.context.locale || TranslatorContext.context.defaultLocale;
  const data = translationData[currentLocale];

  // If there is no translation data, it means it hasn’t loaded yet, so return no content
  if (!Object.keys(translationData).length) {
    return {
      content: null
    };
  }
  const preRender = data ? _.get(data, key) || deepFindDirty(data, key, true) : null;
  const preSanitize = renderTranslate(preRender, interpolate);
  // if (/<[a-z][\s\S]*>/i.test(preSanitize)) {
  //   // String contains HTML tags. Allow only a super restricted set of tags and attributes
  //   const content = sanitizeHtml(preSanitize, {
  //     allowedTags: ['b', 'i', 'em', 'strong', 'a', 'br', 'hr', 'div', 'html'],
  //     allowedAttributes: {
  //       a: ['href', 'target']
  //     }
  //   });
  //   return content
  // }
  return preSanitize;
};

const emptyStringIfNull = val => {
  return val === undefined || val === null ? '' : val;
};

export const firstChar = str => {
  if (str && str.length > 0) {
    return str.substring(0, 1);
  }
  return '';
};

export const decodeUserLogin = () => {
  const jwt = Storage.local.get(AUTH_TOKEN_KEY) || Storage.session.get(AUTH_TOKEN_KEY);
  let jwtData = null;
  if (jwt) {
    jwtData = jwtDecode(jwt);
  }
  return jwtData;
};

export const getFieldLabel = (item, fieldLabel, language?: any) => {
  if (!item) {
    return '';
  }
  const priorityLangs = ['ja_jp', 'en_us', 'zh_cn'];
  try {
    const lang = Storage.session.get('locale', 'ja_jp');
    const labels = _.isString(item[fieldLabel]) ? JSON.parse(item[fieldLabel]) : item[fieldLabel];
    let retLabel = getValuePropStr(labels, lang);
    priorityLangs.forEach(pl => {
      if (!retLabel) {
        retLabel = getValuePropStr(labels, pl);
      }
    });
    return retLabel || '';
  } catch (error) {
    return item[fieldLabel] || '';
  }
};

export const escapeSpaceHtml = (str: string) => {
  if (!str) {
    return str;
  } else {
    return str.replace(/ /g, '\u00a0');
  }
};

export const getPlaceHolder = (fieldInfo, opt?) => {
  const fieldLabel = getFieldLabel(fieldInfo, 'fieldLabel');
  let msgCode = `dynamic-control.fieldTypePlaceholder.${fieldInfo.fieldType}`;
  if (opt) {
    msgCode += `_${opt}`;
  }
  return translateSpecial(msgCode, { fieldLabel });
};

export const replaceAll = (text, searchVal, replaceVal) => {
  if (_.isNil(text)) {
    return '';
  }
  if (_.isArray(searchVal)) {
    let returnText = _.cloneDeep(text);
    searchVal.forEach(search => {
      returnText = returnText.split(search).join(replaceVal);
    });
    return returnText;
  } else {
    return text.split(searchVal).join(replaceVal);
  }
};

const katakana = new Map([
  ['ｱ', 'ア'],
  ['ｲ', 'イ'],
  ['ｳ', 'ウ'],
  ['ｴ', 'エ'],
  ['ｵ', 'オ'],
  ['ｶ', 'カ'],
  ['ｷ', 'キ'],
  ['ｸ', 'ク'],
  ['ｹ', 'ケ'],
  ['ｺ', 'コ'],
  ['ｻ', 'サ'],
  ['ｼ', 'シ'],
  ['ｽ', 'ス'],
  ['ｾ', 'セ'],
  ['ｿ', 'ソ'],
  ['ﾀ', 'タ'],
  ['ﾁ', 'チ'],
  ['ﾂ', 'ツ'],
  ['ﾃ', 'テ'],
  ['ﾄ', 'ト'],
  ['ﾅ', 'ナ'],
  ['ﾆ', 'ニ'],
  ['ﾇ', 'ヌ'],
  ['ﾈ', 'ネ'],
  ['ﾉ', 'ノ'],
  ['ﾊ', 'ハ'],
  ['ﾋ', 'ヒ'],
  ['ﾌ', 'フ'],
  ['ﾍ', 'ヘ'],
  ['ﾎ', 'ホ'],
  ['ﾏ', 'マ'],
  ['ﾐ', 'ミ'],
  ['ﾑ', 'ム'],
  ['ﾒ', 'メ'],
  ['ﾓ', 'モ'],
  ['ﾔ', 'ヤ'],
  ['ﾕ', 'ユ'],
  ['ﾖ', 'ヨ'],
  ['ﾗ', 'ラ'],
  ['ﾘ', 'リ'],
  ['ﾙ', 'ル'],
  ['ﾚ', 'レ'],
  ['ﾛ', 'ロ'],
  ['ﾜ', 'ワ'],
  ['ｦ', 'ヲ'],
  ['ﾝ', 'ン'],
  ['ｧ', 'ァ'],
  ['ｨ', 'ィ'],
  ['ｩ', 'ゥ'],
  ['ｪ', 'ェ'],
  ['ｫ', 'ォ'],
  ['ｯ', 'ッ'],
  ['ｬ', 'ャ'],
  ['ｭ', 'ュ'],
  ['ｮ', 'ョ'],
  ['ｶﾞ', 'ガ'],
  ['ｷﾞ', 'ギ'],
  ['ｸﾞ', 'グ'],
  ['ｹﾞ', 'ゲ'],
  ['ｺﾞ', 'ゴ'],
  ['ｻﾞ', 'ザ'],
  ['ｼﾞ', 'ジ'],
  ['ｽﾞ', 'ズ'],
  ['ｾﾞ', 'ゼ'],
  ['ｿﾞ', 'ゾ'],
  ['ﾀﾞ', 'ダ'],
  ['ﾁﾞ', 'ヂ'],
  ['ﾂﾞ', 'ヅ'],
  ['ﾃﾞ', 'デ'],
  ['ﾄﾞ', 'ド'],
  ['ﾊﾞ', 'バ'],
  ['ﾋﾞ', 'ビ'],
  ['ﾌﾞ', 'ブ'],
  ['ﾍﾞ', 'ベ'],
  ['ﾎﾞ', 'ボ'],
  ['ﾊﾟ', 'パ'],
  ['ﾋﾟ', 'ピ'],
  ['ﾌﾟ', 'プ'],
  ['ﾍﾟ', 'ペ'],
  ['ﾎﾟ', 'ポ'],
  ['ｳﾞ', 'ヴ'],
  ['ﾜﾞ', 'ヷ'],
  ['ｦﾞ', 'ヺ'],
  ['－', '-'],
  ['０', '0'],
  ['１', '1'],
  ['２', '2'],
  ['３', '3'],
  ['４', '4'],
  ['５', '5'],
  ['６', '6'],
  ['７', '7'],
  ['８', '8'],
  ['９', '9'],
  ['A', 'A'],
  ['Ａ', 'A'],
  ['Ｂ', 'B'],
  ['Ｃ', 'C'],
  ['Ｄ', 'D'],
  ['Ｅ', 'E'],
  ['Ｆ', 'F'],
  ['Ｇ', 'G'],
  ['Ｈ', 'H'],
  ['Ｉ', 'I'],
  ['Ｊ', 'J'],
  ['Ｋ', 'K'],
  ['Ｌ', 'L'],
  ['Ｍ', 'M'],
  ['Ｎ', 'N'],
  ['Ｏ', 'O'],
  ['Ｐ', 'P'],
  ['Ｑ', 'Q'],
  ['Ｒ', 'R'],
  ['Ｓ', 'S'],
  ['Ｔ', 'T'],
  ['Ｕ', 'U'],
  ['Ｖ', 'V'],
  ['Ｗ', 'W'],
  ['Ｘ', 'X'],
  ['Ｙ', 'Y'],
  ['Ｚ', 'Z'],
  ['ａ', 'a'],
  ['ｂ', 'b'],
  ['ｃ', 'c'],
  ['ｄ', 'd'],
  ['ｅ', 'e'],
  ['ｆ', 'f'],
  ['ｇ', 'g'],
  ['ｈ', 'h'],
  ['ｉ', 'i'],
  ['ｊ', 'j'],
  ['ｋ', 'k'],
  ['ｌ', 'l'],
  ['ｍ', 'm'],
  ['ｎ', 'n'],
  ['ｏ', 'o'],
  ['ｐ', 'p'],
  ['ｑ', 'q'],
  ['ｒ', 'r'],
  ['ｓ', 's'],
  ['ｔ', 't'],
  ['ｕ', 'u'],
  ['ｖ', 'v'],
  ['ｗ', 'w'],
  ['ｘ', 'x'],
  ['ｙ', 'y'],
  ['ｚ', 'z']
]);

export const toKatakana = (inputString: string) => {
  if (!inputString) {
    return inputString;
  }
  return _.trim(inputString)
    .split('')
    .map(key => katakana.get(key) || key)
    .join('');
};

export const commaFormatted = (amount: string) => {
  const delimiter = ','; // replace comma if desired
  let numberParts = amount.split('.', 2);
  const decimalPart = numberParts.length > 1 ? numberParts[1] : '';
  const integerPart = +toKatakana(numberParts[0]);

  if (isNaN(integerPart)) {
    return '';
  }
  let minus = '';
  if (integerPart < 0) {
    minus = '-';
  }
  // integerPart = Math.abs(integerPart);
  let n = numberParts[0]
    .toString()
    .replace('-', '')
    .replace('+', '');
  if (integerPart === 0) {
    n = '0';
  }
  numberParts = [];
  while (n.length > 3) {
    const nn = n.substr(n.length - 3);
    numberParts.unshift(nn);
    n = n.substr(0, n.length - 3);
  }
  if (n.length > 0) {
    numberParts.unshift(n);
  }
  n = numberParts.join(delimiter);
  if (decimalPart.length < 1) {
    amount = n;
  } else {
    amount = n + '.' + decimalPart;
  }
  amount = minus + amount;
  return amount;
};

const checkNumberAfterDot = (strValue: string, decimalPlace: number) => {
  if (strValue.substring(strValue.indexOf('.') + 1).length < decimalPlace) {
    return false;
  }
  return true;
};

// export const convertDot = (number: string) => {
//   try {
//     return replaceAll(number, '．', '.');
//   } catch {
//     return number;
//   }
// };

export const autoFormatNumber = (number: string, placePointer: number) => {
  try {
    let strValue = replaceAll(number, ',', '');
    while (strValue.startsWith('0') && strValue !== '0') {
      strValue = strValue.substr(1);
    }
    if (!strValue || strValue.trim().length < 1) {
      return '';
    }
    if (_.isEqual('.', strValue)) {
      return '';
    }
    let retDecimalPlace = strValue;
    const decimalPlace = _.isNil(placePointer) ? 0 : placePointer;
    if (!_.isNil(decimalPlace) && decimalPlace > 0) {
      if (!retDecimalPlace.includes('.')) {
        retDecimalPlace += '.';
      }
      while (!checkNumberAfterDot(retDecimalPlace, decimalPlace)) {
        retDecimalPlace += '0';
      }
    }
    let ret = replaceAll(retDecimalPlace, ',', '').trim();
    if (ret.startsWith('.')) {
      ret = '0' + ret;
    }
    if (ret.length > 17) {
      ret = ret.slice(0, 17);
    }
    if (ret.indexOf('.') >= 0) {
      const stringNumberAfterDot = ret.slice(ret.indexOf('.') + 1, ret.length);
      const stringNumberBeforeDot = ret.slice(0, ret.indexOf('.'));
      if (stringNumberAfterDot.length > decimalPlace) {
        const suffix = stringNumberAfterDot.substr(0, decimalPlace);
        ret = stringNumberBeforeDot + '.' + suffix;
      }
      if (ret.lastIndexOf('.')) {
        ret.replace('.', '');
      }
    }
    ret = commaFormatted(ret);
    return ret;
  } catch {
    return number;
  }
};

export const findErrorMessage = (errorInfos, itemName) => {
  if (!errorInfos) {
    return null;
  }
  let msg = null;
  // for detai setting filed
  if (Array.isArray(errorInfos)) {
    for (let i = 0; i < errorInfos.length; i++) {
      if (errorInfos[i].item === itemName) {
        msg = errorInfos[i].errorMsg;
        break;
      }
    }
  }
  return msg;
};

export const getErrorMessage = errorInfos => {
  if (!errorInfos) {
    return null;
  }
  let msg = null;
  if (errorInfos.errorCode) {
    const errorParams = errorInfos.errorParams ? errorInfos.errorParams : null;
    msg = translate(`messages.${errorInfos.errorCode}`, errorParams);
  } else if (errorInfos.errorMsg) {
    msg = errorInfos.errorMsg;
  }
  return msg;
};

export const forceArray = (val, defaultVal = []) => {
  try {
    if (_.isNil(val)) {
      return defaultVal;
    }
    if (_.isArray(val)) {
      return val;
    }
    const arr = _.isString(val) ? JSON.parse(val) : val;
    if (_.isArray(arr)) {
      return arr;
    } else {
      return defaultVal;
    }
  } catch (e) {
    return defaultVal;
  }
};

export const toArray = (val, defaultVal = []) => {
  try {
    if (_.isNil(val)) {
      return defaultVal;
    }
    if (_.isArray(val)) {
      return val;
    }
    const arr = _.isString(val) ? JSON.parse(val) : val;
    if (_.isArray(arr)) {
      return arr;
    } else {
      return [val];
    }
  } catch (e) {
    return defaultVal;
  }
};

const escapeHtml = unsafe => {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

const URL_REGEX = new RegExp(
  "((?:http(s)?|ftp):\\/\\/)(([\\w.-]+(?:\\.[\\w\\.-]+)+)|localhost)[\\w\\-\\._~:/?#\\[\\]@!\\$&'\\(\\)\\*\\+,;=.]+",
  'g'
);

const URL_LOCAL_REGEX = new RegExp('^(?:\\.{1,2})?(?:\\/\\.{1,2})*(\\/[a-zA-Z0-9.]+)+', 'g');

export const urlify = text => {
  if (_.isNil(text)) {
    return '';
  }
  return escapeHtml(text).replace(URL_REGEX, url => {
    return '<a target="_blank" href="' + url + '">' + url + '</a>';
  });
  // or alternatively
  // return text.replace(urlRegex, '<a href="$1">$1</a>')
};

export const isUrlify = text => {
  if (_.isNil(text)) {
    return false;
  }
  return text.search(URL_REGEX) !== -1 || text.search(URL_LOCAL_REGEX) !== -1;
};

export const trimCharNSpace = (string, charToRemove) => {
  while (string.charAt(0) === charToRemove || string.charAt(0) === ' ') {
    string = string.substring(1);
  }

  while (
    string.charAt(string.length - 1) === charToRemove ||
    string.charAt(string.length - 1) === ' '
  ) {
    string = string.substring(0, string.length - 1);
  }
  return string;
};

/**
 * Sort a array obj by key of obj.
 * @param key this is key of object
 * @param order asc or desc. Default : asc
 */
export const compareValues = (key, order = 'asc') => {
  return function(a, b) {
    // eslint-disable-next-line no-prototype-builtins
    if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
      return 0;
    }
    const varA = typeof a[key] === 'string' ? a[key].toUpperCase() : a[key];
    const varB = typeof b[key] === 'string' ? b[key].toUpperCase() : b[key];

    let comparison = 0;
    if (varA > varB) {
      comparison = 1;
    } else if (varA < varB) {
      comparison = -1;
    }
    return snakeCaseToCamelCase(order) === 'desc' ? comparison * -1 : comparison;
  };
};

/**
 * Group objects by attributes
 * @param objectArray Object Array need group.
 * @param property key need group
 */
export const groupByAttribute = (objectArray, property) => {
  return objectArray.reduce(function(acc, obj) {
    const key = obj[property];
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(obj);
    return acc;
  }, {});
};

export const jsonParse = (str, defaultVal = null) => {
  try {
    if (_.isNil(str)) {
      return defaultVal;
    }
    if (_.isObject(str)) {
      return str;
    }
    return JSON.parse(str);
  } catch {
    return defaultVal;
  }
};

export const tryGetAttribute = (obj: any, path: string, shouldCopy?: boolean) => {
  if (!path || !obj) {
    return obj;
  }
  let objCopy;
  if (shouldCopy) {
    objCopy = _.cloneDeep(obj);
  } else {
    objCopy = obj;
  }

  const pathArray = path.split('.');
  for (let index = 0; index < pathArray.length; index++) {
    const node = pathArray[index];
    objCopy = objCopy[node];
    if (!objCopy) {
      if (_.isNil(objCopy)) {
        return objCopy;
      } else {
        continue;
      }
    }
  }
  return objCopy;
};

export const parseErrorRespose = payload => {
  let errorMes = [];
  if (payload.response.data.parameters) {
    if (payload.response.data.parameters.message) {
      errorMes[0] = payload.response.data.parameters.message;
    } else if (payload.response.data.parameters.extensions) {
      const resError = payload.response.data.parameters.extensions;
      if (resError.errors) {
        errorMes = resError.errors;
      }
    }
  }
  return errorMes;
};

export const duplicateLable = (field1, field2) => {
  try {
    const labelFirst = _.isString(field1.fieldLabel)
      ? jsonParse(field1.fieldLabel)
      : field1.fieldLabel;
    const labelSecond = _.isString(field2.fieldLabel)
      ? jsonParse(field2.fieldLabel)
      : field2.fieldLabel;
    const langs = Object.keys(labelFirst);
    let dupLang = null;
    langs.forEach(lang => {
      const first = labelFirst[lang];
      const second = labelSecond[lang];
      if (
        !_.isEmpty(first) &&
        _.isEqual(first, second) &&
        !_.isEqual(field1.fieldId, field2.fieldId)
      ) {
        dupLang = lang;
      }
    });
    return dupLang;
  } catch {
    return null;
  }
};

export const getEmployeeImageUrl = emp => {
  return (
    _.get(emp, 'photoFileUrl') ||
    _.get(emp, 'employeeIcon.fileUrl') ||
    _.get(emp, 'fileUrl') ||
    _.get(emp, 'employeePhoto.filePath') ||
    _.get(emp, 'filePath') ||
    _.get(emp, 'photoFilePath') ||
    null
  );
};

/**
 * Get color image
 */
export const getColorImage = type => {
  if (!type || type.length === 0) {
    return AvatarColor[0];
  }
  return AvatarColor[type];
};

// export const parseJsonStr = val => {
//   if (_.isString(val)) {
//     return JSON.parse(val);
//   } else {
//     return val;
//   }
// };
import dateFnsParse from 'date-fns/parse';
import { getFullAddress } from './entity-utils';

export const getNumberFromDay = (value, flag?: string) => {
  const datNow = new Date();
  datNow.setHours(0, 0, 0, 0);
  const dateFirst = new Date(value);
  dateFirst.setHours(0, 0, 0, 0);
  const dateNowMoment = dateFnsParse(datNow, FORMAT_DATE).getTime();
  const dateFirstMoment = dateFnsParse(dateFirst, FORMAT_DATE).getTime();

  if (flag === 'M') {
    return ((dateNowMoment - dateFirstMoment) / (1000 * 60 * 60 * 24 * 30)).toFixed(0);
  }
  if (flag === 'Y') {
    return ((dateNowMoment - dateFirstMoment) / (1000 * 60 * 60 * 24 * 365)).toFixed(0);
  }
  return ((dateNowMoment - dateFirstMoment) / (1000 * 60 * 60 * 24)).toFixed(0);
};

export const getNumberToDay = (value, flag?: string) => {
  const datNow = new Date();
  const dateLast = new Date(value);
  datNow.setHours(0, 0, 0, 0);
  dateLast.setHours(0, 0, 0, 0);
  const dateNowMoment = dateFnsParse(datNow, FORMAT_DATE).getTime();
  const dateLastMoment = dateFnsParse(dateLast, FORMAT_DATE).getTime();
  if (flag === 'M') {
    return ((dateLastMoment - dateNowMoment) / (1000 * 60 * 60 * 24 * 30)).toFixed(0);
  }
  if (flag === 'Y') {
    return ((dateLastMoment - dateNowMoment) / (1000 * 60 * 60 * 24 * 365)).toFixed(0);
  }
  return ((dateLastMoment - dateNowMoment) / (1000 * 60 * 60 * 24)).toFixed(0);
};

export const parseDateDefault = valueFilterData => {
  if (_.isEmpty(valueFilterData)) {
    return;
  }
  const valueFilter = _.cloneDeep(valueFilterData);
  const valueFilterProps = _.isArray(valueFilter) ? valueFilter[0] : valueFilter;
  valueFilterProps.to = utcToTz(valueFilterProps.to, DATE_TIME_FORMAT.Database);
  valueFilterProps.from = utcToTz(valueFilterProps.from, DATE_TIME_FORMAT.Database);
  const valueFilterTime = {};

  if (valueFilterProps.from) {
    valueFilterTime['dayFrom'] = valueFilterProps.from.split(' ')[0];
    valueFilterTime['timeFrom'] = valueFilterProps.from.split(' ')[1]
      ? valueFilterProps.from.split(' ')[1].substring(0, 5)
      : valueFilterProps.from.split(' ')[0].substring(0, 5);
  }

  if (valueFilterProps.to) {
    valueFilterTime['dayTo'] = valueFilterProps.to.split(' ')[0];
    valueFilterTime['timeTo'] = valueFilterProps.to.split(' ')[1]
      ? valueFilterProps.to.split(' ')[1].substring(0, 5)
      : valueFilterProps.to.split(' ')[0].substring(0, 5);
  }

  if (valueFilterData.filterModeDate) {
    valueFilterTime['filterModeDate'] = valueFilterData.filterModeDate;
    valueFilterTime['dayFrom'] = valueFilterData.from;
    valueFilterTime['dayTo'] = valueFilterData.to;
  }
  return valueFilterTime;
};
export const getDisplayTextFromValue = (value, fieldType) => {
  if (!fieldType) {
    return value;
  }
  let displayText = value;
  const fieldTypeString = fieldType.toString();
  if (fieldTypeString === DEFINE_FIELD_TYPE.ADDRESS) {
    const parsed = jsonParse(value);
    if (parsed) {
      displayText = getFullAddress(parsed, null);
    }else{
      displayText = translate('dynamic-control.fieldDetail.layoutAddress.lable.postMark') + displayText;
    }
  } else if (fieldTypeString === DEFINE_FIELD_TYPE.DATE_TIME) {
    displayText = utcToTz(displayText, DATE_TIME_FORMAT.User);
  } else if (fieldTypeString === DEFINE_FIELD_TYPE.TIME) {
    displayText = timeUtcToTz(displayText);
  } else if (fieldTypeString === DEFINE_FIELD_TYPE.DATE) {
    displayText = formatDate(displayText);
  }
  return displayText;
};

export const isValidNumber = (strValue: string, decimalPlace?: number) => {
  if (!strValue || strValue.trim().length < 1) {
    return true;
  }
  if (strValue && strValue.trim().length > 17) {
    return false;
  }
  if (strValue.includes('.')) {
    if (strValue.includes('.', strValue.indexOf('.') + 1)) {
      return false;
    }
  }
  if (/,,/g.test(strValue)) {
    return false;
  }
  let strNumber = replaceAll(strValue, ',', '');
  if (strNumber.charAt(strNumber.length - 1) === '.') {
    strNumber = strNumber.substring(0, strNumber.length - 1);
  }
  if (decimalPlace && decimalPlace > 0) {
    return new RegExp(`^[-+]?\\d*\\.?\\d{0,${decimalPlace}}$`, 'g').test(strNumber);
  } else {
    return /^[-+]?\d*$/g.test(strNumber);
  }
};

export const getDefaultFieldLabel = (objFieldLabel: any) => {
  const lang = Storage.session.get('locale', 'ja_jp');
  const labels = [];
  if (!_.isNil(objFieldLabel)) {
    for (const prop in objFieldLabel) {
      if (Object.prototype.hasOwnProperty.call(objFieldLabel, prop)) {
        const el = {};
        el['code'] = prop;
        el['value'] = objFieldLabel[prop];
        el['default'] = true;
        const idx = languageCode.findIndex(e => e.code === prop);
        if (idx >= 0) {
          el['name'] = languageCode[idx].name;
        }
        labels.push(el);
      }
    }
  }
  if (labels.length < 1) {
    let name = '';
    const idx = languageCode.findIndex(e => e.code === lang);
    if (idx >= 0) {
      name = languageCode[idx].name;
    }
    labels.push({ code: lang, name, default: true, value: '' });
  }
  languageCode.forEach((e, i) => {
    const idx = labels.findIndex(o => o.code === e.code);
    if (idx < 0) {
      labels.push({ code: e.code, name: e.name, default: false, value: '' });
    }
  });

  const nativeIdx = labels.findIndex(e => e.code === lang);
  if (nativeIdx >= 0) {
    const nativeLabel = labels.splice(nativeIdx, 1)[0];
    labels.splice(0, 0, nativeLabel);
  }
  const priorityLangs = ['ja_jp', 'en_us', 'zh_cn'];
  const labelsTmp = [];
  labelsTmp[0] = labels[0];
  priorityLangs.forEach(item1 => {
    labels.forEach((item2, idx) => {
      if (item1 === item2['code'] && item1 !== lang) {
        labelsTmp.push(labels[idx]);
      }
    });
  });
  return labelsTmp;
};

export const removeNumericComma = val => {
  if (!val) {
    return val;
  }
  return val.toString().replace(/,/g, '');
};

export const tryParseJson = val => {
  let response = null;
  try {
    response = JSON.parse(val);
    return response;
  } catch {
    return {};
  }
};

export const getFullName = (surname, name) => {
  let fullName = '';
  if (surname) {
    fullName += surname;
  }
  if (name) {
    fullName += fullName.length > 0 ? ` ${name}` : `${name}`;
  }
  return fullName;
};

const StringUtils = {
  snakeCaseToCamelCase,
  camelCaseToSnakeCase,
  equalProperties,
  equalPropertyName,
  getValuePropStr,
  getFieldLabel,
  translateSpecial,
  translateFmt,
  translateMsg,
  format,
  escapeSpaceHtml,
  trimCharNSpace,
  emptyStringIfNull,
  numberFormat,
  compareValues,
  groupByAttribute,
  tryGetAttribute,
  parseErrorRespose,
  toKatakana,
  removeNumericComma,
  getFullName
};

export default StringUtils;
