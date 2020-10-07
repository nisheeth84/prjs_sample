import React, { useState, useEffect, useRef } from 'react';
import { Modal } from 'reactstrap';
import FocusTrap from 'focus-trap-react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { translate, Storage } from 'react-jhipster';
import { IRootState } from '../../../reducers';
import { useDrop } from 'react-dnd';
import { FIELD_ITEM_TYPE_DND, DEFINE_FIELD_TYPE } from 'app/shared/layout/dynamic-form/constants'
import {
  getCustomFieldsInfo,
  handleGetDataEmployeeLogin
} from 'app/shared/layout/dynamic-form/group/dynamic-group-modal.reducer.ts';
import { startExecuting } from 'app/shared/reducers/action-executing';
import { getFieldNameElastic } from 'app/shared/util/elastic-search-util';
import { getServicesInfo } from 'app/shared/layout/dynamic-form/popup-search/popup-fields-search.reducer'
import DynamicControlField from '../control-field/dynamic-control-field';
import DynamicGroupRadioBoxSwitchMode from 'app/shared/layout/dynamic-form/group/dynamic-group-radio-box-switch-mode'
import BoxMessage, { MessageType } from '../../common/box-message'
import DynamicGroupSearchConditionField from 'app/shared/layout/dynamic-form/group/dynamic-group-search-condition-fields'
import TagAutoComplete from '../../common/suggestion/tag-auto-complete';
import { decodeUserLogin, toKatakana } from 'app/shared/util/string-utils';
import DialogDirtyCheck from 'app/shared/layout/common/dialog-dirty-check';

import { REQUEST } from 'app/shared/reducers/action-type.util';
import { TagAutoCompleteType, TagAutoCompleteMode } from 'app/shared/layout/common/suggestion/constants';
import { FIELD_BELONG, FIELD_SERVICE_NAME_EXTENSION } from 'app/config/constants';
import { timeUtcToTz } from 'app/shared/util/date-utils';

import {
  FSActionTypeScreen,
  GROUP_TYPE,
  GROUP_MODE_SCREEN,
  PARTICIPANT_TYPE,
  GROUP_MODE,
  CLASS_NAME_AREA,
} from 'app/shared/layout/dynamic-form/group/constants';
import { convertSpecialField } from 'app/shared/util/special-item';
import { DynamicGroupModalAction } from 'app/shared/layout/dynamic-form/group/dynamic-group-modal.reducer.ts';
import useEventListener from 'app/shared/util/use-event-listener';

/**
 * Share props in Parents
 */
interface IDynamicGroupModalProps extends StateProps, DispatchProps {
  iconFunction?: string,
  conditionSearch?: { fieldId, fieldType, isDefault, fieldName, fieldValue, searchType, searchOption, isSearchBlank, fieldOrder, timeZoneOffset, relationFieldId }[],
  handleCloseDynamicGroupModal?: (isUpdate, saveCondition?: { fieldType, isDefault, fieldName, fieldValue, searchType, searchOption }[]) => void,
  onSubmit?: (saveCondition: { fieldType, isDefault, fieldName, fieldValue, searchType, searchOption }[]) => void,
  // fieldSearchGroupInfos?: any,
  popout?: boolean,
  popoutParams?: any,
  groupMode?: number,
  groupId?: number,
  isAutoGroup?: boolean,
  groupMembers?: any,
  dataLayout?: any;

  listType?: any; // My or Share
  fieldBelong?: any; // for dataLayout
  labelTranslate?: any;
  pathOpenNewWindow?: any;

  classInfo?: string;

  handleSubmitListInfos?: (
    groupId,
    groupName,
    groupType,
    isAutoGroup,
    isOverWrite,
    groupMembersParam,
    listParticipantsParam,
    searchConditionsParam,
    updatedDate,
    groupMode: number
  ) => void,
  handleInitListModal?: (groupId, isOwnerGroup, isAutoGroup) => void,
  resetError?: () => void,
  reset?: () => void,

  action?: any,
  errorValidates?: any,
  group?: any,
  errorMessageInModal?: any,
  isSuccess?: any,
  rowIds?: any,
  listUpdateTime?: any,
  errorParams?: any,
  listParticipants?: any,
  listFieldSearch?: any,
  customFieldsInfo?: any,
  placeHolder?: any,
  isShowEmployeeOnly?: boolean,
}

/**
 * Component DynamicGroupModal
 * (MyGroup/SharedGroup/MyList/SharedList)
 * @param props
 */
