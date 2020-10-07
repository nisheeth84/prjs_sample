import customerList from "./modules/customer/list/customer-list-reducer";
import drawerLeft from "./modules/customer/drawer/drawer-left-reducer";
import { combineReducers } from "redux";
import employee, {
  initializeEmployeeConditionState,
  initializeListInfoState,
} from "./modules/employees/list/employee-list-reducer";
// import listInfo from './modules/employees/list/employee-temp-reducer';
import cart from "./modules/cart/cart-reducer";
import connection from "./modules/login/connection/connection-reducer";
import businessCard from "./modules/business-card/business-card-reducer";
import initializeLocalMenu from "./modules/employees/drawer/drawer-left-reducer";
import detailScreen from "./modules/employees/detail/detail-screen-reducer";
import listMember from "./modules/employees/group/group-add-list-member-reducer";
import authorization from "./modules/login/authorization/authorization-reducer";
import inviteEmployee from "./modules/employees/invite/invite-employee-reducer";
import menu from "./modules/menu/menu-feature-reducer";
import setting from "./modules/menu/menu-personal-settings/menu-settings-reducer";
import productDetails from "./modules/products/details/product-details-reducer";
import popupSort from "./modules/products/popup/popup-sort-reducer";
import productDrawerReducers from "./modules/products/drawer/product-drawer-reducer";
import productSetDetails from "./modules/products/product-set/product-set-details-reducer";
import product from "./modules/products/list/product-list-reducer";
import calendar from "./modules/calendar/calendar-reducer";
import search from "./modules/search/search-reducer";
import notification from "./modules/notification/notification-reducer";
import commonTab from "./shared/components/common-tab/common-tab-reducer";
import timelineReducers from "./modules/timeline/timeline-reducer";
import drawerTimeline from "./modules/timeline/drawer/timeline-drawer-reducer";
import initializeField from "./shared/api/api-reducer";
import businessCardReducers from "./modules/business-card/business-card-reducer";
import businessCardDrawerReducers from "./modules/business-card/navigators/business-card-drawer-reducer";
import commonSort from "./shared/components/popup-sort/popup-sort-reducer";
import businessCardDetail from "./modules/business-card/business-card-details/business-card-detail-reducer";
import tabCalendar from "./modules/business-card/tab-calendar/tab-calendar-reducer";
import activityHistoryInformation from "./modules/customer/detail/tabs/activity-history-information/activity-history-information-reducer";
import networkBusinessCard from "./modules/customer/detail/tabs/network-business-card/network-business-card-reducer";
import productsTrading from "./modules/customer/detail/tabs/tab-trading-products/trading-products-reducer";
import customerDetail from "./modules/customer/detail/customer-detail-reducer";
import changeHistory from "./modules/customer/detail/tabs/change-history/change-history-reducer";
import customerReducers from "./modules/customer/customer-reducer";
import timelineDetail from "./modules/timeline/modal-detail/modal-detail-reducer";
import followListReducer from "./modules/timeline/follow-management-list/follow-management-reducer";
import calendarCustomer from './modules/customer/detail/tabs/calendar-customer/calendar-reducer';
import ProductManageReducers from "./modules/products-manage/manage/product-manage-reducer";
import ProductManagerDrawerReducers from "./modules/products-manage/drawer/drawer-left-transaction-management-reducer";
import listTask from "./modules/task/list-task/list-task-reducer";
import createTask from "./modules/task/add-edit-task/create-task-reducer";
import globalTool from "./modules/task/global-tool-task/global-tool-reducer";
import taskDetail from "./modules/task/task-detail/task-detail-reducer";
import milestoneDetail from "./modules/task/milestone-detail/milestone-detail-reducer";
import drawerTask from './modules/task/drawer/drawer-task-reducer'
import activity from './modules/activity/list/activity-list-reducer';
import activityDetail from './modules/activity/detail/activity-detail-reducer';
import drawerActivity from './modules/activity/drawer/drawer-left-activity-reducer'
import activityCreateEdit from './modules/activity/create-edit/activity-create-edit-reducer'
import productsTradingProduct from './modules/products/details/tab-trading/trading-products-reducer'

const rootReducer = combineReducers({
  authorization,
  connection,
  employee,
  cart,
  businessCard,
  customerList,
  drawerLeft,
  activity,
  drawerActivity,
  activityDetail,
  activityCreateEdit,
  commonTab,
  customerDetail,
  changeHistory,
  initializeLocalMenu,
  detailScreen,
  notification,
  listMember,
  initializeListInfoState,
  initializeEmployeeConditionState,
  calendar,
  inviteEmployee,
  menu,
  setting,
  activityHistoryInformation,
  networkBusinessCard,
  productsTrading,
  search,
  initializeField,
  businessCardReducers,
  businessCardDrawerReducers,
  commonSort,
  businessCardDetail,
  tabCalendar,
  customerReducers,
  timelineReducers,
  drawerTimeline,
  timelineDetail,
  followListReducer,
  calendarCustomer,
  ProductManageReducers,
  ProductManagerDrawerReducers,
  listTask,
  createTask,
  globalTool,
  taskDetail,
  milestoneDetail,
  drawerTask,
  product,
  productDrawerReducers,
  productSetDetails,
  productDetails,
  popupSort,
  productsTradingProduct,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
