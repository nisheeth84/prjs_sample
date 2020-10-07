import React from 'react';
import { Storage, translate } from 'react-jhipster';
import { TASK_ACTION_TYPES, TASK_VIEW_MODES } from '../constants';
import { USER_FORMAT_DATE_KEY, APP_DATE_FORMAT } from 'app/config/constants';
import dateFnsFormat from 'date-fns/format';

export interface IFieldInputSubtask {
  placeHolder: string;
  label: string;
  listTask: any[];
  toggleOpenModalCreateSubTask: (type, mode) => void;
  deleteSubtask: (taskId) => void;
  isRequired: boolean;
  isDisabled?: any;
}

const FieldInputSubtask = (props: IFieldInputSubtask) => {
  /**
   * open subtask create
   * @param event
   */
  const onClickOpenModalCreateSubTask = event => {
    props.toggleOpenModalCreateSubTask(TASK_ACTION_TYPES.CREATE, TASK_VIEW_MODES.EDITABLE);
    event.preventDefault();
  };

  /**
   * delete subtask
   * @param event
   * @param taskId
   */
  const onClickDeleteTask = (event, taskId) => {
    props.deleteSubtask(taskId);
    event.preventDefault();
  };

  const userFormat = Storage.session.get(USER_FORMAT_DATE_KEY, APP_DATE_FORMAT);

  /**
   * render one item
   */
  const renderItemSubtask = () => {
    return props.listTask.map((item, index) => {
      const finishDate = item.finishDate ? dateFnsFormat(item.finishDate, userFormat) : '';
      return (
        <div className={`item active col-lg-6 subtask-item ${index % 2 !== 0 ? 'subtask-second' : ''}`} key={`subtask-${item.taskId}`}>
          <div className="content-subtask">
            <div className="text text1 text-nowrap d-inline-block">
              {`${item.taskName}`}
            </div>
            &nbsp;
            <div className='min-width-fitcontent'>{`${item.finishDate ? `(${finishDate})` : ''}`}</div>
          </div>
          <button type="button" className="close" onKeyUp={event => event.keyCode === 13 ? onClickDeleteTask(event, item.taskId) : null}>
            <a onClick={event => onClickDeleteTask(event, item.taskId)}>×</a>
          </button>
          <div className="box-select-option box-wrap">
            <span>
              {`${item.taskName}`}
              <br/>
              {`${item.finishDate ? `(${finishDate})` : ''}`}
            </span>
          </div>
        </div>
      );
    });
  };

  return (
    <>
      <label>
        {props.label}
        {props.isRequired && <label className="label-red">{translate('tasks.required')}</label>}
      </label>
      <a
        onClick={props.isDisabled ? null : onClickOpenModalCreateSubTask}
        title=""
        className={`button-add-subtask ${props.isDisabled ? 'disable' : ''}`}
      >{translate('tasks.create-edit.placeholder.subtask')}</a>
      <div className="show-wrap-task wrap-info-subtask">
        <div className="show-wrap">
          <div className="row subtask-row">{renderItemSubtask()}</div>
        </div>
      </div>
    </>
  );
};

export default FieldInputSubtask;
