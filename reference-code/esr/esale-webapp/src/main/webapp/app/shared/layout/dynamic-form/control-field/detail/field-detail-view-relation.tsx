import React, { forwardRef, useState, useImperativeHandle, useMemo, createRef} from 'react'
import { FIELD_BELONG, ControlType } from 'app/config/constants';
import _ from 'lodash';
import { useId } from "react-id-generator";
import { DEFINE_FIELD_TYPE } from '../../constants';
import { getFieldLabel, jsonParse } from 'app/shared/util/string-utils';
import { formatDate, utcToTz, timeUtcToTz, DATE_TIME_FORMAT } from 'app/shared/util/date-utils';
import FieldDetailViewSelectOrg from './field-detail-view-select-org'
import PopupEmployeeDetail from 'app/modules/employees/popup-detail/popup-employee-detail';
import ProductDetail from 'app/modules/products/product-detail/product-detail';
import DetailTaskModal from 'app/modules/tasks/detail/detail-task-modal';
import ActivityDetail from 'app/modules/activity/detail/activity-modal-detail';
import PopupCustomerDetail from 'app/modules/customers/popup-detail/popup-customer-detail';
import BusinessCardDetail from "app/modules/businessCards/business-card-detail/business-card-detail";
import { Link } from 'react-router-dom';
import { getLinkListModule } from 'app/modules/modulo-bridge';
export interface IFieldDetailViewRelationProps {
  id: string,
  viewInList: boolean,
  fieldBelong: number,
  recordIds: number[],
  serviceFieldBelong?: number, // service belong
  displayFieldId?: number, // only for display list
  relationData?: any       // only for display list
}

