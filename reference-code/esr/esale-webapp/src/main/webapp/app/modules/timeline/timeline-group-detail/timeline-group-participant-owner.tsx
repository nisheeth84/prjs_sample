import React, { useState, useEffect } from 'react'
import { IRootState } from 'app/shared/reducers'
import { connect } from 'react-redux'
import { Modal } from 'reactstrap';
import _ from 'lodash';
import {
    handleToggleGroupParticipantsOwnerModal
  , handleUpdateMemberOfTimelineGroup
  , handleToggleGroupDetailOwner
  , handleToggleAddMemberToGroupModal
  , reset
  , handleSetModalMessageMode
  , handleDeleteMemberRequest
  , handleGetTimelineGroups
  , handleGetPermissionOfEmployee
  , handleResetMessageInfo
} from '../timeline-reducer';
import { Storage, translate } from 'react-jhipster';
import { TimelineGroupType, InvitesType } from '../models/get-timeline-groups-model';
import DropdowlistBasicControl from '../control/local-tool/dropdowlist-basic-control';
import TimelineGroupDialog from '../timeline-group-detail/timeline-group-dialog';
import TimelineGroupDialogPrivilege from '../timeline-group-detail/timeline-group-dialog-privilege'
import TimelineGroupDialogDeleteMember from '../timeline-group-detail/timeline-group-dialog-delete-member'
import ShowDetailToolTip from '../control/timeline-content/show-detail-tooltip';
import TimelineGroupAddMember from '../timeline-group-detail/timeline-group-add-member';
import { FSActionTypeScreen } from 'app/modules/employees/create-edit/modal-create-edit-employee';
import TimelineMessageInfo from '../control/message-info/timeline-message-info';
import { CommonUtil } from '../common/CommonUtil';
import { LIST_AUTHORITY_DROPDOWN } from '../common/constants';
import TimelineGroupParticipants from '../timeline-group-detail/timeline-group-participants'

type ITimelineGroupParticipantOwnerProp = StateProps & DispatchProps & {
  data?: InvitesType;
  popout?: boolean;
  mode: number;     // 1 is listGroup, 2 is groupDetail
  timelineChannelId?; // Id of timeline group detail
  canBackAddMember?: boolean, // if true, enable button back
  onClosePopupOwner?: () => any // function on close popup,
}

