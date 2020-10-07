import axios from 'axios';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import _ from 'lodash';
import {
  customersApiUrl,
  API_CONTEXT_PATH,
  API_CONFIG,
  businessCardApiUrl
} from 'app/config/constants';
import { parseErrorRespose, getFieldLabel } from 'app/shared/util/string-utils';
import {
  __,
  compose,
  pick,
  forEach,
  ifElse,
  unless,
  isNil,
  prop,
  applySpec,
  assoc,
  map,
  dissoc,
  anyPass,
  find,
  propEq,
  whereEq,
  allPass,
  path,
  findIndex,
  equals,
  filter
} from 'ramda';
import update from 'immutability-helper';

import { flattenWithCondition } from 'app/shared/helpers';
import {
  getDepartmentId,
  getDepartments,
  findDepartmentIndex,
  findDepartmenIndexById
} from '../helpers';
import { translate } from 'react-jhipster';
import { findBusinessCardIndexById } from '../helpers/get-business-card-index-by-id';
import { SHOW_MESSAGE_SUCCESS } from '../constants';

export const ACTION_TYPES = {
  INITIALIZE_NETWORK_MAP: 'customer/INITIALIZE_NETWORK_MAP',
  RESET_MODAL_TABLE: 'customer/RESET_MODAL_TABLE',
  FILTER_BUSINESS_CARDS: 'customer/FILTER_BUSINESS_CARDS',
  CREATE_DEPARTMENT: 'customer/CREATE_DEPARTMENT',
  DELETE_DEPARTMENT: 'customer/DELETE_DEPARTMENT',
  UPDATE_DEPARTMENT: 'customer/UPDATE_DEPARTMENT',
  DROP_BUSINESS_CARDS: 'customer/DROP_BUSINESS_CARDS',
  BUSINESS_CARD_GET_BUSINESS_CARD: 'customer/BUSINESS_CARD_GET_BUSINESS_CARD',
  BUSINESS_CARD_GET_BUSINESS_CARD_MAP_TABLE: 'customer/BUSINESS_CARD_GET_BUSINESS_CARD_MAP_TABLE',
  SAVE_NETWORK_MAP_TREE: 'customer/SAVE_NETWORK_MAP_TREE',
  DELETE_BUSINESS_CARD: 'customer/DELETE_BUSSINESS_CARD',
  UPDATE_POSITION: 'customer/UPDATE_POSITION',
  SAVE_DEPARTMENTS: 'customer/SAVE_DEPARTMENTS',
  GET_DEPARTMENTS: 'customer/GET_DEPARTMENTS',
  DROP_TEMP_BUSINESS_CARD_TO_DEPARTMENT: 'customer/DROP_TEMP_BUSINESS_CARD_TO_DEPARTMENT',
  OPEN_BUSINESS_CARD_DETAIL_MODAL: 'customer/network-map/OPEN_BUSINESS_CARD_DETAIL_MODAL',
  OPEN_EMPLOYEE_DETAIL_MODAL: 'customer/network-map/OPEN_EMPLOYEE_DETAIL_MODAL',
  ON_EDITTING_BUSINESS_CARD: 'customer/ON_EDITTING_BUSINESS_CARD',
  REMOVE_BUSINESS_CARD_MODE_TABLE: 'customer/network-map/REMOVE_BUSINESS_CARD',
  SHOW_FORM_CREATE_DEPARTMENT: 'customer/network-map/SHOW_FORM_CREATE_DEPARTMENT',
  OPEN_ACTIVITY_DETAIL_MODAL: 'customer/network-map/OPEN_ACTIVITY_DETAIL_MODAL',
};

export enum NetworkMapAction {
  None,
  Request,
  Error,
  Success,
  SuccessGetBusinessCard,
  SuccessGetDepartments,
  SuccessSaveDepartment,
  SuccessGetBusinessCardMapTable,
  SuccessSaveNetwork,
  Editting,
  SuccessRemoveBusinessCard
}

