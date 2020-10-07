import React from 'react'
import { connect } from 'react-redux'
import { IndexSaveSuggestionChoice } from '../tag-suggestion';
import { getFieldLabel } from 'app/shared/util/string-utils';
import { getFirstCharacter } from 'app/shared/util/utils';

type ISuggestProductTradingProp = StateProps & DispatchProps & {
  productTradingInfo: any;
  tags: any;
  selectElementSuggest: any;
}

const SuggestProductTrading = (props: ISuggestProductTradingProp) => {
  const isActive = props.tags.filter(e => e.productTradingId === props.productTradingInfo.productTradingId).length > 0;
  const employeeName = props.productTradingInfo.employeeSurname || '' + " " +props.productTradingInfo.employeeName || '';
  return (
    <li className={`item ${isActive ? "active" : ""} font-size-14 pt-2 pb-2 font-weight-400`} onClick={() => {if(!isActive){ props.selectElementSuggest(props.productTradingInfo, IndexSaveSuggestionChoice.ProductTrading)}}}>
      <div className="font-size-12 pl-3 text-ellipsis">{props.productTradingInfo.customerName}</div>
      <div className="pl-3 text-ellipsis">{props.productTradingInfo.productName} {props.productTradingInfo.progressName ? `(${getFieldLabel(props.productTradingInfo, 'progressName')})` : '' }</div>
      {/* <div className="font-size-12 pl-3">{props.productTradingInfo.employeeSurname + " " + props.productTradingInfo.employeeName} </div> */}
      <div className="text text3 pl-3">
        {props.productTradingInfo.employeeId &&
          <div className="item2">
            {props.productTradingInfo.employeeIcon ?
              <div className="name"><img src={props.productTradingInfo.employeeIcon} alt="" className="no-border"/></div>
              :
              <div className={"no-avatar green "}>
                {getFirstCharacter(employeeName?.trim())}
              </div>
            }
            <div className="content">
              <div className="text text1 font-size-12 text-ellipsis">{employeeName}</div>
            </div>
          </div>
        }
      </div>
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
)(SuggestProductTrading);
