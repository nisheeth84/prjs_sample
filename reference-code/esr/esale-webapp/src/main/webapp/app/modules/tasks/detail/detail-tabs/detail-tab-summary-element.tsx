import React, { useRef, useState } from 'react'
import { ScreenMode, ControlType, LINK_TARGET_IFRAME, USER_FORMAT_DATE_KEY } from 'app/config/constants'
import { DEFINE_FIELD_NAME_TASK } from 'app/modules/tasks/constants'
import {
  RESPONSE_FIELD_NAME,
  FILE_EXTENSION_IMAGE
} from '../../constants';
import StringUtils from 'app/shared/util/string-utils';
import { Storage, translate } from 'react-jhipster';
import _ from 'lodash';
import { DEFINE_FIELD_TYPE, DynamicControlAction, TYPE_UNIT } from '../../../../shared/layout/dynamic-form/constants';
import { getValueProp } from 'app/shared/util/entity-utils';
import { SettingModes } from 'app/shared/layout/dynamic-form/control-field/dynamic-select-field';
import { downloadFile } from 'app/shared/util/file-utils';
import dateFnsFormat from 'date-fns/format';
import { APP_DATE_FORMAT } from 'app/config/constants';
import FieldDisplayRow from 'app/shared/layout/dynamic-form/control-field/view/field-display-row';
import { Link } from 'react-router-dom';
import InfoEmployeeCard from 'app/shared/layout/common/info-employee-card/info-employee-card';
import { getDynamicData } from 'app/shared/util/utils';
import FieldDetailViewTextArea from '../../../../shared/layout/dynamic-form/control-field/detail/field-detail-view-text-area';
import { FILE_FOMATS } from 'app/shared/layout/dynamic-form/control-field/edit/field-edit-file';


export interface TabSummaryEleProps {
  fieldsInfo?: any[],
  valueData?: any,                                      // data from props to init
  screenMode,                                           // screen mode
  canDrop?: boolean,                                    // drap drop or not
  isOver?: boolean,                                     // overlay
  onDragOrderField?: (dragId, dropId, isDoubleColumn: boolean, isAddLeft: boolean) => void // method drag drop field
  onDropNewField: (dragItem: object, dropId: number, isDoubleColumn: boolean, isAddLeft: boolean) => void  // drap drop new field
  onOpenModalEmployeeDetail: (employeeId: number) => void     // open employee detail
  onOpenPopupCustomerDetail: (customerId: number) => void     // open customer detail
  onClickDetailMilestone?: (milestoneId) => void              // open milestone details
  onOpenModalSubTaskDetail: (subTaskId) => void               // open subtask details
  openDynamicSelectFields: (settingMode, fieldEdit) => void   // Open dynamic select fiels
  onDeleteFields: (fieldId) => void;                          // delete fields
  onShowMessage?: (message, type) => void;                    // show message
  fieldHighlight?: number[],
  listTab?: any;
  fields?: any;
  taskId?: any;
  checkOnline?: (id) => void;
  resetOnline?: () => void;
  edittingField: any;
}

export enum TypeMessage {
  downloadFileError,
  deleteWarning
}

