import React, { useState, useEffect } from 'react';
import { translate } from 'react-jhipster';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import MultiDropDown from './multi-drop-down';
import BeautyPullDown from 'app/modules/employees/create-edit/beauty-pull-down';

import {
    handleGetInitializeInviteModal,
    handleInviteEmployees,
} from './invite-employees.reducer';
import {handleInitializeDepartmentModal} from '../department/department-regist-edit.reducer';
import _ from 'lodash';

export interface IInviteEmployeeRowProps extends StateProps, DispatchProps {
    employeeName: any,
    employeeSurname: any,
    email: any,
    department: any,
    subscription: any,
    option: any,
    index: number,
    item: any,
    numberOfEmployees: any,
    removeElement: (index) => void;
    updateStateFields: (index, key, value) => void;
    isLogin?: boolean;
    isAdmin?: boolean;
    resetErrorItem?: any
}

export const INPUT_TYPE = {
    EMPLOYEE_NAME: 'EMPLOYEE_NAME',
    EMPLOYEE_SURNAME: 'EMPLOYEE_SURNAME',
    EMAIL: 'EMAIL',
    DEPARTMENT: 'DEPARTMENT',
    SUBSCRIPTION: 'SUBSCRIPTION',
    PACKAGES: 'PACKAGES',
    IS_LOGIN: 'IS_LOGIN',
    IS_ADMIN: 'IS_ADMIN',
};

const ERROR_CODE = {
    ERR_EMP_0002: 'ERR_EMP_0002',
    ERR_EMP_0004: 'ERR_EMP_0004',
    ERR_COM_0007: 'ERR_COM_0007',
    ERR_EMP_0003: 'ERR_EMP_0003',
    ERR_COM_0013: 'ERR_COM_0013',
    ERR_COM_0034: 'ERR_COM_0034',
    ERR_COM_0025: 'ERR_COM_0025',
    ERR_EMP_0036: 'ERR_EMP_0036'
};
import { DEPARTMENT_REGIST_EDIT_SCREEN } from 'app/modules/employees/constants';

