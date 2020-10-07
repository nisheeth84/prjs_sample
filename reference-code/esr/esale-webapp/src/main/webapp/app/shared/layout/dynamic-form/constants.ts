import { EMPLOYEE_SPECIAL_LIST_FIELD } from 'app/modules/employees/constants';
import { CUSTOMER_SPECIAL_LIST_FIELD } from 'app/modules/customers/constants';
import { BUSINESS_SPECIAL_FIELD_NAMES } from 'app/modules/businessCards/constants';
import { FIELD_BELONG } from 'app/config/constants';
import StringUtils from 'app/shared/util/string-utils';

export const DEFINE_FIELD_TYPE = {
  SINGER_SELECTBOX: '1',
  MULTI_SELECTBOX: '2',
  CHECKBOX: '3',
  RADIOBOX: '4',
  NUMERIC: '5',
  DATE: '6',
  DATE_TIME: '7',
  TIME: '8',
  TEXT: '9',
  TEXTAREA: '10',
  FILE: '11',
  LINK: '12',
  PHONE_NUMBER: '13',
  ADDRESS: '14',
  EMAIL: '15',
  CALCULATION: '16',
  RELATION: '17',
  SELECT_ORGANIZATION: '18',
  LOOKUP: '19',
  TAB: '20',
  TITLE: '21',
  OTHER: '99'
};

export const SPECIAL_HIDE_FILTER_LIST = [
  EMPLOYEE_SPECIAL_LIST_FIELD.employeeTimeZone,
  EMPLOYEE_SPECIAL_LIST_FIELD.employeeLanguage,
  CUSTOMER_SPECIAL_LIST_FIELD.CUSTOMER_LOGO,
  BUSINESS_SPECIAL_FIELD_NAMES.businessCardImagePath
];

export const SPECIAL_HIDE_RELATION_SEARCH = [EMPLOYEE_SPECIAL_LIST_FIELD.employeeIcon];

export const SPECIAL_FIELD_HIDE_DETAIL = [CUSTOMER_SPECIAL_LIST_FIELD.BUSINESS_SUB_ID];

export const SPECIAL_FILTER_LIST = [CUSTOMER_SPECIAL_LIST_FIELD.BUSINESS];

export const SPECIAL_HIDE_ORDER_BY = [
  EMPLOYEE_SPECIAL_LIST_FIELD.employeeDepartments,
  EMPLOYEE_SPECIAL_LIST_FIELD.employeePositions,
  EMPLOYEE_SPECIAL_LIST_FIELD.employeeManager,
  EMPLOYEE_SPECIAL_LIST_FIELD.employeePackages,
  EMPLOYEE_SPECIAL_LIST_FIELD.employeeSubordinates,
  CUSTOMER_SPECIAL_LIST_FIELD.CUSTOMER_LOGO,
  BUSINESS_SPECIAL_FIELD_NAMES.businessCardImagePath
];

export const SPECIAL_HIDE_SEARCH_OPTION_CHECKBOX = [
  CUSTOMER_SPECIAL_LIST_FIELD.DISPLAY_CHILD_CUSTOMERS
];

const getSpecialFielLabelList = () => {
  const employeeSurname = {};
  employeeSurname['en_us'] = 'Full Name';
  employeeSurname['ja_jp'] = '名前';
  employeeSurname['zh_cn'] = '名称';
  const employeeSurnameKana = {};
  employeeSurnameKana['en_us'] = 'Full Name (Kana)';
  employeeSurnameKana['ja_jp'] = '名前（かな）';
  employeeSurnameKana['zh_cn'] = '名称（假名）';
  const result = {};
  result['employee_surname'] = employeeSurname;
  result['employee_surname_kana'] = employeeSurnameKana;
  return result;
};

export const SPECICAL_FIELD_LABLE_CONVERT = getSpecialFielLabelList();

export const SPECIAL_HIDE_DISPLAY_SWITCH_PANEL = belong => {
  switch (belong) {
    case FIELD_BELONG.EMPLOYEE:
      return [
        EMPLOYEE_SPECIAL_LIST_FIELD.employeeName,
        EMPLOYEE_SPECIAL_LIST_FIELD.employeeIcon,
        EMPLOYEE_SPECIAL_LIST_FIELD.employeeNameKana
      ];
    case FIELD_BELONG.CUSTOMER:
      return [
        CUSTOMER_SPECIAL_LIST_FIELD.SCENARIO,
        CUSTOMER_SPECIAL_LIST_FIELD.DISPLAY_CHILD_CUSTOMERS,
        CUSTOMER_SPECIAL_LIST_FIELD.LAST_CONTACT_DATE,
        CUSTOMER_SPECIAL_LIST_FIELD.BUSINESS_SUB_ID
      ];
    default:
      return [];
  }
};

