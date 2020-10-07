import { combineReducers } from 'redux';
import { loadingBarReducer as loadingBar } from 'react-redux-loading-bar';

import locale, { LocaleState } from './locale';
import authentication, { AuthenticationState } from './authentication';
import applicationProfile, { ApplicationProfileState } from './application-profile';
import actionExecuting, { ActionExecutingState } from './action-executing';
import administration, { AdministrationState } from './administration.reducer';

/* jhipster-needle-add-reducer-import - JHipster will add reducer here */
import passwordChange, {
  PasswordChangeState
} from 'app/modules/account/password/password-change.reducer';
import passwordReset, {
  PasswordResetState
} from 'app/modules/account/password/password-reset.reducer';
import passwordResetCode, {
  PasswordResetCodeState
} from 'app/modules/account/password/password-reset-code.reducer';
import employeeList, { EmployeeListState } from 'app/modules/employees/list/employee-list.reducer';
import customerList, { CustomerListState } from 'app/modules/customers/list/customer-list.reducer';
import taskList, { TaskListState } from 'app/modules/tasks/list/task-list.reducer';
import employeeInfo, {
  EmployeeInfoState
} from 'app/modules/employees/create-edit/create-edit-employee.reducer';
import global, { GlobalState } from 'app/modules/global/task/global-control-task.reducer';
import milestone, {
  MilestoneState
} from 'app/modules/tasks/milestone/create-edit/create-edit-milestone.reducer';
import detailMilestone, {
  DetailMilestoneState
} from 'app/modules/tasks/milestone/detail/detail-milestone.reducer';
import departmentRegistEdit, {
  DepartmentRegistEditState
} from 'app/modules/employees/department/department-regist-edit.reducer';
import dynamicList, {
  DynamicListState
} from 'app/shared/layout/dynamic-form/list/dynamic-list.reducer';
import dynamicField, { DynamicFieldState } from './dynamic-field.reducer';
import popupFieldsSearch, {
  PopupFieldsSearchState
} from 'app/shared/layout/dynamic-form/popup-search/popup-fields-search.reducer';
import managerSetting, {
  ManagerSettingState
} from 'app/modules/employees/manager/manager-setting.reducer';
import tagAutoCompleteState, {
  TagAutoCompleteState
} from 'app/shared/layout/common/suggestion/tag-auto-complete.reducer';
import fieldsSearchResultsState, {
  FieldsSearchResultsState
} from 'app/shared/layout/common/suggestion/list-result/fields-search-result.reducer';
import employeeControlSidebar, {
  EmployeeControlSidebarState
} from 'app/modules/employees/control/employee-control-sidebar.reducer';
import employeeDetail, {
  EmployeeDetailState
} from 'app/modules/employees/popup-detail/popup-employee-detail-reducer';
import groupModal, {
  GroupModalState
} from 'app/modules/employees/group/employee-group-modal.reducer';
// import salesGroupModal, { SalesGroupModalState } from 'app/modules/sales/group/sales-group-modal.reducer';
import salesGroupModal, {
  SalesGroupModalState
} from 'app/modules/sales/group/sales-group-modal.reducer';
import productList, { ProductListState } from 'app/modules/products/list/product-list.reducer';
import businessCardList, {
  BusinessCardListState
} from 'app/modules/businessCards/list/business-card-list.reducer';
import categoryRegistEdit, {
  CategoryRegistEditState
} from 'app/modules/products/category/category-regist-edit.reducer';
import productControlSidebar, {
  ProductControlSidebarState
} from 'app/modules/products/control/product-control-sidebar.reducer';
import popupProductSet, {
  PopupProductSetState
} from 'app/modules/products/popup/popup-product-set.reducer';
import productPopupEditState, {
  ProductPopupEditState
} from 'app/modules/products/product-popup/product-edit.reducer';
import productDetail, {
  ProductDetailState
} from 'app/modules/products/product-detail/product-detail-reducer';
import productSetDetail, {
  ProductSetDetailState
} from 'app/modules/products/popup-product-set-detail/popup-product-set-detail-reducer';
import inviteEmployees, {
  InviteEmployeesState
} from 'app/modules/employees/inviteEmployees/invite-employees.reducer';
import businessCardMySharedListState, {
  BusinessCardMySharedListState
} from 'app/modules/businessCards/my-shared-list/business-card-my-shared-list-modal.reducer';
import customerMySharedListState, {
  CustomerMySharedListState
} from 'app/modules/customers/my-shared-list/customer-my-shared-list-modal.reducer';
import salesMySharedListState, {
  SalesMySharedListState
} from 'app/modules/sales/my-shared-list/sales-my-shared-list-modal.reducer';
import employeesMySharedListState, {
  EmployeesMySharedListState
} from 'app/modules/employees/my-shared-list/employees-my-shared-list-modal.reducer';
import dynamicGroupModalState, {
  DynamicGroupModalState
} from 'app/shared/layout/dynamic-form/group/dynamic-group-modal.reducer';
import taskInfo, {
  TaskInfoState
} from 'app/modules/tasks/create-edit-task/create-edit-task.reducer';
import subTaskInfo, {
  SubTaskInfoState
} from 'app/modules/tasks/create-edit-subtask/create-edit-subtask.reducer';
import detailTask, { DetailTaskState } from 'app/modules/tasks/detail/detail-task.reducer';
import dataMilestone, {
  MilestoneListState
} from 'app/modules/tasks/control/field-milestones.reducer';
import mergeBusinessCard, {
  MergeBusinessCardState
} from 'app/modules/businessCards/popup-merge-business-cards/merge-business-cards.reducer';
import customerControlSidebar, {
  CustomerControlSidebarState
} from 'app/modules/customers/control/customer-control-sidebar.reducer';
import customerInfo, {
  CustomerInfoState
} from 'app/modules/customers/create-edit-customer/create-edit-customer.reducer';
import customerDetail, {
  CustomerDetailState
} from 'app/modules/customers/popup-detail/popup-customer-detail.reducer';
import customerModal, {
  CustomerModalState
} from 'app/modules/customers/customer-integration/customer-integration.reducer';
import addEditNetworkMap, {
  AddEditNetworkMapState
} from 'app/modules/customers/network-map-modal/add-edit-network-map.reducer';
import salesList, { SalesListState } from 'app/modules/sales/sales-list/sales-list.reducer';
import salesControlSidebar, {
  SalesControlSidebarState
} from 'app/modules/sales/control/sales-control-sidebar-reducer';

