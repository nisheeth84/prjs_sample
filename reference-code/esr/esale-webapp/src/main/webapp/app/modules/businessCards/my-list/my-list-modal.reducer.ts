import axios from 'axios';
import _ from 'lodash';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { API_CONTEXT_PATH } from 'app/config/constants';
import { API_CONFIG } from 'app/config/constants';
import { translate } from 'react-jhipster';

export const ACTION_TYPES = {
  RESET_LIST_MODAL: 'LIST/RESET',
  INITIALIZE_LIST_MODAL: 'LIST/INITIALIZE_LIST_MODAL',
  CREATE_LIST: 'LIST/CREATE_LIST',
  UPDATE_LIST: 'LIST/UPDATE_LIST',
  MOVE_TO_LIST: 'LIST/MOVE_TO_LIST',
  ADD_TO_LIST: 'LIST/ADD_TO_LIST',
  GET_GENERAL_SETTING: 'LIST/GET-GENERAL-SETITNG'
};

export enum MyListAction {
  None,
  Error,
  Success
}

const initialModalState = {
  cardList: null,
  errorCode: '',
  modalAction: MyListAction.None,
  searchConditions: null,
  customFields: null,
  errorItems: null,
  errorMsg: null,
  successMessage: null,
  listUpdateTime: null
};

/**
 * parse Response API
 * @param res
 */
const parseCreateUpdateListResponse = res => {
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
  const errorMsg = [];
  if (res.errors && res.errors.length > 0) {
    if (
      res.errors[0].extensions &&
      res.errors[0].extensions.errors &&
      res.errors[0].extensions.errors.length > 0
    ) {
      res.errors[0].extensions.errors.forEach(e => {
        errorMsg.push(e);
      });
    }
  }
  const action = hasErrors ? MyListAction.Error : MyListAction.Success;
  return { action, errorCode, errorItems, errorMsg };
};

/**
 * parse List Response
 * @param res
 */
const parseGetListResponse = res => {
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
  const action = hasErrors ? MyListAction.Error : MyListAction.Success;
  let cardList = null;
  const newSearchCondition = [];
  if (res.data && res.data.businessCardList && res.data.businessCardList.length > 0) {
    cardList = res.data.businessCardList[0];
    if (cardList.searchConditions && cardList.searchConditions.length > 0) {
      cardList.searchConditions.forEach(sc => {
        const valueCheck = sc.searchValue;
        if (valueCheck && valueCheck.trim()) {
          newSearchCondition.push({ ...sc, isSearchBlank: false });
        } else {
          newSearchCondition.push({ ...sc, isSearchBlank: true });
        }
      });
    }
    cardList = { ...cardList, searchConditions: newSearchCondition };
  }
  return { action, errorCode, errorItems, cardList };
};

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
  const action = hasErrors ? MyListAction.Error : MyListAction.Success;

  let listUpdateTime = null;
  if (res.data && res.data.settingValue) {
    const settingValue = JSON.parse(res.data.settingValue);
    if (settingValue && settingValue.listUpdateTime) {
      listUpdateTime = JSON.parse(res.data.settingValue).listUpdateTime;
    }
  }

  return { action, errorCode, errorItems, listUpdateTime };
};

export const parseErrorRespose = payload => {
  let errorMes = [];
  if (payload.response.data.parameters) {
    if (payload.response.data.parameters.message) {
      errorMes[0] = payload.response.data.parameters.message;
    } else if (payload.response.data.parameters.extensions) {
      const resError = payload.response.data.parameters.extensions;
      if (resError.errors) {
        errorMes = resError.errors;
      }
    }
  }
  return errorMes;
};

export type MyListModalState = Readonly<typeof initialModalState>;

/**
 * Reducer for Add Edit My list
 */
