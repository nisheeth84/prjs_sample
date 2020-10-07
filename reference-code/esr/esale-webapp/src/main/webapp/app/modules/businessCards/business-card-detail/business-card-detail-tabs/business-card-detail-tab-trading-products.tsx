import React from 'react';

export interface ITabTradingProducts {
  businessCardId?: any,
}

const TabTradingProducts = (props: ITabTradingProducts) => {
  return (
    <div className="tab-content">
      <div className="tab-pane active">
        <table className="table-thead-background">
          <thead>
            <tr>
              <th>商品</th>
              <th>顧客名</th>
              <th>客先担当者</th>
              <th>担当者</th>
              <th>進捗状況</th>
              <th>完了予定日</th>
              <th>
                <div>金額</div>
                <div>
                  合計
                  <span className="text-align-right">140,000円</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="background-white">
              <td className="text-blue">商品A</td>
              <td className="text-blue">顧客A</td>
              <td className="text-blue">名刺A</td>
              <td className="text-blue">名刺A</td>
              <td>アプローチ</td>
              <td>2019/09/09</td>
              <td className="text-right">30,000円</td>
            </tr>
            <tr>
              <td className="text-blue">商品B</td>
              <td className="text-blue">顧客B</td>
              <td className="text-blue">名刺B</td>
              <td className="text-blue">名刺B</td>
              <td>アプローチ</td>
              <td>2019/09/09</td>
              <td className="text-right">30,000円</td>
            </tr>
            <tr>
              <td className="text-blue">商品C</td>
              <td className="text-blue">顧客C</td>
              <td className="text-blue">名刺C</td>
              <td className="text-blue">名刺C</td>
              <td>アプローチ</td>
              <td>2019/09/09</td>
              <td className="text-right">40,000円</td>
            </tr>
            <tr>
              <td className="text-blue">商品D</td>
              <td className="text-blue">顧客D</td>
              <td className="text-blue">名刺D</td>
              <td className="text-blue">名刺D</td>
              <td>アプローチ</td>
              <td>2019/09/09</td>
              <td className="text-right">40,000円</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default TabTradingProducts;