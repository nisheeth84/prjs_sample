import React, { useState, useEffect } from 'react';
import { ConditionScope, ConditionRange } from 'app/shared/layout/popup-detail-service-tabs/constants';
import { connect } from 'react-redux';
import { useId } from "react-id-generator";
import { decodeUserLogin } from 'app/shared/util/string-utils';
import ActivityListContent from 'app/modules/activity/list/activity-list-content';
import { handleShowDetail, handleInitActivities } from 'app/modules/activity/list/activity-list-reducer';
import { GetActivitiesForm } from 'app/modules/activity/models/get-activities-type';
import ShowDetail from 'app/modules/activity/common/show-detail';
import PopupActivityDetail from 'app/modules/activity/detail/activity-modal-detail';
import PopupEmployeeDetail from "app/modules/employees/popup-detail/popup-employee-detail";
import { TYPE_DETAIL_MODAL } from 'app/modules/activity/constants';
import { DEFINE_FIELD_TYPE } from '../dynamic-form/constants';

interface IDetailTabActivity extends StateProps, DispatchProps {
  customer: any;
  customerChild?: any[];
  searchScope?: number;
  searchRange?: number;
  activities?: any[];
  isGetDataFromSummary?: boolean;
  onOpenModalCreateUpdateActivity?: (activityId, activityDraftId, actionType, viewMode) => void;
  hideShowDetail?: boolean;
  onOpenCustomerParent?: any,
  listProductTradingId?: any[]
}
/**
 * Render component tab ProductTradings
 * @param props
 */
const DetailTabActivity = (props: IDetailTabActivity) => {
  const employeeLoginId = decodeUserLogin()['custom:employee_id'];
  const [isShowActivityDetail, setIsShowActivityDetail] = useState(false);
  const [activityId, setActivityId] = useState(null);
  const [showEmployeeDetails, setShowEmployeeDetails] = useState(false);
  const [employeeId, setEmployeeId] = useState(null);
  const employeeDetailCtrlId = useId(1, "activityDetailEmployeeDetail_")

  /**
   * searchConditions in paramTmp
   */
  const scopeConditionTmp = {
    fieldType: DEFINE_FIELD_TYPE.RADIOBOX,
    isDefault: true,
    fieldName: 'employee_id',
    fieldValue: JSON.stringify([employeeLoginId])
  }

  const paramTmp: GetActivitiesForm = {
    listCustomerId: [props.customer],
    searchConditions: []
  }

  const [param, setParam] = useState(null)

  useEffect(() => {
    let customerIds = props.customer && [props.customer];
    const searchConditions = [];
    if (props.searchRange === ConditionRange.ThisAndChildren) {
      let customerChild = [];
      if (props.customerChild) {
        customerChild = props.customerChild.map(e => Number.isInteger(e) ? e : e.customerId);
      }
      customerIds = [props.customer].concat(customerChild);
    }

    if (props.searchScope === ConditionScope.PersonInCharge) {
      searchConditions.push(scopeConditionTmp);
    }
    paramTmp.listCustomerId = customerIds;
    paramTmp.searchConditions = searchConditions;
    if(props.listProductTradingId && props.listProductTradingId.length){
      paramTmp.listProductTradingId = props.listProductTradingId || [];
    }
      
    setParam(paramTmp)
  }, [props.searchScope, props.searchRange]);

  useEffect(() => {
    if (!props.isGetDataFromSummary) {
      props.handleInitActivities(param);
    }
  }, [])

  useEffect(() => {
    if (!props.isGetDataFromSummary && param != null) {
      props.handleInitActivities(param);
    }
  }, [param]);

  const onClickDetailPopup = (objectId, type) => {
    if (type === TYPE_DETAIL_MODAL.EMPLOYEE) {
      setEmployeeId(objectId);
      setShowEmployeeDetails(true);
      return;
    }
    if(type === TYPE_DETAIL_MODAL.CUSTOMER){
      props.onOpenCustomerParent(objectId);
      return;
    }
    if (objectId) {
      props.handleShowDetail(objectId, type, `Customer_${props.customer}`);
    }
  }

  const onClickDetailActivity = (id) => {
    setIsShowActivityDetail(true);
    setActivityId(id);
  }

  const onClosePopupActivityDetail = () => {
    setIsShowActivityDetail(false);
    setActivityId(null);
  }

  // render many activity cards
  return (
    <div className="tab-pane active wrap-activity">
      <ActivityListContent
        onClickDetailPopup={onClickDetailPopup}
        onClickEdit={props.onOpenModalCreateUpdateActivity}
        onClickDetailActivity={onClickDetailActivity}
        activities={props.activities}
        deactiveId={props.customer}
        isTabCustomer={true}
      />
      {!props.hideShowDetail ? <ShowDetail idCaller={`Customer_${props.customer}`} /> : null}
      {isShowActivityDetail && <PopupActivityDetail
        activityId={activityId}
        listActivityId={[activityId]}
        onCloseActivityDetail={onClosePopupActivityDetail}
        canBack={true}
      />
      }
      {showEmployeeDetails &&
        <PopupEmployeeDetail
          id={employeeDetailCtrlId[0]}
          showModal={true}
          backdrop={true}
          openFromModal={true}
          employeeId={employeeId}
          listEmployeeId={[employeeId]}
          toggleClosePopupEmployeeDetail={() => setShowEmployeeDetails(false)} />
      }
    </div>
  )
}
const mapStateToProps = () => ({
  //
});

const mapDispatchToProps = {
  handleShowDetail,
  handleInitActivities,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DetailTabActivity);
