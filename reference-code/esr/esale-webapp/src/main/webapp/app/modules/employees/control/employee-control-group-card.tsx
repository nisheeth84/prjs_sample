import React, { useState, useEffect, useRef, useCallback } from 'react';
import { DragSourceMonitor, ConnectDragSource, DragSource, DragSourceConnector, ConnectDragPreview } from 'react-dnd';
import { DropTarget, ConnectDropTarget, DropTargetMonitor } from 'react-dnd';
import { MENU_TYPE, GROUP_TYPE, PARTICIPANT_TYPE, SELECT_TARGET_TYPE } from '../constants';
import ConfirmDialog from 'app/shared/layout/dialog/confirm-dialog';
import { translate } from 'react-jhipster';
import useEventListener from 'app/shared/util/use-event-listener';
import { SHARE_GROUP_MODES, MY_GROUP_MODES } from '../constants';
import DialogDirtyCheck, { DIRTYCHECK_PARTTERN } from 'app/shared/layout/common/dialog-dirty-check';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { isNullOrUndefined } from 'util';
import { FIELD_BELONG } from 'app/config/constants';
import { DND_ITEM_TYPE } from 'app/shared/layout/dynamic-form/constants';
import Popover from 'app/shared/layout/common/Popover';

export interface IGroupCardProps {
  sourceGroup: any
  type: number
  toggleShowFeaturesIcon: (type, isAutoGroup, participantType) => void
  handleDataFilter: (key, value, selectedTargetType, listViewCondition) => void
  dragGroup: (sourceGroup, targetGroup?) => void
  sidebarCurrentId: (sidebarId) => void
  setTypeGroup: (type) => void
  handleUpdateAutoGroup: (groupId) => void
  setActiveCard: (cardType, id, participantType) => void
  activeCard: any
  // Collected Props
  itemType: any,
  isDragging: boolean
  connectDragSource: ConnectDragSource
  connectDropTarget: ConnectDropTarget
  connectDragPreview: ConnectDragPreview // for drag & drop, user don't need pass component'
  canDrop: boolean
  isOver: boolean
  toggleOpenAddEditModal?: (myGroupModalMode, currentGroupId, isAutoGroup) => void
  openGroupModal?: (groupMode, groupId, isOwnerGroup, isAutoGroup, groupMember) => void
  handleDeleteGroup: (groupId) => void
  getGroupName?: (groupName) => any;
  initializeListInfo?
  handleGetInitializeListInfo?: (fieldBelong) => void
  dirtyCheck?: any;
}

