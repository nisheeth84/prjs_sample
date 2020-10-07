import React from 'react';

export interface ISuggestCustomerProps {
  customerInfo: any;
  tags: any;
  selectElementSuggest: any;
  valueInput?: any
  autoFocusCustomer?: boolean
}

const SuggestCustomer = (props: ISuggestCustomerProps) => {
  const { customerInfo } = props;
  const tags = props.tags;

  if (props.autoFocusCustomer && props.valueInput && customerInfo && props.valueInput === customerInfo.customerName) {
    props.selectElementSuggest(customerInfo);
  }

  if (customerInfo.customerId) {
    const isActive = tags.filter(e => e.customerId === customerInfo.customerId).length > 0;
    return (
      <div className={`item ${isActive ? "active" : ""} smooth`} onClick={(e) => { if (!isActive) { props.selectElementSuggest(customerInfo) } }}>
        {customerInfo && customerInfo.parentCustomerName && <div className="text text1 text-ellipsis">{customerInfo.parentCustomerName}</div>}
        <div className="text text2 text-ellipsis">{customerInfo.customerName}</div>
        {customerInfo && customerInfo.customerAddress && <div className="text text3 text-ellipsis">{customerInfo.customerAddress}</div>}
      </div>
    );
  }
  return (<></>);
}
export default SuggestCustomer;
