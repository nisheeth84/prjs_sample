import { FIELD_BELONG, API_CONFIG, API_CONTEXT_PATH } from 'app/config/constants';
import { getValueProp } from 'app/shared/util/entity-utils';

import { ACTION_TYPES as ACTION_TYPES_SALES_LIST } from 'app/modules/sales/sales-list/sales-list.reducer';
// import { ACTION_TYPES as ACTION_TYPES_SALES_MY_GROUP } from 'app/modules/sales/group/sales-group-modal.reducer';

import { ACTION_TYPES as ACTION_TYPES_MY_GROUP } from 'app/modules/employees/group/employee-group-modal.reducer';
import { ACTION_TYPES as ACTION_TYPES_CREATE_EDIT } from 'app/modules/employees/create-edit/create-edit-employee.reducer';
import { ACTION_TYPES as ACTION_TYPES_INVITE } from 'app/modules/employees/inviteEmployees/invite-employees.reducer';
import { ACTION_TYPES as ACTION_TYPES_LIST_EMPLOYEE } from 'app/modules/employees/list/employee-list.reducer';
import { ACTION_TYPES as ACTION_TYPES_DEPARTMENT } from 'app/modules/employees/department/department-regist-edit.reducer';
import { ACTION_TYPES as ACTION_TYPES_CATEGORY_PRODUCT } from 'app/modules/products/category/category-regist-edit.reducer';
import { ACTION_TYPES as ACTION_TYPES_POPUP_PRODUCT } from 'app/modules/products/product-popup/product-edit.reducer';
import { ACTION_TYPES as ACTION_TYPES_LIST_PRODUCT } from 'app/modules/products/list/product-list.reducer';
import { ACTION_TYPES as ACTION_TYPES_SET_PRODUCT } from 'app/modules/products/popup/popup-product-set.reducer';
import { ACTION_TYPES as ACTION_TYPES_LIST_TASK } from 'app/modules/tasks/list/task-list.reducer';
import { ACTION_TYPES as ACTION_TYPES_DETAIL_TASK } from 'app/modules/tasks/detail/detail-task.reducer';
import { ACTION_TYPES as ACTION_TYPES_EDIT_TASKS } from 'app/modules/tasks/create-edit-task/create-edit-task.reducer';
import { ACTION_TYPES as ACTION_TYPES_CREATE_EDIT_MILESTONE } from 'app/modules/tasks/milestone/create-edit/create-edit-milestone.reducer';
import { ACTION_TYPES as ACTION_TYPES_DETAIL_MILESTONE } from 'app/modules/tasks/milestone/detail/detail-milestone.reducer';
import { ACTION_TYPES as ACTION_TYPES_EDIT_SUB_TASKS } from 'app/modules/tasks/create-edit-subtask/create-edit-subtask.reducer';
import { ACTION_TYPES as ACTION_TYPES_MILESTONE } from 'app/modules/tasks/milestone/create-edit/create-edit-milestone.reducer';
import { ACTION_TYPES as ACTION_TYPES_EMPLOYEE_DETAIL } from 'app/modules/employees/popup-detail/popup-employee-detail-reducer';
import { ACTION_TYPES as ACTION_TYPES_EQUEPMENTS } from 'app/modules/setting/calendar/equiqment/equipment-type.reducer';
import { ACTION_TYPES as ACTION_TYPES_SCHEDULE } from 'app/modules/setting/calendar/schedule/schedule-type.reducer';
import { ACTION_TYPES as ACTION_TYPES_GOOGLE_CALENDAR } from 'app/modules/setting/calendar/google/google-calendar.reducer';
import { ACTION_TYPES as ACTION_TYPES_SCENARIO } from 'app/modules/setting/customer/scenarios/scenarios.reducer';
import { ACTION_TYPES as ACTION_TYPES_ACTIVITY_FORMAT } from 'app/modules/setting/task/activity-format/activity-format.reducer';
import { ACTION_TYPES as ACTION_TYPES_PRODUCT_TYPE } from 'app/modules/setting/task-product/product-type-master/product-type-master.reducer';
import { ACTION_TYPES as ACTION_TYPES_PRODUCT_TRADE } from 'app/modules/setting/product/product-trade/product-trade.reducer';
import { ACTION_TYPES as ACTION_TYPES_EMPLOYEE_MASTER } from 'app/modules/setting/employee/employeePosition/job_title_master.reducer';
import { ACTION_TYPES as ACTION_TYPES_PERIOD } from 'app/modules/setting/system/period/period.reducer';
import { ACTION_TYPES as ACTION_TYPES_FEEDBACK } from 'app/shared/layout/menu/feedback/feedback.reducer';
import { ACTION_TYPES as ACTION_TYPES_PRODUCT_DETAIL } from 'app/modules/products/product-detail/product-detail-reducer';
import { ACTION_TYPES as ACTION_TYPES_PRODUCT_SET_DETAIL } from 'app/modules/products/popup-product-set-detail/popup-product-set-detail-reducer';
import { ACTION_TYPES as ACTION_TYPES_GENERAL } from 'app/modules/setting/system/general/general.reducer';
import { ACTION_TYPES as ACTION_TYPES_MASTER_POSITION } from 'app/modules/setting/customer/master-position/master-position.reducer';

