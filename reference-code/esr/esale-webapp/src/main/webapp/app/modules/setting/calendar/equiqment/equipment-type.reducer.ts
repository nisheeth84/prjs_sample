import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { API_CONTEXT_PATH, ScreenMode } from 'app/config/constants';
import { API_CONFIG } from 'app/config/constants';
import axios from 'axios';
import { CALENDAR_TYPE } from 'app/modules/setting/constant';
import { changeOrder } from 'app/shared/util/dragdrop';
import { EquipmentTypesData } from './models/equipment-types-data';

export enum EquipmentTypeAction {
  None,
  Request,
  Error,
  Success
}

export const ACTION_TYPES = {
  EQUEPMENT_TYPE_RESET: 'equipmentType/api',
  GET_EQUEPMENT_TYPES: 'equipmentType/GET_EQUEPMENT_TYPES',
  GET_EQUEPMENTS: 'equipment/GET_EQUEPMENTS',
  UPDATE_EQUEPMENTS: 'equipments/UPDATE_EQUEPMENTS',
  CHECK_EQUIPMENT_TYPES: 'equipmentType/CHECK_EQUIPMENT_TYPES',
  CHECK_EQUIPMENTS: 'equipment/CHECK_EQUIPMENTS',
  CHANGE_ORDER_EQUIPMENT_TYPE: 'equipment/CHANGE_ORDER_EQUIPMENT_TYPE',
  CHANGE_ORDER_EQUIPMENT: 'equipment/CHANGE_ORDER_EQUIPMENT',
  GET_DATA_EQUEPMENT: 'equipment/GET_DATA_EQUEPMENT',
  EQUEPMENT_TYPE_RESET_IDSS: 'equipmentType/RESET_IDSS'
};
const initialState = {
  action: EquipmentTypeAction.None,
  screenMode: ScreenMode.DISPLAY,
  errorMessage: null,
  errorItems: [],
  equipmentTypes: {},
  equipments: null,
  equipmentTypeUpdate: null,
  checkDelete: null,
  listDataEquipmentType: []
};

const parseEquipmentTypeEditResponse = res => {
  const resID = res.updatedEquipments;
  return { resID };
};
const parseEquipmentTypeFaiResponse = res => {
  let errorMsg = [];
  if (res.parameters) {
    errorMsg = res.parameters.extensions.errors;
  }
  return { errorMsg };
};

const convertDataApiToDataEquipment = res => {
  const data: EquipmentTypesData[] = res.data && res.data['equipmentTypes'];
  return data;
};

export type EquipmentTypeState = Readonly<typeof initialState>;

// API base URL
const scheduleApiUrl = API_CONTEXT_PATH + '/' + API_CONFIG.SCHEDULES_SERVICE_PATH;

// Reducer
export default (state: EquipmentTypeState = initialState, action): EquipmentTypeState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.GET_EQUEPMENT_TYPES):
    case REQUEST(ACTION_TYPES.GET_EQUEPMENTS):
    case REQUEST(ACTION_TYPES.CHECK_EQUIPMENT_TYPES):
    case REQUEST(ACTION_TYPES.CHECK_EQUIPMENTS):
    case REQUEST(ACTION_TYPES.GET_DATA_EQUEPMENT):
    case REQUEST(ACTION_TYPES.UPDATE_EQUEPMENTS): {
      return {
        ...state,
        action: EquipmentTypeAction.Request,
        errorItems: []
      };
    }
    case FAILURE(ACTION_TYPES.GET_EQUEPMENT_TYPES):
    case FAILURE(ACTION_TYPES.GET_EQUEPMENTS):
    case FAILURE(ACTION_TYPES.CHECK_EQUIPMENT_TYPES):
    case FAILURE(ACTION_TYPES.CHECK_EQUIPMENTS):
    case FAILURE(ACTION_TYPES.GET_DATA_EQUEPMENT):
    case FAILURE(ACTION_TYPES.UPDATE_EQUEPMENTS): {
      const resFai = parseEquipmentTypeFaiResponse(action.payload.response.data);
      return {
        ...state,
        action: EquipmentTypeAction.Error,
        errorItems: resFai.errorMsg
      };
    }
    case SUCCESS(ACTION_TYPES.GET_EQUEPMENT_TYPES): {
      const res = action.payload.data;
      return {
        ...state,
        equipmentTypes: res
      };
    }
    case SUCCESS(ACTION_TYPES.GET_EQUEPMENTS): {
      const res = action.payload.data;
      return {
        ...state,
        equipments: res.equipments
      };
    }
    case SUCCESS(ACTION_TYPES.UPDATE_EQUEPMENTS): {
      const res = parseEquipmentTypeEditResponse(action.payload.data);
      return {
        ...state,
        equipmentTypeUpdate: res.resID
      };
    }
    case SUCCESS(ACTION_TYPES.CHECK_EQUIPMENT_TYPES): {
      const res = action.payload.data;
      return {
        ...state,
        checkDelete: res.equipmentTypes
      };
    }
    case SUCCESS(ACTION_TYPES.CHECK_EQUIPMENTS): {
      const res = action.payload.data;
      return {
        ...state,
        checkDelete: res.equipments
      };
    }
    case SUCCESS(ACTION_TYPES.GET_DATA_EQUEPMENT): {
      const data = convertDataApiToDataEquipment(action.payload);
      return {
        ...state,
        listDataEquipmentType: data
      };
    }

    case ACTION_TYPES.EQUEPMENT_TYPE_RESET: {
      return {
        ...initialState
      };
    }

    case ACTION_TYPES.EQUEPMENT_TYPE_RESET_IDSS: {
      return {
        ...state,
        equipmentTypeUpdate: null
      };
    }

    case ACTION_TYPES.CHANGE_ORDER_EQUIPMENT_TYPE: {
      return {
        ...state,
        equipmentTypes: action.payload
      };
    }

    case ACTION_TYPES.CHANGE_ORDER_EQUIPMENT: {
      return {
        ...state,
        equipments: action.payload
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
  type: ACTION_TYPES.EQUEPMENT_TYPE_RESET
});

