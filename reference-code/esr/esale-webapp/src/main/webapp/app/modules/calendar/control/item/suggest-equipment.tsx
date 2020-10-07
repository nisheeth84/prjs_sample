import React, { useEffect, useRef, useState } from "react";
import { ACTION_LOCAL_NAVIGATION } from "app/modules/calendar/constants";
import { Equipment } from "app/modules/calendar/models/get-local-navigation-type";
import { IScheduleTypes } from "app/modules/calendar/models/get-schedule-types-type";
import { translate } from 'react-jhipster/lib/src/language';

/**
 * interface SuggestComponent
 */
type ISuggestEquipment = {
  listData: any;
  typeComponent?: ACTION_LOCAL_NAVIGATION;
  insertItem?: ((item: IScheduleTypes) => void) | ((item: Equipment) => void);
  setOpenPopupSettingEquip?: any;
  dataScreen?: any;
  isAdmin: any
};

/**
 * component suggest
 * @param props
 * @constructor
 */
const SuggestEquipment = (props: ISuggestEquipment) => {
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
    } else {
      setIsShow(false);
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

  /**
   * render suggest equipments
   */
  const renderEquipments = () => {
    return isShow &&
      (typeof props.listData !== 'string'
        ?
        <div className="drop-down w100" ref={wrapperRef} key={'equipment-suggestion'}>
          <ul className="dropdown-item style-3 overflow-hover calendar">
            {
              Array.isArray(props.listData) &&
              props.listData.map((item: Equipment, idx: number) => {
                return (props.dataScreen.some((obj: Equipment) => obj.equipmentId === item.equipmentId))
                  ?
                  <li className="item active smooth"
                    key={`equipmentSelected_${idx}`}>
                    <div className="item2">
                      <div className="content">
                        <div className="text text1 padding-top-5-px padding-bottom-5-px text-ellipsis">{item?.equipmentName}</div>
                      </div>
                    </div>
                  </li>
                  :
                  <li className="item smooth"
                    onClick={() => props.insertItem && props.insertItem(item)}
                    key={`equipmentCanSelect_${idx}`}>
                    <div className="item2">
                      <div className="content">
                        <div className="text text1 padding-top-5-px padding-bottom-5-px text-ellipsis">{item?.equipmentTypeName}</div>
                        <div className="text text2 padding-top-5-px padding-bottom-5-px text-ellipsis">{item?.equipmentName}</div>
                      </div>
                    </div>
                  </li>
              })
            }
          </ul>
          <div className="form-group search bottom_unset">
            <form action="">
              <button className="submit" type="submit" />
              <input type="text" placeholder={translate('calendars.search.title')} />
            </form>
            {
              props.isAdmin &&
              <a title=""
                className="button-primary button-add-new add"
                onClick={() => props.setOpenPopupSettingEquip(true)}
              >
                {translate('calendars.equipments.newAddition')}
              </a>
            }
          </div>
        </div>
        : renderError()
      )
  }

  return <>
    {[
      props.typeComponent === ACTION_LOCAL_NAVIGATION.EQUIPMENT && renderEquipments()
    ]}
  </>
}

export default SuggestEquipment;
