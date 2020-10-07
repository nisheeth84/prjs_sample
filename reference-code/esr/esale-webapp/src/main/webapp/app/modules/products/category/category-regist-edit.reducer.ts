import axios from 'axios';

import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { API_CONTEXT_PATH } from 'app/config/constants';
import { API_CONFIG } from 'app/config/constants';
import { translate } from 'react-jhipster';
import StringUtils from 'app/shared/util/string-utils';

export const ACTION_TYPES = {
  INIT_CATEGORY_MODEL: 'category/INIT_CATEGORY_MODEL',
  UPDATE_CATEGORY: 'category/UPDATE_CATEGORY',
  CREATE_CATEGORY: 'category/CREATE_CATEGORY',
  RESET_CATEGORY: 'category/RESET_CATEGORY',
  GET_NEW_CATEGORY: 'category/GET_NEW_CATEGORY',
  RESET_CATEGORY_MESSAGE: 'category/RESET_CATEGORY_MESSAGE'
};

export enum CategoryRegistEditAction {
  None,
  Init,
  Create,
  Update
}

const categoryRegistEditState = {
  actionType: CategoryRegistEditAction.None,
  isUpdateSuccess: false,
  isCreateSuccess: null,
  errorMessage: null,
  errorItems: null,
  category: {
    productCategoryId: null,
    productCategoryName: ' ',
    productCategoryParentId: null,
    updatedDate: null
  },
  categories: [
    {
      productCategoryId: null,
      productCategoryName: ' ',
      productCategoryParentId: null,
      updatedDate: null
    }
  ],
  newCategory: {
    productCategoryId: null,
    productCategoryName: null
  }
};

const convertSnakeToCamelCategories = datas => {
  datas.forEach((data, index) => {
    const newElement = {};
    for (const prop in data) {
      if (Object.prototype.hasOwnProperty.call(data, prop)) {
        newElement[StringUtils.snakeCaseToCamelCase(prop)] = data[prop];
        if (Array.isArray(newElement[StringUtils.snakeCaseToCamelCase(prop)])) {
          convertSnakeToCamelCategories(newElement[StringUtils.snakeCaseToCamelCase(prop)]);
        }
      }
    }
    datas[index] = newElement;
  });
};

const getErrorMessage = res => {
  let errorMsg = '';
  if (res.errors && res.errors.length > 0) {
    if (
      res.errors[0].extensions &&
      res.errors[0].extensions.errors &&
      res.errors[0].extensions.errors.length > 0
    ) {
      const errorCode = res.errors[0].extensions.errors[0].errorCode;
      errorMsg = `${translate('messages.' + errorCode)}`;
    } else {
      errorMsg = res.errors[0].message;
    }
  }
  return errorMsg;
};

const parseUpdateCategoryResponse = res => {
  let errorMsg = '';
  const errorItems = [];
  let isError = false;
  if (res.errors && res.errors.length > 0) {
    errorMsg = getErrorMessage(res);
    isError = true;
  }
  let categoryId = null;
  if (res != null) {
    categoryId = res;
  }
  return { isError, errorMsg, errorItems, categoryId };
};

const parseInitCategoriesResponse = res => {
  let errorMsg = '';
  if (res.errors && res.errors.length > 0) {
    errorMsg = res.errors[0].extensions.errors;
  }
  let categories = null;
  if (res['productsCategories'] && res['productsCategories'].length > 0) {
    categories = res['productsCategories'];
  }
  return { errorMsg, categories };
};

/**
 * Parse errorMessage and errorItems
 * @param res
 */
const getErrors = res => {
  let errorMsg = '';
  const errorItems = [];
  if (res.errors && res.errors.length > 0) {
    res.errors.forEach(e => {
      errorItems.push(e);
    });
  } else {
    errorMsg = res.errors[0].message;
  }
  return { errorMsg, errorItems };
};

export type CategoryRegistEditState = Readonly<typeof categoryRegistEditState>;

