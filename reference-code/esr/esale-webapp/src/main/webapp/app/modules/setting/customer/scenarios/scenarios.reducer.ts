import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { API_CONTEXT_PATH, ScreenMode } from 'app/config/constants';
import { API_CONFIG } from 'app/config/constants';
import axios from 'axios';
import { TYPEMASTER } from 'app/modules/setting/constant';
export enum MasterScenarioAction {
  None,
  Request,
  Error,
  Success
}

export const ACTION_TYPES = {
  SCENARIO_SETTING_RESET: 'scenariosSetting/RESET',
  GET_MASTER_SCENARIO: 'scenariosSetting/GET_MASTER_SCENARIO',
  GET_MASTER_SCENARIOS: 'scenariosSetting/GET_MASTER_SCENARIOS',
  UPDATE_MASTER_SCENARIO: 'scenariosSetting/UPDATE_MASTER_SCENARIO',
  DELETE_MASTER_SCENARIO: 'scenariosSetting/DELETE_MASTER_SCENARIO',
  CREACT_MASTER_SCENARIO: 'scenariosSetting/CREACT_MASTER_SCENARIO'
};
const initialState = {
  action: MasterScenarioAction.None,
  screenMode: ScreenMode.DISPLAY,
  errorMessage: null,
  errorItems: null,
  scenarios: [],
  scenario: null,
  scenarioChange: null,
  isChangeSuccess: null
};

export type ScenarioSettingState = Readonly<typeof initialState>;

// API base URL
const customerApiUrl = `${API_CONTEXT_PATH}/${API_CONFIG.CUSTOMER_SERVICE_PATH}`;

// Reducer
export default (state: ScenarioSettingState = initialState, action): ScenarioSettingState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.GET_MASTER_SCENARIO):
    case REQUEST(ACTION_TYPES.UPDATE_MASTER_SCENARIO):
    case REQUEST(ACTION_TYPES.CREACT_MASTER_SCENARIO):
    case REQUEST(ACTION_TYPES.DELETE_MASTER_SCENARIO):
    case REQUEST(ACTION_TYPES.GET_MASTER_SCENARIOS): {
      return {
        ...state,
        action: MasterScenarioAction.Request,
        errorItems: null
      };
    }

    case FAILURE(ACTION_TYPES.GET_MASTER_SCENARIO):
    case FAILURE(ACTION_TYPES.UPDATE_MASTER_SCENARIO):
    case FAILURE(ACTION_TYPES.CREACT_MASTER_SCENARIO):
    case FAILURE(ACTION_TYPES.DELETE_MASTER_SCENARIO):
    case FAILURE(ACTION_TYPES.GET_MASTER_SCENARIOS): {
      return {
        ...state,
        action: MasterScenarioAction.Error,
        isChangeSuccess: false,
        errorMessage: action.payload.message
      };
    }

    case SUCCESS(ACTION_TYPES.GET_MASTER_SCENARIOS): {
      const res = action.payload.data;
      return {
        ...state,
        scenarios: res.scenarios
      };
    }
    case SUCCESS(ACTION_TYPES.GET_MASTER_SCENARIO): {
      const res = action.payload.data;
      return {
        ...state,
        scenario: res
      };
    }
    case SUCCESS(ACTION_TYPES.DELETE_MASTER_SCENARIO):
    case SUCCESS(ACTION_TYPES.CREACT_MASTER_SCENARIO):
    case SUCCESS(ACTION_TYPES.UPDATE_MASTER_SCENARIO): {
      const res = action.payload.data;
      return {
        ...state,
        isChangeSuccess: true,
        scenarioChange: res
      };
    }
    case ACTION_TYPES.SCENARIO_SETTING_RESET: {
      return {
        ...initialState
      };
    }

    default:
      return state;
  }
};

/**
 * reset state
 */
export const reset = () => ({
  type: ACTION_TYPES.SCENARIO_SETTING_RESET
});

/**
 * Get schedules type
 */
export const getMasterScenarios = () => ({
  type: ACTION_TYPES.GET_MASTER_SCENARIOS,
  payload: axios.post(`${customerApiUrl}/get-master-scenarios`, null, {
    headers: { ['Content-Type']: 'application/json' }
  })
});
/**
 * Get schedules type
 */
export const getMasterScenario = id => ({
  type: ACTION_TYPES.GET_MASTER_SCENARIO,
  payload: axios.post(
    `${customerApiUrl}/get-master-scenario`,
    { scenarioId: id },
    {
      headers: { ['Content-Type']: 'application/json' }
    }
  )
});

/**
 * update schedules type
 */
export const createMasterScenario = param => ({
  type: ACTION_TYPES.CREACT_MASTER_SCENARIO,
  payload: axios.post(
    `${customerApiUrl}/create-master-scenario`,
    {
      scenarioName: param.scenarioName,
      milestones: param.milestones
    },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

/**
 * update schedules type
 */
export const updateMasterScenarios = param => {
  return {
    type: ACTION_TYPES.UPDATE_MASTER_SCENARIO,
    payload: axios.post(
      `${customerApiUrl}/update-master-scenarios`,
      {
        scenarioId: param.scenarioId,
        scenarioName:
          typeof param.scenarioName === 'string'
            ? param.scenarioName
            : JSON.stringify(param.scenarioName),
        updatedDate: param.updatedDate,
        deletedScenarios: param.deletedScenarios,
        milestones: param.milestones
      },
      { headers: { ['Content-Type']: 'application/json' } }
    )
  };
};

/**
 * update schedules type
 */
export const deletaMasterScenario = id => ({
  type: ACTION_TYPES.DELETE_MASTER_SCENARIO,
  payload: axios.post(
    `${customerApiUrl}/delete-master-scenario`,
    {
      scenarioId: id
    },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

/* handle Update */
export const handleChangeData = (params, type?) => async dispatch => {
  if (type) {
    await dispatch(createMasterScenario(params));
  } else {
    await dispatch(updateMasterScenarios(params));
  }
};

/* handle Get Data */
export const handleGetData = (type, id?) => async dispatch => {
  const action = type === TYPEMASTER.LIST ? getMasterScenarios() : getMasterScenario(id);
  await dispatch(action);
};
/* handle  Delete */
export const handleDelete = id => async dispatch => {
  await dispatch(deletaMasterScenario(id));
};
