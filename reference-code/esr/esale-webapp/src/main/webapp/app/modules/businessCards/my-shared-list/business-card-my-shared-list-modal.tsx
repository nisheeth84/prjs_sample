import React, { useState, useEffect, useRef } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { IRootState } from '../../../shared/reducers';
import {
  handleInitListModal,
  handleSubmitListInfos,
  handleGetGeneralSetting,
  reset,
  resetError
} from 'app/modules/businessCards/my-shared-list/business-card-my-shared-list-modal.reducer';
import DynamicGroupModal from 'app/shared/layout/dynamic-form/group/dynamic-group-modal';
import { FIELD_BELONG } from 'app/config/constants';
import { translate } from 'react-jhipster';
import { GROUP_MODE_SCREEN } from 'app/shared/layout/dynamic-form/group/constants';
import { DynamicGroupModalAction } from 'app/shared/layout/dynamic-form/group/dynamic-group-modal.reducer';


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
interface IBusinessCardMySharedListModalProps extends StateProps, DispatchProps {
  iconFunction?: string,
  conditionSearch?: { fieldId, fieldType, isDefault, fieldName, fieldValue, searchType, searchOption, isSearchBlank, fieldOrder, timeZoneOffset, relationFieldId }[],
  handleCloseBusinessCardMySharedListModal?: (isUpdate, saveCondition?: { fieldType, isDefault, fieldName, fieldValue, searchType, searchOption }[], messages?) => void,
  onSubmit?: (saveCondition: { fieldType, isDefault, fieldName, fieldValue, searchType, searchOption }[]) => void,
  popout?: boolean,
  popoutParams?: any,
  listMode?: number,
  listId?: number,
  isOwnerGroup?: boolean,
  isAutoList?: boolean,
  listMembers?: any;
  dataFieldLayout?: any;

  listType?: any;
  labelTranslate?: any;
  classInfo?: string;
  updateSearchCondtionGroup?: (searchConditionsParam) => void;
  placeHolder?: string
}

