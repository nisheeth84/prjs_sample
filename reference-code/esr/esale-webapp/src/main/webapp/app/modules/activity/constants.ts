import { ProductType } from './models/get-product-suggestions-type';
import { ProductTradingsType } from './models/get-activity-type';

export const MENU_TYPE = {
  ALL_ACTIVITY: 0,
  MY_ACTIVITY: 1,
  DRAFT_ACTIVITY: 2,
  BUSINESS_CARD_LIST: 3,
  CUSTOMER_LIST: 4,
  PRODUCT_LIST: 5
};

export const dateFormat = 'YYYY/MM/DD';
export const timeFormat = 'HH:mm';
export const INTERVAL_TIME_MILI = 2000; // interval check
export const ACTION_TYPES = {
  ACTIVITY_GET_ADD: 'activity/GET_ADD',
  ACTIVITY_GET_EDIT: 'activity/GET_EDIT',
  ACTIVITY_CREATE: 'activity/CREATE',
  ACTIVITY_UPDATE: 'activity/UPDATE',
  ACTIVITY_RESET: 'activity/RESET',
  ACTIVITY_DELETE: 'activity/ACTIVITY_DELETE',
  ACTIVITY_DELETE_DRAFT: 'activity/ACTIVITY_DELETE_DRAFT',
  ACTIVITY_GET_ACTIVITY_LAYOUT: 'activity/GET_ACTIVITY_LAYOUT',
  ACTIVITY_CREATE_ACTIVITY: 'activity/CREATE_ACTIVITY',
  SALES_GET_PRODUCT_TRADINGS: 'sales/GET_PRODUCT_TRADINGS',
  ACTIVITY_GET_ACTIVITY: 'activity/GET_ACTIVITY',
  TOGGLE_MODAL_FORM_ACTIVITY: 'activity/TOGGLE_MODAL_FORM_ACTIVITY',
  GET_ACTIVITIES: 'activity/GET_ACTIVITIES',
  UPDATE_ACTIVITY_FORM_SEARCH: 'activity/UPDATE_ACTIVITY_FORM_SEARCH',
  TOGGLE_MODAL_CONFIRM_RESTORE_DRAFT: 'activity/TOGGLE_MODAL_CONFIRM_RESTORE_DRAFT',
  TOGGLE_POPUP_SEARCH_CONDITION: 'activity/TOGGLE_POPUP_SEARCH_CONDITION',
  CHECK_DRAFT: 'activity/CHECK_DRAFT',
  UPDATE_ACTIVITY_INFO: 'activity/UPDATE_ACTIVITY_INFO',
  GET_PRODUCT_SUGGESTION: 'sales/GET_PRODUCT_SUGGESTION',
  TOGGLE_CONFIRM_POPUP: 'activity/TOGGLE_CONFIRM_POPUP',
  CLEAR_RESPONSE_DATA: 'activity/CLEAR_RESPONSE_DATA',
  GET_BUSINESS_CARD_LIST: 'activity/GET_BUSINESS_CARD_LIST',
  GET_CUSTOMER_LIST: 'activity/GET_CUSTOMER_LIST',
  ACTIVITY_SAVE_ACTIVITY: 'activity/ACTIVITY_SAVE_ACTIVITY',
  TOGGLE_MODAL_DETAIL_ACTIVITY: 'activity/TOGGLE_MODAL_DETAIL_ACTIVITY',
  UPDATE_ACTITVITY_DETAIL_INDEX: 'activity/UPDATE_ACTITVITY_DETAIL_INDEX',
  GET_LAZY_ACTIVITIES: 'activity/GET_LAZY_ACTIVITIES',
  GET_ACTIVITY_HISTORY: 'activity/GET_ACTIVITY_HISTORY',
  GET_LAZY_ACTIVITY_HISTORY: 'activity/GET_LAZY_ACTIVITY_HISTORY',
  DOWNLOAD_ACTIVITY: 'activity/DOWNLOAD_ACTIVITY',
  GET_LIST: 'sales/GET_LIST',
  GET_SCENARIO: 'customer/GET_SCENARIO',
  SHOW_DETAIL: 'activity/SHOW_DETAIL',
  SHOW_DETAIL_REGISTERED: 'activity/SHOW_DETAIL_REGISTERED',
  SHOW_DETAIL_DEREGISTERED: 'activity/SHOW_DETAIL_DEREGISTERED',
  CHANGE_TO_EDIT: 'activity/CHANGE_TO_EDIT',
  CHANGE_TO_DISPLAY: 'activity/CHANGE_TO_DISPLAY',
  ACTIVITY_UPDATE_CUSTOM_FIELD_INFO: 'activity/ACTIVITY_UPDATE_CUSTOM_FIELD_INFO',
  GET_CUSTOMERS: 'activity/GET_CUSTOMERS',
  GET_BUSINESS_CARDS: 'activity/GET_BUSINESS_CARDS',
  GET_PRODUCT_TRADINGS: 'activity/GET_PRODUCT_TRADINGS',
  SAVE_ACTIVITY_DRAFT: 'activity/SAVE_ACTIVITY_DRAFT',
  SAVE_ACTIVITY_DRAFT_MANUAL: 'activity/SAVE_ACTIVITY_DRAFT_MANUAL',
  GET_ACTIVITIES_DRAFT: 'activity/GET_ACTIVITIES_DRAFT',
  GET_LAZY_ACTIVITIES_DRAFT: 'activity/GET_LAZY_ACTIVITIES_DRAFT',
  RESET_ACTIVITY_LIST_SCROLL: 'activity/RESET_ACTIVITY_LIST_SCROLL',
  ACTIVITY_GET_ACTIVITY_DRAFT: 'activity/ACTIVITY_GET_ACTIVITY_DRAFT',
  GET_CUSTOMER: 'activity/GET_CUSTOMER',
  GET_CUSTOMERS_BY_IDS: 'activity/GET_CUSTOMERS_BY_IDS',
  CLEAR_SHOW_DETAIL: 'activity/CLEAR_SHOW_DETAIL',
  IS_EDIT_TO_DETAIL: 'activity/IS_EDIT_TO_DETAIL',
  ACTIVITY_GET_ACTIVITY_DETAIL: 'activity/ACTIVITY_GET_ACTIVITY_DETAIL',
  GET_MILESTONES_BY_IDS: 'activity/GET_MILESTONES_BY_IDS',
  GET_TASKS_BY_IDS: 'activity/GET_TASKS_BY_IDS',
  GET_SCHEDULES_BY_IDS: 'activity/GET_SCHEDULES_BY_IDS',
  RESET_ACTIVITY_DRAFT: 'activity/RESET_ACTIVITY_DRAFT',
  CLEAR_MESSAGE: 'activity/CLEAR_MESSAGE',
  TASK_DETAIL_RESET: 'taskDetail/RESET_DETAIL_TASK',
  ACTIVITY_DRAFT_DISCARD: 'activity/ACTIVITY_DRAFT_DISCARD'
};

