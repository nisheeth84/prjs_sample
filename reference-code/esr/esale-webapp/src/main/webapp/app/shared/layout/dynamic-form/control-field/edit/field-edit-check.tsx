import React, { useState, useEffect, forwardRef, useRef, useImperativeHandle } from 'react';
import { ControlType } from 'app/config/constants';
import { IDynamicFieldProps } from '../interface/dynamic-field-props';
import _ from 'lodash';
import { translate } from 'react-jhipster';
import StringUtils, { forceArray, getFieldLabel } from 'app/shared/util/string-utils';
import useHandleShowFixedTip from 'app/shared/util/useHandleShowFixedTip';

type IFieldEditCheckProps = IDynamicFieldProps;

const FieldEditCheck = forwardRef((props: IFieldEditCheckProps, ref) => {

  const [checkList, setCheckList] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(false);
  const openDropdownRef = useRef(null);
  const controlRef = useRef(null);

  const { fieldInfo } = props;
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

  const initialize = (fieldValue) => {
    const itemCheckList = [];
    fieldInfo.fieldItems.map((item, idx) => {
      let isCheck = false;
      if (fieldValue) {
        let fValue = null
        try {
          fValue = _.isString(fieldValue) ? JSON.parse(fieldValue) : fieldValue
          if (!_.isArray(fValue)) {
            fValue = [fValue];
          }
        } catch {
          fValue = [];
        }
        const itemCheck = fValue.filter(e => e.toString() === item.itemId.toString());
        isCheck = itemCheck.length > 0;
      } else if (type === ControlType.ADD) {
        isCheck = item.isDefault && item.isAvailable;
      }
      itemCheckList.push({
        check: isCheck,
        itemId: item.itemId,
        itemLabel: item.itemLabel,
        itemOrder: item.itemOrder,
        isAvailable: item.isAvailable
      });
    });
    itemCheckList.sort((a, b) => { return (a.itemOrder - b.itemOrder) });
    setCheckList(itemCheckList);
    if (props.updateStateElement) {
      const checks = [];
      itemCheckList.forEach(item => {
        if (item.check) {
          checks.push(item.itemId);
        }
      });
      props.updateStateElement(makeKeyUpdateField(), type, checks);
    }
  };

  const handleUserMouseDown = (event) => {
    if (openDropdownRef.current && !openDropdownRef.current.contains(event.target)) {
      setOpenDropdown(false);
    }
  };

  useEffect(() => {
    initialize(_.get(props, 'elementStatus.fieldValue'));
    window.addEventListener('mousedown', handleUserMouseDown);
    return () => {
      window.removeEventListener('mousedown', handleUserMouseDown);
    };
  }, []);

  useEffect(() => {
    if (props.elementStatus && props.elementStatus.fieldValue && _.isArray(props.elementStatus.fieldValue)) {
      const listValue = props.elementStatus.fieldValue;
      listValue.forEach(e => {
        const idx = checkList.findIndex(o => o.itemId === e)
        if (idx >= 0) {
          checkList[idx].check = true;
        }
      });
      setCheckList(_.cloneDeep(checkList));
    }
  }, [props.elementStatus])

  useEffect(() => {
    if (props.updateStateElement && !props.isDisabled) {
      const fieldValue = [];
      checkList.forEach(item => {
        if (item.check) {
          fieldValue.push(item.itemId);
        }
      });
      props.updateStateElement(makeKeyUpdateField(), type, fieldValue);
    }
  }, [checkList]);

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

  useImperativeHandle(ref, () => ({
    resetValue() {
      checkList.forEach((e, idx) => {
        checkList[idx].check = false;
      })
    },
    setValueEdit(vals) {
      const forceVal = forceArray(vals);
      const listVal = forceVal.map(el => el.itemId || el);
      initialize(listVal);
    }
  }));

  const toggleChange = itemId => {
    const tmp = [...checkList];
    tmp.forEach((item, idx) => {
      if (item.itemId === itemId) item.check = !item.check;
    });
    setCheckList(tmp);
  };

  const getStyleClass = (attr: string) => {
    if (type === ControlType.EDIT || type === ControlType.ADD) {
      return _.get(props.fieldStyleClass, `checkBox.edit.${attr}`)
    } else if (type === ControlType.EDIT_LIST) {
      return _.get(props.fieldStyleClass, `multiSelectBox.edit.${attr}`)
    } else {
      return '';
    }
  }

  const errorItem = () => {
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
    return { style, msg }
  }

  const renderComponentEdit = () => {
    checkList.sort((a, b) => { return (a.itemOrder - b.itemOrder) });
    const checkboxClass = props.isDisabled ? 'icon-check icon-check-disable font-weight-normal' : 'icon-check d-inline-flex mr-3';
    return (
      <>
        <div className={`wrap-check no-border py-0 ${props.isCustomerIntegration ? 'mt-2' : ""}`}>
         <div className={`${getStyleClass('wrapCheckbox')} mh-auto`}>
          {checkList.filter(e => e.isAvailable).map((e, idx) => (
              <div key={idx} className="check-box-item mr-0 pt-0">
                <label key={idx} className={`${checkboxClass} ${errorItem().msg ? 'error' : ''}`}>
                <input disabled={props.isDisabled} value={e.itemId} type="checkbox" checked={e.check} onChange={() => toggleChange(e.itemId)} />
                <i></i>
                  {StringUtils.escapeSpaceHtml(getFieldLabel(e, 'itemLabel'))}
              </label>
              </div>
          ))}
        </div>
        </div>
        {errorItem().msg && <span className="messenger-error d-block">{errorItem().msg}</span>}
      </>);
  }

  const onSelectItemChange = (itemId) => {
    // setValueSelect(itemId);
    // const index = checkList.findIndex( e => e.itemId === item.itemId);
    // if (index < 0) {
    //   checkList.push(item)
    // } else {
    //   checkList.splice(index, 1);
    // }

    const tmp = [...checkList];
    tmp.forEach((item, idx) => {
      if (item.itemId === itemId) item.check = !item.check;
    });
    setCheckList(_.cloneDeep(tmp));
    // setOpenDropdown(false);
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
    const countCheck = checkList.filter(e => e.check).length;
    let textCheck = '';
    checkList.filter(e => e.check).forEach((element, index) => {
      if (index !== countCheck - 1) {
        textCheck += getFieldLabel(element, 'itemLabel') + ', ';
      } else {
        textCheck += getFieldLabel(element, 'itemLabel')
      }
    });
    const text = countCheck > 0 ? textCheck : translate('dynamic-control.placeholder.multilPulldown', { fieldLabel: getFieldLabel(fieldInfo, 'fieldLabel') });
    return (
      <div className="form-group dropdown-in-list">
        <button 
        ref={controlRef} 
        type="button" 
        className={`${type === ControlType.EDIT_LIST ? ' width-200 ' : ''} ${getStyleClass('wrapSelect')}`}
        onClick={() => {triggerCalc(); setOpenDropdown(!openDropdown);}}>
          <span className={`${getStyleClass('inputSelect')}`} style={style} >{text}</span>
        </button>
          {!props.isDisabled && openDropdown &&
            <div className={`drop-down fix-hightlight-scroll overflow-auto max-height-200 ${(type === ControlType.EDIT_LIST && !_.isEmpty(customStyle)) ? ' width-200 ' : ''}`} ref={openDropdownRef} style={{...customStyle}}>
            <ul className={`d-table w100`}>
              {fieldInfo.fieldItems.filter(e => e.isAvailable).map((e, idx) =>
                <li key={idx} className={`d-table-row item ${checkList.filter(p => p.itemId === e.itemId && p.check).length > 0 ? 'active' : ''}`}
                  onSelect={() => onSelectItemChange(e.itemId)}
                  onClick={() => onSelectItemChange(e.itemId)}
                >
                    <div>{StringUtils.escapeSpaceHtml(getFieldLabel(e, 'itemLabel'))}</div>
                </li>
              )}
            </ul>
            </div>
          }
          {!openDropdown && msg && <span className="messenger-error d-block word-break-all">{msg}</span>}
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
})

export default FieldEditCheck
