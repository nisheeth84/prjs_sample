import React, { useState, useEffect, useRef } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { IRootState } from '../../../shared/reducers';
import {
  handleInitListModal,
  handleSubmitGroupInfos,
  reset,
  resetError,
  handleGetInitializeListInfo
} from 'app/modules/sales/my-shared-list/sales-my-shared-list-modal.reducer';
import DynamicGroupModal from 'app/shared/layout/dynamic-form/group/dynamic-group-modal.tsx';
import { FIELD_BELONG } from 'app/config/constants';
import { LIST_MODE } from '../constants';
import { translate, Storage } from 'react-jhipster';
import { GROUP_MODE_SCREEN } from 'app/shared/layout/dynamic-form/group/constants';


export enum FSActionTypeScreen {
  None,
  RemoveSession,
  SetSession,
  GetSession,
  CloseWindow,
  CreatUpdateSuccess
}

interface IModalSharedGorupStateProps {
  // listFieldSearch;
  // customFieldsInfo;
  // groupParticipants;
  // action;
  // errorValidates;
  // errorMessageInModal;
  // errorCodeInModal;
  // tenant;
  // isSuccess;
  group;
  // rowIds;
  // errorParams;
  // listUpdateTime;
  // autoGroupUpdatedTime;
  localMenu
}

/**
 * Share props in Parents
 */
interface ISalesMySharedListModalProps extends StateProps, DispatchProps {
  iconFunction?: string,
  conditionSearch?: { fieldId, fieldType, isDefault, fieldName, fieldValue, searchType, searchOption, isSearchBlank, fieldOrder, timeZoneOffset, relationFieldId }[],
  handleCloseSalesMySharedListModal?: (isUpdate, saveCondition?: { fieldType, isDefault, fieldName, fieldValue, searchType, searchOption }[]) => void,
  onSubmit?: (saveCondition: { fieldType, isDefault, fieldName, fieldValue, searchType, searchOption }[]) => void,
  // fieldSearchGroupInfos?: any,
  popout?: boolean,
  popoutParams?: any,
  listMode?: number,
  listId?: number,
  isOwnerGroup?: boolean,
  isAutoList?: boolean,
  listMembers?: any
  salesLayout?: any;
  // localMenu?: any;
  listType?: any;
  labelTranslate?: any;
}


type IModalSharedGorupProps = ISalesMySharedListModalProps & IModalSharedGorupStateProps
/**
 * Component ModalShareList
 * @param props
 */
const SalesMySharedListModal: React.FC<IModalSharedGorupProps> = (props) => {
  const [group, setGroup] = useState(props.group);
  const [, setGroupName] = useState('');
  const [groupMode, ] = useState(props.listMode ? props.listMode : props.popoutParams.listMode);
  const [, setIsAutoGroup] = useState(props.isAutoList);
  const [, setIsOverWrite] = useState(true);


  /**
   * Effect []
   */
  useEffect(() => {
    if (!props.popout && props.listId) {
      props.handleInitListModal(props.listId, props.isOwnerGroup, true);
    }
    return () => { }
  }, []);

  useEffect(() => {
    if (!props.popout) {
      props.handleGetInitializeListInfo(FIELD_BELONG.PRODUCT_TRADING);
    }
    return () => { }
  }, []);
  const errorValid = [];
  if(props.errorValidates && props.errorValidates.length>0){
    if(props.errorValidates[0] === "productTradingListName" || props.errorValidates[0] === "listType"){
      if(props.errorValidates[0] === "productTradingListName"){
        errorValid.push("customerListName");
      }
      if(props.errorValidates[0] === "listType"){
        errorValid.push("listParticipants");
      }
    }else{
        errorValid.push(props.errorValidates[0]);
    }
  }

  useEffect(() => {
    if (props.group) {
      const groupWithCopyName = _.cloneDeep(props.group)
      setGroup(props.group);
      setGroupName(props.group.groupName);
      if (props.localMenu && props.localMenu.initializeLocalMenu) {
        const { myGroups, sharedGroups } = props.localMenu.initializeLocalMenu;
        if (groupMode === GROUP_MODE_SCREEN.COPY) {
          const newGroupData = [...myGroups, ...sharedGroups];
          const nuberOfItem = _.filter(newGroupData, elm =>
            _.includes(elm.listName, props.group.groupName)
          ).length;
          if (nuberOfItem < 2) {
            const countn = nuberOfItem + 1;
            const copyName =
              props.group.groupName +
              translate('sales.sidebar.duplicate', { n: countn });
            setGroupName(copyName);
            groupWithCopyName["groupName"] = copyName
          } else {
            let countCheck = 2;
            for (countCheck; countCheck <= nuberOfItem; countCheck++) {
              let copyName2 =
                props.group.groupName +
                translate('sales.sidebar.duplicate', { n: countCheck });
              const checkName = _.filter(newGroupData, elm => _.includes(elm.listName, copyName2))
                .length;
              if (checkName === 0) {
                setGroupName(copyName2);
                break;
              } else {
                const newNumberCopy = countCheck + 1;
                copyName2 =
                  props.group.groupName +
                  translate('sales.sidebar.duplicate', { n: newNumberCopy });
                setGroupName(copyName2);
              }
              groupWithCopyName["groupName"] = copyName2
            }
          }
        }
      }
      
      if (props.group.isAutoGroup === true) {
        setIsAutoGroup(true);
      }
      if (!_.isNil(props.group.isOverWrite)) {
        // setIsOverWrite(props.group.isOverWrite ? true : false);
        setIsOverWrite(props.group.isOverWrite);
      }
      setGroup(groupWithCopyName);
    }
  }, [props.group]);
  

  return (
    <DynamicGroupModal
      popout={props.popout}
      popoutParams={props.popoutParams}
      iconFunction={props.iconFunction}
      groupMode={props.listMode}
      groupId={props.listId}
      isAutoGroup={props.isAutoList}
      groupMembers={props.listMembers}
      dataLayout={props.salesLayout}
      handleCloseDynamicGroupModal={props.handleCloseSalesMySharedListModal}

      listType={props.listType}
      labelTranslate={props.labelTranslate}
      fieldBelong={FIELD_BELONG.SALES}
      pathOpenNewWindow={'sales-my-shared-list'}


      handleSubmitListInfos={props.handleSubmitGroupInfos}
      // handleInitListModal={props.handleInitListModal}
      resetError={props.resetError}
      reset={props.reset}

      action={props.action}
      errorValidates={errorValid}
      group={group}
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

const mapStateToProps = ({ salesMySharedListState, salesControlSidebar }: IRootState) => ({
  action: salesMySharedListState.action,
  errorValidates: salesMySharedListState.errorItems,
  group: salesMySharedListState.group,
  errorMessageInModal: salesMySharedListState.errorMessageInModal,
  isSuccess: salesMySharedListState.isSuccess,
  rowIds: salesMySharedListState.rowIds,
  listUpdateTime: salesMySharedListState.listUpdateTime,
  errorParams: salesMySharedListState.errorParams,
  listParticipants: salesMySharedListState.listParticipants,
  listFieldSearch: salesMySharedListState.listFieldSearch,
  customFieldsInfo: salesMySharedListState.customFieldsInfo,
  fieldBelong: salesMySharedListState.fieldBelong,
  localMenu: salesControlSidebar.localMenuData
});

const mapDispatchToProps = {
  handleSubmitGroupInfos,
  handleInitListModal,
  resetError,
  reset,
  handleGetInitializeListInfo
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SalesMySharedListModal);
