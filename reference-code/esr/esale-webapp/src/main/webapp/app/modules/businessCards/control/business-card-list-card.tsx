import React, { useState, useRef } from "react";
import { DragSourceMonitor, ConnectDragSource, DragSource, DragSourceConnector } from "react-dnd";
import { DropTarget, ConnectDropTarget, DropTargetMonitor } from "react-dnd";
import { MENU_TYPE, DND_BUSINESS_CARD_LIST_TYPE, SHARE_LISTS_MODES, MODE_SEARCH_LIST, TYPE_LIST, LIST_TYPES } from "../constants";
import { DND_ITEM_TYPE } from "app/shared/layout/dynamic-form/constants"
import { translate } from "react-jhipster";
import useEventListener from "app/shared/util/use-event-listener";
import ConfirmDialog from "app/shared/layout/dialog/confirm-dialog";
import Popover from 'app/shared/layout/common/Popover';
import { isNullOrUndefined } from 'util';
import { FIELD_BELONG } from 'app/config/constants';
import { CommonUtil } from 'app/modules/activity/common/common-util';

export interface IBusinessCardListCardProps {
  connectDropTarget: ConnectDropTarget
  isAdmin: boolean
  sourceBusinessCardList: any
  idActive,
  onClick: (id) => void,
  type: number,
  businessCardListActive,
  openGroupModal?
  onOpenAddEditMyBusinessCardModal?,
  onDuplicateMyBusinessCardModal?,
  removeFormFavoriteList?
  addListToFavorite?
  deleteList?
  // dragBusinessCardList: (sourceBusinessCardList, targetBusinessCardList) => void
  activeCard: any
  // connectDragSource: ConnectDragSource
  getGroupName?: (groupName) => any;
  setActiveCard: (cardType, id) => void
  sidebarCurrentId: (sidebarId) => void
  setTypeGroup: (type) => void
  toggleShowFeaturesIcon: (listId) => void
  initializeListInfo?
  handleGetInitializeListInfo?: (fieldBelong) => void
  handleDataFilter: (key, value, selectedTargetType, listViewCondition) => void
  canDrop: boolean
  isOver: boolean
  // isDragging: boolean
  // itemType: any,
  handleUpdateAutoList: (listId) => void,
  onMyListToShareList?: (list) => void
  dirtyCheck?: any;
  isOnDrag?: boolean;
}

