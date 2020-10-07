import React, { useState, useEffect, useRef, useCallback } from 'react';
import { DragSourceMonitor, ConnectDragSource, DragSource, DragSourceConnector, ConnectDragPreview } from 'react-dnd';
import { DropTarget, ConnectDropTarget, DropTargetMonitor } from 'react-dnd';
import { MENU_TYPE, SALES_GROUP_TYPE, PARTICIPANT_TYPE, SELECT_TARGET_TYPE, LIST_MODE, LIST_TYPE } from '../constants';
import ConfirmDialog from 'app/shared/layout/dialog/confirm-dialog';
import { translate } from 'react-jhipster';
import useEventListener from 'app/shared/util/use-event-listener';
// import { SHARE_GROUP_MODES, MY_GROUP_MODES } from '../constants';
import { SHARE_GROUP_MODES } from '../constants';
import DialogDirtyCheck from 'app/shared/layout/common/dialog-dirty-check';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { isNullOrUndefined } from 'util';
import { FIELD_BELONG } from 'app/config/constants';
import { DND_ITEM_TYPE } from 'app/shared/layout/dynamic-form/constants';
import Popover from 'app/shared/layout/common/Popover';
import { decodeUserLogin, jsonParse } from 'app/shared/util/string-utils';
// fix bug #17420
import _, { includes } from "lodash";
export interface IGroupCardProps {
  sourceGroup: any;
  type: number;
  toggleShowFeaturesIcon: (type, isAutoGroup, participantType) => void;
  handleDataFilter: (key, value, selectedTargetType, listViewCondition) => void;
  dragGroup: (sourceGroup, targetGroup?) => void;
  sidebarCurrentId: (sidebarId) => void;
  setTypeGroup: (type) => void;
  handleUpdateAutoGroup: (groupId) => void;
  setActiveCard: (cardType, id) => void;
  activeCard: any;
  // Collected Props
  itemType: any;
  isDragging: boolean;
  connectDragSource: ConnectDragSource;
  connectDropTarget: ConnectDropTarget;
  connectDragPreview: ConnectDragPreview; // for drag & drop, user don't need pass component'
  canDrop: boolean;
  isOver: boolean;
  isChange?: boolean;
  toggleOpenAddEditModal?: (groupMode, groupId, isOwnerGroup, isAutoGroup, groupMember) => void;
  openGroupModal?: (groupMode, groupId, isOwnerGroup, isAutoGroup, groupMember) => void;
  handleDeleteGroup: (groupId) => void;
  getGroupName?: (groupName) => any;
  initializeListInfo?;
  handleGetInitializeListInfo?: (fieldBelong) => void;
  handleAddToFavorite: (groupId) => void;
  handleRemoveFromFavorite: (groupId) => void;
  handleConvertMyListToShareList?: (groupData) => void;
  menuType: number;
  setMenuType: any;
  handleReloadScreenLocalMenu: (type: any) => void;
  favouriteList: any;
  // fix bug #17420
  allList?: [] | any;
  reloadScreen?: (sidebarCurrentId) => void,
}

