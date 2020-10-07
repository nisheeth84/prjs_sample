import { isOutRange } from 'app/shared/helpers';
import { isEmpty, lte, gte, gt } from 'ramda';
import { translate } from 'react-jhipster';
export const CUSTOMER_LIST_ID = 'CUSTOMER_LIST_ID';
export const BUSINESS_CARD_LIST_ID = 'BUSINESS_CARD_LIST_ID';
export const ADD_DEPARTMENT_TO_BUSINESS_CARD = 'add-department-to-business-card';
export const MAX_LENGTH_DEPARTMENT_NAME = 100;

export const AVAILABLE_FLAG = {
  UNAVAILABLE: 0,
  WEB_APP_AVAILABLE: 3
};

export const CUSTOMER_DEF = {
  FIELD_BELONG: 5,
  EXTENSION_BELONG_LIST: 1,
  EXTENSION_BELONG_SEARCH: 2
};

export const GET_LIST_TYPE = {
  ALL: 1,
  BASE_ON_USE_LOGIN: 2,
  BASE_ON_OWNER_SHARE_LIST: 3
};

export const CUSTOMER_LIST_TYPE = {
  ALL_LIST: 0,
  MY_LIST: 1,
  SHARED_LIST: 2,
  FAVORITE_LIST: 3,
  CARD: 'LIST CARD',
  CUSTOMER_IN_CHARGE: 5
};

export const TYPE_MSG_EMPTY = {
  NONE: 0,
  FILTER: 1,
  SEARCH: 2
};

export const SELECT_TARGET_TYPE = {
  ALL_LIST: 0,
  MY_LIST: 3,
  SHARED_LIST: 4,
  // FAVORITE_LIST: 4,
  CUSTOMER_IN_CHARGE: 1
};

export const PARTICIPANT_TYPE = {
  MEMBER: 1,
  OWNER: 2
};

export const LIST_TYPE = {
  MY_LIST: 1,
  SHARE_LIST: 2
};

export const SHARE_LIST_MODES = {
  // setting mode add condition search employee
  ADD_CONDITION_SEARCH_MANUAL: 1,
  ADD_CONDITION_SEARCH_AUTO: 2,
  // actions with group
  MODE_CREATE_LIST: 1,
  MODE_EDIT_LIST: 2,
  MODE_COPY_LIST: 3,
  MODE_CREATE_LIST_LOCAL: 4,
  MODE_SWICH_LIST_TYPE: 5
};

/**
 * CONST My List Modal
 */
export const CUSTOMER_MY_LIST_MODES = {
  MODE_CREATE_LIST: 1,
  MODE_EDIT_LIST: 2,
  MODE_COPY_LIST: 3,
  MODE_CREATE_LIST_LOCAL: 4
};

export const SHOW_MESSAGE_SUCCESS = {
  NONE: 0,
  CREATE: 1,
  UPDATE: 2,
  DELETE: 3
};

export const CUSTOMER_NAME_CONPANY = [
  { type: 1, text: '' },
  { type: 1, text: '' },
  { type: 1, text: '株式会社' },
  { type: 2, text: '株式会社' },
  { type: 1, text: '有限会社' },
  { type: 2, text: '有限会社' },
  { type: 1, text: '財団法人' },
  { type: 1, text: '社団法人' },
  { type: 1, text: '学校法人' }
];

export const CUSTOMER_NAME_COMPANY_FIELD = [
  { itemId: 1, itemLabel: '（なし・その他）' },
  { itemId: 2, itemLabel: '株式会社（前）' },
  { itemId: 3, itemLabel: '株式会社（後）' },
  { itemId: 4, itemLabel: '有限会社（前）' },
  { itemId: 5, itemLabel: '有限会社（後）' },
  { itemId: 6, itemLabel: '財団法人（前）' },
  { itemId: 7, itemLabel: '社団法人（前）' },
  { itemId: 8, itemLabel: '学校法人（前）' }
];

