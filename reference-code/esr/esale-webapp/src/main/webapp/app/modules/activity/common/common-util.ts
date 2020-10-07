import { REQUEST, FAILURE, SUCCESS } from 'app/shared/reducers/action-type.util';
import moment from 'moment';
import { translate } from 'react-jhipster';
import { ActivityAction } from '../list/activity-list-reducer';
import { replaceAll, commaFormatted, forceArray } from 'app/shared/util/string-utils';
import {
  AUTH_TOKEN_KEY,
  USER_FORMAT_DATE_KEY,
  APP_DATE_FORMAT_ES,
  APP_DATE_FORMAT,
  AVAILABLE_FLAG
} from 'app/config/constants';
import jwtDecode from 'jwt-decode';
import { Storage } from 'react-jhipster';
import _ from 'lodash';
import { modeScreenType, convertFieldType } from 'app/shared/util/fieldType-utils';
import { DEFINE_FIELD_TYPE } from 'app/shared/layout/dynamic-form/constants';
import {
  getTimezone,
  utcToTz,
  timeUtcToTz,
  dateTimeToStringUserDateTimeFromat,
  dateTimeToStringUserDateFromat
} from 'app/shared/util/date-utils';
import { isNullOrUndefined } from 'util';

const dateFormat = 'YYYY/MM/DD';
const timeFormat = 'HH:mm';
const LIMIT = 30;

export const JSON_STRINGIFY = (s: any) => {
  return JSON.stringify(typeof s === 'undefined' ? null : s).replace(/"(\w+)"\s*:/g, '$1:');
};

const NVL_JSON = (value: any, valueDefault?: any) => {
  return value === undefined
    ? valueDefault === undefined
      ? null
      : valueDefault instanceof Object || valueDefault instanceof Array
      ? JSON_STRINGIFY(valueDefault)
      : valueDefault
    : value instanceof Object || value instanceof Array
    ? JSON_STRINGIFY(value)
    : value;
};

export const parseResponseData = (respData: any, messageSuccessCode?: string) => {
  const { errors = [] } = respData.data;
  const { message = '', extensions: { errors: errorArr = [] } = {} } = errors[0] || {};
  const activityId = respData.data || null;
  return {
    activityId,
    success: errors.length === 0,
    successMessage: messageSuccessCode ? messageSuccessCode : 'INFO_COM_0003',
    errorMessage: message,
    // errorItems: errorArr,
    errorItems: errorArr.reduce((carry, { item, errorCode }) => {
      carry[item] = translate(`messages.${errorCode}`);
      return carry;
    }, {})
  };
};

export const parseErrorResponse = payload => {
  let errorMes = [];
  let errorMessage = '';
  if (payload.response.data && payload.response.data.message) {
    errorMes[0] = payload.response.data.message;
  } else if (payload.response.data.parameters && payload.response.data.parameters.extensions) {
    const resError = payload.response.data.parameters.extensions;
    if (resError && resError.errors) {
      errorMes = resError.errors;
    } else if (resError) {
      errorMessage = translate('messages.ERR_COM_0001');
    }
  }
  return {
    errorItems: errorMes,
    errorMessage
  };
};

export const clearResponseData = () => {
  return {
    activityId: null,
    success: null,
    successMessage: null,
    errorMessage: null,
    errorItems: [],
    customerInfo: null
  };
};

export class CommonUtil {
  static excuteFunction = (type, state, action, failure, succces) => {
    switch (action.type) {
      case REQUEST(type):
        return {
          ...state,
          action: ActivityAction.Request
        };
      case FAILURE(type):
        if (failure) return failure();
        return {
          ...state,
          errorMessage: action.payload,
          suscessMessage: null,
          action: ActivityAction.Error
        };
      case SUCCESS(type):
        return succces();
      default:
        return null;
    }
  };

  static NVL = (value: any, valueDefault?: any) => {
    return value === undefined
      ? valueDefault === undefined
        ? null
        : JSON_STRINGIFY(valueDefault)
      : JSON_STRINGIFY(value);
  };

  static GET_VALUE_PROPERTIES = (object: any, propertie: any) => {
    return NVL_JSON(object) ? NVL_JSON(object[propertie]) : null;
  };

  static GET_ARRAY_VALUE_PROPERTIES = (arrayObject: any, propertie: any) => {
    if (NVL_JSON(arrayObject) == null || !(arrayObject instanceof Array)) {
      return [];
    }
    return arrayObject
      .filter(obj => CommonUtil.GET_VALUE_PROPERTIES(obj, propertie))
      .map(obj => CommonUtil.GET_VALUE_PROPERTIES(obj, propertie));
  };

