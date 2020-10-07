import { AUTHORITIES, ControlType, FIELD_BELONG, MODIFY_FLAG, ScreenMode, MAXIMUM_FILE_UPLOAD_MB } from 'app/config/constants';
import CustomDynamicList from '../custom-common/custom-dynamic-list';
import FieldSelectProductCategory from 'app/modules/products/popup/field-select-product-category';
import FieldSelectProductType from 'app/modules/products/popup/field-select-product-type';
import BoxMessage, { MessageType } from 'app/shared/layout/common/box-message';
import TagAutoComplete from 'app/shared/layout/common/suggestion/tag-auto-complete';
import { DEFINE_FIELD_TYPE, DynamicControlAction } from 'app/shared/layout/dynamic-form/constants';
import DynamicControlField from 'app/shared/layout/dynamic-form/control-field/dynamic-control-field';
import { IRootState } from 'app/shared/reducers';
import useEventListener from 'app/shared/util/use-event-listener';
import React, { useEffect, useState, useMemo, createRef, useRef } from 'react';
import { Storage, translate } from 'react-jhipster';
import { connect } from 'react-redux';
import { Modal } from 'reactstrap';
import StringUtils, { forceArray, getFieldLabel } from 'app/shared/util/string-utils';
import { PRODUCT_ACTION_TYPES, PRODUCT_SPECIAL_FIELD_NAMES, PRODUCT_VIEW_MODES, FIELD_TYPE } from '../constants';
import {
  createProductSet,
  getProductDetail,
  getProductSet,
  getProductSetLayout,
  ProductSetAction,
  reset,
  updateProductSet,
  resetMessage
} from './popup-product-set.reducer';
import { hasAnyAuthority } from 'app/shared/auth/private-route';
import { addDefaultLabel, snakeProductField, getExtendfieldValue } from 'app/modules/products/utils';
import SpecialEditList from '../special-item/special-edit-list';
import _ from 'lodash';
import { getValueProp } from 'app/shared/util/entity-utils';
import { FILE_FOMATS } from 'app/shared/layout/dynamic-form/control-field/edit/field-edit-file';
import { isJsonString } from '../utils';
import { TagAutoCompleteType, TagAutoCompleteMode } from 'app/shared/layout/common/suggestion/constants';
import DialogDirtyCheck from 'app/shared/layout/common/dialog-dirty-check';

import { DATE_TIME_FORMAT,  utcToTz } from 'app/shared/util/date-utils';
import { useDetectFormChange } from 'app/shared/util/useDetectFormChange';
import { pluck, uniq }  from 'ramda'
import styled from 'styled-components'
import EmployeeName from 'app/shared/layout/common/EmployeeName';
import * as R from 'ramda'
import { isExceededCapacity } from 'app/shared/util/file-utils';

const DeclareErrorWrapper  = styled.div`
  border:  ${props => props.isError ? '1px solid red' : 'none'};
` 

const ErrorMessages:React.FC<{listErrors:string[]}> = ({listErrors = []}) => {
  return <>{listErrors.map((_errorCode, index) => <div className="color-red" key={index} >{translate(`messages.${_errorCode}`)}</div>)}</>
}



export enum FSActionTypeScreen {
  None,
  RemoveSession,
  SetSession,
  GetSession,
  CloseWindow,
  Search
}

interface IPopupProductSetDispatchProps {
  getProductSetLayout;
  createProductSet;
  getProductSet;
  updateProductSet;
  getProductDetail;
  reset;
  resetMessage
}

interface IPopupProductSetStateProps {
  authorities: any;
  tenant: any;
  action: any;
  fieldInfo: any;
  fieldInfoProductSet: any;
  fieldInfoProduct: any;
  dataInfo: any;
  errorValidates: any;
  successMessage: string;
  isCreateProductSetSuccess: boolean;
  productIdCreated: any;
  products: any;
  errorCode: any;
  errorItems: any
}

interface IPopupProductSetOwnProps {
  popout?: boolean;
  productIds?: any;
  productId?: any;
  onActionCreate?: (productIdCreated, type, delay?) => void;
  onClosePopup: (productId, actionType) => void;
  iconFunction: any;
  showModal?: any
  backdrop?: boolean; // [backdrop:false] when open from popup
  productViewMode?: number;
  fieldPreview?: any
}

type IPopupProductSetProps = IPopupProductSetDispatchProps & IPopupProductSetStateProps & IPopupProductSetOwnProps;



