import React, { useState, useEffect, useRef } from 'react';
import _ from 'lodash';
import { translate } from 'react-jhipster';
import useEventListener from 'app/shared/util/use-event-listener';

export interface ITabDisplaySettingProps {
  item?: any;
  isDisabled?: boolean;
  isListType?: boolean;
  onSelectDislaySummary?: (editedItem: any) => void;
}
// Default max display record
const MAX_DISPLAY_RECORD = 5;

const TabDisplaySetting = (props: ITabDisplaySettingProps) => {
  const [maxRecord, setMaxRecord] = useState(props.item.maxRecord); // state max record
  const [openDropDown, setOpenDropDown] = useState(false); // State check pulldown is open
  const [isDisplaySummary, setIsDisplaySummary] = useState(props.item.isDisplaySummary); // State determine if display
  const optionRef = useRef(null); // ref to handle when clicking out pulldown

  /**
   * Handle open/close pulldown
   */
  const changePulldown = () => {
    if (!props.isDisabled) {
      setOpenDropDown(!openDropDown);
    }
  };

  /**
   * Handle on change radio button
   * @param isDisplay : determine if display summary
   */
  const onChangeDisplaySummary = (isDisplay: boolean) => {
    setIsDisplaySummary(isDisplay);
  };

  /**
   * Handle when clicking out pulldown
   * @param e : event
   */
  const handleClickOutsideOption = event => {
    if (optionRef.current && !optionRef.current.contains(event.target)) {
      setOpenDropDown(false);
    }
  };

  useEventListener('mousedown', handleClickOutsideOption);

  useEffect(() => {
    const editedItem = { ...props.item, ...{ maxRecord, isDisplaySummary } };
    props.onSelectDislaySummary(editedItem);
  }, [isDisplaySummary, maxRecord]);

  return (
    <div className="show-search v2 mb-3">
      <div className="wrap-check-radio">
        <p className="radio-item" onClick={() => onChangeDisplaySummary(true)}>
          <input
            type="radio"
            id={`radio4-${props.item.tabId}`}
            name={`radio-group214-${props.item.tabId}`}
            checked={isDisplaySummary === true}
          />
          <label htmlFor="radio4">{translate('global.tab-display-setting.display-basic-info')}</label>
        </p>
        <p className="radio-item" onClick={() => onChangeDisplaySummary(false)}>
          <input
            type="radio"
            id={`radio5-${props.item.tabId}`}
            name={`radio-group214-${props.item.tabId}`}
            checked={isDisplaySummary === false}
          />
          <label htmlFor="radio5">{translate('global.tab-display-setting.not-display-basic-info')}</label>
        </p>
      </div>
      {props.isListType && (
        <div className="form-control-wrap form-control-wrap2 mt-3">
          {translate('global.tab-display-setting.max-display-number')}{' '}
          <div className="d-inline-block position-relative" ref={optionRef}>
            <a className="button-pull-down-small pl-3" onClick={() => changePulldown()}>
              <span className="pr-3">{maxRecord}</span>
            </a>
            {openDropDown && (
              <div className="box-select-option mw-auto w100 z-index-1 font-size-12">
                <ul>
                  {_.range(MAX_DISPLAY_RECORD).map(e => {
                    return (
                      <li
                        key={e}
                        onClick={() => {
                          setMaxRecord(e + 1);
                          changePulldown();
                        }}
                      >
                        <a title="">{e + 1}</a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>{' '}
          {translate('global.tab-display-setting.unit')}
        </div>
      )}
    </div>
  );
};

export default TabDisplaySetting;
