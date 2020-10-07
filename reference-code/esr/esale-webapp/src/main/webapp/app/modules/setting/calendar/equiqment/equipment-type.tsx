import React, { useState, useEffect, useRef } from 'react';
import { translate } from 'react-jhipster';
import { EquipmentAdd } from './equipment-add';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import {
  reset,
  handleGetData,
  handleCheckDelete,
  resetIdss
} from 'app/modules/setting/calendar/equiqment/equipment-type.reducer';
import { getJsonBName, convertHTMLEncString } from "app/modules/setting/utils";
import {
  MODE_POPUP,
  CALENDAR_TYPE,
  SHOW_MESSAGE,
  TIME_OUT_MESSAGE
} from 'app/modules/setting/constant';
import ConfirmDialog from 'app/shared/layout/dialog/confirm-dialog';
import { isNullOrUndefined } from "util";
import BoxMessage, { MessageType } from 'app/shared/layout/common/box-message';
import ListEquipmentTypes from './list-equipment-types';
import ListEquipments from './list-equipments'
import { EquipmentTypesData } from './models/equipment-types-data';
import { urlify } from 'app/shared/util/string-utils';
import _ from 'lodash';


export interface ISEquipmentTypeProps extends StateProps, DispatchProps {
  changeDateUpdate,
  resetpapge,
  showMessage,
  clearEquipmentData,
  resetCodeMessage,
  dataChangedCalendar
}


