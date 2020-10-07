import _, { concat } from 'lodash';
import * as R from 'ramda';
import { useId } from "react-id-generator";
import React, { useState, useEffect, useRef, useMemo } from 'react';
import ConfirmDialog from 'app/shared/layout/dialog/confirm-dialog';
import ConfirmDialogCustom from '../control/popup/dialog-custom/confirm-dialog';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import { ScreenMode, FIELD_BELONG, SCREEN_TYPES, TIMEOUT_TOAST_MESSAGE } from 'app/config/constants';
import { TAB_ID_LIST_SET, PREFIX_PRODUCT_SET_DETAIL, CLASS_CUSTOM, PRODUCT_ACTION_TYPES, PRODUCT_VIEW_MODES, EVENT_MESSAGES_POPOUT, TypeMessage, TAB_ID_LIST } from 'app/modules/products/constants';
import { hasAnyAuthority } from 'app/shared/auth/private-route';
import { AUTHORITIES } from 'app/config/constants';
import { Modal } from 'reactstrap';
import { isJsonString, handleFieldPreview, handleDataAvailable, getCurrencyUnit } from 'app/modules/products/utils';
import { Storage, translate } from 'react-jhipster';
import { DynamicControlAction, DEFINE_FIELD_TYPE, FieldInfoType } from 'app/shared/layout/dynamic-form/constants';

import TabList from './popup-product-set-detail-tab-list';
import TabSummary from './popup-detail-tabs/popup-product-set-detail-tab-summary';
import TabChangeHistory, { SpecialHistory } from 'app/shared/layout/common/history/display-history';
import BoxMessage, { MessageType } from '../../../shared/layout/common/box-message';
import DialogDirtyCheck from 'app/shared/layout/common/dialog-dirty-check';
import PopupProductSet from 'app/modules/products/popup/popup-product-set';
import DynamicSelectField from 'app/shared/layout/dynamic-form/control-field/dynamic-select-field';
import PopupEmployeeDetail from '../../employees/popup-detail/popup-employee-detail';
import { moveScreenReset } from 'app/shared/reducers/screen-move.reducer';
import StringUtils, { getFieldLabel } from 'app/shared/util/string-utils';
import RelationDisplayTab from 'app/shared/layout/dynamic-form/control-field/view/relation-display-tab';
import useEventListener from 'app/shared/util/use-event-listener';
import { useDetectFormChange } from 'app/shared/util/useDetectFormChange';
import { isNullOrUndefined } from 'util';
import { handleDeleteProducts } from '../list/product-list.reducer';
import { processRelationselectOrganization, putDataToFieldEdit, isFieldRelationAsTab, createNewFieldLookup, revertDeletedFields, initialRevertFields, concatArray } from 'app/shared/util/utils';

import {
  handleReorderField,
  handleInitTradingProducts,
  handleInitProductSetHistory,
  handleInitGetProductSet,
  handleInitUpdateCustomFieldsInfo,
  handleCheckDeleteProduct,
  reset,
  changeScreenMode,
  ProductAction,
  getCustomFieldsInfoProductTrading
} from './popup-product-set-detail-reducer';
import Sticky from 'react-sticky-el';
import { CUSTOMER_GET_FIELD_TAB } from 'app/modules/customers/constants';
import DetailTabProductTrading from 'app/shared/layout/popup-detail-service-tabs/popup-detail-tab-product-trading';
import DynamicSelectFieldTab from 'app/shared/layout/dynamic-form/control-field/dynamic-select-field-tab';
import { getFieldInfoPersonals } from 'app/shared/layout/dynamic-form/list/dynamic-list.reducer';


export enum SettingModes {
  CreateNewInput,
  AddNotAvailabelInput,
  EditInput
}

export const AVAILABLE_FLAG = {
  UNAVAILABLE: 0,
  WEB_APP_AVAILABLE: 3
};

export interface IPopupProductSetDetailProps extends StateProps, DispatchProps {
  showModal: boolean;
  backdrop?: boolean; // [backdrop:false] when open from popup
  popout?: boolean;
  productId: any;
  toggleSwitchEditMode?: (isEdit: boolean) => void;
  toggleClosePopupProductSetDetail?: (isBack?, isUpdateField?) => void;
  toggleOpenPopupSetEdit?: (currentProductSetDetail) => void;
  summaryFields?: any;
  onChangeFields?: (value) => void;
  popoutParams?: any;
  isList?: boolean;
  listProductId: any;
  reloadScreen?: () => void;
  productSetCreatedSuccessMsg?: any;
  resetSuccessMessage?: () => void;
  openProductDetailFromOther?: (id, isProductSet) => void;
  onPageChangeInDetailScreen?: (isNext:boolean) => void
}

export enum FSActionTypeScreen {
  None,
  RemoveSession,
  SetSession,
  GetSession,
  CloseWindow,
  Search
}

export enum PopupConditionDisplay {
  None,
  ModalDialog,
  Window
}

