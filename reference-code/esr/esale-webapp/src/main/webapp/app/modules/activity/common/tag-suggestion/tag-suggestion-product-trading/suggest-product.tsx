import React from 'react'
import { connect } from 'react-redux'
import { IndexSaveSuggestionChoice } from '../tag-suggestion';
import StringUtils, { getFieldLabel } from 'app/shared/util/string-utils';
import _ from 'lodash';
import { translate } from 'react-jhipster';

type ISuggestProductProp = StateProps & DispatchProps & {
  productInfo: any;
  tags: any;
  selectElementSuggest: any;
}

const SuggestProduct = (props: ISuggestProductProp) => {
  const isActive = props.tags.filter(e => e.productId === props.productInfo.productId && _.isNil(e['productTradingId'])).length > 0;
  
  /**
   * genderCategoryName
   */
  const genderCategoryName = () => {
    const list = [];
    if(props.productInfo.productCategories && props.productInfo.productCategories.length > 0 ){
      props.productInfo.productCategories.forEach((e)=>{
        list.push(getFieldLabel(e, 'productCategoryName'));
      })
    }
    return _.join(list, '-')
  } 
  return (
    <li className={`item ${isActive ? "active" : ""} smooth font-size-14 color-333 d-flex font-weight-400`} onClick={() => { if (!isActive) { props.selectElementSuggest(props.productInfo, IndexSaveSuggestionChoice.Product) } }}>
      <div className={`mr-3 image_table ${ props.productInfo?.productImagePath ? '' : 'no_image_table'}`}>
        <img className="max-width-130" src={props.productInfo?.productImagePath || "../../content/images/noimage.png"} alt="" title=""/>
      </div>
      <div className="w-75">
        <div className="text text1 font-size-12 text-ellipsis">{genderCategoryName()}</div>
        <div className="text text-ellipsis">{props.productInfo.productName}</div>
          <div className="text text1 font-size-12 price text-ellipsis">{StringUtils.numberFormat(props.productInfo.unitPrice)}{translate('activity.list.body.yen')}</div>
        <div className="text text3 font-size-12 text-ellipsis">{props.productInfo.memo}</div>
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
)(SuggestProduct);
