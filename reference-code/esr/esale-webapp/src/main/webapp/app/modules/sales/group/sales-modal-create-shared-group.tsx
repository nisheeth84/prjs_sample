import React, { useState, useEffect, useRef } from 'react';
import { Modal } from 'reactstrap';
import FocusTrap from 'focus-trap-react';
import _, { trim } from 'lodash';
import { connect } from 'react-redux';
import { translate, Storage } from 'react-jhipster';
import { IRootState } from '../../../shared/reducers';
import { useDrop } from 'react-dnd';
import { FIELD_ITEM_TYPE_DND } from 'app/shared/layout/dynamic-form/constants';
import {
  handleInitGroupModal,
  handleSubmitGroupInfos,
  reset,
  resetError,
  SharedGroupAction,
  ACTION_TYPES,
  getFieldInfoGroupShare,
  convertMyListToShareList,
  handleGetGeneralSetting
} from '../shared-group/shared-group.reducer';
import { SHARE_GROUP_MODES, GROUP_TYPES, LIST_MODE, PARTICIPANT_TYPE, SALES_LIST_ID } from '../constants';
// import DynamicControlField from '../../../shared/layout/dynamic-form/control-field/dynamic-control-field';

// import BoxMessage, { MessageType } from '../../../shared/layout/common/box-message';
// import DynamicSearchConditionListComponent from '../../../shared/layout/dynamic-form/list/dynamic-search-condition-list';
// import { dispatchCreateSharedGroup, GroupSaleModalAction, resetShared } from './sales-group-modal.reducer';
// import { SALES_LIST_ID, LIST_TYPE, LIST_MODE, IS_OVER_WRITE, SHARE_GROUP_MODES, PARTICIPANT_TYPE } from '../constants';
import TagAutoComplete from '../../../shared/layout/common/suggestion/tag-auto-complete';
import { decodeUserLogin, jsonParse } from 'app/shared/util/string-utils';
import DialogDirtyCheck from 'app/shared/layout/common/dialog-dirty-check';
import { startExecuting } from 'app/shared/reducers/action-executing';
import { REQUEST } from 'app/shared/reducers/action-type.util';
import { SEARCH_OPTION, SEARCH_TYPE } from 'app/config/constants';
import { TagAutoCompleteType, TagAutoCompleteMode } from 'app/shared/layout/common/suggestion/constants';
import moment from 'moment';
import { utcToTz } from 'app/shared/util/date-utils';

export enum FSActionTypeScreen {
  None,
  RemoveSession,
  SetSession,
  GetSession,
  CloseWindow,
  CreatUpdateSuccess
}
const PULL_DOWN_MEMBER_GROUP_PERMISSION = [
  {
    itemId: 1,
    itemLabel: 'employees.sharegroup.permision.viewer'
  },
  {
    itemId: 2,
    itemLabel: 'employees.sharegroup.permision.owner'
  }
];

interface IModalSharedGorupDispatchProps {
  handleInitGroupModal;
  handleSubmitGroupInfos;
  resetError;
  reset;
  startExecuting;
  getFieldInfoGroupShare;
  convertMyListToShareList;
  handleGetGeneralSetting
}

interface IModalSharedGorupStateProps {
  listFieldSearch;
  customFieldsInfo;
  groupParticipants;
  action;
  errorValidates;
  errorMessageInModal;
  tenant;
  isSuccess;
  group;
  rowIds;
  errorParams;
  listUpdateTime;
  autoGroupUpdatedTime;
}

interface IModalSharedGorupOwnProps {
  iconFunction?: string;
  conditionSearch?: { fieldId; fieldType; isDefault; fieldName; fieldValue; searchType; searchOption; isSearchBlank, searchValue }[];
  onCloseModal: () => void;
  // onCloseModal?: (isUpdate, saveCondition?: { fieldType; isDefault; fieldName; fieldValue; searchType; searchOption }[]) => void;
  // closeCreateSharedGroupModal: () => void;
  onSubmit?: (saveCondition: { isDefault; fieldName; fieldValue; searchType; searchOption }[]) => void;
  fieldSearchGroupInfos?: any;
  popout?: boolean;
  popoutParams?: any;
  groupMode?: number;
  groupId?: number;
  isOwnerGroup?: boolean;
  isAutoGroup?: boolean;
  groupMembers?: any;
  employeeDataLogin?: any;
  recordCheckList?: any;
  listViewChecked?: any;
}

type IModalSharedGorupProps = IModalSharedGorupDispatchProps & IModalSharedGorupStateProps & IModalSharedGorupOwnProps;

