import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { ScreenMode, ControlType } from 'app/config/constants';
import _ from 'lodash';
import { useId } from "react-id-generator";
import TabSummaryElement from './detail-tab-summary-element';
import PopupEmployeeDetail from '../../../employees/popup-detail/popup-employee-detail';
import { SettingModes } from '../../../../shared/layout/dynamic-form/control-field/dynamic-select-field';
import { DEFINE_FIELD_TYPE, DynamicControlAction } from 'app/shared/layout/dynamic-form/constants';
import FieldDisplayRow, { FieldDisplayRowDragLayer } from 'app/shared/layout/dynamic-form/control-field/view/field-display-row';
import { sortOrderFields, buildDoubleColumn, processDragDropFields, processDeleteFields, processDragNewField, getMaxItemShowInList } from 'app/shared/util/utils';
import PopupCustomerDetail from 'app/modules/customers/popup-detail/popup-customer-detail';

export interface IDetailTabSummary {
  task: any;
  screenMode: any;
  handleReorderField: (dragIndex, dropIndex) => void;
  onChangeFields?: (fields: any[], deletedFields: any[], editFields: any[]) => void;
  summaryFields?: any;
  editedFields?: any[];
  onClickDetailMilestone?: (milestoneId) => void;
  onOpenModalSubTaskDetail?: (subTaskId) => void
  openDynamicSelectFields: (settingMode, fieldEdit) => void;
  tabList?: any;
  isSaveField?: boolean;
  destroySaveField?: () => void;
  fieldEdit: any;
  paramsEdit: any;
  onShowMessage?: (message, type) => void;
  onSaveField?: (fields, params, fieldEdit) => { listField, deleteFields };
  taskId?: any;
  checkOnline?: (id) => void;
  resetOnline?: () => void;
  countSave?: any;
  taskAllFields?: any;
  deletedFields?: any[];
  edittingField: any;
  fieldsUnavailable: any[];
  popout?: boolean,
}

/**
 * Component for detail task tab summary content
 * @param props 
 */
