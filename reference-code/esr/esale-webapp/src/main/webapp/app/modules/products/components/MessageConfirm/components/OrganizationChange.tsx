import React, { useState } from 'react';
import ArrowChange from './ArrowChange';
import { TimeLineLeft } from './styles';
import * as R from 'ramda';
import { blankText } from '../constants';
import { translate } from 'react-jhipster';
import PopupEmployeeDetail from 'app/modules/employees/popup-detail/popup-employee-detail';
import { IRootState } from 'app/shared/reducers';
import ATag from './ATag';

const OrganizationChange = ({
  fieldLabel,
  department_id: departmentId,
  employee_id: employeeId,
  group_id: groupId,
  isModalConfirm
}) => {
  return null
  // return true if data not change
  // const isNotChange = R.converge(R.equals, [R.prop('new'), R.prop('old')]);

  // const [visibleEmployee, setVisibleEmployee] = useState(false);
  // const [selectedIdEmployee, setSelectedIdEmployee] = useState(null);

  // const openModalEmployee = idEmployee => {
  //   setVisibleEmployee(true);
  //   setSelectedIdEmployee(idEmployee);
  // };

  // const closeModalEmployee = () => {
  //   setVisibleEmployee(false);
  //   setSelectedIdEmployee(null);
  // };

  // const joinContent = R.tryCatch(item => {
  //   if (item.length === 0) {
  //     throw 'is blank';
  //   }
  //   return R.join(', ', item);
  // }, R.always(blankText()));

  // const idNotChangeDepartment = isNotChange(departmentId);
  // const isNotChangeEmployee = isNotChange(employeeId);
  // const isNotChangeGroup = isNotChange(groupId);

  // const isBlankObject = R.equals({});

  // if (
  //   (!idNotChangeDepartment && !isNotChangeEmployee && !isNotChangeGroup) ||
  //   [departmentId, employeeId, groupId].every(isBlankObject)
  // ) {
  //   return <></>;
  // }

  // const renderChangeDepartment = () => {
  //   if (idNotChangeDepartment) {
  //     return <></>;
  //   }

  //   const findItemInHistoryReducer = id =>
  //     R.find(R.propEq('departmentId', id), historyOrganization.departments);

  //   const getContent = R.compose(
  //     joinContent,
  //     R.pluck('departmentName'),
  //     R.filter(Boolean),
  //     R.map(findItemInHistoryReducer)
  //   );

  //   const oldContent = getContent(departmentId.old);
  //   const newContent = getContent(departmentId.new);

  //   // if oldContent and newContent are empty
  //   if ([oldContent, newContent].every(R.equals(blankText()))) {
  //     return <></>;
  //   }

  //   return (
  //     <div>
  //       <TimeLineLeft className="v2">
  //         {translate('history.organization.department')}：{oldContent}
  //       </TimeLineLeft>
  //       <ArrowChange /> {newContent}
  //     </div>
  //   );
  // };

  // const renderEmployee = employeeData => {
  //   return employeeData.map((employee, index, arr) => {
  //     return (
  //       <React.Fragment key={index}>
  //         <ATag
  //           isModalConfirm={isModalConfirm}
  //           className="text-blue"
  //           onClick={() => openModalEmployee(employee.employeeId)}
  //         >
  //           {employee.employeeName}
  //         </ATag>
  //         {index !== arr.length - 1 ? ', ' : ''}
  //       </React.Fragment>
  //     );
  //   });
  // };
  // const renderChangeEmployee = () => {
  //   if (isNotChangeEmployee) {
  //     return <></>;
  //   }

  //   const findItemInHistoryReducer = id =>
  //     R.find(R.propEq('employeeId', id), historyOrganization.employee);
  //   const getData = R.compose(
  //     R.project(['employeeId', 'employeeName']),
  //     R.filter(Boolean),
  //     R.map(findItemInHistoryReducer)
  //   );

  //   const oldData = getData(employeeId.old);
  //   const newData = getData(employeeId.new);

  //   return (
  //     <div>
  //       <TimeLineLeft className="v2">
  //         {translate('history.organization.employee')}：{renderEmployee(oldData)}
  //       </TimeLineLeft>
  //       <ArrowChange /> {renderEmployee(newData)}
  //     </div>
  //   );
  // };

  // const renderChangeGroup = () => {
  //   if (isNotChangeGroup) {
  //     return <></>;
  //   }

  //   const findItemInHistoryReducer = id =>
  //     R.find(R.propEq('groupId', id), historyOrganization.departments);

  //   const getContent = R.compose(
  //     joinContent,
  //     R.pluck('groupName'),
  //     R.filter(Boolean),
  //     R.map(findItemInHistoryReducer)
  //   );

  //   const oldContent = getContent(groupId.old);
  //   const newContent = getContent(groupId.new);

  //   // if oldContent and newContent are empty
  //   if ([oldContent, newContent].every(R.equals(blankText()))) {
  //     return <></>;
  //   }

  //   return (
  //     <div>
  //       <TimeLineLeft className="v2">
  //         {translate('history.organization.group')}：{oldContent}
  //       </TimeLineLeft>
  //       <ArrowChange /> {newContent}
  //     </div>
  //   );
  // };

  // return (
  //   <div>
  //     <div>{fieldLabel}：</div>
  //     <div className="ml-3">
  //       {renderChangeDepartment()}
  //       {renderChangeEmployee()}
  //       {renderChangeGroup()}
  //     </div>
  //     {visibleEmployee && (
  //       <PopupEmployeeDetail
  //         showModal={true}
  //         // backdrop={props.backdrop}
  //         openFromModal={true}
  //         employeeId={selectedIdEmployee}
  //         listEmployeeId={[selectedIdEmployee]}
  //         toggleClosePopupEmployeeDetail={closeModalEmployee}
  //         resetSuccessMessage={() => {}}
  //       />
  //     )}
  //   </div>
  // );
};

export default OrganizationChange
