import React from 'react';
import _ from 'lodash';

export interface IResultTableProductTradingProps {
  tags: any;
  onRemoveTag: any,
}

const ResultTableProductTrading = (props: IResultTableProductTradingProps) => {
  return (
    <div className="chose-many">
      <div className="w48 position-relative">
        <div className="drop-down w100">
          <ul className="dropdown-item">
            <li className="item smooth">
              <div className="text text1 text-ellipsis">観電貢客親瀬客親顧客親顧客 123... </div>
              <div className="text text2 text-ellipsis">取引商品名A 取引商品名A 取引... </div>
              <div className="text text3">担当者A</div>
              <button className="close">×</button>
            </li>
          </ul>
        </div>
        <div className="drop-down child">
          <ul className="dropdown-item overflow-hidden">
            <li className="item smooth">
              <div className="text text1">観電貢客親瀬客親顧客親顧客顧客親顧客顧客親顧客</div>
              <div className="text text2">取引商品名A 取引商品名A 取引商品名A 取引商品名A （進捗状況）</div>
              <div className="item d-inline-flex align-items-center p-0 mr-2">
                <img className="user" src="../../../content/images/ic-user4.svg" alt="" title="" />
                <span className="font-size-12 text-blue">社員D</span>
              </div>
              <button className="close">×</button>
            </li>
          </ul>
        </div>
      </div>
      <div className="w48 position-relative">
        <div className="drop-down w100">
          <ul className="dropdown-item">
            <li className="item smooth">
              <div className="text text1 text-ellipsis">顧客A</div>
              <div className="text text2 text-ellipsis">取引商品名B （進捗状況）</div>
              <div className="text text3">担当者A</div>
              <button className="close">×</button>
            </li>
          </ul>
        </div>
        <div className="drop-down child">
          <ul className="dropdown-item overflow-hidden">
            <li className="item smooth">
              <div className="text text1">観電貢客親瀬客親顧客親顧客顧客親顧客顧客親顧客</div>
              <div className="text text2">取引商品名B 取引商品名A 取引商品名A 取引商品名B （進捗状況）</div>
              <div className="item d-inline-flex align-items-center p-0 mr-2">
                <img className="user" src="../../../content/images/ic-user4.svg" alt="" title="" />
                <span className="font-size-12 text-blue">社員D</span>
              </div>
              <button className="close">×</button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default ResultTableProductTrading;
