import axios from 'axios';
import { Storage, translate } from 'react-jhipster';
import {
  GET_DATA_CREATE_UPDATE_SCHEDULE,
  GetSchedule
} from 'app/modules/calendar/models/get-schedule-type';
import { FAILURE, REQUEST, SUCCESS } from 'app/shared/reducers/action-type.util';
import { IPullDownItem } from 'app/modules/calendar/common/beauty-pull-down';
import { API_CONFIG, API_CONTEXT_PATH } from 'app/config/constants';
import { ACTION_TYPE_CALENDAR } from 'app/modules/calendar/grid/calendar-grid.reducer';
import { CommonUtils } from 'app/modules/calendar/models/common-type';
import { DataOfSchedule, CalenderViewMonthCommon, DataOfResource } from '../grid/common';
import { handleReloadData } from 'app/modules/calendar/grid/calendar-grid.reducer';
import {
  hideModalDetail,
  hideModalSubDetail,
  showModalDetail
} from '../modal/calendar-modal.reducer';
import { CHECK_DUPLICATED_EQUIPMENTS } from 'app/modules/calendar/models/equipment-type';
import { GetEquipmentSuggestionsType } from 'app/modules/calendar/models/get-equipment-suggestions-type';
import { parseErrorRespose } from 'app/shared/util/string-utils';
import moment, { Moment } from 'moment';
import { CalendarView } from '../constants';
import { GetScheduleSuggestionsType } from '../models/get-schedules-type';

export const ACTION_TYPES = {
  GET_SCHEDULE_TYPES: 'calendar/schedule/GET_SCHEDULE_TYPES',
  WILL_SUBMIT_DATA: 'calendar/schedule/WILL_SUBMIT_DATA',
  POST_SCHEDULE_DATA: 'calendar/schedule/POST_SCHEDULE_DATA',
  DRAG_SCHEDULE_DATA: 'calendar/schedule/DRAG_SCHEDULE_DATA',
  FILL_PRE_SCHEDULE_DATA: 'calendar/schedule/FILL_PRE_SCHEDULE_DATA',
  GET_SCHEDULE_BY_ID: 'calendar/schedule/GET_SCHEDULE_BY_ID',
  VALIDATE_SCHEDULE: 'calendar/schedule/VALIDATE_SCHEDULE',
  VALIDATE_TASK: 'calendar/schedule/VALIDATE_TASK',
  VALIDATE_MILESTONE: 'calendar/schedule/VALIDATE_MILESTONE',
  RESET_STATE_VALIDATE: 'calendar/schedule/RESET_STATE_VALIDATE',
  RESET_SHOW_MESSAGE: 'calendar/schedule/RESET_SHOW_MESSAGE',
  CHECK_DUPLICATED_EQUIPMENTS: 'calendar/equipments/checkDuplicatedEquipments',
  SHOW_POPUP_EQUIPMENT_ERRORS: 'calendar/equipments/showPopupErrors',
  SHOW_POPUP_EQUIPMENT_CONFIRM: 'calendar/equipments/showPopupConfirm',
  VALIDATING: 'calendar/schedule/VALIDATING',
  GET_EQUIPMENT_SUGGESTION: 'calendar/GET_EQUIPMENT_SUGGESTION',
  SAVE_DRAFT_SCHEDULE_DATA: 'calendar/SAVE_DRAFT_SCHEDULE_DATA',
  UPDATE_DRAFT_SCHEDULE_DATA: 'calendar/UPDATE_DRAFT_SCHEDULE_DATA',
  RESET_DATA_FORM_CREATE: 'calendar/RESET_DATA_FORM_CREATE',
  SET_MARK_IS_EDIT: 'calendar/SET_MARK_IS_EDIT',
  GET_INFO_EMPLOYEE_CURRENT: 'calendar/GET_INFO_EMPLOYEE_CURRENT',
  ON_SHOW_MODAL_CREATE: 'calendar/ON_SHOW_MODAL_CREATE',
  ON_SET_SCHEDULE_ID: 'calendar/ON_SET_SCHEDULE_ID',
  ON_CHANGE_DATE_ON_CLICK: 'calendar/ON_CHANGE_DATE_ON_CLICK',
  GET_SCHEDULE_TYPE_SUGGESTION: 'calendar/GET_SCHEDULE_TYPE_SUGGESTION',
  SAVE_SUGGESTION_CHOICE: 'tagSuggestionReset/SAVE_SUGGESTION_CHOICE',
  RESET_EQUIPMENT_SUGGEST: 'calendar/RESET_EQUIPMENT_SUGGEST'
};

const apiUrl = API_CONTEXT_PATH + '/' + API_CONFIG.SCHEDULES_SERVICE_PATH;
const apiScheduleUrlRestFul = API_CONTEXT_PATH + '/schedules/api';
const apiUrlCommon = API_CONTEXT_PATH + '/' + API_CONFIG.COMMON_SERVICE_PATH;

export const TYPE_SCREEN = {
  equipmentGrid: 'equipmentGrid',
  createSchedule: 'createSchedule'
};

export enum CreateEditScheduleAction {
  None,
  RequestPending = 1,
  RequestError,
  RequestSuccess
}

const initialState = {
  action: CreateEditScheduleAction.None,
  scheduleData: {}, // data schedule from call api get-schedule
  errorItems: {},
  scheduleTypes: [], // data schedule type from call api get-schedule-types
  errorMessage: null, // error message
  successMessage: null,
  successSaveChoice: null,
  errorSaveChoice: null,
  currentLocale: null,
  isLoading: false,
  success: null,
  scheduleId: null,
  validateSchedule: false, // check status for action validate item in grid when event drag/drop
  dataEquipments: [], // data equiment from call api get-equipment
  popupEquipmentError: null,
  popupEquipmentConfirm: null,
  updateFlag: null,
  scheduleValidatingId: null,
  equipmentSuggestions: [],
  scheduleTypesSuggestions: [],
  draftStoreScheduleData: {},
  draftStoreFileUpload: [],
  isClone: false, // go to view create schedule with data clone
  showSuccessMessage: null,
  employeeInfo: {},
  onShowCreate: false, // check status for display popup create schedule
  dateOnClick: CalenderViewMonthCommon.nowDate() // date default when go to view create schedule from popup-list-create
};

export type CreateEditScheduleState = Readonly<typeof initialState> & {
  scheduleData: GetSchedule;
  scheduleTypes: IPullDownItem[];
  isEdit?: boolean;
};
/**
 * handle response data of api checkDuplicate
 * @param dataResponse
 */
