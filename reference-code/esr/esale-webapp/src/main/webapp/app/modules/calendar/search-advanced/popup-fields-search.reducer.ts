import axios from 'axios';
import { Storage, translate } from 'react-jhipster';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { API_CONTEXT_PATH } from 'app/config/constants';
import { API_CONFIG } from 'app/config/constants';
import StringUtils, { parseErrorRespose } from 'app/shared/util/string-utils';
import { ID_FIELD_INFO, ItemTypeSchedule } from '../constants';
import { ScheduleType } from 'app/modules/calendar/models/get-schedules-type';

export const ACTION_TYPES = {
  FIELDS_SEARCH_FIELD_INFO_PERSONAL_GET: 'calendar/fieldsSearch/FIELD_INFO_PERSONAL_GET',
  FIELDS_SCHEDULE_SEARCH_FIELD_INFO_PERSONAL_GET:
    'calendar/fieldsSearch/FIELDS_SCHEDULE_SEARCH_FIELD_INFO_PERSONAL_GET',
  FIELDS_TASK_SEARCH_FIELD_INFO_PERSONAL_GET:
    'calendar/fieldsSearch/FIELDS_TASK_SEARCH_FIELD_INFO_PERSONAL_GET',
  FIELDS_MILESTONE_SEARCH_FIELD_INFO_PERSONAL_GET:
    'calendar/fieldsSearch/FIELDS_MILESTONE_SEARCH_FIELD_INFO_PERSONAL_GET',
  FIELDS_SEARCH_CUSTOM_FIELD_TASK_GET: 'calendar/fieldsSearch/CUSTOM_FIELD_TASK_GET',
  FIELDS_SEARCH_CUSTOM_FIELD_SCHEDULE_GET: 'calendar/fieldsSearch/CUSTOM_FIELD_SCHEDULE_GET',
  FIELDS_SEARCH_CUSTOM_FIELD_MILESTONE_GET: 'calendar/fieldsSearch/CUSTOM_FIELD_MILESTONE_GET',
  FIELDS_SEARCH_FIELD_INFO_PERSONAL_UPDATE: 'calendar/fieldsSearch/FIELD_INFO_PERSONAL_UPDATE',
  FIELDS_SEARCH_RESET: 'calendar/fieldsSearch/RESET',
  DETAIL_SEARCH_GET_SCHEDULE_TYPES: 'schedule/getScheduleTypes',
  // SCHEDULE
  SCHEDULE_ELASTIC_SEARCH_CUSTOMER_ID: 'schedule/elasticSearch/CUSTOMER_ID',
  SCHEDULE_ELASTIC_SEARCH_SCHEDULE_RELATED_CUSTOMER_ID:
    'schedule/elasticSearch/SCHEDULE_RELATED_CUSTOMER_ID',
  SCHEDULE_ELASTIC_SEARCH_PRODUCTS_TRADINGS_ID_PRODUCTS:
    'schedule/elasticSearch/PRODUCTS_TRADINGS_ID_PRODUCTS',
  SCHEDULE_ELASTIC_SEARCH_PRODUCTS_TRADINGS_ID_SALES:
    'schedule/elasticSearch/PRODUCTS_TRADINGS_ID_SALES',
  SCHEDULE_ELASTIC_SEARCH_BUSINESS_CARD_ID: 'schedule/elasticSearch/BUSINESS_CARD_ID',
  SCHEDULE_ELASTIC_SEARCH_CREATED_USER: 'schedule/elasticSearch/CREATED_USER',
  SCHEDULE_ELASTIC_SEARCH_UPDATED_USER: 'schedule/elasticSearch/UPDATED_USER',
  // TASK
  TASK_ELASTIC_SEARCH_CUSTOMER_ID: 'task/elasticSearch/CUSTOMER_ID',
  TASK_ELASTIC_SEARCH_SCHEDULE_RELATED_CUSTOMER_ID:
    'task/elasticSearch/SCHEDULE_RELATED_CUSTOMER_ID',
  TASK_ELASTIC_SEARCH_PRODUCTS_TRADINGS_ID_PRODUCTS:
    'task/elasticSearch/PRODUCTS_TRADINGS_ID_PRODUCTS',
  TASK_ELASTIC_SEARCH_PRODUCTS_TRADINGS_ID_SALES: 'task/elasticSearch/PRODUCTS_TRADINGS_ID_SALES',
  TASK_ELASTIC_SEARCH_BUSINESS_CARD_ID: 'task/elasticSearch/BUSINESS_CARD_ID',
  TASK_ELASTIC_SEARCH_CREATED_USER: 'task/elasticSearch/CREATED_USER',
  TASK_ELASTIC_SEARCH_UPDATED_USER: 'task/elasticSearch/UPDATED_USER',
  // MILESTONE
  MILESTONE_ELASTIC_SEARCH_CUSTOMER_ID: 'milestone/elasticSearch/CUSTOMER_ID',
  MILESTONE_ELASTIC_SEARCH_SCHEDULE_RELATED_CUSTOMER_ID:
    'milestone/elasticSearch/SCHEDULE_RELATED_CUSTOMER_ID',
  MILESTONE_ELASTIC_SEARCH_PRODUCTS_TRADINGS_ID_PRODUCTS:
    'milestone/elasticSearch/PRODUCTS_TRADINGS_ID_PRODUCTS',
  MILESTONE_ELASTIC_SEARCH_PRODUCTS_TRADINGS_ID_SALES:
    'milestone/elasticSearch/PRODUCTS_TRADINGS_ID_SALES',
  MILESTONE_ELASTIC_SEARCH_BUSINESS_CARD_ID: 'milestone/elasticSearch/BUSINESS_CARD_ID',
  MILESTONE_ELASTIC_SEARCH_CREATED_USER: 'milestone/elasticSearch/CREATED_USER',
  MILESTONE_ELASTIC_SEARCH_UPDATED_USER: 'milestone/elasticSearch/UPDATED_USER',
  SET_LIST_SEARCH_FIELD: 'SET_LIST_SEARCH_FIELD'
};

