import axios from 'axios';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { API_CONTEXT_PATH, FIELD_BELONG } from 'app/config/constants';
import { API_CONFIG } from 'app/config/constants';
import { SHOW_MESSAGE_SUCCESS } from '../constants';
import _ from 'lodash';
import { DynamicGroupModalAction } from 'app/shared/layout/dynamic-form/group/dynamic-group-modal.reducer.ts';
import { parseResInitializeGroup } from 'app/shared/layout/dynamic-form/group/dynamic-group-helper.ts';
import { GROUP_MODE_SCREEN } from 'app/shared/layout/dynamic-form/group/constants';
import { translate } from 'react-jhipster';
import { tryParseJson } from 'app/shared/util/string-utils';

/**
 * CONST ACTION TYPES
 */
export const ACTION_TYPES = {
  INITIAL: 'customer-listModal/INITIAL_LIST',
  ITEM: 'customer-listModal/INITIAL_ITEM',
  CREATE: 'sharedList/CREATE',
  UPDATE: 'sharedList/UPDATE',
  RESET: 'sharedList/RESET',
  RESET_ERROR: 'sharedList/RESET_ERROR',
  GET_GENERAL_SETTING: 'sharedList/GET_GENERAL_SETTING'
};

/**
 * Initial State
 */
const initialState = {
  action: DynamicGroupModalAction.None,
  group: {},
  list: {},
  errorItems: [],
  isSuccess: null,
  errorMessageInModal: [],
  rowIds: [],
  listFieldSearch: [],
  customFieldsInfo: [],
  customFieldsInfoRelation: [],
  listParticipants: [],
  updatedListId: null,
  errorParams: [],
  listUpdateTime: null,
  msgSuccess: null
};

type GroupType = {
  groupId: any;
  groupName: any;
  groupType: any;
  isAutoGroup: any;
  isOverWrite: boolean;
};

/**
 * Parse Init Shared Response
 * @param res
 */

