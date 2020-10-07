import React, { useEffect, useRef, useState } from 'react'
import { RouteComponentProps } from 'react-router-dom';
import { Modal } from 'reactstrap';
import { translate } from 'react-jhipster';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import DynamicList from 'app/shared/layout/dynamic-form/list/dynamic-list';
import { getColumnWidth } from 'app/shared/layout/dynamic-form/list/dynamic-list-helper';
import { RECORD_PER_PAGE_OPTIONS } from 'app/shared/util/pagination.constants'
import ProductControlTop from '../control/product-control-top';
import ProductControlSidebar from '../control/product-control-sidebar';
import SwitchFieldPanel from '../../../shared/layout/dynamic-form/switch-display/switch-field-panel';
import PaginationList from 'app/shared/layout/paging/pagination-list';
import BoxMessage, { MessageType } from 'app/shared/layout/common/box-message';
import DialogDirtyCheck from 'app/shared/layout/common/dialog-dirty-check';
import BrowserDirtyCheck from 'app/shared/layout/common/browser-dirty-check';
import PopupMenuSet from '../../setting/menu-setting';
import dateFnsParse from 'date-fns/parse';
import {
  changeScreenMode,
  getCustomFieldsInfo,
  getListProductCategory,
  getProducts,
  handleInitProductList,
  handleSearchProductView,
  handleUpdateProduct,
  handleMoveToCategory,
  handleMoveProductsToCategory,
  reset,
  handleDeleteProducts,
  handleFilterProductsByMenu,
  ProductAction,
  resetMessageList
} from './product-list.reducer';
import {
  resetMessageSideBar
} from '../control/product-control-sidebar.reducer'
import PopupFieldsSearch from 'app/shared/layout/dynamic-form/popup-search/popup-fields-search'
import {
  PRODUCT_SPECIAL_FIELD_NAMES,
  PRODUCT_ACTION_TYPES,
  PRODUCT_DEF,
  PRODUCT_LIST_ID,
  PRODUCT_VIEW_MODES,
  SEARCH_MODE,
  SHOW_MESSAGE,
  EVENT_MESSAGES_POPOUT
} from '../constants';
import { FIELD_BELONG, ScreenMode, TIMEOUT_TOAST_MESSAGE, ControlType, TYPE_MSG_EMPTY, AUTHORITIES, MAXIMUM_FILE_UPLOAD_MB, USER_FORMAT_DATE_KEY, APP_DATE_FORMAT } from 'app/config/constants';
import StringUtils, { autoFormatNumber, getFieldLabel, jsonParse } from 'app/shared/util/string-utils';
import _ from 'lodash';
import * as R from 'ramda'
import ProductDisplayCondition from "app/modules/products/control/product-display-condition";
import CategoryRegistEdit from "app/modules/products/category/category-regist-edit";
import ProductListView from "../control/product-list-view"
import PopupProductSet from "app/modules/products/popup/popup-product-set";
import ModalCreateEditProduct, { FSActionTypeScreen } from '../product-popup/product-edit';
import ProductDetail from '../product-detail/product-detail';
import PopupProductSetDetail from '../popup-product-set-detail/popup-product-set-detail';
import { FieldInfoType, DEFINE_FIELD_TYPE } from "app/shared/layout/dynamic-form/constants";
import { isNullOrUndefined } from "util";
import MoveToCategoryPopup from "app/modules/products/control/popup/move-to-category-popup";
import PopupMoveCategory from "app/modules/products/control/popup/popup-move-category";
import ConfirmDialogCustom from '../control/popup/dialog-custom/confirm-dialog';
import SpecialEditList from '../special-item/special-edit-list';
import useEventListener from 'app/shared/util/use-event-listener';
import Popover from 'app/shared/layout/common/Popover';
import { useDetectFormChange } from 'app/shared/util/useDetectFormChange';
import { WindowActionMessage } from 'app/shared/layout/menu/constants';
import GlobalControlRight from 'app/modules/global/global-tool'
import EmployeeName from 'app/shared/layout/common/EmployeeName';
import HelpPopup from 'app/modules/help/help';
import { CATEGORIES_ID } from 'app/modules/help/constant';
import ContentChange from './ContentChange';
import TextChange from '../components/MessageConfirm/components/TextChange';
import { isDataNull, isEqual, findFieldInfo } from '../components/MessageConfirm/util';
import ErrorBoundary from 'app/shared/error/error-boundary';
import { hasAnyAuthority } from 'app/shared/auth/private-route';
import { setTimeout } from 'timers';
import { isExceededCapacity } from 'app/shared/util/file-utils';
import { resetMessageCategoryReducer } from 'app/modules/products/category/category-regist-edit.reducer'
import { Storage } from 'react-jhipster';
import { getTimezone, getDateTimeFormatString, DATE_TIME_FORMAT, TYPE_SWICH_FORMAT, switchFormatDate, tzToUtc, utcToTz, trimTimezoneMark, getTimeString, autoFormatTime, timeUtcToTz } from 'app/shared/util/date-utils';
import moment from 'moment';

export interface IProductListProps extends StateProps, DispatchProps, RouteComponentProps<{}> {
  screenMode: any;
  fieldInfos: any;
  customFieldInfos: any;
  products: any;
  actionType: any;
  errorItems: any;
  initializeInfor: any;
  checkboxFirstColumn: any;
  categories: any;
  category: any
}


