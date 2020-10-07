import {
  BUSINESS_CARD_DEF,
  BUSINESS_CARD_LIST_ID,
  BUSINESS_SPECIAL_FIELD_NAMES
} from '../constants';
import axios from 'axios';
import { API_CONTEXT_PATH, ScreenMode, TYPE_MSG_EMPTY } from 'app/config/constants';
import { API_CONFIG } from 'app/config/constants';
import { SUCCESS, FAILURE, REQUEST } from 'app/shared/reducers/action-type.util';
import StringUtils from 'app/shared/util/string-utils';
import { getValueProp } from 'app/shared/util/entity-utils';
import _, { isNil } from 'lodash';
import { translate } from 'react-jhipster';
import { parseErrorRespose } from 'app/modules/businessCards/shared-list/shared-list.reducer';
import dateFnsParse from 'date-fns/parse';

export enum BusinessCardsAction {
  None,
  Request,
  Error,
  Success,
  DragDropSuccess,
  DeleteSucess
}
export enum BusinessCardAction {
  None,
  Request,
  Error,
  Success,
  UpdateSuccess
}

const initialState = {
  screenMode: ScreenMode.DISPLAY,
  customFieldInfos: null,
  errorItems: null,
  businessCardList: null,
  action: BusinessCardsAction.None,
  errorMessage: null,
  errorCodeList: null,
  listBusinessCardList: null,
  errorMessageInModal: null,
  createBusinessCardsList: null,
  deleteList: null,
  addFavoriteList: null,
  listOfBusinessCardId: null,
  fields: null,
  initializeListInfo: null,
  removeFavoriteList: null,
  businessCardInfo: null,
  exportBusinessCardMsg: null,
  msgSuccess: null,
  typeMsgEmpty: TYPE_MSG_EMPTY.NONE,
  resetScreen: false,
  listSuggestions: [],
  deleteBusinessCards: null,
  actionDelete: BusinessCardAction.None,
  updateBusinessCardsList: null,
  errorModalMyList: null,
  infoSearchConditionList: null,
  updateBusinessCards: null,
  errorMessageInpopup: null,
  idOfListRefresh: null
};

export const ACTION_TYPES = {
  BUSINESS_CARD_LIST_GET: 'BusinessCardList/BUSINESS_CARD_LIST_GET',
  BUSINESS_CARD_LIST_RESET: 'BusinessCardList/RESET',
  BUSINESS_CARD_LIST_CHANGE_TO_EDIT: 'BusinessCardList/EDIT',
  BUSINESS_CARD_LIST_CHANGE_TO_DISPLAY: 'BusinessCardList/DISPLAY',
  BUSINESS_CARD_LIST_INITIALIZE_LIST_INFO: 'BusinessCardList/INITIALIZE_LIST_INFO',
  BUSINESS_CARD_LIST_CUSTOM_FIELD_INFO_GET_LIST: 'BusinessCardList/CUSTOM_FIELD_INFO_GET_LAYOUT',
  GET_BUSINESS_CARD_LIST: 'BusinessCardList/GET_BUSINESS_CARD_LIST',
  GET_BUSINESS_CARDS_LIST: 'BusinessCardList/GET_BUSINESS_CARDS_LIST',
  ADD_BUSINESS_CARDS_TO_LIST: 'Popup/ADD_BUSINESS_CARDS_TO_LIST',
  CREATE_MY_LIST: 'Popup/CREATE_MY_LIST',
  CREATE_SHARE_LIST: 'Popup/CREATE_SHARE_LIST',
  REFRESH_AUTO_LIST: 'BusinessCardList/REFRESH_AUTO_LIST',
  ADD_TO_FAVORITE_LIST: 'BusinessCardList/ADD_TO_FAVORITE_LIST',
  REMOVE_LIST_FROM_FAVORITE: 'BusinessCardList/REMOVE_LIST_FROM_FAVORITE',
  SHARED_LIST_RESET_ERROR: 'Popup/SHARED_LIST_RESET_ERROR',
  SIDEBAR_DELETE_LIST: 'BusinessCardList/SIDEBAR_DELETE_LIST',
  BUSINESS_CARDS_UPDATE: 'BusinessCardList/BUSINESS_CARDS_UPDATE',
  DELETE_BUSINESS_CARDS: 'BusinessCardList/DELETE_BUSINESS_CARDS',
  REMOVE_BUSINESS_CARDS_FROM_LIST: 'BusinessCardList/REMOVE_BUSINESS_CARDS_FROM_LIST',
  BUSINESS_CARD_LIST_EXPORT: 'BusinessCardList/BUSINESS_CARD_LIST_EXPORT',
  DRAG_DROP_BUSINESS_CARD: 'BusinessCardList/DRAG_DROP_BUSINESS_CARD',
  GET_LIST_SUGGESTIONS: 'BusinessCardList/GET_LIST_SUGGESTIONS',
  BUSINESS_CARS_LIST_RESET_MESSAGE: 'BusinessCardList/BUSINESS_CARS_LIST_RESET_MESSAGE',
  UPDATE_BUSINESS_CARDS_LIST: 'BusinessCardList/UPDATE_BUSINESS_CARDS_LIST',
  BUSINESS_CARS_LIST_GET_INFO_SEARCH_CONDITION_LIST:
    'BusinessCardList/BUSINESS_CARS_LIST_GET_INFO_SEARCH_CONDITION_LIST',
  RESET_SCREEN: 'RESET_SCREEN'
};