export const TAB_ID_LIST = {
  summary: 0,
  changeHistory: 2
};

export const BADGES = {
  maxBadges: 99
};

export const RESPONSE_FIELD_NAME = {
  ACTIVITY_DURATION: 'activityDuration',
  ACTIVITY_START_TIME: 'activityStartTime',
  ACTIVITY_END_TIME: 'activityEndTime',
  CREATED_DATE: 'createdDate',
  CREATED_USER: 'createdUser',
  UPDATED_DATE: 'updatedDate',
  UPDATED_USER: 'updatedUser',
  NEXT_SCHEDULE_ID: 'nextScheduleId',
  SCENARIO: 'scenario',
  PRODUCT_TRADING_ID: 'productTradingId',
  ACTIVITY_TARGET_ID: 'activityTargetId',
  INTERVIEWER: 'interviewer',
  CUSTOMER_ID: 'customerId',
  CUSTOMER_RELATION_ID: 'customerRelationId',
  ACTIVITY_FORMAT_ID: 'activityFormatId',
  CONTACT_DATE: 'contactDate',
  EMPLOYEE_ID: 'employeeId',
  ACTIVITY_TIME: 'activityTime'
};

export const convertProductTrading = (products: ProductTradingsType[]) => {
  const res: ProductTradingsType[] = [];
  if (products && products.length > 0) {
    products.forEach(pro => {
      res.push({
        productTradingId: pro.productTradingId,
        customerId: pro.customerId,
        productId: pro.productId,
        quantity: pro.quantity,
        price: pro.price,
        amount: pro.amount,
        productTradingProgressId: pro.productTradingProgressId,
        endPlanDate: pro.endPlanDate,
        orderPlanDate: pro.orderPlanDate,
        memo: pro.memo,
        productTradingData: pro.productTradingData
      });
    });
  }
  return res;
};

export const convertToProductTrading = (products: ProductType[]) => {
  const res: ProductTradingsType[] = [];
  if (products && products.length > 0) {
    products.forEach(pro => {
      res.push({
        productTradingId: null,
        customerId: null,
        productId: pro.productId,
        productName: pro.productName,
        quantity: 1,
        price: pro.unitPrice,
        amount: pro.unitPrice,
        productTradingProgressId: null,
        progressName: null,
        endPlanDate: null,
        orderPlanDate: null,
        employee: null,
        memo: pro.memo
      });
    });
  }
  return res;
};

