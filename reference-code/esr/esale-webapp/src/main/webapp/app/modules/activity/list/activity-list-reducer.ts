import axios from 'axios';
import { API_CONFIG, API_CONTEXT_PATH, ScreenMode, AVAILABLE_FLAG } from 'app/config/constants';
import { GetActivity, ActivityInfoType } from '../models/get-activity-type';
import { CommonUtil, parseErrorResponse, makeConditionSearchDefault } from '../common/common-util';
import { ACTION_TYPES, ACTIVITY_ACTION_TYPES, PARAMS_SCHEDULE } from '../constants';
import PopupConfirmRestoreDraft from '../control/popup-confirm-restore-draft';
import { parseResponseData, clearResponseData } from '../common/common-util';
import { GetProductSuggestions } from '../models/get-product-suggestions-type';
import { ConfirmPopupItem } from '../models/confirm-popup-item';
import { GetBusinessCardList } from '../models/get-business-card-list-type';
import { GetCustomerList } from '../models/get-customer-list-type';
import { ActivityFormSeach, GetActivitiesForm } from '../models/get-activities-type';
import { GetListSales } from '../models/get-list-sales';
import { GetScenario } from '../models/get-scenario-model';
import { DEFINE_FIELD_TYPE } from 'app/shared/layout/dynamic-form/constants';
import _ from 'lodash';
import { convertFieldType, modeScreenType } from 'app/shared/util/fieldType-utils';
import moment from 'moment';
import { AcivityDraftRespones } from '../models/activity-draft-respone-type';
import { resetDataForm } from '../../calendar/popups/create-edit-schedule.reducer';
import { parseErrorRespose } from 'app/shared/util/string-utils';
import { CalenderViewMonthCommon } from 'app/modules/calendar/grid/common';
import { utcToTz } from 'app/shared/util/date-utils';
import { CommonUtils } from 'app/modules/calendar/models/common-type';

export enum ActivityAction {
  None,
  Request,
  Error,
  Success
}

const LIMIT = 30;

const apiUrl = API_CONTEXT_PATH + '/' + API_CONFIG.ACTIVITY_SERVICE_PATH;
const apiUrlSales = API_CONTEXT_PATH + '/' + API_CONFIG.SALES_SERVICE_PATH;
const apiUrlCustomer = API_CONTEXT_PATH + '/' + API_CONFIG.CUSTOMER_SERVICE_PATH;
const apiUrlBusinessCard = API_CONTEXT_PATH + '/' + API_CONFIG.BUSINESS_CARD_SERVICE_PATH;
const apiUrlProduct = API_CONTEXT_PATH + '/' + API_CONFIG.PRODUCT_SERVICE_PATH;
const commonsApiUrl = API_CONTEXT_PATH + '/' + API_CONFIG.COMMON_SERVICE_PATH;
const apiUrlSchedule = API_CONTEXT_PATH + '/' + API_CONFIG.SCHEDULES_SERVICE_PATH;

const initialState = {
  openModalFormActivity: false,
  openModalConfirmRestoreDraff: false,
  openModalDetail: false,
  activityLayout: null,
  action: ActivityAction.None,
  listActivities: [],
  listDraftActivities: [],
  activityInfo: {},
  activityFormSearch: null,
  isToggleModalFormActivity: null,
  openPopupSearch: false,
  productSuggestions: null,
  openConfirmPopup: false,
  confirmPopupItem: null,
  activityId: null,
  success: false,
  successMessage: null,
  errorMessage: null,
  errorItems: [],
  businessCartData: null,
  customerData: null,
  listSaleData: null,
  employeeName: null,
  activityDetailIndex: null,
  listActivityHistory: null,
  lengthHistory: null,
  productTradings: null,
  scenario: {},
  detailObjectId: null,
  detailType: null,
  isFromModal: false,
  screenMode: ScreenMode.DISPLAY,
  messageChangeStatusSuccess: null,
  errorMessageChangeStatusFailed: null,
  messageUpdateCustomFieldInfoSuccess: null,
  messageUpdateCustomFieldInfoError: null,
  activityFieldsAvailable: null,
  activityFieldsUnAvailable: null,
  showServiceDetail: null,
  customers: null,
  businessCards: null,
  downloadData: null,
  activityDraftId: null,
  canScrollActivityList: null,
  activityDraftResponse: null,
  productTradingUnAvailable: null,
  fieldInfoIds: null,
  listProductTradings: null,
  customerInfo: null,
  updateDate: null,
  isEditToDetail: false,
  isLoadding: false,
  activityFieldsAvailableDetail: null,
  productTradingUnAvailableDetail: null,
  activityFieldsUnAvailableDetail: null,
  customersByIds: null,
  milestonesByIds: null,
  schedulesByIds: null,
  tasksByIds: null,
  isActionSaveDraft: false,
  deleteActivityIds: null,
  deleteActivityDraftId: null,
  displayedObjectIds: [],
  showDetailTask: null,
  fieldBelongUpdateCustomFieldInfo: null
};
export type ActivityListReducerState = {
  openModalConfirmRestoreDraff: boolean;
  openModalFormActivity: boolean;
  openModalDetail: boolean;
  activityInfo?: GetActivity;
  activityDetail?: GetActivity;
  isToggleModalFormActivity: boolean;
  activityLayout: any;
  action: ActivityAction;
  listActivities: ActivityInfoType[];
  listDraftActivities: GetActivity[];
  listErrorMessage?: [];
  activityFormSearch?: GetActivitiesForm;
  openPopupSearch: boolean;
  productSuggestions: GetProductSuggestions;
  openConfirmPopup: boolean;
  confirmPopupItem: ConfirmPopupItem;
  activityId: number;
  success: boolean;
  successMessage: any;
  errorMessage: any;
  errorItems: any;
  businessCartData: GetBusinessCardList;
  customerData: GetCustomerList;
  listSaleData: GetListSales;
  employeeName: string;
  activityDetailIndex: number;
  listActivityHistory: [];
  lengthHistory: number;
  productTradings: [];
  scenario: GetScenario;
  detailObjectId: number;
  detailType: number;
  isFromModal: boolean;
  screenMode: any;
  messageChangeStatusSuccess: any;
  errorMessageChangeStatusFailed: any;
  messageUpdateCustomFieldInfoSuccess: any;
  messageUpdateCustomFieldInfoError: any;
  activityFieldsAvailable: any;
  activityFieldsUnAvailable: any;
  showServiceDetail: {};
  customers: [];
  businessCards: [];
  downloadData: any;
  activityDraftId: number;
  canScrollActivityList: boolean;
  activityDraftResponse: AcivityDraftRespones;
  productTradingUnAvailable: any;
  fieldInfoIds: [];
  listProductTradings: [];
  customerInfo: any;
  updateDate: any;
  isEditToDetail: boolean;
  activityFieldsAvailableDetail: any;
  productTradingUnAvailableDetail: any;
  activityFieldsUnAvailableDetail: any;
  customersByIds: any;
  milestonesByIds: any;
  schedulesByIds: any;
  tasksByIds: any;
  isActionSaveDraft: boolean;
  deleteActivityIds: number;
  deleteActivityDraftId: number;
  displayedObjectIds: any;
  showDetailTask: boolean;
  fieldBelongUpdateCustomFieldInfo: any;
};

// export type ActivityListReducerState = Readonly<ActivityListReducerProps> & {
//   listActivities: GetActivities[];
// };