const handleCheckDuplicatedEquipment = dataResponse => {
  let errorMsg = '';
  if (dataResponse.errors && dataResponse.errors.length > 0) {
    errorMsg = dataResponse.errors[0].message;
  }
  const action =
    errorMsg.length > 0
      ? CreateEditScheduleAction.RequestError
      : CreateEditScheduleAction.RequestSuccess;
  const dataRequest = dataResponse.data.equipments;
  return { dataRequest, action, errorMsg };
};

/**
 * handle data reponse error
 * @param respData
 */
const parseResponseData = (respData: any) => {
  let errors = respData;
  if (!errors[0].errorCode) errors = respData[0].errors;
  const message = translate(`messages.${errors[0].errorCode}`);
  const errorItems = errors.reduce((carry, { errorParams, errorCode }) => {
    carry[errorParams] = translate(`messages.${errorCode}`);
    return carry;
  }, {});
  return {
    successMessage: null,
    errorMessage: message,
    errorItems
  };
};

/**
 * handle data response success
 * @param respData
 */
const parseResponseDataValidate = (respData: any, stateCurr?: CreateEditScheduleState) => {
  const scheduleId =
    respData['data'] && respData['data']['scheduleIds'] && respData['data']['scheduleIds'][0]
      ? respData['data']['scheduleIds'][0]
      : respData['data']['scheduleId'];

  return {
    success: true,
    validateSchedule: true,
    errorItems: {},
    errorMessage: null,
    successMessage: translate('messages.INFO_COM_0004'),
    showSuccessMessage:
      stateCurr && stateCurr.isEdit
        ? translate('messages.INFO_COM_0004')
        : translate('messages.INFO_COM_0003'),
    scheduleId
  };
};

const parseValidateScheduleTaskMilestone = (respData: any, stateCurr?: CreateEditScheduleState) => {
  const scheduleId =
    respData['data'] && respData['data']['scheduleIds'] && respData['data']['scheduleIds'][0]
      ? respData['data']['scheduleIds'][0]
      : respData['data']['scheduleId'];

  return {
    validateSchedule: true,
    scheduleId
  };
};
/**
 * handle data response success
 * @param respData
 */
const parseResponseDrag = (respData: any, stateCurr?: CreateEditScheduleState) => {
  const scheduleId =
    respData['data'] && respData['data']['scheduleIds'] && respData['data']['scheduleIds'][0]
      ? respData['data']['scheduleIds'][0]
      : respData['data']['scheduleId'];

  return {
    success: true,
    validateSchedule: true,
    errorItems: {},
    errorMessage: null,
    successMessage: translate('messages.INFO_COM_0004'),
    showSuccessMessage: translate('messages.INF_CAL_0002'),
    scheduleId
  };
};

/**
 * sort data response by order
 * @param res
 */
const handleResponseEquipSuggestion = (res: GetEquipmentSuggestionsType) => {
  const draftData = JSON.parse(JSON.stringify(res.data));
  if (Array.isArray(draftData)) draftData.sort((a, b) => a.displayOrder - b.displayOrder);

  return draftData;
};

const handleResponseScheduleTypeSuggestion = (res: GetScheduleSuggestionsType) => {
  const draftData = JSON.parse(JSON.stringify(res.scheduleTypes));
  // if (Array.isArray(draftData)) draftData.sort((a, b) => a.displayOrder - b.displayOrder);

  return draftData;
};

export const addSwitchCase = (
  state: CreateEditScheduleState = initialState,
  action
): CreateEditScheduleState => {
  switch (action.type) {
    case ACTION_TYPES.SET_MARK_IS_EDIT:
      return {
        ...state,
        isEdit: action.payload
      };
    case ACTION_TYPES.RESET_SHOW_MESSAGE:
      return {
        ...state,
        showSuccessMessage: null
      };
    case ACTION_TYPES.SHOW_POPUP_EQUIPMENT_CONFIRM:
      return {
        ...state,
        popupEquipmentConfirm:
          action.payload && action.payload.scheduleId ? action.payload.scheduleId : null,
        updateFlag: action.payload && action.payload.updateFlag ? action.payload.updateFlag : null
      };
    case ACTION_TYPES.SHOW_POPUP_EQUIPMENT_ERRORS:
      return {
        ...state,
        popupEquipmentError: action.payload
      };
    case ACTION_TYPES.VALIDATING:
      return {
        ...state,
        scheduleValidatingId: action.payload
      };
    case ACTION_TYPES.RESET_STATE_VALIDATE:
      return {
        ...state,
        successMessage: null,
        errorMessage: null,
        validateSchedule: null,
        success: null,
        scheduleValidatingId: null
      };
    case ACTION_TYPES.SAVE_DRAFT_SCHEDULE_DATA:
      return {
        ...state,
        draftStoreScheduleData: action.payload.schedule,
        draftStoreFileUpload: action.payload.fileUpload
      };
    case ACTION_TYPES.UPDATE_DRAFT_SCHEDULE_DATA:
      return {
        ...state,
        scheduleData: action.payload,
        popupEquipmentConfirm: null
      };
    case ACTION_TYPES.RESET_DATA_FORM_CREATE:
      return {
        ...state,
        scheduleData: null,
        scheduleId: null,
        onShowCreate: false
      };
    case ACTION_TYPES.RESET_EQUIPMENT_SUGGEST:
      return {
        ...state,
        equipmentSuggestions: []
      };
    case ACTION_TYPES.ON_SHOW_MODAL_CREATE: {
      if (!action.payload) {
        return {
          ...state,
          scheduleData: null,
          scheduleId: null,
          onShowCreate: action.payload
        };
      }
      return {
        ...state,
        onShowCreate: action.payload
      };
    }
    case ACTION_TYPES.ON_SET_SCHEDULE_ID:
      return {
        ...state,
        scheduleId: action.payload
      };
    case ACTION_TYPES.ON_CHANGE_DATE_ON_CLICK:
      return {
        ...state,
        dateOnClick: action.payload
      };
    default:
      return null;
  }
};

