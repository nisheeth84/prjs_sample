import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { ITEM_TYPE } from '../../constants'
import TabSummaryElement from './popup-detail-tab-summary-element';
import _ from 'lodash';
import * as R from 'ramda'
import { TAB_ID_LIST } from '../../constants';
import { translate } from 'react-jhipster';
import { SettingModes } from '../../../../shared/layout/dynamic-form/control-field/dynamic-select-field';
import { DEFINE_FIELD_TYPE, DynamicControlAction } from 'app/shared/layout/dynamic-form/constants';
import { ControlType, ScreenMode } from 'app/config/constants';
import FieldDisplayRow, { FieldDisplayRowDragLayer } from 'app/shared/layout/dynamic-form/control-field/view/field-display-row';
import { sortOrderFields, buildDoubleColumn, processDragDropFields, processDeleteFields, processDragNewField, isFieldDisplayNormal } from 'app/shared/util/utils';
import TabGroups from './popup-detail-tab-groups'
import Popover from 'app/shared/layout/common/Popover';
import TabDisplaySetting from 'app/shared/layout/common/tab-display-setting';
import StringUtils, { firstChar, getEmployeeImageUrl, getFieldLabel } from 'app/shared/util/string-utils';
import { utcToTz, DATE_TIME_FORMAT } from 'app/shared/util/date-utils';
import { CURRENCY } from 'app/modules/products/constants';
import GridCalendar from 'app/modules/calendar/grid/calendar-grid';
import { connect, Options } from 'react-redux';
import {
  showListGrid,
  handleInitData,
  onChangeLocalNavigation,
  optionShowAll,
  onChangeDateShow
} from 'app/modules/calendar/grid/calendar-grid.reducer'; 
import { CalenderViewMonthCommon } from 'app/modules/calendar/grid/common';
import { CalendarView } from 'app/modules/calendar/constants';
import EmployeeTabChangeHistory from 'app/modules/employees/popup-detail/popup-detail-tabs/popup_detail_tab_change_history';

const LIST_TXT_STATUS = [
  '未着手',
  '着手中',
  '完了'
]


export interface IPopupTabSummary extends DispatchProps {
  iconFunction?: string,
  showModal?: boolean;
  employee: any;
  screenMode: any;
  conditionSearch?: any[],
  handleReorderField: (dragIndex, dropIndex) => void;
  onChangeFields?: (fields: any[], deletedFields: any[], editFields: any[]) => void;
  summaryFields?: any;
  editedFields?: any[];
  openDynamicSelectFields: (settingMode, fieldEdit) => void;
  tabList?: any;
  isSaveField?: boolean;
  destroySaveField?: () => void;
  fieldEdit: any;
  paramsEdit: any;
  onShowMessage?: (message, type) => void;
  onSaveField?: (fields, params, fieldEdit) => {listField, deleteFields};
  employeeId?: any;
  countSave?: any;
  employeeAllFields?: any;
  deletedFields?: any[];
  edittingField: any;
  fieldsUnavailable: any[];
  timeLineGroup: any[]
  onSelectDisplaySummary?: any;

}

