import { getUrlFromPath } from 'app/shared/helpers';
import { equals } from 'ramda';

const config = {
  VERSION: process.env.VERSION
};

export default config;
export const URL_PORTAL = 'https://www.e-sales-support.jp/app/home/p/2';
export const URL_PORTAL_YOUTUBE = 'https://www.youtube.com/embed/x4PMKb8iXRM';
export const REASON_CONST_URL = 'https://www.e-sales-ms.jp/reason/cost/';

export const enum ScreenModeOfPortal {
  FIRST_LOGIN,
  SECOND_LOGIN,
  UPDATE_FIRST_SCREEN,
  MODAL_PORTAL,
  MODAL_IMPORT,
  MODAL_IMPORT_PORTAL,
  NONE
}

export const SERVER_API_URL = process.env.SERVER_API_URL;

export const AUTH_TOKEN_KEY = 'sb-access-token';
export const IS_OPEN_FEEDBACK = 'isOpenFeedback';
export const AUTH_REFRESH_TOKEN_KEY = 'sb-refesh-token';
export const CHECK_RESPONSE_FROM_SAML = 'response_saml';
export const SIGNOUT_SAML_URL = 'signOutSaml';

export const API_CONTEXT_PATH = 'services';
export const API_PUBLIC_CONTEXT_PATH = API_CONTEXT_PATH;

export const API_CONFIG = {
  EMPLOYEE_SERVICE_PATH: 'employees/api',
  COMMON_SERVICE_PATH: 'commons/api',
  SCHEDULES_SERVICE_PATH: 'schedules/api',
  UAA_SERVICE_PATH: 'uaa/graphql',
  PRODUCT_SERVICE_PATH: 'products/api',
  BUSINESS_CARD_SERVICE_PATH: 'businesscards/api',
  ACTIVITY_SERVICE_PATH: 'activities/api',
  CALENDAR_SERVICE_PATH: 'schedules/api',
  SALES_SERVICE_PATH: 'sales/api',
  CUSTOMER_SERVICE_PATH: 'customers/api',
  TENANTS_SERVICE_PATH: 'tenants/api',
  TIMELINES_SERVICE_PATH: 'timelines/api',
  EXTERNALS_SERVICE_PATH: 'externals/api',
  WORDPRESS_SERVICE_PATH: 'wp-json/wp/v2'
};

export const customersApiUrl = getUrlFromPath([API_CONTEXT_PATH, API_CONFIG.CUSTOMER_SERVICE_PATH]);
export const businessCardApiUrl = getUrlFromPath([
  API_CONTEXT_PATH,
  API_CONFIG.BUSINESS_CARD_SERVICE_PATH
]);

export const TYPE_MSG_EMPTY = {
  NONE: 0,
  FILTER: 1,
  SEARCH: 2
};

export const INPUT_TYPE = {
  MAIL: 1,
  CURRENT_PASS: 2,
  NEW_PASS: 3,
  CONFIRM_PASS: 4,
  RESET_CODE: 5
};

export const AUTHORITIES = {
  ADMIN: 'ROLE_ADMIN',
  USER: 'ROLE_USER'
};

export const enum ScreenMode {
  DISPLAY,
  EDIT
}

export const isScreenModeDisplay = equals(ScreenMode.DISPLAY);
export const isScreenModeEdit = equals(ScreenMode.EDIT);

export const SEARCH_TYPE = {
  LIKE: '1',
  LIKE_FIRST: '2',
  NOT: '3'
};

export const SEARCH_OPTION = {
  OR: '1',
  AND: '2',
  WORD: '3',
  NOT_OR: '4',
  NOT_AND: '5'
};

export const messages = {
  DATA_ERROR_ALERT: 'Internal Error'
};

export const enum ControlType {
  SEARCH,
  FILTER_LIST,
  EDIT,
  VIEW,
  EDIT_LIST,
  DETAIL_VIEW,
  DETAIL_EDIT,
  ADD,
  SUGGEST
}

export const MODIFY_FLAG = {
  READ_ONLY: 0,
  ANY: 1,
  REQUIRED: 2,
  DEFAULT_REQUIRED: 3
};

export const PERMISSION_LEVEL = {
  UNAVAILABLE: 0,
  VIEW_ONLY: 1,
  EDITABLE: 2
};

export const AVAILABLE_FLAG = {
  UNAVAILABLE: 0,
  WEB_APP_AVAILABLE: 3
};

export const FIELD_BELONG = {
  EMPLOYEE: 8, // 社員
  SALES: 16,
  CUSTOMER: 5, // 顧客
  BUSINESS_CARD: 4, // 名刺
  ACTIVITY: 6, // 活動
  PRODUCT: 14, // 商品
  PRODUCT_TRADING: 16, // 商談
  TASK: 15,
  MILE_STONE: 1501,
  SUB_TASK: 1502,
  PRODUCT_BREAKDOWN: 1401,
  SCHEDULE: 2,
  TASK_WITHOUT_ACTIVITY: 1503,
  SUB_TASK_WITHOUT_ACTIVITY: 1504,
  ANALYSIS: 10
  // CALENDAR: 1
};

