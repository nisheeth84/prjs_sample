import React, { useEffect, useState } from 'react';
import { CALENDAR_TAB, SHOW_MESSAGE } from '../constant';
import SchedulesType from './schedule/schedule-type';
import EquipmentType from './equiqment/equipment-type';
import { handleUpdateData } from './equiqment/equipment-type.reducer'
import { updateHoliday } from "./holiday/holiday.reducer";
import DialogDirtyCheckReset from 'app/shared/layout/common/dialog-dirty-check-restart';
import { IRootState } from 'app/shared/reducers';
import { translate } from 'react-jhipster';
import { connect } from 'react-redux';
import GoogleCalendar from './google/google-calendar';
import Holiday from './holiday/holiday';
import _, { flow } from 'lodash';
import '../../../../content/css/setting.css';
import { Helmet } from 'react-helmet';
import BoxMessage, { MessageType } from 'app/shared/layout/common/box-message';
import { isNullOrUndefined } from "util";
import DialogDirtyCheckPopup from 'app/shared/layout/common/dialog-dirty-check-popup';
import { TIMEOUT_TOAST_MESSAGE } from "app/config/constants";
import { width } from '@fortawesome/free-solid-svg-icons/faSort';

export interface ICalendarProps extends StateProps, DispatchProps {
  callBack?,
  calendarTab?,
  dataChangedCalendar,
}
export const Calendar = (props: ICalendarProps) => {

  const [calendarTabs, setCalendarTabs] = useState(CALENDAR_TAB.TAB_GOOGLE);
  const [dateUpdate, setDateUpdate] = useState({});
  const [reset, setreset] = useState(false);
  const [isSave, setIsSave] = useState(false);
  const [codeMessages, setCodeMessages] = useState(SHOW_MESSAGE.NONE);
  const [msgInfoSuccess, setMsgInfoSuccess] = useState('');
  const [disableButon, setDisableButon] = useState(false);
  const [resetCodeMessage, setResetCodeMessage] = useState(SHOW_MESSAGE.NONE);
  const [codeMessageGG, setCodeMessageGG] = useState(0);

  const renderAddWrapSetting = () => {
    return (
      <>
        <Helmet>
          <body />                 {/* I have remove className="wrap-setting". because it make error on IE */}
        </Helmet>
      </>
    )
  }

  const changeDateUpdate = (param) => {
    if (param) {
      props.dataChangedCalendar(true)
      setDisableButon(true)
      setDateUpdate(param)
    }
  }

  const getErrorMessage = (errorCode) => {
    let errorMessage = '';
    if (!isNullOrUndefined(errorCode)) {
      errorMessage = translate('messages.' + errorCode);
    }
    return errorMessage;
  }

  const showMessage = (codeMessage, msgInfosSuccess) => {
    if (codeMessage === SHOW_MESSAGE.SUCCESS)
      setTimeout(() => {
        setCodeMessages(codeMessage);
        setMsgInfoSuccess(msgInfosSuccess);
      }, 1000);
  }

  const renderCodeMessage = () => {
    if (codeMessages === SHOW_MESSAGE.SUCCESS) {
      return (
        <div style={{ position: "relative", bottom: "25px" }}>
          <div style={{ display: "inline-flex", minWidth: "720px", flexFlow: "column" }}>
            <BoxMessage messageType={MessageType.Success}
              message={msgInfoSuccess} />
          </div>
        </div>
      )
    }
  }

  useEffect(() => {
    if (codeMessages) {
      setTimeout(() => {
        setCodeMessages(SHOW_MESSAGE.NONE)
      }, TIMEOUT_TOAST_MESSAGE)
    }
  }, [codeMessages])

  const [clearEquipmentData, setClearEquipmentData] = useState(false);

  const saveData = () => {
    setCodeMessages(SHOW_MESSAGE.NONE);
    switch (calendarTabs) {
      case CALENDAR_TAB.TAB_SCHEDULE_TYPE:
      case CALENDAR_TAB.TAB_HOLIDAY:
        setIsSave(!isSave)
        break;
      case CALENDAR_TAB.TAB_EQUIQMENT_TYPE:
        if (dateUpdate['equipmentTypes']) {
          if (dateUpdate['equipmentTypes'].length > 0) {
            dateUpdate['equipmentTypes'].forEach((element, index) => {
              if (element?.orderOfType) {
                delete element.orderOfType
              }
              if (element.equipments.length > 0) {
                element.equipments.forEach((e, equipIndex) => {
                  if (e?.orderOfType) {
                    delete e.orderOfType
                  }
                  if (e?.orderOfTypeChoose) {
                    delete e.orderOfTypeChoose
                  }
                  if (e?.equipmentTypeIdOld) {
                    delete e.equipmentTypeIdOld
                  }
                  if (e?.oldLangs) {
                    delete e.oldLangs
                  }
                  if (e?.equipmentId) {
                    e.isUpdate = 1
                  }
                  e.displayOrder = equipIndex + 1
                })
              }
              if (element?.equipmentTypeId && element.equipmentTypeId > 0) {
                element.isUpdate = 1
              }
              element.displayOrder = index + 1
            })
          }
          setResetCodeMessage(SHOW_MESSAGE.NONE)
          props.handleUpdateData(dateUpdate)
        }
        break;
      case CALENDAR_TAB.TAB_GOOGLE:
        setIsSave(!isSave)
        break;
      default:
        break;
    }
  }

  const executeDirtyCheck = async (action: () => void) => {
    if (dateUpdate['equipmentTypes'] !== undefined || dateUpdate['scheduleTypes'] !== undefined) {
      await DialogDirtyCheckReset({ onLeave: action });
    } else {
      action();
    }
  };

  const executeDirtyCheckHoliday = async (action: () => void) => {
    if (dateUpdate) {
      await DialogDirtyCheckReset({ onLeave: action });
    } else {
      action();
    }
  }

  const actionAfterExcuteDirty = () => {
    setClearEquipmentData(true);
    setDateUpdate({})
    setreset(!reset)
    props.dataChangedCalendar(false)
    setDisableButon(false);
  }

  const resetLocal = (isHoliday?) => {
    const obj = {}
    if (!_.isEmpty(dateUpdate)) {
      if (isHoliday) {
        executeDirtyCheckHoliday(actionAfterExcuteDirty)
      } else {
        executeDirtyCheck(actionAfterExcuteDirty)
      }
    }
  }

  useEffect(() => {
    if (props.calendarTab) {
      setCalendarTabs(props.calendarTab)
    }
  }, [props.calendarTab])

  useEffect(() => {
    setreset(!reset)
  }, [props.callBack])

  useEffect(() => {
    if (props.iDSS !== null) {
      setDateUpdate({})
    }
  }, [props.iDSS, props.messageError])

  useEffect(() => {
    if (props.isSuccess) {
      setDateUpdate({})
      setCodeMessageGG(1);
    }
  }, [props.isSuccess]);

  const renderErrorMessage = () => {
    if (codeMessageGG === 1) {
      setTimeout(() => {
        setCodeMessageGG(0);
      }, 2000);
    }
    return <div>
      <BoxMessage messageType={MessageType.Success}
        message={translate('messages.INF_COM_0008')}
        className="message-area-bottom position-absolute" />
    </div>
  }

  /**
   * onChangeTab
   */
  const onChangeTab = () => {
    setDateUpdate({})
    props.dataChangedCalendar(false);
    setDisableButon(false);
  }

  return (
    <>
      {/* {renderAddWrapSetting()} */}
      <div className="modal-body style-3">
        <div className="popup-content style-3" style={{ height: 'calc(100vh - 174px)' }}>
          <div className="user-popup-form setting-popup-wrap" style={{ height: 'calc(100vh - 200px)' }}>
            <div className="setting-popup-left">
              <div className="wrap-control-esr">
                <div className="esr-content">
                  <div className="esr-content-sidebar no-background">
                    <div className="esr-content-sidebar-outer">
                      <div className="esr-content-sidebar-inner">
                        <div className="list-group" onClick={() => {
                          setCodeMessages(SHOW_MESSAGE.NONE);
                          setCalendarTabs(CALENDAR_TAB.TAB_GOOGLE);
                          onChangeTab();
                        }}>
                          <a className={calendarTabs === CALENDAR_TAB.TAB_GOOGLE ? "active" : ""}>{translate('setting.calendar.nav.google')}</a>
                        </div>
                        <div className="list-group" onClick={() => {
                          setCodeMessages(SHOW_MESSAGE.NONE);
                          setCalendarTabs(CALENDAR_TAB.TAB_SCHEDULE_TYPE);
                          onChangeTab();
                        }}>
                          <a className={calendarTabs === CALENDAR_TAB.TAB_SCHEDULE_TYPE ? "active" : ""}>{translate('setting.calendar.nav.scheduleType')}</a>
                        </div>
                        <div className="list-group" onClick={() => {
                          setCodeMessages(SHOW_MESSAGE.NONE);
                          setCalendarTabs(CALENDAR_TAB.TAB_HOLIDAY);
                          onChangeTab();
                        }}>
                          <a className={calendarTabs === CALENDAR_TAB.TAB_HOLIDAY ? "active" : ""}>{translate('setting.calendar.nav.holiday')}</a>
                        </div>
                        <div className="list-group" onClick={() => {
                          setCodeMessages(SHOW_MESSAGE.NONE);
                          setCalendarTabs(CALENDAR_TAB.TAB_EQUIQMENT_TYPE);
                          onChangeTab();
                        }}>
                          <a className={calendarTabs === CALENDAR_TAB.TAB_EQUIQMENT_TYPE ? "active" : ""}>{translate('setting.calendar.nav.equiqmentType')}</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="setting-popup-content setting-calender">
              {calendarTabs === CALENDAR_TAB.TAB_SCHEDULE_TYPE && <SchedulesType
                isSave={isSave}
                calendarTabs={calendarTabs}
                changeDateUpdate={changeDateUpdate}
                resetpapge={reset}
                dataChangedCalendar={props.dataChangedCalendar}
                showMessage={showMessage}
              />}
              {calendarTabs === CALENDAR_TAB.TAB_EQUIQMENT_TYPE && <EquipmentType
                changeDateUpdate={changeDateUpdate}
                showMessage={showMessage}
                resetpapge={reset}
                clearEquipmentData={clearEquipmentData}
                resetCodeMessage={resetCodeMessage}
                dataChangedCalendar={props.dataChangedCalendar}
              />}
              {calendarTabs === CALENDAR_TAB.TAB_GOOGLE && <GoogleCalendar
                changeGoogleCalendar={changeDateUpdate}
                isSave={isSave}
                calendarTabs={calendarTabs}
                resetpapge={reset} />}
              {calendarTabs === CALENDAR_TAB.TAB_HOLIDAY && <Holiday isSave={isSave} setStatusSave={setIsSave} resetpapge={reset} changeDateUpdate={changeDateUpdate} showMessage={showMessage} dataChangedCalendar={props.dataChangedCalendar} />}
            </div>
          </div>
        </div>
        {codeMessageGG === 1 && renderErrorMessage()}
      </div>
      <div className="user-popup-form-bottom">
        <button type='button' className="btn-button button-primary button-cancel button-cancel-setting" onClick={resetLocal}> {translate('setting.button.cancel')}</button>
        <button type='button' className="btn-button button-blue" onClick={saveData}> {translate('setting.button.save')}</button>
        {renderCodeMessage()}
      </div>
    </>
  )

}
const mapStateToProps = ({ equipmentType, googleCalendar }: IRootState) => ({
  iDSS: equipmentType.equipmentTypeUpdate,
  messageError: equipmentType.errorItems,
  isSuccess: googleCalendar.updatedSuccsess,

});

const mapDispatchToProps = {
  handleUpdateData,
  updateHoliday
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Calendar);
