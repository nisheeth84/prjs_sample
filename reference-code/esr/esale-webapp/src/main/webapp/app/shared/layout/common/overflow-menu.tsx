import React, { useState, useEffect, useRef } from 'react';
import { OVER_FLOW_MENU, OVER_FLOW_MENU_TYPE } from '../dynamic-form/constants';
import { translate } from 'react-jhipster';
import useEventListener from 'app/shared/util/use-event-listener';
import _ from 'lodash';

export interface IOverFlowMenuProps {
  fieldBelong?: number;
  onClickOverFlowMenu?: (actionId, param, dataProductTrading) => void;
  setOpenOverFlow?: (boolean) => void;
  param?: any;
  maxHeight?: number;
  hidePopup?: any;
  dataProductTrading?: any;
  showTooltipActivity?: boolean;
  showToolTipMail?: boolean;
  showTooltipPostData?: boolean;
}

// The item list is not displayed on overflow menu
const arrReject = [
  OVER_FLOW_MENU_TYPE.CUSTOMER.HISTORY_ACTIVITIES,
  OVER_FLOW_MENU_TYPE.EMPLOYEE.HISTORY_ACTIVITIES,
  OVER_FLOW_MENU_TYPE.EMPLOYEE.POST_DATA
]

const OverFlowMenu = (props: IOverFlowMenuProps) => {
  const overFlowMenuRef = useRef(null);
  const [styleOverflow, setStyleOverflow] = useState({});
  const [overFlowMenu, setOverFlowMenu] = useState(OVER_FLOW_MENU[props.fieldBelong]);

  useEffect(() => {
    if(props.showTooltipActivity !== null && !props.showTooltipActivity) {
      // const _overFlowMenu = overFlowMenu.filter(item => item.key !== (OVER_FLOW_MENU_TYPE.CUSTOMER.HISTORY_ACTIVITIES || OVER_FLOW_MENU_TYPE.EMPLOYEE.HISTORY_ACTIVITIES));
      const cloneOverFlowMenu = _.cloneDeep(overFlowMenu);
      const _overFlowMenu = _.reject(
        cloneOverFlowMenu,
        item =>
          arrReject.includes(item.key)
      );
      setOverFlowMenu(_overFlowMenu);
    }
  }, [props.showTooltipActivity])

  useEffect(() => {
    if (!overFlowMenuRef || !overFlowMenuRef.current) {
      return;
    }
    const position = overFlowMenuRef.current.getBoundingClientRect();
    const HEIGHT_ICON_ELLIPSIS = 15;
    const MAX_HEIGHT_OVER_FLOW_MENU = 190;
    const maxHeight = props.maxHeight ? props.maxHeight : MAX_HEIGHT_OVER_FLOW_MENU;
    let dy = 0;
    if (window.innerHeight < position.top - 25 + maxHeight) {
      dy = maxHeight + HEIGHT_ICON_ELLIPSIS;
    }
    setStyleOverflow({ zIndex: 2000, position: 'fixed', left: position.left - 10, top: position.top - 25 - dy });
  }, [overFlowMenuRef])

  const handleClickOutSide = (e) => {
    if (overFlowMenuRef && overFlowMenuRef.current && !overFlowMenuRef.current.contains(e.target)) {
      props.hidePopup && props.hidePopup();
    }
  }

  useEventListener('click', handleClickOutSide);

  /**
   * Render hidden menu
   * @param item 
   */
  const renderHiddenOverFlowMenu = (item) => {
    if (item.key === OVER_FLOW_MENU_TYPE.CUSTOMER.CREATE_MAIL && !props.showToolTipMail) {
      return <></>;
    }
    if ((item.key === OVER_FLOW_MENU_TYPE.BUSINESS_CARD.CREATE_MAIL && !props.showToolTipMail)) {
      return <></>;
    }
    if ((item.key === OVER_FLOW_MENU_TYPE.EMPLOYEE.HISTORY_ACTIVITIES && !props.showTooltipActivity) || (item.key === OVER_FLOW_MENU_TYPE.BUSINESS_CARD.HISTORY_ACTIVITIES && !props.showTooltipActivity)) {
      return <></>;
    }
    if ((item.key === OVER_FLOW_MENU_TYPE.EMPLOYEE.POST_DATA && !props.showTooltipPostData)) {
      return <></>;
    }
  }
  
  return (
    <div className="table-tooltip-wrap" style={styleOverflow} ref={overFlowMenuRef}>
      <div className="table-tooltip-box-no-min-height">
        <div className="box-select-option">
          <ul>
            {overFlowMenu.map((item) => {
              return (
                <>
                {renderHiddenOverFlowMenu(item)}
                <li key={item.key}>
                  <a onClick={(event) => { props.onClickOverFlowMenu(item.key, props.param, props.dataProductTrading); event.stopPropagation() }}>
                    <span className="icon"><img src={item.imgSrc} /> </span>
                    <span className="text">{translate(item.value)}</span>
                  </a>
                </li>
                </>
              )
            })}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default OverFlowMenu;