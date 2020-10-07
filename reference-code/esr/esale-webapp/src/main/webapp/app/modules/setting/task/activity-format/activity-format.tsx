import React, { useState, useEffect, createRef, useRef } from 'react';
import _, {isEqual} from 'lodash';
import { translate } from 'react-jhipster';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { getJsonBName } from "app/modules/setting/utils";
import { OPERATION_FUNICTION, MODE_POPUP, SHOW_MESSAGE } from "app/modules/setting/constant";
import {
  reset,
  handleGetActivityFormat,
  handleCheckDelete,
  resetIdss,
  ActivityFormatAction
} from "./activity-format.reducer";
import { ActivityFormatAdd } from './activity-format-add';
import ConfirmDialog from 'app/shared/layout/dialog/confirm-dialog';
import { isNullOrUndefined } from "util";
import BoxMessage, { MessageType } from 'app/shared/layout/common/box-message';
import ProductActivityHeader from 'app/modules/setting/task/activity-format/activity-format-header'
import { getFieldLabel } from 'app/shared/util/string-utils';
import { DragLayer } from '../../components/DragLayer';
import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';

export interface IActivityFormatProps extends StateProps, DispatchProps {
  activityFormatChange,
  resetpapge?,
  showMessage?
  setDataChanged?
}

