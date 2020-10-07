import React, { useState, useEffect, useRef } from 'react';
import * as R from 'ramda';
import { getFirstCharacter } from 'app/shared/util/utils';
import InfoEmployeeCard from 'app/shared/layout/common/info-employee-card/info-employee-card';

export interface IGetListUserProps {
  infoItem?: any;
  txt?: any;
  onOpenModalEmployeeDetail?: any
}

const GetListUser: React.FC<IGetListUserProps> = props => {
  const { infoItem, txt, onOpenModalEmployeeDetail } = props;
  const [showCardEmployee, setShowCardEmployee] = useState(false)
  const imgEmployeeRef = useRef(null);

  const checkEmployee = R.path(['employeeId'], infoItem);

  const getAvatar = () => {
    let key = '';
    let name = '';
    let classNameA = '';
    if (R.path(['employeeId'], infoItem)) {
      name = infoItem.employeeName || infoItem.employeeSurname || '';
      const urlCheck = R.path(['fileUrl'], infoItem) || R.path(['photoFilePath'], infoItem);
      if (urlCheck) {
        return (
          <a key={infoItem.employeeId} className={`d-inline-flex align-bottom ${txt ? 'w-100' : ''}`} title={name}>
            <img className="mr-1 rounded-circle" src={urlCheck} />
            {txt ? <span className="text-blue font-size-12 text-ellipsis">{name}</span> : null}
          </a>
        )
      } else {
        key = infoItem.employeeId;
        classNameA = 'no-avatar name green';
      }
    }
    if (R.path(['groupId'], infoItem)) {
      key = infoItem.groupId;
      name = infoItem.groupName;
      classNameA = 'no-avatar name light-green';
    }
    if (R.path(['departmentId'], infoItem)) {
      key = infoItem.departmentId;
      name = infoItem.departmentName;
      classNameA = 'no-avatar name light-blue';
    }
    classNameA += ' min-width-24';
    return (
      <a key={key} className={`d-inline-flex align-bottom ${txt ? 'w-100' : ''}`} title={name}>
        <span className={classNameA}>
          {getFirstCharacter(name)}
        </span>
        {txt ? <span className="text-blue font-size-12 text-ellipsis">{name}</span> : null}
      </a>
    )
  }

  /**
    * render user box info
    * @param employee
    */
  const renderBoxEmployee = (employee, type?: any) => {
    if (imgEmployeeRef && imgEmployeeRef.current) {
      const dimension = imgEmployeeRef.current.getBoundingClientRect();
      let styleCustom = { position: "fixed", top: dimension.top, left: (dimension.left - 170), zIndex: '99' };
      if (!txt) {
        styleCustom = { position: "absolute", top: 25, left: -145, zIndex: '99' }
      }
      const getEmployee = {
        cellphoneNumber: employee && employee.cellphoneNumber || '',
        telephoneNumber: employee && employee.telephoneNumber || '',
        email: employee && employee.email || '',
        employeeId: employee.employeeId,
        photoFilePath: employee && employee.fileUrl || employee && employee.photoFilePath || "",
        departmentName: employee && employee.departmentName || '',
        employeeName: employee && employee.employeeName || '',
        employeeSurname: employee && employee.employeeSurname || '',
        employeeSurnameKana: employee && employee.employeeSurnameKana || '',
        employeeNameKana: employee && employee.employeeNameKana || '',
        positionName: employee && employee.positionName,
      }
      return <InfoEmployeeCard employee={getEmployee} taskType={type}
        onOpenModalEmployeeDetail={onOpenModalEmployeeDetail}
        styleHover={styleCustom} />
    }

  }

  return (
    <div className={`d-inline-flex align-bottom position-relative ${txt ? 'w-100' : ''}`} onMouseEnter={() => setShowCardEmployee(true)} onMouseLeave={() => setShowCardEmployee(false)} ref={imgEmployeeRef}>
      <div className="block w-100">
        {getAvatar()}
      </div>
      {(showCardEmployee && checkEmployee) ? renderBoxEmployee(infoItem) : null}
    </div>
  )

}
export default GetListUser