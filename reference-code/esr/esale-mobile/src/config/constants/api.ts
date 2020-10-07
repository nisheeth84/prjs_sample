// export const apiUrl = "http://demo.luvina.pro";
// export const apiUrl = "http://10.0.1.35:8080";
export const apiUrl = 'https://esms-dev.softbrain.com/';
// export const apiUrl = 'https://phamdongdong.esr.luvina.net/';
// export const apiUrl = 'https://trantrungkien.esr.luvina.net/';
// export const apiUrl = 'https://local.esr.luvina.net/';

export const tokenApi =
  'HekIWEGSe+iTW6LTY2WWAigGgpir0vbmqxtpFsDzwwHCoPWkDA5kVSY=';
export const customerListApiUrl = '/services/customers/graphql';
export const getCommonApiUrl = '/services/commons/graphql';
export const tokenApiKey = 'X-TokenApi';
export const tenantKey = 'X-TenantID';
export const contentType = { 'content-type': 'multipart/form-data' };
export const loginApiUrl = '/services/employees/auth/login';
export const logoutApiUrl = '/services/employees/auth/logout';
export const resetPassApiUrl = 'services/uaa/api/account/reset-password/init';
export const changePassApiUrl = '/services/uaa/api/account/change-password';
export const resetPassCheckKeyApiUrl =
  '/services/uaa/api/account/reset-password/checkkey';
export const resetPassFinishKeyApiUrl =
  '/services/uaa/api/account/reset-password/finish';
export const searchEmployeesApiUrl = '/services/employees/graphql';
export const getFieldInfoPersonalsApiUrl = '/services/commons/graphql';
export const createGroupApiUrl = '/services/employees/graphql';
export const timelineGroupApiUrl = '/services/timelines/graphql';
export const productsSuggestApiUrl = '/services/products/graphql';

export const getEmployeeUrl = '/services/employees/api/get-employee';
export const getInitializeLocalMenuUrl =
  '/services/employees/api/get-initialize-local-menu';
export const timelinesUrl = 'services/timelines/graphql';
export const getInitializeGroupModalUrl =
  '/services/employees/api/initialize-group-modal';
export const updateGroupUrl = '/services/employees/api/update-groups';
export const createGroupUrl = '/services/employees/api/create-groups';
export const deleteGroupUrl = '/services/employees/api/delete-groups';
export const updateAutoGroupUrl = '/services/employees/api/update-auto-group';
export const SERVICE_GET_EMPLOYEES = '/services/employees/api/get-employees';
export const SERVICE_GET_INITIALIZE_LIST_INFO =
  '/services/commons/api/get-initialize-list-info';
export const getProductTradingApiUrl =
  '/services/sales/api/get-product-trading-tab';
export const getProductsApiUrl = 'services/products/api/get-product';
export const getProductHistoryApiUrl =
  'services/products/api/get-product-history';
export const getProductSetApiUrl = 'services/products/api/get-product-set';
export const getProductSetHistoryApiUrl =
  'services/products/api/get-product-set-history';
export const searchProductsApiUrl = 'services/products/api/get-products';
export const getProductDetailApiUrl = 'services/products/api/get-product';
export const shareTimelineApiUrl = 'services/timelines/api/share-timeline';
export const COMMONS_API = {
  getServiceFavoriteUrl: 'services/commons/api/get-service-favorite',
  createServiceFavoriteUrl: 'services/commons/api/create-service-favorite',
  deleteServiceFavoriteUrl: 'services/commons/api/delete-service-favorite',
  getServiceOrderUrl: 'services/commons/api/get-service-order',
  createServiceOrderUrl: 'services/commons/api/create-service-order',
  updateServiceOrderUrl: 'services/commons/api/update-service-order',
  getServicesInfoUrl: 'services/commons/api/get-services-info',
  countUnreadNotificationUrl: 'services/commons/api/count-unread-notification',
  getNotificationSettingUrl: 'services/commons/api/get-notification-setting',
  updateNotificationDetailSettingUrl:
    'services/commons/api/update-notification-detail-setting',
  getCustomFieldsInfoUrl: 'services/commons/api/get-custom-fields-info',
  getLanguages: 'services/commons/api/get-languages',
  getTimezones: 'services/commons/api/get-timezones',
  getRecordIds: 'services/commons/api/get-record-ids',
};
export const getRecordIdsUrl = 'services/commons/api/get-record-ids';
export const TENANT_API = {
  getCompanyNameUrl: 'services/tenants/api/get-company-name',
};
export const EMPLOYEES_API = {
  getEmployeeUrl: "services/employees/api/get-employee",
  logoutUrl: "services/employees/auth/logout",
  updateSettingEmployeeUrl: "/services/employees/api/update-setting-employee",
  getEmployeeLayout: "services/employees/api/get-employee-layout",
  getEmployeesByIds: "services/employees/api/get-employees-by-ids",
  getEmployeesSuggestion: 'services/employees/api/get-employees-suggestion',
  updateDisplayFirstScreen: "services/employees/api/update-display-first-screen"
};
export const SERVICE_DELETE_CUSTOMERS =
  '/services/customers/api/delete-customers';