const GroupCard: React.FC<IGroupCardProps> = (props) => {
  const [isShowSubMenu, setIsShowSubMenu] = useState(false);
  const [subMenuHeight, setSubMenuHeight] = useState(0);
  const [subMenuWidth, setSubMenuWidth] = useState(0);
  const wrapperRef = useRef(null);
  const { initializeListInfo } = props

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
    props.sourceGroup['type'] = props.type;
  });

  useEffect(() => {
    props.connectDragPreview(getEmptyImage(), { captureDraggingState: false });
  }, []);

  /**
   * Condition to show icons on the control top
   */
  const onToggleShowFeaturesIcon = () => {
    let isOwner = false;
    switch (props.sourceGroup.participantType) {
      case PARTICIPANT_TYPE.MEMBER:
        isOwner = false;
        break;
      case PARTICIPANT_TYPE.OWNER:
        isOwner = true;
        break;
      default:
        break;
    }
    props.toggleShowFeaturesIcon(props.type, props.sourceGroup.isAutoGroup, isOwner);
  }

  /**
   * Change format of filterConditions
   * @param arr
   */
  const getFilterConditions = (arr) => {
    const filters = [];
    let element = {};
    // let fieldValue = "";
    !isNullOrUndefined(arr) && arr.length > 0 && arr.map(list => {
      if (list.targetType === props.type && list.targetId === props.sourceGroup.groupId) {
        list.filterConditions.length > 0 && list.filterConditions.map(e => {
          delete e.fieldBelong;
          delete e.searchCondition;
          element = { ...e };
          filters.push(element);
        })
      }
    });
    return filters;
  }

  /**
   * Get conditions from api getInitializeListInfo
   */
  const getConditionSearch = () => {
    const conditions = [];
    if (!isNullOrUndefined(initializeListInfo)) {
      if (initializeListInfo.selectedTargetType === props.type && initializeListInfo.selectedTargetId === props.sourceGroup.groupId) {
        conditions['filterConditions'] = getFilterConditions(initializeListInfo.filterListConditions);
        conditions['orderBy'] = initializeListInfo.orderBy;
      }
    }
    return conditions;
  }

  /**
   * Handle for filtering data when select group on sidebar menu
   * @param key
   * @param value
   */
  const onGroupSelected = (key, value, groupType) => {
    const listViewConditions = getConditionSearch();
    let selectedTargetType = SELECT_TARGET_TYPE.SHARE_GROUP
    if (groupType === MENU_TYPE.MY_GROUP) {
      selectedTargetType = SELECT_TARGET_TYPE.GROUP;
    }
    props.handleGetInitializeListInfo(FIELD_BELONG.EMPLOYEE);
    props.handleDataFilter(key, value, selectedTargetType, listViewConditions);
  }

  /**
   * Show dialog to confirm delete group
   * @param sourceGroup
   */
  const showDeleteGroupDialog = async (sourceGroup) => {
    const result = await ConfirmDialog({
      title: (<>{translate('employees.top.dialog.title-delete-group')}</>),
      message: translate('messages.WAR_COM_0001', { itemName: sourceGroup.groupName }),
      confirmText: translate('employees.top.dialog.confirm-delete-group'),
      confirmClass: "button-red",
      cancelText: translate('employees.top.dialog.cancel-text'),
      cancelClass: "button-cancel"
    });
    if (result) {
      props.handleDeleteGroup(sourceGroup.groupId);
    }
  }

  const checkEditCondition = (cardType) => {
    if (cardType !== MENU_TYPE.SHARED_GROUP || props.sourceGroup.participantType === PARTICIPANT_TYPE.OWNER) {
      return true;
    }
    return false;
  }

  /**
   * Show dialog to confirm change my list to shared list
   * @param sourceGroup
   */
  const showChangeListDialog = async sourceGroup => {
    // const groupName = sourceGroup.listName;
    const result = await ConfirmDialog({
      title: <>{translate('employees.top.dialog.title-auto-group')}</>,
      message: translate('sales.top.dialog.change-my-list-to-share-list'),
      confirmText: translate('sales.top.dialog.confirm-change'),
      confirmClass: 'button-blue',
      cancelText: translate('employees.top.dialog.cancel-text'),
      cancelClass: 'button-cancel'
    });
    if (result) {
      // props.handleConvertMyListToShareList(sourceGroup);
      // props.dragGroup(sourceGroup);
      props.openGroupModal(SHARE_GROUP_MODES.MODE_SWICH_GROUP_TYPE, sourceGroup.groupId, false, sourceGroup.isAutoGroup, null)
    }

    // props.dragGroup(sourceGroup);
  };

  /**
   * Set position left, top for SubMenu
   */
  const setPosition = () => {
    const element = document.getElementById(`${props.type + '' + props.sourceGroup.groupId}`);
    let top = 0;
    let left = 0;
    if (element) {
      const elementBounding = element.getBoundingClientRect();
      const elementWithBottomSpace = window.innerHeight - elementBounding.top;
      top = elementWithBottomSpace < (subMenuHeight + 2.5 * elementBounding.height) ? -(subMenuHeight + 5) : (elementBounding.height - 5);
      left = window.pageXOffset - (subMenuWidth - 10);
    }
    return { left, top };
  }

  const SubMenuGroup = ({ type }) => {
    return (
      <div className="box-select-option version2" id="submenu-group" ref={subMenuRef} style={{ left: setPosition().left, top: setPosition().top }}>
        <ul>
          {checkEditCondition(type) &&
            <li onClick={() => {
              props.dirtyCheck(() => {
                setIsShowSubMenu(false);
                type === MENU_TYPE.SHARED_GROUP
                  ? props.openGroupModal(SHARE_GROUP_MODES.MODE_EDIT_GROUP, props.sourceGroup.groupId, false, props.sourceGroup.isAutoGroup, null)
                  : props.toggleOpenAddEditModal(MY_GROUP_MODES.MODE_EDIT_GROUP, props.sourceGroup.groupId, props.sourceGroup.isAutoGroup);
              })
            }
            }>{translate('employees.group-card.submenu.edit-group')}</li>}
          {(props.sourceGroup.participantType === PARTICIPANT_TYPE.OWNER || type === MENU_TYPE.MY_GROUP) &&
            <li onClick={() => {
              props.dirtyCheck(() => {
                setIsShowSubMenu(false);
                showDeleteGroupDialog(props.sourceGroup);
              })
            }}>{translate('employees.group-card.submenu.delete-group')}</li>
          }
          <li onClick={() => {
            props.dirtyCheck(() => {
              setIsShowSubMenu(false);
              type === MENU_TYPE.SHARED_GROUP
                ? props.openGroupModal(SHARE_GROUP_MODES.MODE_COPY_GROUP, props.sourceGroup.groupId, false, props.sourceGroup.isAutoGroup, null)
                : props.toggleOpenAddEditModal(MY_GROUP_MODES.MODE_COPY_GROUP, props.sourceGroup.groupId, props.sourceGroup.isAutoGroup);
            })
          }
          }>{translate('employees.group-card.submenu.duplicate-group')}</li>
          {(type === MENU_TYPE.MY_GROUP) &&
            <li onClick={() => {
              props.dirtyCheck(() => {
                setIsShowSubMenu(false);
                showChangeListDialog(props.sourceGroup);
              })
            }}>{translate('employees.group-card.submenu.change-my-list-to-share-group')}</li>
          }
        </ul>
      </div>
    )
  }

  /**
   * Show dialog to confirm update auto group
   * @param sourceGroup
   */
  const showAutoGroupDialog = async (sourceGroup) => {
    const groupName = sourceGroup.groupName;
    const result = await ConfirmDialog({
      title: (<>{translate('employees.top.dialog.title-auto-group')}</>),
      message: translate('messages.WAR_EMP_0004', { groupName }),
      confirmText: translate('employees.top.dialog.confirm-auto-group'),
      confirmClass: "button-red",
      cancelText: translate('employees.top.dialog.cancel-text'),
      cancelClass: "button-cancel"
    });
    if (result) {
      props.handleUpdateAutoGroup(sourceGroup.groupId);
    }
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
  useEventListener('mousemove', handleMouseOut);

  const actionClickGroup = () => {
    props.dirtyCheck(() => {
      props.getGroupName(props.sourceGroup.groupName);
      props.setActiveCard(props.type, props.sourceGroup.groupId, props.sourceGroup.participantType);
      props.sidebarCurrentId(props.sourceGroup.groupId);
      props.setTypeGroup(props.type);
      onGroupSelected("group_id", JSON.stringify(props.sourceGroup.groupId), props.type);
      onToggleShowFeaturesIcon();
    })
  }

  const getClassNameDrag = () => {
    let classNameDrag = "height-40 ";
    if (props.sourceGroup.groupId !== 0) {
      classNameDrag += "category d-flex";
    }
    if (props.isOver && props.canDrop && !props.isDragging) {
      if (props.itemType === GROUP_TYPE.CARD) {
        classNameDrag += " d-flex active location-drop-drag";
      } else {
        classNameDrag += " d-flex active";
      }
    }
    return classNameDrag;
  }
  return props.connectDropTarget(props.connectDragSource(
    <li
      id={props.type + '' + props.sourceGroup.groupId}
      onClick={() => { if (props.sourceGroup.groupId !== 0) { actionClickGroup() } }} key={props.sourceGroup.groupId}>
      <div
        className={
          (props.activeCard !== null &&
            props.activeCard.type === props.type &&
            props.activeCard.cardId === props.sourceGroup.groupId) ? `active ${getClassNameDrag()}` : `${getClassNameDrag()}`
        } ref={wrapperRef}>
        <a ref={wrapperRef} className="pl-3">
          <Popover x={-20} y={50} >
            <span>{props.sourceGroup.groupName}</span>
          </Popover>
        </a>
        <div className="more-option1" ref={wrapperRef} onClick={(e) => { setIsShowSubMenu(!isShowSubMenu); e.stopPropagation(); }}>
          {isShowSubMenu && <SubMenuGroup type={props.type} />}
        </div>
        {props.sourceGroup.isAutoGroup && props.sourceGroup.participantType === PARTICIPANT_TYPE.OWNER && props.type === MENU_TYPE.SHARED_GROUP &&
          <div className={"more-option2"}
            onClick={(e) => { props.sourceGroup.participantType === PARTICIPANT_TYPE.MEMBER ? e.stopPropagation() : showAutoGroupDialog(props.sourceGroup); e.stopPropagation(); }} />
        }
        {props.sourceGroup.isAutoGroup && props.type === MENU_TYPE.MY_GROUP &&
          <div className={"more-option2"}
            onClick={(e) => { showAutoGroupDialog(props.sourceGroup); e.stopPropagation(); }} />
        }
      </div>
    </li>
  ))
}

