import React, { useState, useEffect } from 'react'
import { IRootState } from 'app/shared/reducers'
import { connect } from 'react-redux'
import { handleGetActivityHistory, handleGetLazyActivityHistory, handleShowDetail, ActivityAction } from '../list/activity-list-reducer';
import { TYPE_DETAIL_MODAL, TAB_ID_LIST } from '../constants';
import { isArray, isObject, isString } from 'util';
import { translate } from 'react-jhipster';
import { ActivityHistoriesType } from '../models/get-activity-history-type';
import { FieldInfoActivityType } from '../models/get-activity-type';
import StringUtils, { getFieldLabel } from 'app/shared/util/string-utils';
import _ from 'lodash';
import styled from 'styled-components';
import { CommonUtil } from '../common/common-util';
import { TAB_ID } from 'app/modules/products/constants';

type IActivityTabHistoryProp = StateProps & DispatchProps & {
  tab: number,
  activityId: number,
  fieldInfoActivity?: FieldInfoActivityType[],
  maxRecord?: any,
}
const LIMIT = 30;


const AvatarDefault = styled.div`
  height: ${props => props.sizeAvatar + 'px'};
  width: ${props => props.sizeAvatar + 'px'};
  line-height: ${props => props.sizeAvatar + 'px'};;
  border-radius: 50%;
  background-color: #8ac891;
  display: inline-block;
  /* justify-content: center;
    align-items: center; */
  font-size: 14;
  vertical-align: middle;
  color: #fff;
  margin: 0 8px;
  text-align: center;
`;

const AvatarReal = styled.img`
 height: ${props => props.sizeAvatar + 'px'};
  width: ${props => props.sizeAvatar + 'px'};
  line-height: ${props => props.sizeAvatar + 'px'};;
  border-radius: 50%;
  vertical-align: middle;
  margin: 0 8px;
  text-align: center;
`
/**
 * component for show tab history activity
 * @param props 
 */
