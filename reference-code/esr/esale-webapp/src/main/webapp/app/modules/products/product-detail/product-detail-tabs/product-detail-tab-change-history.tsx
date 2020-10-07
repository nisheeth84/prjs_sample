import React from 'react';
import { DUMMY_LANGUAGE_LABEL } from '../../constants'
import { isJsonString } from '../../utils';
import { getValueProp } from 'app/shared/util/entity-utils';
import { Storage, translate } from 'react-jhipster';
import _ from 'lodash';

export interface IPopupTabChangeHistory {
  changeHistory: any;
  languageId: number;
  productLayout: any;
  openModalEmployeeDetail: (paramEmployeeId) => void;
  data: any;
}

const TYPE_NOT_ARRAY = "-1"

const TabChangeHistory = (props: IPopupTabChangeHistory) => {
  let checkFirstImage = true;
  
  const getLabel = () => {
    const label = [];
    DUMMY_LANGUAGE_LABEL.languages.forEach(element => {
      if (element.languageId === props.languageId) {
        label.push(element.labelChange);
        label.push(element.year);
        label.push(element.month);
        label.push(element.date)
      }
    });
    return label;
  }
  const label = getLabel();

  const lang = Storage.session.get('locale', "ja_jp");
  const getFieldLabel = (item, fieldLabel) => {
    if (!item) {
      return '';
    }
    if (_.has(item, fieldLabel)) {
      const labels = _.isString(item[fieldLabel]) ? JSON.parse(item[fieldLabel]) : item[fieldLabel];
      if (_.has(labels, lang)) {
        return getValueProp(labels, lang)
      }
    }
    return '';
  }

  const getFieldLabeByLanguage = (key, type) => {
    let fielLabel = ""
    props.productLayout && props.productLayout.forEach((item) =>{
      if(item.fieldName === key){
        fielLabel = getFieldLabel(item, 'fieldLabel');
      }
    })
    return fielLabel;
  }

  const getOldNewValue = (value) => {
    const oldNewValue = []
    oldNewValue.push(value.old)
    oldNewValue.push(value.new)
    return oldNewValue;
  }

  const renderOldNewData = (data) => {
    return data ? data : translate("products.detail.label.content.create");
  }

  const renderProductData = (param) => {
    return(
      param.map((item) =>
        <>
        {
          item.oldData.toString() !== item.newData.toString() ?
          <>
            { _.isArray(item.oldData) ?  
              <>
                <div>{getFieldLabeByLanguage(item.key,TYPE_NOT_ARRAY)}:</div>
                {Array.isArray(item.oldData) &&
                  item.oldData.map((item1, index1) =>
                    <>
                      {item.oldData[index1] !== item.newData[index1] && 
                        <div className="mission-wrap">
                          <p className="type-mission">{getFieldLabeByLanguage(item.key,index1)} :&nbsp;
                            {renderOldNewData(item.oldData[index1])}
                            <img className="arrow" src="../../content/images/ic-time-line-arrow.svg" alt="" /> 
                            {renderOldNewData(item.newData[index1])}
                          </p>
                        </div>
                      }
                    </>
                  )
                }
              </>
              :
              <div className="mission-wrap">
                <p className="type-mission">
                  {getFieldLabeByLanguage(item.key,TYPE_NOT_ARRAY)}:
                  {renderOldNewData(item.oldData)} <img className="arrow" src="../../content/images/ic-time-line-arrow.svg" alt="" /> {renderOldNewData(item.newData)}
                </p>
              </div>
              
            }
          </> :
          <></>
        }
        </>
      )
    )
  }

  const renderInformationChange = (item) => {
    const keyString = item.key.toString();
    if(keyString === 'product_data'){
      if (item.value){
          const strNew = item.value.new;
          const strOld = item.value.old;
          const key = Object.keys(JSON.parse(strOld));
          const valueOld = Object.values(JSON.parse(strOld));
          const valueNew = Object.values(JSON.parse(strNew));
          const dataHistory = [];
          for ( let i = 0; i < key.length; i++){
              dataHistory.push({key: key[i], newData: valueNew[i] ? valueNew[i] : '', oldData: valueOld[i] ? valueOld[i] : ''})
          }
          if(dataHistory.length > 0){
            return(
              <>
                {renderProductData(dataHistory)}
              </>
            )
          }
      }
    } else {
      const oldNewValue = getOldNewValue(item.value);
      if(item.key === 'photo_file_path'){
        if(item.value && item.value.file_path && item.value.file_name){
          if(checkFirstImage){
            checkFirstImage = false;
  
            return (
              <div className="mission-wrap">
                <p className="type-mission">
                  {getFieldLabeByLanguage(item.key, TYPE_NOT_ARRAY)}:
                  {renderOldNewData(item.value.file_name.old)}
                  <img className="arrow" src="../../content/images/ic-time-line-arrow.svg" alt="" />
                  {renderOldNewData(item.value.file_name.new)}
                </p>
              </div>
            )
          } else{
            return (
              <div className="mission-wrap">
                <p className="type-mission">
                  {getFieldLabeByLanguage(item.key, TYPE_NOT_ARRAY)}:
                  {renderOldNewData(item.value.file_name.old)}
                  <img className="arrow" src="../../content/images/ic-time-line-arrow.svg" alt="" />
                  {renderOldNewData(item.value.file_name.new)}
                </p>
              </div>
            )
          }
        }
      }else{
        return(
          <div className="mission-wrap">
            <p className="type-mission">
              {getFieldLabeByLanguage(item.key, TYPE_NOT_ARRAY)}:
              {renderOldNewData(oldNewValue[0])}  <img className="arrow" src="../../content/images/ic-time-line-arrow.svg" alt="" /> {renderOldNewData(oldNewValue[1])}
            </p>
          </div>
        )
      }
    }
  }

  const getContentChange = data => {
    const res = []
    if (data && isJsonString(data)) {
      const result = JSON.parse(data);
      Object.keys(result).forEach((key) => {
        const newElement = {};
        newElement['key'] = key;
        newElement['value'] = result[key];
        res.push(newElement)
      })
    }
    return res;
  }

  return (
    <div className="tab-content">
      <div className="time-line">
        {
          props.changeHistory.map((item, index) => {
            const contentChange = getContentChange(item.contentChange);
            const arrayTime = item ? item.createdDate.split(" ") : "";
            const arrayDayMonthYear = arrayTime[0].split("/");
            return (
              <>
                <div className="title">{contentChange && contentChange.length ? translate("products.detail.label.title.update") : translate("products.detail.label.title.create")}</div>
                <div>
                  {contentChange ? contentChange.map(function (item1) {
                    return (
                      <>
                        {renderInformationChange(item1)}
                      </>
                    )
                  }) : <></>}

                  <div className="item item2">
                    <img className="user" src={item.createdUserImage} alt="" />
                    <span className="text-blue"><a className="text-blue" onClick={() => props.openModalEmployeeDetail(item.createdUserId)}>{item.createdUserName}</a>&nbsp;</span>
                    <span className="date w-auto">{arrayDayMonthYear[0]}{label[1]}{arrayDayMonthYear[1]}{label[2]}{arrayDayMonthYear[2]}{label[3]}</span>
                    <span className="date w-auto">{arrayTime[1]}</span>
                  </div>
                </div>
              </>
            )
          })
        }
      </div>
    </div>
  );
}
export default TabChangeHistory;