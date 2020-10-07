import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { connect } from 'react-redux';
import { isEmpty, compose, isNil, prop, propOr, filter, any } from 'ramda'

import { setStateByTargetValue, safeCall, isKeyEnterPressed } from 'app/shared/helpers';

import { getDepartmentId, getDepartmentName } from '../helpers';
import { handleCreateDepartment } from '../network-map-modal/add-edit-network-map.reducer';
import { translate } from 'react-jhipster';
import { IRootState } from 'app/shared/reducers';
import ConfirmDialog from 'app/shared/layout/dialog/confirm-dialog';
import { setTimeout } from 'timers';
interface IFormNewDepartment extends StateProps, DispatchProps {
  departmentId: any;
  isFirst: boolean;
}

const FormNewDepartment = (props: IFormNewDepartment) => {
  const { departments } = props;
  const [department, setDepartment] = useState(null);
  const [departmentName, setDepartmentName] = useState('');
  const inputRef = useRef(null);
  const styleLineVertical = useMemo(() => {
    if (props.isFirst) {
      return { width: 50 };
    }
    return { width: 26 };
  }, []);
  const styleLineHorizontal = useMemo(() => {
    if (props.isFirst) {
      return { height: 0 };
    }
    return { height: 40 };
  }, []);

  const onNameChange = useCallback(setStateByTargetValue(setDepartmentName), []);
  useEffect(() => {
    setDepartment(departments?.find(d => d.departmentId === props.departmentId));
  }, [props.departmentId]);

  const onAddDepartment = useCallback(
    () =>
      safeCall(props.handleCreateDepartment)({
        parentId: getDepartmentId(department) ?? 1,
        parentName: getDepartmentName(department),
        departmentName
      }),
    [department, departmentName]
  );

  const onKeyDownTextBox = async (e) => {
    if (!isKeyEnterPressed(e)) return;
    if (isEmpty(departmentName)) {
      const result = await ConfirmDialog({
        title: translate('customers.network-map.popup-warning.warning'),
        message: translate('messages.ERR_CUS_0016'),
        confirmText: translate('customers.network-map.popup-warning.ok'),
        confirmClass: "button-red",
        cancelText: null,
      });
      if (result) {
        return;
      }
    } else if (any(i => i.departmentName === departmentName, departments)) {
      const result = await ConfirmDialog({
        title: translate('customers.network-map.popup-warning.warning'),
        message: translate('messages.ERR_CUS_0017', { 0: departmentName }),
        confirmText: translate('customers.network-map.popup-warning.ok'),
        confirmClass: "button-red",
        cancelText: null,
      });
      if (result) {
        return;
      }
    } else {
      onAddDepartment();
    }
  }

  const onBlurTextCreate = () => {
    if (!isEmpty(departmentName) && !any(i => i.departmentName === departmentName, departments)) {
      onAddDepartment();
    }
  }

  useEffect(() => {
    if (props.isFocusInput) {
      inputRef.current.focus();
    }
  }, [props.isFocusInput])

  return (
    <div className="line-group-out focus width-194">
      <div className="box">
        <input
          ref={inputRef}
          type="text"
          className="input-normal bg-white my-2"
          placeholder={translate('customers.network-map.form-new-department.department-placeholder')}
          defaultValue={departmentName}
          onChange={onNameChange}
          onBlur={onBlurTextCreate}
          onKeyDown={onKeyDownTextBox}
        />
        <div className="item-card no-padding">
          <div className="body no-padding border-0">
            <div title="" className="button-primary button-add-new disable">
              {translate('customers.network-map.mode-table.btn-add-business-card')}
            </div>
            <div className="line-vertical" style={styleLineVertical}></div>
            <div className="line-horizontal" style={styleLineHorizontal}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = ({ addEditNetworkMap }: IRootState) => ({
  departments: propOr([], 'departments', addEditNetworkMap),
  isFocusInput: addEditNetworkMap.isFocusInput
});

const mapDispatchToProps = {
  handleCreateDepartment
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FormNewDepartment);
