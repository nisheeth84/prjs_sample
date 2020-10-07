import React, { useImperativeHandle, forwardRef, useRef, useEffect, useState } from 'react'
import { IDynamicFieldProps } from '../interface/dynamic-field-props';
import { translate } from 'react-jhipster';
import { DragSourceMonitor, useDrop, useDrag, DropTargetMonitor, XYCoord, useDragLayer } from 'react-dnd';
import { FIELD_ITEM_TYPE_DND, DynamicControlAction, DEFINE_FIELD_TYPE } from '../../constants'
import _ from 'lodash';
import ConfirmDialog from 'app/shared/layout/dialog/confirm-dialog';
import { getEmptyImage } from 'react-dnd-html5-backend';
import StringUtils, { getFieldLabel } from 'app/shared/util/string-utils';

function getItemStyles(
  initialOffset: XYCoord | null,
  currentOffset: XYCoord | null,
  width: number | null,
) {
  if (!initialOffset || !currentOffset) {
    return {
      display: 'none',
    }
  }

  const { x, y } = currentOffset
  const transform = `translate(${x}px, ${y}px)`
  return {
    // minWidth: '250px',
    transform,
    WebkitTransform: transform,
    backgroundColor: 'white',
    border: '1px solid #e5e5e5',
    borderRadius: '10px',
    boxShadow: '0px 5px 15px 0px #b0afaf',
    width: `${width}px`,
  }
}

const getFieldLabelDefault = (item, fieldLabel) => {
  const defaultLabel = '';
  const itemTmp = _.cloneDeep(item);
  if (!item || !itemTmp[fieldLabel]) {
    return defaultLabel;
  }
  return StringUtils.escapeSpaceHtml(getFieldLabel(item, fieldLabel));
}

export const FieldDisplayRowDragLayer: React.FC<{}> = (props) => {
  const {
    itemType,
    isDragging,
    item,
    initialOffset,
    currentOffset
  } = useDragLayer(monitor => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging()
  }));

  const renderPreview = (p: any) => {
    let width = 0;
    if (item && item.dndPreview && item.dndPreview.size) {
      width = item.dndPreview.size.width;
    }

    return (
      <table style={getItemStyles(initialOffset, currentOffset, width)}>
        <tr>
          <td>
            {item && item.content}
            <div className="table-div-2-col">
              <div className="table-cell title-table detail-display-title" style={{ width: '200px' }} >
              {item && item.dndPreview && item.dndPreview.title}
              </div>
              <div className="table-cell">
                {item && item.dndPreview && item.dndPreview.dragPreview}
              </div>
            </div>
          </td>
        </tr>
      </table>
    )
  }

  function renderItem() {
    if (itemType === FIELD_ITEM_TYPE_DND.MOVE_CARD && !item.value.isTab && !_.isArray(item.value.fieldId)) {
        return renderPreview(item);
    } else {
        return null;
    }
  }
  if (!isDragging) {
    return null;
  }

  return (
    <div style={{ position: 'fixed', pointerEvents: 'none', zIndex: 100, left: '0', top: '0' }}>
      {renderItem()}
    </div>
  );
}

interface IFieldSettingCellProps {
  fieldSetting: any;
  isDoubleColumn?: boolean;
  isDndSplitColumn?: boolean;
  isHightlight?: boolean
  colSpan?: number
  contentCell?: (field: any, cellHeight?: number) => JSX.Element;
  renderDragPreview?: (field) => JSX.Element;
  moveFieldCard?: (dragFieldInfo: any, dropFieldInfo: any, isDoubleColumn: boolean, isLeft: boolean) => void; // callback when end drop for move order dynamic field
  addFieldCard?: (fieldData, dropId: number, isDoubleColumn: boolean, isLeft: boolean) => void; // callback when end drop for add dynamic control
  onUpdateStatusDnD?: (param: { isDraggingTab, isHoverMiddle, isDragging, isOver, canDrop, itemType }, fieldDnd: any) => void; // callback when
}

