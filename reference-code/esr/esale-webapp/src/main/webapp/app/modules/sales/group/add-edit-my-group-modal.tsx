import React, { useState, useEffect, useRef } from 'react';
import { Modal } from 'reactstrap';
import FocusTrap from 'focus-trap-react';
import _ from 'lodash';
import { connect } from 'react-redux';
// import { translate, Storage, logInfo } from 'react-jhipster';
import { translate, Storage } from 'react-jhipster';
import { IRootState } from '../../../shared/reducers';
import { useDrop } from 'react-dnd';
import { FIELD_ITEM_TYPE_DND, DEFINE_FIELD_TYPE } from 'app/shared/layout/dynamic-form/constants';
import {
  handleInitGroupModal,
  handleSubmitGroupInfos,
  reset,
  resetError,
  SharedGroupAction,
  ACTION_TYPES,
  getFieldInfoGroupShare,
  handleGetGeneralSetting
} from '../shared-group/shared-group.reducer';
import { SHARE_GROUP_MODES, GROUP_TYPES, LIST_MODE, PARTICIPANT_TYPE } from '../constants';
import DynamicControlField from '../../../shared/layout/dynamic-form/control-field/dynamic-control-field';
import RadioBoxSwichMode from '../shared-group/radio-box-swich-mode';
import BoxMessage, { MessageType } from '../../../shared/layout/common/box-message';
import DynamicSearchConditionListComponent from '../../../shared/layout/dynamic-form/list/dynamic-search-condition-list';
import TagAutoComplete from '../../../shared/layout/common/suggestion/tag-auto-complete';
import { decodeUserLogin, jsonParse } from 'app/shared/util/string-utils';
import DialogDirtyCheck from 'app/shared/layout/common/dialog-dirty-check';
import { startExecuting } from 'app/shared/reducers/action-executing';
import { REQUEST } from 'app/shared/reducers/action-type.util';
import { SEARCH_OPTION, SEARCH_TYPE, FIELD_BELONG } from 'app/config/constants';
import { TagAutoCompleteType, TagAutoCompleteMode } from 'app/shared/layout/common/suggestion/constants';
import { utcToTz } from 'app/shared/util/date-utils';
import moment from 'moment';
import { parseSearchConditions } from '../utils';
import { useDetectFormChange } from 'app/shared/util/useDetectFormChange';

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
  handleGetGeneralSetting;
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
  localMenu
}

interface IModalSharedGorupOwnProps {
  iconFunction?: string;
  conditionSearch?: { fieldId; fieldType; isDefault; fieldName; fieldValue; searchType; searchOption; isSearchBlank, searchValue }[];
  onCloseModal?: (isUpdate, saveCondition?: { fieldType; isDefault; fieldName; fieldValue; searchType; searchOption }[]) => void;
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
}

type IModalSharedGorupProps = IModalSharedGorupDispatchProps & IModalSharedGorupStateProps & IModalSharedGorupOwnProps;

