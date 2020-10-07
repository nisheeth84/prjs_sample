import React, { useState, useRef, useEffect } from 'react'
import ItemTableColorEmployee from './item-table-color-employee'
import { EmployeesType, EquipmentTypesType } from '../../models/get-local-navigation-type'
import { translate } from 'react-jhipster';
import styled from 'styled-components';
import {truncateString} from '../../modal/details/calendar-modal-information';

type IItemEmployeeControlSidebar = {
    emp?: EmployeesType
    resource?: EquipmentTypesType
    onChangeItem: (obj, item, type) => void;
    onRemove: (id,type) => void
    onChangeColor?: (obj, employee,type) => void
    onChosenOnlyItem?: (id,type) => void
    onShowSetting?: () => void
    show?: (boolean) => void
    type?: any
}

/**
 * render item show employee in local navigation
 * @param props 
 */
const ItemEmployeeControlSideBar = (props: IItemEmployeeControlSidebar) => {
    const { emp } = props
    const [showSetting, setShowSetting] = useState(false);
    const [setting, setSetting] = useState(false);

    const chosenColor = (color) => {
        props.onChangeColor(color, props.emp, props.type)
    }
    const wrapperRef = useRef(null);

    const handleClickOutside = (event) => {
        if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
            setSetting(false);
        }
    }

    useEffect(() => {
        document.addEventListener('click', handleClickOutside, false);
        return () => {
            document.removeEventListener('click', handleClickOutside, false);
        };
    }, []);

    const StyleTagI = styled.i(() => `&&&&& {
        background-color: ${emp.color} !important;
        border-color: ${emp.color} !important;
    }`);

    return (
        <>
            {emp && <li key={emp.employeeId} className={ setting ? "action-change-color" : ""} 
            onMouseOver={() => { setShowSetting(true); props.show(true) }}  
            onMouseLeave={() => { setShowSetting(false); setSetting(false); props.show(false) }}>
                <label className="icon-check">
                    <input type="checkbox" name="" className={`${emp.color ? emp.color : ""} color-0`} checked={emp.isSelected === 1} value={emp.employeeId} onChange={(obj) => props.onChangeItem(obj, emp, props.type)} />
                    <StyleTagI></StyleTagI>
                    {truncateString(emp.employeeName, 6)}
                </label>
                {showSetting &&
                    <div className="change-color">
                        <a className="change-color-image" title="" onClick={() => { setSetting(true); props.onShowSetting && props.onShowSetting() }} >
                            <img src="../../../content/images/common/ic-sort-blue.svg" alt="" title="" className="sort-blue"/>
                        </a>
                        {setting &&
                            (
                                <div className="box-select-option box-select-option-popup box-select-employee">
                                    <ul>
                                        <li>
                                            <a className="text-ellipsis mw-180-px" title="" onClick={() => { props.onChosenOnlyItem(emp.employeeId, props.type)}}>
                                               {translate('calendars.controls.sidebarMenu.chooseOnlyEmployee')} 
                                                {/* この社員のみ表示 */}
                                            </a>
                                        </li>
                                        <li>
                                        <a className="text-ellipsis mw-180-px" title="" onClick={() => { props.onRemove(emp.employeeId, props.type) }}>
                                                {translate('calendars.controls.sidebarMenu.removeEmployee')} 
                                                {/* この社員を除外 */}
                                            </a>
                                        </li>
                                    </ul>
                                    <ItemTableColorEmployee selectedValue={emp.color} chosenColor={chosenColor} />
                                </div>
                            )
                        }
                    </div>
                }
            </li>}
        </>
    )
}

export default ItemEmployeeControlSideBar;