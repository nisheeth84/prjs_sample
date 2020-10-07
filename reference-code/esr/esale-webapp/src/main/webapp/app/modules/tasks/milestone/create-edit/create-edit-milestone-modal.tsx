import React, { useState, useEffect, useRef } from 'react';
import { Modal } from 'reactstrap';
import { Storage, translate } from 'react-jhipster';
import { reset, getMilestone, handleSubmitMilestoneData, MilestoneAction, handleGetCustomersByIds } from './create-edit-milestone.reducer';
import { MILES_ACTION_TYPES, TIMEOUT_TOAST_MESSAGE } from '../constants';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import DialogDirtyCheck, { DIRTYCHECK_PARTTERN } from 'app/shared/layout/common/dialog-dirty-check';
import useEventListener from 'app/shared/util/use-event-listener';
import _ from 'lodash';
import DatePicker from 'app/shared/layout/common/date-picker';
import BoxMessage, { MessageType } from 'app/shared/layout/common/box-message';
import { convertDateTimeFromServer, convertDateToYYYYMMDD, formatDate } from 'app/shared/util/date-utils';
import moment from 'moment';
import dateFnsFormat from 'date-fns/format';
import { USER_FORMAT_DATE_KEY, APP_DATE_FORMAT } from 'app/config/constants';
import ManagerSuggestSearch from 'app/shared/layout/common/suggestion/tag-auto-complete';
import { TagAutoCompleteType, TagAutoCompleteMode } from 'app/shared/layout/common/suggestion/constants';
import { LICENSE } from '../../constants';
import { toKatakana } from 'app/shared/util/string-utils';

export enum FSActionTypeScreen {
  None,
  RemoveSession,
  SetSession,
  GetSession,
  CloseWindow
}

export interface ICreateEditMilestoneModalProps extends StateProps, DispatchProps {
  toggleCloseModalMiles?: (messageCode?) => void;
  milesActionType: number;
  milesId?: number;
  isOpenFromModal?: boolean;
  popout?: boolean;
  tenant;
  onCloseModalMilestone?: (milestoneId) => void;
  hiddenShowNewTab?: boolean;
  toggleNewWindow?: any;
  customerIdProps?: any;
  isNotCloseModal?: boolean; // don't close modal
  backdrop?: boolean; // [backdrop:false] when open from popup
  fromActivity?: boolean;
}

/**
 * Component for show edit/create milestone
 * @param props
 */