const FieldDetailViewRelation = forwardRef((props: IFieldDetailViewRelationProps, ref) => {
  const [openTargetDetail, setOpenTargetDetail] = useState(false);
  const [selectRecordId, setSelectRecordId] = useState(null);
  const employeeDetailCtrlId = useId(1, "viewRelationEmployeeDetail_")
  const customerDetailCtrlId = useId(1, "viewRelationCustomerDetailCtrlId_");

  const elementsRef = useMemo(() => Array.from({ length: props.recordIds.length }).map(() => createRef<any>()), [props.recordIds]);

  useImperativeHandle(ref, () => ({
    getTextHover() {
      if (elementsRef && elementsRef.length > 0) {
        const tmp = [];
        elementsRef.forEach((e, idx) => {
          if (e && e.current && e.current.innerText) {
            tmp.push(e.current.innerText)
          }
        })
        if (tmp.length > 0) {
          return tmp.join(",");
        }
      }
      return "";
    },
  }));

  const handleClickRelation = (recordId: number) => {
    setSelectRecordId(recordId);
    setOpenTargetDetail(true);
  }

  const handleCloseRecordDetail = (recordId: number) => {
    setSelectRecordId(null);
    setOpenTargetDetail(false);
  }

  const renderContentDisplay = (recordId, fieldInfo, valueDisplay) => {
    const fieldType = _.toString(_.get(fieldInfo, 'fieldType'));
    if (fieldType ===  DEFINE_FIELD_TYPE.SELECT_ORGANIZATION) {
     return <FieldDetailViewSelectOrg 
                fieldInfo={fieldInfo}
                controlType={ControlType.DETAIL_EDIT}
                ogranizationValues={valueDisplay}
                recordId={recordId}
              />
    }
    return <>{valueDisplay}</>
  }

  const renderRecordWithLink = (key, recordId, valueDisplay, fieldInfo, indexRef) => {
    if (!valueDisplay || _.isNil(valueDisplay) || (_.isString(valueDisplay) && _.isEmpty(valueDisplay))) {
      return <></>
    }
    if (props.fieldBelong === FIELD_BELONG.PRODUCT_TRADING) {
      return <span ref={elementsRef[indexRef]} key={key}>{valueDisplay}</span>
    }
    if (!props.viewInList && props.fieldBelong === props.serviceFieldBelong) {
      return (
        <>
        <Link key={recordId} to={{ pathname: getLinkListModule(props.fieldBelong), state: { openDetail: true, recordId}}}>
          <span ref={elementsRef[indexRef]}>{valueDisplay}</span>
        </Link>
        </>
      )
    }
    return (
      <>
        {props.fieldBelong !== FIELD_BELONG.PRODUCT_TRADING &&
        <a key={key} ref={elementsRef[indexRef]} className="text-blue" onClick={(e) => handleClickRelation(recordId)}>
          {renderContentDisplay(recordId, fieldInfo, valueDisplay)}
        </a>
        }
      </>)
  }
  
  const renderRelationAsLinkDetail = () => {
    if (!props.recordIds || props.recordIds.length < 1) {
      return <></>
    }
    return (
      props.recordIds.map((value, idx) => {
        return (<>{renderRecordWithLink(idx, value, value, null, idx)}{idx < props.recordIds.length - 1 && <>{","}</>}</>)
      })
    )
  }

  const renderRelationAsLinkList = () => {
    const linksRelation = [];
    for (let i = 0; i < props.recordIds.length; i++) {
      const idx = props.relationData.records.findIndex(e => e.recordId === props.recordIds[i]);
      if (idx < 0) {
        continue;
      }
      if (!props.relationData.records[idx].dataInfos || _.isNil(_.find(props.relationData.records[idx].dataInfos, { fieldId: props.displayFieldId }))) {
        continue;
      }
      const field = _.find(props.relationData.records[idx].dataInfos, { fieldId: props.displayFieldId });
      let valueDisplay = _.get(field, 'value');
      const fType = _.toString(_.get(field, 'fieldType'));
      if (fType === DEFINE_FIELD_TYPE.CHECKBOX ||  fType === DEFINE_FIELD_TYPE.RADIOBOX ||
          fType === DEFINE_FIELD_TYPE.SINGER_SELECTBOX || fType === DEFINE_FIELD_TYPE.MULTI_SELECTBOX) {
        const items = [];
        const itemIds = [];
        try {
          if (_.isString(valueDisplay)) {
            const tmp = JSON.parse(valueDisplay);
            if (_.isArray(tmp)) {
              itemIds.push(...tmp);
            } else {
              itemIds.push(tmp);
            }
          } else if (_.isArray(valueDisplay)) {
            itemIds.push(...valueDisplay);
          } else {
            itemIds.push(valueDisplay);
          }
        } catch (ex) {
          itemIds.push(valueDisplay);
        }
        itemIds.forEach(e => {
          if (props.relationData.fieldItems) {
            const idxItem = props.relationData.fieldItems.findIndex(item => _.toString(item.itemId) === _.toString(e))
            if (idxItem >= 0) {
              items.push(getFieldLabel(props.relationData.fieldItems[idxItem], 'itemLabel'));
            } else {
              items.push(e);
            }
          } else {
            items.push(e);
          }
        });
        valueDisplay = items.join(" ");
      } else if (fType === DEFINE_FIELD_TYPE.DATE){
        valueDisplay = formatDate(valueDisplay);
      } else if (fType === DEFINE_FIELD_TYPE.DATE_TIME){
        valueDisplay = utcToTz(valueDisplay, DATE_TIME_FORMAT.User);
      } else if (fType === DEFINE_FIELD_TYPE.TIME){
        valueDisplay = timeUtcToTz(valueDisplay);
      } else if (fType === DEFINE_FIELD_TYPE.CALCULATION || fType === DEFINE_FIELD_TYPE.NUMERIC) {
        if (_.isNil(valueDisplay) || !/^-?\d+\.?\d*$/.test(_.toString(valueDisplay))) {
          valueDisplay = '';
        } else {
          const decimalPlace = _.get(field, 'decimalPlace');
          valueDisplay = Number(valueDisplay).toFixed(decimalPlace < 0 ? 0 : decimalPlace);
        }
      } else if (fType === DEFINE_FIELD_TYPE.ADDRESS){
        valueDisplay = jsonParse(valueDisplay);
        if(valueDisplay){
          valueDisplay = valueDisplay["address"];
        }
      }
      if (!valueDisplay || _.isNil(valueDisplay) || (_.isString(valueDisplay) && _.isEmpty(valueDisplay))) {
        continue
      }
      linksRelation.push(
        <> 
          {linksRelation.length > 0 && <>{","}</>}
          {renderRecordWithLink(idx, props.relationData.records[idx].recordId, valueDisplay, field, idx)}
        </>
      )
    }
    return <>{linksRelation}</>
  }

  const renderTargetDetail = () => {
    if(!openTargetDetail) {
      return <></>
    }
    if (props.fieldBelong === FIELD_BELONG.EMPLOYEE) {
      return (
        <PopupEmployeeDetail
          id={employeeDetailCtrlId[0]}
          key={props.id}
          showModal={true}
          backdrop={props.viewInList}
          openFromModal={true}
          employeeId={selectRecordId}
          listEmployeeId={[selectRecordId]}
          toggleClosePopupEmployeeDetail={() => handleCloseRecordDetail(selectRecordId)}
          resetSuccessMessage={() => {}} 
        />
      )
    } else if (props.fieldBelong === FIELD_BELONG.PRODUCT) {
      return (
        <ProductDetail
          key={props.id}
          showModal={true}
          backdrop={props.viewInList}
          productId={selectRecordId}
          // listProductId={[selectRecordId]}
          toggleClosePopupProductDetail={() => handleCloseRecordDetail(selectRecordId)}
          isList={props.viewInList}
          openFromModal={true}
      />)
    } else if (props.fieldBelong === FIELD_BELONG.TASK) {
      return (
        <DetailTaskModal
          key={props.id}
          iconFunction="ic-task-brown.svg"
          taskId={selectRecordId}
          toggleCloseModalTaskDetail={() => handleCloseRecordDetail(selectRecordId)}
          listTask={[selectRecordId]}
          canBack={true}
          openFromModal={true}
          onClickDetailMilestone={() => {}}
          onOpenModalSubTaskDetail={() => {}} />
      )
    } else if (props.fieldBelong === FIELD_BELONG.CUSTOMER) {
      return (
        <PopupCustomerDetail
            id={customerDetailCtrlId[0]}
            key={props.id}
            showModal={true}
            customerId={selectRecordId}
            listCustomerId={[]}
            toggleClosePopupCustomerDetail={() => handleCloseRecordDetail(selectRecordId)}
            canBack={true}
          />
      )
    } else if (props.fieldBelong === FIELD_BELONG.ACTIVITY) {
      return (
        <ActivityDetail popout={false}
          key={props.id}
          activityId={selectRecordId}
          listActivityId={[]}
          onCloseActivityDetailRelation={() => handleCloseRecordDetail(selectRecordId)} 
          classRelation="h-auto mb-2"
          canBack={true}
        />
      )
    } else if (props.fieldBelong === FIELD_BELONG.BUSINESS_CARD) {
      return (
        <BusinessCardDetail
            key={props.id}
            backdrop={props.viewInList}
            showModal={true}
            businessCardId={selectRecordId}
            listBusinessCardId={[]}
            businessCardList={[]}
            toggleClosePopupBusinessCardDetail={() => handleCloseRecordDetail(selectRecordId)}
            isList={props.viewInList}
            openFromModal={true}
          />
      )
    } else {
      return <></> // TODO other service
    }
  }
  return (
    <>
    {props.viewInList && renderRelationAsLinkList()}
    {!props.viewInList && renderRelationAsLinkDetail()}
    {renderTargetDetail()}
    </>
  )
});

