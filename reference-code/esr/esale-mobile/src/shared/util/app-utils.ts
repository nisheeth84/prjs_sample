import {
  StatusBar,
  Platform,
  Dimensions,
  Clipboard,
  Alert,
} from 'react-native';
import { translate } from '../../config/i18n';
import { messages } from './message';
import { EnumLanguage } from '../../config/constants/enum-language';
import { SpaceLanguage } from '../../config/constants/space-language';
import { EnumFmDate } from '../../config/constants/enum-fm-date';
import { FieldInfoItem } from '../../config/constants/field-info-interface';
import { TYPE_UNIT } from '../../config/constants/constants';

/**
 * get format price
 * @param price
 * @param prefix
 */
export const getJapanPrice = (price: number, prefix = true, suffix = true) => {
  if (price == undefined) {
    return '';
  }

  let str = price.toString();

  if (str == '') {
    return '';
  }

  const length = 3;
  let result = '';
  while (str.length > length) {
    const start = str.length - length;
    const st1 = str.slice(start);
    str = str.slice(0, start);
    if (str.length > 0) {
      result = translate(messages.unitPriceDot) + st1 + result;
    }
  }

  if (str.length > 0) {
    result = str + result;
  }
  if (prefix) {
    result = translate(messages.unitPricePrefix) + result;
  }

  if (suffix) {
    result += translate(messages.unitPrice);
  }

  return result;
};

/**
 * check empty string
 * @param input
 */
export const checkEmptyString = (input: string) => {
  return input == undefined || input.length == 0;
};

/**
 * format date string
 * @param input
 */
export const formatDate = (input: string, format: string = "YYYY/MM/DD", useUtc: boolean = false) => {
  let moment = require("moment");

  if (checkEmptyString(input)) {
    return "";
  }

  let data = moment(input).format(format);
  if (useUtc) {
    data = moment(input).utc().format(format);
  }

  if (data == undefined || data == "Invalid date") {
    return "";
  }
  return data;
};

/**
 * handle empty string
 * @param input
 */
export const handleEmptyString = (input: string) => {
  return input == undefined || input.length <= 0 ? "" : input;
};

/**
 * get format date string
 * @param input
 */
export const getFormatDate = (input: string) => {
  const moment = require('moment');
  return moment(input, 'YYYY/DD/MM hh:mm').format('YYYY年MM月DD日');
};

/**
 * get category/product type format
 */
export const getCategoryFormat = (input: string) => {
  let categoryName;
  try {
    const productCategoryObject = JSON.parse(input);
    categoryName = productCategoryObject.ja_jp;
  } catch (error) {
    categoryName = input;
  }

  return categoryName;
};

export interface Change {
  new: any;
  old: any;
}

export interface ChangeHistory {
  id: number;
  name: string;
  change: Change;
}

export interface ParentChangeHistory {
  changeHistory: Array<ChangeHistory>;
  maxLength: number;
}

/**
 * get space language
 * @param language
 */
export const getSpaceLanguage = (
  language: EnumLanguage = EnumLanguage.japanese
) => {
  switch (language) {
    case EnumLanguage.japanese:
      return SpaceLanguage.spaceJP;
    case EnumLanguage.english:
      return SpaceLanguage.normalSpace;
    case EnumLanguage.vietnam:
      return SpaceLanguage.normalSpace;
    default:
      return SpaceLanguage.spaceJP;
  }
};

/**
 * get format data history
 * @param data , language
 */

export const formatDataHistory = (
  data: string,
  fieldInfoArray: Array<FieldInfoItem>,
  language: EnumLanguage = EnumLanguage.japanese
) => {
  let changeHistory: Array<ChangeHistory> = [];
  let maxLength = 0;
  let count = 0;
  data = JSON.parse(data);
  Object.entries(data).forEach((value: any) => {
    const fieldInfo = getFieldInfo(fieldInfoArray, value[0]);
    const name = getFieldLabelFormat(
      fieldInfo.fieldLabel ? fieldInfo.fieldLabel : '',
      language
    );
    if (name?.length > maxLength) {
      maxLength = name?.length;
    }
    changeHistory.push({
      id: count++,
      name,
      change: value[1],
    });
  });
  const space = getSpaceLanguage(language);
  changeHistory = changeHistory.map((value) => {
    const rpString = repeatString(space, maxLength - value?.name?.length);
    return {
      id: value?.id,
      name: value?.name + rpString,
      change: value?.change,
    };
  });
  const result: ParentChangeHistory = {
    changeHistory,
    maxLength,
  };
  return result;
};

/**
 * get status bar height
 */

export const getStatusBarHeight = () => {
  return Platform.OS === 'android' && StatusBar != undefined
    ? StatusBar.currentHeight
      ? -StatusBar.currentHeight
      : 0
    : 0;
};

