import React, { useState, useEffect, useRef } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { translate } from 'react-jhipster'
import { useId } from "react-id-generator";
import { formatDate, convertDateTimeFromServer } from 'app/shared/util/date-utils';
import { connect } from 'react-redux';
import { TASK_TABLE_ID, TASK_ACTION_TYPES, FILE_EXTENSION_IMAGE, LICENSE } from 'app/modules/tasks/constants'
import LocalMenu from 'app/modules/tasks/control/local-navigation'
import { checkOnline, resetOnline } from 'app/shared/reducers/authentication.ts';
import { IRootState } from 'app/shared/reducers';
import { FILE_FOMATS } from 'app/shared/layout/dynamic-form/control-field/edit/field-edit-file';
import { downloadFile } from 'app/shared/util/file-utils';
import PopupEmployeeDetail from 'app/modules/employees/popup-detail/popup-employee-detail';
import BoxMessage, { MessageType } from 'app/shared/layout/common/box-message';
import _ from 'lodash';
import { TaskItemEmployee } from './task-item-employee';
import { TaskItemFile } from './task-item-file';
import { TaskItemSubtask } from './task-item-subtask';
import { TaskItemMilestone } from './task-item-milestone';
import { TaskItemMemo } from './task-item-memo';
import moment from 'moment';

export interface ITaskListCardBoard extends DispatchProps, StateProps {
  tasks: any,                                                                                                         // list task data to display
  onShowDeleteDialog: (task: any) => void,                                                                            // handle click delete icon of card
  onDrop: (sourceIndex: number, sourceCol: number, destinationIndex: number, destinationCol: number) => void,         // handle drag drop
  onShowModalEditTask: (taskActionType: number, taskId: number, parentTaskId: number) => void,                                               // event show modal edit task
  onClickDetailTask: (taskId: number) => void,                                                                         // event show modal detail task
  onClickDetailMilestone: (milestoneId) => void,                                                                       // event show modal detail milestone
  onClickDetailCustomer: (customerId) => void,                                                                       // event show modal detail customer
  onScroll: (e, i) => void,                                                                                            // event scroll view card
}

/**
 * Component show a board of tasks have 3 column: tasks not started, tasks working and tasks completed
 * @param props
 */
