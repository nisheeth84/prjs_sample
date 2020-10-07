import { TEXT_EMPTY } from './../../../config/constants/constants';
import moment from 'moment'
import { FieldInfo } from '../detail/activity-detail-reducer';
import { EnumLanguage } from '../../../config/constants/enum-language';
import { SpaceLanguage } from '../../../config/constants/space-language';
import _ from 'lodash';

const dateFormat = 'YYYY/MM/DD'
const timeFormat = 'HH:mm'

/**
 * Format string s
 * @param s
 */
export const JSON_STRINGIFY = (s: any) => {
  return JSON.stringify(typeof s === 'undefined' ? null : s).replace(/"(\w+)"\s*:/g, '$1:')
}

/**
 * Check value null
 * @param value 
 * @param valueDefault 
 */
const NVL_JSON = (value: any, valueDefault?: any) => {
  if (valueDefault === undefined) {
    valueDefault = null
  } else if (valueDefault instanceof Object || valueDefault instanceof Array) {
    valueDefault = JSON_STRINGIFY(valueDefault)
  }

  if (value === undefined) {
    value = valueDefault
  } else if (value instanceof Object || value instanceof Array) {
    value = JSON_STRINGIFY(value)
  }
  return value
}

/**
 * Clear response data
 */
export const clearResponseData = () => {
  return {
    activityId: null,
    success: null,
    successMessage: null,
    errorMessage: null,
    errorItems: {}
  }
}

export class CommonUtil {

  /**
   * NVL value
   * @param value 
   * @param valueDefault 
   */
  static NVL = (value: any, valueDefault?: any) => {
    return value === undefined ? (valueDefault === undefined ? null : JSON_STRINGIFY(valueDefault)) : JSON_STRINGIFY(value)
  }

  /**
   * Format to price
   * @param num 
   */
  static formatNumber(num: number) {
    if (num) {
      return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }
    return TEXT_EMPTY
  }
  /**
   * Get value properties
   * @param object 
   * @param properties 
   */
  static GET_VALUE_PROPERTIES = (object: any, properties: any) => {
    return NVL_JSON(object) ? NVL_JSON(object[properties]) : null
  }

  /**
   * Get array value properties
   * @param arrayObject 
   * @param properties 
   */
  static GET_ARRAY_VALUE_PROPERTIES = (arrayObject: any, properties: any) => {
    if (NVL_JSON(arrayObject) == null || !(arrayObject instanceof Array)) {
      return []
    }
    return arrayObject
      .filter(obj => CommonUtil.GET_VALUE_PROPERTIES(obj, properties))
      .map(obj => CommonUtil.GET_VALUE_PROPERTIES(obj, properties))
  }

  /**
   * To time
   * @param value 
   */
  static toTime = (value: any) => {
    if (value) {
      const date = moment.utc(value)
      return date.format(timeFormat)
    }
    return TEXT_EMPTY
  }

  /**
   * To timeStamp
   * @param date 
   * @param time 
   */
  static toTimeStamp = (date: any, time?: any) => {
    if (date && time) {
      return moment.utc(moment(date).format(dateFormat) + ' ' + time).format()
    }
    if (date) {
      return moment.utc(date).format()
    }
    return TEXT_EMPTY
  }

  /**
   * format Date to DateTime
   * @param date 
   * @param format 
   */
  static formatDateTime = (date: any, format?: string) => {
    if (date && format) {
      return moment(new Date(date)).format(format)
    }
    if (date) {
      return moment(new Date(date)).format("YYYY/MM/DD")
    }
    return TEXT_EMPTY
  }

  /**
   * Convert minutes to hour
   * @param minutes 
   */
  static convertMinutesToHHmm = (minutes: number) => {
    const m = minutes % 60
    const h = (minutes - m) / 60
    return h.toString() + ":" + (m < 10 ? "0" : TEXT_EMPTY) + m.toString()
  }

