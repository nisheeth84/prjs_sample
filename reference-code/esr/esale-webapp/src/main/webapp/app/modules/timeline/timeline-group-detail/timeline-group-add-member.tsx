import React, { useState, useEffect, useRef } from 'react'
import { IRootState } from 'app/shared/reducers'
import { connect } from 'react-redux'
import { Modal } from 'reactstrap';
import {
    handleToggleAddMemberToGroupModal
  , handleAddMemberToTimelineGroup
  , handleSetModalMessageMode
  , handleToggleGroupDetailOwner
} from '../timeline-reducer';
import { Storage, translate } from 'react-jhipster';
import TagAutoComplete from 'app/shared/layout/common/suggestion/tag-auto-complete'
import { TagAutoCompleteMode, TagAutoCompleteType } from 'app/shared/layout/common/suggestion/constants'
import { AddMember } from '../models/add-member-to-timeline-group-model';
import { FSActionTypeScreen } from 'app/modules/employees/create-edit/modal-create-edit-employee';
import TimelineMessageInfo from '../control/message-info/timeline-message-info';
import { LIST_PERMISSION_TIMELINE_GROUP } from '../common/constants';
import _ from 'lodash';
import DialogDirtyCheckTimeline from '../common/dialog-dirty-check-timeline';
import TimelineGroupParticipantOwner from '../timeline-group-detail/timeline-group-participant-owner'
import TimelineGroupParticipants from '../timeline-group-detail/timeline-group-participants'


type IAddMemberToTimelineGroupProp = StateProps & DispatchProps & {
  // default value of dropdown
  defaultValue?: any,
  data?: any;
  timelineGroupIds?: number;
  popout?: boolean,
  canBack?: boolean, // if true, enable button back
  onClosePopup?: () => any // function on close popup,
}