const GroupCard: React.FC<IGroupCardProps> = props => {
  const [isShowSubMenu, setIsShowSubMenu] = useState(false);
  const [subMenuHeight, setSubMenuHeight] = useState(0);
  const [subMenuWidth, setSubMenuWidth] = useState(0);
  const wrapperRef = useRef(null);
  const { initializeListInfo } = props;
  // const [active, setActive] = useState(props.menuType);
  const [, setActive] = useState(props.menuType);
  // const [activeCard, setActiveCard] = useState({ type: MENU_TYPE.ALL_PRODUCT_TRADING, cardId: null })
  const [, setActiveCard] = useState({ type: MENU_TYPE.ALL_PRODUCT_TRADING, cardId: null });
  


  /**
   * Get current node and set subMenuHeight, subMenuWidth
   */
  const subMenuRef = useCallback(node => {
    if (node !== null) {
      setSubMenuHeight(node.getBoundingClientRect().height);
      setSubMenuWidth(node.getBoundingClientRect().width);
    }
  }, []);
  useEffect(() => {
    props.sourceGroup['type'] = props.type;
  }, [props.sourceGroup]);

  useEffect(() => {
    props.connectDragPreview(getEmptyImage(), { captureDraggingState: false });
  }, []);

  /**
   * Condition to show icons on the control top
   */
  const onToggleShowFeaturesIcon = () => {
    let isOwner = false;
    switch (props.sourceGroup.participantType) {
      case PARTICIPANT_TYPE.VIEWER:
        isOwner = false;
        break;
      case PARTICIPANT_TYPE.OWNER:
        isOwner = true;
        break;
      default:
        break;
    }
    props.toggleShowFeaturesIcon(props.type, props.sourceGroup.listMode === LIST_MODE.AUTO, isOwner);
  };

  /**
   * Change format of filterConditions
   * @param arr
   */
  const getFilterConditions = arr => {
    const filters = [];
    let element = {};
    // let fieldValue = "";
    !isNullOrUndefined(arr) &&
      arr.length > 0 &&
      arr.map(list => {
        if (list.targetType === props.type && list.targetId === props.sourceGroup.listId) {
          list.filterConditions.length > 0 &&
            list.filterConditions.map(e => {
              delete e.fieldBelong;
              delete e.searchCondition;
              element = { ...e };
              filters.push(element);
            });
        }
      });
    return filters;
  };

  /**
   * Get conditions from api getInitializeListInfo
   */
  const getConditionSearch = () => {
    const conditions = [];
    if (!isNullOrUndefined(initializeListInfo)) {
      if (initializeListInfo.selectedTargetType === props.type && initializeListInfo.selectedTargetId === props.sourceGroup.listId) {
        conditions['filterConditions'] = getFilterConditions(initializeListInfo.filterListConditions);
        conditions['orders'] = initializeListInfo.orders;
      }
    }
    return conditions;
  };

  /**
   * Handle for filtering data when select group on sidebar menu
   * @param key
   * @param value
   */
  const onGroupSelected = (key, value, groupType) => {
    const listViewConditions = getConditionSearch();
    let selectedTargetType = SELECT_TARGET_TYPE.SHARE_LIST;
    if (groupType === MENU_TYPE.MY_GROUP) {
      selectedTargetType = SELECT_TARGET_TYPE.LIST;
    }
    props.handleGetInitializeListInfo(FIELD_BELONG.PRODUCT_TRADING);
    props.handleDataFilter(key, value, selectedTargetType, listViewConditions);
  };

  /**
   * Show dialog to confirm update auto group
   * @param sourceGroup
   */
  const showAutoGroupDialog = async sourceGroup => {
    const groupName = sourceGroup.listName;
    const result = await ConfirmDialog({
      title: <>{translate('employees.top.dialog.title-auto-group')}</>,
      message: translate('messages.WAR_EMP_0004', { groupName }),
      confirmText: translate('employees.top.dialog.confirm-auto-group'),
      confirmClass: 'button-red',
      cancelText: translate('employees.top.dialog.cancel-text'),
      cancelClass: 'button-cancel'
    });
    if (result) {
      props.handleUpdateAutoGroup(sourceGroup.listId);
    }
  };


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
      props.dragGroup(sourceGroup);
    }

    // props.dragGroup(sourceGroup);
  };

  /**
   * Add to favorite
   * @param sourceGroup
   */
  const addToFavorite = sourceGroup => {
    props.handleAddToFavorite(sourceGroup.listId);
  };
  /**
   * remove from favorite
   * @param sourceGroup
   */
  const removeFromFavorite = sourceGroup => {
    props.handleRemoveFromFavorite(sourceGroup.listId);
  };

  /**
   * Show dialog to confirm delete group
   * @param sourceGroup
   */
  const showDeleteGroupDialog = async sourceGroup => {
    const itemName = sourceGroup.listName;
    const result = await ConfirmDialog({
      title: <>{translate('sales.top.dialog.title-delete-group')}</>,
      message: translate('messages.WAR_COM_0001', { itemName }),
      confirmText: translate('sales.top.dialog.confirm-delete-group'),
      confirmClass: 'button-red',
      cancelText: translate('sales.top.dialog.cancel-text'),
      cancelClass: 'button-cancel'
    });
    if (result) {
      props.handleDeleteGroup(sourceGroup.listId);
      setActive(MENU_TYPE.ALL_PRODUCT_TRADING);
      props.handleReloadScreenLocalMenu(MENU_TYPE.ALL_PRODUCT_TRADING);
      props.setMenuType(MENU_TYPE.ALL_PRODUCT_TRADING);
      props.sidebarCurrentId(null);
      setActiveCard({ type: MENU_TYPE.ALL_PRODUCT_TRADING, cardId: null });
    }
  };

  const checkEditCondition = cardType => {
    return true;

    // if (cardType !== MENU_TYPE.SHARED_GROUP || props.sourceGroup.participantType === PARTICIPANT_TYPE.OWNER) {
    //   return true;
    // }
    // return false;
  };

  /**
   * Set position left, top for SubMenu
   */
  // const setPosition = () => {
  //   const element = document.getElementById(`${props.type + '' + props.sourceGroup.listId}`);
  //   let top = 0;
  //   let left = 0;
  //   if (element) {
  //     const elementBounding = element.getBoundingClientRect();
  //     const elementWithBottomSpace = window.innerHeight - elementBounding.top;
  //     top = elementWithBottomSpace < subMenuHeight + 2.5 * elementBounding.height ? -(subMenuHeight + 5) : elementBounding.height - 5;
  //     left = window.pageXOffset - (subMenuWidth - 10);
  //   }
  //   return { left, top };
  // };

  const hideSubMenu = () => {
    setIsShowSubMenu(false);
  };

  const onCopyList = type => {
    switch (type) {
      case MENU_TYPE.SHARED_GROUP:
        props.openGroupModal(
          SHARE_GROUP_MODES.MODE_COPY_GROUP,
          props.sourceGroup.listId,
          false,
          props.sourceGroup.listMode === LIST_MODE.AUTO,
          null
        );
        break;
      case MENU_TYPE.FAVORITE_GROUP:
        if (props.sourceGroup.listType === LIST_TYPE.MY_LIST) {
          props.toggleOpenAddEditModal(
            SHARE_GROUP_MODES.MODE_COPY_GROUP,
            props.sourceGroup.listId,
            false,
            props.sourceGroup.listMode === LIST_MODE.AUTO,
            null
          );
        } else {
          props.openGroupModal(
            SHARE_GROUP_MODES.MODE_COPY_GROUP,
            props.sourceGroup.listId,
            false,
            props.sourceGroup.listMode === LIST_MODE.AUTO,
            null
          );
        }
        break;
      default:
        props.toggleOpenAddEditModal(
          SHARE_GROUP_MODES.MODE_COPY_GROUP,
          props.sourceGroup.listId,
          false,
          props.sourceGroup.listMode === LIST_MODE.AUTO,
          null
        );
        break;
    }
  };
  const showLo = () => {
    console.log("list type: ", props.sourceGroup.listType);
  }

  /**
  * Set position left, top for SubMenu
  */
  const setPosition = () => {
    const element = document.getElementById(`${props.type + '' + props.sourceGroup.listId}`);
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

  const checkOwner = () => {
    const infoUserLogin = decodeUserLogin();
    const myId = parseInt(infoUserLogin['custom:employee_id'], 10);
    // const {myGroups, sharedGroups} = props.localMenu.initializeLocalMenu;
    // const newGroupData = [...myGroups ,...sharedGroups];
    // const valueOfList = newGroupData.filter(elm => _.toString(elm.listId) === _.toString(props.sidebarCurrentId));
    // if ( valueOfList && valueOfList[0]) {
    // const ownerList = jsonParse(valueOfList[0].ownerList);
    if (_.includes(props.sourceGroup.ownerList, myId)) {
      return true
    }
    // }
    return false
  }


  const SubMenuGroup = ({ type }) => {
    return (
      <div className="box-select-option version2 padding-10"
          id="submenu-group" 
      // ref={subMenuRef}
      ref={element => { 
        if (element){
          subMenuRef(element)
          // element.style.setProperty('left',  setPosition().left + 'px', 'important');
          element.style.setProperty('top',  setPosition().top + 'px', 'important');
          // element.style.setProperty('padding', '10px');
        } 
      }}
       style={{ left: setPosition().left}}
       >
        <ul>
          {props.sourceGroup.listMode === LIST_MODE.AUTO && ((type === MENU_TYPE.MY_GROUP || (type === MENU_TYPE.FAVORITE_GROUP && props.sourceGroup.listType === LIST_TYPE.MY_LIST)) || checkOwner()) && (
            <li
              className="text-left"
              onClick={() => {
                hideSubMenu();
                showAutoGroupDialog(props.sourceGroup);
              }}>
              {<a className='mt-1'>{translate('sales.group-card.submenu.update-list')}</a>}
            </li>
          )}
          <li
            className="text-left"
            onClick={() => {
              hideSubMenu();
              props.sourceGroup.displayOrderOfFavoriteList !== null ? removeFromFavorite(props.sourceGroup) : addToFavorite(props.sourceGroup) ;
            }}
          >
            {props.sourceGroup.displayOrderOfFavoriteList !== null
              ? <a className='mt-1'>{translate('sales.group-card.submenu.remove-to-favorite')}</a>
              : <a className='mt-1'>{translate('sales.group-card.submenu.add-to-favorite')}</a>}
              
          </li>
          {checkEditCondition(type) && (type === MENU_TYPE.MY_GROUP || (type === MENU_TYPE.FAVORITE_GROUP && props.sourceGroup.listType === LIST_TYPE.MY_LIST) || (type === MENU_TYPE.FAVORITE_GROUP && props.sourceGroup.listType === LIST_TYPE.SHARE_LIST) && checkOwner() ) && (
            <li
              className="text-left"
              onClick={() => {
                setIsShowSubMenu(false);
                showLo();
                // type === MENU_TYPE.MY_GROUP
                (props.sourceGroup.listType !== 1)
                  ? props.openGroupModal(
                    SHARE_GROUP_MODES.MODE_EDIT_GROUP,
                    props.sourceGroup.listId,
                    false,
                    props.sourceGroup.listMode === LIST_MODE.AUTO,
                    null
                  ) : props.toggleOpenAddEditModal(
                    SHARE_GROUP_MODES.MODE_EDIT_GROUP,
                    props.sourceGroup.listId,
                    false,
                    props.sourceGroup.listMode === LIST_MODE.AUTO,
                    null);
              }}
            >
              {<a className='mt-1'>{translate('sales.group-card.submenu.edit-group')}</a>}
            </li>
          )}
          {checkEditCondition(type) && type === MENU_TYPE.SHARED_GROUP && checkOwner() && (
            <li
              className="text-left"
              onClick={() => {
                setIsShowSubMenu(false);
                showLo();
                // type === MENU_TYPE.MY_GROUP
                props.sourceGroup.listType === 1
                  ? props.toggleOpenAddEditModal(
                    SHARE_GROUP_MODES.MODE_EDIT_GROUP,
                    props.sourceGroup.listId,
                    false,
                    props.sourceGroup.listMode === LIST_MODE.AUTO,
                    null )
                  : props.openGroupModal(
                    SHARE_GROUP_MODES.MODE_EDIT_GROUP,
                    props.sourceGroup.listId,
                    false,
                    props.sourceGroup.listMode === LIST_MODE.AUTO,
                    null
                  );
              }}>
              {<a className='mt-1'>{translate('sales.group-card.submenu.edit-group')}</a>}
            </li>
          )}
          {(checkOwner() ||  type === MENU_TYPE.MY_GROUP ) && (
            <li
              className="text-left"
              onClick={() => {
                setIsShowSubMenu(false);
                showDeleteGroupDialog(props.sourceGroup);
              }}>
              {<a className='mt-1'>{translate('sales.group-card.submenu.delete-group')}</a>}
            </li>
          )}
          <li
            className="text-left"
            onClick={() => {
              setIsShowSubMenu(false);
              onCopyList(type);
            }}>
            {<a className='mt-1'>{translate('sales.group-card.submenu.duplicate-group')}</a>}
          </li>
          {(type === MENU_TYPE.MY_GROUP || (type === MENU_TYPE.FAVORITE_GROUP && props.sourceGroup.listType === LIST_TYPE.MY_LIST)) && (
            <li
              className="text-left"
              onClick={() => {
                setIsShowSubMenu(false);
                showChangeListDialog(props.sourceGroup);
              }}>
              {<a className='mt-1'>{translate('sales.group-card.submenu.change-my-list-to-share-list')}</a>}
            </li>
          )}
        </ul>
      </div>
    );
  };

  /**
   * Handle for moving mouse out of submenu area
   * @param e
   */
  const handleMouseOut = e => {
    if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
      setIsShowSubMenu(false);
    }
  };
  useEventListener('mouseout', handleMouseOut);

  const executeDirtyCheck = async (action: () => void, cancel?: () => void) => {
    if (props.isChange) {
      await DialogDirtyCheck({ onLeave: action, onStay: cancel });
    } else {
      action();
    }
  };

  const actionClickGroup = () => {
    executeDirtyCheck(() => {
      props.getGroupName(props.sourceGroup.listName);
      props.setActiveCard(props.type, props.sourceGroup.listId);
      props.sidebarCurrentId(props.sourceGroup.listId);
      props.setTypeGroup(props.type);
      props.setMenuType(props.type);
      onGroupSelected('group_id', JSON.stringify(props.sourceGroup.listId), props.type);
      onToggleShowFeaturesIcon();
    });
  };

  const getClassNameDrag = () => {
    let classNameDrag = '';
    if (props.sourceGroup.listId !== 0) {
      classNameDrag += 'category d-flex';
    }
    if (props.isOver && props.canDrop && !props.isDragging) {
      if (props.itemType === SALES_GROUP_TYPE.SALE_LIST_CARD) {
        classNameDrag += ' d-flex active location-drop-drag';
      } else {
        classNameDrag += ' d-flex active';
      }
    }
    return classNameDrag;
  };

  const ownerList = jsonParse(props.sourceGroup.ownerList, { "employeeId": [] })
  const infoUserLogin = decodeUserLogin();
  const myId = parseInt(infoUserLogin['custom:employee_id'], 10)
  return props.connectDropTarget(
    props.connectDragSource(
      <li
        id={props.type + '' + props.sourceGroup.listId}
        onClick={() => {
          if (props.sourceGroup.listId !== 0) {
            actionClickGroup();
          }
        }}
        key={props.sourceGroup.listId}
      >
        <div
          className={"height-40 "+
            (props.activeCard !== null && props.activeCard.type === props.type && props.activeCard.cardId === props.sourceGroup.listId
              ? `active ${getClassNameDrag()}`
              : `${getClassNameDrag()}`)
          }
          ref={wrapperRef}
        >
          <a ref={wrapperRef} className={props.sourceGroup.listId !== 0 ? 'category-item' : ''}  >
            <Popover x={-20} y={50}>
              <span title={props.sourceGroup.listName}>{props.sourceGroup.listName}</span>
            </Popover>
          </a>
          <div
            className="more-option1 custom-height"
            ref={wrapperRef}
            onClick={e => {
              setIsShowSubMenu(!isShowSubMenu);
              e.stopPropagation();
            }}
          >
            {isShowSubMenu && <SubMenuGroup type={props.type} />}
          </div>
          {/* {props.sourceGroup.listMode === LIST_MODE.AUTO && props.sourceGroup.participantType === PARTICIPANT_TYPE.OWNER && ( */}
          {props.sourceGroup.listMode === LIST_MODE.AUTO && (includes(ownerList.employeeId, myId)||(props.type === MENU_TYPE.MY_GROUP || (props.type === MENU_TYPE.FAVORITE_GROUP && props.sourceGroup.listType === LIST_TYPE.MY_LIST))) && (
            <div
              className={'more-option2'}
              onClick={() =>
                props.sourceGroup.participantType === PARTICIPANT_TYPE.VIEWER ? null : showAutoGroupDialog(props.sourceGroup)
              }
            />
          )}
        </div>

      </li>

    )
  );
};

