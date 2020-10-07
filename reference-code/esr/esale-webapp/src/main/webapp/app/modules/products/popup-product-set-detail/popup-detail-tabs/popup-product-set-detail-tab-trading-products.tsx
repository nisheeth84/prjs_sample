import React, { useState } from 'react';
// import { getJsonBName } from 'app/modules/products/utils';
import { translate } from 'react-jhipster';

import _ from 'lodash';
import { getFieldLabel } from 'app/shared/util/string-utils';

export interface IPopupTabTradingProducts {
    tradingProducts: any,
    mode?: any,
    onChangeFields?: (value) => void,
    tradingProductsFields?: any
}

const TabTradingProducts = (props: IPopupTabTradingProducts) => {
  const getDataFollowLabel = (data, field) => {
    let value = '';
    Object.keys(data).forEach((key) => {
      if (key === field.fieldName) {
        value = data[key];
        return value;
      }
    })
    return value;
  }

  const getTotalAmount = lstData => {
    let total = 0;
    lstData.forEach(item => total += item.amount);
    return total;
  }

  const renderDataProductTrading = (data, field) => {
    const value = getDataFollowLabel(data, field);
    return getFieldLabel({value}, "value") + (field.fieldName !== 'amount' ? "" : "円")
  }

  const productTradings = props.tradingProducts.productTradings
  return (
    <>
      <div className="user-popup-form mb-4">
        <div className="form-group no-margin">
          <table className="table-default">
            <thead>
              <tr>
                {props.tradingProducts.fieldInfoTab.map((field) => {
                  return (
                    field.fieldName !== 'amount' ? <th>{getFieldLabel(field, "getFieldLabel")}</th> :
                      <td>
                        {getFieldLabel(field, "fieldLabel")}
                        <div>{translate('products.detail.label.total')} 
                          <span className="float-right">{getTotalAmount(productTradings)}円</span>
                        </div>
                      </td>
                  )
                })}
              </tr>
            </thead>
            <tbody>
              {productTradings.map((productTrading, index) => {
                return (
                  <tr key={productTrading.productTradingId + '.product_trading'}>
                    {props.tradingProducts.fieldInfoTab.map((field, i) => {
                      return (
                        <td key={field.fieldId + '.field'} className={(field.fieldName !== 'amount' ? 'text-left' : 'text-right')}>
                          {renderDataProductTrading(productTrading, field)}
                        </td>
                      )
                    })
                    }
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default TabTradingProducts;