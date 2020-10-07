import React, { useEffect, useState } from 'react'
import { translate } from 'react-jhipster'
import _ from 'lodash';
import { TimelinesType } from '../../models/get-user-timelines-type';
import { isArray, isObject, isString } from 'util';
import { CommonUtil } from '../../common/CommonUtil';
import { LABEL_AUTO, LABEL_INFO_AUTO, TYPE_DETAIL_MODAL_HEADER, 
  MODE_CONTENT, 
  LABEL_INFO_AUTO_LANG,
  DATE_FIELD,
  TYPE_DETAIL_AUTO } from '../../common/constants'
import { Storage } from 'react-jhipster';
import { DEFINE_FIELD_TYPE } from 'app/shared/layout/dynamic-form/constants';
import { ObjectDetail } from '../../models/get-followeds-model';

type ITimelineContentCommentAutoProp = {
  contentAuto: string,
  timelinePost: TimelinesType;
  openDetail?: (objectValue: ObjectDetail) => void;
}


const TimelineContentCommentAuto = (props: ITimelineContentCommentAutoProp) => {
  const headerType = CommonUtil.getTypeShowAuto(props.timelinePost?.header?.headerType);


  // wrap data change for activity_time
  const wrapContentChange = (value) => {
    const activityStartTime = value['activity_start_time']
    const activityEndTime = value['activity_end_time']
    const activityDuration = value['activity_duration']
    delete value['activity_start_time']
    delete value['activity_end_time']
    delete value['activity_duration']
    value['activity_time'] = {
      new: CommonUtil.convertToTime(activityStartTime?.new) + '-' + CommonUtil.convertToTime(activityEndTime?.new) + ' ' + (activityDuration?.new || '') + ' ' + translate('activity.modal.minute'),
      old: CommonUtil.convertToTime(activityStartTime?.old) + '-' + CommonUtil.convertToTime(activityEndTime?.old) + ' ' + (activityDuration?.old || '') + ' ' + translate('activity.modal.minute'),
    }
    return value;
  }

  const lang = Storage.session.get('locale', "ja_jp");

  /**
  * get label by field name
  * @param fieldName 
  */
  const getLabel = (fieldName: string) => {
    const keyLable = LABEL_AUTO.find(e => e.label === headerType +'_'+ fieldName);
    if(keyLable!= null) // find label have translate
    {
      return translate(keyLable.key.toString());
    }
    else { // find label have multi language
      const multiLangField = LABEL_INFO_AUTO_LANG['timelineAuto.'+headerType+'.'+fieldName]
      if(multiLangField){
        return multiLangField[lang];
      }
      return fieldName;
    } 
  }
  
  /**
  * get field type by field name
  * @param fieldName 
  */
  const getFieldType = (fieldName: string) => {
      const type = headerType; 
      const keyLableAuto = LABEL_INFO_AUTO.find(e => e.label === type +'_'+ fieldName);
      if(keyLableAuto){
        return keyLableAuto.type;
      }
      return DEFINE_FIELD_TYPE.OTHER;
  }

  /**
  * get field type by field name
  * @param fieldName 
  */
  const isFieldDate = (fieldName) => {
      return DATE_FIELD.includes(fieldName);
  }

  const tryParseJson = val => {
    let response = null;
    try {
      response = JSON.parse(val);
      return response;
    } catch {
      return {};
    }
  };

  /**
   * check string is Json
   * @param str 
   */
  const isJson = (str) => {
    if (typeof str !== 'string') return false;
    try {
      const result = JSON.parse(str);
      const type = Object.prototype.toString.call(result);
      return type === '[object Object]'
        || type === '[object Array]';
    } catch (err) {
      return false;
    }
  }

  /**
   * Get the values old and new
   * @param content 
   */
  const getOldNewValue = (content, fieldName) => {
    let oldValue = null;
    let newValue = null;
    let isChange = false;
    if (content) {
      if ('old' in content) {
        oldValue = content.old;
      }
      if ('new' in content) {
        newValue = content.new;
      }
      // Convert date
      if (isFieldDate(fieldName)) {
        // convert to get datetime from json
        if (newValue && typeof newValue !== 'string' && newValue.seconds) {
          if (oldValue && oldValue.seconds) {
            oldValue = CommonUtil.getJustDateTimeZone(new Date(oldValue.seconds * 1000))
          }
          newValue = CommonUtil.getJustDateTimeZone(new Date(newValue.seconds * 1000))
          isChange = !_.isEqual(oldValue, newValue);
        }
        else {
          isChange = !_.isEqual(oldValue, newValue);
          if(oldValue && Date.parse(oldValue)) {
            oldValue = _.cloneDeep(oldValue) ? CommonUtil.getJustDateTimeZone(_.cloneDeep(oldValue)) : "";
          }
          if(newValue && Date.parse(newValue)) {
            newValue = _.cloneDeep(newValue) ? CommonUtil.getJustDateTimeZone(_.cloneDeep(newValue)) : "";
          }
        }
      } else {
        isChange = !_.isEqual(oldValue, newValue);
      }
    }

    return { oldValue, newValue, isChange }
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
          <p className="type-mission mb-0">
            {name} {" : "}
            {_.toString(lstFileOld)} {" → "} {_.toString(lstFileNew)}
          </p>
        }
      </>
    )
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
          <p className="type-mission mb-0" key={index}>
            {getLabel(element)} {" : "}
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
          <p className="type-mission mb-0">
            {getLabel(fieldName)} {" : "}
            {oldVal} {" → "} {newVal}
          </p>
        }
      </>
    )
  }

  /**
   * render data information change in channel
   */
  const renderInfoRelationDetail = (fileName, value, type) => {
    const oldNewValue = getOldNewValue(value, fileName);

    if(props.timelinePost.comment?.mode === MODE_CONTENT.CREATE_AUTO){ // if mode create just show old value
      return (
        <>
          <div>
            {getLabel(fileName)}{" : "}
            <a className="text-blue no-underline"
              onClick={()=> {if(props.openDetail) props.openDetail({objectId: oldNewValue.newValue, objectType: type})}}>
              {oldNewValue.newValue}
            </a>
          </div>
        </>)
    }
    return (
      <>
        <div>
          {getLabel(fileName)}{" : "}
          <a className="text-blue no-underline"
              onClick={()=> {if(props.openDetail) props.openDetail({objectId: oldNewValue.oldValue, objectType: type})}}>
              {oldNewValue.oldValue}
          </a>
          {" → "}
          <a className="text-blue no-underline"
              onClick={()=> {if(props.openDetail) props.openDetail({objectId: oldNewValue.newValue, objectType: type})}}>
              {oldNewValue.newValue}
          </a>
        </div>
      </>
    );
  }

  const textValue = (value) => {
    // let res = translate('activity.activityDetail.blank');
    if (isObject(value)) {
      return JSON.stringify(value) || "";
    } else if(isString(value)) {
      return value.length > 0 ? value : "";
    } else if(isArray(value)){
      return value.length > 0 ? JSON.stringify(value) : "";
    } else if (value != null) {
      return value.toString()
    } else {
      return "";
    }
  }

   const showLink = (text: string) => {
      if (text) {
      const regex1  = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gim;
      const regex2  = /[\w.+]+@[a-zA-Z_-]+?(?:\.[a-zA-Z]{2,9})+/gim;
      text = text.replace(regex1, (match :string) => {
        return `<a target="_blank" href="${match}">${match}</a>`;
      });
      text = text.replace(regex2, (match :string) => {
        return `<a  href="mailto:${match}">${match}</a>`;
      });
    }
    return text;
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
            <p className="type-mission mb-0">
              {getLabel(fieldName)} {" : "}
              {props.timelinePost?.comment?.mode === MODE_CONTENT.UPDATE_AUTO && _.toString(oldValue)} 
              {props.timelinePost?.comment?.mode === MODE_CONTENT.UPDATE_AUTO && " → "} 
              {_.toString(newValue)}
            </p>
          }
        </>
      )
    }

    // check is detail field
    const detailType = TYPE_DETAIL_AUTO[headerType+'.'+fieldName]
    if(detailType){
      return renderInfoRelationDetail(fieldName, data, detailType);
    }

    // check dynamic form
    // if (data && isJson(data.old || data.new)) {
    //   const oldValue = data.old? JSON.parse(data.old): {};
    //   const newValue = JSON.parse(data.new);
    //   const fields = _.keys(newValue);
    //   return <>
    //     {fields && fields.map((field, idx) => {
    //       return <p className="type-mission mb-0" key={`data_${fieldName}_${field}_${idx}`}>
    //           {getLabel(field)} {" : "}
    //           {props.timelinePost?.comment?.mode === MODE_CONTENT.UPDATE_AUTO && textValue(oldValue[field])} 
    //           {props.timelinePost?.comment?.mode === MODE_CONTENT.UPDATE_AUTO && " → "} 
    //           {textValue(newValue[field])}
    //         </p>
    //     })}
    //   </>
    // }


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
        return getOldNewValue(data, fieldName).isChange && <p className="type-mission mb-0" key={index}>
          {getLabel(fieldName)} {" : "}
          <a href={`mailto:${getOldNewValue(data, fieldName).oldValue}`} className="text-blue">{getOldNewValue(data, fieldName).oldValue}</a>
          {" → "}
          <a href={`mailto:${getOldNewValue(data, fieldName).newValue}`} className="text-blue">{getOldNewValue(data, fieldName).newValue}</a>
        </p>
      }
      default: {
        return getOldNewValue(data, fieldName).isChange && <p className="type-mission mb-0" key={index}>
          {getLabel(fieldName)} {" : "}
          {props.timelinePost?.comment?.mode === MODE_CONTENT.UPDATE_AUTO &&
            <span dangerouslySetInnerHTML={{ __html: showLink(textValue(getOldNewValue(data, fieldName).oldValue)) }}>
            </span>}
          {props.timelinePost?.comment?.mode === MODE_CONTENT.UPDATE_AUTO && " → "}
          {<span dangerouslySetInnerHTML={{ __html: showLink(textValue(getOldNewValue(data, fieldName).newValue)) }}>
            </span>}
        </p>
      }
    }
  }

  /**
   * Render each item for the past
   * @param data 
   */
  const renderDefaultItem = (data) => {
    if (data) {
      headerType === TYPE_DETAIL_MODAL_HEADER.ACTIVITY && wrapContentChange(data);
      const lstKey = Object.keys(data);
      return (
        <>
          {!_.isEmpty(lstKey) && lstKey.map((ele, index) => (
            renderByField(_.toString(getFieldType(ele)), data[ele], _.snakeCase(ele), index)
          ))
          }
        </>
      )
    } else {
      return <></>
    }
  }

  return (
    <>
          {/* render auto */}
          <div className="tab-pane active">
            <div className="list-table style-3 pr-3 height-auto">
                  {
                    renderDefaultItem(props.contentAuto && isJson(props.contentAuto) ? JSON.parse(props.contentAuto) : {})
                  }     
            </div>
          </div>
          {/* render auto */}
    </>
  );
}

export default TimelineContentCommentAuto
