import React, { useState, useEffect } from 'react';
import { Modal } from 'reactstrap';
import {
  reset,
  deleteMilestone,
  updateStatusMilestone,
  getMilestoneDetail,
  DetailMilestoneAction
} from '../../milestone/detail/detail-milestone.reducer';
import { MILES_ACTION_TYPES, TAB_ID_LIST, LICENSE, TIMEOUT_TOAST_MESSAGE, STATUS_MILESTONE } from '../constants';
import { STATUS_TASK } from 'app/modules/tasks/constants'
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import EditMilestoneModal from '../create-edit/create-edit-milestone-modal';
import moment from 'moment';
import { translate, Storage } from 'react-jhipster';
import BoxMessage, { MessageType } from 'app/shared/layout/common/box-message';
import { setMileStoneCopy } from '../../milestone/create-edit/create-edit-milestone.reducer';
import useEventListener from 'app/shared/util/use-event-listener';
import { convertDateTimeFromServer } from 'app/shared/util/date-utils';
import TabSummary from './detail-tabs/detail-tab-summary';
import TabChangeHistory from './detail-tabs/detail_tab_change_history';
import _ from 'lodash';
import { USER_FORMAT_DATE_KEY, APP_DATE_FORMAT, ScreenMode } from 'app/config/constants';
import dateFnsFormat from 'date-fns/format';
import TimelineCommonControl from 'app/modules/timeline/timeline-common-control/timeline-common-control';
import { TIMELINE_SERVICE_TYPES, MODE_EXT_TIMELINE, TIMELINE_TYPE } from 'app/modules/timeline/common/constants';
import DialogDirtyCheck, { DIRTYCHECK_PARTTERN } from 'app/shared/layout/common/dialog-dirty-check';
import { handleInnitGetExtTimelineFilter } from 'app/modules/timeline/timeline-common-reducer';

export enum FSActionTypeScreen {
  None,
  RemoveSession,
  SetSession,
  GetSession,
  CloseWindow
}

export interface IDetailMilestoneModalProps extends StateProps, DispatchProps {
  iconFunction?: string;
  toggleCloseModalMilesDetail?: (reloadFlag?) => void;
  milesActionType: number;
  milestoneId?: number;
  popoutParams?: any;
  popout?: boolean;
  tenant;
  isNotCloseModal?: boolean; // don't close modal
  openFromModal?: boolean; // handle back action
  backdrop?: boolean; // [backdrop:false] when open from popup
}

/**
 * Component for show detail milestone
 * @param props
 */
