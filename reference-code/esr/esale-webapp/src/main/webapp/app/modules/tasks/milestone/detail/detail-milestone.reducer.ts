import axios from 'axios';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { API_CONFIG, API_CONTEXT_PATH, ScreenMode } from 'app/config/constants';
import { parseErrorRespose } from 'app/shared/util/string-utils';
import { handleGetTaskWorkGlobalTools } from 'app/modules/global/task/global-control-task.reducer';
import { STATUS_TASK } from 'app/modules/tasks/constants';
import moment from 'moment';
import { STATUS_MILESTONE } from 'app/modules/global/constants';

export const ACTION_TYPES = {
  UPDATE_STATUS_MILESTONE: 'updateMilestone/MILESTONE_UPDATE_STATUS_MILESTONE',
  DELETE_MILESTONE: 'updateMilestone/MILESTONE_DELETE_MILESTONE',
  MILESTONE_DETAIL_RESET: 'updateMilestone/RESET_DETAIL_MILESTONE',
  GET_MILESTONE_DETAIL: 'updateMilestone/GET_MILESTONE_DETAIL',
  MILESTONE_DETAIL_CLOSE_ALL_WINDOWS_OPENED:
    'updateMilestone/MILESTONE_DETAIL_CLOSE_ALL_WINDOWS_OPENED'
};

export enum DetailMilestoneAction {
  None,
  RequestList,
  ErrorList,
  DoneList,
  UpdateSuccess,
  UpdateFailure,
  DeleteFailure,
  DeleteSuccess
}

const initialState = {
  action: DetailMilestoneAction.None,
  screenMode: ScreenMode.DISPLAY,
  isLoading: false,
  errorMessage: null,
  successMessage: null,
  milestone: null,
  isCloseAllWindownOpened: false
};

export type DetailMilestoneState = Readonly<typeof initialState>;

export default (state: DetailMilestoneState = initialState, action): DetailMilestoneState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.UPDATE_STATUS_MILESTONE):
    case REQUEST(ACTION_TYPES.DELETE_MILESTONE):
    case REQUEST(ACTION_TYPES.GET_MILESTONE_DETAIL):
      return {
        ...state,
        action: DetailMilestoneAction.RequestList
      };
    case FAILURE(ACTION_TYPES.UPDATE_STATUS_MILESTONE):
    case FAILURE(ACTION_TYPES.DELETE_MILESTONE):
    case FAILURE(ACTION_TYPES.GET_MILESTONE_DETAIL): {
      const res = parseErrorRespose(action.payload);
      return {
        ...state,
        action: DetailMilestoneAction.ErrorList,
        errorMessage: res
      };
    }
    case SUCCESS(ACTION_TYPES.UPDATE_STATUS_MILESTONE):
      return {
        ...state,
        successMessage: 'INF_COM_0004',
        action: DetailMilestoneAction.UpdateSuccess
      };
    case SUCCESS(ACTION_TYPES.DELETE_MILESTONE):
      return {
        ...state,
        successMessage: 'INF_COM_0005',
        action: DetailMilestoneAction.DeleteSuccess
      };
    case SUCCESS(ACTION_TYPES.GET_MILESTONE_DETAIL): {
      return {
        ...state,
        milestone: action.payload.data
      };
    }
    case ACTION_TYPES.MILESTONE_DETAIL_RESET:
      return {
        ...initialState
      };
    case ACTION_TYPES.MILESTONE_DETAIL_CLOSE_ALL_WINDOWS_OPENED:
      return {
        ...initialState,
        isCloseAllWindownOpened: true
      };
    default:
      return state;
  }
};

const schedulesApiUrl = API_CONTEXT_PATH + '/' + API_CONFIG.SCHEDULES_SERVICE_PATH;

/**
 * getMilestone
 *
 * @param milestoneId
 */
export const getMilestoneDetail = milestoneId => ({
  type: ACTION_TYPES.GET_MILESTONE_DETAIL,
  payload: axios.post(
    `${schedulesApiUrl}/get-milestone`,
    { milestoneId },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

/**
 * Delete Milestone
 *
 * @param milestoneId
 */
export const deleteMilestone = milestoneId => async dispatch => {
  await dispatch({
    type: ACTION_TYPES.DELETE_MILESTONE,
    payload: axios.post(
      `${schedulesApiUrl}/delete-milestone`,
      { milestoneId },
      { headers: { ['Content-Type']: 'application/json' } }
    )
  });
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
 * Update status Milestone
 *
 * @param milestoneId
 * @param isdone
 * @param updateFlg
 */
export const updateStatusMilestone = (
  milestoneId,
  statusMilestoneId,
  updateFlg
) => async dispatch => {
  await dispatch({
    type: ACTION_TYPES.UPDATE_STATUS_MILESTONE,
    payload: axios.post(
      `${schedulesApiUrl}/update-milestone-status`,
      { milestoneId, statusMilestoneId, updateFlg },
      { headers: { ['Content-Type']: 'application/json' } }
    )
  });
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
  type: ACTION_TYPES.MILESTONE_DETAIL_RESET
});

/**
 * Close all Detail Milestone
 */
export const closeAllDetailMilestoneModalOpened = () => ({
  type: ACTION_TYPES.MILESTONE_DETAIL_CLOSE_ALL_WINDOWS_OPENED
});