export default FieldDetailViewRelation

// import React, { forwardRef, useRef, useState, useEffect } from 'react'
// import { IDynamicFieldProps } from '../interface/dynamic-field-props';
// import { translate } from 'react-jhipster';
// import { DEFINE_FIELD_TYPE, DynamicControlAction, SERVICE_TYPE } from '../../constants'
// import _ from 'lodash';
// import ConfirmDialog from 'app/shared/layout/dialog/confirm-dialog';

// import {
//   getServicesInfo,
//   getFieldsInfoService,
//   reset,
// } from 'app/shared/reducers/dynamic-field.reducer';
// import { Options, connect } from 'react-redux';
// import { IRootState } from 'app/shared/reducers';
// import StringUtils, { getFieldLabel } from 'app/shared/util/string-utils';
// import { getValueProp } from 'app/shared/util/entity-utils';

// interface IFieldDetailViewRelationDispatchProps {
//   getServicesInfo,
//   getFieldsInfoService,
//   reset,
// }

// interface IFieldDetailViewRelationStateProps {
//   errorMessage: string;
//   fieldInfoService: any[];
//   serviceInfo: any[];
// }

// type IFieldDetailViewRelationProps = IFieldDetailViewRelationDispatchProps & IFieldDetailViewRelationStateProps & IDynamicFieldProps


// const FieldDetailViewRelation: React.FC<IFieldDetailViewRelationProps> = forwardRef((props, ref) => {
//   const [listAllField, setListAllField] = useState([]);
//   const [fieldRelation, setFieldRelation] = useState([])
//   const [listBelong, setListBelong] = useState([]);
//   const [currentFieldTab, setCurrentFieldTab] = useState(null);
//   const [hoverField, setHoverField] = useState(null);
//   const [hovered, setHovered] = useState(false);