const initialState = {
  action: NetworkMapAction.None,
  errorMessage: null,
  errorItems: null,
  successMessage: null,
  companyId: null,
  departments: [],
  businessCardDatas: [],
  employeeDatas: [],
  standDatas: [],
  motivationDatas: [],
  customerParent: {
    customerId: null,
    customerName: null
  },
  customer: {
    customerId: null,
    customerName: null
  },
  customerChilds: [],
  departmentIdsDelete: [],
  businessCardsRemove: [],
  businessCardNewMapTable: null,
  departmentListMapTable: [],
  startDepartment: null,
  businessCardTemp: null,
  businessCardIdOpenDetail: null,
  msgSuccess: null,
  isEnableSaving: false,
  departmentIdParent: null,
  isFocusInput: null
};

const pickNetworkMapData = pick([
  'companyId',
  'departments',
  'businessCardDatas',
  'employeeDatas',
  'standDatas',
  'motivationDatas',
  'customerParent',
  'customer',
  'customerChilds'
]);

const pickInitialNetworkMapData = () => pickNetworkMapData(initialState);

const pickNetworkMapDataWithDefaultValue = ifElse(
  isNil,
  pickInitialNetworkMapData,
  pickNetworkMapData
);

const getDepartmentSons = prop('departmentSons');

const setDepartmentParentIdForChildren = ([departmentId, departmentSons]) =>
  unless(isNil, forEach(childDepartment => (childDepartment.parentId = departmentId)))(
    departmentSons
  );

const updateDepartmentParentId = forEach(
  compose(
    setDepartmentParentIdForChildren,
    applySpec([getDepartmentId, getDepartmentSons])
  )
);

const parseDepartments = data =>
  compose(
    assoc('departments', __, data),
    compose(
      map(dissoc('departmentSons')),
      updateDepartmentParentId,
      flattenWithCondition(getDepartmentSons),
      getDepartments
    )
  )(data);

const parseNetworkMapData = compose(
  parseDepartments,
  pickNetworkMapDataWithDefaultValue
);

export type AddEditNetworkMapState = Readonly<typeof initialState>;

const onFilterBusinessCards = (state, action) => {
  const containText = new RegExp(`.*${action.searchTerm}.*`, 'i');
  const masterStands = state?.standDatas;
  const masterMotivations = state?.motivationDatas;
  const testEmployee = propName =>
    compose(
      val => !!find(whereEq({ employeeId: action.employeeId }), val),
      prop(propName)
    );
  const testProp = propName =>
    compose(
      val => containText.test(val),
      prop(propName)
    );

  const testStand = propName =>
    compose(
      stand => containText.test(getFieldLabel(stand, 'masterStandName')),
      val => find(propEq('masterStandId', val))(masterStands),
      prop(propName)
    );

  const testMotivation = propName =>
    compose(
      motivation => containText.test(getFieldLabel(motivation, 'motivationName')),
      val => find(propEq('motivationId', val))(masterMotivations),
      prop(propName)
    );

  const isDepartmentNamePass = testProp('departmentName');
  const isPositionPass = testProp('position');
  const isPhoneNumberPass = testProp('phoneNumber');
  const isStandPass = testStand('masterStandId');
  const isMotivationPass = testMotivation('motivationId');
  const isEmployeeIdPass = testEmployee('businessCardReceives');
  const arrayCheck = [
    isDepartmentNamePass,
    isPositionPass,
    isPhoneNumberPass,
    isStandPass,
    isMotivationPass,
  ];
  const filterData = action.employeeId ? allPass([isEmployeeIdPass, anyPass(arrayCheck)]) : anyPass(arrayCheck);
  const businessCardDatas = compose(
    map(
      ifElse(
        filterData,
        assoc('visible', true),
        assoc('visible', false)
      )
    ),
    prop('businessCardDatas')
  )(state);

  return {
    ...state,
    businessCardDatas
  };
};