const isDUMMY = false;
const DUMMY_DATA_SCHEDULE = {
  errors: null,
  data: {
    fieldInfoPersonals: [
      {
        fieldId: 1,
        fieldName: 'customer_id',
        fieldLabel: '{"ja_jp": "会議室A","en_us": "Conference room A","zh_cn": ""}',
        fieldType: 10,
        fieldOrder: 1,
        fieldItems: [],
        isDefault: true
      },
      {
        fieldId: 2,
        fieldName: 'schedule_related_customer_id',
        fieldLabel: '{"ja_jp": "会議室A","en_us": "Conference room A","zh_cn": ""}',
        fieldType: 10,
        fieldOrder: 1,
        fieldItems: [],
        isDefault: true
      },
      {
        fieldId: 3,
        fieldName: 'products_tradings_id',
        fieldLabel: '{"ja_jp": "勝因","en_us": "","zh_cn": ""}',
        fieldType: 3,
        fieldOrder: 1,
        isDefault: false,
        fieldItems: [
          {
            itemId: 1,
            itemLabel: '{"ja_jp": "勝因1","en_us": "","zh_cn": ""}',
            itemOrder: 1,
            isDefault: true
          },
          {
            itemId: 2,
            itemLabel: '{"ja_jp": "勝因2","en_us": "","zh_cn": ""}',
            itemOrder: 2,
            isDefault: false
          },
          {
            itemId: 3,
            itemLabel: '{"ja_jp": "勝因3","en_us": "","zh_cn": ""}',
            itemOrder: 3,
            isDefault: false
          }
        ]
      },
      {
        fieldId: 4,
        fieldName: 'date1',
        fieldLabel: '{"ja_jp": "勝因4","en_us": "","zh_cn": ""}',
        fieldType: 8,
        fieldOrder: 1,
        fieldItems: []
      },
      {
        fieldId: 5,
        fieldName: 'date2',
        fieldLabel: '{"ja_jp": "勝因5","en_us": "","zh_cn": ""}',
        fieldType: 9,
        fieldOrder: 1,
        fieldItems: []
      },
      {
        fieldId: 6,
        fieldName: 'date3',
        fieldLabel: '{"ja_jp": "勝因6","en_us": "","zh_cn": ""}',
        fieldType: 7,
        fieldOrder: 1,
        fieldItems: []
      },
      {
        fieldId: 7,
        fieldName: 'textarea',
        fieldLabel: '{"ja_jp": "勝因7","en_us": "","zh_cn": ""}',
        fieldType: 11,
        fieldOrder: 1,
        fieldItems: []
      },
      {
        fieldId: 8,
        fieldName: 'address',
        fieldLabel: '{"ja_jp": "勝因8","en_us": "","zh_cn": ""}',
        fieldType: 16,
        fieldOrder: 1,
        fieldItems: []
      },
      {
        fieldId: 9,
        fieldName: 'text',
        fieldLabel: '{"ja_jp": "勝因9","en_us": "","zh_cn": ""}',
        fieldType: 15,
        fieldOrder: 1,
        fieldItems: []
      },
      {
        fieldId: 10,
        fieldName: 'radio',
        fieldLabel: '{"ja_jp": "勝因10","en_us": "","zh_cn": ""}',
        fieldType: 4,
        fieldOrder: 1,
        fieldItems: [
          {
            itemId: 4,
            itemLabel: '{"ja_jp": "勝因11","en_us": "","zh_cn": ""}',
            itemOrder: 1,
            isDefault: true
          },
          {
            itemId: 5,
            itemLabel: '{"ja_jp": "勝因12","en_us": "","zh_cn": ""}',
            itemOrder: 2,
            isDefault: false
          },
          {
            itemId: 6,
            itemLabel: '{"ja_jp": "勝因13","en_us": "","zh_cn": ""}',
            itemOrder: 3,
            isDefault: false
          }
        ]
      }
    ]
  }
};
const DUMMY_DATA_TASK = {
  errors: null,
  data: {
    fieldInfoPersonals: [
      {
        fieldId: 11,
        fieldName: 'text1',
        fieldLabel: '{"ja_jp": "勝因14","en_us": "","zh_cn": ""}',
        fieldType: 10,
        fieldOrder: 1,
        fieldItems: []
      },
      {
        fieldId: 12,
        fieldName: 'text2',
        fieldLabel: '{"ja_jp": "勝因15","en_us": "","zh_cn": ""}',
        fieldType: 10,
        fieldOrder: 1,
        fieldItems: []
      },
      {
        fieldId: 13,
        fieldName: 'checkbox1',
        fieldLabel: '{"ja_jp": "勝因16","en_us": "","zh_cn": ""}',
        fieldType: 3,
        fieldOrder: 1,
        fieldItems: [
          {
            itemId: 7,
            itemLabel: '{"ja_jp": "勝因17","en_us": "","zh_cn": ""}',
            itemOrder: 1,
            isDefault: true
          },
          {
            itemId: 8,
            itemLabel: '{"ja_jp": "勝因18","en_us": "","zh_cn": ""}',
            itemOrder: 2,
            isDefault: false
          },
          {
            itemId: 9,
            itemLabel: '{"ja_jp": "勝因19","en_us": "","zh_cn": ""}',
            itemOrder: 3,
            isDefault: false
          }
        ]
      },
      {
        fieldId: 14,
        fieldName: 'date1',
        fieldLabel: '{"ja_jp": "勝因20","en_us": "","zh_cn": ""}',
        fieldType: 8,
        fieldOrder: 1,
        fieldItems: []
      },
      {
        fieldId: 15,
        fieldName: 'date2',
        fieldLabel: '{"ja_jp": "勝因21","en_us": "","zh_cn": ""}',
        fieldType: 9,
        fieldOrder: 1,
        fieldItems: []
      },
      {
        fieldId: 16,
        fieldName: 'date3',
        fieldLabel: '{"ja_jp": "勝因22","en_us": "","zh_cn": ""}',
        fieldType: 7,
        fieldOrder: 1,
        fieldItems: []
      },
      {
        fieldId: 17,
        fieldName: 'textarea',
        fieldLabel: '{"ja_jp": "勝因23","en_us": "","zh_cn": ""}',
        fieldType: 11,
        fieldOrder: 1,
        fieldItems: []
      },
      {
        fieldId: 18,
        fieldName: 'address',
        fieldLabel: '{"ja_jp": "勝因24","en_us": "","zh_cn": ""}',
        fieldType: 16,
        fieldOrder: 1,
        fieldItems: []
      },
      {
        fieldId: 19,
        fieldName: 'email',
        fieldLabel: '{"ja_jp": "勝因25","en_us": "","zh_cn": ""}',
        fieldType: 17,
        fieldOrder: 1,
        fieldItems: []
      },
      {
        fieldId: 20,
        fieldName: 'radio1',
        fieldLabel: '{"ja_jp": "勝因26","en_us": "","zh_cn": ""}',
        fieldType: 4,
        fieldOrder: 1,
        fieldItems: [
          {
            itemId: 10,
            itemLabel: '{"ja_jp": "勝因27","en_us": "","zh_cn": ""}',
            itemOrder: 1,
            isDefault: true
          },
          {
            itemId: 11,
            itemLabel: '{"ja_jp": "勝因28","en_us": "","zh_cn": ""}',
            itemOrder: 2,
            isDefault: false
          },
          {
            itemId: 12,
            itemLabel: '{"ja_jp": "勝因29","en_us": "","zh_cn": ""}',
            itemOrder: 3,
            isDefault: false
          }
        ]
      }
    ]
  }
};
const DUMMY_DATA_MILESTONE = {
  errors: null,
  data: {
    fieldInfoPersonals: [
      {
        fieldId: 21,
        fieldName: 'text1',
        fieldLabel: '{"ja_jp": "勝因30","en_us": "","zh_cn": ""}',
        fieldType: 10,
        fieldOrder: 1,
        fieldItems: []
      },
      {
        fieldId: 22,
        fieldName: 'text2',
        fieldLabel: '{"ja_jp": "勝因31","en_us": "","zh_cn": ""}',
        fieldType: 10,
        fieldOrder: 1,
        fieldItems: []
      },
      {
        fieldId: 23,
        fieldName: 'checkbox1',
        fieldLabel: '{"ja_jp": "勝因32","en_us": "","zh_cn": ""}',
        fieldType: 3,
        fieldOrder: 1,
        fieldItems: [
          {
            itemId: 1,
            itemLabel: '{"ja_jp": "勝因33","en_us": "","zh_cn": ""}',
            itemOrder: 1,
            isDefault: true
          },
          {
            itemId: 2,
            itemLabel: '{"ja_jp": "勝因34","en_us": "","zh_cn": ""}',
            itemOrder: 2,
            isDefault: false
          },
          {
            itemId: 3,
            itemLabel: '{"ja_jp": "勝因35","en_us": "","zh_cn": ""}',
            itemOrder: 3,
            isDefault: false
          }
        ]
      },
      {
        fieldId: 24,
        fieldName: 'date1',
        fieldLabel: '{"ja_jp": "勝因36","en_us": "","zh_cn": ""}',
        fieldType: 8,
        fieldOrder: 1,
        fieldItems: []
      },
      {
        fieldId: 25,
        fieldName: 'date2',
        fieldLabel: '{"ja_jp": "勝因37","en_us": "","zh_cn": ""}',
        fieldType: 9,
        fieldOrder: 1,
        fieldItems: []
      },
      {
        fieldId: 26,
        fieldName: 'date3',
        fieldLabel: '{"ja_jp": "勝因38","en_us": "","zh_cn": ""}',
        fieldType: 7,
        fieldOrder: 1,
        fieldItems: []
      },
      {
        fieldId: 27,
        fieldName: 'textarea',
        fieldLabel: '{"ja_jp": "勝因39","en_us": "","zh_cn": ""}',
        fieldType: 11,
        fieldOrder: 1,
        fieldItems: []
      },
      {
        fieldId: 28,
        fieldName: 'address',
        fieldLabel: '{"ja_jp": "勝因40","en_us": "","zh_cn": ""}',
        fieldType: 16,
        fieldOrder: 1,
        fieldItems: []
      },
      {
        fieldId: 29,
        fieldName: 'email',
        fieldLabel: '{"ja_jp": "勝因41","en_us": "","zh_cn": ""}',
        fieldType: 17,
        fieldOrder: 1,
        fieldItems: []
      }
    ]
  }
};

