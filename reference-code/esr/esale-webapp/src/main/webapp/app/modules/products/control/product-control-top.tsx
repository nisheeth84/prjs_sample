import { AUTHORITIES, ScreenMode } from "app/config/constants";
import { hasAnyAuthority } from "app/shared/auth/private-route";
import ConfirmDialog from "app/shared/layout/dialog/confirm-dialog";
import { IRootState } from "app/shared/reducers";
import useEventListener from "app/shared/util/use-event-listener";
import React, { useEffect, useRef, useState } from "react";
import { translate } from "react-jhipster";
import { connect } from "react-redux";
import { PRODUCT_ACTION_TYPES, PRODUCT_LIST_ID, PRODUCT_SET_CREATE, PRODUCT_VIEW_MODES, SEARCH_MODE } from '../constants';
import { handleCheckDeleteProduct, handleExportProducts, handleInitProductList, ProductAction } from '../list/product-list.reducer';
import ConfirmDialogCustom from './popup/dialog-custom/confirm-dialog';
import Tooltip from '../components/Tooltip';

interface IControlTopProps extends StateProps, DispatchProps {
  toggleSwitchDisplay,
  toggleOpenPopupSearch,
  toggleOpenPopupEdit: any,
  toggleSwitchEditMode?: (isEdit: boolean) => void,
  toggleUpdateInEditMode?: () => void,
  enterSearchText?: (text) => void,
  textSearchOld?: string,
  textSearch?: string,
  hideEditCtrl?: boolean,
  modeDisplay?: ScreenMode,
  sidebarCurrentId?,
  // for page change
  parentCallback,
  recordCheckListView,
  onOpenPopupCategory,
  toggleOpenPopupProductSet: (ids) => void,
  conDisplaySearchDetail: any,
  setConDisplaySearchDetail: (boolean) => void,
  searchMode: any,
  setSearchMode,
  orderBy,
  reloadScreenByCategory,
  reloadScreenDefault,
  handleOpenPopupMoveCategory,
  listProductChecked,
  view,
  toggleOpenPopupSetting,
  toggleOpenHelpPopup
}

interface IDynamicListStateProps {
  recordCheckList: any,
  authorities,
}

interface IProductControlSidebarProps {
  checkDeleteProduct: any,
  deleteProducts: any,
  action: any,
  deleteProductByIcon
}

type IProductControlTopProps = IControlTopProps & IDynamicListStateProps & IProductControlSidebarProps;

