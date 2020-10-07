import React, { useEffect, useState } from 'react'
import { IRootState } from 'app/shared/reducers'
import { connect } from 'react-redux';
import { Modal } from 'reactstrap';
import { handleToggleGroupParticipantsModal, reset, handleSetModalMessageMode } from '../timeline-reducer';
import { toggleConfirmPopup } from '../timeline-reducer'
import { Storage, translate } from 'react-jhipster';
import { TimelineGroupType } from '../models/get-timeline-groups-model';
import { FSActionTypeScreen } from '../timeline-group-add-edit/timeline-group-add-edit';
import _ from 'lodash';
import TimelineMessageInfo from '../control/message-info/timeline-message-info';
/**
 * Component for show participants of group (member)
 * @param props
 */
export interface ITimelineGroupParticipantsProp extends StateProps, DispatchProps {
  // open new window
  popout?: boolean
}

const TimelineGroupParticipants = (props: ITimelineGroupParticipantsProp) => {
  /**
* set mode to display message on modal
*/
  useEffect(() => {
    props.handleSetModalMessageMode(true)
    return () => { props.handleSetModalMessageMode(false) }
  }, [])

  const [showModal, setShowModal] = useState(true);
  const [countEmp1, setCountEmp1] = useState(null);
  const [countEmp2, setCountEmp2] = useState(null);
  const [timelineGroup, setTimelineGroup] = useState({} as TimelineGroupType);

  /**
   * Count employee of group & count member add request to join group
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
  useEffect(() => {
    let _timelineGroup = null;
    if (props.listEmployeeOfTimelineGroups?.length > 0) {
      for (let index = 0; index < props.listEmployeeOfTimelineGroups.length; index++) {
        if (Number(props.listEmployeeOfTimelineGroups[index].timelineGroupId) === Number(props.timelineGroupId)) {
          if (_timelineGroup) {
            _timelineGroup.invites = _.concat(_timelineGroup.invites, props.listEmployeeOfTimelineGroups[index].invites);
          } else {
            _timelineGroup = props.listEmployeeOfTimelineGroups[index];
          }
        }
      }
      setTimelineGroup(_timelineGroup);
      setCountEmp1(countEmp(_timelineGroup, 2));
      setCountEmp2(countEmp(_timelineGroup, 1));
    }
  }, [props.listEmployeeOfTimelineGroups])

  // first word of department
  const getFirstCharacter = (name) => {
    return name ? name.charAt(0) : "";
  }

  /**
   * Close modal
   */
  const handleCloseModal = () => {
    props.handleToggleGroupParticipantsModal(false);
  }

  /**
   * Set data when open new window
   */
  const updateStateSession = (mode: FSActionTypeScreen) => {
    if (mode === FSActionTypeScreen.SetSession) {
      Storage.local.set(TimelineGroupParticipants.name, {
        countEmp1,
        countEmp2,
        timelineGroup
      });
    } else if (mode === FSActionTypeScreen.GetSession) {
      const saveObj = Storage.local.get(TimelineGroupParticipants.name);
      if (saveObj) {
        setCountEmp1(saveObj.countEmp1);
        setCountEmp2(saveObj.countEmp2);
        setTimelineGroup(saveObj.timelineGroup)
      }
    } else if (mode === FSActionTypeScreen.RemoveSession) {
      Storage.local.remove(TimelineGroupParticipants.name);
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
      // updateStateSession(FSActionTypeScreen.RemoveSession);
      document.body.className = document.body.className.replace('modal-open', '');
    }
  }, []);

  /**
   * Click button open new window
   */
  const openNewWindow = () => {
    updateStateSession(FSActionTypeScreen.SetSession);
    setShowModal(false);
    const height = screen.height * 0.8;
    const width = screen.width * 0.8;
    const left = screen.width * 0.3;
    const top = screen.height * 0.3;
    const style = `width=${width},height=${height},left=${left},top=${top}`;
    window.open(`${props.tenant}/channel/list-member`, '', style.toString());
    handleCloseModal();
  }


  const renderModal = () => {
    return <>
        <div className="modal popup-esr popup-esr4 user-popup-page popup-align-right show" id="popup-esr" aria-hidden="true">
          <div className={`${!props.popout ? "modal-dialog" : "h-100 modal-dialog"} form-popup`}>
            <div className="modal-content">
              <div className="modal-header">
                <div className="left">
                  <div className="popup-button-back">
                    <a className="icon-small-primary icon-return-small disable" />
                    <span className="text">
                      <img className="icon-timeline-small" src="../../../content/images/ic-timeline-popup.svg" alt="" />
                      {translate('timeline.group.participants.modal-name')}
                    </span>
                  </div>
                </div>
                {showModal && (
                  <div className="right">
                    <button tabIndex={0} className="icon-small-primary icon-link-small" onClick={() => openNewWindow()} />
                    <button tabIndex={0} className="icon-small-primary icon-close-up-small line" onClick={() => handleCloseModal()} />
                  </div>
                )}
              </div>
              <div className="modal-body style-3">
                <TimelineMessageInfo isModal={true} />
                <div className="popup-content style-3">
                  <div className="pb-2">
                    <h4 className="color-333 mb-4"> {translate('timeline.group.participants.requesting-participation')}({countEmp1})
              </h4>
                    <div className="row">
                      {timelineGroup?.invites?.length > 0 && timelineGroup?.invites.map((item, index) => {
                        if (Number(item.status) === 2) {
                          return <>
                            <div className="col-lg-4 d-flex mb-3">
                              <div className="item item2 flex-grow">
                                {Number(item.inviteType) === 2 &&
                                  <>
                                    {item.inviteImagePath ? (<img className="user" src={item.inviteImagePath} key={`images_${item.inviteId}`} />) : (<div className="no-avatar green" key={`imgs_${item.inviteId}`}>{getFirstCharacter(item.inviteName)}</div>)}
                                  </>
                                }
                                {Number(item.inviteType) === 1 && <div className="no-avatar no-avatar light-blue" key={`icon_member_${item.inviteId}`}>{getFirstCharacter(item.inviteName)}</div>}
                                <span className={`text-blue ${item.inviteImagePath ? '' : 'font-weight-normal'}`}>{item.inviteName}</span>
                              </div>
                            </div>
                          </>
                        }
                      })}
                    </div>
                  </div>
                  <div className="pb-2">
                    <h4 className="color-333 mb-2">{translate('timeline.group.participants.participating')}({countEmp2})</h4>
                    <div className="row">
                      {timelineGroup?.invites?.length > 0 && timelineGroup?.invites?.map((item, idx) => {
                        if (Number(item.status) === 1) {
                          return <>
                            <div className="col-lg-4 d-flex mb-3">
                              <div className="item item2 flex-grow">
                                {Number(item.inviteType) === 2 &&
                                  <>
                                    {item.inviteImagePath ? (<img className="user" src={item.inviteImagePath} key={`images_member_${item.inviteId}`} />) : (<div className="no-avatar green" key={`ic_${item.inviteId}`}>{getFirstCharacter(item.inviteName)}</div>)}
                                  </>
                                }
                                {Number(item.inviteType) === 1 && <div className="no-avatar light-blue" key={`icons_${item.inviteId}`}>{getFirstCharacter(item.inviteName)}</div>}
                                <span className={`text-blue ${item.inviteImagePath ? '' : 'font-weight-normal'}`}>{item.inviteName}</span>
                              </div>
                              <div className=" d-flex right-button">
                                <a className="button-blue-small button-popup ml-3">
                                  {(Number(item.authority) === 1 ? <>{translate('timeline.group.participants.owner')}</> : <>{translate('timeline.group.participants.member')}</>)}
                                </a>
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
    </>
  }
  if (showModal) {
    return (
      <>
        <Modal isOpen={true} fade={true} toggle={() => { }} backdrop id="popup-field-search" autoFocus={true} zIndex="auto">
          {renderModal()}
        </Modal>
      </>
    );
  } else {
    if (props.popout) {
      return renderModal();
    } else {
      return <></>;
    }
  }
}

const mapStateToProps = ({ applicationProfile, timelineReducerState }: IRootState) => ({
  listEmployeeOfTimelineGroups: timelineReducerState.listEmployeeOfTimelineGroups,
  timelineGroupId: timelineReducerState.timelineGroupId,
  tenant: applicationProfile.tenant
});
const mapDispatchToProps = {
  handleToggleGroupParticipantsModal,
  toggleConfirmPopup,
  reset,
  handleSetModalMessageMode,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TimelineGroupParticipants);