export default (state: CreateEditScheduleState = initialState, action): CreateEditScheduleState => {
  const check = addSwitchCase(state, action);
  if (check !== null) {
    return check;
  }
  let res = null;
  switch (action.type) {
    case ACTION_TYPES.DRAG_SCHEDULE_DATA:
    case ACTION_TYPES.POST_SCHEDULE_DATA:
      return {
        ...state,
        isLoading: true
      };
    case REQUEST(ACTION_TYPES.CHECK_DUPLICATED_EQUIPMENTS):
    case REQUEST(ACTION_TYPES.GET_SCHEDULE_TYPES):
    case REQUEST(ACTION_TYPES.GET_EQUIPMENT_SUGGESTION):
    case REQUEST(ACTION_TYPES.VALIDATE_TASK):
    case REQUEST(ACTION_TYPES.VALIDATE_SCHEDULE):
    case REQUEST(ACTION_TYPES.VALIDATE_MILESTONE):
    case REQUEST(ACTION_TYPES.DRAG_SCHEDULE_DATA):
    case REQUEST(ACTION_TYPES.POST_SCHEDULE_DATA):
    case REQUEST(ACTION_TYPES.GET_INFO_EMPLOYEE_CURRENT):
    case REQUEST(ACTION_TYPES.GET_SCHEDULE_TYPE_SUGGESTION):
      return {
        ...state,
        action: CreateEditScheduleAction.RequestPending
      };
    case FAILURE(ACTION_TYPES.CHECK_DUPLICATED_EQUIPMENTS):
    case FAILURE(ACTION_TYPES.GET_SCHEDULE_TYPES):
    case FAILURE(ACTION_TYPES.GET_EQUIPMENT_SUGGESTION):
    case FAILURE(ACTION_TYPES.GET_SCHEDULE_TYPE_SUGGESTION):
    case FAILURE(ACTION_TYPES.VALIDATE_TASK):
    case FAILURE(ACTION_TYPES.VALIDATE_SCHEDULE):
    case FAILURE(ACTION_TYPES.VALIDATE_MILESTONE):
    case FAILURE(ACTION_TYPES.DRAG_SCHEDULE_DATA):
    case FAILURE(ACTION_TYPES.POST_SCHEDULE_DATA):
    case FAILURE(ACTION_TYPES.GET_INFO_EMPLOYEE_CURRENT):
      return {
        ...state,
        ...parseResponseData(parseErrorRespose(action.payload)),
        action: CreateEditScheduleAction.RequestError,
        scheduleData: null
      };
    case SUCCESS(ACTION_TYPES.GET_SCHEDULE_TYPES):
      return {
        ...state,
        scheduleTypes: action.payload.data.scheduleTypes
      };
    case ACTION_TYPES.FILL_PRE_SCHEDULE_DATA:
      res = { ...action.payload };
      if (res.scheduleId) {
        delete res.scheduleId;
      }
      return {
        ...state,
        scheduleData: res,
        successMessage: null,
        errorMessage: null,
        success: null,
        isClone: true
      };
    case SUCCESS(ACTION_TYPES.DRAG_SCHEDULE_DATA):
      return {
        ...state,
        ...parseResponseDrag(action.payload, state),
        action: CreateEditScheduleAction.RequestSuccess,
        isLoading: false
      };
    case SUCCESS(ACTION_TYPES.POST_SCHEDULE_DATA):
      return {
        ...state,
        ...parseResponseDataValidate(action.payload, state),
        action: CreateEditScheduleAction.RequestSuccess,
        isLoading: false,
        popupEquipmentConfirm: null,
        scheduleData: null
      };
    case SUCCESS(ACTION_TYPES.GET_SCHEDULE_BY_ID):
      return {
        ...state,
        scheduleData: action.payload.data || {},
        isClone: false
      };
    case SUCCESS(ACTION_TYPES.VALIDATE_TASK):
    case SUCCESS(ACTION_TYPES.VALIDATE_SCHEDULE):
    case SUCCESS(ACTION_TYPES.VALIDATE_MILESTONE):
      return {
        ...state,
        ...parseValidateScheduleTaskMilestone(action.payload),
        action: CreateEditScheduleAction.RequestSuccess
      };
    case SUCCESS(ACTION_TYPES.CHECK_DUPLICATED_EQUIPMENTS):
      res = handleCheckDuplicatedEquipment(action.payload.data);
      return {
        ...state,
        action: res.action,
        dataEquipments: res.dataRequest,
        errorMessage: res.errorMsg
      };
    case SUCCESS(ACTION_TYPES.GET_EQUIPMENT_SUGGESTION):
      res = handleResponseEquipSuggestion(action.payload.data);
      return {
        ...state,
        equipmentSuggestions: res
      };
    case SUCCESS(ACTION_TYPES.GET_SCHEDULE_TYPE_SUGGESTION):
      res = handleResponseScheduleTypeSuggestion(action.payload.data);
      return {
        ...state,
        scheduleTypesSuggestions: res
      };
    case SUCCESS(ACTION_TYPES.GET_INFO_EMPLOYEE_CURRENT):
      res = action.payload;
      return {
        ...state,
        employeeInfo: res.data.employees[0]
      };
    case SUCCESS(ACTION_TYPES.SAVE_SUGGESTION_CHOICE):
      return {
        ...state,
        successSaveChoice: ''
      };
    default:
      return state;
  }
};

const convertDataBeforeBuildForm = (obj, fieldOrigin, fieldTarget, fieldData) => {
  obj[`${fieldOrigin}`] &&
    obj[`${fieldOrigin}`].forEach(d => {
      if (!obj[`${fieldTarget}`]) {
        obj[`${fieldTarget}`] = [];
      }
      obj[`${fieldTarget}`].push(d[`${fieldData}`]);
    });
  delete obj[`${fieldOrigin}`];
  return obj;
};

/**
 * build form data
 * @param params value query
 * @param fileUpload fileUpload
 */
