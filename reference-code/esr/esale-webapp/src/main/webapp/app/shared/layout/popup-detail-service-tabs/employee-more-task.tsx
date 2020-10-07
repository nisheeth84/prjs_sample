import React, { useState, useRef } from 'react';
import * as R from 'ramda';
import { TYPE_DETAIL_MODAL } from 'app/modules/activity/constants';
import { getFullName } from 'app/shared/util/string-utils';
import { translate } from 'react-jhipster';

export interface IBeautyPullDownProps {
  employeeId: any;
  totalEmployees?: any;
  showEmployeeDetail?: (employeeId, type) => void;
}

const EmployeeMoreTask = (props: IBeautyPullDownProps) => {
  const [showDetailTooltip, setShowDetailTooltip] = useState(false);
  const [styleBox, setStyleBox] = useState({ top: '100%', bottom: 'auto' });
  const boxRef = useRef(null);
  const { totalEmployees } = props;

  const handleOnMouseEnter = () => {
    const employeeMore = boxRef.current;
    if (R.path(['offsetParent', 'clientHeight'], employeeMore) - R.path(['offsetTop'], employeeMore) > 150) {
      setStyleBox({ top: '100%', bottom: 'auto' })
    } else {
      setStyleBox({ bottom: '100%', top: 'auto' })
    }
    setShowDetailTooltip(true);
  }

  return (
    <div className="employee-more-of-taskdetail dropdown d-inline-block" onMouseEnter={() => handleOnMouseEnter()} onMouseLeave={() => setShowDetailTooltip(false)} ref={boxRef}>
      <span className="task-of-milestone">{translate('commonCharacter.comma')}&#8230;</span>
      {showDetailTooltip &&
        <div className="box-select-option mt-0 style-3 max-height-200 z-index-99 h-auto overflow-auto" style={styleBox}>
          <ul>
            {totalEmployees &&
              totalEmployees.map((item, index) => {
                return (
                  <li key={index}>
                    {props.employeeId && item.employeeId !== props.employeeId
                      ? (
                        <a onClick={() => props.showEmployeeDetail(item.employeeId, TYPE_DETAIL_MODAL.EMPLOYEE)}>
                          {getFullName(item.employeeSurname, item.employeeName)}
                        </a>
                      ) : (
                        <a>{getFullName(item.employeeSurname, item.employeeName)}</a>
                      )
                    }
                  </li>
                );
              })}
          </ul>
        </div>
      }
    </div>
  )
}

EmployeeMoreTask.propTypes = {

}

export default EmployeeMoreTask;