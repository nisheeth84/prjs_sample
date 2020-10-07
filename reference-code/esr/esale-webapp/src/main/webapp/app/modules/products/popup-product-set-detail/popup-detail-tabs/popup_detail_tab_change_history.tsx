import _ from 'lodash';
import React from 'react';
import { DUMMY_LANGUAGE_LABEL } from 'app/modules/products/constants';
import { isJsonString, addDefaultLabel } from '../../utils';
import { Storage, translate } from 'react-jhipster';
import { getValueProp } from 'app/shared/util/entity-utils';
import StringUtils from 'app/shared/util/string-utils';
import moment from 'moment';


export interface IPopupTabChangeHistory {
  changeHistory: any;
  languageId: number;
  productLayout: any;
  openModalEmployeeDetail: (paramEmployeeId) => void;
}


const TabChangeHistory = (props: IPopupTabChangeHistory) => {
  const TYPE_NOT_ARRAY = "-1";
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
    if (!item) return '';
    if (_.has(item, fieldLabel)) {
      const labels = _.isString(item[fieldLabel]) ? JSON.parse(item[fieldLabel]) : item[fieldLabel];
      if (_.has(labels, lang)) {
        return getValueProp(labels, lang)
      }
    }
    return '';
  }

  const getFieldLabeByLanguage = (key, type) => {
    let fieldLabel = "";

    props.productLayout && props.productLayout.forEach((item) =>{
      if(item.fieldName === key){
        switch (key) {
          case 'product_name':
            fieldLabel = translate('products.detail.label.product.name');
            break;
          case 'product_image_name':
            fieldLabel = translate('products.detail.label.product.imagename');
            break;
          case 'product_type_id':
            fieldLabel = translate('products.detail.label.product.typeid');
            break;
          case 'unit_price':
            fieldLabel = translate('products.detail.label.product.unitprice');
            break;
          default:
            fieldLabel = getFieldLabel(item, 'fieldLabel');
            break;
        }
      }
    })
    return fieldLabel;
  }

  const getKey = (paramContentChange) => {   
    let title = '';
    switch(paramContentChange.action){
      case 0:
        title = paramContentChange['product_name'] + translate("products.detail.label.title.delete");
        break;
      case 1:
        title = paramContentChange['product_name'] + translate("products.detail.label.title.insert");
        break;
      case 2 :
        title = paramContentChange['product_name'] + translate("products.detail.label.title.updateSet");
        break 
      default:
        break 
    }
    return title;
  }

  const checkIsProductSetHistory = (obj) => {
    if(obj && _.has(obj, 'action') && _.has(obj, 'product_name')){
      return true;
    }
    return false;
  }

  const mappingContentChange = paramContentChange => {
    const contentChange = [];
    if(checkIsProductSetHistory(paramContentChange)){
      contentChange.push({
        key: getKey(paramContentChange),
        value: paramContentChange
      })
    } else{
      _.keys(paramContentChange).forEach((key) => {
        const newElement = {};
        newElement['key'] = key;
        newElement['value'] = paramContentChange[key];
        contentChange.push(newElement);
      })
    }
    
    return contentChange
  }

  const getContentChange = data => {
    let contentChanges = [];
    if (data && isJsonString(data)) {
      const result = JSON.parse(data);

      if(_.isArray(result) && !_.compact(result).length) return contentChanges;
      if(_.isArray(result) && _.compact(result).length){
        result.forEach(el => {
          contentChanges = contentChanges.concat(mappingContentChange(el));
        });
      } else{
        contentChanges = mappingContentChange(result);
      }
    }

    return contentChanges;
  }

  const renderOldNewData = (oldData) => {
    return oldData ? oldData : translate("products.detail.label.content.create");
  }

  const renderProductData = (contentProductSetData) => {
    if (contentProductSetData){
      const strNew = contentProductSetData.new;
      const strOld = contentProductSetData.old;
      const key = _.keys(JSON.parse(strNew));
      const valueOld = Object.values(JSON.parse(strOld));
      const valueNew = Object.values(JSON.parse(strNew));
      const dataHistory = [];
      
      for ( let i = 0; i < key.length; i++){
        dataHistory.push({key: key[i], newData: valueNew[i] ? valueNew[i] : '', oldData: valueOld[i] ? valueOld[i] : ''})
      }

      return(
        dataHistory.map((item) =>
          <>
          {
            _.toString(item.oldData) !== _.toString(item.newData) ?
            <>
              { _.isArray(item.oldData) ? 
                <>
                  <div>{getFieldLabeByLanguage(item.key, TYPE_NOT_ARRAY)}:</div>
                  {
                    item.oldData && _.isArray(item.oldData) && item.oldData.map((item1, index1) =>
                      <>
                        {item.oldData[index1] !== item.newData[index1] && 
                          <div className="mission-wrap">
                            <p className="type-mission">{getFieldLabeByLanguage(item.key, index1)} :&nbsp;
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
                    {getFieldLabeByLanguage(item.key, TYPE_NOT_ARRAY)}:
                    {renderOldNewData(item.oldData)} <img className="arrow" src="../../content/images/ic-time-line-arrow.svg" alt="" /> {renderOldNewData(item.newData)}
                  </p>
                </div>
              }
            </> : <></>
          }
          </>
        )
      )  
    }
  }

  const renderContent = item => {  
    if(!checkIsProductSetHistory(item.value)){
      return(
        <div className="mission-wrap">
          <p className="type-mission">
            {getFieldLabeByLanguage(item.key, TYPE_NOT_ARRAY)}:
            {renderOldNewData(item.value.old)} <img className="arrow" src="../../content/images/ic-time-line-arrow.svg" alt="" /> {renderOldNewData(item.value.new)}
          </p>
        </div>
      )
    } else{
      return(
        <div className="mission-wrap">
          <p className="type-mission">
            {item.key}
            {_.keys(item.value).map((key, index) => {
              if(typeof item.value[key] !== 'object') return <></>;
              if(key === 'product_set_data'){
                return(
                  <>
                    {renderProductData(item.value[key])}
                  </>
                )
              }

              return (
                <div className="mission-wrap" key={index}>
                  <p className="type-mission">
                    {getFieldLabeByLanguage(key, TYPE_NOT_ARRAY)}:
                    { renderOldNewData(item.value[key].old) }  <img className="arrow" src="../../content/images/ic-time-line-arrow.svg" alt="" /> {renderOldNewData(item.value[key].new)}
                  </p>
                </div>
              )
            })}
          </p>
        </div>
      )
    }
  }

  const renderInformationChange = (item) => {
    const keyString = _.toString(item.key);

    if(keyString === 'product_data'){
      return(
        <>
          {renderProductData(item.value)}
        </>
      )
    } else if(item.key === 'product_image_name'){
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
    } else{
      return(
        <>
          {renderContent(item)}
        </>
      )
    }
  }

  return (
    <div className="tab-content">
      <div className="tab-pane active">
        <div className="time-line">
          {
            props.changeHistory.map((item, index) => {
              const contentChange = getContentChange(item.contentChange);
              const arrayTime = item && item.createdDate ? moment(item.createdDate).format('YYYY/MM/DD HH:mm').split(" ") : "";
              const arrayDayMonthYear = arrayTime && arrayTime[0] ? arrayTime[0].split("/") : "";
              
              return (
                <>
                  <div className="title">{contentChange && contentChange.length ? translate("products.detail.label.title.update") : translate("products.detail.label.title.create")}</div>
                  {contentChange.map(function (content) {
                    return (
                      <>
                        {renderInformationChange(content)}
                      </>
                    )
                  })}
                <div className="item item2">
                  <img className="user" src={item.createdUserImage} alt="" />
                  <span className="text-blue"><a className="text-blue" onClick={() => props.openModalEmployeeDetail(item.createdUserId)}>{item.createdUserName}</a>&nbsp;</span>
                  <span className="date w-auto">{arrayDayMonthYear[0]}{label[1]}{arrayDayMonthYear[1]}{label[2]}{arrayDayMonthYear[2]}{label[3]}</span>
                  <span className="date w-auto">{arrayTime[1]}</span>
                </div>
              </>)
            })
          }
        </div>
      </div>
    </div>
  );
}
export default TabChangeHistory;