//   const id = `${props.belong}_${props.id}`;

//   const isFieldInfoRelationTab = (field) => {
//     if (_.toString(field.fieldType) === DEFINE_FIELD_TYPE.RELATION) {
//       if (field.relationData && field.relationData.displayTab === 1) {
//         return true;
//       }
//     }
//     return false;
//   }

//   useEffect(() => {
//     if (props.listFieldInfo && props.listFieldInfo.length) {
//       setFieldRelation(props.listFieldInfo.filter(e => isFieldInfoRelationTab(e)));
//     }
//   }, [props.listFieldInfo])

//   useEffect(() => {
//     if (!fieldRelation || fieldRelation.length < 1) {
//       return;
//     }
//     const tmp = [props.belong]
//     fieldRelation.forEach(e => {
//      if (tmp.findIndex(o => o === e.relationData.fieldBelong) < 0) {
//        tmp.push(e.relationData.fieldBelong);
//      }
//     })
//     if (fieldRelation.length > 0 && _.isNil(currentFieldTab)) {
//       setCurrentFieldTab(_.cloneDeep(fieldRelation[0]))
//     }
//     setListBelong(tmp)
//   }, [fieldRelation])

//   useEffect(() => {
//     listBelong.forEach( e => {
//       props.getFieldsInfoService(id, e, null, null)
//     })
//   }, [listBelong])

//   useEffect(() => {
//     if (props.fieldInfoService) {
//       props.fieldInfoService.forEach( e => {
//         const idx = listAllField.findIndex(o => e.fieldId === o.fieldId);
//         if (idx < 0) {
//           listAllField.push(e);
//         }
//       });
//       setListAllField(_.cloneDeep(listAllField));
//     }
//   }, [props.fieldInfoService])

//   useEffect(() => {
//     props.getServicesInfo(id, SERVICE_TYPE.HAVE_DYNAMIC_DATA);
//     return () => {
//       props.reset(id);
//     }
//   },[])

//   const getTabLabel = (field) => {
//     const title = getFieldLabel(field, 'fieldLabel')
//     let relationTitle = ""
//     if (props.serviceInfo && props.serviceInfo.length > 0) {
//       const idx = props.serviceInfo.findIndex( e => e.serviceId === field.fieldBelong)
//       if (idx >= 0) {
//         relationTitle = getFieldLabel(props.serviceInfo[idx], 'serviceName');      }
//     }

//     return <>{`${relationTitle} (${title})`}</>
//   }

//   const onChangeTab = (tab) => {
//     setCurrentFieldTab(_.cloneDeep(tab))
//   }

//   const headerHoverOn = (item) => {
//     if (props.isDisabled) {
//       setHovered(false);
//       return
//     }
//     setHoverField(item)
//     setHovered(true);
//   }

//   const headerHoverOff = (item) => {
//     setHovered(false);
//   }
//   const editFieldTab = (tab) => {
//     if (props.onExecuteAction) {
//       props.onExecuteAction(tab, DynamicControlAction.EDIT)
//     }
//   }

//   const showConfirmDelete = async () => {
//     const itemName = getFieldLabel(props.fieldInfo, 'fieldLabel');
//     const result = await ConfirmDialog({
//       title: (<>{translate('employees.detail.title.popupErrorMessage.delete')}</>),
//       message: translate('messages.WAR_COM_0001', { itemName }),
//       confirmText: translate('employees.detail.title.popupErrorMessage.delete'),
//       confirmClass: "button-red",
//       cancelText: translate('employees.detail.label.button.cancel'),
//       cancelClass: "button-cancel"
//     });
//     return result;
//   }

//   const executeDelete = async (action: () => void, cancel?: () => void) => {
//     const result = await showConfirmDelete();
//     if (result) {
//       action();
//     } else if (cancel) {
//       cancel();
//     }
//   }

//   const deleteFieldTab = (tab) => {
//     // props.onDeleteFields(hoverField);
//     if (props.onExecuteAction) {
//       executeDelete(() => {
//         props.onExecuteAction(tab, DynamicControlAction.DELETE);
//       });
//     }
//   }