const DUMMY_DATA_SCHEDULE_TYPES: Array<ScheduleType> = [
  {
    scheduleTypeId: 1,
    scheduleTypeName: '{"ja_jp": "外出","en_us": "Out of office","zh_cn": "外出"}',
    iconType: 1,
    iconName: 'ic-calendar-user1',
    iconPath: '../../../../content/images/common/calendar/ic-calendar-user1.svg',
    isAvailable: true,
    displayOrder: 1
  },
  {
    scheduleTypeId: 2,
    scheduleTypeName: '{"ja_jp": "来客","en_us": "Visitor","zh_cn": "来客"}',
    iconType: 1,
    iconName: 'ic-calendar-phone',
    iconPath: '../../../../content/images/common/calendar/ic-calendar-phone.svg',
    isAvailable: true,
    displayOrder: 2
  }
];

export enum FieldsSearchAction {
  None,
  Request,
  Error,
  Success
}

export const FIELD_BELONG = {
  SCHEDULE: 2,
  TASK: 15,
  MILESTONE: 1501
};

const initialState = {
  action: FieldsSearchAction.None,
  fieldScheduleInfos: null,
  customScheduleField: null,
  fieldTaskInfos: null,
  customTaskField: null,
  fieldMilestoneInfos: null,
  customMilestoneField: null,
  errorMessage: null,
  successMessage: null,
  scheduleResultElasticSearch: null,
  taskResultElasticSearch: null,
  milestoneResultElasticSearch: null,
  listSearchScheduleField: null,
  listSearchTaskField: null,
  listSearchMilestoneField: null,
  scheduleTypes: []
};