const parseInitSharedGroupResponse = res => {
  if (_.isNil(res.data)) {
    return;
  }
  // convert all to group
  let list = {};
  if (res.data.businessCardList && res.data.businessCardList.length) {
    list = res.data.businessCardList[0];
  }

  const group: GroupType = {
    groupId: !_.isEmpty(list) ? list['businessCardListDetailId'] : null,
    groupName: !_.isEmpty(list) ? list['businessCardListName'] : null,
    groupType: !_.isEmpty(list) ? list['typeList'] : null,
    isAutoGroup: !_.isEmpty(list) && list['listMode'] > 1,
    isOverWrite: !_.isEmpty(list) && list['isOverWrite'] === 1
  };

  const listParticipantsData = [];
  if (list && list['ownerList'] && list['ownerList'].length > 0) {
    list['ownerList'].forEach(element => {
      listParticipantsData.push({
        ...element,
        participantType: 2
      });
    });
  }
  if (list && list['viewerList'] && list['viewerList'].length > 0) {
    list['viewerList'].forEach(ele => {
      listParticipantsData.push({
        ...ele,
        participantType: 1
      });
    });
  }

  const restConvert = !_.isEmpty(list)
    ? parseResInitializeGroup(
      res.data.fieldInfo,
      list['searchConditions'],
      list['employees'],
      null,
      null,
      listParticipantsData,
      list['updatedDate']
    )
    : parseResInitializeGroup(res.data.customFieldsInfo, null, null, null, null, null, null);

  const listFieldSearch = restConvert.listFieldSearch;
  const listParticipants = listParticipantsData;
  const customFieldsInfo = restConvert.customFieldsInfo;
  const listUpdateTime = restConvert.listUpdateTime;

  const indexOfIsWorking = customFieldsInfo.findIndex(e => e.fieldName === 'is_working');

  if (indexOfIsWorking >= 0) {
    customFieldsInfo[indexOfIsWorking]['fieldType'] = 3;
    customFieldsInfo[indexOfIsWorking]['fieldItems'] = [
      {
        itemId: 1,
        itemLabel: translate('businesscards.create-edit.isWorking'),
        itemOrder: 1,
        isAvailable: true
      },
      {
        itemId: 0,
        itemLabel: translate('businesscards.create-edit.notWorking'),
        itemOrder: 2,
        isAvailable: true
      }
    ];
    const indexOfEmployeeId = customFieldsInfo.findIndex(e => e.fieldName === 'employee_id');
    customFieldsInfo[indexOfEmployeeId].fieldType = 9;
    const indexOfCompanyname = customFieldsInfo.findIndex(e => e.fieldName === 'company_name');
    customFieldsInfo[indexOfCompanyname].fieldType = 9;
    const indexOfCreatedUser = customFieldsInfo.findIndex(e => e.fieldName === 'created_user');
    customFieldsInfo[indexOfCreatedUser].fieldType = 9;
    const indexOfUpdatedUser = customFieldsInfo.findIndex(e => e.fieldName === 'updated_user');
    customFieldsInfo[indexOfUpdatedUser].fieldType = 9;
  }
  const indexOfIsWorkingOfLstFieldSearch = listFieldSearch.findIndex(
    e => e.fieldName === 'is_working'
  );
  if (indexOfIsWorkingOfLstFieldSearch >= Number(0)) {
    listFieldSearch[indexOfIsWorkingOfLstFieldSearch].fieldType = 3;
    listFieldSearch[indexOfIsWorkingOfLstFieldSearch].fieldItems = [
      {
        itemId: 1,
        itemLabel: translate('businesscards.create-edit.isWorking'),
        itemOrder: 1,
        isAvailable: true
      },
      {
        itemId: 0,
        itemLabel: translate('businesscards.create-edit.notWorking'),
        itemOrder: 2,
        isAvailable: true
      }
    ];
    if (listFieldSearch[indexOfIsWorkingOfLstFieldSearch].fieldValue === 'true') {
      listFieldSearch[indexOfIsWorkingOfLstFieldSearch].fieldValue = JSON.stringify(['1']);
    } else if (listFieldSearch[indexOfIsWorkingOfLstFieldSearch].fieldValue === 'false') {
      listFieldSearch[indexOfIsWorkingOfLstFieldSearch].fieldValue = JSON.stringify(['0']);
    } else {
      listFieldSearch[indexOfIsWorkingOfLstFieldSearch].fieldValue = JSON.stringify(['0', '1']);
    }
  }
  return { listFieldSearch, listParticipants, customFieldsInfo, group, listUpdateTime };
};

/**
 * Parse Response Get Setting
 * @param res
 */
const parseResponseGetSetting = res => {
  let errorCode = '';
  let errorItems = [];
  const hasErrors = res.errors && res.errors.length > 0;
  if (hasErrors) {
    if (
      res.errors[0].extensions &&
      res.errors[0].extensions.errors &&
      res.errors[0].extensions.errors.length > 0
    ) {
      errorItems = _.cloneDeep(res.errors[0].extensions.errors);
    }
  }
  if (errorItems.length > 0) {
    errorCode = errorItems[0].errorCode;
  }
  const action = 1;
  // const action = hasErrors
  //   ? SharedListAction.ErrorValidate
  //   : SharedListAction.CreateUpdateGroupSuccess;

  let listUpdateTime = null;
  if (res.data && res.data.settingValue) {
    const settingValue = JSON.parse(res.data.settingValue);
    if (settingValue && settingValue.listUpdateTime) {
      listUpdateTime = JSON.parse(res.data.settingValue).listUpdateTime;
    }
  }

  return { action, errorCode, errorItems, listUpdateTime };
};

/**
 * Pase Create update Share
 * @param res
 */
const parseCreateUpdateSharedGroupResponse = res => {
  let isSuccess = true;
  const rowIds = [];
  if (res.data.errors && res.data.errors.length > 0) {
    for (let i = 0; i < res.data.errors[0].extensions.errors.length; i++) {
      rowIds.push(res.data.errors[0].extensions.errors[i].rowId);
    }
    isSuccess = false;
  }

  const customerListId = res.data.customerListId;
  return { customerListId, rowIds, isSuccess };
};

