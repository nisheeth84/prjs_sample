import React, { useState, useMemo } from 'react';
import { useId } from "react-id-generator";
import { formatDate, convertDateTimeFromServer } from 'app/shared/util/date-utils';
import PopupEmployeeDetail from '../../../../employees/popup-detail/popup-employee-detail';
import DetailTaskModal from 'app/modules/tasks/detail/detail-task-modal';
import { LICENSE } from '../../constants';
import { STATUS_TASK } from '../../../constants';

import { translate } from 'react-jhipster';
import moment from 'moment';
import PopupCustomerDetail from 'app/modules/customers/popup-detail/popup-customer-detail';

export interface IPopupTabSummary {
  milestone: any,
  listLicense: any,
  tenant?,
  onOpenPopupEmployeeDetail?: (userUpdateId) => void;
}

/**
 * Render component tab summary
 * @param props
 */
const TabSummary = (props: IPopupTabSummary) => {
  const [openModaTaskDetail, setOpenModalTaskDetail] = useState(false);
  const [taskDetailId, setTaskDetailId] = useState(null);
  const [openPopupEmployeeDetail, setOpenPopupEmployeeDetail] = useState(false);
  const [employeeId, setEmployeeId] = useState(0);
  const [listEmployeeId, setListEmployeeId] = useState([]);
  const [openCustomerDetail, setOpenCustomerDetail] = useState(false);
  const [displayActivitiesTab, setDisplayActivitiesTab] = useState(false);
  const employeeDetailCtrlId = useId(1, "milestoneDetailEmployeeDetail_")
  const customerDetailCtrlId = useId(1, "mileStoneDetailCustomerDetailCtrlId_");
  
  const currentCustomerId = useMemo(() => {
    if (props.milestone && props.milestone.customer && props.milestone.customer.customerId) {
      return props.milestone.customer.customerId;
    }
  }, [props.milestone]);


  /**
     * event close popup task detail
     */
  const toggleCloseModalTaskDetail = () => {
    setTaskDetailId(null);
    setOpenModalTaskDetail(false);
  };

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

  const onOpenModalTaskDetail = taskId => {
    setTaskDetailId(taskId);
    setOpenModalTaskDetail(true);
  };


  /**
   * check date 
   * @param dateCheck 
   */
  const checkOverdueComplete = (dateCheck, status) => {
    if (!dateCheck) {
      return false;
    }
    if (!moment.isDate(dateCheck)) {
      dateCheck = convertDateTimeFromServer(dateCheck);
    }
    if (dateCheck < moment().utcOffset(0).set({ hour: 0, minute: 0, second: 0 }).local(true).toDate()
      && status !== STATUS_TASK.COMPLETED) {
      return true;
    }
    return false;
  }

  const renderListTaskDetail = () => {
    if (!props.milestone || !props.milestone.listTask || !props.milestone.listTask.length) {
      return <></>;
    }
    const arrItem = props.milestone.listTask.map((item) => {
      return (
        <>
          <div className="font-size-12">
            <span className={checkOverdueComplete(item.finishDate, item.status) ? 'color-red' : ''}>{item.finishDate ? formatDate(item.finishDate) : ""}</span> &nbsp;<a key={item.taskId} className="color-blue" onClick={() => onOpenModalTaskDetail(item.taskId)}>
              {item.taskName}
            </a>
          </div>
        </>
      );
    });
    return arrItem;
  };

  const onClosePopupCustomerDetail = () => {
    setDisplayActivitiesTab(false);
    setOpenCustomerDetail(false);
    document.body.className = "wrap-task modal-open";
  }

  const onOpenPopupCustomerDetail = () => {
    setOpenCustomerDetail(true);
    event.preventDefault();
  }

  return (
    props.milestone &&
    <div className="tab-content">
      <div className="tab-pane active">
        <div className="list-item-popup list-table overflow-y-hover pr-3">
          <div>{props.milestone.memo}</div>
          {props.listLicense && props.listLicense.includes(LICENSE.CUSTOMER_LICENSE) &&
            <div className="list-item d-flex justify-content-between">
              <div className="d-flex mt-2">
                <div className="img mr-3"><img src="../../content/images/ic-building.svg" alt="" />
                </div>
                <div>
                  <div>{translate('milestone.detail.form.customer')}</div>
                  <div><a className="color-blue" onClick={() => onOpenPopupCustomerDetail()}>{props.milestone.customer ? props.milestone.customer.customerName : ""}</a>
                  </div>
                </div>
              </div>
              {props.listLicense && props.listLicense.includes(LICENSE.ACTIVITIES_LICENSE) && props.milestone.customer &&
                <div className="mt-2">
                  <button
                    className="button-primary button-activity-registration"
                    onClick={() => {
                      onOpenPopupCustomerDetail();
                      setDisplayActivitiesTab(true);
                    }} >
                    {translate('milestone.detail.form.buton-activity-history')}
                  </button>
                </div>
              }
            </div>
          }
          <div className="list-item d-flex justify-content-between">
            <div className="d-flex mt-2">
              <div className="img mr-2"><img src="../../content/images/task/ic-task.svg" alt="" />
              </div>
              <div>
                <div>{translate('milestone.detail.form.task')}</div>
                <div className="mb-3">
                  {renderListTaskDetail()}
                </div>
                <div className="font-size-12">
                  <div>{translate('milestone.detail.form.create-per')}
                    <a className="color-blue" onClick={() => onOpenPopupEmployeeDetail(props.milestone.createdUser)}>{props.milestone.createdUserName}</a>
                  </div>
                  <div>
                    {translate('milestone.detail.form.create-date')}
                    {formatDate(props.milestone.createdDate)}
                  </div>
                  <div>{translate('milestone.detail.form.update-per')}
                    <a className="color-blue" onClick={() => onOpenPopupEmployeeDetail(props.milestone.updatedUser)}>{props.milestone.updatedUserName}</a>
                  </div>
                  <div>{translate('milestone.detail.form.update-date')}
                    {formatDate(props.milestone.updatedDate)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {openModaTaskDetail && (
        <DetailTaskModal
          iconFunction="ic-task-brown.svg"
          taskId={taskDetailId}
          toggleCloseModalTaskDetail={toggleCloseModalTaskDetail}
          canBack={true}
        />
      )}
      {openPopupEmployeeDetail && (
        <PopupEmployeeDetail
          id={employeeDetailCtrlId[0]}
          showModal={true}
          employeeId={employeeId}
          listEmployeeId={listEmployeeId}
          toggleClosePopupEmployeeDetail={onClosePopupEmployeeDetail}
          resetSuccessMessage={() => { }}
          openFromModal={true}
          openFromMilestone={true}
          backdrop={false}
        />
      )}
      {openCustomerDetail && <>
        <PopupCustomerDetail
          id={customerDetailCtrlId[0]}
          showModal={true}
          customerId={currentCustomerId}
          listCustomerId={[currentCustomerId]}
          toggleClosePopupCustomerDetail={onClosePopupCustomerDetail}
          resetSuccessMessage={() => { }}
          openFromOtherServices={true}
          isOpenCustomerDetailNotFromList={true}
          displayActivitiesTab={displayActivitiesTab}
        />
      </>}
    </div>);
}


export default TabSummary;
