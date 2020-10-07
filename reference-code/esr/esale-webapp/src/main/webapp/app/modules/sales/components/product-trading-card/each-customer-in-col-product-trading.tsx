import React from 'react';
import { translate } from "react-jhipster";
import { Draggable } from 'react-beautiful-dnd';
import { convertDateToYYYYMMDD } from 'app/shared/util/date-utils';
import ListEmployee from '../list-employee';
import ListProductTradingDetail from './list-detail-product-trading';
import { isInvalidDate, renderAmountWithCurrency } from '../../utils';
import { TYPE_DRAG, COLOR_PRODUCT_TRADING } from '../../constants';

const EachCustomerInColumn = ({
  item,
  columnIdx,
  customerIdx,
  expandItem,
  checkItem,
  onOpenPopupEmployeeDetail,
  onOpenPopupCustomerDetail,
  onOpenPopupProductDetail,
  currency,
  decimalPlace,
}) => {
  const { customerId, colorCustomer, customerName } = item;
  const colorCustomerText = item.colorCustomerText || {};
  const productName = item.productTradings.length <= 1 ? item.productTradings[0].product?.productName : item.productName;
  const productId = item.productTradings.length <= 1 ? item.productTradings[0].productId : item.productId;
  const date = item.productTradings.length <= 1 ? convertDateToYYYYMMDD(item.minEndPlanDate) : `${convertDateToYYYYMMDD(item.minEndPlanDate)} ~ ${convertDateToYYYYMMDD(item.maxEndPlanDate)}`;
  const labelTotalAmount = item.productTradings.length > 1 ? `${translate('sales.card-view.total-amount')}: ` : '';

  return (
    <Draggable
      key={`${TYPE_DRAG.CUSTOMER}.${customerIdx}`}
      draggableId={`${TYPE_DRAG.CUSTOMER}.${columnIdx}.${customerIdx}`}
      index={customerIdx}
    >
      {(providedDragCustomer) => (
        <div
          ref={providedDragCustomer.innerRef}
          {...providedDragCustomer.draggableProps}
          {...providedDragCustomer.dragHandleProps}
          className={`${item.checked ? 'contents-items active' : 'contents-items'}`}
          // Fill color
          style={{
            ...providedDragCustomer.draggableProps.style,
            background: colorCustomer ? COLOR_PRODUCT_TRADING[colorCustomer] : ''
          }}
        >
          <div className="text-top">
              <a title="" className="link" onClick={() => onOpenPopupCustomerDetail(Number(customerId))}>{customerName}</a>
              {productName && <p onClick={() => onOpenPopupProductDetail(productId)}>{productName}</p>}
          </div>

          <div className="text-mid">
              <p
                className="text-small"
                style={{
                  color: colorCustomerText.amount ? COLOR_PRODUCT_TRADING[colorCustomerText.amount] : ''
                }}
              >
                {labelTotalAmount}
                {renderAmountWithCurrency(item.totalAmount, currency, decimalPlace)}
              </p>
              <p className="text-small">{translate('sales.card-view.end-plan-date')}</p>
              <p
                className="date text-small"
                style={{
                  color: colorCustomerText.endPlanDate ? COLOR_PRODUCT_TRADING[colorCustomerText.endPlanDate] : ''
                }}
              >{isInvalidDate(date) ? '' : date}</p>
          </div>

          <div className="text-bottom">
              <p className="text-small">{translate('sales.card-view.employees')}</p>
              <ListEmployee employees={item.listEmployee} onOpenPopupEmployeeDetail={onOpenPopupEmployeeDetail} />
          </div>
          {
            item.productTradings
            && item.productTradings.length > 1
            && (
              <ListProductTradingDetail
                expandItem={expandItem}
                customerIdx={customerIdx}
                columnIdx={columnIdx}
                item={item}
                onOpenPopupEmployeeDetail={onOpenPopupEmployeeDetail}
                onOpenPopupProductDetail={onOpenPopupProductDetail}
                currency={currency}
                decimalPlace={decimalPlace}
                onCheckItem={event => {
                  event.stopPropagation();
                  checkItem(event, item, columnIdx, customerIdx)
                }}
              />
            )
          }

          {
            item.productTradings
            && item.productTradings.length === 1
            && (
            <div className="check-box-select">
              <label className="icon-check">
                <input checked={!!item.checked} type="checkbox" onClick={event => checkItem(event, item, columnIdx, customerIdx)} />
                <i />
              </label>
            </div>
            )
          }
        </div>
      )}
    </Draggable>
  )
}

export default React.memo(EachCustomerInColumn);