const buildFormData = (params, fileUploads, isUpdate) => {
  const data = new FormData();
  let filesNameList;
  let mapFile = '';
  let separate = '';
  let isChangeCustomer = false;
  if (params) {
    params.forEach(element => {
      if (element['employeeId']) {
        const receivePerson = [];
        element['employeeId'].forEach((e, index) => {
          receivePerson.push({
            employeeId: e,
            receiveDate: element['receiveDate'] ? dateFnsParse(element['receiveDate'][index]) : null
          });
        });
        element.receivePerson = receivePerson;
        delete element['employeeId'];
        delete element['receiveDate'];
      }
      if (element['companyName'] || element['companyName'] === '') {
        isChangeCustomer = true;
        if (_.isString(element['companName'])) {
          element['alternativeCustomerName'] = element['companyName'];
        } else {
          element['customerId'] = element['companyName']['customerId'];
          element['customerName'] = element['companyName']['customerName'];
        }
        delete element['companyName'];
      }
      if (element['businessCardImagePath']) {
        element['status'] = element['businessCardImagePath'];
        delete element['businessCardImagePath'];
      } else {
        element['status'] = 0;
      }
      if (element['address']) {
        const address = JSON.parse(element['address']);
        element['address'] = address['address_name'] ? address['address_name'] : '';
        element['building'] = address['building_name'] ? address['building_name'] : '';
        element['zipCode'] = address['zip_code'] ? address['building_name'] : '';
      }
    });
  }
  if (fileUploads)
    fileUploads.forEach((file, index) => {
      const key = Object.keys(file)[0];
      mapFile += separate + `"${key}": ["variables.files.${index}"]`;
      data.append('files', file[key]);
      if (!filesNameList) {
        filesNameList = [];
      }
      filesNameList.push(key);
      separate = ',';
    });
  if (filesNameList) {
    data.append('filesMap', filesNameList);
  }
  if (!isUpdate) {
    data.append('data', JSON.stringify(params));
  } else data.append('data', JSON.stringify({ businessCards: params, isChangeCustomer }));

  return data;
};
const parseListBusinessCardResponse = res => {
  let errorMsg = '';
  if (res.errors && res.errors.length > 0) {
    errorMsg = res.errors[0].message;
  }
  const errorCodeList = [];
  if (res.errors && res.errors.length > 0) {
    if (
      res.errors[0].extensions &&
      res.errors[0].extensions.errors &&
      res.errors[0].extensions.errors.length > 0
    ) {
      res.errors[0].extensions.errors.forEach(e => {
        if (e.errorCode) {
          errorCodeList.push(e);
        }
      });
    } else {
      errorMsg = res.errors[0].message;
    }
  }
  const action = errorMsg.length > 0 ? BusinessCardsAction.Error : BusinessCardsAction.Success;
  let businessCards = null;
  if (res.data && res.data.businessCards && res.data.businessCards.length > 0) {
    businessCards = res.data;
    businessCards.businessCards.forEach((element, idx) => {
      const businessCardData = element.businessCardData;
      const newElement = {};
      for (const prop in element) {
        if (Object.prototype.hasOwnProperty.call(element, prop) && prop !== 'businessCardsData') {
          newElement[StringUtils.camelCaseToSnakeCase(prop)] = element[prop] ? element[prop] : null;
        }
      }
      if (businessCardData) {
        businessCardData.forEach(e => {
          newElement[e.key] = e.value;
        });
      }
      businessCards.businessCards[idx] = newElement;
    });
  }
  return { errorMsg, action, businessCards, errorCodeList };
};

const parseListBusinessCardListResponse = res => {
  let errorMsg = '';
  if (res.errors && res.errors.length > 0) {
    errorMsg = res.errors[0].extensions.errors;
  }
  const errorCodeList = [];
  if (res.errors && res.errors.length > 0) {
    if (
      res.errors[0].extensions &&
      res.errors[0].extensions.errors &&
      res.errors[0].extensions.errors.length > 0
    ) {
      res.errors[0].extensions.errors.forEach(e => {
        errorCodeList.push(e);
      });
    }
  }
  const action = errorMsg.length > 0 ? BusinessCardsAction.Error : BusinessCardsAction.Success;
  const data = res.data;
  let listBusinessCardList = null;
  if (data && data.listInfo) {
    listBusinessCardList = data.listInfo;
  }
  return { errorMsg, errorCodeList, action, listBusinessCardList };
};

const parseCustomFieldsInfoResponse = (res, type) => {
  const fieldInfos = res;
  if (fieldInfos.customFieldsInfo) {
    fieldInfos.customFieldsInfo.sort((a, b) => a.fieldOrder - b.fieldOrder);
  }
  return { fieldInfos };
};

const parseExportBusinessCards = res => {
  const errorCodeList = [];
  if (res.errors && res.errors.length > 0) {
    if (
      res.errors[0].extensions &&
      res.errors[0].extensions.errors &&
      res.errors[0].extensions.errors.length > 0
    ) {
      res.errors[0].extensions.errors.forEach(e => {
        errorCodeList.push(e);
      });
    }
  }
  let errorMsg = '';
  if (res.errors && res.errors.length > 0) {
    errorMsg = res.errors[0].extensions.errors;
  }
  const action = errorMsg.length > 0 ? BusinessCardsAction.Error : BusinessCardsAction.Success;
  const businessCardInfo = res;
  return { errorMsg, errorCodeList, action, businessCardInfo };
};

const parseInitializeListInfo = res => {
  const action = BusinessCardsAction.Success;
  let initializeListInfo = [];
  let fields = [];
  if (res && res.initializeInfo) {
    initializeListInfo = res.initializeInfo;
  }
  if (res && res.fields && res.fields.length > 0) {
    fields = res.fields;
  }
  return { action, initializeListInfo, fields };
};

const parseCreateListResponse = res => {
  let errorMsg = '';
  if (res.errors && res.errors.length > 0) {
    errorMsg = res.errors[0].extensions.errors;
  }
  const errorCodeList = [];
  if (res.errors && res.errors.length > 0) {
    if (
      res.errors[0].extensions &&
      res.errors[0].extensions.errors &&
      res.errors[0].extensions.errors.length > 0
    ) {
      res.errors[0].extensions.errors.forEach(e => {
        errorCodeList.push(e);
      });
    }
  }
  const action = errorMsg.length > 0 ? BusinessCardsAction.Error : BusinessCardsAction.Success;
  let businessCardListId = null;
  if (res.data) {
    businessCardListId = res.data;
  }
  return { errorMsg, errorCodeList, action, businessCardListId };
};
const parseDragDropBusinessResponse = res => {
  let errorMsg = '';
  if (res.errors && res.errors.length > 0) {
    errorMsg = res.errors[0].message;
  }
  const action =
    errorMsg.length > 0 ? BusinessCardsAction.Error : BusinessCardsAction.DragDropSuccess;
  return { errorMsg, action };
};