const parseFieldInfoPersonalResponse = (res, typeField) => {
  const fieldInfos = res;
  if (fieldInfos.fieldInfoPersonals) {
    fieldInfos.fieldInfoPersonals.sort((a, b) => a.fieldOrder - b.fieldOrder);
  }
  return { fieldInfos };
};

const parseCustomFieldsInfoResponse = res => {
  let errorMsg = '';
  if (res.errors && res.errors.length > 0) {
    errorMsg = res.errors[0].message;
  }
  const action = errorMsg.length > 0 ? FieldsSearchAction.Error : FieldsSearchAction.Success;
  const fieldInfos = res;
  if (fieldInfos.customFieldsInfo) {
    fieldInfos.customFieldsInfo.sort((a, b) => a.fieldOrder - b.fieldOrder);
  }
  return { errorMsg, action, fieldInfos };
};

export type AdvancedSearchCalendarState = Readonly<typeof initialState>;

/**
 * handle data response
 * @param data
 */
const handleResponse = data => {
  const dataRequest = data.dataElasticSearch;
  return { dataRequest };
};

// Reducer
export default (
  state: AdvancedSearchCalendarState = initialState,
  action
): AdvancedSearchCalendarState => {
  let result = null;
  switch (action.type) {
    // case REQUEST(ACTION_TYPES.FIELDS_SEARCH_FIELD_INFO_PERSONAL_GET):
    case REQUEST(ACTION_TYPES.FIELDS_SCHEDULE_SEARCH_FIELD_INFO_PERSONAL_GET):
    case REQUEST(ACTION_TYPES.FIELDS_TASK_SEARCH_FIELD_INFO_PERSONAL_GET):
    case REQUEST(ACTION_TYPES.FIELDS_MILESTONE_SEARCH_FIELD_INFO_PERSONAL_GET):
    case REQUEST(ACTION_TYPES.FIELDS_SEARCH_FIELD_INFO_PERSONAL_UPDATE):
    case REQUEST(ACTION_TYPES.FIELDS_SEARCH_CUSTOM_FIELD_MILESTONE_GET):
    case REQUEST(ACTION_TYPES.FIELDS_SEARCH_CUSTOM_FIELD_TASK_GET):
    case REQUEST(ACTION_TYPES.FIELDS_SEARCH_CUSTOM_FIELD_SCHEDULE_GET):
    case REQUEST(ACTION_TYPES.DETAIL_SEARCH_GET_SCHEDULE_TYPES):
      return {
        ...state,
        action: FieldsSearchAction.Request,
        errorMessage: null,
        successMessage: null
      };
    // case FAILURE(ACTION_TYPES.FIELDS_SEARCH_FIELD_INFO_PERSONAL_GET):
    case FAILURE(ACTION_TYPES.FIELDS_SCHEDULE_SEARCH_FIELD_INFO_PERSONAL_GET):
    case FAILURE(ACTION_TYPES.FIELDS_TASK_SEARCH_FIELD_INFO_PERSONAL_GET):
    case FAILURE(ACTION_TYPES.FIELDS_MILESTONE_SEARCH_FIELD_INFO_PERSONAL_GET):
    case FAILURE(ACTION_TYPES.DETAIL_SEARCH_GET_SCHEDULE_TYPES):
    case FAILURE(ACTION_TYPES.FIELDS_SEARCH_FIELD_INFO_PERSONAL_UPDATE):
    case FAILURE(ACTION_TYPES.FIELDS_SEARCH_CUSTOM_FIELD_SCHEDULE_GET):
    case FAILURE(ACTION_TYPES.FIELDS_SEARCH_CUSTOM_FIELD_TASK_GET):
    case FAILURE(ACTION_TYPES.FIELDS_SEARCH_CUSTOM_FIELD_MILESTONE_GET):
      return {
        ...state,
        action: FieldsSearchAction.Error,
        errorMessage: parseErrorRespose(action.payload)[0],
        successMessage: null
      };
    case SUCCESS(ACTION_TYPES.FIELDS_SCHEDULE_SEARCH_FIELD_INFO_PERSONAL_GET): {
      result = isDUMMY ? DUMMY_DATA_SCHEDULE : action.payload.data;
      const res = parseFieldInfoPersonalResponse(result, ID_FIELD_INFO.SCHEDULE);
      return {
        ...state,
        action: FieldsSearchAction.Success,
        errorMessage: null,
        successMessage: null,
        fieldScheduleInfos: res.fieldInfos
      };
    }
    case SUCCESS(ACTION_TYPES.FIELDS_TASK_SEARCH_FIELD_INFO_PERSONAL_GET): {
      result = isDUMMY ? DUMMY_DATA_TASK : action.payload.data;
      const res = parseFieldInfoPersonalResponse(result, ID_FIELD_INFO.TASK);
      return {
        ...state,
        action: FieldsSearchAction.Success,
        errorMessage: null,
        successMessage: null,
        fieldTaskInfos: res.fieldInfos
      };
    }
    case SUCCESS(ACTION_TYPES.FIELDS_MILESTONE_SEARCH_FIELD_INFO_PERSONAL_GET): {
      result = isDUMMY ? DUMMY_DATA_MILESTONE : action.payload.data;
      const res = parseFieldInfoPersonalResponse(result, ID_FIELD_INFO.MILESTONE);
      return {
        ...state,
        action: FieldsSearchAction.Success,
        errorMessage: null,
        successMessage: null,
        fieldMilestoneInfos: res.fieldInfos
      };
    }
    case SUCCESS(ACTION_TYPES.FIELDS_SEARCH_CUSTOM_FIELD_MILESTONE_GET): {
      const res = parseCustomFieldsInfoResponse(action.payload.data);
      return {
        ...state,
        action: res.action,
        errorMessage: res.errorMsg,
        customMilestoneField: res.fieldInfos,
        successMessage: null
      };
    }
    case SUCCESS(ACTION_TYPES.FIELDS_SEARCH_CUSTOM_FIELD_TASK_GET): {
      const res = parseCustomFieldsInfoResponse(action.payload.data);
      return {
        ...state,
        action: res.action,
        errorMessage: res.errorMsg,
        customTaskField: res.fieldInfos,
        successMessage: null
      };
    }
    case SUCCESS(ACTION_TYPES.FIELDS_SEARCH_CUSTOM_FIELD_SCHEDULE_GET): {
      const res = parseCustomFieldsInfoResponse(action.payload.data);
      return {
        ...state,
        action: res.action,
        errorMessage: res.errorMsg,
        customScheduleField: res.fieldInfos,
        successMessage: null
      };
    }
    case SUCCESS(ACTION_TYPES.FIELDS_SEARCH_FIELD_INFO_PERSONAL_UPDATE):
      return {
        ...state,
        action: FieldsSearchAction.Success,
        successMessage: action.meta && action.meta.successMessage ? action.meta.successMessage : ''
      };
    case SUCCESS(ACTION_TYPES.DETAIL_SEARCH_GET_SCHEDULE_TYPES):
      return {
        ...state,
        action: FieldsSearchAction.Success,
        errorMessage: null,
        successMessage: null,
        scheduleTypes: action.payload.data.scheduleTypes
      };
    case ACTION_TYPES.FIELDS_SEARCH_RESET:
      return {
        ...initialState
      };
    case ACTION_TYPES.SET_LIST_SEARCH_FIELD:
      return {
        ...initialState,
        listSearchMilestoneField: action.listMilestone,
        listSearchScheduleField: action.listSchedule,
        listSearchTaskField: action.listTask
      };

    default:
      return state;
  }
};

