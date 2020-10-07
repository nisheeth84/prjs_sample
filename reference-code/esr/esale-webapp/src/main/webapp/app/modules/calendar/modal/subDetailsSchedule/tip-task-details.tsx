import React, { useState, useEffect } from 'react';
import { connect } from "react-redux";
import { useId } from "react-id-generator";
import {
  ACTION_TYPE,
  hideModalSubDetail,
  showModalDelete,
  setItemId
} from "app/modules/calendar/modal/calendar-modal.reducer";
import { IRootState } from "app/shared/reducers";
import { translate } from "react-jhipster";
import { setPreScheduleData } from "app/modules/calendar/popups/create-edit-schedule.reducer";
import moment from "moment";
import { ListData } from './popups/list-data';
import { isArray } from 'util';
import { ItemTypeSchedule } from "app/modules/calendar/constants";
import PopupEmployeeDetail from "app/modules/employees/popup-detail/popup-employee-detail";
import { ChildListData } from './popups/child-list-data';
import { CalenderViewMonthCommon } from '../../grid/common';
import PopupCustomerDetail from 'app/modules/customers/popup-detail/popup-customer-detail';
import { checkOnline, resetOnline } from 'app/shared/reducers/authentication.ts';
import InfoEmployeeCard from 'app/shared/layout/common/info-employee-card/info-employee-card';



/**
 * interface tip task detail
 */
type ICalendarTipTaskDetailsProps = StateProps & DispatchProps & {
  service?: {
    businessCards?: boolean,
    activities?: boolean,
    customer?: boolean,
    customerSales?: boolean,
  }
}

/**
 * field type
 */
export const enum FIELD_TYPE {
  FILE = 1,
  CUSTOMER = 2,
  EMPLOYEE = 3
}


