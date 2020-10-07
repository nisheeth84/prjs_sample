import React, { useState, useEffect } from 'react';
import { showGlobalTool, hiddenGlobalTool } from "app/modules/calendar/global-tool/global-tool-reducer";
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import GlobalControlTask from 'app/modules/global/task/global-control-task'
import GlobalToolSchedule from '../global-tool/global-tool-schedule';
// import { Helmet } from 'react-helmet';

type ICalendarControlRight = DispatchProps & StateProps & {
  showGlobalTool: (day) => void;
  hiddenGlobalTool: () => void;
}

const enum TypeShowViewControlRight {
  Mini = 0,
  Colspan = 1,
  Expand = 2,
}

const CalendarControlRight = (props: ICalendarControlRight) => {
  const [showControlRight, setShowControlRight] = useState(TypeShowViewControlRight.Colspan);
  const [showGlobalToolTask, setShowGlobalToolTask] = useState(false);
  const [activeControlRight, setActiveControlRight] = useState('');
  const showControlRightAction = () => {
    switch (showControlRight) {
      case TypeShowViewControlRight.Expand: {
        props.hiddenGlobalTool()
        setShowGlobalToolTask(false)
        setShowControlRight(TypeShowViewControlRight.Colspan);
        break;
      }
      case TypeShowViewControlRight.Colspan:
        setShowControlRight(TypeShowViewControlRight.Mini);
        break;
      case TypeShowViewControlRight.Mini:
        setShowControlRight(TypeShowViewControlRight.Colspan)
        break;
      default:
        setShowControlRight(TypeShowViewControlRight.Colspan)
    }
  }

  const renderGlobalTool = () => {
    if (props.globalShow) {
      return (
        <>
          <GlobalToolSchedule 
          disableActive={setActiveControlRight}
          />
        </>
      );
    }
  }
  const rendererGlobalToolTask = () => {
    if (showGlobalToolTask) {
      return (
        <>
          <GlobalControlTask onClose={() => setShowControlRight(TypeShowViewControlRight.Colspan)} />
        </>
      )
    } else {
      return (
        <></>
      )
    }
  }


  
  useEffect(() => {
    if (showGlobalToolTask) {
      props.hiddenGlobalTool()
    }
  }, [showGlobalToolTask])

  useEffect(() => {
    if (!props.globalShow && !showGlobalToolTask)
      setShowControlRight(TypeShowViewControlRight.Colspan)
    else {
      setShowControlRight(TypeShowViewControlRight.Expand)
      if (props.globalShow && showGlobalToolTask) {
        setShowGlobalToolTask(false)
      }
    }
  }, [props.globalShow])
  return (
    <>
      {
        showControlRight === TypeShowViewControlRight.Mini ?
          (<a className="expand-control-right view-control-right-mini"
            onClick={() => {
              showControlRightAction()
            }}><i className="far fa-angle-left" /></a>) :
          (<div
            className={`control-right ${showControlRight === TypeShowViewControlRight.Expand ? "control-right-open" : ""}`}>

            <ul className="h-100">
              <li className={(activeControlRight === 'note-icon' && 'active')}><a className="button-popup" data-toggle="modal" data-target="#myModal" onClick={() => {
                setActiveControlRight('note-icon')
              }}><img
                src="/content/images/ic-right-note.svg" alt="" /></a></li>
              <li className={(activeControlRight === 'list-icon' && 'active')}><a className="button-popup" data-toggle="modal" data-target="#myModal" onClick={() => {
                setShowGlobalToolTask(true);
                setActiveControlRight('list-icon')
                setShowControlRight(TypeShowViewControlRight.Expand)
              }}><img
                  src="/content/images/ic-right-list.svg" alt="" /></a></li>
              <li className={(activeControlRight === 'calendar-icon' && 'active')}><a className="button-popup" data-toggle="modal" data-target="#myModal" onClick={() => {
                props.showGlobalTool(props.dateShow);
                setActiveControlRight('calendar-icon')
                setShowControlRight(TypeShowViewControlRight.Expand)
              }}><img src="/content/images/ic-sidebar-calendar.svg" alt="" /></a></li>
            </ul>
            <a className="expand-control-right" onClick={() => {
              showControlRightAction()
            }}><i className="far fa-angle-right" /></a>
            {renderGlobalTool()}
            {rendererGlobalToolTask()}
          </div>)
      }
    </>
  );
}

const mapStateToProps = ({ dataCalendarGrid, dataGlobalToolSchedule }: IRootState) => ({
  dateShow: dataCalendarGrid.dateShow,
  globalShow: dataGlobalToolSchedule.globalTool,
});
const mapDispatchToProps = {
  showGlobalTool,
  hiddenGlobalTool
}

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CalendarControlRight);
