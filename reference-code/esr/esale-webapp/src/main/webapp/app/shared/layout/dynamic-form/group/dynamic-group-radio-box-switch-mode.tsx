import React, { useState, useEffect } from 'react';
import { useId } from "react-id-generator";
import { GROUP_MODE } from 'app/shared/layout/dynamic-form/group/constants';

/**
 * Props in Parents
 */
export interface IDynamicGroupRadioBoxSwitchModeProps {
  itemDataField: any
  isDisabled?: boolean
  isAutoList?: boolean
  handleSeclectValue: (value) => void
}

/**
 * Component Radio Box Swich Mode
 * @param props
 */
const DynamicGroupRadioBoxSwitchMode = (props: IDynamicGroupRadioBoxSwitchModeProps) => {
  const [valueRadio, setValueRadio] = useState(props.isAutoList ? GROUP_MODE.AUTO : GROUP_MODE.MANUAL);
  const { itemDataField } = props;
  const nameRadio = useId(0,'radioGroup_');
  /**
   * Handle Radio Change
   * @param event
   */
  const onRadionChange = (event) => {
    setValueRadio(event.target.value);
    props.handleSeclectValue(event.target.value)
  }

  /**
   * Effect Props isAuto List
   */
  useEffect(() => {
    if (props.isAutoList) {
      setValueRadio(props.isAutoList ? GROUP_MODE.AUTO : GROUP_MODE.MANUAL);
    }
  }, [props.isAutoList]);

  return (
    <>
      <label htmlFor="input-common">{itemDataField.fieldLabel}</label>
      <div className="wrap-check-radio">
        {itemDataField.fieldItems.map((e, idx) =>
          <p className="radio-item" key={idx}>
            <input type="radio"
              id={itemDataField.fieldName + "-" + idx.toString()}
              name={nameRadio[0] + idx.toString()}
              checked={e.itemId.toString() === valueRadio.toString()}
              onChange={onRadionChange}
              value={e.itemId}
              disabled={props.isDisabled}
            />
            <label htmlFor={itemDataField.fieldName + "-" + idx.toString()}>{e.itemLabel}</label>
          </p>
        )}
      </div>
    </>
  );
}

export default DynamicGroupRadioBoxSwitchMode
