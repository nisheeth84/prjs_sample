import React from 'react';
import StringUtils from 'app/shared/util/string-utils';
import { Storage } from 'react-jhipster';

export interface ISuggestProductProps {
    productInfo: any;
    tags: any;
    selectElementSuggest: any;
}

const SuggestProduct = (props: ISuggestProductProps) => {
  const tags = props.tags || [];
  const productInfo = props.productInfo;
  const isActive = tags.filter( e => e.productId === productInfo.productId).length > 0;
  const lang = Storage.session.get('locale', 'ja_jp');
  let productCategories = "";
  if (productInfo.productCategories && productInfo.productCategories.length > 0) {
    productCategories = productInfo.productCategories.map(e => StringUtils.getFieldLabel(e, 'productCategoryName', lang)).join("-");
  }
  return (
    <div className={`item ${isActive ? "active" : ""} smooth d-flex`} onClick={(e) => {if(!isActive){ props.selectElementSuggest(productInfo)}}}>
      {productInfo.productImagePath 
        ? <div className="product-image mr-3  ">
          <img src={productInfo.productImagePath} className="image-product-productset" alt={productInfo.productImageName} title="" />
        </div>
        : <div className="product-image no-image mr-3">
          <img src={"/content/images/noimage.jpg"}  className="image-product-productset" alt="" title="" />
        </div>
      }
      <div className="w-100">
        <div className="text text1 font-size-12 text-ellipsis">{productCategories}</div>
        <div className="text text2 text-ellipsis">{productInfo.productName}</div>
        <div className="text text1 font-size-12 price text-ellipsis">{new Intl.NumberFormat('ja-JP').format(productInfo.unitPrice)}円</div>
        <div className="text text3 text-ellipsis">{productInfo.memo}</div>
      </div>
    </div>
  );
}

export default SuggestProduct;
