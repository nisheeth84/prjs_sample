import React, { useState, useEffect } from 'react';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { translate } from 'react-jhipster';
import { timeUtcToTz, utcToTz, DATE_TIME_FORMAT } from 'app/shared/util/date-utils';
import _ from 'lodash';
import { TAB_ID_LIST } from '../../constants';
import { getFieldLabel, toArray, tryParseJson } from 'app/shared/util/string-utils';
import EmployeeName from 'app/shared/layout/common/EmployeeName';
import { Storage } from 'react-jhipster';
import { DEFINE_FIELD_TYPE } from 'app/shared/layout/dynamic-form/constants';
import {
  handleInitBusinessCardChangeHistory,
  resetStateHistory
} from '../business-card-detail-reducer';
import { APP_DATE_FORMAT } from 'app/config/constants';
import dateFnsFormat from 'date-fns/format';

export interface ITabChangeHistory extends StateProps, DispatchProps {
  businessCardId?: any, // Business card id
  businessCardCurrentDetail: any, // This props is structured to dump out to the main screen to get the data for the history display function.
  setDataDetailHistory?: (dataHistory: any, indexHistory, amountOfHistory) => void, // Set data to detail history 
  setModeComponent?: (mode: any, tab: any, date: any, index: any, total: any) => void // set mode to history, current date and more.
  setCompanyNameHistory?: (companyName: any, customerName: any, custommerId: any, alternativeCustomerName: any, index) => void // set company name history
}

