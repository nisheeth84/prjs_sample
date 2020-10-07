import React, { useState, useEffect } from 'react'
import { IRootState } from 'app/shared/reducers'
import { connect } from 'react-redux'

import {
  handleAddFavoriteTimelineGroup
  , toggleConfirmPopup, handleDeleteTimelineGroup
  , handleAddRequestToTimelineGroup
  , handleDeleteMemberOfTimelineGroup
  , handleGetOutTimelineGroup
  , handleDeleteFavoriteTimelineGroup
  , handleUpdateJoinRequestGroupStatus
  , handleSetModalConfirm
  , handleInfoGroupUser
  ,handleSetActiveNavigation
} from '../timeline-reducer'
import { ConfirmPopupItem } from '../models/confirm-popup-item'
import { translate } from 'react-jhipster'
import { handleToggleCheckCreateOrUpdate } from '../timeline-reducer'
import { GROUP_TIMELINE_MODE, STATUS_REQUEST_JOIN, TIMELINE_TYPE } from '../common/constants'
import { CommonUtil } from '../common/CommonUtil'
import { useHistory } from 'react-router'

type ILocalToolGroupLeftProp = StateProps & DispatchProps

const LocalToolGroupLeft = (props: ILocalToolGroupLeftProp) => {
  // to control status favorite
  const [isFavorite, setIsFavorite] = useState(null);
  // to control status request join
  const [isRequestJoin, setIsRequestJoin] = useState(null);
  // to navigator
  const history = useHistory();
  const [forceUpdate, setForceUpdate] = useState(0);

  /**
   * listen change settting
   */
  useEffect(() => {
    if(props.isChangeId) {
      setForceUpdate(forceUpdate+1);
    }
  }, [props.isChangeId])

  /**
   * add or delete request
   */
  const addOrDeleteRequest = () => {
    setIsRequestJoin(!isRequestJoin);
    props.handleUpdateJoinRequestGroupStatus(!isRequestJoin);
    if (!isRequestJoin) {
      props.handleAddRequestToTimelineGroup(props.timelineGroup.timelineGroupId)
    }
    else {
      props.handleDeleteMemberOfTimelineGroup({ timelineGroupId: props.timelineGroup.timelineGroupId, inviteId: null, inviteType: null}, true)
    }
  }

  useEffect(() => {
    if(props.timelineGroupRequestToGroupId){
      props.handleInfoGroupUser(props.timelineGroup?.timelineGroupId);
    }
  }, [props.timelineGroupRequestToGroupId])
  /**
   * set request join on init
   */
  useEffect(() => {
    setIsRequestJoin(props.timelineGroupsOfEmployee?.status === STATUS_REQUEST_JOIN.REQUEST);
    props.handleUpdateJoinRequestGroupStatus(props.timelineGroupsOfEmployee?.status === STATUS_REQUEST_JOIN.REQUEST);
  }, [props.timelineGroupsOfEmployee])

  /**
   * set favorite on init
   */
  useEffect(() => {
    if (props.timelineGroup && props.listFavoriteGroupId && props.listFavoriteGroupId.includes(props.timelineGroup.timelineGroupId)) {
      setIsFavorite(true);
    } else {
      setIsFavorite(false);
    }
  }, [props.listFavoriteGroupId, props.timelineGroup])

  /**
   * add or delete favorite
   */
  const addOrDeleteFavorite = () => {
    setIsFavorite(!isFavorite);
    if (!isFavorite) {
      props.handleAddFavoriteTimelineGroup(props.timelineGroup.timelineGroupId)
    }
    else {
      props.handleDeleteFavoriteTimelineGroup(props.timelineGroup.timelineGroupId)
    }
  }

  /**
   * delete group
   */
  const handleDeleteGroup = () => {
    const cancel = () => {
      props.toggleConfirmPopup(false);
    };

    const funcDelete = () => {
      props.handleDeleteTimelineGroup(props.timelineGroup.timelineGroupId);
      props.toggleConfirmPopup(false);
    };

    const deleteGroup: ConfirmPopupItem = {
      title: `${translate('timeline.popup-group.title')}`,
      content: `<p>${translate('timeline.popup-group.content')}</p><p>${translate('timeline.popup-group.contentBottom')}</p>`,
      listButton: [
        {
          type: "cancel",
          title: `${translate('timeline.popup-group.button-cancel')}`,
          callback: cancel
        },
        {
          type: "red",
          title: `${translate('timeline.popup-group.button-delete')}`,
          callback: funcDelete
        }
      ]
    };
    props.toggleConfirmPopup(true, deleteGroup);
  };

  // sync delete group action
  useEffect (() => {
    if(props.deleteTimelineGroupId) {
      history.push("/timeline/channel")
      props.handleSetActiveNavigation(TIMELINE_TYPE.GROUP+"");
    }
  },[props.deleteTimelineGroupId])

  /**
   * back to list group when out group
   */
  useEffect(() => {
    if(CommonUtil.getGroupUserMode(props.timelineGroupsOfEmployee) !== GROUP_TIMELINE_MODE.NOT_MEMBER && props.timelineGroupInviteId){
      history.push("/timeline/channel")
    }
  }, [props.timelineGroupInviteId])

  /**
   * get out group user
   */
  const handleGetOutGroupUser = () => {

    const cancel = () => {
      props.toggleConfirmPopup(false);
    };

    const funcDelete = () => {
      props.handleGetOutTimelineGroup({ timelineGroupId: props.timelineGroup.timelineGroupId, inviteId: null, inviteType: null}, null, null);
      props.handleSetModalConfirm(false);
    };

    const deleteGroupMember: ConfirmPopupItem = {
      title: `${translate('timeline.popup-group-delete-member.title')}`,
      content: `<p>${translate('timeline.popup-group-delete-member.content')}</p>`,
      listButton: [
        {
          type: "cancel",
          title: `${translate('timeline.popup-group-delete-member.button-cancel')}`,
          callback: cancel
        },
        {
          type: "red",
          title: `${translate('timeline.popup-group-delete-member.button-delete')}`,
          callback: funcDelete
        }
      ]
    };
    props.toggleConfirmPopup(true, deleteGroupMember);
  };

  return (
    <>
      {/* common */}
      <a className={`icon-primary icon-add-favorites ${isFavorite ? 'active' : 'normal'} ml-2`} onClick={() => { addOrDeleteFavorite() }} >
        <label className="tooltip-common"><span>{translate('timeline.button.like')}</span></label>
      </a>
      {/* page group of not member not join group */}
      {CommonUtil.getGroupUserMode(props.timelineGroupsOfEmployee) === GROUP_TIMELINE_MODE.NOT_MEMBER &&
        <a className={`icon-primary icon-people-run2 ${isRequestJoin ? 'active' : ''} `} onClick={() => addOrDeleteRequest()} >
          <label className="tooltip-common"><span>{translate('timeline.button.addRequest')}</span></label>
        </a>}
      {/* page group of owner */}
      {CommonUtil.getGroupUserMode(props.timelineGroupsOfEmployee) === GROUP_TIMELINE_MODE.MANAGER &&
        <a className="icon-primary icon-edit" onClick={() => props.handleToggleCheckCreateOrUpdate(props.timelineGroup.timelineGroupId)}>
          <label className="tooltip-common"><span>{translate('timeline.button.edit')}</span></label>
        </a>}
      {CommonUtil.getGroupUserMode(props.timelineGroupsOfEmployee) === GROUP_TIMELINE_MODE.MANAGER &&
        <a className="icon-primary icon-erase" onClick={() => { handleDeleteGroup() }}>
          <label className="tooltip-common"><span>{translate('timeline.button.delete')}</span></label>
        </a>}
      {/* page group of member out group */}
      {CommonUtil.getGroupUserMode(props.timelineGroupsOfEmployee) !== GROUP_TIMELINE_MODE.NOT_MEMBER &&
        <a className="icon-primary icon-people-run " onClick={() => { handleGetOutGroupUser() }} >
          <label className="tooltip-common"><span>{translate('timeline.button.exit-group')}</span></label>
        </a>}
    </>
  );
}