export const ProductList = (props: IProductListProps) => {
  const [offset, setOffset] = useState(0);
  const [showSwitcher, setShowSwitcher] = useState(false);
  const [openPopupSearch, setOpenPopupSearch] = useState(false);
  const [isRegistCategory, setIsRegistCategory] = useState(true);
  const [openCategoryPopup, setOpenCategoryPopup] = useState(false);
  const [openCategoryPopup2, setOpenCategoryPopup2] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const [openPopupMoveCategory, setOpenPopupMoveCategory] = useState(false);
  const [openPopupEdit, setOpenPopupEdit] = useState(false);
  const [limit, setLimit] = useState(RECORD_PER_PAGE_OPTIONS[1]);
  const [textSearch, setTextSearch] = useState('');
  const [conditionSearch, setConditionSearch] = useState(null);
  const [filterConditions, setFilterConditions] = useState([]);
  const [orderBy, setOrderBy] = useState([]);
  const [orderByView, setOrderByView] = useState([]);
  const [searchMode, setSearchMode] = useState(SEARCH_MODE.NONE);
  const [isDirty, setIsDirty] = useState(false);
  const [saveEditValues, setSaveEditValues] = useState([]);
  const [openPopupProductSet, setOpenPopupProductSet] = useState(false);
  const [productIdSelected, setProductIdSelected] = useState(null);
  const [, setCancelCheck] = useState(false);
  const [view, setView] = useState(1)
  const [listViewChecked, setlistViewChecked] = useState([])
  const [productActionType, setProductActionType] = useState(PRODUCT_ACTION_TYPES.UPDATE);
  const [productViewMode, setProductViewMode] = useState(PRODUCT_VIEW_MODES.EDITABLE);
  const [productId, setProductId] = useState(null);
  const [productsChecked, setProductsChecked] = useState([]);
  const tableListRef = useRef(null);
  const [sidebarCurrentId, setSidebarCurrentId] = useState(null);
  const [category, setCategory] = useState(null);
  const { products, categories, errorItems, initializeInfor } = props;
  const { fieldInfos, customFieldInfos, fieldInfoSearch, customFieldInfoSearch } = props;
  const [categoryId, setCategoryId] = useState(null);
  const [isContainCategoryChild, setIsContainCategoryChild] = useState(false);
  const [selectedTargetType, setSelectedTargetType] = useState(0);
  const [selectedTargetId, setSelectTargetId] = useState(0);
  const [isOnlyData, setIsOnlyData] = useState(false);
  const [isContainDataSummary, setIsContainDataSummary] = useState(true);
  const [productIds, setProductIds] = useState([]);
  const [openPopupProductDetail, setOpenPopupProductDetail] = useState(false);
  const [openPopupProductSetDetail, setopenPopupProductSetDetail] = useState(false);
  const [conDisplaySearchDetail, setConDisplaySearchDetail] = useState(false);
  const [showPopupMoveToCategory, setShowPopupMoveToCategory] = useState(false);
  // const [sourceProduct, setSourceProduct] = useState(null);
  // const [targetCard, setTargetCard] = useState(null);
  const [productSetCreatedSuccessMsg, setProductSetCreatedSuccessMsg] = useState(null);
  const [showMessage, setShowMessage] = useState(0);
  const { moveToCategoryProductIds } = props;
  const [listProductChecked, setListProductChecked] = useState([]);
  const [productTypeList, setProductTypeList] = useState([]);
  const [onOpenPopupSetting, setOnOpenPopupSetting] = useState(false);
  const [onOpenPopupHelp, setOnOpenPopupHelp] = useState(false);

  const [fileUploads, setFileUploads] = useState({});
  const [filterListCondition, setFilterListCondition] = useState([]);
  const [messageDownloadFileError, setMessageDownloadFileError] = useState(null);
  const [msgSuccess, setMsgSuccess] = useState(null);
  const [errorCodeList, setErrorCodeList] = useState([]);
  const [openFromList, setOpenFromList] = useState(true);
  const [typeMsgEmpty, setTypeMsgEmpty] = useState(TYPE_MSG_EMPTY.NONE);
  // const [openPopupEmployeeDetail, setOpenPopupEmployeeDetail] = useState(false);
  // const [employeeIdDetail, setEmployeeIdDetail] = useState(null);
  const isAdmin = hasAnyAuthority(props.authorities, [AUTHORITIES.ADMIN]);

  const [offsetDetailScreen, setOffsetDetailScreen] = useState<number>(0)
  useEffect(() => {
    setOffsetDetailScreen(offset)
  }, [offset])

  const formId = "product-list-edit-simple-mode"
  const [isChanged, setIsChanged] = useDetectFormChange(formId, [view])

  useEffect(() => {
    setIsChanged(false)
  }, [view])



  let productList = [];
  if (products && products.dataInfo.products) {
    productList = _.cloneDeep(products.dataInfo.products);
  }
  let productCategoryList = [];
  if (categories) {
    productCategoryList = categories;
  }

  const productCategoryListAll = [];

  const pushAll = (item) => {
    if (!Array.isArray(item)) return;
    item.forEach(i => {
      productCategoryListAll.push(i);
      if (i.productCategoryChild) {
        pushAll(i.productCategoryChild);
      }
    })
  }
  if (productCategoryList && productCategoryList.length > 0) {
    pushAll(productCategoryList);
  }

  if (products?.dataInfo?.productTypes?.length > 0 && productTypeList.length <= 0) {
    setProductTypeList(products.dataInfo.productTypes);
  }
  let fields = [];
  if (fieldInfos && fieldInfos.fieldInfoPersonals) {
    fields = _.cloneDeep(fieldInfos.fieldInfoPersonals);
    fields.forEach(x => {
      if (x.fieldName === PRODUCT_SPECIAL_FIELD_NAMES.productCategoryId) {
        x.fieldItems = [{itemId: 0, itemLabel: translate('products.create-set.placeholder-category'), isAvailable: 1}];
        productCategoryListAll.forEach(cate => {
          x.fieldItems.push({ itemId: cate.productCategoryId, itemLabel: cate.productCategoryName, isAvailable: 1 });
        });
        x.fieldType = 1;
      }
      else if (x.fieldName === PRODUCT_SPECIAL_FIELD_NAMES.productTypeId) {
        x.fieldItems = [{ itemId: 0, itemLabel: translate('products.create-set.placeholder-type-product'), isAvailable: 1 }];
        productTypeList.forEach(type => {
          x.fieldItems.push({ itemId: type.productTypeId, itemLabel: type.productTypeName, isAvailable: 1 });
        });
        x.fieldType = 1;
      }
      // else if (x.fieldName === PRODUCT_SPECIAL_FIELD_NAMES.isDisplay) {
      //   x.fieldType = DEFINE_FIELD_TYPE.CHECKBOX
      //   x.fieldItems = [];
      //   x.fieldItems.push({ itemId: 1, itemLabel: '{"ja_jp": "' + translate('products.list.label.is-display.true') + '"}', isAvailable: 1 });
      //   x.fieldItems.push({ itemId: 2, itemLabel: '{"ja_jp": "' + translate('products.list.label.is-display.false') + '"}', isAvailable: 1 });
      // }
    })
  }

  let customFields = [];
  if (customFieldInfos) {
    customFields = customFieldInfos
  }

  let fieldSearch = [];
  if (fieldInfoSearch?.fieldInfoPersonals) {
    fieldSearch = fieldInfoSearch.fieldInfoPersonals;
    fieldSearch.forEach(y => {
      if (y.fieldName === PRODUCT_SPECIAL_FIELD_NAMES.productCategoryId) {
        y.fieldItems = [];
        productCategoryListAll.forEach(cate => {
          y.fieldItems.push({ itemId: cate.productCategoryId, itemLabel: cate.productCategoryName, isAvailable: 1 });
        });
        y.fieldType = 1;
      } else if (y.fieldName === PRODUCT_SPECIAL_FIELD_NAMES.productTypeId) {
        y.fieldItems = [];
        productTypeList.forEach(type => {
          y.fieldItems.push({ itemId: type.productTypeId, itemLabel: type.productTypeName, isAvailable: 1 });
        });
        y.fieldType = 1;
      } else if (y.fieldName === PRODUCT_SPECIAL_FIELD_NAMES.createBy || y.fieldName === PRODUCT_SPECIAL_FIELD_NAMES.updateBy || y.fieldName === PRODUCT_SPECIAL_FIELD_NAMES.productsSets) {
        y.fieldType = 9;
      }
      else if (y.fieldName === PRODUCT_SPECIAL_FIELD_NAMES.isDisplay) {
        y.fieldType = DEFINE_FIELD_TYPE.SINGER_SELECTBOX
        y.fieldItems = [];
        y.fieldItems.push({ itemId: 1, itemLabel: '{"ja_jp": "' + translate('products.list.label.is-display.true') + '"}', isAvailable: 1 });
        y.fieldItems.push({ itemId: 2, itemLabel: '{"ja_jp": "' + translate('products.list.label.is-display.false') + '"}', isAvailable: 1 });
      }
    })
  }

  let customFieldSearch = [];

  if (customFieldInfoSearch?.customFieldsInfo) {
    customFieldSearch = customFieldInfoSearch.customFieldsInfo;
    customFieldSearch.forEach(z => {
      if (z.fieldName === PRODUCT_SPECIAL_FIELD_NAMES.productCategoryId) {
        z.fieldItems = [];
        productCategoryListAll.forEach(cate => {
          z.fieldItems.push({ itemId: cate.productCategoryId, itemLabel: cate.productCategoryName, isAvailable: 1 });
        });
        z.fieldType = 1;
      } else if (z.fieldName === PRODUCT_SPECIAL_FIELD_NAMES.productTypeId) {
        z.fieldItems = [];
        productTypeList.forEach(type => {
          z.fieldItems.push({ itemId: type.productTypeId, itemLabel: type.productTypeName, isAvailable: 1 });
        });
        z.fieldType = 1;
      }
      else if (z.fieldName === PRODUCT_SPECIAL_FIELD_NAMES.createBy || z.fieldName === PRODUCT_SPECIAL_FIELD_NAMES.updateBy || z.fieldName === PRODUCT_SPECIAL_FIELD_NAMES.productsSets) {
        z.fieldType = 9;
      } 
      else if (z.fieldName === PRODUCT_SPECIAL_FIELD_NAMES.isDisplay) {
        z.fieldType = DEFINE_FIELD_TYPE.SINGER_SELECTBOX
        z.fieldItems = [];
        z.fieldItems.push({ itemId: 1, itemLabel: '{"ja_jp": "' + translate('products.list.label.is-display.true') + '"}', isAvailable: 1 });
        z.fieldItems.push({ itemId: 2, itemLabel: '{"ja_jp": "' + translate('products.list.label.is-display.false') + '"}', isAvailable: 1 });
      }
    })
  }


  useEffect(() => {
    document.body.className = "wrap-product";
    props.changeScreenMode(false);
    props.handleInitProductList(offset, limit, null, null);
    props.getListProductCategory();
    props.getCustomFieldsInfo(PRODUCT_DEF.EXTENSION_BELONG_LIST);
    setIsOnlyData(true);
    return () => {
      props.reset();
    }
  }, []);

  useEffect(() => {
    if (filterConditions?.length > 0) {
      setTypeMsgEmpty(TYPE_MSG_EMPTY.FILTER)
    } else {
      setTypeMsgEmpty(TYPE_MSG_EMPTY.NONE)
    }
  }, [filterConditions])

  useEffect(() => {
    // open details product from other screen
    const { state }: { state: any } = props.location;
    if (state && state.openDetail && state.recordId) {
      setOpenPopupProductDetail(true);
      setProductId(state.recordId);
      const stateCopy = { ...state };
      delete stateCopy.openDetail;
      delete stateCopy.recordId;
      props.history.replace({ state: stateCopy });
    }
  }, [props.location]);

  useEffect(() => {
    if (initializeInfor) {
      if (initializeInfor.selectedTargetId && initializeInfor.selectedTargetId !== 0) {
        setCategoryId(initializeInfor.selectedTargetId);
      }

      if (initializeInfor.extraSettings && initializeInfor.extraSettings[0] && initializeInfor.extraSettings[0].value === 'true') {
        setIsContainCategoryChild(true)
      } else {
        setIsContainCategoryChild(false)
      }

      if (initializeInfor.selectedTargetType) {
        setSelectedTargetType(initializeInfor.selectedTargetType);
      } else {
        setSelectedTargetType(0);
      }
      setOrderBy(initializeInfor.orderBy ? initializeInfor.orderBy : []);
      setFilterListCondition(initializeInfor.filterListConditions);
      const order = initializeInfor.orderBy ? initializeInfor.orderBy : [];
      const filterList = initializeInfor.filterListConditions ? initializeInfor.filterListConditions : [];
      const filters = filterList.filter(item => item.targetId === initializeInfor.selectedTargetId);
      const filter = filters.length > 0 ? filters[0] : null;
      const filterCondition = filter ? filter.filterConditions : [];
      const conditionFilter = [];
      const fieldInfo = _.cloneDeep(props.fields)
      fieldInfo.forEach(f => {
        if (f.fieldName === PRODUCT_SPECIAL_FIELD_NAMES.productCategoryId) {
          f.fieldItems = [];
          productCategoryListAll.forEach(cate => {
            f.fieldItems.push({ itemId: cate.productCategoryId, itemLabel: cate.productCategoryName, isAvailable: 1 });
          });
          f.fieldType = 1;
        } else if (f.fieldName === PRODUCT_SPECIAL_FIELD_NAMES.productTypeId) {
          f.fieldItems = [];
          productTypeList.forEach(type => {
            f.fieldItems.push({ itemId: type.productTypeId, itemLabel: type.productTypeName, isAvailable: 1 });
          });
          f.fieldType = 1;
        }
      })
      filterCondition.forEach(item => {
        const field = _.cloneDeep(fieldInfo.find(x => x.fieldId === item.fieldId));
        if (field) {
          field.isNested = item.isNested;
          field.fieldValue = item.fieldValue;
          field.searchType = item.searchType;
          field.searchOption = item.searchOption;
          field.fieldName = (field.fieldType.toString() === '9' && !item.fieldName.includes('.keyword')) ? item.fieldName + '.keyword' : item.fieldName;
          conditionFilter.push(field)
        }
      })
      setFilterConditions(conditionFilter);
      if (order.length > 0 || conditionFilter.length > 0) {
        tableListRef.current.setFilterListView(order, conditionFilter, fieldInfo);
      } else {
        tableListRef.current && tableListRef.current.resetState();
      }
    }
  }, [initializeInfor])


  useEffect(() => {
    if (props.actionType === ProductAction.Success) {
      setFileUploads({});
    }
  }, [props.actionType]);

  const getfileUploads = () => {
    const fUploads = [];
    const keyFiles = Object.keys(fileUploads);
    keyFiles.forEach(key => {
      const arrFile = fileUploads[key];
      arrFile.forEach(file => {
        fUploads.push(file);
      });
    });
    return fUploads;
  }
  const searchProductView = (orderRecord, offsetRecord = 0, isCategoryChild = isContainCategoryChild) => {
    setOffset(offsetRecord)
    setOrderByView(orderRecord);
    if (searchMode === SEARCH_MODE.CONDITION) {
      props.handleSearchProductView(offsetRecord, limit, categoryId, isCategoryChild, conditionSearch, [], orderRecord);
    } else {
      props.handleSearchProductView(offsetRecord, limit, categoryId, isCategoryChild, textSearch, [], orderRecord);
    }
  }

  const searchProductList = (offsetRecord, limitRecord, categoryIdRecord, isContainCategoryChildRecord, isUpdateListView, isChangePageInDetailScreen?) => {
    if (view === 1) {
      if (searchMode === SEARCH_MODE.TEXT_DEFAULT) {
        props.handleFilterProductsByMenu(offsetRecord, limitRecord, categoryIdRecord, isContainCategoryChildRecord, textSearch, filterConditions, orderBy, isUpdateListView, isChangePageInDetailScreen);
      } else if (searchMode === SEARCH_MODE.CONDITION) {
        props.handleFilterProductsByMenu(offsetRecord, limitRecord, categoryIdRecord, isContainCategoryChildRecord, conditionSearch, filterConditions, orderBy, isUpdateListView, isChangePageInDetailScreen);
      } else {
        props.handleFilterProductsByMenu(offsetRecord, limitRecord, categoryIdRecord, isContainCategoryChildRecord, '', filterConditions, orderBy, isUpdateListView, isChangePageInDetailScreen);
      }
    } else {
      searchProductView(orderByView, offsetRecord, isContainCategoryChildRecord)
    }
  }

  useEffect(() => {
    if (showMessage === SHOW_MESSAGE.SUCCESS) {
      if (moveToCategoryProductIds && moveToCategoryProductIds.length > 0) {
        if (view === 1) {
          searchProductList(offset, limit, categoryId, isContainCategoryChild, false);
        } else {
          props.handleSearchProductView(offset, limit, categoryId, isContainCategoryChild, conditionSearch, [], orderByView);
        }
      }
      if (view === 1) {
        tableListRef.current.removeSelectedRecord();
      } else {
        setlistViewChecked([]);
      }
    }
    setTimeout(() => {
      setShowMessage(SHOW_MESSAGE.NONE);
      setErrorCodeList([]);
      props.resetMessageList();
      props.resetMessageSideBar();
      props.resetMessageCategoryReducer()
    }, 5000)
    setTimeout(() => {
      setMsgSuccess(null);
    }, TIMEOUT_TOAST_MESSAGE)
  }, [showMessage])

  useEffect(() => {
    if (msgSuccess) {
      setTimeout(() => {
        setMsgSuccess(null);
      }, TIMEOUT_TOAST_MESSAGE)
    }
  }, [msgSuccess])

  useEffect(() => {
    if (props.errorCodeList && props.errorCodeList.length > 0) {
      setShowMessage(SHOW_MESSAGE.ERROR)
      setErrorCodeList(props.errorCodeList)
    } else if (errorItems && errorItems.length > 0) {
      if (errorItems[0].errorCode === 'ERR_COM_0050') {
        setShowMessage(SHOW_MESSAGE.ERROR_EXCLUSIVE)
      } else {
        setShowMessage(SHOW_MESSAGE.ERROR_LIST)
      }
    } else if (props.errorItemsCategory && props.errorItemsCategory.length > 0) {
      setShowMessage(SHOW_MESSAGE.ERROR)
      setErrorCodeList(props.errorItemsCategory)
    }
  }, [props.errorCodeList, props.errorItemsCategory, errorItems])

  useEffect(() => {
    if (props.msgSuccess) {
      setMsgSuccess(props.msgSuccess)
      setShowMessage(SHOW_MESSAGE.SUCCESS)
    }
  }, [props.msgSuccess])

  const setMessage = msg => {
    setMsgSuccess(msg)
    setShowMessage(SHOW_MESSAGE.SUCCESS)
  }

  const setMessageError = msg => {
    setShowMessage(SHOW_MESSAGE.ERROR)
    setErrorCodeList(msg)
  }

  useEffect(() => {
    if (props.deleteProductsDetail) {
      tableListRef.current.removeSelectedRecord();
    }
  }, [props.deleteProductsDetail])

  useEffect(() => {
    setIsChanged(false)
    if (props.screenMode === ScreenMode.DISPLAY) {
     setSaveEditValues([])
    }
  }, [props.screenMode])

  const confirmInputEdit = () => {
    const arrayChangeValue = []
    if (props.screenMode === ScreenMode.DISPLAY || saveEditValues.length <= 0 || productList.length <= 0 || fields.length <= 0) {
      return arrayChangeValue;
    }
    const groupProduct = saveEditValues.reduce(function (h, obj) {
      h[obj.itemId] = (h[obj.itemId] || []).concat(obj);
      return h;
    }, {});
    for (const prd in groupProduct) {
      if (!Object.prototype.hasOwnProperty.call(groupProduct, prd)) {
        continue;
      }
      const recordIdx = productList.findIndex(e => e['product_id'].toString() === prd.toString());
      // if (recordIdx < 0) {
      //   return true;
      // }
      for (let i = 0; i < groupProduct[prd].length; i++) {
        const fieldIdx = fields.findIndex(e => e.fieldId.toString() === groupProduct[prd][i].fieldId.toString());
        if (fieldIdx < 0) {
          continue;
        }
        const fieldName = fields[fieldIdx].fieldName;
        const fieldLabel = fields[fieldIdx].fieldLabel;
        const fieldType = fields[fieldIdx].fieldType;
        let newValue = groupProduct[prd][i].itemValue;

        if (productList[recordIdx] === undefined) {
          continue;
        }
        let oldValue = productList[recordIdx][fieldName];
        // if(_.isObject(newValue)){
        //   newValue = JSON.stringify(newValue);
        // }
        if ([
          DEFINE_FIELD_TYPE.MULTI_SELECTBOX, 
          DEFINE_FIELD_TYPE.CHECKBOX, 
          DEFINE_FIELD_TYPE.ADDRESS, 
          DEFINE_FIELD_TYPE.SELECT_ORGANIZATION,
          DEFINE_FIELD_TYPE.FILE,
          DEFINE_FIELD_TYPE.LINK,
        ].includes( _.toString(fieldType))) {
          oldValue = oldValue ? jsonParse(oldValue) : "";
        }
        if(_.toString(fieldType) === DEFINE_FIELD_TYPE.LINK ){
          newValue = newValue ? jsonParse(newValue) : "";
        } else if(_.toString(fieldType) === DEFINE_FIELD_TYPE.DATE){
          oldValue = oldValue? switchFormatDate(oldValue, TYPE_SWICH_FORMAT.DEFAULT_TO_USER) : "";
        } else if(_.toString(fieldType) === DEFINE_FIELD_TYPE.TIME){
          oldValue = oldValue ? timeUtcToTz(autoFormatTime(oldValue, true)) : "";
          newValue = newValue ? timeUtcToTz(autoFormatTime(newValue, true)) : "";
        }  else if(_.toString(fieldType) === DEFINE_FIELD_TYPE.DATE_TIME){
          oldValue = oldValue ? utcToTz(dateFnsParse(trimTimezoneMark(oldValue)), DATE_TIME_FORMAT.User) : "";
          newValue = newValue ? utcToTz(dateFnsParse(trimTimezoneMark(newValue)), DATE_TIME_FORMAT.User) : "";
        } else {
          newValue = newValue ? newValue.toString() : "";
          oldValue = oldValue ? oldValue.toString() : "";
        }

        if (oldValue === "[]") {
          oldValue = ""
        }
        if (newValue === null) {
          newValue = ""
        }
        if (!_.isEqual(newValue, oldValue) && fieldName !== PRODUCT_SPECIAL_FIELD_NAMES.createDate && fieldName !== PRODUCT_SPECIAL_FIELD_NAMES.updateBy && fieldName !== PRODUCT_SPECIAL_FIELD_NAMES.updateDate) {
          arrayChangeValue.push({ productId: productList[recordIdx]["product_id"], productName: productList[recordIdx]["product_name"], fieldName, fieldLabel, fieldType, newValue, oldValue, isSet: productList[recordIdx]["is_set"] })
        }
      }
    }
    return arrayChangeValue;
  }

  const isChangeInputEdit = () => {
    if (props.screenMode === ScreenMode.DISPLAY || saveEditValues.length <= 0 || productList.length <= 0 || fields.length <= 0) {
      return false;
    }
    const groupProduct = saveEditValues.reduce(function (h, obj) {
      h[obj.itemId] = (h[obj.itemId] || []).concat(obj);
      return h;
    }, {});
    for (const prd in groupProduct) {
      if (!Object.prototype.hasOwnProperty.call(groupProduct, prd)) {
        continue;
      }
      const recordIdx = productList.findIndex(e => e['product_id'].toString() === prd.toString());
      if (recordIdx < 0) {
        return true;
      }
      for (let i = 0; i < groupProduct[prd].length; i++) {
        const fieldIdx = fields.findIndex(e => e.fieldId.toString() === groupProduct[prd][i].fieldId.toString());
        if (fieldIdx < 0) {
          continue;
        }
        const fieldName = fields[fieldIdx].fieldName;
        let newValue = groupProduct[prd][i].itemValue;
        if (newValue === null) {
          newValue = ""
        }
        let oldValue = productList[recordIdx][fieldName];
        if (oldValue === null) {
          oldValue = ""
        }
        if (!_.isEqual(newValue, oldValue)) {
          return true;
        }
      }
    }
    return false;
  }

  const reloadScreenByCategory = () => {
    searchProductList(offset, limit, categoryId, isContainCategoryChild, false);
  }

  const reloadScreenDefault = () => {
    props.handleFilterProductsByMenu(offset, limit, categoryId, isContainCategoryChild, '', filterConditions, orderBy, false);
  }

  const onSelectSwitchDisplayField = (srcField, isSelected) => {
    tableListRef.current.handleChooseField(srcField, isSelected);
  }

  const onDragField = (fieldSrc, fieldTargetId) => {
    tableListRef.current.handleDragField(fieldSrc, fieldTargetId);
  }

  const onUpdateFieldValue = (itemData, type, itemEditValue) => {

     const index = saveEditValues.findIndex(e => e.itemId.toString() === itemData.itemId.toString() && e.fieldId.toString() === itemData.fieldId.toString());
    if (index < 0) {
      saveEditValues.push({ itemId: itemData.itemId, fieldId: itemData.fieldId, itemValue: itemEditValue });
    } else {
      saveEditValues[index] = { itemId: itemData.itemId, fieldId: itemData.fieldId, itemValue: itemEditValue };
    }
    setIsDirty(isChangeInputEdit());
  }

  const getExtensionsProducts = () => {
    const extensionsData = {};
    // if (!products) {
    //   return extensionsData;
    // }
    return extensionsData;
  }

  const executeDirtyCheck = async (action: () => void, cancel?: () => void) => {
    if (props.screenMode === ScreenMode.DISPLAY) {
      action();
    } else {
      // const arrayChangeValue = confirmInputEdit()
      isChanged ? await DialogDirtyCheck({ onLeave: action, onStay: cancel, partternType: 1 }) : action();
      // if (arrayChangeValue && arrayChangeValue.length > 0) {
      // const isChange = isChangeInputEdit();
      // if (isChange) {
      // await DialogDirtyCheck({ onLeave: action, onStay: cancel });
      // } else {
      // action();
      // }
    }
  }

  const handleOpenProductDetail = (itemId) => {
    const item = productList.find(x => x.product_id === itemId);
    setOpenFromList(true);
    setProductSetCreatedSuccessMsg(null)
    if (!item.is_set) {
      if (!openPopupProductDetail) {
        executeDirtyCheck(() => {
          setProductId(item.product_id);
          setOpenPopupProductDetail(true);
        });
      }
    } else {
      if (!openPopupProductSetDetail) {
        executeDirtyCheck(() => {
          setProductIdSelected(item.product_id);
          setopenPopupProductSetDetail(true);
        });
      }
    }
  }

  const onOpenPopupProductDetail = (itemId, fieldId, isClickProductName?) => {
    if (props.screenMode === ScreenMode.EDIT || !isClickProductName) return;
    // if(!isClickProductName){
    //   const f = customFields.find(x => x.fieldId === fieldId)
    //   if (!f ||  f.fieldName !== 'product_id') return;
    // }

    handleOpenProductDetail(itemId)
  }

  const onOpenPopupProductDetail2 = (itemId, fieldId, isClickProductName?) => {
    if (props.screenMode === ScreenMode.EDIT) return;
    const f = customFields.find(x => x.fieldId === fieldId)
    if (!f || f.fieldName !== 'product_name') return;

    handleOpenProductDetail(itemId)
  }

  const openPopupDetail = item => {
    if (!item.isSet) {
      if (!openPopupProductDetail) {
        executeDirtyCheck(() => {
          setProductId(item.productId);
          setOpenPopupProductDetail(true);
        });
      }
    } else {
      if (!openPopupProductSetDetail) {
        executeDirtyCheck(() => {
          setProductIdSelected(item.productId);
          setopenPopupProductSetDetail(true);
        });
      }
    }
  }

  const onPageChange = (offsetRecord, limitRecord) => {
    executeDirtyCheck(() => {
      setOffset(offsetRecord);
      setLimit(limitRecord);
      setSaveEditValues([]);
      if (props.screenMode === ScreenMode.EDIT) {
        props.changeScreenMode(false);
      }
      if (view === 2) {
        setlistViewChecked([]);
      }
      searchProductList(offsetRecord, limitRecord, categoryId, isContainCategoryChild, false);
    });
  }

  const onPageChangeInDetailScreen = (isNext: boolean) => {
    // get list product in prev / next page
    let offsetRecord = isNext ? offsetDetailScreen + limit : offsetDetailScreen - limit
    if (offsetRecord < 0) offsetRecord = 0
    setOffsetDetailScreen(offsetRecord)
    searchProductList(offsetRecord, limit, categoryId, isContainCategoryChild, false, isNext ? 'next' : 'prev');
  }

  const changeChecked = (isChecked) => {
    setIsContainCategoryChild(isChecked)
    searchProductList(offset, limit, categoryId, isChecked, true);
  }

  const onShowSwitchDisplay = () => {
    if (!showSwitcher) {
      executeDirtyCheck(() => {
        // props.getCustomFieldsInfo(PRODUCT_DEF.EXTENSION_BELONG_LIST);
        setShowSwitcher(true);
        setSaveEditValues([]);
        if (props.screenMode === ScreenMode.EDIT) {
          props.changeScreenMode(false);
        }
      });
    }
  }

  const resetFilter = () => {
    setOrderBy([])
    setFilterConditions([])
    tableListRef?.current?.resetState();
  }

  const enterSearchText = (text) => {
    resetFilter()
    executeDirtyCheck(() => {
      setTextSearch(text);
      setOffset(0);
      setSearchMode(SEARCH_MODE.TEXT_DEFAULT);
      setSaveEditValues([]);
      if (props.screenMode === ScreenMode.EDIT) {
        props.changeScreenMode(false);
      }
      // props.handleFilterProductsByMenu(0, limit, categoryId, isContainCategoryChild, text, filterConditions, orderBy);
      props.handleFilterProductsByMenu(0, limit, categoryId, isContainCategoryChild, text, [], []);
    }, () => {
      setTextSearch("");
    });
  }

  const handleSearchPopup = (condition) => {
    setOpenPopupSearch(false);
    // condition.forEach(item => {
    //   if(item.fieldType.toString() === DEFINE_FIELD_TYPE.DATE || item.fieldType.toString() === DEFINE_FIELD_TYPE.DATE_TIME || item.fieldType.toString() === DEFINE_FIELD_TYPE.TIME) {
    //     if(item.fieldValue && item.fieldValue.startsWith('[') && item.fieldValue.endsWith(']')) {
    //       item.fieldValue = item.fieldValue.substr(1, item.fieldValue.length - 2);
    //     }
    //   }
    // })
    setConditionSearch(condition);
    setOffset(0);
    setSearchMode(SEARCH_MODE.CONDITION);
    setSaveEditValues([]);
    if (props.screenMode === ScreenMode.EDIT) {
      props.changeScreenMode(false);
    }
    props.handleFilterProductsByMenu(0, limit, categoryId, isContainCategoryChild, condition, filterConditions, orderBy);
  }

  const onActionFilterOrder = (filter, order) => {
    setOffset(0);
    filter.forEach(item => {
      if (item.fieldType.toString() === DEFINE_FIELD_TYPE.DATE || item.fieldType.toString() === DEFINE_FIELD_TYPE.DATE_TIME || item.fieldType.toString() === DEFINE_FIELD_TYPE.TIME) {
        if (item.fieldValue && item.fieldValue.startsWith('[') && item.fieldValue.endsWith(']')) {
          item.fieldValue = item.fieldValue.substr(1, item.fieldValue.length - 2);
        }
      }
    })
    if (categoryId && categoryId > 0) {
      const a = {
        targetType: 1,
        targetId: categoryId,
        filterConditions: filter
      }
      const filterList = filterListCondition.filter(x => x.targetId !== categoryId);
      filterList.push(a);
      setFilterListCondition(filterList);
    }
    setFilterConditions(filter);
    setOrderBy(order);
    setSaveEditValues([]);
    if (props.screenMode === ScreenMode.EDIT) {
      props.changeScreenMode(false);
    }
    if (searchMode === SEARCH_MODE.CONDITION) {
      props.handleFilterProductsByMenu(0, limit, categoryId, isContainCategoryChild, conditionSearch, filter, order, true);
    } else {
      props.handleFilterProductsByMenu(0, limit, categoryId, isContainCategoryChild, textSearch, filter, order, true);
    }
  }

  const filterDataChangedAndNotNull = (arrayChangeValue) => {
    try {
      return arrayChangeValue.filter(_item => {
        const isNull = isDataNull(_item?.oldValue) && isDataNull(_item?.newValue)
        const oldValue =  jsonParse(_item?.oldValue, _item?.oldValue)
        const newValue =  jsonParse(_item?.newValue, _item?.newValue)
        const isEq = isEqual(oldValue, newValue)
        return !(isNull || isEq)
      })
    } catch (error) {
      return arrayChangeValue
    }
  }

  const filterDataHasFieldType16 = arrayChangeValue => {
    return arrayChangeValue.filter(_item => _item.fieldType !== 16)
  }


  const getFieldIdByFieldType = (fieldType: number) => {
    const fieldInfo = findFieldInfo(fieldType,props.fieldInfos.fieldInfoPersonals, 'fieldType')
    return fieldInfo.fieldId
  }

  const handleUpdateProducts = async () => {

    const arrayChangeValues = confirmInputEdit()
    const changeValueGrouped = R.groupBy(R.prop('productId'), arrayChangeValues )
    // const productIdsChanged = R.pluck("productId", arrayChangeValues)
    const listIdChange = []
    // const fieldIdOfFieldType16 = getFieldIdByFieldType(16)
    // const saveEditValuesFilter = saveEditValues.filter(item => item.fieldId !== fieldIdOfFieldType16 && productIdsChanged.includes(item.itemId))

    const files = getfileUploads();
    if (isExceededCapacity(files)) {
      setShowMessage(SHOW_MESSAGE.MAXIMUM_FILE);
      return;
    }
    const result = await ConfirmDialogCustom({
      title: (<>{translate("employees.department.department-regist-edit.form.button.confirm")}</>),
      message: (<div className="text-left">
        <p className="font-weight-normal">{translate("products.confirm-edit")}</p>
        <div className="warning-content-popup">
          <label className="mb-1">{translate("products.reason-edit")}</label>
          <div className="warning-content background pre-scrollable">
            {Object.keys(changeValueGrouped).map(_productId => {
              const arrayChangeValue = changeValueGrouped[_productId]
              const arrayChangeValueFiltered = R.compose(filterDataHasFieldType16, filterDataChangedAndNotNull )(arrayChangeValue)
              // const arrayChangeValueFiltered = filterDataChangedAndNotNull(arrayChangeValue)
              if(!arrayChangeValueFiltered?.length){
                return <></>
              }
              listIdChange.push(_productId)
              return <p key={_productId} >
              
            <div>{arrayChangeValueFiltered[0].productName}{translate("products.edit-simple-text")}</div>
               {arrayChangeValueFiltered.map(x => {
               if (x.fieldName === PRODUCT_SPECIAL_FIELD_NAMES.productCategoryId) {
                    const oldVal = productCategoryListAll.find(item => item.productCategoryId.toString() === x.oldValue);
                const newVal = productCategoryListAll.find(item => item.productCategoryId.toString() === x.newValue);
                return <TextChange new={getFieldLabel(newVal, 'productCategoryName')} old={getFieldLabel(oldVal, 'productCategoryName')} fieldLabel={getFieldLabel(x, "fieldLabel")} fieldName={x.fieldName} fieldType={1} isModalConfirm={true} />
                // return <p>{translate("messages.WAR_PRO_0007", { 0: x.productName, 1: getFieldLabel(x, "fieldLabel"), 2: (oldVal ? getFieldLabel(oldVal, "productCategoryName") : ""), 3: (newVal ? getFieldLabel(newVal, "productCategoryName") : "") })}</p>
              } else if (x.fieldName === PRODUCT_SPECIAL_FIELD_NAMES.productTypeId) {
                const oldVal = productTypeList.find(item => item.productTypeId.toString() === x.oldValue);
                const newVal = productTypeList.find(item => item.productTypeId.toString() === x.newValue);
                // return <p>{translate("messages.WAR_PRO_0007", { 0: x.productName, 1: getFieldLabel(x, "fieldLabel"), 2: (oldVal ? getFieldLabel(oldVal, 'productTypeName') : ""), 3: (newVal ? getFieldLabel(newVal, 'productTypeName') : "") })}</p>
                return <TextChange new={getFieldLabel(newVal, 'productTypeName')} old={getFieldLabel(oldVal, 'productTypeName')} fieldLabel={getFieldLabel(x, "fieldLabel")} fieldName={x.fieldName} fieldType={1} isModalConfirm={true} />

              }
              else if(x.fieldName === PRODUCT_SPECIAL_FIELD_NAMES.isDisplay){
               return <TextChange new={ x.newValue } old={x.oldValue} fieldLabel={getFieldLabel(x, "fieldLabel")} fieldName={x.fieldName} fieldType={4} isModalConfirm={true} />
              }

              else if (x.fieldType === 3) {
                const oldVal = x.oldValue === true;
                const newVal = x.newValue === true;
                if (oldVal !== newVal) {
                  return <TextChange new={ newVal } old={oldVal} fieldLabel={getFieldLabel(x, "fieldLabel")} fieldName={x.fieldName} fieldType={4} isModalConfirm={true} />
                  // return <p>{translate("messages.WAR_PRO_0007", { 0: x.productName, 1: x.fieldLabel, 2: x.oldVal, 3: x.newVal })}</p>
                }
              } else {
                return <ErrorBoundary>
                  <ContentChange newValue={ x.newValue } oldValue={x.oldValue} fieldLabel={getFieldLabel(x, "fieldLabel")} fieldName={x.fieldName} fieldType={x.fieldType} fieldInfos={[...customFieldInfos]} />
                </ErrorBoundary>
                // return <TextChange new={ x.newValue } old={x.oldValue} fieldLabel={getFieldLabel(x, "fieldLabel")} fieldName={x.fieldName} fieldType={4} isModalConfirm={true} />
                // return <p>{translate("messages.WAR_PRO_0007", { 0: x.productName, 1: getFieldLabel(x, "fieldLabel"), 2: x.oldValue, 3: x.newValue })}</p>
              }
            })}
            </p>
            })}
           
          </div>
        </div>
      </div>),
      confirmText: translate("employees.department.department-regist-edit.form.button.confirm"),
      confirmClass: "button-blue",
      cancelText: translate("employees.department.department-regist-edit.form.button.cancel"),
      cancelClass: "button-cancel"
    });
    if (!result) return
    let conditions = null;
    if (searchMode === SEARCH_MODE.TEXT_DEFAULT) {
      conditions = textSearch;
    } else if (searchMode === SEARCH_MODE.CONDITION) {
      conditions = conditionSearch;
    } else {
      conditions = "";
    }
    const saveEditValuesFilter = saveEditValues.filter(item => listIdChange.includes(_.toString(item.itemId)))
    props.handleUpdateProduct(PRODUCT_LIST_ID, saveEditValuesFilter, offset, limit, categoryId, isContainCategoryChild, conditions, filterConditions, orderBy, getfileUploads());
  }

  const openProductDetailFromOther = (id, isProductSet) => {
    if(!id) return;
    setOpenFromList(false);

    if (isProductSet) {
      setProductIdSelected(id);
      setopenPopupProductSetDetail(true);
    } else {
      setProductId(id);
      setOpenPopupProductDetail(true);
    }
  }

  const onOpenProductDetail = (prodId, isSet) => {
    if(!prodId) return;
    setOpenFromList(true);

    if (isSet) {
      setProductIdSelected(prodId);
      setopenPopupProductSetDetail(true);
    } else {
      setProductId(prodId);
      setOpenPopupProductDetail(true);
    }
  }

  const onOpenPopupSearch = () => {
    if (!openPopupSearch) {
      executeDirtyCheck(() => {
        if (props.screenMode === ScreenMode.EDIT) {
          props.changeScreenMode(false);
        }
        setOpenPopupSearch(true);
        setTextSearch("");
      });
    }
  }

  useEffect(() => {
    tableListRef && tableListRef.current && tableListRef.current.updateSizeDynamicList();
  }, [showSwitcher])

  const onClosePopupSearch = (saveCondition) => {
    setOpenPopupSearch(false);
    if (saveCondition && saveCondition.length > 0) {
      setConditionSearch(saveCondition);
    }
  }

  const onOpenPopupEdit = (productAcT, productVM, prodId, isonly, isContainy) => {
    setProductActionType(productAcT);
    setProductViewMode(productVM);
    if (productAcT === PRODUCT_ACTION_TYPES.UPDATE) {
      setProductId(prodId);
    } else {
      setProductId(null);
    }
    setIsContainDataSummary(isContainy);
    setIsOnlyData(isonly);
    setOpenPopupEdit(true);
  }

  const onClosePopupEdit = (prodId = null, flag, timeDelay = 0, isCancel?: boolean) => {
    setProductId(prodId);
    setOpenPopupEdit(false);

    switch (flag) {
      case (PRODUCT_ACTION_TYPES.UPDATE):
        onOpenProductDetail(prodId, false);
        if(!isCancel){
          setProductSetCreatedSuccessMsg("INF_COM_0004")
        }
        break;
      case (PRODUCT_ACTION_TYPES.CREATE):
        openProductDetailFromOther(prodId, false);
        if(!isCancel){
          setProductSetCreatedSuccessMsg("INF_COM_0003")
        }
        break;
      default:
        setProductSetCreatedSuccessMsg(null)
        break;
    }

    if (prodId > 0 && flag != null) {
      setTimeout(() => {
        searchProductList(offset, limit, categoryId, isContainCategoryChild, false);
      }, timeDelay);
    }
  }

  const parseValidateError = () => {
    let msgError = [];
    let firstErrorRowIndex = null;
    let firstErrorItem = null;
    let firstErrorProducts = null
    if (!errorItems || !Array.isArray(errorItems) || errorItems.length <= 0 || productList.length <= 0) {
      msgError = [];

    } else {
      let count = 0;

      const lstError = _.cloneDeep(props.errorItems);
      for (let i = 0; i < errorItems.length; i++) {
        if (!errorItems[i].rowId) continue;
        const rowIndex = productList.findIndex(e => e['product_id'].toString() === errorItems[i].rowId.toString());
        const fieldOrder = fieldInfos.fieldInfoPersonals.find(e => StringUtils.snakeCaseToCamelCase(e.fieldName) === StringUtils.snakeCaseToCamelCase(errorItems[i].item))["fieldOrder"]
        lstError[i]['rowIndex'] = rowIndex;
        lstError[i]['order'] = fieldOrder;
        const fieldIndex = fields.findIndex(e => StringUtils.snakeCaseToCamelCase(e.fieldName) === errorItems[i].item || e.fieldName === errorItems[i].item);
        if (rowIndex < 0 || fieldIndex < 0) {
          continue;
        }
        count++;
      }
      const msg = translate('messages.ERR_COM_0052', { count });
      msgError.push({ msg });
      if (lstError.length > 0) {
        const lstErrorSortByOrder = lstError.sort(function (a, b) {
          return a.rowIndex - b.rowIndex || a.order - b.order;
        });
        firstErrorRowIndex = lstErrorSortByOrder[0].rowIndex;
        firstErrorItem = lstErrorSortByOrder[0].item;
        firstErrorProducts = lstErrorSortByOrder[0].rowId;
      }
    }
    return { msgError, firstErrorRowIndex, firstErrorItem, firstErrorProducts };
  }

  const validateMsg = parseValidateError().msgError;

  const updateFiltersLocalMenu = (filters, id) => {
    if (id && id !== 0) {
      setCategoryId(id);
    } else {
      setCategoryId(null);
      setConDisplaySearchDetail(false);
      setSearchMode(SEARCH_MODE.NONE);
    }
    const conditionFilter = [];
    filters.forEach(item => {
      const field = _.cloneDeep(fields.find(x => x.fieldId === item.fieldId));
      if (field) {
        field.isNested = item.isNested;
        field.fieldValue = item.fieldValue;
        field.searchType = item.searchType;
        field.searchOption = item.searchOption;
        field.fieldName = (field.fieldType.toString() === '9' && !item.fieldName.includes('.keyword')) ? item.fieldName + '.keyword' : item.fieldName;
        conditionFilter.push(field)
      }
    })

    setFilterConditions(conditionFilter);
    setSelectTargetId(filters.length > 0 ? filters[0].value : 0);
    if (view === 1) {
      if (id && id !== 0) {
        if (searchMode === SEARCH_MODE.TEXT_DEFAULT) {
          props.handleFilterProductsByMenu(offset, limit, id, isContainCategoryChild, textSearch, conditionFilter, orderBy, true);
        } else if (searchMode === SEARCH_MODE.CONDITION) {
          props.handleFilterProductsByMenu(offset, limit, id, isContainCategoryChild, conditionSearch, conditionFilter, orderBy, true);
        } else {
          props.handleFilterProductsByMenu(offset, limit, id, isContainCategoryChild, null, conditionFilter, orderBy, true);
        }
      } else {
        props.handleFilterProductsByMenu(offset, limit, id, isContainCategoryChild, null, conditionFilter, orderBy, true);
      }
      const order = (orderBy && orderBy.length > 0) ? orderBy : [];

      if (order.length > 0 || conditionFilter.length > 0) {
        tableListRef.current.setFilterListView(order, conditionFilter, fields);
      } else {
        tableListRef.current && tableListRef.current.resetState();
      }
    } else {
      if (searchMode === SEARCH_MODE.CONDITION) {
        props.handleSearchProductView(offset, limit, id, isContainCategoryChild, conditionSearch, [], orderByView);
      } else {
        props.handleSearchProductView(offset, limit, id, isContainCategoryChild, textSearch, [], orderByView);
      }
    }

  }

  const actionSetSidebarId = (sidebarId: number) => {
    setSidebarCurrentId(sidebarId);
  }

  const callbackFunction = (childData) => {
    setView(childData)
  }
  const listChecked = (list) => {
    const lst = [];
    if (list && list.length > 0) {
      list.map(x => {
        const a = {
          productId: x,
          isChecked: true
        }
        lst.push(a)
      })
    }
    setlistViewChecked(lst)
  }

  const convertSourceRowToData = (sourceRowData: any[]): any[] => {
    if (
      sourceRowData.length === 1 &&
      // eslint-disable-next-line no-prototype-builtins
      !sourceRowData[0].hasOwnProperty('isChecked')
    ) {
      const firstData = sourceRowData[0]
      const convertData = {
        isChecked: true,
        productId: firstData.product_id,
        updatedDate: firstData.updated_date
      }
      return [convertData]
    }

    return sourceRowData

  }
  const onDragRow = (sourceRow, targetCategory) => {
    const sourceRowConverted = convertSourceRowToData(sourceRow)
    if (targetCategory.productCategoryId !== sidebarCurrentId) {
      props.handleMoveToCategory(targetCategory.productCategoryId, sourceRowConverted);
    }
  }


  const handleMoveProduct = () => {
    // props.handleMoveToCategory(targetCard.productCategoryId, [sourceProduct]);
    setShowPopupMoveToCategory(false);
  }

  const handleEventUpdateProductsCategory = productCategoryId => {
    props.handleMoveProductsToCategory(productCategoryId, productsChecked);
  }

  const handleCreateProductSet = (productIdCreated, type, delay = 0) => {
    setOpenPopupProductSet(false);
    
    switch (type) {
      case (PRODUCT_ACTION_TYPES.UPDATE):
        onOpenProductDetail(productIdCreated, true);
        setProductSetCreatedSuccessMsg("INF_COM_0004")
        break;
      case (PRODUCT_ACTION_TYPES.CREATE):
        openProductDetailFromOther(productIdCreated, true);
        setProductSetCreatedSuccessMsg("INF_COM_0003")
        break;
      default:
        setProductSetCreatedSuccessMsg(null)
        break;
    }
    setTimeout(() => {
      reloadScreenByCategory();
    }, delay);
  };

  const onOpenPopupProductSet = (ids) => {
    setProductIdSelected(null);
    setProductIds(ids);
    setOpenPopupProductSet(true);
  };

  const onOpenPopupSetEdit = (id) => {
    setProductIdSelected(id);
    setopenPopupProductSetDetail(false);
    setOpenPopupProductSet(true);
  };

  const closePopupProductSet = (setId, actionType) => {
    setOpenPopupProductSet(false);
  
    if (setId && actionType !== PRODUCT_ACTION_TYPES.UPDATE) {
      openProductDetailFromOther(setId, true)
    } else{
      onOpenProductDetail(setId, true);
    }
  };

  const handleOpenPopupMoveCategory = items => {
    const lst = productList.filter(x => items.map(y => { return y.productId }).includes(x.product_id))
    if (!openPopupMoveCategory) {
      setOpenPopupMoveCategory(true);
      setProductsChecked(lst);
    }
  }

  const onOpenPopupCategory = () => {
    setCategory(null);
    setIsRegistCategory(true);
    if (!openCategoryPopup) {
      setShowModal(true);
      setOpenCategoryPopup(true);
    }
  }

  const onOpenPopupCategoryEdit = (item) => {
    setCategory(item);
    setIsRegistCategory(false);
    if (!openCategoryPopup) {
      setShowModal(true);
      setOpenCategoryPopup(true);
    }
  }

  const onOpenPopupCategoryAddChild = id => {
    const item = {}
    item["productCategoryParentId"] = id;
    setCategory(item);
    setIsRegistCategory(true);
    if (!openCategoryPopup) {
      setShowModal(true);
      setOpenCategoryPopup(true);
    }
  }

  const closeCategoryPopup = (isSearch) => {
    if (isSearch) {
      props.getListProductCategory();
    }
    setOpenCategoryPopup(false);
  }
  const closeCategoryPopup2 = (isSearch) => {
    if (isSearch) {
      props.getListProductCategory();
    }
    setOpenCategoryPopup2(false);
  }

  const onClosePopupProductDetail = (isBack, isUpdateField) => {
    setOpenPopupProductDetail(false);
    if(isUpdateField){
      props.getCustomFieldsInfo(PRODUCT_DEF.EXTENSION_BELONG_LIST)
    }
  }

  const onCloseProductSetDetail = (isBack, isUpdateField) => {
    setopenPopupProductSetDetail(false);
    if(isUpdateField){
      props.getCustomFieldsInfo(PRODUCT_DEF.EXTENSION_BELONG_LIST)
    }
  }

  // const getListProductId = (isSet) => {
  //   // const listProductId = [];
  //   // const listProductSetId = [];

  //   // if (!props.products) return listProductId;
  //   // props.products.dataInfo.products.map((product) => {
  //   //   if (product['is_set'] === true) {
  //   //     listProductSetId.push(product.product_id);
  //   //   } else {
  //   //     listProductId.push(product.product_id);
  //   //   }
  //   // });

  //   // if (isSet === true) {
  //   //   return listProductSetId;
  //   // } else {
  //   //   return listProductId;
  //   // }


  //   // filter product is set or not
  //   const  productsDetailScreen =  props.products?.dataInfo.products || []

  //   const filterProduct = productsDetailScreen.filter(_product => isSet ? !!_product.is_set : !_product.is_set) 
  //   const listIds = R.pluck('product_id', filterProduct)
  //   return listIds

  // }

  const reloadScreen = (id) => {
    if (id === categoryId) {
      setCategoryId(null);
      searchProductList(0, limit, null, isContainCategoryChild, true);
    } else {
      searchProductList(0, limit, categoryId, isContainCategoryChild, false);
    }
  }

  const getErrorMessage = (errorCode) => {
    let errorMessage = '';
    if (!isNullOrUndefined(errorCode)) {
      errorMessage = translate('messages.' + errorCode);
    }
    return errorMessage;
  }

  const renderToastMessage = () => {
    if (msgSuccess) {
      return (
        <div className="message-area message-area-bottom position-absolute">
          <BoxMessage messageType={MessageType.Success}
            message={msgSuccess}
            className=" "
            styleClassMessage="block-feedback block-feedback-green text-left"
            messages={_.map(validateMsg, 'msg')}
          />
        </div>
      );
    } else {
      return <></>
    }
  }

  const renderErrorMessage = () => {
    switch (showMessage) {
      case SHOW_MESSAGE.ERROR:
        return (
          <>
            {errorCodeList.map((error, index) => {
              return (
                <div key={index}>
                  <BoxMessage messageType={MessageType.Error} message={getErrorMessage(error.errorCode)} />
                </div>
              );
            })}
          </>
        );

      case SHOW_MESSAGE.ERROR_LIST:
        return <BoxMessage messageType={MessageType.Error} messages={_.map(validateMsg, 'msg')} />;

      case SHOW_MESSAGE.ERROR_EXCLUSIVE:
        return <BoxMessage messageType={MessageType.Error} message={translate('messages.ERR_COM_0050')} />;

      case SHOW_MESSAGE.SUCCESS:
        break;

      // SHOW_MESSAGE.MAXIMUM_FILE
      case SHOW_MESSAGE.MAXIMUM_FILE:
        return <BoxMessage messageType={MessageType.Error} message={translate("messages.ERR_COM_0033", [MAXIMUM_FILE_UPLOAD_MB])} />;
      default:
        if (messageDownloadFileError !== null) {
          return <BoxMessage messageType={MessageType.Error} message={messageDownloadFileError} />;
        }
        break;
    }
  }

  const handleCheck = (recordId, isCheck) => {
    if (isCheck) setListProductChecked([...listProductChecked, productList.find(x => x.product_id === recordId)])
    else {
      const lst = listProductChecked.filter(x => x.product_id !== recordId);
      setListProductChecked(lst);
    }
  }
  const handleCheckAll = (isCheck) => {
    if (isCheck) setListProductChecked([...listProductChecked, ...productList.filter(x => !listProductChecked.includes(x))])
    else setListProductChecked([]);
  }

  const deleteProductByIcon = (setDels) => {
    const lstIds = listProductChecked.filter(x => !x.is_set).map(x => x.product_id);
    const lstSet = listProductChecked.filter(x => x.is_set).map(x => x.product_id);
    if (setDels) {
      setDels.forEach(item => {
        if (!lstSet.includes(item.setId)) lstSet.push(item.setId);
      })
    }
    props.handleDeleteProducts(lstIds, lstSet)
    setListProductChecked([])
  }

  const onReceiveMessage = (ev) => {
    if (!ev?.data) return
    const { type, id, isSet, flag } = ev.data
    if (type === FSActionTypeScreen.CloseWindow && flag && id) {
      isSet ? handleCreateProductSet(id, flag, 500) : onClosePopupEdit(id, flag, 500)
      return
    }

    if (type === EVENT_MESSAGES_POPOUT.REMOVE_PRODUCT) {
      setTimeout(() => {
        searchProductList(offset, limit, categoryId, isContainCategoryChild, false);
      }, 500);
    }
    if ((StringUtils.tryGetAttribute(ev, "data.type") === FSActionTypeScreen.CloseWindow && StringUtils.tryGetAttribute(ev, "data.screen") === 'employeeDetail')
      || StringUtils.tryGetAttribute(ev, "data.type") === WindowActionMessage.ReloadList) {
      tableListRef && tableListRef.current && tableListRef.current.reloadFieldInfo();
    }
  }

  useEventListener('message', onReceiveMessage);

  /**
   * Find first item focus in edit mode of list
   * If the item is textbox (field type = 9) or text area (field type = 10) or number (field type = 5) or email (field type = 15) or cellphone (field type = 13) 
   * then focus it.
   */
  const findFirstFocusEdit = () => {
    let firstProductShowInList = null;
    let firstItemFocus = null;
    // eslint-disable-next-line no-prototype-builtins
    if (props.products && props.products.dataInfo && props.products.dataInfo.hasOwnProperty("products")
      && props.products.dataInfo.products[0]) {
      firstProductShowInList = props.products.dataInfo.products[0]['product_id'];
    }
    if (fieldInfos && fieldInfos.fieldInfoPersonals) {
      const lstFieldAfterSortByFieldOrder = fieldInfos.fieldInfoPersonals.sort(StringUtils.compareValues('fieldOrder'));
      for (let i = 0; i < lstFieldAfterSortByFieldOrder.length; i++) {
        if (lstFieldAfterSortByFieldOrder[i].fieldType.toString() === DEFINE_FIELD_TYPE.TEXT ||
          lstFieldAfterSortByFieldOrder[i].fieldType.toString() === DEFINE_FIELD_TYPE.TEXTAREA ||
          lstFieldAfterSortByFieldOrder[i].fieldType.toString() === DEFINE_FIELD_TYPE.NUMERIC ||
          lstFieldAfterSortByFieldOrder[i].fieldType.toString() === DEFINE_FIELD_TYPE.EMAIL ||
          lstFieldAfterSortByFieldOrder[i].fieldType.toString() === DEFINE_FIELD_TYPE.PHONE_NUMBER) {
          firstItemFocus = lstFieldAfterSortByFieldOrder[i].fieldName;
          break;
        }
      }
    }
    return { firstProductShowInList, firstItemFocus }
  }

  // Find first error item
  const firstErrorItemError = parseValidateError().firstErrorItem;
  // Find first employee error
  const firstProductsError = parseValidateError().firstErrorProducts;
  // Find first employee ficus wwhen edit list
  const firstProductShowInListFocus = findFirstFocusEdit().firstProductShowInList;
  // Find first item ficus wwhen edit list
  const firstItemInEditListFocus = findFirstFocusEdit().firstItemFocus;

  // const onClosePopupEmployeeDetail = () => {
  //   setOpenPopupEmployeeDetail(false);
  // };

  const renderCellSpecial = (field, rowData, mode, nameKey) => {
    const styleCell = {};
    let widthEmployeeName = 200
    if (mode !== ScreenMode.EDIT) {
      styleCell["width"] = `${getColumnWidth(field)}px`;
      widthEmployeeName = getColumnWidth(field)
    }

    if (field.fieldName === PRODUCT_SPECIAL_FIELD_NAMES.createBy || field.fieldName === PRODUCT_SPECIAL_FIELD_NAMES.updateBy) {
      const user = {}
      if (field.fieldName === PRODUCT_SPECIAL_FIELD_NAMES.createBy) {
        user["name"] = rowData["created_user"]
        user["img"] = rowData["created_user_image"]
        user["id"] = rowData["created_user_id"]
      } else {
        user["name"] = rowData["updated_user"]
        user["img"] = rowData["updated_user_image"]
        user["id"] = rowData["updated_user_id"]
      }
      return (
        <>
          <EmployeeName
            userName={user["name"]}
            userImage={user["img"]}
            employeeId={user["id"]}
            sizeAvatar={48}
            backdrop={true}
            width={widthEmployeeName}
          ></EmployeeName>
          {/* {rowData["employee_icon"] && rowData["employee_icon"]["fileUrl"] && <a className="avatar"> <img src={rowData["employee_icon"]["fileUrl"]} /> </a>}
          {(!rowData["employee_icon"] || !rowData["employee_icon"]["fileUrl"]) &&
            <a className={'avatar ' + getColorImage(7)}> {charEmploy} </a>
          }
          <a className="d-inline-block text-ellipsis max-calc66"
           onClick={() => 
              {      // console.log("rowData", rowData)
              // onOpenPopupEmployeeDetail(rowData.employee_id, field.fieldId)
            }
          }>
            <Popover x={-20} y={25}>
              {rowData[field.fieldName]}
            </Popover>
          </a> */}
        </>
      )
    } else if (field.fieldName === PRODUCT_SPECIAL_FIELD_NAMES.productsSets) {
      if (rowData[PRODUCT_SPECIAL_FIELD_NAMES.productsSets]) {
        const sets = _.cloneDeep(rowData[PRODUCT_SPECIAL_FIELD_NAMES.productsSets]);
        sets.sort((a, b) => (a.productName.toLowerCase() > b.productName.toLowerCase()) ? 1 : -1);
        return (
          <>
            {sets.map((item, idx) => {
              return (
                <div key={idx}>
                  <Popover x={-20} y={20} >
                    <div className="set-width-200 text-ellipsis text-blue" onClick={() => { openPopupDetail(item) }}>{item.productName}</div>
                  </Popover>
                </div>
              )
            })}
          </>
        )
      }
      return (
        <div>

          <div className="set-width-200"></div>
        </div>
      )
    } else {
      return <SpecialEditList
        onOpenPopupProductDetail={onOpenPopupProductDetail}
        valueData={rowData}
        itemData={field}
        extensionsData={getExtensionsProducts()}
        updateStateField={onUpdateFieldValue}
        nameKey={nameKey}
        mode={mode}
        errorInfo={errorItems}
        firstFocus={errorItems ? { id: firstProductsError, item: firstErrorItemError, nameId: 'product_id' } : { id: firstProductShowInListFocus, item: firstItemInEditListFocus, nameId: 'product_id' }}
      />
    }
  }

  const getCustomFieldValue = (rowData, fieldColumn, mode) => {
    if (fieldColumn.fieldName === PRODUCT_SPECIAL_FIELD_NAMES.unitPrice
      && mode === ScreenMode.DISPLAY
      && rowData[fieldColumn.fieldName]) {
      return <>{autoFormatNumber(rowData[fieldColumn.fieldName].toString(), fieldColumn.decimalPlace) + ' ' + fieldColumn.currencyUnit}</>;
    } else if (fieldColumn.fieldName === PRODUCT_SPECIAL_FIELD_NAMES.productCategoryId
      && mode === ScreenMode.DISPLAY) {
      const cate = productCategoryListAll.find(x => x.productCategoryId === rowData[fieldColumn.fieldName]);
      return <>{cate ? getFieldLabel(cate, 'productCategoryName') : ''}</>
    }
    return undefined;
  }

  const getCustomFieldInfo = (field, controlType) => {
    if (controlType === ControlType.FILTER_LIST && field.fieldName === PRODUCT_SPECIAL_FIELD_NAMES.isDisplay) {
      const f = _.cloneDeep(fields.find(item => item.fieldName === field.fieldName));
      if (!f) {
        return field;
      }
      f.fieldType = DEFINE_FIELD_TYPE.SINGER_SELECTBOX
      f.fieldItems = [];
      f.fieldItems.push({ itemId: 1, itemLabel: '{"ja_jp": "' + translate('products.list.label.is-display.true') + '"}', isAvailable: 1 });
      f.fieldItems.push({ itemId: 2, itemLabel: '{"ja_jp": "' + translate('products.list.label.is-display.false') + '"}', isAvailable: 1 });
      return f;
    } else {
      return field;
    }
  }

  /**
     * handle action open popup setting
     */
  const handleOpenPopupSetting = () => {
    setOnOpenPopupSetting(true)
  }

  /**
     * handle action open popup help
     */
  const handleOpenPopupHelp = () => {
    setOnOpenPopupHelp(!onOpenPopupHelp);
  }

  /**
   * handle close popup settings
   */
  const dismissDialog = () => {
    setOnOpenPopupSetting(false);
  }

  /**
 * handle close popup Help
 */
  const dismissDialogHelp = () => {
    setOnOpenPopupHelp(false);
  }

  const updateFiles = (fUploads) => {
    const newUploads = {
      ...fileUploads,
      ...fUploads
    };
    setFileUploads(_.cloneDeep(newUploads));
  }

  const showMessageDownloadFile = (message, type) => {
    setMessageDownloadFileError(message);
    setTimeout(() => {
      setMessageDownloadFileError(null);
    }, 5000);
  }
  return (
    <>
      <div className={"control-esr page-employee resize-content" + (!props.expandMenu ? " width-100vw" : "")}>
        <ProductControlTop modeDisplay={props.screenMode}
          toggleSwitchDisplay={onShowSwitchDisplay}
          toggleOpenPopupSearch={onOpenPopupSearch}
          toggleOpenPopupEdit={onOpenPopupEdit}
          toggleOpenPopupProductSet={onOpenPopupProductSet}
          textSearch={textSearch} enterSearchText={enterSearchText}
          toggleSwitchEditMode={(isEdit) => {

            executeDirtyCheck(() => {
              setView(1);
              setSaveEditValues([]);
              setShowSwitcher(false);
              setIsDirty(true);
              setCancelCheck(true);
              props.changeScreenMode(isEdit)
            });
          }}
          toggleUpdateInEditMode={handleUpdateProducts}
          sidebarCurrentId={sidebarCurrentId}
          orderBy={orderBy}
          searchMode={searchMode}
          setSearchMode={setSearchMode}
          conDisplaySearchDetail={conDisplaySearchDetail}
          setConDisplaySearchDetail={setConDisplaySearchDetail}
          parentCallback={callbackFunction}
          recordCheckListView={listViewChecked}
          onOpenPopupCategory={onOpenPopupCategory}
          reloadScreenByCategory={reloadScreenByCategory}
          reloadScreenDefault={reloadScreenDefault}
          handleOpenPopupMoveCategory={handleOpenPopupMoveCategory}
          deleteProductByIcon={deleteProductByIcon}
          listProductChecked={listProductChecked}
          view={view}
          toggleOpenPopupSetting={handleOpenPopupSetting}
          toggleOpenHelpPopup={handleOpenPopupHelp}
        />
        <div className="wrap-control-esr style-3">
          <div className="esr-content">
            {productCategoryList && <ProductControlSidebar categories={productCategoryList}
              activeCardType={selectedTargetType}
              activeCardId={categoryId}
              setMessage={setMessage}
              setMessageError={setMessageError}
              updateFiltersSearch={updateFiltersLocalMenu}
              reloadScreen={reloadScreen}
              reloadLocalMenu={props.getListProductCategory}
              onOpenPopupCategoryEdit={onOpenPopupCategoryEdit}
              onOpenPopupCategoryAddChild={onOpenPopupCategoryAddChild}
              filterConditionList={filterListCondition}
              sidebarCurrentId={actionSetSidebarId} />}

            <div className={showSwitcher ? "esr-content-body esr-content-body2" : "esr-content-body"}>
              <div className="esr-content-body-main w-auto" id={formId} >
                {renderErrorMessage()}
                <div className="pagination-top">
                  {categoryId && <div className="align-left">
                    <label className="icon-check ml-5">
                      <input type="checkbox" checked={isContainCategoryChild} onChange={() => { changeChecked(!isContainCategoryChild) }} /><i></i> {translate('products.top.is-contain-category-child')}
                    </label>
                  </div>}

                  <div className="esr-pagination">
                    <ProductDisplayCondition conditions={conditionSearch} filters={filterConditions} searchMode={searchMode} sidebarCurrentId={sidebarCurrentId} />
                    {fields && products &&
                      <PaginationList offset={offset} limit={limit} totalRecords={products.totalCount}
                        onPageChange={onPageChange} />
                    }
                  </div>
                </div>

                {view === 1 &&
                  <DynamicList ref={tableListRef} records={productList} mode={props.screenMode} id={PRODUCT_LIST_ID}
                    checkboxFirstColumn={true} keyRecordId={"productId"}
                    belong={FIELD_BELONG.PRODUCT}
                    // sidebarCurrentId={sidebarCurrentId} TODO comment
                    fieldInfoType={FieldInfoType.Personal}
                    extensionsData={getExtensionsProducts()}
                    errorRecords={errorItems}
                    onActionFilterOrder={onActionFilterOrder}
                    onUpdateFieldValue={onUpdateFieldValue}
                    onDragRow={onDragRow}
                    tableClass={"table-list table-drop-down"}
                    onClickCell={onOpenPopupProductDetail}
                    handleCheck={handleCheck}
                    handleCheckAll={handleCheckAll}
                    fields={fields}
                    // customHeaderField={renderHeaderSpecial}
                    getCustomFieldInfo={getCustomFieldInfo}
                    customContentField={renderCellSpecial}
                    updateFiles={updateFiles}
                    showMessage={showMessageDownloadFile}
                    getCustomFieldValue={getCustomFieldValue}
                    fieldNameExtension="product_data"
                    totalRecords={products ? products.totalCount : 0}
                    firstFocus={errorItems ? { id: firstProductsError, item: firstErrorItemError, nameId: 'product_id' } : { id: firstProductShowInListFocus, item: firstItemInEditListFocus, nameId: 'product_id' }}
                    typeMsgEmpty={typeMsgEmpty}
                  />
                }
                {view === 2 && <ProductListView
                  handleSearchProductView={searchProductView}
                  setListProductChecked={setListProductChecked}
                  data={productList}
                  productListChecked={listChecked}
                  onOpenPopupProductDetail={onOpenPopupProductDetail2}
                  customFieldInfos={customFields}
                  onDragProductView={onDragRow}
                ></ProductListView>}
              </div>
            </div>
            {showSwitcher && <SwitchFieldPanel dataSource={customFields}
              dataTarget={fields}
              onCloseSwitchDisplay={() => setShowSwitcher(false)}
              onChooseField={(id, isSelected) => onSelectSwitchDisplayField(id, isSelected)}
              onDragField={onDragField}
              fieldBelong={FIELD_BELONG.PRODUCT}
              isAdmin={isAdmin}
            />}
          </div>
        </div>
        {renderToastMessage()}
        <GlobalControlRight />
        {openCategoryPopup &&
          <Modal isOpen={true} fade={true} toggle={() => {
          }} backdrop={true} id="popup-category-edit" autoFocus={true} zIndex="auto">
            <CategoryRegistEdit
              isRegist={isRegistCategory}
              categoryObj={category}
              showModal={showModal}
              onAddNewCategory={() => setOpenCategoryPopup2(true)}
              hasCreateNewCategory2={openCategoryPopup2}
              popupMoveCategory={openPopupMoveCategory}
              setMessage={setMessage}
              toggleClosePopupSettingCondition={closeCategoryPopup} />
          </Modal>
        }
        {openCategoryPopup2 &&
          <Modal isOpen={true} fade={true} toggle={() => {
          }} backdrop={true} id="popup-category-edit" autoFocus={true} zIndex="auto">
            <CategoryRegistEdit
              isRegist={true}
              categoryObj={{}}
              showModal={openCategoryPopup2}
              setMessage={setMessage}
              toggleClosePopupSettingCondition={closeCategoryPopup2} />
          </Modal>
        }

        {openPopupSearch &&
          <PopupFieldsSearch
            iconFunction="ic-product.svg"
            fieldBelong={FIELD_BELONG.PRODUCT}
            fieldNameExtension="product_data"
            conditionSearch={conditionSearch}
            onCloseFieldsSearch={onClosePopupSearch}
            onActionSearch={handleSearchPopup}
            conDisplaySearchDetail={conDisplaySearchDetail}
            setConDisplaySearchDetail={setConDisplaySearchDetail}
            // fields={fieldSearch}
            customFields={customFieldSearch}
            selectedTargetType={selectedTargetType}
            selectedTargetId={selectedTargetId}
          />
        }
        {openPopupProductSet &&
          <PopupProductSet
            iconFunction={"ic-sidebar-product.svg"}
            productId={productIdSelected}
            productIds={productIds}
            onClosePopup={closePopupProductSet}
            onActionCreate={handleCreateProductSet}
          />
        }
        {openPopupEdit &&
          <ModalCreateEditProduct
            iconFunction="ic-sidebar-product.svg"
            productActionType={productActionType}
            productViewMode={productViewMode}
            productId={productId}
            isContainDataSummary={isContainDataSummary}
            isOnlyData={isOnlyData}
            onCloseFieldsEdit={onClosePopupEdit}
            showModal={showModal}
          />
        }
        {openPopupProductDetail &&
          <ProductDetail
            key={productId}
            showModal={true}
            productId={productId}
            toggleClosePopupProductDetail={onClosePopupProductDetail}
            openProductDetailFromOther={openProductDetailFromOther}
            toggleOpenPopupEdit={onOpenPopupEdit}
            productMessageMutation={productSetCreatedSuccessMsg}
            resetSuccessMessage={() => { setProductSetCreatedSuccessMsg(null) }}
            isList={openFromList}
            onPageChangeInDetailScreen={onPageChangeInDetailScreen}
          />
        }
        {openPopupProductSetDetail &&
          <PopupProductSetDetail
            showModal={true}
            productId={productIdSelected}
            // listProductId={getListProductId(true)}
            toggleClosePopupProductSetDetail={onCloseProductSetDetail}
            toggleOpenPopupSetEdit={onOpenPopupSetEdit}
            openProductDetailFromOther={openProductDetailFromOther}
            productSetCreatedSuccessMsg={productSetCreatedSuccessMsg}
            resetSuccessMessage={() => { setProductSetCreatedSuccessMsg(null) }}
            isList={openFromList}
            onPageChangeInDetailScreen={onPageChangeInDetailScreen}
          />
        }
        {openPopupMoveCategory &&
          <Modal isOpen={true} fade={true} toggle={() => {
          }} backdrop={true} id="popup-move-category" autoFocus={true} zIndex="auto">
            <PopupMoveCategory
              setOpenPopupMoveCategory={setOpenPopupMoveCategory}
              handleEventUpdateProductsCategory={handleEventUpdateProductsCategory}
              categories={productCategoryListAll}
              onAddNewCategory={() => setOpenCategoryPopup(true)}
              hideSuggest={openCategoryPopup}
            />
          </Modal>
        }
        <BrowserDirtyCheck isDirty={isDirty && props.screenMode === ScreenMode.EDIT} />
        {showPopupMoveToCategory &&
          <MoveToCategoryPopup
            setShowPopupMoveToCategory={setShowPopupMoveToCategory}
            moveCategory={handleMoveProduct}
          />
        }
        {onOpenPopupSetting && <PopupMenuSet dismissDialog={dismissDialog} />}
      </div>
      {onOpenPopupHelp && <HelpPopup currentCategoryId={CATEGORIES_ID.product} dismissDialog={dismissDialogHelp} />}
    </>
  );
};
const mapStateToProps = ({ productList, dynamicList, categoryRegistEdit, authentication, productDetail, popupFieldsSearch, menuLeft, productControlSidebar }: IRootState) => ({
  authorities: authentication.account.authorities,
  actionDelete: productList.actionDelete,
  fieldInfos: dynamicList.data.has(PRODUCT_LIST_ID) ? dynamicList.data.get(PRODUCT_LIST_ID).fieldInfos : {},
  fieldInfoSearch: popupFieldsSearch.fieldInfos,
  customFieldInfoSearch: popupFieldsSearch.customField,
  customFieldInfos: productList.customFieldInfos,
  products: productList.products,
  actionType: productList.action,
  errorItems: productList.errorItems,
  screenMode: productList.screenMode,
  categories: productList.categories,
  recordCheckList: dynamicList.data.has(PRODUCT_LIST_ID) ? dynamicList.data.get(PRODUCT_LIST_ID).recordCheckList : [],
  moveToCategoryMsg: productList.moveToCategoryMsg,
  isUpdateCategorySuccess: categoryRegistEdit.isUpdateSuccess,
  isCreateCategorySuccess: categoryRegistEdit.isCreateSuccess,
  errorItemsCategory: categoryRegistEdit.errorItems,
  deleteProductsList: productList.deleteProducts,
  deleteProductsDetail: productDetail.deleteProducts,
  errorCodeList: productList.errorCodeList,
  moveToCategoryProductIds: productList.moveToCategoryProductIds,
  initializeInfor: productList.initializeInfor,
  fields: productList.fields,
  msgSuccess: productList.msgSuccess,
  expandMenu: menuLeft.expand,
});

const mapDispatchToProps = {
  getCustomFieldsInfo,
  getProducts,
  handleInitProductList,
  handleSearchProductView,
  handleUpdateProduct,
  changeScreenMode,
  getListProductCategory,
  handleMoveToCategory,
  handleMoveProductsToCategory,
  reset,
  handleDeleteProducts,
  handleFilterProductsByMenu,
  resetMessageSideBar,
  resetMessageList,
  resetMessageCategoryReducer
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductList);
