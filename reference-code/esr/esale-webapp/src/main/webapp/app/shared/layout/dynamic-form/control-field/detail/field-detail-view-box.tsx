import React, { useImperativeHandle, forwardRef, useRef, useState, useEffect } from 'react'
import { IDynamicFieldProps } from '../interface/dynamic-field-props';
import { Storage, translate } from 'react-jhipster';
import { DragSourceMonitor, useDrop, useDrag, DropTargetMonitor } from 'react-dnd';
import { FIELD_ITEM_TYPE_DND, DEFINE_FIELD_TYPE, DynamicControlAction } from '../../constants'
import _ from 'lodash';
import ConfirmDialog from 'app/shared/layout/dialog/confirm-dialog';
import { getFieldLabel } from 'app/shared/util/string-utils';


interface IFieldDetailViewTabProps {
  key: any
  label: string,
  fieldInfo: any
  isCurrentTab: boolean
  onChangeTab: (fieldInof) => void
  editFieldTab: (fieldInfo) => void
  deleteFieldTab: (fieldInfo) => void
  moveFieldCard?: (dropId: any, dragId: any) => void
  addFieldCard?: (fieldData, dragId: number) => void
}

const FieldDetailViewTab = (props: IFieldDetailViewTabProps) => {
  const [hovered, setHovered] = useState(false);

  const headerHoverOn = (item) => {
    setHovered(true);
  }

  const headerHoverOff = (item) => {
    setHovered(false);
  }

  const [, connectDragSource] = useDrag(
    {
      item: { type: FIELD_ITEM_TYPE_DND.MOVE_CARD, value: { fieldId: props.fieldInfo.fieldId } },
      collect: (monitor: DragSourceMonitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }
  );

  const [, connectDropTarget] = useDrop(
    {
      accept: [FIELD_ITEM_TYPE_DND.MOVE_CARD, FIELD_ITEM_TYPE_DND.ADD_CARD],
      drop(item, monitor) {
        const dropType = monitor.getItemType();
        if (dropType === FIELD_ITEM_TYPE_DND.MOVE_CARD && props.moveFieldCard) {
          props.moveFieldCard(item['value']['fieldId'], props.fieldInfo.fieldId);
        } else if (dropType === FIELD_ITEM_TYPE_DND.ADD_CARD) {
          props.addFieldCard(item['value'], props.fieldInfo.fieldId);
        }
      },
      collect: monitor => ({
        isOver: monitor.isOver(),
        isOverCurrent: monitor.isOver({ shallow: false }),
      }),
    }
  );


  return connectDragSource(connectDropTarget(
    <li key={props.key} className="nav-item"
      onMouseEnter={() => { headerHoverOn(props.fieldInfo) }}
      onMouseLeave={() => { headerHoverOff(props.fieldInfo) }}
      >
    <a onClick={() => props.onChangeTab(props.fieldInfo)} className={`nav-link delete edit ${props.isCurrentTab ? 'active': ''} `} data-toggle="tab">{props.label}</a>
      {hovered && <a onClick={() => props.editFieldTab(props.fieldInfo)} className="icon-small-primary icon-edit-small"></a>}
      {hovered && !props.fieldInfo.isDefault && <a onClick={() => props.deleteFieldTab(props.fieldInfo)} className="icon-small-primary icon-erase-small"></a>}
    </li>
  ))
};


const FieldDetailViewBox = forwardRef((props: IDynamicFieldProps, ref) => {
  // const fieldDetailRef = useRef(null)  // React.createRef()
  const [, setHoverField] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [listTab, setListTab] = useState([])
  const [listFieldTabContent, setListFieldTabContent] = useState([]);
  const [currentTab, setCurrentTab] = useState(null)
  const tableRef = useRef<HTMLTableElement>(null)

  useImperativeHandle(ref, () => ({
    resetCurrentTab(fieldId) {
      if (!fieldId || !listTab) {
        return
      }
      const idx = listTab.findIndex(e => e.fieldId === fieldId)
      if (idx >= 0) {
        setCurrentTab(listTab[idx])
      }
    }
  }));

  const [, connectDragSource] = useDrag(
    {
      item: { type: FIELD_ITEM_TYPE_DND.MOVE_CARD, value: { fieldId: props.fieldInfo.fieldId } },
      collect: (monitor: DragSourceMonitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }
  );

  const getListFieldTab = () => {
    const listFieldTab = [];
    props.listFieldInfo && props.listFieldInfo.forEach((field) => {
      if(field.fieldType.toString() === DEFINE_FIELD_TYPE.TAB || field.inTab === true) {
        listFieldTab.push(field.fieldId);
      }
    })
    return listFieldTab;
  }

  const [, connectDragTabSource] = useDrag(
    {
      item: { type: FIELD_ITEM_TYPE_DND.MOVE_CARD, value: { fieldId: getListFieldTab() } },
      collect: (monitor: DragSourceMonitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }
  );

  const [, connectDropTarget] = useDrop(
    {
      accept: [FIELD_ITEM_TYPE_DND.MOVE_CARD, FIELD_ITEM_TYPE_DND.ADD_CARD],
      drop(itemdrag, monitor) {
        const dropType = monitor.getItemType();
        if (dropType === FIELD_ITEM_TYPE_DND.MOVE_CARD && props.moveFieldCard) {
          props.moveFieldCard(itemdrag['value']['fieldId'], props.fieldInfo.fieldId);
        } else if (dropType === FIELD_ITEM_TYPE_DND.ADD_CARD) {
          props.addFieldCard(itemdrag['value'], props.fieldInfo.fieldId);
        }
      },
      collect: monitor => ({
        isOver: monitor.isOver(),
        isOverCurrent: monitor.isOver({ shallow: false }),
      }),
      hover(item: any, monitor: DropTargetMonitor) {
        if (!tableRef.current) {
          return
        }
        
        // Determine rectangle on screen
        const hoverBoundingRect = tableRef.current?.getBoundingClientRect()
        // Get vertical middle
        const hoverMiddleY =
          (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
  
        // Determine mouse position
        const clientOffset = monitor.getClientOffset()
  
        // Get pixels to the top
        const hoverClientY = clientOffset.y - hoverBoundingRect.top
        
        // Dragging downwards
        if (hoverClientY < hoverMiddleY) {
          return
        }
        // Dragging upwards
        if (hoverClientY > hoverMiddleY) {
          return
        }
      }
    }
  );

  const lang = Storage.session.get('locale', "ja_jp");
  // const getFieldLabel = (item, fieldLabel) => {
  //   const defaultLabel = '';
  //   const itemTmp = _.cloneDeep(item);
  //   if (!item || !itemTmp[fieldLabel]) {
  //     return defaultLabel;
  //   }

  //   if (((itemTmp.fieldId !== null || (item.fieldId === null && item.fieldLabel)) && _.isString(itemTmp[fieldLabel]))) {
  //     itemTmp[fieldLabel] = JSON.parse(itemTmp[fieldLabel]);
  //   }
  //   // labelOther is varible to set label. If label haven't Japanese name then used to English name. Finally, if label haven't English name then used to Chinese name
  //   let labelOther = null;
  //   if (Object.prototype.hasOwnProperty.call(itemTmp, fieldLabel)) {
  //     if (Object.prototype.hasOwnProperty.call(itemTmp[fieldLabel], lang)) {
  //       const label = itemTmp[fieldLabel][lang];
  //       if(!_.isNil(label)) {
  //         if (!_.isEmpty(label)){
  //           labelOther = label;
  //         } else {
  //           labelOther = itemTmp[fieldLabel]['en_us'];
  //           if (_.isEmpty(labelOther)){
  //             labelOther = itemTmp[fieldLabel]['zh_cn'];
  //           }
  //         }
  //         return labelOther;
  //       }
  //     }
  //   }
  //   return defaultLabel;
  // }

  const headerHoverOn = (item) => {
    if (props.isDisabled || props.fieldInfo.lookupFieldId < 0 || props.fieldInfo.lookupFieldId > 0) {
      setHovered(false);
      return
    }
    setHoverField(item)
    setHovered(true);
  }

  const headerHoverOff = (item) => {
    setHovered(false);
  }

  const editField = () => {
    if (props.onExecuteAction) {
      props.onExecuteAction(props.fieldInfo, DynamicControlAction.EDIT)
    }
  }

  const editFieldTab = (tab) => {
    if (props.onExecuteAction) {
      props.onExecuteAction(tab, DynamicControlAction.EDIT)
    }
  }

  const showConfirmDelete = async () => {
    const itemName = getFieldLabel(props.fieldInfo, 'fieldLabel');
    const result = await ConfirmDialog({
      title: (<>{translate('employees.detail.title.popupErrorMessage.delete')}</>),
      message: itemName ? translate('messages.WAR_COM_0001', { itemName }) : translate('messages.WAR_COM_00011'),
      confirmText: translate('employees.detail.title.popupErrorMessage.delete'),
      confirmClass: "button-red",
      cancelText: translate('employees.detail.label.button.cancel'),
      cancelClass: "button-cancel"
    });
    return result;
  }

  const executeDelete = async (action: () => void, cancel?: () => void) => {
    const result = await showConfirmDelete();
    if (result) {
      action();
    } else if (cancel) {
      cancel();
    }
  }

  const deleteField = (event) => {
    // props.onDeleteFields(hoverField);
    event.stopPropagation();
    if (props.onExecuteAction) {
      executeDelete(() => {
        props.onExecuteAction(props.fieldInfo, DynamicControlAction.DELETE);
      });
    }
  }

  const deleteFieldTab = (tab) => {
    // props.onDeleteFields(hoverField);
    if (props.onExecuteAction) {
      executeDelete(() => {
        props.onExecuteAction(tab, DynamicControlAction.DELETE);
      });
    }
  }

  const getStyleClass = (attr: string) => {
    return _.get(props.fieldStyleClass, `detailViewBox.${attr}`)
  }

  const renderContent = () => {
    let content = null;
    if (props.renderControlContent) {
      content = props.renderControlContent(props.fieldInfo);
      // TODO code common display
    }
    if (_.isNil(content)) {
        content = <>{props.elementStatus.fieldValue ? props.elementStatus.fieldValue : ''}</>
    }
    return content
  }

  const updateContentTab = () => {
    if (!props.listFieldInfo || _.isNil(currentTab)) {
      setListFieldTabContent([])
    } else {
      const idx = listTab.findIndex( e => e.fieldId === currentTab.fieldId)
      if (idx < 0) {
        setListFieldTabContent([])
      } else {
        let tabData = listTab[idx].tabData;
        if (!tabData) {
          tabData = []
        }
        const tmp = props.listFieldInfo.filter( e => tabData.findIndex( o => o === e.fieldId) >= 0)
        if (tmp) {
          tmp.forEach((e) => {
            e["inTab"] = true;
          })
        }
        setListFieldTabContent(tmp)
      }
    }
  }

  useEffect(() => {
    if (props.listFieldInfo) {
      setListTab(props.listFieldInfo.filter( e => e.fieldType.toString() === DEFINE_FIELD_TYPE.TAB))
    }
  }, [props.listFieldInfo])

  useEffect(() => {
    if (!listTab || listTab.length < 1) {
      return;
    }
    if (_.isNil(currentTab)) {
      setCurrentTab(listTab[0])
    } else {
      const idx = listTab.findIndex( e => e.fieldId === currentTab.fieldId)
      if (idx < 0) {
        setCurrentTab(listTab[0])
      }
    }
    updateContentTab()
  }, [listTab])

  useEffect(() => {
    updateContentTab()
  }, [currentTab])

  const onChangeTab = (tab) => {
    setCurrentTab(tab);
  } 

  const classTextRight = (props.fieldInfo.fieldType.toString() === DEFINE_FIELD_TYPE.CALCULATION 
  || props.fieldInfo.fieldType.toString() === DEFINE_FIELD_TYPE.NUMERIC) ? ' text-right' : '';

  const renderFieldElementTab = () => {
    return (
      <>
        {listTab.map((tab, idx) => {
          return <FieldDetailViewTab
                    key={idx}
                    label={getFieldLabel(tab, 'fieldLabel')}
                    fieldInfo={tab}
                    isCurrentTab={_.get(currentTab, 'fieldId') === tab.fieldId}
                    onChangeTab={onChangeTab}
                    editFieldTab={editFieldTab}
                    deleteFieldTab={deleteFieldTab}
                    addFieldCard={props.addFieldCard}
                    moveFieldCard={props.moveFieldCard}
                />
          })
        }
      </>
    )
  }

  if (props.fieldInfo.fieldType && props.fieldInfo.fieldType.toString() === DEFINE_FIELD_TYPE.TAB) {
    if(props.isDisabled) {
      return (
        <>
          <ul className="nav nav-tabs mb-0">
          {listTab.map((tab, idx) => {
            return (
              <li key={idx} className="nav-item">
                <a onClick={() => onChangeTab(tab)} className={`nav-link delete ${_.get(currentTab, 'fieldId') === tab.fieldId ? 'active':''}`} data-toggle="tab">{getFieldLabel(tab, 'fieldLabel')}</a>
              </li>
            )
          })
          }
          </ul>
          {props.renderControlContent && props.renderControlContent(listFieldTabContent)}
        </>
        )
    } else {
      return (
        <>
          {connectDragTabSource(
            <ul className="nav nav-tabs mb-0">
              {renderFieldElementTab()}
            </ul>)
          }
          {props.renderControlContent && props.renderControlContent(listFieldTabContent)}
        </>
      )
    }
  }

  if (props.isDisabled) {
    if (props.fieldInfo.fieldType.toString() === DEFINE_FIELD_TYPE.LOOKUP) {
      return <></>
    } else {
      return (
        <table className='w100'>
          <tbody>
            {props.fieldInfo.fieldType && props.fieldInfo.fieldType.toString() === DEFINE_FIELD_TYPE.TITLE &&
              <tr>
                <td colSpan={2} className={`${getStyleClass('columnFirst')} ${"detail-display-title"}`}>{getFieldLabel(props.fieldInfo, 'fieldLabel')}</td>
              </tr>
            }
            {props.fieldInfo.fieldType && props.fieldInfo.fieldType.toString() !== DEFINE_FIELD_TYPE.TITLE &&
              <tr>
                <td className={`${getStyleClass('columnFirst')} ${"detail-display-title"}`}>{getFieldLabel(props.fieldInfo, 'fieldLabel')}</td>
                <td className={classTextRight} style={{ borderWidth: '0px' }}>{renderContent()}</td>
              </tr>
            }
          </tbody>
        </table>
      )
    }
  } else {
    connectDragSource(connectDropTarget(tableRef))
    return (
      <table className='w100' ref={tableRef}
        onMouseEnter={() => { headerHoverOn(props.fieldInfo)}}
        onMouseLeave={() => { headerHoverOff(props.fieldInfo)}}
      >
      <tbody>
      {props.fieldInfo.fieldType && props.fieldInfo.fieldType.toString() === DEFINE_FIELD_TYPE.TITLE &&
        <tr className={`${props.className}`}>
          <td colSpan={2} className={`${getStyleClass('columnFirst')} ${"detail-display-title"}`} onClick={editField}>{getFieldLabel(props.fieldInfo, 'fieldLabel')}
          {hovered && !props.fieldInfo.isDefault && <a onClick={(event) => deleteField(event)} className="icon-small-primary icon-erase-small float-right" style={{ display: 'block' }}></a>}
          {/* {hovered && <a onClick={editField} className="icon-small-primary icon-edit-small float-right"></a>} */}
          </td>
        </tr>
      }
      {props.fieldInfo.fieldType && props.fieldInfo.fieldType.toString() !== DEFINE_FIELD_TYPE.TITLE &&
        <tr>
          <td className={`${getStyleClass('columnFirst')} ${"detail-display-title"} ${props.className}`} onClick={editField}>{getFieldLabel(props.fieldInfo, 'fieldLabel')}</td>
          <td  style={{ borderWidth: '0px' }} className={`${props.className} ${classTextRight}`} onClick={editField}>
          {renderContent()}
            {hovered && !props.fieldInfo.isDefault && <a onClick={(event) => deleteField(event)} className="icon-small-primary icon-erase-small float-right" style={{ display: 'block' }}></a>}
          </td>
          
        </tr>
      }
      </tbody>
    </table>
    )
  }
});

export default FieldDetailViewBox
