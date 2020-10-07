import React, { useState, useEffect, forwardRef, useRef, useImperativeHandle } from 'react';
import { useId } from "react-id-generator";
import { ControlType } from 'app/config/constants';
import { IDynamicFieldProps } from '../interface/dynamic-field-props';
import _ from 'lodash';
import { translate } from 'react-jhipster';
import StringUtils, { getFieldLabel } from 'app/shared/util/string-utils';
import useHandleShowFixedTip from 'app/shared/util/useHandleShowFixedTip';

type IFieldEditRadioProps = IDynamicFieldProps;

const FieldEditRadio = forwardRef((props: IFieldEditRadioProps, ref) => {

  const [valueRadio, setValueRadio] = useState('');
  const [openDropdown, setOpenDropdown] = useState(false);
  const controlRef = useRef(null);

  const { fieldInfo } = props;
  const nameRadio = useId(1, "radioGroup_");

  const openDropdownRef = useRef(null);

  let type = ControlType.EDIT;
  if (props.controlType) {
    type = props.controlType;
  }

  const makeKeyUpdateField = () => {
    const keyObject = { itemId: null, fieldId: fieldInfo.fieldId };
    if (props.elementStatus) {
      keyObject.itemId = props.elementStatus.key;
    }
    return keyObject;
  }

  const handleUserMouseDown = (event) => {
    if (openDropdownRef.current && !openDropdownRef.current.contains(event.target)) {
      setOpenDropdown(false);
    }
  };

  const initialize = () => {
    if (props.elementStatus && props.elementStatus.fieldValue) {
      const fieldValue = props.elementStatus.fieldValue;
      setValueRadio(fieldValue);
    } else if (props.fieldInfo.fieldItems && props.fieldInfo.fieldItems.length > 0) {
      props.fieldInfo.fieldItems.forEach ((item) => {
        if (item.isDefault && item.isAvailable){
          setValueRadio(item.itemId.toString());
          if (props.updateStateElement) {
            const keyObject = { itemId: null, fieldId: fieldInfo.fieldId };
            if (props.elementStatus) {
              keyObject.itemId = props.elementStatus.key;
            }
            props.updateStateElement(keyObject, type, item.itemId.toString());
          }
        }
      })
    }
  };

  useEffect(() => {
    initialize();
    window.addEventListener('mousedown', handleUserMouseDown);
    return () => {
      window.removeEventListener('mousedown', handleUserMouseDown);
    };
  }, []);

  useEffect(() => {
    if (type === ControlType.EDIT_LIST && openDropdown && controlRef && controlRef.current && openDropdownRef && openDropdownRef.current) {
      const left = controlRef.current.getBoundingClientRect().left;
      const top = controlRef.current.getBoundingClientRect().top;
      const width = controlRef.current.getBoundingClientRect().width;
      const height = controlRef.current.getBoundingClientRect().height;
      const heightPcker = openDropdownRef.current.getClientRects()[0].height;
      const space = window.innerHeight - (top + height);
      if (space < heightPcker) {
        openDropdownRef.current.style.left = `${left}px`;
        openDropdownRef.current.style.top = `${top - heightPcker - 1 - (height / 2)}px`;
        openDropdownRef.current.style.setProperty('width', `${width - 20}px`, 'important')
        openDropdownRef.current.style.position = 'fixed';
      }
    }
  }, [openDropdown])

  // useEffect(() => {
  //   if (props.elementStatus && props.elementStatus.fieldValue && !_.isEqual(valueRadio, props.elementStatus.fieldValue)) {
  //     setValueRadio(props.elementStatus.fieldValue);
  //   }
  // }, [props.elementStatus])

  useEffect(() => {
    let typeUpdate = ControlType.EDIT;
    if (type === ControlType.ADD) {
      typeUpdate = ControlType.ADD;
    }
    if (props.updateStateElement && !props.isDisabled) {
      props.updateStateElement(makeKeyUpdateField(), typeUpdate , valueRadio)
    }
  }, [valueRadio])

  useImperativeHandle(ref, () => ({
    resetValue() {
      setValueRadio(null);
    },
    setValueEdit(val) {
      if (!_.isEqual(valueRadio, val)) {
        setValueRadio(val);
      }
    }
  }));

  const onRadionChange = (event) => {
    setValueRadio(event.target.value);
  }

  const getStyleClass = (attr: string) => {
    if (type === ControlType.EDIT || type === ControlType.ADD) {
      return _.get(props.fieldStyleClass, `radioBox.edit.${attr}`);
    } else {
      return _.get(props.fieldStyleClass, `singleSelectBox.edit.${attr}`);
    }
  }

  const errorrItem = () => {
    const style = {};
    style['whiteSpace'] = 'nowrap';
    if (props.errorInfo) {
      style['backgroundColor'] = '#ffdedd';
      style['color'] = '#fa5151';
      style['borderColor'] = '#fa5151';
    }
    let msg = null;
    if (props.errorInfo) {
      if (props.errorInfo.errorCode) {
        let params = {}
        if (props.errorInfo.errorParams && Array.isArray(props.errorInfo.errorParams)) {
          props.errorInfo.errorParams.forEach((e, idx) => {
            params[`${idx}`] = e;
          });
        } else {
          params = props.errorInfo.errorParams
        }
        msg = translate(`messages.${props.errorInfo.errorCode}`, params);
      } else if (props.errorInfo.errorMsg) {
        msg = props.errorInfo.errorMsg;
      }
    }
    return {style, msg}
  }

  const renderComponentEdit = () => {
    const fieldItemsSort = fieldInfo.fieldItems.sort((a,b) => {return a.itemOrder - b.itemOrder});
    return (
      <>
      <div className={`wrap-check py-0 no-border ${props.isCustomerIntegration ? 'mt-1' : ""}`}>
        <div className={`${getStyleClass('wrapRadio')} three-check-radio mh-auto`}>
          {fieldItemsSort.filter(e => e.isAvailable).map((e, idx) =>
            <span className={`radio-item word-break-all pt-0 ${errorrItem().msg ? 'error' : ''} ${props.isDisabled ? 'radio-item-disable normal' : ''}`} key={idx}>
              <input disabled={props.isDisabled} name={nameRadio[0]} type="radio" id={nameRadio[0] + fieldInfo.fieldName + "_" + _.toString(idx)} value={e.itemId} checked={_.toString(e.itemId) === _.toString(valueRadio)} onChange={onRadionChange} />
              <label htmlFor={nameRadio[0] + fieldInfo.fieldName + "_" + idx.toString()}>{StringUtils.escapeSpaceHtml(getFieldLabel(e, 'itemLabel'))}</label>
            </span>
          )}
        </div>
        </div>
        {errorrItem().msg && <span className="messenger-error d-block">{errorrItem().msg}</span>}
      </>
    )
  }

  const onSelectItemChange = (itemId) => {
    if (_.isNil(itemId)) {
      setValueRadio('');
    } else {
      setValueRadio(`${itemId}`);
    }
    setOpenDropdown(false);
  }

  const [customStyle, triggerCalc] = useHandleShowFixedTip({
    inputRef: controlRef,
    overlayRef: openDropdownRef,
    isFixedTip: !!props.fieldInfo?.isFixedTip
  })
  
  const renderComponentEditList = () => {
    const style = {};
    if (props.errorInfo) {
      style['backgroundColor'] = '#ffdedd';
      style['color'] = '#fa5151';
      style['borderColor'] = '#fa5151';
    }
    let msg = null;
    if (props.errorInfo) {
      if (props.errorInfo.errorCode) {
        let params = {}
        if (props.errorInfo.errorParams && Array.isArray(props.errorInfo.errorParams)) {
          props.errorInfo.errorParams.forEach((e, idx) => {
            params[`${idx}`] = e;
          });
        } else {
          params = props.errorInfo.errorParams
        }
        msg = translate(`messages.${props.errorInfo.errorCode}`, params);
      } else if (props.errorInfo.errorMsg) {
        msg = props.errorInfo.errorMsg;
      }
    }
    const selectedIndex = fieldInfo.fieldItems.findIndex(e => !_.isNil(e.itemId) && e.itemId.toString() === valueRadio);
    const text = selectedIndex >= 0 ? getFieldLabel(fieldInfo.fieldItems[selectedIndex], 'itemLabel') : translate('dynamic-control.placeholder.singlePulldown', { fieldLabel: getFieldLabel(fieldInfo, 'fieldLabel') });

    return (
      <div className="form-group dropdown-in-list">
        <button 
        ref={controlRef} 
        type="button" 
        className={`${getStyleClass('wrapSelect')} ${type === ControlType.EDIT_LIST ? ' width-200 ' : ''}`} 
        onClick={() => { triggerCalc(); setOpenDropdown(!openDropdown) }}>
          <span className={`${getStyleClass('inputSelect')}`} style={style}>{text}</span>
          {!props.isDisabled && openDropdown &&
          <>
          <div className={`drop-down fix-hightlight-scroll overflow-auto max-height-200 ${(type === ControlType.EDIT_LIST && !_.isEmpty(customStyle)) ? ' width-200 ' : ''}`} ref={openDropdownRef} style={{...customStyle}}>
            <ul className={`d-table w100`}>
              {fieldInfo.fieldItems.filter(e => e.isAvailable).map((e, idx) => {
                if (e.isAvailable) {
                  return (
                    <li key={idx} className={`d-table-row item ${selectedIndex === idx ? 'active' : ''}`}
                      onSelect={() => onSelectItemChange(e.itemId)}
                      onClick={() => onSelectItemChange(e.itemId)}
                    >
                      <div>{StringUtils.escapeSpaceHtml(getFieldLabel(e, 'itemLabel'))}</div>
                    </li>
                  )
                }
              })}
            </ul>
            </div>
            </>
          }
          {! openDropdown && msg && <span className="messenger-error d-block word-break-all">{msg}</span>}
        </button>
      </div>
    );
  }

  const renderComponent = () => {
    if (type === ControlType.EDIT || type === ControlType.ADD) {
      return renderComponentEdit();
    } else if (type === ControlType.EDIT_LIST) {
      return renderComponentEditList();
    }
    return <></>;
  }

  return renderComponent();
});

export default FieldEditRadio