const handleAction = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.TOGGLE_MODAL_CONFIRM_RESTORE_DRAFT:
      return {
        ...state,
        openModalConfirmRestoreDraff: action.payload
      };
    case ACTION_TYPES.UPDATE_ACTIVITY_FORM_SEARCH:
      return {
        ...state,
        activityFormSearch: action.payload
      };

    case ACTION_TYPES.TOGGLE_POPUP_SEARCH_CONDITION:
      return {
        ...state,
        openPopupSearch: !state.openPopupSearch
      };

    case ACTION_TYPES.TOGGLE_MODAL_FORM_ACTIVITY:
      return {
        ...state,
        openModalFormActivity: action.payload
      };

    case ACTION_TYPES.UPDATE_ACTIVITY_INFO:
      return {
        ...state,
        activityInfo: action.payload
      };

    case ACTION_TYPES.TOGGLE_CONFIRM_POPUP:
      return {
        ...state,
        openConfirmPopup: action.payload.flag,
        confirmPopupItem: action.payload.item
      };
    case ACTION_TYPES.CLEAR_RESPONSE_DATA:
      return {
        ...state,
        ...clearResponseData()
      };
    case ACTION_TYPES.TOGGLE_MODAL_DETAIL_ACTIVITY:
      return {
        ...state,
        openModalDetail: action.payload
      };
    case ACTION_TYPES.UPDATE_ACTITVITY_DETAIL_INDEX:
      return {
        ...state,
        activityDetailIndex: action.payload
      };
    case ACTION_TYPES.SHOW_DETAIL: {
      const { detailObjectId, detailType, idCaller } = action.payload;

      // if (
      //   state.displayedObjectIds.findIndex(
      //     i => i.detailObjectId === detailObjectId && i.detailType === detailType
      //   ) !== -1
      // ) {
      //   return {
      //     ...state
      //   };
      // }

      return {
        ...state,
        detailObjectId,
        detailType,
        isFromModal: action.payload.isFromModal,
        showServiceDetail: {
          countDetail: (_.get(state.showServiceDetail, 'countDetail') || 0) + 1,
          idCaller
        }
      };
    }
    // case ACTION_TYPES.SHOW_DETAIL_REGISTERED: {
    //   const { detailObjectId, detailType } = action.payload;

    //   const displayedObjectIds = _.cloneDeep(state.displayedObjectIds);
    //   if (
    //     state.displayedObjectIds.findIndex(
    //       i => i.detailObjectId === detailObjectId && i.detailType === detailType
    //     ) !== -1
    //   ) {
    //     return {
    //       ...state
    //     };
    //   }
    //   displayedObjectIds.push({ detailObjectId, detailType });
    //   return {
    //     ...state,
    //     displayedObjectIds
    //   };
    // }
    // case ACTION_TYPES.SHOW_DETAIL_DEREGISTERED: {
    //   const { detailObjectId, detailType } = action.payload;

    //   const displayedObjectIds = _.cloneDeep(state.displayedObjectIds);
    //   const displayIndex = state.displayedObjectIds.findIndex(
    //     i => i.detailObjectId === detailObjectId && i.detailType === detailType
    //   );
    //   if (displayIndex === -1) {
    //     return {
    //       ...state
    //     };
    //   }

    //   displayedObjectIds.splice(displayIndex, 1);
    //   return {
    //     ...state,
    //     displayedObjectIds
    //   };
    // }

    case ACTION_TYPES.CHANGE_TO_DISPLAY:
      return {
        ...state,
        messageUpdateCustomFieldInfoSuccess: null,
        messageUpdateCustomFieldInfoError: null,
        fieldBelongUpdateCustomFieldInfo: null,
        screenMode: ScreenMode.DISPLAY
      };
    case ACTION_TYPES.CHANGE_TO_EDIT:
      return {
        ...state,
        messageUpdateCustomFieldInfoSuccess: null,
        messageUpdateCustomFieldInfoError: null,
        fieldBelongUpdateCustomFieldInfo: null,
        screenMode: ScreenMode.EDIT
      };
    case ACTION_TYPES.RESET_ACTIVITY_LIST_SCROLL:
      return {
        ...state,
        canScrollActivityList: null
      };
    case ACTION_TYPES.RESET_ACTIVITY_DRAFT:
      return {
        ...state,
        activityDraftResponse: null,
        deleteActivityDraftId: null,
        activityInfo: {},
        isActionSaveDraft: null
      };
    case ACTION_TYPES.CLEAR_SHOW_DETAIL:
      return {
        ...state,
        detailObjectId: null,
        detailType: null,
        isFromModal: null,
        showServiceDetail: null,
        showDetailTask: null
      };
    case ACTION_TYPES.IS_EDIT_TO_DETAIL:
      return {
        ...state,
        isEditToDetail: action.payload
      };
    case ACTION_TYPES.CLEAR_MESSAGE:
      return {
        ...state,
        success: null,
        successMessage: null,
        errorMessage: null,
        errorItems: null
      };
    case ACTION_TYPES.TASK_DETAIL_RESET: {
      return {
        ...state,
        showDetailTask: false
      };
    }
    default:
      return state;
  }
};
export default (
  state: ActivityListReducerState = initialState,
  action
): ActivityListReducerState => {
  let result;

  result = CommonUtil.excuteFunction(
    ACTION_TYPES.ACTIVITY_GET_ACTIVITY_LAYOUT,
    state,
    action,
    null,
    () => {
      const response = action.payload.data;
      const fieldInfoProductTrading = !_.isNil(response['fieldInfoProductTrading'])
        ? response.fieldInfoProductTrading.filter(
            e => e.availableFlag === AVAILABLE_FLAG.WEB_APP_AVAILABLE
          )
        : [];
      return {
        ...state,
        activityInfo: {
          activities: {
            employee: {
              employeeName: response.dataInfo.employeeName || '',
              employeeSurname: response.dataInfo.employeeSurname || ''
            },
            activityFormats: response.dataInfo.activitiesFormats
          },
          fieldInfoActivity: response.fieldInfoActivity,
          fieldInfoProductTrading,
          progresses: response.progresses
        },
        action: ActivityAction.Success
        // , ...parseResponseData(action.payload)
      };
    }
  );
  if (result) return result;

  result = CommonUtil.excuteFunction(ACTION_TYPES.GET_ACTIVITIES, state, action, null, () => {
    const response = action.payload;
    return {
      ...state,
      canScrollActivityList:
        response.data.activities && action.payload.data.activities.length === LIMIT,
      action: ActivityAction.Success,
      listActivities: response.data.activities || [],
      successMessage: null,
      errorMessage: null
    };
  });
  if (result) return result;

  result = CommonUtil.excuteFunction(
    ACTION_TYPES.GET_ACTIVITIES_DRAFT,
    state,
    action,
    null,
    () => ({
      ...state,
      canScrollActivityList: true,
      action: ActivityAction.Success,
      listActivities: action.payload.data.activities || []
    })
  );
  if (result) return result;

  result = CommonUtil.excuteFunction(
    ACTION_TYPES.GET_LAZY_ACTIVITIES,
    state,
    action,
    () => ({
      ...state,
      canScrollActivityList: true,
      action: ActivityAction.Error
    }),
    () => {
      const response = action.payload;
      return {
        ...state,
        canScrollActivityList:
          action.payload.data.activities && action.payload.data.activities.length === LIMIT,
        action: ActivityAction.Success,
        listActivities:
          state.listActivities && state.listActivities.length > 0
            ? response.data.activities
              ? state.listActivities.concat(response.data.activities)
              : state.listActivities
            : response.data.activities
      };
    }
  );
  if (result) return result;

  result = CommonUtil.excuteFunction(
    ACTION_TYPES.GET_LAZY_ACTIVITIES_DRAFT,
    state,
    action,
    null,
    () => {
      let listData = state.listActivities || [];
      if (action.payload.data.activities) {
        listData = listData.concat(action.payload.data.activities);
      }
      return {
        ...state,
        canScrollActivityList:
          action.payload.data.activities && action.payload.data.activities.length === LIMIT,
        action: ActivityAction.Success,
        listActivities: listData
      };
    }
  );
  if (result) return result;

  result = CommonUtil.excuteFunction(ACTION_TYPES.CHECK_DRAFT, state, action, null, () => {
    const response = action.payload;
    return {
      ...state,
      listDraftActivities: response.data.dataInfo
    };
  });
  if (result) return result;

  result = CommonUtil.excuteFunction(
    ACTION_TYPES.ACTIVITY_UPDATE_CUSTOM_FIELD_INFO,
    state,
    action,
    () => {
      return {
        ...state,
        messageUpdateCustomFieldInfoError: parseErrorRespose(action.payload)
      };
    },
    () => {
      const respone = action.payload.data;
      return {
        ...state,
        action: ActivityAction.Success,
        fieldInfoIds: respone.fieldIds,
        fieldBelongUpdateCustomFieldInfo: action.meta.fieldBelong,
        messageUpdateCustomFieldInfoSuccess: 'INF_COM_0004'
      };
    }
  );
  if (result) return result;

  result = CommonUtil.excuteFunction(
    ACTION_TYPES.ACTIVITY_GET_ACTIVITY,
    state,
    action,
    null,
    () => {
      const response = action.payload.data;
      if (_.isNil(response.activities)) {
        return {
          ...state,
          action: ActivityAction.Success,
          activityInfo: null
        };
      }
      const tabListShow =
        response.tabInfo &&
        response.tabInfo.filter(tab => {
          return tab['isDisplay'] === true;
        });

      const activityDetail: GetActivity = response;
      activityDetail.fieldInfoActivity = convertFieldType(
        activityDetail.fieldInfoActivity,
        modeScreenType.typeDetail
      ).filter(e => e.fieldName !== 'employee_managers' && e.fieldName !== 'employee_subordinates');
      const filteredAvailable = activityDetail.fieldInfoActivity.filter(field => {
        return field.availableFlag === AVAILABLE_FLAG.WEB_APP_AVAILABLE;
      });

      // filteredAvailable = _.cloneDeep(reOrderSort(filteredAvailable));

      const filteredUnAvailable = activityDetail.fieldInfoActivity.filter(field => {
        return field.availableFlag === AVAILABLE_FLAG.UNAVAILABLE;
      });

      let filteredProductTradingUnAvailable = [];
      if (_.isArray(activityDetail.fieldInfoProductTrading)) {
        filteredProductTradingUnAvailable = activityDetail.fieldInfoProductTrading.filter(field => {
          return field.availableFlag === AVAILABLE_FLAG.UNAVAILABLE;
        });
      }

      // filteredUnAvailable = reOrderSort(filteredUnAvailable);

      const activityFieldsAvailable = _.cloneDeep(activityDetail);
      activityFieldsAvailable.fieldInfoActivity = filteredAvailable;
      // const activityFieldsAvailable = filteredAvailable;
      response.activities['contactDate'] = utcToTz(response.activities.activityStartTime);
      // response.activities['activityStartTime'] = CommonUtil.getTimeZoneFromDate(
      //   response.activities.activityStartTime
      // );

      // response.activities['activityEndTime'] = CommonUtil.getTimeZoneFromDate(
      //   response.activities.activityEndTime
      // );

      response.activities['interviewers'] = response.activities['interviewer'];
      delete response.activities['interviewer'];
      if (
        response.activities &&
        response.activities.schedule &&
        response.activities.schedule.scheduleId
      ) {
        const schedule = {
          scheduleId: response.activities.schedule.scheduleId,
          parentCustomerName:
            response.activities.schedule &&
            response.activities.schedule.customers &&
            response.activities.schedule.customers['parentCustomerName'],
          customerName:
            response.activities.schedule &&
            response.activities.schedule.customers &&
            response.activities.schedule.customers['customerName'],
          productTradingName:
            response.activities.schedule &&
            response.activities.schedule.productTradings &&
            response.activities.schedule.productTradings['producTradingName'],
          scheduleName: response.activities.schedule['scheduleName'],
          endDate: response.activities.schedule['finishDate']
        };
        delete response.activities['schedule'];
        response.activities['schedule'] = schedule;
      }
      if (
        response.activities &&
        response.activities.milestone &&
        response.activities.milestone.milestoneId
      ) {
        const milestone = {
          milestoneId: response.activities.milestone.milestoneId,
          parentCustomerName:
            response.activities.milestone &&
            response.activities.milestone.customer &&
            response.activities.milestone.customer.parentCustomerName,
          customerName:
            response.activities.milestone &&
            response.activities.milestone.customer &&
            response.activities.milestone.customer.customerName,
          milestoneName:
            response.activities.milestone && response.activities.milestone.milestoneName,
          endDate: response.activities.milestone && response.activities.milestone.endDate
        };
        delete response.activities['milestone'];
        response.activities['milestone'] = milestone;
      }
      if (response.activities && response.activities.task && response.activities.task.taskId) {
        const task = {
          milestone: {
            milestoneName: response.activities.task.milestoneName
          },
          customer: response.activities.task.customers,
          taskName: response.activities.task.taskName,
          finishDate: response.activities.task.finishDate,
          taskId: response.activities.task.taskId
        };
        delete response.activities['task'];
        response.activities['task'] = task;
      }
      return {
        ...state,
        activityInfo: {
          ...response,
          tabListShow
        },
        updateDate:
          response &&
          response.activities &&
          response.activities.updatedUser &&
          response.activities.updatedUser.updatedDate,
        activityFieldsAvailable,
        activityFieldsUnAvailable: filteredUnAvailable,
        productTradingUnAvailable: filteredProductTradingUnAvailable,
        action: ActivityAction.Success
        // ,...parseResponseData(action.payload)
      };
    }
  );
  if (result) return result;

  result = CommonUtil.excuteFunction(
    ACTION_TYPES.ACTIVITY_GET_ACTIVITY_DRAFT,
    state,
    action,
    null,
    () => {
      const resDraft = CommonUtil.parseGetActivityResponse(action);
      return {
        ...state,
        activityInfo: {
          ...resDraft.response,
          tabListShow: resDraft.tabListShow
        },
        activityFieldsAvailable: resDraft.activityFieldsAvailable,
        activityFieldsUnAvailable: resDraft.filteredUnAvailable,
        action: ActivityAction.Success
      };
    }
  );
  if (result) return result;

  result = CommonUtil.excuteFunction(
    ACTION_TYPES.ACTIVITY_GET_ACTIVITY_DETAIL,
    state,
    action,
    () => ({
      ...state,
      ...parseErrorResponse(action.payload)
    }),
    () => {
      const resDetail = CommonUtil.parseGetActivityResponse(action);
      return {
        ...state,
        activityDetail: {
          ...resDetail.response,
          tabListShow: resDetail.tabListShow
        },
        activityFieldsAvailableDetail: resDetail.activityFieldsAvailable,
        productTradingUnAvailableDetail: resDetail.productTradingUnAvailable,
        activityFieldsUnAvailableDetail: resDetail.filteredUnAvailable,
        action: ActivityAction.Success
      };
    }
  );
  if (result) return result;

  result = CommonUtil.excuteFunction(
    ACTION_TYPES.GET_PRODUCT_SUGGESTION,
    state,
    action,
    null,
    () => {
      const response = action.payload;
      return {
        ...state,
        productSuggestions: response.data
      };
    }
  );
  if (result) return result;

  result = CommonUtil.excuteFunction(
    ACTION_TYPES.ACTIVITY_SAVE_ACTIVITY,
    state,
    action,
    () => {
      return {
        ...state,
        ...parseErrorResponse(action.payload)
      };
    },
    () => {
      const response = action.payload;
      const msg = action.meta.isUpdate ? 'INF_COM_0004' : 'INF_COM_0003';
      return {
        ...state,
        isEditToDetail: true,
        ...parseResponseData(response, msg)
      };
    }
  );
  if (result) return result;

  result = CommonUtil.excuteFunction(ACTION_TYPES.SAVE_ACTIVITY_DRAFT, state, action, null, () => {
    const response = action.payload;
    return {
      ...state,
      activityDraftResponse: response.data
    };
  });
  if (result) return result;

  result = CommonUtil.excuteFunction(
    ACTION_TYPES.SAVE_ACTIVITY_DRAFT_MANUAL,
    state,
    action,
    () => {
      const res = parseErrorResponse(action.payload);
      return {
        ...state,
        ...res,
        isActionSaveDraft: false
      };
    },
    () => {
      const response = action.payload;
      return {
        ...state,
        activityDraftResponse: response.data,
        success: true,
        successMessage: `INF_ACT_0001`,
        isActionSaveDraft: true
      };
    }
  );
  if (result) return result;

  // getBusinessCartList-manhnh
  result = CommonUtil.excuteFunction(
    ACTION_TYPES.GET_BUSINESS_CARD_LIST,
    state,
    action,
    null,
    () => {
      const response = action.payload.data;
      return {
        ...state,
        businessCartData: response
      };
    }
  );
  if (result) return result;

  // getCustomerList-manhnh
  result = CommonUtil.excuteFunction(ACTION_TYPES.GET_CUSTOMER_LIST, state, action, null, () => {
    const response = action.payload.data;
    return {
      ...state,
      customerData: response
    };
  });
  if (result) return result;

  result = CommonUtil.excuteFunction(
    ACTION_TYPES.ACTIVITY_DELETE,
    state,
    action,
    () => {
      const error = parseErrorResponse(action.payload);
      return {
        ...state,
        ...error
      };
    },
    () => {
      const response = action.payload;
      return {
        ...state,
        action: ActivityAction.Success,
        deleteActivityIds: response.data.activityIds,
        ...parseResponseData(response, 'INF_COM_0005')
      };
    }
  );

  if (result) return result;
  result = CommonUtil.excuteFunction(
    ACTION_TYPES.ACTIVITY_DELETE_DRAFT,
    state,
    action,
    () => {
      const errorDraft = parseErrorResponse(action.payload);
      return {
        ...state,
        ...errorDraft
      };
    },
    () => {
      const response = action.payload;
      return {
        ...state,
        action: ActivityAction.Success,
        deleteActivityDraftId: response.data.activityDraftId,
        ...parseResponseData(response, 'INF_COM_0005')
      };
    }
  );
  if (result) return result;

  result = CommonUtil.excuteFunction(
    ACTION_TYPES.ACTIVITY_DRAFT_DISCARD,
    state,
    action,
    () => {
      const errorDraftDiscard = parseErrorResponse(action.payload);
      return {
        ...state,
        ...errorDraftDiscard
      };
    },
    () => {
      // const response = action.payload;
      return {
        ...state,
        action: ActivityAction.Success
      };
    }
  );
  if (result) return result;

  
  result = CommonUtil.excuteFunction(ACTION_TYPES.GET_ACTIVITY_HISTORY, state, action, null, () => {
    const response = action.payload.data;
    return {
      ...state,
      listActivityHistory: response.activityHistories,
      lengthHistory:
        response.activityHistories && response.activityHistories.length === LIMIT ? LIMIT : 0,
      action: ActivityAction.Success
      // ,...parseResponseData(action.payload)
    };
  });
  if (result) return result;

  result = CommonUtil.excuteFunction(
    ACTION_TYPES.GET_LAZY_ACTIVITY_HISTORY,
    state,
    action,
    null,
    () => {
      const response = action.payload.data;
      const data = state.listActivityHistory;
      return {
        ...state,
        listActivityHistory: data.concat(response.activityHistories),
        lengthHistory:
          response.activityHistories && response.activityHistories.length === LIMIT ? LIMIT : 0
        // ,...parseResponseData(action.payload)
      };
    }
  );
  if (result) return result;

  result = CommonUtil.excuteFunction(
    ACTION_TYPES.DOWNLOAD_ACTIVITY,
    state,
    action,
    () => ({
      ...state,
      ...parseErrorResponse(action.payload)
    }),
    () => {
      const response = action.payload.data;
      return {
        ...state,
        downloadData: response
      };
    }
  );
  if (result) return result;

  result = CommonUtil.excuteFunction(ACTION_TYPES.GET_LIST, state, action, null, () => {
    const response = action.payload.data;
    return {
      ...state,
      listSaleData: response
    };
  });
  if (result) return result;

  result = CommonUtil.excuteFunction(
    ACTION_TYPES.SALES_GET_PRODUCT_TRADINGS,
    state,
    action,
    null,
    () => {
      const response = action.payload.data;
      return {
        ...state,
        listProductTradings: response.productTradings
      };
    }
  );
  if (result) return result;

  result = CommonUtil.excuteFunction(ACTION_TYPES.GET_SCENARIO, state, action, null, () => {
    const response = action.payload.data;
    return {
      ...state,
      scenario: response.scenarios
    };
  });
  if (result) return result;

  result = CommonUtil.excuteFunction(ACTION_TYPES.GET_CUSTOMERS, state, action, null, () => {
    const response = action.payload.data;
    return {
      ...state,
      customers: response.customers,
      action: ActivityAction.Success
    };
  });
  if (result) return result;

  result = CommonUtil.excuteFunction(ACTION_TYPES.GET_CUSTOMERS_BY_IDS, state, action, null, () => {
    const response = action.payload.data;
    return {
      ...state,
      customersByIds: response.customers,
      action: ActivityAction.Success
    };
  });
  if (result) return result;

  result = CommonUtil.excuteFunction(
    ACTION_TYPES.GET_MILESTONES_BY_IDS,
    state,
    action,
    null,
    () => {
      const response = action.payload.data;
      return {
        ...state,
        milestonesByIds: response.milestones,
        action: ActivityAction.Success
      };
    }
  );
  if (result) return result;

  result = CommonUtil.excuteFunction(ACTION_TYPES.GET_SCHEDULES_BY_IDS, state, action, null, () => {
    const response = action.payload.data;
    return {
      ...state,
      schedulesByIds: response.data,
      action: ActivityAction.Success
    };
  });
  if (result) return result;

  result = CommonUtil.excuteFunction(ACTION_TYPES.GET_TASKS_BY_IDS, state, action, null, () => {
    const response = action.payload.data;
    return {
      ...state,
      tasksByIds: response.tasks,
      action: ActivityAction.Success
    };
  });
  if (result) return result;

  result = CommonUtil.excuteFunction(ACTION_TYPES.GET_BUSINESS_CARDS, state, action, null, () => {
    const response = action.payload.data;
    return {
      ...state,
      businessCards: response.businessCards,
      action: ActivityAction.Success
    };
  });
  if (result) return result;

  result = CommonUtil.excuteFunction(ACTION_TYPES.GET_PRODUCT_TRADINGS, state, action, null, () => {
    const response = action.payload.data;
    return {
      ...state,
      productTradings: response.productTradings,
      action: ActivityAction.Success
    };
  });
  if (result) return result;

  result = CommonUtil.excuteFunction(ACTION_TYPES.GET_CUSTOMER, state, action, null, () => {
    const response = action.payload.data;
    return {
      ...state,
      customerInfo: response.customer
    };
  });
  if (result) return result;

  /** handle synchronized action */
  return handleAction(state, action);
};