// API base URL
const commonsApiUrl = API_CONTEXT_PATH + '/' + API_CONFIG.COMMON_SERVICE_PATH;
export const FS_PARAM_GET_FIELD_INFO_PERSONAL = (
  fieldBelong,
  extensionBelong,
  selectedTargetType,
  selectedTargetId
) => ({
  fieldBelong,
  extensionBelong,
  selectedTargetType: selectedTargetType ? selectedTargetType : 0,
  selectedTargetId: selectedTargetId ? selectedTargetId : 0
});

export const FS_PARAM_UPDATE_FIELD_INFO_PERSONAL = (fieldInfos, fieldBelong) => ({
  fieldBelong,
  extensionBelong: 2,
  fieldInfos,
  selectedTargetType: 0,
  selectedTargetId: 0
});

export const FS_PARAM_GET_CUSTOM_FIELD_INFO = fieldBelong => ({ fieldBelong });

const getTextItemField = item => {
  const lang = Storage.session.get('locale', 'ja_jp');
  let text = '';
  const prop = StringUtils.snakeCaseToCamelCase('label_' + lang);
  if (item[prop]) {
    text = item[prop];
  }
  return text;
};

/**
 * Get field info personals
 *
 * @param fieldBelong
 */
export const getFieldInfoPersonals = fieldBelong => {
  let flag = null;
  if (fieldBelong === ID_FIELD_INFO.SCHEDULE) {
    flag = ACTION_TYPES.FIELDS_SCHEDULE_SEARCH_FIELD_INFO_PERSONAL_GET;
  }
  if (fieldBelong === ID_FIELD_INFO.TASK) {
    flag = ACTION_TYPES.FIELDS_TASK_SEARCH_FIELD_INFO_PERSONAL_GET;
  }
  if (fieldBelong === ID_FIELD_INFO.MILESTONE) {
    flag = ACTION_TYPES.FIELDS_MILESTONE_SEARCH_FIELD_INFO_PERSONAL_GET;
  }

  return {
    type: flag,
    payload: axios.post(
      `${API_CONTEXT_PATH}/${API_CONFIG.COMMON_SERVICE_PATH}/get-field-info-personals`,
      FS_PARAM_GET_FIELD_INFO_PERSONAL(fieldBelong, 2, 0, 0),
      { headers: { ['Content-Type']: 'application/json' } }
    )
  };
};