const PopupProductSetDetail = (props: IPopupProductSetDetailProps) => {
  const [, setFirst] = useState(false);
  const [, setShouldRender] = useState(false);
  const [tabList, setTabList] = useState(props.productSet ? props.productSet.tabInfo : []);
  const [tabListShow, setTabListShow] = useState(props.productSet && props.productSet.tabInfo.filter(e => e.isDisplay));
  const [tabListUpdate, setTabListUpdate] = useState(null);
  const [currentTab, setCurrentTab] = useState(TAB_ID_LIST_SET.summary);
  const [currentProductSetDetail, setCurrentProductSetDetail] = useState(props.productId ? props.productId : props.popoutParams.productId);
  const [summaryFields, setSummaryFields] = useState([]);
  const [showModal, setShowModal] = useState(null);
  const [tradingProductsFields, setTradingProductsFields] = useState(null);
  const [changeHistory, setChangeHistory] = useState(null);
  const [forceCloseWindow, setForceCloseWindow] = useState(false);

  const [, setShowConditionDisplay] = useState(PopupConditionDisplay.None);
  const [currentPage, setCurrentPage] = useState(1);
  const [openPopupEditProductSet, setOpenPopupEditProductSet] = useState(false);
  const [heightTable, setHeightTable] = useState(0);

  /* edit mode */
  const [popupSettingMode, setPopupSettingMode] = useState(SettingModes.CreateNewInput);
  const [currentFieldEdit, setCurrentFieldEdit] = useState(null);
  const [deletedSummaryFields, setDeletedSummaryFields] = useState([]);
  const [isSaveField, setIsSaveField] = useState(false);
  const [fieldEdit, setFieldEdit] = useState();
  const [paramsEdit, setParamsEdit] = useState();
  const [countSave] = useState({});
  const [productFieldUnavailable, setProductFieldUnavailable] = useState([]);
  const [deleteFieldUnavailable, setDeleteFieldUnavailable] = useState([]);
  const [messageDownloadFileError, setMessageDownloadFileError] = useState(null);
  const [productSetViewMode , setProductSetViewMode] = useState(PRODUCT_VIEW_MODES.EDITABLE)
  const [, setIsDelete] = useState(false);
  const [, setActionTypePopup ] = useState()
  const [, setIsShowModal] = useState()
  /* end edit mode */

  const tabSummaryRef = useRef(null);
  const actionTabRef = useRef(null);
  const [fieldCallback, setFieldCallback] = useState({});
  const [isEditAvailableField, setIsEditAvailableField] = useState(false);
  const [editedSummaryFields, setEditedSummaryFields] = useState([]);
  const [isLoadProduct, setIsLoadProduct] = useState(false);
  const [isOpenMenuAddTab, setIsOpenMenuAddTab] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [fieldRelationTab, setFieldRelationTab] = useState([]);
  const [normalMessage, setNormalMessage] = useState(null);
  const [summaryFieldRevert, setSummaryFieldRevert] = useState([]);
  const [isUpdateField , setIsUpdateField] = useState(false)
  const [tabProductTradingFields, setTabProductTradingFields] = useState([]);
  const [deleteTabProductTradingFields, setDeleteTabProductTradingFields] = useState([]);
  const [fieldBelong, setFieldBelong] = useState(FIELD_BELONG.PRODUCT)

  const formId = 'popup-product-set-detail-form-id-321';
  const [ isChangedForm, setChangeForm ] = useDetectFormChange(formId,[props.screenMode]);
  const employeeDetailCtrlId = useId(1, "productSetDetailEmployeeDetail_")

  useEffect(() => {
    setChangeForm(false);
    if (props.screenMode === ScreenMode.DISPLAY) {
      setNormalMessage({type: MessageType.None, message: []})
      setEditedSummaryFields([])
    }
  },[props.screenMode])

  const executeDirtyCheck = async (action: () => void, cancel?: () => void) => {
    if (isChangedForm) {
      await DialogDirtyCheck({ onLeave: action, onStay: cancel , partternType: 1});
    } else {
      action();
    }
  };

  /* call popup */
  const [openPopupEmployeeDetail, setOpenPopupEmployeeDetail] = useState(false);
  const [employeeId, setEmployeeId] = useState(0);
  /* end call popup */

  const { screenMoveInfo } = props;
  const tableListRef = useRef(null);
  const isAdmin = hasAnyAuthority(props.authorities, [AUTHORITIES.ADMIN]);
  // const productTradings =
  //   props.productSet && props.productSet.dataInfo && props.productSet.dataInfo.productTradings
  //     ? props.productSet.dataInfo.productTradings
  //     : null;
  const initialState = {
    tabListShow: _.cloneDeep(props.productSet && props.productSet.tabInfo.filter(e => e.isDisplay)),
    tabList: _.cloneDeep(props.productSet && props.productSet.tabInfo),
    tabListUpdate: null,
    summaryFields: null
  };
  const [loadTab] = useState({
    summary: false,
    productTrading: false,
    changehistory: false
  });

  let isChangeField = false;



  const handleInitData = (productId, tab) => {
    if (productId) {
      switch (tab) {
        case TAB_ID_LIST_SET.summary:
          if (!loadTab.summary) {
            props.handleInitGetProductSet(productId);
            props.getCustomFieldsInfoProductTrading()
          }
          break;
        case TAB_ID_LIST_SET.productTrading:
          if (!loadTab.productTrading) {
            props.handleInitTradingProducts(productId);
          }
          break;
        case TAB_ID_LIST_SET.changehistory:
          if (!loadTab.changehistory) {
            props.handleInitProductSetHistory(currentProductSetDetail, 1, 30);
          }
          break;
        default:
          break;
      }
    }
  };

  
  useEventListener('message',ev => {
    if(ev.data?.id && ev.data?.type === FSActionTypeScreen.CloseWindow){
      handleInitData(ev.data.id, currentTab)
    }
  })

  /* _________________Optional_________________ */
  const closePopupProductSet = () => {
    props.handleInitGetProductSet(props.productId);
    setOpenPopupEditProductSet(false);
  };

  const handleCreateProductSet = () => {};

  const handleScroll = e => {
    const element = e.target;
    if (
      currentTab === TAB_ID_LIST_SET.changehistory &&
      props.productSetHistory &&
      props.productSetHistory.length % 30 === 0 &&
      element.scrollHeight - element.scrollTop === element.clientHeight
    ) {
      props.handleInitProductSetHistory(currentProductSetDetail, currentPage + 1, 30);
      setCurrentPage(currentPage + 1);
    }
  };
  
  const cleanModeEdit = () => {
    props.changeScreenMode(false);
    setPopupSettingMode(SettingModes.CreateNewInput);
    setTabListUpdate(null);
    setSummaryFields(null);
    setCurrentFieldEdit(null);
    setTabListShow(initialState.tabListShow);
    setTabList(initialState.tabList);
  }

  const handleClosePopup = () => {
    executeDirtyCheck(() => {
    setShowConditionDisplay(PopupConditionDisplay.None);
        Object.keys(loadTab).forEach(item => {
          loadTab[item] = false;
        });
        props.toggleClosePopupProductSetDetail(null, isUpdateField);
        props.resetSuccessMessage();
        props.reset();
        cleanModeEdit();
    })
  };

  const toggleOpenPopupSetEdit = (viewMode, action, showModalPopup) => {
    setIsShowModal(showModalPopup)
    setActionTypePopup(action)
    setProductSetViewMode(viewMode)

    if(viewMode === PRODUCT_VIEW_MODES.PREVIEW) return setOpenPopupEditProductSet(true);
    if(props.popout) return setOpenPopupEditProductSet(true);
    if(!props.isList && !props.toggleOpenPopupSetEdit){
      setIsShowModal(true)
      setOpenPopupEditProductSet(true);
    } else{
      props.toggleOpenPopupSetEdit(currentProductSetDetail ? currentProductSetDetail : props.popoutParams.productId);
      handleClosePopup();
    }
  };

  const updateStateSession = (mode: FSActionTypeScreen) => {
    if (mode === FSActionTypeScreen.SetSession) {
      Storage.local.set(PopupProductSetDetail.name, {
        summaryFields,
        tabListShow,
        currentTab,
        currentProductSetDetail,
        tradingProductsFields,
        changeHistory
      });
    } else if (mode === FSActionTypeScreen.GetSession) {
      const saveObj = Storage.local.get(PopupProductSetDetail.name);

      if (saveObj) {
        setSummaryFields(saveObj.summaryFields);
        setTabListShow(saveObj.tabListShow);
        setCurrentTab(saveObj.currentTab);
        setCurrentProductSetDetail(saveObj.currentProductSetDetail);
        setTradingProductsFields(saveObj.tradingProductsFields);
        setChangeHistory(saveObj.changeHistory);
        handleInitGetProductSet(saveObj.currentProductSetDetail);
      }
    } else if (mode === FSActionTypeScreen.RemoveSession) {
      Storage.local.remove(PopupProductSetDetail.name);
    }
  };

  const openNewWindow = () => {
    updateStateSession(FSActionTypeScreen.SetSession);
    updateStateSession(FSActionTypeScreen.SetSession);
    const height = screen.height * 0.8;
    const width = screen.width * 0.8;
    const left = screen.width * 0.3;
    const top = screen.height * 0.3;
    const style = `width=${width},height=${height},left=${left},top=${top}`;
    window.open(`${props.tenant}/product-set-detail/${currentProductSetDetail}`, '', style.toString());
    handleClosePopup();
  };

  const copyUrlProductSetDetail = url => {
    const dummy = document.createElement('textarea');
    document.body.appendChild(dummy);
    dummy.value = `${window.location.origin}/${props.tenant}/product-set-detail/${currentProductSetDetail}`;
    dummy.select();
    document.execCommand('copy');
    document.body.removeChild(dummy);
  };

  const getCurrentIndexProduct = () => {
    let index = null;
    if (props.listProductId) {
      props.listProductId.forEach((id, i) => {
        if (currentProductSetDetail === id) {
          index = i;
        }
      });
    }
    return index;
  };
  const checkIsHeadOrLastProductInList = (productId, isNext: boolean) => {
    const { listProductId = [] } = props

    if(isNext){
      const isLast =  R.equals(R.last(listProductId), productId)
      isLast && props.onPageChangeInDetailScreen(true)
      return
    }

    const isHead =  R.equals(R.head(listProductId), productId)
    isHead && props.onPageChangeInDetailScreen(false)
    return
  }
  useEffect(() => {
    checkIsHeadOrLastProductInList(currentProductSetDetail, true)  
    checkIsHeadOrLastProductInList(currentProductSetDetail, false)  
  }, [currentProductSetDetail])

  const onNextProduct = () => {
    let nextProductId = null;
    const currentIndexProduct = getCurrentIndexProduct();

    if (props.listProductId) {
      props.listProductId.forEach((id, idx) => {
        if (idx === currentIndexProduct) {
          nextProductId = props.listProductId[idx + 1];
        }
      });
    }

    if (nextProductId) {
      setCurrentProductSetDetail(_.cloneDeep(nextProductId));
    }
  };

  const onPrevProduct = () => {
    let prevProductId = null;
    const indexCurrentProduct = getCurrentIndexProduct();
    if (props.listProductId) {
      props.listProductId.forEach((id, i) => {
        if (i === indexCurrentProduct) {
          prevProductId = props.listProductId[i - 1];
        }
      });
    }
    if (prevProductId) {
      setCurrentProductSetDetail(_.cloneDeep(prevProductId));
    }
  };

  const onClickBack = () => {
    if(props.screenMode === ScreenMode.EDIT){
      props.changeScreenMode(false);
    } 
    // else{
    //   if(props.popout) window.close();
    // }
  }

  const onOpenModalEmployeeDetail = (paramEmployeeId): void => {
    setEmployeeId(paramEmployeeId);
    setOpenPopupEmployeeDetail(true);
  };

  const onClosePopupEmployeeDetail = () => {
    setOpenPopupEmployeeDetail(false);
  };

  const calculateHeightTable = () => {
    if (tableListRef && tableListRef.current) {
      const height = window.innerHeight - tableListRef.current.getBoundingClientRect().top - 24;
      if (height !== heightTable) {
        setHeightTable(height);
      }
    }
  };

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
    if (type === MessageType.Success || message === 'WAR_COM_0010' || message === 'WAR_COM_0013') {
      setTimeout(() => {
        setToastMessage(null);
      }, TIMEOUT_TOAST_MESSAGE);
    }
  };

  const displayNormalMessage = (message, type) => {
    if (_.isNil(message)|| !message.length) {
      return;
    }
    const objParams = { type, message };
    objParams.type = type;
    objParams.message = [message];
    setNormalMessage(objParams);
  };

  const getErrorMessage = errorCode => {
    let errorMessage = '';
    if (!isNullOrUndefined(errorCode)) {
      errorMessage = translate('messages.' + errorCode);
    }
    return errorMessage;
  };

  /* _________________Tab list_________________ */
  const changeTab = clickedTabId => {
    setCurrentTab(clickedTabId);
    if(clickedTabId === TAB_ID_LIST_SET.productTrading){
      props.getFieldInfoPersonals(
        `${CUSTOMER_GET_FIELD_TAB}${FIELD_BELONG.PRODUCT_TRADING}`,
        FIELD_BELONG.CUSTOMER,
        clickedTabId,
        FieldInfoType.Tab,
        null,
        null
      );
    }
  };

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
    setFieldCallback({ listField: _.cloneDeep(fields), deleteFields: [] });
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
      setFieldBelong(currentField?.fieldBelong || FIELD_BELONG.PRODUCT)
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
  };

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

  // /* _________________Tab producTrading_________________ */
  // const onChangeTradingProductsFields = value => {
  //   setTradingProductsFields(_.cloneDeep(value));
  // };

  /* _________________Edit mode_________________ */
  const deleteFieldUnAvailable = fieldInfo => {
    const fieldsUnAvailable = _.cloneDeep(productFieldUnavailable);
    const index = fieldsUnAvailable.findIndex(e => e.fieldId === fieldInfo.fieldId);
    if (index >= 0) {
      fieldsUnAvailable.splice(index, 1);
      deletedSummaryFields.push(fieldInfo.fieldId);
      setProductFieldUnavailable(fieldsUnAvailable ? fieldsUnAvailable : []);
    }
  };

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

  const handleClosePopupModeEdit = () => {
    executeDirtyCheck(() => {
      cleanModeEdit();
    });
  };

  const handleChangeScreenMode = () => {
    setTimeout(() => {
      props.changeScreenMode(true);
    }, 350);
  };

  /** remove Prefix Field label */
  const removePrefixFields = fieldInfo => {
    if (fieldInfo) {
      fieldInfo.forEach(field => {
        if (field && field.fieldLabel && isJsonString(field.fieldLabel)) {
          const langCode = Storage.session.get('locale', 'ja_jp');
          const fieldLabel = JSON.parse(field.fieldLabel);

          if (
            fieldLabel[langCode] &&
            fieldLabel[langCode].indexOf(PREFIX_PRODUCT_SET_DETAIL[StringUtils.snakeCaseToCamelCase(langCode)]) !== -1
          ) {
            fieldLabel[langCode] = fieldLabel[langCode].replace(PREFIX_PRODUCT_SET_DETAIL[StringUtils.snakeCaseToCamelCase(langCode)], '');
            field.fieldLabel = JSON.stringify(fieldLabel);
          }
        }
      });
    }
    return fieldInfo;
  };

  const getFieldsUpdate = listFields => {
    const listFieldsTmp = _.cloneDeep(listFields);
    if (!_.isNil(listFields)) {
      productFieldUnavailable.forEach(field => {
        const index = listFields.findIndex(e => e.fieldId === field.fieldId);
        if (index < 0) {
          listFieldsTmp.push(field);
        }
      });
    }
    const fieldsUpdate = [];
    if (listFieldsTmp !== null) {
      listFieldsTmp.forEach(item => {
        const field = _.cloneDeep(item);
        delete field.fieldBelong;
        delete field.createdDate;
        delete field.createdUser;
        delete field.updatedUser;
        delete field.ownPermissionLevel;
        delete field.othersPermissionLevel;
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
    return removePrefixFields(fieldsUpdate);
  };

  const updateProductFieldInfo = () => {
    const deleteSummaryFieldTmp = _.cloneDeep(deletedSummaryFields);
    deleteFieldUnavailable.forEach(field => {
      const index = deletedSummaryFields.findIndex(e => e.fieldId !== field.fieldId);
      if (index < 0) {
        deleteSummaryFieldTmp.push(field);
      }
    });

    // --
    const fieldsUpdate = getFieldsUpdate(summaryFields);

    // --
    if (tabListUpdate !== null) {
      tabListUpdate.forEach(item => {
        delete item.tabLabel;
        delete item.fieldOrder;
      });
    }

    const fieldProductTradingTab = [];
    tabProductTradingFields.forEach(field => {
      fieldProductTradingTab.push({
        fieldId: field.fieldId,
        fieldOrder: field.fieldOrder,
        tabId: TAB_ID_LIST_SET.productTrading,
        fieldInfoTabId: field.fieldInfoTabId
      });
    });
    // call update api
    props.handleInitUpdateCustomFieldsInfo(FIELD_BELONG.PRODUCT, deleteSummaryFieldTmp, fieldsUpdate, tabListUpdate, [...deleteTabProductTradingFields], [...fieldProductTradingTab]);
  };

  const updateFieldInfoProductSet = () => {
    const currentFieldInfoProductSet = tabSummaryRef.current.getCurrentFieldInfoProductSet();
    const deleteFieldInfoProductSet = tabSummaryRef.current.getDeleteFieldInfoProductSet();
    const fieldsUpdate = getFieldsUpdate(currentFieldInfoProductSet.filter(i => !i.isDefault));

    // call update api
    props.handleInitUpdateCustomFieldsInfo(FIELD_BELONG.PRODUCT_BREAKDOWN, deleteFieldInfoProductSet, fieldsUpdate, [], [], []);
  };

  const updateCustomFieldInfo = () => {
    updateProductFieldInfo();

    updateFieldInfoProductSet();

    props.changeScreenMode(false);
  };

  const isChangeSettingField = (isChange: boolean) => {
    isChangeField = isChange;
    return isChange;
  };

  const onExecuteActionForProductFieldInfo = (fieldInfo, actionType, params) => {
    switch (actionType) {
      case DynamicControlAction.SAVE: {
        countSave[fieldInfo.fieldId] = countSave[fieldInfo.fieldId] + 1;
        if (fieldInfo.availableFlag > AVAILABLE_FLAG.UNAVAILABLE) {
          setIsSaveField(true);
        } else {
          const listFieldTmp = summaryFields ? _.cloneDeep(summaryFields) : concatArray(props.productSet.fieldInfoProduct.filter(e => e.availableFlag > 0), productFieldUnavailable, fieldInfo);

          if (summaryFields && props.productSet) {
            props.productSet.fieldInfoProduct.forEach((field) => {
              const index = summaryFields.findIndex(e => e.fieldId === field.fieldId);
              if (index < 0 && field.fieldId === params.fieldId) {
                listFieldTmp.push(field)
              }
            })
          }
          const saveFieldResult = onSaveField(listFieldTmp, params, fieldInfo);
          setSummaryFields(saveFieldResult.listField);
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
          if (fieldInfo.fieldId < 0 && (_.isNil(countSave[fieldInfo.fieldId]) || countSave[fieldInfo.fieldId] === 0)) {
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

  const onDynamicFieldPopupExecuteAction = (fieldInfo, actionType, params) => {
    if (fieldInfo.fieldBelong === FIELD_BELONG.PRODUCT_BREAKDOWN) {
      tabSummaryRef.current.onDynamicFieldPopupExecuteActionForCommonProduct(fieldInfo, actionType, params);
      setPopupSettingMode(SettingModes.CreateNewInput);
    } else {
      onExecuteActionForProductFieldInfo(fieldInfo, actionType, params);
    }
  };

  // delete product set - trungbh
  const checkDeleteProductByIcon = () => {
    const productSetId = props.productId ? props.productId : props.popoutParams.productId;
    props.handleCheckDeleteProduct(productSetId);
  };

  const deleteProductByIcon = (setIds, productIds) => {
    props.handleDeleteProducts(productIds, setIds);
  };

  const deleteByIcon = async productSetId => {
    const result = await ConfirmDialog({
      title: <>{translate('products.detail.title.popupErrorMessage.delete')}</>,
      message: translate('messages.WAR_PRO_0001'),
      confirmText: translate('products.detail.title.popupErrorMessage.delete'),
      confirmClass: 'button-red',
      cancelText: translate('products.detail.label.button.cancel'),
      cancelClass: 'button-cancel'
    });
    if (result) {
      const lstSetIds = [];
      lstSetIds.push(productSetId);
      deleteProductByIcon(lstSetIds, []);
        if(props.popout){
          window.opener.postMessage({type:EVENT_MESSAGES_POPOUT.REMOVE_PRODUCT})
        }
    }
  };

  const confirmDeleteProductsInSet = async (data, productSetId) => {
    const result = await ConfirmDialogCustom({
      isCustom: true,
      title: <>{translate('products.top.dialog.title-delete-products')}</>,
      message: (
        <>
          <b>{translate('messages.WAR_PRO_0002')}</b>
        <div className="warning-content-popup">
          <div className="warning-content text-left">
            {data.productListConfirmLists.map((item, idk) => {
              return (
                <>
                  <b key={idk}>{translate('messages.WAR_PRO_0005', { 0: item.productName })}</b>
                    {item.productSetAffectLists &&
                      item.productSetAffectLists.map((item1, idk1) => {
                        return <b key={idk1}>{item1.setName}</b>;
                  })}
                </>
                );
            })}
          </div>
        </div>
        </>
      ),
      confirmText: translate('products.top.dialog.confirm-delete-products'),
      confirmClass: 'button-red',
      cancelText: translate('products.top.dialog.cancel-text'),
      cancelClass: 'button-cancel'
    });
    if (result) {
      if (data.productSetConfirmLists && data.productSetConfirmLists.length === 0) {
        const lstSetIds = [];
        lstSetIds.push(productSetId);
        deleteProductByIcon(lstSetIds, []);
      } else if (data.productSetConfirmLists && data.productSetConfirmLists.length > 0) {
        const setDels = [];
        data.productSetConfirmLists.forEach(item => {
          if (item.productDeleteLists.filter(x => productSetId !== x.productId).length <= 0) {
            setDels.push(item);
          }
        });
        if (setDels.length > 0) {
          const result2 = await ConfirmDialogCustom({
            isCustom: true,
            title: <>{translate('products.top.dialog.title-delete-products')}</>,
            message: (
              <>
                <b>{translate('messages.WAR_PRO_0003')}</b>
              <div className="warning-content-popup">
                <div className="warning-content text-left">
                    {setDels.map((item, idk) => {
                      if (item.productDeleteLists) {
                        const name = item.productDeleteLists.map(item1 => item1.productName).join(', ');
                        return (
                          <>
                            <b>{translate('messages.WAR_PRO_0006', { 0: name })}</b>
                            <b>{item.setName}</b>
                          </>
                        );
                      }
                    })}
                </div>
              </div>
              </>
            ),
            confirmText: translate('products.delete-product-and-set'),
            confirmClass: 'button-red',
            cancelText: translate('products.top.dialog.cancel-text'),
            cancelClass: 'button-cancel'
          });
          if (result2) {
            const lstSetIds = [];
            lstSetIds.push(productSetId);
            setDels.forEach(item => lstSetIds.push(item.productId));
            deleteProductByIcon(lstSetIds, []);
          }
        } else {
          const lstSetIds = [];
          lstSetIds.push(productSetId);
          deleteProductByIcon(lstSetIds, []);
        }
      }
    }
  };

    /* _________________Lifecycle_________________ */
    useEffect(() => {
      if (summaryFieldRevert && summaryFields && productFieldUnavailable) {
        setSummaryFieldRevert(initialRevertFields(summaryFields, productFieldUnavailable, summaryFieldRevert));
      }
    }, [summaryFields, productFieldUnavailable])
  
    useEffect(() => {
      if (props.productSet) {
        setSummaryFieldRevert(props.productSet.fieldInfoProduct)
      }
    }, [props.productSet])
  
    useEffect(() => {
      return () => {
        // props.reset();
        if (props.resetSuccessMessage) {
          props.resetSuccessMessage();
        }
      };
    }, [currentProductSetDetail]);
  
  useEffect(() => {
    if (props.action === ProductAction.Success && props.checkDeleteProduct) {
      const productSetId = currentProductSetDetail ? currentProductSetDetail : props.popoutParams.productId;
      if (props.checkDeleteProduct.productListConfirmLists && props.checkDeleteProduct.productListConfirmLists.length === 0) {
        deleteByIcon(productSetId);
      } else if (props.checkDeleteProduct.productListConfirmLists && props.checkDeleteProduct.productListConfirmLists.length > 0) {
        confirmDeleteProductsInSet(props.checkDeleteProduct, productSetId);
      }
    }
  }, [props.checkDeleteProduct]);

  useEffect(() => {
    if (props.action === ProductAction.Success && props.deleteProducts) {
      if (props.popout) {
        window.close();
        setForceCloseWindow(true);
      } else{
        currentProductSetDetail === props.listProductId[props.listProductId.length - 1] ? handleClosePopup() : onNextProduct();
      }
      props.reset();
    }
  }, [props.deleteProducts]);

  useEffect(() => {
		setTabListShow(props.productSet ? props.tabListShow : []);
  }, [props.productSet, props.tabListShow]);

  useEffect(() => {
    if (props.productSet) {
      setProductFieldUnavailable(props.productSetFieldsUnVailable);
      setTabList(props.productSet ? props.productSet.tabInfo : []);
      props.productSet.fieldInfoProduct.forEach((item) => {
        if (_.isNil(item.salesProcess)) {
          Object.assign(item, { salesProcess: null });
        }
      })
      if (!isLoadProduct && _.toArray(props.productSet.fieldInfoProduct).length > 0) {
        setFieldRelationTab(props.productSet.fieldInfoProduct.filter(e => isFieldRelationAsTab(e)));
        setIsLoadProduct(true);
      }
    }
  }, [props.productSet]);

  useEffect(() => {
    if (forceCloseWindow) {
      if (props.popout) {
        window.opener.postMessage({ type: FSActionTypeScreen.CloseWindow, forceCloseWindow: true }, window.location.origin);
        Storage.session.set('forceCloseWindow', true);
        window.close();
      } else {
        handleClosePopup();
      }
    }
  }, [forceCloseWindow]);

  useEffect(() => {
    document.body.className = 'wrap-product';
    setFirst(true);
    setShouldRender(true);

    if (props.popout) {
      updateStateSession(FSActionTypeScreen.GetSession);
      setShowModal(false);
      setShouldRender(true);
    } else {
      setFirst(true);
      setShowModal(true);
      setShouldRender(true);
    }
    return () => {
      setFirst(false);
      setShowConditionDisplay(PopupConditionDisplay.None);
      updateStateSession(FSActionTypeScreen.RemoveSession);
    };
  }, []);

  useEffect(() => {
    handleInitData(currentProductSetDetail, currentTab);
    return () => {
      setShowConditionDisplay(PopupConditionDisplay.None);
    };
  }, [currentProductSetDetail, currentTab, props.productId]);

  useEffect(() => {
    if (screenMoveInfo && screenMoveInfo.screenType === SCREEN_TYPES.DETAIL) {
      if (currentProductSetDetail !== screenMoveInfo.objectId) setCurrentProductSetDetail(screenMoveInfo.objectId);
      if (currentTab !== TAB_ID_LIST_SET.summary) setCurrentTab(TAB_ID_LIST_SET.summary);
      handleInitData(screenMoveInfo.objectId, TAB_ID_LIST_SET.summary);
      props.moveScreenReset();
    }
  }, [screenMoveInfo]);

  useEffect(() => {
    if (props.messageUpdateCustomFieldInfoSuccess && props.action === ProductAction.UpdateSuccess) {
      Object.keys(loadTab).forEach(item => {
        loadTab[item] = false;
      });
      setTimeout(() => {
        handleInitData(currentProductSetDetail, currentTab);
      }, 750);
      setSummaryFields(null);
      props.changeScreenMode(false);
      setFieldCallback(null)
      setIsUpdateField(true)
    }
  }, [props.messageUpdateCustomFieldInfoSuccess, props.action]);

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
    displayNormalMessage(props.errorItems, MessageType.Error);
  }, [props.errorItems]); 

  useEffect(() => {
    displayToastMessage(props.msgSuccess, MessageType.Success, CLASS_CUSTOM);
  }, [props.msgSuccess]);

  useEffect(() => {
    displayToastMessage(props.productSetCreatedSuccessMsg, MessageType.Success, CLASS_CUSTOM);
  }, [props.productSetCreatedSuccessMsg]);
  
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
  const selectFieldTab = (listField, idTab) => {
    if (idTab === TAB_ID_LIST_SET.productTrading ){
      // props.getFieldInfoPersonals(
      //   `${CUSTOMER_GET_FIELD_TAB}${FIELD_BELONG.PRODUCT_TRADING}`,
      //   FIELD_BELONG.PRODUCT,
      //   idTab,
      //   FieldInfoType.Tab,
      //   null,
      //   null
      // );
        setTabProductTradingFields(listField);
    }
  }
  const deleteFieldTab = (fieldId, idTab) => {
    if (idTab === TAB_ID_LIST_SET.productTrading ){
      setDeleteTabProductTradingFields([...deleteTabProductTradingFields, fieldId]);
    }
  }

  /* _________________Render_________________ */
  const renderDynamicSelectFields = () => {
    if (currentTab === TAB_ID_LIST_SET.summary) {
      let listField = _.concat(summaryFields ? summaryFields : [], productFieldUnavailable);

      if (fieldBelong === FIELD_BELONG.PRODUCT_BREAKDOWN) {
        listField = tabSummaryRef.current.getCurrentFieldInfoProductSet();
      }
      const fieldProdutSetUnavailable = props.productSet.fieldInfoProductSet ? props.productSet.fieldInfoProductSet.filter(e => e.availableFlag !== AVAILABLE_FLAG.WEB_APP_AVAILABLE) : [];
      const listUnVailable = _.concat(productFieldUnavailable ? productFieldUnavailable : [], fieldProdutSetUnavailable ? fieldProdutSetUnavailable : []);
      return (
        <DynamicSelectField
          key={fieldBelong}
          onChangeSettingField={isChangeSettingField}
          fieldsUnVailable={listUnVailable}
          currentSettingMode={popupSettingMode}
          fieldInfos={currentFieldEdit}
          fieldNameExtension={'product_data'}
          listFieldInfo={listField}
          onExecuteAction={currentTab === TAB_ID_LIST_SET.summary ? onDynamicFieldPopupExecuteAction : undefined}
          fieldBelong={fieldBelong}
          getFieldsCallBack={!_.isEmpty(fieldCallback) ? fieldCallback : { listField: props.productSet.fieldInfoProduct, deleteFields: null }}
        />
      );
    }else if (currentTab === TAB_ID_LIST_SET.productTrading) {
      return  <DynamicSelectFieldTab
      listFieldInfo={tabProductTradingFields}
      tabType={currentTab}
      selectFieldTab={selectFieldTab}
      deleteFieldTab={deleteFieldTab}
    />
    }

  };

  const renderMessage = () => {
    if (normalMessage === null) {
      if (messageDownloadFileError) {
        return <BoxMessage messageType={normalMessage.type} message={messageDownloadFileError} />;
      }
    } else {
      return (
        <>
          {normalMessage.message.map((messsageParams, idx) => {
            return <BoxMessage key={idx} messageType={normalMessage.type} message={getErrorMessage(messsageParams)} />;
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
              return (
                <BoxMessage
                  key={idx}
                  messageType={toastMessage.type}
                  message={props.msgSuccess ? props.msgSuccess : getErrorMessage(messsageParams)}
                  styleClassMessage={toastMessage.styleClass}
                  className=" "
                />
              );
            })}
          </div>
        </>
      );
    }
  };

  const renderActionTab = () => {
    if (tabListShow !== null && tabList !== null && tabListShow.length < tabList.length && props.screenMode === ScreenMode.EDIT) {
      return (
        <div className="add-tab-wrap active" ref={actionTabRef}>
          <div className="add-tab" onClick={() => setIsOpenMenuAddTab(!isOpenMenuAddTab)}></div>
          {isOpenMenuAddTab && tabListShow && tabListShow.length < tabList.length && (
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
          )}
        </div>
      );
    } else {
      return <></>;
    }
  };

  const renderPopupCreateEditProduct = () => {
    const fieldPreview =  handleFieldPreview(fieldCallback);

    return (
      openPopupEditProductSet && (
        <PopupProductSet
          iconFunction={'ic-sidebar-product.svg'}
          productId={(productSetViewMode === PRODUCT_VIEW_MODES.EDITABLE )? currentProductSetDetail : null}
          productIds={(productSetViewMode === PRODUCT_VIEW_MODES.EDITABLE )? currentProductSetDetail : []}
          onClosePopup={closePopupProductSet}
          onActionCreate={handleCreateProductSet}
          showModal={showModal}
          fieldPreview={fieldPreview}
          productViewMode={productSetViewMode}
        />
      )
    )
  }

  const productSetHandled = useMemo(() => handleDataAvailable(props.productSet, 'fieldInfoProduct'), [props.productSet]);

  useEffect(() => {
    if (props.fieldInfosTabTrading) {
      setTabProductTradingFields(props.fieldInfosTabTrading);
    }
  }, [props.fieldInfosTabTrading]);

  const renderTabContents = () => {
    calculateHeightTable();
    return (
      <>
        {props.productSet && currentTab === TAB_ID_LIST_SET.summary && (
          <TabSummary
            ref={tabSummaryRef}
            productSet={productSetHandled}
            productSetAllFields={props.productSet ? props.productSet.fieldInfoProduct : []}
            screenMode={props.screenMode}
            handleReorderField={props.handleReorderField}
            onChangeFields={onChangeSummaryFields}
            editedFields={editedSummaryFields}
            openDynamicSelectFields={openDynamicSelectFields}
            tabList={tabList}
            destroySaveField={destroySaveField}
            summaryFields={summaryFields}
            isSaveField={isSaveField}
            fieldEdit={fieldEdit}
            paramsEdit={paramsEdit}
            onSaveField={onSaveField}
            onShowMessage={onShowMessage}
            openProductDetailFromOther={props.openProductDetailFromOther}
            openModalEmployeeDetail={onOpenModalEmployeeDetail}
            productId={props.productId}
            countSave={countSave}
            setPopupSettingMode={setPopupSettingMode}
            onSelectDislaySummary={onSelectDislaySummary}
            deletedFields={deletedSummaryFields}
            edittingField={currentFieldEdit}
            fieldsUnavailable={productFieldUnavailable}
            tradingProducts={props.productTradings}
            tradingProductsFields={props.customFieldInfosProductTrading}
          />
        )}
          <div className={currentTab === TAB_ID_LIST.productTrading ? "custom-list-trading" : "d-none custom-list-trading"}>
            <DetailTabProductTrading
                    productId={currentProductSetDetail}
                    customer={null}
                    fieldInfo={tabProductTradingFields}
              />
          </div>
        {props.productSetHistory && currentTab === TAB_ID_LIST_SET.changehistory && (
           <TabChangeHistory
              changeHistory={props.productSetHistory}
              fieldInfo={concat(props.productSet.fieldInfoProductSet, props.productSet.fieldInfoProduct)}
              type={SpecialHistory.productSet}
              fieldNameExtension={'product_data'}
              openModalEmployeeDetail={onOpenModalEmployeeDetail}
              sourceData={{
                productCategories: props.productSet.productCategories ||[], 
                productTypes: props.productSet.productTypes ||[],
          }}
         />
        )}
        {renderPopupCreateEditProduct()}
        {openPopupEmployeeDetail && (
          <PopupEmployeeDetail
            id={employeeDetailCtrlId[0]}
            showModal={true}
            backdrop={false}
            openFromModal={true}
            employeeId={employeeId}
            listEmployeeId={[employeeId]}
            toggleClosePopupEmployeeDetail={onClosePopupEmployeeDetail}
            resetSuccessMessage={() => {}}
          />
        )}
        <RelationDisplayTab
          id="productSetRelationId"
          recordData={props.productSet && props.productSet.dataInfo ? props.productSet.dataInfo.productSet : null}
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
      <div className="modal-open" >
        <div className="modal popup-esr popup-task popup-modal-common show">
          <div className="modal-dialog form-popup m-0">
            <div className="modal-content">
              <div className="modal-header">
                <div className="left">
                  <div className="popup-button-back ">
                    <a className={"icon-small-primary icon-return-small" + (props.screenMode === ScreenMode.EDIT ? "" : " pointer-none")} onClick={onClickBack} />
                    <span className="text">
                      <img className="icon-group-user" src="../../content/images/ic-product.svg" alt="" />
                      {props.productSet && props.productSet.dataInfo && props.productSet.dataInfo.productSet
                        ? props.productSet.dataInfo.productSet.productName
                        : ''}
                    </span>
                  </div>
                </div>
                <div className="right">
                  <a className="icon-small-primary icon-share" onClick={() => copyUrlProductSetDetail(window.location.href)} />
                  {showModal && (
                    <>
                      <a className="icon-small-primary icon-link-small" onClick={() => openNewWindow()}></a>
                      <a className="icon-small-primary icon-close-up-small line" onClick={handleClosePopup}></a>
                    </>
                  )}
                </div>
              </div>
              <div className="modal-body style-3">
                <div className="popup-content style-3 v2 p-0">
                  <div className="popup-tool popup-tool-v2">
                    <div className="message-area">{renderMessage()}</div>
                    {props.screenMode === ScreenMode.EDIT &&  currentTab === TAB_ID_LIST_SET.summary  && <a className="button-primary button-activity-registration content-left custom-btn-preview" onClick={() => { toggleOpenPopupSetEdit(PRODUCT_VIEW_MODES.PREVIEW, PRODUCT_ACTION_TYPES.CREATE, true)}} >{translate('products.detail.label.button.preview')}</a>}
                    <div className="toolbox">
                      {props.screenMode === ScreenMode.DISPLAY &&
                        <>
                          {isAdmin && 
                            <>
                              <a className="icon-small-primary icon-edit-small" onClick={() => {toggleOpenPopupSetEdit(PRODUCT_VIEW_MODES.EDITABLE, PRODUCT_ACTION_TYPES.CREATE, false)}} />
                              <a className="icon-small-primary icon-erase-small" onClick={checkDeleteProductByIcon} />
                              <a className="button-primary button-add-new" onClick={handleChangeScreenMode}>{translate('products.detail.label.button.edit')}</a>
                            </>
                          }
                          <a 
                            className={"icon-small-primary icon-prev" + (props.listProductId && props.isList && currentProductSetDetail !== props.listProductId[0] ? "" : " disable pointer-none")} 
                            onClick={onPrevProduct} />
                          <a 
                            className={"icon-small-primary icon-next" + (props.listProductId && props.isList && currentProductSetDetail !== props.listProductId[props.listProductId.length - 1] ? "" : " disable pointer-none")} 
                            onClick={onNextProduct} />
                        </>
                      }
                      {props.screenMode === ScreenMode.EDIT && (
                        <>
                          <a onClick={handleClosePopupModeEdit} className="button-cancel">
                            {translate('products.detail.label.button.cancel')}
                          </a>
                          {_.isEqual(popupSettingMode, SettingModes.EditInput) ? 
                              <a className="button-blue disable">{translate('products.detail.label.button.save')}</a> : 
                              <a onClick={updateCustomFieldInfo} className="button-blue">{translate('products.detail.label.button.save')}</a>
                          }
                        </>
                      )}
                    </div>
                  </div>
                  <div className="popup-content-common-wrap" id={formId} >
                    <div
                      className={
                        props.screenMode === ScreenMode.EDIT ? 'popup-content-common-left scrollarea' : 'popup-content p-4 w-100 scrollarea'
                      }
                      onScroll={handleScroll}
                    >
                        {/* {props.screenMode === ScreenMode.EDIT &&  currentTab === TAB_ID_LIST_SET.summary  && <a className="button-primary button-activity-registration content-left" onClick={() => { toggleOpenPopupSetEdit(PRODUCT_VIEW_MODES.PREVIEW, PRODUCT_ACTION_TYPES.CREATE, true)}} >{translate('products.detail.label.button.preview')}</a>} */}
                      <div className={`product-detail mb-4 style-1 ${props.screenMode === ScreenMode.EDIT ? 'pl-4 pt-4' : ''}`}>
                          <img src={props.productSet ? (props.productSet.dataInfo?.productSet?.productImagePath || '../../content/images/noimage.png') : ""} className="product-detail-img" alt="" />
                        <div className="content">
                          {props.productSet && props.productSet.dataInfo && props.productSet.dataInfo.productSet && (
                            <p>{getFieldLabel(props.productSet.dataInfo.productSet, 'productCategoryName')}</p>
                          )}
                          { props.productSet?.dataInfo?.productSet && (
                            <p className="name">{props.productSet.dataInfo.productSet.productName}</p>
                          )}
                          { props.productSet?.dataInfo?.productSet && (
                            <p className="price">
                              { props.productSet?.dataInfo?.productSet?.unitPrice?.toLocaleString(navigator.language, {
                                    minimumFractionDigits: 0
                                  })
                                || '0'}
                              {getCurrencyUnit("unitPrice", props.productSet.fieldInfoProduct )}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className={`"popup-content-common-content" ${props.screenMode === ScreenMode.EDIT ? 'pl-4' : ''}`}>
                        <div className="tab-detault">
                        <Sticky scrollElement=".scrollarea" stickyStyle={{zIndex: '1'}}>         
                            <ul className="nav nav-tabs background-color-88">
                            {tabListShow && (
                              <TabList
                                onChangeTab={changeTab}
                                tabList={tabList}
                                tabListShow={tabListShow}
                                onDragDropTabList={onDragDropTabList}
                                deleteAddTab={onDelAddTab}
                                currentTab={currentTab}
                                screenMode={props.screenMode}
                              />
                            )}
                            <RelationDisplayTab
                              id="productSetRelationId"
                              isHeader={true}
                              listFieldInfo={fieldRelationTab}
                              currentTabId={currentTab}
                              onChangeTab={changeTab}
                            />
                            {renderActionTab()}
                          </ul>
                          </Sticky>
                          <div className="tab-content mt-4 style-3" style={{ height: heightTable }} ref={tableListRef}>
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
  };

  if (showModal) {
    return (
      <>
        <Modal isOpen={true} fade={true} toggle={() => {}} backdrop={(props.backdrop || props.backdrop === undefined)} id="popup-product-set-detail" autoFocus={true} zIndex="auto">
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
};

const mapStateToProps = ({ productSetDetail, productList, authentication, applicationProfile, screenMoveState, dynamicList , popupDetailTab}: IRootState) => ({
  screenMode: productSetDetail.screenMode,
  tradingProducts: productSetDetail.tradingProducts,
  authorities: authentication.account.authorities,
  action: productSetDetail.action,
  changeHistory: productSetDetail.changeHistory,
  productSetHistory: productSetDetail.productSetHistory,
  errorItems: productSetDetail.errorItems,
  productSet: productSetDetail.productSet,
  checkDeleteProduct: productSetDetail.checkDeleteProduct,
  tenant: applicationProfile.tenant,
  tabListShow: productSetDetail.tabListShow,
  screenMoveInfo: screenMoveState.screenMoveInfo,
  messageUpdateCustomFieldInfoSuccess: productSetDetail.messageUpdateCustomFieldInfoSuccess,
  messageUpdateCustomFieldInfoError: productSetDetail.messageUpdateCustomFieldInfoError,
  msgSuccess: productList.msgSuccess,
  productSetFieldsUnVailable: productSetDetail.productSetFieldsUnVailable,
  deleteProducts: productList.deleteProducts,
  listProductId: productList.listProductSetId,
  fieldInfosTabTrading: dynamicList?.data?.get(`${CUSTOMER_GET_FIELD_TAB}${FIELD_BELONG.PRODUCT_TRADING}`)?.fieldInfos?.fieldInfoPersonals,
  productTradings: popupDetailTab.tabProductTradings,
  customFieldInfosProductTrading : productSetDetail.customFieldInfoProductTrading
});

const mapDispatchToProps = {
  handleInitTradingProducts,
  changeScreenMode,
  handleReorderField,
  handleInitGetProductSet,
  handleInitProductSetHistory,
  handleInitUpdateCustomFieldsInfo,
  handleCheckDeleteProduct,
  handleDeleteProducts,
  reset,
  moveScreenReset,
  getFieldInfoPersonals,
  getCustomFieldsInfoProductTrading
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PopupProductSetDetail);