import organization, {
  SelectOrganizationState
} from 'app/shared/layout/dynamic-form/control-field/edit/field-edit-select-org.reducer.ts';
import dataGlobalToolSchedule, {
  GlobalToolState
} from 'app/modules/calendar/global-tool/global-tool-reducer';

import dataCalendarGrid, {
  CalendarGridState
} from 'app/modules/calendar/grid/calendar-grid.reducer';
import dataModalSchedule, {
  ScheduleModalState
} from 'app/modules/calendar/modal/calendar-modal.reducer';
import dataCreateEditSchedule, {
  CreateEditScheduleState
} from 'app/modules/calendar/popups/create-edit-schedule.reducer';
import listOperation, {
  ListOperationState
} from 'app/modules/customers/list-operation/list-operation.reducer';
import dataCalendarSearch, {
  AdvancedSearchCalendarState
} from 'app/modules/calendar/search-advanced/popup-fields-search.reducer';
import sharedList, {
  SharedListState
} from 'app/modules/businessCards/shared-list/shared-list.reducer';
import myListModalState, {
  MyListModalState
} from 'app/modules/businessCards/my-list/my-list-modal.reducer';
import businessCardDetail, {
  BusinessCardDetailState
} from 'app/modules/businessCards/business-card-detail/business-card-detail-reducer';
import businessCardDetailBy, {
  BusinessCardDetailByState
} from 'app/modules/businessCards/business-card-detail/business-card-detail-tabs/BusinessCardDetailReducer.tsx';
import moveListBusinessCard, {
  MoveListBusinessCardState
} from 'app/modules/businessCards/move-list/move-list.reducer';
import businessCardTranfer, {
  BusinessCardTranferState
} from 'app/modules/businessCards/business-card-detail/popup-business-card-transfer/popup-business-card-transfer.reducer';
import createEditBusinessCard, {
  CreateEditBusinessCardState
} from 'app/modules/businessCards/create-edit-business-card/create-edit-business-card.reducer';
import screenMoveState, { ScreenMoveState } from 'app/shared/reducers/screen-move.reducer';
import helpModal, { HelpModalState } from 'app/modules/help/help.reducer';
import activityListReducerState, {
  ActivityListReducerState
} from 'app/modules/activity/list/activity-list-reducer';
import timelineReducerState, { TimelineReducerState } from 'app/modules/timeline/timeline-reducer';
import timelineCommonReducerState, {
  TimelineCommonReducerState
} from 'app/modules/timeline/timeline-common-reducer';
import timelineReactionReducerState, {
  TimelineReactionReducerState
} from 'app/modules/timeline/control/reaction/timeline-reaction-reducer';
import saml, { SamlState } from 'app/modules/setting/system/saml/saml.reducer';
import scheduleType, {
  ScheduleTypeState
} from 'app/modules/setting/calendar/schedule/schedule-type.reducer';
import ipAddress, {
  IpAddressState
} from 'app/modules/setting/system/ip-address/ip-address.reducer';
import period, { PeriodState } from 'app/modules/setting/system/period/period.reducer';
import logAccess, {
  logAccessState
} from 'app/modules/setting/system/logs-access/logs-access.reducer';
import publicAPI, { PublicAPIState } from 'app/modules/setting/system/public-api/publicAPI.reducer';
import activityFormat, {
  ActivityFormatState
} from 'app/modules/setting/task/activity-format/activity-format.reducer';
import productTrade, {
  ProductTradeState
} from 'app/modules/setting/product/product-trade/product-trade.reducer';
import masterPosition, {
  MasterPositionState
} from 'app/modules/setting/customer/master-position/master-position.reducer';
import employeesSetting, {
  EmployeesSettingState
} from 'app/modules/setting/employee/employeePosition/job_title_master.reducer';
import productTypeMaster, {
  ProductTypeMasterState
} from 'app/modules/setting/task-product/product-type-master/product-type-master.reducer';
import scenarioSetting, {
  ScenarioSettingState
} from 'app/modules/setting/customer/scenarios/scenarios.reducer';
import googleCalendar, {
  GoogleCalendarState
} from 'app/modules/setting/calendar/google/google-calendar.reducer';
import equipmentType, {
  EquipmentTypeState
} from 'app/modules/setting/calendar/equiqment/equipment-type.reducer';
import holiday, { HolidayState } from 'app/modules/setting/calendar/holiday/holiday.reducer';
import tagSuggestionState, {
  TagSuggestionState
} from 'app/modules/activity/common/tag-suggestion/tag-suggestion.reducer';
import notification, {
  NotificationState
} from 'app/shared/layout/menu/notification/notification.reducer';
import menuLeft, { MenuLeftState } from 'app/shared/layout/menu/sidebar-menu-left.reducer';
import tagSuggestProductCategoriesState, {
  TagSuggestProductCategoriesState
} from 'app/modules/products/suggestion/tag-auto-complete-product-category.reducer';
import general, { GeneralState } from 'app/modules/setting/system/general/general.reducer';
import employeeDetailAction, {
  EmployeeDetailActionState
} from 'app/shared/layout/menu/employee-detail/employee-detail-setting.reducer';
import searchGlobal, {
  SearchGlobalState
} from 'app/shared/layout/menu/search-global/search-global.reducer';
import feedback, { FeedbackState } from 'app/shared/layout/menu/feedback/feedback.reducer';
import sharedGroupSales, {
  SharedGroupSalesState
} from 'app/modules/sales//shared-group/shared-group.reducer';
import popupDetailTab, {
  PopupDetailTabState
} from '../layout/popup-detail-service-tabs/popup-detail-tab.reducer';
import beginerPortal, { BeginerPortalState } from 'app/shared/layout/menu/portal/portal-reducer';
import uploadCSV, { UploadState } from 'app/modules/upload/import-csv.reducer';
export const lastAction = (state = null, action) => action;

