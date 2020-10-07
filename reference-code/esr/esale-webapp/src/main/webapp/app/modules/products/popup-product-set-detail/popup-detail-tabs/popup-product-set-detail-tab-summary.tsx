import _, { concat } from 'lodash';

import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle, useCallback } from 'react';
import TabSummaryElement from './popup-product-set-detail-tab-summary-element';
import { translate } from 'react-jhipster';
import { isJsonString, addDefaultLabel } from '../../utils';
import { SettingModes } from '../../../../shared/layout/dynamic-form/control-field/dynamic-select-field';
import { ScreenMode, ControlType, FIELD_BELONG } from 'app/config/constants';
import { DEFINE_FIELD_TYPE, DynamicControlAction } from 'app/shared/layout/dynamic-form/constants';

import TabTradingProducts from 'app/modules/products/popup-product-set-detail/popup-detail-tabs/popup-product-set-detail-tab-trading-products';
import TabChangeHistory, { SpecialHistory } from 'app/shared/layout/common/history/display-history';
import { TAB_ID_LIST_SET, PRODUCT_SPECIAL_FIELD_NAMES, TypeMessage } from '../../constants';
import CustomDynamicList from '../../custom-common/custom-dynamic-list';
import SpecialEditList from '../../special-item/special-edit-list';
import { getValueProp } from 'app/shared/util/entity-utils';
import TabDisplaySetting from 'app/shared/layout/common/tab-display-setting';
import FieldDisplayRow, { FieldDisplayRowDragLayer } from 'app/shared/layout/dynamic-form/control-field/view/field-display-row';
import { sortOrderFields, buildDoubleColumn, processDragDropFields, processDeleteFields, processDragNewField, getMaxItemShowInList } from 'app/shared/util/utils';
import { getFieldLabel } from 'app/shared/util/string-utils';
import EmployeeName from 'app/shared/layout/common/EmployeeName';

export interface IPopupTabSummary {
  iconFunction?: string;
  showModal?: boolean;
  productSet: any;
  productSetAllFields?: any;
  screenMode: any;
  conditionSearch?: any[];
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
  onSaveField?: (fields, params, fieldEdit) => { listField; deleteFields };
  openProductDetailFromOther?: (id, isProductSet) => void;
  openModalEmployeeDetail: (paramEmployeeId) => void;
  productId?: any;
  countSave?: any;
  setPopupSettingMode(settingMode: SettingModes): void;
  onSelectDislaySummary?: any;
  deletedFields?: any[];
  edittingField: any;
  fieldsUnavailable: any[];
  tradingProducts?;
  tradingProductsFields?
}

