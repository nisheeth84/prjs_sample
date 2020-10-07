import React, {useEffect, useRef, useState} from "react";
import {TYPE_SETTING} from "app/modules/calendar/control/calendar-control-sidebar";
import {translate} from "react-jhipster";
import {setOverFlow} from "app/modules/calendar/grid/calendar-grid.reducer";
import {connect} from "react-redux";

/**
 * interface
 */
type ISettingComponent = DispatchProps & {
  type?: any,
  item?: any,
  actionRemove?: (itemId) => void,
}

/**
 * component setting show action remove equipment type, schedule type
 * @param props
 * @constructor
 */
const SettingComponent = (props: ISettingComponent) => {
  const wrapperRef = useRef(null);
  const [isShow, setIsShow] = useState(false);
  /**
   * hidden component if clicked on outside of element
   */
  function handleClickOutside(event) {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      setIsShow(false);
    }
  }

  /**
   * set overFlow
   */
  useEffect(() => {
      props.setOverFlow(isShow);
  }, [isShow]);

  /**
   * add Event
   */
  useEffect(() => {
    // Bind the event listener
    document.addEventListener("click", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("click", handleClickOutside);
    };
  }, [wrapperRef]);

  return <div className="change-color z-index-global-2" ref={wrapperRef} onClick={() => setIsShow(!isShow)}>
    <a className="change-color-image" title="">
      <img src="../../../content/images/common/ic-sort-blue.svg" alt="" title="" className="sort-blue"/>
    </a>
    {isShow &&
    <div className="box-select-option box-select-option-popup popup-text box-select-setting-scheudle-equipment">
      <ul className="m-0">
        <li className="p-0 m-1" onClick={() => {
          if (props.type === TYPE_SETTING.schedule && props.actionRemove) props.actionRemove(props.item.scheduleTypeId);
          if (props.type === TYPE_SETTING.equipment && props.actionRemove) props.actionRemove(props.item.equipmentTypeId);
        }}>
          <a title="" className="remove-item">
            {[
              props.type === TYPE_SETTING.schedule && translate('calendars.controls.sidebarMenu.removeItemSchedule'),
              props.type === TYPE_SETTING.equipment && translate('calendars.controls.sidebarMenu.removeEquipmentSchedule'),
            ]}
          </a>
        </li>
      </ul>
    </div>}
  </div>
}

const mapStateToProps = () => ({})
const mapDispatchToProps = {
  setOverFlow,
}

type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps,
  mapDispatchToProps
)(SettingComponent);
