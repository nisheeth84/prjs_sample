export enum StackScreen {
  ACTIVITIES = "activities",
  ACTIVITY_LIST = "activityList",
  ACTIVITY_CREATE_EDIT = "activityCreateEdit",
  ACTIVITY_DETAIL = "activityDetail",
  BUSINESS_CARD_LIST = "businessCardList",
  PRODUCT_TRADING_LIST = "productTradingList",
  PRODUCT_TRADING_DETAIL = "productTradingDetail",
  LIST_TIME_LINE = "timeLine",
  EMPLOYEE_DETAIL = "detail-employee",
  CALENDAR_DETAILS = "calendar-details",
  CUSTOMER_DETAILS = "customer-detail",
  CUSTOMER_NAVIGATOR = "customer-navigator",
  TASK_STACK = "task-stack",
  PRODUCT_TRADING_MANAGER_STACK = "product-trading-manager-stack",
  BUSINESS_CARD_STACK = "business-card-stack",
  CALENDAR_SCREEN = "calendar-screen",
  TIME_LINE_STACK = "time-line-stack",
  DRAWER_ACTIVITY = "drawer-activity",
  TASK_DETAIL = "task-detail",
  MILESTONE_DETAIL = "milestone-detail",
  BUSINESS_CARD_DETAIL = "business-card-detail"
}

export enum SelectedTargetType {
  ALL_TYPE = 0,
  EMPLOYEE_TYPE = 1,
  CUSTOMER_TYPE = 3,
  BUSINESS_CARD_TYPE = 4,
  PRODUCT_TRADING_TYPE = 5,
  PRODUCT_TRADING_DETAIL,
}
export enum StatusMessage{
  STATUS_MESSAGE = 200
}

export enum SpecialFieldInfo {
  CONTACT_DATE = "contact_date",
  ACTIVITY_TIME = "activity_time",
  ACTIVITY_TARGET_ID = "activity_target_id",
  ACTIVITY_FORMAT_ID = "activity_format_id",
  CUSTOMER_ID = "customer_id",
  INTERVIEWER = "interviewer",
  CUSTOMER_RELATION_IDS = "customer_relation_id",
  NEXT_SCHEDULE_ID = "next_schedule_id",
  SCENARIO_ID = "scenario_id",
  PRODUCT_TRADING_ID = "product_trading_id",
}

export const SpecialFieldInfoArr: Array<string> = [
  SpecialFieldInfo.CONTACT_DATE,
  SpecialFieldInfo.ACTIVITY_TIME,
  SpecialFieldInfo.ACTIVITY_TARGET_ID,
  SpecialFieldInfo.ACTIVITY_FORMAT_ID,
  SpecialFieldInfo.CUSTOMER_ID,
  SpecialFieldInfo.INTERVIEWER,
  SpecialFieldInfo.CUSTOMER_RELATION_IDS,
  SpecialFieldInfo.NEXT_SCHEDULE_ID,
  SpecialFieldInfo.SCENARIO_ID,
  SpecialFieldInfo.PRODUCT_TRADING_ID,
]

export enum ActivityDefaultFieldInfo {
  CREATED_USER = "created_user",
  UPDATED_DATE = "updated_date",
  UPDATED_USER = "updated_user",
  CREATED_DATE = "created_date",
  CONTACT_DATE = "contact_date",
  ACTIVITY_TIME = "activity_time",
  ACTIVITY_FORMAT_ID = "activity_format_id",
  CUSTOMER_ID = "customer_id",
  EMPLOYEE_ID = "employee_id",
  INTERVIEWER = "interviewer",
  CUSTOMER_RELATION_ID = "customer_relation_id",
  NEXT_SCHEDULE_ID = "next_schedule_id",
  PRODUCT_TRADING_ID = "product_trading_id",
  ACTIVITY_TARGET_ID = "activity_target_id",
  MEMO = "memo",
  SCENARIO_ID = "scenario_id",
}

export const FieldInfoNotUse: Array<string> = [
  ActivityDefaultFieldInfo.EMPLOYEE_ID,
  ActivityDefaultFieldInfo.SCENARIO_ID,
  ActivityDefaultFieldInfo.CREATED_DATE,
  ActivityDefaultFieldInfo.CREATED_USER,
  ActivityDefaultFieldInfo.UPDATED_DATE,
  ActivityDefaultFieldInfo.UPDATED_USER
]

export enum TargetReport {
  TASK = "task",
  MILESTONE = "milestone",
  SCHEDULE = "schedule"
}
export enum ProductTradingMode {
  ADD = "add",
  EDIT = "edit",
  DELETE = "delete"
}

/**
 * Confirm type
 */
export enum TypeConfirm {
  DELETE = "delete",
  AGREE = "agree"
}

/**
 * Icon of target report
 */
export enum IconTargetReport {
  ACTIVITY_CALENDAR = "activityCalendar",
  ACTIVITY_FLAG = "activityFlag",
  ACTIVITY_TASK = "activityTask"
}

/**
 * Mode of activity register screen
 */
export enum ActivityRegisterEditMode {
  REGISTER = 1,
  EDIT = 2,
  COPY = 3
}

/**
 * Product trading search type
 */
export enum ProductTradingSearchType {
  PRODUCT_TRADING_SUGGESTION = "product_trading_suggestion",
  PRODUCT_SUGGESTION = "product_suggestion",
}

export enum SelectionListInDrawerType {
  CUSTOMER = "customerListActivity",
  PRODUCT_TRADING = "tradingProductListActivity",
  BUSINESS_CARD = "businessCardListActivities"
}

export enum TypeGetListActivities {
  MY_ACTIVITY = "myActivity",
  ALL_ACTIVITY = "allActivity",
  DRAFT_ACTIVITY = "draftActivity"
}