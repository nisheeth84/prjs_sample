import React from 'react';
import _ from 'lodash';

export interface IResultMultiProductProps {
	tags: any;
  onRemoveTag: any,
  onAmountChange: any
}

const ResultMultiProduct = (props: IResultMultiProductProps) => {
	return (
    <div className="table-popup-product">
        <table className="table-thead-background mt-2">
        <thead>
          <tr>
            <th></th>
            <th>商品情報</th>
            <th><div>単価 <span className="text-align-right">{_.sumBy(props.tags, (e) => {return e['unitPrice']})} 円</span></div></th>
            <th>
              <div>数量</div>
              <div>
                <p>合計</p>
                <span className="text-align-right">{_.sumBy(props.tags, 'amount')}</span>
              </div>
            </th>
            <th>
              <p>単価</p>
              <div>
                合計
                <span className="text-align-right">{_.sumBy(props.tags, (e) => {return e['amount'] * e['unitPrice']})} 円</span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {props.tags.map((e, idx) =>
            <tr key={idx}>
              <td><a onClick={() => props.onRemoveTag(idx)}>×</a></td>
              <td>
                <div className="product-detail">
                  {e.productImagePath && <img src={e.productImagePath} alt=""/>}
                  {!e.productImagePath && <img src="../../content/images/product1.svg" alt=""/>}
                  <div className="content">
                      <p>{e.productName}</p>
                  </div>
                </div>
              </td>
              <td><div className="text-right">{e.unitPrice} 円</div></td>
              <td><div className="text-right"><input className="back-ground-f9" type="text" value={e.amount} onChange={(ev) => props.onAmountChange(ev, idx) } /></div></td>
              <td><div className="text-right">{e.amount * e.unitPrice}円</div></td>
            </tr>
          )}
        </tbody>
      </table>
      </div>
	)
}

export default ResultMultiProduct;
