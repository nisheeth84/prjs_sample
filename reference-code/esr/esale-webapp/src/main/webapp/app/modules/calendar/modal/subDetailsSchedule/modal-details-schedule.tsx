import React, { useEffect, useRef } from 'react';

import {
  getScheduleById,
  getMilestoneById,
  getTaskById,
  hideModalSubDetail,
} from "app/modules/calendar/modal/calendar-modal.reducer";
import { connect } from "react-redux";
import { IRootState } from "app/shared/reducers";
import ModalFooter from "app/modules/calendar/modal/subDetailsSchedule/modal-footer";
import ModalHeader from "app/modules/calendar/modal/subDetailsSchedule/modal-header";
import { ItemTypeSchedule } from "app/modules/calendar/constants";
import TipMilestone from "app/modules/calendar/modal/subDetailsSchedule/tip-milestone-details";
import TipTaskDetails from "app/modules/calendar/modal/subDetailsSchedule/tip-task-details";
import TipScheduleDetails from "app/modules/calendar/modal/subDetailsSchedule/tip-schedule-details";

/**
 * interface of modal sub detail
 */
type DataOfSchedule = StateProps & DispatchProps

/**
 * component modal sub detail
 * @param props
 * @constructor
 */
const ModalSubDetailsSchedule = (props: DataOfSchedule) => {
  const wrapperRef = useRef(null);
  
  /**
   * call api
   */
  useEffect(() => {
    if (props.itemId && props.itemType) {
      switch (props.itemType) {
        case ItemTypeSchedule.Milestone: {
          props.getMilestoneById(props.itemId);
          break;
        }
        case ItemTypeSchedule.Task: {
          props.getTaskById(props.itemId);
          break;
        }
        case ItemTypeSchedule.Schedule: {
          props.getScheduleById(props.itemId);
          break;
        }
        default:
      }
    }
  }, [props.itemId])
  /**
   * render Tip Milestone
   */
  const renderTipMilestone = () => {
    if (props.itemType === ItemTypeSchedule.Milestone) {
      return (
        <TipMilestone />
      );
    }
  }
  /**
   * render Tip Task
   */
  const renderTipTask = () => {
    if (props.itemType === ItemTypeSchedule.Task) {
      return (
        <TipTaskDetails />
      );
    }
  }
  /**
   * render Tip Schedule
   */
  const renderTipSchedule = () => {
    if (props.itemType === ItemTypeSchedule.Schedule) {
      return (
        <TipScheduleDetails />
      );
    }
  }
  
  /**
   * hidden component if clicked on outside of element
   */
  function handleClickOutside(event) {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      props.hideModalSubDetail()
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
   * set position Tip on the screen
   */
  const positionModal = () => {
    const screenWidth = screen.availWidth;
    const modalWidth = 600;
    let position;
    if (props.mousePosition + modalWidth >= screenWidth) {
      position = props.mousePosition - modalWidth / 2;
    } else {
      position = props.mousePosition + modalWidth / 2;
    }

    return { 'left': position + 'px', 'zIndex': 10 };
  }

  return (
    <>
    {props.modalSubDetailCalendar && (
    <div className="popup-esr2 popup-esr3 popup-calendar-5" id="popup-esr2" style={positionModal()} ref={wrapperRef}>
      <div className="popup-esr2-content">
        <ModalHeader
          onCloseModalHeader={props.hideModalSubDetail} />
        <div className="popup-esr2-body">
          {renderTipSchedule()}
          {renderTipMilestone()}
          {renderTipTask()}
        </div>
        <ModalFooter
          onCloseModal={props.hideModalSubDetail} />
      </div>
    </div>
    )}
    </>
  );
}

const mapStateToProps = ({ dataModalSchedule }: IRootState) => ({
  dataSchedule: dataModalSchedule.dataSchedule,
  itemId: dataModalSchedule.itemId,
  mousePosition: dataModalSchedule.mousePosition,
  itemType: dataModalSchedule.itemType,
  modalSubDetailCalendar: dataModalSchedule.modalSubDetailCalendar,
});

const mapDispatchToProps = {
  getScheduleById,
  getMilestoneById,
  getTaskById,
  hideModalSubDetail,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModalSubDetailsSchedule);