const onCreateDepartment = (state, { department }) =>
  update(state, {
    departments: {
      $push: [department]
    },
    departmentIdParent: {
      $set: null
    }
  });

const onShowFormCreateDepartment = (state, departmentIdParentNew, isFocus) =>
  update(state, {
    departmentIdParent: {
      $set: departmentIdParentNew
    },
    isFocusInput: {
      $set: isFocus
    }
  });

const deleteDepartmentChildren = (
  departmentParent,
  departments,
  departmentIdsDelete,
  businessCardsRemove
) => {
  const getParentId = prop('parentId');
  const departmentChild = filter(
    compose(
      equals(compose(getDepartmentId)(departmentParent)),
      getParentId
    )
  )(departments);
  if (departmentChild) {
    departmentChild.forEach(child => {
      const index = findDepartmentIndex(child, departments);
      if (!departmentIdsDelete.includes(departments[index].departmentId)) {
        departmentIdsDelete.push(departments[index].departmentId);
      }
      // delete businessCard
      if (departments[index].networkStands) {
        departments[index].networkStands.forEach(networkStand => {
          if (!businessCardsRemove.includes(networkStand.businessCardId)) {
            businessCardsRemove.push(networkStand.businessCardId);
          }
        });
      }
      deleteDepartmentChildren(child, departments, departmentIdsDelete, businessCardsRemove);
      departments.splice(index, 1);
    });
  }

  return {
    departmentResult: departments,
    departmentIdsDeleteResult: departmentIdsDelete,
    businessCardsRemoveResult: businessCardsRemove
  };
};

const onDeleteDepartment = (state, action) => {
  const departments = state.departments;
  const department = action.department;
  const departmentIdsDelete = [];
  const businessCardsRemove = [];
  const departmentIndex = findDepartmentIndex(department, departments);
  if (departmentIndex > -1) {
    departmentIdsDelete.push(departments[departmentIndex].departmentId);
    // delete businessCard
    if (departments[departmentIndex].networkStands) {
      departments[departmentIndex].networkStands.forEach(networkStand => {
        if (networkStand.businessCardId) {
          if (!businessCardsRemove.includes(networkStand.businessCardId)) {
            businessCardsRemove.push(networkStand.businessCardId);
          }
        }
      });
    }
    deleteDepartmentChildren(department, departments, departmentIdsDelete, businessCardsRemove);
    const departmentIndexNew = findDepartmentIndex(department, departments);
    departments.splice(departmentIndexNew, 1);
  }
  const updateCondition = {
    businessCardsRemove: {
      $push: businessCardsRemove
    },
    departmentIdsDelete: {
      $push: departmentIdsDelete
    },
    departments: {
      $set: departments
    }
  };
  const nState = update(state, updateCondition as any);
  return nState;
};

const onUpdateDepartment = (state, { department }) => {
  const departments = getDepartments(state);
  const departmentIndex = findDepartmentIndex(department, departments);
  const updateCondition = {
    departments: {
      [departmentIndex]: { $set: department }
    }
  };
  return update(state, updateCondition as any);
};

const onAddBusinessCard = (state, action) => {
  const businessCard = path(['payload', 'data', 'businessCardDetail'], action);
  const employeeCards = path(['businessCardReceives'], businessCard);
  const department = path(['meta', 'departmentId'], action);

  const departments = getDepartments(state);
  const departmentIndex = findDepartmentIndex(department, departments);
  if (state?.businessCardDatas.find(b => b.businessCardId === businessCard.businessCardId)) {
    return state;
  }
  const employeeNews = [];
  businessCard['departmentId'] = department.departmentId;
  businessCard['departmentName'] = department.departmentName;
  map(employee => {
    if (
      employee.employeeId &&
      !find(e => e.employeeId === employee.employeeId)(state.employeeDatas)
    ) {
      employeeNews.push(employee);
    }
  })(employeeCards);

  const updateCondition = {
    action: { $set: NetworkMapAction.SuccessGetBusinessCard },
    businessCardDatas: {
      $push: [businessCard]
    },
    employeeDatas: {
      $push: employeeNews
    },
    departments: {
      [departmentIndex]: {
        networkStands: {
          $push: [
            {
              businessCardId: businessCard.businessCardId,
              stands: {}
            }
          ]
        }
      }
    }
  };

  const nState = update(state, updateCondition as any);

  return nState;
};