export enum FSActionTypeScreen {
  None,
  RemoveSession,
  SetSession,
  GetSession,
  CloseWindow,
  Search,
  DeleteSuccess
}

export const SPECIAL_FIELD_NAMES = {
  activityDuration: 'activity_duration',
  activityStartTime: 'activity_start_time',
  activityEndTime: 'activity_end_time',
  createdDate: 'created_date',
  createdUser: 'created_user',
  updatedDate: 'updated_date',
  updatedUser: 'updated_user',
  nextScheduleId: 'next_schedule_id',
  scenario: 'scenario_id',
  productTradingId: 'product_trading_id',
  activityTargetId: 'activity_target_id',
  scheduleId: 'schedule_id',
  taskId: 'task_id',
  milestoneId: 'milestone_id',
  interviewer: 'interviewer',
  businessCardId: 'business_card_id',
  customerId: 'customer_id',
  customerRelationId: 'customer_relation_id',
  activityFormatId: 'activity_format_id',
  contactDate: 'contact_date',
  employeeId: 'employee_id',
  createBy: 'created_user',
  updateBy: 'updated_user',
  activityTime: 'activity_time',
  activityId: 'activity_id'
};

export const PRODUCT_SPECIAL_FIELD_NAMES = {
  productCategories: 'product_categories',
  isDisplay: 'is_display',
  productSurname: 'productSurname',
  productTypeId: 'product_type_id',
  productName: 'product_name',
  productCategoryId: 'product_category_id',
  createDate: 'created_date',
  createBy: 'created_user',
  updateDate: 'updated_date',
  productsSets: 'product_relation_id',
  updateBy: 'updated_user',
  productImageName: 'product_image_name',
  productId: 'product_id',
  unitPrice: 'unit_price',
  productTradingProgressId: 'product_trading_progress_id'
};

export enum TYPE_DETAIL_MODAL {
  EMPLOYEE,
  SCHEDULE,
  TASK,
  MILESTONE,
  CUSTOMER,
  BUSINESS_CARD,
  PRODUCT
}

export enum TYPE_SEARCH {
  LOCAL,
  FILTER,
  DETAIL,
  NAVIGATION
}

export enum ACTIVITY_VIEW_MODES {
  EDITABLE,
  PREVIEW
}

export enum ACTIVITY_ACTION_TYPES {
  CREATE,
  UPDATE
}

export const TIMEOUT_TOAST_MESSAGE = 10000;

export const SEARCH_MODE = {
  NONE: 0,
  TEXT_DEFAULT: 1,
  CONDITION: 2,
  BY_MENU: 3
};

export const CURRENCY = '円';

export const PREFIX_PRODUCT_SET_DETAIL = {
  enUs: '',
  jaJp: 'セット',
  zhCn: ''
};

export const FIELD_TYPE = {
  NUMBER: '5',
  TEXT: '9',
  TEXT_AREA: '10',
  FILE: '11',
  RELATION: '17',
  ADDRESS: '14'
};

export const LICENSE = {
  TIMELINE_LICENSE: 3,
  ACTIVITIES_LICENSE: 6,
  CALENDAR_LICENSE: 2
};

export const MODE_CONFIRM = {
  DELETE: 0
};

export const specialFieldsProductTrading = {
  employeeId: 'employee_id',
  endPlanDate: 'end_plan_date',
  orderPlanDate: 'order_plan_date',
  amount: 'amount',
  price: 'price'
};


export const PARAMS_SCHEDULE = [
  "activityDraftId",
  "scheduleId",
  "updateFlag",
  "scheduleTypeId",
  "scheduleName",
  "startDay",
  "endDay",
  "startTime",
  "endTime",
  "isFullDay",
  "isRepeated",
  "repeatType",
  "repeatCycle",
  "regularDayOfWeek",
  "regularWeekOfMonth",
  "regularDayOfMonth",
  "regularEndOfMonth",
  "repeatEndType",
  "repeatEndDate",
  "repeatNumber",
  "repeatCondition",
  "customerId",
  "customerRelatedIds",
  "zipCode",
  "address",
  "addressBelowPrefectures",
  "buildingName",
  "productTradingIds",
  "otherParticipantIds",
  "businessCardIds",
  "isAllAttended",
  "equipmentTypeId",
  "equipmentFlag",
  "note",
  "milestoneIds",
  "taskIds",
  "isPublic",
  "canModify",
  "participants",
  "sharers",
  "equipments",
  "allFiles",
  "createdDate",
  "createdUser",
  "updatedDate",
  "updatedUser",
  "scheduleFiles"
]