import React, { useState, useEffect, useRef } from 'react';
import DynamicList from 'app/shared/layout/dynamic-form/list/dynamic-list';
import { FieldInfoType, DEFINE_FIELD_TYPE } from 'app/shared/layout/dynamic-form/constants';
import _ from 'lodash';
import { TAB_ID_LIST, TypeGetTaskByIdService, ConditionRange, ConditionScope } from 'app/shared/layout/popup-detail-service-tabs/constants';
import { RECORD_PER_PAGE_OPTIONS } from 'app/shared/util/pagination.constants';
import PaginationList from '../paging/pagination-list';
import { IRootState } from 'app/shared/reducers';
import { handleInitTaskTab } from './popup-detail-tab.reducer';
import { connect } from 'react-redux';
import * as R from 'ramda'
import { translate } from 'react-jhipster';
import Popover from 'app/shared/layout/common/Popover';
import { ScreenMode, FIELD_BELONG, ControlType } from 'app/config/constants';
import { DEFINE_FIELD_NAME_TASK, STATUS_TASK, IS_PUBLIC } from 'app/modules/tasks/constants';
import DetailTaskModal from 'app/modules/tasks/detail/detail-task-modal';
import DetailMilestoneModal from 'app/modules/tasks/milestone/detail/detail-milestone-modal';
import { checkOverdueComplete } from '../common/suggestion/tag-auto-complete-task/helper';
import { formatDate } from 'app/shared/util/date-utils';
import { isNullOrUndefined } from 'util';
import { getValueProp } from 'app/shared/util/entity-utils';
import EmployeeMoreTask from './employee-more-task';
import { getFullName, firstChar } from 'app/shared/util/string-utils';
import { TYPE_DETAIL_MODAL } from 'app/modules/activity/constants';
import useEventListener from 'app/shared/util/use-event-listener';
import { isMouseOnRef } from 'app/shared/util/utils';

interface IPopupDetailServiceTabTask extends StateProps, DispatchProps {
  fieldInfo?: any;
  customerId?: any;
  typeTaskTab: TypeGetTaskByIdService;
  conditionSearch?: any[],
  //   handleReorderField?: (dragIndex, dropIndex) => void;
  //   screenMode?: any,
  taskFields?: any
  employeeIds?: any[]
  customerChild?: any[];
  searchScope?: number;
  searchRange?: number;
  //   onChangeFields?: (value) => void;
  showCustomerDetail?: (nextId, prevId) => void;
  showAnyDetail?: (id, type) => void;
}
/**
 * Render component tab Task
 * @param props
 */
