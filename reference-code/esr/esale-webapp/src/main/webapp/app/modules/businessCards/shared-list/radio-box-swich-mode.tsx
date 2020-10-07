import React, { useState, useEffect } from 'react';
import { useId } from "react-id-generator";
import { SHARE_LISTS_MODES } from '../constants'

export interface IRadioBoxSwichModeProps {
    itemDataField: any
    isDisabled?: boolean
    isAutoGroup?: boolean
    handleSeclectValue: (value) => void
}

const RadioBoxSwichMode = (props: IRadioBoxSwichModeProps) => {
    const [valueRadio, setValueRadio] = useState(props.isAutoGroup ? SHARE_LISTS_MODES.ADD_CONDITION_SEARCH_AUTO : SHARE_LISTS_MODES.ADD_CONDITION_SEARCH_MANUAL);
    const { itemDataField } = props;
    const nameRadio = useId(1, "radioGroup_");

    const onRadionChange = (event) => {
        setValueRadio(event.target.value);
        props.handleSeclectValue(event.target.value)
    }

    useEffect(() => {
        if (props.isAutoGroup) {
            setValueRadio(props.isAutoGroup ? SHARE_LISTS_MODES.ADD_CONDITION_SEARCH_AUTO : SHARE_LISTS_MODES.ADD_CONDITION_SEARCH_MANUAL);
        }
    }, [props.isAutoGroup]);

    return (
        <>
            <label htmlFor="input-common">{itemDataField.fieldLabel}</label>
            <div className="wrap-check-radio">
                {itemDataField.fieldItems.map((e, idx) =>
                    <p className="radio-item" key={idx}>
                        <input type="radio"
                            id={itemDataField.fieldName + "-" + idx.toString() + nameRadio[0]}
                            name={nameRadio[0]}
                            checked={e.itemId.toString() === valueRadio.toString()}
                            onChange={onRadionChange}
                            value={e.itemId}
                            disabled={props.isDisabled}
                        />
                        <label htmlFor={itemDataField.fieldName + "-" + idx.toString() + nameRadio[0]}>{e.itemLabel}</label>
                    </p>
                )}
            </div>
        </>
    );
}

export default RadioBoxSwichMode
