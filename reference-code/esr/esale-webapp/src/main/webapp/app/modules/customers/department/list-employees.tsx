import React, { useState, useRef, useMemo } from 'react';
import { connect } from 'react-redux';

import { propOr, compose, prop, filter, contains, __, take, takeLast, map } from 'ramda';

import { IRootState } from 'app/shared/reducers';
import { COUNT_MAX_EMPLOYMENTS, isViewAsModal } from '../constants';
import { isMouseOnRef, getFirstCharacter } from 'app/shared/util/utils';
import { ppid } from 'process';
import InfoEmployeeCard from 'app/shared/layout/common/info-employee-card/info-employee-card';
import EmployeeIcon from './icon-employee';
import { onOpenModalEmployeeDetail } from '../network-map-modal/add-edit-network-map.reducer'

export interface IListEmployees extends StateProps, DispatchProps {
  cardData;
  viewType;
}

const ListEmployees: React.FC<IListEmployees> = props => {
  const { employees } = props;
  const boxListUserRef = useRef(null);

  const [onTooltipEmployees, setOnTooltipEmployees] = useState(false);

  const extraEmployees = useMemo(() => {
    const difference = employees.length - COUNT_MAX_EMPLOYMENTS;
    if (difference > 0) {
      return takeLast(difference, employees)
    }
    return [];
  }, [employees]);

  const onMouseOverTooltipEmployees = () => {
    if (boxListUserRef.current) clearTimeout(boxListUserRef.current);
    if (!onTooltipEmployees) {
      setOnTooltipEmployees(true);
    }
  };

  const onMouseOutTooltipEmployees = () => {
    boxListUserRef.current = setTimeout(() => {
      setOnTooltipEmployees(false);
    }, 10);
  };

  const getEmployeeName = (employee) => {
    if (employee.employeeName && employee.employeeSurname) {
      return employee.employeeSurname + ' ' + employee.employeeName;
    } else if (employee.employeeName && !employee.employeeSurname) {
      return employee.employeeName;
    } else {
      return employee.employeeSurname;
    }
  }

  return (
    <div className="list-user">
      {map(
        employee => (
          <EmployeeIcon employee={employee} />
        ),
        take(COUNT_MAX_EMPLOYMENTS, employees)
      )}
      {extraEmployees.length > 0 && (
        <div className="add-user position-relative"
          ref={boxListUserRef}
          onMouseOver={onMouseOverTooltipEmployees} onMouseOut={onMouseOutTooltipEmployees}>
          + {extraEmployees.length}
          {onTooltipEmployees && (
            <div className="box-list-user">
              <ul className="pl-2 pr-2">
                {map(
                  employee => (
                    <EmployeeIcon employee={employee} employeeData={getEmployeeName(employee)} />
                  ),
                  extraEmployees
                )}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const mapStateToProps = ({ addEditNetworkMap }: IRootState, { cardData }) => {
  const employeesResult = propOr([], 'businessCardReceives')(cardData);
  const employeeIds = [];
  employeesResult.map(employee => employeeIds.push(employee.employeeId));
  const filterEmployees = compose(
    filter(
      compose(
        contains(__, employeeIds),
        prop('employeeId')
      )
    ),
    propOr([], 'employeeDatas')
  )(addEditNetworkMap);

  return {
    employees: filterEmployees
  };
};

const mapDispatchToProps = {
  onOpenModalEmployeeDetail
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ListEmployees);