const DetailMilestoneModal = (props: IDetailMilestoneModalProps) => {
  const [currentTab, setCurrentTab] = useState(TAB_ID_LIST.summary);
  const [openModalMiles, setOpenModalMiles] = useState(false);
  const [openModalCopyMiles, setOpenModalCopyMiles] = useState(false);
  const [mileStoneActionType, setMileStoneActionType] = useState(MILES_ACTION_TYPES.UPDATE);
  const [msgSuccess, setMsgSuccess] = useState(props.successMessage ? props.successMessage : '');
  const [msgError, setMsgError] = useState(props.errorMessage ? props.errorMessage : '');

  const [milestoneId, setMilestoneId] = useState(props.milestoneId ? props.milestoneId : props.popoutParams.milestoneId);
  const [isPublic, setIsPublic] = useState(null);
  const [isDone, setIsDone] = useState(props.milestone && props.milestone.isDone === 1);
  const [milestone, setMilestone] = useState(props.milestone ? props.milestone : null);
  const [isCreatedUser, setIsCreatedUser] = useState(props.milestone ? props.milestone.isCreatedUser : false);
  const [action, setAction] = useState(props.action ? props.action : DetailMilestoneAction.None);

  const [showModal, setShowModal] = useState(true);
  const [forceCloseWindow, setForceCloseWindow] = useState(false);
  const [showDiablogConfirmDelete, setShowDiablogConfirmDelete] = useState(false);
  const [showConfirmUpdateStatus, setShowConfirmUpdateStatus] = useState(false);
  const [showTimeline, setShowTimeline] = useState((props.screenMode === ScreenMode.DISPLAY && props.listLicense && props.listLicense.includes(LICENSE.TIMELINE_LICENSE)))
  const [isChangeTimeline, setIsChangeTimeline] = useState(false);

  moment.locale('ja_jp');

  const userFormat = Storage.session.get(USER_FORMAT_DATE_KEY, APP_DATE_FORMAT); // get user setting date format

  useEffect(() => {
    if (props.isCloseAllWindownOpened && !props.isNotCloseModal) {
      if (props.popoutParams) {
        props.reset();
        window.close();
      } else {
        props.reset();
        props.toggleCloseModalMilesDetail(false);
      }
    }
  }, [props.isCloseAllWindownOpened]);

  /**
   * Handle state when props.errorMessage, props.successMessage are changed
   */
  useEffect(() => {
    setMsgError(props.errorMessage);
    setMsgSuccess(props.successMessage);
  }, [props.errorMessage, props.successMessage]);

  /**
   * Handle state when props.milestoneName is changed
   */
  useEffect(() => {
    if (props.milestone) {
      setMilestone(props.milestone);
      setIsPublic(props.milestone.isPublic);
      setIsDone(props.milestone.isDone);
      setIsCreatedUser(props.milestone.isCreatedUser);
    }
  }, [props.milestone]);

  /**
   * Handle states into local storage
   * @param mode mode
   */
  const updateStateSession = (mode: FSActionTypeScreen) => {
    if (mode === FSActionTypeScreen.SetSession) {
      Storage.local.set(DetailMilestoneModal.name, {
        currentTab,
        openModalMiles,
        mileStoneActionType,
        milestoneId,
        isPublic,
        isDone,
        isCreatedUser,
        msgSuccess,
        msgError,
        milestone,
        action,
      });
    } else if (mode === FSActionTypeScreen.GetSession) {
      const saveObj = Storage.local.get(DetailMilestoneModal.name);
      if (saveObj) {
        setOpenModalMiles(saveObj.openModalMiles);
        setMileStoneActionType(saveObj.mileStoneActionType);
        setMilestoneId(saveObj.milestoneId);
        setMilestone(saveObj.milestone);
        setIsDone(saveObj.isDone);
        setIsPublic(saveObj.isPublic);
        setIsCreatedUser(saveObj.isCreatedUser);
        setAction(saveObj.action);
      }
    } else if (mode === FSActionTypeScreen.RemoveSession) {
      Storage.local.remove(DetailMilestoneModal.name);
    }
  };

  const reloadDataTimeline = () => {
    const formSearch = {
      filters: {},
      limit: 5,
      offset: 0,
      listType: TIMELINE_TYPE.ALL_TIMELINE,
      targetDelivers: [],
      sort: "changedDate",
      idObject: [milestoneId],
      serviceType: TIMELINE_SERVICE_TYPES.MILESTONE,
      mode: MODE_EXT_TIMELINE.DETAIL,
      hasLoginUser: false
    };
    props.handleInnitGetExtTimelineFilter(formSearch);
  }

  /**
   * change tab between Tab Informations and history
   * @param clickedTabId
   */
  const changeTab = (clickedTabId) => {
    setCurrentTab(clickedTabId);
  }

  const executeDirtyCheck = async (actionOK: () => void, cancel?: () => void, partern?: any) => {
    if (isChangeTimeline) {
      await DialogDirtyCheck({ onLeave: actionOK, onStay: cancel, partternType: partern });
    } else {
      actionOK();
    }
  }

  /**
   * Open modal milestone edit
   */
  const onOpenModalMilestone = () => {
    setMsgError('');
    setMileStoneActionType(MILES_ACTION_TYPES.UPDATE);
    setOpenModalMiles(true);
  };

  const onOpenModalCreateMileStone = () => {
    setMsgError('');
    props.setMileStoneCopy(milestone);
    setMileStoneActionType(MILES_ACTION_TYPES.CREATE);
    setOpenModalCopyMiles(true);
  };


  /**
   * Close milestone edit
   */
  const onCloseModalMiles = () => {
    reloadDataTimeline();
    setOpenModalMiles(false);
    props.getMilestoneDetail(milestoneId);
  };


  /**
  * Close milestone edit
  */
  const onCloseModalCopyMiles = () => {
    setOpenModalCopyMiles(false);
    props.getMilestoneDetail(milestoneId);
  };

  /**
   * Close modal milestone detail
   */
  const handleClosePopup = (partern) => {
    executeDirtyCheck(() => {
      props.toggleCloseModalMilesDetail(false);
    }, () => { }, partern);
  };

  /**
   * Call function update milestone
   */
  const updateStatusMilestoneToApi = updateFlg => {
    props.updateStatusMilestone(milestoneId, isDone, updateFlg);
    setShowConfirmUpdateStatus(false);
  };

  /**
   * Call function delete milestone
   */
  const deleteMilestoneToApi = () => {
    props.deleteMilestone(milestoneId);
    setShowDiablogConfirmDelete(false);
  };

  /**
   * Open new window milestone detail
   */
  const openNewWindow = () => {
    updateStateSession(FSActionTypeScreen.SetSession);
    setShowModal(false);
    const height = screen.height * 0.6;
    const width = screen.width * 0.6;
    const left = screen.width * 0.2;
    const top = screen.height * 0.2;
    const style = `width=${width},height=${height},left=${left},top=${top}`;
    window.open(`${props.tenant}/detail-milestone/${props.milestoneId}`, '', style.toString());
  };

  const renderErrorMessage = () => {
    if (msgError && msgError.length >= 0) {
      if (msgError[0].errorCode === 'ERR_COM_0050') {
        return (
          <BoxMessage messageType={MessageType.Error}
            message={translate(`messages.${msgError[0].errorCode}`)}
            className={'w90'}
          />
        );
      }
    }
  }

  /**
   * method render message box error or success
   */
  const displayMessage = () => {
    if (msgSuccess && msgSuccess.length >= 0) {
      return <BoxMessage messageType={MessageType.Success} message={translate('messages.' + msgSuccess)} className="message-area-bottom position-absolute"
      />;
    }

    return <></>;
  };

  /**
   * Open popup update status milestone
   */
  const UpdateStatusDialog = () => {
    return (
      <>
        <div className="popup-esr2" id="popup-esr2">
          <div className="popup-esr2-content">
            <div className="popup-esr2-body">
              <form>
                <div className="popup-esr2-title">{translate('milestone.detail.popup-update-status.title')}</div>
                <div>{translate('milestone.detail.popup-update-status.detail_1')}</div>
                <div>{translate('milestone.detail.popup-update-status.detail_2')}</div>
              </form>
            </div>
            <div className="popup-esr2-footer">
              <a className="button-blue v2" onClick={() => updateStatusMilestoneToApi(2)}>
                {translate('milestone.detail.popup-update-status.button-update')}
              </a>
              <a className="button-cancel v2" onClick={() => setShowConfirmUpdateStatus(false)}>
                {translate('milestone.detail.popup-update-status.button-cancel')}
              </a>
            </div>
          </div>
        </div>
        <div className="modal-backdrop2 show"></div>
      </>
    );
  };

  /**
   * Open popup delete milestone
   */
  const DialogDeleteMilestone = () => {
    return (
      <>
        <div className="popup-esr2" id="popup-esr2">
          <div className="popup-esr2-content">
            <div className="popup-esr2-body">
              <form>
                <div className="popup-esr2-title">{translate('milestone.detail.popup-delete.title')}</div>
                {translate('milestone.detail.popup-delete.detail')}
              </form>
            </div>
            <div className="popup-esr2-footer">
              <a className="button-cancel v2" onClick={() => setShowDiablogConfirmDelete(false)}>
                {translate('milestone.detail.popup-delete.button-cancel')}
              </a>
              <a className="button-red v2" onClick={() => deleteMilestoneToApi()}>
                {translate('milestone.detail.popup-delete.button-delete')}
              </a>
            </div>
          </div>
        </div>
        <div className="modal-backdrop2 show"></div>
      </>
    );
  };


  const onBeforeUnload = ev => {
    if (props.popout && !Storage.session.get('forceCloseWindow')) {
      window.opener.postMessage({ type: FSActionTypeScreen.CloseWindow, forceCloseWindow: false }, window.location.origin);
    }
  };

  /**
   * Handle Back action
   */
  const handleBackPopup = () => {
    if (props.popout) {
      updateStateSession(FSActionTypeScreen.SetSession);
      setForceCloseWindow(true);
    } else if (props.openFromModal) {
      handleClosePopup(DIRTYCHECK_PARTTERN.PARTTERN1);
    }
  };

  /**
   * Post message onReceiveMessage
   * @param ev
   */
  const onReceiveMessage = ev => {
    if (!props.popout) {
      if (ev.data.type === FSActionTypeScreen.CloseWindow) {
        updateStateSession(FSActionTypeScreen.GetSession);
        updateStateSession(FSActionTypeScreen.RemoveSession);
        if (ev.data.forceCloseWindow) {
          setShowModal(true);
        } else {
          props.toggleCloseModalMilesDetail();
        }
      }
    }
  };

  // Add EventListener
  if (props.popout) {
    useEventListener('beforeunload', onBeforeUnload);
  } else {
    useEventListener('message', onReceiveMessage);
  }

  /**
   * useEffect execute firstly
   */
  useEffect(() => {
    if (props.popout) {
      updateStateSession(FSActionTypeScreen.GetSession);
      setShowModal(false);
      setForceCloseWindow(false);
      if (props.popoutParams.milestoneId) {
        props.getMilestoneDetail(milestoneId);
      }
    } else {
      props.getMilestoneDetail(milestoneId);
      setShowModal(true);
    }
    return () => {
      updateStateSession(FSActionTypeScreen.RemoveSession);
      props.reset();
    };
  }, []);

  /**
   * Handle when change forceCloseWindow
   */
  useEffect(() => {
    if (forceCloseWindow) {
      if (props.popout) {
        window.opener.postMessage({ type: FSActionTypeScreen.CloseWindow, forceCloseWindow: true }, window.location.origin);
        Storage.session.set('forceCloseWindow', true);
        window.close();
      } else {
        handleClosePopup(DIRTYCHECK_PARTTERN.PARTTERN1);
      }
    }
  }, [forceCloseWindow]);

  /**
   * Handle when props.action is changed
   */
  useEffect(() => {
    if (props.action === DetailMilestoneAction.DeleteSuccess) {
      setTimeout(() => {
        setMsgSuccess(null);
        if (props.popout) {
          window.opener.postMessage({ type: FSActionTypeScreen.CloseWindow, forceCloseWindow: false }, window.location.origin);
          window.close();
        } else {
          props.toggleCloseModalMilesDetail(true);
        }
      }, TIMEOUT_TOAST_MESSAGE);
    }
    if (props.action === DetailMilestoneAction.UpdateSuccess) {
      reloadDataTimeline();
      props.getMilestoneDetail(milestoneId);
      setTimeout(() => {
        setMsgSuccess(null);
      }, TIMEOUT_TOAST_MESSAGE);
    }
  }, [props.action]);

  /**
   * check date
   * @param dateCheck
   */
  const checkOverdueComplete = (dateCheck, status) => {
    if (!dateCheck) {
      return false;
    }
    if (!moment.isDate(dateCheck)) {
      dateCheck = convertDateTimeFromServer(dateCheck);
    }
    if (dateCheck < moment().utcOffset(0).set({ hour: 0, minute: 0, second: 0 }).local(true).toDate()
      && status !== STATUS_MILESTONE.FINISH) {
      return true;
    }
    return false;
  }

  /**
   * Copy link clipboard
   */
  const copyUrlDetailMilestone = () => {
    const dummy = document.createElement('textarea');
    document.body.appendChild(dummy);
    dummy.value = `${window.location.origin}/${props.tenant}/detail-milestone/${milestoneId}`;
    dummy.select();
    document.execCommand('copy');
    document.body.removeChild(dummy);
  };

  /**
   * Show dialog confirm
   */
  const showDialogConfirmUpdateStatus = () => {
    let isDisplayConfirm = false;
    if (milestone && milestone.listTask && milestone.listTask.length > 0) {
      milestone.listTask.forEach(item => {
        if (STATUS_TASK.COMPLETED !== item.status && !isDone) {
          isDisplayConfirm = true;
          return;
        }
      });
    }
    if (!isDisplayConfirm) {
      updateStatusMilestoneToApi(2);
    } else {
      setShowConfirmUpdateStatus(true);
    }
  }


  /**
   * Render detail Tab
   */
  const renderTabContents = () => {
    return (
      <>
        {milestone && currentTab === TAB_ID_LIST.summary &&
          <TabSummary
            milestone={milestone}
            tenant={props.tenant}
            listLicense={props.listLicense}
          />
        }
        {milestone && milestone.milestoneHistories && currentTab === TAB_ID_LIST.changeHistory &&
          <TabChangeHistory
            languageId={Storage.session.get('locale', 'ja_jp')}
            changeHistory={milestone.milestoneHistories}
            tenant={props.tenant}
          />}
      </>);
  }

  const handleCloseModalMilestone = (toggleModal) => {
    if (toggleModal) {
      reloadDataTimeline();
      setOpenModalMiles(false);
    }
  }

  /**
   * render common right must have license
   */
  const renderCommonTimeline = () => {
    if (props.listLicense && props.listLicense.includes(LICENSE.TIMELINE_LICENSE)) {
      return <div className="popup-content-common-right background-col-F9 v2 wrap-timeline" >
        <div className="button">
          <a className={"icon-small-primary " + (showTimeline ? "icon-next" : "icon-prev")} onClick={() => setShowTimeline(!showTimeline)} />
        </div>
        {showTimeline &&
          <TimelineCommonControl
            objectId={[milestoneId]}
            serviceType={TIMELINE_SERVICE_TYPES.MILESTONE}
            isDataChange={(isChange) => setIsChangeTimeline(isChange)}
          />
        }
      </div>
    }
  }

  /**
   * Render component's view
   */
  const renderMilestoneDetailModal = () => {
    return (
      <>
        <div className="wrap-task">
          <div className="modal popup-esr popup-esr4 user-popup-page popup-align-right show" id="popup-esr" aria-hidden="true">
            <div className={showModal ? 'modal-dialog form-popup' : 'form-popup'}>
              <div className="modal-content">
                <div className="modal-header">
                  <div className="left">
                    <div className="popup-button-back">
                      {props.openFromModal ?
                        < a onClick={handleBackPopup} className='icon-small-primary icon-return-small' />
                        :
                        <a className='icon-small-primary icon-return-small disable' />
                      }
                      <span className="text text-over-width text-break">
                        <img className="icon-register" src="../../content/images/task/ic-flag-red.svg" />
                        {milestone ? milestone.milestoneName : ""}
                      </span>
                      <span className="text2">{milestone && milestone.endDate && dateFnsFormat(milestone.endDate, userFormat)}</span>
                    </div>
                  </div>
                  <div className="right">
                    <a className="icon-small-primary icon-share" onClick={url => copyUrlDetailMilestone()} />
                    {showModal && <a onClick={() => openNewWindow()} className="icon-small-primary icon-link-small" />}
                    {showModal && <a onClick={() => handleClosePopup(DIRTYCHECK_PARTTERN.PARTTERN2)} className="icon-small-primary icon-close-up-small line" />}
                  </div>
                </div>
                <div className="modal-body">
                  <div className="popup-content popup-task-no-padding h100 v2">
                    <div className="popup-tool">
                      {renderErrorMessage()}
                      <div></div>
                      <div>
                        <a className="icon-small-primary icon-copy-small" onClick={() => onOpenModalCreateMileStone()} />
                        {isCreatedUser && <a onClick={() => onOpenModalMilestone()} className="icon-small-primary icon-edit-small" />}
                        {isCreatedUser && (
                          <a onClick={() => setShowDiablogConfirmDelete(true)} className="icon-small-primary icon-erase-small" />
                        )}
                      </div>
                    </div>
                    <div className={"popup-content-task-wrap" + (!showTimeline ? " popup-content-close" : "")}>
                      < div className={"popup-content-task-left" + (!showTimeline ? " w-100" : "")}>
                        <div className="flag-wrap">
                          <div className="mg mr-2">
                            <i className={isPublic ? 'cicle-dot' : 'fas fa-lock-alt'}></i>
                          </div>
                          <div>
                            <div className="font-size-18">{milestone ? milestone.milestoneName : ''}</div>
                            {milestone && milestone.endDate && <div className={`font-size-12 ${checkOverdueComplete(milestone.endDate, isDone) ? 'color-red' : ''}`}>{dateFnsFormat(milestone.endDate, userFormat)}</div>}
                          </div>
                        </div>
                        <div className="popup-content-task-content v2">
                          <div className="tab-detault">
                            <ul className={`nav nav-tabs w100 ${currentTab === TAB_ID_LIST.changeHistory ? 'mb-0' : ''}`}>
                              <li className="nav-item">
                                <a className={currentTab === TAB_ID_LIST.summary ? "nav-link active" : "nav-link"} onClick={() => changeTab(TAB_ID_LIST.summary)} data-toggle="tab">{translate('milestone.detail.form.tab-summary')}</a>
                              </li>
                              <li className="nav-item">
                                <a className={currentTab === TAB_ID_LIST.changeHistory ? " nav-link active" : "nav-link"} onClick={() => changeTab(TAB_ID_LIST.changeHistory)} data-toggle="tab">{translate('milestone.detail.form.tab-history')}</a>
                              </li>
                            </ul>
                            <div className="tab-content">
                              {renderTabContents()}
                            </div>
                          </div>
                        </div>
                        {isCreatedUser && (
                          <div className="user-popup-form-bottom">
                            <a onClick={e => (isDone ? e.preventDefault() : showDialogConfirmUpdateStatus())}
                              className={isDone ? 'button-blue disable' : 'button-blue'} >
                              {translate('milestone.detail.form.button-finish')}
                            </a>
                          </div>
                        )}
                      </div>
                      {renderCommonTimeline()}
                      {displayMessage()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {openModalMiles && (
              <EditMilestoneModal
                milesActionType={mileStoneActionType}
                milesId={mileStoneActionType === MILES_ACTION_TYPES.CREATE ? null : milestoneId}
                toggleCloseModalMiles={onCloseModalMiles}
                toggleNewWindow={handleCloseModalMilestone}
                isOpenFromModal
              />
            )}
            {openModalCopyMiles && (
              <EditMilestoneModal
                milesActionType={mileStoneActionType}
                milesId={mileStoneActionType === MILES_ACTION_TYPES.CREATE ? null : milestoneId}
                toggleCloseModalMiles={onCloseModalCopyMiles}
                isOpenFromModal
              />
            )}
            {showDiablogConfirmDelete && <DialogDeleteMilestone />}
            {showConfirmUpdateStatus && <UpdateStatusDialog />}
          </div>
          <div className="modal-backdrop show" />
        </div>
      </>
    );
  };

  if (showModal) {
    return <>
      <Modal isOpen fade toggle={() => { }} backdrop={(props.backdrop || props.backdrop === undefined)} id="popup-field-search" autoFocus>
        {renderMilestoneDetailModal()}
      </Modal>
    </>;
  } else {
    if (props.popout) {
      return <>{renderMilestoneDetailModal()}</>;
    } else {
      return <></>;
    }
  }
};

const mapDispatchToProps = {
  getMilestoneDetail,
  deleteMilestone,
  updateStatusMilestone,
  reset,
  setMileStoneCopy,
  handleInnitGetExtTimelineFilter
};

const mapStateToProps = ({ detailMilestone, applicationProfile, authentication }: IRootState) => ({
  screenMode: detailMilestone.screenMode,
  tenant: applicationProfile.tenant,
  successMessage: detailMilestone.successMessage,
  errorMessage: detailMilestone.errorMessage,
  milestone: detailMilestone.milestone,
  action: detailMilestone.action,
  listLicense: authentication.account.licenses,
  isCloseAllWindownOpened: detailMilestone.isCloseAllWindownOpened,
});

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DetailMilestoneModal);
