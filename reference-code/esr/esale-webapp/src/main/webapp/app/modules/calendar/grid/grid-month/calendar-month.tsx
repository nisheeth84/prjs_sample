import React, { useState, useEffect, useRef, CSSProperties } from 'react';
import { IRootState } from 'app/shared/reducers'
import { connect } from 'react-redux'
import { TabForcus, HIGHT_OF_TH_HEADER, HIGHT_OF_SCHEDULE, HIGHT_OF_DIV_DATE_IN_MONTH_VIEW, ItemTypeSchedule } from '../../constants';

import HeaderGridMonth from './header-grid-month';
import BodyGridMonth from './body-grid-month'
import { DataOfWeek, DataOfDay, DataOfSchedule, DataOfResource } from '../common'
import { DrapDropInMonth } from '../grid-drap-drop/grid-drap-drop-month';
import RenderSchedule from '../item/render-schedule'
import RenderTask from '../item/render-task'
import RenderMilestone from '../item/render-milestone'
import { RenderResource } from '../item/render-resource'

export type ICalendarMonthProps = StateProps & DispatchProps & {
  modeView?: boolean,
  classNameOfMonth?: string
}

/**
 * Component render display grid month
 * @param props 
 */
const CalendarMonth = (props: ICalendarMonthProps) => {
  /**
   * tableWrapBounding = {
   *  bottom: 408.75
   *  height: 320.75
   *  left: 456
   *  right: 1848
   *  top: 88
   *  width: 1392
   *  x: 456
   *  y: 88
   * }
   */
  const [tblInfoBounding, setTblInfoBounding] = useState([0, 0]);
  // const [maxShowSchedule, setMaxShowSchedule] = useState(5);
  // const [tdHeight, setTdHeight] = useState(0);

  const tblRef = useRef(null);
  // DrapDropInMonth.reinitialized();
  DrapDropInMonth.setStartDateMonth(props.dataOfMonth.startDate);
  DrapDropInMonth.setTblRefMonth(tblRef);

  const getNumWeeks = () => {
    if (!props.dataOfMonth) return 0;
    if (!props.localNavigation) return 0;

    // const listWeeksInit: DataOfWeek[] = [];
    if (props.localNavigation.tabFocus === TabForcus.Schedule) {
      if (!props.dataOfMonth.listWeeksOfSchedule) return 0;
      return props.dataOfMonth.listWeeksOfSchedule.length;
    } else {
      if (!props.dataOfMonth.listWeeksOfResource) return 0;
      return props.dataOfMonth.listWeeksOfResource.length;
    }
  }

  let handleTimeout = null;
  function updateSize(s) {
    if (handleTimeout) {
      clearTimeout(handleTimeout);
    }
    handleTimeout = setTimeout(() => {
      if (tblRef && tblRef.current) {
        const cTblInfoBounding = tblRef.current.getBoundingClientRect();
        if (cTblInfoBounding) {
          setTblInfoBounding([cTblInfoBounding.width, cTblInfoBounding.height]);
        }
      }
      // DrapDropInMonth.reinitialized()
    }, 50)
    // DrapDropInMonth.reinitialized()
  }

  useEffect(() => {
    updateSize('useEffect');
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    updateSize('useEffect');
  }, [props.optionAll])

  useEffect(() => {
    updateSize('useEffect');
  }, [props.refreshDataFlag])

  let listDay: DataOfDay[] = [];
  if (props.dataOfMonth && props.localNavigation) {
    const listWeeksInit: DataOfWeek[] = props.localNavigation.tabFocus === TabForcus.Schedule ? props.dataOfMonth.listWeeksOfSchedule : props.dataOfMonth.listWeeksOfResource;
    listWeeksInit && listWeeksInit.length && (listDay = listWeeksInit[0].listDay);
  }


  const renderMonth = () => {

    const numWeeks = getNumWeeks();
    const nTdHeight = numWeeks ? Math.floor((tblInfoBounding[1] - HIGHT_OF_TH_HEADER) / numWeeks) : 0;
    const nTdWidth = Math.floor(tblInfoBounding[0] / 7);
    const nMaxShowSchedule = nTdHeight <= 0 ? 0 : Math.floor((nTdHeight - HIGHT_OF_DIV_DATE_IN_MONTH_VIEW) / HIGHT_OF_SCHEDULE);

    // let listWeeksInit: DataOfWeek[] = [];

    // if (props.dataOfMonth && props.localNavigation) {
    //   listWeeksInit = props.localNavigation.tabFocus === TabForcus.Schedule ? props.dataOfMonth.listWeeksOfSchedule : props.dataOfMonth.listWeeksOfResource;
    // }

    const styleSchedule: CSSProperties = {
      position: "absolute",
      top: 0,
      left: 0,
      width: 0,
      height: HIGHT_OF_SCHEDULE,
      zIndex: 10
    };
    const paddingLeft = 1;

    const renderObject = (schedule: DataOfSchedule | DataOfResource) => {
      if (schedule['itemType'] === ItemTypeSchedule.Milestone) {
        return (
          <RenderMilestone
            dataOfSchedule={schedule}
            prefixKey={'item-Milestone'}
            localNavigation={props.localNavigation}

            width={'100%'}

            showArrow={true}
            modeView={props.modeView}
          />
        );
      }
      if (schedule['itemType'] === ItemTypeSchedule.Task) {
        return (
          <RenderTask
            dataOfSchedule={schedule}
            prefixKey={'item-Task'}
            localNavigation={props.localNavigation}

            width={'100%'}

            showArrow={true}
            modeView={props.modeView}
          />
        );
      }
      if (schedule['itemType'] === ItemTypeSchedule.Schedule) {
        return (
          <RenderSchedule
            dataOfSchedule={schedule}
            prefixKey={'item-schedule'}
            localNavigation={props.localNavigation}

            formatNormalStart={'HH:mm'}
            formatOverDayStart={'HH:mm'}

            width={'100%'}

            showArrow={true}
            modeView={props.modeView}

          />
        );
      }
      return (

        <RenderResource
          dataOfResource={schedule}
          prefixKey={'item-resource'}
          isShowStart={true}
          isShowEnd={false}
          formatStart={'HH:mm'}
          formatEnd={''}

          width={'100%'}

          showArrow={true}
          modeView={props.modeView}
        />
      )
    }

    return (
      <div className="esr-content-body table-calendar-area">
        <div className="esr-content-body-main">
          <div className={`table-list-wrap style-3 ${props.classNameOfMonth}`} >

            {props.aryDraggingItem && props.aryDraggingItem.map((e, index) => {
              if (e.itemDrag.isShow)
                return (
                  <div style={{
                    ...styleSchedule,
                    top: e.y,
                    left: paddingLeft + e.x,
                    width: e.width
                  }}
                    className={'calendar-schedule-drag opacity-1'}
                    key={index}
                  >
                    {
                      renderObject({ ...e.itemDrag })
                    }
                  </div>
                )
            })}

            <div className={`table-calendar-schedule-wrap `} ref={tblRef} >

              {/* <DndProvider backend={Backend}> */}

              {/* {listWeeksInit.map((e, index) => {
                  return (
                    <DragLayerMonth
                      key={index}
                      localNavigation={props.localNavigation}
                      indexWeek={index}
                      hightOfDivDate={HIGHT_OF_DIV_DATE_IN_MONTH_VIEW}
                    />
                  )
                })} */}

              <table className="table-default table-schedule table-calendar-schedule">
                <HeaderGridMonth listDay={listDay} widthOfTd={nTdWidth}/>

                <BodyGridMonth
                  maxShowSchedule={nMaxShowSchedule}
                  widthOfTd={nTdWidth}
                  modeView={props.modeView}
                />
              </table>
              {/* </DndProvider> */}
            </div>
          </div>
        </div>

      </div>
    );

  }

  return (
    renderMonth()
  );
}


const mapStateToProps = ({ dataCalendarGrid }: IRootState) => ({
  optionAll: dataCalendarGrid.optionAll,
  localNavigation: dataCalendarGrid.localNavigation,
  dataOfMonth: dataCalendarGrid.dataOfMonth,
  refreshDataFlag: dataCalendarGrid.refreshDataFlag,
  aryDraggingItem: dataCalendarGrid.aryDraggingItem
});

const mapDispatchToProps = {};
type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CalendarMonth);
