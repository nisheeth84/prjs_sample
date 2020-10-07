import _ from 'lodash';

import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { translate } from 'react-jhipster';
import TabSummaryElement from './product-detail-tab-summary-element';
import { ScreenMode, ControlType } from 'app/config/constants';
import { TAB_ID_LIST, CURRENCY, PRODUCT_SPECIAL_FIELD_NAMES } from '../../constants';
import TabChangeHistory from 'app/shared/layout/common/history/display-history';
import { isJsonString, getCurrencyUnit } from '../../utils';
import { SettingModes } from '../../../../shared/layout/dynamic-form/control-field/dynamic-select-field';
import { DEFINE_FIELD_TYPE, DynamicControlAction } from 'app/shared/layout/dynamic-form/constants';
import TabTradingProducts from './product-detail-tab-trading-products';
import TabDisplaySetting from 'app/shared/layout/common/tab-display-setting';
import FieldDisplayRow, { FieldDisplayRowDragLayer } from 'app/shared/layout/dynamic-form/control-field/view/field-display-row';
import { sortOrderFields, buildDoubleColumn, processDragDropFields, processDeleteFields, processDragNewField, getMaxItemShowInList } from 'app/shared/util/utils';
import { getFieldLabel } from 'app/shared/util/string-utils';
import EmployeeName from 'app/shared/layout/common/EmployeeName';

export interface IPopupTabSummary {
  iconFunction?: string,
  showModal?: boolean;
  product: any;
  productAllFields?: any;
  screenMode: any;
  conditionSearch?: any[],
  editedFields?: any[];
  handleReorderField: (dragIndex, dropIndex) => void;
  onChangeFields?: (fields: any[], deletedFields: any[], editFields: any[]) => void;
  openDynamicSelectFields: (settingMode, fieldEdit) => void;
  destroySaveField?: () => void;
  isSaveField?: boolean;
  summaryFields?: any;
  paramsEdit: any;
  fieldEdit: any;
  tabList?: any;
  onShowMessage?: (message, type) => void;
  onSaveField?: (fields, params, fieldEdit) => { listField, deleteFields };
  openModalEmployeeDetail: (paramEmployeeId) => void;
  openProductDetailFromOther?: (id, isProductSet) => void;
  productId?: any;
  countSave?: any;
  tradingProducts?: any;
  tradingProductsFields?: any;
  onSelectDislaySummary?: any;
  deletedFields?: any[];
  edittingField: any;
  fieldsUnavailable: any[];
}