export interface IRootState {
  readonly general: GeneralState;
  readonly authentication: AuthenticationState;
  readonly locale: LocaleState;
  readonly applicationProfile: ApplicationProfileState;
  readonly administration: AdministrationState;
  readonly passwordReset: PasswordResetState;
  readonly passwordChange: PasswordChangeState;
  readonly passwordResetCode: PasswordResetCodeState;
  readonly employeeList: EmployeeListState;
  readonly taskList: TaskListState;
  readonly productList: ProductListState;
  readonly businessCardList: BusinessCardListState;
  readonly departmentRegistEdit: DepartmentRegistEditState;
  readonly categoryRegistEdit: CategoryRegistEditState;
  readonly dynamicList: DynamicListState;
  readonly dynamicField: DynamicFieldState;
  readonly popupFieldsSearch: PopupFieldsSearchState;
  readonly managerSetting: ManagerSettingState;
  readonly tagAutoCompleteState: TagAutoCompleteState;
  readonly employeeControlSidebar: EmployeeControlSidebarState;
  readonly employeeInfo: EmployeeInfoState;
  readonly global: GlobalState;
  readonly employeeDetail: EmployeeDetailState;
  readonly productControlSidebar: ProductControlSidebarState;
  readonly popupProductSet: PopupProductSetState;
  readonly productPopupEditState: ProductPopupEditState;
  readonly productDetail: ProductDetailState;
  readonly productSetDetail: ProductSetDetailState;
  readonly inviteEmployees: InviteEmployeesState;
  readonly groupModal: GroupModalState /* jhipster-needle-add-reducer-type - JHipster will add reducer type here */;
  readonly salesGroupModal: SalesGroupModalState;
  readonly milestone: MilestoneState;
  readonly taskInfo: TaskInfoState;
  readonly subTaskInfo: SubTaskInfoState;
  readonly detailMilestone: DetailMilestoneState;
  readonly detailTask: DetailTaskState;
  readonly dataMilestone: MilestoneListState;

