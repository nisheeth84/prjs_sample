import { ControlType, FIELD_BELONG, MODIFY_FLAG, SCREEN_TYPES } from 'app/config/constants';
import FieldSelectProductCategory from 'app/modules/products/popup/field-select-product-category';
import FieldSelectProductType from 'app/modules/products/popup/field-select-product-type';
import { IRootState } from 'app/shared/reducers';
import StringUtils, { forceArray, getFieldLabel } from 'app/shared/util/string-utils';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import React, { useEffect, useState, useMemo, createRef } from 'react';
import { Storage, translate } from 'react-jhipster';
import { connect } from 'react-redux';
import { Modal } from 'reactstrap';
import BoxMessage, { MessageType } from '../../../shared/layout/common/box-message';
import { DEFINE_FIELD_TYPE } from '../../../shared/layout/dynamic-form/constants';
import DynamicControlField from '../../../shared/layout/dynamic-form/control-field/dynamic-control-field';
import {
  PRODUCT_SPECIAL_FIELD_NAMES,
  PRODUCT_SPECIAL_FIELD_NAMES as specialFName,
  PRODUCT_VIEW_MODES,
  PRODUCT_ACTION_TYPES,
  FIELD_TYPE,
} from '../constants';
import { handleGetDataProduct, handleSubmitProductData, ProducPopuptAction, reset } from './product-edit.reducer';
import { hasAnyAuthority } from 'app/shared/auth/private-route';
import { AUTHORITIES } from 'app/config/constants';
import { isJsonString, convertHTMLEncString, revertHTMLString, getExtendfieldValue } from 'app/modules/products/utils';
import { FILE_FOMATS } from 'app/shared/layout/dynamic-form/control-field/edit/field-edit-file'
import _, { union } from "lodash";
import { moveScreenReset } from 'app/shared/reducers/screen-move.reducer';
import DialogDirtyCheck from "app/shared/layout/common/dialog-dirty-check";
import { DATE_TIME_FORMAT, utcToTz } from 'app/shared/util/date-utils';
import { useDetectFormChange } from 'app/shared/util/useDetectFormChange';
import useRecordChangeData from 'app/shared/util/useRecordChangeData';
import ModalConfirmChange from '../components/MessageConfirm/ModalConfirmChange';
import EmployeeName from 'app/shared/layout/common/EmployeeName';
import { isExceededCapacity } from 'app/shared/util/file-utils';

export interface IModalCreateEditProductProps extends StateProps, DispatchProps {
  iconFunction?: string;
  onCloseFieldsEdit: (id, number, delayTime?, isCancel?) => void;
  productActionType: number;
  productViewMode?: number;
  productId?: number;
  isContainDataSummary?: any;
  isOnlyData?: any;
  popout?: boolean;
  showModal: boolean;
  hiddenShowNewTab?: boolean;
  fieldPreview?: any
}

export enum FSActionTypeScreen {
  None,
  RemoveSession,
  SetSession,
  GetSession,
  CloseWindow,
  Search
}

