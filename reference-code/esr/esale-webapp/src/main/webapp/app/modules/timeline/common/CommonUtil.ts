import { REQUEST, FAILURE, SUCCESS } from 'app/shared/reducers/action-type.util';
import moment from 'moment';
import { TimelineGroupTypePro } from '../models/get-timeline-groups-of-employee-model';
import {
  GROUP_TIMELINE_MODE,
  TARGET_TYPE,
  LISTCOLOR,
  TYPE_DETAIL_MODAL_HEADER,
  TYPE_DETAIL_MODAL
} from './constants';
import _ from 'lodash';
import { AvatarColor } from 'app/shared/layout/common/suggestion/constants';
import jwtDecode from 'jwt-decode';
import { Storage, translate } from 'react-jhipster';
import {
  AUTH_TOKEN_KEY,
  USER_FORMAT_DATE_KEY,
  APP_DATE_FORMAT_ES,
  APP_DATE_FORMAT,
  USER_ICON_PATH
} from 'app/config/constants';
import { TimelineAction } from '../timeline-reducer';
import {
  getTimezone,
  utcToTz,
  formatDate,
  dateTimeToStringUserDateTimeFromat
} from 'app/shared/util/date-utils';
import { getFieldLabel } from 'app/shared/util/string-utils';
import { MAXIMUM_FILE_UPLOAD_KB } from 'app/config/constants';
import { TargetDeliversType } from '../models/get-user-timelines-type';

const dateFormat = 'YYYY/MM/DD';
const timeFormat = 'HH:mm';

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

export const parseResponseErorData = (respData: any) => {
  let _action = TimelineAction.ERROR;
  const listItemErrors =
    respData.payload.response && respData.payload.response.data.parameters
      ? respData.payload.response.data.parameters.extensions.errors
      : null;
  let _messageValidateRequire = null;
  let messError = listItemErrors
    ? translate(`messages.${listItemErrors[0].errorCode}`)
    : translate('messages.ERR_COM_0001');
  // check type error is validate require
  if (listItemErrors && listItemErrors[0].errorCode === 'ERR_COM_0013') {
    _action = TimelineAction.IS_REQUIRE;
    _messageValidateRequire = translate('messages.ERR_COM_0013');
  } else if (listItemErrors && listItemErrors[0].errorCode === 'ERR_COM_0025') {
    _action = TimelineAction.MAX_LENGTH;
    messError = translate(`messages.${listItemErrors[0].errorCode}`, { 0: 255 });
  }
  return {
    messageInfo: messError,
    action: _action,
    errorCode: listItemErrors ? listItemErrors[0].errorCode : '',
    messageValidateRequire: _messageValidateRequire
  };
};

export const parseResponseData = (respData: any) => {
  return respData;
};

export const clearResponseData = () => {
  return {
    activityId: null,
    success: null,
    successMessage: null,
    errorMessage: null,
    errorItems: []
  };
};

/**
 * validate max size of file
 */
export const isExceededCapacity = fileUploads => {
  let totalSize = 0;
  try {
    fileUploads.forEach(file => {
      totalSize += file.size;
    });
    return totalSize > MAXIMUM_FILE_UPLOAD_KB;
  } catch {
    return false;
  }
};

export class CommonUtil {
  static excuteFunction = (type, state, action, failure, succces) => {
    switch (action.type) {
      case REQUEST(type):
        return {
          ...state,
          messageInfo: null,
          action: TimelineAction.Success
        };
      case FAILURE(type): {
        if (failure) failure();
        return {
          ...state,
          ...parseResponseErorData(action)
        };
      }
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
      return moment.utc(moment(date).format(dateFormat) + ' ' + time).format();
    } else if (date) {
      return moment.utc(date).format();
    } else {
      return '';
    }
  };

  static getUrlImageTypeFile = (fileName: string) => {
    if (fileName.includes('.jpg') || fileName.includes('.png') || fileName.includes('.gif')) {
      return '../../../content/images/timeline/ic-image.svg';
    } else if (fileName.includes('.ppt')) {
      return '../../../content/images/timeline/ic-file-powpoint.svg';
    } else if (fileName.includes('.xls')) {
      return '../../../content/images/timeline/ic-file-excel.svg';
    } else if (fileName.includes('.doc')) {
      return '../../../content/images/timeline/ic-file-word.svg';
    } else if (fileName.includes('.pdf')) {
      return '../../../content/images/timeline/ic-file-pdf.svg';
    } else {
      return '../../../content/images/timeline/ic-file-etc.svg';
    }
  };

