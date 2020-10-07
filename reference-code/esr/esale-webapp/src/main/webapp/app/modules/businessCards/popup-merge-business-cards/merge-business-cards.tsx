import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import { Storage, translate } from 'react-jhipster';
import _ from 'lodash';
import { Modal } from 'reactstrap';
import Popover from 'app/shared/layout/common/Popover';
import { BUSINESS_CARD_LIST_ID, BUSINESS_CARD_DEF } from "app/modules/businessCards/constants";
import {
  getSuggestionCards,
  getCustomFieldsInfo,
  getBusinessCards,
  handleMergeBusinessCard,
  reset
} from "./merge-business-cards.reducer";
import TagAutoComplete from 'app/shared/layout/common/suggestion/tag-auto-complete';
import { TagAutoCompleteMode, TagAutoCompleteType } from 'app/shared/layout/common/suggestion/constants';
import StringUtils, { tryParseJson } from 'app/shared/util/string-utils';
import RowValue from './row-value';
import { DEFINE_FIELD_TYPE } from 'app/shared/layout/dynamic-form/constants';
import BoxMessage, { MessageType } from 'app/shared/layout/common/box-message';
import DialogDirtyCheck from 'app/shared/layout/common/dialog-dirty-check';
import { isExceededBigCapacity } from 'app/shared/util/file-utils';
import { MAXIMUM_FILE_UPLOAD_GB } from 'app/config/constants';
import * as converDateTime from 'app/shared/util/date-utils';
import useEventListener from 'app/shared/util/use-event-listener';
import { isNullAllPropertyObject } from '../util';

export enum SettingModes {
  CreateNewInput,
  AddNotAvailabelInput,
  EditInput
}

export enum FSActionTypeScreen {
  None,
  RemoveSession,
  SetSession,
  GetSession,
  CloseWindow,
  Search,
}

export interface IPopupMergeBusinessCardProps extends StateProps, DispatchProps {
  popout?: boolean,
  isInitLoadDataWindow?: boolean,
  disableBack?: boolean,
  showModal: boolean;
  businessCardDetailId?: number;
  toggleClosePopup(isMerged?: boolean);
  tenant;
}