export const EquipmentType = (props: ISEquipmentTypeProps) => {

  const colEquimentTypeRef = useRef(null)

  const [equiqmens, setEquiqmens] = useState([]);
  const [equiqmensType, setEquiqmensType] = useState([]);
  const [equiqmensUpdate, setEquiqmensUpdate] = useState({});
  const [equiqmensSave, setEquiqmensSave] = useState({});
  const [showIcon, setShowIcon] = useState(0);
  const [showIconEq, setShowIconEq] = useState(0);
  const [openDialogEquipmentAdd, setOpenDialogEquipmentAdd] = useState(false);
  const [equiqmensItem, setEquiqmensItem] = useState(null);
  const [equiqmensTypeItem, setEquiqmensTypeItem] = useState(null);
  const [mode, setMode] = useState(MODE_POPUP.CREATE);
  const [equiqmensItemDelete, SetEquiqmensItemDelete] = useState({});
  const [equiqmensTypeItemDelete, setEquiqmensTypeItemDelete] = useState({});
  const [checkType, setCheckType] = useState(true);
  const [codeMessage, setCodeMessage] = useState(SHOW_MESSAGE.NONE);
  const [equipmentTypeId, setEquipmentTypeId] = useState(null);
  const [ative, setAtive] = useState(0);
  const [modeEqupmet, setModeEqupmet] = useState(CALENDAR_TYPE.EQUIPMENT);
  const [isFirstType, setIsFirstType] = useState(false);
  const [hadDrag, setHadDrag] = useState(false);
  
  
  
  useEffect(() => {
    props.reset();
    setEquiqmensUpdate({})
    setEquiqmens([])
    props.handleGetData(CALENDAR_TYPE.EQUIPMENT_TYPE)
    setIsFirstType(true)
    setHadDrag(false)
    props.changeDateUpdate(null)
  }, [props.resetpapge])

  useEffect(() => {
    if (props.iDSS !== null) {
      props.handleGetData(CALENDAR_TYPE.EQUIPMENT_TYPE)
      setEquiqmensUpdate({})
      setCodeMessage(SHOW_MESSAGE.SUCCESS);
      props.resetIdss();
    }
  }, [props.iDSS]);

  useEffect(() => {
    if (props.resetCodeMessage && props.resetCodeMessage === SHOW_MESSAGE.NONE) {
      setCodeMessage(SHOW_MESSAGE.NONE)
    }
  }, [props.resetCodeMessage]);

  useEffect(() => {

    if (props.equipmentTypes['equipments']) {
      if (props.equipmentTypes) {
        if (props.equipmentTypes['equipmentTypes'] && props.equipmentTypes['equipmentTypes'].length > 0) {
          setEquiqmensType(props.equipmentTypes['equipmentTypes'])
          setEquipmentTypeId(equipmentTypeId === null ?
            props.equipmentTypes['equipmentTypes'][0].equipmentTypeId : equipmentTypeId)
        }
        if (props.equipmentTypes['equipments'] && props.equipmentTypes['equipments'].length > 0) {
          setEquiqmens(_.cloneDeep(props.equipmentTypes['equipments']))
        }
      }
    }
  }, [props.equipmentTypes])

  // useEffect(() => {
  //   if (props.equipments) {
  //     let listEquipment = props.equipments !== null ? _.cloneDeep(props.equipments) : []
  //     if (equiqmensUpdate['equipments'] && equiqmensUpdate['equipments'].length > 0) {
  //       /* add change */
  //       equiqmensUpdate['equipments'].forEach(element => {
  //         const item = listEquipment.find(e => e.equipmentTypeId === element['equipmentTypeId'])
  //         const itemdelete = listEquipment.find(e => e.equipmentId === element['equipmentId'])
  //         if (item === undefined || item.equipmentId !== element.equipmentId) {
  //           listEquipment.push(element)
  //         } else if (item && item.equipmentId === element.equipmentId) {
  //           listEquipment = _.map(listEquipment, obj => {
  //             if (item.equipmentTypeId > 0) {
  //               if (obj.equipmentId === element.equipmentId) {
  //                 obj = _.clone(element);
  //               }
  //             }
  //             return obj;
  //           });
  //         } else if (itemdelete && itemdelete.equipmentTypeId !== element['equipmentTypeId']) {
  //           listEquipment = _.reject(listEquipment, (objdel) => {
  //             return objdel.equipmentId === element.equipmentId
  //           });

  //         }
  //       });

  //       if (equiqmensUpdate['deletedEquipments'] && equiqmensUpdate['deletedEquipments'].length > 0) {
  //         equiqmensUpdate['deletedEquipments'].forEach(itemdel => {
  //           const eqdelte = listEquipment.find(e => e.equipmentId === itemdel)
  //           if (eqdelte) {
  //             listEquipment = _.reject(listEquipment, (objeqdel) => {
  //               return objeqdel.equipmentId === eqdelte.equipmentId
  //             });
  //           }
  //         })
  //       }
  //     }
  //     setEquiqmens(listEquipment)
  //   }
  // }, [props.equipments])




  useEffect(() => {
    if (props.listDataEquipmentType) {
      setEquiqmensType(props.listDataEquipmentType)
    }
  }, [props.listDataEquipmentType])

  const onShowEquipmentItem = (itemType: EquipmentTypesData, index: number) => {
    setAtive(index)
    if (itemType.equipments) {
      if (itemType.equipments.length > 0) {
        itemType.equipments.forEach(e => {
          e['orderOfType'] = itemType.displayOrder
        })
      }
      setEquiqmens(itemType.equipments)
    }
  }
  const prepareSaveEquipments = (listEquipments) => {
    return {
      equipmentTypes: listEquipments
    }
  }

  const getErrorMessage = (errorCode) => {
    let errorMessage = '';
    if (!isNullOrUndefined(errorCode)) {
      errorMessage = translate('messages.' + errorCode);
    }
    return errorMessage;
  }

   useEffect (() => {
    if (codeMessage !== SHOW_MESSAGE.NONE) {
      let msgInfoSuccess = '';
      if (codeMessage === SHOW_MESSAGE.SUCCESS) {
        msgInfoSuccess = getErrorMessage("INF_COM_0008")
      } else if (codeMessage === SHOW_MESSAGE.ERROR) {
        msgInfoSuccess = getErrorMessage(props.messageError[0] && props.messageError[0]['errorCode'])
      }
      props.showMessage(codeMessage, msgInfoSuccess)
    } 
  }, [codeMessage])


  const renderErrorMessage = () => {

    if (codeMessage === SHOW_MESSAGE.CAN_NOT_DELETE) {
      return <><div>
        <BoxMessage messageType={MessageType.Error}
          message={getErrorMessage(
            modeEqupmet === CALENDAR_TYPE.EQUIPMENT ? "INF_SET_0005" : "INF_SET_0006")} />
      </div>
      </>
    }
  }

  const escapeHtml = unsafe => {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };
  
  const URL_REGEX = new RegExp(
    "((?:http(s)?|ftp):\\/\\/)(([\\w.-]+(?:\\.[\\w\\.-]+)+)|localhost)[\\w\\-\\._~:/?#\\[\\]@!\\$&'\\(\\)\\*\\+,;=.]+",
    'g'
  );

  const convertHtml = text => {
    if (_.isNil(text)) {
      return '';
    }
    return escapeHtml(text).replace(URL_REGEX, url => {
      return '<span>' + url + '</span>';
    });
  };
  

  const deleteEquiqmensType = async (item, actionDelete?) => {
    let param = {}
    setCodeMessage(SHOW_MESSAGE.NONE);
    setCheckType(true)
    const itemName = convertHtml(getJsonBName(item.equipmentTypeName));
    document.body.className = "";
    const result = await ConfirmDialog({
      title: (<>{translate('employees.top.dialog.title-delete-group')}</>),
      message: translate('employees.top.dialog.message-delete-group', {itemName}),
      confirmText: translate('employees.top.dialog.confirm-delete-group'),
      confirmClass: "button-red",
      cancelText: translate('employees.top.dialog.cancel-text'),
      cancelClass: "button-cancel"
    });
    if (result) {
      if (item.equipmentTypeId && item.equipmentTypeId > 0) {
        equiqmensType.forEach(e => {
          if (e.equipmentTypeId > 0 && e.equipmentTypeId === item.equipmentTypeId) {
            if (item.equipments && item.equipments.length > 0) {
              let checkHadValue = false
              item.equipments.forEach(element => {
                if (element.isDelete !== 1) {
                  checkHadValue = true
                }
              });
              if (!checkHadValue) {
                e.isDelete = 1;
              } else {
                setCodeMessage(SHOW_MESSAGE.CAN_NOT_DELETE);
              }
            } else {
              e.isDelete = 1;
            }
          }
        })
      } else {
        const ele = equiqmensType.find(e => { return e.displayOrder > 0 && e.displayOrder === item.displayOrder })
        equiqmensType.splice(equiqmensType.indexOf(ele), 1)
      }
      setEquiqmensType(equiqmensType)
      setEquiqmensTypeItem(null)
      param = prepareSaveEquipments(equiqmensType)
      props.changeDateUpdate(param)
      props.dataChangedCalendar(true)
    }
  }


  // const deleteEquiqmens = async (item, actionDelete?) => {
  //   let param = {}
  //   const itemName = convertHtml(getJsonBName(item.equipmentName));
  //   document.body.className = "";
  //   const result = await ConfirmDialog({
  //     title: (<>{translate('employees.top.dialog.title-delete-group')}</>),
  //     message: translate('employees.top.dialog.message-delete-group', {itemName}),
  //     confirmText: translate('employees.top.dialog.confirm-delete-group'),
  //     confirmClass: "button-red",
  //     cancelText: translate('employees.top.dialog.cancel-text'),
  //     cancelClass: "button-cancel"
  //   });
  //   if (result) {
  //     for (let i = 0; i < equiqmensType.length; i++) {
  //       if (equiqmensType[i].displayOrder === item.orderOfType || equiqmensType[i].displayOrder === item.orderOfTypeChoose) {
  //         for (let index = 0; index <= equiqmensType[i].equipments.length; index++) {
  //           if (equiqmensType[i].equipments[index].displayOrder === item.displayOrder || equiqmensType[i].displayOrder === item.orderOfTypeChoose) {
  //             if (item.equipmentId > 0) {
  //               equiqmensType[i].equipments[index].isDelete = 1;
  //               break;
  //             } else {
  //               equiqmensType[i].equipments.splice(index, 1);
  //               break;
  //             }
  //           }
  //         }
  //       }
  //     }
  //     setEquiqmensType(equiqmensType);
  //     param = prepareSaveEquipments(equiqmensType)
  //     props.changeDateUpdate(param);
  //     props.dataChangedCalendar(true)
  //   }
  // }

  const deleteEquiqmens = async (item, actionDelete?) => {
    setCheckType(false)
    setCodeMessage(SHOW_MESSAGE.NONE);
    SetEquiqmensItemDelete(item)
    if (actionDelete || item.equipmentId === 0) {
      let param = { ...equiqmensUpdate }
      const result = await ConfirmDialog({
        title: (<>{translate('employees.top.dialog.title-delete-group')}</>),
        message: translate('employees.top.dialog.message-delete-group'),
        confirmText: translate('employees.top.dialog.confirm-delete-group'),
        confirmClass: "button-red",
        cancelText: translate('employees.top.dialog.cancel-text'),
        cancelClass: "button-cancel"
      });
      if (result) {
            for (let i = 0; i < equiqmensType.length; i++) {
              if (equiqmensType[i].displayOrder === item.orderOfType || equiqmensType[i].displayOrder === item.orderOfTypeChoose) {
                for (let index = 0; index <= equiqmensType[i].equipments.length; index++) {
                  if (equiqmensType[i].equipments[index].displayOrder === item.displayOrder || equiqmensType[i].displayOrder === item.orderOfTypeChoose) {
                    if (item.equipmentId > 0) {
                      equiqmensType[i].equipments[index].isDelete = 1;
                      break;
                    } else {
                      equiqmensType[i].equipments.splice(index, 1);
                      break;
                    }
                  }
                }
              }
            }
            setEquiqmensType(equiqmensType);
            param = prepareSaveEquipments(equiqmensType)
            props.changeDateUpdate(param);
            props.dataChangedCalendar(true)
          }
    } else {
      props.handleCheckDelete(CALENDAR_TYPE.EQUIPMENT, item.equipmentId)
    }
  }

  const openEquiqmentDialog = (type) => {
    setCodeMessage(SHOW_MESSAGE.NONE)
    setModeEqupmet(type)
    setEquiqmensItem(null)
    setEquiqmensTypeItem(null)
    setOpenDialogEquipmentAdd(!openDialogEquipmentAdd);
  }

  const dataTypeChange = (type) => {
    let param = {}
    if (type.displayOrder) {
      const lstProductTrade = _.map(equiqmensType, obj => {
        if (type.equipmentTypeId > 0) {
          if (obj.equipmentTypeId === type.equipmentTypeId) {
            obj = _.clone(type);
            obj.isUpdate = 1;
          }
        } else if (obj.displayOrder === type.displayOrder) {
          obj = _.clone(type);
        }
        return obj;
      });
      setEquiqmensType([...lstProductTrade]);
      param = prepareSaveEquipments(equiqmensType)
      props.changeDateUpdate(param);
      props.dataChangedCalendar(true)
    } else {
      for (let index = 0; index <= equiqmensType.length; index++) {
        if (index !== 0 && index === equiqmensType.length) {
          type['displayOrder'] = equiqmensType[index - 1].displayOrder + 1;
        } else {
          type['displayOrder'] = 1;
        }
        type['equipmentTypeId'] = null;
        type['equipments'] = [];
      }
      equiqmensType.push(type);
      setEquiqmensType(equiqmensType)
      param = prepareSaveEquipments(equiqmensType)
    }
    setEquiqmensTypeItem(null)
    setOpenDialogEquipmentAdd(!openDialogEquipmentAdd)
    props.changeDateUpdate(param);
    props.dataChangedCalendar(true)

  }



  const dataEquiqmentChange = (item, isCreate?) => {
    let param = {}
    if (isCreate) { // Create New
      if (equiqmensType.length > 0) {
        for (let i = 0; i < equiqmensType.length; i++) {
          if (equiqmensType[i].displayOrder === item.orderOfTypeChoose) {
            if (equiqmensType[i].equipments.length > 0) {
              for (let index = 0; index <= equiqmensType[i].equipments.length; index++) {
                if (index !== 0 && index === equiqmensType[i].equipments.length) {
                  item['displayOrder'] = equiqmensType[i].equipments[index - 1].displayOrder + 1;
                }
              }
              equiqmensType[i].equipments.push(item)
              break;
            } else {
              item['displayOrder'] = 1;
              // item['equipmentId'] = 0;
              equiqmensType[i].equipments.push(item)
              break;
            }
          }
        }
      }
    } else { // Action Edit
      const cloneOfItem = _.clone(item)
      // If do not change TYPE
      if (!item?.orderOfTypeChoose || item.orderOfTypeChoose === item.orderOfType) {
        for (let i = 0; i < equiqmensType.length; i++) {
          if (equiqmensType[i].displayOrder === item.orderOfType) {
            for (let index = 0; index <= equiqmensType[i].equipments.length; index++) {
              if (equiqmensType[i].equipments[index].displayOrder === item.displayOrder) {
                if (item.equipmentId > 0) {
                  equiqmensType[i].equipments[index].equipmentName = item.equipmentName
                  equiqmensType[i].equipments[index].equipmentTypeId = item.equipmentTypeId
                  equiqmensType[i].equipments[index].isAvailable = item.isAvailable
                  equiqmensType[i].equipments[index].displayOrder = item.displayOrder
                  equiqmensType[i].equipments[index].isUpdate = 1;
                  break;
                } else {
                  equiqmensType[i].equipments[index].equipmentName = item.equipmentName
                  equiqmensType[i].equipments[index].equipmentTypeId = item.equipmentTypeId
                  equiqmensType[i].equipments[index].isAvailable = item.isAvailable
                  equiqmensType[i].equipments[index].displayOrder = item.displayOrder
                  break;
                }

              }
            }
          }
        }
      } else {
        // Action create in New Type Has Choose
        if (equiqmensType.length > 0) {
          for (let i = 0; i < equiqmensType.length; i++) {
            if (equiqmensType[i].displayOrder === item.orderOfTypeChoose) {
              if (equiqmensType[i].equipments.length > 0) {
                for (let index = 0; index <= equiqmensType[i].equipments.length; index++) {
                  if (index !== 0 && index === equiqmensType[i].equipments.length) {
                    cloneOfItem['displayOrder'] = equiqmensType[i].equipments[index - 1].displayOrder + 1;
                  }
                }
                if(item.equipmentId > 0){
                  cloneOfItem.isUpdate = 1
                }
                equiqmensType[i].equipments.push(cloneOfItem)
                break;
              } else {
                cloneOfItem['displayOrder'] = 1;
                cloneOfItem['equipmentId'] = 0;
                if(item.equipmentId > 0){
                  cloneOfItem.isUpdate = 1
                }
                equiqmensType[i].equipments.push(cloneOfItem)
                break;
              }
            }
          }
        }

        // Action delete in Old Type
        for (let i = 0; i < equiqmensType.length; i++) {
          if (equiqmensType[i].displayOrder === item.orderOfType) {
            for (let index = 0; index <= equiqmensType[i].equipments.length; index++) {
              if (equiqmensType[i].equipments[index].displayOrder === item.displayOrder) {
                // if (item.equipmentId > 0) {
                //   equiqmensType[i].equipments[index].isDelete = 1;
                //   break;
                // } else {
                  equiqmensType[i].equipments.splice(index, 1);
                  break;
                // }
              }
            }
          }
        }
        
      }
    }
    setEquiqmensType(equiqmensType)
    param = prepareSaveEquipments(equiqmensType)
    setOpenDialogEquipmentAdd(!openDialogEquipmentAdd)
    props.changeDateUpdate(param)
    props.dataChangedCalendar(true)
  }

  const editEquiqmens = (item) => {
    setModeEqupmet(CALENDAR_TYPE.EQUIPMENT)
    setCodeMessage(SHOW_MESSAGE.NONE);
    setMode(MODE_POPUP.EDIT);
    setOpenDialogEquipmentAdd(!openDialogEquipmentAdd)
    item['equipmentTypeIdOld'] = item.equipmentTypeId;
    item['oldLangs'] = item.equipmentName;
    if(!item?.equipmentId && item?.orderOfTypeChoose && item.orderOfTypeChoose > 0){
      item['orderOfType'] = item.orderOfTypeChoose;
    }
    setEquiqmensItem(item);
  }

  const editEquiqmensType = (item) => {
    setCodeMessage(SHOW_MESSAGE.NONE);
    setModeEqupmet(CALENDAR_TYPE.EQUIPMENT_TYPE)
    setMode(MODE_POPUP.EDIT);
    setOpenDialogEquipmentAdd(!openDialogEquipmentAdd)
    setEquiqmensTypeItem(item);
  }

  const toggleOpenPopup = () => {
    setOpenDialogEquipmentAdd(!openDialogEquipmentAdd)
    setEquiqmensItem(null)
    setEquiqmensTypeItem(null)
  }

  
  

  useEffect(() => {
    setCodeMessage(SHOW_MESSAGE.NONE);
    
    if (props.messageError && props.messageError.length > 0) {
      setCodeMessage(SHOW_MESSAGE.ERROR);
    }
  }, [ props.messageError]);

  useEffect(() => {
    let param = {}
    if(hadDrag){
      param = prepareSaveEquipments(equiqmensType)
      props.changeDateUpdate(param)
      props.dataChangedCalendar(true)
    }
  }, [equiqmensType])

  useEffect(() => {
    let param = {}
    if(hadDrag){
      if(equiqmens.length > 1){
        if(equiqmens[0]['orderOfType'] && equiqmens[0]['orderOfType'] > 0){
          for (let i = 0; i < equiqmensType.length; i++) {
            if(equiqmensType[i].displayOrder === equiqmens[0]['orderOfType']){
              equiqmensType[i].equipments = _.cloneDeep(equiqmens)
              break
            }
          }
        }
      }
      param = prepareSaveEquipments(equiqmensType)
      props.changeDateUpdate(param)
      props.dataChangedCalendar(true)
      setHadDrag(false)
    }
  }, [equiqmens])

 

  useEffect(() => {
    if(isFirstType && equiqmensType && equiqmensType.length > 0){
      onShowEquipmentItem(equiqmensType[0], 0)
    }
  },[equiqmensType])

  useEffect(() => {
    setEquiqmens([])
  }, [props.clearEquipmentData])

  useEffect(() => {
    setCodeMessage(SHOW_MESSAGE.NONE);
    if (props.checkDelete !== null && props.checkDelete.length === 0) {
      deleteEquiqmens(equiqmensItemDelete, true)
      setCodeMessage(SHOW_MESSAGE.NONE);
    }
    if (props.checkDelete !== null &&
      props.checkDelete.length > 0) {
      setCodeMessage(SHOW_MESSAGE.CAN_NOT_DELETE);
    }
  }, [props.checkDelete]);

  return (
    <>
      <div className="form-group">
        <label className="font-size-18">{translate('setting.calendar.equiqment.title')}</label>
        <div className="block-feedback background-feedback magin-top-5">
          {translate('setting.calendar.equiqment.notification')}
        </div>
        {renderErrorMessage()}
        <div className="position-relative">
        <div className="w30 background-f9">
            <a className="button-primary btn-padding mt-4 mb-4 hoverBtn" style={{marginRight: "5px"}} onClick={() => {
              setMode(MODE_POPUP.CREATE);
              openEquiqmentDialog(CALENDAR_TYPE.EQUIPMENT_TYPE);
            }}>
              {translate('setting.calendar.equiqment.btnType')}
            </a>
            <a className="button-primary btn-padding mt-4 mb-4" onClick={() => {
              setMode(MODE_POPUP.CREATE);
              openEquiqmentDialog(CALENDAR_TYPE.EQUIPMENT);
            }}>{translate('setting.calendar.equiqment.btnEquiqment')}</a>
          </div>
          {openDialogEquipmentAdd && <EquipmentAdd
            dataEquiqmentChange={dataEquiqmentChange}
            equiqmensItem={equiqmensItem}
            modePopup={mode}
            equiqmensType={equiqmensType}
            toggleOpenPopup={toggleOpenPopup}
            modeEqupmet={modeEqupmet}
            dataTypeChange={dataTypeChange}
            equiqmensTypeItem={equiqmensTypeItem}
            langKey={props.account["languageCode"]}
            dataChangedCalendar={props.dataChangedCalendar}
            />}
        </div>
        <div>
          <table className="table-default">
            <tbody>
              <tr>
                <td className="w30 cls-padding" ref={colEquimentTypeRef} >
                  <ListEquipmentTypes
                    listItems={equiqmensType}
                    editItem={editEquiqmensType}
                    deleteItem={deleteEquiqmensType}
                    showEquipmentInType={onShowEquipmentItem}
                    openDialogEquipmentAdd={openDialogEquipmentAdd}
                    ative={ative}
                    setItems={setEquiqmensType}
                    colEquimentTypeRef={colEquimentTypeRef}
                    setHadDrag={setHadDrag}
                  />
                  {/* {
                    equiqmensType && equiqmensType.length > 0 && equiqmensType.map((type, index) => (
                      <div key={index} className={index === ative ? "tbl-type-common tbl-type" : "tbl-type-common"}
                        onMouseEnter={() => setShowIcon(index + 1)}
                        onMouseLeave={() => !openDialogEquipmentAdd && setShowIcon(0)}>
                        <p onClick={() => showEquipmentInType(type.equipmentTypeId, index)}>
                          {getJsonBName(type.equipmentTypeName)}</p>
                        {
                          showIcon === (index + 1) && (
                            <span className="list-icon list-icon__center">
                              <a className="icon-primary icon-edit icon-custom mr-1" onClick={() => editEquiqmensType(type)} />
                              <a className="icon-primary icon-erase icon-custom" onClick={() => deleteEquiqmensType(type)} />
                            </span>
                          )
                        }
                      </div>
                    ))
                  } */}
                </td>
                <td className="td_height w70 cls-padding">

                  <ListEquipments
                    listItems={equiqmens}
                    editItem={editEquiqmens}
                    deleteItem={deleteEquiqmens}
                    openDialogEquipmentAdd={openDialogEquipmentAdd}
                    equipmentTypeId={equipmentTypeId}
                    setItems={setEquiqmens}
                    setHadDrag={setHadDrag}
                  />
                  {/* {
                    equiqmens && equiqmens.length > 0 && equiqmens.map((eq, idx) => (
                      !eq.isDelete &&
                      <div key={idx} className="tbl-equiqment"
                        onMouseOver={() => setShowIconEq(idx + 1)}
                        onMouseLeave={() => { if (!openDialogEquipmentAdd) { setShowIconEq(0) } else { setShowIconEq(null) } }}>
                        <p>{getJsonBName(eq.equipmentName)}</p>
                        {
                          showIconEq === (idx + 1) && (
                            <span className="list-icon list-icon__center">
                              <a className="icon-primary icon-edit icon-custom mr-1" onClick={() => editEquiqmens(eq)} />
                              <a className="icon-primary icon-erase icon-custom" onClick={() => deleteEquiqmens(eq)} />
                            </span>
                          )
                        }
                      </div>
                    ))
                  } */}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
const mapStateToProps = ({ equipmentType, authentication }: IRootState) => ({
  equipmentTypes: equipmentType.equipmentTypes,
  equipments: equipmentType.equipments,
  listDataEquipmentType: equipmentType.listDataEquipmentType,
  checkDelete: equipmentType.checkDelete,
  messageError: equipmentType.errorItems,
  iDSS: equipmentType.equipmentTypeUpdate,
  account: authentication.account,
});

const mapDispatchToProps = {
  reset,
  handleGetData,
  handleCheckDelete,
  resetIdss
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EquipmentType);