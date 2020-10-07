import React, { useState, useEffect, useRef } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { IRootState } from '../../../shared/reducers';
import {
  handleInitListModal,
  handleSubmitListInfos,
  reset,
  resetError
} from 'app/modules/customers/my-shared-list/customer-my-shared-list-modal.reducer';
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
interface ICustomerMySharedListModalProps extends StateProps, DispatchProps {
  iconFunction?: string,
  conditionSearch?: { fieldId, fieldType, isDefault, fieldName, fieldValue, searchType, searchOption, isSearchBlank, fieldOrder, timeZoneOffset, relationFieldId }[],
  handleCloseCustomerMySharedListModal?: (isUpdate, saveCondition?: { fieldType, isDefault, fieldName, fieldValue, searchType, searchOption }[]) => void,
  onSubmit?: (saveCondition: { fieldType, isDefault, fieldName, fieldValue, searchType, searchOption }[]) => void,
  // fieldSearchGroupInfos?: any,
  popout?: boolean,
  popoutParams?: any,
  listMode?: number,
  listId?: number,
  isOwnerGroup?: boolean,
  isAutoList?: boolean,
  listMembers?: any
  customerLayout?: any;
  listType?: any;
  labelTranslate?: any;
}


/**
 * Component ModalShareList
 * @param props
 */
const CustomerMySharedListModal: React.FC<ICustomerMySharedListModalProps> = (props) => {


  /**
   * Effect []
   */
  useEffect(() => {
    if (!props.popout) {
      props.handleInitListModal(props.listId, props.isOwnerGroup, true);
    }
    return () => { }
  }, []);


  return (
    <DynamicGroupModal
      popout={props.popout}
      popoutParams={props.popoutParams}
      iconFunction={props.iconFunction}
      groupMode={props.listMode}
      groupId={props.listId}
      isAutoGroup={props.isAutoList}
      groupMembers={props.listMembers}
      dataLayout={props.customerLayout}
      handleCloseDynamicGroupModal={props.handleCloseCustomerMySharedListModal}

      listType={props.listType}
      labelTranslate={props.labelTranslate}
      fieldBelong={FIELD_BELONG.CUSTOMER}
      pathOpenNewWindow={'customer-my-shared-list'}


      handleSubmitListInfos={props.handleSubmitListInfos}
      resetError={props.resetError}
      reset={props.reset}

      action={props.action}
      errorValidates={props.errorValidates}
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

const mapStateToProps = ({ customerMySharedListState }: IRootState) => ({
  action: customerMySharedListState.action,
  errorValidates: customerMySharedListState.errorItems,
  group: customerMySharedListState.group,
  errorMessageInModal: customerMySharedListState.errorMessageInModal,
  isSuccess: customerMySharedListState.isSuccess,
  rowIds: customerMySharedListState.rowIds,
  listUpdateTime: customerMySharedListState.listUpdateTime,
  errorParams: customerMySharedListState.errorParams,
  listParticipants: customerMySharedListState.listParticipants,
  listFieldSearch: customerMySharedListState.listFieldSearch,
  customFieldsInfo: customerMySharedListState.customFieldsInfo,
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
)(CustomerMySharedListModal);
