import React, { useState, useRef, useEffect, useCallback } from 'react';
import { DragSourceMonitor, ConnectDragSource, DragSource, DragSourceConnector, ConnectDragPreview } from 'react-dnd';
import { DropTarget, ConnectDropTarget, DropTargetMonitor } from 'react-dnd';
import { MENU_TYPE, DND_DEPARTMENT_TYPE, SELECT_TARGET_TYPE } from '../constants';
import { DND_ITEM_TYPE } from '../../../shared/layout/dynamic-form/constants'
import { translate } from 'react-jhipster';
import useEventListener from 'app/shared/util/use-event-listener';
import ConfirmDialog from 'app/shared/layout/dialog/confirm-dialog';
import DialogDirtyCheck from 'app/shared/layout/common/dialog-dirty-check';
import { getEmptyImage } from 'react-dnd-html5-backend';

export interface IDepartmentCardProps {
  sourceDepartment: any
  type: number
  handleDataFilter: (key, value, selectedTargetType) => void
  dragDepartment: (sourceDepartment, targetDepartment) => void
  // Collected Props
  isDragging: boolean,
  itemType: any,
  connectDragSource: ConnectDragSource
  connectDropTarget: ConnectDropTarget
  connectDragPreview: ConnectDragPreview
  canDrop: boolean
  isOver: boolean
  localMenuData?: any
  sidebarCurrentId: (sidebarId) => void
  toggleShowFeaturesIcon: (type, isAutoGroup, isOwner) => void
  setActiveCard: (cardType, id) => void
  isChange?: boolean
  activeCard: any
  handleDeleteDepartment: (departmentId) => void
  toggleOpenDepartmentPopup?
  showDepartmentChild : (departmentId) => void,
}