import { ACTION_TYPES as ACTION_TYPES_EMPLOYEE_DEPARTMENT } from 'app/modules/employees/department/department-regist-edit.reducer';
import { ACTION_TYPES as ACTION_TYPES_RESET_PASSWORD_INIT } from 'app/modules/account/password/password-reset.reducer';
import { ACTION_TYPES as ACTION_TYPES_IP_ADDRESS } from 'app/modules/setting/system/ip-address/ip-address.reducer';
import { ACTION_TYPES as ACTION_TYPES_SAML } from 'app/modules/setting/system/saml/saml.reducer';
import { ACTION_TYPES as ACTION_TYPES_CUSTOMER_DETAIL } from 'app/modules/customers/popup-detail/popup-customer-detail.reducer';
import { ACTION_TYPES as ACTION_TYPES_BUSINESS_CARDS } from 'app/modules/businessCards/list/business-card-list.reducer';
import { ACTION_TYPES as ACTION_TYPES_BUSINESS_CARD_DETAIL } from 'app/modules/businessCards/business-card-detail/business-card-detail-reducer';
import { ACTION_TYPES as ACTION_TYPES_BUSINESS_CARDS_MY_LIST } from 'app/modules/businessCards/my-list/my-list-modal.reducer';
import { ACTION_TYPES as ACTION_TYPES_BUSINESS_CARDS_SHARE_LIST } from 'app/modules/businessCards/shared-list/shared-list.reducer';
import { ACTION_TYPES as ACTION_TYPES_CALENDAR_POPUP } from 'app/modules/calendar/popups/create-edit-schedule.reducer';
import { ACTION_TYPE_CALENDAR as ACTION_TYPES_CALENDAR_GIRD } from 'app/modules/calendar/grid/calendar-grid.reducer';
import { ACTION_TYPE as ACTION_TYPES_CALENDAR_MODAL } from 'app/modules/calendar/modal/calendar-modal.reducer';
import { ACTION_TYPES as ACTION_TYPES_CALENDAR_SEARCH } from 'app/modules/calendar/search-advanced/popup-fields-search.reducer';
import { ACTION_TYPES as ACTION_TYPES_TIMELINE } from 'app/modules/timeline/common/constants.ts';
import { ACTION_TYPES as ACTION_TYPES_CUSTOMER_LIST } from 'app/modules/customers/list/customer-list.reducer';
import { ACTION_TYPES as ACTION_TYPES_ACTIVITY } from 'app/modules/activity/constants.ts';
import { ACTION_TYPES as ACTION_TYPES_CREATE_EDIT_CUSTOMER } from 'app/modules/customers/create-edit-customer/create-edit-customer.reducer';
import { ACTION_TYPES as ACTION_TYPES_CUSTOMER_MY_SHARED_LIST } from 'app/modules/customers/my-shared-list/customer-my-shared-list-modal.reducer';
import { ACTION_TYPES as ACTION_TYPES_EMPLOYEE_MY_SHARED_LIST } from 'app/modules/employees/my-shared-list/employees-my-shared-list-modal.reducer';
import { ACTION_TYPES as ACTION_TYPES_SALES_MY_SHARED_LIST } from 'app/modules/sales/my-shared-list/sales-my-shared-list-modal.reducer';

import { ACTION_TYPES as ACTION_TYPES_CUSTOMER_INTEGRATION } from 'app/modules/customers/customer-integration/customer-integration.reducer.ts';
import { ACTION_TYPES as ACTION_TYPES_SUGGESTION_SEARCH } from 'app/shared/layout/common/suggestion/list-result/fields-search-result.reducer';

import { ACTION_TYPE as ACTION_TYPES_CALENDAR_GLOBAL_MODAL } from 'app/modules/calendar/constants.ts';
import { ACTION_TYPES as ACTION_TYPES_CUSTOMER_NETWORK_MAP } from 'app/modules/customers/network-map-modal/add-edit-network-map.reducer';
import { ACTION_TYPES as ACTION_TYPES_BUSINESS_CARDS_CREATE } from 'app/modules/businessCards/create-edit-business-card/create-edit-business-card.reducer';

import { ACTION_TYPES as ACTION_TYPES_BUSINESS_MERGER } from 'app/modules/businessCards/popup-merge-business-cards/merge-business-cards.reducer';

import { ACTION_TYPES as ACTION_TYPES_POPUP_DETAIL_TAB } from 'app/shared/layout/popup-detail-service-tabs/popup-detail-tab.reducer.ts';
import { ACTION_TYPES as ACTION_TYPES_POPUP_CUSTOMER_DETAIL } from 'app/modules/customers/popup-detail/popup-customer-detail.reducer.ts';
import { ACTION_TYPES as ACTION_TYPES_DYNAMIC_LIST } from 'app/shared/layout/dynamic-form/list/dynamic-list.reducer';

import _ from 'lodash';