  /**
   *
  objectToFormData
  */
  static objectToFormData = (obj: any, rootName: any, ignoreList: any): FormData => {
    const formData = new FormData();

    const ignore = (root: any) => {
      return (
        Array.isArray(ignoreList) &&
        ignoreList.some(function (x) {
          return x === root;
        })
      );
    }

    /**
     * append data to form
     * @param data
     * @param root
     */
    const appendFormData = (data: any, root: any) => {
      if (!ignore(root)) {
        root = root || '';
        if (data instanceof File) {
          formData.append(root, data);
        } else if (Array.isArray(data)) {
          let index = 0;
          for (let i = 0; i < data.length; i++) {
            if (data[i] instanceof File) {
              appendFormData(data[i], root + '[' + index + ']');
              index++;
            } else {
              appendFormData(data[i], root + '[' + i + ']');
            }
          }
        } else if (data && typeof data === 'object') {
          for (const key in data) {
            if (_.has(data, key)) {
              if (root === '') {
                appendFormData(data[key], key);
              } else {
                appendFormData(data[key], root + '.' + key);
              }
            }
          }
        } else {
          if (data !== null && typeof data !== 'undefined') {
            formData.append(root, data);
          }
        }
      }
    }

    appendFormData(obj, rootName);
    return formData;
  }

  /**
   * convertData
   */
  static convertData = (data: any): any => {
    // console.log('convertData2');
    if (typeof data === typeof {}) {
      return CommonUtil.convertDataObject(data);
    } else if (typeof data === typeof []) {
      return CommonUtil.convertDataArray(data);
    }
    return data;
  }

  /**
   * convert To FormData multiPart request post
   */
  static convertFormFile = (dataPost: any): FormData => {
    const filteredData = CommonUtil.convertData(dataPost);
    const formData = CommonUtil.objectToFormData(filteredData, '', []);
    return formData;
  }

  /**
   * convertDataObject
   * param data
   */
  static convertDataObject = (data: any): {} => {
    if (data) {
      for (const key in data) {
        if (!(data[key] instanceof File)) {
          data[key] = CommonUtil.convertData(data[key]);
        }
      }
    }
    return data;
  }

  /**
   * convert data array
   * @param data
   */
  static convertDataArray = (data: Array<any>): Array<any> => {
    if (data && data.length > 0) {
      data.forEach((e, index) => {
        data[index] = CommonUtil.convertData(e);
      });
    }
    return data;
  }
}
export interface Change {
  new: any,
  old: any,
}

export interface ChangeHistory {
  id: number,
  name: string,
  change: Change,
}

export interface ParentChangeHistory {
  changeHistory: Array<ChangeHistory>,
  maxLength: number,
}

/**
 * get field info
 * @param fieldInfoArray 
 * @param fieldName 
 */

const getFieldInfo = (fieldInfoArray: Array<FieldInfo>, fieldName: string) => {
  let result: FieldInfo = {
    fieldId: 0,
    fieldName: fieldName,
    fieldLabel: fieldName,
    fieldType: 0,
    fieldOrder: 0,
    isDefault: 0,
    fieldItems: []
  };
  fieldInfoArray.forEach((value) => {
    if (fieldName == value.fieldName) {
      result = value;
      return;
    }
  });
  return result;
}

/**
 * get field label format
 * @param input, language 
 */

export const getFieldLabelFormat = (input: string, language: EnumLanguage = EnumLanguage.japanese) => {
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
}

/**
 * get space language
 * @param language 
 */
export const getSpaceLanguage = (language: EnumLanguage = EnumLanguage.japanese) => {
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
}

/**
 * repeat string
 * @param c 
 * @param count 
 */
export const repeatString = (c: string, count: number) => {
  if (count < 0) {
    return "";
  }
  let str = new Array(count + 1).join(c);
  return str;
}

/**
 * get format data history
 * @param data , language
 */

export const formatDataHistory = (data: string, fieldInfoArray: Array<FieldInfo>, language: EnumLanguage = EnumLanguage.japanese) => {
  let changeHistory: Array<ChangeHistory> = [];
  let maxLength = 0;
  let count = 0;
  data = JSON.parse(data);
  Object.entries(data).forEach((value: any) => {
    let fieldInfo = getFieldInfo(fieldInfoArray, value[0]);
    let name = getFieldLabelFormat(fieldInfo.fieldLabel, language);
    if (name?.length > maxLength) {
      maxLength = name?.length;
    }
    changeHistory.push({
      id: count++,
      name: name,
      change: value[1]
    });
  });
  let space = getSpaceLanguage(language);
  changeHistory = changeHistory.map((value) => {
    let rpString = repeatString(space, maxLength - value?.name?.length)
    return {
      id: value?.id,
      name: value?.name + rpString,
      change: value?.change
    }
  });
  let result: ParentChangeHistory = {
    changeHistory: changeHistory,
    maxLength: maxLength
  }
  return result
}

