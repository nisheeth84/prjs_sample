import _ from 'lodash';
import { CommonUtil } from '../common-util';
import { TagSuggestionType, TagSuggestionMode } from './tag-suggestion';

/**
 * getProductTradingIdChoice
 */
export const getProductTradingIdChoice = tags => {
  if (_.isNil(tags) || tags.length <= 0) {
    return [];
  }
  const listProductTrading = tags.filter(e => !_.isNil(e.productTradingId));
  return CommonUtil.GET_ARRAY_VALUE_PROPERTIES(listProductTrading, 'productTradingId');
};

/**
 * getProductIdChoice
 */
export const getProductIdChoice = tags => {
  if (_.isNil(tags) || tags.length <= 0) {
    return [];
  }
  const listProduct = tags.filter(e => _.isNil(e.productTradingId));
  const listProductTrading = tags.filter(e => !_.isNil(e.productTradingId));
  const listId1 = CommonUtil.GET_ARRAY_VALUE_PROPERTIES(listProduct, 'productId');
  const listId2 = CommonUtil.GET_ARRAY_VALUE_PROPERTIES(listProductTrading, 'productId');
  return _.concat(listId1 || [], listId2 || [])
};

/**
 * getProductIdChoice
 */
export const getBusinessCardIdChoice = tags => {
  if (_.isNil(tags) || tags.length <= 0) {
    return [];
  }
  return CommonUtil.GET_ARRAY_VALUE_PROPERTIES(tags, 'businessCardId');
};

export const getClassName = (type, mode, textValue, tags, validMsg, tagSearch) => {
  let classNameAutoComplete = '';
  if (
    (type === TagSuggestionType.ReportTarget || type === TagSuggestionType.Customer) &&
    mode === TagSuggestionMode.Single
  ) {
    classNameAutoComplete = 'input-common-wrap';
    if (tags && tags.length > 0) {
      classNameAutoComplete += ' tag';
    }
    if (textValue && textValue.length > 0) {
      classNameAutoComplete += ' delete';
    }
    if (validMsg) {
      classNameAutoComplete += '  error';
    }
  }
  if (tagSearch) {
    classNameAutoComplete += 'search-box-button-style';
  }
  return classNameAutoComplete;
};
