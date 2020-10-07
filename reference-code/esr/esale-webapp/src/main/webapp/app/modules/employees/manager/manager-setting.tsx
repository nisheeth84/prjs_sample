import React, { useEffect, useState, useRef } from 'react';
import { Storage, translate } from 'react-jhipster';
import { connect } from 'react-redux';
import { useId } from "react-id-generator";
import { IRootState } from 'app/shared/reducers';
import {
  handleInitializeManagerModal,
  handleSetManager,
  resetManager
} from './manager-setting.reducer';
import ManagerSettingItem from './manager-setting-item';
import _ from 'lodash';
import { log } from 'util';
import DialogDirtyCheck from 'app/shared/layout/common/dialog-dirty-check';
import { Modal } from 'reactstrap';
import useEventListener from 'app/shared/util/use-event-listener';
import { ACTION_TYPES } from 'app/shared/reducers/locale';
import PopupEmployeeDetail from './../../employees/popup-detail/popup-employee-detail';


export enum FSActionTypeScreen {
  None,
  RemoveSession,
  SetSession,
  GetSession,
  CloseWindow,
}

export interface ISetManagerProps extends StateProps, DispatchProps {
  // List employee selected
  employeeIds: any,
  // event close popup
  toggleClosePopupSettingCondition: any,
  popout?: boolean,
  reloadScreen: () => void;
}

/**
 * Component for manager setting modal
 * @param props
 */
