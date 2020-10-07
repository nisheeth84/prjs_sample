import React from 'react';
import { getFirstCharacter } from 'app/shared/util/utils';
import { getJsonBName } from 'app/modules/calendar/constants';

export interface ISuggestProductTradingProps {
  tradingProductInfo: any;
  tags: any;
  selectElementSuggest: any;
}

const SuggestProductTrading = (props: ISuggestProductTradingProps) => {
  const isActive = props.tags.findIndex(e => e.productTradingId === props.tradingProductInfo.productTradingId) > -1;
  const progressName = props.tradingProductInfo.progressName;
  return (
    <div className={`item ${isActive ? "active" : ""} smooth`} onClick={(e) => { if (!isActive) { props.selectElementSuggest(props.tradingProductInfo) } }}>
      <div className="text text1 font-size-12">{props.tradingProductInfo.customerName}</div>
      <div className="text text2">{props.tradingProductInfo.productName}{`${progressName ? ' (' + getJsonBName(progressName) + ')' : ''}`}</div>
      <div className="text text3">
        {props.tradingProductInfo.employeeId &&
          <div className="item2">
            {props.tradingProductInfo.employeeIcon ?
              <div className="name"><img src={props.tradingProductInfo.employeeIcon} alt="" style={{ border: 'none' }} /></div>
              :
              <div className={"no-avatar green"}>
                {getFirstCharacter(props.tradingProductInfo.employeeName)}
              </div>
            }
            <div className="content">
              <div className="text text1 font-size-12">{props.tradingProductInfo.employeeSurname} {props.tradingProductInfo.employeeName}</div>
            </div>
          </div>
        }

      </div>
    </div>
  );
}

export default SuggestProductTrading;