const TabChangeHistory = (props: ITabChangeHistory) => {
  const prefix = 'dynamic-control.fieldDetail.layoutAddress.';
  const SPECIAL_NAME = ["zip_code", "building", "alternative_customer_name", "customer_name", "customer_id", "url_target", "url_text", "fileName"];

  const lang = Storage.session.get('locale', 'ja_jp');

  const [listHistory,] = useState([]);
  const [, setListHistoryTmp] = useState([]);
  const [updatedDate, setUpdatedDate] = useState(null);
  const [openMerge, setOpenMerge] = useState(false);

  useEffect(() => {
    if (props.businessCardHistory && props.businessCardHistory.businessCardHistories && listHistory.length <= props.businessCardHistory.totalRecord - 1) {
      _.cloneDeep(props.businessCardHistory.businessCardHistories).forEach((item) => {
        listHistory.push(item);
      })
    }
  }, [props.businessCardHistory])

  useEffect(() => {
    setListHistoryTmp(_.cloneDeep(listHistory));
  }, [listHistory, props.businessCardHistory])

  useEffect(() => {
    return (() => {
      listHistory.splice(0, 0);
      setOpenMerge(false);
      props.resetStateHistory()
    })
  }, [])


  /**
   * Get the values old and new
   * @param content 
   */
  const getOldNewValue = (content, fieldName) => {
    let oldValue = null;
    let newValue = null;
    let isChange = false;
    const fieldItem = props.businessCardHistory.fieldInfo.find(e => _.toString(e.fieldName) === _.toString(fieldName));
    if (fieldName === "is_working") {
      if ('old' in content) {
        oldValue = content['old'] === "true" ? translate("businesscards.list.isWorking.working") : translate("businesscards.list.isWorking.notWorking")
      }
      if ('new' in content) {
        newValue = content['new'] === "true" ? translate("businesscards.list.isWorking.working") : translate("businesscards.list.isWorking.notWorking")
      }
    } else {
      if ('old' in content) {
        const resOld = [];
        if (fieldItem && (_.toString(fieldItem['fieldType']) === DEFINE_FIELD_TYPE.CHECKBOX ||
          _.toString(fieldItem['fieldType']) === DEFINE_FIELD_TYPE.SINGER_SELECTBOX ||
          _.toString(fieldItem['fieldType']) === DEFINE_FIELD_TYPE.MULTI_SELECTBOX ||
          _.toString(fieldItem['fieldType']) === DEFINE_FIELD_TYPE.RADIOBOX)) {
          const arrOld = toArray(content['old']);
          arrOld.length > 0 && arrOld.forEach(e => {
            resOld.push(getFieldLabel(fieldItem["fieldItems"] && fieldItem["fieldItems"].length > 0 && fieldItem["fieldItems"].find(ele => _.toString(ele.itemId) === _.toString(e)), "itemLabel"));
          })
          oldValue = _.isEmpty(_.toString(resOld)) ? null : _.toString(resOld);
        } else {
          oldValue = (_.isEmpty(content['old']) || content['old'] === "[]") ? null : content['old'];
        }
      }
      if ('new' in content) {
        const resNew = [];
        if (fieldItem && (_.toString(fieldItem['fieldType']) === DEFINE_FIELD_TYPE.CHECKBOX ||
          _.toString(fieldItem['fieldType']) === DEFINE_FIELD_TYPE.SINGER_SELECTBOX ||
          _.toString(fieldItem['fieldType']) === DEFINE_FIELD_TYPE.MULTI_SELECTBOX ||
          _.toString(fieldItem['fieldType']) === DEFINE_FIELD_TYPE.RADIOBOX)) {
          const arrNew = toArray(content['new']);
          arrNew.length > 0 && arrNew.forEach(e => {
            resNew.push(getFieldLabel(fieldItem["fieldItems"] && fieldItem["fieldItems"].length > 0 && fieldItem["fieldItems"].find(elem => _.toString(elem.itemId) === _.toString(e)), "itemLabel"));
          })
          newValue = _.isEmpty(_.toString(resNew)) ? null : _.toString(resNew);
        } else {
          newValue = (_.isEmpty(content['new']) || content['new'] === "[]") ? null : content['new'];
        }
      }
    }
    // If field type is TIME, substring old value, because old value format time is hh:mm:ss, and new value is format hh:ss. It's special item field.
    if (!_.isEmpty(fieldItem) && _.toString(fieldItem.fieldType) === DEFINE_FIELD_TYPE.TIME) {
      isChange = !_.isEqual(_.toString(oldValue).substring(0, 5), _.toString(newValue).substring(0, 5));
      oldValue = _.cloneDeep(oldValue) ? timeUtcToTz(_.cloneDeep(oldValue)) : "";
      newValue = _.cloneDeep(newValue) ? timeUtcToTz(_.cloneDeep(newValue)) : "";
    } else if (!_.isEmpty(fieldItem) && _.toString(fieldItem.fieldType) === DEFINE_FIELD_TYPE.DATE_TIME) {
      isChange = !_.isEqual(oldValue, newValue);
      oldValue = _.cloneDeep(oldValue) ? utcToTz(_.cloneDeep(oldValue), DATE_TIME_FORMAT.User) : "";
      newValue = _.cloneDeep(newValue) ? utcToTz(_.cloneDeep(newValue), DATE_TIME_FORMAT.User) : "";
    } else {
      isChange = !_.isEqual(oldValue, newValue);
    }
    return { oldValue, newValue, isChange }
  }

  /**
   * Check exist field
   * @param keyInput 
   */
  const checkExistField = (keyInput) => {
    const fieldResponse = props.businessCardHistory && props.businessCardHistory.fieldInfo
      && props.businessCardHistory.fieldInfo.find(e => e.fieldName === keyInput);
    if (_.isEmpty(fieldResponse) && !SPECIAL_NAME.includes(keyInput)) {
      return false;
    } else {
      return true;
    }
  }
  /**
   * Get the label value
   * @param key 
   */
  const getLabelNameByKey = (key) => {
    let labelName = "";
    if (key === "zip_code") {
      labelName = translate(prefix + "lable.zipCode");
    } else if (key === "building") {
      labelName = translate(prefix + "lable.buildingName");
    } else if (key === "alternative_customer_name" || key === "customer_name" || key === "customer_id") {
      labelName = translate('businesscards.detailHistory.comapnyName');
    } else if (key === "url_target") {
      labelName = translate('businesscards.detailHistory.urlTarget');
    } else if (key === "url_text") {
      labelName = translate('businesscards.detailHistory.urlText');
    } else if (key === "fileName") {
      labelName = "File";
    }
    else {
      const fieldRes = props.businessCardHistory && props.businessCardHistory.fieldInfo
        && props.businessCardHistory.fieldInfo.find(e => e.fieldName === key)
      if (fieldRes) {
        labelName = JSON.parse(fieldRes.fieldLabel)[lang];
      } else {
        labelName = key;
      }
    }
    return labelName;
  }

  /**
   * Render for History Link
   * @param dataLink 
   */
  const renderForLinkhistory = (dataLink) => {
    const lstKeyLink = Object.keys(dataLink);
    return (
      <>
        {!_.isEmpty(lstKeyLink) && lstKeyLink.map((element, index) => (
          getOldNewValue(dataLink[element], element).isChange && element !== "sort_value" &&
          <p className="type-mission" key={index}>
            {getLabelNameByKey(element)} {" : "}
            {getOldNewValue(dataLink[element], element).oldValue} {" → "} {getOldNewValue(dataLink[element], element).newValue}
          </p>
        ))
        }
      </>
    )
  }

  /**
   * Render for Address History
   * @param dataAddess 
   * @param fieldName 
   */
  const renderAddressHistory = (dataAddess, fieldName) => {
    const oldData = 'old' in dataAddess ? dataAddess['old'] : {};
    const newData = 'new' in dataAddess ? dataAddess['new'] : {};
    const addressOld = tryParseJson(oldData) ? tryParseJson(oldData) : {};
    const addressNew = tryParseJson(newData) ? tryParseJson(newData) : {};
    let oldVal = null;
    let newVal = null;
    if (addressOld.constructor === Object && 'address' in addressOld) {
      oldVal = addressOld['address']
    }
    if ('address' in addressNew) {
      newVal = addressNew['address']
    }

    return (
      <>
        {oldVal !== newVal &&
          <p className="type-mission">
            {getLabelNameByKey(fieldName)} {" : "}
            {oldVal} {" → "} {newVal}
          </p>
        }
      </>
    )
  }

  /**
   * Render for File history 
   * @param dataFile 
   * @param name 
   */
  const renderFileHistory = (dataFile, name) => {
    const oldFileData = 'old' in dataFile ? dataFile['old'] : [];
    const newFileData = 'new' in dataFile ? dataFile['new'] : [];
    const fileOld = tryParseJson(oldFileData);
    const fileNew = tryParseJson(newFileData);
    const lstFileOld = [];
    const lstFileNew = [];
    if (Array.isArray(fileOld)) {
      fileOld.length > 0 && fileOld.forEach(e => {
        lstFileOld.push(_.toString(e['fileName']).split("/").pop())
      })
    } else {
      lstFileOld.push('fileName' in fileOld ? fileOld['fileName'].split("/").pop() : "");
    }
    if (Array.isArray(fileNew)) {
      fileNew.length > 0 && fileNew.forEach(ele => {
        lstFileNew.push(_.toString(ele['fileName']).split("/").pop())
      })
    } else {
      lstFileNew.push('fileName' in fileNew ? _.toString(fileNew['fileName']).split("/").pop() : "");
    }
    return (
      <>
        {lstFileOld !== lstFileNew &&
          <p className="type-mission">
            {getLabelNameByKey(name)} {" : "}
            {_.toString(lstFileOld)} {" → "} {_.toString(lstFileNew)}
          </p>
        }
      </>
    )
  }

  /**
   * get field by field name
   * @param fieldName 
   */
  const getFieldType = (fieldName) => {
    const field = props.businessCardHistory.fieldInfo.find(e => e.fieldName === fieldName);
    return field ? ((fieldName === "address" && field.isDefault) ? "" : field.fieldType) : "";
  }

  /**
   * Render for update type is 1 and 2 
   * @param filedType 
   * @param data 
   * @param fieldName 
   * @param index 
   */
  const renderByField = (filedType, data, fieldName, index) => {
    if (fieldName === "business_card_image_path") {
      const oldValue = data && "old" in data && data['old'];
      const newValue = data && "new" in data && data['new'];
      return (
        <>
          {oldValue !== newValue &&
            <p className="type-mission">
              {getLabelNameByKey(fieldName)} {" : "}
              {_.toString(oldValue).split("/").pop()} {" → "} {_.toString(newValue).split("/").pop()}
            </p>
          }
        </>
      )
    }

    switch (filedType) {
      case DEFINE_FIELD_TYPE.LINK: {
        return renderForLinkhistory(data);
      }
      case DEFINE_FIELD_TYPE.ADDRESS: {
        return renderAddressHistory(data, fieldName);
      }
      case DEFINE_FIELD_TYPE.FILE: {
        return renderFileHistory(data, fieldName);
      }
      case DEFINE_FIELD_TYPE.EMAIL: {
        return getOldNewValue(data, fieldName).isChange && checkExistField(fieldName) && <p className="type-mission" key={index}>
          {getLabelNameByKey(fieldName)} {" : "}
          <a href={`mailto:${getOldNewValue(data, fieldName).oldValue}`} className="text-blue">{getOldNewValue(data, fieldName).oldValue}</a>
          {" → "}
          <a href={`mailto:${getOldNewValue(data, fieldName).newValue}`} className="text-blue">{getOldNewValue(data, fieldName).newValue}</a>
        </p>
      }
      default: {
        return getOldNewValue(data, fieldName).isChange && checkExistField(fieldName) && <p className="type-mission" key={index}>
          {getLabelNameByKey(fieldName)} {" : "}
          {getOldNewValue(data, fieldName).oldValue} {" → "} {getOldNewValue(data, fieldName).newValue}
        </p>
      }
    }
  }

  const renderbusinessCardsReceivesHistories = (item, index, amount) => {
    if (index < amount - 1) {
      const itemPrevious = listHistory[index + 1].businessCardsReceivesHistories;

      if (_.isEqual(item, itemPrevious)) {
        return <></>
      } else {
        const oldValue = [];
        const newValue = [];
        const titleRecieves = translate('businesscards.detailHistory.recievesDate');
        item.forEach(element => {
          const dateNew = dateFnsFormat(element.receiveDate, APP_DATE_FORMAT);
          const employeeNameNewTmp = element.employeeName ? element.employeeName : "";
          const employeeSurnameNewTmp = element.employeeSurname ? element.employeeSurname : "";
          const newItem = employeeNameNewTmp + " " + employeeSurnameNewTmp + titleRecieves + dateNew + ")";
          newValue.push(newItem)
        });
        itemPrevious.forEach(e => {
          const dateOld = dateFnsFormat(e.receiveDate, APP_DATE_FORMAT);
          const employeeNameOldTmp = e.employeeName ? e.employeeName : "";
          const employeeSurnameOldTmp = e.employeeSurname ? e.employeeSurname : "";
          const oldItem = employeeNameOldTmp + " " + employeeSurnameOldTmp + titleRecieves + dateOld + ")";
          oldValue.push(oldItem)
        });
        return (
          <p className="type-mission">
            {translate('businesscards.detailHistory.recievesItem')} {" : "}
            {_.toString(oldValue)} {" → "} {_.toString(newValue)}
          </p>
        )
      }
    } else {
      return <></>
    }
  }

  /**
   * Render each item for the past
   * @param data 
   */
  const renderDefaultItem = (data) => {
    if (data) {
      const lstKey = Object.keys(data);
      return (
        <>
          {!_.isEmpty(lstKey) && lstKey.map((ele, index) => (
            renderByField(_.toString(getFieldType(ele)), data[ele], ele, index)
          ))
          }
        </>
      )
    } else {
      return <></>
    }
  }

  /**
   * Click on the merged business card name to move its detail
   * @param idBusinessCardMergeHistory 
   */
  const openDetailHistoryMerge = (idBusinessCardMergeHistory, updatedDateIn) => {
    props.handleInitBusinessCardChangeHistory(idBusinessCardMergeHistory, 0, 30, null, true);
    setUpdatedDate(updatedDateIn);
    setOpenMerge(true);
  }

  /**
   * Render title for update type is 2
   * @param item 
   */
  const renderMergeHistory = (item) => {
    if ("mergedBusinessCards" in item && !_.isEmpty(item.mergedBusinessCards)) {
      return <>
        {item.mergedBusinessCards.length > 0 && item.mergedBusinessCards.map((element, index) =>
          <>
            <a className="text-blue cursor-pointer" onClick={() => openDetailHistoryMerge(element.businessCardId, item.updatedDate)}>{element.firstName ? element.firstName : ""}</a>
            {element.lastName && <a className="text-blue cursor-pointer" onClick={e => openDetailHistoryMerge(element.businessCardId, item.updatedDate)}>{" "}{element.lastName}</a>}
            {
              element.companyName ?
                (index === (item.mergedBusinessCards.length - 1)) ?
                  <> {"("}{element.companyName}{translate('businesscards.detailHistory.mergeOne')}</>
                  :
                  <>{"("}{element.companyName}{translate('businesscards.detailHistory.endMergeOne')}</>
                :
                (index === (item.mergedBusinessCards.length - 1)) ?
                  <>{translate('businesscards.detailHistory.mergeTwo')}</>
                  :
                  <>{translate('businesscards.detailHistory.endMergeTwo')}</>
            }
          </>
        )}
        {item.firstName ? item.firstName : ""} {item.lastName ? item.lastName : ""}
        {item.companyName ? "(" + item.companyName + ")" : ""}
        {translate('businesscards.history.title.coherence')}
      </>
    } else {
      return <>{item.firstName ? item.firstName : ""} {item.lastName ? item.lastName : ""}
        {item.companyName ? "(" + item.companyName + ")" : ""}
        {translate('businesscards.history.title.update')}
      </>
    }
  }

  /**
   * Render for avatar employee
   * @param item 
   */
  const renderImageAvatar = (item) => {
    return <EmployeeName
      userName={item.updatedUserName}
      userImage={item.updatedUserPhotoPath}
      employeeId={item.updatedUser}
      sizeAvatar={30}
      backdrop={false}
      width={104}
    ></EmployeeName>
  }

  /**
   * This function is used to create data structure to call back data for the main screen
   */
  const initDataForHistoryDetail = (dataHistoryInput, indexHistory, amountOfHistory) => {
    const lstHisotyData = [];
    const lstCompanyNameHistory = [];
    const lsttmpCustomerNameHistory = [];
    const lstCustomerIdHistory = [];
    const lstAlternativeCustomerNameHistory = [];

    if (Array.isArray(dataHistoryInput) && dataHistoryInput.length > 0) {
      dataHistoryInput.forEach(dataHistory => {
        const currentDataBussinessCard = _.cloneDeep(props.businessCardCurrentDetail);
        const tmpDataHistory = _.cloneDeep(dataHistory);
        const tmpDataHistoryClone = _.cloneDeep(dataHistory);
        if ('businessCardDetail' in currentDataBussinessCard) {
          lstCompanyNameHistory.push(_.cloneDeep(tmpDataHistoryClone['companyName']))
          lsttmpCustomerNameHistory.push(_.cloneDeep(tmpDataHistoryClone['customerName']))
          lstCustomerIdHistory.push(_.cloneDeep(tmpDataHistoryClone['customerId']))
          lstAlternativeCustomerNameHistory.push(_.cloneDeep(tmpDataHistoryClone['alternativeCustomerName']))
          tmpDataHistory['companyName'] = currentDataBussinessCard.businessCardDetail['companyName'];
          tmpDataHistory['customerName'] = currentDataBussinessCard.businessCardDetail['customerName'];
          tmpDataHistory['customerId'] = currentDataBussinessCard.businessCardDetail['customerId'];
          tmpDataHistory['alternativeCustomerName'] = currentDataBussinessCard.businessCardDetail['alternativeCustomerName'];
          tmpDataHistory['businessCardReceives'] = tmpDataHistoryClone['businessCardsReceivesHistories'];
          tmpDataHistory['activityId'] = currentDataBussinessCard.businessCardDetail['activityId'];
          tmpDataHistory['branchName'] = currentDataBussinessCard.businessCardDetail['branchName'];
          tmpDataHistory['hasFollow'] = currentDataBussinessCard.businessCardDetail['hasFollow'];
          tmpDataHistory['isAutoGeneratedImage'] = currentDataBussinessCard.businessCardDetail['isAutoGeneratedImage'];
          tmpDataHistory['fileNameCreatedUser'] = tmpDataHistoryClone['createdUserPhotoName'];
          tmpDataHistory['filePathCreatedUser'] = tmpDataHistoryClone['createdUserPhotoPath'];
          tmpDataHistory['fileNameUpdatedUser'] = tmpDataHistoryClone['updatedUserPhotoName'];
          tmpDataHistory['filePathUpdatedUser'] = tmpDataHistoryClone['updatedUserPhotoPath'];
          currentDataBussinessCard["businessCardDetail"] = tmpDataHistory;
        }
        lstHisotyData.push(currentDataBussinessCard)
      })
    }
    props.setCompanyNameHistory(lstCompanyNameHistory,
      lsttmpCustomerNameHistory,
      lstCustomerIdHistory,
      lstAlternativeCustomerNameHistory, indexHistory);
    props.setDataDetailHistory(lstHisotyData, indexHistory, amountOfHistory);
  }

  /**
   * Set mode for history detail
   * @param listData list data history
   * @param index current index
   * @param total amount of list data history
   */
  const setMode = (listData, index, total) => {
    const lstUpdateedDate = []
    listData.forEach(e => {
      lstUpdateedDate.push(utcToTz(e.updatedDate, DATE_TIME_FORMAT.User))
    });
    props.setModeComponent("history", TAB_ID_LIST.summary, lstUpdateedDate, index, total)
  }

  useEffect(() => {
    if (props.dataDetailMergedBusinessCard) {
      if (props.dataDetailMergedBusinessCard.businessCardHistories && props.dataDetailMergedBusinessCard.businessCardHistories.length > 0 && openMerge) {
        props.setModeComponent("history", TAB_ID_LIST.summary, [utcToTz(updatedDate, DATE_TIME_FORMAT.User)], 0, 1)
        initDataForHistoryDetail(props.dataDetailMergedBusinessCard.businessCardHistories, 0, 1);
      }
    }
  }, [props.dataDetailMergedBusinessCard, openMerge])

  /**
   * Render component
   * @param item 
   */
  const contentActivityHistories = (item, indexItem, amountOfHistory) => {
    let defaultItem = null;
    let dataItem = null;
    const contentChange = item.contentChange ? JSON.parse(item.contentChange) : {};

    if ('businessCardData' in contentChange) {
      dataItem = JSON.parse(contentChange['businessCardData']);
      defaultItem = delete contentChange['businessCardData'];
    } else {
      defaultItem = _.isEmpty(contentChange) ? null : contentChange;
    }

    return (
      <div className="time-item" id={indexItem}>
        <div className="title">
          {item['updateType'] === 2 ? renderMergeHistory(item) :
            <>{item.firstName} {item.lastName ? item.lastName : ""}
              {item.companyName ? "(" + item.companyName + ")" : ""}
              {item['updateType'] === 1 ? translate('businesscards.history.title.update') : translate('businesscards.history.title.info')}
            </>
          }
        </div>
        <div className="mission-wrap">
          {
            renderDefaultItem(defaultItem)
          }
          {
            renderbusinessCardsReceivesHistories(item.businessCardsReceivesHistories, indexItem, amountOfHistory)
          }
          <div className="item item2">
            <div className="text-blue">
              <span className="date w-auto cursor-pointer"
                onClick={() => { setMode(listHistory, indexItem, amountOfHistory); initDataForHistoryDetail(listHistory, indexItem, amountOfHistory) }}>
                {utcToTz(item.updatedDate, DATE_TIME_FORMAT.User)}
              </span>
            </div>
            <div className="user-info">
              {renderImageAvatar(item)}
            </div>
          </div>
        </div>
      </div>
    )
  };

  return (
    <>
      <div className="tab-pane active">
        <div className="list-table style-3 pr-3 height-auto">
          <div className="time-line">
            {listHistory.length && listHistory.map((item, indexItem) => {
              return contentActivityHistories(item, indexItem, listHistory.length)
            })}
          </div>
        </div>
      </div>
    </>
  );
}

const mapStateToProps = ({ businessCardDetail }: IRootState) => ({
  businessCardHistory: businessCardDetail.businessCardHistory,
  actionType: businessCardDetail.action,
  errorMessage: businessCardDetail.errorMessage,
  dataDetailMergedBusinessCard: businessCardDetail.businessCardHistoryById
});

const mapDispatchToProps = {
  handleInitBusinessCardChangeHistory,
  resetStateHistory
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TabChangeHistory);