export default (state: MyListModalState = initialModalState, action): MyListModalState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.INITIALIZE_LIST_MODAL):
    case REQUEST(ACTION_TYPES.CREATE_LIST):
    case REQUEST(ACTION_TYPES.UPDATE_LIST):
    case REQUEST(ACTION_TYPES.GET_GENERAL_SETTING):
      return {
        ...state
      };
    case SUCCESS(ACTION_TYPES.INITIALIZE_LIST_MODAL): {
      const res1 = parseGetListResponse(action.payload);
      return {
        ...state,
        errorCode: res1.errorCode,
        errorItems: res1.errorItems,
        cardList: res1.cardList
      };
    }
    case SUCCESS(ACTION_TYPES.GET_GENERAL_SETTING): {
      const resSetting = parseResponseGetSetting(action.payload);
      return {
        ...state,
        listUpdateTime: resSetting.listUpdateTime
      };
    }
    case SUCCESS(ACTION_TYPES.CREATE_LIST):
    case SUCCESS(ACTION_TYPES.UPDATE_LIST): {
      const res2 = parseCreateUpdateListResponse(action.payload.data);
      return {
        ...state,
        successMessage: translate('messages.INF_COM_0003'),
        modalAction: res2.action,
        errorCode: res2.errorCode,
        errorItems: res2.errorItems,
        errorMsg: res2.errorMsg
      };
    }
    case FAILURE(ACTION_TYPES.INITIALIZE_LIST_MODAL):
    case FAILURE(ACTION_TYPES.CREATE_LIST):
    case FAILURE(ACTION_TYPES.GET_GENERAL_SETTING):
    case FAILURE(ACTION_TYPES.UPDATE_LIST): {
      const res = parseErrorRespose(action.payload);
      return {
        ...state,
        errorCode: res[0].errorCode,
        errorItems: res,
        errorMsg: res
      };
    }

    case ACTION_TYPES.RESET_LIST_MODAL:
      return {
        ...initialModalState
      };
    default:
      return state;
  }
};

// API base URL
const businessCardsApiUrl = API_CONTEXT_PATH + '/' + API_CONFIG.BUSINESS_CARD_SERVICE_PATH;
const generalSettingApiURL = API_CONTEXT_PATH + '/' + API_CONFIG.COMMON_SERVICE_PATH;

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

export const initializeListModal = businessCardListDetailId => ({
  type: ACTION_TYPES.INITIALIZE_LIST_MODAL,
  payload: axios.post(
    `${businessCardsApiUrl}/get-business-cards-list`,
    {
      businessCardListDetailIds: [businessCardListDetailId]
    },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

/**
 * handle Initialize
 * @param businessCardListDetailId
 */
export const handleInitializeListModal = businessCardListDetailId => async dispatch => {
  await dispatch(initializeListModal(businessCardListDetailId));
};

/**
 * Dispatch Create My List
 * @param businessCardListName
 * @param listType
 * @param listMode
 * @param ownerList
 * @param viewerList
 * @param isOverWrite
 * @param searchConditions
 * @param listOfBusinessCardId
 */
const dispatchCreateList = (
  businessCardListName,
  listType,
  listMode,
  ownerList,
  viewerList,
  isOverWrite,
  searchConditions,
  listOfBusinessCardId
) => ({
  type: ACTION_TYPES.CREATE_LIST,
  payload: axios.post(
    `${businessCardsApiUrl}/create-business-cards-list`,
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

/**
 * handle Create My List
 * @param businessCardListName
 * @param listType
 * @param listMode
 * @param ownerList
 * @param viewerList
 * @param isOverWrite
 * @param searchConditions
 * @param listOfBusinessCardId
 */
export const handleCreateList = (
  businessCardListName,
  listType,
  listMode,
  ownerList,
  viewerList,
  isOverWrite,
  searchConditions,
  listOfBusinessCardId
) => async dispatch => {
  await dispatch(
    dispatchCreateList(
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

/**
 * Dispatch Update List
 * @param listId
 * @param businessCardListName
 * @param listType
 * @param listMode
 * @param isOverWrite
 * @param updatedDate
 * @param searchConditions
 */
const dispatchUpdateList = (
  listId,
  businessCardListName,
  listType,
  listMode,
  isOverWrite,
  updatedDate,
  searchConditions
) => ({
  type: ACTION_TYPES.UPDATE_LIST,
  payload: axios.post(
    `${businessCardsApiUrl}/update-business-cards-list`,
    {
      businessCardListDetailId: listId,
      businessCardList: {
        businessCardListName,
        listType,
        listMode,
        isOverWrite,
        updatedDate
      },
      searchConditions
    },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

/**
 * Handle Update List
 * @param listId
 * @param businessCardListName
 * @param listType
 * @param listMode
 * @param isOverWrite
 * @param updatedDate
 * @param searchConditions
 */
export const handleUpdateList = (
  listId,
  businessCardListName,
  listType,
  listMode,
  isOverWrite,
  updatedDate,
  searchConditions
) => async dispatch => {
  await dispatch(
    dispatchUpdateList(
      listId,
      businessCardListName,
      listType,
      listMode,
      isOverWrite,
      updatedDate,
      searchConditions
    )
  );
};

/**
 * reset all
 */
export const reset = () => ({
  type: ACTION_TYPES.RESET_LIST_MODAL
});
