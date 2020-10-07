import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { IRootState } from 'app/shared/reducers';

import { compose, propEq, filter } from 'ramda';
import { handleShowFormCreateDepartment } from '../add-edit-network-map.reducer'
import DepartmentCardNetwork from '../../department/department-card-network';
import DepartmentList from './department-list';
import { getDepartmentId, getDepartments } from '../../helpers';
import FormNewDepartment from '../../department/form-new-department';

const RelativeDiv = styled.div`
  position: relative;
`;

interface IDepartmentItemProps extends StateProps, DispatchProps {
  department: any;
  viewType: number;
  isNotFirst: boolean;
  isNotLast: boolean;
  isFirst?: boolean;
  hasMultipleParent;
  scale;
  isShowBorderOutLine: boolean;
  onChangeTitle?: any;
}

const DepartmentItem = (props: IDepartmentItemProps) => {
  const { department, viewType, isNotFirst, isNotLast } = props;
  const isShowCreateDepartment = props.departmentIdParent && props.departmentIdParent === department.departmentId;
  return (
    <RelativeDiv className={`${isNotLast ? 'bor-outline' : ''} 
              ${props.isShowBorderOutLine && (!isNotLast || department.parentId === 1 && !isNotLast) ? 'bor-outline v2' : ''} d-flex`}>
      <div className="class-test">
        <DepartmentCardNetwork
          department={department}
          viewType={viewType}
          isNotFirst={isNotFirst}
          isFirst={props.isFirst}
          hasMultipleParent={props.hasMultipleParent}
          scale={props.scale}
          onChangeTitle={props.onChangeTitle}
        />
      </div>
      <div className="class-test">
        {props.departments && (
          <DepartmentList
            departments={props.departments}
            viewType={viewType}
            scale={props.scale}
            isShowBorderOutLine={isShowCreateDepartment}
            onChangeTitle={props.onChangeTitle}
          />
        )}
        {isShowCreateDepartment && (
          <FormNewDepartment
            departmentId={props.departmentIdParent}
            isFirst={!props.departments || props.departments.length < 1}
          />
        )}
      </div>
    </RelativeDiv>
  );
};

const mapStateToProps = ({ addEditNetworkMap }: IRootState, { department }) => ({
  departments: compose(
    filter(propEq('parentId', getDepartmentId(department))),
    getDepartments
  )(addEditNetworkMap),
  departmentIdParent: addEditNetworkMap.departmentIdParent
});

const mapDispatchToProps = {
  handleShowFormCreateDepartment
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DepartmentItem);