const CreateEditMilestoneModal = (props: ICreateEditMilestoneModalProps) => {
  const { milestoneName, memo, endDate } = props;

  const [valueMilestoneId, setValueMilestoneId] = useState(props.milesId ? props.milesId : '');
  const [milesActionType, setMilesActionType] = useState(props.milesActionType);
  const [milesName, setMilesName] = useState(milestoneName ? milestoneName : '');
  const [finishDate, setFinishDate] = useState(endDate ? endDate : null);
  const [isDone, setIsDone] = useState(props.isDone ? props.isDone : false);
  const [customerId, setCustomerId] = useState((props && props.customerIdProps) || (props.customers ? props.customers.customerId : null));
  const [isPublic, setIsPublic] = useState(props.isPublic ? props.isPublic : false);
  const [memos, setMemo] = useState(memo ? memo : '');
  const [msgError, setMsgError] = useState('');
  const [msgSuccess, setMsgSuccess] = useState('');
  const [updatedDate, setUpdatedDate] = useState(props.updatedDate ? props.updatedDate : null);
  const [createdDate, setCreatedDate] = useState(props.createdDate ? props.createdDate : null);
  const [createdUserName, setCreatedUserName] = useState(props.createdUserName ? props.createdUserName : null);
  const [updatedUserName, setUpdatedUserName] = useState(props.updatedUserName ? props.updatedUserName : null);
  const [errorItems, setErrorItems] = useState(props.errorItems ? props.errorItems : null);
  const [submittedCheckList, setSubmittedCheckList] = useState({ milestoneName: false, memo: false });
  const [isOpenFromModal, setIsOpenFromModal] = useState(props.isOpenFromModal ? props.isOpenFromModal : null);

  const [showModal, setShowModal] = useState(true);
  const [forceCloseWindow, setForceCloseWindow] = useState(false);
  const [first, setFirst] = useState(false);
  const milestoneNameFocus = useRef(null);
  const memoFocus = useRef(null);
  const initValueInput = {
    milesName: milestoneName ? milestoneName : '',
    finishDate: endDate ? endDate : null,
    isDone: isDone ? isDone : false,
    isPublic: props.isPublic ? props.isPublic : false,
    customerId: props.customers ? props.customers.customerId : null,
    memos: memo ? memo : ''
  };
  const [customers, setCustomers] = useState(props.customers && props.customers.length > 0 ? props.customers : []);

  const userFormat = Storage.session.get(USER_FORMAT_DATE_KEY, APP_DATE_FORMAT); // get user setting date format

  useEffect(() => {
    if (props.isCloseAllWindownOpened && !props.isNotCloseModal) {
      if (props.popout) {
        props.reset();
        window.close();
      } else {
        props.reset();
        props.toggleCloseModalMiles();
      }
    }
  }, [props.isCloseAllWindownOpened]);

  /**
   * Handle states into local storage
   * @param mode mode
   */
  const updateStateSession = (mode: FSActionTypeScreen) => {
    if (mode === FSActionTypeScreen.SetSession) {
      Storage.local.set(CreateEditMilestoneModal.name, {
        milesName,
        finishDate,
        isDone,
        isPublic,
        memos,
        customerId,
        first,
        updatedDate,
        createdDate,
        createdUserName,
        updatedUserName,
        milesActionType,
        valueMilestoneId,
        errorItems,
        submittedCheckList,
        isOpenFromModal
      });
    } else if (mode === FSActionTypeScreen.GetSession) {
      const saveObj = Storage.local.get(CreateEditMilestoneModal.name);
      if (saveObj) {
        setMilesName(saveObj.milesName);
        setFinishDate(saveObj.finishDate ? saveObj.finishDate : null);
        setIsDone(saveObj.isDone);
        setIsPublic(saveObj.isPublic);
        setMemo(saveObj.memos);
        setCustomerId(saveObj.customerId);
        setFirst(saveObj.first);
        setUpdatedDate(saveObj.updatedDate);
        setCreatedDate(saveObj.createdDate);
        setCreatedUserName(saveObj.createdUserName);
        setUpdatedUserName(saveObj.updatedUserName);
        setMilesActionType(saveObj.milesActionType);
        setValueMilestoneId(saveObj.valueMilestoneId);
        setErrorItems(saveObj.errorItems);
        setSubmittedCheckList(saveObj.submittedCheckList);
        setIsOpenFromModal(saveObj.isOpenFromModal);
      }
    } else if (mode === FSActionTypeScreen.RemoveSession) {
      Storage.local.remove(CreateEditMilestoneModal.name);
    }
  };

  /**
   * Run it first
   */
  useEffect(() => {
    history.pushState(null, null, location.href);
    window.onpopstate = function () {
      props.reset();
      props.toggleCloseModalMiles();
    };
    document.body.className = `wrap-task modal-open ${props.fromActivity ? 'wrap-activity' : ''}`;
    if (props.popout) {
      updateStateSession(FSActionTypeScreen.GetSession);
      setShowModal(false);
      setForceCloseWindow(false);
    } else {
      if (props.customerIdProps && props.customerIdProps > 0) {
        props.handleGetCustomersByIds([props.customerIdProps]);
      }
      setFirst(true);
      setShowModal(true);
    }
    return () => {
      setFirst(false);
      // updateStateSession(FSActionTypeScreen.RemoveSession);
      props.reset();
    };
  }, []);

  useEffect(() => {
    if (props.errorItems && props.errorItems.some(item => item.item === 'milestoneName') &&
      props.errorItems.some(item => item.item === 'memo')) {
      milestoneNameFocus.current.focus();
    } else if (props.errorItems && props.errorItems.some(item => item.item === 'memo') &&
      !props.errorItems.some(item => item.item === 'milestoneName')) {
      memoFocus.current.focus();
    } else if (props.errorItems && !props.errorItems.some(item => item.item === 'memo') &&
      props.errorItems.some(item => item.item === 'milestoneName')) {
      milestoneNameFocus.current.focus();
    }
  }, [props.errorItems, props.errorMessage]);

  /**
   * Check input changes
   */
  const isChangeInputEdit = () => {
    if (
      milesName !== initValueInput.milesName ||
      !(
        (finishDate === null && initValueInput.finishDate === null) ||
        (finishDate && initValueInput.finishDate && convertDateToYYYYMMDD(finishDate) === convertDateToYYYYMMDD(initValueInput.finishDate))
      ) ||
      isDone !== initValueInput.isDone ||
      memos !== initValueInput.memos ||
      isPublic !== initValueInput.isPublic ||
      customerId !== initValueInput.customerId
    ) {
      return true;
    }
    return false;
  };

  /**
   * Show popup dirtycheck
   * @param action action
   * @param cancel cancel
   */
  const executeDirtyCheck = async (action: () => void, cancel?: () => void, partern?: any) => {
    const isChange = isChangeInputEdit();
    if (isChange) {
      await DialogDirtyCheck({ onLeave: action, onStay: cancel, partternType: partern });
    } else {
      action();
    }
  };

  /**
   * method close modal
   */
  const handleCloseModal = (event, partern: any) => {
    if (!event || event.key === "Enter")
      executeDirtyCheck(() => {
        if (!props.popout) {
          props.reset();
          props.toggleCloseModalMiles();
        } else {
          window.close();
        }
      }, () => { }, partern);
  };

  /**
   * Back to previous modal state
   */
  const handleBackPopup = () => {
    if (isOpenFromModal) {
      if (props.popout) {
        updateStateSession(FSActionTypeScreen.SetSession);
        setForceCloseWindow(true);
      } else {
        handleCloseModal(null, DIRTYCHECK_PARTTERN.PARTTERN1);
      }
    }
  };

  /**
   * Run when forceCloseWindow
   */
  useEffect(() => {
    if (forceCloseWindow) {
      if (props.popout) {
        window.opener.postMessage({ type: FSActionTypeScreen.CloseWindow, forceCloseWindow: true }, window.location.origin);
        Storage.session.set('forceCloseWindow', true);
        window.close();
      } else {
        handleCloseModal(null, DIRTYCHECK_PARTTERN.PARTTERN1);
      }
    }
  }, [forceCloseWindow]);

  /**
   * Open new window
   */
  const openNewWindow = () => {
    updateStateSession(FSActionTypeScreen.SetSession);
    setShowModal(false);
    const height = screen.height * 0.6;
    const width = screen.width * 0.6;
    const left = screen.width * 0.2;
    const top = screen.height * 0.2;
    const style = `width=${width},height=${height},left=${left},top=${top}`;
    window.open(`${props.tenant}/create-edit-milestone`, '', style.toString());
    props.toggleNewWindow && props.toggleNewWindow(true);
  };

  /**
   * Post message onBeforeUnload
   * @param ev
   */
  const onBeforeUnload = ev => {
    if (props.popout && !Storage.session.get('forceCloseWindow')) {
      window.opener.postMessage({ type: FSActionTypeScreen.CloseWindow, forceCloseWindow: false }, window.location.origin);
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
        // updateStateSession(FSActionTypeScreen.RemoveSession);
        if (ev.data.forceCloseWindow) {
          setShowModal(true);
        } else {
          props.toggleCloseModalMiles();
        }
      }
    }
  };
  // registry onBeforeUnload and onReceiveMessage message to EventListener
  if (props.popout) {
    useEventListener('beforeunload', onBeforeUnload);
  } else {
    useEventListener('message', onReceiveMessage);
  }

  if (props.milesId) {
    useEffect(() => {
      props.getMilestone(valueMilestoneId);
    }, []);
    useEffect(() => {
      if(props.milestoneName && props.milestoneName.length > 0) {
        setMilesName(props.milestoneName ? props.milestoneName : '');
        setMemo(props.memo ? props.memo : '');
        setIsDone(props.isDone ? props.isDone : false);
        setIsPublic(props.isPublic ? props.isPublic : false);
        setFinishDate(props.endDate ? props.endDate : null);
        setUpdatedDate(props.updatedDate);
        setCustomerId((props && props.customerIdProps) || (props.customers ? props.customers.customerId : null));
        setCreatedUserName(props.createdUserName ? props.createdUserName : '');
        setUpdatedUserName(props.updatedUserName ? props.updatedUserName : '');
        setCustomers(props.customers && _.size(props.customers) > 0 ? [props.customers] : [])
      }
    }, [
      props.milestoneName,
      props.memo,
      props.isDone,
      props.endDate,
      props.createdDate,
      props.updatedDate,
      props.isPublic,
      props.customers,
      props.createdUserName,
      props.updatedUserName
    ]);
  }

  useEffect(() => {
    setErrorItems(props.errorItems);
  }, [props.errorItems]);

  /**
   * Get error infor by field name
   * @param fieldName
   */
  const getErrorInfo = fieldName => {
    if (!errorItems) return null;
    let errorInfo = null;
    for (const elem of errorItems) {
      if (elem.item === fieldName) {
        // const errorTmp = {};
        // errorTmp['rowId'] = elem.rowId;
        // errorTmp['item'] = elem.item;
        // errorTmp['errorCode'] = elem.errorCode;
        // errorTmp['errorParams'] = elem.errorParams ? elem.errorParams : null;
        // errorInfo = errorTmp;
        errorInfo = elem;
        break;
      }
    }
    return errorInfo;
  };

  /**
   * Return error message by fieldName
   * @param fieldName
   */
  const getErrorMesssageByFieldName = fieldName => {
    const errorInfo = getErrorInfo(fieldName);
    if (!errorInfo) {
      return null;
    }
    return translate(`messages.${errorInfo.errorCode}`, errorInfo.errorParams ? errorInfo.errorParams : null);
  };

  /**
   * Set error message on top
   */
  const setMessageError = () => {
    if (props.errorItems) {
      for (const errorItem of props.errorItems) {
        if (errorItem.item === 'milestone') {
          setMsgError(translate('messages.' + errorItem.errorCode));
          break;
        }
      }
    }
  };

  useEffect(() => {
    switch (props.actionType) {
      case MilestoneAction.None:
        break;
      case MilestoneAction.Success:
        setCustomers(props.customers && _.size(props.customers) > 0 ? [props.customers] : []);
        setMsgError('');
        setMessageError();
        break;
      case MilestoneAction.CreateSucess:
        if (!props.errorMessage && (!props.errorItems || props.errorItems.length === 0)) {
          setTimeout(() => {
            if (!props.popout) {
              if (props.hiddenShowNewTab) {
                props.onCloseModalMilestone(props.milestoneId);
              } else {
                props.toggleCloseModalMiles('INF_COM_0003');
              }
            } else {
              window.close();
            }
          }, TIMEOUT_TOAST_MESSAGE);

          setMsgError('');
          setMsgSuccess(translate('messages.' + props.successMessage));
          return;
        }
        setMessageError();
        break;
      case MilestoneAction.UpdateSucess:
        if (!props.errorMessage && (!props.errorItems || props.errorItems.length === 0)) {
          setTimeout(() => {
            if (!props.popout) {
              props.reset();
              props.toggleCloseModalMiles('INF_COM_0003');
            } else {
              window.close();
            }
          }, TIMEOUT_TOAST_MESSAGE);
          setMsgError('');
          setMsgSuccess(translate('messages.' + props.successMessage));
          return;
        }
        setMessageError();
        break;
        case MilestoneAction.GetCustomersSuccess:
          if(props.customers && props.customers.length > 0) {
            setCustomers(props.customers);
            setCustomerId(props.customers[0].customerId);
            break;
          }
        break;
      default:
        break;
    }
  }, [props.actionType]);

  /**
   * method render message box error or success
   */
  const displayMessage = () => {
    if ((!msgError || msgError.length <= 0) && (!msgSuccess || msgSuccess.length <= 0)) {
      return <></>;
    }
    return (
      <BoxMessage
        messageType={msgError && msgError.length > 0 ? MessageType.Error : MessageType.Success}
        message={msgError && msgError.length > 0 ? msgError : msgSuccess}
        className="message-area-bottom position-absolute style-3"
      />
    );
  };

  const renderErrorMessage = () => {
    if (props.errorItems && props.errorItems.length && props.errorItems[0]) {
      if (props.errorItems[0].errorCode === 'ERR_COM_0050') {
        return (
          <BoxMessage messageType={MessageType.Error}
            message={translate(`messages.${props.errorItems[0].errorCode}`)}
            className={'message-absoluted w-80'}
          />
        );
      }
    }
  }

  const converDate = (dataAdd) => {
    if (dataAdd < 10) {
      return '0' + dataAdd;
    }
    if (dataAdd > 9999) {
      return '+' + dataAdd;
    }
    return dataAdd;
  };

  const converToFormDateTimezone = (date) => {
    if (!moment.isDate(date)) {
      date = convertDateTimeFromServer(date);
    }
    return converDate(date.getFullYear()) + '-' + converDate(date.getMonth() + 1) + '-' + converDate(date.getDate()) + 'T' + converDate(date.getHours()) + ':'
      + converDate(date.getMinutes()) + ':' + converDate(date.getSeconds()) + 'Z';
  };

  /**
   * method create or update MileStone
   */
  const handleSubmit = (event) => {
    setSubmittedCheckList({ milestoneName: true, memo: true });
    event.preventDefault();
    if (milesActionType === MILES_ACTION_TYPES.CREATE) {
      const createMilestone = {
        milestoneName: milesName,
        endDate: finishDate ? converToFormDateTimezone(finishDate) : null,
        memo: memos ? memos : null,
        isDone: isDone ? 1 : 0,
        customerId: customerId ? customerId : null,
        isPublic: isPublic ? 1 : 0,
      };
      props.handleSubmitMilestoneData(createMilestone, milesActionType);
      return;
    }
    const updateMilestone = {
      milestoneId: valueMilestoneId,
      milestoneName: milesName,
      endDate: finishDate ? converToFormDateTimezone(finishDate) : null,
      memo: memos ? memos : null,
      isDone: isDone ? 1 : 0,
      customerId: customerId ? customerId : null,
      isPublic: isPublic ? 1 : 0,
      updatedDate
    };
    props.handleSubmitMilestoneData(updateMilestone, milesActionType);
  };

  /**
   * method get text of create
   */
  const getTextSubmitButton = () => {
    if (milesActionType === MILES_ACTION_TYPES.CREATE) {
      return translate('milestone.create-edit.form.button-create');
    } else {
      return translate('milestone.create-edit.form.button-edit');
    }
  };


  /**
   * method get date create of milestone
   */
  const getDateCreateMileStone = () => {
    if (milesActionType === MILES_ACTION_TYPES.CREATE) {
      return translate('milestone.create-edit.form.default');
    }
    return dateFnsFormat(createdDate, userFormat);
  };

  /**
 * method get date create of milestone
 */
  const getCreateUser = () => {
    if (milesActionType === MILES_ACTION_TYPES.CREATE) {
      return translate('milestone.create-edit.form.default');
    }
    return createdUserName;
  };

  /**
 * method get date create of milestone
 */
  const getUpdateUser = () => {
    if (milesActionType === MILES_ACTION_TYPES.CREATE) {
      return translate('milestone.create-edit.form.default');
    }
    return updatedUserName;
  };

  /**
   * method get date update of milestone
   */
  const getDateUpdateMileStone = () => {
    if (milesActionType === MILES_ACTION_TYPES.CREATE) {
      return translate('milestone.create-edit.form.default');
    }
    return dateFnsFormat(updatedDate, userFormat);
  };

  /**
   * Handle when select 1 in customer list
   * @param id 
   * @param type 
   * @param mode 
   * @param listTag 
   */
  const onActionSelectCustomer = (id: any, type: TagAutoCompleteType, mode: TagAutoCompleteMode, listTag: any[]) => {
    if (listTag) {
      for (const item of listTag) {
        if (item.customerId) {
          const newCustomers = [];
          newCustomers.push(item);
          setCustomers(newCustomers);
          setCustomerId(item.customerId);
          return;
        }
      }
    }
    setCustomers([]);
    setCustomerId(null);
  };

 /**
  * Return class for suggest search
  * @param errorInfo 
  */
  const getSuggestClassName = () => {
    let inputClass = errorItems && errorItems.some(item => item.item === 'customerId') ? "input-normal error" : "input-normal";
    if (props.customerIdProps && props.customerIdProps > 0) {
      inputClass += " disable";
    }
    return inputClass;
  }

  const isJsonString = strJson => {
    try {
      JSON.parse(strJson);
    } catch (e) {
      return false;
    }
    return true;
  };

  const getAdress = (addressIn) => {
    let addressOut = '';
    if (addressIn === '{}') {
      return addressOut;
    }
    const addressJson = isJsonString(addressIn) ? JSON.parse(addressIn) : "";
    if (!addressJson) {
      return addressIn;
    }
    addressOut += addressJson.address ? addressJson.address : "";
    return addressOut;
  }

  /**
   * Render customer suggest search
   * @param customersData 
   * @param isDisabled 
   */
  const renderCustomersName = (customersData, isDisabled) => {
    if (!props.listLicense && !props.listLicense.includes(LICENSE.CUSTOMER_LICENSE)) {
      return <></>;
    }
    if (customersData && customersData.length > 0 && !customersData[0]['customerAddress']) {
      customersData[0]['customerAddress'] = customersData[0].address ? getAdress(customersData[0].address) : '';
    }
    const titleName = translate('milestone.create-edit.form.customer');
    return (
      <div className="col-lg-6 form-group">
        <ManagerSuggestSearch
          id={titleName}
          title={titleName}
          type={TagAutoCompleteType.Customer}
          modeSelect={TagAutoCompleteMode.Single}
          inputClass={getSuggestClassName()}
          isRequired={false}
          elementTags={customersData}
          placeholder={translate('tasks.create-edit.placeholder.suggest-single', { placeholder: titleName })}
          onActionSelectTag={onActionSelectCustomer}
          isDisabled={isDisabled}
          validMsg={getErrorMesssageByFieldName('customerId')}
          disableTag={props.customerIdProps && props.customerIdProps > 0}
        />
      </div>
    );
  }

  const renderComponentCreateEditMilestoneModal = () => {
    return (
      <>
        <div className="modal popup-esr popup-esr4 user-popup-page popup-align-right show" id="popup-esr" aria-hidden="true">
          <div className={showModal ? 'modal-dialog form-popup' : 'form-popup'}>
            <div className="modal-content">
              <div className="modal-header">
                <div className="left">
                  <div className="popup-button-back">
                    <a className={isOpenFromModal ? 'icon-small-primary icon-return-small' : 'icon-small-primary icon-return-small disable'} onClick={handleBackPopup} />
                    <span className="text">
                      <img className="icon-task-brown" title="" src="../../content/images/task/ic-flag-brown.svg" alt="" />
                      {milesActionType === MILES_ACTION_TYPES.CREATE
                        ? translate('milestone.create-edit.title')
                        : translate('milestone.create-edit.title-edit')}
                    </span>
                  </div>
                </div>
                <div className="right">
                  {!props.hiddenShowNewTab && showModal && (
                    <a className="icon-small-primary icon-link-small" onClick={() => openNewWindow()}>
                      &nbsp;
                    </a>
                  )}
                  {showModal && <a className="icon-small-primary icon-close-up-small" onClick={() => handleCloseModal(null, DIRTYCHECK_PARTTERN.PARTTERN2)}></a>}
                </div>
              </div>
              {renderErrorMessage()}
              <form>
                <div className="modal-body style-3">
                  <div className="popup-content style-3">
                    <div className="user-popup-form poup-task-form color-333 font-weight-500">
                      <div className="row break-row">
                        <div className="col-lg-6 form-group  min-height-70">
                          <label>
                            {translate('milestone.create-edit.form.milestone-name')}
                            <a className="label-red">{translate('milestone.create-edit.form.required')}</a>
                          </label>
                          <input
                            ref={milestoneNameFocus}
                            type="text"
                            className={"input-normal" + (errorItems && errorItems.some(item => item.item === 'milestoneName') ? " error" : "")}
                            placeholder={translate('milestone.create-edit.form.milestone-name-placeholder')}
                            onChange={e => {
                              setMilesName(e.target.value);
                              if (submittedCheckList.milestoneName) {
                                setSubmittedCheckList({ ...submittedCheckList, milestoneName: false });
                              }
                            }}
                            onBlur={(e) => setMilesName(toKatakana(e.target.value))}
                            value={milesName}
                            autoFocus
                          />
                          {errorItems && errorItems.some(item => item.item === 'milestoneName') && (
                            <span className='messenger-error'>{getErrorMesssageByFieldName('milestoneName')}</span>
                          )}
                        </div>
                        <div className="col-lg-6 form-group">
                          <label>{translate('milestone.create-edit.form.finnish-date')}</label>
                          <DatePicker
                            date={!moment.isDate(finishDate) ? convertDateTimeFromServer(finishDate) : finishDate}
                            isError={errorItems && errorItems.some(item => item.item === 'finishDate')}
                            borderClass={"input-common-wrap delete"}
                            inputClass={"input-normal gray"}
                            onDateChanged={d => setFinishDate(d ? d : null)}
                            placeholder={translate('milestone.create-edit.form.finnish-date-placeholder')}
                          />
                          {errorItems && <span className="messenger-error">{getErrorMesssageByFieldName('finishDate')}</span>}
                        </div>
                      </div>
                      <div className="row break-row">
                        <div className="col-lg-6 form-group">
                          <label>{translate('milestone.create-edit.form.isdone')}</label>
                          <label className="icon-check color-000" id="isDone">
                            <input type="checkbox" name="isDone" onChange={e => setIsDone(e.target.checked)} checked={isDone} />
                            <i /> {translate('milestone.create-edit.form.isdone-comment')}
                          </label>
                        </div>
                        <div className="col-lg-6 form-group">
                          <label>{translate('milestone.create-edit.form.comment')}</label>
                          <textarea
                            ref={memoFocus}
                            placeholder={translate('milestone.create-edit.form.comment-placeholder')}
                            value={memos}
                            onChange={e => {
                              setMemo(e.target.value);
                              if (submittedCheckList.memo) {
                                setSubmittedCheckList({ ...submittedCheckList, memo: false });
                              }
                            }}
                            onBlur={(e) => setMemo(toKatakana(e.target.value))}
                            className={errorItems && errorItems.some(item => item.item === 'memo') ? "error" : ""}
                          />
                          {errorItems && errorItems.some(item => item.item === 'memo') && (
                            <span className='messenger-error'> {getErrorMesssageByFieldName('memo')}</span>
                          )}
                        </div>
                        <div className="col-lg-12 form-group">
                          <label>{translate('milestone.create-edit.form.is-public-title')}</label>
                          <label className="icon-check">
                            <input type="checkbox" name="publicFlag" onClick={() => setIsPublic(!isPublic)} checked={isPublic} />
                            <i /> {translate('milestone.create-edit.form.is-public-checkbox')}
                          </label>
                        </div>
                      </div>
                      <div className="row break-row">
                        {props.customerIdProps && customers && customers.length > 0 && renderCustomersName(customers, true)}
                        {!props.customerIdProps && milesActionType === MILES_ACTION_TYPES.UPDATE && customers && customers.length > 0 && renderCustomersName(customers, false)}
                        {!props.customerIdProps && milesActionType === MILES_ACTION_TYPES.UPDATE && customers && customers.length === 0 && renderCustomersName(customers, false)}
                        {!props.customerIdProps && milesActionType === MILES_ACTION_TYPES.CREATE && renderCustomersName(customers, false)}
                      </div>
                      <div className="row">
                        <div className="col-lg-6 form-group">
                          <div>{translate('milestone.create-edit.form.create-date')}</div>
                          <div>{getDateCreateMileStone()}</div>
                        </div>
                        <div className="col-lg-6 form-group">
                          <div>{translate('milestone.create-edit.form.create-per')}</div>
                          <div>{getCreateUser()}</div>
                        </div>
                        <div className="col-lg-6 form-group">
                          <div>{translate('milestone.create-edit.form.update-date')}</div>
                          <div>{getDateUpdateMileStone()}</div>
                        </div>
                        <div className="col-lg-6 form-group">
                          <div>{translate('milestone.create-edit.form.update-per')}</div>
                          <div>{getUpdateUser()}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
              <div className="user-popup-form-bottom">
                <a role="button" tabIndex={0} onClick={() => handleCloseModal(null, DIRTYCHECK_PARTTERN.PARTTERN2)} onKeyDown={() => handleCloseModal(event, DIRTYCHECK_PARTTERN.PARTTERN2)} className="button-cancel">
                  {translate('milestone.create-edit.form.button-cancel')}
                </a>
                <button onClick={handleSubmit} className={`button-blue `} disabled={msgSuccess && msgSuccess.length > 0}>
                  {getTextSubmitButton()}
                </button>
              </div>
              <div> {displayMessage()}</div>
            </div>
          </div>
        </div>
        <div className="modal-backdrop show" />
      </>
    );
  };
  if (showModal) {
    return <>
      <Modal isOpen fade toggle={() => { }} backdrop={(props.backdrop || props.backdrop === undefined)} id="popup-field-search" autoFocus>
        {renderComponentCreateEditMilestoneModal()}
      </Modal>
    </>;
  } else {
    if (props.popout) {
      return <>{renderComponentCreateEditMilestoneModal()}</>;
    } else {
      return <></>;
    }
  }
};

/**
 * map action reducer to props
 */
const mapDispatchToProps = {
  getMilestone,
  handleSubmitMilestoneData,
  handleGetCustomersByIds,
  reset
};

/**
 * map state store to props
 */
const mapStateToProps = ({ milestone, applicationProfile, authentication }: IRootState) => ({
  tenant: applicationProfile.tenant,
  milestoneName: milestone.milestoneName,
  isDone: milestone.isDone,
  isPublic: milestone.isPublic,
  memo: milestone.memo,
  endDate: milestone.endDate,
  errorItems: milestone.errorItems,
  errorMessage: milestone.errorMessage,
  successMessage: milestone.successMessage,
  createdDate: milestone.createdDate,
  updatedDate: milestone.updatedDate,
  actionType: milestone.action,
  milestoneId: milestone.milestoneId,
  createdUserName: milestone.createdUser,
  updatedUserName: milestone.updatedUser,
  customers: milestone.customers,
  isCloseAllWindownOpened: milestone.isCloseAllWindownOpened,
  listLicense: authentication.account.licenses,
});

type StateProps = ReturnType<typeof mapStateToProps>;

type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateEditMilestoneModal);
