import axios from 'axios';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { API_CONTEXT_PATH } from 'app/config/constants';
import { translate } from 'react-jhipster';

export const ACTION_TYPES = {
  PRODUCT_LIST_CATEGORY: 'controlSidebar/PRODUCT_CATEGORY_LIST',
  SIDEBAR_CHANGE_CATEGORY_ORDER: 'controlSidebar/CHANGE_CATEGORY_ORDER',
  DELETE_GROUP: 'controlSidebar/DELETE_GROUP',
  UPDATE_AUTO_GROUP: 'controlSidebar/UPDATE_AUTO_GROUP',
  LEAVE_GROUP: 'controlSidebar/LEAVE_GROUP',
  UPDATE_CATEGORY: 'controlSidebar/UPDATE_CATEGORY',
  UPDATE_CATEGORY_ORDER: 'controlSidebar/UPDATE_CATEGORY_ORDER',
  RESET_MESSAGE: 'controlSidebar/RESET_MESSAGE'
};

export enum ProductSidebarAction {
  None,
  Request,
  Error,
  Success
}

const initialState = {
  action: ProductSidebarAction.None,
  actionMove: ProductSidebarAction.None,
  deleteGroupUserId: null,
  updateAutoGroupUserId: null,
  leaveGroupUserId: null,
  errorMessage: null,
  errorItems: null,
  categoryOrderList: null,
  changeCategoryOrderMsg: null,
  categoryId: null,
  msgSuccess: null
};

/**
 *
 * @param payload parse error response
 */
export const parseErrorRespose = payload => {
  let errorCodeList = [];
  if (payload.response.data.parameters) {
    const resError = payload.response.data.parameters.extensions;
    if (resError && resError.errors && resError.errors.length > 0) {
      errorCodeList = resError.errors;
    } else if (resError) {
      errorCodeList.push(resError);
    }
  }
  return { errorCodeList };
};

// const parseUpdateCategoryResponse = res => {
//   const actionMove = ProductSidebarAction.Success;
//   let categoryId = null;
//   if (res != null) {
//     categoryId = res;
//   }
//   return { categoryId, actionMove };
// };

const parseUpdateCategoryOrderResponse = res => {
  const actionMove = ProductSidebarAction.Success;
  let categoryId = null;
  if (res != null) {
    categoryId = res;
  }
  return { categoryId, actionMove };
};

export type ProductControlSidebarState = Readonly<typeof initialState>;

export default (
  state: ProductControlSidebarState = initialState,
  action
): ProductControlSidebarState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.UPDATE_CATEGORY_ORDER):
    case REQUEST(ACTION_TYPES.UPDATE_CATEGORY):
      return {
        ...state,
        action: ProductSidebarAction.Request,
        errorItems: null
      };
    case FAILURE(ACTION_TYPES.UPDATE_CATEGORY_ORDER):
    case FAILURE(ACTION_TYPES.UPDATE_CATEGORY): {
      const errorRes = parseErrorRespose(action.payload);
      return {
        ...state,
        action: ProductSidebarAction.Error,
        errorItems: errorRes.errorCodeList
      };
    }
    case SUCCESS(ACTION_TYPES.UPDATE_CATEGORY_ORDER):
    case SUCCESS(ACTION_TYPES.UPDATE_CATEGORY): {
      const res = parseUpdateCategoryOrderResponse(action.payload.data);
      return {
        ...state,
        actionMove: res.actionMove,
        categoryId: res.categoryId,
        msgSuccess: translate('messages.INF_COM_0004')
      };
    }

    case ACTION_TYPES.RESET_MESSAGE:
      return {
        ...state,
        msgSuccess: null,
        errorItems: null
      };
    default:
      return state;
  }
};

export const updateCategory = (categoryId, categoryName, parentId, updatedDate) => ({
  type: ACTION_TYPES.UPDATE_CATEGORY,
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

export const handleUpdateCategory = (
  categoryId,
  categoryName,
  parentId,
  updatedDate
) => async dispatch => {
  await dispatch(updateCategory(categoryId, categoryName, parentId, updatedDate));
};

export const updateCategoryOrder = productCategories => ({
  type: ACTION_TYPES.UPDATE_CATEGORY_ORDER,
  payload: axios.post(
    `${API_CONTEXT_PATH + '/' + 'products/api/update-location-product-categories'}`,
    {
      productCategories
    },
    {
      headers: { ['Content-Type']: 'application/json' }
    }
  )
});

export const handleUpdateCategoryOrder = productCategories => async dispatch => {
  await dispatch(updateCategoryOrder(productCategories));
};

export const resetMessageSideBar = () => ({
  type: ACTION_TYPES.RESET_MESSAGE
});
