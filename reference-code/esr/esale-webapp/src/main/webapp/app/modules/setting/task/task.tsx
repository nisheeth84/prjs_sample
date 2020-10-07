import React, { useState, useEffect, useRef } from 'react';
import { translate } from 'react-jhipster';
import { TASK_TAB, SHOW_MESSAGE } from '../constant';
import ActivityFormat from './activity-format/activity-format';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { handleUpdate } from 'app/modules/setting/task/activity-format/activity-format.reducer'
import DialogDirtyCheckRestart from 'app/shared/layout/common/dialog-dirty-check-restart';
import BoxMessage, { MessageType } from 'app/shared/layout/common/box-message';
import { TIMEOUT_TOAST_MESSAGE } from 'app/config/constants';

export interface ITaskProps extends StateProps, DispatchProps {
  callBack?
  setDirtyTypeProps?
  setDataChanged?
}

export const Task = (props: ITaskProps) => {

  const [taskTabs, setTaskTabs] = useState(TASK_TAB.TAB_DEFAULT);
  const [paramUpDate, setParamUpDate] = useState({});
  const [reset, setreset] = useState(false);
  const [lockupdate, setLockupdate] = useState(true);
  const [codeMessages, setCodeMessages] = useState(SHOW_MESSAGE.NONE);
  const [msgInfoSuccess, setMsgInfoSuccess] = useState('');

  const buttonCance = useRef(null);
  const buttonSubmit = useRef(null);

  const activityFormatChange = (param) => {
    const lstItem = param['listItem']
    let checkJson = 0
    lstItem.forEach(element => {
      try {
        element['fieldUse'] = JSON.parse(element['fieldUse'])
      } catch (e) {
        checkJson += 1
      }
      try {
        element['productTradingFieldUse'] = JSON.parse(element['productTradingFieldUse'])
      } catch (e) {
        checkJson += 1
      }
      element['fieldUse'] = JSON.stringify(element['fieldUse'])
      element['productTradingFieldUse'] = JSON.stringify(element['productTradingFieldUse'])
    });
    setParamUpDate(param)
    props.setDirtyTypeProps(param)
  }

  const saveData = () => {
    if (paramUpDate['listItem'] !== undefined && lockupdate) {
      setLockupdate(!lockupdate)
      props.handleUpdate(paramUpDate);
    }
  }

  const executeDirtyCheck = async (action: () => void, cancel?: () => void) => {
    if (paramUpDate['listItem'] !== undefined) {
      await DialogDirtyCheckRestart({ onLeave: action, onStay: cancel });
    } else {
      action();
    }
  };

  const cancel = () => {
    buttonCance.current.blur();
    executeDirtyCheck(() => {
      setreset(!reset)
      setParamUpDate({})
      props.setDirtyTypeProps({})
    })
  }

  const showMessage = (codeMessage, msgInfosSuccess) => {
    setCodeMessages(codeMessage)
    setMsgInfoSuccess(msgInfosSuccess)
  }


  const renderCodeMessage = () => {
    if (codeMessages === SHOW_MESSAGE.SUCCESS) {
      return (
        <BoxMessage messageType={MessageType.Success} message={translate('messages.INF_COM_0008')} className="message-area-bottom" />
      )
    } else if (codeMessages === SHOW_MESSAGE.ERROR || codeMessages === SHOW_MESSAGE.CAN_NOT_DELETE) {
      return (
        <div className="message-area message-area-bottom" style={{ position: "relative", bottom: "25px", width: "fit-content" }}>
          <BoxMessage messageType={MessageType.Error}
            message={msgInfoSuccess} />
        </div>
      )
    }
  }

  useEffect(() => {
    setreset(!reset)
  }, [props.callBack])

  useEffect(() => {
    if (props.messageError && props.messageError.length === 0) {
      setParamUpDate({})
      props.setDirtyTypeProps({})
    }
    if (!lockupdate) {
      setLockupdate(!lockupdate)
    }
  }, [props.iDSS, props.messageError])


  useEffect(() => {
    if (codeMessages) {
      setTimeout(() => {
        setCodeMessages(SHOW_MESSAGE.NONE)
      }, TIMEOUT_TOAST_MESSAGE)
    }
  }, [codeMessages])

  return (
    <>
      <div className="modal-body style-3">
        <div className="popup-content  style-3" style={taskTabs === TASK_TAB.TAB_ACTIVITY_FORMAT ? { overflow: 'visible' } : {}}>
          <div className="user-popup-form setting-popup-wrap h-100">
            <div className="setting-popup-left">
              <div className="wrap-control-esr">
                <div className="esr-content">
                  <div className="esr-content-sidebar no-background">
                    <div className="esr-content-sidebar-outer">
                      <div className="esr-content-sidebar-inner">
                        <div className="list-group" onClick={() => setTaskTabs(TASK_TAB.TAB_DEFAULT)}>
                          <a className={taskTabs === TASK_TAB.TAB_DEFAULT ? "active" : ""}>{translate('setting.product.projectSetting')}</a>
                        </div>
                        <div className="list-group" onClick={() => setTaskTabs(TASK_TAB.TAB_ACTIVITY_FORMAT)}>
                          <a className={taskTabs === TASK_TAB.TAB_ACTIVITY_FORMAT ? "active" : ""}>{translate('setting.product.format')}</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="setting-popup-content mt-2">
              {taskTabs === TASK_TAB.TAB_ACTIVITY_FORMAT && <ActivityFormat
                resetpapge={reset}
                activityFormatChange={activityFormatChange}
                showMessage={showMessage}
                setDataChanged={props.setDataChanged} />}
            </div>
          </div>
        </div>
      </div>
      <div className="user-popup-form-bottom">
        {/* {renderCodeMessage()} */}
        {codeMessages === SHOW_MESSAGE.SUCCESS && renderCodeMessage()}
        {codeMessages === SHOW_MESSAGE.NONE && (
          <>
            <button ref={buttonCance} className="btn-button button-primary" onClick={cancel}>
              {translate('setting.button.cancel')}
            </button>
            <button className="btn-button button-blue" onClick={saveData}>
              {translate('setting.button.save')}
            </button>
          </>
        )}
      </div>
    </>
  )

}
const mapStateToProps = ({ activityFormat }: IRootState) => ({
  iDSS: activityFormat.activityUpdate,
  messageError: activityFormat.errorItems,
});

const mapDispatchToProps = {
  handleUpdate
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Task);
