import moment from 'moment';
import { convertDateTimeFromServer } from 'app/shared/util/date-utils';
import { STATUS_TASK } from 'app/modules/tasks/constants';
import { path, ifElse, isNil, map } from 'ramda'
import React, { useMemo } from 'react';
import { getFirstCharacter } from 'app/shared/util/utils';
import _ from 'lodash';
import { translate } from 'react-jhipster';
/**
  * check date 
  * @param dateCheck 
  */
export const checkOverdueComplete = (dateCheck, status) => {
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

export const taskNameInfo = (task) => {
  const taskName = path(['taskName'], task) + ' ';
  const finishDate = path(['finishDate'], task);
  return taskName + (finishDate ? ` (${moment(finishDate).format('YYYY/MM/DD')})` : '');
};

export const getEmployeeFullName = (emp) => {
  let fullName = emp.employeeSurname;
  if (emp.employeeName) {
    fullName += ' ' + emp.employeeName;
  }
  return fullName;
}

export const valueMilestone = (task) => {
  let valueText = '';
  valueText += task?.milestone?.milestoneName ?? '';
  if (task.customer) {
    valueText += translate("commonCharacter.left-parenthesis")
    valueText += task.customer.parentCustomerName ? `${task.customer.parentCustomerName}${translate("commonCharacter.minus")}` : '';
    valueText += task.customer.customerName;
    if (task.productTradings && task.productTradings.length > 0) {
      valueText += translate("commonCharacter.splash")
      valueText += task.productTradings[0].productTradingName;
    }
    valueText += translate("commonCharacter.right-parenthesis")
  } else if (task.customers && task.customers.length > 0) {
    valueText += translate("commonCharacter.left-parenthesis")
    valueText += task.customers[0].parentCustomerName ? `${task.customer[0].parentCustomerName}${translate("commonCharacter.minus")}` : '';
    valueText += task.customers[0].customerName;
    if (task.productTradings && task.productTradings.length > 0) {
      valueText += translate("commonCharacter.splash")
      valueText += task.productTradings[0].productName;
    }
    valueText += translate("commonCharacter.right-parenthesis")
  }
  return valueText;
}


export const fixTooltipOverflowStyle: React.CSSProperties = {
  overflow: 'initial'
};

export const renderEmployeeName = (operators) => {
  const MAX_LENGTH_EMP = 24;
  const comma = translate("commonCharacter.comma");
  const getEmpOrther = (employeeNames, index) => {
    let numberComma = 0;
    let numberEmp = 0;
    for (let i = MAX_LENGTH_EMP - 4; i < MAX_LENGTH_EMP + 1; i++) {
      if (i <= employeeNames.length && employeeNames[i] === comma.trim()) {
        numberComma++;
      }
    }
    numberEmp = operators.length - 1 - index + numberComma;
    return numberEmp;
  }

  let employeeNames = '';
  let empOrther = 0;
  if (operators && operators.length > 0) {
    for (let i = 0; i < operators.length; i++) {
      if (i !== 0) {
        employeeNames += comma;
      }
      employeeNames += getEmployeeFullName(operators[i]);
      if (employeeNames.length > MAX_LENGTH_EMP) {
        empOrther = getEmpOrther(employeeNames, i);
        employeeNames = employeeNames.substring(0, MAX_LENGTH_EMP - 3);
        employeeNames += '...';
        break;
      }
    }
  }
  if (empOrther > 0) {
    employeeNames += translate('global-tool.left', { number: empOrther });
  }
  return employeeNames;
};

export const getClassCheckDateTask = (dateCheck, status) => {
  let classDate = '';
  if (checkOverdueComplete(dateCheck, status)) {
    classDate = 'text-red ';
  }
  if (status === STATUS_TASK.COMPLETED) {
    classDate = 'line-through ';
  }
  return classDate;
};

export const renderEmployee = (operators) => {
  return (
    <div className="d-flex align-items-center">
      {operators && operators.map((employee, idx) => {
        return (employee.employeeSurname && <div className="item d-inline-flex align-items-center" key={idx}>
          {employee.photoEmployeeImg && !_.isEmpty(employee.photoEmployeeImg) ?
            <div className="user"> <img src={employee.photoEmployeeImg} alt="" style={{ border: 'none' }
            } /></div >
            :
            <div className={"no-avatar green"}>
              {getFirstCharacter(employee.employeeSurname)}
            </div>
          }
          <div className="content">
            <div className="text text1 font-size-12" >{getEmployeeFullName(employee)}</div>
          </div>
        </div>)
      })}
    </div>
  )
};