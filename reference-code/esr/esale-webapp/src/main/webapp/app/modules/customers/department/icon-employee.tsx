import React, { useRef, useState } from 'react'
import { prop } from 'ramda';
import { onOpenModalEmployeeDetail } from '../network-map-modal/add-edit-network-map.reducer';
import { connect } from 'react-redux';
import { getFirstCharacter } from 'app/shared/util/utils';
import InfoEmployeeCard from 'app/shared/layout/common/info-employee-card/info-employee-card';

export interface IEmployeeIconProps extends StateProps, DispatchProps {
  employee;
  employeeData?;
}

const EmployeeIcon: React.FC<IEmployeeIconProps> = props => {
  const { employee, employeeData } = props;
  const tooltipEmployeeRef = useRef(null);
  const [isShowTooltipEmployeeDetail, setIsShowTooltipEmployeeDetail] = useState(false);

  const onMouseOver = () => {
    if (tooltipEmployeeRef.current) clearTimeout(tooltipEmployeeRef.current);
    if (!isShowTooltipEmployeeDetail) {
      setIsShowTooltipEmployeeDetail(true);
    }
  };

  const onMouseOut = () => {
    tooltipEmployeeRef.current = setTimeout(() => {
      setIsShowTooltipEmployeeDetail(false);
    }, 1);
  };

  const parseEmployee = () => {
    return {
      employeeId: employee.employeeId,
      photoFilePath: employee?.employeePhoto?.filePath ?? "",
      employeeNameKana: employee.employeeNameKana,
      employeeName: employee.employeeName,
      employeeSurnameKana: employee.employeeSurnameKana,
      employeeSurname: employee.employeeSurname,
      email: employee.email,
      cellphoneNumber: employee.cellphoneNumber,
      telephoneNumber: employee.telephoneNumber,
      departmentName: employee.departmentName,
    }
  }

  const getEmployeeName = () => {
    if (employee.employeeName && employee.employeeSurname) {
      return employee.employeeSurname + ' ' + employee.employeeName;
    } else if (employee.employeeName && !employee.employeeSurname) {
      return employee.employeeName;
    } else {
      return employee.employeeSurname;
    }
  }

  return <div
    key={prop('employeeId', employee) + ''}
    className="relative inline-block"
  >
    <a className="item"
      ref={tooltipEmployeeRef}
      onMouseOver={onMouseOver} onMouseOut={onMouseOut}
      onClick={() => props.onOpenModalEmployeeDetail(employee.employeeId)}>
      {employee.employeePhoto && employee.employeePhoto.filePath ? (
        <img src={employee.employeePhoto.filePath} alt="" className="user no-border"/>
      ) : (
          <div className={"no-avatar green"}>
            {getFirstCharacter(getEmployeeName())}
          </div>
        )}
    </a>
    {employeeData}
    {isShowTooltipEmployeeDetail && (
      <div className="wap-customer-hover-tooltip">
        <InfoEmployeeCard
          employee={parseEmployee()}
          classHover={`${employeeData ? '' : 'position-fixed'} z-index-999 overflow-y-hover max-height-350`}
          onOpenModalEmployeeDetail={(employeeId) => props.onOpenModalEmployeeDetail(employeeId)}
        />
      </div>
    )}
  </div>
}

const mapStateToProps = null;

const mapDispatchToProps = {
  onOpenModalEmployeeDetail
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EmployeeIcon);