export const preventDoubleClick = [
  // start calendar
  ACTION_TYPES_CALENDAR_POPUP.GET_SCHEDULE_TYPES,
  ACTION_TYPES_CALENDAR_POPUP.GET_SCHEDULE_BY_ID,
  ACTION_TYPES_CALENDAR_POPUP.POST_SCHEDULE_DATA,
  ACTION_TYPES_CALENDAR_POPUP.WILL_SUBMIT_DATA,
  ACTION_TYPES_CALENDAR_POPUP.DRAG_SCHEDULE_DATA,
  ACTION_TYPES_CALENDAR_GIRD.CALENDAR_GRID_API_GET_VIEW_TYPES_FOR_CALENDAR,
  ACTION_TYPES_CALENDAR_GIRD.CALENDAR_GRID_GET_CALENDAR_DAY_SCHEDULE,
  ACTION_TYPES_CALENDAR_GIRD.CALENDAR_GRID_GET_CALENDAR_WEEK_SCHEDULE,
  ACTION_TYPES_CALENDAR_GIRD.CALENDAR_GRID_ONCHANGE_DATE_SHOW,
  ACTION_TYPES_CALENDAR_GIRD.CALENDAR_GRID_ONCHANGE_TAB_SCHEDULE_RESOURCE,
  ACTION_TYPES_CALENDAR_GIRD.CALENDAR_GRID_GET_CALENDAR_MONTH_SCHEDULE,
  ACTION_TYPES_CALENDAR_GIRD.CALENDAR_GRID_API_UPDATE_TYPE_VIEW_OF_CALENDAR,
  ACTION_TYPES_CALENDAR_GIRD.CALENDAR_GRID_GET_CALENDAR_LIST_SCHEDULE,
  ACTION_TYPES_CALENDAR_GIRD.CALENDAR_GRID_GET_CALENDAR_LIST_RESOURCE,
  ACTION_TYPES_CALENDAR_MODAL.GET_SCHEDULE_BY_ID,
  ACTION_TYPES_CALENDAR_MODAL.GET_SCHEDULE_HISTORY,
  ACTION_TYPES_CALENDAR_MODAL.GET_TASK_BY_ID,
  ACTION_TYPES_CALENDAR_MODAL.UPDATE_SCHEDULE_STATUS,
  ACTION_TYPES_CALENDAR_SEARCH.FIELDS_SEARCH_RESET,
  ACTION_TYPES_CALENDAR_SEARCH.FIELDS_TASK_SEARCH_FIELD_INFO_PERSONAL_GET,
  ACTION_TYPES_CALENDAR_SEARCH.MILESTONE_ELASTIC_SEARCH_CUSTOMER_ID,
  ACTION_TYPES_CALENDAR_SEARCH.SET_LIST_SEARCH_FIELD,
  ACTION_TYPES_CALENDAR_SEARCH.DETAIL_SEARCH_GET_SCHEDULE_TYPES,
  ACTION_TYPES_CALENDAR_GLOBAL_MODAL.UPDATE_SCHEDULE_STATUS_GLOBAL,
  ACTION_TYPES_CALENDAR_GLOBAL_MODAL.GET_DATA,
  // end calendar
  ACTION_TYPES_SALES_LIST.PRODUCT_TRADING_UPDATE,
  ACTION_TYPES_SALES_LIST.PRODUCT_TRADING_LIST_BY_PROGRESS_GET,
  ACTION_TYPES_SALES_LIST.PRODUCT_TRADING_LIST_PRODUCTS_GET,
  ACTION_TYPES_SALES_LIST.DELETE_PRODUCT_TRADINGS,
  ACTION_TYPES_SALES_LIST.PRODUCT_TRADING_UPDATE_FIELD_INFO_PROGRESS,
  ACTION_TYPES_SALES_LIST.PRODUCT_TRADING_LIST_BY_PROGRESS_GET_SCROLL,

  // ACTION_TYPES_SALES_MY_GROUP.ADD_TO_SALES_GROUP,
  // ACTION_TYPES_SALES_MY_GROUP.MOVE_TO_SALES_GROUP,
  ACTION_TYPES_MY_GROUP.CREATE_GROUP,
  ACTION_TYPES_MY_GROUP.UPDATE_GROUP,
  ACTION_TYPES_CREATE_EDIT.EMPLOYEE_CREATE,
  ACTION_TYPES_CREATE_EDIT.EMPLOYEE_UPDATE,
  ACTION_TYPES_INVITE.INVITE_EMPLOYEES,
  ACTION_TYPES_LIST_EMPLOYEE.EMPLOYEE_LIST_EMPLOYEES_UPDATE,
  ACTION_TYPES_DEPARTMENT.CREATE_DEPARTMENT,
  ACTION_TYPES_DEPARTMENT.UPDATE_DEPARTMENT,
  ACTION_TYPES_LIST_PRODUCT.CREATE_PRODUCT,
  ACTION_TYPES_LIST_PRODUCT.PRODUCT_LIST_PRODUCTS_UPDATE,
  ACTION_TYPES_LIST_PRODUCT.PRODUCT_LIST_MOVE_PRODUCTS,
  ACTION_TYPES_SET_PRODUCT.PRODUCT_SET_CREATE,
  ACTION_TYPES_SET_PRODUCT.PRODUCT_SET_UPDATE,
  ACTION_TYPES_POPUP_PRODUCT.PRODUCT_CREATE,
  ACTION_TYPES_POPUP_PRODUCT.PRODUCT_EDIT,
  ACTION_TYPES_CATEGORY_PRODUCT.CREATE_CATEGORY,
  ACTION_TYPES_CATEGORY_PRODUCT.UPDATE_CATEGORY,
  ACTION_TYPES_LIST_TASK.TASK_LIST_TASKS_UPDATE,
  ACTION_TYPES_LIST_TASK.TASK_LIST_DELETE_TASKS,
  ACTION_TYPES_LIST_TASK.TASK_LIST_UPDATE_TASK_STATUS,
  ACTION_TYPES_LIST_TASK.TASK_LIST_UPDATE_LIST_STATUS,
  ACTION_TYPES_LIST_TASK.TASK_LIST_GET_LOCAL_NAVIGATION,
  ACTION_TYPES_LIST_TASK.TASK_LIST_GET_TASKS,
  ACTION_TYPES_LIST_TASK.TASK_LIST_SAVE_LOCAL_MENU,
  ACTION_TYPES_CREATE_EDIT_MILESTONE.CREATE_MILESTONE,
  ACTION_TYPES_CREATE_EDIT_MILESTONE.UPDATE_MILESTONE,
  ACTION_TYPES_CREATE_EDIT_MILESTONE.GET_MILESTONE,
  ACTION_TYPES_DETAIL_MILESTONE.GET_MILESTONE_DETAIL,
  ACTION_TYPES_DETAIL_MILESTONE.DELETE_MILESTONE,
  ACTION_TYPES_DETAIL_MILESTONE.UPDATE_STATUS_MILESTONE,
  ACTION_TYPES_DETAIL_TASK.TASK_DETAIL_TASK_GET,
  ACTION_TYPES_DETAIL_TASK.TASK_GET_TASK_AFTER_UPDATE,
  ACTION_TYPES_DETAIL_TASK.TASK_DETAIL_UPDATE_STATUS,
  ACTION_TYPES_DETAIL_TASK.TASK_DETAIL_DELETE,
  ACTION_TYPES_DETAIL_TASK.TASK_UPDATE_CUSTOM_FIELD_INFO,
  ACTION_TYPES_EDIT_TASKS.TASK_CREATE,
  ACTION_TYPES_EDIT_TASKS.TASK_UPDATE,
  ACTION_TYPES_EDIT_TASKS.TASK_GET_LAYOUT,
  ACTION_TYPES_EDIT_TASKS.TASK_GET_EDIT,
  ACTION_TYPES_EDIT_SUB_TASKS.TASK_CREATE,
  ACTION_TYPES_EDIT_SUB_TASKS.TASK_UPDATE,
  ACTION_TYPES_MILESTONE.CREATE_MILESTONE,
  ACTION_TYPES_MILESTONE.UPDATE_MILESTONE,
  ACTION_TYPES_EMPLOYEE_DETAIL.EMPLOYEE_DETAIL_EMPLOYEE_GET,
  ACTION_TYPES_EMPLOYEE_DETAIL.EMPLOYEE_UPDATE_CUSTOM_FIELD_INFO,
  ACTION_TYPES_EQUEPMENTS.GET_EQUEPMENT_TYPES,
  ACTION_TYPES_EQUEPMENTS.GET_EQUEPMENTS,
  ACTION_TYPES_EQUEPMENTS.UPDATE_EQUEPMENTS,
  ACTION_TYPES_SCHEDULE.UPDATE_SCHEDULE_TYPE,
  ACTION_TYPES_SCHEDULE.GET_SCHEDULE_TYPE,
  ACTION_TYPES_GOOGLE_CALENDAR.UPDATE_SCHEDULE_GOOGLE_CALENDAR,
  ACTION_TYPES_GOOGLE_CALENDAR.GET_GOOGLE_CALENDAR,
  ACTION_TYPES_SCENARIO.UPDATE_MASTER_SCENARIO,
  ACTION_TYPES_SCENARIO.CREACT_MASTER_SCENARIO,
  ACTION_TYPES_SCENARIO.DELETE_MASTER_SCENARIO,
  ACTION_TYPES_SCENARIO.GET_MASTER_SCENARIO,
  ACTION_TYPES_SCENARIO.GET_MASTER_SCENARIOS,
  ACTION_TYPES_ACTIVITY_FORMAT.UPDATE_ACTIVITY_FORMAT,
  ACTION_TYPES_ACTIVITY_FORMAT.GET_ACTIVITY_FORMAT,
  ACTION_TYPES_PRODUCT_TYPE.UPDATE_PRODUCT_TYPE_MASTER,
  ACTION_TYPES_PRODUCT_TYPE.GET_PRODUCT_TYPE_MASTER,
  ACTION_TYPES_EMPLOYEE_MASTER.UPDATE_EMPLOYEES_TYPE,
  ACTION_TYPES_EMPLOYEE_MASTER.GET_EMPLOYEES_TYPE,
  ACTION_TYPES_PERIOD.UPDATE_PERIOD,
  ACTION_TYPES_PERIOD.GET_PERIOD,
  ACTION_TYPES_PRODUCT_TRADE.UPDATE_PRODUCT_TRADE,
  ACTION_TYPES_LIST_EMPLOYEE.EMPLOYEE_LIST_EMPLOYEES_GET,
  ACTION_TYPES_FEEDBACK.FEEDBACK_CREATE,
  ACTION_TYPES_LIST_PRODUCT.PRODUCT_LIST_PRODUCTS_GET,
  ACTION_TYPES_LIST_PRODUCT.PRODUCT_LIST_CUSTOM_FIELD_INFO_GET_LIST,
  ACTION_TYPES_PRODUCT_DETAIL.PRODUCT_DETAIL_GET,
  ACTION_TYPES_PRODUCT_SET_DETAIL.PRODUCT_SET_DETAIL_GET_QUERY,
  ACTION_TYPES_BUSINESS_CARDS.ADD_BUSINESS_CARDS_TO_LIST,
  ACTION_TYPES_BUSINESS_CARDS.GET_BUSINESS_CARDS_LIST,
  ACTION_TYPES_BUSINESS_CARDS.GET_BUSINESS_CARD_LIST,
  ACTION_TYPES_BUSINESS_CARDS.BUSINESS_CARD_LIST_GET,
  ACTION_TYPES_BUSINESS_CARDS.DELETE_BUSINESS_CARDS,
  ACTION_TYPES_BUSINESS_CARDS.SIDEBAR_DELETE_LIST,
  ACTION_TYPES_BUSINESS_CARDS.ADD_TO_FAVORITE_LIST,
  ACTION_TYPES_BUSINESS_CARDS.REMOVE_BUSINESS_CARDS_FROM_LIST,
  ACTION_TYPES_BUSINESS_CARDS.CREATE_SHARE_LIST,
  ACTION_TYPES_BUSINESS_CARDS.CREATE_MY_LIST,
  ACTION_TYPES_BUSINESS_CARDS.REFRESH_AUTO_LIST,
  ACTION_TYPES_BUSINESS_CARDS.UPDATE_BUSINESS_CARDS_LIST,
  ACTION_TYPES_BUSINESS_CARDS.BUSINESS_CARDS_UPDATE,
  // ACTION_TYPES_BUSINESS_CARD_DETAIL.BUSINESSCARD_DETAIL_GET,
  ACTION_TYPES_BUSINESS_CARD_DETAIL.BUSINESSCARD_DETAIL_DELETE,
  ACTION_TYPES_BUSINESS_CARD_DETAIL.BUSINESSCARD_CREARTE_FOLLOWED,
  ACTION_TYPES_BUSINESS_CARD_DETAIL.BUSINESSCARD_DELETE_FOLLOWEDS,
  ACTION_TYPES_BUSINESS_CARD_DETAIL.BUSINESS_CARD_DETAIL_GET_ACTIVITIES,
  ACTION_TYPES_BUSINESS_CARD_DETAIL.BUSINESSCARD_DETAIL_UPDATE_CUSTOMFIELDSINFO,
  ACTION_TYPES_BUSINESS_CARDS_MY_LIST.ADD_TO_LIST,
  ACTION_TYPES_BUSINESS_CARDS_MY_LIST.CREATE_LIST,
  ACTION_TYPES_BUSINESS_CARDS_MY_LIST.UPDATE_LIST,
  ACTION_TYPES_BUSINESS_CARDS_MY_LIST.INITIALIZE_LIST_MODAL,
  ACTION_TYPES_BUSINESS_CARDS_SHARE_LIST.SHARED_LIST_GET,
  ACTION_TYPES_BUSINESS_CARDS_SHARE_LIST.SHARED_LIST_UPDATE,
  ACTION_TYPES_BUSINESS_CARDS_SHARE_LIST.SHARED_LIST_CREATE,
  ACTION_TYPES_PRODUCT_SET_DETAIL.PRODUCT_SET_DETAIL_GET_QUERY,
  ACTION_TYPES_FEEDBACK.FEEDBACK_CREATE,
  ACTION_TYPES_GENERAL.UPDATE_GENERAL,
  ACTION_TYPES_GENERAL.GET_GENERAL,
  ACTION_TYPES_MASTER_POSITION.UPDATE_CUSTOMER_CONNECTIONS_MAP,
  ACTION_TYPES_MASTER_POSITION.CHECK_DELETE_MASTER_MOTIVATIONS,
  ACTION_TYPES_MASTER_POSITION.CHECK_DELETE_MASTER_STANDS,
  ACTION_TYPES_MASTER_POSITION.GET_CUSTOMER_CONNECTIONS_MAP,
  // ACTION_COMPLETE_PRODUCT_CATEGORY.TAG_AUTO_COMPLETE_PRODUCT_GET,

  ACTION_TYPES_EMPLOYEE_DEPARTMENT.GET_DEPARTMENT_MANAGER,
  ACTION_TYPES_RESET_PASSWORD_INIT.RESET_PASSWORD_INIT,
  ACTION_TYPES_IP_ADDRESS.UPDATE_IP_ADDRESS,
  ACTION_TYPES_IP_ADDRESS.GET_IP_ADDRESS,
  ACTION_TYPES_SAML.UPDATE_AUTHENTICATION_SAML,
  ACTION_TYPES_SAML.GET_AUTHENTICATION_SAML,
  ACTION_TYPES_CUSTOMER_DETAIL.CUSTOMER_DETAIL_CUSTOMER_GET,
  ACTION_TYPES_CUSTOMER_DETAIL.CUSTOMER_DETAIL_DELETE,
  ACTION_TYPES_CUSTOMER_DETAIL.CUSTOMER_UPDATE_CUSTOM_FIELD_INFO,
  ACTION_TYPES_TIMELINE.TIMELINE_GET_ATTACHED_FILES,
  ACTION_TYPES_TIMELINE.TIMELINE_CREATE_TIMELINE_GROUP,
  ACTION_TYPES_TIMELINE.TIMELINE_UPDATE_TIMELINE_GROUP,
  ACTION_TYPES_TIMELINE.TIMELINE_ADD_MEMBER_TO_TIMELINE_GROUP,
  ACTION_TYPES_CUSTOMER_LIST.CUSTOMER_LIST_CUSTOMERS_GET,
  ACTION_TYPES_CUSTOMER_LIST.CUSTOMER_REMOVE_FAVOURITE_LIST,
  ACTION_TYPES_CUSTOMER_LIST.CUSTOMER_DELETE_LIST,
  ACTION_TYPES_CUSTOMER_LIST.CUSTOMER_DOWNLOAD_CUSTOMER,
  ACTION_TYPES_CUSTOMER_LIST.CUSTOMER_DELETE_OUT_OF_LIST,
  ACTION_TYPES_CUSTOMER_LIST.CUSTOMER_ADD_CUSTOMER_TO_FAVOURITE_LIST,
  ACTION_TYPES_CUSTOMER_LIST.CUSTOMER_MOVE_CUSTOMERS_TO_OTHER_LIST,
  ACTION_TYPES_CUSTOMER_LIST.CUSTOMER_DELETE_CUSTOMERS,
  ACTION_TYPES_CUSTOMER_LIST.CUSTOMER_COUNT_RELATION_CUSTOMER,
  ACTION_TYPES_CUSTOMER_LIST.CUSTOMER_UPDATE_CUSTOMERS,
  ACTION_TYPES_CUSTOMER_LIST.CUSTOMER_GET_LAYOUT,
  ACTION_TYPES_CUSTOMER_NETWORK_MAP.SAVE_NETWORK_MAP_TREE,
  ACTION_TYPES_CUSTOMER_NETWORK_MAP.INITIALIZE_NETWORK_MAP,
  ACTION_TYPES_CUSTOMER_NETWORK_MAP.SAVE_DEPARTMENTS,
  ACTION_TYPES_CUSTOMER_NETWORK_MAP.GET_DEPARTMENTS,
  ACTION_TYPES_CUSTOMER_NETWORK_MAP.BUSINESS_CARD_GET_BUSINESS_CARD_MAP_TABLE,
  ACTION_TYPES_CUSTOMER_INTEGRATION.INTEGRATE_CUSTOMER,
  ACTION_TYPES_CUSTOMER_INTEGRATION.GET_CUSTOMERS_BY_IDS,
  ACTION_TYPES_CUSTOMER_INTEGRATION.GET_CUSTOMER_LAYOUT,
  ACTION_TYPES_ACTIVITY.GET_ACTIVITIES,
  ACTION_TYPES_ACTIVITY.GET_LAZY_ACTIVITIES,
  ACTION_TYPES_ACTIVITY.GET_ACTIVITIES_DRAFT,
  ACTION_TYPES_ACTIVITY.GET_LAZY_ACTIVITIES_DRAFT,
  ACTION_TYPES_ACTIVITY.GET_SCENARIO,
  ACTION_TYPES_ACTIVITY.ACTIVITY_SAVE_ACTIVITY,
  ACTION_TYPES_ACTIVITY.ACTIVITY_UPDATE_CUSTOM_FIELD_INFO,
  ACTION_TYPES_ACTIVITY.GET_ACTIVITY_HISTORY,
  ACTION_TYPES_ACTIVITY.ACTIVITY_GET_ACTIVITY_LAYOUT,
  ACTION_TYPES_ACTIVITY.ACTIVITY_GET_ACTIVITY,
  ACTION_TYPES_ACTIVITY.ACTIVITY_GET_ACTIVITY_DRAFT,
  ACTION_TYPES_ACTIVITY.ACTIVITY_GET_ACTIVITY_DETAIL,
  ACTION_TYPES_ACTIVITY.SAVE_ACTIVITY_DRAFT_MANUAL,
  ACTION_TYPES_ACTIVITY.ACTIVITY_DELETE,
  ACTION_TYPES_ACTIVITY.ACTIVITY_DELETE_DRAFT,
  ACTION_TYPES_CREATE_EDIT_CUSTOMER.CUSTOMER_CREATE,
  ACTION_TYPES_CREATE_EDIT_CUSTOMER.CUSTOMER_UPDATE,
  ACTION_TYPES_CREATE_EDIT_CUSTOMER.CUSTOMER_GET_EDIT,
  ACTION_TYPES_CREATE_EDIT_CUSTOMER.CUSTOMER_GET_ADD,
  ACTION_TYPES_CREATE_EDIT_CUSTOMER.CUSTOMER_SAVE_SCENARIO,
  ACTION_TYPES_CUSTOMER_MY_SHARED_LIST.INITIAL,
  ACTION_TYPES_CUSTOMER_MY_SHARED_LIST.CREATE,
  ACTION_TYPES_CUSTOMER_MY_SHARED_LIST.UPDATE,
  ACTION_TYPES_EMPLOYEE_MY_SHARED_LIST.INITIAL,
  ACTION_TYPES_EMPLOYEE_MY_SHARED_LIST.CREATE,
  ACTION_TYPES_EMPLOYEE_MY_SHARED_LIST.UPDATE,
  ACTION_TYPES_SALES_MY_SHARED_LIST.INITIAL,
  ACTION_TYPES_SALES_MY_SHARED_LIST.CREATE,
  ACTION_TYPES_SALES_MY_SHARED_LIST.UPDATE,
  ACTION_TYPES_CREATE_EDIT_CUSTOMER.CUSTOMER_GET_SCENARIO,
  // timeline module 27/07/2020 start
  ACTION_TYPES_TIMELINE.TIMELINE_CREATE_TIMELINE,
  ACTION_TYPES_TIMELINE.TIMELINE_SHARE_TIMELINE,
  ACTION_TYPES_TIMELINE.TIMELINE_CREATE_COMMENT_AND_REPLY,
  // timeline module 27/07/2020 end
  ACTION_TYPES_SUGGESTION_SEARCH.EMPLOYEE_LIST_EMPLOYEES_GET,
  ACTION_TYPES_SUGGESTION_SEARCH.PRODUCT_LIST_PRODUCT_GET,
  ACTION_TYPES_SUGGESTION_SEARCH.MILESTONES_LIST_MILESTONES_GET,
  ACTION_TYPES_SUGGESTION_SEARCH.PRODUCT_TRADING_LIST_PRODUCT_TRADING_GET,
  ACTION_TYPES_SUGGESTION_SEARCH.CUSTOMER_LIST_CUSTOMERS_GET,
  ACTION_TYPES_SUGGESTION_SEARCH.BUSINESSCARD_LIST_BUSINESSCARD_GET,
  // timeline module 29/7
  ACTION_TYPES_TIMELINE.TIMELINE_GET_COMMENT,
  ACTION_TYPES_TIMELINE.TIMELINE_GET_USER_TIMELINES,
  ACTION_TYPES_TIMELINE.TIMELINE_GET_REPLIES,
  ACTION_TYPES_TIMELINE.TIMELINE_GET_COMMENT_AND_REPLIES_OLDER,
  ACTION_TYPES_TIMELINE.TIMELINE_GET_COMMENT_AND_REPLIES_RENEW,
  ACTION_TYPES_TIMELINE.TIMELINE_DELETE_TIMELINE,
  ACTION_TYPES_TIMELINE.TIMELINE_UPDATE_TIMELINE_FAVORITE,
  ACTION_TYPES_BUSINESS_CARDS_CREATE.CREATE_BUSINESS_CARD,
  ACTION_TYPES_BUSINESS_CARDS_CREATE.EDIT_BUSINESS_CARD,

  ACTION_TYPES_BUSINESS_MERGER.MERGE_BUSINESS_CARDS,
  ACTION_TYPES_TIMELINE.TIMELINE_GET_TIMELINE_FILTERS,

  // loading for tab product_trading, task, change_history
  ACTION_TYPES_POPUP_DETAIL_TAB.CUSTOMERS_GET_PRODUCT_TRADINGS,
  ACTION_TYPES_POPUP_DETAIL_TAB.TASK_DATA_GET_BY_CUSTOMER,
  ACTION_TYPES_POPUP_CUSTOMER_DETAIL.CUSTOMER_CHANGE_HISTORY,
  ACTION_TYPES_DYNAMIC_LIST.DYNAMIC_LIST_FIELD_INFO_PERSONALS_GET
];

