import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { API_CONTEXT_PATH, ScreenMode } from 'app/config/constants';
import { API_CONFIG } from 'app/config/constants';
import axios from 'axios';

export enum IpAddressAction {
  None,
  Request,
  Error,
  Success
}

export const ACTION_TYPES = {
  IP_ADDRESS_RESET: 'ipAddress/RESET',
  GET_IP_ADDRESS: 'ipAddress/GET',
  UPDATE_IP_ADDRESS: 'ipAddress/UPDATE',
  IP_ADDRESS_RELOAD: 'ipAddress/RELOAD'
};
const initialState = {
  action: IpAddressAction.None,
  screenMode: ScreenMode.DISPLAY,
  errorMessage: null,
  errorItems: null,
  ipAddresses: [],
  ipAddressUpdateRes: null
};
export type IpAddressState = Readonly<typeof initialState>;

// API base URL
const ipAdressApiUrl = API_CONTEXT_PATH + '/' + API_CONFIG.UAA_SERVICE_PATH;

const parseGeneralApiResponse = res => {
  const errorCodeList = [];
  if (res.errors && res.errors.length > 0) {
    if (
      res.errors[0].extensions &&
      res.errors[0].extensions.errors &&
      res.errors[0].extensions.errors.length > 0
    ) {
      res.errors[0].extensions.errors.forEach(e => {
        errorCodeList.push(e);
      });
    }
  }

  if (errorCodeList.length > 0) return { errorCodeList };
  else return res;
};

// Reducer
export default (state: IpAddressState = initialState, action): IpAddressState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.GET_IP_ADDRESS): {
      return {
        ...state,
        action: IpAddressAction.Request,
        errorItems: null
      };
    }

    case FAILURE(ACTION_TYPES.GET_IP_ADDRESS): {
      return {
        ...state,
        action: IpAddressAction.Error,
        errorMessage: action.payload.message
      };
    }

    case FAILURE(ACTION_TYPES.UPDATE_IP_ADDRESS): {
      return {
        ...state,
        action: IpAddressAction.Error,
        errorItems: action.payload.response.data.parameters.extensions.errors
      };
    }

    case ACTION_TYPES.IP_ADDRESS_RESET: {
      return {
        ...initialState
      };
    }

    case SUCCESS(ACTION_TYPES.GET_IP_ADDRESS): {
      const res = action.payload.data;
      return {
        ...state,
        action: IpAddressAction.Success,
        ipAddresses: res.ipAddresses
      };
    }

    case SUCCESS(ACTION_TYPES.UPDATE_IP_ADDRESS): {
      const res = parseGeneralApiResponse(action.payload.data);
      return {
        ...state,
        ipAddressUpdateRes: {
          ipAddressUpdates: res.data && res.updatedIpAddresses,
          ipAddressInsertes: res.data && res.insertedIpAddresses,
          errorCodeList: res.errorCodeList
        }
      };
    }

    default:
      return state;
  }
};

/**
 * change when confirm drity check
 */
export const reloadDrityCheck = () => ({
  type: ACTION_TYPES.IP_ADDRESS_RELOAD
});

/**
 * reset state
 */
export const reset = () => ({
  type: ACTION_TYPES.IP_ADDRESS_RESET
});

/**
 * Get schedules type
 */
export const getIpAddresses = () => async (dispatch, getState) => {
  await dispatch({
    type: ACTION_TYPES.GET_IP_ADDRESS,
    payload: axios.post(`${API_CONTEXT_PATH + '/' + 'tenants/api/get-ip-addresses'}`, null, {
      headers: { ['Content-Type']: 'application/json' }
    })
  });
};
export const updateIpAddresses = (ipAddressesInput, ipAddressesDel) => async (
  dispatch,
  getState
) => {
  await dispatch({
    type: ACTION_TYPES.UPDATE_IP_ADDRESS,
    payload: axios.post(
      `${API_CONTEXT_PATH + '/' + 'tenants/api/update-ip-addresses'}`,
      { ipAddresses: ipAddressesInput, deletedIpAddresses: ipAddressesDel },
      {
        headers: { ['Content-Type']: 'application/json' }
      }
    )
  });
};
