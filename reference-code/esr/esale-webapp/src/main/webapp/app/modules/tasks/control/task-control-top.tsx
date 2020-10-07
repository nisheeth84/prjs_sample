import { TASK_ACTION_TYPES, STATUS_TASK } from 'app/modules/tasks/constants'
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import { translate } from 'react-jhipster';
import { hasAnyAuthority } from 'app/shared/auth/private-route';
import { AUTHORITIES, ScreenMode } from 'app/config/constants';
import { TASK_TABLE_ID } from 'app/modules/tasks/constants';
import { SEARCH_MODE } from 'app/modules/employees/constants';

interface ITaskControlTop extends DispatchProps, StateProps {
  // event open component SwitchDisplay
  toggleSwitchDisplay: () => void,
  // event open component PopupSearch
  toggleOpenPopupSearch: () => void,
  // event typing search
  enterSearchText?: (text) => void,
  // value of text in search box
  textSearch?: string,
  authorities,
  // event click change tasks status
  onUpdateListTaskStatus: (newStatus: number) => void,
  // event click button delete tasks
  onDeleteTask: () => void
  conDisplaySearchDetail: any,
  setConDisplaySearchDetail: (boolean) => void,
  // event click create task
  handleShowModalCreateEditTask: (taskActionType: number, taskId: number, parentTaskId: number) => void
  handleShowModalCreateMilestone: () => void,
  handleChangeMode: (isViewCard) => void,
  toggleSwitchEditMode?: (isEdit: boolean) => void,
  toggleUpdateInEditMode?: () => void,
  searchMode: any,
  openCardView: boolean,
  modeDisplay?: ScreenMode,
  openSwitcher?: boolean,
  toggleOpenHelpPopup,
  toggleOpenPopupSetting,
  openHelpPopup: boolean,
}

/**
 * Component in top side of screen task list
 * @param props 
 */
