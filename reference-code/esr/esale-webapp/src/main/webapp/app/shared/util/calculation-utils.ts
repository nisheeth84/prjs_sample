import _ from 'lodash';
import { evaluate, parse, format } from 'mathjs';

import { translate } from 'react-jhipster';
import { getValueProp } from './entity-utils';
import StringUtils, { replaceAll } from './string-utils';

// const ln = x => Math.log(x);
// const ceiling = x => Math.ceil(x);
// const mceiling = x => (Math.ceil(x) < 0 ? 0 : Math.ceil(x));
// const mfloor = x => (Math.floor(x) < 0 ? 0 : Math.floor(x));

export const calculate = (express, record, fixedNumber: number) => {
  let value = '';
  let isMissingInput = false;

  if (_.isNil(record) || _.isNil(express)) {
    return value;
  }

  // let expr = express.replace(/coalesce\(/gi, "").replace(/, 0\)/gi, "");
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
        // variableFieldName.set(exprs[i], `x${startIndex}`);
        startIndex += 1;
      }
    }
  }

  const scope = {};
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
        const extRecord = getValueProp(record, parts[0]);
        if (!_.isNil(extRecord)) {
          if (_.isArray(extRecord)) {
            extRecord.forEach(e => {
              if (e['key'] === parts[1]) {
                fieldValue = e['value'];
              }
            });
          } else {
            fieldValue = getValueProp(extRecord, parts[1]);
          }
        } else {
          fieldValue = getValueProp(record, parts[1]);
        }
      } else {
        fieldValue = getValueProp(record, parts.join(''));
      }
      // const fieldName = k.split(/[[\]"]/).join("");
      if (fieldValue) {
        try {
          if (_.isString(fieldValue)) {
            fieldValue = _.toNumber(fieldValue);
          }
        } catch {
          fieldValue = 0;
        }
        // let key = StringUtils.trimCharNSpace(k, '(')
        // key = StringUtils.trimCharNSpace(k, ')')
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
      // const math = create(all);
      // math.import({ ln, ceiling, mceiling, mfloor });
      expr = expr.toLowerCase();
      // detech Implicit multiplication
      const node = parse(expr);
      // check validate multiplication
      const nodeStr = node.toString({ implicit: 'show' });
      if ((_.countBy(expr)['*'] || 0) !== (_.countBy(nodeStr)['*'] || 0)) {
        return '';
      }
      // if (replaceAll(expr, ' ', '') !== replaceAll(nodeStr, ' ', '')) {
      //   return '';
      // }

      result = evaluate(expr, scope);
      if (result === Number.POSITIVE_INFINITY || result === Number.NEGATIVE_INFINITY) {
        value = translate('messages.ERR_COM_0046');
        if (expr.includes('^')) {
          value = translate('messages.ERR_COM_0047');
        }
      } else if (
        result > Number.MAX_SAFE_INTEGER ||
        result < Number.MIN_SAFE_INTEGER ||
        _.isNaN(result)
      ) {
        value = translate('messages.ERR_COM_0047');
      } else {
        value = format(result, { notation: 'fixed', precision: decimalPlace });
        if (value === 'NaN') {
          value = '';
        }
      }
    } catch (exception) {
      value = '';
    }
  }
  return value;
};
