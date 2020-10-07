import React, { Fragment, useState, useRef, useCallback } from 'react';
import InfoEmployeeCard from 'app/shared/layout/common/info-employee-card/info-employee-card';
import useClickOutSide from '../hooks/useClickOutSide';
import styled from 'styled-components'
import Popover from 'app/shared/layout/common/Popover';

const NameWrapper = styled.div`
  width: 50%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`

const ListEmployee = ({ employees, onOpenPopupEmployeeDetail }) => {
  const employeesBtnRef = useRef(null);
  const employeesRef = useRef(null);
  const showOneEmployeeRef = useRef(null);
  const [employeeIsActive, setEmployeeActive] = useState(null);
  const [openListEmployee, setOpenListEmployee] = useState(false);
  const [openOneEmployee, setOpenOneEmployee] = useState(false);

  useClickOutSide(employeesBtnRef, () => setOpenListEmployee(false));

  const onClickEmployee = employeesId => {
    onOpenPopupEmployeeDetail(employeesId);
  };

  const onMouseEnter = useCallback(
    (event, employeeId) => {
      event.preventDefault();
      setEmployeeActive(employeeId);
    },
    [employeeIsActive]
  );

  const onMouseLeave = useCallback(event => {
    event.preventDefault();
    setEmployeeActive(null);
  }, []);

  const toggleShowListEmployee = useCallback(() => {

    // fix list employee is overlap because item-wrap has overflow: auto property
    if (employeesRef.current) {

      // get position btn employees
      const { top, left, right } = employeesBtnRef.current.getBoundingClientRect();

      employeesRef.current.style.cssText = `
        position: fixed;
        top: ${top + 8}px !important;
        left: ${left}px;
        right: ${right}px;
      `;
    }

    setOpenListEmployee(!openListEmployee);
  }, [openListEmployee]);

  const onMouseEnterShowMainEmployee = useCallback(() => {
    setOpenOneEmployee(true);

    // Calculate position and show
    setTimeout(() => {
      if (showOneEmployeeRef.current) {
        const { top, left, right } = showOneEmployeeRef.current.getBoundingClientRect();
        const employeeCard = showOneEmployeeRef.current.children[0];
        if (employeeCard) {
          employeeCard.style.cssText = `
            position: fixed;
            top: ${top + 15}px !important;
            left: ${left}px;
            right: ${right}px;
            z-index: 99;
            display: block;
          `;
        }
      }
    }, 0);

  }, [openOneEmployee]);

  const onMouseLeaveShowMainEmployee = useCallback(() => {
    setOpenOneEmployee(false);
  }, [openOneEmployee]);

  return (
    <Fragment>
      <a title="" className="text-small" onClick={() => onClickEmployee(employees[0].employeeId)}>
        {
          employees && employees.length > 0 && (
            <Fragment>
              <NameWrapper>
              <span
                onMouseEnter={onMouseEnterShowMainEmployee}
                onMouseLeave={onMouseLeaveShowMainEmployee}
                ref={showOneEmployeeRef}
              >

                  {employees[0].employeeName}
              {
                openOneEmployee && (
                  // fix list employee is overlap when scroll
                  <div
                  onClick={e => e.stopPropagation()}
                    >
                    <InfoEmployeeCard
                      taskType={0}
                      onOpenModalEmployeeDetail={onOpenPopupEmployeeDetail}
                      employee={employees[0]}
                      />
                  </div>
                )
              }
              </span>

              </NameWrapper>
            </Fragment>
          )
        }

        {/* Render List employeee */}
        {employees && employees.length > 1 && (
          <a
            title=""
            className="sales-card__employees-root d-inline-block ml-2"
            ref={employeesBtnRef}
            onClick={e => {
              e.stopPropagation();
              toggleShowListEmployee();
            }}
            onMouseEnter={e => e.stopPropagation()}
          >
            他{employees.length - 1}名{/* Render List Employee */}
            <div
              className={`box-list-user sales-card__list-employees ${
                openListEmployee ? 'is-show' : ''
              }`}
              ref={employeesRef}
            >
              {employees.slice(1).map((employee, index) => (
                // Render Employee
                <div
                  className="sales-card__employee"
                  key={employee.employeeId + index}
                  onClick={e => {
                    e.stopPropagation();
                  }}
                  onMouseEnter={event => onMouseEnter(event, employee.employeeId)}
                  onMouseLeave={event => onMouseLeave(event)}
                >
                  <div className="sales-card__employee-avatar">
                    <img alt="avatar" src="../../../../content/images/ic-user1.svg" />
                  </div>
                  <div className="sales-card__employee-name">{employee.employeeName}</div>
                  {// Render Info Employee Card
                  employeeIsActive === employee.employeeId && (
                    <div className="sales-card__employee-info">
                      <InfoEmployeeCard
                        employee={employee}
                        taskType={0}
                        onOpenModalEmployeeDetail={onOpenPopupEmployeeDetail}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </a>
        )}
      </a>
    </Fragment>
  );
};

export default React.memo(ListEmployee);