//   const renderTabRelation = () => {
//     return (
//       <ul className="nav nav-tabs mb-0">
//         {fieldRelation.map((tab, idx) => {      
//             return (
//               <li key={idx} className="nav-item"
//                 onMouseEnter={() => { headerHoverOn(tab) }}
//                 onMouseLeave={() => { headerHoverOff(tab) }}
//               >
//                 <a onClick={() => onChangeTab(tab)} className={`nav-link delete edit ${_.get(currentFieldTab, 'fieldId') === tab.fieldId ? 'active':''}`} data-toggle="tab">{getTabLabel(tab)}</a>
//                 {hovered && hoverField.fieldId === tab.fieldId && <a onClick={() => editFieldTab(tab)} className="icon-small-primary icon-edit-small"></a>}
//                 {hovered && hoverField.fieldId === tab.fieldId && !tab.isDefault && <a onClick={() => deleteFieldTab(tab)} className="icon-small-primary icon-erase-small"></a>}
//               </li>
//             )
//           })
//         }
//       </ul>
//     )
//   }

//   const getValueFieldFromRecord = (field, record) => {
//     let value = null;
//     if(field.isDefault) {
//       for(const p in record) {
//         if (Object.prototype.hasOwnProperty.call(record, p) && StringUtils.equalPropertyName(p, field.fieldName)) {
//           value = getValueProp(record, p)
//         }
//       }
//     } else {
//       for(const prop in record) {
//         if (Object.prototype.hasOwnProperty.call(record, prop)) {
//           if (_.isArray(record[prop])) {
//             record[prop].forEach((e, idx) => {
//               if (StringUtils.equalPropertyName(_.get(e, 'key'), field.fieldName)) {
//                 value = _.get(e, 'value')
//               }
//             });
//           } else {
//             for(const p in record[prop]) {
//               if (Object.prototype.hasOwnProperty.call(record[prop], p) && StringUtils.equalPropertyName(p, field.fieldName)) {
//                 value = getValueProp(record[prop], p)
//               }
//             }
//           }
//         }
//       }
//     }
//     return value;
//   }

//   const renderFieldInTab = () => {
//     const value = props.elementStatus.fieldValue;
//     if (!value) {
//       return <></>
//     }
//     // let relationData = getValueFieldFromRecord(value, currentFieldTab);
//     let relationData  = null
//     currentFieldTab.relationData.displayFields.map((fieldId) => {
//       // TODO
//     })

//     if (!_.isArray(relationData)) {
//       if (_.isString(relationData)) {
//         try {
//           relationData = JSON.parse(relationData);
//         } catch {
//           relationData = [relationData];  
//         }
//       } else {
//         relationData = [relationData];
//       }
//     }
//   }

//   const renderContentTab = () => {
//     if (_.isNil(currentFieldTab)) {
//       return <></>
//     }
//     const fieldIds =  currentFieldTab.relationData.displayFields;
//     const listField = listAllField.filter( e => fieldIds.findIndex(o => o === e.fieldId) >= 0)

//     return (
//       <>
//         <table className="table-default">
//           <thead>
//             <tr>
//               {listField.map((e) => <th key={e.fieldId} className="title-table">{getFieldLabel(e, 'fieldLabel')}</th>)}
//             </tr>
//           </thead>
//           <tbody>
//             {renderFieldInTab()}
//           </tbody>
//         </table>
//       </>
//     );
//   }

//   if (!fieldRelation || fieldRelation.length < 1) {
//     return <></>
//   }
//   return (
//   <>
//     {renderTabRelation()}
//     {renderContentTab()}
//   </>)
// });

// const mapStateToProps = ({ dynamicField }: IRootState, ownProps: IDynamicFieldProps) => {
//   const defaultValue = {
//     errorMessage: null,
//     fieldInfoService: null,
//     serviceInfo: null,
//   }
//   const id = `${ownProps.belong}_${ownProps.id}`;
//   if (dynamicField && dynamicField.data.has(id)) {
//     defaultValue.errorMessage = dynamicField.data.get(id).errorMessage
//     defaultValue.fieldInfoService = dynamicField.data.get(id).fieldInfoService
//     defaultValue.serviceInfo = dynamicField.data.get(id).serviceInfo
//   }
//   return defaultValue;
// };

// const mapDispatchToProps = {
//   getServicesInfo,
//   getFieldsInfoService,
//   reset,
// };

// const options = {forwardRef: true};

// export default connect<IFieldDetailViewRelationStateProps, IFieldDetailViewRelationDispatchProps, IDynamicFieldProps>(
//   mapStateToProps,
//   mapDispatchToProps,
//   null,
//   options as Options
// )(FieldDetailViewRelation);