export const preventDoubleClickBottom = [
  ACTION_TYPES_PRODUCT_DETAIL.PRODUCT_DETAIL_CHANGE_HISTORY,
  ACTION_TYPES_PRODUCT_SET_DETAIL.PRODUCT_SET_DETAIL_HISTORY
];

export const getFieldNameExtension = belong => {
  if (belong === FIELD_BELONG.EMPLOYEE) {
    return 'employee_data';
  } else if (belong === FIELD_BELONG.PRODUCT) {
    return 'product_data';
  } else if (belong === FIELD_BELONG.TASK) {
    return 'task_data';
  } else if (belong === FIELD_BELONG.BUSINESS_CARD) {
    return 'business_card_data';
  } else if (belong === FIELD_BELONG.CUSTOMER) {
    return 'customer_data';
  } else if (belong === FIELD_BELONG.ACTIVITY) {
    return 'activity_data';
  } else if (belong === FIELD_BELONG.PRODUCT_TRADING) {
    return 'product_trading_data';
  }
  return '';
};

export const getKeyNameService = (fieldBelong: any) => {
  if (fieldBelong === FIELD_BELONG.EMPLOYEE) {
    return 'employee_id';
  } else if (fieldBelong === FIELD_BELONG.PRODUCT) {
    return 'product_id';
  } else if (fieldBelong === FIELD_BELONG.TASK) {
    return 'task_id';
  } else if (fieldBelong === FIELD_BELONG.BUSINESS_CARD) {
    return 'business_card_id';
  } else if (fieldBelong === FIELD_BELONG.CUSTOMER) {
    return 'customer_id';
  } else if (fieldBelong === FIELD_BELONG.ACTIVITY) {
    return 'activity_id';
  } else if (fieldBelong === FIELD_BELONG.PRODUCT_TRADING) {
    return 'product_trading_id';
  }
  return '';
};