export const SPECIAL_NO_IMAGE_LIST = [CUSTOMER_SPECIAL_LIST_FIELD.CUSTOMER_LOGO];

export const SPECIAL_HIDE_SEARCH_OPTION = [EMPLOYEE_SPECIAL_LIST_FIELD.employeePackages];

export const SEARCH_MODE = {
  NONE: 0,
  TEXT_DEFAULT: 1,
  CONDITION: 2,
  BY_MENU: 3
};

export const DEFINE_FIELD_NAME_TASK = {
  STATUS: 'status',
  IS_PUBLIC: 'is_public',
  TASK_ID: 'task_id',
  START_DATE: 'start_date',
  FINISH_DATE: 'finish_date',
  UPDATED_DATE: 'updated_date',
  CREATED_DATE: 'created_date',
  TASK_NAME: 'task_name',
  MEMO: 'memo',
  FILE_NAME: 'file_name',
  MILESTONE_NAME: 'milestone_name',
  MILESTONE_ID: 'milestone_id',
  OPERATOR_ID: 'operator_id',
  UPDATED_USER: 'updated_user',
  PARENT_ID: 'parent_id',
  PRODUCTS_TRADINGS_ID: 'products_tradings_id',
  CREATED_USER: 'created_user',
  PRODUCT_NAME: 'product_name',
  CUSTOMER_NAME: 'customer_name',
  CUSTOMER_ID: 'customer_id'
};

export const FIELD_MAXLENGTH = {
  unit: 10,
  fieldLabel: 60,
  defaultValue: 1000,
  currencyUnit: 50,
  itemLabel: 60,
  urlTarget: 1000,
  urlText: 500,
  configValue: 4000
};

export const FIELD_ITEM_TYPE_DND = {
  MOVE_CARD: 'MoveFieldTypeItemCard',
  ADD_CARD: 'AddCardTypeItemCard',
  SWICH_ORDER: 'SwichOrderTypeItemCard',
  ADD_FIELD: 'AddFieldTypeItemCard'
};

export const DND_ITEM_TYPE = {
  DYNAMIC_LIST_ROW: 'DynamicListRow',
  DYNAMIC_LIST_COLUMN: 'DynamicListCell'
};

export const ITEM_TYPE = {
  CARD: 'Field Card'
};

export const CUSTOMIZE_FIELD_NAME = [
  'employee_data'
  // Add customize field of service to get fieldName, ex: customer_data, product_data, ...
];

export const enum ActionListHeader {
  NONE,
  OPEN_SELECT_CHECKBOX,
  OPEN_FILTER,
  SELECT_ALL,
  UNSELECT_ALL,
  SELECT_INSIDE,
  UNSELECT_INSIDE,
  SORT_ASC,
  SORT_DESC,
  FIX_COLUMN,
  FILTER
}

export const HEADER_ACTION_TYPE = {
  SORT: 1,
  FILTER: 2
};

export const enum DynamicControlAction {
  NONE,
  CANCEL,
  SAVE,
  ADD,
  EDIT,
  DELETE,
  USER_CHANGE,
  EDIT_NUMBER,
}

export enum FilterModeDate {
  None,
  PeriodYmdHm,
  PeriodHm,
  PeriodYmd,
  PeriodMd,
  DayBeforeAfter,
  TodayBefore,
  TodayAfter,
  MonthBeforeAfter,
  YearBeforeAfter
}

export enum NumberModeDate {
  Normal,
  Working
}

export enum FieldInfoType {
  Personal,
  Tab
}

export const TYPE_UNIT = {
  symbol: 0,
  unit: 1
};

export const DUMMY_GET_SERVICES_INFO = [
  {
    serviceId: 1,
    serviceName: '{"ja_jp": "社員 - Employees","en_us": "Employee","zh_cn": "职员"}',
    serviceType: 2
  },
  {
    serviceId: 2,
    serviceName: '{"ja_jp": "社員 - Products","en_us": "Employee","zh_cn": "职员"}',
    serviceType: 2
  },
  {
    serviceId: 3,
    serviceName: '{"ja_jp": "社員 - Calendar","en_us": "Employee","zh_cn": "职员"}',
    serviceType: 2
  }
];