const parseSharedListFail = res => {
  let errorMsg = [];
  let errorCode = '';
  if (res.parameters.extensions.error && res.parameters.extensions.error.length > 0) {
    errorMsg = res.parameters.extensions.error[0].message
      ? res.parameters.extensions.error[0].message
      : [];
    errorCode = res.parameters.extensions.errors[0].errorCode;
  }
  return { errorCode, errorMsg };
};

const parseErrorCreateUpadte = res => {
  const errorMsg = [];
  const errorItems = [];
  const rowIds = [];
  const errorParams = [];
  const errorList = res.parameters.extensions.errors;
  const hasErrors = errorList && errorList.length > 0;
  if (hasErrors) {
    for (let i = 0; i < errorList.length; i++) {
      errorMsg.push(errorList[i].errorCode);
      if (errorList[i].item === 'businessCardListName') {
        errorItems.push('customerListName');
      } else {
        errorItems.push(errorList[i].item);
      }
      rowIds.push(errorList[i].rowId);
      errorParams.push(errorList[i].errorParams);
    }
  }
  return { errorMsg, errorItems, rowIds, errorParams };
};

export type BusinessCardMySharedListState = Readonly<typeof initialState>;

// Reducer
export default (
  state: BusinessCardMySharedListState = initialState,
  action
): BusinessCardMySharedListState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.INITIAL):
    case REQUEST(ACTION_TYPES.ITEM):
    case REQUEST(ACTION_TYPES.CREATE):
    case REQUEST(ACTION_TYPES.UPDATE): {
      return {
        ...state,
        action: DynamicGroupModalAction.Request
      };
    }
    case FAILURE(ACTION_TYPES.INITIAL):
    case FAILURE(ACTION_TYPES.ITEM): {
      {
        const res = parseSharedListFail(action.payload.response.data);
        return {
          ...state,
          action: DynamicGroupModalAction.Error,
          errorMessageInModal: res.errorMsg
        };
      }
    }
    case FAILURE(ACTION_TYPES.CREATE):
    case FAILURE(ACTION_TYPES.UPDATE): {
      const res = parseErrorCreateUpadte(action.payload.response.data);
      return {
        ...state,
        action: DynamicGroupModalAction.Error,
        errorItems: res.errorItems,
        rowIds: res.rowIds,
        errorMessageInModal: res.errorMsg,
        errorParams: res.errorParams
      };
    }
    case SUCCESS(ACTION_TYPES.INITIAL):
    case SUCCESS(ACTION_TYPES.ITEM): {
      const res = parseInitSharedGroupResponse(action.payload);
      return {
        ...state,
        action: DynamicGroupModalAction.Doneinit,
        group: res.group,
        listFieldSearch: res.listFieldSearch,
        listParticipants: res.listParticipants,
        customFieldsInfo: res.customFieldsInfo,
        listUpdateTime: res.listUpdateTime
      };
    }
    case SUCCESS(ACTION_TYPES.CREATE): {
      return {
        ...state,
        action: DynamicGroupModalAction.CreateUpdateSuccess,
        msgSuccess: { successId: SHOW_MESSAGE_SUCCESS.CREATE }
      };
    }
    case SUCCESS(ACTION_TYPES.UPDATE): {
      const res = parseCreateUpdateSharedGroupResponse(action.payload);
      return {
        ...state,
        action: DynamicGroupModalAction.CreateUpdateSuccess,
        updatedListId: { customerListId: res.customerListId },
        msgSuccess: { successId: SHOW_MESSAGE_SUCCESS.UPDATE }
      };
    }
    case SUCCESS(ACTION_TYPES.GET_GENERAL_SETTING): {
      const resSetting = parseResponseGetSetting(action.payload);
      return {
        ...state,
        listUpdateTime: resSetting.listUpdateTime
      };
    }
    case ACTION_TYPES.RESET_ERROR:
      return {
        ...state,
        errorItems: [],
        errorMessageInModal: null
      };
    case ACTION_TYPES.RESET:
      return {
        ...initialState
      };
    default:
      return state;
  }
};

