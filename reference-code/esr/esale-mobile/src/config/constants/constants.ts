import { Platform } from "react-native";
import moment from 'moment';
import { translate } from '../i18n';
import { messages } from "./messages-common";
// Define constant Field label
export const FIELD_LABLE = "fieldLabel";

// Define constant item label
export const ITEM_LABEL = 'itemLabel';

// Text empty
export const TEXT_EMPTY = "";

// Comma and space
export const COMMA_SPACE = ", ";

// string object empty
export const OBJECT_EMPTY = "{}"

// left slash
export const LEFT_SLASH = "/";

// time format
export const TIME_FORMAT = "HH:mm";

// Format date
export const FORMAT_DATE = {
    YYYY_MM_DD: "YYYY-MM-DD",
    MM_DD_YYYY: "MM-DD-YYYY",
    DD_MM_YYYY: "DD-MM-YYYY",
    YYYY__MM__DD: "YYYY/MM/DD",
    MM__DD__YYYY: "MM/DD/YYYY",
    DD__MM__YYYY: "DD/MM/YYYY",
};

export const FORMAT_DATE_JP = {
    YYYY_MM_DD: "YYYY年MM月DD日",
};

// time to time
export const TIME_TO_TIME = "〜";
//  notification type
export const NOTIFICATION_TYPE = {
    POST_PERSONAL: 1,
    REGISTER_SCHEDULE: 6,
    REGISTER_TASK: 7,
    FINISH_IMPORT: 11,
    NOTIFICATION_TASK: 9,
};

// notification subtype
export const NOTIFICATION_SUBTYPE = {
  POST_PERSONAL: [1, 2, 3, 4],
  REGISTER_SCHEDULE: [1],
  REGISTER_TASK: [1],
  FINISH_IMPORT: [1],
  NOTIFICATION_TASK: [1, 2, 3],
};
// format date time
export const DATE_FORMAT = "YYYY/MM/DD";

// Space
export const TEXT_SPACE = " ";

// service employees
export const SERVICE_EMPLOYEE = "services/employees/api";

// service sales
export const SERVICE_SALE = "services/sales/api";

// service products
export const SERVICE_PRODUCT = "services/products/api";

// service schedules
export const SERVICE_SCHEDULES = "services/schedules/api";

// service businesscards
export const SERVICE_BUSSINESS_CARDS = "services/businesscards/api";

// service customers
export const SERVICE_CUSTOMER = "services/customers/api";

// service activities
export const SERVICE_ACTIVITIES = "services/activities/api";

// service commons
export const SERVICE_COMMONS = "services/commons/api";

export const ID_TOKEN = "idToken";
export const REFRESH_TOKEN = "refreshToken";
export const TIMEZONE_NAME = "timezoneName";
export const ON_END_REACHED_THRESHOLD = Platform.select({
    android: 0.1,
    ios: 0,
});

export const LIMIT = 10;
export const PREFIX_EMPLOYEE = {
    PHONE: "phone_number_",
    MAIL: "email_",
};
// half width space
export const SPACE_HALF_SIZE = " ";

// two dots
export const TWO_DOTS = ":";

/**
 * status of modal end
 */

/**
 * Y-m-d of startDate = Y-m-d of endDate => Y-m-d H:i:s_start ~ H:i:s_end
 * @param startDate
 * @param endDate
 * @constructor
 */
export const CONVERT_DATE = (startDate: moment.Moment, endDate: moment.Moment) => {
    startDate = moment(startDate);
    endDate = moment(endDate);
    const formatDate = {
      year: startDate.year(),
      month: startDate.month() + 1,
      day: startDate.dates()
    };
    const formatDateTime = {
      fromYear: startDate.year(),
      fromMonth: startDate.month() + 1,
      fromDay: startDate.date(),
      fromHour: formatNumber(startDate.hour()),
      fromMin: formatNumber(startDate.minute()),
      toYear: endDate.year(),
      toMonth: endDate.month() + 1,
      toDay: endDate.date() ,
      toHour: formatNumber(endDate.hour()),
      toMin: formatNumber(endDate.minute())
    };
    const formatTime = {
      fromHour: formatNumber(startDate.hour()),
      fromMin: formatNumber(startDate.minute()),
      toHour: formatNumber(endDate.hour()),
      toMin: formatNumber(endDate.minute())
    };    
    if (startDate && endDate) {
      if (
        formatDateTime.fromYear === formatDateTime.toYear &&
        formatDateTime.fromMonth === formatDateTime.toMonth &&
        formatDateTime.fromDay === formatDateTime.toDay
      ) {
        return `${translate(messages.formatFullDate, formatDate)} ${translate(messages.formatTime, formatTime)}`;
      }
        return `${translate(messages.formatDateTime, formatDateTime)}`;
    }
    return;
  };
  
/**
 * format number
 * @param num
 */
const formatNumber = (num: number) => {
  return num < 10 ? "0" + num : num
}
// add セット
export const LIST_ADD_PREFIX = [
  '商品コード',
  '商品名',
  '商品画像',
  '商品タイプ',
  '販売価格',
];



export const APP_DATE_FORMAT = 'YYYY/MM/DD';
export const APP_TIME_FORMAT = 'HH:mm';
export const APP_DATE_FORMAT_ES = 'YYYY-MM-DD';
export const APP_TIME_FORMAT_ES = 'HH:mm:ss';
export const APP_DATETIME_FORMAT_ES = 'YYYY-MM-DD HH:mm:ss';
export const APP_DATETIME_SPECIAL_FORMAT_ES = 'HHmm';
export const APP_DATE_SPECIAL_FORMAT_ES = 'MMDD';
export const APP_DATE_TIME_FORMAT = 'DD/MM/YY HH:mm';
export const APP_TIMESTAMP_FORMAT = 'DD/MM/YY HH:mm:ss';
export const APP_LOCAL_DATE_FORMAT = 'DD/MM/YYYY';
export const DATETIME_FORMAT = 'YYYY-MM-DD HH:mm';
export const DATETIME_FORMAT_USER = 'yyyy-MM-dd HH:mm';
export const APP_DATE_FORMAT_DATABASE = 'yyyy-MM-dd';
export const APP_DATETIME_FORMAT_DATABASE = 'yyyy-MM-dd HH:mm:ss';

export const DEFAULT_TIMEZONE = 'Asia/Tokyo';


export const DATE_MODE = {
    DATE_BEFORE: 0,
    DATE_AFTER: 1,
    MONTH_BEFORE: 2,
    MONTH_AFTER: 3,
    YEAR_BEFORE: 4,
    YEAR_AFTER: 5
};

export const TYPE_UNIT = {
    PREFIX: 0,
    SUFFIX: 1,
};

export const PARAMS_0 = "{0}"
export const PARAMS_1 = "{1}"