  // Customer
  readonly customerList: CustomerListState;
  readonly customerControlSidebar: CustomerControlSidebarState;
  readonly listOperation: ListOperationState;
  readonly customerDetail: CustomerDetailState;
  readonly customerInfo: CustomerInfoState;
  readonly businessCardMySharedListState: BusinessCardMySharedListState;
  readonly customerMySharedListState: CustomerMySharedListState;
  readonly salesMySharedListState: SalesMySharedListState;
  readonly employeesMySharedListState: EmployeesMySharedListState;
  readonly dynamicGroupModalState: DynamicGroupModalState;
  readonly customerModal: CustomerModalState;
  readonly addEditNetworkMap: AddEditNetworkMapState;
  readonly mergeBusinessCard: MergeBusinessCardState;
  readonly sharedList: SharedListState;
  readonly myListModalState: MyListModalState;
  readonly businessCardDetail: BusinessCardDetailState;
  readonly businessCardDetailBy: BusinessCardDetailByState;
  readonly moveListBusinessCard: MoveListBusinessCardState;
  readonly businessCardTranfer: BusinessCardTranferState;
  readonly organization: SelectOrganizationState;

  readonly dataModalSchedule: ScheduleModalState;
  readonly dataCalendarGrid: CalendarGridState;
  readonly dataGlobalToolSchedule: GlobalToolState;
  readonly dataCreateEditSchedule: CreateEditScheduleState;
  readonly tagSuggestProductCategoriesState: TagSuggestProductCategoriesState;

