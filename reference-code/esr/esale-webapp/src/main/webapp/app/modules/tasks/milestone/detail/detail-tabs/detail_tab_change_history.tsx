import React, { useState, useEffect } from 'react';
import { Storage, translate } from 'react-jhipster';
import PopupEmployeeDetail from '../../../../employees/popup-detail/popup-employee-detail';
import { useId } from "react-id-generator";
import _ from 'lodash';
import { USER_FORMAT_DATE_KEY, APP_DATE_FORMAT } from 'app/config/constants';
import dateFnsFormat from 'date-fns/format';
import { ORG_COLORS as colors } from 'app/config/constants';
import { firstChar } from 'app/shared/util/string-utils';
import { utcToTz, DATE_TIME_FORMAT, formatDateTime } from 'app/shared/util/date-utils';

export interface IPopupTabChangeHistory {
  languageId: any,
  changeHistory: any,
  tenant?
}

/**
 * Render component tab HistoryChange
 * @param props 
 */
const TabChangeHistory = (props: IPopupTabChangeHistory) => {
  const [milestoneHistories, setMilestoneHistories] = useState(props.changeHistory ? props.changeHistory : 'null');
  const [openPopupEmployeeDetail, setOpenPopupEmployeeDetail] = useState(false);
  const [employeeId, setEmployeeId] = useState(0);
  const [listEmployeeId, setListEmployeeId] = useState([]);
  const employeeDetailCtrlId = useId(1, "milestoneHistoryEmployeeDetail_")
  const fieldInfo = [
    {
      "fieldName": "milestone_name",
      "fieldLabel": translate('milestone.create-edit.form.milestone-name')
    },
    {
      "fieldName": "finish_date",
      "fieldLabel": translate('milestone.create-edit.form.finnish-date')
    },
    {
      "fieldName": "is_done",
      "fieldLabel": translate('milestone.create-edit.form.isdone')
    },
    {
      "fieldName": "memo",
      "fieldLabel": translate('milestone.create-edit.form.comment')
    },
    {
      "fieldName": "is_public",
      "fieldLabel": translate('milestone.create-edit.form.is-public-title')
    },
    {
      "fieldName": "customer_id",
      "fieldLabel": translate('milestone.detail.form.customer')
    },
  ];

  useEffect(() => {
    if (props.changeHistory) {
      setMilestoneHistories(props.changeHistory);
    }
  }, [props.changeHistory]);
  /**
   * get old new value
   * @param value - value content change
   */
  const getOldNewValue = (value) => {
    const oldNewValue = value.split('>');
    return oldNewValue;
  }

  /**
   * Close employee detail
   */
  const onClosePopupEmployeeDetail = () => {
    setOpenPopupEmployeeDetail(false);
    document.body.className = 'wrap-task modal-open';
  };

  /**
  * Open employee detail
  */
  const onOpenPopupEmployeeDetail = userUpdateId => {
    const lstEmployeeId = [];
    lstEmployeeId.push(userUpdateId);
    setListEmployeeId(lstEmployeeId);
    setEmployeeId(userUpdateId);
    setOpenPopupEmployeeDetail(true);
    event.preventDefault();
  };

  
  const getFieldChangeName = fieldChange => {
    let fielLabel = ""
    fieldInfo.forEach((item) => {
      if (item.fieldName === fieldChange) {
        fielLabel = item.fieldLabel;
      }
    })
    return fielLabel;
  };

  /**
   * render data information change
   */
  const renderInformationChange = (item) => {
    return (
      <>
        <div>
          {getFieldChangeName(item.fieldChange)} :&nbsp;
          {getOldNewValue(item.valueChange)[0]} &nbsp;&nbsp;&nbsp;
          <img className="arrow" src="../../content/images/ic-time-line-arrow.svg" alt="" />
          {getOldNewValue(item.valueChange)[1]}
        </div>
      </>
    );
  }

  const userFormat = Storage.session.get(USER_FORMAT_DATE_KEY, APP_DATE_FORMAT);
  if (!milestoneHistories || milestoneHistories.length < 1) {
    return (
      <>
        <div className="tab-content">
          <div className="tab-pane active">
            <div className="list-table pt-2 images-group-middle">
              <div className="align-center images-group-content">
                <img className="images-group-16" src="../../content/images/task/ic-flag-red.svg" alt="" />
                <div className="align-center">{translate('messages.INF_COM_0020', { 0: translate('milestone.detail.form.change-history') })} </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  } else {
    return (
      <>
        <div className="tab-content">
          <div className="tab-pane active">
            <div className="list-table overflow-y-hover style-3 pr-3">
              <div className="time-line">
                {milestoneHistories.map((item) => {
                  const arrayTime = (formatDateTime(utcToTz(item.updatedDate).toString(), 'YYYY/MM/DD HH:mm')).split(" ");
                  return (
                    <>
                      <div className="time-item">
                        <div className="title">{item.contentChange ? translate('milestone.detail.form.label-change-history-update')
                          : translate('milestone.detail.form.label-change-history-create')}</div>
                        {
                          item.contentChange && item.contentChange.length > 0 && item.contentChange.map((item1) => {
                            return (
                              <>
                                {renderInformationChange(item1)}
                              </>
                            )
                          })
                        }
                        < div className="item align-items-center" >
                          {
                            item.updatedUserImage ?
                              <img className="user" src={item.updatedUserImage} alt="" /> :
                              <div className={`no-avatar ${colors.employee}`}>{firstChar(item.updatedUserName)}</div>
                          }
                          < span className="text-blue" >
                            <a onClick={() => onOpenPopupEmployeeDetail(item.updatedUserId)}>{item.updatedUserName}</a>
                          </span>
                          <span className="pl-4 pr-3">
                            {dateFnsFormat(arrayTime[0], userFormat)}
                          </span>
                          {arrayTime[1]}</div>
                      </div>
                    </>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
        {
          openPopupEmployeeDetail &&
          <PopupEmployeeDetail
            id={employeeDetailCtrlId[0]}
            showModal={true}
            employeeId={employeeId}
            listEmployeeId={[listEmployeeId]}
            toggleClosePopupEmployeeDetail={onClosePopupEmployeeDetail}
            resetSuccessMessage={() => { }}
            openFromModal={true}
            openFromMilestone={true}
            backdrop={false}
          />
        }
      </>
    );
  }
}

export default TabChangeHistory;