const parseDeleteBusinessCard = res => {
  let errorMsg = '';
  if (res.errors && res.errors.length > 0) {
    errorMsg = res.errors[0].message;
  }
  const actionDelete = errorMsg.length > 0 ? BusinessCardAction.Error : BusinessCardAction.Success;
  const deleteBusinessCards = res.data;
  return { errorMsg, actionDelete, deleteBusinessCards };
};
const parseUpdateBusinessCardList = res => {
  let errorMsg = '';
  if (res.errors && res.errors.length > 0) {
    errorMsg = res.errors[0].message;
  }
  const actionDelete = errorMsg.length > 0 ? BusinessCardAction.Error : BusinessCardAction.Success;
  const updateBusinessCardsList = res.data;
  return { errorMsg, actionDelete, updateBusinessCardsList };
};

const parseUpdateBusinessCards = res => {
  const action = BusinessCardsAction.Success;
  const listOfBusinessCardId = res && res.data;
  return { action, listOfBusinessCardId };
};

const getStatus = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.BUSINESS_CARD_LIST_CHANGE_TO_DISPLAY:
      return {
        ...state,
        action: BusinessCardsAction.None,
        errorItems: [],
        errorMessage: null,
        screenMode: ScreenMode.DISPLAY
      };
    case ACTION_TYPES.BUSINESS_CARD_LIST_CHANGE_TO_EDIT:
      return {
        ...state,
        screenMode: ScreenMode.EDIT
      };
    default:
      return state;
  }
};

export type BusinessCardListState = Readonly<typeof initialState>;