/**
 * Get list search field and value
 *
 * @param listSchedule
 * @param listTask
 * @param listMilestone
 */
export const getListSearchFields = (listSchedule, listTask, listMilestone) => ({
  type: ACTION_TYPES.SET_LIST_SEARCH_FIELD,
  listSchedule,
  listTask,
  listMilestone
});

/**
 * Get custom fields schedule info
 *
 */
export const getCustomFieldsScheduleInfo = () => ({
  type: ACTION_TYPES.FIELDS_SEARCH_CUSTOM_FIELD_SCHEDULE_GET,
  payload: axios.post(
    `${commonsApiUrl}/get-custom-fields-info`,
    {
      fieldBelong: FIELD_BELONG.SCHEDULE
    },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

/**
 * Get custom fields task info
 *
 */
export const getCustomFieldsTaskInfo = () => ({
  type: ACTION_TYPES.FIELDS_SEARCH_CUSTOM_FIELD_TASK_GET,
  payload: axios.post(
    `${commonsApiUrl}/get-custom-fields-info`,
    {
      fieldBelong: FIELD_BELONG.TASK
    },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

/**
 * Get custom fields milestone info
 *
 */
export const getCustomFieldsMilestoneInfo = () => ({
  type: ACTION_TYPES.FIELDS_SEARCH_CUSTOM_FIELD_MILESTONE_GET,
  payload: axios.post(
    `${commonsApiUrl}/get-custom-fields-info`,
    {
      fieldBelong: FIELD_BELONG.MILESTONE
    },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

/**
 * update field info personals
 *
 * @param fieldBelong
 * @param objParam
 */
export const updateFieldInfoPersonals = (objParam, fieldBelong) => ({
  type: ACTION_TYPES.FIELDS_SEARCH_FIELD_INFO_PERSONAL_UPDATE,
  payload: axios.post(
    `${commonsApiUrl}/update-field-info-personals`,
    FS_PARAM_UPDATE_FIELD_INFO_PERSONAL(objParam, fieldBelong),
    {
      headers: { ['Content-Type']: 'application/json' }
    }
  )
});

export const handleUpdateField = (listField: any[], fieldBelong) => async (dispatch, getState) => {
  if (listField) {
    const objParam = [];
    if (listField.length > 0) {
      listField.forEach(el => {
        objParam.push({ fieldId: el.fieldId, fieldOrder: el.fieldOrder });
      });
    }
    await dispatch(updateFieldInfoPersonals(objParam, fieldBelong));
    const { action } = getState().dataCalendarSearch;
    if (action === FieldsSearchAction.Success) {
      await dispatch(getFieldInfoPersonals(fieldBelong));
      const lastAction = getState().dataCalendarSearch.action;
      if (lastAction === FieldsSearchAction.Success) {
        dispatch({
          type: SUCCESS(ACTION_TYPES.FIELDS_SEARCH_FIELD_INFO_PERSONAL_UPDATE),
          payload: {},
          meta: {
            successMessage: translate('messages.INF_COM_0004')
          }
        });
      }
    }
  }
};

/**
 * reset state
 */
export const reset = () => ({
  type: ACTION_TYPES.FIELDS_SEARCH_RESET
});

const KEYS = {
  CUSTOMER_ID: 'CUSTOMER_ID',
  SCHEDULE_RELATED_CUSTOMER_ID: 'SCHEDULE_RELATED_CUSTOMER_ID',
  PRODUCTS_TRADINGS_ID: 'PRODUCTS_TRADINGS_ID',
  BUSINESS_CARD_ID: 'BUSINESS_CARD_ID',
  CREATED_USER: 'CREATED_USER',
  UPDATED_USER: 'UPDATED_USER'
};

/**
 * get URL by action
 * @param key
 */
const getUrlAction = key => {
  let urlAction = null;
  switch (key) {
    case KEYS.CUSTOMER_ID:
      urlAction = KEYS.CUSTOMER_ID;
      break;
    case KEYS.SCHEDULE_RELATED_CUSTOMER_ID:
      urlAction = KEYS.SCHEDULE_RELATED_CUSTOMER_ID;
      break;
    case KEYS.PRODUCTS_TRADINGS_ID:
      urlAction = KEYS.PRODUCTS_TRADINGS_ID;
      break;
    case KEYS.BUSINESS_CARD_ID:
      urlAction = KEYS.BUSINESS_CARD_ID;
      break;
    case KEYS.CREATED_USER:
      urlAction = KEYS.CREATED_USER;
      break;
    case KEYS.UPDATED_USER:
      urlAction = KEYS.UPDATED_USER;
      break;
    default:
      return;
  }
  return urlAction;
};

/**
 * call Api dataElasticSearch
 * @param type
 * @param key
 * @param data
 */
export const getDataElasticSearch = (type, key, data) => dispatch => {
  let urlAction;
  if (type === ItemTypeSchedule.Schedule) {
    urlAction = `SCHEDULE_ELASTIC_SEARCH_${getUrlAction(key)}`;
  }

  if (type === ItemTypeSchedule.Task) {
    urlAction = `TASK_ELASTIC_SEARCH_${getUrlAction(key)}`;
  }

  if (type === ItemTypeSchedule.Milestone) {
    urlAction = `MILESTONE_ELASTIC_SEARCH_${getUrlAction(key)}`;
  }
  if (urlAction) {
    if (Array.isArray(data)) {
      if (data[0].index === 'products') {
        const urlProduct = urlAction + '_PRODUCTS';
        dispatch({
          type: ACTION_TYPES[urlProduct],
          payload: axios.post(`${commonsApiUrl}/get-detail-elastic-search`, data[0], {
            headers: { ['Content-Type']: 'application/json' }
          })
        });
      }
      if (data[1].index === 'sales') {
        const urlSales = urlAction + '_SALES';
        dispatch({
          type: ACTION_TYPES[urlSales],
          payload: axios.post(`${commonsApiUrl}/get-detail-elastic-search`, data[1], {
            headers: { ['Content-Type']: 'application/json' }
          })
        });
      }
    } else {
      dispatch({
        type: ACTION_TYPES[urlAction],
        payload: axios.post(`${commonsApiUrl}/get-detail-elastic-search`, data, {
          headers: { ['Content-Type']: 'application/json' }
        })
      });
    }
  }
};

/**
 * cal api get schedule types
 */
export const callApiGetScheduleTypes = () => ({
  type: ACTION_TYPES.DETAIL_SEARCH_GET_SCHEDULE_TYPES,
  payload: axios.post(
    `${API_CONTEXT_PATH}/${API_CONFIG.SCHEDULES_SERVICE_PATH}/get-schedule-types`,
    {},
    { headers: { ['Content-Type']: 'application/json' } }
  )
});
