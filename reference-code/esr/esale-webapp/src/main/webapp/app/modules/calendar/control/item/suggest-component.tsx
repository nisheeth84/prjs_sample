import React, { useEffect, useRef, useState } from "react";
import { ACTION_LOCAL_NAVIGATION, EnumIconTypeTypes } from "app/modules/calendar/constants";
import { EquipmentTypesType, ScheduleTypesType } from "app/modules/calendar/models/get-local-navigation-type";
import { translate } from 'react-jhipster/lib/src/language';

/**
 * interface SuggestComponent
 */
type ISuggestComponent = {
  listData: any;
  typeComponent?: ACTION_LOCAL_NAVIGATION;
  insertItem?: ((item: ScheduleTypesType) => void) | ((item: EquipmentTypesType) => void);
  dataScreen: any;
  isAdmin?: any;
  setOnOpenPopupScheduleSetting?: any;
  hadShow?
};

/**
 * component suggest
 * @param props
 * @constructor
 */
const SuggestComponent = (props: ISuggestComponent) => {
  /**
   * status show or hidden of component
   */
  const [isShow, setIsShow] = useState(false);
  const wrapperRef = useRef(null);
  /**
   * set show or hidden component
   */
  useEffect(() => {
    if (props.listData && props.listData.length > 0) {
      setIsShow(true);
      props.typeComponent === ACTION_LOCAL_NAVIGATION.SCHEDULE &&  props.hadShow(true)
     
    } else {
      setIsShow(false);
      props.typeComponent === ACTION_LOCAL_NAVIGATION.SCHEDULE &&  props.hadShow(false)
      
    }
  }, [props.listData])

  /**
   * render error
   */
  const renderError = () => {
    return <span className="messenger color-red">{props.listData}</span>
  }

  /**
   * hidden component if clicked on outside of element
   */
  function handleClickOutside(event) {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      setIsShow(false);
    }
  }

  useEffect(() => {
    // Bind the event listener
    document.addEventListener("click", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("click", handleClickOutside);
    };
  }, [wrapperRef]);

  const convertData = (itemSchedule: ScheduleTypesType) => {
    switch (parseInt(itemSchedule.iconType, 10)) {
      case EnumIconTypeTypes.PERSON:
        return { scheduleTypeId: itemSchedule.scheduleTypeId, scheduleTypeName: itemSchedule.scheduleTypeName, className: "icon-calendar-person", icon: itemSchedule.iconName, iconType: itemSchedule.iconType }
      case EnumIconTypeTypes.USER:
        return { scheduleTypeId: itemSchedule.scheduleTypeId, scheduleTypeName: itemSchedule.scheduleTypeName, className: "icon-calendar icon-calendar-person", icon: itemSchedule.iconName, iconType: itemSchedule.iconType }
      case EnumIconTypeTypes.PHONE:
        return { scheduleTypeId: itemSchedule.scheduleTypeId, scheduleTypeName: itemSchedule.scheduleTypeName, className: "icon-calendar icon-calendar-person", icon: itemSchedule.iconName, iconType: itemSchedule.iconType }
      case EnumIconTypeTypes.BAG:
        return { scheduleTypeId: itemSchedule.scheduleTypeId, scheduleTypeName: itemSchedule.scheduleTypeName, className: "icon-calendar icon-calendar-person", icon: itemSchedule.iconName, iconType: itemSchedule.iconType }
      case EnumIconTypeTypes.RECYCLEBIN:
        return { scheduleTypeId: itemSchedule.scheduleTypeId, scheduleTypeName: itemSchedule.scheduleTypeName, className: "icon-calendar icon-calendar-person", icon: itemSchedule.iconName, iconType: itemSchedule.iconType }
      case EnumIconTypeTypes.BELL:
        return { scheduleTypeId: itemSchedule.scheduleTypeId, scheduleTypeName: itemSchedule.scheduleTypeName, className: "icon-calendar icon-calendar-person", icon: itemSchedule.iconName, iconType: itemSchedule.iconType }
      case EnumIconTypeTypes.TEXT:
        return { scheduleTypeId: itemSchedule.scheduleTypeId, scheduleTypeName: itemSchedule.scheduleTypeName, className: "icon-calendar-person", icon: itemSchedule.iconName, iconType: itemSchedule.iconType }
      default:
        return {
          scheduleTypeId: itemSchedule.scheduleTypeId,
          scheduleTypeName: itemSchedule.scheduleTypeName,
          className: "icon-calendar-person",
          icon: itemSchedule.iconPath,
          iconType: itemSchedule.iconType
        }
    }
  }

  /**
   * render suggest schedule
   */
  const renderSchedule = () => {
    return isShow &&
      (typeof props.listData !== 'string'
        ?
        <div className="drop-down drop-down2 w100 h-auto" key={'schedule-suggestion'}>
          <ul className="dropdown-item style-3 overflow-hover calendar">
            {
              Array.isArray(props.listData) &&
              props.listData.map((item: ScheduleTypesType, idx: number) => {
                const convert = convertData(item)
                return (props.dataScreen.some((obj: ScheduleTypesType) => obj.scheduleTypeId === item.scheduleTypeId))
                  ?
                  <li className="item active smooth"
                    key={`scheduleTypeSelected_${idx}`}>
                    <div className="item2">
                      <label className="text-ellipsis"><img className={convert.className} src={convert.iconType && convert.iconType.toString() === '0' ? convert.icon : `../../../content/images/common/calendar/${convert.icon}`} alt="" />{item?.scheduleTypeName}
                        {/* <div className="text text1" style={{ paddingTop: '5px', paddingBottom: '5px' }}>{item?.scheduleTypeName}</div> */}</label>

                    </div>
                  </li>
                  :
                  <li className="item smooth"
                    onClick={() => props.insertItem && props.insertItem(item)}
                    key={`scheduleTypeCanSelect_${idx}`}>
                    <div className="item2">
                      <label className="text-ellipsis"><img className={convert.className} src={convert.iconType && convert.iconType.toString() === '0' ? convert.icon : `../../../content/images/common/calendar/${convert.icon}`} alt="" />{item?.scheduleTypeName}
                        {/* <div className="text text1" style={{ paddingTop: '5px', paddingBottom: '5px' }}>{item?.scheduleTypeName}</div> */}</label>
                    </div>
                  </li>
              })
            }
          </ul>
          <div className="form-group border-top mt-1 pt-2">
            <div className="setting-button">
              <div className="text text2">
                {
                  props.isAdmin && (
                    <>
                      <a title="" className="button-add-new mt-3" onClick={() => props.setOnOpenPopupScheduleSetting(true)} >
                        {translate('calendars.form.register_type')}
                      </a>
                    </>
                  )
                }
              </div>
            </div>
          </div>
        </div>
        : renderError()
      )
  }

  /**
   * render suggest equipments
   */
  const renderEquipments = () => {
    return isShow &&
      (typeof props.listData !== 'string'
        ?
        <div className="drop-down drop-down2 w100 h-auto" key={'equipment-suggestion'}>
          <ul className="dropdown-item style-3 overflow-hover calendar">
            {
              Array.isArray(props.listData) &&
              props.listData.map((item: EquipmentTypesType, idx: number) => {
                return (props.dataScreen.some((obj: EquipmentTypesType) => obj.equipmentTypeId === item.equipmentTypeId))
                  ?
                  <li className="item active smooth"
                    key={`equipmentSelected_${idx}`}>
                    <div className="item2">
                      <div className="content">
                        <div className="text text1 padding-bottom-5-px padding-top-5-px text-ellipsis">{item?.equipmentTypeName}</div>
                      </div>
                    </div>
                  </li>
                  :
                  <li className="item smooth"
                    onClick={() => props.insertItem && props.insertItem(item)}
                    key={`equipmentCanSelect_${idx}`}>
                    <div className="item2">
                      <div className="content">
                        <div className="text text1 padding-bottom-5-px padding-top-5-px text-ellipsis">{item?.equipmentTypeName}</div>
                      </div>
                    </div>
                  </li>
              })
            }
          </ul>
          <div className="form-group border-top mt-1 pt-2">
            <div className="setting-button">
              <div className="text text2">
                {
                  props.isAdmin && (
                    <>
                      <a title="" className="button-add-new mt-3 font-size-small " onClick={() => props.setOnOpenPopupScheduleSetting(true)} >
                        {translate('calendars.form.add_meeting_room_and_equipment')}
                      </a>
                    </>
                  )
                }
              </div>
            </div>
          </div>
        </div>
        
        : renderError()
      )
  }

  return <>
    {[
      props.typeComponent === ACTION_LOCAL_NAVIGATION.SCHEDULE && renderSchedule(),
      props.typeComponent === ACTION_LOCAL_NAVIGATION.EQUIPMENT && renderEquipments()
    ]}
  </>
}

export default SuggestComponent;
