import React, { useEffect, useState, useRef } from 'react';
import { Storage, translate } from 'react-jhipster';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import ManagerSuggestSearch from 'app/shared/layout/common/suggestion/tag-auto-complete';
import { TagAutoCompleteMode, TagAutoCompleteType, SearchType } from 'app/shared/layout/common/suggestion/constants';
import {
  handleInitializeDepartmentModal,
  handleUpdateDepartment,
  handleCreateDepartment,
  reset,
  handleGetManagerDepartment
} from './department-regist-edit.reducer';
import DialogDirtyCheck from 'app/shared/layout/common/dialog-dirty-check';
import { Modal } from 'reactstrap';
import useEventListener from 'app/shared/util/use-event-listener';
import { MENU_TYPE } from '../constants';
import BeautyPullDown from 'app/modules/employees/create-edit/beauty-pull-down';
import { DEPARTMENT_REGIST_EDIT_SCREEN } from 'app/modules/employees/constants';

export enum FSActionTypeScreen {
  None,
  RemoveSession,
  SetSession,
  GetSession,
  CloseWindow,
}

export interface IDepartmentRegistEditProps extends StateProps, DispatchProps {
  // departmentId selected
  departmentId: any;
  // Mode screen: TRUE is Regist, FALSE is Edit
  isRegist: boolean;
  // event close popup
  toggleClosePopupDepartmentRegistEdit: any;
  popout?: boolean;
  managerDepartment: any
}

/**
 * Component for show regist or edit department
 * @param props
 */