const SalesModalCreateSharedGroup: React.FC<IModalSharedGorupProps> = props => {
  const ref = useRef(null);
  const [iconFunction, setIconFunction] = useState(props.iconFunction);
  const [groupMode, setGroupMode] = useState(props.groupMode ? props.groupMode : props.popoutParams.groupMode);
  const [showCustomField, setShowCustomField] = useState(false);
  const [customFieldsInfo, setCustomFieldsInfo] = useState([props.customFieldsInfo]);
  const [, setFieldFilter] = useState('');
  const [groupName, setGroupName] = useState('');
  const [showModal, setShowModal] = useState(true);
  const [forceCloseWindow, setForceCloseWindow] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [isAutoGroup, setIsAutoGroup] = useState(props.isAutoGroup);
  const [, setCheckAutoGroup] = useState(false);
  const [isOverWrite, setIsOverWrite] = useState(true);
  const [listFieldSetting, setListFieldSetting] = useState([]);
  const [msgError, setMsgError] = useState('');
  const [msgSuccess, setMsgSuccess] = useState('');
  const [fields, setFields] = useState([]);
  const [listFieldSearch, setListFieldSearch] = useState(props.listFieldSearch);
  const [saveConditionSearch, setSaveConditionSearch] = useState(props.conditionSearch ? _.cloneDeep(props.conditionSearch) : []);
  const [groupParticipants, setGroupParticipants] = useState(props.groupParticipants);
  const [errorValidates, setErrorValidates] = useState(props.errorValidates);
  const [errorMessageInModal, setErorMessageInModal] = useState(props.errorMessageInModal);
  const [lstGroupMembers, setLstGroupMembers] = useState(props.groupMembers);
  const [tags, setTags] = useState([]);
  const [isSuccess] = useState(false);
  const [oldListFieldSearch, setOldListFieldSearch] = useState(null);
  const [disableChange, setDisableChange] = useState(null);
  const [group, setGroup] = useState(null);
  const [groupMembers, setGroupMembers] = useState(props.groupMembers);
  const [groupId, setGroupId] = useState(props.groupId);
  const [errorParams, setErrorParams] = useState(props.errorParams);
  const [listUpdateTime, setListUpdateTime] = useState(null);
  const [showValidateName, setShowValidateName] = useState("");
  const [isShowValidateName, setIsShowValidateName] = useState(false);

  // const { recordCheckList } = props;
  // const salesCheckList = recordCheckList.filter(sales => sales.isChecked === true);
  const { recordCheckList } = props;

  const salesCheckList = props.listViewChecked.length > 0 ? props.listViewChecked : recordCheckList.filter(sales => sales.isChecked === true);
  const salesCheckListLength = salesCheckList.length;

  const txtInputFocus = useRef(null);

  useEffect(() => {
    txtInputFocus && txtInputFocus.current && txtInputFocus.current.focus();
    return () => {
      props.reset();
    };
  }, []);

  const [, dropBody] = useDrop({
    accept: FIELD_ITEM_TYPE_DND.ADD_CARD,
    drop(item, monitor) {
      const didDrop = monitor.didDrop();
      if (didDrop) {
        return;
      }
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
      isOverCurrent: monitor.isOver({ shallow: true })
    })
  });


  const onActionSelectTag = (id: any, type: TagAutoCompleteType, mode: TagAutoCompleteMode, listTag: any[]) => {
    const tmpListTags = listTag.map(el => {
      if (el.participantType) {
        return el;
      }
      return { ...el, participantType: 1 };
    });
    ref.current.setTags(tmpListTags);
    setTags(tmpListTags);
  };


  const getListAction = () => {
    const tmpPullDownMemberGroupPermission = [];
    PULL_DOWN_MEMBER_GROUP_PERMISSION.forEach((e, idx) => {
      tmpPullDownMemberGroupPermission.push({ id: e.itemId, name: translate(e.itemLabel) });
    });
    return tmpPullDownMemberGroupPermission;
  };

  const handleChangeGroupName = event => {
    setGroupName(event.target.value);
    if (event.target.value.length > 50) {
      setIsShowValidateName(true);
      setShowValidateName(translate("messages.ERR_COM_0025", { 0: 50 }))
      return;
    }
    setIsShowValidateName(false);
    setShowValidateName("");
    setDisableChange(false);
  };


  const isChangeInputEdit = () => {
    const infoUserLogin = decodeUserLogin();
    const myId = parseInt(infoUserLogin['custom:employee_id'], 10);
    switch (groupMode) {
      case SHARE_GROUP_MODES.MODE_CREATE_GROUP:
      case SHARE_GROUP_MODES.MODE_CREATE_GROUP_LOCAL:
      case SHARE_GROUP_MODES.MODE_COPY_GROUP: {
        const lengthOfArray = groupParticipants.filter(e => (e.participantType !== PARTICIPANT_TYPE.OWNER && e.employeeId === myId))
        return groupName || (lengthOfArray && lengthOfArray.length > 0) || isAutoGroup;
      }
      case SHARE_GROUP_MODES.MODE_EDIT_GROUP:
        if (props.isAutoGroup) {
          return (
            groupName !== props.group.productTradingListName ||
            !_.isEqual(tags, props.groupParticipants) ||
            !isAutoGroup ||
            !_.isEqual(props.conditionSearch, saveConditionSearch)
          );
        } else {
          return groupName !== props.group.productTradingListName || !_.isEqual(tags, props.groupParticipants) || isAutoGroup;
        }
      case SHARE_GROUP_MODES.MODE_SWICH_GROUP_TYPE:
        return groupParticipants && groupParticipants.length > 0;
      default:
        return false;
    }
  };

  const executeDirtyCheck = async (action: () => void, cancel?: () => void) => {
    const isChange = isChangeInputEdit();
    if (isChange) {
      await DialogDirtyCheck({ onLeave: action, onStay: cancel, partternType: 1 });
    } else {
      action();
    }
  };
  // const closeModal = (isUpdate?) => {
  //   props.resetError();
  //   props.onCloseModal(isUpdate);
  //   setShowCustomField(false);
  //   setListFieldSetting([]);
  // };

  // const handleCloseModal = () => {
  //   executeDirtyCheck(() => closeModal());
  // };

  const getInitGroupParams = grpMode => {
    const participant = tags;
    const employeeId = []
    participant.forEach(elm => {
      // fix bug #19730
      if (elm.departmentId) {
        elm.employeesDepartments.forEach(item => {
          employeeId.push({
            employeeId: item.employeeId,
            departmentId: item.departmentId,
            participantGroupId: item.groupId,
            participantType: parseInt(elm.participantType, 10)
          })
        });
        // fix bug #19730
      } else if (elm.groupId) {
        elm.employeesGroups.map(_item => {
          employeeId.push({
            employeeId: _item.employeeId,
            departmentId: _item.departmentId,
            participantGroupId: _item.groupId,
            participantType: parseInt(elm.participantType, 10)
          })
        });
      } else {
        employeeId.push({
          employeeId: elm.employeeId,
          departmentId: elm.departmentId,
          participantGroupId: elm.groupId,
          participantType: parseInt(elm.participantType, 10)
        })
      }
    });
    const groupIdParam = _.cloneDeep(groupId);
    switch (grpMode) {
      case SHARE_GROUP_MODES.MODE_CREATE_GROUP:
      case SHARE_GROUP_MODES.MODE_CREATE_GROUP_LOCAL:
      case SHARE_GROUP_MODES.MODE_COPY_GROUP:
        return {
          groupName: groupName === undefined ? '' : groupName,
          groupType: GROUP_TYPES.SHARED_GROUP,
          isAutoGroup,
          isOverWrite,
          groupMembers: lstGroupMembers,
          groupParticipants: employeeId,
          searchConditions: saveConditionSearch
        };
      case SHARE_GROUP_MODES.MODE_EDIT_GROUP:
      case SHARE_GROUP_MODES.MODE_SWICH_GROUP_TYPE:
        return {
          groupId: groupIdParam,
          groupName,
          groupType: GROUP_TYPES.SHARED_GROUP,
          isAutoGroup,
          isOverWrite,
          groupMembers: lstGroupMembers,
          groupParticipants: employeeId,
          searchConditions: saveConditionSearch
        };
      default:
        return null;
    }
  };

  const updateStateSession = (mode: FSActionTypeScreen) => {
    if (mode === FSActionTypeScreen.SetSession) {
      const saveObj = {
        groupName,
        groupMode,
        isAutoGroup,
        isOverWrite,
        listFieldSearch,
        msgError,
        msgSuccess,
        fields,
        groupParticipants,
        errorValidates,
        errorMessageInModal,
        customFieldsInfo,
        lstGroupMembers,
        groupMembers,
        tags,
        listFieldSetting,
        group,
        groupId,
        oldListFieldSearch,
        showCustomField,
        disableChange,
        iconFunction,
        errorParams
      };
      Storage.local.set(SalesModalCreateSharedGroup.name, _.cloneDeep(saveObj));
    } else if (mode === FSActionTypeScreen.GetSession) {
      const saveObj = _.cloneDeep(Storage.local.get(SalesModalCreateSharedGroup.name));
      if (saveObj) {
        setGroupName(saveObj.groupName);
        setGroupMode(saveObj.groupMode);
        setIsAutoGroup(saveObj.isAutoGroup);
        setIsOverWrite(saveObj.isOverWrite);
        setListFieldSearch(saveObj.listFieldSearch);
        setMsgError(saveObj.msgError);
        setMsgSuccess(saveObj.msgSuccess);
        setFields(saveObj.fields);
        setGroupParticipants(saveObj.groupParticipants);
        setErrorValidates(saveObj.errorValidates);
        setErorMessageInModal(saveObj.errorMessageInModal);
        setCustomFieldsInfo(saveObj.customFieldsInfo);
        setLstGroupMembers(saveObj.lstGroupMembers);
        setGroupMembers(saveObj.groupMembers);
        setTags(saveObj.tags);
        setListFieldSetting(saveObj.listFieldSetting);
        setGroup(saveObj.group);
        setGroupId(saveObj.groupId);
        setOldListFieldSearch(saveObj.oldListFieldSearch);
        setShowCustomField(saveObj.showCustomField);
        setDisableChange(saveObj.disableChange);
        setErrorParams(saveObj.errorParams);
        setIconFunction(saveObj.iconFunction);
      }
    } else if (mode === FSActionTypeScreen.RemoveSession) {
      Storage.local.remove(SalesModalCreateSharedGroup.name);
    }
  };
  // const closeModal = () => {
  //   props.resetError();
  //   props.onCloseModal();
  //   setShowCustomField(false);
  //   setListFieldSetting([]);
  //   // props.closeCreateSharedGroupModal;
  // };

  const handleCloseModal = () => {
    executeDirtyCheck(props.onCloseModal);
  };


  const renderListUpdateTime = () => {
    if (listUpdateTime) {
      return (
        <div className="row">
          <div className="col-lg-12 form-group">
            <label>{translate('sales.group.group-modal-add-edit-my-group.list-update-time', { 0: listUpdateTime })}</label>
          </div>
        </div>
      );
    }
    return null;
  };

  useEffect(() => {
    setListUpdateTime(props.listUpdateTime);
  }, [props.listUpdateTime]);

  useEffect(() => {
    if (props.action === SharedGroupAction.CreateUpdateGroupSuccess) {
      if (props.popout) {
        window.opener.postMessage({ type: FSActionTypeScreen.CreatUpdateSuccess, forceCloseWindow: true }, window.location.origin);
        Storage.session.set('forceCloseWindow', true);
        window.close();
      } else {
        updateStateSession(FSActionTypeScreen.RemoveSession);
        props.onCloseModal();
      }
    } else {
      setDisableChange(false);
    }
  }, [props.action]);

  useEffect(() => {
    if (forceCloseWindow) {
      if (props.popout) {
        window.opener.postMessage({ type: FSActionTypeScreen.CloseWindow, forceCloseWindow: true }, window.location.origin);
        Storage.session.set('forceCloseWindow', true);
        window.close();
      } else {
        props.onCloseModal();
      }
    }
  }, [forceCloseWindow]);

  useEffect(() => {
    if (props.listFieldSearch && props.listFieldSearch.length > 0) {
      const newListFieldSearch = _.cloneDeep(props.listFieldSearch);
      newListFieldSearch.forEach((field, id) => {
        /**
         * @TODO refactor this function
         */
        const jsonValue = jsonParse(field.searchValue, { 1: "" });
        newListFieldSearch[id]['isSearchBlank'] = !(jsonValue['1'] && jsonValue['1'].length > 0);
        newListFieldSearch[id]['fieldValue'] = field.searchValue;
      });
      setListFieldSearch(newListFieldSearch);
      setSaveConditionSearch(_.cloneDeep(newListFieldSearch));
    }
  }, [props.listFieldSearch, props.action]);

  useEffect(() => {
    if (_.isEmpty(props.groupParticipants)) {
      const infoUserLogin = decodeUserLogin();
      if (!_.isNil(props.employeeDataLogin)) {
        const dataTags = props.employeeDataLogin;
        dataTags.employeeId = parseInt(infoUserLogin['custom:employee_id'], 10);
        dataTags.participantType = 2;
        setGroupParticipants([dataTags]);
        ref.current.setTags([dataTags]);
        setTags([dataTags]);
      }
    } else {
      setGroupParticipants(_.cloneDeep(props.groupParticipants));
      setTags(_.cloneDeep(props.groupParticipants));
      ref.current.setTags(_.cloneDeep(props.groupParticipants));
    }
  }, [props.groupParticipants, props.employeeDataLogin]);

  useEffect(() => {
    if (props.group) {
      setGroup(props.group);
      setGroupName(props.group.productTradingListName);
      if (props.group.listMode === LIST_MODE.AUTO) {
        setIsAutoGroup(true);
      }
    }
  }, [props.group]);

  useEffect(() => {
    if (props.errorValidates && props.errorValidates.length > 0) {
      setErrorValidates(props.errorValidates);
    }
  }, [props.errorValidates]);
  useEffect(() => {
    if (props.errorParams && props.errorParams.length > 0) {
      setErrorParams(props.errorParams);
    }
  }, [props.errorParams]);

  useEffect(() => {
    if (props.errorMessageInModal && props.errorMessageInModal.length > 0) {
      setErorMessageInModal(_.cloneDeep(props.errorMessageInModal));
    }
  }, [props.errorMessageInModal]);

  useEffect(() => {
    if (props.customFieldsInfo && props.customFieldsInfo.length > 0) {
      setCustomFieldsInfo(props.customFieldsInfo);
    }
  }, [props.customFieldsInfo]);

  useEffect(() => {
    if (props.popout) {
      updateStateSession(FSActionTypeScreen.GetSession);
      setShowModal(false);
      setShouldRender(true);
      setForceCloseWindow(false);
      updateStateSession(FSActionTypeScreen.RemoveSession);
      document.body.className = 'wrap-sales modal-open';
    } else {
      setShowModal(true);
      setShowCustomField(false);
      setShouldRender(true);
      setFieldFilter('');
      setSaveConditionSearch(props.conditionSearch);
    }
    setFieldFilter('');
    return () => {
      document.body.className = document.body.className.replace('modal-open', '');
    };
  }, []);

  useEffect(() => {
    props.getFieldInfoGroupShare();
    return () => { };
  }, []);

  useEffect(() => {
    props.handleGetGeneralSetting('list_update_time');
    if (!props.popout && props.groupMode !== SHARE_GROUP_MODES.MODE_CREATE_GROUP) {
      props.handleInitGroupModal(props.groupId, props.isOwnerGroup, true);
    }
    return () => { };
  }, []);

  useEffect(() => {
    if (props.autoGroupUpdatedTime) {
      const tzTime = utcToTz(props.autoGroupUpdatedTime.updatedDate);
      setListUpdateTime(moment(tzTime).format("HH:mm"))
    }
  }, [props.autoGroupUpdatedTime])

  useEffect(() => {
    if (errorMessageInModal && errorMessageInModal.length > 0) {
      setMsgError(errorMessageInModal);
    }
  }, [errorMessageInModal]);




  const handleSubmitModal = () => {
    const maxLength = 50;
    if (groupName && groupName.length > maxLength) {
      setShowValidateName(translate("messages.ERR_COM_0025", { 0: maxLength }));
      setIsShowValidateName(true);
    } else if (groupName && groupName.trim().length < 1) {
      setShowValidateName(translate("messages.ERR_COM_0013"))
      setIsShowValidateName(true);
    } else {
      const initParam = getInitGroupParams(groupMode);
      const groupIdIn = initParam.groupId;
      console.log("handleSubmitModal -> groupIdIn", groupIdIn)
      const listOfproductTradingId = salesCheckList;
      console.log("handleSubmitModal -> salesCheckList", salesCheckList)
      console.log("handleSubmitModal -> listOfproductTradingId", listOfproductTradingId)
      const groupNameIn = initParam.groupName.trim();
      const groupTypeIn = initParam.groupType;
      const isAutoGroupIn = initParam.isAutoGroup;
      const isOverWriteIn = initParam.isOverWrite;
      const groupMembersIn = initParam.groupMembers;
      const groupParticipantsIn = initParam.groupParticipants;
      const searchConditionsIn = initParam.searchConditions;

      switch (groupMode) {
        case SHARE_GROUP_MODES.MODE_CREATE_GROUP:
        case SHARE_GROUP_MODES.MODE_CREATE_GROUP_LOCAL:
        case SHARE_GROUP_MODES.MODE_COPY_GROUP:
          props.startExecuting(REQUEST(ACTION_TYPES.SHARED_GROUP_CREATE));
          break;
        case SHARE_GROUP_MODES.MODE_EDIT_GROUP:
        case SHARE_GROUP_MODES.MODE_SWICH_GROUP_TYPE:
          props.startExecuting(REQUEST(ACTION_TYPES.SHARED_GROUP_UPDATE));
          break;
        default:
          break;
      }
      setErorMessageInModal([]);
      setErrorValidates([]);
      setErrorParams([]);
      props.handleSubmitGroupInfos(
        groupIdIn,
        groupNameIn,
        groupTypeIn,
        isAutoGroupIn,
        isOverWriteIn,
        groupMembersIn,
        groupParticipantsIn,
        searchConditionsIn,
        groupMode,
        listOfproductTradingId
      );
    }
  };

  const getCountMemberLocalAdd = () => {
    return groupMembers && groupMembers.length > 0 ? groupMembers.length : 0;
  };

  const handleCloseSettingField = () => {
    setShowCustomField(false);
    setListFieldSetting([]);
    setDisableChange(false);
    setListFieldSearch(_.cloneDeep(oldListFieldSearch));
  };

  const handleDisplaySetting = () => {
    setOldListFieldSearch(_.cloneDeep(listFieldSearch));
    setShowCustomField(true);
    setDisableChange(true);
    // setListFieldSearch(fields);
    // props.getCustomFieldsInfo(fieldBelong);
  };

  const handleBackPopup = () => {
    if (showCustomField) {
      handleCloseSettingField();
    }
  };

  // #endregion

  const openNewWindow = () => {
    updateStateSession(FSActionTypeScreen.SetSession);
    setShowModal(false);
    const height = screen.height * 0.8;
    const width = screen.width * 0.8;
    const left = screen.width * 0.3;
    const top = screen.height * 0.3;
    const style = `width=${width},height=${height},left=${left},top=${top}`;
    window.open(`${props.tenant}/sales-shared-group/${props.groupMode}`, '', style.toString());
    props.onCloseModal();
  };

  // #region my code

  const handleSwichAddMode = value => {
    if (value.toString() === SHARE_GROUP_MODES.ADD_CONDITION_SEARCH_AUTO.toString()) {
      setCheckAutoGroup(true);
    }
    setIsAutoGroup(value.toString() === SHARE_GROUP_MODES.ADD_CONDITION_SEARCH_AUTO.toString());
  };

  const handleCheckOveride = event => {
    setIsOverWrite(event.target.checked);
  };



  const handleUpdateSettingField = () => {
    setShowCustomField(false);
    if (!listFieldSearch || listFieldSearch.length <= 0) {
      setDisableChange(false);
      return;
    }
    const objParams = [];
    listFieldSearch.forEach((el, idx) => {
      const obj = _.cloneDeep(el);
      obj.fieldOrder = idx + 1;
      obj['searchType'] = el.searchType ? el.searchType : SEARCH_TYPE.LIKE;
      obj['searchOption'] = el.searchOption ? el.searchOption : SEARCH_OPTION.WORD;
      objParams.push(obj);
    });
    setFields(objParams);
    setSaveConditionSearch(objParams);
    setDisableChange(false);
  };

  const changeListFieldChosen = lstFieldSearch => {
    setListFieldSearch(lstFieldSearch);
  };

  const getModalName = () => {
    switch (groupMode) {
      case SHARE_GROUP_MODES.MODE_SWICH_GROUP_TYPE:
        return translate('sales.sharegroup.lbSwitchGroupType');
      case SHARE_GROUP_MODES.MODE_COPY_GROUP:
      case SHARE_GROUP_MODES.MODE_CREATE_GROUP:
      case SHARE_GROUP_MODES.MODE_CREATE_GROUP_LOCAL:
        return translate('sales.sharegroup.lbCreateGroup');
      default:
        return translate('sales.sharegroup.lbEditGroup');
    }
  };

  const getDataStatusControl = item => {
    if (saveConditionSearch && saveConditionSearch.length > 0) {
      const saveConditionSearchCopy = _.cloneDeep(saveConditionSearch);
      const dataStatus = saveConditionSearchCopy.filter(e => e.fieldId.toString() === item.fieldId.toString());
      if (groupMode !== SHARE_GROUP_MODES.MODE_CREATE_GROUP) {
        if (dataStatus && dataStatus.length > 0) {
          const fieldValueJson = jsonParse(dataStatus[0].fieldValue);
          const fFieldValue = fieldValueJson ? fieldValueJson : dataStatus[0].fieldValue;
          if (dataStatus[0].fieldType === 6 || dataStatus[0].fieldType === 7) {
            if (Array.isArray(fFieldValue) && fFieldValue.length > 0) {
              dataStatus[0]['dateFrom'] = fFieldValue[0] && fFieldValue[0].from;
              dataStatus[0]['dateTo'] = fFieldValue[0] && fFieldValue[0].to;
              return dataStatus[0];
            } else {
              dataStatus[0]['dateFrom'] = fFieldValue && fFieldValue.from ? fFieldValue.from : null;
              dataStatus[0]['dateTo'] = fFieldValue && fFieldValue.to ? fFieldValue.to : null;
              return dataStatus[0];
            }
          }
          if (Array.isArray(fFieldValue) && fFieldValue.length > 0) {
            // const value = {fFieldValue[0]}
            dataStatus[0].fieldValue = fFieldValue;
          } else if (fFieldValue && fFieldValue.length > 0 && fFieldValue.value) {
            dataStatus[0].fieldValue = fFieldValue.value;
          } else if (fFieldValue && typeof fFieldValue === 'object') {
            dataStatus[0].fieldValue = _.size(fFieldValue) > 0 ? fFieldValue['1'] : '';
          }
        }
        const tempObj = _.cloneDeep(dataStatus[0])
        delete tempObj.searchValue;
        return tempObj;
      }
    }
    return null;
  };

  const updateStateField = (item, type, val) => {
    if (val === '') {
      return;
    }
    const valueUpdate = _.cloneDeep(val);
    valueUpdate['fieldLabel'] = item.fieldLabel;
    valueUpdate['fieldItems'] = item.fieldItems;
    valueUpdate['fieldOrder'] = item.fieldOrder;

    if (saveConditionSearch) {
      const indexField = saveConditionSearch.findIndex(e => e.fieldId.toString() === item.fieldId.toString());
      if (indexField < 0) {
        saveConditionSearch.push(valueUpdate);
      } else {
        saveConditionSearch[indexField] = valueUpdate;
      }
    } else {
      const newObject = [];
      newObject.push(valueUpdate);
      setSaveConditionSearch(newObject);
    }
  };

  const getTextButtomSubmit = () => {
    if (groupMode.toString() === SHARE_GROUP_MODES.MODE_EDIT_GROUP.toString()) {
      return translate('sales.sharegroup.btnUpdate');
    } else if (groupMode.toString() === SHARE_GROUP_MODES.MODE_SWICH_GROUP_TYPE.toString()) {
      return translate('sales.sharegroup.btnChange');
    } else {
      return translate('sales.sharegroup.btnCreate');
    }
  };

  const baseUrl = window.location.origin.toString();
  const getIconFunction = () => {
    if (!props.iconFunction) {
      return <></>;
    } else {
      return <img src={baseUrl + `/content/images/${props.iconFunction}`} alt="" />;
    }
  };

  const radioGroupTypeData = {
    fieldName: 'radio',
    fieldLabel: translate('sales.sharegroup.lbGroupType'),
    fieldItems: [
      {
        itemId: '1',
        itemLabel: translate('sales.sharegroup.radManual'),
        itemOrder: '1',
        isDefault: false
      },
      {
        itemId: '2',
        itemLabel: translate('sales.sharegroup.radAuto'),
        itemOrder: '2',
        isDefault: true
      }
    ]
  };

  const onMoveField = (fieldDrop, fieldDrag) => {
    const objectFieldInfos = _.cloneDeep(listFieldSearch);
    const dropIndex = objectFieldInfos.findIndex(e => JSON.stringify(e.fieldId) === JSON.stringify(fieldDrop.fieldId));
    const dropItem = objectFieldInfos.find(e => JSON.stringify(e.fieldId) === JSON.stringify(fieldDrop.fieldId));
    const dragIndex = objectFieldInfos.findIndex(e => JSON.stringify(e.fieldId) === JSON.stringify(fieldDrag.fieldId));

    if (dropIndex >= 0 && dragIndex >= 0) {
      if (dropIndex > dragIndex) {
        objectFieldInfos.splice(dragIndex, 0, dropItem);
        objectFieldInfos.splice(dropIndex + 1, 1);
      } else {
        objectFieldInfos.splice(dragIndex + 1, 0, dropItem);
        objectFieldInfos.splice(dropIndex, 1);
      }

      setListFieldSearch(objectFieldInfos);
    }
  };

  let styleError = '';
  if (!isSuccess) {
    styleError = 'input-common-wrap error';
  }
  const parseValidateError = () => {
    const errorMsg = [];
    if (errorMessageInModal) {
      const errorMessage = errorMessageInModal.filter((v, i) => errorMessageInModal.indexOf(v) === i);
      errorMessage.forEach(element => {
        if (element === 'ERR_COM_0050') {
          errorMsg.push(translate('messages.' + element));
        } else {
          errorMsg.push(translate('messages.' + element))
        }
      });
    }
    return errorMsg;
  };

  const validateItem = item => {
    const index = errorValidates.indexOf(item);
    if (index >= 0 && errorMessageInModal && errorMessageInModal.length > 0) {
      return translate('messages.' + errorMessageInModal[index], errorParams[index]);
    }
    return null;
  };

  const setListParticipantsType = (tagSelected, type) => {
    const tmpParticipantsType = _.cloneDeep(tags);
    tmpParticipantsType.forEach(tag => {
      if (
        (tag.employeeId && tagSelected.employeeId && tag.employeeId === tagSelected.employeeId) ||
        (tag.groupId && tagSelected.groupId && tag.groupId === tagSelected.groupId) ||
        (tag.departmentId && tagSelected.departmentId && tag.departmentId === tagSelected.departmentId)
      ) {
        tag.participantType = type;
      }
    });
    setTags(tmpParticipantsType);
    ref.current.setTags(tmpParticipantsType);
  };

  const validateSearch = rowIndex => {
    props.errorValidates.map((e, idx) => {
      if (e === 'searchValue' && props.rowIds[idx] === rowIndex) {
        const errorInfo = {
          rowId: e.rowId,
          item: e.item,
          errorCode: errorMessageInModal[idx],
          errorMsg: translate('messages.' + props.errorMessageInModal[idx]),
          params: null
        };
        return errorInfo;
      }
    });
    return null;
  };

  const renderModalDefault = () => {
    return (
      <div className="modal popup-esr popup-esr4 user-popup-page popup-align-right show" id="popup-esr" aria-hidden="true">
        <div className={showModal ? 'modal-dialog form-popup' : 'form-popup'}>
          <div className="modal-content">
            <div className="modal-header">
              <div className="left">
                <div className="popup-button-back">
                  <button
                    type="button"
                    title=""
                    className="modal-heading-title"
                    onClick={
                      showCustomField
                        ? handleBackPopup
                        : e => {
                          e.preventDefault();
                        }
                    }
                  >
                    <i
                      className={showCustomField ? 'icon-small-primary icon-return-small' : 'icon-small-primary icon-return-small disable'}
                    />
                    <span className="text">
                      {getIconFunction()} {getModalName()}
                    </span>
                  </button>
                </div>
              </div>
              <div className="right">
                {showModal && <button type="button" className="icon-small-primary icon-link-small" onClick={() => openNewWindow()}></button>}
                {showModal && <button type="button" onClick={handleCloseModal} className="icon-small-primary icon-close-up-small line"></button>}
              </div>
            </div>

            <div className="modal-body style-3 fix-tag-auto-width-720">
              <div className="edit-popup-content-common popup-content padding-0 style-3 fix-height-shared-group" ref={dropBody}>
                <div className="user-popup-form">
                  {/* {props.errorMessageInModal && props.errorMessageInModal.length > 0 && parseValidateError().length > 0 && (
                    <BoxMessage messageType={MessageType.Error} messages={parseValidateError()} />
                  )} */}
                  {salesCheckListLength > 0 && (
                    <div className="block-feedback block-feedback-blue">
                      {translate("messages.WAR_COM_0003", { n: salesCheckListLength })}
                    </div>
                  )}
                  {isAutoGroup ? renderListUpdateTime() : null}
                  <div className="row break-row">
                    {groupMode.toString() === SHARE_GROUP_MODES.MODE_CREATE_GROUP_LOCAL.toString() && (
                      <>
                        <div className="col-lg-6 form-group break-line color-707070">{translate('sales.sharegroup.lbCreateGroup')}</div>
                        <div className="col-lg-6 m-0-0-1000-0"></div>
                        <div className="col-lg-6 form-group break-line">
                          <div className="block-feedback block-feedback-blue">
                            {getCountMemberLocalAdd()} {translate('sales.sharegroup.lbCreateGroupWith')}
                          </div>
                        </div>
                        <div className="col-lg-6 m-0-0-1000-0"></div>
                      </>
                    )}
                    <div className="col-lg-6 form-group">
                      <label>
                        {translate('sales.sharegroup.lbGroupName')}
                        <span className="label-red">{translate('sales.sharegroup.lbRequire')}</span>
                      </label>
                      <div className={errorValidates.includes('productTradingListName') || isShowValidateName ? styleError : null}>
                        <input
                          // className={disableChange ? 'input-normal disable' : 'input-normal'}
                          className="input-normal"
                          // disabled={disableChange}
                          type="text"
                          placeholder={translate('sales.sharegroup.placeholderShareListTool')}
                          value={groupName}
                          onChange={handleChangeGroupName}
                          ref={txtInputFocus}
                        // onKeyDown={e => {
                        //   if (disableChange) {
                        //     e.preventDefault();
                        //   }
                        // }}
                        ></input>
                        {errorValidates.includes('productTradingListName') && <div className="messenger">{validateItem('productTradingListName')}</div>}
                        {isShowValidateName && <div className="messenger">{showValidateName}</div>}
                      </div>
                    </div>

                    <div className="col-lg-6 break-line form-group">
                      <div className="form-group">
                        <label>
                          {translate('sales.sharegroup.lbListParticipants')}
                          <span className="label-red">{translate('sales.sharegroup.lbRequire')}</span>
                        </label>
                        <TagAutoComplete
                          id="paticipant"
                          type={TagAutoCompleteType.Employee}
                          modeSelect={TagAutoCompleteMode.Multi}
                          ref={ref}
                          onActionSelectTag={onActionSelectTag}
                          placeholder={translate('sales.sharegroup.placeholderParticipants')}
                          listActionOption={getListAction()}
                          onActionOptionTag={setListParticipantsType}
                          elementTags={
                            groupMode.toString() === SHARE_GROUP_MODES.MODE_CREATE_GROUP.toString() ||
                              groupMode.toString() === SHARE_GROUP_MODES.MODE_CREATE_GROUP_LOCAL.toString()
                              ? null
                              : groupParticipants
                          }
                          validMsg={validateItem('listType')}
                          isDisabled={disableChange}
                          inputClass={disableChange ? 'input-normal disable' : 'input-normal'}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="user-popup-form-bottom">
              {disableChange && (
                <button className="button-blue button-form-register disable cursor-df" type="button">
                  {getTextButtomSubmit()}
                </button>
              )}
              {!disableChange && (
                <button
                  onClick={() => {
                    setDisableChange(true);
                    handleSubmitModal();
                  }}
                  className="button-blue button-form-register "
                  type="button"
                >
                  {getTextButtomSubmit()}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };



  const renderComponentInputSearch = () => {
    if (
      groupMode.toString() === SHARE_GROUP_MODES.MODE_CREATE_GROUP.toString() ||
      groupMode.toString() === SHARE_GROUP_MODES.MODE_CREATE_GROUP_LOCAL.toString() ||
      groupMode.toString() === SHARE_GROUP_MODES.MODE_EDIT_GROUP.toString() ||
      groupMode.toString() === SHARE_GROUP_MODES.MODE_COPY_GROUP.toString()
    ) {
      return renderModalDefault();
    }
    return <></>;
  };

  // #endregion mycode

  if (showModal) {
    return (
      <>
        <FocusTrap focusTrapOptions={{ clickOutsideDeactivates: true }}>
          <Modal isOpen fade toggle={() => { }} backdrop id="popup-field-search" autoFocus zIndex="auto">
            {renderComponentInputSearch()}
          </Modal>
        </FocusTrap>
      </>
    );
  } else {
    if (props.popout) {
      return (
        <>
          <FocusTrap focusTrapOptions={{ clickOutsideDeactivates: true }}>
            <Modal isOpen fade toggle={() => { }} backdrop id="popup-field-search" autoFocus zIndex="auto">
              {renderComponentInputSearch()}
            </Modal>
          </FocusTrap>
        </>
      );
    } else {
      return <></>;
    }
  }
};

const mapStateToProps = ({ applicationProfile, sharedGroupSales, salesControlSidebar, dynamicList }: IRootState) => ({
  action: sharedGroupSales.action,
  group: sharedGroupSales.group,
  isSuccess: sharedGroupSales.isSuccess,
  errorMessageInModal: sharedGroupSales.errorMessageInModal,
  rowIds: sharedGroupSales.rowIds,
  listFieldSearch: sharedGroupSales.listFieldSearch,
  customFieldsInfo: sharedGroupSales.customFieldsInfo,
  groupParticipants: sharedGroupSales.groupParticipants,
  tenant: applicationProfile.tenant,
  errorValidates: sharedGroupSales.errorItems,
  errorParams: sharedGroupSales.errorParams,
  listUpdateTime: sharedGroupSales.listUpdateTime,
  employeeDataLogin: salesControlSidebar.employeeDataLogin,
  autoGroupUpdatedTime: sharedGroupSales.autoGroupUpdatedTime,
  recordCheckList: dynamicList.data.has(SALES_LIST_ID) ? dynamicList.data.get(SALES_LIST_ID).recordCheckList : []

});

const mapDispatchToProps = {
  handleInitGroupModal,
  handleSubmitGroupInfos,
  resetError,
  reset,
  startExecuting,
  getFieldInfoGroupShare,
  convertMyListToShareList,
  handleGetGeneralSetting
};

export default connect<IModalSharedGorupStateProps, IModalSharedGorupDispatchProps, IModalSharedGorupOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(SalesModalCreateSharedGroup);
