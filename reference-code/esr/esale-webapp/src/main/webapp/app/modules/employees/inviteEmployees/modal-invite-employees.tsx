import React, { useState, useEffect, useRef } from 'react';
import { translate } from 'react-jhipster';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import InviteEmployeeRow, { INPUT_TYPE } from './invite-employees-row';
import { Modal } from 'reactstrap';
import { Storage } from 'react-jhipster';
import useEventListener from 'app/shared/util/use-event-listener';
import InviteEmployeesResult from './invite-employees-result';
import DialogDirtyCheck from 'app/shared/layout/common/dialog-dirty-check';

import {
    handleGetInitializeInviteModal,
    handleInviteEmployees,
    reset
} from './invite-employees.reducer';
import _ from 'lodash';

export interface IInviteEmployeesProps extends StateProps, DispatchProps {
    tenant,
    popout?: boolean;
    toggleCloseInviteEmployees: () => void;
    backToPortal?: boolean;
}

export enum FSActionTypeScreen {
    None,
    RemoveSession,
    SetSession,
    GetSession,
    CloseWindow,
}

export const ERROR_CODE = {
    ERR_EMP_0002: 'ERR_EMP_0002',
    ERR_EMP_0004: 'ERR_EMP_0004',
    ERR_COM_0007: 'ERR_COM_0007',
    ERR_EMP_0003: 'ERR_EMP_0003',
    ERR_COM_0013: 'ERR_COM_0013',
    ERR_COM_0034: 'ERR_COM_0034',
};