export const SERVICE_DELETE_CUSTOMER_OUT_OF_LIST =
  '/services/customers/api/delete-customer-out-of-list';
export const SERVICE_ADD_CUSTOMERS_TO_AUTO_LIST =
  '/services/customers/api/refresh-auto-list';
export const SERVICE_CREATE_LIST = '/services/customers/api/create-list';
export const SERVICE_UPDATE_LIST = '/services/customers/api/update-list';
export const SERVICE_COUNT_RELATION_CUSTOMER =
  '/services/customers/api/count-relation-customers';
export const SERVICE_DELETE_LIST = '/services/customers/api/delete-list';
export const SERVICE_REMOVE_FAVOURITE_LIST =
  '/services/customers/api/remove-favourite-list';
export const SERVICE_ADD_TO_LIST_FAVOURITE =
  '/services/customers/api/add-to-list-favourite';
export const SERVICE_GET_CUSTOMER_LIST =
  '/services/customers/api/get-customer-list';
export const SERVICE_GET_CUSTOMERS = '/services/customers/api/get-customers';
export const CUSTOMER_API = {
  getCustomers: 'services/customers/api/get-customers',
  getCustomersSuggestion: 'services/customers/api/get-customers-suggestion',
  getCompanyNameUrl: '/services/tenants/api/get-company-name',
};

export const getTaskDetailApi = 'services/schedules/api/get-task';
export const getEmployeesApi = 'services/employees/api/get-employees';
export const getListNotificationApiUrl =
  'services/commons/api/get-notifications';
export const updateStatusNotification =
  'services/commons/api/update-notification-address';
export const searchEmployeesScheduleApiUrl =
  'services/employees/api/get-employee-suggestions-global';
export const searchProductSuggestionsApiUrl =
  '/services/products/api/get-product-suggestions';
export const searchBussinessCardSuggestionsApiUrl =
  '/services/businesscards/api/get-business-card-suggestions-global';
export const searchProductSuggestionsGlobalApiUrl =
  '/services/products/api/get-product-suggestions-global';
export const getEmployeeSuggestion =
  'services/employees/api/get-employees-suggestion';
// business card
export const BUSINESS_CARD_API = {
  suggestionDepartment:
    'services/businesscards/api/suggest-business-card-department',
  getListSuggestions: 'services/businesscards/api/get-list-suggestions',
  addBusinessCardToList:
    'services/businesscards/api/add-business-cards-to-list',
  createBusinessCardsList:
    'services/businesscards/api/create-business-cards-list',
  // getListSuggestions: "services/businesscards/api/get-list-suggestions",
  getBusinessCard: 'services/businesscards/api/get-business-card',
  addBusinessCardsToList:
    'services/businesscards/api/add-business-cards-to-list',
  getBusinessCards: 'services/businesscards/api/get-business-cards',
  getBusinessCardList: 'services/businesscards/api/get-business-card-list',
  createBusinessCardList:
    'services/businesscards/api/create-business-cards-list',
  refreshAutoList: 'services/businesscards/api/refresh-auto-list',
  deleteBusinessCardList:
    'services/businesscards/api/delete-business-card-list',
  removeBusinessCardsFromList:
    'services/businesscards/api/remove-business-cards-from-list',
  removeListFromFavorite:
    'services/businesscards/api/remove-list-from-favorite',
  addListToFavorite: 'services/businesscards/api/add-list-to-favorite',
  deleteBusinessCards: 'services/businesscards/api/delete-business-cards',
  updateBusinessCardsList:
    'services/businesscards/api/update-business-cards-list',
  updateBusinessCards: 'services/businesscards/api/update-business-cards',
  createBusinessCard: 'services/businesscards/api/create-business-card',
  createdFollowed: 'services/timelines/api/create-followed',
  getActivities: "services/activities/api/get-activities",
  dragDropBusinessCard: 'services/businesscards/api/drag-drop-business-card',
  getBusinessCardHistory: 'services/businesscards/api/get-business-card-history',

};
export const getSelectedOrganizationInfoUrl =
  '/services/employees/api/get-selected-organization-info';