const onDeleteBusinessCard = (state, { department, businessCard }) => {
  const departments = getDepartments(state);
  const departmentIndex = findDepartmentIndex(department, departments);
  let deleteCountBusinessCardInNetworkStands = 0;
  let businessCardIndex = 0;
  const networkStandsInDepartment = _.get(departments[departmentIndex], 'networkStands');
  if (networkStandsInDepartment) {
    deleteCountBusinessCardInNetworkStands = 1;
    businessCardIndex = networkStandsInDepartment.findIndex(i => i.businessCardId === _.get(businessCard, 'businessCardId'));
  }
  // const businessCardIndex = _.get(departments[departmentIndex], 'networkStands').findIndex(
  //   i => i.businessCardId === _.get(businessCard, 'businessCardId')
  // );
  const businessCardDataIndex = findBusinessCardIndexById(
    _.get(businessCard, 'businessCardId'),
    path(['businessCardDatas'], state)
  );
  const updateCondition = {
    action: { $set: NetworkMapAction.SuccessGetBusinessCard },
    businessCardDatas: {
      $splice: [[businessCardDataIndex, 1]]
    },
    businessCardsRemove: {
      $push: [path(['businessCardId'], businessCard)]
    },
    departments: {
      [departmentIndex]: {
        networkStands: {
          $splice: [[businessCardIndex, deleteCountBusinessCardInNetworkStands]]
        }
      }
    }
  };

  const nState = update(state, updateCondition as any);

  return nState;
};

const updatePositionBusinessCard = (state, { departmentId, position }) => {
  const departments = getDepartments(state);
  const departmentIndex = findDepartmenIndexById(departmentId, departments);
  const networkStandIndex = findIndex(
    compose(
      equals(position.businessCardId),
      prop('businessCardId')
    )
  )(path([departmentIndex, 'networkStands'], departments));
  const businessCardIndex = findIndex(
    compose(
      equals(position.businessCardId),
      prop('businessCardId')
    )
  )(path(['businessCardDatas'], state));

  const updateCondition = {
    action: { $set: NetworkMapAction.SuccessGetBusinessCard },
    departments: {
      [departmentIndex]: {
        networkStands: {
          [networkStandIndex]: {
            businessCardId: { $set: position.businessCardId },
            stands: {
              masterStandId: { $set: position?.masterStandId },
              motivationId: { $set: position.motivationId },
              comment: { $set: position.comment }
            }
          }
        }
      }
    },
    businessCardDatas: {
      [businessCardIndex]: {
        masterStandId: { $set: position?.masterStandId },
        motivationId: { $set: position.motivationId },
        comment: { $set: position.comment }
      }
    }
  };

  const nState = update(state, updateCondition as any);

  return nState;
};

