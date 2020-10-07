import React, { useState, useEffect, useRef } from 'react';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { translate } from 'react-jhipster';
import { MENU_TYPE, SELECT_TARGET_TYPE } from '../constants';
import DepartmentList from './employee-control-department-list';
import GroupCard from './employee-control-group-card';
import {
  handleUpdateAutoGroup,
  handleInitLocalMenu,
  handleChangeDepartmentOrder,
  handleDeleteDepartment,
  handleDeleteGroup
} from './employee-control-sidebar.reducer';
import { SHARE_GROUP_MODES, MY_GROUP_MODES } from '../constants';
import CategoryDragLayer from '../../../shared/layout/menu/category-drag-layer';
import _ from 'lodash';
import DialogDirtyCheck, { DIRTYCHECK_PARTTERN } from 'app/shared/layout/common/dialog-dirty-check';
import { hasAnyAuthority } from 'app/shared/auth/private-route';
import { AUTHORITIES } from 'app/config/constants';
import { Resizable } from "re-resizable";
import Popover from 'app/shared/layout/common/Popover';

export interface IEmployeeControlSidebarProps extends StateProps, DispatchProps {
  toggleOpenModalCreateGroup,
  toggleOpenModalChangeGroupType;
  updateFiltersSearch?: (filters, selectedTargetType, listViewCondition) => void;
  toggleShowFeaturesIcon?: (types: number, isAutoGroup: boolean, isOwner: boolean) => void;
  toggleOpenAddEditMyGroupModal?: (myListModalMode, currentGroupId, isAutoGroup, listMembers) => void;
  sidebarCurrentId;
  selectedTargetType;
  setTypeGroup;
  departmentName?;
  openGroupModal?: (groupMode, groupId, isOwnerGroup, isAutoGroup, groupMember) => void;
  toggleOpenDepartmentPopup?;
  getGroupName?: (groupName) => any;
  initializeListInfo?
  handleGetInitializeListInfo?: (fieldBelong) => void
  changeSelectedSidebar?: ({ type, cardId }) => void;
  setTargetDepartment?: (targetDepartment) => void;
  dirtyCheck?: any;
}

