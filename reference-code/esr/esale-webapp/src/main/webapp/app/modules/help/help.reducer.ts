import axios from 'axios';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { API_CONFIG } from 'app/config/constants';
import { DOMAIN, SUGGEST_RECORDS, HELP_ACTION_TYPES } from './constant';

export const ACTION_TYPES = HELP_ACTION_TYPES;

export enum HelpAction {
  None,
  Request,
  Error,
  Success
}
const isDummy = true;
const initialState = {
  action: HelpAction.None,
  errorMessage: null,
  successMessage: null,
  helpPosts: null,
  suggestPosts: null,
  currentCategory: 1,
  disableLazyLoad: false
};

export type HelpModalState = Readonly<typeof initialState>;

export default (state: HelpModalState = initialState, action): HelpModalState => {
  let result = null;
  switch (action.type) {
    case REQUEST(ACTION_TYPES.HELP_GET_POST_SUGGEST_FROM_WORDPRESS):
    case REQUEST(ACTION_TYPES.HELP_GET_POST_FROM_WORDPRESS):
      return {
        ...state,
        action: HelpAction.Request,
        errorMessage: null,
        successMessage: null
      };
    case FAILURE(ACTION_TYPES.HELP_GET_POST_FROM_WORDPRESS_LAZY_LOAD):
      return {
        ...state,
        action: HelpAction.Error,
        errorMessage: action.payload.message,
        successMessage: null,
        disableLazyLoad: true
      };
    case FAILURE(ACTION_TYPES.HELP_GET_POST_SUGGEST_FROM_WORDPRESS):
    case FAILURE(ACTION_TYPES.HELP_GET_POST_FROM_WORDPRESS):
      return {
        ...state,
        action: HelpAction.Error,
        errorMessage: action.payload.message,
        successMessage: null
      };
    case SUCCESS(ACTION_TYPES.HELP_GET_POST_SUGGEST_FROM_WORDPRESS):
      result = action.payload.data;
      console.log('HELP_GET_POST_SUGGEST_FROM_WORDPRESS', result);
      return {
        ...state,
        action: HelpAction.Success,
        suggestPosts: result,
        errorMessage: null,
        successMessage: null
      };
    case SUCCESS(ACTION_TYPES.HELP_GET_POST_FROM_WORDPRESS): {
      result = action.payload.data;
      return {
        ...state,
        action: HelpAction.Success,
        helpPosts: result,
        errorMessage: null,
        successMessage: null
      };
    }
    case SUCCESS(ACTION_TYPES.HELP_GET_POST_FROM_WORDPRESS_LAZY_LOAD): {
      result = action.payload.data;
      return {
        ...state,
        action: HelpAction.Success,
        helpPosts: [...state.helpPosts, ...result],
        errorMessage: null,
        successMessage: null
      };
    }
    case SUCCESS(ACTION_TYPES.HELP_SET_CURRENT_CATEGORY): {
      return {
        ...state,
        currentCategory: action.payload
      };
    }
    default:
      return state;
  }
};

/**
 * avoid dupplicates
 * @param payload
 */
const getPayloadDataBySearchQuery = payload => {
  return axios.get(`${DOMAIN}/${API_CONFIG.WORDPRESS_SERVICE_PATH}/posts`, {
    params: {
      // perPage: payload.page,
      ...payload
    },
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  });
};

/**
 * Get post from wordpress service
 *
 * @param payload: contain parameters: domain, category
 */
export const getWordPressServiceDataByCategory = category => {
  const actionObject = {
    type: ACTION_TYPES.HELP_GET_POST_FROM_WORDPRESS,
    payload: axios.get(`${DOMAIN}/${API_CONFIG.WORDPRESS_SERVICE_PATH}/posts`, {
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    })
  };
  return actionObject;
};

/**
 * Get post from wordpress service
 *
 * @param payload: contain parameters: domain, search, per_page, page
 */
export const getWordPressServiceDataBySearchQuery = (isSuggest, payload) => {
  const _type = isSuggest
    ? ACTION_TYPES.HELP_GET_POST_SUGGEST_FROM_WORDPRESS
    : ACTION_TYPES.HELP_GET_POST_FROM_WORDPRESS;
  const result = getPayloadDataBySearchQuery(payload);
  const actionObject = {
    type: _type,
    payload: result
  };

  return actionObject;
};

/**
 * Get post from wordpress service lazy load
 *
 * @param payload: contain parameters: domain, search, per_page, page
 */
export const getWordPressServiceDataBySearchQueryLazyLoad = payload => {
  const result = getPayloadDataBySearchQuery(payload);
  const actionObject = {
    type: ACTION_TYPES.HELP_GET_POST_FROM_WORDPRESS_LAZY_LOAD,
    payload: result
  };

  return actionObject;
};

/**
 * Get post from wordpress service lazy load
 *
 * @param payload: contain parameters: domain, search, per_page, page
 */
export const setCurrentCategory = currentCategory => {
  return {
    type: SUCCESS(ACTION_TYPES.HELP_SET_CURRENT_CATEGORY),
    payload: currentCategory
  };
};