/**
 * convertDataBeforeBuildForm
 * @param obj
 * @param fieldOrigin
 * @param fieldTarget
 * @param fieldData
 */
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

const NVL = (value: any, valueDefault?: any) => {
  return value === undefined ? (valueDefault === undefined ? null : valueDefault) : value;
};


const bulidScheduleDataForm = (scheduleData) => {
  if(_.isNil(scheduleData))
    return null;
  const nextSchedule = _.cloneDeep(scheduleData);
  if (nextSchedule?.scheduleId && nextSchedule?.otherParticipantIds) {
    nextSchedule["businessCardIds"] = nextSchedule?.otherParticipantIds
  }
  // customerId

  // customerRelatedIds
  if(_.isNil(nextSchedule['customerRelatedIds']) || (!_.isArray(nextSchedule['customerRelatedIds']) && !_.isNil(nextSchedule['relatedCustomers']))) {
    nextSchedule['customerRelatedIds'] = CommonUtil.GET_ARRAY_VALUE_PROPERTIES(nextSchedule['relatedCustomers'], 'customerId');
  }
  // productTradingIds
  if(_.isNil(nextSchedule['productTradingIds']) || (!_.isArray(nextSchedule['productTradingIds']) && !_.isNil(nextSchedule['productTradings']))) {
    nextSchedule['productTradingIds'] = CommonUtil.GET_ARRAY_VALUE_PROPERTIES(nextSchedule['productTradings'], 'productTradingId');
  }
  // businessCardIds / otherParticipantIds
  if(_.isNil(nextSchedule['businessCardIds']) || (!_.isArray(nextSchedule['businessCardIds']) && !_.isNil(nextSchedule['businessCards']))) {
    nextSchedule['businessCardIds'] = CommonUtil.GET_ARRAY_VALUE_PROPERTIES(nextSchedule['businessCards'], 'businessCardId');
    nextSchedule['otherParticipantIds'] = CommonUtil.GET_ARRAY_VALUE_PROPERTIES(nextSchedule['businessCards'], 'businessCardId');
  }
  // milestoneIds
  if(_.isNil(nextSchedule['milestoneIds']) || (!_.isArray(nextSchedule['milestoneIds']) && !_.isNil(nextSchedule['milestones']))) {
    nextSchedule['milestoneIds'] = CommonUtil.GET_ARRAY_VALUE_PROPERTIES(nextSchedule['milestones'], 'milestoneId');
  }
  // taskIds
  if(_.isNil(nextSchedule['taskIds']) || (!_.isArray(nextSchedule['taskIds']) && !_.isNil(nextSchedule['tasks']))) {
    nextSchedule['taskIds'] = CommonUtil.GET_ARRAY_VALUE_PROPERTIES(nextSchedule['tasks'], 'taskId');
  }


  Object.keys(nextSchedule).forEach((item: string) => {
    if (!PARAMS_SCHEDULE.includes(item)) {
      delete nextSchedule[`${item}`]
    }
  })

  return nextSchedule;
}

