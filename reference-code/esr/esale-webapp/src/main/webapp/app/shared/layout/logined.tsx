import React from 'react'
import { Switch } from 'react-router-dom';

// import Login from 'app/modules/account/login/login';
import Employee from "app/modules/employees";
import Customer from "app/modules/customers";
import BusinessCard from "app/modules/businessCards";
import BusinessCardDetail from "app/modules/businessCards/business-card-detail/business-card-detail";
import Product from "app/modules/products";
import Sales from "app/modules/sales";
import Home from 'app/modules/home/home';
import Task from 'app/modules/tasks';
import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';
import PageNotFound from 'app/shared/error/page-not-found';
import { AUTHORITIES } from 'app/config/constants';
import { MenuPrivateRoute } from './../auth/menu-private-route';
import InviteEmployee from 'app/modules/employees/inviteEmployees/modal-invite-employees'
import { PopupPrivateRoute } from './../auth/popup-private-route';
import PopupFieldsSearch from './dynamic-form/popup-search/popup-fields-search';
import PopupFieldsSearchMulti from './dynamic-form/popup-search/popup-fields-search-multi';
import PopupProductSet from "app/modules/products/popup/popup-product-set";
import PopupProduct from "app/modules/products/product-popup/product-edit";
import ProductDetail from "app/modules/products/product-detail/product-detail";
import PopupEmployeeDetail from 'app/modules/employees/popup-detail/popup-employee-detail';
import PopupCustomerDetail from 'app/modules/customers/popup-detail/popup-customer-detail';
import ProductSetDetail from "app/modules/products/popup-product-set-detail/popup-product-set-detail";
import EmployeeAddToGroupModal from 'app/modules/employees/group/employee-add-to-group-modal'
import EmployeeMoveToGroupModal from 'app/modules/employees/group/employee-move-to-group-modal'
import AddEditMyGroupModal from 'app/modules/employees/group/add-edit-my-group-modal'
import ManagerSetting from 'app/modules/employees/manager/manager-setting';
import DepartmentRegistEdit from 'app/modules/employees/department/department-regist-edit'
import ModalCreateEditProduct from 'app/modules/products/product-popup/product-edit';
import createEditMilestoneModal from 'app/modules/tasks/milestone/create-edit/create-edit-milestone-modal';
import ModalCreateEditEmployee from 'app/modules/employees/create-edit/modal-create-edit-employee';
import CreateEditCustomerModal from 'app/modules/customers/create-edit-customer/create-edit-customer-modal';
import ModalDetailMilestone from 'app/modules/tasks/milestone/detail/detail-milestone-modal';
import CreateEditTaskModal from 'app/modules/tasks/create-edit-task/modal-create-edit-task';
import DetailTaskModal from 'app/modules/tasks/detail/detail-task-modal';
import Timeline from 'app/modules/timeline/index'
import TimelineGroupAddEdit from 'app/modules/timeline/timeline-group-add-edit/timeline-group-add-edit';
import TimelineGroupParticipants from 'app/modules/timeline/timeline-group-detail/timeline-group-participants';
import TimelineGroupParticipantOwner from 'app/modules/timeline/timeline-group-detail/timeline-group-participant-owner';
import AddMemberToTimelineGroup from 'app/modules/timeline/timeline-group-detail/timeline-group-add-member';
import ModalCreateEditSubTask from 'app/modules/tasks/create-edit-subtask/modal-create-edit-subtask'
import Calendar from 'app/modules/calendar/index'
import { NewPopupCreateEditSchedule } from "app/modules/calendar/popups/new-popup-create-edit-schedule";
import CalendarDetail from 'app/modules/calendar/modal/calendar-detail';
import CalendarPopUpFieldsSearch from 'app/modules/calendar/search-advanced/pupup-fields-search';
import TimelineFollowedModal from 'app/modules/timeline/timeline-list/timeline-followed-modal';
import TimelineDetail from 'app/modules/timeline/control/timeline-content/timeline-detail';
import SidebarMenuLeft from './menu/sidebar-menu-left';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
// import SalesModalCreateSharedGroup from 'app/modules/sales/group/sales-modal-create-shared-group';
// import ModalSalesSharedGroupEdit from 'app/modules/sales/shared-group/modal-shared-group';
// import ModalSalesMyGroupEdit from 'app/modules/sales/group/add-edit-my-group-modal';
import Activity from 'app/modules/activity/index'
import ActivityModalForm from 'app/modules/activity/create-edit/activity-modal-form';
import ActivityModalDetail from 'app/modules/activity/detail/activity-modal-detail';
import CustomerMySharedListModal from 'app/modules/customers/my-shared-list/customer-my-shared-list-modal';
import SalesMySharedListModal from 'app/modules/sales/my-shared-list/sales-my-shared-list-modal';
import EmployeesMySharedListModal from 'app/modules/employees/my-shared-list/employees-my-shared-list-modal';
import AddEditMyListModal from 'app/modules/businessCards/my-list/add-edit-my-list-modal';
import AddEditShareListModal from 'app/modules/businessCards/shared-list/modal-shared-list';
import createEditBusinessCard from 'app/modules/businessCards/create-edit-business-card/create-edit-business-card';
import AnalysisReport from "app/modules/analysis/report";
import ModalBusinessCardTransfer from 'app/modules/businessCards/business-card-detail/popup-business-card-transfer/popup-business-card-transfer';
import MergeBusinessCard from 'app/modules/businessCards/popup-merge-business-cards/merge-business-cards';
import ExceptionPage from '../error/exception-page';
import PopupCreateShareList from 'app/modules/businessCards/list/popup/popup-create-share-list';
import BusinessCardMySharedListModal from 'app/modules/businessCards/my-shared-list/business-card-my-shared-list-modal';