const FieldSettingCell = (props: IFieldSettingCellProps) => {
  const cellRef = useRef(null)
  const [isHoverMiddle, setIsHoverMiddle] = useState(false);
  const [isHoverLeft, setIsHoverLeft] = useState(false);
  const [isDraggingTab, setIsDraggingTab] = useState(false);

  const getSizeControl = () => {
    const size = { width: 0, height: 0 }
    if (!cellRef || !cellRef.current) {
      return size;
    }
    if (cellRef.current.getClientRects() && cellRef.current.getClientRects().length > 0) {
      size.width = cellRef.current.getClientRects()[0].width;
      size.height = cellRef.current.getClientRects()[0].height;
    }
    return size;
  }

  const renderContentCell = () => {
    if (props.contentCell) {
      return <>{props.contentCell(props.fieldSetting, getSizeControl().height)}</>
    }
    return <></>
  }

  const [{ isDragging }, connectDragSource, preview] = useDrag(
    {
      begin: (dragSourceBegin: DragSourceMonitor) => dragSourceBegin.getItem(),
      item: {
        type: FIELD_ITEM_TYPE_DND.MOVE_CARD,
        value: { fieldId: props.fieldSetting.fieldId, inTab: props.fieldSetting.inTab, fieldType: props.fieldSetting.fieldType },
        dndPreview: {
          isDoubleColumn: props.isDoubleColumn,
          title: getFieldLabelDefault(props.fieldSetting, 'fieldLabel'),
          dragPreview: props.renderDragPreview(props.fieldSetting),
          size: getSizeControl()
        }
      },
      collect: (monitor: DragSourceMonitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }
  );

  const [{ dragSource, isOver, canDrop, itemType }, connectDropTarget] = useDrop(
    {
      accept: [FIELD_ITEM_TYPE_DND.MOVE_CARD, FIELD_ITEM_TYPE_DND.ADD_CARD],
      drop(itemdrag, monitor) {
        const dropType = monitor.getItemType();
        if (dropType === FIELD_ITEM_TYPE_DND.MOVE_CARD && props.moveFieldCard) {
          props.moveFieldCard(itemdrag['value']['fieldId'], props.fieldSetting.fieldId, isHoverMiddle, isHoverLeft);
        } else if (dropType === FIELD_ITEM_TYPE_DND.ADD_CARD) {
          props.addFieldCard(itemdrag['value'], props.fieldSetting.fieldId, isHoverMiddle, isHoverLeft);
        }
      },
      collect: monitor => ({
        isOver: monitor.isOver(),
        isOverCurrent: monitor.isOver({ shallow: false }),
        canDrop: monitor.canDrop(),
        itemType: monitor.getItemType(),
        dragSource: monitor.getItem(),
      }),
      hover(item: any, monitor: DropTargetMonitor) {
        if (!cellRef.current) {
          return
        }
        if (_.toString(_.get(item, "value.fieldType")) === DEFINE_FIELD_TYPE.TITLE || _.toString(props.fieldSetting.fieldType) === DEFINE_FIELD_TYPE.TITLE) {
          setIsHoverMiddle(false)
          setIsHoverLeft(false)
        } else {
          // Determine rectangle on screen
          const hoverBoundingRect = cellRef.current?.getBoundingClientRect()
          // Get vertical middle
          // const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
          const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2
          // Determine mouse position
          const clientOffset = monitor.getClientOffset()
          // Get pixels to the top
          const hoverClientY = clientOffset.y - hoverBoundingRect.top
          const hoverClientX = clientOffset.x - hoverBoundingRect.left
          if ((hoverBoundingRect.bottom - hoverBoundingRect.top) < (hoverClientY + 5)) {
            setIsHoverMiddle(false)
          } else {
            setIsHoverMiddle(true);
          }
          if (hoverMiddleX < hoverClientX) {
            setIsHoverLeft(false)
          } else {
            setIsHoverLeft(true);
          }
        }
        if (item.type === FIELD_ITEM_TYPE_DND.ADD_CARD) {
          setIsDraggingTab(_.isEqual(_.toString(item.value.fieldType), DEFINE_FIELD_TYPE.TAB));
        } else if (item.value &&  item.value.fieldId && _.isArray(item.value.fieldId)) {
          setIsDraggingTab(true);
        } else {
          setIsDraggingTab(_.isUndefined(item.value.isTab) ? false : item.value.isTab);
        }
      }
    }
  );

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, []);

  useEffect(() => {
    if (props.onUpdateStatusDnD) {
      props.onUpdateStatusDnD({ isDraggingTab, isHoverMiddle, isDragging, isOver, canDrop, itemType }, props.fieldSetting)
    }
  }, [isHoverMiddle, isDragging, isOver, canDrop, itemType, isDraggingTab])

  const isDraggingTabToTab = () => {
    return dragSource && dragSource.value && dragSource.value.inTab && props.fieldSetting.inTab && isDragging && dragSource.value.fieldId !== props.fieldSetting.fieldId
  }

  connectDragSource(connectDropTarget(cellRef))
  const isTabToTab = isDraggingTabToTab() // dragSource && dragSource.value && dragSource.value.inTab && props.fieldSetting.inTab && isDragging
  const opacity = isDragging ? (isTabToTab ? 1 : 0) : 1;

  if (props.isDndSplitColumn) {
    const isSplitColumn = (!isDragging || isTabToTab) && isHoverMiddle && !isDraggingTab && canDrop && isOver;
    return (
      <tr ref={cellRef} style={{ opacity }}>
        {isSplitColumn && isHoverLeft &&
          <td><div style={{ borderWidth: '1px', borderStyle: 'dashed', borderColor: '#01a0f4', height: '100%' }} /></td>
        }
        <td colSpan={isSplitColumn ? 1 : props.colSpan} className={`${props.isHightlight ? 'detail-highlight-style' : ''}`} ref={cellRef}>
        {renderContentCell()}
        </td>
        {isSplitColumn && !isHoverLeft &&
          <td><div style={{ borderWidth: '1px', borderStyle: 'dashed', borderColor: '#01a0f4', height: `${getSizeControl().height}px` }} /></td>
        }
      </tr>
    )
  }
  return (
    <td style={{ opacity }} colSpan={props.colSpan} className={`${props.isHightlight ? 'detail-highlight-style' : ''}`} ref={cellRef}>
      {renderContentCell()}
    </td>
  )
};

