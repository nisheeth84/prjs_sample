import React, { useState, useEffect } from 'react'
import { DepartmentTimelineType } from '../models/get-local-navigation-model';
import LocalNavigationDepartmentItem from './local-navigation-department-item'
import _ from 'lodash';
type ILocalNavigationDepartmentProp = {
  title: any,
  listDepartment: DepartmentTimelineType[],
  optionLabel: string,
  extraValueNumber?: any,
  onSelectOption?: (objectValue) => void
  classActiveId?: any
  listType?: any
  mapCountnewDepartment?: Map<number, number>
}

const LocalNavigationDepartment = (props: ILocalNavigationDepartmentProp) => {
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
  const Department = ({ data }) => {
    return (
      data && data.map((department, index) => (
        <ul className="list-group" key={department.departmentId}>
          <li className="category" >
            {(Array.isArray(department.childDepartments) && department.childDepartments.length > 0) &&
              <i className={"fas " + (isExpanded(listChild[department.departmentId]) ? "fa-chevron-up" : "fa-chevron-down")}
                onClick={() => setShowDepartmentChild(department.departmentId)}>
              </i>}
            <LocalNavigationDepartmentItem
              key={"departmentName" + department.departmentId + "_" + department.departmentName + "_" + index}
              mapCountnewDepartment={props.mapCountnewDepartment}
              listType={props.listType}
              classActiveId={props.classActiveId}
              link={"/timeline/list"}
              departmentData={department}
              onSelectOption={() => props.onSelectOption(department)} />
            {department.childDepartments && isExpanded(listChild[department.departmentId]) && <ul> <Department data={department.childDepartments} /></ul>}
          </li>
        </ul>
      ))
    )
  }

  return (
    <ul className="list-group">{props.listDepartment && <Department data={props.listDepartment} />}</ul>
  )
}

export default LocalNavigationDepartment;
