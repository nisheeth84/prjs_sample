import React, {useState} from 'react';
import {FIELD_TYPE} from '../tip-task-details';
import {ChildListData} from './child-list-data';
import {isArray} from 'util';
import InfoEmployeeCard from 'app/shared/layout/common/info-employee-card/info-employee-card';


/**
 * interface list data
 */
type IListData = {
  filesData?: any,
  prefixKey?: string,
  type?: number,
  bodyClass?: string,
  customers?: any,
  productTradings?: any,
  urlPrefix?: string,
  employees?: any,
  operators?: any,
  onMouseLeave?: any,
  openEmployeeDetails?: (employeeId) => void,
}

/**
 * component list data
 */
export const ListData = (props: IListData) => {
  /**
   * status of component child list data
   */
  const [showChildPopup, setShowChildPopup] = useState(false);
  /**
   * li overning
   */
  const [liOvering, setLiOvering] = useState(0);

  /**
   * set prefix key
   */
  const prefixTitle = () => {
    return props.prefixKey ? props.prefixKey : 'default';
  }

  // const renderInfoEmployee = (employee) => {
  //   if (showChildPopup) {
  //     return <ChildListData employee={employee} employees={props.operators}/>
  //   }
  // }
  /**
   * get icon file for file type
   * @param item
   */
  const getIconFile = (item) => {
    const type = item.split('.');
    switch (type[type.length - 1]) {
      case 'pdf':
        return '../../../content/images/common/ic-file-pdf.svg';
      case 'doc':
      case 'docx':
        return '../../../content/images/common/ic-file-doc.svg';
      case 'jpg':
      case 'png':
        return '../../../content/images/common/ic-file-img.svg';
      case 'xls':
      case 'xlsx':
        return '../../../content/images/common/ic-file-xls.svg';
      default:
        return '../../../content/images/common/ic-file-xxx.svg';
    }
  }

  /**
   * render popup list file
   */
  const renderListFiles = () => {
    return <ul>
      {isArray(props.filesData) && props.filesData.map((item, idx) => {
        return <li key={`${prefixTitle()}_${idx}`}>
          <a title="" className="color-707 text-ellipsis" href={item.filePath} download target={'_blank'}>
            <img className="icon mr-4" src={getIconFile(item.fileName)} alt="" title=""/>{item.fileName}
          </a>
        </li>
      })}
    </ul>
  }

  /**
   * render popup list of customer and product trading
   */
  const renderListCustomer = () => {
    return <div className="text">
      {
        isArray(props.customers) &&
        props.customers.map((customer, index) => {
          return <a title="" key={`${prefixTitle()}_${index}`} href={`${props.urlPrefix}/customer-detail/${customer.customerId}`}>
            {customer.parentCustomerName}{customer.customerName}/
            {props.productTradings &&
            props.productTradings.map((product, idx) => {
              const flagDot = idx < props.productTradings.length - 1 ? ',' : '. ';
              return product.productName + flagDot;
            })
            }
          </a>
        })
      }
    </div>
  }

  /**
   * render popup list employees
   */
  const renderListEmployees = () => {
    if (isArray(props.employees)) {
      return (
        <>
          <div onMouseLeave={() => props.onMouseLeave(false)}>
            <ul>
              {props.employees.map((employee, index) => {
                return <li className=" item"
                           onMouseOver={() => {
                             setShowChildPopup(true);
                             setLiOvering(employee.employeeId)
                           }}
                           onMouseLeave={() => setShowChildPopup(false)}
                           key={`${prefixTitle()}_${index}`}>
                  <a title="" onClick={() => props.openEmployeeDetails(employee.employeeId)}>
                    <img className="user" src={employee.photoFilePath ? employee.photoFilePath : '../../../content/images/ic-user1.svg'} alt="" title=""/>{employee.employeeName}
                  </a>
                  {showChildPopup && liOvering === employee.employeeId &&
                  // <ChildListData employee={employee} employees={props.operators} key={index}/>
                  <InfoEmployeeCard 
                    employee={employee}
                    styleHover={null}
                    classHover="overflow-y-hover max-height-350"
                    onOpenModalEmployeeDetail={setLiOvering}
                    />
                  }
                </li>
              })}
            </ul>
          </div>
        </>
      )
    }
  }

  return (
    <div className={props.bodyClass}>
      {(props.type === FIELD_TYPE.FILE) &&
      renderListFiles()
      }
      {(props.type === FIELD_TYPE.CUSTOMER) &&
      renderListCustomer()
      }
      {(props.type === FIELD_TYPE.EMPLOYEE) &&
      renderListEmployees()
      }
    </div>
  )
};



