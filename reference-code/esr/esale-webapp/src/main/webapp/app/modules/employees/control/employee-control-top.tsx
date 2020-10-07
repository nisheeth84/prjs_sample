import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import { translate } from 'react-jhipster';
import { hasAnyAuthority } from 'app/shared/auth/private-route';
import { AUTHORITIES } from 'app/config/constants';
import ConfirmDialog from 'app/shared/layout/dialog/confirm-dialog';
import { ScreenMode } from 'app/config/constants';
import {
  handleInitLocalMenu,
  handleDeleteGroup,
  handleUpdateAutoGroup,
  handleDeleteDepartment
} from '../control/employee-control-sidebar.reducer';
import {
  handleRemoveManager,
  handleLeaveGroup,
  handleDownloadEmployees,
  handleCreateUserLogin
} from '../list/employee-list.reducer';
import useEventListener from 'app/shared/util/use-event-listener';
import { SEARCH_MODE, EMPLOYEE_LIST_ID, SHARE_GROUP_MODES, EMPLOYEE_ACTION_TYPES, EMPLOYEE_VIEW_MODES, MY_GROUP_MODES } from '../constants';
// import UploadProcessing from 'app/modules/upload/index';
import { SERVICE_ID_IMPORT } from 'app/config/constants';

interface IControlTopProps extends StateProps, DispatchProps {
  toggleSwitchDisplay,
  toggleOpenPopupSearch,
  toggleOpenModalCreateEmployee?: any,
  toggleOpenInviteEmployees,
  toggleOpenAddToGroupModal: () => void,
  toggleOpenAddEditMyGroupModal: (mode, listId, isAutoGroupParam, listMembers) => void,
  toggleOpenCreateMyGroup: () => void,
  toggleSwitchEditMode?: (isEdit: boolean) => void,
  toggleUpdateInEditMode?: () => void,
  enterSearchText?: (text) => void,
  textSearchOld?: string,
  textSearch?: string,
  modeDisplay?: ScreenMode,
  listMenuType?: any,
  sidebarCurrentId?,
  searchMode: any,
  conDisplaySearchDetail: any,
  setConDisplaySearchDetail: () => void,
  orderBy,
  toggleOpenMoveToGroupModal,
  toggleOpenDepartmentPopup,
  toggleOpenManagerSettingPopup,
  reloadScreen,
  openGroupModal?: (groupMode, groupId, isOwnerGroup, isAutoGroup, groupMember) => void
  groupName?
  openSwitchDisplay?: boolean,
  toggleOpenPopupSetting
  selectedTargetType: any;
  selectedTargetId: any;
  recordCheckList: any,
  targetDepartment?: any;
  toggleOpenHelpPopup
}

interface IDynamicListStateProps {
  authorities,
}

type IEmployeeControlTopProps = IControlTopProps & IDynamicListStateProps;

