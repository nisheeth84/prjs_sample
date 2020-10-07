import React from 'react';
import _ from 'lodash';
import TagAutoCompleteItem from '../tag-auto-complete-item';
import { getFieldLabel, getColorImage } from 'app/shared/util/string-utils';

export interface IResultMultiEmployeeProps {
  tags?: any;
  listActionOption?: any,
  isDisabled?: boolean,
  onActionOption?: any,
  onRemoveTag?: any,
  isShowOnList?: any;
}

const ResultMultiEmployee = (props: IResultMultiEmployeeProps) => {
  return (
    <div className={props.listActionOption ? "show-wrap2 width-1100" : "chose-many"}>
      {props.tags.map((tag, idx) => {
        let tagName1 = "";
        let tagName2 = "";
        let tagName3 = "";
        let avatarImage = "";
        let classNameIcon = "";
        if (tag.employeeId) {
          classNameIcon = getColorImage(7);
          tagName2 = (tag["employeeSurname"] ? `${tag["employeeSurname"]}` : '') + (tag["employeeName"] ? ` ${tag["employeeName"]}` : '');
          if (tag.employeeDepartments && tag.employeeDepartments.length > 0) {
            tagName3 = tag.employeeDepartments.map(function (ep) { return getFieldLabel(ep, "positionName"); }).join(" ");
            tagName1 = tag.employeeDepartments && tag.employeeDepartments.length > 0 ? tag.employeeDepartments[0].departmentName : "";
          }
          avatarImage = tag.employeeIcon && tag.employeeIcon.fileUrl ? tag.employeeIcon.fileUrl : tag.photoFilePath;
        } else if (tag.departmentId) {
          classNameIcon = getColorImage(6);
          tagName1 = tag.departmentName
          if (tag.employeesDepartments && tag.employeesDepartments.length > 0) {
            tagName2 = tag.employeesDepartments.map(function (ep) { return ep && (ep.employeeSurname + ' ' + ep.employeeName) }).join(", ");
          }
        } else if (tag.groupId) {
          classNameIcon = getColorImage(5);
          tagName1 = tag.groupName
          if (tag.employeesGroups && tag.employeesGroups.length > 0) {
            tagName2 = tag.employeesGroups.map(function (ep) { return ep && (ep.employeeSurname + ' ' + ep.employeeName) }).join(", ");
          }
        }
        if (tag.participantType) {
          tag.actionId = tag.participantType;
        }
        return (
          <TagAutoCompleteItem
            key={idx}
            idx={idx}
            tag={tag}
            isDisabled={props.isDisabled}
            listActionOption={props.listActionOption}
            tagNames={[avatarImage, tagName1, tagName2, tagName3]}
            onActionOption={props.onActionOption}
            onRemoveTag={props.onRemoveTag}
            isShowOnList={props.isShowOnList}
            classNameIcon={classNameIcon}
          />
        )
      })}
    </div>
  )
}

export default ResultMultiEmployee;
