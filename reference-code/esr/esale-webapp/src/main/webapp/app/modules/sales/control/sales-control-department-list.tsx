import React, { useState } from 'react';
import { MENU_TYPE } from '../constants';
import DepartmentCard from './sales-control-department-card';
import _ from 'lodash';

export interface IDepartmentListProps {
  departments?: any
  type: number
  sidebarCurrentId: (sidebarId) => void
  toggleShowFeaturesIcon: (type, isAutoGroup, isOwner) => void
  handleDataFilter: (key, value, selectedTargetType) => void
  dragDepartment: (sourceDepartment, targetDepartment) => void
  setActiveCard: (typeCard, id) => void;
  activeCard: any
  handleDeleteDepartment: (departmentId) => void
  isChange: boolean
  toggleOpenDepartmentPopup?
}

const DepartmentList: React.FC<IDepartmentListProps> = (props) => {
  const [listChild, setlistChild] = useState({});

  /**
   * Expand/Collapse state for department children
   * @param departmentId id of department parent
   */
  const setShowDepartmentChild = (departmentId) => {
    if (listChild[departmentId] === undefined || listChild[departmentId] === true) {
      listChild[departmentId] = false;
    } else {
      listChild[departmentId] = true;
    }
    const tmp = _.cloneDeep(listChild);
    setlistChild(tmp);
  }

  /**
   * Check departmentChild is expanded or not
   * @param departmentId
   */
  const isExpanded = (departmentId) => {
    if (departmentId === undefined || departmentId === true) {
      return true;
    }
    return false;
  }

  const showDepartmentChild = (departmentId) => {
    if(!isExpanded(listChild[departmentId])) {
      setShowDepartmentChild(departmentId)
    }
  }
  /**
   * Recursive department list
   * @param param
   */
  const Department = ({ data }) => {
    return (
      data && data.map((department) => (
        <li className="category" key={department.departmentId}>
          {(Array.isArray(department.departmentChild) && department.departmentChild.length > 0) &&
            <i className={"fas " + (isExpanded(listChild[department.departmentId]) ? "fa-sort-down" : "fa-caret-right")}
              onClick={() => setShowDepartmentChild(department.departmentId)}>
            </i>}
          <DepartmentCard key={"department-" + department.departmentId} sourceDepartment={department}
            sidebarCurrentId={props.sidebarCurrentId}
            type={MENU_TYPE.DEPARTMENT}
            toggleShowFeaturesIcon={props.toggleShowFeaturesIcon}
            handleDataFilter={props.handleDataFilter}
            dragDepartment={props.dragDepartment}
            setActiveCard={props.setActiveCard}
            activeCard={props.activeCard}
            handleDeleteDepartment={props.handleDeleteDepartment}
            isChange={props.isChange}
            toggleOpenDepartmentPopup={props.toggleOpenDepartmentPopup}
            showDepartmentChild = {showDepartmentChild}
          />
          {department.departmentChild && isExpanded(listChild[department.departmentId])
            && <ul><Department data={department.departmentChild} /></ul>}
        </li>
      ))
    )
  }

  return (
    <ul className="list-group">{props.departments && <Department data={props.departments} />}</ul>
  )
}

export default DepartmentList;