const EmployeeControlTop = (props: IEmployeeControlTopProps) => {
  const [valueTextSearch, setValueTextSearch] = useState(props.textSearch);
  const [valueTextSearchOld, setValueTextSearchOld] = useState(props.textSearch);
  const [showGroupOption, setShowGroupOption] = useState(false);
  const [showRegistrationOption, setShowRegistrationOption] = useState(false);
  const [isShowConfirmDeleteResult, setShowConfirmDeleteResult] = useState(false);
  const [groupName, setGroupName] = useState(null);

  const [lstGroupMember, setLstGroupMember] = useState([]);
  const optionRef = useRef(null);
  const registerRef = useRef(null);
  const { listMenuType, sidebarCurrentId } = props;
  const isAdmin = hasAnyAuthority(props.authorities, [AUTHORITIES.ADMIN]);
  // request param for Import CSV Screen
  const [serviceIdForImport, setServiceIdForImport] = useState(null);

  useEffect(() => {
    setValueTextSearch(props.textSearch);
  }, [props.textSearch])
  /**
   * Reload screen after leaving group/updating auto group/removing manager
   */
  useEffect(() => {
    if (props.leaveGroupEmployeesId !== null || props.updatedAutoGroupId !== null || props.removeManagerEmployeesId !== null) {
      props.reloadScreen();
    }
  }, [props.leaveGroupEmployeesId, props.updatedAutoGroupId, props.removeManagerEmployeesId]);

  useEffect(() => {
    if (props.urlEmployeesDownload) {
      // download file csv when api response an url
      window.open(props.urlEmployeesDownload);
    }
  }, [props.urlEmployeesDownload]);

  useEffect(() => {
    if (listMenuType.isMyGroup) {
      props.localMenu.initializeLocalMenu.myGroups.map((myGroup) => {
        if (myGroup.groupId === sidebarCurrentId) {
          setGroupName(myGroup.groupName);
        }
      });
    } else if (listMenuType.isSharedGroup) {
      props.localMenu.initializeLocalMenu.sharedGroups.map((sharedGroup) => {
        if (sharedGroup.groupId === sidebarCurrentId) {
          setGroupName(sharedGroup.groupName);
        }
      });
    } else {
      setGroupName(null);
    }
    setShowGroupOption(false);
  }, [sidebarCurrentId]);

  useEffect(() => {
    // TODO action sendMail
  }, [props.listSendMailResponse]);

  const onClickSwitchDiaplay = (event) => {
    props.toggleSwitchDisplay();
    event.preventDefault();
  };
  const onClickOpenPopupSearch = (event) => {
    props.toggleOpenPopupSearch();
    event.preventDefault();
  };

  const onClickOpenMoveToGroupModal = (event) => {
    props.toggleOpenMoveToGroupModal();
    event.preventDefault();
  };
  const onClickOpenDepartmentPopup = (isRegistDepartment) => {
    props.toggleOpenDepartmentPopup(isRegistDepartment);
  };

  const onClickOpenManagerSettingPopup = (event) => {
    props.toggleOpenManagerSettingPopup();
    event.preventDefault();
  };

  const onClickOpenCreateMyGroup = (event) => {
    props.toggleOpenCreateMyGroup();
  };

  const onClickOpenModalCreateEmployee = (event) => {
    setShowRegistrationOption(false);
    props.toggleOpenModalCreateEmployee(EMPLOYEE_ACTION_TYPES.CREATE, EMPLOYEE_VIEW_MODES.EDITABLE);
    event.preventDefault();
  }

  const onBlurTextSearch = (event) => {
    if (props.enterSearchText && valueTextSearchOld !== valueTextSearch.trim()) {
      setValueTextSearchOld(valueTextSearch.trim());
      props.enterSearchText(valueTextSearch.trim());
    }
  }
  const onClickIConSearch = () => {
    if (props.enterSearchText) {
      setValueTextSearchOld(valueTextSearch.trim());
      props.enterSearchText(valueTextSearch.trim());
    }
  }
  const handleKeyPress = (event) => {
    if (event.charCode === 13) {
      onClickIConSearch();
    }
  }

  /**
   * Check having any record was checked or not
   */
  const hasRecordCheck = () => {
    return props.recordCheckList && props.recordCheckList.length > 0 && props.recordCheckList.filter(e => e.isChecked).length > 0;
  }
  const setListGroupMember = () => {
    const lstMember = [];
    if (props.recordCheckList) {
      for (let i = 0; i < props.recordCheckList.length; i++) {
        lstMember.push({ employeeId: props.recordCheckList[i].employeeId })
      }
    }
    setLstGroupMember(lstMember);
  }

  /**
   * get checked employees in list from recordCheckList
   */
  const getCheckedEmployeesFromCheckList = () => {
    const listCheckedIds = [];
    const listUpdatedDates = [];
    props.recordCheckList.forEach(e => {
      if (e.isChecked) {
        listCheckedIds.push(e.employeeId);
        listUpdatedDates.push(e.updatedDate);
      }
    });
    return { listCheckedIds, listUpdatedDates };
  }

  const getNameEmployees = (id) => {
    let rs = '';
    const propsEmployeesList = props.employeesList && props.employeesList.employees && props.employeesList.employees.employees;
    propsEmployeesList && propsEmployeesList.map(item => {
      if (item.employee_id === id) {
        rs = `${item.employee_surname}${item.employee_name ? ' ' + item.employee_name : ''}`;
      }
    })
    return rs;
  }

  const checkEmployeeIds = (ids) => {
    if (ids && ids.length > 1) {
      return true;
    }
    return false;
  }

  const showConfirmDialog = (msg) => {
    return ConfirmDialog({
      title: (<>{translate('employees.top.dialog.title-delete-group')}</>),
      message: msg,
      confirmText: translate('employees.top.dialog.confirm-delete-group'),
      confirmClass: "button-red",
      cancelText: translate('employees.top.dialog.cancel-text'),
      cancelClass: "button-cancel"
    });
  }

  const deleteByIcon = async () => {
    // show common confirm dialog
    const employeeIds = getCheckedEmployeesFromCheckList().listCheckedIds;
    const itemName = getNameEmployees(employeeIds[0]);
    let result = null;
    if (itemName) {
      const msg = checkEmployeeIds(employeeIds) ? translate('messages.WAR_COM_0002', { 0: employeeIds.length }) : translate('messages.WAR_COM_0001', { itemName })
      result = await showConfirmDialog(msg);
    } else if (props.targetDepartment) {
      result = await showConfirmDialog(translate('messages.WAR_COM_0001', { itemName: props.targetDepartment.departmentName }));
    } else if (groupName) {
      result = await showConfirmDialog(translate('messages.WAR_COM_0001', { itemName: groupName }));
    }
    if (result) {
      // in case did not check any record
      if (!hasRecordCheck()) {
        if (listMenuType.isDepartment) {
          props.handleDeleteDepartment(sidebarCurrentId);
        }
        if (listMenuType.isMyGroup || listMenuType.isSharedGroup) {
          props.handleDeleteGroup(sidebarCurrentId);
          props.groupName(groupName);
        }
        // in case checked at least 1 record
      }
    }
  }

  const sendEmails = () => {
    const employeeIds = getCheckedEmployeesFromCheckList().listCheckedIds;
    props.handleCreateUserLogin(employeeIds);
    props.reloadScreen();
  }

  const updateAutoGroupByIcon = async () => {
    const result = await ConfirmDialog({
      title: (<>{translate('employees.top.dialog.title-auto-group')}</>),
      message: translate('messages.WAR_EMP_0004', { groupName }),
      confirmText: translate('employees.top.dialog.confirm-auto-group'),
      confirmClass: "button-red",
      cancelText: translate('employees.top.dialog.cancel-text'),
      cancelClass: "button-cancel"
    });
    if (result) {
      props.handleUpdateAutoGroup(sidebarCurrentId);
    }
  }

  const leaveGroupByIcon = async () => {
    if (hasRecordCheck()) {
      const result = await ConfirmDialog({
        title: (<>{translate('employees.top.dialog.title-leave-group')}</>),
        message: translate('employees.top.dialog.message-leave-group'),
        confirmText: translate('employees.top.dialog.confirm-leave-group'),
        confirmClass: "button-red",
        cancelText: translate('employees.top.dialog.cancel-text'),
        cancelClass: "button-cancel"
      });
      if (result) {
        const listCheckedIds = getCheckedEmployeesFromCheckList().listCheckedIds;
        props.handleLeaveGroup(sidebarCurrentId, listCheckedIds);
      }
    }
  }

  const removeManagerByIcon = async () => {
    if (hasRecordCheck()) {
      const result = await ConfirmDialog({
        title: (<>{translate('employees.top.dialog.title-remove-manager')}</>),
        message: translate('employees.top.dialog.message-remove-manager'),
        confirmText: translate('employees.top.dialog.confirm-remove-manager'),
        confirmClass: "button-red",
        cancelText: translate('employees.top.dialog.cancel-text'),
        cancelClass: "button-cancel"
      });
      if (result) {
        const listCheckedIds = getCheckedEmployeesFromCheckList().listCheckedIds;
        props.handleRemoveManager(listCheckedIds);
      }
    }
  }

  const downloadEmployeesByIcon = () => {
    if (hasRecordCheck()) {
      const listCheckedIds = getCheckedEmployeesFromCheckList().listCheckedIds;
      props.handleDownloadEmployees(listCheckedIds, props.orderBy, props.selectedTargetType, props.selectedTargetId);
    }
  }

  /**
   * Function returns the class name for enable or disable status of the icon
   * @param checkAuthority
   */
  const isDisable = (checkAuthority: boolean) => {
    return (checkAuthority ? "" : "disable");
  }

  /**
   * Handle for clicking the outside of dropdown
   * @param e
   */
  const handleClickOutsideRegistration = (e) => {
    if (registerRef.current && !registerRef.current.contains(e.target)) {
      setShowRegistrationOption(false);
    }
  }

  useEventListener('click', handleClickOutsideRegistration);

  const handleClickOutsideOption = (e) => {
    if (optionRef.current && !optionRef.current.contains(e.target)) {
      setShowGroupOption(false);
    }
  }

  useEventListener('click', handleClickOutsideOption);

  const onClickOpenInviteEmployees = (event) => {
    props.toggleOpenInviteEmployees();
    event.preventDefault();
  }

  /**
   * Handle for rendering registration option
   */
  const renderRegistrationOption = () => {
    return (
      <div className="box-select-option z-index-global-2">
        <ul>
          <li><a onClick={onClickOpenModalCreateEmployee}>{translate('employees.top.title.register-employee')}</a></li>
          <li><a href="" onClick={(event) => { onClickOpenInviteEmployees(event); setShowRegistrationOption(!showRegistrationOption) }} >{translate('employees.top.title.invite-employee')}</a></li>
          <li>
            <a onClick={(event) => {
              setShowRegistrationOption(false);
              onClickOpenDepartmentPopup(true);
              event.preventDefault()
            }} >
              {translate('employees.top.title.register-department')}
            </a>
          </li>
          <li><a onClick={() => { setShowRegistrationOption(false); setServiceIdForImport(SERVICE_ID_IMPORT.EMPLOYEE) }}>{translate('employees.top.title.import-employee')}</a></li>
          <li><a onClick={() => { setShowRegistrationOption(false); setServiceIdForImport(SERVICE_ID_IMPORT.DEPARTMENT_EMPLOYEE) }}>{translate('employees.top.title.import-department')}</a></li>
        </ul>
      </div>
    )
  }

  /**
   * Handle for clicking on the sidebar menu without selecting any record
   */
  const renderOnClickSidebarElement = () => {
    return (
      <>
        {/* condition to display update auto group icon */}
        {((listMenuType.isSharedGroup && listMenuType.isAutoGroup && listMenuType.isOwner)
          || (listMenuType.isMyGroup && listMenuType.isAutoGroup)) &&
          <a className="icon-primary icon-update" onClick={updateAutoGroupByIcon} >
            <label className="tooltip-common"><span>{translate('employees.top.label-tooltip.button-update')}</span></label>
          </a>}
        {/* condition to display/hide edit & delete icons when click department */}
        {listMenuType.isDepartment && isAdmin &&
          <>
            <a className={"icon-primary icon-edit " + isDisable(isAdmin)} onClick={(event) => isAdmin ? onClickOpenDepartmentPopup(false) : null} >
              <label className="tooltip-common"><span>{translate('employees.top.label-tooltip.button-edit')}</span></label>
            </a>
            <a className={"icon-primary icon-erase " + isDisable(isAdmin)} onClick={isAdmin ? deleteByIcon : null}>
              <label className="tooltip-common"><span>{translate('employees.top.label-tooltip.button-erase')}</span></label>
            </a>
          </>}
        {/* condition to display edit icon */}
        {(listMenuType.isMyGroup || (listMenuType.isSharedGroup && listMenuType.isOwner)) &&
          <a className="icon-primary icon-edit "
            onClick={() => listMenuType.isMyGroup ?
              props.toggleOpenAddEditMyGroupModal(MY_GROUP_MODES.MODE_EDIT_GROUP, sidebarCurrentId ,listMenuType.isAutoGroup, null)
              : props.openGroupModal(SHARE_GROUP_MODES.MODE_EDIT_GROUP, sidebarCurrentId, false, listMenuType.isAutoGroup, null)} >
            <label className="tooltip-common"><span>{translate('employees.top.label-tooltip.button-edit')}</span></label></a>}
        {/* condition to display delete icon */}
        {(listMenuType.isMyGroup || (listMenuType.isSharedGroup && listMenuType.isOwner)) &&
          <a className="icon-primary icon-erase " onClick={deleteByIcon} >
            <label className="tooltip-common"><span>{translate('employees.top.label-tooltip.button-erase')}</span></label>
          </a>}
        {/* condition to display copy icon */}
        {(listMenuType.isMyGroup || listMenuType.isSharedGroup) &&
          <a className="icon-primary icon-group-duplication"
            onClick={() => listMenuType.isMyGroup ?
              props.toggleOpenAddEditMyGroupModal(MY_GROUP_MODES.MODE_COPY_GROUP,  sidebarCurrentId ,listMenuType.isAutoGroup, null)
              : props.openGroupModal(SHARE_GROUP_MODES.MODE_COPY_GROUP, sidebarCurrentId, false, listMenuType.isAutoGroup, null)} >
            <label className="tooltip-common"><span>{translate('employees.top.label-tooltip.button-copy-group')}</span></label>
          </a>}
        {(listMenuType.isMyGroup || listMenuType.isSharedGroup) && listMenuType.isMyGroup &&
          <a className="icon-primary ic-convert-shared-list"
            onClick={() => props.openGroupModal(SHARE_GROUP_MODES.MODE_SWICH_GROUP_TYPE, sidebarCurrentId, false, listMenuType.isAutoGroup, null)} >
            <label className="tooltip-common"><span>{translate('employees.top.label-tooltip.button-top-convert-sharelist')}</span></label>
          </a>}
      </>
    )
  }

  /**
   * Handle for selecting any record
   */
  const renderOnCheckRecord = () => {
    if (!listMenuType.isQuitJob) {
      return (
        <>
          <div className="button-pull-down-parent" ref={optionRef}>
            <a className="button-pull-down"
              onClick={() => { setListGroupMember(); setShowGroupOption(!showGroupOption) }}>{translate('employees.top.title.btn-group-operation')}</a>
            {showGroupOption &&
              <div className="box-select-option">
                <ul>
                  {/* if group is not auto group => display 1 more option: move to group */}
                  {(listMenuType.isMyGroup || listMenuType.isSharedGroup) && !listMenuType.isAutoGroup &&
                    <li><a href="" onClick={onClickOpenMoveToGroupModal}>
                      {translate('employees.top.title.move-group')}
                    </a></li>}

                  {/* end [moveToGroup] option */}
                  <li><a onClick={() => { setShowGroupOption(false); props.toggleOpenAddToGroupModal(); }}>
                    {translate('employees.top.title.add-to-group')}
                  </a></li>
                  <li><a onClick={grpMode => { setShowGroupOption(false); props.toggleOpenAddEditMyGroupModal(MY_GROUP_MODES.MODE_CREATE_GROUP, null, false, lstGroupMember); }}>
                    {translate('employees.top.title.create-my-group')}
                  </a></li>
                  <li><a onClick={grpMode => { setShowGroupOption(false); props.openGroupModal(SHARE_GROUP_MODES.MODE_CREATE_GROUP_LOCAL, null, false, false, lstGroupMember); }}>
                    {translate('employees.top.title.create-shared-group')}
                  </a></li>
                  {/* if group is not auto group => display 1 more option: leave group */}
                  {(listMenuType.isMyGroup || listMenuType.isSharedGroup) && !listMenuType.isAutoGroup &&
                    <li><a onClick={() => { setShowGroupOption(false); leaveGroupByIcon(); }}>
                      {translate('employees.top.title.leave-group')}
                    </a></li>}
                  {/* end [leaveGroup] option */}
                </ul>
              </div>}
          </div>
          {/* show feature icons when checking at least 1 record in list, except quit-job employee */}
          <a className={"icon-primary icon-person-check " + isDisable(isAdmin)} onClick={isAdmin ? onClickOpenManagerSettingPopup : null} >
            <label className="tooltip-common"><span>{translate('employees.top.label-tooltip.button-set-manager')}</span></label>
          </a>
          <a className={"icon-primary icon-person-delete " + isDisable(isAdmin)} onClick={isAdmin ? removeManagerByIcon : null} >
            <label className="tooltip-common"><span>{translate('employees.top.label-tooltip.button-remove-manager')}</span></label>
          </a>
          {
            isAdmin ?
              <a className="icon-primary icon-person-email" onClick={sendEmails}>
                <i className="fa fa-envelope"></i>
                <label className="tooltip-common"><span>{translate('employees.top.label-tooltip.button-send-email')}</span></label>
              </a>
              : null
          }
          <a className="icon-primary icon-import" onClick={downloadEmployeesByIcon} >
            <label className="tooltip-common"><span>{translate('employees.top.label-tooltip.button-download')}</span></label>
          </a>
        </>
      )
    } else if (listMenuType.isQuitJob) {
      return (
        // show feature icons when checking at least 1 record in list, using for quit-job employees
        <>
          <a className={"icon-primary icon-erase " + isDisable(isAdmin)} onClick={isAdmin ? deleteByIcon : null} >
            <label className="tooltip-common"><span>{translate('employees.top.label-tooltip.button-erase')}</span></label>
          </a>
          <a className="icon-primary icon-import" onClick={downloadEmployeesByIcon} >
            <label className="tooltip-common"><span>{translate('employees.top.label-tooltip.button-download')}</span></label>
          </a>
        </>
      )
    }
  }

  return (
    <>
      <div className={`control-top ${hasRecordCheck() ? 'has-check' : null}`}>
        <div className="left">
          <div className="button-shadow-add-select-wrap custom z-index-1" ref={registerRef}>
            {isAdmin &&
              <a className="button-shadow-add-select" onClick={onClickOpenModalCreateEmployee}>
                {translate('employees.top.title.btn-registration')}
              </a>}
            {isAdmin && <span className="button-arrow" onClick={() => setShowRegistrationOption(!showRegistrationOption)}></span>}
            {showRegistrationOption && renderRegistrationOption()}
          </div>
          {!hasRecordCheck() && renderOnClickSidebarElement()}
          {hasRecordCheck() && renderOnCheckRecord()}
        </div>
        <div className="right">
          {(listMenuType.isAllEmployees || listMenuType.isDepartment || listMenuType.isQuitJob || listMenuType.isMyGroup
            || (listMenuType.isSharedGroup && listMenuType.isOwner)) &&
            <a onClick={onClickSwitchDiaplay} className={props.openSwitchDisplay ? "icon-primary icon-switch-display active" : "icon-primary icon-switch-display"} >
              <label className="tooltip-common"><span>{translate('employees.top.label-tooltip.button-switch-display')}</span></label>
            </a>
          }
          {(props.searchMode === SEARCH_MODE.CONDITION && props.conDisplaySearchDetail) ? (
            <div className="search-box-button-style">
              <button className="icon-search"><i className="far fa-search" /></button>
              <input type="text" placeholder={translate('employees.top.place-holder.search')} />
              <button className="icon-fil" onClick={onClickOpenPopupSearch} />
              <div className="tag">
                {translate('employees.top.place-holder.searching')}
                <button className="close" onClick={() => { setValueTextSearch(''); props.setConDisplaySearchDetail() }}>×</button>
              </div>
            </div>
          ) : (
              <div className="search-box-button-style">
                <button className="icon-search" onClick={onClickIConSearch}><i className="far fa-search" /></button>
                <input type="text" placeholder={translate('employees.top.place-holder.search')} defaultValue={props.textSearch} value={valueTextSearch}
                  onChange={(e) => setValueTextSearch(e.target.value)} onBlur={onBlurTextSearch} onKeyPress={handleKeyPress} />
                <button className="icon-fil" onClick={onClickOpenPopupSearch} />
              </div>
            )}
          {props.modeDisplay === ScreenMode.DISPLAY && isAdmin &&
            <a className="button-primary button-simple-edit ml-2" onClick={(e) => props.toggleSwitchEditMode(true)}>{translate('employees.top.title.btn-edit')}</a>}
          {props.modeDisplay === ScreenMode.EDIT &&
            <button className="button-cancel" type="button" onClick={(e) => props.toggleSwitchEditMode(false)}>{translate('employees.top.title.btn-cancel')}</button>}
          {props.modeDisplay === ScreenMode.EDIT &&
            <button className="button-save" type="button" onClick={(e) => props.toggleUpdateInEditMode()}>{translate('employees.top.title.btn-save')}</button>}
          <a onClick={props.toggleOpenHelpPopup} className="icon-small-primary icon-help-small" />
          {isAdmin && <a onClick={props.toggleOpenPopupSetting} className="icon-small-primary icon-setting-small" />}
        </div>
      </div>
      {/* {serviceIdForImport && <UploadProcessing serviceId={serviceIdForImport} toggleCloseImportScreen={() => { setServiceIdForImport(null) }} />} */}
    </>
  );
}

const mapStateToProps = ({ dynamicList, authentication, employeeControlSidebar, employeeList }: IRootState) => ({
  authorities: authentication.account.authorities,
  localMenu: employeeControlSidebar.localMenuData,
  updatedAutoGroupId: employeeControlSidebar.updatedAutoGroupId,
  employeesList: employeeList,
  leaveGroupEmployeesId: employeeList.leaveGroupEmployeesId,
  removeManagerEmployeesId: employeeList.removeManagerEmployeesId,
  urlEmployeesDownload: employeeList.employeesInfo,
  listSendMailResponse: employeeList.listSendMailResponse,
});

const mapDispatchToProps = {
  handleDeleteGroup,
  handleUpdateAutoGroup,
  handleLeaveGroup,
  handleRemoveManager,
  handleInitLocalMenu,
  handleDeleteDepartment,
  handleDownloadEmployees,
  handleCreateUserLogin,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EmployeeControlTop)