export const SERVICE_GET_TIMEZONES = '/services/commons/api/get-timezones';
export const SERVICE_GET_LANGUAGES = '/services/commons/api/get-languages';
// Timeline api
// Timeline api
export const TIMELINE_API = {
  getFavoriteTimelineGroupUrl:
    'services/timelines/api/get-favorite-timeline-groups',
  addFavoriteTimelineGroupUrl:
    'services/timelines/api/add-favorite-timeline-group',
  deleteFavoriteTimelineGroupUrl:
    'services/timelines/api/delete-favorite-timeline-group',
  addRequestToTimelineGroupUrl:
    'services/timelines/api/add-request-to-timeline-group',
  suggestTimelineGroupNameUrl:
    'services/timelines/api/suggest-timeline-group-name',
  getCommentAndRepliesUrl: 'services/timelines/api/get-comment-and-replies',
  createTimelineGroupUrl: 'services/timelines/api/create-timeline-group',
  updateTimelineGroupUrl: 'services/timelines/api/update-timeline-group',
  getUserTimelineUrl: 'services/timelines/api/get-user-timelines',
  getTimelineGroupsOfEmployeeUrl:
    'services/timelines/api/get-timeline-groups-of-employee',
  getTimelineGroupsUrl: 'services/timelines/api/get-timeline-groups',
  deleteTimelineGroupsUrl: 'services/timelines/api/delete-timeline-group',
  getFollowedUrl: 'services/timelines/api/get-followeds',
  createTimelineUrl: 'services/timelines/api/create-timeline',
  getTimelineFiltersUrl: 'services/timelines/api/get-timeline-filters',
  deleteTimelineUrl: 'services/timelines/api/delete-timeline',
  getAttachedFilesUrl: 'services/timelines/api/get-attached-files',
  updateTimelineReactionUrl: 'services/timelines/api/update-timeline-reaction',
  getRecentReactionsUrl: 'services/timelines/api/get-recent-reactions',
  updateTimelineFavoriteUrl: 'services/timelines/api/update-timeline-favorite',
  createCommentAndReplyUrl: 'services/timelines/api/create-comment-and-reply',
  updateTimelineFiltersUrl: 'services/timelines/api/update-timeline-filters',
  addMemberToTimelineGroupUrl:
    'services/timelines/api/add-member-to-timeline-group',
  getLocalNavigationTimelineUrl:
    'services/timelines/api/get-local-navigation-timeline',
  updateRecentlyDateClickUrl:
    'services/timelines/api/update-recently-date-click',
  getTimelineById: 'services/timelines/api/get-timeline-by-id',
  getTimelineGroups: 'services/timelines/api/get-timeline-groups',
  deleteFollowedUrl: 'services/timelines/api/delete-followeds',
  getLocalNavigation: 'services/timelines/api/get-local-navigation',
  updateMemberOfTimelineGroup:
    'services/timelines/api/update-member-of-timeline-group',
  deleteMemberOfTimelineGroup:
    'services/timelines/api/delete-member-of-timeline-group',
  getSuggestionTimeline: 'services/employees/api/get-suggestion-timeline',
};
export const PRODUCT_API = {
  getProductLayout: 'services/products/api/get-product-layout',
};
export const searchReportApiUrl =
  'services/activities/api/get-suggestion-reports-global';
