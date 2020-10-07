import React, { useState, useRef, useEffect } from 'react';
import { translate } from 'react-jhipster';
import { CalendarView, VIEW_TYPE_CALENDAR } from '../constants'
// import _ from 'lodash';

export const enum TypeViewBeatyPullDown {
    TypeGridView = 1,
    TypeEquipment = 2
}

export interface IBeautyPullDownProps {
    data: any
    isErrors?: boolean
    isDisabled?: boolean
    value?: any
    modeView?: TypeViewBeatyPullDown
    errorInfo?: { rowId, item, errorCode, errorMsg, params: {} }
    className?: string
    onChangeOptionData?: (itemEditValue, value) => void,
    onChangeViewGrid?: (val: CalendarView, obj) => void,
    fromOtherServices?: boolean
}

const BeautyPullDown = (props: IBeautyPullDownProps) => {

    const [showItems, setShowItems] = useState(false);
    const [valueSelect, setValueSelect] = useState(CalendarView.Month);
    const { data } = props;

    const wrapperRef = useRef(null);
    const wrapperRefEquipment = useRef(null);

    const getFieldLabel = (item, fieldLabel) => {
        if (!item || !item[fieldLabel]) {
            return '';
        }
        return translate(item[fieldLabel]);
    }

    const handleClickOutside = (event) => {
        if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
            setShowItems(false);
        }
    }
    // const handleClickOutsideEquip = (event) => {
    //     if (wrapperRefEquipment.current && !wrapperRefEquipment.current.contains(event.target)) {
    //         setShowItems(false);
    //     }
    // }

    const getDisplayItem = (key) => {
        if (key) {
            const indexOfValue = data.fieldItems && data.fieldItems.map(function (e) { return e.itemId; }).indexOf(key);
            if (indexOfValue >= 0) {
                const label = getFieldLabel(data.fieldItems[indexOfValue], 'itemLabel');
                return label;
            }
        }
        return translate(`calendars.commons.typeView.label.month`);
    }

    useEffect(() => {
        setValueSelect(props.value);
        document.addEventListener('click', handleClickOutside, false);
        return () => {
            document.removeEventListener('click', handleClickOutside, false);
        };
    }, []);
    useEffect(() => {
        setValueSelect(props.value);
    }, [props.value]);

    const handleItemClick = (val?) => {

        setShowItems(false);
        setValueSelect(val);
    }

    const style = {};
    if (props.errorInfo) {
        style['backgroundColor'] = '#ffdedd';
        style['color'] = '#fa5151';
        style['borderColor'] = '#fa5151';
    }
    const renderPulldown = () => {
        const selectedIndex = data && data.fieldItems && data.fieldItems.findIndex(e => e.itemId === valueSelect) || CalendarView.Month;
        return (
            <div style={props.fromOtherServices && { left: 0, minWidth: 85, width: 85 }} className="box-select-option" >
                <ul>
                    {
                        data.fieldItems.map((e, idx) => {
                            if (e.itemType === VIEW_TYPE_CALENDAR.OptionSelect) {
                                return (
                                    <li className={`item ${selectedIndex === idx ? 'active' : ''} smooth`} style={selectedIndex !== idx ? { cursor: 'pointer' } : {}}
                                        key={idx}
                                        onClick={() => {
                                            if (selectedIndex !== idx) {
                                                handleItemClick(e.itemId);
                                                props.onChangeViewGrid(e.itemId, e);
                                            }
                                        }}>
                                        <div className="text text2" >{getFieldLabel(e, 'itemLabel')}</div>
                                    </li>
                                )
                            }
                            else {
                                return '';
                            }
                        })
                    }
                </ul>
                {data.fieldItems.filter(e => e.itemType === VIEW_TYPE_CALENDAR.OptionCheckBox).length > 0 && <div className="box-select-option-bottom">
                    {
                        data.fieldItems.map((e, idx) => {
                            if (e.itemType === VIEW_TYPE_CALENDAR.OptionCheckBox) {
                                return (
                                    <label key={idx} className="icon-check d-flex align-items-baseline justify-content-start">
                                        <input type="checkbox" name={e.itemValue} value={e.itemId} defaultChecked={e.itemValue > 0} onChange={(obj) => props.onChangeOptionData(obj, e)} />
                                        <i></i><p>{getFieldLabel(e, 'itemLabel')}</p>
                                    </label>)
                            }
                            else {
                                return;
                            }
                        })
                    }
                </div>}
            </div>
        );
    }

    const renderPulldownEquipment = () => {
        const selectedIndex = data && data.fieldItems && data.fieldItems.findIndex(e => e.itemId === valueSelect)
        return (
            <div className="drop-down drop-down-custom" >
                <ul className="dropdown-item style-3">
                    <li className={`item ${selectedIndex ? 'active' : ''} smooth`}>
                        <div className="text text2">{translate('calendars.form.all_categories')}</div>
                    </li>
                    {
                        data.fieldItems.map((e, idx) => {
                            return (
                                <li className={`item ${selectedIndex === idx ? 'active' : ''} smooth`} style={selectedIndex !== idx ? { cursor: 'pointer' } : {}}
                                    key={`${idx}_equip`}
                                    onClick={() => {
                                        if (selectedIndex !== idx) {
                                            handleItemClick(e.itemId);
                                        }
                                    }}>
                                    <div className="text text2" >{getFieldLabel(e, 'itemLabel')}</div>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        );
    }

    const renderModeViewGridControl = () => {
        return (
            <div className="button-pull-down-wrap" ref={wrapperRef}>
                {<label className="button-pull-down" onClick={() => setShowItems(!showItems)}>{getDisplayItem(valueSelect)}</label>}
                {showItems && data.fieldItems && data.fieldItems.length > 0 && renderPulldown()}
            </div>
        )
    }

    const renderModeEquipment = () => {
        return (
            <>
                <div className="select-option icon-blue" ref={wrapperRefEquipment} onClick={() => { setShowItems(true); console.log(data) }}>
                    <span className="select-text">
                        {translate('calendars.form.all_categories')}
                    </span>
                </div>
                {showItems && data.fieldItems && data.fieldItems.length > 0 && renderPulldownEquipment()}
            </>
        )
    }
    // final return
    if (!props.modeView || props.modeView === TypeViewBeatyPullDown.TypeGridView) {
        return (
            <>
                {renderModeViewGridControl()}
            </>
        )
    } else if (props.modeView && props.modeView === TypeViewBeatyPullDown.TypeEquipment) {
        return (
            <>
                {renderModeEquipment()}
            </>
        )
    }
}

export default BeautyPullDown;