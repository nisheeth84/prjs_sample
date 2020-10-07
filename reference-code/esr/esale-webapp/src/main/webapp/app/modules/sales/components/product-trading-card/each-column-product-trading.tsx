import React, { useRef, useEffect } from 'react';
import { translate } from "react-jhipster";
import { Droppable } from 'react-beautiful-dnd';

import PlaceholderDrag from '../placeholders-drag-move';
import EachCustomerInColumn from './each-customer-in-col-product-trading';
import { getFieldLabel } from 'app/shared/util/string-utils';
import withCurrency from '../../HOC/withCurrency';
import { renderAmountWithCurrency } from '../../utils';
import _ from 'lodash'
import useScrollToEndPage from '../../hooks/useScrollToEndPage';

const EachColumnProductTrading = (props) => {
  const {
    item,
    columnIdx,
    expandItem,
    checkItem,
    onOpenPopupEmployeeDetail,
    onOpenPopupCustomerDetail,
    onOpenPopupProductDetail,
    currency,
    decimalPlace,
    isDropDisabled,
    onScrollToEndEachColumn,
  } = props;
  const {placeholderProps} = props;
  const droppableId = `column.${columnIdx}`;
  const columnRef = useRef(null);
  
  useScrollToEndPage(columnRef, (event) => {
    onScrollToEndEachColumn(event);
  });

  return (
    <div className="col-3">
      <div className="items">
        <div className="items-title">
          {getFieldLabel(item, 'progressName')}
          <p className="text-small">
            {renderAmountWithCurrency(item.totalAmount, currency, decimalPlace)} / {item.totalProductTrading} {translate('sales.card-view.total-quantity')}
          </p>
        </div>
        <Droppable
          droppableId={droppableId}
          key={columnIdx}
          isDropDisabled={isDropDisabled}
        >
          {(provided, snapshot) => (
            <div
              ref={ref => {
                // custom ref
                provided.innerRef(ref);
                columnRef.current = ref;
              }}
              {...provided.droppableProps}
              className="item-wrap"
              // add style overflow overlay to fix cannot scroll horizontal react-beautiful-dnd
              // style={{ overflow: 'initial' }}
            >
              {
                item.customers && item.customers.map((customer, idx) => (
                  <EachCustomerInColumn
                    key={idx}
                    item={customer}
                    columnIdx={columnIdx}
                    customerIdx={idx}
                    checkItem={checkItem}
                    expandItem={expandItem}
                    onOpenPopupEmployeeDetail={onOpenPopupEmployeeDetail}
                    onOpenPopupCustomerDetail={onOpenPopupCustomerDetail}
                    onOpenPopupProductDetail={onOpenPopupProductDetail}
                    currency={currency}
                    decimalPlace={decimalPlace}
                  />
                  )
                )
              }
                { provided.placeholder
                  && !_.isEmpty(placeholderProps)
                  && snapshot.isDraggingOver
                  && (
                  <PlaceholderDrag placeholderProps={placeholderProps} />
                )}
                {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div >
    </div>
  )
}

export default React.memo(withCurrency(EachColumnProductTrading));