export const FIELD_SERVICE_NAME_EXTENSION = {
  8: 'employee_data', // 社員
  5: 'customer_data', // 顧客
  16: 'sale_data',
  4: 'business_card_data', // 名刺
  6: 'activities_data', // 活動
  14: 'product_data', // 商品
  15: 'task_data',
  1501: 'milte_stone_data',
  1502: 'sub_task_data',
  1401: 'productBreakDownData'
};

export const EXTENSION_BELONG = {
  LIST: 1,
  SEARCH_DETAIL: 2
};

export const enum SCREEN_TYPES {
  LIST,
  DETAIL,
  EDIT,
  ADD,
  SEARCH
}

export const DATE_MODE = {
  DATE_BEFORE: 0,
  DATE_AFTER: 1,
  MONTH_BEFORE: 2,
  MONTH_AFTER: 3,
  YEAR_BEFORE: 4,
  YEAR_AFTER: 5
};

export const UNIT_POSITION = {
  START: 0,
  END: 1
};

export const ORG_FORMATS = {
  SINGLE: '1',
  MULTI: '2'
};

export const ORG_TARGET_INDEX = {
  EMPLOYEE: 0,
  DEPARTMENT: 1,
  GROUP: 2
};

export const ORG_SEARCH_TYPE = {
  EMPLOYEE: 2,
  DEPARTMENT: 1,
  GROUP: 3,
  EMPLOYEE_DEPARTMENT: 4,
  EMPLOYEE_GROUP: 5,
  DEPARTMENT_GROUP: 6
};

export const ORG_TARGET_TO_SEARCH_TYPE = {
  '100': ORG_SEARCH_TYPE.EMPLOYEE,
  '010': ORG_SEARCH_TYPE.DEPARTMENT,
  '001': ORG_SEARCH_TYPE.GROUP,
  '110': ORG_SEARCH_TYPE.EMPLOYEE_DEPARTMENT,
  '101': ORG_SEARCH_TYPE.EMPLOYEE_GROUP,
  '011': ORG_SEARCH_TYPE.DEPARTMENT_GROUP,
  '111': null,
  '000': null
};

export const ORG_COLORS = {
  department: 'light-blue',
  employee: 'green',
  group: 'light-green'
};

export const COMPONENT_DISPLAY_TYPE = {
  EMPLOYEE_LIST: 8,
  CUSTOMER_LIST: 5,
  PRODUCT_LIST: 14,
  TASK_LIST: 15,
  CALENDAR_GRID: 2,
  ANALYSIS_REPORT_LIST: 10,
  BUSINESS_CARD: 4
};

export const ADDRESS_MAXLENGTH = {
  ZIP_CODE: 8,
  TEXT: 450
};

export const TIMEOUT_TOAST_MESSAGE = 2000;

// IFrame内に直接表示
export const LINK_TARGET_IFRAME = 3;

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
export const APP_WHOLE_NUMBER_FORMAT = '0,0';
export const APP_TWO_DIGITS_AFTER_POINT_NUMBER_FORMAT = '0,0.[00]';
export const IGNORE_DBL_CLICK_ACTION = 'ignoreDoubleClick_';
export const SHOW_PROGRESS_ACTION = 'showProgressBar_';
export const USER_FORMAT_DATE_KEY = 'userFormatDateKey';
export const USER_TIMEZONE_KEY = 'userTimezoneKey';
export const USER_LANGUAGE = 'locale';
export const USER_ICON_PATH = 'userIcon';
export const DATETIME_FORMAT = 'YYYY-MM-DD HH:mm';
export const DATETIME_FORMAT_OTHER = 'YYYY/MM/DD HH:mm';

export const DEFAULT_TIMEZONE = 'Asia/Tokyo';

export const SERVICE_ID_IMPORT = {
  EMPLOYEE: 8, // 社員
  DEPARTMENT_EMPLOYEE: 801,
  CUSTOMER: 5, // 顧客
  BUSINESS_CARD: 4, // 名刺
  ACTIVITY: 6, // 活動
  PRODUCT: 14, // 商品
  PRODUCT_TRADING: 16, // 商談
  TASK: 15,
  MILE_STONE: 1501,
  SUB_TASK: 1502,
  PRODUCT_BREAKDOWN: 1401,
  SCHEDULE: 2,
  TASK_WITHOUT_ACTIVITY: 1503,
  SUB_TASK_WITHOUT_ACTIVITY: 1504,
  ANALYSIS: 10
};

// in kilobyte 2147483648
export const MAXIMUM_FILE_UPLOAD_KB = 2147483648;
export const MAXIMUM_FILE_UPLOAD_MB = 2048;
export const MAXIMUM_FILE_UPLOAD_GB = 2097152; // same max is 2GB