export const CUSTOMER_REMOVE_FIELD_CREATE = {
  customerCompanyDescription: 'company_description',
  customerBusinessSub: 'business_sub_id',
  customerScenario: 'scenario_id',
  customerProductData: 'productTradingData',
  customerPhoto: 'photo_file_path',
  employeeId: 'employee_id',
  lastContactDate: 'last_contact_date',
  scheduleNext: 'schedule_next',
  actionNext: 'action_next',
  isDisplayChildCustomers: 'is_display_child_customers'
};

export const CUSTOMER_REMOVE_FIELD_UPDATE = {
  customerCompanyDescription: 'company_description',
  customerBusinessSub: 'business_sub_id',
  customerProductData: 'productTradingData',
  customerPhoto: 'photo_file_path',
  customerScenario: 'scenario_id',
  employeeId: 'employee_id',
  lastContactDate: 'last_contact_date',
  scheduleNext: 'schedule_next',
  actionNext: 'action_next',
  isDisplayChildCustomers: 'is_display_child_customers'
};

export const CUSTOMER_SPECIAL_FIELD_NAMES = {
  customerCompanyDescription: 'company_description',
  customerBusinessMain: 'business_main_id',
  customerBusinessSub: 'business_sub_id',
  customerTransactionAmount: 'total_trading_amount',
  customerScenario: 'scenario_id',
  customerProductData: 'productTradingData',
  customerPhoto: 'photo_file_path',
  parentId: 'parent_id',
  employeeId: 'employee_id',
  customerLogo: 'customer_logo',
  customerAddress: 'customer_address',
  personInCharge: 'person_in_charge',
  scheduleNext: 'schedule_next',
  actionNext: 'action_next',
  customerId: 'customer_id',
  createdDate: 'created_date',
  createdUser: 'created_user',
  updatedDate: 'updated_date',
  updatedUser: 'updated_user',
  lastContactDate: 'last_contact_date',
  customerName: 'customer_name',
  isDisplayChildCustomers: 'is_display_child_customers',
  customerParent: 'customer_parent',
  url: 'url'
};

export const CUSTOMER_SPECIAL_LIST_FIELD = {
  CUSTOMER_PARENT: 'customer_parent',
  BUSINESS_MAIN_ID: 'business_main_id',
  BUSINESS_SUB_ID: 'business_sub_id',
  SCENARIO: 'scenario_id',
  SCHEDULE_NEXT: 'schedule_next',
  ACTION_NEXT: 'action_next',
  CREATED_USER: 'created_user',
  UPDATED_USER: 'updated_user',
  DISPLAY_CHILD_CUSTOMERS: 'is_display_child_customers',
  LAST_CONTACT_DATE: 'last_contact_date',
  // default display special
  PERSON_IN_CHARGE: 'person_in_charge',
  CUSTOMER_LOGO: 'customer_logo',
  // business for filter
  BUSINESS: 'business',
  // for edit list
  CUSTOMER_NAME: 'customer_name',
  CREATED_DATE: 'created_date',
  UPDATED_DATE: 'updated_date',
  CUSTOMER_ADDRESS: 'customer_address',
  URL: 'url'
};

export const EDIT_SPECIAL_ITEM = {
  BUSINESS: 'business'
};

export const CUSTOMER_GET_FIELD_TAB = 'customerGetFieldTab';

export const PRODUCT_ACTION_TYPES = {
  CREATE: 0,
  UPDATE: 1
};

export const SEARCH_MODE = {
  NONE: 0,
  TEXT_DEFAULT: 1,
  CONDITION: 2
};

export const SCENARIO_SEARCH_MODES = {
  START_DATE: 1,
  END_DATE: 2
};

export const DISPLAY_RANGE = {
  SHOW_ALL: 1,
  DISPLAY_ONLY_USER_LOGIN: 2,
  ALL_CUSTOMER: 3,
  CUSTOMER_CURRENT_OPEN: 4
};

export enum NETWORK_MAP_MODE {
  TREE = 1,
  TABLE
}

export enum TYPE_ADD_SCENARIO {
  ADD,
  ADDREMOVE
}

export enum TYPE_CHILD_SCENARIO {
  MILESTONE,
  TASK
}

