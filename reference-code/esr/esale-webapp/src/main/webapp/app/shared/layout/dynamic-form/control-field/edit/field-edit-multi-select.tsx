import React, { useState, useEffect, forwardRef, useRef, useImperativeHandle } from 'react';
import {  translate } from 'react-jhipster';
import { ControlType } from 'app/config/constants';
import { IDynamicFieldProps } from '../interface/dynamic-field-props';
import _ from 'lodash';
import StringUtils, { getPlaceHolder, forceArray, getFieldLabel } from 'app/shared/util/string-utils';
import useHandleShowFixedTip from 'app/shared/util/useHandleShowFixedTip';

type IFieldEditMultiSelectProps = IDynamicFieldProps;

const FieldEditMultiSelect = forwardRef((props: IFieldEditMultiSelectProps, ref) => {

  const [valueSelect, setValueSelect] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [active, setActive] = useState(0);
  const [isUseKeyboard, setIsUseKeyboard] = useState(false); // Check use keyboard
  const openDropdownRef = useRef(null);
  const controlRef = useRef(null);
  const { fieldInfo } = props;
  let type = ControlType.EDIT;
  if (props.controlType) {
    type = props.controlType;
  }

  const [customStyle] = useHandleShowFixedTip({
    inputRef:controlRef,
    overlayRef: openDropdownRef,
    isFixedTip: !!props.fieldInfo?.isFixedTip
  }, [openDropdown])


  const getScrollParent = (node) => {
    if (node == null) {
      return null;
    }
    if (node.scrollHeight > node.clientHeight) {
      return node;
    } else {
      return getScrollParent(node.parentNode);
    }
  }

  useImperativeHandle(ref, () => ({
    resetValue() {
      setValueSelect([]);
    },
    setValueEdit(val) {
      if (!_.isEqual(valueSelect, val)) {
        setValueSelect(forceArray(val));
      }
    }
  }));

  const handleUserMouseDown = (event) => {
    if (openDropdownRef.current && !openDropdownRef.current.contains(event.target)) {
      setOpenDropdown(false);
    }
  };

  const parseIntString = (intString) => {
    const parsed = parseInt(intString, 10);
    if (isNaN(parsed)) { return 0; }
    return parsed;
  }

  const initialize = () => {
    // setValueSelect(defaultVal)
    if (props.updateStateElement) {
      const keyObject = { itemId: null, fieldId: fieldInfo.fieldId };
      if (props.elementStatus) {
        keyObject.itemId = props.elementStatus.key;
      }
      let itemsValue = [];
      fieldInfo.fieldItems.map((item, idx) => {
        if (props.elementStatus && props.elementStatus.fieldValue) {
          let fValue = null
          try {
            fValue = _.isString(props.elementStatus.fieldValue) ? JSON.parse(props.elementStatus.fieldValue) : props.elementStatus.fieldValue
            if (!_.isArray(fValue)) {
              fValue = [fValue]
            }
          } catch {
            fValue = []
          }
          const index = fValue.findIndex(e => e.toString() === item.itemId.toString());
          if (index >= 0) {
            itemsValue.push(_.cloneDeep(item));
          }
        } else {
          const defaultValue = fieldInfo.fieldItems ? fieldInfo.fieldItems.filter(e => e.isDefault && e.isAvailable) : [];
          itemsValue = _.cloneDeep(defaultValue);
        }
      });
      setValueSelect(itemsValue);
      const selecteds = [];
      itemsValue.forEach(item => {
        selecteds.push(parseIntString(item.itemId));
      });
      props.updateStateElement(keyObject, type, selecteds);
    }
  };

  const handleParentScroll = (event) => {
    if (type === ControlType.EDIT_LIST && openDropdownRef && openDropdownRef.current 
        && openDropdownRef.current.style.position === 'fixed') {
      const left = controlRef.current.getBoundingClientRect().left;
      const top = controlRef.current.getBoundingClientRect().top;
      const height = controlRef.current.getBoundingClientRect().height;
      const heightPcker = openDropdownRef.current.getClientRects()[0].height;
      openDropdownRef.current.style.left = `${left}px`;
      openDropdownRef.current.style.top = `${top - heightPcker - 1 - (height / 2)}px`;
    }
  }

  useEffect(() => {
    initialize();
    window.addEventListener('mousedown', handleUserMouseDown);
    if (controlRef && controlRef.current) {
      const divScroll = getScrollParent(controlRef.current);
      if (divScroll) {
        const elemDiv = document.getElementsByClassName(divScroll.className);
        if (elemDiv && elemDiv.length > 0) {
          for (let i = 0; i < elemDiv.length; i++) {
            if (elemDiv[i] === divScroll) {
              document.getElementsByClassName(divScroll.className)[i].addEventListener('scroll', handleParentScroll);
              break;
            }
          }
        }
      }
    }
    return () => {
      window.removeEventListener('mousedown', handleUserMouseDown);
      const nodeScroll = getScrollParent(controlRef.current);
      if (nodeScroll) {
        const elemNode = document.getElementsByClassName(nodeScroll.className);
        if (elemNode && elemNode.length > 0) {
          for (let i = 0; i < elemNode.length; i++) {
            if (elemNode[i] === nodeScroll) {
              document.getElementsByClassName(nodeScroll.className)[i].removeEventListener('scroll', handleParentScroll);
              break;
            }
          }
        }
      }
    }
  }, [])

  useEffect(() => {
    if (props.updateStateElement && !props.isDisabled) {
      const keyObject = { itemId: null, fieldId: fieldInfo.fieldId };
      if (props.elementStatus) {
        keyObject.itemId = props.elementStatus.key;
      }
      const fieldValue = [];
      valueSelect.forEach(item => {
          fieldValue.push(parseIntString(item.itemId));
      });
      props.updateStateElement(keyObject, type, fieldValue);
    }
  }, [valueSelect])

  const onSelectItemChange = (item) => {
    // setValueSelect(itemId);
    const index = valueSelect.findIndex(e => e.itemId === item.itemId);
    if (index < 0) {
      valueSelect.push(item)
    } else {
      valueSelect.splice(index, 1);
    }
    setValueSelect(_.cloneDeep(valueSelect));
    // setOpenDropdown(false);
  }

  const getStyleClass = (attr: string) => {
    return _.get(props.fieldStyleClass, `multiSelectBox.edit.${attr}`)
  }

  const displayText = () => {
    if (valueSelect.length > 0) {
      const text = [];
      fieldInfo.fieldItems.forEach(item => {
        if (valueSelect.filter(e => e.itemId === item.itemId).length > 0) {
          text.push(getFieldLabel(item, 'itemLabel'));
        }
      });
      return text.join(', ');
    }
    const placeholder = getPlaceHolder(fieldInfo);
    return _.isString(placeholder) ? placeholder : '';
  }

  useEffect(() => {
    initialize();
    window.addEventListener('mousemove', e => {setIsUseKeyboard(false)});
    return () => {
      window.removeEventListener('mousemove', e => {setIsUseKeyboard(false)});
    };
  }, [])

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


  /**
   * Choose item if use to key arrow
   * @param event 
   */
  const keyChooseHandler = (event) => {
    const lstValueSelect = _.cloneDeep(valueSelect);
    const fieldItemAfterSort = fieldInfo.fieldItems.sort((a, b) => { return a.itemOrder - b.itemOrder });
    if (event.keyCode === 32) {
      if (_.findIndex(valueSelect, fieldItemAfterSort[active]) >= 0) {
        lstValueSelect.splice(_.findIndex(valueSelect, fieldItemAfterSort[active]), 1);
      } else {
        lstValueSelect.push(fieldItemAfterSort[active]);
      }
      setValueSelect(lstValueSelect);
    }
  }

  /**
 * Handle key down or key up to choose item in pulldown
 * @param event 
 */
  const keyDownHandler = (event) => {
    const fieldItemAfterSortByOrder = fieldInfo.fieldItems ? fieldInfo.fieldItems.sort((x, y) => {
      if (x.itemOrder && y.itemOrder) {
        return x.itemOrder - y.itemOrder;
      } else {
        return x.itemId - y.itemId;
      }
    }) : [];
    const lstDropdown = []
    if (fieldItemAfterSortByOrder.length > 0) {
      fieldItemAfterSortByOrder.forEach(element => {
        lstDropdown.push(element.itemId.toString());
      });
    }
    if (event.keyCode === 13 || event.keyCode === 38 || event.keyCode === 40 || event.keyCode === 32) {
        setIsUseKeyboard(openDropdown);
    }
    // Enter
    if (event.keyCode === 13) {
      setOpenDropdown(!openDropdown);
      
    }
    // Down
    if (event.keyCode === 38 && active > 0) {
      setActive(active - 1);
    }

    // Up
    if (event.keyCode === 40 && active < lstDropdown.length - 1) {
      setActive(active + 1);
    }
    keyChooseHandler(event);
    event.view.event.preventDefault();
  }

  const renderComponentEdit = () => {
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
      } 
      if (props.errorInfo.errorMsg) {
        msg = props.errorInfo.errorMsg;
      }
    }
    const fieldItemAfterSort = fieldInfo.fieldItems.sort((a, b) => { return a.itemOrder - b.itemOrder });
    return (
      <>
        <button ref={controlRef}
          type="button" 
          className={`${type === ControlType.EDIT_LIST ? ' width-200 ' : ''} ${getStyleClass('wrapSelect')} ${props.isDisabled ? 'disable' : ''}`} 
          onClick={() => setOpenDropdown(!openDropdown)} 
          onKeyDown={e => { e.keyCode !== 9 && keyDownHandler(e) }}
        >
          <span className={`${getStyleClass('inputSelect')} ${props.errorInfo ? 'error' : ''}`}>{displayText()}</span>
        </button>
        {!props.isDisabled && openDropdown && (type === ControlType.EDIT || type === ControlType.ADD) &&
          <ul className={`${getStyleClass('dropdownSelect')}`} ref={openDropdownRef}>
            {fieldItemAfterSort.filter(e => e.isAvailable).map((e, idx) =>
              <li key={idx} className={`item ${valueSelect.filter(p => p.itemId === e.itemId).length > 0 ? 'active' : '' } smooth ${active === idx && isUseKeyboard ? 'focus' : ''}`}
                onSelect={() => onSelectItemChange(e)}
                onClick={() => onSelectItemChange(e)}
              >
                {StringUtils.escapeSpaceHtml(getFieldLabel(e, 'itemLabel'))}
              </li>
            )}
          </ul>
        }
        {!props.isDisabled && openDropdown && type === ControlType.EDIT_LIST &&
        <>
        <div className="drop-down fix-hightlight-scroll overflow-auto max-height-200 " ref={openDropdownRef} style={customStyle} >
          <ul className={`d-table w100`}>
            {fieldItemAfterSort.filter(e => e.isAvailable).map((e, idx) =>
              <li key={idx} className={`d-table-row item ${valueSelect.filter(p => p.itemId === e.itemId).length > 0 ? 'active' : '' } ${active === idx && isUseKeyboard ? 'focus' : ''}`}
                onSelect={() => onSelectItemChange(e)}
                onClick={() => onSelectItemChange(e)}
              >
                <div>{StringUtils.escapeSpaceHtml(getFieldLabel(e, 'itemLabel'))}</div>
              </li>
            )}
          </ul>
          </div>
          </>
        }
        {!openDropdown && msg && <span className="messenger-error d-block word-break-all">{msg}</span>}
      </>
    );
  }

  const renderComponentEditList = () => {
    return <div className="form-group dropdown-in-list">{renderComponentEdit()}</div>;
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

export default FieldEditMultiSelect