const ActivityTabHistory = (props: IActivityTabHistoryProp) => {
  const [currentTab] = useState(props.tab);
  const [listActivityHistories, setListActivityHistory] = useState([])
  // const [maxRecord, setMaxRecord] = useState(null);

  useEffect(() => {
    setListActivityHistory(props.listActivityHistory);
  }, [props.listActivityHistory]);

  useEffect(() => {
    if (props.activityId) {
      props.handleGetActivityHistory(props.activityId, 0, (props.maxRecord || LIMIT));
    }
  }, [props.activityId])

  useEffect(() => {
    if (props.maxRecord) {
      props.handleGetActivityHistory(props.activityId, 0, (props.maxRecord || LIMIT));
    }
  }, [props.maxRecord])

  const getPropertyAndValue = (item) => {
    if (!isObject(item)) {
      return;
    }
    const property = Object.keys(item)[0];
    const value = item[property];
    return { property, value };
  }

  const getPropertyAndValueContentChange = (item) => {
    if (!isObject(item)) {
      return;
    }
    const propertyNew = Object.keys(item)[0];
    const valueNew = item[propertyNew];

    const propertyOld = Object.keys(item)[1];
    const valueOld = item[propertyOld];

    return { propertyNew, valueNew, propertyOld, valueOld };
  }


  /**
   * check string is Json
   * @param str 
   */
  const isJson = (str) => {
    if (typeof str !== 'string') return false;
    try {
      const result = JSON.parse(str);
      const type = Object.prototype.toString.call(result);
      return type === '[object Object]'
        || type === '[object Array]';
    } catch (err) {
      return false;
    }
  }
  /**
   * get label by field name
   * @param fieldName 
   */
  const getLabel = (fieldName) => {
    if (props.fieldInfoActivity && props.fieldInfoActivity.length > 0) {
      const _temp = props.fieldInfoActivity.filter(e => e.fieldName === fieldName);
      if (_temp?.length > 0) {
        return getFieldLabel(_temp[0], "fieldLabel");
      } else {
        return fieldName;
      }
    }
    return fieldName;
  }

  const textValue = (value) => {
    // let res = translate('activity.activityDetail.blank');
    if (isObject(value)) {
      return JSON.stringify(value) || translate('activity.activityDetail.blank');
    } else if(isString(value)) {
      return value.length > 0 ? value : translate('activity.activityDetail.blank');
    } else if(isArray(value)){
      return value.length > 0 ? JSON.stringify(value) : translate('activity.activityDetail.blank');
    } else {
      return value || translate('activity.activityDetail.blank');
    }
  }

  // wrap data change for activity_time
  const wrapContentChange = (value) => {
    const activityStartTime = value['activity_start_time']
    const activityEndTime = value['activity_end_time']
    const activityDuration = value['activity_duration']
    delete value['activity_start_time']
    delete value['activity_end_time']
    delete value['activity_duration']
    value['activity_time'] = {
      new: CommonUtil.convertToTime(activityStartTime?.new) + '-' + CommonUtil.convertToTime(activityEndTime?.new) + ' ' + (activityDuration?.new || '') + ' ' + translate('activity.modal.minute'),
      old: CommonUtil.convertToTime(activityStartTime?.old) + '-' + CommonUtil.convertToTime(activityEndTime?.old) + ' ' + (activityDuration?.old || '') + ' ' + translate('activity.modal.minute'),
    }
    const contactDate = value['contact_date']
    if(contactDate) {
      delete value['contact_date']
      value['contact_date'] = {
        new: CommonUtil.convertToDate(contactDate?.new),
        old: CommonUtil.convertToDate(contactDate?.old)
      }
    }
    
    return value;
  }

  const checkObjectDiffirent = (obj1, obj2) => {
    return !_.isEqual(obj1, obj2);
  }

  /**
   * render content changeF
   * @param value 
   */
  const renderContentChange = (value) => {
    if (!value) {
      return;
    }
    let arrOldNewValue = [];
    if (isString(value)) {
      value = JSON.parse(value);
    }
    if (isArray(value)) {
      return value.map((item, itemIdx) => {
        const data = getPropertyAndValue(item);
        const tmpProperty = data.property;
        const tmpValue = data.value;
        arrOldNewValue = tmpValue.split('>');
        if (arrOldNewValue[0] === arrOldNewValue[1])
          return <></>
        return <p className="mb-0 mt-2 color-000" key={'childContentChange_' + itemIdx}>
          <span>{getLabel(tmpProperty)}</span>
          <span className="ml-4">:</span>
          <span className="ml-4">{arrOldNewValue[0]}</span>
          <img className="arrow"
            src="../../../content/images/ic-time-line-arrow.svg"
            alt="" title="" />
          <span>{arrOldNewValue[1]}</span>
        </p>
      });
    }
    if (isObject(value)) {
      value = wrapContentChange(value);
      return Object.entries(value).map(function (item, index) {
        const data = getPropertyAndValueContentChange(item);
        const fieldValue = data.valueOld; // value change
        const fieldName = data.valueNew;// field name

        if (isJson(fieldValue.old)) {
          const oldValue = JSON.parse(fieldValue.old);
          const newValue = JSON.parse(fieldValue.new);
          const fields = _.keys(oldValue);
          return <>
            {/* <p className="mb-0 mt-2 color-000" key={'childContentChange_' + index}>
            {translate(`activity.fieldsList.${StringUtils.snakeCaseToCamelCase(fieldName)}`)}:
            </p> */}
            {fields && fields.map((field, idx) => {
              return checkObjectDiffirent(oldValue[field], newValue[field]) && 
              <p className="mb-0 mt-0" key={`data_${fieldName}_${field}_${idx}`}>
                <span>{getLabel(field)}</span>
                <span className="ml-4">:</span>
                <span className="ml-4">{textValue(oldValue[field])}</span>
                <img className="arrow"
                  src="../../../content/images/ic-time-line-arrow.svg"
                  alt="" title="" />
                <span>{textValue(newValue[field])}</span>
              </p>
            })}
          </>
        } else {
          if (!isObject(fieldValue.new || fieldValue.old) && checkObjectDiffirent(fieldValue.old, fieldValue.new)) {
            return <p className="mb-0 mt-2 color-000" key={'childContentChange_' + index}>
              {/* <span>{translate(`activity.fieldsList.${tmpValueNew}`)}</span> */}
              <span>{getLabel(fieldName)}</span>
              <span className="ml-4">:</span>
              <span className="ml-4">{textValue(fieldValue.old)}</span>
              <img className="arrow"
                src="../../../content/images/ic-time-line-arrow.svg"
                alt="" title="" />
              <span>{textValue(fieldValue.new)}</span>
            </p>
          }
        }
      });
    }
  }

  const handleScroll = (e) => {
    const element = e.target;
    if (props.listActivityHistory && element.scrollHeight - element.scrollTop === element.clientHeight && props.lengthHistory === (props.maxRecord || LIMIT)) {
      props.handleGetLazyActivityHistory(props.activityId, props.listActivityHistory.length, (props.maxRecord || LIMIT), null);
    }
  }
  const idCaller = `ActivityDetail_${props.activityId}`
  return (
    <>
      <div className="" onScroll={handleScroll}>
        <div className={"tab-pane " + (currentTab === 2 ? 'active' : '')}   >
          <div className="list-table pr-3">
            <div className="time-line h-100" >
              {
                isArray(listActivityHistories) && listActivityHistories.length > 0 ? (
                listActivityHistories.map((item: ActivityHistoriesType, idx) => {
                  // const { property, value } = getPropertyAndValue(item);
                  const userName = (item?.updatedUser?.employeeSurname || '' )+ " " + (item?.updatedUser?.employeeName || '');
                  return (
                    <div className="time-item" key={'activityHistory_' + idx + item.activityId}>
                      <div className="item item2 d-flex">
                        <div className="user-info">
                        {!_.isEmpty(item?.updatedUser?.employeePhoto?.fileUrl) ? (
                          <AvatarReal className="user ml-2" sizeAvatar={30} 
                              src={item?.updatedUser?.employeePhoto?.fileUrl} alt="" title="" 
                              onClick={() => {  props.handleShowDetail(item?.updatedUser?.employeeId, TYPE_DETAIL_MODAL.EMPLOYEE, idCaller)  }} />
                        ) : (
                            <AvatarDefault sizeAvatar={30} 
                            onClick={() => {  props.handleShowDetail(item?.updatedUser?.employeeId, TYPE_DETAIL_MODAL.EMPLOYEE, idCaller)  }} >
                              {!_.isEmpty(userName) ? userName[0].toUpperCase() : " "}
                            </AvatarDefault>
                          )}
                        </div>
                        <div className="info color-333 w-100">
                          <p className="date mb-0 w100 font-size-12">
                            <a title="" className="text-blue ml-2" onClick={() => { props.handleShowDetail(item?.updatedUser?.employeeId, TYPE_DETAIL_MODAL.EMPLOYEE, idCaller) }}>
                              {userName}
                            </a>
                            {item.updatedDate && <>
                              <span className="ml-4 mr-2">
                                {CommonUtil.convertToDate(item.updatedDate)}
                              </span>
                              <span>{CommonUtil.convertToTime(item.updatedDate)}</span>
                            </>
                            }
                          </p>
                          {renderContentChange(item.contentChange)}
                        </div>
                      </div>
                    </div>
                  )
                }))
                  : (
                  props.action === ActivityAction.Success ? <div className={`absolute-center`}>
                    <div className="align-center">
                      <img className="activity-w-24" src={"/content/images/ic-sidebar-activity.svg"} alt="" />
                      <div>{translate("messages.INF_COM_0020", { 0: translate('activity.activityDetail.history') })}</div>
                    </div>
                  </div> :   <></>
                  )
              }
            </div>
          </div>
        </div>
      </div>

    </>

  );
}

const mapStateToProps = ({ activityListReducerState }: IRootState) => ({
  listActivityHistory: activityListReducerState.listActivityHistory,
  action: activityListReducerState.action,
  lengthHistory: activityListReducerState.lengthHistory
});

const mapDispatchToProps = {
  handleGetActivityHistory,
  handleGetLazyActivityHistory,
  handleShowDetail
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ActivityTabHistory);
