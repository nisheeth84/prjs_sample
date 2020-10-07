import React, { useEffect, useRef, useState } from 'react';
import { translate } from "react-jhipster";
import { Link } from "react-router-dom";
import { ID_FIELD_INFO } from "app/modules/calendar/constants";
import moment from 'moment';
import { onChangeDateOnCick, resetDataForm } from '../popups/create-edit-schedule.reducer'
import {onShowPopupCreate} from '../popups/create-edit-schedule.reducer'
import { connect } from 'react-redux';

type IPopupListCreate = DispatchProps & {
  onClosePopup?: (param?: ID_FIELD_INFO) => void
  dateOnClick?: moment.Moment
  position?: any
}

const PopupListCreate = (props: IPopupListCreate) => {

  const wrapperRef = useRef(null);
  const [top,] = useState(props.position.top)
  const [left,] = useState(props.position.left)

  const handleClickOutside = (event) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      props.onClosePopup();
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside, false);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside, false);
    };
  }, []);

  return <>
    <div className="box-select-option box-popup-click-date" ref={wrapperRef} style={{left, top}}>
      <ul>
        <li onClick={() => { 
          props.resetDataForm();
          props.onChangeDateOnCick(props.dateOnClick); 
          props.onShowPopupCreate(true);
        }}>
          <a title="" onClick={() => props.onClosePopup(ID_FIELD_INFO.SCHEDULE)}>
            <img title="" src="../../../content/images/ic-sidebar-calendar.svg" alt="" />
            {translate('calendars.popupListCreate.createSchedule')}
          </a>
        </li>
        <li>
          <a title="" onClick={() => props.onClosePopup(ID_FIELD_INFO.TASK)}>
            <img title="" src="../../../content\images\task\ic-time1.svg" alt="" />
            {translate('calendars.popupListCreate.createTask')}
          </a>
        </li>
        <li>
          <a title="" onClick={() => props.onClosePopup(ID_FIELD_INFO.MILESTONE)}>
            <img title="" src="../../../content\images\task\ic-flag-brown.svg" alt="" />
            {translate('calendars.popupListCreate.createMilestone')}
          </a>
        </li>
      </ul>
    </div>
  </>
}

const mapDispatchToProps = {
  onChangeDateOnCick,
  onShowPopupCreate,
  resetDataForm
}

type DispatchProps = typeof mapDispatchToProps

export default connect(
  null,
  mapDispatchToProps
)(PopupListCreate);