/**
 * resetIdss
 */
export const resetIdss = () => ({
  type: ACTION_TYPES.EQUEPMENT_TYPE_RESET_IDSS
});

/**
 * Get Equipment Type
 */
// export const getEquipmentType = () => ({
//   type: ACTION_TYPES.GET_EQUEPMENT_TYPES,
//   payload: axios.post(
//     `${scheduleApiUrl}/get-equipment-types`,
//     { isContainEquipment: true },
//     { headers: { ['Content-Type']: 'application/json' } }
//   )
// });

export const getEquipment = id => async (dispatch, getState) => {
  await dispatch({
    type: ACTION_TYPES.GET_EQUEPMENTS,
    payload: axios.post(
      `${scheduleApiUrl}/get-equipments`,
      { equipmentTypeId: id },
      { headers: { ['Content-Type']: 'application/json' } }
    )
  });
};

/**
 * Get All Equipment Type
 */
export const getDataEquipment = () => ({
  type: ACTION_TYPES.GET_DATA_EQUEPMENT,
  payload: axios.post(
    `${scheduleApiUrl}/get-all-equipment-types-and-equipment`,
    {},
    { headers: { 'Content-Type': 'application/json' } }
  )
});

/* handle Get Data */
export const handleGetData = (type, id?) => async dispatch => {
  if (type === CALENDAR_TYPE.EQUIPMENT) {
    await dispatch(getEquipment(id));
  } else if (type === CALENDAR_TYPE.EQUIPMENT_TYPE) {
    await dispatch(getDataEquipment());
    // await dispatch(getDataEquipment());
  }
};

/**
 * Update Equipment
 */
// export const updateEquipment = params => async (dispatch, getState) => {
//   await dispatch({
//     type: ACTION_TYPES.UPDATE_EQUEPMENTS,
//     payload: axios.post(
//       `${scheduleApiUrl}/update-equipments`,
//       {
//         deletedEquipmentTypes: params.deletedEquipmentTypes,
//         deletedEquipments: params.deletedEquipments,
//         equipmentTypes: params.equipmentTypes,
//         equipments: params.equipments
//       },
//       { headers: { ['Content-Type']: 'application/json' } }
//     )
//   });
// };

/**
 * Update Equipment
 */
export const saveEquipment = params => async (dispatch, getState) => {
  await dispatch({
    type: ACTION_TYPES.UPDATE_EQUEPMENTS,
    payload: axios.post(
      `${scheduleApiUrl}/save-equipments`,
      { equipmentTypes: params.equipmentTypes },
      { headers: { 'Content-Type': 'application/json' } }
    )
  });
};

/* handle Update Data */
export const handleUpdateData = param => async dispatch => {
  // await dispatch(updateEquipment(param));
  await dispatch(saveEquipment(param));
};

/**
 * Check Equipment Type
 */
export const CheckEquipmentType = id => async (dispatch, getState) => {
  await dispatch({
    type: ACTION_TYPES.CHECK_EQUIPMENT_TYPES,
    payload: axios.post(
      `${scheduleApiUrl}/check-delete-equipment-types`,
      { equipmentTypeIds: [id] },
      { headers: { ['Content-Type']: 'application/json' } }
    )
  });
};

/**
 * Check Equipment Type
 */
export const CheckEquipment = id => async (dispatch, getState) => {
  await dispatch({
    type: ACTION_TYPES.CHECK_EQUIPMENTS,
    payload: axios.post(
      `${scheduleApiUrl}/check-delete-equipments`,
      { equipmentIds: [id] },
      { headers: { ['Content-Type']: 'application/json' } }
    )
  });
};

/* handle Check Delete */
export const handleCheckDelete = (type, id) => async dispatch => {
  if (type === CALENDAR_TYPE.EQUIPMENT) {
    await dispatch(CheckEquipment(id));
  } else if (type === CALENDAR_TYPE.EQUIPMENT_TYPE) {
    await dispatch(CheckEquipmentType(id));
  }
};

/**
 * update order equipment type
 *
 */
export const changeOrderEquipmentType = (sourceIndex, targetIndex) => (dispatch, getState) => {
  const newServiceInfo = changeOrder(
    sourceIndex,
    targetIndex,
    getState().equipmentType.equipmentTypes
  );
  // TODO: add service

  dispatch({
    type: ACTION_TYPES.CHANGE_ORDER_EQUIPMENT_TYPE,
    payload: newServiceInfo
  });
};

export const changeOrderEquipment = (sourceIndex, targetIndex) => (dispatch, getState) => {
  const newServiceInfo = changeOrder(sourceIndex, targetIndex, getState().equipmentType.equipments);
  // TODO: add service

  dispatch({
    type: ACTION_TYPES.CHANGE_ORDER_EQUIPMENT,
    payload: newServiceInfo
  });
};
