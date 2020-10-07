import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { API_CONTEXT_PATH, ScreenMode } from 'app/config/constants';
import axios from 'axios';

export enum GeneralAction {
  None,
  Request,
  Error,
  Success
}

export const ACTION_TYPES = {
  GENERAL_RESET: 'general/RESET',
  GET_GENERAL: 'general/GET',
  UPDATE_GENERAL: 'general/UPDATE'
};
const initialState = {
  action: GeneralAction.None,
  screenMode: ScreenMode.DISPLAY,
  errorMessage: null,
  errorItems: [],
  generalSetting: null,
  generalSettingId: null
};

const parseEquipmentTypeFaiResponse = res => {
  let errorMsg = [];
  if (res.parameters) {
    errorMsg = res.parameters.extensions.errors;
  }
  return { errorMsg };
};

export type GeneralState = Readonly<typeof initialState>;

// Reducer
export default (state: GeneralState = initialState, action): GeneralState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.GET_GENERAL): {
      return {
        ...state,
        action: GeneralAction.Request,
        errorItems: []
      };
    }

    case FAILURE(ACTION_TYPES.GET_GENERAL):
    case FAILURE(ACTION_TYPES.UPDATE_GENERAL): {
      const resFai = parseEquipmentTypeFaiResponse(action.payload.response.data);
      return {
        ...state,
        action: GeneralAction.Error,
        errorItems: resFai.errorMsg
      };
    }

    case ACTION_TYPES.GENERAL_RESET: {
      return {
        ...initialState
      };
    }

    case SUCCESS(ACTION_TYPES.GET_GENERAL): {
      return {
        ...state,
        generalSetting: action.payload.data.generalSettingId ? action.payload.data : {}
      };
    }

    case SUCCESS(ACTION_TYPES.UPDATE_GENERAL): {
      let randomId = null;
      if (action.payload.data.generalSettingId) {
        randomId = Math.floor(Math.random() * Math.floor(100000));
      }
      return {
        ...state,
        generalSettingId: randomId
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
  type: ACTION_TYPES.GENERAL_RESET
});

/**
 * Get general
 */
export const getGeneral = fixedParams => async (dispatch, getState) => {
  await dispatch({
    type: ACTION_TYPES.GET_GENERAL,
    payload: axios.post(
      `${API_CONTEXT_PATH + '/' + 'commons/api/get-general-setting'}`,
      { settingName: fixedParams },
      {
        headers: { ['Content-Type']: 'application/json' }
      }
    )
  });
};
export const updateGeneral = general => async (dispatch, getState) => {
  const timeUpdate = general.listUpdateTime
    ? general.listUpdateTime
    : JSON.parse(general.settingValue).listUpdateTime;
  await dispatch({
    type: ACTION_TYPES.UPDATE_GENERAL,
    payload: axios.post(
      `${API_CONTEXT_PATH + '/' + 'commons/api/update-general-setting'}`,
      {
        settingName: 'list_update_time',
        settingValue: `{"listUpdateTime": "${timeUpdate}"}`,
        generalSettingId: general.generalSettingId,
        updatedDate: general.updatedDate
      },
      {
        headers: { ['Content-Type']: 'application/json' }
      }
    )
  });
};