export const ManagerSetting = (props: ISetManagerProps) => {
  const { departments, managers, employees, isUpdateSuccess, errorItems } = props;
  const [settingParams, setSettingParams] = useState([]);
  const [saveSettingParams, setSaveSettingParams] = useState([]);
  const [validMsgRequired, setValidMsgRequired] = useState(null);
  const [employeeIds, setEmployeeIds] = useState([]);
  const [showModal, setShowModal] = useState(null);
  const [forceCloseWindow, setForceCloseWindow] = useState(false);
  const [openPopupEmployeeDetail, setOpenPopupEmployeeDetail] = useState(false);
  const [employeeId, setEmployeeId] = useState(0);
  const firstRef = useRef(null);
  const employeeDetailCtrlId = useId(1, "settingEmployeeDetail_")


  const updateStateSession = (mode: FSActionTypeScreen) => {
    if (mode === FSActionTypeScreen.SetSession) {
      Storage.local.set(ManagerSetting.name, {
        settingParams,
        saveSettingParams,
        validMsgRequired,
        employeeIds,
      });
    } else if (mode === FSActionTypeScreen.GetSession) {
      const saveObj = Storage.local.get(ManagerSetting.name);
      if (saveObj) {
        setSettingParams(saveObj.settingParams);
        setSaveSettingParams(saveObj.saveSettingParams);
        setValidMsgRequired(saveObj.validMsgRequired);
        setEmployeeIds(saveObj.employeeIds);
      }
    } else if (mode === FSActionTypeScreen.RemoveSession) {
      Storage.local.remove(ManagerSetting.name);
    }
  };
  /**
   * Check dirty when close the modal
   */
  const isChangeInputEdit = () => {
    return JSON.stringify(settingParams) !== JSON.stringify(saveSettingParams);
  }

  /**
   * Check dirty when close the modal
   */
  const executeDirtyCheck = async (action: () => void, cancel?: () => void) => {
    const isChange = isChangeInputEdit();
    if (isChange) {
      await DialogDirtyCheck({ onLeave: action, onStay: cancel });
    } else {
      action();
    }
  }

  /**
   * Close modal
   */
  const handleClosePopup = (isSearch) => {
    firstRef && firstRef.current && firstRef.current.blur();
    executeDirtyCheck(() => {
      props.resetManager();
      props.toggleClosePopupSettingCondition(isSearch);
    });
    event.preventDefault();
  }

  /**
   * Action update manager
   */
  const handleEventSetManager = () => {
    if (settingParams.length > 0) {
      props.handleSetManager(settingParams);
    }
  }

  const onClosePopupEmployeeDetail = () => {
    setOpenPopupEmployeeDetail(false);
  }
  /**
   * Get employee for update by departmentId
   */
  const getEmployeeUpdatesByDepartmentId = (departmentId) => {
    let employeeUpdates = [];
    departments.forEach(dep => {
      if (dep.departmentId === departmentId) {
        employeeUpdates = _.cloneDeep(dep.departmentUpdates);
      }
    })
    return employeeUpdates;
  }

  /**
   * Init screen
   */
  useEffect(() => {
    if (props.popout) {
      updateStateSession(FSActionTypeScreen.GetSession);
      setShowModal(false);
      setForceCloseWindow(false);
    } else {
      setEmployeeIds(props.employeeIds);
      setShowModal(true);
    }

    return () => {
      updateStateSession(FSActionTypeScreen.RemoveSession);
    }
  }, []);

  useEffect(() => {
    if (employeeIds && employeeIds.length > 0) {
      props.handleInitializeManagerModal(employeeIds);
    }
  }, [employeeIds]);


  /**
   * Create object for update
   */
  useEffect(() => {
    const params = [];
    departments.forEach(department => {
      const param2 = {
        departmentId: department.departmentId,
        managerId: department.managerId,
        employeeUpdates: getEmployeeUpdatesByDepartmentId(department.departmentId)
      };
      params.push(param2);
    })
    setSettingParams(params);

    if (!saveSettingParams || saveSettingParams.length === 0 || saveSettingParams[0].departmentId === null) {
      setSaveSettingParams(_.cloneDeep(params));
    }
  }, [departments]);

  // const handleBackPopup = () => {
  //   if (!showModal) {
  //     return;
  //   }
  //   if (props.popout) {
  //     updateStateSession(FSActionTypeScreen.SetSession);
  //     setForceCloseWindow(true);
  //   } else {
  //     handleClosePopup(false);
  //   }
  // }
  /**
   * Change data update
   */
  const handleEventChangeInput = (managerId, departmentIdSelected) => {
    if (settingParams.some(param => param.departmentId === departmentIdSelected)) {
      const index = settingParams.findIndex(param => param.departmentId === departmentIdSelected);
      settingParams[index] = { ...settingParams[index], ['managerId']: managerId ? Number(managerId) : null }
    } else {
      const param2 = {
        departmentId: departmentIdSelected,
        managerId: managerId ? Number(managerId) : null,
        employeeUpdates: getEmployeeUpdatesByDepartmentId(departmentIdSelected)
      };
      settingParams.push(param2);
    }
  }

  /**
   * Open employee detail
   */
  const openEmployeeDetail = (employeeIdParam) => {
    setEmployeeId(employeeIdParam);
    setOpenPopupEmployeeDetail(true);
  }

  const baseUrl = window.location.origin.toString();
  /**
   * Get icon title
   */
  const getIconFunction = () => {
    return <img className="icon-popup-big" src={baseUrl + `/content/images/ic-popup-ttle-group-user.svg`} alt="" />
  }

  /**
   * Close and clear state when update success
   */
  if (isUpdateSuccess) {
    updateStateSession(FSActionTypeScreen.RemoveSession);
    if (props.popout) {
      window.close();
    } else {
      props.resetManager();
      props.toggleClosePopupSettingCondition(false);
      const elemntCheck: HTMLElement = document.getElementsByClassName("icon-check")[0] as HTMLElement;
      elemntCheck && elemntCheck.click();
    }
    props.reloadScreen();
  }

  /**
   * Open new window
   */
  const openNewWindow = () => {
    updateStateSession(FSActionTypeScreen.SetSession);
    setShowModal(false);
    const height = screen.height * 0.8;
    const width = screen.width * 0.8;
    const left = screen.width * 0.3;
    const top = screen.height * 0.1;
    const style = `width=${width},height=${height},left=${left},top=${top}`;
    window.open(`${props.tenant}/manager-setting`, '', style.toString());
  }

  /**
   * parse error message
   */
  const parseValidateError = () => {
    const msgError = [];
    if (!errorItems || !Array.isArray(errorItems) || errorItems.length <= 0) {
      return msgError;
    }
    for (let i = 0; i < errorItems.length; i++) {
      // Check errorCode is not null then assign to the [msgError]
      if (errorItems[i].errorCode !== null) {
        const msg = `${translate('messages.' + errorItems[i].errorCode)}`;
        msgError.push({ rowId: errorItems[i].rowId, msg });
        if (validMsgRequired == null && errorItems[i].errorCode === 'ERR_COM_0013') {
          setValidMsgRequired(_.cloneDeep(msg));
        }
      }
    }
    msgError.sort((a, b) => a.rowId - b.rowId);
    return msgError;
  }

  useEffect(() => {
    if (forceCloseWindow) {
      if (props.popout) {
        window.opener.postMessage({ type: FSActionTypeScreen.CloseWindow, 'forceCloseWindow': true }, window.location.origin);
        Storage.session.set('forceCloseWindow', true);
        window.close();
      } else {
        handleClosePopup(false);
      }
    }
  }, [forceCloseWindow]);

  const onBeforeUnload = ev => {
    if (props.popout && !Storage.session.get('forceCloseWindow')) {
      window.opener.postMessage({ type: FSActionTypeScreen.CloseWindow, forceCloseWindow: false }, window.location.origin);
    }
  };

  // const onReceiveMessage = ev => {
  //   if (!props.popout) {
  //     props.toggleClosePopupSettingCondition(true);
  //   }
  // };

  if (props.popout) {
    useEventListener('beforeunload', onBeforeUnload);
  } 
  // else {
  //   useEventListener('message', onReceiveMessage);
  // }

  /**
   * Error message
   */
  const validateMsg = parseValidateError();

  const getValidateMessageItem = (rowId) => {
    if (!errorItems) {
      return ""
    }
    if (!errorItems || !Array.isArray(errorItems) || errorItems.length <= 0) {
      return "";
    }
    const idx = errorItems.findIndex(e => e.rowId === rowId)
    if (idx < 0) {
      return "";
    }
    if (errorItems[idx].errorCode !== null && errorItems[idx].errorCode === 'ERR_COM_0013') {
      const msg = `${translate('messages.' + errorItems[idx].errorCode)}`;
      if (msg) {
        return msg;
      }
    }
    return "";
  }



  const renderComponent = () => {
    return (
      <>
        <div className="modal popup-esr popup-esr4 user-popup-page popup-align-right show" id="popup-esr" aria-hidden="true">
          <div className={showModal ? "modal-dialog form-popup" : "form-popup"}>
            <div className="modal-content">
              <button type="button" className="close" data-dismiss="modal"><span className="la-icon"><i className="la la-close" /></span></button>
              <div className="modal-header">
                <div className="left">
                  <div className="popup-button-back"><a className="icon-small-primary icon-return-small disable" /><span className="text">{getIconFunction()}{translate('employees.manager.manager-setting.form.title')}</span>
                  </div>
                </div>
                <div className="right">
                  {showModal && <a className="icon-small-primary icon-link-small" onClick={openNewWindow} />}
                  {showModal && <a className="icon-small-primary icon-close-up-small line" onClick={() => handleClosePopup(false)} />}
                </div>
              </div>
              <div className="modal-body style-3">
                <div className="popup-content max-height-auto style-3">
                  <div className="user-popup-form label-regular">
                    <form id="manager-setting-form">
                      {departments && departments[0] && departments[0].departmentId !== null && departments.map((item, index) => (
                        <ManagerSettingItem key={item.departmentId}
                          validMsg={getValidateMessageItem(index)}
                          item={item}
                          employees={employees}
                          toggleChangeInput={handleEventChangeInput}
                          toggleOpenEmployeeDetail={openEmployeeDetail}
                          errorItems={errorItems}
                        />
                      ))}
                    </form>
                  </div>
                </div>
              </div>
              <div className="user-popup-form-bottom">
                <button onClick={() => handleClosePopup(false)} ref={firstRef} className="button-cancel hover">{translate('employees.manager.manager-setting.form.button.cancel')}</button>
                <button onClick={handleEventSetManager} className="button-blue">{translate('employees.manager.manager-setting.form.button.edit')}</button>
              </div>
            </div>
          </div>
        </div>
        {openPopupEmployeeDetail && (
          <PopupEmployeeDetail
            id={employeeDetailCtrlId[0]}
            showModal={true}
            employeeId={employeeId}
            listEmployeeId={[employeeId]}
            toggleClosePopupEmployeeDetail={onClosePopupEmployeeDetail}
            resetSuccessMessage={() => { }}
            openFromModal
          />
        )}
      </>
    );
  }

  if (showModal) {
    return (
      <>
        <Modal isOpen={true} fade={true} toggle={() => { }} backdrop={true} id="manager-setting" autoFocus={true} zIndex="auto">
          {renderComponent()}
        </Modal>
      </>
    );
  } else {
    if (props.popout) {
      return (
        <>
          {renderComponent()}
        </>
      );
    } else {
      return <></>;
    }
  }
};

const mapStateToProps = ({ managerSetting, applicationProfile }: IRootState) => ({
  tenant: applicationProfile.tenant,
  actionType: managerSetting.actionType,
  isUpdateSuccess: managerSetting.isUpdateSuccess,
  errorMessage: managerSetting.errorMessage,
  errorItems: managerSetting.errorItems,
  employees: managerSetting.employees,
  managers: managerSetting.managers,
  departments: managerSetting.departments,
});

const mapDispatchToProps = {
  handleInitializeManagerModal,
  handleSetManager,
  resetManager,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ManagerSetting);
