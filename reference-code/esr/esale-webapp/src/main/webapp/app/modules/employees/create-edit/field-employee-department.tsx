
import React, { useState, useEffect } from 'react';
import _ from 'lodash';
// import { EMPLOYEE_SPECIAL_FIELD_NAMES as specialFName } from '../constants';
import BeautyPullDown from './beauty-pull-down';
import { translate } from 'react-jhipster';
import {  MODIFY_FLAG } from 'app/config/constants';

export const defaultEmployeeDepartments = {
    departmentId: -1,
    positionId: -1
};

export enum FieldChange {
    department,
    position
}

export interface IFieldEmployeeDepartmentProps {
    className?: string
    fieldLabel: string
    department: any
    errorDepartment?: { rowId, item, errorCode, errorMsg, params: {} }
    position: any
    errorPosition?: { rowId, item, errorCode, errorMsg, params: {} }
    employeeDepartments?: any[]
    isDisabled?: boolean
    updateStateField: (itemData, type, itemEditValue) => void
    tabIndex?: number
    disabledBtn?: boolean
}

const FieldEmployeeDepartment = (props: IFieldEmployeeDepartmentProps) => {

    const { fieldLabel, department, position } = props;
    const [employeeDepartments, setEmployeeDepartments] = useState(props.employeeDepartments.length > 0 ? props.employeeDepartments : [defaultEmployeeDepartments]);

    useEffect(() => {
        props.updateStateField(department, null, employeeDepartments);
    }, []);

    useEffect(() => {
        // employee_positions is inside employee_departments
        let newEmployeeDepartment = _.cloneDeep(employeeDepartments);
        newEmployeeDepartment = newEmployeeDepartment.map(item => {
            if(item.departmentId === -1){item.departmentId = null}
            if(item.positionId === -1){item.positionId = null}
            return item
        })
        props.updateStateField(department, department.fieldType.toString(), newEmployeeDepartment);
    }, [employeeDepartments]);

    const onDepartmentChange = (value, index) => {
        if (employeeDepartments[index] !== undefined) {
            const newData = employeeDepartments;
            newData[index].departmentId = value;
            setEmployeeDepartments(_.cloneDeep(newData));
        }
    }

    const onPositionChange = (value, index) => {
        if (employeeDepartments[index] !== undefined) {
            const newData = employeeDepartments;
            newData[index].positionId = value;
            setEmployeeDepartments(_.cloneDeep(newData));
        }
    }

    const onAddEmployeeDepartments = () => {
    if (employeeDepartments.length === 3 || props.isDisabled || props.disabledBtn) {
            return;
        }
        const newData = employeeDepartments;
        newData.push(defaultEmployeeDepartments);
        setEmployeeDepartments(_.cloneDeep(newData));
    }

    const handleDeleteItem = (i) => {
        if(employeeDepartments.length > 1){
            const newDepartment = _.cloneDeep(employeeDepartments);
            newDepartment.splice(i, 1);
            setEmployeeDepartments(newDepartment);
        }
    }

    const getErrorDepartment = (index, propsErr) => {
        if(propsErr && propsErr.rowId){
            if(propsErr['rowId'] === index){
                return propsErr
            }else{
                return null
            }
        }
        return propsErr;
    }

    return (
        <div className={props.className ? props.className :"col-lg-12 form-group"}>
            <label>{fieldLabel}</label>
            <div className="row box-border">
                {employeeDepartments.map((item, index) =>
                    <div className="mb-2 w-100 pos-rel-create-employees-department" key={index}>
                        <div className="d-inline-block w-100-calc-50">
                            <BeautyPullDown
                                showLabel={index === 0}
                                data={department}
                                value={item.departmentId}
                                errorInfo={getErrorDepartment(index, props.errorDepartment)}
                                updateStateField={(value) => onDepartmentChange(value, index)}
                                isDisabled={props.isDisabled}
                                isRequired={department.modifyFlag === MODIFY_FLAG.REQUIRED || department.modifyFlag === MODIFY_FLAG.DEFAULT_REQUIRED}
                                tabIndex={props.tabIndex}
                                rowIndex={index}
                            />
                            <BeautyPullDown
                                showLabel={index === 0}
                                data={position}
                                value={item.positionId}
                                errorInfo={getErrorDepartment(index, props.errorPosition)}
                                updateStateField={(value) => onPositionChange(value, index)}
                                isDisabled={props.isDisabled}
                                isRequired={position.modifyFlag === MODIFY_FLAG.REQUIRED || position.modifyFlag === MODIFY_FLAG.DEFAULT_REQUIRED}
                                tabIndex={props.tabIndex}
                                rowIndex={index}
                                defaultBlank={translate('employees.create-edit.position-placehoder')}
                            />
                        </div>
                        <div className="d-inline-block align-bottom mb-2">
                            <span className={`btn btn-bg-none ${employeeDepartments.length === 1 ? 'disable' : ''}`} onClick={() => handleDeleteItem(index)} ><i className="icon-small-primary icon-close-up-small"></i></span>
                        </div>
                    </div>
                )}
                <div className="col-lg-6 form-group pr-40">
                    <a onClick={onAddEmployeeDepartments}
                      className={`button-add-department-post-name mt-0 ${employeeDepartments.length === 3 || props.isDisabled || props.disabledBtn ? 'disable' : ''}`}>
                      {translate('employees.create-edit.button-add-department')}
                    </a>
                </div>
            </div>
        </div>
    );
}

export default FieldEmployeeDepartment