/**
 * bulidFormData
 * @param activity
 * @param nextSchedule
 * @param dataProductTradings
 * @param files
 */
const bulidFormData = (activity, nextSchedule, scheduleFiles, dataProductTradings, files, isDraft?) => {
  const scheduleTypeId = nextSchedule
    ? nextSchedule.scheduleTypeId ||
      (nextSchedule.scheduleType && nextSchedule.scheduleType.scheduleTypeId)
    : null;
  if (nextSchedule && nextSchedule.productTradings && nextSchedule.productTradings.length > 0) {
    nextSchedule.productTradings.forEach(e => {
      delete e['productImagePath'];
      delete e['employeeIcon'];
    });
  }
  const convertData = CommonUtil.convertData({
    data: activity,
    nextSchedule: {
      schedule: bulidScheduleDataForm(nextSchedule) || {},
      files: scheduleFiles || []
    },
    dataProductTradings
  });
  if (files && files.length > 0) {
    const _temp = {};
    files.forEach(file => {
      const key = Object.keys(file)[0];
      const idx = _temp[CommonUtil.getFieldName(key)] ? _temp[CommonUtil.getFieldName(key)] : 0;
      convertData[`activityMapFiles[${CommonUtil.getFieldName(key)}][${idx}]`] = file[key];
      _temp[CommonUtil.getFieldName(key)] = idx + 1;
    });
  }
  if (nextSchedule) {
    const startDateUtc = moment.utc(
      CalenderViewMonthCommon.localToTimezoneOfConfig(nextSchedule['startDate'])
    );
    const endDateUtc = moment.utc(
      CalenderViewMonthCommon.localToTimezoneOfConfig(nextSchedule['endDate'])
    );

    const startFullDay = moment.utc(
      CalenderViewMonthCommon.roundDownDay(
        CalenderViewMonthCommon.localToTimezoneOfConfig(nextSchedule['startDate'])
      )
    );

    const endFullDay = moment.utc(
      CalenderViewMonthCommon.roundUpDay(
        CalenderViewMonthCommon.localToTimezoneOfConfig(nextSchedule['startDate'])
      )
    );

    if (convertData['nextSchedule']['schedule']['repeatEndDate']) {
      convertData['nextSchedule']['schedule']['repeatEndDate'] = NVL(
        CalenderViewMonthCommon.roundUpDay(moment.utc(nextSchedule['repeatEndDate'])).format(),
        moment.utc(CalenderViewMonthCommon.nowDate().toDate()).format('HH:mm:ss')
      );
    }

    convertData['nextSchedule']['schedule']['isFullDay'] = !!convertData['nextSchedule']['schedule']['isFullDay'];
    convertData['nextSchedule']['schedule']['scheduleTypeId'] = CommonUtil.convertData(
      scheduleTypeId
    );
    convertData['nextSchedule']['schedule']['startDay'] = NVL(
      !convertData['nextSchedule']['schedule']['isFullDay']
        ? startDateUtc.format('YYYY/MM/DD')
        : startFullDay.format('YYYY/MM/DD'),
      null
    );
    convertData['nextSchedule']['schedule']['endDay'] = NVL(
      !convertData['nextSchedule']['schedule']['isFullDay']
        ? endDateUtc.format('YYYY/MM/DD')
        : endFullDay.format('YYYY/MM/DD'),
      null
    );
    convertData['nextSchedule']['schedule']['startTime'] = NVL(
      !convertData['nextSchedule']['schedule']['isFullDay']
        ? startDateUtc.format('HH:mm')
        : startFullDay.format('HH:mm'),
      null
    );
    convertData['nextSchedule']['schedule']['endTime'] = NVL(
      !convertData['nextSchedule']['schedule']['isFullDay']
        ? endDateUtc.format('HH:mm')
        : endFullDay.format('HH:mm'),
      null
    );
    // delete convertData['nextSchedule']['schedule']['files'];

    if (!_.isNil(convertData.nextSchedule.schedule.participants)) {
      convertData['nextSchedule']['schedule']['participants'] = convertDataBeforeBuildForm(
        convertData['nextSchedule']['schedule']['participants'],
        'departments',
        'departmentIds',
        'departmentId'
      );
      convertData['nextSchedule']['schedule']['participants'] = convertDataBeforeBuildForm(
        convertData['nextSchedule']['schedule']['participants'],
        'employees',
        'employeeIds',
        'employeeId'
      );
      convertData['nextSchedule']['schedule']['participants'] = convertDataBeforeBuildForm(
        convertData['nextSchedule']['schedule']['participants'],
        'groups',
        'groupIds',
        'groupId'
      );
    }
    if (
      convertData['nextSchedule']['schedule'] &&
      convertData['nextSchedule']['schedule']['addressBelowPrefectures']
    ) {
      convertData['nextSchedule']['schedule']['address'] =
        convertData['nextSchedule']['schedule']['addressBelowPrefectures'];
    }
    if (!_.isArray(convertData['nextSchedule']['schedule']['taskIds'])) {
      convertData['nextSchedule']['schedule']['taskIds'] = [];
    }
    if (!_.isArray(convertData['nextSchedule']['schedule']['milestoneIds'])) {
      convertData['nextSchedule']['schedule']['milestoneIds'] = [];
    }

    if (!_.isNil(convertData.nextSchedule.schedule.sharers)) {
      convertData['nextSchedule']['schedule']['sharers'] = convertDataBeforeBuildForm(
        convertData['nextSchedule']['schedule']['sharers'],
        'departments',
        'departmentIds',
        'departmentId'
      );
      convertData['nextSchedule']['schedule']['sharers'] = convertDataBeforeBuildForm(
        convertData['nextSchedule']['schedule']['sharers'],
        'employees',
        'employeeIds',
        'employeeId'
      );
      convertData['nextSchedule']['schedule']['sharers'] = convertDataBeforeBuildForm(
        convertData['nextSchedule']['schedule']['sharers'],
        'groups',
        'groupIds',
        'groupId'
      );
    }
    if (
      !isDraft &&
      convertData['nextSchedule']['schedule'] &&
      convertData['nextSchedule']['schedule']['scheduleId'] &&
      convertData['nextSchedule']['schedule']['isRepeated']
    ) {
      convertData['nextSchedule']['schedule']['repeatCondition'] = {
        repeatType: convertData['nextSchedule']['schedule']['repeatType'],
        repeatCycle: convertData['nextSchedule']['schedule']['repeatCycle'] || 1,
        regularDayOfWeek: convertData['nextSchedule']['schedule']['regularDayOfWeek'],
        regularWeekOfMonth: convertData['nextSchedule']['schedule']['regularWeekOfMonth'],
        regularDayOfMonth: convertData['nextSchedule']['schedule']['regularDayOfMonth'],
        regularEndOfMonth: convertData['nextSchedule']['schedule']['regularEndOfMonth'],
        repeatEndType: convertData['nextSchedule']['schedule']['repeatEndType'],
        repeatEndDate: convertData['nextSchedule']['schedule']['repeatEndDate']
          ? moment
              .utc(
                CalenderViewMonthCommon.roundUpDay(
                  CalenderViewMonthCommon.localToTimezoneOfConfig(
                    moment(convertData['nextSchedule']['schedule']['repeatEndDate'])
                  )
                )
              )
              .format()
          : null,
        repeatNumber: convertData['nextSchedule']['schedule']['repeatNumber']
      };
      convertData['nextSchedule']['schedule']['repeatType'] &&
        delete convertData['nextSchedule']['schedule']['repeatType'];
      convertData['nextSchedule']['schedule']['repeatCycle'] &&
        delete convertData['nextSchedule']['schedule']['repeatCycle'];
      convertData['nextSchedule']['schedule']['regularDayOfWeek'] &&
        delete convertData['nextSchedule']['schedule']['regularDayOfWeek'];
      convertData['nextSchedule']['schedule']['regularWeekOfMonth'] &&
        delete convertData['nextSchedule']['schedule']['regularWeekOfMonth'];
      convertData['nextSchedule']['schedule']['regularDayOfMonth'] &&
        delete convertData['nextSchedule']['schedule']['regularDayOfMonth'];
      convertData['nextSchedule']['schedule']['regularEndOfMonth'] &&
        delete convertData['nextSchedule']['schedule']['regularEndOfMonth'];
      convertData['nextSchedule']['schedule']['repeatEndType'] &&
        delete convertData['nextSchedule']['schedule']['repeatEndType'];
      convertData['nextSchedule']['schedule']['repeatEndDate'] &&
        delete convertData['nextSchedule']['schedule']['repeatEndDate'];
      convertData['nextSchedule']['schedule']['repeatNumber'] &&
        delete convertData['nextSchedule']['schedule']['repeatNumber'];
    }

    delete convertData['nextSchedule']['schedule']['scheduleType'];
    delete convertData['nextSchedule']['schedule']['startDate'];
    delete convertData['nextSchedule']['schedule']['endDate'];
  }
  return CommonUtil.objectToFormData(convertData, '', []);
};