const onDropBusinessCard = (state, { dragObjectId, sourceDropObject, destinationDropObject }) => {
  const departments = getDepartments(state);
  const sourceDepartmentIndex = findDepartmenIndexById(sourceDropObject.id, departments);
  const destinationDepartmentIndex = findDepartmenIndexById(destinationDropObject.id, departments);

  const businessCard = compose(
    find(propEq('businessCardId', dragObjectId)),
    path([sourceDepartmentIndex, 'networkStands'])
  )(departments);
  if (sourceDropObject.id > 0
    && !businessCard['departmentIdSource']
    && departments[sourceDepartmentIndex].networkStands.findIndex(b => b.businessCardId === businessCard.businessCardId) > -1) {
    businessCard['departmentIdSource'] = sourceDropObject.id;
    businessCard['departmentNameSource'] = departments[sourceDepartmentIndex].departmentName;
  }
  businessCard['customerIdSource'] = state.customer?.customerId;
  const businessCardIndex = findIndex(
    compose(
      equals(businessCard.businessCardId),
      prop('businessCardId')
    )
  )(path(['businessCardDatas'], state));
  if (sourceDepartmentIndex !== destinationDepartmentIndex) {
    const updateCondition = {
      departments: {
        [sourceDepartmentIndex]: {
          networkStands: {
            $splice: [[sourceDropObject.index, 1]]
          }
        },
        [destinationDepartmentIndex]: {
          networkStands: {
            $splice: [[destinationDropObject.index, 0, businessCard]]
          }
        }
      },
      businessCardDatas: {
        [businessCardIndex]: {
          departmentName: { $set: departments[destinationDepartmentIndex].departmentName }
        }
      }
    };
    return update(state, updateCondition as any);
  } else {
    return state;
  }
};

const createDepartmentDefault = (parentId, parentName, departmentName) => {
  return {
    departmentId: Math.round(Math.random() * 100000 * -1),
    departmentName,
    parentId,
    parentName,
    networkStands: []
  };
};

const dropTempBusinessCardToDepartment = (state, action) => {
  const {
    businessCardTemp: {
      networkStand,
      cardData,
      stands,
      motivations,
      employeeDatas
    }
  } = state;

  const { departmentId, index } = action;
  const departments = getDepartments(state);
  const destinationDepartmentIndex = findDepartmenIndexById(departmentId, departments);

  const updateCondition = {
    businessCardTemp: { $set: null },
    departments: {
      [destinationDepartmentIndex]: {
        networkStands: {
          $splice: [[index, 0, networkStand]]
        }
      }
    },
    ...(cardData && { businessCardDatas: { $push: [cardData] } }),
    ...(stands && { standDatas: { $push: [stands] } }),
    ...(motivations && { motivationDatas: { $push: [motivations] } }),
    ...(employeeDatas && employeeDatas.length > 0 && { employeeDatas: { $push: employeeDatas } })
  };
  return update(state, updateCondition as any);
};

const convertDataNetworkMap = props => {
  const dataProps = _.cloneDeep(props);
  const data = {
    customerId: path(['customer', 'customerId'], dataProps),
    customerName: path(['customer', 'customerName'], dataProps),
    departments: [],
    departmentIdsDelete: dataProps.departmentIdsDelete ? [...dataProps.departmentIdsDelete] : [],
    businessCardsRemove: dataProps.businessCardsRemove ? [...dataProps.businessCardsRemove] : [],
    businessCards: []
  };
  if (dataProps.departments && dataProps.departments.length > 0) {
    dataProps.departments.forEach(department => {
      // department.departmentId = null;
      if (department.networkStands && department.networkStands.length > 0) {
        department.networkStands.forEach(networkStand => {
          data.businessCards.push({
            businessCardId: networkStand.businessCardId,
            masterStandId: networkStand.stands?.masterStandId,
            motivationId: networkStand.stands?.motivationId,
            comment: networkStand.stands?.comment,
            departmentId: department.departmentId,
            departmentName: department.departmentName,
            customerIdSource: networkStand.customerIdSource,
            departmentIdSource: networkStand.departmentIdSource,
            departmentNameSource: networkStand.departmentNameSource
          });
        });
      }
      delete department['networkStands'];
      data.departments.push(department);
    });
  }
  return data;
};

/**
 * Dispatcher initializeNetworkMap
 * @param customerId customerId
 */