const buildFormData = (params, fileUpload, isDrag?: boolean) => {
  params['fileUpload'] = fileUpload;

  if (params && params['participants']) {
    params['participants'] = convertDataBeforeBuildForm(
      params['participants'],
      'departments',
      'departmentIds',
      'departmentId'
    );
    params['participants'] = convertDataBeforeBuildForm(
      params['participants'],
      'employees',
      'employeeIds',
      'employeeId'
    );
    params['participants'] = convertDataBeforeBuildForm(
      params['participants'],
      'groups',
      'groupIds',
      'groupId'
    );
  }

  if (params && params['sharers']) {
    params['sharers'] = convertDataBeforeBuildForm(
      params['sharers'],
      'departments',
      'departmentIds',
      'departmentId'
    );
    params['sharers'] = convertDataBeforeBuildForm(
      params['sharers'],
      'employees',
      'employeeIds',
      'employeeId'
    );
    params['sharers'] = convertDataBeforeBuildForm(
      params['sharers'],
      'groups',
      'groupIds',
      'groupId'
    );
  }

  if (params && params['addressBelowPrefectures']) {
    params['address'] = params['addressBelowPrefectures'];
  }

  if (params && params['scheduleId'] && params['isRepeated']) {
    params['repeatCondition'] = {
      repeatType: params['repeatType'],
      repeatCycle: params['repeatCycle'],
      regularDayOfWeek: params['regularDayOfWeek'],
      regularWeekOfMonth: params['regularWeekOfMonth'],
      regularDayOfMonth: params['regularDayOfMonth'],
      regularEndOfMonth: params['regularEndOfMonth'],
      repeatEndType: params['repeatEndType'],
      repeatEndDate: params['repeatEndDate']
        ? moment
            .utc(
              CalenderViewMonthCommon.roundUpDay(
                CalenderViewMonthCommon.localToTimezoneOfConfig(moment(params['repeatEndDate']))
              )
            )
            .format()
        : null,
      repeatNumber: params['repeatNumber']
    };
    params['repeatType'] && delete params['repeatType'];
    params['repeatCycle'] && delete params['repeatCycle'];
    params['regularDayOfWeek'] && delete params['regularDayOfWeek'];
    params['regularWeekOfMonth'] && delete params['regularWeekOfMonth'];
    params['regularDayOfMonth'] && delete params['regularDayOfMonth'];
    params['regularEndOfMonth'] && delete params['regularEndOfMonth'];
    params['repeatEndType'] && delete params['repeatEndType'];
    params['repeatEndDate'] && delete params['repeatEndDate'];
    params['repeatNumber'] && delete params['repeatNumber'];
  }

  const query = GET_DATA_CREATE_UPDATE_SCHEDULE(params, isDrag);

  return CommonUtils.convertFormFile(query);
};

/**
 * build form data
 * @param params value query
 * @param fileUpload fileUpload
 */
const buildFormDataWhenDrag = params => {
  const query = GET_DATA_CREATE_UPDATE_SCHEDULE(params, true);
  const newparams = {
    schedule: {
      scheduleId: query.schedule.scheduleId || query.schedule.itemId,
      updateFlag: query.schedule.updateFlag,
      scheduleTypeId: query.schedule.scheduleTypeId,
      scheduleName: query.schedule.scheduleName || query.schedule.itemName,
      startDay: query.schedule.startDay,
      endDay: query.schedule.endDay,
      startTime: query.schedule.startTime,
      endTime: query.schedule.endTime
    }
  };

  return CommonUtils.convertFormFile(newparams);
};

/**
 * check equipment can use
 * @param equipmentsData
 */
const handleCheckEquipmentCanUse = equipmentsData => {
  let isCheck = false;
  if (equipmentsData && Array.isArray(equipmentsData)) {
    equipmentsData.forEach(equipment => {
      if (equipment.periods && Array.isArray(equipment.periods)) {
        equipment.periods.forEach(item => {
          if (!item.canUse) {
            isCheck = true;
          }
        });
      }
    });
  }
  return isCheck;
};

export const setIsEdit = (isEdit: boolean) => ({
  type: ACTION_TYPES.SET_MARK_IS_EDIT,
  payload: isEdit
});

export const resetDataForm = () => ({ type: ACTION_TYPES.RESET_DATA_FORM_CREATE });

export const onShowPopupCreate = (isShow: boolean) => ({
  type: ACTION_TYPES.ON_SHOW_MODAL_CREATE,
  payload: isShow
});
export const onSetScheduleIdForEdit = (scheduleId: number) => ({
  type: ACTION_TYPES.ON_SET_SCHEDULE_ID,
  payload: scheduleId
});

export const setPreScheduleData = (schedule: GetSchedule) => dispatch => {
  return dispatch({
    type: ACTION_TYPES.FILL_PRE_SCHEDULE_DATA,
    payload: schedule
  });
};

export const storeSchedule = (
  schedule: GetSchedule,
  fileUpload,
  isDrag?: boolean,
  callback?: () => void
) => async (dispatch, getState) => {
  const isEdit = !!schedule.scheduleId || !!schedule.itemId;
  if (isEdit && schedule.scheduleType) {
    schedule.scheduleTypeId = schedule.scheduleType.scheduleTypeId;
  }
  await dispatch(setIsEdit(!!isEdit));
  await dispatch({
    type: ACTION_TYPES.POST_SCHEDULE_DATA,
    payload: axios.post(
      `${apiUrl}/${isEdit ? 'update-schedule' : 'create-schedule'}`,
      buildFormData(schedule, fileUpload, isDrag),
      {
        headers: { 'Content-Type': 'multipart/form-data' }
      }
    )
  });
  await dispatch(hideModalDetail());
  await dispatch(hideModalSubDetail());
  dispatch(handleReloadData());
  // get scheduleId because resetDataForm() or onShowPopupCreate(false) reset getState().dataCreateEditSchedule.scheduleId = null
  const scheduleId = getState().dataCreateEditSchedule.scheduleId;
  if (
    getState().dataCreateEditSchedule.action === CreateEditScheduleAction.RequestSuccess &&
    getState().dataCreateEditSchedule.scheduleId &&
    !isDrag
  ) {
    await dispatch(showModalDetail(scheduleId));
    await dispatch(onShowPopupCreate(false));
    await dispatch(setPreScheduleData({}));
  } else {
    if (callback) {
      callback();
    }
  }
};