const TabSummary = forwardRef((props: IDetailTabSummary, ref) => {
  const [infoTask, setInfoTask] = useState(props.task ? props.task.dataInfo.task : null);
  const [, setFirst] = useState(false);
  const [, setShouldRender] = useState(false);
  const [fields, setFields] = useState([]);
  const [deletedFields, setDeleteFields] = useState([]);
  const [listFieldNormal, setListFieldNormal] = useState([]);
  const [listFieldTab, setListFieldTab] = useState([]);
  const [listFieldIdEdited, setListFieldIdEdited] = useState([]);
  const fieldTabRef = useRef(null)

  const [openPopupEmployeeDetail, setOpenPopupEmployeeDetail] = useState(false);
  const [openCustomerDetail, setOpenCustomerDetail] = useState(false);
  const [currentCustomerId, setCurrentCustomerId] = useState(null);
  const [employeeId, setEmployeeId] = useState(0);
  const [fieldsUnavailable, setFieldsUnavailable] = useState([]);
  const employeeDetailCtrlId = useId(1, "taskSummaryEmployeeDetail_")
  const customerDetailCtrlId = useId(1, "taskSummaryCustomerDetailCtrlId_");

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
    setFirst(true);
    setShouldRender(true);
    return () => { setFirst(false); setFields(null); }
  }, []);

  useEffect(() => {
    if (props.fieldsUnavailable) {
      setFieldsUnavailable(props.fieldsUnavailable)
    }
  }, [props.fieldsUnavailable])

  useEffect(() => {
    setDeleteFields(props.deletedFields)
  }, [props.deletedFields])

  useEffect(() => {
    if (props.task.dataInfo && props.task.dataInfo.task) {
      setInfoTask(props.task.dataInfo.task);
    } else {
      setInfoTask(null);
    }
  }, [props.task]);

  /**
 * modify fields, add inTab
 * 
 */
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

  // const compareField = (listFieldOrdered) => {
  //   const listFields = _.cloneDeep(listFieldOrdered);
  //   listFields.forEach((field) => {
  //     const inTabTmp = field.inTab;
  //     if (props.taskAllFields.fieldInfo) {
  //       const idx = props.taskAllFields.fieldInfo.findIndex(e => e.fieldId === field.fieldId)
  //       if (field.fieldId > 0) {
  //         delete field.userModifyFlg;
  //         delete field.inTab;
  //       }
  //       if (idx >= 0 && deepEqual(props.taskAllFields.fieldInfo[idx], field) === false) {
  //         field.userModifyFlg = true
  //       } else if (idx >= 0 && deepEqual(props.taskAllFields.fieldInfo[idx], field) === true) {
  //         field.userModifyFlg = false;
  //       }
  //     }
  //     field.inTab = inTabTmp;
  //   })
  //   return listFields;
  // }

  // const isFieldInTab = (field: any, listField: any) => {
  //   if (!field || !listField) {
  //     return false;
  //   }
  //   const listTab = listField.filter(e => _.toString(e.fieldType) === DEFINE_FIELD_TYPE.TAB)
  //   if (!listTab || listTab.length < 1) {
  //     return false;
  //   }
  //   for (let i = 0; i < listTab.length; i++) {
  //     if (field.tabData && _.isArray(field.tabData)) {
  //       if (field.tabData.findIndex(e => e === field.fieldId) >= 0) {
  //         return true;
  //       }
  //     }
  //   }
  //   return false;
  // }

  // /**
  //  * When drag a field from popup setting fields in to screen
  //  * 
  //  * @param dragFieldId 
  //  * @param dropFieldId 
  //  */
  // const sortOrderFields = (listField: any[]) => {
  //   const listFieldOrdered = [];
  //   const listTab = listField.filter(e => _.toString(e.fieldType) === DEFINE_FIELD_TYPE.TAB)
  //   if (!listTab || listTab.length < 1) {
  //     for (let i = 0; i < listField.length; i++) {
  //       const field = _.cloneDeep(listField[i]);
  //       field.fieldOrder = i + 1;
  //       listFieldOrdered.push(field)
  //     }

  //     return compareField(listFieldOrdered);
  //   }
  //   let order = 1;
  //   const startTabIndex = listField.findIndex(e => e.fieldId === listTab[0].fieldId);
  //   for (let i = 0; i < startTabIndex; i++) {
  //     const field = _.cloneDeep(listField[i]);
  //     if (isFieldInTab(field, listField)) {
  //       continue;
  //     }
  //     field.fieldOrder = order;
  //     listFieldOrdered.push(field)
  //     order = order + 1;
  //   }
  //   for (let i = 0; i < listTab.length; i++) {
  //     const field = _.cloneDeep(listTab[i]);
  //     field.fieldOrder = order;
  //     listFieldOrdered.push(field)
  //     order = order + 1;
  //     if (field.tabData && _.isArray(field.tabData)) {
  //       const tabData = listField.filter(e => field.tabData.findIndex(o => o === e.fieldId) >= 0)
  //       for (let j = 0; j < tabData.length; j++) {
  //         const fieldInTab = _.cloneDeep(tabData[j]);
  //         fieldInTab.fieldOrder = order;
  //         listFieldOrdered.push(fieldInTab)
  //         order = order + 1;
  //       }
  //     }
  //   }
  //   const listFieldTail = listField.filter(e => listFieldOrdered.findIndex(o => o.fieldId === e.fieldId) < 0)

  //   for (let i = 0; i < listFieldTail.length; i++) {
  //     const field = _.cloneDeep(listFieldTail[i]);
  //     if (isFieldInTab(field, listField)) {
  //       continue;
  //     }
  //     field.fieldOrder = order;
  //     listFieldOrdered.push(field)
  //     order = order + 1;
  //   }

  //   listFieldOrdered.sort((a, b) => { return a.fieldOrder - b.fieldOrder })

  //   return compareField(listFieldOrdered);
  // }

  useEffect(() => {
    setFirst(true);
    setShouldRender(true);
    if (!props.summaryFields) {
      props.onChangeFields(_.cloneDeep(props.task.fieldInfo), [], []);
    } else {
      setListFieldIdEdited(props.editedFields)
    }
    return () => { setFirst(false); setFields(null); }
  }, []);

  useEffect(() => {
    if (props.editedFields) {
      setListFieldIdEdited(props.editedFields)
    }
  }, [props.editedFields])

  useEffect(() => {
    if (props.task) {
      let listField = null
      if (props.screenMode === ScreenMode.EDIT) {
        listField = props.summaryFields ? props.summaryFields.sort((a, b) => { return (a.fieldOrder - b.fieldOrder) }) : _.cloneDeep(props.task.fieldInfo.sort((a, b) => { return (a.fieldOrder - b.fieldOrder) }))
      } else {
        listField = _.cloneDeep(props.task.fieldInfo.sort((a, b) => { return (a.fieldOrder - b.fieldOrder) }));
        setListFieldIdEdited([]);
      }
      const tmp = []
      if (!_.isNil(listField)) {
        tmp.push(...listField.filter(e => isFieldCanDisplay(e)));
      }
      if (props.taskAllFields && props.taskAllFields.fieldInfo) {
        setFields(sortOrderFields(tmp, props.taskAllFields.fieldInfo))
      }
    }
  }, [props.task, props.summaryFields, props.screenMode]);

  useEffect(() => {
    if (props.taskAllFields && props.taskAllFields.fieldInfo) {
      const listField = sortOrderFields(props.summaryFields ? props.summaryFields.sort((a, b) => { return (a.fieldOrder - b.fieldOrder) }) : _.cloneDeep(props.task.fieldInfo.sort((a, b) => { return (a.fieldOrder - b.fieldOrder) })), props.taskAllFields.fieldInfo)
      setFields(listField.filter(e => isFieldCanDisplay(e)))
    }
  }, [props.summaryFields])

  //   /**
  //  * get rowRecord for list Field not in Tab 
  //  */
  // const buildDoubleColumn = (listFields: any[]) => {
  //   const dblColumns = []
  //   if (!listFields) {
  //     return dblColumns;
  //   }
  //   if (props.screenMode === ScreenMode.DISPLAY) {
  //     listFields = listFields.filter(e => _.toString(e.fieldType) !== DEFINE_FIELD_TYPE.LOOKUP);
  //   }
  //   const fieldInfosDetailTask = [];
  //   listFields.forEach(element => {
  //     if (!FieldInfoDetailTaskRemove.includes(element.fieldName)){
  //       fieldInfosDetailTask.push(element);
  //     }
  //   });

  //   for (let i = 0; i < fieldInfosDetailTask.length; i++) {
  //     const rowData = [];
  //     if (i === 0) {
  //       rowData.push(fieldInfosDetailTask[i]);
  //       dblColumns.push(rowData);
  //     } else {
  //       const isDouble = fieldInfosDetailTask[i].isDoubleColumn;
  //       const beforeDouble = fieldInfosDetailTask[i - 1].isDoubleColumn;
  //       let beforePrevDouble = false;
  //       if (i > 1) {
  //         beforePrevDouble = fieldInfosDetailTask[i - 2].isDoubleColumn
  //       }
  //       if (!isDouble) {
  //         rowData.push(fieldInfosDetailTask[i]);
  //         dblColumns.push(rowData);
  //       } else {
  //         if (!beforeDouble) {
  //           rowData.push(fieldInfosDetailTask[i]);
  //           dblColumns.push(rowData);
  //         } else {
  //           if (beforePrevDouble) {
  //             rowData.push(fieldInfosDetailTask[i]);
  //             dblColumns.push(rowData);
  //           } else {
  //             dblColumns[dblColumns.length - 1].push(fieldInfosDetailTask[i])
  //           }
  //         }
  //       }
  //     }
  //   }
  //   return dblColumns;
  // }

  // const reMakeFieldDragDrop = (isDoubleColumn, fieldDrag, dropIndex, isAddLeft) => {
  //   const addNewFieldIndex = fields.findIndex(e => e.fieldId === fieldDrag.fieldId);
  //   const dropField = fields[dropIndex]
  //   if (!isDoubleColumn) {
  //     if (fieldDrag.fieldId < 0 && _.isNil(props.countSave[fieldDrag.fieldId]) && addNewFieldIndex < 0) {
  //       fields.splice(dropIndex + 1, 0, fieldDrag);
  //     } else {
  //     fieldDrag.isDoubleColumn = isDoubleColumn;
  //     const dragIndex = fields.findIndex(e => e.fieldId === fieldDrag.fieldId)
  //     const tempObject = fields.splice(dragIndex, 1)[0];
  //     const dropIndexAfterSplice = fields.findIndex(e => e.fieldId === dropField.fieldId)
  //     fields.splice(dropIndexAfterSplice + 1, 0, tempObject);
  //     }
  //   } else {
  //     const dblColumns = buildDoubleColumn(fields);
  //     const arrDrop = dblColumns.find( e => (e.length === 1 && e[0].fieldId === fields[dropIndex].fieldId) || 
  //                   (e.length === 2 && (e[0].fieldId === fields[dropIndex].fieldId || e[1].fieldId === fields[dropIndex].fieldId)))
  //     if (fieldDrag.fieldId < 0 && _.isNil(props.countSave[fieldDrag.fieldId]) && addNewFieldIndex < 0) {
  //       fieldDrag.isDoubleColumn = true;
  //     } else {
  //       fieldDrag.isDoubleColumn = isDoubleColumn;
  //       const dragIndex = fields.findIndex(e => e.fieldId === fieldDrag.fieldId)
  //       fields.splice(dragIndex, 1);
  //     }

  //     if (arrDrop.length === 1) {
  //       fields[dropIndex].isDoubleColumn = true;
  //     } else if (arrDrop.length === 2) {
  //       const idx = fields.findIndex(e => e.fieldId === arrDrop[1].fieldId);
  //       if (idx >= 0) {
  //         fields[dropIndex].isDoubleColumn = false;
  //       }
  //       if (fields[dropIndex].fieldId === arrDrop[0].fieldId) {
  //         fields[dropIndex].isDoubleColumn = true;
  //       } else {
  //         if (fields[dropIndex].fieldId === arrDrop[1].fieldId && dropIndex > 0) {
  //           fields[dropIndex - 1].isDoubleColumn = true;
  //         }
  //       }
  //     }
  //     const dropIndexAfterSplice = fields.findIndex(e => e.fieldId === dropField.fieldId)
  //     fields.splice(dropIndexAfterSplice + (isAddLeft ? 0 : 1), 0, fieldDrag);
  //   }
  // }

  const onDragOrderField = (dragFieldId, dropFieldId, isDoubleColumn: boolean, isAddLeft: boolean) => {
    // let dragIndex = -1;
    // if (_.isArray(dragFieldId)) {
    //   dragIndex = fields.findIndex(e => e.fieldId === dragFieldId[0]);
    // } else {
    //   dragIndex = fields.findIndex(e => e.fieldId === dragFieldId);
    //   const idx = listFieldIdEdited.findIndex(e => e.fieldId === fields[dragIndex].fieldId)
    //   if (idx < 0) {
    //     listFieldIdEdited.push(fields[dragIndex].fieldId)
    //   }
    // }
    // const dropIndex = fields.findIndex(e => e.fieldId === dropFieldId);
    // if (dragIndex < 0 || dropIndex < 0 || dragIndex === dropIndex) {
    //   return
    // }
    // if (_.toString(fields[dragIndex].fieldType) === DEFINE_FIELD_TYPE.TAB && _.toString(fields[dropIndex].fieldType) !== DEFINE_FIELD_TYPE.TAB) {
    //   const fieldDropId = fields[dropIndex].fieldId
    //   // const tempObject = fields.splice(dragIndex, dragFieldId.length, fields[dropIndex]);
    //   const tempObject = fields.splice(dragIndex, _.isArray(dragFieldId) ? dragFieldId.length : 1);
    //   const indexTmp = dragIndex > dropIndex ? _.findIndex(fields, function (e: any) { return e.fieldId === fieldDropId }) : _.findLastIndex(fields, function (e: any) { return e.fieldId === fieldDropId })
    //   // fields.splice(indexTmp, 1, ...tempObject);
    //   fields.splice(indexTmp + 1, 0, ...tempObject);
    // } else if ((!fields[dragIndex].inTab && _.toString(fields[dragIndex].fieldType) !== DEFINE_FIELD_TYPE.TAB)
    //   && (fields[dropIndex].inTab || _.toString(fields[dropIndex].fieldType) === DEFINE_FIELD_TYPE.TAB)) { // drag field out Tab into TabArea
    //   if (fields[dropIndex].inTab) {
    //     fields.forEach((field, idx) => {
    //       if (_.toString(field.fieldType) === DEFINE_FIELD_TYPE.TAB && field.tabData && _.isArray(field.tabData)) {
    //         const index = field.tabData.findIndex(e => e === fields[dropIndex].fieldId)
    //         if (index >= 0) {
    //           let tabData = fields[idx].tabData;
    //           if (_.isNil(tabData)) {
    //             tabData = [];
    //           }
    //           tabData.push(fields[dragIndex].fieldId);
    //           fields[idx].tabData = tabData;
    //           fields[dragIndex].inTab = true;
    //           reMakeFieldDragDrop(isDoubleColumn, fields[dragIndex], dropIndex, isAddLeft)
    //           // fields[dragIndex].isDoubleColumn = isDoubleColumn;
    //           // const tempObject = fields.splice(dragIndex, 1)[0];
    //           // fields.splice(dropIndex + 1, 0, tempObject);
    //         }
    //       }
    //     })
    //   } else {
    //     let tabData = fields[dropIndex].tabData;
    //     if (_.isNil(tabData)) {
    //       tabData = [];
    //     }
    //     tabData.push(fields[dragIndex].fieldId);
    //     fields[dropIndex].tabData = tabData;
    //     fields[dragIndex].inTab = true;
    //     fields[dragIndex].isDoubleColumn = isDoubleColumn;
    //     if (fieldTabRef && fieldTabRef.current && fieldTabRef.current.resetCurrentTab) {
    //       fieldTabRef.current.resetCurrentTab(fields[dropIndex].fieldId);
    //     }
    //     const tempObject = fields.splice(dragIndex, 1)[0];
    //     fields.splice(dropIndex + 1, 0, tempObject);
    //   }
    // } else if (fields[dragIndex].inTab && _.toString(fields[dropIndex].fieldType) === DEFINE_FIELD_TYPE.TAB) {
    //   let tabData = fields[dropIndex].tabData
    //   if (_.isNil(tabData)) {
    //     tabData = []
    //   }
    //   let exits = false;
    //   if (tabData.findIndex(o => o === fields[dragIndex].fieldId) < 0) {
    //     tabData.push(fields[dragIndex].fieldId)
    //     fields[dropIndex].tabData = tabData;
    //     fields[dragIndex].inTab = true;
    //     fields[dragIndex].isDoubleColumn = isDoubleColumn;
    //     exits = true;
    //     if (fieldTabRef && fieldTabRef.current && fieldTabRef.current.resetCurrentTab) {
    //       fieldTabRef.current.resetCurrentTab(fields[dropIndex].fieldId);
    //     }
    //   }
    //   if (exits) {
    //     fields.forEach((field, idx) => {
    //       if (idx !== dropIndex && _.toString(field.fieldType) === DEFINE_FIELD_TYPE.TAB) {
    //         if (field.tabData && _.isArray(field.tabData)) {
    //           const temp = field.tabData
    //           const index = temp.findIndex(o => o === fields[dragIndex].fieldId)
    //           if (index >= 0) {
    //             temp.splice(index, 1);
    //             fields[idx].tabData = temp;
    //           }
    //         }
    //       }
    //     })
    //   }

    // } else if (fields[dragIndex].inTab && _.toString(fields[dropIndex].fieldType) !== DEFINE_FIELD_TYPE.TAB) { // drag field in Tab to free Area
    //   fields.forEach((field, i) => {
    //     if (i !== dropIndex && _.toString(field.fieldType) === DEFINE_FIELD_TYPE.TAB) {
    //       if (field.tabData && _.isArray(field.tabData)) {
    //         const temp = field.tabData
    //         const index = temp.findIndex(o => o === fields[dragIndex].fieldId)
    //         if (index >= 0) {
    //           temp.splice(index, 1);
    //           fields[i].tabData = temp;
    //         }
    //       }
    //     }
    //   })
    //   if (!fields[dropIndex].inTab) {
    //     fields[dragIndex].inTab = false;
    //   } else {
    //     fields.forEach((field, idx) => {
    //       if (_.toString(field.fieldType) === DEFINE_FIELD_TYPE.TAB && field.tabData && _.isArray(field.tabData)) {
    //         const index = field.tabData.findIndex(e => e === fields[dropIndex].fieldId)
    //         if (index >= 0) {
    //           let tabData = fields[idx].tabData;
    //           if (_.isNil(tabData)) {
    //             tabData = [];
    //           }
    //           tabData.push(fields[dragIndex].fieldId);
    //           fields[idx].tabData = tabData;
    //         }
    //       }
    //     })
    //   }
    //   reMakeFieldDragDrop(isDoubleColumn, fields[dragIndex], dropIndex, isAddLeft)
    //   // fields[dragIndex].isDoubleColumn = isDoubleColumn;
    //   // const tempObject = fields.splice(dragIndex, 1)[0];
    //   // const dropIndexAfterSplice = fields.findIndex(e => e.fieldId === dropFieldId)
    //   // fields.splice(dropIndexAfterSplice + 1, 0, tempObject);
    // } else {
    //   reMakeFieldDragDrop(isDoubleColumn, fields[dragIndex], dropIndex, isAddLeft)
    // }
    // const objParam = sortOrderFields(fields)
    // setFields(objParam);
    // props.onChangeFields(objParam, deletedFields, listFieldIdEdited);
    processDragDropFields(fields, dragFieldId, dropFieldId, isDoubleColumn, isAddLeft, fieldTabRef, props.screenMode, props.countSave, listFieldIdEdited)
    const objParam = sortOrderFields(fields, props.task.fieldInfo)
    setFields(objParam);
    props.onChangeFields(objParam, deletedFields, listFieldIdEdited);
  }

  const onDeleteFields = (fieldInfo) => {
    // const fieldOrderMax = fieldsAfterDelete[fieldsAfterDelete.length - 1].fieldOrder;
    // fieldsAfterDelete.forEach((item, idx) => {
    //   if (item.fieldId === fieldInfo.fieldId) {
    //     if (fieldInfo.fieldType.toString() === DEFINE_FIELD_TYPE.TAB && fieldInfo.tabData) {
    //       fieldInfo.tabData.forEach((fieldId) => {
    //         const index = fieldsAfterDelete.findIndex(e => e.fieldId === fieldId);
    //         if (index >= 0) {
    //           fieldsAfterDelete[index].inTab = false;
    //           fieldsAfterDelete[index].fieldOrder = fieldOrderMax + 1 + idx;
    //         }
    //       })
    //     }
    //     if (fieldInfo.fieldType === DEFINE_FIELD_TYPE.LOOKUP && fieldInfo.lookupData || (fieldInfo.lookupData && fieldInfo.lookupData.itemReflect)) {
    //       fieldInfo.lookupData.itemReflect.forEach(e => {
    //         const itemIdx = fieldsAfterDelete.findIndex(o => o.fieldId === e.fieldId)
    //         if (itemIdx >= 0) {
    //           if (e.fieldId > 0) {
    //             deletedFields.push(e.fieldId);
    //           }
    //           fieldsAfterDelete.splice(itemIdx, 1);
    //         }
    //       })
    //     }
    //     if (fieldInfo.fieldType.toString() === DEFINE_FIELD_TYPE.RELATION && fieldInfo.relationData || (fieldInfo.relationData && fieldInfo.relationData.fieldId > 0)) {
    //       deletedFields.push(fieldInfo.relationData.fieldId);
    //     }
    //     if (fieldInfo.fieldId > 0) {
    //       deletedFields.push(fieldInfo.fieldId);
    //     }
    //     const fIdx = fieldsAfterDelete.findIndex(e => e.fieldId === item.fieldId)
    //     if (fIdx >= 0) {
    //       fieldsAfterDelete.splice(fIdx, 1);
    //     }
    //   }
    // })
    // const objParams = sortOrderFields(fieldsAfterDelete)
    // setFields(objParams);
    // const idx = listFieldIdEdited.findIndex(e => e.fieldId === props.fieldEdit.fieldId)
    // if (idx >= 0) {
    //   listFieldIdEdited.splice(idx, 1);
    // }
    // props.openDynamicSelectFields(SettingModes.CreateNewInput, null);
    // props.onChangeFields(objParams, deletedFields, listFieldIdEdited);
    const fieldsAfterDelete = _.cloneDeep(fields);
    processDeleteFields(fieldsAfterDelete, fieldInfo, deletedFields)
    const objParams = sortOrderFields(fieldsAfterDelete, props.task.fieldInfo)
    setFields(objParams);
    const idx = listFieldIdEdited.findIndex(e => e.fieldId === props.fieldEdit.fieldId)
    if (idx >= 0) {
      listFieldIdEdited.splice(idx, 1);
    }
    // props.openDynamicSelectFields(SettingModes.CreateNewInput, null);
    props.onChangeFields(objParams, deletedFields, listFieldIdEdited);
  }

  useEffect(() => {
    if (props.isSaveField) {
      const SaveFieldResult = props.onSaveField(_.cloneDeep(fields), props.paramsEdit, props.fieldEdit)
      const deleteFieldTmp = SaveFieldResult.deleteFields;
      const listFieldTmp = SaveFieldResult.listField;
      const arrFieldDel = _.cloneDeep(deletedFields)
      if (SaveFieldResult) {
        arrFieldDel.push(...deleteFieldTmp)
        setDeleteFields(arrFieldDel);
        setFields(listFieldTmp);
      }
      const idx = listFieldIdEdited.findIndex(e => e.fieldId === props.fieldEdit.fieldId)
      if (idx < 0) {
        listFieldIdEdited.push(props.fieldEdit.fieldId)
      }
      listFieldTmp.forEach((field) => {
        if (!_.isNil(field.oldField) && idx < 0) {
          listFieldIdEdited.push(field.fieldId);
        }
      })
      props.onChangeFields(listFieldTmp, arrFieldDel, listFieldIdEdited);
      props.destroySaveField();
    }
  }, [props.isSaveField])

  const onDropNewField = (dragItem, dropId, isDoubleColumn: boolean, isAddLeft: boolean) => {
    const fieldDrag = _.cloneDeep(dragItem);
    // if (fieldDrag.fieldId === null) {
    //   fieldDrag.fieldId = Math.round(Math.random() * 100000 * - 1);
    // }
    // if (_.isNil(fieldDrag.salesProcess)) {
    //   Object.assign(fieldDrag, { salesProcess: null });
    //  }
    // fieldDrag.inTab = false;
    // const dropIndex = fields.findIndex(e => e.fieldId === dropId);
    // if (_.toString(fields[dropIndex].fieldType) === DEFINE_FIELD_TYPE.TAB && _.toString(fieldDrag.fieldType) !== DEFINE_FIELD_TYPE.TAB) {
    //   let tabData = fields[dropIndex].tabData;
    //   if (!tabData) {
    //     tabData = []
    //   }
    //   tabData.push(fieldDrag.fieldId);
    //   fields[dropIndex].tabData = tabData;
    //   fieldDrag.inTab = true;
    //     if (fieldTabRef && fieldTabRef.current && fieldTabRef.current.resetCurrentTab) {
    //     fieldTabRef.current.resetCurrentTab(fields[dropIndex].fieldId);
    //   }
    // } else if (fields[dropIndex].inTab && _.toString(fieldDrag.fieldType) !== DEFINE_FIELD_TYPE.TAB) {
    //   fields.forEach((field, idx) => {
    //     if (_.toString(field.fieldType) === DEFINE_FIELD_TYPE.TAB && field.tabData && _.isArray(field.tabData)) {
    //       const index = field.tabData.findIndex(e => e === fields[dropIndex].fieldId)
    //       if (index >= 0) {
    //         const tabData = fields[idx].tabData;
    //         tabData.push(fieldDrag.fieldId);
    //         fields[idx].tabData = tabData;
    //         fieldDrag.inTab = true;
    //       }
    //     }
    //   })
    // }
    // if (_.toString(fieldDrag.fieldType) === DEFINE_FIELD_TYPE.TAB || 
    //     (_.toString(fields[dropIndex].fieldType) === DEFINE_FIELD_TYPE.TAB && 
    //     _.toString(fieldDrag.fieldType) !== DEFINE_FIELD_TYPE.TAB)) {
    //   fields.splice(dropIndex + 1, 0, fieldDrag);
    // } else {
    //   reMakeFieldDragDrop(isDoubleColumn, fieldDrag, dropIndex, isAddLeft)
    // }

    // listFieldIdEdited.push(fieldDrag.fieldId);
    // const objParams = sortOrderFields(fields)
    // setFields(objParams);
    // props.onChangeFields(objParams, deletedFields, listFieldIdEdited); 
    // props.openDynamicSelectFields(SettingModes.EditInput, fieldDrag);
    processDragNewField(fields, fieldDrag, dropId, isDoubleColumn, isAddLeft, fieldTabRef, props.screenMode, props.countSave, fieldsUnavailable)
    listFieldIdEdited.push(fieldDrag.fieldId);
    const objParams = sortOrderFields(fields, props.task.fieldInfo)
    setFields(objParams);
    props.onChangeFields(objParams, deletedFields, listFieldIdEdited);
    props.openDynamicSelectFields(SettingModes.EditInput, fieldDrag);
  }

  useImperativeHandle(ref, () => ({
    onAddNewField(field) {
      onDropNewField(field, fields[fields.length - 1].fieldId, false, false);
    }
  }));

  /**
   * open employeeId detail
   * @param employeeIdParam 
   */
  const onOpenModalEmployeeDetail = (employeeIdParam) => {
    setEmployeeId(employeeIdParam);
    setOpenPopupEmployeeDetail(true);
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

  /**
 * modify fields, add inTab
 * 
 */
  useEffect(() => {
    if (_.isNil(fields)) {
      return;
    }
    const fieldTabs = fields.filter(e => e.fieldType.toString() === DEFINE_FIELD_TYPE.TAB)
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

  // const rowRecordsListField = buildDoubleColumn(listFieldNormal);

  const onClosePopupCustomerDetail = () => {
    setOpenCustomerDetail(false);
    document.body.classList.remove("wrap-customer");
    if (!document.body.classList.contains("wrap-task")) {
      document.body.classList.add("wrap-task");
    }
  }

  const onOpenPopupCustomerDetail = customerId => {
    setOpenCustomerDetail(true);
    setCurrentCustomerId(customerId);
    document.body.classList.add("wrap-customer");
  }

  const renderTableField = (row: any[], key: any) => {
    return (
      <TabSummaryElement
        fieldsInfo={row}
        screenMode={props.screenMode}
        fieldHighlight={listFieldIdEdited}
        valueData={infoTask}
        onDragOrderField={onDragOrderField}
        onDropNewField={onDropNewField}
        openDynamicSelectFields={props.openDynamicSelectFields}
        onDeleteFields={onDeleteFields}
        fields={fields}
        onShowMessage={props.onShowMessage}
        taskId={props.taskId}
        onOpenModalEmployeeDetail={onOpenModalEmployeeDetail}
        onOpenPopupCustomerDetail={onOpenPopupCustomerDetail}
        onClickDetailMilestone={props.onClickDetailMilestone}
        onOpenModalSubTaskDetail={props.onOpenModalSubTaskDetail}
        edittingField={props.edittingField}
      />
    )
  }

  const onExecuteAction = (fieldInfo, actionType) => {
    if (actionType === DynamicControlAction.DELETE) {
      if (onDeleteFields) {
        onDeleteFields(fieldInfo)
      }
    } else if (actionType === DynamicControlAction.EDIT) {
      if (props.openDynamicSelectFields) {
        props.openDynamicSelectFields(SettingModes.EditInput, fieldInfo)
      }
    }
  }

  /**
* render relation field
* 
*/

  // const renderRelationField = (fieldRelations) => {
  //   const listFieldRelationNomal = fieldRelations.filter(e => e.displayTab !== 1);
  //   const listFieldRelationTab = fieldRelations.filter(e => e.displayTab === 1);
  //   const listFieldNomal = buildDoubleColumn(listFieldRelationNomal);
  //   return (
  //     <>
  //       {listFieldRelationNomal.lenght > 0 &&
  //         <table className="table-default table-content-div cursor-df">
  //           <tbody>
  //             {listFieldNomal.map((row, i) => {
  //               return renderTableField(row, i)
  //             }
  //             )}
  //           </tbody>
  //         </table>}
  //       {listFieldRelationTab && listFieldRelationTab.lenght > 0 &&
  //         <DynamicControlField
  //           ref={fieldTabRef}
  //           showFieldLabel={false}
  //           fieldInfo={listFieldTab[0]}
  //           listFieldInfo={fields}
  //           // renderControlContent={renderContentTab}
  //           controlType={ControlType.DETAIL_VIEW}
  //           isDisabled={!props.screenMode || props.screenMode === ScreenMode.DISPLAY}
  //           onExecuteAction={onExecuteAction}
  //           moveFieldCard={onDragOrderField}
  //           addFieldCard={onDropNewField}
  //         />}
  //     </>
  //   )
  // }

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

  const recordBefore = getSplitRecord(-1)
  const recordAfter = getSplitRecord(1);
  const recordAll = getSplitRecord(0);

  // const isExistBeforeTab = listFieldTab.length > 0 && listFieldTab[0].fieldOrder > 1
  // const isExistAfterTab = listFieldTab.length > 0 && rowRecordsListField.length > 0 && listFieldTab[listFieldTab.length - 1].fieldOrder < rowRecordsListField[rowRecordsListField.length - 1][0].fieldOrder

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

  const onClosePopupEmployeeDetail = () => {
    setOpenPopupEmployeeDetail(false);
  }

  const TabSummaryTaskDataInfo = () => {
    return (
      <div className="list-table style-3">
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
              {props.screenMode === ScreenMode.DISPLAY && <br />}
              <FieldDisplayRow
                showFieldLabel={false}
                fieldInfo={listFieldTab[0]}
                listFieldInfo={fields}
                renderControlContent={renderContentTab}
                controlType={ControlType.DETAIL_VIEW}
                isDisabled={!props.screenMode || props.screenMode === ScreenMode.DISPLAY}
                onExecuteAction={onExecuteAction}
                moveFieldCard={onDragOrderField}
                addFieldCard={onDropNewField}
                fieldIdsHighlight={listFieldIdEdited}
              />
              {props.screenMode === ScreenMode.DISPLAY && <br />}
            </>
          }
          {recordAfter &&
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
                {recordAll.map((row, i) => {
                  return renderTableField(row, i)
                }
                )}
              </tbody>
            </table>}
          <FieldDisplayRowDragLayer />
          {/* {listFieldRelation && listFieldRelation.length > 0 && renderRelationField(listFieldRelation)} */}
          {/* <FieldDetailViewRelation
            id={"RelationEmployeeId"}
            fieldInfo={null}
            controlType={ControlType.DETAIL_VIEW}
            isDisabled={!props.screenMode || props.screenMode === ScreenMode.DISPLAY}
            belong={FIELD_BELONG.EMPLOYEE}
            listFieldInfo={fields}
            elementStatus={{ fieldValue: props.task }}
            onExecuteAction={onExecuteAction}
          /> */}
        </div>

        {openPopupEmployeeDetail &&
          <>
          <PopupEmployeeDetail
            id={employeeDetailCtrlId[0]}
            showModal={true}
            employeeId={employeeId}
            listEmployeeId={[employeeId]}
            toggleClosePopupEmployeeDetail={onClosePopupEmployeeDetail}
            resetSuccessMessage={() => { }}
            openFromModal={true} />
          {props.popout && <div className="modal-backdrop fade show"/>}</>
        }
        {openCustomerDetail && <>
          <><PopupCustomerDetail
            id={customerDetailCtrlId[0]}
            showModal={true}
            customerId={currentCustomerId}
            listCustomerId={[currentCustomerId]}
            toggleClosePopupCustomerDetail={onClosePopupCustomerDetail}
            resetSuccessMessage={() => { }}
            isOpenCustomerDetailNotFromList={true}
          />
          {props.popout && <div className="modal-backdrop fade show"/>}</>
        </>}
      </div>
    );
  }
  return (
    TabSummaryTaskDataInfo()
  );
})

export default TabSummary;
