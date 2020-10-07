import React, { useImperativeHandle, forwardRef, useRef, useState, useEffect } from 'react'
import { IDynamicFieldProps } from '../interface/dynamic-field-props';
import { Modal } from 'reactstrap';
import StringUtils, { findErrorMessage, getFieldLabel, toKatakana } from 'app/shared/util/string-utils';
import { translate } from 'react-jhipster';
import _ from 'lodash';
import { DEFINE_FIELD_TYPE } from '../../constants';
import { parse } from 'mathjs'

interface IFieldDetailEditCalcOwnProps {
  services?: any[]
  fieldsInfo: any[]
}


type IFieldDetailEditCalculationProps = IDynamicFieldProps & IFieldDetailEditCalcOwnProps

const FieldDetailEditCalculation = forwardRef((props: IFieldDetailEditCalculationProps, ref) => {
  const fieldMaxlength = 4000;
  const [showFuncMath, setShowFuncMath] = useState(false);
  const [numberDecimal, setNumberDecimal] = useState(0);
  const [showSelectDecimal, setShowSelectDecimal] = useState(false);
  const [expression, setExpression] = useState('');
  const [calFieldInfos, setCalFieldInfos] = useState([]);
  const ddSelectDecimal = useRef(null)  // React.createRef();

  const compareFieldLabel = (item, fieldLabel, propValue) => {
    if (!item) {
      return false;
    }
    if (Object.prototype.hasOwnProperty.call(item, fieldLabel)) {
      try {
        const labels = _.isString(item[fieldLabel]) ? JSON.parse(item[fieldLabel]) : item[fieldLabel];
        for (const label in labels) {
          if (Object.prototype.hasOwnProperty.call(labels, label)) {
            if (_.isEqual(propValue, _.get(labels, label))) {
              return true
            }
          }
        }

      } catch (e) {
        return false;
      }
    }
    return false;
  }

  const convertExprToDisplay = (expr: string) => {
    if (!expr || expr.trim().length < 1) {
      return '';
    }
    
    // const exprCustom = expr.replace(/coalesce\(/gi, "").replace(/, 0\)/gi, "");
    let result = expr;
    let serviceName = '';
    if (props.services) {
      const idx = props.services.findIndex(e => e.serviceId === props.belong)
      if (idx >= 0) {
        serviceName = getFieldLabel(props.services[idx], 'serviceName');
      }
    }
    if (expr && expr.match(/\(([a-z].*?)\)(::float8)?/g)) {
      const exprs = expr.match(/\(([a-z].*?)\)(::float8)?/g);
      for (let i = 0; i < exprs.length; i++) {
        let itemTmp = exprs[i].replace("::float8", "")
        itemTmp = itemTmp.replace(/''/gi, "")
        const items = itemTmp.split(/[(\\)"]/).join("").split("->");
        if (items.length < 1) {
          continue;
        }
        const fieldName = items[items.length - 1];
        if (!props.fieldsInfo) {
          continue;
        }
        const fIdx = props.fieldsInfo.findIndex(e => e.fieldName === fieldName);
        if (fIdx < 0) {
          continue;
        }
        const fieldLabel = getFieldLabel(props.fieldsInfo[fIdx], 'fieldLabel');
        const newField = serviceName.length > 0 ? `["${serviceName}"."${fieldLabel}"]` : `["${fieldLabel}"]`
        result = result.split(`(${StringUtils.trimCharNSpace(exprs[i], '(')}`).join(newField);
        // result = result.split(exprs[i]).join(newField);
      }
    }
    return result;
  }

  const convertDisplayToExpr = (expr: string) => {
    if (!expr || expr.trim().length < 1) {
      return '';
    }
    let result = expr;
    if (expr && expr.match(/\[(.*?)\]/g)) {
      const exprs = expr.match(/\[(.*?)\]/g);
      for (let i = 0; i < exprs.length; i++) {
        const items = exprs[i].split(/[[\]"]/).join("").split(".");
        if (items.length < 1) {
          continue;
        }
        const fieldLabel = items[items.length - 1];
        const fIdx = calFieldInfos.findIndex(e => compareFieldLabel(e, 'fieldLabel', fieldLabel));
        if (fIdx < 0) {
          continue;
        }
        const fieldName = StringUtils.getValuePropStr(calFieldInfos[fIdx], 'fieldName');
        // const newField = !calFieldInfos[fIdx].isDefault ? `coalesce((${props.fieldNameExtension}->''${fieldName}'')::float8, 0)` : `coalesce((${fieldName}), 0)`
        const newField = !calFieldInfos[fIdx].isDefault ? `(${props.fieldNameExtension}->''${fieldName}'')::float8` : `(${fieldName})`
        result = result.split(exprs[i]).join(newField);
      }
    }
    return result;
  }

  const handleUserMouseDown = (event) => {
    if (ddSelectDecimal.current && !ddSelectDecimal.current.contains(event.target)) {
      setShowSelectDecimal(false);
    }
  };

  useImperativeHandle(ref, () => ({
    isValidate() {
      if (!expression) {
        return true;
      }
      try {
        parse(convertDisplayToExpr(expression))
      } catch (error) {
        return false;
      }
    },
  }));

  useEffect(() => {
    window.addEventListener('mousedown', handleUserMouseDown);
    return () => {
      window.removeEventListener('mousedown', handleUserMouseDown);
    };
  }, []);


  useEffect(() => {
    const tmp = [];
    if (props.fieldsInfo) {
      tmp.push(...props.fieldsInfo.filter(e => e.fieldType.toString() === DEFINE_FIELD_TYPE.NUMERIC && e.fieldId !== props.fieldInfo.fieldId))
      setCalFieldInfos(tmp)
    }
    const expr = StringUtils.getValuePropStr(props.fieldInfo, 'configValue');
    setExpression(convertExprToDisplay(expr))
    const decimalPlace = StringUtils.getValuePropStr(props.fieldInfo, 'decimalPlace');
    if (decimalPlace) {
      setNumberDecimal(+decimalPlace);
    }
  }, [props.fieldsInfo, props.fieldInfo, props.services])

  useEffect(() => {
    if (props.updateStateElement) {
      props.updateStateElement(props.fieldInfo, DEFINE_FIELD_TYPE.CALCULATION, { configValue: convertDisplayToExpr(expression), decimalPlace: numberDecimal })
    }
  }, [numberDecimal, expression])

  const chooseFieldCalc = (e, field) => {
    let functionName = "";
    if (props.services && props.belong) {
      const idx = props.services.findIndex(o => o.serviceId.toString() === props.belong.toString())
      if (idx >= 0) {
        functionName = `"${getFieldLabel(props.services[idx], 'serviceName')}".`;
      }
    }
    const fieldLabel = `"${getFieldLabel(field, 'fieldLabel')}"`
    setExpression(`${expression}[${functionName}${fieldLabel}]`)
  }

  const onChangeExpression = (e) => {
    setExpression(e.target.value);
  }

  const convertToKatakana = (e) => {
    if(e.target.value.length <= fieldMaxlength) {
    setExpression(toKatakana(e.target.value));
    }
  }

  const renderFunctionMaths = () => {
    return (
      <div className="modal popup-esr popup-esr4 user-popup-page popup-align-right show" aria-hidden="true">
        <div className="modal-dialog form-popup">
          <div className="modal-content">
            <div className="modal-header no-border">
              <div className="left">
                <div className="popup-button-back"><span className="text no-icon font-size-24">{translate('dynamic-control.layoutCalculation.expressions_can_use')}</span></div>
              </div>
              <div className="right">
                <a onClick={() => setShowFuncMath(false)} className="icon-small-primary icon-close-up-small"></a>
              </div>
            </div>
            <div className="modal-body style-3">
              <div className="popup-content  style-3">
                <h3 className="font-size-18 mb-3">{translate('dynamic-control.layoutCalculation.arithmetic_operators')}</h3>
                <table className="table-dot">
                  <tbody>
                    <tr>
                      <td className="width-175"><strong>{translate('dynamic-control.layoutCalculation.addition')}</strong></td>
                      <td>{translate('dynamic-control.layoutCalculation.calculate_sum_two_values')}</td>
                    </tr>
                    <tr>
                      <td><strong>{translate('dynamic-control.layoutCalculation.subtract')}</strong></td>
                      <td>{translate('dynamic-control.layoutCalculation.calculate_sub_two_values')}</td>
                    </tr>
                    <tr>
                      <td><strong>{translate('dynamic-control.layoutCalculation.multiplication')}</strong></td>
                      <td>{translate('dynamic-control.layoutCalculation.multiply_value')}</td>
                    </tr>
                    <tr>
                      <td><strong>{translate('dynamic-control.layoutCalculation.division')}</strong></td>
                      <td>{translate('dynamic-control.layoutCalculation.divide_value')}</td>
                    </tr>
                    <tr>
                      <td><strong>{translate('dynamic-control.layoutCalculation.power')}</strong></td>
                      <td>{translate('dynamic-control.layoutCalculation.mutilply_by_power')}</td>
                    </tr>
                    <tr>
                      <td><strong>{translate('dynamic-control.layoutCalculation.open_and_close_brackets')}</strong></td>
                      <td>{translate('dynamic-control.layoutCalculation.specifies_expression_with_bracket')}</td>
                    </tr>
                  </tbody>
                </table>
                {/* <h3 className="font-size-18 mt-5 mb-3">{translate('dynamic-control.layoutCalculation.arithmetic_operators')}</h3>
                <table className="table-dot">
                  <tbody>
                    <tr>
                      <td><strong>{translate('dynamic-control.layoutCalculation.abs')}</strong></td>
                      <td>{translate('dynamic-control.layoutCalculation.calculate_absolute_value')}</td>
                    </tr>
                    <tr>
                      <td><strong>{translate('dynamic-control.layoutCalculation.ceiling')}</strong></td>
                      <td>{translate('dynamic-control.layoutCalculation.upto_whole_number')}</td>
                    </tr>
                    <tr>
                      <td><strong>{translate('dynamic-control.layoutCalculation.exp')}</strong></td>
                      <td>{translate('dynamic-control.layoutCalculation.e_multiply_by_exponent')}</td>
                    </tr>
                    <tr>
                      <td><strong>{translate('dynamic-control.layoutCalculation.floor')}</strong></td>
                      <td>{translate('dynamic-control.layoutCalculation.downto_whole_number')}</td>
                    </tr>
                    <tr>
                      <td><strong>{translate('dynamic-control.layoutCalculation.ln')}</strong></td>
                      <td>{translate('dynamic-control.layoutCalculation.natural_logarit')}</td>
                    </tr>
                    <tr>
                      <td><strong>{translate('dynamic-control.layoutCalculation.log')}</strong></td>
                      <td>{translate('dynamic-control.layoutCalculation.logarit_base10')}</td>
                    </tr>
                    <tr>
                      <td><strong>{translate('dynamic-control.layoutCalculation.max')}</strong></td>
                      <td>{translate('dynamic-control.layoutCalculation.max_of_list')}</td>
                    </tr>
                    <tr>
                      <td><strong>{translate('dynamic-control.layoutCalculation.mceiling')}</strong></td>
                      <td>{translate('dynamic-control.layoutCalculation.upto_whole_number1')}</td>
                    </tr>
                    <tr>
                      <td><strong>{translate('dynamic-control.layoutCalculation.mfloor')}</strong></td>
                      <td>{translate('dynamic-control.layoutCalculation.downto_whole_number1')}</td>
                    </tr>
                    <tr>
                      <td><strong>{translate('dynamic-control.layoutCalculation.min')}</strong></td>
                      <td>{translate('dynamic-control.layoutCalculation.min_of_list')}</td>
                    </tr>
                    <tr>
                      <td><strong>{translate('dynamic-control.layoutCalculation.mod')}</strong></td>
                      <td>{translate('dynamic-control.layoutCalculation.mod_subcri')}</td>
                    </tr>
                    <tr>
                      <td><strong>{translate('dynamic-control.layoutCalculation.round')}</strong></td>
                      <td>{translate('dynamic-control.layoutCalculation.round_subcri')}</td>
                    </tr>
                    <tr>
                      <td><strong>{translate('dynamic-control.layoutCalculation.sqrt')}</strong></td>
                      <td>{translate('dynamic-control.layoutCalculation.sqrt_subcri')}</td>
                    </tr>
                  </tbody>
                </table> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleEnterKey = (event) => {
    if (event.key === 'Enter') {
      setShowFuncMath(true)
    }
  }

  const renderComponent = () => {
    const msg = findErrorMessage(props.errorInfos, 'configValue');
    return (
      <>
        <div className="form-group">
          <div>{translate('dynamic-control.layoutCalculation.arithmetic_expr')}<span className="ml-2 label-red">{translate('dynamic-control.fieldDetail.common.label.required')}</span>
          <a role="button" tabIndex={0} onKeyPress={e => handleEnterKey(e)} onClick={() => setShowFuncMath(true)} className="text-blue ml-4 text-underline">{translate('dynamic-control.layoutCalculation.fomular_can_use')}</a></div>
        </div>
        <div className={`overflow-hidden textarea-hidden-scroll ${msg ? 'error' : ''}`}>
          <textarea
            className={`input-normal resize-none w100 ${msg ? 'error' : ''}`}
            placeholder={translate('dynamic-control.layoutCalculation.placeHolder_enter_fomular')}
            value={expression}
            onChange={onChangeExpression}
            onBlur={convertToKatakana}
          />
        </div>
        {msg && <span className="messenger-error">{msg}</span>}
        {calFieldInfos.length > 0 &&
          <div className="box-link-border">
            {calFieldInfos.map((e, idx) =>
              <a key={idx} onClick={(ev) => chooseFieldCalc(ev, e)} >{getFieldLabel(e, 'fieldLabel')}{idx < (calFieldInfos.length - 1) && <span>&emsp;</span>}</a>
            )}
          </div>
        }
        <div className="form-group">
          <label>{translate('dynamic-control.layoutCalculation.below_decimal_point')}</label>
          <div className="select-option">
            <button type="button" className="select-text text-left"  onClick={() => setShowSelectDecimal(!showSelectDecimal)}>{`${numberDecimal !== 0 ? 
            numberDecimal + translate('dynamic-control.layoutCalculation.digit') : translate('dynamic-control.layoutCalculation.doNotUse')}`}</button>
            {showSelectDecimal &&
              <div ref={ddSelectDecimal} className="drop-down">
                <ul>
                  {_.range(15).map((n, idx) =>
                    <li key={idx} className={`item ${idx === numberDecimal ? 'active' : ''} smooth`}
                      onClick={() => { setNumberDecimal(idx); setShowSelectDecimal(false) }}
                    >
                      <div className="text text2">{`${idx !== 0 ? idx + translate('dynamic-control.layoutCalculation.digit') : translate('dynamic-control.layoutCalculation.doNotUse')}`}</div>
                    </li>
                  )}
                </ul>
              </div>
            }
          </div>
        </div>
        {showFuncMath &&
          <Modal isOpen={true} fade={true} toggle={() => { }} backdrop={true} autoFocus={true} zIndex="auto">
            {renderFunctionMaths()}
          </Modal>}
      </>
    );
  }
  return renderComponent();
});

export default FieldDetailEditCalculation