export const RELATION_LINK_TYPE = {
  LINK_TYPE_ITEM: '1',
  LINK_DESTINATION_ITEM: '2'
};

export const DUMMY_ACTIVE_FORMATS = {
  listActivityFormat: [
    { activityFormatId: 1, name: 'Activity 1' },
    { activityFormatId: 2, name: 'Activity 2' },
    { activityFormatId: 3, name: 'Activity 3' }
  ],
  fieldIdActivityFormats: [{ activityFormatId: 2 }, { activityFormatId: 4 }]
};

export const DUMMY_PRODUCT_TYPE = {
  productTypes: [
    { productTypeId: 1, productTypeName: 'productType 1' },
    { productTypeId: 2, productTypeName: 'productType 2' },
    { productTypeId: 3, productTypeName: 'productType 3' }
  ],
  fieldIdProductTypes: [{ productTypeId: 3 }]
};

export const DECIMAL_PLACE_OPTIONS = [
  { key: 0, value: '0桁' },
  { key: 1, value: '1桁' },
  { key: 2, value: '2桁' },
  { key: 3, value: '3桁' },
  { key: 4, value: '4桁' },
  { key: 5, value: '5桁' },
  { key: 6, value: '6桁' },
  { key: 7, value: '7桁' },
  { key: 8, value: '8桁' },
  { key: 9, value: '9桁' },
  { key: 10, value: '10桁' },
  { key: 11, value: '11桁' },
  { key: 12, value: '12桁' },
  { key: 13, value: '13桁' },
  { key: 14, value: '14桁' }
];

export const OVER_FLOW_MENU_TYPE = {
  BUSINESS_CARD: {
    HISTORY_ACTIVITIES: 41,
    REGIST_ACTIVITIES: 42,
    REGIST_SCHEDULES: 43,
    REGIST_TASK: 44,
    POST_DATA: 45,
    CREATE_MAIL: 46
  },
  CUSTOMER: {
    HISTORY_ACTIVITIES: 51,
    REGIST_ACTIVITIES: 52,
    REGIST_SCHEDULES: 53,
    REGIST_TASK: 54,
    POST_DATA: 55,
    CREATE_MAIL: 56,
    REGIST_BUSINESS_CARD: 57,
    REGIST_CUSTOMER_CHILD: 58
  },
  EMPLOYEE: {
    HISTORY_ACTIVITIES: 81,
    REGIST_SCHEDULES: 82,
    REGIST_TASK: 83,
    POST_DATA: 84,
    CREATE_MAIL: 85
  },
  PRODUCTS_TRADING: {
    REGIST_ACTIVITIES: 161,
    ACTIVE_HISTORY: 162,
    REGIST_TASK: 163,
    REGIST_SCHEDULES: 164
  },
  TASK: {
    REGIST_TASK: 151,
    REGIST_MILESTOME: 152,
    REGIST_ACTIVITIES: 153,
    POST_DATA: 154
  },
  SUB_TASK: {
    REGIST_ACTIVITIES: 15011,
    POST_DATA: 15012
  },
  MILE_STONE: {
    REGIST_TASK: 15021,
    REGIST_ACTIVITIES: 15022,
    POST_DATA: 15203
  }
};