const InviteEmployees = (props: IInviteEmployeesProps) => {

    const [employeeSurname, setEmployeeSurname] = useState("");
    const [employeeName, setEmployeeName] = useState("");
    const [email, setEmail] = useState("");
    const [departments, setDepartments] = useState([]);
    const [licenses, setLicenses] = useState([]);
    const [options, setOptions] = useState([]);
    const [packages, setPackages] = useState([]);

    const [numberInviteEmployees, setNumberInviteEmployees] = useState([{ employeeName: '', employeeSurname: '', email: '', departmentIds: [], subscriptionIds: [], packageIds: [], isAdmin: false, isLogin: false }]);
    const [sendedEmployeesResult, setSendedEmployeesResult] = useState([{ memberName: '', emailAddress: '' }]);

    const [forceCloseWindow, setForceCloseWindow] = useState(false);
    const [showModal, setShowModal] = useState(true);
    const [first, setFirst] = useState(false);
    const [result, setResult] = useState(false);
    const [errorItemRow, setErrorItemRow] = useState(null);
    const firstRef = useRef(null);
    const btnAddRow = useRef(null);

    const updateStateSession = (mode: FSActionTypeScreen) => {
        if (mode === FSActionTypeScreen.SetSession) {
            Storage.local.set(InviteEmployees.name, {
                employeeSurname,
                employeeName,
                email,
                departments,
                licenses,
                packages,
                numberInviteEmployees,
                first,
                result,
                sendedEmployeesResult,
            });
        } else if (mode === FSActionTypeScreen.GetSession) {
            const saveObj = Storage.local.get(InviteEmployees.name);
            if (saveObj) {
                setEmployeeSurname(saveObj.employeeSurname);
                setEmployeeName(saveObj.employeeName);
                setEmail(saveObj.email);
                setDepartments(saveObj.departments);
                setLicenses(saveObj.licenses);
                setPackages(saveObj.packages);
                setNumberInviteEmployees(saveObj.numberInviteEmployees);
                setFirst(saveObj.first);
                setResult(saveObj.result);
                setSendedEmployeesResult(saveObj.sendedEmployeesResult);
            }
        } else if (mode === FSActionTypeScreen.RemoveSession) {
            Storage.local.remove(InviteEmployees.name);
        }
    }

    useEffect(() => {
        return () => {
            props.reset();
        }
    }, []);

    useEffect(() => {
        if (props.popout) {
            updateStateSession(FSActionTypeScreen.GetSession);
            document.body.className = "wrap-employee modal-open";
            setShowModal(false);
            setForceCloseWindow(false);
        } else {
            setFirst(true);
            setShowModal(true);
        }
        return () => {
            setFirst(false);
            updateStateSession(FSActionTypeScreen.RemoveSession);
            document.body.className = document.body.className.replace('modal-open', '');
        }
    }, []);

    const isChangeInputEdit = () => {
        let isChange = true;
        for (let i = 0; i < numberInviteEmployees.length; i++) {
            if (numberInviteEmployees[i].employeeName === "" &&
                numberInviteEmployees[i].employeeSurname === "" &&
                numberInviteEmployees[i].email === "" &&
                numberInviteEmployees[i].departmentIds.length === 0 &&
                numberInviteEmployees[i].subscriptionIds.length === 0 &&
                numberInviteEmployees[i].packageIds.length === 0) {
                isChange = false;
            }
            else {
                isChange = true;
                break;
            }
        }
        return isChange;
    }

    const executeDirtyCheck = async (action: () => void, cancel?: () => void) => {
        const isChange = isChangeInputEdit();
        if (isChange) {
            await DialogDirtyCheck({ onLeave: action, onStay: cancel });
        } else {
            action();
        }
    }

    const handleClosePopup = () => {
        firstRef && firstRef.current && firstRef.current.blur();
        executeDirtyCheck(() => {
            if (!props.popout) {
                props.toggleCloseInviteEmployees();
            } else {
                window.close();
            }
        });
    };

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

    const handleBackPopup = () => {
        if (!result) {
            if (props.popout) {
                updateStateSession(FSActionTypeScreen.SetSession);
                setForceCloseWindow(true);
            } else {
                handleClosePopup();
            }
        } else {
            setResult(false);
            props.reset();
        }
    }

    const openNewWindow = () => {
        updateStateSession(FSActionTypeScreen.SetSession);
        setShowModal(false);
        const height = screen.height * 0.6;
        const width = screen.width * 0.6;
        const left = screen.width * 0.2;
        const top = screen.height * 0.2;
        const style = `width=${width},height=${height},left=${left},top=${top}`;
        window.open(`${props.tenant}/invite-employees`, '', style.toString());
    }

    const onBeforeUnload = (ev) => {
        if (props.popout && !Storage.session.get('forceCloseWindow')) {
            window.opener.postMessage({ type: FSActionTypeScreen.CloseWindow, 'forceCloseWindow': false }, window.location.origin);
        }
    };

    const onReceiveMessage = (ev) => {
        if (!props.popout) {
            if (ev.data.type === FSActionTypeScreen.CloseWindow) {
                updateStateSession(FSActionTypeScreen.GetSession);
                updateStateSession(FSActionTypeScreen.RemoveSession);
                if (ev.data.forceCloseWindow) {
                    setShowModal(true);
                } else {
                    props.toggleCloseInviteEmployees();
                }
            }
        }
    }

    if (props.popout) {
        useEventListener('beforeunload', onBeforeUnload);
    } else {
        useEventListener('message', onReceiveMessage);
    }

    const OnChangeText = (index, key, value) => {
        const values = [...numberInviteEmployees];
        if (key === INPUT_TYPE.EMPLOYEE_NAME) {
            setEmployeeName(value);
            values[index].employeeName = value;
        }
        if (key === INPUT_TYPE.EMPLOYEE_SURNAME) {
            setEmployeeSurname(value);
            values[index].employeeSurname = value;
        }
        if (key === INPUT_TYPE.EMAIL) {
            setEmail(value);
            values[index].email = value;
        }
        if (key === INPUT_TYPE.DEPARTMENT) {
            setDepartments([value]);
            values[index].departmentIds = value;
        }
        if (key === INPUT_TYPE.SUBSCRIPTION) {
            setLicenses(value);
            values[index].subscriptionIds = value;
        }
        if (key === INPUT_TYPE.IS_LOGIN) {
            setLicenses(value);
            values[index].isLogin = value;
        }
        if (key === INPUT_TYPE.IS_ADMIN) {
            setLicenses(value);
            values[index].isAdmin = value;
        }
        if (key === INPUT_TYPE.PACKAGES) {
            setOptions(value);
            values[index].packageIds = value;
        }
        setNumberInviteEmployees(values);
    }

    const addRow = () => {
        btnAddRow.current.blur();
        const values = [...numberInviteEmployees]
        values.unshift({ employeeName: '', employeeSurname: '', email: '', departmentIds: numberInviteEmployees[0].departmentIds, subscriptionIds: numberInviteEmployees[0].subscriptionIds, packageIds: numberInviteEmployees[0].packageIds, isLogin: false, isAdmin: false});
        setNumberInviteEmployees(_.cloneDeep(values));
        setErrorItemRow(null);
        // props.reset();
    }

    const removeRow = (index) => {
        if (numberInviteEmployees.length > 1) {
            const value = [...numberInviteEmployees];
            value.splice(index, 1);
            setNumberInviteEmployees(_.cloneDeep(value));
        }
    };

    const sendData = (event) => {
        _.forEach(numberInviteEmployees, (emp) => {
            emp.employeeName = emp.employeeName.trim();
            emp.employeeSurname = emp.employeeSurname.trim();
            emp.email = emp.email.trim();
        });
        props.handleInviteEmployees(numberInviteEmployees);
        event.preventDefault();

    };

    useEffect(() => {
        if (props.isSuccess) {
            setResult(true);
        }
    }, [props.isSuccess]);

    useEffect(() => {
        if (props.isSuccess) {
            setSendedEmployeesResult(props.sendedMailResults);
        }
    }, [props.sendedMailResults]);

    useEffect(() => {
        setErrorItemRow(props.errorItem);
    }, [props.errorItem]);

    const getInformationLine2 = () => {
        let packageName = '';
        let remainPackages = '';
        let informationLine2 = '';
        for (let i = 0; i < props.packages.length; i++) {
            packageName = props.packages[i].packageName;
            remainPackages = props.packages[i].remainPackages;
            informationLine2 += translate('employees.inviteEmployees.form.title.informationLine2', { packageName, remainPackages });
            if (i < props.packages.length - 1) {
                informationLine2 += "／";
            }
        }
        return informationLine2;
    }

    const finish = () => {
        if (props.popout) {
            window.close();
        } else {
            props.toggleCloseInviteEmployees();
        }
    }

    const resetErrorItem = (er) => {
        if(er){
            setErrorItemRow(null)
        }
    }

    const getNamePackagesErr = (packagesArray, id) => {
        let rs = '';
        packagesArray.map(it => {
            if(it.packageId === id){
                rs = it.packageName;
            }
        })
        return rs
    }

    const renderComponentInviteEmployees = () => {
        return (
            <div className="modal popup-esr popup-esr4 user-popup-page popup-align-right show" id="popup-esr" aria-hidden="true">
                <div className={showModal ? 'modal-dialog form-popup' : 'form-popup'}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <div className="left">
                                <div className="popup-button-back">
                                    <a className={(result || props.backToPortal) ? 'icon-small-primary icon-return-small' : 'icon-small-primary icon-return-small disable'}
                                    onClick={(result || props.backToPortal) && handleBackPopup}/>
                                    <span className="text">
                                        <img className="icon-popup-big" src="../../content/images/ic-popup-ttle-group-user.svg" alt="" />
                                        {translate('employees.inviteEmployees.form.modal.name')}
                                    </span>
                                </div>
                            </div>
                            <div className="right">
                                {showModal && <a className="icon-small-primary icon-link-small" onClick={() => openNewWindow()}/>}
                                {showModal && <a type="button" onClick={handleClosePopup} className="icon-small-primary icon-close-up-small line"/>}
                            </div>
                        </div>
                        <div className="modal-body style-3">
                            <div className="popup-content max-height-auto style-3">
                                <div className="user-popup-form label-regular">
                                    {result &&
                                        <InviteEmployeesResult
                                            data={sendedEmployeesResult}
                                        />
                                    }
                                    {!result &&
                                        <>
                                            <p>{translate('employees.inviteEmployees.form.title.inviteEmployees')}</p>
                                            <div className="block-feedback block-feedback-blue">
                                                <p>{translate('employees.inviteEmployees.form.title.informationLine1')}</p>
                                                {props.packages && props.packages[0] && props.packages[0].packageId && <p>{getInformationLine2()}</p>}
                                            </div>
                                            {props.errorMessage && props.errorMessage[0] === 'ERR_EMP_0016' &&
                                                <div className="block-feedback block-feedback-pink mt-1">
                                                    <p>{translate('employees.inviteEmployees.form.title.informationLine3')}</p>
                                                    {props.rowIds && props.rowIds.map((e, idx) => {
                                                        return (
                                                            <p key={idx}>{translate('messages.' + props.errorMessage[0], {0: props.packages && getNamePackagesErr(props.packages, e), 1: '0'})}</p>
                                                        );
                                                    })}
                                                </div>}
                                            <div className="add-row-wrap">
                                                <button className="button-add-row" ref={btnAddRow} onClick={addRow}>{translate('employees.inviteEmployees.form.button.addRow')}</button>
                                                <a><abbr title={translate('employees.inviteEmployees.form.title.tooltip')}><i className="far fa-question-circle" /></abbr></a>
                                            </div>
                                            {numberInviteEmployees.map((r, i) => (
                                                <InviteEmployeeRow
                                                    key={i}
                                                    updateStateFields={OnChangeText}
                                                    index={i}
                                                    employeeName={r.employeeName}
                                                    employeeSurname={r.employeeSurname}
                                                    email={r.email}
                                                    department={r.departmentIds}
                                                    subscription={r.subscriptionIds}
                                                    option={r.packageIds}
                                                    removeElement={removeRow}
                                                    item={errorItemRow}
                                                    numberOfEmployees={numberInviteEmployees.length}
                                                    isLogin={r.isLogin}
                                                    isAdmin={r.isAdmin}
                                                    resetErrorItem={resetErrorItem}
                                                />
                                            ))}
                                        </>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="user-popup-form-bottom">
                            {!result && <button className="button-cancel hover" ref={firstRef} onClick={handleClosePopup}>{translate('employees.inviteEmployees.form.button.cancel')}</button>}
                            {!result && <button className="button-blue" onClick={(event) => sendData(event)}>{translate('employees.inviteEmployees.form.button.ok')}</button>}
                            {result && <button className="button-blue" onClick={finish}>{translate('employees.inviteEmployees.form.button.finish')}</button>}
                        </div>

                    </div>
                </div>
            </div>
        )
    }

    if (showModal) {
        return (
            <>
                <Modal isOpen={true} fade={true} toggle={() => { }} backdrop={true} id="invite-employees" autoFocus={true} zIndex="auto">
                    {renderComponentInviteEmployees()}
                </Modal>
            </>
        );
    } else {
        if (props.popout) {
            return (
                <>
                    {renderComponentInviteEmployees()}
                </>
            );
        } else {
            return <></>;
        }
    }
}

const mapStateToProps = ({ inviteEmployees, applicationProfile }: IRootState) => ({
    tenant: applicationProfile.tenant,
    action: inviteEmployees.action,
    errorMessage: inviteEmployees.errorMessage,
    isSuccess: inviteEmployees.isSuccess,
    departments: inviteEmployees.departments,
    packages: inviteEmployees.packages,
    inviteEmployee: inviteEmployees.inviteEmployee,
    errorItem: inviteEmployees.errorItem,
    errorParams: inviteEmployees.errorParams,
    rowIds: inviteEmployees.rowIds,
    sendedMailResults: inviteEmployees.sendedMailResults,
});

const mapDispatchToProps = {
    handleGetInitializeInviteModal,
    handleInviteEmployees,
    reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
    mapStateToProps,
    mapDispatchToProps
)
    (InviteEmployees);