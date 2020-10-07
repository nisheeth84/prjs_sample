import _ from 'lodash';
// import moment from 'moment';

import React from 'react';
import { translate } from 'react-jhipster';
// import { getValueProp } from 'app/shared/util/entity-utils';
import { jsonParse } from 'app/shared/util/string-utils';
import { FIELD } from './constants';
import { utcToTz, DATE_TIME_FORMAT } from 'app/shared/util/date-utils';
import ArrowChange from './components/ArrowChange';
import { getFieldLabeByLanguage, renderEmptyData } from './utils';
import DefaultData from './components/DefaultData';
import EmployeeName from '../EmployeeName';

// const Img = styled.img`
//   width: 100px;
//   height: 100px;
// `

export enum SpecialHistory {
  productSet
}

export interface ITabChangeHistory {
  changeHistory: any;
  fieldInfo: any;
  type?: SpecialHistory;
  fieldNameExtension: string;
  openModalEmployeeDetail?: (paramEmployeeId) => void;
  sourceData?: any;
}

const TabChangeHistory = (props: ITabChangeHistory) => {
  // const langUser = Storage.session.get('locale', 'ja_jp');
  let checkFirstImage = true;

  // const getFieldLabel = (item, fieldLabel) => {
  //   if (!item) return '';
  //   if (_.has(item, fieldLabel)) {
  //     const labels = _.isString(item[fieldLabel]) ? JSON.parse(item[fieldLabel]) : item[fieldLabel];
  //     if (_.has(labels, langUser)) {
  //       return getValueProp(labels, langUser);
  //     }
  //   }
  //   return '';
  // };

  const getKeySpecial = (dataContentChange, params: any) => {
    const result = {
      title: ''
    };
    switch (dataContentChange.action) {
      case 0:
        result.title =
          dataContentChange[params.productName] + translate('products.detail.label.title.delete');
        break;
      case 1:
        result.title =
          dataContentChange[params.productName] + translate('products.detail.label.title.insert');
        break;
      case 2:
        result.title =
          dataContentChange[params.productName] +
          translate('products.detail.label.title.updateSet');
        break;
      default:
        break;
    }
    return result;
  };

  const checkIsSpecialHistory = (dataContentChange, type: SpecialHistory) => {
    if (
      dataContentChange &&
      _.has(dataContentChange, FIELD.action) &&
      _.has(dataContentChange, FIELD.productName) &&
      type === SpecialHistory.productSet
    ) {
      return true;
    }
    return false;
  };

  const parseContentChange = dataContentChange => {
    const contentChange = [];

    if (checkIsSpecialHistory(dataContentChange, SpecialHistory.productSet)) {
      contentChange.push({
        key: getKeySpecial(dataContentChange, { productName: FIELD.productName }).title,
        value: dataContentChange
      });
    } else {
      _.keys(dataContentChange).forEach(key => {
        const newElement = {
          key: null,
          value: null
        };

        newElement.key = key;
        newElement.value = dataContentChange[key];
        contentChange.push(newElement);
      });
    }

    return contentChange;
  };

  const getContentChange = dataContentChange => {
    const contentChange = jsonParse(dataContentChange);
    let resultParseContentChange = [];

    if (contentChange) {
      if (_.isArray(contentChange) && !_.compact(contentChange).length)
        return resultParseContentChange;
      if (_.isArray(contentChange) && _.compact(contentChange).length) {
        contentChange.forEach(el => {
          resultParseContentChange = resultParseContentChange.concat(parseContentChange(el));
        });
      } else {
        resultParseContentChange = parseContentChange(contentChange);
      }
    }

    return resultParseContentChange;
  };

  const renderDataExtension = contentChange => {
    // if (contentChange){
    //   const dataOld = jsonParse(contentChange.old);
    //   const dataNew = jsonParse(contentChange.new);
    //   const dataExtensions = [];

    //   for (const field in dataNew) {
    //     if(_.has(dataNew, field)){
    //       dataExtensions.push({key: field, new: dataNew[field] ? dataNew[field] : '', old: dataOld[field] ? dataOld[field] : ''})
    //     }
    //   }

    //   return(
    //     dataExtensions.map(dataExtension => {
    //       if(_.toString(dataExtension.old) !== _.toString(dataExtension.new)){
    //         if(!_.isArray(dataExtension.old)){
    //           return(
    //             <>
    //               {renderDefaultData(dataExtension.key, dataExtension.old, dataExtension.new)}
    //             </>
    //           )
    //         } else{
    //           return(
    //             <>
    //               <div>{getFieldLabeByLanguage(dataExtension.key)}:</div>
    //               {
    //                 dataExtension.old && _.isArray(dataExtension.old) && dataExtension.old.map((item, index) =>
    //                   <>
    //                     {dataExtension.old[index] !== dataExtension.new[index] &&
    //                       renderDefaultData(dataExtension.key, dataExtension.old[index], dataExtension.new[index])
    //                     }
    //                   </>
    //                 )
    //               }
    //             </>
    //           )
    //         }
    //       } else{
    //         return <></>
    //       }
    //     })
    //   )
    // }

    return <></>;
  };

  const renderImage = contentChange => {
    if (
      contentChange.value &&
      contentChange.value[FIELD.fileName] &&
      contentChange.value[FIELD.filePath]
    ) {
      if (checkFirstImage) {
        checkFirstImage = false;
        return (
          <div className="mission-wrap" >
          <div className="type-mission">
            {getFieldLabeByLanguage(contentChange.key, props.fieldInfo)}:
            <div  className="image-history">
              {/* <Img src={contentChange.value.file_path.old} alt="" title="" /> */}
              {renderEmptyData(contentChange.value[FIELD.fileName].old)}
            </div>
            <ArrowChange />
            <div  className="image-history">
              {/* <Img src={contentChange.value.file_path.new} alt="" title="" /> */}
              {renderEmptyData(contentChange.value[FIELD.fileName].new)}
            </div>
          </div>
          </div>
        );
      } else {
        return (
          <DefaultData
            title={contentChange.key}
            oldValue={contentChange.value[FIELD.fileName].old}
            newValue={contentChange.value[FIELD.fileName].new}
            fieldInfo={props.fieldInfo}
            sourceData={props.sourceData}
          />
        );
      }
    }
  };

  const renderContent = contentChange => {
    if (checkIsSpecialHistory(contentChange.value, SpecialHistory.productSet)) {
      let isRender = false;
      const renderSpecialHistory =  (
        <div className="mission-wrap">
          <p className="type-mission">
            {contentChange.key}
          </p>
            {_.keys(contentChange.value).map((key, index) => {
              if (!_.isObject(contentChange.value[key])) return <></>;
              if (key === FIELD.productSetData) {
                return <>{renderDataExtension(contentChange.value[key])}</>;
              }
              isRender = true
              return (
                <DefaultData
                  key={index}
                  title={key}
                  oldValue={contentChange.value[key].old}
                  newValue={contentChange.value[key].new}
                  fieldInfo={props.fieldInfo}
                  sourceData={props.sourceData}
                />
              );
            })}
         
        </div>
      );

      return isRender ? renderSpecialHistory : <></>

    } else {
      return (
        <DefaultData
          title={contentChange.key}
          oldValue={contentChange.value.old}
          newValue={contentChange.value.new}
          fieldInfo={props.fieldInfo}
          sourceData={props.sourceData}
        />
      );
    }
  };

  const renderInformationChange = contentChange => {
    const keyString = _.toString(contentChange.key);

    if (keyString === props.fieldNameExtension) {
      return <>{renderDataExtension(contentChange.value)}</>;
    } else if (contentChange.key === FIELD.productImageName) {
      return <>{renderImage(contentChange)}</>;
    } else {
      return <>{renderContent(contentChange)}</>;
    }
  };

  const renderReasonEdit = reasonEdit => {
    if(!reasonEdit) return <></>
    if (props.type === SpecialHistory.productSet) {
      return (
        <p className="type-mission">{`${translate(
          'products.detail.label.title.reasonEdit'
        )}:  ${reasonEdit}`}</p>
      );
    }
  };

  return (
    <div className="tab-content">
      <div className="tab-pane active">
        <div className="time-line">
          {props.changeHistory.map((history, index) => {
            const contentChanges = getContentChange(history.contentChange);
         
            return (
              <React.Fragment key={index}>
                <div className="title">
                  {contentChanges && contentChanges.length
                    ? translate('products.detail.label.title.update')
                    : translate('products.detail.label.title.create')}
                </div>
                {contentChanges.map(contentChange => {
                  return <>{renderInformationChange(contentChange)}</>;
                })}
                {renderReasonEdit(history.reasonEdit)}
                <div className="item item2">
                  <EmployeeName
                    userName={history.createdUserName}
                    userImage={history.createdUserImage}
                    employeeId={history.createdUserId}
                    sizeAvatar={30}
                  />
                  <span className="date w-auto pl-2">{utcToTz(history.createdDate, DATE_TIME_FORMAT.User)}</span>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default TabChangeHistory;