export const getLinkListModule = (fieldBelong: number) => {
  if (fieldBelong === FIELD_BELONG.EMPLOYEE) {
    return '/employee/list';
  } else if (fieldBelong === FIELD_BELONG.PRODUCT) {
    return '/product/list';
  } else if (fieldBelong === FIELD_BELONG.PRODUCT_TRADING) {
    return '/sales/list';
  } else if (fieldBelong === FIELD_BELONG.TASK) {
    return '/task/list';
  } else if (fieldBelong === FIELD_BELONG.BUSINESS_CARD) {
    return '/businesscard/list';
  } else if (fieldBelong === FIELD_BELONG.CUSTOMER) {
    return '/customer/list';
  } else if (fieldBelong === FIELD_BELONG.ACTIVITY) {
    return '/activity/list';
  }
  return '';
};

export const isFieldNested = field => {
  if (
    field.fieldName === 'manager_name' ||
    field.fieldName === 'position_name' ||
    field.fieldName === 'subordinate_name'
  ) {
    return true;
  }
  return false;
};

export const makeParamsGetRecordModulo = (
  fieldBelong: number,
  searchConditions: any[],
  offset,
  limit
) => {
  const params = {
    url: '',
    query: { searchConditions, filterConditions: [], offset, limit, orderBy: [] }
  };
  if (fieldBelong === FIELD_BELONG.EMPLOYEE) {
    params.url = `${API_CONTEXT_PATH}/${API_CONFIG.EMPLOYEE_SERVICE_PATH}/get-employees`;
  } else if (fieldBelong === FIELD_BELONG.PRODUCT) {
    params.url = `${API_CONTEXT_PATH}/${API_CONFIG.PRODUCT_SERVICE_PATH}/get-products`;
    params.query['isContainCategoryChild'] = false;
    params.query['isOnlyData'] = true;
    params.query['isUpdateListInfo'] = false;
  } else if (fieldBelong === FIELD_BELONG.TASK) {
    params.url = `${API_CONTEXT_PATH}/${API_CONFIG.SCHEDULES_SERVICE_PATH}/get-tasks`;
    params.query['filterByUserLoginFlg'] = 0;
  } else if (fieldBelong === FIELD_BELONG.PRODUCT_TRADING) {
    delete params.query.orderBy; // not convention
    params.query['orders'] = [];
    params.url = `${API_CONTEXT_PATH}/${API_CONFIG.SALES_SERVICE_PATH}/get-product-tradings`;
  } else if (fieldBelong === FIELD_BELONG.BUSINESS_CARD) {
    params.url = `${API_CONTEXT_PATH}/${API_CONFIG.BUSINESS_CARD_SERVICE_PATH}/get-business-cards`;
  } else if (fieldBelong === FIELD_BELONG.CUSTOMER) {
    params.url = `${API_CONTEXT_PATH}/${API_CONFIG.CUSTOMER_SERVICE_PATH}/get-customers`;
  } else if (fieldBelong === FIELD_BELONG.ACTIVITY) {
    params.url = `${API_CONTEXT_PATH}/${API_CONFIG.ACTIVITY_SERVICE_PATH}/get-activities`;
  } else if (fieldBelong === FIELD_BELONG.MILE_STONE) {
    delete params.query.orderBy; // not convention
    delete params.query.filterConditions; // not convention
    params.query['searchCondition'] = _.cloneDeep(params.query.searchConditions); // not convention
    delete params.query.searchConditions; // not convention
    params.url = `${API_CONTEXT_PATH}/${API_CONFIG.SCHEDULES_SERVICE_PATH}/get-milestones`;
  }
  // TODO other services
  return params;
};