const MergeBusinessCard = (props: IPopupMergeBusinessCardProps) => {
  const [showModal, setShowModal] = useState(true);
  const [customFields, setCustomFields] = useState([]);
  const [listIdCardChoice, setListIdCardChoice] = useState([]);
  const [listDataBusinessCard, setListDataBusinessCard] = useState([]);
  const [valueArray, setValArray] = useState({});
  const [updateDateArray, setUpdateDateArray] = useState([]);
  // checkAll is null when click end column, -1 when start load component, undefined when all not check same
  const [checkAll, setCheckAll] = useState <number>();
  const [firstData, setFirstData] = useState(null);
  const [obj, setObj] = useState({});
  // objIndex have id checked and value for Open Window
  const [objIndex, setObjIndex] = useState({});
  // isGetDataWindow set true when Open Window have load done "listDataBusinessCard, listIdCardChoice, customFields, obj, objIndex"
  const [isGetDataWindow, setIsGetDataWindow] = useState(false);
  const [listFileUpload, setListFileUpload] = useState({});
  const [msgError, setMsgError] = useState("");
  const [chosenBusinessCards, setChosenBusinessCards] = useState([]);

  useEffect(() => {
    if (props.customFieldInfos && props.customFieldInfos.customFieldsInfo && !props.popout) {
      setCustomFields(props.customFieldInfos.customFieldsInfo);
      // Set index have checked
      const dataIndex = {};
      _.forEach(props.customFieldInfos.customFieldsInfo, (value, key) => {
        dataIndex[value.fieldName] = { indexChecked: 0, valueInput: null };        
      });
      setObjIndex(dataIndex);
    }
  }, [props.customFieldInfos]);

  useEffect(() => {
    if (props.businessCardList && props.businessCardList.businessCards?.length > 0 && !props.popout) {
      setListDataBusinessCard(props.businessCardList.businessCards);
      const obj2 = props.businessCardList.businessCards[0];
      setFirstData(_.cloneDeep(obj2));
      setObj(_.cloneDeep(obj2));
      setCheckAll(-1);
    }
  }, [props.businessCardList]);

  const getValueReturn = (val) => {
    const a = obj;
    if (val.isDefault) {
      if (val.fieldName === "business_card_id") {
        a["updated_date"] = updateDateArray[val.idx]
      }
      if (val.fieldName === "company_name") {
        a['alternative_customer_name'] = val.value?.alternativeCustomerName ?? null;
        a['customer_id'] = val.value?.customerId ?? null;
        a['customer_name'] = val.value?.customerName ?? null;
      }
      a[val.fieldName] = val.value;
      if (val.fieldName === "business_card_image_path" && val.value?.businessCardImagePath) {
        a['business_card_image_name'] = val.value.businessCardImageName;
        a['business_card_image_path'] = val.value.businessCardImagePath;
      }
      setObj(a);
    } else {
      a["business_card_data"]?.forEach(x => {
        if (x.key === val.fieldName) {
          if (val.fieldName.includes("date_time")) {
            x.value = converDateTime.formatDateTime(val.value, "YYYY-MM-DD HH:mm");
          } else if (val.fieldName.includes("address") && _.isNull(val.value)) {
            const initAddress = {
              "address": "",
              "building": "",
              "zip_code": ""
            };
            x.value = JSON.stringify(initAddress);
          } else {
            x.value = _.isString(val.value) ? val.value : JSON.stringify(val.value);
          }
        }
      })
      setObj(a);
    }

    // To re-render update idCheck to RowValue
    if(!props.popout) {
      objIndex[val.fieldName] = {...objIndex[val.fieldName], indexChecked: val.idx};
      setObjIndex({...objIndex});
    }
  }
  const getValueCustomFrom = (valData, fieldName) => {
    // if(!props.popout) {
    //   setObjIndex({
    //     ...objIndex,
    //     [fieldName]: {
    //       ...objIndex[fieldName],
    //       valueInput: [valData]
    //     }
    //   });
    // }
    if(!props.popout) {
      objIndex[fieldName] = {...objIndex[fieldName], valueInput: valData};
      setObjIndex({...objIndex});
    }
  }

  const getfileUploads = (fileUploads) => {
    const fUploads = [];
    const keyFiles = Object.keys(fileUploads);
    keyFiles.forEach(key => {
      const arrFile = fileUploads[key];
      if (!Array.isArray(arrFile)) {
        return null;
      }
      arrFile.forEach(file => {
        fUploads.push(file);
      });
    });
    return fUploads;
  };

  const handleSubmit = () => {
    // Start heck total size all file have upload
    let listfile = [];
    const dataListFile = Object.values(listFileUpload);
    const dataFile = dataListFile.filter(value => Object.keys(value).length !== 0);
    dataFile.forEach(item => {
      const fileArray = getfileUploads(item);
      listfile = [...listfile, ...fileArray];
    });
    setMsgError('');
    if (isExceededBigCapacity(listfile, MAXIMUM_FILE_UPLOAD_GB)) {
      setMsgError(translate("messages.ERR_COM_0033", [MAXIMUM_FILE_UPLOAD_GB]));
      return;
    }
    // End total size all file have upload

    const newElement = {};
    for (const prop in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, prop)) {
        newElement[StringUtils.snakeCaseToCamelCase(prop)] = (obj[prop] !== undefined || obj[prop] !== null) ? obj[prop] : null;
      }
    }
    const idCardData = [];
    listIdCardChoice.forEach(x => { idCardData.push(parseInt(x, 0)) });
    newElement["listOfBusinessCardId"] = idCardData.filter(x => x !== newElement["businessCardId"]);
    const imageUpload = !_.isString(newElement["businessCardImagePath"]) ? getfileUploads(newElement["businessCardImagePath"]) : null;
    props.handleMergeBusinessCard(newElement, imageUpload);
  }

  const renderToastMessage = () => {
    if (props.mergeSuccess === null) {
      return <></>;
    }
    return (
      <BoxMessage
        messageType={MessageType.Success}
        message={props.mergeSuccess}
        className="message-area-bottom position-absolute"
      />
    )
  }

  const updateStateSession = (mode: FSActionTypeScreen) => {
    if (mode === FSActionTypeScreen.SetSession) {
      Storage.local.set(MergeBusinessCard.name, {
        listDataBusinessCard,
        listIdCardChoice,

        customFields,
        obj,
        objIndex,
        valueArray,
        firstData,
        listFileUpload,
        chosenBusinessCards,
        // updateDateArray,
        // checkAll,
      });
    }
    else if (mode === FSActionTypeScreen.GetSession) {
      const saveObj = Storage.local.get(MergeBusinessCard.name);
      if (saveObj) {
        setListDataBusinessCard(saveObj.listDataBusinessCard);
        setListIdCardChoice(saveObj.listIdCardChoice);

        setCustomFields(saveObj.customFields);
        setObj(saveObj.obj);
        setObjIndex(saveObj.objIndex);
        setIsGetDataWindow(true);

        setValArray(saveObj.valueArray);
        setFirstData(saveObj.firstData);
        setListFileUpload(saveObj.listFileUpload);
        setChosenBusinessCards(saveObj.chosenBusinessCards);
        // setUpdateDateArray(saveObj.updateDateArray);
        // setCheckAll(saveObj.checkAll);
      }
    } else if (mode === FSActionTypeScreen.RemoveSession) {
      Storage.local.remove(MergeBusinessCard.name);
    }
  }

  const openNewWindow = () => {
    setShowModal(false);
    updateStateSession(FSActionTypeScreen.SetSession);
    const height = screen.height * 0.8;
    const width = screen.width * 0.8;
    const left = screen.width * 0.1;
    const top = screen.height * 0.1;
    const style = `width=${width},height=${height},left=${left},top=${top}`;
    const newWindow = window.open(`${props.tenant}/merge-business-card`, '', style.toString());
    newWindow.onbeforeunload = () => {
      props.toggleClosePopup();
      updateStateSession(FSActionTypeScreen.RemoveSession);
    }
    // handleClosePopup();
  }

  /**
   *  Before Unload
   */
  const onBeforeUnload = ev => {
    if (props.popout) {
      window.opener.postMessage({ type: FSActionTypeScreen.CloseWindow, 'forceCloseWindow': false, 'keepOpen': true }, window.location.origin);
    }
  };

  /**
   * Close Window
   * @param ev 
   */
  const onReceiveMessage = ev => {
    if (!props.popout) {
      if (ev.data.forceCloseWindow) {
        updateStateSession(FSActionTypeScreen.RemoveSession);
      }
    }
  };

  if (props.popout) {
    useEventListener('beforeunload', onBeforeUnload);
  } else {
    useEventListener('message', onReceiveMessage);
  }

  useEffect(() => {
    document.body.className = "wrap-card";
    props.getCustomFieldsInfo({ fieldBelong: BUSINESS_CARD_DEF.FIELD_BELONG });
    if (props.popout) {
      updateStateSession(FSActionTypeScreen.GetSession);
      setShowModal(false);
    } else {
      setShowModal(true);
    }
  }, []);

  const handleAddBusinessCardFromSuggestion = (id: any, type: TagAutoCompleteType, mode: TagAutoCompleteMode, listTag: any[]) => {
    const listIdSearch = [];
    const dataFromSearch = [];
    listTag.forEach((element, idx) => {
      const newElement = {};
      for (const property in element) {
        if (Object.prototype.hasOwnProperty.call(element, property)) {
          newElement[StringUtils.camelCaseToSnakeCase(property)] = !_.isNull(element[property]) && !_.isUndefined(element[property]) ? element[property] : null;
        }
      }
      listIdSearch.push(element.businessCardId.toString());
      dataFromSearch[idx] = newElement;
    });
    setListDataBusinessCard(dataFromSearch);
    setListIdCardChoice(listIdSearch);
  }

  const removeRecord = (index) => {
    const newid = listIdCardChoice.filter((value, idx) => {
      return idx !== index
    });
    setListIdCardChoice(newid);
    
    listDataBusinessCard.splice(index, 1);

    // update suggest from search
    chosenBusinessCards.splice(index, 1);
    
    // update index of checked radio
    _.forEach(valueArray, (valueItemData: any, key) => {
      valueItemData.splice(index, 1);
    });
    _.forEach(objIndex, (valueData: any, keyName) => {
      let indexData = !_.isUndefined(objIndex[keyName].indexChecked)? objIndex[keyName].indexChecked : 0;
      if(indexData && index < indexData) {
        indexData = indexData - 1;
      }
      if (indexData === 0 && valueArray[keyName] && valueArray[keyName].length > 0 && (
        _.isNull(valueArray[keyName][0]) || 
        _.isUndefined(valueArray[keyName][0]) || 
        isNullAllPropertyObject(valueArray[keyName][0]) || 
        valueArray[keyName][0] === "[]" || 
        valueArray[keyName][0] === "")
        ) {
        indexData = null;
      }
      objIndex[keyName] = {...valueData, indexChecked: indexData};
      setCheckAll(undefined);
    });
  }

  useEffect(() => {
    // Check when remove all Item Card on Table
    if (listIdCardChoice.length === 0) {
      setObj({
        ...objIndex,
        "business_card_id": null
      });
      setCheckAll(null);
    }
  }, [listIdCardChoice]);

  // Run when Start Modal
  useEffect(() => {
    const dataStorage = Storage.local.get(MergeBusinessCard.name);
    let listId = [];
    if (props.businessCardDetailId) {
      listId = [props.businessCardDetailId];
    } else if (props.popout && dataStorage) {
      return;
    } else if (props.recordCheckList.length > 0) {
      const dataList = [];
      const dataArray = _.orderBy(props.recordCheckList, ['businessCardId'], ['asc'])
      dataArray.forEach(x => {
        dataList.push(x.businessCardId.toString())
      })
      listId = dataList
    }
    setListIdCardChoice(listId);

    let conditions
    if (listId.length > 0) {
      conditions = {
        fieldType: 3,
        fieldName: "business_card_id",
        isDefault: "true",
        fieldValue: `${JSON.stringify(listId).replace(/"(\w+)"\s*:/g, '$1:')}`,
      }
      props.getBusinessCards({
        selectedTargetType: 0,
        selectedTargetId: 0,
        searchConditions: conditions,
        offset: 0,
        limit: 1000,
        orderBy: [{ key: "business_card_id", value: "ASC", fieldType: 5, isNested: false }],
        searchLocal: null,
        filterConditions: [],
        isFirstLoad: false
      });
    }
  }, []);

  useEffect(() => {
    const valueTable = {};
    if (listDataBusinessCard && listDataBusinessCard.length > 0 && customFields && customFields.length > 0) {
      customFields.forEach(z => {
        Object.assign(valueTable, { [z.fieldName]: [] }, { ["business_cards_receives"]: [] });
      })
      listDataBusinessCard.forEach(x => {
        customFields.forEach(y => {
          if (y.fieldName === "company_name") {
            valueTable[y.fieldName].push(
              {
                alternativeCustomerName: x["alternative_customer_name"],
                customerId: x["customer_id"],
                customerName: x["customer_name"]
              });
          } else if (y.fieldName === "address") {
            if (x["address"] && x["building"] && x["zip_code"]) {
              valueTable[y.fieldName].push(
                {
                  address: x["address"],
                  building: x["building"],
                  zipCode: x["zip_code"]
                });
            } else {
              valueTable[y.fieldName].push(null);
            }
          } else if (y.fieldName === "business_card_image_path") {
            valueTable[y.fieldName].push(
              {
                businessCardImagePath: x["business_card_image_path"],
                businessCardImageName: x["business_card_image_name"],
              });
          } else if (_.toString(y.fieldType) === _.toString(DEFINE_FIELD_TYPE.LINK)) {
            const tmpLink = tryParseJson(x[y.fieldName]);
            const lstKeyLink = Object.keys(tmpLink);
            let checkNullOfValue = false;
            lstKeyLink.length > 0 && lstKeyLink.forEach(e => {
              if (!_.isEmpty(tmpLink[e]))
                checkNullOfValue = true;
            })
            if (checkNullOfValue) {
              valueTable[y.fieldName].push(x[y.fieldName])
            } else {
              valueTable[y.fieldName].push(null)
            }
          } else if (y.fieldName === "employee_id") {
            valueTable["business_cards_receives"].push(x["business_cards_receives"]?.length > 0 ? x["business_cards_receives"] : null);
          } else {
            valueTable[y.fieldName].push((_.isNull(x[y.fieldName]) || _.isUndefined(x[y.fieldName]) || x[y.fieldName] === "[]") ? null : x[y.fieldName])
          }
        })
      })
    }
    setValArray(valueTable)
  }, [listDataBusinessCard, customFields]);

  useEffect(() => {
    if (props.mergeSuccess) {
      setTimeout(() => {
        if (props.popout) {
          window.close();
        } else {
          props.toggleClosePopup(true);
          props.reset();
        }
      }, 200);
    }
  }, [props.mergeSuccess])

  useEffect(() => {
    if (listDataBusinessCard) {
      // Update date
      const updatedDate = []
      listDataBusinessCard.forEach(x => {
        updatedDate.push(x.updated_date)
      })
      setUpdateDateArray(updatedDate);

      // List item have show on Table
      const itemsBusinessCardNotSuggestion = [];
      listDataBusinessCard.length > 0 && listDataBusinessCard.forEach((element, idx) => {
        const newElement = {};
        for (const property in element) {
          if (Object.prototype.hasOwnProperty.call(element, property)) {
            newElement[StringUtils.snakeCaseToCamelCase(property)] = !_.isNull(element[property]) && !_.isUndefined(element[property]) ? element[property] : null;
          }
        }
        itemsBusinessCardNotSuggestion[idx] = newElement;
      });
      setChosenBusinessCards(itemsBusinessCardNotSuggestion);
    }
  }, [listDataBusinessCard]);

  const executeDirtyCheck = async (action: () => void, cancel?: () => void, modalType?: number) => {
    const isChange = !_.isEqual(firstData, obj);
    if (isChange) {
      await DialogDirtyCheck({ onLeave: action, onStay: cancel, partternType: modalType });
    } else {
      action();
    }
  };
  const handleClosePopup = (typeModal = 2) => {
    executeDirtyCheck(() => {
      if (props.popout && !props.disableBack) {
        props.toggleClosePopup();
      } else if (props.popout) {
        window.close();
      } else {
        props.toggleClosePopup();
        updateStateSession(FSActionTypeScreen.RemoveSession);
      }
    }, null, typeModal);
  }

  const renderComponent = () => {
    return (
      <>
        <div className="modal modal-merger-businesscard popup-esr popup-esr4 user-popup-page popup-align-right show" id="popup-esr" aria-hidden="true">
          <div className="modal-dialog form-popup">
            <div className="modal-content">
              <div className="modal-header">
                <div className="left">
                  <div className="popup-button-back"><a className={props.disableBack ? "icon-small-primary icon-return-small disable" : "icon-small-primary icon-return-small"} onClick={(!props.disableBack) && (() => handleClosePopup(1))} /><span className="text"><img className="icon-popup-big" src="../../../content/images/ic-popup-title-card.svg" />{translate('businesscards.merge-business-card.union')}</span></div>
                </div>
                <div className="right">
                  {showModal &&
                    <>
                      <button className="icon-small-primary icon-link-small" onClick={() => openNewWindow()} />
                      <button className="icon-small-primary icon-close-up-small line" onClick={() => handleClosePopup()} />
                    </>
                  }
                </div>
              </div>
              <div className="modal-body">
                <div className="popup-content overflow-hidden d-flex flex-column">
                  {msgError && <BoxMessage messageType={MessageType.Error} className="msgError mb-2" message={msgError} />}
                  {props.errorMessage && props.errorItems && props.errorItems.length > 0 && (props.errorItems[0].item === 'companyName' || props.errorItems[0].item === 'businessCardId' || props.errorItems[0].item === 'listOfBusinessCardId' || props.errorItems[0].item === 'updateBusinessCards-3.1') && (
                    <BoxMessage messageType={MessageType.Error} className="msgError mb-2" message={translate("messages." + props.errorMessage)} />
                  )}

                  <div className="user-popup-form">
                    <div className="col-lg-6 pl-0">
                      <label className="mb-4 color-333">{translate('businesscards.merge-business-card.select-item')}</label>
                      <div className="form-group set-clear-table-list-wrap">
                        <TagAutoComplete
                          id={'business-card'}
                          isHideResult={true}
                          type={TagAutoCompleteType.BusinessCard}
                          modeSelect={TagAutoCompleteMode.Multi}
                          onActionSelectTag={handleAddBusinessCardFromSuggestion}
                          placeholder={translate('businesscards.merge-business-card.placeholder')}
                          elementTags={chosenBusinessCards}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="overflow-auto overflow-hover table-scroll-shadow flex-fill mw-100 mb-4">
                    <table className="table-default table-default-top table-card-auto table-scroll-fixed table-scroll-fixed__popover">
                      <thead>
                        <tr>
                          <th className="title-table width-150">&nbsp;</th>
                          {listDataBusinessCard && listDataBusinessCard.map((e, idx) => (
                            <th className="title-table width-250" key={idx}>
                              <div className="d-flex justify-content-between" >
                                {/* <span className="text-break">{!_.isNull(e["last_name"]) ? e["first_name"] + e["last_name"] : e["first_name"]}</span> */}
                                <Popover x={0} y={20} className={"modal-table-merge-column-popover"}>
                                  {!_.isNull(e["last_name"]) ? e["first_name"] + e["last_name"] : e["first_name"]}
                                </Popover>
                                <a className="icon-small-primary icon-close-up-small flex-xl-shrink-0"
                                  onClick={() => removeRecord(idx)}
                                />
                              </div>
                              <a className="button-primary button-activity-registration mt-2"
                                onClick={() => {
                                  setCheckAll(idx);
                                }}>{translate('businesscards.merge-business-card.select-all')}</a>
                            </th>
                          ))}
                          <th className="title-table width-400-px">
                            <div className="d-flex justify-content-between" >
                              {translate('businesscards.merge-business-card.manual-input')}
                            </div>
                            <a className="button-primary button-activity-registration mt-2"
                              onClick={() => {
                                setCheckAll(null)
                              }}>{translate('businesscards.merge-business-card.select-all')}</a>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {customFields.map((e, idx) => {
                          if (e.availableFlag !== 0 && ((e.fieldName === "employee_id" && valueArray["business_cards_receives"]) || (e.fieldName !== "receive_date" && e.fieldName !== "last_contact_date" && e.fieldName !== "received_last_contact_date"
                            && e.fieldName !== "created_date" && e.fieldName !== "created_user" && e.fieldName !== "updated_date" && e.fieldName !== "updated_user"))
                          ) {
                            const itemCustomValue = props.popout ? objIndex[e.fieldName]?.valueInput : null;
                            const indexNumber = objIndex[e.fieldName]?.indexChecked;
                            const checkIndex = !_.isUndefined(checkAll) ? checkAll : indexNumber;
                            return <RowValue
                              key={idx}
                              fieldDataValue={e.fieldName === "employee_id" && valueArray["business_cards_receives"] ? valueArray["business_cards_receives"] : valueArray[e.fieldName]}
                              fieldName={e.fieldName}
                              fieldLabel={e.fieldLabel}
                              valueReturn={getValueReturn}
                              valueCustomInput={getValueCustomFrom}
                              isDefault={e.isDefault}
                              field={e}
                              errorMessage={props.errorMessage}
                              errorItems={props.errorItems}
                              setUploadFile={(value) => setListFileUpload({ ...listFileUpload, [idx]: value })}
                              idCheck={checkIndex}
                              resetCheckall={() => {
                                setCheckAll(undefined);
                              }}
                              initValueForm={itemCustomValue}
                              isShowFormCustom={!props.popout || props.isInitLoadDataWindow || isGetDataWindow}
                            ></RowValue>
                          }
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="user-popup-form-bottom wrap">
                <a className="button-cancel mr-5" onClick={() => handleClosePopup()}>{translate('businesscards.top.title.btn-cancel')}</a>
                <a className="button-blue" onClick={handleSubmit}>{translate('businesscards.merge-business-card.btn-merge')}</a>
              </div>
              {renderToastMessage()}
            </div>
          </div>
        </div>
      </>
    );
  }

  if (showModal) {
    return (
      <>
        <Modal isOpen={true} fade={true} toggle={() => { }} backdrop={true} id="popup-employee-detail" autoFocus={true} zIndex="auto">
          {renderComponent()}
        </Modal>
      </>
    );
  }
  else {
    if (props.popout) {
      document.body.className = "body-full-width newwindow-merge-open wrap-card modal-open";
      return (
        <>
          {renderComponent()}
          {document.body.className = document.body.className.replace('modal-open', '')}
        </>
      );
    } else {
      return <></>;
    }
  }
}

const mapStateToProps = ({ dynamicList, mergeBusinessCard, applicationProfile }: IRootState) => ({
  recordCheckList: dynamicList.data.has(BUSINESS_CARD_LIST_ID) ? dynamicList.data.get(BUSINESS_CARD_LIST_ID).recordCheckList : [],
  customFieldInfos: mergeBusinessCard.customFieldInfos,
  businessCardList: mergeBusinessCard.businessCardListMerge,
  mergeSuccess: mergeBusinessCard.mergeSuccess,
  errorMessage: mergeBusinessCard.errorMessage,
  errorItems: mergeBusinessCard.errorItems,
  suggestionCardList: mergeBusinessCard.suggestionCardList,
  tenant: applicationProfile.tenant,
});

const mapDispatchToProps = {
  getCustomFieldsInfo,
  getBusinessCards,
  handleMergeBusinessCard,
  getSuggestionCards,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MergeBusinessCard);
