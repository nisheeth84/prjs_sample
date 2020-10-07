import React from 'react';
import _ from 'lodash';
import StringUtils, { getFieldLabel } from 'app/shared/util/string-utils';

export interface IResultSingleEmployeeProps {
  tags: any;
  hovered: boolean;
  headerHoverOn: any;
  headerHoverOff: any;
  onRemoveTag: any;
  getAvatarName: any;
  getFirstCharacter: any;
}

const ResultSingleEmployee = (props: IResultSingleEmployeeProps) => {
  return (
    <>
      {props.tags.map((e, idx) => {
        let id = 0;
        let tagName1 = "";
        let tagName2 = "";
        let positions = "";
        let departments = "";
        let employeeName = "";
        if (e.employeeId) {
          tagName1 = `${e.employeeSurname}${e.employeeName ? ' ' + e.employeeName : ''}`;
          if (e.employeeDepartments && e.employeeDepartments.length > 0) {
            tagName2 = e.employeeDepartments.map(function (ep) { return getFieldLabel(ep, "positionName"); }).join(" ");
          }
          if (e.employeeDepartments && e.employeeDepartments.length > 0) {
            positions = e.employeeDepartments.map(function (ep) { return getFieldLabel(ep, "positionName"); }).join(" ");
            departments = e.employeeDepartments.map(function (ep) { return StringUtils.getValuePropStr(ep, "departmentName"); }).join(" ");
          }
          id = e.employeeId;
        } else if (e.departmentId) {
          tagName1 = e.departmentName
          if (e.employeesDepartments && e.employeesDepartments.length > 0) {
            employeeName = e.employeesDepartments.map(function (ep) { return ep && (ep.employeeSurname + ' ' + ep.employeeName) }).join(", ");
          }
          id = e.departmentId;
        } else if (e.groupId) {
          tagName1 = e.groupName
          if (e.employeesGroups && e.employeesGroups.length > 0) {
            employeeName = e.employeesGroups.map(function (ep) { return ep && (ep.employeeSurname + ' ' + ep.employeeName) }).join(", ");
          }
          id = e.groupId;
        }
        const avatarImage = e.employeeIcon && e.employeeIcon.fileUrl ? e.employeeIcon.fileUrl : null;
        return <div key={idx} className="wrap-tag w100">
          <div className="tag text-ellipsis w-auto mw-100" onMouseEnter={props.headerHoverOn} onMouseLeave={props.headerHoverOff}>
            {`${tagName1} ${tagName2}`}
            <button className="close" onClick={() => props.onRemoveTag(idx, true)}>×</button>
          </div>
          {props.hovered &&
            <div className="drop-down h-auto w100">
              <ul className="dropdown-item">
                <li className="item smooth">
                  <div className="item2">
                    {avatarImage ? <div className="name"><img src={avatarImage} alt="" title="" /></div> :
                      <div className={"name " + props.getAvatarName(id)}>{props.getFirstCharacter(tagName1)}</div>}
                    {e.employeeId && <div className="content">
                      <div className="text text1 font-size-12 text-blue">{departments}</div>
                      <div className="text text2 text-blue">{`${tagName1} ${positions}`}</div>
                    </div>}
                    {(e.departmentId || e.groupId) && <div className="content">
                      <div className="text text1 font-size-12 text-blue">{tagName1}</div>
                      <div className="text text2 text-blue">{employeeName}</div>
                    </div>}
                  </div>
                </li>
              </ul>
            </div>
          }
        </div>
      })}
    </>
  );
}

export default ResultSingleEmployee;