  readonly dataCalendarSearch: AdvancedSearchCalendarState;
  readonly screenMoveState: ScreenMoveState;
  readonly activityListReducerState: ActivityListReducerState;
  readonly tagSuggestionState: TagSuggestionState;
  readonly timelineReducerState: TimelineReducerState;
  readonly timelineCommonReducerState: TimelineCommonReducerState;
  readonly timelineReactionReducerState: TimelineReactionReducerState;
  /* jhipster-needle-add-reducer-type - JHipster will add reducer type here */
  readonly loadingBar: any;
  readonly actionExecuting: ActionExecutingState;
  readonly createEditBusinessCard: CreateEditBusinessCardState;
  readonly salesList: SalesListState;
  readonly saml: SamlState;
  readonly scheduleType: ScheduleTypeState;
  readonly ipAddress: IpAddressState;
  readonly period: PeriodState;
  readonly logAccess: logAccessState;
  readonly publicAPI: PublicAPIState;
  readonly activityFormat: ActivityFormatState;
  readonly productTrade: ProductTradeState;
  readonly employeesSetting: EmployeesSettingState;
  readonly productTypeMaster: ProductTypeMasterState;
  readonly masterPosition: MasterPositionState;
  readonly equipmentType: EquipmentTypeState;
  readonly scenarioSetting: ScenarioSettingState;
  readonly googleCalendar: GoogleCalendarState;
  readonly notification: NotificationState;
  readonly menuLeft: MenuLeftState;
  readonly holiday: HolidayState;
  readonly fieldsSearchResultsState: FieldsSearchResultsState;
  readonly employeeDetailAction: EmployeeDetailActionState;
  readonly searchGlobal: SearchGlobalState;
  readonly feedback: FeedbackState;
  readonly salesControlSidebar: SalesControlSidebarState;
  readonly sharedGroupSales: SharedGroupSalesState;
  readonly popupDetailTab: PopupDetailTabState;
  readonly lastAction: any;
  readonly beginerPortal: BeginerPortalState;
  readonly helpModal: HelpModalState;
  readonly uploadCSV: UploadState;
}

const rootReducer = combineReducers<IRootState>({
  authentication,
  locale,
  applicationProfile,
  administration,
  passwordReset,
  passwordChange,
  passwordResetCode,
  employeeList,
  taskList,
  productList,
  businessCardList,
  categoryRegistEdit,
  departmentRegistEdit,
  dynamicList,
  dynamicField,
  popupFieldsSearch,
  managerSetting,
  tagAutoCompleteState,
  employeeControlSidebar,
  employeeInfo,
  global,
  employeeDetail,
  productControlSidebar,
  popupProductSet,
  productDetail,
  productSetDetail,
  inviteEmployees,
  productPopupEditState,
  groupModal,
  salesGroupModal,
  milestone,
  detailMilestone,
  taskInfo,
  subTaskInfo,
  detailTask,
  dataMilestone,

  // Customer
  customerList,
  customerControlSidebar,
  listOperation,
  customerDetail,
  customerInfo,
  businessCardMySharedListState,
  customerMySharedListState,
  salesMySharedListState,
  employeesMySharedListState,
  dynamicGroupModalState,
  customerModal,
  addEditNetworkMap,
  mergeBusinessCard,
  sharedList,
  myListModalState,
  businessCardDetail,
  businessCardDetailBy,
  moveListBusinessCard,
  businessCardTranfer,
  createEditBusinessCard,

  organization,
  dataModalSchedule,
  dataCalendarGrid,
  dataGlobalToolSchedule,
  dataCreateEditSchedule,
  dataCalendarSearch,
  screenMoveState,
  activityListReducerState,
  tagSuggestionState,
  timelineReducerState,
  timelineCommonReducerState,
  timelineReactionReducerState,
  loadingBar,
  actionExecuting,
  salesList,
  saml,
  scheduleType,
  ipAddress,
  period,
  logAccess,
  publicAPI,
  activityFormat,
  productTrade,
  employeesSetting,
  productTypeMaster,
  masterPosition,
  equipmentType,
  scenarioSetting,
  notification,
  menuLeft,
  googleCalendar,
  holiday,
  fieldsSearchResultsState,
  tagSuggestProductCategoriesState,
  general,
  employeeDetailAction,
  searchGlobal,
  feedback,
  salesControlSidebar,
  sharedGroupSales,
  popupDetailTab,
  lastAction,
  beginerPortal,
  helpModal,
  uploadCSV
});

export default rootReducer;
