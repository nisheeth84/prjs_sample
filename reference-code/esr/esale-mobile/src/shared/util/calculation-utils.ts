import _ from 'lodash';
import EntityUtils from './entity-utils';
import { evaluate } from 'mathjs';
import { fieldDetailMessages } from '../components/dynamic-form/control-field/detail/field-detail-messages';
import { translate } from '../../config/i18n';
import StringUtils from './string-utils';

export const calculate = (express: any, record: any, fixedNumber: number) => {
  let value = '';
  let isMissingInput = false;

  if (_.isNil(record) || _.isNil(express)) {
    return translate(fieldDetailMessages.valueEmptyCalculation);
  }

  let expr = express.split('::float8').join('');
  const variableFieldName = new Map<string, string>();
  if (expr && expr.match(/\(([a-z].*?)\)(::float8)?/g)) {
    const exprs = expr.match(/\(([a-z].*?)\)(::float8)?/g);
    let startIndex = 1;
    for (let i = 0; i < exprs.length; i++) {
      if (!variableFieldName.has(exprs[i])) {
        let key = StringUtils.trimCharNSpace(exprs[i], '(');
        key = StringUtils.trimCharNSpace(key, ')');
        variableFieldName.set(key, `x${startIndex}`);
        startIndex += 1;
      }
    }
  }

  const scope : any = {};
  if (variableFieldName.size > 0) {
    variableFieldName.forEach((v, k) => {
      let itemTmp = k.replace('::float8', '');
      itemTmp = itemTmp.replace(/''/gi, '');
      const parts = itemTmp
        .split(/[(\\)"]/)
        .join('')
        .split('->');
      let fieldValue = 0;
      if (parts.length > 1) {
        const extRecord = _.get(record, _.camelCase(parts[0]));
        if (!_.isNil(extRecord)) {
          if (_.isArray(extRecord)) {
            extRecord.forEach((e: any) => {
              if (e['key'] === parts[1]) {
                fieldValue = e['value'];
              }
            });
          } else {
            fieldValue = _.get(extRecord, parts[1]);
          }
        } else {
          fieldValue = EntityUtils.getValueProp(record, parts[1]);
        }
      } else {
        fieldValue = EntityUtils.getValueProp(record, parts.join(''));
      }
      if (fieldValue) {
        try {
          if (_.isString(fieldValue)) {
            fieldValue = _.toNumber(fieldValue);
          }
        } catch {
          fieldValue = 0;
        }
        expr = expr.split(k).join(v);
        scope[v] = _.isNil(fieldValue) || !_.isNumber(fieldValue) ? 0 : fieldValue;
      } else {
        isMissingInput = true;
      }
    });
  }
  let decimalPlace = 0;
  if (fixedNumber) {
    decimalPlace = fixedNumber;
  }

  if (!isMissingInput) {
    try {
      let result = null;
      expr = expr.toLowerCase();
      result = evaluate(expr, scope);
      if (result === Number.POSITIVE_INFINITY || result === Number.NEGATIVE_INFINITY) {
        value = translate(fieldDetailMessages.ERR_COM_0046);
        if (expr.includes('^')) {
          value = translate(fieldDetailMessages.ERR_COM_0047);
        }
      } else if (
        result > Number.MAX_SAFE_INTEGER ||
        result < Number.MIN_SAFE_INTEGER ||
        _.isNaN(result)
      ) {
        value = translate(fieldDetailMessages.ERR_COM_0047);
      } else {
        value = Number(result).toFixed(decimalPlace < 0 ? 0 : decimalPlace);
        if (value === 'NaN') {
          value = '';
        }
      }
    } catch (exception) {
      value = '';
    }
  } else {
    value = translate(fieldDetailMessages.valueEmptyCalculation);
  }
  return value;
};
 
  