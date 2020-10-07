import React from 'react'
import { connect } from 'react-redux'
import { IndexSaveSuggestionChoice } from '../tag-suggestion';

type ISuggestCustomerProp = StateProps & DispatchProps & {
  customerInfo: any;
  tags: any;
  selectElementSuggest: any;
}

const SuggestCustomer = (props: ISuggestCustomerProp) => {
  const isActive = props.tags.filter(e => e.customerId === props.customerInfo?.customerId).length > 0;
  return (
    <li className={`item ${isActive ? "active" : ""} smooth`} onClick={() => { if (!isActive) { props.selectElementSuggest(props.customerInfo, IndexSaveSuggestionChoice.Customer) } }}>
      <div className="text text1 font-size-12">{props.customerInfo?.parentCustomerName}</div>
      <div className="text text2 text-ellipsis">{props.customerInfo?.customerName}</div>
      <div className="text text3">{props.customerInfo?.address}</div>
    </li>
  );
}

const mapStateToProps = () => ({
});

const mapDispatchToProps = {
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SuggestCustomer);