const TabSummary = forwardRef((props: IPopupTabSummary, ref) => {
  const [fields, setFields] = useState([]);
  const [deletedFields, setDeleteFields] = useState([]);
  const [listFieldNormal, setListFieldNormal] = useState([]);
  const [listFieldTab, setListFieldTab] = useState([]);
  const [listFieldIdEdited, setListFieldIdEdited] = useState([]);
  const [fieldsUnavailable, setFieldsUnavailable] = useState([]);

  const fieldTabRef = useRef(null)

  /* _________________Optional_________________ */
  const getFieldInfoByProductType = (product, fieldInfo) => {
    const fieldInfoUse = [];

    if (product && product.productTypes && product.productTypes.length) {
      const curentProductType = product.productTypes.find(productType =>
        productType.productTypeId === product.product.productTypeId
      );

      if (curentProductType && isJsonString(curentProductType.fieldUse)) {
        const fieldUse = JSON.parse(curentProductType.fieldUse);
        for (const key in fieldUse) {
          if (Object.prototype.hasOwnProperty.call(fieldUse, key)) {
            fieldInfo.forEach(el => {
              if (el.fieldId === Number(key) && fieldUse[key] === 1) {
                fieldInfoUse.push(el);
              }
            })
          }
        }
      }
    }
    return fieldInfoUse;
  }

  const deepEqual = (x?: object | null, y?: object | null, ignoreRootProps?: Set<string>) => {
    if (x == null || y == null) {
      return x === y
    }
    const keys = Object.keys(x)
    if (!_.isEqual(Object.keys(x).sort(), Object.keys(y).sort())) {
      return false
    }
  
    for (const key of keys) {
      if (ignoreRootProps && ignoreRootProps.has(key)) {
        continue
      }
      if (key === 'fieldLabel' || key === 'itemLabel') {
        if (_.isNil(x[key]) && _.isNil(y[key])) {
          continue;
        }
        if (_.isNil(x[key]) || _.isNil(y[key])) {
          return false
        }
        let obj1 = "";
        let obj2 = "";
        try {
          obj1 = _.isString(x[key]) ? JSON.parse(x[key]) : x[key]
          obj2 = _.isString(y[key]) ? JSON.parse(y[key]) : y[key]
        } catch (e) {
          obj1 = x[key]
          obj2 = y[key]
        }
        if (!_.isEqual(obj1, obj2)) {
          return false
        }
      } else {
        if (_.isObject(x[key])) {
          const result = deepEqual(x[key], y[key])
          if (!result) {
            return false
          } else {
            continue;
          }
        } else if (!_.isEqual(x[key], y[key])) {
          return false
        }
      }
    }
    return true
  }

  const onDeleteFields = (fieldInfo) => {
    const fieldsAfterDelete = _.cloneDeep(fields);
    processDeleteFields(fieldsAfterDelete, fieldInfo, deletedFields);
    const objParams = sortOrderFields(fieldsAfterDelete, props.productAllFields)
    setFields(objParams);
    const idx = listFieldIdEdited.findIndex( e => e.fieldId === props.fieldEdit.fieldId)
    if (idx >= 0) {
      listFieldIdEdited.splice(idx, 1);
    }
    props.onChangeFields(objParams, deletedFields, listFieldIdEdited);
  }

  const setValueFields = dataFieldInfo => {
    let fieldInfo = _.cloneDeep(dataFieldInfo);

    fieldInfo = fieldInfo.filter(field => {
      return field.fieldName !== PRODUCT_SPECIAL_FIELD_NAMES.productsSets;
    })
    
    if(fieldInfo){
      if(props.product && props.product.product && props.product.product.productTypeId && props.screenMode !== ScreenMode.EDIT){
        fieldInfo = getFieldInfoByProductType(props.product, fieldInfo);
      }
    }
    return fieldInfo;
  }

  const isFieldDisplayNormal = (field) => {
    if (field.fieldType.toString() === DEFINE_FIELD_TYPE.TAB) {
      return false;
    }
    // if (field.fieldType.toString() === DEFINE_FIELD_TYPE.RELATION && field.relationData) {
    //   if (field.relationData.displayTab === 1) {
    //     return false;
    //   }
    // }
    return true;
  }

  const onExecuteAction = (fieldInfoExe, actionType) => {
    if (actionType === DynamicControlAction.DELETE) {
      if (onDeleteFields) {
        onDeleteFields(fieldInfoExe)
      }
    } else if (actionType === DynamicControlAction.EDIT) {
      if (props.openDynamicSelectFields) {
        props.openDynamicSelectFields(SettingModes.EditInput, fieldInfoExe)
      }
    }
  }

  const openProductSetDetail = (productId) => {
    props.openProductDetailFromOther(productId, true);
  }

  /* _________________Drag Drop_________________ */
  const getSplitRecord = (mode: number) => {
    const records = [];
    if (mode === 0) {
      records.push(...listFieldNormal);
    } else if (mode < 0) {
      if (listFieldTab.length === 0) {
        return records;
      }
      records.push(...listFieldNormal.filter(e => e.fieldOrder < listFieldTab[0].fieldOrder))
    } else {
      if (listFieldTab.length === 0) {
        return records;
      }
      records.push(...listFieldNormal.filter(e => e.fieldOrder > listFieldTab[listFieldTab.length - 1].fieldOrder));
    }
    return buildDoubleColumn(records, props.screenMode);
  }

  const onDragOrderField = (dragFieldId, dropFieldId, isDoubleColumn: boolean, isAddLeft: boolean) => {
    processDragDropFields(fields, dragFieldId, dropFieldId, isDoubleColumn, isAddLeft, fieldTabRef, props.screenMode, props.countSave, listFieldIdEdited);
    const objParam = sortOrderFields(fields, props.productAllFields);
    setFields(objParam);
    props.onChangeFields(objParam, deletedFields, listFieldIdEdited);
  }

  const onDropNewField = (dragItem, dropId, isDoubleColumn: boolean, isAddLeft: boolean) => {
    const fieldDrag = _.cloneDeep(dragItem);
    processDragNewField(fields, fieldDrag, dropId, isDoubleColumn, isAddLeft, fieldTabRef, props.screenMode, props.countSave, fieldsUnavailable);

    listFieldIdEdited.push(fieldDrag.fieldId);
    const objParams = sortOrderFields(fields, props.productAllFields)
    setFields(objParams);
    props.onChangeFields(objParams, deletedFields, listFieldIdEdited); 
    props.openDynamicSelectFields(SettingModes.EditInput, fieldDrag);
  }

  useImperativeHandle(ref, () => ({
    onAddNewField(field) {
      onDropNewField(field, fields[fields.length - 1].fieldId, false, false);
    }
  }));

  /* _________________Lifecycle_________________ */
  useEffect(() => {
    if (props.fieldsUnavailable) {
      setFieldsUnavailable(props.fieldsUnavailable)
    }
  }, [props.fieldsUnavailable])

  useEffect(() => {
    if(!props.summaryFields) {
      props.onChangeFields(_.cloneDeep(props.product.fieldInfo), [], []);
    } else {
      setListFieldIdEdited(props.editedFields)
    }
  }, []);

  useEffect(() => {
    if (props.editedFields) {
      setListFieldIdEdited(props.editedFields)
    }
  }, [props.editedFields])

  useEffect(() => {
    setDeleteFields(props.deletedFields)
  }, [props.deletedFields])

  useEffect(() => {
    fields.forEach((field) => {
      if (!_.isNil(field.tabData) && field.tabData.length > 0) {
        field.tabData.forEach((fieldInTab) => {
          fields.forEach((item) => {
            if (item.fieldId === fieldInTab) {
              if (!_.isNil(item.inTab)) {
                item.inTab = true
              } else {
                Object.assign(item, { inTab: true });
              }
            } else {
              if (_.isNil(item.inTab)) {
                Object.assign(item, { inTab: false });
              }
            }
          })
        })
      }
    })
  }, [fields])

  useEffect(() => {
		if (_.isNil(fields)) {
			return;
		}
		const fieldTabs = fields.filter(e => _.toString(e.fieldType) === DEFINE_FIELD_TYPE.TAB)
    const fieldNormals = fields.filter(e => isFieldDisplayNormal(e));

		fieldTabs.forEach((field) => {
			if (!_.isNil(field.tabData) && field.tabData.length > 0) {
				field.tabData.forEach(e => {
					const idx = fieldNormals.findIndex(o => o.fieldId === e)
					if (idx >= 0) {
						fieldNormals.splice(idx, 1)
					}
				})
			}
		})
		setListFieldTab(fieldTabs);
    setListFieldNormal(fieldNormals)
  }, [fields])

  const isFieldCanDisplay = (field) => {
    if (_.toString(field.fieldType) !== DEFINE_FIELD_TYPE.RELATION) {
      return true;
    }
    if (_.isNil(field.relationData) || field.relationData.asSelf !== 1) {
      return true
    }
    return false;
  }

  useEffect(() => {
    const listField = sortOrderFields(props.summaryFields ? props.summaryFields : _.cloneDeep(props.product.fieldInfo), props.productAllFields);
    setFields(listField.filter( e => isFieldCanDisplay(e)))
  }, [props.summaryFields])

  useEffect(() => {
    if (props.product) {
      let listField = null
      if (props.screenMode === ScreenMode.EDIT) {
        listField = props.summaryFields ?
          props.summaryFields.sort((a, b) => { return (a.fieldOrder - b.fieldOrder) }) :
          _.cloneDeep(props.product.fieldInfo);
      } else {
        listField = _.cloneDeep(props.product.fieldInfo);
        setListFieldIdEdited([]);
      }
      const tmp = []
      if (!_.isNil(listField)) {
        tmp.push(...listField.filter(e => isFieldCanDisplay(e)));
      }
      setFields(setValueFields(tmp));
    }
  }, [props.screenMode, props.summaryFields, props.product]);

  useEffect(() => {
    if (props.isSaveField) {
      const saveFieldResult = props.onSaveField(_.cloneDeep(fields), props.paramsEdit, props.fieldEdit)
      const deleteFieldTmp = saveFieldResult.deleteFields;
      const listFieldTmp = saveFieldResult.listField;
      const arrFieldDel = _.cloneDeep(deletedFields)
      if (saveFieldResult) {
        arrFieldDel.push(...deleteFieldTmp)
        setDeleteFields(arrFieldDel);
        setFields(listFieldTmp);
      }
      const idx = listFieldIdEdited.findIndex( e => e.fieldId === props.fieldEdit.fieldId)
      if (idx < 0) {
        listFieldIdEdited.push(props.fieldEdit.fieldId)
      }
      listFieldTmp.forEach((field) => {
        if(!_.isNil(field.oldField) && idx < 0) {
          listFieldIdEdited.push(field.fieldId);
        }
      })
      props.onChangeFields(listFieldTmp, arrFieldDel, listFieldIdEdited);
      props.destroySaveField();
    }
  }, [props.isSaveField])

  /* _________________Render_________________ */
  // const renderDataProductTrading = (data, field) => {
  //   const value = getDataFollowLabel(data, field);
  //   return getJsonBName(value) + (field.fieldName !== 'amount' ? "" : "円")
  // }

  const renderSummarySets = () => {
    const productSets = props.product?.productSets ? getMaxItemShowInList(TAB_ID_LIST.summary, props.product.productSets, props.product.tabInfo) : [];

    if(productSets && productSets.length && productSets[0] && productSets[0].productId){
      return (
        <>
          <div className="form-group no-margin mt-4">
            <label>{translate('products.detail.label.tab.productSets')}</label>
          </div>
          <div className="list-product">
            {productSets.map((productSet, i) => {
              return (
                <div className="product-detail style-2 mb-2" key={i}>
                  <img className='custom-img-product' src={ productSet.productImagePath || '../../content/images/noimage.png' } alt="" />
                  <div className="content">
                    <a className="text-blue" onClick={() => openProductSetDetail(productSet.productId)}>{productSet.productName}</a>
                    <p className="price">{productSet.unitPrice ? productSet.unitPrice.toLocaleString(navigator.language, { minimumFractionDigits: 0 }) : 0}{getCurrencyUnit("unitPrice", props.product?.fieldInfo )}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )
    }
  }
  const getLabelFieldProductTrading = (fieldName) => {
    const field = props.tradingProductsFields.find(item => item.fieldName === fieldName)
    if(field){
      return getFieldLabel(field, "fieldLabel")
    } 
    return ""
  }

  const getTotalProductTrading = () => {
    let total = 0
    props.tradingProducts.productTradings.forEach(element => {
      total = total + element.amount
    });
    return total
  }

  const renderSummaryTrading = item => {
    if(props.tradingProducts && props.tradingProducts.productTradings.length && props.tradingProductsFields.length){
      return (
        <>
          {props.screenMode === ScreenMode.EDIT && (
            <TabDisplaySetting item={...item} onSelectDislaySummary={props.onSelectDislaySummary} isListType={true} />
          )}
          {item.isDisplaySummary && (
            <table className={item.isDisplaySummary ? 'table-thead-background table-content table-layout-fixed mt-5' : 'table-layout-fixed table-thead-background table-content'}>
          <thead>
            <tr>
              <th>{getLabelFieldProductTrading("customer_id")}</th>
              <th>{getLabelFieldProductTrading("employee_id")}</th>
              <th>{getLabelFieldProductTrading("product_trading_progress_id")}</th>
              <th>{getLabelFieldProductTrading("end_plan_date")}</th>
              <th>
                <div>{getLabelFieldProductTrading("amount")}</div>
                <div>
                  {translate('customers.detail.label.total')}<span className="text-align-right">{getTotalProductTrading() + translate('customers.detail.label.moneyType')}</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {props.tradingProducts.productTradings.map((product, indexProduct) => {
              if (indexProduct > item.maxRecord -1 ){
                return <></>
              }else {
                return (
                  <tr key={indexProduct}>
                    <td><a href="#">{product.customerName}</a></td>
                    <td><EmployeeName employeeId={product.employee.employeeId} isHideAva={true} userName={product.employee.employeeSurnameKana}></EmployeeName></td>
                    <td>{getFieldLabel(product, 'progressName')}</td>
                    <td>{product.endPlanDate}</td>
                    <td className="text-right">{product.amount}円</td>
                  </tr>
                )
              }
            
            })
            }
          </tbody>
        </table>
          )}
        </>
      );
    }
  };

  const renderSummaryHistory = item => {
    const productHistories = props.product?.productHistories ? getMaxItemShowInList(TAB_ID_LIST.productHistory, props.product.productHistories, props.tabList) : [];

    return (
      <>
        {(props.screenMode === ScreenMode.EDIT || item.isDisplaySummary === true) && (
          <div className="form-group no-margin mt-4">
            <label>{translate('products.detail.label.tab.productHistory')}</label>
          </div>
        )}  
        {props.screenMode === ScreenMode.EDIT && (
          <TabDisplaySetting item={...item} onSelectDislaySummary={props.onSelectDislaySummary} isListType={true} />
        )}
        {item.isDisplaySummary && (
          <TabChangeHistory
          changeHistory={productHistories}
          fieldInfo={props.product.fieldInfo}
          fieldNameExtension={'product_data'}
          openModalEmployeeDetail={props.openModalEmployeeDetail}
          sourceData={{
            productCategories: props.product.productCategories ||[], 
            productTypes: props.product.productTypes ||[],
          }}
        />
        )}
      </>
    );
  };
 
  const renderTableField = (row: any[], key: any) => {
    return (
      <TabSummaryElement 
        fieldsInfo={row}
        screenMode={props.screenMode}
        fieldHighlight={listFieldIdEdited}
        valueData={props.product.product}
        onDragOrderField={onDragOrderField}
        onDropNewField={onDropNewField}
        openDynamicSelectFields={props.openDynamicSelectFields}
        onDeleteFields={onDeleteFields}
        fields={fields}
        onShowMessage={props.onShowMessage}
        productId={props.productId}
        openModalEmployeeDetail={props.openModalEmployeeDetail}
        edittingField={props.edittingField}
      />
    )
  }

  const renderContentTab = (listFieldContent: any[]) => {
    const rowRecordsTabContent = buildDoubleColumn(listFieldContent, props.screenMode)
    return (
      <>
        {rowRecordsTabContent &&
          <table className="table-default table-content-div cursor-df">
            <tbody>
              {rowRecordsTabContent.map((row, i) => {
                return renderTableField(row, i)
              })}
            </tbody>
          </table>
        }
      </>
    )
  }

  const recordBefore = getSplitRecord(-1)
  const recordAfter = getSplitRecord(1);
  const recordAll = getSplitRecord(0);

  return (
    <>
      <div className="tab-pane active">
        {recordBefore.length > 0 &&
        <table className="table-default table-content-div cursor-df">
          <tbody>
            {recordBefore.map((row, i) => {
              if (row[0].fieldOrder > listFieldTab[0].fieldOrder) {
                return <></>
              }
                return renderTableField(row, i)
              }
            )}
          </tbody>
        </table>
        }
        {listFieldTab && listFieldTab.length > 0 && 
          <>
            {props.screenMode === ScreenMode.DISPLAY && <br/>}
            <FieldDisplayRow
              fieldInfo={listFieldTab[0]}
              listFieldInfo={fields}
              controlType={ControlType.DETAIL_VIEW}
              isDisabled={!props.screenMode || props.screenMode === ScreenMode.DISPLAY}
              renderControlContent={renderContentTab}
              onExecuteAction={onExecuteAction}
              moveFieldCard={onDragOrderField}
              addFieldCard={onDropNewField}
              fieldIdsHighlight={listFieldIdEdited}
            />
            {props.screenMode === ScreenMode.DISPLAY && <br/>}
          </>
        }
        {recordAfter.length > 0 &&
          <table className="table-default table-content-div cursor-df">
          <tbody>
            {recordAfter.map((row, i) => {
              if (row[0].fieldOrder < listFieldTab[listFieldTab.length - 1].fieldOrder) {
                return <></>
              }
                return renderTableField(row, i)
              }
            )}
          </tbody>
        </table>
        }
        {listFieldTab && listFieldTab.length === 0 && 
          <table className="table-default table-content-div cursor-df">
            <tbody>
              {recordAll.map((row, i) => { return renderTableField(row, i) }
              )}
            </tbody>
          </table>}
        <FieldDisplayRowDragLayer />
      </div>
      {props.tabList && props.tabList.map((item, idx) => {
        if (item.tabId === TAB_ID_LIST.summary && item.isDisplaySummary) {
          return (
            <>{renderSummarySets()}</>
          )
        }
        if (item.tabId === TAB_ID_LIST.productTrading) {
          return (
            <>{renderSummaryTrading(item)}</>
          )
        }
        if (item.tabId === TAB_ID_LIST.productHistory) {
          return (
            <>{renderSummaryHistory(item)}</>
          )
        }
      })}
    </>
  );
});

export default TabSummary;