const PopupDetailServiceTabTask = (props: IPopupDetailServiceTabTask) => {
  const [fields, setFields] = useState([]);

  const [limit, setLimit] = useState(RECORD_PER_PAGE_OPTIONS[1]);
  const [offset, setOffset] = useState(0);
  const paramTmp = {
    customerIds: [],
    employeeIds: props.employeeIds || [],
    limit,
    offset,
    orderBy: [],
    filterByUserLoginFlg: 0,
    filterConditions: []
  }

  const [param, setParam] = useState(null)

  const [selectedTask, setSelectedTask] = useState(null);
  const [openModalDetailTask, setOpenModalDetailTask] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [openModalDetailMilestone, setOpenModalDetailMilestone] = useState(false);
  const [selectedSubTasks, setSelectedSubTask] = useState(null);
  const [openModalDetailSubTask, setOpenModalDetailSubTask] = useState(false);
  const [bodyClassName, setBodyClassName] = useState(null); // body's className
  const [isFirstOpen,] = useState(true); // first time opening from detail modal
  const employeeIdViewDetail = props.employeeIds && props.employeeIds[0];
  const [isShowAllPersonInCharge, setIsShowAllPersonInCharge] = useState(false);
  const [taskIdShowPersonInCharge, setTaskIdShowPersonInCharge] = useState(null);
  const personInChargeRef = useRef(null);

  useEffect(() => {
    let customerIds = props.customerId && [props.customerId];
    let loginFlag = false;
    if (props.searchRange === ConditionRange.ThisAndChildren) {
      let customerChild = [];
      if (props.customerChild) {
        customerChild = props.customerChild.map(e => Number.isInteger(e) ? e : e.customerId);
      }
      customerIds = [props.customerId].concat(customerChild);
    }
    if (props.searchScope === ConditionScope.PersonInCharge) {
      loginFlag = true;
    }

    paramTmp.customerIds = customerIds;
    paramTmp.filterByUserLoginFlg = loginFlag ? 1 : 0;
    setParam(paramTmp)
  }, [props.searchScope, props.searchRange]);

  const onPageChange = (offsetRecord, limitRecord) => {
    setOffset(offsetRecord);
    setLimit(limitRecord);
    param.offset = offsetRecord;
    param.limit = limitRecord;
    setParam(_.cloneDeep(param));

    props.handleInitTaskTab(param);
  }

  useEffect(() => {
    if (props.fieldInfo) {
      setFields(props.fieldInfo);
    }
  }, [props.fieldInfo]);

  /**
   * Add/remove body's className when opening from detail modal
   */
  useEffect(() => {
    if (!isNullOrUndefined(bodyClassName)) {
      document.body.classList && document.body.classList.forEach(e => {
        if (e !== 'modal-open') {
          document.body.classList.remove(e);
        }
      })
      if (openModalDetailTask) {
        document.body.classList.add('wrap-task');
      } else {
        document.body.className = bodyClassName;
      }
    }
  }, [openModalDetailTask]);

  const onClickDetailTask = (taskId) => {
    setSelectedTask(taskId);
    setOpenModalDetailTask(true);
  }

  const onClickDetailSubTask = (taskId) => {
    setSelectedSubTask({ taskId });
    setOpenModalDetailSubTask(true);
  }

  const onClickDetailMilestone = (milestoneId) => {
    setSelectedMilestone({ milestoneId });
    setOpenModalDetailMilestone(true);
  }

  const toggleCloseModalMilesDetail = () => {
    setSelectedMilestone(null);
    setOpenModalDetailMilestone(false);
  }

  useEffect(() => {
    // if (props.typeTaskTab === TypeGetTaskByIdService.CustomerId) {
    //   param.customerIds = props.customerId && [props.customerId];
    // }
    props.handleInitTaskTab(param);
    // set className for the first time opening the popup
    if (isFirstOpen) {
      setBodyClassName(document.body.classList.value);
    }
  }, []);

  useEffect(() => {
    if (param != null) {
      props.handleInitTaskTab(param);
    }
  }, [param]);


  const renderMsgEmpty = (serviceStr) => {
    const msg = translate('messages.INF_COM_0020', { 0: serviceStr })
    return (
      <div>{msg}</div>
    )
  };

  /**
   * check image
   * @param fileName fileName check image
   */
  const checkImage = (fileName) => {
    let flagCheckImage = false;
    const fileExtImage = ['img', 'jpeg', 'gif', 'bmp', 'png', 'jpg']
    fileExtImage.forEach(fileExtension => {
      if (fileName && fileName.toLowerCase().includes(fileExtension)) {
        flagCheckImage = true;
      }
    });
    return flagCheckImage;
  }

  /**
   * Render File
   * @param files
   */
  const getFileFromRes = (files) => {
    const stringFileName = '';
    if (!files) {
      return stringFileName;
    }
    if (files.length > 2) {
      return <div className="list-link-file">
        <a className="first-file">{files[0].fileName} ...
        <div className="box-list-file">
            <ul>
              {files.map((file, idx) =>
                <li key={file.fileId + idx + ""} className="file-hover">
                  <a href={file.filePath}>
                    <img className="icon" src="/content/images/task/ic-clip-red.svg" />
                    {file.fileName}
                  </a>
                  {checkImage(file.fileName) &&
                    <div className="img-preview">
                      <img src={file.filePath} alt="" />
                    </div>}
                </li>)}
            </ul>
          </div>
        </a>
      </div>
    }
    return files.map((item, index) => {
      if (index === 0) {
        return (
          <>
            <li key={index} className="file-hover">
              <a key={index} href={item.filePath}>{item.fileName}</a>
              {checkImage(item.fileName) &&
                <div className="img-preview">
                  <img src={item.filePath} alt="" />
                </div>}
            </li>
          </>
        )
      }
      return (
        <>
          <li key={index} className="file-hover">
            <a key={index} href={item.filePath}>,{' '}{item.fileName}</a>
            {checkImage(item.fileName) &&
              <div className="img-preview">
                <img src={item.filePath} alt="" />
              </div>}
          </li>
        </>
      )
    });
  }

  const renderEmployeeField = (rowData, presentEmployeeId?) => {
    const urlImage = R.path(['photoFilePath'], rowData);
    const employeeId = R.path(['employeeId'], rowData);
    const employeeSurname = R.path(['employeeSurname'], rowData);
    const employeeName = R.path(['employeeName'], rowData);
    const fullName = getFullName(employeeSurname, employeeName);
    return (
      <div className="item form-inline flex-nowrap">
        {urlImage ? <img className="user" src={urlImage} /> : <a tabIndex={-1} className="no-avatar green">{firstChar(fullName)}</a>}
        <a className="d-inline-block text-ellipsis"
          onClick={() => (presentEmployeeId !== employeeId) && props.showAnyDetail(employeeId, TYPE_DETAIL_MODAL.EMPLOYEE)}
        >
          <Popover x={-20} y={25}>{fullName}</Popover>
        </a>
      </div>
    )
  }

  const showAllPersonInCharge = (employees) => {
    return (
      <div className="box-select-option position-absolute max-height-300 overflow-auto max-width-300 mh-auto location-r0 mt-3" ref={personInChargeRef}>
        {employees.map((employee, idx) => {
          return (
            <React.Fragment key={idx}>
              {renderEmployeeField(employee, employeeIdViewDetail)}
            </React.Fragment>
          )
        })}
      </div>
    )
  }

  const handleMouseDown = (e) => {
    if (personInChargeRef && !isMouseOnRef(personInChargeRef, e)) {
      setIsShowAllPersonInCharge(false);
    }
  }
  useEventListener('mousedown', handleMouseDown);

  const getOperatorFromRes = (totalEmployees, taskId?: any) => {
    return (
      <>
        {totalEmployees?.length > 0 &&
          <div className="d-flex flex-wrap align-items-center">
            {totalEmployees.slice(0, 2).map((item, idx) => {
              return (
                <div className="d-inline-block mr-3 mb-1" key={idx} style={{ maxWidth: '120px' }}>
                  {renderEmployeeField(item, employeeIdViewDetail)}
                </div>
              );
            })}
            {totalEmployees.length > 2 &&
              <div className="d-inline-block mb-1 position-relative">
                <div className="item form-inline flex-nowrap">
                  <a onClick={() => { setIsShowAllPersonInCharge(true); setTaskIdShowPersonInCharge(taskId) }}>
                    {translate('employees.detail.label.remain', { count: totalEmployees.length - 2 })}
                  </a>
                </div>
                {isShowAllPersonInCharge && (taskId === taskIdShowPersonInCharge) && showAllPersonInCharge(totalEmployees)}
              </div>
            }
          </div>
        }
      </>
    );
  }

  /**
   * Render for field type is 99 => TO DO, if change REQ
   * @param fieldColumn
   * @param rowData
   * @param mode
   */
  const customContentField = (fieldColumn, rowData, mode) => {
    if (!fieldColumn.fieldName) {
      return;
    }
    if (mode === ScreenMode.DISPLAY) {
      switch (fieldColumn.fieldName.toString()) {
        case DEFINE_FIELD_NAME_TASK.MILESTONE_ID:
          return <a onClick={() => onClickDetailMilestone(rowData.milestoneId)}>{rowData.milestoneId}</a>;
        case DEFINE_FIELD_NAME_TASK.MILESTONE_NAME:
          return <a onClick={() => onClickDetailMilestone(rowData.milestoneId)}>{rowData.milestoneName}</a>;
        case DEFINE_FIELD_NAME_TASK.OPERATOR_ID:
          return getOperatorFromRes(rowData.employees, rowData && rowData['taskId']);
        case DEFINE_FIELD_NAME_TASK.CREATED_USER:
          return <a>{getValueProp(rowData, 'task_created_user_name')}</a>;
        case DEFINE_FIELD_NAME_TASK.UPDATED_USER:
          return <a>{getValueProp(rowData, 'task_updated_user_name')}</a>;
        case DEFINE_FIELD_NAME_TASK.FILE_NAME:
          return getFileFromRes(rowData.files);
        case DEFINE_FIELD_NAME_TASK.PRODUCTS_TRADINGS_ID:
          return (
            <>
              {rowData.productTradings && rowData.productTradings.map((product, idx) => (
                <>
                  {product.productTradingId}
                  {idx < rowData.productTradings.length - 1 && ', '}
                </>
              ))}
            </>
          );
        case DEFINE_FIELD_NAME_TASK.PRODUCT_NAME:
          return (
            <>
              {rowData.productTradings && rowData.productTradings.map((product, idx) => (
                <>
                  {product.productName}
                  {idx < rowData.productTradings.length - 1 && ', '}
                </>
              ))}
            </>
          );
        case DEFINE_FIELD_NAME_TASK.CUSTOMER_ID: {
          return (
            <>
              {rowData.customers && rowData.customers.map((cus) => (
                <>
                  <a>{cus.customerId}</a>
                </>
              ))}
            </>
          );
        }
        case DEFINE_FIELD_NAME_TASK.CUSTOMER_NAME: {
          return (
            <>
              {rowData.customers && rowData.customers.map((cus) => (
                <>
                  {cus.customerId === props.customerId
                    ? <span>{cus.customerName}</span>
                    : (
                      <a onClick={() => {
                        if (props.customerId) {
                          props.showCustomerDetail(cus.customerId, props.customerId)
                        } else {
                          props.showAnyDetail(cus.customerId, TYPE_DETAIL_MODAL.CUSTOMER)
                        }
                      }}
                      >{cus.customerName}</a>
                    )
                  }
                </>
              ))}
            </>
          );
        }
        case DEFINE_FIELD_NAME_TASK.PARENT_ID:
          return <>{rowData.parentTaskId}</>;
        case DEFINE_FIELD_NAME_TASK.FINISH_DATE: {
          return <div
            className={`${checkOverdueComplete(rowData.finishDate, rowData.statusTaskId) ? 'text-red ' : ''}text text2`}>
            {formatDate(rowData.finishDate)}
          </div>
        }
        default:
          break;
      }
    }
  }

  /**
   * Render for special custom field.
   * @param rowDataCustom
   * @param fieldDataCustom
   * @param modeDataCustom
   */
  const customFieldValue = (rowDataCustom, fieldDataCustom, mode) => {
    if (mode === ScreenMode.DISPLAY) {
      switch (fieldDataCustom.fieldName.toString()) {
        case DEFINE_FIELD_NAME_TASK.TASK_ID:
          return <a onClick={() => onClickDetailTask(rowDataCustom.taskId)}>{rowDataCustom.taskId}</a>;
        case DEFINE_FIELD_NAME_TASK.TASK_NAME:
          return (
            <div className='overflow-menu'>
              <a className="d-inline-block text-ellipsis max-calc66" onClick={() => onClickDetailTask(rowDataCustom.taskId)}>
                <Popover x={-20} y={25}>
                  {rowDataCustom.taskName}
                </Popover>
              </a>
            </div>
          );
        case DEFINE_FIELD_NAME_TASK.MILESTONE_ID:
          return rowDataCustom.milestoneId > 0 ? <a onClick={() => onClickDetailMilestone(rowDataCustom.milestoneId)}>{rowDataCustom.milestoneId}</a> : <></>;
        case DEFINE_FIELD_NAME_TASK.CUSTOMER_ID:
          return rowDataCustom.customerId > 0 ? <a >{rowDataCustom.customerId}</a> : <></>;
        case DEFINE_FIELD_NAME_TASK.PRODUCTS_TRADINGS_ID:
          return rowDataCustom.productsTradingsId > 0 ? <a >{rowDataCustom.productsTradingsId}</a> : <></>;
        case DEFINE_FIELD_NAME_TASK.IS_PUBLIC:
          return rowDataCustom.isPublic ? <>{translate("tasks.list.isPublic.public")}</> : <>{translate("tasks.list.isPublic.notPublic")}</>;
        case DEFINE_FIELD_NAME_TASK.STATUS:
          if (rowDataCustom.statusTaskId === 1) {
            return <>{translate("tasks.list.status-task.no-start")}</>;
          } else if (rowDataCustom.statusTaskId === 2) {
            return <>{translate("tasks.list.status-task.start")}</>;
          } else if (rowDataCustom.statusTaskId === 3) {
            return <>{translate("tasks.list.status-task.complete")}</>;
          } else {
            return <></>;
          }
        case DEFINE_FIELD_NAME_TASK.CREATED_DATE:
          return getValueProp(rowDataCustom, 'task_created_date');
        case DEFINE_FIELD_NAME_TASK.UPDATED_DATE:
          return getValueProp(rowDataCustom, 'task_updated_date');
        case DEFINE_FIELD_NAME_TASK.OPERATOR_ID:
          return getOperatorFromRes(rowDataCustom.employees, rowDataCustom && rowDataCustom['taskId']);
        case DEFINE_FIELD_NAME_TASK.CREATED_USER:
          return <a >{getValueProp(rowDataCustom, 'task_created_user_name')}</a>;
        case DEFINE_FIELD_NAME_TASK.UPDATED_USER:
          return <a >{getValueProp(rowDataCustom, 'task_updated_user_name')}</a>;
        default:
          break;
      }
    }
  }

  const getPublicItems = () => {
    // isPublic
    const publicItems = [];
    publicItems.push({
      itemId: IS_PUBLIC.NOT_PUBLIC,
      itemLabel: translate("tasks.list.isPublic.notPublic"),
      itemOrder: 1,
      isAvailable: true
    })
    publicItems.push({
      itemId: IS_PUBLIC.PUBLIC,
      itemLabel: translate("tasks.list.isPublic.public"),
      itemOrder: 2,
      isAvailable: true
    })
    return publicItems;
  }

  /**
   * add statusTaskId column to table
   */
  const getExtensionsTasks = () => {
    const extensionsData = {};
    if (!props.tasks.tasks) {
      return extensionsData;
    }
    const statusItems = [];
    statusItems.push({
      itemId: STATUS_TASK.NOT_STARTED,
      itemLabel: translate(`tasks.list.statustask[${STATUS_TASK.NOT_STARTED - 1}]`)
    })
    statusItems.push({
      itemId: STATUS_TASK.WORKING,
      itemLabel: translate(`tasks.list.statustask[${STATUS_TASK.WORKING - 1}]`)
    })
    statusItems.push({
      itemId: STATUS_TASK.COMPLETED,
      itemLabel: translate(`tasks.list.statustask[${STATUS_TASK.COMPLETED - 1}]`)
    })
    extensionsData['status'] = statusItems


    extensionsData['is_public'] = getPublicItems();
    return extensionsData;
  }

  /**
   * Custom FieldInfo when view/edit/filter on list
   * FieldInfo type = 99
   */
  const customFieldsInfo = (field, type) => {
    const fieldCustom = _.cloneDeep(field);
    if (ControlType.VIEW === type) {
      if (field.fieldName === DEFINE_FIELD_NAME_TASK.MILESTONE_NAME || field.fieldName === DEFINE_FIELD_NAME_TASK.MILESTONE_ID
        || field.fieldName === DEFINE_FIELD_NAME_TASK.CUSTOMER_NAME || field.fieldName === DEFINE_FIELD_NAME_TASK.CUSTOMER_ID) {
        fieldCustom.fieldType = 9;
      }
      return fieldCustom;
    } else if (ControlType.EDIT === type) {
      switch (field.fieldName) {
        case DEFINE_FIELD_NAME_TASK.FILE_NAME:
          fieldCustom.columnWidth = fieldCustom.columnWidth ? fieldCustom.columnWidth : 400;
          return fieldCustom;
        case DEFINE_FIELD_NAME_TASK.IS_PUBLIC:
          fieldCustom.fieldItems = getExtensionsTasks()['is_public'];
          fieldCustom.fieldType = DEFINE_FIELD_TYPE.SINGER_SELECTBOX;
          return fieldCustom;
        default:
          break;
      }
    } else if (ControlType.FILTER_LIST === type) {
      if (field.fieldName === DEFINE_FIELD_NAME_TASK.PARENT_ID
        || field.fieldName === DEFINE_FIELD_NAME_TASK.CUSTOMER_ID
        || field.fieldName === DEFINE_FIELD_NAME_TASK.PRODUCTS_TRADINGS_ID) {
        fieldCustom.fieldType = 5;
      }
      return fieldCustom;
    }
    return field;
  }

  const onActionFilterOrder = (filter: [], order: []) => {
    param.filterConditions = filter;
    param.orderBy = order;
    props.handleInitTaskTab(param);
  }

  const renderComponent = () => {
    if (props.tasks && (props.tasks?.countTotalTask > 0)) {
      return (
        <>
          <div className="overflow-hidden">
            <div className="pagination-top max-width-220 d-flex">
              <div className="esr-pagination">
                <PaginationList offset={offset} limit={limit} totalRecords={R.path(['countTotalTask'], props.tasks)} onPageChange={onPageChange} />
              </div>
            </div>
            {fields && fields.length > 0 &&
              <DynamicList
                id="CustomerDetailTabTask"
                tableClass="table-list table-customer table-drop-down"
                keyRecordId="taskId"
                records={props.tasks.tasks}
                mode={ScreenMode.DISPLAY}
                belong={FIELD_BELONG.TASK}
                extBelong={TAB_ID_LIST.task}
                fieldInfoType={FieldInfoType.Tab}
                forceUpdateHeader={false}
                fields={fields}
                onActionFilterOrder={onActionFilterOrder}
                // fields={props.task.fieldInfo}
                fieldLinkHolver={[{ fieldName: 'taskName', link: '#', hover: '', action: [] }]}
                getCustomFieldValue={customFieldValue}
                getCustomFieldInfo={customFieldsInfo}
                customContentField={customContentField}
              >
              </DynamicList>
            }
          </div>
          {openModalDetailTask && <DetailTaskModal iconFunction="ic-task-brown.svg"
            taskId={selectedTask}
            toggleCloseModalTaskDetail={() => setOpenModalDetailTask(false)}
            listTask={props.tasks.tasks}
            canBack={true}
            onClickDetailMilestone={onClickDetailMilestone}
            onOpenModalSubTaskDetail={onClickDetailSubTask}
          />}
          {openModalDetailMilestone && <DetailMilestoneModal
            milesActionType={null}
            milestoneId={selectedMilestone.milestoneId}
            toggleCloseModalMilesDetail={toggleCloseModalMilesDetail}
          />}
          {openModalDetailSubTask && <DetailTaskModal iconFunction="ic-task-brown.svg"
            taskId={selectedSubTasks.taskId}
            parentId={selectedTask}
            toggleCloseModalTaskDetail={() => setOpenModalDetailTask(false)}
            listTask={props.tasks.tasks}
            canBack={true}
            onClickDetailMilestone={onClickDetailMilestone}
            onOpenModalSubTaskDetail={onClickDetailSubTask} />}
        </>
      )
    } else {
      return (
        <>
          <div className="min-height-200">
            <div className="align-center images-group-content" >
              <img className="images-group-16" src={'/content/images/task/ic-menu-task.svg'} alt="" />
              {renderMsgEmpty(translate('customers.detail.label.tab.task'))}
            </div>
          </div>
        </>
      )
    }
  }

  return renderComponent();
}
const mapStateToProps = ({ popupDetailTab }: IRootState) => ({
  action: popupDetailTab.action,
  tasks: popupDetailTab.tabTasks
});

const mapDispatchToProps = {
  handleInitTaskTab
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PopupDetailServiceTabTask);