const TaskControlTop = (props: ITaskControlTop) => {
  const [valueTextSearch, setValueTextSearch] = useState(props.textSearch);
  const [openDropdownCreateTask, setOpenDropdownCreateTask] = useState(false)
  const isAdmin = hasAnyAuthority(props.authorities, [AUTHORITIES.ADMIN]);
  const { toggleOpenHelpPopup } = props;

  /**
   * event click search popup
   * @param event 
   */
  const onClickOpenPopupSearch = (event) => {
    props.toggleOpenPopupSearch();
    event.preventDefault();
  };

  /**
   * click icon search to search
   * @param event 
   */
  const handleClickIconSearch = (event) => {
    if (props.enterSearchText) {
      props.enterSearchText(valueTextSearch.trim());
    }
  }

  /**
   *  enter to search
   * @param event 
   */
  const handleKeyPress = (event) => {
    if (event.charCode === 13) {
      if (props.enterSearchText) {
        props.enterSearchText(valueTextSearch.trim());
      }
    }
  }

  /**
   * button setting is disable
   * @param checkAuthority 
   */
  const getDisable = (checkAuthority: boolean) => {
    return (checkAuthority ? "" : "disable");
  }


  /**
   * common switch view in list
   */
  const onClickSwitchDisplay = () => {
    props.toggleSwitchDisplay();
  }

  /**
   * event updateListTaskStatus
   * @param newStatus 
   */
  const onUpdateListTaskStatus = (newStatus) => {
    props.onUpdateListTaskStatus(newStatus)
  }

  /**
   * event deletes tasks
   */
  const onClickDeleteTask = () => {
    props.onDeleteTask()
  }

  return <div className="control-top">
    <div className="left">
      <div className="button-shadow-add-select-wrap">
        <a className="button-shadow-add-select" onClick={() => { props.handleShowModalCreateEditTask(TASK_ACTION_TYPES.CREATE, null, null); setOpenDropdownCreateTask(false) }}>
          {translate("tasks.list.createtaskbutton")}
        </a>
        <span className="button-arrow" onClick={() => setOpenDropdownCreateTask(!openDropdownCreateTask)}> </span>
        {openDropdownCreateTask && <div className="box-select-option ">
          <ul>
            <li onClick={() => { props.handleShowModalCreateEditTask(TASK_ACTION_TYPES.CREATE, null, null); setOpenDropdownCreateTask(false) }}>
              <a>{translate("tasks.list.createtask")}</a>
            </li>
            <li onClick={() => { props.handleShowModalCreateMilestone(); setOpenDropdownCreateTask(false) }}>
              <a>{translate("tasks.list.registermilestone")}</a>
            </li>
            <li>
              <a>{translate("tasks.list.importtask")}</a>
            </li>
          </ul>
        </div>
        }
      </div>
      {props.recordCheckList && props.recordCheckList.length > 0 && props.recordCheckList.filter(t => t.isChecked).length > 0 && <>
        <a onClick={() => onUpdateListTaskStatus(STATUS_TASK.NOT_STARTED)} className="button-primary button-simple-edit">{translate("tasks.list.top.updatetonotstart")}</a>
        <a onClick={() => onUpdateListTaskStatus(STATUS_TASK.WORKING)} className="button-primary button-simple-edit">{translate("tasks.list.top.updatetoworking")}</a>
        <a onClick={() => onUpdateListTaskStatus(STATUS_TASK.COMPLETED)} className="button-primary button-simple-edit">{translate("tasks.list.top.updatetofinish")}</a>
        <a onClick={onClickDeleteTask} className="icon-primary icon-erase" />
      </>}
    </div>
    <div className="right">
      {props.openCardView ? <a onClick={() => props.handleChangeMode(false)} className="icon-primary icon-list-view" /> :
        <>
          <a onClick={onClickSwitchDisplay} className={props.openSwitcher ? "icon-primary icon-switch-display active" : "icon-primary icon-switch-display"} />
          <a onClick={() => props.handleChangeMode(true)} className="icon-primary icon-board-view ml-2" />
        </>}
      <div className="search-box-button-style">
        <button className="icon-search" onClick={handleClickIconSearch}><i className="far fa-search" /></button>
        <input type="text" placeholder={translate("tasks.list.top.searchplaceholder")} value={valueTextSearch}
          onChange={(e) => setValueTextSearch(e.target.value)} onKeyPress={handleKeyPress} />
        <button className="icon-fil" onClick={onClickOpenPopupSearch} />
        {(props.searchMode === SEARCH_MODE.CONDITION && props.conDisplaySearchDetail) &&
          <div className="tag">
            {translate('employees.top.place-holder.searching')}
            <button className="close" onClick={() => props.setConDisplaySearchDetail(false)}>×</button>
          </div>}
      </div>
      {!props.openCardView && props.modeDisplay === ScreenMode.DISPLAY && isAdmin &&
        <a className="button-primary button-simple-edit ml-2" onClick={(e) => props.toggleSwitchEditMode(true)}>{translate('tasks.list.top.title.btn-edit')}</a>}
      {props.modeDisplay === ScreenMode.EDIT &&
        <button className="button-cancel" type="button" onClick={(e) => props.toggleSwitchEditMode(false)}>{translate('tasks.list.top.title.btn-cancel')}</button>}
      {props.modeDisplay === ScreenMode.EDIT &&
        <button className="button-save" type="button" onClick={(e) => props.toggleUpdateInEditMode()}>{translate('tasks.list.top.title.btn-save')}</button>}
      <a onClick={toggleOpenHelpPopup} className={"icon-small-primary icon-help-small" + (props.openHelpPopup ? " active" : "")} />
      {isAdmin && <a onClick={props.toggleOpenPopupSetting} className="icon-small-primary icon-setting-small " />}
    </div>
  </div>
}

const mapStateToProps = ({ taskList, authentication, dynamicList }: IRootState) => ({
  tasks: taskList.tasks,
  authorities: authentication.account.authorities,
  recordCheckList: dynamicList.data.has(TASK_TABLE_ID) ? dynamicList.data.get(TASK_TABLE_ID).recordCheckList : [],
});

const mapDispatchToProps = {
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
export default connect(mapStateToProps, mapDispatchToProps)(TaskControlTop);