const TaskCard = (props: ITaskListCardBoard) => {
  const [, setOnline] = useState(-1);
  const [sizeHeightCard, setSizeHeightCard] = useState('');
  const [openPopupEmployeeDetail, setOpenPopupEmployeeDetail] = useState(false);
  const [employeeId, setEmployeeId] = useState(0);
  const columnRef = useRef(null);
  const employeeDetailCtrlId = useId(1, "taskCardEmployeeDetail_")

  /**
   * raise when drag-drop finished
   * @param dragResult
   */
  const onDragEnd = (dragResult) => {
    const { source, destination } = dragResult;
    if (destination) {
      const sourceColumn = parseInt(source.droppableId.split('.').pop(), 10)
      const destinationColumn = parseInt(destination.droppableId.split('.').pop(), 10)
      props.onDrop(source.index, sourceColumn + 1, destination.index, destinationColumn + 1)
    }
  }

  /**
 * render taskName when too long
 * @param taskName
 */
  const renderTaskName = (task) => {
    const { taskName, taskId } = task
    const onMouseEnter = (event) => {
      if (event.currentTarget.offsetWidth < event.currentTarget.scrollWidth && taskName.length > 0) {
        event.currentTarget.parentElement.className = 'name-task over'
      }
    }
    const onMouseLeave = (event) => {
      event.currentTarget.parentElement.className = 'name-task'
    }
    return <>
      <div className="task-name" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
        {!task.isPublic && <i className="fas fa-lock-alt mr-2 color-999"></i>}
        <a onClick={() => { props.onClickDetailTask(taskId) }}>{taskName}</a>
      </div>
      <div className="box-select-option ">
        <div className="text">
          <span>{taskName}</span>
        </div>
      </div>
    </>
  }

  const checkOverdueComplete = (dateCheck) => {
    if (!dateCheck) {
      return false;
    }
    if (!moment.isDate(dateCheck)) {
      dateCheck = convertDateTimeFromServer(dateCheck);
    }
    if (dateCheck < moment().utcOffset(0).set({ hour: 0, minute: 0, second: 0 }).local(true).toDate()) {
      return true;
    }
    return false;
  }

  /**
   * create avatar image from first character of name
   * @param event
   */
  // const onImageAvatarEmployeeNotFound = (event, employeeData) => {
  //   event.target.onerror = null;
  //   const employeeFullName = employeeData.employeeSurname ? employeeData.employeeSurname : employeeData.employeeName;
  //   const canvas = document.createElement('canvas');
  //   canvas.setAttribute('width', "48px");
  //   canvas.setAttribute('height', "48px");
  //   const ctx = canvas.getContext('2d');
  //   ctx.fillStyle = `rgb(${Math.floor(Math.random() * 200)},${Math.floor(Math.random() * 200)},${Math.floor(Math.random() * 200)})`;
  //   ctx.fillRect(0, 0, 48, 48);
  //   ctx.fillStyle = "#fff"
  //   ctx.font = "28px Noto Sans CJK JP";
  //   ctx.fillText(employeeFullName[0], 12, 34);
  //   event.target.src = canvas.toDataURL('image/jpeg', 1.0);
  // }

  /**
   * Render status Online, Ofline, Away
   * @param numberOnline
   */
  // const renderStatusOnline = (numberOnline) => {
  //   if (numberOnline === STATUS_ONLINE.ONLINE) {
  //     return <div className="status online">{translate("status.online")} </div>
  //   }
  //   if (numberOnline === STATUS_ONLINE.AWAY) {
  //     return <div className="status busy">{translate("status.away")}</div>
  //   }
  //   return <div className="status offline">{translate("status.offline")}</div>
  // }

  /**
   * open employeeId detail
   * @param employeeIdParam 
   */
  const onOpenModalEmployeeDetail = (employeeIdParam) => {
    setEmployeeId(employeeIdParam);
    setOpenPopupEmployeeDetail(true);
  }

  /**
   * render user box info
   * @param employee
   */
  // const renderBoxEmployee = (employee, type) => {
  //   return <InfoEmployeeCard employee={employee} taskType={type} onOpenModalEmployeeDetail={onOpenModalEmployeeDetail} />
  // }

  // const callApiCheckOnline = (id) => () => {
  //   // props.checkOnline(id)
  // }

  // const resetCheckOnline = () => {
  //   // props.resetOnline();
  //   // setOnline(-1);
  // }

  /**
   * render box list user component
   * @param employees
   */
  // const renderListEmployee = (employees, index) => {
  //   const onMouseEnter = (event) => {
  //     event.currentTarget.parentElement.className = 'list-user-item over';
  //   }
  //   const onMouseLeave = (event) => {
  //     event.currentTarget.parentElement.className = 'list-user-item'
  //   }
  //   const onMouseEnterNumber = (event) => {
  //     event.currentTarget.parentElement.className = 'list-user-item show-list'
  //   }
  //   const onMouseLeaveNumber = (event) => {
  //     event.currentTarget.parentElement.className = 'list-user-item'
  //   }
  //   return <div className="list-user">
  //     {employees && employees.length <= 3 && employees.map((employee) =>
  //       <div key={employee.employeeId} className="list-user-item" ref={imgEmployeeRef}>
  //         <img src={employee.photoFilePath} alt="" onError={(e) => onImageAvatarEmployeeNotFound(e, employee)} />
  //         {renderBoxEmployee(employee, index)}
  //       </div>)}
  //     {employees && employees.length > 3 &&
  //       <>
  //         {employees.slice(0, 2).map((employee) =>
  //           <div key={employee.employeeId} className="list-user-item">
  //             <img onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} src={employee.photoFilePath} alt="" onError={(e) => onImageAvatarEmployeeNotFound(e, employee)} />
  //             {renderBoxEmployee(employee, index)}
  //           </div>)}
  //         <div key={employees[2].employeeId} className="list-user-item" onMouseEnter={callApiCheckOnline(employees[2].employeeId)} onMouseLeave={resetCheckOnline} ref={imgEmployeeRef}>
  //           <img onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} src={employees[2].photoFilePath} alt="" onError={(e) => onImageAvatarEmployeeNotFound(e, employees[2])} />
  //           <span onMouseEnter={onMouseEnterNumber} onMouseLeave={onMouseLeaveNumber} className="number">{employees.length - 3}+
  //            <div className={`box-list-user text-left ${index === 2 ? 'left-type-finish':''}`}>
  //               <ul>
  //                 {employees && employees.slice(3, employees.length).map(employee =>
  //                   <li key={employee.employeeId}>
  //                     <a ><img className="icon" src={employee.photoFilePath} alt="" onError={(e) => onImageAvatarEmployeeNotFound(e, employee)} />{employee.employeeName}</a>
  //                     {renderBoxEmployee(employee, index)}
  //                   </li>
  //                 )}
  //               </ul>
  //             </div>
  //           </span>
  //           {renderBoxEmployee(employees[2], index)}
  //         </div>
  //       </>
  //     }
  //   </div>
  // }


  /**
   * render customer/productTraingName when text too long
   * @param taskData
   */
  const renderCustomerProduct = (taskData) => {
    const customerElement = [];
    let customerText = ''
    const onMouseEnter = (event) => {
      if (event.currentTarget.offsetWidth < event.currentTarget.scrollWidth && customerText.length > 0) {
        event.currentTarget.parentElement.className = 'name-custom over'
      }
    }
    const onMouseLeave = (event) => {
      event.currentTarget.parentElement.className = 'name-custom'
    }

    let products = [];
    if (props.listLicense && props.listLicense.includes(LICENSE.SALES_LICENSE) && taskData.productTradings && taskData.productTradings.length > 0) {
      products = products.concat(taskData.productTradings)
    }

    if (props.listLicense && props.listLicense.includes(LICENSE.CUSTOMER_LICENSE) && taskData.customers && taskData.customers.length > 0) {
      customerElement.push(taskData.customers[0].customerName);
      customerText += taskData.customers[0].customerName;
    }

    products.forEach((product, idx) => {
      if (idx !== 0) {
        customerText += translate("commonCharacter.comma")
        customerElement.push(translate("commonCharacter.comma"))
      }
      if (idx === 0) {
        customerText += translate("commonCharacter.splash")
        customerElement.push(<span key={idx} className="black">/</span>)
      }
      customerText += product.productName
      customerElement.push(product.productName)
    })

    const customerId = taskData.customers && taskData.customers.length > 0 ? taskData.customers[0].customerId : null;
    return <>
      <div className="customer-name" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onClick={(e) => { props.onClickDetailCustomer(customerId); e.preventDefault() }}>
        <a>{customerElement}</a>
      </div>
      <div className="box-select-option">
        <div className="text">
          {customerText}
        </div>
      </div>
    </>
  }

  useEffect(() => {
    setOnline(props.onlineNumber)
  }, [props.onlineNumber])

  useEffect(() => {
    if (props.tasks && columnRef && columnRef.current) {
      setSizeHeightCard((window.innerHeight - columnRef.current.getBoundingClientRect().top - 20) + 'px');
    }
  }, [props.tasks])

  const onClosePopupEmployeeDetail = () => {
    setOpenPopupEmployeeDetail(false);
  }

  const renderErrorMessage = () => {
    if (props.errorItems && props.errorItems.length && props.errorItems[0]) {
      return (
        <BoxMessage messageType={MessageType.Error}
          message={translate(`messages.${props.errorItems[0].errorCode}`)}
          className="max-w-80 message-absoluted"
        />
      );
    }
  }

  return (
    <div className="task-four-column resize-content" ref={columnRef}>
      <DragDropContext onDragEnd={onDragEnd}>
        <LocalMenu />
        <div className={`esr-content-body style-3 esr-content-body-height overflow-hidden ${props.errorItems && props.errorItems.length > 0 && 'mt-4'}`}>
          <div className="esr-content-body-task margin-top-20 style-3">
            {renderErrorMessage()}
            {props.tasks.map((column, i) => (
              <Droppable droppableId={`drag.${i}`} key={i}>
                {provided => (
                  <div {...provided.droppableProps} ref={provided.innerRef} onScroll={(e) => props.onScroll(e, i + 1)} className={`overflow-y-hover column column${i + 2} ${(props.errorItems && props.errorItems.length > 0) ? 'have-err__message' : ''}`} style={{ height: sizeHeightCard }}>
                    {translate(`tasks.list.statustask[${i}]`)}
                    {column.map((task, index) => (
                      <Draggable key={`${task.taskId}.${index}`} draggableId={`${task.taskId}.${index}`} index={index} isDragDisabled={task.isOperator <= 0}>
                        {provided1 => (
                          <div className={(checkOverdueComplete(task.finishDate) && task.statusTaskId !== 3) ? "task-item active" : "task-item"}
                            ref={provided1.innerRef} {...provided1.draggableProps} {...provided1.dragHandleProps}>
                            {task.isOperator > 0 && (
                              <div className="tool">
                                <a
                                  onClick={() => props.onShowModalEditTask(TASK_ACTION_TYPES.UPDATE, task.taskId, task.parentTaskId)}
                                  className="icon-small-primary icon-edit-small"
                                ></a>
                                <a onClick={() => props.onShowDeleteDialog(task)} className="icon-small-primary icon-erase-small"></a>
                              </div>
                            )}
                            <div className="name-custom">{renderCustomerProduct(task)}</div>
                            <div className="name-task">{renderTaskName(task)}</div>
                            <div className="deadline">
                              {translate('tasks.list.card.term')}{task.startDate ? `${formatDate(task.startDate)}~` : ""}{formatDate(task.finishDate)}
                            </div>
                            <div className="list-box-user">
                              <div className="list-box">
                                <ul>
                                  {task.milestoneId > 0 && (<TaskItemMilestone task={task} onClickDetailMilestone={props.onClickDetailMilestone}/>)}
                                  {task.subtasks && task.subtasks.length > 0 && (<TaskItemSubtask task={task} onClickDetailTask={props.onClickDetailTask}/>)}
                                  {task.memo && task.memo.length > 0 && (<TaskItemMemo task={task}/>)}
                                  {task.files && task.files.length > 0 && (<TaskItemFile task={task} index={i}/>)}
                                </ul>
                              </div>
                              {task.employees && task.countEmployee > 0 && <TaskItemEmployee employees={task.employees} index={i} onOpenModalEmployeeDetail={onOpenModalEmployeeDetail} />}
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </div>
      </DragDropContext>
      {openPopupEmployeeDetail &&
        <PopupEmployeeDetail
          id={employeeDetailCtrlId[0]}
          showModal={true}
          employeeId={employeeId}
          listEmployeeId={[employeeId]}
          toggleClosePopupEmployeeDetail={onClosePopupEmployeeDetail}
          resetSuccessMessage={() => { }}
          openFromModal={true} />
      }
    </div>
  );
}

const mapStateToProps = ({ authentication, taskList, dynamicList }: IRootState) => ({
  onlineNumber: authentication.online,
  listLicense: authentication.account.licenses,
  errorItems: taskList.errorItems,
  fieldInfos: dynamicList.data.has(TASK_TABLE_ID) ? dynamicList.data.get(TASK_TABLE_ID).fieldInfos : {},
  actionType: taskList.action,
  errorMessage: taskList.errorMessage,
});

const mapDispatchToProps = {
  checkOnline,
  resetOnline
};
type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TaskCard);