const DynamicGroupModal: React.FC<IDynamicGroupModalProps> = (props) => {
  const ref = useRef(null);
  // const [first, setFirst] = useState(false);
  const [iconFunction, setIconFunction] = useState(props.iconFunction);
  // const [groupModeScreen, setGroupModeScreen] = useState(props.groupMode ? props.groupMode : props.popoutParams.groupMode);
  const [groupModeScreen, setGroupModeScreen] = useState(props.groupMode ? props.groupMode : null);

  const [showCustomField, setShowCustomField] = useState(false);
  const [customFieldsInfo, setCustomFieldsInfo] = useState([props.customFieldsInfo]);
  const [groupName, setGroupName] = useState('');
  const [showModal, setShowModal] = useState(true);
  const [forceCloseWindow, setForceCloseWindow] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [isAutoGroup, setisAutoGroup] = useState(false);
  const [isOverWrite, setIsOverWrite] = useState(true);
  const [listFieldSetting, setListFieldSetting] = useState([]);
  const [msgError, setMsgError] = useState([]);
  const [msgSuccess, setMsgSuccess] = useState("");
  const [fields, setFields] = useState([]);
  const [listFieldSearch, setListFieldSearch] = useState(props.listFieldSearch);
  const [saveConditionSearch, setSaveConditionSearch] = useState(props.conditionSearch ? _.cloneDeep(props.conditionSearch) : []);
  const [listParticipants, setGroupParticipants] = useState(props.listParticipants);
  const [errorValidates, setErrorValidates] = useState(props.errorValidates);
  const [errorMessageInModal, setErorMessageInModal] = useState(props.errorMessageInModal);
  const [lstListMembers, setLstListMembers] = useState(props.groupMembers);
  const [tags, setTags] = useState([]);
  const [isSuccess] = useState(false);
  const [oldListFieldSearch, setOldListFieldSearch] = useState(null);
  const [disableChange, setDisableChange] = useState(null);
  const [list, setList] = useState(null);
  const [listMembers, setlistMembers] = useState(props.groupMembers);
  const [listId, setGroupId] = useState(props.groupId);
  const [isDirtyCheck, setIsDirtyCheck] = useState(false);
  const [errorParams, setErrorParams] = useState(props.errorParams);
  const [listUpdateTime, setListUpdateTime] = useState(null);

  const txtInputFocus = useRef(null);
  const infoUserLogin = decodeUserLogin();
  const listErrorWithoutParam = ['ERR_COM_0050', 'ERR_COM_0059', 'ERR_EMP_0041'];

  const [listType, setListType] = useState(props.listType);
  const [fieldBelong, setFieldBelong] = useState(props.fieldBelong);
  const [labelTranslate, setLabelTranslate] = useState(props.labelTranslate);

  /**
   * Effect listType
   */
  useEffect(() => {
    if (props.listType) {
      setListType(props.listType);
    }
  }, [props.listType]);

  /**
   * Effect fieldBelong
   */
  useEffect(() => {
    if (props.fieldBelong) {
      setFieldBelong(props.fieldBelong);
    }
  }, [props.fieldBelong]);

  /**
   * Effect labelTranslate
   */
  useEffect(() => {
    if (props.labelTranslate) {
      setLabelTranslate(props.labelTranslate);
    }
  }, [props.labelTranslate]);

  useEffect(() => {
    if (!disableChange && txtInputFocus.current) {
      txtInputFocus.current.focus();
    }
  }, [disableChange]);

  /**
   * Radio Group Type Data
   */
  const radioGroupTypeData = {
    fieldName: 'radio',
    fieldLabel: `${translate(`global.group.${labelTranslate}.list_type`)}`,
    fieldItems: [
      {
        itemId: '1',
        itemLabel: `${translate(`global.group.${labelTranslate}.radio-manual`)}`,
        itemOrder: '1',
        isDefault: false
      },
      {
        itemId: '2',
        itemLabel: `${translate(`global.group.${labelTranslate}.radio-auto`)}`,
        itemOrder: '2',
        isDefault: true
      }
    ]
  };

  /**
 * Member permision
 */
  const PULL_DOWN_MEMBER_GROUP_PERMISSION = [
    {
      itemId: 1,
      itemLabel: `global.group.${labelTranslate}.permision.viewer`
    },
    {
      itemId: 2,
      itemLabel: `global.group.${labelTranslate}.permision.owner`
    }
  ];

  /**
   * Effect []
   */
  useEffect(() => {
    txtInputFocus && txtInputFocus.current && txtInputFocus.current.focus();
    return () => {
      props.reset();
    }
  }, []);

  useEffect(() => {
    if (_.toString(groupModeScreen) === GROUP_MODE_SCREEN.CREATE.toString() ||
      _.toString(groupModeScreen) === GROUP_MODE_SCREEN.CREATE_LOCAL.toString()) {
      const employeeIdLogin = infoUserLogin['custom:employee_id'];
      props.handleGetDataEmployeeLogin({ employeeId: employeeIdLogin, mode: "detail" });
    }
  }, []);


  useEffect(() => {
    if (props.employeeDataLogin && listType === GROUP_TYPE.SHARED) {
      const dataTags = props.employeeDataLogin;
      dataTags[`employeeId`] = parseInt(infoUserLogin['custom:employee_id'], 10);
      dataTags[`participantType`] = 2;
      setGroupParticipants([dataTags]);
      setTags([dataTags]);
      ref.current.setTags(_.cloneDeep([dataTags]));
    }
  }, [props.employeeDataLogin])

  /**
   * Handle Drop Body
   */
  const [, dropBody] = useDrop({
    accept: FIELD_ITEM_TYPE_DND.ADD_CARD,
    drop(item, monitor) {
      const didDrop = monitor.didDrop()
      if (didDrop) {
        return
      }
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
      isOverCurrent: monitor.isOver({ shallow: true }),
    }),
  })

  /**
   * Acion Select Tag
   * @param id
   * @param type
   * @param mode
   * @param listTag
   */
  const onActionSelectTag = (
    id: any,
    type: TagAutoCompleteType,
    mode: TagAutoCompleteMode,
    listTag: any[]
  ) => {
    const tmpListTags = listTag.map(el => {
      if (el.participantType) {
        return el;
      }
      return ({ ...el, participantType: PARTICIPANT_TYPE.OWNER })
    });
    setGroupParticipants(tmpListTags);
    ref.current.setTags(tmpListTags);
    setTags(tmpListTags);
  }

  /**
   * Handle Get list Action
   */
  const getListAction = () => {
    const tmpPullDownMemberGroupPermission = [];
    PULL_DOWN_MEMBER_GROUP_PERMISSION.forEach((e, idx) => {
      tmpPullDownMemberGroupPermission.push({ id: e.itemId, name: translate(e.itemLabel) });
    });
    return tmpPullDownMemberGroupPermission;
  }

  /**
   * Execute Dirty Check
   * @param action
   * @param cancel
   */
  const executeDirtyCheck = async (action: () => void, cancel?: () => void) => {
    if (isDirtyCheck) {
      await DialogDirtyCheck({ onLeave: action, onStay: cancel });
    } else {
      action();
    }
  };

  const getParticipants = (paticipant) => {
    let listParticipantsParam
    if (listType === GROUP_TYPE.SHARED) {
      if (fieldBelong === 16) {
        listParticipantsParam = paticipant.map((r, i) => (
          {
            employeeId: r.employeeId,
            departmentId: r.departmentId,
            groupId: r.groupId,
            participantType: parseInt(r.participantType, 10),
            listEmployeeDepartment: _.isArray(r.employeesDepartments) ? r.employeesDepartments : [],
            listEmployeeGroup: _.isArray(r.employeesGroups) ? r.employeesGroups : []
          }
        ))
      } else {
        listParticipantsParam = paticipant.map((r, i) => (
          {
            employeeId: r.employeeId,
            departmentId: r.departmentId,
            groupId: r.groupId,
            participantType: parseInt(r.participantType, 10)
          }
        ))
      }
      return listParticipantsParam
    } else if (listType === GROUP_TYPE.MY) {
      return null
    }
  }

  /**
   * Get Init Params
   * @param grpMode
   */
  const getInitGroupParams = (grpMode) => {
    const paticipant = tags;
    const groudIdParam = _.cloneDeep(listId);
    const listParticipantsParam = getParticipants(paticipant)

    switch (grpMode) {
      case GROUP_MODE_SCREEN.CREATE:
      case GROUP_MODE_SCREEN.CREATE_LOCAL:
      case GROUP_MODE_SCREEN.COPY:
        return {
          groupName: groupName === undefined ? '' : groupName,
          listType,
          isAutoGroup,
          isOverWrite,
          listMembers: lstListMembers,
          listParticipants: listParticipantsParam,
          searchConditions: []
        };
      case GROUP_MODE_SCREEN.EDIT:
      case GROUP_MODE_SCREEN.SWITCH_TYPE:
        return {
          listId: groudIdParam,
          groupName,
          listType,
          isAutoGroup,
          isOverWrite,
          listMembers: lstListMembers,
          listParticipants: listParticipantsParam,
          searchConditions: []
        };
      default:
        return null;
    }
  }

  /**
   * Update State Session
   * @param mode
   */
  const updateStateSession = (mode: FSActionTypeScreen) => {
    if (mode === FSActionTypeScreen.SetSession) {
      const saveObj = {
        groupName,
        groupModeScreen,
        isAutoGroup,
        isOverWrite,
        listFieldSearch,
        msgError,
        msgSuccess,
        fields,
        listParticipants,
        errorValidates,
        errorMessageInModal,
        customFieldsInfo,
        lstListMembers,
        listMembers,
        tags,
        listFieldSetting,
        list,
        listId,
        oldListFieldSearch,
        showCustomField,
        disableChange,
        iconFunction,
        errorParams,
        labelTranslate,
        fieldBelong,
        listType,
        listUpdateTime,
        saveConditionSearch,
        showModal,
        forceCloseWindow,
        shouldRender,
        isDirtyCheck,
      };
      Storage.local.set(DynamicGroupModal.name, _.cloneDeep(saveObj));
    } else if (mode === FSActionTypeScreen.GetSession) {
      const saveObj = _.cloneDeep(Storage.local.get(DynamicGroupModal.name));
      if (saveObj) {
        setGroupName(saveObj.groupName);
        setGroupModeScreen(saveObj.groupModeScreen);
        setisAutoGroup(saveObj.isAutoGroup);
        setIsOverWrite(saveObj.isOverWrite);
        setListFieldSearch(saveObj.listFieldSearch);
        setMsgError(saveObj.msgError);
        setMsgSuccess(saveObj.msgSuccess);
        setFields(saveObj.fields);
        setGroupParticipants(saveObj.listParticipants);
        setErrorValidates(saveObj.errorValidates);
        setErorMessageInModal(saveObj.errorMessageInModal);
        setCustomFieldsInfo(saveObj.customFieldsInfo);
        setLstListMembers(saveObj.lstListMembers);
        setlistMembers(saveObj.listMembers);
        setTags(saveObj.tags);
        setListFieldSetting(saveObj.listFieldSetting);
        setList(saveObj.list);
        setGroupId(saveObj.listId);
        setOldListFieldSearch(saveObj.oldListFieldSearch);
        setShowCustomField(saveObj.showCustomField);
        setDisableChange(saveObj.disableChange);
        setIconFunction(saveObj.iconFunction);
        setErrorParams(saveObj.errorParams);
        setLabelTranslate(saveObj.labelTranslate);
        setFieldBelong(saveObj.fieldBelong);
        setListType(saveObj.listType);
        setListUpdateTime(saveObj.listUpdateTime);
        setSaveConditionSearch(saveObj.saveConditionSearch);
        setShowModal(saveObj.showModal);
        setForceCloseWindow(saveObj.forceCloseWindow);
        setShouldRender(saveObj.shouldRender);
        setIsDirtyCheck(saveObj.isDirtyCheck);
      }
    } else if (mode === FSActionTypeScreen.RemoveSession) {
      Storage.local.remove(DynamicGroupModal.name);
    }
  }

  /**
   * Close Modal
   * @param isUpdate
   */
  const closeModal = (isUpdate?) => {
    props.resetError();
    props.handleCloseDynamicGroupModal(isUpdate);
    setShowCustomField(false);
    setListFieldSetting([]);
  };

  /**
   * Handle Close Modal
   */
  const handleCloseModal = () => {
    executeDirtyCheck(() => closeModal());
  }
  const renderListUpdateTime = () => {
    if (listUpdateTime) {
      return (
        <div className="row">
          <div className="col-lg-12 form-group">
            <label>{translate(`global.group.${labelTranslate}.list-update-time`, { 0: listUpdateTime })}</label>
          </div>
        </div>
      )
    }
    return null;
  }

  useEffect(() => {
    setListUpdateTime(timeUtcToTz(props.listUpdateTime));
  }, [props.listUpdateTime]);

  /**
   * Effect when Props Action
   */
  useEffect(() => {
    if (props.action === DynamicGroupModalAction.CreateUpdateSuccess) {
      if (props.popout) {
        window.opener.postMessage({
          type: FSActionTypeScreen.CreatUpdateSuccess,
          forceCloseWindow: true
        }, window.location.origin);
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

  /**
   * Effect when force Close Window
   */
  useEffect(() => {
    if (forceCloseWindow) {
      if (props.popout) {
        window.opener.postMessage({
          type: FSActionTypeScreen.CloseWindow,
          forceCloseWindow: true
        }, window.location.origin);
        Storage.session.set('forceCloseWindow', true);
        window.close();
      } else {
        closeModal();
      }
    }
  }, [forceCloseWindow]);

  /**
   * Effect when list Field Search
   */
  useEffect(() => {
    if (props.listFieldSearch && props.listFieldSearch.length > 0) {
      const newListFieldSearch = _.cloneDeep(props.listFieldSearch);
      const _fields = convertSpecialField(newListFieldSearch, props.dataLayout, fieldBelong);

      setListFieldSearch(_fields);
      setSaveConditionSearch(_.cloneDeep(_fields));
    }
  }, [props.listFieldSearch]);

  /**
   * Effect when group Participants
   */
  useEffect(() => {
    if (props.listParticipants && props.listParticipants.length > 0 && listType === GROUP_TYPE.SHARED) {
      setGroupParticipants(_.cloneDeep(props.listParticipants));
      setTags(_.cloneDeep(props.listParticipants));
      ref.current.setTags(_.cloneDeep(props.listParticipants));
    }
  }, [props.listParticipants]);

  /**
   * Effect when props group
   */
  useEffect(() => {
    if (props.group) {
      setList(props.group);
      setGroupName(props.group[`groupName`]);
      if (!_.isNil(props.group[`isOverWrite`])) {
        setIsOverWrite(props.group[`isOverWrite`]);
      }
      if (props.group[`isAutoGroup`]) {
        setisAutoGroup(props.group[`isAutoGroup`]);
      }
    }
  }, [props.group]);

  /**
   * Effect when props error Validates
   */
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

  /**
   * Effect errorMessageInModal
   */
  useEffect(() => {
    if (props.errorMessageInModal && props.errorMessageInModal.length > 0) {
      setErorMessageInModal(_.cloneDeep(props.errorMessageInModal));
    }
  }, [props.errorMessageInModal]);

  /**
   * Effect props customFieldsInfo
   */
  useEffect(() => {
    if (props.customFieldsInfo && props.customFieldsInfo.length > 0 && props.customFieldsInfo[0].fieldBelong === props.fieldBelong) {
      setCustomFieldsInfo(convertSpecialField(props.customFieldsInfo, props.dataLayout, props.fieldBelong));
      setListFieldSetting(convertSpecialField(props.customFieldsInfo, props.dataLayout, fieldBelong));
      const relativeFields = props.customFieldsInfo.filter(
        e =>
          _.toString(e.fieldType) === DEFINE_FIELD_TYPE.RELATION && !_.isNil(e.relationData)
          && !_.isNil(e.relationData.fieldBelong)
      );
      if (!relativeFields) {
        return;
      }
      const tmp = [];
      for (let i = 0; i < relativeFields.length; i++) {
        if (!relativeFields[i].relationData || !relativeFields[i].relationData.fieldBelong) {
          continue;
        }
        if (customFieldsInfo.length > 0 && customFieldsInfo.filter(o => o[`fieldBelong`] === relativeFields[i].relationData.fieldBelong).length > 0) {
          continue;
        }
        if (tmp.findIndex(o => o === relativeFields[i].relationData.fieldBelong) < 0) {
          tmp.push(relativeFields[i].relationData.fieldBelong);
        }
      }
      tmp.forEach(el => {
        props.getCustomFieldsInfo(el);
      });
    }
  }, [props.customFieldsInfo]);

  useEffect(() => {
    if (props.customFieldsInfoRelation && props.customFieldsInfoRelation.length > 0) {

      customFieldsInfo.push(
        ...props.customFieldsInfoRelation.filter(e => customFieldsInfo.findIndex(o => o[`fieldId`] === e.fieldId && e.fieldType !== DEFINE_FIELD_TYPE.RELATION) < 0)
      );
    }
  }, [props.customFieldsInfoRelation])

  /**
   * Effect []
   */
  useEffect(() => {
    props.getServicesInfo();
    if (props.popout) {
      updateStateSession(FSActionTypeScreen.GetSession);
      setShowModal(false);
      setShouldRender(true);
      setForceCloseWindow(false);
      updateStateSession(FSActionTypeScreen.RemoveSession);
      document.body.className = "wrap-employee modal-open";
    } else {
      setShowModal(true);
      setShowCustomField(false);
      setShouldRender(true);
      setSaveConditionSearch(props.conditionSearch);
    }
    return () => {
      document.body.className = document.body.className.replace('modal-open', '');
    }
  }, []);

  /**
   * Effect []
   */
  useEffect(() => {
    if (!props.popout && props.handleInitListModal) {
      props.handleInitListModal(props.groupId, null, true);
    }
    return () => { }
  }, []);

  /**
   * Effect errorMessageInModal
   */
  useEffect(() => {
    if (errorMessageInModal && errorMessageInModal.length > 0) {
      setMsgError(errorMessageInModal);
    }
  }, [errorMessageInModal]);

  const makeRelationSearchCondition = (saveCondition: any[]) => {
    if (!saveCondition || saveCondition.length < 1) {
      return saveConditionSearch;
    }
    const listFieldGroup = _.groupBy(
      saveCondition.filter(e => !_.isNil(e.relationFieldId) && e.relationFieldId > 0), 'relationFieldId');
    const tmp = saveCondition.filter(e => _.isNil(e.relationFieldId) || e.relationFieldId === 0);
    for (const prop in listFieldGroup) {
      if (!Object.prototype.hasOwnProperty.call(listFieldGroup, prop)) {
        continue;
      }
      let idx = 0;
      const field = listFieldGroup[prop][0];
      while (idx < tmp.length) {
        if (_.isArray(tmp[idx])) {
          if (tmp[idx][0].fieldOrder > field.fieldOrder) {
            break;
          }
        } else if (tmp[idx].fieldOrder > field.fieldOrder) {
          break;
        }
        idx++;
      }
      tmp.splice(idx, 0, listFieldGroup[prop]);
    }
    return tmp;
  };

  /**
   * Handle Submit Modal
   */
  const handleSubmitModal = () => {
    const initParam = getInitGroupParams(groupModeScreen);
    const listIdIn = initParam.listId;
    const groupNameIn = initParam.groupName;
    const groupTypeIn = initParam.listType;
    const isAutoGroupIn = initParam.isAutoGroup;
    const isOverWriteIn = initParam.isOverWrite;
    const listMembersIn = initParam.listMembers;
    const listParticipantsIn = initParam.listParticipants;
    let updatedDate = list && list.updatedDate;
    if (!props.group) {
      updatedDate = new Date();
    }
    const searchConditionArr = makeRelationSearchCondition(saveConditionSearch);
    let tmpConditions = [];
    if (searchConditionArr && listFieldSearch && searchConditionArr.length > 0 && listFieldSearch.length > 0 && isAutoGroup) {
      for (let i = 0; i < searchConditionArr.length; i++) {

        if (_.isArray(searchConditionArr[i]) && searchConditionArr[i].length > 0) {
          const tmpConditionsRelation = [];
          const fieldRelationSearch = customFieldsInfo.find(e => _.toString(e[`fieldId`]) === _.toString(searchConditionArr[i][0].relationFieldId))
          searchConditionArr[i].forEach((element, idx) => {
            if (
              !element.isSearchBlank &&
              (!element.fieldValue || element.fieldValue.length <= 0)
            ) {
              return;
            }
            const isArrayRelation = Array.isArray(element.fieldValue);
            let valueRelation = null;
            if (element.isSearchBlank) {
              valueRelation = '';
            } else if (isArrayRelation) {
              let jsonVal = element.fieldValue;
              if (
                jsonVal.length > 0 &&
                jsonVal[0] &&
                (Object.prototype.hasOwnProperty.call(jsonVal[0], 'from') ||
                  Object.prototype.hasOwnProperty.call(jsonVal[0], 'to'))
              ) {
                jsonVal = jsonVal[0];
              }
              valueRelation = JSON.stringify(jsonVal);
            } else {
              valueRelation = element.fieldValue.toString();
            }
            let fieldNameElastic = element.fieldName;
            if (!element.fieldName.includes(".")) {
              fieldNameElastic = getFieldNameElastic(element, FIELD_SERVICE_NAME_EXTENSION[fieldRelationSearch[`relationData`].fieldBelong]);
            }
            const searchTypeRelation = parseInt(element.searchType, 10);
            const searchModeDateRelation = element['searchModeDate'] !== 0 ? element['searchModeDate'] : undefined;
            tmpConditionsRelation.push({
              fieldId: element.fieldId,
              fieldType: element.fieldType,
              fieldLabel: element.fieldLabel,
              fieldName: fieldNameElastic,
              searchType: searchTypeRelation ? searchTypeRelation : searchModeDateRelation,
              searchOption: parseInt(element.searchOption, 10),
              isDefault: _.toString(element.isDefault),
              fieldValue: valueRelation,
              fieldOrder: element.fieldOrder,
              timeZoneOffset: element.timeZoneOffset
            });
          });

          if (fieldRelationSearch && tmpConditionsRelation.length > 0) {
            tmpConditions.push({
              fieldId: fieldRelationSearch[`fieldId`],
              searchType: 1,
              searchOption: 1,
              fieldValue: JSON.stringify(tmpConditionsRelation),
            });
          }

        } else {
          if (
            !searchConditionArr[i].isSearchBlank &&
            (!searchConditionArr[i].fieldValue || searchConditionArr[i].fieldValue.length <= 0)
          ) {
            continue;
          }
          const isArray = Array.isArray(searchConditionArr[i].fieldValue);
          let val = null;
          if (searchConditionArr[i].isSearchBlank) {
            val = '';
          } else if (isArray) {
            let jsonVal = searchConditionArr[i].fieldValue;
            if (
              jsonVal.length > 0 &&
              jsonVal[0] &&
              (Object.prototype.hasOwnProperty.call(jsonVal[0], 'from') ||
                Object.prototype.hasOwnProperty.call(jsonVal[0], 'to'))
            ) {
              jsonVal = jsonVal[0];
            }
            val = JSON.stringify(jsonVal);
          } else {
            val = searchConditionArr[i].fieldValue.toString();
          }
          const searchType = parseInt(searchConditionArr[i].searchType, 10);
          const searchModeDate = searchConditionArr[i]['searchModeDate'] !== 0 ? searchConditionArr[i]['searchModeDate'] : undefined;
          tmpConditions.push({
            fieldId: searchConditionArr[i].fieldId,
            searchType: searchType ? searchType : searchModeDate,
            searchOption: parseInt(searchConditionArr[i].searchOption, 10),
            fieldValue: val,
            fieldOrder: searchConditionArr[i].fieldOrder,
            timeZoneOffset: searchConditionArr[i].timeZoneOffset
          });
        }

      }
    } else {
      tmpConditions = [];
    }

    setErorMessageInModal([]);
    setErrorValidates([]);
    setErrorParams([]);
    props.handleSubmitListInfos(
      listIdIn,
      toKatakana(groupNameIn),
      groupTypeIn,
      isAutoGroupIn,
      isOverWriteIn,
      listMembersIn,
      listParticipantsIn,
      tmpConditions,
      updatedDate,
      groupModeScreen
    );
  }

  /**
   * Get Count Member Local Add
   */
  const getCountMemberLocalAdd = () => {
    return (listMembers && listMembers.length > 0) ? listMembers.length : 0;
  }

  /**
   * Handle Close Setting Field
   */
  const handleCloseSettingField = () => {
    setShowCustomField(false);
    setListFieldSetting([]);
    setDisableChange(false);
    const _oldListFieldSearch = convertSpecialField(oldListFieldSearch, props.dataLayout, fieldBelong);
    setListFieldSearch(_.cloneDeep(_oldListFieldSearch));
  };

  /**
   * Handle Display Setting
   */
  const handleDisplaySetting = () => {
    setOldListFieldSearch(_.cloneDeep(listFieldSearch));
    setShowCustomField(true);
    setDisableChange(true);
    setIsDirtyCheck(true);
  };

  /**
   * Handle Back Popup
   */
  const handleBackPopup = () => {
    if (showCustomField) {
      handleCloseSettingField();
    }
  }

  /**
   * Open New Window
   */
  const openNewWindow = () => {
    updateStateSession(FSActionTypeScreen.SetSession);
    setShowModal(false);
    const height = screen.height * 0.8;
    const width = screen.width * 0.8;
    const left = screen.width * 0.3;
    const top = screen.height * 0.3;
    const style = `width=${width},height=${height},left=${left},top=${top}`;
    window.open(`${props.tenant}/${props.pathOpenNewWindow}/${props.groupMode}`, '', style.toString());
    closeModal();
  }

  /**
   * Handle Swich Add Mode
   * @param value
   */
  const handleSwichAddMode = (value) => {
    setisAutoGroup(value.toString() === GROUP_MODE.AUTO.toString())
    setIsDirtyCheck(true);
    txtInputFocus.current.focus();
  }

  /**
   * Handle Check Overide
   * @param event
   */
  const handleCheckOveride = (event) => {
    setIsDirtyCheck(true);
    setIsOverWrite(event.target.checked);
  }

  /**
   * Handle List Name Change
   */
  const handleGroupNameChange = (event) => {
    setIsDirtyCheck(true);
    setGroupName(event.target.value);
  }

  const isFieldEqual = (field1: any, field2: any) => {
    if (_.isEqual(field1.fieldId, field2.fieldId) && _.isEqual(field1.relationFieldId, field2.relationFieldId)) {
      return true;
    }
    return false;
  };

  /**
   * Handle Update Setting Field
   */
  const handleUpdateSettingField = () => {
    setShowCustomField(false);
    setDisableChange(false);
    if (!listFieldSearch || listFieldSearch.length <= 0) {
      setDisableChange(false);
      return;
    }
    const objParams = [];
    listFieldSearch.forEach((el, idx) => {
      const obj = _.cloneDeep(el);
      obj.fieldOrder = idx + 1;
      let defaultLastValue = null;
      if (!_.isEmpty(saveConditionSearch)) {
        defaultLastValue = saveConditionSearch.find(e => isFieldEqual(e, el));
      }
      if (defaultLastValue) {
        obj.fieldValue = defaultLastValue.fieldValue;
      }
      objParams.push(obj);
    });
    setFields(objParams);
    setSaveConditionSearch(objParams);
  };
  /**
   * Change List Field Chosen
   * @param lstFieldSearch
   */
  const changeListFieldChosen = lstFieldSearch => {
    const _fieldsChose = convertSpecialField(_.cloneDeep(lstFieldSearch), props.dataLayout, fieldBelong);
    setListFieldSearch(_fieldsChose);
  };

  /**
   * Get Modal Name
   */
  const getModalName = () => {
    switch (groupModeScreen) {
      case GROUP_MODE_SCREEN.SWITCH_TYPE:
        return translate(`global.group.${labelTranslate}.title-switch`);
      case GROUP_MODE_SCREEN.COPY:
      case GROUP_MODE_SCREEN.CREATE:
      case GROUP_MODE_SCREEN.CREATE_LOCAL:
        return translate(`global.group.${labelTranslate}.title-add`);
      default:
        return translate(`global.group.${labelTranslate}.title-edit`);
    }
  }

  const parseJson = (str) => {
    let jsonStr = '';
    try {
      jsonStr = JSON.parse(str);
    } catch (e) {
      return '';
    }
    return jsonStr;
  }

  /**
   * Get Data Status Control
   * @param item
   */
  const getDataStatusControl = item => {
    if (saveConditionSearch && saveConditionSearch.length > 0) {
      const saveConditionSearchCopy = _.cloneDeep(saveConditionSearch);
      saveConditionSearchCopy['fieldValue'] = saveConditionSearchCopy['searchValue'];
      const dataStatus = saveConditionSearchCopy.filter(e => isFieldEqual(e, item));
      if (groupModeScreen !== GROUP_MODE_SCREEN.CREATE) {
        if (dataStatus && dataStatus.length > 0) {
          const fieldValueJson = parseJson(dataStatus[0].fieldValue);
          const fFieldValue = fieldValueJson ? fieldValueJson : dataStatus[0].fieldValue;
          if (dataStatus[0].fieldType.toString() === DEFINE_FIELD_TYPE.DATE || dataStatus[0].fieldType.toString() === DEFINE_FIELD_TYPE.DATE_TIME) {
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
          }
        }
        return dataStatus[0];
      }
    }
    return item;
  };

  /**
   * Update State Field
   * @param item
   * @param type
   * @param val
   */
  const updateStateField = (item, type, val) => {
    if (_.isNil(val) || val === '') {
      return;
    }
    const valueUpdate = _.cloneDeep(val);
    valueUpdate['fieldLabel'] = item.fieldLabel;
    valueUpdate['fieldItems'] = item.fieldItems;
    valueUpdate['fieldOrder'] = item.fieldOrder;
    valueUpdate['relationFieldId'] = item.relationFieldId;

    if (saveConditionSearch) {
      const indexField = saveConditionSearch.findIndex(e => isFieldEqual(e, item));
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

  /**
   * get Text Button Submit
   */
  const getTextButtomSubmit = () => {
    if (_.toString(groupModeScreen) === GROUP_MODE_SCREEN.EDIT.toString()) {
      return translate(`global.group.${labelTranslate}.button-edit`);
    } else if (_.toString(groupModeScreen) === GROUP_MODE_SCREEN.SWITCH_TYPE.toString()) {
      return translate(`global.group.${labelTranslate}.button-edit`);
    } else {
      return translate(`global.group.${labelTranslate}.button-create`);
    }
  };

  /**
   * Base URL
   */
  const baseUrl = window.location.origin.toString();
  const getIconFunction = () => {
    if (!props.iconFunction) {
      return <></>
    } else {
      return <div className="icon"><img src={baseUrl + `/content/images/${props.iconFunction}`} alt="" /></div>
    }
  }

  /**
   * onMoveField
   * @param fieldDropId
   * @param fieldDragId
   */
  const onMoveField = (fieldDrop, fieldDrag) => {
    const objectFieldInfos = _.cloneDeep(listFieldSearch);
    const dropIndex = objectFieldInfos.findIndex(e => JSON.stringify(e.fieldId) === JSON.stringify(fieldDrop.fieldId));
    const dropItem = objectFieldInfos.find(e => JSON.stringify(e.fieldId) === JSON.stringify(fieldDrop.fieldId));
    const dragIndex = objectFieldInfos.findIndex(e => JSON.stringify(e.fieldId) === JSON.stringify(fieldDrag.fieldId));

    if (dropIndex >= 0 && dragIndex >= 0) {
      if (dropIndex > dragIndex) {
        objectFieldInfos.splice(dragIndex, 0, dropItem);
        objectFieldInfos.splice(dropIndex + 1, 1)
      } else {
        objectFieldInfos.splice(dragIndex + 1, 0, dropItem);
        objectFieldInfos.splice(dropIndex, 1)
      }

      setListFieldSearch(objectFieldInfos);
    }
  };

  let styleError = '';
  if (!isSuccess) {
    styleError = 'input-common-wrap error';
  }

  /**
   * oarse Validate Error
   */
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

  /**
   * Validate Item
   * @param item
   */
  const validateItem = item => {
    const index = errorValidates.indexOf(item);
    if (index >= 0 && errorMessageInModal && errorMessageInModal.length > 0) {
      if (errorMessageInModal[index] === "ERR_COM_0060") {
        return translate('messages.' + errorMessageInModal[index], { 0: groupName })
      }
      return translate('messages.' + errorMessageInModal[index], errorParams[index]);
    }
    // else{
    return null;
    // }
  };

  /**
   * Set List ParticipantsType
   * @param id
   * @param type
   */
  const setListParticipantsType = (tagSelected, type) => {
    const tmpParticipantsType = _.cloneDeep(tags);
    tmpParticipantsType.forEach(tag => {
      if (tag.employeeId && tagSelected.employeeId && tag.employeeId === tagSelected.employeeId) {
        tag.participantType = type;
      } else if (tag.groupId && tagSelected.groupId && tag.groupId === tagSelected.groupId) {
        tag.participantType = type;
      } else if (tag.departmentId && tagSelected.departmentId && tag.departmentId === tagSelected.departmentId) {
        tag.participantType = type;
      }
    });
    setTags(tmpParticipantsType);
    setGroupParticipants(tmpParticipantsType);
    ref.current.setTags(tmpParticipantsType);
    setIsDirtyCheck(true);
  };

  const validateSearch = (rowIndex) => {
    props.errorValidates.forEach(
      (e, idx) => {
        if (e === "searchValue" && props.rowIds[idx] === rowIndex) {
          const errorInfo = {
            rowId: e.rowId,
            item: e.item,
            errorCode: errorMessageInModal[idx],
            errorMsg: translate('messages.' + props.errorMessageInModal[idx]),
            params: null
          };
          return errorInfo;
        }
      }
    );
    return null;
  }

  const getClassNameBody = (arena) => {
    if (listType === GROUP_TYPE.MY && !isAutoGroup && !props.popout) {
      return CLASS_NAME_AREA[arena]['MY_AND_MANUAL'];
    } else {
      return CLASS_NAME_AREA[arena][`DEFAULT`];
    }
  }

  const onBeforeUnload = (ev) => {
    if (props.popout && !Storage.session.get('forceCloseWindow')) {
      window.opener.postMessage({ type: FSActionTypeScreen.CloseWindow, 'forceCloseWindow': false }, window.location.origin);
    }
  };

  const onReceiveMessage = (ev) => {
    if (!props.popout) {
      if (ev.data.type === FSActionTypeScreen.CloseWindow) {
        updateStateSession(FSActionTypeScreen.GetSession);
        updateStateSession(FSActionTypeScreen.RemoveSession);
        if (ev.data.forceCloseWindow) {
          setShowModal(true);
        }
        // else {
        //   props.handleCloseDynamicGroupModal
        // }
      }
    }
  }


  if (props.popout) {
    useEventListener('beforeunload', onBeforeUnload);
  } else {
    useEventListener('message', onReceiveMessage);
  }

  /**
   * Render Modal Default
   */
  const renderModalDefault = () => {
    return (
      <div className={`${props.classInfo ? props.classInfo : ''} ${getClassNameBody('WRAP')}`} id="popup-esr"
        aria-hidden="true">
        <div className={showModal ? getClassNameBody('FORM') : "form-popup"}>
          <div className="modal-content">
            <div className="modal-header">
              <div className="left">
                <div className="popup-button-back">
                  <a title="" className="modal-heading-title"
                  // onClick={showCustomField ? handleBackPopup : e => {
                  //   e.preventDefault();
                  // }}
                  >
                    <i className="icon-small-primary icon-return-small disable"></i>
                    <span className="text">{getIconFunction()} {getModalName()}</span>
                  </a>
                </div>
              </div>
              <div className="right">
                {showModal && !props.popout && <a className="icon-small-primary icon-link-small" onClick={() => openNewWindow()}></a>}
                {showModal && !props.popout && <a onClick={handleCloseModal} className="icon-small-primary icon-close-up-small line"></a>}
              </div>
            </div>

            <div className={getClassNameBody('CONTENT')}>
              <div className="popup-content max-height-auto style-3" ref={dropBody}>
                <div className="user-popup-form">
                  {(props.errorMessageInModal && props.errorMessageInModal.length > 0 && parseValidateError().length > 0) &&
                    <BoxMessage messageType={MessageType.Error}
                      messages={parseValidateError()}
                    />}
                  {isAutoGroup ? renderListUpdateTime() : null}
                  <form>
                    <div className="row break-row">
                      {_.toString(groupModeScreen) === GROUP_MODE_SCREEN.CREATE_LOCAL.toString() &&
                        <>
                          <div className="col-lg-6 form-group break-line">
                            <div className="block-feedback block-feedback-blue">
                              {translate(`global.group.${labelTranslate}.lb-create-list-with-records`, { 0: getCountMemberLocalAdd() })}
                            </div>
                          </div>
                        </>
                      }
                      <div className="col-lg-6 form-group">
                        <label>
                          {translate(`global.group.${labelTranslate}.list-name-label`)}
                          <span className="label-red">{translate(`global.group.${labelTranslate}.required`)}</span>
                        </label>
                        <div className={(errorValidates && errorValidates.includes("customerListName")) ? styleError : null}>
                          <input
                            className={disableChange ? "input-normal disable" : "input-normal"}
                            disabled={disableChange}
                            type="text"
                            placeholder={translate(`global.group.${labelTranslate}.list-name-placeholder`)}
                            value={groupName}
                            onChange={handleGroupNameChange}
                            ref={txtInputFocus}
                            maxLength={50}
                          // onKeyDown={e => {
                          //   if (disableChange) {
                          //     e.preventDefault()
                          //   }
                          // }}
                          ></input>
                          {errorValidates && errorValidates.includes("customerListName") &&
                            <div className="messenger">{validateItem("customerListName")}</div>}
                        </div>
                      </div>
                      {(_.toString(groupModeScreen) === GROUP_MODE_SCREEN.CREATE.toString() ||
                        _.toString(groupModeScreen) === GROUP_MODE_SCREEN.EDIT.toString() ||
                        _.toString(groupModeScreen) === GROUP_MODE_SCREEN.COPY.toString()) ? (
                          <div className="col-lg-6 form-group">
                            <DynamicGroupRadioBoxSwitchMode
                              itemDataField={radioGroupTypeData}
                              handleSeclectValue={handleSwichAddMode}
                              isAutoList={isAutoGroup}
                              isDisabled={disableChange} />
                          </div>
                        ) : (
                          <div className="col-lg-6" style={{ margin: '0 0 1000 0' }}></div>
                        )
                      }
                      <div className="col-lg-6 break-line form-group">
                        {listType === GROUP_TYPE.SHARED &&
                          <div className="form-group">
                            <label>
                              {translate(`global.group.${labelTranslate}.lb-list-participants`)}
                              <span className="label-red">{translate(`global.group.${labelTranslate}.lb-require`)}</span>
                            </label>
                            <TagAutoComplete
                              id="paticipant"
                              type={TagAutoCompleteType.Employee}
                              modeSelect={TagAutoCompleteMode.Multi}
                              ref={ref}
                              onActionSelectTag={onActionSelectTag}
                              placeholder={translate(`global.group.${labelTranslate}.lb-list-participants-placeholder`)}
                              listActionOption={getListAction()}
                              onActionOptionTag={setListParticipantsType}
                              elementTags={listParticipants}
                              validMsg={validateItem("listParticipants")}
                              isDisabled={disableChange}
                              handleDirtyCheck={() => setIsDirtyCheck(true)}
                              inputClass={
                                disableChange ? "input-normal input-common2 one-item disable" : "input-normal input-common2 one-item"
                              }
                              onlyShowEmployees={props.isShowEmployeeOnly}
                            />
                          </div>}
                        {isAutoGroup &&
                          <>
                            <div className="setting-search-conditions">
                              <label htmlFor="input-common">{translate(`global.group.${labelTranslate}.lb-search-condition`)}</label>
                              <button
                                type="button"
                                className={
                                  !disableChange
                                    ? "button-primary button-activity-registration"
                                    : "button-primary button-activity-registration disable"
                                }
                                onClick={!disableChange && handleDisplaySetting}>
                                {translate(`global.group.${labelTranslate}.lb-setting-search`)}
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
                                    disabled={disableChange} /><i></i>
                                  {translate(`global.group.${labelTranslate}.lb-note-for-checkbox`)}
                                </label>
                              </p>

                              {shouldRender &&
                                listFieldSearch.map((item, index) => {
                                  if (item.relationFieldId > 0) {
                                    item['fieldRelation'] = _.find(customFieldsInfo, { fieldId: item.relationFieldId })
                                  }
                                  const key = `${item.fieldId}${item.fieldItems ? '-' + item.fieldItems.map(o => _.toString(o.itemId)).join('') : ''}-${_.get(item, 'fieldRelation.fieldId')}`
                                  return (
                                    !item.disableDisplaySearch &&
                                    _.toString(item.fieldType) !== DEFINE_FIELD_TYPE.RELATION &&
                                    <DynamicControlField
                                      key={key}
                                      belong={props.fieldBelong}
                                      elementStatus={getDataStatusControl(item)}
                                      fieldInfo={item}
                                      updateStateElement={updateStateField}
                                      isDnDAddField={true}
                                      isDnDMoveField={true}
                                      errorInfo={validateSearch(index)}
                                      isDisabled={showCustomField}
                                      className={"col-md-12 mb-3 pl-0 pr-0"}
                                      moveFieldCard={onMoveField}
                                    />
                                  )
                                }
                                )}
                            </div>
                          </>
                        }
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              {/* ---------- divider setting mode ---------- */}
              {showCustomField &&
                <DynamicGroupSearchConditionField
                  handleCloseSettingField={handleCloseSettingField}
                  handleUpdateSettingField={handleUpdateSettingField}
                  changeListFieldChosen={changeListFieldChosen}
                  customFieldsInfo={customFieldsInfo}
                  iconFunction={iconFunction}
                  listFieldSearch={listFieldSearch}
                  listFieldSetting={listFieldSetting}
                  fieldBelong={fieldBelong}
                  layoutData={props.dataLayout}
                  serviceInfo={props.serviceInfo}
                  placeHolder={props.placeHolder}
                />
              }
            </div>
            <div className="user-popup-form-bottom">
              {disableChange && (
                <a style={{ cursor: 'default' }} className="button-blue button-form-register disable">
                  {getTextButtomSubmit()}
                </a>
              )}
              {!disableChange && (
                <button
                  type="button"
                  onClick={() => {
                    setDisableChange(true);
                    handleSubmitModal();
                  }}
                  className="button-blue button-form-register "
                >
                  {getTextButtomSubmit()}
                </button>
              )}
            </div>
          </div>
        </div>
      </div >
    )
  }

  /**
   * Render Modal InSwich List Type Mode
   */
  const renderModalInSwichListTypeMode = () => {
    return (
      <>
        <div className={`popup-esr2 popup-esr3 popup-employee-height-auto ${props.classInfo ? props.classInfo : ''}`}>
          <div className="popup-esr2-content">
            <button type="button" className="close" data-dismiss="modal">
              <span className="la-icon">
                <i className="la la-close" />
              </span>
            </button>
            <div className="modal-header">
              <div className="left">
                <div className="popup-button-back">
                  <a title="" className="modal-heading-title"
                    onClick={props.popout || showCustomField ? handleBackPopup : e => {
                      e.preventDefault()
                    }}>
                    <i
                      className={props.popout || showCustomField
                        ? "icon-small-primary icon-return-small"
                        : "icon-small-primary icon-return-small disable"
                      }></i>
                    <span className="text">
                      {getIconFunction()} {getModalName()}
                    </span>
                  </a>
                </div>
              </div>
              <div className="right">
                {showModal && <a className="icon-small-primary icon-link-small" onClick={() => openNewWindow()}></a>}
                {showModal &&
                  <a onClick={handleCloseModal} className="icon-small-primary icon-close-up-small line"></a>}
              </div>
            </div>
            <div className="popup-esr2-body">
              {(props.errorValidates.length > 0 && parseValidateError().length > 0) && (
                <BoxMessage messageType={MessageType.Error}
                  messages={parseValidateError()}
                />
              )}
              <div className="form-group">
                <label>
                  {translate(`global.group.${labelTranslate}.lb-list-participants`)}
                  <span className="label-red">{translate(`global.group.${labelTranslate}.lb-require`)}</span>
                </label>
                <TagAutoComplete
                  id="paticipant"
                  type={TagAutoCompleteType.Employee}
                  modeSelect={TagAutoCompleteMode.Multi}
                  ref={ref}
                  onActionSelectTag={onActionSelectTag}
                  placeholder={translate(`global.group.${labelTranslate}.lb-list-participants-placeholder`)}
                  listActionOption={getListAction()}
                  onActionOptionTag={setListParticipantsType}
                  elementTags={listParticipants}
                  handleDirtyCheck={() => setIsDirtyCheck(true)}
                  validMsg={validateItem("listParticipants")}
                  onlyShowEmployees={props.isShowEmployeeOnly}
                />
              </div>
            </div>
          </div>
          <div className="align-center">
            {disableChange && <a className="button-blue button-form-register ">{getTextButtomSubmit()} </a>}
            {!disableChange && (
              <button
                type="button"
                onClick={() => {
                  setDisableChange(true);
                  handleSubmitModal();
                }}
                className="button-blue button-form-register ">
                {getTextButtomSubmit()}
              </button>
            )}
          </div>
          <br /><br />
        </div>
      </>
    );
  }

  const renderComponentInputSearch = () => {
    if (_.toString(groupModeScreen) === _.toString(GROUP_MODE_SCREEN.CREATE)
      || _.toString(groupModeScreen) === _.toString(GROUP_MODE_SCREEN.CREATE_LOCAL)
      || _.toString(groupModeScreen) === GROUP_MODE_SCREEN.EDIT.toString()
      || _.toString(groupModeScreen) === GROUP_MODE_SCREEN.COPY.toString()) {
      return renderModalDefault();
    } else if (_.toString(groupModeScreen) === GROUP_MODE_SCREEN.SWITCH_TYPE.toString()) {
      return renderModalInSwichListTypeMode();
    }
    return <></>;
  }

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
          {renderComponentInputSearch()}
        </>
      )
    } else {
      return <></>;
    }
  }
}

const mapStateToProps = ({ dynamicGroupModalState, applicationProfile, popupFieldsSearch }: IRootState) => ({
  customFieldsInfoRelation: dynamicGroupModalState.customFieldsInfoRelation,
  employeeDataLogin: dynamicGroupModalState.employeeDataLogin,
  tenant: applicationProfile.tenant,
  serviceInfo: popupFieldsSearch.servicesInfo,
});

const mapDispatchToProps = {
  handleGetDataEmployeeLogin,
  startExecuting,
  getCustomFieldsInfo,
  getServicesInfo,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DynamicGroupModal);
