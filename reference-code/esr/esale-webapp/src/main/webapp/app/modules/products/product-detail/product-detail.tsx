import _ from 'lodash';
import * as R from 'ramda'
import { useId } from "react-id-generator";
import { AUTHORITIES, FIELD_BELONG, ScreenMode, SCREEN_TYPES, TIMEOUT_TOAST_MESSAGE } from 'app/config/constants';
import { hasAnyAuthority } from 'app/shared/auth/private-route';
import DialogDirtyCheck from 'app/shared/layout/common/dialog-dirty-check';
import ConfirmDialog from 'app/shared/layout/dialog/confirm-dialog';
import ConfirmDialogCustom from '../control/popup/dialog-custom/confirm-dialog';
import { DEFINE_FIELD_TYPE, DynamicControlAction , FieldInfoType} from 'app/shared/layout/dynamic-form/constants';
// import SwitchFieldPanel from 'app/shared/layout/dynamic-form/switch-display/switch-field-panel';
import DynamicSelectField from 'app/shared/layout/dynamic-form/control-field/dynamic-select-field';
import { IRootState } from 'app/shared/reducers';
import React, { useEffect, useRef, useState } from 'react';
import { Storage, translate } from 'react-jhipster';
import { connect } from 'react-redux';
import { Modal } from 'reactstrap';
import { isNullOrUndefined } from 'util';
import BoxMessage, { MessageType } from '../../../shared/layout/common/box-message';
import PopupEmployeeDetail from '../../employees/popup-detail/popup-employee-detail';
import { DEFAULT_PAGE, PRODUCT_ACTION_TYPES, PRODUCT_VIEW_MODES, TAB_ID_LIST, CLASS_CUSTOM, EVENT_MESSAGES_POPOUT, TypeMessage } from '../constants';
import { handleDeleteProducts } from '../list/product-list.reducer';
import ModalCreateEditProduct from '../product-popup/product-edit';
import { moveScreenReset } from 'app/shared/reducers/screen-move.reducer'
import { getFieldLabel } from 'app/shared/util/string-utils';
import RelationDisplayTab from 'app/shared/layout/dynamic-form/control-field/view/relation-display-tab'
import TabList from './product-detail-tab-list';
import TabChangeHistory from 'app/shared/layout/common/history/display-history';
import TabSummary from './product-detail-tabs/product-detail-tab-summary';
import { handleFieldPreview, handleDataAvailable, getCurrencyUnit } from '../utils';
import useEventListener from 'app/shared/util/use-event-listener';
import { useDetectFormChange } from 'app/shared/util/useDetectFormChange';
import { processRelationselectOrganization, putDataToFieldEdit, isFieldRelationAsTab, createNewFieldLookup, revertDeletedFields, initialRevertFields, concatArray } from 'app/shared/util/utils';
import {
  changeScreenMode, 
  handleCheckDeleteProduct, 
  resetState,
  handleInitProductChangeHistory, 
  handleInitProductDetail,
  handleReorderField,
  handleUpdateCustomFieldInfo,
  ProductAction,
  getCustomFieldsInfoProductTrading
} from './product-detail-reducer';
import Sticky from 'react-sticky-el';
import DetailTabProductTrading from 'app/shared/layout/popup-detail-service-tabs/popup-detail-tab-product-trading';
import { CUSTOMER_GET_FIELD_TAB } from 'app/modules/customers/constants';
import DynamicSelectFieldTab from 'app/shared/layout/dynamic-form/control-field/dynamic-select-field-tab';
import { getFieldInfoPersonals } from 'app/shared/layout/dynamic-form/list/dynamic-list.reducer';


export const AVAILABLE_FLAG = {
  UNAVAILABLE: 0,
  WEB_APP_AVAILABLE: 3
};

export interface IProductDetailProps extends StateProps, DispatchProps {
  iconFunction?: string,
  showModal: boolean;
  backdrop?: boolean; // [backdrop:false] when open from popup
  productId: any,
  popout?: boolean,
  popoutParams?: any,
  productMessageMutation?: any,
  isList?: boolean,
  toggleSwitchEditMode?: (isEdit: boolean) => void,
  toggleClosePopupProductDetail?: (isBack?, isUpdateField?) => void,
  toggleOpenPopupEdit?: (update, editable, productId, isOnly, isContain) => void,
  resetSuccessMessage?: () => void;
  openProductDetailFromOther?: (id, isProductSet) => void;
  openFromModal?: boolean;
  onPageChangeInDetailScreen?: (isNext:boolean) => void
}

export enum FSActionTypeScreen {
  None,
  RemoveSession,
  SetSession,
  GetSession,
  CloseWindow,
  Search,
}

export enum PopupConditionDisplay {
  None,
  ModalDialog,
  Window,
}

export enum SettingModes {
  CreateNewInput,
  AddNotAvailabelInput,
  EditInput
}