  static GET_VALUE_PROPERTIES_EXTRA = (object: any, extarPropertie: any, propertie: any) => {
    return NVL_JSON(object) ? NVL_JSON(object[extarPropertie][propertie]) : null;
  };

  // static GET_ARRAY_VALUE_PROPERTIES_EXTRA = (arrayObject: any, extarPropertie: any, propertie: any) => {
  //   if (NVL_JSON(arrayObject) == null || !(arrayObject instanceof Array)) {
  //     return [];
  //   }
  //   return arrayObject
  //     .filter(obj => CommonUtil.GET_VALUE_PROPERTIES_EXTRA(obj, extarPropertie, propertie))
  //     .map(obj => CommonUtil.GET_VALUE_PROPERTIES_EXTRA(obj, extarPropertie, propertie));
  // };

  static toTime = (value: any) => {
    if (value) {
      const date = moment.utc(value);
      return date.format(timeFormat);
    } else {
      return '';
    }
  };

  static toTimeStamp = (date: any, time?: any) => {
    if (date && time) {
      return moment
        .utc(date + ' ' + timeUtcToTz(time), `${CommonUtil.getUseFormatDate()} HH:mm`)
        .format();
    } else if (date) {
      return moment.utc(date, CommonUtil.getUseFormatDate()).format();
    } else {
      return null;
    }
  };

  static autoFormatNumber = (strValue: string) => {
    try {
      while (strValue.startsWith('0') && strValue !== '0') {
        strValue = strValue.substr(1);
      }
      if (!strValue || strValue.trim().length < 1) {
        return '';
      }
      let ret = replaceAll(strValue, ',', '').trim();
      if (ret.startsWith('.')) {
        ret = '0' + ret;
      }
      return commaFormatted(ret);
    } catch {
      return strValue;
    }
  };

  static getUserLogin = () => {
    const jwt = Storage.local.get(AUTH_TOKEN_KEY) || Storage.session.get(AUTH_TOKEN_KEY);
    let empId = 0;
    if (jwt) {
      const jwtData = jwtDecode(jwt);
      empId = jwtData['custom:employee_id'];
    }
    return {
      employeeId: empId
    };
  };

  static getEmployeeId = () => {
    const employeeLogin = CommonUtil.getUserLogin();
    return Number(employeeLogin['employeeId']);
    // return 1; // fake data -> must change
  };

  static getUseFormatDate = () => {
    return Storage.session.get(USER_FORMAT_DATE_KEY, APP_DATE_FORMAT_ES) || APP_DATE_FORMAT;
  };

  /**
   * convert data array
   * @param data
   */
  public static convertDataArray(data: Array<any>): Array<any> {
    if (data && data.length > 0) {
      data.forEach((e, index) => {
        data[index] = CommonUtil.convertData(e);
      });
    }
    return data;
  }