const TimelineGroupAddMember = (props: IAddMemberToTimelineGroupProp) => {


  // Timeline group default
  const timelineGroupDefaultForm: AddMember = {
    timelineGroupInvites: [],
  };

  const [timelineGroupForm, setTimelineGroupForm] = useState(timelineGroupDefaultForm);
  const [showModal, setShowModal] = useState(true);
  const [listMember, setListMember] = useState([]);
  const [textContent, setTextContent] = useState(null);
  const [tags, setTags] = useState([]);
  const ref = useRef(null);
  const [timelineGroupIdsBackup,setTimelineGroupIdsBackup] = useState(null);
  const [data, setData] = useState(props.data);

  /**
   * set mode to display message on modal
   */
  useEffect(() => {
    props.handleSetModalMessageMode(true)
    setTimelineGroupIdsBackup(props.timelineGroupIds)
    return () => {!props.toggleViewGroupDetailOwners && props.handleSetModalMessageMode(false)}
  }, [])

  const cancelEvent = (event) => {
    if (event.keyCode === 9 && event.shiftKey) {
      event.stopPropagation();
    }
  }
  /**
   * get list inviteId
   */
  const getListInviteId = () => {
    const listInviteIdOfTimelineGroup: any[] = [];
    (data && data.length > 0 && data.forEach(element => {
      if (element.authority && element.status === 1) {
        const listNotSuggest = {
          idChoice: element.inviteId,
          searchType: element.inviteType
        }
        listInviteIdOfTimelineGroup.push(listNotSuggest)
      }
    })
    )
    return listInviteIdOfTimelineGroup;
  }

  /**
   *  set content to sent email
   */
  const setContent = (event) => {
    setTextContent(event.target.value);
  }

  /**
   * Get dropdown authority
   */
  const getListPermission = () => {
    const listPermission = [];
    LIST_PERMISSION_TIMELINE_GROUP.forEach((e, idx) => {
      listPermission.push({id: e.itemId, name: translate(e.itemLabel)});
    });
    return listPermission;
  };

  /**
   * Handle when select list member suggestion
   * @param id
   * @param type
   * @param mode
   * @param listTag
   */
  const onActionSelectMember = (id: any, type: TagAutoCompleteType, mode: TagAutoCompleteMode, listTag: any[]) => {
    const tmpListTags = listTag.map(epl => {
      if(epl.employeeId) {
        epl.inviteType = 2;
        epl.inviteId = epl.employeeId;
      } else if(epl.departmentId) {
        epl.inviteType = 1;
        epl.inviteId = epl.departmentId;
      } else if (epl.groupId) {
        epl.inviteId = epl.groupId;
        epl.inviteType = 2;
      }
      epl.status = 1;
      if(epl.participantType) {
        epl.authority = epl.participantType;
        return epl;
      } else {
        epl.authority = 1;
        return {...epl, participantType: 1};
      }
    });
    setTags(tmpListTags);
    ref.current.setTags(tmpListTags);
  };

  useEffect(() => {
    setListMember(tags);
  }, [tags])

  /**
   * set authority when select option
   * @param tagSelected
   * @param type
   */
  const setAuthority = (tagSelected, type) => {
    const listEmployeeBackup = _.cloneDeep(listMember);
    listEmployeeBackup.forEach(item => {
      if(item.employeeId && tagSelected.employeeId && item.employeeId === tagSelected.employeeId) {
        item.authority = type;
      } else if (item.departmentId && tagSelected.departmentId && item.departmentId === tagSelected.departmentId) {
        const type1 = type;
        item.authority = type1;
      } else if(item.groupId && tagSelected.groupId && item.groupId === tagSelected.groupId) {
        const type2 = type;
        item.authority = type2;
      }
    });
    setListMember(listEmployeeBackup);
  };

  /**
   * set data for api addMemberToTimelineGroup
   * param: listMember, inviteId, inviteType, status, authority
   */
  const setDataAddMemberToTimelineGroup = (_timelineGroupId) => {
    // disable button add member
    if (listMember?.length <= 0) {
      return;
    }
    // get data
    const listTimelineGroupsInvite = [];
    const tempCheckduplicateEmployee = [];
    // const arrayTemp = [];
    const cloneList = _.cloneDeep(listMember);
    cloneList.forEach(item => {
      if (item.groupId) {
        item.employeesGroups.forEach(gr => {
          const emp = {
            timelineGroupId: _timelineGroupId,
            inviteId: null,
            inviteType: null,
            status: null,
            authority: null
          };
          emp.inviteId = gr.employeeId;
          emp.inviteType = 2;
          emp.status = item.status;
          emp.authority = item.authority;
          listTimelineGroupsInvite.push(emp);
        })
      } else {
        const emp = {
          timelineGroupId: _timelineGroupId,
          inviteId: null,
          inviteType: null,
          status: null,
          authority: null
        };
        Object.keys(emp).forEach(key => {
          if(item[key]) {
            emp[key] = item[key];
          }
        })
        listTimelineGroupsInvite.push(emp);
      }
    });
    listTimelineGroupsInvite.forEach(element => {
      const isExistEmployee = tempCheckduplicateEmployee.some(emp => emp.inviteId === element.inviteId);
      if(!isExistEmployee) {
        tempCheckduplicateEmployee.push(element);
      }
    })
    setTimelineGroupForm({ ...timelineGroupForm, timelineGroupInvites: tempCheckduplicateEmployee });
    props.handleAddMemberToTimelineGroup({ ...timelineGroupForm, timelineGroupInvites: tempCheckduplicateEmployee, content: textContent });
  };

  // close modal
  const handleCloseModal = () => {
    props.handleToggleAddMemberToGroupModal(false);
  }

  /**
   * Set data when open new window
   */
  const updateStateSession = (mode: FSActionTypeScreen) => {
    if (mode === FSActionTypeScreen.SetSession) {
      Storage.local.set(TimelineGroupAddMember.name, {
        listMember,
        timelineGroupForm,
        timelineGroupIdsBackup,
        data
      });
    } else if (mode === FSActionTypeScreen.GetSession) {
      const saveObj = Storage.local.get(TimelineGroupAddMember.name);
      if (saveObj) {
        setListMember(saveObj.listEmployee);
        setTimelineGroupForm(saveObj.timelineGroupForm);
        setTimelineGroupIdsBackup(saveObj.timelineGroupIdsBackup);
        setData(saveObj.data);
      }
    } else if (mode === FSActionTypeScreen.RemoveSession) {
      Storage.local.remove(TimelineGroupAddMember.name);
    }
  };
  const firstLoad = () => {
    if (props.popout && !props.canBack) {
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
      document.body.className = document.body.className.replace('modal-open', '');
    }
  }, []);

  /**
   * Click button open new window
   */
  const openNewWindow = () => {
    setShowModal(false);
    updateStateSession(FSActionTypeScreen.SetSession);
    const height = screen.height * 0.8;
    const width = screen.width * 0.8;
    const left = screen.width * 0.3;
    const top = screen.height * 0.3;
    const style = `width=${width},height=${height},left=${left},top=${top}`;
    window.open(`${props.tenant}/channel/add-member`, '', style.toString());
    handleCloseModal();
  }

  /**
   * onClosePopup
   */
  const onClosePopup = () => {
    if (!props.canBack) {
      return;
    }
    if (props.onClosePopup) {
      props.onClosePopup();
    }
  }

  /**
   * executeDirtyCheck
   */
  const executeDirtyCheck = async () => {
    const onCancel = () => { };
    if (listMember.length > 0 || textContent) {
      await DialogDirtyCheckTimeline({
        onLeave: handleCloseModal, onStay: onCancel,
        ok: translate('global.dialog-dirtycheck.parttern1.confirm'),
        cancel: translate('global.dialog-dirtycheck.parttern1.cancel'),
        content: translate('timeline.dirty-check.content-create-timeline-group'),
        title: translate('global.dialog-dirtycheck.parttern1.title') });
    } else {
      handleCloseModal()
    }
  };

  /**
   * open participant owner when add member success in new window
   */
  // useEffect(() => {
  //   if (props.popout) {
  //     if (props.isAddMemberSuccess === true) {
  //       onClosePopup();
  //     }
  //   }
  // }, [props.isAddMemberSuccess])

  const closeModalOwner = () => {
    props.handleToggleGroupDetailOwner(false);
  }

  /**
   * render select employee selection
   */
  const renderSelectEmployee = () => {
    return <>
      <div className="row">
        <div className="col-lg-12">
          <div className="col-lg-6  form-group mb-2 p-0">
            <TagAutoComplete
              id="employeeIdAddMember"
              ref={ref}
              className="items break-line form-group"
              placeholder={translate('timeline.group.add-member.search')}
              inputClass="input-normal"
              modeSelect={TagAutoCompleteMode.Multi}
              type={TagAutoCompleteType.Employee}
              listActionOption={getListPermission()}
              tagListNotSuggestion={getListInviteId()}
              onActionSelectTag={onActionSelectMember}
              elementTags={listMember}
              onActionOptionTag={setAuthority}
              title={translate('timeline.group.add-member.group-member')}
            />
          </div>
        </div>
        <div className="col-lg-12 form-group common">
          <label>{translate('timeline.group.add-member.notification-content')}</label>
          <textarea
            className="input-normal"
            onChange={() => { setContent(event) }}
            value={textContent}
            placeholder={translate('timeline.group.add-member.enter-notification-content')}
          />
        </div>
      </div>
    </>
  }

  const renderModal = () => {
    return <>
        <div className="modal popup-esr popup-esr4 user-popup-page show popup-align-right show " id="popup-esr" aria-hidden="true">
          <div className={`${!props.popout ? "modal-dialog" : "h-100 modal-dialog"} form-popup`}>
            <div className="modal-content">
              <div className="modal-header">
                <div className="left">
                  <div className="popup-button-back">
                    <button tabIndex={0} className={`icon-small-primary icon-return-small  ${props.canBack ? '' : 'disable'}`} onClick={onClosePopup}/>
                    <span className="text">
                      <img className="icon-timeline-small" src="../../../content/images/ic-timeline-popup.svg" alt="" />
                      {translate('timeline.group.add-member.add-participants')}
                    </span>
                  </div>
                </div>
                {showModal &&
                  <div className="right">
                  <button tabIndex={0} className="icon-small-primary icon-link-small" onClick={() => openNewWindow()} />
                  <button tabIndex={0} className="icon-small-primary icon-close-up-small line" onClick={()=>{executeDirtyCheck()}} />
                </div>}
              </div>
              <div className="modal-body style-3">
                <TimelineMessageInfo isModal = {true}/>
                <div className="popup-content  style-3">
                  <div className="user-popup-form user-popup-form2">
                    {renderSelectEmployee()}

                  </div>
                </div>
              </div>
              {timelineGroupForm.timelineGroupInvites !== null &&
                <div className="user-popup-form-bottom">
                  <button tabIndex={0} className={`button-blue ${listMember?.length > 0 ? "" : "disable"}`}
                    onClick={() => setDataAddMemberToTimelineGroup(!props.popout ? props.timelineGroupIds : timelineGroupIdsBackup)}>
                    {translate('timeline.group.add-member.add')}
                  </button>
                </div>
              }
            </div>
          </div>
        </div>
    </>
  }
  if (showModal) {
    return (
      <>
        <div id="parentModal" onKeyDown={(event) => cancelEvent(event)}>
          <Modal isOpen={true} fade={true} toggle={() => { }} id="popup-field-search" autoFocus={true} zIndex="auto">
            {renderModal()}
          </Modal>
        </div>
      </>
    );
  } else {
    if (props.popout) {
      return (<>
        {renderModal()}
        {props.toggleViewGroupDetailOwners &&
        <TimelineGroupParticipantOwner
          mode={1}
          popout={true}
          timelineChannelId={[]}
          canBackAddMember={true}
          onClosePopupOwner={closeModalOwner}
          />}
          {props.toggleViewGroupDetail && <TimelineGroupParticipants popout={true}  />}
      </>);

    } else {
      return <></>;
    }
  }
}

const mapStateToProps = ({ applicationProfile, timelineReducerState }: IRootState) => ({
  tenant: applicationProfile.tenant,
  isAddMemberSuccess: timelineReducerState.isAddMemberSuccess,
  toggleViewGroupDetailOwners: timelineReducerState.toggleViewGroupDetailOwners,
  toggleViewGroupDetail: timelineReducerState.toggleViewGroupDetail
});

const mapDispatchToProps = {
  handleToggleAddMemberToGroupModal,
  handleAddMemberToTimelineGroup,
  handleSetModalMessageMode,
  handleToggleGroupDetailOwner
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TimelineGroupAddMember);
