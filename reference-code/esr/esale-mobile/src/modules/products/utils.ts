import { translate } from "../../config/i18n";
import { messages as generalMessage } from "./product-general-messages";
import { TYPE_UNIT } from "../../config/constants/constants";

/**
 * check isJson
 * @param str
 */
export const isJson = (str: any) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

/**
 * format japan price
 * @param price
 * @param currency
 * @param type
 */
export const formatJaPrice = (
    price: number,
    currency: string,
    type: number
  ) => {
    let result = "";
    let str = "0";
    if (!!price) {
      str = price.toString();
    }
    let length = 3;
    while (str.length > length) {
      let start = str.length - length;
      let st1 = str.slice(start);
      str = str.slice(0, start);
      if (str.length > 0) {
        result = translate(generalMessage.unitPriceDot) + st1 + result;
      }
    }
  
    if (str.length > 0) {
      result = str + result;
    }
  
    if (type === TYPE_UNIT.SUFFIX) {
      result = result + currency;
    } else {
      result = currency + result;
    }
  
    return result;
  };
  
/**
 * get format price
 * @param price 
 * @param prefix 
 */
export const getJapanPrice = (price: number, prefix = true, suffix = true) => {

    if (price == undefined) {
        return "";
    }

    let str = price.toString();

    if (str == "") {
        return "";
    }

    let length = 3;
    let result = "";
    while (str.length > length) {
        let start = str.length - length;
        let st1 = str.slice(start);
        str = str.slice(0, start);
        if (str.length > 0) {
            result = translate(generalMessage.unitPriceDot) + st1 + result;
        }
    }

    if (str.length > 0) {
        result = str + result;
    }
    if (prefix) {
        result = translate(generalMessage.unitPricePrefix) + result;
    }

    if (suffix) {
        result = result + translate(generalMessage.unitPrice);
    }

    return result;
}

/**
 * check empty string 
 * @param input 
 */
export const checkEmptyString = (input: string) => {
    return input == undefined || input.length <= 0;
}

/**
 * handle empty string 
 * @param input 
 */
export const handleEmptyString = (input: string) => {
    return input == undefined || input.length <= 0 ? "" : input;
}

/**
 * get format date string 
 * @param input 
 */
export const getFormatDate = (input: string) => {
    let moment = require("moment");
    return moment(input, "YYYY/DD/MM hh:mm").format('YYYY年MM月DD日')
}

/**
 * get category/product type format
 */
export const getCategoryFormat = (input: string) => {
    let categoryName;
    try {
        const productCategoryObject = JSON.parse(input);
        categoryName = productCategoryObject.ja_jp;

    } catch (error) {
        categoryName = input;
    }

    return categoryName;
}