const BusinessCardMySharedListModal: React.FC<IBusinessCardMySharedListModalProps> = (props) => {

  const [listUpdateTime, setListUpdateTime] = useState(null);
  const [group, setGroup] = useState({});
  const [listMode, setListMode] = useState(props.listMode);
  const [listParticipants, setListParticipants] = useState([]);


  /**
   * Effect [props.listUpdateTime]
   */
  useEffect(() => {
    if (props.listUpdateTime) {
      setListUpdateTime(props.listUpdateTime)
    }
  }, [props.listUpdateTime])

  /**
   * Effect []
   */
  useEffect(() => {
    if (!props.popout) {
      document.body.className = "wrap-employee";
      props.handleInitListModal(props.listId, props.isOwnerGroup, true);
      props.handleGetGeneralSetting();
    }
    return (() => {
      document.body.className = "wrap-card";
      props.reset();
    })
  }, []);

  /**
   * Effect [props.listMode]
   */
  useEffect(() => {
    if (props.listMode) {
      setListMode(props.listMode)
    }
  }, [props.listMode])

  /**
   * Effect [props.group]
   */
  useEffect(() => {    
    if (props.group && props.group['groupName']) {
      let bcListname = props.group['groupName'];

      if (listMode === GROUP_MODE_SCREEN.COPY) {
        const listCopy = props.listBusinessCardList.filter(item => {
          return item.listName
            && item.listName.slice(props.group['groupName'].length, item.listName.length).includes(translate('businesscards.mylist.duplicate-check'))
            && item.listName.includes(props.group['groupName'])
        })
        if (listCopy.length > 0) {
          const listCheck = Array.from(Array(listCopy.length), (x, i) => i + 1);

          _.forEach(listCheck, (index) => {
            if (!listCopy.find(item => item.listName.includes(translate('businesscards.mylist.duplicate', { n: index })))) {
              bcListname = props.group['groupName'] + translate('businesscards.mylist.duplicate', { n: index });
              return false;
            }
            bcListname = props.group['groupName'] + translate('businesscards.mylist.duplicate', { n: listCopy.length + 1 });
          })
        }
        else {
          bcListname = props.group['groupName'] + translate('businesscards.mylist.duplicate', { n: 1 });
        }
      }
      setGroup({ ...props.group, groupName: bcListname })
    }
  }, [props.group])

  /**
   * Effect [props.listparticipants]
   */
  useEffect(() => {
    if (props.listParticipants && props.listParticipants.length > 0) {
      setListParticipants(props.listParticipants);
    }
  }, [props.listParticipants])

  /**
   * Effect [props.action]
   */
  useEffect(() => {
    if(props.action === DynamicGroupModalAction.Doneinit 
      && listMode !==  GROUP_MODE_SCREEN.CREATE 
      && listMode !==  GROUP_MODE_SCREEN.CREATE_LOCAL
      && !props.group['groupName']
    ) {
      props.handleCloseBusinessCardMySharedListModal(null, null, "ERR_COM_0050")
    }
  }, [props.action])

  

  const handleSubmit = (groupId,
    groupName,
    groupType,
    isAutoGroup,
    isOverWrite,
    groupMembersParam,
    listParticipantsParam,
    searchConditionsParam,
    updatedDate,
    groupMode) => {

    const fieldOfIsWorking = props.customFieldsInfo && props.customFieldsInfo.find(e => e.fieldName === "is_working");
    const fieldInfo = _.cloneDeep(props.customFieldsInfo);
    let lstFieldRelation = [];
    lstFieldRelation = fieldInfo && fieldInfo.map(e => {
      if (e.fieldType === 17) {
        return e.fieldId
      }
    }).filter(e => !_.isEmpty(_.toString(e)));
    const fieldIdOfIsWorking = fieldOfIsWorking && fieldOfIsWorking.fieldId
    props.handleSubmitListInfos(groupId,
      groupName,
      groupType,
      isAutoGroup,
      isOverWrite,
      groupMembersParam,
      listParticipantsParam,
      searchConditionsParam,
      updatedDate,
      groupMode,
      fieldIdOfIsWorking,
      lstFieldRelation)
    if (props.updateSearchCondtionGroup) {
      props.updateSearchCondtionGroup(searchConditionsParam);
    }
  }

  return (
    <DynamicGroupModal
      popout={props.popout}
      popoutParams={props.popoutParams}
      iconFunction={props.iconFunction}
      groupMode={listMode}
      groupId={props.listId}
      isAutoGroup={props.isAutoList}
      groupMembers={props.listMembers}
      dataLayout={props.dataFieldLayout}
      handleCloseDynamicGroupModal={props.handleCloseBusinessCardMySharedListModal}

      listType={props.listType}
      labelTranslate={props.labelTranslate}
      fieldBelong={FIELD_BELONG.BUSINESS_CARD}
      pathOpenNewWindow={'business-card-my-shared-list'}
      classInfo={props.classInfo}

      handleSubmitListInfos={handleSubmit}
      resetError={props.resetError}
      reset={props.reset}

      action={props.action}
      group={group}
      errorValidates={props.errorValidates}
      errorMessageInModal={props.errorMessageInModal}
      isSuccess={props.isSuccess}
      rowIds={props.rowIds}
      listUpdateTime={listUpdateTime}
      errorParams={props.errorParams}
      listParticipants={listParticipants}
      listFieldSearch={props.listFieldSearch}
      customFieldsInfo={props.customFieldsInfo}
      placeHolder={props.placeHolder}
      isShowEmployeeOnly={true}
    />
  );
}

const mapStateToProps = ({ businessCardMySharedListState, businessCardList }: IRootState) => ({
  action: businessCardMySharedListState.action,
  errorValidates: businessCardMySharedListState.errorItems,
  group: businessCardMySharedListState.group,
  errorMessageInModal: businessCardMySharedListState.errorMessageInModal,
  isSuccess: businessCardMySharedListState.isSuccess,
  rowIds: businessCardMySharedListState.rowIds,
  listUpdateTime: businessCardMySharedListState.listUpdateTime,
  errorParams: businessCardMySharedListState.errorParams,
  listParticipants: businessCardMySharedListState.listParticipants,
  listFieldSearch: businessCardMySharedListState.listFieldSearch,
  customFieldsInfo: businessCardMySharedListState.customFieldsInfo,
  listBusinessCardList: businessCardList.listBusinessCardList,
});

const mapDispatchToProps = {
  handleSubmitListInfos,
  handleInitListModal,
  handleGetGeneralSetting,
  resetError,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BusinessCardMySharedListModal);