const PopupProductSet: React.FC<IPopupProductSetProps> = props => {
  const [msgErrorReasonInput, setMsgErrorReasonInput] = useState('');
  const [msgSuccess, setMsgSuccess] = useState('');
  const [fields, setFields] = useState([]);
  const [showModal, setShowModal] = useState(props.showModal ? props.showModal : true);
  const [showPopupConfirmUpdate, setShowPopupConfirmUpdate] = useState(false);
  const [forceCloseWindow, setForceCloseWindow] = useState(false);
  const [listProduct, setListProduct] = useState([]);
  const [dataSubmitt, setDataSubmitt] = useState(null);
  const [productSetInfoRes, setProductSetInfoRes] = useState(null);
  const [productCategoryId, setProductCategoryId] = useState();
  const [productTypeId, setProductTypeId] = useState();
  const [isDisplay, setIsDisplay] = useState(true);
  const [fieldUse, setFieldUse] = useState(null);
  const [productCategories, setProductCategories] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [reasonEdit, setReasonEdit] = useState('');
  const [deletedProductSets, setDeletedProductSets] = useState([]);
  const isAdmin = hasAnyAuthority(props.authorities, [AUTHORITIES.ADMIN]);
  // const [listFileDefault, setListFileDefault] = useState([]);
  const [fileUploads, setFileUploads] = useState([]);
  const [isDeleteImage, setIsDeleteImage] = useState(false);
  const [listFieldNormal, setListFieldNormal] = useState([]);
  const [listFieldTab, setListFieldTab] = useState([]);
  const [saveEditValues, setSaveEditValues] = useState([]);
  const [isChangeSuggest, setIsChangeSuggest] = useState(false);
  const [isAutoChange, setIsAutoChange] = useState(true);
  const [fieldIdUnitPrice, setFieldIdUnitPrice] = useState();
  const tagAutoCompleteRef = useRef(null);
  const [tmpProductSet, setTmpProductSet] = useState(null)
  const [autofocusField, setAutofocusField] = useState(0);
  const [productIdState, setProductIdState] = useState(props.productId ? props.productId : null);
  const [msgError, setMsgError] = useState("");
  const formId = "form-product-set-edit-43ew"
  const [ isChanged ] = useDetectFormChange(formId)

  const productActionType = productIdState ? PRODUCT_ACTION_TYPES.UPDATE : PRODUCT_ACTION_TYPES.CREATE;

  const updateStateSession = (mode: FSActionTypeScreen) => {
    if (mode === FSActionTypeScreen.SetSession) {
      Storage.local.set(PopupProductSet.name, {
        listProduct,
        msgSuccess,
        fields,
        productSetInfoRes,
        productCategoryId,
        productTypeId,
        isDisplay,
        productIdState,
        productIds: props.productIds
      });
    } else if (mode === FSActionTypeScreen.GetSession) {
      const saveObj = Storage.local.get(PopupProductSet.name);
      if (saveObj) {
        setProductCategoryId(saveObj.productCategoryId);
        setProductTypeId(saveObj.productTypeId);
        setIsDisplay(saveObj.isDisplay);
        setListProduct(saveObj.listProduct || []);
        setProductSetInfoRes(saveObj.productSetInfoRes);
        setMsgSuccess(saveObj.msgSuccess);
        setFields(saveObj.fields);
        setProductIdState(saveObj.productSetInfoRes?.productId || saveObj.productIdState)
      }
    } else if (mode === FSActionTypeScreen.RemoveSession) {
      Storage.local.remove(PopupProductSet.name);
    }
  };

  /**
   * show message error when submit
   */
  const setMessageError = () => {
    if (props.errorValidates) {
      for (const errorItem of props.errorValidates) {
        if (errorItem.errorCode === "ERR_COM_0073" || errorItem.errorCode === "ERR_COM_0050" || errorItem.errorCode === "ERR_TOD_0001") {
          const msg = translate('messages.' + errorItem.errorCode, errorItem.errorParams ? errorItem.errorParams : null);
          setMsgError(msg);
          break;
        }
      }
      return;
    }
  }

  useEffect(() => {
    if (props.popout) {
      updateStateSession(FSActionTypeScreen.GetSession);
      setShowModal(false);
      setForceCloseWindow(false);
    } else {
      setShowModal(true);
    }
    return () => {
      // updateStateSession(FSActionTypeScreen.RemoveSession);
    };
  }, []);

  useEffect(() => {
    if (productActionType === PRODUCT_ACTION_TYPES.UPDATE) {
      props.getProductSet({ productId: productIdState });
    } else {
      const saveObj = Storage.local.get(PopupProductSet.name);
      props.getProductSetLayout(props.productIds || saveObj.productIds);
    }
    return () => {
      props.reset();
    };
  }, [productIdState]);

  useEffect(() => {
    if (props.popout) {
      setShowModal(false);
      setForceCloseWindow(false);
    }
  });

  useEffect(() => {
    if (props.action === ProductSetAction.Success){

        if(props.popout){
          const message = {
              type: FSActionTypeScreen.CloseWindow,
              forceCloseWindow: true,
              id: props.productIdCreated || productIdState,
              flag:  productActionType,
              isSet: true
            }
              window.opener.postMessage(message)
         window.close()
      }
      else if (props.action === ProductSetAction.Error) {
        setMessageError();
      } else {
        props.isCreateProductSetSuccess && props.onActionCreate(props.productIdCreated, productActionType, 500);
        props.onClosePopup(props.productIdCreated, productActionType);
      }
    }
  }, [props.productIdCreated]);

  useEffect(() => {
    if (props.fieldInfoProduct) {
      const fieldsList = props.fieldInfoProduct
        .sort((a, b) => a.fieldOrder - b.fieldOrder)
        .map(field => {
          if (field && field.fieldLabel && isJsonString(field.fieldLabel)) {
            switch (field.fieldName) {
              case 'product_id':
                field.fieldLabel = JSON.stringify(addDefaultLabel(translate('products.detail.label.product.id')));
                break;
              case 'product_name':
                field.fieldLabel = JSON.stringify(addDefaultLabel(translate('products.detail.label.product.name')));
                break;
              case 'product_image_name':
                field.fieldLabel = JSON.stringify(addDefaultLabel(translate('products.detail.label.product.imagename')));
                break;
              case 'product_type_id':
                field.fieldLabel = JSON.stringify(addDefaultLabel(translate('products.detail.label.product.typeid')));
                break;
              case 'unit_price':
                field.fieldLabel = JSON.stringify(addDefaultLabel(translate('products.detail.label.product.unitprice')));
                break;
              default:
                break;
            }
          }
          return field;
        });
      setFields(fieldsList);
    }
  }, [props.fieldInfoProduct]);

  const inputRefs = useMemo(() => Array.from({ length: fields.length }).map(() => createRef<any>()), [fields]);

  const indexRef = field => {
    return fields.findIndex(e => e.fieldId === field.fieldId);
  };

  useEffect(() => {
    if (props.dataInfo) {

      !props.popout && setListProduct(_.cloneDeep(props.dataInfo.products) || []);
      setProductCategories(props.dataInfo.productCategories || []);
      setProductTypes(props.dataInfo.productTypes || []);
      if (props.dataInfo.productSet) {
        const infoRes = props.dataInfo.productSet;
        if (props.dataInfo.productSet.productData) {
          const productDataJson = _.cloneDeep(props.dataInfo.productSet.productData);
          productDataJson.forEach(data => infoRes[StringUtils.snakeCaseToCamelCase(data.key)] = data.value);
        }
        setProductCategoryId(infoRes.productCategoryId);
        setIsDisplay(infoRes.isDisplay);
        setProductTypeId(infoRes.productTypeId);
        if (infoRes.productTypeId && props.dataInfo.productTypes) {
          const type = props.dataInfo.productTypes.find(types => types.productTypeId.toString() === infoRes.productTypeId.toString());
          if (type && type.fieldUse) {
            setFieldUse(JSON.parse(type.fieldUse));
          }
        } else {
          setFieldUse(null);
        }
        setProductSetInfoRes(infoRes);
      }
    }
  }, [props.dataInfo]);
  useEffect(() => {
    setMsgSuccess(props.successMessage);
  }, [props.successMessage]);

  const handlePopupConfirmUpdate = () => {
    setShowPopupConfirmUpdate(true);
    setShowModal(false);
  };

  const onCancelConfirmPopup = () => {
    setShowModal(true);
    setShowPopupConfirmUpdate(false);
  };

  useEffect(() => {
    if (props.errorValidates) {
      props.errorValidates.map(e => {
        if (e.item === 'data.listProduct') {
          onCancelConfirmPopup();
        } else if (e.item === 'reasonEdit') {
          setMsgErrorReasonInput(translate(`messages.${e.errorCode}`, reasonEdit));
        } else {
          onCancelConfirmPopup();
        }
      });
    }
  }, [props.errorValidates]);

  // const isChangeValue = () => {
  //   let change = false;
  //   if (deletedProductSets.length > 0 || isChangeSuggest) {
  //     change = true;
  //   }
  //   if (!props.dataInfo.productSet) {
  //     const arrChange = Object.values(productSetInfoRes);
  //     arrChange.forEach(x => {
  //       if (x) {
  //         change = true;
  //       }
  //     });
  //   }
  //   return change;
  // };

  // true = khong thay doi
  // false = co thay doi
  // const handleCompare = () => {
  //   const listFieldCompare = ['productName', 'unitPrice', 'productData', 'memo']
  //   // before data
  //   const beforeData = _.pick(tmpProductSet, listFieldCompare)
  //   const beforeListProduct = props.dataInfo.products
  //   // after data
  //   const afterData = _.pick(productSetInfoRes, listFieldCompare)
  //   const afterListProduct = listProduct
  //   afterData.unitPrice = Number(afterData.unitPrice)

  //   const compareCommonData = _.isEqual(beforeData, afterData)
  //   const compareListProduct = _.isEqual(beforeListProduct, afterListProduct)
  //   return compareCommonData && compareListProduct && !isDeleteImage && !tmpProductSet.isUpload
  // }

  const executeDirtyCheck = async (action: () => void, cancel?: () => void) => {
    if (isChanged) {
      await DialogDirtyCheck({ onLeave: action, onStay: cancel, partternType: 1 });
    } else {
      action();
    }
  };

  useEffect(() => {
    const productSet = props.dataInfo?.productSet || {}
    if (productSet.productName && productSet.unitPrice) {
      // const name = productSet.productName
      const { productName, unitPrice } = productSet
      setTmpProductSet({ ...productSet, productName, unitPrice })
    }
  }, [props.dataInfo?.productSet])

  const handleClosePopup = () => {
    if (props.productViewMode === PRODUCT_VIEW_MODES.PREVIEW) {
      props.onClosePopup(null, productActionType);
      return
    }
    executeDirtyCheck(() => {
      props.onClosePopup(productSetInfoRes ? productSetInfoRes.productId : null, productActionType);
    });
  };

  useEffect(() => {
    setMsgError(props.errorCode)
  }, [props.errorCode])

  const displayMessage = () => {
    if (!msgError) {
      return <></>;
    } else {
      return (
        <>
          <BoxMessage messageType={MessageType.Error} message={translate(`${`messages.` + msgError}`)} />
        </>
      );
    }
  };

  const openNewWindow = () => {
    updateStateSession(FSActionTypeScreen.SetSession);
    setShowModal(false);
    setForceCloseWindow(false);
    const height = screen.height * 0.8;
    const width = screen.width * 0.6;
    const left = screen.width * 0.2;
    const top = screen.height * 0.2;
    const style = `width=${width},height=${height},left=${left},top=${top}`;
    window.open(`${props.tenant}/create-edit-product-set`, '', style.toString());
    props.onClosePopup(productSetInfoRes ? productSetInfoRes.productId : null, productActionType);
  };

  const handleBackPopup = () => {
    if (props.popout) {
      updateStateSession(FSActionTypeScreen.SetSession);
      setForceCloseWindow(true);
    } else {
      handleClosePopup();
    }
  };

  const createExtItem = (item, val) => {
    const isArray = Array.isArray(val);
    const itemValue = isArray ? JSON.stringify(val) : val ? val.toString() : '';
    return {
      fieldType: item.fieldType.toString(),
      key: item.fieldName,
      value: itemValue
    };
  };

  const addToProductData = (addItem, saveData) => {
    if (saveData['productData']) {
      let notInArray = true;
      saveData['productData'].map((e, index) => {
        if (e.key === addItem.key) {
          notInArray = false;
          saveData[StringUtils.snakeCaseToCamelCase(addItem.key)] = addItem;
          saveData['productData'][index] = addItem;
        }
      });
      if (notInArray) {
        saveData['productData'].push(addItem);
      }
    } else {
      saveData['productData'] = [addItem];
    }
  };

  const onChangeTotalPrice = (totalPrice) => {
    if (isAutoChange) {
      if (isAutoChange && fieldIdUnitPrice) {
        const idxRef = fields.findIndex(e => e.fieldId === fieldIdUnitPrice);
        if (!idxRef) return
        if (inputRefs.length > 0 && inputRefs[idxRef]?.current) {
          if (totalPrice) {
            inputRefs[idxRef].current.setValueEdit(totalPrice)
          } else {
            inputRefs[idxRef].current.setValueEdit(0)
          }
        }
      }
    }
  }

  const addExtendField = (item, val, saveData) => {
    let addItem = null;
    if (item.fieldType.toString() === DEFINE_FIELD_TYPE.LOOKUP) {
      addItem = [];
      const arrVal = forceArray(val);
      arrVal.forEach(obj => {
        addItem.push(createExtItem(obj.fieldInfo, obj.value));
      });
    } else {
      addItem = createExtItem(item, val);
    }
    if (Array.isArray(addItem)) {
      addItem.forEach(addIt => {
        addToProductData(addIt, saveData);
      });
    } else {
      addToProductData(addItem, saveData);
    }
  };
  // const [initListProducts, setInitListProducts] = useState([])
  // const [statementDataChange, setStatementDataChange] = useState([])
  // const [loaded, setLoaded] = useState(false)

  // useEffect(() => {
  //   if(props.fieldInfoProduct &&  props.fieldInfoProductSet){
  //       setTimeout(() => {
  //         setLoaded(true)
  //       }, 500);
  //   }
  // }, [props.fieldInfoProduct, props.fieldInfoProductSet])


  // const {getDataChange, setDataChange, resetDataChange} = useRecordChangeData(loaded)

  const updateStateField = (item, type, value) => {
    if (props.productViewMode === PRODUCT_VIEW_MODES.PREVIEW) return;
    // setDataChange(item.fieldId, value)
    let field = null;
    let val = value
    if (type === "9" && value) {
      val = value.trim()
    }
    fields.forEach(f => {
      if (f.fieldId.toString() === item.fieldId.toString()) {
        field = f;
      }
    });
    if (field.fieldName === "unit_price") {
      setFieldIdUnitPrice(item.fieldId)
    }
    if (productSetInfoRes !== null && productSetInfoRes !== undefined && field) {
      if (_.isEqual(DEFINE_FIELD_TYPE.LOOKUP, _.toString(type))) {
        const valueLookup = _.isArray(val) ? val : _.toArray(val);
        valueLookup.forEach(e => {
          const idx = fields.findIndex(o => o.fieldId === e.fieldInfo.fieldId);
          if (idx >= 0) {
            const idxRef = indexRef(fields[idx]);
            if (inputRefs[idxRef] && inputRefs[idxRef].current && inputRefs[idxRef].current.setValueEdit) {
              inputRefs[idxRef].current.setValueEdit(e.value);
            }
          }
        });
      } else if (field.isDefault) {
        if (field.fieldName === PRODUCT_SPECIAL_FIELD_NAMES.productImageName) {
          let fileUpdate = null;
          val && val.length > 0 && (fileUpdate = val[0]);
          if (fileUpdate && fileUpdate.status === 1) {
            setIsDeleteImage(true);
          }
          if (val && val.length > 0) {
            productSetInfoRes.productImageName = val[0].fileName;
          }
        } else {
          productSetInfoRes[StringUtils.snakeCaseToCamelCase(field.fieldName)] = val;
        }
        setProductSetInfoRes(_.cloneDeep(productSetInfoRes));
      } else {
        addExtendField(field, val, productSetInfoRes);
        setProductSetInfoRes(_.cloneDeep(productSetInfoRes));
      }
    } else {
      const newObject = {};
      newObject[StringUtils.snakeCaseToCamelCase(item.fieldName)] = val;
      setProductSetInfoRes(newObject);
    }
    // const field = fields.find(f => f.fieldId.toString() === item.fieldId.toString());
    // if (field) {
    //   if (field.fieldName === PRODUCT_SPECIAL_FIELD_NAMES.productImageName) {
    //     let fileUpdate = null;
    //     (val && val.length > 0) && (fileUpdate = val[0]);
    //     if (fileUpdate && fileUpdate.status === 1) {
    //       setIsDeleteImage(true);
    //     }
    //     if(val && val.length > 0){
    //       productSetInfoRes.productImageName = val[0].fileName
    //     }
    //   }else if (!productSetInfoRes) {
    //     const newObj = {};
    //     newObj[StringUtils.snakeCaseToCamelCase(field.fieldName)] = val ? val : null;
    //     setProductSetInfoRes(newObj);
    //   } else {
    //     productSetInfoRes[StringUtils.snakeCaseToCamelCase(field.fieldName)] = val ? val : null;
    //   }
    // }
  };

  // const fomatFieldValue = (field, value) => {
  //   if (field.fieldType === DEFINE_FIELD_TYPE.CHECKBOX || field.fieldType === DEFINE_FIELD_TYPE.MULTI_SELECTBOX) {
  //     // get keys with value is true
  //     const values = [];
  //     const keysWithValueIsTrue = Object.keys(value).filter(key => value[key] === true);
  //     keysWithValueIsTrue.forEach(trueKey => {
  //       values.push(trueKey);
  //     });
  //     return values;
  //   }
  //   return value;
  // };

  // const getExtendfieldValue = (extendFieldList, fieldName) => {
  //   if (!extendFieldList) {
  //     return undefined;
  //   }
  //   let retField = null;
  //   extendFieldList.map(field => {
  //     if (field.key === fieldName) {
  //       retField = field;
  //     }
  //   });
  //   if (retField) {
  //     return retField.value;
  //   }
  //   return undefined;
  // };

  const getDataStatusControl = item => {
    if (item.fieldType.toString() === DEFINE_FIELD_TYPE.CALCULATION) {
      return { fieldValue: snakeProductField(productSetInfoRes) };
    }
    if (item.fieldName === PRODUCT_SPECIAL_FIELD_NAMES.productImageName) {
      if (productSetInfoRes && productSetInfoRes.productImageName) {
        const fieldValue = [
          {
            status: 0,
            fileName: productSetInfoRes.productImageName,
            filePath: productSetInfoRes.productImagePath,
            fileUrl: productSetInfoRes.productImagePath
          }
        ];
        return {
          fieldType: item.fieldType,
          key: item.fieldName,
          fieldValue: JSON.stringify(fieldValue)
        };
      }
    }
    let saveData = null;
    if (productSetInfoRes !== undefined && productSetInfoRes !== null && Object.keys(productSetInfoRes).length > 0) {
      saveData = productSetInfoRes;
    }
    if (saveData) {
      let fieldValue;
      if (item.isDefault) {
        fieldValue = saveData[StringUtils.snakeCaseToCamelCase(item.fieldName)];
      } else if (saveData['productData'] !== undefined) {
        // extend field is in node 'productData'
        fieldValue = getExtendfieldValue(saveData['productData'], item.fieldName);
      }

      if (fieldValue !== undefined) {
        const dataStatus = { ...item };
        dataStatus.fieldValue = fieldValue;
        return dataStatus;
      }
    }
    return null;
  };

  const getFileUploads = () => {
    const fUploads = [];
    const keyFiles = Object.keys(fileUploads);
    keyFiles.forEach(key => {
      const arrFile = fileUploads[key];
      arrFile.forEach(file => {
        fUploads.push(file);
      });
    });
    return fUploads;
  };

  const onAgreeConfirmPopup = () => {
    productSetInfoRes.reasonEdit = reasonEdit;
    dataSubmitt.reasonEdit = reasonEdit;
    props.updateProductSet(dataSubmitt, getFileUploads());
  };

  const handleReasonInput = event => {
    setReasonEdit(event.target.value);
  };
  const isFieldUser = item => {
    if (item.fieldId) {
      return !fieldUse || fieldUse[item.fieldId.toString()] !== 0;
    }
    return false;
  };

  const compareChange = (dataSave, dataInit) => {
    let hasChange = false;

    _.keys(dataSave).forEach(key => {
      if (dataSave[key] && dataInit[key]) {
        if (key === 'productSetData') {
          if (!_.isEqual(dataSave[key].filter(data => { return data.value }), dataInit[key].map(data => { data.fieldType = Number(data.fieldType); return data }))) return hasChange = true;
        } else {
          if ((dataSave[key] !== dataInit[key])) {
            return hasChange = true;
          }
        }
      } else if (!dataSave[key] && dataInit[key]) {
        return hasChange = true;
      } else if (dataSave[key] && !dataInit[key]) {
        return hasChange = true;
      }
    });

    return {
      check: hasChange,
      isNew: false,
    };
  }

  const checkChangeProductOfSet = productOfSet => {
    if (!productOfSet) return {
      check: false,
      isNew: false,
    };
    const existProduct = props.dataInfo && props.dataInfo.products ? props.dataInfo.products.map(function (_product) { return _product.productId; }).indexOf(productOfSet.productId) : -1;
    const existProductDelete = deletedProductSets ? deletedProductSets.map(function (productDelete) { return productDelete.productId; }).indexOf(productOfSet.productId) : -1;

    if (existProduct === -1 || (productActionType === PRODUCT_ACTION_TYPES.CREATE) || (existProduct !== -1 && existProductDelete !== -1)) {
      return {
        check: true,
        isNew: true
      };
    } else {
      return compareChange(productOfSet, props.dataInfo.products[existProduct]);
    }
  };

  

  const handleDataByFieldType = (fieldType, fieldData) => {
    let value = "";

    if(!fieldData) return value;
    if(_.toString(fieldType) === FIELD_TYPE.NUMBER) {
      value = fieldData ? fieldData : "0";
    } else{
      value = !_.isNil(fieldData) ? fieldData : '';
      if(_.isArray(fieldData)){
        if(!fieldData.length){
          value = "[]";
        } else{
          value = JSON.stringify(value);
        }
      }
      if(_.toString(fieldType) === FIELD_TYPE.FILE && _.isNil(fieldData)){
        value = "[]";
      }
    }
    return value;
  };

  const getValueExtension = listProductsData => {
    const listProducts = _.cloneDeep(listProductsData);
    const listProductRequest = [];

    if (props.fieldInfoProductSet && listProductsData && saveEditValues) {
      listProducts.forEach(_product => {
        const currentProduct = {};
        const productSetData = [];
        
        currentProduct['productId'] = _product.productId;
        currentProduct['productName'] = _product.productName;
        currentProduct['quantity'] = _product.quantity;
        
        saveEditValues.forEach(values => {
          if (_product.productId === values.itemId) {
            const fieldInfo = props.fieldInfoProductSet[props.fieldInfoProductSet.map(function (field) { return field.fieldId; }).indexOf(values.fieldId)];
            if (fieldInfo) productSetData.push({
              key: fieldInfo.fieldName,
              value: handleDataByFieldType(fieldInfo.fieldType, values.itemValue),
              fieldType: fieldInfo.fieldType
            });
          }
        });

        currentProduct['productSetData'] = productSetData;
        const checked = checkChangeProductOfSet(currentProduct);

        if (checked.check) {
          currentProduct['hasChange'] = true;
        }
        if (!checked.isNew) {
          currentProduct['setId'] = props.productId;
          currentProduct['updatedDate'] = _product.updatedDate;
        }
        listProductRequest.push(currentProduct);
      });
    }
     return listProductRequest;
  };

  const handleSubmit = () => {
    props.resetMessage()
    const files = getFileUploads();
    if (event && isExceededCapacity(files)) {
      setMsgError("ERR_COM_0033");
      return;
    } else if (event) {
      setMsgError('');
    }
    const dataSubmit:any = {
      productData: productSetInfoRes['productData']
    };
    
    fields.forEach(field => {
      if(isFieldUser(field)){
        if (field.isDefault) {
          dataSubmit[StringUtils.snakeCaseToCamelCase(field.fieldName)] = isFieldUser(field)
            ? productSetInfoRes[StringUtils.snakeCaseToCamelCase(field.fieldName)]
            : null;
        }
      } else{
        delete  dataSubmit[StringUtils.snakeCaseToCamelCase(field.fieldName)]
      }
    });

    if (productSetInfoRes['isDisplay'] === null || productSetInfoRes['isDisplay'] === undefined) {
      dataSubmit['isDisplay'] = true;
    }

    dataSubmit['listProduct'] = getValueExtension(listProduct);
    delete dataSubmit['createdDate'];
    delete dataSubmit['createdUser'];
    delete dataSubmit['updatedUser'];
    delete dataSubmit['updatedDate'];
    delete dataSubmit['productImageName'];

    if (productActionType === PRODUCT_ACTION_TYPES.UPDATE) {
      dataSubmit['deletedProductSets'] = R.clone(deletedProductSets);
      dataSubmit['productId'] = R.clone(productSetInfoRes.productId);
      dataSubmit['updatedDate'] = R.clone(productSetInfoRes.updatedDate);
      dataSubmit['isDeleteImage'] = R.clone(isDeleteImage);
     
     
      setDataSubmitt(dataSubmit);
      handlePopupConfirmUpdate();
    } else {
      props.createProductSet(dataSubmit, getFileUploads());
    }

    return dataSubmit
  };

  // const isFieldDefault = item => {
  //   return DEFAULT_FIELD_NAMES.includes(item.fieldName);
  // };

  const getErrorInfo = item => {
    let errorInfo = null;
    props.errorValidates &&
      props.errorValidates.forEach(elem => {
        const fieldName = item.fieldName;
        if (StringUtils.equalPropertyName(elem.item, fieldName)) {
          errorInfo = elem;
        } else if(item.fieldType.toString() === DEFINE_FIELD_TYPE.RELATION ){
          const relationId = StringUtils.tryGetAttribute(item, "relationData.fieldId");
          if(relationId && (_.toString(elem.item) === _.toString(relationId) || _.toString(elem.errorParams) === _.toString(relationId))){
            errorInfo = elem;
          }
        }
      });
    return errorInfo;
  };

  const handleIsDisplayChange = (item, event) => {
    // setDataChange(item.fieldId, event.target.checked)
    setIsDisplay(event.target.checked);
    productSetInfoRes['isDisplay'] = event.target.checked;
  };

  /* sao ke */
  const handleListProductDataChange = data => {
    listProduct[data.idx].quantity = data.quantity;
    setListProduct(_.cloneDeep(listProduct));
  };

  const handleDeleteItem = (idx, id) => {
    const productSet = listProduct[idx];
    const arr = []
    if (props.dataInfo.products && props.dataInfo.products.length > 0) {
      props.dataInfo.products.forEach(_product => {
        arr.push(_product.productId)
      })
    }
    const existProduct = arr.includes(productSet.productId)
    if (productSet && productSet.productId && existProduct && props.dataInfo && props.dataInfo.productSet && props.dataInfo.productSet.productId) {
      const index = deletedProductSets.findIndex(item => item.setId === props.dataInfo.productSet.productId && item.productId === productSet.productId);
      if (index === -1) {
        setDeletedProductSets([...deletedProductSets, { setId: props.dataInfo.productSet.productId, productId: productSet.productId }]);
        // deletedProductSets.push({ setId: props.dataInfo.productSet.productId, productId: productSet.productId });
      }
    }
    tagAutoCompleteRef.current.deleteTag(idx, id);
    listProduct.splice(idx, 1);

    tagAutoCompleteRef.current.deleteTag(idx, id);
    setIsChangeSuggest(true)
    setListProduct(_.cloneDeep(listProduct));
  };
 



  // useEffect(() => {
  //   if(loaded){
  //     try {
  //       const dataSmit:any  = handleSubmit(false)
  //       setInitListProducts(dataSmit.listProduct)
  //     } catch (error) {
  //       setInitListProducts([])
  //     }
  //   }
  // }, [loaded])
  

  const getChangeProductSet = (oldProductSet: Array<{key, value, fieldType}>, newProductSet: Array<{key, value, fieldType}>) => {
      const objProductSetChanged = {}

      newProductSet.forEach(_product=> {
        const oldData = R.find(R.propEq('key', _product.key), oldProductSet) 
        const oldValue  = R.tryCatch(R.prop('value'), () => null)(oldData)
        const newValue = _product.value
        if(!R.equals(oldValue, newValue)){
          objProductSetChanged[_product.key] = {newValue, oldValue}
        }
      })
      return objProductSetChanged
  }

  const getChangeProduct = (oldProduct, newProduct) => {

    const listOmit = ["productSetData"]

    // {a:1,b:2,productSetData:3 } => [[a, 1], [b,2]]
    const toPairsDataAndOmitDataRedundancy = R.compose(R.toPairs, R.omit(listOmit))

    // need convert old and new data to array data
    const oldDataPaired = toPairsDataAndOmitDataRedundancy(oldProduct)
    const newDataPaired = toPairsDataAndOmitDataRedundancy(newProduct)

    // get data difference in 2 array oldDataPaired and newDataPaired
    const newDataChanged:any[] =  R.difference(newDataPaired, oldDataPaired)

    const arrayDataChanged = newDataChanged.map(([fieldName, newValue]) => {
      const oldValue = oldProduct[fieldName]
      return [fieldName, {new: newValue, old: oldValue}]
    })

    // [[a, 1], [b,2]] => {a:1, b:2}
    const objDataChanged = R.fromPairs(arrayDataChanged)
    return objDataChanged
  }
  

 

  // useEffect(() => {
  //   try {
  //     const listProducts = dataSubmitt.listProduct

  //     const initProductIds = R.pluck('productId', initListProducts)
  //     const productIds = R.pluck('productId', listProducts)

  //     const listIdProductAdded = R.difference(productIds, initProductIds)
  //     const listIdProductRemoved = R.difference(initProductIds, productIds)


  //     const addAndEditStatementData = listProducts.map(newProduct => {
  //       if (listIdProductAdded.includes(newProduct.productId)) {
  //         return { action: 1, "product_name": newProduct.productName, }
  //       }

  //       const oldProduct =   R.find(R.propEq("productId", newProduct.productId))(initListProducts)
  //       const oldProductSet =  R.prop('productSetData', oldProduct)

  //       return ({
  //         action: 2,
  //         "product_name": newProduct.productName,
  //         "product_set_data": getChangeProductSet(oldProductSet, newProduct.productSetData),
  //         ...getChangeProduct(oldProduct  , newProduct)
  //       })
  //     })

  //     const removeStatementData = listIdProductRemoved.map(_id => ({
  //       action: 0,
  //       "product_name": R.compose(R.prop('productName'), R.find(R.propEq("productId", _id)))(initListProducts)
  //     }))

  //     const newStatementDataChange = [...addAndEditStatementData, ...removeStatementData]  
  //      setStatementDataChange(newStatementDataChange)

  //   } catch (error) {
  //     console.warn(error)
  //   }

  // }, [dataSubmitt])
 

  const onUpdateFieldValue = (itemData, type, itemEditValue) => {
 

    const index = saveEditValues.findIndex(
      e => e.itemId.toString() === itemData.itemId.toString() && e.fieldId.toString() === itemData.fieldId.toString()
    );
    if (index < 0) {
      saveEditValues.push({ itemId: itemData.itemId, fieldId: itemData.fieldId, itemValue: itemEditValue });
    } else {
      saveEditValues[index] = { itemId: itemData.itemId, fieldId: itemData.fieldId, itemValue: itemEditValue };
    }
    
    setSaveEditValues([...saveEditValues])
    
  };

  const renderCellSpecial = (field, rowData, mode, nameKey) => {
    const cellId = `dynamic_cell_${getValueProp(rowData, nameKey)}_${field.fieldId}`;
    if (field.fieldName === PRODUCT_SPECIAL_FIELD_NAMES.createBy || field.fieldName === PRODUCT_SPECIAL_FIELD_NAMES.updateBy) {
      return (
        <div id={cellId} className="break-spaces">
          {rowData[field.fieldName]}
        </div>
      );
    } else if (field.fieldName === PRODUCT_SPECIAL_FIELD_NAMES.productsSets) {
      if (rowData[PRODUCT_SPECIAL_FIELD_NAMES.productsSets]) {
        return (
          <div id={cellId} className="break-spaces">
            {rowData[PRODUCT_SPECIAL_FIELD_NAMES.productsSets].map((item, idx) => {
              if (idx < rowData[PRODUCT_SPECIAL_FIELD_NAMES.productsSets].length - 1) {
                return <a>{item.productName}, </a>;
              } else {
                return <a>{item.productName}</a>;
              }
            })}
          </div>
        );
      }
    } else {
      return (
        <SpecialEditList
          valueData={rowData}
          itemData={field}
          extensionsData={() => { }}
          updateStateField={onUpdateFieldValue}
          nameKey={nameKey}
          mode={mode}
        />
      );
    }
  };
  /* end sao ke */

  const onProductCategoryChange = (item, value) => {
    // resetDataChange(item.fieldId, value)
    setProductCategoryId(value);
    productSetInfoRes && (productSetInfoRes['productCategoryId'] = value);
  };

  const onProductCategoryChangeItem = value => { };

  const onProductTypeChange = (item, value) => {
    // console.log("listProductOfSet", listProduct);
    if (value === productTypeId) return
    // setDataChange(item.fieldId, value)
    productSetInfoRes && (productSetInfoRes['productCategoryId'] = null);
    productSetInfoRes && (productSetInfoRes['productTypeId'] = value);
    if (value) {
      const type = productTypes.find(types => types.productTypeId.toString() === value.toString());
      if (type && type.fieldUse) {
        setFieldUse(JSON.parse(type.fieldUse));
      }
    } else {
      setFieldUse(null);
    }
    inputRefs.forEach(ref => {
      if (ref.current) ref.current.resetValue();
    });
    listProduct.forEach(() => {
      tagAutoCompleteRef.current.deleteTag(0);
    })
    setListProduct([])
    setProductCategoryId(null);
    setProductTypeId(value);
    setIsDeleteImage(true);
  };

  useEffect(() => {
    if (forceCloseWindow) {
      if (props.popout) {
        window.opener.postMessage(
          {
            type: FSActionTypeScreen.CloseWindow,
            forceCloseWindow: true
          },
          window.location.origin
        );
        Storage.session.set('forceCloseWindow', true);
        window.close();
      } else {
        handleClosePopup();
      }
    }
  }, [forceCloseWindow]);
  // let updateDate = null;
  // if (props.dataInfo && props.productId) {
  //   updateDate = props.dataInfo.productSet.updatedDate;
  // }
  // let createDate = null;
  // if (props.dataInfo && props.productId) {
  //   createDate = props.dataInfo.productSet.createdDate;
  // }
  const onBeforeUnload = ev => {
    if (props.popout && !Storage.session.get('forceCloseWindow')) {
      window.opener.postMessage(
        {
          type: FSActionTypeScreen.CloseWindow,
          forceCloseWindow: false
        },
        window.location.origin
      );
    }
  };

  const onReceiveMessage = ev => {
    if (!props.popout) {
      if (ev.data.type === FSActionTypeScreen.CloseWindow) {
        updateStateSession(FSActionTypeScreen.GetSession);
        updateStateSession(FSActionTypeScreen.RemoveSession);
        if (ev.daforceCloseWindow) {
          setShowModal(true);
        } else {
          props.onClosePopup(productSetInfoRes ? productSetInfoRes.productId : null, productActionType);
        }
      } else if (ev.data.type === FSActionTypeScreen.Search) {
        updateStateSession(FSActionTypeScreen.GetSession);
        updateStateSession(FSActionTypeScreen.RemoveSession);
      }
    }
  };

  if (props.popout) {
    useEventListener('beforeunload', onBeforeUnload);
  } else {
    useEventListener('message', onReceiveMessage);
  }

  const onActionSelectTag = (id: any, type: TagAutoCompleteType, mode: TagAutoCompleteMode, listTag: any[]) => {
    if (mode === TagAutoCompleteMode.Multi) {
      // const listProductItem = _.cloneDeep(listProduct);
      listTag.forEach((element, idx) => {
        props.getProductDetail(element.productId);
        // if (listProductItem.findIndex(item => item.productId === element.productId) < 0) {
        //   props.getProductDetail(element.productId);
        // }
      });
    } else {
      if (listTag) {
        // console.log(listTag)
        // const listProductTem = _.cloneDeep(listTag);
        // listTag.forEach((element, idx) => {
        //   if (element.productId === listProductTem[idx]) {
        //     listProductTem[idx].quantity = element.amount
        //   }
        // });
        // setListProduct(listProductTem);
        const _product = listTag[listTag.length - 1];
        props.getProductDetail(_product.productId);
      }
    }
  };

  const baseUrl = window.location.origin.toString();
  const getIconFunction = () => {
    if (!props.iconFunction) {
      return <></>;
    } else {
      return <img className="icon-group-user" src={baseUrl + `/content/images/${props.iconFunction}`} alt="" />;
    }
  };

  /**
   * event update list files
   * @param file
   * @param fieldName
   */
  // const updateFileData = (file, fieldName) => {
  //   if (productSetInfoRes !== null && productSetInfoRes !== undefined) {
  //     productSetInfoRes[fieldName] = StringUtils.emptyStringIfNull(file);
  //   } else {
  //     const newObject = {};
  //     newObject[fieldName] = StringUtils.emptyStringIfNull(file);
  //     setProductSetInfoRes(newObject);
  //   }
  // }

  // const updateFileDefaultChange = (listFileDef) => {
  //   if (listFileDef) {
  //     setIsDeleteImage(true);
  //   }
  // }

  useEffect(() => {
    if (_.isArray(props.products) && props.products.length > 0) {
      const _products = _.clone(props.products);
      const list = _.cloneDeep(listProduct)
    
      _products.forEach(_product => {
        // const condition = e => e.productId === _product.productId
        const item = list.find(e => e.productId === _product.productId);
        if(!item){
          list.push({..._product, quantity: _product.quantity || 1})
          // if (!_product.quantity) {
          //   _product.quantity = 1;
          //   list.push(_product);
          // }else {
          //   list.push(_product);
          // }
        }else {
          const index = list.findIndex(e => e.productId === _product.productId)
          const quantity = _product.quantity + item.quantity
          list[index].quantity = quantity
        }
   
      })
      setListProduct(list);
    }
  }, [props.products]);

  const renderPopupConfirmUpdate = () => {
    return (
      <>
      <Modal isOpen style={{ overlay: { zIndex: 10 } }} zIndex="auto">
        <div className="popup-esr2 popup-esr3 popup-product min-width-340" id="popup-esr2">
          <div className="popup-esr2-content">
            <button type="button" className="close" data-dismiss="modal">
              <span className="la-icon">
                <i className="la la-close" />
              </span>
            </button>
            <div className="popup-esr2-body border-bottom">
              <div className="popup-esr2-title">{translate('products.popupComfirm.title')}</div>
              <div className="warning-content-popup">
                <label>
                  <b>{translate('products.popupComfirm.label')}</b>
                </label>
                <textarea className={msgErrorReasonInput ? 'error' : ''} onChange={handleReasonInput} />
                {msgErrorReasonInput && <span className="color-red font-size-10">{msgErrorReasonInput}</span>}
              </div>
            </div>
            <div className="popup-esr2-footer float-right">
              <a title="" onClick={onCancelConfirmPopup} className="button-cancel">
                {translate('products.category.form.button.cancel')}
              </a>
              <a title="" onClick={onAgreeConfirmPopup} className="button-blue">
                {translate('products.detail.label.button.save')}
              </a>
            </div>
          </div>
        </div>
      </Modal>
      );
    </>
      // <ModalConfirmChange fieldInfo={[...props.fieldInfoProduct, ...props.fieldInfoProductSet]} data={getDataChange()}
      //   sourceData={
      //     {
      //       productCategories,
      //       productTypes
      //     }
      //   }
      //   specialData={{ statementData: statementDataChange }}
      //   modalProps={{
      //     onCancel: onCancelConfirmPopup,
      //     onOk: onAgreeConfirmPopup,
      //     textCancel: translate('products.category.form.button.cancel'),
      //     textOk: translate('products.detail.label.button.save')
      //   }
      //   }
      // />
    
    );
  };


  const updateFiles = (fUploads) => {
    setTmpProductSet(prev => ({ ...prev, isUpload: true }))
    const newUploads = {
      ...fileUploads,
      ...fUploads
    };
    setFileUploads(_.cloneDeep(newUploads));
  };

  const getFormatDate = valueDate => {
    return utcToTz(valueDate, DATE_TIME_FORMAT.User);
  };

  const onUserChangeDynamicField = (fieldInfo: any, actionType: DynamicControlAction, params?: any) => {
    if (actionType === DynamicControlAction.USER_CHANGE && fieldInfo.fieldName === "unit_price") {
      // console.log("User change ", params)
      setIsAutoChange(false)
    }
  }

  const backTab = (orderIndex) => {
    setAutofocusField(orderIndex - 1)
  }


  const [errorMessagesProductOfSet, setErrorMessagesProductOfSet] = useState<string[]>([])

  useEffect(() => {
    if(Array.isArray(props.fieldInfoProductSet) && Array.isArray(props.errorItems) ){
      const getListFieldOfProductOfSet = pluck('fieldName', props.fieldInfoProductSet)
      const getListErrorOfProductSet = props.errorItems.filter(({item}) => getListFieldOfProductOfSet.includes(item))
      const getMessageCode = pluck('errorCode', getListErrorOfProductSet  )
      setErrorMessagesProductOfSet(uniq(getMessageCode))
    }
  }, [props.errorItems])

  const addPropIsFixedTip = (fInfos) => {
    return R.map(R.assoc('isFixedTip', true), fInfos)
  } 

  const renderProductLinked = item => {
    const listProductOfSet = _.cloneDeep(listProduct);

    return (
      <>
        <div className="col-lg-6 form-group mr-2">
          <TagAutoComplete
            ref={tagAutoCompleteRef}
            id="productsSets"
            title={getFieldLabel(item, "fieldLabel")}
            type={TagAutoCompleteType.Product}
            modeSelect={TagAutoCompleteMode.Multi}
            onActionSelectTag={onActionSelectTag}
            isHideResult={true}
            placeholder={translate('products.create-set.product-relation-id')}
            backTab={backTab}
            itemfieldOrder={item.fieldOrder}
            isDisabled={props.productViewMode === PRODUCT_VIEW_MODES.PREVIEW}
            isProdSet={true}
            lstChoice={listProductOfSet}
          />
        </div>
        {listProductOfSet && listProductOfSet.length > 0 && (
          <div className={'products-sets-wrap'} >
          <DeclareErrorWrapper isError={errorMessagesProductOfSet.length > 0}>
            <CustomDynamicList
              products={dataSubmitt?.listProduct || listProductOfSet}
              fieldInfoProductSet={addPropIsFixedTip(props.fieldInfoProductSet)}
              customContentField={renderCellSpecial}
              onDeleteItem={handleDeleteItem}
              onListProductDataChange={handleListProductDataChange}
              onUpdateFieldValue={onUpdateFieldValue}
              errorItems={props.errorItems}
              screenMode={ScreenMode.EDIT}
              totalPrice={onChangeTotalPrice}
              updateFiles={updateFiles}
              />
            </DeclareErrorWrapper>
              
          </div>
        )}
      </>
    );
  };

  const isFieldRelationAsSelf = (field) => {
    if (_.toString(field.fieldType) !== DEFINE_FIELD_TYPE.RELATION) {
      return false
    }
    if (field.relationData && field.relationData.asSelf === 1) {
      return true;
    }
    return false;
  }

  /**
   * use for setting list field
   */
  useEffect(() => {
    if (_.isNil(props.fieldInfoProduct)) {
      return;
    }
    const fieldTabs = props.fieldInfoProduct.filter(e => e.fieldType.toString() === DEFINE_FIELD_TYPE.TAB);
    const fieldNormals = props.fieldInfoProduct.filter(
      e => e.fieldType.toString() !== DEFINE_FIELD_TYPE.TAB && !isFieldRelationAsSelf(e));

    fieldTabs.forEach(field => {
      if (!_.isNil(field.tabData) && field.tabData.length > 0) {
        field.tabData.forEach(e => {
          const idx = fieldNormals.findIndex(o => o.fieldId === e);
          if (idx >= 0) {
            fieldNormals.splice(idx, 1);
          }
        });
      }
    });
    setListFieldTab(fieldTabs);
    setListFieldNormal(fieldNormals);
  }, [props.fieldInfoProduct]);

  const isExistBeforeTab = listFieldTab.length > 0 && listFieldTab[0].fieldOrder > 1;
  const isExistAfterTab =
    listFieldTab.length > 0 &&
    listFieldNormal.length > 0 &&
    listFieldTab[listFieldTab.length - 1].fieldOrder < listFieldNormal[listFieldNormal.length - 1].fieldOrder;

  const listFieldBeforeTab = listFieldNormal.filter(e => isExistBeforeTab && e.fieldOrder < listFieldTab[0].fieldOrder);
  const listFieldAfterTab = listFieldNormal.filter(e => isExistAfterTab && e.fieldOrder > listFieldTab[listFieldTab.length - 1].fieldOrder);

  const renderDynamicField = (listFields: any[]) => {
    return listFields.map((item, index) => {
      if (!isFieldUser(item)) return <></>;
      const className = item.isDoubleColumn ? 'col-md-6 form-group' : 'col-md-12 form-group';
      if (item.fieldName === PRODUCT_SPECIAL_FIELD_NAMES.productCategoryId) {
        return (
          <>
            <div key={item.fieldId} className={className}>
              <FieldSelectProductCategory
                label={getFieldLabel(item, "fieldLabel")}
                categoryId={productCategoryId}
                productCategories={productCategories}
                onSelectItemChange={value => onProductCategoryChange(item, value)}
                onSelectItemChangeItem={onProductCategoryChangeItem}
              />
            </div>
          </>
        );
      } else if (item.fieldName === PRODUCT_SPECIAL_FIELD_NAMES.productTypeId) {
        return (
          <>
            <div key={item.fieldId} className={className}>
              <FieldSelectProductType
                productTypes={productTypes}
                label={getFieldLabel(item, 'fieldLabel')}
                productTypesId={productTypeId}
                onSelectItemChange={value => onProductTypeChange(item, value)}
                isSet={true}
              />
            </div>
          </>
        );
      } else if (item.fieldName === PRODUCT_SPECIAL_FIELD_NAMES.productId) {
        return (
          <>
            <div className={className}>
              <label>{getFieldLabel(item, 'fieldLabel')}</label>
              <div className="item">
                {productSetInfoRes && productSetInfoRes.productId
                  ? productSetInfoRes.productId
                  : translate('products.create-set.product-code')}
              </div>
            </div>
          </>
        );
      } else if (item.fieldName === PRODUCT_SPECIAL_FIELD_NAMES.updateBy) {
        return (
          <>
            <div className={className}>
              <label>{getFieldLabel(item, 'fieldLabel')}</label>
              <div className="item">
                {productSetInfoRes && productSetInfoRes.updatedUserName
                  ?     
                  <EmployeeName 
                  userName={productSetInfoRes.updatedUserName}
                  userImage={productSetInfoRes.updatedUserImage}
                  employeeId={productSetInfoRes.updatedUserId}
                  sizeAvatar={30}
                  backdrop={false}
                ></EmployeeName> 
                  : translate('products.create-set.date-create')}
              </div>
            </div>
          </>
        );
      } else if (item.fieldName === PRODUCT_SPECIAL_FIELD_NAMES.updateDate) {
        return (
          <>
            <div className={className}>
              <label>{getFieldLabel(item, 'fieldLabel')}</label>
              <div className="item">
                {productSetInfoRes && productSetInfoRes.updatedDate
                  ? getFormatDate(productSetInfoRes.updatedDate)
                  : translate('products.create-set.date-create')}
              </div>
            </div>
          </>
        );
      } else if (item.fieldName === PRODUCT_SPECIAL_FIELD_NAMES.createBy) {
        return (
          <>
            <div className={className}>
              <label>{getFieldLabel(item, 'fieldLabel')}</label>
              <div className="item">
                {productSetInfoRes && productSetInfoRes.createdUserName
                  ?      
                  <EmployeeName 
                    userName={productSetInfoRes.createdUserName}
                    userImage={productSetInfoRes.createdUserImage}
                    employeeId={productSetInfoRes.createdUserId}
                    sizeAvatar={30}
                    backdrop={false}
                ></EmployeeName> 
                  : translate('products.create-set.date-create')}
              </div>
            </div>
          </>
        );
      } else if (item.fieldName === PRODUCT_SPECIAL_FIELD_NAMES.createDate) {
        return (
          <>
            <div className={className}>
              <label>{getFieldLabel(item, 'fieldLabel')}</label>
              <div className="item">
                {productSetInfoRes && productSetInfoRes.createdDate
                  ? getFormatDate(productSetInfoRes.createdDate)
                  : translate('products.create-set.date-create')}
              </div>
            </div>
          </>
        );
      } else if (item.fieldName === PRODUCT_SPECIAL_FIELD_NAMES.productsSets) {
        return renderProductLinked(item);
      }
      // else if (item.fieldName === PRODUCT_SPECIAL_FIELD_NAMES.productImageName) {
      //   return (
      //     <>
      //       <div className="col-lg-6 form-group">
      //         <div className="upload-wrap">
      //           <FieldInputMultiFile
      //             placeHolder={translate('tasks.create-edit.placeholder.file')}
      //             label={item.fieldLabel}
      //             onFileChange={file => updateFileData(file, 'files')}
      //             onFileDefaultChange={updateFileDefaultChange}
      //             isRequired={item.modifyFlag===2}
      //             listFileDefault={listFileDefault}
      //           />
      //         </div>
      //       </div>
      //     </>
      //   );
      // }
      else if (item.fieldName === PRODUCT_SPECIAL_FIELD_NAMES.isDisplay) {
        return (
          <>
            <div key={item.fieldId} className={className}>
              <label>{translate('products.create-set.isDisplay-label1')}</label>
              <p className="check-box-item">
                <label className="icon-check">
                  <input type="checkbox" defaultChecked={isDisplay} onChange={event => handleIsDisplayChange(item, event)} />
                  <i />
                  {translate('products.create-set.isDisplay-label2')}
                </label>
              </p>
            </div>
          </>
        );
      } else {
        const isIconField = item.fieldName === PRODUCT_SPECIAL_FIELD_NAMES.productImageName;
        const idxRef = fields.findIndex(e => e.fieldId === item.fieldId);
        return (
          <>
            {isFieldUser(item) && (
              <DynamicControlField
                ref={inputRefs[idxRef]}
                key={item.fieldId}
                // isFocus={index === autofocusField}
                className={className}
                isRequired={item.modifyFlag === MODIFY_FLAG.REQUIRED || item.modifyFlag === MODIFY_FLAG.DEFAULT_REQUIRED}
                controlType={productActionType === PRODUCT_ACTION_TYPES.UPDATE ? ControlType.EDIT : ControlType.ADD}
                belong={FIELD_BELONG.PRODUCT}
                elementStatus={getDataStatusControl(item)}
                fieldInfo={item}
                errorInfo={(props.productViewMode === PRODUCT_VIEW_MODES.PREVIEW) ? null : getErrorInfo(item)}
                updateStateElement={updateStateField}
                updateFiles={updateFiles}
                idUpdate={productSetInfoRes ? productSetInfoRes.productId : null}
                isSingleFile={isIconField}
                acceptFileExtension={isIconField ? FILE_FOMATS.IMG : null}
                onExecuteAction={onUserChangeDynamicField}
                isDisabled={props.productViewMode === PRODUCT_VIEW_MODES.PREVIEW && item.fieldType > 2}
              />
            )}
          </>
        );
      }
    });
  };

  const getBtnBack = () => {
    if (productActionType === PRODUCT_ACTION_TYPES.UPDATE) {
      return (
        <a onClick={handleClosePopup} className="modal-heading-title">
          <i className={`icon-small-primary icon-return-small ${props.popout ? 'disable' : ''}`} />
        </a>
      );
    } else {
      return <i className={`icon-small-primary icon-return-small disable`} />;
    }
  };

  /**
   * use for tab component
   * @param listFieldContent
   */
  const renderContentTab = (listFieldContent: any[]) => {
    return <>{renderDynamicField(listFieldContent)}</>;
  };

  const renderTab = () => {
    return (
      <DynamicControlField
        controlType={ControlType.EDIT}
        showFieldLabel={false}
        fieldInfo={listFieldTab[0]}
        listFieldInfo={props.fieldInfoProduct}
        renderControlContent={renderContentTab}
      />
    );
  };

  const renderComponent = () => {
    return (
      <>
        <div className="modal popup-esr popup-esr4 user-popup-page popup-align-right show" id="popup-esr" aria-hidden="true">
          <div className={showModal ? 'modal-dialog form-popup' : 'form-popup'}>
            <div className="modal-content">
              <div className="modal-header">
                <div className="left">
                  <div className="popup-button-back">
                    {getBtnBack()}
                    <span className="text">
                      {getIconFunction()}
                      {(props.productId || productIdState)
                        ? translate('products.top.title.edit-product-set')
                        : translate('products.top.title.create-product-set')}
                    </span>
                  </div>
                </div>
                <div className="right">
                  {showModal && <a className={`icon-small-primary icon-link-small ${props.productViewMode === PRODUCT_VIEW_MODES.PREVIEW ? ' disable' : ''}`} onClick={() => {
                    if (props.productViewMode !== PRODUCT_VIEW_MODES.PREVIEW) {
                      openNewWindow()
                    }
                  }} />}
                  {showModal && <a className="icon-small-primary icon-close-up-small line" onClick={() => handleClosePopup()} />}
                </div>
              </div>
              <div className="modal-body style-3">
                <div className="popup-content max-height-auto style-3 overflow-x-hidden">
                  <div className="user-popup-form" id={formId} >
                    {displayMessage()}
                    <div className={props.popout ? 'row padding-bot-120' : 'row'}>
                      {(props.productViewMode !== PRODUCT_VIEW_MODES.PREVIEW) && isExistBeforeTab && listFieldBeforeTab && renderDynamicField(listFieldBeforeTab)}
                      {(props.productViewMode !== PRODUCT_VIEW_MODES.PREVIEW) && listFieldTab && listFieldTab.length > 0 && renderTab()}
                      {(props.productViewMode !== PRODUCT_VIEW_MODES.PREVIEW) && isExistAfterTab && listFieldAfterTab && renderDynamicField(listFieldAfterTab)}
                      {(props.productViewMode !== PRODUCT_VIEW_MODES.PREVIEW) && (!listFieldTab || listFieldTab.length === 0) && renderDynamicField(listFieldNormal)}
                      {props.productViewMode === PRODUCT_VIEW_MODES.PREVIEW && (props.fieldPreview?.listField && props.fieldPreview.listField.length > 0) && renderDynamicField(props.fieldPreview.listField)}
                    </div>
                  </div>
                </div>
              </div>
              <div className="user-popup-form-bottom">
                {/* <input onClick={handleBackPopup} className="button-cancel" value={translate('products.detail.label.button.cancel')}/> */}
                <a onClick={handleBackPopup} className="button-cancel">
                  {translate('products.detail.label.button.cancel')}
                </a>
                 {/* <input onClick={handleSubmit} className="button-blue button-form-register " value= {productSetInfoRes && productSetInfoRes.productId
                    ? translate('products.create-set.btn-edit')
                    : translate('products.create-set.btn-create')}/> */}
                <a onClick={() => { if (props.productViewMode !== PRODUCT_VIEW_MODES.PREVIEW) { handleSubmit() } }} className={`button-blue button-form-register ${props.productViewMode === PRODUCT_VIEW_MODES.PREVIEW ? ' disable' : ''}`}>
                  {productSetInfoRes && productSetInfoRes.productId
                    ? translate('products.create-set.btn-edit')
                    : translate('products.create-set.btn-create')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderComponentNotAdmin = () => {
    return (
      <div className="insufficient-authority">
        <div className="alert alert-danger">
          <h3>{translate('error.http.403')}</h3>
        </div>
      </div>
    );
  };

  return (
    <>
   

        <Modal 
         className={`${showModal ? "" : "d-none"}`}
         isOpen={true} fade={showModal} toggle={() => { }} backdrop={(props.backdrop || props.backdrop === undefined)} id="popup-field-search" autoFocus={true} zIndex="auto"
        >
          {renderComponent()}
        </Modal>
    
      {(props.popout) ? <>
        {isAdmin === true ? renderComponent() : renderComponentNotAdmin()}
        {showPopupConfirmUpdate && renderPopupConfirmUpdate()}
      </> : 
      <>{showPopupConfirmUpdate && renderPopupConfirmUpdate()}</>
      }
    </>
  );


};

const mapStateToProps = ({ popupProductSet, applicationProfile, authentication }: IRootState) => ({
  authorities: authentication.account.authorities,
  tenant: applicationProfile.tenant,
  action: popupProductSet.action,
  fieldInfo: popupProductSet.fieldInfo,
  fieldInfoProductSet: popupProductSet.fieldInfoProductSet,
  fieldInfoProduct: popupProductSet.fieldInfoProduct,
  dataInfo: popupProductSet.dataInfo,
  errorValidates: popupProductSet.errorItems,
  successMessage: popupProductSet.successMessage,
  isCreateProductSetSuccess: popupProductSet.isCreateProductSetSuccess,
  productIdCreated: popupProductSet.productIdCreated,
  products: popupProductSet.products,
  errorCode: popupProductSet.errorCode,
  errorItems: popupProductSet.errorItems
});

const mapDispatchToProps = {
  getProductSetLayout,
  createProductSet,
  getProductSet,
  updateProductSet,
  getProductDetail,
  reset,
  resetMessage
};

export default connect<IPopupProductSetStateProps, IPopupProductSetDispatchProps, IPopupProductSetOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(PopupProductSet);