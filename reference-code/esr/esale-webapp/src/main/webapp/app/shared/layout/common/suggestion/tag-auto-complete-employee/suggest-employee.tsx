import React from 'react';
import { translate } from 'react-jhipster';

import { getFieldLabel } from 'app/shared/util/string-utils';

export interface ISuggestEmployeeProps {
  employeeInfo: any;
  tags: any;
  getAvatarName: any;
  getFirstCharacter: any;
  selectElementSuggest: any;
  onlyShowEmployees?: boolean;
}

const SuggestEmployee = (props: ISuggestEmployeeProps) => {

  const renderWarningBusy = () => {
    return (<div className="warning  font-size-12">{translate("messages.WAR_COM_0004")}</div>);
  }

  const employeeInfo = props.employeeInfo;
  const avatarEmployee = employeeInfo.employeeIcon && employeeInfo.employeeIcon.fileUrl ? employeeInfo.employeeIcon.fileUrl : employeeInfo.fileUrl;
  const tags = props.tags;
  if (employeeInfo.employeeId) {
    const isActive = tags.filter(e => e.employeeId === employeeInfo.employeeId).length > 0;
    let positions = "";
    let departments = "";
    if (employeeInfo.employeeDepartments && employeeInfo.employeeDepartments.length > 0) {
      positions = getFieldLabel(employeeInfo.employeeDepartments[0], "positionName");
      departments = employeeInfo.employeeDepartments && employeeInfo.employeeDepartments.length > 0 ? employeeInfo.employeeDepartments[0].departmentName : "";
    }
    return (
      <div className={`item ${isActive ? "active" : ""} smooth`} onClick={(e) => { if (!isActive) { props.selectElementSuggest(employeeInfo) } }}>
        <div className="item2">
          {avatarEmployee ?
            <div className="name"><img src={avatarEmployee} alt="" title="" /></div>
            : <div className={"name " + props.getAvatarName(7)}>{props.getFirstCharacter(employeeInfo.employeeSurname)}</div>}
          <div className="content">
            <div className="text text1 font-size-12 text-ellipsis">{departments}</div>
            <div className="text text2 text-ellipsis">{`${employeeInfo.employeeSurname} ${employeeInfo.employeeName ? employeeInfo.employeeName : ''} ${positions}`}</div>
          </div>
        </div>
        {employeeInfo.isBusy && renderWarningBusy()}
      </div>
    );
  } else if (!props.onlyShowEmployees && employeeInfo.departmentId) {
    const isActive = tags.filter(e => e.departmentId === employeeInfo.departmentId).length > 0;
    let employeeName = "";
    const isBusy = employeeInfo.employeesDepartments.filter(e => e.isBusy).length > 0;
    if (employeeInfo.employeesDepartments && employeeInfo.employeesDepartments.length > 0) {
      employeeName = employeeInfo.employeesDepartments.map(function (e) { return e && (e.employeeSurname + (e.employeeName ? ` ${e.employeeName}` : '')) }).join(', ');
    }
    return (
      <div className={`item ${isActive ? "active" : ""} smooth`} onClick={(e) => { if (!isActive) { props.selectElementSuggest(employeeInfo) } }}>
        <div className="item2">
          <div className={"name " + props.getAvatarName(6)}>{props.getFirstCharacter(employeeInfo.departmentName)}</div>
          <div className="content">
            <div className="text text1 font-size-12 text-ellipsis">{employeeInfo.departmentName}</div>
            <div className="text text2 text-ellipsis">{employeeName}</div>
          </div>
        </div>
        {isBusy && renderWarningBusy()}
      </div>
    );

  }
  else if (!props.onlyShowEmployees && employeeInfo.groupId) {
    const isActiveGroup = tags.filter(e => e.groupId === employeeInfo.groupId).length > 0;
    let employeeNameG = "";
    const _isBusy = employeeInfo.employeesGroups.filter(e => e.isBusy).length > 0;
    if (employeeInfo.employeesGroups && employeeInfo.employeesGroups.length > 0) {
      employeeNameG = employeeInfo.employeesGroups.map(function (e) { return e && (e.employeeSurname + (e.employeeName ? ` ${e.employeeName}` : '')) }).join(', ');
    }
    return (
      <div className={`item ${isActiveGroup ? "active" : ""} smooth`} onClick={(e) => { if (!isActiveGroup) { props.selectElementSuggest(employeeInfo) } }}>
        <div className="item2">
          <div className={"name " + props.getAvatarName(5)}>{props.getFirstCharacter(employeeInfo.groupName)}</div>
          <div className="content">
            <div className="text text1 font-size-12 text-ellipsis">{employeeInfo.groupName}</div>
            <div className="text text2 text-ellipsis">{employeeNameG}</div>
          </div>
        </div>
        {_isBusy && renderWarningBusy()}
      </div>
    );
  }
  return (<></>);
}
export default SuggestEmployee;
