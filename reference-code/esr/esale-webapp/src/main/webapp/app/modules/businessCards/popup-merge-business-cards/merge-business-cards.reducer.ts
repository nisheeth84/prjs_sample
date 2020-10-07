import { isArray } from './../../products/components/MessageConfirm/util';
import { BUSINESS_CARD_DEF } from '../constants';
import axios from 'axios';
import _ from 'lodash';
import { API_CONTEXT_PATH, ScreenMode } from 'app/config/constants';
import { tryParseJson } from 'app/shared/util/string-utils';
import { API_CONFIG } from 'app/config/constants';
import { SUCCESS, FAILURE, REQUEST } from 'app/shared/reducers/action-type.util';
import StringUtils from 'app/shared/util/string-utils';
import { parseErrorRespose } from 'app/shared/util/string-utils';
import { translate } from 'react-jhipster';

export enum BusinessCardsAction {
  None,
  Request,
  Error,
  Success
}

const initialState = {
  screenMode: ScreenMode.DISPLAY,
  customFieldInfos: null,
  errorItems: null,
  businessCardListMerge: null,
  suggestionCardList: null,
  action: BusinessCardsAction.None,
  errorMessage: null,
  errorCodeList: null,
  listBusinessCardList: null,
  mergeSuccess: null
};

export const ACTION_TYPES = {
  BUSINESS_CARD_LIST_MERGE_GET: 'BusinessCardList/BUSINESS_CARD_LIST_MERGE_GET',
  BUSINESS_CARD_LIST_CUSTOM_FIELD_INFO_GET_LIST: 'BusinessCardList/CUSTOM_FIELD_INFO_GET_LAYOUT',
  MERGE_BUSINESS_CARDS: 'BusinessCardList/MERGE_BUSINESS_CARDS',
  BUSINESS_CARD_SUGGESTION_GET: 'BusinessCardList/BUSINESS_CARD_SUGGESTION_GET',
  RESET: 'businessCard/RESET'
};
const businessCardsApiUrl = API_CONTEXT_PATH + '/' + API_CONFIG.BUSINESS_CARD_SERVICE_PATH;
const commonsApiUrl = API_CONTEXT_PATH + '/' + API_CONFIG.COMMON_SERVICE_PATH;

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
  if (res && res.businessCards && isArray(res.businessCards)) {
    businessCards = res;
  }
  if (res && res.businessCards && res.businessCards.length > 0) {
    businessCards.businessCards.forEach((element, idx) => {
      const businessCardsData = element.businessCardData;
      const newElement = {};
      for (const prop in element) {
        if (Object.prototype.hasOwnProperty.call(element, prop) && prop !== 'businessCardsData') {
          newElement[StringUtils.camelCaseToSnakeCase(prop)] =
            !_.isNull(element[prop]) && !_.isUndefined(element[prop]) ? element[prop] : null;
        }
      }
      businessCardsData &&
        businessCardsData.forEach(e => {
          newElement[e.key] = e.value;
        });
      businessCards.businessCards[idx] = newElement;
    });
  }
  return { errorMsg, action, businessCards, errorCodeList };
};

const parseCustomFieldsInfoResponse = (res, type) => {
  const fieldInfos = res;
  if (fieldInfos.customFieldsInfo) {
    fieldInfos.customFieldsInfo.sort((a, b) => a.fieldOrder - b.fieldOrder);
  }
  return { fieldInfos };
};

export type MergeBusinessCardState = Readonly<typeof initialState>;

// Reducer
export default (state: MergeBusinessCardState = initialState, action): MergeBusinessCardState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.BUSINESS_CARD_LIST_CUSTOM_FIELD_INFO_GET_LIST):
    case REQUEST(ACTION_TYPES.BUSINESS_CARD_LIST_MERGE_GET):
    case REQUEST(ACTION_TYPES.MERGE_BUSINESS_CARDS):
    case REQUEST(ACTION_TYPES.BUSINESS_CARD_SUGGESTION_GET):
      return {
        ...state,
        action: BusinessCardsAction.Request,
        errorItems: null
      };
    case FAILURE(ACTION_TYPES.BUSINESS_CARD_LIST_MERGE_GET):
    case FAILURE(ACTION_TYPES.BUSINESS_CARD_LIST_CUSTOM_FIELD_INFO_GET_LIST):
    case FAILURE(ACTION_TYPES.MERGE_BUSINESS_CARDS):
    case FAILURE(ACTION_TYPES.BUSINESS_CARD_SUGGESTION_GET): {
      const error = parseErrorRespose(action.payload);
      return {
        ...state,
        action: BusinessCardsAction.Error,
        errorItems: error,
        errorMessage: error && error.length ? error[0].errorCode : action.payload.message
      };
    }
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
    case SUCCESS(ACTION_TYPES.MERGE_BUSINESS_CARDS): {
      return {
        ...state,
        mergeSuccess: translate('messages.INF_COM_0003')
      };
    }
    case SUCCESS(ACTION_TYPES.BUSINESS_CARD_LIST_MERGE_GET): {
      const res = parseListBusinessCardResponse(action.payload.data);
      return {
        ...state,
        action: res.action,
        businessCardListMerge: res.businessCards,
        errorMessage: res.errorMsg,
        errorCodeList: res.errorCodeList
      };
    }
    case SUCCESS(ACTION_TYPES.BUSINESS_CARD_SUGGESTION_GET): {
      const res = action.payload.data;
      return {
        ...state,
        suggestionCardList: res.businessCards
      };
    }
    case ACTION_TYPES.RESET:
      return {
        ...initialState
      };
    default:
      return state;
  }
};

