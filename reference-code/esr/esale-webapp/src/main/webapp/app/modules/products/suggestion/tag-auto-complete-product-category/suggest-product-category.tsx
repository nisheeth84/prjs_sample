import React from 'react';
import { getFieldLabel } from 'app/shared/util/string-utils';
// import { getJsonBName } from '../../utils';

export interface ISuggestProductProps {
    productInfo: any;
    tags: any;
    selectElementSuggest: any;
}

const SuggestProductCategory = (props: ISuggestProductProps) => {
  const tags = props.tags || [];
  const productInfo = props.productInfo;
  const isActive = tags.filter( e => e.productId === productInfo.productId).length > 0;
 
  return (
    <div className={`item ${isActive ? "active" : ""} smooth d-flex`} onClick={(e) => {if(!isActive){ props.selectElementSuggest(productInfo)}}}>

      <div>
        <div className="text text2">{getFieldLabel(productInfo ,'productCategoryName')}</div>
      </div>
    </div>
  );
}

export default SuggestProductCategory;