const EmployeeControlSidebar = (props: IEmployeeControlSidebarProps) => {
  const [activeCard, setActiveCard] = useState({ type: MENU_TYPE.ALL_EMPLOYEES, cardId: null, participantType: null });
  const [showSidebar, setShowSidebar] = useState(true);
  const dndDepartments = [];
  const [isShowMyGroup, setShowMyGroup] = useState(true);
  const [isShowShareGroup, setShowShareGroup] = useState(true);

  const MAX_RECORD_DISPLAY = 5;
  const [departmentsDisplay, setDepartmentsDisplay] = useState([]);
  const [myGroupsDisplay, setMyGroupsDisplay] = useState([]);
  const [sharedGroupsDisplay, setSharedGroupsDisplay] = useState([]);
  const isAdmin = hasAnyAuthority(props.authorities, [AUTHORITIES.ADMIN]);
  const resizeRef = useRef(null);
  const [width, setWidth] = React.useState(216);
  const [showShadowTop, setShowShadowTop] = useState<boolean>(false)
  const [showShadowBottom, setShowShadowBottom] = useState<boolean>(false)
  const [overflowY, setOverflowY] = useState<"auto" | "hidden">("hidden")
  const innerListRef = useRef(null);
  const [textSearchMenu, setTextSearchMenu] = useState('');

  const handleScroll = (event) => {
    const node = event.target;
    const { scrollHeight, scrollTop, clientHeight } = node
    const bottom = scrollHeight - scrollTop
    setShowShadowTop(scrollTop > 0)
    setShowShadowBottom(bottom > clientHeight)
  }

  const handleChangeOverFlow = (type: "auto" | "hidden") => (e) => {
    setOverflowY(type)
  }

  useEffect(() => {
    if (props.departmentOrderList !== null) {
      props.handleInitLocalMenu();
    }
  }, [props.departmentOrderList]);

  /**
   * After deleting group/department, set all-employees card to active
   */
  useEffect(() => {
    if (!props.errorItems) {
      setActiveCard({ type: MENU_TYPE.ALL_EMPLOYEES, cardId: null, participantType: null });
    }
    props.handleInitLocalMenu();
  }, [props.deletedDepartmentId, props.deletedGroupId]);

  useEffect(() => {
    if (props.selectedTargetType === MENU_TYPE.ALL_EMPLOYEES) {
      setActiveCard({ type: MENU_TYPE.ALL_EMPLOYEES, cardId: null, participantType: null })
    }
  }, [props.selectedTargetType])

  /**
   * Remove departmentName and departmentChild from department
   * @param department
   */
  const getDepartmentInfo = (department) => {
    delete department.departmentName;
    delete department.departmentChild;
  }

  /**
   * Get parent from source and target department
   * @param sourceDepartment
   * @param targetDepartment
   */
  const getDepartmentParent = (sourceDepartment, targetDepartment) => {
    getDepartmentInfo(sourceDepartment);
    getDepartmentInfo(targetDepartment);
    // get parentId and departmentOrder from 2 departments
    let sourceParentId = null;
    let targetParentId = null;
    const sourceDepartmentOrder = sourceDepartment.departmentOrder;
    const targetDepartmentOrder = targetDepartment.departmentOrder;
    // check departments belong to 2 consecutive levels
    if (sourceDepartment.departmentId === targetDepartment.parentId) {
      sourceParentId = targetDepartment.departmentId;
      targetParentId = sourceDepartment.parentId;
    } else if (sourceDepartment.parentId === targetDepartment.departmentId) {
      sourceParentId = targetDepartment.parentId;
      targetParentId = sourceDepartment.departmentId;
      // not belong to 2 consecutive levels
    } else {
      sourceParentId = targetDepartment.parentId;
      targetParentId = sourceDepartment.parentId;
    }
    // swap parentId and departmentOrder
    sourceDepartment.parentId = sourceParentId;
    sourceDepartment.departmentOrder = targetDepartmentOrder;
    targetDepartment.parentId = targetParentId;
    targetDepartment.departmentOrder = sourceDepartmentOrder;
    if (sourceDepartment) {
      dndDepartments.push(sourceDepartment);
    }
    if (targetDepartment) {
      dndDepartments.push(targetDepartment);
    }
  }

  /**
   * If source/targetDepartment has children
   * Get 1st level child to assign source/targetDepartment's id to departmentChild's parentId
   * @param sourceDepartment
   * @param targetDepartment
   */
  const getDepartmentChildren = (sourceDepartment, targetDepartment) => {
    const sourceChild = sourceDepartment.departmentChild;
    const targetChild = targetDepartment.departmentChild;
    // In case sourceDepartment's children exists
    if (Array.isArray(sourceChild) && sourceChild.length > 0) {
      sourceChild.forEach((child) => {
        if (child.parentId !== targetDepartment.departmentId) {
          child.parentId = targetDepartment.departmentId;
          getDepartmentInfo(child);
          dndDepartments.push(child);
        }
      })
    }
    // In case targetDepartment's children exists
    if (Array.isArray(targetChild) && targetChild.length > 0) {
      targetChild.forEach((child) => {
        if (child.parentId !== sourceDepartment.departmentId) {
          child.parentId = sourceDepartment.departmentId;
          getDepartmentInfo(child);
          dndDepartments.push(child);
        }
      })
    }
  }

  const onDragGroup = (sourceGroup, targetGroup) => {
    if (sourceGroup.type === MENU_TYPE.MY_GROUP && targetGroup.type === MENU_TYPE.SHARED_GROUP) {
      props.openGroupModal(SHARE_GROUP_MODES.MODE_SWICH_GROUP_TYPE, sourceGroup.groupId, false, false, null)
    }
  }

  /**
   * Handle for change departments' order
   */
  const onDragDepartment = (sourceDepartment, targetDepartment) => {
    // Check if targetDepartment is different from sourceDepartment
    if (sourceDepartment.departmentId !== targetDepartment.departmentId) {
      getDepartmentChildren(sourceDepartment, targetDepartment);
      getDepartmentParent(sourceDepartment, targetDepartment);
      // call API changeDepartmentOrder
      props.handleChangeDepartmentOrder(dndDepartments);
    }
  }

  /**
   * Filter data in list by menu
   * @param key
   * @param value
   */
  const handleDataFilter = (key, value, selectedTargetType, listViewCondition = []) => {
    const filters = [];
    filters.push({ key, value });
    props.updateFiltersSearch(filters, selectedTargetType, listViewCondition);
  }

  /**
   * Set active state when click to each sidebar element
   * @param type
   * @param id
   */
  const setCardState = (type, id = 0, participantType?: null) => {
    setActiveCard({ type, cardId: id, participantType });
    // save target card

    props.changeSelectedSidebar({ type, cardId: id });
  }

  /**
   * Handle when opening add/edit my group modal in sidebar area
   * @param myGroupModalMode
   * @param currentGroupId
   */
  const onOpenMyGroupModal = (myGroupModalMode, currentGroupId, isAutoGroup) => {
    if (currentGroupId) {
      props.sidebarCurrentId(currentGroupId);
    }
    props.toggleOpenAddEditMyGroupModal(myGroupModalMode, currentGroupId, isAutoGroup, null);
  }
  const onOpenShareGroupModal = (myGroupModalMode, currentGroupId, isOwnerGroup, isAutoGroup) => {
    if (currentGroupId) {
      props.sidebarCurrentId(currentGroupId);
    }
    props.openGroupModal(myGroupModalMode, currentGroupId, isOwnerGroup, isAutoGroup, null);
  }

  const shareGroupDefault = {
    groupId: 0,
    groupName: " ",
    isAutoGroup: false,
    participantType: 2,
    type: 4,
    updatedUser: null,
  }
  useEffect(() => {
    if (props.localMenu && props.localMenu.initializeLocalMenu) {
      setDepartmentsDisplay(props.localMenu.initializeLocalMenu.departments);
      setMyGroupsDisplay(props.localMenu.initializeLocalMenu.myGroups);
      if (props.localMenu.initializeLocalMenu.sharedGroups.length > 0) {
        setSharedGroupsDisplay(props.localMenu.initializeLocalMenu.sharedGroups);
      } else {
        setSharedGroupsDisplay([shareGroupDefault]);
      }
      setTextSearchMenu('');
    }
  }, [props.localMenu])
  /**
   * Return the departments which have departmentName including the searchText
   * @param departments list of departments
   * @param searchText searchText
   */
  const getMatchingDepartments = (departments, searchText) => {
    const getDepartWithChild = (department, valueChild) => {
      return _.set(_.cloneDeep(department), 'departmentChild', valueChild);
    }
    const list = [];
    if (searchText) {
      departments.forEach(e => {
        if (e.departmentChild && e.departmentChild.length > 0) {
          const matchingChildList = getMatchingDepartments(e.departmentChild, searchText);
          if (matchingChildList && matchingChildList.length > 0) {
            list.push(getDepartWithChild(e, matchingChildList));
          } else if (e.departmentName.includes(searchText)) {
            list.push(getDepartWithChild(e, null));
          }
        } else if (e.departmentName.includes(searchText)) {
          list.push(getDepartWithChild(e, null));
        }
      });
    } else {
      return departments;
    }
    return list;
  }
  /**
   * Filter lists via the searchText
   * @param searchText searchText
   */
  const showListSearch = (searchText) => {
    const departmentsField = getMatchingDepartments(props.localMenu.initializeLocalMenu.departments, searchText);
    const myGroupsField = props.localMenu.initializeLocalMenu.myGroups.filter(e => e.groupName.includes(searchText));
    const sharedGroupsField = props.localMenu.initializeLocalMenu.sharedGroups.filter(e => e.groupName.includes(searchText));
    setDepartmentsDisplay(departmentsField);
    setMyGroupsDisplay(myGroupsField);
    setSharedGroupsDisplay(sharedGroupsField);
    setTextSearchMenu(searchText);
  }

  if (!props.localMenu) {
    return <></>
  } else {
    return (
      <>
        {showSidebar &&
          <Resizable
            ref={resizeRef}
            size={{ width, height: '100%' }}
            onResizeStop={(e, direction, ref, d) => {
              setWidth(width + d.width);
            }}
            onResize={(e, direction, ref, d) => {
            }}
            enable={{
              top: false,
              right: true,
              bottom: false,
              left: false,
              topRight: false,
              bottomRight: false,
              bottomLeft: false,
              topLeft: false
            }}
            className={`resizeable-resize-wrap  esr-content-sidebar list-category style-3 overflow-hidden shadow-local-navigation-bottom-inset ${showShadowTop && "shadow-local-navigation-top"} ${showShadowBottom && "shadow-local-navigation-bottom-inset"}`}
          >
            <div className="esr-content-sidebar-outer" ref={innerListRef} onScroll={handleScroll} style={{ overflowY }} onMouseEnter={handleChangeOverFlow("auto")} onMouseLeave={handleChangeOverFlow("hidden")}>
              <div className={"title-lf " + ((activeCard !== null && activeCard.type === MENU_TYPE.ALL_EMPLOYEES
                && activeCard.cardId === null) || props.selectedTargetType === MENU_TYPE.ALL_EMPLOYEES ? "active" : "")}>
                <a onClick={() => props.dirtyCheck(() => {
                  handleDataFilter("employee_status", "0", SELECT_TARGET_TYPE.ALL_EMPLOYEE);
                  props.toggleShowFeaturesIcon(MENU_TYPE.ALL_EMPLOYEES, false, false);
                  setCardState(MENU_TYPE.ALL_EMPLOYEES);
                  props.sidebarCurrentId(null);
                })}>
                  <span>{translate('employees.sidebar.title.all-user')}</span>
                </a>
              </div>
              <div className="esr-content-sidebar-inner">
                <div className="employee-sidebar-menu list-group">
                  {props.localMenu && props.localMenu.initializeLocalMenu &&
                    (props.localMenu.initializeLocalMenu.departments.length + props.localMenu.initializeLocalMenu.myGroups.length + props.localMenu.initializeLocalMenu.sharedGroups.length) >= MAX_RECORD_DISPLAY &&
                    <li>
                      <div className="search-box-button-style">
                        <button className="icon-search"><i className="far fa-search"></i></button>
                        <input type="text" value={textSearchMenu} placeholder={translate('employees.sidebar.search.placeholder')} onChange={e => showListSearch(e.target.value.trim())} />
                      </div>
                    </li>
                  }
                  <li>
                    {departmentsDisplay && <DepartmentList departments={departmentsDisplay}
                      type={MENU_TYPE.DEPARTMENT}
                      toggleShowFeaturesIcon={props.toggleShowFeaturesIcon}
                      handleDataFilter={handleDataFilter}
                      dragDepartment={onDragDepartment}
                      sidebarCurrentId={props.sidebarCurrentId}
                      setActiveCard={setCardState}
                      activeCard={activeCard}
                      handleDeleteDepartment={props.handleDeleteDepartment}
                      toggleOpenDepartmentPopup={props.toggleOpenDepartmentPopup}
                      isAdmin={isAdmin}
                      setTargetDepartment={props.setTargetDepartment}
                      dirtyCheck={props.dirtyCheck}
                    />}
                  </li>
                  <li>
                    <ul className="list-group">
                      <li className="category">
                        <div className={(activeCard !== null && activeCard.type === MENU_TYPE.QUIT_JOB ? "d-flex active" : "d-flex")}>
                          <a
                            className="group-title pr-0"
                            onClick={() => props.dirtyCheck(() => {
                              handleDataFilter("employee_status", "1", SELECT_TARGET_TYPE.EMPLOYEE_QUIT_JOB);
                              props.toggleShowFeaturesIcon(MENU_TYPE.QUIT_JOB, false, false);
                              props.sidebarCurrentId(0)
                              setCardState(MENU_TYPE.QUIT_JOB)
                            })}>
                            <Popover x={-20} y={50} >
                              <span>{translate('employees.sidebar.title.quit-job')}</span>
                            </Popover>
                          </a>
                        </div>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <ul className="list-group group">
                      <li className="category">
                        {myGroupsDisplay && myGroupsDisplay.length > MAX_RECORD_DISPLAY
                          ? <i className={"fas " + (isShowMyGroup ? "fa-sort-down" : "fa-caret-right")} onClick={() => setShowMyGroup(!isShowMyGroup)}></i>
                          : <></>
                        }
                        <div className="d-flex">
                          <a>{translate('employees.sidebar.title.my-group')}</a>
                          <span className="plus-blue" onClick={() => props.toggleOpenAddEditMyGroupModal(MY_GROUP_MODES.MODE_CREATE_GROUP, null, false, null)} />
                        </div>
                        {isShowMyGroup && myGroupsDisplay && myGroupsDisplay.map((group) => (
                          <>
                            <CategoryDragLayer />
                            <GroupCard key={group.groupId}
                              sourceGroup={group}
                              type={MENU_TYPE.MY_GROUP}
                              toggleShowFeaturesIcon={props.toggleShowFeaturesIcon}
                              handleDataFilter={handleDataFilter}
                              dragGroup={onDragGroup}
                              sidebarCurrentId={props.sidebarCurrentId}
                              setTypeGroup={props.setTypeGroup}
                              setActiveCard={setCardState}
                              activeCard={activeCard}
                              handleUpdateAutoGroup={props.handleUpdateAutoGroup}
                              toggleOpenAddEditModal={onOpenMyGroupModal}
                              openGroupModal={onOpenShareGroupModal}
                              handleDeleteGroup={props.handleDeleteGroup}
                              getGroupName={props.getGroupName}
                              initializeListInfo={props.initializeListInfo}
                              handleGetInitializeListInfo={props.handleGetInitializeListInfo}
                              dirtyCheck={props.dirtyCheck}
                            />
                          </>
                        ))}
                      </li>
                    </ul>
                  </li>
                  <li>
                    <ul className="list-group group">
                      <li className="category">
                        {sharedGroupsDisplay && sharedGroupsDisplay.length > MAX_RECORD_DISPLAY
                          ? <i className={"fas " + (isShowShareGroup ? "fa-sort-down" : "fa-caret-right")} onClick={() => setShowShareGroup(!isShowShareGroup)}></i>
                          : <></>
                        }
                        <div className="d-flex">
                          <a>{translate('employees.sidebar.title.shared-group')}</a>
                          <span className="plus-blue" onClick={() => props.openGroupModal(SHARE_GROUP_MODES.MODE_CREATE_GROUP, null, false, false, null)} />
                        </div>
                        {isShowShareGroup && sharedGroupsDisplay && sharedGroupsDisplay.map((group) => (
                          <>
                            <CategoryDragLayer />
                            <GroupCard key={group.groupId}
                              sourceGroup={group}
                              type={MENU_TYPE.SHARED_GROUP}
                              toggleShowFeaturesIcon={props.toggleShowFeaturesIcon}
                              handleDataFilter={handleDataFilter}
                              dragGroup={onDragGroup}
                              sidebarCurrentId={props.sidebarCurrentId}
                              setTypeGroup={props.setTypeGroup}
                              setActiveCard={setCardState}
                              activeCard={activeCard}
                              handleUpdateAutoGroup={props.handleUpdateAutoGroup}
                              openGroupModal={props.openGroupModal}
                              handleDeleteGroup={props.handleDeleteGroup}
                              getGroupName={props.getGroupName}
                              initializeListInfo={props.initializeListInfo}
                              handleGetInitializeListInfo={props.handleGetInitializeListInfo}
                              dirtyCheck={props.dirtyCheck}
                            />
                          </>
                        ))}
                      </li>
                    </ul>
                  </li>
                </div>
              </div>
            </div>
          </Resizable>
        }
        {/* <div className={`button-collapse-sidebar-product ${showShadowTop && showSidebar ? "shadow-local-navigation-top " : ""}`} onClick={() => setShowSidebar(!showSidebar)}>
          <a className="expand"><i className={`far ${showSidebar ? "fa-angle-left" : "fa-angle-right"}  `} /></a>
        </div> */}
      </>
    );
  }
}

const mapStateToProps = ({ employeeControlSidebar, authentication }: IRootState) => ({
  authorities: authentication.account.authorities,
  localMenu: employeeControlSidebar.localMenuData,
  departmentOrderList: employeeControlSidebar.departmentOrderList,
  deletedGroupId: employeeControlSidebar.deletedGroupId,
  deletedDepartmentId: employeeControlSidebar.deletedDepartmentId,
  errorItems: employeeControlSidebar.errorItems,
});

const mapDispatchToProps = {
  handleInitLocalMenu,
  handleChangeDepartmentOrder,
  handleUpdateAutoGroup,
  handleDeleteDepartment,
  handleDeleteGroup
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EmployeeControlSidebar);
