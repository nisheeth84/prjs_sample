import React from 'react';
import _ from 'lodash';
import { getFirstCharacter } from 'app/shared/util/utils';
import { getJsonBName } from 'app/modules/calendar/constants';

export interface IResultMultiProductTradingProps {
  tags: any;
  onRemoveTag: any,
}

const fixTooltipOverflowStyle: React.CSSProperties = {
  overflow: 'initial'
}

const ResultMultiProductTrading = (props: IResultMultiProductTradingProps) => {
  return (
    <div className="chose-many">
      {props.tags && props.tags.map((productTrading, idx) =>
        <div className="w48 position-relative" key={idx}>
          <div className="drop-down w100 background-color-86 overflow-initial h-auto">
            <ul className="dropdown-item">
              <li className="item smooth">
                <div className="text text1 text-ellipsis">{productTrading.customerName}</div>
                <div className="text text2 text-ellipsis">{productTrading.productName} {`${productTrading.progressName ? '(' + (getJsonBName(productTrading.progressName)) + ')' : ''}`}</div>
                <div className="text text3">
                  {productTrading.employeeId && <div className="item2">
                    {productTrading.employeeIcon ?
                      <div className="name"><img src={productTrading.employeeIcon} alt="" style={{ border: 'none' }} /></div>
                      :
                      <div className={"no-avatar green"}>
                        {getFirstCharacter(productTrading.employeeName)}
                      </div>
                    }
                    <div className="content">
                      <div className="text text1 font-size-12">{productTrading.employeeSurname} {productTrading.employeeName}</div>
                    </div>
                  </div>}</div>
                <button type="button" className="close"><a onClick={() => props.onRemoveTag(idx)}>×</a></button>
              </li>
            </ul>
          </div>
          <div className="drop-down child mt-0 overflow-initial h-auto">
            <ul className="dropdown-item mb-0">
              <li className="item smooth">
                <div className="text text1" style={fixTooltipOverflowStyle}>{productTrading.customerName}</div>
                <div className="text text2" style={fixTooltipOverflowStyle}>{productTrading.productName} {`${productTrading.progressName ? '(' + (getJsonBName(productTrading.progressName)) + ')' : ''}`}</div>
                <div className="item d-inline-flex align-items-center p-0 mr-2">
                  {productTrading.employeeId &&
                    <div className="item2">
                      {productTrading.employeeIcon ?
                        <div className="name">
                          <img src={productTrading.employeeIcon} alt="" style={{ border: 'none' }} /></div>
                        :
                        <div className={"no-avatar green"}>
                          {getFirstCharacter(productTrading.employeeName)}
                        </div>
                      }
                      <div className="content">
                        <div className="text-blue font-size-12">{productTrading.employeeSurname} {productTrading.employeeName}</div></div>
                    </div>}
                </div>
              </li>
            </ul>
          </div>
        </div>
      )
      }
    </div >
  )
}

export default ResultMultiProductTrading;