const ModalCreateEditProduct = (props: IModalCreateEditProductProps) => {
  const formClass = "form-product-edit"
  const [isChanged] = useDetectFormChange(formClass)

  // let myWindow;

  // const [msgError, setMsgError] = useState('');
  // const [msgSuccess, setMsgSuccess] = useState('');
  const [productCategories, setProductCategories] = useState([]);
  const [productTypes, setproductTypes] = useState([]);
  const [productCategoryId, setProductCategoryId] = useState();
  const [productTypeId, setProductTypeId] = useState();
  const [productInfo, setProductInfo] = useState([]);
  const [forceCloseWindow, setForceCloseWindow] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const [fields, setFields] = useState([]);
  const [fieldUse, setFieldUse] = useState(null);
  const [showPopupConfirmUpdate, setShowPopupConfirmUpdate] = useState(false);
  const [reasonEdit] = useState('');
  const [isDisplay, setIsDisplay] = useState(true);
  const [productInfoRes, setProductInfoRes] = useState(null);
  const [productSubmit, setProductSubmit] = useState(null);
  const [checkcreate, setCheckcreate] = useState(true);
  const [errorValidates, setErrorValidates] = useState([]);
  const [categorys, setCategorys] = useState();
  const [fileUpload] = useState([]);
  const [isDeleteImage, setIsDeleteImage] = useState(false);
  const [fileUploads, setFileUploads] = useState([]);
  const [listFieldNormal, setListFieldNormal] = useState([]);
  const [listFieldTab, setListFieldTab] = useState([]);
  const [productActionTypeState, setProductActionTypeState] = useState(props.productActionType ? props.productActionType : 0);
  const [productIdState, setProductIdState] = useState(props.productId ? props.productId : null);
  const [, setMesComfirmState] = useState(null);
  const isAdmin = hasAnyAuthority(props.authorities, [AUTHORITIES.ADMIN]);
  const [loadSessonDone, setLoadSessonDone] = useState<boolean>(false)
  const [msgError, setMsgError] = useState("");

  const [isFirstChangeCategory, setIsFirstChangeCategory] = useState<boolean>(true)
  const [isFirstChangeType, setIsFirstChangeType] = useState<boolean>(true)


  // mesComfirm
  const { screenMoveInfo } = props;
  const ignoreFieldArr = ["productId", 'productName', "productTypeName", "productCategoryName", "productImageName", "createdDate", "updatedDate", "productData", "createdUserId", "createdUserName", "updatedUserId", "updatedUserName"]

  const {
    isContainDataSummary,
    isOnlyData,
    productData,
    fieldInfo,
    actionType,
    productId,
    idSuccess,
    productViewMode
  } = props;

  const updateStateSession = (mode: FSActionTypeScreen) => {
    if (mode === FSActionTypeScreen.SetSession) {
      Storage.local.set(ModalCreateEditProduct.name, {
        productCategories,
        productTypes,
        productCategoryId,
        productTypeId,
        productSubmit,
        productInfo,
        productInfoRes,
        showModal,
        fields,
        isDisplay,
        listFieldTab,
        listFieldNormal,
        productActionTypeState,
        productIdState,
        fileUploads,
        isDeleteImage,
        categorys,
        checkcreate

      });
    } else if (mode === FSActionTypeScreen.GetSession) {
      const saveObj = Storage.local.get(ModalCreateEditProduct.name);

      if (saveObj) {
        setProductCategories(saveObj.productCategories);
        setproductTypes(saveObj.productTypes);
        setProductCategoryId(saveObj.productCategoryId);
        setProductTypeId(saveObj.productTypeId);
        setProductInfo(saveObj.productInfo);
        setProductSubmit(saveObj.productSubmit);
        setProductInfoRes(saveObj.productInfoRes);
        setFields(saveObj.fields);
        setIsDisplay(saveObj.isDisplay);
        setShowModal(saveObj.showModal);
        setListFieldTab(saveObj.listFieldTab);
        setListFieldNormal(saveObj.listFieldNormal)
        setProductActionTypeState(saveObj.productActionTypeState)
        setProductIdState(saveObj.productIdState)
        setFileUploads(saveObj.productIdState)
        setIsDeleteImage(saveObj.isDeleteImage)
        setCategorys(saveObj.categorys)
        setErrorValidates(saveObj.errorValidates)
        setCheckcreate(saveObj.checkcreate)
      }
    } else if (mode === FSActionTypeScreen.RemoveSession) {
      Storage.local.remove(ModalCreateEditProduct.name);
    }
  };


  const isFieldUser = item => {
    if (item.fieldId) {
      return !fieldUse || fieldUse[item.fieldId.toString()] !== 0;
    }
    return false;
  };

  // const shouldDisable = productViewMode === PRODUCT_VIEW_MODES.PREVIEW;
  let fieldInfos = [];
  if (fieldInfo) {
    fieldInfos = fieldInfo;
  }
  const inputRefs = useMemo(() => Array.from({ length: fieldInfos.length }).map(() => createRef<any>()), [fieldInfos]);

  const getMessageComfirm = () => {
    const productType = productData.productTypes;
    const mesComfirm = [];
    const data = {};
    for (let i = 0; i < productInfo.length; i++) {
      const field = fieldInfo.find(e => e.fieldId === productInfo[i].fieldId);
      if (!field) continue;
      data[StringUtils.snakeCaseToCamelCase(field.fieldName)] = productInfo[i].value;
      data['productTypeId'] = productTypeId;
      data['productCategoryId'] = productCategoryId;
    }
    if (categorys) {
      data['productCategoryName'] = getFieldLabel({ categorys }, "categorys");
    } else {
      data['productCategoryName'] = translate('products.create-set.placeholder-category');
    }
    if (fileUpload.length > 0) {
      fileUpload.forEach((item, idx) => {
        data['productImageName'] = item.name

      })
    }

    for (let i = 0; i < productType.length; i++) {
      const fieldNameToId = productType.find(e => e.productTypeId === productTypeId);
      if (productTypeId === null) {
        data['productTypeName'] = translate('products.create-set.placeholder-type-product');
      }
      if (fieldNameToId) {
        data['productTypeName'] = getFieldLabel(fieldNameToId, "productTypeName");
      }
    }
    productInfoRes.productCategoryName =
      productInfoRes.productCategoryName !== null
        ? getFieldLabel(productInfoRes, "productCategoryName")
        : translate('products.create-set.placeholder-category');

    productInfoRes.productTypeName =
      productInfoRes.productTypeName !== null
        ? getFieldLabel(productInfoRes, 'productTypeName')
        : translate('products.create-set.placeholder-type-product');

    productInfoRes.isDisplay =
      productInfoRes.isDisplay ? "True" : "False"

    const unitPrice = data['unitPrice'];
    if (unitPrice === null) {
      data['unitPrice'] = 0;
    }
    data['isDisplay'] = isDisplay ? "True" : "False"
    const jsonRes = JSON.parse(JSON.stringify(productInfoRes));
    const jsonSubmit = JSON.parse(JSON.stringify(data));
    if (productInfoRes.productName !== jsonSubmit.productName) {
      const textEnc = translate('messages.WAR_PRO_0008', {
        0: convertHTMLEncString(productInfoRes.productName),
        1: translate('products.popupComfirm.CompareNamme'),
        2: convertHTMLEncString(jsonSubmit.productName)
      })

      const textTranslate = revertHTMLString(textEnc)
      const mesproName = (
        <div className="line-message-comfirm">
          <label>
            <b>
              {textTranslate}
            </b>
          </label>
        </div>
      );
      mesComfirm.push(mesproName);
    }
    // intersection(jsonRes, jsonSubmit);
    const keysJson = union(Object.keys(jsonRes), Object.keys(jsonSubmit));

    // const keysJson = props.fieldInfo.map(x => x.fieldName)
    for (let i = 0; i < keysJson.length; i++) {
      const key = StringUtils.snakeCaseToCamelCase(keysJson[i])
      let newVal
      let oldVal = jsonRes[key] ? jsonRes[key].toString() : "";
      const fieldItem = fieldInfo.find(x => StringUtils.snakeCaseToCamelCase(x.fieldName) === key)
      if (fieldItem && fieldItem.fieldType === 11 && key !== "productImageName") {
        newVal = ""
        oldVal = ""
        const newArrVal = (jsonSubmit[key] && jsonSubmit[key].length) ? JSON.parse(jsonSubmit[key]) : null
        const oldArrVal = (jsonRes[key] && jsonRes[key].length) ? JSON.parse(jsonRes[key]) : null
        let newArrPath
        let change = null
        if (_.isArray(newArrVal)) {
          newArrPath = newArrVal.map(x => {
            return x["status"]
          })
          newArrPath.map((e, idx) => {
            if (e === 1) {
              change = idx
            }
          });
        }
        if (change) {
          const oldValFile = oldArrVal[change]["file_name"]
          const field = fieldInfo.find(e => StringUtils.snakeCaseToCamelCase(e.fieldName) === key);
          const mes07 = (
            <div className="line-message-comfirm">
              <label>
                <b>
                  {revertHTMLString(translate('messages.WAR_PRO_0007', {
                    0: convertHTMLEncString(productInfoRes.productName),
                    1: getFieldLabel(field, 'fieldLabel'),
                    2: oldValFile,
                    3: ""
                  }))}
                </b>
              </label>
            </div>
          );

          mesComfirm.push(mes07);
        }
      } else if (key === "productImagePath") {
        const listNameImg = []
        if (fileUploads && fileUploads[`${jsonRes["productId"]}.product_image_name`]) {
          fileUploads[`${jsonRes["productId"]}.product_image_name`].forEach((element, idx) => {
            listNameImg.push(
              element[`${jsonRes["productId"]}.product_image_name.file${idx}`].name
            )
          });
        }
        oldVal = jsonRes["productImageName"] ? jsonRes["productImageName"].toString() : "";
        if (!listNameImg[0] && isDeleteImage === false) {
          newVal = oldVal
        } else {
          newVal = listNameImg[0]
        }

      } else {
        newVal = jsonSubmit[key] ? jsonSubmit[key].toString() : "";
      }
      if ((newVal !== oldVal) && (!ignoreFieldArr.includes(key))) {
        let field = fieldInfo.find(e => StringUtils.snakeCaseToCamelCase(e.fieldName) === key);
        if (key === 'productCategoryId') {
          newVal = jsonSubmit.productCategoryName
          if (jsonRes.productCategoryName === translate('products.create-set.placeholder-category')) {
            oldVal = ""
          } else {
            oldVal = jsonRes.productCategoryName
          }
          field = fieldInfo.find(e => StringUtils.snakeCaseToCamelCase(e.fieldName) === 'productCategoryId');
        }
        if (key === 'productTypeId') {
          if (jsonRes.productTypeName === translate('products.create-set.placeholder-type-product')) {
            oldVal = ""
          } else {
            oldVal = jsonRes.productTypeName
          }
          newVal = jsonSubmit.productTypeName
          field = fieldInfo.find(e => StringUtils.snakeCaseToCamelCase(e.fieldName) === 'productTypeId');
        }
        if (key === 'productImagePath') {
          field = fieldInfo.find(e => StringUtils.snakeCaseToCamelCase(e.fieldName) === 'productImageName');
        }
        if (field) {
          const mes07 = (
            <div className="line-message-comfirm">
              <label>
                <b>
                  {revertHTMLString(translate('messages.WAR_PRO_0007', {
                    0: convertHTMLEncString(productInfoRes.productName),
                    1: getFieldLabel(field, 'fieldLabel'),
                    2: convertHTMLEncString(oldVal),
                    3: convertHTMLEncString(newVal)
                  }))}
                </b>
              </label>
            </div>
          );
          mesComfirm.push(mes07);
        }
      }
    }
    setMesComfirmState(mesComfirm)
    return mesComfirm;
  };

  const executeDirtyCheck = async (action: () => void, cancel?: () => void) => {

    isChanged ? await DialogDirtyCheck({ onLeave: action, onStay: cancel, partternType: 1 }) : action();
  }

  const handleCloseModal = (isCancel = false) => {
     const isEdit = productIdState ? 1 : 0;

    if (productViewMode === PRODUCT_VIEW_MODES.PREVIEW) {
      props.onCloseFieldsEdit(productId, isEdit);
      return
    }
    let isChange = false;
    for (let i = 0; i < productInfo.length; i++) {
      if (!Array.isArray(productInfo[i].value) && productInfo[i].value) {
        if (isJsonString(productInfo[i].value)) {
          if (!Array.isArray(JSON.parse(productInfo[i].value)) && JSON.parse(productInfo[i].value).length !== 0) {
            isChange = true;
            break;
          }
        }
      }
      if (Array.isArray(productInfo[i].value) && productInfo[i].value.length > 0) {
        productInfo[i].value.map(e => {
          if (e.status) {
            if (e.status !== 0) {
              isChange = true;
            }
          } else if (e.status === undefined) { isChange = true }
        })
      }
      if (productCategoryId || productTypeId) {
        isChange = true;
        break;
      }
    }
    if (isChange || (productId && productData && getMessageComfirm().length > 0)) {
      executeDirtyCheck(() => {
        if (showModal) {
          props.onCloseFieldsEdit(productId, isEdit , 0 , isCancel);
          props.reset();
        } else {
          window.close();
        }
      })
    } else {
      if (showModal) {
        props.onCloseFieldsEdit(productId, null , 0 , isCancel);
        props.reset();
      } else {
        window.close();
      }
    }
    // }
  };

  const firstLoad = () => {
    if (props.popout) {
      updateStateSession(FSActionTypeScreen.GetSession);
      setShowModal(false);
      setForceCloseWindow(false);
    } else {
      setShowModal(true);
    }
    setLoadSessonDone(true)
  }

  useEffect(() => {
    firstLoad();
    return () => {
      props.reset();
      // updateStateSession(FSActionTypeScreen.RemoveSession);
      document.body.className = document.body.className.replace('modal-open', '');

    }
  }, []);

  useEffect(() => {
    if (screenMoveInfo && screenMoveInfo.screenType === SCREEN_TYPES.ADD) {
      if (productActionTypeState === PRODUCT_ACTION_TYPES.UPDATE) {
        handleCloseModal();
      } else {
        props.reset();
        firstLoad();
      }
      props.moveScreenReset();
    }
    if (screenMoveInfo && screenMoveInfo.screenType === SCREEN_TYPES.SEARCH) {
      handleCloseModal();
      props.moveScreenReset();
    }
  }, [screenMoveInfo]);

  useEffect(() => {
    if (fieldInfo) {
      setFields(fieldInfo);
    }
  }, [fieldInfo]);

  const getParamForEdit = () => {
    return {
      mode: 'edit',
      productId: productId || productIdState,
      isContainDataSummary,
      isOnlyData
    };
  };

  const getLabelType = () => {
    const productType = props.productData.productTypes;
    setproductTypes(productType || []);
  };

  /**
   * show message error when submit
   */
  const setMessageError = () => {
    if (props.errorValidates) {
      for (const errorItem of props.errorValidates) {
        if (errorItem.errorCode) {
          setMsgError(errorItem.errorCode);
        }
      }
    }
    if (props.errorMessage) {
      setMsgError(props.errorMessage);
    }
  }


  // const [currentId, prevId] = useWillReceiveProps(productIdState)

  // useEffect(() => {
  //       if(!prevId && currentId && props.popout ){
  //         props.handleGetDataProduct(getParamForEdit(), PRODUCT_ACTION_TYPES.UPDATE);
  //       } 
  // },[currentId, prevId])

  useEffect(() => {
    if (!loadSessonDone) return
    switch (actionType) {
      case ProducPopuptAction.None:
        props.handleGetDataProduct(getParamForEdit(), productActionTypeState);

        // if(productViewMode !== PRODUCT_VIEW_MODES.PREVIEW){
        //   props.handleGetDataProduct(getParamForEdit(), productActionTypeState);
        // }
        break;
      case ProducPopuptAction.UpdateProductFailure:
        break;
      case ProducPopuptAction.CreateProductSuccess:
        if (props.popout) {
          setForceCloseWindow(true)
        } else {
          props.onCloseFieldsEdit(props.idCreateSuccess, productActionTypeState, 500);
        }
        break;
      // case ProducPopuptAction.UpdateProductSuccess:
      //   if(props.popout){
      //     setForceCloseWindow(true)
      //   }else{
      //     props.onCloseFieldsEdit(props.idSuccess, productActionTypeState);
      //   }
      //   break;
      case ProducPopuptAction.UpdateProductSuccess:
        if (!props.popout) {
          props.onCloseFieldsEdit(idSuccess, productActionTypeState);
        } else {
          setForceCloseWindow(true)
        }
        props.reset();
        break;
      case ProducPopuptAction.ErrorModal:
        setMessageError();
        break;
      // TODO: add id to this
      // window.opener.postMessage({type: "createsuccess", id: "id"}, window.location.origin)
      default:
        break;
    }
  }, [actionType, loadSessonDone]);

  // useEffect(() => {
  //   if (productActionTypeState) {
  //     handleBackPopup();
  //   }
  // }, [productActionTypeState]);

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
  }

  useEffect(() => {
    if (props.popout) {
      // this.nameInput.focus();
      updateStateSession(FSActionTypeScreen.GetSession);
      setShowModal(false);
    } else {
      setShowModal(true);
    }
    return () => {
      props.reset();
      // updateStateSession(FSActionTypeScreen.RemoveSession);
    }
  }, []);

  const setExclusiveError = errors => {
    let exclusive = null;
    if (Array.isArray(errors)) {
      errors.forEach(element => {
        if (element.item === 'updatedDate' && element.errorCode === 'ERR_COM_0050') {
          exclusive = element;
        }
      });
      if (exclusive) {
        // setMsgError(translate(`messages.${exclusive.errorCode}`, exclusive.params));
        window.scrollTo(0, 0);
      }
    }
  };
  useEffect(() => {
    setErrorValidates(props.errorValidates ? props.errorValidates : []);
    setExclusiveError(props.errorValidates);
  }, [props.errorValidates]);


  const handleBackPopup = () => {
    if (props.popout) {
      updateStateSession(FSActionTypeScreen.SetSession);
      setForceCloseWindow(true);
    } else {
      handleCloseModal(true);
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
    window.open(`${props.tenant}/create-edit-product`, '', style.toString());
    if (productIdState) {
      props.onCloseFieldsEdit(productIdState, null);
    } else {
      props.onCloseFieldsEdit(null, null);
    }
  };

  const handlePopupConfirmUpdate = () => {
    setShowPopupConfirmUpdate(true);
  };

  const handleDataByFieldType = (fieldType, fieldData, field) => {
    let value = null;
    if (_.toString(fieldType) === FIELD_TYPE.NUMBER) {
      value = isFieldUser(field) && fieldData.value ? fieldData.value : "0";
    } else if (_.toString(fieldType) === FIELD_TYPE.RELATION) {
      value = isFieldUser(field) && fieldData.value ? fieldData.value : "[]";
    }
    else {
      value = isFieldUser(field) && !_.isNil(fieldData.value) ? fieldData.value : '';
      if ((_.isArray(fieldData.value) && !fieldData.length) || (_.toString(fieldType) === FIELD_TYPE.FILE && _.isNil(fieldData.value))) {
        value = "[]"
      }
    }

    return value;
  };

  useEffect(() => {
    setMsgError(props.errorCode)
  }, [props.errorCode])

  const handleSubmit = () => {
    const data = {
      productData: []
    };
    const files = getFileUploads();
    if (event && isExceededCapacity(files)) {
      setMsgError("ERR_COM_0033");
      return;
    } else if (event) {
      setMsgError('');
    }
    productInfo.forEach(fieldData => {
      const field = fieldInfo.find(e => e.fieldId === fieldData.fieldId);
      if (isFieldUser(field)) {
        if (field.isDefault) {
          data[StringUtils.snakeCaseToCamelCase(field.fieldName)] = handleDataByFieldType(field.fieldType, fieldData, field)
        } else {
          data.productData.push({
            fieldType: field.fieldType.toString(),
            key: field.fieldName,
            value: handleDataByFieldType(field.fieldType, fieldData, field)
          });
        }
      } else {
        delete data[StringUtils.snakeCaseToCamelCase(field.fieldName)]
      }
    });

    // const files = fieldInfo.find(e => e.fieldId === specialFName.productImageName);
    // data['files'] = files;
    data['isDisplay'] = isFieldUser(fieldInfo.find(e => e.fieldName === StringUtils.camelCaseToSnakeCase('isDisplay')))
      ? isDisplay
      : null;
    data['productTypeId'] = productTypeId;
    data['productCategoryId'] = isFieldUser(fieldInfo.find(e => e.fieldName === StringUtils.camelCaseToSnakeCase('productCategoryId')))
      ? productCategoryId
      : null;
    data['productId'] = productIdState;
    delete data['productImageName'];
    if (productIdState) {
      data['updatedDate'] = new Date(productInfoRes.updatedDate);
      data['isDeleteImage'] = isDeleteImage;
      setProductSubmit(data);
      if (getMessageComfirm().length > 0) {
        handlePopupConfirmUpdate();
      } else {
        props.handleSubmitProductData(data, getFileUploads(), productActionTypeState);
      }
    } else {
      if (checkcreate) {
        setCheckcreate(false);
        props.handleSubmitProductData(data, getFileUploads(), productActionTypeState)
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

  const getTextSubmitButton = (type: number) => {
    if (type === 1) {
      if (productActionTypeState === PRODUCT_ACTION_TYPES.CREATE) {
        return <span>{translate('products.category.form.button.create')}</span>;
      } else {
        return <span>{translate('products.category.form.button.edit')}</span>;
      }
    } else {
      if (productActionTypeState === PRODUCT_ACTION_TYPES.CREATE) {
        return <span>{translate('products.category.form.title.createProduct')}</span>;
      } else {
        return <span>{translate('products.category.form.title.editProduct')}</span>;
      }
    }
  };

  const indexRef = (field) => {
    return fieldInfos.findIndex(e => e.fieldId === field.fieldId);
  }

  const createExtItem = (val) => {
    const isArray = Array.isArray(val);
    const itemValue = isArray ? JSON.stringify(val) : val ? val.toString() : '';
    return itemValue;
  }

  const addToProductData = (addItem, valueUpdate) => {
    if (valueUpdate['value']) {
      let notInArray = true;
      valueUpdate['value'].map((e, index) => {
        if (e === addItem) {
          notInArray = false;
          valueUpdate['value'][index] = addItem;
        }
      });
      if (notInArray) {
        valueUpdate['value'].push(addItem);
      }
    } else {
      valueUpdate['value'] = [addItem];
    }
  }

  const addExtendField = (item, val, valueUpdate) => {
    let addItem = null;
    if (item.fieldType.toString() === DEFINE_FIELD_TYPE.LOOKUP) {
      addItem = [];
      const arrVal = forceArray(val);
      arrVal.forEach(obj => {
        addItem.push(createExtItem(obj.value));
      })
    } else {
      addItem = createExtItem(val);
    }
    if (Array.isArray(addItem)) {
      addItem.forEach(addIt => {
        addToProductData(addIt, valueUpdate);
      });
    } else {
      valueUpdate['value'] = addItem;
    }
  }
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (props.fieldInfo.length) {
      setTimeout(() => {
        setLoaded(true)
      }, 1000);
    }
  }, [props.fieldInfo, showModal])

  const { getDataChange, setDataChange, resetDataChange } = useRecordChangeData(loaded)

  const updateStateField = (item, type, value) => {

    if (productViewMode === PRODUCT_VIEW_MODES.PREVIEW) return;
    setDataChange(item.fieldId, value)
    let val = value
    if (type === DEFINE_FIELD_TYPE.TEXT && value) {
      val = value.trim()
    }
    let fieldinfo = null;
    fieldInfos.forEach(field => {
      if (field.fieldId.toString() === item.fieldId.toString()) {
        fieldinfo = field;
      }
    });
    if (fieldinfo.fieldName === PRODUCT_SPECIAL_FIELD_NAMES.productImageName) {
      let fileUpdate = null;
      (val && val.length > 0) && (fileUpdate = val[0]);
      if (fileUpdate && fileUpdate.status === 1) {
        setIsDeleteImage(true);
      }
    }

    const valueUpdate = {};
    valueUpdate['fieldId'] = item.fieldId;
    valueUpdate['fieldName'] = fieldinfo.fieldName;

    if (productInfo && productInfo.length > 0 && fieldinfo) {
      if (_.isEqual(DEFINE_FIELD_TYPE.LOOKUP, _.toString(type))) {
        const valueLookup = _.isArray(val) ? val : _.toArray(val);
        valueLookup.forEach(e => {
          const idx = fieldInfos.findIndex(o => o.fieldId === e.fieldInfo.fieldId);
          if (idx >= 0) {
            const idxRef = indexRef(fieldInfos[idx]);
            if (inputRefs[idxRef] && inputRefs[idxRef].current && inputRefs[idxRef].current.setValueEdit) {
              inputRefs[idxRef].current.setValueEdit(e.value);
            }
          }
        })
      } else if (fieldinfo.isDefault) {
        valueUpdate['value'] = val;
      } else {
        addExtendField(fieldinfo, val, valueUpdate);
      }
    } else {
      valueUpdate['value'] = val;
    }

    const indexField = productInfo.findIndex(e => e.fieldId.toString() === item.fieldId.toString());
    if (indexField < 0) {
      productInfo.push(valueUpdate);
    } else {
      productInfo[indexField] = valueUpdate;
    }
    setProductInfo(_.cloneDeep(productInfo));
  };


  // const getExtendfieldValue = (extendFieldList, fieldName) => {
  //   if (!extendFieldList) {
  //     return undefined;
  //   }
  //   let retField = null;
  //   extendFieldList.map(field => {
  //     if (field.key === fieldName && field.fieldType === FIELD_TYPE.ADDRESS && field.value === "null") {
  //       const address = {};
  //       address['zip_code'] ="";
  //       address['building_name'] ="";
  //       address['address_name'] ="";
  //       address['address'] ="";
  //       retField = {
  //         fieldType: FIELD_TYPE.ADDRESS,
  //         key:field.key,
  //         value: JSON_STRINGIFY(address)
  //       }
  //     } else if (field.key === fieldName) {
  //       retField = field;
  //     }
  //   });
  //   if (retField) {
  //     return retField.value;
  //   }
  //   return undefined;
  // }

  const flatternArrayProductInfo = () => {
    const obj = {}
    if (!productInfo) {
      return obj;
    }
    productInfo.forEach(e => {
      obj[e.fieldName] = e.value;
    });
    return obj;
  }

  const getDataStatusControl = (item) => {
    if (item.fieldType.toString() === DEFINE_FIELD_TYPE.CALCULATION) {
      return { fieldValue: flatternArrayProductInfo() };
    }
    if (item.fieldName === PRODUCT_SPECIAL_FIELD_NAMES.productImageName) {
      if (productInfoRes && productInfoRes.productImageName) {
        const fieldValue = [{
          status: 0,
          fileName: productInfoRes.productImageName,
          filePath: productInfoRes.productImagePath,
          fileUrl: productInfoRes.productImagePath
        }]
        return {
          fieldType: item.fieldType,
          key: item.fieldName,
          fieldValue: JSON.stringify(fieldValue)
        }
      }
    }
    let saveData = null;
    if (productInfoRes !== undefined && productInfoRes !== null && Object.keys(productInfoRes).length > 0) {
      saveData = productInfoRes;
    } else if (productInfo !== undefined && productInfo !== null) {
      saveData = productInfo;
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

  const getErrorInfo = item => {
    let errorInfo = null;
    errorValidates.forEach(elem => {
      let fieldName = item.fieldName;
      if (item.isDefault) {
        fieldName = StringUtils.snakeCaseToCamelCase(fieldName);
      }
      if (elem.item === fieldName) {
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
  const onProductCategoryChange = (item, value) => {
    isFirstChangeCategory && setDataChange(item.fieldId, productCategoryId, true);
    setDataChange(item.fieldId, value);
    isFirstChangeCategory && setIsFirstChangeCategory(false);
    setProductCategoryId(value);
  };
  const onProductCategoryChangeItem = value => {
    setCategorys(value);
  };
  const handleIsDisplayChange = (item, event) => {
    setDataChange(item.fieldId, !!event.target.checked)
    setIsDisplay(event.target.checked);
  };
  const onCancelConfirmPopup = () => {
    setShowModal(true);
    setShowPopupConfirmUpdate(false);
  };

  const onAgreeConfirmPopup = () => {
    productData.reasonEdit = reasonEdit;
    setShowModal(true);
    props.handleSubmitProductData(productSubmit, getFileUploads(), productActionTypeState);
    setShowPopupConfirmUpdate(false);
  };

  const getBtnBack = () => {
    if (productActionTypeState === PRODUCT_ACTION_TYPES.UPDATE && showModal) {
      return (
        <a onClick={() => { if (productViewMode !== PRODUCT_VIEW_MODES.PREVIEW) { handleCloseModal(true) } }} className="modal-heading-title">
          <i className={`icon-small-primary icon-return-small ${(!productIdState) ? 'disable' : ''}`} />
        </a>
      );
    } else if (productActionTypeState === PRODUCT_ACTION_TYPES.CREATE && props.hiddenShowNewTab) {
      return (
        <a onClick={() => handleCloseModal(true)} className="modal-heading-title">
          <i className={`icon-small-primary icon-return-small`} />
        </a>
      );
    } else {
      return <i    {...props.popout && productIdState && { onClick: handleBackPopup }} className={`icon-small-primary icon-return-small ${(!productIdState) ? 'disable' : ''}`} />;
    }
  };

  // useEffect(() => {
  //   if(productActionType >= 0){
  //     setProductActionTypeState(productActionType)
  //   }
  // }, [productActionType]);

  const onProductTypeChange = (item, value) => {
    isFirstChangeType && setDataChange(item.fieldId, productTypeId, true)
    isFirstChangeType && setIsFirstChangeType(false)
    if (productTypeId === value) return

    resetDataChange(item.fieldId, value)
    if (value) {
      const type = productTypes.find(types => types.productTypeId.toString() === value.toString());
      if (type && type.fieldUse) {
        setFieldUse(JSON.parse(type.fieldUse));
      }
    } else {
      setFieldUse(null);
    }
    setProductTypeId(value);
    setIsDeleteImage(true);
    setProductCategoryId(null);
    inputRefs.forEach(ref => {
      if (ref.current) ref.current.resetValue();
    });
  };


  const displayMessage = () => {
    if (!msgError) {
      return <></>;
    } else {
      return (<>
        <BoxMessage messageType={MessageType.Error}
          message={translate(`${`messages.` + msgError}`)} />
      </>
      )
    }
  };

  /* Lifecycle */
  useEffect(() => {
    if (forceCloseWindow) {
      if (props.popout) {
        window.opener.postMessage(
          {
            type: FSActionTypeScreen.CloseWindow,
            forceCloseWindow: true,
            id: props.idCreateSuccess || productIdState,
            flag: productIdState ? PRODUCT_ACTION_TYPES.UPDATE : PRODUCT_ACTION_TYPES.CREATE
          },
          window.location.origin
        );
        Storage.session.set('forceCloseWindow', true);
        window.close();
      } else {
        handleCloseModal();
      }
    }
  }, [forceCloseWindow]);

  // useEffect(() => {
  //   setMsgError(props.errorMessage);
  //   setMsgSuccess(props.successMessage);
  // }, [props.errorMessage, props.successMessage]);

  useEffect(() => {
    if (Array.isArray(props.errorValidates)) {
      if (props.errorValidates.length > 0) {
        setCheckcreate(true);
      }
    }
  }, [props.errorValidates]);

  useEffect(() => {
    if (props.productData) {
      setProductCategories(props.productData.productCategories || []);
      getLabelType();
    }
    if (productData && productData.product) {
      setProductCategoryId(productData.product.productCategoryId || '');
      setIsDisplay(productData.product.isDisplay);
      if (productData.product.productData) {
        const cVProductData = (productData.product.productData);
        cVProductData.forEach(data => productData.product[StringUtils.snakeCaseToCamelCase(data.key)] = data.value);
      }
      if (productData.product.productTypeId && props.productData.productTypes) {
        const type = props.productData.productTypes.find(
          types => types.productTypeId.toString() === productData.product.productTypeId.toString()
        );
        if (type && type.fieldUse) {
          setFieldUse(JSON.parse(type.fieldUse));
        }
      } else {
        setFieldUse(null);
      }
      setCategorys(getFieldLabel(productData.product, "productCategoryName"))
      setProductCategoryId(productData.product.productCategoryId);
      setProductTypeId(productData.product.productTypeId);
      setProductInfoRes(productData.product);
    }
  }, [props.productData]);

  const updateFiles = (fUploads) => {
    const newUploads = {
      ...fileUploads,
      ...fUploads
    };
    setFileUploads(_.cloneDeep(newUploads));
  }

  const renderPopupConfirmUpdate = () => {
    return <ModalConfirmChange fieldInfo={fieldInfo} data={getDataChange()}
      sourceData={
        {
          productCategories,
          productTypes
        }
      }


      modalProps={{
        onCancel: onCancelConfirmPopup,
        onOk: onAgreeConfirmPopup,
        textCancel: translate('products.category.form.button.cancel'),
        textOk: getTextSubmitButton(1)
      }
      }
    />

  };

  /**
   * use for setting list field
   */
  useEffect(() => {
    if (_.isNil(props.fieldInfo)) {
      return;
    }
    const fieldTabs = props.fieldInfo.filter(e => e.fieldType.toString() === DEFINE_FIELD_TYPE.TAB)
    const fieldNormals = props.fieldInfo.filter(e => e.fieldType.toString() !== DEFINE_FIELD_TYPE.TAB)

    fieldTabs.forEach((field) => {
      if (!_.isNil(field.tabData) && field.tabData.length > 0) {
        field.tabData.forEach(e => {
          const idx = fieldNormals.findIndex(o => o.fieldId === e)
          if (idx >= 0) {
            fieldNormals.splice(idx, 1)
          }
        })
      }
    })
    setListFieldTab(fieldTabs);
    setListFieldNormal(fieldNormals)
  }, [props.fieldInfo])


  const getFormatDate = valueDate => {
    return utcToTz(valueDate, DATE_TIME_FORMAT.User);

    // return moment(valueDate).format('MM/DD/YYYY HH:mm');

  };

  const isExistBeforeTab = listFieldTab.length > 0 && listFieldTab[0].fieldOrder > 1
  const isExistAfterTab = listFieldTab.length > 0 && listFieldNormal.length > 0 && listFieldTab[listFieldTab.length - 1].fieldOrder < listFieldNormal[listFieldNormal.length - 1].fieldOrder

  const listFieldBeforeTab = listFieldNormal.filter(e => isExistBeforeTab && e.fieldOrder < listFieldTab[0].fieldOrder)
  const listFieldAfterTab = listFieldNormal.filter(e => isExistAfterTab && e.fieldOrder > listFieldTab[listFieldTab.length - 1].fieldOrder)

  const renderDynamicControlField = (listFields: any[]) => {

    return listFields.map((item, index) => {
      if (!isFieldUser(item)) return <></>;
      if (item.fieldName === specialFName.productCategoryId) {
        return (
          <>
            <div key={item.fieldId} className={'col-md-6 form-group'}>
              <FieldSelectProductCategory
                label={getFieldLabel(item, 'fieldLabel')}
                productCategories={productCategories}
                categoryId={productCategoryId}
                onSelectItemChangeItem={onProductCategoryChangeItem}
                onSelectItemChange={value => onProductCategoryChange(item, value)}
              />
            </div>
          </>
        );
      } else if (item.fieldName === specialFName.productTypeId) {
        return (
          <>
            <div key={item.fieldId} className={'col-md-6 form-group'}>
              <FieldSelectProductType
                label={getFieldLabel(item, "fieldLabel")}
                productTypes={productTypes}
                productTypesId={productTypeId}
                onSelectItemChange={value => onProductTypeChange(item, value)}
              />
            </div>
          </>
        );
      } else if (item.fieldName === specialFName.createDate) {
        return (
          <>
            <div className="col-lg-6 form-group">
              <label>{getFieldLabel(item, 'fieldLabel')}</label>
              {productInfoRes ?
                <span className="color-999">{getFormatDate(productInfoRes.createdDate)}</span> :
                <span className="color-333 font-weight-500">{translate('products.create-set.date-create')}</span>}
            </div>
          </>
        );
      } else if (item.fieldName === specialFName.productId) {
        return (
          <>
            <div className="col-lg-6 form-group">
              <label>{getFieldLabel(item, 'fieldLabel')}</label>
              {productIdState ?
                <span>{productIdState}</span> :
                <span className="color-333">{translate('products.create-set.product-code')}</span>}
            </div>
          </>
        );
      } else if (item.fieldName === specialFName.createBy) {
        return (
          <>
            <div className="col-lg-6 form-group">
              <label>{getFieldLabel(item, 'fieldLabel')}</label>
              <div className="item">
                {productInfoRes && productInfoRes.createdUserName
                  ?
                  <EmployeeName
                    userName={productInfoRes.createdUserName}
                    userImage={productInfoRes.createdUserImage}
                    employeeId={productInfoRes.createdUserId}
                    sizeAvatar={30}
                    backdrop={false}
                  ></EmployeeName>
                  : translate('products.create-set.date-create')}
              </div>
              {/* {productInfoRes ?
                <span className="color-999">{productInfoRes.createdUserName}</span> :
                <span className="color-333 font-weight-500">{translate('products.create-set.date-create')}</span>} */}
            </div>
          </>
        );
      } else if (item.fieldName === specialFName.isDisplay) {
        return (
          <>
            <div key={item.fieldId} className="col-lg-6 form-group">
              <label>{getFieldLabel(item, 'fieldLabel')}</label>
              <p className="check-box-item">
                <label className="icon-check">
                  <input type="checkbox" disabled={productViewMode === PRODUCT_VIEW_MODES.PREVIEW} defaultChecked={isDisplay} onChange={(event => handleIsDisplayChange(item, event))} />
                  <i /> {translate('products.create-set.isDisplay-label2')}
                </label>
              </p>
            </div>
          </>
        );
      } else if (item.fieldName === specialFName.updateDate) {
        return (
          <>
            <div className="col-lg-6 form-group">
              <label>{getFieldLabel(item, 'fieldLabel')}</label>
              {productInfoRes ?
                <span className="color-999">{getFormatDate(productInfoRes.updatedDate)}</span> :
                <span className="color-333 font-weight-500">{translate('products.create-set.date-create')}</span>}
            </div>
          </>
        );
      } else if (item.fieldName === specialFName.productsSets) {
        return <></>;
      } else if (item.fieldName === specialFName.updateBy) {
        return (
          <>
            <div className="col-lg-6 form-group">
              <label>{getFieldLabel(item, 'fieldLabel')}</label>
              {productInfoRes && productInfoRes.updatedUserName
                ?
                <EmployeeName
                  userName={productInfoRes.updatedUserName}
                  userImage={productInfoRes.updatedUserImage}
                  employeeId={productInfoRes.updatedUserId}
                  sizeAvatar={30}
                  backdrop={false}
                ></EmployeeName>
                : translate('products.create-set.date-create')}
            </div>
          </>
        );
      }
      else {
        const isIconField = item.fieldName === PRODUCT_SPECIAL_FIELD_NAMES.productImageName;
        const idxRef = fieldInfos.findIndex(e => e.fieldId === item.fieldId);
        return (
          <>
            <DynamicControlField
              ref={inputRefs[idxRef]}
              key={item.fieldId}
              recordId={[productIdState]}
              className={item.isDoubleColumn ? 'col-lg-6 form-group' : 'col-lg-12 form-group'}
              // isFocus={index === 0}
              isRequired={item.modifyFlag === MODIFY_FLAG.REQUIRED || item.modifyFlag === MODIFY_FLAG.DEFAULT_REQUIRED}
              controlType={productActionTypeState === PRODUCT_ACTION_TYPES.UPDATE ? ControlType.EDIT : ControlType.ADD}
              fieldInfo={item}
              belong={FIELD_BELONG.PRODUCT}
              errorInfo={getErrorInfo(item)}
              elementStatus={getDataStatusControl(item)}
              updateStateElement={updateStateField}
              listFieldInfo={listFieldTab}
              updateFiles={updateFiles}
              isSingleFile={isIconField}
              acceptFileExtension={isIconField ? FILE_FOMATS.IMG : null}
              idUpdate={productIdState}
              isDisabled={productViewMode === PRODUCT_VIEW_MODES.PREVIEW && item.fieldType > 2}
            />
          </>
        );
      }
    });
  };

  /**
   * use for tab component
   * @param listFieldContent 
   */
  const renderContentTab = (listFieldContent: any[]) => {
    return <>{renderDynamicControlField(listFieldContent)}</>
  }

  const renderTab = () => {
    return <DynamicControlField
      controlType={ControlType.EDIT}
      showFieldLabel={false}
      fieldInfo={listFieldTab[0]}
      listFieldInfo={props.fieldInfo}
      renderControlContent={renderContentTab}
    />
  }



  // const buttonClassName = shouldDisable ? 'button-blue button-form-register disable' : 'button-blue button-form-register';
  const renderComponent = () => {
    return (
      <>
        <Modal
          isOpen={true}
          fade={true}
          toggle={() => { }}
          backdrop={!showPopupConfirmUpdate}
          id="popup-field-search"
          autoFocus={true}
          zIndex="auto"
        >
          <div className="modal popup-esr popup-esr4 user-popup-page popup-align-right show" id="popup-esr" aria-hidden="true">
            <div className={props.showModal ? "modal-dialog form-popup" : "form-popup"}>
              <div className="modal-content">
                <button type="button" className="close" data-dismiss="modal">
                  <span className="la-icon">
                    <i className="la la-close" />
                  </span>
                </button>
                <div className="modal-header modal-header-product">
                  <div className="left">
                    <div className="popup-button-back mr-2">
                      {getBtnBack()}
                      <span className="text">
                        {getIconFunction()} {getTextSubmitButton(0)}
                      </span>
                    </div>
                  </div>
                  <div className="right">
                    {showModal && !props.hiddenShowNewTab && <a className={`icon-small-primary icon-link-small mr-1 ${(productViewMode === PRODUCT_VIEW_MODES.PREVIEW) ? ' disable' : ''}`} onClick={() => {
                      if (productViewMode !== PRODUCT_VIEW_MODES.PREVIEW) {
                        openNewWindow()
                      }
                    }} />}
                    {showModal && <a className="icon-small-primary icon-close-up-small line" onClick={() => handleCloseModal(true)} />}
                  </div>
                </div>
                <div className="modal-body style-3">
                  <div className="popup-content max-height-auto style-3">
                    <div className="user-popup-form label-regular">
                      {displayMessage()}
                      <form className="row " id={formClass}>
                        {productViewMode !== PRODUCT_VIEW_MODES.PREVIEW && isExistBeforeTab && listFieldBeforeTab && renderDynamicControlField(listFieldBeforeTab)}
                        {productViewMode !== PRODUCT_VIEW_MODES.PREVIEW && listFieldTab && listFieldTab.length > 0 && renderTab()}
                        {productViewMode !== PRODUCT_VIEW_MODES.PREVIEW && isExistAfterTab && listFieldAfterTab && renderDynamicControlField(listFieldAfterTab)}
                        {productViewMode !== PRODUCT_VIEW_MODES.PREVIEW && (!listFieldTab || listFieldTab.length === 0) && renderDynamicControlField(listFieldNormal)}
                        {productViewMode === PRODUCT_VIEW_MODES.PREVIEW && (props.fieldPreview?.listField && props.fieldPreview.listField.length > 0) && renderDynamicControlField(props.fieldPreview.listField)}
                      </form>
                    </div>
                  </div>
                </div>
                <div className="user-popup-form-bottom">
                  <a onClick={handleBackPopup} className="button-cancel color-333">
                    {translate('products.category.form.button.cancel')}
                  </a>
                  <a onClick={() => { if (productViewMode !== PRODUCT_VIEW_MODES.PREVIEW) { handleSubmit() } }} className={`button-blue button-form-register ml-1  ${(productViewMode === PRODUCT_VIEW_MODES.PREVIEW) ? ' disable' : ''}`}>
                    {getTextSubmitButton(1)}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Modal>
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

  if (showModal) {
    return (
      <>
        {renderComponent()}

        {showPopupConfirmUpdate && renderPopupConfirmUpdate()}
      </>
    );
  } else {
    if (props.popout) {
      document.body.className = 'body-full-width';
      return <>
        {isAdmin === true ? renderComponent() : renderComponentNotAdmin()}
        {showPopupConfirmUpdate && renderPopupConfirmUpdate()}
      </>;
    } else {
      return <></>
    }
  }
};

const mapStateToProps = ({ productPopupEditState, applicationProfile, authentication, screenMoveState }: IRootState) => ({
  authorities: authentication.account.authorities,
  tenant: applicationProfile.tenant,
  productData: productPopupEditState.dataInfo,
  fieldInfo: productPopupEditState.fieldInfo,
  idSuccess: productPopupEditState.idSuccess,
  idCreateSuccess: productPopupEditState.idCreateSuccess,
  errorValidates: productPopupEditState.errorItems,
  actionType: productPopupEditState.action,
  errorMessage: productPopupEditState.errorMessage,
  successMessage: productPopupEditState.successMessage,
  screenMoveInfo: screenMoveState.screenMoveInfo,
  errorCode: productPopupEditState.errorCode,
});

const mapDispatchToProps = {
  handleSubmitProductData,
  handleGetDataProduct,
  moveScreenReset,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModalCreateEditProduct);