export const handleClearResponseData = () => {
  return { type: ACTION_TYPES.CLEAR_RESPONSE_DATA };
};

// export const toggleModalFormActivity = (flag: boolean) => ({
//   type: ACTION_TYPES.TOGGLE_MODAL_FORM_ACTIVITY,
//   payload: flag
// });

export const toggleConfirmPopup = (_flag: boolean, _item?: ConfirmPopupItem) => ({
  type: ACTION_TYPES.TOGGLE_CONFIRM_POPUP,
  payload: {
    flag: _flag,
    item: _item
  }
});

export const updateActivityFromSearch = (activityFormSearch: GetActivitiesForm) => ({
  type: ACTION_TYPES.UPDATE_ACTIVITY_FORM_SEARCH,
  payload: activityFormSearch
});

export const handleUpdateActivityFromSearch = (
  activityFormSearch: GetActivitiesForm
) => async dispatch => {
  await dispatch(updateActivityFromSearch(activityFormSearch));
};

/**
 * API getActivityLayout
 */
// const activityLayoutUrl = `/content/json/getActivityLayout.json`;
export const getActivityLayout = () => ({
  type: ACTION_TYPES.ACTIVITY_GET_ACTIVITY_LAYOUT,
  // payload: axios.get(`${activityLayoutUrl}`, { headers: { ['Content-Type']: 'application/json' } })
  payload: axios.post(`${apiUrl}/get-activity-layout`, {})
});

export const handleShowModalActivityForm = (flag: boolean) => {
  return { type: ACTION_TYPES.TOGGLE_MODAL_FORM_ACTIVITY, payload: flag };
};

export const handleShowModalActivityDetail = (flag: boolean) => {
  return { type: ACTION_TYPES.TOGGLE_MODAL_DETAIL_ACTIVITY, payload: flag };
};

export const toogleModalDetail = (flag: boolean) => async dispatch => {
  await dispatch(handleShowModalActivityDetail(flag));
};

export const onclickShowModalActivityForm = (flag: boolean) => async dispatch => {
  await dispatch(handleShowModalActivityForm(flag));
};

export const handleInitDataActivityLayout = () => async (dispatch, getState) => {
  await dispatch(getActivityLayout());
  if (getState().activityListReducerState.action === ActivityAction.Success) {
    dispatch(handleShowModalActivityForm(true));
  }
};

// getBusinessCardList-manhnh
// API base URL
export const getBusinessCardList = (param?: ActivityFormSeach) => ({
  type: ACTION_TYPES.GET_BUSINESS_CARD_LIST,
  payload: axios.post(`${apiUrlBusinessCard}/get-business-card-list`, {
    idOfList: null,
    mode: param.mode
  })
  // payload: axios.get(`/content/json/getBusinessCardList.json`, { headers: { ['Content-Type']: 'application/json' } })
});

export const handInitBusinessCartList = (param?: ActivityFormSeach) => async dispatch => {
  await dispatch(getBusinessCardList(param));
};

// API base URL
export const getCustomerList = (param?: ActivityFormSeach) => ({
  type: ACTION_TYPES.GET_CUSTOMER_LIST,
  payload: axios.post(`${apiUrlCustomer}/get-customer-list`, {
    isFavourite: true
  })
  // payload: axios.get(`/content/json/getCustomerList.json`, { headers: { ['Content-Type']: 'application/json' } })
});

export const handInitCustomerList = (param?: ActivityFormSeach) => async dispatch => {
  await dispatch(getCustomerList(param));
};

