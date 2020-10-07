import { TEXT_EMPTY } from "../../config/constants/constants";
import _ from "lodash";

/**
   	* check is number RegExp
   	* 
   	* @param strValue 
   	*/
const isValidNumber = (strValue: string, decimalPlace: number) => {
  if (!strValue || strValue?.toString()?.trim() === TEXT_EMPTY) {
    return true;
  }
  if (decimalPlace && decimalPlace > 0) {
    return (new RegExp(`^[-+]?\\d{0,18}(\\.\\d{0,${decimalPlace}})?$`, "g")).test(strValue);
  } else {
    return (/^[-+]?\d{0,18}$/g).test(strValue);
  }
}

const autoFormatNumber = (strValue: string) => {
  if (!strValue || strValue?.toString()?.trim() === TEXT_EMPTY) {
    return ''
  }
  let ret = strValue?.toString()?.split(",").join("");
  if (ret.startsWith('.')) {
    ret = '0' + ret;
  }
  if (ret.endsWith('.')) {
    ret = '0' + ret;
  }
  return commaFormatted(ret);
}
/**
  * format to display
  * 
  * @param strValue 
  */
 export const autoFormatNumeric = (number: string, decimalPlace: number) => {
  try {
    let strValue = number.split(",").join("");
    while (strValue.startsWith('0') && strValue !== '0') {
      strValue = strValue.substr(1);
    }
    if (!strValue || strValue.trim().length < 1) {
      return '';
    }
    if (_.isEqual('.', strValue)) {
      return '';
    }
    let retDecimalPlace = strValue;
    if (!_.isNil(decimalPlace) && decimalPlace > 0) {
      if (!retDecimalPlace.includes('.')) {
        retDecimalPlace += '.';
      }
      while (!checkNumberAfterDot(retDecimalPlace, decimalPlace)) {
        retDecimalPlace += '0';
      }
    }
    let ret = retDecimalPlace.split(",").join("").trim();
    if (ret.startsWith('.')) {
      ret = '0' + ret;
    }
    return commaFormatted(ret);
  } catch {
    return number;
  }
};

/**
 * Check number after dot
 * @param strValue 
 * @param decimalPlace 
 */
const checkNumberAfterDot = (strValue: string, decimalPlace: number) => {
  if (strValue.substring(strValue.indexOf('.') + 1).length < decimalPlace) {
    return false;
  }
  return true;
};
/**
  * format to display common part
  * 
  * @param strValue 
  */
 const autoFormatNumberCommon = (strValue: string) => {
  if (!strValue || strValue?.toString()?.trim() === TEXT_EMPTY) {
    return ''
  }
  let ret = strValue?.toString()?.split(",").join("");
  if (ret.startsWith('.')) {
    ret = '0' + ret;
  }
  if (ret.endsWith('.')) {
    ret = '0' + ret;
  }
  return commaFormattedCommon(ret);
}

export const commaFormatted = (amount: string) => {
  const delimiter = ','; // replace comma if desired
  let numberParts = amount.split('.', 2);
  const decimalPart = numberParts.length > 1 ? numberParts[1] : '';
  const integerPart = +numberParts[0];

  if (isNaN(integerPart)) {
    return '';
  }
  let minus = '';
  if (integerPart < 0) {
    minus = '-';
  }
  // integerPart = Math.abs(integerPart);
  let n = numberParts[0]
    .toString()
    .replace('-', '')
    .replace('+', '');
  if (integerPart === 0) {
    n = '0';
  }
  numberParts = [];
  while (n.length > 3) {
    const nn = n.substr(n.length - 3);
    numberParts.unshift(nn);
    n = n.substr(0, n.length - 3);
  }
  if (n.length > 0) {
    numberParts.unshift(n);
  }
  n = numberParts.join(delimiter);
  if (decimalPart.length < 1) {
    amount = n;
  } else {
    amount = n + '.' + decimalPart;
  }
  amount = minus + amount;
  return amount;
};

/**
  * fomat to number common part
  * 
  * @param amount 
  */
const commaFormattedCommon = (amount: string) => {
  const delimiter = ","; // replace comma if desired
  let numberParts = amount.split('.', 2)
  const decimalPart = numberParts.length > 1 ? numberParts[1] : '';
  let integerPart = numberParts[0];
  if ((integerPart?.length === 0)) {
    return TEXT_EMPTY;
  }
  let minus = TEXT_EMPTY;
  if (integerPart.startsWith("-",0) || integerPart.startsWith("+",0)) {
    minus = integerPart.startsWith("-",0) ? '-' : TEXT_EMPTY ;
    integerPart= integerPart.substring(1,integerPart.length);
  }
  let n = integerPart.toString();
  numberParts = [];
  while (n.length > 3) {
    const nn = n.substr(n.length - 3);
    numberParts.unshift(nn);
    n = n.substr(0, n.length - 3);
  }
  if (n.length > 0) {
    numberParts.unshift(n);
  }
  n = numberParts.join(delimiter);
  if (decimalPart.length < 1) {
    amount = n;
  } else {
    amount = n + '.' + decimalPart;
  }
  amount = minus + amount;
  return amount;
}

const NumberUtils = {
  isValidNumber,
  autoFormatNumber,
  commaFormatted,
  autoFormatNumberCommon,
  autoFormatNumeric
};

export default NumberUtils;