const actionFailureApi = (stateRequest, actionRequest) => {
  switch (actionRequest.type) {
    case FAILURE(ACTION_TYPES.BUSINESS_CARD_LIST_GET):
    case FAILURE(ACTION_TYPES.BUSINESS_CARD_LIST_CUSTOM_FIELD_INFO_GET_LIST):
    case FAILURE(ACTION_TYPES.GET_BUSINESS_CARD_LIST):
    case FAILURE(ACTION_TYPES.GET_BUSINESS_CARDS_LIST):
    case FAILURE(ACTION_TYPES.CREATE_SHARE_LIST):
    case FAILURE(ACTION_TYPES.BUSINESS_CARD_LIST_INITIALIZE_LIST_INFO):
    case FAILURE(ACTION_TYPES.REFRESH_AUTO_LIST):
    case FAILURE(ACTION_TYPES.DRAG_DROP_BUSINESS_CARD):
    case FAILURE(ACTION_TYPES.SIDEBAR_DELETE_LIST):
    case FAILURE(ACTION_TYPES.GET_LIST_SUGGESTIONS):
    case FAILURE(ACTION_TYPES.REMOVE_LIST_FROM_FAVORITE):
    case FAILURE(ACTION_TYPES.UPDATE_BUSINESS_CARDS_LIST):
    case FAILURE(ACTION_TYPES.REMOVE_BUSINESS_CARDS_FROM_LIST):
    case FAILURE(ACTION_TYPES.ADD_TO_FAVORITE_LIST):
      {
        const resData = parseErrorRespose(actionRequest.payload);
        return {
          ...stateRequest,
          action: BusinessCardsAction.Error,
          errorMessage: resData[0].errorCode
            ? [resData[0].errorCode]
            : [actionRequest.payload.message],
          errorMessageInpopup: resData[0].errorCode
            ? [resData[0].errorCode]
            : [actionRequest.payload.message]
        };
      }
      break;
    case FAILURE(ACTION_TYPES.ADD_BUSINESS_CARDS_TO_LIST): {
      const resData = parseErrorRespose(actionRequest.payload);
      return {
        ...stateRequest,
        action: BusinessCardsAction.Error,
        errorMessageInpopup: resData[0].errorCode
          ? [resData[0].errorCode]
          : [actionRequest.payload.message]
      };
      break;
    }
    case FAILURE(ACTION_TYPES.CREATE_MY_LIST): {
      const resMyList = parseErrorRespose(actionRequest.payload);
      return {
        ...stateRequest,
        errorModalMyList: resMyList[0].errorCode
          ? [resMyList[0].errorCode]
          : [actionRequest.payload.message]
      };
    }
    case FAILURE(ACTION_TYPES.BUSINESS_CARDS_UPDATE): {
      const resData = parseErrorRespose(actionRequest.payload);
      return {
        ...stateRequest,
        // action: BusinessCardsAction.Error,
        // errorMessage: resData[0].errorCode
        //   ? [resData[0].errorCode]
        //   : [actionRequest.payload.message],
        errorItems: resData
      };
    }
    default:
      break;
  }
};
// Reducer
export default (state: BusinessCardListState = initialState, action): BusinessCardListState => {
  const stateFailure = actionFailureApi(state, action);
  if (!isNil(stateFailure)) {
    return stateFailure;
  }
  switch (action.type) {
    case REQUEST(ACTION_TYPES.BUSINESS_CARD_LIST_CUSTOM_FIELD_INFO_GET_LIST):
    case REQUEST(ACTION_TYPES.BUSINESS_CARD_LIST_GET):
    case REQUEST(ACTION_TYPES.GET_BUSINESS_CARD_LIST):
    case REQUEST(ACTION_TYPES.GET_BUSINESS_CARDS_LIST):
    case REQUEST(ACTION_TYPES.ADD_BUSINESS_CARDS_TO_LIST):
    case REQUEST(ACTION_TYPES.CREATE_MY_LIST):
    case REQUEST(ACTION_TYPES.REFRESH_AUTO_LIST):
    case REQUEST(ACTION_TYPES.GET_LIST_SUGGESTIONS):
    case REQUEST(ACTION_TYPES.UPDATE_BUSINESS_CARDS_LIST):
    case REQUEST(ACTION_TYPES.BUSINESS_CARS_LIST_GET_INFO_SEARCH_CONDITION_LIST):
    case REQUEST(ACTION_TYPES.BUSINESS_CARDS_UPDATE):
      return {
        ...state,
        action: BusinessCardsAction.Request,
        errorItems: null
      };
    case SUCCESS(ACTION_TYPES.BUSINESS_CARD_LIST_CUSTOM_FIELD_INFO_GET_LIST): {
      const res = parseCustomFieldsInfoResponse(
        action.payload.data,
        BUSINESS_CARD_DEF.EXTENSION_BELONG_LIST
      );
      return {
        ...state,
        action: BusinessCardsAction.Success,
        errorMessage: null,
        customFieldInfos: res.fieldInfos
      };
    }
    case SUCCESS(ACTION_TYPES.BUSINESS_CARD_LIST_GET): {
      const res = parseListBusinessCardResponse(action.payload);
      return {
        ...state,
        action: res.action,
        businessCardList: res.businessCards,
        errorMessage: res.errorMsg,
        errorCodeList: res.errorCodeList,
        idOfListRefresh: null
      };
    }
    case SUCCESS(ACTION_TYPES.BUSINESS_CARD_LIST_INITIALIZE_LIST_INFO): {
      const res = parseInitializeListInfo(action.payload.data);
      return {
        ...state,
        initializeListInfo: res.initializeListInfo,
        fields: res.fields
      };
    }
    case SUCCESS(ACTION_TYPES.GET_BUSINESS_CARD_LIST): {
      const res = parseListBusinessCardListResponse(action.payload);
      return {
        ...state,
        action: res.action,
        listBusinessCardList: res.listBusinessCardList,
        errorMessage: res.errorMsg,
        errorCodeList: res.errorCodeList
      };
    }
    case SUCCESS(ACTION_TYPES.GET_BUSINESS_CARDS_LIST): {
      const res = parseListBusinessCardListResponse(action.payload.data);
      return {
        ...state,
        action: res.action,
        listBusinessCardList: res.listBusinessCardList,
        errorMessage: res.errorMsg,
        errorCodeList: res.errorCodeList
      };
    }
    case SUCCESS(ACTION_TYPES.CREATE_MY_LIST):
    case SUCCESS(ACTION_TYPES.CREATE_SHARE_LIST): {
      const res = parseCreateListResponse(action.payload);
      return {
        ...state,
        errorMessage: res.errorMsg,
        errorCodeList: res.errorCodeList,
        createBusinessCardsList: res.businessCardListId,
        resetScreen: true,
        msgSuccess: translate('messages.INF_COM_0003')
      };
    }
    case SUCCESS(ACTION_TYPES.SIDEBAR_DELETE_LIST): {
      const res = action.payload.data;
      return {
        ...state,
        deleteList: res.idOfList
      };
    }
    case SUCCESS(ACTION_TYPES.ADD_BUSINESS_CARDS_TO_LIST): {
      return {
        ...state,
        action: BusinessCardsAction.Success,
        resetScreen: true,
        msgSuccess: translate('messages.INF_COM_0003')
      };
    }
    case SUCCESS(ACTION_TYPES.REFRESH_AUTO_LIST): {
      return {
        ...state,
        idOfListRefresh: action.payload.data.idOfList
      };
    }

    case SUCCESS(ACTION_TYPES.ADD_TO_FAVORITE_LIST): {
      const res = action.payload.data;
      return {
        ...state,
        addFavoriteList: res.idOfList,
        removeFavoriteList: null
      };
    }

    case SUCCESS(ACTION_TYPES.REMOVE_LIST_FROM_FAVORITE): {
      const res = action.payload.data;
      return {
        ...state,
        removeFavoriteList: res.idOfList,
        addFavoriteList: null
      };
    }
    case SUCCESS(ACTION_TYPES.REMOVE_BUSINESS_CARDS_FROM_LIST): {
      return {
        ...state,
        msgSuccess: translate('messages.INF_COM_0005'),
        action: BusinessCardsAction.DeleteSucess
      };
    }
    case SUCCESS(ACTION_TYPES.BUSINESS_CARD_LIST_EXPORT): {
      const res = parseExportBusinessCards(action.payload.data);
      return {
        ...state,
        businessCardInfo: res.businessCardInfo,
        errorMessage: res.errorMsg,
        exportBusinessCardMsg: res.errorCodeList
      };
    }
    case ACTION_TYPES.BUSINESS_CARD_LIST_CHANGE_TO_EDIT:
    case ACTION_TYPES.BUSINESS_CARD_LIST_CHANGE_TO_DISPLAY: {
      return getStatus(state, action);
    }
    case ACTION_TYPES.BUSINESS_CARD_LIST_RESET:
      return {
        ...initialState
      };
    case ACTION_TYPES.SHARED_LIST_RESET_ERROR:
      return {
        ...state,
        errorItems: [],
        errorMessageInModal: null
      };
    case SUCCESS(ACTION_TYPES.DRAG_DROP_BUSINESS_CARD): {
      const res = parseDragDropBusinessResponse(action.payload);
      return {
        ...state,
        action: res.action,
        errorMessage: res.errorMsg,
        msgSuccess: translate('messages.INF_COM_0004'),
        resetScreen: true
      };
    }
    case SUCCESS(ACTION_TYPES.GET_LIST_SUGGESTIONS): {
      const res = action.payload.data;
      return {
        ...state,
        listSuggestions: res
      };
    }
    case SUCCESS(ACTION_TYPES.DELETE_BUSINESS_CARDS): {
      const res = parseDeleteBusinessCard(action.payload);
      return {
        ...state,
        actionDelete: res.actionDelete,
        errorMessage: res.errorMsg,
        deleteBusinessCards: res.deleteBusinessCards
      };
    }
    case SUCCESS(ACTION_TYPES.UPDATE_BUSINESS_CARDS_LIST): {
      const res = parseUpdateBusinessCardList(action.payload);
      return {
        ...state,
        actionDelete: res.actionDelete,
        errorMessage: res.errorMsg,
        updateBusinessCardsList: res.updateBusinessCardsList
      };
    }
    case SUCCESS(ACTION_TYPES.BUSINESS_CARS_LIST_GET_INFO_SEARCH_CONDITION_LIST): {
      const res = action.payload.data;
      return {
        ...state,
        infoSearchConditionList: res.businessCardList
          ? res.businessCardList[0].searchConditions
          : null
      };
    }
    case SUCCESS(ACTION_TYPES.BUSINESS_CARDS_UPDATE): {
      const res = parseUpdateBusinessCards(action.payload);
      return {
        ...state,
        action: res.action,
        updateBusinessCards: res.listOfBusinessCardId
      };
    }
    case ACTION_TYPES.BUSINESS_CARS_LIST_RESET_MESSAGE:
      return {
        ...state,
        msgSuccess: null,
        createBusinessCardsList: null,
        errorCodeList: null,
        errorMessageInpopup: null,
        errorModalMyList: null,
        errorItems: initialState.errorItems
      };
    case ACTION_TYPES.RESET_SCREEN:
      return {
        ...state,
        resetScreen: false
      };
    default:
      return state;
  }
};