const dragSourceHOC = DragSource(
  GROUP_TYPE.CARD,
  {
    beginDrag: (props: IGroupCardProps) => ({ sourceGroup: props.sourceGroup }),
    endDrag(props: IGroupCardProps, monitor: DragSourceMonitor) {
      const item = monitor.getItem();
      const dropResult = monitor.getDropResult();
      if (dropResult) {
        props.dragGroup(item.sourceGroup, dropResult.targetGroup);
      }
    },
    canDrag(props: IGroupCardProps, monitor: DragSourceMonitor) {
      if (props.sourceGroup.groupId !== 0) {
        return true;
      }
      return false;
    }
  },
  (connect: DragSourceConnector, monitor: DragSourceMonitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
    connectDragPreview: connect.dragPreview(),
    itemType: monitor.getItemType(),
  }),
);

const dropTargetHOC = DropTarget(
  [GROUP_TYPE.CARD, DND_ITEM_TYPE.DYNAMIC_LIST_ROW],
  {
    drop: ({ sourceGroup }: IGroupCardProps) => ({
      targetGroup: sourceGroup,
    }),
    hover(props: IGroupCardProps, monitor: DropTargetMonitor, component: any) {
    },
    canDrop(props: IGroupCardProps, monitor: DropTargetMonitor) {
      const soureDrag = monitor.getItem();

      // can not drop to group is select
      if (soureDrag.type === DND_ITEM_TYPE.DYNAMIC_LIST_ROW && (props.activeCard.cardId === props.sourceGroup.groupId || props.activeCard.participantType === PARTICIPANT_TYPE.MEMBER)) {
        return false;
      }

      // cannot drag same type
      if (soureDrag.sourceGroup && soureDrag.sourceGroup.type && (props.sourceGroup.type === soureDrag.sourceGroup.type)) {
        return false;
      }

      // for drag&drop group to group
      if (soureDrag.sourceGroup && (props.sourceGroup.type !== soureDrag.sourceGroup.type)) {
        if (soureDrag.sourceGroup.type === MENU_TYPE.MY_GROUP && props.sourceGroup.type === MENU_TYPE.SHARED_GROUP && props.activeCard.participantType !== PARTICIPANT_TYPE.MEMBER) {
          return true;
        }
      }

      // drag to group
      if ((props.sourceGroup.type === SELECT_TARGET_TYPE.GROUP
        || props.sourceGroup.participantType === PARTICIPANT_TYPE.OWNER)
        && props.sourceGroup.groupId !== 0) {
        return true;
      }

      return false;
    }
  },
  (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
  }),
);

export default dropTargetHOC(dragSourceHOC(GroupCard));