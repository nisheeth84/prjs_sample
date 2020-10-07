import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { cloneDeep } from 'lodash';
import getDaysArrayByMonth from '../helpers/getDaysArrayByMonth';
import mapDayNextAndLastMonth from '../helpers/mapDayNextAndLastMonth';
import dateFns from "date-fns";
import DropComponent from './DropComponent';
import DragComponent from './DragComponent';
import styled from 'styled-components';

const NotificationWrapper = styled.div`
  min-width: 100px;
  border: 1px solid black;
  padding: 10px 10px;
  top: ${props => props?.positionPopup?.y ? `calc(100% - ${props?.positionPopup?.y}px)` : '25%'} !important;
  left: ${props => props?.positionPopup?.x ? `calc(100% - ${props?.positionPopup?.x}px)` : '50%'};
  border-radius: 15px;
  background-color: white;
  position: fixed !important;
  li { 
    cursor: pointer;
  }
`;

const DragWrapper = styled.div`
  min-height: 92px;
`;
export interface IBusinessCardDetailByMonth {
  listDay?: Array<any>,
  dateViewMonth?: Date,
}

const BusinessCardDetailByMonth = (props: IBusinessCardDetailByMonth) => {
  const [isShowModal, setShowModal] = useState(false);
  const [selectedDate, changeSelectedDate] = useState(null);
  const [isShowToast,] = useState(false);
  const [positionPopup, changePositionPopup] = useState(null);
  const refModal = useRef();
  const findFirstIndex = arrData => arrData.findIndex(data => data.index === 7);

  const mappedData = useMemo(() => {
    const monthIndex = dateFns.getMonth(props.dateViewMonth);
    const indexLastMonth = monthIndex === 0 ? 11 : monthIndex - 1;
    const indexNextMonth = monthIndex === 11 ? 0 : monthIndex + 1;
    const lastYear = monthIndex === 0 ? dateFns.getYear(props.dateViewMonth) - 1 : dateFns.getYear(props.dateViewMonth);
    const nextYear = monthIndex === 11 ? dateFns.getYear(props.dateViewMonth) + 1 : dateFns.getYear(props.dateViewMonth);
    const dateLastMonth = getDaysArrayByMonth(lastYear, indexLastMonth + 1);
    const dateNextMonth = getDaysArrayByMonth(nextYear, indexNextMonth + 1);
    const newList = cloneDeep(props.listDay);
    const firstIndex = findFirstIndex(newList);
    let firstRow = newList.splice(0, firstIndex + 1);
    const secondRow = newList.splice(0, 7);
    const thirdRow = newList.splice(0, 7);
    const fourthRow = newList.splice(0, 7);
    let fifthRow = newList.splice(0, 7);
    if (firstRow.length < 7) {
      firstRow = [...mapDayNextAndLastMonth(firstRow, dateLastMonth, true), ...firstRow];
    }
    if (fifthRow.length < 7) {
      fifthRow = [...fifthRow, ...mapDayNextAndLastMonth(fifthRow, dateNextMonth)];
    }
    return [firstRow, secondRow, thirdRow, fourthRow, fifthRow];
  }, [props.dateViewMonth, props.listDay]);

  const setScheduleDate = useCallback(() => {
    setShowModal(false);
  }, [selectedDate]);

  const setTaskDate = useCallback(() => {
    setShowModal(false);
  }, [selectedDate]);

  const setMilestoneDate = useCallback(() => {
    setShowModal(false);
  }, [selectedDate]);

  const showModal = useCallback((event) => {
    setShowModal(true);
    changePositionPopup({ x: window.innerWidth - event.clientX, y: window.innerHeight - event.clientY });
  }, [setShowModal])

  function useOnClickOutside(ref, handler) {
    useEffect(
      () => {
        const listener = event => {
          if (!ref.current || ref.current.contains(event.target)) {
            return;
          }

          handler(event);
        };

        document.addEventListener('mousedown', listener);
        document.addEventListener('touchstart', listener);

        return () => {
          document.removeEventListener('mousedown', listener);
          document.removeEventListener('touchstart', listener);
        };
      },
      [ref, handler]
    );
  }

  useOnClickOutside(refModal, () => setShowModal(false));

  return (
    <div className="esr-content business-card-detail-by-month">
      <div className="esr-content-body style-3">
        <div className="esr-content-body-main">
          <div className="table-list-wrap style-3">
            <div className="table-calendar-wrap">
              <table className="table-default">
                <thead>
                  <tr>
                    <th align="center" >月</th>
                    <th align="center" >火</th>
                    <th align="center" >水</th>
                    <th align="center" >木</th>
                    <th align="center" >金</th>
                    <th className="color-red" align="center">土</th>
                    <th className="color-red" align="center">日</th>
                  </tr>
                </thead>
                <tbody>
                  {mappedData.map((row, indexRow) => {
                    return (
                      <tr key={Math.random()}>
                        {
                          [1, 2, 3, 4, 5, 6, 7].map((column, indexColumn) => {
                            const newColumn = row.find(element => element.index === column);
                            return (
                              <DropComponent key={column + Math.random()} onClick={(event) => { changeSelectedDate(newColumn ? newColumn.fullInfoOfDate : ''); showModal(event) }}>
                                <DragWrapper className="box-appointment-changed-wrap">
                                  <div className="date date-prev">{(newColumn) ? newColumn.date : ''}<span className="note"></span></div>
                                  <DragComponent>
                                    <div></div>
                                  </DragComponent>
                                </DragWrapper>
                              </DropComponent>
                            )
                          })
                        }
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              {
                isShowModal && (
                  <NotificationWrapper positionPopup={positionPopup} ref={refModal}>
                    <li onClick={setScheduleDate}>Schedule</li>
                    <li onClick={setTaskDate}>Task</li>
                    <li onClick={setMilestoneDate}>Milestone</li>
                  </NotificationWrapper>
                )
              }
              {
                isShowToast && (
                  // will auto hide when setTimeOut in drag drop function
                  <div className="position-absolute">
                    <p>change date success</p>
                  </div>
                )
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BusinessCardDetailByMonth;