export const handleInitializeNetworkMap = (customerId, isCreateDefault, businessCardTemp) => ({
  type: ACTION_TYPES.INITIALIZE_NETWORK_MAP,
  payload: axios.post(
    `${customersApiUrl}/initialize-network-map`,
    {
      customerId
    },
    { headers: { ['Content-Type']: 'application/json' } }
  ),
  meta: { isCreateDefault, businessCardTemp }
});

/**
 * reducer
 */
export default (state: AddEditNetworkMapState = initialState, action): AddEditNetworkMapState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.INITIALIZE_NETWORK_MAP):
    case REQUEST(ACTION_TYPES.BUSINESS_CARD_GET_BUSINESS_CARD):
    case REQUEST(ACTION_TYPES.BUSINESS_CARD_GET_BUSINESS_CARD_MAP_TABLE):
    case REQUEST(ACTION_TYPES.SAVE_NETWORK_MAP_TREE):
    case REQUEST(ACTION_TYPES.GET_DEPARTMENTS):
    case REQUEST(ACTION_TYPES.SAVE_DEPARTMENTS):
      return {
        ...state,
        action: NetworkMapAction.Request,
        errorMessage: null,
        successMessage: null
      };
    case FAILURE(ACTION_TYPES.INITIALIZE_NETWORK_MAP):
    case FAILURE(ACTION_TYPES.BUSINESS_CARD_GET_BUSINESS_CARD):
    case FAILURE(ACTION_TYPES.BUSINESS_CARD_GET_BUSINESS_CARD_MAP_TABLE):
    case FAILURE(ACTION_TYPES.SAVE_DEPARTMENTS):
    case FAILURE(ACTION_TYPES.GET_DEPARTMENTS):
      return {
        ...state,
        action: NetworkMapAction.Error,
        errorMessage: action.payload.message,
        errorItems: parseErrorRespose(action.payload)
      };
    case FAILURE(ACTION_TYPES.SAVE_NETWORK_MAP_TREE):
      return {
        ...state,
        action: NetworkMapAction.Error,
        errorMessage: action.payload.message
      };
    case SUCCESS(ACTION_TYPES.INITIALIZE_NETWORK_MAP): {
      const networkMapData = parseNetworkMapData(action.payload.data);
      if (action?.meta?.isCreateDefault && !networkMapData.departments.some(department => department.parentId === 1)) {
        networkMapData.departments.push(
          createDepartmentDefault(
            1,
            null,
            translate('customers.network-map.department-new-name-default')
          )
        );
      }
      if (networkMapData.departments?.length > 0) {
        networkMapData.departments.forEach(d => {
          d.networkStands?.length > 0 && d.networkStands.forEach(e => {
            if (!e.stands) {
              e.stands = {}
            }
          });
        });
      }
      return {
        ...state,
        action: NetworkMapAction.Success,
        startDepartment: networkMapData.departments,
        ...networkMapData,
        businessCardTemp: path(['meta', 'businessCardTemp'], action)
      };
    }
    case ACTION_TYPES.RESET_MODAL_TABLE:
      return {
        ...initialState
      };
    case ACTION_TYPES.DELETE_DEPARTMENT:
      return onDeleteDepartment(state, action);

    case ACTION_TYPES.UPDATE_DEPARTMENT:
      return onUpdateDepartment(state, action);

    case ACTION_TYPES.CREATE_DEPARTMENT:
      return onCreateDepartment(state, action);

    case ACTION_TYPES.SHOW_FORM_CREATE_DEPARTMENT:
      return onShowFormCreateDepartment(state, action.departmentIdParent, action.isFocus);

    case ACTION_TYPES.FILTER_BUSINESS_CARDS:
      return onFilterBusinessCards(state, action);

    case ACTION_TYPES.DROP_BUSINESS_CARDS:
      return onDropBusinessCard(state, action);

    case ACTION_TYPES.DELETE_BUSINESS_CARD:
      return onDeleteBusinessCard(state, action);
    case ACTION_TYPES.REMOVE_BUSINESS_CARD_MODE_TABLE:
      return {
        ...state,
        action: NetworkMapAction.SuccessRemoveBusinessCard,
        msgSuccess: { successId: SHOW_MESSAGE_SUCCESS.DELETE },
        isEnableSaving: true,
      };
    case ACTION_TYPES.UPDATE_POSITION:
      return updatePositionBusinessCard(state, action);

    case ACTION_TYPES.DROP_TEMP_BUSINESS_CARD_TO_DEPARTMENT:
      return dropTempBusinessCardToDepartment(state, action);

    case SUCCESS(ACTION_TYPES.BUSINESS_CARD_GET_BUSINESS_CARD): {
      return onAddBusinessCard(state, action);
    }
    case SUCCESS(ACTION_TYPES.BUSINESS_CARD_GET_BUSINESS_CARD_MAP_TABLE): {
      return {
        ...state,
        action: NetworkMapAction.SuccessGetBusinessCardMapTable,
        isEnableSaving: true,
        businessCardNewMapTable: path(['payload', 'data', 'businessCardDetail'], action)
      };
    }
    case SUCCESS(ACTION_TYPES.SAVE_NETWORK_MAP_TREE): {
      return {
        ...state,
        successMessage: 'messages.INF_COM_0003',
        msgSuccess: { successId: SHOW_MESSAGE_SUCCESS.UPDATE },
        isEnableSaving: false,
        action: NetworkMapAction.SuccessSaveNetwork
      };
    }
    case SUCCESS(ACTION_TYPES.GET_DEPARTMENTS): {
      return {
        ...state,
        action: NetworkMapAction.SuccessGetDepartments,
        departmentListMapTable: path(['data', 'departments'], action.payload)
      };
    }
    case SUCCESS(ACTION_TYPES.SAVE_DEPARTMENTS): {
      return {
        ...state,
        msgSuccess: { successId: SHOW_MESSAGE_SUCCESS.CREATE },
        isEnableSaving: true,
        action: NetworkMapAction.SuccessSaveDepartment
      };
    }
    case ACTION_TYPES.ON_EDITTING_BUSINESS_CARD: {
      return {
        ...state,
        action: NetworkMapAction.Editting
      }
    }
    default:
      return state;
  }
};

