import React, { useState, useEffect, forwardRef } from 'react';
import { Storage, translate } from 'react-jhipster';
import { useId } from "react-id-generator";
import _ from 'lodash';
import { IDynamicFieldProps } from '../interface/dynamic-field-props';
import { getFieldLabel } from 'app/shared/util/string-utils';

type IFieldSearchRadioProps = IDynamicFieldProps

const FieldSearchRadio = forwardRef((props: IFieldSearchRadioProps, ref) => {
  const [isSearchBlank, setIsSearchBlank] = useState(false);
  const [checkList, setCheckList] = useState([]);
  const idRadioList = useId(2, "checkbox_radio_");

  const { fieldInfo } = props;
  const nameRadio = useId(2, "radioGroup_");

  const initialize = () => {
    if (props.elementStatus && props.elementStatus.isSearchBlank !== null) {
      setIsSearchBlank(props.elementStatus.isSearchBlank)
    }
    const itemCheckList = [];
    fieldInfo.fieldItems.map((item, idx) => {
      let isCheck = false;
      if (props.elementStatus && props.elementStatus.fieldValue) {
        const itemCheck = props.elementStatus.fieldValue.filter(e => e.toString() === item.itemId.toString());
        isCheck = itemCheck.length > 0;
      }
      itemCheckList.push({ check: isCheck, itemId: item.itemId, itemLabel: item.itemLabel });
    });
    setCheckList(itemCheckList);
  };

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    if (props.updateStateElement && !props.isDisabled) {
      const fieldValue = [];
      checkList.forEach(item => {
        if (item.check) {
          fieldValue.push(item.itemId.toString());
        }
      });
      const conditions = {};
      conditions['fieldId'] = fieldInfo.fieldId;
      conditions['fieldType'] = fieldInfo.fieldType;
      conditions['isDefault'] = fieldInfo.isDefault;
      conditions['fieldName'] = fieldInfo.fieldName;
      conditions['isSearchBlank'] = isSearchBlank;
      conditions['fieldValue'] = fieldValue;
      // conditions['searchType'] = SEARCH_TYPE.LIKE;
      // conditions['searchOption'] = SEARCH_OPTION.WORD;
      props.updateStateElement(fieldInfo, fieldInfo.fieldType, conditions)
    }
  }, [isSearchBlank, checkList])


  const toggleChange = itemId => {
    const tmp = [...checkList];
    tmp.forEach((item, idx) => {
      if (item.itemId === itemId) item.check = !item.check;
    });
    setCheckList(tmp);
  };

  const getStyleClass = (attr: string) => {
    return _.get(props.fieldStyleClass, `radioBox.search.${attr}`);
  }

  const renderComponent = () => {
    return (
      <>
        <div className="wrap-check">
          <div className="wrap-check-radio">
            <p className="radio-item">
              <input disabled={props.isDisabled} type="radio" id={idRadioList[0]} name={nameRadio[0]} checked={!isSearchBlank} value='1' onChange={() => setIsSearchBlank(false)} />
              <label htmlFor={idRadioList[0]}>{translate('dynamic-control.fieldDetail.layoutCheckBox.radio.showItem')}</label>
            </p>
            <p className="radio-item">
              <input disabled={props.isDisabled} type="radio" id={idRadioList[1]} name={nameRadio[0]} checked={isSearchBlank} value='0' onChange={() => setIsSearchBlank(true)} />
              <label htmlFor={idRadioList[1]}>{translate('dynamic-control.fieldDetail.layoutCheckBox.radio.notShowItem')}</label>
            </p>
          </div>
          {!isSearchBlank && (
            <div>
              <div className={`${getStyleClass('wrapRadio')}`}>
                {checkList.map((e, idx) => (
                  <p className="radio-item normal" key={idx}>
                    <input disabled={props.isDisabled} value={e.itemId} type="radio" defaultChecked={e.check} onChange={() => toggleChange(e.itemId)} name={nameRadio[1]} id={"checkbox_radio_" + idx} />
                    <label htmlFor={"checkbox_radio_" + idx}>{getFieldLabel(e, 'itemLabel')}</label>
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      </>
    );
  }

  return (
    <>{renderComponent()}</>
  );
});

export default FieldSearchRadio
