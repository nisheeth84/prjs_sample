import React from 'react';
import {translate} from "react-jhipster";
import { Draggable } from 'react-beautiful-dnd';
import { convertDateToYYYYMMDD } from 'app/shared/util/date-utils';
import { TYPE_DRAG, COLOR_PRODUCT_TRADING } from '../../constants';
import ListEmployee from '../list-employee';
import { isInvalidDate, renderAmountWithCurrency } from '../../utils';

const EachProductTrading = ({ item, columnIdx, customerIdx, productTradingIdx, onOpenPopupEmployeeDetail, onOpenPopupProductDetail, currency, decimalPlace }) => {

  const { employee, productId, product } = item;

  const date = convertDateToYYYYMMDD(item.endPlanDate);
  const { productName } = product || {};

  return (
    <Draggable
      draggableId={`${TYPE_DRAG.TRADING}.${columnIdx}.${customerIdx}.${productTradingIdx}`}
      index={productTradingIdx}
      key={`${TYPE_DRAG.TRADING}.${customerIdx}`}
    >
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="contents-items border-gray"
        >
          <div className="text-top">
            {productName && <a title="" onClick={() => onOpenPopupProductDetail(productId)}>{productName}</a>}
          </div>

          <div className="text-mid">
            <p
              className="text-small"
              style={{
                color: item?.colorOfItem?.amount ? COLOR_PRODUCT_TRADING[item.colorOfItem.amount] : ''
              }}
            >
              {renderAmountWithCurrency(item.amount, currency, decimalPlace)}
            </p>
            <p className="text-small">{translate('sales.card-view.end-plan-date')}</p>
            <p
              className="date text-small"
              style={{
                color: item?.colorOfItem?.endPlanDate ? COLOR_PRODUCT_TRADING[item.colorOfItem.endPlanDate] : ''
              }}
            >{isInvalidDate(date) ? '' : date}</p>
          </div>

          <div className="text-bottom">
            <p className="text-small">{translate('sales.card-view.employees')}</p>
              <ListEmployee employees={[employee]} onOpenPopupEmployeeDetail={onOpenPopupEmployeeDetail} />
          </div>
        </div>
      )}
    </Draggable>
  )
}

EachProductTrading.defaultProps = {
  item: {
    total: '',
    employeeName: '',
    productName: '',
    customerName: '',
    endPlanDate: '',
    maxDate: '',
    minDate: '',
    employees: [],
    detailTradings: [],
  }
}

export default React.memo(EachProductTrading);