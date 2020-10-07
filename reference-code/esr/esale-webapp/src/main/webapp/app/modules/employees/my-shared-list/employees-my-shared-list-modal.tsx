import React, { useState, useEffect, useRef } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { IRootState } from '../../../shared/reducers';
import {
  handleInitListModal,
  handleSubmitListInfos,
  reset,
  resetError
} from 'app/modules/employees/my-shared-list/employees-my-shared-list-modal.reducer';
import DynamicGroupModal from 'app/shared/layout/dynamic-form/group/dynamic-group-modal.tsx';
import { FIELD_BELONG } from 'app/config/constants';


export enum FSActionTypeScreen {
  None,
  RemoveSession,
  SetSession,
  GetSession,
  CloseWindow,
  CreatUpdateSuccess
}

/**
 * Share props in Parents
 */
interface IEmployeesMySharedListModalProps extends StateProps, DispatchProps {
  iconFunction?: string,
  conditionSearch?: { fieldId, fieldType, isDefault, fieldName, fieldValue, searchType, searchOption, isSearchBlank, fieldOrder, timeZoneOffset, relationFieldId }[],
  handleCloseEmployeesMySharedListModal?: (isUpdate, saveCondition?: { fieldType, isDefault, fieldName, fieldValue, searchType, searchOption }[]) => void,
  onSubmit?: (saveCondition: { fieldType, isDefault, fieldName, fieldValue, searchType, searchOption }[]) => void,
  // fieldSearchGroupInfos?: any,
  popout?: boolean,
  popoutParams?: any,
  listMode?: number,
  listId?: number,
  isOwnerGroup?: boolean,
  isAutoList?: boolean,
  listMembers?: any
  employeeLayout?: any;
  listType?: any;
  labelTranslate?: any;
}


/**
 * Component ModalShareList
 * @param props
 */
const EmployeesMySharedListModal: React.FC<IEmployeesMySharedListModalProps> = (props) => {


  /**
   * Effect []
   */
  useEffect(() => {
    if (!props.popout) {
      props.handleInitListModal(props.listId, props.isOwnerGroup, true);
    }
    return () => { }
  }, []);

  const errorValid = [];
  if(props.errorValidates && props.errorValidates.length>0){
    if(props.errorValidates[0] === "groupName" || props.errorValidates[0] === "groupParticipants"){
      if(props.errorValidates[0] === "groupName"){
        errorValid.push("customerListName");
      }
      if(props.errorValidates[0] === "groupParticipants"){
        errorValid.push("listParticipants");
      }
    }else{
      errorValid.push(props.errorValidates[0]);
    }
  }

  return (
    <DynamicGroupModal
      popout={props.popout}
      popoutParams={props.popoutParams}
      iconFunction={props.iconFunction}
      groupMode={props.listMode}
      groupId={props.listId}
      isAutoGroup={props.isAutoList}
      groupMembers={props.listMembers}
      dataLayout={props.employeeLayout}
      handleCloseDynamicGroupModal={props.handleCloseEmployeesMySharedListModal}

      listType={props.listType}
      labelTranslate={props.labelTranslate}
      fieldBelong={FIELD_BELONG.EMPLOYEE}
      pathOpenNewWindow={'employees-my-shared-list'}


      handleSubmitListInfos={props.handleSubmitListInfos}
      resetError={props.resetError}
      reset={props.reset}

      action={props.action}
      errorValidates={errorValid}
      group={props.group}
      errorMessageInModal={props.errorMessageInModal}
      isSuccess={props.isSuccess}
      rowIds={props.rowIds}
      listUpdateTime={props.listUpdateTime}
      errorParams={props.errorParams}
      listParticipants={props.listParticipants}
      listFieldSearch={props.listFieldSearch}
      customFieldsInfo={props.customFieldsInfo}
    />
  );
}

const mapStateToProps = ({ employeesMySharedListState }: IRootState) => ({
  action: employeesMySharedListState.action,
  errorValidates: employeesMySharedListState.errorItems,
  group: employeesMySharedListState.group,
  errorMessageInModal: employeesMySharedListState.errorMessageInModal,
  isSuccess: employeesMySharedListState.isSuccess,
  rowIds: employeesMySharedListState.rowIds,
  listUpdateTime: employeesMySharedListState.listUpdateTime,
  errorParams: employeesMySharedListState.errorParams,
  listParticipants: employeesMySharedListState.listParticipants,
  listFieldSearch: employeesMySharedListState.listFieldSearch,
  customFieldsInfo: employeesMySharedListState.customFieldsInfo,
});

const mapDispatchToProps = {
  handleSubmitListInfos,
  handleInitListModal,
  resetError,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EmployeesMySharedListModal);