  static getImageFileTimeline = (fileName: string) => {
    if (fileName.includes('.xls')) {
      return '../../../content/images/timeline/ic-file-excel.svg';
    } else if (fileName.includes('.doc')) {
      return '../../../content/images/timeline/ic-file-word.svg';
    } else if (fileName.includes('.pdf')) {
      return '../../../../content/images/common/ic-file-pdf.svg';
    } else if (fileName.includes('.ppt')) {
      return '../../../content/images/timeline/ic-file-powpoint.svg';
    } else {
      return '../../../content/images/timeline/ic-file-etc.svg';
    }
  };

  static getIconHeaderType = (type: number) => {
    if (type === TYPE_DETAIL_MODAL_HEADER.CUSTOMER) {
      return '../../../content/images/ic-sidebar-customer.svg';
    } else if (type === TYPE_DETAIL_MODAL_HEADER.CARD) {
      return '../../../content/images/ic-sidebar-business-card.svg';
    } else if (type === TYPE_DETAIL_MODAL_HEADER.ACTIVITY) {
      return '../../../content/images/ic-sidebar-activity.svg';
    } else if (type === TYPE_DETAIL_MODAL_HEADER.SCHEDULE) {
      return '../../../content/images/ic-sidebar-calendar.svg';
    } else if (type === TYPE_DETAIL_MODAL_HEADER.TASK) {
      return '../../../content/images/task/ic-menu-task.svg';
    } else if (type === TYPE_DETAIL_MODAL_HEADER.MILESTONE) {
      return '../../../../content/images/task/ic-flag-red.svg';
    } else {
      return '../../../content/images/task/ic-flag-brown.svg';
    }
  };

  static getGroupUserMode = (groupTimeline: TimelineGroupTypePro) => {
    if (groupTimeline == null) {
      return GROUP_TIMELINE_MODE.NOT_MEMBER;
    } else if (groupTimeline.authority === 2 && groupTimeline.status === 2) {
      return GROUP_TIMELINE_MODE.NOT_MEMBER;
    } else if (groupTimeline.authority === 2 && groupTimeline.status === 1) {
      return GROUP_TIMELINE_MODE.MEMBER;
    } else if (groupTimeline.authority === 1 && groupTimeline.status === 1) {
      return GROUP_TIMELINE_MODE.MANAGER;
    } else if (groupTimeline.authority === 1 && groupTimeline.status === 2) {
      return GROUP_TIMELINE_MODE.MANAGER_HAVE_REQUEST;
    } else {
      return GROUP_TIMELINE_MODE.NOT_MEMBER;
    }
  };

  static flatAttachedFilesResponse = (attachedFilesResponse: any) => {
    const listAttachedFiles = [];
    if (attachedFilesResponse) {
      attachedFilesResponse.forEach(element => {
        if (element.attachedFiles && element.attachedFiles.length > 0) {
          element.attachedFiles.forEach(elementTimeline => {
            listAttachedFiles.push({
              timelineId: element.timelineId,
              createdUserName: element.createdUserName,
              createdDate: element.createdDate,
              attachedFile: {
                fileName: elementTimeline.fileName,
                filePath: elementTimeline.filePath,
                fileUrl: elementTimeline.fileUrl
              }
            });
          });
        }
      });
    }
    return listAttachedFiles;
  };
  /**
   * objectToFormData
   */
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
   * Get random Avatar
   */
  static getAvatarName = itemId => {
    if (!itemId || itemId.length === 0) {
      return AvatarColor[0];
    }
    return itemId.length === 1
      ? AvatarColor[itemId]
      : AvatarColor[itemId.toString().charAt(itemId.length - 1)];
  };

  static getFirstCharacter = name => {
    return name ? name.charAt(0) : '';
  };