export const SALES_API = {
  getListSuggestions: 'services/sales/api/get-list-suggestions',
  addProductTradingsToList: 'services/sales/api/add-product-tradings-to-list',
  getProductTradingTab: 'services/sales/api/get-product-tradings-tab',
  dragDropProductTrading: 'services/sales/api/drag-drop-product-trading',
  getProductTradings: 'services/sales/api/get-product-tradings',
  createProductTradingList: 'services/sales/api/create-product-tradings-list',
  getProductTradingsByProgress:
    'services/sales/api/get-product-tradings-by-progress',
  getList: 'services/sales/api/get-list',
  getProductTradingsList: 'services/sales/api/get-product-tradings-list',
  updateProductTradingsList: 'services/sales/api/update-product-tradings-list',
  deleteProductTradingList: 'services/sales/api/delete-product-trading-list',
  addListToFavorite: 'services/sales/api/add-list-to-favorite',
  removeListFromFavorite: 'services/sales/api/remove-list-from-favorite',
  refreshAutoList: 'services/sales/api/refresh-auto-list',
  removeProductTradingsFromList:
    'services/sales/api/remove-product-tradings-from-list',
  deleteProductTradings: 'services/sales/api/delete-product-tradings',
  getProgresses : 'services/sales/api/get-progresses',
  getProductTradingByActivity: 'services/activities/api/get-product-trading-by-activity',
};

// Task api
export const TASK_API = {
  getTaskDetailApi: 'services/schedules/api/get-task',
  updateMilestoneStatusApi: 'services/schedules/api/update-milestone-status',
  deleteMilestone: 'services/schedules/api/delete-milestone',
  getTaskGlobalTools: 'services/schedules/api/get-task-global-tools',
  getListTaskApiUrl: 'services/schedules/api/get-tasks',
  getTaskLayoutUrl: 'services/schedules/api/get-task-layout',
  createSubTaskApiUrl: 'services/schedules/api/create-task',
  getTaskNavigation: 'services/schedules/api/get-local-navigation',
  removeTaskApiUrl: 'services/schedules/api/delete-tasks',
  updateStatusTaskApiUrl: 'services/schedules/api/update-task-status',
  createMilestoneApiUrl: 'services/schedules/api/create-milestone',
  getMilestoneApiUrl: 'services/schedules/api/get-milestone',
  getTaskHistory: 'services/schedules/api/get-task-history',
  updateMilestoneApiUrl: 'services/schedules/api/update-milestone',
  updateTaskApiUrl: 'services/schedules/api/update-task',
  saveLocalNavigation: 'services/schedules/api/save-local-navigation',
};

export const FEEDBACK_API = {
  createFeedbackApiUrl: 'services/tenants/api/create-feed-back',
  getStatusContractApiUrl: 'services/tenants/api/get-status-contract',

  createFeedbackStatusApiUrl:
    'services/tenants/api/create-feed-back-status-open',
  getStatusOpenFeedbackApiUrl: 'services/tenants/api/get-feed-back-status-open',
};
export const searchActivitiesApiUrl =
  'services/activities/api/get-suggestion-activities-global';
export const searchGlobalApiUrl =
  'services/customers/api/get-suggestion-customers-global';
export const searchSuggestScheduleApiUrl =
  'services/schedules/api/get-schedule-suggestions-global';

// customers
export const CUSTOMERS_API = {
  getProductTradingIds: 'services/customers/api/get-product-trading-ids',
  addCustomersToList: 'services/customers/api/add-customers-to-list',
  getCustomerSuggestion: 'services/customers/api/get-list-suggestions',
  getCustomerList: 'services/customers/api/get-customer-list',
  moveCustomersToOtherList:
    'services/customers/api/move-customers-to-other-list',
  getMasterScenarios: 'services/customers/api/get-master-scenarios',
  getMasterScenario: 'services/customers/api/get-master-scenario',
  createCustomer: 'services/customers/api/create-customer',
  getCustomer: 'services/customers/api/get-customer',
  getScenario: 'services/customers/api/get-scenario',
  updateCustomer: 'services/customers/api/update-customer',
  getCustomerLayout: 'services/customers/api/get-customer-layout',
  saveScenario: 'services/customers/api/save-scenario',
};
export const getEmployeesSuggestionApiUrl =
  '/services/employees/api/get-employees-suggestion';
export const searchSuggestTaskApiUrl =
  'services/schedules/api/get-suggestion-task-global';
export const searchSuggestProductTradingApiUrl =
  'services/sales/api/get-product-trading-suggestions-global';