export const getBusinessCards = params => ({
  type: ACTION_TYPES.BUSINESS_CARD_LIST_MERGE_GET,
  payload: axios.post(
    `${businessCardsApiUrl}/get-business-cards`,
    {
      selectedTargetType: params.selectedTargetType,
      selectedTargetId: params.selectedTargetId,
      searchConditions: [params.searchConditions],
      orderBy: params.orderBy,
      offset: params.offset,
      limit: params.limit,
      searchLocal: params.searchLocal,
      filterConditions: params.filterConditions,
      isFirstLoad: params.isFirstLoad
    },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});
export const getSuggestionCards = params => ({
  type: ACTION_TYPES.BUSINESS_CARD_SUGGESTION_GET,
  payload: axios.post(
    `${businessCardsApiUrl}/get-business-card-suggestions`,
    {
      offset: 0,
      searchValue: params.searchValue,
      listIdChoice: params.listIdChoice,
      customerIds: params.customerIds,
      relationFieldId: params.relationFieldId
    },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});
export const getCustomFieldsInfo = params => ({
  type: ACTION_TYPES.BUSINESS_CARD_LIST_CUSTOM_FIELD_INFO_GET_LIST,
  payload: axios.post(`${commonsApiUrl}/get-custom-fields-info`, params, {
    headers: { ['Content-Type']: 'application/json' }
  })
});

export const handleMergeBusinessCard = (params, fileUploads) => {
  let filesNameList;
  let statusStatic;
  let urlImage = _.isString(params.businessCardImagePath)
    ? params.businessCardImagePath
    : undefined;
  let nameImage = params.businessCardImageName;
  const bodyFormData = new FormData();
  if (fileUploads) {
    statusStatic = 1;
    fileUploads.forEach((file, index) => {
      const key = Object.keys(file)[0];
      bodyFormData.append('files', file[key]);
      if (!filesNameList) {
        filesNameList = [];
      }
      filesNameList.push(key);
    });
  }
  if (filesNameList) {
    statusStatic = 2;
    bodyFormData.append('filesMap', filesNameList);
    urlImage = URL.createObjectURL(Object.values(fileUploads[0])[0]);
    nameImage = Object.values(fileUploads[0])[0]['name'];
  }
  const item = {
    businessCardId: params.businessCardId? params.businessCardId: (params.listOfBusinessCardId && params.listOfBusinessCardId[0]? params.listOfBusinessCardId[0] : null),
    businessCardImagePath: urlImage,
    businessCardImageName: urlImage ? nameImage : '',
    customerId: params.customerId,
    customerName: params.customerName,
    alternativeCustomerName: params.alternativeCustomerName,
    firstName: params.firstName,
    lastName: params.lastName,
    firstNameKana: params.firstNameKana,
    lastNameKana: params.lastNameKana,
    position: params.position,
    departmentName: params.departmentName,
    zipCode: !params.address
      ? ''
      : _.isObject(params.address)
      ? params.address.zip_code
      : _.isString(params.address) && params.address.includes('zip_code')
      ? tryParseJson(params.address).zip_code
      : '',
    address: !params.address
      ? ''
      : _.isObject(params.address)
      ? params.address.address
      : _.isString(params.address) && params.address.includes('address_name')
      ? tryParseJson(params.address).address_name
      : '',
    building: params.building === undefined ? null : params.building,
    emailAddress: params.emailAddress,
    phoneNumber: params.phoneNumber,
    mobileNumber: params.mobileNumber,
    isWorking: params.isWorking,
    memo: params.memo,
    businessCardData: params.businessCardData,
    updatedDate: params.updatedDate,
    ...(statusStatic && { status: statusStatic }),
    ...(params.businessCardId && { listOfBusinessCardId: params.listOfBusinessCardId })
  };
  bodyFormData.append('data', JSON.stringify(item));
  return {
    type: ACTION_TYPES.MERGE_BUSINESS_CARDS,
    payload: axios.post(`${businessCardsApiUrl}/merge-business-cards`, bodyFormData, {
      headers: { ['Content-Type']: 'multipart/form-data' }
    })
  };
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
