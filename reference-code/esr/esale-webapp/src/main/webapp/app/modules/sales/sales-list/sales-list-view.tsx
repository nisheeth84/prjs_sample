import React, { useEffect, useState, useCallback, useRef } from 'react';
import _ from 'lodash';
import {
  getDraggedDom,
  getDropDom,
  computedDOM,
  inititialData,
  // getDomPlaceholderContext,
  // createCloneCard,
  filterByFieldInfoProgress,
  mapColorWithFieldInfo,
  getBoundingRectDom,
  progressDragTrading,
  handleScrollWhenDragging
} from '../utils';
import { DragDropContext } from 'react-beautiful-dnd';
import cloneDeep from 'lodash/cloneDeep';

import SwitchFieldPanelCustom from '../components/switch-field-custom/switch-field-panel-custom';
import EachColumnProductTrading from '../components/product-trading-card/each-column-product-trading';
import { TYPE_DRAG, TYPE_DROP } from '../constants';
import { closest } from 'app/shared/util/dom-element';

export interface ISalesListView {
  setListViewChecked: (ids) => void;
  listViewChecked: any;
  onUnmountSalesListCard: () => void;

  onDrop: (data: any) => void;
  tradingList: any[];
  setTradingList: any;
  productTradings: any;
  fieldInfoProgresses: any[] | {};
  productTradingsByProgress: any;
  onOpenPopupEmployeeDetail: (employeeId: any) => void;
  onOpenPopupCustomerDetail: (customerId, fieldId) => void;
  onOpenPopupProductDetail: (productId) => void;
  changeDisplayOn: boolean;
  fieldBelong: any;
  progresses: any;
  dataSource: any;
  dataTarget: any;
  settingDate: any;
  onCloseSwitchDisplay?: () => void;
  onScrollToEndEachColumn: (productTrading) => void;
  onChooseField: (listItemChecked) => void;
  onDragField: (fieldSrc, fieldTargetId) => void;
}

interface IPlaceHolderProps {
  clientY?: number;
  clientHeight?: number;
  clientWidth?: number;
}

