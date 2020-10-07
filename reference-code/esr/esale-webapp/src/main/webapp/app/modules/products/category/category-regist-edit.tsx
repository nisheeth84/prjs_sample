import React, { useEffect, useState } from "react";
import { AvForm } from "availity-reactstrap-validation";
import { translate } from "react-jhipster";
import { connect } from "react-redux";
import { IRootState } from "app/shared/reducers";
import ConfirmDialog from "app/shared/layout/dialog/confirm-dialog";
import {
  handleGetProductCategories,
  handleUpdateCategory,
  handleCreateCategory,
  reset
} from "./category-regist-edit.reducer";
import { parseJson } from 'app/modules/products/utils'
import TagAutoCompleteProductCategory, { TagAutoCompleteType, TagAutoCompleteMode } from '../suggestion/tag-auto-complete-product-category'
import useWillReceiveProps from '../components/useWillReceiveProps';
import useDeepCompareEffect from 'use-deep-compare-effect'
import { Storage } from 'react-jhipster';

export interface ICategoryRegistEditProps extends StateProps, DispatchProps {
  categoryObj: any;
  isRegist: boolean;
  showModal: boolean;
  toggleClosePopupSettingCondition: any;
  setMessage
  onAddNewCategory?: any
  hasCreateNewCategory2?: boolean
  popupMoveCategory?: boolean
}