export const handleCreateDepartment = ({ parentId, parentName, departmentName }) => ({
  type: ACTION_TYPES.CREATE_DEPARTMENT,
  department: createDepartmentDefault(parentId, parentName, departmentName)
});

export const handleShowFormCreateDepartment = (departmentIdParent, isFocus?) => ({
  type: ACTION_TYPES.SHOW_FORM_CREATE_DEPARTMENT,
  departmentIdParent,
  isFocus
});

export const handleDeleteDepartment = department => ({
  type: ACTION_TYPES.DELETE_DEPARTMENT,
  department
});

export const handleUpdateDepartment = department => ({
  type: ACTION_TYPES.UPDATE_DEPARTMENT,
  department
});

/**
 * Dispatcher saveNetworkMap
 * @param customers customers
 */
export const handleSaveNetworkMap = props => async dispatch => {
  await dispatch({
    type: ACTION_TYPES.SAVE_NETWORK_MAP_TREE,
    payload: axios.post(`${customersApiUrl}/save-network-map`, convertDataNetworkMap(props), {
      headers: { ['Content-Type']: 'application/json' }
    })
  });
};

/**
 * reset AddEditNetworkMapModeTable popup
 */
export const resetNetworkMapModalTable = () => ({
  type: ACTION_TYPES.RESET_MODAL_TABLE
});

export const filterBusinessCards = (searchTerm, employeeId) => ({
  type: ACTION_TYPES.FILTER_BUSINESS_CARDS,
  searchTerm,
  employeeId
});

export const dropTempBusinessCardTODepartment = (departmentId, index) => ({
  type: ACTION_TYPES.DROP_TEMP_BUSINESS_CARD_TO_DEPARTMENT,
  departmentId,
  index
});

