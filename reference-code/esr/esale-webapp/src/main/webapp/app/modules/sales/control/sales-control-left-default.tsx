// import React, { useState, useCallback, useRef, useEffect } from 'react';
import React, { useState, useCallback, useRef } from 'react';
import useClickOutSide from '../hooks/useClickOutSide';
import { getJsonBName } from 'app/modules/sales/utils';
import DatePicker from 'app/shared/layout/common/date-picker';
import { ScreenMode } from 'app/config/constants';
import { translate } from 'react-jhipster';

export interface ISalesControlLeftDefault {
  dateDefault?: Date,
  fieldLabel?: string,
  fieldInfoHint?: Array<object>,
  onDateChanged?: (day: Date) => void,
}

const SalesControlLeftDefault = (props) => {
  const { fieldLabel, fieldInfoHint, onDateChanged, buttonText, modeDisplay } = props;
  const hintRef = useRef(null);
  // const [date, setDate] = useState(props.dateDefault || new Date());
  const [date] = useState(props.dateDefault || new Date());
  const [showHint, setShowHint] = useState(false);

  useClickOutSide(hintRef, () => setShowHint(false));

  useCallback(() => {
    onDateChanged(date);
  }, [date]);

  const toggle = useCallback(() => {
    setShowHint(!showHint);
  }, [showHint]);

  const checkDisable = () => {
    if (modeDisplay === ScreenMode.DISPLAY) {
      return ''
    } else {
      return 'disable'
    }
  }
  return (
    <div className="align-center-sales left">
      <div className="left d-flex">
        <div className="button-shadow-add-select-wrap">
          <a title="" className={`button-shadow-add-select ${checkDisable()}`}>{buttonText}</a>
          <span className={`button-arrow ${checkDisable()}`}></span>
        </div>
        <DatePicker
          outerDivClass="sales-list-card__date-picker mr-2"
          inputClass="sales-list-card__date-picker-input button-primary button-simple-edit ml-2"
          onDateChanged={d => onDateChanged(d)}
        />
        <span className="mx-2">{fieldLabel}</span>
        <span
          tabIndex={0}
          title=""
          className={`icon-small-primary icon-help-small ${showHint ? 'active' : ''}`}
          ref={hintRef}
          onClick={toggle}
        >
          {showHint && (
            <div className="box-select-option box-highlight">
              <ul>
                {fieldInfoHint.length > 0 &&
                  fieldInfoHint.map(info => (
                    <li key={info.fieldId}>
                      <a className="color-picker" title="">
                        <p>
                          {getJsonBName(info.fieldLabel)}:<span className={`box-color ${info.forwardColor || ''}`}></span>
                        </p>
                        <p>
                          {getJsonBName(info.forwardText)}
                          <span className={`box-color ${info.backwardColor || ''}`}></span>
                          {getJsonBName(info.backwardText)}
                        </p>
                      </a>
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </span>
      </div>
    </div>
  );
}

SalesControlLeftDefault.defaultProps = {
  fieldLabel: translate('sales.top.title.fieldLabel'),
  buttonText: translate('sales.top.title.buttonText')
}

export default React.memo(SalesControlLeftDefault);