interface IFieldDisplayAsTabProps {
  key: any,
  isPlaceHover?: boolean,
  label: string,
  fieldInfo: any
  isCurrentTab: boolean
  isLastTab: boolean,
  onChangeTab: (fieldInof) => void
  editFieldTab: (fieldInfo) => void
  deleteFieldTab: (fieldInfo) => void
  moveFieldCard?: (dropId: any, dragId: any, isDoubleColumn: boolean, isAddLeft: boolean) => void
  addFieldCard?: (fieldData, dragId: number, isDoubleColumn: boolean, isAddLeft: boolean) => void
  onUpdateStatusDnD?: (param: { isDraggingTab, isDragging, isOver, canDrop, itemType }, fieldDnd: any) => void; // callback when
  fieldIdsHighlight?: any
}

const isFieldHightlighted = (field, fieldHighLight) => {
  if (field.fieldId < 0) {
    return true;
  }
  if (!field || !fieldHighLight || fieldHighLight.length < 1) {
    return false;
  }
  return fieldHighLight.findIndex(e => e === field.fieldId) >= 0;
}

const FieldDisplayAsTab = (props: IFieldDisplayAsTabProps) => {
  const [hovered, setHovered] = useState(false);
  const [isDraggingTab] = useState(false);

  const headerHoverOn = (item) => {
    setHovered(true);
  }

  const headerHoverOff = (item) => {
    setHovered(false);
  }

  const [{ isDragging }, connectDragSource] = useDrag(
    {
      item: { type: FIELD_ITEM_TYPE_DND.MOVE_CARD, value: { fieldId: props.fieldInfo.fieldId, isTab: true } },
      collect: (monitor: DragSourceMonitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }
  );

  const [{ dragSource, isOver, canDrop, itemType }, connectDropTarget] = useDrop(
    {
      accept: [FIELD_ITEM_TYPE_DND.MOVE_CARD, FIELD_ITEM_TYPE_DND.ADD_CARD],
      drop(item, monitor) {
        const dropType = monitor.getItemType();
        if (dropType === FIELD_ITEM_TYPE_DND.MOVE_CARD && props.moveFieldCard) {
          props.moveFieldCard(item['value']['fieldId'], props.fieldInfo.fieldId, false, false);
        } else if (dropType === FIELD_ITEM_TYPE_DND.ADD_CARD) {
          props.addFieldCard(item['value'], props.fieldInfo.fieldId, false, false);
        }
      },
      collect: monitor => ({
        isOver: monitor.isOver(),
        isOverCurrent: monitor.isOver({ shallow: false }),
        canDrop: monitor.canDrop(),
        itemType: monitor.getItemType(),
        dragSource: monitor.getItem(),
      }),
    }
  );

  const [{ dragSourceAdd, isOverAdd, canDropAdd, itemTypeAdd }, dropAdd] = useDrop(
    {
      accept: [FIELD_ITEM_TYPE_DND.ADD_CARD],
      drop(dropItem, monitor) {
        const dropType = monitor.getItemType();
        if (dropType === FIELD_ITEM_TYPE_DND.MOVE_CARD && props.moveFieldCard) {
          props.moveFieldCard(dropItem['value']['fieldId'], props.fieldInfo.fieldId, false, false);
        } else if (dropType === FIELD_ITEM_TYPE_DND.ADD_CARD) {
          props.addFieldCard(dropItem['value'], props.fieldInfo.fieldId, false, false);
        }
      },
      collect: monitor => ({
        isOverAdd: monitor.isOver(),
        isOverCurrent: monitor.isOver({ shallow: false }),
        canDropAdd: monitor.canDrop(),
        itemTypeAdd: monitor.getItemType(),
        dragSourceAdd: monitor.getItem(),
      }),
    }
  );

  useEffect(() => {
    if (props.onUpdateStatusDnD) {
      const isTab = dragSource && dragSource.value && _.isEqual(_.toString(dragSource.value.fieldType), DEFINE_FIELD_TYPE.TAB)
      props.onUpdateStatusDnD({ isDraggingTab: isTab, isDragging, isOver, canDrop, itemType }, props.fieldInfo)
    }
  }, [dragSource, isDraggingTab, isDragging, canDrop, isOver, itemType])

  useEffect(() => {
    if (props.onUpdateStatusDnD) {
      const isTab = dragSourceAdd && dragSourceAdd.value && _.isEqual(_.toString(dragSourceAdd.value.fieldType), DEFINE_FIELD_TYPE.TAB)
      props.onUpdateStatusDnD({ isDraggingTab: isTab, isDragging: false, isOver: isOverAdd, canDrop: canDropAdd, itemType: itemTypeAdd }, props.fieldInfo)
    }
  }, [dragSourceAdd, isDraggingTab, isDragging, canDropAdd, isOverAdd, itemTypeAdd])

  const renderPlaceDrop = () => {
    if (props.isLastTab && props.isPlaceHover) {
        return dropAdd(
        <li key={props.key} className="nav-item" style={{ borderWidth: '1px', borderStyle: 'dashed', borderColor: '#01a0f4', minWidth: '80px' }} />
      )
    } else {
      return <></>
    }
  }

  const renderTitleTab = () => {
    const title = _.isEmpty(props.label) ? "　" : props.label;
    const isHightlight = isFieldHightlighted(props.fieldInfo, props.fieldIdsHighlight)
    const classStyle = `nav-link delete edit ${props.isCurrentTab ? 'active' : ''} ${isHightlight ? 'detail-highlight-style' : ''}`
    return connectDragSource(connectDropTarget(
      <li key={props.key} className="nav-item"
        onMouseEnter={() => { headerHoverOn(props.fieldInfo) }}
        onMouseLeave={() => { headerHoverOff(props.fieldInfo) }}
        >
        <a onClick={() => props.onChangeTab(props.fieldInfo)} className={classStyle} data-toggle="tab">{title}</a>
        {hovered && <a onClick={() => props.editFieldTab(props.fieldInfo)} className="icon-small-primary icon-edit-small"></a>}
        {hovered && !props.fieldInfo.isDefault && <a onClick={() => props.deleteFieldTab(props.fieldInfo)} className="icon-small-primary icon-erase-small"></a>}
      </li>
    ))
  }

  return (
    <>
    {renderTitleTab()}
    {renderPlaceDrop()}
    </>
  )
};

interface IFieldDisplayRowOwnProps {
  fieldIdsHighlight?: number[];
}

type IFieldDisplayRowProps = IDynamicFieldProps & IFieldDisplayRowOwnProps

const FieldDisplayRow = forwardRef((props: IFieldDisplayRowProps, ref) => {
  const [fields, setFields] = useState([]);
  const [fieldAdding, setFieldAdding] = useState(null);
  const [hoverField, setHoverField] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [listTab, setListTab] = useState([])
  const [listFieldTabContent, setListFieldTabContent] = useState([]);
  const [currentTab, setCurrentTab] = useState(null)
  const [isDragging, setIsDragging] = useState(false);
  const [fieldDragging, setFieldDragging] = useState(null);
  const [isDraggingAddTab, setIsDraggingAddTab] = useState(false);

  const getListFieldTab = () => {
    const listFieldTab = [];
    props.listFieldInfo && props.listFieldInfo.forEach((field) => {
      if (_.toString(field.fieldType) === DEFINE_FIELD_TYPE.TAB || field.inTab === true) {
        listFieldTab.push(field.fieldId);
      }
    })
    return listFieldTab;
  }

  const updateContentTab = () => {
    if (!props.listFieldInfo || _.isNil(currentTab)) {
      setListFieldTabContent([])
    } else {
      const idx = listTab.findIndex(e => e.fieldId === currentTab.fieldId)
      if (idx < 0) {
        setListFieldTabContent([])
      } else {
        let tabData = listTab[idx].tabData;
        if (!tabData) {
          tabData = []
        }
        const tmp = props.listFieldInfo.filter(e => tabData.findIndex(o => o === e.fieldId) >= 0)
        if (tmp) {
          tmp.forEach((e) => {
            e["inTab"] = true;
          })
        }
        setListFieldTabContent(tmp)
      }
    }
  }

  const moveFieldCard = (dragFieldInfo: any, dropFieldInfo: any, isDoubleColumn: boolean, isAddLeft: boolean) => {
    setFieldAdding(null)
    if (props.moveFieldCard) {
      let dropNew = _.cloneDeep(dropFieldInfo);
      let left = isAddLeft;
      if (!isDoubleColumn) {
        dropNew = _.cloneDeep(props.fieldInfo[props.fieldInfo.length - 1].fieldId)
      } else if (props.fieldInfo.length === 2) {
        left = true;
      }
      props.moveFieldCard(dragFieldInfo, dropNew, isDoubleColumn, left)
    }
  }
  const addFieldCard = (fieldData, dropId: number, isDoubleColumn: boolean, isAddLeft: boolean) => {
    setFieldAdding(null)
    if (props.addFieldCard) {
      let dropIdNew = dropId;
      let left = isAddLeft;
      if (!isDoubleColumn) {
        dropIdNew = props.fieldInfo[props.fieldInfo.length - 1].fieldId;
      } else if (props.fieldInfo.length === 2) {
        left = true;
      }
      props.addFieldCard(fieldData, dropIdNew, isDoubleColumn, left)
    }
  }

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

  const [{ isOverCurrent, canDrop }, connectDropAdding] = useDrop(
    {
      accept: [FIELD_ITEM_TYPE_DND.MOVE_CARD, FIELD_ITEM_TYPE_DND.ADD_CARD],
      drop(itemdrag, monitor) {
        const dropType = monitor.getItemType();
        if (dropType === FIELD_ITEM_TYPE_DND.MOVE_CARD && props.moveFieldCard) {
          moveFieldCard(itemdrag['value']['fieldId'], fieldAdding.fieldId, true, false);
        } else if (dropType === FIELD_ITEM_TYPE_DND.ADD_CARD) {
          if (_.isUndefined(fieldAdding.fieldId)) {
            addFieldCard(itemdrag['value'], fieldAdding.fieldAddId, true, false);
          }
        }
      },
      collect: monitor => ({
        isOver: monitor.isOver(),
        isOverCurrent: monitor.isOver({ shallow: false }),
        canDrop: monitor.canDrop(),
        itemType: monitor.getItemType(),
      }),
    }
  );

  const [, connectDropTabSource] = useDrag(
    {
      begin: (dragSource: DragSourceMonitor) => dragSource.getItem(),
      item: { type: FIELD_ITEM_TYPE_DND.MOVE_CARD, value: { fieldId: getListFieldTab() } },
      collect: (monitor: DragSourceMonitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }
  );

  useEffect(() => {
    setFields(props.fieldInfo);
  }, [props.fieldInfo])

  useEffect(() => {
    if ((!isOverCurrent || !canDrop)) {
      if (fieldAdding && _.isUndefined(fieldAdding.fieldId)) {
        setFieldAdding(null);
      }
    }
  }, [canDrop, isOverCurrent])

  useEffect(() => {
    if (props.listFieldInfo) {
      setListTab(props.listFieldInfo.filter(e => _.toString(e.fieldType) === DEFINE_FIELD_TYPE.TAB))
    }
  }, [props.listFieldInfo])

  useEffect(() => {
    if (!listTab || listTab.length < 1) {
      return;
    }
    if (_.isNil(currentTab)) {
      setCurrentTab(listTab[0])
    } else {
      const idx = listTab.findIndex(e => e.fieldId === currentTab.fieldId)
      if (idx < 0) {
        setCurrentTab(listTab[0])
      }
    }
    updateContentTab()
  }, [listTab])

  useEffect(() => {
    updateContentTab()
  }, [currentTab])

  const editField = (field) => {
    if (props.onExecuteAction && (_.isNil(field.lookupFieldId) ||  field.lookupFieldId === 0)) {
      props.onExecuteAction(field, DynamicControlAction.EDIT)
    }
  }

  const editFieldTab = (tab) => {
    if (props.onExecuteAction) {
      props.onExecuteAction(tab, DynamicControlAction.EDIT)
    }
  }

  const showConfirmDelete = async (field) => {
    const itemName = getFieldLabelDefault(field, 'fieldLabel');
    const result = await ConfirmDialog({
      title: (<>{translate('employees.detail.title.popupErrorMessage.delete')}</>),
      message: itemName?  StringUtils.translateSpecial('messages.WAR_COM_0001', { itemName: _.toString(itemName) }) : translate('messages.WAR_COM_00011'),
      confirmText: translate('employees.detail.title.popupErrorMessage.delete'),
      confirmClass: "button-red",
      cancelText: translate('employees.detail.label.button.cancel'),
      cancelClass: "button-cancel"
    });
    return result;
  }

  const executeDelete = async (field, action: () => void, cancel?: () => void) => {
    const result = await showConfirmDelete(field);
    if (result) {
      action();
    } else if (cancel) {
      cancel();
    }
  }

  const deleteField = (field, event) => {
    // props.onDeleteFields(hoverField);
    event.stopPropagation();
    if (props.onExecuteAction) {
      executeDelete(field, () => {
        props.onExecuteAction(field, DynamicControlAction.DELETE);
      });
    }
  }

  const deleteFieldTab = (tab) => {
    // props.onDeleteFields(hoverField);
    if (props.onExecuteAction) {
      executeDelete(tab, () => {
        props.onExecuteAction(tab, DynamicControlAction.DELETE);
      });
    }
  }

  const headerHoverOn = (item) => {
    if (props.isDisabled || item.lookupFieldId < 0 || item.lookupFieldId > 0) {
      setHovered(false);
      return
    }
    setHoverField(item)
    setHovered(true);
  }

  const headerHoverOff = (item) => {
    setHovered(false);
  }

  const onUpdateStatusDnD = (param: { isDraggingTab, isHoverMiddle, isDragging, isOver, canDrop, itemType }, field) => {
    setIsDragging(param.isDragging)
    setFieldDragging(param.isDragging ? field : null)
    if (param.isOver && param.canDrop) {
      if (param.isOver && param.canDrop && param.isDraggingTab) {
        if (listTab.length < 1 || param.itemType === FIELD_ITEM_TYPE_DND.MOVE_CARD) {
          setFieldAdding({ fieldAddId: field.fieldId });
        }
        return
      }
      if (field.fieldId > 0) {
        if (!param.isHoverMiddle) {
          setFieldAdding({ fieldAddId: field.fieldId });
        } else {
          if (props.fieldInfo.length === 1) {
            setFieldAdding(null);
          } else if (props.fieldInfo.length === 2) {
            const idx = props.fieldInfo.findIndex(e => e.fieldId === field.fieldId)
            if (idx < 0) {
              return;
            }
            const tmp = _.cloneDeep(props.fieldInfo[props.fieldInfo.length - 1]);
            tmp['targetFieldId'] = field.fieldId;
            setFieldAdding(tmp)
          }
        }
      }
    } else {
      setFieldAdding(null);
    }
  }

  const onUpdateStatusDnDTab = (param: { isDraggingTab, isDragging, isOver, canDrop, itemType }, field) => {
    setIsDragging(param.isDragging)
    setFieldDragging(param.isDragging ? field : null)
    if (param.isDraggingTab && param.itemType === FIELD_ITEM_TYPE_DND.ADD_CARD) {
      setIsDraggingAddTab(true);
    } else {
      setIsDraggingAddTab(false);
    }
    if (param.isOver && param.canDrop) {
      setCurrentTab(field);
    }
  }

  const renderContent = (field) => {
    let content = null;
    if (props.renderControlContent) {
      content = props.renderControlContent(field);
    }
    if (_.isNil(content)) {
        content = <>{props.elementStatus.fieldValue ? props.elementStatus.fieldValue : ''}</>
    }
    return content
  }

  const renderFieldNormal = (field: any, cellHeight?: number) => {
    if (props.fieldInfo.length === 2 && fieldAdding && fieldAdding.targetFieldId && _.isUndefined(field.targetFieldId)) {
      if (field.fieldId === fieldAdding.targetFieldId) {
        const heightStyle = cellHeight && cellHeight > 0 ? `${cellHeight}px` : '100%'
        return <div style={{ borderWidth: '1px', borderStyle: 'dashed', borderColor: '#01a0f4', height: heightStyle }} />
      } else if (fieldAdding.targetFieldId === props.fieldInfo[0].fieldId && field.fieldId !== fieldAdding.targetFieldId) {
        return (
          <div className="table-div-2-col">
            <div className="table-cell title-table detail-display-title" style={{ width: '200px'}} >{getFieldLabelDefault(props.fieldInfo[0], 'fieldLabel')}</div>
            {_.toString(props.fieldInfo[0].fieldType) !== DEFINE_FIELD_TYPE.TITLE && 
              <div className="table-cell">
                {renderContent(props.fieldInfo[0])}
              </div>
            }
          </div>
        )
      }
    }

    return (
      <>
        <div className="table-div-2-col" style={{ height: fieldDragging && fieldDragging.fieldId === field.fieldId ? "1px" : "" }}
          onMouseEnter={() => { headerHoverOn(field) }}
          onMouseLeave={() => { headerHoverOff(field) }}
          onClick={props.isDisabled ? null : () => editField(field)}
        >
          <div className="table-cell title-table detail-display-title" style={!getFieldLabelDefault(props.fieldInfo[0], 'fieldLabel') ?  { width: '200px', height: '40px'} : { width: '200px' }} >
            {getFieldLabelDefault(field, 'fieldLabel')}
            {_.toString(field.fieldType) === DEFINE_FIELD_TYPE.TITLE && 
              !isDragging && hovered && hoverField.fieldId === field.fieldId && !field.isDefault && 
              <a onClick={(event) => deleteField(field, event)} className="icon-small-primary icon-erase-small float-right"></a>
            }
          </div>
          {_.toString(field.fieldType) !== DEFINE_FIELD_TYPE.TITLE &&
            <div className="table-cell">
              {renderContent(field)}
              {!isDragging && hovered && hoverField.fieldId === field.fieldId && !field.isDefault && <a onClick={(event) => deleteField(field, event)} className="icon-small-primary icon-erase-small float-right"></a>}
              {/* {!isDragging && hovered && hoverField.fieldId === field.fieldId && <a onClick={() => editField(field)} className="icon-small-primary icon-edit-small float-right"></a>} */}
            </div>
          }
      </div>
      </>
    )
  }

  const renderComponentTd = (colSpan: number, field, index) => {
    if (props.isDisabled) {
      if (_.toString(field.fieldType) === DEFINE_FIELD_TYPE.LOOKUP) {
        return <></>
      } else {
        if (_.toString(field.fieldType) === DEFINE_FIELD_TYPE.TITLE) {
          return (
            <td colSpan={colSpan} className="no-border">
              <div className="table-div-2-col">
                <div className="table-cell title-table detail-display-title btn-bg-none pl-0" style={{ width: '200px' }} >{getFieldLabelDefault(field, 'fieldLabel')}</div>
              </div>
            </td>
          )
        } else {
          return (
            <td colSpan={colSpan}>
              {renderFieldNormal(field)}
            </td>
          )
        }
      }
    } else {
      if (field.fieldAddId > 0) {
        return (
          <>
          {connectDropAdding(
            <td colSpan={2}>
                <div style={{ borderWidth: '1px', borderStyle: 'dashed', borderColor: '#01a0f4', height: '100%' }}>
              </div>
            </td>)
          }
        </>)
      }
      return <FieldSettingCell
              isDoubleColumn={props.fieldInfo.length === 2}
              fieldSetting={field}
              isHightlight={isFieldHightlighted(field, props.fieldIdsHighlight)}
              colSpan={colSpan}
              renderDragPreview={renderContent}
              contentCell={renderFieldNormal}
              moveFieldCard={moveFieldCard}
              addFieldCard={addFieldCard}
              onUpdateStatusDnD={onUpdateStatusDnD}
            />
    }
  }

  const renderCellAdding = () => {
    return (
      <>
      {fieldAdding && _.isUndefined(fieldAdding.fieldId) &&
      <tr>
        {connectDropAdding(
          <td colSpan={2}>
                <div style={{ borderWidth: '1px', borderStyle: 'dashed', borderColor: '#01a0f4', height: '40px' }}>
            </div>
          </td>)}
      </tr>
      }
      {fieldAdding && !_.isNil(fieldAdding.fieldId) &&
      <tr>
        {connectDropAdding(
              <td colSpan={2} className={`${props.fieldIdsHighlight && props.fieldIdsHighlight.findIndex(e => e === props.fieldInfo[0].fieldId) >= 0 ? 'detail-highlight-style' : ''}`}>
            {renderFieldNormal(fieldAdding)}
          </td>
        )}
      </tr>
      }
      </>
    )
  }

  useEffect(() => {
    updateContentTab()
  }, [currentTab])

  const onChangeTab = (tab) => {
    setCurrentTab(tab);
  }

  const renderFieldElementTab = () => {
    return (
      <>
        {listTab.map((tab, idx) => {
          return <FieldDisplayAsTab
                    key={idx}
                    isPlaceHover={isDraggingAddTab}
                    label={getFieldLabelDefault(tab, 'fieldLabel')}
                    fieldInfo={tab}
                    isLastTab={idx === listTab.length - 1}
                    isCurrentTab={_.get(currentTab, 'fieldId') === tab.fieldId}
                    onChangeTab={onChangeTab}
                    onUpdateStatusDnD={onUpdateStatusDnDTab}
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

  if (props.fieldInfo.fieldType && _.toString(props.fieldInfo.fieldType) === DEFINE_FIELD_TYPE.TAB) {
    if (props.isDisabled) {
      return (
        <>
          <ul className="nav nav-tabs mb-0">
          {listTab.map((tab, idx) => {
            return (
              <li key={idx} className="nav-item">
                  <a
                    onClick={() => onChangeTab(tab)}
                    className={`nav-link delete ${_.get(currentTab, 'fieldId') === tab.fieldId ? 'active' : ''}`}
                  data-toggle="tab">{getFieldLabelDefault(tab, 'fieldLabel')}
                </a>
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
          {connectDropTabSource(
            <ul className="nav nav-tabs mb-0">
              {renderFieldElementTab()}
            </ul>)
          }
          {props.renderControlContent && props.renderControlContent(listFieldTabContent)}
        </>
      )
    }
  }

  if (!props.isDisabled && props.fieldInfo.length === 1) {
    return (
      <>
        <FieldSettingCell
          isDoubleColumn={false}
          isDndSplitColumn={true}
          fieldSetting={props.fieldInfo[0]}
          isHightlight={isFieldHightlighted(props.fieldInfo[0], props.fieldIdsHighlight)}
          colSpan={2}
          renderDragPreview={renderContent}
          contentCell={renderFieldNormal}
          moveFieldCard={moveFieldCard}
          addFieldCard={addFieldCard}
          onUpdateStatusDnD={onUpdateStatusDnD}
        />
        {renderCellAdding()}
      </>
    )
  }
  return (
    <>
      <tr>
        {fields.map((e, idx) => { return renderComponentTd(fields.length === 1 ? 2 : 0, e, idx) })}
      </tr>
      {renderCellAdding()}
    </>
  );
});

export default FieldDisplayRow