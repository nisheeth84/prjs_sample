import React, { useState, useRef, useEffect } from 'react';
import { Storage, translate } from 'react-jhipster';
import _ from 'lodash';
import { getValueProp } from 'app/shared/util/entity-utils';
import { DEPARTMENT_REGIST_EDIT_SCREEN } from 'app/modules/employees/constants';

export interface IBeautyPullDownProps {
    showLabel: any
    data: any
    isErrors?: boolean
    isDisabled?: boolean
    isRequired?: boolean
    value?: any
    errorInfo?: { rowId, item, errorCode, errorMsg, params: {} }
    updateStateField: (itemEditValue) => void
    tabIndex?: number
    rowIndex?: number
    departmentId?: any;
    className?: any
    multiSelected?: boolean
    placehoder?: any
    listSelected?: any
    classNameBtn?: string
    zIndex?: any,
    defaultBlank?: any
}

const BeautyPullDown = (props: IBeautyPullDownProps) => {

    const [showItems, setShowItems] = useState(false);
    const [valueSelect, setValueSelect] = useState(null);
    const [departments, setDepartments] = useState([]);
    const { showLabel, data } = props;

    const wrapperRef = useRef(null);

    const getFieldLabel = (item, fieldLabel) => {
        const lang = Storage.session.get('locale', "ja_jp");
        if (item && Object.prototype.hasOwnProperty.call(item, fieldLabel)) {
            try {
                const labels = _.isString(item[fieldLabel]) ? JSON.parse(item[fieldLabel]) : item[fieldLabel];
                if (labels && Object.prototype.hasOwnProperty.call(labels, lang)) {
                    return getValueProp(labels, lang);
                } else {
                    return labels;
                }
            } catch (e) {
                return item[fieldLabel];
            }
        }
        return '';
    }

    const handleClickOutside = (event) => {
        if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
            setShowItems(false);
            props.zIndex && props.zIndex(false);
        }
    }

    const buildDepartmentTree = (departmentlst) => {
        const departmentList = _.cloneDeep(departmentlst);
        if (departmentList === null || departmentList.length <= 0) {
            return departmentList;
        }
        // Map<Long, DepartmentsDTO>
        const departmentMap = {};
        departmentList.forEach(dto => {
            departmentMap[dto.itemId] = dto;
        });
        // List<DepartmentsDTO>
        const departmentTree = [];
        departmentList.forEach(dto => {
            if (dto.itemParentId !== null) {
                const pDto = departmentMap[dto.itemParentId];
                if (pDto !== undefined) {
                    let childList = pDto.departmentChild;
                    if (childList === undefined) {
                        childList = [];
                    }
                    childList.push(dto);
                    pDto.departmentChild = childList;
                } else {
                    departmentTree.push(dto);
                }
            } else {
                departmentTree.push(dto);
            }
        });
        if(props && props.defaultBlank){
            const objFirst = {isAvailable: null,isDefault: null,itemId: null, itemLabel: translate("employees.department.department-regist-edit.form.parentId.default"), itemOrder: null, itemParentId: null, updatedDate: null}
            return [objFirst, ...departmentTree];
        }
        return departmentTree;
    }

    useEffect(() => {
        if (data.fieldName === "employee_departments") {
            const buildRes = buildDepartmentTree(data.fieldItems);
            setDepartments(buildRes);
        }
        setValueSelect(props.value);
        document.addEventListener('click', handleClickOutside, false);
        return () => {
            document.removeEventListener('click', handleClickOutside, false);
        };
    }, []);

    useEffect(() => {
        if (data.fieldName === DEPARTMENT_REGIST_EDIT_SCREEN) {
            const buildRes = buildDepartmentTree(data.fieldItems);
            setDepartments(buildRes);
            setValueSelect(props.value);
            document.addEventListener('click', handleClickOutside, false);
            return () => {
                document.removeEventListener('click', handleClickOutside, false);
            };
        }
    }, [data]);

    useEffect(() => {
        if(props.value){
            setValueSelect(props.value);
        }
    }, [props.value])

    useEffect(() => {
        if (props.updateStateField && !props.isDisabled) {
            props.updateStateField(valueSelect);
        }
    }, [valueSelect]);

    const handleItemClick = (val) => {
        setShowItems(false);
        props.zIndex && props.zIndex(false);
        if (!props.isDisabled) {
            setValueSelect(val);
        }
    }

    const getDisplayItem = (key) => {
        if (key) {
            const indexOfValue = data.fieldItems.map(function (e) { return e.itemId; }).indexOf(key);
            if (indexOfValue >= 0) {
                const label = getFieldLabel(data.fieldItems[indexOfValue], 'itemLabel');
                return label;
            }
        }
        const msgCode = (data.fieldName === 'employee_departments' || data.fieldName === DEPARTMENT_REGIST_EDIT_SCREEN) ? 'department-placehoder' : 'position-placehoder';
        return translate(`employees.create-edit.${msgCode}`);
    }

    const renderDepartmentTree = (department, isDisabled?) => {
        const childs = department.departmentChild !== undefined ? department.departmentChild : null;
        let isDisabledDepartment = isDisabled || false;
        if (department.itemId === props.departmentId) {
            isDisabledDepartment = true;
        }
        return (
            <>
                {props.listSelected ? <li>
                    <div className={`d-flex item position-relative ${props.listSelected && props.listSelected.includes(department.itemId) ? 'disable' : ''}`} onClick={() => handleItemClick(department.itemId)}>
                        <a className="d-block w-100"><span className="text-ellipsis w-100">{getFieldLabel(department, 'itemLabel')}</span></a>
                    </div>
                    {childs && <ul>
                        {childs.map(child => renderDepartmentTree(child))}
                    </ul>}
                </li> : <li className={isDisabledDepartment ? 'disable' : ''}>
                    <div className={`d-flex item position-relative ${isDisabledDepartment ? 'disable' : ''}`} onClick={isDisabledDepartment ? null : () => handleItemClick(department.itemId)}>
                        <a className={'d-block w-100 ' + isDisabledDepartment && props && props.multiSelected ? 'disable' : ''}><span className="text-ellipsis w-100">{getFieldLabel(department, 'itemLabel')}</span></a>
                    </div>
                    {childs && <ul>
                        {childs.map(child => renderDepartmentTree(child, isDisabledDepartment))}
                    </ul>}
                </li>}
            </>
        );
    }

    // const style = {};
    // if (props.errorInfo) {
    //     style['backgroundColor'] = '#ffdedd';
    //     style['color'] = '#fa5151';
    //     style['borderColor'] = '#fa5151';
    // }
    let msg = null;
    if (props.errorInfo) {
        if (props.errorInfo.errorCode) {
            msg = translate(`messages.${props.errorInfo.errorCode}`, props.errorInfo.params);
            if (props.errorInfo && props.errorInfo.rowId && props.errorInfo.rowId > 0) {
                msg = translate(`messages.${props.errorInfo.errorCode}`, { 0: props.errorInfo['errorLength'] })
            }
        } else if (props.errorInfo.errorMsg) {
            msg = props.errorInfo.errorMsg;
        }
    }
    const selectedIndex = data.fieldItems.findIndex(e => e.itemId === valueSelect);

    const renderPulldown = () => {
        if (data.fieldName === "employee_departments" || data.fieldName === DEPARTMENT_REGIST_EDIT_SCREEN) {
            return (
                <div className="drop-down-scroll-horizon drop-down drop-down2 max-height-300 ">
                    <ul className="list-group">
                        {departments.map(node =>
                            <>
                                {renderDepartmentTree(node)}
                            </>
                        )}
                    </ul>
                </div>
            );
        } else {
            return (
                <>
                    <ul className="drop-down drop-down2 max-height-300 " >
                        {data.fieldItems.map((e, idx) => (
                            <>
                                {
                                    idx === 0 && props && props.defaultBlank ? <li className="item smooth" key={'defaultBlank'} onClick={() => handleItemClick(null)}><div className="text text2" >{props.defaultBlank}</div></li> : null
                                }
                                <li className={`item ${selectedIndex === idx ? 'active' : ''} smooth ${props.listSelected && props.listSelected.includes(e.itemId) ? 'disable' : ''}`} key={e.itemId} onClick={() => handleItemClick(e.itemId)}>
                                    <div className="text text2" >{getFieldLabel(e, 'itemLabel')}</div>
                                </li>
                            </>
                        ))}
                    </ul>
                </>
            );
        }
    }

    const renderComponent = () => {
        if (data.fieldName === DEPARTMENT_REGIST_EDIT_SCREEN) {
            return (
                <>
                    <div className={`${props.className ? props.className : 'col-lg-6 form-group'}`} ref={wrapperRef}>
                        {!props.multiSelected ? <label>{translate('employees.department.department-regist-edit.form.parentId')}</label> : null}
                        <div className={`select-option ${props.isDisabled ? 'disable' : ''}`} tabIndex={props.tabIndex} style={props.isDisabled ? { pointerEvents: 'none' } : {}}>
                            <button type="button" className={`select-text text-left ${props.classNameBtn} ${msg ? 'error' : ''}`} onClick={() => {setShowItems(true);props.zIndex && props.zIndex(true)}}>{props.multiSelected ? props.placehoder : getDisplayItem(valueSelect)}</button>
                            {showItems && data.fieldItems && data.fieldItems.length > 0 && renderPulldown()}
                        </div>
                    </div>
                </>
            );
        } else {
            return (
                <>
                    <div className="col-lg-6 form-group mb-0" ref={wrapperRef}>
                        {showLabel && <label>{getFieldLabel(data, 'fieldLabel')}{props.isRequired && <label className="label-red">{translate('dynamic-control.require')}</label>}</label>}
                        <div className={`select-option ${props.isDisabled ? 'disable' : ''}`} tabIndex={props.tabIndex} style={props.isDisabled ? { pointerEvents: 'none' } : {}}>
                            <button type="button" className={`select-text text-left ${msg ? 'error' : ''}`} onClick={() => setShowItems(true)}>{(props && props.placehoder) ? props.placehoder : getDisplayItem(valueSelect)}</button>
                            {showItems && data.fieldItems && data.fieldItems.length > 0 && renderPulldown()}
                        </div>
                        {msg && <span className="messenger-error">{msg}</span>}
                    </div>
                </>
            );
        }
    }

    // final return
    return (
        <>
            {renderComponent()}
        </>
    );
}

export default BeautyPullDown;