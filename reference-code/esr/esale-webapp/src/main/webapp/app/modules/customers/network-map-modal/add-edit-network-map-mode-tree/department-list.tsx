import React from 'react';

import { safeMapWithIndex } from 'app/shared/helpers';
import { getDepartmentId } from '../../helpers';

import DepartmentItem from './department-item';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import FormNewDepartment from '../../department/form-new-department';

interface IDepartmentListProps extends StateProps, DispatchProps {
  departments: any[];
  viewType: number;
  isFirst?: boolean;
  scale;
  isShowBorderOutLine: boolean;
  onChangeTitle?: (value?: boolean) => void;
}

const DepartmentList = (props: IDepartmentListProps) => {
  const { departments } = props;
  const isShowCreateDepartment = props.departmentIdParent && props.departmentIdParent === 1 && props.isFirst;

  return (
    <>
      {safeMapWithIndex(
        (department, index) => (
          <DepartmentItem
            key={getDepartmentId(department) + ''}
            department={department}
            viewType={props.viewType}
            isFirst={props.isFirst}
            isNotFirst={index > 0}
            isNotLast={index < departments.length - 1}
            hasMultipleParent={departments.length > 1}
            scale={props.scale}
            isShowBorderOutLine={isShowCreateDepartment || props.isShowBorderOutLine}
            onChangeTitle={props.onChangeTitle}
          />
        ),
        departments
      )}
      {isShowCreateDepartment && (
          <FormNewDepartment
            departmentId={props.departmentIdParent}
            isFirst={!props.departments || props.departments.length < 1}
          />
        )}
    </>
  );
};

const mapStateToProps = ({ addEditNetworkMap }: IRootState) => ({
  departmentIdParent: addEditNetworkMap.departmentIdParent
});

const mapDispatchToProps = {
  
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DepartmentList);