  static convertSuggestionTimeline = (listSuggestionTimeline: any) => {
    const listSuggest = [];
    if (listSuggestionTimeline.employees && listSuggestionTimeline.employees.length > 0) {
      listSuggestionTimeline.employees.forEach(employeeInfo => {
        if (employeeInfo.employeeDepartments && employeeInfo.employeeDepartments.length > 0) {
          const positions = getFieldLabel(employeeInfo.employeeDepartments[0], 'positionName');
          const departments =
            employeeInfo.employeeDepartments && employeeInfo.employeeDepartments.length > 0
              ? employeeInfo.employeeDepartments[0].departmentName
              : '';
          const targetNameDownV = `${
            employeeInfo.employeeSurname ? employeeInfo.employeeSurname : ''
          } ${employeeInfo.employeeName ? employeeInfo.employeeName : ''} ${
            positions ? positions : ''
          }`;
          const targetNameUpV = departments;
          const targetAvartarV = employeeInfo.employeeIcon
            ? employeeInfo.employeeIcon.fileUrl
            : null;
          const targetIdV = employeeInfo.employeeId;
          const targetAvartarRandomV = CommonUtil.getAvatarName(7);
          listSuggest.push({
            targetType: TARGET_TYPE.EMPLOYEE,
            targetId: targetIdV,
            targetName: targetNameDownV,
            targetNameDown: targetNameDownV,
            targetNameUp: targetNameUpV,
            targetAvartar: targetAvartarV,
            targetAvartarRandom: targetAvartarRandomV
          });
        }
      });
    }
    if (listSuggestionTimeline.departments && listSuggestionTimeline.departments.length > 0) {
      listSuggestionTimeline.departments.forEach(employeeInfo => {
        const targetIdV = employeeInfo.departmentId;
        const targetAvartarRandomV = CommonUtil.getAvatarName(6);
        const targetNameUpV = employeeInfo.employeesDepartments
          .map(function(e) {
            return (
              e &&
              `${e.employeeSurname ? e.employeeSurname : ''}${
                e.employeeName ? ' ' + e.employeeName : ''
              }`
            );
          })
          .join(', ');
        const targetNameDownV = employeeInfo.departmentName;
        listSuggest.push({
          targetType: TARGET_TYPE.DEPARTMENT,
          targetId: targetIdV,
          targetName: employeeInfo.departmentName,
          targetNameDown: targetNameUpV,
          targetNameUp: targetNameDownV,
          targetAvartar: null,
          targetAvartarRandom: targetAvartarRandomV
        });
      });
    }
    return listSuggest;
  };

  static defaultValueActivity = () => {};

  static getUserLogin = () => {
    const jwt = Storage.local.get(AUTH_TOKEN_KEY) || Storage.session.get(AUTH_TOKEN_KEY);
    let empId = 0;
    let empName = '';
    if (jwt) {
      const jwtData = jwtDecode(jwt);
      empId = jwtData['custom:employee_id'];
      empName =
        jwtData['custom:employee_surname'] +
        ' ' +
        (jwtData['custom:employee_name'] !== null && jwtData['custom:employee_name'] !== undefined
          ? jwtData['custom:employee_name']
          : '');
    }
    return {
      employeeId: empId,
      employeeName: empName,
      employeeAvatar: Storage.session.get(USER_ICON_PATH, 'default icon')
    };
  };

  static getColorIndex = (colorCode: string) => {
    const color = LISTCOLOR.find(e => e.value === colorCode);
    return color ? `color-bg-${color.id}` : '';
  };

  static escapeHtml = (unsafe: string) => {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  static trimSpaceHtml(valueStr: string) {
    let lastString = valueStr;
    const beginPatt = /^&nbsp;/;
    const endPatt = /&nbsp;$/;
    const endDivPatt = /<\/div>$/;
    lastString = lastString.replace(endDivPatt, '').trim();
    while (beginPatt.exec(lastString)) {
      lastString = lastString.replace(beginPatt, '').trim();
    }
    while (endPatt.exec(lastString)) {
      lastString = lastString.replace(endPatt, '').trim();
    }
    return lastString.trim();
  }

  static getUseFormatDate = () => {
    return Storage.session.get(USER_FORMAT_DATE_KEY, APP_DATE_FORMAT_ES) || APP_DATE_FORMAT;
  };

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

  static getJustDateTimeZone(date: any) {
    return formatDate(utcToTz(date));
  }

  static removeDuplicateTarget(listTarget: any[]) {
    if (!_.isNull(listTarget)) {
      return _.uniqBy(listTarget, function(e: TargetDeliversType) {
        return e.targetId + '_' + e.targetType;
      });
    }
    return [];
  }
  static convertToTime(date: any) {
    const _dateTimetz = dateTimeToStringUserDateTimeFromat(date);
    if (_dateTimetz) {
      return _dateTimetz.split(' ')[1];
    } else {
      return '';
    }
  }

  static getTypeShowAuto(type: number) {
    switch (type) {
      case TYPE_DETAIL_MODAL_HEADER.TASK:
        return TYPE_DETAIL_MODAL_HEADER.TASK;
      case TYPE_DETAIL_MODAL_HEADER.MILESTONE:
        return TYPE_DETAIL_MODAL_HEADER.MILESTONE;
      case TYPE_DETAIL_MODAL_HEADER.CARD:
        return TYPE_DETAIL_MODAL_HEADER.CARD;
      case TYPE_DETAIL_MODAL_HEADER.SCHEDULE:
        return TYPE_DETAIL_MODAL_HEADER.SCHEDULE;
      case TYPE_DETAIL_MODAL_HEADER.CUSTOMER:
        return TYPE_DETAIL_MODAL_HEADER.CUSTOMER;
      case TYPE_DETAIL_MODAL_HEADER.ACTIVITY:
        return TYPE_DETAIL_MODAL_HEADER.ACTIVITY;
      default:
        return 0;
    }
  }
}