export const InviteEmployeeRow = (props: IInviteEmployeeRowProps) => {
    const { employeeName, employeeSurname, email, department, subscription, index, item, isLogin, isAdmin } = props;
    const { departments, packages, departmentsChild } = props;
    const [isOpen, setIsOpen] = useState(false);
    const [isSelected, setIsSelected] = useState(false);
    const [listDepartmentSelected, setListDepartmentSelected] = useState([]);
    const [stateIsLogin, setStateIsLogin] = useState(isLogin);
    const [stateIsAdmin, setStateIsAdmin] = useState(isAdmin);
    const [zIndex, setZIndex] = useState(false);
    const [zIndexP, setZIndexP] = useState(false);
    const styleError = 'input-common-wrap error';

    useEffect(() => {
        props.handleGetInitializeInviteModal();
        props.handleInitializeDepartmentModal(null);
        document.addEventListener('click', (event) => { setIsOpen(false) });
        return () => {
            document.removeEventListener('click', (event) => { setIsOpen(false) });
        }
    }, []);

    useEffect(() => {
        setListDepartmentSelected(department ? department : []);
    }, [department])

    useEffect(() => {
        setStateIsLogin(isLogin)
        setStateIsAdmin(isAdmin)
    }, [isLogin, isAdmin])


    const removeRow = (indexOfRow) => {
        props.removeElement(indexOfRow);
    }

    const onChangeInput = (indexOfRow, key, value) => {
        if (key === INPUT_TYPE.EMPLOYEE_NAME) {
            props.updateStateFields(indexOfRow, INPUT_TYPE.EMPLOYEE_NAME, value)
        }
        if (key === INPUT_TYPE.EMPLOYEE_SURNAME) {
            props.updateStateFields(indexOfRow, INPUT_TYPE.EMPLOYEE_SURNAME, value)
        }
        if (key === INPUT_TYPE.EMAIL) {
            props.updateStateFields(indexOfRow, INPUT_TYPE.EMAIL, value)
        }
        if (key === INPUT_TYPE.PACKAGES) {
            props.updateStateFields(indexOfRow, INPUT_TYPE.PACKAGES, value)
        }
        if (key === INPUT_TYPE.SUBSCRIPTION) {
            props.updateStateFields(indexOfRow, INPUT_TYPE.SUBSCRIPTION, value)
        }
        if( key === INPUT_TYPE.IS_LOGIN){
            setStateIsLogin(!stateIsLogin);
            props.updateStateFields(indexOfRow, INPUT_TYPE.IS_LOGIN, !stateIsLogin)
        }
        if( key === INPUT_TYPE.IS_ADMIN){
            setStateIsAdmin(!stateIsAdmin);
            props.updateStateFields(indexOfRow, INPUT_TYPE.IS_ADMIN, !stateIsAdmin)
        }
    }

    const hanldeSelectDepartment = (id) => {
        if(_.isNumber(id) && !listDepartmentSelected.includes(id)){
            setIsOpen(!isOpen);
            setIsSelected(!isSelected);
            setListDepartmentSelected(_.cloneDeep(listDepartmentSelected.concat(id)));
            const listDepartmentSelectedTemp = [...listDepartmentSelected];
            listDepartmentSelectedTemp.push(id);
            props.updateStateFields(index, INPUT_TYPE.DEPARTMENT, listDepartmentSelectedTemp);
        }
    }

    const handleRemoveItem = (indexOfItem, type) => {
        if (type === INPUT_TYPE.DEPARTMENT) {
            const tmpListDepartmentSelected = [...listDepartmentSelected]
            tmpListDepartmentSelected.splice(indexOfItem, 1);
            setIsSelected(!isSelected);
            props.updateStateFields(index, INPUT_TYPE.DEPARTMENT, tmpListDepartmentSelected);
            setListDepartmentSelected(_.cloneDeep(tmpListDepartmentSelected));
        }
    }

    const convertSubscription = () => {
        const dataSubscriptionTmp = [];
        packages.forEach((r) => (
            dataSubscriptionTmp.push({ id: r.packageId, name: r.packageName })
        ))
        return dataSubscriptionTmp;
    }

    const dataSubscription = convertSubscription();

    const parseValidateError = (rowIndex, rowItem) => {
        let values;
        if (props.errorMessage.includes(ERROR_CODE.ERR_EMP_0003)) {
            const lstDepartmentNotExist = [];
            props.departmentsNotExist.forEach((i) => {
                if (listDepartmentSelected.includes(parseInt(i, 10))) {
                    lstDepartmentNotExist.push(props.departments.filter(x => x.departmentId === parseInt(i, 10)).map(x => x.departmentName))
                }
            })
            values = lstDepartmentNotExist.toString();
            return values === "" ? null : translate('messages.' + ERROR_CODE.ERR_EMP_0003, { values });
        } else {
            const errorsObj = [{ rowId: null, errorItem: null, errorMsg: null, params: null }];
            for (let i = 0; i < props.errorMessage.length; i++) {
                errorsObj.push(
                    {
                        rowId: props.rowIds[i],
                        errorItem: props.errorItem[i],
                        errorMsg: props.errorMessage[i],
                        params: props.errorParams[i]
                    }
                );
            }
            const errorMsg = errorsObj.find(i => (i.rowId === rowIndex && i.errorItem === rowItem));
            if (errorMsg === undefined) {
                return null
            } else {
                if (errorMsg.errorMsg === ERROR_CODE.ERR_EMP_0004 || errorMsg.errorMsg === ERROR_CODE.ERR_EMP_0002) {
                    values = email;
                }
                if (props.errorMessage.includes(ERROR_CODE.ERR_COM_0034)) {
                    values = translate('employees.inviteEmployees.error.emailFormat').toString();
                }
                // Logic mapping data error
                if (props.errorMessage.includes(ERROR_CODE.ERR_COM_0025) && errorMsg.errorMsg === ERROR_CODE.ERR_COM_0025) {
                    const data = errorMsg.params.length > 0 ? errorMsg.params.toString() : null
                    return translate('messages.' + errorMsg.errorMsg, { 0: data });
                }
                if (errorMsg.errorMsg === ERROR_CODE.ERR_EMP_0036) {
                    return translate('messages.' + errorMsg.errorMsg, { max: 3 });
                }
                return translate('messages.' + errorMsg.errorMsg, { values });
            }
        }
    }

    const checkItemError = (itemRowError, indexRowError) => {
        const errorsItemObj = [{ rowId: null, errorItem: null, errorMsg: null }];
        for (let i = 0; i < props.errorMessage.length; i++) {
            errorsItemObj.push({ rowId: props.rowIds[i], errorItem: props.errorItem[i], errorMsg: props.errorMessage[i] });
        }
        if(item === null) return false
        return errorsItemObj.find(r => (r.rowId === indexRowError && r.errorItem === itemRowError)) !== undefined;
    }

    const tranferCurrentData = (departmentCurrent, parentId) => {
        const result = {};
        result['itemId'] = departmentCurrent.departmentId;
        result['itemLabel'] = departmentCurrent.departmentName;
        result['itemOrder'] = departmentCurrent.departmentOrder;
        result['itemParentId'] = parentId;
        return result;
      }

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

    const handleZIndex = (value) => {
        setZIndex(value);
    }

    const handleZindexPack = (value) => {
        setZIndexP(value);
    }

    const validateDepartments = parseValidateError(props.index, "employeeDepartments") || parseValidateError(props.index, "employeesDepartments");

    return (
        <table className={`${zIndex || zIndexP ? 'z-index-9' : ''} table-default`}>
            {(index === 0) ?
                <thead>
                    <tr>
                        <td />
                        <td colSpan={2}>{translate('employees.inviteEmployees.form.header.memberName')}</td>
                        <td>{translate('employees.inviteEmployees.form.header.memberEmail')} <span className="label-red">{translate('employees.inviteEmployees.form.label.red')}</span></td>
                        <td>{translate('employees.inviteEmployees.form.header.memberDepartment')} <span className="label-red">{translate('employees.inviteEmployees.form.label.red')}</span></td>
                        <td>{translate('employees.inviteEmployees.form.header.memberPackage')}</td>
                        <td className="text-center">{translate('employees.inviteEmployees.form.header.memberLogin')}</td>
                        <td className="text-center">{translate('employees.inviteEmployees.form.header.memberAdmin')}</td>
                    </tr>
                </thead>
                : null
            }
            <tbody>
                <tr>
                    <td className="text-center align-middle" rowSpan={2}>
                        <button disabled={props.numberOfEmployees < 2} className="color-333" onClick={() => {removeRow(index); props.resetErrorItem(true)}}><i className={(props.numberOfEmployees > 1) ? 'icon-small-primary icon-close-up-small' : 'icon-small-primary icon-close-up-small disable'} /></button>
                    </td>
                    <td className="align-middle w6">{translate('employees.inviteEmployees.form.label.surname')}
                        <span className="label-red">{translate('employees.inviteEmployees.form.label.red')}</span>
                    </td>
                    <td className="align-middle w15">
                        <div className={checkItemError("employeeSurname", props.index) ? styleError : null}>
                            <input type="text" className="input-normal" placeholder={translate('employees.inviteEmployees.form.placeholder.surname')}
                                onChange={(textInput) => onChangeInput(index, INPUT_TYPE.EMPLOYEE_SURNAME, textInput.target.value)} value={employeeSurname} />
                            {(item && item.includes("employeeSurname")) && <div className="messenger">{parseValidateError(props.index, "employeeSurname")}</div>}
                        </div>
                    </td>
                    <td className="w25 max-width-350" rowSpan={2}>
                        <div className={checkItemError("email", props.index) ? styleError : null}>
                            <input type="text" className="input-normal" placeholder={translate('employees.inviteEmployees.form.placeholder.email')}
                                onChange={(textInput) => onChangeInput(index, INPUT_TYPE.EMAIL, textInput.target.value)} value={email} />
                            {(item && item.includes("email")) && <div className="messenger">
                                {parseValidateError(props.index, "email")}</div>}
                        </div>
                    </td>

                    <td rowSpan={2} className="w20">
                        <div className="break-line form-group common mb-0 translatey-2">
                            <BeautyPullDown
                                className={`custom-row-invite-department`}
                                showLabel={false}
                                data={convertDataBeautyPullDow(departmentsChild)}
                                value={[]}
                                updateStateField={hanldeSelectDepartment}
                                isRequired={false}
                                placehoder={translate('employees.inviteEmployees.form.placeholder.department')}
                                multiSelected={true}
                                listSelected={listDepartmentSelected || []}
                                classNameBtn={item && validateDepartments ? 'error' : ''}
                                zIndex={handleZIndex}
                            />
                            <div className="show-wrap employee-show-wrap">
                                {(listDepartmentSelected != null) &&
                                    listDepartmentSelected.map((r, i) => (
                                        <div className="item" key={i}>
                                            <div className="text text2" title={`${departments.filter(x => x.departmentId === r).map(x => x.departmentName)}`}>
                                                {departments.filter(x => x.departmentId === r).map(x => x.departmentName)}
                                            </div>
                                            <div className="close" onClick={(event) => { event.stopPropagation(); handleRemoveItem(i, INPUT_TYPE.DEPARTMENT); }}>
                                                ×</div>
                                        </div>
                                    ))
                                }
                            </div>
                            <div className={item && validateDepartments ? styleError : null}>
                                {item && validateDepartments && <div className="messenger">
                                    {validateDepartments}</div>}
                            </div>
                        </div>
                    </td>

                    <td rowSpan={2} className=" w20 item-inner-50">
                        <MultiDropDown
                            lstData={subscription}
                            initData={dataSubscription}
                            index={props.index}
                            type={INPUT_TYPE.SUBSCRIPTION}
                            placehoder={translate('employees.inviteEmployees.form.placeholder.package')}
                            updateStateFields={onChangeInput}
                            zIndex={handleZindexPack}
                        />
                    </td>

                    <td rowSpan={2} className="text-center w10">
                        <label className="icon-check">
                            <input value={INPUT_TYPE.IS_LOGIN} type="checkbox" checked={stateIsLogin} onChange={() => onChangeInput(index, INPUT_TYPE.IS_LOGIN, INPUT_TYPE.IS_LOGIN)} />
                            <i></i>
                        </label>
                    </td>
                    <td rowSpan={2} className="text-center w5">
                        <label className="icon-check">
                            <input value={INPUT_TYPE.IS_ADMIN} type="checkbox" checked={stateIsAdmin} onChange={() => onChangeInput(index, INPUT_TYPE.IS_ADMIN, INPUT_TYPE.IS_ADMIN)} />
                            <i></i>
                        </label>
                    </td>
                </tr>
                <tr>
                    <td className="align-middle">{translate('employees.inviteEmployees.form.label.name')}</td>
                    <td className="align-middle w15">
                        <div className={checkItemError("employeeName", props.index) ? styleError : null}>
                            <input type="text" className="input-normal" placeholder={translate('employees.inviteEmployees.form.placeholder.name')}
                                onChange={(textInput) => onChangeInput(index, INPUT_TYPE.EMPLOYEE_NAME, textInput.target.value)} value={employeeName} />
                            {(item && item.includes("employeeName")) && <div className="messenger">{parseValidateError(props.index, "employeeName")}</div>}
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    )
}

const mapStateToProps = ({ inviteEmployees, departmentRegistEdit }: IRootState) => ({
    action: inviteEmployees.action,
    errorMessage: inviteEmployees.errorMessage,
    isSuccess: inviteEmployees.isSuccess,
    departments: inviteEmployees.departments,
    departmentsChild: departmentRegistEdit.departments,
    subscriptions: inviteEmployees.subscriptions,
    packages: inviteEmployees.packages,
    inviteEmployee: inviteEmployees.inviteEmployee,
    errorItem: inviteEmployees.errorItem,
    errorParams: inviteEmployees.errorParams,
    rowIds: inviteEmployees.rowIds,
    sendedMailResults: inviteEmployees.sendedMailResults,
    departmentsNotExist: inviteEmployees.departmentsNotExist,
});

const mapDispatchToProps = {
    handleGetInitializeInviteModal,
    handleInitializeDepartmentModal,
    handleInviteEmployees,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
    mapStateToProps,
    mapDispatchToProps
)
    (InviteEmployeeRow);