const TabSummary = forwardRef((props: IPopupTabSummary, ref) => {
// const TabSummary = (props: IPopupTabSummary) => {
  const [, setFirst] = useState(false);
  const [, setShouldRender] = useState(false);
  const [fields, setFields] = useState([]);
  const [deletedFields, setDeleteFields] = useState([]);
  const [listFieldNormal, setListFieldNormal] = useState([]);
  const [listFieldTab, setListFieldTab] = useState([]);
  const [listFieldIdEdited, setListFieldIdEdited] = useState([]);
  const [fieldsUnavailable, setFieldsUnavailable] = useState([])
  
  const fieldTabRef = useRef(null)

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
    if(!props.summaryFields) {
      props.onChangeFields(_.cloneDeep(props.employee.fields), [], []);
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
    if (props.fieldsUnavailable) {
      setFieldsUnavailable(props.fieldsUnavailable)
    }
  }, [props.fieldsUnavailable])

  useEffect(() => {
    setDeleteFields(props.deletedFields)
  }, [props.deletedFields])

  useEffect(() => {
    if (props.employee) {
      let listField = null
      if (props.screenMode === ScreenMode.EDIT) {
        listField = props.summaryFields ? props.summaryFields.sort((a, b) => {return (a.fieldOrder - b.fieldOrder)}) : _.cloneDeep(props.employee.fields.sort((a, b) => {return (a.fieldOrder - b.fieldOrder)}))
      } else {
        listField = _.cloneDeep(props.employee.fields.sort((a, b) => {return (a.fieldOrder - b.fieldOrder)}));
        setListFieldIdEdited([]);
      }
      const tmp = []
      if (!_.isNil(listField)) {
        tmp.push(...listField.filter( e => isFieldCanDisplay(e)));
      }
      setFields(sortOrderFields(tmp, props.employeeAllFields.fields))
    }
  }, [props.employee, props.summaryFields, props.screenMode]);

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


    /**
   * useEffect for TabSummaryElementCalendar init
   */
  useEffect(() => {
    props.optionShowAll(false);
    props.showListGrid(true)
    props.onChangeDateShow(
      CalenderViewMonthCommon.nowDate(),
      0,
      CalendarView.Month,
      true
    );
  }, []);

  useEffect(() => {
    const listField = sortOrderFields(props.summaryFields ? props.summaryFields.sort((a, b) => {return (a.fieldOrder - b.fieldOrder)}) : _.cloneDeep(props.employee.fields.sort((a, b) => {return (a.fieldOrder - b.fieldOrder)})), props.employeeAllFields.fields)
    setFields(listField.filter( e => isFieldCanDisplay(e)))
  }, [props.summaryFields])

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

  const getMaxItemShowInList = (tabId, arrayItem) => {
    try {
      let pathData = '';
      switch (tabId) {
        case TAB_ID_LIST.task:
          pathData = R.path(["data", "dataInfo", "tasks"]);
          break;
        case TAB_ID_LIST.tradingProduct:
          pathData = R.path(["data", "dataInfo", "productTradings"]);
          break;
        case TAB_ID_LIST.changeHistory:
          // TabSummaryElementChangeHistory
          pathData = R.path(["data", "customersHistory"]);
          break;
        // case TAB_ID_LIST.activityHistory:
        //   pathData = R.path(["data", "activities"]);
          break;
        default:
          break;
      }
      return R.compose(
        pathData,
        R.find(tab => tab.tabId === tabId)
      )(arrayItem);
    } catch (error) {
      return [];
    }
  }


  const onDragOrderField = (dragFieldId, dropFieldId, isDoubleColumn: boolean, isAddLeft: boolean) => {
    processDragDropFields(fields, dragFieldId, dropFieldId, isDoubleColumn, isAddLeft, fieldTabRef, props.screenMode, props.countSave, listFieldIdEdited)
    const objParam = sortOrderFields(fields, props.employeeAllFields.fields)
    setFields(objParam);
    props.onChangeFields(objParam, deletedFields, listFieldIdEdited);
  }

  const onDeleteFields = (fieldInfo) => {
    const fieldsAfterDelete = _.cloneDeep(fields);
    processDeleteFields(fieldsAfterDelete, fieldInfo, deletedFields)
    const objParams = sortOrderFields(fieldsAfterDelete, props.employeeAllFields.fields)
    setFields(objParams);
    const idx = listFieldIdEdited.findIndex( e => e.fieldId === props.fieldEdit.fieldId)
    if (idx >= 0) {
      listFieldIdEdited.splice(idx, 1);
    }
    // props.openDynamicSelectFields(SettingModes.CreateNewInput, null);
    props.onChangeFields(objParams, deletedFields, listFieldIdEdited);
  }

  const onDropNewField = (dragItem, dropId, isDoubleColumn: boolean, isAddLeft: boolean) => {
    const fieldDrag = _.cloneDeep(dragItem);
    processDragNewField(fields, fieldDrag, dropId, isDoubleColumn, isAddLeft, fieldTabRef, props.screenMode, props.countSave, fieldsUnavailable)
    listFieldIdEdited.push(fieldDrag.fieldId);
    const objParams = sortOrderFields(fields, props.employeeAllFields.fields)
    setFields(objParams);
    props.onChangeFields(objParams, deletedFields, listFieldIdEdited); 
    props.openDynamicSelectFields(SettingModes.EditInput, fieldDrag);
  }

  useImperativeHandle(ref, () => ({
    onAddNewField(field) {
      onDropNewField(field, fields[fields.length - 1].fieldId, false, false);
    }
  }));

  // const TabSummaryElementCustomer = () => {
  //   const valueDataCustomer = getMaxItemShowInList(TAB_ID_LIST.customer, props.employee.dataCustomers.dataInfo, props.employee.tabsInfo);
  //   return (
  //     <>
  //       <p className="font-weight-500 mt-4">{translate('employees.detail.label.tab.customer')}</p>
  //       <table className="table-list table">
  //         <thead>
  //           <tr>
  //             <th className="w12">{translate('employees.detail.label.customerName')}</th>
  //             <th className="w12">{translate('employees.detail.label.createdDate')}</th>
  //             <th className="w12">{translate('employees.detail.label.industry')}</th>
  //             <th>{translate('employees.detail.label.address')}</th>
  //             <th className="w12">{translate('employees.detail.label.phoneNumber')}</th>
  //             <th className="w12">{translate('employees.detail.label.faxNumber')}</th>
  //           </tr>
  //         </thead>
  //         <tbody>
  //           {valueDataCustomer.map((customer) => {
  //             return (
  //               <tr key={customer.customerId}>
  //                 <td><a href="#">{customer.customerName}</a></td>
  //                 <td>{customer.createdDate}</td>
  //                 <td>{customer.industryType}</td>
  //                 <td><a href="#">{customer.address}</a></td>
  //                 <td>{customer.telephoneNumber}</td>
  //                 <td>{customer.faxNumber}</td>
  //               </tr>
  //             )
  //           })
  //           }
  //         </tbody>
  //       </table>
  //     </>
  //   );
  // }

  // const TabSummaryElementBusinessCard = () => {
  //   const valueDataBusinessCard = getMaxItemShowInList(TAB_ID_LIST.businessCard, props.employee.dataBusinessCards.dataInfo, props.employee.tabsInfo);
  //   const [showPreview, setShowPreview] = useState(false);

  //   const showPreviewImage = () => {
  //     setShowPreview(!showPreview);
  //   }

  //   let imageUrl = null;
  //   let businessName = null;

  //   return (
  //     <>
  //       <label>{translate('employees.detail.label.tab.businessCard')}</label>
  //       <table className="table-list table-list-has-border-left-right business-card-table">
  //         <thead>
  //           <tr>
  //             <th className="align-center">{translate('employees.detail.label.businessCardImage')}</th>
  //             <th className="align-center">{translate('employees.detail.label.customerNameBusinessCardName')}</th>
  //             <th className="align-center">{translate('employees.detail.label.departmentTitle')}</th>
  //             <th>{translate('employees.detail.label.contactInformation')}</th>
  //             <th className="align-center">{translate('employees.detail.label.address')}</th>
  //           </tr>
  //         </thead>
  //         <tbody>
  //           {valueDataBusinessCard.map((businessCard, indexbusinessCard) => {
  //             imageUrl = businessCard.businessCardImage.businessCardImagePath;
  //             businessName = businessCard.firstName + businessCard.lastName;
  //             return (
  //               <tr key={indexbusinessCard}>
  //                 <td align="center">
  //                   <div>
  //                     <img onClick={showPreviewImage} src={imageUrl} />
  //                   </div>
  //                   <div className="group2"></div>
  //                 </td>
  //                 <td align="center">
  //                   <a href="#">{businessCard.customerName}</a><br />
  //                   <a href="#">{businessName}</a>
  //                 </td>
  //                 <td>
  //                   {businessCard.departmentName} <br />
  //                   {businessCard.titleName}
  //                 </td>
  //                 <td>
  //                   <div>{businessCard.phoneNumber}</div>
  //                   <div>{businessCard.mobileNumber}</div>
  //                   <div>
  //                     <a href={'mailto:' + businessCard.email}>{businessCard.email}</a>
  //                   </div>
  //                 </td>
  //                 <td>
  //                   <div>
  //                     <a href="#">{businessCard.prefecture}</a><br />
  //                     <a href="#">{businessCard.addressUnderPrefecture}</a><br />
  //                     <a href="#">{businessCard.building}</a>
  //                   </div>
  //                 </td>
  //               </tr>
  //             )
  //           })
  //           }

  //         </tbody>
  //       </table>
  //       {showPreview === true &&
  //         <div className="popup-employee-slider" id="popup-esr2">
  //           <div className="item">
  //             <div className="popup-employee-content">
  //               <img src={imageUrl}></img>
  //               <div className="bottom">
  //                 <div className="font-size-7">{businessName}</div>
  //               </div>
  //             </div>
  //           </div>
  //           <div className="control">
  //             <a title="" href="#" ><i className="button next"></i></a>
  //             <a title="" href="#" ><i className="button prev"></i></a>
  //           </div>
  //           <button type="button" onClick={showPreviewImage} className="close" data-dismiss="modal">×</button>
  //         </div>}
  //       {showPreview === true && <div className="modal-backdrop2 show"></div>}
  //     </>
  //   );
  // }
  const getTabDisplaySetting = (tabId, arrayItem) => {
    try {
      return R.compose(
        R.find(tab => tab.tabId === tabId)
      )(arrayItem);
    } catch (error) {
      return [];
    }
  }

  const TabSummaryElementCalendar = (index) => {
    const dataTabDisplaySetting = getTabDisplaySetting(TAB_ID_LIST.calendar, props.employee.tabsInfo);
    return (
      <div key={index}>
        {(dataTabDisplaySetting.isDisplaySummary || props.screenMode === ScreenMode.EDIT)
          && <label className="color-333 font-weight-500 mt-4 mb-2">{translate('businesscards.detail.label.title.calendar')}</label>}
        {props.screenMode === ScreenMode.EDIT && (
          <TabDisplaySetting item={...dataTabDisplaySetting} onSelectDislaySummary={props.onSelectDisplaySummary} isListType={true} />
        )}
        {dataTabDisplaySetting.isDisplaySummary && (
          <GridCalendar modeView={true} />
        )}
      </div>
    )
  }


  // const TabSummaryElementCalendar = () => {
  //   const valueDataCalendar = getMaxItemShowInList(TAB_ID_LIST.calendar, props.employee.dataCalendar, props.employee.tabsInfo);

  //   const parseTime = (number) => {
  //     if (number < 10) {
  //       return (
  //         '0' + number
  //       )
  //     } else {
  //       return number;
  //     }
  //   }


  //   const checkConditionShowIcon = (participationDivision, attendanceDivision, item) => {
  //     switch (participationDivision) {
  //       case '00':
  //         return <td className="calendar-style1">{item.itemName}</td>
  //       case '01':
  //         return <td className="calendar-style8">{item.itemName}</td>
  //       default:
  //         break;
  //     }

  //     switch (attendanceDivision) {
  //       case '00':
  //         return <td className="calendar-style2">{item.itemName}</td>
  //       case '01':
  //         return <td className="calendar-style1">{item.itemName}</td>
  //       case '02':
  //         return <td className="calendar-style3">{item.itemName}</td>
  //       default:
  //         break;
  //     }
  //   }

  //   return (
  //     <>
  //       <div className="tab-pane active">
  //         <p>{translate('employees.detail.label.tab.calendar')}</p>
  //         <table className="table-default table-calendar-employee">
  //           <tbody>
  //             {valueDataCalendar.map((dataCalendar) => {
  //               let numRow = dataCalendar.itemList.length;
  //               let isMultiRow = true;
  //               const date = new Date(dataCalendar.date);
  //               return (

  //                 dataCalendar.itemList.map((item) => {
  //                   if (item.itemType === ITEM_TYPE.itemTypeSchedule) {
  //                     const startDate = new Date(item.startDate);
  //                     const endDate = new Date(item.endDate);
  //                     const startTime = parseTime(startDate.getHours()) + ':' + parseTime(startDate.getMinutes());
  //                     const endTime = parseTime(endDate.getHours()) + ':' + parseTime(endDate.getMinutes());
  //                     if (numRow > 1 && isMultiRow) {
  //                       numRow = numRow - 1;
  //                       isMultiRow = false;
  //                       return (
  //                         <>
  //                           <tr>
  //                             <td rowSpan={dataCalendar.itemList.length}><span className="date">{date.getMonth() + 1}月{date.getDate()}日</span></td>
  //                             <td>{startTime}~{endTime}</td>
  //                             {checkConditionShowIcon(item.participationDivision, item.attendanceDivision, item)}
  //                           </tr>
  //                         </>
  //                       )
  //                     } else if (numRow === 1 && isMultiRow) {
  //                       return (
  //                         <>
  //                           <tr>
  //                             <td rowSpan={1}><span className="date">{new Date(dataCalendar.date).getMonth() + 1}月{new Date(dataCalendar.date).getDate()}日</span></td>
  //                             <td>{startTime}~{endTime}</td>
  //                             {checkConditionShowIcon(item.participationDivision, item.attendanceDivision, item)}
  //                           </tr>
  //                         </>
  //                       )
  //                     } else if (numRow === 1 && !isMultiRow) {
  //                       return (
  //                         <>
  //                           <tr>
  //                             <td>{startTime}~{endTime}</td>
  //                             {checkConditionShowIcon(item.participationDivision, item.attendanceDivision, item)}
  //                           </tr>
  //                         </>
  //                       )
  //                     }
  //                   }
  //                 })
  //               )
  //             })}
  //           </tbody>
  //         </table>
  //       </div>
  //     </>
  //   );
  // }

  const renderEmployeeCard = (employee, classCard?) => {
    const name = `${employee.employeeSurname ? (employee.employeeName ? employee.employeeSurname + ' ' + employee.employeeName : employee.employeeSurname) : ''}`;
    return (
      <div className={`item ${classCard || ''}`}>
        <a
        //  onClick={() => props.showPopupEmployeeDetail(employee.employeeId)}
         >
          {employee.fileUrl
            ? <img src={employee.fileUrl} alt="" className="user border-0" />
            : <div className={"no-avatar green"}>
              {name.charAt(0)}
            </div>
          }
          <span className="text-blue font-size-12">{name}</span>
        </a>
      </div>
    )
  }
  const TabSummaryElementTask = (index) => {
    const valueDataTask = getMaxItemShowInList(TAB_ID_LIST.task, props.employee.dataTabs);
    const dataTabDisplaySetting = getTabDisplaySetting(TAB_ID_LIST.task, props.employee.tabsInfo);
    return (
      <>
        <div key={index}>
          {(dataTabDisplaySetting.isDisplaySummary && valueDataTask && valueDataTask.length > 0 || props.screenMode === ScreenMode.EDIT)
            && <label className="color-333 font-weight-500 mt-4 mb-2">{translate('customers.detail.label.tab.task')}</label>}
          {props.screenMode === ScreenMode.EDIT && (
            <TabDisplaySetting item={...dataTabDisplaySetting} onSelectDislaySummary={props.onSelectDisplaySummary} isListType={true} />
          )}
          {valueDataTask && valueDataTask.length > 0 &&
            <table className="table-thead-background table-content">
              <thead>
                <tr>
                  <th>{translate('customers.detail.label.deadline')}</th>
                  <th>{translate('customers.detail.label.taskName')}</th>
                  <th>{translate('customers.detail.label.customerName')}</th>
                  <th>{translate('customers.detail.label.productName')}</th>
                  <th>{translate('customers.detail.label.status')}</th>
                  <th>{translate('customers.detail.label.personInCharge')}</th>
                </tr>
              </thead>
              <tbody>
                {valueDataTask.map((task) => {
                  return (
                    <tr key={task.taskId}>
                      <td>
                        <Popover x={-20} y={25}><span className="date">{utcToTz(task.finishDate + '', DATE_TIME_FORMAT.User).split(' ')[0]}</span></Popover>
                      </td>
                      <td>
                        <Popover x={-20} y={25}><a 
                        // onClick={() => props.showAnyDetail(task.taskId, TYPE_DETAIL_MODAL.TASK)}
                        >{task.taskName}</a></Popover>
                      </td>
                      <td>
                        <Popover x={-20} y={25}>
                          {task.customers && task.customers.length > 0 && task.customers.map((item, idx) => {
                            return (
                              <>
                                 <a 
                                //  onClick={() => props.showAnyDetail(item.customerId, TYPE_DETAIL_MODAL.CUSTOMER)}
                                 >{item.customerName}</a>
                                {idx < task.customers.length - 1 && translate('commonCharacter.comma')}
                              </>
                        
                            )
                          })
                          }
                        </Popover>
                      </td>
                      <td>
                        <Popover x={-20} y={25}>
                          {task.productTradings && task.productTradings.map((item, idx) => {
                            return (
                              <React.Fragment key={idx}>
                                <a 
                                // onClick={() => props.showAnyDetail(item.productId, TYPE_DETAIL_MODAL.PRODUCT)}
                                >{item.productName}</a>
                                {idx < task.productTradings.length - 1 && translate('commonCharacter.comma')}
                              </React.Fragment>
                            )
                          })
                          }
                        </Popover>
                      </td>
                      <td><Popover x={-20} y={25}>{LIST_TXT_STATUS[task.statusTaskId ? task.statusTaskId - 1 : 0]}</Popover></td>
                      <td>
                        <Popover x={-20} y={25}>
                          {task.operators && task.operators.employees && (
                            <>
                              {renderEmployeeCard(task.operators.employees[0], "d-inline-block mr-3")}
                              <div className="position-relative d-inline-block">
                                {task.operators.employees.length > 1 &&
                                  <a className="text-blue" 
                                  // onClick={() => setIsShowAllPersonInCharge(true)}
                                  >
                                    {translate('customers.detail.label.show-more', { count: task.operators.employees.length - 1 })}
                                  </a>}
                                {/* {isShowAllPersonInCharge && showAllPersonInCharge(task.operators.employees)} */}
                              </div>
                            </>
                          )}
                        </Popover>
                      </td>
                    </tr>
                  )
                })
                }
              </tbody>
            </table>
          }
        </div>
      </>
    );
  }
  // const TabSummaryElementGroup = () => {
  //   const valueDataGroup = getMaxItemShowInList(TAB_ID_LIST.groups, props.employee.dataGroups.data.groups, props.employee.tabsInfo);
  //   return (
  //     <>
  //       <label>{translate('employees.detail.label.tab.group')}</label>
  //       <div className="note-group-wrap row">
  //         {valueDataGroup.map((group) => {
  //           let isInListFavorite = false;
  //           return (
  //             <div key={group.groupId} className="col-md-6">
  //               <div className="note-group-item-wrap">
  //                 <div className="note-group-item">
  //                   <div className="img"><img src={group.image.groupImg} alt="" /></div>
  //                   <div className="content">
  //                     <div className="date">{translate('employees.detail.label.postedDate')}:{group.createdDate}
  //                       <div className="vote">
  //                         {props.employee.dataListFavoriteGroup.data.groupId.map((groupFavorite) => {
  //                           if (groupFavorite.groupId === group.groupId) {
  //                             isInListFavorite = true;
  //                             return (
  //                               <>
  //                                 <img src="../../content/images/ic-star.svg" alt="" />
  //                               </>
  //                             )
  //                           }
  //                         })}
  //                         {isInListFavorite === false && <img src="../../content/images/ic-stargray.svg" alt="" />}
  //                         <a href="#" className="button-activity-registration">{translate('employees.detail.label.button.participate')}</a>
  //                       </div>
  //                     </div>
  //                     <a href='#' className="name-group">{group.groupName}</a>
  //                     <p className="describe">{group.note}</p>
  //                   </div>
  //                 </div>
  //                 <div className="user">
  //                   {group.employees.map((item, idx) => {
  //                     return (
  //                       props.employee.dataGroups.data.employees.map((employee) => {
  //                         if (employee.employeeId === item.employeeId && idx < 10) {
  //                           return (
  //                             <>
  //                               <img src={employee.employeeIcon.filePath} alt="" />
  //                             </>
  //                           )
  //                         }
  //                       })
  //                     )
  //                   })}
  //                   {group.employees.length < 10 ? <img src="../../content/images/ic-user.svg" alt="" /> : <div className="more">+3</div>}
  //                 </div>
  //               </div>
  //             </div>
  //           )
  //         })}
  //       </div>
  //     </>
  //   )
  // }

  const getCustomerName = (productTrading) => {
      return <a className="color-blue" 
      // onClick={props.showCustomerDetail(productTrading)}
      >
        <Popover x={-20} y={25}>{productTrading.customerName}</Popover>
      </a>
  }

 

  const getMaxItemsShowInList = (tabId, arrayItem) => {
    try {
      let pathData = '';
      switch (tabId) {
        case TAB_ID_LIST.task:
          pathData = R.path(["data", "dataInfo", "tasks"]);
          break;
        case TAB_ID_LIST.tradingProduct:
          pathData = R.path(["data", "dataInfo", "productTradings"]);
          break;
        case TAB_ID_LIST.changeHistory:
          pathData = R.path(["data", "customersHistory"]);
          break;
        // case TAB_ID_LIST.activityHistory:
        //   pathData = R.path(["data", "activities"]);
        //   break;
        default:
          break;
      }
      return R.compose(
        pathData,
        R.find(tab => tab.tabId === tabId)
      )(arrayItem);
    } catch (error) {
      return [];
    }
  }

  const getDisplayEmployeeName = (emp) => {
    return `${emp.employeeSurname} ${emp.employeeName || ''}`;
  }

  const getPersionInCharge = (productTrading) => {
    const employee = R.path(['employee'], productTrading);
    const char = firstChar(R.path(['employeeName'], employee));
    const url = getEmployeeImageUrl(employee);
    return <>
      {employee &&
        <div className="item form-inline">
          {url ? <a className="avatar"><img className="user" src={url} /></a> : <a tabIndex={-1} className="no-avatar green">{char}</a>}
          <a className="d-inline-block text-ellipsis file max-calc45" 
          // onClick={() => handleMoveScreen(R.path(['employeeId'], employee))}
          >
            <Popover x={-20} y={25}>
              {getDisplayEmployeeName(employee)}
            </Popover>
          </a>
          {/* {openPop && renderPopupEmployeeDetail()} */}
        </div>
      }
    </>
  }

  /**
   * Tab Summary Element Change History
   */
  const TabSummaryElementChangeHistory = (index) => {
    // TODO: Wait api get changeHistory in api get employee
    const valueDataChangeHistory = getMaxItemShowInList(TAB_ID_LIST.changeHistory, props.employee.dataTabs);
    const dataTabDisplaySetting = getTabDisplaySetting(TAB_ID_LIST.changeHistory, props.employee.tabsInfo);
    return (
      <div key={index}>
        {(dataTabDisplaySetting.isDisplaySummary && valueDataChangeHistory && valueDataChangeHistory.length > 0 || props.screenMode === ScreenMode.EDIT)
          && <label className="color-333 font-weight-500 mt-4 mb-2">{translate('customers.detail.label.tab.changeHistory')}</label>}
        {props.screenMode === ScreenMode.EDIT && (
          <TabDisplaySetting item={...dataTabDisplaySetting} onSelectDislaySummary={props.onSelectDisplaySummary} isListType={true} />
        )}
        {valueDataChangeHistory && valueDataChangeHistory.length > 0 &&
          <EmployeeTabChangeHistory
          employeeName={props.employee.employee?.employeeName ? props.employee.employee?.employeeName : ''}
            valueDataChangeHistoryInTabSummary={valueDataChangeHistory}
          />
        }
      </div>
    );
  }

  const TabSummaryElementTradingProduct = (index, isSpecialItem) => {
    const valueDataTradingProduct = getMaxItemsShowInList(TAB_ID_LIST.tradingProduct, props.employee.dataTabs);
    const dataTabDisplaySetting = getTabDisplaySetting(TAB_ID_LIST.tradingProduct, props.employee.tabsInfo);
    let total = 0;
    let isRenderTable = true;
    if (!valueDataTradingProduct || !_.isArray(valueDataTradingProduct) || valueDataTradingProduct.length < 1) {
      isRenderTable = false;
    }
    isRenderTable && valueDataTradingProduct.forEach((product) => {
      total += product.amount;
    })
    return (
      <div key={index}>
        {(dataTabDisplaySetting.isDisplaySummary && isRenderTable || props.screenMode === ScreenMode.EDIT)
          && !isSpecialItem && <label className="color-333 font-weight-500 mt-4 mb-2">{translate('customers.detail.label.tab.tradingProduct')}</label>}
        {props.screenMode === ScreenMode.EDIT && (
          <TabDisplaySetting item={...dataTabDisplaySetting} 
          onSelectDislaySummary={props.onSelectDisplaySummary}
           isListType={true} />
        )}
        {
        isRenderTable && <table className={isSpecialItem ? 'table-thead-background table-content table-layout-fixed mt-5' : 'table-layout-fixed table-thead-background table-content'}>
          <thead>
            {isSpecialItem && <tr><th colSpan={7}>{translate('customers.detail.label.tab.tradingProduct')}</th></tr>}
            <tr>
              <th>{translate('customers.detail.label.product')}</th>
              <th>{translate('customers.detail.label.customerName')}</th>
              <th>{translate('customers.detail.label.customerContactPerson')}</th>
              <th>{translate('customers.detail.label.personInCharge')}</th>
              <th>{translate('customers.detail.label.progress')}</th>
              <th>{translate('customers.detail.label.completionDate')}</th>
              <th>
                <div>{translate('customers.detail.label.amountOfMoney')}</div>
                <div>
                  {translate('customers.detail.label.total')}<span className="text-align-right">{StringUtils.numberFormat(total)}{CURRENCY}</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {valueDataTradingProduct.map((product, indexProduct) => {
              return (
                <tr key={indexProduct}>
                  {/* // đang view chi tiết thì disable đi */}
                  <td><a>{product.productName}</a></td>
                  <td>{getCustomerName(product)}</td>
                  <td><a>{product.businessCardName}</a></td>
                  <td>{getPersionInCharge(product)}</td>
                  <td>{getFieldLabel(product, 'progressName')}</td>
                  <td>
                    <Popover x={-20} y={25}>
                      <span className="date">{product.endPlanDate && utcToTz(product.endPlanDate + '', DATE_TIME_FORMAT.User).split(' ')[0]}</span>
                    </Popover>
                  </td>
                  <td className="text-right">{StringUtils.numberFormat(product.amount)}{CURRENCY}</td>
                </tr>
              )
            })
            }
          </tbody>
        </table>
        }
      </div>
    );
  }

  /**
 * modify fields, add inTab
 * 
 */
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

  // const rowRecordsListField = buildDoubleColumn(listFieldNormal);

  const renderTableField = (row: any[], key: any) => {
    return (
      <TabSummaryElement 
        fieldsInfo={row}
        screenMode={props.screenMode}
        fieldHighlight={listFieldIdEdited}
        valueData={props.employee.data}
        onDragOrderField={onDragOrderField}
        onDropNewField={onDropNewField}
        openDynamicSelectFields={props.openDynamicSelectFields}
        onDeleteFields={onDeleteFields}
        fields={fields}
        onShowMessage={props.onShowMessage}
        employeeId={props.employeeId}
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
        <TabGroups data = {props.timeLineGroup} />
      </div>
      {props.tabList.map((item, idx) => {
    
        // if (item.tabId === TAB_ID_LIST.activityHistory) {
        //   return (<>{TabSummaryElementActivityHistory(item.tabId)}</>)
        // }
        // if (item.tabId === TAB_ID_LIST.contactHistory && item.isDisplaySummary) {
        //   return (<>{TabSummaryElementContactHistory()}</>)
        // }
        if (item.tabId === TAB_ID_LIST.tradingProduct) {
          return (<>{TabSummaryElementTradingProduct(item.tabId, false)}</>)
        }
        // if (item.tabId === TAB_ID_LIST.calendar && item.isDisplaySummary) {
        //   return (<>{TabSummaryElementSchedule()}</>)
        // }
        else if (item.tabId === TAB_ID_LIST.task) {
          return (<>{TabSummaryElementTask(item.tabId)}</>)
        }
        // if (item.tabId === TAB_ID_LIST.mail && item.isDisplaySummary) {
        //   return (<>{TabSummaryElementMail()}</>)
        // }
        else if (item.tabId === TAB_ID_LIST.changeHistory) {
          return (<>{TabSummaryElementChangeHistory(item.tabId)}</>)
        }
        if (item.tabId === TAB_ID_LIST.calendar) {
          return (<>{TabSummaryElementCalendar(item.tabId)}</>)
        }
      })}
    </>
  );
})

const mapDispatchToProps = {
  showListGrid,
  handleInitData,
  onChangeLocalNavigation,
  optionShowAll,
  onChangeDateShow
};
const options = { forwardRef: true };
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  null,
  mapDispatchToProps,
  null,
  options as Options
)(TabSummary);