export const storeDragSchedule = (schedule: GetSchedule) => async (dispatch, getState) => {
  if (schedule.scheduleType) {
    schedule.scheduleTypeId = schedule.scheduleType.scheduleTypeId;
  }
  await dispatch({
    type: ACTION_TYPES.DRAG_SCHEDULE_DATA,
    payload: axios.post(`${apiUrl}/update-schedule`, buildFormDataWhenDrag(schedule), {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  });
  await dispatch(hideModalDetail());
  await dispatch(hideModalSubDetail());
  await dispatch(handleReloadData());
  await dispatch(resetDataForm());
  // if (
  //   getState().dataCreateEditSchedule.action === CreateEditScheduleAction.RequestSuccess &&
  //   getState().dataCreateEditSchedule.scheduleId
  // )
  //   dispatch(showModalDetail(getState().dataCreateEditSchedule.scheduleId));
};

export const updateScheduleDataDraf = data => ({
  type: ACTION_TYPES.UPDATE_DRAFT_SCHEDULE_DATA,
  payload: data
});

/**
 * call api check duplicate equipment can use
 * @param schedule
 * @param fileUpload
 */
export const beforeCheckStoreSchedule = (
  schedule: GetSchedule,
  fileUpload,
  isNotSave?: boolean,
  callback?: () => void
) => async (dispatch, getState) => {
  const equipments = schedule.equipments.map((equip: any) => {
    return {
      equipmentId: equip.equipmentId,
      startDay: CalenderViewMonthCommon.localToTimezoneOfConfig(equip.startDate || equip.startTime)
        .utc()
        .format('YYYY/MM/DD'),
      startTime: CalenderViewMonthCommon.localToTimezoneOfConfig(equip.startDate || equip.startTime)
        .utc()
        .format('HH:mm'),
      endDay: CalenderViewMonthCommon.localToTimezoneOfConfig(equip.endDate || equip.endTime)
        .utc()
        .format('YYYY/MM/DD'),
      endTime: CalenderViewMonthCommon.localToTimezoneOfConfig(equip.endDate || equip.endTime)
        .utc()
        .format('HH:mm')
    };
  });
  const startDateSchedule = CalenderViewMonthCommon.localToTimezoneOfConfig(schedule.startDate)
        .utc()
        .format('YYYY/MM/DD');
  const endDateSchedule = CalenderViewMonthCommon.localToTimezoneOfConfig(schedule.endDate)
        .utc()
        .format('YYYY/MM/DD');
  const startTimeSchedule = !schedule.isFullDay
    ? CalenderViewMonthCommon.localToTimezoneOfConfig(schedule.startDate)
        .utc()
        .format('HH:mm')
    : moment
        .utc(
          CalenderViewMonthCommon.roundDownDay(
            CalenderViewMonthCommon.localToTimezoneOfConfig(schedule.startDate)
          )
        )
        .format('HH:mm');
  const endTimeSchedule = !schedule.isFullDay
    ? CalenderViewMonthCommon.localToTimezoneOfConfig(schedule.endDate)
        .utc()
        .format('HH:mm')
    : moment
        .utc(
          CalenderViewMonthCommon.roundUpDay(
            CalenderViewMonthCommon.localToTimezoneOfConfig(schedule.endDate)
          )
        )
        .format('HH:mm');
  await dispatch({
    type: ACTION_TYPES.CHECK_DUPLICATED_EQUIPMENTS,
    payload: axios.post(
      `${apiScheduleUrlRestFul}/check-duplicated-equipments`,
      !schedule.scheduleId
        ? {
            schedule: {
              startDay: startDateSchedule,
              endDay: endDateSchedule,
              startTime: startTimeSchedule,
              endTime: endTimeSchedule,
              isRepeated: schedule.isRepeated,
              repeatCondition: {
                repeatType: schedule.repeatType,
                repeatCycle: schedule.repeatCycle,
                regularDayOfWeek: schedule.regularDayOfWeek,
                regularWeekOfMonth: schedule.regularWeekOfMonth,
                regularDayOfMonth: schedule.regularDayOfMonth,
                regularEndOfMonth: schedule.regularEndOfMonth,
                repeatEndType: schedule.repeatEndType,
                repeatEndDate: schedule.repeatEndDate
                  ? CalenderViewMonthCommon.roundUpDay(moment.utc(schedule.repeatEndDate)).format()
                  : null,
                repeatNumber: schedule.repeatNumber
              }
            },
            equipments
          }
        : {
            scheduleId: schedule.scheduleId,
            updateFlag: schedule.updateFlag,
            schedule: {
              startDay: startDateSchedule,
              endDay: endDateSchedule,
              startTime: startTimeSchedule,
              endTime: endTimeSchedule,
              isRepeated: schedule.isRepeated,
              repeatCondition: {
                repeatType: schedule.repeatType,
                repeatCycle: schedule.repeatCycle,
                regularDayOfWeek: schedule.regularDayOfWeek,
                regularWeekOfMonth: schedule.regularWeekOfMonth,
                regularDayOfMonth: schedule.regularDayOfMonth,
                regularEndOfMonth: schedule.regularEndOfMonth,
                repeatEndType: schedule.repeatEndType,
                repeatEndDate: schedule.repeatEndDate
                  ? CalenderViewMonthCommon.roundUpDay(moment.utc(schedule.repeatEndDate)).format()
                  : null,
                repeatNumber: schedule.repeatNumber
              }
            },
            equipments
          },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    )
  });

  const equipmentsData = getState().dataCreateEditSchedule.dataEquipments;
  const isCheck = handleCheckEquipmentCanUse(equipmentsData);

  if (isCheck) {
    dispatch({
      type: ACTION_TYPES.SAVE_DRAFT_SCHEDULE_DATA,
      payload: {
        schedule,
        fileUpload
      }
    });

    if (!schedule.isRepeated) {
      dispatch({
        type: ACTION_TYPES.SHOW_POPUP_EQUIPMENT_ERRORS,
        payload: TYPE_SCREEN.createSchedule
      });
    } else {
      dispatch({
        type: ACTION_TYPES.SHOW_POPUP_EQUIPMENT_CONFIRM,
        payload: {
          scheduleId: TYPE_SCREEN.createSchedule
        }
      });
    }
  } else {
    let equipmentDataTemp = [];
    if (!schedule.isRepeated) {
      equipmentDataTemp =
        Array.isArray(equipmentsData) &&
        equipmentsData.map(equip => {
          return {
            equipmentId: equip.equipmentId,
            startTime: equip.periods[0].startDate,
            endTime: equip.periods[0].endDate,
            canUse: equip.periods[0].canUse,
            equipmentTypeId:
              schedule.equipments[
                schedule.equipments.findIndex(item => item.equipmentId === equip.equipmentId)
              ].equipmentTypeId
          };
        });
    } else {
      Array.isArray(equipmentsData) &&
        equipmentsData.forEach(equip => {
          equip.periods.forEach(itemEquip => {
            equipmentDataTemp.push({
              equipmentId: equip.equipmentId,
              startTime: itemEquip.startDate,
              endTime: itemEquip.endDate,
              canUse: itemEquip.canUse,
              equipmentTypeId:
                schedule.equipments[
                  schedule.equipments.findIndex(item => item.equipmentId === equip.equipmentId)
                ].equipmentTypeId
            });
          });
        });
    }
    schedule.equipments = equipmentDataTemp;
    if (!isNotSave) {
      await dispatch(storeSchedule(schedule, fileUpload, false, callback));
    } else {
      await dispatch(updateScheduleDataDraf(schedule));
    }
  }
};

export const reloadGridData = () => dispatch => {
  return dispatch({ type: ACTION_TYPE_CALENDAR.CALENDAR_GRID_REFRESH_DATA_FLAG });
};

export const getScheduleById = (scheduleId: number) => {
  return {
    type: ACTION_TYPES.GET_SCHEDULE_BY_ID,
    payload: axios.post(
      `${apiScheduleUrlRestFul}/get-schedule`,
      {
        scheduleId
      },
      { headers: { ['Content-Type']: 'application/json' } }
    )
  };
};

export const getScheduleTypes = () => ({
  type: ACTION_TYPES.GET_SCHEDULE_TYPES,
  payload: axios.post(
    `${apiScheduleUrlRestFul}/get-schedule-types`,
    {},
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

/**
 * call api validate task
 * @param taskId
 * @param startDate
 * @param finishDate
 */
export const validateTask = (taskId, startDate, finishDate) => async dispatch => {
  await dispatch({ type: ACTION_TYPES.VALIDATING, payload: taskId });
  return await dispatch({
    type: ACTION_TYPES.VALIDATE_TASK,
    payload: axios.post(
      `${apiScheduleUrlRestFul}/validate-task`,
      {
        tasksId: taskId,
        startDate: CalenderViewMonthCommon.localToTimezoneOfConfig(startDate)
          .utc()
          .format(),
        finishDate: CalenderViewMonthCommon.localToTimezoneOfConfig(finishDate)
          .utc()
          .format()
      },
      { headers: { ['Content-Type']: 'application/json' } }
    )
  });
};

/**
 * validate schedule before update
 * @param scheduleId
 */
export const validateSchedule = (
  scheduleId: number,
  uniqueId: string,
  action?: (flgResult: boolean) => void,
  isDragFlg?: boolean
) => async (dispatch, getState) => {
  await dispatch({ type: ACTION_TYPES.VALIDATING, payload: uniqueId });
  await dispatch({
    type: ACTION_TYPES.VALIDATE_SCHEDULE,
    payload: axios.post(
      `${apiScheduleUrlRestFul}/validate-schedule`,
      {
        scheduleId,
        isDrag: isDragFlg ? 1 : 0
      },
      { headers: { ['Content-Type']: 'application/json' } }
    )
  });

  if (action) {
    // validateSchedule
    action(getState().dataCreateEditSchedule.action === CreateEditScheduleAction.RequestSuccess);
  }
};

export const validateMileStone = (mileStoneId: number) => async dispatch => {
  await dispatch({ type: ACTION_TYPES.VALIDATING, payload: mileStoneId });
  return await dispatch({
    type: ACTION_TYPES.VALIDATE_MILESTONE,
    payload: axios.post(
      `${apiScheduleUrlRestFul}/validate-milestone`,
      {
        milestoneId: mileStoneId
      },
      { headers: { ['Content-Type']: 'application/json' } }
    )
  });
};

/**
 *
 * @param schedule
 */
export const updateSchedule = (schedule: DataOfSchedule, isDragFlg?: boolean) => async (
  dispatch,
  getState
) => {
  await dispatch(validateSchedule(schedule.itemId, schedule.uniqueId, null, isDragFlg));
  const createState = getState().dataCreateEditSchedule;

  if (createState.validateSchedule) {
    await dispatch(storeDragSchedule(schedule));
    await dispatch(hideModalDetail());
    await dispatch(hideModalSubDetail());
    // await dispatch(handleReloadData());
  } else {
    await dispatch(hideModalDetail());
    await dispatch(hideModalSubDetail());
  }
};

/**
 * update taskDate
 * @param schedule
 */
export const updateTask = (schedule: DataOfSchedule) => async (dispatch, getState) => {
  await dispatch(validateTask(schedule.itemId, schedule.startDate, schedule.finishDate));
  const createState = getState().dataCreateEditSchedule;
  if (createState.validateSchedule) {
    await dispatch({
      type: ACTION_TYPES.POST_SCHEDULE_DATA,
      payload: axios.post(
        `${apiScheduleUrlRestFul}/update-task-date`,
        {
          taskId: schedule.itemId,
          startDate: CalenderViewMonthCommon.localToTimezoneOfConfig(schedule.startDate)
            .utc()
            .format(),
          finishDate: CalenderViewMonthCommon.localToTimezoneOfConfig(schedule['endDate'])
            .utc()
            .format()
        },
        { headers: { ['Content-Type']: 'application/json' } }
      )
    });
    await dispatch(handleReloadData());
  }
};

/**
 * update milestone
 * @param schedule
 */
export const updateMileStone = (schedule: DataOfSchedule) => async (dispatch, getState) => {
  await dispatch(validateMileStone(schedule.itemId));
  const createState = getState().dataCreateEditSchedule;
  if (createState.validateSchedule) {
    await dispatch({
      type: ACTION_TYPES.POST_SCHEDULE_DATA,
      payload: axios.post(
        `${apiScheduleUrlRestFul}/update-milestone`,
        {
          milestoneId: schedule.itemId,
          endDate: CalenderViewMonthCommon.localToTimezoneOfConfig(schedule['endDate'])
            .utc()
            .format(),
          milestoneName: schedule.itemName
        },
        { headers: { ['Content-Type']: 'application/json' } }
      )
    });
    await dispatch(handleReloadData());
  }
};

export const resetMessage = () => {
  return {
    type: ACTION_TYPES.RESET_STATE_VALIDATE
  };
};

export const resetShowMessage = () => {
  return {
    type: ACTION_TYPES.RESET_SHOW_MESSAGE
  };
};

/**
 * Call api checkDuplicatedEquipments
 * @param scheduleData
 * @param updateFlag
 * @param equipments
 */
export const callAppCheckDuplicatedEquipments = (
  scheduleData,
  updateFlag,
  equipments,
  screenList: CalendarView = CalendarView.Day
) => async (dispatch, getState) => {
  await dispatch(getScheduleById(scheduleData.scheduleId));
  const schedule = getState().dataCreateEditSchedule.scheduleData;

  const equipmentsTemp = equipments.map((equipTemp: any) => {
    let equipCurrentInSchedule: any = null;
    if (Array.isArray(schedule.equipments) && screenList !== CalendarView.Day) {
      equipCurrentInSchedule =
        schedule.equipments[
          schedule.equipments.findIndex(val => val.equipmentId === equipTemp.equipmentId)
        ];
    }
    return {
      equipmentId: equipTemp.equipmentId,
      startDay: CalenderViewMonthCommon.localToTimezoneOfConfig(equipTemp.startTime)
        .utc()
        .format('YYYY/MM/DD'),
      startTime:
        screenList === CalendarView.Day && !equipCurrentInSchedule
          ? CalenderViewMonthCommon.localToTimezoneOfConfig(equipTemp.startTime)
              .utc()
              .format('HH:mm')
          : moment.utc(equipCurrentInSchedule.startTime).format('HH:mm'),
      endDay: CalenderViewMonthCommon.localToTimezoneOfConfig(equipTemp.endTime)
        .utc()
        .format('YYYY/MM/DD'),
      endTime:
        screenList === CalendarView.Day && !equipCurrentInSchedule
          ? CalenderViewMonthCommon.localToTimezoneOfConfig(equipTemp.endTime)
              .utc()
              .format('HH:mm')
          : moment.utc(equipCurrentInSchedule.endTime).format('HH:mm')
    };
  });

  const startDateSchedule = !schedule.isFullDay
    ? CalenderViewMonthCommon.localToTimezoneOfConfig(schedule.startDate)
        .utc()
        .format('YYYY/MM/DD')
    : CalenderViewMonthCommon.localToTimezoneOfConfig(schedule.startDate).format('YYYY/MM/DD');
  const endDateSchedule = !schedule.isFullDay
    ? CalenderViewMonthCommon.localToTimezoneOfConfig(schedule.finishDate)
        .utc()
        .format('YYYY/MM/DD')
    : CalenderViewMonthCommon.localToTimezoneOfConfig(schedule.finishDate).format('YYYY/MM/DD');
  const startTimeSchedule = !schedule.isFullDay
    ? CalenderViewMonthCommon.localToTimezoneOfConfig(schedule.startDate)
        .utc()
        .format('HH:mm')
    : moment
        .utc(
          CalenderViewMonthCommon.roundDownDay(
            CalenderViewMonthCommon.localToTimezoneOfConfig(schedule.startDate)
          )
        )
        .format('HH:mm');
  const endTimeSchedule = !schedule.isFullDay
    ? CalenderViewMonthCommon.localToTimezoneOfConfig(schedule.finishDate)
        .utc()
        .format('HH:mm')
    : moment
        .utc(
          CalenderViewMonthCommon.roundUpDay(
            CalenderViewMonthCommon.localToTimezoneOfConfig(schedule.finishDate)
          )
        )
        .format('HH:mm');
  await dispatch({
    type: ACTION_TYPES.CHECK_DUPLICATED_EQUIPMENTS,
    payload: axios.post(
      `${apiScheduleUrlRestFul}/check-duplicated-equipments`,
      !schedule.scheduleId
        ? {
            schedule: {
              startDay: startDateSchedule,
              endDay: endDateSchedule,
              startTime: startTimeSchedule,
              endTime: endTimeSchedule,
              isRepeated: schedule.isRepeated,
              repeatCondition: {
                repeatType: schedule.repeatType,
                repeatCycle: schedule.repeatCycle,
                regularDayOfWeek: schedule.regularDayOfWeek,
                regularWeekOfMonth: schedule.regularWeekOfMonth,
                regularDayOfMonth: schedule.regularDayOfMonth,
                regularEndOfMonth: schedule.regularEndOfMonth,
                repeatEndType: schedule.repeatEndType,
                repeatEndDate: schedule.repeatEndDate
                  ? CalenderViewMonthCommon.roundUpDay(moment.utc(schedule.repeatEndDate)).format()
                  : null,
                repeatNumber: schedule.repeatNumber
              }
            },
            equipments: equipmentsTemp
          }
        : {
            scheduleId: schedule.scheduleId,
            updateFlag,
            schedule: {
              startDay: startDateSchedule,
              endDay: endDateSchedule,
              startTime: startTimeSchedule,
              endTime: endTimeSchedule,
              isRepeated: schedule.isRepeated,
              repeatCondition: {
                repeatType: schedule.repeatType,
                repeatCycle: schedule.repeatCycle,
                regularDayOfWeek: schedule.regularDayOfWeek,
                regularWeekOfMonth: schedule.regularWeekOfMonth,
                regularDayOfMonth: schedule.regularDayOfMonth,
                regularEndOfMonth: schedule.regularEndOfMonth,
                repeatEndType: schedule.repeatEndType,
                repeatEndDate: schedule.repeatEndDate
                  ? CalenderViewMonthCommon.roundUpDay(moment.utc(schedule.repeatEndDate)).format()
                  : null,
                repeatNumber: schedule.repeatNumber
              }
            },
            equipments: equipmentsTemp
          },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    )
  });

  const equipmentsDataDrag = getState().dataCreateEditSchedule.dataEquipments;
  const isCheck = handleCheckEquipmentCanUse(equipmentsDataDrag);

  if (isCheck) {
    dispatch({
      type: ACTION_TYPES.SAVE_DRAFT_SCHEDULE_DATA,
      payload: {
        schedule
      }
    });

    if (!schedule.isRepeated) {
      dispatch({
        type: ACTION_TYPES.SHOW_POPUP_EQUIPMENT_ERRORS,
        payload: `${schedule.scheduleId}_${scheduleData.uniqueId}`
      });
    } else {
      dispatch({
        type: ACTION_TYPES.SHOW_POPUP_EQUIPMENT_CONFIRM,
        payload: {
          scheduleId: schedule.scheduleId
        }
      });
    }
  } else {
    let equipmentDataTemp = [];
    if (!schedule.isRepeated) {
      equipmentDataTemp =
        Array.isArray(equipmentsDataDrag) &&
        equipmentsDataDrag.map(equipDrag => {
          return {
            equipmentId: equipDrag.equipmentId,
            startTime: equipDrag.periods[0].startDate,
            endTime: equipDrag.periods[0].endDate,
            canUse: equipDrag.periods[0].canUse,
            equipmentTypeId:
              schedule.equipments[
                schedule.equipments.findIndex(item => item.equipmentId === equipDrag.equipmentId)
              ].equipmentTypeId
          };
        });
    } else {
      Array.isArray(equipmentsDataDrag) &&
        equipmentsDataDrag.forEach(equipDrag => {
          equipDrag.periods.forEach(itemEquip => {
            equipmentDataTemp.push({
              equipmentId: equipDrag.equipmentId,
              startTime: itemEquip.startDate,
              endTime: itemEquip.endDate,
              canUse: itemEquip.canUse,
              equipmentTypeId:
                schedule.equipments[
                  schedule.equipments.findIndex(item => item.equipmentId === equipDrag.equipmentId)
                ].equipmentTypeId
            });
          });
        });
    }
    schedule.equipments = equipmentDataTemp;

    await dispatch(storeSchedule(schedule, [], true));
  }
};

/**
 * call api updateSchedule
 * @param schedule
 * @param updateFlag
 * @param equipmentFlag
 */
export const updateScheduleHasEquipmentDuplicate = (updateFlag, confirmFlag, isNotSave?) => (
  dispatch,
  getState
) => {
  const scheduleUpdate = {
    ...getState().dataCreateEditSchedule.draftStoreScheduleData,
    updateFlag,
    equipmentFlag: confirmFlag
  };

  const equipmentCheckedUpdate = [...getState().dataCreateEditSchedule.dataEquipments];
  if (Array.isArray(scheduleUpdate.equipments)) {
    const elementData = [];
    scheduleUpdate.equipments.forEach((equipment, idx) => {
      const indexFlag = equipmentCheckedUpdate.findIndex(
        item => item.equipmentId === equipment.equipmentId
      );
      if (equipmentCheckedUpdate[indexFlag]) {
        equipmentCheckedUpdate[indexFlag].periods.forEach(item => {
          elementData.push({
            startTime: item.startDate,
            endTime: item.endDate,
            equipmentId: equipmentCheckedUpdate[indexFlag].equipmentId,
            canUse: item.canUse,
            equipmentTypeId: scheduleUpdate.equipments[idx].equipmentTypeId
          });
        });
      }
    });
    scheduleUpdate.equipments = elementData;
  }
  if(isNotSave) {
    dispatch(updateScheduleDataDraf(scheduleUpdate));
  } else {
    dispatch(storeSchedule(scheduleUpdate, getState().dataCreateEditSchedule.fileUpload, true));
  }
};

/**
 * call api equipment suggestion
 * @param equipmentTypeId
 * @param searchValue
 */
export const getEquipmentSuggestionsData = (equipmentTypeId: number, searchValue: string) => ({
  type: ACTION_TYPES.GET_EQUIPMENT_SUGGESTION,
  payload: axios.post(
    `${apiScheduleUrlRestFul}/get-equipment-suggestions`,
    {
      equipmentTypeId,
      searchValue
    },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

/**
 * call api equipment suggestion
 * @param equipmentTypeId
 * @param searchValue
 */
export const getScheduleTypeSuggestionsData = (keyword: string) => ({
  type: ACTION_TYPES.GET_SCHEDULE_TYPE_SUGGESTION,
  payload: axios.post(`${apiScheduleUrlRestFul}/get-schedule-type-suggestions`, {
    limit: 10,
    offset: 0,
    searchValue: keyword
  })
});

/**
 * Save suggestion choice when selected auto complete
 * @param namespace
 * @param searchValue
 */
export const saveSuggestionsChoice = (namespace, index, idResult) => ({
  type: ACTION_TYPES.SAVE_SUGGESTION_CHOICE,
  payload: axios.post(`${apiUrlCommon}/save-suggestions-choice`, {
    index,
    idResult: [idResult]
  }),
  meta: {
    namespace
  }
});

// export const getScheduleTypeSuggestionsData = (keyword?: string) =>  (dispatch, getState) => {
//    dispatch ({
//     type: ACTION_TYPES.GET_SCHEDULE_TYPE_SUGGESTION,
//     payload: axios.post(
//       `${apiUrl}/get-schedule-type-suggestions`,
//       {
//         limit: 10,
//         offset: 0,
//         searchValue: keyword,
//       },
//       { headers: {  ['Content-Type']: 'application/json' } }
//     )
//   })
// };

/**
 * save schedule when confirm popup: equipment confirm
 * @param confirmFlag
 */
export const storeScheduleConfirmEquip = (confirmFlag: number, isNotSave?: boolean) => (dispatch, getState) => {
  const scheduleTemp = {
    ...getState().dataCreateEditSchedule.draftStoreScheduleData,
    equipmentFlag: confirmFlag
  };

  const equipmentCheckedTemp = [...getState().dataCreateEditSchedule.dataEquipments];
  if (Array.isArray(scheduleTemp.equipments)) {
    const elementData = [];
    scheduleTemp.equipments.forEach((equipment, idx) => {
      const indexFlag = equipmentCheckedTemp.findIndex(
        item => item.equipmentId === equipment.equipmentId
      );
      if (equipmentCheckedTemp[indexFlag]) {
        equipmentCheckedTemp[indexFlag].periods.forEach(item => {
          elementData.push({
            startTime: item.startDate,
            endTime: item.endDate,
            equipmentId: equipmentCheckedTemp[indexFlag].equipmentId,
            canUse: item.canUse,
            equipmentTypeId: scheduleTemp.equipments[idx].equipmentTypeId
          });
        });
      }
    });
    scheduleTemp.equipments = elementData;
  }
  if(isNotSave) {
    dispatch(updateScheduleDataDraf(scheduleTemp));
  } else {
    dispatch(storeSchedule(scheduleTemp, getState().dataCreateEditSchedule.fileUpload));
  }
};

export const resetPopupEquipmentError = () => ({
  type: ACTION_TYPES.SHOW_POPUP_EQUIPMENT_ERRORS,
  payload: null
});

export const resetPopupConfirmScheduleLoop = () => ({
  type: ACTION_TYPES.SHOW_POPUP_EQUIPMENT_CONFIRM,
  payload: {
    updateFlag: null,
    scheduleId: null
  }
});

export const getInfoEmployeeCurrent = () => ({
  type: ACTION_TYPES.GET_INFO_EMPLOYEE_CURRENT,
  payload: axios.post(
    `${API_CONTEXT_PATH}/employees/api/get-employees-by-ids`,
    {
      employeeIds: []
    },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

export const onChangeDateOnCick = (dateClick: moment.Moment) => ({
  type: ACTION_TYPES.ON_CHANGE_DATE_ON_CLICK,
  payload: dateClick
});

export const resetEquipmentSuggest = () => ({ type: ACTION_TYPES.RESET_EQUIPMENT_SUGGEST });