const DepartmentCard: React.FC<IDepartmentCardProps> = (props) => {
  const [isShowSubMenu, setIsShowSubMenu] = useState(false);
  const [subMenuHeight, setSubMenuHeight] = useState(0);
  const [subMenuWidth, setSubMenuWidth] = useState(0);
  const wrapperRef = useRef(null);

  /**
   * Get current node and set subMenuHeight, subMenuWidth
   */
  const subMenuRef = useCallback((node) => {
    if (node !== null) {
      setSubMenuHeight(node.getBoundingClientRect().height);
      setSubMenuWidth(node.getBoundingClientRect().width);
    }
  }, []);

  useEffect(() => {
    props.connectDragPreview(getEmptyImage(), { captureDraggingState: false });
  }, []);

  const onToggleShowFeaturesIcon = () => {
    props.toggleShowFeaturesIcon(props.type, false, false);
  }

  const onDepartmentSelected = (key, value) => {
    props.handleDataFilter(key, value, SELECT_TARGET_TYPE.DEPARTMENT);
  }

  const onClickOpenDepartmentPopup = (departmentId) => {
    props.toggleOpenDepartmentPopup(departmentId);
  };

  const showDeleteDepartmentDialog = async (sourceDepartment) => {
    const result = await ConfirmDialog({
      title: (<>{translate('employees.top.dialog.title-delete-group')}</>),
      message: translate('employees.top.dialog.message-delete-group'),
      confirmText: translate('employees.top.dialog.confirm-delete-group'),
      confirmClass: "button-red",
      cancelText: translate('employees.top.dialog.cancel-text'),
      cancelClass: "button-cancel"
    });
    if (result) {
      props.handleDeleteDepartment(sourceDepartment.departmentId);
    }
  }

  /**
   * Set position left, top for SubMenu
   */
  const setPosition = () => {
    const element = document.getElementById(`${props.type + '' + props.sourceDepartment.departmentId}`);
    let left = 0;
    let top = 0;
    if (element) {
      const elementBounding = element.getBoundingClientRect();
      const elementWithBottomSpace = window.innerHeight - elementBounding.top;
      top = elementWithBottomSpace < (subMenuHeight + 2.5 * elementBounding.height) ? -(subMenuHeight + 5) : (elementBounding.height - 5);
      left = window.pageXOffset - (subMenuWidth - 10);
    }
    return { left, top };
  }

  const SubMenuDepartment = () => {
    return (
      <div className="box-select-option version2" ref={subMenuRef} style={{ left: setPosition().left, top: setPosition().top }}>
        <ul>
          <li onClick={() => { setIsShowSubMenu(false); onClickOpenDepartmentPopup(props.sourceDepartment.departmentId) }}>
            {translate('sales.group-card.submenu.remove-from-favorite')}
          </li>
          <li onClick={() => { setIsShowSubMenu(false); onClickOpenDepartmentPopup(props.sourceDepartment.departmentId) }}>
            {translate('employees.department-card.submenu.edit-department')}
          </li>
          <li onClick={() => { setIsShowSubMenu(false); showDeleteDepartmentDialog(props.sourceDepartment); }}>
            {translate('employees.department-card.submenu.delete-department')}
          </li>
        </ul>
      </div>
    )
  }

  /**
   * Handle for moving mouse out of submenu area
   * @param e
   */
  const handleMouseOut = (e) => {
    if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
      setIsShowSubMenu(false);
    }
  }

  useEventListener('mouseout', handleMouseOut);

  const executeDirtyCheck = async (action: () => void, cancel?: () => void) => {
    if (props.isChange) {
      await DialogDirtyCheck({ onLeave: action, onStay: cancel });
    } else {
      action();
    }
  }

  const actionClickDeparment = () => {
    executeDirtyCheck(() => {
      onDepartmentSelected("department_id", JSON.stringify(props.sourceDepartment.departmentId));
      onToggleShowFeaturesIcon();
      props.sidebarCurrentId(props.sourceDepartment.departmentId);
      props.setActiveCard(MENU_TYPE.DEPARTMENT, props.sourceDepartment.departmentId);
    })
  }

  /**
   * check active class if user click to department card
   * @param department 
   */
  const getActiveClass = (department) => {
    let name = "d-flex";
    if ((props.activeCard !== null &&
      props.activeCard.type === MENU_TYPE.DEPARTMENT &&
      props.activeCard.cardId === department.departmentId)) {
      name = "d-flex active";
    }
    if (props.isOver && props.canDrop && !props.isDragging) {
      name = "d-flex active";
    }
    if (props.isOver && props.canDrop && !props.isDragging && props.itemType === DND_DEPARTMENT_TYPE.CARD) {
      name += " location-drop-drag ";
    }
    return name;
  }
  const setShowDerparmentChild = (department) => {
    if (props.isOver && props.canDrop) {
      props.showDepartmentChild(department.departmentId)
    }
  }

  return props.connectDropTarget(props.connectDragSource(
    <div className={getActiveClass(props.sourceDepartment)} ref={wrapperRef}>
      {props.showDepartmentChild && setShowDerparmentChild(props.sourceDepartment)}
      <a
        onClick={() => actionClickDeparment()}
        id={props.type + '' + props.sourceDepartment.departmentId}
        ref={wrapperRef}
      >
        <span>{props.sourceDepartment.departmentName}</span>
      </a>
      {
        <div id="more-option1" className="more-option1" ref={wrapperRef} onClick={(e) => { setIsShowSubMenu(!isShowSubMenu); e.stopPropagation(); }}>
          {isShowSubMenu && <SubMenuDepartment />}
        </div>
      }
    </div>
  ))
}

const dragSourceHOC = DragSource(
  DND_DEPARTMENT_TYPE.CARD,
  {
    beginDrag: (props: IDepartmentCardProps) => ({ type: DND_DEPARTMENT_TYPE.CARD, sourceDepartment: props.sourceDepartment }),
    endDrag(props: IDepartmentCardProps, monitor: DragSourceMonitor) {
      const item = monitor.getItem()
      const dropResult = monitor.getDropResult()
      if (dropResult) {
        props.dragDepartment(item.sourceDepartment, dropResult.targetDepartment);
      }
    },
  },
  (connect: DragSourceConnector, monitor: DragSourceMonitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
    connectDragPreview: connect.dragPreview(),
    itemType: monitor.getItemType(),
  }),
);

const dropTargetHOC = DropTarget(
  [DND_DEPARTMENT_TYPE.CARD, DND_ITEM_TYPE.DYNAMIC_LIST_ROW],
  {
    drop: ({ sourceDepartment }: IDepartmentCardProps) => ({
      targetDepartment: sourceDepartment,
    }),
    hover(props: IDepartmentCardProps, monitor: DropTargetMonitor, component: any) {
    },
    canDrop(props: IDepartmentCardProps, monitor: DropTargetMonitor) {
       // can not drop to group is select
     if(props.activeCard.cardId === props.sourceDepartment.departmentId) {
      return false;
      }
      return true;
    }
  },
  (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
  }),
);

export default dropTargetHOC(dragSourceHOC(DepartmentCard))