// const DUMMY_DATA = {
//   "task": {
//     "taskId": 1502,
//     "taskData": [],
//     "taskName": "Task test 502 edit hanh",
//     "memo": "có memo",
//     "operators": [
//       {
//         "employees": [
//           {
//             "employeeId": 2,
//             "employeeName": "yamada Akako",
//             "photoEmployeeImg": "https://i.pinimg.com/564x/32/54/8c/32548c219bf8d22f0a95e7495629a44a.jpgtest2",
//             "departmentName": "DEV1",
//             "positionName": ""
//           },
//           {
//             "employeeId": 2,
//             "employeeName": "yamada Akako clone 1",
//             "photoEmployeeImg": "https://i.pinimg.com/564x/32/54/8c/32548c219bf8d22f0a95e7495629a44a.jpgtest2",
//             "departmentName": "DEV1",
//             "positionName": ""
//           },
//           {
//             "employeeId": 2,
//             "employeeName": "yamada Akako clone 2",
//             "photoEmployeeImg": "https://i.pinimg.com/564x/32/54/8c/32548c219bf8d22f0a95e7495629a44a.jpgtest2",
//             "departmentName": "DEV1",
//             "positionName": ""
//           },
//           {
//             "employeeId": 2,
//             "employeeName": "yamada Akako clone 3",
//             "photoEmployeeImg": "https://i.pinimg.com/564x/32/54/8c/32548c219bf8d22f0a95e7495629a44a.jpgtest2",
//             "departmentName": "DEV1",
//             "positionName": ""
//           },
//           {
//             "employeeId": 2,
//             "employeeName": "yamada Akako clone 4",
//             "photoEmployeeImg": "https://i.pinimg.com/564x/32/54/8c/32548c219bf8d22f0a95e7495629a44a.jpgtest2",
//             "departmentName": "DEV1",
//             "positionName": ""
//           }
//         ],
//         "departments": null,
//         "groups": null
//       }
//     ],
//     "totalEmployees": [
//       {
//         "employeeId": 2,
//         "employeeName": "yamada Akako",
//         "photoEmployeeImg": "https://i.pinimg.com/564x/32/54/8c/32548c219bf8d22f0a95e7495629a44a.jpgtest2",
//         "departmentName": "DEV1",
//         "positionName": "ABC"
//       },
//       {
//         "employeeId": 2,
//         "employeeName": "Akako clone 1",
//         "photoEmployeeImg": "https://i.pinimg.com/564x/32/54/8c/32548c219bf8d22f0a95e7495629a44a.jpgtest2",
//         "departmentName": "DEV2",
//         "positionName": "BCD"
//       },
//       {
//         "employeeId": 2,
//         "employeeName": "Akako clone 2",
//         "photoEmployeeImg": null,
//         "departmentName": "DEV3",
//         "positionName": "A1"
//       },
//       {
//         "employeeId": 2,
//         "employeeName": "Akako clone 3",
//         "photoEmployeeImg": null,
//         "departmentName": "DEV4",
//         "positionName": "A2"
//       },
//       {
//         "employeeId": 2,
//         "employeeName": "Akako clone 4",
//         "photoEmployeeImg": "https://i.pinimg.com/564x/32/54/8c/32548c219bf8d22f0a95e7495629a44a.jpgtest2",
//         "departmentName": "DEV5",
//         "positionName": "A3"
//       }
//     ],
//     "customers": [
//       {
//         "customerId": 1,
//         "parentCustomerName": "Parent 01",
//         "customerName": "Cus 001",
//         "customerAddress": "Cus Address 1"
//       },
//       {
//         "customerId": 2,
//         "parentCustomerName": "Parent 02",
//         "customerName": "Cus 002",
//         "customerAddress": "Cus Address 2"
//       },
//       {
//         "customerId": 3,
//         "parentCustomerName": "Parent 03",
//         "customerName": "Cus 003",
//         "customerAddress": "Cus Address 3"
//       },
//       {
//         "customerId": 4,
//         "parentCustomerName": "Parent 04",
//         "customerName": "Cus 004",
//         "customerAddress": "Cus Address 4"
//       }
//     ],
//     "milestoneId": 67,
//     "milestoneName": "Mlileston 123",
//     "milestoneFinishDate": null,
//     "milestoneParentCustomerName": "Parent Customer Name",
//     "milestoneCustomerName": "Custormer Name",
//     "files": [
//       {
//         fileId: 1,
//         filePath: 'anh-template.jpg',
//         fileName: 'anh-template.jpg'
//       },
//       {
//         fileId: 2,
//         filePath: 'document.doc',
//         fileName: 'document.doc'
//       },
//       {
//         fileId: 3,
//         filePath: 'Excel.xlsx',
//         fileName: 'Excel.xlsx'
//       },
//     ],
//     "productTradings": [
//       {
//         productTradingId: 1,
//         productId: 1,
//         productName: 'san pham 1'
//       },
//       {
//         productTradingId: 2,
//         productId: 2,
//         productName: 'san pham 2'
//       },
//       {
//         productTradingId: 3,
//         productId: 3,
//         productName: 'san pham 3'
//       }
//     ],
//     "subtasks": [],
//     "countEmployee": 1,
//     "startDate": "2020-04-06T22:00:00Z",
//     "finishDate": "2020-04-30T22:00:00Z",
//     "parentTaskId": null,
//     "statusParentTaskId": null
//   }
// };

/**
 * component tip task detail
 * @param props
 * @constructor
 */