/**
 * get screen width
 */
export const getScreenWidth = () => {
  return Dimensions.get('window').width;
};

/**
 * get screen height
 */
export const getScreenHeight = () => {
  return Dimensions.get('window').height;
};

/**
 * get field info
 * @param fieldInfoArray
 * @param fieldName
 */

export const getFieldInfo = (
  fieldInfoArray: Array<FieldInfoItem>,
  fieldName: string
) => {
  let result: FieldInfoItem = {
    fieldId: 0,
    fieldName,
    fieldLabel: fieldName,
    fieldType: 0,
    fieldOrder: 0,
  };
  fieldInfoArray.forEach((value) => {
    if (fieldName == value.fieldName) {
      result = value;
    }
  });
  return result;
};

/**
 * get field label format
 * @param input, language
 */

export const getFieldLabelFormat = (
  input: string,
  language: EnumLanguage = EnumLanguage.japanese
) => {
  let name;

  try {
    const inputObject = JSON.parse(input);
    switch (language) {
      case EnumLanguage.japanese:
        name = inputObject.ja_jp;
        break;
      case EnumLanguage.english:
        name = inputObject.en_us;
        break;
      default:
        name = inputObject.ja_jp;
        break;
    }
  } catch (error) {
    name = input;
  }

  return name;
};

/**
 * repeat string
 * @param c
 * @param count
 */
export const repeatString = (c: string, count: number) => {
  if (count < 0) {
    return '';
  }
  const str = new Array(count + 1).join(c);
  return str;
};

/**
 * get format date string
 * @param input
 */
export const getFormatDateTaskDetail = (
  input: string,
  format: EnumFmDate = EnumFmDate.YEAR_MONTH_DAY_JP
) => {
  const moment = require('moment');

  if (checkEmptyString(input)) {
    return '';
  }

  const data = moment(input).format(format);

  if (data == undefined || data == 'Invalid date') {
    return '';
  }
  return data;
};

/**
 * get week days
 * @param dayInput
 */

export const getWeekdays = (dayInput: string) => {
  if (dayInput == undefined) {
    return '';
  }

  const moment = require('moment');
  const dow = moment(dayInput, 'YYYY-MM-DD hh:mm:ss').day();

  switch (dow) {
    case 0:
      return translate(messages.sunday);
    case 1:
      return translate(messages.monday);
    case 2:
      return translate(messages.tuesday);
    case 3:
      return translate(messages.wednesday);
    case 4:
      return translate(messages.thursday);
    case 5:
      return translate(messages.friday);
    case 6:
      return translate(messages.saturday);
    default:
      return translate(messages.sunday);
  }
};

export const convertYearMonthDayToSeconds = (input: string) => {
  const inputDate = new Date(input);
  const date = new Date(
    inputDate.getFullYear(),
    inputDate.getMonth(),
    inputDate.getDate()
  );
  return date.getTime();
};

/**
 * check out of date
 * @param input
 */
export const checkOutOfDate = (input: string) => {
  const inputDate = convertYearMonthDayToSeconds(input);
  const today = convertYearMonthDayToSeconds(new Date().toDateString());

  return inputDate - today < 0;
};

/**
 * copy text to clipboard
 * @param input
 */

const DUMMY_URL = 'http://gateway-56161094.ap-northeast-1.elb.amazonaws.com';
const COPY_SUCCESS = 'The URL has been copied to the clipboard';

export const copyToClipboard = async (input: string) => {
  if (checkEmptyString(input)) {
    input = DUMMY_URL;
  }
  Clipboard.setString(input);
  Alert.alert(COPY_SUCCESS);
};

/**
 * get first
 */
export const getFirstItem = (arr: Array<any>) => {
  return (arr || []).length > 0 ? arr[0] : undefined;
};

/**
 * format input label
 * @param label
 * @param format
 */

export const formatLabel = (label: string, format = 'ja_jp') => {
  try {
    return JSON.parse(label)[format];
  } catch (error) {
    return label;
  }
};

/**
 * format japan price
 * @param price
 * @param currency
 * @param type
 */
export const formatJaPrice = (
  price: number,
  currency: string,
  type: number
) => {
  let result = '';
  let str = '0';
  if (price) {
    str = price.toString();
  }
  const length = 3;
  while (str.length > length) {
    const start = str.length - length;
    const st1 = str.slice(start);
    str = str.slice(0, start);
    if (str.length > 0) {
      result = translate(messages.unitPriceDot) + st1 + result;
    }
  }

  if (str.length > 0) {
    result = str + result;
  }

  if (type === TYPE_UNIT.SUFFIX) {
    result += currency;
  } else {
    result = currency + result;
  }

  return result;
};