// API base URL
const businessApiUrl = API_CONTEXT_PATH + '/' + API_CONFIG.BUSINESS_CARD_SERVICE_PATH;
const commonsApiUrl = API_CONTEXT_PATH + '/' + API_CONFIG.COMMON_SERVICE_PATH;
const generalSettingApiURL = API_CONTEXT_PATH + '/' + API_CONFIG.COMMON_SERVICE_PATH;

/**
 * getInitialListInfos
 *
 * @param
 */
export const getInitialListInfos = (listId, isOwnerList, isAutoList) => {
  return {
    type: ACTION_TYPES.INITIAL,
    payload: axios.post(
      `${businessApiUrl}/get-business-cards-list`,
      {
        ...(listId && { businessCardListDetailIds: [listId] })
      },
      { headers: { ['Content-Type']: 'application/json' } }
    )
  };
};
const getInitialItemInfos = () => ({
  type: ACTION_TYPES.ITEM,
  payload: axios.post(
    `${commonsApiUrl}/get-custom-fields-info`,
    JSON.stringify({
      fieldBelong: FIELD_BELONG.BUSINESS_CARD
    }),
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

/**
 * createGroup
 *
 * @param groupParams
 */
const createGroup = (
  groupName,
  groupType,
  isAutoGroup,
  isOverWriteIn,
  groupMembersParam,
  listParticipantsParam,
  searchConditionsParam,
  fieldIdOfIsWorking,
  fieldInfoRelation
) => {
  const ownerListData = [];
  const viewerListData = [];
  if (listParticipantsParam && listParticipantsParam.length > 0) {
    listParticipantsParam.forEach(element => {
      if (element.participantType === 2) {
        ownerListData.push(element.employeeId);
      } else {
        viewerListData.push(element.employeeId);
      }
    });
  }
  const searchListData = [];
  if (searchConditionsParam && searchConditionsParam.length > 0) {
    searchConditionsParam.forEach(element => {
      const valueOfIsWorking = tryParseJson(element.fieldValue);
      if (!_.includes(fieldInfoRelation, element.fieldId)) {
        if (element.fieldId === fieldIdOfIsWorking) {
          searchListData.push({
            fieldOrder: element.fieldOrder,
            fieldId: element.fieldId,
            searchOption: element.searchOption,
            searchType: element.searchType,
            searchValue:
              valueOfIsWorking.length > 1
                ? ''
                : _.isEmpty(valueOfIsWorking)
                  ? ''
                  : _.toString(valueOfIsWorking) === "1"
          });
        } else {
          searchListData.push({
            fieldOrder: element.fieldOrder,
            fieldId: element.fieldId,
            searchOption: element.searchOption,
            searchType: element.searchType,
            searchValue: element.fieldValue
          });
        }
      }
    });
  }
  return {
    type: ACTION_TYPES.CREATE,
    payload: axios.post(
      `${businessApiUrl}/create-business-cards-list`,
      {
        businessCardList: {
          businessCardListName: groupName,
          listType: groupType,
          isOverWrite: Number(isOverWriteIn),
          listMode: isAutoGroup ? 2 : 1,
          ownerList: ownerListData,
          viewerList: viewerListData
        },
        searchConditions: searchListData,
        listOfBusinessCardId: groupMembersParam
      },
      { headers: { ['Content-Type']: 'application/json' } }
    )
  };
};

export const getGeneralSetting = () => ({
  type: ACTION_TYPES.GET_GENERAL_SETTING,
  payload: axios.post(
    `${generalSettingApiURL}/get-general-setting`,
    {
      settingName: 'list_update_time'
    },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

export const handleGetGeneralSetting = () => async dispatch => {
  await dispatch(getGeneralSetting());
};

/**
 * updateGroup
 *
 * @param groupParams
 */
export const updateGroup = (
  groupId,
  groupName,
  groupType,
  isAutoGroup,
  isOverWriteIn,
  listParticipantsParam,
  searchConditionsParam,
  updatedDate,
  fieldIdOfIsWorking,
  fieldInfoRelation
) => {
  const ownerListData = [];
  const viewerListData = [];
  if (listParticipantsParam && listParticipantsParam.length > 0) {
    listParticipantsParam.forEach(e => {
      if (e.participantType === 2) {
        ownerListData.push(e.employeeId);
      } else {
        viewerListData.push(e.employeeId);
      }
    });
  }

  const searchListData = [];
  if (searchConditionsParam && searchConditionsParam.length > 0) {
    searchConditionsParam.forEach(ele => {
      const valueOfIsWorking = tryParseJson(ele.fieldValue);
      if (!_.includes(fieldInfoRelation, ele.fieldId)) {
        if (ele.fieldId === fieldIdOfIsWorking) {
          searchListData.push({
            fieldOrder: ele.fieldOrder,
            fieldId: ele.fieldId,
            searchOption: ele.searchOption,
            searchType: ele.searchType,
            searchValue:
              valueOfIsWorking.length > 1
                ? ''
                : _.isEmpty(valueOfIsWorking)
                  ? ''
                  : _.toString(valueOfIsWorking) === "1"
          });
        } else {
          searchListData.push({
            fieldOrder: ele.fieldOrder,
            fieldId: ele.fieldId,
            searchOption: ele.searchOption,
            searchType: ele.searchType,
            searchValue: ele.fieldValue
          });
        }
      }
    });
  }
  return {
    type: ACTION_TYPES.UPDATE,
    payload: axios.post(
      `${businessApiUrl}/update-business-cards-list`,
      {
        businessCardListDetailId: groupId,
        businessCardList: {
          businessCardListName: groupName,
          listType: groupType,
          isOverWrite: Number(isOverWriteIn),
          listMode: isAutoGroup ? 2 : 1,
          ownerList: ownerListData,
          viewerList: viewerListData,
          updatedDate
        },
        searchConditions: searchListData
      },
      { headers: { ['Content-Type']: 'application/json' } }
    )
  };
};

/**
 * Handle Init List Modal
 * @param groupId
 * @param isOwnerGroup
 * @param isAutoList
 */
export const handleInitListModal = (groupId, isOwnerGroup, isAutoList) => async dispatch => {
  if (groupId) {
    await dispatch(getInitialListInfos(groupId, isOwnerGroup, isAutoList));
  } else {
    await dispatch(getInitialItemInfos());
  }
};

/**
 * Handle Reset
 */
export const reset = () => ({
  type: ACTION_TYPES.RESET
});

/**
 * Handle Submit List Infos
 */
export const handleSubmitListInfos = (
  groupId,
  groupName,
  groupType,
  isAutoGroup,
  isOverWrite,
  groupMembersParam,
  listParticipantsParam,
  searchConditionsParam,
  updatedDate,
  groupMode: number,
  fieldIdOfIsWorking,
  fieldInfo
) => async (dispatch, getState) => {
  switch (groupMode) {
    case GROUP_MODE_SCREEN.CREATE:
    case GROUP_MODE_SCREEN.CREATE_LOCAL:
    case GROUP_MODE_SCREEN.COPY:
      await dispatch(
        createGroup(
          groupName,
          groupType,
          isAutoGroup,
          isOverWrite,
          groupMembersParam,
          listParticipantsParam,
          searchConditionsParam,
          fieldIdOfIsWorking,
          fieldInfo
        )
      );
      break;
    case GROUP_MODE_SCREEN.EDIT:
    case GROUP_MODE_SCREEN.SWITCH_TYPE:
      await dispatch(
        updateGroup(
          groupId,
          groupName,
          groupType,
          isAutoGroup,
          isOverWrite,
          listParticipantsParam,
          searchConditionsParam,
          updatedDate,
          fieldIdOfIsWorking,
          fieldInfo
        )
      );
      break;
    default:
      break;
  }
};

/**
 * reset state Error
 */
export const resetError = () => ({
  type: ACTION_TYPES.RESET_ERROR
});