const TabSummary = forwardRef((props: IPopupTabSummary, ref) => {
  const [fields, setFields] = useState([]);
  const [deletedFields, setDeleteFields] = useState([]);
  const [listFieldNormal, setListFieldNormal] = useState([]);
  const [listFieldTab, setListFieldTab] = useState([]);
  const [listFieldIdEdited, setListFieldIdEdited] = useState([]);
  const [listProduct, setListProduct] = useState([]);
  const [saveEditValues, setSaveEditValues] = useState([]);
  const [fieldsUnavailable, setFieldsUnavailable] = useState([]);

  const fieldTabRef = useRef(null);
  const customDynamicListRef = useRef(null);

  /* _________________Optional_________________ */
  const getFieldInfoByProductType = productSet => {
    const fieldInfoUse = [];

    if (productSet && productSet.dataInfo && productSet.dataInfo.productTypes && productSet.dataInfo.productTypes.length) {
      const curentProductType = productSet.dataInfo.productTypes.find(
        productType => productType.productTypeId === productSet.dataInfo.productSet.productTypeId
      );

      if (curentProductType && isJsonString(curentProductType.fieldUse)) {
        const fieldUse = JSON.parse(curentProductType.fieldUse);
        for (const key in fieldUse) {
          if (Object.prototype.hasOwnProperty.call(fieldUse, key)) {
            productSet.fieldInfoProduct.forEach(el => {
              if (el.fieldId === Number(key) && fieldUse[key] === 1) {
                fieldInfoUse.push(el);
              }
            });
          }
        }
      }
    }
    return fieldInfoUse;
  };

  const isFieldCanDisplay = (field) => {
    if (_.toString(field.fieldType) !== DEFINE_FIELD_TYPE.RELATION) {
      return true;
    }
    if (_.isNil(field.relationData) || field.relationData.asSelf !== 1) {
      return true
    }
    return false;
  }

  const deepEqual = (x?: object | null, y?: object | null, ignoreRootProps?: Set<string>) => {
    if (x == null || y == null) {
      return x === y;
    }
    const keys = Object.keys(x);
    if (!_.isEqual(Object.keys(x).sort(), Object.keys(y).sort())) {
      return false;
    }

    for (const key of keys) {
      if (ignoreRootProps && ignoreRootProps.has(key)) {
        continue;
      }
      if (key === 'fieldLabel' || key === 'itemLabel') {
        if (_.isNil(x[key]) && _.isNil(y[key])) {
          continue;
        }
        if (_.isNil(x[key]) || _.isNil(y[key])) {
          return false;
        }
        let obj1 = '';
        let obj2 = '';
        try {
          obj1 = _.isString(x[key]) ? JSON.parse(x[key]) : x[key];
          obj2 = _.isString(y[key]) ? JSON.parse(y[key]) : y[key];
        } catch (e) {
          obj1 = x[key];
          obj2 = y[key];
        }
        if (!_.isEqual(obj1, obj2)) {
          return false;
        }
      } else {
        if (_.isObject(x[key])) {
          const result = deepEqual(x[key], y[key]);
          if (!result) {
            return false;
          } else {
            continue;
          }
        } else if (!_.isEqual(x[key], y[key])) {
          return false;
        }
      }
    }
    return true;
  };

  const onDeleteFieldsBelong14 = fieldInfo => {
    const fieldsAfterDelete = _.cloneDeep(fields);
    processDeleteFields(fieldsAfterDelete, fieldInfo, deletedFields);

    const objParams = sortOrderFields(fieldsAfterDelete, props.productSetAllFields);
    setFields(objParams);
    const idx = listFieldIdEdited.findIndex(e => e.fieldId === props.fieldEdit.fieldId);
    if (idx >= 0) {
      listFieldIdEdited.splice(idx, 1);
    }
    props.onChangeFields(objParams, deletedFields, listFieldIdEdited);
  };

  const addPrefixFields = dataFieldInfo => {
    let fieldInfo = _.cloneDeep(dataFieldInfo);

    if (fieldInfo) {
      if (
        props.productSet &&
        props.productSet.dataInfo &&
        props.productSet.dataInfo.productSet &&
        props.productSet.dataInfo.productSet.productTypeId &&
        props.screenMode !== ScreenMode.EDIT
      ) {
        fieldInfo = getFieldInfoByProductType(props.productSet);
      }
      fieldInfo.forEach(field => {
        if (field && field.fieldLabel && isJsonString(field.fieldLabel)) {
          switch (field.fieldName) {
            case 'product_id':
              field.fieldLabel = JSON.stringify(addDefaultLabel(translate('products.detail.label.product.id')));
              break;
            case 'product_name':
              field.fieldLabel = JSON.stringify(addDefaultLabel(translate('products.detail.label.product.name')));
              break;
            case 'product_image_name':
              field.fieldLabel = JSON.stringify(addDefaultLabel(translate('products.detail.label.product.imagename')));
              break;
            case 'product_type_id':
              field.fieldLabel = JSON.stringify(addDefaultLabel(translate('products.detail.label.product.typeid')));
              break;
            case 'unit_price':
              field.fieldLabel = JSON.stringify(addDefaultLabel(translate('products.detail.label.product.unitprice')));
              break;
            default:
              break;
          }
        }
      });
    }
    return fieldInfo;
  };

  const isFieldDisplayNormal = field => {
    if (field.fieldType.toString() === DEFINE_FIELD_TYPE.TAB) {
      return false;
    }
    // if (field.fieldType.toString() === DEFINE_FIELD_TYPE.RELATION && field.relationData) {
    //   if (field.relationData.displayTab === 1) {
    //     return false;
    //   }
    // }
    return true;
  };

  const onExecuteAction = (fieldInfoExe, actionType) => {
    switch (actionType) {
      case DynamicControlAction.DELETE:
        if (fieldInfoExe.fieldBelong === FIELD_BELONG.PRODUCT) {
          if (_.get(props, 'edittingField.fieldId') < 0 && _.isNil(props.edittingField.userModifyFlg) && _.isNil(props.edittingField.userModifyFlg)) {
            if (props.onShowMessage) {
              props.onShowMessage(translate('messages.ERR_COM_0042'), TypeMessage.deleteWarning);
            }
          } else {
            onDeleteFieldsBelong14(fieldInfoExe)
            if (_.get(props, 'edittingField.fieldId') === fieldInfoExe.fieldId) {
              props.openDynamicSelectFields(SettingModes.CreateNewInput, fieldInfoExe)
            }
          }
        } else {
          props.setPopupSettingMode(SettingModes.CreateNewInput);
        }
        break;
      case DynamicControlAction.EDIT:
        if (props.openDynamicSelectFields) {
          props.openDynamicSelectFields(SettingModes.EditInput, fieldInfoExe);
        }
        break;
      default:
        break;
    }
  };

  const openProductDetail = useCallback(
    productId => {
      props.openProductDetailFromOther(productId, false);
    },
    [props.openProductDetailFromOther]
  );
  
  /* _________________Drag Drop_________________ */

  const getSplitRecord = (mode: number) => {
    const records = [];
    if (mode === 0) {
      records.push(...listFieldNormal);
    } else if (mode < 0) {
      if (listFieldTab.length === 0) {
        return records;
      }
      records.push(...listFieldNormal.filter(e => e.fieldOrder < listFieldTab[0].fieldOrder));
    } else {
      if (listFieldTab.length === 0) {
        return records;
      }
      records.push(...listFieldNormal.filter(e => e.fieldOrder > listFieldTab[listFieldTab.length - 1].fieldOrder));
    }
    return buildDoubleColumn(records, props.screenMode);
  };

  const onDragOrderField = (dragFieldId, dropFieldId, isDoubleColumn: boolean, isAddLeft: boolean) => {
    processDragDropFields(fields, dragFieldId, dropFieldId, isDoubleColumn, isAddLeft, fieldTabRef, props.screenMode, props.countSave, listFieldIdEdited)
    const objParam = sortOrderFields(fields, props.productSetAllFields);
    setFields(objParam);
    props.onChangeFields(objParam, deletedFields, listFieldIdEdited);
  };

  const onDropNewField = (dragItem, dropId, isDoubleColumn: boolean, isAddLeft: boolean) => {
    if(!_.isNil(dragItem.fieldBelong) && dragItem.fieldBelong !== FIELD_BELONG.PRODUCT)
      return;

    const fieldDrag = _.cloneDeep(dragItem);
    processDragNewField(fields, fieldDrag, dropId, isDoubleColumn, isAddLeft, fieldTabRef, props.screenMode, props.countSave, fieldsUnavailable);

    listFieldIdEdited.push(fieldDrag.fieldId);
    const objParams = sortOrderFields(fields, props.productSetAllFields);
    setFields(objParams);
    props.onChangeFields(objParams, deletedFields, listFieldIdEdited);
    props.openDynamicSelectFields(SettingModes.EditInput, fieldDrag);
  };

  useImperativeHandle(ref, () => ({
    onAddNewField(field) {
      onDropNewField(field, fields[fields.length - 1].fieldId, false, false);
    },
    getCurrentFieldInfoProductSet() {
      return customDynamicListRef.current.getCurrentFieldInfoProductSet();
    },
    getDeleteFieldInfoProductSet() {
      return customDynamicListRef.current.getDeleteFieldInfoProductSet();
    },
    onDynamicFieldPopupExecuteActionForCommonProduct(fieldInfo, actionType, params) {
      customDynamicListRef.current.onDynamicFieldPopupExecuteAction(fieldInfo, actionType, params);
    }
  }));

  /* _________________Custom Dynamic_________________ */
  const onUpdateFieldValue = (itemData, type, itemEditValue) => {
    const index = saveEditValues.findIndex(
      e => e.itemId.toString() === itemData.itemId.toString() && e.fieldId.toString() === itemData.fieldId.toString()
    );
    if (index < 0) {
      saveEditValues.push({ itemId: itemData.itemId, fieldId: itemData.fieldId, itemValue: itemEditValue });
    } else {
      saveEditValues[index] = { itemId: itemData.itemId, fieldId: itemData.fieldId, itemValue: itemEditValue };
    }
    setSaveEditValues(_.cloneDeep(saveEditValues));
  };

  /* _________________Lifecycle_________________ */
  useEffect(() => {
    if (props.fieldsUnavailable) {
      setFieldsUnavailable(props.fieldsUnavailable)
    }
  }, [props.fieldsUnavailable])

  useEffect(() => {
    if (props.editedFields) {
      setListFieldIdEdited(props.editedFields)
    }
  }, [props.editedFields])

  useEffect(() => {
    setDeleteFields(props.deletedFields)
  }, [props.deletedFields])

  useEffect(() => {
    if (!props.summaryFields || !props.summaryFields.length) {
      props.onChangeFields(_.cloneDeep(props.productSet.fieldInfoProduct), [], []);
    } else {
      setListFieldIdEdited(props.editedFields);
    }
  }, []);

  useEffect(() => {
    fields.forEach(field => {
      if (!_.isNil(field.tabData) && field.tabData.length > 0) {
        field.tabData.forEach(fieldInTab => {
          fields.forEach(item => {
            if (item.fieldId === fieldInTab) {
              if (!_.isNil(item.inTab)) {
                item.inTab = true;
              } else {
                Object.assign(item, { inTab: true });
              }
            } else {
              if (_.isNil(item.inTab)) {
                Object.assign(item, { inTab: false });
              }
            }
          });
        });
      }
    });
  }, [fields]);

  useEffect(() => {
    if (_.isNil(fields)) {
      return;
    }
    const fieldTabs = fields.filter(e => e.fieldType.toString() === DEFINE_FIELD_TYPE.TAB);
    const fieldNormals = fields.filter(e => isFieldDisplayNormal(e));

    fieldTabs.forEach(field => {
      if (!_.isNil(field.tabData) && field.tabData.length > 0) {
        field.tabData.forEach(e => {
          const idx = fieldNormals.findIndex(o => o.fieldId === e);
          if (idx >= 0) {
            fieldNormals.splice(idx, 1);
          }
        });
      }
    });
    setListFieldTab(fieldTabs);
    setListFieldNormal(fieldNormals);
  }, [fields]);

  useEffect(() => {
    const listField = sortOrderFields(props.summaryFields ? props.summaryFields : _.cloneDeep(props.productSet.fieldInfoProduct), props.productSetAllFields);
    setFields(listField.filter( e => isFieldCanDisplay(e)))
  }, [props.summaryFields])

  useEffect(() => {
    if (props.productSet) {
      setListProduct(_.clone(props.productSet.dataInfo.products) || []);

      if (props.screenMode === ScreenMode.EDIT) {
        setFields(
          addPrefixFields(
            props.summaryFields && props.summaryFields.length
              ? props.summaryFields
              : _.cloneDeep(props.productSet.fieldInfoProduct)
          )
        );
      } else {
        setFields(
          addPrefixFields(
            _.cloneDeep(props.productSet.fieldInfoProduct)
          )
        );
        setListFieldIdEdited([]);
      }
    }
  }, [props.screenMode, props.summaryFields, props.productSet]);

  useEffect(() => {
    if (props.isSaveField) {
      const saveFieldResult = props.onSaveField(_.cloneDeep(fields), props.paramsEdit, props.fieldEdit);
      const deleteFieldTmp = saveFieldResult.deleteFields;
      const listFieldTmp = saveFieldResult.listField;
      const arrFieldDel = _.cloneDeep(deletedFields)
      if (saveFieldResult) {
        arrFieldDel.push(...deleteFieldTmp)
        setDeleteFields(arrFieldDel);
        setFields(listFieldTmp);
      }
      const idx = listFieldIdEdited.findIndex(e => e.fieldId === props.fieldEdit.fieldId);
      if (idx < 0) {
        listFieldIdEdited.push(props.fieldEdit.fieldId);
      }
      listFieldTmp.forEach((field) => {
        if(!_.isNil(field.oldField) && idx < 0) {
          listFieldIdEdited.push(field.fieldId);
        }
      })
      props.onChangeFields(listFieldTmp, arrFieldDel, listFieldIdEdited);
      props.destroySaveField();
    }
  }, [props.isSaveField]);

  /* _________________Render_________________ */
  const renderCellSpecial = (field, rowData, mode, nameKey) => {
    const cellId = `dynamic_cell_${getValueProp(rowData, nameKey)}_${field.fieldId}`;
    if (field.fieldName === PRODUCT_SPECIAL_FIELD_NAMES.createBy || field.fieldName === PRODUCT_SPECIAL_FIELD_NAMES.updateBy) {
      return (
        <div id={cellId} className="break-spaces">
          {rowData[field.fieldName]}
        </div>
      );
    } else if (field.fieldName === PRODUCT_SPECIAL_FIELD_NAMES.productsSets) {
      if (rowData[PRODUCT_SPECIAL_FIELD_NAMES.productsSets]) {
        return (
          <div id={cellId} className="break-spaces">
            {rowData[PRODUCT_SPECIAL_FIELD_NAMES.productsSets].map((item, idx) => {
              if (idx < rowData[PRODUCT_SPECIAL_FIELD_NAMES.productsSets].length - 1) {
                return <a>{item.productName}, </a>;
              } else {
                return <a>{item.productName}</a>;
              }
            })}
          </div>
        );
      }
    } else {
      return (
        <SpecialEditList
          valueData={rowData}
          itemData={field}
          extensionsData={() => {}}
          updateStateField={onUpdateFieldValue}
          nameKey={nameKey}
          mode={mode}
        />
      );
    }
  };

  const renderTableField = (row: any[], key: any) => {
    return (
      <TabSummaryElement
        fieldsInfo={row}
        screenMode={props.screenMode}
        fieldHighlight={listFieldIdEdited}
        valueData={props.productSet && props.productSet.dataInfo ? props.productSet.dataInfo.productSet : null}
        onDragOrderField={onDragOrderField}
        onDropNewField={onDropNewField}
        onExecuteAction={onExecuteAction}
        fields={fields}
        onShowMessage={props.onShowMessage}
        productId={props.productId}
        products={props.productSet && props.productSet.dataInfo ? props.productSet.dataInfo.products : null}
        openProductDetailFromOther={props.openProductDetailFromOther}
        openModalEmployeeDetail={props.openModalEmployeeDetail}
        edittingField={props.edittingField}
      />
    );
  };

  const renderContentTab = (listFieldContent: any[]) => {
    const rowRecordsTabContent = buildDoubleColumn(listFieldContent, props.screenMode);
    return (
      <>
        {rowRecordsTabContent && (
          <table className="table-default table-content-div cursor-df">
            <tbody>
              {rowRecordsTabContent.map((row, i) => {
                return renderTableField(row, i);
              })}
            </tbody>
          </table>
        )}
      </>
    );
  };

  const renderListProductOfSet = () => {
    return (
      <div>
        <div className="form-group no-margin mt-4">
          <label>{translate('products.detail.label.tab.productOfSets')}</label>
        </div>
        <div className="list-product">
          {listProduct && listProduct.length > 0 ? (
            <div className={'products-sets-wrap wrap-control-esr table-list-wrap height-auto'}>
              <CustomDynamicList
                ref={customDynamicListRef}
                products={listProduct}
                fieldInfoProductSet={props.productSet.fieldInfoProductSet}
                screenMode={props.screenMode}
                customContentField={renderCellSpecial}
                onUpdateFieldValue={onUpdateFieldValue}
                onExecuteAction={onExecuteAction}
                openProductDetail={openProductDetail}
                isSetting={true}
              />
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    );
  };

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

  const renderProductTrading = (item) => {
    // const productTradings =
    //   props.productSet && props.productSet.dataInfo && props.productSet.dataInfo.productTradings
    //     ? props.productSet.dataInfo.productTradings
    //     : null;
    // const item = props.tabList && props.tabList.find(obj => obj.tabId === TAB_ID_LIST_SET.productTrading);
    // const hasfieldInfoTab =
    //   props.productSet &&
    //   props.productSet.dataInfo &&
    //   props.productSet.dataInfo.productTradings &&
    //   props.productSet.dataInfo.productTradings.fieldInfoTab &&
    //   props.productSet.dataInfo.productTradings.fieldInfoTab.length > 0;

    // if (item && item.isDisplaySummary && hasfieldInfoTab) {
    //   return (
    //     <>
    //       <div className="user-popup-form">
    //         <div className="form-group no-margin">
    //           <label>{translate('products.detail.label.tab.productTrading')}</label>
    //         </div>
    //       </div>
    //       {props.screenMode === ScreenMode.EDIT && (
    //         <TabDisplaySetting item={...item} onSelectDislaySummary={props.onSelectDislaySummary} isListType={true} />
    //       )}
    //       <TabTradingProducts
    //         tradingProducts={productTradings}
    //         mode={props.screenMode}
    //         tradingProductsFields={null}
    //         onChangeFields={null}
    //       />
    //     </>
    //   );
    // }
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

  const renderProductSetHistory = () => {
    const productSetHistories = props.productSet?.dataInfo?.productHistories ? getMaxItemShowInList(
      TAB_ID_LIST_SET.changehistory,
      props.productSet.dataInfo.productHistories,
      props.tabList
    ) : [];
    const item = props.tabList && props.tabList.find(obj => obj.tabId === TAB_ID_LIST_SET.changehistory);

    return (
      <>
        {((item && item.isDisplaySummary) || props.screenMode === ScreenMode.EDIT) && (
          <div className="form-group mt-4">
            <label>{translate('products.detail.label.tab.productHistory')}</label>
          </div>
        )}
        {props.screenMode === ScreenMode.EDIT && (
          <TabDisplaySetting item={...item} onSelectDislaySummary={props.onSelectDislaySummary} isListType={true} />
        )}
        {item && item.isDisplaySummary && (
           <TabChangeHistory
           changeHistory={productSetHistories}
           fieldInfo={concat(props.productSet.fieldInfoProductSet, props.productSet.fieldInfoProduct)}
           type={SpecialHistory.productSet}
           fieldNameExtension={'product_data'}
           openModalEmployeeDetail={props.openModalEmployeeDetail}
         />
        )}
      </>
    );
  };

  const recordBefore = getSplitRecord(-1);
  const recordAfter = getSplitRecord(1);
  const recordAll = getSplitRecord(0);

  return (
    <>
      <div className="tab-pane active">
        {recordBefore.length > 0 && (
          <table className="table-default table-content-div cursor-df">
            <tbody>
              {recordBefore.map((row, i) => {
                if (row[0].fieldOrder > listFieldTab[0].fieldOrder) {
                  return <></>;
                }
                return renderTableField(row, i);
              })}
            </tbody>
          </table>
        )}
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
        {recordAfter.length > 0 && (
          <table className="table-default table-content-div cursor-df">
            <tbody>
              {recordAfter.map((row, i) => {
                if (row[0].fieldOrder < listFieldTab[listFieldTab.length - 1].fieldOrder) {
                  return <></>;
                }
                return renderTableField(row, i);
              })}
            </tbody>
          </table>
        )}
        {listFieldTab && listFieldTab.length === 0 && (
          <table className="table-default table-content-div cursor-df">
            <tbody>
              {recordAll.map((row, i) => {
                return renderTableField(row, i);
              })}
            </tbody>
          </table>
        )}
        <FieldDisplayRowDragLayer />
      </div>

      {/* {renderListProductOfSet()}
      {renderProductTrading()}
      {renderProductSetHistory()} */}

      {props.tabList &&
        props.tabList.map((item, idx) => {
          if (item.tabId === TAB_ID_LIST_SET.summary && item.isDisplaySummary) {
            return <>{renderListProductOfSet()}</>;
          }
          if (item.tabId === TAB_ID_LIST_SET.productTrading && item.isDisplaySummary) {
            return <>{renderProductTrading(item)}</>;
          }
          if (item.tabId === TAB_ID_LIST_SET.changehistory && item.isDisplaySummary) {
            return <>{renderProductSetHistory()}</>;
          }
        })}
    </>
  );
});

export default TabSummary;
