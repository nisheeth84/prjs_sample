import React, { useEffect, useMemo } from 'react';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { ActivityInfoType } from '../models/get-activity-type';
import { onclickEdit, onclickDelete, onclickShowModalActivityForm, toggleConfirmPopup, onclickDetail } from '../list/activity-list-reducer';
import { ConfirmPopupItem } from '../models/confirm-popup-item';
import { translate } from 'react-jhipster';
import { TYPE_DETAIL_MODAL, ACTIVITY_ACTION_TYPES, ACTIVITY_VIEW_MODES, MODE_CONFIRM } from '../constants';
import { CommonUtil } from '../common/common-util';
import { formatDateTime, formatDate, utcToTz } from 'app/shared/util/date-utils';
import _ from 'lodash';
import styled from 'styled-components';


export const AvatarDefault = styled.div`
  height: ${props => props.sizeAvatar + 'px'};
  width: ${props => props.sizeAvatar + 'px'};
  line-height: ${props => props.sizeAvatar + 'px'};;
  border-radius: 50%;
  background-color: #8ac891;
  display: inline-block;
  /* justify-content: center;
    align-items: center; */
  font-size: 14;
  vertical-align: middle;
  color: #fff;
  margin: 0 8px;
  text-align: center;
`;

export const AvatarReal = styled.img`
 height: ${props => props.sizeAvatar + 'px'};
  width: ${props => props.sizeAvatar + 'px'};
  line-height: ${props => props.sizeAvatar + 'px'};;
  border-radius: 50%;
  vertical-align: middle;
  margin: 0 8px;
  text-align: center;
`

type IActivityListContentHeaderProp = StateProps & DispatchProps & {
  data: ActivityInfoType,
  index: number,
  isDraft?: boolean,
  onClickDetailPopup: (objectId, type) => void,
  onClickDetailActivity: (id, idx) => void,
  onClickEdit: (activityId, activityDraftId, actionType, viewMode) => void
}

/**
 * component for show header content activity detail
 * @param props
 */
const ActivityListContentHeader = (props: IActivityListContentHeaderProp) => {

  const onClickEdit = (data: any) => {
    props.onClickEdit(data['activityId'], data['activityDraftId'], ACTIVITY_ACTION_TYPES.UPDATE, ACTIVITY_VIEW_MODES.EDITABLE)
  }

  const handleShowDetailActivity = (id: number) => {
    props.onClickDetailActivity(id, props.index);
  }

  const handleShowConfirmDelete = (data: ActivityInfoType) => {
    const id = props.isDraft ? data['activityDraftId'] : data['activityId'];
    const cancel = () => {
      props.toggleConfirmPopup(false);
    };
    const accept = () => {
      props.onclickDelete(id, props.isDraft);
      props.toggleConfirmPopup(false);
    };
    const confirmItem: ConfirmPopupItem = {
      modeConfirm: MODE_CONFIRM.DELETE,
      title: translate('activity.popup-delete.title'),
      content: "<p>" + translate('messages.WAR_COM_0001', { itemName: translate('activity.title-2') }) + "</p>",
      listButton: [
        {
          type: "cancel",
          title: translate('activity.popup-delete.button-cancel'),
          callback: cancel
        },
        {
          type: "red",
          title: translate('activity.popup-delete.button-delete'),
          callback: accept
        }
      ]
    };
    props.toggleConfirmPopup(true, confirmItem);
  }

  const onClickDetailPopup = (objectId, type) => {
    if (props.onClickDetailPopup) {
      props.onClickDetailPopup(objectId, type);
    }
  }

  const avatarIcon = useMemo(() => {
    let { employeeName, employeeSurname } = props.data.employee;
    employeeName = employeeName ? employeeName.toUpperCase()[0] : null;
    employeeSurname = employeeSurname ? employeeSurname.toUpperCase()[0] : null;

    return employeeSurname ?? (employeeName ?? ' ');
  }, [props.data.employee.employeeName, props.data.employee.employeeSurname]);

  return (
    <div className="activity-info-header custom-activity">
      <div className="item item2">
        {!_.isEmpty(props.data?.employee?.employeePhoto?.fileUrl) ? (
          <AvatarReal className="user ml-2" sizeAvatar={30} src={props.data?.employee?.employeePhoto?.fileUrl} alt="" title="" />
        ) : (
            <AvatarDefault sizeAvatar={30}>
              {avatarIcon}
            </AvatarDefault>
          )}
        {/* <ShowDetailTooltip data={props.data.employee}/> */}
        <span className="text-blue-activi font-size-12 font-weight-bold line-height-135">
          {!props.isDraft ? (
            <a className={`d-block`}>
              <span onClick={() => { handleShowDetailActivity(props.data?.activityId) }}>{formatDate(props.data?.contactDate)}</span>
              <span className="color-333 cursor-df"> ({CommonUtil.getTimeZoneFromDate(props.data?.activityStartTime)} - {CommonUtil.getTimeZoneFromDate(props.data?.activityEndTime)} {props.data?.activityDuration} {translate('activity.modal.minute')})</span>
            {!_.isNil(props.data?.activityDraftId) && <span className="label-red background-color-33 ml-3 px-3">{translate('activity.list.body.isDraft')}</span>}
            </a>) : (<span className={`d-block color-333`}>{formatDateTime(props.data?.contactDate, CommonUtil.getUseFormatDate())}
            <span className="color-333"> ({CommonUtil.getTimeZoneFromDate(props.data?.activityStartTime)} - {CommonUtil.getTimeZoneFromDate(props.data?.activityEndTime)} {props.data?.activityDuration} {translate('activity.modal.minute')})</span>
          </span>)
          }
          <a className="d-block" onClick={() => { onClickDetailPopup(props.data.employee.employeeId, TYPE_DETAIL_MODAL.EMPLOYEE) }}>{(props.data?.employee?.employeeSurname || "") + " " + (props.data?.employee?.employeeName || "")}</a>
        </span>
      </div>
      <div className="date">
        {/* {(props.data?.isDraft === 'false' || props.data?.isDraft === false) &&
          <a className="text-blue" onClick={() => { handleShowDetailActivity(props.data?.activityId) }}>{formatDateTime(props.data?.createdUser?.createdDate, CommonUtil.getUseFormatDate())}</a>
        } */}
        {CommonUtil.getEmployeeId() === props.data?.employee?.employeeId && <a className="icon-primary icon-edit icon-edit-t" onClick={() => { onClickEdit(props.data) }} />}
        {CommonUtil.getEmployeeId() === props.data?.employee?.employeeId && <a className="icon-primary icon-erase icon-edit-t" onClick={() => { handleShowConfirmDelete(props.data) }} />}
      </div>
    </div>
  )
}

const mapStateToProps = ({ applicationProfile }: IRootState) => ({
  tenant: applicationProfile.tenant,
});

const mapDispatchToProps = {
  onclickEdit,
  onclickDelete,
  onclickShowModalActivityForm,
  toggleConfirmPopup,
  onclickDetail
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ActivityListContentHeader);
