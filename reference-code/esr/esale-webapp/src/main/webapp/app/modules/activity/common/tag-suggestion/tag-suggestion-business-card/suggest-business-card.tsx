import React from 'react'
import { connect } from 'react-redux'
import { IndexSaveSuggestionChoice } from '../tag-suggestion';

type ISuggestBusinessCardProp = StateProps & DispatchProps & {
  businessCartInfo: any;
  tags: any;
  selectElementSuggest: any;
}

const SuggestBusinessCard = (props: ISuggestBusinessCardProp) => {
  const isActive = props.tags.filter( e => e.businessCardId === props.businessCartInfo.businessCardId).length > 0;
  return (
    <li className={`item ${isActive ? "active" : ""} smooth`} onClick={() => {if(!isActive){ props.selectElementSuggest(props.businessCartInfo, IndexSaveSuggestionChoice.BusinessCard)}}}>
      <div className="text text1 font-size-12">{props.businessCartInfo.customerName} {props.businessCartInfo.departmentName} </div>
      <div className="text text2 text-ellipsis">{props.businessCartInfo.businessCardName} {props.businessCartInfo.position}</div>
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
)(SuggestBusinessCard);
