import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import React, { useState, useRef, useMemo } from 'react';
import InfoEmployeeCard from 'app/shared/layout/common/info-employee-card/info-employee-card';

export interface ITaskOperatorAvaProps {
    onOpenModalEmployeeDetail: (employeeId: number) => void,
    employeeData?: any,
    taskType: number,
    employees?: any
}

export const TaskOperatorAva = (props: ITaskOperatorAvaProps) => {
    const employeeData = useMemo(() => {
        if (props.employeeData) {
            return props.employeeData;
        }
    }, [props.employeeData]);
    const index = useMemo(() => {
        if (props.taskType) {
            return props.taskType;
        }
    }, [props.taskType]);

    const [isShowCardEmployee, setShowCardEmployee] = useState(false);
    const [employeeIdCur, setEmployeeIdCur] = useState(0);
    const [isShowListEmployee, setShowListEmployee] = useState(false);
    const imgEmployeeRef = useRef(null);
    const listEmployeeRef = useRef(null);
    const numEmployeeRef = useRef(null);
    const moreEmployeeRef = useRef(null);

    /**
     * create avatar image from first character of name
     * @param event
     */
    const onImageAvatarEmployeeNotFound = (event, operatorData) => {
        event.target.onerror = null;
        const employeeFullName = operatorData.employeeSurname ? operatorData.employeeSurname : operatorData.employeeName;
        const canvas = document.createElement('canvas');
        canvas.setAttribute('width', "48px");
        canvas.setAttribute('height', "48px");
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = "#8ac891";
        ctx.fillRect(0, 0, 48, 48);
        ctx.fillStyle = "#fff"
        ctx.font = "28px Noto Sans CJK JP";
        ctx.fillText(employeeFullName[0], 12, 34);
        event.target.src = canvas.toDataURL('image/jpeg', 1.0);
    }

    const getEventMouseMove = (e) => {
        if (imgEmployeeRef.current && !imgEmployeeRef.current.contains(e.target)) {
            setShowCardEmployee(false);
        }
        if (numEmployeeRef.current && !numEmployeeRef.current.contains(e.target)) {
            setShowListEmployee(false);
        }
    }

  const onMouseEnterNumber = (event) => {
    setShowListEmployee(!isShowListEmployee);
    event.currentTarget.parentElement.className = 'list-user-item show-list';
  }
  const onMouseLeaveNumber = (event) => {
    event.currentTarget.parentElement.className = 'list-user-item'
  }

  addEventListener("mousemove", getEventMouseMove);

  /**
  * render user box info
  * @param employee
  */
  const renderBoxEmployee = (employee, type) => {
    const styleCustom = {}
    const top = imgEmployeeRef.current.getBoundingClientRect().bottom;
    const left = imgEmployeeRef.current.getBoundingClientRect().left;
    const spaceHeight = window.innerHeight - top;
    if (spaceHeight > 350) {
      styleCustom['top'] = `${top}px`;
    } else {
      styleCustom['bottom'] = `${spaceHeight - 45}px`;
      styleCustom['top'] = 'auto';
    }
    if (type === 2) {
      styleCustom['left'] = 'auto';
      styleCustom['right'] = `${window.innerWidth - left - 90}px`;
    } else {
      styleCustom['left'] = `${left}px`;
    }
    return <InfoEmployeeCard employee={employee} onOpenModalEmployeeDetail={props.onOpenModalEmployeeDetail} styleHover={styleCustom} classHover="position-fixed overflow-y-hover max-height-350" />
  }

  const renderBoxEmployeeMore = (employee, type) => {
    let styleCustom = null;
    const HEIGHT_BOX_EMPLOYEE = 240;
    if (moreEmployeeRef && moreEmployeeRef.current) {
      const dimension = moreEmployeeRef.current.getBoundingClientRect();
      if (dimension.bottom + HEIGHT_BOX_EMPLOYEE > window.innerHeight) {
        styleCustom = {
          top: - HEIGHT_BOX_EMPLOYEE + 40,
        }
      }
    }
    return <InfoEmployeeCard employee={employee} taskType={type} onOpenModalEmployeeDetail={props.onOpenModalEmployeeDetail} styleHover={styleCustom} classHover="overflow-y-hover max-height-350"/>
  }

  /**
   * get style of box employees
   */
  const getStyleEmloyeeLs = (type) => {
    const styleEmployeeLs = {}
    const top = imgEmployeeRef.current.getBoundingClientRect().bottom;
    const left = imgEmployeeRef.current.getBoundingClientRect().left;
    const spaceHeight = window.innerHeight - top;
    if (spaceHeight > 350) {
      styleEmployeeLs['top'] = `${top - 10}px`;
    } else {
      styleEmployeeLs['bottom'] = `${spaceHeight - 45}px`;
      styleEmployeeLs['top'] = 'auto';
    }
    if (type === 2) {
      styleEmployeeLs['left'] = 'auto';
      styleEmployeeLs['right'] = `${window.innerWidth - left - 100}px`;
    } else {
      styleEmployeeLs['left'] = `${left}px`;
    }
    return styleEmployeeLs;
  }

  return <>
    {!props.employees &&
      <div key={employeeData.employeeId} className="list-user-item" ref={imgEmployeeRef}>
        <img src={employeeData.photoFilePath} alt=""
          onError={(e) => onImageAvatarEmployeeNotFound(e, employeeData)}
          onMouseEnter={() => setShowCardEmployee(true)}
          onMouseLeave={(e) => getEventMouseMove(e)} />
        {isShowCardEmployee && renderBoxEmployee(employeeData, index)}
      </div>
    }
    {props.employees && props.employees.length > 3 &&
      <>
        <div key={props.employees[2].employeeId} className="list-user-item" ref={imgEmployeeRef}>
          <img src={props.employees[2].photoFilePath}
            onError={(e) => onImageAvatarEmployeeNotFound(e, props.employees[2])}
            onMouseEnter={() => setShowCardEmployee(true)}
            onMouseLeave={(e) => getEventMouseMove(e)} />
          <span onMouseEnter={onMouseEnterNumber} onMouseLeave={onMouseLeaveNumber} className="number" ref={numEmployeeRef}>{props.employees.length - 3}+
                {isShowListEmployee &&
              <div className={'box-list-user text-left position-fixed'} ref={listEmployeeRef} style={getStyleEmloyeeLs(index)}>
                <ul>
                  {props.employees && props.employees.slice(3, props.employees.length).map(employee =>
                    <li key={employee.employeeId} ref={moreEmployeeRef} onMouseEnter={() => { setShowCardEmployee(true); setEmployeeIdCur(employee.employeeId) }} onMouseLeave={(e) => getEventMouseMove(e)}>
                      <a ><img src={employee.photoFilePath}
                        onError={(e) => onImageAvatarEmployeeNotFound(e, employee)}
                        className="icon" alt="" />{(employee.employeeSurname ? employee.employeeSurname + " " : "") +
                          (employee.employeeName ? employee.employeeName : "")}</a>
                      {isShowCardEmployee && employee.employeeId === employeeIdCur && renderBoxEmployeeMore(employee, index)}
                    </li>
                  )}
                </ul>
              </div>
            }
          </span>
          {isShowCardEmployee && !isShowListEmployee && renderBoxEmployee(props.employees[2], index)}
        </div>
      </>
    }
  </>
}

export default TaskOperatorAva;