const getTotalRecord = (fieldBelong: number, res) => {
  if (fieldBelong === FIELD_BELONG.PRODUCT) {
    if (res && res.totalCount) {
      return res.totalCount;
    }
  } else if (fieldBelong === FIELD_BELONG.TASK) {
    if (res && res.total) {
      return res.total;
    }
  } else if (res && res.totalRecords) {
    return res.totalRecords;
  }
  return null;
};

export const parseResponseGetRecordsModulo = (fieldBelong: number, res) => {
  let message = '';
  if (res.errors && res.errors.length > 0) {
    message = res.errors[0].message;
  }
  const recordData = { records: [], totalRecord: getTotalRecord(fieldBelong, res) };
  if (fieldBelong === FIELD_BELONG.EMPLOYEE) {
    if (res && res.employees && res.employees.length) {
      recordData.records.push(...res.employees);
      recordData.records.forEach(e => {
        e['recordId'] = getValueProp(e, 'employeeId');
      });
    }
  } else if (fieldBelong === FIELD_BELONG.PRODUCT) {
    if (res && res.dataInfo && res.dataInfo.products && res.dataInfo.products.length > 0) {
      recordData.records.push(...res.dataInfo.products);
      recordData.records.forEach(e => {
        e['recordId'] = getValueProp(e, 'productId');
      });
    }
  } else if (fieldBelong === FIELD_BELONG.TASK) {
    const taskResult = _.get(res, 'dataInfo.tasks');
    if (taskResult && taskResult.length > 0) {
      recordData.records.push(...taskResult);
      recordData.records.forEach(e => {
        e['recordId'] = getValueProp(e, 'taskId');
      });
    }
  } else if (fieldBelong === FIELD_BELONG.BUSINESS_CARD) {
    if (res && res.businessCards && res.businessCards.length > 0) {
      recordData.records.push(...res.businessCards);
      recordData.records.forEach(e => {
        e['recordId'] = getValueProp(e, 'businessCardId');
      });
    }
  } else if (fieldBelong === FIELD_BELONG.CUSTOMER) {
    if (res && res.customers && res.customers.length > 0) {
      recordData.records.push(...res.customers);
      recordData.records.forEach(e => {
        e['recordId'] = getValueProp(e, 'customerId');
      });
    }
  } else if (fieldBelong === FIELD_BELONG.ACTIVITY) {
    if (res && res.activities && res.activities.length > 0) {
      recordData.records.push(...res.activities);
      recordData.records.forEach(e => {
        e['recordId'] = getValueProp(e, 'activityId');
      });
    } else if (res && res.activityIds && res.activityIds.length > 0) {
      res.activityIds.forEach(e => {
        recordData.records.push({ recordId: e });
      });
    }
  } else if (fieldBelong === FIELD_BELONG.PRODUCT_TRADING) {
    if (res && res.productTradings && res.productTradings.length > 0) {
      recordData.records.push(...res.productTradings);
      recordData.records.forEach(e => {
        e['recordId'] = getValueProp(e, 'productTradingId');
      });
    }
  } else if (fieldBelong === FIELD_BELONG.MILE_STONE) {
    if (res && res.milestones && res.milestones.length > 0) {
      recordData.records.push(...res.milestones);
      recordData.records.forEach(e => {
        e['recordId'] = getValueProp(e, 'milestoneId');
      });
    }
  }
  // TODO other service
  return { message, recordData };
};