const getBusinessCards = params => ({
  type: ACTION_TYPES.BUSINESS_CARD_LIST_GET,
  payload: axios.post(
    `${API_CONTEXT_PATH}/${API_CONFIG.BUSINESS_CARD_SERVICE_PATH}/get-business-cards`,
    params,
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

const makeConditionSearchDefault = (offset, limit) => {
  return {
    selectedTargetType: 0,
    selectedTargetId: 0,
    searchConditions: [],
    orderBy: [],
    offset,
    limit,
    searchLocal: null,
    filterConditions: [],
    isFirstLoad: true
  };
};

export const handleInitBusinessCard = (offset, limit) => async (dispatch, getState) => {
  await dispatch(getBusinessCards(makeConditionSearchDefault(offset, limit)));
};

export const reset = () => ({
  type: ACTION_TYPES.BUSINESS_CARD_LIST_RESET
});

export const handleResetScreen = () => ({
  type: ACTION_TYPES.RESET_SCREEN
});

export const changeScreenMode = (isEdit: boolean) => ({
  type: isEdit
    ? ACTION_TYPES.BUSINESS_CARD_LIST_CHANGE_TO_EDIT
    : ACTION_TYPES.BUSINESS_CARD_LIST_CHANGE_TO_DISPLAY
});

export const getCustomFieldsInfo = extensionBelong => ({
  type: ACTION_TYPES.BUSINESS_CARD_LIST_CUSTOM_FIELD_INFO_GET_LIST,
  payload: axios.post(
    `${API_CONTEXT_PATH}/${API_CONFIG.COMMON_SERVICE_PATH}/get-custom-fields-info`,
    {
      fieldBelong: BUSINESS_CARD_DEF.FIELD_BELONG
    },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

export const handleSearchBusinessCardView = (
  selectedTargetType: number,
  selectedTargetId: number,
  offset: number,
  limit: number,
  params: string | any[],
  orderBy?: any[]
) => async (dispatch, getState) => {
  const condition = makeConditionSearchDefault(offset, limit);
  condition.selectedTargetType = selectedTargetType;
  condition.selectedTargetId = selectedTargetId;
  if (!params || params.length <= 0) {
    await dispatch(getBusinessCards(condition));
  } else if (params.constructor === 'test'.constructor) {
    condition.searchLocal = params;
  } else if (params.constructor === [].constructor) {
    const searchConditions = [];
    for (let i = 0; i < params.length; i++) {
      const isArray = Array.isArray(params[i].fieldValue);
      if (!params[i].isSearchBlank && (!params[i].fieldValue || params[i].fieldValue.length <= 0)) {
        continue;
      }
      let val = null;
      if (params[i].isSearchBlank) {
        val = '';
      } else if (isArray) {
        val = JSON.stringify(params[i].fieldValue);
      } else {
        val = params[i].fieldValue.toString();
      }
      searchConditions.push({
        fieldId: params[i].fieldId,
        fieldType: params[i].fieldType,
        isDefault: `${params[i].isDefault}`,
        fieldName: params[i].fieldName,
        fieldValue: val,
        searchType: params[i].searchType,
        searchOption: params[i].searchOption,
        timeZoneOffset: params[i].timeZoneOffset
      });
    }
    condition.searchConditions = searchConditions;
  }
  if (orderBy && orderBy.length > 0) {
    condition.orderBy.push(...orderBy);
  }
  await dispatch(getBusinessCards(condition));
};

export const handleSearchBusinessCard = (
  selectedTargetType: number,
  selectedTargetId: number,
  offset: number,
  limit: number,
  params: string | any[],
  filterConditions?: any[],
  orderBy?: any[]
) => async (dispatch, getState) => {
  const condition = makeConditionSearchDefault(offset, limit);
  if (selectedTargetType) {
    condition.selectedTargetType = selectedTargetType;
  }
  if (selectedTargetId) {
    condition.selectedTargetId = selectedTargetId;
  }
  condition.isFirstLoad = false;
  if (params.constructor === 'test'.constructor) {
    condition.searchLocal = params;
    initialState.typeMsgEmpty = TYPE_MSG_EMPTY.SEARCH;
  } else if (params.constructor === [].constructor) {
    const searchConditions = [];
    for (let i = 0; i < params.length; i++) {
      if (!_.isNil(params[i].fieldRelation) || params[i].ignore) {
        continue;
      }
      const isArray = Array.isArray(params[i].fieldValue);
      let val = null;
      if (params[i].isSearchBlank) {
        val = '';
      } else if (isArray) {
        let jsonVal = params[i].fieldValue;
        if (
          jsonVal.length > 0 &&
          jsonVal[0] &&
          (Object.prototype.hasOwnProperty.call(jsonVal[0], 'from') ||
            Object.prototype.hasOwnProperty.call(jsonVal[0], 'to'))
        ) {
          jsonVal = jsonVal[0];
        }
        val = JSON.stringify(jsonVal);
      } else {
        val = params[i].fieldValue.toString();
      }
      searchConditions.push({
        fieldId: params[i].fieldId,
        fieldType: params[i].fieldType,
        isDefault: `${params[i].isDefault}`,
        fieldName: params[i].fieldName,
        fieldValue: val,
        searchType: params[i].searchType,
        searchOption: params[i].searchOption,
        timeZoneOffset: params[i].timeZoneOffset
      });
    }
    condition.searchConditions = searchConditions;
    initialState.typeMsgEmpty = TYPE_MSG_EMPTY.SEARCH;
  }
  if (filterConditions && filterConditions.length > 0) {
    for (let i = 0; i < filterConditions.length; i++) {
      if (
        !filterConditions[i].isSearchBlank &&
        (!filterConditions[i].fieldValue || filterConditions[i].fieldValue.length <= 0)
      ) {
        continue;
      }
      let val = filterConditions[i].fieldValue;
      let isArray = false;
      let jsonObj;
      try {
        isArray = _.isString(val) ? _.isArray((jsonObj = JSON.parse(val))) : _.isArray(val);
      } catch {
        isArray = false;
      }
      if (filterConditions[i].isSearchBlank) {
        val = isArray ? '[]' : '';
      } else {
        if (
          isArray &&
          jsonObj[0] &&
          (Object.prototype.hasOwnProperty.call(jsonObj[0], 'from') ||
            Object.prototype.hasOwnProperty.call(jsonObj[0], 'to'))
        ) {
          val = JSON.stringify(jsonObj[0]);
        } else {
          val = filterConditions[i].fieldValue.toString();
        }
      }
      condition.filterConditions.push({
        fieldId: filterConditions[i].fieldId,
        fieldType: `${filterConditions[i].fieldType}`,
        isDefault: `${filterConditions[i].isDefault}`,
        fieldName: filterConditions[i].fieldName,
        fieldValue: val,
        searchType: filterConditions[i].searchType,
        searchOption: filterConditions[i].searchOption,
        timeZoneOffset: filterConditions[i].timeZoneOffset
      });
    }
    initialState.typeMsgEmpty = TYPE_MSG_EMPTY.FILTER;
  }
  if (orderBy && orderBy.length > 0) {
    const { fieldInfos } = getState().dynamicList.data.get(BUSINESS_CARD_LIST_ID);
    orderBy.forEach((e, idx) => {
      if (fieldInfos && fieldInfos.fieldInfoPersonals) {
        const fIndex = fieldInfos.fieldInfoPersonals.findIndex(o => o.fieldName === e.key);
        if (fIndex >= 0 && !fieldInfos.fieldInfoPersonals[fIndex].isDefault) {
          orderBy[idx].key = `business_card_data.${e.key}`;
        }
      }
    });
    condition.orderBy.push(...orderBy);
    initialState.typeMsgEmpty = TYPE_MSG_EMPTY.FILTER;
  }
  await dispatch(getBusinessCards(condition));
};

const getBusinessCardsList = (idOfList, mode) => ({
  type: ACTION_TYPES.GET_BUSINESS_CARDS_LIST,
  payload: axios.post(
    `${API_CONTEXT_PATH}/${API_CONFIG.BUSINESS_CARD_SERVICE_PATH}/get-business-cards-list`,
    { businessCardListDetailIds: idOfList, mode },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

const getBusinessCardList = () => ({
  type: ACTION_TYPES.GET_BUSINESS_CARD_LIST,
  payload: axios.post(
    `${API_CONTEXT_PATH}/${API_CONFIG.BUSINESS_CARD_SERVICE_PATH}/get-business-card-list`,
    {},
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

const dragDropBusinessCard = (listOfBusinessCardId, idOfNewList, idOfOldList) => async dispatch => {
  await dispatch({
    type: ACTION_TYPES.DRAG_DROP_BUSINESS_CARD,
    payload: axios.post(
      `${API_CONTEXT_PATH}/${API_CONFIG.BUSINESS_CARD_SERVICE_PATH}/drag-drop-business-card`,
      {
        listOfBusinessCardId,
        idOfNewList,
        idOfOldList
      },
      { headers: { ['Content-Type']: 'application/json' } }
    )
  });
};

export const handleGetBusinessCardList = (idOfList, mode) => async (dispatch, getState) => {
  if (idOfList) {
    await dispatch(getBusinessCardsList(idOfList, mode));
  } else {
    await dispatch(getBusinessCardList());
  }
};

const addCardsToList = (lstId, idOfList) => ({
  type: ACTION_TYPES.ADD_BUSINESS_CARDS_TO_LIST,
  payload: axios.post(
    `${API_CONTEXT_PATH}/${API_CONFIG.BUSINESS_CARD_SERVICE_PATH}/add-business-cards-to-list`,
    {
      listOfBusinessCardId: lstId,
      idOfList
    },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

export const handleEventAddCardsToList = (lstId, idOfList) => async (dispatch, getState) => {
  await dispatch(addCardsToList(lstId, idOfList));
};

export const refreshAutoList = idOfList => ({
  type: ACTION_TYPES.REFRESH_AUTO_LIST,
  payload: axios.post(
    `${API_CONTEXT_PATH}/${API_CONFIG.BUSINESS_CARD_SERVICE_PATH}/refresh-auto-list`,
    {
      idOfList
    },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

export const addToFavoriteList = idOfList => ({
  type: ACTION_TYPES.ADD_TO_FAVORITE_LIST,
  payload: axios.post(
    `${API_CONTEXT_PATH}/${API_CONFIG.BUSINESS_CARD_SERVICE_PATH}/add-list-to-favorite`,
    {
      idOfList
    },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

export const removeListFromFavorite = idOfList => ({
  type: ACTION_TYPES.REMOVE_LIST_FROM_FAVORITE,
  payload: axios.post(
    `${API_CONTEXT_PATH}/${API_CONFIG.BUSINESS_CARD_SERVICE_PATH}/remove-list-from-favorite`,
    {
      idOfList
    },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

const createMyList = (
  businessCardListName,
  listType,
  listMode,
  ownerList,
  viewerList,
  isOverWrite,
  searchConditions,
  listOfBusinessCardId
) => ({
  type: ACTION_TYPES.CREATE_MY_LIST,
  payload: axios.post(
    `${API_CONTEXT_PATH}/${API_CONFIG.BUSINESS_CARD_SERVICE_PATH}/create-business-cards-list`,
    {
      businessCardList: {
        businessCardListName,
        listType,
        listMode,
        ownerList,
        viewerList,
        isOverWrite
      },
      searchConditions,
      listOfBusinessCardId
    },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

export const handleCreateMyList = (
  businessCardListName,
  listType,
  listMode,
  ownerList,
  viewerList,
  isOverWrite,
  searchConditions,
  listOfBusinessCardId
) => async (dispatch, getState) => {
  await dispatch(
    createMyList(
      businessCardListName,
      listType,
      listMode,
      ownerList,
      viewerList,
      isOverWrite,
      searchConditions,
      listOfBusinessCardId
    )
  );
};

export const resetError = () => ({
  type: ACTION_TYPES.SHARED_LIST_RESET_ERROR
});

const createShareList = (
  businessCardListName,
  listType,
  listMode,
  ownerList,
  viewerList,
  isOverWrite,
  searchConditions,
  listOfBusinessCardId
) => ({
  type: ACTION_TYPES.CREATE_SHARE_LIST,
  payload: axios.post(
    `${API_CONTEXT_PATH}/${API_CONFIG.BUSINESS_CARD_SERVICE_PATH}/create-business-cards-list`,
    {
      businessCardList: {
        businessCardListName,
        listType,
        listMode,
        ownerList,
        viewerList,
        isOverWrite
      },
      searchConditions,
      listOfBusinessCardId
    },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

export const handleCreateShareList = (
  businessCardListName,
  listType,
  listMode,
  ownerList,
  viewerList,
  isOverWrite,
  searchConditions,
  listOfBusinessCardId
) => async (dispatch, getState) => {
  await dispatch(
    createShareList(
      businessCardListName,
      listType,
      listMode,
      ownerList,
      viewerList,
      isOverWrite,
      searchConditions,
      listOfBusinessCardId
    )
  );
};

export const deleteList = listId => ({
  type: ACTION_TYPES.SIDEBAR_DELETE_LIST,
  payload: axios.post(
    `${API_CONTEXT_PATH}/${API_CONFIG.BUSINESS_CARD_SERVICE_PATH}/delete-business-card-list`,
    {
      idOfList: listId
    },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});
export const handleUpdateBusinessCards = (
  idList: string,
  saveEditValues,
  selectedTargetType,
  selectedTargetId,
  offset,
  limit,
  conditions,
  filterConditions?: any[],
  orderBy?: any[],
  fileUploads?: any[]
) => async (dispatch, getState) => {
  const { businessCardList } = getState().businessCardList;
  const { fieldInfos } = getState().dynamicList.data.get(idList);
  const params = [];
  const groupBusinessCard = saveEditValues.reduce(function(h, obj) {
    h[obj.itemId] = (h[obj.itemId] || []).concat(obj);
    return h;
  }, {});
  for (const emp in groupBusinessCard) {
    if (!Object.prototype.hasOwnProperty.call(groupBusinessCard, emp)) {
      continue;
    }
    const param = {};
    param['businessCardId'] = Number(emp);
    let recordIdx = -1;
    if (
      businessCardList &&
      businessCardList.businessCards &&
      businessCardList.businessCards.length > 0
    ) {
      recordIdx = businessCardList.businessCards.findIndex(
        e => e['business_card_id'].toString() === emp.toString()
      );
      if (recordIdx >= 0) {
        param['updatedDate'] = getValueProp(
          businessCardList.businessCards[recordIdx],
          'updatedDate'
        );
      }
    }
    for (let i = 0; i < groupBusinessCard[emp].length; i++) {
      if (
        !fieldInfos ||
        !fieldInfos.fieldInfoPersonals ||
        fieldInfos.fieldInfoPersonals.length <= 0
      ) {
        continue;
      }
      const fieldIdx = fieldInfos.fieldInfoPersonals.findIndex(
        e => e.fieldId.toString() === groupBusinessCard[emp][i].fieldId.toString()
      );
      if (fieldIdx < 0) {
        continue;
      }
      const fieldName = fieldInfos.fieldInfoPersonals[fieldIdx].fieldName;
      const isDefault = fieldInfos.fieldInfoPersonals[fieldIdx].isDefault;
      if (isDefault) {
        if (
          fieldName !== BUSINESS_SPECIAL_FIELD_NAMES.createdDate &&
          fieldName !== BUSINESS_SPECIAL_FIELD_NAMES.updatedDate
        ) {
          param[StringUtils.snakeCaseToCamelCase(fieldName)] = groupBusinessCard[emp][i].itemValue;
        }
      } else {
        if (param['businessCardData'] === null || param['businessCardData'] === undefined) {
          param['businessCardData'] = [];
        }
        const isArray = Array.isArray(groupBusinessCard[emp][i].itemValue);
        const itemValue = isArray
          ? JSON.stringify(groupBusinessCard[emp][i].itemValue)
          : groupBusinessCard[emp][i].itemValue
          ? groupBusinessCard[emp][i].itemValue.toString()
          : '';
        param['businessCardData'].push({
          fieldType: fieldInfos.fieldInfoPersonals[fieldIdx].fieldType.toString(),
          key: fieldName,
          value: itemValue
        });
      }
    }
    // fill other item not display
    if (!Object.prototype.hasOwnProperty.call(param, 'businessCardData')) {
      param['businessCardData'] = [];
    }
    params.push(param);
  }
  await dispatch({
    type: ACTION_TYPES.BUSINESS_CARDS_UPDATE,
    payload: axios.post(
      `${API_CONTEXT_PATH}/${API_CONFIG.BUSINESS_CARD_SERVICE_PATH}/update-business-cards`,
      buildFormData(params, fileUploads, true),
      { headers: { ['Content-Type']: 'application/json' } }
    )
  });
  const { action } = getState().businessCardList;
  if (action === BusinessCardsAction.Success) {
    await dispatch(
      handleSearchBusinessCard(
        selectedTargetType,
        selectedTargetId,
        offset,
        limit,
        conditions,
        filterConditions,
        orderBy
      )
    );
    await dispatch({ type: ACTION_TYPES.BUSINESS_CARD_LIST_CHANGE_TO_DISPLAY });
  }
};

export const deleteBusinessCard = (paramBusinessCards, paramProcessMode) => ({
  type: ACTION_TYPES.DELETE_BUSINESS_CARDS,
  payload: axios.post(
    `${API_CONTEXT_PATH}/${API_CONFIG.BUSINESS_CARD_SERVICE_PATH}/delete-business-cards`,
    {
      businessCards: paramBusinessCards,
      processMode: paramProcessMode
    },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

export const removeBusinessCardsFromList = (listOfBusinessCardId, idOfList) => ({
  type: ACTION_TYPES.REMOVE_BUSINESS_CARDS_FROM_LIST,
  payload: axios.post(
    `${API_CONTEXT_PATH}/${API_CONFIG.BUSINESS_CARD_SERVICE_PATH}/remove-business-cards-from-list`,
    {
      listOfBusinessCardId,
      idOfList
    },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

export const exportBusinessCards = listId => ({
  type: ACTION_TYPES.BUSINESS_CARD_LIST_EXPORT,
  payload: axios.post(
    `${API_CONTEXT_PATH}/${API_CONFIG.BUSINESS_CARD_SERVICE_PATH}/download-business-cards`,
    {
      listOfBusinessCardId: listId
    },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

export const getInitializeListInfo = fieldBelong => ({
  type: ACTION_TYPES.BUSINESS_CARD_LIST_INITIALIZE_LIST_INFO,
  payload: axios.post(
    `${API_CONTEXT_PATH + '/' + 'commons/api/get-initialize-list-info'}`,
    { fieldBelong },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

export const handleGetInitializeListInfo = fieldBelong => async (dispatch, getState) => {
  await dispatch(getInitializeListInfo(fieldBelong));
};

export const handleExportBusinessCards = listId => async (dispatch, getState) => {
  await dispatch(exportBusinessCards(listId));
};

export const handleDragDropBusinessCard = (lstData, idOfNewList, idOfOldList) => async (
  dispatch,
  getState
) => {
  const listOfBusinessCardId = lstData.map(e => e.business_card_id || e.businessCardId);
  await dispatch(dragDropBusinessCard(listOfBusinessCardId, idOfNewList, idOfOldList));
};

export const getListSuggestions = (searchValue: string) => ({
  type: ACTION_TYPES.GET_LIST_SUGGESTIONS,
  payload: axios.post(
    `${API_CONTEXT_PATH + '/' + API_CONFIG.BUSINESS_CARD_SERVICE_PATH + '/get-list-suggestions'}`,
    { searchValue },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

export const resetMessageList = () => ({
  type: ACTION_TYPES.BUSINESS_CARS_LIST_RESET_MESSAGE
});

export const handleRefreshAutoList = listId => async (dispatch, getState) => {
  await dispatch(refreshAutoList(listId));
};

export interface DataResponseOverflowMenu {
  businessCard: any;
  email: string;
}

export const updatebusinessCardsList = (
  businessCardListDetailId,
  businessCardListName,
  listType,
  listMode,
  ownerList,
  viewerList,
  isOverWrite,
  updatedDate,
  searchConditions,
  hasChangeFromMyList
) => ({
  type: ACTION_TYPES.UPDATE_BUSINESS_CARDS_LIST,
  payload: axios.post(
    `${API_CONTEXT_PATH +
      '/' +
      API_CONFIG.BUSINESS_CARD_SERVICE_PATH +
      '/update-business-cards-list'}`,
    {
      businessCardListDetailId,
      businessCardList: {
        businessCardListName,
        listType,
        ownerList,
        viewerList,
        listMode,
        isOverWrite,
        updatedDate
      },
      searchConditions,
      hasChangeFromMyList
    },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

export const handleUpdateBusinessCardsList = (
  businessCardListDetailId,
  businessCardListName,
  listType,
  listMode,
  ownerList,
  viewerList,
  isOverWrite,
  searchConditions,
  updatedDate,
  hasChangeFromMyList
) => async (dispatch, getState) => {
  await dispatch(
    updatebusinessCardsList(
      businessCardListDetailId,
      businessCardListName,
      listType,
      listMode,
      ownerList,
      viewerList,
      isOverWrite,
      updatedDate,
      searchConditions,
      hasChangeFromMyList
    )
  );
};
export const getSearchConditionInfoList = businessCardListDetailId => ({
  type: ACTION_TYPES.BUSINESS_CARS_LIST_GET_INFO_SEARCH_CONDITION_LIST,
  payload: axios.post(
    `${API_CONTEXT_PATH + '/' + API_CONFIG.BUSINESS_CARD_SERVICE_PATH}/get-business-cards-list`,
    {
      businessCardListDetailIds: [businessCardListDetailId]
    },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});