export const ActivityFormat = (props: IActivityFormatProps) => {

  const [openDialogAdd, setOpenDialogAdd] = useState(false);
  const [activity, setActivity] = useState({});
  const [activityFormatItem, setActivityFormatItem] = useState(null);
  const [activityFormats, setActivityFormats] = useState([]);
  const [showProductTrading, setShowProductTrading] = useState(true);
  const [showIcon, setShowIcon] = useState(0);
  const [idfieldOperation, setIdfieldOperation] = useState(null);
  const [activityFormatsUpdate, setActivityFormatsUpdate] = useState({});
  const [mode, setMode] = useState(MODE_POPUP.CREATE);
  const [codeMessage, setCodeMessage] = useState(0);
  const [activityFormatItemDelete, SetActivityFormatItemDelete] = useState({});

  const buttonModal = useRef(null);

  const changeOperationFunction = (lstProductTrade) => {
    const listActivityFormats = []
    lstProductTrade.forEach(element => {
      const array = Object.values(element['productTradingFieldUse'])
      const a = array.find(x => x === 1)
      if (a === 1) {
        const fieldUse = _.omit(element['fieldUse'], idfieldOperation)
        fieldUse[`${idfieldOperation}`] = 1
        element['fieldUse'] = fieldUse
      }
      listActivityFormats.push({ ...element })
    });
    setActivityFormats(listActivityFormats)
  }
  const createParamUpdate = (item, type, param) => {
    const paramupdate = {}
    let itemDelete = {}
    let flaf = true
    paramupdate['listItem'] = param['listItem'] !== undefined ? [...param['listItem']] : []
    paramupdate['deletedActivityFormats'] = param['deletedActivityFormats'] !== undefined ? [...param['deletedActivityFormats']] : []

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
            if (item.activityFormatId !== 0) {
              if (obj.activityFormatId === item.activityFormatId) {
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
        /* create deletedPositions */
        itemDelete = _.find(param['listItem'], { 'displayOrder': item.displayOrder });
        if (itemDelete !== undefined) {
          const lstPositions = _.reject(param['listItem'], (obj) => {
            return item.activityFormatId > 0 ?
              obj.activityFormatId === item.activityFormatId :
              obj.displayOrder === item.displayOrder;
          });
          paramupdate['listItem'] = [...lstPositions]
        }
        if (item.activityFormatId !== 0) {
          paramupdate['deletedActivityFormats'].push(item.activityFormatId)
        }
        return paramupdate;
    }

  }

  const checkupdate = (item) => {
    let lstProductTrade = []
    if (item.activityFormatId !== 0) {
      lstProductTrade = _.map(activityFormats, obj => {
        if (obj.activityFormatId === item.activityFormatId) {
          obj = _.clone(item);
        }
        return obj;
      });
    } else {
      lstProductTrade = _.map(activityFormats, obj => {
        if (obj.displayOrder === item.displayOrder) {
          obj = _.clone(item);
        }
        return obj;
      });
    }
    return lstProductTrade
  }

  const changeClickIcon = (item, activityItem) => {
    setCodeMessage(0);
    let paramUpdate = { ...activityFormatsUpdate }
    const fieldUseItem = activityItem['fieldUse']
    const fieldUse = _.omit(activityItem['fieldUse'], item.fieldId)
    const activityItemOut = _.omit(activityItem, 'fieldUse')
    fieldUse[`${item.fieldId}`] = fieldUseItem[`${item.fieldId}`] === 1 ? 0 : 1
    activityItemOut['fieldUse'] = fieldUse
    const lstProductTrade = checkupdate(activityItemOut)
    setActivityFormats([...lstProductTrade]);
    setActivityFormatsUpdate(paramUpdate = createParamUpdate(activityItemOut, MODE_POPUP.EDIT, paramUpdate))
    // Check dirty
    const dataInit = activity
      && Array.isArray(activity['activityFormats'])
      && activity['activityFormats'].filter(itemDraft => itemDraft.activityFormatId === activityItemOut.activityFormatId)
    const check = isEqual(dataInit[0], activityItemOut);
    if (!check)
      props.setDataChanged(true);
    else
      props.setDataChanged(false);
    // Check dirty end
    props.activityFormatChange(paramUpdate)
  }

  const changeClickIconProdtrading = (item, activityItem) => {
    setCodeMessage(0);
    let paramUpdate = { ...activityFormatsUpdate }
    const fieldUseItem = activityItem['productTradingFieldUse']
    const fieldUse = _.omit(activityItem['productTradingFieldUse'], item.fieldId)
    const activityItemOut = _.omit(activityItem, 'productTradingFieldUse')
    const isCheck = fieldUseItem[`${item.fieldId}`] === 1 ? 0 : 1;
    fieldUse[`${item.fieldId}`] = isCheck;
    activityItemOut['productTradingFieldUse'] = fieldUse
    // Check dirty
    const dataInit = activity
      && Array.isArray(activity['activityFormats'])
      && activity['activityFormats'].filter(itemDraft => itemDraft.activityFormatId === activityItemOut.activityFormatId)
    const check = isEqual(dataInit[0], activityItemOut);
    if (!check)
      props.setDataChanged(true);
    else
      props.setDataChanged(false);
    // Check dirty end
    const lstProductTrade = checkupdate(activityItemOut)
    changeOperationFunction(lstProductTrade)
    // update product trading parent
    if (isCheck === 1) {
      const fields = activityItem['fieldUse'];
      changeOperationFunction(lstProductTrade);
      fields[`${idfieldOperation}`] = 1
      activityItemOut['fieldUse'] = fields
    }
    paramUpdate = createParamUpdate(activityItemOut, MODE_POPUP.EDIT, paramUpdate)
    setActivityFormatsUpdate(paramUpdate)
    props.activityFormatChange(paramUpdate)
  }

  /**
   * on click icon check in product trading parent
   * @param item field
   * @param activityItem activity format
   */
  const changeClickIconProductTradingParent = (item, activityItem) => {
    setCodeMessage(0);
    const fieldUseItem = activityItem['fieldUse']
    const isCheck = fieldUseItem[`${item.fieldId}`] === 1 ? 0 : 1;
    // update value product trading child
    let activityItemOut = activityItem;
    if (!isCheck) {
      let productTradingFieldUse = activityItem['productTradingFieldUse'];
      const arrayUncheck = Object.values(productTradingFieldUse).filter(value => value === 0);
      if (arrayUncheck.length > 0) {
        activityItemOut = _.omit(activityItem, 'productTradingFieldUse')
        productTradingFieldUse = _.mapValues(productTradingFieldUse, () => isCheck);
        activityItemOut['productTradingFieldUse'] = _.cloneDeep(productTradingFieldUse)
      }
    }
    // update value product trading parent
    changeClickIcon(item, activityItemOut);
  }

  const editActivityFormat = (item) => {
    props.reset();
    setCodeMessage(0);
    setMode(MODE_POPUP.EDIT);
    setOpenDialogAdd(true);
    setActivityFormatItem(item);
  }

  const getErrorMessage = (errorCode) => {
    let errorMessage = '';
    if (!isNullOrUndefined(errorCode)) {
      errorMessage = translate('messages.' + errorCode);
    }
    return errorMessage;
  }

  /**
  * sonnx start
  */
  useEffect(() => {
    if (codeMessage !== SHOW_MESSAGE.NONE) {
      let msgInfoSuccess = '';
      if (codeMessage === SHOW_MESSAGE.SUCCESS) {
        msgInfoSuccess = getErrorMessage("INF_COM_0008")
      } else if (codeMessage === SHOW_MESSAGE.ERROR) {
        msgInfoSuccess = getErrorMessage(props.errorMessage[0] && props.errorMessage[0]['errorCode'])
      } else if (codeMessage === SHOW_MESSAGE.CAN_NOT_DELETE) {
        msgInfoSuccess = getErrorMessage("INF_SET_0007")
      }
      const code = _.cloneDeep(codeMessage)
      props.showMessage(code, msgInfoSuccess)
      setCodeMessage(SHOW_MESSAGE.NONE);
    }
  }, [codeMessage])

  /**
  * sonnx end
  */

  /**
   *
   * @param item field info item
   * @param activityItem  activity format item
   * @param type type false: product trading field
   */
  const showcolor = (item, activityItem, type?) => {
    if (type) {
      const checkColor = activityItem['fieldUse']
      let flagColor = 0
      activityFormats.forEach(element => {
        const fieldUse = element['fieldUse']
        if (fieldUse[`${item.fieldId}`] === 1) {
          return flagColor += 1
        }
      });
      return flagColor === activityFormats.length ? 2 : checkColor[`${item.fieldId}`]
    } else {
      const checkColor = activityItem['productTradingFieldUse']
      let flagColor = 0
      activityFormats.forEach(e => {
        const fieldUse = e['productTradingFieldUse']
        if (fieldUse[`${item.fieldId}`] === 1) {
          return flagColor += 1
        }
      });
      return flagColor === activityFormats.length ? 2 : checkColor[`${item.fieldId}`]
    }
  }

  const deletectivityFormat = async (item, actionDelete?) => {
    props.reset(ActivityFormatAction.Success);
    setCodeMessage(0);
    SetActivityFormatItemDelete(item)
    if (actionDelete || item.activityFormatId === 0) {
      let paramUpdate = { ...activityFormatsUpdate }
      const result = await ConfirmDialog({
        title: (<>{translate('employees.top.dialog.title-delete-group')}</>),
        message: translate('messages.WAR_COM_0001', { itemName: getFieldLabel(item, "name") }),
        confirmText: translate('employees.top.dialog.confirm-delete-group'),
        confirmClass: "button-red",
        cancelText: translate('employees.top.dialog.cancel-text'),
        cancelClass: "button-cancel"
      });
      if (result) {
        let lstPositions = []
        if (item.activityFormatId === 0) {
          lstPositions = _.reject(activityFormats, (obj) => {
            return obj.displayOrder === item.displayOrder;
          });
        } else {
          lstPositions = _.reject(activityFormats, (obj) => {
            return obj.activityFormatId === item.activityFormatId;
          });
        }
        setActivityFormats([...lstPositions]);
        setActivityFormatsUpdate(paramUpdate = createParamUpdate(item, null, activityFormatsUpdate))
        props.setDataChanged(true);
        props.activityFormatChange(paramUpdate)
      }
    } else {
      props.handleCheckDelete(item.activityFormatId)
    }
  }

  const addActivityFormat = (item) => {
    let paramUpdate = { ...activityFormatsUpdate }
    const fieldUse = {}
    const productTradingFieldUse = {}
    activity['fieldInfo'] && activity['fieldInfo'].forEach(element => {
      fieldUse[`${element.fieldId}`] = 0
    });
    activity['productTradingFieldInfo'] && activity['productTradingFieldInfo'].forEach(element => {
      productTradingFieldUse[`${element.fieldId}`] = 0
    });
    if (item.displayOrder) {
      const lstProductTrade = checkupdate(item)
      setActivityFormats([...lstProductTrade]);
      setActivityFormatItem(null);
      setActivityFormatsUpdate(paramUpdate = createParamUpdate(item, MODE_POPUP.EDIT, paramUpdate))
      props.activityFormatChange(paramUpdate)
    } else {
      for (let index = 0; index <= activityFormats.length; index++) {
        if (index !== 0 && index === activityFormats.length) {
          item['displayOrder'] = activityFormats[index - 1].displayOrder + 1;
        } else {
          item['displayOrder'] = 1;
        }
        item['activityFormatId'] = 0;
      }
      item['fieldUse'] = fieldUse;
      item['productTradingFieldUse'] = productTradingFieldUse;
      setActivityFormats([...activityFormats, { ...item }]);
      setActivityFormatsUpdate(paramUpdate = createParamUpdate(item, MODE_POPUP.CREATE, paramUpdate))
    }
    setOpenDialogAdd(!openDialogAdd)
    setShowIcon(0)
    props.activityFormatChange(paramUpdate)
  }
  const togglePopup = (type) => {
    props.reset(props.actionRequest);
    setCodeMessage(0);
    setOpenDialogAdd(!openDialogAdd)
    setMode(type);
    setShowIcon(0)
    switch (type) {
      case MODE_POPUP.CREATE:
        setActivityFormatItem(null)
        break;
      case MODE_POPUP.EDIT:
        break;
      default:
        break;
    }
  }

  const dataAfterDrapDrop = (data) => {
    let paramUpdate = { ...activityFormatsUpdate }
    for (let index = 0; index < data.length; index++) {
      data[index].displayOrder = index + 1
      setActivityFormatsUpdate(paramUpdate = createParamUpdate(data[index], MODE_POPUP.EDIT, paramUpdate))
      props.setDataChanged(true);
      props.activityFormatChange(paramUpdate)
    }
  }

  const heightRef = createRef<any>()

  const [heightCol, setHeightCol] = useState<number>(0)
  const [widthCol, setWidthCol] = useState<number>(0)

  useEffect(() => {
    setHeightCol(heightRef?.current?.clientHeight)
  })

  useEffect(() => {
    setActivityFormatsUpdate({});
    props.reset()
    props.handleGetActivityFormat();
  }, [props.resetpapge]);

  useEffect(() => {
    if (props.iDSS !== null) {
      setActivityFormatsUpdate({})
      props.handleGetActivityFormat();
      setCodeMessage(SHOW_MESSAGE.SUCCESS);
      props.resetIdss();
    }
  }, [props.iDSS]);

  useEffect(() => {
    if (props.activity) {
      props.activity.fieldInfo && props.activity.fieldInfo.forEach(element => {
        if (getJsonBName(element['fieldLabel']) === OPERATION_FUNICTION) {
          setIdfieldOperation(element['fieldId'])
        }
      });
      setActivityFormats(props.activity.activityFormats)
      setActivity(props.activity);
    }
  }, [props.activity]);

  useEffect(() => {
    setCodeMessage(SHOW_MESSAGE.NONE);

    if (props.errorMessage && props.errorMessage.length > 0) {
      setCodeMessage(SHOW_MESSAGE.ERROR);
    }
    if (props.checkDelete !== null && props.checkDelete.length === 0) {
      deletectivityFormat(activityFormatItemDelete, true)
      setCodeMessage(SHOW_MESSAGE.NONE);
    }
    if (props.checkDelete !== null &&
      props.checkDelete.length > 0) {
      setCodeMessage(SHOW_MESSAGE.CAN_NOT_DELETE);
    }
  }, [props.errorMessage, props.checkDelete]);


  return (
    <>
      <div className="form-group setting-popup-heigth h-100">
        <div className="form-group h-100">
          <label className="font-size-18">{translate('setting.task.activityFormat.title')}</label>
          <div className="block-feedback block-feedback-blue border-radius-12 magin-top-5">
            {translate('setting.activity.msg')}
          </div>
          <div className="position-relative">
            <button ref={buttonModal} className={`button-primary btn-padding`} onClick={() => {buttonModal.current.blur(); togglePopup(MODE_POPUP.CREATE);}}>{translate('setting.task.activityFormat.btnAdd')}</button>
            {
              openDialogAdd && <ActivityFormatAdd activityFormatItem={activityFormatItem}
                changeStatusDialog={() => togglePopup(MODE_POPUP.EDIT)}
                addactivity={addActivityFormat}
                modePopup={mode}
                setDataChanged={props.setDataChanged}
                langKey={props.account["languageCode"]} />
            }
          </div>
          <DndProvider backend={Backend}>
            {activityFormats && activityFormats.length > 0 ?
              <div className="table-responsive" style={{ height: "78%" }}>
                <table className="table-default" ref={heightRef} >
                  <tbody>
                    <tr>
                      <td className="title-table" colSpan={2}>{translate('setting.task.activityFormat.tbl.menu')}</td>
                      <td className="title-table" colSpan={activityFormats && activityFormats.length}>{translate('setting.task.activityFormat.tbl.format')}</td>
                    </tr>
                    <tr>
                      <td className="title-table w-cus5" style={{minWidth: 70}}>{translate('setting.task.activityFormat.tbl.no')}</td>
                      <td className="title-table" style={{minWidth: 330}}>{translate('setting.task.activityFormat.tbl.field')}</td>

                      {
                        activityFormats && activityFormats.length > 0 && activityFormats.map((item, index) => (

                          <ProductActivityHeader
                            setWidthCol={setWidthCol}
                            key={index}
                            dataInfo={activityFormats}
                            setDataInfo={value => setActivityFormats(value)}
                            fieldInfo={activity['fieldInfo']}
                            // setFieldInfo={value=>setFieldInfo(value)}
                            itemData={item}
                            itemIndex={index}
                            showIcon={showIcon}
                            openDialogAdd={openDialogAdd}
                            editActivityFormat={value => editActivityFormat(value)}
                            deletectivityFormat={value => deletectivityFormat(value)}
                            setShowIcon={value => setShowIcon(value)}
                            dataAfterDragDrop={dataAfterDrapDrop}
                          />
                          // <td key={index} className={showIcon === (index + 1) ? "title-table w-cus10 position-relative background-td" : "title-table"}
                          //   onMouseEnter={() => setShowIcon(index + 1)}
                          //   onMouseLeave={() => !openDialogAdd && setShowIcon(0)}>
                          //   {getJsonBName(item.name)}
                          //   {
                          //     showIcon === (index + 1) && (
                          //       <span className="list-icon list-icon__center">
                          //         <a className="icon-primary icon-edit icon-custom mr-1" onClick={() => editActivityFormat(item)} />
                          //         <a className="icon-primary icon-erase icon-custom" onClick={() => deletectivityFormat(item)} />
                          //       </span>
                          //     )
                          //   }
                          // </td>
                        ))
                      }
                    </tr>
                    {
                      activity['fieldInfo'] && activity['fieldInfo'].length > 0 && activity['fieldInfo'].map((item, index) => (
                        item.fieldId !== idfieldOperation ?
                          <tr key={index}>
                            <td className="title-table">{index + 1}</td>
                            <td className="title-table">{getJsonBName(item.fieldLabel)}</td>
                            {
                              activityFormats && activityFormats.length > 0 && activityFormats.map((activityItem, idx) => (
                                <td key={`activityItem_${activityItem.activityFormatId}_${idx}`} className={showcolor(item, activityItem, true) === 2 ?
                                  "title-table text-center color-red" :
                                  showcolor(item, activityItem, true) === 1 ? "title-table text-center color-blue" :
                                    "title-table text-center color-999"}>
                                  <a onClick={() => changeClickIcon(item, activityItem)}><i className="fas fa-check" /></a>
                                </td>
                              ))
                            }
                          </tr>
                          :
                          <>
                            <tr key={item.fieldId}>
                              <td className="title-table">{index + 1}</td>
                              <td className="title-table">{getJsonBName(item.fieldLabel)}
                                <span>
                                  <a><i className={`${showProductTrading ? "fas fa-chevron-up" : "fas fa-chevron-down"} ml-3 color-999`} onClick={() => setShowProductTrading(!showProductTrading)} /></a>
                                  <img src="../../../content/images/ic-question.svg" className="ml-3"
                                    data-toggle="tooltip" title={translate('setting.task.activityFormat.toolTip')}
                                  />
                                </span>

                              </td>
                              {
                                activityFormats && activityFormats.length > 0 && activityFormats.map((activityItem, idx) => (
                                  <td key={idx} className={showcolor(item, activityItem, true) === 2 ?
                                    "title-table text-center color-red" :
                                    showcolor(item, activityItem, true) === 1 ? "title-table text-center color-blue" :
                                      "title-table text-center color-999"}>
                                    {/* icon check on product trading */}
                                    <a onClick={() => changeClickIconProductTradingParent(item, activityItem)}><i className="fas fa-check" /></a>
                                  </td>
                                ))
                              }
                            </tr>
                            {showProductTrading && activity && activity['productTradingFieldInfo'].length > 0 && activity['productTradingFieldInfo'].map((productTradingItem, productTradingIndex) => (
                              <tr key={productTradingIndex}>
                                <td className="title-table text-center p-0">
                                  <div className="td-custom">
                                    {productTradingIndex + 1}
                                  </div>
                                </td>
                                <td className="title-table">{getJsonBName(productTradingItem.fieldLabel)}</td>
                                {
                                  activityFormats && activityFormats.length > 0 && activityFormats.map((activityItem, index1) => (
                                    <td key={index1} className={showcolor(productTradingItem, activityItem) === 0 ?
                                      "title-table text-center color-999" :
                                      showcolor(productTradingItem, activityItem) === 1 ? "title-table text-center color-blue" :
                                        "title-table text-center color-red"}>
                                      <a onClick={() => changeClickIconProdtrading(productTradingItem, activityItem)}><i className="fas fa-check" /></a>
                                    </td>
                                  ))
                                }
                              </tr>
                            ))}</>

                      ))
                    }
                  </tbody>
                </table>
              </div>
              :
              <div className="absolute-center">
                {
                  props.actionRequest === ActivityFormatAction.Success &&
                  <div className="align-center">
                    <div>{translate("messages.INF_COM_0020", { 0: translate('setting.task.titleInEmpty') })}</div>
                  </div>
                }
              </div>}
            <DragLayer width={widthCol - 10} height={heightCol} borderRadius={20} />
          </DndProvider>
        </div>
      </div>
    </>
  )

}
const mapStateToProps = ({ activityFormat, authentication }: IRootState) => ({
  errorMessage: activityFormat.errorItems,
  activity: activityFormat.activity,
  account: authentication.account,
  actionRequest: activityFormat.action,
  iDSS: activityFormat.activityUpdate,
  checkDelete: activityFormat.checkDelete
});

const mapDispatchToProps = {
  reset,
  handleGetActivityFormat,
  handleCheckDelete,
  resetIdss
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ActivityFormat);