export const getFieldInforApiUrl = 'services/commons/api/get-fields-info';
export const updateFieldInforPersonalsApiUrl =
  'services/commons/api/update-field-info-personals';
export const getCustomFieldInfoApiUrl =
  'services/commons/api/get-custom-fields-info';
export const searchSuggestTimelineApiUrl =
  'services/timelines/api/get-timeline-suggestions-global';
// Activity API
export const prefixUrlActivity = '/services/activities';
export const prefixUrlBusinessCards = '/services/businesscards';
export const prefixUrlSales = '/services/sales';
export const prefixUrlSchedules = '/services/schedules';
export const prefixUrlProducts = '/services/products';
export const prefixUrlCustomers = '/services/customers';
export const SERVICES_GET_BUSINESS_CARD_LIST = `${prefixUrlBusinessCards}/api/get-business-card-list`;
export const SERVICES_GET_CUSTOMER_LIST = `${prefixUrlCustomers}/api/get-customer-list`;
export const SERVICES_GET_LIST = `${prefixUrlSales}/api/get-list`;
export const SERVICES_GET_BUSINESS_CARDS = `${prefixUrlBusinessCards}/api/get-business-cards`;
export const SERVICES_GET_ACTIVITY_LAYOUT = `${prefixUrlActivity}/api/get-activity-layout`;
export const SERVICES_GET_CUSTOMERS = `${prefixUrlCustomers}/api/get-customers`;
export const SERVICES_GET_PRODUCT_TRADINGS = `${prefixUrlSales}/api/get-product-tradings`;
export const SERVICES_GET_PRODUCT_TRADING_SUGGESTIONS = `${prefixUrlSales}/api/get-product-trading-suggestions`;
export const SERVICES_GET_PRODUCT_SUGGESTIONS = `${prefixUrlProducts}/api/get-product-suggestions`;
export const SERVICES_GET_CHANGE_HISTORIES = `${prefixUrlActivity}/api/get-change-histories`;
export const SERVICES_GET_ACTIVITY = `${prefixUrlActivity}/api/get-activity`;
export const SERVICES_DELETE_ACTIVITIES = `${prefixUrlActivity}/api/delete-activities`;
export const SERVICES_CREATE_ACTIVITY = `${prefixUrlActivity}/api/create-activity`;
export const SERVICES_UPDATE_ACTIVITY = `${prefixUrlActivity}/api/update-activity`;
export const SERVICES_CREATE_ACTIVITY_DRAFT = `${prefixUrlActivity}/api/create-activity-draft`;
export const SERVICES_GET_LIST_ACTIVITIES_DRAFT = `${prefixUrlActivity}/api/get-activity-drafts`;
export const SERVICES_GET_ACTIVITY_DRAFT = `${prefixUrlActivity}/api/get-activity-draft`;
export const SERVICES_DELETE_ACTIVITY_DRAFT = `${prefixUrlActivity}/api/delete-activity-draft`;

export const SERVICES_GET_ACTIVITIES = `${prefixUrlActivity}/api/get-activities`;

export const SERVICES_GET_SCENARIO = '/services/customers/api/get-scenario';
export const SERVICES_GET_BUSINESS_CARD_SUGGESTIONS = `${prefixUrlBusinessCards}/api/get-business-card-suggestions`;

export const SERVICES_GET_MILESTONES_SUGGESTION = `${prefixUrlSchedules}/api/get-milestones-suggestion`;
export const SERVICES_GET_TASKS_SUGGESTION = `${prefixUrlSchedules}/api/get-task-suggestion`;
export const SERVICES_GET_SCHEDULE_SUGGESTIONS = `${prefixUrlSchedules}/api/get-schedule-suggestions`;

export const SERVICES_GET_CUSTOMERS_BY_IDS = `${prefixUrlCustomers}/api/get-customers-by-ids`;
export const SERVICES_GET_SCHEDULES_BY_IDS = `${prefixUrlSchedules}/api/get-schedules-by-ids`;
export const SERVICES_GET_TASKS_BY_IDS = `${prefixUrlSchedules}/api/get-tasks-by-ids`;
export const SERVICES_GET_MILESTONES_BY_IDS = `${prefixUrlSchedules}/api/get-milestones-by-ids`;
