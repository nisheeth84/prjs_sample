import React, { useState, useEffect } from 'react';
import { Modal } from 'reactstrap';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Storage, translate } from 'react-jhipster';
import DynamicControlField from '../../../shared/layout/dynamic-form/control-field/dynamic-control-field';
import { IRootState } from 'app/shared/reducers';
import useEventListener from 'app/shared/util/use-event-listener';
import { handleInitializeGroupModal, handleCreateGroup, handleUpdateGroup, GroupModalAction, reset, ACTION_TYPES } from './employee-group-modal.reducer';
import DynamicSearchConditionListComponent from '../../../shared/layout/dynamic-form/list/dynamic-search-condition-list';
import DialogDirtyCheck from 'app/shared/layout/common/dialog-dirty-check';
import { useDrop } from 'react-dnd';
import { FIELD_ITEM_TYPE_DND, DEFINE_FIELD_TYPE } from 'app/shared/layout/dynamic-form/constants';
import { MY_GROUP_MODES } from '../constants';
import { startExecuting } from 'app/shared/reducers/action-executing';
import { REQUEST } from 'app/shared/reducers/action-type.util';
// import { SEARCH_TYPE, SEARCH_OPTION, FIELD_BELONG } from 'app/config/constants';
import { FIELD_BELONG } from 'app/config/constants';
import { convertSpecialFieldEmployee } from '../list/special-render/special-render';
import BoxMessage, { MessageType } from 'app/shared/layout/common/box-message';

export enum FSActionTypeScreen {
  None,
  RemoveSession,
  SetSession,
  GetSession,
  CloseWindow,
  Search
}

const GROUP_TYPE = {
  MY_GROUP: '1',
  SHARE_GROUP: '2'
};

const SUB_GROUP_TYPE = {
  MANUAL: '1',
  AUTO: '2'
};

const initialGroup = {
  groupName: '',
  isAutoGroup: false,
  isOverWrite: false
};

interface IAddEditMyGroupModalDispatchProps {
  reset;
  handleInitializeGroupModal;
  handleCreateGroup;
  handleUpdateGroup;
}

interface IAddEditMyGroupModalStateProps {
  tenant;
  modalAction: any;
  customFields: any;
  group: any;
  searchConditions: any;
  errorValidates: any;
  listUpdateTime: any;
}

interface IAddEditMyGroupModalOwnProps {
  iconFunction?: string;
  popout?: boolean;
  sideBarCurrentId?: number;
  myGroupModalMode: any;
  onCloseAddEditMyGroup?: (isSubmitSuccess: boolean) => void;
  isAutoGroup: boolean;
  employeeLayout?: any;
}

type IAddEditMyGroupModalProps = IAddEditMyGroupModalDispatchProps & IAddEditMyGroupModalStateProps & IAddEditMyGroupModalOwnProps;