const ProductDetail = (props: IProductDetailProps) => {
  const [showModal, setShowModal] = useState(true);
  const [forceCloseWindow, setForceCloseWindow] = useState(false);
  const [currentTab, setCurrentTab] = useState(TAB_ID_LIST.summary);
  const [currentProduct, setCurrentProduct] = useState(props.productId);
  const [summaryFields, setSummaryFields] = useState(null);
  const [tradingProductsFields, setTradingProductsFields] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [heightTable, setHeightTable] = useState(0);
  const [, setShowConditionDisplay] = useState(PopupConditionDisplay.None);

  /* mode edit */
  const [popupSettingMode, setPopupSettingMode] = useState(SettingModes.CreateNewInput);
  const [currentFieldEdit, setCurrentFieldEdit] = useState(null);
  const [isSaveField, setIsSaveField] = useState(false);
  const [fieldEdit, setFieldEdit] = useState();
  const [paramsEdit, setParamsEdit] = useState();
  const [tabListUpdate, setTabListUpdate] = useState(null);
  const [deletedSummaryFields, setDeletedSummaryFields] = useState([]);
  const [tabList, setTabList] = useState(props.product ? props.product.tabInfo : []);
  const [tabListShow, setTabListShow] = useState(props.product ? props.product.tabInfo.filter(e => e.isDisplay) : null);
  const [productFieldUnavailable, setProductFieldUnavailable] = useState([]);
  const [deleteFieldUnavailable, setDeleteFieldUnavailable] = useState([]);
  const [messageDownloadFileError, setMessageDownloadFileError] = useState(null);
  const [, setIsDelete] = useState(false);
  const [countSave] = useState({});
  /* end mode edit */

  /* call popup */
  const [openPopupEdit, setOpenPopupEdit] = useState(false);
	const [openPopupEmployeeDetail, setOpenPopupEmployeeDetail] = useState(false);
  const [employeeId, setEmployeeId] = useState(0);
  /* end call popup */

  const [isEditAvailableField, setIsEditAvailableField] = useState(false);
  const tabSummaryRef = useRef(null);
  const [fieldCallback, setFieldCallback] = useState({});

  const [toastMessage, setToastMessage] = useState(null);
  const [fieldRelationTab, setFieldRelationTab] = useState([]);
  const [editedSummaryFields, setEditedSummaryFields] = useState([]);
	const [isLoadProduct, setIsLoadProduct] = useState(false);
  const [isOpenMenuAddTab, setIsOpenMenuAddTab] = useState(false);
  const [normalMessage, setNormalMessage] = useState(null);
  const [productViewMode , setProductViewMode] = useState(PRODUCT_VIEW_MODES.EDITABLE)
  const [ actionTypePopup, setActionTypePopup ] = useState()
  const [ isShowModal, setIsShowModal] = useState(true)
  // const [isHover, setIsHover] = useState(false);

  const { screenMoveInfo } = props;
  const tableListRef = useRef(null);
  const actionTabRef = useRef(null);
  const isAdmin = hasAnyAuthority(props.authorities, [AUTHORITIES.ADMIN]);
  const [summaryFieldRevert, setSummaryFieldRevert] = useState([]);
  const [ isUpdateField, setIsUpdateField] = useState(false)
  const [tabProductTradingFields, setTabProductTradingFields] = useState([]);
  const [deleteTabProductTradingFields, setDeleteTabProductTradingFields] = useState([]);
  const employeeDetailCtrlId = useId(1, "productDetailEmployeeDetail_")


  const initialState = {
    tabListShow: _.cloneDeep(props.product && props.product.tabInfo.filter(e => e.isDisplay)),
    tabList: _.cloneDeep(props.product && props.product.tabInfo),
    tabListUpdate: null,
    summaryFields: null
  };
  const [loadTab] = useState({
    summary: false,
    productTrading: false,
    productHistory: false
  })

  let isChangeField = false;

  const formId = '2ewqds1d-dsa';
  const [ isChangedForm, setChangeForm ] = useDetectFormChange(formId);


  useEffect(() => {
    setChangeForm(false);
    if (props.screenMode === ScreenMode.DISPLAY) {
      setNormalMessage({type: MessageType.None, message: []})
      setEditedSummaryFields([])
    }
  },[props.screenMode])

  const handleInitData = (productId, tab) => {
    if (productId) {
      switch (tab) {
        case TAB_ID_LIST.summary:
          if(!loadTab.summary){
            props.handleInitProductDetail(productId, false, true);
            props.getCustomFieldsInfoProductTrading()
          }
          break;
        case TAB_ID_LIST.productTrading:
          break;
        case TAB_ID_LIST.productHistory:
          if(!loadTab.productHistory){
            props.handleInitProductChangeHistory(productId, DEFAULT_PAGE, 30);
          }
          break;
        default:
          break;
      }
    }
  }

  useEventListener('message',ev => {
    if(ev.data?.id && ev.data?.type === FSActionTypeScreen.CloseWindow){
      handleInitData(ev.data.id, currentTab)
    }
  })

  /* _________________Optional_________________ */
  const cleanModeEdit = () => {
    props.changeScreenMode(false);
    setPopupSettingMode(SettingModes.CreateNewInput);
    setTabListUpdate(null);
    setSummaryFields(null);
    setCurrentFieldEdit(null);
    setTabListShow(initialState.tabListShow);
    setTabList(initialState.tabList);
    setToastMessage(null);
    setFieldCallback({});
    setIsOpenMenuAddTab(false);
    setDeletedSummaryFields([]);
    setNormalMessage({type: MessageType.None, message: []})
    setProductFieldUnavailable(_.cloneDeep(props.productFieldsUnVailable))
  }

  const executeDirtyCheck = async (action: () => void, cancel?: () => void) => {
    if (isChangedForm) {
      await DialogDirtyCheck({ onLeave: action, onStay: cancel , partternType: 1});
    } else {
      action();
    }
  }

  const handleClosePopup = () => {
    executeDirtyCheck(() => {
      setShowConditionDisplay(PopupConditionDisplay.None);
      Object.keys(loadTab).forEach((item) => {
        loadTab[item] = false;
      })
      props.toggleClosePopupProductDetail(null, isUpdateField);
      props.resetSuccessMessage();
      props.resetState();
      cleanModeEdit();
    })
  }

  const toggleOpenPopupEdit = (viewMode, action, showModalPopup) => {
    setIsShowModal(showModalPopup);
    setActionTypePopup(action);
    setProductViewMode(viewMode);
    

    if(viewMode === PRODUCT_VIEW_MODES.PREVIEW) return setOpenPopupEdit(true);
    if (props.popout) return setOpenPopupEdit(true);
    if(!props.isList && !props.toggleOpenPopupEdit){
      setIsShowModal(true)
      setOpenPopupEdit(true);
    } else{
      props.toggleOpenPopupEdit(PRODUCT_ACTION_TYPES.UPDATE, PRODUCT_VIEW_MODES.EDITABLE, (currentProduct ? currentProduct : props.popoutParams.productId), false, true)
      handleClosePopup();
    }
  }

  const copyUrlProduct = (url) => {
    const dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = `${window.location.origin}/${props.tenant}/product-detail/${currentProduct}`;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
  }

  const getCurrentIndexProduct = () => {
    let index = null;
    props.listProductId.forEach((id, i) => {
      if (currentProduct === id) {
        index = i;
      }
    });
    return index
  }


  const checkIsHeadOrLastProductInList = (productId, isNext: boolean) => {
    const { listProductId = [], onPageChangeInDetailScreen = () => {} } = props

    if(isNext){
      const isLast =  R.equals(R.last(listProductId), productId)
      isLast && onPageChangeInDetailScreen(true)
      return
    }

    const isHead =  R.equals(R.head(listProductId), productId)
    isHead && onPageChangeInDetailScreen(false)
    return
  }

  useEffect(() => {
    checkIsHeadOrLastProductInList(currentProduct, true)  
    checkIsHeadOrLastProductInList(currentProduct, false)  
  }, [currentProduct])

  const onNextProduct = () => {
    let nextProductId = null;
    const currentIndexProduct = getCurrentIndexProduct();

    props.listProductId.forEach((id, idx) => {
      if (idx === currentIndexProduct) {
        nextProductId = props.listProductId[idx + 1];
      }
    });

    if (nextProductId) {
      setCurrentProduct(_.cloneDeep(nextProductId));
    }
  }

  const onPrevProduct = () => {
    let prevProductId = null;
    const indexCurrentProduct = getCurrentIndexProduct();

    props.listProductId.forEach((id, i) => {
      if (i === indexCurrentProduct) {
        prevProductId = props.listProductId[i - 1];
      }
    });
    if (prevProductId) {
      setCurrentProduct(_.cloneDeep(prevProductId))
    }
  }

  const onClickBack = () => {
    if(props.screenMode === ScreenMode.EDIT){
      props.changeScreenMode(false);
    }
    if (props.openFromModal) {
      props.toggleClosePopupProductDetail(true);
    }
    // else{
    //   if(props.popout) window.close();
    // }
  }

  const updateStateSession = (mode: FSActionTypeScreen) => {
    if (mode === FSActionTypeScreen.SetSession) {
      Storage.local.set(ProductDetail.name, {
        summaryFields,
        tabListShow,
        currentTab,
        currentProduct,
        tradingProductsFields,
      });
    }
    else if (mode === FSActionTypeScreen.GetSession) {
      const saveObj = Storage.local.get(ProductDetail.name);

      if (saveObj) {
        setSummaryFields(saveObj.summaryFields);
        setTabListShow(saveObj.tabListShow);
        setCurrentTab(saveObj.currentTab);
        setCurrentProduct(saveObj.currentProduct);
        setTradingProductsFields(saveObj.tradingProductsFields);
        handleInitData(saveObj.currentProduct, saveObj.currentTab);
      }
    } else if (mode === FSActionTypeScreen.RemoveSession) {
      Storage.local.remove(ProductDetail.name);
    }
  }

  const openNewWindow = () => {
    updateStateSession(FSActionTypeScreen.SetSession);
    const height = screen.height * 0.8;
    const width = screen.width * 0.8;
    const left = screen.width * 0.3;
    const top = screen.height * 0.3;
    const style = `width=${width},height=${height},left=${left},top=${top}`;
    window.open(`${props.tenant}/product-detail/${props.productId}`, '', style.toString());
    handleClosePopup();
  }

  const onClosePopupEdit = () => {
    props.handleInitProductDetail(props.productId, false, true);
    setOpenPopupEdit(false);
  }

  const onOpenModalEmployeeDetail = (paramEmployeeId) : void => {
    setEmployeeId(paramEmployeeId);
    setOpenPopupEmployeeDetail(true);
  }

	const onClosePopupEmployeeDetail = (isBack?) => {
    document.body.classList.remove('wrap-employee');
    document.body.classList.add('wrap-product');
    setOpenPopupEmployeeDetail(false);
    if (!isBack) {
      props.toggleClosePopupProductDetail();
    }
  }

  const calculateHeightTable = () => {
    if (tableListRef && tableListRef.current) {
			const height = window.innerHeight - tableListRef.current.getBoundingClientRect().top - 24;
      if (height !== heightTable) {
        setHeightTable(height);
      }
    }
  }

  /**
   * Update tabList when select DislaySummary
   * editedItem : item after edited
   */
  const onSelectDislaySummary = editedItem => {
    const editItemIndex = tabList.findIndex(tab => tab.tabId === editedItem.tabId);
    const copyTabList = _.cloneDeep(tabList);
    copyTabList[editItemIndex] = {...copyTabList[editItemIndex], ...editedItem};
    setTabListUpdate(_.cloneDeep(copyTabList));
    setTabList(_.cloneDeep(copyTabList));
  }

  /* _________________Message_________________ */
  const displayToastMessage = (message, type, styleClass) => {
    if (_.isNil(message)) {
      return;
    }
    const objParams = { type, message, styleClass };
    objParams.type = type;
    objParams.message = [message];
    objParams.styleClass = styleClass;
    setToastMessage(objParams);
    if (type === MessageType.Success || message === "WAR_COM_0010" || message === 'WAR_COM_0013') {
      setTimeout(() => {
        setToastMessage(null);
      }, TIMEOUT_TOAST_MESSAGE);
    }
  };

  const displayNormalMessage = (message, type) => {
    if (_.isNil(message) || !message.length) {
      return;
    }
    const objParams = { type, message };
    objParams.type = type;
    objParams.message = [message];
    setNormalMessage(objParams);
	};

  const getErrorMessage = (errorCode) => {
    let errorMessage = '';
    if (!isNullOrUndefined(errorCode)) {
      errorMessage = translate('messages.' + errorCode);
    }
    return errorMessage;
  }

  // delete product set - trungbh
  const checkDeleteProductByIcon = () => {
    const productId = currentProduct ? currentProduct : props.popoutParams.productId
    props.handleCheckDeleteProduct(productId);
  };

  const deleteProductByIcon = (productIds, setIds) => {
    props.handleDeleteProducts(productIds, setIds);
  }

  const deleteByIcon = async (productId) => {
    const result = await ConfirmDialog({
      title: <>{translate('products.detail.title.popupErrorMessage.delete')}</>,
      message: translate('messages.WAR_PRO_0001'),
      confirmText: translate('products.detail.title.popupErrorMessage.delete'),
      confirmClass: 'button-red',
      cancelText: translate('products.detail.label.button.cancel'),
      cancelClass: 'button-cancel'
    });
    if (result) {
      deleteProductByIcon([productId], []);
        if(props.popoutParams){
          window.opener.postMessage({type:EVENT_MESSAGES_POPOUT.REMOVE_PRODUCT})
        }
    }
  }
  const confirmDeleteProductsInSet = async (data, productId) => {
    const result = await ConfirmDialogCustom({
      isCustom: true,
      title: (<>{translate('products.top.dialog.title-delete-products')}</>),
      message: (<>
        <b >{translate('messages.WAR_PRO_0002')}</b>
        <div className="warning-content-popup">
          <div className="warning-content text-left">
            {data.productListConfirmLists.map((item, idk) => {
              return (
                <>
                  <b key={idk}>{translate('messages.WAR_PRO_0005', { 0: item.productName })}</b>
                  {item.productSetAffectLists && item.productSetAffectLists.map((item1, idk1) => {
                    return (
                      <b key={idk1}>{item1.setName}</b>
                    )
                  })}
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
        const lstId = [];
        lstId.push(productId)
        deleteProductByIcon(lstId, []);
      } else if (data.productSetConfirmLists && data.productSetConfirmLists.length > 0) {
        const setDels = [];
        data.productSetConfirmLists.forEach(item => {
          if(item.productDeleteLists.filter(x => productId !== x.productId).length <= 0){
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
            const lstSetIds = [];
            setDels.forEach(item => lstSetIds.push(item.setId));
            deleteProductByIcon([productId], lstSetIds);
          }
        } else {
          const lstId = [];
          lstId.push(productId)
          deleteProductByIcon(lstId, []);
        }
      }
    }
  }

  /* _________________Tab list_________________ */
  const changeTab = (clickedTabId) => {
    setCurrentTab(clickedTabId);
    if(clickedTabId === TAB_ID_LIST.productTrading){
      props.getFieldInfoPersonals(
        `${CUSTOMER_GET_FIELD_TAB}${FIELD_BELONG.PRODUCT_TRADING}`,
        FIELD_BELONG.CUSTOMER,
        clickedTabId,
        FieldInfoType.Tab,
        null,
        null
      );
    }
  }

  const onDragDropTabList = (dragTabId, dropTabId) => {
    const dragIndexListShow = tabListShow.findIndex(e => e.tabId === dragTabId);
    let dropIndexListShow = tabListShow.findIndex(e => e.tabId === dropTabId);
    const dragIndexList = tabList.findIndex(e => e.tabId === dragTabId);
    let dropIndexList = tabList.findIndex(e => e.tabId === dropTabId);
    if (dragIndexListShow < 0 || dropIndexListShow < 0 || dragIndexListShow === dropIndexListShow) {
      return;
    }
    const objParamListShow = [];
    const objParamList = [];
    if (Math.abs(dragIndexListShow - dropIndexListShow) === 1) {
      const tempObjectListShow = tabListShow.splice(dragIndexListShow, 1, tabListShow[dropIndexListShow])[0]; // get the item from the array
      tabListShow.splice(dropIndexListShow, 1, tempObjectListShow);
    } else {
      const tmpObjectListShow = tabListShow.splice(dragIndexListShow, 1)[0]; // get the item from the array
      dropIndexListShow = tabListShow.findIndex(e => e.tabId === dropTabId);
      tabListShow.splice(dropIndexListShow, 0, tmpObjectListShow);
    }
    if (Math.abs(dragIndexList - dropIndexList) === 1) {
      const tempObjectList = tabList.splice(dragIndexList, 1, tabList[dropIndexList])[0]; // get the item from the array
      tabList.splice(dropIndexList, 1, tempObjectList);
    } else {
      const tmpObjectList = tabList.splice(dragIndexList, 1)[0]; // get the item from the array
      dropIndexList = tabList.findIndex(e => e.tabId === dropTabId);
      tabList.splice(dropIndexList, 0, tmpObjectList);
    }

    for (let i = 0; i < tabListShow.length; i++) {
      objParamListShow.push(_.cloneDeep(tabListShow[i]));
      objParamListShow[i].tabOrder = i + 1;
    }
    for (let i = 0; i < tabList.length; i++) {
      objParamList.push(_.cloneDeep(tabList[i]));
      objParamList[i].tabOrder = i + 1;
    }
    setTabListShow(objParamListShow);
    setTabList(objParamList);
    setTabListUpdate(objParamList);
  };

  const onDelAddTab = (tabListDelAddAfter, tabListAfter) => {
    const tabArray = [];
    if (tabListDelAddAfter.length > 0) {
      setTabListShow(_.cloneDeep(tabListDelAddAfter));
      tabListDelAddAfter.map(it => {
        tabArray.push(it.tabId)
      })
    }
    let listTemp = tabListAfter.sort((a, b) => a.tabOrder - b.tabOrder);
    listTemp = listTemp.map((it, index) => {
      let obj = {}
      if(tabArray.includes(it.tabId)){
        obj = Object.assign(it, {isDisplay: true,tabOrder: index+1})
      }else{

        obj = Object.assign(it, {isDisplay: false,tabOrder: tabListDelAddAfter.length+index+1})
      }
      return obj
    })
    setTabListUpdate(listTemp);
    setTabList(_.cloneDeep(tabListAfter));
  };

  const addTab = (tabId) => {
    tabList.map((tab) => {
      if (tab.tabId === tabId) {
        tab.isDisplay = true;
        tab.tabOrder = tabListShow[tabListShow.length - 1].tabOrder + 1;
        tabListShow.push(tab)
      }
    })
    const tabListTmp = tabList.filter(e => e.isDisplay === false)
    const tabsUpdate = _.cloneDeep(tabListShow);
    const lastTabOrderDisplay = tabListShow[tabListShow.length - 1].tabOrder;
    tabListTmp.sort((a , b) => a.tabOrder - b.tabOrder).forEach((item , idx) => {
      item.tabOrder = lastTabOrderDisplay + idx + 1;
      tabsUpdate.push(item);
    })
    setTabListShow(_.cloneDeep(tabListShow))
    onDelAddTab(tabListShow, tabList);
  }

  /* _________________Tab Summary_________________ */
  const onChangeSummaryFields = (fields, deleteFields, editedFields) => {
    setFieldCallback({ listField: _.cloneDeep(fields), deleteFields: null })
    setSummaryFields(_.cloneDeep(fields));
    setEditedSummaryFields(editedFields);
    setDeletedSummaryFields(_.cloneDeep(deleteFields));
  };

  const openDynamicSelectFields = async (currentSettingMode, currentField) => {
    if (isChangeField && currentFieldEdit && (currentField.fieldId > 0 || (currentField.fieldId < 0 && !_.isNil(currentField.userModifyFlg))) && 
      currentField.fieldId !== currentFieldEdit.fieldId) {

      const onEdit = () => {
        setPopupSettingMode(currentSettingMode);
        setCurrentFieldEdit(currentField);
      };
      const onCancel = () => { };

      await DialogDirtyCheck({
        onLeave: onEdit,
        onStay: onCancel
      });
    } else {
      setPopupSettingMode(currentSettingMode);
      setCurrentFieldEdit(currentField);
    }
    if (currentFieldEdit && currentFieldEdit.fieldId < 0 && _.isNil(currentFieldEdit.userModifyFlg)
      && _.isNil(countSave[currentFieldEdit.fieldId]) && currentField.fieldId !== currentFieldEdit.fieldId) {
      const summaryFieldsTmp = _.cloneDeep(summaryFields);
      const idx = summaryFieldsTmp.findIndex(e => e.fieldId === currentFieldEdit.fieldId);

      if (idx >= 0) {
        countSave[currentFieldEdit.fieldId] = 0;
        summaryFieldsTmp.splice(idx, 1);
        setSummaryFields(summaryFieldsTmp);
      }
    }
  };

  const destroySaveField = () => {
    setIsSaveField(false);
  }

  const onSaveField = (fields, paramsEditField, fieldInfoEdit) => {
    setCurrentFieldEdit(null);
    let deleteField = [];
    let listField = _.cloneDeep(fields);
    const resultProcess = processRelationselectOrganization(listField, paramsEditField, deleteField);
    listField = resultProcess.listField;
    deleteField = resultProcess.deleteField;
    const newParamsEditField = resultProcess.newParamsEditField;
    listField = putDataToFieldEdit(listField, newParamsEditField, fieldInfoEdit);

    listField.forEach((field, index) => {
      if (_.toString(field.fieldType) === DEFINE_FIELD_TYPE.LOOKUP) {
        const newLookup = createNewFieldLookup(listField, field, deleteField);
        listField = newLookup.listField;
        deleteField = newLookup.deleteField;
      }
      if (field.fieldId === fieldInfoEdit.fieldId) {
        if (field.availableFlag === AVAILABLE_FLAG.UNAVAILABLE) {
          const idx = productFieldUnavailable.findIndex(e => e.fieldId === field.fieldId)
          if (idx < 0) {
            productFieldUnavailable.push(field);
          } else {
            productFieldUnavailable[idx] = field;
          }
          displayToastMessage('WAR_COM_0010', MessageType.Warning, 'block-feedback block-feedback-yellow text-left');
          listField.splice(index, 1);
        } else if (field.availableFlag > AVAILABLE_FLAG.UNAVAILABLE) {
          if (listField.findIndex(e => e.fieldId === field.fieldId) < 0) {
            listField.push(field);
          }
          if (editedSummaryFields.findIndex(e => e === field.fieldId) < 0) {
            editedSummaryFields.push(field.fieldId);
            setEditedSummaryFields(_.cloneDeep(editedSummaryFields));
          }
          const idxUnAvailable = productFieldUnavailable.findIndex(e => e.fieldId === field.fieldId);
          if (idxUnAvailable >= 0) {
            productFieldUnavailable.splice(idxUnAvailable, 1);
          }
        }
      }
    });

    for (let i = 0; i < listField.length; i++) {
      listField[i].fieldOrder = i + 1;
    }
    const ret = { listField: null, deleteFields: null };

    setFieldRelationTab(listField.filter(e => isFieldRelationAsTab(e)))

    ret.listField = listField;
    ret.deleteFields = deleteField;
    setFieldCallback(_.cloneDeep(ret));
    return ret;
  };

  /* _________________Tab producHistory_________________ */
  const handleScroll = (e) => {
    const element = e.target;
    if (currentTab === TAB_ID_LIST.productHistory && 
        props.productChangeHistory && 
        props.productChangeHistory.length % 30 === 0 && 
        element.scrollHeight - element.scrollTop === element.clientHeight
    ) {
      props.handleInitProductChangeHistory(currentProduct, currentPage + 1, 30);
      setCurrentPage(currentPage + 1);
    }
  }


  /* _________________Edit mode_________________ */
  const deleteFieldUnAvailable = fieldInfo => {
    const fieldsUnAvailable = _.cloneDeep(productFieldUnavailable);
    const index = fieldsUnAvailable.findIndex(e => e.fieldId === fieldInfo.fieldId)
    if (index >= 0) {
      fieldsUnAvailable.splice(index, 1);
      deletedSummaryFields.push(fieldInfo.fieldId);
      setProductFieldUnavailable(fieldsUnAvailable);
    }
  }
  
  const handleClosePopupModeEdit = () => {
    executeDirtyCheck(() => {
      cleanModeEdit();
    });
  }

  const handleChangeScreenMode = () => {
    setTimeout(() => {
      props.changeScreenMode(true)
    }, 350);
  }

  const onShowMessage = (message, type) => { 
    if (type === TypeMessage.downloadFileError) {
      setMessageDownloadFileError(message);
    } else if (type === TypeMessage.deleteWarning) {
      displayToastMessage("WAR_COM_0013", MessageType.Warning, 'block-feedback block-feedback-yellow text-left')
    }
    setTimeout(() => {
      setMessageDownloadFileError(null);
    }, TIMEOUT_TOAST_MESSAGE);
  };

  const updateCustomFieldInfo = () => {
    if (tabListUpdate !== null) {
      tabListUpdate.map((item) => {
        delete item.tabLabel;
        delete item.fieldOrder;
      })
    }
    const summaryFieldsTmp = _.cloneDeep(summaryFields);
    const fieldsUpdate = [];
    if(!_.isNil(summaryFields)) {
      productFieldUnavailable.forEach(field => {
        const index = summaryFields.findIndex(e => e.fieldId === field.fieldId);
        if (index < 0) {
          summaryFieldsTmp.push(field);
        }
      });
    }
    const deleteSummaryFieldTmp = _.cloneDeep(deletedSummaryFields);
    deleteFieldUnavailable.forEach(field => {
      const index = deletedSummaryFields.findIndex(e => e.fieldId !== field.fieldId);
      if (index < 0) {
        deleteSummaryFieldTmp.push(field);
      }
    });

    if (summaryFieldsTmp !== null) {
      summaryFieldsTmp.map(item => {
        const field = _.cloneDeep(item);
        delete field.fieldBelong;
        delete field.createdDate;
        delete field.createdUser;
        delete field.updatedUser;
        if (!_.isNil(field.oldField)) {
          delete field.oldField;
        }
        if (_.toString(field.fieldType) === DEFINE_FIELD_TYPE.RELATION && !_.isNil(field.relationField)) {
          if (!_.isNil(field.relationField.isMultiToSingle)) {
            delete field.relationField.isMultiToSingle;
          }
          const relationField = _.cloneDeep(field.relationField);
          delete field.relationField;
          fieldsUpdate.push(field);
          relationField.fieldLabel =
            !_.isNil(relationField) && _.isString(relationField.fieldLabel)
              ? relationField.fieldLabel
              : JSON.stringify(relationField.fieldLabel);
          delete relationField.createdDate;
          delete relationField.createdUser;
          delete relationField.updatedUser;
          fieldsUpdate.push(relationField);
        } else {
          fieldsUpdate.push(field);
        }
      });
    }
    const fieldProductTradingTab = [];
    tabProductTradingFields.forEach(field => {
      fieldProductTradingTab.push({
        fieldId: field.fieldId,
        fieldOrder: field.fieldOrder,
        tabId: TAB_ID_LIST.productTrading,
        fieldInfoTabId: field.fieldInfoTabId
      });
    });
    props.handleUpdateCustomFieldInfo(FIELD_BELONG.PRODUCT, deleteSummaryFieldTmp, fieldsUpdate, tabListUpdate, [...deleteTabProductTradingFields], [...fieldProductTradingTab]);
    props.changeScreenMode(false);
  }

  const isChangeSettingField = (isChange: boolean) => {
    isChangeField = isChange;
    return isChange;
  }

  const onExecuteAction = (fieldInfo, actionType, params) => {
    switch (actionType) {
      case DynamicControlAction.SAVE: {
        countSave[fieldInfo.fieldId] = countSave[fieldInfo.fieldId] + 1;
        if (fieldInfo.availableFlag > AVAILABLE_FLAG.UNAVAILABLE) {
          setIsSaveField(true);
        } else {
          const listFieldTmp = summaryFields ? _.cloneDeep(summaryFields) : concatArray(props.product.fieldInfo.filter(e => e.availableFlag > 0), productFieldUnavailable, fieldInfo);
          if (summaryFields) {
            props.product.fieldInfo.forEach((field) => {
              const index = summaryFields.findIndex(e => e.fieldId === field.fieldId)
              if (index < 0 && field.fieldId === params.fieldId) {
                listFieldTmp.push(field)
              }
            })
          }

          const saveFieldResult = onSaveField(listFieldTmp, params, fieldInfo);
          setSummaryFields(saveFieldResult.listField);
          const arrFieldDel = _.cloneDeep(deleteFieldUnavailable)
          if (saveFieldResult.deleteFields.length > 0) {
            arrFieldDel.push(...saveFieldResult.deleteFields)
          }
          setDeleteFieldUnavailable(saveFieldResult.deleteFields);
        }
        setFieldEdit(fieldInfo);
        setParamsEdit(params);
        if (isEditAvailableField) {
          setPopupSettingMode(SettingModes.AddNotAvailabelInput);
          setIsEditAvailableField(false);
        } else setPopupSettingMode(SettingModes.CreateNewInput);
        break;
      }
      case DynamicControlAction.CANCEL: {
        const summaryFieldsTmp = _.cloneDeep(summaryFields);
        if (summaryFieldsTmp) {
          const idx = summaryFieldsTmp.findIndex(e => e.fieldId === fieldInfo.fieldId);
          if (fieldInfo.fieldId < 0 && (_.isNil(countSave[fieldInfo.fieldId]) || countSave[fieldInfo.fieldId] === 0) && !fieldInfo.copyField) {
            if (idx >= 0) {
              summaryFieldsTmp.splice(idx, 1);
              countSave[fieldInfo.fieldId] = 0;
              setCurrentFieldEdit(null)
            }
          } else if (fieldInfo.fieldId > 0 && fieldInfo.availableFlag === 0) {
            const idx2 = productFieldUnavailable.findIndex(e => e.fieldId === fieldInfo.fieldId);
            if (idx >= 0) {
              summaryFieldsTmp.splice(idx, 1);
            }
            if (idx2 < 0) {
              productFieldUnavailable.push(fieldInfo);
            }
            setCurrentFieldEdit(null)
          }
        }
        if (!_.isNil(summaryFields)) {
          setSummaryFields(summaryFieldsTmp);
        }
        if (isEditAvailableField) {
          setPopupSettingMode(SettingModes.AddNotAvailabelInput);
          setIsEditAvailableField(false);
        } else setPopupSettingMode(SettingModes.CreateNewInput);
        break;
      }
      case DynamicControlAction.DELETE: {
        deleteFieldUnAvailable(fieldInfo);
        if (fieldInfo) {
          setIsDelete(true);
        }
        break;
      }
      case DynamicControlAction.EDIT:
        if (!_.isNil(fieldInfo.fieldId)) {
          setIsEditAvailableField(true);
        }
        openDynamicSelectFields(SettingModes.EditInput, fieldInfo);
        if (fieldInfo.fieldId === null) {
          tabSummaryRef.current.onAddNewField(fieldInfo);
        }
        break;
      default:
        break;
    }
  };

  /* _________________Lifecycle_________________ */
  useEffect(() => {
    if (summaryFieldRevert && summaryFields && productFieldUnavailable) {
      setSummaryFieldRevert(initialRevertFields(summaryFields, productFieldUnavailable, summaryFieldRevert));
    }
  }, [summaryFields, productFieldUnavailable])

  useEffect(() => {
    if (props.product) {
      setSummaryFieldRevert(props.product.fieldInfo)
    }
  }, [props.product])

  useEffect(() => {
    return () => {
      props.resetState(); 
      if (props.resetSuccessMessage) {
        props.resetSuccessMessage();
      }
    };
  }, [currentProduct]);

  useEffect(() => {
    if (ProductAction.Success === props.action && props.checkDeleteProduct) {
      const productId = currentProduct ? currentProduct : props.popoutParams.productId
      if (props.checkDeleteProduct.productListConfirmLists && props.checkDeleteProduct.productListConfirmLists.length === 0) {
        deleteByIcon(productId);
      } else if (props.checkDeleteProduct.productListConfirmLists && props.checkDeleteProduct.productListConfirmLists.length > 0) {
        confirmDeleteProductsInSet(props.checkDeleteProduct, productId);
      }
    }
  }, [props.checkDeleteProduct]);

  useEffect(() => {
    if (ProductAction.Success === props.action && props.deleteProducts) {
      if (props.popout) {
        window.close();
        setForceCloseWindow(true);
      } else{
        currentProduct === props.listProductId[props.listProductId.length - 1] ? handleClosePopup() : onNextProduct();
      }
      props.resetState();
    }
  }, [props.deleteProducts]);

  useEffect(() => {
    if (screenMoveInfo && screenMoveInfo.screenType === SCREEN_TYPES.DETAIL) {
      if (currentProduct !== screenMoveInfo.objectId) setCurrentProduct(screenMoveInfo.objectId);
      if (currentTab !== TAB_ID_LIST.summary) setCurrentTab(TAB_ID_LIST.summary);
      handleInitData(screenMoveInfo.objectId, TAB_ID_LIST.summary);
      props.moveScreenReset();
    }
  }, [screenMoveInfo])

  useEffect(() => {
    setCurrentProduct(props.productId ? props.productId : Number(props.popoutParams.productId));
    // props.getProductTrading(props.productId)
    if (props.popout) {
      updateStateSession(FSActionTypeScreen.GetSession);
      setShowModal(false);
      setForceCloseWindow(false);
    } else {
      setShowModal(true);
    }
    return () => {
      updateStateSession(FSActionTypeScreen.RemoveSession);
    }
  }, []);

  useEffect(() => {
    if (forceCloseWindow) {
      if (props.popout) {
        window.opener.postMessage({ type: FSActionTypeScreen.CloseWindow, 'forceCloseWindow': true }, window.location.origin);
        Storage.session.set('forceCloseWindow', true);
        window.close();
      } else {
        handleClosePopup();
      }
    }
  }, [forceCloseWindow]);

  useEffect(() => {
    if (props.product) {
      setProductFieldUnavailable(_.cloneDeep(props.productFieldsUnVailable));
      props.product.fieldInfo.forEach((item) => {
        if (_.isNil(item.salesProcess)) {
          Object.assign(item, { salesProcess: null });
        }
      })
      if (!isLoadProduct && _.toArray(props.product.fieldInfo).length > 0) {
        setFieldRelationTab(props.product.fieldInfo.filter(e => isFieldRelationAsTab(e)))
        setIsLoadProduct(true);
      }
    }
  }, [props.product])

  useEffect(() => {
    setTabListShow(props.product ? props.tabListShow : []);
    setTabList(props.product ? props.product.tabInfo : []);
  }, [props.product, props.tabListShow])

  useEffect(() => {
    handleInitData(currentProduct, currentTab);
    return () => {
      setShowConditionDisplay(PopupConditionDisplay.None);
    }
  }, [currentProduct, currentTab]);

  useEffect(() => {
    if (props.messageUpdateCustomFieldInfoSuccess && props.action === ProductAction.UpdateSuccess) {
      Object.keys(loadTab).forEach((item) => {
        loadTab[item] = false;
      })
      handleInitData(currentProduct, currentTab);
      setSummaryFields(null);
      props.changeScreenMode(false);
      setFieldCallback(null);
      setIsUpdateField(true)
    }
  }, [props.messageUpdateCustomFieldInfoSuccess, props.action])

  useEffect(() => {
    displayToastMessage(props.messageUpdateCustomFieldInfoSuccess, MessageType.Success, CLASS_CUSTOM);
  }, [props.messageUpdateCustomFieldInfoSuccess]);

  useEffect(() => {
    displayNormalMessage(props.messageUpdateCustomFieldInfoError, MessageType.Error);
    if (props.messageUpdateCustomFieldInfoError) {
      const resultRevert = revertDeletedFields(deletedSummaryFields, summaryFields, productFieldUnavailable, summaryFieldRevert);
      setSummaryFields(_.cloneDeep(resultRevert.fieldsAvailable));
      setProductFieldUnavailable(_.cloneDeep(resultRevert.fieldsUnVailable))
      setDeletedSummaryFields(resultRevert.deletedFields)
      setSummaryFieldRevert(resultRevert.fieldsRevert)
    }
  }, [props.messageUpdateCustomFieldInfoError]);

  useEffect(() => {
    displayToastMessage(props.msgSuccess, MessageType.Success, CLASS_CUSTOM);
  }, [props.msgSuccess]);

  useEffect(() => {
    displayNormalMessage(props.errorItems, MessageType.Error);
  }, [props.errorItems]); 

  useEffect(() => {
    displayToastMessage(props.productMessageMutation, MessageType.Success, CLASS_CUSTOM);
  }, [props.productMessageMutation])
  
  // useEffect(() => {
  //   if (productTradings && productTradings.fields && productTradings.fieldInfoTab) {
  //     setFieldInfoTab(productTradings.fieldInfoTab)
  //     setFieldsTab(productTradings.fields)
  //   }
  // }, [productTradings])

  /* _________________Render_________________ */
  const checkRelationAsTab = Object.keys(TAB_ID_LIST).findIndex(e => TAB_ID_LIST[e] === currentTab);

  useEffect(() => {
    if (props.fieldInfosTabTrading) {
      setTabProductTradingFields(props.fieldInfosTabTrading);
    }
  }, [props.fieldInfosTabTrading]);

  const selectFieldTab = (listField, idTab) => {
    if (idTab === TAB_ID_LIST.productTrading ){
        setTabProductTradingFields(listField);
    }
  }

  const deleteFieldTab = (fieldId, idTab) => {
    if (idTab === TAB_ID_LIST.productTrading ){
      console.log("fieldInfosTabTrading", props.fieldInfosTabTrading);
      const fieldTab = props.fieldInfosTabTrading.find(item => item.fieldId === fieldId)
     if(fieldTab){
      setDeleteTabProductTradingFields([...deleteTabProductTradingFields, fieldTab.fieldInfoTabId]);
     }
    }
  }

  const renderDynamicSelectFields = () => {
    if (currentTab === TAB_ID_LIST.summary || checkRelationAsTab < 0) {
      const listField = _.concat(summaryFields ? summaryFields : [], productFieldUnavailable);
      return (
        <DynamicSelectField
          onChangeSettingField={isChangeSettingField}
          fieldsUnVailable={productFieldUnavailable}
          currentSettingMode={popupSettingMode}
          fieldInfos={currentFieldEdit}
          fieldNameExtension={"product_data"}
          listFieldInfo={listField}
          onExecuteAction={currentTab === TAB_ID_LIST.summary ? onExecuteAction : undefined}
          fieldBelong={FIELD_BELONG.PRODUCT}
          getFieldsCallBack={!_.isEmpty(fieldCallback) ? fieldCallback : { listField: props.product.fieldInfo, deleteFields: null }}
        />
      )
    } else if (currentTab === TAB_ID_LIST.productTrading) {
      return  <DynamicSelectFieldTab
      listFieldInfo={tabProductTradingFields}
      tabType={currentTab}
      selectFieldTab={selectFieldTab}
      deleteFieldTab={deleteFieldTab}
    />
    }
  }

  const renderMessage = () => {
    if (normalMessage === null) {
      if (messageDownloadFileError) {
        return <BoxMessage messageType={normalMessage.type} message={messageDownloadFileError} />;
      }
    } else {
      return (
        <>
          {normalMessage.message.map((messsageParams, idx) => {
            return <BoxMessage key={idx} messageType={normalMessage.type} message={getErrorMessage(messsageParams)}/>;
          })}
        </>
      );
    }
  };

  const renderToastMessage = () => {
    if (toastMessage !== null) {
      return (
        <>
         <div className="message-area message-area-bottom position-absolute">
          {toastMessage.message.map((messsageParams, idx) => {
            return <BoxMessage key={idx} messageType={toastMessage.type} message={props.msgSuccess ? props.msgSuccess : getErrorMessage(messsageParams)} styleClassMessage={toastMessage.styleClass} className=' '/>;
          })}
          </div>
        </>
      );
    }
  }

	const renderActionTab = () => {
    if (tabListShow !== null && tabList !== null && tabListShow.length < tabList.length && props.screenMode === ScreenMode.EDIT) {
      return(
        <div className="add-tab-wrap active" ref={actionTabRef}>
          <div className="add-tab" onClick={() => setIsOpenMenuAddTab(!isOpenMenuAddTab)}></div>
          {isOpenMenuAddTab && tabListShow && tabListShow.length < tabList.length &&
            <div className="box-select-option">
              <ul>
                {tabList.map((tab, idx) => {
                  let tabHidden = true;
                  tabListShow.forEach((tabShow) => {
                    if (tab.tabId === tabShow.tabId) {
                      tabHidden = false;
                    }
                  })
                  if (tabHidden === true) {
                    return (
                      <>
                        <li><a key={idx} onClick={(tabId) => addTab(tab.tabId)} >{getFieldLabel(tab, 'tabLabel')}</a></li>
                      </>
                    )
                  }
                })}
              </ul>
            </div>
          }
        </div>
      )
    } else {
      return <></>
    }
  }

  const renderPopupCreateEditProduct = () => {
    const fieldPreview =  handleFieldPreview(fieldCallback);

    return (
      openPopupEdit &&
        <ModalCreateEditProduct
          iconFunction="ic-sidebar-product.svg"
          productActionType={actionTypePopup}
          productViewMode={productViewMode}
          productId={currentProduct}
          isContainDataSummary={true}
          isOnlyData={false}
          onCloseFieldsEdit={onClosePopupEdit}
          showModal={isShowModal}
          fieldPreview={fieldPreview}
        />
    )
  }

  const renderPopupEmployeeDetail = () => {
    if(openPopupEmployeeDetail){
      document.body.classList.remove('wrap-product');
      document.body.classList.add('wrap-employee');
    }
    return (
      openPopupEmployeeDetail &&
      <PopupEmployeeDetail
        id={employeeDetailCtrlId[0]}
        showModal={true}
        backdrop={false}
        openFromModal={true}
        employeeId={employeeId}
        listEmployeeId={[employeeId]}
        toggleClosePopupEmployeeDetail={onClosePopupEmployeeDetail}
        resetSuccessMessage={() => { }} />
    )
  }

  const renderTabContents = () => {
    calculateHeightTable();
    return (
      <>
        {
          props.product && props.product.tabInfo && currentTab === TAB_ID_LIST.summary &&
            <TabSummary
              ref={tabSummaryRef}
              product={handleDataAvailable(props.product, 'fieldInfo')}
              productAllFields={props.product ? props.product.fieldInfo : []}
              screenMode={props.screenMode}
              handleReorderField={props.handleReorderField}
              editedFields={editedSummaryFields}
              onChangeFields={onChangeSummaryFields}
              openDynamicSelectFields={openDynamicSelectFields}
              tabList={tabList}
              destroySaveField={destroySaveField}
              summaryFields={summaryFields}
              isSaveField={isSaveField}
              fieldEdit={fieldEdit}
              paramsEdit={paramsEdit}
              onSaveField={onSaveField}
              onShowMessage={onShowMessage}
              openModalEmployeeDetail={onOpenModalEmployeeDetail}
              openProductDetailFromOther={props.openProductDetailFromOther}
              productId={props.productId}
              countSave={countSave}
              tradingProducts={props.productTradings}
              tradingProductsFields={props.customFieldInfosProductTrading}
              onSelectDislaySummary={onSelectDislaySummary}
              deletedFields={deletedSummaryFields}
              edittingField={currentFieldEdit}
              fieldsUnavailable={productFieldUnavailable}
            />
        }
        {
          
          <div className={ currentTab === TAB_ID_LIST.productTrading ? "custom-list-trading" : "d-none custom-list-trading"}>
            <DetailTabProductTrading
              productId={currentProduct}
              customer={null}
              // customerChild={customerChild}
              fieldInfo={tabProductTradingFields}
              // searchScope={scopeCondition}
              // searchRange={rangeCondition}
              />
          </div>
        }
        {
          props.productChangeHistory && currentTab === TAB_ID_LIST.productHistory &&
          <TabChangeHistory
          changeHistory={props.productChangeHistory}
          fieldInfo={props.product.fieldInfo}
          fieldNameExtension={'product_data'}
          openModalEmployeeDetail={onOpenModalEmployeeDetail}
          sourceData={{
            productCategories: props.product.productCategories ||[], 
            productTypes: props.product.productTypes ||[],
          }}
        />
        }
        {renderPopupCreateEditProduct()}
        {renderPopupEmployeeDetail()}
        <RelationDisplayTab
          id="productRelationId"
          recordData={props.product ? props.product.product : null}
          fieldNameExtension="productData"
          isHeader={false}
          listFieldInfo={fieldRelationTab}
          currentTabId={currentTab}
        />
      </>
    );
  };

  const renderComponent = () => {
    return (
      <div className="modal-open">
        <div
          className="modal popup-esr popup-task popup-modal-common show">
          <div className="modal-dialog form-popup m-0">
            <div className="modal-content">
              <div className="modal-header">
                <div className="left">
                  <div className="popup-button-back">
                    <a className={"icon-small-primary icon-return-small" + (props.openFromModal ? "" : " disable")} onClick={onClickBack} />
                    <span className="text">
                      <img className="icon-group-user" src="../../content/images/ic-product.svg" alt="" />{props.product ? props.product.product.productName : ''}
                    </span>
                  </div>
                </div>
                <div className="right">
                  <a className="icon-small-primary icon-share" onClick={(url) => copyUrlProduct(window.location.href)} />
                  {showModal && <a className="icon-small-primary icon-link-small" onClick={() => openNewWindow()} />}
                  {showModal && <a className="icon-small-primary icon-close-up-small line" onClick={handleClosePopup} />}
                </div>
              </div>

              <div className="modal-body style-3">
                <div className="popup-content style-3 v2 p-0">
									<div className="popup-tool popup-tool-v2">
										<div className="message-area">
                      {renderMessage()}
										</div>
                    {props.screenMode === ScreenMode.EDIT &&  currentTab === TAB_ID_LIST.summary  && <a className="button-primary button-activity-registration content-left custom-btn-preview" onClick={() => { toggleOpenPopupEdit(PRODUCT_VIEW_MODES.PREVIEW, PRODUCT_ACTION_TYPES.CREATE, true)}} >{translate('products.detail.label.button.preview')}</a>}
										<div className="toolbox">
                      {props.screenMode === ScreenMode.DISPLAY &&
                        <>
                          {isAdmin && 
                            <>
                              <a className="icon-small-primary icon-edit-small" onClick={() => toggleOpenPopupEdit(PRODUCT_VIEW_MODES.EDITABLE, PRODUCT_ACTION_TYPES.UPDATE, false)} />
                              <a className="icon-small-primary icon-erase-small" onClick={checkDeleteProductByIcon} />
                              <a className="button-primary button-add-new" onClick={handleChangeScreenMode}>{translate('products.detail.label.button.edit')}</a>
                            </>
                          }
                          <a 
                            className={"icon-small-primary icon-prev" + (props.listProductId && props.isList && currentProduct !== props.listProductId[0] ? "" : " disable pointer-none")}
                            onClick={onPrevProduct} />
                          <a 
                            className={"icon-small-primary icon-next" + (props.listProductId && props.isList && currentProduct !== props.listProductId[props.listProductId.length - 1] ? "" : " disable pointer-none")}
                            onClick={onNextProduct} />
                        </>
                      }
                      {props.screenMode === ScreenMode.EDIT &&
                        <>
                          <a onClick={handleClosePopupModeEdit} className="button-cancel">{translate('products.detail.label.button.cancel')}</a>
                          {_.isEqual(popupSettingMode, SettingModes.EditInput) ? 
                              <a className="button-blue disable">{translate('products.detail.label.button.save')}</a> : 
                              <a onClick={updateCustomFieldInfo} className="button-blue">{translate('products.detail.label.button.save')}</a>
                          }
                        </>
                      }
										</div>
									</div>
									<div className="popup-content-common-wrap" id={formId} >
										<div className={props.screenMode === ScreenMode.EDIT ? 'popup-content-common-left scrollarea overflow-y-hover' : 'popup-content p-4 w-100 scrollarea overflow-y-hover'} onScroll={handleScroll}>
                     
                      <div className={`product-detail mb-4 style-1 ${props.screenMode === ScreenMode.EDIT ? "pl-4 pt-4" : ""}`}>
                        <img src={props.product ? (props.product.product.productImagePath  ? props.product.product.productImagePath : '../../content/images/noimage.png') : "" } alt="" className="product-detail-img" />
                        <div className="content">
                          <p>{props.product?.product ? getFieldLabel(props.product.product, "productCategoryName") : ''}</p>
                          <p className="name">{props.product?.product?.productName || ''}</p>
                          <p className="price">{props.product && props.product.product && props.product.product.unitPrice ? (props.product.product.unitPrice.toLocaleString(navigator.language, { minimumFractionDigits: 0 })) : 0}{getCurrencyUnit('unitPrice', props.product?.fieldInfo)}</p>
                        </div>
                      </div>

											<div className={`"popup-content-common-content" ${props.screenMode === ScreenMode.EDIT ? "pl-4" : ""}`}>
												<div className="tab-detault">
                          <Sticky scrollElement=".scrollarea" stickyStyle={{zIndex: '5'}}>         
                            <ul className="nav nav-tabs background-color-88">
                              {tabListShow &&
                              <TabList
                                onChangeTab={changeTab}
                                tabList={tabList}
                                tabListShow={tabListShow}
                                onDragDropTabList={onDragDropTabList}
                                deleteAddTab={onDelAddTab}
                                currentTab={currentTab}
                                screenMode={props.screenMode}
                              />}
                              <RelationDisplayTab
                                id="productRelationId"
                                isHeader={true}
                                listFieldInfo={fieldRelationTab}
                                currentTabId={currentTab}
                                onChangeTab={changeTab}
                              />
                              {renderActionTab()}
                           </ul>
                          </Sticky>
                 
													<div className="tab-content mt-4 style-3" style={{height:heightTable }} ref={tableListRef} > 
                            {renderTabContents()}
													</div>
												</div>
											</div>
										</div>
										{props.screenMode === ScreenMode.EDIT && renderDynamicSelectFields()}
									</div>
                  {renderToastMessage()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showModal) {
    return (
      <>
        <Modal isOpen={true} fade={true} toggle={() => { }} backdrop={(props.backdrop || props.backdrop === undefined)} id="product-detail" autoFocus={true} zIndex="auto">
          {renderComponent()}
        </Modal>
      </>
    );
  } else {
    if (props.popout) {
      document.body.className = 'body-full-width wrap-product modal-open';
      return (
        <>
          {renderComponent()}
          {(document.body.className = document.body.className.replace('modal-open', ''))}
        </>
      );
    } else {
      return <></>;
    }
  }
}

const mapStateToProps = ({ productDetail, authentication, applicationProfile, screenMoveState, productList, dynamicList , popupDetailTab}: IRootState) => ({
  tenant: applicationProfile.tenant,
  authorities: authentication.account.authorities,
  product: productDetail.product,
  // productTradings: productDetail.productTradings,
  productChangeHistory: productDetail.productChangeHistory,
  productFieldsUnVailable: productDetail.productFieldsUnVailable,
  errorItems: productDetail.errorItems,
  screenMode: productDetail.screenMode,
  tabListShow: productDetail.tabListShow,
  checkDeleteProduct: productDetail.checkDeleteProduct,
  deleteProducts: productList.deleteProducts,
  action: productDetail.action,
  screenMoveInfo: screenMoveState.screenMoveInfo,
  messageUpdateCustomFieldInfoSuccess: productDetail.messageUpdateCustomFieldInfoSuccess,
  messageUpdateCustomFieldInfoError: productDetail.messageUpdateCustomFieldInfoError,
  msgSuccess: productList.msgSuccess, 
  listProductId: productList.listProductId,
  // fieldInfosTabTrading: dynamicList.data.has("DetailTabProductTrading") ? dynamicList.data.get("DetailTabProductTrading").fieldInfos.fieldInfoPersonals : {},
  fieldInfosTabTrading: dynamicList?.data?.get(`${CUSTOMER_GET_FIELD_TAB}${FIELD_BELONG.PRODUCT_TRADING}`)?.fieldInfos?.fieldInfoPersonals,
  productTradings: popupDetailTab.tabProductTradings,
  customFieldInfosProductTrading : productDetail.customFieldInfoProductTrading
});

const mapDispatchToProps = {
  handleInitProductDetail,
  handleInitProductChangeHistory,
  handleCheckDeleteProduct,
  handleDeleteProducts,
  resetState,
  handleReorderField,
  changeScreenMode,
  moveScreenReset,
  handleUpdateCustomFieldInfo,
  getFieldInfoPersonals,
  // getProductTrading
  getCustomFieldsInfoProductTrading
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductDetail);