  /**
   * convertDataObject
   * param data
   */
  public static convertDataObject(data: any): {} {
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
   * convertData
   */
  public static convertData(data: any): any {
    // console.log('convertData2');
    if (typeof data === typeof {}) {
      return CommonUtil.convertDataObject(data);
    } else if (typeof data === typeof []) {
      return CommonUtil.convertDataArray(data);
    }
    return data;
  }

  public static objectToFormData(obj, rootName, ignoreList): FormData {
    const formData = new FormData();

    function ignore(root) {
      return (
        Array.isArray(ignoreList) &&
        ignoreList.some(function(x) {
          return x === root;
        })
      );
    }

    /**
     * append data to form
     * @param data
     * @param root
     */
    function appendFormData(data, root) {
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
   * getFieldName
   * @param text
   */
  public static getFieldName(text: string) {
    if (text && text.length > 0) {
      const arr = text.split('.');
      if (arr && arr.length > 0 && arr[1]) {
        return arr[1];
      }
    }
    return text;
  }

  public static parseGetActivityResponse(action) {
    const response = action.payload.data;
    const tabListShow =
      response.tabInfo &&
      response.tabInfo.filter(tab => {
        return tab['isDisplay'] === true;
      });

    const activityDetail = response;
    activityDetail.fieldInfoActivity = convertFieldType(
      activityDetail.fieldInfoActivity || [],
      modeScreenType.typeDetail
    ).filter(e => e.fieldName !== 'employee_managers' && e.fieldName !== 'employee_subordinates');
    const filteredAvailable = activityDetail.fieldInfoActivity.filter(field => {
      return (
        field.availableFlag === AVAILABLE_FLAG.WEB_APP_AVAILABLE ||
        field.fieldName === 'scenario_id'
      );
    });

    // filteredAvailable = _.cloneDeep(reOrderSort(filteredAvailable));

    const filteredUnAvailable = activityDetail.fieldInfoActivity.filter(field => {
      return field.availableFlag === AVAILABLE_FLAG.UNAVAILABLE;
    });

    let filteredProductTradingUnAvailable = [];
    if (_.isArray(activityDetail.fieldInfoProductTrading)) {
      filteredProductTradingUnAvailable = activityDetail.fieldInfoProductTrading.filter(field => {
        return (
          field.availableFlag === AVAILABLE_FLAG.UNAVAILABLE && field.fieldName !== 'scenario_id'
        );
      });
    }

    // filteredUnAvailable = reOrderSort(filteredUnAvailable);

    const activityFieldsAvailable = _.cloneDeep(activityDetail);
    activityFieldsAvailable.fieldInfoActivity = filteredAvailable;
    // const activityFieldsAvailable = filteredAvailable;
    if (!_.isNil(response.activities)) {
      // response.activities['contactDate'] = utcToTz(response.activities.activityStartTime);
      response.activities['interviewers'] = response.activities['interviewer'];
      delete response.activities['interviewer'];
      if (
        response.activities &&
        response.activities.schedule &&
        response.activities.schedule.scheduleId
      ) {
        const schedule = {
          parentCustomerName:
            response.activities.schedule &&
            response.activities.schedule.customers &&
            response.activities.schedule.customers['parentCustomerName'],
          customerName:
            response.activities.schedule &&
            response.activities.schedule.customers &&
            response.activities.schedule.customers['customerName'],
          productTradingName:
            response.activities.schedule &&
            response.activities.schedule.productTradings &&
            response.activities.schedule.productTradings['producTradingName'],
          scheduleName: response.activities.schedule['scheduleName'],
          endDate: response.activities.schedule['finishDate'],
          scheduleId: response.activities.schedule['scheduleId']
        };
        delete response.activities['schedule'];
        response.activities['schedule'] = schedule;
      }
      if (
        response.activities &&
        response.activities.milestone &&
        response.activities.milestone.milestoneId
      ) {
        const milestone = {
          parentCustomerName:
            response.activities.milestone &&
            response.activities.milestone.customer &&
            response.activities.milestone.customer.parentCustomerName,
          customerName:
            response.activities.milestone &&
            response.activities.milestone.customer &&
            response.activities.milestone.customer.customerName,
          milestoneName:
            response.activities.milestone && response.activities.milestone.milestoneName,
          endDate: response.activities.milestone && response.activities.milestone.endDate,
          milestoneId: response.activities.milestone && response.activities.milestone.milestoneId
        };
        delete response.activities['milestone'];
        response.activities['milestone'] = milestone;
      }
      if (response.activities && response.activities.task && response.activities.task.taskId) {
        const task = {
          milestone: {
            milestoneName: response.activities.task.milestoneName
          },
          customer: response.activities.task.customers,
          taskName: response.activities.task.taskName,
          finishDate: response.activities.task.finishDate,
          taskId: response.activities.task.taskId
        };
        delete response.activities['task'];
        response.activities['task'] = task;
      }
    }
    return {
      response,
      tabListShow,
      activityFieldsAvailable,
      filteredUnAvailable,
      productTradingUnAvailable: filteredProductTradingUnAvailable
    };
  }

  /**
   * parse field value same when init
   *
   * @param item
   * @param value
   */
  public static parseFieldValue(item, value) {
    const type = item.fieldType.toString();
    if (
      value === '' &&
      (type === DEFINE_FIELD_TYPE.CHECKBOX || type === DEFINE_FIELD_TYPE.MULTI_SELECTBOX)
    ) {
      return '[]';
    } else if (type === DEFINE_FIELD_TYPE.CHECKBOX || type === DEFINE_FIELD_TYPE.MULTI_SELECTBOX) {
      const arr = JSON.parse(value);
      return arr;
    }
    if (value !== '' && type === DEFINE_FIELD_TYPE.NUMERIC) {
      return parseInt(value, 10);
    }
    if (
      (!value || value.length <= 0) &&
      (type === DEFINE_FIELD_TYPE.EMAIL || type === DEFINE_FIELD_TYPE.PHONE_NUMBER)
    ) {
      return '';
    }
    if ((!value || value.length <= 0) && type === DEFINE_FIELD_TYPE.FILE) {
      return '[]';
    }
    return value;
  }

  public static getExtendfieldValue(extendFieldList, fieldName, fieldInfo?) {
    if (!extendFieldList) {
      return undefined;
    }
    let retField = null;
    extendFieldList.map(field => {
      if (field.key === fieldName) {
        retField = field;
      }
    });
    if (retField) {
      return fieldInfo ? CommonUtil.parseFieldValue(fieldInfo, retField.value) : retField.value;
    }
    return undefined;
  }

  /**
   * languageId and timezoneId is Long
   *
   * @param field
   * @param val
   */
  public static forceNullIfEmptyString(field, val) {
    if (val === '' && (field.fieldName === 'language_id' || field.fieldName === 'timezone_id')) {
      return null;
    }
    return val;
  }

  /**
   * createExtItem
   * @param item
   * @param val
   */
  public static createExtItem(item, val) {
    const isArray = Array.isArray(val);
    const itemValue = isArray ? JSON.stringify(val) : val ? val.toString() : '';
    return {
      fieldType: item.fieldType.toString(),
      key: item.fieldName,
      value: itemValue
    };
  }

  /**
   * addToExtendData
   * @param addItem
   * @param saveDataForm
   * @param name
   */
  public static addToExtendData = (addItem, saveDataForm, name) => {
    if (saveDataForm[name]) {
      let notInArray = true;
      saveDataForm[name].map((e, index) => {
        if (e.key === addItem.key) {
          notInArray = false;
          saveDataForm[name][index] = addItem;
        }
      });
      if (notInArray) {
        saveDataForm[name].push(addItem);
      }
    } else {
      saveDataForm[name] = [addItem];
    }
  };

  /**
   *
   * @param item
   * @param val
   * @param saveDataForm
   */
  public static addExtendField(item, val, saveDataForm, name) {
    let addItem;
    if (item.fieldType.toString() === DEFINE_FIELD_TYPE.LOOKUP) {
      addItem = [];
      const arrVal = forceArray(val);
      arrVal.forEach(obj => {
        addItem.push(CommonUtil.createExtItem(obj.fieldInfo, obj.value));
      });
    } else {
      addItem = CommonUtil.createExtItem(item, val);
    }
    if (Array.isArray(addItem)) {
      addItem.forEach(addIt => {
        CommonUtil.addToExtendData(addIt, saveDataForm, name);
      });
    } else {
      CommonUtil.addToExtendData(addItem, saveDataForm, name);
    }
  }

  static defaultValueActivity = () => ({
    activities: {
      isDraft: false,
      activityId: null,
      contactDate: moment().format(dateFormat),
      activityStartTime: '',
      activityEndTime: '',
      activityDuration: null,
      activityFormatId: null,
      name: null,
      activityFormats: [],
      employee: null,
      businessCards: [],
      interviewers: null,
      customer: {},
      productTradings: [],
      customerRelations: [],
      memo: null,
      task: null,
      schedule: null,
      createdUser: null,
      updatedUser: null,
      activityData: null
    },
    fieldInfoActivity: [],
    tabInfo: []
  });

  static localToTimezoneOfConfig = (d: string | Date | moment.Moment): moment.Moment => {
    return moment.tz(
      moment(d)
        .clone()
        .format(),
      getTimezone()
    );
  };

  static getTimeZoneFromDate(date: any) {
    return moment(CommonUtil.localToTimezoneOfConfig(date)).format(timeFormat);
  }

  static convertToTime(date: any) {
    const _dateTimetz = dateTimeToStringUserDateTimeFromat(date);
    if (_dateTimetz) {
      return _dateTimetz.split(' ')[1];
    } else {
      return '';
    }
  }

  static convertToDate(date: any) {
    return dateTimeToStringUserDateFromat(date);
  }
}

export const makeConditionSearchDefault = () => {
  return {
    listBusinessCardId: null,
    listCustomerId: null,
    listProductTradingId: null,
    productName: null,
    searchLocal: null,
    searchConditions: null,
    filterConditions: null,
    isFirstLoad: false,
    selectedTargetType: null,
    selectedTargetId: null,
    orderBy: [],
    offset: 0,
    limit: LIMIT,
    hasTimeline: true,
    isUpdateListView: true
  };
};

/**
 * check string is Json
 * @param str
 */
export const isJson = str => {
  if (typeof str !== 'string') return false;
  try {
    const result = JSON.parse(str);
    const type = Object.prototype.toString.call(result);
    return type === '[object Object]' || type === '[object Array]';
  } catch (err) {
    return false;
  }
};

export const isMessageCode = msg => {
  const codeRegex = /([_\-0-9a-z]*[.]){1,}[_\-0-9a-zA-Z]{1,}$/g;
  if (codeRegex.test(msg)) {
    return true;
  }
  return false;
};

export const translateMsg = msg => {
  if (!msg || msg.length <= 0) {
    return '';
  }
  if (isMessageCode(msg)) {
    return translate(msg);
  } else {
    return msg;
  }
};

export const getErrorMessage = errorCode => {
  let errorMessage = '';
  if (!isNullOrUndefined(errorCode)) {
    errorMessage = translate('messages.' + errorCode);
  }
  return errorMessage;
};

export const isInvalidDate = date =>
  typeof date === 'string' && date.toLowerCase().includes('invalid date');
