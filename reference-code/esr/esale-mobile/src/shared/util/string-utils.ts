import EntityUtils from "./entity-utils";
import { LanguageCode } from "../../config/constants/enum";
import { TEXT_EMPTY } from "../../config/constants/constants";

const snakeCaseToCamelCase = (input: { toString: () => any }) => {
  return (input ? input.toString() : "")
    .split("_")
    .reduce(
      (res: any, word: string, i: number) =>
        i === 0
          ? word.toLowerCase()
          : `${res}${word.charAt(0).toUpperCase()}${word
            .substr(1)
            .toLowerCase()}`,
      ""
    );
};

const camelCaseToSnakeCase = (input: string) => {
  return input.replace(/([A-Z])/g, "_$1").toLowerCase();
};

/**
 * Get fieldInfo's value
 */
const getFieldLabel = (item: any, fieldLabel: any, languageCode: string) => {
  if (!item) {
    return "";
  }
  if (Object.prototype.hasOwnProperty.call(item, fieldLabel)) {
    try {
      const labels = JSON.parse(item[fieldLabel]);
      if (labels) {
        const labelLanguageCode = EntityUtils.getValueProp(labels, languageCode);
        const labelJaJp = EntityUtils.getValueProp(labels, LanguageCode.JA_JP);
        const labelEnUs = EntityUtils.getValueProp(labels, LanguageCode.EN_US);
        if (Object.prototype.hasOwnProperty.call(labels, languageCode) && labelLanguageCode) {
          return labelLanguageCode;
        } else if (Object.prototype.hasOwnProperty.call(labels, LanguageCode.JA_JP) && labelJaJp) {
          return labelJaJp;
        } else if (Object.prototype.hasOwnProperty.call(labels, LanguageCode.EN_US) && labelEnUs) {
          return labelEnUs;
        } else {
          return EntityUtils.getValueProp(labels, LanguageCode.ZH_CN);
        }
      }
    } catch (e) {
      return item[fieldLabel];
    }
  }
  return "";
};

/**
 * validate phone number (number haftsize, (, ), +, -)
 * @param strValue phone number string
 */
const isValidPhoneNumber = (strValue: string) => {
  if (!strValue || strValue?.toString()?.trim() === TEXT_EMPTY) {
    return true;
  }
  return new RegExp(/[\d-()+-]$/g).test(strValue);
};

export const trimCharNSpace = (str: string, charToRemove: any) => {
  while (str.charAt(0) === charToRemove || str.charAt(0) === ' ') {
    str = str.substring(1);
  }

  while (
    str.charAt(str.length - 1) === charToRemove ||
    str.charAt(str.length - 1) === ' '
  ) {
    str = str.substring(0, str.length - 1);
  }
  return str;
};

const StringUtils = {
  snakeCaseToCamelCase,
  camelCaseToSnakeCase,
  getFieldLabel,
  isValidPhoneNumber,
  trimCharNSpace
};

export default StringUtils;
