import React, { useState, useEffect, forwardRef, useRef, useImperativeHandle } from 'react';
import { translate } from 'react-jhipster';
import { ControlType } from 'app/config/constants';
import { IDynamicFieldProps } from '../interface/dynamic-field-props';
import _ from 'lodash';
import StringUtils, { getFieldLabel } from 'app/shared/util/string-utils';
import useHandleShowFixedTip from 'app/shared/util/useHandleShowFixedTip';

type IFieldEditSingleSelectProps = IDynamicFieldProps;

const FieldEditSingleSelect = forwardRef((props: IFieldEditSingleSelectProps, ref) => {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [valueSelect, setValueSelect] = useState('');
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
      setValueSelect('');
    },
    setValueEdit(val) {
      if (!_.isEqual(valueSelect, val)) {
        setValueSelect(_.toString(val));
      }
    }
  }));

  useEffect(() => {
    if (props.updateStateElement && !props.isDisabled) {
      const keyObject = { itemId: null, fieldId: fieldInfo.fieldId };
      if (props.elementStatus) {
        keyObject.itemId = props.elementStatus.key;
      }
      props.updateStateElement(keyObject, type, valueSelect);
    }
  }, [valueSelect])

  const handleUserMouseDown = (event) => {
    if (openDropdownRef.current && !openDropdownRef.current.contains(event.target)) {
      setOpenDropdown(false);
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

  const onSelectItemChange = (itemId) => {
    if (_.isNil(itemId)) {
      setValueSelect('');
    } else {
      setValueSelect(`${itemId}`);
    }
    setOpenDropdown(false);
  }

  const initialize = () => {
    let defaultVal = null;
    if (props.elementStatus) {
      defaultVal = props.elementStatus.fieldValue;
    } else {
      fieldInfo.fieldItems && fieldInfo.fieldItems.forEach(e => {
        if (e.isDefault && e.isAvailable) {
          defaultVal = e.itemId;
        }
      })
    }
    if (_.isNil(defaultVal)) {
      defaultVal = '';
    }
    setValueSelect(`${defaultVal}`)

    if (props.updateStateElement) {
      const keyObject = { itemId: null, fieldId: fieldInfo.fieldId };
      if (props.elementStatus) {
        keyObject.itemId = props.elementStatus.key;
      }
      props.updateStateElement(keyObject, type, defaultVal);
    }
  };

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

  const getStyleClass = (attr: string) => {
    return _.get(props.fieldStyleClass, `singleSelectBox.edit.${attr}`)
  }

  /**
   * handle key down or key up to choose item in pulldown
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

    // Enter
    if (event.keyCode === 13) {
      setOpenDropdown(!openDropdown);
    }

    // Down
    if (event.keyCode === 40) {
      if (!_.isEmpty(valueSelect)) {
        const indexOfDefault = lstDropdown.indexOf(valueSelect);
        if (indexOfDefault === lstDropdown.length - 1) {
          setValueSelect(lstDropdown[0]);
        } else {
          setValueSelect(lstDropdown[indexOfDefault + 1]);
        }
      } else {
        setValueSelect(lstDropdown[0]);
      }
    }

    // Up
    if (event.keyCode === 38) {
      if (!_.isEmpty(valueSelect)) {
        const indexOfDefault = lstDropdown.indexOf(valueSelect);
        if (indexOfDefault === 0) {
          setValueSelect(lstDropdown[lstDropdown.length - 1]);
        } else {
          setValueSelect(lstDropdown[indexOfDefault - 1]);
        }
      } else {
        setValueSelect(lstDropdown[lstDropdown.length - 1]);
      }
    }
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
      } else if (props.errorInfo.errorMsg) {
        msg = props.errorInfo.errorMsg;
      }
    }
    const fieldItemAfterSort = fieldInfo.fieldItems ? fieldInfo.fieldItems.sort((a, b) => {
      if (a.itemOrder && b.itemOrder) {
        return a.itemOrder - b.itemOrder;
      } else {
        return a.itemId - b.itemId;
      }
    }) : [];
    const selectedIndex = fieldItemAfterSort.findIndex(e => !_.isNil(e.itemId) && e.itemId.toString() === valueSelect);
    const text = selectedIndex >= 0 ? getFieldLabel(fieldItemAfterSort[selectedIndex], 'itemLabel') : translate('dynamic-control.placeholder.singlePulldown', { fieldLabel: getFieldLabel(fieldInfo, 'fieldLabel') });
    return (
      <>
        <button 
          ref={controlRef}
          type="button" 
          className={`${type === ControlType.EDIT_LIST ? ' width-200 ' : ''} ${getStyleClass('wrapSelect')} ${props.isDisabled ? 'disable' : ''}`} 
          onClick={() => setOpenDropdown(!openDropdown)} 
          onKeyDown={e => {e.keyCode !== 9 && keyDownHandler(e)}}
        >
          <span className={`${getStyleClass('inputSelect')} ${props.errorInfo ? 'error' : ''}`}>{text}</span>
        </button>
        {!props.isDisabled && openDropdown && (type === ControlType.EDIT ||  type === ControlType.ADD)&& 
          <ul className={`${getStyleClass('dropdownSelect')}`} ref={openDropdownRef}>
            {fieldItemAfterSort.filter(e => e.isAvailable).map((e, idx) => {
              if (e.isAvailable) {
                return (
                  <li key={idx} tabIndex={idx} className={`item ${selectedIndex === idx ? 'active' : ''} smooth`}
                    onSelect={() => onSelectItemChange(e.itemId)}
                    onClick={() => onSelectItemChange(e.itemId)}
                  >
                    {StringUtils.escapeSpaceHtml(getFieldLabel(e, 'itemLabel'))}
                  </li>
                )
              }
            })}
          </ul>
        }
        {!props.isDisabled && openDropdown && type === ControlType.EDIT_LIST &&
          <>
          <div className="drop-down fix-hightlight-scroll overflow-auto max-height-200 " ref={openDropdownRef}  style={customStyle} >
          <ul className={`d-table w100`} >
            {fieldItemAfterSort.map((e, idx) => {
              if (e.isAvailable) {
                return (
                  <li key={idx} tabIndex={idx} className={` d-table-row item ${selectedIndex === idx ? 'active' : ''}`}
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
        {!openDropdown && msg && <span className="messenger-error d-block word-break-all">{msg}</span>}
      </>
    );
  }

  const renderComponentEditList = () => {
    return <div className="form-group dropdown-in-list">{renderComponentEdit()}</div>;
  }

  const renderComponent = () => {
    if (type === ControlType.EDIT || type === ControlType.ADD ) {
      return renderComponentEdit();
    } else if (type === ControlType.EDIT_LIST) {
      return renderComponentEditList();
    }
    return <></>;
  }

  return renderComponent();
});

export default FieldEditSingleSelect