// Reducer
export default (
  state: CategoryRegistEditState = categoryRegistEditState,
  action
): CategoryRegistEditState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.INIT_CATEGORY_MODEL):
    case ACTION_TYPES.RESET_CATEGORY:
      return {
        ...categoryRegistEditState,
        ...(action.payload && { newCategory: { ...state.newCategory } })
      };
    case ACTION_TYPES.RESET_CATEGORY_MESSAGE:
      return {
        ...state,
        errorItems: null
      };
    case REQUEST(ACTION_TYPES.UPDATE_CATEGORY):
    case REQUEST(ACTION_TYPES.CREATE_CATEGORY):
      return {
        ...state
      };
    case FAILURE(ACTION_TYPES.INIT_CATEGORY_MODEL):
    case FAILURE(ACTION_TYPES.UPDATE_CATEGORY):
    case FAILURE(ACTION_TYPES.CREATE_CATEGORY): {
      const resError = getErrors(action.payload.response.data.parameters.extensions);
      return {
        ...state,
        errorMessage: resError.errorMsg,
        errorItems: resError.errorItems
      };
    }
    case SUCCESS(ACTION_TYPES.INIT_CATEGORY_MODEL): {
      const res = parseInitCategoriesResponse(action.payload.data);
      return {
        ...state,
        categories: res.categories,
        errorMessage: res.errorMsg
      };
    }
    case SUCCESS(ACTION_TYPES.UPDATE_CATEGORY): {
      const res = parseUpdateCategoryResponse(action.payload.data);
      return {
        ...state,
        errorMessage: res.errorMsg,
        isUpdateSuccess: true
      };
    }
    case SUCCESS(ACTION_TYPES.CREATE_CATEGORY): {
      const res = parseUpdateCategoryResponse(action.payload.data);
      return {
        ...state,
        errorMessage: res.errorMsg,
        isCreateSuccess: res.categoryId,
        newCategory: {
          ...state.newCategory,
          productCategoryId: res.categoryId
        }
      };
    }
    case ACTION_TYPES.GET_NEW_CATEGORY: {
      return {
        ...state,
        newCategory: {
          ...state.newCategory,
          productCategoryName: action.payload.productCategoryName
        }
      };
    }
    default:
      return state;
  }
};

// API base URL
const productsApiUrl = API_CONTEXT_PATH + '/' + API_CONFIG.PRODUCT_SERVICE_PATH;

/**
 * Save change password
 *
 * @param currentPassword
 * @param newPassword
 */
export const getProductCategories = () => ({
  type: ACTION_TYPES.INIT_CATEGORY_MODEL,
  // payload: axios.post(
  //   `${productsApiUrl}`,
  //   {
  //     query: GET_CATEGORY_LIST()
  //   },
  //   { headers: { ['Content-Type']: 'application/json' } }
  // )
  payload: axios.post(`${API_CONTEXT_PATH + '/' + 'products/api/get-product-categories'}`, null, {
    headers: { ['Content-Type']: 'application/json' }
  })
});

// const handleMoveToDepartment = (categoryName, parentId) => async (dispatch, getState) => {
//   const data = new FormData();
//   data.append('departmentId', departmentId);
//   data.append('employeeIds', `${JSON.stringify(employeeIds).replace(/"(\w+)"\s*:/g, '$1:')}`);
//   data.append('moveType', moveType);
//   await dispatch(moveToDepartment(data));
// };

const convertParamCreateCategory = (categoryName, parentId) => {
  const data = new FormData();
  data.append('productCategoryName', categoryName);
  data.append('productCategoryParentId', parentId);
  return data;
};

/**
 * Save change password
 *
 * @param currentPassword
 * @param newPassword
 */
export const createCategory = (categoryName, parentId) => ({
  type: ACTION_TYPES.CREATE_CATEGORY,
  // payload: axios.post(
  //   `${productsApiUrl}`,
  //   {
  //     query: PARAM_CREATE_CATEGORY(categoryName, parentId)
  //   },
  //   { headers: { ['Content-Type']: 'application/json' } }
  // )
  payload: axios.post(
    `${API_CONTEXT_PATH + '/' + 'products/api/create-product-category'}`,
    {
      productCategoryName: categoryName,
      productCategoryParentId: parentId
    },
    {
      headers: { ['Content-Type']: 'application/json' }
    }
  )
});

/**
 * Save change password
 *
 * @param currentPassword
 * @param newPassword
 */
export const updateCategory = (categoryId, categoryName, parentId, updatedDate) => ({
  type: ACTION_TYPES.UPDATE_CATEGORY,
  // payload: axios.post(
  //   `${productsApiUrl}`,
  //   {
  //     query: PARAM_UPDATE_CATEGORY(categoryId, categoryName, parentId, updatedDate)
  //   },
  //   { headers: { ['Content-Type']: 'application/json' } }
  // )
  payload: axios.post(
    `${API_CONTEXT_PATH + '/' + 'products/api/update-product-category'}`,
    {
      productCategoryId: categoryId,
      productCategoryName: categoryName,
      productCategoryParentId: parentId,
      updatedDate
    },
    {
      headers: { ['Content-Type']: 'application/json' }
    }
  )
});

export const handleGetProductCategories = () => async dispatch => {
  await dispatch(getProductCategories());
};

export const handleCreateCategory = (categoryName, parentId) => async dispatch => {
  await dispatch(createCategory(categoryName, parentId));
  dispatch({
    type: ACTION_TYPES.GET_NEW_CATEGORY,
    payload: { productCategoryName: categoryName }
  });
};

export const handleUpdateCategory = (
  categoryId,
  categoryName,
  parentId,
  updatedDate
) => async dispatch => {
  await dispatch(updateCategory(categoryId, categoryName, parentId, updatedDate));
};

export const reset = (exceptNewCategory?: boolean) => ({
  type: ACTION_TYPES.RESET_CATEGORY,
  payload: exceptNewCategory
});

export const resetMessageCategoryReducer = () => ({
  type: ACTION_TYPES.RESET_CATEGORY_MESSAGE
});