export const CategoryRegistEdit = (props: ICategoryRegistEditProps) => {
  const [categoryName, setCategoryName] = useState(props.categoryObj ? props.categoryObj.productCategoryName : '');
  const [categoryId, setCategoryId] = useState(props.categoryObj ? props.categoryObj.productCategoryParentId : null);
  const [isShowLanguage, setIsShowLanguage] = useState(false);
  const [categoryNameEnUS, setCategoryNameEnUS] = useState(props.categoryObj ? (props.categoryObj.productCategoryName ? parseJson(categoryName, 'en_us') : '') : '');
  const [categoryNameJaJp, setCategoryNameJaJp] = useState(props.categoryObj ? (props.categoryObj.productCategoryName ? parseJson(categoryName, 'ja_jp') : '') : '');
  const [categoryNameZhCn, setCategoryNameZhCn] = useState(props.categoryObj ? (props.categoryObj.productCategoryName ? parseJson(categoryName, 'zh_cn') : '') : '');
  const [errorMsgJajp,] = useState('')
  const [msgValidate, setMsgValidate] = useState(false);
  const [parentRecord, setParentRecord] = useState(null);
  const { categories, isUpdateSuccess, isCreateSuccess } = props;
  // const errorMsg = errorMessage;
  const lang = Storage.session.get('locale', 'ja_jp');
  const category = props.categoryObj;
  const categoryDto = {
    productCategoryId: null,
    productCategoryName: category ? category.productCategoryName : '',
    productCategoryParentId: category ? category.productCategoryParentId : null,
    updatedDate: category ? category.updatedDate : null
  };
  const productCategoryListAll = [];

  // if (lang === 'en_us') {
  //   arrLabel = ['en_us', 'ja_jp', 'zh_cn']
  // } else if (lang === 'zh_cn') {
  //   arrLabel = ['zh_cn', 'ja_jp', 'en_us']
  // } else {
  //   arrLabel = ['ja_jp', 'en_us', 'zh_cn']
  // }
  const pushAll = (item) => {
    if (!Array.isArray(item)) return;
    item.forEach(i => {
      productCategoryListAll.push(i);
      if (i.productCategoryChild) {
        pushAll(i.productCategoryChild);
      }
    })
  }

  const getCategoryParent = (idParent) => {
    const parent = productCategoryListAll.find(x => x.productCategoryId === idParent)
    setParentRecord(parent)
    // return parent
  }

  useDeepCompareEffect(() => {
    if (props.newCategory?.productCategoryId && props.newCategory?.productCategoryName) {
      setCategoryId(props.newCategory.productCategoryId)
    }
  }, [props.newCategory])

  // const getListCategoryChild = lstChild => {
  //   return props.isRegist ? lstChild : lstChild.filter(i => i.productCategoryId !== category.productCategoryId);
  // }

  useEffect(() => {
    if (categories && categories.length > 0) {
      pushAll(categories)
      console.log("productCategoryListAll", productCategoryListAll);
      if (categoryDto.productCategoryParentId !== null) {
        getCategoryParent(categoryDto.productCategoryParentId)
      }
    }
  }, [categories]);

  const showConfirmDirtyCheck = async () => {
    const result = await ConfirmDialog({
      title: (<>{translate("employees.department.department-regist-edit.form.button.confirm")}</>),
      message: translate("messages.WAR_COM_0007"),
      confirmText: translate("employees.department.department-regist-edit.form.button.confirm"),
      confirmClass: "button-blue",
      cancelText: translate("employees.department.department-regist-edit.form.button.cancel"),
      cancelClass: "button-cancel"
    });
    return result;
  }

  const isChangeInputEdit = () => {
    if (!category) return false;
    if (categoryDto.productCategoryName !== category.productCategoryName ||
      categoryDto.productCategoryParentId !== category.productCategoryParentId) {
      return true;
    }
  }

  const executeDirtyCheck = async (action: () => void, cancel?: () => void) => {
    const isChange = isChangeInputEdit();
    if (isChange) {
      const result = await showConfirmDirtyCheck();
      if (result) {
        action();
      } else if (cancel) {
        cancel();
      }
    } else {
      action();
    }
  }

  const handleClosePopup = () => {
    executeDirtyCheck(() => {
      props.toggleClosePopupSettingCondition();
    });
  }

  const arrLang = () => [
    {
      get: categoryNameEnUS,
      set: setCategoryNameEnUS,
      label: 'products.english',
      key: 'en_us'
    },
    {
      get: categoryNameJaJp,
      set: setCategoryNameJaJp,
      label: 'products.japanese',
      key: 'ja_jp',
    },
    {
      get: categoryNameZhCn,
      set: setCategoryNameZhCn,
      label: 'products.chinese',
      key: 'zh_cn'
    },
  ]

  const handleEventUpdateCategory = () => {
    const findLang = arrLang().find(_lang => _lang.key === lang)
    setCategoryNameZhCn(categoryNameZhCn.trim())
    setCategoryNameJaJp(categoryNameJaJp.trim())
    setCategoryNameEnUS(categoryNameEnUS.trim())
    if(!findLang.get.trim()){
      setMsgValidate(translate("messages.ERR_COM_0013"))
      return
    }
    // !findLang.get && 
    let name = {};
    if (categoryNameEnUS || categoryNameJaJp || categoryNameZhCn) {
      name = {
        'en_us': categoryNameEnUS.trim(),
        'ja_jp': categoryNameJaJp.trim(),
        'zh_cn': categoryNameZhCn.trim()
      }
    }
    setCategoryName(`${JSON.stringify(name)}`);
    if (props.isRegist) {
      props.handleCreateCategory(`${JSON.stringify(name)}`, categoryId);
    } else {
      props.handleUpdateCategory(props.categoryObj.productCategoryId, `${JSON.stringify(name)}`, categoryId, categoryDto.updatedDate);
    }

  }
  const [, prevHasCreateNewCategory2] = useWillReceiveProps<boolean>(props.hasCreateNewCategory2);

  useEffect(() => {
    const isPopup2 = !props.onAddNewCategory
    if (isPopup2) {
      props.reset();
      setCategoryId(null)
    }
  }, [])

  useEffect(() => {
    if (isUpdateSuccess || isCreateSuccess) {
      props.setMessage(isCreateSuccess ? translate('messages.INF_COM_0003') : translate('messages.INF_COM_0004'));

      // nếu là popup thứ 1 thì reset hết, popup thứ 2 thì giữ lại newCategory
      const isPopup1 = !!props.onAddNewCategory

      // nếu không có popup2 || vừa đóng popup 2 
      const isNoPopup2OrPopup2Closed: boolean = (!props.hasCreateNewCategory2 && !prevHasCreateNewCategory2) || (!props.hasCreateNewCategory2 && prevHasCreateNewCategory2)

      if (props.popupMoveCategory) {
        props.reset(true)

      } else if (isPopup1) {
        // nếu popup là popup1, check có vừa đóng popup2 hay k, nếu có thì k reset hết
        props.reset(!isNoPopup2OrPopup2Closed)
      } else {
        // nếu là popup2 thì k reset hết
        props.reset(true)
      }

      isNoPopup2OrPopup2Closed && props.toggleClosePopupSettingCondition(true);
    }
  });


  useEffect(() => {
    // categoryName.current.focus();
    props.handleGetProductCategories();
  }, []);

  const onActionSelectTag = (id: any, type: TagAutoCompleteType, mode: TagAutoCompleteMode, listTag: any[]) => {
    if (listTag && listTag.length > 0) {
      setCategoryId(listTag[0].productCategoryId)
    } else {
      setCategoryId(null)
      setParentRecord(null)
    }
  };


  // let arrLabel = ['en_us', 'ja_jp', 'zh_cn'];

  const renderInput = () => {
    const sortLang = [...arrLang()].sort(_item => _item.key === lang ? -1 : 1)
    return sortLang.map(({ key, get, set, label }, index) => <div key={index} >
      <div className="wrap-input-edit mt-15 mb-0 pt-15">
        <input
          className={`input-normal mr-2 ${(lang === key && msgValidate) ? ' error' : ''}`}
          value={get} type="text"
          onChange={(e) => set(e.target.value)}
        />
        <p>{translate(label)}</p>
      </div>
      {msgValidate && lang === key && <span className="color-red font-size-10">{msgValidate}</span>}
    </div>)
  };

  const defaultInput = () => {
    const findLang = arrLang().find(_langObj => _langObj.key === lang)
    return <div>
      <input
        className={`input-normal ${errorMsgJajp || msgValidate ? 'error' : ''}`}
        value={findLang.get} type="text"
        onChange={(e) => findLang.set(e.target.value)}
        placeholder={translate("products.category.form.name-placeholder")}
      />
    </div>
  }

  return (
    <div className="popup-esr2 popup-product custom-popup" id="popup-esr2" >
      <div className="popup-esr2-content">
        <button type="button" className="close position-absolute" onClick={handleClosePopup}>×</button>
        <div className="popup-esr2-body">
          <div className="popup-esr2-title">{props.isRegist ? translate("products.category.form.title.regis") : translate("products.category.form.title.edit")}</div>
          <AvForm id="category-form" >
            <div className="form-group">
              <TagAutoCompleteProductCategory
                id="productsSets"
                title={translate("products.category.form.parentId")}
                type={TagAutoCompleteType.ProductCategories}
                mode={TagAutoCompleteMode.Single}
                onActionSelectTag={onActionSelectTag}
                isHideResult={false}
                tagSearch={true}
                elementTags={parentRecord ? [parentRecord] : null}
                placeholder={translate("products.category.form.category-placeholder")}
                editCategory={(!props.isRegist && props.categoryObj.productCategoryId) ? props.categoryObj.productCategoryId : null}
                onAddNewCategory={props.onAddNewCategory}
                isPopup1={!!props.onAddNewCategory}
              />
            </div>

            {isShowLanguage ?
              <div className="form-group">
                <label>{translate("products.category.form.name")}</label>
                {renderInput()}
              </div>
              :
              <div className="form-group" >
                <label>{translate("products.category.form.name")}</label>
                {defaultInput()}
                {msgValidate && <span className="color-red font-size-10">{msgValidate}</span>}
              </div>
            }

            <a className="ml-3 text-underline" title="" onClick={() => setIsShowLanguage(!isShowLanguage)}><b>{isShowLanguage ? translate("products.category.form.hide-language") : translate("products.category.form.show-language")}</b></a>
            <div className="popup-esr2-footer float-right  border-0">
              <a onClick={handleClosePopup} className="button-cancel">{translate("products.category.form.button.cancel")}</a>
              <a onClick={handleEventUpdateCategory} className="button-blue button-form-register ">{props.isRegist ? translate("products.category.form.button.regis") : translate("products.category.form.button.edit")}</a>
            </div>
          </AvForm>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = ({ categoryRegistEdit }: IRootState) => ({
  isUpdateSuccess: categoryRegistEdit.isUpdateSuccess,
  isCreateSuccess: categoryRegistEdit.isCreateSuccess,
  errorMessage: categoryRegistEdit.errorMessage,
  category: categoryRegistEdit.category,
  categories: categoryRegistEdit.categories,
  newCategory: categoryRegistEdit.newCategory
});

const mapDispatchToProps = {
  handleGetProductCategories,
  handleUpdateCategory,
  handleCreateCategory,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CategoryRegistEdit);
