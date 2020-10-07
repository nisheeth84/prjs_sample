import React, { useState, useEffect, useRef, useCallback } from 'react';
import { IRootState } from 'app/shared/reducers';
import { DragSourceMonitor, ConnectDragSource, DragSource, DragSourceConnector, ConnectDragPreview } from 'react-dnd';
import { DropTarget, ConnectDropTarget, DropTargetMonitor } from 'react-dnd';
import ConfirmDialog from 'app/shared/layout/dialog/confirm-dialog';
import { translate } from 'react-jhipster';
import { TranslatorContext, Storage } from 'react-jhipster';
import { CUSTOMER_LIST_TYPE, CUSTOMER_MY_LIST_MODES, SHARE_LIST_MODES, PARTICIPANT_TYPE, LIST_TYPE } from './../constants';
import { DND_ITEM_TYPE } from 'app/shared/layout/dynamic-form/constants';
import DialogDirtyCheck from 'app/shared/layout/common/dialog-dirty-check';
import useEventListener from 'app/shared/util/use-event-listener';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { isNil } from 'lodash';
import _ from 'lodash';
import { isNullOrUndefined } from 'util';
import { FIELD_BELONG } from 'app/config/constants';
import Popover from 'app/shared/layout/common/Popover';


export interface ICustomerControlListCardProps {
  typeList: number,
  sourceList: any;
  dragList?: (sourceListCustomer, targetListCustomer) => void
  addListToAutoList?: (listId) => void
  actionActiveCardList: (typeList, cardList, listViewCondition) => void
  isDragging: boolean
  connectDragSource: ConnectDragSource
  connectDragPreview: ConnectDragPreview // for drag & drop, user don't need pass component'
  connectDropTarget: ConnectDropTarget
  isOver: boolean,
  itemType: any,
  canDrop: boolean
  activeCardList?: any
  keyType: string
  setKeyType: (keyType) => void
  toggleOpenAddEditModal?: (listType, myListModalMode, currentListId, isOwnerList?: boolean, isAutoList?: boolean, listMembers?: any) => void
  initializeListInfo?
  handleGetInitializeListInfo?: (fieldBelong) => void,
  favouriteList?: any,
  addListToFavouriteList?: (listId) => void,
  removeListInFavourite?: (listId) => void,
  deleteList?: (listId) => void,
}

/**
 * List Card in Sidebar
 * @param props
 */
