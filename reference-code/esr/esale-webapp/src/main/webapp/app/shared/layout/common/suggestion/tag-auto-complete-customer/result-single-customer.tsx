import React from 'react';

export interface IResultSingleCustomerProps {
  tags: any;
  onRemoveTag: any;
  renderTooltip: any;
  isShowOnList?: any;
  disableTag?: any;
}

const ResultSingleCustomer = (props: IResultSingleCustomerProps) => {
  return (
    <>
      {props.tags.map((e, idx) => {
        const tmp = [];
        if (e['parentCustomerName']) {
          tmp.push(e['parentCustomerName']);
        }
        if (e['customerName']) {
          tmp.push(e['customerName']);
        }
        const displayCustomerName = tmp.join('－');
        return (
          <div key={idx} className={`wrap-tag ${props.isShowOnList ? "w90" : "text-ellipsis"} flex-100`}>
            <div className={`tag text-ellipsis ${props.isShowOnList ? "" : "w-100"} max-width-content`}>
              {displayCustomerName}
              <span className="close" onClick={props.disableTag ? () => { } : props.onRemoveTag(idx)}>×</span>
            </div>
            {props.renderTooltip(e)}
          </div>
        )
      })}
    </>
  )
}

export default ResultSingleCustomer;