const getBusinessCardById = (departmentId, businessCardId) => ({
  type: ACTION_TYPES.BUSINESS_CARD_GET_BUSINESS_CARD,
  payload: axios.post(
    `${API_CONTEXT_PATH}/${API_CONFIG.BUSINESS_CARD_SERVICE_PATH}/get-business-card`,
    {
      businessCardId
    },
    { headers: { ['Content-Type']: 'application/json' } }
  ),
  meta: { departmentId }
});

const getBusinessCardByIdMapTable = businessCardId => ({
  type: ACTION_TYPES.BUSINESS_CARD_GET_BUSINESS_CARD_MAP_TABLE,
  payload: axios.post(
    `${API_CONTEXT_PATH}/${API_CONFIG.BUSINESS_CARD_SERVICE_PATH}/get-business-card`,
    {
      businessCardId
    },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

export const handleGetBusinessCard = (departmentId, businessCardId) => async dispatch => {
  await dispatch(getBusinessCardById(departmentId, businessCardId));
};

export const handleGetBusinessCardMapTable = businessCardId => async dispatch => {
  await dispatch(getBusinessCardByIdMapTable(businessCardId));
};

export const handleDropBusinessCard = (dragObjectId, sourceDropObject, destinationDropObject) => ({
  type: ACTION_TYPES.DROP_BUSINESS_CARDS,
  dragObjectId,
  sourceDropObject,
  destinationDropObject
});

export const handleDeleteBusinessCard = (department, businessCard) => ({
  type: ACTION_TYPES.DELETE_BUSINESS_CARD,
  department,
  businessCard
});

export const handleUpdatePosition = (departmentId, position) => ({
  type: ACTION_TYPES.UPDATE_POSITION,
  departmentId,
  position
});

const saveDepartments = (customerId, departments) => ({
  type: ACTION_TYPES.SAVE_DEPARTMENTS,
  payload: axios.post(
    `${customersApiUrl}/save-network-map`,
    { customerId, departments },
    {
      headers: { ['Content-Type']: 'application/json' }
    }
  )
});

export const handleSaveDepartment = (customerId, departments) => async dispatch => {
  await dispatch(saveDepartments(customerId, departments));
};

const getDepartmentsByCustomerId = customerId => ({
  type: ACTION_TYPES.GET_DEPARTMENTS,
  payload: axios.post(
    `${businessCardApiUrl}/get-departments-by-customer-id`,
    { customerId },
    {
      headers: { ['Content-Type']: 'application/json' }
    }
  )
});

export const handleGetDepartmentsByCustomerId = customerId => async dispatch => {
  await dispatch(getDepartmentsByCustomerId(customerId));
};

export const openBusinessCardDetailModal = businessCardId => ({
  type: ACTION_TYPES.OPEN_BUSINESS_CARD_DETAIL_MODAL,
  businessCardId
});

export const onOpenModalEmployeeDetail = employeeId => ({
  type: ACTION_TYPES.OPEN_EMPLOYEE_DETAIL_MODAL,
  employeeId
});


export const onOEditEditBusinessCard = () => ({
  type: ACTION_TYPES.ON_EDITTING_BUSINESS_CARD,
});

export const handleRemoveBusinessCard = (jointDepartmentBusinessCard) => async (dispatch, getState) => {
  Array.isArray(jointDepartmentBusinessCard) && await Promise.all(jointDepartmentBusinessCard.map(async joint => {
    await dispatch(handleDeleteBusinessCard(joint.department, joint.businessCard));
  }))
  await dispatch({
    type: ACTION_TYPES.REMOVE_BUSINESS_CARD_MODE_TABLE
  });
}

export const onOpenActivityDetail = activityId => ({
  type: ACTION_TYPES.OPEN_ACTIVITY_DETAIL_MODAL,
  activityId
});