const TabSummaryElement: React.FC<TabSummaryEleProps> = (props) => {
  const userFormat = Storage.session.get(USER_FORMAT_DATE_KEY, APP_DATE_FORMAT);
  const [isShowCardEmployee, setShowCardEmployee] = useState(false);
  const [employeeIdCur, setEmployeeIdCur] = useState(0);

  const [styleBox, setStyleBox] = useState({})
  const [styleSubBox, setStyleSubBox] = useState({})

  const handleClickFile = (fileName, link) => {
    downloadFile(fileName, link, () => {
      if (props.onShowMessage) {
        props.onShowMessage(translate('messages.ERR_COM_0042', { 0: fileName }), TypeMessage.deleteWarning);
      }
    });
  }

  const handleHoverShowBox = () => {
    const element = document.getElementById('positionBox');
    const style = {}
    if (element) {
      const topBox = element.getBoundingClientRect().top;
      const leftBox = element.getBoundingClientRect().right;
      const space = window.innerHeight - element.getBoundingClientRect().bottom;
      if (space > 350) {
        style['left'] = `${leftBox}px`;
        style['top'] = `${topBox}px`;
      } else {
        style['left'] = `${leftBox}px`;
        style['bottom'] = `${space}px`;
        style['top'] = 'inherit';
      }
    }
    setStyleBox(style);
  }

  const handleHoverShowSubBox = (employee) => {
    const element = document.getElementById('positionSubbox' + employee.employeeId);
    const style = {}
    if (element) {
      const topBox = element.getBoundingClientRect().top;
      const leftBox = element.getBoundingClientRect().left - 155;
      const space = window.innerHeight - topBox;
      if (space > 350) {
        style['left'] = `${leftBox}px`;
        style['top'] = `${topBox}px`;
      } else {
        style['left'] = `${leftBox}px`;
        style['bottom'] = `${window.innerHeight - element.getBoundingClientRect().bottom - 70}px`;
        style['top'] = 'inherit';
      }
    }
    setStyleSubBox(style);
  }


  /**
  * handle img src not found
  * @param event 
  */
  const onImgError = (event) => {
    event.target.onerror = null;
    event.target.src = '/content/images/task/ic-clip-red.svg'
  }

  /**
   * Get extention of file
   */
  const getExtentionIcon = file => {
    const ext = file.fileName ? file.fileName.split('.').pop() : '';
    if (FILE_FOMATS.IMG.includes(ext)) {
      return 'img';
    }
    if (FILE_FOMATS.DOC.includes(ext)) {
      return 'doc';
    }
    if (FILE_FOMATS.PDF.includes(ext)) {
      return 'pdf';
    }
    if (FILE_FOMATS.PPT.includes(ext)) {
      return 'ppt';
    }
    if (FILE_FOMATS.XLS.includes(ext)) {
      return 'xls';
    }
    return 'xxx';
  }

  /**
   * get file to screen
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
                <li key={file.fileId + idx}>
                  <a className="file" onClick={() => handleClickFile(file.fileName, file.fileUrl ? file.fileUrl : file.filePath)}>
                    <img className="icon" src={`/content/images/common/ic-file-${getExtentionIcon(file)}.svg`}
                      onError={onImgError} alt="" />{file.fileName}
                  </a>
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
            <div key={index}>
              <a key={index} onClick={() => handleClickFile(item.fileName, item.fileUrl ? item.fileUrl : item.filePath)}>{item.fileName}</a>
            </div>
          </>
        )
      }
      return (
        <>
          <div key={index}>
            <a key={index} onClick={() => handleClickFile(item.fileName, item.fileUrl ? item.fileUrl : item.filePath)}>,{' '}{item.fileName}</a>
          </div>
        </>
      )
    });
  }

  /**
   * get status
   * @param statusTaskId 
   */
  const getStatusFromRes = (statusTaskId) => {
    let statusTaskName = '';
    if (statusTaskId === 1) {
      statusTaskName = translate('tasks.detail.form.not-start');
    } else if (statusTaskId === 2) {
      statusTaskName = translate('tasks.detail.form.started');
    } else if (statusTaskId === 3) {
      statusTaskName = translate('tasks.detail.form.finished');
    }
    return statusTaskName;
  }

  /**
   * get public
   * @param isPublic 
   */
  const getPublicFromRes = (isPublic) => {
    if (isPublic) {
      return translate('tasks.detail.form.is-public-true');
    } else {
      return translate('tasks.detail.form.is-public-false');
    }
  }

  /**
   * Get milestone name
   * @param milestoneName 
   * @param milestoneId 
   * @param type 
   */
  const getMilestoneNameFromRes = (milestoneName, milestoneId, type) => {
    return (
      <>
        {milestoneId &&
          <a onClick={() => props.onClickDetailMilestone(milestoneId)}>{type === RESPONSE_FIELD_NAME.MILESTONE_NAME ? milestoneName : milestoneId}</a>
        }
      </>
    );
  }

  /**
   * get data of field
   * @param field 
   * @param fieldName 
   * @param fieldCamelCase 
   */
  const getDataValue = (field, fieldName, fieldCamelCase) => {
    let fieldValue = '';
    if (props.valueData.taskData) {
      fieldValue = getDynamicData(field, props.valueData.taskData, props.valueData, props.screenMode, props.taskId, handleClickFile);
    }
    if (!fieldValue && props.valueData[fieldCamelCase]) {
      fieldValue = props.valueData[fieldCamelCase];
    }
    return fieldValue;
  }

    /**
   * open modal customer detail
   * @param employeeId 
   */
  const onOpenPopupCustomerDetail = (customerId) => {
    props.onOpenPopupCustomerDetail(customerId);
    event.preventDefault();
  }

  /**
   * get customer
   * @param customerData 
   */
  const getCustomer = (customerData) => {
    if (!customerData) {
      return <> </>;
    }

    return customerData.map((item, index) => {
      if (index === 0) {
        return (<a key={item.customerId} className="task-of-milestone" onClick={() => onOpenPopupCustomerDetail(item.customerId)}>
          {item.customerName}
        </a>)
      }
      return (<a key={item.customerId} className="task-of-milestone" onClick={() => onOpenPopupCustomerDetail(item.customerId)}>
        , {item.customerName}
      </a>)
    });
  }

  /**
   * open modal employee detail
   * @param employeeId 
   */
  const onOpenModalEmployeeDetail = (employeeId) => {
    props.onOpenModalEmployeeDetail(employeeId);
    event.preventDefault();
  }

  /**
   * open modal employee detail
   * @param employeeId 
   */
  const onOpenModalSubTaskDetail = (subTaskId) => {
    props.onOpenModalSubTaskDetail(subTaskId);
    event.preventDefault();
  }

  /**
   * get create user
   * @param taskData 
   */
  const getCreatedUser = (taskData) => {
    if (!taskData.registPersonName) {
      return <> </>;
    }
    return (
      <a key={RESPONSE_FIELD_NAME.CREATE_USER} className="task-of-milestone" onClick={() => onOpenModalEmployeeDetail(taskData.registPersonId)}>
        {taskData.registPersonName}
      </a>
    );
  }


  /**
   * get update use
   * @param taskData 
   */
  const getUpdatedUser = (taskData) => {
    if (!taskData.refixPersonName) {
      return <> </>;
    }
    return (
      <a key={RESPONSE_FIELD_NAME.UPDATE_USER} className="task-of-milestone" onClick={() => onOpenModalEmployeeDetail(taskData.refixPersonId)}>
        {taskData.refixPersonName}
      </a>
    );
  }

  /**
   * Get subtask name
   * @param listSubTask 
   */
  const getSubTaskName = (listSubTask) => {
    if (listSubTask.length > 2) {
      return <div className="list-link-file detai-task-summary">
        <a className="first-file">{listSubTask[0].taskName}...
          <div className="box-list-file">
            <ul>
              {listSubTask.map((task, idx) =>
                <li key={task.taskId + idx + ""} className="file-hover">
                  <a key={task.taskId} onClick={() => onOpenModalSubTaskDetail(task.taskId)}>{task.taskName}</a>
                </li>)}
            </ul>
          </div>
        </a>
      </div>
    }
    return listSubTask.map((task, index) => {
      if (index === 0) {
        return (<a key={task.taskId} onClick={() => onOpenModalSubTaskDetail(task.taskId)}>{task.taskName}</a>)
      }
      return (<a key={task.taskId} onClick={() => onOpenModalSubTaskDetail(task.taskId)}>,{' '}{task.taskName}</a>)
    });
  }

  /**
   * get info operator
   * @param totalEmployees 
   */
  const getOperators = (totalEmployees) => {
    if (!totalEmployees || !totalEmployees.length) {
      return <></>;
    }

    /**
     * if milestone have one task
     */
    if (totalEmployees.length === 1) {
      return totalEmployees.map(item => {
        return (
          <a key={item.employeeId} className="task-of-milestone" onClick={() => onOpenModalEmployeeDetail(item.employeeId)}>
            {item.employeeSurname} {item.employeeName}{' '}
          </a>
        );
      });
    }

    /**
     * if milestone have two task
     */
    if (totalEmployees.length === 2) {
      return totalEmployees.map((item, index) => {
        if (index === 0) {
          return (
            <a key={item.employeeId} className="task-of-milestone" onClick={() => onOpenModalEmployeeDetail(item.employeeId)}>
              {item.employeeSurname} {item.employeeName},{' '}
            </a>
          );
        }
        return (
          <a key={item.employeeId} className="task-of-milestone" onClick={() => onOpenModalEmployeeDetail(item.employeeId)}>
            {item.employeeSurname} {item.employeeName}{' '}
          </a>
        );
      });
    }

    /**
     * if milestone have more than two task
     */
    const arrItem = totalEmployees.map((item, index) => {
      /**
       * with task first
       */
      if (index === 0) {
        return (
          <a key={item.employeeId} className="task-of-milestone" onClick={() => onOpenModalEmployeeDetail(item.employeeId)}>
            {item.employeeSurname} {item.employeeName},{' '}
          </a>
        );
      }

      /**
       * with task second
       */
      if (index === 1) {
        return (
          <a key={item.employeeId} className="task-of-milestone" onClick={() => onOpenModalEmployeeDetail(item.employeeId)}>
            {item.employeeSurname} {item.employeeName}{' '}
          </a>
        );
      }
      return <></>;
    });

    /**
     * render user box info
     * @param employee
     */
    const renderBoxEmployee = (employee, type) => {
      return <InfoEmployeeCard classHover={'position-fixed z-index-global-1000 overflow-y-hover max-height-350'} styleHover={styleSubBox} employee={employee} taskType={type} onOpenModalEmployeeDetail={onOpenModalEmployeeDetail} />
    }

    /**
   * render box list user component
   * @param employee
   */
    const renderListEmployee = (employee, index) => {
      return <div className="list-user">
        {renderBoxEmployee(employee, index)}
      </div>
    }

    /**
     * create avatar image from first character of name
     * @param event
     */
    const onImageAvatarEmployeeNotFound = (event, employeeData) => {
      event.target.onerror = null;
      const employeeFullName = employeeData.employeeSurname ? employeeData.employeeSurname : employeeData.employeeName;
      const canvas = document.createElement('canvas');
      canvas.setAttribute('width', "48px");
      canvas.setAttribute('height', "48px");
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = "#8ac891";
      ctx.fillRect(0, 0, 48, 48);
      ctx.fillStyle = "#fff"
      ctx.font = "28px Noto Sans CJK JP";
      ctx.fillText(employeeFullName[0], 12, 34);
      event.target.src = canvas.toDataURL('image/jpeg', 1.0);
    }

    arrItem.push(
      <div className="employee-more-of-taskdetail">
        <a id='positionBox' onMouseOver={handleHoverShowBox} className="task-of-milestone ">
          {translate('global-tool.left', { number: totalEmployees ? totalEmployees.length - 2 : 0 })}
        </a>
        <div className="box-select-option position-fixed overflow-y-hover max-height-350 z-index-global-1000" style={styleBox}>
          <ul>
            {totalEmployees &&
              totalEmployees.map((item, index) => {
                if (index === 0 || index === 1) {
                  return <> </>;
                }
                return (
                  <li key={item.taskId}>
                    <a onMouseOver={() => handleHoverShowSubBox(item)} id={'positionSubbox' + item.employeeId} onClick={() => onOpenModalEmployeeDetail(item.employeeId)} onMouseEnter={() => { setShowCardEmployee(true); setEmployeeIdCur(item.employeeId) }}>
                      <label className="d-inline-flex">
                        <img className="icon mt-0" src={item.photoFilePath ? item.photoFilePath : ""} alt="" onError={(e) => onImageAvatarEmployeeNotFound(e, item)} title="" />
                        <span className="text-ellipsis max-width-150">{item.employeeSurname} {item.employeeName}</span>
                      </label>
                    </a>
                    {item && isShowCardEmployee && item.employeeId === employeeIdCur && renderListEmployee(item, index)}
                  </li>
                );
              })}
          </ul>
        </div>
      </div >
    );
    return arrItem;
  }

  /**
   * get data to show screen
   * @param fieldInfo 
   */
  const getValueDataShow = (field) => {
    let text = null;
    const fieldName = StringUtils.snakeCaseToCamelCase(field.fieldName);
    let employeeGroupList = [];
    switch (fieldName) {
      case RESPONSE_FIELD_NAME.MILESTONE_NAME:
        text = getMilestoneNameFromRes(props.valueData.milestoneName, props.valueData.milestoneId, fieldName);
        break;
      case RESPONSE_FIELD_NAME.START_DATE:
        text = props.valueData.startDate ? dateFnsFormat(props.valueData.startDate, userFormat) : null;
        break;
      case RESPONSE_FIELD_NAME.FINISH_DATE:
        text = props.valueData.finishDate ? dateFnsFormat(props.valueData.finishDate, userFormat) : null;
        break;
      case RESPONSE_FIELD_NAME.CUSTOMER_NAME:
        text = getCustomer(props.valueData.customers);
        break;
      case RESPONSE_FIELD_NAME.OPERATOR:
        employeeGroupList = props.valueData.totalEmployees;
        if (props.valueData.operators.length > 0) {
          props.valueData.operators.map(empList => {
            empList.employees.map(item => {
              if (!employeeGroupList.some(emp => emp.employeeId === item.employeeId)) {
                employeeGroupList.push(item);
              }
            });
          });
        }
        text = getOperators(employeeGroupList);
        break;
      case RESPONSE_FIELD_NAME.FILE:
        text = getFileFromRes(props.valueData.files);
        break;
      case RESPONSE_FIELD_NAME.CREATE_USER:
        text = getCreatedUser(props.valueData);
        break;
      case RESPONSE_FIELD_NAME.UPDATE_USER:
        text = getUpdatedUser(props.valueData);
        break;
      case RESPONSE_FIELD_NAME.CREATE_DATE:
        text = dateFnsFormat(props.valueData.registDate, userFormat)
        break;
      case RESPONSE_FIELD_NAME.UPDATE_DATE:
        text = dateFnsFormat(props.valueData.refixDate, userFormat)
        break;
      case RESPONSE_FIELD_NAME.STATUS:
        text = getStatusFromRes(props.valueData.statusTaskId);
        break;
      case RESPONSE_FIELD_NAME.IS_PUBLIC:
        text = getPublicFromRes(props.valueData.isPublic);
        break;
      case RESPONSE_FIELD_NAME.PARENT_ID:
        text = getSubTaskName(props.valueData.subtasks);
        break;
      case RESPONSE_FIELD_NAME.TASK_NAME:
      case RESPONSE_FIELD_NAME.MEMO:
        text = props.valueData[fieldName];
        break;
      case RESPONSE_FIELD_NAME.PRODUCT_NAME: {
          const customerElement = [];
          let customerTextName = '';
          const customerId = props.valueData.customers && props.valueData.customers.length > 0 ? props.valueData.customers[0].customerId : null;
          props.valueData.productTradings.forEach((product, idx) => {
            if (idx !== 0) {
              customerTextName += translate("commonCharacter.comma")
              customerElement.push(translate("commonCharacter.comma"))
            }
            if (product.customerName && idx === 0) {
              customerTextName += product.customerName
              customerTextName += translate("commonCharacter.splash")

              customerElement.push(product.customerName)
              customerElement.push(<span key={idx} className="black">/</span>)
            }
            customerTextName += product.productName
            customerElement.push(product.productName)
          })
          text = <><a onClick={() => customerId ? onOpenPopupCustomerDetail(customerId) : { }}>{customerElement}</a></>;
        }
        break;
      case RESPONSE_FIELD_NAME.MILESTONE_ID:
      case RESPONSE_FIELD_NAME.PRODUCTS_TRADINGS_ID:
      case RESPONSE_FIELD_NAME.CUSTOMER_ID:
        text = '';
      break;
      default:
        text = getDataValue(field, field.fieldName, fieldName);
        break;
    }
    return text;
  }

  const getFieldLinkHover = () => {
    return null;
  }
  const renderComponentDisplay = (fieldInfo: any) => {
    const text = getValueDataShow(fieldInfo)
    if (_.toString(fieldInfo.fieldType) === DEFINE_FIELD_TYPE.LINK && _.isNil(fieldInfo.defaultValue)) {
      return <>
        {fieldInfo.linkTarget !== LINK_TARGET_IFRAME && <a rel="noopener noreferrer" target="blank" href={fieldInfo.urlTarget}>{fieldInfo.urlText}</a>}
        {fieldInfo.linkTarget === LINK_TARGET_IFRAME && props.screenMode === ScreenMode.DISPLAY &&
          <><a href={fieldInfo.urlTarget}>{fieldInfo.urlText}</a> <iframe src={fieldInfo.urlTarget} height={fieldInfo.iframeHeight} width="100%" /></>}
        {fieldInfo.linkTarget === LINK_TARGET_IFRAME && props.screenMode === ScreenMode.EDIT && <a href={fieldInfo.urlTarget}>{fieldInfo.urlText}</a>}
      </>
    } else if (_.toString(fieldInfo.fieldType) === DEFINE_FIELD_TYPE.EMAIL && fieldInfo.isDefault) {
      return <a href={`mailto:${text}`}>{text}</a>
    } else if (fieldInfo.isLinkedGoogleMap && fieldInfo.isDefault) {
      return <a href={`http://google.com/maps/search/${text}`}>{text}</a>
    } else if (props.valueData.taskData && props.valueData.taskData.length > 0 && !text) {
      return <>{getDynamicData(fieldInfo, props.valueData.taskData, props.valueData, props.screenMode, props.taskId, handleClickFile)}</>
    } else if (props.valueData && fieldInfo.fieldName === "memo") {
      return <><FieldDetailViewTextArea text={props.valueData['memo']} /></>
    } else if (props.valueData && (fieldInfo.fieldName === "customer_id" || fieldInfo.fieldName === "milestone_id" || fieldInfo.fieldName === "products_tradings_id")) {
      return <></>
    } else {
      const fieldLink = getFieldLinkHover();
      const isArray = Array.isArray(getValueProp(props.valueData, fieldInfo.fieldName)) && typeof getValueProp(props.valueData, fieldInfo.fieldName)[0] !== 'object'
        && _.toString(fieldInfo.fieldType) !== DEFINE_FIELD_TYPE.CHECKBOX
        && _.toString(fieldInfo.fieldType) !== DEFINE_FIELD_TYPE.MULTI_SELECTBOX;
      if (isArray) {
        const display = [];
        const records = getValueProp(props.valueData, fieldInfo.fieldName);
        records.forEach((e, i) => {
          if (fieldLink && fieldLink.link) {
            display.push(<Link to={fieldLink.link}>{e}</Link>); // TODO pass parameter
          } else if (fieldLink && (fieldLink.hover || fieldLink.action)) {
            // TODO wait requried
          } else {
            display.push(<>{e}</>);
          }
        })
        return <>{display}</>
      } else {
        if (fieldLink && fieldLink.link) {
          return <Link to={fieldLink.link}>{text}</Link>
        } else if (fieldLink && (fieldLink.hover || fieldLink.action)) {
          // TODO wait requried
        } else {
          return <>{text}</>;
        }
      }
    }
    return <></>
  }

  /**
   * Execute Action
   * @param fieldInfo 
   * @param actionType 
   */
  const onExecuteAction = (fieldInfo, actionType) => {
    if (actionType === DynamicControlAction.DELETE) {
      if (_.get(props, 'edittingField.fieldId') < 0 && !_.isNil(props.edittingField) && _.isNil(props.edittingField.userModifyFlg)) {
        if (props.onShowMessage) {
          props.onShowMessage(translate('messages.ERR_COM_0042'), TypeMessage.deleteWarning);
        }
      } else {
        if (props.onDeleteFields) {
          props.onDeleteFields(fieldInfo)
          if (_.get(props, 'edittingField.fieldId') === fieldInfo.fieldId) {
            props.openDynamicSelectFields(SettingModes.CreateNewInput, fieldInfo)
          }
        }
      }
    } else if (actionType === DynamicControlAction.EDIT) {
      if (props.openDynamicSelectFields) {
        props.openDynamicSelectFields(SettingModes.EditInput, fieldInfo)
      }
    }
  }

  /**
   * Render component
   */
  const renderComponent = () => {
    const isTab = props.fieldsInfo && props.fieldsInfo.length === 1 && _.toString(props.fieldsInfo[0].fieldType) === DEFINE_FIELD_TYPE.TAB
    if (!isTab) {
      if (props.screenMode === ScreenMode.DISPLAY && _.toString(props.fieldsInfo[0].fieldType) === DEFINE_FIELD_TYPE.LOOKUP) {
        return <></>
      }
      // const styleColumn = props.fieldsInfo.length === 1 ? 'title-table w15' : 'title-table w30'
      return <FieldDisplayRow
        fieldInfo={props.fieldsInfo}
        listFieldInfo={props.fields}
        controlType={ControlType.DETAIL_VIEW}
        isDisabled={!props.screenMode || props.screenMode === ScreenMode.DISPLAY}
        // fieldStyleClass={{ detailViewBox: { columnFirst: styleColumn } }}
        renderControlContent={renderComponentDisplay}
        onExecuteAction={onExecuteAction}
        moveFieldCard={props.onDragOrderField}
        addFieldCard={props.onDropNewField}
        fieldIdsHighlight={props.fieldHighlight}
        // className={props.fieldHighlight && props.fieldHighlight.findIndex(e => e === props.col.fieldId) >= 0 ? 'detail-highlight-style' : ''}
        idUpdate={props.taskId}
      />
    }
    return <></>
  }
  return renderComponent();
}

export default TabSummaryElement;