const dragSourceHOC = DragSource(
  SALES_GROUP_TYPE.SALE_LIST_CARD,
  {
    beginDrag: (props: IGroupCardProps) => ({ sourceGroup: props.sourceGroup }),
    endDrag(props: IGroupCardProps, monitor: DragSourceMonitor) {
      const item = monitor.getItem();
      const dropResult = monitor.getDropResult();
      if (dropResult) {
        props.dragGroup(item.sourceGroup, dropResult.targetGroup);
      }
    }
  },
  (connect: DragSourceConnector, monitor: DragSourceMonitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
    connectDragPreview: connect.dragPreview(),
    itemType: monitor.getItemType()
  })
);

const dropTargetHOC = DropTarget(
  [SALES_GROUP_TYPE.SALE_LIST_CARD, DND_ITEM_TYPE.DYNAMIC_LIST_ROW],
  {
    drop: ({ sourceGroup }: IGroupCardProps) => ({
      targetGroup: sourceGroup
    }),
    hover(props: IGroupCardProps, monitor: DropTargetMonitor, component: any) { },
    canDrop(props: IGroupCardProps, monitor: DropTargetMonitor) {
      const sourceDrag = monitor.getItem();
      const infoUserLogin = decodeUserLogin();
      const myId = parseInt(infoUserLogin['custom:employee_id'], 10)
      const ownerList = jsonParse(props.sourceGroup.ownerList, { "employeeId": [] })
      const activeList = props.allList.filter(elm => elm.listId === props.activeCard.cardId);

      // fix bug #17420
      if (activeList && activeList.length > 0) {
        const isOwnerActiveList = includes(activeList[0].ownerList, myId || _.toString(myId));
        if (!isOwnerActiveList && activeList[0].listMode === LIST_MODE.HANDED) {
          return false
        }
      }

      /**
       * drag item from dynamic list to local navigation
       * if user have in ownerList
       */
      if (includes(props.sourceGroup.ownerList, myId || _.toString(myId)) && sourceDrag.type === DND_ITEM_TYPE.DYNAMIC_LIST_ROW) {
        return true;
      }

      // can not drop to group is select
      if (props.activeCard.cardId === props.sourceGroup.listId) {
        return false;
      }

      // for drag&drop group to group
      if (sourceDrag.sourceGroup && props.sourceGroup.type !== sourceDrag.sourceGroup.type) {
        if (sourceDrag.sourceGroup.type === MENU_TYPE.MY_GROUP && props.sourceGroup.type === MENU_TYPE.SHARED_GROUP) {
          return true;
        }
      }

      // drag to group
      if (props.sourceGroup.type === SELECT_TARGET_TYPE.LIST || includes(ownerList.employeeId, myId)) {
        return true;
      }

      // drag to favorite
      if (props.sourceGroup.type === MENU_TYPE.FAVORITE_GROUP) {
        if (props.sourceGroup.listType !== LIST_TYPE.MY_LIST) {
          return false
        }
        return true;
      }

      /**
       * can not drag favorite to other group
       */

      return false;
    }
  },
  (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
  })
);

export default dropTargetHOC(dragSourceHOC(GroupCard));