const LoginedComponent = ({ isAuthenticated }) => {
  const renderComponent = () => {
    return (
      <>
        {isAuthenticated && <SidebarMenuLeft componentDisplay="" />}
        <Switch>
          <ErrorBoundaryRoute path="/employee" component={Employee} />
          <ErrorBoundaryRoute path="/customer" component={Customer} />
          <ErrorBoundaryRoute path="/businesscard" component={BusinessCard} />
          <ErrorBoundaryRoute path="/task" component={Task} />
          <ErrorBoundaryRoute path="/product" component={Product} />
          <ErrorBoundaryRoute path="/customer" component={Customer} />
          <ErrorBoundaryRoute path="/sales" component={Sales} />
          <ErrorBoundaryRoute path="/calendar" component={Calendar} />
          <ErrorBoundaryRoute path="/activity" component={Activity} />
          <PopupPrivateRoute path="/fields-search" exact component={PopupFieldsSearch} />
          <PopupPrivateRoute path="/fields-search-multi" exact component={PopupFieldsSearchMulti} />
          <PopupPrivateRoute path="/invite-employees" exact component={InviteEmployee} />
          <PopupPrivateRoute path="/create-edit-product-set" exact component={PopupProductSet} />
          <PopupPrivateRoute path="/create-product" exact component={PopupProduct} />
          <PopupPrivateRoute path="/product-detail/:productId" exact component={ProductDetail} />
          <PopupPrivateRoute path="/employee-detail/:employeeId" exact component={PopupEmployeeDetail} />
          <PopupPrivateRoute path="/customer-detail/:customerId" exact component={PopupCustomerDetail} />
          <PopupPrivateRoute path="/product-set-detail/:productId" exact component={ProductSetDetail} />
          <PopupPrivateRoute path="/add-to-group" exact component={EmployeeAddToGroupModal} />
          <PopupPrivateRoute path="/move-to-group" exact component={EmployeeMoveToGroupModal} />
          <PopupPrivateRoute path="/add-edit-my-group" exact component={AddEditMyGroupModal} />
          <PopupPrivateRoute path="/department-regist-edit" exact component={DepartmentRegistEdit} />
          <PopupPrivateRoute path="/customer-my-shared-list/:groupMode" exact component={CustomerMySharedListModal} />
          <PopupPrivateRoute path="/sales-my-shared-list/:groupMode" exact component={SalesMySharedListModal} />
          <PopupPrivateRoute path="/employees-my-shared-list/:groupMode" exact component={EmployeesMySharedListModal} />
          <PopupPrivateRoute path="/create-edit-product" exact component={ModalCreateEditProduct} />
          <PopupPrivateRoute path="/manager-setting" exact component={ManagerSetting} />
          <PopupPrivateRoute path="/create-edit-milestone" exact component={createEditMilestoneModal} />
          <PopupPrivateRoute path="/create-edit-employee" exact component={ModalCreateEditEmployee} />
          <PopupPrivateRoute path="/create-edit-customer" exact component={CreateEditCustomerModal} />
          <PopupPrivateRoute path="/detail-milestone/:milestoneId" exact component={ModalDetailMilestone} />
          <PopupPrivateRoute path="/create-edit-task/:taskId" exact component={CreateEditTaskModal} />
          <PopupPrivateRoute path="/create-edit-task" exact component={CreateEditTaskModal} />
          <PopupPrivateRoute path="/create-edit-subtask/:taskId" exact component={ModalCreateEditSubTask} />
          <PopupPrivateRoute path="/create-edit-subtask" exact component={ModalCreateEditSubTask} />
          <PopupPrivateRoute path="/detail-task/:taskId" exact component={DetailTaskModal} />
          <MenuPrivateRoute path="/" exact component={Home} hasAnyAuthorities={[AUTHORITIES.USER, AUTHORITIES.ADMIN]} />
          <PopupPrivateRoute path="/channel/list-member-of-owner" exact component={TimelineGroupParticipantOwner} />
          <PopupPrivateRoute path="/channel/list-member" exact component={TimelineGroupParticipants} />
          <PopupPrivateRoute path="/channel/add-member" exact component={AddMemberToTimelineGroup} />
          <PopupPrivateRoute path="/channel/create-edit" exact component={TimelineGroupAddEdit} />
          <PopupPrivateRoute path="/create-edit-schedule" exact component={NewPopupCreateEditSchedule} />
          <PopupPrivateRoute path="/detail-schedule/:scheduleId" exact component={CalendarDetail} />
          <PopupPrivateRoute path="/calendar-fields-search" exact component={CalendarPopUpFieldsSearch} />
          {/* <PopupPrivateRoute path="/create-edit-schedule" exact component={NewPopupCreateEditSchedule} /> */}
          <PopupPrivateRoute path="/detail-schedule/:scheduleId" exact component={CalendarDetail} />
          <PopupPrivateRoute path="/calendar-fields-search" exact component={CalendarPopUpFieldsSearch} />
          <PopupPrivateRoute path="/timeline/manage-follow" exact component={TimelineFollowedModal} />
          <PopupPrivateRoute path="/timeline/detail" exact component={TimelineDetail} />
          {/* <PopupPrivateRoute path="/sales-my-group-edit/:myGroupModalMode" exact component={ModalSalesMyGroupEdit} /> */}
          {/* <PopupPrivateRoute path="/sales-my-group-edit/:groupMode" exact component={ModalSalesMyGroupEdit} />
        <PopupPrivateRoute path="/add-edit-my-list/:groupMode" exact component={ModalSalesMyGroupEdit} />
        <PopupPrivateRoute path="/sales-shared-group/:groupMode" exact component={SalesModalCreateSharedGroup} />
        <PopupPrivateRoute path="/edit-sales-shared-group/:groupMode" exact component={ModalSalesSharedGroupEdit} />
        <PopupPrivateRoute path="/add-edit-share-list/:groupMode" exact component={ModalSalesSharedGroupEdit} /> */}
          <PopupPrivateRoute path="/create-edit-activity" exact component={ActivityModalForm} />
          <PopupPrivateRoute path="/activity-detail/:activityId" exact component={ActivityModalDetail} />
          <PopupPrivateRoute path="/add-edit-my-list" exact component={AddEditMyListModal} />
          <PopupPrivateRoute path="/shared-list/:groupMode" exact component={AddEditShareListModal} />
          <PopupPrivateRoute path="/business-card-detail/:businessCardId" exact component={BusinessCardDetail} />
          <PopupPrivateRoute path="/create-edit-business-card" exact component={createEditBusinessCard} />
          <ErrorBoundaryRoute path="/analysis" component={AnalysisReport} />
          <PopupPrivateRoute path="/business-card-detail/:businessCardId" exact component={BusinessCardDetail} />
          <PopupPrivateRoute path="/business-card-transfer/:businessCardId" exact component={ModalBusinessCardTransfer} />
          <PopupPrivateRoute path="/merge-business-card" exact component={MergeBusinessCard} />
          <PopupPrivateRoute path="/create-shared-list" exact component={PopupCreateShareList} />
          <ErrorBoundaryRoute path="/timeline" component={Timeline} />
          <PopupPrivateRoute path="/business-card-my-shared-list/:groupMode" exact component={BusinessCardMySharedListModal} />
          <ErrorBoundaryRoute component={PageNotFound} />
          <ErrorBoundaryRoute component={ExceptionPage} />
        </Switch>
      </>
    )
  };

  return (
    <>
      {renderComponent()}
    </>
  )
}

const mapStateToProps = (
  { authentication: { isAuthenticated } }: IRootState
) => ({
  isAuthenticated
});

type StateProps = ReturnType<typeof mapStateToProps>;

export const Logined = connect<StateProps>(
  mapStateToProps
)(LoginedComponent);

export default Logined;