const mapStateToProps = ({ timelineReducerState, employeeDetailAction }: IRootState) => ({
  confirmPopupItem: timelineReducerState.confirmPopupItem,
  toggleTimelineModal: timelineReducerState.toggleTimelineModal,
  timelineGroupsOfEmployee: timelineReducerState.listTimelineGroupsOfEmployee? timelineReducerState.listTimelineGroupsOfEmployee[0] : null,
  timelineGroup: timelineReducerState.listTimelineGroups? timelineReducerState.listTimelineGroups[0] : null,
  listFavoriteGroupId: timelineReducerState.listFavoriteGroupId,
  deleteTimelineGroupId: timelineReducerState.deleteTimelineGroupId,
  timelineGroupInviteId: timelineReducerState.timelineGroupInviteId,
  timelineGroupRequestToGroupId: timelineReducerState.timelineGroupRequestToGroupId,
  isChangeId: employeeDetailAction.idUpdate
});

const mapDispatchToProps = {
  handleAddFavoriteTimelineGroup,
  toggleConfirmPopup,
  handleDeleteTimelineGroup,
  handleToggleCheckCreateOrUpdate,
  handleAddRequestToTimelineGroup,
  handleDeleteMemberOfTimelineGroup,
  handleDeleteFavoriteTimelineGroup,
  handleUpdateJoinRequestGroupStatus,
  handleSetModalConfirm,
  handleInfoGroupUser,
  handleGetOutTimelineGroup,
  handleSetActiveNavigation
}

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LocalToolGroupLeft);