export const getActivities = (param?: GetActivitiesForm) => {
  return {
    type: ACTION_TYPES.GET_ACTIVITIES,
    // payload: axios.get(`/content/json/getActivities.json`, {
    //   headers: { ['Content-Type']: 'application/json' }
    // }) // fake data
    payload: axios.post(`${apiUrl}/get-activities`, {
      listBusinessCardId: param.listBusinessCardId || [],
      listCustomerId: param.listCustomerId || [],
      listProductTradingId: param.listProductTradingId || [],
      // productName: param.productName,
      searchLocal: param.searchLocal || '',
      searchConditions: param.searchConditions || [],
      filterConditions: param.filterConditions || [],
      isFirstLoad: param.isFirstLoad || null,
      selectedTargetType: param.selectedTargetType || 0,
      selectedTargetId: param.selectedTargetId || 0,
      orderBy: param.orderBy || [],
      offset: param.offset || 0,
      limit: param.limit || LIMIT,
      hasTimeline: param.hasTimeline || null,
      isUpdateListView: param.isUpdateListView
    })
  };
};

export const handleInitActivities = (pram?: GetActivitiesForm) => async dispatch => {
  await dispatch({ type: ACTION_TYPES.RESET_ACTIVITY_LIST_SCROLL });
  await dispatch(getActivities(pram));
};

export const resetDraftData = () => async dispatch => {
  await dispatch({ type: ACTION_TYPES.RESET_ACTIVITY_DRAFT });
};

export const handleGetActivities = (param?: GetActivitiesForm) => async dispatch => {
  await dispatch({ type: ACTION_TYPES.RESET_ACTIVITY_LIST_SCROLL });
  await dispatch(getActivities(param));
};

export const getLazyActivities = (param?: GetActivitiesForm) => {
  return {
    type: ACTION_TYPES.GET_LAZY_ACTIVITIES,
    // payload: axios.get(`/content/json/getActivities${param.isDraft || 0}.json`, { headers: { ['Content-Type']: 'application/json' } }) // fake data
    payload: axios.post(`${apiUrl}/get-activities`, {
      listBusinessCardId: param.listBusinessCardId,
      listCustomerId: param.listCustomerId,
      listProductTradingId: param.listProductTradingId,
      // productName: param.productName,
      searchLocal: param.searchLocal,
      searchConditions: param.searchConditions || [],
      filterConditions: param.filterConditions || [],
      isFirstLoad: param.isFirstLoad,
      selectedTargetType: param.selectedTargetType || 0,
      selectedTargetId: param.selectedTargetId || 0,
      orderBy: param.orderBy,
      offset: param.offset || 0,
      limit: param.limit,
      hasTimeline: param.hasTimeline
    })
  };
};

export const handleGetLazyActivities = (pram?: GetActivitiesForm) => async (dispatch, getState) => {
  const formData = pram || getState().activityListReducerState.activityFormSearch;
  await dispatch({ type: ACTION_TYPES.RESET_ACTIVITY_LIST_SCROLL });
  await dispatch(getLazyActivities(formData));
};

export const getDraftActivities = (pram?: GetActivitiesForm) => ({
  type: ACTION_TYPES.CHECK_DRAFT,
  payload: axios.get(`/content/json/getActivities${pram.isDraft || 0}.json`, {
    headers: { ['Content-Type']: 'application/json' }
  }) // fake data
  // payload: axios.post(
  //   `${activitiesApiUrl}`,
  //   { query: PARAM_GET_ACTIVITIES_LIST(pram) },
  //   { headers: { ['Content-Type']: 'application/json' } }
  // )
});

export const handleUpdateActivityInfo = (activityInfo: GetActivity) => ({
  type: ACTION_TYPES.UPDATE_ACTIVITY_INFO,
  payload: activityInfo
});

export const executeCreateNew = () => () => {
  handleInitDataActivityLayout();
  onclickShowModalActivityForm(true);
  return null;
};

export const executeRestoreData = () => () => {
  onclickShowModalActivityForm(true);
};

/**
 * onclickShowConfirmRestoreDraft
 */
export const onclickShowConfirmRestoreDraft = () => async (dispatch, getState) => {
  // getActivities cos isDraft = true
  await dispatch(
    getDraftActivities({ ...getState().activityListReducerState.activityFormSearch, isDraft: 2 })
  );
  // If has draft, show popup confirm
  if (getState().activityListReducerState.listDraftActivities.length > 0) {
    // await PopupConfirmRestoreDraft({ onConfirm: executeDraftCheck, onCancel: executeCreateNew });

    await PopupConfirmRestoreDraft({ onConfirm: executeRestoreData, onCancel: executeCreateNew });
  } else {
    executeCreateNew();
  }
};

export const getActivitiesDraft = (param?: GetActivitiesForm) => ({
  type: ACTION_TYPES.GET_ACTIVITIES_DRAFT,
  // payload: axios.get(`/content/json/getActivities3.json`, { headers: { ['Content-Type']: 'application/json' } }) // fake data
  payload: axios.post(`${apiUrl}/get-activity-drafts`, {
    searchConditions: param.searchConditions || [],
    filterConditions: param.filterConditions || [],
    orderBy: param.orderBy || [],
    offset: param.offset || 0,
    limit: param.limit || LIMIT
  })
});

/**
 * Call api delete activity
 * @param id
 */
export const onclickDelete = (id: number, isDraft?: boolean, fromEditRealMode? : boolean) => async (dispatch, getState) => {
  let path = '';
  let data = {};
  let type = ACTION_TYPES.ACTIVITY_DELETE;
  if (isDraft) {
    path = 'delete-activity-draft';
    data = {
      activityDraftId: id
    };
    type = ACTION_TYPES.ACTIVITY_DELETE_DRAFT;
  } else {
    path = 'delete-activities';
    data = { activityIds: [id] };
  }
  await dispatch({
    type,
    payload: axios.post(`${apiUrl}/${path}`, data)
  });
  if (getState().activityListReducerState.success) {
    await dispatch(toggleConfirmPopup(false));
    await dispatch(handleShowModalActivityDetail(false));
    setTimeout(() => {
      // dispatch(handleGetActivities(makeConditionSearchDefault()));
      dispatch(handleClearResponseData());
    }, 1500);

    if(isDraft && !fromEditRealMode) {
      const _param = {
        filterConditions: [],
        orderBy: [],
        limit: LIMIT,
        offset: 0
      }
      await dispatch(handleUpdateActivityFromSearch(_param));
      await dispatch(getActivitiesDraft(_param));
    } else if (fromEditRealMode){
      const _param = {
        ...getState().activityListReducerState.activityFormSearch,
        limit: LIMIT,
        offset: 0
      }
      await dispatch(handleGetActivities(_param));
    }
  }
};

export const discardDraft = (id: number, fromEditRealMode? : boolean) => async (dispatch, getState) => {
  await dispatch({
    type: ACTION_TYPES.ACTIVITY_DRAFT_DISCARD,
    payload: axios.post(`${apiUrl}/delete-activity-draft`, {
      activityDraftId: id
    })
  });
  if (getState().activityListReducerState.action === ActivityAction.Success) { 
    if (fromEditRealMode) {
      const _param = {
        ...getState().activityListReducerState.activityFormSearch,
        limit: LIMIT,
        offset: 0
      }
      await dispatch(handleGetActivities(_param));
    }
  }
};

export const getActivity = data => {
  return {
    type: ACTION_TYPES.ACTIVITY_GET_ACTIVITY,
    // payload: axios.get(`/content/json/getActivity.json`, { headers: { ['Content-Type']: 'application/json' } }) // fake data
    payload: axios.post(`${apiUrl}/get-activity`, data)
  };
};

export const getActivityDraft = (_activityDraftId, _activityId) => {
  return {
    type: ACTION_TYPES.ACTIVITY_GET_ACTIVITY_DRAFT,
    // payload: axios.get(`/content/json/getActivity.json`, { headers: { ['Content-Type']: 'application/json' } }) // fake data
    payload: axios.post(`${apiUrl}/get-activity-draft`, {
      activityDraftId: _activityDraftId,
      activityId: _activityId
    })
  };
};

export const onclickEdit = (activityId: number, isDraft?: boolean) => async (
  dispatch,
  getState
) => {
  const data = {
    activityId,
    isOnlyData: null,
    mode: 'edit',
    hasTimeline: false
  };
  await dispatch(getActivity(data));
  await dispatch(handleShowModalActivityForm(true));
};

export const updateActivityDetailIndex = (index: number) => async dispatch => {
  await dispatch({ type: ACTION_TYPES.UPDATE_ACTITVITY_DETAIL_INDEX, payload: index });
};

export const onclickDetail = (id: number, index?: number) => async (dispatch, getState) => {
  const data = {
    activityId: id,
    isOnlyData: null,
    mode: 'detail',
    hasTimeline: false
  };
  await dispatch(getActivity(data)); // edit -> detail
  if (getState().activityListReducerState.action === ActivityAction.Success) {
    await dispatch(handleShowModalActivityDetail(true));
    if (index !== null && index !== undefined) {
      await dispatch({ type: ACTION_TYPES.UPDATE_ACTITVITY_DETAIL_INDEX, payload: index });
    }
  }
};

export const createActivity = (
  data,
  nextSchedule,
  scheduleFiles,
  dataProductTradings,
  files
) => async (dispatch, getState) => {
  const path = data['activityId'] ? 'update-activity' : 'create-activity';
  const param = bulidFormData(data, nextSchedule, scheduleFiles, dataProductTradings, files);
  await dispatch({
    type: ACTION_TYPES.ACTIVITY_SAVE_ACTIVITY,
    payload: axios.post(`${apiUrl}/${path}`, param),
    meta: {
      isUpdate: data['activityId']
    }
  });
  await dispatch(resetDataForm());
};

export const saveData = (data, nextSchedule, scheduleFiles, dataProductTradings, files) => async (
  dispatch,
  getState
) => {
  /**
   * await call api save du lieu
   * neu thanh cong thi state.openModalActivity = false
   */
  await dispatch(createActivity(data, nextSchedule, scheduleFiles, dataProductTradings, files));
  if (getState().activityListReducerState.success) {
    // save success
    handleUpdateActivityInfo({ activities: null });
    setTimeout(() => {
      dispatch(handleShowModalActivityForm(false));
      dispatch(handleClearResponseData());
      dispatch(toggleConfirmPopup(false));
    }, 1500);

    //  await dispatch(handleShowModalActivityForm(false));
    // await dispatch(handleClearResponseData());
    // getActivities();
  }
};

export const getProductSuggestions = () => ({
  type: ACTION_TYPES.GET_PRODUCT_SUGGESTION,
  payload: axios.get(`/content/json/getProductSuggestions.json`, {
    headers: { ['Content-Type']: 'application/json' }
  }) // fake data

  // payload: axios.post(
  //   `${apiSalesUrl}`,
  //   {
  //     query: ``
  //   },
  //   { headers: { ['Content-Type']: 'application/json' } }
  // )
});

/**
 * togglePopupSearchCondition
 */
export const togglePopupSearchCondition = () => ({
  type: ACTION_TYPES.TOGGLE_POPUP_SEARCH_CONDITION
});
export const handleTogglePopupSearchCondition = () => async dispatch => {
  await dispatch(togglePopupSearchCondition());
};

export const handleGetProductSuggestions = () => async dispatch => {
  await dispatch(getProductSuggestions());
};

export const handleGetActivityHistory = (
  _activityId: number,
  _offset?: number,
  _limit?: number,
  _orderBy?: []
) => async dispatch => {
  await dispatch({
    type: ACTION_TYPES.GET_ACTIVITY_HISTORY,
    // payload: axios.get(`/content/json/getActivityHistory.json`, { headers: { ['Content-Type']: 'application/json' } }) // fake data
    payload: axios.post(`${apiUrl}/get-change-histories`, {
      activityId: _activityId,
      offset: _offset || 0,
      limit: _limit || LIMIT,
      orderBy: _orderBy
    })
  });
};

export const handleGetLazyActivityHistory = (
  _activityId: number,
  _offset?: number,
  _limit?: number,
  _orderBy?: []
) => async dispatch => {
  await dispatch({
    type: ACTION_TYPES.GET_LAZY_ACTIVITY_HISTORY,
    // payload: axios.get(`/content/json/getActivityHistory.json`, { headers: { ['Content-Type']: 'application/json' } }) // fake data
    payload: axios.post(`${apiUrl}/get-change-histories`, {
      activityId: _activityId,
      offset: _offset || 0,
      limit: _limit || LIMIT,
      orderBy: _orderBy
    })
  });
};

export const handleDownloadActivities = (listActivities: ActivityInfoType[]) => async dispatch => {
  await dispatch({
    type: ACTION_TYPES.DOWNLOAD_ACTIVITY,
    payload: axios.post(`${apiUrl}/download-activities`, {
      activityIds: CommonUtil.GET_ARRAY_VALUE_PROPERTIES(listActivities, 'activityId')
      // activityIds: [1, 2, 3, 4]
    })
  });
};

export const handleGetList = _mode => async dispatch => {
  await dispatch({
    type: ACTION_TYPES.GET_LIST,
    // payload: axios.get(`/content/json/getList.json`, {
    //   headers: { ['Content-Type']: 'application/json' }
    // })
    payload: axios.post(`${apiUrlSales}/get-list`, {
      mode: _mode
    })
  });
};

export const handleGetProductTradings = (
  _searchConditions: any[],
  customerIdFilters?: any[],
  isFinish?: boolean
) => async dispatch => {
  await dispatch({
    type: ACTION_TYPES.SALES_GET_PRODUCT_TRADINGS,
    // payload: axios.get(`/content/json/getProductTradings.json`, { headers: { ['Content-Type']: 'application/json' } })
    payload: axios.post(`${apiUrlSales}/get-product-tradings`, {
      selectedTargetId: 0,
      isOnlyData: true,
      customerIdFilters: customerIdFilters || [],
      searchConditions: _searchConditions
      // isFinish
    })
  });
};

export const handleGetScenario = id => async dispatch => {
  await dispatch({
    type: ACTION_TYPES.GET_SCENARIO,
    // payload: axios.get(`/content/json/getScenario.json`, { headers: { ['Content-Type']: 'application/json' } })
    payload: axios.post(`${apiUrlCustomer}/get-scenario`, { customerId: id })
  });
};

export const handleShowDetail = (
  _detailObjectId: number,
  _detailType: number,
  _idCaller: string,
  _isFromModal?: boolean
) => async dispatch => {
  await dispatch({
    type: ACTION_TYPES.SHOW_DETAIL,
    payload: {
      detailObjectId: _detailObjectId,
      detailType: _detailType,
      idCaller: _idCaller,
      isFromModal: _isFromModal
    }
  });
};

// export const handleRegisterDisplayedIds = (
//   _detailObjectId: number,
//   _detailType: number
// ) => async dispatch => {
//   await dispatch({
//     type: ACTION_TYPES.SHOW_DETAIL_REGISTERED,
//     payload: { detailObjectId: _detailObjectId, detailType: _detailType }
//   });
// };

// export const handleDeregisterDisplayedIds = (
//   _detailObjectId: number,
//   _detailType: number
// ) => async dispatch => {
//   await dispatch({
//     type: ACTION_TYPES.SHOW_DETAIL_DEREGISTERED,
//     payload: { detailObjectId: _detailObjectId, detailType: _detailType }
//   });
// };

export const changeScreenMode = (isEdit: boolean) => ({
  type: isEdit ? ACTION_TYPES.CHANGE_TO_EDIT : ACTION_TYPES.CHANGE_TO_DISPLAY
});

const convertFieldLabel = (fields: any[]) => {
  const listField = [];
  if (!fields) {
    return listField;
  }
  fields.forEach(e => {
    const obj = _.cloneDeep(e);
    if (!_.isString(obj.fieldLabel)) {
      obj.fieldLabel = JSON.stringify(obj.fieldLabel);
    }
    if (_.has(obj, 'fieldItems') && _.isArray(obj.fieldItems)) {
      obj.fieldItems.forEach((item, idx) => {
        if (_.has(item, 'itemLabel') && !_.isString(item.itemLabel)) {
          obj.fieldItems[idx].itemLabel = JSON.stringify(item.itemLabel);
        }
      });
    }
    if (
      _.toString(obj.fieldType) === DEFINE_FIELD_TYPE.LOOKUP &&
      obj.lookupData &&
      obj.lookupData.itemReflect
    ) {
      obj.lookupData.itemReflect.forEach((item, idx) => {
        if (_.has(item, 'fieldLabel') && !_.isString(item.fieldLabel)) {
          obj.lookupData.itemReflect[idx].itemLabel = JSON.stringify(item.fieldLabel);
        }
      });
    }
    listField.push(obj);
  });
  return listField;
};

export const updateCustomFieldInfo = (
  fieldBelong,
  deletedFields,
  fields,
  tabs,
  deletedFieldsTab,
  fieldsTab
) => async dispatch => {
  await dispatch({
    type: ACTION_TYPES.ACTIVITY_UPDATE_CUSTOM_FIELD_INFO,
    payload: axios.post(
      commonsApiUrl + '/update-custom-fields-info',
      {
        fieldBelong,
        deletedFields,
        fields: convertFieldLabel(fields),
        tabs,
        deletedFieldsTab,
        fieldsTab
      },
      { headers: { ['Content-Type']: 'application/json' } }
    ),
    meta: {
      fieldBelong
    }
  });
};

export const handleUpdateCustomFieldInfo = (
  fieldBelong,
  deleteFields,
  fields,
  tabs,
  deleteFieldsTab,
  fieldsTab
) => async dispatch => {
  if (fieldBelong != null) {
    await dispatch(
      updateCustomFieldInfo(fieldBelong, deleteFields, fields, tabs, deleteFieldsTab, fieldsTab)
    );
  }
};

export const handleUpdateMultiCustomFieldInfo = (
  fieldBelong: any[],
  deleteFields: any[],
  fields: any[],
  tabs: any[],
  deleteFieldsTab: any[],
  fieldsTab: any[]
) => async (dispatch, getState) => {
  if (
    (deleteFields && deleteFields[0].length > 0) ||
    (fields && fields[0].length > 0) ||
    (tabs && tabs[0].length > 0)
  ) {
    await dispatch(
      handleUpdateCustomFieldInfo(fieldBelong[0], deleteFields[0], fields[0], tabs[0], null, null)
    );
    if (getState().activityListReducerState.action === ActivityAction.Success) {
      if ((deleteFields && deleteFields[1].length > 0) || (fields && fields[1].length > 0)) {
        await dispatch(
          handleUpdateCustomFieldInfo(fieldBelong[1], deleteFields[1], fields[1], null, null, null)
        );
      }
    }
  } else {
    if ((deleteFields && deleteFields[1].length > 0) || (fields && fields[1].length > 0)) {
      await dispatch(
        handleUpdateCustomFieldInfo(fieldBelong[1], deleteFields[1], fields[1], null, null, null)
      );
    }
  }
};

export const handleReorderField = (dragIndex, dropIndex) => async (dispatch, getState) => {
  const { fieldInfos } = getState().employeeList;
  const objectFieldInfos = JSON.parse(JSON.stringify(fieldInfos));

  if (
    objectFieldInfos &&
    objectFieldInfos.fieldInfoPersonals &&
    objectFieldInfos.fieldInfoPersonals.length > 0
  ) {
    const tempObject = objectFieldInfos.fieldInfoPersonals.splice(
      dragIndex,
      1,
      objectFieldInfos.fieldInfoPersonals[dropIndex]
    )[0]; // get the item from the array
    objectFieldInfos.fieldInfoPersonals.splice(dropIndex, 1, tempObject);
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
    await sleep(1000);
  }
};

export const getCustomers = (_selectedTargetId: number) => ({
  type: ACTION_TYPES.GET_CUSTOMERS,
  // payload: axios.get(`/content/json/getCustomers.json`, { headers: { ['Content-Type']: 'application/json' } })
  payload: axios.post(`${apiUrlCustomer}/get-customers`, {
    selectedTargetId: _selectedTargetId,
    selectedTargetType: 2
  })
});

export const handleGetCustomers = (_selectedTargetId: number) => async (dispatch, getState) => {
  await dispatch(getCustomers(_selectedTargetId));
  if (getState().activityListReducerState.action === ActivityAction.Success) {
    const lst = CommonUtil.GET_ARRAY_VALUE_PROPERTIES(
      getState().activityListReducerState.customers,
      'customerId'
    ) as [];
    const param: GetActivitiesForm = {
      listCustomerId: lst && lst.length > 0 ? lst : [-1],
      selectedTargetType: 3,
      selectedTargetId: _selectedTargetId,
      isUpdateListView: true
    };
    await dispatch(getActivities(param));
    await dispatch(updateActivityFromSearch(param));
  }
};

export const getBusinessCards = (_selectedTargetId: number) => ({
  type: ACTION_TYPES.GET_BUSINESS_CARDS,
  // payload: axios.get(`/content/json/getBusinessCards.json`, { headers: { ['Content-Type']: 'application/json' } })
  payload: axios.post(`${apiUrlBusinessCard}/get-business-cards`, {
    selectedTargetId: _selectedTargetId,
    selectedTargetType: 2
  })
});

export const handleGetBusinessCards = (_selectedTargetId: number) => async (dispatch, getState) => {
  await dispatch(getBusinessCards(_selectedTargetId));
  if (getState().activityListReducerState.action === ActivityAction.Success) {
    const lst = CommonUtil.GET_ARRAY_VALUE_PROPERTIES(
      getState().activityListReducerState.businessCards,
      'businessCardId'
    ) as [];
    const param: GetActivitiesForm = {
      listBusinessCardId: lst && lst.length > 0 ? lst : [-1],
      selectedTargetType: 4,
      selectedTargetId: _selectedTargetId,
      isUpdateListView: true
    };
    await dispatch(getActivities(param));
    await dispatch(updateActivityFromSearch(param));
  }
};

export const getProductTradings = (_selectedTargetId: number) => ({
  type: ACTION_TYPES.GET_PRODUCT_TRADINGS,
  // payload: axios.get(`/content/json/getProductTradings.json`, { headers: { ['Content-Type']: 'application/json' } })
  payload: axios.post(`${apiUrlSales}/get-product-tradings`, {
    selectedTargetId: _selectedTargetId,
    selectedTargetType: 2
  })
});

export const handleListGetProductTradings = (_selectedTargetId: number) => async (
  dispatch,
  getState
) => {
  await dispatch(getProductTradings(_selectedTargetId));
  if (getState().activityListReducerState.action === ActivityAction.Success) {
    const lst = CommonUtil.GET_ARRAY_VALUE_PROPERTIES(
      getState().activityListReducerState.productTradings,
      'productTradingId'
    ) as [];
    const param: GetActivitiesForm = {
      listProductTradingId: lst && lst.length > 0 ? lst : [-1],
      selectedTargetType: 5,
      selectedTargetId: _selectedTargetId,
      isUpdateListView: true
    };
    await dispatch(getActivities(param));
    await dispatch(updateActivityFromSearch(param));
  }
};

export const saveActivivityDraft = (
  data,
  nextSchedule,
  fileSchedule,
  dataProductTradings,
  files
) => {
  return {
    type: ACTION_TYPES.SAVE_ACTIVITY_DRAFT,
    payload: axios.post(
      `${apiUrl}/create-activity-draft`,
      bulidFormData(data, nextSchedule, fileSchedule, dataProductTradings, files, true),
      {
        headers: { 'Content-Type': 'multipart/form-data' }
      }
    )
  };
};

export const saveActivivityDraftManual = (
  data,
  nextSchedule,
  fileSchedule,
  dataProductTradings,
  files
) => {
  return {
    type: ACTION_TYPES.SAVE_ACTIVITY_DRAFT_MANUAL,
    payload: axios.post(
      `${apiUrl}/create-activity-draft`,
      bulidFormData(data, nextSchedule, fileSchedule, dataProductTradings, files, true),
      {
        headers: { 'Content-Type': 'multipart/form-data' }
      }
    )
  };
};

export const getLazyActivitiesDraft = (param?: GetActivitiesForm) => ({
  type: ACTION_TYPES.GET_LAZY_ACTIVITIES_DRAFT,
  // payload: axios.get(`/content/json/getActivities3.json`, { headers: { ['Content-Type']: 'application/json' } }) // fake data
  payload: axios.post(`${apiUrl}/get-activity-drafts`, {
    searchConditions: param.searchConditions || [],
    filterConditions: param.filterConditions || [],
    orderBy: param.orderBy || [],
    offset: param.offset || 0,
    limit: param.limit || LIMIT
  })
});

export const resetScroll = () => async dispatch => {
  await dispatch({ type: ACTION_TYPES.RESET_ACTIVITY_LIST_SCROLL });
};

export const getCustomer = (customerId: number) => async dispatch => {
  await dispatch({
    type: ACTION_TYPES.GET_CUSTOMER,
    // payload: axios.get(`/content/json/getProductTradings.json`, { headers: { ['Content-Type']: 'application/json' } })
    payload: axios.post(`${apiUrlCustomer}/get-customer`, {
      mode: 'edit',
      customerId
    })
  });
};

export const clearShowDetail = () => async dispatch => {
  await dispatch({ type: ACTION_TYPES.CLEAR_SHOW_DETAIL });
};

export const handleGetDataActivity = (
  param,
  activityActionType,
  activityDraftId?: number
) => async dispatch => {
  if (activityActionType === ACTIVITY_ACTION_TYPES.CREATE) {
    await dispatch(getActivityLayout());
  } else {
    if (!_.isNil(activityDraftId)) {
      await dispatch(getActivityDraft(activityDraftId, null));
    } else {
      await dispatch(getActivity(param));
    }
    // await dispatch(getActivity(param, false));
  }
};

export const turnModeEditToDetail = (isEditToDetail: boolean) => async dispatch => {
  await dispatch({ type: ACTION_TYPES.IS_EDIT_TO_DETAIL, payload: isEditToDetail });
};

export const getActivityDetail = id => async dispatch => {
  const data = {
    activityId: id,
    isOnlyData: null,
    mode: 'detail',
    hasTimeline: false
  };
  await dispatch({
    type: ACTION_TYPES.ACTIVITY_GET_ACTIVITY_DETAIL,
    payload: axios.post(`${apiUrl}/get-activity`, data)
    // payload: axios.get(`/content/json/getActivity.json`, {
    //   headers: { ['Content-Type']: 'application/json' }
    // })
  });
};

export const getCustomersByIds = (customerIds: any[]) => async dispatch => {
  await dispatch({
    type: ACTION_TYPES.GET_CUSTOMERS_BY_IDS,
    // payload: axios.get(`/content/json/getProductTradings.json`, { headers: { ['Content-Type']: 'application/json' } })
    payload: axios.post(`${apiUrlCustomer}/get-customers-by-ids`, {
      customerIds
    })
  });
};

export const getMilestonesByIds = (milestoneIds: any[]) => async dispatch => {
  await dispatch({
    type: ACTION_TYPES.GET_MILESTONES_BY_IDS,
    payload: axios.post(`${apiUrlSchedule}/get-milestones-by-ids`, {
      milestoneIds
    })
  });
};

export const getSchedulesByIds = (scheduleIds: any[]) => async dispatch => {
  await dispatch({
    type: ACTION_TYPES.GET_SCHEDULES_BY_IDS,
    payload: axios.post(`${apiUrlSchedule}/get-schedules-by-ids`, {
      scheduleIds
    })
  });
};

export const getTasksByIds = (taskIds: any[]) => async dispatch => {
  await dispatch({
    type: ACTION_TYPES.GET_TASKS_BY_IDS,
    payload: axios.post(`${apiUrlSchedule}/get-tasks-by-ids`, {
      taskIds
    })
  });
};

export const clearMessage = () => async dispatch => {
  await dispatch({ type: ACTION_TYPES.CLEAR_MESSAGE });
};