const ModalSalesMyGroupEdit: React.FC<IModalSharedGorupProps> = props => {
  const ref = useRef(null);
  // const [first, setFirst] = useState(false);
  const [iconFunction, setIconFunction] = useState(props.iconFunction);
  const [groupMode, setGroupMode] = useState(props.groupMode ? props.groupMode : props.popoutParams.groupMode);
  const [showCustomField, setShowCustomField] = useState(false);
  const [customFieldsInfo, setCustomFieldsInfo] = useState([props.customFieldsInfo]);
  const [showValidateName, setShowValidateName] = useState("");
  // const [fieldFilter, setFieldFilter] = useState('');
  const [, setFieldFilter] = useState('');
  const [groupName, setGroupName] = useState('');
  const [showModal, setShowModal] = useState(true);
  const [forceCloseWindow, setForceCloseWindow] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [isAutoGroup, setIsAutoGroup] = useState(props.isAutoGroup);
  // const [checkAutoGroup, setCheckAutoGroup] = useState(false);
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
  // const [isSubmitted, setIsSubmitted] = useState(false);
  const [, setIsSubmitted] = useState(false);
  // const [conditionSearch, setConditionSearch] = useState([]);
  const listErrorWithoutParam = ['ERR_COM_0050', 'ERR_COM_0059', 'ERR_EMP_0041'];

  const txtInputFocus = useRef(null);

  const formId = 'modal-my-group-42eqwds'
  const [isChanged] = useDetectFormChange(
    formId,
    [],
    [['button-pull-down-small'], ['button-primary', 'button-activity-registration']]
  );

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
    ref.current && ref.current.setTags(tmpListTags);
    setTags(tmpListTags);
  };

  // const onDeleteTag = idx => {
  //   ref.current && ref.current.deleteTag(idx);
  // };

  const getListAction = () => {
    const tmpPullDownMemberGroupPermission = [];
    PULL_DOWN_MEMBER_GROUP_PERMISSION.forEach((e, idx) => {
      tmpPullDownMemberGroupPermission.push({ id: e.itemId, name: translate(e.itemLabel) });
    });
    return tmpPullDownMemberGroupPermission;
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
    // const isChange = isChangeInputEdit();
    if (isChanged) {
      await DialogDirtyCheck({ onLeave: action, onStay: cancel, partternType: 1 });
    } else {
      action();
    }
  };

  const getInitGroupParams = grpMode => {
    const participant = tags;
    const groupIdParam = _.cloneDeep(groupId);
    switch (grpMode) {
      case SHARE_GROUP_MODES.MODE_CREATE_GROUP:
      case SHARE_GROUP_MODES.MODE_CREATE_GROUP_LOCAL:
      case SHARE_GROUP_MODES.MODE_COPY_GROUP:
        return {
          groupName: groupName === undefined ? '' : groupName,
          groupType: GROUP_TYPES.MY_GROUP,
          isAutoGroup,
          isOverWrite,
          groupMembers: lstGroupMembers,
          groupParticipants: participant.map((r, i) => ({
            employeeId: r.employeeId,
            departmentId: r.departmentId,
            participantGroupId: r.groupId,
            participantType: parseInt(r.participantType, 10)
          })),
          searchConditions: _.cloneDeep(saveConditionSearch)
        };
      case SHARE_GROUP_MODES.MODE_EDIT_GROUP:
      case SHARE_GROUP_MODES.MODE_SWICH_GROUP_TYPE:
        return {
          groupId: groupIdParam,
          groupName,
          groupType: GROUP_TYPES.MY_GROUP,
          isAutoGroup,
          isOverWrite,
          groupMembers: lstGroupMembers,
          groupParticipants: participant.map((r, i) => ({
            employeeId: r.employeeId,
            departmentId: r.departmentId,
            participantGroupId: r.groupId,
            participantType: parseInt(r.participantType, 10)
          })),
          searchConditions: _.cloneDeep(saveConditionSearch)
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
        errorParams,
        saveConditionSearch
      };
      Storage.local.set(ModalSalesMyGroupEdit.name, _.cloneDeep(saveObj));
    } else if (mode === FSActionTypeScreen.GetSession) {
      const saveObj = _.cloneDeep(Storage.local.get(ModalSalesMyGroupEdit.name));
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
        setSaveConditionSearch(saveObj.saveConditionSearch)
      }
    } else if (mode === FSActionTypeScreen.RemoveSession) {
      Storage.local.remove(ModalSalesMyGroupEdit.name);
    }
  };

  const closeModal = (isUpdate?) => {
    props.resetError();
    props.onCloseModal(isUpdate);
    setShowCustomField(false);
    setListFieldSetting([]);
  };

  const handleCloseModal = () => {
    executeDirtyCheck(() => closeModal());
  };


  const renderListUpdateTime = () => {
    if (listUpdateTime !== "Invalid date") {
      return (
        <div className="row">
          <div className="col-lg-12 form-group">
            <label>{translate('sales.group.group-modal-add-edit-my-group.list-update-time', { 0: listUpdateTime })}</label>
          </div>
        </div>
      );
    } else {
      return (
        <></>
      )
    }
    // return null;
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
        closeModal(true);
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
        closeModal();
      }
    }
  }, [forceCloseWindow]);

  const convertSpecialFieldProductTrading = (listFields, customFields) => {
    const _fields = _.cloneDeep(listFields);
    _fields.map(item => {
      item.isSearchBlank = false;
      if (_.isEmpty(item.searchValue) || item.searchValue === '{}') {
        item.isSearchBlank = true;
      }
      const field = customFields.find(x => x.fieldId === item.fieldId)
      if (field) {
        item.fieldItems = field.fieldItems
      }
      return item;
    });
    return _fields;
  }

  useEffect(() => {
    if (props.listFieldSearch && props.listFieldSearch.length > 0) {
      const newListFieldSearch = _.cloneDeep(props.listFieldSearch);
      const _fields = convertSpecialFieldProductTrading(newListFieldSearch, customFieldsInfo);
      _fields.map(item => {
        const searchValue = [];
        const data = _.toArray(JSON.parse(item.searchValue));
        data.forEach((el, idx) => {
          searchValue.push(data[idx])
        })
        item.fieldValue = searchValue;
      })
      if (props.action === SharedGroupAction.Doneinit) {
        setListFieldSearch(_fields);
      }
      setSaveConditionSearch(_.cloneDeep(_fields));
    }
  }, [props.listFieldSearch, props.action]);

  useEffect(() => {
    const infoUserLogin = decodeUserLogin();
    if (!_.isNil(props.employeeDataLogin)) {
      const dataTags = props.employeeDataLogin;
      dataTags.employeeId = parseInt(infoUserLogin['custom:employee_id'], 10);
      dataTags.participantType = 2;
      setGroupParticipants([dataTags]);
      ref.current && ref.current.setTags([dataTags]);
      setTags([dataTags]);
    }
  }, [props.groupParticipants, props.employeeDataLogin]);

  useEffect(() => {
    if (props.group) {
      setGroup(props.group);
      setGroupName(props.group.productTradingListName);
      if (props.localMenu && props.localMenu.initializeLocalMenu) {
        const { myGroups, sharedGroups } = props.localMenu.initializeLocalMenu;
        if (groupMode === SHARE_GROUP_MODES.MODE_COPY_GROUP) {
          const newGroupData = [...myGroups, ...sharedGroups];
          const nuberOfItem = _.filter(newGroupData, elm =>
            _.includes(elm.listName, props.group.productTradingListName)
          ).length;
          if (nuberOfItem < 2) {
            const countn = nuberOfItem + 1;
            const copyName =
              props.group.productTradingListName +
              translate('sales.sidebar.duplicate', { n: countn });
            setGroupName(copyName);
          } else {
            let countCheck = 2;
            for (countCheck; countCheck <= nuberOfItem; countCheck++) {
              let copyName2 =
                props.group.productTradingListName +
                translate('sales.sidebar.duplicate', { n: countCheck });
              const checkName = _.filter(newGroupData, elm => _.includes(elm.listName, copyName2))
                .length;
              if (checkName === 0) {
                setGroupName(copyName2);
                break;
              } else {
                const newNumberCopy = countCheck + 1;
                copyName2 =
                  props.group.productTradingListName +
                  translate('sales.sidebar.duplicate', { n: newNumberCopy });
                setGroupName(copyName2);
              }
            }
          }
        }
      }

      if (props.group.listMode === LIST_MODE.AUTO) {
        setIsAutoGroup(true);
      }
      if (!_.isNil(props.group.isOverWrite)) {
        setIsOverWrite(props.group.isOverWrite);
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
      document.body.className = 'wrap-employee modal-open';
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
      // const tzTime = utcToTz(props.autoGroupUpdatedTime.updatedDate);
      // setListUpdateTime(moment(tzTime).format("HH:mm"))
      setListUpdateTime(props.autoGroupUpdatedTime)
    }
  }, [props.autoGroupUpdatedTime])

  useEffect(() => {
    if (errorMessageInModal && errorMessageInModal.length > 0) {
      setMsgError(errorMessageInModal);
    }
  }, [errorMessageInModal]);

  // useEffect(() => {
  //   if (!idOfList && props.errorCode && isSubmitted) {
  //     setStyle({ borderColor: '#ff5c5c', background: '#ffdede' });
  //     setError(props.errorCode);
  //   } else if (idOfList) {
  //     setStyle({});
  //     setError('');
  //     setIsSubmitted(false);
  //   }
  // }, [props.errorCode, idOfList, isSubmitted]);


  const handleSubmitModal = () => {
    setIsSubmitted(true);
    const initParam = getInitGroupParams(groupMode);
    const groupIdIn = initParam.groupId;
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
      parseSearchConditions(searchConditionsIn, groupMode, props.group.productTradingListDetailId),
      groupMode
    );
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
    setShowModal(false);
    updateStateSession(FSActionTypeScreen.SetSession);
    const height = screen.height * 0.6;
    const width = screen.width * 0.6;
    const left = screen.width * 0.2;
    const top = screen.height * 0.2;
    const style = `width=${width},height=${height},left=${left},top=${top}`;
    window.open(`${props.tenant}/add-edit-my-list/${props.groupMode}`, '', style.toString());
    closeModal();
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

  const handleChangeGroupName = event => {
    setGroupName(event.target.value);
    if (event.target.value.length > 50) {
      setShowValidateName(translate("messages.ERR_COM_0025", { 0: 50 }))
      return;
    }
    setShowValidateName("");
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
    setSaveConditionSearch(lstFieldSearch)
  };

  const getModalName = () => {
    switch (groupMode) {
      case SHARE_GROUP_MODES.MODE_SWICH_GROUP_TYPE:
        return translate('sales.sharegroup.lbSwitchGroupType');
      case SHARE_GROUP_MODES.MODE_COPY_GROUP:
      case SHARE_GROUP_MODES.MODE_CREATE_GROUP:
      case SHARE_GROUP_MODES.MODE_CREATE_GROUP_LOCAL:
        return translate('sales.group.group-modal-add-edit-my-group.title');
      default:
        return translate('sales.group.group-modal-add-edit-my-group.edit_title');
    }
  };

  const parseJson = str => {
    let jsonStr = '';
    try {
      jsonStr = JSON.parse(str);
    } catch (e) {
      return '';
    }
    return jsonStr;
  };

  const getDataStatusControl = item => {
    if (saveConditionSearch && saveConditionSearch.length > 0) {
      const saveConditionSearchCopy = _.cloneDeep(saveConditionSearch);
      const dataStatus = saveConditionSearchCopy.filter(
        e => e.fieldId.toString() === item.fieldId.toString()
      );
      if (groupMode !== SHARE_GROUP_MODES.MODE_CREATE_GROUP) {
        if (dataStatus && dataStatus.length > 0) {
          const fieldValueJson = parseJson(dataStatus[0].fieldValue);
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
            if ([16, 5].includes(dataStatus[0].fieldType)) {
              dataStatus[0].fieldValue = fFieldValue
            } else {
              dataStatus[0].fieldValue = _.size(fFieldValue) > 0 ? fFieldValue['1'] : '';
            }
          }
        }

        console.log("dataStatus[0]", dataStatus[0])
        return dataStatus[0];
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
      return translate('sales.group.group-modal-add-edit-my-group.button-edit');
    } else if (groupMode.toString() === SHARE_GROUP_MODES.MODE_SWICH_GROUP_TYPE.toString()) {
      return translate('sales.sharegroup.btnChange');
    } else {
      return translate('sales.group.group-modal-add-edit-my-group.button-create');
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
    fieldLabel: translate('sales.group.group-modal-add-edit-my-group.group_type'),
    fieldItems: [
      {
        itemId: '1',
        itemLabel: translate('sales.group.group-modal-add-edit-my-group.radio-manual'),
        itemOrder: '1',
        isDefault: false
      },
      {
        itemId: '2',
        itemLabel: translate('sales.group.group-modal-add-edit-my-group.radio-auto'),
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
        if (listErrorWithoutParam.includes(element)) {
          errorMsg.push(translate('messages.' + element));
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
    ref.current && ref.current.setTags(tmpParticipantsType);
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

            <div className="modal-body style-3 fix-tag-auto-width-720" id={formId} >
              <div className="edit-popup-content-common popup-content padding-0 style-3 fix-height-shared-group" ref={dropBody}>
                <div className="user-popup-form">
                  {props.errorMessageInModal && props.errorMessageInModal.length > 0 && parseValidateError().length > 0 && (
                    <BoxMessage messageType={MessageType.Error} messages={parseValidateError()} />
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
                        {translate('sales.group.group-modal-add-edit-my-group.group-title')}
                        <span className="label-red">{translate('sales.group.group-modal-add-edit-my-group.required')}</span>
                      </label>
                      <div className={errorValidates.includes('productTradingListName') ? styleError : null}>
                        <input
                          className={disableChange ? 'input-normal disable' : 'input-normal'}
                          disabled={disableChange}
                          type="text"
                          placeholder={translate('sales.group.group-modal-add-edit-my-group.group-name-placeholder')}
                          value={groupName}
                          onChange={handleChangeGroupName}
                          autoFocus
                          ref={txtInputFocus}
                          onKeyDown={e => {
                            if (disableChange) {
                              e.preventDefault();
                            }
                          }}
                        ></input>
                        {errorValidates.includes('productTradingListName') && (
                          <div className="messenger">{validateItem('productTradingListName')}</div>
                        )}
                        <div className="messenger height-30" ><span className="text-danger" >{showValidateName}</span></div>
                      </div>
                    </div>
                    {groupMode.toString() === SHARE_GROUP_MODES.MODE_CREATE_GROUP.toString() ||
                      groupMode.toString() === SHARE_GROUP_MODES.MODE_EDIT_GROUP.toString() ||
                      groupMode.toString() === SHARE_GROUP_MODES.MODE_COPY_GROUP.toString() ? (
                        <div className="col-lg-6 form-group">
                          {props.group && (
                            <RadioBoxSwichMode
                              itemDataField={radioGroupTypeData}
                              handleSeclectValue={handleSwichAddMode}
                              isAutoGroup={props.group.listMode === LIST_MODE.AUTO}
                              isDisabled={disableChange}
                            />
                          )}
                        </div>
                      ) : (
                        <div className="col-lg-6 m-0-0-1000-0" ></div>
                      )}
                    <div className="col-lg-6 break-line form-group">
                      {isAutoGroup && (
                        <>
                          <div className="setting-search-conditions">
                            <label htmlFor="input-common">{translate('sales.group.group-modal-add-edit-my-group.auto-group-condition-search-title')}</label>
                            <button
                              type="button" // fix reload employee list when button is clicked
                              className={
                                !disableChange
                                  ? 'button-primary button-activity-registration'
                                  : 'button-primary button-activity-registration disable'
                              }
                              onClick={!disableChange && handleDisplaySetting}
                              autoFocus
                            >
                              {translate('sales.group.group-modal-add-edit-my-group.btn-setting-search-condition')}
                            </button>
                          </div>
                          <div className="search-conditions">
                            <p className="check-box-item">
                              <label className="icon-check">
                                <input
                                  type="checkbox"
                                  name=""
                                  checked={isOverWrite}
                                  onChange={!disableChange && handleCheckOveride}
                                  disabled={disableChange}
                                  autoFocus
                                />
                                <i></i>
                                {translate('sales.sharegroup.lbNoteForCheckBox')}
                              </label>
                            </p>

                            {shouldRender &&
                              listFieldSearch.map((item, index) => (
                                <>
                                  <DynamicControlField
                                    key={index}
                                    elementStatus={getDataStatusControl(item)}
                                    // isDocking={true}
                                    fieldInfo={item}
                                    updateStateElement={updateStateField}
                                    isDnDAddField={true}
                                    isDnDMoveField={true}
                                    errorInfo={validateSearch(index)}
                                    // errorInfo ={isItemHasError(item.fieldName)}
                                    isDisabled={showCustomField}
                                    className={'s'}
                                    moveFieldCard={onMoveField}
                                    belong={FIELD_BELONG.PRODUCT_TRADING}
                                  />
                                </>
                              ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {/* ---------- divider setting mode ---------- */}
              {showCustomField && (
                <DynamicSearchConditionListComponent
                  handleCloseSettingField={handleCloseSettingField}
                  handleUpdateSettingField={handleUpdateSettingField}
                  changeListFieldChosen={changeListFieldChosen}
                  customFieldsInfo={customFieldsInfo}
                  listFieldSearch={listFieldSearch}
                  iconFunction={iconFunction}
                  fieldBelong={FIELD_BELONG.PRODUCT_TRADING}
                />
              )}
            </div>
            <div className="user-popup-form-bottom">
              {disableChange && (
                <button className="button-blue button-form-register disable cursor-df" autoFocus type="button">
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

  const renderModalInSwichGroupTypeMode = () => {
    return (
      <>
        <div className="popup-esr2 popup-esr3 popup-employee-height-auto">
          <div className="popup-esr2-content">
            <button type="button" className="close" data-dismiss="modal">
              <span className="la-icon">
                <i className="la la-close" />
              </span>
            </button>
            <div className="modal-header">
              <div className="left">
                <div className="popup-button-back">
                  <button
                    type="button"
                    title=""
                    className="modal-heading-title"
                    onClick={
                      props.popout || showCustomField
                        ? handleBackPopup
                        : e => {
                          e.preventDefault();
                        }
                    }
                  >
                    <i
                      className={
                        props.popout || showCustomField
                          ? 'icon-small-primary icon-return-small'
                          : 'icon-small-primary icon-return-small disable'
                      }
                    ></i>
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
            <div className="popup-esr2-body">
              {props.errorValidates.length > 0 && parseValidateError().length > 0 && (
                <BoxMessage messageType={MessageType.Error} messages={parseValidateError()} />
              )}
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
                  placeholder={translate('sales.sharegroup.hintListParticipants')}
                  listActionOption={getListAction()}
                  onActionOptionTag={setListParticipantsType}
                  elementTags={groupMode.toString() === SHARE_GROUP_MODES.MODE_CREATE_GROUP.toString() ? null : groupParticipants}
                  validMsg={validateItem('groupParticipants')}
                />
              </div>
            </div>
          </div>
          <div className="align-center">
            {disableChange && <button type="button" className="button-blue button-form-register disable">{getTextButtomSubmit()} </button>}
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
          <br />
          <br />
        </div>
      </>
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
    } else if (groupMode.toString() === SHARE_GROUP_MODES.MODE_SWICH_GROUP_TYPE.toString()) {
      return renderModalInSwichGroupTypeMode();
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

const mapStateToProps = ({ applicationProfile, sharedGroupSales, salesControlSidebar }: IRootState) => ({
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
  localMenu: salesControlSidebar.localMenuData
});

const mapDispatchToProps = {
  handleInitGroupModal,
  handleSubmitGroupInfos,
  resetError,
  reset,
  startExecuting,
  getFieldInfoGroupShare,
  handleGetGeneralSetting
};

export default connect<IModalSharedGorupStateProps, IModalSharedGorupDispatchProps, IModalSharedGorupOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(ModalSalesMyGroupEdit);
