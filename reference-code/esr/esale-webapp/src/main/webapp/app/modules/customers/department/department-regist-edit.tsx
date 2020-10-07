import React, { useEffect, useState } from 'react';
import { Storage, translate } from 'react-jhipster';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import ManagerSuggestSearch from 'app/shared/layout/common/suggestion/tag-auto-complete';
import {
    handleInitializeDepartmentModal,
    handleUpdateDepartment,
    handleCreateDepartment,
    reset
} from 'app/modules/employees/department/department-regist-edit.reducer';
import BoxMessage, { MessageType } from 'app/shared/layout/common/box-message';
import DialogDirtyCheck from 'app/shared/layout/common/dialog-dirty-check';
import { Modal } from 'reactstrap';
import useEventListener from 'app/shared/util/use-event-listener';
import { MENU_TYPE } from 'app/modules/employees/constants';
import { TagAutoCompleteType, TagAutoCompleteMode } from 'app/shared/layout/common/suggestion/constants';

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
}

/**
 * Component for show regist or edit department 
 * @param props 
 */
export const DepartmentRegistEdit = (props: IDepartmentRegistEditProps) => {
    const [showModal, setShowModal] = useState(null);
    const [departmentId, setDepartmentId] = useState(null);
    const [forceCloseWindow, setForceCloseWindow] = useState(false);
    const [departmentDto, setDepartmentDto] = useState({
        departmentId: null,
        departmentName: null,
        parentId: null,
        managerId: null,
        updatedDate: null
    });


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
     * Process dirty check
     */
    const executeDirtyCheck = async (action: () => void, cancel?: () => void) => {
        // const isChange = isChangeInputEdit();
        // if (isChange) {
        //     await DialogDirtyCheck({ onLeave: action, onStay: cancel });
        // } else {
        //     action();
        // }
    }

    /**
     * Close popup
     */
    const handleClosePopup = () => {
        props.reset();
        if (props.popout) {
            window.close();
        } else {
            event.preventDefault();
            executeDirtyCheck(() => {
                props.toggleClosePopupDepartmentRegistEdit();
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

    /**
     * Save data when change input on screen
     */
    const handleEventInput = ({ target }) => {
        const { name, value } = target;
        setDepartmentDto({ ...departmentDto, [name]: (name === 'parentId') ? (value || null) : value });
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
        }
    }, []);

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
                    <option value={item.departmentId} key={item.departmentId}>{tabIndex + item.departmentName}</option>
                    {item.departmentChild &&
                        <OptionDepartmentChild data={item.departmentChild} key={item.departmentId + item.departmentId} tabIndex={tabIndex + '\xa0\xa0\xa0\xa0'} />
                    }
                </>
            )
            ))
    }

    /**
  * Save data when suggestSearch
  */
    const onActionSelectTag = (id: any, type: TagAutoCompleteType, mode: TagAutoCompleteMode, listTag: any[]) => {
        // if (listTag && listTag[0]) {
        //     setDepartmentDto({ ...departmentDto, ["managerId"]: listTag[0].employeeId });
        //     setDepartmentManager(listTag[0]);
        // } else {
        //     setDepartmentDto({ ...departmentDto, ["managerId"]: null });
        //     setDepartmentManager(null);
        // }

    }

    /**
     * component create 所属する部署
     */
    const OptionDepartment = ({ data }) => {
        return (
            data && data.map((item) => (
                <>
                    <option value={item.departmentId} key={item.departmentId}>{item.departmentName}</option>
                    {item.departmentChild &&
                        <OptionDepartmentChild data={item.departmentChild} key={item.departmentId + item.departmentId} tabIndex={'\xa0\xa0\xa0\xa0'} />
                    }
                </>
            )
            ))
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
                                            <div className="col-lg-6 break-line form-group common">
                                                <label>{translate('employees.department.department-regist-edit.form.departmentName')}<a className="label-red">{translate('employees.department.department-regist-edit.form.required')}</a></label>
                                                <div className="input-common-wrap">
                                                    <input className="input-normal" type="text" autoFocus
                                                        placeholder={translate('employees.department.department-regist-edit.form.departmentName.placeholder')}
                                                        name="departmentName"
                                                        maxLength={50}
                                                        onChange={handleEventInput}
                                                        value={departmentDto.departmentName}
                                                    />
                                                    {/* {errorMessage &&
                                                        <span className="messenger">{errorMessage}</span>} */}
                                                </div>
                                            </div>
                                            <div className="col-lg-6 form-group">
                                                <label>{translate('employees.department.department-regist-edit.form.parentId')}</label>
                                                <div className="select-option">
                                                    <select name="parentId" onChange={handleEventInput} value={departmentDto.parentId} className="select-text">
                                                        <option value="">{translate('employees.department.department-regist-edit.form.parentId.default')}</option>
                                                        <OptionDepartment data={null} />
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-lg-6 form-group">
                                                <ManagerSuggestSearch id="managerId"
                                                    title={translate('employees.department.department-regist-edit.form.managerId')}
                                                    type={TagAutoCompleteType.Employee}
                                                    modeSelect={TagAutoCompleteMode.Single}
                                                    elementTags={null}
                                                    onActionSelectTag={onActionSelectTag}
                                                    placeholder={translate('employees.department.department-regist-edit.form.managerId.default')} />
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div className="user-popup-form-bottom">
                            <a onClick={handleClosePopup} className="button-cancel">{translate('employees.department.department-regist-edit.form.button.cancel')}</a>
                            <a onClick={handleEventUpdateDepartment} className="button-blue button-form-register ">{props.isRegist ? translate('employees.department.department-regist-edit.form.button.regist') : translate('employees.department.department-regist-edit.form.button.edit')}</a>
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
    errorMessage: departmentRegistEdit.errorMessage,
    department: departmentRegistEdit.department,
    departments: departmentRegistEdit.departments,
    tenant: applicationProfile.tenant,
});

const mapDispatchToProps = {
    handleInitializeDepartmentModal,
    handleUpdateDepartment,
    handleCreateDepartment,
    reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DepartmentRegistEdit);