/**
 * value record limit
 */
export const LimitRecord = {
  DEFAULT: 5,
  LIMIT_15: 15,
  LIMIT_20: 20,
  LIMIT_30: 30
}

/**
 * tabId list
 */
export const TabsList = {
  BASIC_INFO: 0,
  ACTIVITY_HISTORY: 8,
  CALENDAR: 9,
  CONTACT_HISTORY: 11,
  CHANGE_HISTORY: 2,
  TRADING_PRODUCT: 1,
  SCHEDULE: 13,
  TASK: 5,
  MAIL: 100,
  ACTIVITY_HISTORY_INFORMATION: 12,
  NETWORK_BUSINESS_CARD: 11,
  SCENARIO: 20,
}

/**
 * follow taget type
 */
export const FollowTargetType = {
  CUSTOMER: 1,
  BUSINESS_CARD: 2,
  MEMBER: 3
}

export enum FieldName {
  parentId = "customer_parent",
  employeeId = "employee_id",
  scenario = "scenario",
  business= "business_main_id",
  nextScheduleId = "next_schedule_id",
  nextActionId = "next_action_id",
  personInCharge = "person_in_charge",
  createdUser = "created_user",
  updatedUser = "updated_user",
}
export enum PopupType {
  POSITION_MODAL = 1,
  TRADING_PRODUCT_MODAL = 2
}

export enum PositionType {
  HAVE_POSITION = 1,
  NOT_POSITION = 2
}

/**
 * Message type
*/
export enum MessageType {
  DEFAULT = 0,
  NO_DATA = 1,
  SUCCESS = 2,
  ERROR = 3,
  DELETE_SUCCESS = 4,
}

export enum TabName {
  INFO_BASIC = "info-basic-tab",
  ACTIVITY_HISTORY = "activity-history-tab",
  CHANGE_HISTORY = "change-history-tab",
  TRADING_PRODUCT = "trading-product-tab",
  CALENDAR = "calendar-tab",
  TASK = "task-tab",
  MAIL = "mail-tab",
  ACTIVITY_HISTORY_INFORMATION = "activity-history-information-tab",
  NETWORK_BUSINESS_CARD = "network-business-card-tab"
}
