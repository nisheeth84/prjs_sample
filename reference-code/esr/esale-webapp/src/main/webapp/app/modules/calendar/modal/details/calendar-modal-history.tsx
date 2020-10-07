import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-jhipster';
import { isArray, isObject, isNullOrUndefined } from 'util';
import { useId } from "react-id-generator";
import { IRootState } from 'app/shared/reducers';
import { getScheduleHistory } from '../calendar-modal.reducer';
import PopupEmployeeDetail from "app/modules/employees/popup-detail/popup-employee-detail";
import _ from 'lodash';
import { CONVERT_DATE_HISTORY } from "app/modules/calendar/constants";
import { CommonUtils } from '../../models/common-type';
import { CommonUtil } from 'app/modules/timeline/common/CommonUtil';

/**
 * interface component history
 */
type ICalendarModalHistoryProps = StateProps & DispatchProps
/**
 * number record
 */
const LIMIT = 30;
/**
 * component schedule history
 * @param props
 * @constructor
 */
const CalendarModalHistory = (props: ICalendarModalHistoryProps) => {
  // const statusDummyData = true;
  // const [statusDummyData, setStatusDummyData] = useState(true);
  /**
   * page current
   */
  const [currentPage, setCurrentPage] = useState(1);
  /**
   * list schedule history
   */
  const [listScheduleHistories, setListScheduleHistory] = useState([])
  /**
   * status of popup employee detail
   */
  const [openPopupEmployeeDetail, setOpenPopupEmployeeDetail] = useState(false);
  /**
   * employee id
   */
  const [employeeId, setEmployeeId] = useState(0);
  // const [hadData, setHadData] = useState(false);
  const employeeDetailCtrlId = useId(1, "calendarEmployeeDetail_")

  /**
   * get property and value of item
   * @param item
   */
  // const getPropertyAndValue = (item) => {
  //   if (!isObject(item)) {
  //     return ;
  //   }
  //   const property = Object.keys(item)[0];
  //   const value = item[property];
  //   return { property, value};
  // }

  // const getValue = (item) => {
  //   if (!isObject(item)) {
  //     return;
  //   }
  //   const property = Object.keys(item)[0];
  //   const value = item[property];
  //   return value;
  // }

  /**
   * Render content change in history schedule
   * @param value
   */
  const renderContentChange = (value) => {

    if (!isObject(value)) {
      return;
    }
    if (Object.values(value)[1] && Object.values(value)[0])
      return <div>{Object.values(value)[1]} -&gt; {Object.values(value)[0]}</div>
    else if ( isNullOrUndefined(Object.values(value)[1]) && Object.values(value)[0] !== null) {
      if(isArray(Object.values(value)[0])){
        return <div> -&gt; {Array(Object.values(value)[0]).join(',')}</div>
      } else {
        return <div> -&gt; {Object.values(value)[0]}</div>
      }
    } 
    return;
  }



  /**
   * Handle scroll load data
   * @param e
   */
  const handleScroll = (e) => {
    const element = e.target;
    if (listScheduleHistories && element.scrollHeight - element.scrollTop === element.clientHeight) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      props.getScheduleHistory(props.schedule['scheduleId'], nextPage, LIMIT);
    }
  }

  /**
   * set state list schedule history
   */
  useEffect(() => {
    props.schedule['scheduleHistories'] && setListScheduleHistory(props.schedule['scheduleHistories'])
  }, []);
  /**
   * set list schedule history
   */
  useEffect(() => {
    if (isArray(props.schedule['scheduleHistories'])) {
      const draftData = _.cloneDeep(listScheduleHistories);
      if (props.schedule['scheduleHistories']) {
        props.schedule['scheduleHistories'].forEach(item => {

          draftData.push(item)
        })
      }
      setListScheduleHistory(draftData);
    }
  }, [props.schedule['scheduleHistories']])

  /**
   * close popup employee detail
   */
  const onClosePopupEmployeeDetail = () => {
    setOpenPopupEmployeeDetail(false);
  }

  /**
   * open employeeId detail
   * @param employeeIdParam
   */
  const onOpenModalEmployeeDetail = (employeeIdParam) => {
    setEmployeeId(employeeIdParam);
    setOpenPopupEmployeeDetail(true);
  }

  return <div className='tab-pane active' onScroll={handleScroll}>
    <div className='time-line'>
      {
        isArray(listScheduleHistories) &&
        listScheduleHistories.map((scheduleHistory, idx) => {
          const objContentChange = scheduleHistory.contentChange && JSON.parse(scheduleHistory.contentChange)
          return <div key={'scheduleHistory_' + idx}>
            {
              objContentChange && isArray(Object.keys(objContentChange)) &&
              Object.keys(objContentChange).map((item, index) => {
                return <div key={'titleContentChange_' + index}>
                      <div >{translate(`calendars.fieldsList.${item}`)} {translate('calendars.fieldsList.changed')}</div>
                     {renderContentChange(objContentChange[`${item}`])}
                    </div>
                
              })
            }
            {objContentChange && <div >
              <a onClick={() => onOpenModalEmployeeDetail(scheduleHistory.updatedUserId)}>
                <img className='user'
                  src={scheduleHistory.updatedUserImage ? scheduleHistory.updatedUserImage : '../../../content/images/ic-user1.svg'}
                  alt=''
                  title='' /><span className="text-blue">{scheduleHistory.updatedUserName}</span>
                <span className='pl-3'>{CONVERT_DATE_HISTORY(new Date(scheduleHistory.updatedDate))}</span>
              </a>
            </div>
            }
          </div>
        })
      }
    </div>
    {openPopupEmployeeDetail &&
      <PopupEmployeeDetail
        id={employeeDetailCtrlId[0]}
        showModal={true}
        employeeId={employeeId}
        listEmployeeId={[employeeId]}
        toggleClosePopupEmployeeDetail={onClosePopupEmployeeDetail}
        resetSuccessMessage={() => { }} />
    }
  </div>;
}

const mapStateToProps = ({ dataModalSchedule, applicationProfile }: IRootState) => ({
  tenant: applicationProfile.tenant,
  schedule: dataModalSchedule.dataSchedule,
});

const mapDispatchToProps = {
  getScheduleHistory
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CalendarModalHistory);
