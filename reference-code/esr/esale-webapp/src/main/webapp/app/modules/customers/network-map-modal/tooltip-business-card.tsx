import React, { useState, useEffect, useRef } from 'react';
import Popover from 'react-tiny-popover';
import CustomPopover from 'app/shared/layout/common/Popover';
import { translate } from 'react-jhipster';
import { getFirstCharacter } from 'app/shared/util/utils';

export interface ITooltipBusinessCardProps {
  rowData: any;
  tenant: any;
  fieldName: any;
  openPopupDetail?: any;
  fieldColumn?: any
}

const TooltipBusinessCard: React.FC<ITooltipBusinessCardProps> = (props) => {
  const [tooltipIndex, setTooltipIndex] = useState(null);
  const ref = useRef(null);
  const refMenu = useRef(null);
  const displayRef = useRef(null);

  const handleClickOutside = (e) => {
    if (refMenu.current && !refMenu.current.contains(e.target)) {
      setTooltipIndex(null);
    }
  }

  useEffect(() => {
    window.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
    }
  }, [])

  const getEmployeeName = (employee) => {
    if (employee.employeeName && employee.employeeSurname) {
      return employee.employeeSurname + ' ' + employee.employeeName;
    } else if (employee.employeeName && !employee.employeeSurname) {
      return employee.employeeName;
    } else {
      return employee.employeeSurname;
    }
  }

  const renderImageAvatar = (employee) => {
    if (employee?.filePath) {
      return (<img src={employee.filePath} alt="" className="user border-0" />);
    } else if (employee?.employeePhoto?.filePath) {
      return (<img src={employee?.employeePhoto?.filePath} alt="" className="user border-0" />);
    } else {
      return (
        <div className={"no-avatar green"}>
          {getFirstCharacter(getEmployeeName(employee))}
        </div>
      );
    }
  }

  const renderMenuSelect = (employees) => {
    return <div className="box-select-option position-static max-height-300 overflow-auto max-width-200 mh-auto" ref={refMenu}>
      {employees.map((emp, idx) =>
        <> {idx > 1 && <div className={`item`}>
          <a onClick={() => props.openPopupDetail(emp.employeeId)}>
            {renderImageAvatar(emp)}
            <span className="text-blue font-size-12">{getEmployeeName(emp)}</span>
          </a>
        </div>}
        </>
      )}
    </div>
  }

  return <>
    {props.rowData &&
      <>
        <div className="align-items-center">
          <div className="d-flex flex-wrap" ref={displayRef}>
            {props.rowData.businessCardReceives &&
              props.rowData.businessCardReceives.map((employee, idx) => {
                return <>
                  {employee.employeeId && <p className={`map-employee-item item${props.rowData.businessCardReceives.length > 1 ? ' w100 pb-1' : ''}`}>
                    <a className="d-flex" onClick={() => props.openPopupDetail(employee.employeeId)}>
                      {renderImageAvatar(employee)}
                      <span className="text-blue text-ellipsis font-size-12">
                        <CustomPopover x={-20} y={25}>{getEmployeeName(employee)}</CustomPopover>
                      </span>
                    </a>
                  </p>}
                </>
              })
            }
          </div>
        </div>
        {/* {props.rowData.businessCardReceives.length >= 3 &&
          <Popover
            align={'end'}
            containerStyle={{ overflow: 'initial', zIndex: '1050' }}
            isOpen={tooltipIndex === props.rowData['businessCardId']}
            position={['bottom', 'top', 'left', 'right']}
            content={renderMenuSelect(props.rowData.businessCardReceives)}
          >
            <a
              className="color-blue"
              onClick={(e) => {
                setTooltipIndex(props.rowData['businessCardId']);
                e.stopPropagation();
              }}>
              {translate('customers.list.show-more-next',
                {
                  0: props.rowData.businessCardReceives.length - 2
                })
              }
            </a>
          </Popover>
        } */}
      </>
    }
  </>;
}


export default TooltipBusinessCard;


