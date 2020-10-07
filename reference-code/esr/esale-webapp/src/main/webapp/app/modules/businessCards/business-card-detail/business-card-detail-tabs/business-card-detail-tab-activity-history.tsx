import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import { TAB_ID_LIST } from '../../constants';
import { handleInitActivities, handleShowDetail } from 'app/modules/activity/list/activity-list-reducer'
import ActivityListContent from 'app/modules/activity/list/activity-list-content';
import { ACTIVITY_ACTION_TYPES } from 'app/modules/activity/constants';
import ShowDetail from 'app/modules/activity/common/show-detail';
import ConfirmPopup from 'app/modules/activity/control/confirm-popup';
import styled from 'styled-components';
import { TYPE_DETAIL_MODAL } from 'app/modules/activity/constants';

const PopupWrapped = styled.div`
  .modal-content .popup-esr2-footer .button-red {
    padding: 10px 25px;
  }
`
const ActivityWrapped = styled.div` 
  .activity-info-body .flag-wrap {
    margin-bottom: 0 !important;
    padding: 0 !important;
    background: #ffffff !important;
    padding-left: 1rem !important;
    justify-content: flex-start !important;
  }
  .esr-content-content {
    min-height: 450px;
  }
  .modal-content .popup-esr2-footer .button-red {
    padding: 10px 25px;
  }
`;

export interface ITabActivityHistory extends StateProps, DispatchProps {
  businessCardId?: any,
  currentTab?: any,
  onOpenModalEmployeeDetail?,
  onOpenPopupBusinessCardTransfer?,
  onOpenModalCustomerDetail?,
  onOpenPopupTaskDetail?,
  onOpenPopupActivityDetail?,
  onOpenPopupMileStoneDetail?,
  onOpenPopupCreateActivity?
  activities?: any[]
  customerId?: number
  customerIds? :number[]
  hasLoginUser? :boolean
  handleInitData?
  isTabSummary? :boolean
}

const TabActivityHistory = (props: ITabActivityHistory) => {

  useEffect(() => {
    if (props.currentTab && props.currentTab === TAB_ID_LIST.activity) {
      const orderBy = [{ key: "contact_date", value: "DESC" }];
      const paramsInitActivities = {
        listBusinessCardId: [props.businessCardId],
        listCustomerId: props.customerIds,
        orderBy
      }
      props.handleInitActivities(paramsInitActivities);
    }
  }, [props.currentTab])

  useEffect(() => {
    if(props.deleteActivityIds) {
      if (props.currentTab && props.currentTab === TAB_ID_LIST.activity) {
        const orderBy = [{ key: "contact_date", value: "DESC" }];
        const paramsInitActivities = {
          listBusinessCardId: [props.businessCardId],
          listCustomerId: props.customerIds,
          orderBy
        }
        props.handleInitActivities(paramsInitActivities);
      } else if (props.currentTab && props.currentTab === TAB_ID_LIST.summary) {
        props.handleInitData(props.businessCardId, props.currentTab, props.customerIds, props.hasLoginUser)
      }
    }
  }, [props.deleteActivityIds])

  const onClickDetailPopup = (objectId, type) => {
    if (objectId) {
      if (type === TYPE_DETAIL_MODAL.MILESTONE) {
        props.onOpenPopupMileStoneDetail(objectId);
        document.body.className = "wrap-task modal-open";
      } else if ((type === TYPE_DETAIL_MODAL.BUSINESS_CARD && objectId !== props.businessCardId) || type !== TYPE_DETAIL_MODAL.BUSINESS_CARD) {
        // props.handleShowDetail(objectId, type, `BusinessCard_${props.businessCardId}`, true)
      }
    }
  }

  const onClickEdit = (id, actionType, viewMode, isDraft?) => {
    if (id) {
      props.onOpenPopupCreateActivity(id, ACTIVITY_ACTION_TYPES.UPDATE);
    }
  }

  const onClickDetailActivity = (id, idx?) => {
    if (id) {
      props.onOpenPopupActivityDetail(id);
    }
  }

  // useEffect(() => {
  //   if (props.openConfirmPopup) {
  //     document.body.className = "wrap-activity modal-open";
  //   } else {
  //     document.body.className = "wrap-card modal-open";
  //   }
  // }, [props.openConfirmPopup])

  return (
    <div className="tab-content">
      <div className="tab-pane active wrap-activity">
        <ActivityWrapped>
          <ActivityListContent
            activities={props.activities}
            onClickDetailPopup={onClickDetailPopup}
            onClickEdit={onClickEdit}
            onClickDetailActivity={onClickDetailActivity}
            isTabSummary={props.isTabSummary}
          />
          <ShowDetail cleanClosePopup={true} idCaller={`BusinessCard_${props.businessCardId}`} customerIdOfBusinessCard={props.customerId}/>
          {props.openConfirmPopup &&
            <PopupWrapped>
              <ConfirmPopup infoObj={props.confirmPopupItem} />
            </PopupWrapped>}
        </ActivityWrapped>
      </div>
    </div>
  );
}

const mapStateToProps = ({ authentication, businessCardDetail, applicationProfile, businessCardTranfer, screenMoveState, businessCardList, activityListReducerState }: IRootState) => ({
  tenant: applicationProfile.tenant,
  authorities: authentication.account.authorities,
  businessCard: businessCardDetail.businessCard,
  businessCardHistory: businessCardDetail.businessCardHistory,
  businessCardFieldsUnVailable: businessCardDetail.businessCardFieldsUnVailable,
  deleteBusinessCards: businessCardDetail.deleteBusinessCards,
  tabListShow: businessCardDetail.tabListShow,
  screenMode: businessCardDetail.screenMode,
  action: businessCardDetail.action,
  messageUpdateCustomFieldInfoSuccess: businessCardDetail.messageUpdateCustomFieldInfoSuccess,
  messageUpdateCustomFieldInfoError: businessCardDetail.messageUpdateCustomFieldInfoError,
  msgSuccess: businessCardList.msgSuccess,
  errorItems: businessCardDetail.errorItems,
  openConfirmPopup: activityListReducerState.openConfirmPopup,
  confirmPopupItem: activityListReducerState.confirmPopupItem,
  deleteActivityIds: activityListReducerState.deleteActivityIds
});

const mapDispatchToProps = {
  handleInitActivities,
  handleShowDetail
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TabActivityHistory);