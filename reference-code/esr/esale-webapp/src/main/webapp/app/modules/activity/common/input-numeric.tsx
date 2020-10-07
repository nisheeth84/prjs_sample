import React, {useEffect, useState, forwardRef, useImperativeHandle} from 'react';
import { replaceAll } from '../../../../app/shared/util/string-utils';
import { CommonUtil } from './common-util';
import { toKatakana } from 'app/shared/util/string-utils';

type IInputNumericProp = {
  defaultValue?: any;
  wrapLabel?: any,
  errorInfo?: any,
  isDisabled?: any,
  inputClassName?: any,
  placeholder?: any,
  decimalPlace?: any,
  enterInputControl?: (event: any) => void; // callback when user pressed enter key
  updateStateElement?: (objEditValue: string | any) => void; // callback when change status control
  isPositive?: boolean;
}

const InputNumeric = forwardRef((props: IInputNumericProp, ref) => {
  const [valueEdit, setValueEdit] = useState(CommonUtil.autoFormatNumber(props.defaultValue));


  /**
   * check is number RegExp
   *
   * @param strValue
   */
  const isValidNumber = (strValue: string) => {
    if (!strValue || strValue.trim().length < 1) {
      return true;
    }
    let strNumber = replaceAll(strValue,',', '');
    if (strNumber.charAt(strNumber.length -1) === '.') {
      strNumber = strNumber.substring(0, strNumber.length - 1);
    }
    if (props.decimalPlace && props.decimalPlace > 0) {
      return (new RegExp(`^[-+]?\\d*\\.?\\d{0,${props.decimalPlace}}$`, "g")).test(strNumber);
    } else {
      return (/^[-+]?\d*$/g).test(strNumber);
    }
  }

  /**
   * validate when user input
   *
   * @param event
   */
  const onChangeValueEdit = (event) => {
    if (event.target.value === '' || isValidNumber(event.target.value)) {
      if(props.isPositive && Number(event.target.value) < 0)
        return;
      setValueEdit(event.target.value);
    }
  }

  /**
   * textEditHandleKeyUp
   *
   * @param event
   */
  const textEditHandleKeyUp = (event) => {
    setValueEdit(event.target.value);
  }

  /**
   * when KeyDown auto display whith decimalPart
   *
   * @param e
   */
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && props.enterInputControl) {
      props.enterInputControl(e);
      event.preventDefault();
    }
  }

  useEffect(() => {
    if (!props.isDisabled && props.updateStateElement) {
      props.updateStateElement( valueEdit  ? replaceAll(valueEdit.toString(),',','') : '');
    }
  }, [valueEdit]);

  useEffect(() => {
    setValueEdit(CommonUtil.autoFormatNumber(props.defaultValue?.toString() || ""));
  }, [props.defaultValue]);


  useImperativeHandle(ref, () => ({
    setValueEdit(value){
      setValueEdit(CommonUtil.autoFormatNumber(value?.toString() || ""));
    }
  }));
  
  return (
    <>
      <div className={`form-control-wrap ${props.errorInfo ? 'error' : ''}`}>
        <input disabled={props.isDisabled}
          type="text"
          className={`input-normal ${props.inputClassName} ${props.errorInfo ? 'error' : ''} ${props.isDisabled ? 'disable' : ''} `}
          placeholder={props.placeholder}
          value={valueEdit}
          onBlur={() => setValueEdit(CommonUtil.autoFormatNumber(toKatakana(valueEdit)))}
          onFocus={() => setValueEdit(replaceAll( valueEdit ? valueEdit.toString() : "",',', ''))}
          onChange={onChangeValueEdit}
          onKeyUp={textEditHandleKeyUp}
          onKeyDown={handleKeyDown}
        />
        {props.wrapLabel &&
          <span className="currency">{props.wrapLabel}</span>
        }

        {/* {valueEdit.length > 0 && <span className="delete" onClick={() => setValueEdit('')} />} */}

        {/* {msg && <span className="messenger">{msg}</span>} */}
      </div>
    </>
  )
})

const mapStateToProps = () => ({
});

const mapDispatchToProps = {
};


export default InputNumeric;