export const DepartmentRegistEdit = (props: IDepartmentRegistEditProps) => {
  const { department, departments, isUpdateSuccess, errorCode } = props;
  const [showModal, setShowModal] = useState(null);
  const [departmentId, setDepartmentId] = useState(null);
  const [forceCloseWindow, setForceCloseWindow] = useState(false);
  const firstRef = useRef(null);
  const managerSuggestSearchRef = useRef(null);
  const departmentDtoOri = {
    departmentId: null,
    departmentName: null,
    parentId: null,
    managerId: null,
    updatedDate: null
  };
  const departmentManagerOri = {
    employeeId: null,
    employeeName: null,
    employeeSurname: null
  };
  const [departmentDto, setDepartmentDto] = useState(departmentDtoOri);
  const [departmentManager, setDepartmentManager] = useState(departmentManagerOri);

  const updateStateSession = (mode: FSActionTypeScreen) => {
    if (mode === FSActionTypeScreen.SetSession) {
      Storage.local.set(DepartmentRegistEdit.name, {
        departmentId,
      });
    } else if (mode === FSActionTypeScreen.GetSession) {
      const saveObj = Storage.local.get(DepartmentRegistEdit.name);
      if (saveObj) {
        setDepartmentId(saveObj.departmentId);
      }
    } else if (mode === FSActionTypeScreen.RemoveSession) {
      Storage.local.remove(DepartmentRegistEdit.name);
    }
  };

  /**
   * Check dirty when close the modal
   */
  const isChangeInputEdit = () => {
    if (departmentDto.departmentName !== department.departmentName ||
      departmentDto.managerId !== department.managerId ||
      departmentDto.parentId !== department.parentId) {
      return true;
    }
  }

  /**
   * Process dirty check
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
   * Close popup
   */
  const handleClosePopup = () => {
    firstRef.current.focus();
    if (props.popout) {
      window.close();
    } else {
      executeDirtyCheck(() => {
        props.toggleClosePopupDepartmentRegistEdit();
        event.preventDefault();
      });
    }
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
    window.open(`${props.tenant}/department-regist-edit`, '', style.toString());
    event.preventDefault();
  }

  const tranferCurrentData = (departmentCurrent, parentId) => {
    const result = {};
    result['itemId'] = departmentCurrent.departmentId;
    result['itemLabel'] = departmentCurrent.departmentName;
    result['itemOrder'] = departmentCurrent.departmentOrder;
    result['itemParentId'] = parentId;
    return result;
  }

  useEffect(() => {
    if (props.managerDepartment && props.managerDepartment.employeeId && managerSuggestSearchRef && managerSuggestSearchRef.current ) {
      managerSuggestSearchRef.current.setTags([props.managerDepartment]);
    }
  }, [props.managerDepartment])

  useEffect(() => {
    if (props.department && props.department.manager) {
      props.handleGetManagerDepartment(props.department.managerId);
    }
  }, [props.department])

  const getArrayFromTree = (departmentArray, parentId) => {
    let resultArray = [];
    departmentArray && departmentArray.map(departmentCurrent => {
      const result = tranferCurrentData(departmentCurrent, parentId);
      resultArray.push(result);
      if (departmentCurrent.departmentChild && departmentCurrent.departmentChild.length > 0) {
        const resultChildArray = getArrayFromTree(departmentCurrent.departmentChild, departmentCurrent.departmentId);
        resultArray = [...resultArray, ...resultChildArray];
      }
    })
    return resultArray;
  }

  const convertDataBeautyPullDow = (departmentArray) => {
    const data = {};
    data['fieldName'] = DEPARTMENT_REGIST_EDIT_SCREEN;
    data['fieldItems'] = [...getArrayFromTree(departmentArray, null)];
    return data;
  }

  /**
   * Save data when change input on screen
   */
  const handleEventInput = ({ target }) => {
    const { name, value } = target;
    setDepartmentDto({ ...departmentDto, [name]: (name === 'parentId') ? (value || null) : value });
  }
  const onDepartmentChange = (value) => {
    setDepartmentDto({ ...departmentDto, ['parentId']: (value || null) });
  }

  /**
   * Save data when suggestSearch
   */
  const onActionSelectTag = (id: any, type: TagAutoCompleteType, mode: TagAutoCompleteMode, listTag: any[]) => {
    if (listTag && listTag[0]) {
      const departmentNew = departmentDto;
      departmentNew.managerId = listTag[0].employeeId;
      setDepartmentDto(departmentNew);
      setDepartmentManager(listTag[0]);
      return;
    }
    const data = {...departmentDtoOri,
      departmentId: departmentDto.departmentId,
      departmentName: departmentDto.departmentName,
      updatedDate:  departmentDto.updatedDate
    }
    setDepartmentDto({...data});
    setDepartmentManager(departmentManagerOri);
  }

  /**
   * Action regist or update department
   */
  const handleEventUpdateDepartment = () => {
    if (props.isRegist) {
      props.handleCreateDepartment(departmentDto.departmentName, departmentDto.managerId, departmentDto.parentId);
    } else {
      props.handleUpdateDepartment(departmentId, departmentDto.departmentName, departmentDto.managerId, departmentDto.parentId, departmentDto.updatedDate);
    }
  }

  /**
   * Close screen and reSearch parent screen when update success
   */
  if (isUpdateSuccess) {
    updateStateSession(FSActionTypeScreen.RemoveSession);
    if (props.popout) {
      window.close();
    } else {
      props.reset();
      props.toggleClosePopupDepartmentRegistEdit(true);
      const elementTarget = document.getElementById(`${MENU_TYPE.DEPARTMENT + "" + props.departmentId}`);
      elementTarget && elementTarget.click();
      event && event.preventDefault();
    }
  }

  /**
   * Init screen
   */
  useEffect(() => {
    if (props.popout) {
      updateStateSession(FSActionTypeScreen.GetSession);
      const saveObj = Storage.local.get(DepartmentRegistEdit.name);
      if (saveObj) {
        setDepartmentId(saveObj.departmentId);
        props.handleInitializeDepartmentModal(saveObj.departmentId);
      }
      setShowModal(false);
      setForceCloseWindow(false);
    } else {
      setDepartmentId(props.departmentId);
      props.handleInitializeDepartmentModal(props.departmentId);
      setShowModal(true);
    }

    return () => {
      updateStateSession(FSActionTypeScreen.RemoveSession);
      props.reset();
    }
  }, []);

  useEffect(() => {
    if (props.department) {
      const departmentTmp = {
        departmentId: props.department.departmentId,
        departmentName: props.department.departmentName,
        parentId: props.department.parentId,
        managerId: props.department.managerId,
        updatedDate: props.department.updatedDate
      };
      setDepartmentDto(departmentTmp);
      setDepartmentManager({
        employeeId: props.department.manager ? props.department.manager.managerId : null,
        employeeName: props.department.manager ? props.department.manager.managerName : null,
        employeeSurname: props.department.manager ? props.department.manager.managerSurname : null
      });
    }
  }, [props.department]);

  useEffect(() => {
    if (forceCloseWindow) {
      if (props.popout) {
        window.opener.postMessage({ type: FSActionTypeScreen.CloseWindow, 'forceCloseWindow': true }, window.location.origin);
        Storage.session.set('forceCloseWindow', true);
        window.close();
      } else {
        handleClosePopup();
      }
    }
  }, [forceCloseWindow]);

  const onBeforeUnload = ev => {
    if (props.popout && !Storage.session.get('forceCloseWindow')) {
      window.opener.postMessage({ type: FSActionTypeScreen.CloseWindow, forceCloseWindow: false }, window.location.origin);
    }
    props.reset();
  };

  const onReceiveMessage = ev => {
    if (!props.popout) {
      props.toggleClosePopupDepartmentRegistEdit(true);
    }
  };

  if (props.popout) {
    useEventListener('beforeunload', onBeforeUnload);
  } else {
    useEventListener('message', onReceiveMessage);
  }

  /**
   * Button back
   */
  // const handleBackPopup = () => {
  //   event.preventDefault();
  //   if (!showModal) {
  //     return;
  //   }
  //   if (props.popout) {
  //     updateStateSession(FSActionTypeScreen.SetSession);
  //     setForceCloseWindow(true);
  //   } else {
  //     handleClosePopup();
  //   }
  // }

  /**
   * component create department child
   */
  const OptionDepartmentChild = ({ data, tabIndex }) => {
    return (
      data && data.map((item) => (
        <>
          <option value={item.departmentId} key={item.departmentId} disabled={item.departmentId === props.departmentId}>{tabIndex + item.departmentName}</option>
          {item.departmentChild &&
            <OptionDepartmentChild data={item.departmentChild} key={item.departmentId + item.departmentId} tabIndex={tabIndex + '\xa0\xa0\xa0\xa0'} />
          }
        </>
      ))
    )
  }

  /**
   * component create 所属する部署
   */
  const OptionDepartment = ({ data }) => {
    return (
      data && data.map((item) => (
        <>
          <option value={item.departmentId} key={item.departmentId} disabled={item.departmentId === props.departmentId}>{item.departmentName}</option>
          {item.departmentChild &&
            <OptionDepartmentChild data={item.departmentChild} key={item.departmentId + item.departmentId} tabIndex={'\xa0\xa0\xa0\xa0'} />
          }
        </>
      ))
    )
  }

  const baseUrl = window.location.origin.toString();
  /**
   * Component get icon title
   */
  const getIconFunction = () => {
    return <img className="icon-popup-big" src={baseUrl + `/content/images/ic-popup-ttle-group-user.svg`} alt="" />
  }

  const renderComponent = () => {
    return (
      <div className="modal popup-esr popup-esr4 user-popup-page popup-align-right show" id="popup-esr" aria-hidden="true">
        <div className={showModal ? 'modal-dialog form-popup' : 'form-popup'}>
          <div className="modal-content">
            <div className="modal-header">
              <div className="left">
                <div className="popup-button-back"><a className="icon-small-primary icon-return-small disable" /><span className="text">{getIconFunction()}{props.isRegist ? translate('employees.department.department-regist-edit.form.title.regist') : translate('employees.department.department-regist-edit.form.title.edit')}</span></div>
              </div>
              <div className="right">
                {showModal && <a className="icon-small-primary icon-link-small" onClick={openNewWindow} />}
                <a className="icon-small-primary icon-close-up-small line" onClick={handleClosePopup} />
              </div>
            </div>
            <div className="modal-body style-3">
              <div className="popup-content max-height-auto style-3">
                <div className="user-popup-form">
                  <form id="department-form">
                    <div className="row break-row">
                      <div className="col-lg-6 form-group common">
                        <label>{translate('employees.department.department-regist-edit.form.departmentName')}<a className="label-red">{translate('employees.department.department-regist-edit.form.required')}</a></label>
                        <div className={errorCode ? "input-common-wrap error" : "input-common-wrap"}>
                          <input ref={firstRef} className="input-normal" type="text" autoFocus
                            placeholder={translate('employees.department.department-regist-edit.form.departmentName.placeholder')}
                            name="departmentName"
                            maxLength={50}
                            onChange={handleEventInput}
                            value={departmentDto.departmentName}
                            autoComplete="off"
                          />
                          {errorCode &&
                            <span className="messenger">{translate(`messages.${errorCode}`)}</span>}
                        </div>
                      </div>
                      <BeautyPullDown
                        showLabel={true}
                        data={convertDataBeautyPullDow(departments)}
                        value={departmentDto.parentId}
                        updateStateField={(value) => onDepartmentChange(value)}
                        isRequired={false}
                        departmentId={departmentDto.departmentId}
                        defaultBlank={translate('employees.department.department-regist-edit.form.parentId.default')}
                      />
                    </div>
                    <div className="row break-row">
                      <div className="col-lg-6 form-group">
                        <ManagerSuggestSearch
                          id="managerId"
                          ref={managerSuggestSearchRef}
                          title={translate('employees.department.department-regist-edit.form.managerId')}
                          type={TagAutoCompleteType.Employee}
                          modeSelect={TagAutoCompleteMode.Single}
                          searchType={SearchType.Employee}
                          elementTags={departmentManager && departmentManager.employeeId ? [departmentManager] : null}
                          onActionSelectTag={onActionSelectTag}
                          placeholder={translate('employees.department.department-regist-edit.form.managerId.default')}
                        />
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="user-popup-form-bottom">
              <button onClick={handleClosePopup} className="button-cancel">{translate('employees.department.department-regist-edit.form.button.cancel')}</button>
              <button onClick={handleEventUpdateDepartment} className="button-blue button-form-register ">{props.isRegist ? translate('employees.department.department-regist-edit.form.button.regist') : translate('employees.department.department-regist-edit.form.button.edit')}</button>
            </div>
          </div>
        </div>
      </div >
    );
  }

  if (showModal) {
    return (
      <>
        <Modal isOpen={true} fade={true} toggle={() => { }} backdrop={true} id="manager-setting" autoFocus={false} zIndex="auto">
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

const mapStateToProps = ({ departmentRegistEdit, applicationProfile }: IRootState) => ({
  isUpdateSuccess: departmentRegistEdit.isUpdateSuccess,
  errorCode: departmentRegistEdit.errorCode,
  department: departmentRegistEdit.department,
  departments: departmentRegistEdit.departments,
  tenant: applicationProfile.tenant,
  managerDepartment: departmentRegistEdit.managerDepartment
});

const mapDispatchToProps = {
  handleInitializeDepartmentModal,
  handleUpdateDepartment,
  handleCreateDepartment,
  reset,
  handleGetManagerDepartment
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DepartmentRegistEdit);