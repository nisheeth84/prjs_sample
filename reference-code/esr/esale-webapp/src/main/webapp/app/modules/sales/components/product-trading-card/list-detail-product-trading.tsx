import React, { Fragment } from 'react';
import { translate } from 'react-jhipster';
import { Droppable } from 'react-beautiful-dnd';
import EachProductTrading from './each-item-detail-product-trading';

const ListProductTradingDetail = ({
  item,
  expandItem,
  customerIdx,
  columnIdx,
  onOpenPopupEmployeeDetail,
  onOpenPopupProductDetail,
  onCheckItem,
  currency,
  decimalPlace
}) => {
  const droppableIdForDetailTrading = `dropTrading.${columnIdx}.${customerIdx}`;
  return (
    <Fragment>
      <div className="sales-check-box-custom">
        <a className="show-more mt-3" onClick={(e) => expandItem(e, item, columnIdx, customerIdx)}>
          <i className={`fas ${item.expand ? 'fa-chevron-up' : 'fas fa-chevron-down'}`} />
          <span className="black">{translate('sales.component.list-detail-product-trading.analysis')}</span>
        </a>

        {/* Fix css input checkbox is push to end column */}
        {/* class sales-check-box-custom */}
        <div className="check-box-select">
          <label className="icon-check">
            <input checked={!!item.checked} type="checkbox" onClick={onCheckItem} />
            <i />
          </label>
        </div>
      </div>

    
      <Droppable
        droppableId={droppableIdForDetailTrading}
        key={`${columnIdx}.${customerIdx}`}
        isDropDisabled
      >
        {(providedDroppable) => (
          <div
            {...providedDroppable.droppableProps}
            ref={providedDroppable.innerRef}
            className="progress-card-droppable"
            key={`${columnIdx}.${customerIdx}`}
          >
            {
              item.expand &&
              item.productTradings &&
              item.productTradings.map((itemTrading, idx) => (
              <EachProductTrading
                key={`product-${idx}`}
                item={{ ...itemTrading, customerName: item.customerName }}
                customerIdx={customerIdx}
                columnIdx={columnIdx}
                productTradingIdx={idx}
                onOpenPopupEmployeeDetail={onOpenPopupEmployeeDetail}
                onOpenPopupProductDetail={onOpenPopupProductDetail}
                currency={currency}
                decimalPlace={decimalPlace}
              />))
            }
            {providedDroppable.placeholder}
          </div>
        )}
      </Droppable>
    </Fragment>
  )
}

export default React.memo(ListProductTradingDetail);