const ProductControlTop = (props: IProductControlTopProps) => {
  const [valueTextSearch, setValueTextSearch] = useState(props.textSearch);
  const [valueTextSearchOld, setValueTextSearchOld] = useState(props.textSearch);
  const [showRegistrationOption, setShowRegistrationOption] = useState(false);
  const [type, setType] = useState(1);
  const [recordCheckList, setRecordCheckList] = useState([]);
  // const optionRef = useRef(null);
  const registerRef = useRef(null);
  const registerEditRef = useRef(null);
  const registerPopupProductSet = useRef(null);

  const isAdmin = hasAnyAuthority(props.authorities, [AUTHORITIES.ADMIN]);
  const { toggleOpenPopupSetting, toggleOpenHelpPopup } = props;

  useEffect(() => {

  }, [props.sidebarCurrentId]);

  useEffect(() => {
    if (props.view === 1) {
      setRecordCheckList(props.recordCheckList)
    }
  }, [props.recordCheckList]);

  useEffect(() => {
    if(props.view === 2){
      setRecordCheckList(props.recordCheckListView)
    }
  }, [props.recordCheckListView]);

  useEffect(() => {
    if (props.urlProductsDownload) {
      // download file csv when api response an url
      window.open(props.urlProductsDownload);
    }
  }, [props.urlProductsDownload]);

  const switchView = () => {
    if (props.modeDisplay === ScreenMode.DISPLAY) {
      setRecordCheckList([])
      if (type === 1) {
        setType(2);
        props.parentCallback(2);
      } else if (type === 2) {
        setType(1);
        props.parentCallback(1);
      }
    }
  };
  const onClickSwitchDisplay = (event) => {
    if (props.modeDisplay === ScreenMode.DISPLAY) {
      props.toggleSwitchDisplay();
      event.preventDefault();
    }
  };
  const onClickOpenPopupSearch = (event) => {
    if (props.modeDisplay === ScreenMode.DISPLAY) {
      props.toggleOpenPopupSearch();
      event.preventDefault();
    }
  };
  const onClickOpenPopupEdit = () => {
    props.toggleOpenPopupEdit(PRODUCT_ACTION_TYPES.CREATE, PRODUCT_VIEW_MODES.EDITABLE);
  };

  const onBlurTextSearch = (event) => {
    if (props.enterSearchText && valueTextSearchOld !== valueTextSearch.trim()) {
      setValueTextSearchOld(valueTextSearch.trim());
      props.enterSearchText(valueTextSearch.trim());
    }
  }
  const handleKeyPress = (event) => {
    if (event.charCode === 13) {
      if (props.enterSearchText) {
        setValueTextSearchOld(valueTextSearch.trim());
        props.enterSearchText(valueTextSearch.trim());
      }
    }
  }

  const onOpenPopupCategory = () => {
    props.onOpenPopupCategory()
  }

  const hasRecordCheck = () => {
    return recordCheckList && recordCheckList.length > 0 && recordCheckList.filter(e => e.isChecked).length > 0;
  }

  const getCheckedIds = () => {
    const listCheckedIds = [];
    if (hasRecordCheck()) {
      recordCheckList.forEach(e => {
        listCheckedIds.push(e)
      });
    }
    return listCheckedIds;
  }

  const onClickOpenPopupProductSet = (isEmpty) => {
    const lstChecked = getCheckedIds();
    const lstCheckedId = [];
    if (isEmpty) {
      lstChecked.forEach(e => {
        lstCheckedId.push(e.productId);
      })
    }
    props.toggleOpenPopupProductSet(lstCheckedId);
  };

  const onOpenPopupMoveCategory = () => {
    props.handleOpenPopupMoveCategory(recordCheckList);
  }

  const checkDeleteByIcon = () => {
    const lstChecked = getCheckedIds();
    const lstCheckedId = [];
    lstChecked.forEach(e => {
      lstCheckedId.push(e.productId);
    })
    props.handleCheckDeleteProduct(lstCheckedId);
  }

  const getNameProduct = (id) => {
    let rs = '';
    const propsProductList = props.productListProp && props.productListProp.dataInfo.products;
    propsProductList && propsProductList.map(item => {
      if(item.product_id === id) rs = item.product_name;
    })
    return rs;
  }

  const deleteByIcon = async () => {
    const itemName = getNameProduct(recordCheckList[0].productId);
    const result = await ConfirmDialog({
      title: (<>{translate('products.top.dialog.title-delete-products')}</>),
      message:  translate('messages.WAR_PRO_0001'),
      // message: `${recordCheckList && recordCheckList.length > 1 ? translate('messages.WAR_COM_0002', {0: recordCheckList.length}) : translate('messages.WAR_COM_0001', {itemName})}`,
      confirmText: translate('products.top.dialog.confirm-delete-products'),
      confirmClass: "button-red",
      cancelText: translate('products.top.dialog.cancel-text'),
      cancelClass: "button-cancel"
    });
    if (result) {
      props.deleteProductByIcon(null);
    }
  }

  const confirmDeleteProductsInSet = async (data) => {
    const result = await ConfirmDialogCustom({
      isCustom: true,
      title: (<>{translate('products.top.dialog.title-delete-products')}</>),
      // message: translate('messages.WAR_PRO_0002'),
      message: (<>
        <b >{translate('messages.WAR_PRO_0002')}</b>
        <div className="warning-content-popup">
          <div className="warning-content text-left limit-height-confirm-dedele-multi-product ">
            {data.productListConfirmLists.map((item, idk) => {
              return (
                <>
                  <b key={idk}>{translate('messages.WAR_PRO_0005', { 0: item.productName })}</b>
                  {item.productSetAffectLists && item.productSetAffectLists.map((item1, idk1) => {
                    return (
                      <b key={idk1}>{item1.setName}</b>
                    )
                  })}
                  <br/>
                </>
              )
            })}
          </div>
        </div>

      </>),
      confirmText: translate('products.top.dialog.confirm-delete-products'),
      confirmClass: "button-red",
      cancelText: translate('products.top.dialog.cancel-text'),
      cancelClass: "button-cancel"
    });
    if (result) {
      if (data.productSetConfirmLists && data.productSetConfirmLists.length === 0) {
        props.deleteProductByIcon(null);
      } else if (data.productSetConfirmLists && data.productSetConfirmLists.length > 0) {
        const setDels = [];
        data.productSetConfirmLists.forEach(item => {
          if(item.productDeleteLists.filter(x => !props.listProductChecked.map(y => y.product_id).includes(x.productId)).length <= 0){
            setDels.push(item);
          }
        })
        if (setDels.length > 0) {
          const result2 = await ConfirmDialogCustom({
            isCustom: true,
            title: (<>{translate('products.top.dialog.title-delete-products')}</>),
            message: (<>
              <b >{translate('messages.WAR_PRO_0003')}</b>
              <div className="warning-content-popup">
                <div className="warning-content text-left">
                  {
                    setDels.map((item, idk) => {
                      if(item.productDeleteLists){
                        const name = item.productDeleteLists.map(item1 => item1.productName).join(", ");
                        return (
                          <>
                            <b>{translate('messages.WAR_PRO_0006', { 0: name })}</b>
                            <b>{item.setName}</b>
                          </>
                        )
                      }
                      // {item.productDeleteLists && item.productDeleteLists.map((item1, idk1) => {
                      //   return (
                      //     <b key={idk1}>{item1.setName}</b>
                      //   )
                      // })}
                      // return (
                      //   <b key={idk}>{translate('messages.WAR_PRO_0006', { 0: item.name })}</b>
                      // )
                    })
                  }
                </div>
              </div>

            </>),
            confirmText: translate('products.delete-product-and-set'),
            confirmClass: "button-red",
            cancelText: translate('products.top.dialog.cancel-text'),
            cancelClass: "button-cancel"
          });
          if (result2) {
            props.deleteProductByIcon(setDels);
          }
        } else {
          props.deleteProductByIcon(null);
        }
      }
    }
  }

  useEffect(() => {
    if (props.action === ProductAction.Success) {
      if (props.checkDeleteProduct.productListConfirmLists && props.checkDeleteProduct.productListConfirmLists.length === 0) {
        deleteByIcon();
      } else if (props.checkDeleteProduct.productListConfirmLists && props.checkDeleteProduct.productListConfirmLists.length > 0) {
        confirmDeleteProductsInSet(props.checkDeleteProduct);
      }
    }
  }, [props.checkDeleteProduct]);

  useEffect(() => {
    if (props.action === ProductAction.Success) {
      props.reloadScreenByCategory();
    }
  }, [props.deleteProducts]);

  const handleMouseDownRegistration = (e) => {
    if (!registerRef || !registerRef.current || !registerEditRef || !registerEditRef.current || !registerPopupProductSet || !registerPopupProductSet.current) {
      return;
    }
    if ((registerRef.current && registerRef.current.contains(e.target)) ||
      (registerEditRef.current && registerEditRef.current.contains(e.target)) ||
      (registerPopupProductSet.current && registerPopupProductSet.current.contains(e.target))
    ) {
      return;
    }
    setShowRegistrationOption(false);
  }

  /**
   * get checked employees in list from recordCheckList
   */
  const getCheckedProductsFromCheckList = () => {
    const listCheckedIds = [];
    const listUpdatedDates = [];
    recordCheckList.forEach(e => {
      if (e.isChecked) {
        listCheckedIds.push(e.productId);
        listUpdatedDates.push(e.updatedDate);
      }
    });
    return { listCheckedIds, listUpdatedDates };
  }

  const exportProducts = () => {
    if (hasRecordCheck()) {
      const listCheckedIds = getCheckedProductsFromCheckList().listCheckedIds;
      props.handleExportProducts(listCheckedIds, props.orderBy);
    }
  }

  const cancelSearchConditions = () => {
    props.setConDisplaySearchDetail(false);
    props.setSearchMode(SEARCH_MODE.NONE);
    props.reloadScreenDefault();
  }

  useEventListener('mousedown', handleMouseDownRegistration);

  return (
    <div className="control-top control-top-product ">
      <div className="left">
        <div className={"button-shadow-add-select-wrap custom"}>
          <a title="" className={"button-shadow-add-select" + ((!isAdmin || props.modeDisplay === ScreenMode.EDIT) ? " disable" : "")} onClick={(event) => { if (isAdmin && props.modeDisplay === ScreenMode.DISPLAY) { onClickOpenPopupEdit(); event.preventDefault(); } }}>{translate('products.top.title.register-product')}</a>
          <span className={"button-arrow" + ((!isAdmin || props.modeDisplay === ScreenMode.EDIT) ? " disable" : "") + (showRegistrationOption ? " active" : "")} onClick={() => setShowRegistrationOption(!showRegistrationOption)}></span>
          {showRegistrationOption && isAdmin &&
            <div className="box-select-option">
              <ul>
                <li><a href="" onClick={(event) => { onClickOpenPopupEdit(); event.preventDefault(); }} ref={registerEditRef}>{translate('products.top.title.register-product')}</a></li>
                <li><a href="" onClick={(event) => { onClickOpenPopupProductSet(PRODUCT_SET_CREATE.EMPTY); event.preventDefault(); setShowRegistrationOption(false) }} ref={registerPopupProductSet}>{translate('products.top.title.create-product-set-list')}</a></li>
                <li><a href="" onClick={(event) => { onOpenPopupCategory(); event.preventDefault(); setShowRegistrationOption(false) }} ref={registerRef}>{translate('products.top.title.create-category')}</a></li>
                <li><a href="" onClick={() => setShowRegistrationOption(false)}>{translate('products.top.title.import-product')}</a></li>
                <li><a href="" onClick={() => setShowRegistrationOption(false)}>{translate('products.top.title.import-product-breakdown')}</a></li>
              </ul>
            </div>}
        </div>

        {hasRecordCheck()  &&
          <>
            {isAdmin &&
              <>
                <a className="icon-primary icon-box" onClick={() => { onClickOpenPopupProductSet(PRODUCT_SET_CREATE.NOT_EMPTY) }}><Tooltip text={translate('products.top.title.create-product-set')} /></a>
                <a className="icon-primary icon-file-out" onClick={onOpenPopupMoveCategory}> <Tooltip text={translate("products.top.title.move-category")}/></a>
                <a className="icon-primary icon-erase" onClick={checkDeleteByIcon}><Tooltip text={translate('products.top.title.btn-delete')} /></a>
              </>
            }
            {props.modeDisplay !== ScreenMode.EDIT && <a className="icon-primary icon-import" onClick={exportProducts}><Tooltip text={translate('products.top.title.btn-export')} /></a>}
          </>
        }
      </div>
      <div className="right">
        {  
        !(hasRecordCheck() &&  props.modeDisplay === ScreenMode.EDIT) && <>
          <a onClick={onClickSwitchDisplay} className={"icon-primary icon-switch-display" + (props.modeDisplay === ScreenMode.EDIT ? " disable" : "")}><Tooltip text={translate('products.top.title.switch-display')} /></a>
          <a onClick={switchView} className={"icon-primary icon-board-view ml-2" + (props.modeDisplay === ScreenMode.EDIT ? " disable" : "")}><Tooltip text={translate('products.top.title.switch-view')} /></a>
        </>
        }   
        <div className={"search-box-button-style" + (props.modeDisplay === ScreenMode.EDIT ? " disable" : "")}>
          <button className={"icon-search border-radius-10" + (props.modeDisplay === ScreenMode.EDIT ? " disable" : "")}><i className="far fa-search" /></button>
          <input type="text" disabled={props.modeDisplay === ScreenMode.EDIT} placeholder={translate('products.top.place-holder.search')} defaultValue={props.textSearch} value={valueTextSearch}
            onChange={(e) => setValueTextSearch(e.target.value)} onBlur={onBlurTextSearch} onKeyPress={handleKeyPress} />
          <button className={"icon-fil"} onClick={onClickOpenPopupSearch} />
          {(props.searchMode === SEARCH_MODE.CONDITION && props.conDisplaySearchDetail) &&
            <div className="tag">
              {translate('products.top.place-holder.searching')}
              <button className="close" onClick={cancelSearchConditions}>×</button>
            </div>}
        </div>
        {props.modeDisplay === ScreenMode.DISPLAY && isAdmin &&
          <a className="button-primary button-simple-edit ml-2 button-simple-edit-product cursor-pointer" onClick={(e) => props.toggleSwitchEditMode(true)}>{translate('products.top.title.btn-edit')}</a>}
        {props.modeDisplay === ScreenMode.EDIT &&
          <button className="button-cancel" type="button" onClick={(e) => props.toggleSwitchEditMode(false)}>{translate('products.top.title.btn-cancel')}</button>}
        {props.modeDisplay === ScreenMode.EDIT &&
          <button className="button-save" type="button" onClick={(e) => props.toggleUpdateInEditMode()}>{translate('products.top.title.btn-save')}</button>}
        <a onClick={toggleOpenHelpPopup} className="icon-small-primary icon-help-small" />
        {isAdmin &&
          <a onClick={toggleOpenPopupSetting} className="icon-small-primary icon-setting-small" />}
      </div>
    </div>
  );
}

const mapStateToProps = ({ dynamicList, authentication, productList }: IRootState) => ({
  authorities: authentication.account.authorities,
  recordCheckList: dynamicList.data.has(PRODUCT_LIST_ID) ? dynamicList.data.get(PRODUCT_LIST_ID).recordCheckList : [],
  checkDeleteProduct: productList.checkDeleteProduct,
  deleteProducts: productList.deleteProducts,
  action: productList.actionDelete,
  productListProp: productList.products,
  urlProductsDownload: productList.productsInfo
});

const mapDispatchToProps = {
  handleInitProductList,
  handleCheckDeleteProduct,
  handleExportProducts
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductControlTop);

