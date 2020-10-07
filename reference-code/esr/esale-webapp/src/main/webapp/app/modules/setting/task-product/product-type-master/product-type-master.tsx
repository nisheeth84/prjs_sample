import React, { useState, useEffect, createRef, useRef } from 'react';
import { translate } from 'react-jhipster';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';

import { getJsonBName ,convertHTMLEncString} from "app/modules/setting/utils";
import ProductTypeAdd from '../product-type-add'
import { MODE_POPUP } from "app/modules/setting/constant";
import _ from 'lodash';
import {
  reset,
  checkDeleteProType,
  handleGetProductTypeMaster
} from "./product-type-master.reducer";
import ConfirmDialog from 'app/shared/layout/dialog/confirm-dialog';
import { isNullOrUndefined } from "util";
import BoxMessage, { MessageType } from 'app/shared/layout/common/box-message';
import ProductTypeMasterHeader from './product-type-master-header';
import { DragLayer } from '../../components/DragLayer';
import { revertHTMLString } from 'app/modules/products/utils';

export interface IProductTypeMasterProps extends StateProps, DispatchProps {
  productTypeChange,
  resetpapge?
}

export const ProductTypeMaster = (props: IProductTypeMasterProps) => {
  const [showIcon, setShowIcon] = useState(0);
  const [dataInfo, setDataInfo] = useState(null);
  const [productTypeUpdate, setProductTypeUpdate] = useState({});
  const [fieldInfo, setFieldInfo] = useState([]);
  const [openDialogAdd, setOpenDialogAdd] = useState(false);
  const [productTypeItem, setProductTypeItem] = useState(null);
  const [mode, setMode] = useState(MODE_POPUP.CREATE);
  const [codeMessage, setCodeMessage] = useState(0);
  const [productTypeMasterDelete, SetroductTypeMasterDelete] = useState({});
  const [showComfirmdata, setShowComfirmdata] = useState(false);
  
  const buttonModal = useRef(null);  

  const { dataResponse, resetpapge } = props

  useEffect(() => {
    setProductTypeUpdate({})
    props.reset();
    props.handleGetProductTypeMaster();
    setDataInfo(_.get(dataResponse, 'productTypes', []))
  }, [resetpapge]);

  const createParamUpdate = (item, type, param) => {
    const paramupdate = {}
    let itemDelete = {}
    let flaf = true
    paramupdate['listItem'] = param['listItem'] !== undefined ? [...param['listItem']] : []
    paramupdate['deletedProductTypes'] = param['deletedProductTypes'] !== undefined ? [...param['deletedProductTypes']] : []

    switch (type) {
      case MODE_POPUP.CREATE:
        if (paramupdate['listItem'].length > 0) {
          paramupdate['listItem'] = [...param['listItem'], { ...item }]
        } else {
          paramupdate['listItem'] = [{ ...item }]
        }
        return paramupdate;
      case MODE_POPUP.EDIT:
        if (paramupdate['listItem'].length > 0) {
          const lstProductTrade = _.map(param['listItem'], obj => {
            if (item.productTypeId > 0) {
              if (obj.productTypeId === item.productTypeId) {
                obj = _.clone(item);
                flaf = false
              }
            } else {
              if (obj.displayOrder === item.displayOrder) {
                obj = _.clone(item);
                flaf = false
              }
            }
            return obj;
          });

          paramupdate['listItem'] = flaf ? [...lstProductTrade, { ...item }] : [...lstProductTrade]
        } else {
          paramupdate['listItem'] = [{ ...item }]
        }

        return paramupdate
      default:
        /* create deletedProductTypes */
        itemDelete = _.find(param['listItem'], { 'displayOrder': item.displayOrder });
        if (itemDelete !== undefined) {
          const lstProType = _.reject(param['listItem'], (obj) => {
            return item.productTypeId > 0 ?
              obj.productTypeId === item.productTypeId :
              obj.displayOrder === item.displayOrder;
          });
          paramupdate['listItem'] = [...lstProType]
        }
        if (item.productTypeId !== 0) {
          paramupdate['deletedProductTypes'].push(item.productTypeId)
        }
        return paramupdate;
    }

  }

  const getErrorMessage = (errorCode) => {
    let errorMessage = '';
    if (!isNullOrUndefined(errorCode)) {
      errorMessage = translate('messages.' + errorCode);
    }
    return errorMessage;
  }

  const renderErrorMessage = () => {
    switch (codeMessage) {
      case 2:
        return <><div>
          <BoxMessage messageType={MessageType.Error}
            message={getErrorMessage(props.messageError[0] && props.messageError[0]['errorCode'])} />
        </div>
        </>
      case 3:
        return <><div className='magin-top-5'>
          <BoxMessage messageType={MessageType.Error}
            message={getErrorMessage("INF_SET_0004")
            } />
        </div>
        </>
      default:
        break;
    }

  }

  const changeClickIcon = (item, proItem) => {
    let paramUpdate = { ...productTypeUpdate }
    const fieldUseItem = proItem['fieldUse']
    const fieldUse = _.omit(proItem['fieldUse'], item.fieldId)
    const proItemOut = _.omit(proItem, 'fieldUse')
    fieldUse[`${item.fieldId}`] = fieldUseItem[`${item.fieldId}`] === 1 ? 0 : 1
    proItemOut['fieldUse'] = fieldUse
    const lstProductTrade = _.map(dataInfo, obj => {
      if (obj.displayOrder === proItemOut.displayOrder) {
        obj = _.clone(proItemOut);
      }
      return obj;
    });
    setDataInfo([...lstProductTrade]);
    setProductTypeUpdate(paramUpdate = createParamUpdate(proItemOut, MODE_POPUP.EDIT, paramUpdate))
    props.productTypeChange(paramUpdate)
  }

  const showcolor = (item, proItem) => {
    const checkColor = proItem['fieldUse']
    let flagColor = 0
    dataInfo.forEach(element => {
      const fieldUse = element['fieldUse']
      if (fieldUse[`${item.fieldId}`] === 1) {
        return flagColor += 1
      }
    });
    return flagColor === dataInfo.length ? 2 : checkColor[`${item.fieldId}`]
  }

  const editProductType = (item) => {
    setCodeMessage(0);
    setMode(MODE_POPUP.EDIT);
    setOpenDialogAdd(true);
    setProductTypeItem(item);
  }

  const addproductType = (item) => {
    let paramUpdate = { ...productTypeUpdate }
    const fieldUse = {}
    fieldInfo && fieldInfo.forEach(element => {
      fieldUse[`${element.fieldId}`] = 0
    });
    if (item.displayOrder) {
      const lstProductTrade = _.map(dataInfo, obj => {
        if (item.productTypeId > 0) {
          if (obj.productTypeId === item.productTypeId) {
            obj = _.clone(item);
          }
        } else {
          if (obj.displayOrder === item.displayOrder) {
            obj = _.clone(item);
          }
        }
        return obj;
      });
      setDataInfo([...lstProductTrade]);
      setProductTypeItem(null);
      setProductTypeUpdate(paramUpdate = createParamUpdate(item, MODE_POPUP.EDIT, paramUpdate))
      props.productTypeChange(paramUpdate)
    } else {
      for (let index = 0; index <= dataInfo.length; index++) {
        if (index !== 0 && index === dataInfo.length) {
          item['displayOrder'] = dataInfo[index - 1].displayOrder + 1;
        } else {
          item['displayOrder'] = 1;
        }
        item['productTypeId'] = 0;
      }
      item['fieldUse'] = fieldUse;
      setDataInfo([...dataInfo, { ...item }]);
      setProductTypeUpdate(paramUpdate = createParamUpdate(item, MODE_POPUP.CREATE, paramUpdate))
    }
    setOpenDialogAdd(!openDialogAdd)
    setShowIcon(0)
    props.productTypeChange(paramUpdate)
  }

  const togglePopup = (type) => {
    setCodeMessage(0);
    setOpenDialogAdd(!openDialogAdd)
    setMode(type);
    setShowIcon(0)
    switch (type) {
      case MODE_POPUP.CREATE:
        setProductTypeItem(null)
        break;
      case MODE_POPUP.EDIT:
        break;
      default:
        break;
    }
  }

  const deleteProductType = async (item, actionDelete?) => {
    props.reset()
    setCodeMessage(0);
    SetroductTypeMasterDelete(item)
    if (actionDelete || item.positionId === 0) {
      let paramUpdate = { ...productTypeUpdate }
      const itemName = convertHTMLEncString(getJsonBName(item.productTypeName));
      const result = await ConfirmDialog({
        title: (<>{translate('employees.top.dialog.title-delete-group')}</>),
        message: revertHTMLString(translate('messages.WAR_COM_0001', { itemName: getJsonBName(itemName) })),
        confirmText: translate('employees.top.dialog.confirm-delete-group'),
        confirmClass: "button-red",
        cancelText: translate('employees.top.dialog.cancel-text'),
        cancelClass: "button-cancel"
      });
      if (result) {
        const lstProType = _.reject(dataInfo, (objDel) => {
          return item.productTypeId > 0 ?
            objDel.productTypeId === item.productTypeId :
            objDel.displayOrder === item.displayOrder;
        });
        if(_.isEmpty(lstProType))
          setShowComfirmdata(false)
        setDataInfo([...lstProType]);
        setProductTypeUpdate(paramUpdate = createParamUpdate(item, null, productTypeUpdate))
        props.productTypeChange(paramUpdate)
      }
    } else {
      props.checkDeleteProType(item.productTypeId)
    }
  }
  const dataAfterDrapDrop = (data) => {
    let paramUpdate = { ...productTypeUpdate }
    for (let index = 0; index < data.length; index++) {
      data[index].displayOrder = index + 1
      setProductTypeUpdate(paramUpdate = createParamUpdate(data[index], MODE_POPUP.EDIT, paramUpdate))
      props.productTypeChange(paramUpdate)
    }
  }


  useEffect(() => {
    if (props.iDSS !== null) {
      props.handleGetProductTypeMaster();
      setProductTypeUpdate({})
    }
  }, [props.iDSS]);

  useEffect(() => {
    if (dataResponse['fieldInfo'] && dataResponse['fieldInfo'].length > 0) {
      setShowComfirmdata(true)
      setFieldInfo(dataResponse['fieldInfo'])
    }else{
      setShowComfirmdata(false)
    }
    if (dataResponse['productTypes'] && dataResponse['productTypes'].length > 0) {
      setDataInfo(dataResponse['productTypes'])
    }
  }, [dataResponse]);

  useEffect(() => {
    setCodeMessage(0);
    if (props.messageError && Array.isArray(props.messageError) && props.messageError.length > 0) {
      setCodeMessage(2);
    }
    if (props.chetdelete && props.chetdelete !== null && props.chetdelete.length === 0) {
      deleteProductType(productTypeMasterDelete, true)
      setCodeMessage(0);
    }
    if (props.chetdelete && props.chetdelete !== null &&
      props.chetdelete.length > 0) {
      setCodeMessage(3);
    }
  }, [props.iDSS, props.messageError, props.chetdelete]);


  const heightRef = createRef<any>()

  const [heightCol, setHeightCol] = useState<number>(0)
  const [widthCol, setWidthCol] = useState<number>(0)

  useEffect(() => {
    setHeightCol(heightRef?.current?.clientHeight)
  })

  return (
    <>
      <div className="setting-popup-content mt-2">
        <div className="form-group setting-popup-height">
          <label className="font-size-18">{translate('setting.product.header')}</label>
          <div className="block-feedback background-feedback border-radius-12 magin-top-5 pl-5 pr-5">
            {translate('setting.product.defaultMess')}
          </div>
          {codeMessage !== 1 && renderErrorMessage()}
          <div>
            <button ref={buttonModal} type='button' className={`button-primary btn-padding ${openDialogAdd && 'active'}`} onClick={() => {buttonModal.current.blur(); togglePopup(MODE_POPUP.CREATE)}}> {translate('setting.task.activityFormat.btnAdd')}</button>
            {
              openDialogAdd && <ProductTypeAdd productTypeItem={productTypeItem}
                dismissDialog={togglePopup}
                productTypeChange={addproductType}
                modePopup={mode}
                langKey={props.account["languageCode"]} />
            }
          </div>
          <DndProvider backend={Backend}>
            {dataInfo && dataInfo.length > 0 ?
              <div className="table-responsive aaaaaabbbb">
                <table className="table-default" ref={heightRef} >
                  <tbody>
                    <tr>
                      <td className="title-table" colSpan={2}>{translate('setting.task.activityFormat.tbl.menu')}</td>
                      <td className="title-table" colSpan={dataInfo && dataInfo.length}>{translate('setting.product.header')}</td>
                    </tr>
                    <tr>
                      <td className="title-table w-cus5">{translate('setting.task.activityFormat.tbl.no')}</td>
                      <td className="title-table w-cus10">{translate('setting.task.activityFormat.tbl.field')}</td>
                      {
                        dataInfo && dataInfo.length > 0 && dataInfo.map((item, index) => (
                          <ProductTypeMasterHeader
                            setWidthCol={setWidthCol}
                            key={index}
                            dataInfo={dataInfo}
                            setDataInfo={value => setDataInfo(value)}
                            fieldInfo={fieldInfo}
                            setFieldInfo={value => setFieldInfo(value)}
                            itemData={item}
                            itemIndex={index}
                            showIcon={showIcon}
                            openDialogAdd={openDialogAdd}
                            editProductType={value => editProductType(value)}
                            deleteProductType={value => deleteProductType(value)}
                            setShowIcon={value => setShowIcon(value)}
                            dataAfterDragDrop={dataAfterDrapDrop}
                          />
                        ))
                      }
                    </tr>
                    {
                      fieldInfo && fieldInfo.length > 0 && fieldInfo.map((item, index) => (
                        <tr key={index}>
                          <td className="title-table">{index + 1}</td>
                          <td className="title-table">{getJsonBName(item.fieldLabel)}</td>
                          {
                            dataInfo && dataInfo.length > 0 && dataInfo.map((proItem, idx) => (
                              <td key={idx} className={
                                showcolor(item, proItem) === 2 ?
                                  "title-table text-center color-red w-cus10" :
                                  showcolor(item, proItem) === 1 ? "title-table text-center color-blue w-cus10" :
                                    "title-table text-center color-999 w-cus10"}>
                                <a onClick={() => changeClickIcon(item, proItem)}><i className="fas fa-check" /></a>
                              </td>
                            ))
                          }
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div> :
              <div className="show-message-nodata position-absolute" >
                { (props.loadding || (dataInfo &&  dataInfo.length === 0 )) &&  translate("messages.INF_COM_0020", { 0: translate('setting.product.title') })}
              </div >
            }
            <DragLayer width={widthCol - 10} height={heightCol} borderRadius={20} />
          </DndProvider>
        </div>
      </div>
    </>
  )

}
const mapStateToProps = ({ productTypeMaster, authentication }: IRootState) => ({
  dataResponse: productTypeMaster.dataGet,
  account: authentication.account,
  chetdelete: productTypeMaster.chetdelete,
  iDSS: productTypeMaster.listId,
  messageError: productTypeMaster.errorItems,
  loadding: productTypeMaster.loadding
});

const mapDispatchToProps = {
  reset,
  checkDeleteProType,
  handleGetProductTypeMaster
};
type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductTypeMaster);