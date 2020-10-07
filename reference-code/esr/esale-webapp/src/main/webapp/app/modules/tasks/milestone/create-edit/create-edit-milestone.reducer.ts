import axios from 'axios';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { API_CONFIG, API_CONTEXT_PATH, ScreenMode } from 'app/config/constants';
import { MILES_ACTION_TYPES } from 'app/modules/tasks/milestone/constants';
import { parseErrorRespose } from 'app/shared/util/string-utils';
import { handleGetTaskWorkGlobalTools } from 'app/modules/global/task/global-control-task.reducer';
import { STATUS_TASK } from 'app/modules/tasks/constants';
import moment from 'moment';
import { STATUS_MILESTONE } from 'app/modules/global/constants';

export const ACTION_TYPES = {
  GET_MILESTONE: 'milestone/GET_MILESTONE',
  CREATE_MILESTONE: 'milestone/CREATE_MILESTONE',
  UPDATE_MILESTONE: 'milestone/UPDATE_MILESTONE',
  MILESTONE_RESET: 'milestone/RESET_MILESTONE',
  SET_MILESTONE_COPY: 'milestone/SET_MILESTONE_COPY',
  GET_CUSTOMERS_BY_IDS: 'task/GET_CUSTOMERS_BY_IDS',
  MILESTONE_CLOSE_ALL_WINDOWS_OPENED: 'milestone/MILESTONE_CLOSE_ALL_WINDOWS_OPENED'
};

export enum MilestoneAction {
  None,
  Request,
  Error,
  Success,
  CreateSucess,
  UpdateSucess,
  CreateMilestoneFailure,
  UpdateMilestoneFailure,
  GetCustomersSuccess
}

const initialState = {
  milestoneName: null,
  isDone: null,
  memo: null,
  endDate: null,
  listTask: null,
  getmilestoneInfo: null,
  errorItems: null,
  action: MilestoneAction.None,
  screenMode: ScreenMode.DISPLAY,
  errorMessage: null,
  successMessage: null,
  isUpdateFailure: false,
  createdDate: new Date(),
  createdUser: null,
  updatedDate: new Date(),
  updatedUser: null,
  isPublic: null,
  milestoneId: null,
  customers: null,
  isCloseAllWindownOpened: false
};

export type MilestoneState = Readonly<typeof initialState>;

/**
 * parse response from create subtask
 * @param res
 */
const parseCreateMileStoneResponse = res => {
  const errorItems = [];
  if (res.errors && res.errors.length > 0) {
    if (
      res.errors[0].extensions &&
      res.errors[0].extensions.errors &&
      res.errors[0].extensions.errors.length > 0
    ) {
      res.errors[0].extensions.errors.forEach(e => {
        errorItems.push(e);
      });
    }
  }
  let errorMsg = '';
  if (res.errors && res.errors.length > 0) {
    errorMsg = res.errors[0].message;
  }
  return { errorMsg, errorItems };
};

export default (state: MilestoneState = initialState, action): MilestoneState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.GET_MILESTONE):
    case REQUEST(ACTION_TYPES.CREATE_MILESTONE):
    case REQUEST(ACTION_TYPES.UPDATE_MILESTONE):
    case REQUEST(ACTION_TYPES.GET_CUSTOMERS_BY_IDS):
      return {
        ...state,
        action: MilestoneAction.Request,
        errorMessage: null,
        errorItems: null,
        successMessage: null
      };
    case FAILURE(ACTION_TYPES.GET_CUSTOMERS_BY_IDS):
    case FAILURE(ACTION_TYPES.GET_MILESTONE): {
      return {
        ...state,
        action: MilestoneAction.Error,
        errorMessage: parseErrorRespose(action.payload),
        errorItems: parseErrorRespose(action.payload),
        successMessage: null
      };
    }
    case FAILURE(ACTION_TYPES.CREATE_MILESTONE):
      return {
        ...state,
        errorItems: parseErrorRespose(action.payload),
        action: MilestoneAction.CreateMilestoneFailure
      };
    case FAILURE(ACTION_TYPES.UPDATE_MILESTONE):
      return {
        ...state,
        errorItems: parseErrorRespose(action.payload),
        action: MilestoneAction.UpdateMilestoneFailure
      };
    case SUCCESS(ACTION_TYPES.GET_MILESTONE): {
      const milestone = action.payload.data;
      return {
        ...state,
        milestoneName: milestone.milestoneName,
        isDone: milestone.isDone,
        memo: milestone.memo,
        endDate: milestone.endDate,
        listTask: milestone.listTask,
        createdDate: milestone.createdDate,
        updatedDate: milestone.updatedDate,
        createdUser: milestone.createdUserName,
        updatedUser: milestone.updatedUserName,
        isPublic: milestone.isPublic,
        action: MilestoneAction.Success,
        milestoneId: milestone.milestoneId,
        successMessage: null,
        customers: milestone.customer
      };
    }
    case SUCCESS(ACTION_TYPES.CREATE_MILESTONE): {
      parseCreateMileStoneResponse(action.payload.data);
      return {
        ...state,
        milestoneId: action.payload.data,
        successMessage: 'INF_COM_0003',
        action: MilestoneAction.CreateSucess
      };
    }
    case SUCCESS(ACTION_TYPES.UPDATE_MILESTONE): {
      parseCreateMileStoneResponse(action.payload.data);
      return {
        ...state,
        milestoneId: action.payload.data,
        successMessage: 'INF_COM_0004',
        action: MilestoneAction.UpdateSucess
      };
    }
    case SUCCESS(ACTION_TYPES.GET_CUSTOMERS_BY_IDS): {
      return {
        ...state,
        errorMessage: null,
        errorItems: null,
        action: MilestoneAction.GetCustomersSuccess,
        customers: action.payload.data.customers
      };
    }
    case ACTION_TYPES.SET_MILESTONE_COPY: {
      return {
        ...state,
        milestoneName: action.payload.milestoneName,
        isDone: action.payload.isDone,
        memo: action.payload.memo,
        endDate: action.payload.endDate,
        listTask: action.payload.listTask,
        customers: action.payload.customers,
        createdDate: new Date(),
        updatedDate: new Date(),
        createdUser: '',
        updatedUser: '',
        isPublic: action.payload.isPublic,
        action: MilestoneAction.Request,
        errorMessage: null,
        errorItems: null,
        successMessage: null
      };
    }
    case ACTION_TYPES.MILESTONE_RESET:
      return {
        ...initialState
      };
    case ACTION_TYPES.MILESTONE_CLOSE_ALL_WINDOWS_OPENED:
      return {
        ...initialState,
        isCloseAllWindownOpened: true
      };
    default:
      return state;
  }
};

const schedulesApiUrl = API_CONTEXT_PATH + '/' + API_CONFIG.SCHEDULES_SERVICE_PATH;
const customerApiUrl = API_CONTEXT_PATH + '/' + API_CONFIG.CUSTOMER_SERVICE_PATH;

/**
 * getMilestone
 *
 * @param milestoneId
 */
export const getMilestoneInfo = milestoneId => ({
  type: ACTION_TYPES.GET_MILESTONE,
  payload: axios.post(
    `${schedulesApiUrl}/get-milestone`,
    { milestoneId },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

/**
 * create Milestone
 *
 * @param milestoneId
 * @param milestoneName
 * @param memo
 * @param endDate
 * @param isDone
 */
const createMilestone = params => ({
  type: ACTION_TYPES.CREATE_MILESTONE,
  payload: axios.post(`${schedulesApiUrl}/create-milestone`, params, {
    headers: { ['Content-Type']: 'application/json' }
  })
});

/**
 * Update Milestone
 *
 * @param milestoneId
 * @param milestoneName
 * @param memo
 * @param endDate
 * @param isDone
 */
export const updateMilestones = params => ({
  type: ACTION_TYPES.UPDATE_MILESTONE,
  payload: axios.post(`${schedulesApiUrl}/update-milestone`, params, {
    headers: { ['Content-Type']: 'application/json' }
  })
});

/**
 * set info Milestone detail copy to store
 */
export const setMileStoneCopyToStore = params => ({
  type: ACTION_TYPES.SET_MILESTONE_COPY,
  payload: {
    milestoneName: params.milestoneName,
    isDone: params.isDone,
    memo: params.memo,
    endDate: params.endDate,
    listTask: params.listTask,
    isPublic: params.isPublic,
    customers: params.customerssetMileStoneCopy
  }
});

/**
 * Set Milestone detail copy to store
 */
export const setMileStoneCopy = params => async (dispatch, getState) => {
  await dispatch(setMileStoneCopyToStore(params));
};

export const getMilestone = milestoneId => async (dispatch, getState) => {
  await dispatch(getMilestoneInfo(milestoneId));
};

export const handleSubmitMilestoneData = (params, milestoneModalMode) => async dispatch => {
  if (milestoneModalMode === MILES_ACTION_TYPES.CREATE) {
    await dispatch(createMilestone(params));
  } else if (milestoneModalMode === MILES_ACTION_TYPES.UPDATE) {
    await dispatch(updateMilestones(params));
  }
  await dispatch(
    handleGetTaskWorkGlobalTools(
      [STATUS_TASK.NOT_STARTED, STATUS_TASK.WORKING],
      STATUS_MILESTONE.TODO,
      moment()
        .utcOffset(0)
        .set({ hour: 0, minute: 0, second: 0 })
        .toDate(),
      moment()
        .utcOffset(0)
        .set({ hour: 23, minute: 59, second: 59 })
        .add(2, 'days')
        .toDate()
    )
  );
  await dispatch(
    handleGetTaskWorkGlobalTools(
      [STATUS_TASK.COMPLETED],
      STATUS_MILESTONE.FINISH,
      moment()
        .utcOffset(0)
        .set({ hour: 0, minute: 0, second: 0 })
        .subtract(2, 'days')
        .toDate(),
      moment()
        .utcOffset(0)
        .set({ hour: 23, minute: 59, second: 59 })
        .toDate()
    )
  );
};

/**
 * reset state
 */
export const reset = () => ({
  type: ACTION_TYPES.MILESTONE_RESET
});

/**
 * Close all createEditMilestone is opened
 */
export const closeAllMilestoneCreateEditModalOpened = () => ({
  type: ACTION_TYPES.MILESTONE_CLOSE_ALL_WINDOWS_OPENED
});

/**
 * Get customers by ids
 * @param params
 */
const getCustomersIds = customerIds => ({
  type: ACTION_TYPES.GET_CUSTOMERS_BY_IDS,
  payload: axios.post(
    `${customerApiUrl}/get-customers-by-ids`,
    { customerIds },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

/**
 * Handle get customers by ids
 * @param customerIds
 */
export const handleGetCustomersByIds = customerIds => async dispatch => {
  await dispatch(getCustomersIds(customerIds));
};
