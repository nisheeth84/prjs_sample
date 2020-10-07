import React, {useState} from 'react';
import {translate} from 'react-jhipster';
import {connect} from "react-redux";

import CalendarModalInformation from "./calendar-modal-information";
import CalendarModalHistory from "./calendar-modal-history";
import {IRootState} from "app/shared/reducers";
import {CONVERT_DATE} from '../../constants';

type ICalendarModalLeftProps = StateProps& DispatchProps & {
  isShowComponentRight?: boolean
}

const CalendarModalLeft = (props: ICalendarModalLeftProps) => {
  /**
   * default tab current: tab information
   */
  const [tabContentInformation, setTabContentInformation] = useState(true);

  /**
   * check tab current to display component
   */
  const renderTabContent = () => {
    if (tabContentInformation) {
      return (
        <CalendarModalInformation/>
      );
    }

    return <CalendarModalHistory/>
  }

  return (
    <div className={`popup-content-task-left scroll-table-v2 overflow-y-hover ${!props.isShowComponentRight && 'w-100'}`}>
      <div className='flag-wrap justify-content-start'>
        <div className='img mr-2'><span className='cicle-dot'/></div>
        <div>
          <div><a title='' className='title'>{props.schedule['scheduleName']}</a></div>
          <div className='font-size-12 mt-2'>{ CONVERT_DATE(props.schedule['startDate'], props.schedule['finishDate']) }</div>
        </div>
      </div>
      <div className='popup-content-task-content'>
        <div className='tab-detault '>
          <ul className='nav nav-tabs'>
            <li className='nav-item' onClick={() => setTabContentInformation(true)}>
              <a title='' className={tabContentInformation ? 'nav-link active' : 'nav-link'}
                 data-toggle='tab'>{translate('calendars.modal.information')}</a>
            </li>
            <li className='nav-item' onClick={() => setTabContentInformation(false)}>
              <a title='' className={!tabContentInformation ? 'nav-link active' : 'nav-link'}
                 data-toggle='tab'>{translate('calendars.modal.history')}</a>
            </li>
          </ul>
          <div className='tab-content none-scroll'>
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = ({dataModalSchedule}: IRootState) => ({
  schedule: dataModalSchedule.dataSchedule
});

const mapDispatchToProps = {
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CalendarModalLeft);