export const makeParamsGetServiceLayout = (fieldBelong: number) => {
  const params = { url: '' };
  if (fieldBelong === FIELD_BELONG.EMPLOYEE) {
    params.url = `${API_CONTEXT_PATH}/${API_CONFIG.EMPLOYEE_SERVICE_PATH}/get-employee-layout`;
  } else if (fieldBelong === FIELD_BELONG.PRODUCT) {
    params.url = `${API_CONTEXT_PATH}/${API_CONFIG.PRODUCT_SERVICE_PATH}/get-product-layout`;
  } else if (fieldBelong === FIELD_BELONG.TASK) {
    params.url = `${API_CONTEXT_PATH}/${API_CONFIG.SCHEDULES_SERVICE_PATH}/get-task-layout`;
  } else if (fieldBelong === FIELD_BELONG.PRODUCT_TRADING) {
    params.url = ``; // haven't  apply
  } else if (fieldBelong === FIELD_BELONG.BUSINESS_CARD) {
    params.url = ``; // haven't  apply
  } else if (fieldBelong === FIELD_BELONG.CUSTOMER) {
    params.url = `${API_CONTEXT_PATH}/${API_CONFIG.CUSTOMER_SERVICE_PATH}/get-customer-layout`;
  } else if (fieldBelong === FIELD_BELONG.ACTIVITY) {
    params.url = `${API_CONTEXT_PATH}/${API_CONFIG.ACTIVITY_SERVICE_PATH}/get-activity-layout`;
  } else if (fieldBelong === FIELD_BELONG.SCHEDULE) {
    params.url = `${API_CONTEXT_PATH}/${API_CONFIG.SCHEDULES_SERVICE_PATH}/get-schedule-types`;
  }
  // TODO other services
  return params;
};