const SalesListView = (props: ISalesListView) => {
  const [indexOfColumnDragging, setIndexOfColumnDragging] = useState(null);
  const isFirstRun = useRef(true);
  const wrapViewContainer = useRef(null);
  const { tradingList, setTradingList } = props;

  /** Place holder when dragging */
  const [placeholderProps, setPlaceholderProps] = useState<IPlaceHolderProps>({});

  const initialize = () => {
    if (props.productTradingsByProgress) {
      const { progresses, productTradingsByProgress, fieldInfo } = props.productTradingsByProgress;
      if (progresses && productTradingsByProgress) {
        const newDataInitital = _.uniqBy(
          [
            ...mapColorWithFieldInfo(
              filterByFieldInfoProgress(
                props.fieldInfoProgresses,
                inititialData(progresses, productTradingsByProgress)
              ),
              fieldInfo,
              progresses,
            )
          ],
          'productTradingProgressId'
        );

        setTradingList(newDataInitital);
      }
    }
  };

  useEffect(() => {
    return () => {
      props.onUnmountSalesListCard();
    };
  }, []);

  useEffect(() => {
    initialize();
  }, [props.productTradingsByProgress, props.fieldInfoProgresses]);

  /** Equal height for columns */
  /** It execute only one when content-items available */
  useEffect(() => {
    if (isFirstRun.current) {
      const contentItems = document.querySelectorAll('.contents-items');
      const droppableArea: any = document.querySelectorAll('.sale-list-card-droppable');
      if (contentItems.length > 0) {
        const heightLargest = computedDOM(contentItems).getMaxHeight();
        const marginTop = computedDOM(contentItems).getMaxMarginTop();

        /** Set min-height for droppableArea */
        droppableArea.forEach(node => {
          node.style.minHeight = `${heightLargest + marginTop}px`;
        });
      }
      if (contentItems.length > 0) {
        isFirstRun.current = false;
      }
    }
  }, []);

  /** Function */
  const checkItem = (event, item, columnIdx, customerIdx) => {
    item.checked = event.target.checked;
    const newTradingList = _.cloneDeep(tradingList);

    const progress = newTradingList[columnIdx].customers[customerIdx];

    let newProductTradingCheckedList = _.cloneDeep(props.listViewChecked);

    if (item.checked) {
      newProductTradingCheckedList = _.uniqBy(
        [
          ...newProductTradingCheckedList,
          ...progress.productTradings.map(trading => ({
            productTradingId: trading.productTradingId,
            updatedDate: trading.updatedDate
          }))
        ],
        'productTradingId'
      );
      props.setListViewChecked(newProductTradingCheckedList);
    } else {
      const listProductTradingId = progress.productTradings.map(el => el.productTradingId);
      newProductTradingCheckedList = newProductTradingCheckedList.filter(
        el => !listProductTradingId.includes(el.productTradingId)
      );
      props.setListViewChecked(newProductTradingCheckedList);
    }

    setTradingList(newTradingList);
  };

  const expandItem = (event, item, columnIdx, customerIdx) => {
    event.preventDefault();
    const nextTradingList = _.cloneDeep(tradingList);
    item.expand = !item.expand;
    if (nextTradingList[columnIdx] && nextTradingList[columnIdx].customers) {
      nextTradingList[columnIdx].customers[customerIdx] = item;
      setTradingList(nextTradingList);
    }
  };

  const calculatePositionOfDropNode = (domContainerElement, index) => {
    const titleNode = document.querySelectorAll('.items-title');
    const itemNode = getBoundingRectDom(domContainerElement);

    const heightOfTitleNode = computedDOM(titleNode).getMaxHeight();
    const marginTopOfThisNode = parseFloat(itemNode.marginTop);

    const itemEls = domContainerElement.querySelectorAll('[data-rbd-draggable-context-id]');

    let totalHeightOtherItem = 0;
    for (let i = 0; i < index; i++) {
      const itemEl = itemEls[i];
      const style = itemEl.currentStyle || window.getComputedStyle(itemEl);
      const marginBottom = +(style.marginBottom + '').replace(/[^\d]/g, '');
      const marginTop = +(style.marginTop + '').replace(/[^\d]/g, '');
      totalHeightOtherItem += itemEl.clientHeight + marginBottom + marginTop;
    }

    const clientY = totalHeightOtherItem + marginTopOfThisNode + heightOfTitleNode + 20;

    return clientY;
  };

  const onBeforeDragStart = () => {
    // Fix bug drag not support in container scroll
    handleScrollWhenDragging(true);
  }

  /**
   * Fired when drag-drop start
   */
  const onDragStart = useCallback(
    result => {
      const { draggableId } = result;

      const columnIndex = draggableId.split('.')[1];
      setIndexOfColumnDragging(+columnIndex);

      const draggedDOM: any = getDraggedDom(draggableId);

      if (!draggedDOM) {
        return;
      }

      const { offsetHeight } = draggedDOM;

      const { offsetWidth } = !/^trading/i.test(draggableId)
        ? draggedDOM
        : closest(draggedDOM, '[data-rbd-draggable-context-id]');

      setPlaceholderProps(currentVal => ({
        ...currentVal,
        clientHeight: offsetHeight,
        clientWidth: offsetWidth
      }));
    },
    [tradingList, placeholderProps]
  );

  /**
   * Fired when drag-drop update
   */
  const onDragUpdate = useCallback(
    result => {
      const { destination } = result;

      if (!destination) {
        return;
      }
      const { droppableId, index: destinationIndex } = destination;

      const droppableDOM: any = getDropDom(droppableId);

      if (!droppableDOM) {
        return;
      }

      const clientY = calculatePositionOfDropNode(droppableDOM, destinationIndex);

      setPlaceholderProps(currentVal => ({
        ...currentVal,
        clientY
      }));
      return;
    },
    [tradingList, placeholderProps]
  );

  /**
   * raise when drag-drop finished
   * @param dragResult
   */
  const onDragEnd = dragResult => {
    let nextTradingList;
    const { source, destination, draggableId } = dragResult;
    const typeDrag = draggableId.split('.')[0];

    // When drag end - reset index to null
    setIndexOfColumnDragging(null);

    // Reset placeholder position
    setPlaceholderProps({});

    // Fix bug drag not support in container scroll
    handleScrollWhenDragging(false);

    if (_.isEqual(source, destination)) {
      return;
    }

    // If drag Trading
    if (typeDrag === TYPE_DRAG.TRADING) {
      if (destination) {
        let progressIdDestination;
        const newTradingList = cloneDeep(tradingList);

        const tradingIdx = draggableId.split('.')[draggableId.split('.').length - 1];
        const customerIdx = draggableId.split('.')[draggableId.split('.').length - 2];
        const columnIdx = draggableId.split('.')[draggableId.split('.').length - 3];

        const itemTrading =
          newTradingList[columnIdx].customers[customerIdx].productTradings[tradingIdx];
        itemTrading.productTradings = [];

        const typeDestination = destination.droppableId.split('.')[0];
        const columnDestinationIdx = destination.droppableId.split('.')[1];
        if (typeDestination === TYPE_DROP.COLUMN) {
          if (columnIdx.toString() === columnDestinationIdx.toString()) {
            return;
          }

          const columnSource = newTradingList[columnIdx];
          const columnDestination = newTradingList[columnDestinationIdx];

          columnSource.customers[customerIdx].productTradings.splice(source.index, 1);
          newTradingList[columnDestinationIdx] = cloneDeep(
            progressDragTrading(columnDestination, itemTrading)
          );

          progressIdDestination = columnDestination.productTradingProgressId;
          nextTradingList = newTradingList;

          setTradingList(nextTradingList);

          const parseParam = {
            productTradingIds: [itemTrading.productTradingId],
            updateFields: [
              {
                fieldName: 'product_trading_progress_id',
                fieldValue: progressIdDestination.toString()
              }
            ]
          };
          props.onDrop(parseParam);
        }
      }
    }

    // If drag customer
    if (typeDrag === TYPE_DRAG.CUSTOMER) {
      if (destination) {
        const idSourceColumn = parseInt(source.droppableId.split('.').pop(), 10);
        const idDestinationColumn = parseInt(destination.droppableId.split('.').pop(), 10);
        const indexCustomer = parseInt(
          draggableId.split('.')[draggableId.split('.').length - 1],
          10
        );

        let itemToProcess: any = {};
        /** Source and Destination is same column */
        if (idSourceColumn === idDestinationColumn) {
          const newTradingList = cloneDeep(tradingList);

          /** Detect column */
          const tradingListProgress = newTradingList[idSourceColumn];

          /** Get item is being dragged */
          const item = tradingListProgress.customers[indexCustomer];
          itemToProcess = item;

          /** Swap position item and update new list */
          tradingListProgress.customers.splice(source.index, 1);
          tradingListProgress.customers.splice(destination.index, 0, item);
          nextTradingList = newTradingList;
        } else {
          /** Source and Destination is not the same column */
          const newTradingList = cloneDeep(tradingList);
          /** Detect column */
          const columnSource = newTradingList[idSourceColumn];
          const destinationColumn = newTradingList[idDestinationColumn];

          const item = columnSource.customers[indexCustomer];
          itemToProcess = item;

          columnSource.customers.splice(source.index, 1);
          destinationColumn.customers.splice(destination.index, 0, item);
          nextTradingList = newTradingList;
        }

        // const contextId = parseInt(draggableId.split('.').pop(), 10);
        // const placeholderDOM:any = getDomPlaceholderContext(contextId);

        // deleteCloneCard(placeholderDOM);

        setTradingList(nextTradingList);

        const idProductProgressIdDestination =
          nextTradingList[idDestinationColumn].productTradingProgressId;
        const listProductTradingIdSourceAfterDrag =
          itemToProcess &&
          itemToProcess.productTradings.map(ele => ({
            productTradingId: ele.productTradingId,
            productId: ele.productId,
            productTradingProgressId: idProductProgressIdDestination
          }));

        const productTradingIds = listProductTradingIdSourceAfterDrag.map(
          el => el.productTradingId
        );
        const parseParam = {
          productTradingIds,
          updateFields: [
            {
              fieldName: 'product_trading_progress_id',
              fieldValue: idProductProgressIdDestination.toString()
            }
          ]
        };

        props.onDrop(parseParam);
      }
    }

    return;
  };

  /** Render */
  return (
    <div
      ref={wrapViewContainer}
      className="table-list-wrap table-list-4column-wrap style-3 overflow-auto mt-0"
    >
      <div className="info-todo-list ipad-views">
        <DragDropContext
          onDragStart={onDragStart}
          onDragUpdate={onDragUpdate}
          onDragEnd={onDragEnd}
          onBeforeDragStart={onBeforeDragStart}
        >
          <div className="row bigger-4column">
            {tradingList &&
              tradingList.map((item, idx) => (
                <EachColumnProductTrading
                  onOpenPopupCustomerDetail={props.onOpenPopupCustomerDetail}
                  onOpenPopupEmployeeDetail={props.onOpenPopupEmployeeDetail}
                  onOpenPopupProductDetail={props.onOpenPopupProductDetail}
                  onScrollToEndEachColumn={() => props.onScrollToEndEachColumn(item)}
                  placeholderProps={placeholderProps}
                  expandItem={expandItem}
                  checkItem={checkItem}
                  key={item.productTradingProgressId}
                  item={item}
                  columnIdx={idx}
                  isDropDisabled={indexOfColumnDragging === idx}
                  settingDate={props.settingDate}
                />
              ))}
          </div>
        </DragDropContext>
        {props.changeDisplayOn && (
          <SwitchFieldPanelCustom
            fieldBelong={props.fieldBelong}
            progresses={props.progresses}
            dataSource={props.dataSource}
            dataTarget={props.dataTarget}
            onCloseSwitchDisplay={props.onCloseSwitchDisplay}
            onChooseField={props.onChooseField}
            onDragField={props.onDragField}
            fieldInfoProgresses={props.fieldInfoProgresses}
          />
        )}
      </div>
    </div>
  );
};

export default React.memo(SalesListView);
