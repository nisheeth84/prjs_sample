import React, { useState } from 'react';
import { connect } from "react-redux";
import { useId } from "react-id-generator";
import {
  hideModalSubDetail,
  showModalDelete,
  ACTION_TYPE, showModalDetail
} from "app/modules/calendar/modal/calendar-modal.reducer";
import { CONVERT_DATE, AttendanceDivisionType, LICENSE_IN_CALENDAR } from "app/modules/calendar/constants";
import { IRootState } from "app/shared/reducers";
import { translate } from "react-jhipster";
import { setPreScheduleData } from "app/modules/calendar/popups/create-edit-schedule.reducer";
import PopupEmployeeDetail from "app/modules/employees/popup-detail/popup-employee-detail";

import PopupCustomerDetail from 'app/modules/customers/popup-detail/popup-customer-detail';
import BusinessCardDetail from 'app/modules/businessCards/business-card-detail/business-card-detail';

/**
 * interface of tip schedule detail
 */
type ICalendarTipScheduleProps = StateProps & DispatchProps & {
  dataSchedule?: {
    scheduleId?,
    updatedDate?,
    productTradings?: [
      { productTradingId: number, productTradingName: string, customerId: number },
    ],
    customer?: {
      customerId?: number;
      parentCustomerName?: string;
      customerName?: string;
      customerAddress?: string;
    },
    relatedCustomers?: [
      {
        customerId: number,
        customerName: string
      }
    ],
    startDate?,
    finishDate?,
    zipCode?: string,
    prefecturesId?: number,
    prefecturesName?: string,
    addressBelowPrefectures?: string,
    buildingName?: string,
    equipments?: [{ equipmentName?: string }],
    businessCards?: [{ businessCardName?: string ; businessCardId?: number}],
    participants?: {
      employees: [{
        employeeId?: any;
        employeeName?: any;
        employeeSurname?: any;
        status?: number;
        photoEmployeeImg?: string;
      }]
    },
    sharers?: {
      employees: [{ employeeName?: string, employeeId?: number, employeeSurname?: string }]
    },
    tasks?: [
      {
        taskId?: any,
        taskName?: any,
        startDate?: string
      }
    ],
    milestones?: [
      {
        milestonesId?: any,
        milestoneName?: any,
        startDate?: string
      }
    ],
    files?: [
      { filePath?: string, fileName: string },
    ],
    historyFiles?: {
      createdAt?: string,
      createdBy?: string,
      lastUpdatedAt?: string,
      lastUpdatedBy?: string
    },
  };

  service?: {
    businessCards?: boolean,
    activities?: boolean,
    customer?: boolean,
    customerSales?: boolean,
  }
}

/**
 * component tip schedule detail
 * @param props
 * @constructor
 */
