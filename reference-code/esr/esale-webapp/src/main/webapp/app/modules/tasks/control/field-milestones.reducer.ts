import axios from 'axios';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { API_CONFIG, API_CONTEXT_PATH, ScreenMode } from 'app/config/constants';
import { PARAM_GET_LIST_MILESTONE } from 'app/modules/tasks/milestone/constants';

export const ACTION_TYPES = {
  GET_MILESTONE_LIST: 'getMilestone/GET_MILESTONE_LIST'
};

export enum MilestoneAction {
  None,
  RequestList,
  ErrorList,
  DoneList
}

const initialState = {
  action: MilestoneAction.None,
  listMilestone: [],
  errorMessage: null,
  successMessage: null
};

const milestoneApiUrl = API_CONTEXT_PATH + '/' + API_CONFIG.SCHEDULES_SERVICE_PATH;

const handleResposeMilestone = res => {
  const dataRequest = res.data || {};
  const dataMilestone = dataRequest.getMilestones || {};
  const listMilestone = dataMilestone.milestones || [];

  return { listMilestone };
};

export type MilestoneListState = Readonly<typeof initialState>;

export default (state: MilestoneListState = initialState, action): MilestoneListState => {
  let res;
  switch (action.type) {
    case REQUEST(ACTION_TYPES.GET_MILESTONE_LIST):
      return {
        ...state,
        action: MilestoneAction.RequestList
      };
    case FAILURE(ACTION_TYPES.GET_MILESTONE_LIST):
      return {
        ...state,
        errorMessage: action.payload,
        successMessage: null
      };
    case SUCCESS(ACTION_TYPES.GET_MILESTONE_LIST):
      res = handleResposeMilestone(action.payload.data);
      return {
        ...state,
        errorMessage: null,
        listMilestone: res.listMilestone
      };
    default:
      return state;
  }
};

/**
 * getMilestones
 *
 */
export const getMilestoneList = () => ({
  type: ACTION_TYPES.GET_MILESTONE_LIST,
  payload: axios.post(
    `${milestoneApiUrl}`,
    {
      query: PARAM_GET_LIST_MILESTONE()
    },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});