const AddEditMyGroupModal: React.FC<IAddEditMyGroupModalProps> = props => {
  const [iconFunction, setIconFunction] = useState(props.iconFunction);
  const [conditionSearch, setConditionSearch] = useState([]);

  const [first, setFirst] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const [showCustomField, setShowCustomField] = useState(false);
  const [saveConditionSearch, setSaveConditionSearch] = useState([]);
  const [listFieldSearch, setListFieldSearch] = useState([]);
  const [listFieldSetting, setListFieldSetting] = useState([]);
  const [customFieldsInfo, setCustomFieldsInfo] = useState([]);

  const [forceCloseWindow, setForceCloseWindow] = useState(false);

  const [modalMode, setModalMode] = useState(props.myGroupModalMode);
  const [isOverWrite, setIsOverWrite] = useState(true);
  const [groupType, setGroupType] = useState(null);
  const [groupName, setGroupName] = useState('');
  const [isAutoGroup, setIsAutoGroup] = useState(false);
  const [isFirstChangeAuto, setIsFirstChangeAuto] = useState(false);
  const [fields, setFields] = useState([]);
  const [updatedDate, setUpdatedDate] = useState(null);
  const [groupId, setGroupId] = useState(null);
  const [listUpdateTime, setListUpdateTime] = useState(null);
  const [initialGroupData, setInitialGroupData] = useState(initialGroup);
  const [errorValidates, setErrorValidates] = useState(props.errorValidates);

  const changeListFieldChosen = (fieldList: any) => {
    const _fieldsChose = convertSpecialFieldEmployee(_.cloneDeep(fieldList), props.employeeLayout);
    setListFieldSearch(_fieldsChose);
  };

  const updateStateSession = (mode: FSActionTypeScreen) => {
    if (mode === FSActionTypeScreen.SetSession) {
      Storage.local.set(AddEditMyGroupModal.name, {
        conditionSearch,
        first,
        showCustomField,
        saveConditionSearch,
        listFieldSearch,
        listFieldSetting,
        fields,
        customFieldsInfo,
        groupType,
        groupName,
        isAutoGroup,
        isFirstChangeAuto,
        modalMode,
        isOverWrite,
        updatedDate,
        groupId,
        initialGroupData,
        errorValidates,
        iconFunction
      });
    } else if (mode === FSActionTypeScreen.GetSession) {
      const saveObj = Storage.local.get(AddEditMyGroupModal.name);
      if (saveObj) {
        setConditionSearch(saveObj.conditionSearch);
        setFirst(saveObj.first);
        setShowCustomField(saveObj.showCustomField);
        if (saveObj.saveConditionSearch && saveObj.saveConditionSearch.length > 0) {
          setSaveConditionSearch(saveObj.saveConditionSearch);
        } else {
          setSaveConditionSearch(saveObj.conditionSearch);
        }
        setListFieldSearch(saveObj.listFieldSearch);
        setListFieldSetting(saveObj.listFieldSetting);
        setFields(saveObj.fields);
        setCustomFieldsInfo(saveObj.customFieldsInfo);
        setGroupType(saveObj.groupType);
        setGroupName(saveObj.groupName);
        setIsAutoGroup(saveObj.isAutoGroup);
        setIsFirstChangeAuto(isFirstChangeAuto);
        setModalMode(saveObj.modalMode);
        setIsOverWrite(saveObj.isOverWrite);
        setUpdatedDate(saveObj.updatedDate);
        setGroupId(saveObj.groupId);
        setInitialGroupData(saveObj.initialGroupData);
        setErrorValidates(saveObj.errorValidates);
        setIconFunction(saveObj.iconFunction);
      }
    } else if (mode === FSActionTypeScreen.RemoveSession) {
      Storage.local.remove(AddEditMyGroupModal.name);
    }
  };

  /**
   * Set drop area
   */
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

  const getErrorInfo = fieldName => {
    if (!errorValidates) return null;
    let errorInfo = null;
    errorValidates.forEach(elem => {
      if (elem.item === fieldName) {
        const errorTmp = {};
        errorTmp['rowId'] = elem.rowId;
        errorTmp['item'] = elem.item;
        errorTmp['errorCode'] = elem.errorCode;
        errorTmp['params'] = elem.params ? elem.params : null;
        errorInfo = errorTmp;
      }
    });
    return errorInfo;
  };
  const parseSearchConditions = (data, isDirty = false, isInit = false) => {
    if (!data || !data.length) return null;
    const tmpConditions = [];
    data.map(item => {
      let val = [];
      if (item.isSearchBlank) {
        const _result = {
          fieldId: parseInt(item.fieldId, 0),
          searchType: null,
          searchOption: null,
          fieldOrder: parseInt(item.fieldOrder, 0),
          searchValue: [{ key: '1', value: null }]
        };
        tmpConditions.push(_result);
        return;
      }
      if(!item.isSearchBlank && (_.isNil(item.fieldValue) || item.fieldValue === "")) {
          return;
        }
      if (Array.isArray(item.fieldValue)) {
        item.fieldValue.forEach((element, idx) => {
          if ((item.fieldType.toString() === DEFINE_FIELD_TYPE.NUMERIC.toString()
               || item.fieldType.toString() === DEFINE_FIELD_TYPE.DATE_TIME.toString()
               || item.fieldType.toString() === DEFINE_FIELD_TYPE.DATE.toString()
               || item.fieldType.toString() === DEFINE_FIELD_TYPE.TIME.toString())) {
            val.push({ key: 'from', value: element.from });
            val.push({ key: 'to', value: element.to });
          } else {
            val.push({ key: idx.toString(), value: element });
          }
        });
      } else {
        if (isInit && item.fieldValue) {
          const tmpData = JSON.parse(item.fieldValue);
          val = tmpData;
        } else {
          val.push({ key: '1', value: item.fieldValue });
        }
      }
      let result = {
        fieldId: parseInt(item.fieldId, 0),
        searchType: parseInt(item.searchType, 0) || item && item.searchModeDate,
        searchOption: parseInt(item.searchOption, 0),
        fieldOrder: parseInt(item.fieldOrder, 0),
        searchValue: val
      };
      if (isDirty) {
        const tmp = {
          fieldType: parseInt(item.fieldType, 0)
        };
        result = { ...result, ...tmp };
      }
      tmpConditions.push(result);
    });
    return tmpConditions;
  };

  const isChangeInputEdit = () => {
    if (
      groupName !== initialGroupData.groupName ||
      isAutoGroup !== initialGroupData.isAutoGroup
    ) {
      return true;
    }
    if (conditionSearch.length !== saveConditionSearch.length) return true;
    const parsedSearchConditions = parseSearchConditions(conditionSearch, true, true);
    const parsedSaveSearchConditions = parseSearchConditions(saveConditionSearch, true);
    if (JSON.stringify(parsedSearchConditions) !== JSON.stringify(parsedSaveSearchConditions)) {
      return true;
    }
    return false;
  };

  const executeDirtyCheck = async (action: () => void, cancel?: () => void) => {
    if (isChangeInputEdit()) {
      await DialogDirtyCheck({ onLeave: action, onStay: cancel });
    } else {
      action();
    }
  };

  const handleClosePopup = () => {
    executeDirtyCheck(() => {
      setShowCustomField(false);
      setListFieldSearch([]);
      setListFieldSetting([]);
      if (props.onCloseAddEditMyGroup) {
        props.onCloseAddEditMyGroup(false);
      }
    });
  };

  const handleBackPopup = () => {
    if (props.popout) {
      updateStateSession(FSActionTypeScreen.SetSession);
      setForceCloseWindow(true);
    } else {
      handleClosePopup();
    }
  };

  const handleDisplaySetting = () => {
    setShowCustomField(true);
    const _fields = convertSpecialFieldEmployee(saveConditionSearch, props.employeeLayout);
    setListFieldSearch(_fields);
  };

  const handleUpdateSettingField = () => {
    setShowCustomField(false);
    if (!listFieldSearch || listFieldSearch.length <= 0) {
      setListFieldSearch([])
      setSaveConditionSearch([])
      return;
    }
    const objParams = [];
    listFieldSearch.forEach((el, idx) => {
      const obj = _.cloneDeep(el);
      obj.fieldOrder = idx + 1;
      objParams.push(obj);
    });
    setSaveConditionSearch(objParams);
  };

  const handleCloseSettingField = () => {
    setShowCustomField(false);
    setListFieldSearch([]);
    setListFieldSetting([]);
  };

  const openNewWindow = () => {
    setShowModal(false);
    updateStateSession(FSActionTypeScreen.SetSession);
    const height = screen.height * 0.6;
    const width = screen.width * 0.6;
    const left = screen.width * 0.2;
    const top = screen.height * 0.2;
    const style = `width=${width},height=${height},left=${left},top=${top}`;
    window.open(`${props.tenant}/add-edit-my-group`, '', style.toString());
  };

  const updateStateField = (item, type, val) => {
    console.log({item, type, val});

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

  const parseJson = (str) => {
    let jsonStr = '';
    try {
      jsonStr = JSON.parse(str);
    } catch (e) {
      return '';
    }
    return jsonStr;
  }

  const getDataStatusControl = item => {
    if (saveConditionSearch && saveConditionSearch.length > 0) {
      const saveConditionSearchCopy = _.cloneDeep(saveConditionSearch);
      const dataStatus = saveConditionSearchCopy.filter(e => e.fieldId.toString() === item.fieldId.toString());
      if (modalMode !== MY_GROUP_MODES.MODE_CREATE_GROUP) {
        if (dataStatus && dataStatus.length > 0) {
          const fieldValueJson = parseJson(dataStatus[0].fieldValue);
          const fFieldValue = fieldValueJson ? fieldValueJson : dataStatus[0].fieldValue;
          if (dataStatus[0].fieldType === 6) {
            if (Array.isArray(fFieldValue) && fFieldValue.length > 0) {
              dataStatus[0].dateFrom = fFieldValue[0] && fFieldValue[0].from;
              dataStatus[0].dateTo = fFieldValue[0] && fFieldValue[0].to;
              return dataStatus[0];
            } else {
              dataStatus[0].dateFrom = fFieldValue && fFieldValue.from ? fFieldValue.from : null;
              dataStatus[0].dateTo = fFieldValue && fFieldValue.to ? fFieldValue.to : null;
              return dataStatus[0];
            }
          }
          if (Array.isArray(fFieldValue) && fFieldValue.length > 0) {
            // const value = {fFieldValue[0]}
            dataStatus[0].fieldValue = fFieldValue;
          }
          else if (fFieldValue && fFieldValue.length > 0 && fFieldValue.value) {
            dataStatus[0].fieldValue = fFieldValue.value;
          } else if (fFieldValue && typeof fFieldValue === 'object') {
            dataStatus[0].fieldValue = _.size(fFieldValue) > 0 ? fFieldValue['1'] : '';
          }
        }
        return dataStatus[0];
      }
    }
    return item;
  };

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

  const onBeforeUnload = ev => {
    if (props.popout && !Storage.session.get('forceCloseWindow')) {
      window.opener.postMessage({ type: FSActionTypeScreen.CloseWindow, forceCloseWindow: false }, window.location.origin);
    }
  };

  const onReceiveMessage = ev => {
    if (!props.popout) {
      if (ev.data.forceCloseWindow) {
        props.onCloseAddEditMyGroup(true);
      } else {
        props.onCloseAddEditMyGroup(false);
      }
    }
  };

  const renderListUpdateTime = () => {
    if (listUpdateTime) {
      return (
        <div className="row">
          <div className="col-lg-12 form-group">
            <label>{translate("employees.group.group-modal-add-edit-my-group.list-update-time", { 0: listUpdateTime })}</label>
          </div>
        </div>
      )
    }
    return <></>;
  }

  if (props.popout) {
    useEventListener('beforeunload', onBeforeUnload);
  } else {
    useEventListener('message', onReceiveMessage);
  }

  const handleOptionChange = event => {
    setGroupType(event.target.value);
    if (event.target.value === SUB_GROUP_TYPE.AUTO && !isFirstChangeAuto) {
      setIsFirstChangeAuto(true);
    }
  };

  const handleGroupNameChange = event => {
    setGroupName(event.target.value);
  };

  const handleSubmit = () => {
    const overWriteValue = groupType === SUB_GROUP_TYPE.MANUAL ? false : isOverWrite;
    const submitConditions = saveConditionSearch.filter(
      item =>
        (item.fieldValue && (typeof item.fieldValue === 'string' ? item.fieldValue.trim().length > 0 : item.fieldValue.length > 0)) ||
        item.isSearchBlank === true
    );
    if (modalMode === MY_GROUP_MODES.MODE_CREATE_GROUP || modalMode === MY_GROUP_MODES.MODE_COPY_GROUP) {
      startExecuting(REQUEST(ACTION_TYPES.CREATE_GROUP));
      props.handleCreateGroup(
        groupName,
        GROUP_TYPE.MY_GROUP,
        isAutoGroup,
        overWriteValue,
        null,
        null,
        parseSearchConditions(submitConditions)
      );
    } else {
      startExecuting(REQUEST(ACTION_TYPES.UPDATE_GROUP));
      props.handleUpdateGroup(
        groupId,
        groupName,
        GROUP_TYPE.MY_GROUP,
        isAutoGroup,
        overWriteValue,
        updatedDate,
        parseSearchConditions(submitConditions)
      );
    }
  };

  useEffect(() => {
    if (forceCloseWindow) {
      if (props.popout) {
        window.opener.postMessage({ type: FSActionTypeScreen.CloseWindow, forceCloseWindow: true }, window.location.origin);
        Storage.session.set('forceCloseWindow', true);
        window.close();
      } else {
        handleClosePopup();
      }
    }
  }, [forceCloseWindow]);

  useEffect(() => {
    if (props.modalAction === GroupModalAction.Success) {
      if (props.popout) {
        window.opener.postMessage({ type: FSActionTypeScreen.Search, forceCloseWindow: true }, window.location.origin);
        Storage.session.set('forceCloseWindow', true);
        window.close();
      } else {
        updateStateSession(FSActionTypeScreen.RemoveSession);
        props.onCloseAddEditMyGroup(true);
      }
    }
  }, [props.modalAction]);

  useEffect(() => {
    if (isFirstChangeAuto) props.handleInitializeGroupModal(props.sideBarCurrentId || null, false, true);
  }, [isFirstChangeAuto]);

  useEffect(() => {
    if (props.customFields && props.customFields.length > 0) {
      const customFields = [];
      props.customFields.map(elm => {
        if(elm.fieldType.toString() !== DEFINE_FIELD_TYPE.TAB.toString() && elm.fieldType.toString() !== DEFINE_FIELD_TYPE.TITLE.toString()) {
          customFields.push(elm);
        }
      });
      setListFieldSetting(customFields);
      setCustomFieldsInfo(customFields);
    }
  }, [props.customFields]);

  useEffect(() => {
    if (groupType === SUB_GROUP_TYPE.AUTO) {
      setIsAutoGroup(true);
    } else {
      setIsAutoGroup(false);
    }
  }, [groupType]);

  useEffect(() => {
    if (props.searchConditions && props.customFields) {
      const conditions = [];
      props.searchConditions.forEach(e => {
        const filters = props.customFields.filter(item => item.fieldId.toString() === e.fieldId.toString());
        if (filters.length > 0) {
          const jsonValue = JSON.parse(e.searchValue);
          const isSearchBlank = !(jsonValue['1'] && jsonValue['1'].length > 0);
          const tmp = {
            fieldName: filters[0].fieldName,
            fieldLabel: filters[0].fieldLabel,
            fieldType: filters[0].fieldType,
            fieldItems: filters[0].fieldItems,
            fieldValue: e.searchValue,
            searchOption: e.searchOption && e.searchOption.toString(),
            searchType: e.searchType && e.searchType.toString(),
            isSearchBlank
          };
          e = { ...e, ...tmp };
          conditions.push(e);
        }
      });

      const _fieldsCondition = convertSpecialFieldEmployee(conditions, props.employeeLayout);
      _fieldsCondition.forEach(item => {
        const searchValue = [];
        item.isSearchBlank = true;
        if (!_.isEmpty(JSON.parse(item.searchValue))) {
          item.isSearchBlank = false;
        }
        const data = _.toArray(JSON.parse(item.searchValue));
        data.forEach((el, idx) => {
          searchValue.push(data[idx])
        })
        item.fieldValue = searchValue;
      });
      setConditionSearch(_fieldsCondition);
      setSaveConditionSearch(_.cloneDeep(_fieldsCondition));
    }
  }, [props.searchConditions, props.customFields]);

  useEffect(() => {
    if ((modalMode === MY_GROUP_MODES.MODE_EDIT_GROUP || modalMode === MY_GROUP_MODES.MODE_COPY_GROUP) && props.group && !isFirstChangeAuto) {
      setGroupName(props.group.groupName);
      setIsAutoGroup(props.group.isAutoGroup);
      setGroupType(props.group.isAutoGroup ? SUB_GROUP_TYPE.AUTO : SUB_GROUP_TYPE.MANUAL);
      setIsOverWrite(props.group.isOverWrite);
      setUpdatedDate(props.group.updatedDate);
      setInitialGroupData({
        groupName: props.group.groupName,
        isAutoGroup: props.group.isAutoGroup,
        isOverWrite: props.group.isOverWrite
      });
    }
  }, [props.group]);

  useEffect(() => {
    setListUpdateTime(props.listUpdateTime);
  }, [props.listUpdateTime]);

  useEffect(() => {
    setErrorValidates(props.errorValidates);
  }, [props.errorValidates]);

  useEffect(() => {
    if (props.popout) {
      document.body.className = 'wrap-card modal-open';
      updateStateSession(FSActionTypeScreen.GetSession);
      setShowModal(false);
      setForceCloseWindow(false);
    } else {
      setFirst(true);
      setShowModal(true);
      setShowCustomField(false);
      setModalMode(props.myGroupModalMode);
      if (props.myGroupModalMode !== MY_GROUP_MODES.MODE_CREATE_GROUP && props.sideBarCurrentId) {
        setGroupId(props.sideBarCurrentId);
        props.handleInitializeGroupModal(props.sideBarCurrentId, false, props.isAutoGroup);
      } else {
        setGroupType(SUB_GROUP_TYPE.MANUAL);
      }
    }
    return () => {
      document.body.className = document.body.className.replace('modal-open', '');
      setFirst(false);
      updateStateSession(FSActionTypeScreen.RemoveSession);
      props.reset();
    };
  }, []);

  const renderComponentInputSearch = () => {
    return (
      <>
        {groupType === SUB_GROUP_TYPE.MANUAL && !props.popout && (
          <div className="popup-esr2 popup-esr3 popup-employee-height-auto">
            <div className="popup-esr2-content">
              <div className="modal-header">
                <div className="left">
                  <div className="popup-button-back">
                    {/* <a
                      className={props.popout ? 'icon-small-primary icon-return-small' : 'icon-small-primary icon-return-small disable'}
                      onClick={props.popout ? handleBackPopup : e => e.preventDefault()}
                    /> */}
                    <a className="icon-small-primary icon-return-small disable" />
                    <span className="text">
                      <img className="icon-popup-big" src="../../content/images/ic-popup-ttle-group-user.svg" />
                      {modalMode === MY_GROUP_MODES.MODE_EDIT_GROUP
                        ? translate('employees.group.group-modal-add-edit-my-group.edit_title')
                        : translate('employees.group.group-modal-add-edit-my-group.title')}
                    </span>
                  </div>
                </div>
                {showModal && (
                  <div className="right">
                    <a className="icon-small-primary icon-link-small" onClick={openNewWindow} />
                    <a className="icon-small-primary icon-close-up-small line" onClick={handleClosePopup} />
                  </div>
                )}
              </div>
              <div className="popup-esr2-body">
                <div className="row break-row">
                  <div className="col-lg-6 form-group common">
                    <label>
                      {translate('employees.group.group-modal-add-edit-my-group.group-title')}
                      <a className="label-red">{translate('employees.group.group-modal-add-edit-my-group.required')}</a>
                    </label>
                    <div className={getErrorInfo('groupName') ? "input-common-wrap error" : "input-common-wrap"}>
                      <input
                        className="input-normal"
                        type="text"
                        value={groupName}
                        maxLength={50}
                        placeholder={translate('employees.group.group-modal-add-edit-my-group.group-name-placeholder')}
                        onChange={handleGroupNameChange}
                        autoFocus
                      />
                      {getErrorInfo('groupName') && (
                        <span className="messenger error-validate-msg">{translate(`messages.${getErrorInfo('groupName').errorCode}`)}</span>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-6 form-group common">
                    <label>{translate('employees.group.group-modal-add-edit-my-group.group_type')}</label>
                    <div className="wrap-check-radio version2">
                      <p className="radio-item">
                        <input
                          type="radio"
                          id="radio106"
                          name="radio-group6"
                          value={SUB_GROUP_TYPE.MANUAL}
                          checked={isAutoGroup === false}
                          onChange={handleOptionChange}
                        />
                        <label htmlFor="radio106">{translate('employees.group.group-modal-add-edit-my-group.radio-manual')}</label>
                      </p>
                      <p className="radio-item">
                        <input
                          type="radio"
                          id="radio107"
                          name="radio-group7"
                          value={SUB_GROUP_TYPE.AUTO}
                          checked={isAutoGroup === true}
                          onChange={handleOptionChange}
                        />
                        <label htmlFor="radio107">{translate('employees.group.group-modal-add-edit-my-group.radio-auto')}</label>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="user-popup-form-bottom">
                <button className="button-blue button-form-register " onClick={handleSubmit}>
                  {modalMode === MY_GROUP_MODES.MODE_EDIT_GROUP
                    ? translate('employees.group.group-modal-add-edit-my-group.button-edit')
                    : translate('employees.group.group-modal-add-edit-my-group.button-create')}
                </button>
              </div>
            </div>
          </div>
        )}

        {groupType === SUB_GROUP_TYPE.MANUAL && props.popout && (
          <div className="modal popup-esr popup-esr4 user-popup-page popup-align-right show" id="popup-esr" aria-hidden="true">
            <div className={showModal ? "modal-dialog form-popup" : "form-popup"}>
              <div className="modal-content">
                <div className="modal-header">
                  <div className="left">
                    <div className="popup-button-back">
                      {/* <a
                        className={props.popout ? 'icon-small-primary icon-return-small' : 'icon-small-primary icon-return-small disable'}
                        onClick={props.popout ? handleBackPopup : e => e.preventDefault()}
                      /> */}
                      <a className="icon-small-primary icon-return-small disable" />
                      <span className="text">
                        <img className="icon-group-user" src="../../content/images/ic-popup-ttle-group-user.svg" />
                        {modalMode === MY_GROUP_MODES.MODE_EDIT_GROUP
                          ? translate('employees.group.group-modal-add-edit-my-group.edit_title')
                          : translate('employees.group.group-modal-add-edit-my-group.title')}
                      </span>
                    </div>
                  </div>
                  {showModal && (
                    <div className="right">
                      <a className="icon-small-primary icon-link-small" onClick={openNewWindow} />
                      <a className="icon-small-primary icon-close-up-small line" onClick={handleClosePopup} />
                    </div>
                  )}
                </div>
                <div className="modal-body style-3">
                  <div className="popup-content max-height-auto style-3">
                    <div className="user-popup-form">
                      <form>
                        <div className="row break-row">
                          <div className="col-lg-6 form-group common">
                            <label>
                              {translate('employees.group.group-modal-add-edit-my-group.group-title')}
                              <a className="label-red">{translate('employees.group.group-modal-add-edit-my-group.required')}</a>
                            </label>
                            <div className={getErrorInfo('groupName') ? "input-common-wrap error" : "input-common-wrap"}>
                              <input
                                className="input-normal"
                                type="text"
                                value={groupName}
                                placeholder={translate('employees.group.group-modal-add-edit-my-group.group-name-placeholder')}
                                maxLength={50}
                                onChange={handleGroupNameChange}
                                autoFocus
                              />
                              {getErrorInfo('groupName') && (
                                <span className="messenger error-validate-msg">{translate(`messages.${getErrorInfo('groupName').errorCode}`)}</span>
                              )}
                            </div>
                          </div>
                          <div className="col-lg-6 form-group">
                            <label>{translate('employees.group.group-modal-add-edit-my-group.group_type')}</label>
                            <div className="wrap-check-radio version2">
                              <p className="radio-item">
                                <input
                                  type="radio"
                                  id="radio106"
                                  name="radio-group6"
                                  value={SUB_GROUP_TYPE.MANUAL}
                                  checked={isAutoGroup === false}
                                  onChange={handleOptionChange}
                                />
                                <label htmlFor="radio106">{translate('employees.group.group-modal-add-edit-my-group.radio-manual')}</label>
                              </p>
                              <p className="radio-item">
                                <input
                                  type="radio"
                                  id="radio107"
                                  name="radio-group7"
                                  value={SUB_GROUP_TYPE.AUTO}
                                  checked={isAutoGroup === true}
                                  onChange={handleOptionChange}
                                />
                                <label htmlFor="radio107">{translate('employees.group.group-modal-add-edit-my-group.radio-auto')}</label>
                              </p>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                <div className="user-popup-form-bottom">
                  <button className="button-blue button-form-register " onClick={handleSubmit}>
                    {modalMode === MY_GROUP_MODES.MODE_EDIT_GROUP
                      ? translate('employees.group.group-modal-add-edit-my-group.button-edit')
                      : translate('employees.group.group-modal-add-edit-my-group.button-create')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {groupType === SUB_GROUP_TYPE.AUTO && (
          <div className="modal popup-esr popup-esr4 user-popup-page popup-align-right show" id="popup-esr" aria-hidden="true">
            <div className={showModal ? "modal-dialog form-popup" : "form-popup"}>
              <div className="modal-content">
                <div className="modal-header">
                  <div className="left">
                    <div className="popup-button-back">
                      {/* <a
                        className={props.popout ? 'icon-small-primary icon-return-small' : 'icon-small-primary icon-return-small disable'}
                        onClick={props.popout ? handleBackPopup : e => e.preventDefault()}
                      /> */}
                      <a className="icon-small-primary icon-return-small disable" />
                      <span className="text">
                        <img className="icon-group-user" src="../../content/images/ic-popup-ttle-group-user.svg" />
                        {modalMode === MY_GROUP_MODES.MODE_EDIT_GROUP
                          ? translate('employees.group.group-modal-add-edit-my-group.edit_title')
                          : translate('employees.group.group-modal-add-edit-my-group.title')}
                      </span>
                    </div>
                  </div>
                  {showModal && (
                    <div className="right">
                      <a className="icon-small-primary icon-link-small" onClick={openNewWindow} />
                      <a className="icon-small-primary icon-close-up-small line" onClick={handleClosePopup} />
                    </div>
                  )}
                </div>
                <div className="modal-body style-3">
                  <div className="popup-content max-height-auto style-3">
                    <div className="user-popup-form">
                    {props.errorValidates && props.errorValidates.length > 0 && getErrorInfo('searchCondition') && (
                    <BoxMessage messageType={MessageType.Error} message={translate(`messages.${getErrorInfo('searchCondition').errorCode}`)} />
                  )}
                      <form>
                        {renderListUpdateTime()}
                        <div className="row break-row">
                          <div className="col-lg-6 form-group common">
                            <label>
                              {translate('employees.group.group-modal-add-edit-my-group.group-title')}
                              <a className="label-red">{translate('employees.group.group-modal-add-edit-my-group.required')}</a>
                            </label>
                            <div className={getErrorInfo('groupName') ? "input-common-wrap error" : "input-common-wrap"}>
                              <input
                                className="input-normal"
                                type="text"
                                value={groupName}
                                placeholder={translate('employees.group.group-modal-add-edit-my-group.group-name-placeholder')}
                                maxLength={50}
                                onChange={handleGroupNameChange}
                                autoFocus
                              />
                              {getErrorInfo('groupName') && (
                                <span className="messenger error-validate-msg">{translate(`messages.${getErrorInfo('groupName').errorCode}`)}</span>
                              )}
                            </div>
                          </div>
                          <div className="col-lg-6 form-group">
                            <label>{translate('employees.group.group-modal-add-edit-my-group.group_type')}</label>
                            <div className="wrap-check-radio version2">
                              <p className="radio-item">
                                <input
                                  type="radio"
                                  id="radio132"
                                  name="radio-group10"
                                  value={SUB_GROUP_TYPE.MANUAL}
                                  checked={isAutoGroup === false}
                                  onChange={handleOptionChange}
                                />
                                <label htmlFor="radio132">{translate('employees.group.group-modal-add-edit-my-group.radio-manual')}</label>
                              </p>
                              <p className="radio-item">
                                <input
                                  type="radio"
                                  id="radio131"
                                  name="radio-group11"
                                  value={SUB_GROUP_TYPE.AUTO}
                                  checked={isAutoGroup === true}
                                  onChange={handleOptionChange}
                                />
                                <label htmlFor="radio131">{translate('employees.group.group-modal-add-edit-my-group.radio-auto')}</label>
                              </p>
                            </div>
                          </div>
                          {isAutoGroup && (
                            <div className="col-lg-6 break-line form-group">
                              <div className="setting-search-conditions">
                                <label htmlFor="input-common">
                                  {translate('employees.group.group-modal-add-edit-my-group.auto-group-condition-search-title')}
                                </label>
                                <button onClick={handleDisplaySetting} className="button-primary button-activity-registration">
                                  {translate('employees.group.group-modal-add-edit-my-group.setting-search-condition')}
                                </button>
                              </div>
                              <div className="search-conditions float-left w-100">
                                <p className="check-box-item">
                                  <label className="icon-check">
                                    <input
                                      type="checkbox"
                                      name="isOverWrite"
                                      checked={isOverWrite}
                                      onChange={() => setIsOverWrite(!isOverWrite)}
                                    />
                                    <i /> {translate('employees.group.group-modal-add-edit-my-group.is-overwrite')}
                                  </label>
                                </p>
                                {saveConditionSearch &&
                                  saveConditionSearch.map((item, index) => (
                                    <DynamicControlField
                                      key={index}
                                      isFocus={index === 0 && first}
                                      elementStatus={getDataStatusControl(item)}
                                      fieldInfo={item}
                                      className={'col-lg-12 form-group'}
                                      updateStateElement={updateStateField}
                                      errorInfo={getErrorInfo(item.fieldName)}
                                    />
                                  ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                <div className="user-popup-form-bottom">
                  <button className="button-blue button-form-register " onClick={handleSubmit}>
                    {modalMode === MY_GROUP_MODES.MODE_EDIT_GROUP
                      ? translate('employees.group.group-modal-add-edit-my-group.button-edit')
                      : translate('employees.group.group-modal-add-edit-my-group.button-create')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="modal-backdrop show" />
      </>
    );
  };

  const renderComponentSettingSearch = () => {
    return (
      <>
        <div className="modal popup-esr popup-esr4 user-popup-page popup-align-right show" id="popup-esr" aria-hidden="true">
          <div className={showModal ? 'modal-dialog form-popup' : 'form-popup'}>
            <div className="modal-content">
              <div className="modal-header">
                <div className="left">
                  <div className="popup-button-back">
                    <a
                      className={props.popout ? 'icon-small-primary icon-return-small' : 'icon-small-primary icon-return-small disable'}
                      onClick={props.popout ? handleBackPopup : e => e.preventDefault()}
                    />
                    <span className="text">
                      <img className="icon-group-user" src="../../content/images/ic-popup-ttle-group-user.svg" />
                      {modalMode === MY_GROUP_MODES.MODE_EDIT_GROUP
                        ? translate('employees.group.group-modal-add-edit-my-group.edit_title')
                        : translate('employees.group.group-modal-add-edit-my-group.title')}
                    </span>
                  </div>
                </div>
                {showModal && (
                  <div className="right">
                    <a className="icon-small-primary icon-link-small" onClick={openNewWindow} />
                    <a className="icon-small-primary icon-close-up-small line" onClick={handleClosePopup} />
                  </div>
                )}
              </div>

              <div className="modal-body style-3">
                <div className="edit-popup-content-common popup-content padding-0 style-3" ref={dropBody}>
                  <div className="user-popup-form">
                    <form className="add-popup">
                      <div className="row break-row">
                        <div className="col-lg-8 form-group">
                          <label>
                            {translate('employees.group.group-modal-add-edit-my-group.group-title')}
                            <a className="label-red">{translate('employees.group.group-modal-add-edit-my-group.required')}</a>
                          </label>
                          <input
                            className="input-normal disable"
                            type="text"
                            placeholder={translate('employees.group.group-modal-add-edit-my-group.group-name-placeholder')}
                            value={groupName}
                            disabled={true}
                          />
                        </div>
                        <div className="col-lg-4 form-group">
                          <label>{translate('employees.group.group-modal-add-edit-my-group.group_type')}</label>
                          <div className="wrap-check-radio version2">
                            <p className="radio-item">
                              <input type="radio" id="radio132" name="radio-group10" disabled />
                              <label htmlFor="radio132">{translate('employees.group.group-modal-add-edit-my-group.radio-manual')}</label>
                            </p>
                            <p className="radio-item">
                              <input type="radio" id="radio131" name="radio-group10" defaultChecked disabled />
                              <label htmlFor="radio131">{translate('employees.group.group-modal-add-edit-my-group.radio-auto')}</label>
                            </p>
                          </div>
                        </div>
                        <div className="col-lg-8 break-line form-group">
                          <div className="setting-search-conditions">
                            <label htmlFor="input-common">
                              {translate('employees.group.group-modal-add-edit-my-group.auto-group-condition-search-title')}
                            </label>
                            <a className="button-primary button-activity-registration disable">
                              {translate('employees.group.group-modal-add-edit-my-group.setting-search-condition')}
                            </a>
                          </div>
                          <div className="search-conditions float-left w-100">
                            <p className="check-box-item">
                              <label className="icon-check">
                                <input type="checkbox" checked={isOverWrite} />
                                <i /> {translate('employees.group.group-modal-add-edit-my-group.is-overwrite')}
                              </label>
                            </p>
                            {listFieldSearch &&
                              listFieldSearch.map((item, index) => {
                                return (
                                  !item.disableDisplaySearch &&
                                <DynamicControlField
                                  key={index}
                                  belong={FIELD_BELONG.EMPLOYEE}
                                  className={'col-lg-12 form-group'}
                                  fieldInfo={item}
                                  isDisabled={true}
                                  isDnDAddField={true}
                                  isDnDMoveField={true}
                                  moveFieldCard={onMoveField}
                                />)
                              })}
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
                <DynamicSearchConditionListComponent
                  handleCloseSettingField={handleCloseSettingField}
                  handleUpdateSettingField={handleUpdateSettingField}
                  changeListFieldChosen={changeListFieldChosen}
                  customFieldsInfo={customFieldsInfo}
                  listFieldSearch={listFieldSearch}
                  iconFunction={iconFunction}
                  fieldBelong={FIELD_BELONG.EMPLOYEE}
                  employeeLayout={props.employeeLayout}
                />
              </div>
              <div className="user-popup-form-bottom">
                <a className="button-blue button-form-register disable">
                  {modalMode === MY_GROUP_MODES.MODE_EDIT_GROUP
                    ? translate('employees.group.group-modal-add-edit-my-group.button-edit')
                    : translate('employees.group.group-modal-add-edit-my-group.button-create')}
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-backdrop show" />
      </>
    );
  };

  if (props.sideBarCurrentId && !props.group) return <></>;

  if (showModal) {
    return (
      <div className="wrap-card">
        <Modal isOpen fade toggle={() => { }} backdrop id="popup-field-search" autoFocus zIndex="auto">
          {!showCustomField && renderComponentInputSearch()}
          {showCustomField && renderComponentSettingSearch()}
        </Modal>
      </div>
    );
  } else {
    if (props.popout) {
      return (
        <div className="wrap-card">
          {!showCustomField && renderComponentInputSearch()}
          {showCustomField && renderComponentSettingSearch()}
        </div>
      );
    } else {
      return <></>;
    }
  }
};

const mapStateToProps = ({ applicationProfile, groupModal }: IRootState) => ({
  tenant: applicationProfile.tenant,
  modalAction: groupModal.modalAction,
  customFields: groupModal.customFields,
  group: groupModal.group,
  searchConditions: groupModal.searchConditions,
  listUpdateTime: groupModal.listUpdateTime,
  errorValidates: groupModal.errorItems
});

const mapDispatchToProps = {
  reset,
  handleInitializeGroupModal,
  handleCreateGroup,
  handleUpdateGroup,
  startExecuting
};

export default connect<IAddEditMyGroupModalStateProps, IAddEditMyGroupModalDispatchProps, IAddEditMyGroupModalOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(AddEditMyGroupModal);