const TipTaskDetails = (props: ICalendarTipTaskDetailsProps) => {
  // const dataInfo = DUMMY_DATA;
  /**
   * status of list customer
   */
  const [showListCustomer, setShowListCustomer] = useState(false);
  /**
   * status of list employee
   */
  const [showListEmployee, setShowListEmployee] = useState(false);

  const [showMorePorduct, setShowMorePorduct] = useState(false);

  /**
   * data info
   */
  const { dataInfo } = props.dataTask;
  /**
   * status of component list file
   */
  const [showListFile, setShowListFile] = useState(false);
  /**
   * status of component employee detail
   */
  const [showEmployeeDetails, setShowEmployeeDetails] = useState(false);
  /**
   * employee id
   */
  const [employeeId, setEmployeeId] = useState();
  /**
   * employee id
   */
  const [showChildPopup, setShowChildPopup] = useState(false);
  const [liOvering, setLiOvering] = useState(0);
  const [showCustomerDetail, setShowCustomerDetail] = useState(false);
  const [displayActivitiesTab, setDisplayActivitiesTab] = useState(false);
  const [customerId, setCustomerId] = useState(0);
  const [online, setOnline] = useState(-1);

  const [langKey, setLangKey] = useState()
  const employeeDetailCtrlId = useId(1, "tipTaskEmployeeDetail_")
  const customerDetailCtrlId = useId(1, "tipTaskDetailCustomerDetailCtrlId_");


  const onClosePopupCustomerDetail = () => {
    setShowCustomerDetail(!showCustomerDetail);
    setDisplayActivitiesTab(false)
    document.body.className = 'wrap-calendar';
  }

  const onOpenModalCustomerDetail = (customerIdParam, showHistoriesTab: boolean) => {
    setCustomerId(customerIdParam);
    setShowCustomerDetail(true);
    setDisplayActivitiesTab(showHistoriesTab);
  }

  const callApiCheckOnline = (id) => {
    props.checkOnline(id)
  }

  useEffect(() => {
    setOnline(props.onlineNumber)
  }, [props.onlineNumber]);
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
        resetSuccessMessage={() => { }} />
    }
  }

  /**
   * set employeeId and set show modal employee details
   * @param itemId
   */
  const openPopUpEmployeeDetails = (itemId) => {
    setShowEmployeeDetails(true);
    setEmployeeId(itemId);
  }

  /**
   * truncate long text
   * @param string
   * @param length
   */
  const textTruncate = (string, length) => {
    const ending = '...';
    if (string && string.length > length) {
      return string.substring(0, length) + ending;
    } else {
      return string;
    }
  }
  /**
   * check expired milestone, task
   * @param date
   * @param status
   * @param type
   */
  const checkExpired = (date, status, type) => {
    let className = 'date';
    const checkDate = moment(date) < CalenderViewMonthCommon.nowDate()
    if (date && type === ItemTypeSchedule.Task) {
      if (checkDate && status) {
        if (status === 0 || status === 1 || status === 2) {
          className = 'date text-danger';
        }
      }
    } else {
      if (status === 0 && checkDate) {
        className = 'date text-danger';
      }
    }
    return className;
  }



  /**
   * convert Date to format YYY-MM-DD
   * @param startDate
   * @param endDate
   */
  const setDate = (startDate, endDate) => {
    if (startDate && endDate) {
      startDate = moment.utc(startDate).format('YYYY-MM-DD').split('-');
      endDate = moment.utc(endDate).format('YYYY-MM-DD').split('-');
      return (
        <div>
          {startDate[0]}{translate('calendars.commons.typeView.label.year')}
          {startDate[1]}{translate('calendars.commons.typeView.label.month')}{startDate[2]}
          {translate('calendars.commons.typeView.label.day')}
          {/* ({moment.utc(startDate).format('ddd')}) */}
          ~&nbsp;
          {endDate[0]}{translate('calendars.commons.typeView.label.year')}
          {endDate[1]}{translate('calendars.commons.typeView.label.month')}
          {endDate[2]}{translate('calendars.commons.typeView.label.day')}
          {/* ({moment.utc(endDate).format('ddd')}) */}
        </div>
      )
    }
  }

  /**
   * render component popup customer
   * @param customers
   * @param products
   */
  const renderPopupCustomer = (customers, products) => {

    if (customers && showListCustomer) {
      return <ListData customers={customers}
        productTradings={products}
        prefixKey={'listCustomer'}
        type={FIELD_TYPE.CUSTOMER}
        bodyClass={'box-select-option'}
        urlPrefix={props.tenant} />
    }
  }

  /**
   * check length of customer name and product name, if too long then render component popup
   */
  const dataCustomers = () => {
    const arrName = []
    if (
      (dataInfo['task'].customers && dataInfo['task'].customers.length === 1)
    ) {
      return <div className="name-long text-blue d-flex align-items-center justify-content-between">
        <a className="text-ellipsis w70" title=""
          // href={`${props.tenant}/customer-detail/${dataInfo['task'].customers[0].customerId}`
          onClick={() => dataInfo['task'].customers[0].customerId && onOpenModalCustomerDetail(dataInfo['task'].customers[0].customerId, false)}
          onMouseOver={() => setShowMorePorduct(true)}
          onMouseLeave={() => setShowMorePorduct(false)}
        >
          {dataInfo['task'].customers[0].parentCustomerName} &nbsp; {dataInfo['task'].customers[0].customerName}
          {dataInfo['task'].customers[0].parentCustomerName}{dataInfo['task'].customers[0].customerName && dataInfo['task'].productTradings.length > 0 && '／'}
          {
            isArray(dataInfo['task'].productTradings) &&
            dataInfo['task'].productTradings
              .map((item, index) => {
                const flagDot = index < dataInfo['task'].productTradings.length - 1 ? ', ' : '';
                arrName.push(item.productName + flagDot);
                return item.productName + flagDot;
              })
          }
          {showMorePorduct && <div className="box-select-option tip-task-product">
            <div className="text">
              <a className="pre" title=""
                onClick={() => dataInfo['task'].customers[0].customerId && onOpenModalCustomerDetail(dataInfo['task'].customers[0].customerId, false)}
              >
                {dataInfo['task'].customers[0].customerName}
                {dataInfo['task'].customers[0].customerName && dataInfo['task'].productTradings.length > 0 && '／'}
                {arrName}
              </a>
            </div>
          </div>
          }
        </a>{props.service.activities === ACTION_TYPE.ACTIVATE &&
          <a title="" className="button-primary button-activity-registration"
            onClick={() => dataInfo['task'].customers[0].customerId && onOpenModalCustomerDetail(dataInfo['task'].customers[0].customerId, true)}>{translate('calendars.modal.historyActivities')}</a>
        }
      </div>
    }
    // if (dataInfo['task'].customers && dataInfo['task'].customers.length > 1) {
    //   return <div className="name-long" onMouseOver={() => setShowListCustomer(true)}
    //     onMouseLeave={() => setTimeout(() => {
    //       setShowListCustomer(false)
    //     }, 500)}>
    //     <a title="" href={`${props.tenant}/customer-detail/${dataInfo['task'].customers[0].customerId}`}>{
    //       dataInfo['task'].customers[0].parentCustomerName}{dataInfo['task'].customers[0].customerName} /
    //         {
    //         isArray(dataInfo['task'].productTradings) &&
    //         dataInfo['task'].productTradings
    //           .map((item, index) => {
    //             if (index > 1) return;
    //             return item.productName + ',';
    //           })}...
    //       </a>
    //     {renderPopupCustomer(dataInfo['task'].customers, dataInfo['task'].productTradings)}
    //     {props.service.activities === ACTION_TYPE.ACTIVATE &&
    //       <a title="" className="button-primary button-activity-registration">{translate('calendars.modal.historyActivities')}</a>
    //     }
    //   </div>
    // }
  }
  /**
   * render popout employee
   * @param employees
   * @param operators
   */
  const renderPopupEmployees = (employees, operators) => {
    if (employees && showListEmployee) {
      const arr = [];
      employees.map((val, idx) => {
        idx > 2 && arr.push(val)
      })
      return <ListData employees={arr}
        openEmployeeDetails={openPopUpEmployeeDetails}
        operators={operators}
        prefixKey={'listEmployee'}
        bodyClass={'box-list-user set-opsition-box'}
        type={FIELD_TYPE.EMPLOYEE}
        urlPrefix={props.tenant}
        onMouseLeave={setShowListEmployee}
      />
    }
  }

  /**
   * render employees
   */
  const dataPersonInCharges = () => {
    if (dataInfo['task'].totalEmployees && dataInfo['task'].totalEmployees.length <= 3) {
      return <div className="name-long mt-2">
        <div className="name-long d-flex">
          {
            isArray(dataInfo['task'].totalEmployees) &&
            dataInfo['task'].totalEmployees.map((e, index) => {
              return <div className="item item2 position-relative" key={`shortEmployee_${index}`} onMouseLeave={() => setShowChildPopup(false)}>
                <a
                  className={"d-flex width-100-px align-items-center"} title=""
                  onClick={() => openPopUpEmployeeDetails(e.employeeId)}
                >
                  <img className="user" src={e.photoFilePath ? e.photoFilePath : '../../../content/images/ic-user1.svg'} alt="" title="" />
                  <span className="text-blue text-ellipsis"
                    onMouseOver={() => {
                      setShowChildPopup(true);
                      setLiOvering(e.employeeId)
                      callApiCheckOnline(e.employeeId);
                      setShowChildPopup(true);
                      setShowListEmployee(false);
                      setLiOvering(e.employeeId);
                    }}
                  >{e.employeeName} &nbsp;</span>
                </a>
                {showChildPopup && liOvering === e.employeeId &&
                  <InfoEmployeeCard
                    employee={e}
                    styleHover={null}
                    classHover="overflow-y-hover max-height-350"
                    onOpenModalEmployeeDetail={openPopUpEmployeeDetails}
                  />}
              </div>
            })
          }
        </div>
      </div>
    }
    if (dataInfo['task'].totalEmployees.length > 3) {
      const totalEmployees = dataInfo['task'].totalEmployees;
      const numMore = dataInfo['task'].countEmployee - 3
      if (!isArray(totalEmployees)) return;
      return <div className="name-long mt-2">
        <div className="name-long d-flex">
          {totalEmployees.map((item, idx) => {
            if (idx >= 3) {
              return;
            }
            return <div className="item item2 position-relative" key={'longName_' + idx} onMouseLeave={() => setShowChildPopup(false)}>
              <a className={"d-flex width-100-px position-relative"} title=""
                onClick={() => openPopUpEmployeeDetails(item.employeeId)}
                onMouseMove={() => {
                  callApiCheckOnline(item.employeeId);
                  setShowChildPopup(true);
                  setShowListEmployee(false);
                  setLiOvering(item.employeeId);
                }}
              >
                <img className="user" src={item.photoFilePath ? item.photoFilePath : '../../../content/images/ic-user1.svg'} alt="" title="" />
                <span className="text-blue text-ellipsis">{item.employeeName} &nbsp;</span>
              </a>
              {/* {showChildPopup && liOvering === item.employeeId &&
                <ChildListData
                  employee={item}
                  employees={dataInfo['task'].operators}
                  key={item.employeeId}
                  onlineStatus={online}
                  langKey={props.account['languageCode']}
                />} */}
              {showChildPopup && liOvering === item.employeeId &&
                <InfoEmployeeCard
                  employee={item}
                  styleHover={null}
                  classHover="overflow-y-hover max-height-350"
                  onOpenModalEmployeeDetail={openPopUpEmployeeDetails}
                />}
            </div>
          })}
          <div className="item item2" onMouseOver={() => setShowListEmployee(true)}>
            <span className="text-blue">{translate('calendars.commons.more', {numMore})}</span>
          </div>
        </div>
        {renderPopupEmployees(totalEmployees, dataInfo['task'].operators)}
      </div>
    }
  }
  useEffect(() => {
    setLangKey(props.account["languageCode"])
  }, [props.account["languageCode"]])

  /**
   * render component list file
   * @param dataList
   */
  const renderPopupListFiles = (dataList) => {
    if (showListFile) {
      return <ListData filesData={dataList} prefixKey={'listFile'} type={FIELD_TYPE.FILE} bodyClass={'box-list-file style-3'} />
    }
  }
  return props.dataTask && dataInfo && dataInfo.task && (
    <>
      <div className="list-item-popup">
        <div className="list-item mb-4">
          <div className="img"><img title="" src="../../../content/images/calendar/ic-task-brown.svg" alt="" /></div>
          <div>
            <div className="title"><a title="">{dataInfo.task.taskName}</a></div>
            {setDate(dataInfo.task.startDate, dataInfo.task.finishDate)}
            <div>{dataInfo.task.memo}</div>
          </div>
        </div>
        <div className="list-item">
          <div className="img"><img className="style2" title="" src="../../../content/images/calendar/ic-calculator.svg" alt="" /></div>
          <div className="item-name">
            <div className="title">{translate('calendars.modal.customerProductTradings')}</div>
            {(dataInfo.task.customers) &&
              <div className='item mb-1 position-relative'>
                {dataCustomers()}
              </div>
            }
          </div>
        </div>
        <div className="list-item">
          <div className="img"><img className="style2" title="" src="../../../content/images/calendar/ic-calendar-user.svg" alt="" /></div>
          <div>
            <div className="title">{translate('calendars.modal.PersonInCharge')}</div>
            <div className="name-long">
              {dataInfo.task.totalEmployees && dataPersonInCharges()}
            </div>
          </div>
        </div>
        <div className="list-item">
          <div className="img"><img title="" src="../../../content/images/task/ic-task.svg" alt="" /></div>
          <div>
            <div className="title">{translate('tasks.list.card.subtask')}</div>
            {isArray(dataInfo.task.subtasks) &&
              dataInfo.task.subtasks.map((subTask, subTaskIdx) => {
                return (
                  <div className="item" key={'subTask' + subTaskIdx}><span className={`${checkExpired(subTask.finishDate, subTask.statusTaskId, ItemTypeSchedule.Task)}`}>
                    {moment(subTask.finishDate).format('YYYY/MM/DD')}</span><a title="">
                      <span className="text-blue" onClick={() => props.setItemId(subTask.taskId, ItemTypeSchedule.Task)}>{textTruncate(subTask.taskName, 20)}</span></a></div>
                )
              })
            }
          </div>
        </div>
        <div className="list-item">
          <div className="img"><img title="" src="../../../content/images/task/ic-flag.svg" alt="" /></div>
          <div>
            <div className="title">{translate('tasks.list.card.milestone')}</div>
            <div className="item"><span
              className={`${checkExpired(dataInfo.task.milestoneFinishDate, dataInfo.task.isDone, ItemTypeSchedule.Milestone)}`}>{dataInfo.task.milestoneFinishDate && moment(dataInfo.task.milestoneFinishDate).format('YYYY/MM/DD')}
            </span><a title=""><span className="text-blue" onClick={() => props.setItemId(dataInfo.task.milestoneId, ItemTypeSchedule.Milestone)}>{textTruncate(dataInfo.task.milestoneName, 20)}</span></a>
            </div>
          </div>
        </div>
        <div className="list-item">
          <div className="img"><img className="style3" title="" src="../../../content/images/calendar/ic-link.svg" alt="" />
          </div>
          <div>
            <div className="title">{translate('calendars.fieldsList.files')}</div>
            <div className="name-long">
              {dataInfo['task'].files &&
                <div className="width-400-px h-50-px" onMouseOver={() => setShowListFile(true)}
                  onMouseLeave={() => setTimeout(() => {
                    setShowListFile(false)
                  }, 1000)}>
                  <a className='text-ellipsis'>
                    {dataInfo['task'].files.map((val, idx) => {
                      return `${idx > 0 ? ', ' : ''}` + val.fileName;
                    })}
                  </a>
                  {renderPopupListFiles(dataInfo['task'].files)}
                </div>
              }
            </div>
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
    </>
  );
}


const mapStateToProps = ({ dataModalSchedule, applicationProfile, authentication }: IRootState) => ({
  service: dataModalSchedule.service,
  dataTask: dataModalSchedule.dataTask,
  tenant: applicationProfile.tenant,
  onlineNumber: authentication.online,
  account: authentication.account,
});

const mapDispatchToProps = {
  hideModalSubDetail,
  showModalDelete,
  setPreScheduleData,
  setItemId,
  checkOnline,
  resetOnline
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TipTaskDetails);
