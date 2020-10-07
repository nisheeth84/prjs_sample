import React, { useState, useEffect } from 'react';
import { translate } from 'react-jhipster';
import { AvForm } from 'availity-reactstrap-validation';
// import { getJsonBName } from 'app/modules/products/utils'
import TagAutoCompleteProductCategory, { TagAutoCompleteType, TagAutoCompleteMode } from '../../suggestion/tag-auto-complete-product-category'
import { getFieldLabel } from 'app/shared/util/string-utils';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import useDeepCompareEffect from 'use-deep-compare-effect';
import { reset } from 'app/modules/products/category/category-regist-edit.reducer';

export interface IPopupMoveCategory extends StateProps, DispatchProps{
  categories,
  setOpenPopupMoveCategory,
  handleEventUpdateProductsCategory,
  onAddNewCategory,
  hideSuggest
}

const PopupMoveCategory = (props: IPopupMoveCategory) => {
  const [productCategoryId, setProductCategoryId] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const OptionCategoryChild = ({ data, tabIndex }) => {
    return (
      data && data.map((item) => (
        <>
          <option value={item.productCategoryId} key={item.productCategoryId}>{tabIndex + getFieldLabel(item, "productCategoryName")}</option>
          {item.productCategoryChild &&
            <OptionCategoryChild data={item.productCategoryChild} key={item.productCategoryId + item.productCategoryId} tabIndex={tabIndex + '\xa0\xa0\xa0\xa0'} />
          }
        </>
      )
      ))
  }

  // const OptionCategory = ({ data }) => {
  //   return (
  //     data && data.map((item, index) => (
  //       <>
  //         <option value={item.productCategoryId} key={item.productCategoryId}>{getJsonBName(item.productCategoryName)}</option>
  //         {item.productCategoryChild &&
  //           <OptionCategoryChild data={item.productCategoryChild} key={item.productCategoryId + item.productCategoryId} tabIndex={'\xa0\xa0\xa0\xa0'} />
  //         }
  //       </>
  //     )
  //     ))
  // }

  const handleEventInput = (id: any, type: TagAutoCompleteType, mode: TagAutoCompleteMode, listTag: any[]) => {
    props.reset(false)
    if (listTag && listTag.length > 0) {
      setErrorMsg("")
      setProductCategoryId(listTag[0].productCategoryId)
    } else {
      setProductCategoryId(null)
      // setParentRecord(null)
    }
  };

  const handleEventUpdateProducts = () => {
    if (parseInt(productCategoryId, 0) >= 0) {
      props.handleEventUpdateProductsCategory(productCategoryId);
      setErrorMsg("")
      props.setOpenPopupMoveCategory(false);
    } 
    // else {
    //   setErrorMsg(translate("messages.ERR_COM_0013"))
    // }
  }
  useDeepCompareEffect(() => {
      if(!props.hideSuggest && props.newCategory?.productCategoryId && props.newCategory?.productCategoryName){
        setProductCategoryId(props.newCategory.productCategoryId)
      }
  }, [props.newCategory, props.hideSuggest ])

  useEffect(() => {
    props.reset(false)
    return () => {
      props.reset(false)
    }
  },[])

  

  return (
    <div className="popup-esr2 popup-esr3" id="popup-esr2">
      <div className="popup-esr2-content">
        <div className="modal-header">
          <div className="left">
            <div className="popup-button-back"><span className="text no-line"><img title="" src="../../content/images/ic-product.svg" alt="" />{translate('products.popup.move-to-category.title')}</span></div>
          </div>
          <div className="right">
            <a title="" className="icon-small-primary icon-close-up-small" onClick={() => props.setOpenPopupMoveCategory(false)}></a>
          </div>
        </div>
        <AvForm id="move-category-form">
          <div className="popup-esr2-body border-bottom mb-4">
            <div className="form-group no-margin">
            <TagAutoCompleteProductCategory
                id="productsSets"
                title={translate("products.popup.move-to-category.parentId")}
                type={TagAutoCompleteType.ProductCategories}
                mode={TagAutoCompleteMode.Single}
                onActionSelectTag={handleEventInput}
                isHideResult={false}
                // elementTags={parentRecord ? [parentRecord] : null}
                placeholder={translate("products.category.form.category-placeholder")}
                validMsg={errorMsg}
                onAddNewCategory={props.onAddNewCategory}
                hideSuggest={props.hideSuggest}
                isPopup1={true}
              />
            </div>
          </div>

          <div className="align-center float-right mb-4 px-4">
            <a title="" className="button-cancel" onClick={() => props.setOpenPopupMoveCategory(false)}>{translate('products.popup.move-to-category.cancel')}</a>
            <button type="submit" onClick={handleEventUpdateProducts} className={"button-blue" + (productCategoryId? "" : " disable")}>{translate('products.popup.move-to-category.confirm')}</button>
          </div>
        </AvForm>
      </div>
    </div>
  )
}


const mapStateToProps = ({ categoryRegistEdit }: IRootState) => ({
  newCategory: categoryRegistEdit.newCategory
});

const mapDispatchToProps = {
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PopupMoveCategory);

