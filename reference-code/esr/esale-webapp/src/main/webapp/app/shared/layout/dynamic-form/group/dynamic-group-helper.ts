import { DEFINE_FIELD_TYPE } from '../constants';
import _ from 'lodash';

const parseListUpdateTime = listUpdateTime => {
  try {
    const list = JSON.parse(listUpdateTime);
    if (list && list['listUpdateTime']) {
      return list['listUpdateTime'];
    }
  } catch (e) {
    return null;
  }
  return null;
};

export const parseResInitializeGroup = (
  fields,
  searchConditions,
  participantEmployees,
  participantDepartments,
  participantGroups,
  paramlistParticipants,
  paramListUpdateTime
) => {
  const listFieldSearch = [];
  let customFieldsInfo = [];
  if (searchConditions && fields) {
    searchConditions.map(field => {
      const fieldMap = fields.find(element => element.fieldId === field.fieldId);
      if(_.isNil(field['fieldValue'])) {
        field['fieldValue'] = field['searchValue'];
      }
      if (fieldMap) {
        field['fieldType'] = fieldMap.fieldType;
        if (field.fieldType.toString() !== DEFINE_FIELD_TYPE.RELATION) {
          field['fieldValue'] = field.searchValue;
          field['savedFieldValue'] = field.searchValue;
          listFieldSearch.push(field);
        } else {
          const listSearchRelation = JSON.parse(field.fieldValue);
          listSearchRelation.map(el => {
            el['relationFieldId'] = field.fieldId;
            el['searchValue'] = el.fieldValue;
            el['savedFieldValue'] = el.fieldValue;
            listFieldSearch.push(el);
          });
        }
      }
    });
    // listFieldSearch.sort((a, b) => a.fieldOrder - b.fieldOrder);
  }
  const listParticipants = [];
  if (participantEmployees) {
    participantEmployees.forEach(element => {
      const paticipant = paramlistParticipants.filter(e => {
        return e.employeeId === element.employeeId;
      });
      Object.assign(element, {
        participantType: paticipant.length > 0 && paticipant[0].participantType,
        actionId: paticipant.length > 0 && paticipant[0].participantType
      });
      let isPush = true;
      if (listParticipants.length > 0) {
        const duplicate = listParticipants.filter(e => {
          return e.employeeId === element.employeeId;
        });
        if (duplicate[0]) {
          duplicate[0].employeeDepartments.push({
            departmentName: element.departmentName,
            positionName: element.positionName
          });
          isPush = false;
        } else {
          Object.assign(element, {
            employeeDepartments: [
              { departmentName: element.departmentName, positionName: element.positionName }
            ]
          });
        }
      } else {
        Object.assign(element, {
          employeeDepartments: [
            { departmentName: element.departmentName, positionName: element.positionName }
          ]
        });
      }
      if (isPush) {
        listParticipants.push(element);
      }
    });
  }
  if (participantDepartments) {
    participantDepartments.forEach(element => {
      const paticipant = paramlistParticipants.filter(e => {
        return e.departmentId === element.departmentId;
      });
      Object.assign(element, {
        participantType: paticipant.length > 0 && paticipant[0].participantType
      });
      listParticipants.push(element);
    });
  }
  if (participantGroups) {
    participantGroups.forEach(element => {
      const paticipant = paramlistParticipants.filter(e => {
        return e.groupId === element.groupId;
      });
      if (paticipant.length > 0) {
        Object.assign(element, {
          participantType: paticipant[0].participantType
        });
        listParticipants.push(element);
      }
      
    });
  }
  if (fields) {
    customFieldsInfo = fields.sort((a, b) => a.fieldOrder - b.fieldOrder);
  }
  let fieldsInfo = {};
  for (let i = 0; i < listFieldSearch.length; i++) {
    fieldsInfo = customFieldsInfo.find(r => r.fieldId === listFieldSearch[i].fieldId);
    const searchType = listFieldSearch[i].searchType;
    const searchOption = listFieldSearch[i].searchOption;
    Object.assign(listFieldSearch[i], fieldsInfo);
    listFieldSearch[i].isSearchBlank = true;
    listFieldSearch[i].searchType = searchType;
    listFieldSearch[i].searchOption = searchOption;
    if (!_.isEmpty(listFieldSearch[i].fieldValue)) {
      listFieldSearch[i].isSearchBlank = false;
    }
  }
  // Get list_update_time
  let listUpdateTime = null;
  if (paramListUpdateTime) {
    listUpdateTime = parseListUpdateTime(paramListUpdateTime);
  }
  return { listFieldSearch, listParticipants, customFieldsInfo, listUpdateTime };
};