export const OVER_FLOW_MENU = {
  4: [
    {
      key: OVER_FLOW_MENU_TYPE.BUSINESS_CARD.HISTORY_ACTIVITIES,
      value: 'global.over-flow-menu.business-card.history-activities',
      imgSrc: '../../../content/images/ic-sidebar-activity.svg'
    },
    {
      key: OVER_FLOW_MENU_TYPE.BUSINESS_CARD.REGIST_ACTIVITIES,
      value: 'global.over-flow-menu.business-card.regist-activities',
      imgSrc: '../../../content/images/ic-sidebar-activity.svg'
    },
    {
      key: OVER_FLOW_MENU_TYPE.BUSINESS_CARD.REGIST_SCHEDULES,
      value: 'global.over-flow-menu.business-card.regist-schedules',
      imgSrc: '../../../content/images/ic-sidebar-calendar.svg'
    },
    {
      key: OVER_FLOW_MENU_TYPE.BUSINESS_CARD.REGIST_TASK,
      value: 'global.over-flow-menu.business-card.regist-task',
      imgSrc: '../../../content/images/task/ic-menu-task.svg'
    },
    {
      key: OVER_FLOW_MENU_TYPE.BUSINESS_CARD.POST_DATA,
      value: 'global.over-flow-menu.business-card.post-data',
      imgSrc: '../../../content/images/ic-timeline.svg'
    },
    {
      key: OVER_FLOW_MENU_TYPE.BUSINESS_CARD.CREATE_MAIL,
      value: 'global.over-flow-menu.business-card.create-mail',
      imgSrc: '../../../content/images/ic-sidebar-email.svg'
    }
  ],
  5: [
    {
      key: OVER_FLOW_MENU_TYPE.CUSTOMER.HISTORY_ACTIVITIES,
      value: 'global.over-flow-menu.customer.history-activities',
      imgSrc: '../../../content/images/ic-sidebar-activity.svg'
    },
    {
      key: OVER_FLOW_MENU_TYPE.CUSTOMER.REGIST_ACTIVITIES,
      value: 'global.over-flow-menu.customer.regist-activities',
      imgSrc: '../../../content/images/ic-sidebar-activity.svg'
    },
    {
      key: OVER_FLOW_MENU_TYPE.CUSTOMER.REGIST_SCHEDULES,
      value: 'global.over-flow-menu.customer.regist-schedules',
      imgSrc: '../../../content/images/ic-sidebar-calendar.svg'
    },
    {
      key: OVER_FLOW_MENU_TYPE.CUSTOMER.REGIST_TASK,
      value: 'global.over-flow-menu.customer.regist-task',
      imgSrc: '../../../content/images/task/ic-menu-task.svg'
    },
    {
      key: OVER_FLOW_MENU_TYPE.CUSTOMER.POST_DATA,
      value: 'global.over-flow-menu.customer.post-data',
      imgSrc: '../../../content/images/ic-timeline.svg'
    },
    {
      key: OVER_FLOW_MENU_TYPE.CUSTOMER.CREATE_MAIL,
      value: 'global.over-flow-menu.customer.create-mail',
      imgSrc: '../../../content/images/ic-sidebar-email.svg'
    },
    {
      key: OVER_FLOW_MENU_TYPE.CUSTOMER.REGIST_BUSINESS_CARD,
      value: 'global.over-flow-menu.customer.regist-business-card',
      imgSrc: '../../../content/images/ic-sidebar-business-card.svg'
    },
    {
      key: OVER_FLOW_MENU_TYPE.CUSTOMER.REGIST_CUSTOMER_CHILD,
      value: 'global.over-flow-menu.customer.regist-business-child',
      imgSrc: '../../../content/images/Group 16.svg'
    }
  ],
  8: [
    {
      key: OVER_FLOW_MENU_TYPE.EMPLOYEE.HISTORY_ACTIVITIES,
      value: 'global.over-flow-menu.employee.history-activities',
      imgSrc: '../../../content/images/ic-sidebar-activity.svg'
    },
    {
      key: OVER_FLOW_MENU_TYPE.EMPLOYEE.REGIST_SCHEDULES,
      value: 'global.over-flow-menu.employee.regist-schedules',
      imgSrc: '../../../content/images/ic-sidebar-calendar.svg'
    },
    {
      key: OVER_FLOW_MENU_TYPE.EMPLOYEE.REGIST_TASK,
      value: 'global.over-flow-menu.employee.regist-task',
      imgSrc: '../../../content/images/task/ic-menu-task.svg'
    },
    {
      key: OVER_FLOW_MENU_TYPE.EMPLOYEE.POST_DATA,
      value: 'global.over-flow-menu.employee.post-data',
      imgSrc: '../../../content/images/ic-timeline.svg'
    },
    {
      key: OVER_FLOW_MENU_TYPE.EMPLOYEE.CREATE_MAIL,
      value: 'global.over-flow-menu.employee.create-mail',
      imgSrc: '../../../content/images/ic-sidebar-email.svg'
    }
  ],
  15: [
    {
      key: OVER_FLOW_MENU_TYPE.TASK.REGIST_TASK,
      value: 'global.over-flow-menu.task.regist-task',
      imgSrc: '../../../content/images/task/ic-time1.svg'
    },
    {
      key: OVER_FLOW_MENU_TYPE.TASK.REGIST_MILESTOME,
      value: 'global.over-flow-menu.task.regist-milestone',
      imgSrc: '../../../content/images/task/ic-flag-brown.svg'
    },
    {
      key: OVER_FLOW_MENU_TYPE.TASK.REGIST_ACTIVITIES,
      value: 'global.over-flow-menu.task.regist-activities',
      imgSrc: '../../../content/images/ic-sidebar-activity.svg'
    },
    {
      key: OVER_FLOW_MENU_TYPE.TASK.POST_DATA,
      value: 'global.over-flow-menu.task.post-data',
      imgSrc: '../../../content/images/ic-timeline.svg'
    }
  ],
  1502: [
    {
      key: OVER_FLOW_MENU_TYPE.SUB_TASK.REGIST_ACTIVITIES,
      value: 'global.over-flow-menu.sub-task.regist-activities',
      imgSrc: '../../../content/images/ic-sidebar-activity.svg'
    },
    {
      key: OVER_FLOW_MENU_TYPE.SUB_TASK.POST_DATA,
      value: 'global.over-flow-menu.sub-task.post-data',
      imgSrc: '../../../content/images/ic-timeline.svg'
    }
  ],
  1501: [
    {
      key: OVER_FLOW_MENU_TYPE.MILE_STONE.REGIST_TASK,
      value: 'global.over-flow-menu.mile-stone.regist-task',
      imgSrc: '../../../content/images/task/ic-menu-task.svg'
    },
    {
      key: OVER_FLOW_MENU_TYPE.MILE_STONE.REGIST_ACTIVITIES,
      value: 'global.over-flow-menu.mile-stone.regist-activities',
      imgSrc: '../../../content/images/ic-sidebar-activity.svg'
    },
    {
      key: OVER_FLOW_MENU_TYPE.MILE_STONE.POST_DATA,
      value: 'global.over-flow-menu.mile-stone.post-data',
      imgSrc: '../../../content/images/ic-timeline.svg'
    }
  ],
  1503: [
    {
      key: OVER_FLOW_MENU_TYPE.TASK.REGIST_TASK,
      value: 'global.over-flow-menu.task.regist-task',
      imgSrc: '../../../content/images/task/ic-time1.svg'
    },
    {
      key: OVER_FLOW_MENU_TYPE.TASK.REGIST_MILESTOME,
      value: 'global.over-flow-menu.task.regist-milestone',
      imgSrc: '../../../content/images/task/ic-flag-brown.svg'
    },
    {
      key: OVER_FLOW_MENU_TYPE.TASK.POST_DATA,
      value: 'global.over-flow-menu.task.post-data',
      imgSrc: '../../../content/images/ic-timeline.svg'
    }
  ],
  1504: [
    {
      key: OVER_FLOW_MENU_TYPE.SUB_TASK.POST_DATA,
      value: 'global.over-flow-menu.sub-task.post-data',
      imgSrc: '../../../content/images/ic-timeline.svg'
    }
  ],
  16: [
    {
      key: OVER_FLOW_MENU_TYPE.PRODUCTS_TRADING.REGIST_ACTIVITIES,
      value: 'global.over-flow-menu.product-trading.regist-activities',
      imgSrc: '../../../content/images/ic-sidebar-activity.svg'
    },
    {
      key: OVER_FLOW_MENU_TYPE.PRODUCTS_TRADING.ACTIVE_HISTORY,
      value: 'global.over-flow-menu.product-trading.active-history',
      imgSrc: '../../../content/images/ic-check-list-clock.svg'
    },
    {
      key: OVER_FLOW_MENU_TYPE.PRODUCTS_TRADING.REGIST_TASK,
      value: 'global.over-flow-menu.product-trading.regist-task',
      imgSrc: '../../../content/images/task/ic-menu-task.svg'
    },
    {
      key: OVER_FLOW_MENU_TYPE.PRODUCTS_TRADING.REGIST_SCHEDULES,
      value: 'global.over-flow-menu.product-trading.regist-schedules',
      imgSrc: '../../../content/images/ic-sidebar-calendar.svg'
    }
  ]
};

export const SERVICE_TYPE = {
  HAVE_DYNAMIC_DATA: 1,
  DONT_HAVE_DYNAMIC_DATA: 2
};

export const RELATION_LOOKUP_AVAILABLE_FLAG = {
  AVAILABLE: 1,
  UNAVAILABLE: 2
};

export const CUSTOM_OVER_FIELD_NAME_LIST = [
  'task_name',
  CUSTOMER_SPECIAL_LIST_FIELD.CUSTOMER_NAME,
  CUSTOMER_SPECIAL_LIST_FIELD.PERSON_IN_CHARGE
];

export const FIELD_NAME = {
  PRODUCT_TRADING_PROGRESS_ID: 'product_trading_progress_id',
  CONTACT_DATE: 'contact_date',
  FIELD_NAME_CONTACT_DATE_TO_API: 'last_contact_date'
};