const BusinessCardListCard: React.FC<IBusinessCardListCardProps> = (props) => {
  const [isShowSubMenu, setIsShowSubMenu] = useState(false);
  const refEdit = useRef(null);
  const deleteList = async (name, id) => {
    const result = await ConfirmDialog({
      title: (<>{translate('products.top.dialog.title-delete-products')}</>),
      message: translate("messages.WAR_COM_0001", { itemName: name }),
      confirmText: translate('products.top.dialog.confirm-delete-products'),
      confirmClass: "button-red",
      cancelText: translate('products.top.dialog.cancel-text'),
      cancelClass: "button-cancel"
    });
    if (result) {
      props.deleteList(id)
    }
  }
  const wrapperRef = useRef(null);
  const { initializeListInfo } = props

  const checkOwner = (item) => {
    if (item.listType === 2) {
      const employeeId = CommonUtil.getUserLogin().employeeId;
      const listOwner = JSON.parse(item.ownerList)['employeeId'];
      if (listOwner && listOwner.includes(employeeId.toString())) {
        return true;
      }
      return false;
    }
  }

  const SubMenuCategory = (item) => {
    const isOwner = checkOwner(item.item);
    let isListMode
    if (item.item.listMode === 2) {
      isListMode = true
    } else {
      isListMode = false
    }

    let isOverWrite = true
    if (item.item.isOverWrite === 0) {
      isOverWrite = false
    } else {
      isOverWrite = true
    }
    return (
      <div className="box-select-option active w-auto z-index-12" ref={refEdit}>
        <ul>
          {((item.item.listType === 2 && item.item.listMode === 2 && isOwner) || (item.item.listType === 1 && item.item.listMode === 2)) &&
            <li
              onClick={() => {
                setIsShowSubMenu(!isShowSubMenu);
                props.dirtyCheck(() => {
                  props.handleUpdateAutoList(item.item.listId)
                })
              }}
            >
              <a className="pl-0 pr-0" title="">{translate('businesscards.sidebar.card.btn-refresh-auto-list')}</a>
            </li>
          }
          {item.item.displayOrderOfFavoriteList &&
            <li
              onClick={() => {
                setIsShowSubMenu(!isShowSubMenu);
                props.dirtyCheck(() => {
                  props.removeFormFavoriteList(item.item.listId)
                })
              }}
            >
              <a className="pl-0 pr-0" title="">{translate('businesscards.sidebar.card.btn-remove-from-favorite')}</a>
            </li>
          }
          {!item.item.displayOrderOfFavoriteList &&
            <li
              onClick={() => {
                setIsShowSubMenu(!isShowSubMenu);
                props.dirtyCheck(() => {
                  props.addListToFavorite(item.item.listId)
                })
              }}
            >
              <a className="pl-0 pr-0" title="">{translate('businesscards.sidebar.card.btn-add-to-favorite')}</a>
            </li>
          }
          {item.item.listType === 1 && props.isAdmin &&
            <li
              onClick={() => {
                props.dirtyCheck(() => {
                  setIsShowSubMenu(!isShowSubMenu);
                  props.onOpenAddEditMyBusinessCardModal(true)
                })
              }}
            >
              <a className="pl-0 pr-0" title="">{translate('businesscards.sidebar.card.btn-edit-list')}</a>
            </li>
          }
          {(item.item.listType === 2 && isOwner) &&
            <li
              onClick={() => {
                props.dirtyCheck(() => {
                  setIsShowSubMenu(!isShowSubMenu);
                  props.openGroupModal(SHARE_LISTS_MODES.MODE_EDIT_GROUP, item.item.listId, isOverWrite, isListMode, null)
                })
              }}
            >
              <a className="pl-0 pr-0" title="">{translate('businesscards.sidebar.card.btn-edit-list')}</a>
            </li>
          }
          {
            (item.item.listType === 1 || (item.item.listType === 2 && isOwner)) &&
            <li
              onClick={() => {
                props.dirtyCheck(() => {
                  setIsShowSubMenu(!isShowSubMenu);
                  deleteList(item.item.listName, item.item.listId)
                })
              }}
            >
              <a className="pl-0 pr-0" title="">{translate('businesscards.sidebar.card.btn-delete-list')}</a>
            </li>
          }
          {
            item.item.listType === 1 &&
            <li
              onClick={() => {
                setIsShowSubMenu(!isShowSubMenu);
                props.dirtyCheck(() => props.onDuplicateMyBusinessCardModal())
              }}
            >
              <a className="pl-0 pr-0" title="">{translate('businesscards.sidebar.card.btn-duplicate-list')}</a>
            </li>
          }
          {
            item.item.listType === 2 &&
            <li
              onClick={() => {
                props.dirtyCheck(() => {
                  setIsShowSubMenu(!isShowSubMenu);
                  props.openGroupModal(SHARE_LISTS_MODES.MODE_COPY_GROUP, item.item.listId, isOverWrite, isListMode, null)
                })
              }}
            >
              <a className="pl-0 pr-0" title="">{translate('businesscards.sidebar.card.btn-duplicate-list')}</a>
            </li>
          }
          {
            item.item.listType === 1 &&
            <li
              onClick={() => {
                props.dirtyCheck(() => {
                  setIsShowSubMenu(!isShowSubMenu);
                  props.onMyListToShareList(item.item)
                })
              }}
            >
              <a className="pl-0 pr-0" title="">{translate('businesscards.sidebar.card.change-to-shared-list')}</a>
            </li>
          }
        </ul>
      </div>
    )
  }

  const handleMouseDown = (e) => {
    if (!refEdit || !refEdit.current) {
      return;
    }
    if (refEdit.current && refEdit.current.contains(e.target)) {
      return;
    }
    setIsShowSubMenu(false);
  }
  useEventListener("mousedown", handleMouseDown);

  /**
   * @param sourceList
   */
  const showAutoList = (sourceList) => {
    props.handleUpdateAutoList(sourceList.listId);
  }
  /**
   * Condition to show icons on the control top
   */
  const onToggleShowFeaturesIcon = () => {
    props.toggleShowFeaturesIcon(props.sourceBusinessCardList.listId);
  }

  /**
   * Change format of filterConditions
   * @param arr
   */
  const getFilterConditions = (arr) => {
    const filters = [];
    !isNullOrUndefined(arr) && arr.length > 0 && arr.map(list => {
      if (list.targetType === props.type && list.targetId === props.sourceBusinessCardList.listId) {
        list.filterConditions.length > 0 && list.filterConditions.map(e => {
          delete e.fieldBelong;
          delete e.searchCondition;
          filters.push({ ...e });
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
      if (initializeListInfo.selectedTargetType === props.type && initializeListInfo.selectedTargetId === props.sourceBusinessCardList.listId) {
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
    let selectedTargetType = TYPE_LIST.SHARED_LIST
    if (groupType === MENU_TYPE.MY_LIST) {
      selectedTargetType = TYPE_LIST.MY_LIST;
    }
    props.handleGetInitializeListInfo(FIELD_BELONG.BUSINESS_CARD);
    props.handleDataFilter(key, value, selectedTargetType, listViewConditions);
  }

  /**
   * Handle for moving mouse out of submenu area
   * @param e
   */
  const handleMouseOut = (e) => {
    if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
      // setIsShowSubMenu(false);
    }
  }
  useEventListener('mouseout', handleMouseOut);

  const actionClickGroup = () => {
    props.dirtyCheck(() => {
      props.sidebarCurrentId(props.sourceBusinessCardList.listId);
      props.setTypeGroup(props.type);
      onGroupSelected("list_id", JSON.stringify(props.sourceBusinessCardList.listId), props.type);
      onToggleShowFeaturesIcon();
      props.onClick({ id: props.sourceBusinessCardList.listId, type: props.type });
      props.businessCardListActive(props.sourceBusinessCardList.listId, props.type, props.sourceBusinessCardList)
      props.setActiveCard(props.type, props.sourceBusinessCardList.listId);
    })
  }

  const getClassNameDrag = () => {
    let classNameDrag = "";
    if (props.sourceBusinessCardList.listId !== 0) {
      classNameDrag += "category d-flex";
    }
    if (props.isOver && props.canDrop) {
      classNameDrag += " d-flex active location-drop-drag";
    }
    return classNameDrag;
  }

  const checkViewer = (list) => {
    const employeeId = CommonUtil.getUserLogin().employeeId;
    if (list.listType === 2) {
      const listViewer = JSON.parse(list.viewerList)['employeeId'];
      if (listViewer && listViewer.includes(employeeId.toString())) {
        return true;
      }
      return false;
    }
  }

  return props.connectDropTarget(
    <li
      id={props.type + '' + props.sourceBusinessCardList.listId}
      key={props.sourceBusinessCardList.listId}>
      <div
        className={"height-40 " +
          ((props.activeCard !== null &&
            props.activeCard.type === props.type &&
            props.activeCard.cardId === props.sourceBusinessCardList.listId) ? `active ${getClassNameDrag()}` : `${getClassNameDrag()}`)
        } ref={wrapperRef}>
        <a onClick={() => { if (props.sourceBusinessCardList.listId !== 0) { actionClickGroup() } }} ref={wrapperRef} className={props.sourceBusinessCardList.listId !== 0 ? "category-item" : ""}>
          <Popover x={-20} y={50} >
            <span className="zindex-1" title={props.sourceBusinessCardList.listName}>{props.sourceBusinessCardList.listName}</span>
          </Popover>
        </a>
        <div className="more-option1" ref={wrapperRef} onClick={(e) => { setIsShowSubMenu(!isShowSubMenu); e.stopPropagation(); }}>
        </div>
        {isShowSubMenu && <SubMenuCategory item={props.sourceBusinessCardList} />}
        {props.sourceBusinessCardList.listMode === 2 &&
          <div className={(checkOwner(props.sourceBusinessCardList) || !checkViewer(props.sourceBusinessCardList)) ? "more-option2" : "more-option2 disabled"}
            onClick={() => (checkOwner(props.sourceBusinessCardList) || !checkViewer(props.sourceBusinessCardList)) ? props.dirtyCheck(() => { showAutoList(props.sourceBusinessCardList) }) : null} />
        }
      </div>
    </li>
  )
}

// const dragSourceHOC = DragSource(
//   DND_BUSINESS_CARD_LIST_TYPE.CARD,
//   {
//     beginDrag: (props: IBusinessCardListCardProps) => ({ type: DND_BUSINESS_CARD_LIST_TYPE.CARD, sourceBusinessCardList: props.sourceBusinessCardList }),
//     // endDrag(props: IBusinessCardListCardProps, monitor: DragSourceMonitor) {
//     //   const item = monitor.getItem();
//     //   const dropResult = monitor.getDropResult();
//     //   props.dragBusinessCardList(item.sourceBusinessCardList, dropResult.targetBusinessCardList);
//     // },
//     canDrag(props: IBusinessCardListCardProps, monitor: DragSourceMonitor) {
//       if (props.sourceBusinessCardList.listId !== 0) {
//         return true;
//       }
//       return false;
//     }
//   },
//   (connect: DragSourceConnector, monitor: DragSourceMonitor) => ({
//     connectDragSource: connect.dragSource(),
//     isDragging: monitor.isDragging(),
//     connectDragPreview: connect.dragPreview(),
//     itemType: monitor.getItemType(),
//   }),
// );

const dropTargetHOC = DropTarget(
  [DND_BUSINESS_CARD_LIST_TYPE.CARD, DND_ITEM_TYPE.DYNAMIC_LIST_ROW],
  {
    drop: ({ sourceBusinessCardList }: IBusinessCardListCardProps) => ({
      targetBusinessCardList: sourceBusinessCardList,
    }),
    hover(props: IBusinessCardListCardProps, monitor: DropTargetMonitor, component: any) {
    },
    canDrop(props: IBusinessCardListCardProps, monitor: DropTargetMonitor) {
      if (props.sourceBusinessCardList.listType === LIST_TYPES.SHARED_LIST) {
        // const index = JSON.parse(props.sourceBusinessCardList.ownerList).employeeId.findIndex(e => Number(e) === props.sourceBusinessCardList.employeeId);
        // if (index >= 0) {
        //   return true;
        // } else {
        //   return false;
        // }
        const employeeId = CommonUtil.getUserLogin().employeeId;
        const listOwner = JSON.parse(props.sourceBusinessCardList.ownerList)['employeeId'];
        if (listOwner && listOwner.includes(employeeId.toString())) {
          return true;
        }
        return false;
      }
      if (!props.isOnDrag) {
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

// export default dropTargetHOC(dragSourceHOC(BusinessCardListCard))
export default dropTargetHOC(BusinessCardListCard)