const TimelineGroupParticipantOwner = (props: ITimelineGroupParticipantOwnerProp) => {
  const [itemSelect, setItemSelect] = useState(null);
  const [countEmp1, setCountEmp1] = useState(null);
  const [countEmp2, setCountEmp2] = useState(null);
  const [timelineGroup, setTimelineGroup] = useState({} as TimelineGroupType);
  const [isModal1, setIsModal1] = useState(false);
  const [isModal2, setIsModal2] = useState(false);
  const [listOwner, setListOwner] = useState(null);
  const [showModal, setShowModal] = useState(true);
  const [listEmployeeOfTimelineGroups, setListEmployeeOfTimelineGroups] = useState(null);
  const [isReset, setIsReset] = useState(false);
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [timelineGroupId, setTimelineGroupId] = useState(props.popout ? Storage.local.get(TimelineGroupParticipantOwner.name)?.timelineGroupId : null);

  /**
   * set mode to display message on modal
   */
  useEffect(() => {
    props.handleSetModalMessageMode(true)
    return () => { props.handleSetModalMessageMode(false) }
  }, [])

  /**
   * close modal
   */
  const handleCloseModal = () => {
    if (props.mode === 1){
      props.handleGetTimelineGroups({ timelineGroupIds: [], sortType: 1 });
    } else {
      props.handleGetTimelineGroups({ timelineGroupIds: [props.timelineChannelId], sortType: 1 });
    }
    props.handleToggleGroupParticipantsOwnerModal(false);
  }

  // Get employeeId UserLogin
  const userLoginId = CommonUtil.getUserLogin().employeeId;

  /**
   * Change permision when click dropdown list
   * @param value
   * @param obj
   * @param item
   */
  const handlePrivilege = (value, obj, item) => {
    props.handleResetMessageInfo();
    if (value === 2 && Number(item.inviteId) === Number(userLoginId)) {
      if(item.authority !== 2) {
        if (listOwner.length === 1 && Number(item.authority) === 1) {
          setIsModal2(true); // owner only
        } else {
          setItemSelect(item);
          setIsModal1(true);
        }
      }
    } else if (value === 2 && Number(item.inviteId) !== Number(userLoginId)) {
      if (Number(item.inviteType) === 1) {
        props.handleUpdateMemberOfTimelineGroup({
          timelineGroupId: timelineGroup.timelineGroupId,
          inviteId: item.inviteId,
          inviteType: item.inviteType,
          status: item.status,
          authority: 2,
          isOwner: false,
          isDepartment: true
        });
      } else {
        props.handleUpdateMemberOfTimelineGroup({
          timelineGroupId: timelineGroup.timelineGroupId,
          inviteId: item.inviteId,
          inviteType: item.inviteType,
          status: item.status,
          authority: 2,
          isOwner: false,
          isDepartment: false
        });
      }
    } else {
      props.handleUpdateMemberOfTimelineGroup({
        timelineGroupId: timelineGroup.timelineGroupId,
        inviteId: item.inviteId,
        inviteType: item.inviteType,
        status: item.status,
        authority: 1,
        isOwner: false,
        isDepartment: false
      });
    }
  }

  /**
   * show diaglog warning when delete member
   */
  const showDialogWarning = (item) => {
    setItemSelect(item);
    setIsOpenDialog(true);
  }

  useEffect(() => {
    if(props.popout && !props.isAddMemberSuccess) {
      const saveObj = Storage.local.get(TimelineGroupParticipantOwner.name);
      props.handleGetPermissionOfEmployee(saveObj?.timelineGroupId);
    }
  }, [])

  /**
   * Set data when open new window
   */
  const updateStateSession = (mode: FSActionTypeScreen) => {
    if (mode === FSActionTypeScreen.SetSession) {
      Storage.local.set(TimelineGroupParticipantOwner.name, {
        countEmp1,
        countEmp2,
        timelineGroup,
        listOwner,
        isModal1,
        isModal2,
        itemSelect,
        isReset,
        isOpenDialog,
        listEmployeeOfTimelineGroups,
        timelineGroupId
      });
    } else if (mode === FSActionTypeScreen.GetSession) {
      const saveObj = Storage.local.get(TimelineGroupParticipantOwner.name);
      if (saveObj) {
        setCountEmp1(saveObj.countEmp1);
        setCountEmp2(saveObj.countEmp2);
        setTimelineGroup(saveObj.timelineGroup);
        setListOwner(saveObj.listOwner);
        setIsModal1(saveObj.isModal1);
        setIsModal2(saveObj.isModal2);
        setItemSelect(saveObj.itemSelect);
        setIsReset(saveObj.isReset);
        setIsOpenDialog(saveObj.isOpenDialog);
        setListEmployeeOfTimelineGroups(saveObj.listEmployeeOfTimelineGroups);
        setTimelineGroupId(saveObj.timelineGroupId);
      }
    } else if (mode === FSActionTypeScreen.RemoveSession) {
      Storage.local.remove(TimelineGroupParticipantOwner.name);
    }
  };
  const firstLoad = () => {
    if (props.popout) {
      updateStateSession(FSActionTypeScreen.GetSession);
      setShowModal(false);
      document.body.className = "wrap-timeline modal-open body-full-width";
    } else {
      setShowModal(true);
    }
  }

  useEffect(() => {
    firstLoad();
    return () => {
      props.reset();
      document.body.className = document.body.className.replace('modal-open', '');
    }
  }, []);

  /**
   * Click button open new window
   */
  const openNewWindow = () => {
    updateStateSession(FSActionTypeScreen.SetSession);
    setShowModal(false);
    const height = screen.height * 0.6;
    const width = screen.width * 0.6;
    const left = screen.width * 0.2;
    const top = screen.height * 0.2;
    const style = `width=${width},height=${height},left=${left},top=${top}`;
    window.open(`${props.tenant}/channel/list-member-of-owner`, '', style.toString());
    handleCloseModal();
  }

  /**
   * Count employee of group/member request join group
   * @param timelineGroupLst
   * @param status
   */
  const countEmp = (timelineGroupLst, status) => {
    if (timelineGroupLst?.invites?.length > 0) {
      let count = 0;
      timelineGroupLst.invites.forEach(item => {
        count += Number(item.status) === status ? 1 : 0;
      })
      return count;
    }
    return 0;
  }

  /**
   *  set list employee
   */
  useEffect(() => {
    setListEmployeeOfTimelineGroups(props.listEmployeeOfTimelineGroups);
  }, [props.listEmployeeOfTimelineGroups])

  useEffect(() => {
    setTimelineGroupId(props.timelineGroupId)
  }, [props.timelineGroupId])

  /**
   * get list invite of listTimelineGroups
   */
  useEffect(() => {
    let _timelineGroup = null;
    if (listEmployeeOfTimelineGroups?.length > 0) {
      for (let index = 0; index < listEmployeeOfTimelineGroups.length; index++) {
        if (_timelineGroup) {
          _timelineGroup.invites = _.concat(_timelineGroup.invites, listEmployeeOfTimelineGroups[index].invites);
        } else {
          _timelineGroup = listEmployeeOfTimelineGroups[index];
        }
      }
      setTimelineGroup(_timelineGroup);
      setCountEmp1(countEmp(_timelineGroup, 2));
      setCountEmp2(countEmp(_timelineGroup, 1));
    }
    if (_timelineGroup?.invites?.length > 0) {
      const listTemp = [];
      _timelineGroup['invites'].forEach((item) => {
        if (Number(item.authority) === 1) {
          listTemp.push(item);
        }
      })
      setListOwner([...listTemp]);
    }
  }, [listEmployeeOfTimelineGroups])

  /**
   * open modal add member to group
   */
  const handleAddMember = () => {
    props.handleToggleAddMemberToGroupModal(true);
  }

  const closeModalAddMember = () =>{
    props.handleToggleAddMemberToGroupModal(false);
  }

  /**
   * onClosePopupOwner
   */
  const onClosePopupOwner = () => {
    if (!props.canBackAddMember) {
      return;
    }
    if (props.onClosePopupOwner) {
      props.onClosePopupOwner();
    }
  }

  useEffect(() => {
    if(props.errorCode){
      setIsReset(true);
      setTimeout(() => {
        setIsReset(false);
      }, 1000)
    }
  },[props.errorCode])

  const renderModal = () => {
    return <>
      <div className="modal popup-esr popup-esr4 user-popup-page popup-align-right show" id="popup-esr" aria-hidden="true">
        <div className={`${!props.popout ? "modal-dialog" : "h-100 modal-dialog"} form-popup`}>
          <div className="modal-content">
            <div className="modal-header">
              <div className="left">
                <div className="popup-button-back">
                  <button tabIndex={0} className={`icon-small-primary icon-return-small  ${props.canBackAddMember ? '' : 'disable'}`} onClick={onClosePopupOwner}/>
                  <span className="text">
                    <img className="icon-timeline-small" src="../../../content/images/ic-timeline-popup.svg" alt="" />
                    {translate('timeline.group.participants-owner.modal-name')}
                  </span>
                </div>
              </div>
              {showModal && (
                <div className="right">
                  <button tabIndex={0} className="icon-small-primary icon-link-small" onClick={() => openNewWindow()} />
                  <button tabIndex={0} className="icon-small-primary icon-close-up-small line" onClick={handleCloseModal} />
                </div>
              )}
            </div>
            <div className="modal-body style-3">
              <TimelineMessageInfo isModal={true} />
              <div className="popup-content style-3">
                <div className="pb-2">
                  <h4 className="color-333 mb-4">{translate('timeline.group.participants-owner.request-participation')}({countEmp1})</h4>
                  <div className="row">
                    {timelineGroup?.invites?.length > 0 && timelineGroup?.invites?.map((item, index) => {
                      if (Number(item.status) === 2) {
                        return (
                          <div className="col-lg-4 d-flex mb-3" key={`${index}group_owners_${item.inviteId}`}>
                            <div className="item item2 flex-grow">
                              <ShowDetailToolTip data={item} key={`${index}tooltips_${item.inviteId}`} position="left" isModal={true} />
                              <span className="text-blue">{item.inviteName}</span>
                            </div>
                            <div className="right-button">
                              <button tabIndex={0}
                                className="button-primary font-size-12 color-999"
                                onClick={() => props.handleUpdateMemberOfTimelineGroup({
                                  timelineGroupId: timelineGroup.timelineGroupId,
                                  inviteId: item.inviteId,
                                  inviteType: item.inviteType,
                                  status: 1,
                                  authority: 2,
                                  isOwner: false,
                                  isDepartment: false
                                })}>
                                {translate('timeline.group.participants-owner.approval-btn')}</button>
                              <button tabIndex={0}
                                className="button-primary font-size-12 color-999 ml-2"
                                onClick={() => props.handleDeleteMemberRequest({
                                  timelineGroupId: timelineGroup.timelineGroupId,
                                  inviteId: item.inviteId,
                                  inviteType: item.inviteType
                                })}>
                                {translate('timeline.group.participants-owner.reject-btn')}</button>
                            </div>
                          </div>);
                      }
                    })}
                  </div>
                </div>
                <div className="pb-2">
                  <h4 className="color-333 mb-4">{translate('timeline.group.participants-owner.participant-permission')}({countEmp2})
                  <button tabIndex={0} className="button-primary button-add-new font-size-12 color-666 ml-4"
                      onClick={() => handleAddMember()} onMouseDown={e => e.preventDefault()}>{translate('timeline.group.participants-owner.button-add')}</button>
                  </h4>
                  <div className="row">
                    {timelineGroup?.invites?.length > 0 && timelineGroup?.invites.map((item, idx) => {
                      if (Number(item.status) === 1) {
                        return <>
                          <div className="col-lg-4 d-flex mb-3 align-items-start" key={`owner_${item.inviteId}`}>
                            <div className="item item2 flex-grow">
                              <ShowDetailToolTip data={item} key={`detail_tooltip_${item.inviteId}`} position="left" isModal={true}/>
                              <span className="text-blue">{item.inviteName}</span>
                            </div>
                            <div className="d-flex right-button" >
                              <DropdowlistBasicControl
                                listItem={LIST_AUTHORITY_DROPDOWN as []}
                                label="label"
                                value="value"
                                defaultValue={item.authority}
                                onSelectedChange={(itemValue, objectValue) => {
                                  setIsReset(false);
                                  handlePrivilege(itemValue, objectValue, item);
                                }}
                                isReset={isReset}
                              />
                              <button tabIndex={0} title="" className="button-primary font-size-12 color-999 ml-2"
                                onClick={() => showDialogWarning(item)} onMouseDown={e => e.preventDefault()}>
                                {translate('timeline.group.participants-owner.button-delete-member')}</button>
                            </div>
                          </div>
                        </>
                      }
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isModal1 &&
        <TimelineGroupDialog timelineGroupId={timelineGroup.timelineGroupId} data={itemSelect}
          onClose={(isConfirm: boolean) => { if (!isConfirm) { setIsReset(true); } setIsModal1(false) }} />}
      {isModal2 && <TimelineGroupDialogPrivilege onClose={() => { setIsReset(true); setIsModal2(false) }} />}
      {isOpenDialog &&
        <TimelineGroupDialogDeleteMember
          timelineGroupId={timelineGroup.timelineGroupId}
          data={itemSelect}
          onClose={() => setIsOpenDialog(false)}/>}
    </>
  }
  if (showModal) {
    return (
      <>
        <Modal isOpen fade={true} toggle={() => { }} backdrop id="popup-field-search" autoFocus={true} zIndex="auto">
          {renderModal()}
          {props.toggleAddMemberToTimelineGroup && <TimelineGroupAddMember
          data={timelineGroup?.invites}
          canBack={true}
          onClosePopup={closeModalAddMember}
          timelineGroupIds={timelineGroupId}/>}
        </Modal>
      </>
    );
  } else {
    if (props.popout) {
      return (<>
        {renderModal()}
        {props.toggleAddMemberToTimelineGroup &&
          <TimelineGroupAddMember
            data={timelineGroup?.invites}
            popout={true}
            canBack={true}
            onClosePopup={closeModalAddMember}
            timelineGroupIds={timelineGroup?.timelineGroupId}
            />}
        {props.toggleViewGroupDetail && <TimelineGroupParticipants popout={true}  />}
      </>);
    } else {
      return <></>;
    }
  }
}

const mapStateToProps = ({ applicationProfile, timelineReducerState, timelineCommonReducerState }: IRootState) => ({
  tenant: applicationProfile.tenant,
  listEmployeeOfTimelineGroups: timelineReducerState.listEmployeeOfTimelineGroups,
  timelineGroupId: timelineReducerState.timelineGroupId,
  toggleAddMemberToTimelineGroup: timelineReducerState.toggleAddMemberToTimelineGroup,
  listTimelineGroups: timelineReducerState.listTimelineGroups,
  isAddMemberSuccess: timelineReducerState.isAddMemberSuccess,
  errorCode: timelineReducerState.errorCode,
  messageInfo: timelineReducerState.messageInfo,
  toggleViewGroupDetail: timelineReducerState.toggleViewGroupDetail
});

const mapDispatchToProps = {
  handleToggleGroupParticipantsOwnerModal,
  handleUpdateMemberOfTimelineGroup,
  handleToggleGroupDetailOwner,
  handleToggleAddMemberToGroupModal,
  reset,
  handleSetModalMessageMode,
  handleDeleteMemberRequest,
  handleGetTimelineGroups,
  handleGetPermissionOfEmployee,
  handleResetMessageInfo
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TimelineGroupParticipantOwner);