const TipScheduleDetails = (props: ICalendarTipScheduleProps) => {
  /**
   * employeeid
   */
  const [employeeId, setEmployeeId] = useState();
  /**
   * status of employee detail
   */
  const [showEmployeeDetails, setShowEmployeeDetails] = useState(false);
  const [customerId, setCustomerId] = useState(0);
  const [showCustomerDetail, setShowCustomerDetail] = useState(false);
  const [displayActivitiesTab, setDisplayActivitiesTab] = useState(false);
  const [openPopupBusinessCardDetail, setOpenPopupBusinessCardDetail] = useState(false);
  const [businessCardId, setBusinessCardId] = useState(null);
  const employeeDetailCtrlId = useId(1, "tipScheduleEmployeeDetail_")
  const customerDetailCtrlId = useId(1, "tipScheduleDetailCustomerDetailCtrlId_");

  /**
   *close popup employee detail
   */
  const onClosePopupEmployeeDetail = () => {
    setShowEmployeeDetails(false);
  }
  /**

  
   /**
   * check and render modal employee detail
   */
  const renderPopUpEmployeeDetails = () => {
    if (showEmployeeDetails) {
      return <PopupEmployeeDetail
        id={employeeDetailCtrlId[0]}
        showModal={true}
        employeeId={employeeId}
        listEmployeeId={[employeeId]}
        toggleClosePopupEmployeeDetail={onClosePopupEmployeeDetail}
        resetSuccessMessage={() => {
        }} />
    }
  }

  const onOpenModalCustomerDetail = (customerIdParam, detail) => {
    setCustomerId(customerIdParam);
    setShowCustomerDetail(true);
    setDisplayActivitiesTab(detail);
  }

  /**
   * set employeeId and set show modal employee details
   * @param itemId
   */
  const openPopUpEmployeeDetails = (itemId) => {
    setShowEmployeeDetails(true);
    setEmployeeId(itemId);
  }

  const onClosePopupBusinessCardDetail = () => {
    setOpenPopupBusinessCardDetail(false);
  }
  
  const onOpenModalBusinessCardDetail = (businessCardIdParam) => {
    setBusinessCardId(businessCardIdParam);
    setOpenPopupBusinessCardDetail(true);
  }

  /**
   * truncate long text
   * @param str
   * @param lengthStr
   */
  const textTruncate = (str, lengthStr = 50) => {
    const ending = '...';
    if (str && str.length > lengthStr)
      return str.substring(0, lengthStr) + ending;
    if (str && str.length < lengthStr)
      return str
  }
  /**
   * render list related customers
   */
  const dataRelatedCustomers = () => {
    const { relatedCustomers } = props.dataSchedule;
    const listRelatedCustomers = [];
    relatedCustomers.forEach((customer, index) => {
      const element = <a
        // href={props.tenant + '/customer/' + customer.customerId} key={`customerRelated_${index}`}
        onClick={() => customer.customerId && onOpenModalCustomerDetail(customer.customerId, false)}
      >
        <span className="text-blue text-small" />{(index > 0) ? ' , ' : ''}{customer.customerName}
      </a>
      listRelatedCustomers.push(element);
    })
    return (
      <div className="item mb-1 text-ellipsis">{listRelatedCustomers}</div>
    )
  }

  // /**
  //  * render list customers and product
  //  */
  // const dataCustomers = () => {
  //   const { customer } = props.dataSchedule;
  //   const { productTradings } = props.dataSchedule
  //   const listCustomer = [];
  //   const listProduct = [];
  //   productTradings && productTradings.forEach((product) => {
  //     listProduct.push(product.productTradingName);
  //   })

  //   const textElement = customer.customerName && customer.customerName + '/' + listProduct.join(', ');
  //   const element = <div className="item mb-1">
  //     <a href={props.tenant + '/customer/' + customer.customerId}>
  //       <span className="text-blue text-small">{textTruncate(textElement, 36)}</span>
  //     </a>
  //     {props.service.activities === ACTION_TYPE.ACTIVATE &&
  //       <a
  //         className="button-primary button-activity-registration cl-black" >{translate('calendars.modal.historyActivities')}</a>
  //     }
  //   </div>;
  //   listCustomer.push(element);
  //   return listCustomer;
  // }

  const onClosePopupCustomerDetail = () => {
    setShowCustomerDetail(!showCustomerDetail);
    setDisplayActivitiesTab(false)
    document.body.className = 'wrap-calendar';
  }

  /**
   * render list business cards
   */
  const dataBusinessCards = () => {
    const { businessCards } = props.dataSchedule;
    const listRelatedCustomer = [];
    businessCards.forEach((relatedCustomer, index) => {
      const element = <a><span
        className="text-blue text-small" onClick={() => onOpenModalBusinessCardDetail(relatedCustomer.businessCardId)}>{(index > 0) ? ' , ' : ''} {relatedCustomer.businessCardName}</span></a>
      listRelatedCustomer.push(element)
    })
    return (
      <div className="item">{listRelatedCustomer}</div>
    );
  }
  /**
   * render list equipments
   */
  const dataEquipments = () => {
    const { equipments } = props.dataSchedule;
    const listEquipments = [];
    equipments.forEach((equipment, index) => {
      const equipmentsNameJson = JSON.parse(equipment.equipmentName)
      let equipmentsName = ""
      if (equipmentsNameJson[`${props.account['languageCode']}`].length > 0) {
        equipmentsName = equipmentsNameJson[`${props.account['languageCode']}`]
      } else if (equipmentsNameJson[`ja_jp`].length > 0) {
        equipmentsName = equipmentsNameJson[`ja_jp`]
      } else if (equipmentsNameJson[`en_us`].length > 0) {
        equipmentsName = equipmentsNameJson[`en_us`]
      } else if (equipmentsNameJson[`zh_cn`].length > 0) {
        equipmentsName = equipmentsNameJson[`zh_cn`]
      }
      const element = <span>{(index > 0) ? ' , ' : ''} {equipmentsName}</span>
      listEquipments.push(element)
    })
    return (
      <div className="text-small">{listEquipments}</div>
    );
  }
  /**
   * render list employees participants
   * @param status
   */
  const dataParticipants = (status) => {
    const employees = props.dataSchedule && props.dataSchedule.participants && props.dataSchedule.participants['employees'];
    const listEmployees = [];
    if (employees) {
      employees.forEach((employee, index) => {
        let employeeNames = ""
        employeeNames = employee.employeeName ? employee.employeeName : employee.employeeSurname
        const element = <a className="text-ellipsis tip-schedule-participant" onClick={() => openPopUpEmployeeDetails(employee.employeeId)}>
          <img className={'user'}
            src={employee.photoEmployeeImg ? employee.photoEmployeeImg : '../../../content/images/ic-user1.svg'}
            alt="" />
          <span className='text-blue mr-4'>
            {employeeNames}
          </span>
        </a>;
        if (employee['attendanceDivision'] === status) listEmployees.push(element);
      })
      return (
        <div className="item item2 flex-wrap">
          {listEmployees}
        </div>
      );
    }
  }


  /**
   * render list employees share
   */
  const dataListSharers = () => {
    const employees = props.dataSchedule && props.dataSchedule.sharers && props.dataSchedule.sharers["employees"];
    const listSharers = [];
    if (employees)
      employees.forEach((Sharer, index) => {
        let employeeNames = ""
        employeeNames = Sharer.employeeName ? Sharer.employeeName : Sharer.employeeSurname
        const element = (
          <a className="text-ellipsis tip-schedule-participant" onClick={() => openPopUpEmployeeDetails(Sharer.employeeId)}>
            <img className={'user'} src={Sharer['photoEmployeeImg'] ? Sharer['photoEmployeeImg'] : '../../../content/images/ic-user1.svg'} alt="" />
            <span className={(index === 0) ? 'text-blue' : 'text-blue ml-4'} key={index}> {employeeNames}</span>
          </a>)
        listSharers.push(element)
      })
    return (
      <div className="item item2">
        {listSharers}
      </div>
    );
  }
  const renderFullAddress = (entitySchedule) => {
    const fullAddress = []
    if (entitySchedule['zipCode'] || entitySchedule['addressBelowPrefectures'] || entitySchedule['buildingName']) {
      fullAddress.push("〒")
    }
    if (entitySchedule['zipCode'])
      fullAddress.push(entitySchedule['zipCode'])

    if (entitySchedule['addressBelowPrefectures']) {
      // if (entitySchedule['zipCode']) {
      //   fullAddress.push(" ")
      // }
      fullAddress.push(entitySchedule['addressBelowPrefectures'])
    }
    if (entitySchedule['buildingName']) {
      // if (entitySchedule['zipCode'] || entitySchedule['addressBelowPrefectures']) {
      //   fullAddress.push(" ")
      // }
      fullAddress.push(entitySchedule['buildingName'])
    }
    return fullAddress.join('')
  }

  const renderCustomerName = (schedule) => {
    const customerName = schedule?.customer?.customerName;
    const parentCustomerName = schedule?.customer?.parentCustomerName;
    const aryResult = [];

    if (customerName) {
      aryResult.push(customerName)
    }
    if (parentCustomerName) {
      if (customerName) {
        aryResult.push(" ")
      }
      aryResult.push(parentCustomerName)
    }

    return aryResult.join('');
  }
  const renderProductTradings = (schedule) => {
    const customerName = renderCustomerName(schedule);
    const productTradings = schedule?.productTradings;
    const aryResult = [];
    const listCustomer = [];

    aryResult.push(customerName)
    if (productTradings && productTradings.length > 0) {
      const tmp = [];
      productTradings.forEach(element => {
        if (element?.productName) {
          if (element.productName) tmp.push(element.productName)
        }
      });

      if (customerName && tmp.length) {
        aryResult.push("／")
      }
      aryResult.push(tmp.join(","))
    }
    const aryResults = aryResult.join('');
    const elements = <div className="item mb-1 d-flex">
      <a className="text-ellipsis w70" title=''
        //  href={`${props.tenant}/customer/${schedule['customer']['customerId']}`}
        onClick={() => schedule['customer']['customerId'] && onOpenModalCustomerDetail(schedule['customer']['customerId'], false)}
      >
        <span className="text-blue text-small">{aryResults}</span>
      </a>
      {Array.isArray(props.listLicense) 
      && props.listLicense.includes(LICENSE_IN_CALENDAR.ACTIVITY_LICENSE) && schedule['customer']['customerId'] &&
        <a
          className="button-primary button-activity-registration cl-black" onClick={() => schedule['customer']['customerId'] && onOpenModalCustomerDetail(schedule['customer']['customerId'], true)}>{translate('calendars.modal.historyActivities')}</a>
      }
    </div>;
    listCustomer.push(elements);
    return listCustomer;
  }
  if (props.dataSchedule) {
    return (
      <>
        <div className="list-item-popup">
          <div className="list-item mb-4">
            <div className="img"><span className="cicle-dot" /></div>
            <div>
              <div>
                <a className="title"
                  onClick={() => props.showModalDetail(props.dataSchedule['scheduleId'])}>{props.dataSchedule['scheduleName']}</a>
              </div>
              <div
                className="text-content">{CONVERT_DATE(props.dataSchedule['startDate'], props.dataSchedule["finishDate"])}</div>
            </div>
          </div>
          {Array.isArray(props.listLicense) 
          && props.listLicense.includes(LICENSE_IN_CALENDAR.CUSTOMER_LICENSE) 
          && props.listLicense.includes(LICENSE_IN_CALENDAR.SALES_LICENSE) &&
            <div className="list-item">
              <div className="img"><img src="../../../content/images/ic-building.svg" alt="" /></div>
              <div className={'w-100'}>
                <div className="text-content mb-1">{translate('calendars.modal.customerProductTradings')}</div>
                {props.dataSchedule.customer && renderProductTradings(props.dataSchedule)}
              </div>
            </div>
          }
          {Array.isArray(props.listLicense) 
          && props.listLicense.includes(LICENSE_IN_CALENDAR.CUSTOMER_LICENSE) &&
            <div className="list-item">
              <div className="img"><img src="../../../content/images/ic-building.svg" alt="" /></div>
              <div className={'w-100'}>
                <div className="text-content mb-1">{translate('calendars.modal.relatedCustomers')}</div>
                {props.dataSchedule.relatedCustomers && dataRelatedCustomers()}
              </div>
            </div>
          }
          <div className="list-item">
            <div className="img"><i className="fas fa-map-marker-alt" /></div>
            <div className={'w-100'}>
              <div className="text-content mb-1">{translate('calendars.modal.address')}</div>
              {
                <div className="item">
                  <a className="text-ellipsis" href={`http://maps.google.com/?q=${props.dataSchedule['zipCode']}${props.dataSchedule['addressBelowPrefectures']}${props.dataSchedule['buildingName']}`}>
                    <span className="text-blue text-small">
                      {renderFullAddress(props.dataSchedule)}
                    </span>
                  </a>
                </div>
              }
            </div>
          </div>
          <div className="list-item">
            <div className="img"><i className="fas fa-door-open" /></div>
            <div className={'w-100'}>
              <div className="text-content mb-1">{translate('calendars.modal.equipments')}</div>
              {props.dataSchedule.equipments &&
                <div className="item">
                  {dataEquipments()}
                </div>
              }
            </div>
          </div>
          {Array.isArray(props.listLicense) 
          && props.listLicense.includes(LICENSE_IN_CALENDAR.BUSINESS_CARD_LICENSE) &&
            <div className="list-item">
              <div className="img"><i className="fas fa-user" /></div>
              <div className={'w-100'}>
                <div className="text-content mb-1">{translate('calendars.modal.businessCards')}</div>
                {props.dataSchedule.businessCards && dataBusinessCards()}
              </div>
            </div>
          }
          <div className="list-item">
            <div className="img"><i className="fas fa-user" /></div>
            <div className={'w-100'}>
              <div className="text-content mb-1">{translate('calendars.modal.participants')}</div>
              {dataParticipants(AttendanceDivisionType.Available)}
              <div className="text-content mb-1">{translate('calendars.modal.absentees')}</div>
              {dataParticipants(AttendanceDivisionType.Absent)}
              <div className=" text-content mb-1">{translate('calendars.modal.unconfirmed')}</div>
              {dataParticipants(AttendanceDivisionType.NotConfirmed)}
              <div className="text-content mb-1">{translate('calendars.modal.sharers')}</div>
              {dataListSharers()}
            </div>
          </div>
        </div>
        {renderPopUpEmployeeDetails()}
        {showCustomerDetail &&
          <PopupCustomerDetail
            id={customerDetailCtrlId[0]}
            showModal={true}
            customerId={customerId}
            listCustomerId={[]}
            toggleClosePopupCustomerDetail={onClosePopupCustomerDetail}
            openFromOtherServices={true}
            displayActivitiesTab={displayActivitiesTab}
          />
        }
        {openPopupBusinessCardDetail &&
          <BusinessCardDetail
            key={businessCardId}
            showModal={true}
            businessCardId={businessCardId}
            listBusinessCardId={[]}
            toggleClosePopupBusinessCardDetail={onClosePopupBusinessCardDetail}
            businessCardList={[]}
          ></BusinessCardDetail>}
      </>
    );
  }
}

const mapStateToProps = ({ dataModalSchedule, applicationProfile, authentication }: IRootState) => ({
  // service: dataModalSchedule.service,
  dataSchedule: dataModalSchedule.dataSchedule,
  tenant: applicationProfile.tenant,
  account: authentication.account,
  listLicense: authentication.account.licenses
});

const mapDispatchToProps = {
  hideModalSubDetail,
  showModalDelete,
  showModalDetail,
  setPreScheduleData
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TipScheduleDetails);
