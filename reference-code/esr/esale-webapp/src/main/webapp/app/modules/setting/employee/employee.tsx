import React, { useState, useEffect, useRef } from 'react';
import { SYSTEM_EMPLOYEE, SHOW_MESSAGE } from '../constant';
import JobTitleMaster from './employeePosition/job_title_master';
import { translate } from 'react-jhipster';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { updatePositions , reset } from 'app/modules/setting/employee/employeePosition/job_title_master.reducer'
import DialogDirtyCheckRestart from 'app/shared/layout/common/dialog-dirty-check-restart';
import { isNullOrUndefined } from "util";
import BoxMessage, { MessageType } from 'app/shared/layout/common/box-message';
import { TIME_OUT_MESSAGE } from 'app/modules/setting/constant';
import _ from 'lodash';

export interface IEmployeeProps extends StateProps, DispatchProps {
  callBack?,
  closeDialog?,
  exitMenuSettingDialog?,
  setDirtyType?,
  setDirtyTypeProps?,
  renderBoxMessage?,
}
export const Employee = (props: IEmployeeProps) => {

  const [employeesTabs, setEmployeesTabs] = useState(SYSTEM_EMPLOYEE.ITEM_SETTINGSS);
  const [paramUpDate, setParamUpDate] = useState({});
  const [resetData, setResetData] = useState(false);
  const [showMsgSucess, setShowMsgSucess] = useState(SHOW_MESSAGE.NONE);

  const buttonCance = useRef(null);

  const positionsChange = (param) => {
    setParamUpDate(param);
    props.setDirtyType();
    props.setDirtyTypeProps(param);
  }

  const saveData = () => {
    if ( _.get(paramUpDate, 'listItem' ,  undefined)  !== undefined) {
      props.updatePositions(paramUpDate);

    }
  }

  const executeDirtyCheck = async (action: () => void) => {
    if ( _.get(paramUpDate, 'listItem' ,  undefined)  !== undefined) {
      await DialogDirtyCheckRestart({ onLeave: action });
    } else {
      action();
      setParamUpDate({})
    }
  };

  const cancel = async () => {
    buttonCance.current.blur();
    await executeDirtyCheck(() => {
      props.setDirtyTypeProps({});
      setParamUpDate({});
      setResetData(!resetData);
    })
  }

  const renderMsg = () => {
    switch (showMsgSucess) {
      case SHOW_MESSAGE.SUCCESS:
        return (
          <BoxMessage messageType={MessageType.Success} message={translate('messages.INF_COM_0008')} className="message-area-bottom" />
        );
      case SHOW_MESSAGE.NO_RECORD:
        return (
          <BoxMessage
            messageType={MessageType.Success}
            message={translate('messages.INF_COM_0013')}
            className="message-area-bottom position-absolute"
          />
        );
      default:
        break;
    }
  };

  useEffect(() => {
    if (props.iDSS) {
      if (props.iDSS) {
        setShowMsgSucess(SHOW_MESSAGE.SUCCESS);
        props.setDirtyTypeProps({});
        setParamUpDate({});
        setResetData(!resetData);
      }
      setTimeout(() => {
        setShowMsgSucess(SHOW_MESSAGE.NONE);
      }, TIME_OUT_MESSAGE);
    }
  }, [props.iDSS]);

  useEffect(() => {
    if (!props.callBack) {
      cancel();
    }
  }, [props.callBack])

  return (
    <>
      <div className="modal-body style-3">
        <div className="popup-content style-3">
          <div className="user-popup-form setting-popup-wrap h-100">
            <div className="setting-popup-left">
              <div className="wrap-control-esr">
                <div className="esr-content">
                  <div className="esr-content-sidebar no-background">
                    <div className="esr-content-sidebar-outer">
                      <div className="esr-content-sidebar-inner">
                        <div className="list-group" onClick={() => setEmployeesTabs(SYSTEM_EMPLOYEE.ITEM_SETTINGSS)}>
                          <a className={employeesTabs === SYSTEM_EMPLOYEE.ITEM_SETTINGSS ? "active" : ""} >
                            {translate('setting.product.projectSetting')}
                          </a>
                        </div>
                        <div className="list-group" onClick={() => setEmployeesTabs(SYSTEM_EMPLOYEE.JOB_TITLE_MASTER)}>
                          <a className={employeesTabs === SYSTEM_EMPLOYEE.JOB_TITLE_MASTER ? "active" : ""}>
                            {translate('setting.employee.jobTitleMaster')}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {employeesTabs === SYSTEM_EMPLOYEE.JOB_TITLE_MASTER &&
              <JobTitleMaster
                renderBoxMessage={props.renderBoxMessage}
                positionsChange={positionsChange}
                resetPage={resetData}
                screenName={translate('setting.employee.jobTitleMaster')}
              />
            }
          </div>
        </div>
      </div>
      <div className="user-popup-form-bottom">
        {showMsgSucess === SHOW_MESSAGE.SUCCESS && renderMsg()}
        {showMsgSucess === SHOW_MESSAGE.NONE && (
          <>
            <button ref={buttonCance} type="button" className="btn-button button-primary" onClick={cancel}>{translate('setting.button.cancel')}</button>
            <button type="button" className="button-blue button-form-register"
              onClick={saveData}>{translate('setting.button.save')}
            </button>
          </>
        )}
      </div>
    </>
  )

}
const mapStateToProps = ({ employeesSetting: employeesSetting }: IRootState) => ({
  iDSS: employeesSetting.positionsUpdate,
  messageError: employeesSetting.errorItems,
  positions: employeesSetting,
});

const mapDispatchToProps = {
  updatePositions,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Employee);