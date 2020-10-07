import React, { useState, useEffect } from 'react';
import { translate } from 'react-jhipster';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import _ from 'lodash';
import { EmployeeAction } from 'app/modules/employees/create-edit/create-edit-employee.reducer.ts';
import { utcToTz } from 'app/shared/util/date-utils';
import { getColorImage } from 'app/shared/util/string-utils';
export interface IPopupTabChangeHistory extends StateProps {
  idPopupEmployeeEdit: string,
  idPopupEmployeeDetail: string,
  employeeName: any;
  valueDataChangeHistoryInTabSummary?: any;
}
const EmployeeTabChangeHistory = (props: IPopupTabChangeHistory) => {
  const [listHistory, setListHistory] = useState([]);
  const [, setListHistoryTmp] = useState([]);

  useEffect(() => {
    // clear old value when first render
    setListHistory([])
  }, [])

  useEffect(() => {
    if (props.employeeDetailData.has(props.idPopupEmployeeDetail) && _.get(props.employeeDetailData.get(props.idPopupEmployeeDetail).changeHistory, 'history')) {
      if (_.get(props.employeeDetailData.get(props.idPopupEmployeeDetail).changeHistory, 'isReset')) {
        setListHistory(_.get(props.employeeDetailData.get(props.idPopupEmployeeDetail).changeHistory, 'history'));
      } else {
        _.cloneDeep(_.get(props.employeeDetailData.get(props.idPopupEmployeeDetail).changeHistory, 'history')).forEach((item) => {
          listHistory.push(item);
        })
      }
    }
  }, [props.employeeDetailData])

  useEffect(() => {
    setListHistoryTmp(_.cloneDeep(listHistory));
  }, [listHistory, props.employeeDetailData])

  useEffect(() => {
    if (props.actionUpdateEmployee === EmployeeAction.UpdateEmployeeSuccess
      && !props.valueDataChangeHistoryInTabSummary) {
      // clear old value after update customer success
      setListHistory([])
    }
  }, [props.actionUpdateEmployee])

  useEffect(() => {
    if (props.valueDataChangeHistoryInTabSummary) {
      // set listHistory case in tab summary
      setListHistory(props.valueDataChangeHistoryInTabSummary)
    }
  }, [props.valueDataChangeHistoryInTabSummary])

  const getTitleHistoryContentChange = (history) => {
    const isEmptyContentChange = _.isEmpty(JSON.parse(history.contentChange));
    if (isEmptyContentChange) {
      return translate('employees.detail.label.history.labelChangeCreate',
        { employeeName: props.employeeName })
    } else if (!isEmptyContentChange) {
      return translate('employees.detail.label.history.labelChangeUpdate',
        { employeeName: props.employeeName })
    }
    return null;
  }

  const convertDateTime = (createdDate) => {
    // "2020-08-13T01:11:00Z"
    const foramtDateTz = utcToTz(createdDate);
    const createdDateObj = {}
    // ["2020-08-13","01:11:00Z"]
    const arrayDateTime = foramtDateTz.split("T")
    // ["2020","08","05"]
    const arrayDate = arrayDateTime[0].split("-")
    // "03:32"
    const time = arrayDateTime[1].substring(0, 5)

    createdDateObj[`year`] = arrayDate[0]
    createdDateObj[`month`] = arrayDate[1]
    createdDateObj[`day`] = arrayDate[2]
    createdDateObj[`time`] = time

    return createdDateObj
  }

  const getFirstCharacter = (name) => {
    return name ? name.charAt(0) : "";
  }

  const renderDate = (createdDate) => {
    const createdDateObj = convertDateTime(createdDate);
    const resultDate =
      createdDateObj[`year`] + translate('customers.detail.label.history.year') +
      createdDateObj[`month`] + translate('customers.detail.label.history.month') +
      createdDateObj[`day`] + translate('customers.detail.label.history.day')

    return resultDate || ''
  }

  const renderTime = (createdDate) => {
    const createdDateObj = convertDateTime(createdDate);
    const resultTime = createdDateObj[`time`]

    return resultTime || ''
  }

  const renderContentChange = (change) => {
    const fields = _.keys(change);
    return (
      <>
        {fields && fields.map((field, idx) => {
          return (
            <p className="type-mission align-items-start" key={idx}>
              <div> {field}: </div> <div>{change[field]['old']}
                <img className="arrow" src="../../content/images/ic-time-line-arrow.svg" alt="" title=""></img>
                {` ${change[field]['new']}`} </div>
            </p>
          )
        })}
      </>
    )
  }

  return (
    <div className="tab-pane active">
      <div className="timeline-common">
        <div className="time-line">
          {listHistory && listHistory.map((history, idx) => {
            return (
              <div key={idx}>
                <div className="title">
                  {getTitleHistoryContentChange(history)}
                </div>
                <div className="mission-wrap w-auto">
                  {renderContentChange(JSON.parse(history.contentChange))}
                  <div className="item item2">
                    {
                      history.createdUserImage
                        ? <img className="user" src={history.createdUserImage} alt="" />
                        : <div className={"no-avatar " + getColorImage(7)}>{getFirstCharacter(history.createdUserName)}</div>
                    }
                    <span className="text-blue">
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href={`${window.location.origin}/${props.tenant}/employee-detail/${history.createdUserId}`}>
                        {history.createdUserName}
                      </a>
                    </span>
                    <span className="date w-auto">
                      {renderDate(history.createdDate)}
                    </span>
                    <span className="date">
                      {renderTime(history.createdDate)}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = ({ employeeInfo, employeeDetail, applicationProfile }: IRootState, ownProps: any) => ({
  // changeHistory: employeeDetail.changeHistory?.history,
  // isResetHistory: employeeDetail.changeHistory?.isReset,
  employeeDetailData: employeeDetail.data,
  tenant: applicationProfile.tenant,
  actionUpdateEmployee: employeeInfo.data.has(ownProps.id) ? employeeInfo.data.get(ownProps.idPopupEmployeeEdit).action : null, // when edit employee success
});

type StateProps = ReturnType<typeof mapStateToProps>;

export default connect(
  mapStateToProps,
)(EmployeeTabChangeHistory);