export const parseResponseGetServiceLayout = (fieldBelong: number, res) => {
  let message = '';
  if (res.errors && res.errors.length > 0) {
    message = res.errors[0].message;
  }
  const recordData = { fieldBelong, data: null };
  if (fieldBelong === FIELD_BELONG.EMPLOYEE) {
    if (res && res.employeeLayout && res.employeeLayout.length) {
      recordData.data = res.employeeLayout;
    }
  } else if (fieldBelong === FIELD_BELONG.PRODUCT) {
    if (res && res.productLayout) {
      recordData.data = res.productLayout;
    }
  } else if (fieldBelong === FIELD_BELONG.TASK || fieldBelong === FIELD_BELONG.ACTIVITY) {
    if (res) {
      recordData.data = res;
    }
  } else if (fieldBelong === FIELD_BELONG.BUSINESS_CARD) {
    // not apply
  } else if (fieldBelong === FIELD_BELONG.CUSTOMER) {
    if (res && res.fields && res.fields.length) {
      recordData.data = res.fields;
    }
  } else if (fieldBelong === FIELD_BELONG.PRODUCT_TRADING) {
    // not apply
  } else if (fieldBelong === FIELD_BELONG.SCHEDULE) {
    if (res && res.scheduleTypes) {
      recordData.data = res.scheduleTypes;
    }
  }
  // TODO other service
  return { message, recordData };
};