export enum NETWORK_MAP_VIEW_TYPE {
  TAB = 1,
  MODAL
}

export const isViewAsTab = viewType => viewType === NETWORK_MAP_VIEW_TYPE.TAB;
export const isViewAsModal = viewType => viewType === NETWORK_MAP_VIEW_TYPE.MODAL;

export const SCREEN_TYPES = {
  CUSTOMER_INTEGRATION: 'customer-integration'
};

export const SCALE_CHANGE_RANGE = 0.1;
export const MAX_VALUE_SCALE = 3;
export const MIN_VALUE_SCALE = 1;
export const isScaleValueOutOfRange = isOutRange(MIN_VALUE_SCALE, MAX_VALUE_SCALE);
export const isLessThanMaxScale = gte(MAX_VALUE_SCALE + SCALE_CHANGE_RANGE);
export const isGreaterThanMinScale = lte(MIN_VALUE_SCALE - SCALE_CHANGE_RANGE);

export const BUSINESS_CARDS_LENGTH = 2;
export const COUNT_MAX_EMPLOYMENTS = 4;

export const RESPONSE_FIELD_NAME = {
  URL: 'url',
  MEMO: 'memo',
  CUSTOMER_ALIAS_NAME: 'customer_alias_name',
  SCHEDULE_NEXT: 'schedule_next',
  CUSTOMER_LOGO: 'customer_logo',
  CREATED_DATE: 'created_date',
  CREATED_USER: 'created_user',
  ACTION_NEXT: 'action_next',
  UPDATED_DATE: 'updated_date',
  UPDATED_USER: 'updated_user',
  IS_DISPLAY_CHILD_CUSTOMERS: 'is_display_child_customers',
  SCENARIO_ID: 'scenario_id',
  CUSTOMER_ID: 'customer_id',
  CUSTOMER_PARENT: 'customer_parent',
  CUSTOMER_NAME: 'customer_name',
  PHONE_NUMBER: 'phone_number',
  CUSTOMER_ADDRESS: 'customer_address',
  PERSON_IN_CHARGE: 'person_in_charge',
  BUSINESS: 'business'
};

export const CUSTOMER_MODES = {
  NONE: 'none',
  ADD: 'add',
  REMOVE: 'remove'
};

  export const PRODUCT_DEF = {
  FIELD_BELONG: 7,
  EXTENSION_BELONG_LIST: 1,
  EXTENSION_BELONG_SEARCH: 2
};

export const CUSTOMER_ACTION_TYPES = {
  CREATE: 0,
  UPDATE: 1
};

export const CUSTOMER_VIEW_MODES = {
  EDITABLE: 0,
  PREVIEW: 1
};

export const DND_ITEM_TYPES = {
  SINGLE_MILESTONE_CARD: 'SingleMilestoneCard',
  SINGLE_TASK_CARD: 'SingleTaskCard',
  CREATE_MILESTONE_BUTTON: 'CreateMilestoneButton',
  RELATED_TASK_CARD: 'RelatedTaskCard'
};

export const SCENARIO_TABS = {
  MILESTONE: 0,
  TASK: 1
};

export const MILESTONE_STATUS = {
  DONE: 1,
  DOING: 0
};

export const TASK_STATUS = {
  DONE: 3,
  DOING: 2,
  TODO: 1
};

export const MILESTONE_MODE = {
  DISPLAY: 'display',
  EDIT: 'edit'
};

export const TAB_ID_LIST = {
  summary: 0,
  networkConnection: 11,
  activityHistory: 12,
  tradingProduct: 1,
  calendar: 9,
  task: 5,
  mail: 6, // TODO
  revenueChart: 10,
  changeHistory: 2,
  contactHistory: 7,
  scenario: 20,
  customer: 4,
  businessCard: 3
};

export const FIELD_ITEM_TYPE_DND = {
  SWICH_ORDER: 'SwichOrderTypeItemCard',
  ADD_FIELD: 'AddFieldTypeItemCard'
};

export const ITEM_TYPE = {
  itemTypeSchedule: 3
};

export const BADGES = {
  maxBadges: 99
};