const CustomerControlListCard: React.FC<ICustomerControlListCardProps> = (props) => {
  const toggleRef = useRef(null);
  const [isShowMoreOption, setShowMoreOption] = useState(false);
  const wrapperRef = useRef(null);
  const [subMenuHeight, setSubMenuHeight] = useState(0);
  const [subMenuWidth, setSubMenuWidth] = useState(0);

  const subMenuRef = useCallback((node) => {
    if (node !== null) {
      setSubMenuHeight(node.getBoundingClientRect().height);
      setSubMenuWidth(node.getBoundingClientRect().width);
    }
  }, []);

  useEffect(() => {
    props.connectDragPreview(getEmptyImage(), { captureDraggingState: false });
  }, []);

  /**
   * Handle for clicking the outside of dropdown
   * @param e
   */
  const handleClickOutsideRegistration = (e) => {
    if (toggleRef.current && !toggleRef.current.contains(e.target)) {
      setShowMoreOption(false);
    }
  }

  /**
   * Open modal edit modal list and shared
   */
  const handleToggleEditModal = () => {
    if (props.sourceList.customerListType === LIST_TYPE.MY_LIST) {
      props.toggleOpenAddEditModal(
        CUSTOMER_LIST_TYPE.MY_LIST,
        CUSTOMER_MY_LIST_MODES.MODE_EDIT_LIST,
        props.sourceList && props.sourceList.listId)
    } else if (props.sourceList.customerListType === LIST_TYPE.SHARE_LIST) {
      props.toggleOpenAddEditModal(
        CUSTOMER_LIST_TYPE.SHARED_LIST,
        SHARE_LIST_MODES.MODE_EDIT_LIST,
        props.sourceList && props.sourceList.listId,
        false,
        props.sourceList && props.sourceList.isAutoList,
        null)
    }
  }

  /**
   * Open modal edit modal list and shared
   */
  const handleToggleCopyModal = () => {
    if (props.sourceList.customerListType === LIST_TYPE.MY_LIST) {
      props.toggleOpenAddEditModal(
        CUSTOMER_LIST_TYPE.MY_LIST,
        CUSTOMER_MY_LIST_MODES.MODE_COPY_LIST,
        props.sourceList && props.sourceList.listId)
    } else if (props.sourceList.customerListType === LIST_TYPE.SHARE_LIST) {
      props.toggleOpenAddEditModal(
        CUSTOMER_LIST_TYPE.SHARED_LIST,
        SHARE_LIST_MODES.MODE_COPY_LIST,
        props.sourceList && props.sourceList.listId,
        false,
        props.sourceList && props.sourceList.isAutoList,
        null)
    }
  }


  /**
   * Open modal edit modal list and shared
   */
  const handleToggleSwichModal = () => {
    props.toggleOpenAddEditModal(
      CUSTOMER_LIST_TYPE.SHARED_LIST,
      SHARE_LIST_MODES.MODE_SWICH_LIST_TYPE,
      props.sourceList && props.sourceList.listId,
      false,
      props.sourceList && props.sourceList.isAutoList,
      null)

  }

  /**
   * event listener when click
   */
  useEventListener('click', handleClickOutsideRegistration);

  const getClassNameDrag = () => {
    let classNameDrag = "";
    if (props.sourceList.listId !== 0) {
      classNameDrag += "category d-flex";
    }
    if (props.keyType === (props.sourceList.listId.toString() + props.typeList.toString()) && props.activeCardList.listId === props.sourceList.listId) {
      classNameDrag += " active";
    }
    if (props.isOver && props.canDrop && !props.isDragging) {
      if (props.itemType === CUSTOMER_LIST_TYPE.CARD) {
        classNameDrag += " d-flex active location-drop-drag";
      } else {
        classNameDrag += " d-flex active";
      }
    }
    return classNameDrag;
  }

  /**
  * Change format of filterConditions
  * @param arr
  */
  const getFilterConditions = (arr, cardList) => {
    const filters = [];
    let element = {};
    // let fieldValue = "";
    !isNullOrUndefined(arr) && arr.length > 0 && arr.map(list => {
      if (list.targetId === cardList.listId) {
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
  const getConditionSearch = (cardList) => {
    const conditions = [];
    if (!isNullOrUndefined(props.initializeListInfo)) {
      conditions['filterConditions'] = getFilterConditions(props.initializeListInfo.filterListConditions, cardList);
      conditions['orderBy'] = props.initializeListInfo.orderBy;
    }
    return conditions;
  }

  /**
   * Action when click a Cardlist
   * @param cardList
   */
  const actionClickListId = (cardList) => {
    if (cardList.listId === props.activeCardList.listId && cardList.typeList === props.activeCardList.typeList) {
      return;
    }
    props.setKeyType(cardList.listId.toString() + props.typeList.toString());
    const listViewCondition = getConditionSearch(cardList);
    props.actionActiveCardList(props.typeList, cardList, listViewCondition);
  }

  const handleMouseOut = (e) => {
    if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
      setShowMoreOption(false);
    }
  }
  useEventListener('mousemove', handleMouseOut);

  const checkFavouriteList = () => {
    return props.favouriteList && props.favouriteList.some(item => item.listId === props.sourceList.listId);
  }


  const setPosition = () => {
    const element = document.getElementById(`${props.typeList + '' + props.sourceList.listId}`);
    let top = 0;
    let left = 0;
    if (element) {
      const elementBounding = element.getBoundingClientRect();
      const elementWithBottomSpace = window.innerHeight - elementBounding.top;
      top = elementWithBottomSpace < (subMenuHeight + elementBounding.height) ? -(subMenuHeight + 5) : (elementBounding.height - 5);
      left = window.pageXOffset - (subMenuWidth - 10);
    }
    return { left, top };
  }

  return props.connectDropTarget(props.connectDragSource(

    <li
      ref={toggleRef}
      key={props.keyType}
      id={props.typeList + '' + props.sourceList.listId}
    >
      <div ref={wrapperRef} className={getClassNameDrag()} onClick={() => actionClickListId(props.sourceList)}>
        <a className="category-item">
          <Popover x={-20} y={50}>
            <span>{props.sourceList.listName}</span>
          </Popover>
        </a>
        <div className="more-option1" onClick={(e) => { setShowMoreOption(!isShowMoreOption); e.stopPropagation(); }}>
          {isShowMoreOption &&
            <div className="box-select-option version2 text-leftbox-select-option version2 text-left z-index-4" ref={subMenuRef} style={{ left: setPosition().left, top: setPosition().top, transform: 'translateX(22px)' }}>
              <ul>
                {props.sourceList.participantType === PARTICIPANT_TYPE.OWNER && props.sourceList.isAutoList &&
                  <li onClick={(e) => { props.addListToAutoList(props.sourceList); e.stopPropagation(); }}>
                    {translate('customers.sidebar.option.update-list')}
                  </li>
                }
                {props.typeList !== CUSTOMER_LIST_TYPE.FAVORITE_LIST && !checkFavouriteList()
                  ? <li onClick={(e) => { props.addListToFavouriteList(props.sourceList); e.stopPropagation(); }}>
                    {translate('customers.sidebar.option.add-to-favorites-list')}
                  </li>
                  : <li onClick={(e) => { props.removeListInFavourite(props.sourceList); e.stopPropagation(); }}>
                    {translate('customers.sidebar.option.remove-from-favorites-list')}
                  </li>
                }
                {props.sourceList.participantType === PARTICIPANT_TYPE.OWNER &&
                  <>
                    <li onClick={(e) => { handleToggleEditModal(); e.stopPropagation(); }}>
                      {translate('customers.sidebar.option.edit-list')}
                    </li>
                    <li onClick={(e) => { props.deleteList(props.sourceList); e.stopPropagation(); }} >
                      {translate('customers.sidebar.option.delete-list')}
                    </li>
                  </>
                }
                <li onClick={(e) => { handleToggleCopyModal(); e.stopPropagation(); }}>
                  {translate('customers.sidebar.option.duplicate-list')}
                </li>
                {props.sourceList.customerListType === LIST_TYPE.MY_LIST &&
                  <li onClick={(e) => { handleToggleSwichModal(); e.stopPropagation(); }}>
                    {translate('customers.sidebar.option.change-to-shared-list')}
                  </li>
                }
              </ul>
            </div>
          }
        </div>
        {/* not Ower, not list manual => no display  */}
        {
          (props.sourceList.participantType === PARTICIPANT_TYPE.OWNER && props.sourceList.isAutoList) &&
          <div className="more-option2" onClick={(e) => { props.addListToAutoList(props.sourceList); e.stopPropagation() }} />
        }
      </div>
    </li>

  ))
}

const dragSourceHOC = DragSource(
  CUSTOMER_LIST_TYPE.CARD,
  {
    beginDrag: (props: ICustomerControlListCardProps) => ({ sourceList: props.sourceList }),
    endDrag(props: ICustomerControlListCardProps, monitor: DragSourceMonitor) {
      const item = monitor.getItem()
      const dropResult = monitor.getDropResult()
      if (dropResult) {
        props.dragList(item.sourceList, dropResult.targetListCustomer);
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
  [DND_ITEM_TYPE.DYNAMIC_LIST_ROW,
  CUSTOMER_LIST_TYPE.CARD],
  {
    drop: ({ sourceList }: ICustomerControlListCardProps) => ({
      targetListCustomer: sourceList,
    }),
    hover(props: ICustomerControlListCardProps, monitor: DropTargetMonitor, component: any) {
    },
    canDrop(props: ICustomerControlListCardProps, monitor: DropTargetMonitor) {
      const sourceDrag = monitor.getItem();
      // can not drop to group is select
      if (sourceDrag.type === DND_ITEM_TYPE.DYNAMIC_LIST_ROW && props.activeCardList && props.activeCardList.listId === props.sourceList.listId) {
        return false;
      }

      // can drop row to list member or list active member
      if (sourceDrag.type === DND_ITEM_TYPE.DYNAMIC_LIST_ROW &&
        (props.sourceList.participantType === PARTICIPANT_TYPE.MEMBER || props.activeCardList.participantType === PARTICIPANT_TYPE.MEMBER)) {
        return false;
      }

      // can drop row if list 
      if (sourceDrag.type === DND_ITEM_TYPE.DYNAMIC_LIST_ROW && props.sourceList.participantType === PARTICIPANT_TYPE.MEMBER) {
        return false;
      }

      // for drag&drop to favoritelist
      if (sourceDrag.sourceList && (sourceDrag.sourceList.customerListType === LIST_TYPE.MY_LIST || sourceDrag.sourceList.customerListType === LIST_TYPE.SHARE_LIST)) {
        if (props.sourceList.listId && props.sourceList.isFavorite && !sourceDrag.sourceList.isFavorite) {
          // if source drag not exist in favourite list => can drag
          return !props.favouriteList.some(item => item.listId === sourceDrag.sourceList.listId);
        }
      }

      // can drag if list member
      if (sourceDrag.sourceList && sourceDrag.sourceList.participantType === PARTICIPANT_TYPE.MEMBER) {
        return false;
      }

      if (sourceDrag.type === DND_ITEM_TYPE.DYNAMIC_LIST_ROW && props.sourceList) {
        if (props.sourceList.participantType === PARTICIPANT_TYPE.OWNER) {
          return true;
        }
      }

      // for drag&drop mylist to sharelist
      if (sourceDrag.sourceList && (props.sourceList.customerListType !== sourceDrag.sourceList.customerListType) && !sourceDrag.sourceList.isFavorite) {
        if (sourceDrag.sourceList.customerListType === LIST_TYPE.MY_LIST &&
          props.sourceList.customerListType === LIST_TYPE.SHARE_LIST) {
          return true;
        }
      }
      return false;
    },
  },
  (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
  }),
);

export default dropTargetHOC(dragSourceHOC(CustomerControlListCard));